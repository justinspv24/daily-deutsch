import { normalise, type Repository } from "../repository";
import type { Progress, SessionRecord, VocabItem } from "../types";

const PREFIX = "daily-deutsch.progress.v1";

/** The mirror a visitor fills before they have an account. */
export const ANON_SCOPE = "anon";

/**
 * The key used before mirrors were scoped. One shared key meant that signing
 * in as a second learner at this browser merged the first learner's progress
 * into the new account. It is dropped rather than migrated: the cloud copy is
 * authoritative for anyone who had an account, and adopting it as the
 * anonymous mirror would reintroduce the very leak the scoping closes.
 */
const LEGACY_KEY = PREFIX;

/** One mirror per learner, so no account can ever read another's. */
function keyFor(scope: string): string {
  return `${PREFIX}:${scope}`;
}

/**
 * The always-available layer. A visitor can drill without an account at all,
 * and a signed-in learner still gets a working app when the network is down.
 * Each instance is bound to one scope — a learner id, or `ANON_SCOPE` for
 * work done before signing in.
 */
export class LocalRepository implements Repository {
  readonly kind = "local" as const;
  private readonly scope: string;

  constructor(scope: string = ANON_SCOPE) {
    this.scope = scope;
  }

  async load(): Promise<Progress> {
    return normalise(read(this.scope));
  }

  async save(progress: Progress): Promise<void> {
    write(this.scope, progress);
  }

  /**
   * Deliberately does nothing. Rounds live inside the progress document here,
   * so `save()` has already written this one — appending it again would count
   * the round twice in the history chart and the streak.
   */
  async recordSession(_record: SessionRecord): Promise<void> {
    /* handled by save() */
  }

  /**
   * Also deliberately nothing. Added words live inside the progress document,
   * so the caller's save() has already written them.
   */
  async addWord(_item: VocabItem): Promise<void> {
    /* handled by save() */
  }

  async removeWord(_id: string): Promise<void> {
    /* handled by save() */
  }
}

export function readLocalProgress(scope: string = ANON_SCOPE): Progress {
  return normalise(read(scope));
}

export function clearLocalProgress(scope: string = ANON_SCOPE): void {
  try {
    localStorage.removeItem(keyFor(scope));
  } catch {
    /* private mode */
  }
}

/** Remove the pre-scope mirror once, at boot. See LEGACY_KEY. */
export function dropLegacyLocalProgress(): void {
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* private mode */
  }
}

function read(scope: string): unknown {
  try {
    const raw = localStorage.getItem(keyFor(scope));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(scope: string, progress: Progress): void {
  try {
    localStorage.setItem(keyFor(scope), JSON.stringify(progress));
  } catch {
    /* quota or private mode — the in-memory copy still carries the round */
  }
}
