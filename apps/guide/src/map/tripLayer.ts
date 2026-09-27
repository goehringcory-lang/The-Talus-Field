// =============================================================================
// The trip plan as the map draws it: per day, the stops in the order the day
// runs, the legs between them in their travel mode along real roads and
// paths, and the warnings that say where the day does not fit.
//
// It adds no trip logic of its own. Times are trip/slotting.ts's (the same
// slotting the board and /today show), leg times are driveMinutesBetween's
// (mode-aware, the drive check's figure), the late-arrival check is
// trip/driveCheck.ts, a hike's light is sun/daylight.ts. What this module adds
// is geometry: a leg routed over the road graph (map/roadGraph.ts), the
// shuttle's stops in riding order, and a straight line, flagged, when neither
// can be had. Pure given its inputs, so it is tested without a map.
// =============================================================================

import { getStopById } from '../content'
import { formatTime } from '../content/labels'
import { itemInfo, type ItemInfo } from '../trip/agendaItem'
import { dayLegs } from '../trip/driveCheck'
import { resolvePlace } from '../trip/places'
import type { TravelModeT, TripItemT, TripPlanT } from '../trip/schema'
import { shuttleLeg } from '../trip/shuttle'
import { driveMinutesBetween, itemCoord, legMode, slotPlan, type SlottedItem } from '../trip/slotting'
import { daylightFit } from '../sun/daylight'
import { sunTimes } from '../sun/solar'
import { addDaysIso, formatClock, formatDayHeader } from '../utils/date'
import type { Pt, RoadGraph } from './roadGraph'

export type TripStopKind = 'hike' | 'program' | 'parking' | 'other'

export type TripStop = {
  itemId: string
  item: TripItemT
  info: ItemInfo
  kind: TripStopKind
  /** 1-based position in the day, in the order the day runs. */
  order: number
  coord: Pt | null
  startMin: number | null
  durationMin: number
  /** "10 a.m. · 2 hr" on the pin; "2 hr" when the day could not place it. */
  pinLabel: string
  /** "10 a.m. – 12 p.m." when placed. */
  timeRange: string | null
}

/** How a leg's line was drawn. `pending` is a straight line while the road graph loads. */
export type LegGeometry = 'road' | 'shuttle' | 'straight' | 'pending'

export type TripLeg = {
  from: TripStop
  to: TripStop
  mode: TravelModeT
  /** Did the reader choose the mode, or did the guide infer it? */
  modeSet: boolean
  /** What the guide would choose on its own, for the panel's "Auto" option. */
  autoMode: TravelModeT
  minutes: number | null
  metres: number | null
  coords: Pt[]
  geometry: LegGeometry
  /** The drive check's verdict: is the gap in the day long enough for this leg? */
  fit: 'ok' | 'short' | 'overlap' | 'untimed'
  /** Shuttle legs: the stops ridden, for the card. */
  shuttle?: { board: string; alight: string; hops: number }
}

export type DayWarning = {
  kind: 'late' | 'overlap' | 'unplaced' | 'past-end' | 'dark' | 'unrouted'
  text: string
  itemId?: string
}

export type TripDay = {
  day: string
  /** 0-based index into the trip window; the colour is chosen from it. */
  index: number
  label: string
  stops: TripStop[]
  /** Items with no place on the map (a custom entry with no coordinate). */
  unmapped: TripStop[]
  legs: TripLeg[]
  warnings: DayWarning[]
}

/** When a day counts as running late: at sunset, or at a fixed clock time. */
export type DayEnd = { kind: 'sunset' } | { kind: 'fixed'; minutes: number }

/** A block the sunset rule judges: a hike, or a stop not anchored to the evening. */
function daytimeBlock(item: TripItemT): boolean {
  if (item.type === 'hike') return true
  if (item.type !== 'stop') return false
  const part = getStopById(item.stopId)?.dayPart
  return part !== 'sunset' && part !== 'evening'
}

function stopKind(item: TripItemT): TripStopKind {
  if (item.type === 'hike') return 'hike'
  if (item.type === 'program') return 'program'
  if (item.type === 'custom' && resolvePlace(item.placeId)?.kind === 'parking') return 'parking'
  return 'other'
}

function toStop(s: SlottedItem, order: number): TripStop {
  const info = itemInfo(s.item)
  const coord = itemCoord(s.item) ?? null
  const dur = formatTime(s.durationMin)
  return {
    itemId: s.item.itemId,
    item: s.item,
    info,
    kind: stopKind(s.item),
    order,
    coord,
    startMin: s.startMin,
    durationMin: s.durationMin,
    pinLabel: s.startMin === null ? dur : `${formatClock(s.startMin)} · ${dur}`,
    timeRange: s.startMin === null ? null : `${formatClock(s.startMin)} – ${formatClock(s.startMin + s.durationMin)}`,
  }
}

function routeLeg(from: Pt, to: Pt, mode: TravelModeT, graph: RoadGraph | null): Pick<TripLeg, 'coords' | 'metres' | 'geometry' | 'shuttle'> {
  const straight = { coords: [from, to], metres: null, geometry: (graph ? 'straight' : 'pending') as LegGeometry }
  if (mode === 'shuttle') {
    const ride = shuttleLeg(from, to)
    if (!ride) return { ...straight, geometry: 'straight' }
    const coords: Pt[] = [from]
    let metres = 0
    const pts: Pt[] = ride.path.map((s) => s.coord)
    for (let i = 1; i < pts.length; i++) {
      const r = graph?.route(pts[i - 1], pts[i], 'drive')
      if (r) {
        coords.push(...r.coords)
        metres += r.metres
      } else coords.push(pts[i - 1], pts[i])
    }
    coords.push(to)
    return {
      coords,
      metres: graph ? metres : null,
      geometry: 'shuttle',
      shuttle: { board: ride.board.name, alight: ride.alight.name, hops: ride.hops },
    }
  }
  if (!graph) return straight
  const r = graph.route(from, to, mode === 'walk' ? 'walk' : 'drive')
  if (!r) return straight
  return { coords: r.coords, metres: Math.round(r.metres), geometry: 'road' }
}

/** Every day of the plan's window, with what it holds, in trip order. */
export function buildTripDays(plan: TripPlanT, graph: RoadGraph | null, dayEnd: DayEnd = { kind: 'sunset' }): TripDay[] {
  const slotted = slotPlan(plan.items)
  const days: TripDay[] = []
  for (let day = plan.dates.start, index = 0; day <= plan.dates.end && index < 60; day = addDaysIso(day, 1), index++) {
    const items = slotted.get(day) ?? []
    const ordered = [
      ...items.filter((s) => s.startMin !== null).sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0)),
      ...items.filter((s) => s.startMin === null),
    ]
    const all = ordered.map((s, i) => toStop(s, i + 1))
    const stops = all.filter((s) => s.coord)
    const unmapped = all.filter((s) => !s.coord)
    // Renumber so the pins on the map count 1, 2, 3 without a gap where an
    // unmapped entry sits; the panel shows those entries in time order too,
    // under the same numbers they would take, without a pin.
    stops.forEach((s, i) => (s.order = i + 1))

    const checks = new Map(dayLegs(ordered).map((l) => [`${l.from.item.itemId}>${l.to.item.itemId}`, l]))
    const legs: TripLeg[] = []
    for (let i = 1; i < stops.length; i++) {
      const from = stops[i - 1]
      const to = stops[i]
      const mode = legMode(from.item, to.item)
      const check = checks.get(`${from.itemId}>${to.itemId}`)
      legs.push({
        from,
        to,
        mode,
        modeSet: Boolean(from.item.travelMode),
        autoMode: legMode({ ...from.item, travelMode: undefined }, to.item),
        minutes: driveMinutesBetween(from.item, to.item),
        ...routeLeg(from.coord!, to.coord!, mode, graph),
        fit: check ? check.kind : 'untimed',
      })
    }

    const warnings: DayWarning[] = []
    for (const leg of legs) {
      if (leg.fit === 'short') {
        const check = checks.get(`${leg.from.itemId}>${leg.to.itemId}`)!
        warnings.push({
          kind: 'late',
          itemId: leg.to.itemId,
          text: `Can't reach ${leg.to.info.title} in time: the ${leg.mode === 'drive' ? 'drive' : leg.mode} takes about ${formatTime(check.needMin)}, and the day leaves ${formatTime(Math.max(0, check.gapMin))}.`,
        })
      } else if (leg.fit === 'overlap') {
        warnings.push({ kind: 'overlap', itemId: leg.to.itemId, text: `${leg.from.info.title} runs into ${leg.to.info.title}.` })
      }
      if (leg.geometry === 'straight') {
        warnings.push({
          kind: 'unrouted',
          itemId: leg.to.itemId,
          text:
            leg.mode === 'shuttle'
              ? `No shuttle stop near both ends of the leg to ${leg.to.info.title}: drawn straight, priced as a drive.`
              : `No ${leg.mode === 'walk' ? 'path' : 'road'} route found to ${leg.to.info.title}: drawn as a straight line.`,
        })
      }
    }
    for (const s of all) {
      if (s.startMin === null) {
        warnings.push({ kind: 'unplaced', itemId: s.itemId, text: `${s.info.title} doesn't fit in the day.` })
      } else if (s.kind === 'hike') {
        const fit = daylightFit(day, s.startMin, s.durationMin)
        if (fit?.verdict === 'dark') {
          warnings.push({ kind: 'dark', itemId: s.itemId, text: `${s.info.title} ends after sunset (${formatClock(fit.sunsetMin)}).` })
        }
      }
    }
    // Past the end of the day. Under the sunset rule only daytime blocks
    // count: a sunset stop and an evening meal are anchored after dark on
    // purpose (trip/slotting.ts), a program keeps the park's published time,
    // and a custom entry (dinner, a check-in) is the reader's own clock. Under
    // a fixed end, the reader picked the clock, so everything counts.
    const limit = dayEnd.kind === 'fixed' ? dayEnd.minutes : sunTimes(day)?.sunsetMin
    const counted = all.filter((s) => s.startMin !== null && (dayEnd.kind === 'fixed' || daytimeBlock(s.item)))
    const latest = counted.reduce<TripStop | null>(
      (a, s) => (!a || s.startMin! + s.durationMin > a.startMin! + a.durationMin ? s : a),
      null,
    )
    if (latest && limit !== undefined && latest.startMin! + latest.durationMin > limit) {
      const endMin = latest.startMin! + latest.durationMin
      warnings.push({
        kind: 'past-end',
        itemId: latest.itemId,
        text:
          dayEnd.kind === 'fixed'
            ? `${latest.info.title} runs to ${formatClock(endMin)}, past your ${formatClock(limit)} end of day.`
            : `${latest.info.title} runs to ${formatClock(endMin)}, past sunset (${formatClock(limit)}).`,
      })
    }

    days.push({ day, index, label: `Day ${index + 1} · ${formatDayHeader(day)}`, stops, unmapped, legs, warnings })
  }
  return days
}

// --- GeoJSON for the map ---------------------------------------------------------

export function dayColor(colors: string[], index: number): string {
  return colors[index % colors.length]
}

export function tripStopsGeojson(days: TripDay[], colors: string[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: days.flatMap((d) =>
      d.stops.map((s) => ({
        type: 'Feature' as const,
        id: undefined,
        properties: {
          itemId: s.itemId,
          day: d.day,
          dayIndex: d.index,
          color: dayColor(colors, d.index),
          icon: `trip-${s.kind}-${d.index % colors.length}`,
          order: String(s.order),
          label: s.pinLabel,
          title: s.info.title,
          warn: d.warnings.some((w) => w.itemId === s.itemId && w.kind !== 'unrouted'),
        },
        geometry: { type: 'Point' as const, coordinates: s.coord! },
      })),
    ),
  }
}

export function tripLegsGeojson(days: TripDay[], colors: string[]): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: 'FeatureCollection',
    features: days.flatMap((d) =>
      d.legs.map((l) => ({
        type: 'Feature' as const,
        properties: {
          day: d.day,
          dayIndex: d.index,
          color: dayColor(colors, d.index),
          mode: l.mode,
          geometry: l.geometry,
          fromId: l.from.itemId,
          toId: l.to.itemId,
        },
        geometry: { type: 'LineString' as const, coordinates: l.coords },
      })),
    ),
  }
}
