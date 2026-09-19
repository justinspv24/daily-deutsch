import { NO_PLURAL, type Bilingual, type BlankQuestion, type GrammarItem, type TopicItem, type UpcomingTopic, type VocabItem } from "../types";

/**
 * The B2 bank: indirect speech, the passive in every tense, participles as
 * adjectives, nominal style, genitive prepositions and two-part connectors —
 * and, following the B2 syllabus section by section (`b2_s01` …), modal
 * particles, the past Konjunktiv II, subjective modals, light-verb
 * constructions, the strong simple past, als ob, TeKaMoLo and the phrases
 * the exam's talk and discussion want. Every item carries its section.
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
  kon1: bi("Konjunktiv I — indirekte Rede", "Konjunktiv I — indirect speech"),
  passiv: bi("Passiv in allen Zeiten", "Passive in every tense"),
  part: bi("Partizipien als Adjektive", "Participles as adjectives"),
  nomen: bi("Nominalisierung", "Nominalisation"),
  gpraep: bi("Präpositionen mit Genitiv", "Genitive prepositions"),
  konn: bi("Zweiteilige Konnektoren", "Two-part connectors"),
  rel: bi("Relativsätze & Grafik", "Relative clauses & charts"),
  partikel: bi("Modalpartikeln & Konjunktiv II der Vergangenheit", "Modal particles & past Konjunktiv II"),
  vermut: bi("Vermutung: Modalverben & Futur II", "Assumption: modals & Futur II"),
  fvg: bi("Funktionsverbgefüge", "Light-verb constructions"),
  praet: bi("Präteritum & Zeitfolge", "Simple past & sequence"),
  irreal: bi("als ob & Wunschsätze", "als ob & wish clauses"),
  stil: bi("TeKaMoLo & Textkohärenz", "TeKaMoLo & coherence"),
  disk: bi("Redemittel Diskussion", "Discussion phrases")
} satisfies Record<string, Bilingual>;

/* The sections of the B2 syllabus, by number. */
const S = {
  arbeit: "b2_s01",
  technik: "b2_s02",
  politik: "b2_s03",
  klima: "b2_s04",
  wirtschaft: "b2_s05",
  kultur: "b2_s06",
  psyche: "b2_s07",
  forschung: "b2_s08",
  geschichte: "b2_s09",
  ethik: "b2_s10",
  stil: "b2_s11",
  pruefung: "b2_s12"
} as const;

export const B2_VOCAB: readonly VocabItem[] = [
  /* ------------------------------------------------- the original thirteen */
  v("b2_v_herausforderung", "noun", "Herausforderung", "die", ["challenge"], ["die Herausforderungen", "Herausforderungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.arbeit),
  v("b2_v_zusammenhang", "noun", "Zusammenhang", "der", ["connection", "context"], ["die Zusammenhänge", "Zusammenhänge"],
    bi("in diesem Zusammenhang — Umlaut im Plural.", "in diesem Zusammenhang — umlaut in the plural."), S.stil),
  v("b2_v_voraussetzung", "noun", "Voraussetzung", "die", ["prerequisite", "requirement", "precondition"], ["die Voraussetzungen", "Voraussetzungen"],
    bi("unter der Voraussetzung, dass …", "unter der Voraussetzung, dass …"), S.forschung),
  v("b2_v_verhaeltnis", "noun", "Verhältnis", "das", ["relationship", "ratio", "relation"], ["die Verhältnisse", "Verhältnisse"],
    bi("-nis ist meist Neutrum; Plural verdoppelt das s.", "-nis is mostly neuter; the plural doubles the s."), S.wirtschaft),
  v("b2_v_einfluss", "noun", "Einfluss", "der", ["influence"], ["die Einflüsse", "Einflüsse"],
    bi("Einfluss auf + Akkusativ. Plural mit Umlaut.", "Einfluss auf + accusative. Plural takes an umlaut."), S.politik),
  v("b2_v_massnahme", "noun", "Maßnahme", "die", ["measure", "step"], ["die Maßnahmen", "Maßnahmen"],
    bi("Maßnahmen ergreifen — feste Verbindung.", "Maßnahmen ergreifen — a fixed collocation."), S.klima),
  v("b2_v_widerspruch", "noun", "Widerspruch", "der", ["contradiction", "objection"], ["die Widersprüche", "Widersprüche"],
    bi("wider (gegen), nicht wieder (noch einmal).", "wider (against), not wieder (again)."), S.ethik),
  v("b2_v_ergebnis", "noun", "Ergebnis", "das", ["result", "outcome"], ["die Ergebnisse", "Ergebnisse"],
    bi("das Ergebnis — Plural -se.", "das Ergebnis — plural -se."), S.forschung),
  v("b2_v_gewaehrleisten", "verb", "gewährleisten", "haben", ["to guarantee", "to ensure", "guarantee"], ["gewährleistet"],
    bi("Untrennbar, kein ge-: gewährleistet.", "Inseparable, no ge-: gewährleistet."), S.technik),
  v("b2_v_beeinflussen", "verb", "beeinflussen", "haben", ["to influence", "influence"], ["beeinflusst"],
    bi("be- → kein ge-: beeinflusst.", "be- → no ge-: beeinflusst."), S.politik),
  v("b2_v_geraten", "verb", "geraten", "sein", ["to get into", "to end up in", "get into"], ["geraten"],
    bi("in Schwierigkeiten geraten — Partizip gleich Infinitiv, mit sein.", "in Schwierigkeiten geraten — participle equals infinitive, with sein."), S.psyche),
  v("b2_v_abweichen", "verb", "abweichen", "sein", ["to deviate", "to differ", "deviate"], ["abgewichen"],
    bi("Trennbar: ab-ge-wichen, Bewegung weg von → sein.", "Separable: ab-ge-wichen; moving away from → sein."), S.stil),
  v("b2_v_hervorheben", "verb", "hervorheben", "haben", ["to emphasise", "to highlight", "emphasize"], ["hervorgehoben"],
    bi("hervor-ge-hoben.", "hervor-ge-hoben."), S.stil),

  /* ------------------------------------------------ s01 Arbeitswelt */
  v("b2_v_karriere", "noun", "Karriere", "die", ["career"], ["die Karrieren", "Karrieren"],
    bi("-e → feminin, Plural -n. Karriere machen.", "-e → feminine, plural -n. Karriere machen."), S.arbeit),
  v("b2_v_fuehrungskraft", "noun", "Führungskraft", "die", ["manager", "executive"], ["die Führungskräfte", "Führungskräfte"],
    bi("die Kraft → die Kräfte: Umlaut + -e.", "die Kraft → die Kräfte: umlaut plus -e."), S.arbeit),
  v("b2_v_verhandlung", "noun", "Verhandlung", "die", ["negotiation"], ["die Verhandlungen", "Verhandlungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.arbeit),
  v("b2_v_protokoll", "noun", "Protokoll", "das", ["minutes", "record"], ["die Protokolle", "Protokolle"],
    bi("Neutrum, Plural -e. Protokoll führen.", "Neuter, plural -e. Protokoll führen."), S.arbeit),
  v("b2_v_zusammenarbeit", "noun", "Zusammenarbeit", "die", ["cooperation", "collaboration"], ["die Zusammenarbeiten", "Zusammenarbeiten"],
    bi("Feminin; Plural selten.", "Feminine; plural rare."), S.arbeit),
  v("b2_v_zustaendigkeit", "noun", "Zuständigkeit", "die", ["responsibility", "competence", "remit"], ["die Zuständigkeiten", "Zuständigkeiten"],
    bi("-keit → feminin, Plural -en. Zuständig für.", "-keit → feminine, plural -en. Zuständig für."), S.arbeit),
  v("b2_v_verhandeln", "verb", "verhandeln", "haben", ["to negotiate", "negotiate"], ["verhandelt"],
    bi("ver- → kein ge-: verhandelt. Verhandeln über / mit.", "ver- → no ge-: verhandelt. Verhandeln über / mit."), S.arbeit),
  v("b2_v_protokollieren", "verb", "protokollieren", "haben", ["to take minutes", "to record", "take minutes"], ["protokolliert"],
    bi("-ieren → kein ge-: protokolliert.", "-ieren → no ge-: protokolliert."), S.arbeit),

  /* ------------------------------------------------ s02 Wissenschaft & Technik */
  v("b2_v_forschung", "noun", "Forschung", "die", ["research"], ["die Forschungen", "Forschungen"],
    bi("-ung → feminin. Forschung und Entwicklung.", "-ung → feminine. Forschung und Entwicklung."), S.technik),
  v("b2_v_erfindung", "noun", "Erfindung", "die", ["invention"], ["die Erfindungen", "Erfindungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.technik),
  v("b2_v_verfahren", "noun", "Verfahren", "das", ["procedure", "process", "method"], ["die Verfahren", "Verfahren"],
    bi("Substantivierter Infinitiv → neutrum, Plural unverändert.", "Nominalised infinitive → neuter, plural unchanged."), S.technik),
  v("b2_v_fortschritt", "noun", "Fortschritt", "der", ["progress"], ["die Fortschritte", "Fortschritte"],
    bi("der Schritt → die Schritte. Fortschritte machen.", "der Schritt → die Schritte. Fortschritte machen."), S.technik),
  v("b2_v_auswirkung", "noun", "Auswirkung", "die", ["effect", "impact"], ["die Auswirkungen", "Auswirkungen"],
    bi("-ung → feminin. Auswirkung auf + Akkusativ.", "-ung → feminine. Auswirkung auf + accusative."), S.technik),
  v("b2_v_ermoeglichen", "verb", "ermöglichen", "haben", ["to enable", "to make possible", "enable"], ["ermöglicht"],
    bi("er- → kein ge-: ermöglicht. Mit Dativ + Akkusativ.", "er- → no ge-: ermöglicht. Dative + accusative."), S.technik),
  v("b2_v_verhindern", "verb", "verhindern", "haben", ["to prevent", "prevent"], ["verhindert"],
    bi("ver- → kein ge-: verhindert.", "ver- → no ge-: verhindert."), S.technik),
  v("b2_v_entwickeln", "verb", "entwickeln", "haben", ["to develop", "develop"], ["entwickelt"],
    bi("ent- → kein ge-: entwickelt. Sich entwickeln = to evolve.", "ent- → no ge-: entwickelt. Sich entwickeln = to evolve."), S.technik),

  /* ------------------------------------------------ s03 Gesellschaft & Politik */
  v("b2_v_wahl", "noun", "Wahl", "die", ["election", "choice"], ["die Wahlen", "Wahlen"],
    bi("Feminin, Plural -en. Die Wahl = auch: choice.", "Feminine, plural -en. Die Wahl also means choice."), S.politik),
  v("b2_v_partei", "noun", "Partei", "die", ["party (political)"], ["die Parteien", "Parteien"],
    bi("-ei → feminin, Plural -en.", "-ei → feminine, plural -en."), S.politik),
  v("b2_v_regierung", "noun", "Regierung", "die", ["government"], ["die Regierungen", "Regierungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.politik),
  v("b2_v_verfassung", "noun", "Verfassung", "die", ["constitution"], ["die Verfassungen", "Verfassungen"],
    bi("-ung → feminin. Deutschlands Verfassung heißt Grundgesetz.", "-ung → feminine. Germany's constitution is the Grundgesetz."), S.politik),
  v("b2_v_debatte", "noun", "Debatte", "die", ["debate"], ["die Debatten", "Debatten"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.politik),
  v("b2_v_berichterstattung", "noun", "Berichterstattung", "die", ["reporting", "coverage"], ["die Berichterstattungen", "Berichterstattungen"],
    bi("-ung → feminin; Plural selten.", "-ung → feminine; plural rare."), S.politik),
  v("b2_v_waehlen", "verb", "wählen", "haben", ["to vote", "to elect", "to choose", "vote"], ["gewählt"],
    bi("Regelmäßig: gewählt. Wählen gehen.", "Regular: gewählt. Wählen gehen."), S.politik),
  v("b2_v_debattieren", "verb", "debattieren", "haben", ["to debate", "debate"], ["debattiert"],
    bi("-ieren → kein ge-: debattiert. Über + Akkusativ.", "-ieren → no ge-: debattiert. Über + accusative."), S.politik),

  /* ------------------------------------------------ s04 Umwelt & Klima */
  v("b2_v_emission", "noun", "Emission", "die", ["emission"], ["die Emissionen", "Emissionen"],
    bi("-ion → feminin, Plural -en.", "-ion → feminine, plural -en."), S.klima),
  v("b2_v_meeresspiegel", "noun", "Meeresspiegel", "der", ["sea level"], ["die Meeresspiegel", "Meeresspiegel"],
    bi("der Spiegel → die Spiegel: Plural unverändert.", "der Spiegel → die Spiegel: plural unchanged."), S.klima),
  v("b2_v_duerre", "noun", "Dürre", "die", ["drought"], ["die Dürren", "Dürren"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.klima),
  v("b2_v_ueberschwemmung", "noun", "Überschwemmung", "die", ["flood"], ["die Überschwemmungen", "Überschwemmungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.klima),
  v("b2_v_anteil", "noun", "Anteil", "der", ["share", "proportion"], ["die Anteile", "Anteile"],
    bi("Maskulin, Plural -e. Der Anteil an + Dativ.", "Masculine, plural -e. Der Anteil an + dative."), S.klima),
  v("b2_v_anstieg", "noun", "Anstieg", "der", ["rise", "increase"], ["die Anstiege", "Anstiege"],
    bi("Maskulin, Plural -e. Gegenteil: der Rückgang.", "Masculine, plural -e. Opposite: der Rückgang."), S.klima),
  v("b2_v_rueckgang", "noun", "Rückgang", "der", ["decline", "decrease"], ["die Rückgänge", "Rückgänge"],
    bi("Umlaut + -e: die Rückgänge.", "Umlaut plus -e: die Rückgänge."), S.klima),
  v("b2_v_zunehmen", "verb", "zunehmen", "haben", ["to increase", "to gain weight", "increase"], ["zugenommen"],
    bi("Trennbar: zu-ge-nommen.", "Separable: zu-ge-nommen."), S.klima),
  v("b2_v_abnehmen", "verb", "abnehmen", "haben", ["to decrease", "to lose weight", "decrease"], ["abgenommen"],
    bi("Trennbar: ab-ge-nommen.", "Separable: ab-ge-nommen."), S.klima),
  v("b2_v_verdoppeln", "verb", "sich verdoppeln", "haben", ["to double", "double"], ["verdoppelt"],
    bi("Reflexiv: Der Anteil hat sich verdoppelt.", "Reflexive: Der Anteil hat sich verdoppelt."), S.klima),

  /* ------------------------------------------------ s05 Wirtschaft */
  v("b2_v_wirtschaft", "noun", "Wirtschaft", "die", ["economy"], ["die Wirtschaften", "Wirtschaften"],
    bi("-schaft → feminin; Plural selten.", "-schaft → feminine; plural rare."), S.wirtschaft),
  v("b2_v_nachfrage", "noun", "Nachfrage", "die", ["demand"], ["die Nachfragen", "Nachfragen"],
    bi("-e → feminin. Angebot und Nachfrage.", "-e → feminine. Angebot und Nachfrage."), S.wirtschaft),
  v("b2_v_wettbewerb", "noun", "Wettbewerb", "der", ["competition"], ["die Wettbewerbe", "Wettbewerbe"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.wirtschaft),
  v("b2_v_unternehmen", "noun", "Unternehmen", "das", ["company", "enterprise"], ["die Unternehmen", "Unternehmen"],
    bi("Substantivierter Infinitiv → neutrum, Plural unverändert.", "Nominalised infinitive → neuter, plural unchanged."), S.wirtschaft),
  v("b2_v_gewinn", "noun", "Gewinn", "der", ["profit"], ["die Gewinne", "Gewinne"],
    bi("Maskulin, Plural -e. Gegenteil: der Verlust.", "Masculine, plural -e. Opposite: der Verlust."), S.wirtschaft),
  v("b2_v_verlust", "noun", "Verlust", "der", ["loss"], ["die Verluste", "Verluste"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.wirtschaft),
  v("b2_v_lieferkette", "noun", "Lieferkette", "die", ["supply chain"], ["die Lieferketten", "Lieferketten"],
    bi("die Kette → die Ketten.", "die Kette → die Ketten."), S.wirtschaft),
  v("b2_v_handeln", "verb", "handeln", "haben", ["to trade", "to act", "trade"], ["gehandelt"],
    bi("handeln mit = trade in; handeln = act.", "handeln mit = trade in; handeln = act."), S.wirtschaft),
  v("b2_v_leisten", "verb", "sich leisten", "haben", ["to afford", "afford"], ["geleistet"],
    bi("Reflexiv (Dativ) + Akkusativ: Ich kann mir das leisten.", "Reflexive (dative) + accusative: Ich kann mir das leisten."), S.wirtschaft),

  /* ------------------------------------------------ s06 Kultur & Kunst */
  v("b2_v_kuenstler", "noun", "Künstler", "der", ["artist"], ["die Künstler", "Künstler"],
    bi("-er → maskulin, Plural unverändert. Die Künstlerin.", "-er → masculine, plural unchanged. Die Künstlerin."), S.kultur),
  v("b2_v_werk", "noun", "Werk", "das", ["work (of art)"], ["die Werke", "Werke"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.kultur),
  v("b2_v_roman", "noun", "Roman", "der", ["novel"], ["die Romane", "Romane"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.kultur),
  v("b2_v_gedicht", "noun", "Gedicht", "das", ["poem"], ["die Gedichte", "Gedichte"],
    bi("Ge- … → neutrum, Plural -e.", "Ge- … → neuter, plural -e."), S.kultur),
  v("b2_v_handlung", "noun", "Handlung", "die", ["plot", "action"], ["die Handlungen", "Handlungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.kultur),
  v("b2_v_rezension", "noun", "Rezension", "die", ["review"], ["die Rezensionen", "Rezensionen"],
    bi("-ion → feminin, Plural -en.", "-ion → feminine, plural -en."), S.kultur),
  v("b2_v_auffuehrung", "noun", "Aufführung", "die", ["performance"], ["die Aufführungen", "Aufführungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.kultur),
  v("b2_v_buehne", "noun", "Bühne", "die", ["stage"], ["die Bühnen", "Bühnen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.kultur),
  v("b2_v_bedauern", "verb", "bedauern", "haben", ["to regret", "regret"], ["bedauert"],
    bi("be- → kein ge-: bedauert.", "be- → no ge-: bedauert."), S.kultur),
  v("b2_v_auseinandersetzen", "verb", "sich auseinandersetzen", "haben", ["to engage with", "to grapple with", "engage with"], ["auseinandergesetzt"],
    bi("Reflexiv + mit, trennbar: auseinander-ge-setzt.", "Reflexive + mit, separable: auseinander-ge-setzt."), S.kultur),

  /* ------------------------------------------------ s07 Psychologie & Lebensstil */
  v("b2_v_psyche", "noun", "Psyche", "die", ["psyche", "mind"], ["die Psychen", "Psychen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.psyche),
  v("b2_v_erschoepfung", "noun", "Erschöpfung", "die", ["exhaustion"], ["die Erschöpfungen", "Erschöpfungen"],
    bi("-ung → feminin; Plural selten.", "-ung → feminine; plural rare."), S.psyche),
  v("b2_v_therapie", "noun", "Therapie", "die", ["therapy"], ["die Therapien", "Therapien"],
    bi("-ie → feminin, Plural -n.", "-ie → feminine, plural -n."), S.psyche),
  v("b2_v_gewohnheit", "noun", "Gewohnheit", "die", ["habit"], ["die Gewohnheiten", "Gewohnheiten"],
    bi("-heit → feminin, Plural -en.", "-heit → feminine, plural -en."), S.psyche),
  v("b2_v_lebensstil", "noun", "Lebensstil", "der", ["lifestyle"], ["die Lebensstile", "Lebensstile"],
    bi("der Stil → die Stile.", "der Stil → die Stile."), S.psyche),
  v("b2_v_belastung", "noun", "Belastung", "die", ["strain", "burden"], ["die Belastungen", "Belastungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.psyche),
  v("b2_v_immunsystem", "noun", "Immunsystem", "das", ["immune system"], ["die Immunsysteme", "Immunsysteme"],
    bi("das System → die Systeme.", "das System → die Systeme."), S.psyche),
  v("b2_v_vorbeugen", "verb", "vorbeugen", "haben", ["to prevent", "to take precautions", "prevent"], ["vorgebeugt"],
    bi("Trennbar + Dativ: einer Krankheit vorbeugen.", "Separable + dative: einer Krankheit vorbeugen."), S.psyche),
  v("b2_v_erholen", "verb", "sich erholen", "haben", ["to recover", "to recuperate", "recover"], ["erholt"],
    bi("Reflexiv, er- untrennbar: Ich habe mich erholt.", "Reflexive, er- inseparable: Ich habe mich erholt."), S.psyche),
  v("b2_v_bewaeltigen", "verb", "bewältigen", "haben", ["to cope with", "to manage", "cope with"], ["bewältigt"],
    bi("be- → kein ge-: bewältigt.", "be- → no ge-: bewältigt."), S.psyche),

  /* ------------------------------------------------ s08 Bildung & Forschung */
  v("b2_v_wissenschaft", "noun", "Wissenschaft", "die", ["science", "scholarship"], ["die Wissenschaften", "Wissenschaften"],
    bi("-schaft → feminin, Plural -en.", "-schaft → feminine, plural -en."), S.forschung),
  v("b2_v_studie", "noun", "Studie", "die", ["study"], ["die Studien", "Studien"],
    bi("-ie → feminin, Plural -n.", "-ie → feminine, plural -n."), S.forschung),
  v("b2_v_these", "noun", "These", "die", ["thesis", "claim"], ["die Thesen", "Thesen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.forschung),
  v("b2_v_erkenntnis", "noun", "Erkenntnis", "die", ["insight", "finding"], ["die Erkenntnisse", "Erkenntnisse"],
    bi("Hier ist -nis feminin! Plural -se.", "Here -nis is feminine! Plural -se."), S.forschung),
  v("b2_v_vortrag", "noun", "Vortrag", "der", ["talk", "lecture"], ["die Vorträge", "Vorträge"],
    bi("Umlaut + -e: die Vorträge.", "Umlaut plus -e: die Vorträge."), S.forschung),
  v("b2_v_fachbegriff", "noun", "Fachbegriff", "der", ["technical term"], ["die Fachbegriffe", "Fachbegriffe"],
    bi("der Begriff → die Begriffe.", "der Begriff → die Begriffe."), S.forschung),
  v("b2_v_belegen", "verb", "belegen", "haben", ["to substantiate", "to prove", "to document", "substantiate"], ["belegt"],
    bi("be- → kein ge-: belegt.", "be- → no ge-: belegt."), S.forschung),
  v("b2_v_widerlegen", "verb", "widerlegen", "haben", ["to refute", "to disprove", "refute"], ["widerlegt"],
    bi("wider- untrennbar: widerlegt.", "wider- inseparable: widerlegt."), S.forschung),
  v("b2_v_zitieren", "verb", "zitieren", "haben", ["to cite", "to quote", "cite"], ["zitiert"],
    bi("-ieren → kein ge-: zitiert.", "-ieren → no ge-: zitiert."), S.forschung),

  /* ------------------------------------------------ s09 Geschichte */
  v("b2_v_ereignis", "noun", "Ereignis", "das", ["event"], ["die Ereignisse", "Ereignisse"],
    bi("-nis → neutrum, Plural -se.", "-nis → neuter, plural -se."), S.geschichte),
  v("b2_v_jahrhundert", "noun", "Jahrhundert", "das", ["century"], ["die Jahrhunderte", "Jahrhunderte"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.geschichte),
  v("b2_v_jahrzehnt", "noun", "Jahrzehnt", "das", ["decade"], ["die Jahrzehnte", "Jahrzehnte"],
    bi("Neutrum, Plural -e.", "Neuter, plural -e."), S.geschichte),
  v("b2_v_wiedervereinigung", "noun", "Wiedervereinigung", "die", ["reunification"], ["die Wiedervereinigungen", "Wiedervereinigungen"],
    bi("-ung → feminin. Die deutsche Wiedervereinigung: 1990.", "-ung → feminine. German reunification: 1990."), S.geschichte),
  v("b2_v_krieg", "noun", "Krieg", "der", ["war"], ["die Kriege", "Kriege"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.geschichte),
  v("b2_v_grenze", "noun", "Grenze", "die", ["border", "limit"], ["die Grenzen", "Grenzen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.geschichte),
  v("b2_v_erinnerung", "noun", "Erinnerung", "die", ["memory", "remembrance"], ["die Erinnerungen", "Erinnerungen"],
    bi("-ung → feminin. Erinnerung an + Akkusativ.", "-ung → feminine. Erinnerung an + accusative."), S.geschichte),
  v("b2_v_zeitzeuge", "noun", "Zeitzeuge", "der", ["contemporary witness"], ["die Zeitzeugen", "Zeitzeugen"],
    bi("Maskulin auf -e: n-Deklination — den Zeitzeugen.", "Masculine in -e: n-declension — den Zeitzeugen."), S.geschichte),
  v("b2_v_fliehen", "verb", "fliehen", "sein", ["to flee", "flee"], ["geflohen"],
    bi("Bewegung → sein. ie → o: geflohen.", "Movement → sein. ie → o: geflohen."), S.geschichte),
  v("b2_v_ereignen", "verb", "sich ereignen", "haben", ["to occur", "to happen", "occur"], ["ereignet"],
    bi("Reflexiv, er- untrennbar: Es hat sich ereignet.", "Reflexive, er- inseparable: Es hat sich ereignet."), S.geschichte),
  v("b2_v_berichten", "verb", "berichten", "haben", ["to report", "report"], ["berichtet"],
    bi("be- → kein ge-. Berichten über + Akkusativ.", "be- → no ge-. Berichten über + accusative."), S.geschichte),

  /* ------------------------------------------------ s10 Ethik & Argumentation */
  v("b2_v_wert", "noun", "Wert", "der", ["value"], ["die Werte", "Werte"],
    bi("Maskulin, Plural -e. Werte = values.", "Masculine, plural -e. Werte = values."), S.ethik),
  v("b2_v_dilemma", "noun", "Dilemma", "das", ["dilemma"], ["die Dilemmas", "Dilemmas", "die Dilemmata", "Dilemmata"],
    bi("Neutrum; Plural Dilemmas oder Dilemmata.", "Neuter; plural Dilemmas or Dilemmata."), S.ethik),
  v("b2_v_gegenargument", "noun", "Gegenargument", "das", ["counter-argument"], ["die Gegenargumente", "Gegenargumente"],
    bi("-ment → neutrum, Plural -e.", "-ment → neuter, plural -e."), S.ethik),
  v("b2_v_einwand", "noun", "Einwand", "der", ["objection"], ["die Einwände", "Einwände"],
    bi("Umlaut + -e: die Einwände.", "Umlaut plus -e: die Einwände."), S.ethik),
  v("b2_v_haltung", "noun", "Haltung", "die", ["attitude", "stance"], ["die Haltungen", "Haltungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.ethik),
  v("b2_v_standpunkt", "noun", "Standpunkt", "der", ["point of view", "standpoint"], ["die Standpunkte", "Standpunkte"],
    bi("der Punkt → die Punkte.", "der Punkt → die Punkte."), S.ethik),
  v("b2_v_ueberzeugen", "verb", "überzeugen", "haben", ["to convince", "convince"], ["überzeugt"],
    bi("Hier ist über- untrennbar: überzeugt, kein ge-.", "Here über- is inseparable: überzeugt, no ge-."), S.ethik),
  v("b2_v_abwaegen", "verb", "abwägen", "haben", ["to weigh up", "weigh up"], ["abgewogen"],
    bi("Trennbar, unregelmäßig: ab-ge-wogen.", "Separable, irregular: ab-ge-wogen."), S.ethik),
  v("b2_v_befuerworten", "verb", "befürworten", "haben", ["to support", "to advocate", "support"], ["befürwortet"],
    bi("be- → kein ge-: befürwortet.", "be- → no ge-: befürwortet."), S.ethik),
  v("b2_v_ablehnen", "verb", "ablehnen", "haben", ["to reject", "to decline", "reject"], ["abgelehnt"],
    bi("Trennbar: ab-ge-lehnt.", "Separable: ab-ge-lehnt."), S.ethik),

  /* ------------------------------------------------ s11 Textsorten & Stil */
  v("b2_v_textsorte", "noun", "Textsorte", "die", ["text type"], ["die Textsorten", "Textsorten"],
    bi("die Sorte → die Sorten.", "die Sorte → die Sorten."), S.stil),
  v("b2_v_kommentar", "noun", "Kommentar", "der", ["commentary", "comment"], ["die Kommentare", "Kommentare"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.stil),
  v("b2_v_leserbrief", "noun", "Leserbrief", "der", ["letter to the editor"], ["die Leserbriefe", "Leserbriefe"],
    bi("der Brief → die Briefe.", "der Brief → die Briefe."), S.stil),
  v("b2_v_absatz", "noun", "Absatz", "der", ["paragraph"], ["die Absätze", "Absätze"],
    bi("Umlaut + -e: die Absätze.", "Umlaut plus -e: die Absätze."), S.stil),
  v("b2_v_verfasser", "noun", "Verfasser", "der", ["author", "writer"], ["die Verfasser", "Verfasser"],
    bi("-er → maskulin, Plural unverändert. Die Verfasserin.", "-er → masculine, plural unchanged. Die Verfasserin."), S.stil),
  v("b2_v_register", "noun", "Register", "das", ["register (of language)"], ["die Register", "Register"],
    bi("Neutrum auf -er: Plural unverändert.", "Neuter in -er: plural unchanged."), S.stil),
  v("b2_v_gliedern", "verb", "gliedern", "haben", ["to structure", "to organise", "structure"], ["gegliedert"],
    bi("Regelmäßig: gegliedert. Die Gliederung.", "Regular: gegliedert. Die Gliederung."), S.stil),
  v("b2_v_betonen", "verb", "betonen", "haben", ["to stress", "to emphasise", "stress"], ["betont"],
    bi("be- → kein ge-: betont.", "be- → no ge-: betont."), S.stil),

  /* ------------------------------------------------ s12 Prüfung */
  v("b2_v_gliederung", "noun", "Gliederung", "die", ["outline", "structure"], ["die Gliederungen", "Gliederungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.pruefung),
  v("b2_v_aspekt", "noun", "Aspekt", "der", ["aspect"], ["die Aspekte", "Aspekte"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.pruefung),
  v("b2_v_struktur", "noun", "Struktur", "die", ["structure"], ["die Strukturen", "Strukturen"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.pruefung),
  v("b2_v_bewertung", "noun", "Bewertung", "die", ["assessment", "evaluation"], ["die Bewertungen", "Bewertungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.pruefung),
  v("b2_v_diskussion", "noun", "Diskussion", "die", ["discussion"], ["die Diskussionen", "Diskussionen"],
    bi("-ion → feminin, Plural -en.", "-ion → feminine, plural -en."), S.pruefung),
  v("b2_v_teilnehmer", "noun", "Teilnehmer", "der", ["participant"], ["die Teilnehmer", "Teilnehmer"],
    bi("-er → maskulin, Plural unverändert. Die Teilnehmerin.", "-er → masculine, plural unchanged. Die Teilnehmerin."), S.pruefung),
  v("b2_v_vortragen", "verb", "vortragen", "haben", ["to present", "to deliver (a talk)", "present"], ["vorgetragen"],
    bi("Trennbar: vor-ge-tragen. Präsens: er trägt vor.", "Separable: vor-ge-tragen. Present: er trägt vor."), S.pruefung),
  v("b2_v_einhaken", "verb", "einhaken", "haben", ["to interject", "to come in (on a point)", "interject"], ["eingehakt"],
    bi("Trennbar: ein-ge-hakt. Darf ich kurz einhaken?", "Separable: ein-ge-hakt. Darf ich kurz einhaken?"), S.pruefung),

  /* ================================================================
   * The rest of the syllabus's words, so that what the map lists for a
   * section is exactly what the drill asks. Appended, never interleaved.
   * ================================================================ */

  /* s01 */
  v("b2_v_anfrage", "noun", "Anfrage", "die", ["enquiry", "inquiry", "request"], ["die Anfragen", "Anfragen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.arbeit),
  v("b2_v_absage", "noun", "Absage", "die", ["refusal", "cancellation", "rejection"], ["die Absagen", "Absagen"],
    bi("-e → feminin, Plural -n. Eine Absage bekommen.", "-e → feminine, plural -n. Eine Absage bekommen."), S.arbeit),
  v("b2_v_homeoffice", "noun", "Homeoffice", "das", ["working from home", "home office"], ["die Homeoffices", "Homeoffices"],
    bi("Neutrum; im Homeoffice arbeiten.", "Neuter; im Homeoffice arbeiten."), S.arbeit),
  v("b2_v_fachkraft", "noun", "Fachkraft", "die", ["skilled worker", "specialist"], ["die Fachkräfte", "Fachkräfte"],
    bi("die Kraft → die Kräfte. Der Fachkräftemangel.", "die Kraft → die Kräfte. Der Fachkräftemangel."), S.arbeit),
  v("b2_v_fachkraeftemangel", "noun", "Fachkräftemangel", "der", ["skills shortage", "shortage of skilled workers"], [NO_PLURAL],
    bi("Maskulin, kein Plural.", "Masculine, no plural."), S.arbeit),
  v("b2_v_tarifvertrag", "noun", "Tarifvertrag", "der", ["collective agreement"], ["die Tarifverträge", "Tarifverträge"],
    bi("der Vertrag → die Verträge.", "der Vertrag → die Verträge."), S.arbeit),
  v("b2_v_gewerkschaft", "noun", "Gewerkschaft", "die", ["trade union"], ["die Gewerkschaften", "Gewerkschaften"],
    bi("-schaft → feminin, Plural -en.", "-schaft → feminine, plural -en."), S.arbeit),
  v("b2_v_selbststaendigkeit", "noun", "Selbstständigkeit", "die", ["self-employment", "independence"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural.", "-keit → feminine, no plural."), S.arbeit),

  /* s02 */
  v("b2_v_digitalisierung", "noun", "Digitalisierung", "die", ["digitalisation", "digitization"], [NO_PLURAL],
    bi("-ung → feminin, kein Plural.", "-ung → feminine, no plural."), S.technik),
  v("b2_v_intelligenz", "noun", "Intelligenz", "die", ["intelligence"], [NO_PLURAL],
    bi("Feminin, kein Plural. Künstliche Intelligenz (KI).", "Feminine, no plural. Künstliche Intelligenz (KI)."), S.technik),
  v("b2_v_algorithmus", "noun", "Algorithmus", "der", ["algorithm"], ["die Algorithmen", "Algorithmen"],
    bi("-us → -en: die Algorithmen.", "-us → -en: die Algorithmen."), S.technik),
  v("b2_v_daten", "noun", "Daten", "die", ["data"], [NO_PLURAL],
    bi("Nur Plural (Singular: das Datum, aber = date).", "Plural only (singular das Datum means the date)."), S.technik),
  v("b2_v_automatisierung", "noun", "Automatisierung", "die", ["automation"], [NO_PLURAL],
    bi("-ung → feminin, kein Plural.", "-ung → feminine, no plural."), S.technik),
  v("b2_v_risiko", "noun", "Risiko", "das", ["risk"], ["die Risiken", "Risiken"],
    bi("Neutrum; Plural -en: die Risiken.", "Neuter; plural -en: die Risiken."), S.technik),
  v("b2_v_chance", "noun", "Chance", "die", ["opportunity", "chance"], ["die Chancen", "Chancen"],
    bi("-e → feminin, Plural -n. Französisch ausgesprochen.", "-e → feminine, plural -n. Pronounced the French way."), S.technik),
  v("b2_v_abhaengigkeit", "noun", "Abhängigkeit", "die", ["dependence", "dependency"], ["die Abhängigkeiten", "Abhängigkeiten"],
    bi("-keit → feminin, Plural -en.", "-keit → feminine, plural -en."), S.technik),
  v("b2_v_sicherheit", "noun", "Sicherheit", "die", ["security", "safety"], ["die Sicherheiten", "Sicherheiten"],
    bi("-heit → feminin. Die Datensicherheit.", "-heit → feminine. Die Datensicherheit."), S.technik),

  /* s03 */
  v("b2_v_demokratie", "noun", "Demokratie", "die", ["democracy"], ["die Demokratien", "Demokratien"],
    bi("-ie → feminin, Plural -n.", "-ie → feminine, plural -n."), S.politik),
  v("b2_v_bundestag", "noun", "Bundestag", "der", ["Bundestag", "German federal parliament"], ["die Bundestage", "Bundestage"],
    bi("der Tag → die Tage (Plural selten).", "der Tag → die Tage (plural rare)."), S.politik),
  v("b2_v_parlament", "noun", "Parlament", "das", ["parliament"], ["die Parlamente", "Parlamente"],
    bi("-ment → neutrum, Plural -e.", "-ment → neuter, plural -e."), S.politik),
  v("b2_v_meinungsfreiheit", "noun", "Meinungsfreiheit", "die", ["freedom of speech", "freedom of opinion"], [NO_PLURAL],
    bi("-heit → feminin, kein Plural.", "-heit → feminine, no plural."), S.politik),
  v("b2_v_pressefreiheit", "noun", "Pressefreiheit", "die", ["freedom of the press"], [NO_PLURAL],
    bi("-heit → feminin, kein Plural.", "-heit → feminine, no plural."), S.politik),
  v("b2_v_kommentieren", "verb", "kommentieren", "haben", ["to comment", "comment"], ["kommentiert"],
    bi("-ieren → kein ge-: kommentiert.", "-ieren → no ge-: kommentiert."), S.politik),
  v("b2_v_oeffentlichkeit", "noun", "Öffentlichkeit", "die", ["the public"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural. In der Öffentlichkeit.", "-keit → feminine, no plural. In der Öffentlichkeit."), S.politik),

  /* s04 */
  v("b2_v_nachhaltigkeit", "noun", "Nachhaltigkeit", "die", ["sustainability"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural.", "-keit → feminine, no plural."), S.klima),
  v("b2_v_treibhauseffekt", "noun", "Treibhauseffekt", "der", ["greenhouse effect"], ["die Treibhauseffekte", "Treibhauseffekte"],
    bi("der Effekt → die Effekte.", "der Effekt → die Effekte."), S.klima),
  v("b2_v_artenvielfalt", "noun", "Artenvielfalt", "die", ["biodiversity"], [NO_PLURAL],
    bi("Feminin, kein Plural.", "Feminine, no plural."), S.klima),
  v("b2_v_energiewende", "noun", "Energiewende", "die", ["energy transition"], ["die Energiewenden", "Energiewenden"],
    bi("die Wende → die Wenden.", "die Wende → die Wenden."), S.klima),
  v("b2_v_fussabdruck", "noun", "Fußabdruck", "der", ["footprint"], ["die Fußabdrücke", "Fußabdrücke"],
    bi("der Druck → die Drücke. Der ökologische Fußabdruck.", "der Druck → die Drücke. Der ökologische Fußabdruck."), S.klima),
  v("b2_v_kreislaufwirtschaft", "noun", "Kreislaufwirtschaft", "die", ["circular economy"], [NO_PLURAL],
    bi("-schaft → feminin, kein Plural.", "-schaft → feminine, no plural."), S.klima),
  v("b2_v_grafik", "noun", "Grafik", "die", ["chart", "graphic", "diagram"], ["die Grafiken", "Grafiken"],
    bi("Feminin, Plural -en. Die Grafik zeigt …", "Feminine, plural -en. Die Grafik zeigt …"), S.klima),
  v("b2_v_statistik", "noun", "Statistik", "die", ["statistics"], ["die Statistiken", "Statistiken"],
    bi("Feminin, Plural -en.", "Feminine, plural -en."), S.klima),
  v("b2_v_tabelle", "noun", "Tabelle", "die", ["table (of data)"], ["die Tabellen", "Tabellen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.klima),
  v("b2_v_prognose", "noun", "Prognose", "die", ["forecast", "prognosis"], ["die Prognosen", "Prognosen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.klima),
  v("b2_v_prognostizieren", "verb", "prognostizieren", "haben", ["to forecast", "to predict", "forecast"], ["prognostiziert"],
    bi("-ieren → kein ge-: prognostiziert.", "-ieren → no ge-: prognostiziert."), S.klima),
  v("b2_v_erreichen", "verb", "erreichen", "haben", ["to reach", "to achieve", "reach"], ["erreicht"],
    bi("er- → kein ge-: erreicht. Ein Ziel erreichen.", "er- → no ge-: erreicht. Ein Ziel erreichen."), S.klima),
  v("b2_v_verfehlen", "verb", "verfehlen", "haben", ["to miss (a target)", "miss"], ["verfehlt"],
    bi("ver- → kein ge-: verfehlt. Ein Ziel verfehlen.", "ver- → no ge-: verfehlt. Ein Ziel verfehlen."), S.klima),
  v("b2_v_uebernehmen", "verb", "übernehmen", "haben", ["to take on", "to take over", "take on"], ["übernommen"],
    bi("Hier ist über- untrennbar: übernommen. Verantwortung übernehmen.", "Here über- is inseparable: übernommen. Verantwortung übernehmen."), S.klima),

  /* s05 */
  v("b2_v_globalisierung", "noun", "Globalisierung", "die", ["globalisation", "globalization"], [NO_PLURAL],
    bi("-ung → feminin, kein Plural.", "-ung → feminine, no plural."), S.wirtschaft),
  v("b2_v_handel", "noun", "Handel", "der", ["trade", "commerce"], [NO_PLURAL],
    bi("Maskulin, kein Plural. Der Handel mit.", "Masculine, no plural. Der Handel mit."), S.wirtschaft),
  v("b2_v_export", "noun", "Export", "der", ["export"], ["die Exporte", "Exporte"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.wirtschaft),
  v("b2_v_import", "noun", "Import", "der", ["import"], ["die Importe", "Importe"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.wirtschaft),
  v("b2_v_inflation", "noun", "Inflation", "die", ["inflation"], ["die Inflationen", "Inflationen"],
    bi("-ion → feminin; Plural selten.", "-ion → feminine; plural rare."), S.wirtschaft),
  v("b2_v_krise", "noun", "Krise", "die", ["crisis"], ["die Krisen", "Krisen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.wirtschaft),
  v("b2_v_konsum", "noun", "Konsum", "der", ["consumption"], [NO_PLURAL],
    bi("Maskulin, kein Plural. Betonung auf der zweiten Silbe.", "Masculine, no plural. Stress on the second syllable."), S.wirtschaft),
  v("b2_v_verbraucher", "noun", "Verbraucher", "der", ["consumer"], ["die Verbraucher", "Verbraucher"],
    bi("-er → maskulin, Plural unverändert. Die Verbraucherin.", "-er → masculine, plural unchanged. Die Verbraucherin."), S.wirtschaft),
  v("b2_v_arbeitslosigkeit", "noun", "Arbeitslosigkeit", "die", ["unemployment"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural.", "-keit → feminine, no plural."), S.wirtschaft),
  v("b2_v_wohlstand", "noun", "Wohlstand", "der", ["prosperity", "affluence"], [NO_PLURAL],
    bi("Maskulin, kein Plural.", "Masculine, no plural."), S.wirtschaft),
  v("b2_v_ungleichheit", "noun", "Ungleichheit", "die", ["inequality"], ["die Ungleichheiten", "Ungleichheiten"],
    bi("-heit → feminin, Plural -en.", "-heit → feminine, plural -en."), S.wirtschaft),

  /* s06 */
  v("b2_v_redewendung", "noun", "Redewendung", "die", ["idiom", "expression"], ["die Redewendungen", "Redewendungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.kultur),
  v("b2_v_erbe", "noun", "Erbe", "das", ["heritage", "inheritance"], [NO_PLURAL],
    bi("Neutrum, kein Plural. Das kulturelle Erbe. (der Erbe = the heir!)", "Neuter, no plural. Das kulturelle Erbe. (der Erbe = the heir!)"), S.kultur),
  v("b2_v_vielfalt", "noun", "Vielfalt", "die", ["diversity", "variety"], [NO_PLURAL],
    bi("Feminin, kein Plural.", "Feminine, no plural."), S.kultur),
  v("b2_v_interpretieren", "verb", "interpretieren", "haben", ["to interpret", "interpret"], ["interpretiert"],
    bi("-ieren → kein ge-: interpretiert.", "-ieren → no ge-: interpretiert."), S.kultur),
  v("b2_v_interpretation", "noun", "Interpretation", "die", ["interpretation"], ["die Interpretationen", "Interpretationen"],
    bi("-ion → feminin, Plural -en.", "-ion → feminine, plural -en."), S.kultur),
  v("b2_v_atmosphaere", "noun", "Atmosphäre", "die", ["atmosphere"], ["die Atmosphären", "Atmosphären"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.kultur),

  /* s07 */
  v("b2_v_achtsamkeit", "noun", "Achtsamkeit", "die", ["mindfulness"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural.", "-keit → feminine, no plural."), S.psyche),
  v("b2_v_wohlbefinden", "noun", "Wohlbefinden", "das", ["well-being"], [NO_PLURAL],
    bi("Substantivierter Infinitiv → neutrum, kein Plural.", "Nominalised infinitive → neuter, no plural."), S.psyche),
  v("b2_v_ausloesen", "verb", "auslösen", "haben", ["to trigger", "to cause", "trigger"], ["ausgelöst"],
    bi("Trennbar: aus-ge-löst.", "Separable: aus-ge-löst."), S.psyche),
  v("b2_v_wahrscheinlichkeit", "noun", "Wahrscheinlichkeit", "die", ["probability", "likelihood"], ["die Wahrscheinlichkeiten", "Wahrscheinlichkeiten"],
    bi("-keit → feminin, Plural -en.", "-keit → feminine, plural -en."), S.psyche),
  v("b2_v_alltag", "noun", "Alltag", "der", ["everyday life", "daily routine"], [NO_PLURAL],
    bi("Maskulin, kein Plural. Den Alltag bewältigen.", "Masculine, no plural. Den Alltag bewältigen."), S.psyche),

  /* s08 */
  v("b2_v_bildungspolitik", "noun", "Bildungspolitik", "die", ["education policy"], [NO_PLURAL],
    bi("Feminin, kein Plural.", "Feminine, no plural."), S.forschung),
  v("b2_v_chancengleichheit", "noun", "Chancengleichheit", "die", ["equal opportunities"], [NO_PLURAL],
    bi("-heit → feminin, kein Plural.", "-heit → feminine, no plural."), S.forschung),
  v("b2_v_mehrsprachigkeit", "noun", "Mehrsprachigkeit", "die", ["multilingualism"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural.", "-keit → feminine, no plural."), S.forschung),
  v("b2_v_muttersprache", "noun", "Muttersprache", "die", ["mother tongue", "native language"], ["die Muttersprachen", "Muttersprachen"],
    bi("die Sprache → die Sprachen.", "die Sprache → die Sprachen."), S.forschung),
  v("b2_v_fremdsprache", "noun", "Fremdsprache", "die", ["foreign language"], ["die Fremdsprachen", "Fremdsprachen"],
    bi("die Sprache → die Sprachen.", "die Sprache → die Sprachen."), S.forschung),
  v("b2_v_wortschatz", "noun", "Wortschatz", "der", ["vocabulary"], ["die Wortschätze", "Wortschätze"],
    bi("der Schatz → die Schätze: Umlaut + -e.", "der Schatz → die Schätze: umlaut plus -e."), S.forschung),
  v("b2_v_wortfamilie", "noun", "Wortfamilie", "die", ["word family"], ["die Wortfamilien", "Wortfamilien"],
    bi("die Familie → die Familien.", "die Familie → die Familien."), S.forschung),

  /* s09 */
  v("b2_v_geschichte", "noun", "Geschichte", "die", ["history", "story"], ["die Geschichten", "Geschichten"],
    bi("-e → feminin. Als history kein Plural; als story: die Geschichten.", "-e → feminine. As history no plural; as story: die Geschichten."), S.geschichte),
  v("b2_v_mauer", "noun", "Mauer", "die", ["wall"], ["die Mauern", "Mauern"],
    bi("Feminin, Plural -n. Die Berliner Mauer.", "Feminine, plural -n. Die Berliner Mauer."), S.geschichte),
  v("b2_v_mauerfall", "noun", "Mauerfall", "der", ["fall of the Wall"], [NO_PLURAL],
    bi("Maskulin, kein Plural. 9. November 1989.", "Masculine, no plural. 9 November 1989."), S.geschichte),
  v("b2_v_wende", "noun", "Wende", "die", ["turning point", "the changes of 1989"], ["die Wenden", "Wenden"],
    bi("-e → feminin, Plural -n. Die Wende = 1989/90.", "-e → feminine, plural -n. Die Wende = 1989/90."), S.geschichte),
  v("b2_v_nachkriegszeit", "noun", "Nachkriegszeit", "die", ["post-war period"], ["die Nachkriegszeiten", "Nachkriegszeiten"],
    bi("die Zeit → die Zeiten.", "die Zeit → die Zeiten."), S.geschichte),
  v("b2_v_teilung", "noun", "Teilung", "die", ["division", "partition"], ["die Teilungen", "Teilungen"],
    bi("-ung → feminin, Plural -en. Die deutsche Teilung.", "-ung → feminine, plural -en. Die deutsche Teilung."), S.geschichte),
  v("b2_v_ausloeser", "noun", "Auslöser", "der", ["trigger"], ["die Auslöser", "Auslöser"],
    bi("-er → maskulin, Plural unverändert.", "-er → masculine, plural unchanged."), S.geschichte),
  v("b2_v_entwicklung", "noun", "Entwicklung", "die", ["development"], ["die Entwicklungen", "Entwicklungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.geschichte),
  v("b2_v_zeitgeschehen", "noun", "Zeitgeschehen", "das", ["current affairs", "current events"], [NO_PLURAL],
    bi("Substantivierter Infinitiv → neutrum, kein Plural.", "Nominalised infinitive → neuter, no plural."), S.geschichte),

  /* s10 */
  v("b2_v_ethik", "noun", "Ethik", "die", ["ethics"], [NO_PLURAL],
    bi("Feminin, kein Plural. Adjektiv: ethisch.", "Feminine, no plural. Adjective: ethisch."), S.ethik),
  v("b2_v_gerechtigkeit", "noun", "Gerechtigkeit", "die", ["justice", "fairness"], [NO_PLURAL],
    bi("-keit → feminin, kein Plural. Adjektiv: gerecht.", "-keit → feminine, no plural. Adjective: gerecht."), S.ethik),
  v("b2_v_antithese", "noun", "Antithese", "die", ["antithesis"], ["die Antithesen", "Antithesen"],
    bi("-e → feminin, Plural -n. These – Antithese – Synthese.", "-e → feminine, plural -n. These – Antithese – Synthese."), S.ethik),
  v("b2_v_fazit", "noun", "Fazit", "das", ["conclusion", "upshot"], ["die Fazits", "Fazits", "die Fazite", "Fazite"],
    bi("Neutrum; Plural Fazits oder Fazite. Ein Fazit ziehen.", "Neuter; plural Fazits or Fazite. Ein Fazit ziehen."), S.ethik),
  v("b2_v_konsequenz", "noun", "Konsequenz", "die", ["consequence"], ["die Konsequenzen", "Konsequenzen"],
    bi("Feminin, Plural -en. Die Konsequenzen ziehen.", "Feminine, plural -en. Die Konsequenzen ziehen."), S.ethik),

  /* s11 */
  v("b2_v_einleitung", "noun", "Einleitung", "die", ["introduction"], ["die Einleitungen", "Einleitungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.stil),
  v("b2_v_hauptteil", "noun", "Hauptteil", "der", ["main part", "body"], ["die Hauptteile", "Hauptteile"],
    bi("der Teil → die Teile.", "der Teil → die Teile."), S.stil),
  v("b2_v_schluss", "noun", "Schluss", "der", ["conclusion", "end"], ["die Schlüsse", "Schlüsse"],
    bi("Umlaut + -e: die Schlüsse. Zum Schluss.", "Umlaut plus -e: die Schlüsse. Zum Schluss."), S.stil),
  v("b2_v_stil", "noun", "Stil", "der", ["style"], ["die Stile", "Stile"],
    bi("Maskulin, Plural -e.", "Masculine, plural -e."), S.stil),
  v("b2_v_kohaerenz", "noun", "Kohärenz", "die", ["coherence"], [NO_PLURAL],
    bi("Feminin, kein Plural.", "Feminine, no plural."), S.stil),
  v("b2_v_wiederholung", "noun", "Wiederholung", "die", ["repetition", "revision"], ["die Wiederholungen", "Wiederholungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en."), S.stil),
  v("b2_v_vermeiden", "verb", "vermeiden", "haben", ["to avoid", "avoid"], ["vermieden"],
    bi("ei → ie: vermieden. ver- → kein ge-.", "ei → ie: vermieden. ver- → no ge-."), S.stil),
  v("b2_v_aussage", "noun", "Aussage", "die", ["statement"], ["die Aussagen", "Aussagen"],
    bi("-e → feminin, Plural -n.", "-e → feminine, plural -n."), S.stil),

  /* s12 */
  v("b2_v_nachfragen", "verb", "nachfragen", "haben", ["to ask (a follow-up question)", "to enquire", "ask"], ["nachgefragt"],
    bi("Trennbar: nach-ge-fragt.", "Separable: nach-ge-fragt."), S.pruefung),
  v("b2_v_aufgabenerfuellung", "noun", "Aufgabenerfüllung", "die", ["task fulfilment"], [NO_PLURAL],
    bi("-ung → feminin, kein Plural. Ein Bewertungskriterium.", "-ung → feminine, no plural. An assessment criterion."), S.pruefung),
  v("b2_v_pruefer", "noun", "Prüfer", "der", ["examiner"], ["die Prüfer", "Prüfer"],
    bi("-er → maskulin, Plural unverändert. Die Prüferin.", "-er → masculine, plural unchanged. Die Prüferin."), S.pruefung)
];

export const B2_GRAMMAR: readonly GrammarItem[] = [
  /* ---------------------------------------------------------- Konjunktiv I */
  g("b2_g1a", G.kon1, "Er sagt, er ___ krank. (sein)", bi("Konjunktiv I", "Konjunktiv I"), ["sei"],
    bi("sein → sei: die Form, die den Konjunktiv I am klarsten zeigt.", "sein → sei: the form that shows Konjunktiv I most clearly."), S.arbeit),
  g("b2_g1b", G.kon1, "Sie behauptet, sie ___ keine Zeit. (haben)", bi("Konjunktiv I", "Konjunktiv I"), ["habe"],
    bi("haben → habe (3. Person).", "haben → habe (third person)."), S.arbeit),
  g("b2_g1c", G.kon1, "Der Minister erklärte, man ___ das Problem lösen. (werden)", bi("Konjunktiv I", "Konjunktiv I"), ["werde"],
    bi("werden → werde.", "werden → werde."), S.arbeit),
  g("b2_g1d", G.kon1, "Sie sagten, sie ___ müde. (sein — Plural)", bi("Konjunktiv I", "Konjunktiv I"), ["seien"],
    bi("Plural: seien.", "Plural: seien."), S.arbeit),
  g("b2_g1e", G.kon1, "Er meint, er ___ das nicht. (wissen)", bi("Konjunktiv I", "Konjunktiv I"), ["wisse"],
    bi("wissen → wisse.", "wissen → wisse."), S.arbeit),
  g("b2_g1f", G.kon1, "Sie sagt, sie ___ morgen. (kommen)", bi("Konjunktiv I", "Konjunktiv I"), ["komme"],
    bi("kommen → komme: Stamm + e.", "kommen → komme: stem + e."), S.arbeit),

  /* ---------------------------------------------------------------- passive */
  g("b2_g2a", G.passiv, "Das Haus ___ letztes Jahr gebaut. (Präteritum)", bi("Passiv", "passive"), ["wurde"],
    bi("Präteritum Passiv: wurde + Partizip II.", "Simple-past passive: wurde + past participle."), S.technik),
  g("b2_g2b", G.passiv, "Der Brief ist gestern geschrieben ___ .", bi("Passiv Perfekt", "perfect passive"), ["worden"],
    bi("Perfekt Passiv: ist … worden — ohne ge-.", "Perfect passive: ist … worden — no ge-."), S.technik),
  g("b2_g2c", G.passiv, "Das Problem muss gelöst ___ .", bi("Passiv mit Modalverb", "passive with a modal"), ["werden"],
    bi("Modalverb + Partizip II + werden.", "Modal + past participle + werden."), S.technik),
  g("b2_g2d", G.passiv, "Die Straße ___ morgen repariert. (Präsens)", bi("Passiv", "passive"), ["wird"],
    bi("Präsens Passiv: wird.", "Present passive: wird."), S.technik),
  g("b2_g2e", G.passiv, "Die Tür war schon geschlossen ___ . (Plusquamperfekt)", bi("Passiv", "passive"), ["worden"],
    bi("war … worden.", "war … worden."), S.technik),
  g("b2_g2f", G.passiv, "Das Auto kann nicht mehr repariert ___ .", bi("Passiv mit Modalverb", "passive with a modal"), ["werden"],
    bi("kann + repariert + werden.", "kann + repariert + werden."), S.technik),

  /* ------------------------------------------------------------ participles */
  g("b2_g3a", G.part, "der ___ Zug (fahren — Partizip I)", bi("<code>der Zug</code>", "<code>der Zug</code>"), ["fahrende"],
    bi("Partizip I: Infinitiv + d + Adjektivendung: fahrend-e.", "Present participle: infinitive + d + adjective ending: fahrend-e."), S.klima),
  g("b2_g3b", G.part, "das ___ Fenster (öffnen — Partizip II)", bi("<code>das Fenster</code>", "<code>das Fenster</code>"), ["geöffnete"],
    bi("Partizip II + Endung: geöffnet-e.", "Past participle + ending: geöffnet-e."), S.klima),
  g("b2_g3c", G.part, "die ___ Kinder (spielen — Partizip I)", bi("<code>die Kinder</code> (Plural)", "<code>die Kinder</code> (plural)"), ["spielenden"],
    bi("Plural nach die: -en.", "Plural after die: -en."), S.klima),
  g("b2_g3d", G.part, "ein ___ Brief (schreiben — Partizip II)", bi("<code>der Brief</code>", "<code>der Brief</code>"), ["geschriebener"],
    bi("Nach ein, maskulin: -er.", "After ein, masculine: -er."), S.klima),
  g("b2_g3e", G.part, "die ___ Wohnung (renovieren — Partizip II)", bi("<code>die Wohnung</code>", "<code>die Wohnung</code>"), ["renovierte"],
    bi("-ieren-Verben: kein ge-: renoviert-e.", "-ieren verbs take no ge-: renoviert-e."), S.klima),
  g("b2_g3f", G.part, "der ___ Hund (bellen — Partizip I)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["bellende"],
    bi("bellend-e.", "bellend-e."), S.klima),

  /* --------------------------------------------------------- nominalisation */
  g("b2_g4a", G.nomen, "Die ___ des Zuges verzögert sich. (ankommen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Ankunft"],
    bi("ankommen → die Ankunft.", "ankommen → die Ankunft."), S.politik),
  g("b2_g4b", G.nomen, "Die ___ des Vertrags dauert lange. (prüfen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Prüfung"],
    bi("prüfen → die Prüfung.", "prüfen → die Prüfung."), S.politik),
  g("b2_g4c", G.nomen, "Nach der ___ des Gesetzes gab es Proteste. (ändern)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Änderung"],
    bi("ändern → die Änderung.", "ändern → die Änderung."), S.politik),
  g("b2_g4d", G.nomen, "Die ___ der Stadt begann um 1900. (entwickeln)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Entwicklung"],
    bi("entwickeln → die Entwicklung.", "entwickeln → die Entwicklung."), S.politik),
  g("b2_g4e", G.nomen, "Die ___ des Problems ist schwierig. (lösen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Lösung"],
    bi("lösen → die Lösung.", "lösen → die Lösung."), S.politik),
  g("b2_g4f", G.nomen, "Beim ___ sollte man Ruhe haben. (lesen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Lesen"],
    bi("Der Infinitiv als Nomen: das Lesen, beim Lesen.", "The infinitive as a noun: das Lesen, beim Lesen."), S.politik),

  /* --------------------------------------------------- genitive prepositions */
  g("b2_g5a", G.gpraep, "___ des schlechten Wetters blieben wir zu Hause.", bi("because of", "because of"), ["wegen", "aufgrund"],
    bi("wegen / aufgrund + Genitiv.", "wegen / aufgrund + genitive."), S.politik),
  g("b2_g5b", G.gpraep, "___ der Ferien ist die Schule geschlossen.", bi("during", "during"), ["während"],
    bi("während + Genitiv.", "während + genitive."), S.politik),
  g("b2_g5c", G.gpraep, "___ des Regens gingen wir spazieren.", bi("despite", "despite"), ["trotz"],
    bi("trotz + Genitiv.", "trotz + genitive."), S.politik),
  g("b2_g5d", G.gpraep, "___ der Stadt gibt es einen Wald.", bi("outside of", "outside of"), ["außerhalb"],
    bi("außerhalb + Genitiv.", "außerhalb + genitive."), S.politik),
  g("b2_g5e", G.gpraep, "___ der Arbeitszeit darf man nicht privat telefonieren.", bi("within", "within"), ["innerhalb"],
    bi("innerhalb + Genitiv.", "innerhalb + genitive."), S.politik),
  g("b2_g5f", G.gpraep, "___ des Flusses steht ein Hotel.", bi("on the far side of", "on the far side of"), ["jenseits"],
    bi("jenseits + Genitiv.", "jenseits + genitive."), S.politik),

  /* -------------------------------------------------------------- connectors */
  g("b2_g6a", G.konn, "Er spricht ___ Deutsch als auch Englisch.", bi("both … and", "both … and"), ["sowohl"],
    bi("sowohl … als auch.", "sowohl … als auch."), S.wirtschaft),
  g("b2_g6b", G.konn, "___ du kommst mit, oder du bleibst hier.", bi("either … or", "either … or"), ["entweder"],
    bi("entweder … oder.", "entweder … oder."), S.wirtschaft),
  g("b2_g6c", G.konn, "Sie ist ___ klug, sondern auch fleißig.", bi("not only … but also", "not only … but also"), ["nicht nur"],
    bi("nicht nur … sondern auch.", "nicht nur … sondern auch."), S.wirtschaft),
  g("b2_g6d", G.konn, "Ich mag ___ Kaffee noch Tee.", bi("neither … nor", "neither … nor"), ["weder"],
    bi("weder … noch.", "weder … noch."), S.wirtschaft),
  g("b2_g6e", G.konn, "___ mehr ich lerne, desto besser verstehe ich.", bi("the more … the", "the more … the"), ["je"],
    bi("je … desto (oder umso).", "je … desto (or umso)."), S.wirtschaft),
  g("b2_g6f", G.konn, "Zwar ist er müde, ___ arbeitet er weiter.", bi("but / nevertheless", "but / nevertheless"), ["aber", "trotzdem", "dennoch", "doch"],
    bi("zwar … aber / trotzdem / dennoch.", "zwar … aber / trotzdem / dennoch."), S.wirtschaft),

  /* ------------------------------------------ relative clauses, describing a chart */
  g("b2_g7a", G.rel, "der Bericht, ___ Ergebnisse überraschen", bi("Genitiv-Relativpronomen — <code>der Bericht</code>", "genitive relative pronoun — <code>der Bericht</code>"), ["dessen"],
    bi("Maskulin/Neutrum → dessen.", "Masculine/neuter → dessen."), S.klima),
  g("b2_g7b", G.rel, "die Länder, ___ Küsten bedroht sind", bi("Genitiv-Relativpronomen — Plural", "genitive relative pronoun — plural"), ["deren"],
    bi("Feminin/Plural → deren.", "Feminine/plural → deren."), S.klima),
  g("b2_g7c", G.rel, "Die Grafik ___, dass der Anteil gestiegen ist. (zeigen)", bi("Grafikbeschreibung", "describing a chart"), ["zeigt"],
    bi("Die Grafik zeigt, dass … — der Standardsatz.", "Die Grafik zeigt, dass … — the standard opener."), S.klima),

  /* --------------------------------------- modal particles, past Konjunktiv II */
  g("b2_g8a", G.partikel, "Komm ___ mit! (Partikel: Nachdruck, Ermunterung)", bi("Modalpartikel", "modal particle"), ["doch"],
    bi("doch im Imperativ: freundlicher Nachdruck.", "doch in the imperative: friendly insistence."), S.kultur),
  g("b2_g8b", G.partikel, "Ich hätte den Film gern ___. (sehen)", bi("Partizip II", "past participle"), ["gesehen"],
    bi("hätte + Partizip II: Konjunktiv II der Vergangenheit.", "hätte + past participle: past Konjunktiv II."), S.kultur),
  g("b2_g8c", G.partikel, "Wenn ich Zeit gehabt hätte, ___ ich gekommen.", bi("Konjunktiv II der Vergangenheit mit sein", "past Konjunktiv II with sein"), ["wäre"],
    bi("kommen → sein → wäre gekommen.", "kommen → sein → wäre gekommen."), S.kultur),

  /* ------------------------------------------- assumption: modals and Futur II */
  g("b2_g9a", G.vermut, "Er ___ krank sein — er sieht schlecht aus. (fast sicher)", bi("subjektives Modalverb", "subjective modal"), ["muss"],
    bi("muss = sehr sichere Vermutung.", "muss = a near-certain assumption."), S.psyche),
  g("b2_g9b", G.vermut, "Bis morgen ___ ich den Bericht geschrieben haben. (werden)", bi("Futur II", "Futur II"), ["werde"],
    bi("Futur II: werde + Partizip II + haben.", "Futur II: werde + past participle + haben."), S.psyche),
  g("b2_g9c", G.vermut, "Sie ___ das vergessen haben. (wahrscheinlich, ~75 %)", bi("subjektives Modalverb", "subjective modal"), ["dürfte"],
    bi("dürfte = wahrscheinlich; könnte = möglich; muss = sicher.", "dürfte = probably; könnte = possibly; muss = certainly."), S.psyche),

  /* --------------------------------------------------- light-verb constructions */
  g("b2_g10a", G.fvg, "Der Chef stellt uns ein Auto zur ___.", bi("Funktionsverbgefüge: zur Verfügung stellen", "light verb: zur Verfügung stellen"), ["Verfügung"],
    bi("zur Verfügung stellen = bereitstellen.", "zur Verfügung stellen = to make available."), S.forschung),
  g("b2_g10b", G.fvg, "Diese Lösung kommt nicht in ___.", bi("Funktionsverbgefüge: in Frage kommen", "light verb: in Frage kommen"), ["Frage"],
    bi("in Frage kommen = möglich sein.", "in Frage kommen = to be an option."), S.forschung),
  g("b2_g10c", G.fvg, "Sie hat ihre Meinung zum ___ gebracht.", bi("Funktionsverbgefüge: zum Ausdruck bringen", "light verb: zum Ausdruck bringen"), ["Ausdruck"],
    bi("zum Ausdruck bringen = ausdrücken.", "zum Ausdruck bringen = to express."), S.forschung),

  /* ---------------------------------------------------- simple past, sequence */
  g("b2_g11a", G.praet, "Die Mauer ___ 1989. (fallen — Präteritum)", bi("starkes Verb im Präteritum", "strong verb in the simple past"), ["fiel"],
    bi("fallen → fiel.", "fallen → fiel."), S.geschichte),
  g("b2_g11b", G.praet, "Nachdem die Grenze geöffnet worden ___, strömten Tausende nach Westen.", bi("Plusquamperfekt Passiv", "pluperfect passive"), ["war"],
    bi("war … geöffnet worden — Plusquamperfekt im Passiv.", "war … geöffnet worden — pluperfect passive."), S.geschichte),
  g("b2_g11c", G.praet, "Zuerst gab es Proteste, ___ öffnete die Regierung die Grenze. (thereupon)", bi("temporaler Konnektor", "temporal connector"), ["daraufhin", "dann", "danach"],
    bi("daraufhin — als Folge, unmittelbar danach.", "daraufhin — thereupon, as a consequence."), S.geschichte),

  /* --------------------------------------------------- als ob, wish clauses */
  g("b2_g12a", G.irreal, "Er tut so, ___ ob er alles wüsste.", bi("irrealer Vergleich", "unreal comparison"), ["als"],
    bi("als ob + Konjunktiv II, Verb am Ende.", "als ob + Konjunktiv II, verb at the end."), S.ethik),
  g("b2_g12b", G.irreal, "Sie sieht aus, als ___ sie krank. (sein — Konjunktiv II)", bi("als + Verb direkt danach", "als + verb straight after"), ["wäre"],
    bi("Ohne ob rückt das Verb nach vorn: als wäre sie krank.", "Without ob the verb moves forward: als wäre sie krank."), S.ethik),
  g("b2_g12c", G.irreal, "Wenn ich ___ mehr Zeit hätte! (Partikel im Wunschsatz)", bi("Modalpartikel", "modal particle"), ["doch", "nur", "bloß"],
    bi("Wunschsatz: wenn … doch / nur / bloß + Konjunktiv II.", "Wish clause: wenn … doch / nur / bloß + Konjunktiv II."), S.ethik),

  /* -------------------------------------------------- TeKaMoLo, coherence */
  g("b2_g13a", G.stil, "Ich fahre morgen wegen des Wetters mit dem Zug ___ Berlin. (Lo — wohin?)", bi("Präposition", "preposition"), ["nach"],
    bi("Das Lokale steht am Ende: nach Berlin.", "Place comes last: nach Berlin."), S.stil),
  g("b2_g13b", G.stil, "Reihenfolge im Mittelfeld: temporal, kausal, ___, lokal", bi("TeKaMoLo", "TeKaMoLo"), ["modal"],
    bi("Te-Ka-Mo-Lo: wann, warum, wie, wo(hin).", "Te-Ka-Mo-Lo: when, why, how, where."), S.stil),
  g("b2_g13c", G.stil, "Wie bereits ___, ist das Thema komplex. (erwähnen — Partizip II)", bi("Verweiswort", "reference phrase"), ["erwähnt"],
    bi("Wie bereits erwähnt — Textkohärenz.", "Wie bereits erwähnt — coherence."), S.stil),

  /* ------------------------------------------------------ discussion phrases */
  g("b2_g14a", G.disk, "Darf ich kurz ___? (interject)", bi("Redemittel", "phrase"), ["einhaken"],
    bi("Darf ich kurz einhaken? — höflich unterbrechen.", "Darf ich kurz einhaken? — interrupting politely."), S.pruefung),
  g("b2_g14b", G.disk, "Ich sehe das ähnlich, ___ … (however)", bi("Einschränkung", "qualification"), ["allerdings"],
    bi("allerdings — Einschränkung nach Zustimmung.", "allerdings — a qualification after agreeing."), S.pruefung),
  g("b2_g14c", G.disk, "___ lässt sich sagen, dass … (in conclusion)", bi("Schluss", "closing"), ["abschließend", "zusammenfassend"],
    bi("Abschließend / Zusammenfassend lässt sich sagen …", "Abschließend / Zusammenfassend lässt sich sagen …"), S.pruefung)
];

export const B2_TOPICS: readonly TopicItem[] = [
  {
    id: "b2_t1",
    section: S.kultur,
    name: bi("Konjunktiv II der Vergangenheit", "Past Konjunktiv II"),
    seedStage: 0,
    questions: [
      q("Wenn ich das gewusst ___, wäre ich gekommen.", bi("hätte / wäre", "hätte / wäre"), ["hätte"], bi("wissen → haben → hätte gewusst.", "wissen → haben → hätte gewusst.")),
      q("Er ___ früher kommen sollen.", bi("hätte / wäre", "hätte / wäre"), ["hätte"], bi("Modalverb in der Vergangenheit: hätte + Infinitiv + sollen.", "Modal in the past: hätte + infinitive + sollen.")),
      q("Wir ___ gewonnen, wenn du mitgespielt hättest.", bi("hätte / wäre", "hätte / wäre"), ["hätten"], bi("gewinnen → haben → hätten gewonnen.", "gewinnen → haben → hätten gewonnen.")),
      q("Ich ___ gern mitgekommen.", bi("hätte / wäre", "hätte / wäre"), ["wäre"], bi("mitkommen → sein → wäre mitgekommen.", "mitkommen → sein → wäre mitgekommen."))
    ]
  },
  {
    id: "b2_t2",
    section: S.technik,
    name: bi("Passiv-Ersatzformen", "Alternatives to the passive"),
    seedStage: 0,
    questions: [
      q("Das Problem lässt ___ leicht lösen.", bi("sich lassen + Infinitiv", "sich lassen + infinitive"), ["sich"], bi("sich lassen + Infinitiv = kann gelöst werden.", "sich lassen + infinitive = can be solved.")),
      q("Das Buch ist leicht ___ lesen.", bi("sein + zu + Infinitiv", "sein + zu + infinitive"), ["zu"], bi("sein + zu + Infinitiv = kann gelesen werden.", "sein + zu + infinitive = can be read.")),
      q("Die Aufgabe ist ___ . (lösen → Adjektiv auf -bar)", bi("-bar", "-bar"), ["lösbar"], bi("-bar = kann … werden.", "-bar = can be …")),
      q("___ darf hier nicht rauchen. (unpersönlich)", bi("Pronomen", "pronoun"), ["man"], bi("man + Aktiv ersetzt das Passiv.", "man + active replaces the passive."))
    ]
  },
  {
    id: "b2_t3",
    section: S.psyche,
    name: bi("Futur II", "Future perfect"),
    seedStage: 0,
    questions: [
      q("Bis morgen ___ ich die Arbeit beendet haben.", bi("werden", "werden"), ["werde"], bi("werden + Partizip II + haben.", "werden + past participle + haben.")),
      q("Er wird den Zug verpasst ___ .", bi("haben / sein", "haben / sein"), ["haben"], bi("verpassen → haben.", "verpassen → haben.")),
      q("Sie wird schon angekommen ___ .", bi("haben / sein", "haben / sein"), ["sein"], bi("ankommen → sein.", "ankommen → sein.")),
      q("Bis 2030 ___ sie das Haus gebaut haben. (sie — Plural)", bi("werden", "werden"), ["werden"], bi("Plural: werden.", "Plural: werden."))
    ]
  },
  {
    id: "b2_t4",
    section: S.klima,
    name: bi("Erweiterte Partizipialattribute", "Extended participle phrases"),
    seedStage: 0,
    questions: [
      q("die von der Firma ___ Produkte (entwickeln)", bi("Partizip II + Endung", "past participle + ending"), ["entwickelten"], bi("Plural nach die: entwickelt-en.", "Plural after die: entwickelt-en.")),
      q("der seit Jahren ___ Streit (andauern)", bi("Partizip I + Endung", "present participle + ending"), ["andauernde"], bi("Partizip I: andauernd-e.", "Present participle: andauernd-e.")),
      q("das gestern ___ Paket (liefern)", bi("Partizip II + Endung", "past participle + ending"), ["gelieferte"], bi("geliefert-e.", "geliefert-e.")),
      q("die im letzten Jahr ___ Gesetze (beschließen)", bi("Partizip II + Endung", "past participle + ending"), ["beschlossenen"], bi("beschlossen-en.", "beschlossen-en."))
    ]
  },
  {
    id: "b2_t5",
    section: S.forschung,
    name: bi("Verben mit Präpositionen", "Verbs with prepositions"),
    seedStage: 0,
    questions: [
      q("Er besteht ___ seiner Meinung.", bi("Präposition", "preposition"), ["auf"], bi("bestehen auf + Dativ.", "bestehen auf + dative.")),
      q("Sie leidet ___ Kopfschmerzen.", bi("Präposition", "preposition"), ["an", "unter"], bi("leiden an (Krankheit) / leiden unter (Belastung).", "leiden an (illness) / leiden unter (strain).")),
      q("Wir verzichten ___ das Auto.", bi("Präposition", "preposition"), ["auf"], bi("verzichten auf + Akkusativ.", "verzichten auf + accusative.")),
      q("Das hängt ___ dem Wetter ab.", bi("Präposition", "preposition"), ["von"], bi("abhängen von + Dativ.", "abhängen von + dative."))
    ]
  },
  {
    id: "b2_t6",
    section: S.psyche,
    name: bi("Modalverben in subjektiver Bedeutung", "Modal verbs used subjectively"),
    seedStage: 0,
    questions: [
      q("Er ___ reich sein — er fährt einen Porsche. (sichere Vermutung)", bi("Modalverb", "modal verb"), ["muss"], bi("muss = ich bin fast sicher.", "muss = I am almost certain.")),
      q("Sie ___ krank sein, sie war heute nicht da. (unsichere Vermutung)", bi("Modalverb", "modal verb"), ["könnte", "dürfte", "kann", "mag"], bi("könnte / dürfte = vielleicht.", "könnte / dürfte = perhaps.")),
      q("Er ___ ein guter Arzt sein — das behauptet er selbst.", bi("Modalverb", "modal verb"), ["will"], bi("will = er behauptet es über sich.", "will = he claims it about himself.")),
      q("Sie ___ sehr klug sein — das sagen alle.", bi("Modalverb", "modal verb"), ["soll"], bi("soll = man sagt / Gerücht.", "soll = people say / rumour."))
    ]
  },
  {
    id: "b2_t7",
    section: S.arbeit,
    name: bi("Indirekte Rede", "Reported speech"),
    seedStage: 0,
    questions: [
      q("Die Chefin sagte, sie ___ das Projekt abgeschlossen. (haben — K I)", bi("Konjunktiv I, Vergangenheit", "Konjunktiv I, past"), ["habe"], bi("Vergangenheit: habe + Partizip II.", "Past: habe + past participle.")),
      q("Er fragte, ob wir Zeit ___. (haben — K II als Ersatz)", bi("Ersatzform, weil K I = Indikativ", "fallback, since K I = indicative"), ["hätten"], bi("wir haben (K I) = Indikativ → wir hätten.", "wir haben (K I) = indicative → wir hätten.")),
      q("Sie meinte, sie ___ früher gegangen. (sein — K I)", bi("Konjunktiv I, Vergangenheit", "Konjunktiv I, past"), ["sei"], bi("gehen → sein → sei gegangen.", "gehen → sein → sei gegangen.")),
      q("Der Kollege sagte, er ___ morgen anrufen. (werden — K I)", bi("Konjunktiv I, Zukunft", "Konjunktiv I, future"), ["werde"], bi("werde + Infinitiv.", "werde + infinitive."))
    ]
  },
  {
    id: "b2_t8",
    section: S.politik,
    name: bi("Nominalisierung: vom Nebensatz zum Nomen", "Nominalisation: from clause to noun"),
    seedStage: 0,
    questions: [
      q("weil es regnete → ___ des Regens", bi("Präposition", "preposition"), ["wegen", "aufgrund"], bi("kausal: weil → wegen / aufgrund + Genitiv.", "causal: weil → wegen / aufgrund + genitive.")),
      q("obwohl er krank war → ___ seiner Krankheit", bi("Präposition", "preposition"), ["trotz"], bi("konzessiv: obwohl → trotz + Genitiv.", "concessive: obwohl → trotz + genitive.")),
      q("nachdem er angekommen war → nach seiner ___", bi("Nomen aus ankommen", "noun from ankommen"), ["Ankunft"], bi("temporal: nachdem → nach + Nomen.", "temporal: nachdem → nach + noun.")),
      q("damit die Luft sauberer wird → ___ Verbesserung der Luft", bi("Präposition + Artikel", "preposition + article"), ["zur"], bi("final: damit → zur + Nomen.", "purpose: damit → zur + noun."))
    ]
  },
  {
    id: "b2_t9",
    section: S.wirtschaft,
    name: bi("je … desto und die drei Ebenen", "je … desto and the three levels"),
    seedStage: 0,
    questions: [
      q("Je billiger ein Produkt ist, ___ schneller landet es im Müll.", bi("je … ___", "je … ___"), ["desto", "umso"], bi("je … desto / umso.", "je … desto / umso.")),
      q("Je mehr wir kaufen, desto mehr ___ wir. (verbrauchen — Verb direkt nach desto)", bi("Verb nach desto", "verb after desto"), ["verbrauchen"], bi("Nach desto folgt das Verb sofort.", "After desto the verb follows at once.")),
      q("Es regnet, ___ bleiben wir zu Hause. (Hauptsatz-Ebene: deshalb)", bi("kausal, Hauptsatz", "causal, main clause"), ["deshalb", "deswegen", "darum"], bi("Drei Ebenen: weil / deshalb / wegen.", "Three levels: weil / deshalb / wegen.")),
      q("Er arbeitet weiter, ___ er müde ist. (Nebensatz-Ebene: obwohl)", bi("konzessiv, Nebensatz", "concessive, subordinate clause"), ["obwohl"], bi("obwohl / trotzdem / trotz — dieselbe Idee, drei Bauarten.", "obwohl / trotzdem / trotz — one idea, three constructions."))
    ]
  },
  {
    id: "b2_t10",
    section: S.forschung,
    name: bi("Funktionsverbgefüge", "Light-verb constructions"),
    seedStage: 0,
    questions: [
      q("Wir müssen eine Entscheidung ___.", bi("Funktionsverb", "light verb"), ["treffen"], bi("eine Entscheidung treffen = entscheiden.", "eine Entscheidung treffen = to decide.")),
      q("Das Gesetz tritt morgen in ___.", bi("Nomen", "noun"), ["Kraft"], bi("in Kraft treten = gültig werden.", "in Kraft treten = to come into force.")),
      q("Sie nimmt die Hilfe in ___.", bi("Nomen", "noun"), ["Anspruch"], bi("in Anspruch nehmen = nutzen.", "in Anspruch nehmen = to make use of.")),
      q("Er hat sein Können unter ___ gestellt.", bi("Nomen", "noun"), ["Beweis"], bi("unter Beweis stellen = beweisen.", "unter Beweis stellen = to prove."))
    ]
  },
  {
    id: "b2_t11",
    section: S.geschichte,
    name: bi("Präteritum der starken Verben", "Simple past of strong verbs"),
    seedStage: 0,
    questions: [
      q("Der Krieg ___ 1939. (beginnen)", bi("Präteritum", "simple past"), ["begann"], bi("beginnen → begann.", "beginnen → begann.")),
      q("Viele Menschen ___ in den Westen. (fliehen)", bi("Präteritum", "simple past"), ["flohen"], bi("fliehen → floh, flohen.", "fliehen → floh, flohen.")),
      q("Die Stadt ___ geteilt. (bleiben)", bi("Präteritum", "simple past"), ["blieb"], bi("bleiben → blieb.", "bleiben → blieb.")),
      q("Deutschland ___ 1990 wiedervereinigt. (werden)", bi("Präteritum", "simple past"), ["wurde"], bi("werden → wurde.", "werden → wurde."))
    ]
  },
  {
    id: "b2_t12",
    section: S.ethik,
    name: bi("als ob & Wunschsätze", "als ob & wish clauses"),
    seedStage: 0,
    questions: [
      q("Er redet, als ob er der Chef ___. (sein)", bi("Konjunktiv II am Ende", "Konjunktiv II at the end"), ["wäre"], bi("als ob + Konjunktiv II, Verb am Ende.", "als ob + Konjunktiv II, verb at the end.")),
      q("Sie tut so, als ___ sie nichts davon. (wissen — K II)", bi("als + Verb direkt danach", "als + verb straight after"), ["wüsste"], bi("Ohne ob: als wüsste sie nichts.", "Without ob: als wüsste sie nichts.")),
      q("___ ich das nur gewusst! (wish about the past)", bi("Konjunktiv II der Vergangenheit", "past Konjunktiv II"), ["hätte"], bi("Hätte ich das nur gewusst! — Verb zuerst, ohne wenn.", "Hätte ich das nur gewusst! — verb first, no wenn.")),
      q("Wenn er ___ endlich käme! (Partikel)", bi("Modalpartikel im Wunschsatz", "modal particle in a wish"), ["doch", "nur", "bloß"], bi("doch / nur / bloß verstärken den Wunsch.", "doch / nur / bloß intensify the wish."))
    ]
  },
  {
    id: "b2_t13",
    section: S.stil,
    name: bi("TeKaMoLo und Verweiswörter", "TeKaMoLo and reference words"),
    seedStage: 0,
    questions: [
      q("Ich bin ___ wegen des Staus mit dem Auto nach Berlin gefahren. (Te: gestern — steht zuerst)", bi("temporale Angabe zuerst", "time expression first"), ["gestern"], bi("Temporal kommt vor kausal, modal, lokal.", "Time comes before cause, manner, place.")),
      q("Ich fahre morgen wegen des Wetters ___ nach Berlin. (Mo: mit dem Zug)", bi("modale Angabe vor der lokalen", "manner before place"), ["mit dem Zug"], bi("Modal vor lokal: mit dem Zug nach Berlin.", "Manner before place: mit dem Zug nach Berlin.")),
      q("Im ___ erkläre ich die Gründe. (what follows)", bi("Verweiswort", "reference word"), ["Folgenden"], bi("Im Folgenden — Großschreibung: substantiviert.", "Im Folgenden — capitalised: nominalised.")),
      q("Das Thema ist komplex; ___ ist es wichtig. (nevertheless — dennoch)", bi("Konnektor", "connector"), ["dennoch", "trotzdem"], bi("dennoch — gehobener als trotzdem.", "dennoch — more formal than trotzdem."))
    ]
  },
  {
    id: "b2_t14",
    section: S.pruefung,
    name: bi("Redemittel für die Diskussion", "Phrases for the discussion"),
    seedStage: 0,
    questions: [
      q("Das ___ mich nicht ganz. (überzeugen)", bi("Verb", "verb"), ["überzeugt"], bi("Das überzeugt mich nicht ganz. — höflicher Widerspruch.", "Das überzeugt mich nicht ganz. — polite disagreement.")),
      q("Könnten wir uns ___ einigen, dass …?", bi("da(r) + auf", "da(r) + auf"), ["darauf"], bi("sich einigen auf → darauf, dass …", "sich einigen auf → darauf, dass …")),
      q("Ein weiterer ___ ist die Finanzierung.", bi("Nomen", "noun"), ["Aspekt", "Punkt"], bi("Ein weiterer Aspekt / Punkt ist …", "Ein weiterer Aspekt / Punkt ist …")),
      q("Zunächst ___ ich die Vorteile nennen. (möchten)", bi("Modalverb", "modal verb"), ["möchte"], bi("Zunächst möchte ich … — der Einstieg.", "Zunächst möchte ich … — the opener."))
    ]
  }
];

export const B2_UPCOMING: readonly UpcomingTopic[] = [
  { title: bi("Nominalstil und Verbalstil", "Nominal and verbal style"),
    blurb: bi("Vom Nebensatz zur Nominalphrase — und zurück.", "From subordinate clause to noun phrase — and back.") },
  { title: bi("Konjunktiv I in der Presse", "Konjunktiv I in the press"),
    blurb: bi("Wie Zeitungen wiedergeben, was jemand gesagt hat.", "How newspapers report what someone said.") },
  { title: bi("Nomen-Verb-Verbindungen", "Noun–verb collocations"),
    blurb: bi("eine Entscheidung treffen, in Frage stellen, zur Verfügung stehen.", "eine Entscheidung treffen, in Frage stellen, zur Verfügung stehen.") },
  { title: bi("Satzklammer und Ausklammerung", "The verb bracket and what escapes it"),
    blurb: bi("Was darf hinter das Verb am Satzende?", "What is allowed after the final verb?") },
  { title: bi("Modalpartikeln", "Modal particles"),
    blurb: bi("doch, mal, ja, eben — die kleinen Wörter, die Ton machen.", "doch, mal, ja, eben — the little words that set the tone.") },
  { title: bi("Textkohärenz", "Text coherence"),
    blurb: bi("Konnektoren, die Absätze zusammenhalten: dabei, dagegen, folglich.", "Connectors that hold paragraphs together: dabei, dagegen, folglich.") }
];
