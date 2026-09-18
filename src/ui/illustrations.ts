import { getLang } from "../i18n";
import type { Bilingual } from "../types";
import { esc, h } from "./dom";

/**
 * The diagrams behind the syllabus.
 *
 * Almost none of these are pictures. German grammar is mostly *positions* —
 * where the verb goes, which slot changes, what the bracket holds — and a
 * position is best shown as exactly that: a row of slots with the important
 * ones lit up. So the library is five small renderers (a sentence frame, a
 * paradigm grid, a two- or three-way contrast, a timeline and a clock) and a
 * table of specs that feed them. Each spec is a few lines; adding a diagram
 * is adding data, not drawing.
 *
 * They are built from HTML where text has to fit — German words are long and
 * phones are narrow, and a browser wraps text better than any SVG measurement
 * would — and from SVG only where geometry matters. Everything takes its
 * colours from the theme tokens, so dark mode needs nothing extra.
 */

interface Frame {
  readonly kind: "frame";
  readonly slots: readonly string[];
  /** Indices of the slots that carry the point. */
  readonly mark: readonly number[];
  /** Small labels under particular slots. */
  readonly tags?: Readonly<Record<number, string>>;
  readonly note: Bilingual;
}

interface Grid {
  readonly kind: "grid";
  readonly cols: readonly string[];
  readonly rows: readonly string[];
  readonly cells: readonly (readonly string[])[];
  /** [row, col] pairs to light up — the cells that change, usually. */
  readonly mark?: readonly (readonly [number, number])[];
  readonly note: Bilingual;
}

interface Contrast {
  readonly kind: "contrast";
  readonly columns: readonly {
    readonly head: string;
    readonly tone: "a" | "b" | "c";
    readonly lines: readonly string[];
  }[];
  readonly note: Bilingual;
}

interface Timeline {
  readonly kind: "timeline";
  readonly points: readonly {
    /** 0–100 along the line. */
    readonly at: number;
    readonly label: string;
    readonly example: string;
    readonly now?: boolean;
  }[];
  readonly note: Bilingual;
}

interface Clock {
  readonly kind: "clock";
  readonly note: Bilingual;
}

type Spec = Frame | Grid | Contrast | Timeline | Clock;

const bi = (de: string, en: string): Bilingual => ({ de, en });

/* --------------------------------------------------------------- specs */

const CASE_ROWS = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];
const GENDER_COLS = ["maskulin", "feminin", "neutrum", "Plural"];

const SPECS: Readonly<Record<string, Spec>> = {
  /* ------------------------------------------------- word order frames */
  v2: {
    kind: "frame",
    slots: ["Heute", "gehe", "ich", "ins Kino."],
    mark: [1],
    tags: { 0: "Position 1", 1: "Verb: Position 2" },
    note: bi("Egal, was vorne steht — das Verb bleibt auf Position 2. Was sonst vorne stand, rückt hinter das Verb.", "Whatever comes first, the verb stays in second position. What used to be first moves behind the verb.")
  },
  "ja-nein": {
    kind: "frame",
    slots: ["Spielst", "du", "Fußball?"],
    mark: [0],
    tags: { 0: "Verb zuerst" },
    note: bi("Eine Ja/Nein-Frage beginnt mit dem Verb. Kein Fragewort, keine Umstellung sonst.", "A yes/no question starts with the verb. No question word, nothing else moves.")
  },
  "modal-frame": {
    kind: "frame",
    slots: ["Ich", "möchte", "einen Kaffee", "trinken."],
    mark: [1, 3],
    tags: { 1: "Modalverb", 3: "Infinitiv" },
    note: bi("Die Satzklammer: das Modalverb auf Position 2, der Infinitiv ganz am Ende. Alles andere steht dazwischen.", "The sentence bracket: modal verb in second position, the infinitive right at the end. Everything else sits between them.")
  },
  separable: {
    kind: "frame",
    slots: ["Ich", "stehe", "um sieben Uhr", "auf."],
    mark: [1, 3],
    tags: { 1: "Stamm", 3: "Vorsilbe" },
    note: bi("Ein trennbares Verb fällt auseinander: der Stamm auf Position 2, die Vorsilbe ans Ende. Im Perfekt wandert ge- dazwischen: aufgestanden.", "A separable verb splits: stem in second position, prefix at the end. In the perfect, ge- goes between them: aufgestanden.")
  },
  "perfekt-frame": {
    kind: "frame",
    slots: ["Ich", "habe", "gestern Pizza", "gegessen."],
    mark: [1, 3],
    tags: { 1: "haben / sein", 3: "Partizip II" },
    note: bi("haben oder sein auf Position 2, das Partizip II ganz am Ende. sein bei Bewegung und Zustandswechsel: Ich bin gefahren, aufgewacht, geblieben.", "haben or sein in second position, the participle right at the end. sein for movement and change of state: Ich bin gefahren, aufgewacht, geblieben.")
  },
  nebensatz: {
    kind: "frame",
    slots: ["Ich bleibe zu Hause,", "weil", "ich krank", "bin."],
    mark: [1, 3],
    tags: { 1: "Konjunktion", 3: "Verb am Ende" },
    note: bi("Nach weil, dass, wenn, ob, obwohl, als … geht das konjugierte Verb ans Ende des Nebensatzes.", "After weil, dass, wenn, ob, obwohl, als … the conjugated verb goes to the end of the clause.")
  },
  passiv: {
    kind: "frame",
    slots: ["Das Rezept", "wird", "vom Arzt", "ausgestellt."],
    mark: [1, 3],
    tags: { 1: "werden", 3: "Partizip II" },
    note: bi("Passiv = werden + Partizip II. Wer es tut, kommt mit von (Person) oder durch (Mittel) — oder gar nicht.", "Passive = werden + past participle. The doer comes with von (a person) or durch (a means) — or not at all.")
  },
  "infinitiv-zu": {
    kind: "frame",
    slots: ["Ich habe vor,", "nächstes Jahr", "einen Kurs", "zu machen."],
    mark: [3],
    tags: { 3: "zu + Infinitiv" },
    note: bi("Nach vorhaben, anfangen, versuchen, vergessen, Lust haben, es ist wichtig … kommt zu + Infinitiv ans Ende. Bei trennbaren Verben in die Mitte: anzurufen.", "After vorhaben, anfangen, versuchen, vergessen, Lust haben, es ist wichtig … comes zu + infinitive at the end. With separable verbs it goes inside: anzurufen.")
  },
  konjunktiv1: {
    kind: "frame",
    slots: ["Er sagte,", "er", "habe", "keine Zeit."],
    mark: [2],
    tags: { 2: "Konjunktiv I" },
    note: bi("Indirekte Rede: Infinitivstamm + -e. er habe · er sei · er könne · er wisse. Sieht die Form aus wie Indikativ (sie haben), nimm Konjunktiv II: sie hätten.", "Reported speech: infinitive stem + -e. er habe · er sei · er könne · er wisse. If the form looks like the indicative (sie haben), use Konjunktiv II: sie hätten.")
  },
  futur: {
    kind: "frame",
    slots: ["Ich", "werde", "nächstes Jahr", "reisen."],
    mark: [1, 3],
    tags: { 1: "werden", 3: "Infinitiv" },
    note: bi("Futur I = werden + Infinitiv: Plan oder Vermutung. Futur II = werden + Partizip II + haben/sein: Er wird den Zug verpasst haben.", "Futur I = werden + infinitive: a plan or a guess. Futur II = werden + participle + haben/sein: Er wird den Zug verpasst haben.")
  },
  "konjunktiv2-past": {
    kind: "frame",
    slots: ["Ich", "hätte", "früher", "kommen sollen."],
    mark: [1, 3],
    tags: { 1: "hätte / wäre", 3: "Partizip / Ersatzinfinitiv" },
    note: bi("Vergangenheit im Konjunktiv II: hätte/wäre + Partizip II. Mit Modalverb steht der doppelte Infinitiv am Ende: hätte kommen sollen.", "Past Konjunktiv II: hätte/wäre + past participle. With a modal verb, the double infinitive goes last: hätte kommen sollen.")
  },
  tekamolo: {
    kind: "frame",
    slots: ["Ich fahre", "morgen", "wegen des Wetters", "mit dem Zug", "nach Berlin."],
    mark: [1, 2, 3, 4],
    tags: { 1: "Te — wann?", 2: "Ka — warum?", 3: "Mo — wie?", 4: "Lo — wohin?" },
    note: bi("Die Reihenfolge im Mittelfeld: temporal, kausal, modal, lokal. Das Lokale steht meist ganz am Ende, direkt vor dem zweiten Verbteil.", "Order in the middle field: time, cause, manner, place. Place usually comes last, right before the second verb part.")
  },
  fvg: {
    kind: "frame",
    slots: ["Der Chef", "stellt", "uns ein Auto", "zur Verfügung."],
    mark: [1, 3],
    tags: { 1: "Funktionsverb", 3: "Nomen + Präposition" },
    note: bi("Funktionsverbgefüge: das Verb trägt fast keine Bedeutung, das Nomen alles. Die beiden bilden eine Klammer wie ein trennbares Verb.", "Light-verb constructions: the verb carries almost no meaning, the noun carries it all. Together they form a bracket like a separable verb.")
  },
  "als-ob": {
    kind: "frame",
    slots: ["Er tut so,", "als ob", "er alles", "wüsste."],
    mark: [1, 3],
    tags: { 1: "als ob", 3: "Konjunktiv II am Ende" },
    note: bi("Irrealer Vergleich: als ob + Konjunktiv II, Verb am Ende. Ohne ob rückt das Verb nach vorn: als wüsste er alles.", "Unreal comparison: als ob + Konjunktiv II, verb at the end. Without ob the verb moves forward: als wüsste er alles.")
  },
  "partizip-attribut": {
    kind: "frame",
    slots: ["die", "seit Jahren", "steigenden", "Temperaturen"],
    mark: [1, 2],
    tags: { 1: "Erweiterung", 2: "Partizip I" },
    note: bi("Alles zwischen Artikel und Nomen ist ein zusammengefalteter Relativsatz: die Temperaturen, die seit Jahren steigen. Partizip I = aktiv/gleichzeitig, Partizip II = passiv/abgeschlossen.", "Everything between article and noun is a folded-up relative clause: the temperatures that have been rising for years. Participle I = active/simultaneous, participle II = passive/completed.")
  },

  /* ------------------------------------------------------- paradigm grids */
  cases: {
    kind: "grid",
    cols: GENDER_COLS,
    rows: CASE_ROWS,
    cells: [
      ["der", "die", "das", "die"],
      ["den", "die", "das", "die"],
      ["dem", "der", "dem", "den"],
      ["des", "der", "des", "der"]
    ],
    mark: [[1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]],
    note: bi("Im Akkusativ ändert sich nur maskulin. Im Dativ ändert sich alles — und der Plural bekommt -n am Nomen: den Kindern.", "In the accusative only the masculine changes. In the dative everything changes — and the plural noun gets -n: den Kindern.")
  },
  akkusativ: {
    kind: "grid",
    cols: GENDER_COLS,
    rows: ["Nominativ", "Akkusativ"],
    cells: [
      ["der / ein", "die / eine", "das / ein", "die / —"],
      ["den / einen", "die / eine", "das / ein", "die / —"]
    ],
    mark: [[1, 0]],
    note: bi("Nur maskulin ändert sich: der → den, ein → einen. Feminin, neutrum und Plural bleiben wie im Nominativ.", "Only the masculine changes: der → den, ein → einen. Feminine, neuter and plural stay as in the nominative.")
  },
  genus: {
    kind: "grid",
    cols: ["der", "die", "das"],
    rows: ["typische Endungen", "Beispiele"],
    cells: [
      ["-er, -ling, -ismus", "-e, -ung, -heit, -keit, -schaft, -ion", "-chen, -lein, -um, -ment"],
      ["der Lehrer, der Frühling", "die Lampe, die Zeitung", "das Mädchen, das Zentrum"]
    ],
    note: bi("Kein Genus ist zufällig genug, um es nicht mitzulernen — aber die Endungen verraten oft genug, was es ist.", "No gender is random enough not to learn with the word — but the endings give it away often enough to help.")
  },
  plural: {
    kind: "grid",
    cols: ["-e", "-(e)n", "-er", "-s", "—"],
    rows: ["Beispiel", "typisch für"],
    cells: [
      ["die Tische, die Städte", "die Lampen, die Frauen", "die Kinder, die Häuser", "die Autos, die Handys", "die Fenster, die Lehrer"],
      ["maskulin, einsilbig", "feminin (fast alle)", "neutrum, oft mit Umlaut", "Fremdwörter", "-er, -el, -en, -chen"]
    ],
    note: bi("Fünf Endungen, und der Umlaut kommt oft dazu. Feminin auf -e nimmt fast immer -n.", "Five endings, and the umlaut often joins in. Feminine nouns in -e almost always take -n.")
  },
  "verb-grid": {
    kind: "grid",
    cols: ["sein", "haben", "wohnen"],
    rows: ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"],
    cells: [
      ["bin", "habe", "wohne"],
      ["bist", "hast", "wohnst"],
      ["ist", "hat", "wohnt"],
      ["sind", "haben", "wohnen"],
      ["seid", "habt", "wohnt"],
      ["sind", "haben", "wohnen"]
    ],
    mark: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [1, 1], [2, 1]],
    note: bi("sein ist völlig unregelmäßig — auswendig lernen. haben verliert im du und er das b. Regelmäßige Verben: -e, -st, -t, -en, -t, -en.", "sein is entirely irregular — learn it by heart. haben loses its b in du and er. Regular verbs: -e, -st, -t, -en, -t, -en.")
  },
  "vowel-change": {
    kind: "grid",
    cols: ["fahren", "schlafen", "essen", "lesen", "nehmen"],
    rows: ["ich", "du", "er / sie / es", "wir"],
    cells: [
      ["fahre", "schlafe", "esse", "lese", "nehme"],
      ["fährst", "schläfst", "isst", "liest", "nimmst"],
      ["fährt", "schläft", "isst", "liest", "nimmt"],
      ["fahren", "schlafen", "essen", "lesen", "nehmen"]
    ],
    mark: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
    note: bi("Der Vokal wechselt nur bei du und er/sie/es: a → ä, e → i / ie. Alle anderen Formen sind regelmäßig.", "The vowel changes only in du and er/sie/es: a → ä, e → i / ie. Every other form is regular.")
  },
  imperativ: {
    kind: "grid",
    cols: ["gehen", "nehmen", "sein", "aufstehen"],
    rows: ["du", "ihr", "Sie"],
    cells: [
      ["Geh!", "Nimm!", "Sei ruhig!", "Steh auf!"],
      ["Geht!", "Nehmt!", "Seid ruhig!", "Steht auf!"],
      ["Gehen Sie!", "Nehmen Sie!", "Seien Sie ruhig!", "Stehen Sie auf!"]
    ],
    mark: [[0, 1], [0, 2], [2, 2]],
    note: bi("du: Verbstamm ohne -st, ohne du. ihr: wie das Präsens, ohne ihr. Sie: Infinitiv + Sie. Der Vokalwechsel e → i bleibt (Nimm!), a → ä fällt weg (Fahr!).", "du: the stem without -st, no pronoun. ihr: like the present, no pronoun. Sie: infinitive + Sie. The e → i change stays (Nimm!), a → ä is dropped (Fahr!).")
  },
  possessive: {
    kind: "grid",
    cols: ["maskulin", "feminin", "neutrum", "Plural"],
    rows: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
    cells: [
      ["mein Bruder", "meine Schwester", "mein Kind", "meine Eltern"],
      ["meinen Bruder", "meine Schwester", "mein Kind", "meine Eltern"],
      ["meinem Bruder", "meiner Schwester", "meinem Kind", "meinen Eltern"],
      ["meines Bruders", "meiner Schwester", "meines Kindes", "meiner Eltern"]
    ],
    mark: [[1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]],
    note: bi("mein, dein, sein, ihr, unser, euer, ihr, Ihr — alle nehmen genau die Endungen von ein/kein. Wer ein kann, kann sie alle.", "mein, dein, sein, ihr, unser, euer, ihr, Ihr — all take exactly the endings of ein/kein. Master ein and you have them all.")
  },
  pronouns: {
    kind: "grid",
    cols: ["ich", "du", "er", "sie", "es", "wir", "ihr", "sie / Sie"],
    rows: ["Nominativ", "Akkusativ", "Dativ"],
    cells: [
      ["ich", "du", "er", "sie", "es", "wir", "ihr", "sie / Sie"],
      ["mich", "dich", "ihn", "sie", "es", "uns", "euch", "sie / Sie"],
      ["mir", "dir", "ihm", "ihr", "ihm", "uns", "euch", "ihnen / Ihnen"]
    ],
    mark: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 7]],
    note: bi("Dativ für die Person, der etwas gegeben, gesagt, geholfen wird: Ich helfe dir. Das gefällt mir. Mir tut der Kopf weh.", "Dative for the person something is given, said or done to: Ich helfe dir. Das gefällt mir. Mir tut der Kopf weh.")
  },
  reflexiv: {
    kind: "grid",
    cols: ["Akkusativ", "Dativ"],
    rows: ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"],
    cells: [
      ["mich", "mir"],
      ["dich", "dir"],
      ["sich", "sich"],
      ["uns", "uns"],
      ["euch", "euch"],
      ["sich", "sich"]
    ],
    mark: [[0, 1], [1, 1]],
    note: bi("Nur ich und du unterscheiden Akkusativ und Dativ. Dativ, wenn noch ein Akkusativobjekt da ist: Ich wasche mich. — Ich wasche mir die Hände.", "Only ich and du distinguish accusative from dative. Dative when there is also an accusative object: Ich wasche mich. — Ich wasche mir die Hände.")
  },
  "adjective-endings": {
    kind: "grid",
    cols: GENDER_COLS,
    rows: CASE_ROWS,
    cells: [
      ["der alte Mann", "die alte Frau", "das alte Haus", "die alten Leute"],
      ["den alten Mann", "die alte Frau", "das alte Haus", "die alten Leute"],
      ["dem alten Mann", "der alten Frau", "dem alten Haus", "den alten Leuten"],
      ["des alten Mannes", "der alten Frau", "des alten Hauses", "der alten Leute"]
    ],
    mark: [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2]],
    note: bi("Nach der/die/das: fünf Felder mit -e (die markierten), alle anderen -en. Nach ein/kein/mein zeigt das Adjektiv im Nominativ das Genus selbst: ein alter Mann, ein altes Haus.", "After der/die/das: five cells take -e (the marked ones), every other cell -en. After ein/kein/mein the adjective shows the gender itself in the nominative: ein alter Mann, ein altes Haus.")
  },
  relativ: {
    kind: "grid",
    cols: GENDER_COLS,
    rows: CASE_ROWS,
    cells: [
      ["der", "die", "das", "die"],
      ["den", "die", "das", "die"],
      ["dem", "der", "dem", "denen"],
      ["dessen", "deren", "dessen", "deren"]
    ],
    mark: [[2, 3], [3, 0], [3, 1], [3, 2], [3, 3]],
    note: bi("Fast wie der bestimmte Artikel — nur denen im Dativ Plural und dessen/deren im Genitiv sind neu. Der Fall kommt vom Verb im Relativsatz, das Genus vom Nomen davor.", "Almost the definite article — only denen (dative plural) and dessen/deren (genitive) are new. The case comes from the verb inside the clause, the gender from the noun before it.")
  },
  konjunktiv2: {
    kind: "grid",
    cols: ["sein", "haben", "werden", "können", "müssen"],
    rows: ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"],
    cells: [
      ["wäre", "hätte", "würde", "könnte", "müsste"],
      ["wärst", "hättest", "würdest", "könntest", "müsstest"],
      ["wäre", "hätte", "würde", "könnte", "müsste"],
      ["wären", "hätten", "würden", "könnten", "müssten"],
      ["wärt", "hättet", "würdet", "könntet", "müsstet"],
      ["wären", "hätten", "würden", "könnten", "müssten"]
    ],
    note: bi("Präteritum + Umlaut + Konjunktivendung. Diese fünf lernt man als Formen; alle anderen Verben nehmen würde + Infinitiv: Ich würde kommen.", "Simple past + umlaut + subjunctive ending. These five are learnt as forms; every other verb uses würde + infinitive: Ich würde kommen.")
  },
  genitiv: {
    kind: "grid",
    cols: GENDER_COLS,
    rows: ["bestimmt", "unbestimmt", "Präpositionen"],
    cells: [
      ["des Mannes", "der Frau", "des Kindes", "der Kinder"],
      ["eines Mannes", "einer Frau", "eines Kindes", "— Kinder"],
      ["wegen · trotz · während · (an)statt · innerhalb · außerhalb · aufgrund · infolge", "", "", ""]
    ],
    mark: [[0, 0], [0, 2], [1, 0], [1, 2]],
    note: bi("Maskulin und neutrum bekommen -(e)s am Nomen: des Mannes, des Kindes. Feminin und Plural: nur der Artikel ändert sich.", "Masculine and neuter nouns get -(e)s: des Mannes, des Kindes. Feminine and plural: only the article changes.")
  },
  "temporal-uai": {
    kind: "grid",
    cols: ["um", "am", "im", "ohne Präposition"],
    rows: ["wann?", "Beispiel"],
    cells: [
      ["Uhrzeit", "Tag, Tageszeit, Datum", "Monat, Jahreszeit, Jahr (im Jahr …)", "Jahreszahl allein"],
      ["um 8 Uhr, um halb drei", "am Montag, am Abend, am 3. Mai", "im Mai, im Winter, im Jahr 2026", "2026"]
    ],
    note: bi("Drei Präpositionen, nach der Größe der Zeit sortiert: um für den Punkt, am für den Tag, im für alles Längere.", "Three prepositions sorted by the size of the time: um for a point, am for a day, im for anything longer.")
  },
  zweiteilig: {
    kind: "grid",
    cols: ["Konnektor", "Bedeutung", "Beispiel"],
    rows: ["1", "2", "3", "4", "5", "6"],
    cells: [
      ["nicht nur … sondern auch", "beides, betont", "Er ist nicht nur klug, sondern auch fleißig."],
      ["sowohl … als auch", "beides", "Sie spricht sowohl Deutsch als auch Englisch."],
      ["weder … noch", "keins von beiden", "Ich habe weder Zeit noch Lust."],
      ["entweder … oder", "eins von beiden", "Entweder wir fahren, oder wir bleiben."],
      ["zwar … aber", "Einschränkung", "Es ist zwar teuer, aber gut."],
      ["je … desto / umso", "Proportion", "Je mehr ich übe, desto besser wird es."]
    ],
    note: bi("Zwei Teile, ein Gedanke. Nach je steht das Verb am Ende, nach desto folgt es sofort: Je mehr ich übe, desto besser wird es.", "Two parts, one thought. After je the verb goes to the end; after desto it follows at once: Je mehr ich übe, desto besser wird es.")
  },
  wortbildung: {
    kind: "grid",
    cols: ["Endung / Vorsilbe", "Genus", "Beispiele"],
    rows: ["1", "2", "3", "4", "5", "6"],
    cells: [
      ["-ung", "die", "die Wohnung, die Erfahrung, die Meinung"],
      ["-heit / -keit", "die", "die Freiheit, die Zufriedenheit, die Möglichkeit"],
      ["-schaft", "die", "die Freundschaft, die Wissenschaft"],
      ["-er / -ler", "der", "der Lehrer, der Sportler"],
      ["-chen / -lein", "das", "das Mädchen, das Büchlein"],
      ["ver- / be- / ent- / zer- / er-", "—", "verstehen, bestehen, entstehen, zerbrechen, erkennen — untrennbar, kein ge-"]
    ],
    note: bi("Die Endung verrät das Genus zuverlässiger als jede Regel. Und jede untrennbare Vorsilbe heißt: Partizip ohne ge-.", "The ending gives away the gender more reliably than any rule. And every inseparable prefix means: participle without ge-.")
  },
  modalpartikeln: {
    kind: "grid",
    cols: ["Partikel", "Wirkung", "Beispiel"],
    rows: ["1", "2", "3", "4", "5", "6"],
    cells: [
      ["doch", "Widerspruch, Nachdruck, Erinnerung", "Komm doch mit! Das weißt du doch."],
      ["ja", "bekannt, selbstverständlich", "Das ist ja klar. Du bist ja schon da!"],
      ["mal", "beiläufig, freundlich", "Schau mal! Kannst du mal helfen?"],
      ["eben / halt", "resigniert, so ist es", "Das ist eben so. Dann bleiben wir halt hier."],
      ["denn", "Interesse in der Frage", "Was machst du denn hier?"],
      ["eigentlich", "beiläufige Frage, Einschränkung", "Wo wohnst du eigentlich? Eigentlich wollte ich gehen."]
    ],
    note: bi("Sie ändern nicht, was gesagt wird, sondern wie. Weglassen ist immer korrekt — aber klingt wie ein Lehrbuch.", "They change not what is said but how. Leaving them out is always correct — it just sounds like a textbook.")
  },

  /* ---------------------------------------------------------- contrasts */
  wechsel: {
    kind: "contrast",
    columns: [
      { head: "Wo? → Dativ", tone: "a", lines: ["Das Buch liegt auf dem Tisch.", "Er sitzt in der Küche.", "Das Bild hängt an der Wand.", "kein Ortswechsel"] },
      { head: "Wohin? → Akkusativ", tone: "b", lines: ["Ich lege das Buch auf den Tisch.", "Er geht in die Küche.", "Ich hänge das Bild an die Wand.", "Bewegung zum Ziel"] }
    ],
    note: bi("an · auf · hinter · in · neben · über · unter · vor · zwischen. Dieselbe Präposition, zwei Fälle — die Frage entscheidet.", "an · auf · hinter · in · neben · über · unter · vor · zwischen. The same preposition, two cases — the question decides.")
  },
  negation: {
    kind: "contrast",
    columns: [
      { head: "nicht", tone: "a", lines: ["verneint Verb, Adjektiv, Adverb", "Ich komme nicht.", "Das ist nicht gut.", "Das ist nicht mein Auto. (mein, der, das)"] },
      { head: "kein", tone: "b", lines: ["verneint ein Nomen mit ein / ohne Artikel", "Ich habe kein Auto. (ein Auto)", "Ich habe keine Zeit. (Zeit)", "Endungen wie ein: keinen, keinem, keiner"] }
    ],
    note: bi("Steht vor dem Nomen ein oder gar nichts → kein. Steht der, das, mein oder ist es kein Nomen → nicht.", "If the noun has ein or no article → kein. If it has der, das, mein, or it is not a noun at all → nicht.")
  },
  komparativ: {
    kind: "contrast",
    columns: [
      { head: "Positiv", tone: "a", lines: ["schnell", "groß", "gut", "gern", "viel"] },
      { head: "Komparativ (-er)", tone: "b", lines: ["schneller", "größer", "besser", "lieber", "mehr"] },
      { head: "Superlativ (am -sten)", tone: "c", lines: ["am schnellsten", "am größten", "am besten", "am liebsten", "am meisten"] }
    ],
    note: bi("Einsilbige mit a, o, u bekommen meist den Umlaut: größer, älter, jünger. Vergleich: schneller als, so schnell wie.", "One-syllable adjectives with a, o, u usually take the umlaut: größer, älter, jünger. Compare with: schneller als, so schnell wie.")
  },
  "dativ-preps": {
    kind: "contrast",
    columns: [
      { head: "immer Dativ", tone: "a", lines: ["aus · bei · mit · nach · seit · von · zu · gegenüber", "mit dem Bus · nach der Arbeit · bei meiner Oma", "Merkhilfe: Von Au Mit Nach Bei Seit Zu Gegenüber"] },
      { head: "immer Akkusativ", tone: "b", lines: ["durch · ohne · gegen · um · für · bis · entlang", "durch den Park · ohne einen Plan · für dich", "Merkhilfe: DOG UM + für"] }
    ],
    note: bi("Diese Präpositionen fragen nicht — sie nehmen immer denselben Fall. Nur die Wechselpräpositionen (an, auf, in …) fragen Wo? oder Wohin?", "These prepositions never ask — they always take the same case. Only the two-way prepositions (an, auf, in …) ask Wo? or Wohin?")
  },
  "verben-fall": {
    kind: "contrast",
    columns: [
      { head: "Verben mit Dativ", tone: "a", lines: ["helfen · danken · gefallen · gehören", "antworten · fehlen · gratulieren · vertrauen · zuhören", "Ich helfe dir. Das gehört mir."] },
      { head: "Verben mit Akkusativ", tone: "b", lines: ["lieben · sehen · brauchen · kaufen", "fragen · besuchen · kennen · verstehen", "Ich sehe dich. Ich brauche ihn."] },
      { head: "beide", tone: "c", lines: ["geben · schenken · zeigen · erklären · schicken", "Person = Dativ, Sache = Akkusativ", "Ich gebe dir das Buch."] }
    ],
    note: bi("Die meisten Verben nehmen den Akkusativ. Die Dativ-Verben sind eine kurze Liste — lernen, fertig.", "Most verbs take the accusative. The dative verbs are a short list — learn it and it's done.")
  },
  konnektoren: {
    kind: "contrast",
    columns: [
      { head: "Position 0: und, aber, oder, denn", tone: "a", lines: ["Verb bleibt auf Position 2", "Ich bleibe, denn ich bin müde."] },
      { head: "Position 1: deshalb, trotzdem, außerdem, dann", tone: "b", lines: ["Verb folgt sofort", "Ich bin müde, deshalb bleibe ich."] },
      { head: "Nebensatz: weil, obwohl, dass, wenn", tone: "c", lines: ["Verb am Ende", "Ich bleibe, weil ich müde bin."] }
    ],
    note: bi("Derselbe Gedanke, drei Bauarten. Welche du wählst, entscheidet, wo das Verb steht.", "The same thought, three constructions. Which you choose decides where the verb goes.")
  },
  "pronominal-adverbs": {
    kind: "contrast",
    columns: [
      { head: "Sache → da(r) + Präposition", tone: "a", lines: ["Ich warte auf den Brief. → Ich warte darauf.", "Ich denke an die Prüfung. → Ich denke daran.", "Frage: Worauf wartest du?"] },
      { head: "Person → Präposition + Pronomen", tone: "b", lines: ["Ich warte auf meinen Bruder. → Ich warte auf ihn.", "Ich denke an meine Oma. → Ich denke an sie.", "Frage: Auf wen wartest du?"] }
    ],
    note: bi("Beginnt die Präposition mit Vokal, kommt ein r dazwischen: darauf, daran, worüber. Vor einem dass-Satz steht immer da(r)-: Ich freue mich darauf, dass …", "If the preposition starts with a vowel, an r goes between: darauf, daran, worüber. Before a dass-clause always da(r)-: Ich freue mich darauf, dass …")
  },
  nominalisierung: {
    kind: "contrast",
    columns: [
      { head: "verbal (Nebensatz)", tone: "a", lines: ["weil es regnete", "obwohl er krank war", "nachdem er angekommen war", "damit die Luft sauberer wird"] },
      { head: "nominal (Präposition + Nomen)", tone: "b", lines: ["wegen des Regens", "trotz seiner Krankheit", "nach seiner Ankunft", "zur Verbesserung der Luft"] }
    ],
    note: bi("Gleicher Inhalt, dichterer Stil. Nominal wirkt sachlich und schriftlich; verbal wirkt gesprochen. B2 verlangt beides — und den Wechsel dazwischen.", "Same content, denser style. Nominal reads as factual and written; verbal as spoken. B2 asks for both — and for switching between them.")
  },
  "modal-subjektiv": {
    kind: "contrast",
    columns: [
      { head: "objektiv", tone: "a", lines: ["Er muss arbeiten. (Pflicht)", "Sie kann schwimmen. (Fähigkeit)", "Er soll kommen. (Auftrag)"] },
      { head: "subjektiv — Vermutung", tone: "b", lines: ["Er muss krank sein. (~ 95 %)", "Er dürfte krank sein. (~ 75 %)", "Er könnte krank sein. (~ 50 %)", "Vergangenheit: Er muss krank gewesen sein."] },
      { head: "subjektiv — Behauptung", tone: "c", lines: ["Er soll reich sein. (man sagt)", "Er will das nicht gewusst haben. (behauptet er)"] }
    ],
    note: bi("Dasselbe Modalverb, eine ganz andere Bedeutung: nicht mehr, was jemand tun muss, sondern wie sicher du dir bist.", "The same modal verb, a completely different meaning: no longer what someone has to do, but how sure you are.")
  },
  passiversatz: {
    kind: "contrast",
    columns: [
      { head: "Passiv mit Modalverb", tone: "a", lines: ["Das Problem kann gelöst werden.", "Der Text muss übersetzt werden."] },
      { head: "Ersatzformen", tone: "b", lines: ["Das Problem lässt sich lösen.", "Das Problem ist lösbar.", "Das Problem ist zu lösen.", "Der Text ist zu übersetzen. (muss)"] }
    ],
    note: bi("sich lassen + Infinitiv, -bar, sein + zu + Infinitiv: kürzer als das Passiv und typisch für Sachtexte.", "sich lassen + infinitive, -bar, sein + zu + infinitive: shorter than the passive and typical of factual texts.")
  },
  temporal: {
    kind: "contrast",
    columns: [
      { head: "seit — bis heute", tone: "a", lines: ["Ich lerne seit zwei Jahren Deutsch.", "(angefangen, dauert an)", "seit + Dativ · Präsens!"] },
      { head: "vor — abgeschlossen", tone: "b", lines: ["Ich habe vor zwei Jahren angefangen.", "(Zeitpunkt in der Vergangenheit)", "vor + Dativ · Perfekt"] },
      { head: "ab · bis · von … bis", tone: "c", lines: ["ab Montag · bis Freitag", "von 9 bis 17 Uhr", "in zwei Wochen (Zukunft)"] }
    ],
    note: bi("seit und vor werden ständig verwechselt: seit läuft noch, vor ist vorbei. Und nach seit steht das Präsens, nie das Perfekt.", "seit and vor are constantly mixed up: seit is still running, vor is over. And after seit comes the present, never the perfect.")
  },

  /* ----------------------------------------------------------- timelines */
  timeline: {
    kind: "timeline",
    points: [
      { at: 8, label: "Plusquamperfekt", example: "hatte gemacht" },
      { at: 30, label: "Präteritum / Perfekt", example: "machte · hat gemacht" },
      { at: 52, label: "Präsens", example: "macht", now: true },
      { at: 74, label: "Futur I", example: "wird machen" },
      { at: 94, label: "Futur II", example: "wird gemacht haben" }
    ],
    note: bi("Gesprochen erzählt man im Perfekt; war, hatte und die Modalverben im Präteritum; geschrieben oft ganz im Präteritum. Das Plusquamperfekt steht für das, was davor schon passiert war.", "Spoken German narrates in the perfect; war, hatte and the modals in the simple past; written German often entirely in the simple past. The pluperfect is for what had already happened before that.")
  },
  "temporal-clauses": {
    kind: "timeline",
    points: [
      { at: 8, label: "bevor", example: "Bevor ich esse, wasche ich mir die Hände." },
      { at: 30, label: "als · wenn · während", example: "Als ich Kind war … Während ich esse …", now: true },
      { at: 55, label: "nachdem · sobald", example: "Nachdem ich gegessen hatte, …" },
      { at: 78, label: "seit(dem)", example: "Seit ich hier wohne, …" },
      { at: 96, label: "bis", example: "Ich warte, bis du kommst." }
    ],
    note: bi("als = einmal in der Vergangenheit, wenn = immer wieder oder Zukunft. nachdem verlangt zwei Zeiten: Plusquamperfekt im Nebensatz, Präteritum oder Perfekt im Hauptsatz.", "als = once in the past, wenn = repeatedly or in the future. nachdem needs two tenses: pluperfect in the clause, simple past or perfect in the main clause.")
  },

  /* --------------------------------------------------------------- clock */
  clock: {
    kind: "clock",
    note: bi("Offiziell: vierzehn Uhr dreißig. Im Alltag: halb drei — die halbe Stunde vor der vollen. Viertel nach zwei, Viertel vor drei.", "Officially: vierzehn Uhr dreißig. Everyday: halb drei — the half hour before the full one. Viertel nach zwei, Viertel vor drei.")
  }
};

/* ------------------------------------------------------------ rendering */

/** Every illustration the syllabus may refer to. Exposed for the test. */
export const ILLUSTRATION_IDS: readonly string[] = Object.keys(SPECS);

export function hasIllustration(id: string): boolean {
  return id in SPECS;
}

/** The diagram for an id, or null when there is none — a missing id is not an error on screen. */
export function renderIllustration(id: string): HTMLElement | null {
  const spec = SPECS[id];
  if (!spec) return null;

  const figure = h("figure", { class: "illus", "data-kind": spec.kind });
  switch (spec.kind) {
    case "frame":
      figure.append(renderFrame(spec));
      break;
    case "grid":
      figure.append(renderGrid(spec));
      break;
    case "contrast":
      figure.append(renderContrast(spec));
      break;
    case "timeline":
      figure.append(renderTimeline(spec));
      break;
    case "clock":
      figure.append(renderClock());
      break;
  }
  const lang = getLang();
  figure.append(h("figcaption", { class: "illus__note" }, spec.note[lang]));
  return figure;
}

function renderFrame(spec: Frame): HTMLElement {
  const row = h("div", { class: "illus__frame" });
  spec.slots.forEach((slot, index) => {
    const marked = spec.mark.includes(index);
    const cell = h(
      "span",
      { class: "illus__cell" },
      h("span", { class: "illus__slot", "data-mark": String(marked) }, slot)
    );
    const tag = spec.tags?.[index];
    if (tag) cell.append(h("small", { class: "illus__tag" }, tag));
    row.append(cell);
  });
  return row;
}

function renderGrid(spec: Grid): HTMLElement {
  const marked = new Set((spec.mark ?? []).map(([r, c]) => `${r}:${c}`));
  // Rows labelled "1", "2" … are just numbered lists; the numbers add nothing.
  const numbered = spec.rows.every((row) => /^\d+$/.test(row));

  const head = h("tr", {});
  if (!numbered) head.append(h("th", { class: "illus__corner" }, ""));
  for (const col of spec.cols) head.append(h("th", { scope: "col" }, col));

  const body = h("tbody");
  spec.rows.forEach((row, r) => {
    const tr = h("tr", {});
    if (!numbered) tr.append(h("th", { scope: "row" }, row));
    (spec.cells[r] ?? []).forEach((cell, c) => {
      tr.append(h("td", { "data-mark": String(marked.has(`${r}:${c}`)) }, cell));
    });
    body.append(tr);
  });

  return h("div", { class: "illus__wrap" }, h("table", { class: "illus__grid" }, h("thead", {}, head), body));
}

function renderContrast(spec: Contrast): HTMLElement {
  const cols = h("div", { class: "illus__cols", "data-count": String(spec.columns.length) });
  for (const column of spec.columns) {
    const box = h("div", { class: "illus__col", "data-tone": column.tone }, h("p", { class: "illus__head" }, column.head));
    for (const line of column.lines) box.append(h("p", { class: "illus__line" }, line));
    cols.append(box);
  }
  return cols;
}

/**
 * The one place geometry matters: points spaced along a line. Built as SVG
 * with the theme's colours, and with the text sized so five labels still fit
 * at phone width.
 */
function renderTimeline(spec: Timeline): HTMLElement {
  const W = 640;
  const H = 150;
  const y = 78;
  const parts: string[] = [];

  parts.push(`<line x1="24" y1="${y}" x2="${W - 24}" y2="${y}" class="tl__axis"/>`);
  parts.push(`<polygon points="${W - 24},${y - 6} ${W - 10},${y} ${W - 24},${y + 6}" class="tl__arrow"/>`);

  for (const point of spec.points) {
    const x = 24 + ((W - 48) * point.at) / 100;
    const cls = point.now ? "tl__dot tl__dot--now" : "tl__dot";
    parts.push(`<circle cx="${x}" cy="${y}" r="${point.now ? 8 : 6}" class="${cls}"/>`);
    parts.push(`<text x="${x}" y="${y - 22}" text-anchor="middle" class="tl__label">${esc(point.label)}</text>`);
    // Long examples are split at the separator so they stack rather than overlap.
    const lines = point.example.split(" · ");
    lines.forEach((line, i) => {
      parts.push(`<text x="${x}" y="${y + 26 + i * 16}" text-anchor="middle" class="tl__example">${esc(line)}</text>`);
    });
  }
  if (spec.points.some((p) => p.now)) {
    parts.push(`<text x="${W / 2}" y="${H - 6}" text-anchor="middle" class="tl__now">jetzt</text>`);
  }

  return h("div", {
    class: "illus__svg",
    html: `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Zeitstrahl" preserveAspectRatio="xMidYMid meet">${parts.join("")}</svg>`
  });
}

/** A clock at half past two, because that is the time everyone gets wrong. */
function renderClock(): HTMLElement {
  const size = 200;
  const c = size / 2;
  const parts: string[] = [];

  parts.push(`<circle cx="${c}" cy="${c}" r="${c - 6}" class="clk__face"/>`);
  for (let i = 0; i < 12; i += 1) {
    const angle = (i * Math.PI) / 6;
    const inner = c - 20;
    const outer = c - 10;
    parts.push(
      `<line x1="${c + inner * Math.sin(angle)}" y1="${c - inner * Math.cos(angle)}" x2="${c + outer * Math.sin(angle)}" y2="${c - outer * Math.cos(angle)}" class="clk__tick"/>`
    );
  }
  for (const [n, angle] of [["12", 0], ["3", Math.PI / 2], ["6", Math.PI], ["9", (3 * Math.PI) / 2]] as const) {
    const r = c - 34;
    parts.push(
      `<text x="${c + r * Math.sin(angle)}" y="${c - r * Math.cos(angle) + 5}" text-anchor="middle" class="clk__num">${n}</text>`
    );
  }
  // 2:30 — the hour hand halfway between 2 and 3, the minute hand on 6.
  const hourAngle = ((2.5 * 30) * Math.PI) / 180;
  const minuteAngle = Math.PI;
  parts.push(`<line x1="${c}" y1="${c}" x2="${c + 44 * Math.sin(hourAngle)}" y2="${c - 44 * Math.cos(hourAngle)}" class="clk__hand clk__hand--hour"/>`);
  parts.push(`<line x1="${c}" y1="${c}" x2="${c + 66 * Math.sin(minuteAngle)}" y2="${c - 66 * Math.cos(minuteAngle)}" class="clk__hand"/>`);
  parts.push(`<circle cx="${c}" cy="${c}" r="4" class="clk__pin"/>`);

  const svg = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="halb drei" preserveAspectRatio="xMidYMid meet">${parts.join("")}</svg>`;
  return h(
    "div",
    { class: "illus__clock" },
    h("div", { class: "illus__svg illus__svg--clock", html: svg }),
    h(
      "div",
      { class: "illus__clockwords" },
      h("p", { class: "illus__head" }, "14:30"),
      h("p", { class: "illus__line" }, "vierzehn Uhr dreißig"),
      h("p", { class: "illus__line" }, "halb drei"),
      h("p", { class: "illus__line illus__line--muted" }, "Viertel nach zwei · Viertel vor drei")
    )
  );
}
