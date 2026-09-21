import { t } from "../i18n";
import { VoiceError } from "../realtime";
import type { AppContext } from "./context";
import {
  clear,
  h,
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
 * somebody scrolled back to re-read a correction and found it gone. So
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
  /** Appended in call order — the engine corrects first, then replies. */
  correct(correction: Correction): void;
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

  const stage = h("div", { class: "classroom__stage" }, orb, state, live, now, notice);

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
  const transcript = h("div", { class: "classroom__transcript" }, log, jump);

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

  const KIND_LABEL: Record<ClassFocus["kind"], string> = {
    talk: s.classNowTalk,
    vocab: s.classNowVocab,
    table: s.classNowTable,
    sentence: s.classNowSentence,
    review: s.classNowReview
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
   * back to re-read a correction is dragged to the bottom by the tutor's next
   * syllable. So the log follows only when it was already following, and says
   * so with a button when it is not.
   */
  const settle = (): void => {
    if (pinned()) {
      log.scrollTop = log.scrollHeight;
      jump.hidden = true;
    } else {
      jump.hidden = false;
    }
  };

  log.addEventListener("scroll", () => {
    if (pinned()) jump.hidden = true;
  });

  jump.addEventListener("click", () => {
    log.scrollTop = log.scrollHeight;
    jump.hidden = true;
  });

  const trim = (): void => {
    while (log.childElementCount > LOG_CAP) log.firstElementChild?.remove();
    // A bubble still being written into can be the one the cap just dropped.
    // Forgetting it here means the next token opens a fresh bubble instead of
    // writing into a node that is no longer on the page.
    if (openUser && !openUser.isConnected) openUser = null;
    if (openTeacher && !openTeacher.isConnected) openTeacher = null;
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
  };

  function setLiveText(text: string): void {
    // Kept out of the log, which is aria-live: a partial re-announced every
    // couple of hundred milliseconds is unusable with a screen reader, and the
    // interim text is a hint about the microphone, not part of the record.
    live.textContent = text;
  }

  /* ---------------------------------------------------------- transcript */

  const pushLine = (role: "user" | "assistant", text: string, final: boolean): void => {
    let bubble = role === "user" ? openUser : openTeacher;

    if (!bubble) {
      if (text.trim().length === 0) return;
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
      if (role === "user") openUser = null;
      else openTeacher = null;
    }

    settle();
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
      log.append(node);
      trim();
      settle();
    },

    destroy() {
      destroyed = true;
      openUser = null;
      openTeacher = null;
      log.replaceChildren();
      root.remove();
    }
  };
}
