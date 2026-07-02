// =============================================================================
// /programs — pick trip dates, get everything running those dates.
//
// A scrollable date-grouped agenda (deliberately not a calendar grid): sticky
// day headers, expandable rows, chips to filter by category and source.
// Synced while online, readable offline from the cached window. Dates persist
// in tfg.trip.dates and are shared with the trip planner.
// =============================================================================

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { programItemId } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, todayIso } from '../utils/date'
import {
  MAX_SPAN_DAYS,
  readTripDates,
  usePrograms,
  writeTripDates,
} from '../programs/usePrograms'
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type ProgramCategoryT,
  type ProgramEventT,
  type ProgramSourceT,
} from '../programs/schema'
import './Programs.css'

function formatDayHeader(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTime(hhmm?: string): string {
  if (!hhmm) return 'All day'
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

// Kept outside the component (like relativeTime) so render stays pure per
// the lint rules; staleness is display-only and a stale value across a
// re-render is harmless.
function isOlderThanDays(iso: string | null, days: number): boolean {
  if (!iso) return false
  return Date.now() - Date.parse(iso) > days * 86_400_000
}

function relativeTime(iso: string): string {
  const ms = Date.now() - Date.parse(iso)
  const minutes = Math.round(ms / 60_000)
  if (minutes < 2) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.round(hours / 24)
  return `${days} days ago`
}

export default function Programs() {
  const stored = readTripDates()
  const [start, setStart] = useState(stored?.start ?? todayIso())
  const [end, setEnd] = useState(stored?.end ?? addDaysIso(todayIso(), 4))
  const [categoryFilter, setCategoryFilter] = useState<ProgramCategoryT | null>(null)
  const [sourceFilter, setSourceFilter] = useState<ProgramSourceT | null>(null)
  const { addProgram, hasItem } = useTripPlan()

  const spanOk = /^\d{4}-\d{2}-\d{2}$/.test(start) && /^\d{4}-\d{2}-\d{2}$/.test(end) && end >= start
  const { events, syncedAt, loading, offline, coverage, error, sync } = usePrograms(
    spanOk ? start : null,
    spanOk ? end : null,
  )

  function updateDates(nextStart: string, nextEnd: string) {
    setStart(nextStart)
    // Clamp the window so it stays inside what the API will answer.
    let boundedEnd = nextEnd
    if (nextEnd < nextStart) boundedEnd = nextStart
    if (nextEnd > addDaysIso(nextStart, MAX_SPAN_DAYS)) boundedEnd = addDaysIso(nextStart, MAX_SPAN_DAYS)
    setEnd(boundedEnd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(nextStart) && /^\d{4}-\d{2}-\d{2}$/.test(boundedEnd)) {
      writeTripDates({ start: nextStart, end: boundedEnd })
    }
  }

  const filtered = useMemo(
    () =>
      events.filter(
        (ev) =>
          (!categoryFilter || ev.category === categoryFilter) &&
          (!sourceFilter || ev.source === sourceFilter),
      ),
    [events, categoryFilter, sourceFilter],
  )

  const byDay = useMemo(() => {
    const map = new Map<string, ProgramEventT[]>()
    for (const ev of filtered) {
      const bucket = map.get(ev.date)
      if (bucket) bucket.push(ev)
      else map.set(ev.date, [ev])
    }
    return [...map.entries()]
  }, [filtered])

  // Only offer chips for values present in the window; a row of dead filters
  // is noise.
  const presentCategories = useMemo(
    () => [...new Set(events.map((ev) => ev.category))],
    [events],
  )
  const presentSources = useMemo(() => [...new Set(events.map((ev) => ev.source))], [events])

  const syncedStale = isOlderThanDays(syncedAt, 7)
  const showStaleWarning = offline || syncedStale || (coverage !== 'full' && events.length > 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>Programs during your trip</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 28 }}>
          Ranger walks, Junior Ranger tables, Conservancy programs, tours, and star parties, day by
          day for the dates you pick. Sync while you have signal; the list stays readable in the
          park without it.
        </p>

        <div className="programs-dates">
          <label>
            Arriving
            <input
              type="date"
              value={start}
              onChange={(e) => updateDates(e.target.value, end)}
            />
          </label>
          <label>
            Leaving
            <input
              type="date"
              value={end}
              min={start}
              max={spanOk ? addDaysIso(start, MAX_SPAN_DAYS) : undefined}
              onChange={(e) => updateDates(start, e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn"
            onClick={sync}
            disabled={loading || !spanOk}
            style={{ minHeight: 44 }}
          >
            {loading ? 'Syncing…' : 'Sync now'}
          </button>
        </div>

        <div className="programs-sync" aria-live="polite">
          {syncedAt ? (
            <span>
              Listings synced {relativeTime(syncedAt)}
              {offline ? ' · showing the copy saved on this device' : ''}
            </span>
          ) : (
            <span>Not synced yet. Pick your dates and sync while you have signal.</span>
          )}
        </div>

        {showStaleWarning && (
          <div className="programs-stale">
            {coverage === 'partial'
              ? 'The saved listings only cover part of these dates. Sync again when you have signal.'
              : 'Listings were saved earlier and programs do change. Cross-check the Yosemite Guide or a visitor center bulletin board for cancellations.'}
          </div>
        )}
        {error && events.length === 0 && <div className="programs-stale">{error}</div>}

        {events.length > 0 && (
          <div className="programs-chips" role="group" aria-label="Filter programs">
            {presentCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="programs-chip"
                aria-pressed={categoryFilter === cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
            {presentSources.length > 1 &&
              presentSources.map((src) => (
                <button
                  key={src}
                  type="button"
                  className="programs-chip"
                  aria-pressed={sourceFilter === src}
                  onClick={() => setSourceFilter(sourceFilter === src ? null : src)}
                >
                  {SOURCE_LABELS[src]}
                </button>
              ))}
          </div>
        )}

        {byDay.length === 0 && !loading && events.length === 0 && !error && (
          <p className="programs-empty">
            Nothing listed for these dates yet. Programs post seasonally; sync again closer to your
            trip, and check the Yosemite Guide PDF for the printed schedule.
          </p>
        )}
        {byDay.length === 0 && events.length > 0 && (
          <p className="programs-empty">Nothing matches the current filters.</p>
        )}

        {byDay.map(([date, dayEvents]) => (
          <section key={date} aria-label={formatDayHeader(date)}>
            <div className="programs-day-header">{formatDayHeader(date)}</div>
            {dayEvents.map((ev) => (
              <details className="program-row" key={ev.id}>
                <summary>
                  <span className="program-row__time">{formatTime(ev.timeStart)}</span>
                  <span>
                    <h2 className="program-row__title">{ev.title}</h2>
                    <span className="program-row__meta">
                      {ev.location && <span>{ev.location}</span>}
                      <span>{SOURCE_LABELS[ev.source]}</span>
                      {ev.isFree === true && <span className="program-row__badge">Free</span>}
                      {ev.reservationRequired === true && (
                        <span className="program-row__badge">Reservation</span>
                      )}
                    </span>
                  </span>
                </summary>
                <p className="program-row__body">
                  {ev.description || 'No description published for this program.'}
                  {ev.timeEnd && `\nEnds around ${formatTime(ev.timeEnd)}.`}
                </p>
                <p
                  className="program-row__body"
                  style={{ marginTop: 8, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}
                >
                  {hasItem(programItemId(ev.id)) ? (
                    <Link to="/trip" className="btn btn--ghost" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
                      In your trip plan →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn"
                      style={{ minHeight: 44 }}
                      onClick={() => addProgram(ev)}
                    >
                      Add to trip
                    </button>
                  )}
                  {ev.url && (
                    <a href={ev.url} target="_blank" rel="noreferrer">
                      Details{offline ? ' (needs signal)' : ''} →
                    </a>
                  )}
                </p>
              </details>
            ))}
          </section>
        ))}

        <p className="programs-attribution">
          Program listings sourced from the National Park Service, with Yosemite Conservancy,
          Yosemite Hospitality, and astronomy-club schedules added by hand. Listings change;
          the operators' own pages are authoritative.
        </p>
      </main>
    </GatedChrome>
  )
}
