/**
 * Build-time configuration. Only `VITE_`-prefixed variables reach the browser;
 * the encryption secret and the Supabase service-role key deliberately have
 * no prefix and exist solely inside the serverless functions under /api.
 */

const env = import.meta.env;

export const SUPABASE_URL: string = env["VITE_SUPABASE_URL"] ?? "";
export const SUPABASE_ANON_KEY: string = env["VITE_SUPABASE_ANON_KEY"] ?? "";

/** True once a Supabase project is wired up; otherwise the app runs offline. */
export const CLOUD_ENABLED: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * One switch for the whole assistant — chat, translator and voice all run on
 * Gemini, on the learner's own key, so there is nothing left to switch on
 * separately. Either variable turns it on: VITE_AI_ENABLED is the name, and
 * VITE_VOICE_ENABLED is honoured for deployments that set that one first.
 */
export const AI_ENABLED: boolean =
  env["VITE_AI_ENABLED"] === "true" || env["VITE_VOICE_ENABLED"] === "true";

/** Kept as a name for the voice code; it is the same switch. */
export const VOICE_ENABLED: boolean = AI_ENABLED;

export const SITE_NAME = "Daily Deutsch";
