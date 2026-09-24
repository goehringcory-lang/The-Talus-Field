// =============================================================================
// Road readings: what Tioga Road or Glacier Point Road is doing on a date, as
// one flag and one sentence the planner, the stop pages and /today can print.
//
// Two sources, and the rule for combining them is the honesty rule the
// ParkNowPanel follows. The live NPS status (/api/alerts, parsed per road by
// the Worker) speaks only for today, park time, and only while the alert set
// is inside its hide window; an 'unknown' status says nothing. Every other
// date, and today when the feed is silent, gets the almanac's typical answer
// (content/roads.ts), and it says "usually" in words. A typical reading is
// never presented as a closure, and a live reading is never extended to a
// future day.
// =============================================================================

import { useMemo } from 'react'
import {
  ROAD_NAME,
  roadForHike,
  roadForStopId,
  typicalRoadState,
  type RoadState,
  type SeasonalRoadId,
} from '../content/roads'
import { getHikeById } from '../content'
import type { SeasonalEventT } from '../content/schema'
import type { TripItemT } from '../trip/schema'
import { todayIso } from '../utils/date'
import type { RoadStatusT } from './schema'
import { HIDE_AFTER_MS } from './staleness'
import { useAlerts } from './useAlerts'

export type RoadReading = {
  road: SeasonalRoadId
  state: RoadState
  basis: 'live' | 'typical'
  // Short label for a board block; null when the road is open.
  flag: string | null
  // One plain sentence, source included.
  sentence: string
}

export type LiveRoads = { roads: RoadStatusT[]; ageMs: number }

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function monthDay(iso: string): string {
  return `${MONTH_NAMES[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}`
}

/** "between May 20 and June 30" for an almanac window. */
function between(ev: SeasonalEventT): string {
  return `between ${monthDay(ev.dateStart)} and ${monthDay(ev.dateEnd)}`
}

export function roadReading(
  road: SeasonalRoadId,
  dateIso: string,
  today: string,
  live?: LiveRoads | null,
): RoadReading {
  const name = ROAD_NAME[road]
  if (live && dateIso === today && live.ageMs <= HIDE_AFTER_MS) {
    const status = live.roads.find((r) => r.id === road)?.status
    if (status === 'open') {
      return { road, state: 'open', basis: 'live', flag: null, sentence: `${name} is open today, per the park's road status.` }
    }
    if (status === 'closed') {
      return {
        road,
        state: 'closed',
        basis: 'live',
        flag: 'Road closed today',
        sentence: `${name} is closed today, per the park's road status.`,
      }
    }
  }
  const t = typicalRoadState(road, dateIso)
  const month = MONTH_NAMES[Number(dateIso.slice(5, 7)) - 1]
  if (t.state === 'closed') {
    const reopening = t.window && /-open-\d{4}$/.test(t.window.id) ? `; it typically reopens ${between(t.window)}` : ''
    return {
      road,
      state: 'closed',
      basis: 'typical',
      flag: 'Road usually closed',
      sentence: `${name} is usually closed in ${month}${reopening}.`,
    }
  }
  if (t.state === 'unsettled') {
    const w = t.window
    const what = w
      ? /-open-\d{4}$/.test(w.id)
        ? `typically reopens ${between(w)}`
        : `typically closes for the season ${between(w)}`
      : `can be open or closed in ${month}`
    return {
      road,
      state: 'unsettled',
      basis: 'typical',
      flag: 'Road may be closed',
      sentence: `${name} ${what}. Check the park's road status before you drive up.`,
    }
  }
  return { road, state: 'open', basis: 'typical', flag: null, sentence: `${name} is usually open in ${month}.` }
}

/** The seasonal road a trip item depends on, if any. */
export function roadForItem(item: TripItemT): SeasonalRoadId | null {
  if (item.type === 'stop') return roadForStopId(item.stopId)
  if (item.type === 'hike') {
    const hike = getHikeById(item.hikeId)
    return hike ? roadForHike(hike) : null
  }
  return null
}

export type RoadReader = {
  forRoad: (road: SeasonalRoadId, dateIso: string) => RoadReading
  forItem: (item: TripItemT, dateIso: string) => RoadReading | null
}

/** One alerts subscription per surface; readers for any road and date. The
 *  park day is read once per render of the surface, the ParkNowPanel's
 *  granularity, which is plenty for a status that moves daily. */
export function useRoadReader(): RoadReader {
  const alerts = useAlerts()
  const live = useMemo<LiveRoads | null>(
    () => (alerts.fetchedAt ? { roads: alerts.roads, ageMs: alerts.ageMs } : null),
    [alerts.fetchedAt, alerts.roads, alerts.ageMs],
  )
  return useMemo(() => {
    const today = todayIso()
    const forRoad = (road: SeasonalRoadId, dateIso: string) => roadReading(road, dateIso, today, live)
    return {
      forRoad,
      forItem: (item: TripItemT, dateIso: string) => {
        const road = roadForItem(item)
        return road ? forRoad(road, dateIso) : null
      },
    }
  }, [live])
}
