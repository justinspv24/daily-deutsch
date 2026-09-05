import type { Bilingual, GrammarItem } from "../types";

const G = {
  def: { de: "Bestimmte Artikel", en: "Definite articles" },
  indef: { de: "Unbestimmte Artikel", en: "Indefinite articles" },
  pers: { de: "Personalpronomen", en: "Personal pronouns" },
  poss: { de: "Possessivpronomen", en: "Possessive pronouns" },
  prep: { de: "Präpositionen", en: "Prepositions" },
  verbs: { de: "Verben nach Fall", en: "Verbs and their cases" }
} satisfies Record<string, Bilingual>;

/**
 * The six table groups from grammar_tables_drill.md, always drilled as
 * sentences. The hint gives gender and English only — the case is revealed
 * in the explanation, never in the question.
 */
export const GRAMMAR: readonly GrammarItem[] = [
  /* ------------------------------------------------ definite articles */
  {
    id: "g1a", group: G.def, sentence: "___ Mann ist nett.",
    hint: { de: "the man — <code>der Mann</code>", en: "the man — <code>der Mann</code>" },
    answers: ["der"],
    why: { de: "Nominativ: der Mann ist das Subjekt des Satzes.", en: "Nominative: der Mann is the subject of the sentence." }
  },
  {
    id: "g1b", group: G.def, sentence: "Ich sehe ___ Mann.",
    hint: { de: "the man — <code>der Mann</code>", en: "the man — <code>der Mann</code>" },
    answers: ["den"],
    why: { de: "Akkusativ. Nur maskulin ändert sich: der → den.", en: "Accusative. Only the masculine changes: der → den." }
  },
  {
    id: "g1c", group: G.def, sentence: "Ich kaufe ___ Buch.",
    hint: { de: "the book — <code>das Buch</code>", en: "the book — <code>das Buch</code>" },
    answers: ["das"],
    why: { de: "Akkusativ. Neutrum bleibt unverändert: das → das.", en: "Accusative. Neuter stays the same: das → das." }
  },
  {
    id: "g1d", group: G.def, sentence: "Ich gehe mit ___ Frau.",
    hint: { de: "the woman — <code>die Frau</code>", en: "the woman — <code>die Frau</code>" },
    answers: ["der"],
    why: { de: "mit verlangt immer Dativ. Feminin Dativ: die → der.", en: "mit always takes the dative. Feminine dative: die → der." }
  },
  {
    id: "g1e", group: G.def, sentence: "Ich helfe ___ Kind.",
    hint: { de: "the child — <code>das Kind</code>", en: "the child — <code>das Kind</code>" },
    answers: ["dem"],
    why: { de: "helfen verlangt Dativ. Neutrum Dativ: das → dem.", en: "helfen takes the dative. Neuter dative: das → dem." }
  },
  {
    id: "g1f", group: G.def, sentence: "Er gibt ___ Kindern Schokolade.",
    hint: { de: "the children — <code>die Kinder</code> (Plural)", en: "the children — <code>die Kinder</code> (plural)" },
    answers: ["den"],
    why: {
      de: "Dativ Plural: die → den, und das Nomen bekommt ein -n (Kindern).",
      en: "Dative plural: die → den, and the noun itself adds -n (Kindern)."
    }
  },
  {
    id: "g1g", group: G.def, sentence: "Das Auto ___ Mannes ist alt.",
    hint: { de: "the man — <code>der Mann</code>", en: "the man — <code>der Mann</code>" },
    answers: ["des"],
    why: { de: "Genitiv maskulin: des Mannes — das Nomen bekommt -es.", en: "Masculine genitive: des Mannes — the noun adds -es." }
  },

  /* ---------------------------------------------- indefinite articles */
  {
    id: "g2a", group: G.indef, sentence: "Das ist ___ Hund.",
    hint: { de: "a dog — <code>der Hund</code>", en: "a dog — <code>der Hund</code>" },
    answers: ["ein"],
    why: { de: "Nominativ maskulin: ein.", en: "Masculine nominative: ein." }
  },
  {
    id: "g2b", group: G.indef, sentence: "Ich habe ___ Bruder.",
    hint: { de: "a brother — <code>der Bruder</code>", en: "a brother — <code>der Bruder</code>" },
    answers: ["einen"],
    why: { de: "haben verlangt Akkusativ, maskulin: ein → einen.", en: "haben takes the accusative, masculine: ein → einen." }
  },
  {
    id: "g2c", group: G.indef, sentence: "Ich fahre mit ___ Bus.",
    hint: { de: "a bus — <code>der Bus</code>", en: "a bus — <code>der Bus</code>" },
    answers: ["einem"],
    why: { de: "mit + Dativ, maskulin: einem.", en: "mit + dative, masculine: einem." }
  },
  {
    id: "g2d", group: G.indef, sentence: "Ich helfe ___ Frau.",
    hint: { de: "a woman — <code>die Frau</code>", en: "a woman — <code>die Frau</code>" },
    answers: ["einer"],
    why: { de: "helfen + Dativ, feminin: einer.", en: "helfen + dative, feminine: einer." }
  },
  {
    id: "g2e", group: G.indef, sentence: "Wir brauchen ___ Arzt.",
    hint: { de: "a doctor — <code>der Arzt</code>", en: "a doctor — <code>der Arzt</code>" },
    answers: ["einen"],
    why: { de: "brauchen + Akkusativ, maskulin: einen.", en: "brauchen + accusative, masculine: einen." }
  },

  /* ----------------------------------------------- personal pronouns */
  {
    id: "g3a", group: G.pers, sentence: "Er sieht ___ .",
    hint: { de: "me", en: "me" }, answers: ["mich"],
    why: { de: "sehen + Akkusativ: ich → mich.", en: "sehen + accusative: ich → mich." }
  },
  {
    id: "g3b", group: G.pers, sentence: "Ich liebe ___ .",
    hint: { de: "him", en: "him" }, answers: ["ihn"],
    why: { de: "lieben + Akkusativ: er → ihn.", en: "lieben + accusative: er → ihn." }
  },
  {
    id: "g3c", group: G.pers, sentence: "Er gibt ___ das Buch.",
    hint: { de: "me", en: "me" }, answers: ["mir"],
    why: {
      de: "Wer etwas bekommt, steht im Dativ: mir. Das Buch ist der Akkusativ.",
      en: "The receiver goes in the dative: mir. Das Buch is the accusative object."
    }
  },
  {
    id: "g3d", group: G.pers, sentence: "Ich helfe ___ .",
    hint: { de: "her", en: "her" }, answers: ["ihr"],
    why: { de: "helfen + Dativ: sie → ihr.", en: "helfen + dative: sie → ihr." }
  },
  {
    id: "g3e", group: G.pers, sentence: "Wie geht es ___ ?",
    hint: { de: "you (du)", en: "you (du)" }, answers: ["dir"],
    why: { de: "Feste Wendung mit Dativ: Wie geht es dir?", en: "A fixed dative expression: Wie geht es dir?" }
  },
  {
    id: "g3f", group: G.pers, sentence: "Das gefällt ___ .",
    hint: { de: "us", en: "us" }, answers: ["uns"],
    why: { de: "gefallen + Dativ: wir → uns.", en: "gefallen + dative: wir → uns." }
  },
  {
    id: "g3g", group: G.pers, sentence: "Kannst du ___ helfen?",
    hint: { de: "them", en: "them" }, answers: ["ihnen"],
    why: { de: "helfen + Dativ: sie (Plural) → ihnen.", en: "helfen + dative: sie (plural) → ihnen." }
  },

  /* --------------------------------------------- possessive pronouns */
  {
    id: "g4a", group: G.poss, sentence: "Das ist ___ Buch.",
    hint: { de: "my — <code>das Buch</code>", en: "my — <code>das Buch</code>" },
    answers: ["mein"],
    why: { de: "Nominativ Neutrum: mein, ohne Endung.", en: "Neuter nominative: mein, no ending." }
  },
  {
    id: "g4b", group: G.poss, sentence: "Ich sehe ___ Schwester.",
    hint: { de: "his — <code>die Schwester</code>", en: "his — <code>die Schwester</code>" },
    answers: ["seine"],
    why: { de: "Akkusativ feminin sieht aus wie der Nominativ: seine.", en: "Feminine accusative looks like the nominative: seine." }
  },
  {
    id: "g4c", group: G.poss, sentence: "Wir lieben ___ Hund.",
    hint: { de: "our — <code>der Hund</code>", en: "our — <code>der Hund</code>" },
    answers: ["unseren"],
    why: { de: "Akkusativ maskulin: unser → unseren.", en: "Masculine accusative: unser → unseren." }
  },
  {
    id: "g4d", group: G.poss, sentence: "Ich fahre mit ___ Bruder.", priority: true,
    hint: { de: "our — <code>der Bruder</code>", en: "our — <code>der Bruder</code>" },
    answers: ["unserem"],
    why: {
      de: "mit + Dativ, maskulin → unserem. Genau hier lag dein Fehler am 16.07.: du hast den Artikel „dem“ benutzt statt des Possessivpronomens.",
      en: "mit + dative, masculine → unserem. This is exactly the mistake logged on 16 July: you used the article dem instead of the possessive."
    }
  },
  {
    id: "g4e", group: G.poss, sentence: "Sie spielt mit ___ Katze.",
    hint: { de: "her — <code>die Katze</code>", en: "her — <code>die Katze</code>" },
    answers: ["ihrer"],
    why: { de: "mit + Dativ, feminin: ihr → ihrer.", en: "mit + dative, feminine: ihr → ihrer." }
  },
  {
    id: "g4f", group: G.poss, sentence: "Wo ist ___ Handy?",
    hint: { de: "your (ihr) — <code>das Handy</code>", en: "your (ihr) — <code>das Handy</code>" },
    answers: ["euer"],
    why: {
      de: "ihr → euer, im Nominativ Neutrum ohne Endung. Sobald eine Endung kommt, fällt das zweite -e- weg: eure, euren, eurem.",
      en: "ihr → euer, with no ending in the neuter nominative. As soon as an ending appears the second -e- drops: eure, euren, eurem."
    }
  },
  {
    id: "g4g", group: G.poss, sentence: "Ich helfe ___ Vater.",
    hint: { de: "my — <code>der Vater</code>", en: "my — <code>der Vater</code>" },
    answers: ["meinem"],
    why: { de: "helfen + Dativ, maskulin: meinem.", en: "helfen + dative, masculine: meinem." }
  },

  /* ---------------------------------------------------- prepositions */
  {
    id: "g5a", group: G.prep, sentence: "Ich gehe in ___ Küche.",
    hint: { de: "the kitchen — <code>die Küche</code> · ich bewege mich", en: "the kitchen — <code>die Küche</code> · I'm moving there" },
    answers: ["die"],
    why: { de: "Wechselpräposition + Bewegung (wohin?) → Akkusativ: in die Küche.", en: "Two-way preposition + movement (wohin?) → accusative: in die Küche." }
  },
  {
    id: "g5b", group: G.prep, sentence: "Ich bin in ___ Küche.",
    hint: { de: "the kitchen — <code>die Küche</code> · ich bin schon dort", en: "the kitchen — <code>die Küche</code> · I'm already there" },
    answers: ["der"],
    why: { de: "Wechselpräposition + Ort (wo?) → Dativ: in der Küche.", en: "Two-way preposition + location (wo?) → dative: in der Küche." }
  },
  {
    id: "g5c", group: G.prep, sentence: "Ich lege das Buch auf ___ Tisch.",
    hint: { de: "the table — <code>der Tisch</code>", en: "the table — <code>der Tisch</code>" },
    answers: ["den"],
    why: { de: "legen ist Bewegung → Akkusativ: auf den Tisch.", en: "legen means movement → accusative: auf den Tisch." }
  },
  {
    id: "g5d", group: G.prep, sentence: "Das Buch liegt auf ___ Tisch.",
    hint: { de: "the table — <code>der Tisch</code>", en: "the table — <code>der Tisch</code>" },
    answers: ["dem"],
    why: { de: "liegen ist Ort → Dativ: auf dem Tisch.", en: "liegen means location → dative: auf dem Tisch." }
  },
  {
    id: "g5e", group: G.prep, sentence: "Wir fahren ___ Nürnberg.",
    hint: { de: "to (eine Stadt)", en: "to (a city)" }, answers: ["nach"],
    why: { de: "Städte und Länder ohne Artikel nehmen nach (+ Dativ).", en: "Cities and article-less countries take nach (+ dative)." }
  },
  {
    id: "g5f", group: G.prep, sentence: "Ich komme ___ Indien.",
    hint: { de: "from (Herkunft)", en: "from (origin)" }, answers: ["aus"],
    why: { de: "Herkunft → aus (+ Dativ).", en: "Origin → aus (+ dative)." }
  },
  {
    id: "g5g", group: G.prep, sentence: "Er geht ___ den Park.",
    hint: { de: "through", en: "through" }, answers: ["durch"],
    why: { de: "DOG UM — durch, ohne, gegen, um — immer Akkusativ: den Park.", en: "DOG UM — durch, ohne, gegen, um — always accusative: den Park." }
  },
  {
    id: "g5h", group: G.prep, sentence: "Ich mache das ___ dich.",
    hint: { de: "for", en: "for" }, answers: ["für"],
    why: { de: "für nimmt immer Akkusativ: für dich.", en: "für always takes the accusative: für dich." }
  },
  {
    id: "g5i", group: G.prep, sentence: "Sie wohnt hier ___ zwei Jahren.",
    hint: { de: "since / for", en: "since / for" }, answers: ["seit"],
    why: { de: "seit nimmt immer Dativ: seit zwei Jahren.", en: "seit always takes the dative: seit zwei Jahren." }
  },

  /* -------------------------------------------------- verbs and case */
  {
    id: "g6a", group: G.verbs, sentence: "Ich danke ___ Lehrer.",
    hint: { de: "the teacher — <code>der Lehrer</code>", en: "the teacher — <code>der Lehrer</code>" },
    answers: ["dem"],
    why: { de: "danken verlangt Dativ.", en: "danken takes the dative." }
  },
  {
    id: "g6b", group: G.verbs, sentence: "Das gehört ___ Mann.",
    hint: { de: "the man — <code>der Mann</code>", en: "the man — <code>der Mann</code>" },
    answers: ["dem"],
    why: { de: "gehören verlangt Dativ.", en: "gehören takes the dative." }
  },
  {
    id: "g6c", group: G.verbs, sentence: "Ich antworte ___ Lehrerin.",
    hint: { de: "the teacher (f) — <code>die Lehrerin</code>", en: "the teacher (f) — <code>die Lehrerin</code>" },
    answers: ["der"],
    why: { de: "antworten verlangt Dativ, feminin: der.", en: "antworten takes the dative, feminine: der." }
  },
  {
    id: "g6d", group: G.verbs, sentence: "Ich brauche ___ Hund.",
    hint: { de: "the dog — <code>der Hund</code>", en: "the dog — <code>der Hund</code>" },
    answers: ["den"],
    why: { de: "brauchen verlangt Akkusativ, maskulin: den.", en: "brauchen takes the accusative, masculine: den." }
  },
  {
    id: "g6e", group: G.verbs, sentence: "Das gefällt ___ .",
    hint: { de: "me", en: "me" }, answers: ["mir"],
    why: { de: "gefallen verlangt Dativ: mir.", en: "gefallen takes the dative: mir." }
  }
];
