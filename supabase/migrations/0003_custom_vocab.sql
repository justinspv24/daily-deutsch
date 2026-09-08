-- Daily Deutsch — words the learner adds themselves.
--
-- The question banks live in the code and are the same for everyone at a
-- level. This table is the other half: private words a learner has tripped
-- over and wants back in the drill. One row per word per learner, drilled
-- exactly like a bank word — the progress tables already key on a text id,
-- so `custom_vocab.id` needs no foreign key anywhere.

create table if not exists public.custom_vocab (
  id         text primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  level      text check (level is null or level in ('A1', 'A2', 'B1', 'B2')),
  kind       text not null check (kind in ('verb', 'noun')),
  word       text not null check (length(btrim(word)) between 1 and 60),
  -- der/die/das for nouns, sein/haben for verbs.
  key        text not null check (length(btrim(key)) between 1 and 20),
  -- Accepted answers; the first is the one shown when the learner is wrong.
  en         text[] not null check (cardinality(en) between 1 and 8),
  -- Plural for nouns, Partizip II for verbs.
  form       text[] not null check (cardinality(form) between 1 and 8),
  note_de    text,
  note_en    text,
  created_at timestamptz not null default now()
);

comment on table public.custom_vocab is
  'Learner-added vocabulary, drilled alongside the level bank.';

create index if not exists custom_vocab_user_idx
  on public.custom_vocab (user_id, created_at desc);

alter table public.custom_vocab enable row level security;

drop policy if exists custom_vocab_own on public.custom_vocab;
create policy custom_vocab_own on public.custom_vocab
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
