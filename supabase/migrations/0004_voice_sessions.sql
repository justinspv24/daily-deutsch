-- Voice mode is metered differently from the chat.
--
-- With /api/ai the server sees every turn, so it can count them. Voice audio
-- goes straight from the browser to the model, so the only thing we control is
-- the moment a session is handed its token. We therefore count sessions, and
-- each token expires after VOICE_SESSION_MINUTES. Sessions per day multiplied
-- by minutes per session is the hard ceiling on one account's spend.
--
-- The row shape does not change: 'voice' simply joins the kinds ai_usage
-- already tracks, so the existing per-day primary key and the read-your-own
-- policy carry over untouched.

alter table public.ai_usage
  drop constraint if exists ai_usage_kind_check;

alter table public.ai_usage
  add constraint ai_usage_kind_check
  check (kind in ('chat', 'translate', 'voice'));
