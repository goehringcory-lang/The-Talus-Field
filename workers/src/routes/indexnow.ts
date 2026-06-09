import { Hono } from 'hono'
import type { Env } from '../env'
import { constantTimeEquals } from '../lib/tokens'

const HOST = 'thetalusfieldjournal.com'
const KEY_LOCATION = `https://${HOST}/${'__KEY__'}.txt`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'
const MAX_URLS_PER_SUBMIT = 10_000

export const indexnow = new Hono<{ Bindings: Env }>()

// POST /api/indexnow/submit
// Body: { urls: string[] }
// Header: Authorization: Bearer <INDEXNOW_ADMIN_TOKEN>
//
// Forwards the URL list to api.indexnow.org so Bing, Yandex, Seznam,
// Naver, and Yep all see the change at once. Author-only — gated by a
// shared secret so random POSTs can't burn the IndexNow quota.
indexnow.post('/submit', async (c) => {
  const key = c.env.INDEXNOW_KEY
  const adminToken = c.env.INDEXNOW_ADMIN_TOKEN
  if (!key || !adminToken) {
    return c.json({ error: 'IndexNow is not configured' }, 503)
  }

  const auth = c.req.header('Authorization') ?? ''
  const presented = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!presented || !constantTimeEquals(presented, adminToken)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req
    .json<{ urls?: unknown }>()
    .catch(() => ({} as { urls?: unknown }))

  const urls = Array.isArray(body.urls) ? body.urls : null
  if (!urls || urls.length === 0) {
    return c.json({ error: 'Missing urls' }, 400)
  }
  if (urls.length > MAX_URLS_PER_SUBMIT) {
    return c.json({ error: `Too many URLs (max ${MAX_URLS_PER_SUBMIT})` }, 400)
  }

  const cleaned: string[] = []
  for (const raw of urls) {
    if (typeof raw !== 'string') {
      return c.json({ error: 'urls must be strings' }, 400)
    }
    let parsed: URL
    try {
      parsed = new URL(raw)
    } catch {
      return c.json({ error: `Invalid URL: ${raw}` }, 400)
    }
    if (parsed.host !== HOST) {
      return c.json({ error: `URL must be on ${HOST}: ${raw}` }, 400)
    }
    cleaned.push(parsed.toString())
  }

  const payload = {
    host: HOST,
    key,
    keyLocation: KEY_LOCATION.replace('__KEY__', key),
    urlList: cleaned,
  }

  const upstream = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })

  return c.json(
    {
      submitted: cleaned.length,
      indexNowStatus: upstream.status,
    },
    upstream.ok ? 200 : 502,
  )
})
