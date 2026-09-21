-- Daily Deutsch — the spoken class, and the wrong answers it remembers.
--
-- A day of study is now one spoken class rather than a typed round. Three
-- things have to survive it, and none of them fit the existing per-item
-- progress tables.
--
-- `mistakes` is the learner's own book of errors: every vocabulary meaning,
-- paradigm cell, gapped sentence and corrected sentence they got wrong, each
-- climbing a 3/7/21-day ladder. It is deliberately not `topic_state`. That
-- ladder paces whole syllabus topics on 1/3/7/21/35; this one paces a single
-- answer, and collapsing the two would mean one wrong article dragging an
-- entire topic back a rung. It is not `table_state.missed` either: that is the
-- within-grid dictionary a table's three-clean-days rule uses, and one clean
-- sweep empties it. A cell belongs in both, and should — the grid asks it
-- again tomorrow, this asks it again in three weeks, when the grid has long
-- since retired.
--
-- `classes` is one row per finished class: the day's summary, frozen. Its
-- mistakes are copies in jsonb, not foreign keys, because a summary is a
-- photograph of a day and must not change when the ladder moves on — or when
-- an entry retires and its row goes away.
--
-- `live_class` is the one class still open, at most one per learner, so an
-- interrupted class resumes where it stopped. It is written far more often
-- than the rest of the progress set — after every answer, and every thirty
-- seconds while the class is on screen — which is why it has its own table and
-- its own save path instead of being more columns on `profiles`.
--
-- Ids are text, not uuid: the browser mints them, and the fallback for
-- browsers without crypto.randomUUID does not produce a uuid. A uuid column
-- would reject exactly those learners.
--
-- ai_usage needs nothing here: migration 0004 already allows kind = 'voice',
-- and a spoken class is metered exactly as voice mode always was.

-- ------------------------------------------------------------- sessions

-- How long the day took. Rounds were never timed, so existing rows get 0 and
-- the profile's calendar simply leaves those squares at their lightest shade.
alter table public.sessions
  add column if not exists seconds integer not null default 0
  check (seconds >= 0 and seconds <= 86400);

comment on column public.sessions.seconds is
  'Seconds of class, breaks excluded. 0 on rows written before classes were timed.';

-- ---------------------------------------------------------------- mistakes

create table if not exists public.mistakes (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  mistake_id   text        not null check (length(mistake_id) between 1 and 200),
  kind         text        not null check (kind in ('vocab', 'table', 'grammar', 'correction')),
  ref          text        not null default '',
  subject      text        not null default '',
  gloss        text        not null default '',
  prompt       text        not null default '',
  expected     text        not null,
  -- Everything the grader accepts when it comes back round, so a review is
  -- marked exactly as the original question was.
  accepted     text[]      not null default '{}',
  expects      text        not null default 'german'
                 check (expects in ('article', 'aux', 'english', 'german', 'none')),
  given        text        not null default '',
  first_missed date        not null default current_date,
  last_asked   date,
  stage        smallint    not null default 0 check (stage between 0 and 3),
  due          date        not null default current_date,
  misses       smallint    not null default 1 check (misses >= 1),
  updated_at   timestamptz not null default now(),
  primary key (user_id, mistake_id)
);

comment on table public.mistakes is
  'One row per learner per outstanding wrong answer. Retired entries are deleted, not flagged.';
comment on column public.mistakes.stage is
  'Rung on the 3/7/21-day ladder. Reaching 3 retires the entry and deletes the row.';
comment on column public.mistakes.ref is
  'Word id and field, paradigm cell key (<table>#<row>:<col>), sentence reference, or empty for free speech.';
comment on column public.mistakes.misses is
  'Times missed in all. From two, the first rung shortens to a single day.';
comment on column public.mistakes.subject is
  'Denormalised on purpose: a word dropped from a bank must still be listable in the profile.';

create index if not exists mistakes_due_idx
  on public.mistakes (user_id, due);

-- ----------------------------------------------------------------- classes

create table if not exists public.classes (
  id          text        primary key check (length(id) between 8 and 64),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  held_on     date        not null,
  started_at  timestamptz not null,
  ended_at    timestamptz not null,
  -- Banked seconds, breaks excluded. Never ended_at - started_at, which counts
  -- the coffee and, for a class closed at midnight, the whole evening.
  seconds     integer     not null default 0 check (seconds between 0 and 86400),
  level       text        not null check (level in ('A1', 'A2', 'B1', 'B2')),
  section_ids text[]      not null default '{}',
  table_ids   text[]      not null default '{}',
  word_ids    text[]      not null default '{}',
  right_count smallint    not null default 0 check (right_count >= 0),
  wrong_count smallint    not null default 0 check (wrong_count >= 0),
  mistakes    jsonb       not null default '[]'::jsonb check (jsonb_typeof(mistakes) = 'array'),
  ending      text        not null check (ending in ('ended', 'midnight', 'dropped')),
  created_at  timestamptz not null default now(),
  constraint classes_ends_after_start check (ended_at >= started_at)
);

comment on table public.classes is
  'One row per finished class — the day''s summary as it will be read a year from now.';
comment on column public.classes.ending is
  'ended: the learner pressed End class. midnight: nobody did. dropped: superseded by a newer class.';
comment on column public.classes.mistakes is
  'Frozen copies of that day''s slips. Copies, not references: the summary must not change when the ladder does.';

create index if not exists classes_user_day_idx
  on public.classes (user_id, held_on desc);

-- -------------------------------------------------------------- live_class

create table if not exists public.live_class (
  user_id     uuid        primary key references auth.users (id) on delete cascade,
  class_id    text        not null check (length(class_id) between 8 and 64),
  held_on     date        not null,
  started_at  timestamptz not null,
  level       text        not null check (level in ('A1', 'A2', 'B1', 'B2')),
  plan        jsonb       not null default '[]'::jsonb check (jsonb_typeof(plan) = 'array'),
  -- "cursor" is reserved in Postgres, and "right" is why sessions has right_count.
  cursor_at   integer     not null default 0 check (cursor_at >= 0),
  seconds     integer     not null default 0 check (seconds between 0 and 86400),
  resumed_at  timestamptz,
  right_count smallint    not null default 0 check (right_count >= 0),
  wrong_count smallint    not null default 0 check (wrong_count >= 0),
  answers     jsonb       not null default '[]'::jsonb check (jsonb_typeof(answers) = 'array'),
  mistakes    jsonb       not null default '[]'::jsonb check (jsonb_typeof(mistakes) = 'array'),
  section_ids text[]      not null default '{}',
  table_ids   text[]      not null default '{}',
  word_ids    text[]      not null default '{}',
  updated_at  timestamptz not null default now()
);

comment on table public.live_class is
  'At most one open class per learner. A second class the same day is a second row in classes, never a second row here.';
comment on column public.live_class.plan is
  'Plan items as {kind, ref} — ids only. The questions are rebuilt from the banks, so a resumed class asks today''s wording, not last week''s.';
comment on column public.live_class.answers is
  'Every closed question answered so far. The ladders are rolled forward from this when the class closes, so a class nobody ended can still be scored.';
comment on column public.live_class.seconds is
  'Banked seconds only. Merging two devices takes the maximum and never the sum: both counted the same minute.';
comment on column public.live_class.resumed_at is
  'When the current stretch began; null on a break. Ignored on load — the tab that was counting has gone.';

-- ------------------------------------------------------------------- RLS

alter table public.mistakes   enable row level security;
alter table public.classes    enable row level security;
alter table public.live_class enable row level security;

-- Same shape as every other progress table: a learner reaches their own rows
-- and nobody else's, enforced by the database rather than by the client.
drop policy if exists mistakes_own on public.mistakes;
create policy mistakes_own
  on public.mistakes
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists classes_own on public.classes;
create policy classes_own
  on public.classes
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists live_class_own on public.live_class;
create policy live_class_own
  on public.live_class
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
