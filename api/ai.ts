/**
 * POST /api/ai — the `cc` chat and the `tt` translator.
 *
 * Both run on Gemini, on the learner's own Google AI key — the same key that
 * voice mode uses, saved once through /api/voice-key and stored encrypted.
 * It is decrypted here just long enough to make one request, and never
 * reaches a browser. A learner without a key is told so and pointed at the
 * account panel; there is no shared key to fall back on, so nobody's chat
 * lands on anybody else's bill.
 *
 * Every call is still counted against a per-learner daily ceiling. With each
 * learner on their own key that ceiling protects *their* quota (a runaway tab,
 * a leaked key), not the owner's, which is why it is generous.
 */

import { createDecipheriv, createHash } from "node:crypto";

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

type Mode = "chat" | "translate";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

/**
 * The text model. Fast and cheap is the right trade for a chat that answers
 * in a few sentences; the Live model is a different animal and is chosen in
 * /api/realtime-token. Overridable without a deploy, because model names
 * move under you.
 */
const DEFAULT_TEXT_MODEL = "gemini-3.5-flash-lite";
const MAX_TURNS = 24;
const MAX_CHARS = 4000;

const TEACHER_BRIEF = [
  "You are a native German teacher with fifty years of experience: patient, precise, encouraging.",
  "Your student is an English speaker working from A1 towards B2.",
  "Answer in simple German at their level, then give the English translation on its own line.",
  "Switch to English to explain a grammar rule or correct a mistake, then return to German.",
  "If their German contains a mistake, point it out first and explain why before continuing.",
  "Use memory hooks: mnemonics, minimal pairs, word families, short vivid stories.",
  "Keep answers short. Markdown is not rendered, so write plain sentences."
].join(" ");

const TRANSLATE_BRIEF = [
  "You translate between German and English for a learner at A2 level.",
  "Detect the language of the input.",
  "If it is German, translate into natural English; if English, into natural German at A2–B1 level.",
  'Reply with JSON only, of the shape {"direction":"de→en"|"en→de","translation":string,"note":string}.',
  "The note is at most one short English sentence about a case, ending or word choice",
  "worth noticing — an empty string when there is nothing useful to say."
].join(" ");

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  // GET is a health check: which configuration is present, never what it is.
  if (req.method === "GET") {
    const config = configReport();
    res.status(200).json({ ok: Object.values(config).every(Boolean), config, model: textModel() });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!supabaseUrl() || !supabaseAnon() || !env("SUPABASE_SERVICE_ROLE_KEY") || !env("KEY_ENCRYPTION_SECRET")) {
    res.status(503).json({
      error: "misconfigured",
      message: "The assistant is not fully set up on this deployment.",
      config: configReport()
    });
    return;
  }

  const token = bearer(req.headers["authorization"]);
  const userId = token ? await verifyUser(token) : null;
  if (!userId) {
    res.status(401).json({ error: "sign_in_required" });
    return;
  }

  const apiKey = await learnerKey(userId);
  if (!apiKey) {
    res.status(403).json({
      error: "key_required",
      message: "Add your Google AI key in the account panel to use the assistant."
    });
    return;
  }

  const body = (req.body ?? {}) as { mode?: string; turns?: Turn[]; text?: string };
  const mode: Mode = body.mode === "translate" ? "translate" : "chat";

  const limit = Number(
    mode === "chat" ? env("AI_DAILY_CHAT_LIMIT") || 200 : env("AI_DAILY_TRANSLATE_LIMIT") || 400
  );
  if (!(await countCall(userId, mode, limit))) {
    res.status(429).json({
      error: "daily_limit",
      message: "That is today's limit. It resets at midnight UTC."
    });
    return;
  }

  try {
    const payload =
      mode === "translate"
        ? translatePayload(String(body.text ?? "").slice(0, MAX_CHARS))
        : chatPayload(body.turns ?? []);

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${textModel()}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!upstream.ok) {
      // Google's error text is usually the useful part ("model not found",
      // "API key not valid"), so it goes through — minus anything that looks
      // like it might echo the key back.
      const detail = (await upstream.text()).replace(/key=[^&\s"]+/g, "key=…");
      res.status(502).json({
        error: upstream.status === 400 || upstream.status === 403 ? "key_rejected" : "upstream",
        status: upstream.status,
        detail: detail.slice(0, 400)
      });
      return;
    }

    const data = (await upstream.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (mode === "translate") {
      res.status(200).json(parseTranslation(text));
      return;
    }
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: "failed", message: (error as Error).message });
  }
}

/* ------------------------------------------------------------- payloads */

function chatPayload(turns: Turn[]): unknown {
  const clean = turns
    .filter((turn) => turn && typeof turn.content === "string" && turn.content.trim())
    .slice(-MAX_TURNS)
    .map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content.slice(0, MAX_CHARS) }]
    }));

  // The conversation has to start and end with the learner.
  while (clean.length && clean[0]!.role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1]!.role !== "user") {
    throw new Error("conversation must end with a question");
  }

  return {
    systemInstruction: { parts: [{ text: TEACHER_BRIEF }] },
    contents: clean,
    generationConfig: { maxOutputTokens: 700, temperature: 0.7 }
  };
}

function translatePayload(text: string): unknown {
  if (!text.trim()) throw new Error("nothing to translate");
  return {
    systemInstruction: { parts: [{ text: TRANSLATE_BRIEF }] },
    contents: [{ role: "user", parts: [{ text }] }],
    // Ask for JSON outright rather than hoping the model resists chatter.
    generationConfig: { maxOutputTokens: 400, temperature: 0.3, responseMimeType: "application/json" }
  };
}

function parseTranslation(raw: string): unknown {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
      if (typeof parsed["translation"] === "string") {
        return {
          direction: parsed["direction"] === "en→de" ? "en→de" : "de→en",
          translation: String(parsed["translation"]).trim(),
          note: typeof parsed["note"] === "string" ? parsed["note"].trim() : ""
        };
      }
    } catch {
      /* fall through to the plain-text reading below */
    }
  }
  return { direction: "de→en", translation: raw, note: "" };
}

/* ------------------------------------------------------------------ env */

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

function textModel(): string {
  return env("GEMINI_TEXT_MODEL") || DEFAULT_TEXT_MODEL;
}

function configReport(): Record<string, boolean> {
  return {
    SUPABASE_URL: Boolean(supabaseUrl()),
    SUPABASE_ANON_KEY: Boolean(supabaseAnon()),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(env("SUPABASE_SERVICE_ROLE_KEY")),
    KEY_ENCRYPTION_SECRET: Boolean(env("KEY_ENCRYPTION_SECRET"))
  };
}

/* ----------------------------------------------------------------- auth */

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

/* -------------------------------------------------------------- the key */

/** The learner's Google AI key, decrypted — mirrors /api/voice-key exactly. */
async function learnerKey(userId: string): Promise<string | null> {
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  try {
    const response = await fetch(
      `${supabaseUrl()}/rest/v1/voice_keys?user_id=eq.${userId}&select=ciphertext,iv,tag`,
      { headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` } }
    );
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ ciphertext: string; iv: string; tag: string }>;
    const row = rows[0];
    if (!row) return null;

    const key = createHash("sha256").update(env("KEY_ENCRYPTION_SECRET")).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(row.iv, "base64"));
    decipher.setAuthTag(Buffer.from(row.tag, "base64"));
    const plain = Buffer.concat([decipher.update(Buffer.from(row.ciphertext, "base64")), decipher.final()]);
    return plain.toString("utf8") || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- metering */

async function countCall(userId: string, kind: Mode, limit: number): Promise<boolean> {
  const url = supabaseUrl();
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const today = new Date().toISOString().slice(0, 10);
  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json"
  };

  try {
    const query = `${url}/rest/v1/ai_usage?user_id=eq.${userId}&used_on=eq.${today}&kind=eq.${kind}&select=calls`;
    const current = await fetch(query, { headers });
    const rows = current.ok ? ((await current.json()) as Array<{ calls: number }>) : [];
    const used = rows[0]?.calls ?? 0;
    if (used >= limit) return false;

    await fetch(`${url}/rest/v1/ai_usage`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([{ user_id: userId, used_on: today, kind, calls: used + 1 }])
    });
    return true;
  } catch {
    return false;
  }
}
