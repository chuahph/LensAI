// LensAI service worker -- caches the app shell so it still opens when
// launched from the iOS home screen without a network connection.
//
// CACHE_NAME bumped to v4: the app was consolidated from 3 files
// (index.html + react-bundle.js + app.js) into a single self-contained
// index.html, specifically to eliminate a real failure mode where
// multi-file transfer to a phone (AirDrop, Files app, Messages, email)
// could silently separate files that needed to stay together, breaking
// the app with no catchable error. The cache name is bumped so any
// device that previously cached the old 3-file version cleanly drops
// that stale cache and fetches the new single-file version.

const CACHE_NAME = 'lensai-shell-v4';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Network-first, falling back to cache only when offline. This means
  // an app update always reaches a device that has a network connection
  // (rather than being shadowed forever by an old cached version), while
  // still working offline once the shell has been cached at least once.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
