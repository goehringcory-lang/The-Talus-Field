import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env'
import { auth } from './routes/auth'
import { calendar } from './routes/calendar'
import { checkout } from './routes/checkout'
import { contact } from './routes/contact'
import { indexnow } from './routes/indexnow'
import { ingestNpsWindow, programs } from './routes/programs'
import { stripe } from './routes/stripe'
import { trip } from './routes/trip'
import { tripEmail } from './routes/trip-email'
import { weather } from './routes/weather'
import { widget, widgetScript } from './routes/widget'
import { refreshWeather } from './lib/weather'
import { sweepRenewals } from './lib/renewals'
import {
  currentMonthLabel,
  firstOfNextMonthIso,
  getInventoryCount,
} from './lib/kv'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '/api/*',
  cors({
    origin: (origin, c) => {
      // Allow editorial site (apex + www), the PWA, and local dev.
      const allowed = new Set([
        c.env.APP_BASE_URL,
        c.env.EDITORIAL_BASE_URL,
        'https://thetalusfieldjournal.com',
        'https://www.thetalusfieldjournal.com',
        'http://localhost:5173',
        'http://localhost:5174',
        // vite preview: the documented way to exercise the PWA's service
        // worker locally (it registers in prod builds only).
        'http://localhost:4173',
        'http://localhost:8000',
      ])
      // The PWA's unlisted Cloudflare Pages URLs: the stable production
      // alias plus per-deploy preview hosts (<hash>.talus-field-guide.pages.dev).
      if (
        origin === 'https://talus-field-guide.pages.dev' ||
        (origin.startsWith('https://') &&
          origin.endsWith('.talus-field-guide.pages.dev'))
      ) {
        return origin
      }
      return allowed.has(origin) ? origin : c.env.APP_BASE_URL
    },
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'stripe-signature'],
    maxAge: 600,
  }),
)

app.get('/', (c) => c.text('Talus Field Guide API. See /api/inventory.'))

// Tile proxy. Reasons:
//   1. Map tile CDNs (server.arcgisonline.com, tile.openstreetmap.org,
//      basemap.nationalmap.gov, etc.) are widely blocked by ad-blockers
//      and DNS filters — EasyPrivacy and most default blocklists
//      classify them as fingerprinting trackers because each tile URL
//      carries unique coordinates and the request volume is high.
//   2. Proxying through our own first-party domain bypasses every
//      common blocker, so the map works for all visitors regardless of
//      what they're running locally.
//   3. Cloudflare's edge cache (cf.cacheTtl + cacheEverything) means
//      Esri only gets hit once per tile per cache-lifetime per region.
//      Tiles are effectively static — 30 days is a safe TTL.
//
// Mounted at the root level, not under /api/*, so the CORS middleware
// above doesn't run on image requests (Leaflet uses plain <img> tags
// with no crossOrigin attribute, so the browser wouldn't preflight
// anyway, but this keeps the path clean).
app.get('/tiles/:z/:y/:x', async (c) => {
  const { z, y, x } = c.req.param()
  // Validate against path traversal / non-numeric input.
  if (!/^\d+$/.test(z) || !/^\d+$/.test(y) || !/^\d+$/.test(x)) {
    return c.text('Bad tile coordinates', 400)
  }
  const upstream = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`
  const resp = await fetch(upstream, {
    cf: { cacheTtl: 2592000, cacheEverything: true },
  })
  if (!resp.ok) {
    return new Response(null, { status: resp.status })
  }
  return new Response(resp.body, {
    status: 200,
    headers: {
      'Content-Type': resp.headers.get('Content-Type') ?? 'image/png',
      'Cache-Control': 'public, max-age=2592000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  })
})

// The embeddable conditions widget lives at the ROOT level (like /tiles), NOT
// under /api/*: it runs on arbitrary third-party origins, so it needs a plain
// CORS * that the /api/* origin-echo middleware would clobber.
app.route('/widget', widget)
app.get('/widget.js', (c) =>
  c.text(widgetScript(), 200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*',
  }),
)

app.get('/api/inventory', async (c) => {
  const monthLabel = currentMonthLabel()
  const sold = await getInventoryCount(c.env, monthLabel)
  const parsedCap = Number.parseInt(c.env.GUIDE_MONTHLY_CAP, 10)
  // Coerce a missing/non-numeric cap to 0 so the scarcity JSON never
  // serializes `cap: null` (NaN -> null) and the counter reads as sold out.
  const cap = Number.isNaN(parsedCap) ? 0 : parsedCap
  // priceCents lets the editorial buy box render the live price, so the
  // number is edited in exactly one place: [vars] in wrangler.toml.
  const parsedPrice = Number.parseInt(c.env.GUIDE_PRICE_CENTS, 10)
  const priceCents = Number.isNaN(parsedPrice) ? null : parsedPrice
  // The PWA's renew button reads this so the renewal price is also edited in
  // exactly one place ([vars] in wrangler.toml).
  const parsedRenewal = Number.parseInt(c.env.GUIDE_RENEWAL_PRICE_CENTS, 10)
  const renewalPriceCents = Number.isNaN(parsedRenewal) ? null : parsedRenewal
  return c.json({ sold, cap, monthLabel, priceCents, renewalPriceCents, reopens: firstOfNextMonthIso() })
})

app.route('/api/auth', auth)
app.route('/api/calendar', calendar)
app.route('/api/checkout', checkout)
app.route('/api/contact', contact)
app.route('/api/indexnow', indexnow)
app.route('/api/programs', programs)
app.route('/api/stripe', stripe)
// Mounted before /api/trip's router would see it: separate route so the
// editorial map's unauthenticated sender never shares code with the PWA's
// JWT-gated feed.
app.route('/api/trip/email', tripEmail)
app.route('/api/trip', trip)
app.route('/api/weather', weather)

// Daily cron ([triggers] in wrangler.toml): refresh the KV program cache from
// the NPS Events API so /api/programs answers from KV, not a live fetch, and
// give the weather record a daily floor (its real freshness is owned by the
// 2h on-demand refresh in the route).
async function scheduled(
  _controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  ctx.waitUntil(
    ingestNpsWindow(env).catch((err) => {
      console.error('scheduled: NPS ingest failed', err)
    }),
  )
  ctx.waitUntil(
    refreshWeather(env).catch((err) => {
      console.error('scheduled: weather refresh failed', err)
    }),
  )
  ctx.waitUntil(
    sweepRenewals(env).catch((err) => {
      console.error('scheduled: renewal sweep failed', err)
    }),
  )
}

export default {
  fetch: app.fetch,
  scheduled,
}
