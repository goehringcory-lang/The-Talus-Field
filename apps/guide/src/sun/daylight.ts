// =============================================================================
// Does the day have room for this? The guide already knows two numbers: how
// long a hike takes (the planner's generous durationMin) and when the sun
// sets (sun/solar.ts, computed on-device). Put together they answer the
// question rangers ask every afternoon at the Mist Trail junction and that a
// benighted hiker wishes they had asked: what is the latest I can start this
// and still be back with light to spare?
//
// Pure arithmetic over the same minutes-from-midnight dialect the slotter and
// the clock formatter use, so a verdict here agrees with the board. Nothing
// reads the clock; callers pass the date and, for a verdict, the start.
// =============================================================================

import { sunTimes } from './solar'

/** Light held in reserve past the planned finish. An hour: the time budget is
 *  generous but not a promise, the valley floor loses the sun before the
 *  horizon does, and a headlamp packed is not a headlamp you want to need. */
export const DAYLIGHT_MARGIN_MIN = 60

export type DaylightVerdict =
  | 'clear' // finishes with the full margin of light to spare
  | 'tight' // finishes before sunset, but inside the margin
  | 'dark'  // finishes after sunset

export type LatestStart = {
  sunriseMin: number
  sunsetMin: number
  /** Latest start that finishes `marginMin` before sunset. */
  latestStartMin: number
  /** The latest start comes before sunrise: the first hours are by headlamp,
   *  which is how the long ones (Half Dome, Clouds Rest) are actually done. */
  beforeSunrise: boolean
}

/** Latest start for a hike of `durationMin` on `dateIso`, or null when the
 *  date is malformed (sun/solar.ts returns null and there is no sunset). */
export function latestStart(
  dateIso: string,
  durationMin: number,
  marginMin = DAYLIGHT_MARGIN_MIN,
): LatestStart | null {
  const times = sunTimes(dateIso)
  if (!times) return null
  const latestStartMin = times.sunsetMin - marginMin - durationMin
  return {
    sunriseMin: times.sunriseMin,
    sunsetMin: times.sunsetMin,
    latestStartMin,
    beforeSunrise: latestStartMin < times.sunriseMin,
  }
}

export type DaylightFit = {
  sunsetMin: number
  endMin: number
  /** Minutes of light left at the finish; negative once it runs past sunset. */
  lightLeftMin: number
  verdict: DaylightVerdict
}

/** How a block starting at `startMin` and lasting `durationMin` sits against
 *  the day's sunset. */
export function daylightFit(
  dateIso: string,
  startMin: number,
  durationMin: number,
  marginMin = DAYLIGHT_MARGIN_MIN,
): DaylightFit | null {
  const times = sunTimes(dateIso)
  if (!times) return null
  const endMin = startMin + durationMin
  const lightLeftMin = times.sunsetMin - endMin
  const verdict: DaylightVerdict =
    lightLeftMin < 0 ? 'dark' : lightLeftMin < marginMin ? 'tight' : 'clear'
  return { sunsetMin: times.sunsetMin, endMin, lightLeftMin, verdict }
}
