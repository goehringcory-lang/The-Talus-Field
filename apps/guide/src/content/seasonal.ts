// =============================================================================
// SEASONAL ALMANAC — the date-sensitive layer of the guide.
//
// Two kinds of entry, distinguished by `confidence`:
//   'confirmed' — a published date or an astronomical fact (full moons).
//   'typical'   — a recurring pattern (road opening windows, waterfall peak,
//                 the Horsetail Fall window). Labeled as such everywhere it
//                 renders; the description says "typically" in words.
//
// This file is bundled with the app, so the /programs agenda keeps a floor of
// content with no network and no cache: the almanac is part of the download.
// One-day entries (dateEnd === dateStart) merge into the agenda as ordinary
// rows; range entries render as "in season" window cards. Either converts to
// a ProgramEvent ('seasonal' source) via seasonalToProgramEvent when merged
// or added to a trip, and rides the existing snapshot + ICS export path.
//
// Range helpers take the same [start, end] inclusive YYYY-MM-DD contract as
// manualProgramsInRange in the Worker. MAX_SPAN_DAYS does not apply here;
// the pickers clamp the window before these are called.
//
// Every 'confirmed' entry must carry a source note in a comment. Do not add
// operator events with published dates here; those belong in
// workers/src/data/manual-programs.ts.
// =============================================================================

import { ProgramEvent, type ProgramEventT } from '../programs/schema'
import { SeasonalEvents, type SeasonalEventT } from './schema'

const seed: Parameters<typeof SeasonalEvents.parse>[0] = []

export const SEASONAL_EVENTS: SeasonalEventT[] = SeasonalEvents.parse(seed).sort((a, b) =>
  a.dateStart === b.dateStart ? a.dateEnd.localeCompare(b.dateEnd) : a.dateStart.localeCompare(b.dateStart),
)

// Range windows (multi-day entries) overlapping [start, end], both inclusive.
export function seasonalWindowsInRange(start: string, end: string): SeasonalEventT[] {
  return SEASONAL_EVENTS.filter(
    (e) => e.dateEnd > e.dateStart && e.dateStart <= end && e.dateEnd >= start,
  )
}

// One-day entries (dateEnd === dateStart) falling inside [start, end].
export function seasonalDaysInRange(start: string, end: string): SeasonalEventT[] {
  return SEASONAL_EVENTS.filter(
    (e) => e.dateEnd === e.dateStart && e.dateStart >= start && e.dateStart <= end,
  )
}

function humanDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

// Convert an almanac entry to a ProgramEvent pinned to a specific day, so it
// can merge into the agenda and ride the trip snapshot + ICS path unchanged.
// For windows, `day` is the day it is pinned to (usually the first day of the
// window inside the user's dates); the description carries the full range so
// the exported calendar event is self-explanatory.
export function seasonalToProgramEvent(ev: SeasonalEventT, day: string): ProgramEventT {
  const isWindow = ev.dateEnd > ev.dateStart
  const rangeLine = isWindow
    ? `${ev.confidence === 'typical' ? 'Typical window' : 'Window'} runs ${humanDate(ev.dateStart)} to ${humanDate(ev.dateEnd)}.\n\n`
    : ''
  return ProgramEvent.parse({
    id: `seasonal:${ev.id}`,
    source: 'seasonal',
    category: ev.category,
    title: ev.confidence === 'typical' ? `${ev.title} (typical window)` : ev.title,
    description: rangeLine + ev.description,
    date: day,
    timeStart: ev.timeStart,
    location: ev.location,
    coord: ev.coord,
    url: ev.url,
    isFree: true,
  })
}
