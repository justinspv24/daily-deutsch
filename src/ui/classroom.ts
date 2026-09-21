import { t } from "../i18n";
import { VoiceError } from "../realtime";
import type { AppContext } from "./context";
import {
  clear,
  h,
  ICON_ARROW,
  ICON_CHECK,
  ICON_HOME,
  ICON_MIC,
  ICON_PAUSE,
  ICON_PLAY,
  ICON_STOP,
  ICON_X,
  svgIcon
} from "./dom";
import { describeVoiceError, formatElapsed } from "./voice";

/**
 * The classroom — the one screen the app now lives in.
 *
 * Two things about this module are load-bearing and neither is obvious from
 * reading the markup.
 *
 * **It is built once and mutated.** `main.ts` repaints by clearing
 * `shell.view` and appending whatever the route renders. Every other screen is
 * a pure render function and is happy with that. This one cannot be: a
 * half-hour conversation has a scroll position, a running orb animation and an
 * open transcript bubble being rewritten token by token, all of which a
 * re-render would throw away — and none of which would look broken until
 * somebody scrolled back to re-read what was said ten minutes ago and found
 * the whole class gone. So
 * `renderClassroom` returns a handle. The app holds it, re-appends the same
 * `root`, and calls the setters. Nothing in here ever rebuilds itself.
 *
 * **It is `position: fixed`, so it must never be nested in a `.card`.** A card
 * runs the `rise` animation, whose first keyframe is `transform:
 * translateY(10px)`; an element with a transform is a containing block for
 * fixed descendants, and the classroom would be clipped to the card. The root
 * returned here is meant to be the sole child of `shell.view`, which — like
 * `.app` and `.main` — carries no transform. Keep it that way.
 *
 * The strings are read from `t()` once, at build time, exactly as every other
 * view does. A language change mid-class would therefore need a rebuild; that
 * is the same bargain the whole app already makes and not worth a second
 * mechanism for a screen the learner is talking to rather than reading.
 */

/* ------------------------------------------------------------- the contract */

export type ClassPhase = "connecting" | "live" | "paused" | "error" | "needkey" | "ended";

/** The orb's four shapes, borrowed from the voice panel. */
export type ClassVoice = "idle" | "listening" | "speaking" | "thinking";

/** What the class is working on at this second, shown in the "now" card. */
export interface ClassFocus {
  /** One per `ClassItem` kind, so the lesson engine can pass its own tag through. */
  kind: "talk" | "vocab" | "table" | "sentence" | "review";
  /** "Akkusativ-Präpositionen", "der Schrank", "Personalpronomen · Dativ". */
  title: string;
  /** The question or prompt itself, when there is one. */
  detail: string | null;
  done: number;
  total: number;
}

/**
 * A sentence the learner said and the sentence they should have said.
 *
 * Three plain strings, not pre-tokenised spans: which words changed is a
 * property of the pair and can be worked out here, and asking the lesson
 * engine to carry a diff format across the boundary would mean two places that
 * have to agree about it.
 */
export interface Correction {
  said: string;
  fixed: string;
  /** One sentence of why, already in the interface language. "" for none. */
  why: string;
}

/**
 * What the learner is being asked, as the card on the stage needs it.
 *
 * A flattened view of the lesson engine's `ClassAsk` rather than the ask
 * itself. The card has no business knowing about mistake ladders or which
 * bank a sentence came from — and, more to the point, an ask carries its own
 * accepted answers. Handing the view the whole thing would put the answer key
 * in the DOM, where it would sit one inspector — or one screenshot of a
 * screen-reader tree — away from the learner it is being kept from.
 */
export interface ClassAskView {
  /** One per drilled `ClassItem` kind; `cell` and `blank` arrive renamed. */
  readonly kind: "vocab" | "table" | "sentence" | "review";
  /** The question in German: 'Was heißt „die Meinung“ auf Englisch?' */
  readonly question: string;
  /** What it is about: "die Meinung", "Bestimmter Artikel · Dativ · maskulin". */
  readonly subject: string;
  /** A gloss or gender hint under the field, or null. */
  readonly hint: string | null;
  /**
   * Which answer the field expects.
   *
   * It never gates what may be typed — a learner who puts an English gloss
   * into a German question has answered wrongly, which is the grader's
   * business and not the field's — but it does set the field's language, and
   * that is what decides whether a phone keyboard offers umlauts and how a
   * screen reader pronounces what is in there.
   */
  readonly expects: "article" | "aux" | "english" | "german" | "none";
  readonly done: number;
  readonly total: number;
}

export interface ClassroomHandlers {
  /**
   * Suspend the class. Both the Break button and the home icon report here —
   * the view does not decide what suspending means, or whether it also leaves
   * the screen. Pressed again from the `paused` phase it means "carry on", so
   * the handler has to be a toggle.
   */
  onBreak(): void;
  /** Finalise, write the summary, go to the summary route. */
  onEnd(): void;
  /** Reconnect after an error. */
  onRetry(): void;
  /** No Google AI key saved — open the account panel. */
  onNeedKey(): void;
  /**
   * The learner typed their answer instead of saying it. Never called with an
   * empty string, and never twice for the same question: the field takes
   * itself out of service on the way through, because a learner who hits
   * Enter and sees nothing happen hits it again, and by then the tutor may
   * already have moved on to the next question.
   */
  onTyped(answer: string): void;
}

export interface ClassroomView {
  readonly root: HTMLElement;
  setPhase(phase: ClassPhase, error?: unknown): void;
  setVoice(state: ClassVoice): void;
  setFocus(focus: ClassFocus | null): void;
  /** Seconds since the class started; the view formats it. */
  setClock(seconds: number): void;
  /** Interim speech recognition, shown under the orb, never in the log. */
  setLive(text: string): void;
  /** One open bubble per speaker, rewritten until `final`. */
  say(role: "user" | "assistant", text: string, final: boolean): void;
  /**
   * Put the sentence right, on a layer of its own and only for as long as it
   * takes to read.
   *
   * Never a line of the transcript. A correction is something that happened to
   * one sentence, not a turn of the conversation, and while it was a log entry
   * a learner scrolling back through their class found it made mostly of their
   * own mistakes.
   */
  correct(correction: Correction): void;
  /**
   * Put a question on the stage, or clear it for a stretch of conversation.
   *
   * The same ask again is a no-op, and has to be: a repaint that replayed the
   * entrance would flicker, and it would also empty a field the learner was
   * halfway through typing into.
   */
  setAsk(ask: ClassAskView | null): void;
  destroy(): void;
}

/* -------------------------------------------------------------- the diff */

/**
 * How far from the bottom still counts as "following along". Anything inside
 * this and a new line scrolls the log; anything beyond it and the learner is
 * reading something further up and must not be yanked away from it.
 */
const PIN_SLACK = 48;

/**
 * The transcript is a view, not the record — the day's summary is the record.
 * A class that runs long would otherwise grow an unbounded pile of nodes that
 * nobody will scroll back through.
 */
const LOG_CAP = 400;

/**
 * How long a correction holds the stage before it goes.
 *
 * Four seconds to register that anything happened at all, plus the time it
 * takes to read what is on the slab at about fifteen characters a second —
 * the slow end of silent reading, which is the right end for a sentence in a
 * language the learner is still decoding word by word. A round number would
 * be wrong in both directions: three seconds is nothing for a corrected
 * subordinate clause with a reason underneath it, and it is an age for a
 * missing umlaut. The clamps mean neither a one-word fix flashes past before
 * the eye arrives nor a runaway string parks itself over the orb for a
 * minute.
 */
const CORRECTION_HOLD_MS = 4000;
const CORRECTION_CPS = 15;
const CORRECTION_MIN_MS = 4500;
const CORRECTION_MAX_MS = 12_000;

/**
 * The fade out. Keep equal to the `correction-out` animation in
 * classroom.css: the node is removed on this timer rather than on
 * `animationend`, because under `prefers-reduced-motion` that sheet turns the
 * animation off outright — there would be no event, and the slab would never
 * leave the screen at all.
 */
const CORRECTION_FADE_MS = 520;

function splitWords(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter((word) => word.length > 0);
}

/**
 * Mark the words of `mine` that are not the same word at the same place in
 * `other`.
 *
 * Deliberately the naive thing. A real alignment would handle an inserted word
 * without lighting up everything after it, but it would also be a hundred
 * lines of Myers diff in a file about a classroom. Position matching is right
 * for the corrections that actually happen — a wrong article, a wrong ending,
 * a verb in the wrong place — and where it over-marks (one word inserted, so
 * the tail shifts) it over-marks a tail that genuinely did move. It is never
 * wrong in a way that points the learner at the wrong sentence, because the
 * corrected sentence is printed in full and in the loudest type on the screen
 * whatever the marks say.
 *
 * Comparison is exact, including case: in German a capital letter is often the
 * whole correction.
 */
function markChanged(mine: readonly string[], other: readonly string[], cls: string): Node[] {
  const out: Node[] = [];
  mine.forEach((word, index) => {
    if (index > 0) out.push(document.createTextNode(" "));
    // `?? ""` rather than a length check: it reads the same under
    // noUncheckedIndexedAccess and without it, and a word past the end of the
    // other sentence is a changed word either way.
    const counterpart = other[index] ?? "";
    out.push(word === counterpart ? document.createTextNode(word) : h("mark", { class: cls }, word));
  });
  return out;
}

/* ------------------------------------------------------------------ build */

export function renderClassroom(ctx: AppContext, handlers: ClassroomHandlers): ClassroomView {
  const s = t();

  /* ------------------------------------------------------------------ bar */

  const home = h(
    "button",
    {
      class: "iconbtn classroom__home",
      type: "button",
      title: s.classHomeTitle,
      "aria-label": s.classHomeTitle
    },
    svgIcon(ICON_HOME, "home")
  );
  // Leaving by the house is still leaving: the class is suspended rather than
  // silently dropped, so the clock stops and the record stays open.
  home.addEventListener("click", () => handlers.onBreak());

  const level = h("span", { class: "classroom__level" }, ctx.progress.level ?? "A2");
  const focusLabel = h("span", { class: "classroom__focus" });
  const clock = h(
    "span",
    { class: "classroom__clock", role: "timer", "aria-label": s.classClockLabel },
    formatElapsed(0)
  );

  const bar = h(
    "header",
    { class: "classroom__bar" },
    home,
    h("div", { class: "classroom__meta" }, level, focusLabel),
    clock
  );

  /* ---------------------------------------------------------------- stage */

  const orb = h(
    "span",
    { class: "orb", "data-state": "thinking", "aria-hidden": "true" },
    h("span", { class: "orb__ring" }),
    h("span", { class: "orb__ring orb__ring--2" }),
    h("span", { class: "orb__core" }, svgIcon(ICON_MIC, "microphone"))
  );

  const state = h("p", { class: "classroom__state", role: "status" }, s.classConnecting);
  const live = h("p", { class: "classroom__live" });

  const nowKind = h("span", { class: "classroom__nowkind" });
  const nowText = h("p", { class: "classroom__nowtext" });
  const nowCount = h("span", { class: "pill classroom__nowcount" });
  const now = h(
    "div",
    { class: "classroom__now", hidden: true },
    h("div", { class: "classroom__nowbody" }, nowKind, nowText),
    nowCount
  );

  /* Connection failures and the missing-key case, on the shared .notice. */
  const noticeTitle = h("p", { class: "notice__title" });
  const noticeBody = h("p", { class: "notice__body" });
  const noticeAction = h("button", { class: "btn", type: "button" });
  const notice = h(
    "div",
    { class: "notice classroom__notice", hidden: true },
    noticeTitle,
    noticeBody,
    h("div", { class: "actions actions--flush" }, noticeAction)
  );

  /* ----------------------------------------------------- the question card */

  /*
   * Built once and refilled, like everything else on this screen, and
   * deliberately never focused by the app. Focus opens the soft keyboard, the
   * keyboard covers half the classroom, and this is a speaking app in which
   * typing is the way out when speaking is not possible — a train, a shared
   * office, a word the microphone keeps mishearing. The field is there,
   * reachable and quiet, and the learner decides which of the two they are
   * using this time.
   */
  const askKind = h("span", { class: "ask__kind" });
  const askCount = h("span", { class: "pill ask__count" });
  const askQuestion = h("p", { class: "ask__question" });
  const askSubject = h("p", { class: "ask__subject" });
  const askHint = h("p", { class: "hint ask__hint" });
  const askInput = h("input", {
    class: "field__input ask__input",
    type: "text",
    name: "answer",
    // All four off for one reason: the phone must not improve the answer.
    // Autocorrect turns "Meinung" into "Meeting", autocapitalise turns "der"
    // into "Der" in a question that is precisely about which "der" it is, and
    // the learner would be marked on a word they never typed.
    autocomplete: "off",
    autocapitalize: "off",
    autocorrect: "off",
    spellcheck: "false",
    enterkeyhint: "send",
    "aria-label": s.classAnswerLabel
  });
  const askSendGlyph = h("span", { class: "classroom__glyph" }, svgIcon(ICON_ARROW, "send"));
  const askSend = h(
    "button",
    // Named on the element as well as in the label, because on a narrow phone
    // the sheet drops the words and leaves the arrow to do the job alone.
    { class: "btn ask__send", type: "submit", "aria-label": s.classAnswerSend },
    h("span", { class: "ask__sendlabel" }, s.classAnswerSend),
    askSendGlyph
  );
  // A real form rather than a button with a click handler: it gives one place
  // where an answer leaves this screen, however it was sent — the button, the
  // Enter key, a phone's "go" key — instead of two handlers that have to agree
  // about what "sent" means. `novalidate` because nothing here is invalid; the
  // only rule is that an empty field sends nothing, and the handler says so
  // without the browser putting a bubble on the screen about it.
  const askForm = h("form", { class: "ask__form", novalidate: true }, askInput, askSend);
  const askSay = h("p", { class: "ask__say" }, s.classAnswerHint);
  const askCard = h(
    "div",
    {
      class: "ask",
      hidden: true,
      "data-answered": "false",
      // Polite, never assertive. The tutor is usually mid-sentence when the
      // card arrives, and an assertive region would cut it off in the middle
      // of the very question the card is showing.
      "aria-live": "polite"
    },
    h("div", { class: "ask__head" }, askKind, askCount),
    askQuestion,
    askSubject,
    askHint,
    askForm,
    askSay
  );

  const stage = h("div", { class: "classroom__stage" }, orb, state, live, now, askCard, notice);

  /* ----------------------------------------------------------- transcript */

  const log = h("div", {
    class: "classroom__log",
    role: "log",
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-label": s.classTranscriptLabel
  });
  const jump = h(
    "button",
    { class: "classroom__jump", type: "button", hidden: true },
    s.classJumpToLatest
  );
  /*
   * The correction layer, laid over the foot of the transcript.
   *
   * It floats rather than flowing because a slab that took part in the layout
   * would shove the orb, the question card and the field down the screen and
   * then haul them back up four seconds later — and the field is the one
   * thing here that must not move under a learner's thumb.
   *
   * It belongs to the transcript rather than to the stage because that is the
   * one region of this screen that is, by definition, not live: whatever it
   * covers has already been said. Anchored there, the correction lands over
   * the learner's own last sentence in every layout the classroom has —
   * beneath the card on a phone, over the log beside it on anything wider —
   * and the question and the field are never covered by it. It takes no taps
   * either; the sheet gives the layer `pointer-events: none`, so even the
   * jump-to-latest button underneath it stays live.
   */
  const corrections = h("div", { class: "classroom__correction", role: "status" });
  const transcript = h("div", { class: "classroom__transcript" }, log, jump, corrections);

  /* ------------------------------------------------------------- controls */

  const brkGlyph = h("span", { class: "classroom__glyph" }, svgIcon(ICON_PAUSE, "pause"));
  const brkLabel = h("span", {}, s.classBreak);
  const brk = h(
    "button",
    { class: "btn btn--ghost classroom__break", type: "button" },
    brkGlyph,
    brkLabel
  );

  const end = h(
    "button",
    { class: "btn classroom__end", type: "button" },
    h("span", { class: "classroom__glyph" }, svgIcon(ICON_STOP, "end")),
    h("span", {}, s.classEnd)
  );

  const controls = h("footer", { class: "classroom__controls" }, brk, end);

  /* --------------------------------------------------------------- root */

  const root = h(
    "section",
    { class: "classroom", "data-phase": "connecting", "aria-label": s.classTitle },
    bar,
    h("div", { class: "classroom__main" }, stage, transcript),
    controls
  );

  /* ---------------------------------------------------------------- state */

  let phase: ClassPhase = "connecting";
  let voice: ClassVoice = "thinking";
  let destroyed = false;
  /** Which handler the notice's one button is currently wired to. */
  let noticeGoes: "retry" | "key" | null = null;
  let openUser: HTMLElement | null = null;
  let openTeacher: HTMLElement | null = null;
  /**
   * The last bubble each side finished. Kept only so that a partial arriving
   * after its own turn was closed cannot open a second copy of it — see
   * `pushLine`.
   */
  let doneUser: HTMLElement | null = null;
  let doneTeacher: HTMLElement | null = null;
  /** Whichever timer is going to fade or remove the slab on the stage. */
  let correctionTimer: number | null = null;
  /** What `setAsk` was last given, flattened, so the same ask is a no-op. */
  let askKey: string | null = null;
  /** Whether the question now on the card has already been typed and sent. */
  let askSent = false;

  const KIND_LABEL: Record<ClassFocus["kind"], string> = {
    talk: s.classNowTalk,
    vocab: s.classNowVocab,
    table: s.classNowTable,
    sentence: s.classNowSentence,
    review: s.classNowReview
  };

  const ASK_LABEL: Record<ClassAskView["kind"], string> = {
    vocab: s.classAskVocab,
    table: s.classAskTable,
    sentence: s.classAskSentence,
    review: s.classAskReview
  };

  /**
   * The sentence that goes with an orb shape, or null.
   *
   * "idle" has no sentence, deliberately. It is the absence of a state rather
   * than a state — the socket between two turns, or a call that has just been
   * torn down — and putting words to it would mean the screen announcing
   * something every time the tutor drew breath. The last sentence stands.
   */
  const voiceLabel = (which: ClassVoice): string | null => {
    switch (which) {
      case "listening":
        return s.classListening;
      case "speaking":
        return s.classSpeaking;
      case "thinking":
        return s.classThinking;
      default:
        return null;
    }
  };

  /* ------------------------------------------------------------ scrolling */

  const pinned = (): boolean => log.scrollHeight - log.scrollTop - log.clientHeight < PIN_SLACK;

  /*
   * The voice panel scrolls on every streamed token. Over a three-minute call
   * that is fine; over a half-hour class it means a learner who has scrolled
   * back to re-read an earlier turn is dragged to the bottom by the tutor's next
   * syllable. So the log follows only when it was already following, and says
   * so with a button when it is not.
   */
  const settle = (follow: boolean): void => {
    if (follow) {
      log.scrollTop = log.scrollHeight;
      jump.hidden = true;
    } else {
      jump.hidden = false;
    }
  };

  /*
   * The button tracks the scroll position in both directions, not just on the
   * way back down. A learner who scrolls up to re-read something ten minutes
   * into a class is exactly the person who needs a way back to the live end of
   * it, and the old one-way version only ever appeared if the tutor happened
   * to say something while they were up there — so the affordance was missing
   * precisely when the class had gone quiet and there was time to read.
   */
  log.addEventListener("scroll", () => {
    jump.hidden = pinned();
  });

  jump.addEventListener("click", () => {
    log.scrollTop = log.scrollHeight;
    jump.hidden = true;
  });

  const trim = (): void => {
    while (log.childElementCount > LOG_CAP) log.firstElementChild?.remove();
    // A bubble still being written into can be the one the cap just dropped.
    // Forgetting it here means the next token opens a fresh bubble instead of
    // writing into a node that is no longer on the page. The two finished
    // ones go the same way so that the guard in `pushLine` is never comparing
    // against a node that left the log an hour ago.
    if (openUser && !openUser.isConnected) openUser = null;
    if (openTeacher && !openTeacher.isConnected) openTeacher = null;
    if (doneUser && !doneUser.isConnected) doneUser = null;
    if (doneTeacher && !doneTeacher.isConnected) doneTeacher = null;
  };

  /* ----------------------------------------------------------- the phases */

  noticeAction.addEventListener("click", () => {
    if (noticeGoes === "retry") handlers.onRetry();
    else if (noticeGoes === "key") handlers.onNeedKey();
  });

  const showNotice = (title: string, body: string, action: string, goes: "retry" | "key"): void => {
    noticeTitle.textContent = title;
    noticeBody.textContent = body;
    noticeAction.textContent = action;
    noticeGoes = goes;
    notice.hidden = false;
  };

  const applyPhase = (next: ClassPhase, error?: unknown): void => {
    phase = next;
    root.dataset["phase"] = next;

    if (next !== "error" && next !== "needkey") {
      notice.hidden = true;
      noticeGoes = null;
    }

    switch (next) {
      case "connecting":
        state.textContent = s.classConnecting;
        orb.dataset["state"] = "thinking";
        break;
      case "live":
        // Entering the live phase with nothing to say yet means the tutor is
        // waiting on the learner, which is what the class mostly is.
        state.textContent = voiceLabel(voice) ?? s.classListening;
        orb.dataset["state"] = voice;
        break;
      case "paused":
        state.textContent = s.classPaused;
        orb.dataset["state"] = "idle";
        break;
      case "ended":
        state.textContent = s.classEnded;
        orb.dataset["state"] = "idle";
        setLiveText("");
        // A class that is over takes no more answers. Break and the error
        // states deliberately leave the card alone: the question is still
        // this learner's question when they come back to it.
        hideAsk();
        break;
      case "needkey":
        state.textContent = s.voiceKeyRequired;
        orb.dataset["state"] = "idle";
        showNotice(s.voiceKeyTitle, s.voiceKeyBlurb, s.voiceKeyOpenAccount, "key");
        break;
      case "error": {
        // describeVoiceError is the single source of error prose in this app;
        // a second copy here would drift from it within a month.
        const message = describeVoiceError(error);
        state.textContent = message;
        orb.dataset["state"] = "idle";
        showNotice(s.classErrorTitle, message, s.classRetry, "retry");
        break;
      }
    }

    const finished = next === "ended";

    // Break is only meaningful once there is something to break from, and
    // means "carry on" once paused.
    //
    // It stays live when the call has failed, for the same reason End does. A
    // learner whose microphone was refused, or who has not added a key yet,
    // wants to step away and come back to this class — and a screen offering
    // only "End class" pushes them into finishing a lesson they had barely
    // started. The class is kept open either way; only End writes the day.
    brk.disabled = next === "connecting";
    brk.hidden = finished;
    const resuming = next === "paused";
    clear(brkGlyph).append(svgIcon(resuming ? ICON_PLAY : ICON_PAUSE, resuming ? "resume" : "pause"));
    brkLabel.textContent = resuming ? s.classResumeClass : s.classBreak;

    // End stays live in every failed state on purpose: a class that could not
    // connect still happened, and the learner must be able to close it and see
    // its (short) summary rather than be stuck on a dead screen.
    end.disabled = false;
    end.hidden = finished;

    home.disabled = finished;

    // The field's placeholder is a promise about the microphone, so it has to
    // follow every state that can open or close it — the phase as much as the
    // orb.
    refreshPlaceholder();
  };

  function setLiveText(text: string): void {
    // Kept out of the log, which is aria-live: a partial re-announced every
    // couple of hundred milliseconds is unusable with a screen reader, and the
    // interim text is a hint about the microphone, not part of the record.
    live.textContent = text;
  }

  /* ---------------------------------------------------------- transcript */

  const pushLine = (role: "user" | "assistant", text: string, final: boolean): void => {
    /*
     * Whether the learner was following along is decided before the log
     * moves, and this is not a detail. A whole turn arriving at once is
     * taller than the slack — a two-line bubble is sixty-odd pixels — so a
     * log measured afterwards finds itself further from the bottom than the
     * slack allows and concludes that the learner has scrolled away. It was
     * survivable while one bubble was rewritten in place and grew a word at a
     * time; now that every turn of the class stays, it would mean the log
     * following the conversation exactly until the first time it overflowed
     * and then never again.
     */
    const follow = pinned();

    let bubble = role === "user" ? openUser : openTeacher;

    if (!bubble) {
      if (text.trim().length === 0) return;

      /*
       * A turn that has been closed stays closed.
       *
       * The socket hands over the whole of a turn as it accumulates, and it
       * can hand over the tail of one it has already finished — a partial
       * that lost the race with its own final, a reconnection replaying the
       * last thing it sent. Without this the same sentence opens a second
       * bubble under the first and the log reads as the tutor saying
       * everything twice.
       *
       * Only the bubble still at the foot of the log is protected, and only
       * against text it already contains. Further up, or with the other
       * speaker in between, an identical sentence is somebody genuinely
       * repeating themselves — which in a language class is the single most
       * likely thing either of them will do.
       */
      const done = role === "user" ? doneUser : doneTeacher;
      if (done && done === log.lastElementChild && (done.textContent ?? "").startsWith(text)) {
        return;
      }

      bubble = h("div", {
        class: "bubble",
        "data-role": role,
        // Hidden from the live region until it is finished, so a screen reader
        // hears the sentence once rather than hearing it being assembled.
        "aria-hidden": "true"
      });
      if (role === "user") openUser = bubble;
      else openTeacher = bubble;
      log.append(bubble);
      trim();
    }

    bubble.textContent = text;

    if (final) {
      bubble.removeAttribute("aria-hidden");
      if (role === "user") {
        openUser = null;
        doneUser = bubble;
      } else {
        openTeacher = null;
        doneTeacher = bubble;
      }
    }

    settle(follow);
  };

  /*
   * A correction is not a bubble.
   *
   * Bubbles alternate left and right and read as conversation; a correction
   * has to stop the learner, so it spans the log and breaks that rhythm before
   * a single colour has been taken in. Colour is never the only signal either:
   * each row carries a glyph, the wrong row is struck through, the right row
   * is the heaviest type on the screen, and both rows are prefixed by a phrase
   * that is read aloud and never drawn.
   *
   * The colours are not decorative choices. Measured against tokens.css in the
   * light theme, --ok on --ok-wash is 3.59:1, which clears AA only as large
   * bold text — hence the corrected sentence at var(--step-1)/700 — and --no
   * on --no-wash is 4.03:1, which clears nothing, which is why the wrong
   * sentence is set in --ink-muted and --no appears only as the rule, the
   * glyph and the underline. The inversion is the better design anyway: the
   * sentence worth keeping is the loud one.
   */
  const paintCorrection = (correction: Correction): HTMLElement | null => {
    const saidWords = splitWords(correction.said);
    const fixedWords = splitWords(correction.fixed);
    if (fixedWords.length === 0) return null;

    const node = h(
      "div",
      { class: "correction" },
      h("span", { class: "correction__label" }, s.classCorrection)
    );

    if (saidWords.length > 0) {
      node.append(
        h(
          "p",
          { class: "correction__row", "data-side": "was" },
          svgIcon(ICON_X, "wrong"),
          h("span", { class: "sr" }, s.classCorrectionSaid),
          h("s", { class: "correction__text" }, ...markChanged(saidWords, fixedWords, "correction__was"))
        )
      );
    }

    node.append(
      h(
        "p",
        { class: "correction__row", "data-side": "now" },
        svgIcon(ICON_CHECK, "right"),
        h("span", { class: "sr" }, s.classCorrectionShould),
        h(
          "span",
          { class: "correction__text" },
          ...markChanged(fixedWords, saidWords, "correction__now")
        )
      )
    );

    const why = correction.why.trim();
    if (why.length > 0) node.append(h("p", { class: "correction__why" }, why));

    return node;
  };

  /** See `CORRECTION_HOLD_MS`: four seconds, plus the time it takes to read. */
  const holdFor = (correction: Correction): number => {
    const chars = correction.said.length + correction.fixed.length + correction.why.length;
    const wanted = CORRECTION_HOLD_MS + (chars / CORRECTION_CPS) * 1000;
    return Math.min(CORRECTION_MAX_MS, Math.max(CORRECTION_MIN_MS, wanted));
  };

  const dropCorrection = (): void => {
    if (correctionTimer !== null) {
      window.clearTimeout(correctionTimer);
      correctionTimer = null;
    }
    // Clearing the layer rather than removing a node this closure happens to
    // be holding: a slab part-way through its fade is still on screen with its
    // removal timer just cancelled, and emptying the layer outright is the
    // only version of this that cannot leave one behind.
    corrections.replaceChildren();
  };

  const showCorrection = (node: HTMLElement, hold: number): void => {
    // A second correction replaces the first at once rather than queueing
    // behind it. Two slabs at once would be two things to read in the time
    // allowed for one, and the older of them is about a sentence the learner
    // has already stopped thinking about.
    dropCorrection();
    corrections.append(node);
    correctionTimer = window.setTimeout(() => {
      node.dataset["leaving"] = "true";
      correctionTimer = window.setTimeout(() => {
        correctionTimer = null;
        node.remove();
      }, CORRECTION_FADE_MS);
    }, hold);
  };

  /* --------------------------------------------------------- the question */

  /**
   * Draw the question, marking the gap when there is one.
   *
   * A run of underscores set in a proportional face is a smear the eye slides
   * straight over, and in a gapped sentence the gap *is* the question. So it
   * is painted as a thing rather than left as punctuation — while the
   * underscores stay as the span's own text, so that the sentence still copies
   * as a sentence and still reads out as one with a blank in it.
   */
  const paintQuestion = (view: ClassAskView): Node[] => {
    if (view.kind !== "sentence") return [document.createTextNode(view.question)];
    return view.question
      .split(/(_{2,})/)
      .filter((part) => part.length > 0)
      .map((part) =>
        /^_{2,}$/.test(part)
          ? h("span", { class: "ask__gap" }, part)
          : document.createTextNode(part)
      );
  };

  /**
   * What makes two asks the same ask.
   *
   * Everything the card draws except the count: progress moves while a single
   * question stands — a learner answers, the tally goes up, the engine
   * re-asserts the item — and re-animating the card for that would say "new
   * question" when nothing had been asked.
   */
  const askKeyOf = (view: ClassAskView): string =>
    JSON.stringify([view.kind, view.question, view.subject, view.hint, view.expects]);

  /**
   * The microphone is only really open while the class is live and the orb
   * says it is listening. Promising "say it" while the tutor is mid-sentence
   * would be telling the learner to talk over their teacher.
   */
  const refreshPlaceholder = (): void => {
    askInput.placeholder =
      phase === "live" && voice === "listening"
        ? s.classAnswerPlaceholderSay
        : s.classAnswerPlaceholderType;
  };

  const setSendGlyph = (sent: boolean): void => {
    clear(askSendGlyph).append(sent ? svgIcon(ICON_CHECK, "sent") : svgIcon(ICON_ARROW, "send"));
  };

  const paintAskCount = (view: ClassAskView): void => {
    const total = Math.max(0, Math.round(view.total));
    const done = Math.min(total, Math.max(0, Math.round(view.done)));
    askCount.hidden = total === 0;
    askCount.textContent = total === 0 ? "" : s.classProgress(done, total);
  };

  const replayAskEntrance = (): void => {
    askCard.classList.remove("ask--new");
    // The layout read is the whole point of the line. Without it the browser
    // coalesces the class going away and coming back into no change at all,
    // and the entrance plays for the first question of the class and never
    // again — which is the one time it is not needed, the card having been
    // empty a moment before.
    void askCard.offsetWidth;
    askCard.classList.add("ask--new");
  };

  const hideAsk = (): void => {
    askKey = null;
    askSent = false;
    askCard.hidden = true;
    askCard.dataset["answered"] = "false";
    askInput.value = "";
    askInput.disabled = false;
    askSend.disabled = false;
    setSendGlyph(false);
    root.dataset["ask"] = "false";
  };

  const showAsk = (view: ClassAskView): void => {
    askKind.textContent = ASK_LABEL[view.kind];
    paintAskCount(view);
    clear(askQuestion).append(...paintQuestion(view));

    // The subject says what the question is about, so it earns its line only
    // when the question does not already say it. A vocabulary card asks
    // 'Was heißt „die Meinung“ auf Englisch?' and printing „die Meinung“
    // again underneath is noise — whereas "Bestimmter Artikel · Dativ ·
    // maskulin" is the only place the learner can see which cell of the table
    // they are standing in.
    const subject = view.subject.trim();
    askSubject.textContent = subject;
    askSubject.hidden = subject.length === 0 || view.question.includes(subject);

    const hint = view.hint?.trim() ?? "";
    askHint.textContent = hint;
    askHint.hidden = hint.length === 0;

    askSent = false;
    askCard.dataset["answered"] = "false";
    askInput.value = "";
    askInput.disabled = false;
    // Sets the soft keyboard and the screen reader's voice. It does not stop
    // anything from being typed — see `ClassAskView.expects`.
    askInput.lang = view.expects === "english" ? "en" : "de";
    askSend.disabled = false;
    setSendGlyph(false);
    refreshPlaceholder();
    askCard.hidden = false;
    root.dataset["ask"] = "true";
    replayAskEntrance();
  };

  /*
   * Enter sends.
   *
   * A single-field form is supposed to do this by itself, and in a plain
   * browser tab it does — but implicit submission is the one behaviour here
   * that quietly does nothing when it fails, and it is the key every learner
   * who has just typed an answer will reach for. So it is asked for outright.
   * A browser that also submits implicitly raises a second submit event, and
   * the `askSent` guard below eats it.
   *
   * `isComposing` keeps the umlaut. On a layout where ä is a dead key
   * followed by a vowel, Enter can arrive mid-composition, and submitting
   * there would send half a word.
   */
  askInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing) return;
    event.preventDefault();
    askForm.requestSubmit();
  });

  askForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (askSent || askKey === null) return;
    const answer = askInput.value.trim();
    // An empty field does nothing at all: no error, no shake. The learner
    // almost certainly meant to say this one and brushed the button.
    if (answer.length === 0) return;
    askSent = true;
    // Shut before the handler runs rather than after. `onTyped` reaches the
    // tutor synchronously, and the very next thing to happen may be `setAsk`
    // with the following question — a second Enter in between would send this
    // answer to that question.
    askInput.disabled = true;
    askSend.disabled = true;
    askCard.dataset["answered"] = "true";
    setSendGlyph(true);
    handlers.onTyped(answer);
  });

  /* ----------------------------------------------------------- the wiring */

  brk.addEventListener("click", () => handlers.onBreak());

  end.addEventListener("click", () => {
    // Only worth asking when there is something to lose. A class that never
    // connected, or one already over, is closed on the first tap.
    if ((phase === "live" || phase === "paused") && !window.confirm(s.classEndConfirm)) return;
    handlers.onEnd();
  });

  applyPhase("connecting");

  return {
    root,

    setPhase(next, error) {
      if (destroyed) return;
      // The missing-key case arrives as an ordinary connection failure and is
      // discriminated here rather than by the caller, so that every path into
      // the classroom gets the account panel instead of a shrug.
      const needsKey = error instanceof VoiceError && error.code === "key_required";
      applyPhase(next === "error" && needsKey ? "needkey" : next, error);
    },

    setVoice(next) {
      if (destroyed) return;
      voice = next;
      refreshPlaceholder();
      // On a break, after an error and once the class is over, the phase owns
      // the whole stage: a late state message from a socket that is already
      // being torn down must not overwrite "Pause" or the reason it failed.
      if (phase === "paused" || phase === "ended" || phase === "error" || phase === "needkey") {
        return;
      }
      orb.dataset["state"] = next;
      // While connecting, the orb carries the movement but the sentence stays
      // with the phase: "your teacher is coming to the phone" tells the
      // learner more than "one moment" does, and the two would otherwise
      // flicker between each other for the length of the handshake.
      if (phase !== "live") return;
      const label = voiceLabel(next);
      if (label !== null) state.textContent = label;
    },

    setFocus(focus) {
      if (destroyed) return;
      now.hidden = focus === null;
      if (!focus) {
        focusLabel.textContent = "";
        return;
      }
      focusLabel.textContent = focus.title;
      nowKind.textContent = KIND_LABEL[focus.kind] ?? "";
      // The title is already in the bar; the card shows the question when
      // there is one and falls back to the title for a stretch of talk, which
      // has no prompt to show.
      nowText.textContent = focus.detail ?? focus.title;
      const total = Math.max(0, Math.round(focus.total));
      const done = Math.min(total, Math.max(0, Math.round(focus.done)));
      nowCount.hidden = total === 0;
      nowCount.textContent = total === 0 ? "" : s.classProgress(done, total);
    },

    setClock(seconds) {
      if (destroyed) return;
      clock.textContent = formatElapsed(Math.max(0, Math.round(seconds)));
    },

    setLive(text) {
      if (destroyed) return;
      setLiveText(text);
    },

    say(role, text, final) {
      if (destroyed) return;
      pushLine(role, text, final);
    },

    correct(correction) {
      if (destroyed) return;
      const node = paintCorrection(correction);
      if (!node) return;
      showCorrection(node, holdFor(correction));
    },

    setAsk(next) {
      if (destroyed) return;
      const key = next === null ? null : askKeyOf(next);
      if (key === askKey) {
        // The same question again — possibly with a later count against it.
        // Nothing else may move: the entrance must not replay, and whatever
        // the learner had half-typed must still be in the field.
        if (next) paintAskCount(next);
        return;
      }
      // Whatever was still on the stage from the last question belongs to the
      // last question. Guarded by the no-op above, so a run of talk turns each
      // clearing the ask does not also cut short a correction that has just
      // gone up.
      dropCorrection();
      if (next === null) {
        hideAsk();
        return;
      }
      showAsk(next);
      askKey = key;
    },

    destroy() {
      destroyed = true;
      openUser = null;
      openTeacher = null;
      doneUser = null;
      doneTeacher = null;
      dropCorrection();
      hideAsk();
      log.replaceChildren();
      root.remove();
    }
  };
}
