// Client-side search over everything in the guide. The index is built once
// at module load from bundled content, so search works fully offline and
// needs no dependencies. Tokenized substring scoring: title hits outrank
// swap-callout hits outrank body hits.

import {
  ESSENTIALS,
  REGIONS,
  SECRET_SPOTS,
  secretsLocked,
  stops,
} from '../content'

export type SearchHit = {
  id: string
  url: string
  title: string
  section: 'Stops' | 'Essentials' | 'Secret Spots'
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

function buildEntries(): Entry[] {
  const entries: Entry[] = stops.map((s) => ({
    id: s.id,
    url: `/stop/${s.id}`,
    title: s.title,
    section: 'Stops',
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
      bodyText: (t.body + ' ' + (t.checklist ?? []).map((c) => c.label).join(' ')).toLowerCase(),
    })
  }

  if (!secretsLocked()) {
    for (const s of SECRET_SPOTS) {
      entries.push({
        id: s.id,
        url: '/secret-spots',
        title: s.title,
        section: 'Secret Spots',
        eyebrow: 'Secret Spots',
        titleText: s.title.toLowerCase(),
        swapText: (s.swap ?? '').toLowerCase(),
        bodyText: s.body.toLowerCase(),
      })
    }
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

export function search(query: string, limit = 24): SearchHit[] {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length >= 2)
  if (tokens.length === 0) return []

  const hits: SearchHit[] = []
  for (const entry of ENTRIES) {
    let score = 0
    let firstBodyToken: string | null = null
    for (const token of tokens) {
      let tokenScore = 0
      if (entry.titleText.includes(token)) tokenScore += 3
      if (entry.swapText.includes(token)) tokenScore += 2
      if (entry.bodyText.includes(token)) {
        tokenScore += 1
        if (!firstBodyToken) firstBodyToken = token
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
      originalBody = topic
        ? topic.body + ' ' + (topic.checklist ?? []).map((c) => c.label).join(' ')
        : ''
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
