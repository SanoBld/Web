// ─────────────────────────────────────────────
// Service Worker — Sano Bld Portfolio (PWA offline)
// ─────────────────────────────────────────────
const CACHE = 'sanobld-v1';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/logo1.png',
];

// Installation : mise en cache des assets statiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch : cache-first pour les assets locaux, network-first pour les APIs
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // APIs externes (GitHub, fonts, umami) → réseau d'abord, pas de cache
  if (!url.origin.includes(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // Assets locaux → cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
