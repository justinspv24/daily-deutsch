/**
 * POST /api/ai — the only place an Anthropic key is ever touched.
 *
 * The browser never sees the key. A caller must present a valid Supabase
 * access token, and every call is counted against a daily per-learner ceiling,
 * so a single account cannot run the API bill away. Returns 503 until
 * ANTHROPIC_API_KEY is configured, which is the deliberate default.
 */

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

type Mode = "chat" | "translate" | "voice";
/** What the daily counter is keyed on — voice shares the chat budget. */
type MeterKind = "chat" | "translate";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TURNS = 24;
const MAX_CHARS = 4000;

const VOICE_BRIEF = [
  "You are a native German teacher with fifty years of experience, talking with your student out loud: warm, patient, precise.",
  "Your student is an English speaker working from A1 towards B2, and may speak German or English.",
  "This is a spoken conversation. Reply in at most three short, simple German sentences at their level.",
  "Then add exactly one final line that begins with EN: and contains, in English, the translation of what you said. Nothing may follow that line.",
  "If their German contained a mistake, say the corrected sentence first, and put the reason briefly in English inside the EN: line.",
  "Everything you write is read aloud by a speech synthesiser: no markdown, no lists, no symbols, no emoji, no stage directions.",
  "Keep the conversation going by ending with a short question when it fits."
].join(" ");

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
  'Reply with JSON only: {"direction":"de→en"|"en→de","translation":string,"note":string}.',
  "The note is at most one short English sentence about a case, ending or word choice",
  "worth noticing — an empty string when there is nothing useful to say.",
  "Never write anything outside the JSON."
].join(" ");

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    res.status(503).json({
      error: "ai_disabled",
      message: "The assistant is not switched on for this deployment."
    });
    return;
  }

  const body = (req.body ?? {}) as { mode?: Mode; turns?: Turn[]; text?: string };
  const mode: Mode = body.mode === "translate" ? "translate" : body.mode === "voice" ? "voice" : "chat";
  const kind: MeterKind = mode === "translate" ? "translate" : "chat";

  const token = bearer(req.headers["authorization"]);
  if (!token) {
    res.status(401).json({ error: "sign_in_required" });
    return;
  }

  const userId = await verifyUser(token);
  if (!userId) {
    res.status(401).json({ error: "sign_in_required" });
    return;
  }

  const limit = Number(
    kind === "chat"
      ? (process.env["AI_DAILY_CHAT_LIMIT"] ?? 40)
      : (process.env["AI_DAILY_TRANSLATE_LIMIT"] ?? 120)
  );
  const allowed = await countCall(userId, kind, limit);
  if (!allowed) {
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
        : mode === "voice"
          ? chatPayload(body.turns ?? [], VOICE_BRIEF, 400)
          : chatPayload(body.turns ?? [], TEACHER_BRIEF, 700);

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(502).json({ error: "upstream", status: upstream.status, detail: detail.slice(0, 400) });
      return;
    }

    const data = (await upstream.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = (data.content ?? [])
      .filter((block) => block.type === "text")
      .map((block) => block.text ?? "")
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

function chatPayload(turns: Turn[], system: string, maxTokens: number): unknown {
  const clean = turns
    .filter((turn) => turn && typeof turn.content === "string" && turn.content.trim())
    .slice(-MAX_TURNS)
    .map((turn) => ({
      role: turn.role === "assistant" ? "assistant" : "user",
      content: turn.content.slice(0, MAX_CHARS)
    }));

  // The API requires the conversation to start and end with a user turn.
  while (clean.length && clean[0]!.role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1]!.role !== "user") {
    throw new Error("conversation must end with a question");
  }

  return { model: MODEL, max_tokens: maxTokens, system, messages: clean };
}

function translatePayload(text: string): unknown {
  if (!text.trim()) throw new Error("nothing to translate");
  return {
    model: MODEL,
    max_tokens: 400,
    system: TRANSLATE_BRIEF,
    messages: [{ role: "user", content: text }]
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

/* ----------------------------------------------------------------- auth */

function bearer(header: string | string[] | undefined): string | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) return null;
  const token = value.slice(7).trim();
  return token || null;
}

/** Ask Supabase who this access token belongs to. */
async function verifyUser(token: string): Promise<string | null> {
  const url = process.env["SUPABASE_URL"];
  const anon = process.env["SUPABASE_ANON_KEY"] ?? process.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !anon) return null;

  try {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anon, authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { id?: string };
    return user.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Increment today's counter and report whether the call is within budget.
 * Uses the service-role key, so a learner cannot clear their own quota.
 */
async function countCall(userId: string, kind: MeterKind, limit: number): Promise<boolean> {
  const url = process.env["SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  // Without a service key there is no counter; fail closed rather than
  // silently serving an unmetered endpoint.
  if (!url || !serviceKey) return false;

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
