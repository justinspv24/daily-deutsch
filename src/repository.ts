import { DEFAULT_LEVEL, allCurricula, curriculumFor, isLevel } from "./data/curriculum";
import { todayISO } from "./scheduler";
import type { GrammarProgress, Level, Progress, SessionRecord, TopicProgress, VocabProgress } from "./types";

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

export function emptyProgress(level: Level | null = null): Progress {
  const progress: Progress = {
    updatedAt: new Date().toISOString(),
    level,
    vocab: {},
    grammar: {},
    topics: {},
    sessions: []
  };
  seedLevel(progress, level);
  return progress;
}

/** Add zeroed state for every item of a level that the progress does not know yet. */
export function seedLevel(progress: Progress, level: Level | null): void {
  const bank = curriculumFor(level);
  for (const item of bank.vocab) progress.vocab[item.id] ??= { streak: 0, seen: 0, lastDate: null };
  for (const item of bank.grammar) progress.grammar[item.id] ??= { streak: 0, seen: 0 };
  for (const topic of bank.topics) {
    progress.topics[topic.id] ??= { stage: topic.seedStage, due: todayISO(), lastDate: null };
  }
}

/**
 * Merge stored progress against the current content, so adding a word or a
 * sentence never invalidates what a learner has already done. State for every
 * level is kept, so switching levels and back loses nothing; only the current
 * level is filled in with defaults.
 */
export function normalise(raw: unknown): Progress {
  if (!raw || typeof raw !== "object") return emptyProgress();
  const input = raw as Partial<Progress>;
  const level = isLevel(input.level) ? input.level : null;

  const merged: Progress = {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString(),
    level,
    vocab: {},
    grammar: {},
    topics: {},
    sessions: Array.isArray(input.sessions) ? input.sessions.filter(isSessionRecord) : []
  };

  for (const bank of allCurricula()) {
    const current = bank.level === (level ?? DEFAULT_LEVEL);
    for (const item of bank.vocab) {
      const stored = input.vocab?.[item.id];
      if (stored || current) merged.vocab[item.id] = { streak: 0, seen: 0, lastDate: null, ...(stored ?? {}) };
    }
    for (const item of bank.grammar) {
      const stored = input.grammar?.[item.id];
      if (stored || current) merged.grammar[item.id] = { streak: 0, seen: 0, ...(stored ?? {}) };
    }
    for (const topic of bank.topics) {
      const stored = input.topics?.[topic.id];
      if (stored || current) {
        merged.topics[topic.id] = { stage: topic.seedStage, due: todayISO(), lastDate: null, ...(stored ?? {}) };
      }
    }
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
  const merged = normalise({ ...remote, level: remote.level ?? local.level });

  for (const [id, localState] of Object.entries(local.vocab)) {
    const remoteState = merged.vocab[id];
    merged.vocab[id] = remoteState ? combineVocab(localState, remoteState) : { ...localState };
  }
  for (const [id, localState] of Object.entries(local.grammar)) {
    const remoteState = merged.grammar[id];
    merged.grammar[id] = remoteState ? combineGrammar(localState, remoteState) : { ...localState };
  }
  for (const [id, localState] of Object.entries(local.topics)) {
    const remoteState = merged.topics[id];
    merged.topics[id] = remoteState ? combineTopic(localState, remoteState) : { ...localState };
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

function combineVocab(local: VocabProgress, remote: VocabProgress): VocabProgress {
  return {
    streak: Math.max(local.streak, remote.streak),
    seen: local.seen + remote.seen,
    lastDate: laterDate(local.lastDate, remote.lastDate)
  };
}

function combineGrammar(local: GrammarProgress, remote: GrammarProgress): GrammarProgress {
  return {
    streak: Math.max(local.streak, remote.streak),
    seen: local.seen + remote.seen
  };
}

/** Furthest up the ladder wins; the due date follows that same side. */
function combineTopic(local: TopicProgress, remote: TopicProgress): TopicProgress {
  const takeLocal = local.stage > remote.stage;
  return {
    stage: Math.max(local.stage, remote.stage),
    due: takeLocal ? local.due : remote.due,
    lastDate: laterDate(local.lastDate, remote.lastDate)
  };
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}
