// =============================================================================
// /today — the field-day view: one read-only screen for the current trip day.
// The trip board (/trip) is where a plan gets built; this is what you open at
// the trailhead. Top to bottom: today's conditions (forecast, sun schedule,
// live entrance waits), the current or next block with a directions link, and
// the whole day in time order. No drag machinery on purpose; the footer link
// goes to the board for rearranging.
//
// Works fully offline by construction: the plan and dates are localStorage,
// stops and hikes are bundled, program items carry snapshots, slotting and
// sun times are pure math, weather falls back to its cache under the normal
// staleness rules, and the waits line simply vanishes without a connection.
// =============================================================================

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { readTripDates } from '../programs/usePrograms'
import SunLine from '../sun/SunLine'
import { coordLabel, directionsUrl, itemInfo } from '../trip/agendaItem'
import { dayForecastRegion } from '../trip/dayRegion'
import { driveMinutesBetween, slotPlan, type SlottedItem } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { formatClock, formatDayHeader, parkNowMinutes, todayIso } from '../utils/date'
import WaitsLine from '../waits/WaitsLine'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from '../weather/staleness'
import { forecastLineForDay } from '../weather/todayLine'
import { useWeather } from '../weather/useWeather'
import './Today.css'

// Whole days from a to b, both YYYY-MM-DD (positive when b is later).
function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)
}

// Conditions for the day: forecast line (under the weather staleness rules),
// the computed sun schedule, live entrance waits. Rendered in every state:
// someone standing in the park with no plan still gets the day's shape.
function ConditionsBlock({
  today,
  blocks,
}: {
  today: string
  blocks: SlottedItem[]
}) {
  const weather = useWeather()
  const showForecast =
    !weather.loading && weather.spots.length > 0 && weather.ageMs <= HIDE_AFTER_MS
  const forecastLine = showForecast
    ? forecastLineForDay(weather.spots, dayForecastRegion(blocks.map((b) => b.item)), today)
    : null
  return (
    <div className="today-conditions">
      {forecastLine && (
        <p className="today-conditions__weather">
          {forecastLine}
          {weather.ageMs > WARN_AFTER_MS && (
            <span className="today-conditions__muted">
              {' '}
              · this forecast is old; conditions have likely moved on
            </span>
          )}
        </p>
      )}
      <SunLine dateIso={today} />
      <WaitsLine />
      <p className="today-conditions__note">
        Sun times are horizon times; canyon walls hold the valley floor in shade longer.
      </p>
    </div>
  )
}

// One row of the day list: time, tone dot, linked title, meta, directions.
function DayRow({ block, nowMin }: { block: SlottedItem; nowMin: number }) {
  const info = itemInfo(block.item)
  const timed = block.startMin !== null
  const past = timed && (block.startMin ?? 0) + block.durationMin <= nowMin
  return (
    <li className={past ? 'today-row is-past' : 'today-row'}>
      <span className="today-row__time">
        {timed ? formatClock(block.startMin ?? 0) : '·'}
      </span>
      <span className="today-row__dot" style={{ background: info.tone.color }} aria-hidden="true" />
      <span className="today-row__body">
        <span className="today-row__title">
          {info.href ? <Link to={info.href}>{info.title}</Link> : info.title}
        </span>
        {info.meta.length > 0 && (
          <span className="today-row__meta">{info.meta.join(' · ')}</span>
        )}
        {info.coord && (
          <a
            className="today-row__nav"
            href={directionsUrl(info.coord)}
            target="_blank"
            rel="noreferrer"
          >
            Directions →
          </a>
        )}
      </span>
    </li>
  )
}

export default function Today() {
  const { plan } = useTripPlan()
  const today = todayIso()
  // tfg.trip.dates directly, not plan.dates: an untouched plan falls back to
  // a default window that always includes today, which would make the
  // "no dates set" state unreachable.
  const [pickedDates] = useState(() => readTripDates())
  const slotted = useMemo(() => slotPlan(plan.items), [plan])
  const todayBlocks = useMemo(() => slotted.get(today) ?? [], [slotted, today])

  // Same one-minute pulse as the trip board, so "Now" moves without a reload.
  const [nowMin, setNowMin] = useState(parkNowMinutes)
  useEffect(() => {
    const t = window.setInterval(() => setNowMin(parkNowMinutes()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  const dates = pickedDates ?? plan.dates
  const noDates = pickedDates === null && plan.items.length === 0
  const beforeTrip = !noDates && today < dates.start
  const afterTrip = !noDates && today > dates.end
  const inWindow = !noDates && !beforeTrip && !afterTrip

  const dayNumber = dayDiff(dates.start, today) + 1
  const dayTotal = dayDiff(dates.start, dates.end) + 1

  const timed = todayBlocks.filter((b) => b.startMin !== null)
  const untimed = todayBlocks.filter((b) => b.startMin === null)
  const current = timed.find(
    (b) => (b.startMin ?? 0) <= nowMin && nowMin < (b.startMin ?? 0) + b.durationMin,
  )
  const next = current ? undefined : timed.find((b) => (b.startMin ?? 0) >= nowMin)
  const dayOver = !current && !next && timed.length > 0
  const featured = current ?? next
  const featuredInfo = featured ? itemInfo(featured.item) : null

  const intro = noDates
    ? 'The park day at a glance, whether or not a plan exists yet.'
    : inWindow
      ? `Day ${dayNumber} of ${dayTotal} of your trip.`
      : beforeTrip
        ? `Your trip starts in ${dayDiff(today, dates.start)} ${
            dayDiff(today, dates.start) === 1 ? 'day' : 'days'
          }.`
        : 'Your trip dates have passed.'

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Today in the park"
          title={formatDayHeader(today)}
          intro={intro}
        />

        <ConditionsBlock today={today} blocks={inWindow ? todayBlocks : []} />

        {noDates && (
          <EmptyState
            note={
              <>
                Set your trip dates and this page becomes your day: the schedule, the next stop,
                the drive between them.
              </>
            }
            action={
              <Link className="more-link" to="/trip">
                Start on the trip board →
              </Link>
            }
          />
        )}

        {(beforeTrip || afterTrip) && (
          <EmptyState
            note={
              beforeTrip ? (
                <>
                  When your dates arrive this page turns into the day itself: the schedule in
                  time order, what is next, and the drive to it.
                </>
              ) : (
                <>Set new dates and the guide resets for the next trip.</>
              )
            }
            action={
              <Link className="more-link" to="/trip">
                {beforeTrip ? 'Review the plan →' : 'Set new dates →'}
              </Link>
            }
          />
        )}

        {inWindow && todayBlocks.length === 0 && (
          <EmptyState
            note={<>Nothing planned for today. The day is open.</>}
            action={
              <Link className="more-link" to="/trip">
                Drop something onto today →
              </Link>
            }
          />
        )}

        {inWindow && featured && featuredInfo && (
          <section aria-label={current ? 'Now' : 'Next up'} className="today-next">
            <span className="eyebrow">{current ? 'Now' : 'Next up'}</span>
            <h2 className="today-next__title">
              <span
                className="today-row__dot"
                style={{ background: featuredInfo.tone.color }}
                aria-hidden="true"
              />
              {featuredInfo.href ? (
                <Link to={featuredInfo.href}>{featuredInfo.title}</Link>
              ) : (
                featuredInfo.title
              )}
            </h2>
            <p className="today-next__time">
              {formatClock(featured.startMin ?? 0)} –{' '}
              {formatClock((featured.startMin ?? 0) + featured.durationMin)}
              {featuredInfo.meta.length > 0 && (
                <span className="today-conditions__muted"> · {featuredInfo.meta.join(' · ')}</span>
              )}
            </p>
            {featuredInfo.coord && (
              <a
                className="today-next__nav"
                href={directionsUrl(featuredInfo.coord)}
                target="_blank"
                rel="noreferrer"
              >
                Directions to {coordLabel(featuredInfo.coord)} →
              </a>
            )}
          </section>
        )}

        {inWindow && dayOver && (
          <p className="today-done">That's the day. Nothing else planned.</p>
        )}

        {inWindow && todayBlocks.length > 0 && (
          <section aria-label="The day in order" className="today-list-section">
            <span className="eyebrow">The day, in order</span>
            <ol className="today-list">
              {timed.flatMap((block, i) => {
                const prev = i > 0 ? timed[i - 1] : null
                const drive = prev ? driveMinutesBetween(prev.item, block.item) : null
                const rows: ReactElement[] = []
                if (drive !== null && drive > 0) {
                  rows.push(
                    <li
                      key={`${block.item.itemId}-transit`}
                      className="today-transit"
                      aria-hidden="true"
                    >
                      about {drive} min between stops
                    </li>,
                  )
                }
                rows.push(<DayRow key={block.item.itemId} block={block} nowMin={nowMin} />)
                return rows
              })}
            </ol>
            {untimed.length > 0 && (
              <>
                <span className="today-list__sub">Also today</span>
                <ol className="today-list">
                  {untimed.map((block) => (
                    <DayRow key={block.item.itemId} block={block} nowMin={nowMin} />
                  ))}
                </ol>
              </>
            )}
            <Link to="/trip" className="more-link">
              Rearrange on the trip board →
            </Link>
          </section>
        )}
      </main>
    </GatedChrome>
  )
}
