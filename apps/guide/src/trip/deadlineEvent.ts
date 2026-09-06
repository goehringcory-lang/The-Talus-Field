// =============================================================================
// One resolved deadline (content/deadlines.ts) as the EventFields the ICS
// writer (trip/ics.ts) takes. Kept apart from the panel so the arithmetic is
// testable and the component file exports only a component.
// =============================================================================

import { DEADLINES_VERIFIED, deadlineClock, type ResolvedDeadline } from '../content/deadlines'
import type { EventFields } from './ics'

const UID_DOMAIN = 'thetalusfieldjournal.com'

function forDayLabel(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function deadlineEventFields(d: ResolvedDeadline): EventFields {
  const clock = deadlineClock(d.time)
  const window = clock ?? { startMin: null, durationMin: 0 }
  return {
    // Id plus date: the Half Dome daily lottery is one row and three events on
    // a three-day trip, and each must keep its own identity on re-import.
    uid: `tfg-deadline-${d.id}-${d.date}@${UID_DOMAIN}`,
    summary: d.title,
    description:
      `${d.detail}` +
      `\n\n${d.time.charAt(0).toUpperCase()}${d.time.slice(1)} Pacific.` +
      (d.confidence === 'typical' ? ' A typical pattern, not a date the park promises.' : '') +
      (d.forDay ? `\nFor your ${forDayLabel(d.forDay)} day.` : '') +
      `\n\nSource: ${d.source}\nVerified ${DEADLINES_VERIFIED} by The Talus Field.`,
    url: d.source,
    day: d.date,
    endDay: d.endDate,
    startMin: window.startMin,
    durationMin: window.durationMin,
    allDay: clock === null,
    // The evening before, either way: 12 hours ahead of a timed moment
    // (7 p.m. for a 7 a.m. release, noon for a midnight lottery), 9 a.m. the
    // day before an all-day window. Calendars that ignore imported alarms
    // apply their own; the copy promises nothing.
    alarmTrigger: clock === null ? '-PT15H' : '-PT12H',
  }
}

