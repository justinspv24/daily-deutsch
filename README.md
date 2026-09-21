# Daily Deutsch

A spoken German class, once a day, for learners working from A1 towards B2.
A teacher greets you, says what the hour holds, asks about forty questions,
talks with you in between them, and corrects you as you go. The app decides
what is taught and marks what you answer; the voice does the teaching. Nothing
is typed.

It is an accounts app: you create an account with an e-mail address and a
password, confirm the address through the link Supabase sends, and from then
on sign in with the password (there is a reset link for when it is forgotten,
and the account panel lets you change it). The first thing a new learner does
after that is pick a level — A1, A2, B1 or B2. Each level has its own
vocabulary, table sentences, review topics and "up next" suggestions, and the
daily suggestion is rotated per learner, so two people at the same level are
not shown the same thing. Progress is stored per account and follows you to
any device; the level can be changed at any time from the account panel.

## One door

The home screen offers one pill — *Heutige Stunde beginnen* — and under it a
list of what today actually holds: the theme, how many old mistakes are coming
back round, which words will be asked, how many table forms and sentences, and
how many minutes of conversation. The app used to ask every morning whether you
wanted to type the round or speak it, and that choice was the first work of the
day, before any German had been done. It is a class now, and the home screen's
whole job is to say what is in it and get out of the way.

The pill has three states and no others. It starts today's class; or, if one is
already open, it says how long you have been in it and carries on where you
stopped; or — where voice cannot run at all, because the browser has no
microphone or the assistant is switched off in the build — it stays on screen
and says why, because a button that explains itself beats a button that has
vanished.

Tapping it opens the **classroom**, which takes the whole viewport: no top bar,
no footer, nothing behind it to scroll. An orb says whose turn it is, a card
says what is being worked on and how far through the plan you are, a clock
counts the class (not the call), and the transcript builds up underneath.
`src/agenda.ts` wrote the lesson down before the call was opened, so the plan
listed on the home screen is the plan the tutor is given.

## The app judges, the tutor speaks — mostly

Every question the app chose is marked by `grading.ts`, exactly as a typed
answer would have been, and that verdict is what reaches the streaks, the
paradigm tables and the book of errors. The tutor is told the verdict
*afterwards* and reacts to it. Letting the model mark answers would be less
code and a worse app: a schedule is only worth trusting if the same answer is
always marked the same way, and two judges eventually disagree in front of the
learner — one saying *richtig* over a screen showing a red cross.

Free conversation is the exception, and it has to be: there is no expected
answer to compare a sentence about your weekend against. In those stretches the
tutor corrects the learner's German itself, and reports each correction through
a function call *before* it speaks — so the corrected sentence, in its own
colour with the changed words marked, is on screen a moment before it is said
aloud. Those corrections go into the day's summary and into the book of errors.
They never touch a streak or a table's clean-day chain: a model's opinion of an
answer is good enough to be worth revising and not good enough to be worth
scheduling on. `docs/realtime-voice.md` sets out exactly where that line falls
and why it falls there.

## Leaving, and coming back

**Break** (*Pause*) stops the class where it is. So does the home icon, which
sits in the classroom as well as on every screen with ordinary chrome —
leaving a class by any door keeps it open rather than throwing it away, or the
home icon would be a trap. Only **End class** (*Stunde beenden*) finishes one,
and it asks first.

Time is banked, never subtracted. Every stretch that ends adds its seconds to a
running total, so a break costs nothing however long it lasts, and a class left
open overnight does not claim you were talking until four in the morning. A
single stretch longer than half an hour is capped, because at that point the
tab was frozen or the device clock moved rather than the learner still talking.
The open class is written straight through — after every answer and every
thirty seconds — rather than waiting behind the usual debounce, so it is there
when you come back, including on another device.

A class nobody ended is **closed at midnight**, with everything answered so far
rolled into the ladders and the record stamped a second before the day turned.
A day belongs to the day it started in: the calendar on the profile is a
calendar of days studied, and a class cannot sit in two squares. The check is a
comparison of dates rather than a timer, so it survives time zones, DST and a
phone that was in a pocket at the time; home says so once, in a card, because
falling asleep is not something to be scolded for.

## The book of errors

Everything you get wrong — a meaning, an article, a cell of a paradigm table, a
word missing from a sentence, a sentence the tutor corrected in conversation —
is written into a book and put to you again on **day 3, day 7 and day 21**.
Answer it right three times and it leaves the book; get it wrong again and it
goes back to the bottom, and from the second miss the first rung shortens to a
single day, because a word you have now fumbled twice is the word to open
tomorrow with. Reviews are what a class opens with, hardest-hit first, so a
class cut short still covered the worst of it.

It is a third ladder beside the two that were already there, and deliberately
so. The topic ladder in `scheduler.ts` paces whole syllabus topics on
1·3·7·21·35, and hanging one wrong article on it would drag an entire topic
back a rung. A table's `missed` list is the within-grid dictionary its
three-clean-days rule uses, and one clean sweep empties it — a memory of
yesterday, not of last month. An entry can sit in both at once, and should: the
grid asks it again tomorrow, the book asks it again in three weeks, when the
grid has long since retired.

## The profile

*Profil* shows the hours, the days, the classes and the longest run there has
ever been; then a GitHub-style calendar of the last year, Monday-first because
the rest of the interface is German, each square shaded by how long that day
was. The shades are anchored to the plan's own hour rather than to a curve
fitted to your habits, so a day that did what the plan asks is the darkest
square and stays the darkest square however the weeks around it go. Click one
and that day's summary opens: how long, what was covered, and what went wrong,
frozen as it was on the day. Under the calendar, the book of errors as numbered
tables — the vocabulary always with its article, *die Butter* and never
*Butter*, and the paradigm cells resolved back to their row and column.

## The map it follows

*Lehrplan* on the home screen opens the **syllabus**: all four levels, twelve
sections each, with what you can do after each one, its grammar (with
diagrams), the core vocabulary and links to where it is taught — built on the
Goethe-Institut and telc exam objectives. The level picker links to it too,
so a learner can see what B1 covers before deciding they are not there yet.
`docs/syllabus.md` records the sources.

The class follows that map. Every section has words, table sentences and a
review topic tagged to it (`section` on each item, enforced by the test), and
the words a section lists *are* the words the class asks — read from the same
bank, shown with the article and plural the tutor will ask for. A noun with no
plural (*die Butter*, *die Eltern*) is two questions rather than three. The
class hangs on the first section, in syllabus order, that still has a word
short of two clean sittings; once every word has sat, the theme rotates by the
day.

Each section also carries **videos and podcast episodes** — 184 clips and 135
episodes, every one of the 48 sections covered — and none of them were written
from memory: a research pass searched for what learners actually recommend,
fetched every video to read its length and chapters and every podcast feed to
read its episodes, a second and independent pass tried to refute each link,
timestamp and claim, and a third check asked YouTube and every podcast host
again from this machine. A video appears as the *portion* that explains the
section — the embed plays between `start` and `end`, the link out jumps to the
same second — and each item shows why it is there and what the recommendation
rests on. Where a section has checked clips, the old "search YouTube for this"
links step aside.
*Podcasts* on the home screen lists the shows for your level and, section by
section, the episodes that fit, playable in the app; playback keeps going
across screens and with the phone locked, with controls on the lock screen.
`docs/media.md` has the method, the counts and how to rerun it.

## Five words, not twelve

A call has **no time limit**: the session is resumed across Google's ten-minute
connection resets, the clock shows the class's own elapsed time, and the audio
is routed so a locked phone treats it like a call.

The banks are large — roughly a hundred words a level — so a class draws a
working set, and it is a smaller one than the typed round drew. A card spoken
is three questions (article, meaning, plural), and twelve cards is fourteen
minutes of vocabulary before a single grammar table, which is the old drill
with a voice bolted on. So a class asks **five words**, about a quarter of the
hour, and keeps four more in reserve for a learner still talking when the plan
runs out. Cards are always asked whole: a word's streak only moves when every
field of it was right, so asking fewer cards is the honest way to buy the time
and asking fewer fields is not.

Alongside the bundled banks, a learner can **add their own words** from the
home screen or the profile. An added word is asked exactly like a bank word and
leaves the class after two consecutive fully-correct answers. Those live in
`custom_vocab`, one row per learner, so they sync across devices and stay
private.

Without Supabase configured (the test suites, a bare checkout) there is no
sign-in and the app opens straight on the home screen with the A2 bank and
progress kept in the browser. Without the assistant switched on there is no
class at all, which is the one way this app has changed shape: the voice is not
a feature on top of the lesson any more, it *is* the lesson.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then dist/
npm test           # five headless suites, no network
```

## Deploying it

Three services, in this order. Nothing here needs a paid plan.

### 1. Supabase — the database

1. [supabase.com](https://supabase.com) → **New project**. Pick a region near
   your users (`eu-central-1` for Germany). Save the database password
   somewhere safe; you will not need it for this app.
2. **SQL Editor** → run every file in `supabase/migrations/` in order. That
   creates the tables, the sign-up trigger, and the row-level security
   policies that keep each learner's rows private. `0007` is the one that adds
   the book of errors, the finished classes and the single open class.
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
git commit -m "Daily Deutsch: a spoken class, a book of errors, Supabase sync"
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
   | `VITE_AI_ENABLED` | `true`, once the server settings below are in place | yes |

3. Deploy. Copy the resulting URL back into Supabase's *Site URL* from step 1.4.

Every push to `main` redeploys; every pull request gets its own preview URL.

## Signing in

Two doors, same account system: **Sign in with Google** (one click, through
Supabase's OAuth) or an e-mail address and password. Either way Supabase holds
the credentials and this app only ever sees a session.

Google sign-in needs a one-time setup — see "Google sign-in" below.

## The assistant is not optional any more

Four things sit behind one switch: the `cc` chat with a German teacher, the
`tt` translator that detects direction automatically, the `vv` voice mode —
a live spoken conversation with no lesson behind it — and the daily class
itself. The first three are extras. The fourth is the app, so a deployment with
the switch off has a home screen that can do nothing but explain why the pill
will not open.

All four run on Google's Gemini — text through `api/ai.ts`, voice through the
Live API in `api/realtime-token.ts` — and all four run on **each learner's
own** Google AI key, which they save once in the account panel. You never pay
for anyone else's practice; a learner without a key is told so and pointed at
where to get one (free, at aistudio.google.com). `docs/realtime-voice.md` has
the full picture.

To switch it on: run migrations `0004` and `0005` (and `0007`, if you have not
already), add these to Vercel (no `VITE_` prefix, so they never leave the
server), and set `VITE_AI_ENABLED=true` as a **Config** variable (Vercel
refuses to save a `VITE_` variable as Secret):

| Name | Where it comes from |
|---|---|
| `KEY_ENCRYPTION_SECRET` | any long random string, e.g. `openssl rand -base64 48` |
| `SUPABASE_URL` | same project URL as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API Keys → Legacy → service_role |
| `AI_DAILY_CHAT_LIMIT` · `AI_DAILY_TRANSLATE_LIMIT` · `AI_DAILY_VOICE_SESSIONS` · `VOICE_TOKEN_HOURS` | optional; sensible defaults. A call has no time limit, so sessions per day is the only cap — and a class that has to mint a fresh token spends more than one of them |
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
sessions there too, and a class is metered exactly as voice mode always was.
Since every learner is on their own key, those caps protect the learner's
quota — a runaway tab, a leaked key — rather than anyone else's bill.

## How it is put together

```
api/ai.ts              chat + translator on Gemini, on the learner's own key
api/realtime-token.ts  mints Live API tokens; composes the teacher's prompt
                       and declares the two tools the tutor may call
api/voice-key.ts       checks, encrypts and stores that key; never returns it
src/
  main.ts              app controller — routes, the class lifecycle, storage
  config.ts            build-time environment, and what does not reach the browser
  auth.ts              Supabase client, password sign-up/in/reset, session changes
  repository.ts        storage interface + the merge that runs on first sign-in
  repositories/        local (this browser) and supabase (this learner)

  agenda.ts            today's class, written down before the call opens
  session.ts           what the banks owe today: which words, grids, topics
  classrun.ts          the lesson running: walk the agenda, mark, tell, advance
  classscore.ts        turning a finished class into progress, exactly once
  liveclass.ts         the meter, the break, and the class the day ran out on
  mistakes.ts          the book of errors and its 3·7·21 ladder
  profile.ts           hours, days, the calendar, and one day's summary
  scheduler.ts         the 1·3·7·21·35 topic ladder and the tables' clean days
  grading.ts           answer judging (exact, umlaut-near, lenient English)
  speech.ts            transcript in, answer out — speech-only leniency

  tutor.ts             the spoken lesson: turn protocol, queue, reconnection
  realtime.ts          the voice socket: mic capture, playback, codecs, tool calls
  ai.ts                client half of /api/ai
  voicekey.ts          client half of /api/voice-key
  player.ts            podcast playback, Media Session, lock-screen transport

  i18n.ts              the whole interface in German and English
  theme.ts             light/dark, stored, applied before first paint
  shortcuts.ts         cc / tt / vv double-tap detection
  data/                the question banks, one per level, and the twelve grids
  data/syllabus/       the map of every level: sections, grammar, words, links
  data/media/          the checked clips and episodes; generated, never hand-edited
  ui/                  shell, login, level, home, classroom, summary, profile,
                       syllabus, podcasts, addword, account, chat, translate, voice
  ui/illustrations.ts  the grammar diagrams: frames, grids, contrasts, timelines
  styles/              tokens → base → components → overlay → classroom →
                       profile → syllabus → media
supabase/migrations/   the schema, including row-level security
test/
  repository.mjs       normalisation, the sign-in merge, and its idempotence
  speech.mjs           what somebody said becoming the answer that gets graded
  syllabus.mjs         the syllabus holds together: ids, diagrams, trusted links
  media.mjs            the generated clip and episode data: shape, ranges, repeats
```

### The merge on sign-in

The interesting bit. Someone works anonymously, then signs in — and may
already have progress in the account from another device. Neither side is
authoritative, so for each item the further-along value wins: the higher
streak, the higher review stage (with *its own* due date, or the schedule
would lie), the later date, and the union of days played.

The pieces the class added merge on their own terms. Finished classes are a
union by id — a class held on the phone and a class held on the laptop are two
classes; the same class synced twice is one. The book of errors is a union too,
but where both sides know an entry the *lower* rung wins: two devices
disagreeing about a word means one of them watched the learner get it wrong,
and that is the side worth believing. And at most one class is open at a time,
so two of them is a learner who walked away from one device and started again
on another — the one that got further wins, measured in answers and then in
seconds, and the loser is dropped rather than spliced, because two half-classes
joined together would credit the same minutes twice and ask half their
questions out of order.

Merging twice changes nothing, so a second sign-in cannot inflate anyone's
history. `test/repository.mjs` pins all of that down, because getting it wrong
destroys someone's streaks silently, which is the worst kind of bug this app
could have.

### Two languages, two themes

The interface switches between German and English from the top bar; German is
the default and prints the English underneath, following the immersion rule.
The German *content* never changes — only the scaffolding around it, and the
class itself is spoken in German whichever is selected. Light and dark are both
fully specified as tokens and chosen explicitly, with the stored choice applied
by a small inline script before first paint.
