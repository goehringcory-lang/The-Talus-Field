// The field log's counting rules, shared by /log and the Home panel so the
// two can never disagree about what "12 stops" means. All reads, no hooks:
// Home reads once per mount (same posture as its packs count), /log keeps
// its own live state but derives it through the same group function.

import {
  REGIONS,
  getSecretGuideEntries,
  getStopsByRegion,
  type GuideStopT,
} from '../content'
import { HUNTS } from '../content/hunts'
import { readChecked } from './checklist'
import { readSightingIds } from './sightings'
import { readStopNotes } from './stopNotes'
import { readVisitedIds } from './visited'

// Region groups first, then the merged Secret Guide list: the same shape the
// front page indexes the guide in, so the log reads as that index, filled in.
export function guideStopGroups(): { key: string; title: string; all: GuideStopT[] }[] {
  return [
    ...REGIONS.map((r) => ({
      key: r.id as string,
      title: r.title,
      all: getStopsByRegion(r.id) as GuideStopT[],
    })),
    { key: 'secret-guide', title: 'The Secret Guide', all: getSecretGuideEntries() },
  ]
}

export type LogSummary = {
  visited: number
  stopTotal: number
  species: number
  huntFinds: number
  notes: number
}

export function readLogSummary(): LogSummary {
  // Visited counted through the groups, not the raw id list: an id left over
  // from an earlier edition should not inflate the reading.
  const visitedSet = new Set(readVisitedIds())
  const groups = guideStopGroups()
  const visited = groups.reduce((n, g) => n + g.all.filter((s) => visitedSet.has(s.id)).length, 0)
  const stopTotal = groups.reduce((n, g) => n + g.all.length, 0)
  const checked = readChecked()
  const huntFinds = HUNTS.reduce(
    (n, h) => n + h.items.filter((i) => checked[i.id]).length,
    0,
  )
  return {
    visited,
    stopTotal,
    species: readSightingIds().length,
    huntFinds,
    // Every note counts, resolvable or not; /log renders the orphans too.
    notes: Object.keys(readStopNotes()).length,
  }
}

export function logHasEntries(s: LogSummary): boolean {
  return s.visited > 0 || s.species > 0 || s.huntFinds > 0 || s.notes > 0
}
