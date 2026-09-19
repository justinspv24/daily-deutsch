import type { LevelSyllabus } from "../../types";
import { GOETHE_EXAMS, SHARED_LINKS, TELC_DOWNLOADS, bi, g, reading, section, yt } from "./helpers";

/**
 * B2 — Vantage. Built against the Goethe-Zertifikat B2 and telc Deutsch B2
 * formats and the Aspekte / Sicher! / Erkundungen course books that teach to
 * them. There is no official B2 word list; the vocabulary here is thematic
 * and abstract, because that is what the level is — talking about the world,
 * not just about yourself — and the grammar is the machinery of written
 * German: reported speech, the passive everywhere, nominal style.
 */
export const B2_SYLLABUS: LevelSyllabus = {
  level: "B2",
  title: bi("B2 — Über die Welt sprechen", "B2 — Talking about the world"),
  intro: bi(
    "Du verstehst komplexe Texte und Diskussionen, auch zu abstrakten Themen und aus deinem Fachgebiet. Du sprichst spontan und flüssig mit Muttersprachlern, vertrittst deinen Standpunkt mit Argumenten und schreibst klare, detaillierte Texte in gutem Stil.",
    "You understand complex texts and discussions, including abstract ones and those in your field. You speak spontaneously and fluently with native speakers, argue a position, and write clear, detailed texts in good style."
  ),
  exam: bi("Goethe-Zertifikat B2 · telc Deutsch B2 · ÖSD B2 · TestDaF (TDN 3)", "Goethe-Zertifikat B2 · telc Deutsch B2 · ÖSD B2 · TestDaF (TDN 3)"),
  hours: bi("etwa 600–800 Unterrichtsstunden insgesamt", "roughly 600–800 lessons in total"),
  sources: [
    reading(GOETHE_EXAMS, "Goethe-Institut — Deutschprüfungen (B2 Modellsätze)", "Goethe-Institut — German exams (B2 sample papers)"),
    reading(TELC_DOWNLOADS, "telc — kostenlose Übungstests B2", "telc — free B2 practice tests"),
    ...SHARED_LINKS
  ],
  sections: [
    section(
      "b2_s01",
      bi("Arbeitswelt & Karriere", "The world of work & careers"),
      bi("Der Chef sagte, er habe keine Zeit. Konjunktiv I: die indirekte Rede, wie Zeitungen und Berichte sie verwenden.", "Der Chef sagte, er habe keine Zeit. Konjunktiv I: reported speech as newspapers and reports use it."),
      {
        canDo: [
          bi("Aussagen anderer neutral wiedergeben — mündlich und schriftlich", "report other people's statements neutrally — spoken and written"),
          bi("in Meetings verhandeln, Ergebnisse protokollieren", "negotiate in meetings, write up results"),
          bi("formelle Korrespondenz führen: Anfrage, Angebot, Absage", "handle formal correspondence: enquiry, offer, refusal")
        ],
        grammar: [
          g("Konjunktiv I: Bildung", "Konjunktiv I: formation", "er habe · er sei · er könne · er werde · er wisse — Infinitivstamm + -e", "he has · he is · he can · he will · he knows (reported)", "konjunktiv1"),
          g("Indirekte Rede", "Reported speech", "Sie sagte, sie sei krank und könne nicht kommen. Er fragte, ob wir Zeit hätten.", "She said she was ill and couldn't come. He asked whether we had time."),
          g("Ersatzformen: Konjunktiv II & würde", "Fallbacks: Konjunktiv II & würde", "Sie sagen, sie hätten (nicht: haben) keine Zeit. — wenn K I wie Indikativ aussieht", "They say they have no time. — used when K I looks like the indicative"),
          g("Vergangenheit in der indirekten Rede", "Past in reported speech", "Er sagte, er habe das Projekt abgeschlossen. Sie meinte, sie sei früher gegangen.", "He said he had finished the project. She said she had left earlier.", "konjunktiv1")
        ],
        links: [
          yt("Konjunktiv I indirekte Rede B2 erklärt", "Konjunktiv I & indirekte Rede", "Konjunktiv I & reported speech"),
          yt("Easy German work culture Germany", "Easy German: Arbeitskultur in Deutschland", "Easy German: German work culture")
        ]
      }
    ),

    section(
      "b2_s02",
      bi("Wissenschaft, Technik & Digitalisierung", "Science, technology & digitalisation"),
      bi("Das Problem lässt sich lösen. Passiv in allen Zeiten, Zustandspassiv, und die Formen, die das Passiv ersetzen.", "Das Problem lässt sich lösen. The passive in every tense, the stative passive, and the forms that replace it."),
      {
        canDo: [
          bi("technische Entwicklungen und ihre Folgen erklären", "explain technological developments and their consequences"),
          bi("Vorgänge und Verfahren beschreiben", "describe processes and procedures"),
          bi("Sachtexte aus Wissenschaft und Technik verstehen", "understand factual texts on science and technology")
        ],
        grammar: [
          g("Passiv in allen Zeiten", "Passive in every tense", "wird entwickelt · wurde entwickelt · ist entwickelt worden · war entwickelt worden · wird entwickelt werden", "is developed · was developed · has been developed · had been developed · will be developed", "passiv"),
          g("Zustandspassiv: sein + Partizip II", "Stative passive: sein + past participle", "Das Gerät ist repariert. (Ergebnis) — Das Gerät wird repariert. (Vorgang)", "The device is repaired. (result) — The device is being repaired. (process)"),
          g("Passiversatz", "Alternatives to the passive", "lässt sich lösen · ist lösbar · ist zu lösen · man löst", "can be solved · is solvable · is to be solved · one solves", "passiversatz"),
          g("Unpersönliches Passiv", "Impersonal passive", "Es wird viel geforscht. Daran wird noch gearbeitet.", "A lot of research is being done. That's still being worked on.")
        ],
        links: [
          yt("Passiv alle Zeiten Zustandspassiv Passiversatz B2", "Passiv: alle Zeiten & Ersatzformen", "Passive: all tenses & alternatives"),
          yt("Deutsche Welle Deutsch lernen B2 Technik", "DW: Technik & Digitales (B2)", "DW: technology & digital (B2)")
        ]
      }
    ),

    section(
      "b2_s03",
      bi("Gesellschaft, Politik & Medien", "Society, politics & media"),
      bi("Aufgrund der Entscheidung … Nominalstil: wie aus Nebensätzen Nomen werden — und wieder zurück.", "Aufgrund der Entscheidung … Nominal style: how clauses become nouns — and back again."),
      {
        canDo: [
          bi("politische Systeme und aktuelle Debatten in Grundzügen erklären", "explain political systems and current debates in outline"),
          bi("Nachrichten und Kommentare verstehen und zusammenfassen", "understand and summarise news and commentary"),
          bi("zwischen formellem und informellem Stil wechseln", "switch between formal and informal style")
        ],
        grammar: [
          g("Nominalisierung", "Nominalisation", "weil es regnete → wegen des Regens · obwohl er krank war → trotz seiner Krankheit · nachdem er ankam → nach seiner Ankunft", "because it rained → because of the rain · although he was ill → despite his illness · after he arrived → after his arrival", "nominalisierung"),
          g("Präpositionen des Nominalstils", "Prepositions of nominal style", "aufgrund · infolge · anlässlich · mithilfe · bezüglich · hinsichtlich · angesichts · zwecks", "on the basis of · as a result of · on the occasion of · with the help of · regarding · with regard to · in view of · for the purpose of", "genitiv"),
          g("Verbalisierung", "Verbalisation", "bei Regen → wenn es regnet · zur Verbesserung → um … zu verbessern", "in case of rain → if it rains · for the improvement → in order to improve"),
          g("Nomen-Verb-Verbindungen", "Noun-verb combinations", "eine Entscheidung treffen · Kritik üben · zur Verfügung stehen · in Kraft treten", "to make a decision · to criticise · to be available · to come into force", "fvg")
        ],
        links: [
          yt("Nominalisierung Verbalisierung B2 erklärt", "Nominalisierung & Verbalisierung", "Nominalisation & verbalisation"),
          yt("langsam gesprochene Nachrichten DW", "DW: Langsam gesprochene Nachrichten", "DW: slowly spoken news")
        ]
      }
    ),

    section(
      "b2_s04",
      bi("Umwelt, Klima & Nachhaltigkeit", "Environment, climate & sustainability"),
      bi("Das seit Jahren steigende Meer. Partizipien als Adjektive, erweiterte Partizipialattribute — und Relativsätze mit dessen und deren.", "Das seit Jahren steigende Meer. Participles as adjectives, extended participle phrases — and relative clauses with dessen and deren."),
      {
        canDo: [
          bi("Ursachen und Folgen des Klimawandels differenziert darstellen", "present causes and consequences of climate change in a nuanced way"),
          bi("Grafiken und Statistiken beschreiben und interpretieren", "describe and interpret charts and statistics"),
          bi("Lösungsvorschläge abwägen und bewerten", "weigh and evaluate proposed solutions")
        ],
        grammar: [
          g("Partizip I und II als Adjektiv", "Participles I and II as adjectives", "die steigenden Temperaturen (aktiv, gleichzeitig) · die gemessenen Werte (passiv, abgeschlossen)", "the rising temperatures (active, simultaneous) · the measured values (passive, completed)"),
          g("Erweitertes Partizipialattribut", "Extended participle phrase", "die seit Jahren steigenden Temperaturen = die Temperaturen, die seit Jahren steigen", "the temperatures rising for years = the temperatures that have been rising for years", "partizip-attribut"),
          g("Relativsätze: dessen, deren", "Relative clauses: dessen, deren", "der Bericht, dessen Ergebnisse überraschen · die Länder, deren Küsten bedroht sind", "the report whose findings surprise · the countries whose coasts are threatened", "relativ"),
          g("Grafikbeschreibung", "Describing a chart", "Die Grafik zeigt … · Auffällig ist, dass … · Der Anteil ist um 5 % gestiegen / gesunken.", "The chart shows … · What is striking is that … · The share has risen / fallen by 5 %.")
        ],
        links: [
          yt("Partizipialattribute erweitert B2 erklärt", "Erweiterte Partizipialattribute", "Extended participle phrases"),
          yt("Grafikbeschreibung Deutsch B2 Redemittel", "Grafik beschreiben: Redemittel", "Describing a chart: phrases")
        ]
      }
    ),

    section(
      "b2_s05",
      bi("Wirtschaft, Globalisierung & Konsum", "Economy, globalisation & consumption"),
      bi("Je mehr wir kaufen, desto … Zweiteilige Konnektoren im Satzgefüge, und der Wechsel zwischen verbalem und nominalem Ausdruck.", "Je mehr wir kaufen, desto … Two-part connectors in complex sentences, and switching between verbal and nominal expression."),
      {
        canDo: [
          bi("wirtschaftliche Zusammenhänge erklären: Angebot, Nachfrage, Preise", "explain economic relationships: supply, demand, prices"),
          bi("über Konsumverhalten und Globalisierung argumentieren", "argue about consumer behaviour and globalisation"),
          bi("komplexe Sätze mit mehreren Konnektoren bauen", "build complex sentences with several connectors")
        ],
        grammar: [
          g("je … desto / umso", "je … desto / umso", "Je billiger ein Produkt ist, desto schneller landet es im Müll.", "The cheaper a product is, the faster it ends up in the bin.", "zweiteilig"),
          g("Zweiteilige Konnektoren", "Two-part connectors", "entweder … oder · weder … noch · sowohl … als auch · nicht nur … sondern auch · zwar … aber · einerseits … andererseits", "either … or · neither … nor · both … and · not only … but also · admittedly … but · on the one hand … on the other"),
          g("Kausal, konzessiv, konsekutiv — drei Ebenen", "Causal, concessive, consecutive — three levels", "weil / deshalb / wegen · obwohl / trotzdem / trotz · sodass / folglich / infolge", "subordinate / main-clause / prepositional", "konnektoren"),
          g("Vergleichssätze", "Comparative clauses", "so … wie · als · je … desto · im Vergleich zu · verglichen mit", "as … as · than · the … the · compared with · compared to")
        ],
        links: [
          yt("je desto Konnektoren B2 Deutsch", "je … desto & zweiteilige Konnektoren", "je … desto & two-part connectors"),
          yt("Easy German consumerism shopping habits Germans", "Easy German: Konsum", "Easy German: consumption")
        ]
      }
    ),

    section(
      "b2_s06",
      bi("Kultur, Kunst & Literatur", "Culture, art & literature"),
      bi("Das ist doch mal ein Film! Modalpartikeln, die Deutsch erst natürlich klingen lassen, und der Konjunktiv II der Vergangenheit.", "Das ist doch mal ein Film! The modal particles that make German sound natural, and the past Konjunktiv II."),
      {
        canDo: [
          bi("über Filme, Bücher, Musik und Kunst sprechen und Kritiken verstehen", "talk about films, books, music and art and understand reviews"),
          bi("Bedauern und Irreales in der Vergangenheit ausdrücken", "express regret and the unreal past"),
          bi("Nuancen und Haltungen mit Partikeln ausdrücken", "express nuance and attitude with particles")
        ],
        grammar: [
          g("Modalpartikeln", "Modal particles", "doch · ja · mal · eben · halt · wohl · denn · eigentlich · schon", "each colours the tone rather than adding meaning", "modalpartikeln"),
          g("Konjunktiv II der Vergangenheit", "Past Konjunktiv II", "Ich hätte den Film gern gesehen. Wenn ich Zeit gehabt hätte, wäre ich gekommen.", "I'd have liked to see the film. If I'd had time, I'd have come.", "konjunktiv2-past"),
          g("Konjunktiv II + Modalverb (Vergangenheit)", "Past Konjunktiv II with a modal", "Ich hätte früher kommen sollen. Du hättest das lesen müssen.", "I should have come earlier. You should have read that."),
          g("Redewendungen", "Idioms", "Das ist nicht mein Bier. · Ich verstehe nur Bahnhof. · Daumen drücken.", "Not my business. · It's all Greek to me. · Fingers crossed."),
          g("Kritik schreiben: Adjektive", "Writing a review: adjectives", "beeindruckend · gelungen · spannend · berührend — enttäuschend · langweilig · vorhersehbar · überladen", "impressive · accomplished · gripping · moving — disappointing · boring · predictable · overloaded")
        ],
        links: [
          yt("Modalpartikeln doch ja mal eben erklärt", "Modalpartikeln: doch, ja, mal, eben", "Modal particles: doch, ja, mal, eben"),
          yt("Konjunktiv II Vergangenheit hätte wäre gemacht B2", "Konjunktiv II der Vergangenheit", "Past Konjunktiv II")
        ]
      }
    ),

    section(
      "b2_s07",
      bi("Gesundheit, Psychologie & Lebensstil", "Health, psychology & lifestyle"),
      bi("Er muss krank sein. Die Modalverben, wenn sie Vermutungen ausdrücken — und das Futur II für das, was bis dahin geschehen sein wird.", "Er muss krank sein. Modal verbs when they express assumptions — and Futur II for what will have happened by then."),
      {
        canDo: [
          bi("Vermutungen mit unterschiedlicher Sicherheit ausdrücken", "express assumptions with varying degrees of certainty"),
          bi("über Stress, Burnout, Ernährung und Lebensstil differenziert sprechen", "talk in depth about stress, burnout, diet and lifestyle"),
          bi("Ratgebertexte verstehen und kritisch bewerten", "understand and critically assess advice texts")
        ],
        grammar: [
          g("Subjektive Modalverben", "Modal verbs used subjectively", "Er muss krank sein (sicher) · Er dürfte krank sein (wahrscheinlich) · Er könnte krank sein (möglich)", "He must be ill (certain) · He's probably ill · He could be ill (possible)", "modal-subjektiv"),
          g("sollen & wollen: Behauptung", "sollen & wollen: hearsay and claim", "Er soll sehr reich sein. (man sagt) · Sie will das nicht gewusst haben. (behauptet sie)", "He's said to be very rich. · She claims not to have known."),
          g("Futur II", "Futur II", "Bis morgen werde ich den Bericht geschrieben haben. Er wird den Zug verpasst haben.", "By tomorrow I'll have written the report. He'll have missed the train.", "futur"),
          g("Vermutung in der Vergangenheit", "Assumption about the past", "Er muss krank gewesen sein. Sie dürfte das vergessen haben.", "He must have been ill. She's probably forgotten that.")
        ],
        links: [
          yt("subjektive Modalverben Vermutung B2 erklärt", "Subjektive Modalverben", "Modal verbs used subjectively"),
          yt("Futur II Deutsch erklärt", "Futur II erklärt", "Futur II explained")
        ]
      }
    ),

    section(
      "b2_s08",
      bi("Bildung, Forschung & Sprache", "Education, research & language"),
      bi("Zur Verfügung stellen, in Frage kommen: Funktionsverbgefüge, und die Präfixe, die aus einem Verb fünf machen.", "Zur Verfügung stellen, in Frage kommen: light-verb constructions, and the prefixes that turn one verb into five."),
      {
        canDo: [
          bi("über Studium, Forschung und Bildungspolitik sprechen", "talk about university, research and education policy"),
          bi("wissenschaftsnahe Texte und Vorträge verstehen", "understand academic-style texts and lectures"),
          bi("Wortfamilien nutzen, um Wortschatz zu erweitern", "use word families to expand vocabulary")
        ],
        grammar: [
          g("Funktionsverbgefüge", "Light-verb constructions", "zur Verfügung stellen · in Frage kommen · zum Ausdruck bringen · in Anspruch nehmen · unter Beweis stellen", "to make available · to be an option · to express · to make use of · to prove", "fvg"),
          g("Präfixe: ver-, be-, ent-, zer-, er-", "Prefixes: ver-, be-, ent-, zer-, er-", "verstehen · bestehen · entstehen · zerbrechen · erkennen — untrennbar, kein ge-", "understand · exist/pass · arise · shatter · recognise — inseparable, no ge-", "wortbildung"),
          g("Wortfamilien", "Word families", "lehren → der Lehrer, die Lehre, lehrreich, belehren", "teach → teacher, apprenticeship, instructive, lecture (someone)"),
          g("Fachsprache & Definitionen", "Technical language & definitions", "Unter … versteht man … · … bezeichnet … · … wird definiert als …", "By … one understands … · … denotes … · … is defined as …")
        ],
        links: [
          yt("Funktionsverbgefüge B2 Liste erklärt", "Funktionsverbgefüge", "Light-verb constructions"),
          yt("Präfixe ver be ent zer Verben Bedeutung", "Präfixe: ver-, be-, ent-, zer-", "Prefixes: ver-, be-, ent-, zer-")
        ]
      }
    ),

    section(
      "b2_s09",
      bi("Geschichte & Zeitgeschehen", "History & current affairs"),
      bi("Nachdem die Mauer gefallen war … Präteritum der starken Verben, Plusquamperfekt und die Konnektoren, mit denen man erzählt und berichtet.", "Nachdem die Mauer gefallen war … The simple past of strong verbs, the pluperfect and the connectors for narrating and reporting."),
      {
        canDo: [
          bi("historische Ereignisse und ihre Bedeutung erklären", "explain historical events and their significance"),
          bi("einen Bericht oder eine Erzählung im Präteritum schreiben", "write a report or narrative in the simple past"),
          bi("Zeitungsartikel zu aktuellen Themen verstehen", "understand newspaper articles on current topics")
        ],
        grammar: [
          g("Präteritum der starken Verben", "Simple past of strong verbs", "fallen – fiel · beginnen – begann · bleiben – blieb · nehmen – nahm · werden – wurde", "fall – fell · begin – began · stay – stayed · take – took · become – became", "timeline"),
          g("Plusquamperfekt & Reihenfolge", "Pluperfect & sequence", "Nachdem die Grenze geöffnet worden war, strömten Tausende nach Westen.", "After the border had been opened, thousands streamed west."),
          g("Temporale Konnektoren", "Temporal connectors", "zunächst · anschließend · daraufhin · schließlich · inzwischen · seither · kurz darauf", "at first · afterwards · thereupon · finally · meanwhile · since then · shortly after", "temporal-clauses"),
          g("Bericht vs. Erzählung", "Report vs. narrative", "Bericht: sachlich, Präteritum, W-Fragen · Erzählung: Spannung, wörtliche Rede, Adjektive", "report: factual, simple past, W-questions · narrative: tension, direct speech, adjectives")
        ],
        links: [
          yt("Präteritum starke Verben Liste B2", "Präteritum: starke Verben", "Simple past: strong verbs"),
          yt("DW Deutsch lernen deutsche Geschichte Mauerfall", "DW: deutsche Geschichte", "DW: German history")
        ]
      }
    ),

    section(
      "b2_s10",
      bi("Meinung, Ethik & Argumentation", "Opinion, ethics & argument"),
      bi("Er tut so, als ob er alles wüsste. Irreale Vergleiche, Wunschsätze — und die Erörterung, in der du beide Seiten gerecht behandelst.", "Er tut so, als ob er alles wüsste. Unreal comparisons, wish clauses — and the essay in which you treat both sides fairly."),
      {
        canDo: [
          bi("ethische Fragen diskutieren und eine begründete Position vertreten", "discuss ethical questions and defend a reasoned position"),
          bi("eine Erörterung mit Einleitung, Argumentation und Fazit schreiben", "write a discursive essay with introduction, argument and conclusion"),
          bi("Wünsche und irreale Vergleiche ausdrücken", "express wishes and unreal comparisons")
        ],
        grammar: [
          g("Irreale Vergleiche: als ob, als", "Unreal comparisons: als ob, als", "Er tut so, als ob er alles wüsste. Sie sieht aus, als wäre sie krank.", "He acts as if he knew everything. She looks as if she were ill.", "als-ob"),
          g("Wunschsätze", "Wish clauses", "Wenn ich doch mehr Zeit hätte! Hätte ich das nur gewusst!", "If only I had more time! If only I'd known!", "konjunktiv2"),
          g("Argumentieren: Redemittel", "Arguing: phrases", "Dafür spricht, dass … · Dagegen lässt sich einwenden, dass … · Es steht außer Frage, dass … · Letztlich …", "In favour is the fact that … · Against this one could object that … · It's beyond question that … · Ultimately …"),
          g("Erörterung: Aufbau", "Essay: structure", "Einleitung (Thema, Relevanz) → These/Antithese → Abwägung → Fazit mit eigener Position", "introduction (topic, relevance) → thesis/antithesis → weighing up → conclusion with own position")
        ],
        links: [
          yt("als ob irreale Vergleichssätze B2", "als ob: irreale Vergleiche", "als ob: unreal comparisons"),
          yt("Erörterung schreiben Aufbau Redemittel B2", "Erörterung: Aufbau & Redemittel", "Discursive essay: structure & phrases")
        ]
      }
    ),

    section(
      "b2_s11",
      bi("Textsorten & Stil", "Text types & style"),
      bi("Ich fahre morgen wegen des Wetters mit dem Zug nach Berlin. TeKaMoLo, Textkohärenz — und die Textsorten, die B2 verlangt.", "Ich fahre morgen wegen des Wetters mit dem Zug nach Berlin. TeKaMoLo, textual coherence — and the text types B2 demands."),
      {
        canDo: [
          bi("Kommentar, Leserbrief, Zusammenfassung und Beschwerde stilsicher schreiben", "write a commentary, letter to the editor, summary and complaint with assurance"),
          bi("Texte logisch verknüpfen und Wiederholungen vermeiden", "link texts logically and avoid repetition"),
          bi("Register erkennen und passend wählen", "recognise and choose the right register")
        ],
        grammar: [
          g("Mittelfeld: TeKaMoLo", "Middle field: TeKaMoLo", "temporal → kausal → modal → lokal: Ich fahre morgen wegen des Wetters mit dem Zug nach Berlin.", "when → why → how → where: I'm going to Berlin tomorrow by train because of the weather.", "tekamolo"),
          g("Textkohärenz: Verweiswörter", "Coherence: reference words", "dieser · damit · dabei · dadurch · deshalb · im Folgenden · wie bereits erwähnt", "this · with it · in doing so · thereby · therefore · in what follows · as already mentioned"),
          g("Satzverbindungen variieren", "Varying sentence links", "Nebensatz ↔ Hauptsatz + Konnektor ↔ Nominalisierung: weil … / deshalb … / wegen …", "clause ↔ main clause + connector ↔ nominalisation", "nominalisierung"),
          g("Register", "Register", "umgangssprachlich: Das ist echt super. — neutral: Das ist sehr gut. — formell: Dies ist ausgesprochen gelungen.", "colloquial — neutral — formal")
        ],
        links: [
          yt("TeKaMoLo Satzstellung Mittelfeld erklärt", "TeKaMoLo: die Satzstellung", "TeKaMoLo: word order"),
          yt("Leserbrief Kommentar schreiben B2 Deutsch", "Leserbrief & Kommentar schreiben", "Writing a letter to the editor & commentary")
        ]
      }
    ),

    section(
      "b2_s12",
      bi("Prüfung B2: Schreiben & Sprechen", "B2 exam: writing & speaking"),
      bi("Forumsbeitrag und formelle Nachricht, Vortrag und Diskussion — die Formate von Goethe und telc im Detail.", "Forum post and formal message, talk and discussion — the Goethe and telc formats in detail."),
      {
        canDo: [
          bi("einen argumentativen Forumsbeitrag (150 W.) und eine formelle Nachricht (100 W.) schreiben", "write an argumentative forum post (150 words) and a formal message (100 words)"),
          bi("einen kurzen Vortrag halten und auf Nachfragen reagieren", "give a short talk and respond to questions"),
          bi("in einer Diskussion Position beziehen, widersprechen, vermitteln", "take a position, disagree and mediate in a discussion")
        ],
        grammar: [
          g("Goethe B2: Module", "Goethe B2: modules", "Lesen 65 · Hören 40 · Schreiben 75 · Sprechen 15 Minuten — Module einzeln", "Reading 65 · Listening 40 · Writing 75 · Speaking 15 minutes — modules separately"),
          g("Sprechen Teil 1: Vortrag", "Speaking part 1: talk", "Thema wählen → Optionen vorstellen → Vor- und Nachteile → eigene Meinung → Nachfragen", "choose a topic → present options → pros and cons → own view → questions"),
          g("Sprechen Teil 2: Diskussion", "Speaking part 2: discussion", "Ich sehe das ähnlich, allerdings … · Darf ich kurz einhaken? · Könnten wir uns darauf einigen, dass …", "I see it similarly, however … · May I just come in there? · Could we agree that …"),
          g("Schreiben: Bewertung", "Writing: assessment", "Aufgabenerfüllung · Kohärenz · Wortschatz · Strukturen — alle vier zählen gleich", "task fulfilment · coherence · vocabulary · structures — all four count equally")
        ],
        links: [
          reading(GOETHE_EXAMS, "Goethe-Institut: Zertifikat B2 — Modellsätze", "Goethe-Institut: Zertifikat B2 — sample papers"),
          yt("Goethe Zertifikat B2 Sprechen Vortrag Beispiel", "B2-Prüfung: Vortrag (Beispiel)", "B2 exam: talk (sample)")
        ]
      }
    )
  ]
};
