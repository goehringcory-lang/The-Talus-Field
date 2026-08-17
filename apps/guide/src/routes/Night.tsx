// =============================================================================
// /night — the night sky module. Everything here computes or ships offline:
// tonight's moon from sun/lunar.ts, sun times from sun/solar.ts, the sky
// calendar from the bundled almanac plus computed full moons, and a short
// dark-sky shortlist whose claims come from the stargazing essentials topic
// (Bortle ratings, drive-to spots). The one live dependency worth naming in
// copy is Tioga: the two best drive-to dark skies close with their roads, so
// the spot list reads road status from the alerts feed when it has it.
// =============================================================================

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAlerts } from '../alerts/useAlerts'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import { SEASONAL_EVENTS } from '../content/seasonal'
import { fullMoonsInRange, moonInfo } from '../sun/lunar'
import SunLine from '../sun/SunLine'
import { formatDayHeader, todayIso } from '../utils/date'
import './Night.css'

const CALENDAR_DAYS = 90

function addDays(dateIso: string, n: number): string {
  const d = new Date(`${dateIso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function monthDayLabel(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

// The drive-to dark-sky shortlist. Claims mirror the stargazing essentials
// topic; ids are real stops so each line links to its full entry. The two
// high spots go with their roads, which is why roadId is carried.
const DARK_SPOTS: Array<{
  stopId: string
  title: string
  note: string
  roadId?: 'tioga' | 'glacier-point'
}> = [
  {
    stopId: 'glacier-point',
    title: 'Glacier Point',
    note: 'Bortle 2 skies at 7,200 feet, a paved lot, and the valley glowing faintly below. The classic.',
    roadId: 'glacier-point',
  },
  {
    stopId: 'olmsted-point',
    title: 'Olmsted Point',
    note: 'Granite slabs at 8,300 feet on Tioga Road. The darkest easy sky in the park.',
    roadId: 'tioga',
  },
  {
    stopId: 'tenaya-lake',
    title: 'Tenaya Lake pullouts',
    note: 'The lake doubles the sky on a still night. Any pullout on the north shore works.',
    roadId: 'tioga',
  },
  {
    stopId: 'cooks-meadow-loop',
    title: 'Valley floor meadows',
    note: 'Bortle 3 to 4 under the walls. Not the Milky Way at its best, but the granite by starlight is its own show.',
  },
]

export default function Night() {
  const today = todayIso()
  const moon = useMemo(() => moonInfo(today), [today])
  const { roads } = useAlerts()

  const calendarEnd = addDays(today, CALENDAR_DAYS - 1)
  const fullMoons = useMemo(() => fullMoonsInRange(today, calendarEnd), [today, calendarEnd])
  // The almanac also carries every full moon (as `full-moon-<date>` entries),
  // so listing computed moons AND almanac astronomy events used to print each
  // moon twice. The almanac copy is excluded here; its one contribution — the
  // traditional name — is lifted onto the computed line instead.
  const moonNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const ev of SEASONAL_EVENTS) {
      if (!ev.id.startsWith('full-moon-')) continue
      const m = /^Full moon \((.+)\)$/.exec(ev.title)
      if (m) names.set(ev.dateStart, m[1])
    }
    return names
  }, [])
  const skyEvents = useMemo(
    () =>
      SEASONAL_EVENTS.filter(
        (ev) =>
          ev.category === 'astronomy' &&
          !ev.id.startsWith('full-moon-') &&
          ev.dateEnd >= today &&
          ev.dateStart <= calendarEnd,
      ),
    [today, calendarEnd],
  )
  // One chronological list: a meteor shower belongs between the moons that
  // bracket it, not in a separate run after them.
  const calendar = useMemo(() => {
    const rows = [
      ...fullMoons.map((fm) => {
        const name = moonNames.get(fm.dateIso)
        return {
          key: `moon-${fm.dateIso}`,
          date: fm.dateIso,
          dateLabel: monthDayLabel(fm.dateIso),
          label: `Full moon${name ? ` (${name})` : ''}, ${fm.timeLabel}`,
          typical: false,
        }
      }),
      ...skyEvents.map((ev) => ({
        key: ev.id,
        date: ev.dateStart,
        dateLabel:
          monthDayLabel(ev.dateStart) +
          (ev.dateEnd !== ev.dateStart ? `–${monthDayLabel(ev.dateEnd)}` : ''),
        label: ev.title,
        typical: ev.confidence === 'typical',
      })),
    ]
    return rows.sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [fullMoons, moonNames, skyEvents])

  const pct = Math.round(moon.illumination * 100)
  const verdict =
    moon.illumination <= 0.35
      ? 'Dark enough for the Milky Way. If the sky is clear, tonight is worth the drive.'
      : moon.illumination <= 0.75
        ? 'A middling moon. The bright targets hold up; the faint sky does not.'
        : 'Moonlight washes out the faint sky tonight. Point the evening at moonlit granite instead.'

  const closedRoads = new Set(
    roads.filter((r) => r.status === 'closed').map((r) => r.id as string),
  )

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="The night sky"
          title="After dark"
          intro="What the sky is doing tonight, where the dark is, and the dates worth planning an evening around."
        />

        <section aria-label="Tonight" className="page-section">
          <span className="eyebrow">Tonight · {formatDayHeader(today)}</span>
          <p className="night-moon">
            <strong>
              {moon.phaseName[0].toUpperCase()}
              {moon.phaseName.slice(1)}
            </strong>
            , about {pct}% lit. {verdict}
          </p>
          <SunLine dateIso={today} />
          <p className="night-note">
            Next full moon {monthDayLabel(moon.nextFull.dateIso)} at {moon.nextFull.timeLabel} ·
            next new moon {monthDayLabel(moon.nextNew.dateIso)}. The week around new moon is the
            dark-sky window.
          </p>
        </section>

        <section aria-label="Where the dark is" className="page-section">
          <span className="eyebrow">Where the dark is</span>
          <ul className="night-spots">
            {DARK_SPOTS.map((spot) => {
              const closed = spot.roadId ? closedRoads.has(spot.roadId) : false
              return (
                <li key={spot.stopId} className="night-spot">
                  <p className="night-spot__title">
                    <Link to={`/stop/${spot.stopId}`}>{spot.title}</Link>
                    {closed && <span className="night-spot__closed"> · road closed now</span>}
                  </p>
                  <p className="night-spot__note">{spot.note}</p>
                </li>
              )
            })}
          </ul>
          <div className="home-crosslinks">
            <Link to="/essentials/stargazing" className="more-link">
              The stargazing essentials: when to look, what you'll see →
            </Link>
            <Link to="/secret-guide#olmsted-point-at-night" className="more-link">
              The Secret Guide's after-dark entries →
            </Link>
          </div>
        </section>

        <section aria-label="Sky calendar" className="page-section">
          <span className="eyebrow">The next {CALENDAR_DAYS} days</span>
          <ul className="night-calendar">
            {calendar.map((row) => (
              <li key={row.key} className="night-calendar__item">
                <span className="night-calendar__date">{row.dateLabel}</span>
                <span>
                  {row.label}
                  {row.typical && <span className="night-calendar__typical"> · typical</span>}
                </span>
              </li>
            ))}
          </ul>
          {calendar.length === 0 && (
            <p className="night-note">Nothing dated in the window. The stars are still on.</p>
          )}
        </section>
      </main>
    </GatedChrome>
  )
}
