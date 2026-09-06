// =============================================================================
// The campsite availability sweep, run every five minutes from the scheduled
// handler in index.ts (cron */5 * * * *).
//
// A watch (lib/kv.ts WatchRecord) is a buyer asking to be told the moment a
// campground shows an open site on their nights. Each run: list the watches,
// fetch every recreation.gov (campground, month) grid at least one of them
// needs (lib/recreationGov.ts), evaluate each watch against its grids
// (lib/availabilityMatch.ts), and alert on a TRANSITION — a night that is open
// now and was not open at the last check. Persistence never re-alerts, and a
// ten-minute backstop absorbs the cart-release flapping recreation.gov shows
// in the minutes after a release. A night the buyer was not told about (the
// backstop, the run cap, no device to send to) stays out of `lastOpen`, so
// the next run that can tell them does.
//
// Deliberately NOT morning-gated, unlike pushSweep.ts. This is the app's
// third notice class and the one exception to that rule: a site released at
// 7:00 a.m. Pacific is gone by 7:02, the final cancellation wave lands at any
// hour, and the buyer asked for exactly this when they set the watch (the
// form says so; deleting the watch is the off switch). Push goes to every
// device registered to the sub with Urgency high and a one-hour TTL, because
// an opening delivered later than that is a site somebody else has; email
// goes to the buyer's address when the sub is one.
//
// Two things this sweep is careful about. Cost: only months with a live watch
// are fetched, an idle run is one KV list, the device index is built lazily
// on the first alert, and a watch record is rewritten only when its state
// changed, so the steady state writes nothing. Courtesy: grids are fetched
// one at a time with a second between them (two concurrent requests drew a
// 429 on 2026-09-06; one at a time did not), and an unhealthy answer from
// recreation.gov (403, 429, 5xx, timeout) backs the whole sweep off, 5 → 60
// minutes or whatever Retry-After asks, with the watches carrying the reason
// so the buyer sees it.
//
// Known and accepted: pushPending:<hash> is one slot with an hour of TTL. If
// this sweep and the 15:00 UTC morning nudge queue a notice for the same
// device within the same hour, the later write wins and the earlier push
// shows the generic fallback. KV is also eventually consistent: a watch
// deleted seconds before a run can be alerted once more, and a new one can
// take a minute to appear in the list.
// =============================================================================

import type { Env } from '../env'
import { CAMPGROUND_BY_ID, bookUrl, type Campground } from '../data/campgrounds'
import {
  formatNights,
  matchWatch,
  monthsOf,
  watchDates,
  type MatchResult,
} from './availabilityMatch'
import { sendAvailabilityAlert } from './email'
import {
  deletePushSubscription,
  deleteWatch,
  getBuyer,
  hasPushNotice,
  listAllWatches,
  markPushNotice,
  putPushPending,
  putWatch,
  sha256Hex,
  type PushSubscriptionRecord,
  type WatchRecord,
} from './kv'
import { parkClock, parkToday } from './parkTime'
import { isPushConfigured, sendPush } from './push'
import {
  clearBackoff,
  fetchMonth,
  isUpstreamUnhealthy,
  readBackoff,
  readMonth,
  writeBackoff,
  writeMonth,
  type MonthAvailabilityT,
} from './recreationGov'

// Grids per run: at 500 KB each this bounds both the subrequests and the CPU
// a single invocation spends parsing. Forty is two dozen watches on
// different campground-months, well past real use; the overflow waits.
const MAX_PAIRS_PER_RUN = 40
// Between grid fetches. recreation.gov rate-limits a burst from one address;
// forty pairs at this gap is under a minute of a cron invocation's budget.
const FETCH_GAP_MS = 1000
// Runaway guard, same reasoning as the other sweeps: a run that wants to
// alert fifty watches is a bug or an outage, and the rest can wait five minutes.
const MAX_NOTIFIES_PER_RUN = 50
// After an alert, a watch stays quiet this long even for new nights: a site
// that goes Available / Reserved / Available as carts expire would otherwise
// buzz three times for one opening.
const NOTIFY_BACKSTOP_MS = 10 * 60_000
const PUSH_TTL_SECONDS = 60 * 60
const WATCH_SENTINEL_TTL_SECONDS = 60 * 60
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type BuyerStatus =
  | { kind: 'operator' }                    // no buyer record: the owner testing the app
  | { kind: 'refunded' }                    // never contacted again
  | { kind: 'buyer'; active: boolean }      // active = expiresAt still ahead

type Device = { hash: string; record: PushSubscriptionRecord }

type LiveWatch = {
  record: WatchRecord
  target: Campground
  dates: string[]     // the nights still ahead
  months: string[]    // the YYYY-MM grids those nights need
}

export type SweepOptions = {
  now?: Date            // the e2e harness moves the clock
  maxPairs?: number     // and lowers the cap
  fetchGapMs?: number   // and skips the courtesy gap
}

const pairKey = (rgId: number, month: string) => `${rgId}:${month}`

// The fields the sweep may change; a record whose state is unchanged is not
// rewritten, which is what keeps an idle watch from costing 288 writes a day.
function stateOf(record: WatchRecord): string {
  return JSON.stringify([
    record.lastOpen ?? [],
    record.lastError ?? null,
    record.lastNotifiedAt ?? null,
    record.notifyCount ?? 0,
  ])
}

export async function sweepAvailability(env: Env, opts: SweepOptions = {}): Promise<void> {
  const now = opts.now ?? new Date()
  const maxPairs = opts.maxPairs ?? MAX_PAIRS_PER_RUN
  const fetchGapMs = opts.fetchGapMs ?? FETCH_GAP_MS
  const nowMs = now.getTime()
  const nowSeconds = Math.floor(nowMs / 1000)
  const today = parkToday(now)

  // 1. The live watches. Expiry is decided here as well as by KV (whose
  //    expiration is "at least"), and a watch whose every night has passed
  //    or whose campground left the registry is finished.
  const live: LiveWatch[] = []
  for (const record of await listAllWatches(env)) {
    const target = CAMPGROUND_BY_ID.get(record.targetId)
    const dates = watchDates(record.start, record.nights).filter((d) => d >= today)
    if (!target) {
      console.error('sweepAvailability: watch on a campground missing from the registry', {
        id: record.id,
        targetId: record.targetId,
      })
    }
    if (!target || record.expiresAt <= nowSeconds || dates.length === 0) {
      await deleteWatch(env, record.sub, record.id)
      continue
    }
    live.push({ record, target, dates, months: monthsOf(dates) })
  }
  if (live.length === 0) return
  // Soonest first: if the pair cap bites, the nearest trips keep their checks.
  live.sort((a, b) => a.dates[0].localeCompare(b.dates[0]))

  // 2. Backing off? Nothing can change without fresh data, and the watches
  //    were stamped with the reason when the backoff was written.
  const backoff = await readBackoff(env)
  if (backoff && Date.parse(backoff.until) > nowMs) return

  // 3. The grids to fetch: one per (campground, month), in the order the
  //    watches need them.
  const pairs: Array<{ key: string; rgId: number; month: string }> = []
  const seen = new Set<string>()
  for (const w of live) {
    for (const month of w.months) {
      const key = pairKey(w.target.rgId, month)
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push({ key, rgId: w.target.rgId, month })
    }
  }
  if (pairs.length > maxPairs) {
    console.error(
      `sweepAvailability: ${pairs.length} campground-months wanted, capped at ${maxPairs}; the latest windows wait for the next run`,
    )
    pairs.length = maxPairs
  }

  // 4. Fetch, one grid at a time with a gap. A fresh grid is written through
  //    to KV; a failed one falls back to the stale copy, which may be null.
  //    The first unhealthy answer ends the fetching: the rest would only
  //    repeat it, and recreation.gov is not ours to hammer.
  const grids = new Map<string, MonthAvailabilityT | null>()
  let unhealthy: { status: number; retryAfterSeconds?: number } | null = null
  for (const [index, pair] of pairs.entries()) {
    if (unhealthy) {
      grids.set(pair.key, await readMonth(env, pair.rgId, pair.month))
      continue
    }
    if (index > 0 && fetchGapMs > 0) await new Promise((r) => setTimeout(r, fetchGapMs))
    try {
      const result = await fetchMonth(pair.rgId, pair.month, now)
      if (result.ok) {
        await writeMonth(env, pair.rgId, pair.month, result.month)
        grids.set(pair.key, result.month)
        continue
      }
      if (isUpstreamUnhealthy(result.status)) {
        unhealthy = { status: result.status, retryAfterSeconds: result.retryAfterSeconds }
      } else {
        console.error('sweepAvailability: recreation.gov refused a campground-month', {
          rgId: pair.rgId,
          month: pair.month,
          status: result.status,
          detail: result.detail,
        })
      }
    } catch (err) {
      console.error('sweepAvailability: fetch threw', { pair: pair.key, err: String(err) })
    }
    grids.set(pair.key, await readMonth(env, pair.rgId, pair.month))
  }

  // 5. Backoff bookkeeping.
  let upstreamNote: string | null = null
  if (unhealthy) {
    const { status, retryAfterSeconds } = unhealthy
    const next = await writeBackoff(env, backoff, status, now, retryAfterSeconds)
    const answered = status === 0 ? 'did not answer' : `answered ${status}`
    upstreamNote = `recreation.gov ${answered}; the guide tries again after ${parkClock(next.until)}`
    console.error(
      `sweepAvailability: recreation.gov ${answered}; backing off until ${next.until} (failure ${next.failures})`,
    )
  } else if (backoff) {
    await clearBackoff(env)
  }

  // 6. Evaluate every watch against what we have.
  const statusCache = new Map<string, BuyerStatus>()
  async function buyerStatus(sub: string): Promise<BuyerStatus> {
    const cached = statusCache.get(sub)
    if (cached) return cached
    const buyer = await getBuyer(env, sub)
    const value: BuyerStatus = !buyer
      ? { kind: 'operator' }
      : buyer.refundedAt != null
        ? { kind: 'refunded' }
        : { kind: 'buyer', active: buyer.expiresAt > nowSeconds }
    statusCache.set(sub, value)
    return value
  }
  // Built on the first alert, never on an idle run.
  let devices: Map<string, Device[]> | null = null
  let notified = 0

  for (const w of live) {
    const { record } = w
    const before = stateOf(record)

    const months: MonthAvailabilityT[] = []
    let missing = false
    for (const month of w.months) {
      const grid = grids.get(pairKey(w.target.rgId, month))
      if (!grid) {
        missing = true
        break
      }
      months.push(grid)
    }
    if (missing) {
      // Unchecked, not closed: the reason travels to the detail page.
      record.lastError =
        upstreamNote ?? 'No availability data for these nights yet; the guide keeps trying'
      if (stateOf(record) !== before) await putWatch(env, record)
      continue
    }

    const result = matchWatch(
      { model: w.target.model, dates: w.dates, mode: record.mode, party: record.party },
      months,
    )
    const known = new Set(record.lastOpen ?? [])
    const fresh = result.dates.filter((d) => !known.has(d))
    const lastNotifiedMs = record.lastNotifiedAt
      ? Date.parse(record.lastNotifiedAt)
      : Number.NEGATIVE_INFINITY
    const inBackstop = nowMs - lastNotifiedMs < NOTIFY_BACKSTOP_MS

    let delivered = 0
    if (fresh.length > 0 && !inBackstop && notified < MAX_NOTIFIES_PER_RUN) {
      const status = await buyerStatus(record.sub)
      if (status.kind === 'refunded' || (status.kind === 'buyer' && !status.active)) {
        // Never alerted, and there is no future in which they would be.
        await deleteWatch(env, record.sub, record.id)
        continue
      }
      devices ??= await loadDevices(env)
      delivered = await notify(env, w, result, status, devices)
      if (delivered > 0) {
        record.lastNotifiedAt = now.toISOString()
        record.notifyCount = (record.notifyCount ?? 0) + 1
        notified++
      }
    }

    // A fresh night nobody was told about stays out of lastOpen so the next
    // run that can tell them (past the backstop, under the cap, with a
    // device to send to) fires for it.
    record.lastOpen =
      fresh.length > 0 && delivered === 0 ? result.dates.filter((d) => known.has(d)) : result.dates
    // A stale grid answered this run; the buyer should know the check is old.
    if (upstreamNote) record.lastError = upstreamNote
    else delete record.lastError
    if (stateOf(record) !== before) await putWatch(env, record)
  }

  console.log(
    `sweepAvailability: ${pairs.length} campground-month(s), ${live.length} watch(es), ${notified} notified`,
  )
}

/** Push to every device of the sub, then email. Returns how many deliveries
 *  went out (or were already recorded as sent for this exact set of nights). */
async function notify(
  env: Env,
  w: LiveWatch,
  result: MatchResult,
  status: BuyerStatus,
  devices: Map<string, Device[]>,
): Promise<number> {
  const { record, target } = w
  const label = formatNights(result.dates)
  let delivered = 0

  if (record.channels.push && isPushConfigured(env)) {
    // The stage carries the set of open nights: the same set re-opening
    // after a gap is a new opening (the short sentinel TTL in kv.ts agrees).
    const fingerprint = (await sha256Hex(result.dates.join(','))).slice(0, 12)
    const stage = `watch-${record.id}-${fingerprint}`
    for (const device of devices.get(record.sub.toLowerCase()) ?? []) {
      if (await hasPushNotice(env, device.hash, stage)) {
        delivered++
        continue
      }
      // Queue the content BEFORE the push (the pushSweep rule): the service
      // worker asks for it the moment it wakes.
      await putPushPending(env, device.hash, {
        title: `${target.name}: a site opened`,
        body: `${label} · book on recreation.gov before it goes`,
        // An in-app path, never the booking site: sw.js refuses anything
        // else, and the detail page carries the outbound button.
        url: `/watch/${record.id}`,
        tag: `watch-${record.id}`,
      })
      const sent = await sendPush(env, device.record.endpoint, {
        ttlSeconds: PUSH_TTL_SECONDS,
        urgency: 'high',
      })
      if (sent.ok) {
        await markPushNotice(env, device.hash, stage, WATCH_SENTINEL_TTL_SECONDS)
        delivered++
        continue
      }
      if (sent.gone) {
        await deletePushSubscription(env, device.hash)
        continue
      }
      console.error('sweepAvailability: push failed', {
        endpointHash: device.hash.slice(0, 8),
        status: sent.status,
        detail: sent.detail,
      })
    }
  }

  // Email needs an address and a buyer behind it: an operator's sub is a
  // username, and a username is not somewhere to send mail.
  if (record.channels.email && status.kind === 'buyer' && EMAIL_RE.test(record.sub)) {
    try {
      await sendAvailabilityAlert(env, {
        to: record.sub,
        campground: target.name,
        mode: record.mode,
        dates: result.dates,
        openings: result.openings,
        bookUrl: bookUrl(target),
        watchUrl: `${env.APP_BASE_URL}/watch/${record.id}`,
      })
      delivered++
    } catch (err) {
      console.error('sweepAvailability: email failed', { id: record.id, err: String(err) })
    }
  }

  return delivered
}

// Every registered device, grouped by owner. One scan per run, and only on a
// run that has something to send.
async function loadDevices(env: Env): Promise<Map<string, Device[]>> {
  const map = new Map<string, Device[]>()
  let cursor: string | undefined
  do {
    const page = await env.GUIDE_BUYERS.list({ prefix: 'push:', cursor })
    for (const key of page.keys) {
      const raw = await env.GUIDE_BUYERS.get(key.name)
      if (!raw) continue
      let record: PushSubscriptionRecord
      try {
        record = JSON.parse(raw) as PushSubscriptionRecord
      } catch {
        continue
      }
      if (typeof record?.sub !== 'string' || typeof record.endpoint !== 'string') continue
      const sub = record.sub.toLowerCase()
      const list = map.get(sub) ?? []
      list.push({ hash: key.name.slice('push:'.length), record })
      map.set(sub, list)
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  return map
}
