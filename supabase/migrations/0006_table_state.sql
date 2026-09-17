-- Paradigm tables: the grids a learner has to know by heart (articles,
-- pronouns, adjective endings, verb and preposition cases).
--
-- Mastery here is measured in days, not answers: a table retires only after
-- three separate consecutive days finished without a single wrong cell.
-- Anything missed is kept in `missed` — that learner's personal dictionary for
-- this table — and asked first the next day.

create table if not exists public.table_state (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  table_id   text        not null,
  day_streak smallint    not null default 0 check (day_streak >= 0 and day_streak <= 3),
  due        date        not null default current_date,
  last_date  date,
  missed     text[]      not null default '{}',
  studied    boolean     not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, table_id)
);

comment on table public.table_state is
  'One row per learner per paradigm table. day_streak counts consecutive clean days; 3 retires the table.';
comment on column public.table_state.missed is
  'Cell keys (<table>#<row>:<col>) missed last time — asked first on the next day.';
comment on column public.table_state.studied is
  'True once the full grid has been shown as a study card, so it is never shown twice.';

alter table public.table_state enable row level security;

-- Same shape as every other progress table: a learner reaches their own rows
-- and nobody else's, enforced by the database rather than by the client.
drop policy if exists table_state_own on public.table_state;
create policy table_state_own
  on public.table_state
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists table_state_due_idx
  on public.table_state (user_id, due);
