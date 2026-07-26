// =============================================================================
// seedPrograms — resolve an itinerary day's programCategories against the
// live program listings when a preset is seeded onto the trip board.
//
// The presets are evergreen (content/itineraries.ts) but programs are dated,
// so the join happens here, at seed time. Three deliberate constraints:
//
// - Free drop-in events only. Auto-adding a paid or reservation-required
//   event would put a commitment on the board the buyer never made; those
//   stay on /programs where the booking link is one tap away.
// - Region-matched. ProgramEvent carries no region field, so an event is
//   assigned the region of the nearest stop to its coordinate (the manual
//   curation reuses stop coords for its meeting points, so this is a near
//   join, not a guess). An event with no coordinate, or nowhere near the
//   guide's geography, is never seeded onto a day it might not belong to.
// - At most two per day, non-overlapping. The preset lists categories in
//   priority order; each resolves to its earliest event that doesn't
//   collide with one already picked. Programs are anchors, not the plan.
//
// No matching event simply seeds nothing: a preset works offline and out of
// season exactly as before, and the /programs page remains the full listing.
// =============================================================================

import { stops } from '../content'
import type { Region } from '../content'
import type { ProgramCategoryT, ProgramEventT } from '../programs/schema'
import { haversineMiles } from '../utils/geo'

const MAX_PROGRAMS_PER_DAY = 2

// Beyond this, the event is somewhere the guide doesn't cover (or the coord
// is wrong); either way it has no business on a seeded day.
const MAX_ASSIGN_MILES = 10

/** The region of the nearest stop, or null when the event can't be placed. */
export function regionForEvent(ev: ProgramEventT): Region | null {
  if (!ev.coord) return null
  let best: { region: Region; miles: number } | null = null
  for (const stop of stops) {
    if (!stop.coord) continue
    const miles = haversineMiles(ev.coord, stop.coord)
    if (!best || miles < best.miles) best = { region: stop.region, miles }
  }
  return best && best.miles <= MAX_ASSIGN_MILES ? best.region : null
}

// Untimed listings (exhibits, availability markers) can't anchor a day, and
// events missing an end are assumed to run an hour, the typical program slot.
function eventEnd(ev: ProgramEventT): string {
  if (ev.timeEnd) return ev.timeEnd
  const [h, m] = ev.timeStart!.split(':').map(Number)
  return `${String(Math.min(23, h + 1)).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function overlaps(a: ProgramEventT, b: ProgramEventT): boolean {
  return a.timeStart! < eventEnd(b) && b.timeStart! < eventEnd(a)
}

/**
 * The programs to seed for one itinerary day: for each category, in the
 * preset's priority order, the earliest free drop-in event on `date` in one
 * of the day's regions that doesn't overlap an earlier pick.
 */
export function pickProgramsForDay(
  events: ProgramEventT[],
  date: string,
  categories: ProgramCategoryT[],
  regions: Region[],
): ProgramEventT[] {
  if (categories.length === 0 || events.length === 0) return []
  const picked: ProgramEventT[] = []
  for (const category of categories) {
    if (picked.length >= MAX_PROGRAMS_PER_DAY) break
    const candidates = events
      .filter(
        (ev) =>
          ev.date === date &&
          ev.category === category &&
          ev.timeStart &&
          ev.isFree !== false &&
          !ev.reservationRequired,
      )
      .filter((ev) => {
        const region = regionForEvent(ev)
        return region !== null && regions.includes(region)
      })
      .sort((a, b) => a.timeStart!.localeCompare(b.timeStart!))
    const pick = candidates.find((ev) => !picked.some((p) => overlaps(p, ev)))
    if (pick) picked.push(pick)
  }
  return picked
}
