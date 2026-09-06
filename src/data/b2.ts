import type { Bilingual, BlankQuestion, GrammarItem, TopicItem, UpcomingTopic, VocabItem } from "../types";

/**
 * The B2 bank: indirect speech, the passive in every tense, participles as
 * adjectives, nominal style, genitive prepositions and two-part connectors.
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
  kon1: bi("Konjunktiv I — indirekte Rede", "Konjunktiv I — indirect speech"),
  passiv: bi("Passiv in allen Zeiten", "Passive in every tense"),
  part: bi("Partizipien als Adjektive", "Participles as adjectives"),
  nomen: bi("Nominalisierung", "Nominalisation"),
  gpraep: bi("Präpositionen mit Genitiv", "Genitive prepositions"),
  konn: bi("Zweiteilige Konnektoren", "Two-part connectors")
} satisfies Record<string, Bilingual>;

export const B2_VOCAB: readonly VocabItem[] = [
  v("b2_v_herausforderung", "noun", "Herausforderung", "die", ["challenge"], ["die Herausforderungen", "Herausforderungen"],
    bi("-ung → feminin, Plural -en.", "-ung → feminine, plural -en.")),
  v("b2_v_zusammenhang", "noun", "Zusammenhang", "der", ["connection", "context"], ["die Zusammenhänge", "Zusammenhänge"],
    bi("in diesem Zusammenhang — Umlaut im Plural.", "in diesem Zusammenhang — umlaut in the plural.")),
  v("b2_v_voraussetzung", "noun", "Voraussetzung", "die", ["prerequisite", "requirement", "precondition"], ["die Voraussetzungen", "Voraussetzungen"],
    bi("unter der Voraussetzung, dass …", "unter der Voraussetzung, dass …")),
  v("b2_v_verhaeltnis", "noun", "Verhältnis", "das", ["relationship", "ratio", "relation"], ["die Verhältnisse", "Verhältnisse"],
    bi("-nis ist meist Neutrum; Plural verdoppelt das s.", "-nis is mostly neuter; the plural doubles the s.")),
  v("b2_v_einfluss", "noun", "Einfluss", "der", ["influence"], ["die Einflüsse", "Einflüsse"],
    bi("Einfluss auf + Akkusativ. Plural mit Umlaut.", "Einfluss auf + accusative. Plural takes an umlaut.")),
  v("b2_v_massnahme", "noun", "Maßnahme", "die", ["measure", "step"], ["die Maßnahmen", "Maßnahmen"],
    bi("Maßnahmen ergreifen — feste Verbindung.", "Maßnahmen ergreifen — a fixed collocation.")),
  v("b2_v_widerspruch", "noun", "Widerspruch", "der", ["contradiction", "objection"], ["die Widersprüche", "Widersprüche"],
    bi("wider (gegen), nicht wieder (noch einmal).", "wider (against), not wieder (again).")),
  v("b2_v_ergebnis", "noun", "Ergebnis", "das", ["result", "outcome"], ["die Ergebnisse", "Ergebnisse"],
    bi("das Ergebnis — Plural -se.", "das Ergebnis — plural -se.")),
  v("b2_v_gewaehrleisten", "verb", "gewährleisten", "haben", ["to guarantee", "to ensure", "guarantee"], ["gewährleistet"],
    bi("Untrennbar, kein ge-: gewährleistet.", "Inseparable, no ge-: gewährleistet.")),
  v("b2_v_beeinflussen", "verb", "beeinflussen", "haben", ["to influence", "influence"], ["beeinflusst"],
    bi("be- → kein ge-: beeinflusst.", "be- → no ge-: beeinflusst.")),
  v("b2_v_geraten", "verb", "geraten", "sein", ["to get into", "to end up in", "get into"], ["geraten"],
    bi("in Schwierigkeiten geraten — Partizip gleich Infinitiv, mit sein.", "in Schwierigkeiten geraten — participle equals infinitive, with sein.")),
  v("b2_v_abweichen", "verb", "abweichen", "sein", ["to deviate", "to differ", "deviate"], ["abgewichen"],
    bi("Trennbar: ab-ge-wichen, Bewegung weg von → sein.", "Separable: ab-ge-wichen; moving away from → sein.")),
  v("b2_v_hervorheben", "verb", "hervorheben", "haben", ["to emphasise", "to highlight", "emphasize"], ["hervorgehoben"],
    bi("hervor-ge-hoben.", "hervor-ge-hoben."))
];

export const B2_GRAMMAR: readonly GrammarItem[] = [
  /* ---------------------------------------------------------- Konjunktiv I */
  g("b2_g1a", G.kon1, "Er sagt, er ___ krank. (sein)", bi("Konjunktiv I", "Konjunktiv I"), ["sei"],
    bi("sein → sei: die Form, die den Konjunktiv I am klarsten zeigt.", "sein → sei: the form that shows Konjunktiv I most clearly.")),
  g("b2_g1b", G.kon1, "Sie behauptet, sie ___ keine Zeit. (haben)", bi("Konjunktiv I", "Konjunktiv I"), ["habe"],
    bi("haben → habe (3. Person).", "haben → habe (third person).")),
  g("b2_g1c", G.kon1, "Der Minister erklärte, man ___ das Problem lösen. (werden)", bi("Konjunktiv I", "Konjunktiv I"), ["werde"],
    bi("werden → werde.", "werden → werde.")),
  g("b2_g1d", G.kon1, "Sie sagten, sie ___ müde. (sein — Plural)", bi("Konjunktiv I", "Konjunktiv I"), ["seien"],
    bi("Plural: seien.", "Plural: seien.")),
  g("b2_g1e", G.kon1, "Er meint, er ___ das nicht. (wissen)", bi("Konjunktiv I", "Konjunktiv I"), ["wisse"],
    bi("wissen → wisse.", "wissen → wisse.")),
  g("b2_g1f", G.kon1, "Sie sagt, sie ___ morgen. (kommen)", bi("Konjunktiv I", "Konjunktiv I"), ["komme"],
    bi("kommen → komme: Stamm + e.", "kommen → komme: stem + e.")),

  /* ---------------------------------------------------------------- passive */
  g("b2_g2a", G.passiv, "Das Haus ___ letztes Jahr gebaut. (Präteritum)", bi("Passiv", "passive"), ["wurde"],
    bi("Präteritum Passiv: wurde + Partizip II.", "Simple-past passive: wurde + past participle.")),
  g("b2_g2b", G.passiv, "Der Brief ist gestern geschrieben ___ .", bi("Passiv Perfekt", "perfect passive"), ["worden"],
    bi("Perfekt Passiv: ist … worden — ohne ge-.", "Perfect passive: ist … worden — no ge-.")),
  g("b2_g2c", G.passiv, "Das Problem muss gelöst ___ .", bi("Passiv mit Modalverb", "passive with a modal"), ["werden"],
    bi("Modalverb + Partizip II + werden.", "Modal + past participle + werden.")),
  g("b2_g2d", G.passiv, "Die Straße ___ morgen repariert. (Präsens)", bi("Passiv", "passive"), ["wird"],
    bi("Präsens Passiv: wird.", "Present passive: wird.")),
  g("b2_g2e", G.passiv, "Die Tür war schon geschlossen ___ . (Plusquamperfekt)", bi("Passiv", "passive"), ["worden"],
    bi("war … worden.", "war … worden.")),
  g("b2_g2f", G.passiv, "Das Auto kann nicht mehr repariert ___ .", bi("Passiv mit Modalverb", "passive with a modal"), ["werden"],
    bi("kann + repariert + werden.", "kann + repariert + werden.")),

  /* ------------------------------------------------------------ participles */
  g("b2_g3a", G.part, "der ___ Zug (fahren — Partizip I)", bi("<code>der Zug</code>", "<code>der Zug</code>"), ["fahrende"],
    bi("Partizip I: Infinitiv + d + Adjektivendung: fahrend-e.", "Present participle: infinitive + d + adjective ending: fahrend-e.")),
  g("b2_g3b", G.part, "das ___ Fenster (öffnen — Partizip II)", bi("<code>das Fenster</code>", "<code>das Fenster</code>"), ["geöffnete"],
    bi("Partizip II + Endung: geöffnet-e.", "Past participle + ending: geöffnet-e.")),
  g("b2_g3c", G.part, "die ___ Kinder (spielen — Partizip I)", bi("<code>die Kinder</code> (Plural)", "<code>die Kinder</code> (plural)"), ["spielenden"],
    bi("Plural nach die: -en.", "Plural after die: -en.")),
  g("b2_g3d", G.part, "ein ___ Brief (schreiben — Partizip II)", bi("<code>der Brief</code>", "<code>der Brief</code>"), ["geschriebener"],
    bi("Nach ein, maskulin: -er.", "After ein, masculine: -er.")),
  g("b2_g3e", G.part, "die ___ Wohnung (renovieren — Partizip II)", bi("<code>die Wohnung</code>", "<code>die Wohnung</code>"), ["renovierte"],
    bi("-ieren-Verben: kein ge-: renoviert-e.", "-ieren verbs take no ge-: renoviert-e.")),
  g("b2_g3f", G.part, "der ___ Hund (bellen — Partizip I)", bi("<code>der Hund</code>", "<code>der Hund</code>"), ["bellende"],
    bi("bellend-e.", "bellend-e.")),

  /* --------------------------------------------------------- nominalisation */
  g("b2_g4a", G.nomen, "Die ___ des Zuges verzögert sich. (ankommen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Ankunft"],
    bi("ankommen → die Ankunft.", "ankommen → die Ankunft.")),
  g("b2_g4b", G.nomen, "Die ___ des Vertrags dauert lange. (prüfen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Prüfung"],
    bi("prüfen → die Prüfung.", "prüfen → die Prüfung.")),
  g("b2_g4c", G.nomen, "Nach der ___ des Gesetzes gab es Proteste. (ändern)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Änderung"],
    bi("ändern → die Änderung.", "ändern → die Änderung.")),
  g("b2_g4d", G.nomen, "Die ___ der Stadt begann um 1900. (entwickeln)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Entwicklung"],
    bi("entwickeln → die Entwicklung.", "entwickeln → die Entwicklung.")),
  g("b2_g4e", G.nomen, "Die ___ des Problems ist schwierig. (lösen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Lösung"],
    bi("lösen → die Lösung.", "lösen → die Lösung.")),
  g("b2_g4f", G.nomen, "Beim ___ sollte man Ruhe haben. (lesen)", bi("Nomen aus dem Verb", "the noun from the verb"), ["Lesen"],
    bi("Der Infinitiv als Nomen: das Lesen, beim Lesen.", "The infinitive as a noun: das Lesen, beim Lesen.")),

  /* --------------------------------------------------- genitive prepositions */
  g("b2_g5a", G.gpraep, "___ des schlechten Wetters blieben wir zu Hause.", bi("because of", "because of"), ["wegen", "aufgrund"],
    bi("wegen / aufgrund + Genitiv.", "wegen / aufgrund + genitive.")),
  g("b2_g5b", G.gpraep, "___ der Ferien ist die Schule geschlossen.", bi("during", "during"), ["während"],
    bi("während + Genitiv.", "während + genitive.")),
  g("b2_g5c", G.gpraep, "___ des Regens gingen wir spazieren.", bi("despite", "despite"), ["trotz"],
    bi("trotz + Genitiv.", "trotz + genitive.")),
  g("b2_g5d", G.gpraep, "___ der Stadt gibt es einen Wald.", bi("outside of", "outside of"), ["außerhalb"],
    bi("außerhalb + Genitiv.", "außerhalb + genitive.")),
  g("b2_g5e", G.gpraep, "___ der Arbeitszeit darf man nicht privat telefonieren.", bi("within", "within"), ["innerhalb"],
    bi("innerhalb + Genitiv.", "innerhalb + genitive.")),
  g("b2_g5f", G.gpraep, "___ des Flusses steht ein Hotel.", bi("on the far side of", "on the far side of"), ["jenseits"],
    bi("jenseits + Genitiv.", "jenseits + genitive.")),

  /* -------------------------------------------------------------- connectors */
  g("b2_g6a", G.konn, "Er spricht ___ Deutsch als auch Englisch.", bi("both … and", "both … and"), ["sowohl"],
    bi("sowohl … als auch.", "sowohl … als auch.")),
  g("b2_g6b", G.konn, "___ du kommst mit, oder du bleibst hier.", bi("either … or", "either … or"), ["entweder"],
    bi("entweder … oder.", "entweder … oder.")),
  g("b2_g6c", G.konn, "Sie ist ___ klug, sondern auch fleißig.", bi("not only … but also", "not only … but also"), ["nicht nur"],
    bi("nicht nur … sondern auch.", "nicht nur … sondern auch.")),
  g("b2_g6d", G.konn, "Ich mag ___ Kaffee noch Tee.", bi("neither … nor", "neither … nor"), ["weder"],
    bi("weder … noch.", "weder … noch.")),
  g("b2_g6e", G.konn, "___ mehr ich lerne, desto besser verstehe ich.", bi("the more … the", "the more … the"), ["je"],
    bi("je … desto (oder umso).", "je … desto (or umso).")),
  g("b2_g6f", G.konn, "Zwar ist er müde, ___ arbeitet er weiter.", bi("but / nevertheless", "but / nevertheless"), ["aber", "trotzdem", "dennoch", "doch"],
    bi("zwar … aber / trotzdem / dennoch.", "zwar … aber / trotzdem / dennoch."))
];

export const B2_TOPICS: readonly TopicItem[] = [
  {
    id: "b2_t1",
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
    name: bi("Modalverben in subjektiver Bedeutung", "Modal verbs used subjectively"),
    seedStage: 0,
    questions: [
      q("Er ___ reich sein — er fährt einen Porsche. (sichere Vermutung)", bi("Modalverb", "modal verb"), ["muss"], bi("muss = ich bin fast sicher.", "muss = I am almost certain.")),
      q("Sie ___ krank sein, sie war heute nicht da. (unsichere Vermutung)", bi("Modalverb", "modal verb"), ["könnte", "dürfte", "kann", "mag"], bi("könnte / dürfte = vielleicht.", "könnte / dürfte = perhaps.")),
      q("Er ___ ein guter Arzt sein — das behauptet er selbst.", bi("Modalverb", "modal verb"), ["will"], bi("will = er behauptet es über sich.", "will = he claims it about himself.")),
      q("Sie ___ sehr klug sein — das sagen alle.", bi("Modalverb", "modal verb"), ["soll"], bi("soll = man sagt / Gerücht.", "soll = people say / rumour."))
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
