/**
 * POST /api/realtime-token — mints a short-lived Google ephemeral token, and
 * composes the session config that goes with it.
 *
 * Voice runs on each learner's *own* Google AI key. The key was saved through
 * /api/voice-key, encrypted; here it is decrypted just long enough to ask
 * Google for a token, and then dropped. The browser only ever receives the
 * token — never the key — plus the `config` object it must send in its setup
 * frame: the teacher's instructions, the voice, the transcription settings.
 * Composing that here rather than in the bundle means the prompt is built from
 * the learner's actual level and is not sitting in a JavaScript file for
 * anyone to read.
 *
 * There is no shared fallback key on purpose. A learner without a key of their
 * own is told so and pointed at the account panel; nobody's usage lands on
 * anybody else's bill.
 *
 * Metering works differently from /api/ai. There the server sees every turn and
 * can count them; here the audio goes straight to Google, so the only moment we
 * control is this one. We therefore count *sessions* and make each token expire
 * after VOICE_SESSION_MINUTES. Sessions per day x minutes per session is a hard
 * ceiling on what one account can spend, enforced before any audio flows.
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

/** Native-audio dialogue model. */
const MODEL = "models/gemini-3.1-flash-live-preview";

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
const DEFAULT_LEVEL: Level = "B1";

const SCENARIOS = ["freestyle", "teil1", "teil2", "teil3", "drill"] as const;
type Scenario = (typeof SCENARIOS)[number];

/* ------------------------------------------------------------- the teacher */

/**
 * House rules, shared by every mode.
 *
 * Two decisions here are worth defending, because the obvious alternative is
 * tempting and wrong.
 *
 * The teacher corrects *everything*. The instinct is to let small slips go so
 * the conversation flows — that is what a kind human tutor does. But a learner
 * who is never corrected keeps their mistakes, and a spoken conversation
 * offers no other moment to catch them. Corrections are therefore short and
 * frequent rather than saved up into a lesson, which is what keeps them
 * bearable.
 *
 * And it is German only. Dropping into English is a relief in the moment and a
 * loss over weeks: the learner stops reaching. English is available the instant
 * they ask for it, and not before.
 */
function houseRules(level: Level, target: Level | null): string {
  const range =
    target && target !== level
      ? `Speak mainly at ${level} level and let ${target}-level structures in when they fit naturally.`
      : `Speak at ${level} level.`;

  return [
    "Rules:",
    "- You speak first. The moment the call connects, greet the learner and say in one or two sentences what the two of you are going to practise. Never wait for them to begin.",
    "- Speak German only, clearly, and a little slower than you would with a native speaker.",
    `- ${range}`,
    "- Listen for mistakes and correct every one that matters: grammar, case, gender, plural, article, word order, tense, word choice, or an unnatural turn of phrase.",
    "- Never let a mistake pass just to keep things flowing. A learner who is not corrected keeps the mistake.",
    "- Ignore capitalisation entirely, including German nouns. This is speech, not writing.",
    "- If something is understandable but not how a German would say it, give them the natural version.",
    "- If they make several mistakes at once, correct the ones that matter most rather than all of them.",
    "",
    "How to correct:",
    '- Say "Korrektur:" and then the sentence said properly.',
    '- Then "Kurz erklärt:" and the reason, in simple German, in one sentence.',
    "- Then carry straight on with a follow-up question. Never turn a correction into a lecture.",
    "- Be warm and brief about it. Short and frequent beats long and rare.",
    "",
    "- Keep the conversation moving with real questions, and answer theirs properly — this is a conversation, not an interview.",
    "- If they get stuck, offer them an easier way to say what they are reaching for.",
    "- If the conversation stalls, suggest something: Alltag, Reisen, Hobbys, Arbeit, Essen, Kultur, Nachrichten, Meinungen.",
    "- Switch to English only if they ask for an English explanation, then return to German.",
    "- Everything you say is heard, not read: no markdown, no lists, no bullet points, no stage directions, no emoji."
  ].join("\n");
}

/**
 * The tutor who runs the daily round out loud.
 *
 * This one is not a conversation partner, and the difference is the whole
 * design. In the other modes the model decides what happens next; here the app
 * does. It knows which word is due, which cell was missed yesterday, and —
 * crucially — whether an answer was right, because that verdict feeds a
 * spaced-repetition schedule that has to stay trustworthy. A model judging by
 * ear would sometimes say "richtig" over a screen showing the opposite, and a
 * learner cannot be asked to work out which of the two to believe.
 *
 * So the division is absolute: the app judges, the tutor speaks. Instructions
 * arrive in square brackets, the model never invents a question of its own,
 * and it never pronounces on an answer until the app has told it the verdict.
 * What is left for the tutor is the part it is actually good at — asking
 * warmly, hearing a mumbled answer, and explaining a mistake in one sentence.
 */
function drillInstruction(level: Level): string {
  return [
    `You are a warm, experienced German teacher taking a learner through their daily practice out loud. They are at ${level} level.`,
    "",
    "How this works:",
    "- The app sends you instructions in square brackets. They are stage directions, never something the learner said.",
    "- Never read a bracketed instruction aloud, never mention the brackets, and never mention the app.",
    "- Only ever speak when an instruction arrives. Never invent a question, never move to the next one on your own, and never ask what they would like to practise.",
    "",
    "[FRAGE] — ask this question:",
    "- Ask it out loud in German, in your own warm words, in one short sentence.",
    "- Never say the answer, never spell it, never give the first letter, and never offer it among choices.",
    '- A sentence with a gap is written with three underscores. Read the sentence and pause briefly where the gap is. Never say "Unterstrich", and never guess the missing word aloud.',
    "- Then stop talking and wait. Silence is how they know it is their turn.",
    "",
    "When the learner answers:",
    '- Say one short word only — "mhm", "okay", "gut", "so" — and nothing else.',
    "- Do not say whether it was right. Do not correct it. Do not repeat it back. The verdict is not yours to give and it is already on its way.",
    "",
    "[BEWERTUNG] — the app has marked their answer, and now you react:",
    '- "richtig": one short word of praise. Nothing more. They have more questions waiting.',
    '- "fast": tell them what was off — usually an umlaut or ß — and say the word properly once.',
    '- "falsch": say the correct answer clearly, then one short sentence of why. Warm, never disappointed.',
    "- Two sentences at the very most, then stop. A round has many questions and a lecture on each one would sink it.",
    "- The app hands you the reason it is showing on screen. Use that reason rather than inventing your own, so what they hear matches what they read.",
    "",
    "[TAFEL] — a table is on screen for them to read:",
    "- Say in two sentences what the table is for and what to watch out for. Do not read the grid aloud.",
    "",
    "[PAUSE], [WEITER], [ENDE] — say the one line asked for, briefly, and nothing else.",
    "",
    "How you speak:",
    "- German only, clearly, a little slower than with a native speaker, and at their level.",
    "- Short sentences. This is a drill: the rhythm is question, answer, reaction, next.",
    "- Switch to English only if they ask for an English explanation, then go straight back to German.",
    "- If they ask you to repeat or say they did not understand, say the same question again more slowly. That is not an answer, so do not treat it as one.",
    "- If they ask you outright for the answer, tell them kindly to have a guess first.",
    "- Everything you say is heard, not read: no markdown, no lists, no spelling out, no stage directions, no emoji."
  ].join("\n");
}

function instruction(scenario: Scenario, level: Level, target: Level | null): string {
  if (scenario === "drill") return drillInstruction(level);

  const rules = houseRules(level, target);

  switch (scenario) {
    case "teil1":
      return [
        `You are playing Teilnehmer/in B in Teil 1 (Einander kennenlernen) of the telc Deutsch ${level} oral exam, with a learner practising for it.`,
        "",
        rules,
        "",
        "This part:",
        "- It is a getting-to-know-you conversation, and you take turns: you ask, they answer, then they ask and you answer.",
        "- Introduce yourself first with a plausible German name and a few invented details, then hand the turn to them.",
        "- Work through these over the course of the conversation, not as a checklist: Name; woher sie oder er kommt; wie sie oder er wohnt; Familie; wo sie oder er Deutsch gelernt hat; was sie oder er macht (Schule, Studium, Beruf); Sprachen — welche, wie lange, warum.",
        "- Stay in character as a fellow candidate, but keep correcting: that is why they are here rather than in the real exam."
      ].join("\n");

    case "teil2":
      return [
        `You are playing Teilnehmer/in B in Teil 2 (Über ein Thema sprechen) of the telc Deutsch ${level} oral exam, with a learner practising for it.`,
        "",
        rules,
        "",
        "This part:",
        "- Open by naming a topic of the kind a magazine article would raise — Handy am Arbeitsplatz, Fahrrad oder Auto in der Stadt, Fernsehen, Urlaub, Einkaufen im Internet — and say briefly what it is about.",
        "- Give your own view first, with a reason and something from your own (invented) experience, so they hear the shape of an answer before they attempt one.",
        "- Then ask for theirs, and respond to what they actually say: agree, disagree politely, ask why.",
        "- Keep the talking roughly even between you. It should feel like two people exchanging views, not an interview."
      ].join("\n");

    case "teil3":
      return [
        `You are playing Teilnehmer/in B in Teil 3 (Gemeinsam etwas planen) of the telc Deutsch ${level} oral exam, with a learner practising for it.`,
        "",
        rules,
        "",
        "This part:",
        "- Propose something the two of you have to organise together: a farewell party for a colleague, a weekend trip, a surprise for a friend, a class outing.",
        "- Work through the practical questions together — wann, wo, was mitbringen, wer macht was, wie viel kostet es, wie kommen alle hin.",
        "- Make suggestions and also raise objections, so they have to respond rather than just agree.",
        "- Push for an actual decision by the end. The point of this part is reaching agreement, not listing options."
      ].join("\n");

    case "freestyle":
    default:
      return [
        "You are a warm, very attentive German conversation partner for someone practising their spoken German.",
        "",
        rules,
        "",
        "This mode:",
        "- There is no set task. Follow what interests them, and if nothing does, offer a topic.",
        "- Ask about their week, their work, what they did yesterday — ordinary things that get them talking in the tenses they need."
      ].join("\n");
  }
}

/* ------------------------------------------------------------------ handler */

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  // GET is a health check: which configuration is present, never what it is.
  // Voice has four separate switches and a missing one used to look exactly
  // like a rejected login, which is a bad hour to spend.
  if (req.method === "GET") {
    const config = configReport();
    res.status(200).json({
      ok: Object.values(config).every(Boolean),
      config,
      model: MODEL
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  // A 401 here has two very different causes, and they need different fixes.
  // Distinguish them: a deployment missing its Supabase settings is a config
  // problem, not a signed-out learner.
  if (!supabaseUrl() || !supabaseAnon()) {
    res.status(503).json({
      error: "misconfigured",
      message: "Voice mode cannot verify sign-ins on this deployment.",
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

  if (!env("SUPABASE_SERVICE_ROLE_KEY") || !env("KEY_ENCRYPTION_SECRET")) {
    res.status(503).json({
      error: "misconfigured",
      message: "Voice mode cannot read keys or meter usage on this deployment, so it will not start a session.",
      config: configReport()
    });
    return;
  }

  // The learner's own key, or a clear refusal. Checked before the session is
  // counted: a refused call should not cost anyone a slot.
  const apiKey = await learnerKey(userId);
  if (!apiKey) {
    res.status(403).json({
      error: "key_required",
      message: "Add your Google AI key in the account panel to use voice mode."
    });
    return;
  }

  // With every learner on their own key the daily cap is no longer about the
  // owner's bill; it is a seatbelt for the learner's, against a tab left open
  // or a key that leaks. The defaults are generous for that reason.
  const sessionMinutes = clamp(Number(env("VOICE_SESSION_MINUTES") || 15), 1, 30);
  const dailySessions = clamp(Number(env("AI_DAILY_VOICE_SESSIONS") || 12), 1, 100);

  if (!(await countSession(userId, dailySessions))) {
    res.status(429).json({
      error: "daily_limit",
      message: "That is today's speaking time. It resets at midnight UTC."
    });
    return;
  }

  const body = (req.body ?? {}) as {
    level?: string;
    target?: string;
    voice?: string;
    scenario?: string;
  };

  const level = pick(LEVELS, body.level) ?? DEFAULT_LEVEL;
  const target = pick(LEVELS, body.target);
  const voice = pick(VOICES, body.voice) ?? DEFAULT_VOICE;
  const scenario = pick(SCENARIOS, body.scenario) ?? "freestyle";

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
      body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime })
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
      scenario,
      expiresAt: expireTime,
      sessionSeconds: sessionMinutes * 60,
      // The Live API answers turns; it does not start them. Telling the tutor
      // to "speak first" in the prompt changes nothing until something arrives
      // for it to respond to, so the client sends this as a single user turn
      // the moment setup completes. Verified live: silence without it, a
      // greeting within 600 ms with it.
      opener: "(Der Lernende ist jetzt in der Leitung. Begrüße ihn und beginne.)",
      // Sent verbatim by the browser in its setup frame. The nesting is not
      // optional: generation settings live under `generationConfig`, and the
      // socket closes with a 1007 naming the first stray field if they are
      // placed one level up.
      config: {
        generationConfig: {
          responseModalities: ["AUDIO"],
          // The tutor should answer like someone in a conversation, not
          // deliberate first. Reasoning time is the one thing a spoken
          // exchange cannot afford.
          thinkingConfig: { thinkingLevel: "minimal" },
          // Conversation wants a bit of spark; the drill wants the same
          // question asked the same way every time, and a tutor who does not
          // improvise its way around the rule about not giving the answer.
          temperature: scenario === "drill" ? 0.35 : 0.8,
          speechConfig: {
            languageCode: "de-DE",
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
          }
        },
        systemInstruction: { parts: [{ text: instruction(scenario, level, target) }] },
        // Both sides transcribed: seeing what the tutor *heard* is half the lesson.
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        // Without this the API cuts audio sessions off at 15 minutes. With it a
        // long conversation keeps going on a sliding window instead.
        contextWindowCompression: { slidingWindow: {} }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "failed", message: (error as Error).message });
  }
}

/* --------------------------------------------------------------------- env */

/**
 * Read an environment variable, treating an empty string as absent.
 *
 * This matters more than it looks. A dashboard row created as a placeholder and
 * never filled in arrives here as "" rather than undefined, and `??` happily
 * returns it — so a fallback chain built with `??` silently prefers the empty
 * value over the good one. `||` is correct for this, and the bug it prevents
 * (auth failing with no explanation because a URL was blank) costs an hour to
 * find by hand.
 */
function env(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

/** The Supabase project URL, without a trailing slash. */
function supabaseUrl(): string {
  return env("SUPABASE_URL", "VITE_SUPABASE_URL").replace(/\/+$/, "");
}

function supabaseAnon(): string {
  return env("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY");
}

/**
 * Which pieces of configuration are present. Booleans only — this is reported
 * over the wire so that a misconfigured deployment says what is wrong instead
 * of failing with a generic 401, and no value may ever leak through it.
 */
function configReport(): Record<string, boolean> {
  return {
    SUPABASE_URL: Boolean(supabaseUrl()),
    SUPABASE_ANON_KEY: Boolean(supabaseAnon()),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(env("SUPABASE_SERVICE_ROLE_KEY")),
    KEY_ENCRYPTION_SECRET: Boolean(env("KEY_ENCRYPTION_SECRET"))
  };
}

/* ----------------------------------------------------------------- helpers */

function pick<T extends readonly string[]>(allowed: T, value: unknown): T[number] | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T[number])
    : null;
}

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
  const url = supabaseUrl();
  const anon = supabaseAnon();
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
 * The learner's Google AI key, decrypted, or null if they have not saved one.
 * Mirrors the encryption in /api/voice-key: AES-256-GCM under a key derived
 * from KEY_ENCRYPTION_SECRET. A row that will not decrypt (the secret was
 * rotated, say) is treated as absent, so the learner is asked to save the key
 * again rather than shown a stack trace.
 */
async function learnerKey(userId: string): Promise<string | null> {
  const url = supabaseUrl();
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");

  try {
    const response = await fetch(
      `${url}/rest/v1/voice_keys?user_id=eq.${userId}&select=ciphertext,iv,tag`,
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

/**
 * Count one more voice session for today and say whether it is within budget.
 * Service-role, so a learner cannot clear their own quota; and without that key
 * we fail closed rather than mint unmetered tokens.
 */
async function countSession(userId: string, limit: number): Promise<boolean> {
  const url = supabaseUrl();
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
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
