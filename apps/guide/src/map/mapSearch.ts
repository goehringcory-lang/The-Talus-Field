// =============================================================================
// Search on the map: every named thing the map can show (stops and the Secret
// Guide, day hikes, the places layer, places to eat, program meeting points),
// by name, with the same tokenizer as /search so "falls" finds "Vernal Fall".
// Each hit carries what the map needs to go there; nothing here touches the
// map. Pure; tested in mapSearch.test.ts.
// =============================================================================

import { AMENITIES, DINING, HIKES, SECRET_SPOTS, stops } from '../content'
import { KIND_STYLES } from './kinds'
import { queryTokens, tokenVariants } from '../search/tokens'
import type { ProgramPoint } from './programPoints'

export type MapHitKind = 'stop' | 'trail' | 'place' | 'meal' | 'program'

export type MapHit = {
  kind: MapHitKind
  id: string
  title: string
  /** What it is, in the pin's own words: "Viewpoint", "Day hike · 5.4 mi". */
  detail: string
  coord: [number, number]
}

type Entry = MapHit & { haystack: string; titleLc: string }

function entry(hit: MapHit, extra = ''): Entry {
  const titleLc = hit.title.toLowerCase()
  return { ...hit, titleLc, haystack: `${titleLc} ${hit.detail.toLowerCase()} ${extra.toLowerCase()}` }
}

function staticEntries(): Entry[] {
  const out: Entry[] = []
  for (const s of [...stops, ...SECRET_SPOTS]) {
    if (s.coord) out.push(entry({ kind: 'stop', id: s.id, title: s.title, detail: KIND_STYLES[s.kind].label, coord: s.coord }))
  }
  for (const h of HIKES) {
    if (h.coord) {
      out.push(entry({ kind: 'trail', id: h.id, title: h.title, detail: `Day hike · ${h.distanceMi} mi`, coord: h.coord }, h.trailhead))
    }
  }
  for (const a of AMENITIES) {
    out.push(entry({ kind: 'place', id: a.id, title: a.name, detail: KIND_STYLES[a.kind].label, coord: a.coord }))
  }
  for (const d of DINING) {
    if (d.coord) out.push(entry({ kind: 'meal', id: d.id, title: d.name, detail: 'Place to eat', coord: d.coord }))
  }
  return out
}

let cached: Entry[] | null = null

export function searchMap(query: string, programs: ProgramPoint[] = [], limit = 8): MapHit[] {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return []
  cached ??= staticEntries()
  const all = [
    ...cached,
    ...programs.flatMap((p) => [
      entry(
        { kind: 'program' as const, id: p.id, title: p.location, detail: `Programs · ${p.events.length} upcoming`, coord: p.coord },
        p.events.map((e) => e.title).join(' '),
      ),
    ]),
  ]
  const scored: { hit: Entry; score: number }[] = []
  for (const e of all) {
    let score = 0
    let every = true
    for (const word of tokens) {
      const variants = tokenVariants(word)
      if (variants.some((v) => e.titleLc.startsWith(v))) score += 6
      else if (variants.some((v) => e.titleLc.includes(v))) score += 4
      else if (variants.some((v) => e.haystack.includes(v))) score += 1
      else every = false
    }
    if (every && score > 0) scored.push({ hit: e, score })
  }
  scored.sort((a, b) => b.score - a.score || a.hit.title.length - b.hit.title.length)
  return scored.slice(0, limit).map(({ hit }) => ({ kind: hit.kind, id: hit.id, title: hit.title, detail: hit.detail, coord: hit.coord }))
}
