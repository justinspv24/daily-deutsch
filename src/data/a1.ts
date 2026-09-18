import type { Bilingual, BlankQuestion, GrammarItem, TopicItem, UpcomingTopic, VocabItem } from "../types";

/**
 * The A1 bank: first sentences. sein and haben, the present tense, articles in
 * the nominative and accusative, question words, modal verbs and negation.
 *
 * Every item carries the syllabus section it belongs to (`a1_s01` …), so the
 * map in `syllabus/a1.ts` can show what the drill actually asks for each
 * topic. The test insists every section has words, sentences and a review
 * topic behind it.
 */

const bi = (de: string, en: string): Bilingual => ({ de, en });

const v = (
  id: string,
  kind: VocabItem["kind"],
  word: string,
  key: string,
  en: readonly string[],
  form: readonly string[],
  note: Bilingual,
  section: string
): VocabItem => ({ id, kind, word, key, en, form, note, section });

const g = (
  id: string,
  group: Bilingual,
  sentence: string,
  hint: Bilingual,
  answers: readonly string[],
  why: Bilingual,
  section: string
): GrammarItem => ({ id, group, sentence, hint, answers, why, section });

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
  neg: bi("Negation: nicht & kein", "Negation: nicht & kein"),
  zeit: bi("Zeitangaben", "Time expressions"),
  poss: bi("Possessivartikel", "Possessives"),
  trenn: bi("Trennbare Verben", "Separable verbs"),
  dat: bi("Dativ nach Präpositionen", "Dative after prepositions"),
  imp: bi("Imperativ", "Imperative"),
  perf: bi("Perfekt: erste Schritte", "Perfect tense: first steps"),
  adj: bi("Adjektive & Farben", "Adjectives & colours"),
  brief: bi("Anrede & Gruß", "Salutation & sign-off")
} satisfies Record<string, Bilingual>;

/* The sections of the A1 syllabus, by number. */
const S = {
  kennen: "a1_s01",
  zahlen: "a1_s02",
  familie: "a1_s03",
  wohnen: "a1_s04",
  essen: "a1_s05",
  tag: "a1_s06",
  freizeit: "a1_s07",
  beruf: "a1_s08",
  unterwegs: "a1_s09",
  gesund: "a1_s10",
  wetter: "a1_s11",
  schreiben: "a1_s12"
} as const;

export const A1_VOCAB: readonly VocabItem[] = [
  /* --------------------------------------------------- the original fifteen */
  v("a1_v_tisch", "noun", "Tisch", "der", ["table"], ["die Tische", "Tische"],
    bi("Plural nur mit -e: die Tische.", "The plural just adds -e: die Tische."), S.wohnen),
  v("a1_v_tuer", "noun", "Tür", "die", ["door"], ["die Türen", "Türen"],
    bi("Feminin, Plural auf -en.", "Feminine, plural in -en."), S.wohnen),
  v("a1_v_fenster", "noun", "Fenster", "das", ["window"], ["die Fenster", "Fenster"],
    bi("Neutrum auf -er: der Plural bleibt gleich.", "Neuter ending in -er: the plural does not change."), S.wohnen),
  v("a1_v_apfel", "noun", "Apfel", "der", ["apple"], ["die Äpfel", "Äpfel"],
    bi("Plural mit Umlaut, ohne Endung: die Äpfel.", "The plural takes an umlaut and no ending: die Äpfel."), S.essen),
  v("a1_v_schwester", "noun", "Schwester", "die", ["sister"], ["die Schwestern", "Schwestern"],
    bi("Plural auf -n.", "Plural in -n."), S.familie),
  v("a1_v_haus", "noun", "Haus", "das", ["house"], ["die Häuser", "Häuser"],
    bi("Umlaut + -er: die Häuser.", "Umlaut plus -er: die Häuser."), S.wohnen),
  v("a1_v_stadt", "noun", "Stadt", "die", ["city", "town"], ["die Städte", "Städte"],
    bi("Umlaut + -e: die Städte.", "Umlaut plus -e: die Städte."), S.kennen),
  v("a1_v_brot", "noun", "Brot", "das", ["bread"], ["die Brote", "Brote"],
    bi("Plural auf -e, kein Umlaut.", "Plural in -e, no umlaut."), S.essen),
  v("a1_v_kind", "noun", "Kind", "das", ["child"], ["die Kinder", "Kinder"],
    bi("Plural auf -er.", "Plural in -er."), S.familie),
  v("a1_v_essen", "verb", "essen", "haben", ["to eat", "eat"], ["gegessen"],
    bi("Unregelmäßig: gegessen — mit einem extra ge.", "Irregular: gegessen — note the extra ge."), S.essen),
  v("a1_v_trinken", "verb", "trinken", "haben", ["to drink", "drink"], ["getrunken"],
    bi("i → u im Partizip: getrunken.", "i → u in the participle: getrunken."), S.essen),
  v("a1_v_gehen", "verb", "gehen", "sein", ["to go", "to walk", "go"], ["gegangen"],
    bi("Bewegung → sein. Ich bin gegangen.", "Movement → sein. Ich bin gegangen."), S.unterwegs),
  v("a1_v_kommen", "verb", "kommen", "sein", ["to come", "come"], ["gekommen"],
    bi("Bewegung → sein. Er ist gekommen.", "Movement → sein. Er ist gekommen."), S.kennen),
  v("a1_v_schlafen", "verb", "schlafen", "haben", ["to sleep", "sleep"], ["geschlafen"],
    bi("Kein Zustandswechsel, keine Bewegung → haben.", "No change of state, no movement → haben."), S.tag),
  v("a1_v_lesen", "verb", "lesen", "haben", ["to read", "read"], ["gelesen"],
    bi("Partizip ohne ge-… nein: ge-lesen, regelmäßig gebaut.", "Participle: ge-lesen, built the regular way."), S.freizeit),

  /* ------------------------------------------------ s01 Kennenlernen */
  v("a1_v_name", "noun", "Name", "der", ["name"], ["die Namen", "Namen"],
    bi("Maskulin auf -e — selten! Plural -n.", "Masculine in -e — rare! Plural -n."), S.kennen),
  v("a1_v_land", "noun", "Land", "das", ["country"], ["die Länder", "Länder"],
    bi("Umlaut + -er: die Länder.", "Umlaut plus -er: die Länder."), S.kennen),
  v("a1_v_sprache", "noun", "Sprache", "die", ["language"], ["die Sprachen", "Sprachen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.kennen),
  v("a1_v_heissen", "verb", "heißen", "haben", ["to be called", "be called"], ["geheißen"],
    bi("Unregelmäßig: geheißen. Wie heißt du? — Ich heiße …", "Irregular: geheißen. Wie heißt du? — Ich heiße …"), S.kennen),
  v("a1_v_wohnen", "verb", "wohnen", "haben", ["to live", "live", "to reside"], ["gewohnt"],
    bi("Regelmäßig: ge- + wohn + -t.", "Regular: ge- + wohn + -t."), S.kennen),
  v("a1_v_sprechen", "verb", "sprechen", "haben", ["to speak", "speak"], ["gesprochen"],
    bi("e → o im Partizip: gesprochen. Präsens: du sprichst.", "e → o in the participle: gesprochen. Present: du sprichst."), S.kennen),

  /* ------------------------------------------------ s02 Zahlen & Zeit */
  v("a1_v_uhr", "noun", "Uhr", "die", ["clock", "watch", "o'clock"], ["die Uhren", "Uhren"],
    bi("Feminin. Es ist acht Uhr — ohne Plural.", "Feminine. Es ist acht Uhr — no plural there."), S.zahlen),
  v("a1_v_tag", "noun", "Tag", "der", ["day"], ["die Tage", "Tage"],
    bi("Plural -e, kein Umlaut: die Tage.", "Plural -e, no umlaut: die Tage."), S.zahlen),
  v("a1_v_woche", "noun", "Woche", "die", ["week"], ["die Wochen", "Wochen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.zahlen),
  v("a1_v_monat", "noun", "Monat", "der", ["month"], ["die Monate", "Monate"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.zahlen),
  v("a1_v_jahr", "noun", "Jahr", "das", ["year"], ["die Jahre", "Jahre"],
    bi("Neutrum, Plural -e. Nach Zahlen oft ohne: zwei Jahre.", "Neuter, plural -e."), S.zahlen),
  v("a1_v_zahl", "noun", "Zahl", "die", ["number"], ["die Zahlen", "Zahlen"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.zahlen),

  /* ------------------------------------------------ s03 Familie */
  v("a1_v_mutter", "noun", "Mutter", "die", ["mother"], ["die Mütter", "Mütter"],
    bi("Umlaut, keine Endung: die Mütter.", "Umlaut, no ending: die Mütter."), S.familie),
  v("a1_v_vater", "noun", "Vater", "der", ["father"], ["die Väter", "Väter"],
    bi("Umlaut, keine Endung: die Väter.", "Umlaut, no ending: die Väter."), S.familie),
  v("a1_v_bruder", "noun", "Bruder", "der", ["brother"], ["die Brüder", "Brüder"],
    bi("Umlaut, keine Endung: die Brüder.", "Umlaut, no ending: die Brüder."), S.familie),
  v("a1_v_familie", "noun", "Familie", "die", ["family"], ["die Familien", "Familien"],
    bi("-ie → feminin, Plural -n.", "-ie → feminine, plural -n."), S.familie),
  v("a1_v_tochter", "noun", "Tochter", "die", ["daughter"], ["die Töchter", "Töchter"],
    bi("Umlaut, keine Endung: die Töchter.", "Umlaut, no ending: die Töchter."), S.familie),
  v("a1_v_sohn", "noun", "Sohn", "der", ["son"], ["die Söhne", "Söhne"],
    bi("Umlaut + -e: die Söhne.", "Umlaut plus -e: die Söhne."), S.familie),

  /* ------------------------------------------------ s04 Wohnen */
  v("a1_v_wohnung", "noun", "Wohnung", "die", ["flat", "apartment"], ["die Wohnungen", "Wohnungen"],
    bi("-ung → immer feminin, Plural -en.", "-ung → always feminine, plural -en."), S.wohnen),
  v("a1_v_zimmer", "noun", "Zimmer", "das", ["room"], ["die Zimmer", "Zimmer"],
    bi("Neutrum auf -er: Plural unverändert.", "Neuter in -er: plural unchanged."), S.wohnen),
  v("a1_v_kueche", "noun", "Küche", "die", ["kitchen"], ["die Küchen", "Küchen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.wohnen),
  v("a1_v_bett", "noun", "Bett", "das", ["bed"], ["die Betten", "Betten"],
    bi("Neutrum, Plural -en — eine Ausnahme.", "Neuter, plural -en — an exception."), S.wohnen),
  v("a1_v_stuhl", "noun", "Stuhl", "der", ["chair"], ["die Stühle", "Stühle"],
    bi("Umlaut + -e: die Stühle.", "Umlaut plus -e: die Stühle."), S.wohnen),

  /* ------------------------------------------------ s05 Essen & Einkaufen */
  v("a1_v_ei", "noun", "Ei", "das", ["egg"], ["die Eier", "Eier"],
    bi("Plural -er: die Eier.", "Plural -er: die Eier."), S.essen),
  v("a1_v_kartoffel", "noun", "Kartoffel", "die", ["potato"], ["die Kartoffeln", "Kartoffeln"],
    bi("Feminin auf -el, Plural -n.", "Feminine in -el, plural -n."), S.essen),
  v("a1_v_getraenk", "noun", "Getränk", "das", ["drink", "beverage"], ["die Getränke", "Getränke"],
    bi("Ge- + -e → oft neutrum. Plural -e.", "Ge- … often neuter. Plural -e."), S.essen),
  v("a1_v_supermarkt", "noun", "Supermarkt", "der", ["supermarket"], ["die Supermärkte", "Supermärkte"],
    bi("der Markt → die Märkte: Umlaut + -e.", "der Markt → die Märkte: umlaut plus -e."), S.essen),
  v("a1_v_kaufen", "verb", "kaufen", "haben", ["to buy", "buy"], ["gekauft"],
    bi("Regelmäßig: gekauft.", "Regular: gekauft."), S.essen),
  v("a1_v_bezahlen", "verb", "bezahlen", "haben", ["to pay", "pay"], ["bezahlt"],
    bi("be- ist untrennbar → kein ge-: bezahlt.", "be- is inseparable → no ge-: bezahlt."), S.essen),
  v("a1_v_kosten", "verb", "kosten", "haben", ["to cost", "cost"], ["gekostet"],
    bi("Stamm auf -t → -et: gekostet.", "Stem ending in -t → -et: gekostet."), S.essen),

  /* ------------------------------------------------ s06 Tagesablauf */
  v("a1_v_aufstehen", "verb", "aufstehen", "sein", ["to get up", "get up"], ["aufgestanden"],
    bi("Zustandswechsel → sein. ge- in der Mitte: auf-ge-standen.", "Change of state → sein. ge- in the middle: auf-ge-standen."), S.tag),
  v("a1_v_anfangen", "verb", "anfangen", "haben", ["to begin", "to start", "begin", "start"], ["angefangen"],
    bi("Trennbar: an-ge-fangen. Präsens: er fängt an.", "Separable: an-ge-fangen. Present: er fängt an."), S.tag),
  v("a1_v_arbeiten", "verb", "arbeiten", "haben", ["to work", "work"], ["gearbeitet"],
    bi("Stamm auf -t → -et: gearbeitet.", "Stem ending in -t → -et: gearbeitet."), S.tag),
  v("a1_v_einkaufen", "verb", "einkaufen", "haben", ["to shop", "to go shopping", "shop"], ["eingekauft"],
    bi("Trennbar: ein-ge-kauft.", "Separable: ein-ge-kauft."), S.tag),
  v("a1_v_fernsehen", "verb", "fernsehen", "haben", ["to watch TV", "watch TV", "to watch television"], ["ferngesehen"],
    bi("Trennbar: fern-ge-sehen. Präsens: sie sieht fern.", "Separable: fern-ge-sehen. Present: sie sieht fern."), S.tag),
  v("a1_v_kochen", "verb", "kochen", "haben", ["to cook", "cook"], ["gekocht"],
    bi("Regelmäßig: gekocht.", "Regular: gekocht."), S.tag),

  /* ------------------------------------------------ s07 Freizeit */
  v("a1_v_hobby", "noun", "Hobby", "das", ["hobby"], ["die Hobbys", "Hobbys"],
    bi("Fremdwort → Plural -s: die Hobbys (nicht Hobbies).", "Loanword → plural -s: die Hobbys (not Hobbies)."), S.freizeit),
  v("a1_v_film", "noun", "Film", "der", ["film", "movie"], ["die Filme", "Filme"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.freizeit),
  v("a1_v_buch", "noun", "Buch", "das", ["book"], ["die Bücher", "Bücher"],
    bi("Umlaut + -er: die Bücher.", "Umlaut plus -er: die Bücher."), S.freizeit),
  v("a1_v_spielen", "verb", "spielen", "haben", ["to play", "play"], ["gespielt"],
    bi("Regelmäßig: gespielt.", "Regular: gespielt."), S.freizeit),
  v("a1_v_schwimmen", "verb", "schwimmen", "sein", ["to swim", "swim"], ["geschwommen"],
    bi("Bewegung → sein: Ich bin geschwommen. i → o im Partizip.", "Movement → sein: Ich bin geschwommen. i → o in the participle."), S.freizeit),
  v("a1_v_tanzen", "verb", "tanzen", "haben", ["to dance", "dance"], ["getanzt"],
    bi("Regelmäßig: getanzt.", "Regular: getanzt."), S.freizeit),
  v("a1_v_treffen", "verb", "treffen", "haben", ["to meet", "meet"], ["getroffen"],
    bi("e → o im Partizip: getroffen. Präsens: er trifft.", "e → o in the participle: getroffen. Present: er trifft."), S.freizeit),

  /* ------------------------------------------------ s08 Arbeit & Beruf */
  v("a1_v_beruf", "noun", "Beruf", "der", ["profession", "job", "occupation"], ["die Berufe", "Berufe"],
    bi("Maskulin, Plural -e. Was bist du von Beruf?", "Masculine, plural -e. Was bist du von Beruf?"), S.beruf),
  v("a1_v_arbeit", "noun", "Arbeit", "die", ["work", "job"], ["die Arbeiten", "Arbeiten"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.beruf),
  v("a1_v_lehrer", "noun", "Lehrer", "der", ["teacher", "male teacher"], ["die Lehrer", "Lehrer"],
    bi("-er → maskulin, Plural unverändert. Die Frau: die Lehrerin.", "-er → masculine, plural unchanged. The woman: die Lehrerin."), S.beruf),
  v("a1_v_lehrerin", "noun", "Lehrerin", "die", ["teacher", "female teacher"], ["die Lehrerinnen", "Lehrerinnen"],
    bi("-in → feminin, Plural -nen.", "-in → feminine, plural -nen."), S.beruf),
  v("a1_v_firma", "noun", "Firma", "die", ["company", "firm"], ["die Firmen", "Firmen"],
    bi("-a → -en: die Firmen.", "-a → -en: die Firmen."), S.beruf),
  v("a1_v_buero", "noun", "Büro", "das", ["office"], ["die Büros", "Büros"],
    bi("Fremdwort auf -o → Plural -s.", "Loanword in -o → plural -s."), S.beruf),
  v("a1_v_kollege", "noun", "Kollege", "der", ["colleague", "male colleague"], ["die Kollegen", "Kollegen"],
    bi("Maskulin auf -e, Plural -n. n-Deklination: den Kollegen.", "Masculine in -e, plural -n. n-declension: den Kollegen."), S.beruf),
  v("a1_v_verdienen", "verb", "verdienen", "haben", ["to earn", "earn"], ["verdient"],
    bi("ver- ist untrennbar → kein ge-: verdient.", "ver- is inseparable → no ge-: verdient."), S.beruf),

  /* ------------------------------------------------ s09 Unterwegs */
  v("a1_v_bus", "noun", "Bus", "der", ["bus"], ["die Busse", "Busse"],
    bi("Kurzes u, Plural -se: die Busse.", "Short u, plural -se: die Busse."), S.unterwegs),
  v("a1_v_zug", "noun", "Zug", "der", ["train"], ["die Züge", "Züge"],
    bi("Umlaut + -e: die Züge.", "Umlaut plus -e: die Züge."), S.unterwegs),
  v("a1_v_auto", "noun", "Auto", "das", ["car"], ["die Autos", "Autos"],
    bi("Fremdwort auf -o → Plural -s.", "Loanword in -o → plural -s."), S.unterwegs),
  v("a1_v_fahrrad", "noun", "Fahrrad", "das", ["bicycle", "bike"], ["die Fahrräder", "Fahrräder"],
    bi("das Rad → die Räder: Umlaut + -er.", "das Rad → die Räder: umlaut plus -er."), S.unterwegs),
  v("a1_v_bahnhof", "noun", "Bahnhof", "der", ["station", "railway station", "train station"], ["die Bahnhöfe", "Bahnhöfe"],
    bi("der Hof → die Höfe: Umlaut + -e.", "der Hof → die Höfe: umlaut plus -e."), S.unterwegs),
  v("a1_v_haltestelle", "noun", "Haltestelle", "die", ["stop", "bus stop"], ["die Haltestellen", "Haltestellen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.unterwegs),
  v("a1_v_fahren", "verb", "fahren", "sein", ["to drive", "to go", "to travel", "drive"], ["gefahren"],
    bi("Bewegung → sein. Präsens: du fährst.", "Movement → sein. Present: du fährst."), S.unterwegs),
  v("a1_v_abfahren", "verb", "abfahren", "sein", ["to depart", "to leave", "depart"], ["abgefahren"],
    bi("Trennbar + Bewegung: ist ab-ge-fahren.", "Separable + movement: ist ab-ge-fahren."), S.unterwegs),

  /* ------------------------------------------------ s10 Gesundheit */
  v("a1_v_kopf", "noun", "Kopf", "der", ["head"], ["die Köpfe", "Köpfe"],
    bi("Umlaut + -e: die Köpfe.", "Umlaut plus -e: die Köpfe."), S.gesund),
  v("a1_v_arm", "noun", "Arm", "der", ["arm"], ["die Arme", "Arme"],
    bi("Plural -e, kein Umlaut.", "Plural -e, no umlaut."), S.gesund),
  v("a1_v_bein", "noun", "Bein", "das", ["leg"], ["die Beine", "Beine"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.gesund),
  v("a1_v_auge", "noun", "Auge", "das", ["eye"], ["die Augen", "Augen"],
    bi("Neutrum auf -e — Ausnahme! Plural -n.", "Neuter in -e — an exception! Plural -n."), S.gesund),
  v("a1_v_zahn", "noun", "Zahn", "der", ["tooth"], ["die Zähne", "Zähne"],
    bi("Umlaut + -e: die Zähne.", "Umlaut plus -e: die Zähne."), S.gesund),
  v("a1_v_apotheke", "noun", "Apotheke", "die", ["pharmacy", "chemist's"], ["die Apotheken", "Apotheken"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.gesund),
  v("a1_v_medikament", "noun", "Medikament", "das", ["medicine", "medication", "drug"], ["die Medikamente", "Medikamente"],
    bi("-ment → neutrum, Plural -e.", "-ment → neuter, plural -e."), S.gesund),
  v("a1_v_termin", "noun", "Termin", "der", ["appointment"], ["die Termine", "Termine"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.gesund),

  /* ------------------------------------------------ s11 Wetter & Kleidung */
  v("a1_v_jacke", "noun", "Jacke", "die", ["jacket"], ["die Jacken", "Jacken"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.wetter),
  v("a1_v_mantel", "noun", "Mantel", "der", ["coat"], ["die Mäntel", "Mäntel"],
    bi("Umlaut, keine Endung: die Mäntel.", "Umlaut, no ending: die Mäntel."), S.wetter),
  v("a1_v_hose", "noun", "Hose", "die", ["trousers", "pants"], ["die Hosen", "Hosen"],
    bi("Im Deutschen Singular: eine Hose. Plural -n.", "Singular in German: eine Hose. Plural -n."), S.wetter),
  v("a1_v_hemd", "noun", "Hemd", "das", ["shirt"], ["die Hemden", "Hemden"],
    bi("Neutrum, Plural -en.", "Neuter, plural -en."), S.wetter),
  v("a1_v_schuh", "noun", "Schuh", "der", ["shoe"], ["die Schuhe", "Schuhe"],
    bi("Plural -e, kein Umlaut.", "Plural -e, no umlaut."), S.wetter),
  v("a1_v_kleid", "noun", "Kleid", "das", ["dress"], ["die Kleider", "Kleider"],
    bi("Plural -er. Die Kleider = auch: Kleidung.", "Plural -er. Die Kleider also means clothes."), S.wetter),
  v("a1_v_jahreszeit", "noun", "Jahreszeit", "die", ["season"], ["die Jahreszeiten", "Jahreszeiten"],
    bi("die Zeit → die Zeiten: Plural -en.", "die Zeit → die Zeiten: plural -en."), S.wetter),
  v("a1_v_tragen", "verb", "tragen", "haben", ["to wear", "to carry", "wear"], ["getragen"],
    bi("a → ä im Präsens (er trägt), Partizip getragen.", "a → ä in the present (er trägt), participle getragen."), S.wetter),

  /* ------------------------------------------------ s12 Schreiben */
  v("a1_v_vorname", "noun", "Vorname", "der", ["first name"], ["die Vornamen", "Vornamen"],
    bi("Wie der Name: maskulin auf -e, Plural -n.", "Like der Name: masculine in -e, plural -n."), S.schreiben),
  v("a1_v_nachname", "noun", "Nachname", "der", ["surname", "last name", "family name"], ["die Nachnamen", "Nachnamen"],
    bi("Maskulin auf -e, Plural -n.", "Masculine in -e, plural -n."), S.schreiben),
  v("a1_v_adresse", "noun", "Adresse", "die", ["address"], ["die Adressen", "Adressen"],
    bi("-e → feminin, Plural -n. Ein d, zwei s.", "-e → feminine, plural -n. One d, two s."), S.schreiben),
  v("a1_v_unterschrift", "noun", "Unterschrift", "die", ["signature"], ["die Unterschriften", "Unterschriften"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.schreiben),
  v("a1_v_formular", "noun", "Formular", "das", ["form"], ["die Formulare", "Formulare"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.schreiben),
  v("a1_v_brief", "noun", "Brief", "der", ["letter"], ["die Briefe", "Briefe"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.schreiben),
  v("a1_v_einladung", "noun", "Einladung", "die", ["invitation"], ["die Einladungen", "Einladungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.schreiben),
  v("a1_v_email", "noun", "E-Mail", "die", ["e-mail", "email"], ["die E-Mails", "E-Mails"],
    bi("Feminin (die Mail), Plural -s.", "Feminine (die Mail), plural -s."), S.schreiben),
  v("a1_v_schreiben", "verb", "schreiben", "haben", ["to write", "write"], ["geschrieben"],
    bi("ei → ie im Partizip: geschrieben.", "ei → ie in the participle: geschrieben."), S.schreiben)
];

export const A1_GRAMMAR: readonly GrammarItem[] = [
  /* ---------------------------------------------------------- sein & haben */
  g("a1_g1a", G.sein, "Ich ___ Student. (sein)", bi("Verb: sein", "verb: sein"), ["bin"],
    bi("ich → bin.", "ich → bin."), S.kennen),
  g("a1_g1b", G.sein, "Du ___ müde. (sein)", bi("Verb: sein", "verb: sein"), ["bist"],
    bi("du → bist.", "du → bist."), S.kennen),
  g("a1_g1c", G.sein, "Er ___ zwanzig Jahre alt. (sein)", bi("Verb: sein", "verb: sein"), ["ist"],
    bi("er/sie/es → ist.", "er/sie/es → ist."), S.kennen),
  g("a1_g1d", G.sein, "Wir ___ ein Auto. (haben)", bi("Verb: haben", "verb: haben"), ["haben"],
    bi("wir → haben, wie der Infinitiv.", "wir → haben, same as the infinitive."), S.familie),
  g("a1_g1e", G.sein, "Ihr ___ Hunger. (haben)", bi("Verb: haben", "verb: haben"), ["habt"],
    bi("ihr → habt.", "ihr → habt."), S.familie),
  g("a1_g1f", G.sein, "Sie ___ aus Indien. (sein — Plural)", bi("Verb: sein", "verb: sein"), ["sind"],
    bi("sie (Plural) → sind.", "sie (plural) → sind."), S.kennen),

  /* ---------------------------------------------------------- present tense */
  g("a1_g2a", G.verbs, "Ich ___ Deutsch. (lernen)", bi("Verb: lernen", "verb: lernen"), ["lerne"],
    bi("ich → Stamm + e: lerne.", "ich → stem + e: lerne."), S.kennen),
  g("a1_g2b", G.verbs, "Du ___ gern Pizza. (essen)", bi("Verb: essen", "verb: essen"), ["isst"],
    bi("essen wechselt e → i bei du und er: du isst.", "essen changes e → i for du and er: du isst."), S.tag),
  g("a1_g2c", G.verbs, "Er ___ nach Hause. (fahren)", bi("Verb: fahren", "verb: fahren"), ["fährt"],
    bi("fahren wechselt a → ä bei du und er: er fährt.", "fahren changes a → ä for du and er: er fährt."), S.tag),
  g("a1_g2d", G.verbs, "Wir ___ in Nürnberg. (wohnen)", bi("Verb: wohnen", "verb: wohnen"), ["wohnen"],
    bi("wir → Infinitivform: wohnen.", "wir → the infinitive form: wohnen."), S.kennen),
  g("a1_g2e", G.verbs, "Sie ___ ein Buch. (lesen — she)", bi("Verb: lesen", "verb: lesen"), ["liest"],
    bi("lesen wechselt e → ie: sie liest.", "lesen changes e → ie: sie liest."), S.tag),
  g("a1_g2f", G.verbs, "Ihr ___ Fußball. (spielen)", bi("Verb: spielen", "verb: spielen"), ["spielt"],
    bi("ihr → Stamm + t: spielt.", "ihr → stem + t: spielt."), S.kennen),

  /* --------------------------------------------------------------- articles */
  g("a1_g3a", G.art, "Das ist ___ Tisch.", bi("the table — <code>der Tisch</code>", "the table — <code>der Tisch</code>"), ["der"],
    bi("Nominativ: der Tisch.", "Nominative: der Tisch."), S.wohnen),
  g("a1_g3b", G.art, "Ich habe ___ Bruder.", bi("a brother — <code>der Bruder</code>", "a brother — <code>der Bruder</code>"), ["einen"],
    bi("haben + Akkusativ, maskulin: ein → einen.", "haben + accusative, masculine: ein → einen."), S.essen),
  g("a1_g3c", G.art, "Ich trinke ___ Wasser.", bi("a — <code>das Wasser</code>", "a — <code>das Wasser</code>"), ["ein"],
    bi("Akkusativ Neutrum: ein bleibt ein.", "Neuter accusative: ein stays ein."), S.essen),
  g("a1_g3d", G.art, "Ich sehe ___ Frau.", bi("the woman — <code>die Frau</code>", "the woman — <code>die Frau</code>"), ["die"],
    bi("Akkusativ feminin: die bleibt die.", "Feminine accusative: die stays die."), S.essen),
  g("a1_g3e", G.art, "Er kauft ___ Apfel.", bi("an apple — <code>der Apfel</code>", "an apple — <code>der Apfel</code>"), ["einen"],
    bi("kaufen + Akkusativ, maskulin: einen.", "kaufen + accusative, masculine: einen."), S.essen),
  g("a1_g3f", G.art, "___ Kind schläft.", bi("the child — <code>das Kind</code>", "the child — <code>das Kind</code>"), ["das"],
    bi("Nominativ Neutrum: das Kind.", "Neuter nominative: das Kind."), S.wohnen),
  g("a1_g3g", G.art, "___ Lampe ist neu.", bi("the lamp — <code>die Lampe</code>", "the lamp — <code>die Lampe</code>"), ["die"],
    bi("Nominativ feminin: die Lampe. -e ist meist feminin.", "Feminine nominative: die Lampe. -e is mostly feminine."), S.wohnen),
  g("a1_g3h", G.art, "Es gibt ___ Balkon.", bi("a balcony — <code>der Balkon</code>", "a balcony — <code>der Balkon</code>"), ["einen"],
    bi("es gibt + Akkusativ: einen Balkon.", "es gibt + accusative: einen Balkon."), S.wohnen),
  g("a1_g3i", G.art, "Hier ist ___ Zimmer frei.", bi("a room — <code>das Zimmer</code>", "a room — <code>das Zimmer</code>"), ["ein"],
    bi("Nominativ Neutrum: ein Zimmer.", "Neuter nominative: ein Zimmer."), S.wohnen),

  /* --------------------------------------------------------- question words */
  g("a1_g4a", G.frag, "___ heißt du?", bi("fragt nach dem Namen", "asks for a name"), ["wie"],
    bi("Wie heißt du? — der Name.", "Wie heißt du? — the name."), S.kennen),
  g("a1_g4b", G.frag, "___ wohnst du?", bi("fragt nach dem Ort", "asks for a place"), ["wo"],
    bi("Wo? — der Ort.", "Wo? — the place."), S.kennen),
  g("a1_g4c", G.frag, "___ kommst du?", bi("fragt nach der Herkunft", "asks where from"), ["woher"],
    bi("Woher? — die Herkunft.", "Woher? — origin."), S.kennen),
  g("a1_g4d", G.frag, "___ ist das?", bi("fragt nach einer Person", "asks about a person"), ["wer"],
    bi("Wer? — eine Person.", "Wer? — a person."), S.kennen),
  g("a1_g4e", G.frag, "___ kostet das?", bi("fragt nach dem Preis", "asks for a price"), ["was", "wie viel", "wieviel"],
    bi("Was kostet das? — oder: Wie viel kostet das?", "Was kostet das? — or: Wie viel kostet das?"), S.zahlen),
  g("a1_g4f", G.frag, "___ gehst du ins Bett?", bi("fragt nach der Zeit", "asks for a time"), ["wann"],
    bi("Wann? — die Zeit.", "Wann? — time."), S.zahlen),

  /* ----------------------------------------------------- time expressions */
  g("a1_g7a", G.zeit, "Der Kurs beginnt ___ 9 Uhr.", bi("Uhrzeit", "a clock time"), ["um"],
    bi("Uhrzeit → um: um 9 Uhr.", "Clock time → um: um 9 Uhr."), S.zahlen),
  g("a1_g7b", G.zeit, "___ Montag habe ich frei.", bi("Wochentag", "a weekday"), ["am"],
    bi("Tag → am: am Montag.", "Day → am: am Montag."), S.zahlen),
  g("a1_g7c", G.zeit, "___ Winter ist es kalt.", bi("Jahreszeit", "a season"), ["im"],
    bi("Monat, Jahreszeit → im: im Winter.", "Month, season → im: im Winter."), S.zahlen),

  /* ------------------------------------------------------------ possessives */
  g("a1_g8a", G.poss, "Das ist ___ Bruder. (my)", bi("my — <code>der Bruder</code>", "my — <code>der Bruder</code>"), ["mein"],
    bi("Nominativ maskulin: mein — wie ein.", "Masculine nominative: mein — like ein."), S.familie),
  g("a1_g8b", G.poss, "___ Mutter heißt Anna. (my)", bi("my — <code>die Mutter</code>", "my — <code>die Mutter</code>"), ["meine"],
    bi("Nominativ feminin: meine — wie eine.", "Feminine nominative: meine — like eine."), S.familie),
  g("a1_g8c", G.poss, "Ist das ___ Auto? (your — du)", bi("your — <code>das Auto</code>", "your — <code>das Auto</code>"), ["dein"],
    bi("Nominativ Neutrum: dein — wie ein.", "Neuter nominative: dein — like ein."), S.familie),

  /* ------------------------------------------------------------ modal verbs */
  g("a1_g5a", G.modal, "Ich ___ gut schwimmen. (können)", bi("Modalverb", "modal verb"), ["kann"],
    bi("ich kann — ohne Endung, mit a.", "ich kann — no ending, with a."), S.freizeit),
  g("a1_g5b", G.modal, "Du ___ jetzt schlafen. (müssen)", bi("Modalverb", "modal verb"), ["musst"],
    bi("du musst — der Umlaut fällt im Singular weg.", "du musst — the umlaut disappears in the singular."), S.beruf),
  g("a1_g5c", G.modal, "Er ___ ein Eis. (wollen)", bi("Modalverb", "modal verb"), ["will"],
    bi("er will — kein -t bei Modalverben.", "er will — modal verbs take no -t."), S.beruf),
  g("a1_g5d", G.modal, "Hier ___ man nicht rauchen. (dürfen)", bi("Modalverb", "modal verb"), ["darf"],
    bi("man darf — Singular ohne Umlaut.", "man darf — singular without the umlaut."), S.beruf),
  g("a1_g5e", G.modal, "___ ich dir helfen? (können — ich)", bi("Modalverb", "modal verb"), ["kann"],
    bi("Kann ich …? — die Frage beginnt mit dem Verb.", "Kann ich …? — the question starts with the verb."), S.freizeit),
  g("a1_g5f", G.modal, "Sie ___ Deutsch lernen. (möchten — she)", bi("Modalverb", "modal verb"), ["möchte"],
    bi("sie möchte — höflicher als will.", "sie möchte — more polite than will."), S.freizeit),
  g("a1_g5g", G.modal, "Ich spiele ___ Fußball. (like to)", bi("Adverb", "adverb"), ["gern", "gerne"],
    bi("gern nach dem Verb: Ich spiele gern.", "gern after the verb: Ich spiele gern."), S.freizeit),
  g("a1_g5h", G.modal, "___ du Tennis? (spielen — Ja/Nein-Frage)", bi("Verb zuerst", "verb first"), ["spielst"],
    bi("Ja/Nein-Frage: das Verb steht am Anfang.", "Yes/no question: the verb comes first."), S.freizeit),

  /* --------------------------------------------------------------- negation */
  g("a1_g6a", G.neg, "Ich habe ___ Auto.", bi("no — <code>das Auto</code>", "no — <code>das Auto</code>"), ["kein"],
    bi("Nomen mit Artikel → kein. Akkusativ Neutrum: kein.", "A noun with an article → kein. Neuter accusative: kein."), S.beruf),
  g("a1_g6b", G.neg, "Er kommt heute ___ .", bi("not", "not"), ["nicht"],
    bi("nicht verneint das Verb und steht am Ende.", "nicht negates the verb and goes at the end."), S.beruf),
  g("a1_g6c", G.neg, "Wir haben ___ Zeit.", bi("no — <code>die Zeit</code>", "no — <code>die Zeit</code>"), ["keine"],
    bi("Feminin: keine.", "Feminine: keine."), S.beruf),
  g("a1_g6d", G.neg, "Ich habe ___ Hunger.", bi("no — <code>der Hunger</code>", "no — <code>der Hunger</code>"), ["keinen"],
    bi("Akkusativ maskulin: keinen.", "Masculine accusative: keinen."), S.beruf),
  g("a1_g6e", G.neg, "Das ist ___ gut.", bi("not", "not"), ["nicht"],
    bi("Adjektiv → nicht.", "Adjective → nicht."), S.beruf),
  g("a1_g6f", G.neg, "Sie hat ___ Geschwister.", bi("no — <code>die Geschwister</code> (Plural)", "no — <code>die Geschwister</code> (plural)"), ["keine"],
    bi("Plural: keine.", "Plural: keine."), S.beruf),

  /* -------------------------------------------------------- separable verbs */
  g("a1_g9a", G.trenn, "Um sieben Uhr ___ ich auf. (aufstehen)", bi("Verbteil", "the verb part"), ["stehe"],
    bi("Zeit vorne, Verb auf Position 2, auf- am Ende.", "Time first, verb in second position, auf- at the end."), S.tag),
  g("a1_g9b", G.trenn, "Dann ___ ich. (frühstücken)", bi("Verb: frühstücken", "verb: frühstücken"), ["frühstücke"],
    bi("Nicht trennbar — früh- bleibt dran: ich frühstücke.", "Not separable — früh- stays on: ich frühstücke."), S.tag),

  /* ----------------------------------------------------- dative after preps */
  g("a1_g10a", G.dat, "Ich fahre mit ___ Bus.", bi("the bus — <code>der Bus</code>", "the bus — <code>der Bus</code>"), ["dem"],
    bi("mit + Dativ, maskulin: dem.", "mit + dative, masculine: dem."), S.unterwegs),
  g("a1_g10b", G.dat, "Wir gehen ___ Bahnhof. (zu + der)", bi("to the station — <code>der Bahnhof</code>", "to the station — <code>der Bahnhof</code>"), ["zum"],
    bi("zu + dem = zum.", "zu + dem = zum."), S.unterwegs),
  g("a1_g10c", G.dat, "Er kommt ___ Arbeit. (from the)", bi("from work — <code>die Arbeit</code>", "from work — <code>die Arbeit</code>"), ["von der"],
    bi("von + Dativ, feminin: von der.", "von + dative, feminine: von der."), S.unterwegs),
  g("a1_g10d", G.dat, "Sie fährt ___ Berlin. (to)", bi("Stadt ohne Artikel", "a city, no article"), ["nach"],
    bi("Städte und Länder ohne Artikel → nach.", "Cities and countries without an article → nach."), S.unterwegs),

  /* ------------------------------------------------------------- imperative */
  g("a1_g11a", G.imp, "___ geradeaus! (gehen — du)", bi("Imperativ du", "du-imperative"), ["geh"],
    bi("du-Imperativ: Stamm ohne -st, ohne du: Geh!", "du-imperative: stem without -st, no pronoun: Geh!"), S.unterwegs),
  g("a1_g11b", G.imp, "___ Sie links! (gehen — Sie)", bi("Imperativ Sie", "Sie-imperative"), ["gehen"],
    bi("Sie-Imperativ: Infinitiv + Sie: Gehen Sie!", "Sie-imperative: infinitive + Sie: Gehen Sie!"), S.unterwegs),

  /* --------------------------------------------------------- perfect: first */
  g("a1_g12a", G.perf, "Ich habe gestern Tee ___. (trinken)", bi("Partizip II", "past participle"), ["getrunken"],
    bi("trinken → getrunken, ganz am Ende.", "trinken → getrunken, right at the end."), S.gesund),
  g("a1_g12b", G.perf, "Wir ___ Pizza gegessen. (haben)", bi("Hilfsverb", "auxiliary"), ["haben"],
    bi("essen → haben. wir haben … gegessen.", "essen → haben. wir haben … gegessen."), S.gesund),
  g("a1_g12c", G.perf, "Mir ___ der Kopf weh. (tun)", bi("Verb: weh tun", "verb: weh tun"), ["tut"],
    bi("Der Kopf tut (mir) weh — Subjekt ist der Kopf.", "Der Kopf tut (mir) weh — the subject is the head."), S.gesund),
  g("a1_g12d", G.perf, "___ Sie viel Wasser! (trinken — Sie)", bi("Imperativ Sie", "Sie-imperative"), ["trinken"],
    bi("Ratschlag im Sie-Imperativ: Trinken Sie …!", "Advice in the Sie-imperative: Trinken Sie …!"), S.gesund),

  /* ----------------------------------------------------- adjectives, colours */
  g("a1_g13a", G.adj, "Es ___ heute. (regnen)", bi("Wetterverb mit es", "weather verb with es"), ["regnet"],
    bi("es regnet — Stamm auf -n → -et.", "es regnet — stem in -n → -et."), S.wetter),
  g("a1_g13b", G.adj, "Der Pullover ist ___. (red)", bi("Farbe", "a colour"), ["rot"],
    bi("Nach sein bleibt das Adjektiv ohne Endung: rot.", "After sein the adjective takes no ending: rot."), S.wetter),
  g("a1_g13c", G.adj, "Ich trage ___ Mantel.", bi("a coat — <code>der Mantel</code>", "a coat — <code>der Mantel</code>"), ["einen"],
    bi("tragen + Akkusativ, maskulin: einen.", "tragen + accusative, masculine: einen."), S.wetter),
  g("a1_g13d", G.adj, "Im Winter ist es ___. (cold)", bi("Adjektiv", "an adjective"), ["kalt"],
    bi("es ist kalt — keine Endung nach sein.", "es ist kalt — no ending after sein."), S.wetter),

  /* ---------------------------------------------------- salutation, sign-off */
  g("a1_g14a", G.brief, "___ Anna, wie geht es dir?", bi("Anrede, informell, an eine Frau", "informal salutation to a woman"), ["Liebe"],
    bi("Liebe Anna (feminin), Lieber Tom (maskulin).", "Liebe Anna (feminine), Lieber Tom (masculine)."), S.schreiben),
  g("a1_g14b", G.brief, "Sehr ___ Frau Weber, …", bi("Anrede, formell", "formal salutation"), ["geehrte"],
    bi("Sehr geehrte Frau …, Sehr geehrter Herr …", "Sehr geehrte Frau …, Sehr geehrter Herr …"), S.schreiben),
  g("a1_g14c", G.brief, "Mit freundlichen ___", bi("formeller Gruß", "formal sign-off"), ["Grüßen"],
    bi("Mit freundlichen Grüßen — Dativ Plural: Grüßen.", "Mit freundlichen Grüßen — dative plural: Grüßen."), S.schreiben),
  g("a1_g14d", G.brief, "Viele ___!", bi("informeller Gruß", "informal sign-off"), ["Grüße"],
    bi("Viele Grüße — Plural: Grüße.", "Viele Grüße — plural: Grüße."), S.schreiben)
];

export const A1_TOPICS: readonly TopicItem[] = [
  {
    id: "a1_t1",
    section: S.kennen,
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
    section: S.familie,
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
    section: S.wohnen,
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
    section: S.zahlen,
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
    section: S.zahlen,
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
    section: S.tag,
    name: bi("Trennbare Verben im Präsens", "Separable verbs in the present"),
    seedStage: 0,
    questions: [
      q("Ich ___ um 7 Uhr auf. (aufstehen)", bi("Verbteil", "the verb part"), ["stehe"], bi("Das Präfix auf- wandert ans Ende.", "The prefix auf- moves to the end.")),
      q("Er ___ die Tür zu. (zumachen)", bi("Verbteil", "the verb part"), ["macht"], bi("zu-machen → macht … zu.", "zu-machen → macht … zu.")),
      q("Wir ___ heute ein. (einkaufen)", bi("Verbteil", "the verb part"), ["kaufen"], bi("ein-kaufen → kaufen … ein.", "ein-kaufen → kaufen … ein.")),
      q("Wann ___ der Zug an? (ankommen)", bi("Verbteil", "the verb part"), ["kommt"], bi("an-kommen → kommt … an.", "an-kommen → kommt … an."))
    ]
  },
  {
    id: "a1_t7",
    section: S.familie,
    name: bi("Possessivartikel im Nominativ", "Possessives in the nominative"),
    seedStage: 0,
    questions: [
      q("Das ist ___ Schwester. (my)", bi("die Schwester", "die Schwester"), ["meine"], bi("feminin → meine.", "feminine → meine.")),
      q("___ Vater ist Arzt. (his)", bi("der Vater", "der Vater"), ["sein"], bi("er → sein; maskulin → keine Endung.", "er → sein; masculine → no ending.")),
      q("___ Kind ist drei. (her)", bi("das Kind", "das Kind"), ["ihr"], bi("sie → ihr; neutrum → keine Endung.", "sie → ihr; neuter → no ending.")),
      q("Sind das ___ Eltern? (your — du)", bi("die Eltern (Plural)", "die Eltern (plural)"), ["deine"], bi("Plural → -e: deine.", "Plural → -e: deine."))
    ]
  },
  {
    id: "a1_t8",
    section: S.essen,
    name: bi("Akkusativ: den und einen", "Accusative: den and einen"),
    seedStage: 0,
    questions: [
      q("Ich nehme ___ Kuchen.", bi("der Kuchen", "der Kuchen"), ["den"], bi("Akkusativ maskulin: der → den.", "Masculine accusative: der → den.")),
      q("Möchtest du ___ Kaffee?", bi("ein — der Kaffee", "a — der Kaffee"), ["einen"], bi("Akkusativ maskulin: ein → einen.", "Masculine accusative: ein → einen.")),
      q("Wir kaufen ___ Brot.", bi("das Brot", "das Brot"), ["das"], bi("Neutrum bleibt: das.", "Neuter stays: das.")),
      q("Er isst ___ Banane.", bi("eine — die Banane", "a — die Banane"), ["eine"], bi("Feminin bleibt: eine.", "Feminine stays: eine."))
    ]
  },
  {
    id: "a1_t9",
    section: S.freizeit,
    name: bi("Modalverben: können & möchten", "Modal verbs: können & möchten"),
    seedStage: 0,
    questions: [
      q("Ich ___ gut kochen. (können)", bi("Modalverb", "modal verb"), ["kann"], bi("ich kann.", "ich kann.")),
      q("___ du ins Kino gehen? (möchten)", bi("Modalverb", "modal verb"), ["möchtest"], bi("du möchtest.", "du möchtest.")),
      q("Wir ___ heute nicht kommen. (können)", bi("Modalverb", "modal verb"), ["können"], bi("wir können — wie der Infinitiv.", "wir können — like the infinitive.")),
      q("Ich möchte ins Kino ___. (gehen)", bi("Infinitiv am Ende", "infinitive at the end"), ["gehen"], bi("Satzklammer: der Infinitiv steht ganz am Ende.", "The bracket: the infinitive goes right at the end."))
    ]
  },
  {
    id: "a1_t10",
    section: S.beruf,
    name: bi("nicht oder kein", "nicht or kein"),
    seedStage: 0,
    questions: [
      q("Ich arbeite heute ___.", bi("verneint das Verb", "negates the verb"), ["nicht"], bi("Verb → nicht, am Ende.", "Verb → nicht, at the end.")),
      q("Er hat ___ Arbeit.", bi("die Arbeit", "die Arbeit"), ["keine"], bi("Nomen ohne Artikel → kein; feminin: keine.", "Noun with no article → kein; feminine: keine.")),
      q("Das ist ___ mein Büro.", bi("mit mein", "with mein"), ["nicht"], bi("Vor mein/der/das → nicht.", "Before mein/der/das → nicht.")),
      q("Wir haben ___ Chef.", bi("der Chef", "der Chef"), ["keinen"], bi("Akkusativ maskulin: keinen.", "Masculine accusative: keinen."))
    ]
  },
  {
    id: "a1_t11",
    section: S.unterwegs,
    name: bi("Imperativ: du, ihr, Sie", "Imperative: du, ihr, Sie"),
    seedStage: 0,
    questions: [
      q("___ den Bus! (nehmen — du)", bi("Imperativ du", "du-imperative"), ["nimm"], bi("e → i bleibt im Imperativ: Nimm!", "The e → i change stays: Nimm!")),
      q("___ rechts! (gehen — ihr)", bi("Imperativ ihr", "ihr-imperative"), ["geht"], bi("ihr-Form ohne ihr: Geht!", "The ihr form without the pronoun: Geht!")),
      q("___ Sie hier aus! (aussteigen — Sie)", bi("Imperativ Sie", "Sie-imperative"), ["steigen"], bi("Steigen Sie … aus! — trennbar bleibt getrennt.", "Steigen Sie … aus! — separable stays split.")),
      q("___ langsam! (fahren — du)", bi("Imperativ du", "du-imperative"), ["fahr", "fahre"], bi("a → ä fällt im Imperativ weg: Fahr!", "The a → ä change is dropped in the imperative: Fahr!"))
    ]
  },
  {
    id: "a1_t12",
    section: S.gesund,
    name: bi("Perfekt: erste Schritte", "Perfect tense: first steps"),
    seedStage: 0,
    questions: [
      q("Ich habe Deutsch ___. (lernen)", bi("Partizip II", "past participle"), ["gelernt"], bi("Regelmäßig: ge- + lern + -t.", "Regular: ge- + lern + -t.")),
      q("Wir haben Fußball ___. (spielen)", bi("Partizip II", "past participle"), ["gespielt"], bi("ge- + spiel + -t.", "ge- + spiel + -t.")),
      q("Er ___ gestern gekommen. (sein)", bi("Hilfsverb", "auxiliary"), ["ist"], bi("kommen = Bewegung → sein.", "kommen = movement → sein.")),
      q("Hast du gut ___? (schlafen)", bi("Partizip II", "past participle"), ["geschlafen"], bi("schlafen → geschlafen, unregelmäßig.", "schlafen → geschlafen, irregular."))
    ]
  },
  {
    id: "a1_t13",
    section: S.wetter,
    name: bi("Wetter & Farben", "Weather & colours"),
    seedStage: 0,
    questions: [
      q("Im Sommer ist es ___. (hot)", bi("Adjektiv", "an adjective"), ["heiß"], bi("heiß — mit ß.", "heiß — with ß.")),
      q("Es ___ heute. (schneien)", bi("Wetterverb", "weather verb"), ["schneit"], bi("es schneit.", "es schneit.")),
      q("Die Hose ist ___. (blue)", bi("Farbe", "a colour"), ["blau"], bi("blau — keine Endung nach sein.", "blau — no ending after sein.")),
      q("Die Jahreszeit nach dem Sommer ist der ___.", bi("Jahreszeit", "a season"), ["Herbst"], bi("Frühling, Sommer, Herbst, Winter.", "Frühling, Sommer, Herbst, Winter."))
    ]
  },
  {
    id: "a1_t14",
    section: S.schreiben,
    name: bi("Anrede und Gruß", "Salutation and sign-off"),
    seedStage: 0,
    questions: [
      q("___ Tom, danke für deine Mail!", bi("Anrede, informell, an einen Mann", "informal salutation to a man"), ["Lieber"], bi("Lieber Tom — maskulin: Lieber.", "Lieber Tom — masculine: Lieber.")),
      q("Sehr ___ Damen und Herren,", bi("Anrede, formell, ohne Namen", "formal salutation, no name"), ["geehrte"], bi("Sehr geehrte Damen und Herren.", "Sehr geehrte Damen und Herren.")),
      q("Bis ___! (see you soon)", bi("Gruß", "a sign-off"), ["bald"], bi("Bis bald!", "Bis bald!")),
      q("Liebe ___ (love, informell)", bi("Gruß", "a sign-off"), ["Grüße"], bi("Liebe Grüße — Plural: Grüße.", "Liebe Grüße — plural: Grüße."))
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
