/**
 * The spoken class, without a microphone.
 *
 *   npm test
 *
 * The typed round used to be smoke-tested through a real DOM: a JSDOM page,
 * a keyboard, a full round played twice. A spoken class cannot be tested that
 * way — there is no keyboard, and the half of it that talks needs a live
 * socket to Google — so what is guarded here instead is everything the drill
 * test was really protecting: the schedule, the marking and the clock.
 *
 * Those all live in DOM-free modules on purpose, exactly so that this file can
 * exist. If class logic ever moves into `src/ui/classroom.ts`, it stops being
 * testable and this suite quietly stops covering it.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * One bundle re-exporting everything under test. A synthetic entry point
 * rather than five separate bundles, so the modules share one copy of the
 * content banks and one copy of `Progress` — which is how they run in the app,
 * and the only way a test of `scoreClass` can hand its result to `mistakes`.
 */
async function load() {
  const bundled = await build({
    stdin: {
      contents: `
        export * from "./src/agenda.ts";
        export * from "./src/classscore.ts";
        export * from "./src/liveclass.ts";
        export * from "./src/mistakes.ts";
        export * from "./src/profile.ts";
        export * from "./src/repository.ts";
        export * from "./src/scheduler.ts";
      `,
      resolveDir: resolve(here, ".."),
      loader: "ts"
    },
    bundle: true,
    format: "esm",
    target: "es2022",
    write: false,
    logLevel: "silent",
    loader: { ".css": "empty" },
    define: { "import.meta.env": JSON.stringify({}) }
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
  );
}

const m = await load();
const {
  addDays,
  agendaFromPlan,
  buildAgenda,
  calendarDays,
  closeLive,
  closeStaleClass,
  emptyProgress,
  mergeProgress,
  normalise,
  bankTime,
  dueMistakes,
  liveSeconds,
  markMistake,
  MISTAKE_INTERVALS,
  noteAnswer,
  pauseLive,
  planOf,
  profileTotals,
  rememberMistake,
  resumeLive,
  scoreClass,
  shadeFor,
  startLive,
  todayISO,
  worthKeeping
} = m;

const TODAY = todayISO();
const day = (n) => addDays(TODAY, n);

/* ------------------------------------------------------- 1. the ladder */

{
  const p = emptyProgress("A2");
  const seed = {
    kind: "vocab",
    ref: "v_reise:meaning",
    subject: "die Reise",
    gloss: "trip",
    prompt: "Was heißt „die Reise“ auf Englisch?",
    expected: "trip",
    accepted: ["trip", "journey"],
    expects: "english",
    given: "travel"
  };

  const entry = rememberMistake(p, seed, TODAY);
  assert.equal(entry.due, day(3), "a fresh mistake comes back in three days");
  assert.equal(entry.stage, 0);
  assert.equal(entry.misses, 1);
  assert.equal(p.mistakes.length, 1);

  // Nothing is due before its day, and everything is due on it.
  assert.equal(dueMistakes(p, day(2)).length, 0, "not due yet on day two");
  assert.equal(dueMistakes(p, day(3)).length, 1, "due on day three");

  assert.equal(markMistake(p, entry.id, true, "trip", day(3)), "advanced");
  assert.equal(entry.due, day(3 + 7), "right on day three moves it a week out");

  // One day cannot credit a rung twice, however often it is asked.
  assert.equal(markMistake(p, entry.id, true, "trip", day(3)), "already");
  assert.equal(entry.stage, 1, "a second right answer the same day changes nothing");

  assert.equal(markMistake(p, entry.id, true, "trip", day(10)), "advanced");
  assert.equal(entry.due, day(10 + 21), "then three weeks");

  assert.equal(markMistake(p, entry.id, true, "trip", day(31)), "retired");
  assert.equal(p.mistakes.length, 0, "clearing the last rung removes it for good");
}

{
  // Missed again, it goes back to the bottom — and the bottom gets shallower.
  const p = emptyProgress("A2");
  const seed = {
    kind: "table",
    ref: "tbl-artikel-bestimmt#2:0",
    subject: "Bestimmter Artikel · Dativ · maskulin",
    prompt: "Wie heißt „der“ im Dativ?",
    expected: "dem",
    accepted: ["dem"],
    expects: "german",
    given: "den"
  };

  const first = rememberMistake(p, seed, TODAY);
  assert.equal(first.due, day(3));

  const second = rememberMistake(p, { ...seed, given: "des" }, day(3));
  assert.equal(p.mistakes.length, 1, "the same cell is one entry, not one per slip");
  assert.equal(second.misses, 2);
  assert.equal(second.due, day(4), "missed twice, the first rung shortens to a day");
  assert.equal(second.given, "des", "the latest wrong answer is the one kept");

  markMistake(p, second.id, true, "dem", day(4));
  assert.equal(second.stage, 1);
  markMistake(p, second.id, false, "den", day(5));
  assert.equal(second.stage, 0, "a wrong answer drops it back to the bottom");
  assert.equal(second.misses, 3);

  assert.equal(markMistake(p, "nothing:here", true), "unknown", "an entry that retired elsewhere is not an error");
}

{
  // The hardest-hit first, so a class cut short still covered the worst of it.
  const p = emptyProgress("A2");
  const base = { prompt: "", expected: "x", accepted: ["x"], expects: "german", given: "y" };
  rememberMistake(p, { ...base, kind: "vocab", ref: "a", subject: "a" }, day(-10));
  rememberMistake(p, { ...base, kind: "vocab", ref: "b", subject: "b" }, day(-10));
  rememberMistake(p, { ...base, kind: "vocab", ref: "b", subject: "b" }, day(-9));
  const due = dueMistakes(p, TODAY);
  assert.equal(due.length, 2, "both are due");
  assert.equal(due[0].ref, "b", "the one missed twice comes first");
}

/* -------------------------------------------------------- 2. the clock */

{
  const live = startLive("A2", [], new Date("2026-09-21T09:00:00Z"));
  assert.equal(live.seconds, 0);

  // Ten minutes of class...
  bankTime(live, Date.parse("2026-09-21T09:10:00Z"));
  assert.equal(live.seconds, 600, "ten minutes banked");

  // ...then a break of two hours, which is not class.
  pauseLive(live, Date.parse("2026-09-21T09:10:00Z"));
  assert.equal(live.resumedAt, null, "a break stops the meter");
  assert.equal(liveSeconds(live, Date.parse("2026-09-21T11:00:00Z")), 600, "the gap is not counted");

  resumeLive(live, new Date("2026-09-21T11:00:00Z"));
  bankTime(live, Date.parse("2026-09-21T11:05:00Z"));
  assert.equal(live.seconds, 900, "five more minutes, and only five");

  // A tab frozen overnight, or a clock moved by a time zone.
  resumeLive(live, new Date("2026-09-21T11:05:00Z"));
  bankTime(live, Date.parse("2026-09-22T11:05:00Z"));
  assert.equal(live.seconds, 900 + 1800, "one impossible stretch is clamped, not believed");

  // A clock that went backwards banks nothing rather than a negative.
  resumeLive(live, new Date("2026-09-22T12:00:00Z"));
  const before = live.seconds;
  bankTime(live, Date.parse("2026-09-22T11:00:00Z"));
  assert.equal(live.seconds, before, "a backwards clock adds nothing");
}

{
  // A class of a few seconds with nothing answered never happened.
  const nothing = startLive("A2", []);
  assert.equal(worthKeeping(nothing), false, "a mis-tap leaves no trace");
  nothing.right = 1;
  assert.equal(worthKeeping(nothing), true, "but an answered question always counts");
}

{
  // Midnight, found at boot rather than by a timer.
  const p = emptyProgress("A2");
  p.live = startLive("A2", []);
  p.live.date = day(-1);
  p.live.right = 12;
  p.live.wrong = 3;
  p.live.seconds = 1500;

  const record = closeStaleClass(p, TODAY);
  assert.ok(record, "a class the day ran out on is closed");
  assert.equal(record.ending, "midnight");
  assert.equal(record.date, day(-1), "it belongs to its own day, not to today");
  // Stamped at one second to midnight of the class's own day, by the
  // learner's clock — stored as an instant, so the UTC string it serialises
  // to is shifted by whatever the local offset was that night.
  assert.equal(
    record.endedAt,
    new Date(`${day(-1)}T23:59:59`).toISOString(),
    "and ends when that day did, in the learner's own time"
  );
  assert.equal(record.seconds, 1500, "with the time it actually ran");
  assert.equal(p.live, null, "and nothing is left open");
  assert.equal(p.classes.length, 1);
  assert.equal(p.sessions.length, 1, "the day is added to the history the streak reads");
  assert.equal(p.sessions[0].total, 15);

  assert.equal(closeStaleClass(p, TODAY), null, "a second sweep finds nothing to do");
}

{
  // Today's class is not stale, however long it has been open.
  const p = emptyProgress("A2");
  p.live = startLive("A2", []);
  assert.equal(closeStaleClass(p, TODAY), null, "today's class is left alone");
  assert.ok(p.live, "and stays open");
}

/* ------------------------------------------------------ 3. the marking */

const ask = (over) => ({
  id: "x",
  origin: "due",
  direction: "",
  expects: "german",
  accepted: ["x"],
  answer: "x",
  why: null,
  subject: "x",
  ...over
});

{
  // A card is scored only when every field of it was asked and answered.
  const p = emptyProgress("A2");
  const wordId = Object.keys(p.vocab)[0];
  const asks = new Map();
  for (const field of ["key", "meaning", "form"]) {
    asks.set(`v:${wordId}:${field}`, ask({ id: `v:${wordId}:${field}`, kind: "vocab", vocabId: wordId, field, gloss: "" }));
  }

  const live = startLive("A2", []);
  noteAnswer(live, asks.get(`v:${wordId}:key`), "ok", "der");
  noteAnswer(live, asks.get(`v:${wordId}:meaning`), "ok", "doctor");
  scoreClass(p, live, asks, TODAY);
  assert.equal(p.vocab[wordId].streak, 0, "two fields of a three-field card score nothing");
  assert.equal(p.vocab[wordId].seen, 0);

  noteAnswer(live, asks.get(`v:${wordId}:form`), "ok", "Ärzte");
  scoreClass(p, live, asks, TODAY);
  assert.equal(p.vocab[wordId].streak, 1, "a whole card, all right, moves the streak");
  assert.equal(p.vocab[wordId].seen, 1);
}

{
  // One wrong field spoils the card, and files itself for later.
  const p = emptyProgress("A2");
  const wordId = Object.keys(p.vocab)[0];
  p.vocab[wordId].streak = 1;

  const asks = new Map();
  for (const field of ["key", "meaning", "form"]) {
    asks.set(`v:${wordId}:${field}`, ask({ id: `v:${wordId}:${field}`, kind: "vocab", vocabId: wordId, field, gloss: "trip" }));
  }
  const live = startLive("A2", []);
  noteAnswer(live, asks.get(`v:${wordId}:key`), "ok", "die");
  noteAnswer(live, asks.get(`v:${wordId}:meaning`), "no", "travel");
  noteAnswer(live, asks.get(`v:${wordId}:form`), "ok", "Reisen");
  scoreClass(p, live, asks, TODAY);

  assert.equal(p.vocab[wordId].streak, 0, "one wrong field resets the streak");
  assert.equal(p.mistakes.length, 1, "and the field that was wrong is filed");
  assert.equal(p.mistakes[0].kind, "vocab");
  assert.equal(p.mistakes[0].due, day(3));
}

{
  // A near miss is a miss: an umlaut dropped today is one dropped on Friday.
  const p = emptyProgress("A2");
  const cell = ask({ id: "c:tbl-artikel-bestimmt#2:0", kind: "cell", tableId: "tbl-artikel-bestimmt", cell: "tbl-artikel-bestimmt#2:0", example: null, accepted: ["dem"], answer: "dem" });
  const asks = new Map([[cell.id, cell]]);
  const live = startLive("A2", []);
  noteAnswer(live, cell, "near", "den");
  scoreClass(p, live, asks, TODAY);

  assert.equal(p.mistakes.length, 1, "a near miss goes in the book");
  assert.ok(
    p.tables["tbl-artikel-bestimmt"].missed.includes("tbl-artikel-bestimmt#2:0"),
    "and into that grid's own dictionary for tomorrow"
  );
  assert.equal(p.tables["tbl-artikel-bestimmt"].dayStreak, 0, "a wrong cell breaks the clean run");
}

{
  // A clean sweep of a grid is a day on its three-day chain.
  const p = emptyProgress("A2");
  const asks = new Map();
  const live = startLive("A2", []);
  for (const row of [0, 1, 2]) {
    const cell = ask({
      id: `c:tbl-artikel-bestimmt#${row}:0`,
      kind: "cell",
      tableId: "tbl-artikel-bestimmt",
      cell: `tbl-artikel-bestimmt#${row}:0`,
      example: null
    });
    asks.set(cell.id, cell);
    noteAnswer(live, cell, "ok", "x");
  }
  scoreClass(p, live, asks, TODAY);
  assert.equal(p.tables["tbl-artikel-bestimmt"].dayStreak, 1, "a clean grid earns one day");
  assert.equal(p.mistakes.length, 0, "and nothing is filed");
}

{
  // A topic climbs only when every one of its questions was answered.
  const p = emptyProgress("A2");
  const topicId = Object.keys(p.topics)[0];
  const before = p.topics[topicId].stage;

  const asks = new Map();
  for (const index of [0, 1, 2]) {
    const q = ask({ id: `b:topic:${topicId}:${index}`, kind: "blank", bank: "topic", sourceId: topicId, index, sentence: "" });
    asks.set(q.id, q);
  }
  const live = startLive("A2", []);
  noteAnswer(live, asks.get(`b:topic:${topicId}:0`), "ok", "x");
  noteAnswer(live, asks.get(`b:topic:${topicId}:1`), "ok", "x");
  scoreClass(p, live, asks, TODAY);
  assert.equal(p.topics[topicId].stage, before, "two questions of three move nothing");

  noteAnswer(live, asks.get(`b:topic:${topicId}:2`), "ok", "x");
  scoreClass(p, live, asks, TODAY);
  assert.equal(p.topics[topicId].stage, before + 1, "the whole topic, all right, climbs a rung");
}

/* ------------------------------------------------------- 4. the agenda */

{
  const p = emptyProgress("A2");
  const a = buildAgenda(p, TODAY);
  const b = buildAgenda(p, TODAY);

  assert.deepEqual(
    a.items.map((i) => i.id),
    b.items.map((i) => i.id),
    "the same day builds the same class — the home screen promised this list"
  );
  assert.ok(a.items.length > 10, "a class has something in it");
  assert.ok(a.minutes >= 5, "and an estimate of how long it takes");

  const ids = a.items.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length, "nothing is asked twice in one class");

  // A word is one question — its meaning — and never its article or plural.
  // Spoken, "wie heißt der Artikel von X" is a quiz question rather than
  // German, and three of them a word ate the first ten minutes of a class.
  const vocab = a.items.filter((i) => i.kind === "vocab");
  assert.ok(vocab.length > 0, "a class asks about words");
  assert.ok(
    vocab.every((i) => i.field === "meaning"),
    "vocabulary is asked by meaning alone"
  );
  assert.ok(
    vocab.every((i) => i.subject.split(" ").length > 1 || i.subject.includes("(")),
    "and the word still carries its article or its auxiliary wherever it is shown"
  );

  // No cell may ask for the form it has just handed the learner: the article
  // grids are asked by declining their own nominative, so nominative cells
  // would answer themselves.
  for (const cell of a.items.filter((i) => i.kind === "cell")) {
    const anchor = cell.question.match(/„([^“]+)“/u)?.[1] ?? "";
    assert.ok(
      !anchor || !cell.accepted.includes(anchor),
      `a cell must not ask what ${anchor} is: ${cell.question}`
    );
  }

  // Reviews first: what the learner got wrong before opens the lesson.
  const p2 = emptyProgress("A2");
  rememberMistake(
    p2,
    { kind: "vocab", ref: "v_reise:meaning", subject: "die Reise", prompt: "?", expected: "trip", accepted: ["trip"], expects: "english", given: "travel" },
    day(-4)
  );
  const withReview = buildAgenda(p2, TODAY);
  assert.equal(withReview.items[0].kind, "review", "a due review opens the class");
}

{
  // A stored plan rebuilds into the same questions, which is what makes a
  // break safe: the learner comes back to the class they left.
  const p = emptyProgress("A2");
  const agenda = buildAgenda(p, TODAY);
  p.live = startLive("A2", planOf(agenda));
  p.live.date = agenda.date;

  const rebuilt = agendaFromPlan(p);
  assert.ok(rebuilt, "a plan rebuilds");
  assert.deepEqual(
    rebuilt.items.map((i) => i.id),
    agenda.items.map((i) => i.id),
    "into exactly the same class"
  );
}

/* --------------------------------------------------- 5. the storage layer */

{
  // The shape every learner has on disk right now, written by the old app.
  const old = normalise({
    level: "A2",
    vocab: { v_arzt: { streak: 1, seen: 2, lastDate: "2026-09-01" } },
    sessions: [{ date: "2026-09-01", right: 5, total: 6 }]
  });
  assert.deepEqual(old.mistakes, [], "a document with no book of errors reads as an empty one");
  assert.deepEqual(old.classes, []);
  assert.equal(old.live, null);
  assert.equal(old.vocab.v_arzt.streak, 1, "and loses nothing it had");
}

{
  // Reading a document must not have side effects, however stale it is.
  const p = emptyProgress("A2");
  p.live = startLive("A2", []);
  p.live.date = "2020-01-01";
  const read = normalise(JSON.parse(JSON.stringify(p)));
  assert.ok(read.live, "normalise leaves a stale class open");
  assert.equal(read.classes.length, 0, "and writes no record of its own");
  assert.equal(read.live.resumedAt, null, "but its meter is stopped: that tab has gone");
}

{
  const local = emptyProgress("A2");
  const remote = emptyProgress("A2");

  const record = (id, date, seconds) => ({
    id,
    date,
    startedAt: `${date}T09:00:00.000Z`,
    endedAt: `${date}T09:30:00.000Z`,
    seconds,
    level: "A2",
    sections: [],
    tables: [],
    words: [],
    right: 10,
    wrong: 2,
    mistakes: [],
    ending: "ended"
  });

  local.classes = [record("aaaaaaaa", "2026-09-01", 600), record("bbbbbbbb", "2026-09-02", 900)];
  remote.classes = [record("aaaaaaaa", "2026-09-01", 600), record("cccccccc", "2026-09-03", 300)];

  const seed = { prompt: "", expected: "x", accepted: ["x"], expects: "german", given: "y" };
  rememberMistake(local, { ...seed, kind: "vocab", ref: "shared", subject: "shared" }, "2026-09-01");
  rememberMistake(remote, { ...seed, kind: "vocab", ref: "shared", subject: "shared" }, "2026-09-01");
  markMistake(remote, "vocab:shared", true, "x", "2026-09-04");

  const merged = mergeProgress(local, remote);
  assert.equal(merged.classes.length, 3, "classes are a union by id, not a concatenation");
  assert.equal(
    merged.mistakes.find((e) => e.ref === "shared").stage,
    0,
    "where two devices disagree about a mistake, the lower rung wins"
  );
}

{
  // Two devices, two open classes: the further-along one survives whole.
  const local = emptyProgress("A2");
  const remote = emptyProgress("A2");
  local.live = startLive("A2", []);
  local.live.answers = [{ itemId: "a", kind: "vocab", verdict: "ok", prompt: "", given: "", expected: "", why: null }];
  local.live.seconds = 100;
  remote.live = startLive("A2", []);
  remote.live.seconds = 900;

  const merged = mergeProgress(local, remote);
  assert.equal(merged.live.answers.length, 1, "the class that got further is the one kept");
  assert.equal(merged.live.seconds, 100, "and it is not spliced with the other");
}

/* ------------------------------------------------------- 6. the profile */

{
  const p = emptyProgress("A2");
  const mk = (date, seconds) => ({
    id: `id${date}`,
    date,
    startedAt: `${date}T09:00:00.000Z`,
    endedAt: `${date}T09:30:00.000Z`,
    seconds,
    level: "A2",
    sections: [],
    tables: [],
    words: [],
    right: 10,
    wrong: 2,
    mistakes: [],
    ending: "ended"
  });
  p.classes = [mk(day(-2), 1800), mk(day(-1), 1800), mk(TODAY, 1800)];

  const totals = profileTotals(p);
  assert.equal(totals.seconds, 5400);
  assert.equal(totals.hours, 1.5, "hours are shown to one decimal");
  assert.equal(totals.days, 3);
  assert.equal(totals.streak, 3, "three days running");
  assert.equal(totals.longest, 3);

  // Two classes on one day are one square, not two.
  p.classes.push(mk(`${TODAY}-again`, 600));
  p.classes[3].date = TODAY;
  assert.equal(profileTotals(p).days, 3, "a second class the same day is still one day");

  const squares = calendarDays(p, 4, TODAY);
  const todaySquare = squares.find((s) => s.date === TODAY);
  assert.ok(todaySquare, "today has a square");
  assert.equal(todaySquare.classes, 2, "which knows both classes happened");
  assert.equal(todaySquare.minutes, 40, "and sums their minutes");
  assert.ok(squares.every((s) => s.date <= TODAY), "the grid never runs into the future");

  assert.equal(shadeFor(0), 0);
  assert.equal(shadeFor(10), 1);
  assert.equal(shadeFor(29), 2);
  assert.equal(shadeFor(45), 3);
  assert.equal(shadeFor(60), 4, "an hour is the darkest square the plan asks for");
}

/* ------------------------------------------------------------ closing */

{
  // The record a class leaves behind is the banked time, never the wall clock.
  const live = startLive("A2", [], new Date("2026-09-21T09:00:00Z"));
  live.seconds = 1200;
  live.resumedAt = null;
  const record = closeLive(live, "ended", "2026-09-21T18:00:00.000Z");
  assert.equal(record.seconds, 1200, "nine hours of wall clock, twenty minutes of class");
  assert.equal(record.ending, "ended");
}

assert.equal(MISTAKE_INTERVALS.join(","), "3,7,21", "the ladder the lesson plan asks for");

console.log("✓ class test passed — the ladder, the clock, the marking, the agenda, storage, the profile");
