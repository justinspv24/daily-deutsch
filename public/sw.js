/**
 * Daily Deutsch service worker.
 *
 * Hand-written rather than generated, so it needs no build step and no
 * knowledge of Vite's hashed filenames: the shell is precached by name, and
 * every hashed asset is cached the first time it is actually fetched.
 *
 * The rule that matters: nothing that carries a learner's data is ever cached.
 * Supabase and /api/ always go to the network, so a stale answer can never be
 * served to the wrong person or replayed after sign-out.
 *
 * Bump VERSION whenever this file changes — the old caches are dropped on
 * activate, and clients reload themselves once the new worker takes over.
 */

const VERSION = "v1";
const SHELL = `dd-shell-${VERSION}`;
const ASSETS = `dd-assets-${VERSION}`;
const FONTS = `dd-fonts-${VERSION}`;
const CACHES = [SHELL, ASSETS, FONTS];

/** Enough to boot the app offline; everything else arrives through runtime caching. */
const SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // addAll fails the whole install if one file 404s, so each is added on
      // its own: a missing icon must not cost the learner offline support.
      .then((cache) => Promise.all(SHELL_FILES.map((file) => cache.add(file).catch(() => undefined))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") void self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache anything carrying learner data or credentials.
  if (url.pathname.startsWith("/api/")) return;
  if (url.hostname.endsWith(".supabase.co")) return;
  if (url.hostname.endsWith("googleapis.com") && !FONT_HOSTS.includes(url.hostname)) return;

  // Navigations: fresh when online, the cached shell when not. The SPA routes
  // in the client, so index.html answers every path.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(SHELL).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html").then((hit) => hit ?? Response.error()))
    );
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, FONTS));
    return;
  }

  // Same-origin build output. Vite hashes these filenames, so a cached copy is
  // never stale — a changed file arrives under a different name.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, ASSETS));
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;

  try {
    const response = await fetch(request);
    // Opaque and error responses are not worth keeping: they cannot be read
    // back usefully and would pin dead entries in the cache.
    if (response.ok && response.type === "basic") void cache.put(request, response.clone());
    else if (response.ok && response.type === "cors") void cache.put(request, response.clone());
    return response;
  } catch (error) {
    const stale = await cache.match(request);
    if (stale) return stale;
    throw error;
  }
}
