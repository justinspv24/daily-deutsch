import { todayISO } from "./scheduler";
import type {
  ClassEnding,
  ClassPlanItem,
  ClassRecord,
  Level,
  LiveClass,
  Progress
} from "./types";

/**
 * The clock on a class, and what happens to a class nobody closed.
 *
 * Two rules run through everything here.
 *
 * **Time is banked, never subtracted.** A duration computed as `now - started`
 * counts the coffee, the phone call and, for a class left open overnight, the
 * whole evening. So a class accumulates: every stretch that ends adds its
 * seconds to a running total, and a break simply stops the meter. The
 * consequence is that `endedAt - startedAt` may be very much larger than
 * `seconds`, and only `seconds` is ever shown or added up.
 *
 * **A day belongs to the day it started in.** A class open when midnight comes
 * is closed at midnight rather than rolled over, because the calendar on the
 * profile is a calendar of days studied and a class cannot be in two squares.
 * Whether the app was running at the time makes no difference: a heartbeat
 * catches it while the app is open, and a string comparison at boot catches it
 * when the phone was in a pocket.
 */

/** How often a visible class banks its seconds and re-checks the date. */
export const HEARTBEAT_MS = 30_000;

/**
 * The longest a single stretch may credit. While the class is on screen the
 * heartbeat banks every thirty seconds, so a stretch longer than this means
 * the tab was frozen or the device clock moved — a flight, a DST change, a
 * correction by hand. Half an hour is generous enough never to rob an honest
 * learner and mean enough that a clock jump cannot paint the calendar.
 */
export const MAX_STRETCH_SECONDS = 1800;

/** Below this a class is not worth a row: a mis-tap, or a call that never connected. */
export const MIN_KEPT_SECONDS = 20;

/** An id the browser can mint, with a fallback for the ones that cannot. */
export function classId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function startLive(level: Level, plan: readonly ClassPlanItem[], now = new Date()): LiveClass {
  return {
    id: classId(),
    date: todayISO(),
    startedAt: now.toISOString(),
    level,
    plan: [...plan],
    cursor: 0,
    seconds: 0,
    resumedAt: now.toISOString(),
    right: 0,
    wrong: 0,
    answers: [],
    mistakes: [],
    sections: [],
    tables: [],
    words: []
  };
}

/** Fold the stretch that is running into `seconds` and re-arm from now. */
export function bankTime(live: LiveClass, now = Date.now()): void {
  if (!live.resumedAt) return;
  const from = Date.parse(live.resumedAt);
  // A clock that went backwards banks nothing rather than a negative.
  const stretch = Number.isFinite(from) ? Math.max(0, Math.round((now - from) / 1000)) : 0;
  live.seconds += Math.min(stretch, MAX_STRETCH_SECONDS);
  live.resumedAt = new Date(now).toISOString();
}

/** "Break": bank what has run, and stop the meter. */
export function pauseLive(live: LiveClass, now = Date.now()): void {
  bankTime(live, now);
  live.resumedAt = null;
}

/**
 * Back in the room. It never looks at what `resumedAt` held before, which is
 * exactly what makes a break free however long it lasted.
 */
export function resumeLive(live: LiveClass, now = new Date()): void {
  live.resumedAt = now.toISOString();
}

/** Seconds to show on the classroom clock, including the stretch still running. */
export function liveSeconds(live: LiveClass, now = Date.now()): number {
  if (!live.resumedAt) return live.seconds;
  const from = Date.parse(live.resumedAt);
  if (!Number.isFinite(from)) return live.seconds;
  return live.seconds + Math.min(Math.max(0, Math.round((now - from) / 1000)), MAX_STRETCH_SECONDS);
}

/**
 * A class that never really happened leaves no trace. Twenty seconds is below
 * one exchange, so anything above it is a class the learner meant to have —
 * and anything that got an answer counts however short it was.
 */
export function worthKeeping(live: LiveClass): boolean {
  return live.seconds >= MIN_KEPT_SECONDS || live.right + live.wrong > 0;
}

/** Close the meter and freeze the class into the record a year from now reads. */
export function closeLive(live: LiveClass, ending: ClassEnding, at?: string): ClassRecord {
  pauseLive(live);
  return {
    id: live.id,
    date: live.date,
    startedAt: live.startedAt,
    endedAt: at ?? new Date().toISOString(),
    seconds: live.seconds,
    level: live.level,
    sections: [...live.sections],
    tables: [...live.tables],
    words: [...live.words],
    right: live.right,
    wrong: live.wrong,
    mistakes: [...live.mistakes],
    ending
  };
}

/** True when the open class belongs to a day that has ended. */
export function staleLive(progress: Progress, today = todayISO()): boolean {
  return progress.live !== null && progress.live.date !== today;
}

/**
 * Close a class the day ran out on, and say what was written.
 *
 * The end is stamped at one second to midnight of the class's own day. Any
 * other timestamp either claims the learner was still talking at four in the
 * morning or drops the record into the wrong square of the calendar.
 */
export function closeStaleClass(progress: Progress, today = todayISO()): ClassRecord | null {
  const live = progress.live;
  if (!live || live.date === today) return null;

  progress.live = null;
  if (!worthKeeping(live)) return null;

  const record = closeLive(live, "midnight", new Date(`${live.date}T23:59:59`).toISOString());
  progress.classes.push(record);
  progress.sessions.push({
    date: record.date,
    right: record.right,
    total: record.right + record.wrong,
    seconds: record.seconds
  });
  return record;
}
