// The deadline events ride the same ICS writer as the board, so this checks the
// two things the board never exercised: an all-day event spanning several
// days (DTEND is exclusive, so the lottery week ends on the Sunday after) and
// a caller-set VALARM on an all-day event.
import { describe, expect, it } from 'vitest'
import { resolveDeadlines } from '../content/deadlines'
import { deadlineEventFields } from './deadlineEvent'
import { buildEventsIcs } from './ics'

const trip = resolveDeadlines('2027-07-14', '2027-07-16', '2026-09-05')
const pick = (id: string) => trip.find((d) => d.id === id)!

describe('deadlineEventFields', () => {
  it('makes a timed one-hour event of a 7 a.m. release with an evening-before alarm', () => {
    const f = deadlineEventFields(pick('camp4'))
    expect(f.day).toBe('2027-07-07')
    expect(f.startMin).toBe(7 * 60)
    expect(f.durationMin).toBe(60)
    expect(f.allDay).toBe(false)
    expect(f.alarmTrigger).toBe('-PT12H')
    expect(f.uid).toBe('tfg-deadline-camp4-2027-07-07@thetalusfieldjournal.com')
  })

  it('makes a multi-day all-day event of the wilderness lottery week', () => {
    const f = deadlineEventFields(pick('wilderness-lottery'))
    expect(f.allDay).toBe(true)
    expect(f.day).toBe('2027-01-24')
    expect(f.endDay).toBe('2027-01-30')
    expect(f.alarmTrigger).toBe('-PT15H')
  })
})

describe('buildEventsIcs with deadline fields', () => {
  it('writes an exclusive DTEND for the spanning all-day event and keeps the alarm', () => {
    const ics = buildEventsIcs([deadlineEventFields(pick('wilderness-lottery'))], 'Test')
    expect(ics).toContain('DTSTART;VALUE=DATE:20270124')
    expect(ics).toContain('DTEND;VALUE=DATE:20270131')
    expect(ics).toContain('TRIGGER:-PT15H')
    expect(ics).toContain('X-WR-CALNAME:Test')
  })

  it('writes local Pacific times for the lottery window', () => {
    const ics = buildEventsIcs([deadlineEventFields(pick('halfdome-daily'))], 'Test')
    expect(ics).toContain('DTSTART;TZID=America/Los_Angeles:20270712T000000')
    expect(ics).toContain('DTEND;TZID=America/Los_Angeles:20270712T160000')
    expect(ics).toContain('TRIGGER:-PT12H')
  })

  it('keeps the board default of a 30-minute alarm when none is set', () => {
    const ics = buildEventsIcs(
      [
        {
          uid: 'x@test',
          summary: 'Stop',
          description: '',
          day: '2027-07-14',
          startMin: 9 * 60,
          durationMin: 60,
          allDay: false,
        },
      ],
      'Test',
    )
    expect(ics).toContain('TRIGGER:-PT30M')
  })
})
