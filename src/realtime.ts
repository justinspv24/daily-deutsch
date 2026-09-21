import { supabase } from "./auth";
import { VOICE_ENABLED } from "./config";
import type { AgendaDigest } from "./agenda";

/**
 * Client half of voice mode — a live, two-way audio conversation with the
 * teacher over Gemini's Live API.
 *
 * The shape is different from /api/ai and worth understanding before changing
 * anything here. With the chat, every turn passes through our own server. Here
 * the browser opens a WebSocket straight to Google and streams microphone audio
 * into it continuously; our server is involved exactly once, to mint the
 * short-lived token that opens the socket. That is what makes it feel like a
 * phone call instead of a walkie-talkie — nothing waits for a round trip
 * through us — and it is also why the daily limit is counted in sessions
 * rather than turns.
 *
 * Audio in is PCM 16-bit mono at 16 kHz; audio out is the same at 24 kHz.
 * Those two numbers are fixed by the API, not by us.
 */

const INPUT_RATE = 16_000;
const OUTPUT_RATE = 24_000;
const SOCKET_BASE =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

export type VoiceState = "idle" | "connecting" | "listening" | "speaking";

export type VoiceErrorCode =
  | "ai_disabled"
  | "misconfigured"
  | "key_required"
  | "sign_in_required"
  | "daily_limit"
  | "mic_denied"
  | "unsupported"
  | "offline"
  | "failed";

export class VoiceError extends Error {
  constructor(
    readonly code: VoiceErrorCode,
    message?: string
  ) {
    super(message ?? code);
    this.name = "VoiceError";
  }
}

/**
 * One structured report from the tutor, as the model sent it.
 *
 * `args` is whatever the model chose to put in the call and is deliberately not
 * validated here: this module's job is to get it off the socket and answer
 * promptly, and the classroom is the only thing that knows what a well-formed
 * report looks like. Treat it the way you would treat a form the learner filled
 * in — every field optional, every field possibly nonsense.
 */
export interface VoiceToolCall {
  readonly id: string;
  readonly name: string;
  readonly args: Record<string, unknown>;
}

export interface VoiceHandlers {
  /** Connection/turn state, for the orb. */
  onState(state: VoiceState): void;
  /** Growing transcript of what the learner is saying. `final` closes the bubble. */
  onLearner(text: string, final: boolean): void;
  /** Growing transcript of what the teacher is saying. */
  onTeacher(text: string, final: boolean): void;
  /**
   * The teacher has stopped speaking and everything queued has been heard.
   *
   * `onState("listening")` says almost the same thing, but not quite: it also
   * fires when the learner interrupts. A caller driving the conversation needs
   * the narrower signal — the floor is now free — to know when its next
   * instruction can be sent without talking over the tutor.
   */
  onTurnEnd?(): void;
  /**
   * Setup has been acknowledged and the socket will now accept turns.
   *
   * `startVoice` resolves earlier than this — as soon as the setup frame has
   * been *sent* — so a caller that queues its own turns has to wait for this
   * before sending any, or the first one races the handshake it depends on.
   */
  onReady?(): void;
  /**
   * The tutor has reported something structured — a correction it is about to
   * speak, an answer it has just heard.
   *
   * This runs while the tutor is mute. Function calling on this model is
   * synchronous only: it produces no further audio until the reply is on the
   * wire, and there is no asynchronous mode to escape into. So the handler must
   * be synchronous and cheap — render, queue, return. Anything that awaits (a
   * database write, a network call, a re-render that forces layout) belongs
   * after the return, because every millisecond spent in here is silence the
   * learner is sitting in.
   *
   * Whatever object it returns becomes the function's result and is added to
   * the conversation, so it is also the way to answer the tutor back. Returning
   * nothing sends `{ ok: true }`.
   */
  onToolCall?(call: VoiceToolCall): Record<string, unknown> | void;
  /** Session ended — by the learner, by the clock, or by an error. */
  onEnd(error: VoiceError | null): void;
}

export interface VoiceOptions extends VoiceHandlers {
  level: string;
  /** Where the learner is heading; lets the tutor stretch them a little. */
  target: string | null;
  voice: string;
  scenario: string;
  /**
   * The shape of today's class — theme, grammar points, the day's words as
   * cues, and how much of each there is. It goes into the system prompt the
   * server composes, so the tutor can open by saying what the hour holds and
   * keep one thread across forty minutes.
   *
   * It carries no answers, by construction: `digestOf` withholds meanings,
   * plurals and table cells precisely because a tutor that knows an answer
   * eventually says it. Sending the whole agenda instead would be one line
   * shorter and would undo the entire arrangement.
   */
  plan?: AgendaDigest | null;
  /**
   * Replaces the opening turn the server composed. The classroom drives its own
   * opening, so the tutor starts by teaching rather than by making
   * conversation. `null` opens the call silently.
   */
  opener?: string | null;
  /**
   * Whether the microphone starts closed. The classroom opens muted and unmutes
   * only once the first thing has been read out; setting it here rather than on
   * the returned session closes the window between the tap starting and the
   * caller getting a chance to shut it.
   */
  muted?: boolean;
}

export interface VoiceSession {
  stop(): void;
  /** Seconds since the call connected. There is no limit; this is a clock, not a countdown. */
  elapsed(): number;
  /**
   * Send one user turn and let the tutor answer it. This is how the classroom
   * drives the lesson: the text is a stage direction the tutor reads and acts
   * on, not something the learner said.
   */
  say(text: string): void;
  /**
   * Stop or resume sending microphone audio. While a question is being read
   * out the learner's side is closed, so a cough or a passing lorry cannot be
   * taken for an answer.
   */
  setMuted(muted: boolean): void;
}

interface TokenResponse {
  token: string;
  model: string;
  voice: string;
  scenario: string;
  /** When the token stops being valid for reconnects; a new one is minted after that. */
  expiresAt: string;
  /**
   * The setup config, composed server-side and sent on verbatim. It carries the
   * teacher's instructions, so it is built from the learner's level rather than
   * hardcoded in this bundle.
   */
  config: Record<string, unknown>;
  /** One user turn sent right after setup, so the tutor has something to answer. */
  opener: string;
}

/** Whether the interface should offer voice mode at all. */
export function voiceAvailable(): boolean {
  return VOICE_ENABLED;
}

/** Whether this browser can do the audio work. */
export function voiceSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.AudioContext === "function" &&
    typeof window.WebSocket === "function" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export async function startVoice(options: VoiceOptions): Promise<VoiceSession> {
  if (!voiceAvailable()) throw new VoiceError("ai_disabled");
  if (!voiceSupported()) throw new VoiceError("unsupported");

  const credentials = await mintToken(options);
  const microphone = await openMicrophone();

  try {
    return await connect(credentials, microphone, options);
  } catch (error) {
    microphone.stop();
    throw error;
  }
}

/* --------------------------------------------------------------- the token */

async function mintToken(options: VoiceOptions): Promise<TokenResponse> {
  const db = supabase();
  const token = db ? (await db.auth.getSession()).data.session?.access_token : null;
  if (!token) throw new VoiceError("sign_in_required");

  let response: Response;
  try {
    response = await fetch("/api/realtime-token", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({
        level: options.level,
        target: options.target,
        voice: options.voice,
        scenario: options.scenario,
        // The server re-validates every field of this rather than trusting it.
        // It is the learner's own plan on the learner's own key, so this is
        // not a trust boundary in the usual sense — but it ends up inside a
        // system prompt, and a string that ends up in a system prompt gets
        // checked wherever it came from.
        plan: options.plan ?? null
      })
    });
  } catch {
    throw new VoiceError("offline");
  }

  if (response.ok) return (await response.json()) as TokenResponse;

  const detail = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  const code: VoiceErrorCode =
    detail.error === "ai_disabled" ||
    detail.error === "misconfigured" ||
    detail.error === "key_required" ||
    detail.error === "sign_in_required" ||
    detail.error === "daily_limit"
      ? detail.error
      : "failed";
  throw new VoiceError(code, detail.message);
}

/* ---------------------------------------------------------- the microphone */

interface Microphone {
  readonly context: AudioContext;
  /** Start handing 16-bit frames to `sink`. */
  pipe(sink: (frame: Int16Array) => void): Promise<void>;
  stop(): void;
}

/**
 * An AudioWorklet that forwards raw mono frames to the main thread. It is
 * created from a blob rather than a file so the bundler has nothing to wire up.
 */
const WORKLET_SOURCE = `
class TapProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel && channel.length) this.port.postMessage(new Float32Array(channel));
    return true;
  }
}
registerProcessor('tap', TapProcessor);
`;

async function openMicrophone(): Promise<Microphone> {
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
  } catch {
    throw new VoiceError("mic_denied");
  }

  // Asking for the context at 16 kHz lets the browser resample for us, which it
  // does better than we would by hand.
  const context = new AudioContext({ sampleRate: INPUT_RATE });
  const source = context.createMediaStreamSource(stream);
  let node: AudioNode | null = null;

  const stop = (): void => {
    try {
      node?.disconnect();
      source.disconnect();
    } catch {
      /* already torn down */
    }
    for (const track of stream.getTracks()) track.stop();
    void context.close().catch(() => undefined);
  };

  const pipe = async (sink: (frame: Int16Array) => void): Promise<void> => {
    if (context.state === "suspended") await context.resume();

    if (context.audioWorklet) {
      const url = URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: "text/javascript" }));
      try {
        await context.audioWorklet.addModule(url);
        const worklet = new AudioWorkletNode(context, "tap", {
          numberOfInputs: 1,
          numberOfOutputs: 0,
          channelCount: 1
        });
        worklet.port.onmessage = (event: MessageEvent<Float32Array>) => sink(toPcm16(event.data));
        source.connect(worklet);
        node = worklet;
        return;
      } catch {
        /* fall through to the older node below */
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    // Deprecated, but it is the only capture path on older Safari, and it runs
    // on the audio thread's terms rather than not at all.
    const processor = context.createScriptProcessor(2048, 1, 1);
    processor.onaudioprocess = (event) => sink(toPcm16(event.inputBuffer.getChannelData(0)));
    source.connect(processor);
    // Chrome stops calling onaudioprocess unless the node reaches a destination;
    // a zeroed gain keeps the tap alive without anyone hearing themselves.
    const mute = context.createGain();
    mute.gain.value = 0;
    processor.connect(mute);
    mute.connect(context.destination);
    node = processor;
  };

  return { context, pipe, stop };
}

/* ------------------------------------------------------------- the session */

async function connect(
  initial: TokenResponse,
  microphone: Microphone,
  options: VoiceOptions
): Promise<VoiceSession> {
  let credentials = initial;
  const player = new Player();
  const startedAt = Date.now();
  const keep = new KeepAlive();

  let socket: WebSocket;
  try {
    socket = await open(credentials.token);
  } catch {
    player.close();
    throw new VoiceError("offline");
  }

  let finished = false;
  let learnerLine = "";
  let teacherLine = "";
  /**
   * Google resets the connection roughly every ten minutes and says so first
   * (goAway). The session itself survives that: the server hands out a
   * resumption handle as it goes, and reopening the socket with the latest
   * handle picks the conversation up where it was. A call therefore has no
   * length limit — the learner sees a short "connecting" and carries on.
   */
  let resumeHandle: string | null = null;
  let reconnecting = false;
  let piped = false;
  // Closed while the tutor is talking, so its own voice and the room's noise
  // never arrive as an answer. The classroom opens it once the question has
  // landed, and simply leaves it open for the conversation stretches.
  let muted = options.muted === true;

  const send = (payload: unknown): void => {
    if (finished || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
  };

  const sendTurn = (text: string): void => {
    if (!text) return;
    send({ clientContent: { turns: [{ role: "user", parts: [{ text }] }], turnComplete: true } });
  };

  function end(error: VoiceError | null): void {
    if (finished) return;
    finished = true;
    try {
      socket.close();
    } catch {
      /* already closing */
    }
    microphone.stop();
    player.close();
    keep.release();
    options.onState("idle");
    options.onEnd(error);
  }

  /**
   * Reopen the socket on the same session. If the token has run out (they
   * last hours, so this is rare) a fresh one is minted first — that counts as
   * a new session for the day's tally, which is the honest thing to count.
   */
  async function reconnect(): Promise<void> {
    if (finished || reconnecting) return;
    reconnecting = true;
    options.onState("connecting");
    try {
      if (Date.parse(credentials.expiresAt) - Date.now() < 60_000) {
        credentials = await mintToken(options);
      }
      const next = await open(credentials.token);
      socket = next;
      wire(next);
      next.send(
        JSON.stringify({
          setup: {
            model: credentials.model,
            ...credentials.config,
            ...(resumeHandle ? { sessionResumption: { handle: resumeHandle } } : {})
          }
        })
      );
    } catch (error) {
      end(error instanceof VoiceError ? error : new VoiceError("offline"));
    } finally {
      reconnecting = false;
    }
  }

  function wire(ws: WebSocket): void {
    ws.onerror = () => {
      if (ws !== socket) return;
      void reconnect();
    };
    ws.onclose = (event) => {
      if (ws !== socket || finished) return;
      // 1007/1008 mean Google understood us and said no — a bad setup frame, a
      // dead token. That is not a network problem, and telling the learner to
      // check their wifi would send them looking in the wrong place.
      if ((event.code === 1007 || event.code === 1008) && event.reason) {
        return end(new VoiceError("failed", event.reason.split("\n")[0]?.slice(0, 200)));
      }
      // Anything else — the ten-minute reset, a dropped network — is a reason
      // to pick the session back up, not to hang up on the learner.
      void reconnect();
    };

    ws.onmessage = (event) => {
    void (async () => {
      const message = await parse(event.data);
      if (!message) return;

      if (message.setupComplete) {
        const resumed = resumeHandle !== null;
        // Kick the conversation off before the microphone opens. The model only
        // ever responds to a turn, and the learner should hear the teacher
        // first, not sit in silence wondering whether it worked. A caller that
        // drives the conversation itself passes its own opening turn, or null
        // for none at all. A resumed session already has its conversation and
        // needs no opener.
        if (!resumed) sendTurn(options.opener === undefined ? credentials.opener : (options.opener ?? ""));
        options.onState("listening");
        if (!piped) {
          piped = true;
          void microphone.pipe((frame) => {
            if (muted || socket.readyState !== WebSocket.OPEN) return;
            socket.send(
              JSON.stringify({
                realtimeInput: {
                  audio: { mimeType: `audio/pcm;rate=${INPUT_RATE}`, data: encode(frame) }
                }
              })
            );
          });
        }
        if (!resumed) options.onReady?.();
        return;
      }

      if (message.sessionResumptionUpdate?.resumable && message.sessionResumptionUpdate.newHandle) {
        resumeHandle = message.sessionResumptionUpdate.newHandle;
        return;
      }

      // A tool call is a frame of its own, not part of serverContent — which is
      // why this branch has to sit above the bail-out below rather than in the
      // tidier place among the content handlers. Down there every call would be
      // dropped in silence, and because function calling on this model is
      // blocking, a dropped call is not a lost report: it is a tutor that never
      // says another word for the rest of the class.
      //
      // The reply therefore goes out here, the moment the call lands, with
      // nothing awaited in between, on the socket that delivered it — the
      // handler below is required to be synchronous for the same reason.
      // After Google's ten-minute reset the ids belong to a
      // connection that no longer exists, so a call that arrives on the old
      // socket is let go rather than answered on the new one — a lost report
      // instead of a response the server cannot match to anything.
      if (message.toolCall) {
        if (ws !== socket) return;
        const responses = (message.toolCall.functionCalls ?? []).map((call) => {
          const reply = options.onToolCall?.({
            id: call.id ?? "",
            name: call.name ?? "",
            args: call.args ?? {}
          });
          return {
            id: call.id ?? "",
            name: call.name ?? "",
            response: isStruct(reply) ? reply : { ok: true }
          };
        });
        // Every call in the frame is answered, including one nobody could make
        // sense of, and all of them in a single response: the model may well
        // send a correction and an answer together, and answering only the
        // first leaves the rest pending, which wedges the session just as
        // thoroughly as answering none.
        if (responses.length) send({ toolResponse: { functionResponses: responses } });
        return;
      }

      // The server withdraws calls it made during a turn the learner talked
      // over. There is nothing to undo: reports are acted on the moment they
      // arrive, and a correction already on screen was a real correction of
      // something really said. Swallowing the frame is the whole handling.
      if (message.toolCallCancellation) return;

      const content = message.serverContent;
      if (!content) {
        // The server warns before it resets the connection. Reconnecting now,
        // on our own terms, beats waiting for the socket to drop mid-word.
        if (message.goAway) void reconnect();
        return;
      }

      if (content.interrupted) {
        player.flush();
        if (teacherLine) {
          options.onTeacher(teacherLine, true);
          teacherLine = "";
        }
        options.onState("listening");
      }

      if (content.inputTranscription?.text) {
        learnerLine += content.inputTranscription.text;
        options.onLearner(learnerLine, false);
      }

      if (content.outputTranscription?.text) {
        teacherLine += content.outputTranscription.text;
        options.onTeacher(teacherLine, false);
      }

      for (const part of content.modelTurn?.parts ?? []) {
        const inline = part.inlineData;
        if (!inline?.data || !inline.mimeType?.startsWith("audio/")) continue;
        options.onState("speaking");
        player.push(inline.data);
      }

      if (content.turnComplete) {
        if (learnerLine) {
          options.onLearner(learnerLine, true);
          learnerLine = "";
        }
        if (teacherLine) {
          options.onTeacher(teacherLine, true);
          teacherLine = "";
        }
        void player.drained().then(() => {
          if (finished) return;
          options.onState("listening");
          options.onTurnEnd?.();
        });
      }
    })();
    };
  }

  wire(socket);
  // Everything the session needs goes in the setup frame: the model, and the
  // config the server composed — teacher prompt, voice, transcription,
  // compression, resumption. The token itself only proves the learner is
  // allowed to be here.
  socket.send(JSON.stringify({ setup: { model: credentials.model, ...credentials.config } }));
  options.onState("connecting");
  keep.acquire(options.scenario === "class" ? "Daily Deutsch — Unterricht" : "Daily Deutsch — Sprachmodus", () => end(null));

  return {
    stop: () => end(null),
    elapsed: () => Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    say: (text) => sendTurn(text),
    setMuted: (next) => {
      muted = next;
    }
  };
}

/**
 * Open the socket. Ephemeral tokens go in `access_token` — confirmed against
 * the live endpoint; the constrained endpoint opens with it and rejects `key`.
 * One retry covers a flaky first connect.
 */
async function open(token: string): Promise<WebSocket> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await new Promise<WebSocket>((resolve, reject) => {
        const socket = new WebSocket(`${SOCKET_BASE}?access_token=${encodeURIComponent(token)}`);
        socket.binaryType = "arraybuffer";
        const settle = window.setTimeout(() => {
          socket.close();
          reject(new Error("timeout"));
        }, 10_000);
        socket.onopen = () => {
          window.clearTimeout(settle);
          socket.onerror = null;
          socket.onclose = null;
          resolve(socket);
        };
        socket.onerror = () => {
          window.clearTimeout(settle);
          reject(new Error("refused"));
        };
        socket.onclose = () => {
          window.clearTimeout(settle);
          reject(new Error("closed"));
        };
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("failed");
}

/* -------------------------------------------------------------- playback */

/**
 * Chunks arrive faster than they play, so each one is scheduled to start where
 * the previous one ends. `flush` drops everything still queued, which is what
 * makes interrupting the teacher feel instant.
 */
class Player {
  private readonly context = new AudioContext({ sampleRate: OUTPUT_RATE });
  private readonly playing = new Set<AudioBufferSourceNode>();
  private head = 0;
  /**
   * Playback goes through a real <audio> element rather than straight to the
   * context's destination. To the phone that is the difference between a web
   * page making noises and a media session: with an element playing, iOS and
   * Android keep the page's audio — and with it the microphone and the
   * socket — alive when the screen locks, the way they do for a call.
   */
  private readonly sink: MediaStreamAudioDestinationNode | null;
  private readonly element: HTMLAudioElement | null;

  constructor() {
    try {
      this.sink = this.context.createMediaStreamDestination();
      const element = document.createElement("audio");
      element.srcObject = this.sink.stream;
      element.setAttribute("playsinline", "true");
      element.autoplay = true;
      element.style.display = "none";
      document.body.append(element);
      void element.play().catch(() => undefined);
      this.element = element;
    } catch {
      this.sink = null;
      this.element = null;
    }
  }

  push(base64: string): void {
    const samples = decode(base64);
    if (!samples.length) return;

    const buffer = this.context.createBuffer(1, samples.length, OUTPUT_RATE);
    buffer.copyToChannel(samples, 0);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sink ?? this.context.destination);

    const start = Math.max(this.context.currentTime + 0.02, this.head);
    source.start(start);
    this.head = start + buffer.duration;

    this.playing.add(source);
    source.onended = () => this.playing.delete(source);
    if (this.context.state === "suspended") void this.context.resume();
  }

  /** Resolves once everything queued has finished sounding. */
  drained(): Promise<void> {
    const wait = Math.max(0, this.head - this.context.currentTime) * 1000;
    return new Promise((resolve) => window.setTimeout(resolve, wait + 60));
  }

  flush(): void {
    for (const source of this.playing) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    this.playing.clear();
    this.head = 0;
  }

  close(): void {
    this.flush();
    if (this.element) {
      this.element.pause();
      this.element.srcObject = null;
      this.element.remove();
    }
    void this.context.close().catch(() => undefined);
  }
}

/* ------------------------------------------------------------ keep-alive */

/**
 * What keeps a call going when the learner stops looking at it.
 *
 * Two mechanisms, for two different moments. A screen wake lock stops the
 * phone from locking itself while the call is up — most "it stopped" reports
 * are really the screen timing out. And a media session tells the OS this
 * page is playing something that matters, so that when the learner does lock
 * the phone on purpose the audio, the microphone and the socket are treated
 * like a phone call rather than a background tab. Its pause/stop buttons on
 * the lock screen hang up, which is the only honest thing they can do.
 */
class KeepAlive {
  private lock: WakeLockSentinel | null = null;
  private onVisible: (() => void) | null = null;

  acquire(title: string, onStop: () => void): void {
    const request = (): void => {
      if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
      navigator.wakeLock
        .request("screen")
        .then((lock) => {
          this.lock = lock;
        })
        .catch(() => undefined);
    };
    request();
    // The lock is released by the OS whenever the page is hidden; take it
    // back the moment the learner returns.
    this.onVisible = () => request();
    document.addEventListener("visibilitychange", this.onVisible);

    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title, artist: "Daily Deutsch" });
        navigator.mediaSession.playbackState = "playing";
        for (const action of ["pause", "stop"] as const) {
          navigator.mediaSession.setActionHandler(action, () => onStop());
        }
      } catch {
        /* an older browser without the API is fine */
      }
    }
  }

  release(): void {
    if (this.onVisible) document.removeEventListener("visibilitychange", this.onVisible);
    this.onVisible = null;
    void this.lock?.release().catch(() => undefined);
    this.lock = null;
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "none";
        for (const action of ["pause", "stop"] as const) navigator.mediaSession.setActionHandler(action, null);
      } catch {
        /* nothing to undo */
      }
    }
  }
}

/* ----------------------------------------------------------------- codecs */

function toPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, input[i] ?? 0));
    out[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return out;
}

function encode(frame: Int16Array): string {
  const bytes = new Uint8Array(frame.buffer, frame.byteOffset, frame.byteLength);
  let binary = "";
  // btoa wants a string, and spreading a large array blows the call stack.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

// The return type is left to inference on purpose: annotating it as a bare
// Float32Array widens the buffer parameter under TypeScript 5.7+, and
// copyToChannel will not take the widened form.
function decode(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

  // Little-endian 16-bit, and a stray odd byte would misalign every sample.
  const count = bytes.length >> 1;
  const view = new DataView(bytes.buffer, 0, count * 2);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i += 1) out[i] = view.getInt16(i * 2, true) / 0x8000;
  return out;
}

/* ------------------------------------------------------- message decoding */

interface ServerMessage {
  setupComplete?: unknown;
  goAway?: unknown;
  sessionResumptionUpdate?: { newHandle?: string; resumable?: boolean };
  /** The tutor is asking the app to run one of the functions it was declared. */
  toolCall?: { functionCalls?: Array<{ id?: string; name?: string; args?: Record<string, unknown> }> };
  /** Calls withdrawn because the learner interrupted the turn that made them. */
  toolCallCancellation?: { ids?: string[] };
  serverContent?: {
    modelTurn?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
    inputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
    interrupted?: boolean;
    turnComplete?: boolean;
  };
}

/**
 * Whether a handler's return value can go on the wire as a function result.
 *
 * The API wants a Struct there — a plain JSON object. An array would serialise
 * happily and then be rejected at the far end, which on a blocking call means a
 * silent tutor, so the array case is ruled out here rather than discovered
 * later. The guard also does the narrowing the optional handler's `void` return
 * needs under `strict`.
 */
function isStruct(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Frames arrive as text, Blob or ArrayBuffer depending on the browser. */
async function parse(data: unknown): Promise<ServerMessage | null> {
  try {
    let text: string;
    if (typeof data === "string") text = data;
    else if (data instanceof Blob) text = await data.text();
    else if (data instanceof ArrayBuffer) text = new TextDecoder().decode(data);
    else return null;
    return JSON.parse(text) as ServerMessage;
  } catch {
    return null;
  }
}
