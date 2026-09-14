-- Each learner brings their own Google AI key for voice mode.
--
-- The key is the learner's money, so it is treated like a password: encrypted
-- before it reaches this table (AES-256-GCM, with a secret that lives only in
-- the server's environment), never returned to a browser, and readable by
-- nobody through the API. There are deliberately no row-level policies below —
-- with RLS on and no policies, the anon and authenticated roles get nothing,
-- and only the service role (which only the serverless functions hold) can
-- read or write a row. The learner manages their key through /api/voice-key,
-- which is the only path in or out.
--
-- last4 is kept in the clear so the account panel can show "…k3Qw" and the
-- learner can tell which key they saved without ever seeing the whole thing.

create table if not exists public.voice_keys (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  ciphertext text not null,
  iv         text not null,
  tag        text not null,
  last4      text not null,
  updated_at timestamptz not null default now()
);

alter table public.voice_keys enable row level security;
