import type { Bilingual, BlankQuestion, GrammarItem, TopicItem, UpcomingTopic, VocabItem } from "../types";

/**
 * The A1 bank: first sentences. sein and haben, the present tense, articles in
 * the nominative and accusative, question words, modal verbs and negation.
 */

const bi = (de: string, en: string): Bilingual => ({ de, en });

const v = (
  id: string,
  kind: VocabItem["kind"],
  word: string,
  key: string,
  en: readonly string[],
  form: readonly string[],
  note: Bilingual
): VocabItem => ({ id, kind, word, key, en, form, note });

const g = (
  id: string,
  group: Bilingual,
  sentence: string,
  hint: Bilingual,
  answers: readonly string[],
  why: Bilingual
): GrammarItem => ({ id, group, sentence, hint, answers, why });

const q = (
  sentence: string,
  hint: Bilingual,
  answers: readonly string[],
  why: Bilingual,
  caseSensitive?: boolean
): BlankQuestion => (caseSensitive ? { sentence, hint, answers, why, caseSensitive } : { sentence, hint, answers, why });

const G = {
  sein: bi("sein & haben", "sein & haben"),
  verbs: bi("Verben im Präsens", "Present-tense verbs"),
  art: bi("Artikel: Nominativ & Akkusativ", "Articles: nominative & accusative"),
  frag: bi("Fragewörter", "Question words"),
  modal: bi("Modalverben", "Modal verbs"),
  neg: bi("Negation: nicht & kein", "Negation: nicht & kein")
} satisfies Record<string, Bilingual>;

export const A1_VOCAB: readonly VocabItem[] = [
  v("a1_v_tisch", "noun", "Tisch", "der", ["table"], ["die Tische", "Tische"],
    bi("Plural nur mit -e: die Tische.", "The plural just adds -e: die Tische.")),
  v("a1_v_tuer", "noun", "Tür", "die", ["door"], ["die Türen", "Türen"],
    bi("Feminin, Plural auf -en.", "Feminine, plural in -en.")),
  v("a1_v_fenster", "noun", "Fenster", "das", ["window"], ["die Fenster", "Fenster"],
    bi("Neutrum auf -er: der Plural bleibt gleich.", "Neuter ending in -er: the plural does not change.")),
  v("a1_v_apfel", "noun", "Apfel", "der", ["apple"], ["die Äpfel", "Äpfel"],
    bi("Plural mit Umlaut, ohne Endung: die Äpfel.", "The plural takes an umlaut and no ending: die Äpfel.")),
  v("a1_v_schwester", "noun", "Schwester", "die", ["sister"], ["die Schwestern", "Schwestern"],
    bi("Plural auf -n.", "Plural in -n.")),
  v("a1_v_haus", "noun", "Haus", "das", ["house"], ["die Häuser", "Häuser"],
    bi("Umlaut + -er: die Häuser.", "Umlaut plus -er: die Häuser.")),
  v("a1_v_stadt", "noun", "Stadt", "die", ["city", "town"], ["die Städte", "Städte"],
    bi("Umlaut + -e: die Städte.", "Umlaut plus -e: die Städte.")),
  v("a1_v_brot", "noun", "Brot", "das", ["bread"], ["die Brote", "Brote"],
    bi("Plural auf -e, kein Umlaut.", "Plural in -e, no umlaut.")),
  v("a1_v_kind", "noun", "Kind", "das", ["child"], ["die Kinder", "Kinder"],
    bi("Plural auf -er.", "Plural in -er.")),
  v("a1_v_essen", "verb", "essen", "haben", ["to eat", "eat"], ["gegessen"],
    bi("Unregelmäßig: gegessen — mit einem extra ge.", "Irregular: gegessen — note the extra ge.")),
  v("a1_v_trinken", "verb", "trinken", "haben", ["to drink", "drink"], ["getrunken"],
    bi("i → u im Partizip: getrunken.", "i → u in the participle: getrunken.")),
  v("a1_v_gehen", "verb", "gehen", "sein", ["to go", "to walk", "go"], ["gegangen"],
    bi("Bewegung → sein. Ich bin gegangen.", "Movement → sein. Ich bin gegangen.")),
  v("a1_v_kommen", "verb", "kommen", "sein", ["to come", "come"], ["gekommen"],
    bi("Bewegung → sein. Er ist gekommen.", "Movement → sein. Er ist gekommen.")),
  v("a1_v_schlafen", "verb", "schlafen", "haben", ["to sleep", "sleep"], ["geschlafen"],
    bi("Kein Zustandswechsel, keine Bewegung → haben.", "No change of state, no movement → haben.")),
  v("a1_v_lesen", "verb", "lesen", "haben", ["to read", "read"], ["gelesen"],
    bi("Partizip ohne ge-… nein: ge-lesen, regelmäßig gebaut.", "Participle: ge-lesen, built the regular way."))
];

export const A1_GRAMMAR: readonly GrammarItem[] = [
  /* ---------------------------------------------------------- sein & haben */
  g("a1_g1a", G.sein, "Ich ___ Student. (sein)", bi("Verb: sein", "verb: sein"), ["bin"],
    bi("ich → bin.", "ich → bin.")),
  g("a1_g1b", G.sein, "Du ___ müde. (sein)", bi("Verb: sein", "verb: sein"), ["bist"],
    bi("du → bist.", "du → bist.")),
  g("a1_g1c", G.sein, "Er ___ zwanzig Jahre alt. (sein)", bi("Verb: sein", "verb: sein"), ["ist"],
    bi("er/sie/es → ist.", "er/sie/es → ist.")),
  g("a1_g1d", G.sein, "Wir ___ ein Auto. (haben)", bi("Verb: haben", "verb: haben"), ["haben"],
    bi("wir → haben, wie der Infinitiv.", "wir → haben, same as the infinitive.")),
  g("a1_g1e", G.sein, "Ihr ___ Hunger. (haben)", bi("Verb: haben", "verb: haben"), ["habt"],
    bi("ihr → habt.", "ihr → habt.")),
  g("a1_g1f", G.sein, "Sie ___ aus Indien. (sein — Plural)", bi("Verb: sein", "verb: sein"), ["sind"],
    bi("sie (Plural) → sind.", "sie (plural) → sind.")),

  /* ---------------------------------------------------------- present tense */
  g("a1_g2a", G.verbs, "Ich ___ Deutsch. (lernen)", bi("Verb: lernen", "verb: lernen"), ["lerne"],
    bi("ich → Stamm + e: lerne.", "ich → stem + e: lerne.")),
  g("a1_g2b", G.verbs, "Du ___ gern Pizza. (essen)", bi("Verb: essen", "verb: essen"), ["isst"],
    bi("essen wechselt e → i bei du und er: du isst.", "essen changes e → i for du and er: du isst.")),
  g("a1_g2c", G.verbs, "Er ___ nach Hause. (fahren)", bi("Verb: fahren", "verb: fahren"), ["fährt"],
    bi("fahren wechselt a → ä bei du und er: er fährt.", "fahren changes a → ä for du and er: er fährt.")),
  g("a1_g2d", G.verbs, "Wir ___ in Nürnberg. (wohnen)", bi("Verb: wohnen", "verb: wohnen"), ["wohnen"],
    bi("wir → Infinitivform: wohnen.", "wir → the infinitive form: wohnen.")),
  g("a1_g2e", G.verbs, "Sie ___ ein Buch. (lesen — she)", bi("Verb: lesen", "verb: lesen"), ["liest"],
    bi("lesen wechselt e → ie: sie liest.", "lesen changes e → ie: sie liest.")),
  g("a1_g2f", G.verbs, "Ihr ___ Fußball. (spielen)", bi("Verb: spielen", "verb: spielen"), ["spielt"],
    bi("ihr → Stamm + t: spielt.", "ihr → stem + t: spielt.")),

  /* --------------------------------------------------------------- articles */
  g("a1_g3a", G.art, "Das ist ___ Tisch.", bi("the table — <code>der Tisch</code>", "the table — <code>der Tisch</code>"), ["der"],
    bi("Nominativ: der Tisch.", "Nominative: der Tisch.")),
  g("a1_g3b", G.art, "Ich habe ___ Bruder.", bi("a brother — <code>der Bruder</code>", "a brother — <code>der Bruder</code>"), ["einen"],
    bi("haben + Akkusativ, maskulin: ein → einen.", "haben + accusative, masculine: ein → einen.")),
  g("a1_g3c", G.art, "Ich trinke ___ Wasser.", bi("a — <code>das Wasser</code>", "a — <code>das Wasser</code>"), ["ein"],
    bi("Akkusativ Neutrum: ein bleibt ein.", "Neuter accusative: ein stays ein.")),
  g("a1_g3d", G.art, "Ich sehe ___ Frau.", bi("the woman — <code>die Frau</code>", "the woman — <code>die Frau</code>"), ["die"],
    bi("Akkusativ feminin: die bleibt die.", "Feminine accusative: die stays die.")),
  g("a1_g3e", G.art, "Er kauft ___ Apfel.", bi("an apple — <code>der Apfel</code>", "an apple — <code>der Apfel</code>"), ["einen"],
    bi("kaufen + Akkusativ, maskulin: einen.", "kaufen + accusative, masculine: einen.")),
  g("a1_g3f", G.art, "___ Kind schläft.", bi("the child — <code>das Kind</code>", "the child — <code>das Kind</code>"), ["das"],
    bi("Nominativ Neutrum: das Kind.", "Neuter nominative: das Kind.")),

  /* --------------------------------------------------------- question words */
  g("a1_g4a", G.frag, "___ heißt du?", bi("fragt nach dem Namen", "asks for a name"), ["wie"],
    bi("Wie heißt du? — der Name.", "Wie heißt du? — the name.")),
  g("a1_g4b", G.frag, "___ wohnst du?", bi("fragt nach dem Ort", "asks for a place"), ["wo"],
    bi("Wo? — der Ort.", "Wo? — the place.")),
  g("a1_g4c", G.frag, "___ kommst du?", bi("fragt nach der Herkunft", "asks where from"), ["woher"],
    bi("Woher? — die Herkunft.", "Woher? — origin.")),
  g("a1_g4d", G.frag, "___ ist das?", bi("fragt nach einer Person", "asks about a person"), ["wer"],
    bi("Wer? — eine Person.", "Wer? — a person.")),
  g("a1_g4e", G.frag, "___ kostet das?", bi("fragt nach dem Preis", "asks for a price"), ["was", "wie viel", "wieviel"],
    bi("Was kostet das? — oder: Wie viel kostet das?", "Was kostet das? — or: Wie viel kostet das?")),
  g("a1_g4f", G.frag, "___ gehst du ins Bett?", bi("fragt nach der Zeit", "asks for a time"), ["wann"],
    bi("Wann? — die Zeit.", "Wann? — time.")),

  /* ------------------------------------------------------------ modal verbs */
  g("a1_g5a", G.modal, "Ich ___ gut schwimmen. (können)", bi("Modalverb", "modal verb"), ["kann"],
    bi("ich kann — ohne Endung, mit a.", "ich kann — no ending, with a.")),
  g("a1_g5b", G.modal, "Du ___ jetzt schlafen. (müssen)", bi("Modalverb", "modal verb"), ["musst"],
    bi("du musst — der Umlaut fällt im Singular weg.", "du musst — the umlaut disappears in the singular.")),
  g("a1_g5c", G.modal, "Er ___ ein Eis. (wollen)", bi("Modalverb", "modal verb"), ["will"],
    bi("er will — kein -t bei Modalverben.", "er will — modal verbs take no -t.")),
  g("a1_g5d", G.modal, "Hier ___ man nicht rauchen. (dürfen)", bi("Modalverb", "modal verb"), ["darf"],
    bi("man darf — Singular ohne Umlaut.", "man darf — singular without the umlaut.")),
  g("a1_g5e", G.modal, "___ ich dir helfen? (können — ich)", bi("Modalverb", "modal verb"), ["kann"],
    bi("Kann ich …? — die Frage beginnt mit dem Verb.", "Kann ich …? — the question starts with the verb.")),
  g("a1_g5f", G.modal, "Sie ___ Deutsch lernen. (möchten — she)", bi("Modalverb", "modal verb"), ["möchte"],
    bi("sie möchte — höflicher als will.", "sie möchte — more polite than will.")),

  /* --------------------------------------------------------------- negation */
  g("a1_g6a", G.neg, "Ich habe ___ Auto.", bi("no — <code>das Auto</code>", "no — <code>das Auto</code>"), ["kein"],
    bi("Nomen mit Artikel → kein. Akkusativ Neutrum: kein.", "A noun with an article → kein. Neuter accusative: kein.")),
  g("a1_g6b", G.neg, "Er kommt heute ___ .", bi("not", "not"), ["nicht"],
    bi("nicht verneint das Verb und steht am Ende.", "nicht negates the verb and goes at the end.")),
  g("a1_g6c", G.neg, "Wir haben ___ Zeit.", bi("no — <code>die Zeit</code>", "no — <code>die Zeit</code>"), ["keine"],
    bi("Feminin: keine.", "Feminine: keine.")),
  g("a1_g6d", G.neg, "Ich habe ___ Hunger.", bi("no — <code>der Hunger</code>", "no — <code>der Hunger</code>"), ["keinen"],
    bi("Akkusativ maskulin: keinen.", "Masculine accusative: keinen.")),
  g("a1_g6e", G.neg, "Das ist ___ gut.", bi("not", "not"), ["nicht"],
    bi("Adjektiv → nicht.", "Adjective → nicht.")),
  g("a1_g6f", G.neg, "Sie hat ___ Geschwister.", bi("no — <code>die Geschwister</code> (Plural)", "no — <code>die Geschwister</code> (plural)"), ["keine"],
    bi("Plural: keine.", "Plural: keine."))
];

export const A1_TOPICS: readonly TopicItem[] = [
  {
    id: "a1_t1",
    name: bi("sein — alle Formen", "sein — every form"),
    seedStage: 0,
    questions: [
      q("Ich ___ müde.", bi("sein", "sein"), ["bin"], bi("ich bin.", "ich bin.")),
      q("Wir ___ Freunde.", bi("sein", "sein"), ["sind"], bi("wir sind.", "wir sind.")),
      q("Du ___ sehr nett.", bi("sein", "sein"), ["bist"], bi("du bist.", "du bist.")),
      q("Ihr ___ schon hier.", bi("sein", "sein"), ["seid"], bi("ihr seid — mit d, nicht t.", "ihr seid — with d, not t."))
    ]
  },
  {
    id: "a1_t2",
    name: bi("haben — alle Formen", "haben — every form"),
    seedStage: 0,
    questions: [
      q("Ich ___ einen Hund.", bi("haben", "haben"), ["habe"], bi("ich habe.", "ich habe.")),
      q("Du ___ heute Zeit.", bi("haben", "haben"), ["hast"], bi("du hast — das b fällt weg.", "du hast — the b drops out.")),
      q("Er ___ kein Geld.", bi("haben", "haben"), ["hat"], bi("er hat — auch ohne b.", "er hat — also without the b.")),
      q("Ihr ___ Glück.", bi("haben", "haben"), ["habt"], bi("ihr habt.", "ihr habt."))
    ]
  },
  {
    id: "a1_t3",
    name: bi("Plural bilden", "Building plurals"),
    seedStage: 0,
    questions: [
      q("ein Buch, zwei ___", bi("das Buch", "das Buch"), ["Bücher"], bi("Umlaut + -er: Bücher.", "Umlaut plus -er: Bücher.")),
      q("ein Kind, drei ___", bi("das Kind", "das Kind"), ["Kinder"], bi("-er, ohne Umlaut.", "-er, no umlaut.")),
      q("eine Frau, zwei ___", bi("die Frau", "die Frau"), ["Frauen"], bi("Feminin meist -en.", "Feminine nouns mostly take -en.")),
      q("ein Auto, viele ___", bi("das Auto", "das Auto"), ["Autos"], bi("Fremdwörter auf -o: -s.", "Loanwords ending in -o take -s."))
    ]
  },
  {
    id: "a1_t4",
    name: bi("Zahlen schreiben", "Writing numbers"),
    seedStage: 0,
    questions: [
      q("13 = ___", bi("Zahl als Wort", "the number as a word"), ["dreizehn"], bi("drei + zehn.", "drei + zehn.")),
      q("20 = ___", bi("Zahl als Wort", "the number as a word"), ["zwanzig"], bi("zwanzig — nicht zweizig.", "zwanzig — not zweizig.")),
      q("32 = ___", bi("Zahl als Wort", "the number as a word"), ["zweiunddreißig"], bi("Einer zuerst: zwei-und-dreißig.", "Units first: zwei-und-dreißig.")),
      q("100 = ___", bi("Zahl als Wort", "the number as a word"), ["hundert", "einhundert"], bi("hundert oder einhundert.", "hundert or einhundert."))
    ]
  },
  {
    id: "a1_t5",
    name: bi("Tage, Monate, Uhrzeit", "Days, months, time"),
    seedStage: 0,
    questions: [
      q("Der Tag nach Montag ist ___ .", bi("Wochentag", "a weekday"), ["Dienstag"], bi("Montag, Dienstag, Mittwoch …", "Montag, Dienstag, Mittwoch …")),
      q("Der Tag vor Sonntag ist ___ .", bi("Wochentag", "a weekday"), ["Samstag", "Sonnabend"], bi("Samstag — im Norden auch Sonnabend.", "Samstag — in the north also Sonnabend.")),
      q("Der erste Monat im Jahr ist ___ .", bi("Monat", "a month"), ["Januar", "Jänner"], bi("Januar (in Österreich: Jänner).", "Januar (in Austria: Jänner).")),
      q("7:30 Uhr = halb ___", bi("Uhrzeit", "the time"), ["acht"], bi("halb acht = die Hälfte der achten Stunde ist vorbei → 7:30.", "halb acht = half of the eighth hour has gone → 7:30."))
    ]
  },
  {
    id: "a1_t6",
    name: bi("Trennbare Verben im Präsens", "Separable verbs in the present"),
    seedStage: 0,
    questions: [
      q("Ich ___ um 7 Uhr auf. (aufstehen)", bi("Verbteil", "the verb part"), ["stehe"], bi("Das Präfix auf- wandert ans Ende.", "The prefix auf- moves to the end.")),
      q("Er ___ die Tür zu. (zumachen)", bi("Verbteil", "the verb part"), ["macht"], bi("zu-machen → macht … zu.", "zu-machen → macht … zu.")),
      q("Wir ___ heute ein. (einkaufen)", bi("Verbteil", "the verb part"), ["kaufen"], bi("ein-kaufen → kaufen … ein.", "ein-kaufen → kaufen … ein.")),
      q("Wann ___ der Zug an? (ankommen)", bi("Verbteil", "the verb part"), ["kommt"], bi("an-kommen → kommt … an.", "an-kommen → kommt … an."))
    ]
  }
];

export const A1_UPCOMING: readonly UpcomingTopic[] = [
  { title: bi("Akkusativ: den und einen", "Accusative: den and einen"),
    blurb: bi("Nur maskulin ändert sich — der Rest bleibt wie im Nominativ.", "Only the masculine changes — everything else stays as in the nominative.") },
  { title: bi("Possessivartikel: mein, dein, sein", "Possessives: mein, dein, sein"),
    blurb: bi("Wem gehört das? Die Endungen folgen ein/eine.", "Whose is it? The endings follow ein/eine.") },
  { title: bi("Perfekt — erste Schritte", "Perfect tense — first steps"),
    blurb: bi("ge- + Stamm + -t: gemacht, gelernt, gespielt.", "ge- + stem + -t: gemacht, gelernt, gespielt.") },
  { title: bi("Dativ mit mit, nach, von, zu", "Dative with mit, nach, von, zu"),
    blurb: bi("Vier Präpositionen, die immer den Dativ nehmen.", "Four prepositions that always take the dative.") },
  { title: bi("Imperativ: Komm! Geh!", "Imperative: Komm! Geh!"),
    blurb: bi("Bitten und Befehle — du, ihr und Sie.", "Requests and commands — du, ihr and Sie.") },
  { title: bi("Verb auf Position 2", "The verb in second position"),
    blurb: bi("Egal was vorne steht: das Verb kommt an zweiter Stelle.", "Whatever comes first, the verb takes second place.") }
];
