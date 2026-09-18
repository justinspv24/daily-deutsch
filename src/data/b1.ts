import type { Bilingual, BlankQuestion, GrammarItem, TopicItem, UpcomingTopic, VocabItem } from "../types";

/**
 * The B1 bank: adjective endings, Konjunktiv II, the simple past, relative
 * clauses, the genitive and the conjunctions that shape longer sentences —
 * and, since it follows the B1 syllabus section by section (`b1_s01` …),
 * the passive, the infinitive with zu, connectors, Futur I and the phrases
 * the exam's presentation wants. Every item carries its section.
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
  konj: bi("Konjunktionen", "Conjunctions"),
  passiv: bi("Passiv", "Passive"),
  zu: bi("um … zu, damit, zu", "um … zu, damit, zu"),
  konn: bi("Konnektoren & Meinung", "Connectors & opinion"),
  zeit: bi("Zeitfolge", "Sequence of tenses"),
  zwei: bi("Zweiteilige Konnektoren", "Two-part connectors"),
  da: bi("darauf, worauf & n-Deklination", "darauf, worauf & n-declension"),
  futur: bi("Futur I", "Futur I"),
  gef: bi("lassen, Adjektive & Verben mit Präposition", "lassen, adjectives & verbs with prepositions"),
  red: bi("Redemittel Präsentation", "Presentation phrases")
} satisfies Record<string, Bilingual>;

/* The sections of the B1 syllabus, by number. */
const S = {
  arbeit: "b1_s01",
  wohnen: "b1_s02",
  gesund: "b1_s03",
  bildung: "b1_s04",
  medien: "b1_s05",
  reisen: "b1_s06",
  umwelt: "b1_s07",
  gesellschaft: "b1_s08",
  konsum: "b1_s09",
  feste: "b1_s10",
  gefuehle: "b1_s11",
  pruefung: "b1_s12"
} as const;

export const B1_VOCAB: readonly VocabItem[] = [
  /* --------------------------------------------------- the original twelve */
  v("b1_v_erfahrung", "noun", "Erfahrung", "die", ["experience"], ["die Erfahrungen", "Erfahrungen"],
    bi("-ung ist immer feminin, Plural -en.", "-ung is always feminine, plural -en."), S.arbeit),
  v("b1_v_entscheidung", "noun", "Entscheidung", "die", ["decision"], ["die Entscheidungen", "Entscheidungen"],
    bi("Von entscheiden. -ung → die.", "From entscheiden. -ung → die."), S.gesellschaft),
  v("b1_v_vorschlag", "noun", "Vorschlag", "der", ["suggestion", "proposal"], ["die Vorschläge", "Vorschläge"],
    bi("Umlaut + -e: die Vorschläge.", "Umlaut plus -e: die Vorschläge."), S.wohnen),
  v("b1_v_gespraech", "noun", "Gespräch", "das", ["conversation", "talk"], ["die Gespräche", "Gespräche"],
    bi("Ge- + Stamm → oft Neutrum: das Gespräch.", "Ge- + stem → often neuter: das Gespräch."), S.arbeit),
  v("b1_v_vertrag", "noun", "Vertrag", "der", ["contract"], ["die Verträge", "Verträge"],
    bi("Umlaut + -e: die Verträge.", "Umlaut plus -e: die Verträge."), S.konsum),
  v("b1_v_gesetz", "noun", "Gesetz", "das", ["law"], ["die Gesetze", "Gesetze"],
    bi("das Gesetz — Plural -e.", "das Gesetz — plural -e."), S.gesellschaft),
  v("b1_v_meinung", "noun", "Meinung", "die", ["opinion"], ["die Meinungen", "Meinungen"],
    bi("meiner Meinung nach — feste Wendung mit Dativ.", "meiner Meinung nach — a fixed phrase in the dative."), S.medien),
  v("b1_v_empfehlen", "verb", "empfehlen", "haben", ["to recommend", "recommend"], ["empfohlen"],
    bi("Untrennbar → kein ge-: empfohlen.", "Inseparable → no ge-: empfohlen."), S.gesund),
  v("b1_v_verschwinden", "verb", "verschwinden", "sein", ["to disappear", "disappear", "vanish"], ["verschwunden"],
    bi("Zustandswechsel → sein: ist verschwunden.", "Change of state → sein: ist verschwunden."), S.umwelt),
  v("b1_v_entscheiden", "verb", "entscheiden", "haben", ["to decide", "decide"], ["entschieden"],
    bi("ei → ie: entschieden, ohne ge-.", "ei → ie: entschieden, no ge-."), S.gesellschaft),
  v("b1_v_gelingen", "verb", "gelingen", "sein", ["to succeed", "succeed", "to turn out well"], ["gelungen"],
    bi("Es ist mir gelungen — mit sein und Dativ.", "Es ist mir gelungen — with sein and the dative."), S.bildung),
  v("b1_v_wachsen", "verb", "wachsen", "sein", ["to grow", "grow"], ["gewachsen"],
    bi("Veränderung → sein: ist gewachsen.", "Change → sein: ist gewachsen."), S.umwelt),

  /* ------------------------------------------------ s01 Arbeit & Bewerbung */
  v("b1_v_anschreiben", "noun", "Anschreiben", "das", ["cover letter"], ["die Anschreiben", "Anschreiben"],
    bi("Substantivierter Infinitiv → neutrum, Plural unverändert.", "A nominalised infinitive → neuter, plural unchanged."), S.arbeit),
  v("b1_v_staerke", "noun", "Stärke", "die", ["strength"], ["die Stärken", "Stärken"],
    bi("-e → feminin, Plural -n. Stärken und Schwächen.", "-e → feminine, plural -n. Stärken und Schwächen."), S.arbeit),
  v("b1_v_schwaeche", "noun", "Schwäche", "die", ["weakness"], ["die Schwächen", "Schwächen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.arbeit),
  v("b1_v_faehigkeit", "noun", "Fähigkeit", "die", ["skill", "ability"], ["die Fähigkeiten", "Fähigkeiten"],
    bi("-keit → feminin, Plural -en.", "-keit → feminine, plural -en."), S.arbeit),
  v("b1_v_probezeit", "noun", "Probezeit", "die", ["probation period"], ["die Probezeiten", "Probezeiten"],
    bi("die Zeit → die Zeiten.", "die Zeit → die Zeiten."), S.arbeit),
  v("b1_v_bewerben", "verb", "sich bewerben", "haben", ["to apply", "apply"], ["beworben"],
    bi("Reflexiv + um: Ich bewerbe mich um die Stelle. e → o: beworben.", "Reflexive + um: Ich bewerbe mich um die Stelle. e → o: beworben."), S.arbeit),
  v("b1_v_einstellen", "verb", "einstellen", "haben", ["to hire", "to employ", "hire"], ["eingestellt"],
    bi("Trennbar: ein-ge-stellt. Gegenteil: entlassen.", "Separable: ein-ge-stellt. Opposite: entlassen."), S.arbeit),

  /* ------------------------------------------------ s02 Wohnen & Zusammenleben */
  v("b1_v_mitbewohner", "noun", "Mitbewohner", "der", ["flatmate", "roommate"], ["die Mitbewohner", "Mitbewohner"],
    bi("-er → maskulin, Plural unverändert. Die Mitbewohnerin.", "-er → masculine, plural unchanged. Die Mitbewohnerin."), S.wohnen),
  v("b1_v_hausordnung", "noun", "Hausordnung", "die", ["house rules"], ["die Hausordnungen", "Hausordnungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.wohnen),
  v("b1_v_kompromiss", "noun", "Kompromiss", "der", ["compromise"], ["die Kompromisse", "Kompromisse"],
    bi("Maskulin, Plural -e. Einen Kompromiss finden.", "Masculine, plural -e. Einen Kompromiss finden."), S.wohnen),
  v("b1_v_beschwerde", "noun", "Beschwerde", "die", ["complaint"], ["die Beschwerden", "Beschwerden"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.wohnen),
  v("b1_v_beschweren", "verb", "sich beschweren", "haben", ["to complain", "complain"], ["beschwert"],
    bi("Reflexiv + über: Ich beschwere mich über den Lärm. be- → kein ge-.", "Reflexive + über: Ich beschwere mich über den Lärm. be- → no ge-."), S.wohnen),
  v("b1_v_einigen", "verb", "sich einigen", "haben", ["to come to an agreement", "to agree", "agree"], ["geeinigt"],
    bi("Reflexiv + auf: Wir haben uns auf einen Termin geeinigt.", "Reflexive + auf: Wir haben uns auf einen Termin geeinigt."), S.wohnen),
  v("b1_v_renovieren", "verb", "renovieren", "haben", ["to renovate", "to redecorate", "renovate"], ["renoviert"],
    bi("-ieren → kein ge-: renoviert.", "-ieren → no ge-: renoviert."), S.wohnen),

  /* ------------------------------------------------ s03 Gesundheit */
  v("b1_v_untersuchung", "noun", "Untersuchung", "die", ["examination", "check-up"], ["die Untersuchungen", "Untersuchungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.gesund),
  v("b1_v_behandlung", "noun", "Behandlung", "die", ["treatment"], ["die Behandlungen", "Behandlungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.gesund),
  v("b1_v_symptom", "noun", "Symptom", "das", ["symptom"], ["die Symptome", "Symptome"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.gesund),
  v("b1_v_impfung", "noun", "Impfung", "die", ["vaccination"], ["die Impfungen", "Impfungen"],
    bi("-ung → feminin. Verb: impfen.", "-ung → feminine. Verb: impfen."), S.gesund),
  v("b1_v_entspannen", "verb", "sich entspannen", "haben", ["to relax", "relax"], ["entspannt"],
    bi("Reflexiv, ent- untrennbar: Ich habe mich entspannt.", "Reflexive, ent- inseparable: Ich habe mich entspannt."), S.gesund),
  v("b1_v_verzichten", "verb", "verzichten", "haben", ["to do without", "to give up", "to forgo"], ["verzichtet"],
    bi("verzichten auf + Akkusativ. ver- → kein ge-.", "verzichten auf + accusative. ver- → no ge-."), S.gesund),
  v("b1_v_untersuchen", "verb", "untersuchen", "haben", ["to examine", "examine"], ["untersucht"],
    bi("Hier ist unter- untrennbar: untersucht, kein ge-.", "Here unter- is inseparable: untersucht, no ge-."), S.gesund),

  /* ------------------------------------------------ s04 Bildung */
  v("b1_v_abschluss", "noun", "Abschluss", "der", ["qualification", "degree", "school-leaving certificate"], ["die Abschlüsse", "Abschlüsse"],
    bi("Umlaut + -e: die Abschlüsse.", "Umlaut plus -e: die Abschlüsse."), S.bildung),
  v("b1_v_fach", "noun", "Fach", "das", ["subject", "field"], ["die Fächer", "Fächer"],
    bi("Umlaut + -er: die Fächer.", "Umlaut plus -er: die Fächer."), S.bildung),
  v("b1_v_note", "noun", "Note", "die", ["grade", "mark"], ["die Noten", "Noten"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.bildung),
  v("b1_v_ziel", "noun", "Ziel", "das", ["goal", "aim", "target"], ["die Ziele", "Ziele"],
    bi("Neutrum, Plural -e. Sich ein Ziel setzen.", "Neuter, plural -e. Sich ein Ziel setzen."), S.bildung),
  v("b1_v_absicht", "noun", "Absicht", "die", ["intention"], ["die Absichten", "Absichten"],
    bi("Feminin, Plural -en. Mit Absicht = absichtlich.", "Feminine, plural -en. Mit Absicht = on purpose."), S.bildung),
  v("b1_v_stipendium", "noun", "Stipendium", "das", ["scholarship", "grant"], ["die Stipendien", "Stipendien"],
    bi("-ium → neutrum, Plural -ien.", "-ium → neuter, plural -ien."), S.bildung),
  v("b1_v_bestehen", "verb", "bestehen", "haben", ["to pass (an exam)", "to exist", "pass"], ["bestanden"],
    bi("be- → kein ge-: bestanden. Die Prüfung bestehen.", "be- → no ge-: bestanden. Die Prüfung bestehen."), S.bildung),
  v("b1_v_vorhaben", "verb", "vorhaben", "haben", ["to intend", "to plan", "intend"], ["vorgehabt"],
    bi("Trennbar: vor-ge-habt. Ich habe vor, … zu …", "Separable: vor-ge-habt. Ich habe vor, … zu …"), S.bildung),

  /* ------------------------------------------------ s05 Medien */
  v("b1_v_quelle", "noun", "Quelle", "die", ["source"], ["die Quellen", "Quellen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.medien),
  v("b1_v_werbung", "noun", "Werbung", "die", ["advertising", "advertisement"], ["die Werbungen", "Werbungen"],
    bi("-ung → feminin, Plural -en (meist Singular).", "-ung → feminine, plural -en (mostly singular)."), S.medien),
  v("b1_v_argument", "noun", "Argument", "das", ["argument"], ["die Argumente", "Argumente"],
    bi("-ment → neutrum, Plural -e.", "-ment → neuter, plural -e."), S.medien),
  v("b1_v_vorteil", "noun", "Vorteil", "der", ["advantage"], ["die Vorteile", "Vorteile"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.medien),
  v("b1_v_nachteil", "noun", "Nachteil", "der", ["disadvantage"], ["die Nachteile", "Nachteile"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.medien),
  v("b1_v_zustimmen", "verb", "zustimmen", "haben", ["to agree", "agree"], ["zugestimmt"],
    bi("Trennbar + Dativ: Ich stimme dir zu.", "Separable + dative: Ich stimme dir zu."), S.medien),
  v("b1_v_widersprechen", "verb", "widersprechen", "haben", ["to contradict", "to disagree", "contradict"], ["widersprochen"],
    bi("wider- untrennbar, + Dativ: Ich widerspreche dir.", "wider- inseparable, + dative: Ich widerspreche dir."), S.medien),

  /* ------------------------------------------------ s06 Reisen & Mobilität */
  v("b1_v_verkehrsmittel", "noun", "Verkehrsmittel", "das", ["means of transport"], ["die Verkehrsmittel", "Verkehrsmittel"],
    bi("das Mittel → die Mittel: Plural unverändert.", "das Mittel → die Mittel: plural unchanged."), S.reisen),
  v("b1_v_unterkunft", "noun", "Unterkunft", "die", ["accommodation"], ["die Unterkünfte", "Unterkünfte"],
    bi("Umlaut + -e: die Unterkünfte.", "Umlaut plus -e: die Unterkünfte."), S.reisen),
  v("b1_v_anschluss", "noun", "Anschluss", "der", ["connection"], ["die Anschlüsse", "Anschlüsse"],
    bi("Umlaut + -e. Den Anschluss verpassen.", "Umlaut plus -e. Den Anschluss verpassen."), S.reisen),
  v("b1_v_erstattung", "noun", "Erstattung", "die", ["refund"], ["die Erstattungen", "Erstattungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.reisen),
  v("b1_v_landschaft", "noun", "Landschaft", "die", ["landscape", "scenery"], ["die Landschaften", "Landschaften"],
    bi("-schaft → feminin, Plural -en.", "-schaft → feminine, plural -en."), S.reisen),
  v("b1_v_umbuchen", "verb", "umbuchen", "haben", ["to rebook", "rebook"], ["umgebucht"],
    bi("Trennbar: um-ge-bucht.", "Separable: um-ge-bucht."), S.reisen),
  v("b1_v_verpassen", "verb", "verpassen", "haben", ["to miss (a train)", "miss"], ["verpasst"],
    bi("ver- → kein ge-: verpasst.", "ver- → no ge-: verpasst."), S.reisen),
  v("b1_v_verlaufen", "verb", "sich verlaufen", "haben", ["to get lost (on foot)", "get lost"], ["verlaufen"],
    bi("Reflexiv. Partizip = Infinitiv. Mit dem Auto: sich verfahren.", "Reflexive. Participle = infinitive. In a car: sich verfahren."), S.reisen),

  /* ------------------------------------------------ s07 Umwelt */
  v("b1_v_abfall", "noun", "Abfall", "der", ["waste", "rubbish"], ["die Abfälle", "Abfälle"],
    bi("Umlaut + -e: die Abfälle.", "Umlaut plus -e: die Abfälle."), S.umwelt),
  v("b1_v_verpackung", "noun", "Verpackung", "die", ["packaging"], ["die Verpackungen", "Verpackungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.umwelt),
  v("b1_v_folge", "noun", "Folge", "die", ["consequence"], ["die Folgen", "Folgen"],
    bi("-e → feminin, Plural -n. Die Folgen des Klimawandels.", "-e → feminine, plural -n. Die Folgen des Klimawandels."), S.umwelt),
  v("b1_v_ursache", "noun", "Ursache", "die", ["cause"], ["die Ursachen", "Ursachen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.umwelt),
  v("b1_v_wald", "noun", "Wald", "der", ["forest", "wood"], ["die Wälder", "Wälder"],
    bi("Umlaut + -er: die Wälder.", "Umlaut plus -er: die Wälder."), S.umwelt),
  v("b1_v_kueste", "noun", "Küste", "die", ["coast"], ["die Küsten", "Küsten"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.umwelt),
  v("b1_v_schuetzen", "verb", "schützen", "haben", ["to protect", "protect"], ["geschützt"],
    bi("Regelmäßig: geschützt. schützen vor + Dativ.", "Regular: geschützt. schützen vor + dative."), S.umwelt),
  v("b1_v_verursachen", "verb", "verursachen", "haben", ["to cause", "cause"], ["verursacht"],
    bi("ver- → kein ge-: verursacht.", "ver- → no ge-: verursacht."), S.umwelt),
  v("b1_v_aussterben", "verb", "aussterben", "sein", ["to die out", "to become extinct", "die out"], ["ausgestorben"],
    bi("Zustandswechsel → sein. Trennbar: aus-ge-storben.", "Change of state → sein. Separable: aus-ge-storben."), S.umwelt),

  /* ------------------------------------------------ s08 Gesellschaft */
  v("b1_v_gesellschaft", "noun", "Gesellschaft", "die", ["society"], ["die Gesellschaften", "Gesellschaften"],
    bi("-schaft → feminin, Plural -en.", "-schaft → feminine, plural -en."), S.gesellschaft),
  v("b1_v_ehrenamt", "noun", "Ehrenamt", "das", ["volunteer work", "honorary post"], ["die Ehrenämter", "Ehrenämter"],
    bi("das Amt → die Ämter: Umlaut + -er.", "das Amt → die Ämter: umlaut plus -er."), S.gesellschaft),
  v("b1_v_vorurteil", "noun", "Vorurteil", "das", ["prejudice"], ["die Vorurteile", "Vorurteile"],
    bi("das Urteil → die Urteile: Plural -e.", "das Urteil → die Urteile: plural -e."), S.gesellschaft),
  v("b1_v_verantwortung", "noun", "Verantwortung", "die", ["responsibility"], ["die Verantwortungen", "Verantwortungen"],
    bi("-ung → feminin. Verantwortung übernehmen.", "-ung → feminine. Verantwortung übernehmen."), S.gesellschaft),
  v("b1_v_pflicht", "noun", "Pflicht", "die", ["duty", "obligation"], ["die Pflichten", "Pflichten"],
    bi("Feminin, Plural -en. Rechte und Pflichten.", "Feminine, plural -en. Rechte und Pflichten."), S.gesellschaft),
  v("b1_v_engagieren", "verb", "sich engagieren", "haben", ["to get involved", "to volunteer", "get involved"], ["engagiert"],
    bi("Reflexiv + für. -ieren → kein ge-. Ausgesprochen wie im Französischen.", "Reflexive + für. -ieren → no ge-. Pronounced as in French."), S.gesellschaft),
  v("b1_v_integrieren", "verb", "sich integrieren", "haben", ["to integrate", "integrate"], ["integriert"],
    bi("Reflexiv. -ieren → kein ge-: integriert.", "Reflexive. -ieren → no ge-: integriert."), S.gesellschaft),

  /* ------------------------------------------------ s09 Konsum, Geld & Verträge */
  v("b1_v_kuendigung", "noun", "Kündigung", "die", ["cancellation", "notice", "termination"], ["die Kündigungen", "Kündigungen"],
    bi("-ung → feminin. Die Kündigungsfrist.", "-ung → feminine. Die Kündigungsfrist."), S.konsum),
  v("b1_v_gebuehr", "noun", "Gebühr", "die", ["fee", "charge"], ["die Gebühren", "Gebühren"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.konsum),
  v("b1_v_rechnung", "noun", "Rechnung", "die", ["invoice", "bill"], ["die Rechnungen", "Rechnungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.konsum),
  v("b1_v_konto", "noun", "Konto", "das", ["account", "bank account"], ["die Konten", "Konten"],
    bi("Neutrum; Plural -en: die Konten (nicht Kontos).", "Neuter; plural -en: die Konten (not Kontos)."), S.konsum),
  v("b1_v_kunde", "noun", "Kunde", "der", ["customer", "client"], ["die Kunden", "Kunden"],
    bi("Maskulin auf -e: n-Deklination — den/dem/des Kunden.", "Masculine in -e: n-declension — den/dem/des Kunden."), S.konsum),
  v("b1_v_versicherung", "noun", "Versicherung", "die", ["insurance"], ["die Versicherungen", "Versicherungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.konsum),
  v("b1_v_ueberweisen", "verb", "überweisen", "haben", ["to transfer (money)", "transfer"], ["überwiesen"],
    bi("Hier ist über- untrennbar: überwiesen, kein ge-.", "Here über- is inseparable: überwiesen, no ge-."), S.konsum),
  v("b1_v_sparen", "verb", "sparen", "haben", ["to save (money)", "save"], ["gespart"],
    bi("Regelmäßig: gespart. sparen für + Akkusativ.", "Regular: gespart. sparen für + accusative."), S.konsum),

  /* ------------------------------------------------ s10 Feste & Traditionen */
  v("b1_v_brauch", "noun", "Brauch", "der", ["custom", "tradition"], ["die Bräuche", "Bräuche"],
    bi("Umlaut + -e: die Bräuche.", "Umlaut plus -e: die Bräuche."), S.feste),
  v("b1_v_feiertag", "noun", "Feiertag", "der", ["public holiday"], ["die Feiertage", "Feiertage"],
    bi("der Tag → die Tage.", "der Tag → die Tage."), S.feste),
  v("b1_v_weihnachtsmarkt", "noun", "Weihnachtsmarkt", "der", ["Christmas market"], ["die Weihnachtsmärkte", "Weihnachtsmärkte"],
    bi("der Markt → die Märkte.", "der Markt → die Märkte."), S.feste),
  v("b1_v_vorsatz", "noun", "Vorsatz", "der", ["resolution", "intention"], ["die Vorsätze", "Vorsätze"],
    bi("Umlaut + -e. Gute Vorsätze fürs neue Jahr.", "Umlaut plus -e. Gute Vorsätze fürs neue Jahr."), S.feste),
  v("b1_v_heimat", "noun", "Heimat", "die", ["home", "homeland"], ["die Heimaten", "Heimaten"],
    bi("Feminin; Plural selten.", "Feminine; plural rare."), S.feste),
  v("b1_v_stimmung", "noun", "Stimmung", "die", ["mood", "atmosphere"], ["die Stimmungen", "Stimmungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.feste),
  v("b1_v_stattfinden", "verb", "stattfinden", "haben", ["to take place", "take place"], ["stattgefunden"],
    bi("Trennbar: statt-ge-funden. Das Fest findet statt.", "Separable: statt-ge-funden. Das Fest findet statt."), S.feste),
  v("b1_v_planen", "verb", "planen", "haben", ["to plan", "plan"], ["geplant"],
    bi("Regelmäßig: geplant.", "Regular: geplant."), S.feste),

  /* ------------------------------------------------ s11 Gefühle & Persönlichkeit */
  v("b1_v_persoenlichkeit", "noun", "Persönlichkeit", "die", ["personality"], ["die Persönlichkeiten", "Persönlichkeiten"],
    bi("-keit → feminin, Plural -en.", "-keit → feminine, plural -en."), S.gefuehle),
  v("b1_v_freundschaft", "noun", "Freundschaft", "die", ["friendship"], ["die Freundschaften", "Freundschaften"],
    bi("-schaft → feminin, Plural -en.", "-schaft → feminine, plural -en."), S.gefuehle),
  v("b1_v_enttaeuschung", "noun", "Enttäuschung", "die", ["disappointment"], ["die Enttäuschungen", "Enttäuschungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.gefuehle),
  v("b1_v_sorge", "noun", "Sorge", "die", ["worry", "concern"], ["die Sorgen", "Sorgen"],
    bi("-e → feminin. Sich Sorgen machen um.", "-e → feminine. Sich Sorgen machen um."), S.gefuehle),
  v("b1_v_gefuehl", "noun", "Gefühl", "das", ["feeling", "emotion"], ["die Gefühle", "Gefühle"],
    bi("Ge- … → neutrum, Plural -e.", "Ge- … → neuter, plural -e."), S.gefuehle),
  v("b1_v_vertrauen", "verb", "vertrauen", "haben", ["to trust", "trust"], ["vertraut"],
    bi("ver- → kein ge-. Mit Dativ: Ich vertraue dir.", "ver- → no ge-. Takes the dative: Ich vertraue dir."), S.gefuehle),
  v("b1_v_verstehen_sich", "verb", "sich verstehen", "haben", ["to get on (with someone)", "to get along", "get on"], ["verstanden"],
    bi("Reflexiv + mit: Ich verstehe mich gut mit ihr.", "Reflexive + mit: Ich verstehe mich gut mit ihr."), S.gefuehle),

  /* ------------------------------------------------ s12 Prüfung */
  v("b1_v_forumsbeitrag", "noun", "Forumsbeitrag", "der", ["forum post"], ["die Forumsbeiträge", "Forumsbeiträge"],
    bi("der Beitrag → die Beiträge: Umlaut + -e.", "der Beitrag → die Beiträge: umlaut plus -e."), S.pruefung),
  v("b1_v_praesentation", "noun", "Präsentation", "die", ["presentation"], ["die Präsentationen", "Präsentationen"],
    bi("-ion → feminin, Plural -en.", "-ion → feminine, plural -en."), S.pruefung),
  v("b1_v_thema", "noun", "Thema", "das", ["topic", "subject", "theme"], ["die Themen", "Themen"],
    bi("Neutrum; Plural -en: die Themen.", "Neuter; plural -en: die Themen."), S.pruefung),
  v("b1_v_folie", "noun", "Folie", "die", ["slide"], ["die Folien", "Folien"],
    bi("-ie → feminin, Plural -n.", "-ie → feminine, plural -n."), S.pruefung),
  v("b1_v_stichwort", "noun", "Stichwort", "das", ["keyword", "cue"], ["die Stichwörter", "Stichwörter"],
    bi("das Wort → die Wörter (einzelne Wörter).", "das Wort → die Wörter (individual words)."), S.pruefung),
  v("b1_v_zusammenfassung", "noun", "Zusammenfassung", "die", ["summary"], ["die Zusammenfassungen", "Zusammenfassungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.pruefung),
  v("b1_v_praesentieren", "verb", "präsentieren", "haben", ["to present", "present"], ["präsentiert"],
    bi("-ieren → kein ge-: präsentiert.", "-ieren → no ge-: präsentiert."), S.pruefung),
  v("b1_v_zusammenfassen", "verb", "zusammenfassen", "haben", ["to summarise", "summarize"], ["zusammengefasst"],
    bi("Trennbar: zusammen-ge-fasst.", "Separable: zusammen-ge-fasst."), S.pruefung)
];

export const B1_GRAMMAR: readonly GrammarItem[] = [
  /* ------------------------------------------------------ adjective endings */
  g("b1_g1a", G.adj, "Das ist ein ___ Hund. (groß)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["großer"],
    bi("Nominativ maskulin nach ein: -er zeigt das Genus.", "Masculine nominative after ein: -er shows the gender."), S.umwelt),
  g("b1_g1b", G.adj, "Ich sehe den ___ Hund. (groß)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["großen"],
    bi("Akkusativ maskulin nach den: -en.", "Masculine accusative after den: -en."), S.umwelt),
  g("b1_g1c", G.adj, "Sie trägt eine ___ Jacke. (rot)", bi("<code>die Jacke</code>", "<code>die Jacke</code>"), ["rote"],
    bi("Feminin nach eine: -e, im Nominativ und Akkusativ.", "Feminine after eine: -e, in the nominative and accusative."), S.umwelt),
  g("b1_g1d", G.adj, "Wir wohnen in einem ___ Haus. (alt)", bi("<code>das Haus</code>", "<code>das Haus</code>"), ["alten"],
    bi("Dativ: nach einem immer -en.", "Dative: after einem it is always -en."), S.umwelt),
  g("b1_g1e", G.adj, "Der ___ Mann lacht. (alt)", bi("<code>der Mann</code>", "<code>der Mann</code>"), ["alte"],
    bi("Nominativ nach der: -e, der Artikel zeigt schon alles.", "Nominative after der: -e, the article already does the work."), S.umwelt),
  g("b1_g1f", G.adj, "Ich kaufe das ___ Auto. (neu)", bi("<code>das Auto</code>", "<code>das Auto</code>"), ["neue"],
    bi("Neutrum nach das: -e.", "Neuter after das: -e."), S.umwelt),

  /* --------------------------------------------------------- Konjunktiv II */
  g("b1_g2a", G.konj2, "Wenn ich Zeit ___, würde ich reisen. (haben)", bi("Konjunktiv II", "Konjunktiv II"), ["hätte"],
    bi("haben → hätte: Präteritum + Umlaut.", "haben → hätte: simple past plus umlaut."), S.arbeit),
  g("b1_g2b", G.konj2, "Das ___ schön! (sein)", bi("Konjunktiv II", "Konjunktiv II"), ["wäre"],
    bi("sein → wäre.", "sein → wäre."), S.arbeit),
  g("b1_g2c", G.konj2, "___ du mir helfen? (können — höflich)", bi("Konjunktiv II", "Konjunktiv II"), ["könntest"],
    bi("können → könnte; du → könntest.", "können → könnte; du → könntest."), S.arbeit),
  g("b1_g2d", G.konj2, "Ich ___ lieber zu Hause bleiben. (würde-Form)", bi("Konjunktiv II", "Konjunktiv II"), ["würde"],
    bi("würde + Infinitiv ersetzt den Konjunktiv der meisten Verben.", "würde + infinitive replaces the Konjunktiv of most verbs."), S.arbeit),
  g("b1_g2e", G.konj2, "Wenn er reich ___, würde er ein Haus kaufen. (sein)", bi("Konjunktiv II", "Konjunktiv II"), ["wäre"],
    bi("Irreale Bedingung: wenn + wäre.", "Unreal condition: wenn + wäre."), S.arbeit),
  g("b1_g2f", G.konj2, "Wir ___ gern mehr Zeit. (haben)", bi("Konjunktiv II", "Konjunktiv II"), ["hätten"],
    bi("wir → hätten.", "wir → hätten."), S.arbeit),

  /* ------------------------------------------------------------ simple past */
  g("b1_g3a", G.praet, "Gestern ___ ich krank. (sein)", bi("Präteritum", "simple past"), ["war"],
    bi("sein → war.", "sein → war."), S.reisen),
  g("b1_g3b", G.praet, "Wir ___ keine Zeit. (haben)", bi("Präteritum", "simple past"), ["hatten"],
    bi("haben → hatten.", "haben → hatten."), S.reisen),
  g("b1_g3c", G.praet, "Er ___ nach Hause. (gehen)", bi("Präteritum", "simple past"), ["ging"],
    bi("gehen → ging, unregelmäßig.", "gehen → ging, irregular."), S.reisen),
  g("b1_g3d", G.praet, "Sie ___ ein Buch. (lesen — she)", bi("Präteritum", "simple past"), ["las"],
    bi("lesen → las.", "lesen → las."), S.reisen),
  g("b1_g3e", G.praet, "Ich ___ nicht schlafen. (können)", bi("Präteritum", "simple past"), ["konnte"],
    bi("können → konnte, ohne Umlaut.", "können → konnte, without the umlaut."), S.reisen),
  g("b1_g3f", G.praet, "Ihr ___ in Berlin. (sein)", bi("Präteritum", "simple past"), ["wart"],
    bi("ihr → wart.", "ihr → wart."), S.reisen),

  /* ------------------------------------------------------- relative clauses */
  g("b1_g4a", G.rel, "Der Mann, ___ dort steht, ist mein Lehrer.", bi("<code>der Mann</code>", "<code>der Mann</code>"), ["der"],
    bi("Er steht → Subjekt → Nominativ: der.", "He is standing → subject → nominative: der."), S.wohnen),
  g("b1_g4b", G.rel, "Die Frau, ___ ich helfe, ist nett.", bi("<code>die Frau</code>", "<code>die Frau</code>"), ["der"],
    bi("helfen + Dativ: die → der.", "helfen + dative: die → der."), S.wohnen),
  g("b1_g4c", G.rel, "Das Buch, ___ ich lese, ist spannend.", bi("<code>das Buch</code>", "<code>das Buch</code>"), ["das"],
    bi("Ich lese es → Akkusativ Neutrum: das.", "I read it → neuter accusative: das."), S.wohnen),
  g("b1_g4d", G.rel, "Der Freund, ___ ich anrufe, wohnt in Köln.", bi("<code>der Freund</code>", "<code>der Freund</code>"), ["den"],
    bi("anrufen + Akkusativ: der → den.", "anrufen + accusative: der → den."), S.wohnen),
  g("b1_g4e", G.rel, "Die Kinder, ___ hier spielen, sind laut.", bi("<code>die Kinder</code> (Plural)", "<code>die Kinder</code> (plural)"), ["die"],
    bi("Sie spielen → Nominativ Plural: die.", "They are playing → nominative plural: die."), S.wohnen),
  g("b1_g4f", G.rel, "Der Hund, mit ___ er spazieren geht, ist alt.", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["dem"],
    bi("mit + Dativ: dem.", "mit + dative: dem."), S.wohnen),

  /* --------------------------------------------------------------- genitive */
  g("b1_g5a", G.gen, "Das Auto ___ Frau ist neu.", bi("<code>die Frau</code>", "<code>die Frau</code>"), ["der"],
    bi("Genitiv feminin: der Frau.", "Feminine genitive: der Frau."), S.umwelt),
  g("b1_g5b", G.gen, "Die Farbe ___ Autos gefällt mir.", bi("<code>das Auto</code>", "<code>das Auto</code>"), ["des"],
    bi("Genitiv Neutrum: des Autos — mit -s am Nomen.", "Neuter genitive: des Autos — the noun takes -s."), S.umwelt),
  g("b1_g5c", G.gen, "Trotz ___ Regens gehen wir raus.", bi("<code>der Regen</code>", "<code>der Regen</code>"), ["des"],
    bi("trotz + Genitiv: des Regens.", "trotz + genitive: des Regens."), S.umwelt),
  g("b1_g5d", G.gen, "Während ___ Pause esse ich.", bi("<code>die Pause</code>", "<code>die Pause</code>"), ["der"],
    bi("während + Genitiv, feminin: der.", "während + genitive, feminine: der."), S.umwelt),
  g("b1_g5e", G.gen, "Wegen ___ Wetters bleiben wir zu Hause.", bi("<code>das Wetter</code>", "<code>das Wetter</code>"), ["des"],
    bi("wegen + Genitiv: des Wetters.", "wegen + genitive: des Wetters."), S.umwelt),
  g("b1_g5f", G.gen, "Das Haus ___ Eltern ist groß.", bi("<code>die Eltern</code> (Plural)", "<code>die Eltern</code> (plural)"), ["der"],
    bi("Genitiv Plural: der Eltern.", "Genitive plural: der Eltern."), S.umwelt),

  /* ----------------------------------------------------------- conjunctions */
  g("b1_g6a", G.konj, "Ich lerne Deutsch, ___ ich in Deutschland arbeite.", bi("because", "because"), ["weil"],
    bi("weil — Grund, Verb ans Ende.", "weil — reason, verb to the end."), S.gesellschaft),
  g("b1_g6b", G.konj, "Ich weiß, ___ du recht hast.", bi("that", "that"), ["dass"],
    bi("dass mit ss — die Konjunktion, nicht der Artikel das.", "dass with ss — the conjunction, not the article das."), S.gesellschaft),
  g("b1_g6c", G.konj, "___ es regnet, gehen wir spazieren.", bi("although", "although"), ["obwohl"],
    bi("obwohl — Gegensatz, Nebensatz zuerst, dann das Verb.", "obwohl — contrast; clause first, then the verb."), S.gesellschaft),
  g("b1_g6d", G.konj, "Ruf mich an, ___ du ankommst.", bi("when — in the future", "when — in the future"), ["wenn"],
    bi("wenn für Zukunft und Wiederholung; als nur für Einmaliges in der Vergangenheit.", "wenn for the future and repetition; als only for a single past event."), S.reisen),
  g("b1_g6e", G.konj, "Ich warte, ___ du kommst.", bi("until", "until"), ["bis"],
    bi("bis — Endpunkt.", "bis — end point."), S.reisen),
  g("b1_g6f", G.konj, "Ich habe gelernt, ___ ich schlafen ging.", bi("before", "before"), ["bevor"],
    bi("bevor — die Reihenfolge.", "bevor — sequence."), S.reisen),

  /* ---------------------------------------------------------------- passive */
  g("b1_g7a", G.passiv, "Der Patient ___ gestern operiert. (Präteritum Passiv)", bi("werden im Präteritum", "werden in the simple past"), ["wurde"],
    bi("Präteritum Passiv: wurde + Partizip II.", "Simple-past passive: wurde + past participle."), S.gesund),
  g("b1_g7b", G.passiv, "Die Tabletten müssen zweimal täglich genommen ___.", bi("Passiv mit Modalverb", "passive with a modal"), ["werden"],
    bi("Modalverb + Partizip II + werden am Ende.", "Modal + past participle + werden at the end."), S.gesund),
  g("b1_g7c", G.passiv, "Das Rezept wird ___ Arzt ausgestellt. (by the)", bi("von + dem", "von + dem"), ["vom"],
    bi("Der Handelnde im Passiv: von + Dativ → vom Arzt.", "The agent in the passive: von + dative → vom Arzt."), S.gesund),

  /* ---------------------------------------------------- um … zu, damit, zu */
  g("b1_g8a", G.zu, "Ich lerne, ___ die Prüfung zu bestehen. (in order to)", bi("Finalsatz, gleiches Subjekt", "purpose clause, same subject"), ["um"],
    bi("Gleiches Subjekt → um … zu + Infinitiv.", "Same subject → um … zu + infinitive."), S.bildung),
  g("b1_g8b", G.zu, "Ich lerne, ___ meine Kinder stolz sind. (so that)", bi("Finalsatz, anderes Subjekt", "purpose clause, different subject"), ["damit"],
    bi("Anderes Subjekt → damit + Nebensatz.", "Different subject → damit + subordinate clause."), S.bildung),
  g("b1_g8c", G.zu, "Du brauchst nicht ___ kommen.", bi("brauchen + nicht", "brauchen + nicht"), ["zu"],
    bi("nicht brauchen + zu + Infinitiv = nicht müssen.", "nicht brauchen + zu + infinitive = need not."), S.bildung),

  /* ----------------------------------------------------- connectors, opinion */
  g("b1_g9a", G.konn, "Ich bin müde, ___ lese ich noch. (nevertheless)", bi("Konnektor, Verb folgt sofort", "connector, verb follows at once"), ["trotzdem"],
    bi("trotzdem auf Position 1, das Verb direkt danach.", "trotzdem in position 1, the verb right after."), S.medien),
  g("b1_g9b", G.konn, "Es regnet, ___ bleiben wir zu Hause. (therefore)", bi("Konnektor, Verb folgt sofort", "connector, verb follows at once"), ["deshalb", "deswegen", "darum", "daher"],
    bi("deshalb / deswegen / darum: Folge, Verb direkt danach.", "deshalb / deswegen / darum: consequence, verb right after."), S.medien),
  g("b1_g9c", G.konn, "Sie sagt, ___ sie kein Fernsehen mehr schaut.", bi("indirekte Rede, erster Schritt", "reported speech, first step"), ["dass"],
    bi("sagen, dass + Nebensatz — der einfachste Weg, jemanden wiederzugeben.", "sagen, dass + clause — the simplest way to report someone."), S.medien),

  /* ------------------------------------------------------ sequence of tenses */
  g("b1_g10a", G.zeit, "Nachdem wir gegessen ___, gingen wir spazieren.", bi("Plusquamperfekt", "pluperfect"), ["hatten"],
    bi("nachdem + Plusquamperfekt: hatten gegessen.", "nachdem + pluperfect: hatten gegessen."), S.reisen),
  g("b1_g10b", G.zeit, "___ ich Kind war, wohnten wir in Köln. (als / wenn)", bi("einmal, Vergangenheit", "once, in the past"), ["als"],
    bi("Einmaliges in der Vergangenheit → als.", "A single past event → als."), S.reisen),

  /* ----------------------------------------------------- two-part connectors */
  g("b1_g11a", G.zwei, "Wir haben ___ Zeit noch Geld.", bi("neither … nor", "neither … nor"), ["weder"],
    bi("weder … noch.", "weder … noch."), S.gesellschaft),
  g("b1_g11b", G.zwei, "___ wir fahren, oder wir bleiben hier.", bi("either … or", "either … or"), ["entweder"],
    bi("entweder … oder.", "entweder … oder."), S.gesellschaft),

  /* ------------------------------------------ darauf, worauf, n-declension */
  g("b1_g12a", G.da, "___ wartest du? — Auf den Brief.", bi("Frage nach einer Sache: wo(r) + Präposition", "asking about a thing: wo(r) + preposition"), ["worauf"],
    bi("Sache → worauf; Person → auf wen.", "Thing → worauf; person → auf wen."), S.konsum),
  g("b1_g12b", G.da, "Ich warte ___, dass der Vertrag kommt.", bi("da(r) + Präposition vor dass", "da(r) + preposition before dass"), ["darauf"],
    bi("Vor einem dass-Satz steht immer da(r)-: darauf, dass …", "Before a dass-clause always da(r)-: darauf, dass …"), S.konsum),
  g("b1_g12c", G.da, "Ich helfe ___ Kunden. (n-Deklination)", bi("the customer — <code>der Kunde</code>", "the customer — <code>der Kunde</code>"), ["dem"],
    bi("helfen + Dativ: dem Kunden — das Nomen bekommt -n.", "helfen + dative: dem Kunden — the noun takes -n."), S.konsum),

  /* ----------------------------------------------------------------- Futur I */
  g("b1_g13a", G.futur, "Nächstes Jahr ___ ich nach Indien fliegen. (werden)", bi("Futur I", "Futur I"), ["werde"],
    bi("werden + Infinitiv: ich werde … fliegen.", "werden + infinitive: ich werde … fliegen."), S.feste),
  g("b1_g13b", G.futur, "Er wird ___ krank sein. (probably — Partikel)", bi("Vermutung", "assumption"), ["wohl", "wahrscheinlich", "vermutlich"],
    bi("werden + wohl = Vermutung, keine Zukunft.", "werden + wohl = assumption, not future."), S.feste),
  g("b1_g13c", G.futur, "Ihr ___ das Fest bestimmt genießen. (werden)", bi("Futur I", "Futur I"), ["werdet"],
    bi("ihr → werdet.", "ihr → werdet."), S.feste),

  /* ------------------------------- lassen, adjectives, verbs with prepositions */
  g("b1_g14a", G.gef, "Ich lasse mein Auto ___. (reparieren)", bi("lassen + Infinitiv", "lassen + infinitive"), ["reparieren"],
    bi("lassen + Infinitiv: jemand anderes tut es.", "lassen + infinitive: someone else does it."), S.gefuehle),
  g("b1_g14b", G.gef, "Ich bin stolz ___ dich.", bi("Adjektiv mit Präposition", "adjective with a preposition"), ["auf"],
    bi("stolz auf + Akkusativ.", "stolz auf + accusative."), S.gefuehle),
  g("b1_g14c", G.gef, "Ich danke ___ für die Hilfe. (you — du)", bi("Dativverb", "dative verb"), ["dir"],
    bi("danken + Dativ: dir.", "danken + dative: dir."), S.gefuehle),

  /* ------------------------------------------------------ presentation phrases */
  g("b1_g15a", G.red, "Ich möchte ___ das Thema Sport sprechen. (about)", bi("sprechen + Präposition", "sprechen + preposition"), ["über"],
    bi("sprechen über + Akkusativ.", "sprechen über + accusative."), S.pruefung),
  g("b1_g15b", G.red, "Ein Vorteil ist, ___ man Zeit spart.", bi("Konjunktion", "conjunction"), ["dass"],
    bi("Ein Vorteil ist, dass … — Verb am Ende.", "Ein Vorteil ist, dass … — verb at the end."), S.pruefung),
  g("b1_g15c", G.red, "Zusammenfassend kann ich ___, dass … (sagen)", bi("Infinitiv am Ende", "infinitive at the end"), ["sagen"],
    bi("kann … sagen — Satzklammer.", "kann … sagen — the bracket."), S.pruefung)
];

export const B1_TOPICS: readonly TopicItem[] = [
  {
    id: "b1_t1",
    section: S.arbeit,
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
    section: S.gesund,
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
    section: S.bildung,
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
    section: S.gefuehle,
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
    section: S.reisen,
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
    section: S.wohnen,
    name: bi("legen/liegen, stellen/stehen", "legen/liegen, stellen/stehen"),
    seedStage: 0,
    questions: [
      q("Ich ___ das Buch auf den Tisch. (legen/liegen)", bi("Verb", "verb"), ["lege"], bi("Bewegung (wohin?) → legen + Akkusativ.", "Movement (wohin?) → legen + accusative.")),
      q("Das Buch ___ auf dem Tisch. (legen/liegen)", bi("Verb", "verb"), ["liegt"], bi("Ort (wo?) → liegen + Dativ.", "Location (wo?) → liegen + dative.")),
      q("Er ___ die Vase auf den Schrank. (stellen/stehen)", bi("Verb", "verb"), ["stellt"], bi("wohin? → stellen.", "wohin? → stellen.")),
      q("Die Vase ___ auf dem Schrank. (stellen/stehen)", bi("Verb", "verb"), ["steht"], bi("wo? → stehen.", "wo? → stehen."))
    ]
  },
  {
    id: "b1_t7",
    section: S.wohnen,
    name: bi("Relativpronomen in allen Fällen", "Relative pronouns in every case"),
    seedStage: 0,
    questions: [
      q("Der Nachbar, ___ immer laut ist, wohnt oben.", bi("<code>der Nachbar</code> — Subjekt", "<code>der Nachbar</code> — subject"), ["der"], bi("Er ist laut → Nominativ: der.", "He is loud → nominative: der.")),
      q("Die Wohnung, ___ ich suche, muss hell sein.", bi("<code>die Wohnung</code>", "<code>die Wohnung</code>"), ["die"], bi("Ich suche sie → Akkusativ feminin: die.", "I'm looking for it → feminine accusative: die.")),
      q("Die Stadt, in ___ ich wohne, ist klein.", bi("<code>die Stadt</code>", "<code>die Stadt</code>"), ["der"], bi("in + Dativ (wo?): der.", "in + dative (wo?): der.")),
      q("Die Leute, ___ ich helfe, sind neu hier.", bi("<code>die Leute</code> (Plural)", "<code>die Leute</code> (plural)"), ["denen"], bi("helfen + Dativ Plural: denen.", "helfen + dative plural: denen."))
    ]
  },
  {
    id: "b1_t8",
    section: S.medien,
    name: bi("Meinung äußern: Konnektoren", "Giving an opinion: connectors"),
    seedStage: 0,
    questions: [
      q("Ich habe kein Geld, ___ kaufe ich es. (nevertheless)", bi("Konnektor", "connector"), ["trotzdem"], bi("trotzdem — Gegensatz, Verb folgt sofort.", "trotzdem — contrast, verb follows at once.")),
      q("Das Handy ist teuer, ___ ist es sehr gut. (besides)", bi("Konnektor", "connector"), ["außerdem"], bi("außerdem — Ergänzung, Verb folgt sofort.", "außerdem — addition, verb follows at once.")),
      q("Meiner ___ nach ist das falsch.", bi("feste Wendung", "fixed phrase"), ["Meinung"], bi("Meiner Meinung nach — Dativ, nach am Ende.", "Meiner Meinung nach — dative, nach at the end.")),
      q("Ich bin der Meinung, ___ das Internet hilft.", bi("Konjunktion", "conjunction"), ["dass"], bi("der Meinung sein, dass … — Verb ans Ende.", "der Meinung sein, dass … — verb to the end."))
    ]
  },
  {
    id: "b1_t9",
    section: S.reisen,
    name: bi("als, wenn, nachdem — und das Plusquamperfekt", "als, wenn, nachdem — and the pluperfect"),
    seedStage: 0,
    questions: [
      q("___ ich in Berlin war, habe ich das Museum besucht. (once, in the past)", bi("als / wenn", "als / wenn"), ["als"], bi("Einmalig in der Vergangenheit → als.", "A single past event → als.")),
      q("___ ich müde bin, trinke ich Kaffee. (every time)", bi("als / wenn", "als / wenn"), ["wenn"], bi("Wiederholt → wenn.", "Repeated → wenn.")),
      q("Nachdem der Zug abgefahren ___, kam er am Bahnhof an.", bi("Plusquamperfekt mit sein", "pluperfect with sein"), ["war"], bi("abfahren → sein → war abgefahren.", "abfahren → sein → war abgefahren.")),
      q("Ich rufe an, ___ ich angekommen bin. (as soon as)", bi("Konjunktion", "conjunction"), ["sobald"], bi("sobald — unmittelbar danach.", "sobald — immediately after."))
    ]
  },
  {
    id: "b1_t10",
    section: S.umwelt,
    name: bi("Genitiv und seine Präpositionen", "The genitive and its prepositions"),
    seedStage: 0,
    questions: [
      q("die Folgen ___ Klimawandels", bi("<code>der Klimawandel</code>", "<code>der Klimawandel</code>"), ["des"], bi("Genitiv maskulin: des Klimawandels — mit -s.", "Masculine genitive: des Klimawandels — with -s.")),
      q("die Zukunft ___ Kinder", bi("<code>die Kinder</code> (Plural)", "<code>die Kinder</code> (plural)"), ["der"], bi("Genitiv Plural: der.", "Genitive plural: der.")),
      q("___ der starken Hitze blieben alle drinnen. (because of)", bi("Präposition mit Genitiv", "preposition with the genitive"), ["wegen", "aufgrund"], bi("wegen + Genitiv.", "wegen + genitive.")),
      q("___ des Sturms fuhren die Züge. (despite)", bi("Präposition mit Genitiv", "preposition with the genitive"), ["trotz"], bi("trotz + Genitiv.", "trotz + genitive."))
    ]
  },
  {
    id: "b1_t11",
    section: S.gesellschaft,
    name: bi("Zweiteilige Konnektoren", "Two-part connectors"),
    seedStage: 0,
    questions: [
      q("Er ist nicht nur klug, ___ auch fleißig.", bi("nicht nur … ___ auch", "nicht nur … ___ auch"), ["sondern"], bi("nicht nur … sondern auch.", "nicht nur … sondern auch.")),
      q("Sie spricht ___ Deutsch als auch Malayalam.", bi("both … and", "both … and"), ["sowohl"], bi("sowohl … als auch.", "sowohl … als auch.")),
      q("Es ist ___ teuer, aber gut. (admittedly)", bi("zwar … aber", "zwar … aber"), ["zwar"], bi("zwar … aber — Einschränkung.", "zwar … aber — concession.")),
      q("Je mehr ich übe, ___ besser wird es.", bi("je … ___", "je … ___"), ["desto", "umso"], bi("je … desto / umso — Verb folgt direkt.", "je … desto / umso — verb follows at once."))
    ]
  },
  {
    id: "b1_t12",
    section: S.konsum,
    name: bi("darauf, worauf & Co.", "darauf, worauf & co."),
    seedStage: 0,
    questions: [
      q("___ interessierst du dich? — Für Musik.", bi("wo(r) + für", "wo(r) + für"), ["wofür"], bi("Sache → wofür.", "Thing → wofür.")),
      q("Ich ärgere mich ___, dass die Rechnung falsch ist.", bi("da(r) + über", "da(r) + über"), ["darüber"], bi("Vokal-Präposition → dar-: darüber.", "Vowel-initial preposition → dar-: darüber.")),
      q("Auf ___ wartest du? — Auf meinen Bruder.", bi("Person", "a person"), ["wen"], bi("Person → auf wen, nicht worauf.", "Person → auf wen, not worauf.")),
      q("Denkst du noch ___? — Ja, jeden Tag. (an + es)", bi("da(r) + an", "da(r) + an"), ["daran"], bi("an → daran.", "an → daran."))
    ]
  },
  {
    id: "b1_t13",
    section: S.feste,
    name: bi("Futur I", "Futur I"),
    seedStage: 0,
    questions: [
      q("Nächstes Jahr ___ wir nach Kerala fliegen.", bi("werden", "werden"), ["werden"], bi("wir werden.", "wir werden.")),
      q("Du ___ das Fest lieben.", bi("werden", "werden"), ["wirst"], bi("du wirst.", "du wirst.")),
      q("Es ___ bestimmt regnen.", bi("werden", "werden"), ["wird"], bi("es wird.", "es wird.")),
      q("Ich werde nächstes Jahr mehr Sport ___. (machen)", bi("Infinitiv am Ende", "infinitive at the end"), ["machen"], bi("werden … machen — Satzklammer.", "werden … machen — the bracket."))
    ]
  },
  {
    id: "b1_t14",
    section: S.pruefung,
    name: bi("Redemittel für die Präsentation", "Phrases for the presentation"),
    seedStage: 0,
    questions: [
      q("Ich möchte heute ___ das Thema Umwelt sprechen.", bi("Präposition", "preposition"), ["über"], bi("sprechen über + Akkusativ.", "sprechen über + accusative.")),
      q("Aus meiner ___ ist das sehr wichtig.", bi("feste Wendung", "fixed phrase"), ["Erfahrung", "Sicht"], bi("Aus meiner Erfahrung / Sicht …", "Aus meiner Erfahrung / Sicht …")),
      q("Ein Nachteil ist, ___ es viel kostet.", bi("Konjunktion", "conjunction"), ["dass"], bi("Ein Nachteil ist, dass …", "Ein Nachteil ist, dass …")),
      q("Vielen Dank für Ihre ___.", bi("Schlusssatz", "closing line"), ["Aufmerksamkeit"], bi("Vielen Dank für Ihre Aufmerksamkeit.", "Vielen Dank für Ihre Aufmerksamkeit."))
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
