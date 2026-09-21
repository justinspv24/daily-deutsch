import type { Bilingual, Lang } from "./types";

/**
 * Interface language. German is the default: the point is immersion, so the
 * German UI also prints an English gloss under key sentences. English mode
 * drops the glosses and translates the chrome outright.
 *
 * `Strings` is the contract between this file and every screen. Both `de` and
 * `en` are annotated with it rather than inferred, so a key added to one and
 * forgotten in the other is a compile error here and not a blank label in
 * production. Keep the three lists in the same order for the same reason —
 * the eye finds a missing entry far faster than the type checker explains it.
 */

export interface Strings {
  readonly tagline: string;
  readonly greeting: (name: string | null) => string;
  readonly lede: string;

  /* home — the one door in */
  readonly classStart: string;
  readonly classResume: string;
  readonly classStartMeta: (minutes: number, topic: string) => string;
  readonly classResumeMeta: (minutes: number, topic: string) => string;
  readonly classUnavailable: string;
  readonly classPlanTitle: string;
  readonly classPlanReviews: (n: number) => string;
  readonly classPlanWords: (n: number) => string;
  readonly classPlanTables: (n: number) => string;
  readonly classPlanSentences: (n: number) => string;
  readonly classPlanTalk: (minutes: number) => string;
  readonly classPlanTopic: (topic: string) => string;
  readonly classAutoClosed: (date: string) => string;
  readonly classAutoClosedNote: string;
  readonly classAutoClosedSeen: string;
  readonly profileButton: string;

  /* the classroom */
  readonly classTitle: string;
  readonly classHomeTitle: string;
  readonly classClockLabel: string;
  readonly classTranscriptLabel: string;
  readonly classJumpToLatest: string;
  readonly classConnecting: string;
  /**
   * The two halves of the status strip, read out of the corner of the eye
   * while somebody is talking. Both speak of the teacher in the third person,
   * like the rest of the classroom — the strip is the app describing the call,
   * not the teacher's own voice, and "Ich höre zu" one moment and "Dein Lehrer
   * spricht" the next left the learner working out who was addressing him.
   * The voice overlay is a different room and keeps its first person.
   */
  readonly classListening: string;
  readonly classSpeaking: string;
  readonly classThinking: string;
  readonly classPaused: string;
  readonly classEnded: string;
  readonly classBreak: string;
  readonly classResumeClass: string;
  readonly classEnd: string;
  readonly classEndConfirm: string;
  readonly classRetry: string;
  readonly classErrorTitle: string;
  readonly classCorrection: string;
  readonly classCorrectionSaid: string;
  readonly classCorrectionShould: string;
  readonly classNowTalk: string;
  readonly classNowVocab: string;
  readonly classNowTable: string;
  readonly classNowSentence: string;
  readonly classNowReview: string;
  readonly classProgress: (done: number, total: number) => string;

  /* the card a closed question appears on, and the field under it */
  /**
   * Eyebrows on the card. They name the kind of question, never the question
   * itself — that arrives written out in `ClassAskView.question`. The
   * vocabulary one says "Bedeutung" and not "Wortschatz" on purpose: a
   * vocabulary card is a single question now, the meaning, and this eyebrow is
   * the one place the screen can say so before the learner starts reciting an
   * article nobody asked for.
   */
  readonly classAskVocab: string;
  readonly classAskTable: string;
  readonly classAskSentence: string;
  readonly classAskReview: string;
  /** Accessible name of the answer field, which carries no visible caption. */
  readonly classAnswerLabel: string;
  /**
   * Two placeholders, because the field means something different depending on
   * whether the microphone is open. With the mic live, typing is the second
   * way in and the placeholder offers it; while the tutor is talking it is the
   * only way in. A single neutral placeholder would leave a learner who has
   * just been asked something unsure whether saying it aloud counts at all.
   */
  readonly classAnswerPlaceholderSay: string;
  readonly classAnswerPlaceholderType: string;
  /**
   * Not the generic `send`: this button sits beside a field the learner may
   * equally well speak into, and a screen reader announcing "Senden" there
   * says nothing about what is being sent.
   */
  readonly classAnswerSend: string;
  /** One line under the card — both ways of answering land in the same place. */
  readonly classAnswerHint: string;

  /* the day's summary */
  readonly classSummaryEyebrow: string;
  readonly classSummaryTitle: string;
  /** Stands in for the title when the class came through without a slip. */
  readonly classSummaryClean: string;
  /** The headline when there is no record at all — a class too short to keep. */
  readonly classSummaryNothing: string;
  /** `text` arrives already formatted by `formatDuration` — never reformat it. */
  readonly classSummaryDuration: (text: string) => string;
  /** The word under the duration figure, which carries the number itself. */
  readonly classSummaryDurationLabel: string;
  readonly classSummaryScore: (right: number, total: number) => string;
  readonly classSummaryScoreLabel: string;
  readonly classSummaryShareLabel: string;
  /** The note on a class nobody ended. */
  readonly classSummaryMidnight: string;
  readonly classSummaryCovered: string;
  readonly classSummaryMistakes: string;
  readonly classSummaryNoMistakes: string;
  readonly classSummaryReturn: (n: number) => string;
  readonly classSummaryWords: string;
  readonly classSummaryTables: string;
  readonly classSummaryGrammar: string;
  readonly classSummaryCorrections: string;
  readonly classSummarySection: (name: string) => string;
  /** The bare unit words `formatDuration` glues its numbers to. */
  readonly unitMinutes: string;
  readonly unitHours: string;

  /* the paradigm tables */
  readonly gridExample: string;
  readonly gridMalayalam: string;
  readonly gridSectionTitle: string;
  readonly gridSecure: (done: number, total: number) => string;
  readonly gridMissedTitle: string;
  readonly gridMissedEmpty: string;
  readonly gridStatusMastered: string;
  readonly gridStatusDay: (n: number) => string;
  readonly gridStatusNew: string;

  readonly installButton: string;
  readonly installBlurb: string;
  readonly installIOSHint: string;

  readonly viewProgress: string;
  /** Title and accessible name of the wordmark and the shell's home button. */
  readonly homeTitle: string;
  readonly back: string;
  readonly backHome: string;

  /*
   * Field labels of the add-a-word form, and nothing else any more: the class
   * asks a word for its meaning alone, so article, plural, participle and
   * auxiliary now appear only where the learner is entering a word of their
   * own. They are still needed there — the drill has to know what it was told.
   */
  readonly auxiliary: string;
  readonly article: string;
  readonly meaning: string;
  readonly participle: string;
  readonly plural: string;
  readonly verb: string;
  readonly noun: string;

  readonly streakDays: (n: number) => string;
  readonly reviewAgain: string;

  /* the profile */
  readonly profileTitle: string;
  readonly profileEyebrow: string;
  readonly profileHours: string;
  readonly profileDays: string;
  readonly profileClasses: string;
  readonly profileLongest: string;
  readonly calendarTitle: string;
  readonly calendarBlurb: string;
  readonly calendarLess: string;
  readonly calendarMore: string;
  readonly calendarDay: (date: string, minutes: number) => string;
  readonly calendarEmptyDay: (date: string) => string;
  /** Monday first: `calendarDays()` returns its weeks that way round. */
  readonly calendarWeekdays: readonly [string, string, string, string, string, string, string];
  readonly dayTitle: (date: string) => string;
  readonly dayNothing: string;
  readonly dayClasses: (n: number) => string;
  readonly dayClose: string;
  readonly mistakeWordsTitle: string;
  readonly mistakeCellsTitle: string;
  readonly mistakeNone: string;
  readonly mistakeBlurb: string;
  readonly colNo: string;
  readonly colYourAnswer: string;
  readonly colTimesWrong: string;
  readonly colDue: string;
  /** Rung of the book of errors: 0 → day 3, 1 → day 7, 2 → day 21. */
  readonly mistakeStage: (stage: number) => string;
  readonly endingEnded: string;
  readonly endingMidnight: string;
  readonly endingDropped: string;

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
  readonly signInWithGoogle: string;
  readonly orDivider: string;
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
  readonly voiceDisabled: string;
  readonly voiceMisconfigured: string;
  readonly voiceVoiceLabel: string;
  readonly voiceModeLabel: string;
  /* the learner's own Google AI key */
  readonly voiceKeyTitle: string;
  readonly voiceKeyBlurb: string;
  readonly voiceKeyWhere: string;
  readonly voiceKeyChecking: string;
  readonly voiceKeySet: (last4: string) => string;
  readonly voiceKeyNotSet: string;
  readonly voiceKeyPlaceholder: string;
  readonly voiceKeyReplacePlaceholder: string;
  readonly voiceKeySave: string;
  readonly voiceKeyRemove: string;
  readonly voiceKeySaved: string;
  readonly voiceKeyRemoved: string;
  readonly voiceKeyEmpty: string;
  readonly voiceKeyInvalid: string;
  readonly voiceKeyRequired: string;
  readonly voiceKeyOpenAccount: string;
  readonly aiKeyRejected: string;
  readonly voiceModes: readonly [string, string, string, string];
  readonly voiceModeHints: readonly [string, string, string, string];

  /* the tutor's status strip, now the classroom's */
  readonly tutorUnavailable: string;
  readonly tutorConnecting: string;
  readonly tutorAsking: string;
  readonly tutorListening: string;
  readonly tutorThinking: string;
  readonly tutorEnded: string;
  readonly tutorOff: string;
  readonly tutorRepeat: string;
  readonly tutorStop: string;

  /* the syllabus */
  readonly syllabusButton: string;
  readonly syllabusEyebrow: string;
  readonly syllabusTitle: string;
  readonly syllabusLede: string;
  readonly syllabusOpenFromLevel: string;
  readonly syllabusExam: string;
  readonly syllabusHours: string;
  readonly syllabusSectionsLabel: string;
  readonly syllabusSectionsCount: (n: number) => string;
  readonly syllabusSources: string;
  readonly syllabusCanDo: string;
  readonly syllabusGrammar: string;
  readonly syllabusVocab: string;
  readonly syllabusLinks: string;
  readonly syllabusYourLevel: string;
  readonly syllabusSearch: string;
  readonly syllabusVideo: string;
  readonly syllabusCourse: string;
  readonly syllabusReading: string;
  /** What a section holds for the class: words, table sentences, review topics. */
  readonly syllabusDrilled: (words: number, sentences: number, topics: number) => string;
  readonly syllabusNotDrilled: string;
  /** Shown in place of the plural of a noun that has none — "die Butter". */
  readonly syllabusNoPlural: string;

  /* videos and podcasts */
  readonly clipsTitle: string;
  readonly clipPlay: string;
  readonly clipWatchOn: (at: string) => string;
  readonly clipRange: (from: string, to: string) => string;
  readonly clipsNone: string;
  readonly mediaWhy: string;
  readonly mediaEvidence: string;
  readonly podcastsButton: string;
  readonly podcastsEyebrow: string;
  readonly podcastsTitle: string;
  readonly podcastsLede: string;
  readonly podcastsBackground: string;
  readonly podcastsShows: (level: string) => string;
  readonly podcastsNone: string;
  readonly podcastsNoEpisodes: string;
  readonly podcastsSection: string;
  readonly podcastPlay: string;
  readonly podcastPause: string;
  readonly podcastOpen: string;
  readonly playerBack: string;
  readonly playerForward: string;
  readonly playerClose: string;
  readonly playerSeek: string;
  readonly playerLoading: string;
  readonly playerError: string;

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
}

/**
 * The 3/7/21 ladder of the book of errors, spelled out for the profile.
 *
 * The numbers are written out here rather than imported from `MISTAKE_INTERVALS`
 * on purpose: i18n sits under everything — every screen and half the domain
 * imports it — and reaching up from here into `mistakes.ts` is how an import
 * cycle starts, at which point Vite hands one of the two modules a half-built
 * namespace and `t()` returns undefined at boot. The cost is that changing the
 * ladder means changing it twice; the guard is that both places say so.
 *
 * Anything past the last rung is answered "day 21" rather than left blank,
 * because `markMistake` retires an entry the moment it would need a fourth.
 */
function ladderDay(stage: number): number {
  if (stage <= 0) return 3;
  if (stage === 1) return 7;
  return 21;
}

const de: Strings = {
  tagline: "Täglich Deutsch · A1 → B2",
  greeting: (name) => (name ? `Guten Tag, ${name}.` : "Guten Tag."),
  lede:
    "Jeden Tag eine Stunde, in der gesprochen wird. Dein Lehrer fragt, korrigiert dich sofort und schreibt jeden Fehler auf — an Tag 3, Tag 7 und Tag 21 fragt er ihn wieder.",

  classStart: "Heutige Stunde beginnen",
  classResume: "Stunde fortsetzen",
  classStartMeta: (minutes, topic) => `ca. ${minutes} Min. · ${topic}`,
  classResumeMeta: (minutes, topic) => `schon ${minutes} Min. · ${topic}`,
  classUnavailable: "Die Stunde braucht ein Mikrofon und einen eingeschalteten Sprachmodus.",
  classPlanTitle: "Was heute dran ist",
  classPlanReviews: (n) => (n === 1 ? "1 alter Fehler" : `${n} alte Fehler`),
  classPlanWords: (n) => (n === 1 ? "1 Wort" : `${n} Wörter`),
  classPlanTables: (n) => (n === 1 ? "1 Tabelle" : `${n} Tabellen`),
  classPlanSentences: (n) => (n === 1 ? "1 Satz" : `${n} Sätze`),
  classPlanTalk: (minutes) => (minutes === 1 ? "1 Minute frei sprechen" : `${minutes} Minuten frei sprechen`),
  classPlanTopic: (topic) => `Thema heute: ${topic}`,
  classAutoClosed: (date) => `Deine Stunde vom ${date} lief noch. Um Mitternacht haben wir sie für dich geschlossen.`,
  classAutoClosedNote:
    "Gespeichert ist die Zeit, in der du wirklich im Unterricht warst — Pausen zählen nicht mit. Deine Antworten und deine Fehler sind alle da.",
  classAutoClosedSeen: "Alles klar",
  profileButton: "Dein Profil",

  classTitle: "Deine Deutschstunde",
  classHomeTitle: "Zur Startseite — die Stunde bleibt offen",
  classClockLabel: "Dauer der Stunde",
  classTranscriptLabel: "Mitschrift der Stunde",
  classJumpToLatest: "Zum Neuesten",
  classConnecting: "Dein Lehrer kommt gleich …",
  classListening: "Dein Lehrer hört zu — sprich los",
  classSpeaking: "Dein Lehrer spricht — unterbrich ihn ruhig",
  classThinking: "Einen Moment …",
  classPaused: "Pause — die Uhr steht",
  classEnded: "Die Stunde ist zu Ende",
  classBreak: "Pause",
  classResumeClass: "Weitermachen",
  classEnd: "Stunde beenden",
  classEndConfirm: "Die Stunde jetzt beenden? Danach siehst du die Zusammenfassung.",
  classRetry: "Noch einmal verbinden",
  classErrorTitle: "Die Verbindung ist weg",
  classCorrection: "Korrektur",
  classCorrectionSaid: "Du hast gesagt:",
  classCorrectionShould: "Richtig heißt es:",
  classNowTalk: "Gespräch",
  classNowVocab: "Wortschatz",
  classNowTable: "Tabelle",
  classNowSentence: "Satz",
  classNowReview: "Wiederholung",
  classProgress: (done, total) => `Schritt ${done} von ${total}`,

  classAskVocab: "Bedeutung",
  classAskTable: "Tabelle",
  classAskSentence: "Satz mit Lücke",
  classAskReview: "Schon mal falsch",
  classAnswerLabel: "Deine Antwort",
  classAnswerPlaceholderSay: "Sag es — oder tipp es hier",
  classAnswerPlaceholderType: "Tipp deine Antwort",
  classAnswerSend: "Antwort senden",
  classAnswerHint: "Sprich deine Antwort oder tipp sie — egal wie.",

  classSummaryEyebrow: "Zusammenfassung",
  classSummaryTitle: "Das war deine Stunde",
  classSummaryClean: "Heute alles richtig",
  classSummaryNothing: "Zu kurz zum Speichern",
  classSummaryDuration: (text) => `Du hast ${text} gesprochen.`,
  classSummaryDurationLabel: "gesprochen",
  classSummaryScore: (right, total) => `${right} von ${total} richtig`,
  classSummaryScoreLabel: "richtig",
  classSummaryShareLabel: "Trefferquote",
  classSummaryMidnight: "Diese Stunde hat niemand beendet — um Mitternacht haben wir sie geschlossen.",
  classSummaryCovered: "Das war heute dran",
  classSummaryMistakes: "Das ist heute schiefgegangen",
  classSummaryNoMistakes: "Heute kein einziger Fehler — es kommt nichts zurück.",
  classSummaryReturn: (n) =>
    n === 1
      ? "Das kommt an Tag 3, Tag 7 und Tag 21 wieder."
      : `Diese ${n} Punkte kommen an Tag 3, Tag 7 und Tag 21 wieder.`,
  classSummaryWords: "Wörter",
  classSummaryTables: "Tabellen",
  classSummaryGrammar: "Sätze",
  classSummaryCorrections: "Korrigierte Sätze",
  classSummarySection: (name) => `Thema: ${name}`,
  unitMinutes: "Min.",
  unitHours: "Std.",

  gridExample: "Beispiel",
  gridMalayalam: "മലയാളം",
  gridSectionTitle: "Tabellen auswendig",
  gridSecure: (done, total) => `${done} von ${total} Tabellen sitzen.`,
  gridMissedTitle: "Dein persönliches Wörterbuch",
  gridMissedEmpty: "Keine offenen Zellen — alles richtig beim letzten Mal.",
  gridStatusMastered: "sitzt",
  gridStatusDay: (n) => `Tag ${n} von 3`,
  gridStatusNew: "neu",

  installButton: "App installieren",
  installBlurb: "Auf den Startbildschirm — ohne Browserleiste, mit einem Tipp in die Stunde.",
  installIOSHint: "Installieren: Teilen-Symbol antippen → „Zum Home-Bildschirm“.",

  viewProgress: "Profil",
  homeTitle: "Zur Startseite",
  back: "Zurück",
  backHome: "Zur Startseite",

  auxiliary: "Hilfsverb",
  article: "Artikel",
  meaning: "Bedeutung (Englisch)",
  participle: "Partizip II",
  plural: "Plural",
  verb: "Verb",
  noun: "Nomen",

  streakDays: (n) => (n === 1 ? "1 Tag in Folge" : `${n} Tage in Folge`),
  reviewAgain: "Noch einmal ansehen",

  profileTitle: "Dein Profil",
  profileEyebrow: "Dein Deutsch bis heute",
  profileHours: "Stunden gelernt",
  profileDays: "Tage gelernt",
  profileClasses: "Einheiten",
  profileLongest: "längste Serie",
  calendarTitle: "Dein Jahr",
  calendarBlurb:
    "Ein Feld für jeden Tag. Je länger die Stunde, desto grüner — tipp auf ein Feld, und du siehst, was an dem Tag dran war.",
  calendarLess: "weniger",
  calendarMore: "mehr",
  calendarDay: (date, minutes) => `${date} — ${minutes} ${minutes === 1 ? "Minute" : "Minuten"} gelernt`,
  calendarEmptyDay: (date) => `${date} — keine Stunde`,
  calendarWeekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  dayTitle: (date) => `Am ${date}`,
  dayNothing: "An diesem Tag war keine Stunde.",
  dayClasses: (n) => (n === 1 ? "1 Einheit" : `${n} Einheiten`),
  dayClose: "Tag schließen",
  mistakeWordsTitle: "Wörter, die du falsch hattest",
  mistakeCellsTitle: "Tabellenzellen, die du falsch hattest",
  mistakeNone: "Dein Fehlerheft ist leer.",
  mistakeBlurb:
    "Alles hier kommt in der Stunde wieder: an Tag 3, an Tag 7 und an Tag 21. Dreimal richtig, dann ist es weg.",
  colNo: "Nr.",
  colYourAnswer: "deine Antwort",
  colTimesWrong: "falsch",
  colDue: "kommt wieder",
  mistakeStage: (stage) => `Tag ${ladderDay(stage)}`,
  endingEnded: "beendet",
  endingMidnight: "um Mitternacht geschlossen",
  endingDropped: "offen liegen geblieben",

  progressTitle: "Wo du stehst",
  lastRounds: "Letzte 14 Einheiten — Anteil richtiger Antworten.",
  vocabInDrill: "Vokabeln in Arbeit",
  reviewPlan: "Grammatikthemen und Wiederholungsplan",
  colWord: "Wort",
  colMeaning: "Bedeutung",
  colTwice: "2 ×",
  colLast: "zuletzt",
  colTopic: "Thema",
  colStage: "Stufe",
  colNextReview: "nächste Wiederholung",
  mastered: "gemeistert",
  inDrill: "in Arbeit",
  finished: "fertig",
  dueToday: "heute",
  overdueBy: (n) => (n === 1 ? "1 Tag überfällig" : `${n} Tage überfällig`),
  inDays: (n) => (n === 1 ? "in 1 Tag" : `in ${n} Tagen`),
  tablesSecure: (a, b) => `Tabellensätze sicher: ${a} von ${b}.`,
  intervals: "Intervalle: 1 · 3 · 7 · 21 · 35 Tage.",

  themeLabel: "Farbschema wechseln",
  langLabel: "Sprache",
  footer: "Daily Deutsch",
  noSessionsYet: "Noch keine Stunde abgeschlossen.",
  statStreak: "Tage in Folge",
  statMastered: "gemeistert",
  statAccuracy: "Trefferquote",

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
  removeWordConfirm: (word) => `„${word}“ aus deinen Wörtern entfernen?`,

  loading: "Einen Moment …",
  loginTitle: "Dein Deutsch. Jeden Tag.",
  loginBlurb:
    "Jeden Tag eine Stunde, in der gesprochen wird — und die sich merkt, was du falsch machst. Erstell ein Konto mit E-Mail und Passwort, dann folgt dir dein Fortschritt auf jedes Gerät.",
  loginPoints: [
    "Eine gesprochene Stunde am Tag, mit deinem Lehrer",
    "Jeder Fehler kommt an Tag 3, 7 und 21 zurück",
    "Dein Niveau, deine Themen — auf jedem Gerät"
  ],
  signInWithGoogle: "Mit Google anmelden",
  orDivider: "oder mit E-Mail",
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
  voiceDisabled: "Der Sprachmodus ist noch nicht eingeschaltet (VITE_VOICE_ENABLED).",
  voiceMisconfigured: "Dem Server fehlt eine Einstellung für den Sprachmodus.",
  voiceVoiceLabel: "Stimme",
  voiceModeLabel: "Übung",
  voiceKeyTitle: "Dein Google-AI-Schlüssel",
  voiceKeyBlurb: "Chat, Übersetzer und Sprachmodus laufen über deinen eigenen Google-Schlüssel — kostenlos für den Anfang, und nur du bezahlst, was du nutzt. Er wird geprüft, verschlüsselt gespeichert und nie wieder angezeigt.",
  voiceKeyWhere: "Schlüssel bei Google AI Studio holen ↗",
  voiceKeyChecking: "Wird geprüft …",
  voiceKeySet: (last4) => `Gespeichert · endet auf …${last4}`,
  voiceKeyNotSet: "Noch kein Schlüssel gespeichert.",
  voiceKeyPlaceholder: "Schlüssel hier einfügen",
  voiceKeyReplacePlaceholder: "Neuen Schlüssel einfügen, um den alten zu ersetzen",
  voiceKeySave: "Speichern",
  voiceKeyRemove: "Entfernen",
  voiceKeySaved: "Schlüssel geprüft und gespeichert.",
  voiceKeyRemoved: "Schlüssel entfernt.",
  voiceKeyEmpty: "Bitte zuerst einen Schlüssel einfügen.",
  voiceKeyInvalid: "Google hat diesen Schlüssel nicht akzeptiert.",
  voiceKeyRequired: "Dafür brauchst du deinen eigenen Google-AI-Schlüssel — einmal im Konto hinterlegen, dann gilt er für Chat, Übersetzer und Sprachmodus.",
  voiceKeyOpenAccount: "Schlüssel im Konto hinterlegen",
  aiKeyRejected: "Google hat deinen Schlüssel abgelehnt. Prüf ihn im Konto — vielleicht wurde er gelöscht oder das Limit ist erreicht.",
  voiceModes: ["Frei", "Teil 1", "Teil 2", "Teil 3"],
  voiceModeHints: [
    "Offenes Gespräch mit Korrekturen",
    "Einander kennenlernen — Prüfungssimulation",
    "Über ein Thema sprechen — Prüfungssimulation",
    "Gemeinsam etwas planen — Prüfungssimulation"
  ],

  tutorUnavailable: "Dafür brauchst du ein Mikrofon und einen eingeschalteten Sprachmodus.",
  tutorConnecting: "Dein Lehrer kommt an den Apparat …",
  tutorAsking: "Dein Lehrer spricht — hör zu",
  tutorListening: "Sag deine Antwort",
  tutorThinking: "Einen Moment …",
  tutorEnded: "Der Lehrer hat aufgelegt. Du kannst ihn zurückholen.",
  tutorOff: "Lehrer aus",
  tutorRepeat: "Frage noch einmal hören",
  tutorStop: "Stimme beenden",

  syllabusButton: "Lehrplan",
  syllabusEyebrow: "Lehrplan A1 – B2",
  syllabusTitle: "Was du lernst",
  syllabusLede:
    "Jedes Niveau in zwölf Themen: was du danach kannst, welche Grammatik dazugehört, die wichtigsten Wörter — und wo du es erklärt hörst. Nach den Prüfungszielen von Goethe-Institut und telc.",
  syllabusOpenFromLevel: "Was lernt man auf jedem Niveau? Zum Lehrplan",
  syllabusExam: "Prüfungen",
  syllabusHours: "Unterrichtsstunden",
  syllabusSectionsLabel: "Themen",
  syllabusSectionsCount: (n) => `${n} Themen`,
  syllabusSources: "Quellen & Kurse",
  syllabusCanDo: "Das kannst du danach",
  syllabusGrammar: "Grammatik",
  syllabusVocab: "Wichtige Wörter",
  syllabusLinks: "Videos & mehr",
  syllabusYourLevel: "dein Niveau",
  syllabusSearch: "Suche",
  syllabusVideo: "Video",
  syllabusCourse: "Kurs",
  syllabusReading: "Lesen",
  syllabusDrilled: (words, sentences, topics) =>
    `im Unterricht: ${words} Wörter · ${sentences} Sätze · ${topics} ${topics === 1 ? "Wiederholung" : "Wiederholungen"}`,
  syllabusNotDrilled: "noch nicht im Unterricht",
  syllabusNoPlural: "kein Plural",

  clipsTitle: "Videos zum Thema",
  clipPlay: "Ausschnitt abspielen",
  clipWatchOn: (at) => `Auf YouTube ab ${at} ansehen`,
  clipRange: (from, to) => `${from} – ${to}`,
  clipsNone: "Noch keine geprüften Videos zu diesem Thema.",
  mediaWhy: "Was der Ausschnitt zeigt",
  mediaEvidence: "Warum empfohlen",
  podcastsButton: "Podcasts",
  podcastsEyebrow: "Podcasts A1 – B2",
  podcastsTitle: "Hören, wo du gerade bist",
  podcastsLede:
    "Die Podcasts, die für dein Niveau am häufigsten empfohlen werden — und zu jedem Thema des Lehrplans die passende Folge, direkt hier abspielbar.",
  podcastsBackground: "Läuft weiter, wenn das Handy gesperrt ist — solange die App offen bleibt. Steuerung auf dem Sperrbildschirm.",
  podcastsShows: (level) => `Die Podcasts für ${level}`,
  podcastsNone: "Für dieses Niveau sind noch keine Podcasts geprüft.",
  podcastsNoEpisodes: "Noch keine Folgen zu den Themen dieses Niveaus.",
  podcastsSection: "Zum Thema",
  podcastPlay: "Abspielen",
  podcastPause: "Pause",
  podcastOpen: "Folge auf der Website",
  playerBack: "15 Sekunden zurück",
  playerForward: "15 Sekunden vor",
  playerClose: "Player schließen",
  playerSeek: "Position",
  playerLoading: "Lädt …",
  playerError: "Die Folge konnte nicht geladen werden.",

  signIn: "Anmelden",
  signOut: "Abmelden",
  account: "Konto",
  signInTitle: "Fortschritt überall",
  emailLabel: "E-Mail",
  emailPlaceholder: "du@beispiel.de",
  badEmail: "Diese E-Mail-Adresse sieht nicht richtig aus.",
  signInFailed: "Das hat nicht geklappt. Versuch es bitte noch einmal.",
  syncedAs: (who) => `angemeldet als ${who}`
};

const en: Strings = {
  tagline: "Daily German · A1 → B2",
  greeting: (name) => (name ? `Good day, ${name}.` : "Good day."),
  lede:
    "One spoken class a day. Your teacher asks, corrects you on the spot and writes down every mistake — then puts it to you again on day 3, day 7 and day 21.",

  classStart: "Start today's class",
  classResume: "Continue your class",
  classStartMeta: (minutes, topic) => `about ${minutes} min · ${topic}`,
  classResumeMeta: (minutes, topic) => `${minutes} min already · ${topic}`,
  classUnavailable: "A class needs a microphone and the voice mode switched on.",
  classPlanTitle: "What today holds",
  classPlanReviews: (n) => (n === 1 ? "1 thing you got wrong before" : `${n} things you got wrong before`),
  classPlanWords: (n) => (n === 1 ? "1 word" : `${n} words`),
  classPlanTables: (n) => (n === 1 ? "1 grammar table" : `${n} grammar tables`),
  classPlanSentences: (n) => (n === 1 ? "1 sentence" : `${n} sentences`),
  classPlanTalk: (minutes) => (minutes === 1 ? "1 minute of conversation" : `${minutes} minutes of conversation`),
  classPlanTopic: (topic) => `Today's theme: ${topic}`,
  classAutoClosed: (date) => `Your class from ${date} was still running. We closed it for you at midnight.`,
  classAutoClosedNote:
    "What is saved is the time you were really in the room — breaks do not count. Your answers and your mistakes are all there.",
  classAutoClosedSeen: "Got it",
  profileButton: "Your profile",

  classTitle: "Your German class",
  classHomeTitle: "Back to home — the class stays open",
  classClockLabel: "Time in class",
  classTranscriptLabel: "Transcript of the class",
  classJumpToLatest: "Jump to the latest",
  classConnecting: "Your teacher will be with you in a moment …",
  classListening: "Your teacher is listening — go ahead",
  classSpeaking: "Your teacher is speaking — cut in any time",
  classThinking: "One moment …",
  classPaused: "On a break — the clock has stopped",
  classEnded: "The class is over",
  classBreak: "Break",
  classResumeClass: "Carry on",
  classEnd: "End class",
  classEndConfirm: "End the class now? You'll get the summary straight away.",
  classRetry: "Try connecting again",
  classErrorTitle: "The connection has dropped",
  classCorrection: "Correction",
  classCorrectionSaid: "You said:",
  classCorrectionShould: "It should be:",
  classNowTalk: "Conversation",
  classNowVocab: "Vocabulary",
  classNowTable: "Grammar table",
  classNowSentence: "Sentence",
  classNowReview: "Review",
  classProgress: (done, total) => `Step ${done} of ${total}`,

  classAskVocab: "Meaning",
  classAskTable: "Grammar table",
  classAskSentence: "Sentence with a gap",
  classAskReview: "Wrong before",
  classAnswerLabel: "Your answer",
  classAnswerPlaceholderSay: "Say it — or type it here",
  classAnswerPlaceholderType: "Type your answer",
  classAnswerSend: "Send answer",
  classAnswerHint: "Say your answer or type it — either way.",

  classSummaryEyebrow: "Summary",
  classSummaryTitle: "That's today's class",
  classSummaryClean: "Everything right today",
  classSummaryNothing: "Too short to keep",
  classSummaryDuration: (text) => `You spoke for ${text}.`,
  classSummaryDurationLabel: "spoken",
  classSummaryScore: (right, total) => `${right} of ${total} correct`,
  classSummaryScoreLabel: "right",
  classSummaryShareLabel: "accuracy",
  classSummaryMidnight: "Nobody ended this class — we closed it at midnight.",
  classSummaryCovered: "What we covered",
  classSummaryMistakes: "What went wrong today",
  classSummaryNoMistakes: "Not a single mistake today — nothing comes back.",
  classSummaryReturn: (n) =>
    n === 1
      ? "It comes back on day 3, day 7 and day 21."
      : `These ${n} come back on day 3, day 7 and day 21.`,
  classSummaryWords: "Words",
  classSummaryTables: "Grammar tables",
  classSummaryGrammar: "Sentences",
  classSummaryCorrections: "Sentences put right",
  classSummarySection: (name) => `Theme: ${name}`,
  unitMinutes: "min",
  unitHours: "h",

  gridExample: "Example",
  gridMalayalam: "മലയാളം",
  gridSectionTitle: "Tables by heart",
  gridSecure: (done, total) => `${done} of ${total} tables secure.`,
  gridMissedTitle: "Your personal dictionary",
  gridMissedEmpty: "No open cells — everything was right last time.",
  gridStatusMastered: "secure",
  gridStatusDay: (n) => `day ${n} of 3`,
  gridStatusNew: "new",

  installButton: "Install app",
  installBlurb: "On your home screen — no browser bar, one tap into the class.",
  installIOSHint: "To install: tap the Share icon → Add to Home Screen.",

  viewProgress: "Profile",
  homeTitle: "Back to the home screen",
  back: "Back",
  backHome: "Back to home",

  auxiliary: "Auxiliary verb",
  article: "Article",
  meaning: "Meaning (English)",
  participle: "Past participle",
  plural: "Plural",
  verb: "Verb",
  noun: "Noun",

  streakDays: (n) => (n === 1 ? "1 day in a row" : `${n} days in a row`),
  reviewAgain: "Worth another look",

  profileTitle: "Your profile",
  profileEyebrow: "Your German so far",
  profileHours: "hours studied",
  profileDays: "days studied",
  profileClasses: "classes",
  profileLongest: "longest run",
  calendarTitle: "Your year",
  calendarBlurb:
    "One square for every day. The longer the class, the greener the square — tap one to see what that day held.",
  calendarLess: "less",
  calendarMore: "more",
  calendarDay: (date, minutes) => `${date} — ${minutes} ${minutes === 1 ? "minute" : "minutes"} studied`,
  calendarEmptyDay: (date) => `${date} — no class`,
  calendarWeekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  dayTitle: (date) => `On ${date}`,
  dayNothing: "There was no class that day.",
  dayClasses: (n) => (n === 1 ? "1 class" : `${n} classes`),
  dayClose: "Close the day",
  mistakeWordsTitle: "Words you got wrong",
  mistakeCellsTitle: "Table cells you got wrong",
  mistakeNone: "Your book of errors is empty.",
  mistakeBlurb:
    "Everything here comes back in class: on day 3, on day 7 and on day 21. Right three times and it is gone.",
  colNo: "No.",
  colYourAnswer: "your answer",
  colTimesWrong: "times wrong",
  colDue: "comes back",
  mistakeStage: (stage) => `day ${ladderDay(stage)}`,
  endingEnded: "ended",
  endingMidnight: "closed at midnight",
  endingDropped: "left open",

  progressTitle: "Where you stand",
  lastRounds: "Last 14 classes — share of correct answers.",
  vocabInDrill: "Vocabulary in progress",
  reviewPlan: "Grammar topics and review schedule",
  colWord: "Word",
  colMeaning: "Meaning",
  colTwice: "2 ×",
  colLast: "last seen",
  colTopic: "Topic",
  colStage: "Stage",
  colNextReview: "next review",
  mastered: "mastered",
  inDrill: "in progress",
  finished: "finished",
  dueToday: "today",
  overdueBy: (n) => (n === 1 ? "1 day overdue" : `${n} days overdue`),
  inDays: (n) => (n === 1 ? "in 1 day" : `in ${n} days`),
  tablesSecure: (a, b) => `Table sentences secure: ${a} of ${b}.`,
  intervals: "Intervals: 1 · 3 · 7 · 21 · 35 days.",

  themeLabel: "Switch colour scheme",
  langLabel: "Language",
  footer: "Daily Deutsch",
  noSessionsYet: "No class completed yet.",
  statStreak: "day streak",
  statMastered: "mastered",
  statAccuracy: "accuracy",

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
  removeWordConfirm: (word) => `Remove "${word}" from your words?`,

  loading: "One moment …",
  loginTitle: "Your German. Every day.",
  loginBlurb:
    "A class a day that you talk your way through — and that remembers what you get wrong. Create an account with your email and a password, and your progress follows you to every device.",
  loginPoints: [
    "One spoken class a day, with your teacher",
    "Every mistake comes back on day 3, 7 and 21",
    "Your level, your topics — on every device"
  ],
  signInWithGoogle: "Sign in with Google",
  orDivider: "or with e-mail",
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
  voiceDisabled: "Voice mode is not switched on yet (VITE_VOICE_ENABLED).",
  voiceMisconfigured: "The server is missing a setting voice mode needs.",
  voiceVoiceLabel: "Voice",
  voiceModeLabel: "Practice",
  voiceKeyTitle: "Your Google AI key",
  voiceKeyBlurb: "Chat, translator and voice all run on your own Google key — free to start, and only you pay for what you use. It is checked, stored encrypted, and never shown again.",
  voiceKeyWhere: "Get a key at Google AI Studio ↗",
  voiceKeyChecking: "Checking …",
  voiceKeySet: (last4) => `Saved · ends in …${last4}`,
  voiceKeyNotSet: "No key saved yet.",
  voiceKeyPlaceholder: "Paste your key here",
  voiceKeyReplacePlaceholder: "Paste a new key to replace the old one",
  voiceKeySave: "Save",
  voiceKeyRemove: "Remove",
  voiceKeySaved: "Key checked and saved.",
  voiceKeyRemoved: "Key removed.",
  voiceKeyEmpty: "Paste a key first.",
  voiceKeyInvalid: "Google did not accept that key.",
  voiceKeyRequired: "This needs your own Google AI key — add it once in Account and it covers chat, translator and voice.",
  voiceKeyOpenAccount: "Add a key in Account",
  aiKeyRejected: "Google rejected your key. Check it in Account — it may have been deleted, or hit its limit.",
  voiceModes: ["Free", "Teil 1", "Teil 2", "Teil 3"],
  voiceModeHints: [
    "Open conversation with corrections",
    "Getting to know each other — exam simulation",
    "Talking about a topic — exam simulation",
    "Planning something together — exam simulation"
  ],

  tutorUnavailable: "This needs a microphone and the voice mode switched on.",
  tutorConnecting: "Getting your teacher on the line …",
  tutorAsking: "Your teacher is speaking — listen",
  tutorListening: "Say your answer",
  tutorThinking: "One moment …",
  tutorEnded: "Your teacher has hung up. You can call again.",
  tutorOff: "Teacher off",
  tutorRepeat: "Hear the question again",
  tutorStop: "Stop the voice",

  syllabusButton: "Syllabus",
  syllabusEyebrow: "Syllabus A1 – B2",
  syllabusTitle: "What you'll learn",
  syllabusLede:
    "Each level in twelve topics: what you can do afterwards, the grammar that goes with it, the words that matter — and where to hear it taught. Built on the Goethe-Institut and telc exam objectives.",
  syllabusOpenFromLevel: "What does each level cover? See the syllabus",
  syllabusExam: "Exams",
  syllabusHours: "Teaching hours",
  syllabusSectionsLabel: "Topics",
  syllabusSectionsCount: (n) => `${n} topics`,
  syllabusSources: "Sources & courses",
  syllabusCanDo: "What you can do afterwards",
  syllabusGrammar: "Grammar",
  syllabusVocab: "Key words",
  syllabusLinks: "Videos & more",
  syllabusYourLevel: "your level",
  syllabusSearch: "Search",
  syllabusVideo: "Video",
  syllabusCourse: "Course",
  syllabusReading: "Read",
  syllabusDrilled: (words, sentences, topics) =>
    `in class: ${words} words · ${sentences} sentences · ${topics} review ${topics === 1 ? "topic" : "topics"}`,
  syllabusNotDrilled: "not taught yet",
  syllabusNoPlural: "no plural",

  clipsTitle: "Videos on this topic",
  clipPlay: "Play the clip",
  clipWatchOn: (at) => `Watch on YouTube from ${at}`,
  clipRange: (from, to) => `${from} – ${to}`,
  clipsNone: "No verified videos for this topic yet.",
  mediaWhy: "What the clip covers",
  mediaEvidence: "Why it's recommended",
  podcastsButton: "Podcasts",
  podcastsEyebrow: "Podcasts A1 – B2",
  podcastsTitle: "Listen at your level",
  podcastsLede:
    "The podcasts most often recommended for your level — and for every topic of the syllabus, the episode that fits, playable right here.",
  podcastsBackground: "Keeps playing when the phone is locked, as long as the app stays open. Controls on the lock screen.",
  podcastsShows: (level) => `The podcasts for ${level}`,
  podcastsNone: "No podcasts verified for this level yet.",
  podcastsNoEpisodes: "No episodes for this level's topics yet.",
  podcastsSection: "On this topic",
  podcastPlay: "Play",
  podcastPause: "Pause",
  podcastOpen: "Episode on the website",
  playerBack: "Back 15 seconds",
  playerForward: "Forward 15 seconds",
  playerClose: "Close the player",
  playerSeek: "Position",
  playerLoading: "Loading …",
  playerError: "The episode could not be loaded.",

  signIn: "Sign in",
  signOut: "Sign out",
  account: "Account",
  signInTitle: "Your progress, everywhere",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  badEmail: "That email address doesn't look right.",
  signInFailed: "That didn't work. Please try again.",
  syncedAs: (who) => `signed in as ${who}`
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
