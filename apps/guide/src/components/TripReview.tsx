// Review panel for the finalize flow on /trip: renders every calendar event
// the export will create, from the same slottedToEventFields the .ics builder
// uses, so what the user confirms is exactly what lands in their calendar.
// Items the day couldn't fit are called out with resolution controls instead
// of being silently exported (or, formerly, dropped).

import { getStopById } from '../content'
import type { ExportMethod } from '../trip/exportTrip'
import { slottedToEventFields } from '../trip/ics'
import type { SlottedItem } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { formatClock, formatDayHeader } from '../utils/date'

type Props = {
  slotted: Map<string, SlottedItem[]>
  windowDays: string[]
  exportResult: ExportMethod | null
  exporting: boolean
  onCreate: () => void
}

function formatDuration(minutes: number): string {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`
    : `${minutes}m`
}

export default function TripReview({ slotted, windowDays, exportResult, exporting, onCreate }: Props) {
  const { removeItem, setStopTime, moveStopToDay } = useTripPlan()

  const days = [...slotted.entries()]
  let eventCount = 0
  let allDayCount = 0
  for (const [, items] of days) {
    for (const s of items) {
      const f = slottedToEventFields(s)
      if (!f) continue
      eventCount += 1
      if (f.allDay) allDayCount += 1
    }
  }

  return (
    <section className="trip-review" aria-label="Review calendar events">
      {days.map(([day, items]) => {
        const scheduled = items.filter((s) => s.startMin !== null || s.fixed)
        const overflow = items.filter((s) => s.startMin === null && !s.fixed)
        return (
          <div key={day}>
            <h3 className="trip-review__day">{formatDayHeader(day)}</h3>
            {scheduled.map((s) => {
              const f = slottedToEventFields(s)
              if (!f) return null
              // The .ics LOCATION for stops repeats the title plus raw GPS;
              // on screen only a program's venue adds information.
              const venue = s.item.type === 'program' ? s.item.snapshot.location : undefined
              return (
                <div className="trip-review__event" key={f.uid}>
                  <span className="trip-review__event-time">
                    {s.startMin !== null ? formatClock(s.startMin) : 'All day'}
                  </span>
                  <span>
                    <span className="trip-review__event-title">{f.summary}</span>
                    <span className="trip-review__event-meta">
                      {s.startMin !== null && <span>{formatDuration(f.durationMin)}</span>}
                      {venue && <span>{venue}</span>}
                    </span>
                  </span>
                </div>
              )
            })}
            {overflow.length > 0 && (
              <div className="trip-review__overflow">
                <p className="trip-review__overflow-note">
                  {overflow.length === 1 ? "This doesn't" : "These don't"} fit in the day's
                  schedule before 9 p.m. Unresolved, each goes on the calendar as an all-day
                  event: set a time, move it, or drop it.
                </p>
                {overflow.map((s) => {
                  const { item } = s
                  const title =
                    item.type === 'stop'
                      ? getStopById(item.stopId)?.title ?? item.stopId
                      : item.snapshot.title
                  return (
                    <div className="trip-review__actions" key={item.itemId}>
                      <span className="trip-review__event-title">{title}</span>
                      {item.type === 'stop' && (
                        <>
                          <input
                            type="time"
                            value={item.startTime ?? ''}
                            onChange={(e) => setStopTime(item.itemId, e.target.value || undefined)}
                            aria-label={`Start time for ${title}`}
                          />
                          <select
                            value={item.day}
                            onChange={(e) => moveStopToDay(item.itemId, e.target.value)}
                            aria-label={`Day for ${title}`}
                          >
                            {windowDays.map((d) => (
                              <option key={d} value={d}>
                                {formatDayHeader(d)}
                              </option>
                            ))}
                            {!windowDays.includes(item.day) && (
                              <option value={item.day}>{formatDayHeader(item.day)}</option>
                            )}
                          </select>
                        </>
                      )}
                      <button
                        type="button"
                        className="btn btn--ghost"
                        style={{ minHeight: 36 }}
                        onClick={() => removeItem(item.itemId)}
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      <div className="trip-review__footer">
        <p className="trip-review__summary">
          Creates {eventCount} calendar {eventCount === 1 ? 'event' : 'events'} across{' '}
          {days.length} {days.length === 1 ? 'day' : 'days'}
          {allDayCount > 0 ? ` · ${allDayCount} all-day` : ''}.
        </p>
        <button
          type="button"
          className="btn"
          style={{ minHeight: 44 }}
          disabled={exporting || eventCount === 0}
          onClick={onCreate}
        >
          {exporting ? 'Preparing…' : 'Create calendar events'}
        </button>
      </div>

      {exportResult === 'shared' && (
        <div className="trip-export-hint">
          Shared. On iPhone: choose <strong>Save to Files</strong>, then open the saved file and
          tap <strong>Add All</strong> to put the trip in your calendar. Or share it straight to
          Mail and open the attachment on any device.
        </div>
      )}
      {exportResult === 'downloaded' && (
        <div className="trip-export-hint">
          Downloaded. Open the .ics file and your calendar app imports the whole trip: Google
          Calendar, Apple Calendar, and Outlook all read it. Events carry GPS coordinates and a
          Google Maps directions link wherever we know the exact spot; programs without a
          published location link to the operator's page instead.
        </div>
      )}
      {exportResult === 'cancelled' && (
        <div className="trip-export-hint">
          Share sheet closed, no events were created. Tap Create calendar events to try again.
        </div>
      )}
      {exportResult === 'failed' && (
        <div className="trip-export-hint">
          The export didn't start. Try again, or from a desktop browser if your phone blocks
          file downloads.
        </div>
      )}
    </section>
  )
}
