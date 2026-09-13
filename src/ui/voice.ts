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
 *
 * Four modes. Freestyle is an open conversation; the three Teile mirror the
 * telc oral exam — einander kennenlernen, über ein Thema sprechen, gemeinsam
 * etwas planen — because that is the shape the exam actually takes, and
 * practising it is different from just chatting.
 */

/** Ids the token endpoint accepts. Order matches the labels in i18n. */
const SCENARIOS = ["freestyle", "teil1", "teil2", "teil3"] as const;
type Scenario = (typeof SCENARIOS)[number];

const SCENARIO_KEY = "dd.voiceScenario";

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

function storedScenario(): Scenario {
  try {
    const saved = localStorage.getItem(SCENARIO_KEY);
    if (saved && (SCENARIOS as readonly string[]).includes(saved)) return saved as Scenario;
  } catch {
    /* private mode, or storage switched off */
  }
  return "freestyle";
}

function rememberScenario(id: Scenario): void {
  try {
    localStorage.setItem(SCENARIO_KEY, id);
  } catch {
    /* not worth telling anyone about */
  }
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
  let scenario: Scenario = storedScenario();

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

  const modeButtons = SCENARIOS.map((id, index) =>
    h(
      "button",
      { type: "button", "aria-pressed": String(id === scenario) },
      s.voiceModes[index] ?? id
    )
  );
  const modes = h(
    "div",
    { class: "segmented voice__modes", role: "group", "aria-label": s.voiceModeLabel },
    ...modeButtons
  );
  const modeHint = h("p", { class: "voice__modehint" });

  const showMode = (): void => {
    const index = SCENARIOS.indexOf(scenario);
    modeButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    modeHint.textContent = s.voiceModeHints[index] ?? "";
  };

  modeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // Changing mode mid-call would mean a new session and a new prompt; the
      // buttons are disabled while one is up, so this only fires when idle.
      scenario = SCENARIOS[index] ?? "freestyle";
      rememberScenario(scenario);
      showMode();
    });
  });

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
      modes,
      modeHint,
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
    for (const button of modeButtons) button.setAttribute("disabled", "true");
    queueMicrotask(() => overlay.root.querySelector<HTMLElement>(".panel__close")?.focus());
    return overlay;
  }

  /* --------------------------------------------------------- the call */

  async function begin(): Promise<void> {
    if (session || closed) return;
    setState("connecting");
    picker.setAttribute("disabled", "true");
    for (const button of modeButtons) button.setAttribute("disabled", "true");

    try {
      session = await startVoice({
        // Level drives how hard the tutor pitches it. Without one chosen we
        // follow the exam the Teile are modelled on and assume B1.
        level: level ?? "B1",
        target: level === "B2" ? null : "B2",
        voice: picker.value,
        scenario,

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
          for (const button of modeButtons) button.removeAttribute("disabled");
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

  showMode();
  for (const line of transcript) bubble(line.role, line.text);

  queueMicrotask(() => orb.focus());
  return overlay;
}
