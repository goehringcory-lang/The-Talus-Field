// =============================================================================
// Which entry is "here". Pure: a fix and a catalog in, a ranked list and a
// choice out, so the hook can be thin and the rule can be tested.
//
// The choice carries hysteresis. Halfway between two pullouts the raw nearest
// flips with every GPS wobble, and a companion that announces Tunnel View,
// then Artist Point, then Tunnel View again in thirty seconds is the "unnerving"
// complaint every audio tour gets. So the current entry keeps its place until
// a rival is nearer by a real margin: fifteen percent of the current distance,
// or a hundred metres, whichever is larger. The percentage governs at range
// (two miles out, a rival must be 500 m closer), the floor governs on foot
// (at 200 m, fifteen percent is 30 m, less than the fix's own accuracy).
// =============================================================================

import { cardinalOf, haversineMiles, initialBearingDeg } from '../utils/geo'
import type { NearEntry } from './entries'

export type RankedEntry = {
  entry: NearEntry
  /** Straight-line distance from the fix. */
  miles: number
  /** Bearing FROM the fix TO the entry: the way to look. */
  bearingDeg: number
  cardinal: string
}

export const HYSTERESIS_FRACTION = 0.15
/** 100 m, in miles. */
export const HYSTERESIS_FLOOR_MI = 100 / 1609.344

/** Every entry by distance from the fix, nearest first. */
export function rankEntries(
  fix: [number, number],
  entries: readonly NearEntry[],
): RankedEntry[] {
  return entries
    .map((entry) => {
      const bearingDeg = initialBearingDeg(fix, entry.coord)
      return {
        entry,
        miles: haversineMiles(fix, entry.coord),
        bearingDeg,
        cardinal: cardinalOf(bearingDeg),
      }
    })
    .sort((a, b) => a.miles - b.miles)
}

/** The margin a rival must beat the current entry by before it takes over. */
export function switchMargin(currentMiles: number): number {
  return Math.max(currentMiles * HYSTERESIS_FRACTION, HYSTERESIS_FLOOR_MI)
}

/**
 * The entry to show, given the one showing now and the fresh ranking. Keeps
 * `currentKey` unless the nearest rival is closer by `switchMargin`; a current
 * key that is not in the ranking (or none) yields the plain nearest.
 */
export function pickNearest(currentKey: string | null, ranked: RankedEntry[]): string | null {
  const best = ranked[0]
  if (!best) return null
  if (currentKey === null) return best.entry.key
  const current = ranked.find((r) => r.entry.key === currentKey)
  if (!current) return best.entry.key
  if (best.entry.key === currentKey) return currentKey
  return best.miles < current.miles - switchMargin(current.miles) ? best.entry.key : currentKey
}
