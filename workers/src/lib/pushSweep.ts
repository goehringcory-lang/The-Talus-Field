// =============================================================================
// Daily push sweep, run from the scheduled handler in index.ts on its own
// morning cron (0 15 * * * — 7-8am Pacific year round), separate from the
// overnight data-refresh cron so a buzz can never land at 3am.
//
// Four notices from THIS sweep, each something a buyer would want their
// phone to interrupt them for. The bar is deliberately high: this app's
// audience installed a field guide, not a marketing channel, and the fastest
// way to lose a notification permission forever is to spend it on something
// the person did not ask about. The app's fifth and last notice, a campsite
// opening for a watch the buyer created, lives in availabilitySweep.ts on its
// own five-minute cron and is deliberately NOT morning-gated: a site released
// at 7:00 a.m. Pacific is gone by 7:02, a cancellation lands at any hour, and
// the buyer asked for exactly that when they set the watch.
//
//   1. Trip morning — on each day of the buyer's trip window, once, in the
//      morning. The one notification a park visitor actually benefits from:
//      it opens straight to /today, which is the day's schedule, conditions,
//      and the drive to the next thing.
//   2. Renewal — at 14 and 1 days from expiry, mirroring the email stages so
//      the two never disagree. No 60-day push: two months out is an email's
//      business, not a phone buzz.
//   3. Road change (September 2026) — a watched road (lib/roads.ts) changed
//      state on two consecutive nightly refreshes, and the buyer's trip window
//      covers some of the next 14 days. A closure the reader is about to drive
//      into clears the bar on its own; a road nobody on the device is going
//      near does not, which is what the 14-day window is for. Opens /today,
//      whose roads line shows the current reading.
//   4. Deadline (September 2026) — the morning before a dated deadline from
//      scripts/data/deadlines.json (a lottery window, a campground release)
//      that the buyer opted into from the trip board. Only ids the device
//      registered are ever sent, so this one is asked for twice: once by
//      turning notifications on, once per deadline. Opens /trip.
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
import { deadlinesDueOn } from './deadlines'
import { parkNow } from './parkTime'
import { isPushConfigured, sendPush } from './push'
import { readRoadChanges, type RoadChange, type RoadState } from './roads'

// The cron runs daily. Whatever hour it is set to, "morning" notices should
// only go out in the park's morning — a 3 a.m. buzz would be indefensible.
// Checked against Pacific time, since that is where the reader is.
const MORNING_START_HOUR = 6
const MORNING_END_HOUR = 11

// Runaway guard, same reasoning as the renewal sweep: at normal volume a day
// sends a handful, so hitting this cap means something is wrong and the
// remainder can wait for tomorrow.
const MAX_SENDS_PER_RUN = 200

// A road change is pushed to buyers whose trip window touches the next
// ROAD_WINDOW_DAYS. It is also only pushed while it is news: a change
// confirmed more than ROAD_FRESH_MS ago has been on the roads line for days,
// and a phone that was off all week should not wake to it.
const ROAD_WINDOW_DAYS = 14
const ROAD_FRESH_MS = 2 * 24 * 60 * 60 * 1000

const ROAD_STATE_WORDS: Record<RoadState, string> = {
  open: 'open',
  closed: 'closed',
  chains: 'under chain controls',
  unknown: 'no longer named in the park alerts',
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// "Tue, Jun 14" for the deadline body, from a YYYY-MM-DD date.
function shortDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
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
  roadChanges: RoadChange[],
  nowMs: number,
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
  // trip morning opens an app whose every API call now rejects them. The road
  // and deadline notices share the gate: both are about the trip.
  const tripEligible =
    status.kind === 'operator' || (status.kind === 'buyer' && status.daysToExpiry > 0)
  const hasWindow = !!record.tripStart && !!record.tripEnd

  // Road change, ahead of the trip-day nudge: a closure on the way in is the
  // more urgent of the two, and the day nudge falls through tomorrow.
  if (tripEligible && hasWindow) {
    const windowEnd = addDays(today, ROAD_WINDOW_DAYS)
    const coversSoon = record.tripStart! <= windowEnd && record.tripEnd! >= today
    if (coversSoon) {
      for (const change of roadChanges) {
        if (nowMs - Date.parse(change.confirmedAt) > ROAD_FRESH_MS) continue
        candidates.push({
          // Road plus the confirmation day: one notice per change per device,
          // and a road that flips twice in a season is two notices.
          stage: `road-${change.roadId}-${change.confirmedAt.slice(0, 10)}`,
          title: `${change.label}: ${change.to === 'unknown' ? 'alert lifted' : ROAD_STATE_WORDS[change.to]}`,
          body:
            change.to === 'unknown'
              ? `The park alert that had ${change.label} ${ROAD_STATE_WORDS[change.from]} is gone. Check the roads line before you drive.`
              : `${change.label} is now ${ROAD_STATE_WORDS[change.to]}, was ${ROAD_STATE_WORDS[change.from]}.${change.headline ? ` NPS: ${change.headline}` : ''}`,
          url: '/today',
          tag: `road-${change.roadId}`,
        })
      }
    }
  }

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

  // Deadline reminders: the morning BEFORE the date, because the moments that
  // matter here open at midnight and 7 a.m. Pacific and this sweep lands at
  // 7 or 8. Only ids the device opted into on the trip board.
  if (tripEligible && hasWindow && record.deadlines && record.deadlines.length > 0) {
    const tomorrow = addDays(today, 1)
    for (const due of deadlinesDueOn(record.tripStart!, record.tripEnd!, record.deadlines, tomorrow)) {
      candidates.push({
        // Id plus date: the Half Dome daily lottery recurs for every trip day
        // and each one is its own reminder.
        stage: `deadline-${due.id}-${due.date}`,
        title: `Tomorrow: ${due.title}`,
        body: `${shortDate(due.date)}, ${due.time} Pacific. ${due.detail}`,
        url: '/trip',
        tag: `deadline-${due.id}`,
      })
    }
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

  // Read once per run; the same list serves every device.
  const roadChanges = await readRoadChanges(env)

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
      const candidates = noticesFor(
        record,
        today,
        await buyerStatus(record.sub),
        roadChanges,
        now.getTime(),
      )
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
