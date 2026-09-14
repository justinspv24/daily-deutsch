import { supabase } from "./auth";
import { AI_ENABLED } from "./config";

/**
 * Client half of /api/ai. The learner's Google key lives only on the server;
 * this module just carries their Supabase access token so the endpoint can
 * identify them, find their key, and meter the call.
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
  | "misconfigured"
  | "key_required"
  | "key_rejected"
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

  const detail = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    detail?: string;
  };
  const known: readonly AiErrorCode[] = [
    "ai_disabled",
    "misconfigured",
    "key_required",
    "key_rejected",
    "sign_in_required",
    "daily_limit"
  ];
  const code = (known as readonly string[]).includes(detail.error ?? "")
    ? (detail.error as AiErrorCode)
    : "failed";
  throw new AiError(code, detail.message ?? detail.detail);
}

/** The whole conversation goes up each time; the endpoint keeps no state. */
export async function askTeacher(history: readonly Turn[]): Promise<string> {
  const { text } = await call<{ text: string }>({ mode: "chat", turns: history });
  return text;
}

export async function translate(text: string): Promise<Translation> {
  return call<Translation>({ mode: "translate", text });
}

/* Voice mode does not go through here; it streams audio straight to the Live
   API — see src/realtime.ts. All three run on the same learner-owned key. */
