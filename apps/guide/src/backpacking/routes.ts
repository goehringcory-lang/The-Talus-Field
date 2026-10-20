// =============================================================================
// The backpacking routes file: schema mirror, loader, and the geometry the map
// and the trip page share.
//
// public/map/backpacking-<hash>.json is written by
// scripts/gen-backpacking-routes.ts (kept in sync with this schema by hand,
// the tracks policy). It is content-hashed and lives with the map's other data
// files, so the service worker serves it cache-first from the tile cache and
// the map overview pack carries it offline. Everything a reader reads about a
// trip (names, rules, prose) is in content/backpacking.ts; this file is only
// what was measured: the line, the profile, the day splits, and where along
// the line each camp and water source is reached.
// =============================================================================

import { z } from 'zod'
import { BACKPACKING_URL, ROUTE_SUMMARY, type RouteSummary } from '../map/backpacking.generated'
import { decodePolyline } from '../map/roadGraph'

const Verdict = z.enum(['match', 'approx'])

const RouteDay = z.object({
  startMi: z.number(),
  endMi: z.number(),
  mi: z.number(),
  gainFt: z.number(),
  lossFt: z.number(),
})

export const BackpackRoute = z.object({
  route: z.enum(['out-and-back', 'loop', 'lollipop', 'one-way']),
  source: z.string(),
  verified: z.object({ distance: Verdict, gain: Verdict }),
  line: z.string(), // encoded polyline of the whole walked route, start to finish
  profile: z.array(z.tuple([z.number(), z.number()])).min(2), // [mi, ft]
  stats: z.object({
    mi: z.number(),
    gainFt: z.number(),
    lossFt: z.number(),
    minFt: z.number(),
    maxFt: z.number(),
    highPointMi: z.number(),
    maxGradePct: z.number(),
  }),
  days: z.array(RouteDay).min(1),
  markers: z.record(z.string(), z.object({ mi: z.number(), offM: z.number() })),
  sideTrips: z.record(
    z.string(),
    z.object({ line: z.string(), mi: z.number(), gainFt: z.number(), maxFt: z.number() }),
  ),
  note: z.string().optional(),
})
export type BackpackRouteT = z.infer<typeof BackpackRoute>

const RoutesFile = z.object({
  v: z.literal(1),
  licence: z.string(),
  trips: z.record(z.string(), BackpackRoute),
})

export { ROUTE_SUMMARY }
export type { RouteSummary }

export function hasRoute(tripId: string): boolean {
  return Object.hasOwn(ROUTE_SUMMARY, tripId)
}

let filePromise: Promise<Record<string, BackpackRouteT>> | null = null

/** Every route, fetched once (cache-first in the SW; the map overview pack keeps it offline). */
export function loadRoutes(): Promise<Record<string, BackpackRouteT>> {
  filePromise ??= fetch(BACKPACKING_URL, { signal: AbortSignal.timeout(15_000) })
    .then((res) => {
      const type = res.headers.get('content-type')
      // The SPA fallback answers a missing file with HTML and a 200.
      if (!res.ok || (type && type.includes('text/html'))) throw new Error('backpacking routes unavailable')
      return res.json()
    })
    .catch(async (err) => {
      // The SW may not control the page yet (first load) while the overview
      // pack is already downloaded: ask the Cache API before giving up.
      if (typeof caches === 'undefined') throw err
      const hit = await caches.match(BACKPACKING_URL)
      if (!hit) throw err
      return hit.json()
    })
    .then((raw) => RoutesFile.parse(raw).trips)
    .catch((err) => {
      filePromise = null
      throw err
    })
  return filePromise
}

// --- geometry ----------------------------------------------------------------

type Pt = [number, number]
const M_PER_MI = 1609.344

function havMi(a: Pt, b: Pt): number {
  const r = (d: number) => (d * Math.PI) / 180
  const h =
    Math.sin(r(b[1] - a[1]) / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(r(b[0] - a[0]) / 2) ** 2
  return (2 * 6371000 * Math.asin(Math.sqrt(h))) / M_PER_MI
}

export type DecodedRoute = { line: Pt[]; cumMi: number[] }

const decoded = new Map<string, DecodedRoute>()

/** The walked line with its cumulative miles, decoded once per trip. */
export function decodeRoute(tripId: string, route: BackpackRouteT): DecodedRoute {
  const hit = decoded.get(tripId)
  if (hit) return hit
  const line = decodePolyline(route.line)
  const cumMi = [0]
  for (let i = 1; i < line.length; i++) cumMi.push(cumMi[i - 1] + havMi(line[i - 1], line[i]))
  // The simplified line runs a touch shorter than the measured one; scale so
  // the generator's mile marks land where it measured them.
  const scale = cumMi.at(-1)! > 0 ? route.stats.mi / cumMi.at(-1)! : 1
  const out = { line, cumMi: cumMi.map((m) => m * scale) }
  decoded.set(tripId, out)
  return out
}

/** The part of the line between two mile marks, interpolated at both ends. */
export function sliceByMiles({ line, cumMi }: DecodedRoute, fromMi: number, toMi: number): Pt[] {
  const at = (mi: number): Pt => {
    let i = 1
    while (i < cumMi.length - 1 && cumMi[i] < mi) i++
    const t = cumMi[i] > cumMi[i - 1] ? Math.min(1, Math.max(0, (mi - cumMi[i - 1]) / (cumMi[i] - cumMi[i - 1]))) : 0
    return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t]
  }
  const out: Pt[] = [at(fromMi)]
  for (let i = 0; i < line.length; i++) if (cumMi[i] > fromMi && cumMi[i] < toMi) out.push(line[i])
  out.push(at(toMi))
  return out
}

/** The point at a mile mark. */
export function pointAtMile(route: DecodedRoute, mi: number): Pt {
  return sliceByMiles(route, mi, mi)[0]
}

/** The profile's points between two mile marks, for a day's own chart. */
export function profileSlice(profile: [number, number][], fromMi: number, toMi: number): [number, number][] {
  return profile.filter(([mi]) => mi >= fromMi - 0.01 && mi <= toMi + 0.01)
}

/** "Mile 6.4" style mark, or the trailhead and the end by name. */
export function mileLabel(mi: number): string {
  return `mi ${mi.toFixed(1)}`
}
