// =============================================================================
// A backpacking trip, day by day: which water each day passes and where the
// night is, from the trip's content and its measured route. Pure, so the map
// pane and the trip page cannot disagree and the tests can hold the rules.
//
// Two rules. (1) An out-and-back passes every source twice; the generator
// measures the outbound pass, and the return pass is the same distance from
// the end. (2) The dry stretch is counted between RELIABLE sources only,
// because a seasonal creek is exactly the one that is gone in September, and
// the trailhead counts as water only when the trip says one is there (a tap).
// =============================================================================

import type { BackpackCampT, BackpackTripT, BackpackWaterT } from '../content/schema'
import type { BackpackRouteT } from './routes'

export type DayEntry =
  | { kind: 'water'; mi: number; water: BackpackWaterT; returnPass: boolean }
  | { kind: 'camp'; mi: number; camp: BackpackCampT; night: number; layover: boolean }

export type PlannedDay = {
  index: number
  from: string
  to: string
  startMi: number
  endMi: number
  mi: number
  gainFt: number
  lossFt: number
  summary: string
  sideTrip?: { id: string; name: string; note: string; mi?: number; gainFt?: number }
  entries: DayEntry[]
}

/** Every pass of every source along the walked route, in mile order. */
export function waterPasses(trip: BackpackTripT, route: BackpackRouteT): { mi: number; water: BackpackWaterT; returnPass: boolean }[] {
  const total = route.stats.mi
  const out: { mi: number; water: BackpackWaterT; returnPass: boolean }[] = []
  for (const w of trip.water) {
    const m = route.markers[w.id]
    if (!m) continue
    out.push({ mi: m.mi, water: w, returnPass: false })
    // The turnaround itself is passed once.
    if (trip.route === 'out-and-back' && total - m.mi - m.mi > 0.2) out.push({ mi: total - m.mi, water: w, returnPass: true })
  }
  return out.sort((a, b) => a.mi - b.mi)
}

// Mile marks are rounded to the hundredth; a source this close to a day's end
// is the camp's water.
const EDGE_MI = 0.05

export function planDays(trip: BackpackTripT, route: BackpackRouteT): PlannedDay[] {
  const passes = waterPasses(trip, route)
  let night = 0
  return trip.days.map((d, i) => {
    const r = route.days[i]
    const last = i === trip.days.length - 1
    // A source at a day's end belongs to that evening's camp, not the next
    // morning's walk; the first day takes the trailhead, the last the end.
    const lo = i === 0 ? -Infinity : r.startMi + EDGE_MI
    const hi = last ? Infinity : r.endMi + EDGE_MI
    const entries: DayEntry[] = passes
      .filter((p) => p.mi > lo && p.mi <= hi)
      .map((p) => ({ kind: 'water' as const, ...p }))
    if (d.campId) {
      night++
      const camp = trip.camps.find((c) => c.id === d.campId)!
      entries.push({ kind: 'camp', mi: r.endMi, camp, night, layover: i > 0 && trip.days[i - 1].campId === d.campId })
    }
    const side = d.sideTripId ? trip.sideTrips?.find((s) => s.id === d.sideTripId) : undefined
    const sideRoute = d.sideTripId ? route.sideTrips[d.sideTripId] : undefined
    return {
      index: i,
      from: d.from,
      to: d.to,
      startMi: r.startMi,
      endMi: r.endMi,
      mi: r.mi,
      gainFt: r.gainFt,
      lossFt: r.lossFt,
      summary: d.summary,
      ...(side ? { sideTrip: { ...side, mi: sideRoute?.mi, gainFt: sideRoute?.gainFt } } : {}),
      entries: entries.sort((a, b) => a.mi - b.mi || (a.kind === 'camp' ? 1 : -1)),
    }
  })
}

export type DryStretch = { mi: number; fromMi: number; toMi: number; from: string; to: string }

/** The longest walk between reliable water, start and end included. */
export function longestDryStretch(trip: BackpackTripT, route: BackpackRouteT): DryStretch | null {
  const reliable = waterPasses(trip, route).filter((p) => p.water.reliability === 'reliable')
  const marks: { mi: number; name: string }[] = [
    { mi: 0, name: trip.trailhead.name },
    ...reliable.map((p) => ({ mi: p.mi, name: p.water.name })),
    { mi: route.stats.mi, name: trip.exit?.name ?? trip.trailhead.name },
  ]
  let best: DryStretch | null = null
  for (let i = 1; i < marks.length; i++) {
    const gap = marks[i].mi - marks[i - 1].mi
    if (!best || gap > best.mi) {
      best = { mi: Math.round(gap * 10) / 10, fromMi: marks[i - 1].mi, toMi: marks[i].mi, from: marks[i - 1].name, to: marks[i].name }
    }
  }
  return best
}

export const LEVEL_LABEL: Record<BackpackTripT['level'], string> = {
  'first-trip': 'First trip',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
}

export function nightsLabel(trip: Pick<BackpackTripT, 'nightsMin' | 'nightsMax'>): string {
  const n = trip.nightsMin === trip.nightsMax ? `${trip.nightsMin}` : `${trip.nightsMin}–${trip.nightsMax}`
  return `${n} ${trip.nightsMax === 1 ? 'night' : 'nights'}`
}

export const CAMP_KIND_LABEL: Record<BackpackCampT['kind'], string> = {
  designated: 'Designated camp',
  zone: 'Legal camping area',
}

export const WATER_LABEL: Record<BackpackWaterT['reliability'], string> = {
  reliable: 'Reliable',
  seasonal: 'Seasonal',
}
