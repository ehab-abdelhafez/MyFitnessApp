/* FitPlan service worker — offline cache + reminder notifications
 *
 * Strategy: NETWORK-FIRST for same-origin requests so a republish always
 * shows up on the next online open; falls back to cache when offline.
 * Bump VERSION whenever you want to force-evict the old cache.
 */
const VERSION = "2";
const CACHE = `fitplan-v${VERSION}`;
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/store.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for same-origin; cache fallback offline. YouTube/CDN -> network.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let cross-origin (YouTube) pass through

  e.respondWith(
    fetch(req)
      .then((res) => {
        // refresh the cache with the latest copy
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) =>
          cached || (req.mode === "navigate" ? caches.match("./index.html") : undefined)
        )
      )
  );
});

// Allow the page to trigger immediate activation of a waiting SW
self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "skip-waiting") { self.skipWaiting(); return; }
  if (d.type === "notify") {
    self.registration.showNotification(d.title || "FitPlan", {
      body: d.body || "",
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      tag: d.tag || "fitplan",
      vibrate: [80, 40, 80],
      data: { url: d.url || "./index.html" },
    });
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./index.html";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
