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
const TABLE_SENTENCES: readonly GrammarItem[] = [
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
    id: "g6e", group: G.verbs, sentence: "Der Film gefällt ___ .",
    hint: { de: "me", en: "me" }, answers: ["mir"],
    why: { de: "gefallen verlangt Dativ: mir.", en: "gefallen takes the dative: mir." }
  }
];

/* --------------------------------------------- the rest of the A2 syllabus */

/**
 * Which section of the A2 map each table group drills. The tables are the
 * cases in real sentences, which is what the housing, travel and family
 * sections teach; tagging them there is honest rather than convenient.
 */
const SECTION_OF_GROUP: Readonly<Record<string, string>> = {
  [G.def.de]: "a2_s03",
  [G.indef.de]: "a2_s03",
  [G.verbs.de]: "a2_s03",
  [G.prep.de]: "a2_s04",
  [G.pers.de]: "a2_s09",
  [G.poss.de]: "a2_s09"
};

const bi = (de: string, en: string): Bilingual => ({ de, en });

const g = (
  id: string,
  group: Bilingual,
  sentence: string,
  hint: Bilingual,
  answers: readonly string[],
  why: Bilingual,
  section: string
): GrammarItem => ({ id, group, sentence, hint, answers, why, section });

const G2 = {
  perf: bi("Perfekt", "Perfect tense"),
  praet: bi("Präteritum", "Simple past"),
  neben: bi("Nebensätze & Modalverben", "Subordinate clauses & modals"),
  refl: bi("Reflexive Verben", "Reflexive verbs"),
  komp: bi("Komparativ & Superlativ", "Comparative & superlative"),
  frag: bi("ob, wenn, wann, denn", "ob, wenn, wann, denn"),
  adj: bi("Adjektivendungen & Genitiv", "Adjective endings & genitive"),
  vprep: bi("Verben mit Präposition", "Verbs with prepositions"),
  brief: bi("E-Mail schreiben", "Writing an e-mail")
} satisfies Record<string, Bilingual>;

const MORE: readonly GrammarItem[] = [
  /* s01 — Perfekt */
  g("g7a", G2.perf, "Wir ___ am Wochenende nach Berlin gefahren.", bi("Hilfsverb", "auxiliary"), ["sind"],
    bi("fahren = Bewegung → sein: wir sind gefahren.", "fahren = movement → sein: wir sind gefahren."), "a2_s01"),
  g("g7b", G2.perf, "Ich habe gestern lange ___. (arbeiten)", bi("Partizip II", "past participle"), ["gearbeitet"],
    bi("Stamm auf -t → -et: gearbeitet.", "Stem in -t → -et: gearbeitet."), "a2_s01"),
  g("g7c", G2.perf, "Er hat seine Oma ___. (besuchen)", bi("Partizip II", "past participle"), ["besucht"],
    bi("be- ist untrennbar → kein ge-: besucht.", "be- is inseparable → no ge-: besucht."), "a2_s01"),

  /* s02 — Präteritum */
  g("g8a", G2.praet, "Gestern ___ ich krank. (sein)", bi("Präteritum", "simple past"), ["war"],
    bi("sein im Präteritum: ich war.", "sein in the simple past: ich war."), "a2_s02"),
  g("g8b", G2.praet, "Wir ___ keine Zeit. (haben — Präteritum)", bi("Präteritum", "simple past"), ["hatten"],
    bi("haben im Präteritum: wir hatten.", "haben in the simple past: wir hatten."), "a2_s02"),
  g("g8c", G2.praet, "Ich ___ nicht kommen. (können — Präteritum)", bi("Präteritum", "simple past"), ["konnte"],
    bi("Modalverb im Präteritum: konnte — ohne Umlaut.", "Modal in the simple past: konnte — no umlaut."), "a2_s02"),

  /* s05 — Nebensätze & Modalverben */
  g("g9a", G2.neben, "Ich lerne Deutsch, weil ich in Nürnberg ___. (arbeiten)", bi("Verb am Ende", "verb at the end"), ["arbeite"],
    bi("Nach weil geht das Verb ans Ende: … arbeite.", "After weil the verb goes to the end: … arbeite."), "a2_s05"),
  g("g9b", G2.neben, "Ich glaube, dass er morgen ___. (kommen)", bi("Verb am Ende", "verb at the end"), ["kommt"],
    bi("dass-Satz: konjugiertes Verb am Ende.", "dass-clause: conjugated verb at the end."), "a2_s05"),
  g("g9c", G2.neben, "Hier ___ man nicht parken. (dürfen)", bi("Modalverb", "modal verb"), ["darf"],
    bi("dürfen = Erlaubnis; man darf nicht = verboten.", "dürfen = permission; man darf nicht = forbidden."), "a2_s05"),

  /* s06 — Reflexive Verben */
  g("g10a", G2.refl, "Ich fühle ___ heute besser.", bi("Reflexivpronomen", "reflexive pronoun"), ["mich"],
    bi("sich fühlen → Akkusativ: mich.", "sich fühlen → accusative: mich."), "a2_s06"),
  g("g10b", G2.refl, "Du solltest ___ ausruhen.", bi("Reflexivpronomen (du)", "reflexive pronoun (du)"), ["dich"],
    bi("sich ausruhen → Akkusativ: dich.", "sich ausruhen → accusative: dich."), "a2_s06"),
  g("g10c", G2.refl, "Wasch ___ die Hände! (du)", bi("Reflexivpronomen (du) — mit Akkusativobjekt", "reflexive pronoun (du) — with an accusative object"), ["dir"],
    bi("Die Hände sind das Akkusativobjekt → das Reflexivpronomen wird Dativ: dir.", "Die Hände is the accusative object → the reflexive pronoun goes dative: dir."), "a2_s06"),

  /* s07 — Komparativ & Superlativ */
  g("g11a", G2.komp, "Das Handy ist ___ als das andere. (teuer)", bi("Komparativ", "comparative"), ["teurer"],
    bi("teuer → teurer: das e vor -r fällt weg.", "teuer → teurer: the e before -r drops."), "a2_s07"),
  g("g11b", G2.komp, "Dieser Laptop ist am ___. (billig — Superlativ)", bi("Superlativ", "superlative"), ["billigsten"],
    bi("am + -sten: am billigsten.", "am + -sten: am billigsten."), "a2_s07"),
  g("g11c", G2.komp, "Ich lese ___ als ich fernsehe. (gern — Komparativ)", bi("Komparativ von gern", "comparative of gern"), ["lieber"],
    bi("gern – lieber – am liebsten.", "gern – lieber – am liebsten."), "a2_s07"),

  /* s08 — ob, wenn, wann, denn */
  g("g12a", G2.frag, "Weißt du, ___ der Laden heute offen ist? (whether)", bi("Konjunktion", "conjunction"), ["ob"],
    bi("Indirekte Ja/Nein-Frage → ob.", "Indirect yes/no question → ob."), "a2_s08"),
  g("g12b", G2.frag, "___ kommst du? — Um acht. (Fragewort)", bi("Fragewort nach der Zeit", "question word for time"), ["wann"],
    bi("Direkte Frage nach der Zeit → wann.", "Direct question about time → wann."), "a2_s08"),
  g("g12c", G2.frag, "Ich bleibe zu Hause, ___ ich bin müde. (Position 0)", bi("Konjunktion, Verb bleibt auf 2", "conjunction, verb stays second"), ["denn"],
    bi("denn: Hauptsatz-Konjunktion, das Verb bleibt auf Position 2.", "denn: main-clause conjunction, the verb stays in second position."), "a2_s08"),

  /* s10 — Adjektivendungen & Genitiv */
  g("g13a", G2.adj, "der ___ Marktplatz (alt)", bi("Adjektivendung nach der", "adjective ending after der"), ["alte"],
    bi("Nominativ nach der/die/das: -e.", "Nominative after der/die/das: -e."), "a2_s10"),
  g("g13b", G2.adj, "ein ___ Park (schön)", bi("Adjektivendung nach ein — <code>der Park</code>", "adjective ending after ein — <code>der Park</code>"), ["schöner"],
    bi("Nach ein zeigt das Adjektiv das Genus: ein schöner Park.", "After ein the adjective shows the gender: ein schöner Park."), "a2_s10"),
  g("g13c", G2.adj, "das Zentrum ___ Stadt (Genitiv)", bi("Genitiv — <code>die Stadt</code>", "genitive — <code>die Stadt</code>"), ["der"],
    bi("Genitiv feminin: der Stadt.", "Feminine genitive: der Stadt."), "a2_s10"),

  /* s11 — Verben mit Präposition, höflich fragen */
  g("g14a", G2.vprep, "Ich interessiere mich ___ Musik.", bi("feste Präposition", "fixed preposition"), ["für"],
    bi("sich interessieren für + Akkusativ.", "sich interessieren für + accusative."), "a2_s11"),
  g("g14b", G2.vprep, "Wir warten ___ den Bus.", bi("feste Präposition", "fixed preposition"), ["auf"],
    bi("warten auf + Akkusativ.", "warten auf + accusative."), "a2_s11"),
  g("g14c", G2.vprep, "___ Sie mir bitte helfen? (können — höflich)", bi("Konjunktiv II", "Konjunktiv II"), ["könnten"],
    bi("Höflich: Könnten Sie …? — Konjunktiv II von können.", "Polite: Könnten Sie …? — Konjunktiv II of können."), "a2_s11"),

  /* s12 — E-Mail schreiben */
  g("g15a", G2.brief, "Vielen Dank ___ deine Nachricht.", bi("Präposition", "preposition"), ["für"],
    bi("danken für / Dank für + Akkusativ.", "danken für / Dank für + accusative."), "a2_s12"),
  g("g15b", G2.brief, "Ich freue mich ___ deinen Besuch.", bi("Präposition — Vorfreude", "preposition — looking forward"), ["auf"],
    bi("sich freuen auf = Vorfreude (Zukunft); sich freuen über = jetzt.", "sich freuen auf = looking forward; sich freuen über = pleased about."), "a2_s12"),
  g("g15c", G2.brief, "___ kann ich nicht kommen. (unfortunately)", bi("Adverb", "adverb"), ["leider"],
    bi("Leider … — das Verb folgt auf Position 2.", "Leider … — the verb follows in second position."), "a2_s12")
];

/** Every A2 sentence: the six tables, tagged, plus the rest of the syllabus. */
export const GRAMMAR: readonly GrammarItem[] = [
  ...TABLE_SENTENCES.map((item) => ({ ...item, section: SECTION_OF_GROUP[item.group.de] })),
  ...MORE
];
