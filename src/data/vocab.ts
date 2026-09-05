import type { VocabItem } from "../types";

/**
 * Seeded from daily_vocab_mistakes.md.
 * A word leaves the drill after two consecutive fully-correct answers.
 */
export const VOCAB: readonly VocabItem[] = [
  {
    id: "v_aufwachen",
    kind: "verb",
    word: "aufwachen",
    key: "sein",
    en: ["to wake up", "wake up", "waking up"],
    form: ["aufgewacht"],
    note: {
      de: "Zustandswechsel → immer sein. Nicht verwechseln mit aufstehen (aus dem Bett).",
      en: "A change of state → always sein. Don't confuse it with aufstehen (getting out of bed)."
    }
  },
  {
    id: "v_arzt",
    kind: "noun",
    word: "Arzt",
    key: "der",
    en: ["doctor", "doctor (m)", "male doctor", "physician"],
    form: ["die Ärzte", "Ärzte"],
    note: {
      de: "Plural mit Umlaut + e: die Ärzte. Nicht -en.",
      en: "Plural takes an umlaut plus -e: die Ärzte. Not -en."
    }
  },
  {
    id: "v_aerztin",
    kind: "noun",
    word: "Ärztin",
    key: "die",
    en: ["doctor", "doctor (f)", "female doctor", "physician"],
    form: ["die Ärztinnen", "Ärztinnen"],
    note: {
      de: "Weibliche Formen auf -in bilden den Plural auf -innen.",
      en: "Feminine forms ending in -in take -innen in the plural."
    }
  }
];
