-- Daily Deutsch — the level is chosen, not assumed.
--
-- The first sign-in now asks the learner for their level, so the column has
-- to be able to say "not chosen yet". Rows that already exist keep the value
-- they have (the original A2 default), so nobody who is already drilling is
-- asked again.

alter table public.profiles
  alter column level drop not null,
  alter column level drop default;

alter table public.profiles
  drop constraint if exists profiles_level_check;

alter table public.profiles
  add constraint profiles_level_check
  check (level is null or level in ('A1', 'A2', 'B1', 'B2'));

comment on column public.profiles.level is
  'CEFR band the learner drills at. Null until chosen on first sign-in.';
