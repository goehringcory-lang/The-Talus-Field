// =============================================================================
// ROAD TEXT — which road a sentence of park prose is about.
//
// Two readers turn the NPS alert prose into a status per road: the summary
// /api/alerts serves (lib/alerts.ts, the PWA's road line) and the nightly
// change watch (lib/roads.ts, which emails the operator and pushes a notice
// to buyers). Both used to test a whole alert at once, so an alert that named
// a road anywhere and said "closed" anywhere read as that road closed. The
// park's notices name several roads at once, and that misread both ways:
//
//   "Tioga Road (continuation of Highway 120 through the park) is closed"
//     read as Highway 120 closed. That is the park's own name for Tioga Road
//     (conditions.htm writes every road that way), while the 120 approach,
//     Big Oak Flat Road, stays open all winter; the watch would have pushed
//     "Highway 120: closed" to every buyer with a trip that fortnight.
//   "Tioga Road is open. Glacier Point Road remains closed."
//     read as Tioga closed, because closed wins over open within an alert.
//
// So a status word counts only for the roads its own sentence names, and a
// highway named in a sentence that also names an in-park road is that road's
// address, not a second road with news: "Wawona Road (continuation of
// Highway 41 from Fresno)", "Glacier Point Road, off Highway 41 at
// Chinquapin". A sentence that names no road at all but says "the road" is
// about the road the alert's title names, when the title names exactly one
// ("Tioga Road update" over "The road is closed for the season.").
// =============================================================================

export type RoadPattern = {
  id: string
  re: RegExp
  // An approach highway (120, 140, 41), as against a road inside the park.
  highway?: boolean
}

// The park's shared form for the two seasonal roads ("Tioga and Glacier Point
// Roads", "Tioga & Glacier Point Roads"), which the single-road patterns miss.
export const TIOGA_AND_GLACIER_POINT = String.raw`tioga (?:and|&) glacier point roads|glacier point (?:and|&) tioga roads`

// Sentence breaks: . ! ? followed by space and a capital, a quote, or an
// opening bracket (so "Hwy. 120" and "7 a.m. on" stay whole); semicolons,
// which join two roads' news in one line; and line breaks, which the park's
// descriptions use between list items.
const SENTENCE_BREAK = /\n+|(?<=[.!?])\s+(?=[A-Z"“(])|;\s*/

const THE_ROAD_RE = /\b(?:the|this) road\b/i

export function alertSentences(alert: { title: string; description: string }): string[] {
  return [alert.title, ...alert.description.split(SENTENCE_BREAK)]
    .map((s) => s.trim())
    .filter(Boolean)
}

function roadsAbout<T extends RoadPattern>(sentence: string, roads: readonly T[]): T[] {
  const named = roads.filter((r) => r.re.test(sentence))
  const inPark = named.filter((r) => !r.highway)
  return inPark.length > 0 ? inPark : named
}

/**
 * One alert's text about one road: the sentences (title first) that speak
 * about it, joined, or '' when none does. The readers run their status
 * patterns over this instead of over the whole alert.
 */
export function textAbout<T extends RoadPattern>(
  alert: { title: string; description: string },
  road: T,
  roads: readonly T[],
): string {
  const titleRoads = roadsAbout(alert.title, roads)
  return alertSentences(alert)
    .filter((sentence) => {
      const subjects = roadsAbout(sentence, roads)
      if (subjects.length > 0) return subjects.some((r) => r.id === road.id)
      return titleRoads.length === 1 && titleRoads[0].id === road.id && THE_ROAD_RE.test(sentence)
    })
    .join(' ')
}
