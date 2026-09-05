import { GRAMMAR } from "./data/grammar";
import { TOPICS } from "./data/topics";
import { VOCAB } from "./data/vocab";
import { todayISO } from "./scheduler";
import type { Progress, SessionRecord } from "./types";

/**
 * Everything the app needs from storage. Two implementations satisfy it —
 * `LocalRepository` (this browser only) and `SupabaseRepository` (this
 * learner, any device) — so no view or controller knows which one is live.
 */
export interface Repository {
  readonly kind: "local" | "cloud";
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
  /**
   * Append one finished round, for stores that keep rounds in their own table.
   * A store that already carries them inside the progress document implements
   * this as a no-op rather than writing the round a second time.
   */
  recordSession(record: SessionRecord): Promise<void>;
}

/* -------------------------------------------------------------- defaults */

export function emptyProgress(): Progress {
  const progress: Progress = {
    updatedAt: new Date().toISOString(),
    vocab: {},
    grammar: {},
    topics: {},
    sessions: []
  };
  for (const item of VOCAB) progress.vocab[item.id] = { streak: 0, seen: 0, lastDate: null };
  for (const item of GRAMMAR) progress.grammar[item.id] = { streak: 0, seen: 0 };
  for (const topic of TOPICS) {
    progress.topics[topic.id] = { stage: topic.seedStage, due: todayISO(), lastDate: null };
  }
  return progress;
}

/**
 * Merge stored progress against the current content, so adding a word or a
 * sentence never invalidates what a learner has already done.
 */
export function normalise(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const input = raw as Partial<Progress>;

  const merged: Progress = {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : base.updatedAt,
    vocab: {},
    grammar: {},
    topics: {},
    sessions: Array.isArray(input.sessions) ? input.sessions.filter(isSessionRecord) : []
  };
  for (const item of VOCAB) {
    merged.vocab[item.id] = { ...base.vocab[item.id]!, ...(input.vocab?.[item.id] ?? {}) };
  }
  for (const item of GRAMMAR) {
    merged.grammar[item.id] = { ...base.grammar[item.id]!, ...(input.grammar?.[item.id] ?? {}) };
  }
  for (const topic of TOPICS) {
    merged.topics[topic.id] = { ...base.topics[topic.id]!, ...(input.topics?.[topic.id] ?? {}) };
  }
  return merged;
}

function isSessionRecord(value: unknown): value is SessionRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r["date"] === "string" &&
    typeof r["right"] === "number" &&
    typeof r["total"] === "number"
  );
}

/**
 * Combine progress made while signed out with whatever the account already
 * holds. Neither side is authoritative: the further-along value wins for each
 * item, because losing a hard-won streak is worse than keeping an easy one.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const merged = normalise(remote);

  for (const [id, localState] of Object.entries(local.vocab)) {
    const remoteState = merged.vocab[id];
    if (!remoteState) continue;
    merged.vocab[id] = {
      streak: Math.max(localState.streak, remoteState.streak),
      seen: localState.seen + remoteState.seen,
      lastDate: laterDate(localState.lastDate, remoteState.lastDate)
    };
  }
  for (const [id, localState] of Object.entries(local.grammar)) {
    const remoteState = merged.grammar[id];
    if (!remoteState) continue;
    merged.grammar[id] = {
      streak: Math.max(localState.streak, remoteState.streak),
      seen: localState.seen + remoteState.seen
    };
  }
  for (const [id, localState] of Object.entries(local.topics)) {
    const remoteState = merged.topics[id];
    if (!remoteState) continue;
    // Furthest up the ladder wins; the due date follows that same side.
    const takeLocal = localState.stage > remoteState.stage;
    merged.topics[id] = {
      stage: Math.max(localState.stage, remoteState.stage),
      due: takeLocal ? localState.due : remoteState.due,
      lastDate: laterDate(localState.lastDate, remoteState.lastDate)
    };
  }

  const seen = new Set(merged.sessions.map((s) => `${s.date}|${s.right}|${s.total}`));
  for (const record of local.sessions) {
    const key = `${record.date}|${record.right}|${record.total}`;
    if (!seen.has(key)) {
      merged.sessions.push(record);
      seen.add(key);
    }
  }
  merged.sessions.sort((a, b) => a.date.localeCompare(b.date));
  merged.updatedAt = new Date().toISOString();
  return merged;
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}
