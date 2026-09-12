/**
 * POST /api/realtime-token — mints a short-lived Google ephemeral token so the
 * browser can hold a Gemini Live socket open directly.
 *
 * The Google API key never leaves this function. What the browser receives is
 * a token that expires in minutes and — this is the important part — carries
 * `liveConnectConstraints`, so the model, the teacher prompt and the voice are
 * fixed server-side. A learner cannot re-point the socket at a different model
 * or talk the tutor out of being a tutor: the constrained endpoint refuses any
 * setup that disagrees with the token.
 *
 * Metering works differently from /api/ai. There the server sees every turn and
 * can count them; here the audio goes straight to Google, so the only moment we
 * control is this one. We therefore count *sessions* and make each token expire
 * after VOICE_SESSION_MINUTES. Sessions per day x minutes per session is a hard
 * ceiling on what one account can spend, enforced before any audio flows.
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

/** Native-audio dialogue model. Same one voize.space runs. */
const MODEL = "models/gemini-3.1-flash-live-preview";

/** Google's v1alpha endpoint is where auth_tokens and the Live socket both live. */
const TOKEN_URL = "https://generativelanguage.googleapis.com/v1alpha/auth_tokens";

/** The learner picks from these; anything else is refused rather than passed on. */
const VOICES = [
  "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede",
  "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba",
  "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar",
  "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi",
  "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat"
] as const;
const DEFAULT_VOICE = "Kore";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;
type Level = (typeof LEVELS)[number];

/** Roughly where each level sits, so the tutor pitches the conversation right. */
const LEVEL_BRIEF: Record<Level, string> = {
  A1: "They are a beginner. Use present tense, the most common 500 words, and very short sentences. Speak slowly.",
  A2: "They know the present and the Perfekt, modal verbs, and the four cases in simple sentences. Speak slowly and keep sentences short.",
  B1: "They can hold an everyday conversation. Use subordinate clauses and Präteritum where it is natural. Speak at a gentle normal pace.",
  B2: "They are comfortable. Speak at a normal pace, use idiom and richer vocabulary, and correct only what is genuinely wrong."
};

function brief(level: Level): string {
  return [
    "You are a native German teacher with fifty years of experience, speaking with your student out loud.",
    "You are warm, patient and precise, and you never lecture: this is a conversation, not a lesson.",
    `Your student is an English speaker working towards B2. ${LEVEL_BRIEF[level]}`,
    "Speak German. If they answer in English, accept it and reply in German anyway, one notch simpler.",
    "Keep every turn to one or two short sentences, then ask something back so the conversation keeps moving.",
    "When they make a mistake that matters, say the corrected sentence once, naturally, as if repeating them back — then carry on. Do not stop to explain grammar unless they ask.",
    "Let small slips go. Correcting everything makes a person stop speaking, and speaking is the whole point.",
    "Never read out lists, markdown, bullet points or stage directions. Everything you say is heard, not read.",
    "If they go quiet, ask an easier question or offer a topic."
  ].join(" ");
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env["GOOGLE_API_KEY"];
  if (!apiKey) {
    res.status(503).json({
      error: "ai_disabled",
      message: "Voice mode is not switched on for this deployment."
    });
    return;
  }

  const token = bearer(req.headers["authorization"]);
  const userId = token ? await verifyUser(token) : null;
  if (!userId) {
    res.status(401).json({ error: "sign_in_required" });
    return;
  }

  const sessionMinutes = clamp(Number(process.env["VOICE_SESSION_MINUTES"] ?? 10), 1, 15);
  const dailySessions = clamp(Number(process.env["AI_DAILY_VOICE_SESSIONS"] ?? 6), 1, 100);

  const allowed = await countSession(userId, dailySessions);
  if (!allowed) {
    res.status(429).json({
      error: "daily_limit",
      message: "That is today's speaking time. It resets at midnight UTC."
    });
    return;
  }

  const body = (req.body ?? {}) as { level?: string; voice?: string };
  const level: Level = (LEVELS as readonly string[]).includes(body.level ?? "")
    ? (body.level as Level)
    : "A2";
  const voice: string = (VOICES as readonly string[]).includes(body.voice ?? "")
    ? (body.voice as string)
    : DEFAULT_VOICE;

  const now = Date.now();
  // expireTime bounds the whole conversation; newSessionExpireTime is the much
  // shorter window in which the socket must actually be opened. A token that
  // leaks after the fact is worthless because it can no longer start anything.
  const expireTime = new Date(now + sessionMinutes * 60_000).toISOString();
  const newSessionExpireTime = new Date(now + 60_000).toISOString();

  try {
    const upstream = await fetch(`${TOKEN_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model: MODEL,
          config: {
            responseModalities: ["AUDIO"],
            temperature: 0.8,
            systemInstruction: { parts: [{ text: brief(level) }] },
            speechConfig: {
              languageCode: "de-DE",
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
            },
            // Both sides transcribed: the learner sees what the tutor heard,
            // which is half the value of the exercise.
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          }
        }
      })
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(502).json({ error: "upstream", status: upstream.status, detail: detail.slice(0, 400) });
      return;
    }

    // The token *is* the resource name, e.g. "auth_tokens/abc123".
    const data = (await upstream.json()) as { name?: string };
    if (!data.name) {
      res.status(502).json({ error: "upstream", detail: "no token in response" });
      return;
    }

    res.status(200).json({
      token: data.name,
      model: MODEL,
      voice,
      expiresAt: expireTime,
      sessionSeconds: sessionMinutes * 60
    });
  } catch (error) {
    res.status(500).json({ error: "failed", message: (error as Error).message });
  }
}

/* ----------------------------------------------------------------- helpers */

function clamp(value: number, low: number, high: number): number {
  if (!Number.isFinite(value)) return low;
  return Math.min(high, Math.max(low, Math.round(value)));
}

function bearer(header: string | string[] | undefined): string | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) return null;
  return value.slice(7).trim() || null;
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
 * Count one more voice session for today and say whether it is within budget.
 * Service-role, so a learner cannot clear their own quota; and without that key
 * we fail closed rather than mint unmetered tokens.
 */
async function countSession(userId: string, limit: number): Promise<boolean> {
  const url = process.env["SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceKey) return false;

  const today = new Date().toISOString().slice(0, 10);
  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json"
  };

  try {
    const query = `${url}/rest/v1/ai_usage?user_id=eq.${userId}&used_on=eq.${today}&kind=eq.voice&select=calls`;
    const current = await fetch(query, { headers });
    const rows = current.ok ? ((await current.json()) as Array<{ calls: number }>) : [];
    const used = rows[0]?.calls ?? 0;
    if (used >= limit) return false;

    await fetch(`${url}/rest/v1/ai_usage`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([{ user_id: userId, used_on: today, kind: "voice", calls: used + 1 }])
    });
    return true;
  } catch {
    return false;
  }
}
