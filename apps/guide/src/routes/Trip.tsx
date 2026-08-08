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
import { Link, useSearchParams } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import ResponsivePhoto from '../components/ResponsivePhoto'
import TripAgenda from '../components/TripAgenda'
import TripReview from '../components/TripReview'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import { getItineraryDayPhotos } from '../content'
import { ITINERARIES, ITINERARY_KEYS, resolvePlanEntry, type ItineraryKey } from '../content/itineraries'
import { getStopsByRegion } from '../content'
import { MAX_SPAN_DAYS, readTripDates, usePrograms } from '../programs/usePrograms'
import { addDaysIso, formatDayHeader, todayIso } from '../utils/date'
import { prefersReducedMotion } from '../utils/motion'
import BackupPlans from '../trip/BackupPlans'
import { pickProgramsForDay } from '../trip/seedPrograms'
import { slotPlan } from '../trip/slotting'
import {
  clearPendingImport,
  importSummary,
  parseImportParam,
  resolveEditorialIds,
} from '../trip/importTrip'
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

// Throwing away a hand-arranged board is the one destructive tap on this page,
// and both buttons that can do it (clear, and reseeding from a preset) arm
// before they fire: the first tap turns the button into an explicit question,
// the second answers it. The same element carries both states, so a keyboard
// user keeps focus through the change; a short guard after arming swallows the
// second half of a double-tap, which is the accident this is here to prevent.
// It disarms on Escape, on a tap outside `scope`, and on its own after a few
// seconds of nothing. Deliberately not window.confirm: in-app browsers
// (Instagram, Facebook) suppress it, and a suppressed confirm reads as true.
const ARM_GUARD_MS = 400
const DISARM_AFTER_MS = 6000

function useArmToConfirm<T>(scope: string) {
  const [armed, setArmed] = useState<T | null>(null)
  const armedAt = useRef(0)

  useEffect(() => {
    if (armed === null) return
    const timer = window.setTimeout(() => setArmed(null), DISARM_AFTER_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArmed(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest(scope)) setArmed(null)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [armed, scope])

  /** True when this press is the confirming one; arming otherwise. */
  function press(key: T): boolean {
    if (armed !== key) {
      armedAt.current = Date.now()
      setArmed(key)
      return false
    }
    if (Date.now() - armedAt.current < ARM_GUARD_MS) return false
    setArmed(null)
    return true
  }

  return { armed, press, disarm: () => setArmed(null) }
}

function ClearPlanButton({ itemCount, onClear }: { itemCount: number; onClear: () => void }) {
  const confirm = useArmToConfirm<'clear'>('.trip-clear')
  const armed = confirm.armed === 'clear'
  const noun = itemCount === 1 ? 'item' : 'items'

  return (
    <div className="trip-clear">
      <Button
        variant="danger"
        size="sm"
        className={armed ? 'trip-clear__btn is-armed' : 'trip-clear__btn'}
        onClick={() => {
          if (confirm.press('clear')) onClear()
        }}
      >
        {armed ? `Yes, clear all ${itemCount} ${noun}` : 'Clear plan'}
      </Button>
      {armed && (
        <>
          <Button variant="quiet" size="sm" onClick={confirm.disarm}>
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
  const { plan, addStop, addHike, addProgram, addCustom, clear, setDates } = useTripPlan()
  const [reviewOpen, setReviewOpen] = useState(false)
  const reviewRef = useRef<HTMLDivElement>(null)

  // Trip hand-off from the editorial map (/map?trip=… → /trip?import=…). The
  // URL is the only trigger: a stash left over from before the purchase is
  // *offered* on Home and arrives here as a real ?import= once tapped, so a
  // plan is never rewritten by something the user didn't just ask for.
  //
  // Resolving is pure and happens once, at mount, so the notice is ordinary
  // initial state; the effect below only writes to the plan store and strips
  // the param, which is the kind of work an effect is for. The ref guards
  // StrictMode's double-invoke, and stripping the param means a refresh can't
  // re-run the import. Items merge rather than replace: addStop/addHike dedupe
  // by itemId, so importing the same trip twice is a no-op.
  const [searchParams, setSearchParams] = useSearchParams()
  const [importState, setImportState] = useState(() => {
    const ids = parseImportParam(searchParams.get('import'))
    const result = ids.length > 0 ? resolveEditorialIds(ids) : null
    return { result, notice: result ? importSummary(result) : null }
  })
  const imported = useRef(false)

  // Keep the plan window in step with the dates picked on /programs. Declared
  // before the import effect below on purpose: effects run in declaration
  // order, setDates updates the module-state plan synchronously, and the
  // import's addStop clamps to the plan's start date — so with the stored
  // plan's stale window still in place, an imported trip would land on the
  // old start day, get carried "outside your dates" when the window moved,
  // and contradict the notice that everything landed on the first day.
  useEffect(() => {
    const picked = readTripDates()
    if (picked && (picked.start !== plan.dates.start || picked.end !== plan.dates.end)) {
      setDates(picked.start, picked.end)
    }
  }, [plan.dates.start, plan.dates.end, setDates])

  useEffect(() => {
    const result = importState.result
    if (!result || imported.current) return
    imported.current = true
    for (const id of result.stopIds) addStop(id)
    for (const id of result.hikeIds) addHike(id)
    // Whichever trip just landed supersedes the pending one, so Home stops
    // offering a hand-off the user has now taken.
    clearPendingImport()
    const next = new URLSearchParams(searchParams)
    next.delete('import')
    setSearchParams(next, { replace: true })
  }, [importState, searchParams, setSearchParams, addStop, addHike])

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
    // A scripted smooth scroll animates whatever the CSS says, so the reduced
    // motion preference has to be read here.
    if (opening) {
      reviewRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }

  // The program listings for the trip window, so a preset day that names
  // program categories can seed the real events running that date. Programs
  // are garnish here the way weather is above: still loading, offline with
  // no cache, or nothing running simply seeds the stops alone.
  const programs = usePrograms(plan.dates.start, plan.dates.end)

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
      // A curated day is the recommended sequence in drive order, stops and
      // hikes interleaved; a day without one falls back to the full region
      // reading sequence, which makes a poor plan (see itineraries.ts).
      const candidates: string[] = day.plan
        ? day.plan
        : day.regions.flatMap((region) => getStopsByRegion(region).map((s) => s.id))
      let budget = 0
      for (const id of candidates) {
        const entry = resolvePlanEntry(id)
        if (!entry) continue
        if (entry.kind === 'hike') {
          const cost = entry.hike.durationMin + 30
          if (budget + cost > DAY_CAPACITY_MIN) continue
          budget += cost
          addHike(entry.hike.id, date)
          continue
        }
        // Lodging is not a day activity, and parking pins are navigation
        // aids for another stop, not stops of their own.
        const { stop } = entry
        if (stop.kind === 'lodging' || stop.kind === 'parking') continue
        const cost = (stop.timeBudgetMin ?? 60) + 30
        if (budget + cost > DAY_CAPACITY_MIN) continue
        budget += cost
        addStop(stop.id, date)
      }
      // Program picks keep their published times and slot around the stops,
      // so they sit outside the capacity budget. addProgram snapshots the
      // event into the plan, same as adding it from /programs by hand.
      for (const ev of pickProgramsForDay(
        programs.events,
        date,
        day.programCategories ?? [],
        day.regions,
      )) {
        addProgram(ev)
      }
    })
  }

  const itemCount = plan.items.length

  // Seeding over a non-empty plan replaces it; that is a destructive tap and
  // arms before it fires, on the card itself. Empty plans seed straight away.
  const replaceConfirm = useArmToConfirm<ItineraryKey>('.trip-presets')
  function reseedItinerary(key: ItineraryKey) {
    if (itemCount === 0) {
      seedItinerary(key)
      return
    }
    if (!replaceConfirm.press(key)) return
    clear()
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

        {importState.notice && (
          <Callout
            action={
              <Button
                variant="quiet"
                size="sm"
                onClick={() => setImportState((s) => ({ ...s, notice: null }))}
              >
                Dismiss
              </Button>
            }
          >
            {importState.notice} Everything landed on your first day; drag blocks onto the days
            you want them.
          </Callout>
        )}

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
                {ITINERARY_KEYS.map((key) => {
                  const armed = replaceConfirm.armed === key
                  return (
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
                      <span className="trip-preset__label">
                        {armed
                          ? `Replace your ${itemCount} planned ${itemCount === 1 ? 'item' : 'items'}?`
                          : ITINERARIES[key].label}
                      </span>
                      <span className="trip-preset__sub">
                        {armed
                          ? `Tap again to start over from ${ITINERARIES[key].label}. Anything else cancels.`
                          : ITINERARIES[key].subtitle}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <BackupPlans />

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
            The board above is the plan and it works offline on its own. This step saves it as a
            calendar file you import once: events carry GPS coordinates and a directions link, so
            tapping one on the day launches navigation.
          </p>
          <Button disabled={itemCount === 0} onClick={toggleReview}>
            {reviewOpen ? 'Hide review' : 'Review & save the calendar file'}
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
