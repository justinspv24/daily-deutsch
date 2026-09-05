import type { Bilingual, Lang } from "./types";

/**
 * Interface language. German is the default: the point is immersion, so the
 * German UI also prints an English gloss under key sentences. English mode
 * drops the glosses and translates the chrome outright.
 */

export interface Strings {
  readonly tagline: string;
  readonly greeting: (name: string | null) => string;
  readonly lede: string;
  readonly steps: readonly [string, string, string, string];
  readonly stepVocabDetailEmpty: string;
  readonly stepTablesDetail: string;
  readonly stepReviewDetailEmpty: string;
  readonly overdueSuffix: (n: number) => string;
  readonly wordsUnit: (n: number) => string;
  readonly sentencesUnit: (n: number) => string;
  readonly dueUnit: (n: number) => string;
  readonly nothingDue: string;
  readonly allClear: string;
  readonly inChat: string;
  readonly upNext: string;
  readonly start: string;
  readonly viewProgress: string;
  readonly backToDrill: string;
  readonly back: string;
  readonly again: string;
  readonly check: string;
  readonly next: string;
  readonly finish: string;
  readonly enterHint: string;
  readonly navHint: string;
  readonly vocabCheck: string;
  readonly auxiliary: string;
  readonly article: string;
  readonly meaning: string;
  readonly participle: string;
  readonly plural: string;
  readonly verb: string;
  readonly noun: string;
  readonly correct: string;
  readonly nearly: string;
  readonly notQuite: string;
  readonly masteredNow: string;
  readonly oneMoreDay: (n: number) => string;
  readonly counterReset: string;
  readonly correctAnswer: string;
  readonly evaluation: string;
  readonly flawless: string;
  readonly solid: string;
  readonly workToDo: string;
  readonly percentRight: (n: number) => string;
  readonly staysInDrill: (n: number) => string;
  readonly nothingNew: string;
  readonly streakDays: (n: number) => string;
  readonly reviewAgain: string;
  readonly progressTitle: string;
  readonly lastRounds: string;
  readonly vocabInDrill: string;
  readonly reviewPlan: string;
  readonly colWord: string;
  readonly colMeaning: string;
  readonly colTwice: string;
  readonly colLast: string;
  readonly colTopic: string;
  readonly colStage: string;
  readonly colNextReview: string;
  readonly mastered: string;
  readonly inDrill: string;
  readonly finished: string;
  readonly dueToday: string;
  readonly overdueBy: (n: number) => string;
  readonly inDays: (n: number) => string;
  readonly tablesSecure: (a: number, b: number) => string;
  readonly intervals: string;
  readonly themeLabel: string;
  readonly langLabel: string;
  readonly footer: string;
  readonly noSessionsYet: string;

  /* overlays */
  readonly close: string;
  readonly send: string;
  readonly thinking: string;
  readonly chatTitle: string;
  readonly chatPlaceholder: string;
  readonly chatHint: string;
  readonly chatWelcome: string;
  readonly chatButtonTitle: string;
  readonly translateTitle: string;
  readonly translatePlaceholder: string;
  readonly translateHint: string;
  readonly translateEmpty: string;
  readonly translation: string;
  readonly translateButtonTitle: string;
  readonly aiDisabled: string;
  readonly aiSignInRequired: string;
  readonly aiDailyLimit: string;
  readonly aiOffline: string;
  readonly aiFailed: string;

  /* account */
  readonly signIn: string;
  readonly signOut: string;
  readonly account: string;
  readonly signInTitle: string;
  readonly signInBlurb: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly sendLink: string;
  readonly linkSent: (email: string) => string;
  readonly badEmail: string;
  readonly signInFailed: string;
  readonly syncedAs: (who: string) => string;
  readonly localOnly: string;
  readonly mergedNotice: string;
}

const de: Strings = {
  tagline: "Täglich Deutsch · A1 → B2",
  greeting: (name) => (name ? `Guten Tag, ${name}.` : "Guten Tag."),
  lede:
    "Eine Runde dauert etwa 25 Minuten. Alles, was du falsch machst, kommt morgen wieder — alles, was zweimal sitzt, verschwindet.",
  steps: ["Vokabeln", "Tabellen", "Wiederholung", "Neues Thema"],
  stepVocabDetailEmpty: "Nichts offen — gut gemacht.",
  stepTablesDetail: "Lückensätze aus allen sechs Tabellen. Der Fall wird nie verraten.",
  stepReviewDetailEmpty: "Heute ist kein Thema fällig.",
  overdueSuffix: (n) => ` — ${n} überfällig`,
  wordsUnit: (n) => (n === 1 ? "1 Wort" : `${n} Wörter`),
  sentencesUnit: (n) => (n === 1 ? "1 Satz" : `${n} Sätze`),
  dueUnit: (n) => (n === 1 ? "1 fällig" : `${n} fällig`),
  nothingDue: "nichts fällig",
  allClear: "alle sitzen",
  inChat: "im Chat",
  upNext: "als Nächstes",
  start: "Drill starten",
  viewProgress: "Fortschritt",
  backToDrill: "Zurück zum Drill",
  back: "Zurück",
  again: "Nochmal drillen",
  check: "Prüfen",
  next: "Weiter",
  finish: "Auswertung",
  enterHint: "Enter",
  navHint: "↑ ↓ Feld wechseln · Enter weiter",
  vocabCheck: "Vokabelkontrolle",
  auxiliary: "Hilfsverb",
  article: "Artikel",
  meaning: "Bedeutung (Englisch)",
  participle: "Partizip II",
  plural: "Plural",
  verb: "Verb",
  noun: "Nomen",
  correct: "Richtig.",
  nearly: "Fast — achte auf Umlaute und ß.",
  notQuite: "Nicht ganz.",
  masteredNow: "Gemeistert — dieses Wort fällt aus dem Drill.",
  oneMoreDay: (n) => `Richtig — noch einmal morgen, dann ist es weg. (${n}/2)`,
  counterReset: "Zähler zurück auf 0 von 2.",
  correctAnswer: "Richtig",
  evaluation: "Auswertung",
  flawless: "Fehlerfrei.",
  solid: "Solide Runde.",
  workToDo: "Da ist noch Arbeit.",
  percentRight: (n) => `${n} % richtig`,
  staysInDrill: (n) => (n === 1 ? "1 Punkt bleibt im Drill" : `${n} Punkte bleiben im Drill`),
  nothingNew: "Nichts Neues im Fehlerheft",
  streakDays: (n) => (n === 1 ? "1 Tag in Folge" : `${n} Tage in Folge`),
  reviewAgain: "Noch einmal ansehen",
  progressTitle: "Wo du stehst",
  lastRounds: "Letzte 14 Runden — Anteil richtiger Antworten.",
  vocabInDrill: "Vokabeln im Drill",
  reviewPlan: "Grammatikthemen und Wiederholungsplan",
  colWord: "Wort",
  colMeaning: "Bedeutung",
  colTwice: "2 ×",
  colLast: "zuletzt",
  colTopic: "Thema",
  colStage: "Stufe",
  colNextReview: "nächste Wiederholung",
  mastered: "gemeistert",
  inDrill: "im Drill",
  finished: "fertig",
  dueToday: "heute",
  overdueBy: (n) => (n === 1 ? "1 Tag überfällig" : `${n} Tage überfällig`),
  inDays: (n) => (n === 1 ? "in 1 Tag" : `in ${n} Tagen`),
  tablesSecure: (a, b) => `Tabellensätze sicher: ${a} von ${b}.`,
  intervals: "Intervalle: 1 · 3 · 7 · 21 · 35 Tage.",
  themeLabel: "Farbschema wechseln",
  langLabel: "Sprache",
  footer: "Daily Deutsch",
  noSessionsYet: "Noch keine Runde abgeschlossen.",

  close: "Schließen",
  send: "Senden",
  thinking: "Einen Moment …",
  chatTitle: "Frag deinen Lehrer",
  chatPlaceholder: "Schreib auf Deutsch oder Englisch …",
  chatHint: "Enter senden · Umschalt + Enter neue Zeile · Esc schließen",
  chatWelcome:
    "Hallo! Frag mich alles über Grammatik, Wörter oder Sätze.\nHello Justins! Ask me anything about grammar, words or sentences.",
  chatButtonTitle: "Chat öffnen — zweimal c drücken",
  translateTitle: "Übersetzen",
  translatePlaceholder: "Deutsch oder Englisch eingeben …",
  translateHint: "Übersetzt automatisch · Enter sofort · Esc schließen",
  translateEmpty: "Die Übersetzung erscheint hier.",
  translation: "Übersetzung",
  translateButtonTitle: "Übersetzer öffnen — zweimal t drücken",
  aiDisabled: "Der Assistent ist auf dieser Seite noch nicht eingeschaltet.",
  aiSignInRequired: "Bitte melde dich an, um den Assistenten zu nutzen.",
  aiDailyLimit: "Das war das Tageslimit. Um Mitternacht (UTC) geht es weiter.",
  aiOffline: "Keine Verbindung. Prüf dein Netz und versuch es noch einmal.",
  aiFailed: "Das hat nicht geklappt. Versuch es bitte noch einmal.",

  signIn: "Anmelden",
  signOut: "Abmelden",
  account: "Konto",
  signInTitle: "Fortschritt überall",
  signInBlurb:
    "Melde dich an, und dein Fortschritt folgt dir auf jedes Gerät. Kein Passwort — du bekommst einen Link per E-Mail.",
  emailLabel: "E-Mail",
  emailPlaceholder: "du@beispiel.de",
  sendLink: "Link senden",
  linkSent: (email) => `Link an ${email} geschickt. Öffne ihn auf diesem Gerät.`,
  badEmail: "Diese E-Mail-Adresse sieht nicht richtig aus.",
  signInFailed: "Das hat nicht geklappt. Versuch es bitte noch einmal.",
  syncedAs: (who) => `angemeldet als ${who}`,
  localOnly: "nur dieses Gerät",
  mergedNotice: "Dein bisheriger Fortschritt wurde mit deinem Konto zusammengeführt."
};

const en: Strings = {
  tagline: "Daily German · A1 → B2",
  greeting: (name) => (name ? `Good day, ${name}.` : "Good day."),
  lede:
    "A round takes about 25 minutes. Anything you get wrong comes back tomorrow; anything you get right twice disappears.",
  steps: ["Vocabulary", "Tables", "Review", "New topic"],
  stepVocabDetailEmpty: "Nothing outstanding — well done.",
  stepTablesDetail: "Gap sentences from all six tables. The case is never revealed.",
  stepReviewDetailEmpty: "No topic falls due today.",
  overdueSuffix: (n) => ` — ${n} overdue`,
  wordsUnit: (n) => (n === 1 ? "1 word" : `${n} words`),
  sentencesUnit: (n) => (n === 1 ? "1 sentence" : `${n} sentences`),
  dueUnit: (n) => (n === 1 ? "1 due" : `${n} due`),
  nothingDue: "nothing due",
  allClear: "all secure",
  inChat: "in chat",
  upNext: "up next",
  start: "Start the drill",
  viewProgress: "Progress",
  backToDrill: "Back to the drill",
  back: "Back",
  again: "Drill again",
  check: "Check",
  next: "Next",
  finish: "Results",
  enterHint: "Enter",
  navHint: "↑ ↓ change field · Enter to continue",
  vocabCheck: "Vocabulary check",
  auxiliary: "Auxiliary verb",
  article: "Article",
  meaning: "Meaning (English)",
  participle: "Past participle",
  plural: "Plural",
  verb: "Verb",
  noun: "Noun",
  correct: "Correct.",
  nearly: "Close — mind the umlauts and ß.",
  notQuite: "Not quite.",
  masteredNow: "Mastered — this word leaves the drill.",
  oneMoreDay: (n) => `Correct — once more tomorrow and it's gone. (${n}/2)`,
  counterReset: "Counter back to 0 of 2.",
  correctAnswer: "Correct answer",
  evaluation: "Results",
  flawless: "Flawless.",
  solid: "A solid round.",
  workToDo: "There's work to do.",
  percentRight: (n) => `${n}% correct`,
  staysInDrill: (n) => (n === 1 ? "1 item stays in the drill" : `${n} items stay in the drill`),
  nothingNew: "Nothing new for the mistake book",
  streakDays: (n) => (n === 1 ? "1 day in a row" : `${n} days in a row`),
  reviewAgain: "Worth another look",
  progressTitle: "Where you stand",
  lastRounds: "Last 14 rounds — share of correct answers.",
  vocabInDrill: "Vocabulary in the drill",
  reviewPlan: "Grammar topics and review schedule",
  colWord: "Word",
  colMeaning: "Meaning",
  colTwice: "2 ×",
  colLast: "last seen",
  colTopic: "Topic",
  colStage: "Stage",
  colNextReview: "next review",
  mastered: "mastered",
  inDrill: "in drill",
  finished: "finished",
  dueToday: "today",
  overdueBy: (n) => (n === 1 ? "1 day overdue" : `${n} days overdue`),
  inDays: (n) => (n === 1 ? "in 1 day" : `in ${n} days`),
  tablesSecure: (a, b) => `Table sentences secure: ${a} of ${b}.`,
  intervals: "Intervals: 1 · 3 · 7 · 21 · 35 days.",
  themeLabel: "Switch colour scheme",
  langLabel: "Language",
  footer: "Daily Deutsch",
  noSessionsYet: "No round completed yet.",

  close: "Close",
  send: "Send",
  thinking: "One moment …",
  chatTitle: "Ask your teacher",
  chatPlaceholder: "Write in German or English …",
  chatHint: "Enter to send · Shift + Enter for a new line · Esc to close",
  chatWelcome: "Hello! Ask me anything about grammar, words or sentences.",
  chatButtonTitle: "Open the chat — press c twice",
  translateTitle: "Translate",
  translatePlaceholder: "Type German or English …",
  translateHint: "Translates as you type · Enter for now · Esc to close",
  translateEmpty: "The translation appears here.",
  translation: "Translation",
  translateButtonTitle: "Open the translator — press t twice",
  aiDisabled: "The assistant is not switched on for this site yet.",
  aiSignInRequired: "Please sign in to use the assistant.",
  aiDailyLimit: "That's today's limit. It resets at midnight UTC.",
  aiOffline: "No connection. Check your network and try again.",
  aiFailed: "That didn't work. Please try again.",

  signIn: "Sign in",
  signOut: "Sign out",
  account: "Account",
  signInTitle: "Your progress, everywhere",
  signInBlurb:
    "Sign in and your progress follows you to any device. No password — we email you a link.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  sendLink: "Send the link",
  linkSent: (email) => `Link sent to ${email}. Open it on this device.`,
  badEmail: "That email address doesn't look right.",
  signInFailed: "That didn't work. Please try again.",
  syncedAs: (who) => `signed in as ${who}`,
  localOnly: "this device only",
  mergedNotice: "Your existing progress has been merged into your account."
};

const CATALOGUE: Record<Lang, Strings> = { de, en };

const LANG_KEY = "tagesdrill.lang";

let current: Lang = readLang();

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "de" || stored === "en") return stored;
  } catch {
    /* private mode — fall through */
  }
  return "de";
}

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang): void {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* not fatal */
  }
}

/** The active string catalogue. */
export function t(): Strings {
  return CATALOGUE[current];
}

/** Pick the active language out of a bilingual content string. */
export function pick(value: Bilingual): string {
  return value[current];
}

/**
 * The English gloss shown beneath German sentences in German mode, mirroring
 * the "translation on its own line, in italics" rule of the lesson plan.
 * In English mode the chrome is already English, so there is nothing to gloss.
 */
export function gloss(value: Bilingual): string | null {
  return current === "de" ? value.en : null;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(current === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function formatToday(): string {
  return new Date().toLocaleDateString(current === "de" ? "de-DE" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}
