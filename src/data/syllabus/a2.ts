import type { LevelSyllabus } from "../../types";
import {
  GOETHE_A2_GOALS,
  GOETHE_A2_WORDS,
  SHARED_LINKS,
  TELC_A2_B1,
  bi,
  g,
  reading,
  section,
  yt
} from "./helpers";

/**
 * A2 — Waystage. Built against the Goethe-Zertifikat A2 objectives and word
 * list and the telc Deutsch A2 handbook. This is the level where German stops
 * being single sentences: the past tense arrives in full, and the subordinate
 * clause with it.
 */
export const A2_SYLLABUS: LevelSyllabus = {
  level: "A2",
  title: bi("A2 — Der Alltag in ganzen Sätzen", "A2 — Everyday life in full sentences"),
  intro: bi(
    "Du kommst im Alltag zurecht: Einkaufen, Arbeit, Wohnung, Reisen. Du erzählst, was gestern war, begründest mit weil und schreibst kurze E-Mails, die man versteht.",
    "You manage everyday situations: shopping, work, housing, travel. You say what happened yesterday, give reasons with weil, and write short e-mails that people understand."
  ),
  exam: bi("Goethe-Zertifikat A2 · telc Deutsch A2 · DTZ (A2·B1)", "Goethe-Zertifikat A2 · telc Deutsch A2 · DTZ (A2·B1)"),
  hours: bi("etwa 200–350 Unterrichtsstunden insgesamt", "roughly 200–350 lessons in total"),
  sources: [
    reading(GOETHE_A2_GOALS, "Goethe A2 — Prüfungsziele & Testbeschreibung", "Goethe A2 — exam objectives & test description"),
    reading(GOETHE_A2_WORDS, "Goethe A2 — offizielle Wortliste", "Goethe A2 — official word list"),
    reading(TELC_A2_B1, "telc Deutsch A2·B1 — Prüfungsformat", "telc Deutsch A2·B1 — exam format"),
    ...SHARED_LINKS
  ],
  sections: [
    section(
      "a2_s01",
      bi("Über die Vergangenheit sprechen: Perfekt", "Talking about the past: the perfect tense"),
      bi("haben oder sein, ge- oder nicht — das Perfekt vollständig, mit allen Stolpersteinen.", "haben or sein, ge- or not — the perfect tense in full, with every trap."),
      {
        canDo: [
          bi("erzählen, was du gestern und am Wochenende gemacht hast", "say what you did yesterday and at the weekend"),
          bi("von einer Reise oder einem Erlebnis berichten", "report on a trip or an experience"),
          bi("nach Erlebnissen fragen: Was hast du gemacht? Wo warst du?", "ask about experiences: What did you do? Where were you?")
        ],
        grammar: [
          g("Satzklammer: haben/sein … Partizip II", "Bracket: haben/sein … past participle", "Ich habe gestern lange gearbeitet. Wir sind nach Berlin gefahren.", "I worked late yesterday. We drove to Berlin.", "perfekt-frame"),
          g("sein bei Bewegung und Zustandswechsel", "sein for movement and change of state", "gehen, fahren, kommen, fliegen · aufwachen, einschlafen, aufstehen · bleiben, sein", "go, drive, come, fly · wake up, fall asleep, get up · stay, be"),
          g("Partizip II: regelmäßig & unregelmäßig", "Participles: regular & irregular", "gemacht · gearbeitet · gegessen · getrunken · geschrieben", "made · worked · eaten · drunk · written"),
          g("Trennbar & untrennbar", "Separable & inseparable", "aufgestanden · eingekauft — aber: besucht, erzählt, verstanden", "got up · shopped — but: visited, told, understood", "separable")
        ],
        links: [
          yt("Nicos Weg A2 Perfekt", "Nicos Weg A2: Perfekt", "Nicos Weg A2: perfect tense"),
          yt("Perfekt haben oder sein erklärt", "haben oder sein im Perfekt?", "haben or sein in the perfect?")
        ]
      }
    ),

    section(
      "a2_s02",
      bi("Präteritum: war, hatte, konnte", "Simple past: war, hatte, konnte"),
      bi("Nicht alles steht im Perfekt: sein, haben und die Modalverben erzählen im Präteritum.", "Not everything goes in the perfect: sein, haben and the modal verbs narrate in the simple past."),
      {
        canDo: [
          bi("sagen, wo du warst und was du hattest", "say where you were and what you had"),
          bi("erzählen, was du früher konntest, musstest, wolltest", "say what you could, had to and wanted to do in the past"),
          bi("einen kurzen Bericht über früher schreiben", "write a short account of the past")
        ],
        grammar: [
          g("war & hatte", "war & hatte", "Ich war gestern krank. Wir hatten keine Zeit.", "I was ill yesterday. We had no time.", "timeline"),
          g("Modalverben im Präteritum", "Modal verbs in the simple past", "Ich konnte nicht kommen. Er musste arbeiten. Sie wollte schlafen.", "I couldn't come. He had to work. She wanted to sleep."),
          g("Präteritum oder Perfekt?", "Simple past or perfect?", "Gesprochen: Perfekt. sein, haben, Modalverben: Präteritum. Geschrieben: oft Präteritum.", "Spoken: perfect. sein, haben, modals: simple past. Written: often simple past."),
          g("Erzählen: dann, danach, plötzlich", "Narrating: dann, danach, plötzlich", "Zuerst war es ruhig, dann kam plötzlich der Regen.", "First it was quiet, then suddenly the rain came.")
        ],
        links: [
          yt("Präteritum sein haben Modalverben A2", "Präteritum: war, hatte, konnte", "Simple past: war, hatte, konnte"),
          yt("Nicos Weg A2 früher", "Nicos Weg A2: Früher und heute", "Nicos Weg A2: then and now")
        ]
      }
    ),

    section(
      "a2_s03",
      bi("Wohnen & Nachbarschaft", "Home & neighbourhood"),
      bi("Wo steht der Tisch? Wohin stellst du ihn? Die Wechselpräpositionen — Dativ oder Akkusativ, je nach Frage.", "Where is the table? Where are you putting it? Two-way prepositions — dative or accusative, depending on the question."),
      {
        canDo: [
          bi("eine Wohnung suchen, besichtigen und beschreiben", "look for, view and describe a flat"),
          bi("sagen, wo etwas ist und wohin du es stellst", "say where something is and where you're putting it"),
          bi("mit Nachbarn sprechen: Bitte, Beschwerde, Hilfe", "talk to neighbours: requests, complaints, help")
        ],
        grammar: [
          g("Wechselpräpositionen: Wo? Dativ — Wohin? Akkusativ", "Two-way prepositions: Wo? dative — Wohin? accusative", "Das Buch liegt auf dem Tisch. Ich lege das Buch auf den Tisch.", "The book is on the table. I put the book on the table.", "wechsel"),
          g("Die vier Fälle im Überblick", "The four cases at a glance", "der/den/dem/des · die/die/der/der · das/das/dem/des · die/die/den/der", "masculine · feminine · neuter · plural", "cases"),
          g("stellen/stehen, legen/liegen, setzen/sitzen", "stellen/stehen, legen/liegen, setzen/sitzen", "Ich stelle die Lampe in die Ecke. Die Lampe steht in der Ecke.", "I put the lamp in the corner. The lamp stands in the corner."),
          g("Dativ-Verben", "Dative verbs", "Ich helfe dem Nachbarn. Das gehört mir. Die Wohnung gefällt uns.", "I help the neighbour. That belongs to me. We like the flat.", "verben-fall")
        ],
        links: [
          yt("Wechselpräpositionen erklärt Wo Wohin", "Wechselpräpositionen: Wo? Wohin?", "Two-way prepositions: Wo? Wohin?"),
          yt("Nicos Weg A2 Wohnungssuche", "Nicos Weg A2: Wohnungssuche", "Nicos Weg A2: flat hunting")
        ]
      }
    ),

    section(
      "a2_s04",
      bi("Reisen & Verkehr", "Travel & transport"),
      bi("Fahrkarten, Hotels, Fahrpläne — und die Präpositionen der Zeit: seit, vor, ab, bis.", "Tickets, hotels, timetables — and the prepositions of time: seit, vor, ab, bis."),
      {
        canDo: [
          bi("eine Reise planen: Fahrkarte, Hotel, Verbindung", "plan a trip: ticket, hotel, connection"),
          bi("am Schalter, im Hotel und am Flughafen zurechtkommen", "manage at the ticket desk, the hotel and the airport"),
          bi("sagen, seit wann und wie lange", "say since when and for how long")
        ],
        grammar: [
          g("Temporale Präpositionen", "Time prepositions", "seit zwei Jahren · vor einer Woche · ab Montag · bis Freitag · von … bis", "for two years · a week ago · from Monday · until Friday · from … to", "temporal"),
          g("nach, zu, in — Wohin?", "nach, zu, in — Wohin?", "nach Berlin · zum Bahnhof · in die Schweiz · ins Hotel", "to Berlin · to the station · to Switzerland · into the hotel"),
          g("Dativ-Präpositionen", "Dative prepositions", "aus · bei · mit · nach · seit · von · zu · gegenüber", "from · at · with · to/after · since · from/of · to · opposite", "dativ-preps"),
          g("Höflich fragen", "Asking politely", "Könnten Sie mir sagen, wann der Zug fährt? Ich hätte gern ein Einzelzimmer.", "Could you tell me when the train leaves? I'd like a single room.", "konjunktiv2")
        ],
        links: [
          yt("Nicos Weg A2 Reisen Bahnhof", "Nicos Weg A2: Reisen", "Nicos Weg A2: travelling"),
          yt("seit vor ab bis temporale Präpositionen erklärt", "seit, vor, ab, bis erklärt", "seit, vor, ab, bis explained")
        ]
      }
    ),

    section(
      "a2_s05",
      bi("Arbeit, Ausbildung & Beruf", "Work, training & career"),
      bi("Der Nebensatz: weil und dass schicken das Verb ans Ende. Dazu sollen und dürfen.", "The subordinate clause: weil and dass send the verb to the end. Plus sollen and dürfen."),
      {
        canDo: [
          bi("über Arbeit, Ausbildung und Berufswünsche sprechen", "talk about work, training and career wishes"),
          bi("begründen, warum du etwas tust oder nicht", "give reasons why you do or don't do something"),
          bi("einen Termin vereinbaren, verschieben, absagen", "arrange, postpone and cancel an appointment")
        ],
        grammar: [
          g("Nebensatz mit weil, dass", "Subordinate clause with weil, dass", "Ich lerne Deutsch, weil ich in Nürnberg arbeite. Ich glaube, dass er kommt.", "I'm learning German because I work in Nuremberg. I think that he's coming.", "nebensatz"),
          g("sollen & dürfen", "sollen & dürfen", "Du sollst den Chef anrufen. Hier darf man nicht rauchen.", "You're supposed to call the boss. You may not smoke here.", "modal-frame"),
          g("Alle Modalverben im Präsens", "All modal verbs in the present", "können · müssen · wollen · sollen · dürfen · möchten/mögen", "can · must · want · should · may · would like"),
          g("Termine: Uhrzeit & Datum", "Appointments: time & date", "am 3. März um halb zehn · Passt es Ihnen am Dienstag?", "on 3 March at half past nine · Does Tuesday suit you?", "temporal-uai")
        ],
        links: [
          yt("Nebensätze weil dass Wortstellung erklärt", "weil & dass: Verb ans Ende", "weil & dass: verb to the end"),
          yt("Nicos Weg A2 Arbeit Beruf", "Nicos Weg A2: Arbeit", "Nicos Weg A2: work")
        ]
      }
    ),

    section(
      "a2_s06",
      bi("Gesundheit & Ernährung", "Health & nutrition"),
      bi("Ich fühle mich nicht gut. Reflexive Verben, Ratschläge mit sollte, und was der Arzt sagt.", "Ich fühle mich nicht gut. Reflexive verbs, advice with sollte, and what the doctor says."),
      {
        canDo: [
          bi("Beschwerden genau beschreiben und Fragen des Arztes beantworten", "describe symptoms precisely and answer a doctor's questions"),
          bi("Ratschläge geben und verstehen", "give and understand advice"),
          bi("über gesunde Ernährung und Sport sprechen", "talk about healthy eating and exercise")
        ],
        grammar: [
          g("Reflexive Verben", "Reflexive verbs", "Ich fühle mich müde. Er hat sich erkältet. Wasch dir die Hände!", "I feel tired. He's caught a cold. Wash your hands!", "reflexiv"),
          g("Ratschläge mit sollte", "Advice with sollte", "Du solltest mehr schlafen. Sie sollten zum Arzt gehen.", "You should sleep more. You should see a doctor.", "konjunktiv2"),
          g("Imperativ mit Reflexivpronomen", "Imperative with reflexive pronoun", "Zieh dich warm an! Ruhen Sie sich aus!", "Dress warmly! Have a rest!", "imperativ"),
          g("Wenn-Sätze (Bedingung)", "wenn-clauses (condition)", "Wenn du Fieber hast, bleib zu Hause.", "If you have a fever, stay at home.", "nebensatz")
        ],
        links: [
          yt("reflexive Verben Deutsch A2 erklärt", "Reflexive Verben erklärt", "Reflexive verbs explained"),
          yt("Nicos Weg A2 Gesundheit Arzt", "Nicos Weg A2: Gesundheit", "Nicos Weg A2: health")
        ]
      }
    ),

    section(
      "a2_s07",
      bi("Einkaufen, Konsum & Dienstleistungen", "Shopping, consumption & services"),
      bi("Billiger, besser, am besten: Vergleiche — und was du sagst, wenn etwas kaputt ist.", "Cheaper, better, best: comparisons — and what to say when something is broken."),
      {
        canDo: [
          bi("Produkte vergleichen und eine Entscheidung begründen", "compare products and justify a choice"),
          bi("reklamieren und umtauschen", "complain and exchange goods"),
          bi("Angebote, Prospekte und Preise verstehen", "understand offers, leaflets and prices")
        ],
        grammar: [
          g("Komparativ & Superlativ", "Comparative & superlative", "billig – billiger – am billigsten · gut – besser – am besten · gern – lieber – am liebsten", "cheap – cheaper – cheapest · good – better – best · gladly – rather – most of all", "komparativ"),
          g("Vergleiche: als, so … wie", "Comparisons: als, so … wie", "Das Handy ist teurer als das andere. Es ist so groß wie meins.", "This phone is dearer than the other. It's as big as mine."),
          g("Adjektive vor dem Nomen — erste Endungen", "Adjectives before the noun — first endings", "der neue Laptop · ein neuer Laptop · die neue Jacke", "the new laptop · a new laptop · the new jacket", "adjective-endings"),
          g("Reklamation", "Complaining", "Das Gerät funktioniert nicht. Ich möchte es umtauschen.", "The device doesn't work. I'd like to exchange it.")
        ],
        links: [
          yt("Komparativ Superlativ Deutsch A2", "Komparativ & Superlativ", "Comparative & superlative"),
          yt("Easy German shopping in Germany", "Easy German: Einkaufen", "Easy German: shopping")
        ]
      }
    ),

    section(
      "a2_s08",
      bi("Medien, Kommunikation & Alltag", "Media, communication & everyday life"),
      bi("Weißt du, ob er kommt? Indirekte Fragen, wenn und ob — und Telefonieren auf Deutsch.", "Weißt du, ob er kommt? Indirect questions, wenn and ob — and phoning in German."),
      {
        canDo: [
          bi("telefonieren: sich melden, verbinden lassen, eine Nachricht hinterlassen", "phone: answer, ask to be put through, leave a message"),
          bi("über Handy, Internet und Fernsehen sprechen", "talk about phones, the internet and TV"),
          bi("eine Frage indirekt und höflich stellen", "ask a question indirectly and politely")
        ],
        grammar: [
          g("Indirekte Fragen mit ob und W-Wort", "Indirect questions with ob and W-words", "Weißt du, ob der Laden offen ist? Ich frage, wann er kommt.", "Do you know if the shop is open? I'm asking when he's coming.", "nebensatz"),
          g("wenn oder wann?", "wenn or wann?", "Wann kommst du? — Wenn ich Zeit habe.", "When are you coming? — When I have time."),
          g("Konjunktionen: und, aber, oder, denn", "Conjunctions: und, aber, oder, denn", "Ich bleibe zu Hause, denn ich bin müde. (Verb bleibt auf Position 2)", "I'm staying home, for I'm tired. (verb stays in second place)", "konnektoren"),
          g("Am Telefon", "On the phone", "Weber, guten Tag. — Könnte ich bitte Frau Meier sprechen?", "Weber speaking. — Could I speak to Ms Meier, please?")
        ],
        links: [
          yt("indirekte Fragen ob Deutsch A2", "Indirekte Fragen mit ob", "Indirect questions with ob"),
          yt("Nicos Weg A2 Telefonieren", "Nicos Weg A2: Telefonieren", "Nicos Weg A2: phoning")
        ]
      }
    ),

    section(
      "a2_s09",
      bi("Feste, Familie & Beziehungen", "Celebrations, family & relationships"),
      bi("Ich schenke dir etwas. Der Dativ für Personen — mir, dir, ihm — und die Possessivartikel in allen Fällen.", "Ich schenke dir etwas. The dative for people — mir, dir, ihm — and possessives in every case."),
      {
        canDo: [
          bi("einladen, gratulieren, sich bedanken", "invite, congratulate, say thank you"),
          bi("über Feste und Traditionen in deinem Land erzählen", "talk about festivals and traditions in your country"),
          bi("über Freunde und Beziehungen sprechen", "talk about friends and relationships")
        ],
        grammar: [
          g("Personalpronomen im Dativ", "Personal pronouns in the dative", "Ich schenke dir ein Buch. Das gefällt ihm. Kannst du uns helfen?", "I'm giving you a book. He likes that. Can you help us?", "pronouns"),
          g("Possessivartikel in allen Fällen", "Possessives in every case", "mein Bruder · meinen Bruder · meinem Bruder · meines Bruders", "my brother — nominative, accusative, dative, genitive", "possessive"),
          g("Verben mit Dativ und Akkusativ", "Verbs with dative and accusative", "Er gibt seiner Schwester das Geschenk. — Person: Dativ, Sache: Akkusativ", "He gives his sister the present. — person: dative, thing: accusative", "verben-fall"),
          g("Glückwünsche & Dank", "Congratulations & thanks", "Herzlichen Glückwunsch! Vielen Dank für die Einladung.", "Congratulations! Many thanks for the invitation.")
        ],
        links: [
          yt("Dativ Personalpronomen mir dir ihm erklärt", "Personalpronomen im Dativ", "Personal pronouns in the dative"),
          yt("Easy German German traditions holidays", "Easy German: Feste in Deutschland", "Easy German: German festivals")
        ]
      }
    ),

    section(
      "a2_s10",
      bi("Meine Stadt, Umwelt & Wetter", "My city, environment & weather"),
      bi("Der alte Marktplatz, ein schöner Park: Adjektivendungen nach der und ein — und der Genitiv taucht zum ersten Mal auf.", "The old market square, a beautiful park: adjective endings after der and ein — and the genitive appears for the first time."),
      {
        canDo: [
          bi("deine Stadt beschreiben und etwas empfehlen", "describe your city and recommend things"),
          bi("über Umwelt, Müll und Verkehr in der Stadt sprechen", "talk about the environment, waste and traffic in the city"),
          bi("Wetterberichte verstehen", "understand weather forecasts")
        ],
        grammar: [
          g("Adjektivendungen nach der/die/das", "Adjective endings after der/die/das", "der alte Markt · die schöne Kirche · das neue Rathaus · die engen Gassen", "the old market · the beautiful church · the new town hall · the narrow lanes", "adjective-endings"),
          g("Adjektivendungen nach ein/kein/mein", "Adjective endings after ein/kein/mein", "ein alter Markt · eine schöne Kirche · ein neues Rathaus", "an old market · a beautiful church · a new town hall"),
          g("Genitiv: erste Schritte", "Genitive: first steps", "das Zentrum der Stadt · der Name des Parks", "the centre of the city · the name of the park", "genitiv"),
          g("Empfehlen", "Recommending", "Du solltest unbedingt die Burg besuchen. Ich empfehle dir das Café am Fluss.", "You really should visit the castle. I recommend the café by the river.")
        ],
        links: [
          yt("Adjektivendungen Deutsch erklärt einfach", "Adjektivendungen einfach erklärt", "Adjective endings made simple"),
          yt("Easy German Nürnberg", "Easy German in Nürnberg", "Easy German in Nuremberg")
        ]
      }
    ),

    section(
      "a2_s11",
      bi("Freizeit, Sport & Kultur", "Leisure, sport & culture"),
      bi("Ich interessiere mich für Musik. Verben mit festen Präpositionen — und höflich fragen mit könnte und hätte.", "Ich interessiere mich für Musik. Verbs with fixed prepositions — and asking politely with könnte and hätte."),
      {
        canDo: [
          bi("über Interessen, Sport und Veranstaltungen sprechen", "talk about interests, sport and events"),
          bi("Karten reservieren und nach Öffnungszeiten fragen", "reserve tickets and ask about opening hours"),
          bi("Vorschläge machen und darauf reagieren", "make suggestions and respond to them")
        ],
        grammar: [
          g("Verben mit Präposition", "Verbs with a preposition", "sich interessieren für · warten auf · sich freuen auf/über · denken an", "to be interested in · to wait for · to look forward to / be pleased about · to think of", "pronominal-adverbs"),
          g("Konjunktiv II: höflich", "Konjunktiv II: politeness", "Könnten Sie mir helfen? Ich hätte gern zwei Karten. Wir würden gern kommen.", "Could you help me? I'd like two tickets. We'd like to come.", "konjunktiv2"),
          g("Vorschläge", "Suggestions", "Wollen wir ins Konzert gehen? Wie wäre es mit Samstag? — Gute Idee! / Lieber nicht.", "Shall we go to the concert? How about Saturday? — Good idea! / Rather not."),
          g("Wo? Wohin? Woher?", "Wo? Wohin? Woher?", "Wo bist du? Wohin gehst du? Woher kommst du?", "Where are you? Where are you going? Where do you come from?", "wechsel")
        ],
        links: [
          yt("Verben mit Präpositionen A2 Liste erklärt", "Verben mit Präpositionen", "Verbs with prepositions"),
          yt("Nicos Weg A2 Freizeit Kultur", "Nicos Weg A2: Freizeit & Kultur", "Nicos Weg A2: leisure & culture")
        ]
      }
    ),

    section(
      "a2_s12",
      bi("Schreiben & Sprechen für A2", "Writing & speaking for A2"),
      bi("E-Mails, die alle vier Punkte treffen. Sprechen in drei Teilen. Was die Prüfer wirklich sehen wollen.", "E-mails that hit all four points. Speaking in three parts. What examiners actually look for."),
      {
        canDo: [
          bi("eine E-Mail zu vier Leitpunkten schreiben — formell und informell", "write an e-mail on four given points — formal and informal"),
          bi("über dich sprechen, ein Thema mit Fragen bearbeiten, etwas aushandeln", "talk about yourself, work through a topic with questions, negotiate something"),
          bi("Alltagstexte verstehen: Anzeigen, Schilder, Prospekte", "understand everyday texts: ads, signs, leaflets")
        ],
        grammar: [
          g("Textbausteine E-Mail", "E-mail building blocks", "Vielen Dank für deine Nachricht. · Leider kann ich nicht kommen, weil … · Ich freue mich auf …", "Thanks for your message. · Unfortunately I can't come because … · I'm looking forward to …"),
          g("Formell: Sie und Konjunktiv", "Formal: Sie and Konjunktiv", "Sehr geehrte Frau Müller, könnten Sie mir bitte mitteilen, ob …", "Dear Ms Müller, could you please let me know whether …", "konjunktiv2"),
          g("Sprechen: gemeinsam planen", "Speaking: planning together", "Was meinst du? Sollen wir …? Ich schlage vor, dass …", "What do you think? Shall we …? I suggest that …"),
          g("Die Prüfung", "The exam", "Hören 30 · Lesen 30 · Schreiben 30 · Sprechen 15 Minuten", "Listening 30 · Reading 30 · Writing 30 · Speaking 15 minutes")
        ],
        links: [
          reading(GOETHE_A2_GOALS, "Goethe A2: so sieht die Prüfung aus", "Goethe A2: what the exam looks like"),
          yt("Goethe Zertifikat A2 Sprechen Prüfung Beispiel", "A2-Prüfung: Sprechen (Beispiel)", "A2 exam: speaking (sample)")
        ]
      }
    )
  ]
};
