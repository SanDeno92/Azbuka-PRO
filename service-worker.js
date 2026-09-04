const CACHE_NAME = "azbuka-pro-v6-027";
const ASSETS = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./leaderboard-api.js","./profiles.js","./news.js","./style.css"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const url = e.request.url;

  // API-Calls (Supabase, Netlify-Reste) NIEMALS abfangen/cachen -
  // der Browser schickt sie direkt. Sonst haengt die PWA auf
  // Android nach dem Quiz (weisser Screen).
  if (url.includes('supabase.co') || url.includes('/functions/')) {
    return;
  }

  if (e.request.mode === 'navigate' || url.includes('index.html')) {
    e.respondWith(fetch(e.request).then(res => { return caches.open(CACHE_NAME).then(cache => { cache.put(e.request, res.clone()); return res; }); }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
