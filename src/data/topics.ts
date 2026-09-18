import type { Bilingual, BlankQuestion, TopicItem, UpcomingTopic } from "../types";

/**
 * Seeded from mistakes_tracker.md. Every topic there was first studied on
 * 2026-07-15, so all of them start due. `seedStage` carries over the reviews
 * that were already passed on paper.
 */
const SEEDED: readonly TopicItem[] = [
  {
    id: "t1",
    name: { de: "Perfekt — sein oder haben", en: "Perfect tense — sein or haben" },
    seedStage: 1,
    questions: [
      {
        sentence: "Ich ___ heute früh aufgewacht.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["bin"],
        why: { de: "aufwachen ist ein Zustandswechsel → sein.", en: "aufwachen is a change of state → sein." }
      },
      {
        sentence: "Wir ___ gestern Pizza gegessen.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["haben"],
        why: { de: "essen ist weder Bewegung noch Zustandswechsel → haben.", en: "essen is neither movement nor a change of state → haben." }
      },
      {
        sentence: "Er ___ nach München gefahren.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["ist"],
        why: { de: "fahren ist Bewegung von A nach B → sein.", en: "fahren is movement from A to B → sein." }
      },
      {
        sentence: "Sie ___ zu Hause geblieben.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["ist"],
        why: {
          de: "bleiben nimmt immer sein — die klassische Ausnahme, obwohl sich nichts bewegt.",
          en: "bleiben always takes sein — the classic exception, even though nothing moves."
        }
      }
    ]
  },
  {
    id: "t2",
    name: { de: "Partizip II — trennbare Verben", en: "Past participles — separable verbs" },
    seedStage: 0,
    questions: [
      {
        sentence: "Ich bin um 7 Uhr ___ . (aufstehen)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["aufgestanden"],
        why: { de: "ge- steht zwischen Präfix und Stamm: auf-ge-standen.", en: "ge- sits between prefix and stem: auf-ge-standen." }
      },
      {
        sentence: "Ich habe ihn gestern ___ . (anrufen)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["angerufen"],
        why: { de: "an-ge-rufen.", en: "an-ge-rufen." }
      },
      {
        sentence: "Wir haben im Supermarkt ___ . (einkaufen)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["eingekauft"],
        why: { de: "ein-ge-kauft.", en: "ein-ge-kauft." }
      },
      {
        sentence: "Er hat den ganzen Abend ___ . (fernsehen)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["ferngesehen"],
        why: { de: "fern-ge-sehen.", en: "fern-ge-sehen." }
      }
    ]
  },
  {
    id: "t3",
    name: { de: "aufwachen oder aufstehen", en: "aufwachen vs. aufstehen" },
    seedStage: 0,
    questions: [
      {
        sentence: "Um 6 Uhr öffne ich die Augen, aber ich bleibe im Bett. Ich ___ um 6 Uhr auf.",
        hint: { de: "Verb", en: "verb" }, answers: ["wache"],
        why: { de: "aufwachen = die Augen gehen auf. Du liegst noch.", en: "aufwachen = your eyes open. You are still lying down." }
      },
      {
        sentence: "Um 6:30 verlasse ich das Bett. Ich ___ um 6:30 auf.",
        hint: { de: "Verb", en: "verb" }, answers: ["stehe"],
        why: { de: "aufstehen = raus aus dem Bett.", en: "aufstehen = getting out of bed." }
      },
      {
        sentence: "Ich bin um 7 Uhr ___ . (die Augen geöffnet)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["aufgewacht"],
        why: { de: "aufwachen → aufgewacht, mit sein.", en: "aufwachen → aufgewacht, with sein." }
      },
      {
        sentence: "Danach bin ich ___ . (aus dem Bett)",
        hint: { de: "Partizip II", en: "past participle" }, answers: ["aufgestanden"],
        why: { de: "aufstehen → aufgestanden, mit sein.", en: "aufstehen → aufgestanden, with sein." }
      }
    ]
  },
  {
    id: "t4",
    name: { de: "Wechselpräpositionen", en: "Two-way prepositions" },
    seedStage: 0,
    questions: [
      {
        sentence: "Ich gehe auf ___ Toilette.",
        hint: { de: "<code>die Toilette</code>", en: "<code>die Toilette</code>" }, answers: ["die"],
        why: { de: "„auf die Toilette gehen“ — Bewegung → Akkusativ. Niemals nach!", en: "auf die Toilette gehen — movement → accusative. Never nach!" }
      },
      {
        sentence: "Das Bild hängt an ___ Wand.",
        hint: { de: "<code>die Wand</code>", en: "<code>die Wand</code>" }, answers: ["der"],
        why: { de: "hängen beschreibt einen Ort → Dativ.", en: "hängen describes a location → dative." }
      },
      {
        sentence: "Stell die Flasche auf ___ Tisch.",
        hint: { de: "<code>der Tisch</code>", en: "<code>der Tisch</code>" }, answers: ["den"],
        why: { de: "stellen ist Bewegung (wohin?) → Akkusativ.", en: "stellen is movement (wohin?) → accusative." }
      },
      {
        sentence: "Die Katze schläft unter ___ Bett.",
        hint: { de: "<code>das Bett</code>", en: "<code>das Bett</code>" }, answers: ["dem"],
        why: { de: "schlafen beschreibt einen Ort (wo?) → Dativ.", en: "schlafen describes a location (wo?) → dative." }
      }
    ]
  },
  {
    id: "t5",
    name: { de: "Possessivpronomen", en: "Possessive pronouns" },
    seedStage: 0,
    questions: [
      {
        sentence: "Ich gehe mit ___ Bruder ins Kino.",
        hint: { de: "our — <code>der Bruder</code>", en: "our — <code>der Bruder</code>" }, answers: ["unserem"],
        why: { de: "mit + Dativ, maskulin → unserem.", en: "mit + dative, masculine → unserem." }
      },
      {
        sentence: "Das ist ___ Auto.",
        hint: { de: "your (ihr) — <code>das Auto</code>", en: "your (ihr) — <code>das Auto</code>" }, answers: ["euer"],
        why: { de: "ihr → euer. Kein -es im Nominativ Neutrum.", en: "ihr → euer. No -es in the neuter nominative." }
      },
      {
        sentence: "Wir füttern ___ Hund.",
        hint: { de: "our — <code>der Hund</code>", en: "our — <code>der Hund</code>" }, answers: ["unseren"],
        why: { de: "Akkusativ maskulin → unseren.", en: "Masculine accusative → unseren." }
      },
      {
        sentence: "Sie geht mit ___ Katze zum Tierarzt.",
        hint: { de: "her — <code>die Katze</code>", en: "her — <code>die Katze</code>" }, answers: ["ihrer"],
        why: { de: "mit + Dativ, feminin → ihrer.", en: "mit + dative, feminine → ihrer." }
      }
    ]
  },
  {
    id: "t6",
    name: { de: "Zeitform bleibt konsistent", en: "Keeping the tense consistent" },
    seedStage: 0,
    questions: [
      {
        sentence: "Gestern ___ ich ins Kino gegangen.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["bin"],
        why: { de: "gehen → sein. Gestern heißt Vergangenheit, also Perfekt, nicht Präsens.", en: "gehen → sein. Gestern means the past, so use the perfect, not the present." }
      },
      {
        sentence: "Letzte Woche ___ wir viel gelernt.",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["haben"],
        why: { de: "lernen → haben.", en: "lernen → haben." }
      },
      {
        sentence: "Was ___ du am Wochenende gemacht?",
        hint: { de: "Hilfsverb", en: "auxiliary verb" }, answers: ["hast"],
        why: { de: "machen → haben, 2. Person Singular: hast.", en: "machen → haben, second person singular: hast." }
      }
    ]
  },
  {
    id: "t7",
    name: { de: "Wortstellung nach weil, dass, wenn, ob", en: "Word order after weil, dass, wenn, ob" },
    seedStage: 0,
    questions: [
      {
        sentence: "Ich bleibe zu Hause, weil ich krank ___ . (sein)",
        hint: { de: "Verb ans Ende", en: "verb goes last" }, answers: ["bin"],
        why: { de: "weil schickt das konjugierte Verb ans Satzende.", en: "weil sends the conjugated verb to the end of the clause." }
      },
      {
        sentence: "Er sagt, dass er müde ___ . (sein)",
        hint: { de: "Verb ans Ende", en: "verb goes last" }, answers: ["ist"],
        why: { de: "dass → Verb ganz nach hinten.", en: "dass → verb all the way to the back." }
      },
      {
        sentence: "Wenn ich Zeit ___ , komme ich. (haben)",
        hint: { de: "Verb ans Ende", en: "verb goes last" }, answers: ["habe"],
        why: { de: "wenn → Verb ans Ende des Nebensatzes.", en: "wenn → verb at the end of the subordinate clause." }
      },
      {
        sentence: "Ich weiß nicht, ob er heute ___ . (kommen)",
        hint: { de: "Verb ans Ende", en: "verb goes last" }, answers: ["kommt"],
        why: { de: "ob → Verb ans Ende.", en: "ob → verb at the end." }
      }
    ]
  },
  {
    id: "t8",
    name: { de: "Nomen großschreiben", en: "Capitalising nouns" },
    seedStage: 0,
    questions: [
      {
        sentence: "Schreib richtig: schule",
        hint: { de: "ein Nomen", en: "a noun" }, answers: ["Schule"], caseSensitive: true,
        why: { de: "Alle Nomen im Deutschen beginnen mit einem Großbuchstaben.", en: "Every noun in German starts with a capital letter." }
      },
      {
        sentence: "Schreib richtig: freund",
        hint: { de: "ein Nomen", en: "a noun" }, answers: ["Freund"], caseSensitive: true,
        why: { de: "Nomen werden großgeschrieben.", en: "Nouns are capitalised." }
      },
      {
        sentence: "Schreib richtig: katze",
        hint: { de: "ein Nomen", en: "a noun" }, answers: ["Katze"], caseSensitive: true,
        why: { de: "Nomen werden großgeschrieben.", en: "Nouns are capitalised." }
      },
      {
        sentence: "Schreib richtig: name",
        hint: { de: "ein Nomen", en: "a noun" }, answers: ["Name"], caseSensitive: true,
        why: { de: "Nomen werden großgeschrieben.", en: "Nouns are capitalised." }
      }
    ]
  },
  {
    id: "t9",
    name: { de: "Kaffee — Schreibweise", en: "Spelling Kaffee" },
    seedStage: 0,
    questions: [
      {
        sentence: "Schreib richtig: das Getränk aus Bohnen",
        hint: { de: "Kaf…", en: "Kaf…" }, answers: ["Kaffee", "der Kaffee"], caseSensitive: true,
        why: { de: "Kaf-fee — zwei f, und am Ende -ee, nicht -er.", en: "Kaf-fee — two f's, ending in -ee, not -er." }
      },
      {
        sentence: "Ich trinke jeden Morgen einen ___ .",
        hint: { de: "coffee", en: "coffee" }, answers: ["Kaffee"], caseSensitive: true,
        why: { de: "Merke: Kaf-fee reimt sich auf Tee.", en: "Remember: Kaf-fee rhymes with Tee." }
      }
    ]
  }
];

/** Step 4 of the session plan — what to bring to the next lesson. */
export const UPCOMING: readonly UpcomingTopic[] = [
  {
    title: { de: "Präteritum: war & hatte", en: "Simple past: war & hatte" },
    blurb: { de: "Die Vergangenheit von sein und haben — im Gespräch häufiger als das Perfekt.", en: "The past of sein and haben — more common in speech than the perfect." }
  },
  {
    title: { de: "Dativpronomen im Satz", en: "Dative pronouns in context" },
    blurb: { de: "mir, dir, ihm, ihr, uns, euch, ihnen — sicher und schnell.", en: "mir, dir, ihm, ihr, uns, euch, ihnen — quickly and confidently." }
  },
  {
    title: { de: "Temporale Präpositionen", en: "Time prepositions" },
    blurb: { de: "seit, vor, in, nach — wann nimmt man welche?", en: "seit, vor, in, nach — which one goes where?" }
  },
  {
    title: { de: "Adjektivendungen", en: "Adjective endings" },
    blurb: { de: "der große Hund, ein großer Hund — das System dahinter.", en: "der große Hund, ein großer Hund — the system behind it." }
  },
  {
    title: { de: "Genitiv — Einführung", en: "Genitive — an introduction" },
    blurb: { de: "des Mannes, der Frau — und wie man ihn im Alltag umgeht.", en: "des Mannes, der Frau — and how people avoid it in everyday speech." }
  },
  {
    title: { de: "Nebensätze vertiefen", en: "Subordinate clauses, deeper" },
    blurb: { de: "Mehrere Nebensätze verbinden, ohne die Wortstellung zu verlieren.", en: "Chaining clauses without losing the word order." }
  }
];

/* --------------------------------------------- the rest of the A2 syllabus */

/** Where each seeded topic sits on the A2 map. */
const SECTION_OF_SEEDED: Readonly<Record<string, string>> = {
  t1: "a2_s01",
  t2: "a2_s01",
  t3: "a2_s01",
  t4: "a2_s03",
  t5: "a2_s09",
  t6: "a2_s02",
  t7: "a2_s05",
  t8: "a2_s12",
  t9: "a2_s12"
};

const bi = (de: string, en: string): Bilingual => ({ de, en });

const q = (sentence: string, hint: Bilingual, answers: readonly string[], why: Bilingual): BlankQuestion => ({
  sentence,
  hint,
  answers,
  why
});

const MORE: readonly TopicItem[] = [
  {
    id: "t10",
    section: "a2_s02",
    name: bi("Präteritum: war, hatte, konnte", "Simple past: war, hatte, konnte"),
    seedStage: 0,
    questions: [
      q("Als Kind ___ ich oft im Garten. (sein)", bi("Präteritum", "simple past"), ["war"], bi("ich war.", "ich war.")),
      q("Wir ___ damals kein Auto. (haben)", bi("Präteritum", "simple past"), ["hatten"], bi("wir hatten.", "wir hatten.")),
      q("Sie ___ gestern arbeiten. (müssen)", bi("Präteritum", "simple past"), ["musste"], bi("sie musste — ohne Umlaut.", "sie musste — no umlaut.")),
      q("Ich ___ als Kind nicht schwimmen. (können)", bi("Präteritum", "simple past"), ["konnte"], bi("ich konnte — ohne Umlaut.", "ich konnte — no umlaut."))
    ]
  },
  {
    id: "t11",
    section: "a2_s04",
    name: bi("seit, vor, ab, bis", "seit, vor, ab, bis"),
    seedStage: 0,
    questions: [
      q("Ich lerne ___ zwei Jahren Deutsch. (still going)", bi("temporale Präposition", "time preposition"), ["seit"], bi("Läuft noch → seit + Präsens.", "Still going → seit + present.")),
      q("Ich habe ___ zwei Jahren angefangen. (ago)", bi("temporale Präposition", "time preposition"), ["vor"], bi("Zeitpunkt in der Vergangenheit → vor.", "A point in the past → vor.")),
      q("___ Montag arbeite ich wieder. (from … on)", bi("temporale Präposition", "time preposition"), ["ab"], bi("Ab Montag = von Montag an.", "Ab Montag = from Monday on.")),
      q("Wir bleiben ___ Freitag. (until)", bi("temporale Präposition", "time preposition"), ["bis"], bi("bis Freitag — ohne Artikel.", "bis Freitag — no article."))
    ]
  },
  {
    id: "t12",
    section: "a2_s06",
    name: bi("Reflexive Verben", "Reflexive verbs"),
    seedStage: 0,
    questions: [
      q("Er hat ___ erkältet.", bi("Reflexivpronomen (er)", "reflexive pronoun (er)"), ["sich"], bi("er → sich.", "er → sich.")),
      q("Ich ziehe ___ warm an.", bi("Reflexivpronomen (ich)", "reflexive pronoun (ich)"), ["mich"], bi("ich → mich (Akkusativ).", "ich → mich (accusative).")),
      q("Wir ___ uns auf den Urlaub. (freuen)", bi("Verb", "verb"), ["freuen"], bi("sich freuen auf: wir freuen uns.", "sich freuen auf: wir freuen uns.")),
      q("Zieh ___ die Schuhe an! (du)", bi("Reflexivpronomen (du) — mit Akkusativobjekt", "reflexive pronoun (du) — with an accusative object"), ["dir"], bi("Die Schuhe sind Akkusativ → Reflexivpronomen im Dativ: dir.", "Die Schuhe is accusative → reflexive pronoun goes dative: dir."))
    ]
  },
  {
    id: "t13",
    section: "a2_s07",
    name: bi("Komparativ und Superlativ", "Comparative and superlative"),
    seedStage: 0,
    questions: [
      q("gut – ___ – am besten", bi("Komparativ", "comparative"), ["besser"], bi("Unregelmäßig: gut, besser, am besten.", "Irregular: gut, besser, am besten.")),
      q("Ich bin ___ als mein Bruder. (groß)", bi("Komparativ", "comparative"), ["größer"], bi("Umlaut + -er: größer.", "Umlaut plus -er: größer.")),
      q("viel – mehr – am ___", bi("Superlativ", "superlative"), ["meisten"], bi("viel, mehr, am meisten.", "viel, mehr, am meisten.")),
      q("Sie ist so alt ___ ich.", bi("Vergleich: gleich", "comparison: equal"), ["wie"], bi("so … wie bei Gleichheit; als beim Komparativ.", "so … wie for equality; als with a comparative."))
    ]
  },
  {
    id: "t14",
    section: "a2_s08",
    name: bi("wann, wenn oder ob?", "wann, wenn or ob?"),
    seedStage: 0,
    questions: [
      q("Ich weiß nicht, ___ er kommt. (whether)", bi("Konjunktion", "conjunction"), ["ob"], bi("Ja/Nein-Frage indirekt → ob.", "An indirect yes/no question → ob.")),
      q("___ ich Zeit habe, rufe ich an. (when / if)", bi("Konjunktion", "conjunction"), ["wenn"], bi("Bedingung oder wiederholt → wenn.", "Condition or repeated → wenn.")),
      q("Sag mir, ___ der Film beginnt. (at what time)", bi("Fragewort", "question word"), ["wann"], bi("Nach der Uhrzeit → wann.", "Asking for the time → wann.")),
      q("Ich frage, ___ du Lust hast. (whether)", bi("Konjunktion", "conjunction"), ["ob"], bi("Indirekte Frage ohne Fragewort → ob.", "Indirect question with no question word → ob."))
    ]
  },
  {
    id: "t15",
    section: "a2_s10",
    name: bi("Adjektivendungen nach der und ein", "Adjective endings after der and ein"),
    seedStage: 0,
    questions: [
      q("die ___ Kirche (schön)", bi("nach die", "after die"), ["schöne"], bi("Nominativ nach die: -e.", "Nominative after die: -e.")),
      q("ein ___ Haus (neu)", bi("nach ein — <code>das Haus</code>", "after ein — <code>das Haus</code>"), ["neues"], bi("Nach ein zeigt das Adjektiv das Neutrum: -es.", "After ein the adjective shows the neuter: -es.")),
      q("der ___ Fluss (lang)", bi("nach der", "after der"), ["lange"], bi("Nominativ nach der: -e.", "Nominative after der: -e.")),
      q("eine ___ Straße (breit)", bi("nach eine", "after eine"), ["breite"], bi("Nach eine: -e.", "After eine: -e."))
    ]
  },
  {
    id: "t16",
    section: "a2_s11",
    name: bi("Verben mit Präposition", "Verbs with prepositions"),
    seedStage: 0,
    questions: [
      q("Ich freue mich ___ das Wochenende.", bi("Vorfreude", "looking forward"), ["auf"], bi("sich freuen auf + Akkusativ (Zukunft).", "sich freuen auf + accusative (future).")),
      q("Sie denkt oft ___ ihre Familie.", bi("feste Präposition", "fixed preposition"), ["an"], bi("denken an + Akkusativ.", "denken an + accusative.")),
      q("Er ärgert sich ___ den Stau.", bi("feste Präposition", "fixed preposition"), ["über"], bi("sich ärgern über + Akkusativ.", "sich ärgern über + accusative.")),
      q("Wir sprechen ___ das Problem.", bi("feste Präposition", "fixed preposition"), ["über"], bi("sprechen über + Akkusativ.", "sprechen über + accusative."))
    ]
  }
];

/** Every A2 review topic: the seeded nine, tagged, plus the rest of the syllabus. */
export const TOPICS: readonly TopicItem[] = [
  ...SEEDED.map((topic) => ({ ...topic, section: SECTION_OF_SEEDED[topic.id] })),
  ...MORE
];
