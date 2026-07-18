import type { Env } from '../env'

export type BuyerRecord = {
  email: string
  purchasedAt: number          // epoch seconds
  expiresAt: number            // epoch seconds
  accessToken: string          // 64-char hex; one-time bootstrap from email
  accessCode: string           // 6-digit zero-padded; for new-device login
  refundedAt?: number          // epoch seconds; set when Stripe reports a refund
}

// One shareable calendar feed per account (/api/trip). The token is the URL
// capability; tripfeedToken:<sub> is the reverse pointer so a re-publish
// reuses it and DELETE can find it without scanning.
export type TripFeedRecord = {
  sub: string                  // JWT sub that owns the feed: buyer email or operator username
  ics: string                  // full VCALENDAR text, served verbatim
  updatedAt: string            // ISO timestamp of the last publish
}

// Google Calendar connection for one account. The refresh token is the
// long-lived secret; it never leaves the Worker. `email` is the connected
// Google account, shown in the app so the buyer can tell which calendar
// they're pushing into.
export type GcalConnectionRecord = {
  sub: string                  // JWT sub that owns the connection
  refreshToken: string         // Google OAuth refresh token (offline access)
  email?: string               // connected Google account, from the id_token
  connectedAt: string          // ISO timestamp of the OAuth grant
}

// uid → { Google event id, content hash } for every event we've pushed. Lets a
// sync delete events dropped from the plan and skip events that haven't changed
// without listing the user's calendar on every edit.
export type GcalEventMap = {
  events: Record<string, { id: string; hash: string }>
  lastSyncAt: string           // ISO timestamp of the last successful sync
}

const BUYER_KEY = (email: string) => `buyer:${email.toLowerCase()}`
const TOKEN_INDEX_KEY = (token: string) => `token:${token}`
const INVENTORY_KEY = (yyyymm: string) => `inventory:${yyyymm}`
const LOGIN_ATTEMPTS_KEY = (email: string) => `loginAttempts:${email.toLowerCase()}`
const RESEND_ATTEMPTS_KEY = (email: string) => `resendAttempts:${email.toLowerCase()}`
const RESEND_ATTEMPTS_IP_KEY = (ip: string) => `resendAttemptsIp:${ip}`
const DEV_LOGIN_ATTEMPTS_KEY = (ip: string, username: string) =>
  `devLoginAttempts:${ip}:${username.toLowerCase()}`
const TRIP_FEED_KEY = (token: string) => `tripfeed:${token}`
const TRIP_FEED_TOKEN_KEY = (sub: string) => `tripfeedToken:${sub.toLowerCase()}`
const TRIP_FEED_WRITE_ATTEMPTS_KEY = (sub: string) =>
  `tripfeedWriteAttempts:${sub.toLowerCase()}`
const TRIP_EMAIL_ATTEMPTS_KEY = (ipHash: string) => `tripEmailAttempts:${ipHash}`
const WAITLIST_ATTEMPTS_KEY = (ipHash: string) => `waitlistAttempts:${ipHash}`
const CONTACT_ATTEMPTS_KEY = (ipHash: string) => `contactAttempts:${ipHash}`
const RENEWAL_NOTICE_KEY = (email: string, stage: string) =>
  `renewalNotice:${email.toLowerCase()}:${stage}`
const RENEW_LINK_ATTEMPTS_KEY = (ipHash: string) => `renewLinkAttempts:${ipHash}`

// Google Calendar OAuth push (/api/calendar). Unlike the trip feed, the client
// holds no capability token: the refresh token lives here, keyed by the JWT
// sub, and the app only ever sees a boolean "connected" plus the email.
const GCAL_STATE_KEY = (state: string) => `gcalstate:${state}`
const GCAL_CONNECTION_KEY = (sub: string) => `gcal:${sub.toLowerCase()}`
const GCAL_ACCESS_KEY = (sub: string) => `gcalAccess:${sub.toLowerCase()}`
const GCAL_EVENTS_KEY = (sub: string) => `gcalEvents:${sub.toLowerCase()}`
const GCAL_SYNC_ATTEMPTS_KEY = (sub: string) => `gcalSyncAttempts:${sub.toLowerCase()}`

export function currentMonthLabel(at = new Date()): string {
  const y = at.getUTCFullYear()
  const m = String(at.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function firstOfNextMonthIso(at = new Date()): string {
  const y = at.getUTCFullYear()
  const m = at.getUTCMonth() + 1
  const next = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1))
  return next.toISOString()
}

export async function getBuyer(env: Env, email: string): Promise<BuyerRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(BUYER_KEY(email))
  if (!raw) return null
  try {
    return JSON.parse(raw) as BuyerRecord
  } catch (err) {
    console.error('getBuyer: corrupt KV record', { email, err })
    return null
  }
}

export async function putBuyer(env: Env, record: BuyerRecord): Promise<void> {
  await env.GUIDE_BUYERS.put(BUYER_KEY(record.email), JSON.stringify(record))
  // Reverse index so /api/auth/exchange can resolve token → email without scanning.
  await env.GUIDE_BUYERS.put(TOKEN_INDEX_KEY(record.accessToken), record.email.toLowerCase())
}

export async function getEmailByAccessToken(env: Env, token: string): Promise<string | null> {
  return env.GUIDE_BUYERS.get(TOKEN_INDEX_KEY(token))
}

export async function getInventoryCount(env: Env, monthLabel: string): Promise<number> {
  const raw = await env.GUIDE_BUYERS.get(INVENTORY_KEY(monthLabel))
  return raw ? Number.parseInt(raw, 10) : 0
}

export async function incrementInventory(env: Env, monthLabel: string): Promise<number> {
  // KV is eventually consistent, but at <100/month the race is acceptable.
  const next = (await getInventoryCount(env, monthLabel)) + 1
  await env.GUIDE_BUYERS.put(INVENTORY_KEY(monthLabel), String(next))
  return next
}

// Shared fixed-window counter for every rate-limit bucket below. The window
// anchors to the FIRST attempt: re-putting with a fresh expirationTtl on every
// increment (the old scheme) let one request per ~55 minutes keep a bucket
// alive forever, which for attacker-chosen keys (a victim's login email) was a
// permanent-lockout DoS. The reset time is stored in the value and reused as
// an absolute `expiration`, so trailing attempts can't extend the window.
type RateWindow = { n: number; resetAt: number }

async function incrementFixedWindow(env: Env, key: string): Promise<number> {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const windowSeconds = 60 * 60
  let count = 0
  let resetAt = nowSeconds + windowSeconds
  const raw = await env.GUIDE_BUYERS.get(key)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as RateWindow | number
      if (typeof parsed === 'number') {
        // Legacy plain-count value from the rolling-window era: adopt the
        // count into a fresh window rather than resetting it to zero.
        count = parsed
      } else if (
        typeof parsed?.n === 'number' &&
        typeof parsed?.resetAt === 'number' &&
        parsed.resetAt > nowSeconds
      ) {
        count = parsed.n
        resetAt = parsed.resetAt
      }
    } catch {
      // Corrupt value: start a fresh window.
    }
  }
  // KV rejects expirations less than 60s out; a window that close to done may
  // as well restart.
  if (resetAt - nowSeconds < 60) resetAt = nowSeconds + windowSeconds
  const next = count + 1
  await env.GUIDE_BUYERS.put(key, JSON.stringify({ n: next, resetAt }), { expiration: resetAt })
  return next
}

export async function recordLoginAttempt(env: Env, email: string): Promise<number> {
  return incrementFixedWindow(env, LOGIN_ATTEMPTS_KEY(email))
}

export async function clearLoginAttempts(env: Env, email: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(LOGIN_ATTEMPTS_KEY(email))
}

// Resend attempts are counted per email AND per IP. Each attempt sends a real
// email through Resend, so the caps are lower than login's: the per-email
// bucket protects an individual buyer's inbox from being spammed, the per-IP
// bucket stops one caller probing many addresses.
export async function recordResendAttempt(env: Env, email: string): Promise<number> {
  return incrementFixedWindow(env, RESEND_ATTEMPTS_KEY(email))
}

export async function recordResendAttemptByIp(env: Env, ip: string): Promise<number> {
  return incrementFixedWindow(env, RESEND_ATTEMPTS_IP_KEY(ip))
}

export async function recordDevLoginAttempt(
  env: Env,
  ip: string,
  username: string,
): Promise<number> {
  return incrementFixedWindow(env, DEV_LOGIN_ATTEMPTS_KEY(ip, username))
}

export async function clearDevLoginAttempts(
  env: Env,
  ip: string,
  username: string,
): Promise<void> {
  await env.GUIDE_BUYERS.delete(DEV_LOGIN_ATTEMPTS_KEY(ip, username))
}

// Calendar apps poll a subscribed feed indefinitely, so the keys live long:
// 400 days covers any single trip's planning horizon, and every publish
// refreshes both keys to the full TTL. An abandoned feed falls out of KV on
// its own instead of accumulating forever.
const TRIP_FEED_TTL_SECONDS = 400 * 24 * 60 * 60

export async function getTripFeed(env: Env, token: string): Promise<TripFeedRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(TRIP_FEED_KEY(token))
  if (!raw) return null
  try {
    return JSON.parse(raw) as TripFeedRecord
  } catch (err) {
    // Log only a prefix: the full token is a capability URL.
    console.error('getTripFeed: corrupt KV record', { token: token.slice(0, 8), err })
    return null
  }
}

export async function putTripFeed(
  env: Env,
  token: string,
  record: TripFeedRecord,
): Promise<void> {
  await env.GUIDE_BUYERS.put(TRIP_FEED_KEY(token), JSON.stringify(record), {
    expirationTtl: TRIP_FEED_TTL_SECONDS,
  })
  // Reverse index so a re-publish resolves sub → token without scanning.
  await env.GUIDE_BUYERS.put(TRIP_FEED_TOKEN_KEY(record.sub), token, {
    expirationTtl: TRIP_FEED_TTL_SECONDS,
  })
}

export async function getTripFeedToken(env: Env, sub: string): Promise<string | null> {
  return env.GUIDE_BUYERS.get(TRIP_FEED_TOKEN_KEY(sub))
}

export async function deleteTripFeed(env: Env, sub: string): Promise<void> {
  const token = await getTripFeedToken(env, sub)
  if (token) await env.GUIDE_BUYERS.delete(TRIP_FEED_KEY(token))
  await env.GUIDE_BUYERS.delete(TRIP_FEED_TOKEN_KEY(sub))
}

// "Email this trip" sends a real email per call, so the window is tight.
// Keyed by hashed IP: the endpoint is unauthenticated and the raw address
// never needs to touch KV.
export async function recordTripEmailAttempt(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, TRIP_EMAIL_ATTEMPTS_KEY(ipHash))
}

// The guide waitlist button mails the operator per call, so the window is
// tight and keyed by hashed IP (the endpoint is unauthenticated).
export async function recordWaitlistAttempt(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, WAITLIST_ATTEMPTS_KEY(ipHash))
}

// The contact form mails the operator inbox per call; same hashed-IP window
// as the waitlist button (the endpoint is unauthenticated).
export async function recordContactAttempt(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, CONTACT_ATTEMPTS_KEY(ipHash))
}

export async function recordTripFeedWriteAttempt(env: Env, sub: string): Promise<number> {
  return incrementFixedWindow(env, TRIP_FEED_WRITE_ATTEMPTS_KEY(sub))
}

// --- Renewal arc (/api/checkout/renew + the daily sweep) --------------------

// Per-stage sentinel so the cron sends each renewal notice exactly once.
// 180 days comfortably outlives the whole notice window (60 days) and clears
// itself before the buyer's NEXT renewal cycle could reuse the stage.
const RENEWAL_NOTICE_TTL_SECONDS = 180 * 24 * 60 * 60

export async function hasRenewalNotice(env: Env, email: string, stage: string): Promise<boolean> {
  return (await env.GUIDE_BUYERS.get(RENEWAL_NOTICE_KEY(email, stage))) !== null
}

export async function markRenewalNotice(env: Env, email: string, stage: string): Promise<void> {
  await env.GUIDE_BUYERS.put(RENEWAL_NOTICE_KEY(email, stage), '1', {
    expirationTtl: RENEWAL_NOTICE_TTL_SECONDS,
  })
}

// GET /api/checkout/renew?token= is unauthenticated (it comes from an email
// link), so the token lookup is rate-limited by hashed IP against enumeration.
export async function recordRenewLinkAttempt(env: Env, ipHash: string): Promise<number> {
  const key = RENEW_LINK_ATTEMPTS_KEY(ipHash)
  const raw = await env.GUIDE_BUYERS.get(key)
  const next = (raw ? Number.parseInt(raw, 10) : 0) + 1
  // 1-hour TTL gives a rolling window per IP.
  await env.GUIDE_BUYERS.put(key, String(next), { expirationTtl: 60 * 60 })
  return next
}

// --- Google Calendar (/api/calendar) ---------------------------------------

// The OAuth state ties a callback (which arrives with no Authorization header)
// back to the account that started the flow. Single-use and short-lived: 10
// minutes is well past a slow consent screen but leaves no lingering handle.
const GCAL_STATE_TTL_SECONDS = 10 * 60

/** Stash the account behind a one-time OAuth state value. */
export async function putGcalState(env: Env, state: string, sub: string): Promise<void> {
  await env.GUIDE_BUYERS.put(GCAL_STATE_KEY(state), sub, {
    expirationTtl: GCAL_STATE_TTL_SECONDS,
  })
}

/** Resolve and consume an OAuth state (single use): returns the sub, or null. */
export async function takeGcalState(env: Env, state: string): Promise<string | null> {
  const sub = await env.GUIDE_BUYERS.get(GCAL_STATE_KEY(state))
  if (sub) await env.GUIDE_BUYERS.delete(GCAL_STATE_KEY(state))
  return sub
}

export async function getGcalConnection(
  env: Env,
  sub: string,
): Promise<GcalConnectionRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(GCAL_CONNECTION_KEY(sub))
  if (!raw) return null
  try {
    return JSON.parse(raw) as GcalConnectionRecord
  } catch (err) {
    console.error('getGcalConnection: corrupt KV record', { sub, err })
    return null
  }
}

/** Store the connection. No TTL: it holds the live refresh token and is
 * removed explicitly on disconnect (or when Google reports the grant gone). */
export async function putGcalConnection(
  env: Env,
  record: GcalConnectionRecord,
): Promise<void> {
  await env.GUIDE_BUYERS.put(GCAL_CONNECTION_KEY(record.sub), JSON.stringify(record))
}

/** Remove every key for one account's connection: record, cached access
 * token, and event mapping. Used by disconnect and by a revoked-grant purge. */
export async function deleteGcalConnection(env: Env, sub: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(GCAL_CONNECTION_KEY(sub))
  await env.GUIDE_BUYERS.delete(GCAL_ACCESS_KEY(sub))
  await env.GUIDE_BUYERS.delete(GCAL_EVENTS_KEY(sub))
}

export async function getGcalAccessToken(env: Env, sub: string): Promise<string | null> {
  return env.GUIDE_BUYERS.get(GCAL_ACCESS_KEY(sub))
}

/** Cache a fresh access token just short of its real expiry so a cached read
 * never hands out a token that dies mid-request. */
export async function putGcalAccessToken(
  env: Env,
  sub: string,
  token: string,
  ttlSeconds: number,
): Promise<void> {
  // KV rejects TTLs under 60s; below that, skip the cache and let the next
  // sync refresh again rather than store a token that's about to expire.
  if (ttlSeconds < 60) return
  await env.GUIDE_BUYERS.put(GCAL_ACCESS_KEY(sub), token, { expirationTtl: ttlSeconds })
}

export async function getGcalEventMap(env: Env, sub: string): Promise<GcalEventMap | null> {
  const raw = await env.GUIDE_BUYERS.get(GCAL_EVENTS_KEY(sub))
  if (!raw) return null
  try {
    return JSON.parse(raw) as GcalEventMap
  } catch (err) {
    console.error('getGcalEventMap: corrupt KV record', { sub, err })
    return null
  }
}

export async function putGcalEventMap(env: Env, sub: string, map: GcalEventMap): Promise<void> {
  await env.GUIDE_BUYERS.put(GCAL_EVENTS_KEY(sub), JSON.stringify(map))
}

export async function recordGcalSyncAttempt(env: Env, sub: string): Promise<number> {
  const key = GCAL_SYNC_ATTEMPTS_KEY(sub)
  const raw = await env.GUIDE_BUYERS.get(key)
  const next = (raw ? Number.parseInt(raw, 10) : 0) + 1
  // 1-hour TTL gives a rolling window per sub.
  await env.GUIDE_BUYERS.put(key, String(next), { expirationTtl: 60 * 60 })
  return next
}
