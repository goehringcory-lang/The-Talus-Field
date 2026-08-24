import type { Env } from '../env'

export type BuyerRecord = {
  email: string
  purchasedAt: number          // epoch seconds
  expiresAt: number            // epoch seconds
  accessToken: string          // 64-char hex; one-time bootstrap from email
  accessCode: string           // 6-digit zero-padded; for new-device login
  refundedAt?: number          // epoch seconds; set when Stripe reports a refund
  lastExtensionEventId?: string // Stripe event id that last extended expiresAt
  // Set when the record was granted by a shared promo code (/api/redeem)
  // rather than a purchase. The renewal sweep reads it (a 30-day grant must
  // not get the "ends in two months" notice on day one); the Stripe webhook
  // clears it the moment any real payment extends the record.
  promoCode?: string
}

// One account's synced app state (/api/trip/plan): the trip plan, saved stops,
// visited stops, and private notes, so a trip planned on a laptop is there on
// the phone in the park. The Worker is a dumb box here on purpose — `doc` is
// stored and served verbatim, never interpreted. The PWA owns the shape (see
// apps/guide/src/sync/schema.ts) and re-validates on read, which is what lets
// the plan schema evolve without a Worker deploy in lockstep.
export type TripSyncRecord = {
  sub: string                  // JWT sub that owns the state
  doc: string                  // client JSON, opaque to the Worker
  updatedAt: string            // ISO stamp the client sent; the merge key
}

// One device's push subscription. Keyed by a hash of the endpoint, not by
// account: a buyer may have the guide installed on a phone and a tablet, and
// each install has its own endpoint. `sub` is the reverse pointer used by the
// sweeps, and `endpoint` is the capability URL the push service issued.
//
// `tripStart`/`tripEnd` are the ONE piece of planner state that reaches the
// server outside the opaque sync document, and only because a morning-of nudge
// cannot be scheduled without knowing which mornings matter. The app refreshes
// them whenever the dates change. Nothing about WHAT is planned is sent.
export type PushSubscriptionRecord = {
  sub: string                  // JWT sub that owns this device
  endpoint: string             // push service capability URL
  p256dh?: string              // kept for a future encrypted-payload path
  auth?: string
  createdAt: string            // ISO
  tripStart?: string           // YYYY-MM-DD
  tripEnd?: string             // YYYY-MM-DD
}

// The message a woken service worker comes back to collect (see lib/push.ts on
// why pushes carry no payload). Written immediately before the push is sent,
// short-lived: if the device does not collect it within the hour, the moment
// has passed and a generic notification is the honest fallback.
export type PushPendingRecord = {
  title: string
  body: string
  url: string                  // app path to open on tap
  tag: string                  // collapses repeats of the same notice
}

const BUYER_KEY = (email: string) => `buyer:${email.toLowerCase()}`
const TOKEN_INDEX_KEY = (token: string) => `token:${token}`
const INVENTORY_KEY = (yyyymm: string) => `inventory:${yyyymm}`
const LOGIN_ATTEMPTS_KEY = (email: string) => `loginAttempts:${email.toLowerCase()}`
const RESEND_ATTEMPTS_KEY = (email: string) => `resendAttempts:${email.toLowerCase()}`
const RESEND_ATTEMPTS_IP_KEY = (ip: string) => `resendAttemptsIp:${ip}`
// Keyed by username alone, like LOGIN_ATTEMPTS_KEY is by email: a per-IP key
// let a distributed attacker dodge the cap while brute-forcing the code on
// the one door that mints a paid JWT without a purchase.
const DEV_LOGIN_ATTEMPTS_KEY = (username: string) =>
  `devLoginAttempts:${username.toLowerCase()}`
const CHECKOUT_ATTEMPTS_KEY = (ipHash: string) => `checkoutAttempts:${ipHash}`
const PUSH_SUB_KEY = (endpointHash: string) => `push:${endpointHash}`
const PUSH_PENDING_KEY = (endpointHash: string) => `pushPending:${endpointHash}`
const PUSH_NOTICE_KEY = (endpointHash: string, stage: string) =>
  `pushNotice:${endpointHash}:${stage}`
const TRIP_SYNC_KEY = (sub: string) => `tripsync:${sub.toLowerCase()}`
const TRIP_SYNC_WRITE_ATTEMPTS_KEY = (sub: string) =>
  `tripsyncWriteAttempts:${sub.toLowerCase()}`
const TRIP_EMAIL_ATTEMPTS_KEY = (ipHash: string) => `tripEmailAttempts:${ipHash}`
const WAITLIST_ATTEMPTS_KEY = (ipHash: string) => `waitlistAttempts:${ipHash}`
const CONTACT_ATTEMPTS_KEY = (ipHash: string) => `contactAttempts:${ipHash}`
const RENEWAL_NOTICE_KEY = (email: string, stage: string) =>
  `renewalNotice:${email.toLowerCase()}:${stage}`
const RENEW_LINK_ATTEMPTS_KEY = (ipHash: string) => `renewLinkAttempts:${ipHash}`
const PROMO_REDEEMED_KEY = (code: string, email: string) =>
  `promoRedeemed:${code.toUpperCase()}:${email.toLowerCase()}`
const REDEEM_ATTEMPTS_KEY = (email: string) => `redeemAttempts:${email.toLowerCase()}`
const REDEEM_ATTEMPTS_IP_KEY = (ipHash: string) => `redeemAttemptsIp:${ipHash}`

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

export async function recordDevLoginAttempt(env: Env, username: string): Promise<number> {
  return incrementFixedWindow(env, DEV_LOGIN_ATTEMPTS_KEY(username))
}

export async function clearDevLoginAttempts(env: Env, username: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(DEV_LOGIN_ATTEMPTS_KEY(username))
}

export async function recordCheckoutAttempt(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, CHECKOUT_ATTEMPTS_KEY(ipHash))
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

// --- Web push subscriptions (/api/push) -------------------------------------

// Endpoints are long capability URLs and are not safe as raw KV key material
// (length limits, and they end up in logs). A SHA-256 of the endpoint is a
// stable, fixed-width id that both the app and the sweeps can derive.
export async function hashEndpoint(endpoint: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Browsers rotate push endpoints on their own schedule and installs go stale
// silently. A year of TTL, refreshed on every re-subscribe (the app
// re-registers at boot), keeps the keyspace from filling with dead devices.
const PUSH_SUB_TTL_SECONDS = 365 * 24 * 60 * 60

export async function getPushSubscription(
  env: Env,
  endpointHash: string,
): Promise<PushSubscriptionRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(PUSH_SUB_KEY(endpointHash))
  if (!raw) return null
  try {
    return JSON.parse(raw) as PushSubscriptionRecord
  } catch (err) {
    console.error('getPushSubscription: corrupt KV record', { endpointHash, err })
    return null
  }
}

export async function putPushSubscription(
  env: Env,
  endpointHash: string,
  record: PushSubscriptionRecord,
): Promise<void> {
  await env.GUIDE_BUYERS.put(PUSH_SUB_KEY(endpointHash), JSON.stringify(record), {
    expirationTtl: PUSH_SUB_TTL_SECONDS,
  })
}

export async function deletePushSubscription(env: Env, endpointHash: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(PUSH_SUB_KEY(endpointHash))
  await env.GUIDE_BUYERS.delete(PUSH_PENDING_KEY(endpointHash))
}

// The pending notice a woken service worker collects. One hour: a device that
// has not come back by then has missed the moment, and the SW's generic
// fallback is more honest than a stale "leaving today!".
const PUSH_PENDING_TTL_SECONDS = 60 * 60

export async function putPushPending(
  env: Env,
  endpointHash: string,
  record: PushPendingRecord,
): Promise<void> {
  await env.GUIDE_BUYERS.put(PUSH_PENDING_KEY(endpointHash), JSON.stringify(record), {
    expirationTtl: PUSH_PENDING_TTL_SECONDS,
  })
}

/** Read and consume the pending notice (single use). */
export async function takePushPending(
  env: Env,
  endpointHash: string,
): Promise<PushPendingRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(PUSH_PENDING_KEY(endpointHash))
  if (!raw) return null
  await env.GUIDE_BUYERS.delete(PUSH_PENDING_KEY(endpointHash))
  try {
    return JSON.parse(raw) as PushPendingRecord
  } catch {
    return null
  }
}

// Per-(device, stage) sentinel so each push notice fires exactly once. Same
// shape as the renewal email sentinels; the trip-day stages embed the date, so
// a 30-day TTL clears them well before the same date could come round again.
const PUSH_NOTICE_TTL_SECONDS = 30 * 24 * 60 * 60

export async function hasPushNotice(
  env: Env,
  endpointHash: string,
  stage: string,
): Promise<boolean> {
  return (await env.GUIDE_BUYERS.get(PUSH_NOTICE_KEY(endpointHash, stage))) !== null
}

export async function markPushNotice(
  env: Env,
  endpointHash: string,
  stage: string,
): Promise<void> {
  await env.GUIDE_BUYERS.put(PUSH_NOTICE_KEY(endpointHash, stage), '1', {
    expirationTtl: PUSH_NOTICE_TTL_SECONDS,
  })
}

// --- Synced app state (/api/trip/plan) --------------------------------------

// Same 400-day horizon as the calendar feed, refreshed on every write: a buyer
// who stops planning for a season still finds their trip, and an abandoned
// record ages out of KV on its own.
const TRIP_SYNC_TTL_SECONDS = 400 * 24 * 60 * 60

export async function getTripSync(env: Env, sub: string): Promise<TripSyncRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(TRIP_SYNC_KEY(sub))
  if (!raw) return null
  try {
    return JSON.parse(raw) as TripSyncRecord
  } catch (err) {
    console.error('getTripSync: corrupt KV record', { sub, err })
    return null
  }
}

export async function putTripSync(env: Env, record: TripSyncRecord): Promise<void> {
  await env.GUIDE_BUYERS.put(TRIP_SYNC_KEY(record.sub), JSON.stringify(record), {
    expirationTtl: TRIP_SYNC_TTL_SECONDS,
  })
}

export async function deleteTripSync(env: Env, sub: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(TRIP_SYNC_KEY(sub))
}

export async function recordTripSyncWriteAttempt(env: Env, sub: string): Promise<number> {
  return incrementFixedWindow(env, TRIP_SYNC_WRITE_ATTEMPTS_KEY(sub))
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
// Fixed window like every other counter: the old re-put-with-fresh-TTL scheme
// let one request per ~55 minutes (a mail scanner prefetching the link behind
// a hotel/CGNAT IP) keep the bucket alive forever, locking every buyer on
// that address out of their renewal link indefinitely.
export async function recordRenewLinkAttempt(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, RENEW_LINK_ATTEMPTS_KEY(ipHash))
}

// --- Promo redemption (/api/redeem) -----------------------------------------

// One grant per (code, email) pair, EVER — no TTL, or an expired trial could
// be re-redeemed every 30 days forever. A new season's offer is a new code
// string in PROMO_CODES, which is a fresh sentinel keyspace by construction.
export async function hasPromoRedemption(
  env: Env,
  code: string,
  email: string,
): Promise<boolean> {
  return (await env.GUIDE_BUYERS.get(PROMO_REDEEMED_KEY(code, email))) !== null
}

export async function markPromoRedemption(
  env: Env,
  code: string,
  email: string,
): Promise<void> {
  await env.GUIDE_BUYERS.put(PROMO_REDEEMED_KEY(code, email), '1')
}

// Redemption sends a real email per call, so it takes the same two-bucket
// shape as /resend: per email (protects one inbox from being spammed with
// someone else's redemptions) and per hashed IP (stops one caller probing
// many addresses, and bounds code guessing — the endpoint is unauthenticated).
export async function recordRedeemAttempt(env: Env, email: string): Promise<number> {
  return incrementFixedWindow(env, REDEEM_ATTEMPTS_KEY(email))
}

export async function recordRedeemAttemptByIp(env: Env, ipHash: string): Promise<number> {
  return incrementFixedWindow(env, REDEEM_ATTEMPTS_IP_KEY(ipHash))
}
