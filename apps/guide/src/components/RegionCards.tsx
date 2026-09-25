// The front page's regions, as invitations into each region's day planner.
// A region already on the trip gets a large card naming its day and what is
// planned there, with the one action that matters ("Keep planning Day 1");
// the rest sit two to a row with "Add to a day". The Secret Guide closes the
// set as a card of the same family: it used to be a black tile with a star,
// which read as a different product rather than the best part of this one.
//
// Weather rides along as it did on the old rows (one line per region, the
// caller's useWeather), and nothing here is date-derived beyond the plan the
// reader made.

import { Link } from 'react-router-dom'
import {
  REGIONS,
  REGION_SHORT,
  getHikesByRegion,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  type Region,
} from '../content'
import { regionForItem } from '../trip/driveTimes'
import type { TripItemT } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso } from '../utils/date'
import ResponsivePhoto from './ResponsivePhoto'
import './PlanCards.css'

// The Secret Guide card's photo: Yosemite Falls upside down in the Merced,
// one of the entries, so the card shows what the section is.
const SECRET_PHOTO_STOP = 'swinging-bridge-reflection'

function itemDay(item: TripItemT): string {
  return item.type === 'program' ? item.snapshot.date : item.day
}

function dayWord(date: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default function RegionCards({ weatherLine }: { weatherLine: (region: Region) => string | null }) {
  const { plan } = useTripPlan()
  const days: string[] = []
  for (let d = plan.dates.start; d <= plan.dates.end && days.length < 62; d = addDaysIso(d, 1)) days.push(d)

  // Per region: the trip days it is on, and how many items it holds there.
  const onTrip = new Map<Region, { days: string[]; count: number }>()
  for (const it of plan.items) {
    const r = regionForItem(it)
    const d = itemDay(it)
    if (!r || !days.includes(d)) continue
    const entry = onTrip.get(r) ?? { days: [], count: 0 }
    if (!entry.days.includes(d)) entry.days.push(d)
    entry.count += 1
    onTrip.set(r, entry)
  }
  for (const e of onTrip.values()) e.days.sort()

  const featured = REGIONS.filter((r) => onTrip.has(r.id))
  const rest = REGIONS.filter((r) => !onTrip.has(r.id))
  // Nothing planned yet: every region is an equal invitation.
  const allLarge = featured.length === 0

  const secretCount = getSecretGuideEntries().length
  const secretPhoto = getStopById(SECRET_PHOTO_STOP)?.photos[0]?.src

  // A render helper, not a component: it closes over this render's plan.
  function largeCard(id: Region, title: string, photo: string) {
    const trip = onTrip.get(id)
    const firstDay = trip?.days[0]
    const dayNums = trip?.days.map((d) => days.indexOf(d) + 1) ?? []
    const to = `/region/${id}/plan${firstDay ? `?day=${firstDay}` : ''}`
    const weather = weatherLine(id)
    return (
      <article className="region-card" key={id}>
        <Link className="region-card__media" to={to} aria-label={`Plan ${title}`}>
          <ResponsivePhoto src={photo} alt="" loading="lazy" width={800} height={450} sizes="(max-width: 760px) 100vw, 680px" />
          <span className="region-card__scrim" aria-hidden="true" />
          {firstDay && (
            <span className="region-card__pill">
              {dayNums.length === 1 ? `Day ${dayNums[0]} · ${dayWord(firstDay)}` : `Days ${dayNums.join(', ')}`}
            </span>
          )}
          <h3 className="region-card__title">{title}</h3>
        </Link>
        <div className="region-card__body">
          <div className="region-card__stats">
            <span className="region-card__stat">{getStopsByRegion(id).length} stops</span>
            <span className="region-card__stat">{getHikesByRegion(id).length} hikes</span>
            {weather && <span className="region-card__stat">Today: {weather}</span>}
          </div>
          {trip && (
            <p className="region-card__progress">
              {trip.count} planned {dayNums.length === 1 ? `on Day ${dayNums[0]}` : 'across your days'}
            </p>
          )}
          <div className="region-card__actions">
            <Link className="region-card__cta" to={to}>
              {firstDay ? `Keep planning Day ${dayNums[0]}` : 'Plan a day here'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link className="region-card__read" to={`/region/${id}`}>
              Read the region
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section aria-labelledby="plan-regions-title" className="page-section region-cards" id="plan-regions">
      <span className="eyebrow">Where you’ll spend your days</span>
      <h2 className="region-cards__title" id="plan-regions-title">
        Four regions. Open one and plan its day.
      </h2>

      <div className="region-cards__large">
        {(allLarge ? REGIONS : featured).map((r) => largeCard(r.id, r.title, r.photo.src))}
      </div>

      {!allLarge && rest.length > 0 && (
        <>
          <p className="region-cards__sub">Not on your trip yet</p>
          <div className="region-cards__small">
            {rest.map((r) => {
              const weather = weatherLine(r.id)
              return (
                <Link key={r.id} className="region-mini" to={`/region/${r.id}/plan`}>
                  <span className="region-mini__media">
                    <ResponsivePhoto src={r.photo.src} alt="" loading="lazy" width={400} height={300} sizes="(max-width: 760px) 50vw, 340px" />
                    <span className="region-card__scrim" aria-hidden="true" />
                    <span className="region-mini__title">{REGION_SHORT[r.id]}</span>
                  </span>
                  <span className="region-mini__body">
                    <span className="region-mini__line">
                      {getStopsByRegion(r.id).length} stops{weather ? ` · ${weather}` : ''}
                    </span>
                    <span className="region-mini__cta">Add to a day →</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </>
      )}

      <Link className="secret-card" to="/secret-guide">
        {secretPhoto && (
          <span className="secret-card__media">
            <ResponsivePhoto src={secretPhoto} alt="" loading="lazy" width={400} height={400} sizes="140px" />
          </span>
        )}
        <span className="secret-card__body">
          <span className="secret-card__eyebrow">The Secret Guide</span>
          <span className="secret-card__title">{secretCount} places the brochures skip</span>
          <span className="secret-card__line">Each one also shows up in its region’s planner, where it fits the day.</span>
          <span className="secret-card__cta">Browse them all →</span>
        </span>
      </Link>
    </section>
  )
}
