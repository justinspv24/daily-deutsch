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
2. **SQL Editor** → paste `supabase/migrations/0001_init.sql` → **Run**. That
   creates the tables, the sign-up trigger, and the row-level security
   policies that keep each learner's rows private.
3. **Authentication → Providers → Email**: turn on *Email*, and leave
   *Confirm email* on. Turn **off** *Enable email provider password*, since
   this app only uses magic links.
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

## Turning the assistant on, later

`api/ai.ts` is written and waiting. It backs two things: the `cc` chat with a
German teacher, and the `tt` translator that detects direction automatically.
Both stay hidden in the interface until you enable them, which is deliberate —
they are the only part of this project that costs money.

To switch them on, add these to Vercel (no `VITE_` prefix, so they never leave
the server) and set `VITE_AI_ENABLED=true`:

| Name | Where it comes from |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `SUPABASE_URL` | same project URL as above |
| `SUPABASE_ANON_KEY` | same anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `AI_DAILY_CHAT_LIMIT` | e.g. `40` |
| `AI_DAILY_TRANSLATE_LIMIT` | e.g. `120` |

Two things to understand before you do:

**A Claude.ai subscription cannot pay for this.** Subscriptions cover
Anthropic's own apps only; a site you host needs an API key with its own
billing. They are separate products.

**The endpoint refuses to run unmetered.** It requires a signed-in learner, and
without `SUPABASE_SERVICE_ROLE_KEY` it fails closed rather than serving calls
it cannot count. Every call increments a per-learner daily counter in
`ai_usage`, which learners can read but only the server can write. On Haiku a
translation is roughly 0.07 cents and a chat turn about 0.3 cents, so the
default limits cap one learner at well under a euro a day — but set a spend
limit in the Anthropic console too, as a floor under the whole thing.

## How it is put together

```
api/ai.ts              serverless endpoint: the only place the API key exists
src/
  main.ts              app controller — routes, session lifecycle, storage switching
  config.ts            build-time environment, and what does not reach the browser
  auth.ts              Supabase client, magic-link sign-in, session changes
  repository.ts        storage interface + the merge that runs on first sign-in
  repositories/        local (this browser) and supabase (this learner)
  ai.ts                client half of /api/ai
  grading.ts           answer judging (exact, umlaut-near, lenient English)
  scheduler.ts         the 1·3·7·21·35 review ladder and streak counting
  session.ts           builds a round: which words, sentences and topics
  i18n.ts              the whole interface in German and English
  theme.ts             light/dark, stored, applied before first paint
  shortcuts.ts         cc / tt double-tap detection
  data/                the question banks
  ui/                  shell, home, drill, summary, progress, account, overlays
  styles/              tokens → base → components → overlay
supabase/migrations/   the schema, including row-level security
test/
  drill.mjs            plays two full rounds in jsdom: all wrong, then all right
  repository.mjs       normalisation, the sign-in merge, and its idempotence
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
