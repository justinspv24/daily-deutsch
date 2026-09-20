import { readSpokenAnswer, type Expects } from "./speech";
import {
  startVoice,
  VoiceError,
  voiceAvailable,
  voiceSupported,
  type VoiceSession
} from "./realtime";
import type { Level, Verdict } from "./types";

/**
 * The spoken half of the daily round.
 *
 * Voice mode used to be a room you went into: a button, a panel, a
 * conversation, and then back to typing. This is the opposite — the tutor sits
 * with the learner for the whole round, reads out every question as it comes
 * up, hears the answer, and says something about it before the next one. The
 * drill on screen does not change. It is the same questions in the same order
 * with the same grading; it has simply acquired a voice.
 *
 * Three things are worth understanding before changing anything here.
 *
 * **The app judges, not the tutor.** Every answer is graded by `grading.ts`
 * exactly as a typed one is, and that verdict is what reaches the streaks and
 * the review schedule. The tutor is told the verdict afterwards and reacts to
 * it. Letting the model mark the answers would have been less code and a worse
 * app: the schedule is only worth trusting if the same answer is always marked
 * the same way, and two judges eventually disagree in front of the learner.
 *
 * **Nothing is ever said over the tutor.** The Live API will happily accept a
 * turn while it is still speaking, and the result is two voices at once and a
 * question the learner half-heard. So instructions queue up and go out on
 * `onTurnEnd`, when the floor is genuinely free.
 *
 * **The microphone is shut between turns.** It opens when a question has
 * finished being read and closes the moment an answer lands. A tutor reading
 * the next question must not hear itself, and a learner thinking out loud
 * after they have answered should not have it taken for a second attempt.
 */

/** What the strip above the question is showing. */
export type TutorPhase =
  | "off"
  | "connecting"
  | "asking"
  | "listening"
  | "thinking"
  | "ended"
  | "error";

export interface TutorStatus {
  readonly phase: TutorPhase;
  /** What the learner is saying, as it streams in. */
  readonly heard: string;
  /** The tutor's most recent line. */
  readonly said: string;
  /** Set when the session could not start or could not carry on. */
  readonly error: VoiceError | null;
  /** Seconds since the call connected. */
  readonly elapsed: number;
}

/** One question, as the tutor should ask it. */
export interface AskScript {
  /** Question plus field, so the same thing is never asked twice over. */
  readonly key: string;
  /** The question itself, in German. */
  readonly prompt: string;
  /** How a spoken answer to it should be read. */
  readonly expects: Expects;
  /** Accepted answers — used to hear one inside a sentence, never sent to the model. */
  readonly accepted: readonly string[];
  /** The learner's answer, cleaned up and ready for the grader. */
  onAnswer(answer: string): void;
}

export interface VerdictDetail {
  /** What they said. */
  readonly given: string;
  /** What it should have been. */
  readonly expected: string;
  /** The explanation already on screen, so both agree. */
  readonly why: string;
}

/**
 * How long to wait for an answer before saying something encouraging. Long
 * enough to think in a foreign language, short enough that a learner who has
 * quietly given up is not left sitting in silence.
 */
const NUDGE_AFTER_MS = 12_000;

/**
 * Tokens expire mid-round — a round is longer than one session. Reconnecting
 * is invisible to the learner but costs one of the day's sessions each time,
 * so it is not something to do without limit.
 */
const MAX_RECONNECTS = 3;

export interface TutorOptions {
  level: Level | null;
  voice: string;
  /** The learner has no key saved; the drill offers them the account panel. */
  onNeedKey(): void;
}

export class DrillTutor {
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
  private nudged = false;
  private nudgeTimer: number | null = null;
  /** Called once the tutor has finished reacting to an answer. */
  private afterReaction: (() => void) | null = null;

  private reconnects = 0;
  /** False once the round ends or the learner switches the tutor off. */
  private live = false;

  /** Repainting the strip must not rebuild the card underneath it. */
  private readonly listeners = new Set<() => void>();

  constructor(private readonly options: TutorOptions) {}

  /* ------------------------------------------------------------- reading */

  /** Redraw on every change of state, for as long as the returned function is unused. */
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

  /** Whether the tutor can be offered at all on this build and browser. */
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
        scenario: "drill",
        // No small talk. The round's first question is the opening turn, so
        // the tutor starts by teaching instead of by introducing itself.
        opener: null,
        // Nothing is heard until a question has been read out.
        muted: true,

        onReady: () => {
          this.ready = true;
          this.flush();
        },

        onState: (state) => {
          if (!this.live) return;
          if (state === "speaking") this.setPhase("asking");
        },

        onLearner: (text, final) => this.hear(text, final),

        onTeacher: (text) => {
          this.said = text;
          this.emit();
        },

        onTurnEnd: () => this.floorIsFree(),

        onEnd: (error) => {
          this.session = null;
          if (!this.live) return this.setPhase("off");
          if (error) return this.fail(error);
          // A clean end mid-round is the token expiring. Pick the thread back
          // up rather than leaving the learner talking to nobody.
          void this.reconnect();
        }
      });
    } catch (error) {
      this.fail(error);
    }
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
    // Where the round was when the socket went: waiting on a correction, or
    // waiting on an answer. Only one of the two survives a reconnection.
    const midReaction = this.afterReaction !== null;
    const pending = this.script;
    this.queue.length = 0;
    this.awaitingAnswer = false;
    this.script = null;

    await this.open();
    if (!this.live) return;

    // Mid-correction: the verdict is already on screen, so let the round move
    // on rather than replay a reaction to a question that has been answered.
    if (midReaction) return this.releaseReaction();
    // Mid-question: ask it again rather than skipping it.
    if (pending) this.ask(pending);
  }

  stop(): void {
    this.live = false;
    this.ready = false;
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
   * Let go of a round that was waiting for the tutor to finish speaking. A
   * learner whose connection drops mid-correction must be left with a drill
   * they can carry on typing into, not one stuck on a question for ever.
   */
  private releaseReaction(): void {
    const done = this.afterReaction;
    this.afterReaction = null;
    done?.();
  }

  /** Wind the round up in one spoken line, then hang up. */
  finish(line: string): void {
    if (!this.live || !this.session) return this.stop();
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
    this.script = script;
    this.awaitingAnswer = false;
    this.answered = false;
    // One piece of encouragement per question, not one per round: a learner
    // who stalled on the articles should still be nudged on the plurals.
    this.nudged = false;
    this.heard = "";
    this.send(`[FRAGE] ${script.prompt}`);
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

  /** Something to say that is not a question — a table to read, a step change. */
  announce(line: string): void {
    if (!this.live) return;
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
    // The round moves on when the tutor has finished, not on a timer: a
    // correction cut off halfway is worse than no correction at all.
    this.afterReaction = onSpoken ?? null;

    const word = verdict === "ok" ? "richtig" : verdict === "near" ? "fast" : "falsch";
    const parts = [`[BEWERTUNG] ${word}.`];
    if (verdict !== "ok") {
      parts.push(`Der Lernende sagte: "${detail.given || "nichts"}".`);
      parts.push(`Richtig ist: "${detail.expected}".`);
      if (detail.why) parts.push(`Grund auf dem Bildschirm: ${detail.why}`);
    }
    this.send(parts.join(" "));
  }

  /* ----------------------------------------------------------- listening */

  private hear(text: string, final: boolean): void {
    if (!this.live || !this.awaitingAnswer) return;

    this.heard = text;
    if (!final) {
      // They have started; the encouragement is no longer wanted.
      this.clearNudge();
      this.setPhase("listening");
      return;
    }

    const script = this.script;
    this.awaitingAnswer = false;
    this.answered = true;
    this.clearNudge();
    this.session?.setMuted(true);
    this.setPhase("thinking");
    if (!script) return;

    script.onAnswer(readSpokenAnswer(text, script.expects, script.accepted));
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

    // A question was just read out and nothing else is waiting — the learner's
    // turn. Anything else the tutor said was a reaction, and the drill sends
    // the next question when it is ready.
    if (this.script && !this.awaitingAnswer && !this.answered) {
      this.awaitingAnswer = true;
      this.heard = "";
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
    this.setPhase("asking");
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

  /** Redraw the strip. Never rebuilds the question underneath it. */
  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}
