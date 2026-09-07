import { supabase } from "./auth";
import { AI_ENABLED } from "./config";

/**
 * Client half of /api/ai. The Anthropic key lives only on the server; this
 * module just carries the learner's Supabase access token so the endpoint can
 * identify them and meter the call.
 */

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface Translation {
  direction: "de→en" | "en→de";
  translation: string;
  note: string;
}

export type AiErrorCode =
  | "ai_disabled"
  | "sign_in_required"
  | "daily_limit"
  | "offline"
  | "failed";

export class AiError extends Error {
  constructor(readonly code: AiErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AiError";
  }
}

/** Whether the interface should offer the assistant at all. */
export function aiAvailable(): boolean {
  return AI_ENABLED;
}

async function accessToken(): Promise<string | null> {
  const db = supabase();
  if (!db) return null;
  const { data } = await db.auth.getSession();
  return data.session?.access_token ?? null;
}

async function call<T>(payload: Record<string, unknown>): Promise<T> {
  if (!AI_ENABLED) throw new AiError("ai_disabled");

  const token = await accessToken();
  if (!token) throw new AiError("sign_in_required");

  let response: Response;
  try {
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new AiError("offline");
  }

  if (response.ok) return (await response.json()) as T;

  const detail = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  const code: AiErrorCode =
    detail.error === "ai_disabled" ||
    detail.error === "sign_in_required" ||
    detail.error === "daily_limit"
      ? detail.error
      : "failed";
  throw new AiError(code, detail.message);
}

/** The whole conversation goes up each time; the endpoint keeps no state. */
export async function askTeacher(history: readonly Turn[]): Promise<string> {
  const { text } = await call<{ text: string }>({ mode: "chat", turns: history });
  return text;
}

export async function translate(text: string): Promise<Translation> {
  return call<Translation>({ mode: "translate", text });
}

/** Spoken-style answer: a few short German sentences, then an "EN:" line. */
export async function askVoice(history: readonly Turn[]): Promise<string> {
  const { text } = await call<{ text: string }>({ mode: "voice", turns: history });
  return text;
}
