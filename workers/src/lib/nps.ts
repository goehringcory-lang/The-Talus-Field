// =============================================================================
// NPS Events API client.
//
// GET https://developer.nps.gov/api/v1/events?parkCode=yose&dateStart=&dateEnd=
// Free key (developer.nps.gov/get-started), passed as X-Api-Key. The key is a
// Worker secret and never reaches the PWA — the client only ever talks to our
// /api/programs endpoint.
//
// The API pre-expands recurring events: each event carries a `dates` array of
// concrete YYYY-MM-DD strings. We flatten to one ProgramEvent per date.
// Source data reloads on NPS's side roughly every 2 hours; our daily cron plus
// a 48h staleness fallback is comfortably inside that.
//
// Coverage caveat (matters for product copy): this feed carries NPS-led
// programs plus whichever partner events park staff enter (Parsons Lodge
// Summer Series and the Jr. Ranger Discovery Table have appeared). Most
// Yosemite Conservancy paid adventures and all Aramark commercial tours are
// NOT in it — those live in data/manual-programs.ts.
// =============================================================================

import type { Env } from '../env'
import {
  ProgramEvent,
  monthOf,
  type ProgramCategoryT,
  type ProgramEventT,
} from './programs'

const NPS_EVENTS_URL = 'https://developer.nps.gov/api/v1/events'
const PAGE_SIZE = 100
const MAX_PAGES = 20 // safety backstop; yose is nowhere near this

// The subset of the NPS event record we read. Fields are loosely typed on
// purpose: the API is a government CMS and values arrive as strings, empty
// strings, or missing depending on how the event was entered.
type NpsEvent = {
  id?: string
  title?: string
  description?: string
  dates?: string[]
  times?: { timestart?: string; timeend?: string; sunsetend?: string }[]
  location?: string
  latitude?: string
  longitude?: string
  isfree?: boolean | string
  isregresrequired?: boolean | string
  category?: string
  tags?: string[]
  types?: string[]
}

type NpsEventsResponse = {
  total?: string
  data?: NpsEvent[]
}

export async function fetchNpsEvents(
  env: Env,
  dateStart: string,
  dateEnd: string,
): Promise<ProgramEventT[]> {
  const all: NpsEvent[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({
      parkCode: 'yose',
      dateStart,
      dateEnd,
      pageSize: String(PAGE_SIZE),
      pageNumber: String(page),
    })
    const res = await fetch(`${NPS_EVENTS_URL}?${params}`, {
      headers: { 'X-Api-Key': env.NPS_API_KEY ?? '', accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`NPS events API ${res.status}`)
    }
    const body = (await res.json()) as NpsEventsResponse
    const batch = body.data ?? []
    all.push(...batch)
    const total = Number.parseInt(body.total ?? '0', 10)
    if (batch.length < PAGE_SIZE || all.length >= total) break
  }
  return normalize(all, dateStart, dateEnd)
}

function normalize(raw: NpsEvent[], dateStart: string, dateEnd: string): ProgramEventT[] {
  const out: ProgramEventT[] = []
  for (const ev of raw) {
    if (!ev.id || !ev.title) continue
    const dates = (ev.dates ?? []).filter(
      (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= dateStart && d <= dateEnd,
    )
    const time = ev.times?.[0]
    const base = {
      source: 'nps' as const,
      category: mapCategory(ev),
      title: decodeEntities(ev.title.trim()),
      description: stripHtml(ev.description ?? ''),
      timeStart: parseTime(time?.timestart),
      timeEnd: parseTime(time?.timeend),
      location: ev.location ? decodeEntities(ev.location.trim()) : undefined,
      coord: parseCoord(ev.longitude, ev.latitude),
      isFree: parseBool(ev.isfree),
      reservationRequired: parseBool(ev.isregresrequired),
      url: `https://www.nps.gov/planyourvisit/event-details.htm?id=${ev.id}`,
    }
    for (const date of dates) {
      const candidate = { ...base, id: `nps:${ev.id}:${date}`, date }
      const parsed = ProgramEvent.safeParse(candidate)
      if (parsed.success) {
        out.push(parsed.data)
      } else {
        console.error('nps normalize: dropped event', ev.id, date, parsed.error.issues[0])
      }
    }
  }
  return out
}

export function groupByMonth(events: ProgramEventT[]): Map<string, ProgramEventT[]> {
  const byMonth = new Map<string, ProgramEventT[]>()
  for (const ev of events) {
    const key = monthOf(ev.date)
    const bucket = byMonth.get(key)
    if (bucket) bucket.push(ev)
    else byMonth.set(key, [ev])
  }
  return byMonth
}

function mapCategory(ev: NpsEvent): ProgramCategoryT {
  const haystack = [ev.category ?? '', ...(ev.tags ?? []), ...(ev.types ?? []), ev.title ?? '']
    .join(' ')
    .toLowerCase()
  if (/junior ranger|jr\.? ranger/.test(haystack)) return 'junior-ranger'
  if (/astronomy|stargaz|star party|night sky|telescope/.test(haystack)) return 'astronomy'
  if (/kids|children|family/.test(haystack)) return 'kids'
  if (/walk|hike|stroll/.test(haystack)) return 'walk'
  if (/talk|program|presentation|lecture|campfire|evening/.test(haystack)) return 'talk'
  if (/tour/.test(haystack)) return 'tour'
  if (/art|music|theater|poetry|film|photograph/.test(haystack)) return 'arts'
  if (/ranger/.test(haystack)) return 'ranger'
  return 'other'
}

// "10:00 AM" / "14:00" → "HH:MM" 24h, else undefined.
function parseTime(value?: string): string | undefined {
  if (!value) return undefined
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
  if (!m) return undefined
  let h = Number(m[1])
  const min = m[2]
  const ampm = m[3]?.toUpperCase()
  if (ampm === 'PM' && h < 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  if (h > 23) return undefined
  return `${String(h).padStart(2, '0')}:${min}`
}

function parseCoord(lng?: string, lat?: string): [number, number] | undefined {
  const x = Number.parseFloat(lng ?? '')
  const y = Number.parseFloat(lat ?? '')
  if (!Number.isFinite(x) || !Number.isFinite(y) || (x === 0 && y === 0)) return undefined
  return [x, y]
}

function parseBool(value?: boolean | string): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&rsquo;|&#8217;/g, '’')
    .replace(/&lsquo;|&#8216;/g, '‘')
    .replace(/&rdquo;|&#8221;/g, '”')
    .replace(/&ldquo;|&#8220;/g, '“')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
}
