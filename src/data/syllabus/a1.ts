import type { LevelSyllabus } from "../../types";
import {
  GOETHE_A1_GOALS,
  GOETHE_A1_WORDS,
  SHARED_LINKS,
  TELC_DOWNLOADS,
  bi,
  g,
  reading,
  section,
  yt
} from "./helpers";

/**
 * A1 — Breakthrough. Built against the Goethe-Institut's Start Deutsch 1
 * objectives and word list and the telc Deutsch A1 handbook: the themes are
 * theirs, the order follows how the textbooks (Menschen, Schritte, Netzwerk)
 * teach them, and the grammar is what the A1 exams actually test.
 */
export const A1_SYLLABUS: LevelSyllabus = {
  level: "A1",
  title: bi("A1 — Erste Schritte", "A1 — First steps"),
  intro: bi(
    "Du verstehst und benutzt einfache Sätze aus dem Alltag: dich vorstellen, nach dem Weg fragen, einkaufen, über deinen Tag sprechen. Langsam und deutlich gesprochen verstehst du das Wichtigste.",
    "You understand and use everyday phrases: introducing yourself, asking the way, shopping, talking about your day. Spoken slowly and clearly, you catch what matters."
  ),
  exam: bi("Goethe-Zertifikat A1 (Start Deutsch 1) · telc Deutsch A1", "Goethe-Zertifikat A1 (Start Deutsch 1) · telc Deutsch A1"),
  hours: bi("etwa 80–150 Unterrichtsstunden", "roughly 80–150 lessons"),
  sources: [
    reading(GOETHE_A1_GOALS, "Goethe A1 — Prüfungsziele & Testbeschreibung", "Goethe A1 — exam objectives & test description"),
    reading(GOETHE_A1_WORDS, "Goethe A1 — offizielle Wortliste", "Goethe A1 — official word list"),
    reading(TELC_DOWNLOADS, "telc — kostenlose Übungstests", "telc — free practice tests"),
    ...SHARED_LINKS
  ],
  sections: [
    section(
      "a1_s01",
      bi("Kennenlernen & Begrüßung", "Meeting people & greetings"),
      bi("Hallo, ich heiße … Woher kommst du? Die ersten Sätze, die du jeden Tag brauchst.", "Hallo, ich heiße … Woher kommst du? The first sentences you need every day."),
      {
        canDo: [
          bi("dich vorstellen: Name, Herkunft, Wohnort, Sprachen", "introduce yourself: name, origin, where you live, languages"),
          bi("jemanden begrüßen und verabschieden — du und Sie", "greet and say goodbye — du and Sie"),
          bi("nach dem Befinden fragen und antworten", "ask how someone is, and answer")
        ],
        grammar: [
          g("Personalpronomen & sein", "Personal pronouns & sein", "Ich bin Justins. Du bist aus Indien. Wir sind in Nürnberg.", "I am Justins. You are from India. We are in Nuremberg.", "verb-grid"),
          g("W-Fragen", "W-questions", "Wie heißt du? Woher kommst du? Wo wohnst du?", "What's your name? Where are you from? Where do you live?", "v2"),
          g("Regelmäßige Verben im Präsens", "Regular present-tense verbs", "ich wohne · du wohnst · er wohnt · wir wohnen", "I live · you live · he lives · we live"),
          g("du oder Sie", "du or Sie", "Wie heißt du? — Wie heißen Sie?", "informal — formal"),
          g("Begrüßung & Höflichkeit", "Greetings & politeness", "Hallo! Guten Morgen! Guten Tag! Guten Abend! — Auf Wiedersehen! Tschüss! · Danke. — Bitte. · Entschuldigung! · Wie geht's? — Gut, danke.", "Hello! Good morning! Good day! Good evening! — Goodbye! Bye! · Thank you. — You're welcome. · Excuse me! · How are you? — Fine, thanks.")
        ],
        links: [
          yt("Nicos Weg A1 Hallo Vorstellen", "Nicos Weg A1: Hallo!", "Nicos Weg A1: Hallo!"),
          yt("Easy German introduce yourself", "Easy German: sich vorstellen", "Easy German: introducing yourself")
        ]
      }
    ),

    section(
      "a1_s02",
      bi("Zahlen, Uhrzeit & Datum", "Numbers, time & dates"),
      bi("Von null bis tausend, Uhrzeiten auf zwei Arten, Wochentage und Monate.", "From zero to a thousand, telling the time two ways, days and months."),
      {
        canDo: [
          bi("Zahlen bis 1000 verstehen und sagen — auch Preise und Telefonnummern", "understand and say numbers to 1000 — prices and phone numbers too"),
          bi("die Uhrzeit fragen und sagen, formell und im Alltag", "ask and tell the time, formally and colloquially"),
          bi("Wochentage, Monate und das Datum nennen", "name days, months and the date")
        ],
        grammar: [
          g("Uhrzeit", "Telling the time", "Es ist halb drei. Um Viertel nach acht. Um 14:30 Uhr.", "It's half past two. At quarter past eight. At 2:30 pm.", "clock"),
          g("Zahlen: Einer vor Zehner", "Numbers: units before tens", "einundzwanzig · zweiunddreißig · neunundneunzig", "twenty-one · thirty-two · ninety-nine"),
          g("um / am / im", "um / am / im", "um 8 Uhr · am Montag · im Mai", "at 8 o'clock · on Monday · in May", "temporal-uai"),
          g("Fragen nach der Zeit", "Asking about time", "Wie spät ist es? Wann kommst du? Wie viel kostet das?", "What time is it? When are you coming? How much is it?"),
          g("Tage & Monate", "Days & months", "Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag · Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember · heute, morgen, gestern", "the days of the week · the months · today, tomorrow, yesterday")
        ],
        links: [
          yt("Deutsch Uhrzeit lernen A1", "Die Uhrzeit auf Deutsch", "Telling the time in German"),
          yt("Nicos Weg A1 Zahlen", "Nicos Weg A1: Zahlen", "Nicos Weg A1: numbers")
        ]
      }
    ),

    section(
      "a1_s03",
      bi("Familie & Freunde", "Family & friends"),
      bi("Wer gehört zu dir? haben, mein und dein, und die ersten Plurale.", "Who is in your life? haben, mein and dein, and the first plurals."),
      {
        canDo: [
          bi("deine Familie vorstellen und nach der Familie fragen", "introduce your family and ask about someone else's"),
          bi("sagen, was du hast und wie alt jemand ist", "say what you have and how old someone is"),
          bi("Personen kurz beschreiben", "describe people briefly")
        ],
        grammar: [
          g("haben", "haben", "Ich habe einen Bruder. Hast du Kinder? Sie hat keine Geschwister.", "I have a brother. Do you have children? She has no siblings.", "verb-grid"),
          g("Possessivartikel: mein, dein, sein, ihr", "Possessives: mein, dein, sein, ihr", "Das ist meine Schwester. Ihr Mann heißt Tom.", "That's my sister. Her husband is called Tom.", "possessive"),
          g("Plural bilden", "Building plurals", "das Kind → die Kinder · die Schwester → die Schwestern", "child → children · sister → sisters", "plural"),
          g("Adjektive nach sein", "Adjectives after sein", "Mein Bruder ist groß. Meine Eltern sind nett.", "My brother is tall. My parents are nice.")
        ],
        links: [
          yt("Nicos Weg A1 Familie", "Nicos Weg A1: Familie", "Nicos Weg A1: family"),
          yt("Easy German family vocabulary", "Easy German: Familie", "Easy German: family")
        ]
      }
    ),

    section(
      "a1_s04",
      bi("Wohnen", "Where you live"),
      bi("der, die, das — und warum das Genus alles Weitere bestimmt.", "der, die, das — and why gender decides everything that follows."),
      {
        canDo: [
          bi("deine Wohnung beschreiben: Zimmer, Möbel, Lage", "describe your flat: rooms, furniture, location"),
          bi("eine Wohnungsanzeige verstehen", "understand a flat advertisement"),
          bi("sagen, was es in einem Raum gibt", "say what there is in a room")
        ],
        grammar: [
          g("Artikel: der, die, das", "Articles: der, die, das", "der Tisch · die Lampe · das Bett — -e ist meist feminin, -chen immer neutrum", "table · lamp · bed — nouns in -e are mostly feminine, -chen always neuter", "genus"),
          g("es gibt + Akkusativ", "es gibt + accusative", "Es gibt einen Balkon und eine Küche.", "There is a balcony and a kitchen."),
          g("Plural: fünf Endungen", "Plural: five endings", "die Tische · die Lampen · die Kinder · die Autos · die Fenster", "tables · lamps · children · cars · windows", "plural"),
          g("Gegensätze", "Opposites", "groß – klein · hell – dunkel · teuer – billig · alt – neu", "big – small · bright – dark · expensive – cheap · old – new")
        ],
        links: [
          yt("Nicos Weg A1 Wohnung", "Nicos Weg A1: Wohnen", "Nicos Weg A1: living"),
          yt("der die das Regeln Genus lernen", "Genusregeln: der, die oder das?", "Gender rules: der, die or das?")
        ]
      }
    ),

    section(
      "a1_s05",
      bi("Essen, Trinken & Einkaufen", "Food, drink & shopping"),
      bi("Der erste Fall, der sich ändert: den und einen. Mengen, Preise und was du gern isst.", "The first case that changes anything: den and einen. Quantities, prices and what you like to eat."),
      {
        canDo: [
          bi("im Supermarkt und in der Bäckerei einkaufen", "shop at the supermarket and the bakery"),
          bi("im Café bestellen und bezahlen", "order and pay in a café"),
          bi("sagen, was du gern isst und trinkst", "say what you like to eat and drink")
        ],
        grammar: [
          g("Akkusativ: den, einen", "Accusative: den, einen", "Ich nehme den Kuchen. Ich möchte einen Kaffee.", "I'll take the cake. I'd like a coffee.", "akkusativ"),
          g("möchten", "möchten", "Ich möchte ein Brötchen. Möchtest du Tee?", "I'd like a roll. Would you like tea?"),
          g("Mengen", "Quantities", "ein Kilo Äpfel · eine Flasche Wasser · ein Stück Kuchen", "a kilo of apples · a bottle of water · a piece of cake"),
          g("kein im Akkusativ", "kein in the accusative", "Ich habe keinen Hunger. Wir haben kein Brot.", "I'm not hungry. We have no bread.", "negation")
        ],
        links: [
          yt("Nicos Weg A1 Einkaufen Essen", "Nicos Weg A1: Einkaufen", "Nicos Weg A1: shopping"),
          yt("Easy German ordering food", "Easy German: im Restaurant bestellen", "Easy German: ordering in a restaurant")
        ]
      }
    ),

    section(
      "a1_s06",
      bi("Tagesablauf", "Daily routine"),
      bi("Aufstehen, anfangen, einkaufen — Verben, die auseinanderfallen, und Verben, die den Vokal wechseln.", "Getting up, starting, shopping — verbs that split in two, and verbs that change their vowel."),
      {
        canDo: [
          bi("deinen Tag erzählen: wann du aufstehst, arbeitest, isst", "describe your day: when you get up, work, eat"),
          bi("nach dem Tagesablauf von anderen fragen", "ask about someone else's routine"),
          bi("sagen, wie oft du etwas machst", "say how often you do something")
        ],
        grammar: [
          g("Trennbare Verben", "Separable verbs", "Ich stehe um sieben Uhr auf. Wann fängt der Kurs an?", "I get up at seven. When does the course start?", "separable"),
          g("Vokalwechsel: fahren, schlafen, essen, lesen", "Vowel change: fahren, schlafen, essen, lesen", "du fährst · er schläft · sie isst · er liest", "you drive · he sleeps · she eats · he reads", "vowel-change"),
          g("Zeit zuerst, Verb bleibt auf 2", "Time first, verb stays second", "Um sieben Uhr stehe ich auf. Dann frühstücke ich.", "At seven I get up. Then I have breakfast.", "v2"),
          g("Häufigkeit", "Frequency", "immer · oft · manchmal · selten · nie", "always · often · sometimes · rarely · never")
        ],
        links: [
          yt("Nicos Weg A1 Tagesablauf", "Nicos Weg A1: Tagesablauf", "Nicos Weg A1: daily routine"),
          yt("trennbare Verben erklärt A1", "Trennbare Verben erklärt", "Separable verbs explained")
        ]
      }
    ),

    section(
      "a1_s07",
      bi("Freizeit & Hobbys", "Free time & hobbies"),
      bi("Was machst du gern? Modalverben und die Satzklammer, Ja/Nein-Fragen.", "What do you like doing? Modal verbs and the sentence bracket, yes/no questions."),
      {
        canDo: [
          bi("über Hobbys sprechen und sagen, was du gern machst", "talk about hobbies and what you like doing"),
          bi("jemanden einladen, zusagen oder absagen", "invite someone, accept or decline"),
          bi("sagen, was du kannst und was du möchtest", "say what you can do and what you'd like")
        ],
        grammar: [
          g("gern, lieber, am liebsten", "gern, lieber, am liebsten", "Ich spiele gern Fußball. Ich lese lieber. Am liebsten schwimme ich.", "I like playing football. I prefer reading. Most of all I like swimming."),
          g("Modalverben & Satzklammer", "Modal verbs & the bracket", "Ich kann gut kochen. Möchtest du ins Kino gehen?", "I can cook well. Would you like to go to the cinema?", "modal-frame"),
          g("Ja/Nein-Fragen", "Yes/no questions", "Spielst du Tennis? Hast du Zeit?", "Do you play tennis? Do you have time?", "ja-nein"),
          g("Verneinung mit nicht", "Negation with nicht", "Ich komme nicht. Das ist nicht gut.", "I'm not coming. That's not good.", "negation")
        ],
        links: [
          yt("Nicos Weg A1 Freizeit Hobbys", "Nicos Weg A1: Freizeit", "Nicos Weg A1: free time"),
          yt("Easy German hobbies what do you do in your free time", "Easy German: Hobbys", "Easy German: hobbies")
        ]
      }
    ),

    section(
      "a1_s08",
      bi("Arbeit & Beruf", "Work & jobs"),
      bi("Was bist du von Beruf? müssen und wollen, nicht und kein.", "What do you do for a living? müssen and wollen, nicht and kein."),
      {
        canDo: [
          bi("über deinen Beruf und deine Arbeit sprechen", "talk about your job and your work"),
          bi("sagen, was du tun musst und was du willst", "say what you have to do and what you want"),
          bi("einfache Aussagen verneinen", "negate simple statements")
        ],
        grammar: [
          g("Berufe: -in für Frauen", "Jobs: -in for women", "der Lehrer / die Lehrerin · der Arzt / die Ärztin", "teacher (m/f) · doctor (m/f)"),
          g("müssen & wollen", "müssen & wollen", "Ich muss um acht anfangen. Sie will Ärztin werden.", "I have to start at eight. She wants to become a doctor.", "modal-frame"),
          g("nicht oder kein?", "nicht or kein?", "Ich arbeite nicht. Ich habe keine Arbeit.", "I don't work. I have no work.", "negation"),
          g("als + Beruf", "als + job", "Ich arbeite als Krankenpfleger.", "I work as a nurse.")
        ],
        links: [
          yt("Nicos Weg A1 Beruf Arbeit", "Nicos Weg A1: Beruf", "Nicos Weg A1: jobs"),
          yt("nicht oder kein Deutsch A1 erklärt", "nicht oder kein?", "nicht or kein?")
        ]
      }
    ),

    section(
      "a1_s09",
      bi("Unterwegs: Wegbeschreibung & Verkehr", "Getting around: directions & transport"),
      bi("Gehen Sie geradeaus! Der Imperativ, und der Dativ nach mit, nach, zu, von.", "Gehen Sie geradeaus! The imperative, and the dative after mit, nach, zu, von."),
      {
        canDo: [
          bi("nach dem Weg fragen und einen Weg beschreiben", "ask for and give directions"),
          bi("eine Fahrkarte kaufen und einen Fahrplan lesen", "buy a ticket and read a timetable"),
          bi("sagen, wie du zur Arbeit kommst", "say how you get to work")
        ],
        grammar: [
          g("Imperativ", "Imperative", "Geh geradeaus! Nehmt den Bus! Gehen Sie links!", "Go straight on! Take the bus! Go left!", "imperativ"),
          g("Dativ nach mit, nach, zu, von", "Dative after mit, nach, zu, von", "Ich fahre mit dem Bus zur Arbeit. Sie kommt von der Schule.", "I take the bus to work. She's coming from school.", "dativ-preps"),
          g("Verkehrsmittel", "Means of transport", "mit dem Zug · mit der U-Bahn · zu Fuß", "by train · by underground · on foot"),
          g("Ortsangaben", "Giving locations", "links · rechts · geradeaus · an der Ampel · gegenüber · zu Fuß", "left · right · straight on · at the lights · opposite · on foot"),
          g("Nach dem Weg fragen", "Asking the way", "Entschuldigung, wie komme ich zum Bahnhof? — Gehen Sie geradeaus und dann links.", "Excuse me, how do I get to the station? — Go straight on and then left.")
        ],
        links: [
          yt("Nicos Weg A1 Wegbeschreibung", "Nicos Weg A1: Wegbeschreibung", "Nicos Weg A1: directions"),
          yt("Easy German asking for directions", "Easy German: nach dem Weg fragen", "Easy German: asking the way")
        ]
      }
    ),

    section(
      "a1_s10",
      bi("Gesundheit & Körper", "Health & the body"),
      bi("Mir tut der Kopf weh. Beim Arzt, in der Apotheke — und die ersten Sätze über gestern.", "Mir tut der Kopf weh. At the doctor's, at the pharmacy — and the first sentences about yesterday."),
      {
        canDo: [
          bi("sagen, was dir wehtut, und einen Arzttermin machen", "say what hurts and make a doctor's appointment"),
          bi("einfache Ratschläge verstehen und geben", "understand and give simple advice"),
          bi("erzählen, was gestern passiert ist — erste Schritte", "say what happened yesterday — first steps")
        ],
        grammar: [
          g("Perfekt: erste Schritte", "Perfect tense: first steps", "Ich habe gestern Tee getrunken. Wir haben Pizza gegessen.", "I drank tea yesterday. We ate pizza.", "perfekt-frame"),
          g("weh tun + Dativ", "weh tun + dative", "Mir tut der Kopf weh. Tut dir der Bauch weh?", "My head hurts. Does your stomach hurt?", "pronouns"),
          g("Ratschläge mit Imperativ (Sie)", "Advice with the Sie-imperative", "Trinken Sie viel Tee! Bleiben Sie im Bett!", "Drink lots of tea! Stay in bed!", "imperativ"),
          g("Fragen beim Arzt", "Questions at the doctor's", "Was fehlt Ihnen? Seit wann haben Sie Fieber?", "What's wrong? Since when have you had a fever?")
        ],
        links: [
          yt("Nicos Weg A1 beim Arzt", "Nicos Weg A1: beim Arzt", "Nicos Weg A1: at the doctor's"),
          yt("Perfekt Deutsch A1 erklärt haben Partizip", "Das Perfekt — erste Schritte", "The perfect tense — first steps")
        ]
      }
    ),

    section(
      "a1_s11",
      bi("Wetter, Kleidung & Farben", "Weather, clothes & colours"),
      bi("Es regnet. Was ziehst du an? Kurze Sätze mit Adjektiven und Farben.", "Es regnet. What are you wearing? Short sentences with adjectives and colours."),
      {
        canDo: [
          bi("über das Wetter und die Jahreszeiten sprechen", "talk about the weather and the seasons"),
          bi("Kleidung kaufen: Größe, Farbe, Preis", "buy clothes: size, colour, price"),
          bi("Dinge mit Farben und Adjektiven beschreiben", "describe things with colours and adjectives")
        ],
        grammar: [
          g("es + Wetterverben", "es + weather verbs", "Es regnet. Es schneit. Es ist kalt.", "It's raining. It's snowing. It's cold."),
          g("Adjektive nach sein", "Adjectives after sein", "Das Wetter ist schön. Die Jacke ist zu teuer.", "The weather is lovely. The jacket is too expensive."),
          g("Farben", "Colours", "Das Hemd ist blau. Ich nehme den roten Pullover.", "The shirt is blue. I'll take the red jumper."),
          g("Akkusativ mit Kleidung", "Accusative with clothes", "Ich trage einen Mantel. Sie kauft eine Hose.", "I'm wearing a coat. She's buying trousers.", "akkusativ")
        ],
        links: [
          yt("Nicos Weg A1 Wetter Kleidung", "Nicos Weg A1: Wetter & Kleidung", "Nicos Weg A1: weather & clothes"),
          yt("Easy German weather small talk", "Easy German: über das Wetter reden", "Easy German: weather small talk")
        ]
      }
    ),

    section(
      "a1_s12",
      bi("Schreiben & Sprechen für A1", "Writing & speaking for A1"),
      bi("Formulare, kurze E-Mails, eine Bitte — genau das, was die Prüfung verlangt.", "Forms, short e-mails, a request — exactly what the exam asks for."),
      {
        canDo: [
          bi("ein Formular ausfüllen: Name, Adresse, Geburtsdatum", "fill in a form: name, address, date of birth"),
          bi("eine kurze E-Mail oder Einladung schreiben", "write a short e-mail or invitation"),
          bi("um etwas bitten und auf Bitten reagieren", "ask for something and respond to requests")
        ],
        grammar: [
          g("Anrede & Gruß", "Salutation & sign-off", "Liebe Anna, … Viele Grüße · Sehr geehrte Frau Weber, … Mit freundlichen Grüßen", "Dear Anna, … Best wishes · Dear Ms Weber, … Yours sincerely"),
          g("Höfliche Bitten", "Polite requests", "Können Sie mir helfen? Könnten Sie das bitte wiederholen?", "Can you help me? Could you repeat that, please?", "modal-frame"),
          g("Die Prüfung", "The exam", "Hören · Lesen · Schreiben · Sprechen — je 15–25 Minuten", "Listening · Reading · Writing · Speaking — 15–25 minutes each"),
          g("Sprechen: Teil 1–3", "Speaking: parts 1–3", "sich vorstellen · Fragen zu einem Thema · Bitten formulieren", "introduce yourself · questions on a topic · make requests")
        ],
        links: [
          reading(GOETHE_A1_GOALS, "Goethe A1: so sieht die Prüfung aus", "Goethe A1: what the exam looks like"),
          yt("Goethe Zertifikat A1 Sprechen Prüfung Beispiel", "A1-Prüfung: Sprechen (Beispiel)", "A1 exam: speaking (sample)")
        ]
      }
    )
  ]
};
