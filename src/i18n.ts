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
  readonly statStreak: string;
  readonly statMastered: string;
  readonly statAccuracy: string;
  readonly todayPlan: string;
  readonly jumpToStep: (label: string) => string;

  /* learner-added vocabulary */
  readonly addWordButton: string;
  readonly addWordTitle: string;
  readonly addWordKind: string;
  readonly addWordWord: string;
  readonly addWordWordPlaceholder: string;
  readonly addWordNote: string;
  readonly addWordNotePlaceholder: string;
  readonly addWordCommaHint: string;
  readonly addWordAction: string;
  readonly addWordNeedWord: string;
  readonly addWordNeedArticle: string;
  readonly addWordNeedAuxiliary: string;
  readonly addWordNeedMeaning: string;
  readonly addWordNeedPlural: string;
  readonly addWordNeedParticiple: string;
  readonly ownWord: string;
  readonly removeWord: string;
  readonly removeWordConfirm: (word: string) => string;

  /* front door */
  readonly loading: string;
  readonly loginTitle: string;
  readonly loginBlurb: string;
  readonly loginPoints: readonly [string, string, string];
  readonly signInTab: string;
  readonly signUpTab: string;
  readonly password: string;
  readonly passwordPlaceholder: string;
  readonly passwordRule: string;
  readonly showPassword: string;
  readonly hidePassword: string;
  readonly signInAction: string;
  readonly signUpAction: string;
  readonly forgotPassword: string;
  readonly resetAction: string;
  readonly resetBlurb: string;
  readonly resetSentTitle: string;
  readonly resetSent: (email: string) => string;
  readonly confirmTitle: string;
  readonly confirmSent: (email: string) => string;
  readonly backToSignIn: string;
  readonly newPasswordTitle: string;
  readonly newPasswordBlurb: string;
  readonly newPasswordAction: string;
  readonly passwordUpdated: string;
  readonly changePassword: string;
  readonly authWrongCredentials: string;
  readonly authNotConfirmed: string;
  readonly authAlreadyRegistered: string;
  readonly authWeakPassword: string;
  readonly authRateLimit: string;

  /* level */
  readonly levelEyebrow: string;
  readonly levelTitle: string;
  readonly levelLede: string;
  readonly levelPick: (code: string) => string;
  readonly levelCurrent: string;
  readonly changeLevel: string;
  readonly yourLevel: string;

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

  /* voice */
  readonly voiceTitle: string;
  readonly voiceButtonTitle: string;
  readonly voiceIdle: string;
  readonly voiceListening: string;
  readonly voiceSpeaking: string;
  readonly voiceUnsupported: string;
  readonly voiceMicDenied: string;
  readonly voiceNoSpeech: string;
  readonly voiceHint: string;
  readonly voiceSpeakIn: string;
  readonly voiceConnecting: string;
  readonly voiceEnded: string;
  readonly voiceVoiceLabel: string;

  /* account */
  readonly signIn: string;
  readonly signOut: string;
  readonly account: string;
  readonly signInTitle: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
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
  statStreak: "Tage in Folge",
  statMastered: "gemeistert",
  statAccuracy: "Trefferquote",
  todayPlan: "Dein Plan für heute",
  jumpToStep: (label) => `Zu „${label}“ springen`,

  addWordButton: "Wort hinzufügen",
  addWordTitle: "Eigenes Wort hinzufügen",
  addWordKind: "Wortart",
  addWordWord: "Wort",
  addWordWordPlaceholder: "Ärztin",
  addWordNote: "Notiz (optional)",
  addWordNotePlaceholder: "Weibliche Formen auf -in bilden den Plural auf -innen.",
  addWordCommaHint: "Mehrere Antworten mit Komma trennen",
  addWordAction: "Hinzufügen",
  addWordNeedWord: "Schreib zuerst das Wort.",
  addWordNeedArticle: "Der Artikel muss der, die oder das sein.",
  addWordNeedAuxiliary: "Das Hilfsverb muss sein oder haben sein.",
  addWordNeedMeaning: "Gib mindestens eine englische Bedeutung an.",
  addWordNeedPlural: "Gib den Plural an.",
  addWordNeedParticiple: "Gib das Partizip II an.",
  ownWord: "eigenes Wort",
  removeWord: "Entfernen",
  removeWordConfirm: (word) => `„${word}“ aus dem Drill entfernen?`,

  loading: "Einen Moment …",
  loginTitle: "Dein Deutsch. Jeden Tag.",
  loginBlurb:
    "Ein Drill pro Tag, der sich merkt, was du falsch machst. Erstell ein Konto mit E-Mail und Passwort — dein Fortschritt folgt dir auf jedes Gerät.",
  loginPoints: [
    "Vokabeln, Tabellen und Wiederholung in 25 Minuten",
    "Fehler kommen morgen wieder, bis sie sitzen",
    "Dein Niveau, deine Themen — auf jedem Gerät"
  ],
  signInTab: "Anmelden",
  signUpTab: "Konto erstellen",
  password: "Passwort",
  passwordPlaceholder: "••••••••",
  passwordRule:
    "Mindestens 8 Zeichen. Danach schicken wir dir einen Bestätigungslink — erst damit ist das Konto aktiv.",
  showPassword: "Passwort anzeigen",
  hidePassword: "Passwort verbergen",
  signInAction: "Anmelden",
  signUpAction: "Konto erstellen",
  forgotPassword: "Passwort vergessen?",
  resetAction: "Link senden",
  resetBlurb: "Gib deine E-Mail ein — wir schicken dir einen Link, mit dem du ein neues Passwort setzen kannst.",
  resetSentTitle: "Schau in dein Postfach.",
  resetSent: (email) => `Wir haben einen Link an ${email} geschickt. Öffne ihn und wähl ein neues Passwort.`,
  confirmTitle: "Fast geschafft.",
  confirmSent: (email) =>
    `Wir haben einen Bestätigungslink an ${email} geschickt. Öffne ihn — damit ist dein Konto aktiv und du bist direkt angemeldet.`,
  backToSignIn: "Zur Anmeldung",
  newPasswordTitle: "Neues Passwort",
  newPasswordBlurb: "Wähl ein Passwort mit mindestens 8 Zeichen.",
  newPasswordAction: "Passwort speichern",
  passwordUpdated: "Passwort gespeichert.",
  changePassword: "Passwort ändern",
  authWrongCredentials: "E-Mail oder Passwort stimmt nicht.",
  authNotConfirmed: "Bitte bestätige zuerst deine E-Mail-Adresse — schau in dein Postfach.",
  authAlreadyRegistered: "Für diese E-Mail gibt es schon ein Konto. Melde dich an oder setz das Passwort zurück.",
  authWeakPassword: "Das Passwort braucht mindestens 8 Zeichen.",
  authRateLimit: "Zu viele Versuche. Warte kurz und versuch es dann noch einmal.",

  levelEyebrow: "Dein Niveau",
  levelTitle: "Wo stehst du?",
  levelLede:
    "Wähl dein Niveau. Jedes hat eigene Vokabeln, Tabellen und Themen — du kannst es jederzeit im Konto ändern.",
  levelPick: (code) => `Mit ${code} starten`,
  levelCurrent: "dein aktuelles Niveau",
  changeLevel: "Niveau ändern",
  yourLevel: "Dein Niveau",

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

  voiceTitle: "Sprich mit deinem Lehrer",
  voiceButtonTitle: "Sprachmodus öffnen — zweimal v drücken",
  voiceIdle: "Antippen, um das Gespräch zu beginnen",
  voiceListening: "Ich höre zu — sprich einfach los",
  voiceSpeaking: "Dein Lehrer spricht — du kannst ihn unterbrechen",
  voiceUnsupported:
    "Dieser Browser kann kein Audio aufnehmen. Nimm einen aktuellen Browser — oder schreib im Chat (cc).",
  voiceMicDenied: "Kein Zugriff auf das Mikrofon. Erlaube es in den Browser-Einstellungen und versuch es noch einmal.",
  voiceNoSpeech: "Ich habe nichts gehört. Tipp das Mikrofon noch einmal an und sprich.",
  voiceHint: "Sprich Deutsch oder Englisch · Esc schließen",
  voiceSpeakIn: "Ich spreche",
  voiceConnecting: "Verbinde …",
  voiceEnded: "Gespräch beendet. Antippen für ein neues.",
  voiceVoiceLabel: "Stimme",

  signIn: "Anmelden",
  signOut: "Abmelden",
  account: "Konto",
  signInTitle: "Fortschritt überall",
  emailLabel: "E-Mail",
  emailPlaceholder: "du@beispiel.de",
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
  statStreak: "day streak",
  statMastered: "mastered",
  statAccuracy: "accuracy",
  todayPlan: "Your plan for today",
  jumpToStep: (label) => `Jump to "${label}"`,

  addWordButton: "Add a word",
  addWordTitle: "Add your own word",
  addWordKind: "Word type",
  addWordWord: "Word",
  addWordWordPlaceholder: "Ärztin",
  addWordNote: "Note (optional)",
  addWordNotePlaceholder: "Feminine forms ending in -in take -innen in the plural.",
  addWordCommaHint: "Separate several answers with commas",
  addWordAction: "Add",
  addWordNeedWord: "Write the word first.",
  addWordNeedArticle: "The article must be der, die or das.",
  addWordNeedAuxiliary: "The auxiliary must be sein or haben.",
  addWordNeedMeaning: "Give at least one English meaning.",
  addWordNeedPlural: "Give the plural.",
  addWordNeedParticiple: "Give the past participle.",
  ownWord: "your word",
  removeWord: "Remove",
  removeWordConfirm: (word) => `Remove "${word}" from the drill?`,

  loading: "One moment …",
  loginTitle: "Your German. Every day.",
  loginBlurb:
    "One drill a day that remembers what you get wrong. Create an account with your email and a password — your progress follows you to every device.",
  loginPoints: [
    "Vocabulary, tables and review in 25 minutes",
    "Mistakes come back tomorrow until they stick",
    "Your level, your topics — on every device"
  ],
  signInTab: "Sign in",
  signUpTab: "Create account",
  password: "Password",
  passwordPlaceholder: "••••••••",
  passwordRule:
    "At least 8 characters. We then send you a confirmation link — the account is active once you open it.",
  showPassword: "Show password",
  hidePassword: "Hide password",
  signInAction: "Sign in",
  signUpAction: "Create account",
  forgotPassword: "Forgot your password?",
  resetAction: "Send the link",
  resetBlurb: "Enter your email — we'll send you a link that lets you set a new password.",
  resetSentTitle: "Check your inbox.",
  resetSent: (email) => `We've sent a link to ${email}. Open it and choose a new password.`,
  confirmTitle: "Almost there.",
  confirmSent: (email) =>
    `We've sent a confirmation link to ${email}. Open it — that activates your account and signs you straight in.`,
  backToSignIn: "Back to sign in",
  newPasswordTitle: "New password",
  newPasswordBlurb: "Choose a password of at least 8 characters.",
  newPasswordAction: "Save password",
  passwordUpdated: "Password saved.",
  changePassword: "Change password",
  authWrongCredentials: "That email and password don't match.",
  authNotConfirmed: "Please confirm your email address first — check your inbox.",
  authAlreadyRegistered: "There's already an account for this email. Sign in, or reset the password.",
  authWeakPassword: "The password needs at least 8 characters.",
  authRateLimit: "Too many attempts. Wait a moment and try again.",

  levelEyebrow: "Your level",
  levelTitle: "Where do you stand?",
  levelLede:
    "Pick your level. Each one has its own vocabulary, tables and topics — you can change it any time in your account.",
  levelPick: (code) => `Start with ${code}`,
  levelCurrent: "your current level",
  changeLevel: "Change level",
  yourLevel: "Your level",

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

  voiceTitle: "Talk with your teacher",
  voiceButtonTitle: "Open voice mode — press v twice",
  voiceIdle: "Tap to start the conversation",
  voiceListening: "Listening — just talk",
  voiceSpeaking: "Your teacher is speaking — you can cut in",
  voiceUnsupported:
    "This browser can't capture audio. Use a current browser — or type in the chat (cc).",
  voiceMicDenied: "No microphone access. Allow it in your browser settings and try again.",
  voiceNoSpeech: "I didn't hear anything. Tap again and speak.",
  voiceHint: "Speak German or English · Esc to close",
  voiceSpeakIn: "I'm speaking",
  voiceConnecting: "Connecting …",
  voiceEnded: "Call ended. Tap to start another.",
  voiceVoiceLabel: "Voice",

  signIn: "Sign in",
  signOut: "Sign out",
  account: "Account",
  signInTitle: "Your progress, everywhere",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
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
