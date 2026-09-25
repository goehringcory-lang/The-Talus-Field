// "Your days in the park": the front page's second question, right under the
// Park Now readout. Before dates are set it asks for them (the planner is
// built on them: programs, light, roads). After, it lists each day with the
// regions already on it, how much is planned, and that date's sunrise and
// sunset, and each day opens the planner for its region. It replaced the
// one-line trip strip, which could say "3 items" but not which day held them.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { REGION_SHORT, type Region } from '../content'
import { readTripDates } from '../programs/usePrograms'
import { sunTimes } from '../sun/solar'
import { regionForItem } from '../trip/driveTimes'
import type { TripItemT } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, formatClock, tripDatesLabel } from '../utils/date'
import TripDatesForm from './TripDatesForm'
import './PlanCards.css'

// The front page shows a week; a longer trip is on the board.
const MAX_ROWS = 7

function itemDay(item: TripItemT): string {
  return item.type === 'program' ? item.snapshot.date : item.day
}

function weekdayShort(date: string): { weekday: string; short: string } {
  const d = new Date(`${date}T12:00:00Z`)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    short: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
  }
}

export default function TripDaysCard() {
  const { plan } = useTripPlan()
  const [editing, setEditing] = useState(false)
  const hasDates = readTripDates() !== null

  if (!hasDates || editing) {
    return (
      <section className="days-card" aria-label="Your dates">
        <div className="days-card__ask">
          <span className="eyebrow eyebrow--moss">{editing ? 'Change your dates' : 'Step one'}</span>
          <h2 className="days-card__title">When are you in the park?</h2>
          <p className="days-card__note">
            Everything after this is built for your dates: the programs running those days, each day’s sunrise and
            sunset, and which roads are usually open.
          </p>
          <TripDatesForm onSet={() => setEditing(false)} />
          {editing && (
            <button type="button" className="days-card__cancel" onClick={() => setEditing(false)}>
              Keep {tripDatesLabel(plan.dates)}
            </button>
          )}
        </div>
      </section>
    )
  }

  const days: string[] = []
  for (let d = plan.dates.start; d <= plan.dates.end && days.length < 62; d = addDaysIso(d, 1)) days.push(d)

  return (
    <section className="days-card" aria-label="Your days in the park">
      <div className="days-card__head">
        <div>
          <span className="eyebrow eyebrow--moss">Your days in the park</span>
          <h2 className="days-card__title">{tripDatesLabel(plan.dates)}</h2>
        </div>
        <button type="button" className="days-card__change" onClick={() => setEditing(true)}>
          Change
        </button>
      </div>
      <ol className="days-card__list">
        {days.slice(0, MAX_ROWS).map((d, i) => {
          const items = plan.items.filter((it) => itemDay(it) === d)
          const regions = [...new Set(items.map(regionForItem).filter((r): r is Region => r !== null))]
          const sun = sunTimes(d)
          const label = weekdayShort(d)
          const to = regions.length ? `/region/${regions[0]}/plan?day=${d}` : '#plan-regions'
          const body = (
            <>
              <span className="days-card__day">
                <span className="days-card__num">Day {i + 1}</span>
                <span className="days-card__weekday">{label.weekday}</span>
              </span>
              <span className="days-card__main">
                <span className="days-card__where">
                  {regions.length ? regions.map((r) => REGION_SHORT[r]).join(', then ') : 'Pick a region below'}
                </span>
                <span className="dateline">
                  {label.short}
                  {items.length > 0 ? ` · ${items.length} planned` : ''}
                  {sun ? ` · sunrise ${formatClock(sun.sunriseMin)} · sunset ${formatClock(sun.sunsetMin)}` : ''}
                </span>
              </span>
              <svg className="days-card__go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </>
          )
          return (
            <li key={d}>
              {to.startsWith('#') ? (
                <a className="days-card__row" href={to}>
                  {body}
                </a>
              ) : (
                <Link className="days-card__row" to={to}>
                  {body}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      {days.length > MAX_ROWS && (
        <p className="days-card__more">
          And {days.length - MAX_ROWS} more {days.length - MAX_ROWS === 1 ? 'day' : 'days'} on the trip board.
        </p>
      )}
      <Link className="days-card__board" to="/trip">
        <span>Open the whole trip</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
