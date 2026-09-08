/** Shared domain types for Daily Deutsch. */

export type Lang = "de" | "en";
export type Theme = "light" | "dark";

/** CEFR band a learner drills at. Each has its own content bank. */
export type Level = "A1" | "A2" | "B1" | "B2";

/** A string that exists in both interface languages. */
export type Bilingual = Readonly<Record<Lang, string>>;

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

export interface BlankTask {
  readonly step: 1 | 2;
  readonly kind: "blank";
  readonly sourceId: string;
  readonly bank: "grammar" | "topic";
  readonly label: Bilingual;
  readonly question: BlankQuestion;
}

export type Task = VocabTask | BlankTask;

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
}

/** How one of the four session steps is drawn in the stepper. */
export type StepState = "idle" | "active" | "done";
