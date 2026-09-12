import { supabase } from "./auth";
import { VOICE_ENABLED } from "./config";

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

export interface VoiceHandlers {
  /** Connection/turn state, for the orb. */
  onState(state: VoiceState): void;
  /** Growing transcript of what the learner is saying. `final` closes the bubble. */
  onLearner(text: string, final: boolean): void;
  /** Growing transcript of what the teacher is saying. */
  onTeacher(text: string, final: boolean): void;
  /** Session ended — by the learner, by the clock, or by an error. */
  onEnd(error: VoiceError | null): void;
}

export interface VoiceOptions extends VoiceHandlers {
  level: string;
  voice: string;
}

export interface VoiceSession {
  stop(): void;
  /** Seconds left before the token expires; the panel counts down with it. */
  secondsLeft(): number;
}

interface TokenResponse {
  token: string;
  model: string;
  voice: string;
  expiresAt: string;
  sessionSeconds: number;
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

  const credentials = await mintToken(options.level, options.voice);
  const microphone = await openMicrophone();

  try {
    return await connect(credentials, microphone, options);
  } catch (error) {
    microphone.stop();
    throw error;
  }
}

/* --------------------------------------------------------------- the token */

async function mintToken(level: string, voice: string): Promise<TokenResponse> {
  const db = supabase();
  const token = db ? (await db.auth.getSession()).data.session?.access_token : null;
  if (!token) throw new VoiceError("sign_in_required");

  let response: Response;
  try {
    response = await fetch("/api/realtime-token", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ level, voice })
    });
  } catch {
    throw new VoiceError("offline");
  }

  if (response.ok) return (await response.json()) as TokenResponse;

  const detail = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  const code: VoiceErrorCode =
    detail.error === "ai_disabled" || detail.error === "sign_in_required" || detail.error === "daily_limit"
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
  credentials: TokenResponse,
  microphone: Microphone,
  options: VoiceOptions
): Promise<VoiceSession> {
  const player = new Player();
  const deadline = Date.now() + credentials.sessionSeconds * 1000;

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

  const expiry = window.setTimeout(() => end(null), credentials.sessionSeconds * 1000);

  function end(error: VoiceError | null): void {
    if (finished) return;
    finished = true;
    window.clearTimeout(expiry);
    try {
      socket.close();
    } catch {
      /* already closing */
    }
    microphone.stop();
    player.close();
    options.onState("idle");
    options.onEnd(error);
  }

  socket.onerror = () => end(new VoiceError("offline"));
  socket.onclose = (event) => {
    // 1000 is a clean close, and we also treat our own teardown as clean.
    end(event.code === 1000 || finished ? null : new VoiceError("offline"));
  };

  socket.onmessage = (event) => {
    void (async () => {
      const message = await parse(event.data);
      if (!message) return;

      if (message.setupComplete) {
        options.onState("listening");
        void microphone.pipe((frame) => {
          if (socket.readyState !== WebSocket.OPEN) return;
          socket.send(
            JSON.stringify({
              realtimeInput: {
                audio: { mimeType: `audio/pcm;rate=${INPUT_RATE}`, data: encode(frame) }
              }
            })
          );
        });
        return;
      }

      const content = message.serverContent;
      if (!content) {
        // The server warns before it hangs up; treat it as the end of the call
        // rather than letting the socket drop from under the learner.
        if (message.goAway) end(null);
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
          if (!finished) options.onState("listening");
        });
      }
    })();
  };

  // The setup is deliberately thin: the token already carries the model, the
  // teacher prompt, the voice and the transcription settings, and the
  // constrained endpoint will reject anything that contradicts them.
  socket.send(JSON.stringify({ setup: { model: credentials.model } }));
  options.onState("connecting");

  return {
    stop: () => end(null),
    secondsLeft: () => Math.max(0, Math.round((deadline - Date.now()) / 1000))
  };
}

/**
 * Open the socket. Google has spelled the ephemeral-token parameter both ways
 * across versions, so if the first attempt is rejected before it opens we try
 * the other rather than telling the learner their microphone is broken.
 */
async function open(token: string): Promise<WebSocket> {
  const params = ["access_token", "key"];
  let lastError: unknown = null;

  for (const param of params) {
    try {
      return await new Promise<WebSocket>((resolve, reject) => {
        const socket = new WebSocket(`${SOCKET_BASE}?${param}=${encodeURIComponent(token)}`);
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

  push(base64: string): void {
    const samples = decode(base64);
    if (!samples.length) return;

    const buffer = this.context.createBuffer(1, samples.length, OUTPUT_RATE);
    buffer.copyToChannel(samples, 0);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);

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
    void this.context.close().catch(() => undefined);
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
  serverContent?: {
    modelTurn?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
    inputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
    interrupted?: boolean;
    turnComplete?: boolean;
  };
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
