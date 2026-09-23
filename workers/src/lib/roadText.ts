// =============================================================================
// ROAD TEXT — which road a clause of park prose is about.
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
//   "Tioga Road is open, but Glacier Point Road remains closed."
//     read as Tioga closed, because closed wins over open within an alert.
//
// So a status word counts only for the roads its own clause is about:
//
//   1. Clauses. A clause ends at a sentence break or a semicolon, at a comma
//      and a conjunction (", but"), and at a comma before a second road's
//      name ("Glacier Point Road open, Tioga Road closed"). Roads joined by
//      "and", "or", "&", "/" or a list's commas are one subject ("Big Oak
//      Flat Road and Tioga Road are closed"). Titles are read the same way.
//   2. Places. A road named after a preposition or in a relative clause is
//      where something happens, not what the clause is about ("closed from
//      Crane Flat to the Tioga Road junction", "which leaves the Wawona Road
//      at Chinquapin"), and a road in brackets says what the road before it
//      is. Either counts only when its clause has no other subject.
//   3. Addresses. A highway by number beside a road by name is that road's
//      address, not a second road with news: "Wawona Road (continuation of
//      Highway 41 from Fresno)", "Tioga Road / Highway 120". The name the
//      highway carries inside the park (Big Oak Flat Road, El Portal Road,
//      Wawona Road) is a road in its own right.
//   4. Areas. A road that only says where an area, a trail or a campground
//      is, is not the thing closed: "The area east of the Wawona Road is
//      closed", "Glacier Point Road area closure", and the second half of
//      "Tioga Road is open, but trails near Tenaya Lake are closed".
//   5. "The road". A description sentence with no road as its subject that
//      says "the road" is about the road the title names, when the title
//      names exactly one ("Tioga Road update" over "The road is closed for
//      the season.").
//
// Where the rules cannot tell, they read nothing rather than a status for the
// wrong road: a missed change costs a day, a false one is pushed to buyers.
// test/road-readings.mts holds the phrasings; add the next one there.
// =============================================================================

export type RoadPattern = {
  id: string
  re: RegExp
  // An approach highway (120, 140, 41), as against a road inside the park.
  highway?: boolean
  // The name that highway carries inside the park (rule 3).
  localName?: RegExp
}

// The park's shared form for the two seasonal roads ("Tioga and Glacier Point
// Roads", "Tioga & Glacier Point Roads"), which the single-road patterns miss.
export const TIOGA_AND_GLACIER_POINT = String.raw`tioga (?:and|&) glacier point roads|glacier point (?:and|&) tioga roads`

// The approach highways, by number or by the name each carries inside the
// park: Big Oak Flat Road is 120 inside the gate, El Portal Road is 140,
// Wawona Road is 41. The watch reports them; the /api/alerts summary reads
// with them too, so a clause about Big Oak Flat Road is never Tioga's news.
function approach<Id extends string>(id: Id, number: number, localName: string) {
  return {
    id,
    re: new RegExp(String.raw`\b(?:highway|hwy\.?|route|state route|sr-?|ca-?)\s*${number}\b|\b${localName}\b`, 'i'),
    highway: true,
    localName: new RegExp(String.raw`\b${localName}\b`, 'i'),
  }
}
export const HWY_120 = approach('hwy-120', 120, 'big oak flat road')
export const HWY_140 = approach('hwy-140', 140, 'el portal road')
export const HWY_41 = approach('hwy-41', 41, 'wawona road')
export const APPROACH_HIGHWAYS = [HWY_120, HWY_140, HWY_41]

// Sentence breaks: . ! ? followed by space and a capital, a quote, or an
// opening bracket (so "Hwy. 120" and "7 a.m. on" stay whole); semicolons,
// which join two roads' news in one line; and line breaks, which the park's
// descriptions use between list items.
const SENTENCE_BREAK = /\n+|(?<=[.!?])\s+(?=[A-Z"“(])|;\s*/

// Rule 1: where a sentence turns to another subject.
const CLAUSE_BREAK = /,\s*(?:and|but|or|so|yet|while|whereas|although|though|however)\b|\s(?:but|while|whereas|although|though)\s/gi
// Rule 1: what may stand between two roads that are one subject. ", and"
// joins only the end of a list, and a bracket only when it holds another name
// for the road before it ("Tioga Road (Highway 120) and Glacier Point Road"):
// one that holds news ("Tioga Road (closed for the season), Glacier Point
// Road (open)") keeps it for that road.
const JOIN_RE = /^(\s*\([^)]*\))?\s*(,)?\s*(and|or|&|\/)?\s*(?:the\s+)?$/i

// Rule 2: the words that make the road after them a place in its clause.
const PLACE_RE =
  /(?:\b(?:of|off|from|to|at|near|on|onto|into|via|along|past|beyond|toward|towards|between|through|over|above|below|beside|around|across|behind|with|leaves|leaving|joins|joining|meets|meeting)\s+(?:the\s+)?|,\s*(?:which|that|where)\b[^,;]*)$/i

// Rule 4: what is closed when a road only says where it is.
const AREA = String.raw`(?:areas?|zones?|trails?|trailheads?|campgrounds?|parking|wilderness|backcountry)`
// "The area east of the Wawona Road", "Crane Flat Campground, on Big Oak Flat Road"
const AREA_PLACE_RE = new RegExp(
  String.raw`\b${AREA}\b,?[^,;.)]*?\b(?:(?:north|south|east|west)(?:east|west)?\s+of|along|near|beside|off|on|at|around|below|above|beyond|from|to|between|next\s+to|adjacent\s+to)\s+(?:the\s+)?$`,
  'i',
)
// "Glacier Point Road area closure", "Tioga Road trailheads"
const AREA_AFTER_RE = new RegExp(String.raw`^\s+${AREA}\b`, 'i')
// ", but trails near Tenaya Lake are closed"
const AREA_SUBJECT_RE = new RegExp(String.raw`^\s*(?:(?:the|all|some|most|many|several)\s+)?${AREA}\b`, 'i')
// Where an area's clause may begin after the last road: CLAUSE_BREAK plus a
// bare "and" ("is open and the area north of it is closed"). Straight after
// the road, "and" joins a second subject instead ("Tioga Road and all
// trailheads along it are closed"), so a break counts only once the road's
// own clause has said something.
const TAIL_BREAK = /,\s*(?:and|but|or|so|yet|while|whereas|although|though|however)\b|\s(?:and|but|while|whereas|although|though)\s/gi

// Rule 5.
const THE_ROAD_RE = /\b(?:the|this) road\b/gi

type Mention = {
  ids: string[] // empty once rule 4 sets the road aside; it still ends a clause
  start: number
  end: number
  numbered: boolean // a highway by its number (rule 3)
  aside: boolean // inside brackets (rule 2)
  lead: boolean // what its clause is about, not a place in it (rule 2)
}

type Group = { mentions: Mention[]; lead: boolean; listed: boolean }
type Clause = { start: number; end: number; groups: Group[] }

function namedIn(sentence: string, roads: readonly RoadPattern[]): Mention[] {
  const hits: Mention[] = []
  for (const road of roads) {
    const re = new RegExp(road.re.source, `${road.re.flags.replace('g', '')}g`)
    for (const m of sentence.matchAll(re)) {
      const start = m.index ?? 0
      hits.push({
        ids: [road.id],
        start,
        end: start + m[0].length,
        numbered: !!road.highway && !road.localName?.test(m[0]),
        aside: false,
        lead: false,
      })
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end)
  const merged: Mention[] = []
  for (const hit of hits) {
    const last = merged[merged.length - 1]
    // One stretch of text is one mention: the shared form "Tioga and Glacier
    // Point Roads" is both roads at once.
    if (last && hit.start < last.end) {
      for (const id of hit.ids) if (!last.ids.includes(id)) last.ids.push(id)
      last.end = Math.max(last.end, hit.end)
      last.numbered = last.numbered && hit.numbered
    } else {
      merged.push(hit)
    }
  }
  return merged
}

function anaphorsIn(sentence: string, id: string): Mention[] {
  return [...sentence.matchAll(THE_ROAD_RE)].map((m) => {
    const start = m.index ?? 0
    return { ids: [id], start, end: start + m[0].length, numbered: false, aside: false, lead: false }
  })
}

// Rules 2 and 4, on mentions in text order.
function classify(sentence: string, mentions: Mention[]): Mention[] {
  let from = 0
  for (const m of mentions) {
    const before = sentence.slice(from, m.start)
    if (AREA_PLACE_RE.test(before) || AREA_AFTER_RE.test(sentence.slice(m.end))) m.ids = []
    m.aside = sentence.lastIndexOf('(', m.start) > sentence.lastIndexOf(')', m.start)
    m.lead = m.ids.length > 0 && !m.aside && !PLACE_RE.test(before)
    from = m.end
  }
  return mentions
}

function mentionsIn(sentence: string, roads: readonly RoadPattern[], titleRoad: string | null): Mention[] {
  const named = classify(sentence, namedIn(sentence, roads))
  if (!titleRoad || named.some((m) => m.lead)) return named
  const all = [...namedIn(sentence, roads), ...anaphorsIn(sentence, titleRoad)].sort((a, b) => a.start - b.start)
  return classify(sentence, all)
}

function lastBreak(text: string): number | null {
  let at: number | null = null
  for (const m of text.matchAll(CLAUSE_BREAK)) at = m.index ?? 0
  return at
}

// Rule 1. Bracketed mentions never start or end a clause; they join the
// clause they sit in.
function clausesIn(sentence: string, mentions: Mention[]): Clause[] {
  let main = mentions.filter((m) => !m.aside)
  let asides = mentions.filter((m) => m.aside)
  if (main.length === 0) [main, asides] = [asides, []]
  if (main.length === 0) return []

  let group: Group = { mentions: [main[0]], lead: main[0].lead, listed: false }
  let clause: Clause = {
    start: lastBreak(sentence.slice(0, main[0].start)) ?? 0,
    end: sentence.length,
    groups: [group],
  }
  const clauses = [clause]
  for (let i = 1; i < main.length; i++) {
    const a = main[i - 1]
    const b = main[i]
    const gap = sentence.slice(a.end, b.start)
    const join = JOIN_RE.exec(gap)
    const renames = !join?.[1] || asides.some((m) => m.start > a.end && m.end < b.start)
    if (join && renames && !(join[2] && join[3] && !group.listed)) {
      group.mentions.push(b)
      if (join[2]) group.listed = true
      continue
    }
    group = { mentions: [b], lead: b.lead, listed: false }
    const turn = lastBreak(gap)
    const comma = gap.lastIndexOf(',')
    const cut = turn !== null ? a.end + turn : b.lead ? (comma >= 0 ? a.end + comma + 1 : b.start) : null
    if (cut === null) {
      clause.groups.push(group)
      continue
    }
    clause.end = cut
    clause = { start: cut, end: sentence.length, groups: [group] }
    clauses.push(clause)
  }

  // Rule 4 after the last road: "Tioga Road is open, but trails near Tenaya
  // Lake are closed" ends Tioga's clause at the comma.
  const tail = main[main.length - 1].end
  for (const m of sentence.slice(tail).matchAll(TAIL_BREAK)) {
    const at = tail + (m.index ?? 0)
    if (sentence.slice(tail, at).trim() && AREA_SUBJECT_RE.test(sentence.slice(at + m[0].length))) {
      clause.end = at
      break
    }
  }

  for (const m of asides) {
    const home = clauses.find((c) => m.start >= c.start && m.start < c.end)
    home?.groups.push({ mentions: [m], lead: false, listed: false })
  }
  return clauses
}

// The roads a clause is about: its subject, or its places when it has none
// (rule 2), with a numbered highway beside a named road set aside (rule 3).
function roadsOf(clause: Clause): string[] {
  const byName = clause.groups.some((g) => g.mentions.some((m) => m.ids.length > 0 && !m.numbered))
  const groups = clause.groups
    .map((g) => ({ lead: g.lead, ids: g.mentions.filter((m) => !(byName && m.numbered)).flatMap((m) => m.ids) }))
    .filter((g) => g.ids.length > 0)
  const leads = groups.filter((g) => g.lead)
  return [...new Set((leads.length > 0 ? leads : groups).flatMap((g) => g.ids))]
}

function sentencesOf(text: string): string[] {
  return text
    .split(SENTENCE_BREAK)
    .map((s) => s.trim())
    .filter(Boolean)
}

function read(sentence: string, roads: readonly RoadPattern[], titleRoad: string | null) {
  return clausesIn(sentence, mentionsIn(sentence, roads, titleRoad)).map((c) => ({
    text: sentence.slice(c.start, c.end).trim(),
    ids: roadsOf(c),
  }))
}

/**
 * One alert's text about one road: the clauses (title first) that are about
 * it, joined, or '' when none is. The readers run their status patterns over
 * this instead of over the whole alert. `roads` is every road name the
 * attribution should know, which may be more than the roads a reader reports.
 */
export function textAbout(
  alert: { title: string; description: string },
  road: RoadPattern,
  roads: readonly RoadPattern[],
): string {
  const title = sentencesOf(alert.title).flatMap((s) => read(s, roads, null))
  const titleIds = new Set(title.flatMap((c) => c.ids))
  const titleRoad = titleIds.size === 1 ? [...titleIds][0] : null
  const body = sentencesOf(alert.description).flatMap((s) => read(s, roads, titleRoad))
  return [...title, ...body]
    .filter((c) => c.ids.includes(road.id))
    .map((c) => c.text)
    .join(' ')
}
