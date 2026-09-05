import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CLOUD_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Learner } from "./types";

/**
 * Sign-in is a one-time link sent by e-mail. There is deliberately no password
 * field anywhere in this app: nothing to leak, nothing to reset, and Supabase
 * handles the token exchange.
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

export async function currentLearner(): Promise<Learner | null> {
  const db = supabase();
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) return null;
  const meta = data.user.user_metadata as Record<string, unknown> | null;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    displayName: (meta?.["display_name"] as string | undefined) ?? null
  };
}

export interface SignInResult {
  ok: boolean;
  message: string;
}

export async function sendMagicLink(email: string): Promise<SignInResult> {
  const db = supabase();
  if (!db) return { ok: false, message: "offline" };

  const address = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
    return { ok: false, message: "invalid-email" };
  }

  const { error } = await db.auth.signInWithOtp({
    email: address,
    options: { emailRedirectTo: `${location.origin}/` }
  });
  return error ? { ok: false, message: error.message } : { ok: true, message: "sent" };
}

export async function signOut(): Promise<void> {
  await supabase()?.auth.signOut();
}

/** Fires whenever the learner signs in or out, including via a magic link. */
export function onAuthChange(handler: (learner: Learner | null) => void): () => void {
  const db = supabase();
  if (!db) return () => undefined;

  const { data } = db.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      handler(null);
      return;
    }
    const meta = session.user.user_metadata as Record<string, unknown> | null;
    handler({
      id: session.user.id,
      email: session.user.email ?? null,
      displayName: (meta?.["display_name"] as string | undefined) ?? null
    });
  });
  return () => data.subscription.unsubscribe();
}
