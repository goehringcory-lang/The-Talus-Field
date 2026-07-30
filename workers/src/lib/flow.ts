// =============================================================================
// FLOW — Merced River instantaneous discharge, the honest waterfall proxy.
//
// GET https://waterservices.usgs.gov/nwis/iv/ for gauge 11264500 (Merced
// River at Happy Isles Bridge), parameter 00060 (discharge, cubic feet per
// second). Keyless. This gauge sits below Vernal and Nevada Falls, so its
// reading is the closest thing to "are the falls going" that a live feed can
// answer without guessing which specific fall a reader means.
//
// USGS uses sentinel values (e.g. -999999) for ice-affected or missing
// readings, so any non-finite or negative value maps to a null cfs rather
// than a nonsense number.
//
// The cfs -> band mapping lives in exactly one place (flowBand) so the copy
// a reader sees is never duplicated or drifted between client and server.
// Thresholds are heuristic bands for reader-facing copy, not a hydrology
// claim.
//
// KEEP IN SYNC with apps/guide/src/flow/schema.ts — the PWA re-declares the
// response schema at its parse boundary, same convention as weather.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

const USGS_URL = 'https://waterservices.usgs.gov/nwis/iv/'
const USGS_SITE = '11264500'
const USGS_PARAM = '00060'

export const FlowBand = z.enum(['roaring', 'strong', 'moderate', 'trickle', 'dry'])
export type FlowBandT = z.infer<typeof FlowBand>

export const FlowRecord = z.object({
  fetchedAt: z.string(),
  observedAt: z.string().nullable(), // dateTime of the reading, as USGS serves it
  cfs: z.number().nullable(),
  band: FlowBand.nullable(),
})
export type FlowRecordT = z.infer<typeof FlowRecord>

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// flow:v1 → FlowRecordT

const FLOW_KEY = 'flow:v1'
const FRESH_MS = 60 * 60 * 1000

/**
 * Map a discharge reading (cfs) to a reader-facing flow band. The single
 * source of truth for this copy — never duplicate these thresholds.
 */
export function flowBand(cfs: number): FlowBandT {
  if (cfs >= 1000) return 'roaring'
  if (cfs >= 300) return 'strong'
  if (cfs >= 50) return 'moderate'
  if (cfs >= 5) return 'trickle'
  return 'dry'
}

type UsgsValue = { value?: string; dateTime?: string }
type UsgsResponse = {
  value?: {
    timeSeries?: Array<{
      values?: Array<{ value?: UsgsValue[] }>
    }>
  }
}

export async function readFlowRecord(env: Env): Promise<FlowRecordT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(FLOW_KEY)
  if (!raw) return null
  try {
    const parsed = FlowRecord.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readFlowRecord: schema drift in KV', parsed.error.issues[0])
      return null
    }
    return parsed.data
  } catch (err) {
    console.error('readFlowRecord: corrupt KV record', err)
    return null
  }
}

async function fetchUsgsFlow(): Promise<FlowRecordT> {
  const params = new URLSearchParams({
    format: 'json',
    sites: USGS_SITE,
    parameterCd: USGS_PARAM,
  })
  const res = await fetch(`${USGS_URL}?${params}`)
  if (!res.ok) throw new Error(`USGS instantaneous values API ${res.status}`)
  const body = (await res.json()) as UsgsResponse

  const values = body.value?.timeSeries?.[0]?.values?.[0]?.value
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('USGS response had no values for gauge 11264500')
  }
  const latest = values[values.length - 1]

  const parsed = typeof latest.value === 'string' ? Number.parseFloat(latest.value) : NaN
  const cfs = Number.isFinite(parsed) && parsed >= 0 ? parsed : null

  return {
    fetchedAt: new Date().toISOString(),
    observedAt: typeof latest.dateTime === 'string' ? latest.dateTime : null,
    cfs,
    band: cfs === null ? null : flowBand(cfs),
  }
}

/**
 * Refresh the flow record. Stale-on-failure like lib/weather.ts: a dead
 * USGS API keeps the previous record; null only when nothing could be
 * fetched AND nothing was cached.
 */
export async function refreshFlow(env: Env): Promise<FlowRecordT | null> {
  const previous = await readFlowRecord(env)
  try {
    const record = await fetchUsgsFlow()
    await env.GUIDE_PROGRAMS.put(FLOW_KEY, JSON.stringify(record))
    return record
  } catch (err) {
    console.error('refreshFlow: refresh failed, serving stale if any', err)
    return previous
  }
}

export async function getFlow(env: Env): Promise<FlowRecordT | null> {
  const cached = await readFlowRecord(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) {
    return cached
  }
  return refreshFlow(env)
}
