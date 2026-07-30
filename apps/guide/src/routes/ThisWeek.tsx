// =============================================================================
// /this-week — what is special right now, one screen. Composition only: the
// seasonal almanac (bundled, works offline), the live conditions feeds from
// Phase 1 (alerts/air/flow, each with its cached fallback), entrance waits,
// and tonight's moon from the on-device lunar math. Nothing here fetches
// anything the rest of the app does not already fetch; the page is the
// answer to "we're here this week, what should we know" without making the
// reader assemble it from five surfaces.
//
// The active park alerts render here in full (closures and dangers first,
// per the Worker's severity sort). Home and /today carry only the one-line
// summaries; this page is where the whole board lives.
// =============================================================================

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AirLine from '../air/AirLine'
import RoadsLine from '../alerts/RoadsLine'
import { HIDE_AFTER_MS } from '../alerts/staleness'
import { useAlerts } from '../alerts/useAlerts'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import {
  seasonalDaysInRange,
  seasonalRangeLabel,
  seasonalWindowsInRange,
} from '../content/seasonal'
import FlowLine from '../flow/FlowLine'
import { moonInfo } from '../sun/lunar'
import { formatDayHeader, todayIso } from '../utils/date'
import WaitsLine from '../waits/WaitsLine'
import './ThisWeek.css'

const WINDOW_DAYS = 10

// YYYY-MM-DD plus n days, in UTC math like the rest of the date utils.
function addDays(dateIso: string, n: number): string {
  const d = new Date(`${dateIso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function ThisWeek() {
  const today = todayIso()
  const end = addDays(today, WINDOW_DAYS - 1)
  const { alerts, fetchedAt, ageMs, offline } = useAlerts()

  const windows = useMemo(() => seasonalWindowsInRange(today, end), [today, end])
  const dated = useMemo(() => seasonalDaysInRange(today, end), [today, end])
  const moon = useMemo(() => moonInfo(today), [today])

  const showAlerts = alerts.length > 0 && ageMs <= HIDE_AFTER_MS
  const notices = alerts.filter((a) => a.category === 'closure' || a.category === 'danger')
  const advisories = alerts.filter((a) => a.category === 'caution')

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="This week in the park"
          title={formatDayHeader(today)}
          intro="What is open, what is running, what the sky is doing, and what only happens around now."
        />

        <section aria-label="Conditions now" className="page-section">
          <span className="eyebrow">Conditions now</span>
          <div className="thisweek-lines">
            <RoadsLine />
            <AirLine />
            <FlowLine />
            <WaitsLine />
          </div>
        </section>

        {showAlerts && (notices.length > 0 || advisories.length > 0) && (
          <section aria-label="Park alerts" className="page-section">
            <span className="eyebrow">
              Park alerts
              {offline ? ' · saved on this device' : ''}
            </span>
            <ul className="thisweek-alerts">
              {[...notices, ...advisories].map((a) => (
                <li key={a.id} className={`thisweek-alert thisweek-alert--${a.category}`}>
                  <span className="thisweek-alert__tag">
                    {a.category === 'closure' ? 'Closure' : a.category === 'danger' ? 'Danger' : 'Caution'}
                  </span>
                  <span className="thisweek-alert__body">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        {a.title}
                      </a>
                    ) : (
                      a.title
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {fetchedAt && (
              <p className="thisweek-source">
                From the park's own alert feed. The wording above is theirs.
              </p>
            )}
          </section>
        )}

        <section aria-label="In season right now" className="page-section">
          <span className="eyebrow">In season right now</span>
          {windows.length === 0 && dated.length === 0 ? (
            <p className="thisweek-empty">
              Nothing date-bound in the next {WINDOW_DAYS} days. The park is still there.
            </p>
          ) : (
            <ul className="thisweek-season">
              {windows.map((ev) => (
                <li key={ev.id} className="thisweek-season__item">
                  <p className="thisweek-season__title">
                    {ev.title}
                    <span className="thisweek-season__range"> · {seasonalRangeLabel(ev)}</span>
                    {ev.confidence === 'typical' && (
                      <span className="thisweek-season__typical"> · typical window</span>
                    )}
                  </p>
                  <p className="thisweek-season__desc">{ev.description}</p>
                </li>
              ))}
              {dated.map((ev) => (
                <li key={ev.id} className="thisweek-season__item">
                  <p className="thisweek-season__title">
                    {ev.title}
                    <span className="thisweek-season__range"> · {seasonalRangeLabel(ev)}</span>
                  </p>
                  <p className="thisweek-season__desc">{ev.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Tonight's sky" className="page-section">
          <span className="eyebrow">Tonight's sky</span>
          <p className="thisweek-moon">
            {moon.phaseName === 'full moon' || moon.phaseName === 'new moon'
              ? `A ${moon.phaseName} tonight`
              : `${moon.phaseName[0].toUpperCase()}${moon.phaseName.slice(1)} tonight`}
            , about {Math.round(moon.illumination * 100)}% lit. Next full moon{' '}
            {moon.nextFull.dateIso.slice(5).replace('-', '/')}, next new moon{' '}
            {moon.nextNew.dateIso.slice(5).replace('-', '/')}.
          </p>
          <Link to="/night" className="more-link">
            The night sky page: dark spots, the moon, what's up →
          </Link>
        </section>

        <section aria-label="Onward" className="page-section">
          <div className="home-crosslinks">
            <Link to="/programs" className="more-link">
              Ranger programs and events for your dates →
            </Link>
            <Link to="/today" className="more-link">
              Your day, hour by hour →
            </Link>
          </div>
        </section>
      </main>
    </GatedChrome>
  )
}
