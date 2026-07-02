// =============================================================================
// ICS generation, hand-rolled and dependency-free. One VEVENT per slotted
// trip item, local Pacific times via a static VTIMEZONE block (DST-proof;
// Google Calendar and Apple Calendar both import TZID-scoped local times
// correctly). Stable UIDs mean a re-import updates events in place instead
// of duplicating them. Runs entirely client-side, so export works offline.
// =============================================================================

import { getStopById } from '../content'
import { directionsUrl } from '../map/kinds'
import type { SlottedItem } from './slotting'
import { toHhmm } from './slotting'

const PRODID = '-//The Talus Field//Field Guide Trip//EN'
const TZID = 'America/Los_Angeles'
const UID_DOMAIN = 'thetalusfieldjournal.com'

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
    .replace(/\r?\n/g, '\\n')
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

function dtLocal(day: string, minutes: number): string {
  return `${day.replace(/-/g, '')}T${toHhmm(minutes).replace(':', '')}00`
}

function coordText(coord: [number, number]): string {
  const [lng, lat] = coord
  return `(${lat.toFixed(5)}, ${lng.toFixed(5)})`
}

type EventFields = {
  uid: string
  summary: string
  description: string
  location?: string
  coord?: [number, number]
  url?: string
  day: string
  startMin: number
  durationMin: number
}

function toFields(slotted: SlottedItem): EventFields | null {
  if (slotted.startMin === null) return null
  const { item } = slotted
  if (item.type === 'stop') {
    const stop = getStopById(item.stopId)
    if (!stop) return null
    const teaser = stop.body.split('\n')[0]
    return {
      uid: `tfg-trip-${item.itemId}@${UID_DOMAIN}`,
      summary: stop.title,
      description:
        `${teaser}\n\nFrom The Talus Field Field Guide: ` +
        `https://guide.${UID_DOMAIN}/stop/${stop.id}`,
      location: `${stop.title}, Yosemite National Park${stop.coord ? ` ${coordText(stop.coord)}` : ''}`,
      coord: stop.coord,
      url: stop.coord ? directionsUrl(stop.coord) : undefined,
      day: slotted.day,
      startMin: slotted.startMin,
      durationMin: slotted.durationMin,
    }
  }
  const ev = item.snapshot
  return {
    uid: `tfg-trip-${item.itemId}@${UID_DOMAIN}`,
    summary: ev.title,
    description: [ev.description, ev.url].filter(Boolean).join('\n\n'),
    location: ev.location
      ? `${ev.location}, Yosemite National Park${ev.coord ? ` ${coordText(ev.coord)}` : ''}`
      : 'Yosemite National Park',
    coord: ev.coord,
    url: ev.url,
    day: slotted.day,
    startMin: slotted.startMin,
    durationMin: slotted.durationMin,
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
    ...VTIMEZONE,
  ]

  for (const slottedItems of slottedByDay.values()) {
    for (const slotted of slottedItems) {
      const f = toFields(slotted)
      if (!f) continue
      lines.push(
        'BEGIN:VEVENT',
        `UID:${f.uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;TZID=${TZID}:${dtLocal(f.day, f.startMin)}`,
        `DTEND;TZID=${TZID}:${dtLocal(f.day, f.startMin + f.durationMin)}`,
        `SUMMARY:${esc(f.summary)}`,
      )
      if (f.location) lines.push(`LOCATION:${esc(f.location)}`)
      if (f.coord) {
        const [lng, lat] = f.coord
        lines.push(`GEO:${lat.toFixed(5)};${lng.toFixed(5)}`)
      }
      if (f.url) lines.push(`URL:${f.url}`)
      if (f.description) lines.push(`DESCRIPTION:${esc(f.description)}`)
      lines.push('END:VEVENT')
    }
  }

  lines.push('END:VCALENDAR')
  return lines.flatMap(fold).join('\r\n') + '\r\n'
}
