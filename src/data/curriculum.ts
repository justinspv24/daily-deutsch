import type { Bilingual, GrammarItem, Level, TopicItem, UpcomingTopic, VocabItem } from "../types";
import { A1_GRAMMAR, A1_TOPICS, A1_UPCOMING, A1_VOCAB } from "./a1";
import { B1_GRAMMAR, B1_TOPICS, B1_UPCOMING, B1_VOCAB } from "./b1";
import { B2_GRAMMAR, B2_TOPICS, B2_UPCOMING, B2_VOCAB } from "./b2";
import { GRAMMAR } from "./grammar";
import { TOPICS, UPCOMING } from "./topics";
import { VOCAB } from "./vocab";

/** Everything one level drills: its words, table sentences, review topics and what comes next. */
export interface Curriculum {
  readonly level: Level;
  readonly vocab: readonly VocabItem[];
  readonly grammar: readonly GrammarItem[];
  readonly topics: readonly TopicItem[];
  readonly upcoming: readonly UpcomingTopic[];
}

export interface LevelInfo {
  readonly name: Bilingual;
  readonly blurb: Bilingual;
  /** Three things this level drills, shown as chips on the level picker. */
  readonly focus: readonly Bilingual[];
}

export const LEVELS: readonly Level[] = ["A1", "A2", "B1", "B2"];

/** What a learner drills before choosing — the original A1→A2 bank. */
export const DEFAULT_LEVEL: Level = "A2";

export const LEVEL_INFO: Record<Level, LevelInfo> = {
  A1: {
    name: { de: "Anfänger", en: "Beginner" },
    blurb: {
      de: "Erste Sätze: sein und haben, Artikel, Fragen, Zahlen und die wichtigsten Verben.",
      en: "First sentences: sein and haben, articles, questions, numbers and the core verbs."
    },
    focus: [
      { de: "sein & haben", en: "sein & haben" },
      { de: "Artikel", en: "Articles" },
      { de: "Fragewörter", en: "Question words" }
    ]
  },
  A2: {
    name: { de: "Grundstufe", en: "Elementary" },
    blurb: {
      de: "Die vier Fälle in echten Sätzen, Perfekt, trennbare Verben und Nebensätze.",
      en: "The four cases in real sentences, the perfect tense, separable verbs and subordinate clauses."
    },
    focus: [
      { de: "Vier Fälle", en: "Four cases" },
      { de: "Perfekt", en: "Perfect tense" },
      { de: "Nebensätze", en: "Subordinate clauses" }
    ]
  },
  B1: {
    name: { de: "Mittelstufe", en: "Intermediate" },
    blurb: {
      de: "Adjektivendungen, Konjunktiv II, Präteritum, Relativsätze und der Genitiv.",
      en: "Adjective endings, Konjunktiv II, the simple past, relative clauses and the genitive."
    },
    focus: [
      { de: "Adjektivendungen", en: "Adjective endings" },
      { de: "Konjunktiv II", en: "Konjunktiv II" },
      { de: "Relativsätze", en: "Relative clauses" }
    ]
  },
  B2: {
    name: { de: "Fortgeschritten", en: "Upper intermediate" },
    blurb: {
      de: "Indirekte Rede, Passiv in allen Zeiten, Partizipien, Nominalstil und Genitivpräpositionen.",
      en: "Indirect speech, the passive in every tense, participles, nominal style and genitive prepositions."
    },
    focus: [
      { de: "Konjunktiv I", en: "Konjunktiv I" },
      { de: "Passiv", en: "Passive" },
      { de: "Partizipien", en: "Participles" }
    ]
  }
};

const BANKS: Record<Level, Curriculum> = {
  A1: { level: "A1", vocab: A1_VOCAB, grammar: A1_GRAMMAR, topics: A1_TOPICS, upcoming: A1_UPCOMING },
  A2: { level: "A2", vocab: VOCAB, grammar: GRAMMAR, topics: TOPICS, upcoming: UPCOMING },
  B1: { level: "B1", vocab: B1_VOCAB, grammar: B1_GRAMMAR, topics: B1_TOPICS, upcoming: B1_UPCOMING },
  B2: { level: "B2", vocab: B2_VOCAB, grammar: B2_GRAMMAR, topics: B2_TOPICS, upcoming: B2_UPCOMING }
};

export function isLevel(value: unknown): value is Level {
  return typeof value === "string" && (LEVELS as readonly string[]).includes(value);
}

export function curriculumFor(level: Level | null | undefined): Curriculum {
  return BANKS[level ?? DEFAULT_LEVEL];
}

export function allCurricula(): readonly Curriculum[] {
  return LEVELS.map((level) => BANKS[level]);
}
