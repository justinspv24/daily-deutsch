import { curriculumFor, DEFAULT_LEVEL, type Curriculum } from "./data/curriculum";
import { syllabusFor } from "./data/syllabus";
import { cellKey, cellsOf, parseCellKey, tableById, TABLES } from "./data/tables";
import { dueMistakes, MISTAKES_PER_CLASS } from "./mistakes";
import { dayNumber, todayISO } from "./scheduler";
import { dueTables, dueTopics, sessionVocab } from "./session";
import type {
  BlankAsk,
  CellAsk,
  ClassAgenda,
  ClassAsk,
  ClassItem,
  ClassPlanItem,
  GrammarItem,
  Mistake,
  ParadigmTable,
  Progress,
  ReviewAsk,
  SyllabusSection,
  TableProgress,
  TalkTurn,
  TopicItem,
  VocabAsk,
  VocabField,
  VocabItem
} from "./types";


/**
 * Today's class, written down before the call opens.
 *
 * The tutor does not decide what is taught. It is given one question at a
 * time, in German, as a stage direction — and never the answer, which is the
 * single rule that keeps a spoken lesson honest. A model told that `die Reise`
 * means "journey" will, somewhere across forty questions, say so before the
 * learner does: not out of malice, but because confirming is what a helpful
 * speaker does. Withholding it makes the leak impossible rather than unlikely.
 *
 * Everything here is deterministic from `Progress` and the date. The home
 * screen promises what today holds, a class resumed after a break has to be
 * the same class, and a class closed at midnight has to be able to say what
 * was on the plan. Nothing is drawn at random.
 */

/** Reviews one class opens with, then words, cells, sentences, one topic. */
export const CLASS_WORDS = 5;
export const CLASS_SPARE_WORDS = 4;
export const CLASS_CELLS_PER_TABLE = 5;
export const CLASS_MISSED_CELLS_PER_TABLE = 4;
export const CLASS_SENTENCES = 4;

/**
 * Five words a class, one question each.
 *
 * It was five words of three questions when a card meant article, meaning and
 * plural, and that was already most of the time a class had. Now that a card
 * is the meaning alone (see `fieldsOf`) five words is five questions, which
 * leaves room the conversation takes back. The number stays at five rather
 * than rising to match, because the words that matter are the ones that come
 * up in the talking, and a learner who keeps going gets `spare` anyway.
 */

/** About how long one spoken question takes, end to end, including the reply. */
const SECONDS_PER_ASK = 25;

/* --------------------------------------------------------------- wording */

/** Hints carry a little markup for the screen; spoken, the tags are noise. */
function spoken(text: string): string {
  return text.replace(/<[^>]*>/gu, "").replace(/\s+/gu, " ").trim();
}

/** Quote a word so the tutor reads it as the thing being asked about. */
function q(word: string): string {
  return `„${word}“`;
}

/** "Nominativ — wer? was?" is a heading for the eye; spoken it is one word. */
function head(label: string): string {
  return label.split(" — ")[0]?.trim() ?? label;
}

/** A noun is never spoken bare: "die Reise", and a verb carries its auxiliary. */
export function vocabSubject(item: VocabItem): string {
  return item.kind === "noun" ? `${item.key} ${item.word}` : `${item.word} (${item.key})`;
}

/* ----------------------------------------------------------- vocabulary */

/**
 * What a card asks: the meaning, and nothing else.
 *
 * It used to ask three questions — article, meaning, plural — because that is
 * what the vocabulary card on screen had three boxes for. Spoken, that turned
 * out to be the wrong trade. "Wie heißt der Artikel von Entscheidung?" is a
 * quiz question, not a thing anybody says out loud, and three of them per word
 * meant a class spent its first ten minutes on forms rather than on German.
 *
 * The article has not been dropped, only stopped being *asked*. Every place a
 * word appears it appears with it — the tutor says "die Meinung", the card
 * shows "die Meinung", the profile lists "die Meinung" — so it is learnt the
 * way a German speaker learnt it, attached to the word rather than as a
 * separate fact about it. And the case forms themselves are still drilled hard
 * by the paradigm tables, which is where they belong: der becoming dem is a
 * rule, not a property of one noun.
 */
function fieldsOf(_item: VocabItem): readonly VocabField[] {
  return ["meaning"];
}

function vocabAsk(item: VocabItem, field: VocabField, origin: ClassAsk["origin"]): VocabAsk {
  const subject = vocabSubject(item);
  const bare = q(item.word);
  const full = q(subject);

  const direction =
    field === "key"
      ? item.kind === "noun"
        ? `Frage nach dem Artikel von ${bare}: der, die oder das?`
        : `Frage, welches Hilfsverb ${bare} im Perfekt nimmt: sein oder haben?`
      : field === "meaning"
        ? `Frage, was ${item.kind === "noun" ? full : bare} auf Englisch heißt.`
        : item.kind === "noun"
          ? `Frage nach dem Plural von ${full}.`
          : `Frage nach dem Partizip zwei von ${bare}.`;

  const accepted = field === "key" ? [item.key] : field === "meaning" ? item.en : item.form;

  const question =
    field === "key"
      ? item.kind === "noun"
        ? `${item.word} — der, die oder das?`
        : `${item.word} im Perfekt — sein oder haben?`
      : field === "meaning"
        // A noun is asked with its article, a verb without its auxiliary:
        // "die Reise" is the word, whereas "aufwachen (sein)" is the word
        // plus a fact about it that nobody says out loud.
        ? `Was heißt ${item.kind === "noun" ? full : bare} auf Englisch?`
        : item.kind === "noun"
          ? `Wie heißt der Plural von ${full}?`
          : `Wie heißt das Partizip II von ${bare}?`;

  return {
    kind: "vocab",
    id: `v:${item.id}:${field}`,
    origin,
    direction,
    question,
    expects: field === "key" ? (item.kind === "noun" ? "article" : "aux") : field === "meaning" ? "english" : "german",
    accepted,
    answer: accepted[0] ?? "",
    why: item.note.de || item.note.en ? item.note : null,
    subject,
    vocabId: item.id,
    field,
    gloss: item.en[0] ?? ""
  };
}

function cardAsks(item: VocabItem, origin: ClassAsk["origin"]): VocabAsk[] {
  return fieldsOf(item).map((field) => vocabAsk(item, field, origin));
}

/* -------------------------------------------------------- paradigm cells */

/** Grids whose rows are the four cases: the answer is a form of the anchor. */
const CASE_ROW_TABLES = new Set([
  "tbl-artikel-bestimmt",
  "tbl-artikel-unbestimmt",
  "tbl-artikel-negativ",
  "tbl-possessiv-endungen"
]);

/** Grids of bare endings, where there is no anchor word to decline. */
const ENDING_TABLES = new Set([
  "tbl-adjektiv-bestimmt",
  "tbl-adjektiv-unbestimmt",
  "tbl-adjektiv-ohne"
]);

/** One-column lookups: the row label is the word, the cell is its case. */
const LOOKUP_DIRECTIONS: Record<string, (word: string) => string> = {
  "tbl-verben-fall": (word) => `Frage, welchen Fall ${q(word)} nimmt.`,
  "tbl-praepositionen-fall": (word) => `Frage, welchen Fall ${q(word)} verlangt.`,
  "tbl-fragewoerter-fall": (word) => `Frage, zu welchem Fall ${q(word)} gehört.`,
  "tbl-possessiv-grund": (word) => `Frage nach dem Possessivartikel zu ${q(word)}.`
};

/**
 * How one cell is asked out loud.
 *
 * Three shapes, because the twelve grids are not one kind of thing. An article
 * table is asked by declining a word the learner already knows — "wie heißt
 * *der* im Akkusativ?", which is the question the lesson plan itself uses. A
 * one-column lookup asks the other way round: the row is the word, the cell is
 * the case it takes. And an endings grid has no word at all, so it is named by
 * its coordinates and its worked sentence is held back for the correction,
 * because the sentence contains the answer.
 */
function cellDirection(table: ParadigmTable, row: number, col: number): string {
  const rowLabel = table.rows[row]?.label.de ?? "";
  const colLabel = table.columns[col]?.de ?? "";

  const lookup = LOOKUP_DIRECTIONS[table.id];
  if (lookup) return lookup(rowLabel);

  if (ENDING_TABLES.has(table.id)) {
    return `Frage nach der Adjektivendung: ${head(rowLabel)}, ${colLabel}, ${table.name.de}.`;
  }

  if (CASE_ROW_TABLES.has(table.id)) {
    const anchors = table.rows[0]?.cells ?? [];
    const anchor = anchors[col]?.[0] ?? "";
    // "die" is both feminine and plural in the definite table, so the bare
    // anchor would be two questions at once. Ambiguity is computed rather than
    // listed: the anchor appears in more than one column of the top row.
    const ambiguous = anchors.filter((cells) => cells[0] === anchor).length > 1;
    const subject = ambiguous ? `${q(anchor)} (${colLabel})` : q(anchor);
    return `Frage, wie ${subject} im ${head(rowLabel)} heißt.`;
  }

  // Personal pronouns: the cases are the columns and the persons the rows, so
  // the anchor is the row's own nominative.
  const anchor = table.rows[row]?.cells[0]?.[0] ?? "";
  const person = head(rowLabel).includes("—") ? head(rowLabel) : rowLabel;
  return anchor
    ? `Frage, wie ${q(anchor)} im ${head(colLabel)} heißt.`
    : `Frage nach der Form für ${q(person)} im ${head(colLabel)}.`;
}

/**
 * The same cell as a question on the board.
 *
 * `cellDirection` tells the tutor what to ask; this is what the learner reads
 * while they answer. It mirrors the three shapes exactly, minus the "Frage
 * nach …" wrapper that only makes sense when you are talking to a teacher.
 */
function cellQuestion(table: ParadigmTable, row: number, col: number): string {
  const rowLabel = table.rows[row]?.label.de ?? "";
  const colLabel = table.columns[col]?.de ?? "";

  switch (table.id) {
    case "tbl-verben-fall":
      return `Welchen Fall nimmt „${rowLabel}“?`;
    case "tbl-praepositionen-fall":
      return `Welchen Fall verlangt „${rowLabel}“?`;
    case "tbl-fragewoerter-fall":
      return `Zu welchem Fall gehört „${rowLabel}“?`;
    case "tbl-possessiv-grund":
      return `Wie heißt der Possessivartikel zu „${rowLabel}“?`;
    default:
      break;
  }

  if (ENDING_TABLES.has(table.id)) {
    return `Adjektivendung: ${head(rowLabel)}, ${colLabel} — wie lautet sie?`;
  }

  if (CASE_ROW_TABLES.has(table.id)) {
    const anchors = table.rows[0]?.cells ?? [];
    const anchor = anchors[col]?.[0] ?? "";
    const ambiguous = anchors.filter((cells) => cells[0] === anchor).length > 1;
    const subject = ambiguous ? `„${anchor}“ (${colLabel})` : `„${anchor}“`;
    return `Wie heißt ${subject} im ${head(rowLabel)}?`;
  }

  const anchor = table.rows[row]?.cells[0]?.[0] ?? "";
  return anchor
    ? `Wie heißt „${anchor}“ im ${head(colLabel)}?`
    : `${head(rowLabel)} im ${head(colLabel)} — wie heißt das?`;
}

function cellSubject(table: ParadigmTable, row: number, col: number): string {
  const rowLabel = head(table.rows[row]?.label.de ?? "");
  const colLabel = head(table.columns[col]?.de ?? "");
  // A one-column grid's only column is called "Fall", which says nothing.
  return table.columns.length > 1
    ? `${table.name.de} · ${rowLabel} · ${colLabel}`
    : `${table.name.de} · ${rowLabel}`;
}

function cellAsk(table: ParadigmTable, row: number, col: number, origin: ClassAsk["origin"]): CellAsk | null {
  const accepted = table.rows[row]?.cells[col];
  if (!accepted || accepted.length === 0) return null;
  // "Wechsel" heads the two-way prepositions because it is the shortest label,
  // but it is not a sentence anyone says back to a learner.
  const spokenAnswer = accepted.find((value) => value === "Akkusativ oder Dativ") ?? accepted[0] ?? "";

  return {
    kind: "cell",
    id: `c:${cellKey(table.id, row, col)}`,
    origin,
    direction: cellDirection(table, row, col),
    question: cellQuestion(table, row, col),
    expects: "german",
    accepted,
    answer: spokenAnswer,
    why: null,
    subject: cellSubject(table, row, col),
    tableId: table.id,
    cell: cellKey(table.id, row, col),
    example: table.rows[row]?.example ?? null
  };
}

/**
 * A cell whose question would answer itself.
 *
 * The article and pronoun grids are asked by declining a word the learner
 * already has — "wie heißt *der* im Akkusativ?" — and that word is the
 * nominative. So the nominative cells ask what *der* is in the nominative,
 * which is not a question. They are skipped rather than reworded: there is no
 * other sensible way to ask for a form the learner was just handed, and a
 * grid's three-day chain should not be winnable on cells nobody could get
 * wrong.
 *
 * Computed from the answer rather than from a list of row indices, so a table
 * whose rows are reordered, or one added later, cannot quietly reintroduce it.
 */
function trivialCell(table: ParadigmTable, row: number, col: number): boolean {
  const anchor = CASE_ROW_TABLES.has(table.id)
    ? table.rows[0]?.cells[col]?.[0]
    : LOOKUP_DIRECTIONS[table.id] || ENDING_TABLES.has(table.id)
      ? undefined
      : table.rows[row]?.cells[0]?.[0];
  if (!anchor) return false;
  return (table.rows[row]?.cells[col] ?? []).includes(anchor);
}

/**
 * Which cells today: everything missed, then a window that walks the grid.
 *
 * A window rather than a random sample, for two reasons. The agenda has to be
 * reproducible — the home screen promised this list, and a class resumed after
 * a break has to be the same class. And a window sweeps a whole grid in a few
 * days, where five cells drawn at random leave about a quarter of a sixteen-
 * cell table unasked across a three-day clean run: the run would certify a
 * grid the learner was never asked all of.
 *
 * The missed block is capped, which the typed round deliberately did not do.
 * On screen an untruncated dictionary costs seconds; spoken, one bad day on
 * the prepositions would fill the whole of the next class with prepositions.
 * Nothing is lost — the overflow stays in `missed` and surfaces tomorrow.
 */
export function classCells(
  table: ParadigmTable,
  state: TableProgress | undefined,
  on: string
): readonly { row: number; col: number; missed: boolean }[] {
  // Self-answering cells are dropped before anything else looks at the grid,
  // so the window walks only over cells that are actually questions and a
  // short table does not spend a third of its turn on them.
  const all = cellsOf(table).filter((ref) => !trivialCell(table, ref.row, ref.col));
  const missedKeys = new Set(state?.missed ?? []);
  const missed = all
    .filter((ref) => missedKeys.has(cellKey(ref.tableId, ref.row, ref.col)))
    .slice(0, CLASS_MISSED_CELLS_PER_TABLE);
  const rest = all.filter((ref) => !missedKeys.has(cellKey(ref.tableId, ref.row, ref.col)));

  const start = rest.length ? (dayNumber(on) * CLASS_CELLS_PER_TABLE) % rest.length : 0;
  const window = rest.slice(start, start + CLASS_CELLS_PER_TABLE);
  if (window.length < CLASS_CELLS_PER_TABLE) {
    window.push(...rest.slice(0, CLASS_CELLS_PER_TABLE - window.length));
  }

  return [
    ...missed.map((ref) => ({ row: ref.row, col: ref.col, missed: true })),
    ...window.map((ref) => ({ row: ref.row, col: ref.col, missed: false }))
  ];
}

/* ------------------------------------------------------ gapped sentences */

function blankAsk(
  bank: "grammar" | "topic",
  sourceId: string,
  index: number,
  question: { sentence: string; hint: { de: string; en: string }; answers: readonly string[]; why: { de: string; en: string } },
  label: string,
  origin: ClassAsk["origin"]
): BlankAsk {
  const hint = spoken(question.hint.de);
  return {
    kind: "blank",
    id: `b:${bank}:${sourceId}:${index}`,
    origin,
    direction: [
      `Lies den Satz vor und frage, welches Wort in die Lücke gehört: ${q(question.sentence)}.`,
      hint ? `Hinweis für den Lernenden: ${hint}.` : "",
      "Er soll nur das fehlende Wort sagen."
    ]
      .filter(Boolean)
      .join(" "),
    // On screen the sentence is the question: the gap is visible, so nothing
    // has to be said about where it is.
    question: question.sentence,
    hint: question.hint,
    expects: "german",
    accepted: question.answers,
    answer: question.answers[0] ?? "",
    why: question.why,
    subject: label,
    bank,
    sourceId,
    index,
    sentence: question.sentence
  };
}

function topicAsks(topic: TopicItem, origin: ClassAsk["origin"]): BlankAsk[] {
  return topic.questions.map((question, index) =>
    blankAsk("topic", topic.id, index, question, topic.name.de, origin)
  );
}

/* ---------------------------------------------------------- the reviews */

/**
 * Something got wrong before, come back round. The question is replayed from
 * the book rather than rebuilt from the banks, so an entry survives the word
 * it came from being edited — and a slip the tutor caught in free speech,
 * which was never in a bank at all, comes back exactly as it was put right.
 */
function reviewAsk(entry: Mistake): ReviewAsk {
  return {
    kind: "review",
    id: `r:${entry.id}`,
    origin: "review",
    direction: `Das hatten wir schon einmal. ${entry.prompt}`,
    // The prompt was written as a stage direction when the slip was filed, so
    // it may open with "Frage nach …". Stripped here rather than at filing
    // time: the book holds entries from several versions of this code, and a
    // question that reads oddly is better than one that has been rewritten.
    question: entry.prompt.replace(/^Frage,?\s*(nach\s+)?/iu, "").replace(/^\w/u, (c) => c.toUpperCase()),
    expects: entry.expects,
    accepted: entry.accepted,
    answer: entry.expected,
    why: null,
    subject: entry.subject,
    mistakeId: entry.id,
    of: entry.kind
  };
}

/* ------------------------------------------------------- the conversation */

function talkTurns(section: SyllabusSection, words: readonly string[], on: string): TalkTurn[] {
  const d = dayNumber(on);
  const canDo = section.canDo.length
    ? (section.canDo[d % section.canDo.length]?.de ?? "")
    : "";
  const focus = section.grammar.length
    ? section.grammar.map((_, i) => section.grammar[(d + i) % section.grammar.length]!)
    : [];
  const first = focus[0];
  const second = focus[1] ?? first;
  const useWords = words.slice(0, 4).join(", ");

  const turns: TalkTurn[] = [
    {
      kind: "talk",
      id: `t:${section.id}:0`,
      direction: [
        `[GESPRÄCH] Thema: ${section.title.de}.`,
        canDo ? `Frage ihn etwas Persönliches dazu: ${canDo}.` : "",
        "Hör zu, korrigiere sein Deutsch und stell eine Anschlussfrage. Ungefähr drei Minuten."
      ]
        .filter(Boolean)
        .join(" "),
      subject: section.title.de,
      minutes: 3
    }
  ];

  if (first) {
    turns.push({
      kind: "talk",
      id: `t:${section.id}:1`,
      direction: [
        `[GESPRÄCH] Bleib beim Thema ${section.title.de}.`,
        `Bring ihn dazu, ${first.title.de} zu benutzen — so wie in: ${first.example}`,
        useWords ? `Wenn es passt, arbeite diese Wörter ein: ${useWords}.` : "",
        "Korrigiere jeden Fehler, dann sprich weiter. Ungefähr fünf Minuten."
      ]
        .filter(Boolean)
        .join(" "),
      subject: first.title.de,
      minutes: 5
    });
  }

  if (second) {
    turns.push({
      kind: "talk",
      id: `t:${section.id}:2`,
      direction: [
        `[GESPRÄCH] Lass ihn selbst erzählen — drei, vier Sätze am Stück.`,
        `Achte dabei besonders auf ${second.title.de}.`,
        "Korrigiere am Ende, nicht mitten im Satz. Ungefähr vier Minuten."
      ].join(" "),
      subject: second.title.de,
      minutes: 4
    });
  }

  return turns;
}

/* ---------------------------------------------------- the day's sentences */

/**
 * A number between 0 and 3 that is the same all day and different tomorrow.
 *
 * The typed round shook its sentence ordering up with `Math.random()`, which
 * was fine when the round was built once and then played. A class cannot do
 * that: the home screen shows what today holds, and the lesson that opens
 * afterwards has to be the class it advertised. So the jitter is kept — two
 * mornings in a row should not feel identical — and made a function of the
 * date instead of the clock.
 */
function stableJitter(id: string, on: string): number {
  let hash = 0;
  for (const char of `${id}|${on}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 4;
}

/**
 * The sentences today's class drills, the section's own first.
 *
 * The weighting is `pickGrammar`'s: anything marked a priority always makes
 * the cut, then the least secure, then the least seen. What is added here is
 * the section — a class that has just spent ten minutes on the dative should
 * ask dative sentences — and what is removed is the randomness.
 */
export function classSentences(progress: Progress, sectionId: string, on: string): GrammarItem[] {
  return [...curriculumFor(progress.level).grammar]
    .map((item) => {
      const state = progress.grammar[item.id];
      const secure = (state?.streak ?? 0) >= 2 ? 0 : 10;
      const freshness = 10 - Math.min(state?.seen ?? 0, 10);
      const here = item.section === sectionId ? 20 : 0;
      return {
        item,
        score: (item.priority ? 100 : 0) + here + secure + freshness + stableJitter(item.id, on)
      };
    })
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .map((entry) => entry.item);
}

/* ------------------------------------------------------------ the section */

/**
 * The section the class hangs on: the first one, in syllabus order, that still
 * has a word short of two clean sittings.
 *
 * Vocabulary alone decides it. Topics have their own ladder, and a topic
 * resting on a thirty-five-day interval would otherwise pin the class to
 * section one for two months. Once every word has sat, the class still wants a
 * theme, so it rotates by the day.
 */
export function classSection(progress: Progress, bank: Curriculum, on: string): SyllabusSection {
  const sections = syllabusFor(progress.level ?? DEFAULT_LEVEL).sections;
  const frontier = sections.find((section) =>
    bank.vocab.some(
      (item) => item.section === section.id && (progress.vocab[item.id]?.streak ?? 0) < 2
    )
  );
  if (frontier) return frontier;
  return sections[dayNumber(on) % sections.length] ?? sections[0]!;
}

/* --------------------------------------------------------------- the build */

/** One card then two cells, so no run of one kind of question feels like a list. */
function interleave(cards: readonly ClassItem[][], cells: readonly ClassItem[]): ClassItem[] {
  const out: ClassItem[] = [];
  let c = 0;
  for (const card of cards) {
    out.push(...card);
    out.push(...cells.slice(c, c + 2));
    c += 2;
  }
  out.push(...cells.slice(c));
  return out;
}

function estimate(items: readonly ClassItem[]): number {
  const asks = items.filter((item) => item.kind !== "talk").length;
  const talk = items.reduce((sum, item) => sum + (item.kind === "talk" ? item.minutes : 0), 0);
  return Math.max(5, Math.round((asks * SECONDS_PER_ASK) / 60 + talk));
}

export function buildAgenda(progress: Progress, on: string = todayISO()): ClassAgenda {
  const level = progress.level ?? DEFAULT_LEVEL;
  const bank = curriculumFor(progress.level);
  const section = classSection(progress, bank, on);
  const spare: ClassItem[] = [];
  /** Ids already placed, so nothing in the class is asked twice. */
  const taken = new Set<string>();

  /* 1. the learner's own leaks, first. */
  const reviews: ClassItem[] = [];
  for (const entry of dueMistakes(progress, on)) {
    const ask = reviewAsk(entry);
    if (reviews.length < MISTAKES_PER_CLASS) reviews.push(ask);
    else spare.push(ask);
    taken.add(entry.ref);
  }

  /* 2. vocabulary, whole cards. */
  const words = sessionVocab(progress).filter((item) =>
    !fieldsOf(item).some((field) => taken.has(`${item.id}:${field}`))
  );
  const cards = words.slice(0, CLASS_WORDS).map((item) => cardAsks(item, "due"));
  const spareCards = words
    .slice(CLASS_WORDS, CLASS_WORDS + CLASS_SPARE_WORDS)
    .flatMap((item) => cardAsks(item, "due"));

  /* 3. paradigm cells, missed ones first. */
  const cells: ClassItem[] = [];
  for (const table of dueTables(progress)) {
    for (const ref of classCells(table, progress.tables[table.id], on)) {
      const key = cellKey(table.id, ref.row, ref.col);
      if (taken.has(key)) continue;
      const ask = cellAsk(table, ref.row, ref.col, ref.missed ? "review" : "due");
      if (!ask) continue;
      cells.push(ask);
      taken.add(key);
    }
  }

  /* 4. the section's own sentences. */
  const sentences = classSentences(progress, section.id, on)
    .filter((item) => !taken.has(`grammar:${item.id}:0`))
    .slice(0, CLASS_SENTENCES)
    .map((item) => blankAsk("grammar", item.id, 0, item, item.group.de, "fresh"));

  /* 5. one topic due for review, whole — never a fragment, because a topic
        only climbs its ladder when every one of its questions was answered. */
  const topics = dueTopics(progress);
  const topicQuestions = topics[0] ? topicAsks(topics[0], "due") : [];
  for (const topic of topics.slice(1, 3)) spare.push(...topicAsks(topic, "due"));

  /* 6. the conversation, which is what makes this a class and not a quiz. */
  const talk = talkTurns(section, cards.map((card) => card[0]?.subject ?? ""), on);

  /* 7. weave: reviews first, then thirds of questions between the talk. */
  const questions = [...interleave(cards, cells), ...sentences, ...topicQuestions];
  const third = Math.ceil(questions.length / 3) || 1;
  const items: ClassItem[] = [
    ...reviews,
    ...(talk[0] ? [talk[0]] : []),
    ...questions.slice(0, third),
    ...(talk[1] ? [talk[1]] : []),
    ...questions.slice(third, third * 2),
    ...(talk[2] ? [talk[2]] : []),
    ...questions.slice(third * 2)
  ];

  return {
    date: on,
    level,
    sectionId: section.id,
    sectionTitle: section.title,
    items,
    spare: [...spare, ...spareCards],
    minutes: estimate(items)
  };
}

/* ----------------------------------------------------- storing and resuming */

/** The plan, as little of it as can be stored: what kind, and which one. */
export function planOf(agenda: ClassAgenda): ClassPlanItem[] {
  return agenda.items.map((item) => ({ kind: item.kind, ref: item.id }));
}

/**
 * Rebuild a stored plan into askable questions.
 *
 * Only ids were written down, so the wording comes from today's banks. An item
 * whose referent has gone — a word the learner deleted, a mistake that retired
 * on another device — resolves to nothing and is quietly dropped rather than
 * asked as a blank.
 */
export function agendaFromPlan(progress: Progress): ClassAgenda | null {
  const live = progress.live;
  if (!live) return null;
  // Rebuilt against the day the class belongs to, not against today: a class
  // resumed after a break must be the same class, and the day's rotations —
  // which window of a grid, which grammar point the talk fishes for — are
  // keyed on the date.

  const bank = curriculumFor(live.level);
  const section = classSection(progress, bank, live.date);
  const byId = new Map(bank.vocab.concat(progress.custom).map((item) => [item.id, item]));
  const topics = new Map(bank.topics.map((topic) => [topic.id, topic]));
  const sentences = new Map(bank.grammar.map((item) => [item.id, item]));
  const talk = new Map(talkTurns(section, [], live.date).map((turn) => [turn.id, turn]));

  const items: ClassItem[] = [];
  for (const entry of live.plan) {
    const item = resolve(entry.ref);
    if (item) items.push(item);
  }

  function resolve(ref: string): ClassItem | null {
    const [tag, ...rest] = ref.split(":");
    switch (tag) {
      case "v": {
        const [id, field] = rest;
        const item = id ? byId.get(id) : undefined;
        if (!item || !field) return null;
        return vocabAsk(item, field as VocabField, "due");
      }
      case "c": {
        const cell = parseCellKey(rest.join(":"));
        const table = cell ? tableById(cell.tableId) : undefined;
        if (!cell || !table) return null;
        return cellAsk(table, cell.row, cell.col, "due");
      }
      case "b": {
        const [which, sourceId, index] = rest;
        if (!sourceId) return null;
        if (which === "grammar") {
          const item = sentences.get(sourceId);
          return item ? blankAsk("grammar", item.id, 0, item, item.group.de, "fresh") : null;
        }
        const topic = topics.get(sourceId);
        const question = topic?.questions[Number(index ?? 0)];
        if (!topic || !question) return null;
        return blankAsk("topic", topic.id, Number(index ?? 0), question, topic.name.de, "due");
      }
      case "r": {
        const id = rest.join(":");
        const entry = progress.mistakes.find((m) => m.id === id);
        return entry ? reviewAsk(entry) : null;
      }
      case "t":
        return talk.get(ref) ?? null;
      default:
        return null;
    }
  }

  return {
    date: live.date,
    level: live.level,
    sectionId: section.id,
    sectionTitle: section.title,
    items,
    spare: [],
    minutes: estimate(items)
  };
}

/* ------------------------------------------------- what the tutor is told */

/**
 * The shape of the class, for the system prompt — never its answers.
 *
 * The tutor is given the theme, the grammar to fish for and the day's words as
 * cues, so it can open by saying what the class holds and keep one thread
 * across forty minutes. Meanings, plurals and table cells are withheld: those
 * are the questions, and a tutor that knows the answers eventually gives them.
 */
export interface AgendaDigest {
  readonly section: string;
  readonly blurb: string;
  readonly grammar: readonly string[];
  readonly words: readonly string[];
  readonly counts: {
    readonly reviews: number;
    readonly words: number;
    readonly cells: number;
    readonly sentences: number;
    readonly minutes: number;
  };
}

export function digestOf(agenda: ClassAgenda): AgendaDigest {
  const section = syllabusFor(agenda.level).sections.find((s) => s.id === agenda.sectionId);
  const words = new Set<string>();
  let cells = 0;
  let sentences = 0;
  let reviews = 0;
  for (const item of agenda.items) {
    if (item.kind === "vocab") words.add(item.subject);
    else if (item.kind === "cell") cells += 1;
    else if (item.kind === "blank") sentences += 1;
    else if (item.kind === "review") reviews += 1;
  }

  return {
    section: section?.title.de ?? agenda.sectionTitle.de,
    blurb: section?.blurb.de ?? "",
    grammar: (section?.grammar ?? []).slice(0, 4).map((point) => `${point.title.de}: ${point.example}`),
    words: [...words],
    counts: {
      reviews,
      words: words.size,
      cells,
      sentences,
      minutes: agenda.minutes
    }
  };
}

/** Every paradigm table the class will touch, for the record of the day. */
export function tablesOf(agenda: ClassAgenda): string[] {
  const ids = new Set<string>();
  for (const item of agenda.items) if (item.kind === "cell") ids.add(item.tableId);
  return [...ids].filter((id) => TABLES.some((table) => table.id === id));
}
