/**
 * Build-time configuration. Only `VITE_`-prefixed variables reach the browser;
 * the Anthropic key and the Supabase service-role key deliberately have no
 * prefix and exist solely inside the serverless functions under /api.
 */

const env = import.meta.env;

export const SUPABASE_URL: string = env["VITE_SUPABASE_URL"] ?? "";
export const SUPABASE_ANON_KEY: string = env["VITE_SUPABASE_ANON_KEY"] ?? "";

/** True once a Supabase project is wired up; otherwise the app runs offline. */
export const CLOUD_ENABLED: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Chat and translation stay hidden until this is switched on. */
export const AI_ENABLED: boolean = env["VITE_AI_ENABLED"] === "true";

export const SITE_NAME = "Daily Deutsch";
