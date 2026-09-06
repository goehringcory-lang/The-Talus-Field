// =============================================================================
// PARKING — live lot status from the NPS API `parkinglots` endpoint.
//
// GET https://developer.nps.gov/api/v1/parkinglots?parkCode=yose&limit=50
// Same key and header convention as lib/nps.ts and lib/alerts.ts. Twelve
// Yosemite lots, each with a published capacity and a `liveStatus` object
// (`occupancy`, an estimated wait, a free-text description) that the park's
// traffic team fills in on busy days and leaves blank the rest of the year.
//
// The whole point of this module is to map that object honestly. A blank
// `occupancy` is not "open": it is a lot nobody has said anything about today,
// so it serves as 'unknown' and every consumer hides it. Only a word the feed
// actually carries becomes a status, and the raw word rides along as
// `statusText` so a client can show its work.
//
// Cached in GUIDE_PROGRAMS KV like lib/waits.ts (short TTL, refreshed on
// demand, stale-on-failure). Staleness past an hour is the CLIENT's call, on
// `fetchedAt`, same as the waits feed. Never an error: a dead feed serves
// { fetchedAt: null, lots: [] }.
//
// KEEP IN SYNC with apps/guide/src/parking/schema.ts, the PWA's hand mirror
// of the response shape.
// =============================================================================

import type { Env } from '../env'

const NPS_PARKING_URL = 'https://developer.nps.gov/api/v1/parkinglots'
const PARKING_KEY = 'parking:v1'
const FRESH_MS = 5 * 60 * 1000

// developer.nps.gov serves a shared DEMO_KEY with a low hourly quota. It is
// enough for one Worker refreshing every five minutes on demand, but it is a
// fallback, not a configuration: set NPS_API_KEY (the same key the programs
// and alerts feeds use) before relying on this in season.
const FALLBACK_KEY = 'DEMO_KEY'

export type LotStatus = 'open' | 'full' | 'closed' | 'unknown'

export type ParkingLot = {
  id: string
  name: string
  capacity: number | null
  ada: number | null
  status: LotStatus
  statusText: string | null
  updatedAt: string | null
  lat: number | null
  lng: number | null
}

export type ParkingRecord = {
  fetchedAt: string // ISO
  lots: ParkingLot[]
}

// The subset of the NPS record we read. Loosely typed on purpose: the API is
// a government CMS and numbers arrive as numbers, strings, or empty strings.
type NpsLot = {
  id?: string
  name?: string
  altName?: string
  latitude?: number | string
  longitude?: number | string
  accessibility?: {
    totalSpaces?: number | string
    numberofAdaSpaces?: number | string
  }
  liveStatus?: {
    isActive?: boolean | string
    occupancy?: string
    estimatedWaitTimeInMinutes?: number | string | null
    description?: string
    expirationDate?: string
  }
}

function num(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

// A capacity of 0 is the CMS default for "not entered", not an empty lot.
function count(value: unknown): number | null {
  const n = num(value)
  return n === null || n <= 0 ? null : Math.round(n)
}

// The occupancy vocabulary the park has used: Light / Moderate / Heavy for a
// lot with room, Full when it is not, Closed when it is gated. Anything else
// (including the empty string, which is most lots most days) is 'unknown'.
// Closed wins over full wins over open, so a description reading "lot full,
// closed to entry" resolves to the stronger word.
export function mapLotStatus(live: NpsLot['liveStatus'] | undefined): {
  status: LotStatus
  statusText: string | null
} {
  if (!live) return { status: 'unknown', statusText: null }
  const active = live.isActive
  if (active === false || active === 'false') return { status: 'unknown', statusText: null }
  const occupancy = (live.occupancy ?? '').trim()
  const description = (live.description ?? '').trim()
  const text = `${occupancy} ${description}`.trim()
  if (text === '') return { status: 'unknown', statusText: null }
  const statusText = occupancy || description
  if (/\bclosed\b/i.test(text)) return { status: 'closed', statusText }
  if (/\bfull\b/i.test(text)) return { status: 'full', statusText }
  if (/\b(light|moderate|heavy|open|available|spaces?)\b/i.test(text)) {
    return { status: 'open', statusText }
  }
  // A word we do not recognise is carried as text but never as a status: a
  // consumer that hides 'unknown' would rather miss a reading than invent one.
  return { status: 'unknown', statusText }
}

function normalize(raw: NpsLot[], fetchedAt: string): ParkingLot[] {
  const out: ParkingLot[] = []
  for (const lot of raw) {
    if (!lot.id || !lot.name) continue
    const { status, statusText } = mapLotStatus(lot.liveStatus)
    out.push({
      id: lot.id,
      name: lot.name.trim(),
      capacity: count(lot.accessibility?.totalSpaces),
      ada: count(lot.accessibility?.numberofAdaSpaces),
      status,
      statusText,
      // The feed carries no per-lot timestamp, only an optional expiry for the
      // live word. The honest stamp for a known status is therefore the fetch
      // that observed it; an unknown status has no moment to stamp.
      updatedAt: status === 'unknown' ? null : fetchedAt,
      lat: num(lot.latitude),
      lng: num(lot.longitude),
    })
  }
  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

async function readCached(env: Env): Promise<ParkingRecord | null> {
  const raw = await env.GUIDE_PROGRAMS.get(PARKING_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ParkingRecord
  } catch {
    return null
  }
}

async function fetchNpsLots(env: Env): Promise<NpsLot[]> {
  const params = new URLSearchParams({ parkCode: 'yose', limit: '50' })
  const res = await fetch(`${NPS_PARKING_URL}?${params}`, {
    headers: { 'X-Api-Key': env.NPS_API_KEY || FALLBACK_KEY, accept: 'application/json' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`NPS parkinglots API ${res.status}`)
  const body = (await res.json()) as { data?: NpsLot[] }
  return body.data ?? []
}

export async function getParking(env: Env): Promise<ParkingRecord | null> {
  const cached = await readCached(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) {
    return cached
  }
  try {
    const raw = await fetchNpsLots(env)
    if (raw.length === 0) throw new Error('NPS parkinglots returned no lots')
    const fetchedAt = new Date().toISOString()
    const record: ParkingRecord = { fetchedAt, lots: normalize(raw, fetchedAt) }
    await env.GUIDE_PROGRAMS.put(PARKING_KEY, JSON.stringify(record))
    return record
  } catch (err) {
    // Stale-on-failure, same policy as the waits and weather caches.
    console.error('getParking: refresh failed, serving stale if any', err)
    return cached
  }
}
