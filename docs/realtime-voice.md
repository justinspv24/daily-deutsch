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

The `cc` chat and the `tt` translator still run on Claude through `/api/ai`.
Only voice changed providers, because Anthropic's API is text-only and a spoken
tutor needs a model with ears.

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

### The token, and what it does not protect

The token is deliberately weak: single-use, expires after
`VOICE_SESSION_MINUTES`, and can only *open* a session within 60 seconds of
being minted. A token that leaks afterwards cannot start anything.

What it does **not** do is pin the config. The browser sends the full setup
frame — prompt included — so someone with devtools open could edit the prompt
of their own session. For a personal learning app that is an acceptable trade:
the blast radius is their own conversation, and the spend cap sits at token
minting where they cannot reach it.

Google's API does support pinning this server-side, via
`liveConnectConstraints` on the token. If this ever serves people other than
you, that is the upgrade: move the `config` block into the token request and
have the client send only `{ setup: { model } }`.

### Metering counts sessions, not turns

`/api/ai` can count every call because every call passes through it. Voice
cannot. So the limit lives at the only moment we control: token minting.

The ceiling on one account is `AI_DAILY_VOICE_SESSIONS × VOICE_SESSION_MINUTES`
— at the defaults, 60 minutes a day, enforced before any audio flows. Sessions
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

| Usage | Per month |
|---|---|
| One learner, 10 min/day | ≈ $3.70 |
| One learner, at the daily cap | ≈ $22 |
| 100 learners, 10 min/day | ≈ $370 |

Set a spend limit in the Google Cloud console too. The per-account cap protects
you from one learner; only a spend limit protects you from a hundred.

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
| `api/realtime-token.ts` | Verifies the learner, counts the session, composes the teacher prompt, mints the token. The only place `GOOGLE_API_KEY` exists. |
| `src/realtime.ts` | The socket, the microphone, the playback queue, the codecs. No DOM. |
| `src/ui/voice.ts` | The panel: mode picker, orb, voice picker, countdown, transcript. No protocol. |
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

1. `aistudio.google.com` → **Get API key**.
2. Run `supabase/migrations/0004_voice_sessions.sql` in the SQL editor.
3. In Vercel → Settings → Environment Variables, for Production and Preview:
   `GOOGLE_API_KEY`, `AI_DAILY_VOICE_SESSIONS`, `VOICE_SESSION_MINUTES`, and
   `VITE_VOICE_ENABLED=true`. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   are shared with `/api/ai` and are probably already set.
4. Redeploy. The panel explains itself if anything is missing rather than
   failing silently.

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
