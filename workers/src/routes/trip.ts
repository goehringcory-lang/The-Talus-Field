import { Hono } from 'hono'
import type { Env } from '../env'
import {
  deleteTripFeed,
  getBuyer,
  getTripFeed,
  getTripFeedToken,
  putTripFeed,
  recordTripFeedWriteAttempt,
} from '../lib/kv'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import { generateAccessToken } from '../lib/tokens'

// The PWA republishes after every planner edit, so the cap sits well above
// real usage while still stopping a scripted loop from hammering KV.
const MAX_FEED_WRITES_PER_HOUR = 30
// A full trip renders to a few KB of ICS; 128 KiB is an order of magnitude
// of headroom while keeping a hostile payload from bloating KV.
const MAX_ICS_BYTES = 128 * 1024
// generateAccessToken() output: 32 random bytes as lowercase hex.
const TOKEN_RE = /^[0-9a-f]{64}$/

export const trip = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

// Publish (or refresh) the caller's calendar feed. One feed per account:
// a re-publish reuses the existing token, so calendar apps that already
// subscribed keep receiving updates at the same URL.
trip.post('/feed', requireAuth, async (c) => {
  const body = await c.req.json<{ ics?: unknown }>().catch(() => ({}) as { ics?: unknown })
  const ics = body.ics
  if (typeof ics !== 'string' || !ics.startsWith('BEGIN:VCALENDAR')) {
    return c.json({ error: 'Invalid calendar' }, 400)
  }
  if (new TextEncoder().encode(ics).length > MAX_ICS_BYTES) {
    return c.json({ error: 'Calendar too large' }, 400)
  }

  const sub = c.get('authSub')

  // Same convention as the feed GET and /api/calendar/google/sync: a buyer
  // past expiresAt has lost access (a Stripe refund sets expiresAt = now, but
  // the JWT it revokes can outlive it by months); a missing buyer record is an
  // operator session — allow.
  const buyer = await getBuyer(c.env, sub)
  if (buyer && buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 410)
  }

  const attempts = await recordTripFeedWriteAttempt(c.env, sub)
  if (attempts > MAX_FEED_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many updates. Try again later.' }, 429)
  }

  const token = (await getTripFeedToken(c.env, sub)) ?? generateAccessToken()
  await putTripFeed(c.env, token, { sub, ics, updatedAt: new Date().toISOString() })

  return c.json({
    token,
    feedUrl: `${new URL(c.req.url).origin}/api/trip/feed/${token}.ics`,
  })
})

// Public capability URL: the unguessable 64-hex token IS the auth. Calendar
// apps (Google, Apple, Outlook) poll this on their own schedule and can't
// send an Authorization header, so the route takes no JWT.
trip.get('/feed/:file', async (c) => {
  const file = c.req.param('file')
  const token = file.endsWith('.ics') ? file.slice(0, -4) : ''
  if (!TOKEN_RE.test(token)) return c.json({ error: 'Not found' }, 404)

  const record = await getTripFeed(c.env, token)
  if (!record) return c.json({ error: 'Not found' }, 404)

  // Same convention as /api/auth/me: a missing buyer record means an operator
  // session — allow. A buyer record past expiresAt means the paid window
  // lapsed (or a Stripe refund set expiresAt = now), so the feed dies with it.
  const buyer = await getBuyer(c.env, record.sub)
  if (buyer && buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 410)
  }

  return c.body(record.ics, 200, {
    'Content-Type': 'text/calendar; charset=utf-8',
    // Five minutes at the edge keeps aggressive pollers off KV without
    // making a fresh plan edit feel stale.
    'Cache-Control': 'public, max-age=300',
    'Content-Disposition': 'inline; filename="yosemite-trip.ics"',
    // Capability URLs must never land in a search index.
    'X-Robots-Tag': 'noindex',
  })
})

// Revoke the feed: any subscribed calendar starts 404ing on its next poll.
// Idempotent — 200 even when no feed exists, so the client can call it blind.
trip.delete('/feed', requireAuth, async (c) => {
  await deleteTripFeed(c.env, c.get('authSub'))
  return c.json({ ok: true })
})
