// The Secret Guide's numbering and the measured line under an entry's
// title, shared by /secret-guide, the entry pages and the deck.

import { REGION_SHORT, getSecretGuideEntries, type GuideStopT } from '../content'
import { DIFFICULTY_LABEL, formatElevation, formatTime } from '../content/labels'

// Numbering. Every entry carries its number in the whole set ("No. 14"), so a
// number names the same place in every chapter, on its page and in a route.

let folio: Map<string, number> | null = null
export function folioNumber(id: string): number {
  if (!folio) folio = new Map(getSecretGuideEntries().map((s, i) => [s.id, i + 1]))
  return folio.get(id) ?? 0
}
export function folioLabel(id: string): string {
  return `No. ${String(folioNumber(id)).padStart(2, '0')}`
}

// The short measured line under an entry's title: where, how high, how long,
// how hard, when. Set in mono as spaced readings; only the facts it carries.
export function entryMeta(s: GuideStopT, { region = true } = {}): string[] {
  const out: string[] = []
  if (s.cost) out.push(s.cost)
  if (region && 'region' in s) out.push(REGION_SHORT[s.region])
  if (s.elevationFt !== undefined) out.push(formatElevation(s.elevationFt))
  if (s.timeBudgetMin !== undefined) out.push(formatTime(s.timeBudgetMin))
  if (s.difficulty) out.push(DIFFICULTY_LABEL[s.difficulty])
  if (s.season) out.push(s.season)
  return out
}
