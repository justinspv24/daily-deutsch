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

## What the pass of 21 September 2026 produced

| | A1 | A2 | B1 | B2 |
|---|---|---|---|---|
| Podcast shows | 5 | 6 | 6 | 6 |
| Sections with clips | 12/12 | 12/12 | 12/12 | 12/12 |
| Clips | 45 | 47 | 46 | 46 |
| Episodes | 30 | 33 | 36 | 36 |

184 clips and 135 episodes, across all 48 sections. The skeptics threw out 16
proposed items; the reasons are in the JSON next to the survivors.

Then a third check, from this machine and trusting none of it
(`scratchpad/checkmedia.mjs`): every video asked of YouTube's oembed record
again (does the id resolve, is the title and channel the one recorded), every
watch page re-read for its true length, and every episode's audio fetched the
way the player fetches it — a ranged GET, not a HEAD, because several podcast
hosts answer a HEAD with two bytes of text. **All 185 proposed clips and all
135 episodes came back confirmed**: every id live, every title and channel as
recorded, every `start`–`end` inside the video's real length, every audio URL
answering with audio.

That check is also what caught the feed URLs carrying raw umlauts in the path,
which DW's own server answers with a 400 until they are percent-encoded; the
generator now writes every URL through the URL parser, and the data ships the
encoded form. Two other things it caught: a section that had been given the
same portion of the same video twice under two labels (the generator now drops
repeats and `test/media.mjs` fails on them), and research text quoting bare
URLs, which widened a row past a phone's screen until the CSS was told to
break them.

Two things that check cannot settle, and does not pretend to: whether a clip's
range is the *right* range for the topic, and whether the cited recommendation
is real. Both of those are the verify agents' judgements, made with the page
and the source in front of them, and both are printed in the app under each
item so the reasoning can be read and disagreed with.

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
