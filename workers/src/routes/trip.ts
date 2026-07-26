import { Hono } from 'hono'
import type { Context } from 'hono'
import type { Env } from '../env'
import {
  deleteTripSync,
  getBuyer,
  getTripSync,
  putTripSync,
  recordTripSyncWriteAttempt,
} from '../lib/kv'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'

export const trip = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

// --- Synced app state -------------------------------------------------------
//
// People plan a trip on a laptop and walk into the park with a phone. Every
// planner surface was device-local before this, so signing in on the second
// device showed an empty board. This is the one server-side copy: whole-
// document last-write-wins keyed on the client's `updatedAt`.
//
// The Worker deliberately does not parse `doc`. The trip schema lives in the
// PWA (apps/guide/src/trip/schema.ts) and evolves with it; mirroring it here
// would mean a Worker deploy for every planner change, and a stale mirror
// would start rejecting valid plans — the worst failure this feature could
// have. The envelope, the size, and the write rate are what the Worker owns.

// A plan carrying program snapshots plus notes for every stop lands in the low
// tens of KB. 256 KiB is an order of magnitude of headroom while keeping a
// hostile client from parking megabytes in KV.
const MAX_SYNC_BYTES = 256 * 1024
// Well above real use: the client debounces to one write per burst of edits.
const MAX_SYNC_WRITES_PER_HOUR = 60

// Same convention as /api/auth/me: a buyer past expiresAt has lost access
// (a refund sets expiresAt = now, and the JWT it revokes can outlive it by
// months); no buyer record at all is an operator session, which is allowed.
async function accessEnded(
  c: Context<{ Bindings: Env; Variables: AuthVariables }>,
): Promise<boolean> {
  const buyer = await getBuyer(c.env, c.get('authSub'))
  return !!buyer && buyer.expiresAt * 1000 < Date.now()
}

trip.get('/plan', requireAuth, async (c) => {
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410)
  const record = await getTripSync(c.env, c.get('authSub'))
  // no-store on both paths: whether an account HAS synced state is itself
  // private, and an edge or proxy cache holding "doc: null" would also serve
  // an empty plan to a device that has since synced one.
  if (!record) return c.json({ doc: null }, 200, { 'Cache-Control': 'no-store' })
  // The stored doc is client JSON held as a string. Re-parsing here would be a
  // second place for it to fail; it goes back out the way it came in.
  return c.body(`{"doc":${record.doc},"updatedAt":${JSON.stringify(record.updatedAt)}}`, 200, {
    'Content-Type': 'application/json; charset=utf-8',
    // Private state behind a bearer token: never store it at the edge.
    'Cache-Control': 'no-store',
  })
})

trip.post('/plan', requireAuth, async (c) => {
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410)

  const raw = await c.req.text()
  if (new TextEncoder().encode(raw).length > MAX_SYNC_BYTES) {
    return c.json({ error: 'Too much to sync' }, 413)
  }

  let body: { doc?: unknown; updatedAt?: unknown }
  try {
    body = JSON.parse(raw) as typeof body
  } catch {
    return c.json({ error: 'Invalid body' }, 400)
  }

  // Envelope only: `doc` must be a JSON object, `updatedAt` a real timestamp.
  // What is inside `doc` is the client's business.
  if (!body.doc || typeof body.doc !== 'object' || Array.isArray(body.doc)) {
    return c.json({ error: 'Invalid document' }, 400)
  }
  const updatedAt = typeof body.updatedAt === 'string' ? body.updatedAt : ''
  if (!updatedAt || Number.isNaN(Date.parse(updatedAt))) {
    return c.json({ error: 'Invalid timestamp' }, 400)
  }

  const sub = c.get('authSub')
  const attempts = await recordTripSyncWriteAttempt(c.env, sub)
  if (attempts > MAX_SYNC_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many updates. Try again later.' }, 429)
  }

  await putTripSync(c.env, { sub, doc: JSON.stringify(body.doc), updatedAt })
  return c.json({ updatedAt }, 200, { 'Cache-Control': 'no-store' })
})

// Stop syncing this account and drop the server copy. Local state is
// untouched — turning sync off must never look like losing the trip.
// Idempotent, so the client can call it blind.
trip.delete('/plan', requireAuth, async (c) => {
  await deleteTripSync(c.env, c.get('authSub'))
  return c.json({ ok: true })
})
