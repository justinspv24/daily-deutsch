/**
 * Checks the syllabus holds together: four levels of twelve sections, ids
 * unique across the lot, every illustration a section points at actually in
 * the library, every section carrying the four parts the view expects, and
 * every link an https URL to one of the sources the project decided to trust.
 *
 * None of this is logic; it is content, and content rots quietly — a typo in
 * an illustration id shows up as a grammar point with no diagram and nobody
 * notices for months. Cheaper to have the test notice.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));

async function load(entry) {
  const bundled = await build({
    entryPoints: [resolve(here, entry)],
    bundle: true,
    format: "esm",
    target: "es2022",
    write: false,
    logLevel: "silent",
    loader: { ".css": "empty" },
    define: { "import.meta.env": JSON.stringify({}) }
  });
  return import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
}

const { SYLLABI } = await load("../src/data/syllabus/index.ts");
const { ILLUSTRATION_IDS } = await load("../src/ui/illustrations.ts");
const { curriculumFor } = await load("../src/data/curriculum.ts");

/* ------------------------------------------ the drill follows the map */

// Every section of the map has questions behind it: at least this many words,
// table sentences and one review topic, each tagged with the section id. The
// words a section shows ARE the drill's words for it — there is no second
// list — so this is also the check that no section is thin.
const MIN_WORDS = 8;
const MIN_SENTENCES = 3;
const MIN_TOPICS = 1;

for (const level of ["A1", "A2", "B1", "B2"]) {
  const bank = curriculumFor(level);
  const sectionIds = new Set(SYLLABI[level].sections.map((s) => s.id));

  for (const item of [...bank.vocab, ...bank.grammar, ...bank.topics]) {
    if (item.section !== undefined) {
      assert.ok(sectionIds.has(item.section), `${level}: "${item.id}" is tagged "${item.section}", not a section of ${level}`);
    }
  }

  // The smoke test looks answers up by headword and by sentence, and a learner
  // sees them as the question — so within a bank they stay unique.
  const words = bank.vocab.map((v) => v.word);
  assert.equal(new Set(words).size, words.length, `${level}: headwords are unique`);
  const sentences = [...bank.grammar.map((g) => g.sentence), ...bank.topics.flatMap((t) => t.questions.map((q) => q.sentence))];
  assert.equal(new Set(sentences).size, sentences.length, `${level}: sentences are unique`);
  const allIds = [...bank.vocab, ...bank.grammar, ...bank.topics].map((i) => i.id);
  assert.equal(new Set(allIds).size, allIds.length, `${level}: ids are unique`);

  for (const section of SYLLABI[level].sections) {
    const w = bank.vocab.filter((v) => v.section === section.id).length;
    const g = bank.grammar.filter((x) => x.section === section.id).length;
    const t = bank.topics.filter((x) => x.section === section.id).length;
    assert.ok(w >= MIN_WORDS, `${section.id}: at least ${MIN_WORDS} words in the drill (${w})`);
    assert.ok(g >= MIN_SENTENCES, `${section.id}: at least ${MIN_SENTENCES} sentences in the drill (${g})`);
    assert.ok(t >= MIN_TOPICS, `${section.id}: a review topic in the drill (${t})`);
  }
}

const known = new Set(ILLUSTRATION_IDS);
const TRUSTED_HOSTS = ["www.youtube.com", "learngerman.dw.com", "www.goethe.de", "www.telc.net"];

const ids = new Set();
let sections = 0;
let illustrated = 0;

for (const level of ["A1", "A2", "B1", "B2"]) {
  const syllabus = SYLLABI[level];
  assert.equal(syllabus.level, level, `${level}: level field matches its key`);
  assert.equal(syllabus.sections.length, 12, `${level}: twelve sections`);
  assert.ok(syllabus.sources.length >= 4, `${level}: has sources`);

  for (const section of syllabus.sections) {
    sections += 1;
    assert.ok(!ids.has(section.id), `${section.id}: id is unique`);
    ids.add(section.id);
    assert.ok(section.id.startsWith(level.toLowerCase()), `${section.id}: id carries its level`);

    assert.ok(section.canDo.length >= 3, `${section.id}: at least three can-do statements`);
    assert.ok(section.grammar.length >= 3, `${section.id}: at least three grammar points`);
    assert.ok(section.links.length >= 2, `${section.id}: at least two links`);

    for (const point of section.grammar) {
      assert.ok(point.example && point.gloss, `${section.id}: grammar point has example and gloss`);
      if (point.illustration) {
        illustrated += 1;
        assert.ok(known.has(point.illustration), `${section.id}: illustration "${point.illustration}" exists`);
      }
    }

    for (const link of [...section.links, ...syllabus.sources]) {
      const url = new URL(link.url);
      assert.equal(url.protocol, "https:", `${section.id}: link is https`);
      assert.ok(TRUSTED_HOSTS.includes(url.hostname), `${section.id}: ${url.hostname} is a trusted host`);
    }
  }
}

// Every diagram in the library should be reachable from somewhere; an
// orphaned spec is a diagram nobody will ever see.
const used = new Set();
for (const level of Object.values(SYLLABI)) {
  for (const section of level.sections) {
    for (const point of section.grammar) if (point.illustration) used.add(point.illustration);
  }
}
for (const id of known) assert.ok(used.has(id), `illustration "${id}" is used by at least one section`);

console.log(`syllabus: ok — ${sections} sections, ${ids.size} ids, ${illustrated} illustrated grammar points, ${known.size} diagrams`);
