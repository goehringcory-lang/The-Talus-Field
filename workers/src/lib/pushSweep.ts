// =============================================================================
// Daily push sweep, run from the scheduled handler in index.ts on its own
// morning cron (0 15 * * * — 7-8am Pacific year round), separate from the
// overnight data-refresh cron so a buzz can never land at 3am.
//
// Two notices, both things a buyer would want their phone to interrupt them
// for, and nothing else. The bar is deliberately high: this app's audience
// installed a field guide, not a marketing channel, and the fastest way to
// lose a notification permission forever is to spend it on something the
// person did not ask about.
//
//   1. Trip morning — on each day of the buyer's trip window, once, in the
//      morning. The one notification a park visitor actually benefits from:
//      it opens straight to /today, which is the day's schedule, conditions,
//      and the drive to the next thing.
//   2. Renewal — at 14 and 1 days from expiry, mirroring the email stages so
//      the two never disagree. No 60-day push: two months out is an email's
//      business, not a phone buzz.
//
// Same self-healing shape as sweepRenewals: stages fire on thresholds rather
// than exact days, so a missed cron run catches up tomorrow, and each
// (device, stage) is deduped by a KV sentinel. A failed send is NOT marked, so
// the next run retries. A push service reporting the subscription gone (404 /
// 410) deletes the record — that is the normal end of a device's life here.
// =============================================================================

import type { Env } from '../env'
import {
  deletePushSubscription,
  getBuyer,
  hasPushNotice,
  markPushNotice,
  putPushPending,
  type PushSubscriptionRecord,
} from './kv'
import { isPushConfigured, sendPush } from './push'

// The cron runs daily. Whatever hour it is set to, "morning" notices should
// only go out in the park's morning — a 3 a.m. buzz would be indefensible.
// Checked against Pacific time, since that is where the reader is.
const MORNING_START_HOUR = 6
const MORNING_END_HOUR = 11

// Runaway guard, same reasoning as the renewal sweep: at normal volume a day
// sends a handful, so hitting this cap means something is wrong and the
// remainder can wait for tomorrow.
const MAX_SENDS_PER_RUN = 200

function parkNow(at: Date): { date: string; hour: number } {
  // en-CA gives YYYY-MM-DD; the park is America/Los_Angeles year round.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    // Intl can render midnight as "24" in some engines; normalize it.
    hour: Number.parseInt(get('hour'), 10) % 24,
  }
}

// A device's owner, as the sweep needs to see them: an operator session (no
// buyer record), a refunded buyer (never nudged), or a buyer with a signed
// number of days until expiry (negative = lapsed).
type BuyerStatus =
  | { kind: 'operator' }
  | { kind: 'refunded' }
  | { kind: 'buyer'; daysToExpiry: number }

type Notice = {
  stage: string
  title: string
  body: string
  url: string
  tag: string
}

/** What this device could be told today, most urgent first. The sweep sends
 *  the FIRST candidate whose (device, stage) sentinel is unclaimed — returning
 *  a list instead of a single winner matters on a trip that overlaps the
 *  renewal window: once renew-t14 has been sent, its dedupe must fall through
 *  to the morning nudge, not silence the device for the remaining 13 days. */
function noticesFor(
  record: PushSubscriptionRecord,
  today: string,
  status: BuyerStatus,
): Notice[] {
  const candidates: Notice[] = []
  const daysToExpiry = status.kind === 'buyer' ? status.daysToExpiry : null

  // Renewal first: access ending is the only thing more urgent than the day.
  if (daysToExpiry !== null && daysToExpiry > 0) {
    if (daysToExpiry <= 1) {
      candidates.push({
        stage: 'renew-t1',
        title: 'Your guide access ends tomorrow',
        body: 'Renew to keep your trip plan, saved stops, and offline maps.',
        url: '/account',
        tag: 'renew',
      })
    } else if (daysToExpiry <= 14) {
      candidates.push({
        stage: 'renew-t14',
        title: 'Your guide access ends in two weeks',
        body: 'Renew any time from your account page.',
        url: '/account',
        tag: 'renew',
      })
    }
  }

  // The trip-day nudge goes to operators (no buyer record: the owner testing
  // the app) and active buyers only. A refunded or lapsed buyer's push record
  // outlives their access by up to a year (its KV TTL), and buzzing them each
  // trip morning opens an app whose every API call now rejects them.
  const tripEligible =
    status.kind === 'operator' || (status.kind === 'buyer' && status.daysToExpiry > 0)
  if (
    tripEligible &&
    record.tripStart &&
    record.tripEnd &&
    record.tripStart <= today &&
    today <= record.tripEnd
  ) {
    candidates.push({
      // Date in the stage so each trip day fires once, and a repeat visit
      // next season is not deduped against this one.
      stage: `trip-${today}`,
      title: 'Your day in the park',
      body: "Today's schedule, the forecast, and the drive to your first stop.",
      url: '/today',
      tag: 'trip-day',
    })
  }

  return candidates
}

export async function sweepPush(env: Env): Promise<void> {
  if (!isPushConfigured(env)) return

  const now = new Date()
  const { date: today, hour } = parkNow(now)
  // The whole sweep is morning-gated, renewal notices included: every notice
  // here is a phone buzz, and a 3 a.m. buzz is indefensible no matter how
  // urgent the renewal. The cron schedule ([triggers] in wrangler.toml) aims
  // a run into this window; the gate is what keeps a mis-set or extra cron
  // from paging sleeping buyers.
  const isMorning = hour >= MORNING_START_HOUR && hour < MORNING_END_HOUR
  if (!isMorning) {
    console.log(`sweepPush: ${hour}:00 park time is outside the morning window; skipping`)
    return
  }
  const nowSeconds = Math.floor(now.getTime() / 1000)

  // Buyer lookups repeat across a person's devices; one cache per run keeps a
  // two-device household from doubling the KV reads.
  const statusCache = new Map<string, BuyerStatus>()
  async function buyerStatus(sub: string): Promise<BuyerStatus> {
    const cached = statusCache.get(sub)
    if (cached) return cached
    const buyer = await getBuyer(env, sub)
    // No buyer record is an operator session; a refunded buyer is not
    // invited back. noticesFor decides per notice what each kind may get.
    const value: BuyerStatus = !buyer
      ? { kind: 'operator' }
      : buyer.refundedAt != null
        ? { kind: 'refunded' }
        : { kind: 'buyer', daysToExpiry: (buyer.expiresAt - nowSeconds) / 86400 }
    statusCache.set(sub, value)
    return value
  }

  let sent = 0
  let cursor: string | undefined

  do {
    const page = await env.GUIDE_BUYERS.list({ prefix: 'push:', cursor })

    for (const key of page.keys) {
      if (sent >= MAX_SENDS_PER_RUN) {
        console.error(`sweepPush: hit ${MAX_SENDS_PER_RUN}-send cap; remainder sends tomorrow`)
        return
      }

      const raw = await env.GUIDE_BUYERS.get(key.name)
      if (!raw) continue
      let record: PushSubscriptionRecord
      try {
        record = JSON.parse(raw) as PushSubscriptionRecord
      } catch {
        console.error('sweepPush: corrupt push record', { key: key.name })
        continue
      }

      const endpointHash = key.name.slice('push:'.length)
      const candidates = noticesFor(record, today, await buyerStatus(record.sub))
      // First candidate not yet sent wins; at most one buzz per device per day.
      let notice: Notice | null = null
      for (const candidate of candidates) {
        if (!(await hasPushNotice(env, endpointHash, candidate.stage))) {
          notice = candidate
          break
        }
      }
      if (!notice) continue

      // Queue the content BEFORE the push: the service worker wakes and asks
      // for it immediately, and a push that lands ahead of its own notice
      // shows the generic fallback for no reason.
      await putPushPending(env, endpointHash, {
        title: notice.title,
        body: notice.body,
        url: notice.url,
        tag: notice.tag,
      })

      const result = await sendPush(env, record.endpoint)
      if (result.ok) {
        await markPushNotice(env, endpointHash, notice.stage)
        sent++
        continue
      }
      if (result.gone) {
        // The device is gone for good (uninstalled, permission revoked,
        // browser data cleared). Drop it rather than retrying forever.
        await deletePushSubscription(env, endpointHash)
        continue
      }
      // Transient: unmarked, so tomorrow's run retries.
      console.error('sweepPush: send failed', {
        endpointHash: endpointHash.slice(0, 8),
        status: result.status,
        detail: result.detail,
      })
    }

    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  if (sent > 0) console.log(`sweepPush: sent ${sent} notification(s)`)
}
