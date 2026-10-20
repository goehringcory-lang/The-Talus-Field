// =============================================================================
// The map's Backpacking pane: the ten trips, and once one is chosen, the trip
// night by night beside its drawn route. It is also the route's text
// alternative: every camp, every water source and every mile mark the map
// shows is here in list semantics, and a row focuses its pin.
//
// It reads the same planDays/longestDryStretch as /backpacking/:id, so the
// pane and the trip page cannot disagree.
// =============================================================================

import { Link } from 'react-router-dom'
import type { BackpackTripT } from '../content/schema'
import { formatElevation } from '../content/labels'
import { CAMP_KIND_LABEL, LEVEL_LABEL, longestDryStretch, nightsLabel, planDays } from '../backpacking/plan'
import { ROUTE_SUMMARY, type BackpackRouteT } from '../backpacking/routes'
import { BP_KEY_PATH } from './backpackLayer'

type Props = {
  trips: BackpackTripT[]
  routes: Record<string, BackpackRouteT> | null
  state: 'loading' | 'ready' | 'failed'
  tripId: string | null
  onSelectTrip: (id: string | null) => void
  day: number | null
  onSelectDay: (day: number | null) => void
  focusId: string | null
  onFocus: (id: string, coord: [number, number]) => void
  colors: string[]
  waterColor: string
  expanded: boolean
  onToggleExpanded: () => void
}

function Swatch({ color }: { color: string }) {
  return <span className="trip-panel__swatch" style={{ background: color }} aria-hidden="true" />
}

function Mark({ path, fill, hollow, water }: { path: string; fill: string; hollow?: boolean; water?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 30 30" aria-hidden="true" className="bp-panel__mark">
      <path
        d={path}
        fill={hollow ? 'var(--paper)' : fill}
        stroke={hollow ? fill : 'var(--paper)'}
        strokeWidth={hollow ? 3 : 2.5}
        strokeLinejoin="round"
      />
      {water && !hollow && <circle cx="12.5" cy="20" r="2.6" fill="var(--paper)" />}
    </svg>
  )
}

function TripList({ trips, onSelectTrip }: Pick<Props, 'trips' | 'onSelectTrip'>) {
  return (
    <ul className="bp-panel__trips">
      {trips.map((t) => {
        const s = ROUTE_SUMMARY[t.id]
        return (
          <li key={t.id}>
            <button type="button" className="bp-trip" onClick={() => onSelectTrip(t.id)}>
              <span className="bp-trip__title">{t.title}</span>
              <span className="bp-trip__meta">
                {nightsLabel(t)} · {(s?.mi ?? t.distanceMi).toFixed(1)} mi · {LEVEL_LABEL[t.level]}
              </span>
              <span className="bp-trip__teaser">{t.teaser}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function BackpackPanel(props: Props) {
  const { trips, routes, tripId, colors } = props
  const trip = tripId ? trips.find((t) => t.id === tripId) : undefined
  const route = trip && routes ? routes[trip.id] : undefined
  const days = trip && route ? planDays(trip, route) : null
  const dry = trip && route ? longestDryStretch(trip, route) : null
  const color = (i: number) => colors[i % colors.length]

  return (
    <div className={`trip-panel bp-panel${props.expanded ? ' trip-panel--open' : ''}`}>
      <button type="button" className="trip-panel__handle" aria-expanded={props.expanded} onClick={props.onToggleExpanded}>
        {trip ? trip.title : 'Backpacking trips'}
      </button>

      <div className="trip-panel__body">
        {!trip ? (
          <>
            <h2 className="trip-panel__title">Backpacking</h2>
            <p className="trip-panel__note">
              Ten overnight routes, from a first night at May Lake to four days down the Grand Canyon of the
              Tuolumne. Choose one, or tap a route on the map, to see each night's camp and every place to fill
              a bottle.
            </p>
            {props.state === 'failed' && (
              <p className="trip-panel__note" role="status">
                The routes aren't saved on this phone yet, so the map can't draw them. Reconnect once, or download
                the park map under Offline areas; each trip's page still reads in full.
              </p>
            )}
            <TripList trips={trips} onSelectTrip={props.onSelectTrip} />
            <p className="trip-panel__foot">
              <Link to="/backpacking">All trips, with permits and rules →</Link>
            </p>
          </>
        ) : (
          <>
            <button type="button" className="bp-panel__back" onClick={() => props.onSelectTrip(null)}>
              ← All trips
            </button>
            <h2 className="trip-panel__title">{trip.title}</h2>
            <p className="bp-panel__meta">
              {nightsLabel(trip)} · {(route?.stats.mi ?? trip.distanceMi).toFixed(1)} mi ·{' '}
              {(route?.stats.gainFt ?? trip.elevationGainFt).toLocaleString('en-US')} ft of climbing · tops{' '}
              {formatElevation(route?.stats.maxFt ?? trip.highPointFt)}
            </p>

            {!route && props.state === 'loading' && <p className="trip-panel__note">Drawing the route…</p>}
            {!route && props.state !== 'loading' && (
              <p className="trip-panel__note" role="status">
                {props.state === 'failed'
                  ? "The route isn't saved on this phone yet. Reconnect once, or download the park map under Offline areas."
                  : 'No verified route line for this trip yet; its camps and water are on the trip page.'}
              </p>
            )}

            {days && (
              <>
                <div className="trip-panel__days" role="group" aria-label="Show days">
                  <button type="button" aria-pressed={props.day === null} onClick={() => props.onSelectDay(null)}>
                    All days
                  </button>
                  {days.map((d) => (
                    <button
                      key={d.index}
                      type="button"
                      aria-pressed={props.day === d.index + 1}
                      onClick={() => props.onSelectDay(d.index + 1)}
                    >
                      <Swatch color={color(d.index)} />
                      Day {d.index + 1}
                    </button>
                  ))}
                </div>

                <details className="trip-panel__legend">
                  <summary>Key</summary>
                  <ul>
                    <li>
                      <Mark path={BP_KEY_PATH.tent} fill={color(0)} /> Camp, numbered by night, in the colour of the day
                      that ends there
                    </li>
                    <li>
                      <Mark path={BP_KEY_PATH.water} fill={props.waterColor} water /> Reliable water
                    </li>
                    <li>
                      <Mark path={BP_KEY_PATH.water} fill={props.waterColor} hollow /> Seasonal water: can be dry by late
                      summer
                    </li>
                    <li>
                      <Mark path={BP_KEY_PATH.start} fill="var(--ink)" /> Trailhead (S) and exit (E)
                    </li>
                  </ul>
                  <p>A dashed line is a side trip, walked there and back from camp.</p>
                </details>

                {dry && dry.mi >= 2 && (
                  <p className="bp-panel__dry">
                    Longest stretch without reliable water: <strong>{dry.mi} mi</strong>, {dry.from} to {dry.to}.
                  </p>
                )}

                {days
                  .filter((d) => props.day === null || d.index + 1 === props.day)
                  .map((d) => (
                    <section key={d.index} className="trip-day" aria-labelledby={`bp-day-${d.index}`}>
                      <h3 id={`bp-day-${d.index}`} className="trip-day__title">
                        <Swatch color={color(d.index)} />
                        Day {d.index + 1}
                        <span className="bp-day__route">
                          {d.from} → {d.to}
                        </span>
                      </h3>
                      <p className="bp-day__numbers">
                        {d.mi > 0 ? `${d.mi.toFixed(1)} mi · +${d.gainFt.toLocaleString('en-US')} / −${d.lossFt.toLocaleString('en-US')} ft` : 'Layover at camp'}
                        {d.sideTrip?.mi ? ` · side trip ${d.sideTrip.mi} mi round trip` : ''}
                      </p>
                      <ol className="bp-day__entries">
                        {d.entries.map((e) => {
                          const id = e.kind === 'water' ? e.water.id : e.camp.id
                          const coord = e.kind === 'water' ? e.water.coord : e.camp.coord
                          return (
                            <li key={`${id}-${e.mi}`}>
                              <button
                                type="button"
                                className={`bp-entry${props.focusId === id ? ' bp-entry--focused' : ''}`}
                                onClick={() => props.onFocus(id, coord)}
                              >
                                {e.kind === 'water' ? (
                                  <Mark path={BP_KEY_PATH.water} fill={props.waterColor} hollow={e.water.reliability === 'seasonal'} water />
                                ) : (
                                  <Mark path={BP_KEY_PATH.tent} fill={color(d.index)} />
                                )}
                                <span className="bp-entry__main">
                                  <span className="bp-entry__name">
                                    {e.kind === 'water' ? e.water.name : `Night ${e.night}: ${e.camp.name}`}
                                  </span>
                                  <span className="bp-entry__meta">
                                    {e.kind === 'water'
                                      ? `mi ${e.mi.toFixed(1)} · ${e.water.reliability === 'reliable' ? 'reliable' : 'seasonal'}${e.returnPass ? ' · on the way back' : ''}`
                                      : `${e.layover ? 'second night · ' : `mi ${e.mi.toFixed(1)} · `}${CAMP_KIND_LABEL[e.camp.kind].toLowerCase()} · ${formatElevation(e.camp.elevFt)}`}
                                  </span>
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ol>
                    </section>
                  ))}
              </>
            )}

            <p className="trip-panel__foot">
              <Link to={`/backpacking/${trip.id}`}>Permit, rules and the full plan →</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
