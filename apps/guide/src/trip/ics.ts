// =============================================================================
// ICS generation, hand-rolled and dependency-free. One VEVENT per trip item:
// slotted items get local Pacific times via a static VTIMEZONE block, items
// without a slot (untimed programs, day overflow) become all-day events
// rather than being dropped. Local times are DST-proof, and Google Calendar
// and Apple Calendar both import TZID-scoped local times correctly.
// Stable UIDs mean a re-import updates events in place instead
// of duplicating them. Runs entirely client-side, so export works offline.
// =============================================================================

import { getHikeById, getStopById } from '../content'
import { DIFFICULTY_LABEL } from '../content/labels'
import { directionsUrl } from '../map/kinds'
import type { SlottedItem } from './slotting'
import { toHhmm } from './slotting'

const PRODID = '-//The Talus Field//Field Guide Trip//EN'
const TZID = 'America/Los_Angeles'
// UID namespace only, never a link. UIDs are event identity: changing this
// would duplicate every event when a subscriber's calendar refreshes or a
// buyer re-imports the file. Leave it alone even if the app changes domains.
const UID_DOMAIN = 'thetalusfieldjournal.com'
// Buyer-facing link base for event descriptions. Derived from the serving
// origin so calendar links keep working across any future domain cutover
// (pages.dev today, a custom domain later). ICS generation is client-only;
// the window guard is belt and braces for tests.
const APP_BASE =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://talus-field-guide.pages.dev'

// Standard US Pacific rules (in effect since 2007).
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TZID}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0800',
  'TZOFFSETTO:-0700',
  'TZNAME:PDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0700',
  'TZOFFSETTO:-0800',
  'TZNAME:PST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

// RFC 5545 text escaping: backslash, semicolon, comma, newline.
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    // \r\n, bare \n, AND a bare \r: a raw CR mid-line is illegal in RFC 5545
    // content lines and truncates the line for strict parsers.
    .replace(/\r\n|\r|\n/g, '\\n')
}

// Fold lines to 75 octets (continuation lines start with a space).
function fold(line: string): string[] {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 75) return [line]
  const out: string[] = []
  let current = ''
  let currentBytes = 0
  const limit = () => (out.length === 0 ? 75 : 74) // continuations lose 1 octet to the space
  for (const ch of line) {
    const chBytes = new TextEncoder().encode(ch).length
    if (currentBytes + chBytes > limit()) {
      out.push(out.length === 0 ? current : ` ${current}`)
      current = ch
      currentBytes = chBytes
    } else {
      current += ch
      currentBytes += chBytes
    }
  }
  if (current) out.push(out.length === 0 ? current : ` ${current}`)
  return out
}

function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function dtLocal(day: string, minutes: number): string {
  // An event that runs past midnight (e.g. a 23:30 program + 60 min) must roll
  // the calendar date forward, otherwise DTEND lands before DTSTART and
  // Google/Apple Calendar reject the VEVENT.
  const dayOffset = Math.floor(minutes / 1440)
  const dayStr = dayOffset > 0 ? addDays(day, dayOffset) : day
  const timeOfDay = ((minutes % 1440) + 1440) % 1440
  return `${dayStr.replace(/-/g, '')}T${toHhmm(timeOfDay).replace(':', '')}00`
}

function coordText(coord: [number, number]): string {
  const [lng, lat] = coord
  return `(${lat.toFixed(5)}, ${lng.toFixed(5)})`
}

export type EventFields = {
  uid: string
  summary: string
  description: string
  location?: string
  coord?: [number, number]
  url?: string
  day: string
  startMin: number | null // null = exported as an all-day event
  durationMin: number
  allDay: boolean
}

// The review panel renders from these same fields, so what the user confirms
// is what the .ics contains. Returns null only when a stop or hike id no
// longer resolves against the bundled content.
export function slottedToEventFields(slotted: SlottedItem): EventFields | null {
  const { item } = slotted
  const allDay = slotted.startMin === null
  if (item.type === 'stop') {
    const stop = getStopById(item.stopId)
    if (!stop) return null
    const teaser = stop.teaser ?? stop.body.split('\n')[0]
    return {
      // eventUid survives day moves; itemId (which embeds the day) is the
      // fallback for items stored before eventUid existed.
      uid: `tfg-trip-${item.eventUid ?? item.itemId}@${UID_DOMAIN}`,
      summary: stop.title,
      description:
        `${teaser}\n\nFrom The Talus Field Field Guide: ` +
        `${APP_BASE}/stop/${stop.id}` +
        // Google Calendar mostly drops the URL property on import, so the
        // directions deeplink rides in the description too.
        (stop.coord ? `\n\nDirections: ${directionsUrl(stop.coord)}` : '') +
        // A stop only lands here without a slot when the day overflowed;
        // say so in the event rather than silently shipping an all-day block.
        (allDay
          ? "\n\nUnscheduled: this didn't fit the day's timeline. Pick a time in the Field Guide trip planner."
          : ''),
      location: `${stop.title}, Yosemite National Park${stop.coord ? ` ${coordText(stop.coord)}` : ''}`,
      coord: stop.coord,
      url: stop.coord ? directionsUrl(stop.coord) : undefined,
      day: slotted.day,
      startMin: slotted.startMin,
      durationMin: slotted.durationMin,
      allDay,
    }
  }
  if (item.type === 'hike') {
    const hike = getHikeById(item.hikeId)
    if (!hike) return null
    const stats = `${hike.distanceMi} mi${hike.route === 'one-way' ? ' one-way' : ''} · ${hike.elevationGainFt.toLocaleString('en-US')} ft gain · ${DIFFICULTY_LABEL[hike.difficulty]}`
    return {
      uid: `tfg-trip-${item.eventUid ?? item.itemId}@${UID_DOMAIN}`,
      summary: hike.title,
      description:
        `${hike.description}\n\n${stats}` +
        (hike.permit ? `\n\n${hike.permit}` : '') +
        `\n\nTrailhead: ${hike.trailhead}` +
        (hike.coord ? `\nDirections: ${directionsUrl(hike.coord)}` : '') +
        (allDay
          ? "\n\nUnscheduled: this didn't fit the day's timeline. Pick a time in the Field Guide trip planner."
          : ''),
      location: `${hike.trailhead}, Yosemite National Park${hike.coord ? ` ${coordText(hike.coord)}` : ''}`,
      coord: hike.coord,
      url: hike.coord ? directionsUrl(hike.coord) : undefined,
      day: slotted.day,
      startMin: slotted.startMin,
      durationMin: slotted.durationMin,
      allDay,
    }
  }
  const ev = item.snapshot
  return {
    uid: `tfg-trip-${item.itemId}@${UID_DOMAIN}`,
    summary: ev.title,
    description: [
      ev.description,
      ev.url,
      ev.coord ? `Directions: ${directionsUrl(ev.coord)}` : undefined,
    ]
      .filter(Boolean)
      .join('\n\n'),
    location: ev.location
      ? `${ev.location}, Yosemite National Park${ev.coord ? ` ${coordText(ev.coord)}` : ''}`
      : 'Yosemite National Park',
    coord: ev.coord,
    // Prefer tap-to-navigate when we know the spot; the operator's info page
    // is already in the description either way.
    url: ev.coord ? directionsUrl(ev.coord) : ev.url,
    day: slotted.day,
    startMin: slotted.startMin,
    durationMin: slotted.durationMin,
    allDay,
  }
}

export function buildTripIcs(slottedByDay: Map<string, SlottedItem[]>): string {
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    // Calendar-level metadata for the subscription feed: a name for the
    // calendar list, and a suggested poll cadence for clients that honor it
    // (Apple does; Google polls on its own schedule regardless).
    'X-WR-CALNAME:Yosemite trip · The Talus Field',
    `X-WR-TIMEZONE:${TZID}`,
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    ...VTIMEZONE,
  ]

  for (const slottedItems of slottedByDay.values()) {
    for (const slotted of slottedItems) {
      const f = slottedToEventFields(slotted)
      if (!f) continue
      lines.push('BEGIN:VEVENT', `UID:${f.uid}`, `DTSTAMP:${now}`)
      if (f.startMin === null) {
        // No slot (untimed program, or a stop the day couldn't fit): an
        // all-day event keeps it on the calendar instead of dropping it.
        // DTEND is exclusive, so all-day means [day, day+1).
        lines.push(
          `DTSTART;VALUE=DATE:${f.day.replace(/-/g, '')}`,
          `DTEND;VALUE=DATE:${addDays(f.day, 1).replace(/-/g, '')}`,
        )
      } else {
        lines.push(
          `DTSTART;TZID=${TZID}:${dtLocal(f.day, f.startMin)}`,
          `DTEND;TZID=${TZID}:${dtLocal(f.day, f.startMin + f.durationMin)}`,
        )
      }
      lines.push(`SUMMARY:${esc(f.summary)}`)
      if (f.location) lines.push(`LOCATION:${esc(f.location)}`)
      if (f.coord) {
        const [lng, lat] = f.coord
        lines.push(`GEO:${lat.toFixed(5)};${lng.toFixed(5)}`)
      }
      if (f.url) lines.push(`URL:${f.url}`)
      if (f.description) lines.push(`DESCRIPTION:${esc(f.description)}`)
      if (f.startMin !== null) {
        // 30-minute display reminder on timed events. Apple Calendar honors
        // imported VALARMs; Google Calendar ignores them and applies the
        // user's own defaults, which is why the copy never promises alerts.
        lines.push(
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:${esc(f.summary)}`,
          'TRIGGER:-PT30M',
          'END:VALARM',
        )
      }
      lines.push('END:VEVENT')
    }
  }

  lines.push('END:VCALENDAR')
  return lines.flatMap(fold).join('\r\n') + '\r\n'
}
