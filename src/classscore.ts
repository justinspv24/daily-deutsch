import { cellKey, parseCellKey, tableById } from "./data/tables";
import { markMistake, noteOf, rememberMistake, type MistakeSeed } from "./mistakes";
import { advanceTable, advanceTopic, todayISO } from "./scheduler";
import type {
  ClassAnswer,
  ClassAsk,
  LiveClass,
  Mistake,
  MistakeNote,
  Progress,
  Verdict
} from "./types";

/**
 * Turning a class into progress.
 *
 * The app marks every closed question, never the tutor. That division is the
 * one thing holding the whole schedule up: the ladders are only worth trusting
 * if the same answer is always marked the same way, and two judges eventually
 * disagree in front of the learner. So the model hears, warmly, and this file
 * decides — with the very same grader the typed round used.
 *
 * Everything rolls forward exactly once, when the class closes. A word's
 * streak may only move when every field of its card was right, and a topic
 * only climbs its ladder when every one of its questions was answered; neither
 * can be decided one answer at a time. The cost is that a class must be closed
 * to count, which is why midnight closes one nobody ended.
 */

/** Note one answer on the open class. Marking happens later, all at once. */
export function noteAnswer(live: LiveClass, ask: ClassAsk, verdict: Verdict, given: string): void {
  live.answers.push({
    itemId: ask.id,
    kind: ask.kind,
    verdict,
    prompt: ask.subject,
    given,
    expected: ask.answer,
    why: ask.why
  });
  if (verdict === "ok") live.right += 1;
  else live.wrong += 1;

  if (ask.kind === "vocab" && !live.words.includes(ask.subject)) live.words.push(ask.subject);
  if (ask.kind === "cell" && !live.tables.includes(ask.tableId)) live.tables.push(ask.tableId);

  if (verdict !== "ok") {
    live.mistakes.push({
      kind: noteKind(ask),
      subject: ask.subject,
      prompt: ask.subject,
      expected: ask.answer,
      given
    });
  }
}

/** A correction the tutor made to free speech, which the app cannot grade. */
export function noteCorrection(live: LiveClass, said: string, fixed: string, why: string): MistakeNote {
  const note: MistakeNote = {
    kind: "correction",
    subject: fixed,
    prompt: why || said,
    expected: fixed,
    given: said
  };
  live.mistakes.push(note);
  return note;
}

function noteKind(ask: ClassAsk): MistakeNote["kind"] {
  if (ask.kind === "vocab") return "vocab";
  if (ask.kind === "cell") return "table";
  if (ask.kind === "blank") return "grammar";
  // A review is not a kind of thing; it is a second attempt at one.
  return ask.of;
}

/* ---------------------------------------------------------------- scoring */

/**
 * Roll one finished class into every ladder it touches. Called exactly once,
 * by "End class", by an abandoned class being dropped, and by the midnight
 * close — never twice, which the caller guarantees by clearing `progress.live`
 * in the same breath.
 */
export function scoreClass(
  progress: Progress,
  live: LiveClass,
  asks: ReadonlyMap<string, ClassAsk>,
  on: string = todayISO()
): void {
  const answers = live.answers;

  scoreVocabulary(progress, answers, asks);
  scoreTables(progress, answers, asks);
  scoreTopics(progress, answers, asks);
  scoreSentences(progress, answers, asks);
  scoreMistakes(progress, answers, asks, on);
}

/**
 * A card is scored only when every field it asked has an answer. A card cut
 * short by the Break button is left alone rather than half-marked — and that
 * is also what keeps `streak` meaning what `stats.ts` thinks it means.
 */
function scoreVocabulary(
  progress: Progress,
  answers: readonly ClassAnswer[],
  asks: ReadonlyMap<string, ClassAsk>
): void {
  const cards = new Map<string, { asked: number; right: number; total: number }>();
  for (const answer of answers) {
    const ask = asks.get(answer.itemId);
    if (ask?.kind !== "vocab") continue;
    const card = cards.get(ask.vocabId) ?? { asked: 0, right: 0, total: fieldsAsked(asks, ask.vocabId) };
    card.asked += 1;
    if (answer.verdict === "ok") card.right += 1;
    cards.set(ask.vocabId, card);
  }

  for (const [id, card] of cards) {
    if (card.asked < card.total) continue;
    const state = progress.vocab[id];
    if (!state) continue;
    state.seen += 1;
    state.lastDate = todayISO();
    state.streak = card.right === card.total ? state.streak + 1 : 0;
  }
}

function fieldsAsked(asks: ReadonlyMap<string, ClassAsk>, vocabId: string): number {
  let count = 0;
  for (const ask of asks.values()) if (ask.kind === "vocab" && ask.vocabId === vocabId) count += 1;
  return count;
}

/**
 * Tables keep the three-clean-days rule exactly as it was. `advanceTable`'s own
 * guard means a grid whose cells were never reached is untouched rather than
 * failed, which is right: a table not asked today has its chain broken
 * tomorrow by its `lastDate`, and that is the behaviour that was always there.
 */
function scoreTables(
  progress: Progress,
  answers: readonly ClassAnswer[],
  asks: ReadonlyMap<string, ClassAsk>
): void {
  const hits = new Map<string, { right: number; wrong: number; missed: string[] }>();
  for (const answer of answers) {
    const ask = asks.get(answer.itemId);
    if (ask?.kind !== "cell") continue;
    const hit = hits.get(ask.tableId) ?? { right: 0, wrong: 0, missed: [] };
    if (answer.verdict === "ok") hit.right += 1;
    else {
      hit.wrong += 1;
      hit.missed.push(ask.cell);
    }
    hits.set(ask.tableId, hit);
  }
  for (const [tableId, hit] of hits) advanceTable(progress, tableId, hit);
}

/** A topic climbs only when every one of its questions was answered. */
function scoreTopics(
  progress: Progress,
  answers: readonly ClassAnswer[],
  asks: ReadonlyMap<string, ClassAsk>
): void {
  const asked = new Map<string, number>();
  for (const ask of asks.values()) {
    if (ask.kind !== "blank" || ask.bank !== "topic") continue;
    asked.set(ask.sourceId, (asked.get(ask.sourceId) ?? 0) + 1);
  }

  const hits = new Map<string, { right: number; wrong: number; seen: number }>();
  for (const answer of answers) {
    const ask = asks.get(answer.itemId);
    if (ask?.kind !== "blank" || ask.bank !== "topic") continue;
    const hit = hits.get(ask.sourceId) ?? { right: 0, wrong: 0, seen: 0 };
    hit.seen += 1;
    if (answer.verdict === "ok") hit.right += 1;
    else hit.wrong += 1;
    hits.set(ask.sourceId, hit);
  }

  for (const [topicId, hit] of hits) {
    if (hit.seen < (asked.get(topicId) ?? 0)) continue;
    advanceTopic(progress, topicId, { right: hit.right, wrong: hit.wrong });
  }
}

function scoreSentences(
  progress: Progress,
  answers: readonly ClassAnswer[],
  asks: ReadonlyMap<string, ClassAsk>
): void {
  for (const answer of answers) {
    const ask = asks.get(answer.itemId);
    if (ask?.kind !== "blank" || ask.bank !== "grammar") continue;
    const state = progress.grammar[ask.sourceId];
    if (!state) continue;
    state.seen += 1;
    state.streak = answer.verdict === "ok" ? state.streak + 1 : 0;
  }
}

/**
 * The book of errors.
 *
 * A review answered right climbs its rung; answered wrong it goes back to the
 * bottom. Anything else got wrong is filed, `near` included — an umlaut
 * dropped today is an umlaut that will be dropped in three days, and the whole
 * point of the book is to catch exactly that.
 */
function scoreMistakes(
  progress: Progress,
  answers: readonly ClassAnswer[],
  asks: ReadonlyMap<string, ClassAsk>,
  on: string
): void {
  for (const answer of answers) {
    const ask = asks.get(answer.itemId);
    if (!ask) continue;

    if (ask.kind === "review") {
      markMistake(progress, ask.mistakeId, answer.verdict === "ok", answer.given, on);
      continue;
    }
    if (answer.verdict === "ok") continue;
    rememberMistake(progress, seedFor(ask, answer.given), on);
  }
}

function seedFor(ask: ClassAsk, given: string): MistakeSeed {
  const base = {
    prompt: ask.direction,
    expected: ask.answer,
    accepted: ask.accepted,
    expects: ask.expects,
    subject: ask.subject,
    given
  };
  switch (ask.kind) {
    case "vocab":
      return { ...base, kind: "vocab", ref: `${ask.vocabId}:${ask.field}`, gloss: ask.gloss };
    case "cell":
      return { ...base, kind: "table", ref: ask.cell, gloss: ask.subject };
    case "blank":
      return { ...base, kind: "grammar", ref: `${ask.bank}:${ask.sourceId}:${ask.index}` };
    default:
      return { ...base, kind: "grammar", ref: "" };
  }
}

/* -------------------------------------------------------- the day's record */

/** The mistakes of one class, as the summary lists them, worst kind first. */
export function summaryNotes(live: LiveClass): readonly MistakeNote[] {
  const order: Record<MistakeNote["kind"], number> = { vocab: 0, table: 1, grammar: 2, correction: 3 };
  return [...live.mistakes].sort((a, b) => order[a.kind] - order[b.kind]);
}

/** One entry of the book, frozen. Used when a review is missed a second time. */
export function frozen(entry: Mistake): MistakeNote {
  return noteOf(entry);
}

/** Every cell the class got wrong, as keys, for anything that wants them. */
export function missedCells(live: LiveClass, asks: ReadonlyMap<string, ClassAsk>): string[] {
  const out: string[] = [];
  for (const answer of live.answers) {
    const ask = asks.get(answer.itemId);
    if (ask?.kind !== "cell" || answer.verdict === "ok") continue;
    const ref = parseCellKey(ask.cell);
    if (ref && tableById(ref.tableId)) out.push(cellKey(ref.tableId, ref.row, ref.col));
  }
  return out;
}
