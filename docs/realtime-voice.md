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

## The tutor who runs the round

`vv` is a room you go into. The **spoken drill** is the opposite: the tutor
sits with the learner for the whole daily round, reads every question out,
hears the answer, and says something about it before the next one. It starts
from the home screen — *Mit Lehrer sprechen* beside the ordinary *Drill
starten* — and it is the same round either way. Same questions, same order,
same grading, same effect on the schedule. It has simply acquired a voice.

Offered as its own door rather than a setting on purpose: doing the round out
loud is a different way to spend half an hour — headphones and a quiet room, or
a keyboard on the train — and that is a choice made fresh each morning, not once
in a preferences panel.

### The app judges, the tutor speaks

This is the load-bearing decision. Every answer is graded by `grading.ts`,
exactly as a typed one is, and that verdict is what reaches the streaks and the
review ladder. The tutor is told the verdict *afterwards* and reacts to it.

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
| `[ENDE] …` | One closing line, then the call hangs up. |

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

### Three questions where the screen shows one

The vocabulary card has three boxes — article, meaning, plural — and a learner
fills them in whatever order they like. Nobody asks all three at once out loud,
so spoken it becomes three questions, which is how a teacher has always done
it: *der, die oder das?* … *und was heißt das auf Englisch?* … *und der
Plural?* Each answer lands in its own box as it is given, so what the tutor
heard is visible while the next question is asked.

Phrasing lives in `src/tutorscript.ts` and is written to be *heard*: "Partizip
II" is spelled "Partizip zwei" there, because a model reading the first version
aloud says "Partizip zwei Strich Strich" often enough to matter.

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

### Reconnecting mid-round

A round takes about 25 minutes and a session lasts `VOICE_SESSION_MINUTES`, so
the token expires part-way through — every time, not occasionally. A clean
close mid-round is treated as exactly that: the tutor reconnects, puts the
current question back, and the learner notices a pause. Up to three times, then
it gives up and says so, because each reconnection spends one of the day's
sessions. A spoken round therefore costs two or three of the default twelve.

If the voice gives out at any point — no key, no microphone, no network — the
round does not. The strip says what happened, the caret is handed back to the
first field, and it carries on as a typed round from wherever it had got to.
The ✕ in the strip does the same thing on purpose.

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

The session token the browser holds is deliberately weak: single-use, expires
after `VOICE_SESSION_MINUTES`, and can only *open* a session within 60 seconds
of being minted. It is derived from the learner's key but is not the key —
a leaked token cannot be used to start anything after that minute.

The browser sends the full setup frame — prompt included — so someone with
devtools open could edit the prompt of their own session. That is their own
session on their own key; the blast radius is themselves.

### Metering counts sessions, not turns

`/api/ai` can count every call because every call passes through it. Voice
cannot. So the limit lives at the only moment we control: token minting.

The ceiling on one account is `AI_DAILY_VOICE_SESSIONS × VOICE_SESSION_MINUTES`
— at the defaults, 3 hours a day, enforced before any audio flows. With every
learner on their own key this is a seatbelt for *their* bill (a tab left open,
a key that leaks), not yours, which is why the defaults are generous. Sessions
are counted in `ai_usage` under `kind = 'voice'`; migration `0004` adds it to
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
| `src/tutor.ts` | The spoken round: session lifecycle, the bracketed protocol, the turn queue, reconnection. No DOM. |
| `src/tutorscript.ts` | How each question sounds when it is asked rather than read. Pure. |
| `src/speech.ts` | Transcript in, answer out. Pure, and tested by `test/speech.mjs`. |
| `src/ui/drill.ts` | The strip above the question, and the wiring that puts a spoken answer through the same grader as a typed one. |
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

## Switching it on

1. Run `supabase/migrations/0004_voice_sessions.sql` and
   `0005_voice_keys.sql` in the SQL editor.
2. In Vercel → Settings → Environment Variables, for Production and Preview:
   `KEY_ENCRYPTION_SECRET` (any long random string), `AI_DAILY_VOICE_SESSIONS`,
   `VOICE_SESSION_MINUTES`, and `VITE_VOICE_ENABLED=true` as a Config variable.
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

- `sessionResumption` is not implemented. The WebSocket itself is dropped by
  Google at roughly 10 minutes; `VOICE_SESSION_MINUTES` defaults to 10 to stay
  inside that. Going longer means handling the resumption handshake.
- `goAway` is treated as the end of the call.
- The model starts each call with no memory of the last one. The panel keeps
  the transcript on screen for the session, but that is display only — there is
  no conversation history in the database yet, and no cross-session insight into
  which mistakes keep recurring. That is the obvious next feature: the drill
  already has `mistakes_tracker` thinking, and voice corrections are exactly the
  same kind of data.
