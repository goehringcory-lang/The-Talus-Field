import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AMENITIES,
  HIKES,
  getRegionMeta,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  isSecretGuideEntry,
  type GuideStopT,
} from '../content'
import { DIFFICULTY_LABEL } from '../content/labels'
import NotFound from './NotFound'
import GatedChrome from '../components/GatedChrome'
import PrevNextNav from '../components/PrevNextNav'
import SeasonalNotices from '../components/SeasonalNotices'
import ShareStopButton from '../components/ShareStopButton'
import StopCard from '../components/StopCard'
import Button from '../components/ui/Button'
import BackLink from '../components/ui/BackLink'
import { directionsUrl } from '../map/kinds'
import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'
import { formatMiles, haversineMiles } from '../utils/geo'
import { useStopNote } from '../lib/stopNotes'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from '../weather/staleness'
import { regionTodayLine } from '../weather/todayLine'
import { useDocumentTitle } from '../lib/documentTitle'
import { recordView } from '../lib/recentlyViewed'
import { isSyncEnabled } from '../sync/planSync'
import { UNVERIFIED_STOP_IDS } from '../near/unverified'
import { useParking } from '../parking/useParking'
import { LOT_STATUS_LABEL, lotForAmenity } from '../parking/lotMatch'
import { HIDE_AFTER_MS as PARKING_HIDE_MS } from '../parking/staleness'
import { compactStamp } from '../utils/relativeStamp'

// Amenities within this straight-line range of the stop are close enough to
// matter when the stop's own lot is full; beyond it the map is the tool.
const NEARBY_AMENITY_MILES = 3
const NEARBY_AMENITY_MAX = 3

// A note writes on every keystroke, so the confirmation waits for the typing
// to settle rather than flickering per character.
const NOTE_SAVED_AFTER_MS = 700

// Private per-stop notes, stored on the device only.
function StopNotes({ stopId }: { stopId: string }) {
  const [note, setNote] = useStopNote(stopId)
  const [saved, setSaved] = useState(false)
  const timer = useRef(0)
  // With sync on, a note travels to the buyer's other devices; the copy has
  // to say so rather than promise it never leaves this one.
  const [synced] = useState(isSyncEnabled)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Driven from the edit rather than from the note value: an effect would also
  // fire for a note arriving from cross-device sync, which is not this
  // device's write to confirm.
  function edit(value: string) {
    setNote(value)
    setSaved(false)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaved(true), NOTE_SAVED_AFTER_MS)
  }

  return (
    <section aria-label="Your notes" className="page-section">
      <span className="eyebrow">Your notes</span>
      <textarea
        className="field-control"
        rows={3}
        maxLength={2000}
        value={note}
        onChange={(e) => edit(e.target.value)}
        placeholder={`Parking notes, timing, what you'd do differently. ${
          synced ? 'Saved here and synced to your other devices.' : 'Stays on this device.'
        }`}
        aria-label="Your notes for this stop"
        style={{ width: '100%', resize: 'vertical' }}
      />
      {/* Reserved height: the line appears mid-typing, and letting it push the
          page down under the reader's thumb is worse than an empty row. */}
      <p className="card__note" role="status" style={{ minHeight: '1.2em' }}>
        {saved ? (synced ? 'Saved. Sync carries it to your other devices.' : 'Saved on this device.') : ''}
      </p>
      <p className="card__note" style={{ marginTop: 0 }}>
        Notes from every stop gather in <Link to="/log">your field log</Link>.
      </p>
    </section>
  )
}

// One-line forecast for the stop's region. Weather is garnish, never an
// error: renders nothing while loading, past HIDE, or for region-less spots.
function StopForecastLine({ region }: { region: string }) {
  const weather = useWeather()
  if (weather.loading || weather.ageMs > HIDE_AFTER_MS) return null
  const line = regionTodayLine(weather.spots.find((s) => s.id === region))
  if (!line) return null
  const stale = weather.ageMs > WARN_AFTER_MS
  return (
    <p className="dateline" style={{ marginTop: 12 }}>
      {line}
      {stale ? ' · forecast is old, refresh online' : ''}
    </p>
  )
}

export default function StopDetail() {
  const params = useParams<{ stopId: string }>()
  const stop = params.stopId ? getStopById(params.stopId) : undefined
  const { plan, addStop } = useTripPlan()
  useDocumentTitle(stop?.title)
  const parking = useParking()
  // Mount-time clock for the lot stamp; render stays pure.
  const [nowMs] = useState(() => Date.now())
  const stopId = stop?.id
  useEffect(() => {
    if (stopId) recordView({ type: 'stop', id: stopId })
  }, [stopId])
  if (!stop) {
    return (
      <NotFound
        title="That stop isn't in this edition."
        intro="It may have been renamed or removed. Search knows every current page."
      />
    )
  }
  const planned = plan.items.some((it) => it.type === 'stop' && it.stopId === stop.id)

  // Secret Guide members (hidden stops and secret spots) page through the
  // merged category list; core stops page through the curated region
  // sequence. Mixing them would put a guide entry "between" core stops it
  // was deliberately kept out of.
  const inSecretGuide = isSecretGuideEntry(stop)
  const region = 'region' in stop ? stop.region : undefined
  const siblings: GuideStopT[] =
    inSecretGuide || !region ? getSecretGuideEntries(stop.category) : getStopsByRegion(region)
  const idx = siblings.findIndex((s) => s.id === stop.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
  const regionMeta = region ? getRegionMeta(region) : undefined
  const backTo = inSecretGuide
    ? `/secret-guide${stop.category ? `?cat=${stop.category}` : ''}`
    : `/region/${region}`
  const backLabel = inSecretGuide ? 'The Secret Guide' : regionMeta?.title ?? 'Region'

  // On-device joins: hikes starting at this stop, and the closest parking or
  // campground pins for the day the stop's own lot is full.
  const hikesHere = HIKES.filter((h) => h.stopId === stop.id)
  // Parking and campgrounds only: the map's infrastructure layer (shuttle
  // stops, picnic areas, landmarks) answers a different question.
  const nearbyAmenities = stop.coord
    ? AMENITIES.filter((a) => a.kind === 'parking' || a.kind === 'camping')
        .map((a) => ({ amenity: a, miles: haversineMiles(stop.coord!, a.coord) }))
        .filter((entry) => entry.miles <= NEARBY_AMENITY_MILES)
        .sort((a, b) => a.miles - b.miles)
        .slice(0, NEARBY_AMENITY_MAX)
    : []

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <BackLink to={backTo} label={backLabel} placement="top" />

        {/* The card is the page here, so its title is the page's h1. */}
        <StopCard stop={stop} compact={false} titleAs="h1" />

        <div className="action-row" style={{ marginTop: 20 }}>
          {planned ? (
            <Button variant="ghost" to="/trip">
              In your trip plan →
            </Button>
          ) : (
            <Button
              onClick={() => {
                addStop(stop.id)
                announceTripAdd(stop.title)
              }}
            >
              Add to trip
            </Button>
          )}
          {stop.coord && (
            <Button variant="ghost" href={directionsUrl(stop.coord)} external>
              Directions →
            </Button>
          )}
          {stop.coord && (
            <Button variant="ghost" to={`/map?stop=${stop.id}`}>
              On the map →
            </Button>
          )}
          {stop.coord && (
            <Button variant="ghost" to={`/compass?to=${stop.id}`}>
              Bearing →
            </Button>
          )}
          <ShareStopButton stopId={stop.id} title={stop.title} />
        </div>

        {/* A pin nobody has stood at yet. The companion mode skips these;
            the page names it and asks the reader who is there. */}
        {UNVERIFIED_STOP_IDS.has(stop.id) && (
          <p className="pin-unverified">
            <span className="pin-unverified__label">Pin not yet checked on the ground</span>
            Trust the turnout this entry describes over the exact pin.{' '}
            <Link to={`/report?type=stop&id=${stop.id}&kind=pin`}>Standing at it? Send its position →</Link>
          </p>
        )}

        {region && <StopForecastLine region={region} />}

        <SeasonalNotices stopIds={[stop.id]} />

        {hikesHere.length > 0 && (
          <section aria-label="Hikes from this trailhead" className="page-section">
            <span className="eyebrow">Hikes from this trailhead</span>
            <ul className="link-list">
              {hikesHere.map((h) => (
                <li key={h.id}>
                  <Link to={`/hike/${h.id}`}>{h.title} →</Link>{' '}
                  <span className="dateline">
                    {h.distanceMi} mi · {h.elevationGainFt.toLocaleString()} ft gain ·{' '}
                    {DIFFICULTY_LABEL[h.difficulty]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nearbyAmenities.length > 0 && (
          <section aria-label="Parking and camping nearby" className="page-section">
            <span className="eyebrow">Parking and camping nearby</span>
            <ul className="link-list">
              {nearbyAmenities.map(({ amenity, miles }) => {
                // The live lot word, under the waits posture: only while the
                // feed is fresh, and never a word for a pin with no NPS lot.
                const fresh =
                  parking.fetchedAt !== null &&
                  nowMs - Date.parse(parking.fetchedAt) <= PARKING_HIDE_MS
                const lot = fresh ? lotForAmenity(amenity, parking.lots) : null
                const lotWord = lot && lot.status !== 'unknown' ? LOT_STATUS_LABEL[lot.status] : null
                return (
                <li key={amenity.id}>
                  <a href={directionsUrl(amenity.coord)} target="_blank" rel="noreferrer">
                    {amenity.name} →
                  </a>{' '}
                  <span className="dateline">
                    {amenity.kind === 'camping' ? 'campground' : 'parking'} ·{' '}
                    {formatMiles(miles)} away
                    {lotWord && parking.fetchedAt
                      ? ` · ${lotWord} (NPS, ${compactStamp(parking.fetchedAt, nowMs) ?? 'just now'})`
                      : ''}
                  </span>
                </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Keyed: paging prev/next keeps this route mounted, and the saved
            line belongs to the note it confirmed. */}
        <StopNotes key={stop.id} stopId={stop.id} />

        <p className="report-link">
          Something here wrong or out of date?{' '}
          <Link to={`/report?type=stop&id=${stop.id}`}>Tell us →</Link>
        </p>

        <PrevNextNav
          sticky
          prev={prev ? { to: `/stop/${prev.id}`, title: prev.title } : null}
          next={next ? { to: `/stop/${next.id}`, title: next.title } : null}
          prevEmptyLabel={inSecretGuide ? 'Start of category' : 'Start of region'}
          nextEmptyLabel={inSecretGuide ? 'End of category' : 'End of region'}
        />
      </main>
    </GatedChrome>
  )
}
