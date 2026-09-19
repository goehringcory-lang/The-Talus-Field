// The trip calendar file. Apple Calendar and Outlook are the readers, and
// each rule here is one they enforce: 75-octet folding, a VTIMEZONE for the
// TZID the times use, a UID that survives a day move and re-import, a
// SEQUENCE that rises with the plan's own change clock, RFC 5545 escaping,
// and an all-day event for the stop the day could not fit.
import { describe, expect, it } from 'vitest'
import { buildEventsIcs, buildTripIcs, slottedToEventFields } from './ics'
import { hikeItemId, stopItemId } from './schema'
import type { TripItemT } from './schema'
import { slotPlan } from './slotting'
import type { SlottedItem } from './slotting'
import type { EventFields } from './ics'

const DAY = '2026-07-04'
const stop = (stopId: string, extra: Partial<{ eventUid: string; durationMin: number; startTime: string }> = {}): TripItemT => ({
  type: 'stop',
  itemId: stopItemId(stopId, DAY),
  stopId,
  day: DAY,
  ...extra,
})
const lines = (ics: string) => ics.split('\r\n')
const unfold = (ics: string) => ics.replace(/\r\n /g, '')
const UPDATED = '2026-07-01T12:00:00.000Z'

describe('buildTripIcs', () => {
  const ics = buildTripIcs(slotPlan([stop('tunnel-view', { eventUid: 'uid-tv' }), stop('glacier-point'), { type: 'hike', itemId: hikeItemId('sentinel-dome', DAY), hikeId: 'sentinel-dome', day: DAY }]), UPDATED)

  it('folds every line to 75 octets, with space continuations, and ends in CRLF', () => {
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    for (const line of lines(ics)) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    expect(ics).toMatch(/\r\n /)
    // Unfolding restores a description that was longer than one line.
    expect(unfold(ics)).toMatch(/DESCRIPTION:[^\r\n]{80,}/)
    expect(ics.includes('\n') && !ics.includes('\r\n\r\n')).toBe(true)
  })

  it('carries one Pacific VTIMEZONE and times its events in it', () => {
    expect(unfold(ics).match(/BEGIN:VTIMEZONE/g)).toHaveLength(1)
    expect(unfold(ics)).toContain('TZID:America/Los_Angeles')
    expect(unfold(ics)).toContain('BEGIN:DAYLIGHT')
    expect(unfold(ics)).toContain('BEGIN:STANDARD')
    expect(unfold(ics)).toContain('DTSTART;TZID=America/Los_Angeles:20260704T080000')
  })

  it('keeps UIDs stable across exports and prefers the day-move-proof eventUid', () => {
    const again = buildTripIcs(slotPlan([stop('tunnel-view', { eventUid: 'uid-tv' }), stop('glacier-point'), { type: 'hike', itemId: hikeItemId('sentinel-dome', DAY), hikeId: 'sentinel-dome', day: DAY }]), UPDATED)
    const uids = (s: string) => [...unfold(s).matchAll(/^UID:(.+)$/gm)].map((m) => m[1])
    expect(uids(ics)).toEqual(uids(again))
    expect(uids(ics)[0]).toMatch(/^tfg-trip-uid-tv@/)
    expect(uids(ics)[1]).toMatch(new RegExp(`^tfg-trip-${stopItemId('glacier-point', DAY)}@`))
  })

  it('derives SEQUENCE and LAST-MODIFIED from the plan clock, not the export moment', () => {
    const seq = Math.floor((Date.parse(UPDATED) - Date.UTC(2020, 0, 1)) / 1000)
    expect(unfold(ics)).toContain(`SEQUENCE:${seq}`)
    expect(unfold(ics)).toContain('LAST-MODIFIED:20260701T120000Z')
  })

  it('escapes commas in text and puts a reminder on timed events', () => {
    const u = unfold(ics)
    expect(u).toContain('LOCATION:Tunnel View\\, the moment the valley opens\\, Yosemite National Park')
    expect(u).toContain('SUMMARY:Tunnel View\\, the moment the valley opens')
    expect(u.match(/TRIGGER:-PT30M/g)).toHaveLength(3)
    expect(u).toContain('GEO:37.71560;-119.67730')
  })
})

describe('the unplaced and the late', () => {
  it('writes an all-day event with an exclusive DTEND for a stop the day could not fit', () => {
    const plan = slotPlan([stop('tunnel-view', { durationMin: 14 * 60 })])
    const ics = unfold(buildTripIcs(plan, UPDATED))
    expect(ics).toContain('DTSTART;VALUE=DATE:20260704')
    expect(ics).toContain('DTEND;VALUE=DATE:20260705')
    expect(ics).toContain("Unscheduled: this didn't fit the day's timeline")
    expect(ics).not.toContain('BEGIN:VALARM')
  })

  it('rolls DTEND to the next date for a block that crosses midnight', () => {
    const plan = slotPlan([stop('tunnel-view', { startTime: '23:30', durationMin: 60 })])
    const ics = unfold(buildTripIcs(plan, UPDATED))
    expect(ics).toContain('DTSTART;TZID=America/Los_Angeles:20260704T233000')
    expect(ics).toContain('DTEND;TZID=America/Los_Angeles:20260705T003000')
  })
})

describe('slottedToEventFields and buildEventsIcs', () => {
  it('returns null for a stop that no longer resolves', () => {
    const gone: SlottedItem = { item: stop('no-such-stop'), day: DAY, startMin: 480, durationMin: 60, fixed: false }
    expect(slottedToEventFields(gone)).toBeNull()
  })

  it('honors a caller-set alarm and escapes newlines in a description', () => {
    const f: EventFields = {
      uid: 'x@test',
      summary: 'Permit pickup; bring ID',
      description: 'Line one\nLine two',
      location: 'Wilderness Center',
      day: DAY,
      startMin: 9 * 60,
      durationMin: 30,
      allDay: false,
      alarmTrigger: '-P1D',
    }
    const ics = unfold(buildEventsIcs([f], 'Test, calendar', UPDATED))
    expect(ics).toContain('X-WR-CALNAME:Test\\, calendar')
    expect(ics).toContain('SUMMARY:Permit pickup\\; bring ID')
    expect(ics).toContain('DESCRIPTION:Line one\\nLine two')
    expect(ics).toContain('TRIGGER:-P1D')
  })
})
