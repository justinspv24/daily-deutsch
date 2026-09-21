import { digestOf, tablesOf } from "./agenda";
import { judgeEnglish, judgeGerman } from "./grading";
import { pick, t } from "./i18n";
import { bankTime, closeLive, liveSeconds, pauseLive, resumeLive, worthKeeping } from "./liveclass";
import { noteAnswer, noteCorrection, scoreClass } from "./classscore";
import { todayISO } from "./scheduler";
import { ClassTutor, type ReportedAnswer, type ReportedCorrection } from "./tutor";
import type { ClassAgenda, ClassAsk, ClassEnding, ClassItem, ClassRecord, LiveClass, Progress, Verdict } from "./types";
import type { ClassAskView, ClassFocus, ClassroomView } from "./ui/classroom";
import { describeVoiceError } from "./ui/voice";

/**
 * The lesson, running.
 *
 * This is the piece that holds a class together: it walks the agenda, hands
 * each question to the tutor, marks what comes back, tells the tutor the
 * verdict, writes the outcome down, and moves on. The view is told what to
 * show and knows nothing about grading; the tutor speaks and knows nothing
 * about the schedule. Everything that decides what the learner's record says
 * happens here, in one place, where it can be read.
 *
 * It exists for exactly as long as the classroom is on screen. A class that is
 * merely *open* — broken off, waiting to be resumed — is a row in `Progress`
 * and nothing more, which is why a break can survive the tab being closed.
 */

/** A conversation turn runs on a timer; questions wait for an answer. */
const TALK_GRACE_MS = 4000;

/**
 * The line that closes a class. German, because it is spoken: everything sent
 * to the tutor is a stage direction in the language it teaches in, and a
 * bracket-free sentence here would be read out as though the learner had said
 * it.
 */
function closingLine(right: number, total: number): string {
  return `Die Stunde ist zu Ende. ${right} von ${total} richtig. Sag einen kurzen, freundlichen Schlusssatz.`;
}

export interface ClassRunHooks {
  /** Persist progress. Debounced by the app; safe to call after every answer. */
  commit(): void;
  /** Write the class still open, or clear it. */
  saveLive(live: LiveClass | null): void;
  /** The learner has no Google AI key; take them to the account panel. */
  onNeedKey(): void;
  /** The class is over and its record written. Show the summary. */
  onEnded(record: ClassRecord | null): void;
  /** The learner stepped out; the class stays open where it is. */
  onBroken(): void;
}

export class ClassRun {
  private readonly tutor: ClassTutor;
  /** Every closed question of this class, by id, for scoring at the end. */
  private readonly asks = new Map<string, ClassAsk>();
  private talkTimer: number | null = null;
  private clockTimer: number | null = null;
  /** True once the class has been closed, so it can never be closed twice. */
  private finished = false;
  private started = false;

  constructor(
    private readonly progress: Progress,
    private readonly agenda: ClassAgenda,
    private readonly live: LiveClass,
    private readonly view: ClassroomView,
    private readonly hooks: ClassRunHooks,
    voice: string
  ) {
    for (const item of [...agenda.items, ...agenda.spare]) {
      if (item.kind !== "talk") this.asks.set(item.id, item);
    }

    this.tutor = new ClassTutor({
      level: agenda.level,
      voice,
      plan: digestOf(agenda),
      onNeedKey: () => hooks.onNeedKey(),
      onCorrection: (correction) => this.correction(correction),
      onReported: (report) => this.reported(report),
      // Straight through to the log. The strip is repainted on every change of
      // state; the log is appended to once per turn and never rewritten, which
      // is what lets the learner scroll back through the whole class.
      onTranscript: (role, text, final) => this.view.say(role, text, final)
    });
    this.tutor.subscribe(() => this.paint());
  }

  /* ------------------------------------------------------------ lifecycle */

  /** Open the call and start the lesson where the plan says it is. */
  start(): void {
    if (this.started) return;
    this.started = true;

    if (!this.live.sections.includes(this.agenda.sectionId)) {
      this.live.sections.push(this.agenda.sectionId);
    }
    for (const id of tablesOf(this.agenda)) {
      if (!this.live.tables.includes(id)) this.live.tables.push(id);
      // A grid the class asks about has been introduced, which is what
      // `studied` has always meant. It used to be set by the study card the
      // typed round showed; without something setting it here, `dueTables`
      // would file every grid as fresh for ever and never let more than two
      // into the three-day chain.
      const state = this.progress.tables[id];
      if (state) state.studied = true;
    }

    resumeLive(this.live);
    this.hooks.saveLive(this.live);
    this.view.setPhase("connecting");
    this.startClock();
    void this.tutor.start().then(() => this.present());
  }

  /**
   * Thirty seconds of a class is thirty seconds of the learner's evening, so
   * the meter is banked often rather than at the end: an abrupt kill then
   * costs half a minute rather than the whole sitting.
   */
  tick(): void {
    if (this.finished) return;
    bankTime(this.live);
    this.hooks.saveLive(this.live);
    this.hooks.commit();
  }

  /** The tab went away. Stop the meter and write, synchronously. */
  hide(): void {
    if (this.finished) return;
    pauseLive(this.live);
    this.view.setPhase("paused");
    this.hooks.commit();
  }

  /** The tab came back. A fresh stretch starts; the gap is never credited. */
  show(): void {
    if (this.finished || !this.tutor.running) return;
    resumeLive(this.live);
    this.paint();
  }

  /** "Break" — or the home icon, which is the same promise kept more quietly. */
  suspend(): void {
    if (this.finished) return;
    this.finished = true;
    this.stopTimers();
    this.tutor.stop();
    pauseLive(this.live);
    this.hooks.saveLive(this.live);
    this.hooks.commit();
    this.hooks.onBroken();
  }

  /** "End class" — mark everything, write the day, and let the summary open. */
  end(ending: ClassEnding = "ended"): ClassRecord | null {
    if (this.finished) return null;
    this.finished = true;
    this.stopTimers();

    this.tutor.finish(closingLine(this.live.right, this.live.right + this.live.wrong));

    const record = this.close(ending);
    this.hooks.onEnded(record);
    return record;
  }

  /**
   * Roll the class into every ladder it touched, exactly once.
   *
   * A class too short to have happened leaves no trace at all — a mis-tap, or
   * a call that never connected, should not paint a square on the calendar or
   * break a streak by being counted as a day.
   */
  private close(ending: ClassEnding): ClassRecord | null {
    // Closing banks the stretch that was still running, so the length of the
    // class is only known afterwards. Asking "was this worth keeping" before
    // that reads a meter that is up to thirty seconds behind — long enough to
    // throw away a short class the learner really did have.
    const record = closeLive(this.live, ending);
    const keep = worthKeeping(this.live);
    if (keep) scoreClass(this.progress, this.live, this.asks);

    this.progress.live = null;
    this.hooks.saveLive(null);

    if (!keep) {
      this.hooks.commit();
      return null;
    }

    this.progress.classes.push(record);
    if (this.progress.classes.length > 600) {
      this.progress.classes = this.progress.classes.slice(-600);
    }
    // The old round-shaped row is still written: the streak tile, `stats.ts`
    // and everything built on `sessions` keep working without knowing that a
    // round is now a class.
    this.progress.sessions.push({
      date: record.date,
      right: record.right,
      total: record.right + record.wrong,
      seconds: record.seconds
    });
    if (this.progress.sessions.length > 400) {
      this.progress.sessions = this.progress.sessions.slice(-400);
    }
    this.hooks.commit();
    return record;
  }

  destroy(): void {
    this.stopTimers();
    this.tutor.stop();
  }

  /** Reconnect after the call failed. */
  retry(): void {
    if (this.finished) return;
    this.view.setPhase("connecting");
    void this.tutor.start().then(() => this.present());
  }

  /* -------------------------------------------------------------- the plan */

  private get items(): readonly ClassItem[] {
    return this.agenda.items;
  }

  /** Where the lesson is, counting the spare tail as it is drawn on. */
  private current(): ClassItem | null {
    const items = this.items;
    if (this.live.cursor < items.length) return items[this.live.cursor] ?? null;
    const spare = this.agenda.spare[this.live.cursor - items.length];
    return spare ?? null;
  }

  /** Put the item under the cursor to the learner. */
  private present(): void {
    if (this.finished) return;
    // The call may have failed while this was waiting on it — `start()`
    // resolves either way, because a tutor that could not connect is a state
    // to show rather than an exception to throw. Painting "live" over the
    // error notice would leave the learner looking at "I'm listening" beside a
    // microphone that was never opened.
    if (!this.tutor.running) return;

    const item = this.current();
    if (!item) {
      // The plan has run out, which is a good class rather than a problem.
      this.view.setPhase("ended");
      this.end();
      return;
    }

    this.view.setPhase("live");
    this.view.setFocus(this.focusFor(item));
    this.view.setAsk(item.kind === "talk" ? null : this.askView(item));

    if (item.kind === "talk") {
      this.tutor.talk(item.direction);
      this.clearTalkTimer();
      // The stretch ends on a clock, not on the model's judgement: a tutor
      // that decided when a conversation was over would also be deciding what
      // came next, and the whole point is that the app owns the lesson. The
      // next question simply queues behind whatever is being said.
      this.talkTimer = window.setTimeout(
        () => this.advance(),
        item.minutes * 60_000 + TALK_GRACE_MS
      );
      return;
    }

    this.tutor.ask({
      key: item.id,
      prompt: item.direction,
      expects: item.expects,
      accepted: item.accepted,
      onAnswer: (answer) => this.answered(item, answer)
    });
  }

  private advance(): void {
    if (this.finished) return;
    this.clearTalkTimer();
    this.live.cursor += 1;
    this.hooks.saveLive(this.live);
    this.present();
  }

  /* -------------------------------------------------------------- marking */

  /**
   * Mark one answer.
   *
   * English meanings are judged generously — articles, "to" and gender tags
   * are ignored — and everything else literally, modulo umlauts and ß. That is
   * the same grader the typed round used, deliberately: a spoken class must
   * not quietly become an easier class, or the ladders stop comparing.
   */
  /**
   * An answer typed into the card.
   *
   * The whole point of the field is that speaking is not always possible — a
   * train, a shared office, a word the microphone keeps mishearing — so it is
   * live for as long as the question is, and the tutor reacts to what was
   * typed exactly as it reacts to what was said. The guard is in `ClassTutor`:
   * once a question has been answered it stops taking answers, so a learner
   * who types and then says the same thing is not marked twice.
   */
  typed(answer: string): void {
    if (this.finished) return;
    this.tutor.answer(answer);
  }

  /** The current question, as the card on the stage needs it. */
  private askView(ask: ClassAsk): ClassAskView {
    const total = this.items.length;
    return {
      kind:
        ask.kind === "vocab"
          ? "vocab"
          : ask.kind === "cell"
            ? "table"
            : ask.kind === "review"
              ? "review"
              : "sentence",
      question: ask.question,
      subject: ask.subject,
      // A gapped sentence carries its gloss; everything else is its own hint.
      hint: ask.kind === "blank" ? pick(ask.hint) : null,
      expects: ask.expects,
      done: Math.min(this.live.cursor, total),
      total
    };
  }

  private answered(ask: ClassAsk, given: string): void {
    const verdict: Verdict =
      ask.kind === "vocab" && ask.field === "meaning"
        ? judgeEnglish(given, ask.accepted)
        : judgeGerman(given, ask.accepted);

    noteAnswer(this.live, ask, verdict, given);
    this.hooks.saveLive(this.live);
    this.hooks.commit();
    this.view.setFocus(this.focusFor(ask));

    this.tutor.react(
      verdict,
      {
        given,
        expected: ask.answer,
        why: this.whyFor(ask)
      },
      () => this.advance()
    );
  }

  /** What the tutor is told to say after a wrong answer, beyond the answer. */
  private whyFor(ask: ClassAsk): string {
    if (ask.kind === "cell" && ask.example) return `${t().gridExample}: ${ask.example.de}`;
    return ask.why?.de ?? "";
  }

  /* ------------------------------------------------ what the tutor reports */

  /**
   * A correction, straight to the screen.
   *
   * It arrives while the tutor is silent and waiting for an answer to its tool
   * call, which is precisely what makes the ordering the learner asked for
   * possible: the corrected sentence is on screen before the correction is
   * spoken. Nothing here may be slow — persistence happens after the return.
   */
  private correction(correction: ReportedCorrection): void {
    this.view.correct({ said: correction.said, fixed: correction.fixed, why: correction.why });
    noteCorrection(this.live, correction.said, correction.fixed, correction.why);
    queueMicrotask(() => {
      this.hooks.saveLive(this.live);
      this.hooks.commit();
    });
  }

  /**
   * A question the tutor asked on its own account during conversation.
   *
   * These are logged for the day's summary and the book of errors, but they
   * never touch a streak or a table's clean-day chain: those are settled by
   * questions the app chose and marked itself. A model's opinion of an answer
   * is good enough to be worth revising and not good enough to be worth
   * scheduling on.
   */
  private reported(report: ReportedAnswer): void {
    if (report.correct) return;
    const subject = report.word || report.cell || report.question;
    if (!subject) return;

    this.live.mistakes.push({
      kind: report.topic === "vocab" ? "vocab" : report.topic === "table" ? "table" : "grammar",
      subject,
      prompt: report.question,
      expected: report.expected,
      given: report.said
    });
    queueMicrotask(() => {
      this.hooks.saveLive(this.live);
      this.hooks.commit();
    });
  }

  /* ----------------------------------------------------------------- view */

  private focusFor(item: ClassItem): ClassFocus {
    const s = t();
    const total = this.items.length;
    const done = Math.min(this.live.cursor, total);

    if (item.kind === "talk") {
      return { kind: "talk", title: s.classNowTalk, detail: item.subject, done, total };
    }
    const kind =
      item.kind === "vocab"
        ? "vocab"
        : item.kind === "cell"
          ? "table"
          : item.kind === "review"
            ? "review"
            : "sentence";
    const title =
      kind === "vocab"
        ? s.classNowVocab
        : kind === "table"
          ? s.classNowTable
          : kind === "review"
            ? s.classNowReview
            : s.classNowSentence;
    return { kind, title, detail: item.subject, done, total };
  }

  /** Redraw the parts of the screen the tutor's state owns. */
  private paint(): void {
    if (this.finished) return;
    const status = this.tutor.status();

    switch (status.phase) {
      case "connecting":
        this.view.setPhase("connecting");
        this.view.setVoice("thinking");
        break;
      case "error":
        this.view.setPhase(
          status.error?.code === "key_required" ? "needkey" : "error",
          status.error
        );
        this.view.setVoice("idle");
        break;
      case "ended":
      case "off":
        this.view.setVoice("idle");
        break;
      case "asking":
      case "talking":
        this.view.setVoice("speaking");
        break;
      case "listening":
        this.view.setVoice("listening");
        break;
      case "thinking":
        this.view.setVoice("thinking");
        break;
    }

    // The interim line beside the orb is a hint about the microphone, not the
    // record — the record is the log, which the transcript callback appends to
    // once per turn. Writing to both from here is what made the first version
    // overwrite its own history.
    this.view.setLive(status.heard);
  }

  /** The clock is the class's own, not the call's: a break stops it. */
  private startClock(): void {
    this.stopClock();
    const tick = (): void => {
      if (this.finished) return this.stopClock();
      this.view.setClock(liveSeconds(this.live));
    };
    tick();
    this.clockTimer = window.setInterval(tick, 1000);
  }

  private stopClock(): void {
    if (this.clockTimer !== null) window.clearInterval(this.clockTimer);
    this.clockTimer = null;
  }

  private clearTalkTimer(): void {
    if (this.talkTimer !== null) window.clearTimeout(this.talkTimer);
    this.talkTimer = null;
  }

  private stopTimers(): void {
    this.stopClock();
    this.clearTalkTimer();
  }
}

/** The tutor's last line, for a class that ended on an error rather than a plan. */
export function classError(error: unknown): string {
  return describeVoiceError(error);
}

/** Today, as the class reckons it. Exported so the app and the run agree. */
export function classToday(): string {
  return todayISO();
}
