import { supabase } from "./auth";

/**
 * Client half of /api/voice-key — the learner's own Google AI key for voice.
 *
 * The key goes up exactly once, when they save it, over HTTPS to our own
 * endpoint, which checks it with Google and stores it encrypted. It never
 * comes back down: the only thing this module ever learns afterwards is
 * whether a key exists and its last four characters.
 */

export interface VoiceKeyStatus {
  readonly hasKey: boolean;
  readonly last4: string | null;
}

export type VoiceKeyErrorCode = "sign_in_required" | "invalid_key" | "misconfigured" | "offline" | "failed";

export class VoiceKeyError extends Error {
  constructor(
    readonly code: VoiceKeyErrorCode,
    message?: string
  ) {
    super(message ?? code);
    this.name = "VoiceKeyError";
  }
}

async function call(method: "GET" | "POST" | "DELETE", body?: unknown): Promise<VoiceKeyStatus> {
  const db = supabase();
  const token = db ? (await db.auth.getSession()).data.session?.access_token : null;
  if (!token) throw new VoiceKeyError("sign_in_required");

  let response: Response;
  try {
    response = await fetch("/api/voice-key", {
      method,
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new VoiceKeyError("offline");
  }

  if (response.ok) return (await response.json()) as VoiceKeyStatus;

  const detail = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  const code: VoiceKeyErrorCode =
    detail.error === "sign_in_required" || detail.error === "invalid_key" || detail.error === "misconfigured"
      ? detail.error
      : "failed";
  throw new VoiceKeyError(code, detail.message);
}

export function voiceKeyStatus(): Promise<VoiceKeyStatus> {
  return call("GET");
}

/** Check the key with Google and store it. Resolves with the new status. */
export function saveVoiceKey(key: string): Promise<VoiceKeyStatus> {
  return call("POST", { key: key.trim() });
}

export function removeVoiceKey(): Promise<VoiceKeyStatus> {
  return call("DELETE");
}
