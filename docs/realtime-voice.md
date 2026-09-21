# Voice mode

The `vv` panel is a live phone call with a German teacher: the learner talks,
the teacher answers, and either can interrupt the other. This note explains how
it works, what it costs, and what to check when it misbehaves.

## Why it was rebuilt

The first version was a relay. The browser's `SpeechRecognition` turned speech
into text, the text went to Claude through `/api/ai`, and the browser's
`speechSynthesis` read the answer back. It worked, and it was nearly free, but
it had three problems that no amount of tuning would fix:

- **It was slow.** Three hops meant two to four seconds between the learner
  finishing a sentence and hearing anything back.
- **It sounded wrong.** Browser voices read German with an English mouth. For
  an app about pronunciation, that is not cosmetic.
- **It was turn-based.** Tap, speak, wait, listen, tap. Real conversation
  overlaps; this could not.

The rebuild replaces all three with one model that hears and speaks audio
directly — `gemini-3.1-flash-live-preview` over the Live API. Latency drops to
roughly half a second, the German is native, and the learner can cut in.

The `cc` chat and the `tt` translator run on Gemini too, through `/api/ai`,
on the same learner-owned key — one vendor, one key, three features. (They
began on Claude; the voice rebuild forced Google in, and once every learner
was bringing a Google key anyway, keeping a second vendor for text made no
sense.)

## What the teacher actually does

This is the part that matters more than the transport, and it is where the
first attempt at this feature was wrong.

**It corrects everything.** The instinct is to let small slips go so the
conversation flows — that is what a kind human tutor does. It is also how a
learner keeps their mistakes for years. A spoken conversation offers no other
moment to catch them; nobody re-reads a sentence they said out loud. So every
mistake that matters gets corrected: case, gender, plural, article, word order,
tense, word choice, and anything understandable but not how a German would say
it. Capitalisation is explicitly ignored, because this is speech.

What makes that bearable is the shape of the correction, which is fixed:

> **Korrektur:** *the sentence said properly*
> **Kurz erklärt:** *the reason, in simple German, one sentence*
> *…then straight on with a follow-up question*

Short and frequent, never saved up into a lesson.

**It is German only.** Dropping into English is a relief in the moment and a
loss over weeks: the learner stops reaching. English arrives the instant they
ask for an explanation, and not before.

**It speaks first.** The moment the socket opens, the tutor greets the learner
and says what the two of them are about to practise. Waiting for the learner to
start a conversation in a foreign language is how a call ends before it begins.

### The four modes

| Mode | What it is |
|---|---|
| **Frei** | Open conversation. No task, follows what interests the learner. |
| **Teil 1** | Einander kennenlernen — name, origin, home, family, where they learned German, what they do, languages. |
| **Teil 2** | Über ein Thema sprechen — the tutor raises a magazine-article topic, gives their own view first, then asks for the learner's. |
| **Teil 3** | Gemeinsam etwas planen — a party, a trip, an outing; work through wann, wo, wer macht was, and reach an actual decision. |

The three Teile mirror the telc oral exam, which is a specific shape and worth
rehearsing rather than approximating with general chat. In the exam modes the
tutor plays Teilnehmer/in B — a fellow candidate, not an examiner — but keeps
correcting throughout, since that is the difference between practice and the
real thing.

Level comes from `progress.level`, defaulting to **B1** (the level the Teile are
written for), with B2 structures allowed in gradually. The prompts are composed
in `api/realtime-token.ts`, not in the bundle, so they are built from the
learner's actual level and are not sitting in a JavaScript file to be read.

## The tutor who runs the class

`vv` is a room you go into for a chat. The **class** is the opposite: the
tutor sits with the learner for the whole half hour, works through a lesson the
app wrote down before the call opened, and talks with them between the
questions. It is not offered beside anything — it is the only way to practise
now, and `src/ui/classroom.ts` is a screen of its own rather than a panel over
the app.

That is the change worth stating plainly, because everything below follows from
it. The voice used to be a second door onto a typed round, which meant it could
fail gracefully: the microphone died, the caret went back to the field, and the
learner typed. There is no field to fall back to. What replaces that safety net
is described under *When the voice gives out*.

### The app judges, the tutor speaks

This is the load-bearing decision. Every **closed** question — a word's
meaning, a cell of a grammar table, a gapped sentence — is graded by
`grading.ts`, exactly as a typed one was, and that verdict is what reaches the
streaks, the three-day table chain and the 3/7/21 book of errors. The tutor is
told the verdict *afterwards* and reacts to it.

The rule is now partial, and the line is worth drawing precisely, because the
class also contains stretches of real conversation:

| | judged by | reaches |
|---|---|---|
| vocabulary, table cells, gapped sentences, reviews | the app, `grading.ts` | streaks, the topic and table ladders, the book of errors |
| free speech during a `[GESPRÄCH]` | the model | the screen and the day's summary, and nothing else |

Free speech has no expected answer, so the app cannot mark it and the model
must. But a correction the model made is never written to a ladder: it is shown
in the correction colour, listed in the day's summary, and left there. That
keeps every ladder exactly as reproducible as it was while still giving the
learner the thing they asked for — being put right, on screen, as they speak.

Letting the model mark the answers would have been less code and a worse app.
The schedule is only worth trusting if the same answer is always marked the
same way, and two judges eventually disagree in front of the learner — one
saying "richtig" over a screen showing a red cross. There is no good way to
ask someone to work out which of the two to believe.

So the division is absolute. The model never evaluates, never invents a
question, and never moves on by itself. What is left is the part it is
genuinely good at: asking warmly, hearing a mumbled answer, and explaining a
mistake in one sentence.

### The protocol

The app talks to the tutor in square brackets, which the prompt defines as
stage directions — never read aloud, never mentioned.

| Sent | What the tutor does |
|---|---|
| `[FRAGE] …` | Asks that question in its own warm words, then stops and waits. Never says the answer. |
| `[BEWERTUNG] richtig \| fast \| falsch …` | Reacts in at most two sentences, using the very explanation on screen. |
| `[TAFEL] …` | Two sentences about a grid that is up to be read, not answered. |
| `[PAUSE]` | One encouraging line when an answer has not come for 12 seconds. |
| `[WEITER]` | Asks the same question again, slower. |
| `[GESPRÄCH] …` | Opens a stretch of conversation on a theme, steers it towards one grammar point, and leaves the microphone open. Here — and only here — it corrects the learner's German itself. |
| `[ENDE] …` | One closing line, then the call hangs up. |

During a `[FRAGE]` the tutor must *not* correct: a verdict is already on its
way from the app, and two teachers contradicting each other in the same second
is the failure this whole design exists to prevent.

### What the tutor reports back

A correction has to be on screen *before* it is spoken, and everything the
model emits as text is also spoken aloud — so a marker inside the reply would
be read out. The channel is function calling, which travels as its own frame on
the socket: structured, silent, matched back by an id.

| Tool | Called when |
|---|---|
| `report_correction` | Immediately before saying a correction out loud. The classroom renders it as a full-width slab, struck wrong sentence above, corrected sentence below in the "right" colour. |
| `report_answer` | After the learner answers a question the tutor asked on its own account during conversation. Logged for the summary and the book of errors; never allowed near a streak. |

Two properties of this model decide the implementation, and both are in
`src/realtime.ts`:

- **It is synchronous only.** `gemini-3.1-flash-live-preview` has no
  `NON_BLOCKING` behaviour: the tutor produces no further audio until the
  browser sends `toolResponse`. That is exactly the ordering the feature wants
  — the correction lands while the tutor is silent — but it means the handler
  must be synchronous and cheap. Anything awaited inside it is dead air the
  learner hears, so the classroom renders, returns, and persists afterwards.
- **An unanswered call wedges the session permanently.** Every entry in a
  `toolCall` frame is answered, including one nobody could make sense of, and
  all of them in one `toolResponse`. The branch sits *before* the
  `serverContent` bail-out, because a tool call carries no `serverContent` and
  would otherwise be swallowed in silence.

Between a question and its verdict the learner speaks, and the model takes a
turn of its own whether we want it to or not. It is instructed to answer that
turn with a single word — "mhm", "okay" — and never with a judgement, because
the verdict is not its to give and is already on its way.

Two invariants hold the rest together:

- **Nothing is ever said over the tutor.** The Live API will happily accept a
  turn mid-sentence; the result is two voices at once and a question the
  learner half-heard. Instructions therefore queue and go out on `onTurnEnd`,
  when the floor is genuinely free.
- **The microphone is shut between turns.** It opens when a question has
  finished being read and closes the moment an answer lands. The cost is that
  the learner cannot cut in while the question is being read — the orb and the
  status line say whose turn it is. The alternative is worse: a tutor that
  hears itself would transcribe its own question as the answer and mark it,
  silently, against the schedule.

### One question per word, and a card to type it into

A word is asked once, for its meaning. It was three questions — article,
meaning, plural — until the first real class, where it became obvious that
"wie heißt der Artikel von Entscheidung?" is a quiz question rather than
German, and that three of them a word eat the first ten minutes. The article
rides along everywhere the word is shown or spoken instead, and the case forms
are drilled by the paradigm tables, which is where a rule belongs.

Every closed question is also written on the screen, on a card with a field in
it, because speaking is not always possible — a train, a shared office, a word
the microphone keeps mishearing. Saying it and typing it are the same answer:
both land in `ClassTutor.answer`/`settle`, are marked by the same grader and
get the same spoken reaction. Typing skips `readSpokenAnswer`, which exists to
pull an answer out of "ähm, ich glaube der" — someone who typed *der* meant
*der*, and putting typed text through leniency built for speech is how "das ist
der Lehrer" starts counting as an article. An answer typed before the tutor has
finished asking is held and applied the moment the floor is free, because
nobody reading a card waits for the voice to stop.

There are therefore two strings per question. `direction` is what the tutor is
told — a stage direction, never a script, *"Frage nach dem Plural von „die
Reise“."* — and `question` is what the board says. Both live in
`src/agenda.ts`, and the direction is written to be *heard*: "Partizip II" is
spelled "Partizip zwei", because a model reading the first version aloud says
"Partizip zwei Strich Strich" often enough to matter.

A cell whose question would answer itself is never asked. The article and
pronoun grids are asked by declining their own nominative — *wie heißt "der" im
Akkusativ?* — so the nominative cells would be asking what *der* is in the
nominative. They are computed out rather than listed out, from whether the
answer is the anchor, so a reordered table cannot bring them back.

The answers themselves never leave the browser. A model told what `die Reise`
means will, somewhere across forty questions, say so before the learner does —
not out of malice, but because confirming is what a helpful speaker does. It is
given the day's words as *cues* so it can weave them into the conversation, and
never their meanings, plurals or table cells.

### What is on the screen, and for how long

The transcript keeps the whole class and is scrollable to the top of it. It
follows the conversation only while the learner is already at the bottom;
scroll back to re-read something and it stops moving under you and offers a way
back down. It is not persisted — the day's summary is the record.

A correction is the opposite: it is not a log entry at all. It appears over the
foot of the transcript, holds for as long as its own text takes to read, and
removes itself. That is a deliberate reversal of the first version, where a
correction sat in the log for the rest of the class and buried the conversation
under things already understood. Nothing is lost by it vanishing — every
correction is in the day's summary and, if it was a graded answer, in the book
of errors on its 3/7/21 ladder.

Nothing the app says to the tutor is ever shown. Stage directions are stripped
in `ClassTutor` before a line can reach a bubble, on both sides of the
conversation, because the app is the one participant that knows for certain
which strings are instructions. That guard exists because the first real class
printed `[BEWERTUNG] falsch. Der Lernende sagte: …` straight into the
learner's transcript.

### Hearing an answer

`src/speech.ts` stands between the transcript and the grader, and the grader
itself is untouched. A typed field contains "der" because that is what was
typed; speech arrives as "ähm, ich glaube der" or "das ist der Lehrer", and all
of those are the same answer. The leniency belongs to speech alone — typing
"das ist der Lehrer" into the article box really is the wrong answer.

The rules are narrow on purpose:

- Hesitation and lead-ins come off, in both languages.
- For a closed question — article, auxiliary — the one word from the set is
  picked out of whatever was said around it.
- For an open one, an accepted answer said inside a whole sentence counts, but
  **only if exactly one** appears. "Dem oder den" is hedging, not answering,
  and goes through unchanged for the grader to reject.
- Nothing is ever invented. A learner who says nothing useful still gets it
  wrong, which is the entire point of asking.

One trap found while testing and worth not re-introducing: several obvious
fillers are also real answers. "Er" and "um" read as hesitation in English and
are hesitation in German too — and they are also a personal pronoun and an
accusative preposition, both of them cells in tables this app drills. Stripping
them would have deleted the right answer and marked it wrong, on exactly the
questions where saying one short word is the whole point. They are out of the
filler list, and a backstop refuses to strip anything that would leave the
answer empty. `test/speech.mjs` pins all of it down.

### Reconnecting mid-class

Google resets the WebSocket roughly every ten minutes, and a class takes
twenty-five. That reset is handled inside `realtime.ts` (see *No time limit*
below): the socket is reopened on the same session with its resumption handle,
the microphone and player are kept, and the tutor carries on with the same
question after a second's pause. `ClassTutor`'s own reconnect path remains for
a genuinely dead session — it puts the outstanding question back rather than
skipping it — and a class costs exactly one of the day's sessions unless it has
to mint a fresh token.

### When the voice gives out

There is no typed round to fall back to, so this had to be answered rather than
inherited. What happens is: **the class stays open, and nothing is lost.**

- The classroom shows the failure in plain words — `describeVoiceError` is the
  only source of that prose — with a *Noch einmal verbinden* button.
- **End class stays enabled in every failed state.** A class that could not
  connect still happened, and the learner must be able to close it and get its
  summary rather than being trapped on an error screen.
- Break and the home icon both keep the class open. Every answer given before
  the failure is already written down: `live_class` is saved after each one,
  and the ladders are rolled forward when the class is finally closed — by the
  learner, or by the midnight sweep.
- A learner with no Google AI key gets that case discriminated from a network
  failure, with a button into the account panel; the panel opens *over* the
  classroom, so the class is still there behind it.

## How it fits together

```
browser                          our server                    Google
───────                          ──────────                    ──────
tap the orb
  │
  ├── POST /api/realtime-token ──▶ verify Supabase user
  │                                check today's session count
  │                                compose the teacher prompt
  │                                POST /v1alpha/auth_tokens ──▶
  │   ◀── { token, config, … } ◀──  (key never leaves here)  ◀── auth_tokens/…
  │
  └── WebSocket ──────────────────────────────────────────────▶ Live API
        setup { model, ...config } ─────────────────────────────▶
        mic → PCM 16 kHz ──────────────────────────────────────▶
        ◀────────────────────────────────── PCM 24 kHz + transcripts
```

The audio never touches our server. That is what makes it fast, and it is the
constraint that shapes everything else below.

### Whose key

Every learner's sessions run on **their own** Google AI key. They create one
(free) at aistudio.google.com, paste it once into the account panel, and from
then on their speaking practice is billed to them — which, on Google's free
tier and at ten minutes a day, means billed to nobody.

The alternative — one shared key on the server, the way voize.space does it —
means the owner pays for every stranger who signs up, and the only defences are
per-account caps that a second account walks straight past. For a personal app
that could be shared, per-learner keys are the design that lets you hand out
the link without handing out your wallet.

The key is handled like a password:

- It arrives at `/api/voice-key` once, over HTTPS, when saved.
- It is **checked against Google first** (a cheap `models` list call), so a
  mistyped key fails there with a clear message rather than ten seconds into a
  call.
- It is encrypted with AES-256-GCM under `KEY_ENCRYPTION_SECRET` — a secret
  that exists only in the server's environment — and stored in `voice_keys`,
  a table with row-level security on and **no policies**, so nothing but the
  service role can read it.
- It is never sent back to a browser. The account panel is told the last four
  characters, nothing more.
- `/api/realtime-token` decrypts it just long enough to ask Google for a
  session token, then drops it.

A learner without a key gets `403 key_required` and a button to the account
panel. There is no fallback to a shared key, on purpose.

Rotating `KEY_ENCRYPTION_SECRET` makes every stored key undecryptable; the
endpoint treats that as "no key" and learners are simply asked to paste theirs
again.

### The token, and what it does not protect

The session token the browser holds is deliberately weak: single-use, and it
can only *open* a session within 60 seconds of being minted. After that minute
it is good for one thing only — resuming the session it already belongs to,
for up to `VOICE_TOKEN_HOURS` (default 12; Google allows just under 20). It is
derived from the learner's key but is not the key: a leaked token cannot be
used to start anything, only to rejoin a call that is already the learner's.

The browser sends the full setup frame — prompt included — so someone with
devtools open could edit the prompt of their own session. That is their own
session on their own key; the blast radius is themselves.

### Metering counts sessions, not turns

`/api/ai` can count every call because every call passes through it. Voice
cannot. So the limit lives at the only moment we control: token minting.

The ceiling on one account is `AI_DAILY_VOICE_SESSIONS` calls a day (default
12), enforced before any audio flows — and a call has no length limit, so this
is a cap on how often, not how long. With every learner on their own key it is
a seatbelt for *their* quota (a tab left open, a key that leaks), not your
bill, which is why the default is generous. Sessions are counted in `ai_usage`
under `kind = 'voice'`; migration `0004` adds it to
the check constraint.

Without `SUPABASE_SERVICE_ROLE_KEY` the endpoint fails closed. It will not mint
a token it cannot count — the rule `/api/ai` already follows.

## What it costs

Rates for `gemini-3.1-flash-live-preview`: **$0.005 per minute of audio in**,
**$0.018 per minute of audio out**.

A ten-minute conversation where the tutor speaks about four of those minutes:

$$\text{in} = 10 \times \$0.005 = \$0.050$$
$$\text{out} = 4 \times \$0.018 = \$0.072$$
$$\text{total} = \$0.122 \approx 11\text{ cents}$$

| Usage | Per month, **to that learner** |
|---|---|
| 10 min/day | ≈ $3.70 — or nothing, on the free tier |
| At the daily cap | ≈ $66 |

These are each learner's own numbers on their own key. Nothing here reaches
the app owner. A learner who wants a ceiling sets a spend limit in their own
Google Cloud console.

Note that the correct-everything pedagogy costs money as well as time: the
tutor talks more than a tutor who lets slips go, and audio output is the
expensive half. That is the trade being made deliberately.

### Why this provider

OpenAI's Realtime API does the same job at three to ten times the price, and
its bills are harder to predict because conversation history is re-processed
every turn. Gemini keeps session state on its own side, so the per-minute rate
is the rate.

### A note on the free tier

Gemini has a free tier, enough to develop against. On it, Google uses submitted
content to improve its products and human reviewers may see it — **except** that
Google's terms state the paid-tier data rules apply to all services, free ones
included, for developers in the EEA, Switzerland and the UK. From Germany,
free-tier audio is not used for training.

## Files

| Path | What it does |
|---|---|
| `api/realtime-token.ts` | Verifies the learner, loads and decrypts their key, counts the session, composes the teacher prompt, mints the token. |
| `api/voice-key.ts` | Checks a pasted key with Google, encrypts it, stores it; reports last-4; deletes. Never returns a key. |
| `src/voicekey.ts` | Client half of the above. |
| `supabase/migrations/0005_voice_keys.sql` | The `voice_keys` table — RLS on, no policies, service role only. |
| `src/realtime.ts` | The socket, the microphone, the playback queue, the codecs. No DOM. |
| `src/ui/voice.ts` | The panel: mode picker, orb, voice picker, countdown, transcript. No protocol. |
| `src/tutor.ts` | `ClassTutor`: session lifecycle, the bracketed protocol, the turn queue, the two microphone modes, reconnection, and the tool reports. No DOM. |
| `src/agenda.ts` | Today's lesson, computed before the call opens, and how each question sounds when it is asked rather than read. Pure. |
| `src/classrun.ts` | The lesson running: walks the agenda, marks what comes back, tells the tutor the verdict, writes it down. |
| `src/classscore.ts` | What a finished class does to every ladder it touched. Once, at the end. |
| `src/speech.ts` | Transcript in, answer out. Pure, and tested by `test/speech.mjs`. |
| `src/ui/classroom.ts` | The fullscreen classroom: orb, clock, transcript, the correction slab, Break and End class. No protocol. |
| `supabase/migrations/0004_voice_sessions.sql` | Adds `'voice'` to the `ai_usage` kinds. |

### Audio, concretely

Input is PCM, signed 16-bit little-endian, mono, **16 kHz**. Output is the same
at **24 kHz**. Both are fixed by the API.

Capture asks for an `AudioContext` at 16 kHz so the browser resamples rather
than us, taps it with an `AudioWorklet` built from a blob (no bundler wiring),
and falls back to `ScriptProcessorNode` where needed. Playback schedules each
chunk to begin where the previous ended; an `interrupted` message drops the
whole queue, which is what makes cutting in feel instant.

`thinkingConfig: { thinkingLevel: "minimal" }` is set on purpose. Reasoning time
is the one thing a spoken exchange cannot afford — a tutor who pauses to think
before every sentence stops feeling like a conversation.

`contextWindowCompression` is on, which is what lets a session run past the
15-minute audio limit the API otherwise imposes.

## No time limit

A call runs until the learner ends it. Three things make that true:

- **The token lasts hours, not minutes.** `expireTime` is `VOICE_TOKEN_HOURS`
  ahead (default 12). Google's rule is that a single-use token may still be
  used to *resume* its session for as long as it is valid, so one token covers
  one call of any length.
- **Session resumption.** The setup config carries `sessionResumption: {}`;
  the server then sends `sessionResumptionUpdate { newHandle, resumable }` as
  the call goes on, and `realtime.ts` keeps the latest handle. When Google
  announces a reset (`goAway`) or the socket drops for any reason other than a
  rejection (close codes 1007/1008), the client reopens the socket and sends
  the setup again with `sessionResumption: { handle }`. The conversation, the
  microphone tap and the player all carry over; a resumed session gets no
  opener and no second `onReady`. If the token itself is about to expire, a
  fresh one is minted first — that counts as a new session for the day, which
  is the honest thing to count.
- **A clock instead of a countdown.** `VoiceSession.elapsed()` is seconds since
  the call connected. The panel and the tutor strip show it as `m:ss` (or
  `h:mm:ss`), ticking every second.

## Playing on with the screen locked

Phones treat a page that merely makes sounds through Web Audio as a tab, and
suspend it when the screen locks. They treat a page with a playing `<audio>`
element as media — it keeps going, it appears on the lock screen, and a
microphone or socket it holds is left alone, the way a call is. So the tutor's
voice is not played straight into the audio context's destination but into a
`MediaStreamAudioDestinationNode` whose stream feeds a hidden `<audio>`
element (`Player` in `realtime.ts`). The Media Session API supplies the
lock-screen title and makes its pause/stop buttons hang up.

A screen wake lock (`navigator.wakeLock`) is taken for the length of the call
as well, and re-taken whenever the page becomes visible again, so the phone
does not lock itself mid-sentence in the first place — that is the common
failure, not the deliberate lock.

What this does not do: survive the app being closed, or the browser being
swiped away. It also depends on the phone honouring a playing media element
in a web app; iOS has done so for WebRTC-style pages since iOS 14, Android
Chrome for longer. Podcasts (`player.ts`) use the same mechanism with a plain
`<audio src>` and get the full lock-screen transport: play, pause, ±15 s and
scrubbing.

## Switching it on

1. Run `supabase/migrations/0004_voice_sessions.sql` and
   `0005_voice_keys.sql` in the SQL editor.
2. In Vercel → Settings → Environment Variables, for Production and Preview:
   `KEY_ENCRYPTION_SECRET` (any long random string), `AI_DAILY_VOICE_SESSIONS`,
   `VOICE_TOKEN_HOURS` (optional), and `VITE_VOICE_ENABLED=true` as a Config
   variable. `VOICE_SESSION_MINUTES` is no longer read.
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are shared with `/api/ai`.
   `GOOGLE_API_KEY` is no longer read and can be deleted.
3. Redeploy, then open `/api/realtime-token` in a tab: it lists which settings
   are present.
4. Each learner — you included — pastes their own key in the account panel.
   `aistudio.google.com/apikey` → Create API key, no billing needed.

## Verified on the first live run (2026-09-13)

Three things could only be settled against the real endpoint, and all three
now are:

- **The token goes in `?access_token=`.** The constrained endpoint opens with
  it. The `?key=` fallback has been removed.
- **Generation settings must sit under `generationConfig`.** Placed one level
  up, the socket opens and then closes with `1007: Unknown name
  "responseModalities" at 'setup'`. That close reason now reaches the panel
  verbatim instead of being reported as a network problem.
- **The model does not speak first on its own.** With the prompt alone the
  session sits open and silent. One `clientContent` user turn sent right after
  `setupComplete` — the `opener` the token endpoint returns — produced a
  9-second German greeting with first audio 570 ms later.

## Known limits

- Reconnection has been verified against the API's documented handshake, not
  yet against a long live call: the first ten-minute reset on a real phone is
  the thing to watch. If it fails, the panel reports it as a connection error
  rather than silently ending.
- Lock-screen playback is best effort on the web platform (see *Playing on
  with the screen locked*); closing the app ends the call.
- The model starts each call with no memory of the last one, and the
  transcript is display only — there is no conversation history in the
  database. What *is* remembered is the part that matters: every wrong answer
  and every correction goes into `public.mistakes` and comes back on day 3,
  day 7 and day 21, and every class leaves a row in `public.classes` that the
  profile's calendar reads a year later.
- Whether the model calls its tools reliably at `thinkingLevel: "minimal"` is
  the thing to watch on a real call. The class does not wait for a tool call
  and never blocks on one; a class that ends with no reports is a signal to
  raise the thinking level, not an error to show the learner.
