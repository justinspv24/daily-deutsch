/**
 * Turning what the learner *said* into what they answered.
 *
 * A typed answer is already an answer: the field contains "der" because that
 * is what was typed. Speech is not like that. Asked for an article, a learner
 * says "ähm, ich glaube der", "das ist der Lehrer", or simply "der" — and all
 * three are the same answer. Transcription also adds punctuation nobody spoke.
 *
 * So everything heard passes through here before it reaches the grader, and
 * the grader itself is left exactly as it was. That split matters: leniency
 * that belongs to *speech* must not quietly become leniency that applies to
 * typing too, where a learner who writes "das ist der Lehrer" really has
 * answered the wrong thing.
 *
 * The rule throughout: strip what is certainly not part of the answer, and
 * never invent what was not said.
 */

/** What a field is asking for, which decides how a spoken answer is read. */
export type Expects = "article" | "aux" | "english" | "german" | "none";

/**
 * Spoken padding around an answer.
 *
 * Every word here had to survive one question: could a learner ever be *asked*
 * for it? Several obvious fillers could not stay. "er" and "um" read as
 * hesitation in English and are hesitation in German too, but they are also a
 * personal pronoun and an accusative preposition — both of them cells in
 * tables this app drills. Stripping them would have deleted the right answer
 * and marked it wrong, on exactly the questions where saying a single short
 * word is the whole point. "so", "nun" and "ja" went for the same reason.
 *
 * What is left is hesitation that is never an answer to anything.
 */
const OPENERS: readonly RegExp[] = [
  /^(?:ähm|ähh|äh|hmm|also|na ja|naja|okay|tja)\b[\s,]*/iu,
  /^(?:ich (?:glaube|denke|meine|sage|würde sagen)|glaube ich|vielleicht)\b[\s,]*/iu,
  /^(?:die antwort (?:ist|lautet)|es (?:ist|heißt)|das (?:ist|heißt)|man sagt)\b[\s,]*/iu,
  /^(?:uh|erm|well|i think|i guess|i'd say|it(?:'s| is)|the answer is|maybe)\b[\s,]*/iu
];

/** Trailing politeness and self-doubt, which are not part of the answer either. */
const CLOSERS: readonly RegExp[] = [
  /[\s,]*\b(?:glaube ich|denke ich|oder\??|richtig\??|stimmt(?:'s)?\??)$/iu,
  /[\s,]*\b(?:i think|i guess|right\??|maybe)$/iu
];

/**
 * Strip hesitation, lead-ins and stray punctuation. Applied repeatedly,
 * because "also, ähm, ich glaube der" stacks three of them.
 */
export function cleanSpoken(input: string): string {
  let text = input.replace(/\s+/gu, " ").trim();

  for (let pass = 0; pass < 4; pass += 1) {
    const before = text;
    for (const opener of OPENERS) text = strip(text, opener);
    for (const closer of CLOSERS) text = strip(text, closer);
    text = text.replace(/^[\s,.;:!?–—-]+|[\s,.;:!?–—-]+$/gu, "").trim();
    if (text === before) break;
  }
  return text;
}

/**
 * Take the padding off, unless there would be nothing left.
 *
 * The backstop for the judgement call above: a learner whose entire answer is
 * one word that happens to look like a filler has still answered, and an empty
 * string is always wrong. "Richtig?" said on its own is an answer to a
 * question about adjectives; it is only hedging when something precedes it.
 */
function strip(text: string, pattern: RegExp): string {
  const next = text.replace(pattern, "").trim();
  return next ? next : text;
}

const ARTICLES = ["der", "die", "das"] as const;
const AUXILIARIES = ["sein", "haben"] as const;

/**
 * Pull one word out of a spoken phrase when the question only ever has a
 * handful of possible answers. "das ist der Lehrer" is the article *der*, and
 * hearing it that way is what a teacher does.
 *
 * Only ever applied where the answer set is closed and tiny, so there is no
 * room for it to pick up a word that happened to be lying around: an article
 * question cannot be answered with anything but der, die or das.
 */
function firstOf(words: readonly string[], text: string): string | null {
  for (const token of text.toLowerCase().split(/[^\p{L}]+/u)) {
    if ((words as readonly string[]).includes(token)) return token;
  }
  return null;
}

/**
 * The one accepted answer that appears, whole, in a longer spoken phrase.
 *
 * Asked what goes in "Ich gehe mit ___ Mann", a learner very often answers by
 * saying the whole sentence. They have answered — the word is in there — and a
 * teacher would hear it. This finds it, but only when *exactly one* accepted
 * answer is present: if two are, the learner has hedged rather than answered,
 * and the phrase is handed on unchanged for the grader to reject.
 */
function soleMatch(text: string, accepted: readonly string[]): string | null {
  const haystack = ` ${text.toLowerCase()} `;
  const hits = new Set<string>();

  for (const candidate of accepted) {
    const needle = candidate.trim().toLowerCase();
    if (!needle) continue;
    // Whole words only: "dem" must not match inside "demnach".
    const pattern = new RegExp(
      `(?:^|[^\\p{L}])${escapeRegExp(needle)}(?:[^\\p{L}]|$)`,
      "u"
    );
    if (pattern.test(haystack)) hits.add(needle);
  }
  if (hits.size !== 1) return null;

  const [only] = [...hits];
  // Give back the accepted spelling, not the transcript's: speech recognition
  // is inconsistent about capitals, and the grader folds case anyway.
  return accepted.find((candidate) => candidate.trim().toLowerCase() === only) ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

/**
 * What the learner answered, as the grader should see it.
 *
 * `accepted` is used only to recognise an answer buried in a spoken sentence.
 * It never adds an answer that was not said, so a learner who says nothing
 * useful still gets it wrong — which is the whole point of asking.
 */
export function readSpokenAnswer(
  heard: string,
  expects: Expects,
  accepted: readonly string[] = []
): string {
  const text = cleanSpoken(heard);
  if (!text) return "";

  if (expects === "article") return firstOf(ARTICLES, text) ?? text;
  if (expects === "aux") return firstOf(AUXILIARIES, text) ?? text;

  // A single word is already the answer; looking inside it can only go wrong.
  const words = text.split(/\s+/u);
  if (words.length === 1) return text;

  if (expects === "german") return soleMatch(text, accepted) ?? text;

  // English meanings are graded generously enough that a spoken sentence
  // usually lands on its own; a match is still worth preferring when there is
  // one, because it is the shortest true reading of what was said.
  if (expects === "english") return soleMatch(text, accepted) ?? text;

  return text;
}
