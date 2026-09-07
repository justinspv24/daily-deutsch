import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { CLOUD_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Learner } from "./types";

/**
 * Accounts are e-mail + password. Signing up sends a confirmation link;
 * opening it both verifies the address and signs the learner in. Supabase
 * holds the credentials — this app never sees a password after the form
 * hands it over, and never stores one.
 */

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient | null {
  if (!CLOUD_ENABLED) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return client;
}

export const PASSWORD_MIN_LENGTH = 8;

export type AuthErrorCode =
  | "invalid-email"
  | "weak-password"
  | "wrong-credentials"
  | "not-confirmed"
  | "already-registered"
  | "rate-limit"
  | "offline"
  | "unknown";

export interface AuthResult {
  readonly ok: boolean;
  readonly code: AuthErrorCode | null;
}

const OK: AuthResult = { ok: true, code: null };
const fail = (code: AuthErrorCode): AuthResult => ({ ok: false, code });

export function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function toLearner(user: User): Learner {
  const meta = user.user_metadata as Record<string, unknown> | null;
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: (meta?.["display_name"] as string | undefined) ?? null
  };
}

export async function currentLearner(): Promise<Learner | null> {
  const db = supabase();
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) return null;
  return toLearner(data.user);
}

/** Create an account. The address is not usable until its confirmation link is opened. */
export async function signUp(email: string, password: string): Promise<AuthResult> {
  const db = supabase();
  if (!db) return fail("offline");
  if (!validEmail(email)) return fail("invalid-email");
  if (password.length < PASSWORD_MIN_LENGTH) return fail("weak-password");

  try {
    const { data, error } = await db.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${location.origin}/` }
    });
    if (error) return fail(classify(error.message, error.status));
    // With confirmations switched on, Supabase answers an address that already
    // has an account with a placeholder user carrying no identities, so that
    // the form cannot be used to find out who has signed up.
    if (data.user && data.user.identities?.length === 0) return fail("already-registered");
    return OK;
  } catch {
    return fail("offline");
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const db = supabase();
  if (!db) return fail("offline");
  if (!validEmail(email)) return fail("invalid-email");

  try {
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
    return error ? fail(classify(error.message, error.status)) : OK;
  } catch {
    return fail("offline");
  }
}

/** E-mails a link that opens the app in recovery mode, where a new password can be set. */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const db = supabase();
  if (!db) return fail("offline");
  if (!validEmail(email)) return fail("invalid-email");

  try {
    const { error } = await db.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/`
    });
    return error ? fail(classify(error.message, error.status)) : OK;
  } catch {
    return fail("offline");
  }
}

/** Set a new password for the signed-in learner (after a reset link, or from the account panel). */
export async function updatePassword(password: string): Promise<AuthResult> {
  const db = supabase();
  if (!db) return fail("offline");
  if (password.length < PASSWORD_MIN_LENGTH) return fail("weak-password");

  try {
    const { error } = await db.auth.updateUser({ password });
    return error ? fail(classify(error.message, error.status)) : OK;
  } catch {
    return fail("offline");
  }
}

export async function signOut(): Promise<void> {
  await supabase()?.auth.signOut();
}

/**
 * Fires whenever the learner signs in or out, including when a confirmation
 * or recovery link lands on the page. The event name is passed through so
 * the app can tell a password-recovery arrival from an ordinary sign-in.
 */
export function onAuthChange(handler: (learner: Learner | null, event: string) => void): () => void {
  const db = supabase();
  if (!db) return () => undefined;

  const { data } = db.auth.onAuthStateChange((event, session) => {
    handler(session?.user ? toLearner(session.user) : null, event);
  });
  return () => data.subscription.unsubscribe();
}

/** Turn Supabase's messages into something the interface can translate. */
function classify(message: string, status?: number): AuthErrorCode {
  const text = message.toLowerCase();
  if (status === 429 || text.includes("rate limit") || text.includes("too many")) return "rate-limit";
  if (text.includes("invalid login credentials") || text.includes("invalid credentials")) {
    return "wrong-credentials";
  }
  if (text.includes("not confirmed")) return "not-confirmed";
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "already-registered";
  }
  if (text.includes("password")) return "weak-password";
  if (text.includes("email")) return "invalid-email";
  if (text.includes("fetch") || text.includes("network")) return "offline";
  return "unknown";
}
