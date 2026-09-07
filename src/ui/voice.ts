import { AiError, aiAvailable, askVoice, type Turn } from "../ai";
import { getLang, t } from "../i18n";
import { describe } from "./chat";
import { h, ICON_MIC, svgIcon } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/**
 * The "vv" panel — a spoken conversation with the teacher.
 *
 * The browser does the listening (Web Speech recognition) and the talking
 * (speech synthesis); the model only ever sees text. One tap starts a turn:
 * listen → send → read the answer aloud → listen again, for a few turns,
 * until the learner closes the panel. Tapping while the teacher speaks
 * interrupts and listens.
 */

type State = "idle" | "listening" | "thinking" | "speaking";
type SpeechLang = "de-DE" | "en-US";

/** How many turns run hands-free after one tap before the orb asks for another. */
const HANDS_FREE_TURNS = 4;
/** The server keeps 24 turns; carrying twice that is plenty for context. */
const HISTORY_CAP = 48;
/** Longer utterances than this are read in sentence-sized pieces (Chrome cuts long ones off). */
const UTTERANCE_CHARS = 180;

/* The Web Speech recognition API is not in TypeScript's DOM library, and is
   still webkit-prefixed in Safari and Chrome, so the few members used here
   are declared locally. */
interface RecognitionAlternative {
  readonly transcript: string;
}
interface RecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: RecognitionAlternative;
}
interface RecognitionResultList {
  readonly length: number;
  readonly [index: number]: RecognitionResult;
}
interface RecognitionEvent {
  readonly resultIndex: number;
  readonly results: RecognitionResultList;
}
interface RecognitionErrorEvent {
  readonly error: string;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionConstructor = new () => Recognition;

function recognitionConstructor(): RecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
}

/** Best available voice for a language; null lets the browser pick by `lang`. */
function pickVoice(lang: SpeechLang): SpeechSynthesisVoice | null {
  const voices = synth()?.getVoices() ?? [];
  const prefix = lang.slice(0, 2);
  const candidates = voices.filter((voice) => voice.lang.replace("_", "-").toLowerCase().startsWith(prefix));
  if (!candidates.length) return null;
  const exact = candidates.filter((voice) => voice.lang.replace("_", "-").toLowerCase() === lang.toLowerCase());
  const pool = exact.length ? exact : candidates;
  // Cloud voices ("Google", "Natural", "Online") tend to sound far better than the local fallbacks.
  return pool.find((voice) => /natural|online|google|premium|enhanced/i.test(voice.name)) ?? pool[0] ?? null;
}

/**
 * The reply is German first, then a line starting "EN:" with the English.
 * Everything from that marker on is English, so each part gets the right voice.
 */
function splitReply(reply: string): { german: string; english: string } {
  const german: string[] = [];
  const english: string[] = [];
  let inEnglish = false;
  for (const raw of reply.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const match = /^(?:EN|English|Englisch)\s*:\s*(.*)$/i.exec(line);
    if (match) {
      inEnglish = true;
      if (match[1]) english.push(match[1]);
    } else if (inEnglish) english.push(line);
    else german.push(line);
  }
  return { german: german.join(" "), english: english.join(" ") };
}

/** Break a long text at sentence ends so no single utterance runs past the browser's limits. */
function pieces(text: string): string[] {
  if (text.length <= UTTERANCE_CHARS) return [text];
  const out: string[] = [];
  let current = "";
  for (const sentence of text.split(/(?<=[.!?…])\s+/)) {
    if (current && current.length + sentence.length + 1 > UTTERANCE_CHARS) {
      out.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) out.push(current);
  return out;
}

const history: Turn[] = [];

function remember(turn: Turn): void {
  history.push(turn);
  if (history.length > HISTORY_CAP) history.splice(0, history.length - HISTORY_CAP);
}

function forget(turn: Turn): void {
  const index = history.lastIndexOf(turn);
  if (index !== -1) history.splice(index, 1);
}

export function openVoice(): Overlay {
  const s = t();
  let state: State = "idle";
  let speechLang: SpeechLang = getLang() === "en" ? "en-US" : "de-DE";
  let recognition: Recognition | null = null;
  let closed = false;
  let unlocked = false;
  let handsFree = 0;
  let heard = "";
  let interim = "";

  const overlay = openPanel({
    title: s.voiceTitle,
    badge: "vv",
    onClose: () => {
      closed = true;
      state = "idle";
      const rec = recognition;
      recognition = null;
      rec?.abort();
      synth()?.cancel();
    }
  });

  /* which language the learner is speaking ------------------------------- */
  const langDe = h("button", { type: "button", "aria-pressed": String(speechLang === "de-DE") }, "DE");
  const langEn = h("button", { type: "button", "aria-pressed": String(speechLang === "en-US") }, "EN");
  const langGroup = h("div", { class: "segmented", role: "group", "aria-label": s.voiceSpeakIn }, langDe, langEn);
  const chooseLang = (next: SpeechLang): void => {
    speechLang = next;
    langDe.setAttribute("aria-pressed", String(next === "de-DE"));
    langEn.setAttribute("aria-pressed", String(next === "en-US"));
    if (state === "listening") {
      const rec = recognition;
      recognition = null;
      rec?.abort();
      listen();
    }
  };
  langDe.addEventListener("click", () => chooseLang("de-DE"));
  langEn.addEventListener("click", () => chooseLang("en-US"));

  /* the orb ---------------------------------------------------------------- */
  const orb = h(
    "button",
    { class: "orb", type: "button", "data-state": state, "aria-label": s.voiceIdle },
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
      h("div", { class: "voice__top" }, h("span", { class: "kbdhint" }, s.voiceSpeakIn), langGroup),
      orb,
      status,
      live,
      stream
    )
  );
  overlay.footer.append(h("span", { class: "kbdhint" }, s.voiceHint));

  const setState = (next: State, text?: string): void => {
    state = next;
    orb.dataset["state"] = next;
    const label =
      text ??
      (next === "listening"
        ? s.voiceListening
        : next === "thinking"
          ? s.thinking
          : next === "speaking"
            ? s.voiceSpeaking
            : s.voiceIdle);
    status.textContent = label;
    orb.setAttribute("aria-label", label);
  };

  const bubble = (role: Turn["role"], german: string, english = ""): HTMLElement => {
    const node = h("div", { class: "bubble", "data-role": role }, german);
    if (english) node.append(h("span", { class: "gloss" }, english));
    stream.append(node);
    stream.scrollTop = stream.scrollHeight;
    return node;
  };

  /* can this browser do it at all? ----------------------------------------- */
  const Recogniser = recognitionConstructor();
  const blocker = !aiAvailable() ? s.aiDisabled : !Recogniser ? s.voiceUnsupported : null;
  if (blocker) {
    setState("idle", blocker);
    orb.setAttribute("disabled", "true");
    queueMicrotask(() => overlay.root.querySelector<HTMLElement>(".panel__close")?.focus());
    return overlay;
  }
  // Chrome only lists voices after this event has fired once.
  synth()?.addEventListener("voiceschanged", () => undefined, { once: true });
  synth()?.getVoices();

  /* one turn --------------------------------------------------------------- */
  function listen(): void {
    if (closed) return;
    synth()?.cancel();
    const rec = new Recogniser!();
    recognition = rec;
    rec.lang = speechLang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    heard = "";
    interim = "";
    live.textContent = "";

    rec.onresult = (event) => {
      // Rebuild from the start every time: some Android builds re-deliver the
      // final result, and appending would send the sentence twice.
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result?.[0]?.transcript ?? "";
        if (result?.isFinal) finalText += text;
        else interimText += text;
      }
      heard = finalText.trim();
      interim = interimText.trim();
      live.textContent = `${heard} ${interim}`.trim();
    };
    rec.onerror = (event) => {
      if (recognition !== rec || event.error === "aborted") return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") setState("idle", s.voiceMicDenied);
      else if (event.error === "no-speech") setState("idle", s.voiceNoSpeech);
      else setState("idle", s.aiOffline);
    };
    rec.onend = () => {
      if (closed || recognition !== rec) return;
      recognition = null;
      if (state !== "listening") return;
      const text = `${heard} ${interim}`.trim();
      if (!text) {
        setState("idle", s.voiceNoSpeech);
        return;
      }
      void ask(text);
    };

    try {
      rec.start();
      setState("listening");
    } catch {
      recognition = null;
      setState("idle", s.voiceUnsupported);
    }
  }

  async function ask(text: string): Promise<void> {
    live.textContent = "";
    bubble("user", text);
    const turn: Turn = { role: "user", content: text };
    remember(turn);
    setState("thinking");

    let reply: string;
    try {
      reply = await askVoice(history);
      if (!reply.trim()) throw new AiError("failed");
    } catch (error) {
      forget(turn);
      if (closed) return;
      const message = describe(error);
      bubble("assistant", message).dataset["error"] = "true";
      setState("idle", message);
      return;
    }

    // The answer is kept even if the panel has gone, so the conversation
    // stays paired and the learner sees it on reopening.
    remember({ role: "assistant", content: reply });
    if (closed) return;

    const { german, english } = splitReply(reply);
    bubble("assistant", german || reply, english);
    await speak(german || reply, english);

    // Keep the conversation going for a few turns — unless the learner has
    // already tapped to interrupt (listening restarted on its own), or has
    // been hands-free long enough that the room might be talking, not them.
    if (closed || state !== "idle") return;
    handsFree += 1;
    if (handsFree < HANDS_FREE_TURNS) listen();
    else setState("idle", s.voiceIdle);
  }

  function speak(german: string, english: string): Promise<void> {
    const engine = synth();
    const parts: Array<[string, SpeechLang]> = [];
    if (german) for (const piece of pieces(german)) parts.push([piece, "de-DE"]);
    if (english) for (const piece of pieces(english)) parts.push([piece, "en-US"]);
    if (!engine || !parts.length) {
      setState("idle");
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      engine.cancel();
      setState("speaking");
      let remaining = parts.length;
      const finish = (): void => {
        remaining -= 1;
        if (remaining > 0) return;
        if (state === "speaking") setState("idle");
        resolve();
      };
      for (const [text, lang] of parts) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voice = pickVoice(lang);
        if (voice) utterance.voice = voice;
        utterance.rate = 0.95;
        // Chrome sometimes drops the end event on long or remote-voice
        // utterances; a generous timer keeps the turn from freezing.
        let fired = false;
        const settle = (): void => {
          if (fired) return;
          fired = true;
          clearTimeout(timer);
          finish();
        };
        const timer = setTimeout(settle, 3000 + text.length * 90);
        utterance.onend = settle;
        utterance.onerror = settle;
        engine.speak(utterance);
      }
    });
  }

  orb.addEventListener("click", () => {
    // iOS only lets a page speak once speak() has run inside a user gesture.
    const engine = synth();
    if (engine && !unlocked) {
      engine.speak(new SpeechSynthesisUtterance(""));
      unlocked = true;
    }
    handsFree = 0;

    if (state === "listening") {
      // Finish the turn now; onend sends whatever was heard.
      recognition?.stop();
      return;
    }
    if (state === "speaking") {
      engine?.cancel();
      listen();
      return;
    }
    if (state === "thinking") return;
    listen();
  });

  for (const turn of history) {
    if (turn.role === "user") bubble("user", turn.content);
    else {
      const { german, english } = splitReply(turn.content);
      bubble("assistant", german || turn.content, english);
    }
  }

  queueMicrotask(() => orb.focus());
  return overlay;
}
