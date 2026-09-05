-- Daily Deutsch — initial schema.
--
-- One row per learner per tracked item. Every table is locked down with
-- row-level security keyed on auth.uid(), so a signed-in learner can only
-- ever read or write their own progress, even though they all share one
-- Postgres database and the anon key is public by design.

-- ---------------------------------------------------------------- profiles

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  ui_language  text not null default 'de' check (ui_language in ('de', 'en')),
  level        text not null default 'A2',
  created_at   timestamptz not null default now()
);

comment on table public.profiles is
  'One row per learner, created automatically on sign-up.';

-- Create the profile row the moment a user is created, so the app never has
-- to handle a signed-in user with nowhere to store their settings.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------ vocab_state

create table if not exists public.vocab_state (
  user_id    uuid not null references auth.users (id) on delete cascade,
  word_id    text not null,
  streak     smallint not null default 0 check (streak >= 0),
  seen       integer  not null default 0 check (seen >= 0),
  last_date  date,
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

comment on column public.vocab_state.streak is
  'Consecutive fully-correct answers. At 2 the word leaves the drill.';

-- ------------------------------------------------------------ topic_state

create table if not exists public.topic_state (
  user_id    uuid not null references auth.users (id) on delete cascade,
  topic_id   text not null,
  stage      smallint not null default 0 check (stage between 0 and 5),
  due        date not null default current_date,
  last_date  date,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

comment on column public.topic_state.stage is
  'Rung on the 1/3/7/21/35-day review ladder. 5 means finished.';

-- ---------------------------------------------------------- grammar_state

create table if not exists public.grammar_state (
  user_id    uuid not null references auth.users (id) on delete cascade,
  item_id    text not null,
  streak     smallint not null default 0 check (streak >= 0),
  seen       integer  not null default 0 check (seen >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- --------------------------------------------------------------- sessions

create table if not exists public.sessions (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  played_on   date not null default current_date,
  right_count smallint not null check (right_count >= 0),
  total_count smallint not null check (total_count >= 0),
  created_at  timestamptz not null default now()
);

create index if not exists sessions_user_played_idx
  on public.sessions (user_id, played_on desc);

-- ------------------------------------------------------------- ai_usage

-- Counts model calls per learner per day so the serverless endpoint can
-- refuse politely instead of quietly running up an API bill.
create table if not exists public.ai_usage (
  user_id    uuid not null references auth.users (id) on delete cascade,
  used_on    date not null default current_date,
  kind       text not null check (kind in ('chat', 'translate')),
  calls      integer not null default 0 check (calls >= 0),
  primary key (user_id, used_on, kind)
);

-- ---------------------------------------------------------------- content

-- The question banks. Shared and readable by everyone, writable by nobody
-- through the API — content changes go through a migration or the dashboard.
create table if not exists public.content_items (
  id         text primary key,
  kind       text not null check (kind in ('vocab', 'grammar', 'topic')),
  payload    jsonb not null,
  active     boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists content_items_kind_idx
  on public.content_items (kind) where active;

-- ------------------------------------------------------------------- RLS

alter table public.profiles      enable row level security;
alter table public.vocab_state   enable row level security;
alter table public.topic_state   enable row level security;
alter table public.grammar_state enable row level security;
alter table public.sessions      enable row level security;
alter table public.ai_usage      enable row level security;
alter table public.content_items enable row level security;

-- Profiles: read and update your own.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Progress tables: full ownership of your own rows, no visibility into anyone
-- else's. Written as one policy per table for all four verbs.
drop policy if exists vocab_state_own on public.vocab_state;
create policy vocab_state_own on public.vocab_state
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists topic_state_own on public.topic_state;
create policy topic_state_own on public.topic_state
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists grammar_state_own on public.grammar_state;
create policy grammar_state_own on public.grammar_state
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists sessions_own on public.sessions;
create policy sessions_own on public.sessions
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Usage counters are readable by their owner but only the service role writes
-- them, so a learner cannot reset their own quota from the browser.
drop policy if exists ai_usage_select_own on public.ai_usage;
create policy ai_usage_select_own on public.ai_usage
  for select using ((select auth.uid()) = user_id);

-- Content is world-readable, including to signed-out visitors trying the app.
drop policy if exists content_readable on public.content_items;
create policy content_readable on public.content_items
  for select using (active);
