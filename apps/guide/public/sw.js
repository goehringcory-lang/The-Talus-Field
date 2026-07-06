/* The Field Guide service worker. Hand-rolled — see plan Phase 5.
 * BUILD_DATE token below is replaced at build time by vite.config.ts so
 * each deploy gets a fresh shell-cache name and old caches drop on activate. */

const VERSION = '__BUILD_DATE__'
const SHELL_CACHE = `tfg-shell-${VERSION}`
const RUNTIME_CACHE = 'tfg-runtime'
// Map tiles. Unversioned on purpose: a downloaded park map survives deploys.
const TILES_CACHE = 'tfg-tiles'

// Atomic shell precache: the offline navigate handler serves '/index.html',
// and a shell whose script tags point at uncached JS is a blank page in the
// park, so these must land together or the install must fail.
const SHELL_CRITICAL = ['/index.html']

// Best-effort shell extras. '/' is normally a redirect/alias for index.html
// and manifest.webmanifest is cosmetic; neither may brick an update.
const SHELL_OPTIONAL = [
  '/',
  '/manifest.webmanifest',
]

// Hashed JS/CSS emitted by the build, injected by vite.config.ts. Without
// these an update that installs online but first runs offline has an
// index.html whose script tags are in no cache — a blank page in the park.
const BUILD_ASSETS = /* __BUILD_ASSETS__ */ []

// Icons and fonts belong in the unversioned runtime cache: that is the cache
// the fetch handler consults for them (see RUNTIME_PATTERNS below), and it
// survives shell rotation so fonts don't re-download on every deploy.
const RUNTIME_PRECACHE = [
  '/icon-192.v2.png',
  '/icon-512.v2.png',
  '/icon-maskable.v2.png',
  '/apple-touch-icon.v2.png',
  '/brand/favicon-64.png',
  '/brand/mark-96.png',
  '/brand/mark-192.png',
  '/fonts/eb-garamond.woff2',
  '/fonts/eb-garamond-italic.woff2',
  '/fonts/inter.woff2',
  '/fonts/jetbrains-mono.woff2',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL_CACHE)
      await shell.addAll(SHELL_CRITICAL.concat(BUILD_ASSETS))
      await Promise.all(
        SHELL_OPTIONAL.map(async (url) => {
          try {
            const res = await fetch(url)
            if (res.ok) await shell.put(url, res)
          } catch { /* offline at install time — cached on next visit */ }
        }),
      )
      // Best-effort: a missing font must not brick the whole update.
      const runtime = await caches.open(RUNTIME_CACHE)
      await Promise.all(
        RUNTIME_PRECACHE.map(async (url) => {
          if (await runtime.match(url)) return
          try {
            const res = await fetch(url)
            if (res.ok) await runtime.put(url, res)
          } catch { /* offline at install time — cached on next visit */ }
        }),
      )
    })(),
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

const OFFLINE_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline. The Talus Field</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         background: #14130f; color: #e8e4da;
         font: 16px/1.6 Georgia, 'Times New Roman', serif; }
  main { max-width: 26rem; padding: 2rem; text-align: center; }
  h1 { font-size: 1.05rem; letter-spacing: 0.14em; text-transform: uppercase;
       font-weight: 400; margin: 0 0 1rem; }
  p { margin: 0; color: #b9b3a4; }
</style>
</head>
<body>
<main>
  <h1>The Talus Field</h1>
  <p>You're offline and this page isn't saved on this device yet.
     Reconnect once and the guide keeps working offline.</p>
</main>
</body>
</html>`

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
          // First-ever offline visit, nothing cached yet: a branded page
          // beats a bare "Offline" string. Inline only; no assets exist yet.
          return new Response(OFFLINE_PAGE, {
            status: 503,
            statusText: 'Offline',
            headers: { 'content-type': 'text/html; charset=utf-8' },
          })
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
