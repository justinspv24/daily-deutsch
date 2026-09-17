/** Shared domain types for Daily Deutsch. */

export type Lang = "de" | "en";
export type Theme = "light" | "dark";

/** CEFR band a learner drills at. Each has its own content bank. */
export type Level = "A1" | "A2" | "B1" | "B2";

/** A string that exists in both interface languages. */
export type Bilingual = Readonly<Record<Lang, string>>;

/**
 * The interface languages plus Malayalam. Only the paradigm tables carry this:
 * the drill itself stays German-first with an English gloss, while the tables
 * a learner has to memorise get their mother tongue alongside.
 */
export type Trilingual = Readonly<{ de: string; en: string; ml: string }>;

/* ------------------------------------------------------------------ content */

export type VocabKind = "verb" | "noun";

export interface VocabItem {
  readonly id: string;
  readonly kind: VocabKind;
  readonly word: string;
  /** der/die/das for nouns, sein/haben for verbs. */
  readonly key: string;
  readonly en: readonly string[];
  /** Partizip II for verbs, plural for nouns. */
  readonly form: readonly string[];
  readonly note: Bilingual;
}

/** A fill-in-the-blank sentence. `___` marks the gap. */
export interface BlankQuestion {
  readonly sentence: string;
  /** Gender and English gloss only — never the case. May contain <code>. */
  readonly hint: Bilingual;
  readonly answers: readonly string[];
  readonly why: Bilingual;
  readonly caseSensitive?: boolean;
}

export interface GrammarItem extends BlankQuestion {
  readonly id: string;
  readonly group: Bilingual;
  readonly priority?: boolean;
}

export interface TopicItem {
  readonly id: string;
  readonly name: Bilingual;
  readonly seedStage: number;
  readonly questions: readonly BlankQuestion[];
}

/* ------------------------------------------------------- paradigm tables */

/** A worked sentence showing one row of a table doing its job. */
export interface TableExample {
  readonly de: string;
  readonly en: string;
  readonly ml: string;
}

export interface TableRow {
  readonly label: Trilingual;
  /** One entry per column; each entry lists the answers accepted for that cell. */
  readonly cells: readonly (readonly string[])[];
  readonly example?: TableExample;
}

/** A grid to be learnt by heart — articles, pronouns, endings, verb cases. */
export interface ParadigmTable {
  readonly id: string;
  readonly name: Trilingual;
  readonly blurb: Trilingual;
  readonly columns: readonly Trilingual[];
  readonly rows: readonly TableRow[];
  readonly example: TableExample;
}

export interface UpcomingTopic {
  readonly title: Bilingual;
  readonly blurb: Bilingual;
}

/* ---------------------------------------------------------------- progress */

export interface VocabProgress {
  streak: number;
  seen: number;
  lastDate: string | null;
}

export interface GrammarProgress {
  streak: number;
  seen: number;
}

export interface TopicProgress {
  stage: number;
  /** ISO date this topic is next due. */
  due: string;
  lastDate: string | null;
}

/**
 * A table is mastered only after three separate days swept clean — answering
 * every cell right twice in one sitting proves nothing about tomorrow.
 */
export interface TableProgress {
  /** Consecutive days finished without a single wrong cell. Three retires it. */
  dayStreak: number;
  /** The last day it was drilled, so one day can never count twice. */
  lastDate: string | null;
  /** ISO date it comes back. */
  due: string;
  /** Cells missed last time — the personal dictionary, asked first next day. */
  missed: string[];
  /** True once the whole grid has been shown as a study card. */
  studied: boolean;
}

export interface SessionRecord {
  date: string;
  right: number;
  total: number;
}

export interface Progress {
  updatedAt: string;
  /** Chosen on first sign-in; null until then (the A2 bank is drilled meanwhile). */
  level: Level | null;
  /** Words the learner added themselves. Drilled alongside the level's bank. */
  custom: VocabItem[];
  vocab: Record<string, VocabProgress>;
  grammar: Record<string, GrammarProgress>;
  topics: Record<string, TopicProgress>;
  tables: Record<string, TableProgress>;
  sessions: SessionRecord[];
}

/* ------------------------------------------------------------------- auth */

export interface Learner {
  id: string;
  email: string | null;
  displayName: string | null;
}

/* ----------------------------------------------------------------- session */

export type Verdict = "ok" | "near" | "no";

export interface VocabTask {
  readonly step: 0;
  readonly kind: "vocab";
  readonly item: VocabItem;
}

/** The whole grid, shown to read before it is ever asked. */
export interface TableStudyTask {
  readonly step: 1;
  readonly kind: "table-study";
  readonly table: ParadigmTable;
}

/** One cell of one table: "Dativ, feminin → ___". */
export interface TableCellTask {
  readonly step: 1;
  readonly kind: "table-cell";
  readonly tableId: string;
  readonly tableName: Trilingual;
  readonly row: number;
  readonly col: number;
  readonly rowLabel: Trilingual;
  readonly colLabel: Trilingual;
  readonly answers: readonly string[];
  readonly example: TableExample | null;
}

export interface BlankTask {
  readonly step: 2 | 3;
  readonly kind: "blank";
  readonly sourceId: string;
  readonly bank: "grammar" | "topic";
  readonly label: Bilingual;
  readonly question: BlankQuestion;
}

export type Task = VocabTask | TableStudyTask | TableCellTask | BlankTask;

export interface ResultRow {
  prompt: string;
  ok: boolean;
  given: string;
  expected: string;
  why: Bilingual | null;
}

export interface SessionState {
  tasks: Task[];
  index: number;
  /** Indices of tasks already graded, so a revisited question is never counted twice. */
  answered: number[];
  results: ResultRow[];
  topicHits: Record<string, { right: number; wrong: number }>;
  /** Right/wrong per table this round, and which cells were missed. */
  tableHits: Record<string, { right: number; wrong: number; missed: string[] }>;
}

/** How one of the four session steps is drawn in the stepper. */
export type StepState = "idle" | "active" | "done";
