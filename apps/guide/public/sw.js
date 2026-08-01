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
      // Not addAll: it accepts any 200, and the SPA _redirects rule answers a
      // missing hashed asset with the HTML shell — which addAll would cache
      // under the script URL, permanently (the asset handler is cache-first
      // and activate never purges tfg-shell-*). Fetch each URL, demand the
      // right content type, and fail the whole install on a miss so the old
      // shell stays live instead.
      await Promise.all(
        SHELL_CRITICAL.concat(BUILD_ASSETS).map(async (url) => {
          const res = await fetch(url)
          const wantHtml = url === '/index.html'
          if (!res.ok || isHtml(res) !== wantHtml) {
            throw new Error(`shell precache: bad response for ${url}`)
          }
          await shell.put(url, res)
        }),
      )
      await Promise.all(
        SHELL_OPTIONAL.map(async (url) => {
          try {
            const res = await fetch(url)
            // '/' is an alias for the HTML shell; anything else here (the
            // manifest) must never be the HTML fallback.
            if (res.ok && (url === '/' || !isHtml(res))) await shell.put(url, res)
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
            // Same guard as the fetch handler: never the HTML fallback under
            // an icon/font key in the deploy-surviving runtime cache.
            if (res.ok && !isHtml(res)) await runtime.put(url, res)
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
      // Self-heal poisoned runtime entries. Earlier builds referenced /photos/*
      // files that did not exist yet; the SPA _redirects rule (/* /index.html
      // 200) answered those requests with the HTML shell, and the cache-first
      // handler below stored that HTML under the image URL. Because the runtime
      // cache is unversioned and survives deploys, the region hero and stop
      // photos then render as broken/placeholder even after the real files ship.
      // Drop any runtime entry whose stored response is HTML; the next request
      // refetches the real asset. Downloaded real photos (image/*) are kept.
      await purgeHtmlFromCache(RUNTIME_CACHE)
      await purgeHtmlFromCache(TILES_CACHE)
      await self.clients.claim()
    })(),
  )
})

// Delete cache entries whose stored response is the HTML shell (the SPA
// _redirects fallback), which never belongs under an image/font/tile URL.
async function purgeHtmlFromCache(cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    await Promise.all(
      requests.map(async (req) => {
        const res = await cache.match(req)
        if (res && isHtml(res)) await cache.delete(req)
      }),
    )
  } catch { /* cache API unavailable — non-fatal */ }
}

function isHtml(res) {
  const type = res.headers.get('content-type')
  return !!type && type.includes('text/html')
}

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
                // Same guard as the fetch handler: a missing photo variant
                // comes back as the SPA HTML fallback with a 200, and caching
                // it would poison the deploy-surviving runtime cache.
                if (res.ok && !isHtml(res)) return cache.put(url, res)
              }).catch(() => { /* offline at precache time — will cache on next visit */ })
            }),
          ),
        ),
      ),
    )
  }
})

// --- Web push ---------------------------------------------------------------
//
// Pushes from the Worker carry NO payload (workers/src/lib/push.ts explains
// why: RFC 8291 payload encryption is the riskiest code we could hand-roll,
// and it fails as "notifications silently stop"). So a wake-up asks the Worker
// what it was about, presenting its own endpoint as the capability.
//
// The browser requires a visible notification for every push it delivers, or
// it shows its own "site updated in the background" message and, after a few
// of those, revokes the permission. Every path below therefore ends in a
// showNotification — including the offline and error paths, where a generic
// line is the honest answer.

const API_BASE = '__API_BASE__'

const GENERIC_NOTIFICATION = {
  title: 'The Talus Field',
  body: 'Open the guide for what changed.',
  url: '/',
  tag: 'tfg-generic',
}

async function noticeForThisPush() {
  try {
    const subscription = await self.registration.pushManager.getSubscription()
    if (!subscription) return GENERIC_NOTIFICATION
    const res = await fetch(`${API_BASE}/api/push/pending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    })
    if (!res.ok) return GENERIC_NOTIFICATION
    const data = await res.json()
    const notice = data && data.notice
    if (!notice || typeof notice.title !== 'string' || typeof notice.body !== 'string') {
      return GENERIC_NOTIFICATION
    }
    return {
      title: notice.title,
      body: notice.body,
      // Only ever an in-app path: a server-supplied absolute URL here would
      // turn a push into an open redirect out of the app.
      url: typeof notice.url === 'string' && notice.url.startsWith('/') ? notice.url : '/',
      tag: typeof notice.tag === 'string' ? notice.tag : GENERIC_NOTIFICATION.tag,
    }
  } catch {
    // The device woke for a push but can't reach the Worker. Still has to
    // show something.
    return GENERIC_NOTIFICATION
  }
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    noticeForThisPush().then((notice) =>
      self.registration.showNotification(notice.title, {
        body: notice.body,
        icon: '/icon-192.v2.png',
        badge: '/brand/favicon-64.png',
        // Same tag collapses a repeat rather than stacking two of the same
        // notice in the tray.
        tag: notice.tag,
        data: { url: notice.url },
      }),
    ),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      // Reuse an open window when there is one: launching a second copy of an
      // installed PWA is disorienting, and the running one already holds the
      // trip plan in memory.
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.focus()
          if ('navigate' in client) await client.navigate(target)
          return
        }
      }
      await self.clients.openWindow(target)
    })(),
  )
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

// Captive-portal wifi (hotel lobbies, the Valley's paid networks) accepts the
// connection and then never answers, so a bare navigation fetch hangs forever
// and the cached-shell fallback below never runs: a white screen on launch for
// an app whose whole promise is working without signal.
const NAVIGATE_TIMEOUT_MS = 5000

function fetchNavigation(request) {
  // Feature-guarded: an engine without AbortSignal.timeout keeps the old
  // behaviour rather than throwing on every navigation.
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return fetch(request, { signal: AbortSignal.timeout(NAVIGATE_TIMEOUT_MS) })
  }
  return fetch(request)
}

const RUNTIME_PATTERNS = [
  /\/photos\//,
  /\/tracks\//, // hike track JSONs; ?v= content hash busts on regeneration
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
        // Never cache the SPA HTML fallback under a tile URL (see activate).
        if (fresh.ok && !isHtml(fresh)) cache.put(request, fresh.clone())
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
          const fresh = await fetchNavigation(request)
          // Only cache successful HTML shells. A 5xx/maintenance page would
          // poison every later offline launch, and a same-origin navigation
          // can be a non-HTML document too ("open image in new tab" on a
          // /photos/* URL is a navigate for a JPEG) — caching those bytes
          // under the shell key bricks the app offline.
          if (fresh.ok && isHtml(fresh)) {
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
        // Guard against the SPA _redirects fallback: a missing asset returns
        // index.html with a 200, and caching that HTML under an image/font URL
        // poisons the entry (renders as a broken image, and the runtime cache
        // survives deploys). Only store real asset responses.
        if (fresh.ok && !isHtml(fresh)) cache.put(request, fresh.clone())
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
      // A missing hashed asset also falls back to the HTML shell; caching that
      // as a script/style would brick the app, so store real responses only.
      if (fresh.ok && !isHtml(fresh)) cache.put(request, fresh.clone())
      return fresh
    })(),
  )
})
