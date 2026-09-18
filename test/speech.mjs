/**
 * Tests the one piece of the spoken drill that has to be right every time: how
 * a sentence somebody said becomes the answer that gets graded.
 *
 * It is worth pinning down because it sits between speech and a schedule. Read
 * an answer too generously and a learner is marked right for saying something
 * else, the word leaves the drill after two such rounds, and they never see it
 * again. Too strictly and a correct answer is marked wrong and comes back for
 * a week. Neither failure announces itself — the learner just quietly ends up
 * with the wrong words in front of them.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));

const bundled = await build({
  entryPoints: [resolve(here, "../src/speech.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  write: false,
  logLevel: "silent"
});

const { cleanSpoken, readSpokenAnswer } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
);

/* ------------------------------------------------------------- the padding */

assert.equal(cleanSpoken("der"), "der", "a bare answer is left alone");
assert.equal(cleanSpoken("  der.  "), "der", "punctuation nobody spoke is dropped");
assert.equal(cleanSpoken("ähm, ich glaube der"), "der", "hesitation and hedging come off");
assert.equal(cleanSpoken("also, die Antwort ist der"), "der", "so does announcing the answer");
assert.equal(cleanSpoken("der, glaube ich"), "der", "and doubt tacked on the end");
assert.equal(cleanSpoken("I think the answer is doctor"), "doctor", "English padding too");
assert.equal(cleanSpoken(""), "", "silence stays silence");

/* ------------------------------------------- fillers that are also answers */

// The tables drill "er" as a personal pronoun and "um" as an accusative
// preposition. Both read as hesitation, and both are the whole answer to
// questions this app asks — so neither may ever be treated as padding.
assert.equal(readSpokenAnswer("er", "german", ["er"]), "er", "er is a pronoun, not a stumble");
assert.equal(readSpokenAnswer("um", "german", ["um"]), "um", "um is a preposition, not a stumble");
assert.equal(readSpokenAnswer("so", "german", ["so"]), "so");
assert.equal(cleanSpoken("ähm"), "ähm", "padding is only padding when an answer follows it");

/* ------------------------------------------------------- closed-set answers */

assert.equal(readSpokenAnswer("das ist der Lehrer", "article", ["der"]), "der");
assert.equal(readSpokenAnswer("die", "article", ["die"]), "die");
assert.equal(readSpokenAnswer("ähm ... das", "article", ["das"]), "das");
assert.equal(readSpokenAnswer("mit haben", "aux", ["haben"]), "haben");
assert.equal(readSpokenAnswer("sein", "aux", ["sein"]), "sein");

// Nothing from the closed set was said, so nothing is invented: the phrase
// goes to the grader as it was heard, and is marked wrong there.
assert.equal(readSpokenAnswer("keine Ahnung", "article", ["der"]), "keine Ahnung");

/* ---------------------------------------------------- answers in a sentence */

assert.equal(
  readSpokenAnswer("Ich gehe mit dem Mann", "german", ["dem"]),
  "dem",
  "the missing word is heard inside the whole sentence"
);
assert.equal(
  readSpokenAnswer("die Ärzte", "german", ["die Ärzte", "Ärzte"]),
  "die Ärzte",
  "a plural said with its article is the answer, not a sentence to search"
);
assert.equal(
  readSpokenAnswer("aufgewacht", "german", ["aufgewacht"]),
  "aufgewacht",
  "one word is already the answer"
);

// Hedging is not answering. Two accepted answers in one breath goes through
// untouched so the grader rejects it, rather than being read as whichever came
// first — a learner who says "dem oder den" has not chosen.
assert.equal(
  readSpokenAnswer("vielleicht dem oder den", "german", ["dem", "den"]),
  "dem oder den",
  "hedging between two accepted answers is not an answer"
);

// A whole word, not a fragment of one.
assert.equal(
  readSpokenAnswer("das gilt demnach immer", "german", ["dem"]),
  "das gilt demnach immer",
  "an answer buried inside a longer word does not count"
);

/* ------------------------------------------------------------- the meanings */

assert.equal(readSpokenAnswer("to wake up", "english", ["to wake up"]), "to wake up");
assert.equal(
  readSpokenAnswer("I think it means doctor", "english", ["doctor"]),
  "doctor",
  "an English meaning is heard inside a spoken sentence"
);

console.log("speech: ok");
