// =============================================================================
// ROADS — the road-change watch (FEATURE-RESEARCH-2026-09 §2).
//
// The alerts feed (lib/alerts.ts) already tells a reader whether Tioga is
// open today. This module answers the other question: did anything CHANGE
// since yesterday, for the seven roads a Yosemite trip pivots on (Tioga,
// Glacier Point, Mariposa Grove and Hetch Hetchy roads inside the park; the
// 120, 140 and 41 approaches outside it). It runs once, right after the
// nightly refreshAlerts in the scheduled handler, and does three things on a
// confirmed change: writes it to KV, emails the operator one plain message
// (Resend, to the contact-form inbox), and leaves a change record that the
// morning push sweep (lib/pushSweep.ts) turns into a notice for buyers whose
// trip window covers the next 14 days.
//
// "Confirmed" is load-bearing. The NPS feed lags the road by hours on opening
// day and occasionally drops an alert for one fetch, and a notice that fires
// on a feed glitch costs trust the product cannot buy back. So a new reading
// is held as a CANDIDATE until the next refresh reports the same reading
// again; only then does it replace the confirmed state and act. Two nightly
// refreshes means a change is announced roughly a day late, which the copy on
// the site allows for ("the day it opens", never "the minute").
//
// The state enum is small on purpose: 'closed', 'chains', 'open', 'unknown',
// plus the raw alert headline the reading came from. 'unknown' is the honest
// value for a road with no alert (NPS removes the closure alert when a road
// opens, so silence is not a status) and a change TO unknown is reported as
// exactly that: the alert went away.
//
// Failure posture, same as every cron job here: nothing thrown out of
// watchRoads. A network or KV failure logs and leaves the snapshot alone, so
// the next night starts from where this one did.
// =============================================================================

import type { Env } from '../env'
import type { AlertItemT, AlertsRecordT } from './alerts'
import { sendRoadChangeNotice } from './email'

export type WatchedRoadId =
  | 'tioga'
  | 'glacier-point'
  | 'mariposa-grove'
  | 'hetch-hetchy'
  | 'hwy-120'
  | 'hwy-140'
  | 'hwy-41'

export type RoadState = 'open' | 'closed' | 'chains' | 'unknown'

export type RoadReading = {
  state: RoadState
  headline: string | null // the alert title the state was read from
}

export type RoadChange = {
  roadId: WatchedRoadId
  label: string
  from: RoadState
  to: RoadState
  headline: string | null
  confirmedAt: string // ISO
}

type RoadWatchRecord = {
  updatedAt: string
  confirmed: Partial<Record<WatchedRoadId, RoadReading>>
  candidate: Partial<Record<WatchedRoadId, RoadReading & { seenAt: string }>>
  changes: RoadChange[]
}

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// roads:watch:v1 → RoadWatchRecord
const WATCH_KEY = 'roads:watch:v1'

// Changes are kept for the push sweep to read. A buyer whose phone was off
// for a week should not be woken about a closure that has since lifted, so
// the sweep also applies its own recency rule (see pushSweep.ts).
const KEEP_CHANGES_MS = 7 * 24 * 60 * 60 * 1000

// Matching is per alert: the alert must name the road before any status word
// counts. The highway patterns take the in-park names too (Big Oak Flat Road
// is 120 inside the gate, El Portal Road is 140, Wawona Road is 41), because
// the park's alerts use whichever name the sign nearest the closure carries.
export const WATCHED_ROADS: Array<{ id: WatchedRoadId; label: string; re: RegExp }> = [
  { id: 'tioga', label: 'Tioga Road', re: /\btioga (road|pass)\b/i },
  { id: 'glacier-point', label: 'Glacier Point Road', re: /\bglacier point road\b/i },
  { id: 'mariposa-grove', label: 'Mariposa Grove Road', re: /\bmariposa grove road\b/i },
  { id: 'hetch-hetchy', label: 'Hetch Hetchy Road', re: /\bhetch hetchy road\b/i },
  {
    id: 'hwy-120',
    label: 'Highway 120',
    re: /\b(highway|hwy\.?|route|state route|sr-?|ca-?)\s*120\b|\bbig oak flat road\b/i,
  },
  {
    id: 'hwy-140',
    label: 'Highway 140',
    re: /\b(highway|hwy\.?|route|state route|sr-?|ca-?)\s*140\b|\bel portal road\b/i,
  },
  {
    id: 'hwy-41',
    label: 'Highway 41',
    re: /\b(highway|hwy\.?|route|state route|sr-?|ca-?)\s*41\b|\bwawona road\b/i,
  },
]

const CLOSED_RE = /\b(closed|closure|will close|remains? closed|not open)\b/i
const CHAINS_RE = /\bchains?\b[^.]*\b(required|control|carry)\b|\b(required|control|carry)\b[^.]*\bchains?\b/i
const OPEN_RE = /\b(is open|now open|has opened|reopened|open for the season)\b/i

// One reading per road from the alert set. Closed wins over chains wins over
// open: a "reopening June 1" sentence inside a closure alert must not read as
// open today, and a chain-control notice on a closed road is still a closure.
export function deriveRoadReadings(
  alerts: AlertItemT[],
): Record<WatchedRoadId, RoadReading> {
  const out = {} as Record<WatchedRoadId, RoadReading>
  for (const road of WATCHED_ROADS) {
    let reading: RoadReading = { state: 'unknown', headline: null }
    for (const alert of alerts) {
      const text = `${alert.title} ${alert.description}`
      if (!road.re.test(text)) continue
      if (CLOSED_RE.test(text)) {
        reading = { state: 'closed', headline: alert.title }
        break
      }
      if (CHAINS_RE.test(text) && reading.state !== 'chains') {
        reading = { state: 'chains', headline: alert.title }
        continue
      }
      if (OPEN_RE.test(text) && reading.state === 'unknown') {
        reading = { state: 'open', headline: alert.title }
      }
    }
    out[road.id] = reading
  }
  return out
}

async function readWatch(env: Env): Promise<RoadWatchRecord | null> {
  const raw = await env.GUIDE_PROGRAMS.get(WATCH_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<RoadWatchRecord>
    return {
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
      confirmed: parsed.confirmed ?? {},
      candidate: parsed.candidate ?? {},
      changes: Array.isArray(parsed.changes) ? parsed.changes : [],
    }
  } catch (err) {
    console.error('readRoadWatch: corrupt KV record', err)
    return null
  }
}

/** Confirmed road changes, newest first. Read by the push sweep. */
export async function readRoadChanges(env: Env): Promise<RoadChange[]> {
  const record = await readWatch(env).catch(() => null)
  if (!record) return []
  return [...record.changes].sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt))
}

/**
 * Compare tonight's readings against the confirmed snapshot. Pure: returns the
 * next snapshot and the list of changes that became confirmed on this run.
 * Exported for the shape to be testable without KV.
 */
export function advanceWatch(
  previous: RoadWatchRecord | null,
  readings: Record<WatchedRoadId, RoadReading>,
  now: Date,
): { next: RoadWatchRecord; confirmed: RoadChange[] } {
  const nowIso = now.toISOString()
  const confirmedChanges: RoadChange[] = []
  const next: RoadWatchRecord = {
    updatedAt: nowIso,
    confirmed: { ...(previous?.confirmed ?? {}) },
    candidate: { ...(previous?.candidate ?? {}) },
    changes: (previous?.changes ?? []).filter(
      (c) => now.getTime() - Date.parse(c.confirmedAt) < KEEP_CHANGES_MS,
    ),
  }

  for (const road of WATCHED_ROADS) {
    const reading = readings[road.id]
    const known = next.confirmed[road.id]

    // First sighting of a road: record it as the baseline and say nothing.
    // Announcing every road's status on the night the watch is deployed
    // would be seven emails about nothing changing.
    if (!known) {
      next.confirmed[road.id] = reading
      delete next.candidate[road.id]
      continue
    }

    if (reading.state === known.state) {
      // Back to (or still at) the confirmed reading: any candidate was a
      // one-night glitch, which is exactly what the two-reading rule is for.
      delete next.candidate[road.id]
      continue
    }

    const candidate = next.candidate[road.id]
    if (candidate && candidate.state === reading.state) {
      // Second consecutive refresh with the same new reading: confirmed.
      confirmedChanges.push({
        roadId: road.id,
        label: road.label,
        from: known.state,
        to: reading.state,
        headline: reading.headline ?? candidate.headline,
        confirmedAt: nowIso,
      })
      next.confirmed[road.id] = reading
      delete next.candidate[road.id]
    } else {
      next.candidate[road.id] = { ...reading, seenAt: nowIso }
    }
  }

  next.changes.push(...confirmedChanges)
  return { next, confirmed: confirmedChanges }
}

/**
 * Run after refreshAlerts in the nightly cron. Takes the record that refresh
 * returned so a failed refresh (which returns the stale record) advances
 * nothing: a stale alert set is by definition the same reading as last time.
 */
export async function watchRoads(env: Env, alerts: AlertsRecordT | null): Promise<void> {
  if (!alerts) return
  try {
    const previous = await readWatch(env)
    // The alerts record refreshAlerts returns on failure is the one it
    // already had. Comparing it against itself would count as a second
    // consecutive reading, so a change is only advanced on a fresh fetch.
    if (previous && Date.parse(alerts.fetchedAt) <= Date.parse(previous.updatedAt)) {
      console.log('watchRoads: alerts record is not newer than the last watch; skipping')
      return
    }
    const readings = deriveRoadReadings(alerts.alerts)
    const { next, confirmed } = advanceWatch(previous, readings, new Date())
    await env.GUIDE_PROGRAMS.put(WATCH_KEY, JSON.stringify(next))

    for (const change of confirmed) {
      // Email is best-effort and per change: one failed send must not stop
      // the others, and the change is already in KV for the push sweep.
      try {
        await sendRoadChangeNotice(env, change)
      } catch (err) {
        console.error('watchRoads: operator email failed', { road: change.roadId, err })
      }
    }
    if (confirmed.length > 0) {
      console.log(`watchRoads: confirmed ${confirmed.length} road change(s)`)
    }
  } catch (err) {
    console.error('watchRoads: failed, snapshot left as it was', err)
  }
}
