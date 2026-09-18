import type { LevelSyllabus } from "../../types";
import {
  GOETHE_B1_WORDS,
  GOETHE_EXAMS,
  SHARED_LINKS,
  TELC_A2_B1,
  bi,
  g,
  reading,
  section,
  w,
  yt
} from "./helpers";

/**
 * B1 — Threshold. Built against the Goethe-Zertifikat B1 word list, the telc
 * Deutsch B1 handbook and the DTZ; the themes are the ones both exams draw
 * their texts from. B1 is the level of independence: you can hold your own
 * on anything familiar, and the grammar that arrives — relative clauses,
 * the passive, Konjunktiv II in earnest — is what makes that possible.
 */
export const B1_SYLLABUS: LevelSyllabus = {
  level: "B1",
  title: bi("B1 — Selbstständig unterwegs", "B1 — Getting by on your own"),
  intro: bi(
    "Du verstehst das Wesentliche, wenn es um Arbeit, Schule, Freizeit geht, und kommst in fast allen Alltagssituationen zurecht. Du sprichst zusammenhängend über Erfahrungen und Ziele, begründest deine Meinung und schreibst einfache, zusammenhängende Texte.",
    "You understand the main points on work, school and leisure and cope with almost every everyday situation. You speak connectedly about experiences and plans, give reasons for your opinions and write simple connected texts."
  ),
  exam: bi("Goethe-Zertifikat B1 · telc Deutsch B1 · DTZ · ÖSD B1", "Goethe-Zertifikat B1 · telc Deutsch B1 · DTZ · ÖSD B1"),
  hours: bi("etwa 350–650 Unterrichtsstunden insgesamt", "roughly 350–650 lessons in total"),
  sources: [
    reading(GOETHE_B1_WORDS, "Goethe B1 — offizielle Wortliste", "Goethe B1 — official word list"),
    reading(GOETHE_EXAMS, "Goethe-Institut — Deutschprüfungen", "Goethe-Institut — German exams"),
    reading(TELC_A2_B1, "telc Deutsch A2·B1 — Prüfungsformat", "telc Deutsch A2·B1 — exam format"),
    ...SHARED_LINKS
  ],
  sections: [
    section(
      "b1_s01",
      bi("Arbeit & Bewerbung", "Work & applying for jobs"),
      bi("Ich würde gern … Der Konjunktiv II in voller Breite: Wünsche, Höflichkeit, Irreales — und die Bewerbung, in der man ihn braucht.", "Ich würde gern … Konjunktiv II in full: wishes, politeness, the unreal — and the job application where you need it."),
      {
        canDo: [
          bi("eine Bewerbung und einen Lebenslauf schreiben", "write a job application and a CV"),
          bi("ein Vorstellungsgespräch führen: Stärken, Erfahrungen, Fragen", "handle a job interview: strengths, experience, questions"),
          bi("Wünsche und höfliche Bitten formulieren", "express wishes and polite requests")
        ],
        grammar: [
          g("Konjunktiv II: würde, hätte, wäre, könnte", "Konjunktiv II: würde, hätte, wäre, könnte", "Ich würde gern bei Ihnen arbeiten. Wenn ich mehr Zeit hätte, wäre ich flexibler.", "I'd like to work for you. If I had more time, I'd be more flexible.", "konjunktiv2"),
          g("Irreale Bedingung", "Unreal condition", "Wenn ich die Stelle bekäme, würde ich nach München ziehen.", "If I got the job, I'd move to Munich.", "nebensatz"),
          g("Bewerbung: feste Wendungen", "Application: set phrases", "Hiermit bewerbe ich mich um … · Über eine Einladung zum Gespräch würde ich mich sehr freuen.", "I hereby apply for … · I would be delighted to be invited to an interview."),
          g("Verben mit Präposition: Beruf", "Verbs with prepositions: work", "sich bewerben um · sich vorbereiten auf · sich kümmern um · verantwortlich sein für", "to apply for · to prepare for · to take care of · to be responsible for", "pronominal-adverbs")
        ],
        vocab: [
          w("die Stellenanzeige", "job advertisement"),
          w("das Anschreiben", "cover letter"),
          w("der Lebenslauf (tabellarisch)", "CV (in table form)"),
          w("das Vorstellungsgespräch", "job interview"),
          w("die Stärke / die Schwäche", "strength / weakness"),
          w("die Berufserfahrung", "work experience"),
          w("die Qualifikation, -en", "qualification"),
          w("die Fähigkeit, -en", "skill, ability"),
          w("zuverlässig / flexibel / belastbar", "reliable / flexible / resilient"),
          w("die Arbeitsbedingungen (Pl.)", "working conditions"),
          w("die Probezeit", "probation period"),
          w("befristet / unbefristet", "fixed-term / permanent"),
          w("der Betriebsrat", "works council"),
          w("die Weiterbildung", "further training"),
          w("einstellen / entlassen", "to hire / to dismiss")
        ],
        links: [
          yt("Konjunktiv II würde hätte wäre B1 erklärt", "Konjunktiv II erklärt", "Konjunktiv II explained"),
          yt("Nicos Weg B1 Bewerbung Vorstellungsgespräch", "Nicos Weg B1: Bewerbung", "Nicos Weg B1: job application")
        ]
      }
    ),

    section(
      "b1_s02",
      bi("Wohnen & Zusammenleben", "Housing & living together"),
      bi("Der Nachbar, der immer laut ist. Relativsätze in allen Fällen — der Satz, mit dem du Dinge genau beschreibst.", "The neighbour who's always loud. Relative clauses in every case — the sentence you describe things precisely with."),
      {
        canDo: [
          bi("Wohnsituationen beschreiben und vergleichen: Stadt, Land, WG", "describe and compare ways of living: city, country, flat-share"),
          bi("Konflikte mit Nachbarn oder Mitbewohnern ansprechen und lösen", "raise and resolve conflicts with neighbours or flatmates"),
          bi("eine Beschwerde schreiben", "write a letter of complaint")
        ],
        grammar: [
          g("Relativsätze: Nominativ, Akkusativ, Dativ", "Relative clauses: nominative, accusative, dative", "der Nachbar, der laut ist · die Wohnung, die ich suche · der Freund, dem ich helfe", "the neighbour who is loud · the flat that I'm looking for · the friend I'm helping", "relativ"),
          g("Relativsätze mit Präposition", "Relative clauses with a preposition", "die Stadt, in der ich wohne · der Kollege, mit dem ich arbeite", "the city I live in · the colleague I work with"),
          g("Relativsatz: Verb ans Ende", "Relative clause: verb to the end", "Das ist die Frau, die im dritten Stock wohnt.", "That's the woman who lives on the third floor.", "nebensatz"),
          g("Beschwerde: Redemittel", "Complaint: phrases", "Ich möchte mich darüber beschweren, dass … · Ich bitte Sie, dafür zu sorgen, dass …", "I'd like to complain that … · I ask you to ensure that …")
        ],
        vocab: [
          w("die Wohngemeinschaft (WG)", "flat-share"),
          w("der Mitbewohner, die Mitbewohnerin", "flatmate"),
          w("die Hausordnung", "house rules"),
          w("die Ruhezeit", "quiet hours"),
          w("der Lärm / laut / leise", "noise / loud / quiet"),
          w("sich beschweren über", "to complain about"),
          w("der Streit / sich streiten", "argument / to argue"),
          w("sich vertragen / sich einigen", "to get along / to come to an agreement"),
          w("die Hausverwaltung", "property management"),
          w("die Renovierung / renovieren", "renovation / to renovate"),
          w("die Umgebung / das Viertel", "surroundings / neighbourhood"),
          w("auf dem Land / in der Stadt", "in the country / in the city"),
          w("die Miete erhöhen", "to raise the rent"),
          w("die Kündigungsfrist", "notice period"),
          w("die Wohnungsbesichtigung", "flat viewing")
        ],
        links: [
          yt("Relativsätze Deutsch B1 erklärt", "Relativsätze erklärt", "Relative clauses explained"),
          yt("Nicos Weg B1 Wohnen Nachbarn", "Nicos Weg B1: Wohnen", "Nicos Weg B1: housing")
        ]
      }
    ),

    section(
      "b1_s03",
      bi("Gesundheit, Ernährung & Fitness", "Health, nutrition & fitness"),
      bi("Das Rezept wird ausgestellt. Das Passiv — wenn es nicht darauf ankommt, wer etwas tut.", "Das Rezept wird ausgestellt. The passive — for when it doesn't matter who does it."),
      {
        canDo: [
          bi("über Ernährung, Sport und Stress sprechen und Ratschläge geben", "talk about diet, sport and stress and give advice"),
          bi("Abläufe beschreiben: was gemacht wird, ohne den Täter zu nennen", "describe processes: what gets done, without naming who"),
          bi("Informationstexte über Gesundheit verstehen", "understand information texts about health")
        ],
        grammar: [
          g("Passiv Präsens: werden + Partizip II", "Present passive: werden + past participle", "Das Rezept wird vom Arzt ausgestellt. Hier wird nicht geraucht.", "The prescription is issued by the doctor. No smoking here.", "passiv"),
          g("Passiv Präteritum", "Simple-past passive", "Der Patient wurde gestern operiert.", "The patient was operated on yesterday."),
          g("Passiv mit Modalverb", "Passive with a modal verb", "Die Tabletten müssen zweimal täglich genommen werden.", "The tablets must be taken twice a day."),
          g("von oder durch?", "von or durch?", "von + Person (vom Arzt) · durch + Mittel (durch Sport)", "von + person (by the doctor) · durch + means (through sport)")
        ],
        vocab: [
          w("die Untersuchung / untersuchen", "examination / to examine"),
          w("die Behandlung / behandeln", "treatment / to treat"),
          w("die Operation / operieren", "operation / to operate"),
          w("die Diagnose", "diagnosis"),
          w("das Symptom, die Symptome", "symptom"),
          w("der Stress / gestresst", "stress / stressed"),
          w("sich entspannen", "to relax"),
          w("die Vorsorge", "preventive care"),
          w("die Impfung / impfen", "vaccination / to vaccinate"),
          w("ausgewogen / vegetarisch / vegan", "balanced / vegetarian / vegan"),
          w("die Kalorie, der Zucker, das Fett", "calorie, sugar, fat"),
          w("verzichten auf", "to do without"),
          w("die Sucht / süchtig", "addiction / addicted"),
          w("das Fitnessstudio", "gym"),
          w("regelmäßig", "regularly")
        ],
        links: [
          yt("Passiv Deutsch B1 werden Partizip erklärt", "Das Passiv erklärt", "The passive explained"),
          yt("Nicos Weg B1 Gesundheit", "Nicos Weg B1: Gesundheit", "Nicos Weg B1: health")
        ]
      }
    ),

    section(
      "b1_s04",
      bi("Bildung, Schule & Lernen", "Education, school & learning"),
      bi("Ich habe vor, Deutsch zu lernen, um in Deutschland zu arbeiten. Infinitiv mit zu, um … zu und damit.", "Ich habe vor, Deutsch zu lernen, um in Deutschland zu arbeiten. Infinitive with zu, um … zu and damit."),
      {
        canDo: [
          bi("über deinen Bildungsweg und Lernziele sprechen", "talk about your education and learning goals"),
          bi("das deutsche Schulsystem in Grundzügen erklären", "explain the German school system in outline"),
          bi("Absichten und Ziele ausdrücken", "express intentions and purposes")
        ],
        grammar: [
          g("Infinitiv mit zu", "Infinitive with zu", "Ich habe vor, einen Kurs zu machen. Es ist wichtig, regelmäßig zu üben.", "I plan to take a course. It's important to practise regularly.", "infinitiv-zu"),
          g("um … zu / damit", "um … zu / damit", "Ich lerne, um die Prüfung zu bestehen. Ich lerne, damit meine Kinder stolz sind.", "I study in order to pass the exam. I study so that my children are proud."),
          g("Verben ohne zu", "Verbs without zu", "Modalverben · lassen · sehen, hören · gehen, bleiben: Ich gehe schwimmen.", "modals · lassen · sehen, hören · gehen, bleiben: I'm going swimming."),
          g("brauchen … zu / nicht brauchen", "brauchen … zu", "Du brauchst nicht zu kommen. Du brauchst nur anzurufen.", "You don't need to come. You only need to call.")
        ],
        vocab: [
          w("das Schulsystem", "school system"),
          w("die Grundschule, das Gymnasium, die Realschule", "primary school, grammar school, secondary school"),
          w("das Abitur / der Abschluss", "A-levels equivalent / qualification"),
          w("die Ausbildung / die Lehre", "vocational training / apprenticeship"),
          w("die Universität / die Hochschule", "university / college"),
          w("das Fach, die Fächer", "subject"),
          w("die Note, die Noten", "grade, mark"),
          w("die Prüfung bestehen / durchfallen", "to pass / fail the exam"),
          w("das Ziel / sich ein Ziel setzen", "goal / to set a goal"),
          w("die Absicht / vorhaben", "intention / to intend"),
          w("der Sprachkurs / das Sprachniveau", "language course / language level"),
          w("die Fortbildung", "in-service training"),
          w("das Stipendium", "scholarship"),
          w("lebenslanges Lernen", "lifelong learning"),
          w("sich konzentrieren auf", "to concentrate on")
        ],
        links: [
          yt("Infinitiv mit zu um zu damit B1 erklärt", "Infinitiv mit zu · um … zu · damit", "Infinitive with zu · um … zu · damit"),
          yt("Easy German school system Germany", "Easy German: das Schulsystem", "Easy German: the school system")
        ]
      }
    ),

    section(
      "b1_s05",
      bi("Medien & Kommunikation", "Media & communication"),
      bi("Meiner Meinung nach … Eine Meinung sagen, begründen, verbinden: deshalb, trotzdem, außerdem — und der erste Blick auf die indirekte Rede.", "Meiner Meinung nach … Giving, justifying and connecting an opinion: deshalb, trotzdem, außerdem — and a first look at reported speech."),
      {
        canDo: [
          bi("deine Meinung zu Medien, Handy und sozialen Netzwerken begründen", "give reasons for your opinion on media, phones and social networks"),
          bi("Argumente verbinden und gegeneinander abwägen", "connect arguments and weigh them against each other"),
          bi("wiedergeben, was jemand gesagt hat", "report what someone said")
        ],
        grammar: [
          g("Konnektoren mit Verb direkt danach", "Connectors with the verb straight after", "deshalb · deswegen · trotzdem · außerdem · dann · sonst — Ich bin müde, trotzdem lese ich noch.", "therefore · therefore · nevertheless · besides · then · otherwise — I'm tired, but I'll still read.", "konnektoren"),
          g("Meinung äußern", "Expressing opinion", "Ich bin der Meinung, dass … · Meiner Meinung nach … · Ich finde es gut, wenn …", "I'm of the opinion that … · In my opinion … · I think it's good when …"),
          g("Indirekte Rede: erster Schritt", "Reported speech: first step", "Sie sagt, dass sie kein Fernsehen mehr schaut.", "She says that she doesn't watch TV any more.", "nebensatz"),
          g("Zustimmen & widersprechen", "Agreeing & disagreeing", "Da stimme ich dir zu. · Das sehe ich anders. · Einerseits … andererseits …", "I agree with you there. · I see that differently. · On the one hand … on the other …")
        ],
        vocab: [
          w("die Medien (Pl.)", "media"),
          w("die sozialen Netzwerke", "social networks"),
          w("der Einfluss / beeinflussen", "influence / to influence"),
          w("die Werbung / werben", "advertising / to advertise"),
          w("die Nachricht / die Meldung", "news item / report"),
          w("die Quelle / zuverlässig", "source / reliable"),
          w("die Falschmeldung", "fake news"),
          w("der Datenschutz", "data protection"),
          w("die Privatsphäre", "privacy"),
          w("abhängig sein von", "to be dependent on"),
          w("die Meinung / meiner Meinung nach", "opinion / in my opinion"),
          w("das Argument / der Vorteil / der Nachteil", "argument / advantage / disadvantage"),
          w("zustimmen / widersprechen", "to agree / to contradict"),
          w("einerseits … andererseits", "on the one hand … on the other"),
          w("die Diskussion / diskutieren", "discussion / to discuss")
        ],
        links: [
          yt("deshalb trotzdem außerdem Konnektoren B1 erklärt", "deshalb, trotzdem, außerdem", "deshalb, trotzdem, außerdem"),
          yt("Easy German social media smartphone", "Easy German: Handy & soziale Medien", "Easy German: phones & social media")
        ]
      }
    ),

    section(
      "b1_s06",
      bi("Reisen & Mobilität", "Travel & mobility"),
      bi("Als ich in Berlin war … Die Zeit im Nebensatz: als, wenn, während, bevor, nachdem, bis, seit — und das Plusquamperfekt dazu.", "Als ich in Berlin war … Time in the subordinate clause: als, wenn, während, bevor, nachdem, bis, seit — and the pluperfect that goes with it."),
      {
        canDo: [
          bi("eine Reise ausführlich erzählen, in der richtigen Reihenfolge", "narrate a journey in detail and in the right order"),
          bi("Verkehrsmittel vergleichen und Meinungen zum Verkehr äußern", "compare means of transport and give views on traffic"),
          bi("Probleme unterwegs lösen: Verspätung, Verlust, Umbuchung", "solve problems on the road: delay, loss, rebooking")
        ],
        grammar: [
          g("Temporale Nebensätze", "Temporal clauses", "als (einmal, Vergangenheit) · wenn (immer / Zukunft) · während · bevor · nachdem · bis · seit(dem) · sobald", "als (once, past) · wenn (repeated / future) · while · before · after · until · since · as soon as", "temporal-clauses"),
          g("als oder wenn?", "als or wenn?", "Als ich Kind war, … (einmal) — Wenn ich müde bin, … (immer)", "When I was a child, … (once) — When I'm tired, … (every time)"),
          g("Plusquamperfekt", "Pluperfect", "Nachdem wir gegessen hatten, gingen wir spazieren.", "After we had eaten, we went for a walk.", "timeline"),
          g("Zwei Zeiten, eine Reihenfolge", "Two tenses, one order", "nachdem + Plusquamperfekt, Hauptsatz + Präteritum/Perfekt", "nachdem + pluperfect, main clause + simple past/perfect")
        ],
        vocab: [
          w("die Mobilität", "mobility"),
          w("das Verkehrsmittel, -", "means of transport"),
          w("der öffentliche Nahverkehr (ÖPNV)", "public transport"),
          w("die Umbuchung / umbuchen", "rebooking / to rebook"),
          w("die Erstattung / erstatten", "refund / to refund"),
          w("der Anschluss (verpassen)", "connection (to miss)"),
          w("das Fundbüro", "lost-property office"),
          w("die Unterkunft, die Unterkünfte", "accommodation"),
          w("die Ferienwohnung", "holiday flat"),
          w("die Pauschalreise", "package holiday"),
          w("das Reiseziel", "destination"),
          w("die Landschaft", "landscape"),
          w("unterwegs sein", "to be on the road"),
          w("sich verfahren / sich verlaufen", "to lose one's way (driving / walking)"),
          w("die Fahrgemeinschaft", "car pool")
        ],
        links: [
          yt("als wenn nachdem bevor während temporale Nebensätze B1", "Temporale Nebensätze", "Temporal clauses"),
          yt("Nicos Weg B1 Reise", "Nicos Weg B1: Reisen", "Nicos Weg B1: travel")
        ]
      }
    ),

    section(
      "b1_s07",
      bi("Umwelt & Natur", "Environment & nature"),
      bi("Wegen des Klimawandels … Der Genitiv mit seinen Präpositionen, und die Adjektivendungen in allen vier Fällen.", "Wegen des Klimawandels … The genitive with its prepositions, and adjective endings in all four cases."),
      {
        canDo: [
          bi("über Umweltprobleme und Lösungen sprechen", "talk about environmental problems and solutions"),
          bi("Ursachen und Gegensätze mit wegen und trotz ausdrücken", "express causes and contrasts with wegen and trotz"),
          bi("Natur und Landschaft genau beschreiben", "describe nature and landscape precisely")
        ],
        grammar: [
          g("Genitiv", "Genitive", "die Folgen des Klimawandels · die Zukunft der Kinder · das Ende des Jahres", "the consequences of climate change · the children's future · the end of the year", "genitiv"),
          g("Präpositionen mit Genitiv", "Prepositions with the genitive", "wegen · trotz · während · (an)statt · innerhalb · außerhalb", "because of · despite · during · instead of · within · outside"),
          g("Adjektivdeklination — alle Fälle", "Adjective declension — every case", "mit dem sauberen Wasser · wegen der starken Hitze · ein großes Problem", "with the clean water · because of the strong heat · a big problem", "adjective-endings"),
          g("Adjektive ohne Artikel", "Adjectives without an article", "frisches Wasser · saubere Luft · mit großem Interesse", "fresh water · clean air · with great interest")
        ],
        vocab: [
          w("der Klimawandel", "climate change"),
          w("die Erderwärmung", "global warming"),
          w("die Umweltverschmutzung", "environmental pollution"),
          w("der Abfall / die Verpackung", "waste / packaging"),
          w("die erneuerbaren Energien", "renewable energies"),
          w("der Strom / die Energie sparen", "electricity / to save energy"),
          w("der Verbrauch / verbrauchen", "consumption / to consume"),
          w("umweltfreundlich / nachhaltig", "eco-friendly / sustainable"),
          w("schützen / der Naturschutz", "to protect / nature conservation"),
          w("die Folge, die Folgen", "consequence"),
          w("die Ursache / verursachen", "cause / to cause"),
          w("der Wald, der Berg, der See, die Küste", "forest, mountain, lake, coast"),
          w("das Tier / die Pflanze / die Art", "animal / plant / species"),
          w("aussterben / bedroht", "to die out / endangered"),
          w("die Maßnahme, die Maßnahmen", "measure")
        ],
        links: [
          yt("Genitiv Präpositionen wegen trotz während B1", "Genitiv & seine Präpositionen", "The genitive & its prepositions"),
          yt("Adjektivdeklination alle Fälle Tabelle erklärt", "Adjektivdeklination — die ganze Tabelle", "Adjective declension — the whole table")
        ]
      }
    ),

    section(
      "b1_s08",
      bi("Gesellschaft & Zusammenleben", "Society & living together"),
      bi("Obwohl er wenig Zeit hat, engagiert er sich. Gegensatz und Grund im Nebensatz, zweiteilige Konnektoren — argumentieren wie im Forum.", "Obwohl er wenig Zeit hat, engagiert er sich. Contrast and cause in the subordinate clause, two-part connectors — arguing as in a forum post."),
      {
        canDo: [
          bi("über Ehrenamt, Integration und das Leben in Deutschland sprechen", "talk about volunteering, integration and life in Germany"),
          bi("Pro und Contra abwägen und eine Stellungnahme schreiben", "weigh pros and cons and write a statement of opinion"),
          bi("Regeln und Gesetze in Grundzügen erklären", "explain rules and laws in outline")
        ],
        grammar: [
          g("obwohl, weil, da", "obwohl, weil, da", "Obwohl es regnet, gehen wir raus. Da er krank ist, bleibt er zu Hause.", "Although it's raining, we're going out. As he's ill, he's staying home.", "nebensatz"),
          g("Zweiteilige Konnektoren", "Two-part connectors", "nicht nur … sondern auch · sowohl … als auch · weder … noch · entweder … oder · zwar … aber", "not only … but also · both … and · neither … nor · either … or · admittedly … but", "zweiteilig"),
          g("Nebensatz vor dem Hauptsatz", "Subordinate clause first", "Weil ich Zeit habe, helfe ich. — Nebensatz zählt als Position 1, dann kommt das Verb.", "Because I have time, I help. — the clause is position 1, then the verb.", "v2"),
          g("Stellungnahme: Aufbau", "Statement: structure", "Einleitung → Argumente pro → Argumente contra → eigene Meinung → Schluss", "introduction → arguments for → arguments against → own view → conclusion")
        ],
        vocab: [
          w("die Gesellschaft / gesellschaftlich", "society / social"),
          w("das Ehrenamt / ehrenamtlich", "volunteering / voluntary"),
          w("sich engagieren für", "to get involved in"),
          w("die Integration / sich integrieren", "integration / to integrate"),
          w("die Migration / der Migrant, die Migrantin", "migration / migrant"),
          w("die Staatsangehörigkeit", "nationality, citizenship"),
          w("das Gesetz, die Gesetze", "law"),
          w("die Regel / die Pflicht / das Recht", "rule / duty / right"),
          w("die Gleichberechtigung", "equality"),
          w("die Toleranz / tolerant", "tolerance / tolerant"),
          w("das Vorurteil, die Vorurteile", "prejudice"),
          w("die Verantwortung / verantwortlich", "responsibility / responsible"),
          w("die Generation", "generation"),
          w("der Zusammenhalt", "cohesion"),
          w("die Stellungnahme", "statement of opinion")
        ],
        links: [
          yt("zweiteilige Konnektoren nicht nur sondern auch B1", "Zweiteilige Konnektoren", "Two-part connectors"),
          yt("Easy German what do Germans think about", "Easy German: Meinungen auf der Straße", "Easy German: street opinions")
        ]
      }
    ),

    section(
      "b1_s09",
      bi("Konsum, Geld & Verträge", "Consumption, money & contracts"),
      bi("Worauf wartest du? — Darauf. Präpositionaladverbien, die n-Deklination — und wie man einen Vertrag kündigt.", "Worauf wartest du? — Darauf. Prepositional adverbs, the n-declension — and how to cancel a contract."),
      {
        canDo: [
          bi("Verträge abschließen, verstehen und kündigen", "take out, understand and cancel contracts"),
          bi("über Geld, Sparen und Ausgaben sprechen", "talk about money, saving and spending"),
          bi("Rückfragen mit wo(r)- und da(r)- stellen und beantworten", "ask and answer follow-up questions with wo(r)- and da(r)-")
        ],
        grammar: [
          g("Präpositionaladverbien: darauf, worauf", "Prepositional adverbs: darauf, worauf", "Worauf wartest du? — Ich warte darauf, dass der Vertrag kommt. Auf wen wartest du? — Auf ihn.", "What are you waiting for? — For the contract to arrive. Who are you waiting for? — For him.", "pronominal-adverbs"),
          g("n-Deklination", "n-declension", "der Kunde → den Kunden, dem Kunden · der Name → des Namens · der Herr → den Herrn", "the customer (all other cases: -n) · the name · the gentleman"),
          g("Verben mit Präposition: Geld", "Verbs with prepositions: money", "sich ärgern über · sich beschweren bei · achten auf · sparen für", "to be annoyed about · to complain to · to pay attention to · to save for"),
          g("Kündigung: Textbausteine", "Cancellation: building blocks", "Hiermit kündige ich meinen Vertrag fristgerecht zum … · Bitte bestätigen Sie mir die Kündigung schriftlich.", "I hereby cancel my contract with due notice as of … · Please confirm the cancellation in writing.")
        ],
        vocab: [
          w("der Vertrag abschließen / kündigen", "to take out / cancel a contract"),
          w("die Kündigung / fristgerecht", "cancellation / within the notice period"),
          w("die Laufzeit", "contract term"),
          w("die Gebühr, die Gebühren", "fee"),
          w("die Rechnung / die Mahnung", "invoice / reminder"),
          w("das Konto / überweisen", "account / to transfer"),
          w("die Überweisung / die Lastschrift", "bank transfer / direct debit"),
          w("sparen / die Ersparnisse", "to save / savings"),
          w("die Ausgaben / die Einnahmen", "spending / income"),
          w("der Kredit / die Schulden", "loan / debts"),
          w("der Kunde, die Kundin", "customer"),
          w("der Kundenservice", "customer service"),
          w("die Versicherung / versichern", "insurance / to insure"),
          w("das Kleingedruckte", "the small print"),
          w("der Rabatt", "discount")
        ],
        links: [
          yt("Präpositionaladverbien darauf worauf erklärt B1", "darauf, worauf & Co.", "darauf, worauf & co."),
          yt("n-Deklination erklärt Deutsch", "Die n-Deklination", "The n-declension")
        ]
      }
    ),

    section(
      "b1_s10",
      bi("Feste, Kultur & Traditionen", "Festivals, culture & traditions"),
      bi("Nächstes Jahr werde ich … Das Futur I für Pläne und Vermutungen, und die Bräuche, über die man beim Fest spricht.", "Nächstes Jahr werde ich … Futur I for plans and guesses, and the customs people talk about at the party."),
      {
        canDo: [
          bi("Pläne und Vorsätze für die Zukunft formulieren", "formulate plans and resolutions for the future"),
          bi("Vermutungen anstellen", "make assumptions"),
          bi("Feste und Bräuche vergleichen: hier und in deinem Land", "compare festivals and customs: here and in your country")
        ],
        grammar: [
          g("Futur I: werden + Infinitiv", "Futur I: werden + infinitive", "Nächstes Jahr werde ich nach Indien fliegen. Es wird bestimmt schön werden.", "Next year I'll fly to India. It will certainly be lovely.", "futur"),
          g("Vermutung: wohl, wahrscheinlich, vermutlich", "Assumption: wohl, wahrscheinlich, vermutlich", "Er wird wohl krank sein. Sie kommt wahrscheinlich später.", "He's probably ill. She'll probably come later."),
          g("Präsens für die Zukunft", "Present for the future", "Morgen feiern wir. Nächste Woche fahre ich weg.", "We're celebrating tomorrow. Next week I'm going away."),
          g("Vergleichen: im Gegensatz zu, während", "Comparing: im Gegensatz zu, während", "Im Gegensatz zu Deutschland feiert man bei uns … Während hier …, ist es bei uns …", "Unlike Germany, we celebrate … While here …, at home it's …")
        ],
        vocab: [
          w("der Brauch, die Bräuche", "custom"),
          w("die Tradition / traditionell", "tradition / traditional"),
          w("der Feiertag, die Feiertage", "public holiday"),
          w("der Karneval / der Fasching", "carnival"),
          w("der Weihnachtsmarkt", "Christmas market"),
          w("der Adventskalender", "advent calendar"),
          w("das Oktoberfest", "Oktoberfest"),
          w("die Kultur / kulturell", "culture / cultural"),
          w("die Heimat", "home, homeland"),
          w("der Vorsatz, die Vorsätze", "resolution"),
          w("planen / der Plan", "to plan / plan"),
          w("vermutlich / wahrscheinlich", "presumably / probably"),
          w("die Zukunft / zukünftig", "future / in future"),
          w("stattfinden (findet statt)", "to take place"),
          w("die Stimmung", "atmosphere, mood")
        ],
        links: [
          yt("Futur I werden Infinitiv Vermutung B1", "Futur I: Pläne & Vermutungen", "Futur I: plans & assumptions"),
          yt("Easy German Christmas traditions Germany", "Easy German: Weihnachten in Deutschland", "Easy German: Christmas in Germany")
        ]
      }
    ),

    section(
      "b1_s11",
      bi("Gefühle, Persönlichkeit & Beziehungen", "Feelings, personality & relationships"),
      bi("Freundschaft, Zufriedenheit, Ehrlichkeit — die Wortbildung, mit der aus Adjektiven Nomen werden, und lassen in allen Bedeutungen.", "Freundschaft, Zufriedenheit, Ehrlichkeit — the word formation that turns adjectives into nouns, and lassen in all its senses."),
      {
        canDo: [
          bi("Menschen, Charakter und Gefühle differenziert beschreiben", "describe people, character and feelings with nuance"),
          bi("über Freundschaft, Familie und Konflikte sprechen", "talk about friendship, family and conflicts"),
          bi("Wörter aus bekannten Wörtern erschließen", "work out words from ones you already know")
        ],
        grammar: [
          g("Wortbildung: -ung, -heit, -keit, -schaft", "Word formation: -ung, -heit, -keit, -schaft", "die Freundschaft · die Zufriedenheit · die Ehrlichkeit · die Erfahrung — alle feminin", "friendship · contentment · honesty · experience — all feminine", "wortbildung"),
          g("lassen", "lassen", "Ich lasse mein Auto reparieren. Lass mich in Ruhe! Er lässt die Tür offen.", "I'm having my car repaired. Leave me alone! He leaves the door open."),
          g("Verben mit Dativ", "Dative verbs", "helfen · danken · gefallen · gehören · fehlen · gratulieren · vertrauen · zuhören", "help · thank · please · belong · be missing · congratulate · trust · listen to", "verben-fall"),
          g("Adjektive mit Präposition", "Adjectives with a preposition", "stolz auf · zufrieden mit · verliebt in · neugierig auf · enttäuscht von", "proud of · satisfied with · in love with · curious about · disappointed by")
        ],
        vocab: [
          w("die Persönlichkeit / der Charakter", "personality / character"),
          w("ehrlich / zuverlässig / geduldig", "honest / reliable / patient"),
          w("selbstbewusst / schüchtern", "self-confident / shy"),
          w("die Freundschaft / die Beziehung", "friendship / relationship"),
          w("das Vertrauen / vertrauen", "trust / to trust"),
          w("die Enttäuschung / enttäuscht", "disappointment / disappointed"),
          w("die Eifersucht / eifersüchtig", "jealousy / jealous"),
          w("die Angst / die Sorge", "fear / worry"),
          w("sich Sorgen machen um", "to worry about"),
          w("die Freude / sich freuen", "joy / to be pleased"),
          w("wütend / traurig / glücklich", "angry / sad / happy"),
          w("die Erziehung / erziehen", "upbringing / to bring up"),
          w("der Kompromiss", "compromise"),
          w("sich verstehen mit", "to get on with"),
          w("die Gefühle zeigen", "to show feelings")
        ],
        links: [
          yt("Wortbildung Nomen ung heit keit Deutsch B1", "Wortbildung: -ung, -heit, -keit", "Word formation: -ung, -heit, -keit"),
          yt("lassen Bedeutungen erklärt Deutsch B1", "Das Verb lassen", "The verb lassen")
        ]
      }
    ),

    section(
      "b1_s12",
      bi("Prüfung B1: Schreiben & Sprechen", "B1 exam: writing & speaking"),
      bi("Die drei Texte, die Präsentation und das Gespräch — mit den Redemitteln, die die Prüfer hören wollen.", "The three texts, the presentation and the discussion — with the phrases examiners want to hear."),
      {
        canDo: [
          bi("eine E-Mail, einen Forumsbeitrag und eine formelle Nachricht schreiben", "write an e-mail, a forum post and a formal message"),
          bi("eine kurze Präsentation zu einem Alltagsthema halten", "give a short presentation on an everyday topic"),
          bi("gemeinsam etwas planen und über Meinungen diskutieren", "plan something together and discuss opinions")
        ],
        grammar: [
          g("Schreiben Teil 1–3", "Writing parts 1–3", "informelle Nachricht (80 W.) · Forumsbeitrag mit Meinung (80 W.) · formelle E-Mail (40 W.)", "informal message (80 words) · forum post with opinion (80 words) · formal e-mail (40 words)"),
          g("Präsentation: Aufbau", "Presentation: structure", "Thema vorstellen → persönliche Erfahrung → Situation im Heimatland → Vor- und Nachteile → Meinung → Abschluss", "introduce topic → own experience → situation at home → pros and cons → opinion → close"),
          g("Redemittel Präsentation", "Presentation phrases", "Ich möchte über … sprechen. · Aus meiner Erfahrung … · Zusammenfassend kann ich sagen …", "I'd like to talk about … · From my experience … · To sum up, I can say …"),
          g("Die Prüfung", "The exam", "Lesen 65 · Hören 40 · Schreiben 60 · Sprechen 15 Minuten — Module einzeln bestehbar", "Reading 65 · Listening 40 · Writing 60 · Speaking 15 minutes — modules can be passed separately")
        ],
        vocab: [
          w("der Forumsbeitrag", "forum post"),
          w("die Präsentation / präsentieren", "presentation / to present"),
          w("das Thema, die Themen", "topic"),
          w("die Folie / das Stichwort", "slide / keyword"),
          w("Ich möchte über … sprechen.", "I'd like to talk about …"),
          w("Aus meiner Erfahrung …", "From my experience …"),
          w("In meinem Heimatland …", "In my home country …"),
          w("Ein Vorteil ist, dass … / Ein Nachteil ist, dass …", "One advantage is that … / One disadvantage is that …"),
          w("Zusammenfassend kann ich sagen, …", "To sum up, I can say …"),
          w("Vielen Dank für Ihre Aufmerksamkeit.", "Thank you for your attention."),
          w("Was hältst du davon?", "What do you think of that?"),
          w("Ich schlage vor, … / Wie wäre es, wenn …", "I suggest … / How about if …")
        ],
        links: [
          reading(GOETHE_EXAMS, "Goethe-Institut: Zertifikat B1 — Modellsätze", "Goethe-Institut: Zertifikat B1 — sample papers"),
          yt("Goethe Zertifikat B1 Sprechen Präsentation Beispiel", "B1-Prüfung: Präsentation (Beispiel)", "B1 exam: presentation (sample)")
        ]
      }
    )
  ]
};
