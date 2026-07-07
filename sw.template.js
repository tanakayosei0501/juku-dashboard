const CACHE = 'juku-dashboard-__CACHE_VERSION__';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // CDN / Supabase API: pass through without caching
  if (url.includes('cdn.jsdelivr.net') || url.includes('supabase.co')) return;

  // HTML: network-first (always try to get fresh version)
  const isHtml = e.request.headers.get('Accept')?.includes('text/html')
    || url.endsWith('/')
    || url.endsWith('.html');

  if (isHtml) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets (manifest, icon, etc.): cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Triggered by the update toast: immediately activate this SW
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
