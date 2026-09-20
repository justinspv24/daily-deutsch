# Videos and podcasts

Every syllabus section carries a few YouTube clips and podcast episodes. This
note records how they were chosen, what "verified" means here, and how to run
the research again.

## The bar

The brief was: only what many people genuinely recommend, and only what is
valid. Two consequences:

- **Nothing from memory.** Neither a video id nor a feed URL was written down
  by a model recalling it. Every item was *found* by a search for community
  recommendations, then *fetched*: the video's oembed record (does it exist,
  what is its real title and channel), its watch page (length, view count,
  description, chapter markers), the podcast's RSS feed (the episode's exact
  title, page link, audio URL, duration), and a `HEAD` on the audio URL.
- **Portions, not whole videos.** A clip is `start`–`end` in seconds, taken
  from the video's chapter markers or the timestamps in its description. The
  embed plays only that range; the link out jumps to `start`. Where a video
  has no chapters and is entirely about the topic, the clip is the whole
  video and the record says so.

Evidence of recommendation had to be concrete and sourced: a named community
list (the r/German wiki, a widely cited "best channels" round-up), a forum
thread, Apple/Spotify rating counts, or engagement figures read from the page
— never "popular" on its own. Each item keeps its `evidence` string, and the
app shows it under *Warum empfohlen*.

## How it was done

`docs/research/media.json` is the output of a multi-agent research pass
(the Workflow tool; script under the session's `workflows/scripts/`):

1. **Shows** — for each level, one agent finds the podcasts widely recommended
   for that CEFR level and, for each, a working RSS feed (fetched, checked for
   `<enclosure>` audio URLs). Shows without a working feed are dropped.
2. **Research** — for each of the 48 sections, one agent finds 2–4 clips and
   1–3 episodes, following the recipe above, and returns them with the
   evidence and with how the timestamps were determined.
3. **Verify** — for each section, a *second*, independent agent is told to
   refute: it re-runs the oembed check, re-reads the watch page, confirms
   `start < end ≤ length` and that the chapter or description actually covers
   the topic, searches for the cited evidence, re-`HEAD`s the audio URL and
   re-reads the feed. Anything it cannot confirm is dropped, with the reason
   kept in the JSON.

Only items that survived step 3 are in the app. The JSON keeps every reason;
`scratchpad/genmedia.mjs` turns it into `src/data/media/{a1,a2,b1,b2}.ts`,
which are generated files and never edited by hand. `test/media.mjs` guards
the data's shape on every test run.

## Rerunning it

Links rot: videos get taken down, feeds move. The research is meant to be
rerun, not patched. Regenerate `sections.json` from the syllabus, launch the
workflow, write its result to `docs/research/media.json`, run `genmedia.mjs`,
run the tests. A rerun replaces the whole set; there is no merging, so the
result is always one consistent pass.

## Playback

Podcasts play in the app through `src/player.ts`: one `<audio>` element for
the whole app, outside every screen, with Media Session metadata and
handlers, so an episode keeps playing while the learner does a round and when
the phone is locked, with play/pause/±15 s on the lock screen. Position is
remembered per episode. Videos play in a YouTube embed that is only created
when tapped — a section page must not open a dozen players — restricted to
the clip's range.
