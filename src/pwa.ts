/**
 * Installing the app on a phone.
 *
 * Two halves: registering the service worker that makes the drill work
 * offline, and holding on to the browser's install prompt so the app can offer
 * a real button instead of hoping the learner finds the browser menu.
 */

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPromptEvent | null = null;
let onChange: (() => void) | null = null;

/** True when the app is already running from the home screen. */
export function isStandalone(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS never implemented display-mode, but sets this instead.
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/**
 * iOS has no install prompt at all — the learner has to use Share → Add to
 * Home Screen — so it needs a written hint rather than a button.
 */
export function isIOS(): boolean {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS reports itself as a Mac; touch points give it away.
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}

/** True once the browser has offered an install prompt we can replay. */
export function canInstall(): boolean {
  return deferred !== null;
}

/** Called when installability changes, so the view can show or drop its button. */
export function onInstallChange(callback: () => void): void {
  onChange = callback;
}

export async function promptInstall(): Promise<boolean> {
  const event = deferred;
  if (!event) return false;
  // The prompt is single-use; drop it before awaiting so a double tap cannot
  // fire it twice.
  deferred = null;
  onChange?.();
  await event.prompt();
  const choice = await event.userChoice;
  return choice.outcome === "accepted";
}

export function initPwa(): void {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Without this the browser shows its own banner at a moment of its
    // choosing; held back, the app can ask when it makes sense.
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    onChange?.();
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    onChange?.();
  });

  if (!("serviceWorker" in navigator)) return;
  // The dev server hands out unbundled modules; a worker caching those would
  // fight hot reload for no benefit.
  if (!import.meta.env.PROD) return;

  // A controller already present means this page was loaded by an older
  // worker, so a handover really is a new version — on the very first
  // registration it is not, and must not trigger a reload loop.
  const hadController = navigator.serviceWorker.controller !== null;
  let reloading = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* No offline support this time; the app still works online. */
    });
  });
}
