const CACHE_NAME = "azbuka-pro-v9-023";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-1024.png",
  "./apple-touch-icon.png",
  "./leaderboard-api.js",
  "./profiles.js",
  "./news.js",
  "./style.css",
  "./tabs-extra.css",
  "./theme-system.js",
  "./theme-overrides.css",
  "./vokabeln-data.js",
  "./aufgaben-data.js",
  "./azbuka-tabs.js",
  "./vokabeln.js",
  "./aufgaben.js",
  "./alphabet-lautschrift-data.js",
  "./alphabet-lautschrift.js",
  "./mobile-nav.css",
  "./theme-cyberpunk.css",
  "./theme-storm.css",
  "./theme-storm.js",
  "./theme-space.css",
  "./theme-space.js",
  "./theme-anime.css",
  "./theme-anime-landscape.js",
  "./bg-anime-sunset-hd.png",
  "./profil-view.js",
  "./shop-view.js",
  "./mobile-nav.js",
  "./spiele.js",
  "./spiele.css",
  "./wortsuche.js",
  "./wortsuche.css"
];
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

  // Nur statische Assets cachen, alles andere direkt durchlassen
  const isAsset = url.includes('.png') || url.includes('.jpg') || url.includes('.json') ||
                  url.includes('.js') || url.includes('.css') ||
                  url.includes('.html') || e.request.mode === 'navigate';
  if (!isAsset) {
    return;
  }

  if (e.request.mode === 'navigate' || url.includes('index.html')) {
    e.respondWith(fetch(e.request).then(res => { return caches.open(CACHE_NAME).then(cache => { cache.put(e.request, res.clone()); return res; }); }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
