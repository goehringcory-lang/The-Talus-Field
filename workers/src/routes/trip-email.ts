import { Hono } from 'hono'
import type { Env } from '../env'
import { recordTripEmailAttempt } from '../lib/kv'
import { sendTripLink } from '../lib/email'

// Reader-facing "email this trip to yourself" for the editorial map
// (page-map.jsx). Unauthenticated by design: the map has no accounts. The
// trip URL is built server-side from a validated id list, so the endpoint
// can never be used to mail an arbitrary link.
export const tripEmail = new Hono<{ Bindings: Env }>()

const EMAIL_MAX = 254
// Same intentionally permissive shape as /api/contact; Resend hard-bounces
// real garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Stop ids as they appear in points.geojson.
const STOP_ID_RE = /^[a-z0-9-]{1,60}$/
// Mirrors TRIP_CAP in page-map.jsx.
const MAX_STOPS = 30
const MAX_SENDS_PER_HOUR = 5

type TripEmailBody = {
  email?: unknown
  stops?: unknown
  // Honeypot. Real browsers won't fill this; bots will.
  website?: unknown
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`tripemail:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

tripEmail.post('/', async (c) => {
  const body = await c.req
    .json<TripEmailBody>()
    .catch(() => ({}) as TripEmailBody)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't learn the honeypot exists.
    return c.json({ ok: true }, 200)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Invalid email' }, 400)
  }

  const stops = Array.isArray(body.stops) ? body.stops : []
  if (
    stops.length < 1 ||
    stops.length > MAX_STOPS ||
    !stops.every((s) => typeof s === 'string' && STOP_ID_RE.test(s))
  ) {
    return c.json({ error: 'Invalid trip' }, 400)
  }
  const ids = [...new Set(stops as string[])]

  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const attempts = await recordTripEmailAttempt(c.env, await hashIp(ip))
  if (attempts > MAX_SENDS_PER_HOUR) {
    return c.json({ error: 'Too many sends. Try again later.' }, 429)
  }

  const origin = c.env.EDITORIAL_BASE_URL || 'https://thetalusfieldjournal.com'
  const tripUrl = `${origin}/map?trip=${ids.join(',')}`

  try {
    await sendTripLink(c.env, { to: email, tripUrl, stopCount: ids.length })
  } catch (err) {
    console.error('trip email send failed', err)
    return c.json({ error: 'Send failed' }, 502)
  }

  return c.json({ ok: true }, 200)
})
