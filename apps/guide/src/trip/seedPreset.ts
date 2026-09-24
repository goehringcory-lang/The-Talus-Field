// =============================================================================
// Seeding a preset day onto a date: the one implementation routes/Trip.tsx
// and scripts/check-itineraries.ts both run, so the check certifies the code
// the buyer actually gets rather than a second copy of it (the check used to
// mirror this loop by hand).
//
// Three filters, in order, each reported rather than silent:
//   1. Behind a closed road. An entry past Tioga Road's or Glacier Point
//      Road's winter gate is left off when the road reading for that date says
//      closed (typically, or live for today). A date inside an opening or
//      closing window is 'unsettled' and still seeds; the board flags it.
//   2. Closed for the season. A stop whose own season chip starts "Closed"
//      (the Tuolumne grill after September 20, 2026) is not seeded: the chip
//      is the guide telling the reader it is shut, and the planner has no
//      business scheduling lunch there.
//   3. The day's capacity (08:00 to 21:00 with travel buffers). Lodging and
//      parking entries are navigation aids, never seeded.
// =============================================================================

import { getStopsByRegion } from '../content'
import { resolvePlanEntry, type ItineraryDay } from '../content/itineraries'
import type { SeasonalRoadId } from '../content/roads'
import { roadForHike, roadForStopId } from '../content/roads'
import type { RoadReading } from '../alerts/roadState'

export const DAY_CAPACITY_MIN = 13 * 60
const SEED_BUFFER_MIN = 30

export type SeededEntry = { kind: 'stop' | 'hike'; id: string; title: string }

export type SeedDayResult = {
  seeded: SeededEntry[]
  // Left off because the road reading for the date said closed.
  roadClosed: Array<SeededEntry & { road: SeasonalRoadId; reading: RoadReading }>
  // Left off because the stop's own season chip says it is closed.
  seasonClosed: SeededEntry[]
  // Listed in the plan but past the day's capacity.
  overCapacity: SeededEntry[]
}

export function seedPresetDay(
  day: ItineraryDay,
  date: string,
  readRoad: (road: SeasonalRoadId, dateIso: string) => RoadReading,
): SeedDayResult {
  const result: SeedDayResult = { seeded: [], roadClosed: [], seasonClosed: [], overCapacity: [] }
  // A curated day is the recommended sequence in drive order, stops and hikes
  // interleaved; a day without one falls back to the full region reading
  // sequence, which makes a poor plan (see itineraries.ts).
  const candidates: string[] = day.plan
    ? day.plan
    : day.regions.flatMap((region) => getStopsByRegion(region).map((s) => s.id))
  let budget = 0
  for (const id of candidates) {
    const entry = resolvePlanEntry(id)
    if (!entry) continue
    let seeded: SeededEntry
    let cost: number
    let road: SeasonalRoadId | null
    if (entry.kind === 'hike') {
      seeded = { kind: 'hike', id: entry.hike.id, title: entry.hike.title }
      cost = entry.hike.durationMin + SEED_BUFFER_MIN
      road = roadForHike(entry.hike)
    } else {
      const { stop } = entry
      // Lodging is not a day activity, and parking pins are navigation aids
      // for another stop, not stops of their own.
      if (stop.kind === 'lodging' || stop.kind === 'parking') continue
      seeded = { kind: 'stop', id: stop.id, title: stop.title }
      if (stop.season && /^closed\b/i.test(stop.season)) {
        result.seasonClosed.push(seeded)
        continue
      }
      cost = (stop.timeBudgetMin ?? 60) + SEED_BUFFER_MIN
      road = roadForStopId(stop.id)
    }
    if (road) {
      const reading = readRoad(road, date)
      if (reading.state === 'closed') {
        result.roadClosed.push({ ...seeded, road, reading })
        continue
      }
    }
    if (budget + cost > DAY_CAPACITY_MIN) {
      result.overCapacity.push(seeded)
      continue
    }
    budget += cost
    result.seeded.push(seeded)
  }
  return result
}

/** One sentence per day that lost entries to a road or a season, for the
 *  note under the presets. `dayLabel` is how the page names the date. */
export function seedDayNote(result: SeedDayResult, dayLabel: string): string | null {
  const parts: string[] = []
  const byRoad = new Map<SeasonalRoadId, typeof result.roadClosed>()
  for (const r of result.roadClosed) {
    const list = byRoad.get(r.road) ?? []
    list.push(r)
    byRoad.set(r.road, list)
  }
  for (const list of byRoad.values()) {
    const titles = list.map((r) => r.title)
    const everything = result.seeded.length === 0 && result.seasonClosed.length === 0
    parts.push(
      `${list[0].reading.sentence} ${
        everything ? `${dayLabel} stayed empty` : `${joinTitles(titles)} stayed off ${dayLabel}`
      }.`,
    )
  }
  if (result.seasonClosed.length > 0) {
    const titles = result.seasonClosed.map((s) => s.title)
    parts.push(`${joinTitles(titles)} ${titles.length === 1 ? 'is' : 'are'} closed for the season and stayed off ${dayLabel}; pack a lunch.`)
  }
  return parts.length > 0 ? parts.join(' ') : null
}

function joinTitles(titles: string[]): string {
  if (titles.length <= 1) return titles[0] ?? ''
  if (titles.length === 2) return `${titles[0]} and ${titles[1]}`
  return `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`
}
