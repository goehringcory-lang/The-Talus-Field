/* The Field Guide service worker. Hand-rolled — see plan Phase 5.
 * BUILD_DATE token below is replaced at build time by vite.config.ts so
 * each deploy gets a fresh shell-cache name and old caches drop on activate. */

const VERSION = '__BUILD_DATE__'
const SHELL_CACHE = `tfg-shell-${VERSION}`
// Deliberately unversioned: wiping it on deploy would destroy the offline
// photos buyers rely on in the park. Growth is bounded by the stop catalog.
const RUNTIME_CACHE = 'tfg-runtime'

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((n) => n.startsWith('tfg-shell-') && n !== SHELL_CACHE)
          .map((n) => caches.delete(n)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (!event.data) return

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  // Pre-warm the runtime cache with a list of photo URLs.
  // Sent by Region.tsx when a region loads so stops are fully viewable offline.
  // Fetches run through a small concurrency-limited queue so a long URL list
  // doesn't saturate a slow (park-edge) connection with parallel requests.
  if (event.data.type === 'PRECACHE_URLS') {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : []
    event.waitUntil(precacheUrls(urls))
  }
})

const PRECACHE_CONCURRENCY = 4

async function precacheUrls(urls) {
  const cache = await caches.open(RUNTIME_CACHE)
  const queue = [...urls]
  const worker = async () => {
    for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
      try {
        if (await cache.match(url)) continue
        const res = await fetch(url)
        if (res.ok) await cache.put(url, res)
      } catch { /* offline at precache time — will cache on next visit */ }
    }
  }
  await Promise.all(Array.from({ length: PRECACHE_CONCURRENCY }, worker))
}

const RUNTIME_PATTERNS = [
  /\/photos\//,
  /\.woff2$/,
  /\.(svg|png|jpg|jpeg|webp|avif)$/,
]

function isRuntimeAsset(url) {
  return RUNTIME_PATTERNS.some((re) => re.test(url.pathname))
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip cross-origin requests (fonts, API, Google Maps tiles, etc.) — let the
  // browser handle them. Google Fonts gets cached by browser HTTP cache; the
  // API needs to stay fresh; Google Maps JS + tile URLs are deliberately
  // not cached (signed/rotating URLs, and Google's ToS forbids tile caching).
  if (url.origin !== self.location.origin) return

  // Navigation: network-first, fall back to cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          const cache = await caches.open(SHELL_CACHE)
          cache.put('/index.html', fresh.clone())
          return fresh
        } catch {
          const cache = await caches.open(SHELL_CACHE)
          const cached = await cache.match('/index.html')
          if (cached) return cached
          return new Response('Offline', { status: 503, statusText: 'Offline' })
        }
      })(),
    )
    return
  }

  // Photos, fonts, images: cache-first into runtime cache.
  if (isRuntimeAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE)
        const cached = await cache.match(request)
        if (cached) return cached
        const fresh = await fetch(request)
        if (fresh.ok) cache.put(request, fresh.clone())
        return fresh
      })(),
    )
    return
  }

  // Hashed Vite assets (JS/CSS): cache-first into shell cache.
  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      const cached = await cache.match(request)
      if (cached) return cached
      const fresh = await fetch(request)
      if (fresh.ok) cache.put(request, fresh.clone())
      return fresh
    })(),
  )
})
