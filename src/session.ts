import { curriculumFor } from "./data/curriculum";
import { TABLES } from "./data/tables";
import { isCustomId } from "./repository";
import { dayNumber, TABLE_MASTERY_DAYS, todayISO } from "./scheduler";
import type {
  ParadigmTable,
  Progress,
  TopicItem,
  UpcomingTopic,
  VocabItem
} from "./types";

/**
 * What the banks offer a class, and in what order.
 *
 * This file answers "which words, which grids, which sentences are due" and
 * stops there. What a class does with them — how they are asked out loud, in
 * what order, with how much conversation between — is `agenda.ts`, and the two
 * are kept apart because the first is about the learner's schedule and the
 * second is about the shape of half an hour.
 */

/**
 * How many paradigm tables may be part-way up the three-day chain at once.
 * A new table is only introduced once there is room, because every table in
 * flight has to be asked *every* day or its run breaks.
 */
export const TABLES_IN_FLIGHT = 2;

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

export function dueTopics(progress: Progress): TopicItem[] {
  const today = todayISO();
  return curriculumFor(progress.level).topics.filter((topic) => {
    const state = progress.topics[topic.id];
    if (!state) return false;
    return state.stage < 5 && state.due <= today;
  });
}

/**
 * Rotates daily, so the theme named on the start pill is different each
 * morning — and is offset per learner, so two people at the same level do not
 * get the same one on the same day.
 */
export function suggestedTopic(progress: Progress, seed = ""): UpcomingTopic {
  const list = curriculumFor(progress.level).upcoming;
  return list[Math.abs(dayNumber() + hashSeed(seed)) % list.length]!;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 1000;
}
