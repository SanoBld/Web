// service worker — mise en cache basique pour le mode offline
const CACHE = 'sanobld-v1';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/logo1.png',
];

// à l'install on met les fichiers en cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// à l'activation on nettoie les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// fetch — cache-first pour les assets locaux, réseau pour le reste
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // APIs externes (GitHub, fonts…) → réseau direct, pas de cache
  if (!url.origin.includes(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // assets locaux → cache d'abord
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
