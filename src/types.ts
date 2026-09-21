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
  /** The syllabus section this word belongs to, so the map can show what is drilled. */
  readonly section?: string;
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
  /** The syllabus section this sentence drills. */
  readonly section?: string;
}

export interface TopicItem {
  readonly id: string;
  readonly name: Bilingual;
  readonly seedStage: number;
  readonly questions: readonly BlankQuestion[];
  /** The syllabus section this topic reviews. */
  readonly section?: string;
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

/**
 * A noun's `form` when it has no plural to ask for — mass nouns (die Butter)
 * and plural-only nouns (die Eltern). The vocabulary card then has two
 * fields instead of three, and the tutor asks two questions instead of three.
 */
export const NO_PLURAL = "—";

/* ---------------------------------------------------------------- syllabus */

/** A grammar point a section teaches, with one sentence that shows it working. */
export interface SyllabusGrammar {
  readonly title: Bilingual;
  readonly example: string;
  readonly gloss: string;
  /** Key into the illustration library, when a diagram helps it stick. */
  readonly illustration?: string;
}

/**
 * Somewhere to learn more. Only official or long-established sources; where a
 * deep link could not be verified, the link is a search rather than a guess.
 */
export interface SyllabusLink {
  readonly kind: "video" | "course" | "reading";
  readonly label: Bilingual;
  readonly url: string;
}

/**
 * One topic of a level: what you can do afterwards, the grammar, the links.
 * Its vocabulary is not listed here — it is the drill bank's words tagged
 * with this section, so what the syllabus shows and what the drill asks can
 * never be two different lists.
 */
export interface SyllabusSection {
  readonly id: string;
  readonly title: Bilingual;
  readonly blurb: Bilingual;
  readonly canDo: readonly Bilingual[];
  readonly grammar: readonly SyllabusGrammar[];
  readonly links: readonly SyllabusLink[];
}

export interface LevelSyllabus {
  readonly level: Level;
  readonly title: Bilingual;
  readonly intro: Bilingual;
  /** The exams this level maps onto. */
  readonly exam: Bilingual;
  /** Guideline teaching hours to reach the level, as the institutes quote them. */
  readonly hours: Bilingual;
  /** The official documents the syllabus was built against. */
  readonly sources: readonly SyllabusLink[];
  readonly sections: readonly SyllabusSection[];
}

/* ------------------------------------------------------------------- media */

/**
 * A portion of a YouTube video that explains one section's topic. Only the
 * portion: `start` and `end` are the seconds the embed plays between, and the
 * link out jumps to `start`. Every clip here was found by research against
 * community recommendations and re-verified by a second, skeptical pass
 * before it was written down — `evidence` says by what.
 */
export interface VideoClip {
  readonly videoId: string;
  readonly title: string;
  readonly channel: string;
  readonly start: number;
  readonly end: number;
  readonly lengthSeconds: number;
  readonly label: Bilingual;
  /** What the clip covers, and how its start and end were determined. */
  readonly why: string;
  /** The recommendation evidence the research turned up, with its source. */
  readonly evidence: string;
  readonly viewCount?: number;
  readonly language?: string;
}

/** A podcast that suits a level, with the feed its episodes are read from. */
export interface PodcastShow {
  readonly level: Level;
  readonly name: string;
  readonly homepage: string;
  readonly feedUrl: string;
  readonly fit: string;
  readonly evidence: string;
}

/** One episode, matched to one section, playable in the app from its audio URL. */
export interface PodcastEpisode {
  readonly section: string;
  readonly level: Level;
  readonly show: string;
  readonly title: string;
  readonly pageUrl: string;
  readonly audioUrl: string;
  readonly durationSeconds?: number;
  readonly label: Bilingual;
  readonly why: string;
  readonly evidence: string;
}

/** Everything to watch and listen to for one section. */
export interface SectionMedia {
  readonly section: string;
  readonly level: Level;
  readonly videos: readonly VideoClip[];
  readonly podcasts: readonly PodcastEpisode[];
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
  /** Seconds of class. Absent on rows written before classes were timed. */
  seconds?: number;
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
  /** Wrong answers still owed a review, on the 3/7/21 ladder. */
  mistakes: Mistake[];
  /** Finished classes, oldest first. Capped, like `sessions`. */
  classes: ClassRecord[];
  /** The class still open, or null. At most one, whatever device started it. */
  live: LiveClass | null;
}

/* ------------------------------------------------------------------- auth */

export interface Learner {
  id: string;
  email: string | null;
  displayName: string | null;
}

/* ------------------------------------------------------------- the lesson */

export type Verdict = "ok" | "near" | "no";

/**
 * What a spoken answer is asking for, which decides how it is read before it
 * reaches the grader. Asked for an article a learner says "ähm, ich glaube
 * der"; asked for a meaning they say a sentence. `speech.ts` does the reading,
 * but the *kind* of thing being asked is a property of the question, so it
 * lives here with the rest of the domain.
 */
export type Expects = "article" | "aux" | "english" | "german" | "none";

/** Which box of a vocabulary card an answer belonged in. */
export type VocabField = "key" | "meaning" | "form";

/** Why an item is in today's class, so a re-ask can be introduced as one. */
export type AskOrigin = "review" | "due" | "fresh";

/** Everything a closed question needs to be asked, heard, graded and filed. */
export interface ClassAskBase {
  /** Unique within one class. Outcomes and the summary key off it. */
  readonly id: string;
  readonly origin: AskOrigin;
  /**
   * What the tutor is *told* to ask, in German. A stage direction, not a
   * script: the tutor puts it in its own warm words, exactly as the spoken
   * round's [FRAGE] turns have always worked.
   */
  readonly direction: string;
  readonly expects: Expects;
  /**
   * Every answer the grader accepts. This never leaves the browser — telling
   * the model the answer is telling it to the learner, eventually.
   */
  readonly accepted: readonly string[];
  /** Said back after a wrong attempt. `accepted[0]` unless that reads oddly. */
  readonly answer: string;
  /** One sentence of why, from the bank. Both languages, or nothing. */
  readonly why: Bilingual | null;
  /** How the profile and the summary list it: "die Reise", "Dativ · maskulin". */
  readonly subject: string;
}

export interface VocabAsk extends ClassAskBase {
  readonly kind: "vocab";
  readonly vocabId: string;
  readonly field: VocabField;
  /** The English meaning, kept so a missed word can be listed with it. */
  readonly gloss: string;
}

export interface CellAsk extends ClassAskBase {
  readonly kind: "cell";
  readonly tableId: string;
  /** Exactly as `cellKey()` writes it: `<tableId>#<row>:<col>`. */
  readonly cell: string;
  /** The row's worked sentence, read out only after a wrong answer. */
  readonly example: TableExample | null;
}

export interface BlankAsk extends ClassAskBase {
  readonly kind: "blank";
  readonly bank: "grammar" | "topic";
  readonly sourceId: string;
  /** Index into a topic's `questions`; always 0 for a grammar item. */
  readonly index: number;
  /** The sentence, with `___` where the gap is. */
  readonly sentence: string;
}

/** One entry of the book of errors, come back round on the 3/7/21 ladder. */
export interface ReviewAsk extends ClassAskBase {
  readonly kind: "review";
  readonly mistakeId: string;
  /**
   * What it was before it was a review — a word, a table cell, a sentence.
   * Carried so that a review got wrong again is listed under the right
   * heading in the day's summary rather than filed as "grammar" because that
   * happens to be what a review is made of.
   */
  readonly of: MistakeKind;
}

/**
 * A stretch of real conversation. It has no accepted answer, which is the
 * whole point: this is the part of the class the app cannot mark and the model
 * can. The tutor is steered here rather than graded — a theme, a grammar point
 * to fish for, and the day's words to work in.
 */
export interface TalkTurn {
  readonly kind: "talk";
  readonly id: string;
  readonly direction: string;
  readonly subject: string;
  /** Roughly how long the stretch should run, for the agenda's own estimate. */
  readonly minutes: number;
}

/** A question the app asked, knows the answer to, and will mark itself. */
export type ClassAsk = VocabAsk | CellAsk | BlankAsk | ReviewAsk;

export type ClassItem = ClassAsk | TalkTurn;

/**
 * One item of the plan, small enough to store: an id and nothing else. The
 * question itself is never written down, so a class resumed after a bank has
 * been edited asks today's question rather than last week's.
 */
export interface ClassPlanItem {
  readonly kind: ClassItem["kind"];
  readonly ref: string;
}

/**
 * Today's class, computed before the call opens.
 *
 * Deterministic from `Progress` and the date, for the same reason
 * `sessionVocab` is: the home screen shows what today holds, a class resumed
 * after a break has to be the same class, and a midnight auto-close has to be
 * able to say what was on the plan. Nothing in here is drawn at random.
 */
export interface ClassAgenda {
  readonly date: string;
  readonly level: Level;
  /** The syllabus section the conversation hangs on. */
  readonly sectionId: string;
  readonly sectionTitle: Bilingual;
  /** The class, in the order it is taught. */
  readonly items: readonly ClassItem[];
  /**
   * More of the same, drawn on only if the learner is still going. A class has
   * no fixed length; this is what stops one that runs long from turning into
   * the tutor improvising questions it has no answers for.
   */
  readonly spare: readonly ClassItem[];
  /** The agenda's own estimate of `items`, in minutes. Shown on the start pill. */
  readonly minutes: number;
}

/** What the learner did with one closed question. */
export interface ClassAnswer {
  readonly itemId: string;
  readonly kind: ClassAsk["kind"];
  readonly verdict: Verdict;
  readonly prompt: string;
  readonly given: string;
  readonly expected: string;
  readonly why: Bilingual | null;
}

/* ------------------------------------------------------ the book of errors */

/**
 * What kind of thing was got wrong, and therefore how it comes back.
 *   vocab      — the meaning, article or form of one word
 *   table      — one cell of one paradigm grid
 *   grammar    — a gapped sentence, or a point the tutor asked about
 *   correction — a sentence the learner said wrong and the tutor put right
 */
export type MistakeKind = "vocab" | "table" | "grammar" | "correction";

/**
 * One slip exactly as it happened, frozen into a day's summary.
 *
 * Deliberately a copy and not a reference to the live `Mistake`. A summary is
 * a photograph of a day: once the ladder has moved that entry on — or retired
 * it altogether — the photograph must still show what happened that morning.
 */
export interface MistakeNote {
  readonly kind: MistakeKind;
  /** What it is listed under: "die Butter", "Dativ · maskulin". */
  readonly subject: string;
  readonly prompt: string;
  readonly expected: string;
  readonly given: string;
}

/**
 * A wrong answer the app has undertaken to ask again, on day 3, day 7 and
 * day 21.
 *
 * This is not `TopicProgress`. That ladder (1/3/7/21/35, in `scheduler.ts`)
 * paces whole syllabus topics; this one paces a single answer, and folding
 * them together would mean one wrong article dragging an entire topic back a
 * rung. Nor is it `TableProgress.missed`, which is the within-grid dictionary
 * that a table's three-clean-days rule uses and that one clean sweep empties.
 * A cell may sit in both at once, and should: the grid asks it again tomorrow,
 * and this asks it again in three weeks, when the grid has long retired.
 */
export interface Mistake {
  /** `<kind>:<ref>` — stable, so one cell is one entry and not one per slip. */
  readonly id: string;
  readonly kind: MistakeKind;
  /** Word id and field, cell key, sentence reference, or a normalised phrase. */
  readonly ref: string;
  readonly subject: string;
  /** English meaning for a word, the row and column for a cell, "" otherwise. */
  readonly gloss: string;
  readonly prompt: string;
  readonly expected: string;
  /** Everything the grader accepts when it comes back round. */
  readonly accepted: readonly string[];
  readonly expects: Expects;
  /** The most recent wrong answer, so the review can show the contrast. */
  given: string;
  readonly firstMissed: string;
  /** Last day it was put to the learner, so one day can never credit twice. */
  lastAsked: string | null;
  /** Rung of the 3/7/21 ladder. 0 = not yet reviewed; reaching 3 retires it. */
  stage: number;
  /** ISO date it comes back. */
  due: string;
  /** Times missed in all. From two, the first rung shortens to a single day. */
  misses: number;
}

/* ------------------------------------------------------------ the classes */

/** Why a class stopped. */
export type ClassEnding =
  /** The learner pressed "End class". */
  | "ended"
  /** Midnight came and nobody had. */
  | "midnight"
  /** It was still open when a newer class started. */
  | "dropped";

/** A finished class: the day's summary, as it will be read a year from now. */
export interface ClassRecord {
  readonly id: string;
  /** The day it belongs to, by the learner's own clock. */
  readonly date: string;
  readonly startedAt: string;
  readonly endedAt: string;
  /**
   * Seconds actually spent in the room, breaks excluded. Deliberately not
   * `endedAt - startedAt`, which counts the coffee and, for a class closed at
   * midnight, the whole evening.
   */
  readonly seconds: number;
  readonly level: Level;
  /** What was covered, for the day view: section, tables, words. */
  readonly sections: readonly string[];
  readonly tables: readonly string[];
  readonly words: readonly string[];
  readonly right: number;
  readonly wrong: number;
  readonly mistakes: readonly MistakeNote[];
  readonly ending: ClassEnding;
}

/**
 * The class still open. At most one per learner: a second class on the same
 * day is a second `ClassRecord`, never a second one of these.
 */
export interface LiveClass {
  readonly id: string;
  readonly date: string;
  readonly startedAt: string;
  readonly level: Level;
  readonly plan: readonly ClassPlanItem[];
  /** How far down the plan the lesson had got. */
  cursor: number;
  /**
   * Seconds banked by every stretch that has already ended. Never derived
   * from two clocks — see `liveclass.ts`.
   */
  seconds: number;
  /** When the current stretch began. Null on a break, or while backgrounded. */
  resumedAt: string | null;
  right: number;
  wrong: number;
  /**
   * Every closed question answered so far.
   *
   * Kept whole rather than reduced to counters because the ladders are rolled
   * forward once, when the class closes: a word's streak only moves when every
   * field of its card was right, and a topic only climbs when every one of its
   * questions was answered. Neither can be decided one answer at a time, and a
   * class that ends at midnight with nobody watching has to be scorable from
   * what was written down.
   */
  answers: ClassAnswer[];
  mistakes: MistakeNote[];
  sections: string[];
  tables: string[];
  words: string[];
}
