/**
 * Checks the media data holds together: every clip is a real-looking YouTube
 * id with a portion inside the video's length, every episode has an https
 * audio URL and a page, every item belongs to a section that exists, and
 * every item carries the reason it was chosen. Links themselves were verified
 * by the research pass that produced the data; this guards the data.
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

const { allMedia, showsFor } = await load("../src/data/media/index.ts");
const { SYLLABI } = await load("../src/data/syllabus/index.ts");

const sectionIds = new Set(Object.values(SYLLABI).flatMap((l) => l.sections.map((s) => s.id)));
const ID = /^[A-Za-z0-9_-]{11}$/;
let clips = 0;
let episodes = 0;

for (const media of allMedia()) {
  assert.ok(sectionIds.has(media.section), `${media.section}: section exists`);
  for (const clip of media.videos) {
    clips += 1;
    assert.ok(ID.test(clip.videoId), `${media.section}: "${clip.videoId}" looks like a YouTube id`);
    assert.ok(clip.start >= 0 && clip.start < clip.end, `${media.section}: ${clip.videoId} start < end`);
    assert.ok(clip.end <= clip.lengthSeconds, `${media.section}: ${clip.videoId} end within length`);
    assert.ok(clip.label.de && clip.label.en, `${media.section}: ${clip.videoId} labelled in both languages`);
    assert.ok(clip.why && clip.evidence, `${media.section}: ${clip.videoId} carries its reason and evidence`);
  }
  for (const episode of media.podcasts) {
    episodes += 1;
    assert.equal(episode.section, media.section, `${media.section}: episode tagged with its section`);
    assert.ok(/^https:\/\//.test(episode.audioUrl), `${media.section}: audio url is https`);
    assert.ok(/^https?:\/\//.test(episode.pageUrl), `${media.section}: page url present`);
    assert.ok(episode.label.de && episode.label.en, `${media.section}: episode labelled in both languages`);
    assert.ok(episode.why && episode.evidence, `${media.section}: episode carries its reason and evidence`);
  }
}

for (const level of ["A1", "A2", "B1", "B2"]) {
  for (const show of showsFor(level)) {
    assert.ok(/^https?:\/\//.test(show.homepage) && /^https?:\/\//.test(show.feedUrl), `${level}: ${show.name} has homepage and feed`);
    assert.ok(show.fit && show.evidence, `${level}: ${show.name} says why it fits and why it is recommended`);
  }
}

console.log(`media: ok — ${clips} clips, ${episodes} episodes`);
