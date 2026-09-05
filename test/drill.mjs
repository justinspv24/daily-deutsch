/**
 * Headless smoke test.
 *
 *   npm test
 *
 * Bundles src/main.ts with esbuild (as a classic IIFE, because jsdom has no
 * ES-module support), runs it against a bare document, plays a full round
 * from the keyboard, and asserts the things that would silently rot: grading,
 * the spaced-repetition roll-forward, persistence, and both toggles.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));

async function bundle(entry) {
  const result = await build({
    entryPoints: [resolve(here, entry)],
    bundle: true,
    format: "iife",
    target: "es2022",
    write: false,
    logLevel: "silent",
    // Styling is irrelevant to behaviour and jsdom lays nothing out.
    loader: { ".css": "empty" },
    // No Supabase project and no assistant: exactly the signed-out, offline
    // path a first-time visitor gets before they have an account.
    define: {
      "import.meta.env": JSON.stringify({
        VITE_SUPABASE_URL: "",
        VITE_SUPABASE_ANON_KEY: "",
        VITE_AI_ENABLED: "false"
      })
    }
  });
  return result.outputFiles[0].text;
}

const dataScript = await bundle("./expose.ts");
const script = await bundle("../src/main.ts");

const dom = new JSDOM(`<!doctype html><html lang="de"><body><div id="app"></div></body></html>`, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://tagesdrill.test/"
});
const { window } = dom;
const { document } = window;

window.eval(dataScript);
window.eval(script);

const DATA = window.__TAGESDRILL_DATA__;

/** Look up the model answers for whatever question is on screen. */
function expectedAnswers(doc) {
  const headword = doc.querySelector(".headword__word")?.textContent?.trim();
  if (headword) {
    const item = DATA.VOCAB.find((v) => v.word === headword);
    if (!item) throw new Error(`unknown headword ${headword}`);
    return [item.key, item.en[0], item.form[0]];
  }
  const prompt = doc.querySelector(".prompt");
  if (!prompt) throw new Error("no question on screen");
  const shape = [...prompt.childNodes]
    .map((n) => (n.nodeType === 3 ? n.textContent : "___"))
    .join("");
  const pool = [...DATA.GRAMMAR, ...DATA.TOPICS.flatMap((t) => t.questions)];
  const match = pool.find((q) => q.sentence === shape);
  if (!match) throw new Error(`unknown sentence: ${JSON.stringify(shape)}`);
  return [match.answers[0]];
}

const settle = () => new Promise((r) => window.setTimeout(r, 0));
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const text = (sel) => $(sel)?.textContent?.trim() ?? "";

await settle();

/* ------------------------------------------------------------- shell ---- */

assert.equal(text(".wordmark__name"), "Daily Deutsch", "wordmark renders");
assert.equal($$(".stepper__item").length, 4, "four session steps");
assert.equal($$(".agenda__row").length, 4, "four agenda rows");
assert.ok(text(".display").length > 0, "the page greets the visitor");

/* --------------------------------------------------- language switch ---- */

const [deButton, enButton] = $$(".segmented button");
assert.equal(deButton.getAttribute("aria-pressed"), "true", "German is the default");
enButton.click();
await settle();
assert.equal(document.documentElement.lang, "en", "html lang follows the switch");
assert.ok(text(".stepper__label"), "stepper still labelled after switch");
const englishStart = $(".actions .btn").textContent;
assert.equal(englishStart, "Start the drill", "chrome translated to English");

deButton.click();
await settle();
assert.equal($(".actions .btn").textContent, "Drill starten", "chrome back in German");

/* ------------------------------------------------------ theme switch ---- */

const initialTheme = document.documentElement.dataset.theme;
$(".iconbtn").click();
await settle();
assert.notEqual(document.documentElement.dataset.theme, initialTheme, "theme toggles");
assert.equal(
  window.localStorage.getItem("tagesdrill.theme"),
  document.documentElement.dataset.theme,
  "theme is remembered"
);
$(".iconbtn").click();
await settle();

/* ------------------------------------------------------- full round ---- */

$(".actions .btn").click();
await settle();
assert.ok($(".qcount"), "drill screen opened");

const total = Number($(".qcount").textContent.split("/")[1].trim());
assert.ok(total >= 10, `round has a sensible length (got ${total})`);

/* --------------------------------------------- keyboard field stepping --- */
{
  const fields = $$(".qbody input");
  assert.equal(fields.length, 3, "the round opens on a three-field vocabulary card");
  assert.equal(document.activeElement, fields[0], "the first field takes focus");

  const press = (key) =>
    document.activeElement.dispatchEvent(
      new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
    );

  press("ArrowDown");
  assert.equal(document.activeElement, fields[1], "↓ steps to the next field");
  press("ArrowDown");
  assert.equal(document.activeElement, fields[2], "↓ keeps stepping down");
  press("ArrowDown");
  assert.equal(document.activeElement, fields[2], "↓ in the last field stays put");
  press("ArrowUp");
  assert.equal(document.activeElement, fields[1], "↑ steps back");
  press("ArrowUp");
  press("ArrowUp");
  assert.equal(document.activeElement, fields[0], "↑ in the first field stays put");

  press("Enter");
  assert.equal(document.activeElement, fields[1], "Enter moves to the next field");
  press("Enter");
  assert.equal(document.activeElement, fields[2], "Enter keeps moving down");
  assert.ok(!$(".verdict"), "Enter mid-card does not submit the answer");

  press("Enter");
  await settle();
  assert.ok($(".verdict"), "Enter in the last field checks the answer");
  assert.ok(
    fields.every((f) => f.readOnly),
    "grading locks the card"
  );

  $(".actions .btn").click(); // move past this first question
  await settle();
}

// The keyboard block above already answered (and failed) the first question.
let answered = 1;
let deliberateMisses = 1;

while ($(".qcount")) {
  const inputs = $$(".qbody input");
  assert.ok(inputs.length > 0, "question renders at least one input");

  // Answer everything wrong on purpose: that exercises the failure paths,
  // the reset of the vocabulary counter and the topic step-down.
  for (const input of inputs) input.value = "zzz";
  deliberateMisses += 1;

  $(".actions .btn").click();
  await settle();

  const verdict = $(".verdict");
  assert.ok(verdict, "a verdict is shown after checking");
  assert.equal(verdict.dataset.verdict, "no", "wrong answers are graded wrong");
  assert.ok(
    verdict.querySelector(".verdict__line strong"),
    "the model answer is spelled out"
  );
  assert.ok(inputs.every((i) => i.readOnly), "inputs lock after grading");

  $(".actions .btn").click();
  await settle();
  answered += 1;
  if (answered > 60) throw new Error("drill did not terminate");
}

assert.equal(answered, total, "every question was presented once");
assert.equal(deliberateMisses, total, "every question was answered");

/* ---------------------------------------------------------- summary ---- */

assert.ok($(".score__figure"), "summary shows a score");
assert.ok(text(".score__figure").startsWith("0"), "all-wrong round scores zero");
assert.equal($$(".review__row").length, total, "every miss is listed for review");

/* ------------------------------------------------------- persistence --- */

const saved = JSON.parse(window.localStorage.getItem("daily-deutsch.progress.v1"));
assert.ok(saved, "progress was written to localStorage");
assert.equal(saved.sessions.length, 1, "the round was recorded");
assert.equal(saved.sessions[0].right, 0, "score persisted");
assert.equal(saved.vocab.v_aufwachen.streak, 0, "a wrong answer resets the vocab counter");
assert.equal(saved.topics.t1.stage, 0, "a failed review steps the topic back down");

const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
assert.equal(saved.topics.t1.due, tomorrow, "a failed topic is due again tomorrow");

/* --------------------------------------------------------- progress ---- */

$$(".actions .btn").at(-1).click();
await settle();
assert.equal($$(".bars__bar").length, 14, "history chart has 14 slots");
assert.ok($$("tbody tr").length >= 12, "vocabulary and topic tables are populated");
assert.ok(
  $$(".pill").some((p) => p.dataset.tone === "due"),
  "failed topics are flagged as due"
);

/* ------------------------------------------------- a round done right --- */

$(".actions .btn").click(); // back to the drill
await settle();
$(".actions .btn").click(); // start
await settle();

const secondTotal = Number($(".qcount").textContent.split("/")[1].trim());
let correctAnswers = 0;

while ($(".qcount")) {
  const inputs = $$(".qbody input");
  const answers = expectedAnswers(document);
  inputs.forEach((input, i) => {
    input.value = answers[i] ?? "";
  });

  $(".actions .btn").click();
  await settle();

  const verdict = $(".verdict");
  assert.equal(
    verdict.dataset.verdict,
    "ok",
    `model answer rejected: ${JSON.stringify(answers)} — ${verdict.textContent}`
  );

  $(".actions .btn").click();
  await settle();
  correctAnswers += 1;
  if (correctAnswers > 60) throw new Error("second drill did not terminate");
}

assert.equal(correctAnswers, secondTotal, "second round completed");
assert.equal(text(".display"), "Fehlerfrei.", "a clean round is called flawless");
assert.ok(text(".score__figure").startsWith(String(secondTotal)), "full marks");

const after = JSON.parse(window.localStorage.getItem("daily-deutsch.progress.v1"));
assert.equal(after.sessions.length, 2, "both rounds recorded");
assert.equal(after.vocab.v_arzt.streak, 1, "a correct answer starts the 2-day counter");
assert.equal(
  after.topics.t1.stage,
  0,
  "topics that were not due today are untouched"
);
assert.ok(
  Object.values(after.grammar).some((g) => g.streak === 1),
  "table sentences track their own streak"
);

console.log(
  `✓ smoke test passed — ${total} questions failed, ${secondTotal} answered correctly, ` +
    `both languages, both themes`
);
