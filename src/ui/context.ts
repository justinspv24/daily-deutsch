import type { Learner, Level, Progress, SessionState } from "../types";

export type Route = "loading" | "login" | "level" | "home" | "drill" | "summary" | "progress";

/** Everything a view needs from the app shell, and nothing more. */
export interface AppContext {
  readonly progress: Progress;
  readonly session: SessionState | null;
  readonly learner: Learner | null;
  /** Re-render the current route in place. */
  refresh(): void;
  go(route: Route): void;
  startSession(): void;
  /** Pick (or change) the level; the content bank switches with it. */
  setLevel(level: Level): void;
  /** Persist after a graded answer. */
  commit(): void;
}
