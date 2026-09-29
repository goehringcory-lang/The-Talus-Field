// "Your trip": the front page's second question, right under the Park Now
// card. Before dates are set it asks for them (the planner is built on them:
// programs, light, roads). After, it heads the trip ("Oct 3 to 5, three days")
// and lists each day with the regions already on it and how much is planned;
// each day opens the planner for its region, and a day with nothing on it says
// so and points at the regions below. It replaced the one-line trip strip,
// which could say "3 items" but not which day held them.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Region } from '../content'
import { readTripDates } from '../programs/usePrograms'
import { regionForItem } from '../trip/driveTimes'
import type { TripItemT } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, tripDatesLabel, tripHeadline } from '../utils/date'
import TripDatesForm from './TripDatesForm'
import './PlanCards.css'

// The front page shows a week; a longer trip is on the board.
const MAX_ROWS = 7

// How a day row names a region: the full name, not the chip-length one.
const REGION_ROW_NAME: Record<Region, string> = {
  valley: 'Yosemite Valley',
  'glacier-mariposa': 'Glacier Point & Mariposa',
  tuolumne: 'Tuolumne Meadows',
  'hetch-hetchy': 'Hetch Hetchy',
}

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
          <span className="days-card__eyebrow">{editing ? 'Change your dates' : 'Your trip'}</span>
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
    <section className="days-card" aria-labelledby="days-card-title">
      <span className="days-card__eyebrow">Your trip</span>
      <div className="days-card__head">
        <h2 className="days-card__title" id="days-card-title">
          {tripHeadline(plan.dates)}
        </h2>
        <button type="button" className="days-card__change" onClick={() => setEditing(true)}>
          Change
        </button>
      </div>
      <ol className="days-card__list">
        {days.slice(0, MAX_ROWS).map((d, i) => {
          const items = plan.items.filter((it) => itemDay(it) === d)
          const regions = [...new Set(items.map(regionForItem).filter((r): r is Region => r !== null))]
          const label = weekdayShort(d)
          const open = regions.length === 0
          const to = open ? '#plan-regions' : `/region/${regions[0]}/plan?day=${d}`
          const body = (
            <>
              <span className={open ? 'days-card__num days-card__num--open' : 'days-card__num'} aria-hidden="true">
                {i + 1}
              </span>
              <span className="days-card__main">
                <span className="days-card__where">
                  <span className="sr-only">Day {i + 1}, </span>
                  {label.weekday}, {label.short} ·{' '}
                  {open ? 'Open day' : regions.map((r) => REGION_ROW_NAME[r]).join(', then ')}
                </span>
                <span className={open ? 'days-card__sub days-card__sub--open' : 'days-card__sub'}>
                  {open ? 'Add a region to this day' : `${items.length} planned`}
                </span>
              </span>
              <svg className="days-card__go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
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
        Open the whole trip →
      </Link>
    </section>
  )
}
