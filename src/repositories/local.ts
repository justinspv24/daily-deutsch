import { normalise, type Repository } from "../repository";
import type { Progress, SessionRecord } from "../types";

const KEY = "daily-deutsch.progress.v1";

/**
 * The always-available layer. A visitor can drill without an account at all,
 * and a signed-in learner still gets a working app when the network is down.
 */
export class LocalRepository implements Repository {
  readonly kind = "local" as const;

  async load(): Promise<Progress> {
    return normalise(read());
  }

  async save(progress: Progress): Promise<void> {
    write(progress);
  }

  /**
   * Deliberately does nothing. Rounds live inside the progress document here,
   * so `save()` has already written this one — appending it again would count
   * the round twice in the history chart and the streak.
   */
  async recordSession(_record: SessionRecord): Promise<void> {
    /* handled by save() */
  }
}

export function readLocalProgress(): Progress {
  return normalise(read());
}

export function clearLocalProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* private mode */
  }
}

function read(): unknown {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* quota or private mode — the in-memory copy still carries the round */
  }
}
