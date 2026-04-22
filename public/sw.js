const CACHE = "tbw-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const resp = await fetch(req);
        if (resp.ok && resp.type === "basic") {
          const cache = await caches.open(CACHE);
          cache.put(req, resp.clone());
        }
        return resp;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        throw new Error("offline and not cached");
      }
    })()
  );
});
