# Voice mode

The `vv` panel is a live phone call with the teacher: the learner talks, the
teacher answers, and either can interrupt the other. This note explains how it
works, what it costs, and what to check when it misbehaves.

## Why it was rebuilt

The first version was a relay. The browser's `SpeechRecognition` turned speech
into text, the text went to Claude through `/api/ai`, and the browser's
`speechSynthesis` read the answer back. It worked, and it was nearly free, but
it had three problems that no amount of tuning would fix:

- **It was slow.** Three hops meant two to four seconds between the learner
  finishing a sentence and hearing anything back. Long enough to feel like a
  form submission rather than a conversation.
- **It sounded wrong.** Browser voices read German with an English mouth. For
  an app whose whole purpose is pronunciation, that is not a cosmetic problem.
- **It was turn-based.** Tap, speak, wait, listen, tap. Real conversation
  overlaps; this could not.

The rebuild replaces all three pieces with one model that hears audio and
speaks audio directly — Google's `gemini-3.1-flash-live-preview`, over the Live
API. Latency drops to roughly half a second, the German is native, and the
learner can cut in mid-sentence.

The `cc` chat and the `tt` translator still run on Claude through `/api/ai`.
Only voice changed providers.

## How it fits together

```
browser                          our server                    Google
───────                          ──────────                    ──────
tap the orb
  │
  ├── POST /api/realtime-token ──▶ verify Supabase user
  │                                check today's session count
  │                                POST /v1alpha/auth_tokens ──▶
  │   ◀── { token, model, … } ◀──  (key never leaves here)   ◀── auth_tokens/…
  │
  └── WebSocket ──────────────────────────────────────────────▶ Live API
        mic → PCM 16 kHz ──────────────────────────────────────▶
        ◀────────────────────────────────── PCM 24 kHz + transcripts
```

The audio never touches our server. That is what makes it fast, and it is also
the constraint that shapes everything else below.

### The token is the security boundary

The browser holds the socket, so the browser holds a credential. That
credential is deliberately weak:

- It expires after `VOICE_SESSION_MINUTES` (default 10).
- It can only *start* a session within 60 seconds of being minted. A token that
  leaks afterwards cannot open anything.
- It is single-use (`uses: 1`).
- It carries `liveConnectConstraints`, which pin the model, the system prompt,
  the voice and the transcription settings **server-side**.

That last one matters most. The endpoint is called
`BidiGenerateContentConstrained` precisely because it refuses a setup that
disagrees with the token. A learner cannot open devtools and talk the tutor
into being something else, or re-point the socket at a more expensive model.
The client's `setup` message therefore sends only the model name; everything
else is already fixed.

### Metering counts sessions, not turns

`/api/ai` can count every call because every call passes through it. Voice
cannot — the audio goes straight to Google. So the only moment we control is
the one where a token is issued, and that is where the limit lives.

The ceiling on one account is `AI_DAILY_VOICE_SESSIONS × VOICE_SESSION_MINUTES`.
At the defaults that is 60 minutes a day, enforced before any audio flows.
Sessions are counted in `ai_usage` under `kind = 'voice'`, alongside chat and
translate; migration `0004` adds it to the check constraint.

If `SUPABASE_SERVICE_ROLE_KEY` is missing the endpoint fails closed. It will
not mint a token it cannot count — the same rule `/api/ai` follows.

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
| One learner, at the daily cap (60 min/day) | ≈ $22 |
| 100 learners, 10 min/day | ≈ $370 |

Set a spend limit in the Google Cloud console as well. The per-account cap
protects you from one learner; only a spend limit protects you from a hundred.

### Why this provider

OpenAI's Realtime API does the same job. It costs three to ten times more, and
its bills are harder to predict because the conversation history is
re-processed every turn — real sessions commonly run 2–5× the base estimate
without aggressive caching. Gemini keeps session state on its own side, so the
per-minute rate is the rate.

### A note on the free tier

Gemini has a genuinely free tier, and it is enough to develop against. Read
Google's terms before pointing it at other people: on the free tier Google uses
submitted content to improve its products, and human reviewers may see it.

There is an exception that matters here. Google's terms state that for
developers in the EEA, Switzerland and the UK, the paid-tier data rules apply
to all services including the free ones. If that is where you are, free-tier
audio is not used for training.

## Files

| Path | What it does |
|---|---|
| `api/realtime-token.ts` | Verifies the learner, counts the session, mints the constrained token. The only place `GOOGLE_API_KEY` exists. |
| `src/realtime.ts` | The socket, the microphone, the playback queue, the codecs. No DOM. |
| `src/ui/voice.ts` | The panel: orb, voice picker, countdown, transcript. No protocol. |
| `supabase/migrations/0004_voice_sessions.sql` | Adds `'voice'` to the `ai_usage` kinds. |

### Audio, concretely

Input is PCM, signed 16-bit little-endian, mono, **16 kHz**. Output is the same
at **24 kHz**. Both are fixed by the API.

Capture asks for an `AudioContext` at 16 kHz so the browser resamples rather
than us, taps it with an `AudioWorklet` built from a blob (no bundler wiring),
and falls back to `ScriptProcessorNode` on browsers that need it. Playback
schedules each chunk to begin where the previous one ended; an `interrupted`
message drops the whole queue, which is what makes cutting in feel instant.

## Switching it on

1. `aistudio.google.com` → **Get API key**.
2. Run `supabase/migrations/0004_voice_sessions.sql` in the SQL editor.
3. In Vercel → Settings → Environment Variables, for Production and Preview:
   `GOOGLE_API_KEY`, `AI_DAILY_VOICE_SESSIONS`, `VOICE_SESSION_MINUTES`, and
   `VITE_VOICE_ENABLED=true`. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   are shared with `/api/ai` and are probably already set.
4. Redeploy. The `vv` panel explains itself if anything is missing rather than
   failing silently.

## Two things to verify on the first live run

Both are cheap to check and cheap to fix, and neither could be tested from the
sandbox this was written in.

**The token query parameter.** The client opens the socket with
`?access_token=…` and retries once with `?key=…` if that is refused, because
Google has spelled it both ways across versions. Open devtools → Network → WS
and see which one connects. Once you know, delete the loser from the `params`
array in `open()` — the retry costs a few seconds on a failed connect.

**The `setup` handshake.** The client sends only `{ setup: { model } }` and
relies on the token's constraints for the rest. If the teacher answers in
English, or in the wrong voice, the constraints are not being applied — in that
case move the `config` block from `liveConnectConstraints` in
`api/realtime-token.ts` into the client's `setup` message. Keep the constraints
too: they are what stops a learner from overriding it.

## Known limits

- Audio-only sessions cap at 15 minutes server-side, and the WebSocket itself
  at about 10. `VOICE_SESSION_MINUTES` defaults to 10 to stay inside both.
  Going longer means implementing `sessionResumption`, which the protocol
  supports and this code deliberately does not.
- `goAway` is treated as the end of the call. The learner sees "call ended" and
  can start another; their daily count goes down by one.
- The model starts each call with no memory of the last one. The panel keeps
  the transcript on screen for the session, but that is display only.
