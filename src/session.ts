import { curriculumFor } from "./data/curriculum";
import { TABLES, cellKey, cellsOf, type CellRef } from "./data/tables";
import { isCustomId } from "./repository";
import { TABLE_MASTERY_DAYS, todayISO } from "./scheduler";
import type {
  BlankTask,
  GrammarItem,
  ParadigmTable,
  Progress,
  SessionState,
  StepState,
  TableProgress,
  Task,
  TopicItem,
  UpcomingTopic,
  VocabItem
} from "./types";

export const GRAMMAR_PER_SESSION = 8;
export const TOPICS_PER_SESSION = 3;

/**
 * How many paradigm tables may be part-way up the three-day chain at once.
 * A new table is only introduced once there is room, because every table in
 * flight has to be asked *every* day or its run breaks.
 */
export const TABLES_IN_FLIGHT = 2;

/** Cells asked per table per round. Missed cells are always asked on top. */
export const CELLS_PER_TABLE = 8;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Every word in play for this learner: the level's bank plus their own additions. */
export function allVocab(progress: Progress): VocabItem[] {
  return [...curriculumFor(progress.level).vocab, ...progress.custom];
}

/** Words still short of two consecutive correct answers. */
export function activeVocab(progress: Progress): VocabItem[] {
  return allVocab(progress).filter((item) => (progress.vocab[item.id]?.streak ?? 0) < 2);
}

/** How many words one round asks. The banks are far larger; this is the working set. */
export const VOCAB_PER_SESSION = 12;

/**
 * Today's words: at most VOCAB_PER_SESSION of the active ones, chosen so that
 * a word once begun is finished before another is started.
 *
 * The order of preference is deliberate. A word one correct answer from
 * retiring comes first, because finishing it frees a slot. Then words already
 * in play — the learner has met them and should meet them again tomorrow, not
 * in a month once the queue has cycled round. Words the learner added
 * themselves count as in play from the start; nobody adds a word to wait.
 * Only then do fresh bank words fill the remaining slots, in bank order, so
 * the set turns over predictably as words are mastered rather than drawing
 * twelve strangers every morning.
 *
 * Deterministic on purpose: the home screen lists today's words, and they
 * should be the words the round then asks.
 */
export function sessionVocab(progress: Progress): VocabItem[] {
  const rank = (item: VocabItem): number => {
    const state = progress.vocab[item.id];
    if (state && state.streak >= 1) return 0;
    if ((state && state.seen > 0) || isCustomId(item.id)) return 1;
    return 2;
  };
  return activeVocab(progress)
    .map((item, index) => ({ item, index, rank: rank(item) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, VOCAB_PER_SESSION)
    .map((entry) => entry.item);
}

/**
 * The tables to drill today: every table already part-way up the chain, plus a
 * fresh one if there is room. Mastered tables drop out for good.
 */
export function dueTables(progress: Progress): ParadigmTable[] {
  const today = todayISO();
  const unmastered = TABLES.filter((table) => {
    const state = progress.tables[table.id];
    return state !== undefined && state.dayStreak < TABLE_MASTERY_DAYS;
  });

  const inFlight = unmastered.filter((table) => progress.tables[table.id]?.studied === true);
  const fresh = unmastered.filter((table) => progress.tables[table.id]?.studied !== true);
  const room = Math.max(0, TABLES_IN_FLIGHT - inFlight.length);

  return [...inFlight, ...fresh.slice(0, room)].filter(
    (table) => (progress.tables[table.id]?.due ?? today) <= today
  );
}

/** Missed cells first — the personal dictionary is never truncated — then a rotating sample. */
export function pickCells(table: ParadigmTable, state: TableProgress | undefined): CellRef[] {
  const all = cellsOf(table);
  const missedKeys = new Set(state?.missed ?? []);
  const isMissed = (ref: CellRef): boolean => missedKeys.has(cellKey(ref.tableId, ref.row, ref.col));
  const missed = all.filter(isMissed);
  const rest = shuffle(all.filter((ref) => !isMissed(ref)));
  return [...missed, ...rest].slice(0, Math.max(CELLS_PER_TABLE, missed.length));
}

export function dueTopics(progress: Progress): TopicItem[] {
  const today = todayISO();
  return curriculumFor(progress.level).topics.filter((topic) => {
    const state = progress.topics[topic.id];
    if (!state) return false;
    return state.stage < 5 && state.due <= today;
  });
}

/**
 * Weight the table sentences: the one logged as a real mistake always makes
 * the cut, then the least-secure and least-seen, with a little jitter so two
 * mornings in a row never feel identical.
 */
export function pickGrammar(progress: Progress): GrammarItem[] {
  return [...curriculumFor(progress.level).grammar]
    .map((item) => {
      const state = progress.grammar[item.id];
      const secure = (state?.streak ?? 0) >= 2 ? 0 : 10;
      const freshness = 10 - Math.min(state?.seen ?? 0, 10);
      return { item, score: (item.priority ? 100 : 0) + secure + freshness + Math.random() * 4 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, GRAMMAR_PER_SESSION)
    .map((entry) => entry.item);
}

/**
 * Rotates daily so step 4 suggests something different each morning — and is
 * offset per learner, so two people at the same level get different topics on
 * the same day.
 */
export function suggestedTopic(progress: Progress, seed = ""): UpcomingTopic {
  const list = curriculumFor(progress.level).upcoming;
  const dayNumber = Math.floor(Date.parse(`${todayISO()}T00:00:00Z`) / 86_400_000);
  return list[Math.abs(dayNumber + hashSeed(seed)) % list.length]!;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 1000;
}

export function buildSession(progress: Progress): SessionState {
  const tasks: Task[] = [];

  for (const item of shuffle(sessionVocab(progress))) {
    tasks.push({ step: 0, kind: "vocab", item });
  }
  const tableHits: SessionState["tableHits"] = {};
  for (const table of dueTables(progress)) {
    const state = progress.tables[table.id];
    tableHits[table.id] = { right: 0, wrong: 0, missed: [] };
    // The grid is read once, in full, before it is ever asked.
    if (!state?.studied) tasks.push({ step: 1, kind: "table-study", table });
    for (const ref of pickCells(table, state)) {
      const row = table.rows[ref.row];
      const answers = row?.cells[ref.col];
      const colLabel = table.columns[ref.col];
      if (!row || !answers || !colLabel) continue;
      tasks.push({
        step: 1,
        kind: "table-cell",
        tableId: table.id,
        tableName: table.name,
        row: ref.row,
        col: ref.col,
        rowLabel: row.label,
        colLabel,
        answers,
        example: row.example ?? null
      });
    }
  }

  for (const item of shuffle(pickGrammar(progress))) {
    tasks.push({
      step: 2,
      kind: "blank",
      sourceId: item.id,
      bank: "grammar",
      label: item.group,
      question: item
    } satisfies BlankTask);
  }

  const topics = dueTopics(progress).slice(0, TOPICS_PER_SESSION);
  const topicHits: SessionState["topicHits"] = {};
  for (const topic of topics) {
    topicHits[topic.id] = { right: 0, wrong: 0 };
    for (const question of topic.questions) {
      tasks.push({
        step: 3,
        kind: "blank",
        sourceId: topic.id,
        bank: "topic",
        label: topic.name,
        question
      } satisfies BlankTask);
    }
  }

  return { tasks, index: 0, answered: [], results: [], topicHits, tableHits };
}

/** First task of a step the learner has not answered yet, or -1 if there is none. */
export function firstUnanswered(session: SessionState, step: number): number {
  return session.tasks.findIndex((task, index) => task.step === step && !session.answered.includes(index));
}

/**
 * Next unanswered task after `from`, wrapping to the beginning so skipping a
 * step never strands the questions that were skipped. -1 once none are left.
 */
export function nextUnanswered(session: SessionState, from: number): number {
  const total = session.tasks.length;
  for (let step = 1; step <= total; step += 1) {
    const index = (from + step) % total;
    if (!session.answered.includes(index)) return index;
  }
  return -1;
}

/** How each of the five steps is drawn while a round is in progress. */
export function stepStates(session: SessionState): readonly StepState[] {
  const current = session.tasks[session.index]?.step ?? null;
  return [0, 1, 2, 3, 4].map((step) => {
    if (step === current) return "active";
    const indices = session.tasks.reduce<number[]>((found, task, index) => {
      if (task.step === step) found.push(index);
      return found;
    }, []);
    if (indices.length > 0 && indices.every((index) => session.answered.includes(index))) return "done";
    return "idle";
  });
}
