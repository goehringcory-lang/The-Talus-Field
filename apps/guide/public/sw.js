/* The Field Guide service worker. Hand-rolled — see plan Phase 5.
 * BUILD_DATE token below is replaced at build time by vite.config.ts so
 * each deploy gets a fresh shell-cache name and old caches drop on activate. */

const VERSION = '__BUILD_DATE__'
const SHELL_CACHE = `tfg-shell-${VERSION}`
const RUNTIME_CACHE = 'tfg-runtime'
// Map tiles. Unversioned on purpose: a downloaded park map survives deploys.
const TILES_CACHE = 'tfg-tiles'

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/apple-touch-icon.png',
  '/fonts/eb-garamond.woff2',
  '/fonts/eb-garamond-italic.woff2',
  '/fonts/inter.woff2',
  '/fonts/jetbrains-mono.woff2',
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
  if (event.data.type === 'PRECACHE_URLS') {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : []
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) =>
        Promise.all(
          urls.map((url) =>
            cache.match(url).then((cached) => {
              if (cached) return
              return fetch(url).then((res) => {
                if (res.ok) return cache.put(url, res)
              }).catch(() => { /* offline at precache time — will cache on next visit */ })
            }),
          ),
        ),
      ),
    )
  }
})

const RUNTIME_PATTERNS = [
  /\/photos\//,
  /\.woff2$/,
  /\.(svg|png|jpg|jpeg|webp)$/,
]

function isRuntimeAsset(url) {
  return RUNTIME_PATTERNS.some((re) => re.test(url.pathname))
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Map tiles from the Worker proxy: cache-first into the unversioned tile
  // cache. Matched by path (origin-agnostic) so localhost dev and production
  // both work without baking the API host into this static file. The Worker
  // sends ACAO * and immutable cache headers, so storing the response is fine.
  if (/^\/tiles\/\d+\/\d+\/\d+$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(TILES_CACHE)
        const cached = await cache.match(request)
        if (cached) return cached
        const fresh = await fetch(request)
        if (fresh.ok) cache.put(request, fresh.clone())
        return fresh
      })(),
    )
    return
  }

  // Skip remaining cross-origin requests (the API needs to stay fresh, and
  // analytics shouldn't be cached). Fonts are self-hosted, so same-origin.
  if (url.origin !== self.location.origin) return

  // Navigation: network-first, fall back to cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          // Only cache successful shells — caching a 5xx/maintenance page
          // would poison every later offline launch with an error page.
          if (fresh.ok) {
            const cache = await caches.open(SHELL_CACHE)
            cache.put('/index.html', fresh.clone())
          }
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
