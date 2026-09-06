import type { Bilingual, BlankQuestion, GrammarItem, TopicItem, UpcomingTopic, VocabItem } from "../types";

/**
 * The B1 bank: adjective endings, Konjunktiv II, the simple past, relative
 * clauses, the genitive and the conjunctions that shape longer sentences.
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

const q = (sentence: string, hint: Bilingual, answers: readonly string[], why: Bilingual): BlankQuestion => ({
  sentence,
  hint,
  answers,
  why
});

const G = {
  adj: bi("Adjektivendungen", "Adjective endings"),
  konj2: bi("Konjunktiv II", "Konjunktiv II"),
  praet: bi("Präteritum", "Simple past"),
  rel: bi("Relativsätze", "Relative clauses"),
  gen: bi("Genitiv", "Genitive"),
  konj: bi("Konjunktionen", "Conjunctions")
} satisfies Record<string, Bilingual>;

export const B1_VOCAB: readonly VocabItem[] = [
  v("b1_v_erfahrung", "noun", "Erfahrung", "die", ["experience"], ["die Erfahrungen", "Erfahrungen"],
    bi("-ung ist immer feminin, Plural -en.", "-ung is always feminine, plural -en.")),
  v("b1_v_entscheidung", "noun", "Entscheidung", "die", ["decision"], ["die Entscheidungen", "Entscheidungen"],
    bi("Von entscheiden. -ung → die.", "From entscheiden. -ung → die.")),
  v("b1_v_vorschlag", "noun", "Vorschlag", "der", ["suggestion", "proposal"], ["die Vorschläge", "Vorschläge"],
    bi("Umlaut + -e: die Vorschläge.", "Umlaut plus -e: die Vorschläge.")),
  v("b1_v_gespraech", "noun", "Gespräch", "das", ["conversation", "talk"], ["die Gespräche", "Gespräche"],
    bi("Ge- + Stamm → oft Neutrum: das Gespräch.", "Ge- + stem → often neuter: das Gespräch.")),
  v("b1_v_vertrag", "noun", "Vertrag", "der", ["contract"], ["die Verträge", "Verträge"],
    bi("Umlaut + -e: die Verträge.", "Umlaut plus -e: die Verträge.")),
  v("b1_v_gesetz", "noun", "Gesetz", "das", ["law"], ["die Gesetze", "Gesetze"],
    bi("das Gesetz — Plural -e.", "das Gesetz — plural -e.")),
  v("b1_v_meinung", "noun", "Meinung", "die", ["opinion"], ["die Meinungen", "Meinungen"],
    bi("meiner Meinung nach — feste Wendung mit Dativ.", "meiner Meinung nach — a fixed phrase in the dative.")),
  v("b1_v_empfehlen", "verb", "empfehlen", "haben", ["to recommend", "recommend"], ["empfohlen"],
    bi("Untrennbar → kein ge-: empfohlen.", "Inseparable → no ge-: empfohlen.")),
  v("b1_v_verschwinden", "verb", "verschwinden", "sein", ["to disappear", "disappear", "vanish"], ["verschwunden"],
    bi("Zustandswechsel → sein: ist verschwunden.", "Change of state → sein: ist verschwunden.")),
  v("b1_v_entscheiden", "verb", "entscheiden", "haben", ["to decide", "decide"], ["entschieden"],
    bi("ei → ie: entschieden, ohne ge-.", "ei → ie: entschieden, no ge-.")),
  v("b1_v_gelingen", "verb", "gelingen", "sein", ["to succeed", "succeed", "to turn out well"], ["gelungen"],
    bi("Es ist mir gelungen — mit sein und Dativ.", "Es ist mir gelungen — with sein and the dative.")),
  v("b1_v_wachsen", "verb", "wachsen", "sein", ["to grow", "grow"], ["gewachsen"],
    bi("Veränderung → sein: ist gewachsen.", "Change → sein: ist gewachsen."))
];

export const B1_GRAMMAR: readonly GrammarItem[] = [
  /* ------------------------------------------------------ adjective endings */
  g("b1_g1a", G.adj, "Das ist ein ___ Hund. (groß)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["großer"],
    bi("Nominativ maskulin nach ein: -er zeigt das Genus.", "Masculine nominative after ein: -er shows the gender.")),
  g("b1_g1b", G.adj, "Ich sehe den ___ Hund. (groß)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["großen"],
    bi("Akkusativ maskulin nach den: -en.", "Masculine accusative after den: -en.")),
  g("b1_g1c", G.adj, "Sie trägt eine ___ Jacke. (rot)", bi("<code>die Jacke</code>", "<code>die Jacke</code>"), ["rote"],
    bi("Feminin nach eine: -e, im Nominativ und Akkusativ.", "Feminine after eine: -e, in the nominative and accusative.")),
  g("b1_g1d", G.adj, "Wir wohnen in einem ___ Haus. (alt)", bi("<code>das Haus</code>", "<code>das Haus</code>"), ["alten"],
    bi("Dativ: nach einem immer -en.", "Dative: after einem it is always -en.")),
  g("b1_g1e", G.adj, "Der ___ Mann lacht. (alt)", bi("<code>der Mann</code>", "<code>der Mann</code>"), ["alte"],
    bi("Nominativ nach der: -e, der Artikel zeigt schon alles.", "Nominative after der: -e, the article already does the work.")),
  g("b1_g1f", G.adj, "Ich kaufe das ___ Auto. (neu)", bi("<code>das Auto</code>", "<code>das Auto</code>"), ["neue"],
    bi("Neutrum nach das: -e.", "Neuter after das: -e.")),

  /* --------------------------------------------------------- Konjunktiv II */
  g("b1_g2a", G.konj2, "Wenn ich Zeit ___, würde ich reisen. (haben)", bi("Konjunktiv II", "Konjunktiv II"), ["hätte"],
    bi("haben → hätte: Präteritum + Umlaut.", "haben → hätte: simple past plus umlaut.")),
  g("b1_g2b", G.konj2, "Das ___ schön! (sein)", bi("Konjunktiv II", "Konjunktiv II"), ["wäre"],
    bi("sein → wäre.", "sein → wäre.")),
  g("b1_g2c", G.konj2, "___ du mir helfen? (können — höflich)", bi("Konjunktiv II", "Konjunktiv II"), ["könntest"],
    bi("können → könnte; du → könntest.", "können → könnte; du → könntest.")),
  g("b1_g2d", G.konj2, "Ich ___ lieber zu Hause bleiben. (würde-Form)", bi("Konjunktiv II", "Konjunktiv II"), ["würde"],
    bi("würde + Infinitiv ersetzt den Konjunktiv der meisten Verben.", "würde + infinitive replaces the Konjunktiv of most verbs.")),
  g("b1_g2e", G.konj2, "Wenn er reich ___, würde er ein Haus kaufen. (sein)", bi("Konjunktiv II", "Konjunktiv II"), ["wäre"],
    bi("Irreale Bedingung: wenn + wäre.", "Unreal condition: wenn + wäre.")),
  g("b1_g2f", G.konj2, "Wir ___ gern mehr Zeit. (haben)", bi("Konjunktiv II", "Konjunktiv II"), ["hätten"],
    bi("wir → hätten.", "wir → hätten.")),

  /* ------------------------------------------------------------ simple past */
  g("b1_g3a", G.praet, "Gestern ___ ich krank. (sein)", bi("Präteritum", "simple past"), ["war"],
    bi("sein → war.", "sein → war.")),
  g("b1_g3b", G.praet, "Wir ___ keine Zeit. (haben)", bi("Präteritum", "simple past"), ["hatten"],
    bi("haben → hatten.", "haben → hatten.")),
  g("b1_g3c", G.praet, "Er ___ nach Hause. (gehen)", bi("Präteritum", "simple past"), ["ging"],
    bi("gehen → ging, unregelmäßig.", "gehen → ging, irregular.")),
  g("b1_g3d", G.praet, "Sie ___ ein Buch. (lesen — she)", bi("Präteritum", "simple past"), ["las"],
    bi("lesen → las.", "lesen → las.")),
  g("b1_g3e", G.praet, "Ich ___ nicht schlafen. (können)", bi("Präteritum", "simple past"), ["konnte"],
    bi("können → konnte, ohne Umlaut.", "können → konnte, without the umlaut.")),
  g("b1_g3f", G.praet, "Ihr ___ in Berlin. (sein)", bi("Präteritum", "simple past"), ["wart"],
    bi("ihr → wart.", "ihr → wart.")),

  /* ------------------------------------------------------- relative clauses */
  g("b1_g4a", G.rel, "Der Mann, ___ dort steht, ist mein Lehrer.", bi("<code>der Mann</code>", "<code>der Mann</code>"), ["der"],
    bi("Er steht → Subjekt → Nominativ: der.", "He is standing → subject → nominative: der.")),
  g("b1_g4b", G.rel, "Die Frau, ___ ich helfe, ist nett.", bi("<code>die Frau</code>", "<code>die Frau</code>"), ["der"],
    bi("helfen + Dativ: die → der.", "helfen + dative: die → der.")),
  g("b1_g4c", G.rel, "Das Buch, ___ ich lese, ist spannend.", bi("<code>das Buch</code>", "<code>das Buch</code>"), ["das"],
    bi("Ich lese es → Akkusativ Neutrum: das.", "I read it → neuter accusative: das.")),
  g("b1_g4d", G.rel, "Der Freund, ___ ich anrufe, wohnt in Köln.", bi("<code>der Freund</code>", "<code>der Freund</code>"), ["den"],
    bi("anrufen + Akkusativ: der → den.", "anrufen + accusative: der → den.")),
  g("b1_g4e", G.rel, "Die Kinder, ___ hier spielen, sind laut.", bi("<code>die Kinder</code> (Plural)", "<code>die Kinder</code> (plural)"), ["die"],
    bi("Sie spielen → Nominativ Plural: die.", "They are playing → nominative plural: die.")),
  g("b1_g4f", G.rel, "Der Hund, mit ___ er spazieren geht, ist alt.", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["dem"],
    bi("mit + Dativ: dem.", "mit + dative: dem.")),

  /* --------------------------------------------------------------- genitive */
  g("b1_g5a", G.gen, "Das Auto ___ Frau ist neu.", bi("<code>die Frau</code>", "<code>die Frau</code>"), ["der"],
    bi("Genitiv feminin: der Frau.", "Feminine genitive: der Frau.")),
  g("b1_g5b", G.gen, "Die Farbe ___ Autos gefällt mir.", bi("<code>das Auto</code>", "<code>das Auto</code>"), ["des"],
    bi("Genitiv Neutrum: des Autos — mit -s am Nomen.", "Neuter genitive: des Autos — the noun takes -s.")),
  g("b1_g5c", G.gen, "Trotz ___ Regens gehen wir raus.", bi("<code>der Regen</code>", "<code>der Regen</code>"), ["des"],
    bi("trotz + Genitiv: des Regens.", "trotz + genitive: des Regens.")),
  g("b1_g5d", G.gen, "Während ___ Pause esse ich.", bi("<code>die Pause</code>", "<code>die Pause</code>"), ["der"],
    bi("während + Genitiv, feminin: der.", "während + genitive, feminine: der.")),
  g("b1_g5e", G.gen, "Wegen ___ Wetters bleiben wir zu Hause.", bi("<code>das Wetter</code>", "<code>das Wetter</code>"), ["des"],
    bi("wegen + Genitiv: des Wetters.", "wegen + genitive: des Wetters.")),
  g("b1_g5f", G.gen, "Das Haus ___ Eltern ist groß.", bi("<code>die Eltern</code> (Plural)", "<code>die Eltern</code> (plural)"), ["der"],
    bi("Genitiv Plural: der Eltern.", "Genitive plural: der Eltern.")),

  /* ----------------------------------------------------------- conjunctions */
  g("b1_g6a", G.konj, "Ich lerne Deutsch, ___ ich in Deutschland arbeite.", bi("because", "because"), ["weil"],
    bi("weil — Grund, Verb ans Ende.", "weil — reason, verb to the end.")),
  g("b1_g6b", G.konj, "Ich weiß, ___ du recht hast.", bi("that", "that"), ["dass"],
    bi("dass mit ss — die Konjunktion, nicht der Artikel das.", "dass with ss — the conjunction, not the article das.")),
  g("b1_g6c", G.konj, "___ es regnet, gehen wir spazieren.", bi("although", "although"), ["obwohl"],
    bi("obwohl — Gegensatz, Nebensatz zuerst, dann das Verb.", "obwohl — contrast; clause first, then the verb.")),
  g("b1_g6d", G.konj, "Ruf mich an, ___ du ankommst.", bi("when — in the future", "when — in the future"), ["wenn"],
    bi("wenn für Zukunft und Wiederholung; als nur für Einmaliges in der Vergangenheit.", "wenn for the future and repetition; als only for a single past event.")),
  g("b1_g6e", G.konj, "Ich warte, ___ du kommst.", bi("until", "until"), ["bis"],
    bi("bis — Endpunkt.", "bis — end point.")),
  g("b1_g6f", G.konj, "Ich habe gelernt, ___ ich schlafen ging.", bi("before", "before"), ["bevor"],
    bi("bevor — die Reihenfolge.", "bevor — sequence."))
];

export const B1_TOPICS: readonly TopicItem[] = [
  {
    id: "b1_t1",
    name: bi("Konjunktiv II mit würde", "Konjunktiv II with würde"),
    seedStage: 0,
    questions: [
      q("Ich ___ gern nach Japan reisen.", bi("würde-Form", "würde form"), ["würde"], bi("ich würde.", "ich würde.")),
      q("Was ___ du an meiner Stelle tun?", bi("würde-Form", "würde form"), ["würdest"], bi("du würdest.", "du würdest.")),
      q("Wir ___ das nie machen.", bi("würde-Form", "würde form"), ["würden"], bi("wir würden.", "wir würden.")),
      q("Er ___ gern länger schlafen.", bi("würde-Form", "würde form"), ["würde"], bi("er würde.", "er würde."))
    ]
  },
  {
    id: "b1_t2",
    name: bi("Passiv im Präsens", "Present passive"),
    seedStage: 0,
    questions: [
      q("Das Haus ___ gebaut.", bi("werden", "werden"), ["wird"], bi("werden + Partizip II: es wird gebaut.", "werden + past participle: es wird gebaut.")),
      q("Die Briefe ___ geschrieben.", bi("werden", "werden"), ["werden"], bi("Plural: werden.", "Plural: werden.")),
      q("Hier ___ Deutsch gesprochen.", bi("werden", "werden"), ["wird"], bi("Singular: wird.", "Singular: wird.")),
      q("Die Kinder ___ um vier abgeholt.", bi("werden", "werden"), ["werden"], bi("Plural: werden.", "Plural: werden."))
    ]
  },
  {
    id: "b1_t3",
    name: bi("Infinitiv mit zu", "Infinitive with zu"),
    seedStage: 0,
    questions: [
      q("Ich habe keine Lust, heute ___ . (arbeiten)", bi("zu + Infinitiv", "zu + infinitive"), ["zu arbeiten"], bi("zu + Infinitiv am Satzende.", "zu + infinitive at the end.")),
      q("Es ist wichtig, jeden Tag ___ . (lernen)", bi("zu + Infinitiv", "zu + infinitive"), ["zu lernen"], bi("zu lernen.", "zu lernen.")),
      q("Er versucht, früh ___ . (aufstehen)", bi("zu + Infinitiv", "zu + infinitive"), ["aufzustehen"], bi("Trennbar: zu wandert in die Mitte — aufzustehen.", "Separable: zu goes in the middle — aufzustehen.")),
      q("Wir haben vor, nach Berlin ___ . (fahren)", bi("zu + Infinitiv", "zu + infinitive"), ["zu fahren"], bi("vorhaben + zu + Infinitiv.", "vorhaben + zu + infinitive."))
    ]
  },
  {
    id: "b1_t4",
    name: bi("Reflexive Verben mit Präposition", "Reflexive verbs with a preposition"),
    seedStage: 0,
    questions: [
      q("Ich freue mich ___ das Wochenende.", bi("Präposition", "preposition"), ["auf"], bi("sich freuen auf — etwas Zukünftiges.", "sich freuen auf — something in the future.")),
      q("Er interessiert sich ___ Musik.", bi("Präposition", "preposition"), ["für"], bi("sich interessieren für.", "sich interessieren für.")),
      q("Wir erinnern uns ___ den Urlaub.", bi("Präposition", "preposition"), ["an"], bi("sich erinnern an + Akkusativ.", "sich erinnern an + accusative.")),
      q("Sie ärgert sich ___ den Lärm.", bi("Präposition", "preposition"), ["über"], bi("sich ärgern über + Akkusativ.", "sich ärgern über + accusative."))
    ]
  },
  {
    id: "b1_t5",
    name: bi("Temporale Präpositionen", "Time prepositions"),
    seedStage: 0,
    questions: [
      q("Ich wohne ___ drei Jahren hier.", bi("seit / vor / in / nach", "seit / vor / in / nach"), ["seit"], bi("seit: es dauert noch an.", "seit: it is still going on.")),
      q("___ zwei Wochen fahre ich nach Rom.", bi("seit / vor / in / nach", "seit / vor / in / nach"), ["in"], bi("in + Zeit: Zukunft.", "in + time: the future.")),
      q("___ dem Essen gehen wir spazieren.", bi("seit / vor / in / nach", "seit / vor / in / nach"), ["nach"], bi("nach + Dativ: danach.", "nach + dative: afterwards.")),
      q("___ einem Jahr war ich in Paris.", bi("seit / vor / in / nach", "seit / vor / in / nach"), ["vor"], bi("vor + Zeit: abgeschlossen, „ago“.", "vor + time: finished, \"ago\"."))
    ]
  },
  {
    id: "b1_t6",
    name: bi("legen/liegen, stellen/stehen", "legen/liegen, stellen/stehen"),
    seedStage: 0,
    questions: [
      q("Ich ___ das Buch auf den Tisch. (legen/liegen)", bi("Verb", "verb"), ["lege"], bi("Bewegung (wohin?) → legen + Akkusativ.", "Movement (wohin?) → legen + accusative.")),
      q("Das Buch ___ auf dem Tisch. (legen/liegen)", bi("Verb", "verb"), ["liegt"], bi("Ort (wo?) → liegen + Dativ.", "Location (wo?) → liegen + dative.")),
      q("Er ___ die Vase auf den Schrank. (stellen/stehen)", bi("Verb", "verb"), ["stellt"], bi("wohin? → stellen.", "wohin? → stellen.")),
      q("Die Vase ___ auf dem Schrank. (stellen/stehen)", bi("Verb", "verb"), ["steht"], bi("wo? → stehen.", "wo? → stehen."))
    ]
  }
];

export const B1_UPCOMING: readonly UpcomingTopic[] = [
  { title: bi("Passiv im Perfekt und Präteritum", "Passive in the perfect and simple past"),
    blurb: bi("wurde gebaut, ist gebaut worden — das Passiv in der Vergangenheit.", "wurde gebaut, ist gebaut worden — the passive in the past.") },
  { title: bi("Plusquamperfekt", "Past perfect"),
    blurb: bi("hatte gemacht, war gegangen — was davor passiert ist.", "hatte gemacht, war gegangen — what had happened before.") },
  { title: bi("Indirekte Fragen", "Indirect questions"),
    blurb: bi("Weißt du, ob …? Ich frage mich, warum … — Verb ans Ende.", "Weißt du, ob …? Ich frage mich, warum … — verb to the end.") },
  { title: bi("Zweiteilige Konnektoren", "Two-part connectors"),
    blurb: bi("entweder … oder, sowohl … als auch, weder … noch.", "entweder … oder, sowohl … als auch, weder … noch.") },
  { title: bi("n-Deklination", "Weak nouns"),
    blurb: bi("der Junge → den Jungen, der Student → dem Studenten.", "der Junge → den Jungen, der Student → dem Studenten.") },
  { title: bi("Futur I", "Future tense"),
    blurb: bi("werden + Infinitiv — Pläne, Versprechen, Vermutungen.", "werden + infinitive — plans, promises, guesses.") }
];
