import type { Learner, Progress, SessionState } from "../types";

export type Route = "home" | "drill" | "summary" | "progress";

/** Everything a view needs from the app shell, and nothing more. */
export interface AppContext {
  readonly progress: Progress;
  readonly session: SessionState | null;
  readonly learner: Learner | null;
  /** Re-render the current route in place. */
  refresh(): void;
  go(route: Route): void;
  startSession(): void;
  /** Persist after a graded answer. */
  commit(): void;
}
