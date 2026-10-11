/* Love Puzzle Lock — service worker: precache everything for offline play */
const CACHE = "love-puzzle-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.png",
  "./bgm.mp3",
  "./photos/level1.png",
  "./photos/level2.jpg",
  "./photos/level3.jpg",
  "./photos/level4.jpg",
  "./photos/level5.jpg",
  "./photos/level6.jpg",
  "./photos/level7.jpg",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* cache-first, then network (and fill the cache on the way) */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
    )
  );
});
