import { addDays, consecutiveDays, todayISO } from "./scheduler";
import type { ClassEnding, ClassRecord, MistakeNote, Progress } from "./types";

/**
 * The numbers the profile leads with, and the calendar under them.
 *
 * All of it is read from `progress.classes` and nothing else, so there is
 * exactly one source of truth for "how long have I studied". The older
 * `sessions` list is still written — the streak tile and `stats.ts` read it —
 * but a minute counted in two places is a minute that will eventually
 * disagree with itself.
 */

export interface ProfileTotals {
  readonly seconds: number;
  /** Hours to one decimal, for the headline tile. */
  readonly hours: number;
  /** Distinct days with at least one class. */
  readonly days: number;
  readonly classes: number;
  readonly right: number;
  readonly wrong: number;
  /** Consecutive days ending today, or yesterday. */
  readonly streak: number;
  /** The best run there has ever been, so a broken streak is not the only number. */
  readonly longest: number;
}

export function profileTotals(progress: Progress): ProfileTotals {
  const days = new Set<string>();
  let seconds = 0;
  let right = 0;
  let wrong = 0;
  for (const record of progress.classes) {
    days.add(record.date);
    seconds += record.seconds;
    right += record.right;
    wrong += record.wrong;
  }

  return {
    seconds,
    hours: Math.round((seconds / 3600) * 10) / 10,
    days: days.size,
    classes: progress.classes.length,
    right,
    wrong,
    streak: consecutiveDays(progress.classes),
    longest: longestRun([...days].sort())
  };
}

/** The longest run of consecutive dates in a sorted list. */
function longestRun(dates: readonly string[]): number {
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of dates) {
    run = previous && addDays(previous, 1) === date ? run + 1 : 1;
    previous = date;
    if (run > best) best = run;
  }
  return best;
}

/* ---------------------------------------------------------------- calendar */

/** One square of the contribution grid. */
export interface CalendarDay {
  readonly date: string;
  readonly minutes: number;
  readonly classes: number;
  /** The shade: 0 none, 4 a full hour or more. */
  readonly shade: 0 | 1 | 2 | 3 | 4;
}

/**
 * Anchored to the lesson plan's own hour rather than to a curve fitted to the
 * learner's habits, so a day that did what the plan asks is the darkest
 * square and stays the darkest square however the weeks around it go.
 */
export function shadeFor(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes <= 0) return 0;
  if (minutes < 15) return 1;
  if (minutes < 30) return 2;
  if (minutes < 60) return 3;
  return 4;
}

/** Days since the Monday of this date's week. Noon, so DST cannot shift it. */
function sinceMonday(iso: string): number {
  return (new Date(`${iso}T12:00:00`).getDay() + 6) % 7;
}

/**
 * Whole weeks ending with the one containing today, Monday first — the German
 * week, not GitHub's Sunday, because the rest of the interface is German.
 *
 * Returned week by week, seven days at a time, so the view is a plain grid
 * flowing down its columns and needs no index arithmetic of its own.
 */
export function calendarDays(progress: Progress, weeks = 53, today = todayISO()): readonly CalendarDay[] {
  const lastMonday = addDays(today, -sinceMonday(today));
  const first = addDays(lastMonday, -(weeks - 1) * 7);

  // One pass over the classes: a year of squares must not be a year of scans.
  const byDay = new Map<string, { seconds: number; classes: number }>();
  for (const record of progress.classes) {
    const cell = byDay.get(record.date) ?? { seconds: 0, classes: 0 };
    cell.seconds += record.seconds;
    cell.classes += 1;
    byDay.set(record.date, cell);
  }

  const out: CalendarDay[] = [];
  for (let i = 0; i < weeks * 7; i += 1) {
    const date = addDays(first, i);
    if (date > today) break;
    const cell = byDay.get(date);
    const minutes = Math.round((cell?.seconds ?? 0) / 60);
    out.push({ date, minutes, classes: cell?.classes ?? 0, shade: shadeFor(minutes) });
  }
  return out;
}

/* ------------------------------------------------------------- one day */

export interface DaySummary {
  readonly date: string;
  readonly seconds: number;
  readonly right: number;
  readonly wrong: number;
  readonly sections: readonly string[];
  readonly tables: readonly string[];
  readonly words: readonly string[];
  readonly mistakes: readonly MistakeNote[];
  readonly endings: readonly ClassEnding[];
  readonly classes: readonly ClassRecord[];
}

/** Everything that happened on one day, however many classes it took. */
export function daySummary(progress: Progress, date: string): DaySummary | null {
  const classes = progress.classes.filter((record) => record.date === date);
  if (classes.length === 0) return null;

  const sections = new Set<string>();
  const tables = new Set<string>();
  const words = new Set<string>();
  const mistakes: MistakeNote[] = [];
  let seconds = 0;
  let right = 0;
  let wrong = 0;

  for (const record of classes) {
    seconds += record.seconds;
    right += record.right;
    wrong += record.wrong;
    for (const id of record.sections) sections.add(id);
    for (const id of record.tables) tables.add(id);
    for (const word of record.words) words.add(word);
    mistakes.push(...record.mistakes);
  }

  return {
    date,
    seconds,
    right,
    wrong,
    sections: [...sections],
    tables: [...tables],
    words: [...words],
    mistakes,
    endings: classes.map((record) => record.ending),
    classes
  };
}

/** 25 min · 1 h 10 — a duration as a person would say it, not as a clock. */
export function formatDuration(seconds: number, unit: { min: string; hour: string }): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} ${unit.min}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ${unit.hour}` : `${hours} ${unit.hour} ${rest} ${unit.min}`;
}
