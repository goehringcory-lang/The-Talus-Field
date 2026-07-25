// =============================================================================
// /trip — the trip plan, drawn as a calendar board (components/TripAgenda).
// The board is the page: full-width day timelines, blocks scaled by how long
// a thing takes and colored by what it is, dragged around by hand. The date
// pickers and the "add to your days" tools sit above it as a thin strip, and
// the calendar export sits below it as the last step rather than the point.
// Times: programs keep their published times, anything the user placed keeps
// that placement, everything else is auto-slotted greedily (trip/slotting.ts).
// Works fully offline: content is bundled, program items carry snapshots, the
// plan is localStorage, and ICS generation is client-side.
// =============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import ResponsivePhoto from '../components/ResponsivePhoto'
import TripAgenda from '../components/TripAgenda'
import TripReview from '../components/TripReview'
import Button from '../components/ui/Button'
import { getItineraryDayPhotos, getStopById, type StopT } from '../content'
import { ITINERARIES, ITINERARY_KEYS, type ItineraryKey } from '../content/itineraries'
import { getStopsByRegion } from '../content'
import { MAX_SPAN_DAYS, readTripDates } from '../programs/usePrograms'
import { addDaysIso, formatDayHeader, todayIso } from '../utils/date'
import { slotPlan } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { dayForecastRegion } from '../trip/dayRegion'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from '../weather/staleness'
import { forecastLineForDay } from '../weather/todayLine'
import './Trip.css'

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

// Free-form entry form: the parts of a trip the guide doesn't model (lodging
// check-in, a dinner reservation, a permit pickup) so the board, and the
// exported calendar, can be the whole trip rather than a fragment of it.
function AddCustomRow({
  windowDays,
  onAdd,
}: {
  windowDays: string[]
  onAdd: (title: string, day: string) => void
}) {
  const [title, setTitle] = useState('')
  const [day, setDay] = useState('')
  const effectiveDay = windowDays.includes(day) ? day : windowDays[0] ?? ''
  return (
    <form
      className="trip-custom-add"
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim() || !effectiveDay) return
        onAdd(title, effectiveDay)
        setTitle('')
      }}
    >
      <label className="trip-custom-add__label" htmlFor="trip-custom-title">
        Add your own item: a dinner reservation, a rest stop, a permit pickup.
      </label>
      <div className="trip-custom-add__row">
        <input
          id="trip-custom-title"
          className="field-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dinner at the Mountain Room"
          maxLength={120}
        />
        <select
          className="field-control field-control--sm"
          value={effectiveDay}
          onChange={(e) => setDay(e.target.value)}
          aria-label="Day for your item"
        >
          {windowDays.map((d) => (
            <option key={d} value={d}>
              {formatDayHeader(d)}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--sm" disabled={!title.trim()}>
          Add
        </button>
      </div>
    </form>
  )
}

// Clearing the board throws away work that took real planning, and the button
// sits a thumb's width from the board itself, so it arms before it fires: the
// first tap turns it into an explicit "yes, clear all N" and a way out. The
// same element carries both states, so a keyboard user keeps focus through the
// change; a short guard after arming swallows the second half of a double-tap,
// which is the accident this is here to prevent. It disarms on Escape, on a
// tap anywhere else, and on its own after a few seconds of nothing.
const ARM_GUARD_MS = 400
const DISARM_AFTER_MS = 6000

function ClearPlanButton({ itemCount, onClear }: { itemCount: number; onClear: () => void }) {
  const [armed, setArmed] = useState(false)
  const armedAt = useRef(0)

  useEffect(() => {
    if (!armed) return
    const timer = window.setTimeout(() => setArmed(false), DISARM_AFTER_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArmed(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest('.trip-clear')) setArmed(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [armed])

  const noun = itemCount === 1 ? 'item' : 'items'

  return (
    <div className="trip-clear">
      <Button
        variant="danger"
        size="sm"
        className={armed ? 'trip-clear__btn is-armed' : 'trip-clear__btn'}
        onClick={() => {
          if (!armed) {
            armedAt.current = Date.now()
            setArmed(true)
            return
          }
          if (Date.now() - armedAt.current < ARM_GUARD_MS) return
          setArmed(false)
          onClear()
        }}
      >
        {armed ? `Yes, clear all ${itemCount} ${noun}` : 'Clear plan'}
      </Button>
      {armed && (
        <>
          <Button variant="quiet" size="sm" onClick={() => setArmed(false)}>
            Keep it
          </Button>
          <span className="trip-clear__warn" role="status">
            This cannot be undone.
          </span>
        </>
      )}
    </div>
  )
}

export default function Trip() {
  const { plan, addStop, addCustom, clear, setDates } = useTripPlan()
  const [reviewOpen, setReviewOpen] = useState(false)
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

  // One forecast for the whole page. Garnish, never an error: days beyond the
  // NWS window or past the staleness ceiling simply render no line.
  const weather = useWeather()
  const showForecast = !weather.loading && weather.spots.length > 0 && weather.ageMs <= HIDE_AFTER_MS
  const staleForecast = showForecast && weather.ageMs > WARN_AFTER_MS
  const dayForecasts = useMemo(() => {
    const lines = new Map<string, string>()
    if (!showForecast) return lines
    for (const [day, items] of slotted) {
      const line = forecastLineForDay(
        weather.spots,
        dayForecastRegion(items.map((s) => s.item)),
        day,
      )
      if (line) lines.set(day, line)
    }
    return lines
  }, [slotted, weather.spots, showForecast])

  function toggleReview() {
    const opening = !reviewOpen
    setReviewOpen(opening)
    if (opening) reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Seed a preset day only up to what a day can actually hold (08:00-21:00
  // with travel buffers); dumping a whole region onto one date used to bury
  // the plan in overflow warnings.
  const DAY_CAPACITY_MIN = 13 * 60
  function seedItinerary(key: ItineraryKey) {
    // Preset days beyond the picked window are not seeded. Collapsing them
    // onto the last date used to grant each its own capacity budget and
    // produce a single impossible day.
    const days = ITINERARIES[key].days.slice(0, windowDays.length)
    days.forEach((day, i) => {
      const date = windowDays[i]
      // A curated day is the recommended plan in drive order; a day without
      // one falls back to the full region reading sequence.
      const candidates = day.stops
        ? day.stops.map((id) => getStopById(id)).filter((s): s is StopT => !!s && 'region' in s)
        : day.regions.flatMap((region) => getStopsByRegion(region))
      let budget = 0
      for (const stop of candidates) {
        // Lodging is not a day activity, and parking pins are navigation
        // aids for another stop, not stops of their own.
        if (stop.kind === 'lodging' || stop.kind === 'parking') continue
        const cost = (stop.timeBudgetMin ?? 60) + 30
        if (budget + cost > DAY_CAPACITY_MIN) continue
        budget += cost
        addStop(stop.id, date)
      }
    })
  }

  const itemCount = plan.items.length

  // Seeding over a non-empty plan replaces it; that is a destructive tap and
  // asks first. Empty plans seed straight away, as before.
  function reseedItinerary(key: ItineraryKey) {
    if (itemCount > 0) {
      const ok = window.confirm(
        `Replace the current plan? This clears your ${itemCount} planned ${
          itemCount === 1 ? 'item' : 'items'
        }.`,
      )
      if (!ok) return
      clear()
    }
    seedItinerary(key)
  }

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
      <main className="wrap page trip-page">
        <PlanTabs active="trip" />

        <header className="trip-head">
          <div>
            <p className="eyebrow">Plan your days</p>
            <h1 className="trip-head__title">Your trip plan</h1>
          </div>
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
          </div>
        </header>

        <details className="trip-add" open={itemCount === 0}>
          <summary className="trip-add__summary">
            {itemCount === 0 ? 'Fill your days' : 'Add to your days'}
          </summary>
          <div className="trip-add__body">
            <p className="trip-add__links">
              Add a day hike from the <Link to="/hikes">trail list</Link>, a ranger walk or star
              party from the <Link to="/programs">program list</Link>, or a stop from its own page
              or the <Link to="/map">map</Link>. Everything you add lands on the board below, where
              you can drag it into place.
            </p>

            <div className="trip-presets" role="group" aria-label="Start from a preset">
              <span className="trip-presets__label">
                {itemCount === 0 ? 'Start from a preset:' : 'Start over from a preset:'}
              </span>
              <div className="trip-presets__row">
                {ITINERARY_KEYS.map((key) => (
                  <button
                    type="button"
                    key={key}
                    className="trip-preset"
                    onClick={() => reseedItinerary(key)}
                  >
                    {/* One thumbnail per day (the day's lead-region photo), so
                        the strip's length reads as the plan's length. */}
                    <span className="trip-preset__photos" aria-hidden="true">
                      {getItineraryDayPhotos(ITINERARIES[key]).map((photo, i) => (
                        <span className="trip-preset__media" key={i}>
                          <ResponsivePhoto src={photo.src} alt="" width={400} height={400} sizes="64px" />
                        </span>
                      ))}
                    </span>
                    <span className="trip-preset__label">{ITINERARIES[key].label}</span>
                    <span className="trip-preset__sub">{ITINERARIES[key].subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            <AddCustomRow windowDays={windowDays} onAdd={(title, day) => addCustom(title, { day })} />

            {itemCount > 0 && (
              <div className="trip-toolbar">
                <Button variant="ghost" size="sm" to="/programs">
                  Programs running your dates →
                </Button>
              </div>
            )}
          </div>
        </details>

        {/* Board strip: what is on the plan, and the one action that empties
            it. It lives out here rather than inside the add panel, which is
            collapsed once a plan exists, so the way out is always in view. */}
        {itemCount > 0 && (
          <div className="trip-boardbar">
            <p className="trip-boardbar__count">
              <strong>{itemCount}</strong> {itemCount === 1 ? 'item' : 'items'} on your board
            </p>
            <ClearPlanButton itemCount={itemCount} onClear={clear} />
          </div>
        )}

        {windowDays.includes(todayIso()) && (
          <Link to="/today" className="more-link trip-today-link">
            Today's schedule, at a glance →
          </Link>
        )}

        <TripAgenda slotted={slotted} windowDays={windowDays} dayForecasts={dayForecasts} />

        <div ref={reviewRef} className="trip-export" style={{ scrollMarginTop: 24 }}>
          <h2 className="trip-export__title">Put it on your calendar</h2>
          <p className="trip-export__intro">
            The board above is the plan and it works offline on its own. This step copies it into
            the calendar app you already carry: events carry GPS coordinates and a directions link,
            so tapping one on the day launches navigation.
          </p>
          <Button disabled={itemCount === 0} onClick={toggleReview}>
            {reviewOpen ? 'Hide review' : 'Review & add to calendar'}
          </Button>
          {itemCount === 0 && (
            <p className="trip-step__hint">
              Add at least one stop, hike, or program first. The calendar events are built from
              the board above.
            </p>
          )}
          {reviewOpen && itemCount > 0 && (
            <TripReview
              slotted={slotted}
              windowDays={windowDays}
              filenameDate={plan.dates.start}
              dayForecasts={dayForecasts}
            />
          )}
        </div>

        <p className="page-footnote">
          Times you haven't set yourself are suggestions built from each stop's time budget plus a
          travel buffer estimated from the driving distance between stops; programs keep their
          published times. Drag a block and it stays where you put it. Everything here is stored on
          this device and works offline.
          {staleForecast &&
            ' The forecasts shown are old; they refresh the next time you open the app online.'}
        </p>
      </main>
    </GatedChrome>
  )
}
