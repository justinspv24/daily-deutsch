import { parseCellKey, tableById } from "./data/tables";
import { flatten } from "./grading";
import { addDays, todayISO } from "./scheduler";
import type {
  Expects,
  Mistake,
  MistakeKind,
  MistakeNote,
  Progress,
  Trilingual,
  VocabItem
} from "./types";

/**
 * The book of errors.
 *
 * Every wrong answer a class hears goes in here and is asked again three days
 * later, then a week after that, then three weeks after that. It is a shorter
 * ladder than the topic one in `scheduler.ts` on purpose: a topic is a body of
 * knowledge and can afford thirty-five days, whereas a word whose article you
 * got wrong on Tuesday needs to come back while you still remember getting it
 * wrong.
 *
 * Why it is a third ladder and not a reuse of one of the two that exist. The
 * topic ladder paces whole syllabus topics, so hanging a single wrong article
 * on it would drag an entire topic back a rung. `TableProgress.missed` is the
 * within-grid dictionary a table's three-clean-days rule uses, and one clean
 * sweep empties it — it is a memory of yesterday, not of last month. An entry
 * can sit in both that dictionary and this book at once, and should: the grid
 * asks it again tomorrow, this asks it again in three weeks, when the grid has
 * long since retired.
 */

/** Days after the slip that a wrong answer comes back. The lesson plan's own. */
export const MISTAKE_INTERVALS = [3, 7, 21] as const;

/** How many reviews one class opens with. The rest wait their turn. */
export const MISTAKES_PER_CLASS = 6;

/** The book is the learner's, not a log. Past this it stops being readable. */
export const MISTAKE_LIMIT = 300;

/** Everything needed to file a slip. The id is derived, never passed in. */
export interface MistakeSeed {
  readonly kind: MistakeKind;
  /** Word id and field, cell key, sentence reference, or "" for free speech. */
  readonly ref: string;
  readonly subject: string;
  readonly gloss?: string;
  readonly prompt: string;
  readonly expected: string;
  readonly accepted?: readonly string[];
  readonly expects?: Expects;
  readonly given: string;
}

export type MistakeOutcome = "advanced" | "retired" | "reset" | "already" | "unknown";

/**
 * Identity. One cell is one entry however many mornings it is fumbled, so the
 * id is the thing asked and never the occasion.
 *
 * Free speech has no natural reference, so one is derived from the *corrected*
 * form rather than from the wrong one: the grammar point is what repeats, not
 * the particular way it was fumbled. The grader's own normaliser does the
 * flattening, so "Ich bin gefahren." and "ich bin gefahren" are one entry.
 */
export function mistakeIdFor(seed: MistakeSeed): string {
  if (seed.ref) return `${seed.kind}:${seed.ref}`;
  return `${seed.kind}:${flatten(seed.expected).toLowerCase().slice(0, 160)}`;
}

/**
 * The first rung shortens for anything missed more than once. A word you get
 * wrong twice is not a word to leave alone for three days; it is the word to
 * open tomorrow with. It earns the full three-day rung back by being answered
 * right, not by the calendar.
 */
function firstInterval(misses: number): number {
  return misses >= 2 ? 1 : MISTAKE_INTERVALS[0];
}

/** File a slip, or put one already in the book back at the bottom. */
export function rememberMistake(progress: Progress, seed: MistakeSeed, on = todayISO()): Mistake {
  const id = mistakeIdFor(seed);
  const existing = progress.mistakes.find((entry) => entry.id === id);

  if (existing) {
    existing.misses += 1;
    existing.stage = 0;
    existing.given = seed.given;
    existing.lastAsked = on;
    existing.due = addDays(on, firstInterval(existing.misses));
    return existing;
  }

  const entry: Mistake = {
    id,
    kind: seed.kind,
    ref: seed.ref,
    subject: seed.subject,
    gloss: seed.gloss ?? "",
    prompt: seed.prompt,
    expected: seed.expected,
    accepted: seed.accepted?.length ? [...seed.accepted] : [seed.expected],
    expects: seed.expects ?? "german",
    given: seed.given,
    firstMissed: on,
    lastAsked: on,
    stage: 0,
    due: addDays(on, MISTAKE_INTERVALS[0]),
    misses: 1
  };
  progress.mistakes.push(entry);
  pruneMistakes(progress);
  return entry;
}

/**
 * What is owed a review today, hardest-hit first so a class cut short still
 * covered the worst of it.
 */
export function dueMistakes(progress: Progress, on = todayISO()): readonly Mistake[] {
  return progress.mistakes
    .filter((entry) => entry.due <= on)
    .sort((a, b) => b.misses - a.misses || a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
}

/**
 * Move one entry after it has been asked again.
 *
 * A right answer can only credit a rung once a day — the same instinct as
 * `advanceTable`, and for the same reason: answering it twice in one sitting
 * proves nothing about next week. A wrong answer always counts, however often,
 * because a second failure in one class is real information.
 *
 * Clearing the last rung deletes the entry rather than flagging it. The live
 * list is what still needs work, and a list that only ever grows is a list
 * nobody opens; the history is not lost, because every `ClassRecord` carries
 * its own frozen copy of the day's slips.
 */
export function markMistake(
  progress: Progress,
  id: string,
  right: boolean,
  given = "",
  on = todayISO()
): MistakeOutcome {
  const index = progress.mistakes.findIndex((entry) => entry.id === id);
  const entry = progress.mistakes[index];
  if (!entry) return "unknown";

  if (!right) {
    entry.misses += 1;
    entry.stage = 0;
    entry.given = given;
    entry.lastAsked = on;
    entry.due = addDays(on, firstInterval(entry.misses));
    return "reset";
  }

  if (entry.lastAsked === on) return "already";

  entry.stage += 1;
  entry.lastAsked = on;
  if (entry.stage >= MISTAKE_INTERVALS.length) {
    progress.mistakes.splice(index, 1);
    return "retired";
  }
  entry.due = addDays(on, MISTAKE_INTERVALS[entry.stage] ?? 21);
  return "advanced";
}

/** Freeze one entry into the shape a day's summary keeps for ever. */
export function noteOf(entry: Mistake): MistakeNote {
  return {
    kind: entry.kind,
    subject: entry.subject,
    prompt: entry.prompt,
    expected: entry.expected,
    given: entry.given
  };
}

/* --------------------------------------------------------- for the profile */

export interface MistakeWord {
  readonly n: number;
  /** Always with its article — "die Butter" — never the bare noun. */
  readonly word: string;
  readonly meaning: string;
  readonly given: string;
  readonly misses: number;
  readonly stage: number;
  readonly due: string;
}

export interface MistakeCell {
  readonly n: number;
  readonly table: Trilingual;
  readonly row: Trilingual;
  readonly col: Trilingual;
  readonly expected: string;
  readonly given: string;
  readonly misses: number;
  readonly stage: number;
  readonly due: string;
}

/**
 * A noun is never shown bare. `VocabItem.word` is "Arzt" and `key` is "der",
 * so the article is composed here; a verb shows its auxiliary in brackets
 * instead, which is the thing that was actually asked. Where the id no longer
 * resolves — the bank was edited, the learner changed level — the stored
 * subject stands in, which is why it is denormalised onto the entry at all.
 */
function label(item: VocabItem | undefined, fallback: string): string {
  if (!item) return fallback;
  return item.kind === "noun" ? `${item.key} ${item.word}` : `${item.word} (${item.key})`;
}

/** The numbered vocabulary list the profile shows, worst word first. */
export function mistakeWords(progress: Progress, bank: readonly VocabItem[]): readonly MistakeWord[] {
  const byId = new Map(bank.map((item) => [item.id, item]));
  return progress.mistakes
    .filter((entry) => entry.kind === "vocab")
    .sort((a, b) => b.misses - a.misses || a.subject.localeCompare(b.subject))
    .map((entry, index) => {
      const item = byId.get(entry.ref.split(":")[0] ?? "");
      return {
        n: index + 1,
        word: label(item, entry.subject),
        meaning: item?.en[0] ?? entry.gloss,
        given: entry.given,
        misses: entry.misses,
        stage: entry.stage,
        due: entry.due
      };
    });
}

/** The same for paradigm cells, resolved back to their row and column labels. */
export function mistakeCells(progress: Progress): readonly MistakeCell[] {
  const out: MistakeCell[] = [];
  const entries = progress.mistakes
    .filter((entry) => entry.kind === "table")
    .sort((a, b) => b.misses - a.misses || a.subject.localeCompare(b.subject));

  for (const entry of entries) {
    const ref = parseCellKey(entry.ref);
    const table = ref ? tableById(ref.tableId) : undefined;
    const row = ref && table ? table.rows[ref.row] : undefined;
    const col = ref && table ? table.columns[ref.col] : undefined;
    if (!table || !row || !col) continue;
    out.push({
      n: out.length + 1,
      table: table.name,
      row: row.label,
      col,
      expected: entry.expected,
      given: entry.given,
      misses: entry.misses,
      stage: entry.stage,
      due: entry.due
    });
  }
  return out;
}

/**
 * Keep the book readable. Over the limit, the entries nearest retirement and
 * longest untouched go first — never anything missed more than once, which is
 * exactly the material the book exists for.
 */
export function pruneMistakes(progress: Progress): void {
  if (progress.mistakes.length <= MISTAKE_LIMIT) return;
  const ranked = [...progress.mistakes].sort(
    (a, b) => b.stage - a.stage || (a.lastAsked ?? "").localeCompare(b.lastAsked ?? "")
  );
  const doomed = new Set<string>();
  for (const entry of ranked) {
    if (progress.mistakes.length - doomed.size <= MISTAKE_LIMIT) break;
    if (entry.misses >= 2) continue;
    doomed.add(entry.id);
  }
  progress.mistakes = progress.mistakes.filter((entry) => !doomed.has(entry.id));
}
