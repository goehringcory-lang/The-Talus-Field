// =============================================================================
// /trip — the day-by-day plan built from stops and programs, finalized into
// a calendar as one .ics file. The page reads as a guided sequence: pick
// dates, fill the days, then review the exact events and create them.
// Times: programs keep their published times, stops the user timed keep
// those, everything else is auto-slotted greedily (see trip/slotting.ts).
// Works fully offline: content is bundled, program items carry snapshots,
// and ICS generation is client-side.
// =============================================================================

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import TripReview from '../components/TripReview'
import Button from '../components/ui/Button'
import { ChipButton } from '../components/ui/Chip'
import PageHeader from '../components/ui/PageHeader'
import { getStopById } from '../content'
import { ITINERARIES, type ItineraryKey } from '../content/itineraries'
import { getStopsByRegion } from '../content'
import { MAX_SPAN_DAYS, readTripDates } from '../programs/usePrograms'
import { addDaysIso, formatClock, formatDayHeader } from '../utils/date'
import { exportTripIcs, type ExportMethod } from '../trip/exportTrip'
import { buildTripIcs } from '../trip/ics'
import { driveMinutesBetween, slotPlan, toHhmm, type SlottedItem } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import './Trip.css'

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="trip-step">
      <span className="trip-step__num" aria-hidden="true">
        {n}
      </span>
      <h2 className="trip-step__title">{title}</h2>
    </div>
  )
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

// Between two placed rows, the estimated drive. Rendered only when both
// sides carry coordinates and the estimate is meaningful.
function TransitRow({ prev, cur }: { prev: SlottedItem; cur: SlottedItem }) {
  if (prev.startMin === null || cur.startMin === null) return null
  const min = driveMinutesBetween(prev.item, cur.item)
  if (min === null) return null
  return (
    <div className="trip-transit">
      <span className="trip-transit__line" aria-hidden="true" />
      <span className="trip-transit__label">
        {min === 0 ? 'Same parking area' : `~${min} min drive`}
      </span>
    </div>
  )
}

export default function Trip() {
  const { plan, addStop, removeItem, setStopTime, moveStopToDay, clear, setDates } = useTripPlan()
  const [exportResult, setExportResult] = useState<ExportMethod | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const reviewRef = useRef<HTMLDivElement>(null)

  // Keep the plan window in step with the dates picked on /programs.
  useEffect(() => {
    const picked = readTripDates()
    if (picked && (picked.start !== plan.dates.start || picked.end !== plan.dates.end)) {
      setDates(picked.start, picked.end)
    }
  }, [plan.dates.start, plan.dates.end, setDates])

  const slotted = useMemo(() => slotPlan(plan.items), [plan])
  const windowDays = daysInWindow(plan.dates.start, plan.dates.end)

  function toggleReview() {
    setExportResult(null)
    const opening = !reviewOpen
    setReviewOpen(opening)
    if (opening) reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function onCreateEvents() {
    setExporting(true)
    try {
      // Build synchronously before the await: iOS only allows the share
      // sheet inside the user-gesture task.
      const ics = buildTripIcs(slotted)
      setExportResult(await exportTripIcs(ics, `yosemite-trip-${plan.dates.start}.ics`))
    } finally {
      setExporting(false)
    }
  }

  // Seed a preset day only up to what a day can actually hold (08:00-21:00
  // with travel buffers); dumping a whole region onto one date used to bury
  // the plan in overflow warnings.
  const DAY_CAPACITY_MIN = 13 * 60
  function seedItinerary(key: ItineraryKey) {
    const days = ITINERARIES[key].days
    days.forEach((day, i) => {
      const date = windowDays[Math.min(i, windowDays.length - 1)]
      let budget = 0
      for (const region of day.regions) {
        for (const stop of getStopsByRegion(region)) {
          if (stop.kind === 'lodging') continue
          const cost = (stop.timeBudgetMin ?? 60) + 30
          if (budget + cost > DAY_CAPACITY_MIN) continue
          budget += cost
          addStop(stop.id, date)
        }
      }
    })
  }

  const itemCount = plan.items.length

  // Same clamp as /programs: end never before start, window capped at what
  // the programs API will answer. Both pages share tfg.trip.dates.
  function updateDates(nextStart: string, nextEnd: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nextStart)) return
    let boundedEnd = nextEnd
    if (boundedEnd < nextStart) boundedEnd = nextStart
    if (boundedEnd > addDaysIso(nextStart, MAX_SPAN_DAYS)) boundedEnd = addDaysIso(nextStart, MAX_SPAN_DAYS)
    if (/^\d{4}-\d{2}-\d{2}$/.test(boundedEnd)) setDates(nextStart, boundedEnd)
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="trip" />
        <PageHeader
          eyebrow="Plan your days"
          title="Your trip plan"
          intro="Set your dates, then fill the days: programs from the list, stops from their pages or the map. When the plan is final, review it and put it on your calendar."
        />

        <StepHeader n={1} title="Pick your dates" />
        <div className="trip-dates">
          <label className="field">
            Arriving
            <input
              className="field-control"
              type="date"
              value={plan.dates.start}
              onChange={(e) => updateDates(e.target.value, plan.dates.end)}
            />
          </label>
          <label className="field">
            Leaving
            <input
              className="field-control"
              type="date"
              value={plan.dates.end}
              min={plan.dates.start}
              max={addDaysIso(plan.dates.start, MAX_SPAN_DAYS)}
              onChange={(e) => updateDates(plan.dates.start, e.target.value)}
            />
          </label>
          <Button variant="ghost" to="/programs">
            Browse programs running these dates →
          </Button>
        </div>

        <StepHeader n={2} title="Fill your days" />
        <div className="trip-toolbar">
          {itemCount === 0 && (
            <>
              <span className="trip-toolbar__label">Start from a preset:</span>
              {(Object.keys(ITINERARIES) as ItineraryKey[]).map((key) => (
                <ChipButton key={key} variant="action" onClick={() => seedItinerary(key)}>
                  {ITINERARIES[key].label}
                </ChipButton>
              ))}
            </>
          )}
          {itemCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear plan
            </Button>
          )}
        </div>

        {itemCount === 0 ? (
          <div className="trip-empty">
            <p style={{ margin: '0 0 10px' }}>Nothing planned yet. How this works:</p>
            <ol>
              <li>Set your dates above.</li>
              <li>
                Add programs from the <Link to="/programs">Programs list</Link>: ranger walks,
                tours, star parties.
              </li>
              <li>
                Add stops from their pages or the <Link to="/map">map</Link>, or seed a day from
                a preset above.
              </li>
              <li>
                Finalize the plan below to put it on your calendar. Events carry GPS coordinates
                and a directions link, so tapping an event on the day launches navigation.
              </li>
            </ol>
            <p style={{ margin: '10px 0 0' }}>The plan lives on this device and works offline.</p>
          </div>
        ) : (
          [...slotted.entries()].map(([day, items]) => {
            const totalMin = items.reduce((sum, s) => sum + (s.startMin !== null ? s.durationMin : 0), 0)
            // Fixed items without a slot are untimed programs: deliberately
            // all-day, not a scheduling failure.
            const overflow = items.filter((s) => s.startMin === null && !s.fixed)
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
                {items.map((s, i) => {
                  const { item } = s
                  const isStop = item.type === 'stop'
                  const stop = isStop ? getStopById(item.stopId) : undefined
                  const title = isStop ? stop?.title ?? item.stopId : item.snapshot.title
                  const link = isStop ? `/stop/${item.stopId}` : undefined
                  return (
                    <Fragment key={item.itemId}>
                      {i > 0 && <TransitRow prev={items[i - 1]} cur={s} />}
                      <div className="trip-item">
                        <div className="trip-item__time">
                          {isStop ? (
                            <>
                              <input
                                className="field-control field-control--sm"
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
                                className="field-control field-control--sm"
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
                    </Fragment>
                  )
                })}
                {overflow.length > 0 && (
                  <p className="trip-overflow">
                    {overflow.length} {overflow.length === 1 ? 'item doesn’t' : 'items don’t'} fit
                    in this day before 9 p.m. Move something to another day, set times by hand, or
                    resolve it in Review &amp; finalize below. Unresolved items land on the calendar
                    as all-day events.
                  </p>
                )}
              </section>
            )
          })
        )}

        <div ref={reviewRef} style={{ scrollMarginTop: 24 }}>
          <StepHeader n={3} title="Review & finalize" />
          <Button disabled={itemCount === 0} onClick={toggleReview}>
            {reviewOpen ? 'Hide review' : 'Finalize trip'}
          </Button>
          {itemCount === 0 && (
            <p className="trip-step__hint">
              Add at least one stop or program first. The calendar events are built from your
              days above.
            </p>
          )}
          {reviewOpen && itemCount > 0 && (
            <TripReview
              slotted={slotted}
              windowDays={windowDays}
              exportResult={exportResult}
              exporting={exporting}
              onCreate={onCreateEvents}
            />
          )}
        </div>

        <p className="page-footnote">
          Times are suggestions built from each stop's time budget plus a travel buffer estimated
          from the driving distance between stops; programs keep their published times. Everything
          here works offline once added.
        </p>
      </main>
    </GatedChrome>
  )
}
