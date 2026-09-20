import type { PodcastEpisode } from "./types";

/**
 * The podcast player. One for the whole app, living outside every view, so
 * an episode keeps playing while the learner moves between screens — and,
 * more to the point, keeps playing when they lock the phone.
 *
 * It is a plain <audio> element on purpose. That is what phones treat as
 * media: it carries on with the screen off, it appears on the lock screen
 * with the show's name and play/pause, it pauses for a phone call and comes
 * back after. Everything cleverer — a Web Audio graph, a service worker —
 * loses one of those. The Media Session API adds the lock-screen controls
 * and the ±15 s seek buttons; the element does the rest.
 */

export interface PlayerState {
  readonly episode: PodcastEpisode | null;
  readonly playing: boolean;
  /** Seconds into the episode. */
  readonly position: number;
  /** Seconds long, once the browser knows; 0 until then. */
  readonly duration: number;
  /** True while the browser is fetching enough to start. */
  readonly loading: boolean;
  readonly error: boolean;
}

const SEEK_STEP = 15;
const MEMORY_KEY = "dd.podcast.position";

class PodcastPlayer {
  private audio: HTMLAudioElement | null = null;
  private episode: PodcastEpisode | null = null;
  private loading = false;
  private error = false;
  private readonly listeners = new Set<(state: PlayerState) => void>();

  subscribe(listener: (state: PlayerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state());
    return () => this.listeners.delete(listener);
  }

  state(): PlayerState {
    const audio = this.audio;
    return {
      episode: this.episode,
      playing: audio !== null && !audio.paused && !audio.ended,
      position: audio ? Math.floor(audio.currentTime) : 0,
      duration: audio && Number.isFinite(audio.duration) ? Math.floor(audio.duration) : (this.episode?.durationSeconds ?? 0),
      loading: this.loading,
      error: this.error
    };
  }

  /** Start this episode, or resume it if it is the one already loaded. */
  play(episode: PodcastEpisode): void {
    const audio = this.element();
    if (this.episode?.audioUrl !== episode.audioUrl) {
      this.episode = episode;
      this.error = false;
      this.loading = true;
      audio.src = episode.audioUrl;
      // Picked up where it was left, the way a podcast app would.
      const remembered = this.remembered(episode.audioUrl);
      if (remembered > 0) audio.currentTime = remembered;
      this.announce(episode);
    }
    void audio.play().catch(() => {
      this.error = true;
      this.loading = false;
      this.emit();
    });
    this.emit();
  }

  toggle(): void {
    const audio = this.audio;
    if (!audio || !this.episode) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }

  pause(): void {
    this.audio?.pause();
  }

  seek(seconds: number): void {
    const audio = this.audio;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    audio.currentTime = Math.max(0, Math.min(max, seconds));
    this.emit();
  }

  skip(delta: number): void {
    if (this.audio) this.seek(this.audio.currentTime + delta);
  }

  /** Unload the episode: the bar disappears and the lock screen lets go. */
  stop(): void {
    const audio = this.audio;
    if (audio) {
      this.remember();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    this.episode = null;
    this.loading = false;
    this.error = false;
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
      } catch {
        /* fine */
      }
    }
    this.emit();
  }

  isCurrent(episode: PodcastEpisode): boolean {
    return this.episode?.audioUrl === episode.audioUrl;
  }

  /* --------------------------------------------------------- internals */

  private element(): HTMLAudioElement {
    if (this.audio) return this.audio;
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.setAttribute("playsinline", "true");
    audio.style.display = "none";
    document.body.append(audio);

    audio.addEventListener("play", () => {
      this.loading = false;
      this.session("playing");
      this.emit();
    });
    audio.addEventListener("pause", () => {
      this.remember();
      this.session("paused");
      this.emit();
    });
    audio.addEventListener("ended", () => {
      this.forget();
      this.session("paused");
      this.emit();
    });
    audio.addEventListener("waiting", () => {
      this.loading = true;
      this.emit();
    });
    audio.addEventListener("playing", () => {
      this.loading = false;
      this.emit();
    });
    audio.addEventListener("error", () => {
      this.error = true;
      this.loading = false;
      this.emit();
    });
    // Once a second is plenty for a progress bar and cheap on a phone.
    let last = -1;
    audio.addEventListener("timeupdate", () => {
      const now = Math.floor(audio.currentTime);
      if (now === last) return;
      last = now;
      if (now % 10 === 0) this.remember();
      this.emit();
    });
    audio.addEventListener("loadedmetadata", () => this.emit());

    this.audio = audio;
    this.handlers();
    return audio;
  }

  /** Lock-screen controls. */
  private handlers(): void {
    if (!("mediaSession" in navigator)) return;
    try {
      const ms = navigator.mediaSession;
      ms.setActionHandler("play", () => this.toggle());
      ms.setActionHandler("pause", () => this.pause());
      ms.setActionHandler("stop", () => this.stop());
      ms.setActionHandler("seekbackward", (details) => this.skip(-(details.seekOffset ?? SEEK_STEP)));
      ms.setActionHandler("seekforward", (details) => this.skip(details.seekOffset ?? SEEK_STEP));
      ms.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number") this.seek(details.seekTime);
      });
    } catch {
      /* an older browser without the API */
    }
  }

  private announce(episode: PodcastEpisode): void {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: episode.show,
        album: "Daily Deutsch"
      });
    } catch {
      /* fine */
    }
  }

  private session(state: MediaSessionPlaybackState): void {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.playbackState = state;
    } catch {
      /* fine */
    }
  }

  private remember(): void {
    const audio = this.audio;
    if (!audio || !this.episode) return;
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify({ url: this.episode.audioUrl, position: Math.floor(audio.currentTime) }));
    } catch {
      /* private mode */
    }
  }

  private forget(): void {
    try {
      localStorage.removeItem(MEMORY_KEY);
    } catch {
      /* fine */
    }
  }

  private remembered(url: string): number {
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      if (!raw) return 0;
      const saved = JSON.parse(raw) as { url?: string; position?: number };
      return saved.url === url && typeof saved.position === "number" ? saved.position : 0;
    } catch {
      return 0;
    }
  }

  private emit(): void {
    const state = this.state();
    for (const listener of this.listeners) listener(state);
  }
}

export const player = new PodcastPlayer();

/** 4:05 · 1:12:30 */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}
