// =============================================================================
// /trip — the day-by-day plan built from stops and programs, exported to a
// calendar as one .ics file. Times: programs keep their published times,
// stops the user timed keep those, everything else is auto-slotted greedily
// (see trip/slotting.ts). Works fully offline: content is bundled, program
// items carry snapshots, and ICS generation is client-side.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { getStopById } from '../content'
import { ITINERARIES, type ItineraryKey } from '../content/itineraries'
import { getStopsByRegion } from '../content'
import { readTripDates } from '../programs/usePrograms'
import { exportTripIcs, type ExportMethod } from '../trip/exportTrip'
import { buildTripIcs } from '../trip/ics'
import { slotPlan, toHhmm } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import './Trip.css'

function formatDayHeader(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

function daysInWindow(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const stop = Date.parse(`${end}T00:00:00Z`)
  while (d.getTime() <= stop && out.length < 32) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

export default function Trip() {
  const { plan, addStop, removeItem, setStopTime, moveStopToDay, clear, setDates } = useTripPlan()
  const [exportResult, setExportResult] = useState<ExportMethod | null>(null)

  // Keep the plan window in step with the dates picked on /programs.
  useEffect(() => {
    const picked = readTripDates()
    if (picked && (picked.start !== plan.dates.start || picked.end !== plan.dates.end)) {
      setDates(picked.start, picked.end)
    }
  }, [plan.dates.start, plan.dates.end, setDates])

  const slotted = useMemo(() => slotPlan(plan.items), [plan])
  const windowDays = daysInWindow(plan.dates.start, plan.dates.end)

  async function onExport() {
    const ics = buildTripIcs(slotted)
    const result = await exportTripIcs(ics, `yosemite-trip-${plan.dates.start}.ics`)
    setExportResult(result)
  }

  function seedItinerary(key: ItineraryKey) {
    const days = ITINERARIES[key].days
    days.forEach((day, i) => {
      const date = windowDays[Math.min(i, windowDays.length - 1)]
      for (const region of day.regions) {
        for (const stop of getStopsByRegion(region)) {
          if (stop.kind === 'lodging') continue
          addStop(stop.id, date)
        }
      }
    })
  }

  const itemCount = plan.items.length

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>Your trip plan</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 24 }}>
          {formatDayHeader(plan.dates.start)} to {formatDayHeader(plan.dates.end)} ·{' '}
          <Link to="/programs">change dates on the Programs page</Link>. Add stops from their
          pages or the map, add programs from the list, then export the whole thing to your
          calendar.
        </p>

        <div className="trip-toolbar">
          <button
            type="button"
            className="btn"
            onClick={onExport}
            disabled={itemCount === 0}
            style={{ minHeight: 44 }}
          >
            Export to calendar (.ics)
          </button>
          {itemCount === 0 && (
            <>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>
                or start from a preset:
              </span>
              {(Object.keys(ITINERARIES) as ItineraryKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="btn btn--ghost"
                  style={{ minHeight: 44 }}
                  onClick={() => seedItinerary(key)}
                >
                  {ITINERARIES[key].label}
                </button>
              ))}
            </>
          )}
          {itemCount > 0 && (
            <button type="button" className="btn btn--ghost" style={{ minHeight: 44 }} onClick={clear}>
              Clear plan
            </button>
          )}
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
            Calendar, Apple Calendar, and Outlook all read it. Each event carries the GPS
            coordinates and a directions link.
          </div>
        )}
        {exportResult === 'failed' && (
          <div className="trip-export-hint">
            The export didn't start. Try again, or from a desktop browser if your phone blocks
            file downloads.
          </div>
        )}

        {itemCount === 0 ? (
          <p className="trip-empty">
            Nothing planned yet. Open a stop and tap <strong>Add to trip</strong>, add programs
            from the <Link to="/programs">Programs list</Link>, or seed a day from a preset above.
            The plan lives on this device and works offline.
          </p>
        ) : (
          [...slotted.entries()].map(([day, items]) => {
            const totalMin = items.reduce((sum, s) => sum + (s.startMin !== null ? s.durationMin : 0), 0)
            const overflow = items.filter((s) => s.startMin === null)
            return (
              <section className="trip-day" key={day} aria-label={formatDayHeader(day)}>
                <div className="trip-day__header">
                  <h2 className="trip-day__title">
                    {formatDayHeader(day)}
                    {(day < plan.dates.start || day > plan.dates.end) && ' · outside your dates'}
                  </h2>
                  <span className="trip-day__total">
                    ~{Math.floor(totalMin / 60)}h{totalMin % 60 ? ` ${totalMin % 60}m` : ''} planned
                  </span>
                </div>
                {items.map((s) => {
                  const { item } = s
                  const isStop = item.type === 'stop'
                  const stop = isStop ? getStopById(item.stopId) : undefined
                  const title = isStop ? stop?.title ?? item.stopId : item.snapshot.title
                  const link = isStop ? `/stop/${item.stopId}` : undefined
                  return (
                    <div className="trip-item" key={item.itemId}>
                      <div className="trip-item__time">
                        {isStop ? (
                          <>
                            <input
                              type="time"
                              value={item.startTime ?? (s.startMin !== null ? toHhmm(s.startMin) : '')}
                              onChange={(e) => setStopTime(item.itemId, e.target.value || undefined)}
                              aria-label={`Start time for ${title}`}
                            />
                            {!item.startTime && s.startMin !== null && (
                              <span className="trip-item__auto">auto</span>
                            )}
                          </>
                        ) : (
                          <span className="trip-item__fixed-time">
                            {s.startMin !== null ? formatClock(s.startMin) : 'All day'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="trip-item__title">
                          {link ? <Link to={link}>{title}</Link> : title}
                        </h3>
                        <span className="trip-item__meta">
                          <span>
                            {s.durationMin >= 60
                              ? `${Math.floor(s.durationMin / 60)}h${s.durationMin % 60 ? ` ${s.durationMin % 60}m` : ''}`
                              : `${s.durationMin}m`}
                          </span>
                          {isStop ? (
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
                          ) : (
                            <span>{item.snapshot.location ?? 'Program'}</span>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="trip-item__remove"
                        aria-label={`Remove ${title} from trip`}
                        onClick={() => removeItem(item.itemId)}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
                {overflow.length > 0 && (
                  <p className="trip-overflow">
                    {overflow.length} {overflow.length === 1 ? 'item doesn’t' : 'items don’t'} fit
                    in this day before 9 p.m. Move something to another day or set times by hand.
                  </p>
                )}
              </section>
            )
          })
        )}

        <p style={{ marginTop: 40, fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Times are suggestions built from each stop's time budget plus a 30-minute travel buffer;
          programs keep their published times. Everything here works offline once added.
        </p>
      </main>
    </GatedChrome>
  )
}
