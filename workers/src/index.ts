import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env'
import { auth } from './routes/auth'
import { checkout } from './routes/checkout'
import { stripe } from './routes/stripe'
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
        'http://localhost:8000',
      ])
      return allowed.has(origin) ? origin : c.env.APP_BASE_URL
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
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

app.get('/api/inventory', async (c) => {
  const monthLabel = currentMonthLabel()
  const sold = await getInventoryCount(c.env, monthLabel)
  const cap = Number.parseInt(c.env.GUIDE_MONTHLY_CAP, 10)
  return c.json({ sold, cap, monthLabel, reopens: firstOfNextMonthIso() })
})

app.route('/api/auth', auth)
app.route('/api/checkout', checkout)
app.route('/api/stripe', stripe)

export default app
