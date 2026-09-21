import type { ClassRecord, Learner, Level, Progress, VocabItem } from "../types";

export type Route =
  | "loading"
  | "login"
  | "recovery"
  | "level"
  | "home"
  | "classroom"
  | "summary"
  | "profile"
  | "syllabus"
  | "podcasts";

/** Everything a view needs from the app shell, and nothing more. */
export interface AppContext {
  readonly progress: Progress;
  readonly learner: Learner | null;
  /**
   * The class that just ended, for the summary to read.
   *
   * It is the record rather than the class itself because by the time the
   * summary is drawn the class is over: its ladders have been rolled forward
   * and `progress.live` has been cleared. A summary is a photograph, and this
   * is the photograph.
   */
  readonly lastClass: ClassRecord | null;
  /**
   * A class the day ran out on, found and closed at boot. Home says so once —
   * a card, not a modal: the learner did nothing wrong by falling asleep, and
   * the work was saved.
   */
  readonly autoClosed: ClassRecord | null;
  /** Stop showing the auto-closed card. */
  dismissAutoClosed(): void;
  /** Re-render the current route in place. */
  refresh(): void;
  go(route: Route): void;
  /** Open the classroom — resuming the class still open, or starting today's. */
  startClass(): void;
  /** Pick (or change) the level; the content bank switches with it. */
  setLevel(level: Level): void;
  /** Add a word of the learner's own to the class's vocabulary. */
  addWord(item: VocabItem): void;
  /** Remove one they added. Bank words cannot be removed. */
  removeWord(id: string): void;
  /** Leave the new-password screen once the password has been saved. */
  finishRecovery(): void;
  /** Persist after something changed. */
  commit(): void;
}
