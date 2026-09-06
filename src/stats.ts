import { curriculumFor } from "./data/curriculum";
import { consecutiveDays } from "./scheduler";
import type { Progress } from "./types";

/** The three numbers the home screen leads with. */
export interface Stats {
  /** Consecutive days with at least one finished round. */
  readonly streak: number;
  /** Words and table sentences of the current level that have sat twice in a row. */
  readonly mastered: number;
  readonly masteredTotal: number;
  /** Share of correct answers over the recent rounds; null before the first. */
  readonly accuracy: number | null;
}

const RECENT_ROUNDS = 14;

export function computeStats(progress: Progress): Stats {
  const bank = curriculumFor(progress.level);
  const words = bank.vocab.filter((item) => (progress.vocab[item.id]?.streak ?? 0) >= 2).length;
  const sentences = bank.grammar.filter((item) => (progress.grammar[item.id]?.streak ?? 0) >= 2).length;

  const recent = progress.sessions.slice(-RECENT_ROUNDS);
  const right = recent.reduce((sum, round) => sum + round.right, 0);
  const total = recent.reduce((sum, round) => sum + round.total, 0);

  return {
    streak: consecutiveDays(progress.sessions),
    mastered: words + sentences,
    masteredTotal: bank.vocab.length + bank.grammar.length,
    accuracy: total > 0 ? Math.round((right / total) * 100) : null
  };
}
