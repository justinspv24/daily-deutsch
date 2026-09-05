import type { Progress, SessionRecord } from "./types";

/**
 * Expanding review intervals, after Cepeda et al. — the ladder written into
 * CLAUDE.md: day 1, 3, 7, 21, 35.
 */
export const REVIEW_INTERVALS = [1, 3, 7, 21, 35] as const;

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T12:00:00`).getTime();
  const b = new Date(`${to}T12:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/**
 * Advance one topic after a round.
 * A clean sweep moves it up the ladder; any mistake drops it one step and
 * puts it back on tomorrow's list.
 */
export function advanceTopic(
  progress: Progress,
  topicId: string,
  hit: { right: number; wrong: number }
): void {
  const state = progress.topics[topicId];
  if (!state) return;
  state.lastDate = todayISO();

  if (hit.wrong === 0 && hit.right > 0) {
    state.stage = Math.min(state.stage + 1, REVIEW_INTERVALS.length);
    const finished = state.stage >= REVIEW_INTERVALS.length;
    const interval = finished ? 90 : REVIEW_INTERVALS[state.stage];
    state.due = addDays(todayISO(), interval ?? 90);
  } else if (hit.wrong > 0) {
    state.stage = Math.max(0, state.stage - 1);
    state.due = addDays(todayISO(), 1);
  }
}

/** Consecutive days ending today (or yesterday, so an evening gap is forgiving). */
export function consecutiveDays(sessions: readonly SessionRecord[]): number {
  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  if (dates.length === 0) return 0;

  const today = todayISO();
  const yesterday = addDays(today, -1);
  const newest = dates[0]!;
  if (newest !== today && newest !== yesterday) return 0;

  let cursor = newest;
  let count = 0;
  for (const date of dates) {
    if (date === cursor) {
      count += 1;
      cursor = addDays(cursor, -1);
    } else if (date < cursor) {
      break;
    }
  }
  return count;
}
