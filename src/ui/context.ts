import type { DrillTutor } from "../tutor";
import type { Learner, Level, Progress, SessionState, VocabItem } from "../types";

export type Route = "loading" | "login" | "recovery" | "level" | "home" | "drill" | "summary" | "progress";

/** Everything a view needs from the app shell, and nothing more. */
export interface AppContext {
  readonly progress: Progress;
  readonly session: SessionState | null;
  readonly learner: Learner | null;
  /**
   * The spoken tutor, when the round is being done out loud. It outlives every
   * redraw of the question, which is the point: a conversation cannot be
   * rebuilt from scratch each time a field is filled in.
   */
  readonly tutor: DrillTutor | null;
  /** Re-render the current route in place. */
  refresh(): void;
  go(route: Route): void;
  /** Begin a round. `spoken` opens it with the tutor reading the questions out. */
  startSession(spoken?: boolean): void;
  /** Pick (or change) the level; the content bank switches with it. */
  setLevel(level: Level): void;
  /** Add a word of the learner's own to the vocabulary drill. */
  addWord(item: VocabItem): void;
  /** Remove one they added. Bank words cannot be removed. */
  removeWord(id: string): void;
  /** Jump to the first unanswered question of a step, mid-round. */
  jumpToStep(step: number): void;
  /** Leave the new-password screen once the password has been saved. */
  finishRecovery(): void;
  /** Persist after a graded answer. */
  commit(): void;
}
