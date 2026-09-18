# The syllabus

*Lehrplan* on the home screen (and "what does each level cover?" on the level
picker) opens a map of the whole road from A1 to B2: four levels, twelve
sections each, and for every section what you can do afterwards, the grammar
that goes with it, the words that matter, and where to hear it taught. This
note records what it was built from and the decisions in it.

## What it is built against

The Common European Framework gives the levels; the exam boards decide what
each level means in German. The syllabus follows the boards, because that is
what a learner will eventually be measured against:

| Level | Primary source | Also |
|---|---|---|
| A1 | Goethe-Institut, *Start Deutsch 1 — Prüfungsziele, Testbeschreibung* and the *A1 Wortliste* | telc Deutsch A1 |
| A2 | Goethe-Institut, *Goethe-Zertifikat A2 — Prüfungsziele* and the *A2 Wortliste* | telc Deutsch A2, DTZ |
| B1 | Goethe-Institut, *Goethe-Zertifikat B1 Wortliste* (the last official list) | telc Deutsch B1, DTZ, ÖSD B1 |
| B2 | Goethe-Zertifikat B2 and telc Deutsch B2 exam formats | TestDaF; the *Aspekte*, *Sicher!* and *Erkundungen* course books |

The themes per level are the ones those documents list as the domains the
exams draw their texts and tasks from. The order within a level follows how
the mainstream course books (*Menschen*, *Schritte international*, *Netzwerk*,
*Aspekte*) sequence them, which is also roughly how DW's *Nicos Weg* is cut.
The grammar per section is the grammar those books introduce alongside that
theme and the exams test at that level.

The links to the source documents are in the app itself, at the top of each
level (`sources` in `src/data/syllabus/*.ts`).

There is no official B2 word list; Goethe's lists stop at B1. The B2
vocabulary is thematic and abstract by design — that is what the level is,
talking about the world rather than about yourself — and was chosen to match
the exams' text types rather than a frequency count.

## What it is not

It is not the drill. The drill banks in `src/data/a1.ts` and friends are the
questions the app actually asks; the syllabus is broader on purpose. It names
every theme and every grammar point of a level whether or not the drill has
questions for it yet, so a learner can see the whole road, and so the next
bank to write is never a guess. The two will converge over time, syllabus
first.

The vocabulary in each section is *core*, not complete: twelve to fifteen
words that a learner at that level needs for that theme, with their article
and plural where a noun and their auxiliary where a verb. The official lists
run to hundreds of words per level and are linked rather than copied.

## The diagrams

Almost none of them are pictures, and that is the point. German grammar is
mostly *positions* — where the verb goes, which slot changes, what the bracket
holds — and a position is best shown as exactly that. So `src/ui/illustrations.ts`
is five small renderers and a table of specs:

| Renderer | Shows | Used for |
|---|---|---|
| **frame** | a sentence as a row of slots, the important ones lit | V2, the sentence bracket, separable verbs, Perfekt, subordinate clauses, passive, Konjunktiv I, TeKaMoLo … |
| **grid** | a paradigm, the cells that change marked | the four cases, adjective endings, pronouns, relative pronouns, Konjunktiv II forms … |
| **contrast** | two or three columns set against each other | wo/wohin, nicht/kein, dative vs accusative verbs, nominal vs verbal style, subjective modals … |
| **timeline** | tenses or temporal conjunctions along a line | the tense system, als/wenn/nachdem/bevor |
| **clock** | half past two | telling the time |

They are HTML where text has to fit — German words are long and phones are
narrow, and a browser wraps text better than any SVG measurement would — and
SVG only where geometry matters. Colours come from the theme tokens, so dark
mode needs nothing extra. Adding a diagram is adding a spec, not drawing.

## The links

Only two kinds of link are allowed, and `test/syllabus.mjs` enforces the
hosts:

- **Documents and channels that exist and are stable**: the Goethe PDFs, the
  telc pages, DW's *Nicos Weg* playlist and course site, the Easy German and
  DW channels. These were verified before being written down.
- **Searches**, for a specific video on a specific point. A YouTube search
  for "Nicos Weg A2 Perfekt" always works and is labelled *Suche* in the
  interface. Individual video ids were deliberately not written from memory:
  a dead link under a grammar point is worse than a search that lands on
  three good videos.

DW's own site could not be fetched from here (it blocks crawlers), so
`learngerman.dw.com` is linked at its front page rather than deep into a
lesson.

## Files

| Path | What it does |
|---|---|
| `src/data/syllabus/helpers.ts` | the little vocabulary the level files are written in, plus the verified links |
| `src/data/syllabus/a1.ts` … `b2.ts` | one level each: twelve sections |
| `src/data/syllabus/index.ts` | the registry, `syllabusFor(level)` |
| `src/ui/syllabus.ts` | the screen: level tabs, the level card, the sections as `<details>` |
| `src/ui/illustrations.ts` | the diagram library |
| `src/styles/syllabus.css` | its styles |
| `test/syllabus.mjs` | four levels of twelve, unique ids, every diagram present and used, every link trusted |
