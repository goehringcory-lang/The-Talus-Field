// =============================================================================
// /region/:regionId/plan — plan one day in one region.
//
// The region pages read like a book: every stop in driving order. This is the
// same region read as a day. The reader picks which of their trip days the
// region is on, sees that date's light and road, and builds the day from
// three panels (the programs the park runs here that date, the hikes that
// start here with their profiles, the stops and the Secret Guide entries
// here), each pick written straight into the trip plan for that day. Under
// the panels, the day as slotting (trip/slotting.ts) lays it out, with the
// drive between regions drawn in and any leg that cannot be driven in time
// called out (trip/driveCheck.ts).
//
// Four rules. (1) Everything the planner writes is an ordinary plan item on
// an ordinary day, so /trip, /today, the ICS export and sync need nothing new.
// (2) A day can hold more than one region: the handoff card names when to
// leave, the drive, and when you arrive, and "morning" or "afternoon" only
// reorders the day's floating items (published programs keep their clock).
// (3) The day comes from ?day=, mirrored with replaceState like /search, so
// Home can link straight to a day and back-navigation does not stack days.
// (4) Programs are the park's own listings for that date and nothing else: a
// date the feed does not cover yet says so rather than showing an empty list
// as if nothing runs.
// =============================================================================

import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  REGIONS,
  REGION_SHORT,
  RegionEnum,
  getHikesByRegion,
  getRegionMeta,
  getSecretGuideEntries,
  getStopsByRegion,
  type GuideStopT,
  type Region,
} from '../content'
import { REGION_ROAD, roadForHike, typicalRoadState } from '../content/roads'
import { TRACKS } from '../content/trails.generated'
import GatedChrome from '../components/GatedChrome'
import ResponsivePhoto from '../components/ResponsivePhoto'
import RoadNote from '../components/RoadNote'
import TrackSparkline from '../components/TrackSparkline'
import TripDatesForm from '../components/TripDatesForm'
import BackLink from '../components/ui/BackLink'
import { Chip } from '../components/ui/Chip'
import { readTripDates, usePrograms } from '../programs/usePrograms'
import type { ProgramEventT } from '../programs/schema'
import { daylightFit, latestStart } from '../sun/daylight'
import { sunTimes } from '../sun/solar'
import { itemInfo } from '../trip/agendaItem'
import { dayLegs, type DayLeg } from '../trip/driveCheck'
import { regionForCoord, regionForItem } from '../trip/driveTimes'
import { hikeItemId, programItemId, stopItemId, type TripItemT } from '../trip/schema'
import { slotDay, toMinutes, type SlottedItem } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, formatClock } from '../utils/date'
import NotFound from './NotFound'
import './RegionPlan.css'

type Panel = 'programs' | 'hikes' | 'stops'

// A region planner lists at most two weeks of day chips; a longer window
// still works, through ?day= and the trip board.
const MAX_DAY_CHIPS = 14

// The region as a sentence names it ("leave the Valley"); REGION_SHORT is
// the chip label and reads wrong mid-sentence.
const REGION_PROSE: Record<Region, string> = {
  valley: 'the Valley',
  'glacier-mariposa': 'Glacier Point and Mariposa',
  tuolumne: 'Tuolumne',
  'hetch-hetchy': 'Hetch Hetchy',
}

const DAY_PART_LABEL: Record<string, string> = {
  midday: 'Held at lunch',
  sunset: 'Timed to sunset',
  evening: 'The meal on the way out',
}

function itemDay(item: TripItemT): string {
  return item.type === 'program' ? item.snapshot.date : item.day
}

function daysBetween(start: string, end: string): string[] {
  const out: string[] = []
  for (let d = start; d <= end && out.length < 62; d = addDaysIso(d, 1)) out.push(d)
  return out
}

function dayChipLabel(date: string): { weekday: string; short: string } {
  const d = new Date(`${date}T12:00:00Z`)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    short: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
  }
}

function hm(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!h) return `${m} min`
  return m ? `${h} hr ${m} min` : `${h} hr`
}

function AddToggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`plan-add${on ? ' plan-add--on' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from this day` : `Add ${label} to this day`}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {on ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M12 5v14M5 12h14" />}
      </svg>
    </button>
  )
}

export default function RegionPlan() {
  const params = useParams<{ regionId: string }>()
  const parsed = RegionEnum.safeParse(params.regionId)
  const region = parsed.success ? parsed.data : null
  const [searchParams, setSearchParams] = useSearchParams()
  const { plan, addStop, addHike, addProgram, removeItem, orderItems } = useTripPlan()
  const [panel, setPanel] = useState<Panel>('programs')
  // Stored dates, read on every render: setDates writes them and re-renders
  // every plan subscriber, so setting dates here flips the page at once.
  const hasDates = readTripDates() !== null

  const days = useMemo(() => daysBetween(plan.dates.start, plan.dates.end), [plan.dates.start, plan.dates.end])
  const requested = searchParams.get('day')
  // No ?day=: the first day that already has something here, else day one.
  const day =
    requested && days.includes(requested)
      ? requested
      : (days.find((d) => plan.items.some((it) => itemDay(it) === d && regionForItem(it) === region)) ?? days[0])

  const programs = usePrograms(day ?? null, day ?? null)

  const dayItems = useMemo(() => plan.items.filter((it) => itemDay(it) === day), [plan.items, day])
  const slotted = useMemo(() => (day ? slotDay(day, dayItems) : []), [day, dayItems])
  const legs = useMemo(() => dayLegs(slotted), [slotted])

  if (!region) {
    return <NotFound title="That region isn't in the guide." intro="The guide covers four regions; pick one from the front page." />
  }

  const meta = getRegionMeta(region)
  const photo = REGIONS.find((r) => r.id === region)?.photo.src
  const road = REGION_ROAD[region] ?? null
  const sun = day ? sunTimes(day) : null
  const dayIndex = day ? days.indexOf(day) : -1

  function pickDay(d: string) {
    const next = new URLSearchParams(searchParams)
    next.set('day', d)
    setSearchParams(next, { replace: true })
  }

  // Regions already on each day, for the day chips.
  const regionsOn = (d: string): Region[] => {
    const set = new Set<Region>()
    for (const it of plan.items) {
      if (itemDay(it) !== d) continue
      const r = regionForItem(it)
      if (r) set.add(r)
    }
    return [...set]
  }

  // ---- The day, as slotting lays it out ----
  const timed = slotted.filter((s) => s.startMin !== null).sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
  const unplaced = slotted.filter((s) => s.startMin === null)
  const regionsToday = [...new Set(timed.map((s) => regionForItem(s.item)).filter((r): r is Region => r !== null))]
  const multiRegion = regionsToday.length > 1
  const legByTarget = new Map<string, DayLeg>(legs.map((l) => [l.to.item.itemId, l]))
  const handoffs = legs.filter((l) => {
    const a = regionForItem(l.from.item)
    const b = regionForItem(l.to.item)
    return a && b && a !== b
  })
  const shortCount = legs.filter((l) => l.kind === 'short').length
  const overlapCount = legs.filter((l) => l.kind === 'overlap').length
  const mineToday = dayItems.filter((it) => regionForItem(it) === region)
  const firstRegion = timed.length ? regionForItem(timed[0].item) : null
  const hereFirst = firstRegion === region

  let usedMin = 0
  if (sun) {
    for (const s of timed) {
      const a = Math.max(s.startMin ?? 0, sun.sunriseMin)
      const b = Math.min((s.startMin ?? 0) + s.durationMin, sun.sunsetMin)
      usedMin += Math.max(0, b - a)
    }
    for (const l of handoffs) usedMin += Math.min(l.needMin, Math.max(0, sun.sunsetMin - l.fromEndMin))
  }
  const daylightMin = sun ? sun.sunsetMin - sun.sunriseMin : 0

  // ---- Panels ----
  const dayPrograms: ProgramEventT[] = programs.events
    .filter((ev) => ev.date === day && ev.timeStart && ev.source !== 'seasonal')
    .sort((a, b) => (a.timeStart ?? '').localeCompare(b.timeStart ?? ''))
  const herePrograms = dayPrograms.filter((ev) => regionForCoord(ev.coord) === region)
  const unplacedPrograms = dayPrograms.filter((ev) => !ev.coord).length

  const hikes = getHikesByRegion(region)
  // One vertical scale for the region's profiles, so a flat walk reads flat.
  const sparks = hikes.map((h) => TRACKS[h.id]?.spark).filter((sp): sp is number[] => Boolean(sp))
  const sparkRange = sparks.length
    ? { lo: Math.min(...sparks.flat()), hi: Math.max(...sparks.flat()) }
    : undefined
  const core = getStopsByRegion(region)
  const secrets: GuideStopT[] = getSecretGuideEntries().filter(
    (s) => regionForItem({ type: 'stop', itemId: '', stopId: s.id, day: day ?? '' }) === region,
  )

  const has = (itemId: string) => plan.items.some((it) => it.itemId === itemId)
  const pickedHere = {
    programs: herePrograms.filter((ev) => has(programItemId(ev.id))).length,
    hikes: hikes.filter((h) => day && has(hikeItemId(h.id, day))).length,
    stops: [...core, ...secrets].filter((s) => day && has(stopItemId(s.id, day))).length,
  }

  function toggleStop(id: string) {
    if (!day) return
    const itemId = stopItemId(id, day)
    if (has(itemId)) removeItem(itemId)
    else addStop(id, day)
  }
  function toggleHike(id: string) {
    if (!day) return
    const itemId = hikeItemId(id, day)
    if (has(itemId)) removeItem(itemId)
    else addHike(id, day)
  }
  function toggleProgram(ev: ProgramEventT) {
    const itemId = programItemId(ev.id)
    if (has(itemId)) removeItem(itemId)
    else addProgram(ev)
  }

  const otherRegions = REGIONS.filter((r) => r.id !== region)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page region-plan">
        <header className="plan-plate">
          {photo && (
            <ResponsivePhoto src={photo} alt="" loading="eager" width={800} height={450} sizes="(max-width: 760px) 100vw, 720px" />
          )}
          <div className="plan-plate__scrim" aria-hidden="true" />
          <div className="plan-plate__text">
            <span className="eyebrow plan-plate__eyebrow">Plan a day</span>
            <h1 className="plan-plate__title">{meta?.title ?? REGION_SHORT[region]}</h1>
          </div>
        </header>
        <p className="plan-lede">
          Pick the day, then build it from what runs here that date: the park’s programs, the hikes that start here, and
          the stops. Everything you pick goes straight into your trip.{' '}
          <Link to={`/region/${region}`}>Read the region →</Link>
        </p>

        {!hasDates || !day ? (
          <section className="page-section plan-dates" aria-label="Your dates">
            <span className="eyebrow">Step one</span>
            <h2 className="plan-h2">When are you in the park?</h2>
            <p className="plan-note">
              The planner is built on your dates: the programs running those days, the day’s sunrise and sunset, and
              which roads are usually open.
            </p>
            <TripDatesForm />
          </section>
        ) : (
          <>
            <section className="page-section" aria-label="Which day">
              <span className="eyebrow">Which of your days is {REGION_PROSE[region]}?</span>
              <div className="plan-days" role="group" aria-label="Trip days">
                {days.slice(0, MAX_DAY_CHIPS).map((d, i) => {
                  const label = dayChipLabel(d)
                  const here = regionsOn(d)
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`plan-day${d === day ? ' plan-day--on' : ''}`}
                      aria-pressed={d === day}
                      onClick={() => pickDay(d)}
                    >
                      <span className="plan-day__num">Day {i + 1}</span>
                      <span className="plan-day__date">
                        {label.weekday} {label.short}
                      </span>
                      <span className="plan-day__also">
                        {here.length ? here.map((r) => REGION_SHORT[r]).join(' + ') : 'Nothing yet'}
                      </span>
                    </button>
                  )
                })}
              </div>
              {days.length > MAX_DAY_CHIPS && (
                <p className="plan-note">
                  Showing the first two weeks. <Link to="/trip">The trip board</Link> has every day.
                </p>
              )}
            </section>

            {sun && (
              <div className="panel plan-light" aria-label={`Light on ${day}`}>
                <div className="readout">
                  <span className="readout__label">Sunrise</span>
                  <span className="readout__value">{formatClock(sun.sunriseMin)}</span>
                </div>
                <div className="readout">
                  <span className="readout__label">Golden hour</span>
                  <span className="readout__value">{formatClock(sun.goldenPmStartMin)}</span>
                </div>
                <div className="readout">
                  <span className="readout__label">Sunset</span>
                  <span className="readout__value">{formatClock(sun.sunsetMin)}</span>
                </div>
              </div>
            )}
            {road && <RoadNote road={road} dateIso={day} />}

            {/* The handoff: a day that touches more than one region. */}
            <section className="page-section" aria-label="Share the day">
              <span className="eyebrow">The rest of Day {dayIndex + 1}</span>
              {multiRegion ? (
                <div className="plan-handoff">
                  <p className="plan-handoff__title">
                    {regionsToday.map((r) => REGION_SHORT[r]).join(', then ')}
                  </p>
                  {handoffs.map((l) => {
                    const fromR = regionForItem(l.from.item)!
                    const toR = regionForItem(l.to.item)!
                    return (
                      <div key={l.to.item.itemId} className={`plan-handoff__leg${l.kind !== 'ok' ? ' plan-handoff__leg--short' : ''}`}>
                        <div className="readout">
                          <span className="readout__label">Leave {REGION_SHORT[fromR]}</span>
                          <span className="readout__value">{formatClock(l.fromEndMin)}</span>
                        </div>
                        <div className="readout">
                          <span className="readout__label">Drive</span>
                          <span className="readout__value">{hm(l.needMin)}</span>
                        </div>
                        <div className="readout">
                          <span className="readout__label">Reach {REGION_SHORT[toR]}</span>
                          <span className="readout__value">{formatClock(l.fromEndMin + l.needMin)}</span>
                        </div>
                        {l.kind !== 'ok' && (
                          <p className="plan-handoff__warn">
                            {itemInfo(l.to.item).title} starts at {formatClock(l.to.startMin ?? 0)}, before you can get
                            there. Move it to another day, or leave {REGION_PROSE[fromR]} earlier.
                          </p>
                        )}
                      </div>
                    )
                  })}
                  {mineToday.length > 0 && (
                    <div className="plan-order" role="group" aria-label={`When ${REGION_SHORT[region]} happens`}>
                      <button
                        type="button"
                        className={`plan-order__opt${hereFirst ? ' plan-order__opt--on' : ''}`}
                        aria-pressed={hereFirst}
                        onClick={() => orderItems(mineToday.map((it) => it.itemId), 'first')}
                      >
                        {REGION_SHORT[region]} in the morning
                      </button>
                      <button
                        type="button"
                        className={`plan-order__opt${!hereFirst ? ' plan-order__opt--on' : ''}`}
                        aria-pressed={!hereFirst}
                        onClick={() => orderItems(mineToday.map((it) => it.itemId), 'last')}
                      >
                        {REGION_SHORT[region]} in the afternoon
                      </button>
                    </div>
                  )}
                  <p className="plan-note">
                    Drive times are the park’s published driving times plus a few minutes to park. Published programs
                    keep their times; the rest of the day moves around them.
                  </p>
                </div>
              ) : (
                <p className="plan-note">
                  All day here, or half of it somewhere else. Add the other half from its own planner and the drive is
                  worked in:
                </p>
              )}
              <div className="plan-others">
                {otherRegions.map((r) => (
                  <Link key={r.id} className="plan-others__link" to={`/region/${r.id}/plan?day=${day}`}>
                    + {REGION_SHORT[r.id]}
                  </Link>
                ))}
              </div>
            </section>

            {/* The three panels */}
            <section className="page-section plan-panels" aria-label="Build the day">
              <div className="plan-tabs" role="tablist" aria-label="Build the day from">
                {(
                  [
                    ['programs', 'Programs', herePrograms.length, pickedHere.programs],
                    ['hikes', 'Hikes', hikes.length, pickedHere.hikes],
                    ['stops', 'Stops', core.length + secrets.length, pickedHere.stops],
                  ] as [Panel, string, number, number][]
                ).map(([key, label, count, picked]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`plan-tab-${key}`}
                    aria-controls={`plan-panel-${key}`}
                    aria-selected={panel === key}
                    className={`plan-tab${panel === key ? ' plan-tab--on' : ''}`}
                    onClick={() => setPanel(key)}
                  >
                    {label}
                    <span className="plan-tab__count">{picked ? `${picked} picked` : count}</span>
                  </button>
                ))}
              </div>

              {panel === 'programs' && (
                <div role="tabpanel" id="plan-panel-programs" aria-labelledby="plan-tab-programs">
                  {programs.loading && herePrograms.length === 0 ? (
                    <p className="plan-note">Reading the park’s program listings for this date…</p>
                  ) : herePrograms.length === 0 ? (
                    <p className="plan-note">
                      {programs.coverage === 'none'
                        ? 'No program listings reach this date yet. The park publishes its schedule an edition at a time, about five weeks ahead; check back closer to the trip.'
                        : `Nothing the park lists meets in ${REGION_PROSE[region]} this date.`}{' '}
                      <Link to="/programs">All programs →</Link>
                    </p>
                  ) : (
                    <ul className="plan-list">
                      {herePrograms.map((ev) => {
                        const on = has(programItemId(ev.id))
                        const leg = legByTarget.get(programItemId(ev.id))
                        return (
                          <li key={ev.id} className="plan-row">
                            <span className="plan-row__time">
                              {formatClock(toMinutes(ev.timeStart!))}
                              {ev.timeEnd && <span className="plan-row__until">to {formatClock(toMinutes(ev.timeEnd))}</span>}
                            </span>
                            <div className="plan-row__main">
                              <span className="plan-row__title">{ev.title}</span>
                              {ev.location && <span className="plan-row__meta">{ev.location}</span>}
                              <span className="plan-row__chips">
                                {ev.isFree === true && <Chip variant="badge">Free</Chip>}
                                {ev.reservationRequired === true && <Chip variant="badge">Reservation</Chip>}
                                {ev.familyFriendly === true && <Chip variant="badge">All ages</Chip>}
                                {ev.accessible === true && <Chip variant="badge">Wheelchair accessible</Chip>}
                              </span>
                              {on && leg && leg.kind === 'short' && (
                                <span className="plan-row__warn">
                                  Needs about {hm(leg.needMin)} from {itemInfo(leg.from.item).title}; the day leaves{' '}
                                  {hm(Math.max(0, leg.gapMin))}.
                                </span>
                              )}
                            </div>
                            <AddToggle on={on} label={ev.title} onClick={() => toggleProgram(ev)} />
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {unplacedPrograms > 0 && (
                    <p className="plan-note">
                      {unplacedPrograms} more {unplacedPrograms === 1 ? 'program' : 'programs'} this date{' '}
                      {unplacedPrograms === 1 ? 'has' : 'have'} no meeting point the guide can place.{' '}
                      <Link to="/programs">All programs →</Link>
                    </p>
                  )}
                </div>
              )}

              {panel === 'hikes' && (
                <div role="tabpanel" id="plan-panel-hikes" aria-labelledby="plan-tab-hikes">
                  <p className="plan-note">Every day hike that starts in {REGION_PROSE[region]}, with its elevation profile.</p>
                  <ul className="plan-list">
                    {hikes.map((h) => {
                      const on = day ? has(hikeItemId(h.id, day)) : false
                      const track = TRACKS[h.id]
                      const hikeRoad = roadForHike(h)
                      const closed = hikeRoad && day ? typicalRoadState(hikeRoad, day).state : null
                      const start = day ? latestStart(day, h.durationMin) : null
                      return (
                        <li key={h.id} className="plan-row plan-row--hike">
                          <div className="plan-row__main">
                            <Link className="plan-row__title" to={`/hike/${h.id}`}>
                              {h.title}
                            </Link>
                            {track && <TrackSparkline spark={track.spark} range={sparkRange} />}
                            <span className="plan-row__stats">
                              {h.distanceMi} mi · {h.elevationGainFt.toLocaleString()} ft · {hm(h.durationMin)} · {h.difficulty}
                            </span>
                            <span className="plan-row__meta">Starts: {h.trailhead}</span>
                            {start && !start.beforeSunrise && (
                              <span className="plan-row__meta">Start by {formatClock(start.latestStartMin)} to finish an hour before sunset.</span>
                            )}
                            {start && start.beforeSunrise && (
                              <span className="plan-row__meta">Longer than this date’s light: the first hours are by headlamp.</span>
                            )}
                            {closed && closed !== 'open' && (
                              <span className="plan-row__warn">
                                {closed === 'closed' ? 'The road to this trailhead is usually closed on this date.' : 'The road to this trailhead may be closed on this date.'}
                              </span>
                            )}
                            {h.permit && <span className="plan-row__meta">{h.permit}</span>}
                          </div>
                          <AddToggle on={on} label={h.title} onClick={() => toggleHike(h.id)} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {panel === 'stops' && (
                <div role="tabpanel" id="plan-panel-stops" aria-labelledby="plan-tab-stops">
                  <p className="plan-note">
                    Lunch spots hold midday and the sunset viewpoints hold the last light; everything else fits around your
                    programs.
                  </p>
                  <ul className="plan-list">
                    {[...core, ...secrets].map((s) => {
                      const on = day ? has(stopItemId(s.id, day)) : false
                      const secret = secrets.includes(s)
                      return (
                        <li key={s.id} className="plan-row">
                          <div className="plan-row__main">
                            <span className={`plan-row__kind${secret ? ' plan-row__kind--secret' : ''}`}>
                              {[secret ? 'Secret Guide' : null, s.dayPart ? DAY_PART_LABEL[s.dayPart] : null, s.timeBudgetMin ? hm(s.timeBudgetMin) : null]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                            <Link className="plan-row__title" to={`/stop/${s.id}`}>
                              {s.title}
                            </Link>
                            {s.teaser && <span className="plan-row__teaser">{s.teaser}</span>}
                          </div>
                          <AddToggle on={on} label={s.title} onClick={() => toggleStop(s.id)} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </section>

            {/* The day */}
            <section className="page-section plan-dayview" aria-label="Your day" id="your-day">
              <span className="eyebrow">
                Your day · Day {dayIndex + 1} · {dayChipLabel(day).weekday} {dayChipLabel(day).short}
              </span>
              {daylightMin > 0 && (
                <div className="plan-meter">
                  <span className="plan-meter__track" aria-hidden="true">
                    <span className="plan-meter__fill" style={{ width: `${Math.min(100, Math.round((usedMin / daylightMin) * 100))}%` }} />
                  </span>
                  <span className="dateline">
                    {hm(usedMin)} planned in {hm(daylightMin)} of daylight
                    {shortCount + overlapCount > 0
                      ? ` · ${shortCount + overlapCount} timing ${shortCount + overlapCount === 1 ? 'problem' : 'problems'}`
                      : ''}
                  </span>
                </div>
              )}
              {timed.length === 0 && unplaced.length === 0 ? (
                <p className="plan-note">Nothing on this day yet. Tap + on anything above.</p>
              ) : (
                <ol className="plan-timeline">
                  {sun && (
                    <li className="plan-tl plan-tl--marker">
                      <span className="plan-tl__time">{formatClock(sun.sunriseMin)}</span>
                      <span className="plan-tl__title">Sunrise</span>
                    </li>
                  )}
                  {timed.map((s: SlottedItem) => {
                    const info = itemInfo(s.item)
                    const leg = legByTarget.get(s.item.itemId)
                    const r = regionForItem(s.item)
                    const fromR = leg ? regionForItem(leg.from.item) : null
                    const crossing = leg && r && fromR && r !== fromR
                    const dark = s.item.type === 'hike' && daylightFit(day, s.startMin ?? 0, s.durationMin)?.verdict === 'dark'
                    const afterSunset = sun && (s.startMin ?? 0) >= sun.sunsetMin
                    return (
                      <li key={s.item.itemId} className="plan-tl__group">
                        {leg && (crossing || leg.kind !== 'ok') && (
                          <div className={`plan-tl plan-tl--drive${leg.kind !== 'ok' ? ' plan-tl--short' : ''}`}>
                            <span className="plan-tl__time">{formatClock(leg.fromEndMin)}</span>
                            <span className="plan-tl__title">
                              {leg.kind === 'overlap'
                                ? `Overlaps ${itemInfo(leg.from.item).title}`
                                : crossing
                                  ? `Drive to ${REGION_SHORT[r!]}`
                                  : 'Getting there'}
                            </span>
                            <span className="plan-tl__meta">
                              {leg.kind === 'ok'
                                ? `About ${hm(leg.needMin)}`
                                : leg.kind === 'short'
                                  ? `Needs about ${hm(leg.needMin)}. The day leaves ${hm(Math.max(0, leg.gapMin))}.`
                                  : 'Two things at once. Pick one, or move one to another day.'}
                            </span>
                          </div>
                        )}
                        {sun && afterSunset && timed.indexOf(s) > 0 && (timed[timed.indexOf(s) - 1].startMin ?? 0) < sun.sunsetMin && (
                          <div className="plan-tl plan-tl--marker">
                            <span className="plan-tl__time">{formatClock(sun.sunsetMin)}</span>
                            <span className="plan-tl__title">Sunset</span>
                          </div>
                        )}
                        <div className={`plan-tl${leg?.kind === 'short' ? ' plan-tl--late' : ''}`}>
                          <span className="plan-tl__time">{formatClock(s.startMin ?? 0)}</span>
                          <span className="plan-tl__title">
                            {info.href ? <Link to={info.href}>{info.title}</Link> : info.title}
                          </span>
                          <span className="plan-tl__meta">
                            {[multiRegion && r ? REGION_SHORT[r] : null, s.fixed && s.item.type === 'program' ? 'Published time' : null, `until ${formatClock((s.startMin ?? 0) + s.durationMin)}`]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                          {dark && <span className="plan-row__warn">Finishes after sunset. Start earlier, or pick a shorter hike.</span>}
                        </div>
                      </li>
                    )
                  })}
                  {sun && (timed.length === 0 || (timed[timed.length - 1].startMin ?? 0) < sun.sunsetMin) && (
                    <li className="plan-tl plan-tl--marker">
                      <span className="plan-tl__time">{formatClock(sun.sunsetMin)}</span>
                      <span className="plan-tl__title">Sunset</span>
                    </li>
                  )}
                </ol>
              )}
              {unplaced.length > 0 && (
                <p className="plan-row__warn">
                  Doesn’t fit this day: {unplaced.map((s) => itemInfo(s.item).title).join(', ')}. Move it to another day on
                  the trip board, or drop something.
                </p>
              )}
              <div className="plan-actions">
                <Link className="plan-cta" to="/trip">
                  Open the trip board →
                </Link>
              </div>
            </section>
          </>
        )}

        <BackLink to={`/region/${region}`} label={`Back to ${REGION_PROSE[region]}`} />
      </main>
    </GatedChrome>
  )
}
