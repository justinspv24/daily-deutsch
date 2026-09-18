# Daily Deutsch

A daily German drill for learners working from A1 towards B2: a vocabulary
check, grammar tables practised as real sentences, and a spaced-repetition
review that brings back exactly what you got wrong.

It is an accounts app: you create an account with an e-mail address and a
password, confirm the address through the link Supabase sends, and from then
on sign in with the password (there is a reset link for when it is forgotten,
and the account panel lets you change it). The first thing a new learner does
after that is pick a level — A1, A2, B1 or B2. Each level has
its own vocabulary, table sentences, review topics and "up next" suggestions,
and the daily suggestion is rotated per learner, so two people at the same
level are not shown the same thing. Progress is stored per account and follows
you to any device; the level can be changed at any time from the account panel.

A round has four steps, and they are not a queue: the stepper across the top
is clickable, so vocabulary, tables and review can be done in any order and
left half-finished. Each question is graded once however often you pass it.

The round can also be **done out loud**. *Mit Lehrer sprechen* on the home
screen opens the same round with a teacher who reads every question, hears the
answer and says something about it before the next one — the vocabulary card
becomes three spoken questions, the way a teacher has always asked them. The
app still does the marking: the voice reacts to the verdict it is given, so
what you hear and what is on screen can never disagree. If the voice gives out,
the round carries on as a typed one from wherever it had got to.

*Lehrplan* on the home screen opens the **syllabus**: all four levels, twelve
sections each, with what you can do after each one, its grammar (with
diagrams), the core vocabulary and links to where it is taught — built on the
Goethe-Institut and telc exam objectives. The level picker links to it too,
so a learner can see what B1 covers before deciding they are not there yet.
`docs/syllabus.md` records the sources.

Alongside the bundled banks, a learner can **add their own words** from the
home screen or the progress page. An added word is drilled exactly like a bank
word and leaves the drill after two consecutive fully-correct answers. Those
live in `custom_vocab`, one row per learner, so they sync across devices and
stay private.

Without Supabase configured (the test suites, a bare checkout) there is no
sign-in and the drill opens directly on the A2 bank with progress kept in the
browser.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then dist/
npm test           # two headless suites, no network
```

## Deploying it

Three services, in this order. Nothing here needs a paid plan.

### 1. Supabase — the database

1. [supabase.com](https://supabase.com) → **New project**. Pick a region near
   your users (`eu-central-1` for Germany). Save the database password
   somewhere safe; you will not need it for this app.
2. **SQL Editor** → run every file in `supabase/migrations/` in order. That
   creates the tables, the sign-up trigger, and the row-level security
   policies that keep each learner's rows private.
3. **Authentication → Providers → Email**: turn on *Email*, leave *Confirm
   email* on, and leave *Enable email provider password* on — accounts here
   are an address plus a password, and the confirmation link is what activates
   them.
4. **Authentication → URL Configuration**: set *Site URL* to your Vercel
   domain once you have it, and add `http://localhost:5173` to *Redirect URLs*
   so sign-in works while developing.
5. **Project Settings → API**: copy the *Project URL* and the *anon* key.

The anon key is meant to be public — it is in every browser that loads the
site. What protects the data is row-level security, which is why step 2 is not
optional. The *service_role* key is the opposite: it bypasses every policy, so
it belongs only in Vercel's environment variables, never in this repository.

### 2. GitHub — the repository

```bash
cd D:\Deutsch\daily-deutsch
git init
git add .
git commit -m "Daily Deutsch: drill, spaced repetition, Supabase sync"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/daily-deutsch.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `dist`, `.vercel` and every
`.env` file. Check `git status` before the first push and confirm no `.env`
appears — a leaked key is the one mistake that is genuinely expensive here.

### 3. Vercel — the hosting

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the
   GitHub repository. It detects Vite; `vercel.json` covers the rest.
2. **Settings → Environment Variables**, for Production *and* Preview:

   | Name | Value | Reaches the browser? |
   |---|---|---|
   | `VITE_SUPABASE_URL` | your project URL | yes, by design |
   | `VITE_SUPABASE_ANON_KEY` | the anon key | yes, by design |
   | `VITE_AI_ENABLED` | `false` for now | yes |

3. Deploy. Copy the resulting URL back into Supabase's *Site URL* from step 1.4.

Every push to `main` redeploys; every pull request gets its own preview URL.

## Signing in

Two doors, same account system: **Sign in with Google** (one click, through
Supabase's OAuth) or an e-mail address and password. Either way Supabase holds
the credentials and this app only ever sees a session.

Google sign-in needs a one-time setup — see "Google sign-in" below.

## Turning the assistant on, later

Four things sit behind one switch: the `cc` chat with a German teacher, the
`tt` translator that detects direction automatically, the `vv` voice mode —
a live spoken conversation — and the spoken round, where the same teacher reads
the daily drill out and listens to the answers.

All three run on Google's Gemini — text through `api/ai.ts`, voice through the
Live API in `api/realtime-token.ts` — and all three run on **each learner's
own** Google AI key, which they save once in the account panel. You never pay
for anyone else's practice; a learner without a key is told so and pointed at
where to get one (free, at aistudio.google.com). `docs/realtime-voice.md` has
the full picture.

To switch it on: run migrations `0004` and `0005`, add these to Vercel (no
`VITE_` prefix, so they never leave the server), and set `VITE_AI_ENABLED=true`
as a **Config** variable (Vercel refuses to save a `VITE_` variable as Secret):

| Name | Where it comes from |
|---|---|
| `KEY_ENCRYPTION_SECRET` | any long random string, e.g. `openssl rand -base64 48` |
| `SUPABASE_URL` | same project URL as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API Keys → Legacy → service_role |
| `AI_DAILY_CHAT_LIMIT` · `AI_DAILY_TRANSLATE_LIMIT` · `AI_DAILY_VOICE_SESSIONS` · `VOICE_SESSION_MINUTES` | optional; sensible defaults |
| `GEMINI_TEXT_MODEL` | optional; defaults to `gemini-3.5-flash-lite` |

`ANTHROPIC_API_KEY` and `GOOGLE_API_KEY` are no longer read and can be deleted.

`https://<your-site>/api/ai` and `/api/realtime-token` opened in a browser
each report which settings are present, so a misconfigured deployment says so
instead of failing with a generic error.

### Google sign-in

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs &
   Services → **Credentials** → Create credentials → **OAuth client ID** →
   Web application. Under *Authorised redirect URIs* add
   `https://YOUR-PROJECT.supabase.co/auth/v1/callback`. Copy the client ID and
   client secret.
2. Supabase → Authentication → **Providers** → Google → enable, paste both.
3. Supabase → Authentication → **URL Configuration**: *Site URL* is your Vercel
   domain; *Redirect URLs* includes it and `http://localhost:5173`.

No code change is involved; the button in the sign-in screen calls Supabase,
and Supabase does the rest.

### Two things to understand

**A Gemini subscription is not a Gemini API key.** Subscriptions cover
Google's own apps; the key a learner pastes here comes from AI Studio and has
its own (free) quota.

**The endpoints refuse to run unmetered.** All of them require a signed-in
learner and fail closed without `SUPABASE_SERVICE_ROLE_KEY`. Chat and
translation count calls per learner per day in `ai_usage`; voice counts
sessions there too. Since every learner is on their own key, those caps
protect the learner's quota — a runaway tab, a leaked key — rather than
anyone else's bill.

## How it is put together

```
api/ai.ts              chat + translator on Gemini, on the learner's own key
api/realtime-token.ts  mints Live API tokens on the learner's own key
api/voice-key.ts       checks, encrypts and stores that key; never returns it
src/
  main.ts              app controller — routes, session lifecycle, storage switching
  config.ts            build-time environment, and what does not reach the browser
  auth.ts              Supabase client, password sign-up/in/reset, session changes
  repository.ts        storage interface + the merge that runs on first sign-in
  repositories/        local (this browser) and supabase (this learner)
  ai.ts                client half of /api/ai
  realtime.ts          the voice socket: mic capture, playback, codecs
  tutor.ts             the spoken round: turn protocol, queue, reconnection
  tutorscript.ts       how each question sounds asked rather than read
  speech.ts            transcript in, answer out — speech-only leniency
  voicekey.ts          client half of /api/voice-key
  grading.ts           answer judging (exact, umlaut-near, lenient English)
  scheduler.ts         the 1·3·7·21·35 review ladder and streak counting
  session.ts           builds a round: which words, sentences and topics
  i18n.ts              the whole interface in German and English
  theme.ts             light/dark, stored, applied before first paint
  shortcuts.ts         cc / tt / vv double-tap detection
  data/                the question banks, one per level
  data/syllabus/       the map of every level: sections, grammar, words, links
  ui/                  shell, login, level, home, drill, summary, progress,
                       syllabus, addword, account, chat, translate, voice
  ui/illustrations.ts  the grammar diagrams: frames, grids, contrasts, timelines
  styles/              tokens → base → components → overlay → syllabus
supabase/migrations/   the schema, including row-level security
test/
  drill.mjs            plays two full rounds in jsdom: all wrong, then all right
  repository.mjs       normalisation, the sign-in merge, and its idempotence
  speech.mjs           what somebody said becoming the answer that gets graded
  syllabus.mjs         the syllabus holds together: ids, diagrams, trusted links
```

### The merge on sign-in

The interesting bit. Someone drills anonymously, then signs in — and may
already have progress in the account from another device. Neither side is
authoritative, so for each item the further-along value wins: the higher
streak, the higher review stage (with *its own* due date, or the schedule
would lie), the later date, and the union of rounds played. Merging twice
changes nothing, so a second sign-in cannot inflate anyone's history.

`test/repository.mjs` pins all of that down, because getting it wrong destroys
someone's streaks silently, which is the worst kind of bug this app could have.

### Two languages, two themes

The interface switches between German and English from the top bar; German is
the default and prints the English underneath, following the immersion rule.
The German *content* never changes — only the scaffolding around it. Light and
dark are both fully specified as tokens and chosen explicitly, with the stored
choice applied by a small inline script before first paint.
