/**
 * /api/voice-key — the learner's own Google AI key for voice mode.
 *
 *   GET     → { hasKey, last4 }         does this account have a key saved?
 *   POST    { key }                      check it against Google, encrypt, store
 *   DELETE  →                            forget it
 *
 * Voice mode runs on each learner's own key, so this is the only place a key
 * ever arrives from a browser. It is checked against Google before anything is
 * stored (a mistyped key should fail here, with a clear message, not ten
 * seconds into a call), then encrypted with a secret that exists only in this
 * environment. The plaintext is never written anywhere and never sent back;
 * the account panel is shown the last four characters and nothing else.
 */

import { createCipheriv, createHash, randomBytes } from "node:crypto";

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

/** A cheap, read-only call that a valid key answers and an invalid one refuses. */
const PROBE_URL = "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (!supabaseUrl() || !supabaseAnon() || !env("SUPABASE_SERVICE_ROLE_KEY") || !env("KEY_ENCRYPTION_SECRET")) {
    res.status(503).json({ error: "misconfigured", message: "Key storage is not set up on this deployment." });
    return;
  }

  const token = bearer(req.headers["authorization"]);
  const userId = token ? await verifyUser(token) : null;
  if (!userId) {
    res.status(401).json({ error: "sign_in_required" });
    return;
  }

  try {
    if (req.method === "GET") {
      const row = await readRow(userId);
      res.status(200).json({ hasKey: Boolean(row), last4: row?.last4 ?? null });
      return;
    }

    if (req.method === "DELETE") {
      await deleteRow(userId);
      res.status(200).json({ hasKey: false, last4: null });
      return;
    }

    if (req.method === "POST") {
      const body = (req.body ?? {}) as { key?: unknown };
      const key = typeof body.key === "string" ? body.key.trim() : "";
      // Google's keys are long and have no spaces; anything else is a paste
      // gone wrong and not worth a round trip to find out.
      if (key.length < 20 || key.length > 200 || /\s/.test(key)) {
        res.status(400).json({ error: "invalid_key", message: "That does not look like a Google AI key." });
        return;
      }

      const probe = await fetch(`${PROBE_URL}&key=${encodeURIComponent(key)}`);
      if (!probe.ok) {
        res.status(400).json({
          error: "invalid_key",
          message:
            probe.status === 400 || probe.status === 403
              ? "Google did not accept that key."
              : "Could not check the key with Google right now."
        });
        return;
      }

      const sealed = encrypt(key);
      await upsertRow(userId, { ...sealed, last4: key.slice(-4) });
      res.status(200).json({ hasKey: true, last4: key.slice(-4) });
      return;
    }

    res.status(405).json({ error: "method_not_allowed" });
  } catch (error) {
    res.status(500).json({ error: "failed", message: (error as Error).message });
  }
}

/* ------------------------------------------------------------------ crypto */

/**
 * AES-256-GCM. The 32-byte key is derived from KEY_ENCRYPTION_SECRET by
 * hashing, so the secret can be any long random string rather than exactly
 * 32 bytes of hex. A fresh IV per row means two learners saving the same key
 * (it happens) store different ciphertext.
 */
function encrypt(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  const key = createHash("sha256").update(env("KEY_ENCRYPTION_SECRET")).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64")
  };
}

/* ------------------------------------------------------------------ storage */

interface Row {
  ciphertext: string;
  iv: string;
  tag: string;
  last4: string;
}

function serviceHeaders(): Record<string, string> {
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json"
  };
}

async function readRow(userId: string): Promise<Row | null> {
  const response = await fetch(
    `${supabaseUrl()}/rest/v1/voice_keys?user_id=eq.${userId}&select=ciphertext,iv,tag,last4`,
    { headers: serviceHeaders() }
  );
  if (!response.ok) throw new Error(`voice_keys read failed (${response.status})`);
  const rows = (await response.json()) as Row[];
  return rows[0] ?? null;
}

async function upsertRow(userId: string, row: Row): Promise<void> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/voice_keys`, {
    method: "POST",
    headers: { ...serviceHeaders(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([{ user_id: userId, ...row, updated_at: new Date().toISOString() }])
  });
  if (!response.ok) throw new Error(`voice_keys write failed (${response.status})`);
}

async function deleteRow(userId: string): Promise<void> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/voice_keys?user_id=eq.${userId}`, {
    method: "DELETE",
    headers: serviceHeaders()
  });
  if (!response.ok) throw new Error(`voice_keys delete failed (${response.status})`);
}

/* --------------------------------------------------------------------- env */

function env(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function supabaseUrl(): string {
  return env("SUPABASE_URL", "VITE_SUPABASE_URL").replace(/\/+$/, "");
}

function supabaseAnon(): string {
  return env("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY");
}

/* -------------------------------------------------------------------- auth */

function bearer(header: string | string[] | undefined): string | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) return null;
  return value.slice(7).trim() || null;
}

async function verifyUser(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${supabaseUrl()}/auth/v1/user`, {
      headers: { apikey: supabaseAnon(), authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { id?: string };
    return user.id ?? null;
  } catch {
    return null;
  }
}
