// =============================================================================
// /programs — pick trip dates, get everything running those dates.
//
// A scrollable date-grouped agenda (deliberately not a calendar grid): sticky
// day headers, expandable rows, chips to filter by category and source.
// Synced while online, readable offline from the cached window. Dates persist
// in tfg.trip.dates and are shared with the trip planner.
// =============================================================================

import { useMemo, useState } from 'react'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import { Chip, ChipButton } from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'
import { announceTripAdd } from '../trip/addFeedback'
import { programItemId } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, formatDayHeader } from '../utils/date'
import {
  MAX_SPAN_DAYS,
  defaultTripDates,
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
import {
  seasonalDaysInRange,
  seasonalRangeLabel,
  seasonalToProgramEvent,
  seasonalWindowsInRange,
} from '../content'
import './Programs.css'

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
  const t = Date.parse(iso)
  // Guards a meta stamp saved from a pre-nullable Worker, whose unknown-sync
  // fallback was epoch 0 and rendered here as "synced 20454 days ago".
  if (!Number.isFinite(t) || t < Date.UTC(2020, 0, 1)) return 'at an unknown time'
  const ms = Date.now() - t
  const minutes = Math.round(ms / 60_000)
  if (minutes < 2) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.round(hours / 24)
  return `${days} days ago`
}

// Three ghost rows while the first sync for a window is in flight.
function ProgramsSkeleton() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div className="program-row program-row--skeleton" key={i}>
          <Skeleton width={64} height={14} />
          <div style={{ display: 'grid', gap: 8 }}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Programs() {
  // Lazy initializer: readTripDates hits localStorage + JSON.parse, which
  // only needs to happen once, not on every render.
  const [stored] = useState(() => readTripDates())
  const defaults = useMemo(() => defaultTripDates(), [])
  const [start, setStart] = useState(stored?.start ?? defaults.start)
  const [end, setEnd] = useState(stored?.end ?? defaults.end)
  const [categoryFilter, setCategoryFilter] = useState<ProgramCategoryT | null>(null)
  const [sourceFilter, setSourceFilter] = useState<ProgramSourceT | null>(null)
  const { addProgram, hasItem } = useTripPlan()

  const spanOk = /^\d{4}-\d{2}-\d{2}$/.test(start) && /^\d{4}-\d{2}-\d{2}$/.test(end) && end >= start
  const { events, syncedAt, loading, offline, coverage, failure, error, sync } = usePrograms(
    spanOk ? start : null,
    spanOk ? end : null,
  )

  function updateDates(nextStart: string, nextEnd: string) {
    setStart(nextStart)
    // Clamp the window so it stays inside what the API will answer. Only when
    // the start is a real date: clearing the picker fires onChange with '',
    // and addDaysIso('') throws on Invalid Date.
    let boundedEnd = nextEnd
    if (/^\d{4}-\d{2}-\d{2}$/.test(nextStart)) {
      if (nextEnd < nextStart) boundedEnd = nextStart
      const maxEnd = addDaysIso(nextStart, MAX_SPAN_DAYS)
      if (boundedEnd > maxEnd) boundedEnd = maxEnd
    }
    setEnd(boundedEnd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(nextStart) && /^\d{4}-\d{2}-\d{2}$/.test(boundedEnd)) {
      writeTripDates({ start: nextStart, end: boundedEnd })
    }
  }

  // The bundled seasonal almanac merges in client-side: one-day entries (full
  // moons, deadline markers) become ordinary agenda rows, and multi-day
  // windows render as cards above the day list. Ships with the app, so the
  // agenda keeps a floor of content offline with nothing synced.
  const seasonalDays = useMemo(
    () =>
      spanOk
        ? seasonalDaysInRange(start, end).map((ev) => seasonalToProgramEvent(ev, ev.dateStart))
        : [],
    [spanOk, start, end],
  )
  const seasonalWindows = useMemo(
    () => (spanOk ? seasonalWindowsInRange(start, end) : []),
    [spanOk, start, end],
  )
  const allEvents = useMemo(() => {
    if (seasonalDays.length === 0) return events
    return [...events, ...seasonalDays].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1
      const at = a.timeStart ?? '99:99'
      const bt = b.timeStart ?? '99:99'
      if (at !== bt) return at < bt ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }, [events, seasonalDays])

  // Only offer chips for values present in the window; a row of dead filters
  // is noise.
  const presentCategories = useMemo(
    () => [...new Set(allEvents.map((ev) => ev.category))],
    [allEvents],
  )
  const presentSources = useMemo(() => [...new Set(allEvents.map((ev) => ev.source))], [allEvents])

  // A stored filter whose value vanished from the window (dates changed)
  // would hide its own chip while still filtering everything out — a dead-end
  // "Nothing matches" with no visible control to clear it. Ignore such a
  // filter instead of applying it; it re-applies if the value comes back.
  const effectiveCategory =
    categoryFilter && presentCategories.includes(categoryFilter) ? categoryFilter : null
  const effectiveSource =
    sourceFilter && presentSources.includes(sourceFilter) ? sourceFilter : null

  const filtered = useMemo(
    () =>
      allEvents.filter(
        (ev) =>
          (!effectiveCategory || ev.category === effectiveCategory) &&
          (!effectiveSource || ev.source === effectiveSource),
      ),
    [allEvents, effectiveCategory, effectiveSource],
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

  const syncedStale = isOlderThanDays(syncedAt, 7)
  // Only warn about saved listings when some actually exist: offline with an
  // empty cache already renders the "no saved listings" error callout, and
  // stacking "listings were saved earlier" on top of it is a contradiction.
  const showStaleWarning =
    syncedStale || ((offline || coverage !== 'full') && events.length > 0)

  // Row action shared by seasonal windows and program rows: quick-add from
  // the collapsed summary, checkmark link once added.
  function rowAction(inPlan: boolean, title: string, onAdd: () => void) {
    if (inPlan) {
      return (
        <span className="program-row__inplan" aria-label="In your trip plan">
          ✓
        </span>
      )
    }
    return (
      <ChipButton
        variant="action"
        aria-label={`Add ${title} to trip`}
        className="program-row__action"
        onClick={(e) => {
          // A click inside <summary> toggles the row by default;
          // preventDefault keeps the add from expanding it.
          e.preventDefault()
          e.stopPropagation()
          onAdd()
        }}
      >
        + Add
      </ChipButton>
    )
  }

  function rowFooter(inPlan: boolean, onAdd: () => void, url?: string) {
    return (
      <p className="program-row__body program-row__footer">
        {inPlan ? (
          <Button variant="ghost" to="/trip">
            In your trip plan →
          </Button>
        ) : (
          <Button onClick={onAdd}>Add to trip</Button>
        )}
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            Details{offline ? ' (needs signal)' : ''} →
          </a>
        )}
      </p>
    )
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="programs" />
        <PageHeader
          eyebrow="What's on in the park"
          title="Programs during your trip"
          intro="Ranger walks, Junior Ranger tables, Conservancy programs, tours, and star parties, day by day for the dates you pick. Sync while you have signal; the list stays readable in the park without it."
        />

        <div className="programs-dates">
          <label className="field">
            Arriving
            <input
              className="field-control"
              type="date"
              value={start}
              onChange={(e) => updateDates(e.target.value, end)}
            />
          </label>
          <label className="field">
            Leaving
            <input
              className="field-control"
              type="date"
              value={end}
              min={start}
              max={spanOk ? addDaysIso(start, MAX_SPAN_DAYS) : undefined}
              onChange={(e) => updateDates(start, e.target.value)}
            />
          </label>
          <Button onClick={sync} disabled={loading || !spanOk}>
            {loading ? 'Syncing…' : 'Sync now'}
          </Button>
        </div>

        <div className="programs-sync" aria-live="polite">
          {syncedAt ? (
            <span>
              Listings synced {relativeTime(syncedAt)}
              {offline
                ? failure === 'server'
                  ? ' · sync failed, showing listings saved earlier'
                  : ' · showing the copy saved on this device'
                : ''}
            </span>
          ) : (
            <span>Not synced yet. Pick your dates and sync while you have signal.</span>
          )}
        </div>

        {showStaleWarning && (
          <Callout tone="warn">
            {coverage === 'partial'
              ? 'The saved listings only cover part of these dates. Sync again when you have signal.'
              : 'Listings were saved earlier and programs do change. Cross-check the Yosemite Guide or a visitor center bulletin board for cancellations.'}
          </Callout>
        )}
        {error && allEvents.length === 0 && seasonalWindows.length === 0 && (
          <Callout tone="warn">{error}</Callout>
        )}
        {error && (allEvents.length > 0 || seasonalWindows.length > 0) && (
          <Callout tone="warn">
            Live listings did not load. The seasonal almanac below ships with the guide and works
            without signal; sync again for ranger programs and operator events.
          </Callout>
        )}

        {seasonalWindows.length > 0 && (
          <section className="season-windows" aria-label="In season during your dates">
            <div className="programs-day-header">In season during your dates</div>
            {seasonalWindows.map((ev) => {
              const pinDay = ev.dateStart > start ? ev.dateStart : start
              const snapshot = seasonalToProgramEvent(ev, pinDay)
              const inPlan = hasItem(programItemId(snapshot.id))
              const add = () => {
                addProgram(snapshot)
                announceTripAdd(ev.title)
              }
              return (
                <details className="program-row" key={ev.id}>
                  <summary>
                    <span className="program-row__time">{seasonalRangeLabel(ev)}</span>
                    <span>
                      <h2 className="program-row__title">{ev.title}</h2>
                      <span className="program-row__meta">
                        {ev.location && <span>{ev.location}</span>}
                        <Chip variant="badge">
                          {ev.confidence === 'typical' ? 'Typical window' : 'Confirmed'}
                        </Chip>
                      </span>
                    </span>
                    {rowAction(inPlan, ev.title, add)}
                  </summary>
                  <p className="program-row__body">{ev.description}</p>
                  {rowFooter(inPlan, add, ev.url)}
                </details>
              )
            })}
          </section>
        )}

        {allEvents.length > 0 && (
          <div className="programs-chips" role="group" aria-label="Filter programs">
            {presentCategories.map((cat) => (
              <ChipButton
                key={cat}
                variant="filter"
                pressed={effectiveCategory === cat}
                onClick={() => setCategoryFilter(effectiveCategory === cat ? null : cat)}
              >
                {CATEGORY_LABELS[cat]}
              </ChipButton>
            ))}
            {presentSources.length > 1 &&
              presentSources.map((src) => (
                <ChipButton
                  key={src}
                  variant="filter"
                  pressed={effectiveSource === src}
                  onClick={() => setSourceFilter(effectiveSource === src ? null : src)}
                >
                  {SOURCE_LABELS[src]}
                </ChipButton>
              ))}
          </div>
        )}

        {loading && allEvents.length === 0 && <ProgramsSkeleton />}

        {byDay.length === 0 && !loading && allEvents.length === 0 && !error && (
          <EmptyState note="Nothing listed for these dates yet. Programs post seasonally; sync again closer to your trip, and check the Yosemite Guide PDF for the printed schedule." />
        )}
        {byDay.length === 0 && allEvents.length > 0 && (
          <EmptyState note="Nothing matches the current filters." />
        )}

        {byDay.map(([date, dayEvents]) => (
          <section key={date} aria-label={formatDayHeader(date)}>
            <div className="programs-day-header">{formatDayHeader(date)}</div>
            {dayEvents.map((ev) => {
              const inPlan = hasItem(programItemId(ev.id))
              const add = () => {
                addProgram(ev)
                announceTripAdd(ev.title)
              }
              return (
                <details className="program-row" key={ev.id}>
                  <summary>
                    <span className="program-row__time">{formatTime(ev.timeStart)}</span>
                    <span>
                      <h2 className="program-row__title">{ev.title}</h2>
                      <span className="program-row__meta">
                        {ev.location && <span>{ev.location}</span>}
                        <span>{SOURCE_LABELS[ev.source]}</span>
                        {ev.isFree === true && <Chip variant="badge">Free</Chip>}
                        {ev.reservationRequired === true && <Chip variant="badge">Reservation</Chip>}
                      </span>
                    </span>
                    {rowAction(inPlan, ev.title, add)}
                  </summary>
                  <p className="program-row__body">
                    {ev.description || 'No description published for this program.'}
                    {ev.timeEnd && `\nEnds around ${formatTime(ev.timeEnd)}.`}
                  </p>
                  {rowFooter(inPlan, add, ev.url)}
                </details>
              )
            })}
          </section>
        ))}

        <p className="page-footnote">
          Program listings sourced from the National Park Service, with Yosemite Conservancy,
          Yosemite Hospitality, and astronomy-club schedules added by hand. The seasonal almanac
          (full moons, road opening patterns, waterfall windows) ships with the guide; entries
          marked "typical window" describe a historical pattern, not a published date. Listings
          change; the operators' own pages are authoritative.
        </p>
      </main>
    </GatedChrome>
  )
}
