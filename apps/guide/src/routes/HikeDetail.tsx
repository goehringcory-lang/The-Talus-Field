// =============================================================================
// /hike/:hikeId — the granular trail page for a day hike: verified stats, the
// full elevation profile, a derived difficulty breakdown, the track on the
// offline map, and a GPX export for dedicated GPS apps and watches.
//
// Track data (geometry + profile) comes from public/tracks/<id>.json —
// USGS/NPS trail linework with 3DEP elevations, generated and validated by
// scripts/gen-hike-tracks.mjs. Hikes whose linework could not be verified
// render everything except the track, and say so plainly.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import ElevationProfile from '../components/ElevationProfile'
import SeasonalNotices from '../components/SeasonalNotices'
import Button from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import PageHeader from '../components/ui/PageHeader'
import { REGION_SHORT, getHikeById, getStopById } from '../content'
import { DIFFICULTY_LABEL, formatElevation, formatTime } from '../content/labels'
import { directionsUrl } from '../map/kinds'
import { daylightFit, latestStart } from '../sun/daylight'
import { announceTripAdd } from '../trip/addFeedback'
import type { TripItemT } from '../trip/schema'
import { slotPlan, type SlottedItem } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, formatClock, formatDayHeader, parkNowMinutes, todayIso } from '../utils/date'
import { exportGpx, type GpxExportResult } from '../trails/gpx'
import {
  ALTITUDE_NOTE_FT,
  EFFORT_LABEL,
  effortClass,
  energyMiles,
  fullProfile,
  getTrackSummary,
} from '../trails/track'
import { useTrack } from '../trails/useTrack'
import NotFound from './NotFound'
import './HikeDetail.css'

/** The day and slotted block a planned hike landed on, or null. */
function plannedHikeBlock(items: TripItemT[], hikeId: string): { day: string; block: SlottedItem } | null {
  for (const [day, blocks] of slotPlan(items)) {
    const block = blocks.find((b) => b.item.type === 'hike' && b.item.hikeId === hikeId)
    if (block) return { day, block }
  }
  return null
}

const ROUTE_LABEL: Record<string, string> = {
  'out-and-back': 'Out and back',
  loop: 'Loop',
  lollipop: 'Lollipop loop',
  'one-way': 'One way',
}

export default function HikeDetail() {
  const { hikeId } = useParams()
  const hike = hikeId ? getHikeById(hikeId) : undefined
  const trackState = useTrack(hike?.id)
  const summary = hike ? getTrackSummary(hike.id) : undefined
  const { plan, addHike } = useTripPlan()
  // Keyed by hike: the route element is reused across /hike/a -> /hike/b, so
  // a bare result would carry "Saved to your files" onto the next trail's page.
  const [gpxExport, setGpxExport] = useState<{ hikeId: string; result: GpxExportResult } | null>(null)
  const gpxResult = gpxExport && gpxExport.hikeId === hikeId ? gpxExport.result : null
  const [exportingGpx, setExportingGpx] = useState(false)

  const inPlan = useMemo(
    () => !!hike && plan.items.some((it) => it.type === 'hike' && it.hikeId === hike.id),
    [plan, hike],
  )

  // Where the board put this hike, if it is on the plan: the day and the
  // slotted block, so the daylight reading below can judge the plan's own
  // start time and not only today's. Same slotter the board draws from. Not
  // memoized by hand: the plan is a few dozen items at most, and the hooks
  // compiler lint could not preserve a manual memo around the early return.
  const planned = hike && inPlan ? plannedHikeBlock(plan.items, hike.id) : null

  // The daylight reading compares the latest start against the clock, so a
  // page left open through an afternoon has to keep up: same minute pulse as
  // /today.
  const [nowMin, setNowMin] = useState(parkNowMinutes)
  useEffect(() => {
    const t = window.setInterval(() => setNowMin(parkNowMinutes()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  const profile = useMemo(
    () => (trackState.status === 'ready' ? fullProfile(trackState.track) : null),
    [trackState],
  )

  if (!hike) return <NotFound />

  const trailheadStop = hike.stopId ? getStopById(hike.stopId) : undefined
  // Stats prefer the verified track; the catalog numbers are the fallback so
  // the page is complete even for hikes without a track.
  const mi = summary?.mi ?? hike.distanceMi
  const gainFt = summary?.gainFt ?? hike.elevationGainFt
  const em = energyMiles(mi, gainFt)
  const effort = effortClass(em)

  // The daylight reading. Once today's sun is down the panel turns over to
  // tomorrow, the way ParkNowPanel does: a "start by 1:20 p.m." printed at
  // 9 p.m. reads as a time that has passed, not as tomorrow's answer.
  const today = todayIso()
  const todayLight = latestStart(today, hike.durationMin)
  const sunDown = !!todayLight && nowMin >= todayLight.sunsetMin
  const lightDay = sunDown ? addDaysIso(today, 1) : today
  const light = sunDown ? latestStart(lightDay, hike.durationMin) : todayLight
  const tooLate = !sunDown && !!light && nowMin > light.latestStartMin
  const plannedFit =
    planned && planned.block.startMin !== null
      ? daylightFit(planned.day, planned.block.startMin, planned.block.durationMin)
      : null

  const add = () => {
    addHike(hike.id)
    announceTripAdd(hike.title)
  }

  // The share sheet takes a beat to open on iOS. A second tap while it does
  // starts a second share, which the platform refuses, and the refusal renders
  // as "couldn't hand the file off" on an export that was working.
  const downloadGpx = async () => {
    if (trackState.status !== 'ready') return
    setExportingGpx(true)
    try {
      setGpxExport({ hikeId: hike.id, result: await exportGpx(hike, trackState.track) })
    } finally {
      setExportingGpx(false)
    }
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <p className="hike-detail__back">
          <Link to="/hikes">← All day hikes</Link>
        </p>
        <PageHeader
          eyebrow={`${REGION_SHORT[hike.region]} · ${DIFFICULTY_LABEL[hike.difficulty]}`}
          title={hike.title}
          intro={hike.description}
        />

        <p className="hike-detail__chips">
          <Chip variant="meta">{hike.distanceMi} mi{hike.route === 'one-way' ? ' one-way' : ''}</Chip>
          <Chip variant="meta">{hike.elevationGainFt === 0 ? 'Flat' : `${hike.elevationGainFt.toLocaleString('en-US')} ft gain`}</Chip>
          <Chip variant="meta">{ROUTE_LABEL[hike.route]}</Chip>
          <Chip variant="meta">~{formatTime(hike.durationMin)}</Chip>
          {hike.permit && <Chip variant="badge">Permit</Chip>}
          {hike.season && <Chip variant="badge">{hike.season}</Chip>}
        </p>

        {hike.distanceNote && <p className="hike-detail__note">Distance note: {hike.distanceNote}.</p>}

        {/* --- The numbers ---------------------------------------------------- */}
        <section aria-label="Trail numbers" className="hike-detail__section">
          <h2 className="hike-detail__heading">The numbers</h2>
          <dl className="hike-stats">
            <div>
              <dt>Distance</dt>
              <dd>
                {mi.toFixed(mi < 10 ? 1 : 0)} mi
                {hike.route === 'one-way' ? <span className="hike-stats__sub">one-way</span> : <span className="hike-stats__sub">round trip</span>}
              </dd>
            </div>
            <div>
              <dt>Total climbing</dt>
              <dd>
                {gainFt.toLocaleString('en-US')} ft
                {summary && <span className="hike-stats__sub">from 3DEP terrain data</span>}
              </dd>
            </div>
            {summary && (
              <>
                <div>
                  <dt>Elevation band</dt>
                  <dd>
                    {formatElevation(summary.minFt)}–{formatElevation(summary.maxFt)}
                    <span className="hike-stats__sub">high point at mile {summary.highPointMi.toFixed(1)}</span>
                  </dd>
                </div>
                <div>
                  <dt>Steepest sustained</dt>
                  <dd>
                    {summary.maxGradePct}% grade
                    <span className="hike-stats__sub">over a quarter mile</span>
                  </dd>
                </div>
              </>
            )}
            <div>
              <dt>Effort score</dt>
              <dd>
                {em.toFixed(1)}
                <span className="hike-stats__sub">
                  energy miles · {EFFORT_LABEL[effort]}
                </span>
              </dd>
            </div>
            <div>
              <dt>Time budget</dt>
              <dd>
                ~{formatTime(hike.durationMin)}
                <span className="hike-stats__sub">generous, for planning</span>
              </dd>
            </div>
          </dl>
          <p className="hike-detail__fineprint">
            Effort score is distance plus a mile per 500 ft of climbing (Petzoldt's energy miles),
            computed from {summary ? 'the verified track' : 'the published stats'}.
            {summary && summary.maxFt >= ALTITUDE_NOTE_FT && (
              <> This trail tops {formatElevation(Math.floor(summary.maxFt / 1000) * 1000)}: expect the
              altitude to tax lowland lungs beyond what the numbers suggest.</>
            )}
          </p>
        </section>

        {/* --- Daylight ----------------------------------------------------- */}
        {/* The time budget and the sunset, put together: the latest start that
            gets you down with an hour of light in hand. Computed on-device, so
            it works at a trailhead with no signal, which is where the question
            gets asked. */}
        {light && (
          <section aria-label="Daylight" className="hike-detail__section">
            <h2 className="hike-detail__heading">Daylight</h2>
            <div className="panel">
              <div className="panel__head">
                <span className="panel__title">
                  {sunDown ? `Tomorrow · ${formatDayHeader(lightDay)}` : formatDayHeader(lightDay)}
                </span>
                <span className="panel__stamp">Computed on-device</span>
              </div>
              <div className="panel__grid">
                <div className="readout">
                  <span className="readout__label">Sunset</span>
                  <span className="readout__value">{formatClock(light.sunsetMin)}</span>
                  <span className="readout__note">Sunrise {formatClock(light.sunriseMin)}</span>
                </div>
                <div className="readout">
                  <span className="readout__label">Start by</span>
                  <span
                    className={
                      tooLate
                        ? 'readout__value readout__value--alert'
                        : 'readout__value readout__value--signal'
                    }
                  >
                    {formatClock(light.latestStartMin)}
                  </span>
                  <span className="readout__note">
                    {light.beforeSunrise
                      ? 'Before sunrise · the first hours are by headlamp'
                      : tooLate
                        ? `Past it for today · a start now finishes ${formatClock(nowMin + hike.durationMin)}`
                        : 'Finishes with an hour of light in hand'}
                  </span>
                </div>
                {planned && plannedFit && planned.block.startMin !== null && (
                  <div className="readout readout--wide">
                    <span className="readout__label">On your plan</span>
                    <span
                      className={
                        plannedFit.verdict === 'dark'
                          ? 'readout__value readout__value--alert'
                          : plannedFit.verdict === 'tight'
                            ? 'readout__value readout__value--signal'
                            : 'readout__value'
                      }
                    >
                      {formatDayHeader(planned.day)} · {formatClock(planned.block.startMin)} –{' '}
                      {formatClock(plannedFit.endMin)}
                    </span>
                    <span className="readout__note">
                      {plannedFit.verdict === 'dark'
                        ? `Finishes after sunset at ${formatClock(plannedFit.sunsetMin)} · start earlier or carry a headlamp`
                        : plannedFit.verdict === 'tight'
                          ? `Finishes ${formatTime(Math.max(1, plannedFit.lightLeftMin))} before sunset · inside the hour margin`
                          : `Finishes with ${formatTime(plannedFit.lightLeftMin)} of light to spare`}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="hike-detail__fineprint">
              Start by is the time budget above plus an hour of margin, counted back from sunset.
              The budget is generous but not a promise, and canyon walls take the light off the
              valley floor well before the horizon does. The long days are started before dawn
              on purpose; carry the headlamp either way.
            </p>
          </section>
        )}

        {/* --- Elevation profile ---------------------------------------------- */}
        <section aria-label="Elevation profile" className="hike-detail__section">
          <h2 className="hike-detail__heading">Elevation profile</h2>
          {trackState.status === 'ready' && profile && (
            <>
              <ElevationProfile profile={profile} highPointMi={trackState.track.stats.highPointMi} />
              {hike.route === 'out-and-back' && (
                <p className="hike-detail__fineprint">
                  Out and back: the profile shows the full round trip, turning around at mile{' '}
                  {trackState.track.lineMi.toFixed(1)}.
                </p>
              )}
            </>
          )}
          {trackState.status === 'loading' && <div className="skeleton" style={{ height: 200 }} />}
          {trackState.status === 'error' && (
            <p className="hike-detail__note">
              The trail data for this hike isn't saved on this device yet. Reconnect once, or
              download the Trail tracks pack under{' '}
              <Link to="/account">Account → Offline</Link>, and the profile works in airplane mode.
            </p>
          )}
          {trackState.status === 'none' && (
            <p className="hike-detail__note">
              No verified track for this hike yet: the available trail linework (USGS/NPS and
              OpenStreetMap) doesn't carry this route accurately enough to publish. The distance
              and climbing numbers above are cross-checked against NPS trail pages; navigation on
              the ground is the signed trail.
            </p>
          )}
        </section>

        {/* --- Track actions --------------------------------------------------- */}
        {trackState.status === 'ready' && (
          <section aria-label="Trail track" className="hike-detail__section">
            <h2 className="hike-detail__heading">On the map</h2>
            <p className="hike-detail__actions">
              <Button to={`/map?hike=${hike.id}`}>See the track on the offline map →</Button>
              <Button variant="ghost" disabled={exportingGpx} onClick={downloadGpx}>
                {exportingGpx ? 'Preparing…' : 'GPX for your GPS app'}
              </Button>
            </p>
            {gpxResult === 'shared' && (
              <p className="hike-detail__note">Shared. Open the file in your maps app to import the track.</p>
            )}
            {gpxResult === 'downloaded' && (
              <p className="hike-detail__note">Downloaded. Import the .gpx into Gaia, Caltopo, organic maps, or a Garmin.</p>
            )}
            {gpxResult === 'failed' && (
              <p className="hike-detail__note">
                Couldn't hand the file off on this device. Open this page in your phone's browser
                (outside the installed app) and try again.
              </p>
            )}
            {trackState.track.note && <p className="hike-detail__note">{trackState.track.note}</p>}
            <p className="hike-detail__fineprint">
              Track: {trackState.track.source.geometry}. Elevations: {trackState.track.source.elevation}.{' '}
              {trackState.track.verified.distance === 'match' && trackState.track.verified.gain === 'match'
                ? 'Verified against the published distance and climbing.'
                : 'Close to, but not exactly matching, the published numbers; trust the signed trail where they differ.'}
            </p>
          </section>
        )}

        {/* --- Seasonal notices for this trail --------------------------------- */}
        <SeasonalNotices stopIds={hike.stopId ? [hike.stopId] : []} />

        {/* --- Know before you go ---------------------------------------------- */}
        {(hike.permit || hike.hazard || hike.season) && (
          <section aria-label="Know before you go" className="hike-detail__section">
            <h2 className="hike-detail__heading">Know before you go</h2>
            {hike.permit && <p className="hike-detail__callout">{hike.permit}</p>}
            {hike.hazard && <p className="hike-detail__callout hike-detail__callout--hazard">{hike.hazard}</p>}
            {hike.season && <p className="hike-detail__note">Season: {hike.season}.</p>}
          </section>
        )}

        {/* --- Trailhead -------------------------------------------------------- */}
        <section aria-label="Trailhead" className="hike-detail__section">
          <h2 className="hike-detail__heading">Trailhead</h2>
          <p className="hike-detail__note">{hike.trailhead}.</p>
          <p className="hike-detail__actions">
            {hike.coord && (
              <a className="btn btn--ghost" href={directionsUrl(hike.coord)} target="_blank" rel="noreferrer">
                Directions to the trailhead →
              </a>
            )}
            {trailheadStop && (
              <Link className="btn btn--quiet" to={`/stop/${trailheadStop.id}`}>
                Trailhead in the guide →
              </Link>
            )}
          </p>
        </section>

        <p className="hike-detail__actions hike-detail__actions--plan">
          {inPlan ? (
            <Button variant="ghost" to="/trip">
              In your trip plan →
            </Button>
          ) : (
            <Button onClick={add}>Add to trip plan</Button>
          )}
        </p>

        <p className="page-footnote">
          Stats cross-checked against NPS trail pages and the yosemitehikes.com index; conditions
          and closures change, so check trail status at a visitor center before a big day.
        </p>
      </main>
    </GatedChrome>
  )
}
