// =============================================================================
// AIR — AirNow current air quality for the Yosemite Valley area.
//
// GET https://www.airnowapi.org/aq/observation/latLong/current/ with the same
// Yosemite Valley coordinate lib/weather.ts uses, and a 50-mile search radius
// (Yosemite has no permanent monitor of its own; the nearest reporting area
// varies, so distance is a net, not a target). The endpoint returns a JSON
// array of per-pollutant observations for whatever area answered; we keep the
// observation with the highest AQI, because the worst pollutant is the one a
// visitor plans a smoke day around, not the average of what's measured.
//
// KEEP IN SYNC with apps/guide/src/air/schema.ts — the PWA re-declares the
// response schema at its parse boundary, same convention as weather.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

const AIRNOW_URL = 'https://www.airnowapi.org/aq/observation/latLong/current/'
const AIRNOW_LAT = 37.7456
const AIRNOW_LON = -119.5936
const AIRNOW_DISTANCE_MILES = 50

export const AirRecord = z.object({
  fetchedAt: z.string(),
  observedAt: z.string().nullable(), // "YYYY-MM-DD HH:00" from DateObserved+HourObserved, park-local
  aqi: z.number().nullable(),
  pollutant: z.string().nullable(), // ParameterName of the max-AQI observation
  category: z.string().nullable(), // Category.Name
  reportingArea: z.string().nullable(),
})
export type AirRecordT = z.infer<typeof AirRecord>

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// air:v1 → AirRecordT

const AIR_KEY = 'air:v1'
const FRESH_MS = 60 * 60 * 1000

type AirNowObservation = {
  DateObserved?: string
  HourObserved?: number
  LocalTimeZone?: string
  ReportingArea?: string
  ParameterName?: string
  AQI?: number
  Category?: { Number?: number; Name?: string }
}

let warnedMissingKey = false

export async function readAirRecord(env: Env): Promise<AirRecordT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(AIR_KEY)
  if (!raw) return null
  try {
    const parsed = AirRecord.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readAirRecord: schema drift in KV', parsed.error.issues[0])
      return null
    }
    return parsed.data
  } catch (err) {
    console.error('readAirRecord: corrupt KV record', err)
    return null
  }
}

// Highest-AQI observation wins. Defensive against a malformed body: skip any
// entry whose AQI isn't a finite non-negative number, or whose Category is
// missing.
function pickWorstObservation(body: unknown): AirNowObservation | null {
  if (!Array.isArray(body)) return null
  let worst: AirNowObservation | null = null
  for (const raw of body as AirNowObservation[]) {
    const aqi = raw?.AQI
    if (typeof aqi !== 'number' || !Number.isFinite(aqi) || aqi < 0) continue
    if (!raw.Category || typeof raw.Category.Name !== 'string') continue
    if (!worst || aqi > (worst.AQI as number)) worst = raw
  }
  return worst
}

function observedAtFrom(obs: AirNowObservation): string | null {
  if (typeof obs.DateObserved !== 'string' || typeof obs.HourObserved !== 'number') return null
  const hour = String(obs.HourObserved).padStart(2, '0')
  return `${obs.DateObserved} ${hour}:00`
}

async function fetchAirNow(env: Env): Promise<AirRecordT | null> {
  const params = new URLSearchParams({
    format: 'application/json',
    latitude: String(AIRNOW_LAT),
    longitude: String(AIRNOW_LON),
    distance: String(AIRNOW_DISTANCE_MILES),
    API_KEY: env.AIRNOW_API_KEY ?? '',
  })
  const res = await fetch(`${AIRNOW_URL}?${params}`)
  if (!res.ok) throw new Error(`AirNow API ${res.status}`)
  const body = (await res.json()) as unknown
  const worst = pickWorstObservation(body)
  if (!worst) throw new Error('AirNow response had no usable observation')

  return {
    fetchedAt: new Date().toISOString(),
    observedAt: observedAtFrom(worst),
    aqi: worst.AQI ?? null,
    pollutant: typeof worst.ParameterName === 'string' ? worst.ParameterName : null,
    category: worst.Category?.Name ?? null,
    reportingArea: typeof worst.ReportingArea === 'string' ? worst.ReportingArea : null,
  }
}

/**
 * Refresh the air record. Stale-on-failure like lib/weather.ts: a dead
 * AirNow API keeps the previous record; null only when nothing could be
 * fetched AND nothing was cached. A missing AIRNOW_API_KEY never throws —
 * same graceful posture as NPS_API_KEY in the programs feature — it logs
 * once and serves the previous record (or null), so the route falls back to
 * nulls and the PWA renders nothing rather than an error.
 */
export async function refreshAir(env: Env): Promise<AirRecordT | null> {
  const previous = await readAirRecord(env)
  if (!env.AIRNOW_API_KEY) {
    if (!warnedMissingKey) {
      console.error('refreshAir: AIRNOW_API_KEY unset, skipping refresh')
      warnedMissingKey = true
    }
    return previous
  }
  try {
    const record = await fetchAirNow(env)
    if (!record) return previous
    await env.GUIDE_PROGRAMS.put(AIR_KEY, JSON.stringify(record))
    return record
  } catch (err) {
    console.error('refreshAir: refresh failed, serving stale if any', err)
    return previous
  }
}

export async function getAir(env: Env): Promise<AirRecordT | null> {
  const cached = await readAirRecord(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) {
    return cached
  }
  return refreshAir(env)
}
