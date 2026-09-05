import type { TopicItem, UpcomingTopic } from "../types";

/**
 * Seeded from mistakes_tracker.md. Every topic there was first studied on
 * 2026-07-15, so all of them start due. `seedStage` carries over the reviews
 * that were already passed on paper.
 */
export const TOPICS: readonly TopicItem[] = [
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
        sentence: "Ich fahre mit ___ Bruder.",
        hint: { de: "our — <code>der Bruder</code>", en: "our — <code>der Bruder</code>" }, answers: ["unserem"],
        why: { de: "mit + Dativ, maskulin → unserem.", en: "mit + dative, masculine → unserem." }
      },
      {
        sentence: "Das ist ___ Auto.",
        hint: { de: "your (ihr) — <code>das Auto</code>", en: "your (ihr) — <code>das Auto</code>" }, answers: ["euer"],
        why: { de: "ihr → euer. Kein -es im Nominativ Neutrum.", en: "ihr → euer. No -es in the neuter nominative." }
      },
      {
        sentence: "Wir lieben ___ Hund.",
        hint: { de: "our — <code>der Hund</code>", en: "our — <code>der Hund</code>" }, answers: ["unseren"],
        why: { de: "Akkusativ maskulin → unseren.", en: "Masculine accusative → unseren." }
      },
      {
        sentence: "Sie spielt mit ___ Katze.",
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
