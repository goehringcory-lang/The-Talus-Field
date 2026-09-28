// =============================================================================
// Seeding a whole preset onto the plan's dates: the one loop the trip board
// (routes/Trip.tsx) and the map's Itineraries pane (routes/Map.tsx) both run,
// so a preset added from either place lands the same entries on the same days
// and says the same thing about what it left off. Per-day filtering (closed
// roads, closed-for-the-season stops, capacity) is trip/seedPreset.ts.
// =============================================================================

import { ITINERARIES, type ItineraryKey } from '../content/itineraries'
import type { SeasonalRoadId } from '../content/roads'
import type { RoadReading } from '../alerts/roadState'
import type { ProgramEventT } from '../programs/schema'
import { pickProgramsForDay } from './seedPrograms'
import { seedDayNote, seedPresetDay } from './seedPreset'

// "Jan 13" for a note naming a board day.
export function shortDay(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function daysInWindow(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const stop = Date.parse(`${end}T00:00:00Z`)
  while (d.getTime() <= stop && out.length < 32) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

export type SeedItineraryDeps = {
  windowDays: string[]
  // The program listings for the trip window, so a preset day that names
  // program categories can seed the real events running that date. Still
  // loading, offline with no cache, or nothing running seeds the stops alone.
  programEvents: ProgramEventT[]
  readRoad: (road: SeasonalRoadId, dateIso: string) => RoadReading
  addStop: (stopId: string, day?: string) => void
  addHike: (hikeId: string, day?: string) => void
  addProgram: (ev: ProgramEventT) => void
}

/** Seed `key` onto the plan's days; returns the note for what it left off, or null. */
export function seedItinerary(key: ItineraryKey, deps: SeedItineraryDeps): string | null {
  const { windowDays } = deps
  // Preset days beyond the picked window are not seeded. Collapsing them
  // onto the last date used to grant each its own capacity budget and
  // produce a single impossible day. Say so when it happens — a silent
  // truncation reads as the plan being smaller than advertised.
  const totalDays = ITINERARIES[key].days.length
  const notes: string[] = []
  if (totalDays > windowDays.length) {
    notes.push(
      `Your dates hold ${windowDays.length} ${windowDays.length === 1 ? 'day' : 'days'}, so the first ${
        windowDays.length === 1 ? 'day' : `${windowDays.length} days`
      } of this ${totalDays}-day plan went on the board. Extend the dates for the rest.`,
    )
  }
  const days = ITINERARIES[key].days.slice(0, windowDays.length)
  days.forEach((day, i) => {
    const date = windowDays[i]
    const result = seedPresetDay(day, date, deps.readRoad)
    for (const entry of result.seeded) {
      if (entry.kind === 'hike') deps.addHike(entry.id, date)
      else deps.addStop(entry.id, date)
    }
    // A day the season emptied says so in words, and a closed road is
    // never reported as a capacity problem.
    const note = seedDayNote(result, `day ${i + 1} (${shortDay(date)})`)
    if (note) notes.push(note)
    // Program picks keep their published times and slot around the stops,
    // so they sit outside the capacity budget. addProgram snapshots the
    // event into the plan, same as adding it from /programs by hand.
    for (const ev of pickProgramsForDay(deps.programEvents, date, day.programCategories ?? [], day.regions)) {
      deps.addProgram(ev)
    }
  })
  return notes.length > 0 ? notes.join(' ') : null
}
