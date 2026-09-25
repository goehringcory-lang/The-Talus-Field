// =============================================================================
// The drive check: does the day leave time to get from one thing to the next?
//
// Slotting (trip/slotting.ts) moves floating stops and hikes along to make
// room for the drive, but a published program keeps its published time and a
// block the buyer pinned keeps theirs, so nothing stopped a plan from ending
// a 12:30 Discovery Hike at Curry Village and starting a 1:00 river walk in
// Tuolumne Meadows, an hour and a half up the road. This module reads a
// slotted day in time order and reports every leg that does not fit.
//
// The need for each leg is driveMinutesBetween: the park's published driving
// table across areas, the straight-line estimate for short hops, and the same
// park-and-walk allowance slotting itself used, so the check and the board
// can never disagree about how long a leg takes. A leg with no coordinate on
// either side (a custom entry) is not judged: there is nothing to judge it by.
// =============================================================================

import { driveMinutesBetween, type SlottedItem } from './slotting'

export type DayLeg = {
  from: SlottedItem
  to: SlottedItem
  fromEndMin: number
  gapMin: number        // minutes between the end of one and the start of the next
  needMin: number       // drive plus park-and-walk, rounded to five minutes
  kind: 'ok' | 'short' | 'overlap'
}

// Five minutes of slack: the need is itself rounded to five, and flagging a
// Valley hop for being three minutes tight teaches the reader to ignore flags.
const SLACK_MIN = 5

/** Every consecutive leg of a slotted day that both ends carry a place for,
 *  in time order. Unplaced items (startMin null) are skipped. */
export function dayLegs(slotted: SlottedItem[]): DayLeg[] {
  const timed = slotted
    .filter((s) => s.startMin !== null)
    .sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
  const legs: DayLeg[] = []
  for (let i = 1; i < timed.length; i++) {
    const from = timed[i - 1]
    const to = timed[i]
    const need = driveMinutesBetween(from.item, to.item)
    if (need === null) continue
    const fromEndMin = (from.startMin ?? 0) + from.durationMin
    const gapMin = (to.startMin ?? 0) - fromEndMin
    const kind: DayLeg['kind'] = gapMin < 0 ? 'overlap' : gapMin + SLACK_MIN < need ? 'short' : 'ok'
    legs.push({ from, to, fromEndMin, gapMin, needMin: need, kind })
  }
  return legs
}

/** The legs that cannot be driven as planned, keyed by the itemId of the
 *  block you would arrive late to. */
export function shortLegsByTarget(slotted: SlottedItem[]): Map<string, DayLeg> {
  const out = new Map<string, DayLeg>()
  for (const leg of dayLegs(slotted)) {
    if (leg.kind === 'short') out.set(leg.to.item.itemId, leg)
  }
  return out
}
