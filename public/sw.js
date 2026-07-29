/**
 * BudgetTracker — Production Service Worker
 * Strategy:
 *   Static/immutable assets  → Cache-First
 *   Google Fonts             → Stale-While-Revalidate
 *   Images                   → Cache-First (with expiry)
 *   Navigation (HTML pages)  → Network-First (offline fallback)
 *   API/sensitive routes     → Network-only (never cached)
 */

const SW_VERSION = 'v2.0.0';

const STATIC_CACHE  = `budgettracker-static-${SW_VERSION}`;
const DYNAMIC_CACHE = `budgettracker-dynamic-${SW_VERSION}`;
const IMAGE_CACHE   = `budgettracker-images-${SW_VERSION}`;
const FONT_CACHE    = `budgettracker-fonts-${SW_VERSION}`;

// Assets to pre-cache on install (App Shell)
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html',
];

// Never cache these — sensitive API data
const NEVER_CACHE_PATTERNS = [
  /\/api\//,
  /\/_next\/webpack-hmr/,
  /\/_next\/static\/development/,
  /chrome-extension/,
  /\/auth\//,
  /\.env/,
];

// Cache size limits
const IMAGE_CACHE_MAX  = 60;
const DYNAMIC_CACHE_MAX = 50;
const IMAGE_CACHE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial failure (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, FONT_CACHE];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shouldNeverCache(url) {
  return NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(url));
}

function isStaticAsset(url) {
  return (
    url.includes('/_next/static/') ||
    url.includes('/static/') ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.woff2') ||
    url.endsWith('.woff')
  );
}

function isImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico|avif)(\?|$)/.test(url);
}

function isFont(url) {
  return (
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  );
}

function isNavigation(request) {
  return request.mode === 'navigate';
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

async function isExpired(response, maxAgeSeconds) {
  if (!response) return true;
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
  return age > maxAgeSeconds;
}

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Never cache sensitive routes
  if (shouldNeverCache(url)) return;

  // ── Fonts: Stale-While-Revalidate ────────────────────────────────────────
  if (isFont(url)) {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  // ── Static JS/CSS/fonts (Next.js immutable): Cache-First ─────────────────
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Images: Cache-First with expiry ──────────────────────────────────────
  if (isImage(url)) {
    event.respondWith(cacheFirstWithExpiry(request, IMAGE_CACHE, IMAGE_CACHE_MAX_AGE_SECONDS, IMAGE_CACHE_MAX));
    return;
  }

  // ── HTML navigation: Network-First with offline fallback ─────────────────
  if (isNavigation(request)) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // ── Everything else: Network-First ───────────────────────────────────────
  event.respondWith(networkFirst(request, DYNAMIC_CACHE, DYNAMIC_CACHE_MAX));
});

// ─── Caching Strategies ─────────────────────────────────────────────────────

/** Cache-First: serve from cache, else network + cache the response */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Network error', { status: 503 });
  }
}

/** Cache-First with age-based expiry and cache size limit */
async function cacheFirstWithExpiry(request, cacheName, maxAgeSeconds, maxItems) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached && !(await isExpired(cached, maxAgeSeconds))) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      trimCache(cacheName, maxItems);
    }
    return networkResponse;
  } catch {
    return cached || new Response('Image unavailable', { status: 503 });
  }
}

/** Stale-While-Revalidate: serve from cache immediately + refresh in background */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cached || fetchPromise;
}

/** Network-First: try network, fall back to cache */
async function networkFirst(request, cacheName, maxItems) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      trimCache(cacheName, maxItems);
    }
    return networkResponse;
  } catch {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Network error', { status: 503 });
  }
}

/** Network-First for navigation with offline.html fallback */
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Fallback to offline page
    const staticCache = await caches.open(STATIC_CACHE);
    const offlinePage = await staticCache.match('/offline.html');
    return offlinePage || new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' }, status: 503 }
    );
  }
}

// ─── Background Sync / Push (stubs for future use) ──────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
