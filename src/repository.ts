import { DEFAULT_LEVEL, allCurricula, curriculumFor, isLevel } from "./data/curriculum";
import { TABLES } from "./data/tables";
import { todayISO } from "./scheduler";
import type {
  ClassRecord,
  GrammarProgress,
  Level,
  LiveClass,
  Mistake,
  Progress,
  SessionRecord,
  TableProgress,
  TopicProgress,
  VocabItem,
  VocabProgress
} from "./types";

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
  /** Persist a learner-added word. The local store keeps it inside the progress document. */
  addWord(item: VocabItem): Promise<void>;
  removeWord(id: string): Promise<void>;
  /** Append one finished class. Stores that keep classes in the document no-op. */
  recordClass(record: ClassRecord): Promise<void>;
  /**
   * Drop one retired entry from the book of errors.
   *
   * `save()` is a full-set upsert with no delete pass, so anything that
   * disappears locally has to be deleted explicitly or it is loaded back as a
   * ghost — the same reason `removeWord` exists.
   */
  forgetMistake(id: string): Promise<void>;
  /** Write, or clear, the class still open. Written far more often than the rest. */
  saveLive(live: LiveClass | null): Promise<void>;
}

/** True for ids minted by the "add a word" panel, as opposed to the bundled banks. */
export function isCustomId(id: string): boolean {
  return id.startsWith("cv_");
}

/* -------------------------------------------------------------- defaults */

export function emptyProgress(level: Level | null = null): Progress {
  const progress: Progress = {
    updatedAt: new Date().toISOString(),
    level,
    custom: [],
    vocab: {},
    grammar: {},
    topics: {},
    tables: {},
    sessions: [],
    // Mistakes are earned, never seeded; classes and the live one likewise.
    mistakes: [],
    classes: [],
    live: null
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
  // The paradigm tables are not level-specific: articles and pronouns are as
  // necessary at B2 as at A1, so every learner carries the whole set.
  for (const table of TABLES) {
    progress.tables[table.id] ??= freshTable();
  }
}

function freshTable(): TableProgress {
  return { dayStreak: 0, lastDate: null, due: todayISO(), missed: [], studied: false };
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

  const custom = Array.isArray(input.custom) ? input.custom.filter(isVocabItem) : [];
  const merged: Progress = {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString(),
    level,
    custom,
    vocab: {},
    grammar: {},
    topics: {},
    tables: {},
    sessions: Array.isArray(input.sessions) ? input.sessions.filter(isSessionRecord) : [],
    mistakes: Array.isArray(input.mistakes) ? input.mistakes.filter(isMistake).map(cleanMistake) : [],
    classes: Array.isArray(input.classes) ? input.classes.filter(isClassRecord) : [],
    // Deliberately not auto-closed here. Closing a stale class writes a record
    // and appends a day to the history, and a decision with a side effect does
    // not belong in a function whose job is to make a document safe to read.
    live: isLiveClass(input.live) ? cleanLive(input.live) : null
  };

  for (const table of TABLES) {
    const stored = input.tables?.[table.id];
    merged.tables[table.id] = {
      ...freshTable(),
      ...(stored ?? {}),
      // Stored arrays arrive from JSON and from Postgres, so never trust the shape.
      missed: Array.isArray(stored?.missed) ? stored.missed.filter((c) => typeof c === "string") : []
    };
  }

  // Added words are drilled like bank words, so they get the same state.
  for (const item of custom) {
    merged.vocab[item.id] = { streak: 0, seen: 0, lastDate: null, ...(input.vocab?.[item.id] ?? {}) };
  }

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

export function isVocabItem(value: unknown): value is VocabItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<VocabItem>;
  return (
    typeof v.id === "string" &&
    (v.kind === "verb" || v.kind === "noun") &&
    typeof v.word === "string" &&
    typeof v.key === "string" &&
    Array.isArray(v.en) &&
    v.en.length > 0 &&
    Array.isArray(v.form) &&
    v.form.length > 0 &&
    typeof v.note === "object" &&
    v.note !== null
  );
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

/* ------------------------------------------------ the class, read safely */

/**
 * The three new shapes arrive from JSON, from Postgres and — for a document
 * written by an older build — from neither. Each one is checked for the few
 * fields anything actually reads, and clamped rather than rejected: a stored
 * ladder rung of 97 is a bug somewhere, but throwing the entry away loses the
 * learner's own history, which is worse than pinning it to 3.
 */
function isMistake(value: unknown): value is Mistake {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return typeof m["id"] === "string" && typeof m["kind"] === "string" && typeof m["expected"] === "string";
}

function cleanMistake(entry: Mistake): Mistake {
  const accepted = Array.isArray(entry.accepted)
    ? entry.accepted.filter((value) => typeof value === "string")
    : [];
  return {
    ...entry,
    accepted: accepted.length ? accepted : [entry.expected],
    expects: entry.expects ?? "german",
    gloss: entry.gloss ?? "",
    prompt: entry.prompt ?? "",
    given: entry.given ?? "",
    misses: Math.max(1, Math.round(Number(entry.misses) || 1)),
    stage: Math.min(3, Math.max(0, Math.round(Number(entry.stage) || 0))),
    due: typeof entry.due === "string" ? entry.due : todayISO(),
    firstMissed: typeof entry.firstMissed === "string" ? entry.firstMissed : todayISO(),
    lastAsked: typeof entry.lastAsked === "string" ? entry.lastAsked : null
  };
}

function isClassRecord(value: unknown): value is ClassRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r["id"] === "string" &&
    typeof r["date"] === "string" &&
    typeof r["seconds"] === "number" &&
    Array.isArray(r["mistakes"])
  );
}

function isLiveClass(value: unknown): value is LiveClass {
  if (!value || typeof value !== "object") return false;
  const l = value as Record<string, unknown>;
  return typeof l["id"] === "string" && typeof l["date"] === "string" && Array.isArray(l["plan"]);
}

/**
 * A live class is read back with its meter stopped. Whatever tab was counting
 * has gone — it was closed, or killed, or is on another device — so the
 * stretch it was in the middle of is not this one's to credit.
 */
function cleanLive(live: LiveClass): LiveClass {
  return {
    ...live,
    cursor: Math.max(0, Math.round(Number(live.cursor) || 0)),
    seconds: Math.max(0, Math.round(Number(live.seconds) || 0)),
    resumedAt: null,
    right: Math.max(0, Math.round(Number(live.right) || 0)),
    wrong: Math.max(0, Math.round(Number(live.wrong) || 0)),
    answers: Array.isArray(live.answers) ? live.answers : [],
    mistakes: Array.isArray(live.mistakes) ? live.mistakes : [],
    sections: Array.isArray(live.sections) ? live.sections : [],
    tables: Array.isArray(live.tables) ? live.tables : [],
    words: Array.isArray(live.words) ? live.words : []
  };
}

/**
 * Combine progress made while signed out with whatever the account already
 * holds. Neither side is authoritative: the further-along value wins for each
 * item, because losing a hard-won streak is worse than keeping an easy one.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  // Added words are a union: a word created on one device must survive
  // signing in on another, whichever side the account already knew about.
  const custom = [...remote.custom];
  const seenWords = new Set(custom.map((item) => item.id));
  for (const item of local.custom) {
    if (!seenWords.has(item.id)) {
      custom.push(item);
      seenWords.add(item.id);
    }
  }
  const merged = normalise({ ...remote, custom, level: remote.level ?? local.level });

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
  for (const [id, localState] of Object.entries(local.tables)) {
    const remoteState = merged.tables[id];
    merged.tables[id] = remoteState ? combineTable(localState, remoteState) : { ...localState };
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

  // Classes are a union by id: a class held on the phone and a class held on
  // the laptop are two classes, and the same class synced twice is one.
  const classes = new Map(merged.classes.map((record) => [record.id, record]));
  for (const record of local.classes) classes.set(record.id, record);
  merged.classes = [...classes.values()].sort((a, b) => a.date.localeCompare(b.date));

  // The book of errors is a union too, and where both sides know an entry the
  // *lower* rung wins. Two devices disagreeing about a word means one of them
  // watched the learner get it wrong, and that is the side worth believing.
  const mistakes = new Map(merged.mistakes.map((entry) => [entry.id, entry]));
  for (const entry of local.mistakes) {
    const known = mistakes.get(entry.id);
    mistakes.set(entry.id, known ? combineMistake(entry, known) : entry);
  }
  merged.mistakes = [...mistakes.values()];

  merged.live = combineLive(local.live, merged.live);
  merged.updatedAt = new Date().toISOString();
  return merged;
}

function combineMistake(local: Mistake, remote: Mistake): Mistake {
  const behind = local.stage <= remote.stage ? local : remote;
  return {
    ...behind,
    misses: Math.max(local.misses, remote.misses),
    // Whichever side asked it more recently knows what was said.
    given: (local.lastAsked ?? "") >= (remote.lastAsked ?? "") ? local.given : remote.given,
    lastAsked: laterDate(local.lastAsked, remote.lastAsked),
    firstMissed: local.firstMissed < remote.firstMissed ? local.firstMissed : remote.firstMissed
  };
}

/**
 * At most one class is open at a time, so two of them is a learner who walked
 * away from one device and started again on another. The one that got further
 * wins, measured in answers and then in seconds — and the loser is simply
 * dropped rather than merged, because two half-classes spliced together would
 * credit the same minutes twice and ask half its questions out of order.
 */
function combineLive(local: LiveClass | null, remote: LiveClass | null): LiveClass | null {
  if (!local) return remote;
  if (!remote) return local;
  if (local.id === remote.id) {
    return {
      ...(local.answers.length >= remote.answers.length ? local : remote),
      // Both counted the same minutes; the maximum is the honest total.
      seconds: Math.max(local.seconds, remote.seconds)
    };
  }
  const localScore = local.answers.length * 1000 + local.seconds;
  const remoteScore = remote.answers.length * 1000 + remote.seconds;
  return localScore >= remoteScore ? local : remote;
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

/**
 * The longer clean run wins, and the two personal dictionaries are unioned —
 * a cell either side got wrong is still a cell worth asking again.
 */
function combineTable(local: TableProgress, remote: TableProgress): TableProgress {
  const takeLocal = local.dayStreak > remote.dayStreak;
  const winner = takeLocal ? local : remote;
  return {
    dayStreak: Math.max(local.dayStreak, remote.dayStreak),
    lastDate: laterDate(local.lastDate, remote.lastDate),
    due: winner.due,
    missed: [...new Set([...local.missed, ...remote.missed])],
    studied: local.studied || remote.studied
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
