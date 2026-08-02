// =============================================================================
// Guard: every prepackaged plan in the Field Guide produces a day a real
// visitor could actually run.
//
// The presets in src/content/itineraries.ts are lists of ids. What a buyer
// sees is what routes/Trip.tsx seeds from that list and trip/slotting.ts then
// puts on a clock, and nothing in between checks the result. Module-load
// validation confirms the ids resolve and sit in the day's regions; it cannot
// tell that "Lunch at Curry Village" landed at 5 p.m., that "Sentinel Bridge,
// the last hour" landed at 10:39 a.m., or that the capacity filter quietly
// dropped Wapama Falls from the Hetch Hetchy day. All three shipped.
//
// So this runs the real thing: it mirrors seedItinerary's capacity filter,
// calls the real slotDay, and asserts the output. It imports the app's own
// modules rather than re-deriving them, because a second copy of the slotting
// rules would drift from the first and this guard would then be certifying
// its own arithmetic.
//
// Two passes per day. The plain pass is the preset alone. The programs pass
// injects fixed blocks where the preset asks for ranger programs, because
// that is what broke: a program is an immovable block, every floating item
// after it shifts by the block plus a fresh travel buffer, and the shifts
// compound down the day. Anchored stops have to survive that.
//
// Dates span the year so the sunset anchor is exercised against a 4:50 p.m.
// December sunset and an 8:20 p.m. June one.
//
// Run: npm --prefix apps/guide run check:itineraries
//      (wired into `npm --prefix scripts run check`)
// =============================================================================

import { getHikeById, getStopById } from '../src/content'
import { BACKUP_PLANS, ITINERARIES, ITINERARY_KEYS, resolvePlanEntry } from '../src/content/itineraries'
import type { ItineraryDay } from '../src/content/itineraries'
import { sunTimes } from '../src/sun/solar'
import { slotDay, type SlottedItem } from '../src/trip/slotting'
import type { TripItemT } from '../src/trip/schema'

// Mirrors DAY_CAPACITY_MIN in routes/Trip.tsx. Kept in sync by the assertion
// below that nothing a preset lists is ever dropped: if the two drift, a
// preset starts losing entries and this fails.
const DAY_CAPACITY_MIN = 13 * 60
const DAY_END = 21 * 60

// Solstices and equinoxes: the extremes of the sunset anchor plus two
// middles, which is the whole range a preset can be seeded into.
//
// `strict` marks the dates on which a preset must place every single entry.
// Those are the shoulder-season and summer days, and the standard a preset is
// held to: it is an evergreen list, so it has to work on an ordinary
// twelve-hour day. Midwinter is exempt from that one rule and only that one —
// a December day has three and a half fewer hours of light, so an eight-stop
// valley plan legitimately runs out of day, and the trip review already shows
// the remainder as overflow for the buyer to drop or drag. What is never
// exempt, on any date, is an anchored stop: lunch and the sunset are the
// scaffolding, and losing one is the bug this file exists to catch.
const DATES: Array<{ date: string; strict: boolean }> = [
  { date: '2027-01-12', strict: false },
  { date: '2027-03-20', strict: true },
  { date: '2027-06-21', strict: true },
  { date: '2027-09-22', strict: true },
  { date: '2027-12-21', strict: false },
]

// A meal on the board has to read as a meal. The plain window is generous
// already; the programs pass allows more, because a park program published
// at 12:30 legitimately pushes lunch and the honest answer is a late lunch,
// not a lunch that never happened.
const MEAL_WINDOW = { start: 11 * 60, end: 14 * 60 }
const MEAL_WINDOW_WITH_PROGRAMS = { start: 11 * 60, end: 15 * 60 }
// An evening stop is one whose value is the last light or the meal on the
// way out. Before mid-afternoon it is simply the wrong stop.
const EVENING_EARLIEST = 15 * 60

const errors: string[] = []
let daysChecked = 0
let assertions = 0

function fmt(min: number | null): string {
  if (min === null) return 'unplaced'
  const h = Math.floor(min / 60)
  const m = min % 60
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

function titleOf(item: TripItemT): string {
  if (item.type === 'stop') return getStopById(item.stopId)?.title ?? item.stopId
  if (item.type === 'hike') return getHikeById(item.hikeId)?.title ?? item.hikeId
  if (item.type === 'program') return item.snapshot.title
  return 'custom'
}

/** Seed a preset day exactly as routes/Trip.tsx does: same order, same
 *  capacity budget, same lodging/parking skip. Returns the seeded items plus
 *  whatever the capacity filter refused, which is itself a finding. */
function seedDay(day: ItineraryDay, date: string): { items: TripItemT[]; dropped: string[] } {
  const ids: string[] = day.plan ?? []
  const items: TripItemT[] = []
  const dropped: string[] = []
  let budget = 0
  for (const id of ids) {
    const entry = resolvePlanEntry(id)
    if (!entry) continue
    if (entry.kind === 'hike') {
      const cost = entry.hike.durationMin + 30
      if (budget + cost > DAY_CAPACITY_MIN) {
        dropped.push(entry.hike.title)
        continue
      }
      budget += cost
      items.push({ id: `seed-${id}`, type: 'hike', hikeId: entry.hike.id, day: date, addedAt: '' } as TripItemT)
      continue
    }
    const { stop } = entry
    if (stop.kind === 'lodging' || stop.kind === 'parking') continue
    const cost = (stop.timeBudgetMin ?? 60) + 30
    if (budget + cost > DAY_CAPACITY_MIN) {
      dropped.push(stop.title)
      continue
    }
    budget += cost
    items.push({ id: `seed-${id}`, type: 'stop', stopId: stop.id, day: date, addedAt: '' } as TripItemT)
  }
  return { items, dropped }
}

/** Two plausible free drop-in programs for a day that asks for them: a
 *  mid-morning walk and an early-afternoon talk, which is the shape the NPS
 *  actually publishes and the shape that produced the 5 p.m. lunch. They meet
 *  at the day's own first stop, because seedPrograms.ts only ever picks
 *  events near the day's regions and a Valley coordinate dropped onto a
 *  Tuolumne day would invent two hours of driving that could never happen. */
function stressPrograms(date: string, near: [number, number] | undefined): TripItemT[] {
  const coord = near ?? [-119.5859, 37.7488] // Valley Welcome Center
  return [
    {
      id: 'stress-walk',
      type: 'program',
      addedAt: '',
      snapshot: {
        id: 'stress-walk',
        title: 'Ranger walk (synthetic)',
        date,
        timeStart: '09:00',
        timeEnd: '10:30',
        coord,
        category: 'walk',
        source: 'nps',
      },
    },
    {
      id: 'stress-talk',
      type: 'program',
      addedAt: '',
      snapshot: {
        id: 'stress-talk',
        title: 'Afternoon talk (synthetic)',
        date,
        timeStart: '12:30',
        timeEnd: '13:30',
        coord,
        category: 'talk',
        source: 'nps',
      },
    },
  ] as unknown as TripItemT[]
}

function check(
  label: string,
  slotted: SlottedItem[],
  date: string,
  withPrograms: boolean,
  strict: boolean,
) {
  const sunsetMin = sunTimes(date)?.sunsetMin ?? 19 * 60
  const mealWindow = withPrograms ? MEAL_WINDOW_WITH_PROGRAMS : MEAL_WINDOW

  for (const s of slotted) {
    if (s.item.type === 'program') continue
    const title = titleOf(s.item)
    const stopRec = s.item.type === 'stop' ? getStopById(s.item.stopId) : undefined
    assertions++

    if (s.startMin === null) {
      // An anchored stop must survive on every date, under any pressure.
      if (stopRec?.dayPart) {
        errors.push(
          `${label}: anchored stop "${title}" (dayPart '${stopRec.dayPart}') was pushed off the day.`,
        )
      } else if (strict && !withPrograms) {
        // Everything else has to fit on an ordinary twelve-hour day with no
        // programs; that is the preset's own promise. Programs sit outside
        // seedItinerary's capacity budget by design ("programs are anchors,
        // not the plan"), so a full day plus two ranger programs can
        // genuinely run out of hours, and TripReview shows the remainder as
        // overflow.
        errors.push(`${label}: "${title}" has no time — it does not fit the day.`)
      }
      continue
    }
    if (s.startMin + s.durationMin > DAY_END) {
      errors.push(`${label}: "${title}" runs past 9 p.m. (${fmt(s.startMin)} for ${s.durationMin} min).`)
    }

    const stop = stopRec
    if (!stop) continue

    if (stop.dayPart === 'midday') {
      if (s.startMin < mealWindow.start || s.startMin > mealWindow.end) {
        errors.push(
          `${label}: "${title}" is anchored to midday but starts at ${fmt(s.startMin)}.`,
        )
      }
    } else if (stop.dayPart === 'sunset') {
      // The whole claim of these stops is that you are there for the light.
      if (s.startMin + s.durationMin < sunsetMin) {
        errors.push(
          `${label}: "${title}" ends at ${fmt(s.startMin + s.durationMin)}, before sunset (${fmt(sunsetMin)}).`,
        )
      }
    } else if (stop.dayPart === 'evening') {
      if (s.startMin < EVENING_EARLIEST) {
        errors.push(`${label}: "${title}" is an evening stop but starts at ${fmt(s.startMin)}.`)
      }
    } else if (stop.kind === 'meal') {
      // A meal with no dayPart is content that forgot to declare itself; the
      // Tuolumne grill sat at 6:54 p.m. this way.
      if (s.startMin < MEAL_WINDOW.start || s.startMin > MEAL_WINDOW.end) {
        errors.push(
          `${label}: meal "${title}" starts at ${fmt(s.startMin)} and declares no dayPart. ` +
            `Give it dayPart 'midday' or 'evening' in stops.ts, or move it in the plan.`,
        )
      }
    }
  }
}

function runDay(label: string, day: ItineraryDay, date: string, strict: boolean) {
  daysChecked++

  if (!day.plan) {
    errors.push(
      `${label}: no curated \`plan\`. The region reading order is not a day plan — ` +
        `it drops the marquee stops to the capacity filter. Curate the day.`,
    )
    return
  }

  const { items, dropped } = seedDay(day, date)
  for (const title of dropped) {
    errors.push(
      `${label}: "${title}" is listed in the plan but dropped by the day capacity filter. ` +
        `Shorten the day or remove the entry — a listed stop the buyer never gets is worse than one that was never promised.`,
    )
  }
  if (items.length === 0) {
    errors.push(`${label}: seeds nothing.`)
    return
  }

  check(label, slotDay(date, items), date, false, strict)

  if (day.programCategories?.length) {
    // Meet in the middle of the day's own route. seedPrograms.ts only picks
    // events within 10 miles of a stop in the day's regions, so pinning the
    // synthetic ones at the first entry would put a Tuolumne day's noon talk
    // 40 miles from its lunch and invent a two-hour drive the real seeder
    // could never produce.
    const coords = items
      .map((i) => (i.type === 'stop' ? getStopById(i.stopId)?.coord : undefined))
      .filter((c): c is [number, number] => !!c)
    const near = coords[Math.floor(coords.length / 2)]
    const withPrograms = [...items, ...stressPrograms(date, near)]
    check(`${label} [+2 ranger programs]`, slotDay(date, withPrograms), date, true, strict)
  }
}

for (const { date, strict } of DATES) {
  for (const key of ITINERARY_KEYS) {
    const itinerary = ITINERARIES[key]
    itinerary.days.forEach((day, i) => {
      runDay(`${key} day ${i + 1} (${date})`, day, date, strict)
    })
  }
  // Backup plans are hand-swapped, not seeded, so they get no capacity filter
  // and no programs — but a rain day that puts lunch at 4 p.m. is the same bug.
  for (const plan of BACKUP_PLANS) {
    const items = plan.stops.map(
      (id) => ({ id: `bk-${id}`, type: 'stop', stopId: id, day: date, addedAt: '' }) as TripItemT,
    )
    check(`backup "${plan.title}" (${date})`, slotDay(date, items), date, false, strict)
    daysChecked++
  }
}

if (errors.length) {
  console.error(`\ncheck-itineraries: ${errors.length} problem(s) across ${daysChecked} seeded days\n`)
  for (const e of errors) console.error(`  - ${e}`)
  console.error('')
  process.exit(1)
}

console.log(
  `check-itineraries: OK — ${daysChecked} seeded days, ${assertions} placements checked across ${DATES.length} dates.`,
)
