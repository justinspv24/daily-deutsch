/**
 * Tests the storage layer without a database: normalisation against changing
 * content, and the merge that runs the first time an anonymous visitor signs
 * in. Getting that merge wrong silently destroys someone's streaks, so it is
 * the one piece of logic here worth pinning down hard.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));

const bundled = await build({
  entryPoints: [resolve(here, "../src/repository.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  write: false,
  logLevel: "silent",
  loader: { ".css": "empty" },
  define: {
    "import.meta.env": JSON.stringify({})
  }
});

const module = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
);
const { emptyProgress, normalise, mergeProgress } = module;

/* --------------------------------------------------------- normalisation */

const fresh = emptyProgress();
assert.ok(Object.keys(fresh.vocab).length >= 3, "vocabulary is seeded");
assert.ok(Object.keys(fresh.grammar).length >= 30, "grammar bank is seeded");
assert.ok(Object.keys(fresh.topics).length >= 9, "topics are seeded");
assert.equal(fresh.sessions.length, 0, "a new learner has no history");

const partial = normalise({
  vocab: { v_arzt: { streak: 2, seen: 9, lastDate: "2026-09-01" } },
  sessions: [{ date: "2026-09-01", right: 5, total: 6 }, { nonsense: true }]
});
assert.equal(partial.vocab.v_arzt.streak, 2, "known state is kept");
assert.ok("v_aufwachen" in partial.vocab, "unseen words are filled in from the content");
assert.equal(partial.sessions.length, 1, "malformed session rows are dropped");

const junk = normalise("not an object");
assert.deepEqual(Object.keys(junk.vocab), Object.keys(fresh.vocab), "junk falls back to defaults");

/* ---------------------------------------------------- merge on sign-in -- */

const local = emptyProgress();
local.vocab.v_arzt = { streak: 2, seen: 6, lastDate: "2026-09-04" };
local.vocab.v_aerztin = { streak: 0, seen: 3, lastDate: "2026-09-04" };
local.grammar.g1a = { streak: 1, seen: 4 };
local.topics.t1 = { stage: 3, due: "2026-09-20", lastDate: "2026-09-04" };
local.topics.t2 = { stage: 0, due: "2026-09-05", lastDate: null };
local.sessions = [
  { date: "2026-09-03", right: 8, total: 10 },
  { date: "2026-09-04", right: 9, total: 10 }
];

const remote = emptyProgress();
remote.vocab.v_arzt = { streak: 1, seen: 4, lastDate: "2026-09-02" };
remote.vocab.v_aerztin = { streak: 2, seen: 8, lastDate: "2026-09-02" };
remote.grammar.g1a = { streak: 0, seen: 11 };
remote.topics.t1 = { stage: 1, due: "2026-09-06", lastDate: "2026-09-02" };
remote.topics.t2 = { stage: 4, due: "2026-10-01", lastDate: "2026-09-02" };
remote.sessions = [
  { date: "2026-09-01", right: 4, total: 10 },
  { date: "2026-09-03", right: 8, total: 10 }
];

const merged = mergeProgress(local, remote);

// Nobody loses ground: the better streak on each side survives.
assert.equal(merged.vocab.v_arzt.streak, 2, "the local streak wins when it is further along");
assert.equal(merged.vocab.v_aerztin.streak, 2, "the remote streak wins when it is further along");
assert.equal(merged.vocab.v_arzt.seen, 10, "practice counts add up across devices");
assert.equal(merged.vocab.v_arzt.lastDate, "2026-09-04", "the later date is kept");
assert.equal(merged.grammar.g1a.streak, 1, "grammar streaks take the better side");
assert.equal(merged.grammar.g1a.seen, 15, "grammar counts add up");

// A topic's due date has to follow the stage it came from, or the schedule lies.
assert.equal(merged.topics.t1.stage, 3, "the higher review stage wins");
assert.equal(merged.topics.t1.due, "2026-09-20", "and its own due date comes with it");
assert.equal(merged.topics.t2.stage, 4, "the same in the other direction");
assert.equal(merged.topics.t2.due, "2026-10-01", "with the matching due date");

// History is a union, not a concatenation: the shared day appears once.
assert.equal(merged.sessions.length, 3, "duplicate rounds are not counted twice");
assert.deepEqual(
  merged.sessions.map((s) => s.date),
  ["2026-09-01", "2026-09-03", "2026-09-04"],
  "history ends up in order"
);

// Merging is safe to repeat — signing in twice must not inflate anything.
const again = mergeProgress(emptyProgress(), merged);
assert.equal(again.sessions.length, 3, "re-merging an empty local side changes nothing");
assert.equal(again.vocab.v_arzt.streak, 2, "streaks survive a second merge");
assert.equal(again.vocab.v_arzt.seen, 10, "counts are not doubled by a second merge");

console.log("✓ repository test passed — normalisation, merge-on-sign-in, idempotence");
