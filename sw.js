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

// v5: the fetch handler now only ever touches our own same-origin app-shell
// requests. The previous version proxied EVERY request, including the
// cross-origin TensorFlow.js CDN scripts and Google-hosted model weights the
// share-caption content AI loads -- a service worker returning an opaque
// response for a cross-origin <script> can break that script's execution
// (notably on iOS Safari), which made the on-device food/object recognition
// silently fail even on a working Wi-Fi connection. Third-party requests now
// bypass the worker entirely and go straight to the network.
const CACHE_NAME = 'lensai-shell-v5';

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
  const url = new URL(req.url);

  // Only handle our own same-origin GET requests (the app shell). Everything
  // cross-origin -- the TensorFlow.js CDN scripts, the Google-hosted model
  // weights, the OpenStreetMap/Wikipedia caption lookups -- must go straight
  // to the network untouched; a service worker has no business proxying
  // third-party requests, and doing so can shadow or break them.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

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
