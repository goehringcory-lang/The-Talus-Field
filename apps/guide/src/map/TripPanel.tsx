// =============================================================================
// The map's "My trip" pane: the plan as a day-by-day itinerary beside the
// map, and the text alternative to it. Everything the map draws is here in
// words (order, times, the way between stops, how long, how far, and what
// does not fit), so a screen-reader user, or anyone who would rather read
// than pan, gets the whole plan without the canvas.
//
// It edits the plan through the same store as the trip board (useTripPlan),
// so a change here redraws the map and the board at once, and a change on the
// board reaches here the same way.
// =============================================================================

import { Link } from 'react-router-dom'
import { formatTime } from '../content/labels'
import type { TravelModeT } from '../trip/schema'
import { formatMiles } from '../utils/geo'
import { formatClock } from '../utils/date'
import { TRIP_LINES } from './theme'
import { TRIP_KIND_LABEL, TRIP_STOP_KINDS, shapePath } from './tripIcons'
import type { DayEnd, TripDay, TripLeg, TripStop } from './tripLayer'

const MODE_OPTIONS: { value: '' | TravelModeT; label: string }[] = [
  { value: '', label: 'Auto' },
  { value: 'drive', label: 'Drive' },
  { value: 'walk', label: 'Walk' },
  { value: 'shuttle', label: 'Shuttle' },
]

const MODE_WORD: Record<TravelModeT, string> = { drive: 'Drive', walk: 'Walk', shuttle: 'Shuttle' }

const DAY_END_CHOICES: { value: string; label: string }[] = [
  { value: 'sunset', label: 'Sunset' },
  ...[17, 18, 19, 20, 21, 22].map((h) => ({ value: String(h * 60), label: formatClock(h * 60) })),
]

type Props = {
  days: TripDay[]
  colors: string[]
  selectedDay: string | null
  onSelectDay: (day: string | null) => void
  focusedItemId: string | null
  onFocusItem: (stop: TripStop) => void
  onSetMode: (itemId: string, mode: TravelModeT | undefined) => void
  onMove: (itemId: string, direction: -1 | 1) => void
  onRemove: (itemId: string) => void
  onPlayDay?: (day: TripDay) => void
  dayEnd: DayEnd
  onDayEnd: (next: DayEnd) => void
  graphState: 'loading' | 'ready' | 'failed'
  expanded: boolean
  onToggleExpanded: () => void
}

function Swatch({ color }: { color: string }) {
  return <span className="trip-panel__swatch" style={{ background: color }} aria-hidden="true" />
}

function LineSample({ dash, color }: { dash: readonly number[] | null; color: string }) {
  const w = 3
  return (
    <svg width="44" height="10" aria-hidden="true" className="trip-panel__sample">
      <line
        x1="2"
        y1="5"
        x2="42"
        y2="5"
        stroke={color}
        strokeWidth={w}
        strokeLinecap={dash && dash[0] < 1 ? 'round' : 'butt'}
        strokeDasharray={dash ? dash.map((d) => Math.max(0.01, d * w)).join(' ') : undefined}
      />
    </svg>
  )
}

function legSummary(leg: TripLeg): string {
  const parts = [MODE_WORD[leg.mode]]
  if (leg.minutes !== null) parts.push(`about ${formatTime(Math.max(leg.minutes, 1))}`)
  if (leg.metres !== null) parts.push(formatMiles(leg.metres / 1609.34))
  return parts.join(' · ')
}

function legNote(leg: TripLeg): string | null {
  if (leg.geometry === 'pending') return 'Drawing the route…'
  if (leg.geometry === 'straight') return 'No route found: shown as a straight line'
  if (leg.shuttle) return `${leg.shuttle.board} to ${leg.shuttle.alight}, ${leg.shuttle.hops} stops; includes a 10-minute wait allowance (intervals in the Yosemite Guide)`
  if (!leg.modeSet && leg.mode === 'walk') return 'Same parking area: a walk'
  return null
}

export default function TripPanel(props: Props) {
  const { days, colors, selectedDay, focusedItemId } = props
  const color = (d: TripDay) => colors[d.index % colors.length]
  const planned = days.some((d) => d.stops.length + d.unmapped.length > 0)
  const shown = selectedDay ? days.filter((d) => d.day === selectedDay) : days.filter((d) => d.stops.length + d.unmapped.length > 0)

  return (
    <div className={`trip-panel${props.expanded ? ' trip-panel--open' : ''}`}>
      <button
        type="button"
        className="trip-panel__handle"
        aria-expanded={props.expanded}
        onClick={props.onToggleExpanded}
      >
        Itinerary
      </button>

      <div className="trip-panel__body">
        <h2 className="trip-panel__title">Your trip</h2>

        {!planned ? (
          <p className="trip-panel__empty">
            Nothing is planned yet. Add a stop, a hike, a parking lot or a program from its card on the
            map, or build the days on the <Link to="/trip">trip board</Link>.
          </p>
        ) : (
          <>
            <div className="trip-panel__days" role="group" aria-label="Show days">
              <button type="button" aria-pressed={selectedDay === null} onClick={() => props.onSelectDay(null)}>
                All days
              </button>
              {days.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  aria-pressed={selectedDay === d.day}
                  aria-label={d.label}
                  onClick={() => props.onSelectDay(d.day)}
                >
                  <Swatch color={color(d)} />
                  Day {d.index + 1}
                </button>
              ))}
            </div>

            <details className="trip-panel__legend">
              <summary>Legend</summary>
              <ul>
                {days.map((d) => (
                  <li key={d.day}>
                    <Swatch color={color(d)} /> {d.label}
                  </li>
                ))}
              </ul>
              <ul>
                {(Object.keys(TRIP_LINES) as (keyof typeof TRIP_LINES)[]).map((k) => (
                  <li key={k}>
                    <LineSample dash={TRIP_LINES[k].dash} color="var(--ink)" /> {TRIP_LINES[k].label}
                  </li>
                ))}
                <li>
                  <span className="trip-panel__faded">
                    <LineSample dash={null} color="var(--ink)" />
                  </span>{' '}
                  Straight line: no route found
                </li>
              </ul>
              <ul>
                {TRIP_STOP_KINDS.map((k) => (
                  <li key={k}>
                    <svg width="18" height="18" viewBox="0 0 30 30" aria-hidden="true">
                      <path d={shapePath(k)} fill="var(--ink-3)" stroke="var(--paper)" strokeWidth="2.5" />
                    </svg>{' '}
                    {TRIP_KIND_LABEL[k]}
                  </li>
                ))}
              </ul>
              <p>Pins are numbered in the order each day runs. Times come from the trip board.</p>
            </details>

            <label className="trip-panel__end">
              Warn when a day runs past{' '}
              <select
                value={props.dayEnd.kind === 'sunset' ? 'sunset' : String(props.dayEnd.minutes)}
                onChange={(e) =>
                  props.onDayEnd(
                    e.target.value === 'sunset' ? { kind: 'sunset' } : { kind: 'fixed', minutes: Number(e.target.value) },
                  )
                }
              >
                {DAY_END_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            {props.graphState === 'failed' && (
              <p className="trip-panel__note" role="status">
                The road network didn't load, so legs are drawn as straight lines. Times are unaffected.
              </p>
            )}

            {shown.length === 0 && <p className="trip-panel__empty">Nothing planned on this day.</p>}

            {shown.map((d) => (
              <section key={d.day} className="trip-day" aria-labelledby={`trip-day-${d.day}`}>
                <h3 id={`trip-day-${d.day}`} className="trip-day__title">
                  <Swatch color={color(d)} />
                  {d.label}
                  {props.onPlayDay && d.stops.length > 1 && (
                    <button type="button" className="trip-day__play" onClick={() => props.onPlayDay?.(d)}>
                      Play day
                    </button>
                  )}
                </h3>

                {d.warnings.length > 0 && (
                  <ul className="trip-day__warnings" aria-label={`Schedule warnings, ${d.label}`}>
                    {d.warnings.map((w, i) => (
                      <li key={i} className={`trip-day__warning trip-day__warning--${w.kind}`}>
                        {w.text}
                      </li>
                    ))}
                  </ul>
                )}

                <ol className="trip-day__stops">
                  {d.stops.map((s, i) => {
                    const leg = d.legs[i]
                    return (
                      <li key={s.itemId} id={`trip-stop-${s.itemId}`} className="trip-stop" data-focused={focusedItemId === s.itemId || undefined}>
                        <div className="trip-stop__row">
                          <button type="button" className="trip-stop__main" onClick={() => props.onFocusItem(s)}>
                            <span className="trip-stop__num" style={{ background: color(d) }} aria-hidden="true">
                              {s.order}
                            </span>
                            <span className="trip-stop__text">
                              <span className="trip-stop__title">
                                <span className="sr-only">Stop {s.order}: </span>
                                {s.info.title}
                              </span>
                              <span className="trip-stop__meta">
                                {s.timeRange ?? 'Not placed'} · {formatTime(s.durationMin)} · {TRIP_KIND_LABEL[s.kind]}
                              </span>
                            </span>
                          </button>
                          {s.item.type !== 'program' && !s.item.startTime && (
                            <span className="trip-stop__tools">
                              <button type="button" aria-label={`Move ${s.info.title} earlier`} onClick={() => props.onMove(s.itemId, -1)}>
                                ↑
                              </button>
                              <button type="button" aria-label={`Move ${s.info.title} later`} onClick={() => props.onMove(s.itemId, 1)}>
                                ↓
                              </button>
                            </span>
                          )}
                          <button
                            type="button"
                            className="trip-stop__remove"
                            aria-label={`Remove ${s.info.title} from ${d.label}`}
                            onClick={() => props.onRemove(s.itemId)}
                          >
                            ×
                          </button>
                        </div>
                        {leg && (
                          <div className={`trip-leg trip-leg--${leg.fit}`}>
                            <label>
                              <span className="sr-only">
                                Way from {s.info.title} to {leg.to.info.title}
                              </span>
                              <select
                                value={s.item.travelMode ?? ''}
                                onChange={(e) =>
                                  props.onSetMode(s.itemId, (e.target.value || undefined) as TravelModeT | undefined)
                                }
                              >
                                {MODE_OPTIONS.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.value === '' ? `Auto (${MODE_WORD[leg.autoMode].toLowerCase()})` : o.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <span className="trip-leg__summary">{legSummary(leg)}</span>
                            {legNote(leg) && <span className="trip-leg__note">{legNote(leg)}</span>}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>

                {d.unmapped.length > 0 && (
                  <p className="trip-day__unmapped">
                    Not on the map (no place attached):{' '}
                    {d.unmapped.map((s) => `${s.info.title}${s.timeRange ? `, ${s.timeRange}` : ''}`).join('; ')}.
                  </p>
                )}
              </section>
            ))}
          </>
        )}

        <p className="trip-panel__foot">
          <Link to="/trip">Change times and days on the trip board →</Link>
        </p>
      </div>
    </div>
  )
}
