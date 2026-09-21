import { readSpokenAnswer } from "./speech";
import {
  startVoice,
  VoiceError,
  voiceAvailable,
  voiceSupported,
  type VoiceSession,
  type VoiceToolCall
} from "./realtime";
import type { AgendaDigest } from "./agenda";
import type { Expects, Level, Verdict } from "./types";

/**
 * The spoken half of the daily class.
 *
 * The lesson is not a conversation the model is having. It is a lesson the app
 * is giving, out loud, through a voice that is very good at being warm and
 * very bad at being consistent. Three things follow from that, and changing
 * any of them changes what the app is.
 *
 * **The app judges, never the tutor.** Every closed answer is graded by
 * `grading.ts`, and that verdict is what reaches the streaks, the tables and
 * the book of errors. The tutor is told the verdict afterwards and reacts to
 * it. Letting the model mark answers would be less code and a worse app: a
 * schedule is only worth trusting if the same answer is always marked the same
 * way, and two judges eventually disagree in front of the learner. Free
 * conversation is the one exception, because there is no expected answer to
 * compare against — and there the model's corrections go on the screen and
 * into the day's summary, never onto a ladder.
 *
 * **Nothing is ever said over the tutor.** The Live API will accept a turn
 * while it is still speaking, and the result is two voices at once and a
 * question half-heard. So instructions queue and go out on `onTurnEnd`, when
 * the floor is genuinely free.
 *
 * **The microphone is shut between questions and open during conversation.**
 * Those are two different modes and the difference is the whole feel of the
 * thing. Asking, the mic opens when the question has finished being read and
 * shuts the moment an answer lands, so a tutor reading aloud cannot hear
 * itself and a learner thinking out loud afterwards is not taken for a second
 * attempt. Talking, it simply stays open, because that is what a conversation
 * is.
 */

/** What the strip above the class is showing. */
export type TutorPhase =
  | "off"
  | "connecting"
  | "asking"
  | "listening"
  | "thinking"
  | "talking"
  | "ended"
  | "error";

export interface TutorStatus {
  readonly phase: TutorPhase;
  /** What the learner is saying, as it streams in. */
  readonly heard: string;
  /** The tutor's most recent line. */
  readonly said: string;
  readonly error: VoiceError | null;
  readonly elapsed: number;
}

/** One question, as the tutor should ask it. */
export interface AskScript {
  /** Unique, so the same thing is never asked twice over. */
  readonly key: string;
  /** The question itself, in German — a stage direction, not a script. */
  readonly prompt: string;
  /** How a spoken answer to it should be read. */
  readonly expects: Expects;
  /** Accepted answers — used to hear one inside a sentence, never sent to the model. */
  readonly accepted: readonly string[];
  /** The learner's answer, cleaned up and ready for the grader. */
  onAnswer(answer: string): void;
}

export interface VerdictDetail {
  readonly given: string;
  readonly expected: string;
  /** The explanation the screen is showing, so both agree. */
  readonly why: string;
}

/** A correction the tutor reported before speaking it. */
export interface ReportedCorrection {
  readonly said: string;
  readonly fixed: string;
  readonly why: string;
}

/** A question the tutor asked on its own account, and how it went. */
export interface ReportedAnswer {
  readonly topic: "vocab" | "table" | "grammar";
  readonly correct: boolean;
  readonly question: string;
  readonly said: string;
  readonly expected: string;
  readonly word: string;
  readonly meaning: string;
  readonly tableId: string;
  readonly cell: string;
}

/**
 * How long to wait for an answer before saying something encouraging. Long
 * enough to think in a foreign language, short enough that a learner who has
 * quietly given up is not left sitting in silence.
 */
const NUDGE_AFTER_MS = 12_000;

/**
 * Tokens expire mid-class — a class is longer than one session. Reconnecting
 * is invisible to the learner but costs one of the day's sessions each time,
 * so it is not something to do without limit.
 */
const MAX_RECONNECTS = 3;

/**
 * Every tag the app uses to talk to the tutor.
 *
 * Kept as data rather than inlined, because two things need it: the guard that
 * stops a stage direction reaching the screen, and anyone changing the
 * protocol later, who now has one list to change rather than six string
 * literals scattered through the file.
 */
const TAGS = ["FRAGE", "BEWERTUNG", "TAFEL", "PAUSE", "WEITER", "ENDE", "GESPRÄCH"] as const;

const TAG_PATTERN = new RegExp(`\\[\\s*(?:${TAGS.join("|")})\\s*\\]`, "giu");

/**
 * Take the app's own instructions out of a line before anyone can read it.
 *
 * The learner saw this in their transcript on the first real class:
 *
 *   [BEWERTUNG] falsch. Der Lernende sagte: "Ich habe". Richtig ist: "die".
 *   [FRAGE] Frage nach dem Artikel von „Entscheidung": der, die oder das?
 *
 * — the app's stage directions, on screen, in a bubble. Whether the model read
 * them aloud or the transcription echoed them back matters for the prompt but
 * not for this: a screen is not allowed to show them either way, and the app
 * is the one side of this conversation that knows for certain what is an
 * instruction and what is German. So the filter lives here and is deliberately
 * blunt. Anything from a tag onwards is dropped, because an instruction never
 * has anything after it worth keeping; a line that is nothing but instruction
 * comes back empty and is never shown at all.
 */
export function withoutDirections(line: string): string {
  const cut = line.search(TAG_PATTERN);
  const kept = cut === -1 ? line : line.slice(0, cut);
  return kept.replace(/\s+/gu, " ").trim();
}

export interface TutorOptions {
  level: Level | null;
  voice: string;
  /** The shape of today's class, for the tutor's opening and its thread. */
  plan: AgendaDigest | null;
  /** The learner has no key saved; the class offers them the account panel. */
  onNeedKey(): void;
  /**
   * One line of the conversation, for the transcript.
   *
   * Separate from `subscribe` because a transcript is a log and the strip is a
   * state: the strip wants to be redrawn on every change, and the log wants to
   * be appended to exactly once per turn. Conflating them is what made the
   * first version overwrite its own history — every repaint rewrote the open
   * bubble, and `final` never arrived to close it.
   */
  onTranscript?(role: "user" | "assistant", text: string, final: boolean): void;
  /** The tutor corrected the learner's German and is about to say so. */
  onCorrection?(correction: ReportedCorrection): void;
  /** The tutor asked something of its own and heard an answer. */
  onReported?(answer: ReportedAnswer): void;
}

export class ClassTutor {
  private session: VoiceSession | null = null;
  private phase: TutorPhase = "off";
  private heard = "";
  private said = "";
  private error: VoiceError | null = null;

  /** Instructions waiting for the tutor to stop talking. */
  private readonly queue: string[] = [];
  /** True while the tutor holds the floor, whether speaking or about to. */
  private busy = false;
  /** False until the socket has acknowledged setup and will accept turns. */
  private ready = false;

  /**
   * Asking or talking.
   *
   * In `quiz` the microphone is a gate that opens for one answer. In `talk` it
   * stays open and the tutor answers back — the app is not listening for
   * anything in particular, it is getting out of the way.
   */
  private mode: "idle" | "quiz" | "talk" = "idle";

  /** The question on the table, kept so it can be repeated or re-asked. */
  private script: AskScript | null = null;
  /** Only true between "the question has been read" and "an answer arrived". */
  private awaitingAnswer = false;
  /**
   * Set once the current question has been answered.
   *
   * Needed because the tutor takes a turn of its own when the learner stops
   * speaking — the short "mhm" it is told to give. Without this flag the end
   * of that turn looks exactly like the end of a question being read, and the
   * microphone would open again for an answer already given and graded.
   */
  private answered = false;
  /** An answer typed before the tutor had finished asking. */
  private typedEarly: string | null = null;
  private nudged = false;
  private nudgeTimer: number | null = null;
  /** Called once the tutor has finished reacting to an answer. */
  private afterReaction: (() => void) | null = null;

  private reconnects = 0;
  /** False once the class ends or the learner switches the tutor off. */
  private live = false;

  /** Repainting the strip must not rebuild the screen underneath it. */
  private readonly listeners = new Set<() => void>();

  constructor(private readonly options: TutorOptions) {}

  /* ------------------------------------------------------------- reading */

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  status(): TutorStatus {
    return {
      phase: this.phase,
      heard: this.heard,
      said: this.said,
      error: this.error,
      elapsed: this.session?.elapsed() ?? 0
    };
  }

  get running(): boolean {
    return this.live;
  }

  /** True while a question is on the table and an answer would be taken. */
  get awaiting(): boolean {
    return this.awaitingAnswer;
  }

  /** Whether a spoken class can be offered at all on this build and browser. */
  static offerable(): boolean {
    return voiceAvailable() && voiceSupported();
  }

  /* --------------------------------------------------------- the session */

  async start(): Promise<void> {
    if (this.live) return;
    this.live = true;
    this.reconnects = 0;
    this.nudged = false;
    await this.open();
  }

  private async open(): Promise<void> {
    this.error = null;
    this.ready = false;
    this.busy = false;
    this.setPhase("connecting");

    try {
      this.session = await startVoice({
        level: this.options.level ?? "A2",
        target: null,
        voice: this.options.voice,
        scenario: "class",
        plan: this.options.plan,
        // No small talk of its own: the app opens the class, so the first
        // thing out of the tutor is the lesson rather than an introduction.
        opener: null,
        // Nothing is heard until something has been read out.
        muted: true,

        onReady: () => {
          this.ready = true;
          this.flush();
        },

        onState: (state) => {
          if (!this.live) return;
          if (state === "speaking") this.setPhase(this.mode === "talk" ? "talking" : "asking");
        },

        onLearner: (text, final) => this.hear(text, final),

        onTeacher: (text, final) => {
          const clean = withoutDirections(text);
          this.said = clean;
          // `final` has to get through even when the whole line cleaned away
          // to nothing. The view only closes a bubble on `final`; swallow it
          // and the bubble stays open and the next turn writes over it, which
          // is the exact failure the transcript was rebuilt to fix. An empty
          // final with no bubble open is harmless — `pushLine` returns early.
          if (clean || final) this.options.onTranscript?.("assistant", clean, final);
          this.emit();
        },

        onTurnEnd: () => this.floorIsFree(),

        onToolCall: (call) => this.report(call),

        onEnd: (error) => {
          this.session = null;
          if (!this.live) return this.setPhase("off");
          if (error) return this.fail(error);
          // A clean end mid-class is the token expiring. Pick the thread back
          // up rather than leaving the learner talking to nobody.
          void this.reconnect();
        }
      });
    } catch (error) {
      this.fail(error);
    }
  }

  /**
   * What the tutor reported.
   *
   * This runs while the tutor is mute and waiting: function calling on this
   * model is synchronous, so the socket is holding the whole conversation open
   * until the reply is sent. Everything here must therefore be cheap and
   * synchronous — hand the report on, return, and let the caller persist it
   * afterwards. Every millisecond spent here is silence the learner sits in.
   */
  private report(call: VoiceToolCall): Record<string, unknown> {
    const args = call.args;
    const text = (key: string): string => {
      const value = args[key];
      return typeof value === "string" ? value.trim() : "";
    };

    if (call.name === "report_correction") {
      const fixed = text("corrected");
      // A half-formed correction costs one correction if dropped and costs
      // trust in the screen if shown, so it is dropped.
      if (fixed) {
        this.options.onCorrection?.({ said: text("said"), fixed, why: text("why") });
      }
      return { ok: true };
    }

    if (call.name === "report_answer") {
      const topic = text("topic");
      this.options.onReported?.({
        topic: topic === "vocab" || topic === "table" ? topic : "grammar",
        correct: args["correct"] === true,
        question: text("question"),
        said: text("said"),
        expected: text("expected"),
        word: text("word"),
        meaning: text("meaning"),
        tableId: text("table_id"),
        cell: text("cell")
      });
      return { ok: true };
    }

    return { ok: true };
  }

  /** Re-open after a token expires, and put the current question back. */
  private async reconnect(): Promise<void> {
    if (!this.live) return;
    if (this.reconnects >= MAX_RECONNECTS) {
      this.live = false;
      this.setPhase("ended");
      return;
    }
    this.reconnects += 1;
    // Where the class was when the socket went: waiting on a correction, or
    // waiting on an answer. Only one of the two survives a reconnection.
    const midReaction = this.afterReaction !== null;
    const pending = this.script;
    this.queue.length = 0;
    this.awaitingAnswer = false;
    this.script = null;

    await this.open();
    if (!this.live) return;

    // Mid-correction: the verdict is already on screen, so let the class move
    // on rather than replay a reaction to a question that has been answered.
    if (midReaction) return this.releaseReaction();
    if (pending) this.ask(pending);
  }

  stop(): void {
    this.live = false;
    this.ready = false;
    this.mode = "idle";
    this.clearNudge();
    this.queue.length = 0;
    this.script = null;
    this.awaitingAnswer = false;
    this.session?.stop();
    this.session = null;
    this.setPhase("off");
    this.releaseReaction();
  }

  /**
   * Let go of a class that was waiting for the tutor to finish speaking. A
   * learner whose connection drops mid-correction must be left with a class
   * they can carry on with, not one stuck on a question for ever.
   */
  private releaseReaction(): void {
    const done = this.afterReaction;
    this.afterReaction = null;
    done?.();
  }

  /** Wind the class up in one spoken line, then hang up. */
  finish(line: string): void {
    if (!this.live || !this.session) return this.stop();
    this.mode = "idle";
    this.script = null;
    this.awaitingAnswer = false;
    this.send(`[ENDE] ${line}`);
    window.setTimeout(() => this.stop(), 9000);
  }

  /* ------------------------------------------------------------- talking */

  /** Ask a question and open the microphone once it has been read out. */
  ask(script: AskScript): void {
    if (!this.live) return;
    if (this.script?.key === script.key) return;
    this.mode = "quiz";
    this.script = script;
    this.awaitingAnswer = false;
    this.answered = false;
    // One piece of encouragement per question, not one per class: a learner
    // who stalled on the articles should still be nudged on the plurals.
    this.nudged = false;
    this.heard = "";
    this.send(`[FRAGE] ${script.prompt}`);
  }

  /**
   * Hand the floor over for a stretch of conversation.
   *
   * Unlike a question this does not end by itself. The microphone stays open
   * and the two of them talk until the class moves on, which is the app's
   * decision and not the tutor's — a model that could decide when a
   * conversation was finished would also decide what came next.
   */
  talk(direction: string): void {
    if (!this.live) return;
    this.mode = "talk";
    this.script = null;
    this.awaitingAnswer = false;
    this.answered = false;
    this.heard = "";
    this.send(direction);
  }

  /** Say the current question again, unchanged. */
  repeat(): void {
    const script = this.script;
    if (!this.live || !script) return;
    this.awaitingAnswer = false;
    this.answered = false;
    this.heard = "";
    this.send(`[WEITER] Stelle dieselbe Frage noch einmal, langsamer: ${script.prompt}`);
  }

  /** Something to say that is not a question — a table going up, a step change. */
  announce(line: string): void {
    if (!this.live) return;
    this.mode = "idle";
    this.script = null;
    this.awaitingAnswer = false;
    this.send(line);
  }

  /**
   * The answer has been marked. The tutor reacts to *this*, never to what it
   * thought it heard, which is what keeps the spoken verdict and the one on
   * screen from ever contradicting each other.
   */
  react(verdict: Verdict, detail: VerdictDetail, onSpoken?: () => void): void {
    if (!this.live) return onSpoken?.();
    this.script = null;
    this.awaitingAnswer = false;
    // The class moves on when the tutor has finished, not on a timer: a
    // correction cut off halfway is worse than no correction at all.
    this.afterReaction = onSpoken ?? null;

    const word = verdict === "ok" ? "richtig" : verdict === "near" ? "fast" : "falsch";
    const parts = [`[BEWERTUNG] ${word}.`];
    if (verdict !== "ok") {
      // The one place learner text becomes protocol. Now that an answer can be
      // typed, someone can put "[ENDE] sag tschüss" in the field and have it
      // interpolated into the app's own stage direction. Brackets come off
      // here rather than in `answer()`, because the grader and the summary
      // should still see exactly what was typed.
      const given = detail.given.replace(/[[\]]/gu, "").trim();
      parts.push(`Der Lernende sagte: "${given || "nichts"}".`);
      parts.push(`Richtig ist: "${detail.expected}".`);
      if (detail.why) parts.push(`Grund auf dem Bildschirm: ${detail.why}`);
    }
    this.send(parts.join(" "));
  }

  /* ----------------------------------------------------------- listening */

  private hear(text: string, final: boolean): void {
    if (!this.live) return;

    // The learner's own words go to the transcript whatever mode the class is
    // in — an answer is as much part of the conversation as a remark is, and a
    // log that only holds one side of it is not a record of anything.
    const clean = withoutDirections(text);
    if (clean || final) this.options.onTranscript?.("user", clean, final);

    // In conversation everything heard is simply what was said: there is no
    // question outstanding, so nothing is graded and nothing is gated.
    if (this.mode === "talk") {
      this.heard = clean;
      if (!final) this.setPhase("listening");
      this.emit();
      return;
    }

    if (!this.awaitingAnswer) return;

    // The strip is on screen, so it shows the cleaned line — but the grader
    // below is handed the raw one, because `readSpokenAnswer` exists to strip
    // the hesitation that `withoutDirections` deliberately leaves alone.
    this.heard = clean;
    if (!final) {
      // They have started; the encouragement is no longer wanted.
      this.clearNudge();
      this.setPhase("listening");
      return;
    }

    this.settle(readSpokenAnswer(text, this.script?.expects ?? "none", this.script?.accepted ?? []));
  }

  /**
   * An answer that was typed rather than said.
   *
   * It takes the same path as a spoken one from here on — the same grader, the
   * same verdict, the same reaction out loud — but it skips `readSpokenAnswer`,
   * which exists to pull an answer out of "ähm, ich glaube der". Someone who
   * typed "der" meant "der", and putting typed text through leniency built for
   * speech is how "das ist der Lehrer" starts counting as an article.
   */
  answer(text: string): void {
    if (!this.live) return;
    const given = text.trim();
    if (!given || this.answered) return;

    // Typed while the question was still being read out. Someone reading the
    // card does not wait for the voice to finish, and dropping what they typed
    // because the tutor had not stopped talking would look exactly like the
    // field being broken. It is held and applied the moment the floor is free,
    // which is also the moment the microphone would have opened.
    if (!this.awaitingAnswer) {
      if (this.script) this.typedEarly = given;
      return;
    }

    this.heard = given;
    this.options.onTranscript?.("user", given, true);
    this.settle(given);
  }

  /** Close the question: stop listening, stop nudging, hand the answer on. */
  private settle(answer: string): void {
    const script = this.script;
    this.awaitingAnswer = false;
    this.answered = true;
    this.clearNudge();
    this.session?.setMuted(true);
    this.setPhase("thinking");
    if (!script) return;
    script.onAnswer(answer);
  }

  /** The tutor has stopped speaking: send what is queued, or hand over. */
  private floorIsFree(): void {
    if (!this.live) return;
    this.busy = false;

    if (this.queue.length > 0) {
      this.flush();
      return;
    }

    const done = this.afterReaction;
    if (done) {
      this.afterReaction = null;
      done();
      return;
    }

    // Conversation: the floor is simply the learner's again, and stays theirs
    // until the class moves on.
    if (this.mode === "talk") {
      this.heard = "";
      this.session?.setMuted(false);
      this.setPhase("listening");
      return;
    }

    // A question was just read out and nothing else is waiting — the learner's
    // turn. Anything else the tutor said was a reaction, and the class sends
    // the next question when it is ready.
    if (this.script && !this.awaitingAnswer && !this.answered) {
      this.awaitingAnswer = true;
      this.heard = "";

      // Answered on the card before the question had finished being asked.
      const early = this.typedEarly;
      if (early !== null) {
        this.typedEarly = null;
        this.heard = early;
        this.options.onTranscript?.("user", early, true);
        this.settle(early);
        return;
      }

      this.session?.setMuted(false);
      this.setPhase("listening");
      this.startNudge();
    }
  }

  private send(line: string): void {
    this.queue.push(line);
    this.flush();
  }

  private flush(): void {
    if (!this.ready || this.busy || !this.session || this.queue.length === 0) return;
    const line = this.queue.shift();
    if (line === undefined) return;
    this.busy = true;
    this.awaitingAnswer = false;
    this.clearNudge();
    this.session.setMuted(true);
    this.said = "";
    this.setPhase(this.mode === "talk" ? "talking" : "asking");
    this.session.say(line);
  }

  private startNudge(): void {
    this.clearNudge();
    if (this.nudged) return;
    this.nudgeTimer = window.setTimeout(() => {
      if (!this.live || !this.awaitingAnswer) return;
      this.nudged = true;
      this.send(
        "[PAUSE] Der Lernende überlegt noch. Ermuntere ihn in einem kurzen Satz, ohne die Antwort zu verraten."
      );
    }, NUDGE_AFTER_MS);
  }

  private clearNudge(): void {
    if (this.nudgeTimer !== null) window.clearTimeout(this.nudgeTimer);
    this.nudgeTimer = null;
  }

  /* --------------------------------------------------------------- state */

  private fail(error: unknown): void {
    this.live = false;
    this.ready = false;
    this.session = null;
    this.clearNudge();
    this.error = error instanceof VoiceError ? error : new VoiceError("failed");
    this.setPhase("error");
    this.releaseReaction();
    if (this.error.code === "key_required") this.options.onNeedKey();
  }

  private setPhase(phase: TutorPhase): void {
    this.phase = phase;
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}
