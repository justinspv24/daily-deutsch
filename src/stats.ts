import { GRAMMAR } from "./data/grammar";
import { VOCAB } from "./data/vocab";
import { consecutiveDays } from "./scheduler";
import type { Progress } from "./types";

/** The three numbers the home screen leads with. */
export interface Stats {
  /** Consecutive days with at least one finished round. */
  readonly streak: number;
  /** Words and table sentences that have sat twice in a row. */
  readonly mastered: number;
  readonly masteredTotal: number;
  /** Share of correct answers over the recent rounds; null before the first. */
  readonly accuracy: number | null;
}

const RECENT_ROUNDS = 14;

export function computeStats(progress: Progress): Stats {
  const words = VOCAB.filter((item) => (progress.vocab[item.id]?.streak ?? 0) >= 2).length;
  const sentences = GRAMMAR.filter((item) => (progress.grammar[item.id]?.streak ?? 0) >= 2).length;

  const recent = progress.sessions.slice(-RECENT_ROUNDS);
  const right = recent.reduce((sum, round) => sum + round.right, 0);
  const total = recent.reduce((sum, round) => sum + round.total, 0);

  return {
    streak: consecutiveDays(progress.sessions),
    mastered: words + sentences,
    masteredTotal: VOCAB.length + GRAMMAR.length,
    accuracy: total > 0 ? Math.round((right / total) * 100) : null
  };
}
