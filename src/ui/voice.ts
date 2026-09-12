import { t } from "../i18n";
import {
  startVoice,
  VoiceError,
  voiceAvailable,
  voiceSupported,
  type VoiceSession,
  type VoiceState
} from "../realtime";
import type { Level } from "../types";
import { h, ICON_MIC, svgIcon } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/**
 * The "vv" panel — a spoken conversation with the teacher.
 *
 * This is a live call, not a walkie-talkie. One tap opens a socket to the model
 * and the microphone stays open: the learner talks, the teacher answers, and
 * either can interrupt the other. Tapping again hangs up. Both sides are
 * transcribed as they speak, because seeing what the teacher *heard* is half
 * the lesson — it is usually the moment a learner discovers that their "kann"
 * sounded like "kenn".
 *
 * The session is capped server-side, so the timer here is only a courtesy: it
 * tells the learner what the token already knows.
 */

/** Google's prebuilt voices. The character notes are the docs' own descriptors. */
const VOICES: ReadonlyArray<readonly [string, string]> = [
  ["Kore", "fest"], ["Puck", "munter"], ["Zephyr", "hell"], ["Charon", "sachlich"],
  ["Fenrir", "lebhaft"], ["Leda", "jugendlich"], ["Orus", "bestimmt"], ["Aoede", "leicht"],
  ["Callirrhoe", "gelassen"], ["Autonoe", "hell"], ["Enceladus", "behaucht"], ["Iapetus", "klar"],
  ["Umbriel", "gelassen"], ["Algieba", "weich"], ["Despina", "sanft"], ["Erinome", "klar"],
  ["Algenib", "rau"], ["Rasalgethi", "kundig"], ["Laomedeia", "munter"], ["Achernar", "sanft"],
  ["Alnilam", "fest"], ["Schedar", "gleichmäßig"], ["Gacrux", "reif"], ["Pulcherrima", "direkt"],
  ["Achird", "freundlich"], ["Zubenelgenubi", "locker"], ["Vindemiatrix", "mild"],
  ["Sadachbia", "lebhaft"], ["Sadaltager", "kundig"], ["Sulafat", "warm"]
];

const VOICE_KEY = "dd.voice";
const DEFAULT_VOICE = "Kore";

/** Kept for display only — each call starts the model with a clean memory. */
const transcript: Array<{ role: "user" | "assistant"; text: string }> = [];

function storedVoice(): string {
  try {
    const saved = localStorage.getItem(VOICE_KEY);
    if (saved && VOICES.some(([name]) => name === saved)) return saved;
  } catch {
    /* private mode, or storage switched off */
  }
  return DEFAULT_VOICE;
}

function rememberVoice(name: string): void {
  try {
    localStorage.setItem(VOICE_KEY, name);
  } catch {
    /* not worth telling anyone about */
  }
}

export function describeVoiceError(error: unknown): string {
  const s = t();
  if (!(error instanceof VoiceError)) return s.aiFailed;
  switch (error.code) {
    case "ai_disabled":
      return s.aiDisabled;
    case "sign_in_required":
      return s.aiSignInRequired;
    case "daily_limit":
      return s.aiDailyLimit;
    case "mic_denied":
      return s.voiceMicDenied;
    case "unsupported":
      return s.voiceUnsupported;
    case "offline":
      return s.aiOffline;
    default:
      return s.aiFailed;
  }
}

export function openVoice(level: Level | null): Overlay {
  const s = t();
  let session: VoiceSession | null = null;
  let state: VoiceState = "idle";
  let closed = false;
  let ticker: number | null = null;

  const overlay = openPanel({
    title: s.voiceTitle,
    badge: "vv",
    onClose: () => {
      closed = true;
      stopTicker();
      session?.stop();
      session = null;
    }
  });

  /* ------------------------------------------------------------- chrome */

  const picker = h("select", { class: "voice__picker", "aria-label": s.voiceVoiceLabel });
  for (const [name, character] of VOICES) {
    picker.append(h("option", { value: name }, `${name} · ${character}`));
  }
  picker.value = storedVoice();
  picker.addEventListener("change", () => rememberVoice(picker.value));

  const timer = h("span", { class: "voice__timer", role: "timer" });

  const orb = h(
    "button",
    { class: "orb", type: "button", "data-state": "idle", "aria-label": s.voiceIdle },
    h("span", { class: "orb__ring", "aria-hidden": "true" }),
    h("span", { class: "orb__ring orb__ring--2", "aria-hidden": "true" }),
    h("span", { class: "orb__core", "aria-hidden": "true" }, svgIcon(ICON_MIC, "microphone"))
  );

  const status = h("p", { class: "voice__status", role: "status" }, s.voiceIdle);
  const live = h("p", { class: "voice__live" });
  const stream = h("div", { class: "voice__stream" });

  overlay.body.append(
    h(
      "div",
      { class: "voice" },
      h(
        "div",
        { class: "voice__top" },
        h("span", { class: "kbdhint" }, s.voiceVoiceLabel),
        picker,
        timer
      ),
      orb,
      status,
      live,
      stream
    )
  );
  overlay.footer.append(h("span", { class: "kbdhint" }, s.voiceHint));

  /* -------------------------------------------------------------- render */

  const setState = (next: VoiceState, text?: string): void => {
    state = next;
    // The orb's CSS knows "thinking"; connecting is the same waiting shape.
    orb.dataset["state"] = next === "connecting" ? "thinking" : next;
    const label =
      text ??
      (next === "connecting"
        ? s.voiceConnecting
        : next === "listening"
          ? s.voiceListening
          : next === "speaking"
            ? s.voiceSpeaking
            : s.voiceIdle);
    status.textContent = label;
    orb.setAttribute("aria-label", label);
  };

  const bubble = (role: "user" | "assistant", text: string): HTMLElement => {
    const node = h("div", { class: "bubble", "data-role": role }, text);
    stream.append(node);
    stream.scrollTop = stream.scrollHeight;
    return node;
  };

  // One open bubble per speaker, rewritten as the transcript streams in.
  let learnerBubble: HTMLElement | null = null;
  let teacherBubble: HTMLElement | null = null;

  const stopTicker = (): void => {
    if (ticker !== null) window.clearInterval(ticker);
    ticker = null;
    timer.textContent = "";
  };

  const startTicker = (): void => {
    stopTicker();
    ticker = window.setInterval(() => {
      if (!session) return stopTicker();
      const left = session.secondsLeft();
      timer.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    }, 1000);
  };

  /* ------------------------------------------------------- can we do this */

  const blocker = !voiceAvailable() ? s.aiDisabled : !voiceSupported() ? s.voiceUnsupported : null;
  if (blocker) {
    setState("idle", blocker);
    orb.setAttribute("disabled", "true");
    picker.setAttribute("disabled", "true");
    queueMicrotask(() => overlay.root.querySelector<HTMLElement>(".panel__close")?.focus());
    return overlay;
  }

  /* --------------------------------------------------------- the call */

  async function begin(): Promise<void> {
    if (session || closed) return;
    setState("connecting");
    picker.setAttribute("disabled", "true");

    try {
      session = await startVoice({
        level: level ?? "A2",
        voice: picker.value,

        onState: (next) => {
          if (closed) return;
          // Don't let a late state message overwrite "idle" after hang-up.
          if (!session && next !== "idle") return;
          setState(next);
        },

        onLearner: (text, final) => {
          if (closed) return;
          live.textContent = final ? "" : text;
          if (!learnerBubble) learnerBubble = bubble("user", text);
          else learnerBubble.textContent = text;
          stream.scrollTop = stream.scrollHeight;
          if (final) {
            transcript.push({ role: "user", text });
            learnerBubble = null;
          }
        },

        onTeacher: (text, final) => {
          if (closed) return;
          if (!teacherBubble) teacherBubble = bubble("assistant", text);
          else teacherBubble.textContent = text;
          stream.scrollTop = stream.scrollHeight;
          if (final) {
            transcript.push({ role: "assistant", text });
            teacherBubble = null;
          }
        },

        onEnd: (error) => {
          session = null;
          stopTicker();
          learnerBubble = null;
          teacherBubble = null;
          live.textContent = "";
          if (closed) return;
          picker.removeAttribute("disabled");
          if (error) {
            const message = describeVoiceError(error);
            bubble("assistant", message).dataset["error"] = "true";
            setState("idle", message);
          } else {
            setState("idle", s.voiceEnded);
          }
        }
      });
      startTicker();
    } catch (error) {
      session = null;
      picker.removeAttribute("disabled");
      if (closed) return;
      const message = describeVoiceError(error);
      bubble("assistant", message).dataset["error"] = "true";
      setState("idle", message);
    }
  }

  orb.addEventListener("click", () => {
    if (state === "connecting") return;
    if (session) {
      session.stop();
      return;
    }
    void begin();
  });

  for (const line of transcript) bubble(line.role, line.text);

  queueMicrotask(() => orb.focus());
  return overlay;
}
