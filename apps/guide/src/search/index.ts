// Client-side search over everything in the guide. The index is built once
// at module load from bundled content, so search works fully offline and
// needs no dependencies. Tokenized substring scoring: title hits outrank
// swap-callout hits outrank body hits.

import {
  DINING,
  DINING_AREAS,
  ESSENTIALS,
  HIKES,
  REGIONS,
  SEASONAL_EVENTS,
  SECRET_GUIDE_CATEGORY_TITLE,
  SECRET_SPOTS,
  stops,
} from '../content'
import { HUNTS, type HuntT } from '../content/hunts'
import { KIND_LABELS, WILDLIFE, type WildlifeEntryT } from '../content/wildlife'

export type SearchHit = {
  id: string
  url: string
  title: string
  section: 'Stops' | 'Hikes' | 'Secret Guide' | 'Essentials' | 'Programs' | 'Dining' | 'Wildlife' | 'For kids'
  eyebrow: string
  snippet: string
  score: number
}

type Entry = {
  id: string
  url: string
  title: string
  section: SearchHit['section']
  eyebrow: string
  titleText: string
  swapText: string
  bodyText: string
}

const REGION_LABEL = Object.fromEntries(REGIONS.map((r) => [r.id, r.title])) as Record<string, string>

// Labels plus notes, in the same order they render, so the indexed text and
// the original-body reconstruction below stay index-aligned for snippets.
function essentialChecklistText(
  checklist: (typeof ESSENTIALS)[number]['checklist'],
): string {
  return (checklist ?? []).map((c) => (c.note ? `${c.label} ${c.note}` : c.label)).join(' ')
}

// Shared by indexing and snippet reconstruction so the two stay index-aligned
// (same rule as essentialChecklistText above).
function wildlifeBodyText(w: WildlifeEntryT): string {
  return `${w.lookFor} ${w.whereWhen} ${w.note}${w.safety ? ' ' + w.safety : ''}`
}

function huntBodyText(h: HuntT): string {
  return h.intro + ' ' + h.items.map((i) => (i.note ? `${i.label} ${i.note}` : i.label)).join(' ')
}

function buildEntries(): Entry[] {
  const entries: Entry[] = stops.map((s) => ({
    id: s.id,
    url: `/stop/${s.id}`,
    title: s.title,
    section: s.collection === 'hidden' ? ('Secret Guide' as const) : ('Stops' as const),
    eyebrow: REGION_LABEL[s.region] ?? s.region,
    titleText: s.title.toLowerCase(),
    swapText: (s.swap ?? '').toLowerCase(),
    bodyText: s.body.toLowerCase(),
  }))

  for (const t of ESSENTIALS) {
    entries.push({
      id: t.id,
      url: `/essentials/${t.id}`,
      title: t.title,
      section: 'Essentials',
      eyebrow: 'Know before you go',
      titleText: t.title.toLowerCase(),
      swapText: t.teaser.toLowerCase(),
      bodyText: (t.body + ' ' + essentialChecklistText(t.checklist)).toLowerCase(),
    })
  }

  // The day-hike catalog. Each hit lands on the hike's detail page (stats,
  // elevation profile, GPX); the trailhead line is indexed at swap weight so
  // "mist trail shuttle" style queries surface the right hike.
  for (const h of HIKES) {
    entries.push({
      id: h.id,
      url: `/hike/${h.id}`,
      title: h.title,
      section: 'Hikes',
      eyebrow: REGION_LABEL[h.region] ?? h.region,
      titleText: h.title.toLowerCase(),
      swapText: h.trailhead.toLowerCase(),
      bodyText: h.description.toLowerCase(),
    })
  }

  // The seasonal almanac: full moons, road windows, waterfall windows. One
  // entry per almanac event, all landing on /programs where the event shows
  // once the trip dates overlap it.
  for (const ev of SEASONAL_EVENTS) {
    entries.push({
      id: ev.id,
      url: '/programs',
      title: ev.title,
      section: 'Programs',
      eyebrow: 'Seasonal almanac',
      titleText: ev.title.toLowerCase(),
      swapText: '',
      bodyText: ev.description.toLowerCase(),
    })
  }

  // The dining directory. Every hit lands on /dining; the place line is
  // indexed at swap weight so "coffee curry village" style queries surface
  // the right venue.
  const DINING_AREA_TITLE = Object.fromEntries(DINING_AREAS.map((a) => [a.id, a.title]))
  for (const v of DINING) {
    entries.push({
      id: v.id,
      url: `/dining#${v.id}`,
      title: v.name,
      section: 'Dining',
      eyebrow: v.area === 'gateway' ? v.town ?? 'Gateway towns' : DINING_AREA_TITLE[v.area] ?? v.area,
      titleText: v.name.toLowerCase(),
      swapText: v.place.toLowerCase(),
      bodyText: v.description.toLowerCase(),
    })
  }

  // The wildlife quick-ID guide. Every hit lands on /wildlife; the Latin name
  // is indexed at swap weight so "ursus" or "sequoiadendron" still resolves.
  for (const w of WILDLIFE) {
    entries.push({
      id: w.id,
      url: `/wildlife#${w.id}`,
      title: w.name,
      section: 'Wildlife',
      eyebrow: KIND_LABELS[w.kind],
      titleText: w.name.toLowerCase(),
      swapText: w.latin.toLowerCase(),
      bodyText: wildlifeBodyText(w).toLowerCase(),
    })
  }

  // The junior naturalist find-it lists, one entry per region's hunt, so
  // "dipper" or "glacial polish" surfaces the list that promises it.
  for (const h of HUNTS) {
    entries.push({
      id: `hunt-${h.region}`,
      url: '/hunts',
      title: `Find it: ${h.title}`,
      section: 'For kids',
      eyebrow: 'For young naturalists',
      titleText: h.title.toLowerCase(),
      swapText: '',
      bodyText: huntBodyText(h).toLowerCase(),
    })
  }

  for (const s of SECRET_SPOTS) {
    entries.push({
      id: s.id,
      url: `/stop/${s.id}`,
      title: s.title,
      section: 'Secret Guide',
      eyebrow: SECRET_GUIDE_CATEGORY_TITLE[s.category],
      titleText: s.title.toLowerCase(),
      swapText: (s.swap ?? '').toLowerCase(),
      bodyText: s.body.toLowerCase(),
    })
  }

  return entries
}

const ENTRIES = buildEntries()

function snippetAround(body: string, lowerBody: string, token: string, span = 120): string {
  const at = lowerBody.indexOf(token)
  if (at < 0) return body.slice(0, span) + (body.length > span ? '…' : '')
  const start = Math.max(0, at - Math.floor(span / 3))
  const end = Math.min(body.length, at + span)
  return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '')
}

// Starting points for an empty box: one per kind of thing the guide answers
// (a place, a logistics word, a safety word, a hike, food, an animal, kids).
// Each is asserted to return hits in index.test.ts.
export const SEARCH_SUGGESTIONS = [
  'Tunnel View',
  'parking',
  'sunset',
  'waterfalls',
  'bears',
  'coffee',
  'kids',
  'chains',
]

// The forms of a query word worth trying. The park names its falls in the
// singular ("Vernal Fall", "Nevada Fall") and readers type the plural, so a
// trailing s, es, or ies is also tried without it; a substring match already
// covers the other direction ("fall" finds "falls").
export function tokenVariants(token: string): string[] {
  const out = [token]
  if (token.length > 4 && token.endsWith('ies')) out.push(token.slice(0, -3) + 'y')
  if (token.length > 4 && token.endsWith('es')) out.push(token.slice(0, -2))
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) out.push(token.slice(0, -1))
  return out
}

/** The lowercase query words, as search() splits them. */
export function queryTokens(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter((t) => t.length >= 2)
}

export function search(query: string, limit = 24): SearchHit[] {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return []

  const hits: SearchHit[] = []
  for (const entry of ENTRIES) {
    let score = 0
    let firstBodyToken: string | null = null
    for (const word of tokens) {
      let tokenScore = 0
      for (const token of tokenVariants(word)) {
        if (entry.titleText.includes(token)) tokenScore += 3
        if (entry.swapText.includes(token)) tokenScore += 2
        if (entry.bodyText.includes(token)) {
          tokenScore += 1
          if (!firstBodyToken) firstBodyToken = token
        }
        if (tokenScore > 0) break // the exact form wins; a variant is the fallback
      }
      if (tokenScore === 0) {
        score = 0
        break // every token must match somewhere
      }
      score += tokenScore
    }
    if (score === 0) continue

    // Original-case body for the snippet; index stores lowercase only. For
    // Essentials the indexed bodyText appends checklist labels, so the
    // original must too or snippetAround's index would fall past the string
    // (empty snippet when the match is only in a checklist label).
    let originalBody: string
    if (entry.section === 'Essentials') {
      const topic = ESSENTIALS.find((t) => t.id === entry.id)
      originalBody = topic ? topic.body + ' ' + essentialChecklistText(topic.checklist) : ''
    } else if (entry.section === 'Programs') {
      originalBody = SEASONAL_EVENTS.find((ev) => ev.id === entry.id)?.description ?? ''
    } else if (entry.section === 'Hikes') {
      originalBody = HIKES.find((h) => h.id === entry.id)?.description ?? ''
    } else if (entry.section === 'Dining') {
      originalBody = DINING.find((v) => v.id === entry.id)?.description ?? ''
    } else if (entry.section === 'Wildlife') {
      const w = WILDLIFE.find((x) => x.id === entry.id)
      originalBody = w ? wildlifeBodyText(w) : ''
    } else if (entry.section === 'For kids') {
      const h = HUNTS.find((x) => `hunt-${x.region}` === entry.id)
      originalBody = h ? huntBodyText(h) : ''
    } else {
      originalBody =
        (stops.find((s) => s.id === entry.id) ?? SECRET_SPOTS.find((s) => s.id === entry.id))?.body ?? ''
    }

    hits.push({
      id: entry.id,
      url: entry.url,
      title: entry.title,
      section: entry.section,
      eyebrow: entry.eyebrow,
      snippet: firstBodyToken
        ? snippetAround(originalBody, entry.bodyText, firstBodyToken)
        : originalBody.slice(0, 120) + (originalBody.length > 120 ? '…' : ''),
      score,
    })
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}
