// =============================================================================
// The map's info card for the two things the popups cannot carry: a trail
// (photo, the verified numbers, the description, the elevation profile, which
// is React and draws offline from the cached track) and a program meeting
// point (what starts there, when, and an Add to trip per program). A side
// panel on wide screens and a bottom sheet on phones, in the same instrument
// voice as the rest of the map chrome.
// =============================================================================

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ElevationProfile from '../components/ElevationProfile'
import ResponsivePhoto from '../components/ResponsivePhoto'
import type { HikeT } from '../content'
import { formatTime } from '../content/labels'
import type { ProgramEventT } from '../programs/schema'
import { useTrack } from '../trails/useTrack'
import { announceTripAdd } from '../trip/addFeedback'
import { programItemId } from '../trip/schema'
import { addHikeToPlan, isHikePlanned, useTripPlan } from '../trip/useTripPlan'
import { formatClock, formatDayHeader } from '../utils/date'
import { directionsUrl } from './kinds'
import type { ProgramPoint } from './programPoints'
import { TRAIL_LABEL, trailColors } from './theme'

export type MapCardSelection = { kind: 'trail'; hike: HikeT } | { kind: 'program'; point: ProgramPoint }

type Props = {
  selection: MapCardSelection
  onClose: () => void
  onFlyTo: () => void
}

function TrailCard({ hike, onFlyTo }: { hike: HikeT; onFlyTo: () => void }) {
  const track = useTrack(hike.id)
  const { plan } = useTripPlan()
  const planned = plan.items.some((it) => it.type === 'hike' && it.hikeId === hike.id)
  const color = trailColors()[hike.difficulty]
  return (
    <>
      {hike.photo && (
        <ResponsivePhoto className="map-card__photo" src={hike.photo.src} alt={hike.photo.alt} sizes="400px" loading="lazy" />
      )}
      <h2 className="map-card__title" id="map-card-title">
        {hike.title}
      </h2>
      <p className="map-card__eyebrow" style={{ color }}>
        Day hike · {TRAIL_LABEL[hike.difficulty]}
      </p>
      <dl className="map-card__stats">
        <div>
          <dt>Distance</dt>
          <dd>
            {hike.distanceMi} mi{hike.route === 'one-way' ? ' one-way' : ''}
          </dd>
        </div>
        <div>
          <dt>Gain</dt>
          <dd>{hike.elevationGainFt.toLocaleString('en-US')} ft</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>~{formatTime(hike.durationMin)}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{hike.trailhead}</dd>
        </div>
      </dl>
      <p className="map-card__text">{hike.description}</p>
      {hike.hazard && <p className="map-card__text map-card__hazard">{hike.hazard}</p>}
      {track.status === 'ready' ? (
        <ElevationProfile profile={track.track.profile} highPointMi={track.track.stats.highPointMi} />
      ) : track.status === 'error' ? (
        <p className="map-card__note">
          The elevation profile needs the trail tracks pack offline (Account, Offline).
        </p>
      ) : null}
      <p className="map-card__actions">
        <button type="button" className="map-popup__btn" onClick={onFlyTo}>
          Fly to
        </button>
        <button
          type="button"
          className="map-popup__btn"
          disabled={planned}
          onClick={() => {
            if (isHikePlanned(hike.id)) return
            addHikeToPlan(hike.id)
            announceTripAdd(hike.title)
          }}
        >
          {planned ? 'In trip ✓' : 'Add to trip'}
        </button>
        <Link className="map-popup__btn" to={`/hike/${hike.id}`}>
          Trail page →
        </Link>
        {hike.coord && (
          <a className="map-popup__btn map-popup__btn--dir" href={directionsUrl(hike.coord)} target="_blank" rel="noopener">
            Directions →
          </a>
        )}
      </p>
    </>
  )
}

function eventWhen(ev: ProgramEventT): string {
  const day = formatDayHeader(ev.date)
  if (!ev.timeStart) return day
  const [h, m] = ev.timeStart.split(':').map(Number)
  return `${day}, ${formatClock(h * 60 + m)}`
}

function ProgramCard({ point, onFlyTo }: { point: ProgramPoint; onFlyTo: () => void }) {
  const { plan, addProgram } = useTripPlan()
  const inPlan = new Set(plan.items.map((it) => it.itemId))
  return (
    <>
      <h2 className="map-card__title" id="map-card-title">
        {point.location}
      </h2>
      <p className="map-card__eyebrow">Program meeting point</p>
      <ul className="map-card__events">
        {point.events.slice(0, 12).map((ev) => {
          const planned = inPlan.has(programItemId(ev.id))
          return (
            <li key={ev.id}>
              <span className="map-card__when">{eventWhen(ev)}</span>
              <span className="map-card__what">{ev.title}</span>
              <button
                type="button"
                className="map-popup__btn map-popup__btn--inline"
                disabled={planned}
                aria-label={planned ? `${ev.title} is in your trip` : `Add ${ev.title}, ${eventWhen(ev)}, to your trip`}
                onClick={() => {
                  addProgram(ev)
                  announceTripAdd(ev.title)
                }}
              >
                {planned ? 'In trip ✓' : 'Add to trip'}
              </button>
            </li>
          )
        })}
      </ul>
      {point.events.length > 12 && <p className="map-card__note">And {point.events.length - 12} more on the programs page.</p>}
      <p className="map-card__actions">
        <button type="button" className="map-popup__btn" onClick={onFlyTo}>
          Fly to
        </button>
        <Link className="map-popup__btn" to="/programs">
          All programs →
        </Link>
        <a className="map-popup__btn map-popup__btn--dir" href={directionsUrl(point.coord)} target="_blank" rel="noopener">
          Directions →
        </a>
      </p>
    </>
  )
}

export default function MapCard({ selection, onClose, onFlyTo }: Props) {
  const ref = useRef<HTMLElement>(null)
  // The card takes focus when it opens (and when it switches to another
  // selection), so keyboard and screen-reader users land in it; Escape closes.
  const key = selection.kind === 'trail' ? selection.hike.id : selection.point.id
  useEffect(() => {
    ref.current?.focus()
  }, [key])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <section
      ref={ref}
      className="map-card"
      aria-labelledby="map-card-title"
      tabIndex={-1}
    >
      <button type="button" className="map-card__close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {selection.kind === 'trail' ? (
        <TrailCard hike={selection.hike} onFlyTo={onFlyTo} />
      ) : (
        <ProgramCard point={selection.point} onFlyTo={onFlyTo} />
      )}
    </section>
  )
}
