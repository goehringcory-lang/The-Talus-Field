// =============================================================================
// /backpacking/:tripId: one overnight route, night by night. The measured
// numbers and the profile (camps and water marked on it), then each day: how
// far, how much climbing, every water source in the order you reach it, and
// the night's camp with the rule that makes it legal. Then the permit, the
// trailheads, the hazards and the sources.
//
// The text is bundled (content/backpacking.ts); the route, the profile and
// the mile marks come from the routes file (scripts/gen-backpacking-routes.ts),
// which the map overview pack keeps offline. Without it the page still reads
// in full, with the published figures and no mile marks.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ElevationProfile from '../components/ElevationProfile'
import GatedChrome from '../components/GatedChrome'
import Plate from '../components/Plate'
import ResponsivePhoto from '../components/ResponsivePhoto'
import Button from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import PageHeader from '../components/ui/PageHeader'
import { REGION_SHORT, getHikeById } from '../content'
import { getBackpackTripById } from '../content/backpacking'
import { BACKPACK_RULES } from '../content/backpacking-rules'
import { formatElevation } from '../content/labels'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import { directionsUrl } from '../map/kinds'
import { exportBackpackGpx } from '../backpacking/gpx'
import { CAMP_KIND_LABEL, LEVEL_LABEL, WATER_LABEL, longestDryStretch, nightsLabel, planDays } from '../backpacking/plan'
import { hasRoute, loadRoutes, type BackpackRouteT } from '../backpacking/routes'
import type { ShareFileMethod } from '../lib/shareFile'
import NotFound from './NotFound'
import './HikeDetail.css'
import './Backpacking.css'

const ROUTE_LABEL = { 'out-and-back': 'Out and back', loop: 'Loop', lollipop: 'Lollipop loop', 'one-way': 'One way' } as const

type RouteState = { status: 'none' } | { status: 'loading' } | { status: 'ready'; route: BackpackRouteT } | { status: 'error' }

function useRoute(tripId: string | undefined): RouteState {
  const [state, setState] = useState<RouteState>(() =>
    tripId && hasRoute(tripId) ? { status: 'loading' } : { status: 'none' },
  )
  useEffect(() => {
    let cancelled = false
    // Deferred, the house pattern: no state update inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      if (!tripId || !hasRoute(tripId)) {
        setState({ status: 'none' })
        return
      }
      setState({ status: 'loading' })
      try {
        const routes = await loadRoutes()
        if (!cancelled) setState(routes[tripId] ? { status: 'ready', route: routes[tripId] } : { status: 'none' })
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    })
    return () => {
      cancelled = true
    }
  }, [tripId])
  return state
}

export default function BackpackTrip() {
  const { tripId } = useParams()
  const trip = tripId ? getBackpackTripById(tripId) : undefined
  const routeState = useRoute(trip?.id)
  const route = routeState.status === 'ready' ? routeState.route : null
  const [gpx, setGpx] = useState<{ id: string; result: ShareFileMethod } | null>(null)
  const [exporting, setExporting] = useState(false)

  const days = useMemo(() => (trip && route ? planDays(trip, route) : null), [trip, route])
  const dry = useMemo(() => (trip && route ? longestDryStretch(trip, route) : null), [trip, route])
  const marks = useMemo(() => {
    if (!days) return undefined
    return days.flatMap((d) =>
      d.entries
        .filter((e) => e.kind === 'water' || !e.layover)
        .map((e) =>
          e.kind === 'camp'
            ? { mi: e.mi, kind: 'camp' as const, label: `Night ${e.night}: ${e.camp.name}` }
            : { mi: e.mi, kind: 'water' as const, label: e.water.name },
        ),
    )
  }, [days])

  if (!trip) return <NotFound />
  const hike = trip.hikeId ? getHikeById(trip.hikeId) : undefined
  const gpxResult = gpx && gpx.id === trip.id ? gpx.result : null

  const downloadGpx = async () => {
    if (!route) return
    setExporting(true)
    try {
      setGpx({ id: trip.id, result: await exportBackpackGpx(trip, route) })
    } finally {
      setExporting(false)
    }
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <p className="hike-detail__back">
          <Link to="/backpacking">← All backpacking trips</Link>
        </p>
        <PageHeader
          eyebrow={`${REGION_SHORT[trip.region]} · ${LEVEL_LABEL[trip.level]} · ${nightsLabel(trip)}`}
          title={trip.title}
          intro={trip.description}
        />

        {trip.photo && (
          <Plate
            className="hike-detail__plate"
            tag="Plate · Route"
            credit={PHOTO_CREDITS[trip.photo.src] ? formatCredit(PHOTO_CREDITS[trip.photo.src]) : undefined}
          >
            <ResponsivePhoto
              src={trip.photo.src}
              alt={trip.photo.alt}
              loading="eager"
              width={1200}
              height={900}
              style={{ aspectRatio: '4 / 3', objectFit: 'cover', width: '100%', display: 'block' }}
            />
          </Plate>
        )}

        <p className="hike-detail__chips">
          <Chip variant="meta">{ROUTE_LABEL[trip.route]}</Chip>
          <Chip variant="badge">Wilderness permit</Chip>
          <Chip variant="badge">{trip.season}</Chip>
        </p>

        {/* --- The numbers ------------------------------------------------- */}
        <section aria-label="Trip numbers" className="hike-detail__section">
          <h2 className="hike-detail__heading">The numbers</h2>
          <dl className="hike-stats">
            <div>
              <dt>Distance</dt>
              <dd>
                {(route?.stats.mi ?? trip.distanceMi).toFixed(1)} mi
                <span className="hike-stats__sub">{trip.route === 'one-way' ? 'one way, trailhead to exit' : 'the whole walk'}</span>
              </dd>
            </div>
            <div>
              <dt>Total climbing</dt>
              <dd>
                {(route?.stats.gainFt ?? trip.elevationGainFt).toLocaleString('en-US')} ft
                <span className="hike-stats__sub">{route ? 'from 3DEP terrain data' : 'published figure'}</span>
              </dd>
            </div>
            <div>
              <dt>High point</dt>
              <dd>
                {formatElevation(route?.stats.maxFt ?? trip.highPointFt)}
                {route && <span className="hike-stats__sub">at mile {route.stats.highPointMi.toFixed(1)}</span>}
              </dd>
            </div>
            <div>
              <dt>Nights</dt>
              <dd>
                {nightsLabel(trip)}
                <span className="hike-stats__sub">as planned below</span>
              </dd>
            </div>
            {dry && dry.mi >= 2 && (
              <div className="hike-stats__wide">
                <dt>Longest stretch without reliable water</dt>
                <dd>
                  {dry.mi} mi
                  <span className="hike-stats__sub">
                    {dry.from} to {dry.to}: carry for it
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* --- The route ---------------------------------------------------- */}
        <section aria-label="The route" className="hike-detail__section">
          <h2 className="hike-detail__heading">The route</h2>
          {route && (
            <>
              <ElevationProfile profile={route.profile} highPointMi={route.stats.highPointMi} marks={marks} />
              <p className="hike-detail__fineprint">
                Dashed rules mark each night's camp; dots along the floor are water sources.
                {trip.route === 'out-and-back' && ' Out and back: the profile runs the whole walk, there and back.'}
              </p>
              <p className="hike-detail__actions">
                <Button to={`/map?tab=backpacking&route=${trip.id}`}>See it on the offline map →</Button>
                <Button variant="ghost" disabled={exporting} onClick={downloadGpx}>
                  {exporting ? 'Preparing…' : 'GPX with camps and water'}
                </Button>
              </p>
              {gpxResult === 'shared' && <p className="hike-detail__note">Shared. Open it in your maps app to import the route.</p>}
              {gpxResult === 'downloaded' && (
                <p className="hike-detail__note">Downloaded. Import the .gpx into Gaia, Caltopo, Organic Maps, or a Garmin.</p>
              )}
              {gpxResult === 'failed' && (
                <p className="hike-detail__note">
                  Couldn't hand the file off on this device. Open this page in your phone's browser (outside the
                  installed app) and try again.
                </p>
              )}
              <p className="hike-detail__fineprint">
                Route: {route.source}. Elevations: USGS 3DEP.{' '}
                {route.verified.distance === 'match' && route.verified.gain === 'match'
                  ? 'Verified against the published distance and climbing.'
                  : 'Close to, but not exactly matching, the published figures; trust the signed trail where they differ.'}
              </p>
            </>
          )}
          {routeState.status === 'loading' && <div className="skeleton" style={{ height: 200 }} />}
          {routeState.status === 'error' && (
            <p className="hike-detail__note">
              The route isn't saved on this device yet. Reconnect once, or download the park map under{' '}
              <Link to="/account">Account → Offline</Link>, and the profile and mile marks work offline.
            </p>
          )}
          {routeState.status === 'none' && (
            <p className="hike-detail__note">
              No verified route line for this trip yet: the mapped trail linework does not match its published
              distance closely enough to draw. The camps and water below are checked against park sources; on the
              ground, follow the signed trail.
            </p>
          )}
        </section>

        {/* --- Night by night ------------------------------------------------ */}
        <section aria-label="Night by night" className="hike-detail__section">
          <h2 className="hike-detail__heading">Night by night</h2>
          <ol className="bp-days">
            {trip.days.map((d, i) => {
              const planned = days?.[i]
              const camp = d.campId ? trip.camps.find((c) => c.id === d.campId) : undefined
              const layover = i > 0 && !!d.campId && trip.days[i - 1].campId === d.campId
              const water = planned
                ? planned.entries.filter((e) => e.kind === 'water')
                : []
              const side = d.sideTripId ? trip.sideTrips?.find((s) => s.id === d.sideTripId) : undefined
              return (
                <li key={i} className="bp-dayc">
                  <h3 className="bp-dayc__title">
                    <span className="bp-dayc__num">Day {i + 1}</span>
                    {d.from === d.to ? d.from : `${d.from} to ${d.to}`}
                  </h3>
                  {planned && (
                    <p className="bp-dayc__numbers">
                      {planned.mi > 0
                        ? `${planned.mi.toFixed(1)} mi · +${planned.gainFt.toLocaleString('en-US')} ft / −${planned.lossFt.toLocaleString('en-US')} ft`
                        : 'No miles on the main route'}
                      {planned.sideTrip?.mi
                        ? ` · ${side?.name ?? 'side trip'} ${planned.sideTrip.mi} mi round trip, +${(planned.sideTrip.gainFt ?? 0).toLocaleString('en-US')} ft`
                        : ''}
                    </p>
                  )}
                  <p className="bp-dayc__summary">{d.summary}</p>
                  {side && <p className="hike-detail__callout">{side.note}</p>}

                  {water.length > 0 && (
                    <ul className="bp-water">
                      {water.map((e) =>
                        e.kind === 'water' ? (
                          <li key={`${e.water.id}-${e.mi}`} className={`bp-water__row bp-water__row--${e.water.reliability}`}>
                            <span className="bp-water__mi">mi {e.mi.toFixed(1)}</span>
                            <span className="bp-water__main">
                              <span className="bp-water__name">{e.water.name}</span>
                              <span className="bp-water__meta">
                                {WATER_LABEL[e.water.reliability]} {e.water.kind}
                                {e.returnPass ? ' · on the way back' : ''}
                                {e.water.note && !e.returnPass ? `. ${e.water.note}` : ''}
                              </span>
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  )}

                  {camp && (
                    <div className="bp-camp">
                      <p className="bp-camp__head">
                        <span className="bp-camp__night">Night {trip.days.slice(0, i + 1).filter((x) => x.campId).length}</span>
                        <span className="bp-camp__name">{layover ? `${camp.name}, again` : camp.name}</span>
                        <Chip variant="badge">{CAMP_KIND_LABEL[camp.kind]}</Chip>
                      </p>
                      {!layover && (
                        <>
                          <p className="bp-camp__meta">
                            {formatElevation(camp.elevFt)}
                            {planned ? ` · mile ${planned.endMi.toFixed(1)}` : ''}
                            {camp.facilities ? ` · ${camp.facilities}` : ''}
                          </p>
                          <p className="bp-camp__rules">{camp.rules}</p>
                          <p className="bp-camp__coord">
                            {camp.coord[1].toFixed(5)}, {camp.coord[0].toFixed(5)}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>

        {/* --- Permit and trailheads ------------------------------------------ */}
        <section aria-label="Permit and trailheads" className="hike-detail__section">
          <h2 className="hike-detail__heading">Permit and trailheads</h2>
          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">Apply for this trailhead</span>
              <span className="panel__stamp">Recreation.gov</span>
            </div>
            <div className="panel__grid">
              <div className="readout readout--wide">
                <span className="readout__label">Trailhead on the permit</span>
                <span className="readout__value">{trip.permit.trailhead}</span>
                {trip.permit.quota && <span className="readout__note">{trip.permit.quota} people a day, lottery and 7-day release together</span>}
              </div>
            </div>
          </div>
          <p className="hike-detail__note">{trip.permit.note}</p>

          <p className="hike-detail__note">
            <strong>Start:</strong> {trip.trailhead.name}. {trip.trailhead.parking}
          </p>
          {trip.exit && (
            <p className="hike-detail__note">
              <strong>Finish:</strong> {trip.exit.name}. {trip.exit.parking}
            </p>
          )}
          {trip.transport && <p className="hike-detail__note">{trip.transport}</p>}
          <p className="hike-detail__actions">
            <a className="btn btn--ghost" href={directionsUrl(trip.trailhead.coord)} target="_blank" rel="noreferrer">
              Directions to the trailhead →
            </a>
            {hike && (
              <Link className="btn btn--quiet" to={`/hike/${hike.id}`}>
                The day hike from here →
              </Link>
            )}
          </p>
        </section>

        {/* --- Hazards -------------------------------------------------------- */}
        {trip.hazards.length > 0 && (
          <section aria-label="Know before you go" className="hike-detail__section">
            <h2 className="hike-detail__heading">Know before you go</h2>
            {trip.hazards.map((h) => (
              <p key={h} className="hike-detail__callout hike-detail__callout--hazard">
                {h}
              </p>
            ))}
          </section>
        )}

        {/* --- The rules ------------------------------------------------------ */}
        <section aria-label="Wilderness rules" className="hike-detail__section">
          <h2 className="hike-detail__heading">The rules on every trip</h2>
          {BACKPACK_RULES.map((r) => (
            <details key={r.id} className="bp-rule">
              <summary>{r.title}</summary>
              <p>
                {r.text}{' '}
                <a href={r.source} target="_blank" rel="noreferrer">
                  Source
                </a>
              </p>
            </details>
          ))}
        </section>

        <section aria-label="Sources" className="hike-detail__section">
          <h2 className="hike-detail__heading">Sources</h2>
          <ul className="bp-sources">
            {trip.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="report-link">
          Something on this route wrong or out of date?{' '}
          <Link to={`/report?type=backpacking&id=${trip.id}`}>Tell us →</Link>
        </p>

        <p className="page-footnote">
          Camps and water were checked against park sources in October 2026, not walked for this edition. Water
          that runs in July can be a dry bed by September, and trail and fire closures change week to week: ask at
          the permit station when you collect the permit.
        </p>
      </main>
    </GatedChrome>
  )
}
