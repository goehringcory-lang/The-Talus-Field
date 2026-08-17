// =============================================================================
// /trip/print — the plan as a paper day sheet. Paper works where the park has
// no signal and phones die; this page renders the finalized plan as plain
// tables, one per day, built from the same slotting the agenda and the ICS
// export use, so what prints is what the calendar says. Chrome-less like
// /welcome; the print button and back link hide themselves on paper.
// Key numbers in the footer repeat the ones published in the before-you-go
// essential, so the sheet stays useful if the phone does not.
// =============================================================================

import { Link } from 'react-router-dom'
import { slottedToEventFields } from '../trip/ics'
import { driveMinutesBetween, slotPlan } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { formatClock, formatDayHeader } from '../utils/date'
import './TripPrint.css'

function formatDuration(minutes: number): string {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`
    : `${minutes}m`
}

function coordText(coord: [number, number]): string {
  const [lng, lat] = coord
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

function datesLabel(start: string, end: string): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  return start === end ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
}

export default function TripPrint() {
  const { plan } = useTripPlan()
  const slotted = slotPlan(plan.items)
  const days = [...slotted.entries()]

  return (
    <div className="trip-print">
      <div className="trip-print__controls">
        <Link to="/trip">← Back to the planner</Link>
        <button type="button" className="btn btn--sm" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <header className="trip-print__header">
        <h1>Yosemite trip</h1>
        <p>
          {datesLabel(plan.dates.start, plan.dates.end)} · The Talus Field · Field Guide
        </p>
      </header>

      {days.length === 0 ? (
        <p>
          Nothing planned yet. Build your days in the <Link to="/trip">trip planner</Link> first.
        </p>
      ) : (
        days.map(([day, items]) => (
          <section className="trip-print__day" key={day}>
            <h2>{formatDayHeader(day)}</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Plan</th>
                  <th>GPS</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s, i) => {
                  const f = slottedToEventFields(s)
                  if (!f) return null
                  const drive = i > 0 ? driveMinutesBetween(items[i - 1].item, s.item) : null
                  return (
                    <tr key={f.uid}>
                      <td className="trip-print__time">
                        {s.startMin !== null ? formatClock(s.startMin) : 'All day'}
                        {s.startMin !== null && (
                          <span className="trip-print__duration">{formatDuration(f.durationMin)}</span>
                        )}
                      </td>
                      <td>
                        <strong>{f.summary}</strong>
                        {drive !== null && drive > 0 && (
                          <span className="trip-print__drive"> · ~{drive} min drive from the last stop</span>
                        )}
                        {f.location && <span className="trip-print__loc">{f.location}</span>}
                      </td>
                      <td className="trip-print__gps">{f.coord ? coordText(f.coord) : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        ))
      )}

      <footer className="trip-print__footer">
        <p>
          911 works by call or text inside the park. Park information and recorded road
          conditions: 209/372-0200. Roadside assistance: 209/372-1060. Yosemite Medical Clinic:
          209/372-4637.
        </p>
        <p>
          Times are estimates from the Field Guide planner; programs keep their published times.
          GPS coordinates are latitude, longitude.
        </p>
      </footer>
    </div>
  )
}
