import type { ParadigmTable, TableExample, Trilingual } from "../types";

/**
 * The paradigms a learner has to know cold — articles, pronouns, adjective
 * endings, and which case a verb or preposition takes. Everything the rest of
 * German grammar is built on.
 *
 * Each table carries a Malayalam gloss beside the English one, and a worked
 * example per row, because a bare grid teaches nobody why `dem` is `dem`.
 */

/** A row label that is itself a German word — the same in every gloss. */
function w(word: string): Trilingual {
  return { de: word, en: word, ml: word };
}

function ex(de: string, en: string, ml: string): TableExample {
  return { de, en, ml };
}

/* ------------------------------------------------------- shared vocabulary */

const GENDER_COLUMNS: readonly Trilingual[] = [
  { de: "maskulin", en: "masculine", ml: "പുല്ലിംഗം" },
  { de: "feminin", en: "feminine", ml: "സ്ത്രീലിംഗം" },
  { de: "neutrum", en: "neuter", ml: "നപുംസകലിംഗം" },
  { de: "Plural", en: "plural", ml: "ബഹുവചനം" }
];

const GENDER_COLUMNS_SG: readonly Trilingual[] = GENDER_COLUMNS.slice(0, 3);

const NOMINATIV: Trilingual = {
  de: "Nominativ — wer? was?",
  en: "Nominative — who? what? (the subject)",
  ml: "നോമിനേറ്റീവ് — ആര്? എന്ത്? (കർത്താവ്)"
};

const AKKUSATIV: Trilingual = {
  de: "Akkusativ — wen? was?",
  en: "Accusative — whom? what? (the direct object)",
  ml: "അക്കുസാറ്റീവ് — ആരെ? എന്തിനെ? (കർമ്മം)"
};

const DATIV: Trilingual = {
  de: "Dativ — wem?",
  en: "Dative — to whom? (the indirect object)",
  ml: "ഡേറ്റീവ് — ആർക്ക്? (ആർക്കുവേണ്ടി)"
};

const GENITIV: Trilingual = {
  de: "Genitiv — wessen?",
  en: "Genitive — whose? (possession)",
  ml: "ജെനിറ്റീവ് — ആരുടെ? (ഉടമസ്ഥത)"
};

const CASE_ROWS = [NOMINATIV, AKKUSATIV, DATIV, GENITIV] as const;

/* ------------------------------------------------------------- 1. der/die/das */

const DEFINITE_ARTICLE: ParadigmTable = {
  id: "tbl-artikel-bestimmt",
  name: {
    de: "Bestimmter Artikel — der, die, das",
    en: "Definite article — the",
    ml: "നിശ്ചിത ആർട്ടിക്കിൾ — der, die, das (the)"
  },
  blurb: {
    de: "Ein englisches „the“ wird im Deutschen zu sechs Formen. Diese Tabelle ist die Grundlage für alles Weitere.",
    en: "One English \"the\" becomes six German forms. Every other ending in the language leans on this grid.",
    ml: "ഇംഗ്ലീഷിലെ ഒരൊറ്റ 'the' ജർമ്മനിൽ ആറു രൂപങ്ങളായി മാറുന്നു. ഈ പട്ടിക മനഃപാഠമായാൽ ബാക്കി വ്യാകരണം വളരെ എളുപ്പമാകും."
  },
  columns: GENDER_COLUMNS,
  rows: [
    {
      label: NOMINATIV,
      cells: [["der"], ["die"], ["das"], ["die"]],
      example: ex(
        "Der Hund schläft.",
        "The dog is sleeping. — who is sleeping? der Hund, so nominative.",
        "നായ ഉറങ്ങുന്നു. — ആര് ഉറങ്ങുന്നു? der Hund, അതുകൊണ്ട് നോമിനേറ്റീവ്."
      )
    },
    {
      label: AKKUSATIV,
      cells: [["den"], ["die"], ["das"], ["die"]],
      example: ex(
        "Ich sehe den Hund.",
        "I see the dog. — whom do I see? den Hund, so accusative. Only masculine changes.",
        "ഞാൻ നായയെ കാണുന്നു. — ആരെ കാണുന്നു? den Hund, അതുകൊണ്ട് അക്കുസാറ്റീവ്. പുല്ലിംഗം മാത്രമേ മാറുന്നുള്ളൂ."
      )
    },
    {
      label: DATIV,
      cells: [["dem"], ["der"], ["dem"], ["den"]],
      example: ex(
        "Ich gebe dem Hund Wasser.",
        "I give the dog water. — to whom? dem Hund, so dative.",
        "ഞാൻ നായയ്ക്ക് വെള്ളം കൊടുക്കുന്നു. — ആർക്ക്? dem Hund, അതുകൊണ്ട് ഡേറ്റീവ്."
      )
    },
    {
      label: GENITIV,
      cells: [["des"], ["der"], ["des"], ["der"]],
      example: ex(
        "Das ist das Futter des Hundes.",
        "That is the dog's food. — whose food? des Hundes, so genitive.",
        "അത് നായയുടെ ഭക്ഷണമാണ്. — ആരുടെ ഭക്ഷണം? des Hundes, അതുകൊണ്ട് ജെനിറ്റീവ്."
      )
    }
  ],
  example: ex(
    "Der Mann gibt der Frau das Buch des Kindes.",
    "The man gives the woman the child's book — all four cases in one sentence.",
    "പുരുഷൻ സ്ത്രീക്ക് കുട്ടിയുടെ പുസ്തകം കൊടുക്കുന്നു — ഒരൊറ്റ വാക്യത്തിൽ നാലു കാരകങ്ങളും."
  )
};

/* --------------------------------------------------------- 2. ein/eine */

const INDEFINITE_ARTICLE: ParadigmTable = {
  id: "tbl-artikel-unbestimmt",
  name: {
    de: "Unbestimmter Artikel — ein, eine",
    en: "Indefinite article — a, an",
    ml: "അനിശ്ചിത ആർട്ടിക്കിൾ — ein, eine (a/an)"
  },
  blurb: {
    de: "Im Plural gibt es keinen unbestimmten Artikel — „Ich sehe Hunde“, nicht „ein Hunde“.",
    en: "There is no plural indefinite article — you simply drop it: \"Ich sehe Hunde.\"",
    ml: "ബഹുവചനത്തിൽ അനിശ്ചിത ആർട്ടിക്കിൾ ഇല്ല — അത് ഒഴിവാക്കുകയാണ് ചെയ്യുന്നത്: \"Ich sehe Hunde.\""
  },
  columns: GENDER_COLUMNS_SG,
  rows: [
    {
      label: NOMINATIV,
      cells: [["ein"], ["eine"], ["ein"]],
      example: ex(
        "Ein Hund schläft.",
        "A dog is sleeping.",
        "ഒരു നായ ഉറങ്ങുന്നു."
      )
    },
    {
      label: AKKUSATIV,
      cells: [["einen"], ["eine"], ["ein"]],
      example: ex(
        "Ich habe einen Hund.",
        "I have a dog. — the -en on einen is the single most common A1 mistake.",
        "എനിക്ക് ഒരു നായ ഉണ്ട്. — einen എന്നതിലെ -en ആണ് A1-ൽ ഏറ്റവും കൂടുതൽ ആളുകൾ തെറ്റിക്കുന്നത്."
      )
    },
    {
      label: DATIV,
      cells: [["einem"], ["einer"], ["einem"]],
      example: ex(
        "Ich helfe einem Kind.",
        "I help a child.",
        "ഞാൻ ഒരു കുട്ടിയെ സഹായിക്കുന്നു."
      )
    },
    {
      label: GENITIV,
      cells: [["eines"], ["einer"], ["eines"]],
      example: ex(
        "Das Auto eines Freundes.",
        "A friend's car.",
        "ഒരു സുഹൃത്തിന്റെ കാർ."
      )
    }
  ],
  example: ex(
    "Ein Mann kauft einer Frau eine Blume.",
    "A man buys a woman a flower.",
    "ഒരു പുരുഷൻ ഒരു സ്ത്രീക്ക് ഒരു പൂവ് വാങ്ങുന്നു."
  )
};

/* --------------------------------------------------------- 3. kein/keine */

const NEGATIVE_ARTICLE: ParadigmTable = {
  id: "tbl-artikel-negativ",
  name: {
    de: "Negativartikel — kein, keine",
    en: "Negative article — no, not a",
    ml: "നിഷേധ ആർട്ടിക്കിൾ — kein, keine (ഒന്നുമില്ല)"
  },
  blurb: {
    de: "kein folgt genau den Endungen von ein — nur gibt es hier auch einen Plural.",
    en: "kein takes exactly the endings of ein, and unlike ein it does have a plural.",
    ml: "kein-ന് ein-ന്റെ അതേ എൻഡിംഗുകളാണ്. പക്ഷേ ein-ൽ നിന്ന് വ്യത്യസ്തമായി ഇതിന് ബഹുവചനവുമുണ്ട്."
  },
  columns: GENDER_COLUMNS,
  rows: [
    {
      label: NOMINATIV,
      cells: [["kein"], ["keine"], ["kein"], ["keine"]],
      example: ex(
        "Kein Bus kommt heute.",
        "No bus is coming today.",
        "ഇന്ന് ഒരു ബസ്സും വരുന്നില്ല."
      )
    },
    {
      label: AKKUSATIV,
      cells: [["keinen"], ["keine"], ["kein"], ["keine"]],
      example: ex(
        "Ich habe keinen Hunger.",
        "I am not hungry. — literally: I have no hunger.",
        "എനിക്ക് വിശപ്പില്ല. — അക്ഷരാർത്ഥത്തിൽ: എനിക്ക് വിശപ്പ് ഇല്ല."
      )
    },
    {
      label: DATIV,
      cells: [["keinem"], ["keiner"], ["keinem"], ["keinen"]],
      example: ex(
        "Ich glaube keinem Politiker.",
        "I believe no politician.",
        "ഞാൻ ഒരു രാഷ്ട്രീയക്കാരനെയും വിശ്വസിക്കുന്നില്ല."
      )
    },
    {
      label: GENITIV,
      cells: [["keines"], ["keiner"], ["keines"], ["keiner"]],
      example: ex(
        "Der Hut keines Mannes passt mir.",
        "No man's hat fits me.",
        "ഒരു പുരുഷന്റെയും തൊപ്പി എനിക്ക് പാകമാകുന്നില്ല."
      )
    }
  ],
  example: ex(
    "Ich habe keine Zeit und kein Geld.",
    "I have no time and no money.",
    "എനിക്ക് സമയവുമില്ല പണവുമില്ല."
  )
};

/* ------------------------------------------------------- 4. Personalpronomen */

const PERSONAL_PRONOUNS: ParadigmTable = {
  id: "tbl-personalpronomen",
  name: {
    de: "Personalpronomen",
    en: "Personal pronouns — I, you, he, she…",
    ml: "വ്യക്തിസർവ്വനാമങ്ങൾ — ഞാൻ, നീ, അവൻ, അവൾ…"
  },
  blurb: {
    de: "Ohne diese neun Zeilen lässt sich kein einziger Satz bilden. mir/mich zu verwechseln ist der Klassiker.",
    en: "Nine rows you cannot build a single sentence without. Mixing up mir and mich is the classic slip.",
    ml: "ഈ ഒൻപത് വരികൾ ഇല്ലാതെ ഒരു വാക്യം പോലും ഉണ്ടാക്കാനാവില്ല. mir-ഉം mich-ഉം മാറിപ്പോകുന്നതാണ് ഏറ്റവും സാധാരണ തെറ്റ്."
  },
  columns: [
    { de: "Nominativ", en: "nominative (subject)", ml: "നോമിനേറ്റീവ് (കർത്താവ്)" },
    { de: "Akkusativ", en: "accusative (direct object)", ml: "അക്കുസാറ്റീവ് (കർമ്മം)" },
    { de: "Dativ", en: "dative (indirect object)", ml: "ഡേറ്റീവ് (ആർക്ക്)" }
  ],
  rows: [
    {
      label: { de: "1. Person Singular — ich", en: "I", ml: "ഞാൻ" },
      cells: [["ich"], ["mich"], ["mir"]],
      example: ex(
        "Er sieht mich und gibt mir das Buch.",
        "He sees me (accusative) and gives me (dative) the book.",
        "അവൻ എന്നെ കാണുന്നു (mich), എനിക്ക് പുസ്തകം തരുന്നു (mir)."
      )
    },
    {
      label: { de: "2. Person Singular — du", en: "you (informal singular)", ml: "നീ" },
      cells: [["du"], ["dich"], ["dir"]],
      example: ex(
        "Ich liebe dich und danke dir.",
        "I love you (accusative) and thank you (dative).",
        "ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു (dich), നിനക്ക് നന്ദി പറയുന്നു (dir)."
      )
    },
    {
      label: { de: "3. Person Singular — er", en: "he", ml: "അവൻ" },
      cells: [["er"], ["ihn"], ["ihm"]],
      example: ex(
        "Ich kenne ihn und helfe ihm.",
        "I know him (accusative) and help him (dative).",
        "എനിക്ക് അവനെ അറിയാം (ihn), ഞാൻ അവനെ സഹായിക്കുന്നു (ihm)."
      )
    },
    {
      label: { de: "3. Person Singular — sie", en: "she", ml: "അവൾ" },
      cells: [["sie"], ["sie"], ["ihr"]],
      example: ex(
        "Ich sehe sie und gebe ihr das Geld.",
        "I see her and give her the money.",
        "ഞാൻ അവളെ കാണുന്നു, അവൾക്ക് പണം കൊടുക്കുന്നു."
      )
    },
    {
      label: { de: "3. Person Singular — es", en: "it", ml: "അത്" },
      cells: [["es"], ["es"], ["ihm"]],
      example: ex(
        "Das Kind weint — ich gebe ihm Milch.",
        "The child is crying — I give it milk.",
        "കുട്ടി കരയുന്നു — ഞാൻ അതിന് പാൽ കൊടുക്കുന്നു."
      )
    },
    {
      label: { de: "1. Person Plural — wir", en: "we", ml: "ഞങ്ങൾ / നമ്മൾ" },
      cells: [["wir"], ["uns"], ["uns"]],
      example: ex(
        "Sie besucht uns und hilft uns.",
        "She visits us and helps us — one form for both cases.",
        "അവൾ ഞങ്ങളെ സന്ദർശിക്കുന്നു, ഞങ്ങളെ സഹായിക്കുന്നു — രണ്ടു കാരകത്തിനും ഒരേ രൂപം."
      )
    },
    {
      label: { de: "2. Person Plural — ihr", en: "you (informal plural)", ml: "നിങ്ങൾ" },
      cells: [["ihr"], ["euch"], ["euch"]],
      example: ex(
        "Ich sehe euch und danke euch.",
        "I see you all and thank you all.",
        "ഞാൻ നിങ്ങളെ കാണുന്നു, നിങ്ങൾക്ക് നന്ദി പറയുന്നു."
      )
    },
    {
      label: { de: "3. Person Plural — sie", en: "they", ml: "അവർ" },
      cells: [["sie"], ["sie"], ["ihnen"]],
      example: ex(
        "Ich frage sie und antworte ihnen.",
        "I ask them and answer them.",
        "ഞാൻ അവരോട് ചോദിക്കുന്നു, അവർക്ക് ഉത്തരം നൽകുന്നു."
      )
    },
    {
      label: { de: "Höflichkeitsform — Sie", en: "you (formal, always capitalised)", ml: "താങ്കൾ (ബഹുമാനരൂപം, എപ്പോഴും വലിയക്ഷരം)" },
      cells: [["Sie"], ["Sie"], ["Ihnen"]],
      example: ex(
        "Ich danke Ihnen.",
        "Thank you (formal). — the capital letter is what marks it as polite.",
        "താങ്കൾക്ക് നന്ദി. — വലിയക്ഷരമാണ് ഇതിനെ ബഹുമാനരൂപമാക്കുന്നത്."
      )
    }
  ],
  example: ex(
    "Du gibst mir das Buch, und ich gebe es dir zurück.",
    "You give me the book, and I give it back to you.",
    "നീ എനിക്ക് പുസ്തകം തരുന്നു, ഞാൻ അത് നിനക്ക് തിരികെ തരുന്നു."
  )
};

/* -------------------------------------------------- 5. Possessiv — Grundform */

const POSSESSIVE_BASE: ParadigmTable = {
  id: "tbl-possessiv-grund",
  name: {
    de: "Possessivartikel — Grundformen",
    en: "Possessives — my, your, his…",
    ml: "ഉടമസ്ഥതാ സർവ്വനാമങ്ങൾ — എന്റെ, നിന്റെ, അവന്റെ…"
  },
  blurb: {
    de: "Erst die Grundform lernen, dann die Endungen von ein daranhängen.",
    en: "Learn the stem first; the endings are simply those of ein bolted on afterwards.",
    ml: "ആദ്യം അടിസ്ഥാന രൂപം പഠിക്കുക; അതിനുശേഷം ein-ന്റെ എൻഡിംഗുകൾ ചേർത്താൽ മതി."
  },
  columns: [{ de: "Possessivartikel", en: "possessive", ml: "ഉടമസ്ഥതാ രൂപം" }],
  rows: [
    { label: { de: "ich", en: "I → my", ml: "ഞാൻ → എന്റെ" }, cells: [["mein"]], example: ex("Das ist mein Bruder.", "That is my brother.", "അത് എന്റെ സഹോദരനാണ്.") },
    { label: { de: "du", en: "you → your", ml: "നീ → നിന്റെ" }, cells: [["dein"]], example: ex("Wo ist dein Auto?", "Where is your car?", "നിന്റെ കാർ എവിടെ?") },
    { label: { de: "er", en: "he → his", ml: "അവൻ → അവന്റെ" }, cells: [["sein"]], example: ex("Sein Vater arbeitet hier.", "His father works here.", "അവന്റെ അച്ഛൻ ഇവിടെ ജോലി ചെയ്യുന്നു.") },
    { label: { de: "sie (Singular)", en: "she → her", ml: "അവൾ → അവളുടെ" }, cells: [["ihr"]], example: ex("Ihr Mann heißt Tom.", "Her husband is called Tom.", "അവളുടെ ഭർത്താവിന്റെ പേര് ടോം.") },
    { label: { de: "es", en: "it → its", ml: "അത് → അതിന്റെ" }, cells: [["sein"]], example: ex("Das Kind und sein Spielzeug.", "The child and its toy.", "കുട്ടിയും അതിന്റെ കളിപ്പാട്ടവും.") },
    { label: { de: "wir", en: "we → our", ml: "ഞങ്ങൾ → ഞങ്ങളുടെ" }, cells: [["unser"]], example: ex("Unser Haus ist klein.", "Our house is small.", "ഞങ്ങളുടെ വീട് ചെറുതാണ്.") },
    { label: { de: "ihr", en: "you (plural) → your", ml: "നിങ്ങൾ → നിങ്ങളുടെ" }, cells: [["euer"]], example: ex("Ist das euer Hund?", "Is that your dog?", "അത് നിങ്ങളുടെ നായയാണോ?") },
    { label: { de: "sie (Plural)", en: "they → their", ml: "അവർ → അവരുടെ" }, cells: [["ihr"]], example: ex("Ihre Kinder spielen draußen.", "Their children are playing outside.", "അവരുടെ കുട്ടികൾ പുറത്ത് കളിക്കുന്നു.") },
    { label: { de: "Sie (höflich)", en: "you (formal) → your", ml: "താങ്കൾ → താങ്കളുടെ" }, cells: [["Ihr"]], example: ex("Ist das Ihr Platz?", "Is this your seat? — capital I, formal.", "ഇത് താങ്കളുടെ സീറ്റാണോ? — വലിയ I, ബഹുമാനരൂപം.") }
  ],
  example: ex(
    "Mein Bruder und seine Frau besuchen unsere Eltern.",
    "My brother and his wife are visiting our parents.",
    "എന്റെ സഹോദരനും അവന്റെ ഭാര്യയും ഞങ്ങളുടെ മാതാപിതാക്കളെ സന്ദർശിക്കുന്നു."
  )
};

/* ------------------------------------------------- 6. Possessiv — Endungen */

const POSSESSIVE_ENDINGS: ParadigmTable = {
  id: "tbl-possessiv-endungen",
  name: {
    de: "Possessivartikel — Endungen (mein)",
    en: "Possessive endings — mein declined",
    ml: "ഉടമസ്ഥതാ രൂപങ്ങളുടെ എൻഡിംഗുകൾ — mein-ന്റെ രൂപഭേദങ്ങൾ"
  },
  blurb: {
    de: "Genau die Endungen von kein. Was hier gilt, gilt auch für dein, sein, ihr, unser, euer und Ihr.",
    en: "Exactly the endings of kein. Whatever holds here holds for dein, sein, ihr, unser, euer and Ihr.",
    ml: "kein-ന്റെ അതേ എൻഡിംഗുകൾ. ഇവിടെ ശരിയായത് dein, sein, ihr, unser, euer, Ihr എന്നിവയ്ക്കും ബാധകമാണ്."
  },
  columns: GENDER_COLUMNS,
  rows: [
    { label: NOMINATIV, cells: [["mein"], ["meine"], ["mein"], ["meine"]], example: ex("Mein Bruder kommt.", "My brother is coming.", "എന്റെ സഹോദരൻ വരുന്നു.") },
    { label: AKKUSATIV, cells: [["meinen"], ["meine"], ["mein"], ["meine"]], example: ex("Ich rufe meinen Bruder an.", "I am calling my brother.", "ഞാൻ എന്റെ സഹോദരനെ വിളിക്കുന്നു.") },
    { label: DATIV, cells: [["meinem"], ["meiner"], ["meinem"], ["meinen"]], example: ex("Ich helfe meiner Mutter.", "I help my mother.", "ഞാൻ എന്റെ അമ്മയെ സഹായിക്കുന്നു.") },
    { label: GENITIV, cells: [["meines"], ["meiner"], ["meines"], ["meiner"]], example: ex("Das Auto meines Vaters.", "My father's car.", "എന്റെ അച്ഛന്റെ കാർ.") }
  ],
  example: ex(
    "Ich gebe meinem Bruder meinen Schlüssel.",
    "I give my brother my key — dative then accusative.",
    "ഞാൻ എന്റെ സഹോദരന് എന്റെ താക്കോൽ കൊടുക്കുന്നു — ആദ്യം ഡേറ്റീവ്, പിന്നെ അക്കുസാറ്റീവ്."
  )
};

/* ---------------------------------------------------- 7. Fragewörter je Fall */

const CASE_QUESTIONS: ParadigmTable = {
  id: "tbl-fragewoerter-fall",
  name: {
    de: "Fragewörter der vier Fälle",
    en: "The question word for each case",
    ml: "ഓരോ കാരകത്തിനുമുള്ള ചോദ്യപദം"
  },
  blurb: {
    de: "Der schnellste Weg, den Fall zu bestimmen: frage den Satz ab.",
    en: "The fastest way to work out a case is to question the sentence. Learn these four and you can test any noun.",
    ml: "കാരകം കണ്ടെത്താനുള്ള ഏറ്റവും വേഗമേറിയ വഴി വാക്യത്തോട് ചോദ്യം ചോദിക്കുകയാണ്. ഈ നാലെണ്ണം പഠിച്ചാൽ ഏത് നാമവും പരിശോധിക്കാം."
  },
  columns: [{ de: "Fall", en: "case", ml: "കാരകം" }],
  rows: [
    { label: w("wer?"), cells: [["Nominativ"]], example: ex("Wer kommt? — Der Mann kommt.", "Who is coming? — The man. So der Mann is nominative.", "ആര് വരുന്നു? — പുരുഷൻ. അതുകൊണ്ട് der Mann നോമിനേറ്റീവ്.") },
    { label: w("wen?"), cells: [["Akkusativ"]], example: ex("Wen siehst du? — Den Mann.", "Whom do you see? — The man. So den Mann is accusative.", "നീ ആരെ കാണുന്നു? — പുരുഷനെ. അതുകൊണ്ട് den Mann അക്കുസാറ്റീവ്.") },
    { label: w("wem?"), cells: [["Dativ"]], example: ex("Wem hilfst du? — Dem Mann.", "Whom are you helping? — The man. So dem Mann is dative.", "നീ ആരെ സഹായിക്കുന്നു? — പുരുഷനെ. അതുകൊണ്ട് dem Mann ഡേറ്റീവ്.") },
    { label: w("wessen?"), cells: [["Genitiv"]], example: ex("Wessen Auto ist das? — Des Mannes.", "Whose car is that? — The man's. So des Mannes is genitive.", "അത് ആരുടെ കാറാണ്? — പുരുഷന്റെ. അതുകൊണ്ട് des Mannes ജെനിറ്റീവ്.") }
  ],
  example: ex(
    "Wer gibt wem was? — Die Mutter gibt dem Kind einen Apfel.",
    "Who gives whom what? — The mother gives the child an apple.",
    "ആര് ആർക്ക് എന്ത് കൊടുക്കുന്നു? — അമ്മ കുട്ടിക്ക് ഒരു ആപ്പിൾ കൊടുക്കുന്നു."
  )
};

/* ------------------------------------------------------- 8. Verben und Fall */

const VERB_CASE: ParadigmTable = {
  id: "tbl-verben-fall",
  name: {
    de: "Verben und ihr Fall",
    en: "Which case does the verb take?",
    ml: "ഏത് ക്രിയ ഏത് കാരകം എടുക്കുന്നു?"
  },
  blurb: {
    de: "Die meisten Verben nehmen den Akkusativ. Die Dativverben sind eine kurze Liste — die lernt man auswendig.",
    en: "Most verbs take the accusative. The dative verbs are a short list, and that list is worth memorising outright.",
    ml: "മിക്ക ക്രിയകളും അക്കുസാറ്റീവ് എടുക്കുന്നു. ഡേറ്റീവ് എടുക്കുന്ന ക്രിയകൾ ചെറിയ പട്ടികയാണ് — അത് മനഃപാഠമാക്കുന്നതാണ് നല്ലത്."
  },
  columns: [{ de: "Fall", en: "case", ml: "കാരകം" }],
  rows: [
    { label: w("sein"), cells: [["Nominativ"]], example: ex("Er ist ein guter Lehrer.", "He is a good teacher — sein links two nominatives.", "അവൻ ഒരു നല്ല അധ്യാപകനാണ് — sein രണ്ട് നോമിനേറ്റീവുകളെ ബന്ധിപ്പിക്കുന്നു.") },
    { label: w("werden"), cells: [["Nominativ"]], example: ex("Sie wird Ärztin.", "She is becoming a doctor.", "അവൾ ഡോക്ടറാകുന്നു.") },
    { label: w("bleiben"), cells: [["Nominativ"]], example: ex("Er bleibt mein Freund.", "He remains my friend.", "അവൻ എന്റെ സുഹൃത്തായി തുടരുന്നു.") },
    { label: w("heißen"), cells: [["Nominativ"]], example: ex("Das heißt ein Problem.", "That is called a problem.", "അതിനെ ഒരു പ്രശ്നം എന്ന് വിളിക്കുന്നു.") },
    { label: w("sehen"), cells: [["Akkusativ"]], example: ex("Ich sehe den Film.", "I see the film.", "ഞാൻ സിനിമ കാണുന്നു.") },
    { label: w("kaufen"), cells: [["Akkusativ"]], example: ex("Wir kaufen einen Tisch.", "We are buying a table.", "ഞങ്ങൾ ഒരു മേശ വാങ്ങുന്നു.") },
    { label: w("brauchen"), cells: [["Akkusativ"]], example: ex("Ich brauche einen Stift.", "I need a pen.", "എനിക്ക് ഒരു പേന വേണം.") },
    { label: w("besuchen"), cells: [["Akkusativ"]], example: ex("Sie besucht ihren Onkel.", "She visits her uncle.", "അവൾ അവളുടെ അമ്മാവനെ സന്ദർശിക്കുന്നു.") },
    { label: w("fragen"), cells: [["Akkusativ"]], example: ex("Ich frage den Lehrer.", "I ask the teacher — accusative, unlike English \"ask to\".", "ഞാൻ അധ്യാപകനോട് ചോദിക്കുന്നു — ഇത് അക്കുസാറ്റീവ് ആണ്.") },
    { label: w("verstehen"), cells: [["Akkusativ"]], example: ex("Verstehst du die Frage?", "Do you understand the question?", "നിനക്ക് ചോദ്യം മനസ്സിലായോ?") },
    { label: w("lieben"), cells: [["Akkusativ"]], example: ex("Ich liebe meine Familie.", "I love my family.", "ഞാൻ എന്റെ കുടുംബത്തെ സ്നേഹിക്കുന്നു.") },
    { label: w("treffen"), cells: [["Akkusativ"]], example: ex("Wir treffen unsere Freunde.", "We are meeting our friends.", "ഞങ്ങൾ ഞങ്ങളുടെ സുഹൃത്തുക്കളെ കാണുന്നു.") },
    { label: w("helfen"), cells: [["Dativ"]], example: ex("Ich helfe dem Mann.", "I help the man — dative, though English uses a direct object.", "ഞാൻ പുരുഷനെ സഹായിക്കുന്നു — ഇംഗ്ലീഷിൽ കർമ്മമാണെങ്കിലും ജർമ്മനിൽ ഡേറ്റീവ്.") },
    { label: w("danken"), cells: [["Dativ"]], example: ex("Ich danke dir.", "I thank you.", "ഞാൻ നിനക്ക് നന്ദി പറയുന്നു.") },
    { label: w("gefallen"), cells: [["Dativ"]], example: ex("Das Buch gefällt mir.", "I like the book — literally: the book pleases me.", "എനിക്ക് പുസ്തകം ഇഷ്ടമാണ് — അക്ഷരാർത്ഥത്തിൽ: പുസ്തകം എനിക്ക് ഇഷ്ടം നൽകുന്നു.") },
    { label: w("gehören"), cells: [["Dativ"]], example: ex("Das Auto gehört meinem Vater.", "The car belongs to my father.", "കാർ എന്റെ അച്ഛന്റേതാണ്.") },
    { label: w("antworten"), cells: [["Dativ"]], example: ex("Ich antworte dem Chef.", "I answer the boss.", "ഞാൻ മേലധികാരിക്ക് ഉത്തരം നൽകുന്നു.") },
    { label: w("folgen"), cells: [["Dativ"]], example: ex("Der Hund folgt dem Kind.", "The dog follows the child.", "നായ കുട്ടിയെ പിന്തുടരുന്നു.") },
    { label: w("glauben"), cells: [["Dativ"]], example: ex("Ich glaube dir nicht.", "I don't believe you.", "ഞാൻ നിന്നെ വിശ്വസിക്കുന്നില്ല.") },
    { label: w("passen"), cells: [["Dativ"]], example: ex("Die Hose passt mir nicht.", "The trousers don't fit me.", "പാന്റ്സ് എനിക്ക് പാകമല്ല.") },
    { label: w("schmecken"), cells: [["Dativ"]], example: ex("Das Essen schmeckt uns.", "We like the food — it tastes good to us.", "ഞങ്ങൾക്ക് ഭക്ഷണം ഇഷ്ടപ്പെടുന്നു.") },
    { label: w("gratulieren"), cells: [["Dativ"]], example: ex("Wir gratulieren dem Sieger.", "We congratulate the winner.", "ഞങ്ങൾ വിജയിയെ അഭിനന്ദിക്കുന്നു.") }
  ],
  example: ex(
    "Ich helfe dem Kind und frage den Lehrer.",
    "I help the child (dative) and ask the teacher (accusative) — same English shape, different German cases.",
    "ഞാൻ കുട്ടിയെ സഹായിക്കുന്നു (ഡേറ്റീവ്), അധ്യാപകനോട് ചോദിക്കുന്നു (അക്കുസാറ്റീവ്) — ഇംഗ്ലീഷിൽ ഒരുപോലെ, ജർമ്മനിൽ വ്യത്യസ്തം."
  )
};

/* ------------------------------------------------- 9. Präpositionen und Fall */

const WECHSEL = ["Wechsel", "Wechselpräposition", "Akkusativ oder Dativ", "Akkusativ/Dativ", "Akk/Dat", "A/D"];

const PREPOSITION_CASE: ParadigmTable = {
  id: "tbl-praepositionen-fall",
  name: {
    de: "Präpositionen und ihr Fall",
    en: "Which case does the preposition take?",
    ml: "ഏത് പ്രീപൊസിഷൻ ഏത് കാരകം എടുക്കുന്നു?"
  },
  blurb: {
    de: "Jede Präposition regiert einen festen Fall — außer den neun Wechselpräpositionen: wohin? → Akkusativ, wo? → Dativ.",
    en: "Each preposition governs a fixed case, except the nine two-way ones: movement (wohin?) takes the accusative, position (wo?) the dative.",
    ml: "ഓരോ പ്രീപൊസിഷനും ഒരു നിശ്ചിത കാരകം എടുക്കുന്നു. ഒൻപത് 'Wechsel' പ്രീപൊസിഷനുകൾ ഒഴികെ: ചലനം (wohin?) → അക്കുസാറ്റീവ്, സ്ഥാനം (wo?) → ഡേറ്റീവ്."
  },
  columns: [{ de: "Fall", en: "case", ml: "കാരകം" }],
  rows: [
    { label: w("durch"), cells: [["Akkusativ"]], example: ex("Wir gehen durch den Park.", "We walk through the park.", "ഞങ്ങൾ പാർക്കിലൂടെ നടക്കുന്നു.") },
    { label: w("für"), cells: [["Akkusativ"]], example: ex("Das ist für dich.", "That is for you.", "അത് നിനക്കുള്ളതാണ്.") },
    { label: w("gegen"), cells: [["Akkusativ"]], example: ex("Ich bin gegen den Plan.", "I am against the plan.", "ഞാൻ ആ പദ്ധതിക്ക് എതിരാണ്.") },
    { label: w("ohne"), cells: [["Akkusativ"]], example: ex("Ohne meinen Schlüssel gehe ich nicht.", "I'm not going without my key.", "എന്റെ താക്കോൽ ഇല്ലാതെ ഞാൻ പോകില്ല.") },
    { label: w("um"), cells: [["Akkusativ"]], example: ex("Wir sitzen um den Tisch.", "We sit around the table.", "ഞങ്ങൾ മേശയ്ക്ക് ചുറ്റും ഇരിക്കുന്നു.") },
    { label: w("bis"), cells: [["Akkusativ"]], example: ex("Bis nächsten Montag!", "Until next Monday!", "അടുത്ത തിങ്കളാഴ്ച വരെ!") },
    { label: w("aus"), cells: [["Dativ"]], example: ex("Ich komme aus Indien.", "I come from India.", "ഞാൻ ഇന്ത്യയിൽ നിന്നാണ്.") },
    { label: w("bei"), cells: [["Dativ"]], example: ex("Ich wohne bei meiner Tante.", "I live at my aunt's.", "ഞാൻ എന്റെ ആന്റിയുടെ അടുത്ത് താമസിക്കുന്നു.") },
    { label: w("mit"), cells: [["Dativ"]], example: ex("Ich fahre mit dem Bus.", "I travel by bus.", "ഞാൻ ബസ്സിൽ പോകുന്നു.") },
    { label: w("nach"), cells: [["Dativ"]], example: ex("Nach der Arbeit gehe ich heim.", "After work I go home.", "ജോലി കഴിഞ്ഞ് ഞാൻ വീട്ടിൽ പോകുന്നു.") },
    { label: w("seit"), cells: [["Dativ"]], example: ex("Seit einem Jahr lerne ich Deutsch.", "I've been learning German for a year.", "ഒരു വർഷമായി ഞാൻ ജർമ്മൻ പഠിക്കുന്നു.") },
    { label: w("von"), cells: [["Dativ"]], example: ex("Das ist ein Geschenk von meiner Mutter.", "That is a present from my mother.", "അത് എന്റെ അമ്മയിൽ നിന്നുള്ള സമ്മാനമാണ്.") },
    { label: w("zu"), cells: [["Dativ"]], example: ex("Ich gehe zum Arzt.", "I'm going to the doctor. — zu dem contracts to zum.", "ഞാൻ ഡോക്ടറുടെ അടുത്തേക്ക് പോകുന്നു. — zu dem ചേർന്ന് zum ആകുന്നു.") },
    { label: w("außer"), cells: [["Dativ"]], example: ex("Außer mir war niemand da.", "Apart from me nobody was there.", "ഞാൻ ഒഴികെ ആരും അവിടെ ഉണ്ടായിരുന്നില്ല.") },
    { label: w("gegenüber"), cells: [["Dativ"]], example: ex("Die Bank liegt dem Bahnhof gegenüber.", "The bank is opposite the station.", "ബാങ്ക് സ്റ്റേഷന് എതിർവശത്താണ്.") },
    { label: w("an"), cells: [WECHSEL], example: ex("Ich hänge das Bild an die Wand. / Das Bild hängt an der Wand.", "I hang the picture on the wall (movement, accusative) / it hangs on the wall (position, dative).", "ഞാൻ ചിത്രം ചുമരിൽ തൂക്കുന്നു (ചലനം, അക്കുസാറ്റീവ്) / ചിത്രം ചുമരിൽ തൂങ്ങുന്നു (സ്ഥാനം, ഡേറ്റീവ്).") },
    { label: w("auf"), cells: [WECHSEL], example: ex("Ich lege das Buch auf den Tisch. / Es liegt auf dem Tisch.", "I put the book on the table / it lies on the table.", "ഞാൻ പുസ്തകം മേശപ്പുറത്ത് വയ്ക്കുന്നു / അത് മേശപ്പുറത്ത് കിടക്കുന്നു.") },
    { label: w("hinter"), cells: [WECHSEL], example: ex("Er geht hinter das Haus. / Er steht hinter dem Haus.", "He goes behind the house / he stands behind the house.", "അവൻ വീടിന് പിന്നിലേക്ക് പോകുന്നു / അവൻ വീടിന് പിന്നിൽ നിൽക്കുന്നു.") },
    { label: w("in"), cells: [WECHSEL], example: ex("Ich gehe in die Stadt. / Ich bin in der Stadt.", "I go into town / I am in town.", "ഞാൻ നഗരത്തിലേക്ക് പോകുന്നു / ഞാൻ നഗരത്തിലാണ്.") },
    { label: w("neben"), cells: [WECHSEL], example: ex("Setz dich neben mich. / Er sitzt neben mir.", "Sit next to me / he sits next to me.", "എന്റെ അടുത്ത് ഇരിക്കൂ / അവൻ എന്റെ അടുത്ത് ഇരിക്കുന്നു.") },
    { label: w("über"), cells: [WECHSEL], example: ex("Häng die Lampe über den Tisch. / Sie hängt über dem Tisch.", "Hang the lamp above the table / it hangs above the table.", "വിളക്ക് മേശയ്ക്ക് മുകളിൽ തൂക്കൂ / അത് മേശയ്ക്ക് മുകളിൽ തൂങ്ങുന്നു.") },
    { label: w("unter"), cells: [WECHSEL], example: ex("Die Katze läuft unter das Bett. / Sie schläft unter dem Bett.", "The cat runs under the bed / it sleeps under the bed.", "പൂച്ച കട്ടിലിനടിയിലേക്ക് ഓടുന്നു / അത് കട്ടിലിനടിയിൽ ഉറങ്ങുന്നു.") },
    { label: w("vor"), cells: [WECHSEL], example: ex("Stell dich vor die Tür. / Du stehst vor der Tür.", "Stand in front of the door / you are standing in front of the door.", "വാതിലിന് മുന്നിൽ നിൽക്കൂ / നീ വാതിലിന് മുന്നിൽ നിൽക്കുന്നു.") },
    { label: w("zwischen"), cells: [WECHSEL], example: ex("Ich setze mich zwischen die Kinder. / Ich sitze zwischen den Kindern.", "I sit down between the children / I am sitting between the children.", "ഞാൻ കുട്ടികൾക്കിടയിൽ ഇരിക്കാൻ പോകുന്നു / ഞാൻ കുട്ടികൾക്കിടയിൽ ഇരിക്കുന്നു.") },
    { label: w("wegen"), cells: [["Genitiv"]], example: ex("Wegen des Wetters bleiben wir zu Hause.", "Because of the weather we're staying home.", "കാലാവസ്ഥ കാരണം ഞങ്ങൾ വീട്ടിൽ തന്നെ ഇരിക്കുന്നു.") },
    { label: w("während"), cells: [["Genitiv"]], example: ex("Während des Films hat er geschlafen.", "During the film he slept.", "സിനിമയ്ക്കിടയിൽ അവൻ ഉറങ്ങി.") },
    { label: w("trotz"), cells: [["Genitiv"]], example: ex("Trotz des Regens gehen wir spazieren.", "Despite the rain we're going for a walk.", "മഴയായിട്ടും ഞങ്ങൾ നടക്കാൻ പോകുന്നു.") },
    { label: w("statt"), cells: [["Genitiv"]], example: ex("Statt eines Autos kaufte er ein Fahrrad.", "Instead of a car he bought a bicycle.", "കാറിന് പകരം അവൻ ഒരു സൈക്കിൾ വാങ്ങി.") }
  ],
  example: ex(
    "Mit dem Bus durch die Stadt zu meiner Schwester.",
    "By bus (dative) through the city (accusative) to my sister (dative).",
    "ബസ്സിൽ (ഡേറ്റീവ്) നഗരത്തിലൂടെ (അക്കുസാറ്റീവ്) എന്റെ സഹോദരിയുടെ അടുത്തേക്ക് (ഡേറ്റീവ്)."
  )
};

/* ----------------------------------------------------- 10-12. Adjektivendungen */

const ADJ_DEFINITE: ParadigmTable = {
  id: "tbl-adjektiv-bestimmt",
  name: {
    de: "Adjektivendungen nach dem bestimmten Artikel",
    en: "Adjective endings after der/die/das",
    ml: "der/die/das-ന് ശേഷമുള്ള വിശേഷണ എൻഡിംഗുകൾ"
  },
  blurb: {
    de: "Die einfachste der drei Tabellen: nur -e oder -en. Der Artikel hat den Fall schon gezeigt.",
    en: "The easiest of the three: only -e or -en. The article has already shown the case, so the adjective barely works.",
    ml: "മൂന്നിൽ ഏറ്റവും എളുപ്പമുള്ളത്: -e അല്ലെങ്കിൽ -en മാത്രം. ആർട്ടിക്കിൾ കാരകം കാണിച്ചുകഴിഞ്ഞു, അതുകൊണ്ട് വിശേഷണത്തിന് ജോലി കുറവാണ്."
  },
  columns: GENDER_COLUMNS,
  rows: [
    { label: NOMINATIV, cells: [["-e", "e"], ["-e", "e"], ["-e", "e"], ["-en", "en"]], example: ex("Der alte Mann kommt.", "The old man is coming.", "വൃദ്ധനായ പുരുഷൻ വരുന്നു.") },
    { label: AKKUSATIV, cells: [["-en", "en"], ["-e", "e"], ["-e", "e"], ["-en", "en"]], example: ex("Ich sehe den alten Mann.", "I see the old man.", "ഞാൻ വൃദ്ധനായ പുരുഷനെ കാണുന്നു.") },
    { label: DATIV, cells: [["-en", "en"], ["-en", "en"], ["-en", "en"], ["-en", "en"]], example: ex("Ich helfe dem alten Mann.", "I help the old man — the whole dative row is -en.", "ഞാൻ വൃദ്ധനായ പുരുഷനെ സഹായിക്കുന്നു — ഡേറ്റീവ് വരി മുഴുവൻ -en ആണ്.") },
    { label: GENITIV, cells: [["-en", "en"], ["-en", "en"], ["-en", "en"], ["-en", "en"]], example: ex("Das Haus des alten Mannes.", "The old man's house.", "വൃദ്ധനായ പുരുഷന്റെ വീട്.") }
  ],
  example: ex(
    "Die junge Frau kauft den roten Mantel.",
    "The young woman buys the red coat.",
    "യുവതി ചുവന്ന കോട്ട് വാങ്ങുന്നു."
  )
};

const ADJ_INDEFINITE: ParadigmTable = {
  id: "tbl-adjektiv-unbestimmt",
  name: {
    de: "Adjektivendungen nach dem unbestimmten Artikel",
    en: "Adjective endings after ein/kein/mein",
    ml: "ein/kein/mein-ന് ശേഷമുള്ള വിശേഷണ എൻഡിംഗുകൾ"
  },
  blurb: {
    de: "Drei Stellen, an denen der Artikel den Fall nicht zeigt — dort muss das Adjektiv einspringen: -er, -es.",
    en: "In three spots ein shows no ending, so the adjective has to do the work instead: -er and -es.",
    ml: "മൂന്നിടത്ത് ein-ന് എൻഡിംഗ് ഇല്ല, അതുകൊണ്ട് വിശേഷണം ആ ജോലി ഏറ്റെടുക്കണം: -er, -es."
  },
  columns: GENDER_COLUMNS,
  rows: [
    { label: NOMINATIV, cells: [["-er", "er"], ["-e", "e"], ["-es", "es"], ["-en", "en"]], example: ex("Ein alter Mann wartet.", "An old man is waiting — ein has no ending, so the adjective takes -er.", "ഒരു വൃദ്ധൻ കാത്തിരിക്കുന്നു — ein-ന് എൻഡിംഗ് ഇല്ല, അതുകൊണ്ട് വിശേഷണം -er എടുക്കുന്നു.") },
    { label: AKKUSATIV, cells: [["-en", "en"], ["-e", "e"], ["-es", "es"], ["-en", "en"]], example: ex("Ich habe einen alten Wagen.", "I have an old car.", "എനിക്ക് ഒരു പഴയ കാറുണ്ട്.") },
    { label: DATIV, cells: [["-en", "en"], ["-en", "en"], ["-en", "en"], ["-en", "en"]], example: ex("mit einem alten Wagen", "with an old car", "ഒരു പഴയ കാറുമായി") },
    { label: GENITIV, cells: [["-en", "en"], ["-en", "en"], ["-en", "en"], ["-en", "en"]], example: ex("wegen eines alten Problems", "because of an old problem", "ഒരു പഴയ പ്രശ്നം കാരണം") }
  ],
  example: ex(
    "Ein kleines Kind spielt mit einem großen Hund.",
    "A small child plays with a big dog.",
    "ഒരു ചെറിയ കുട്ടി ഒരു വലിയ നായയുമായി കളിക്കുന്നു."
  )
};

const ADJ_NONE: ParadigmTable = {
  id: "tbl-adjektiv-ohne",
  name: {
    de: "Adjektivendungen ohne Artikel",
    en: "Adjective endings with no article",
    ml: "ആർട്ടിക്കിൾ ഇല്ലാത്തപ്പോഴുള്ള വിശേഷണ എൻഡിംഗുകൾ"
  },
  blurb: {
    de: "Kein Artikel, also trägt das Adjektiv allein den Fall — fast genau die Endungen von der/die/das.",
    en: "With no article the adjective carries the case alone, and takes almost exactly the endings of der/die/das.",
    ml: "ആർട്ടിക്കിൾ ഇല്ലാത്തതിനാൽ വിശേഷണം തനിച്ച് കാരകം വഹിക്കുന്നു — ഏതാണ്ട് der/die/das-ന്റെ അതേ എൻഡിംഗുകൾ."
  },
  columns: GENDER_COLUMNS,
  rows: [
    { label: NOMINATIV, cells: [["-er", "er"], ["-e", "e"], ["-es", "es"], ["-e", "e"]], example: ex("Guter Wein ist teuer.", "Good wine is expensive.", "നല്ല വൈൻ വിലകൂടിയതാണ്.") },
    { label: AKKUSATIV, cells: [["-en", "en"], ["-e", "e"], ["-es", "es"], ["-e", "e"]], example: ex("Ich trinke kalten Kaffee.", "I drink cold coffee.", "ഞാൻ തണുത്ത കാപ്പി കുടിക്കുന്നു.") },
    { label: DATIV, cells: [["-em", "em"], ["-er", "er"], ["-em", "em"], ["-en", "en"]], example: ex("mit frischem Brot", "with fresh bread — note -em, the only row where it appears.", "പുതിയ ബ്രെഡിനൊപ്പം — -em പ്രത്യക്ഷപ്പെടുന്ന ഒരേയൊരു വരി ഇതാണ്.") },
    { label: GENITIV, cells: [["-en", "en"], ["-er", "er"], ["-en", "en"], ["-er", "er"]], example: ex("der Geschmack frischer Milch", "the taste of fresh milk", "പുതിയ പാലിന്റെ രുചി") }
  ],
  example: ex(
    "Ich trinke gerne schwarzen Tee mit heißer Milch.",
    "I like drinking black tea with hot milk.",
    "എനിക്ക് ചൂടുള്ള പാലിനൊപ്പം കട്ടൻ ചായ കുടിക്കാൻ ഇഷ്ടമാണ്."
  )
};

/* -------------------------------------------------------------------- bank */

/**
 * Drill order matters: articles and pronouns first, because every later table
 * assumes them.
 */
export const TABLES: readonly ParadigmTable[] = [
  DEFINITE_ARTICLE,
  PERSONAL_PRONOUNS,
  INDEFINITE_ARTICLE,
  NEGATIVE_ARTICLE,
  CASE_QUESTIONS,
  POSSESSIVE_BASE,
  POSSESSIVE_ENDINGS,
  VERB_CASE,
  PREPOSITION_CASE,
  ADJ_DEFINITE,
  ADJ_INDEFINITE,
  ADJ_NONE
];

export function tableById(id: string): ParadigmTable | undefined {
  return TABLES.find((table) => table.id === id);
}

/** Stable key for one cell, used by progress and the missed-cell dictionary. */
export function cellKey(tableId: string, row: number, col: number): string {
  return `${tableId}#${row}:${col}`;
}

export interface CellRef {
  readonly tableId: string;
  readonly row: number;
  readonly col: number;
}

export function parseCellKey(key: string): CellRef | null {
  const [tableId, coords] = key.split("#");
  if (!tableId || !coords) return null;
  const [row, col] = coords.split(":").map((n) => Number.parseInt(n, 10));
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  return { tableId, row: row as number, col: col as number };
}

/** Every drillable cell of a table, in reading order. */
export function cellsOf(table: ParadigmTable): readonly CellRef[] {
  const refs: CellRef[] = [];
  table.rows.forEach((row, r) => {
    row.cells.forEach((_cell, c) => refs.push({ tableId: table.id, row: r, col: c }));
  });
  return refs;
}

export const CASE_ROW_LABELS = CASE_ROWS;
