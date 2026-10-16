const CACHE = 'bora-apartments-v1';
const CORE = ['./', 'index.html', 'styles.css', 'menu.css', 'responsive.css', 'main.js', 'menu.js', 'studio.js', 'site-extras.css', 'site-extras.js', 'favicon.svg', 'offline.html'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (new URL(event.request.url).origin === location.origin && response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match('offline.html'))));
});
