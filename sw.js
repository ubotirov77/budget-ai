const CACHE_NAME = "budget-pwa-v3";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./assets/ai-robot.png"
  // Agar lang fayllaring bo'lsa, qo'sh:
  // "./lang/en.json",
  // "./lang/uz.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // cache bor bo'lsa - cache, bo'lmasa - network
      return cached || fetch(event.request);
    })
  );
});
