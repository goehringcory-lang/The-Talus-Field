// =============================================================================
// The companion's catalog: every entry it may announce, built once from the
// bundled content. Three sources, one shape. Core and hidden stops and the
// secret spots come in when they carry a coordinate that is not on the
// unverified list; a day hike comes in on the same terms, and only when no
// stop already stands at its trailhead, because a stop and its hike at one
// pullout are one place to a passenger and the stop page links the hike.
//
// The prose is the guide's own, no field invented: `teaser` is the stop's
// teaser (a hike has none, so its trailhead line stands in), and the "why
// stop here" paragraph is the first prose paragraph of the body, which is what
// every stop body opens with, flattened to plain text so it can be read aloud.
// =============================================================================

import { HIKES, REGION_SHORT, SECRET_SPOTS, stops } from '../content'
import type { GuideStopT, HikeT } from '../content'
import { haversineMiles } from '../utils/geo'
import { plainSummary } from '../utils/text'
import { UNVERIFIED_HIKE_IDS, UNVERIFIED_STOP_IDS } from './unverified'

export type NearEntry = {
  /** Collection-qualified, because a hike and a stop can share an id. */
  key: string
  kind: 'stop' | 'hike'
  id: string
  title: string
  coord: [number, number]
  /** One line under the title; the hike's trailhead when it has no teaser. */
  teaser: string | null
  /** The paragraph read aloud: the body's opening paragraph, plain text. */
  why: string
  /** Region or section label, mono, above the title. */
  where: string
  /** The entry's own page. */
  to: string
}

// The opening paragraph is the whole read, so the cap is generous: a stop
// body's first paragraph runs 400 to 700 characters, and cutting one at a
// sentence boundary reads better aloud than a trailing ellipsis.
const WHY_MAX_CHARS = 900

// Two entries this close share a pullout (lib/position.ts's AT_PLACE_MILES);
// a hike within it of an included stop is that stop's hike.
const SAME_PIN_MILES = 0.05

function stopEntry(s: GuideStopT): NearEntry | null {
  if (!s.coord || UNVERIFIED_STOP_IDS.has(s.id)) return null
  const where =
    'region' in s && s.collection !== 'hidden' ? REGION_SHORT[s.region] : 'The Secret Guide'
  return {
    key: `stop:${s.id}`,
    kind: 'stop',
    id: s.id,
    title: s.title,
    coord: s.coord,
    teaser: s.teaser ?? null,
    why: plainSummary(s.body, WHY_MAX_CHARS),
    where,
    to: `/stop/${s.id}`,
  }
}

function hikeEntry(h: HikeT, taken: NearEntry[]): NearEntry | null {
  if (!h.coord || UNVERIFIED_HIKE_IDS.has(h.id)) return null
  if (h.stopId && taken.some((e) => e.kind === 'stop' && e.id === h.stopId)) return null
  const coord = h.coord
  if (taken.some((e) => haversineMiles(e.coord, coord) < SAME_PIN_MILES)) return null
  return {
    key: `hike:${h.id}`,
    kind: 'hike',
    id: h.id,
    title: h.title,
    coord,
    teaser: `Trailhead: ${h.trailhead}`,
    why: h.description,
    where: `${REGION_SHORT[h.region]} · day hike`,
    to: `/hike/${h.id}`,
  }
}

function build(): NearEntry[] {
  const out: NearEntry[] = []
  for (const s of [...stops, ...SECRET_SPOTS]) {
    const e = stopEntry(s)
    if (e) out.push(e)
  }
  for (const h of HIKES) {
    const e = hikeEntry(h, out)
    if (e) out.push(e)
  }
  return out
}

/** Built at module load, like the content indexes: bundled data never changes. */
export const NEAR_ENTRIES: readonly NearEntry[] = build()
