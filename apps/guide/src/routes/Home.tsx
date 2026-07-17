// =============================================================================
// / — the front page as an index of the whole guide. One narrow column, four
// ruled sections in workflow order: read (regions + today's weather), plan
// (the planner tools), reference (essentials, Secret Guide, search), offline.
// Every route in the app is reachable and explained from here; nothing lives
// only behind the tab bar.
// =============================================================================

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import {
  ESSENTIALS,
  HIKES,
  REGIONS,
  SEASONAL_EVENTS,
  SECRET_GUIDE_META,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  seasonalRangeLabel,
} from '../content'
import { todayIso } from '../utils/date'
import { useFavorites } from '../lib/favorites'
import { isPackCompleted } from '../offline/useDownloads'
import { useTripPlan } from '../trip/useTripPlan'
import { readTripDates, type TripDates } from '../programs/usePrograms'
import { relativeStamp } from '../utils/relativeStamp'
import GatedChrome from '../components/GatedChrome'
import ResponsivePhoto from '../components/ResponsivePhoto'
import UpdatedStamp from '../components/UpdatedStamp'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import PageHeader from '../components/ui/PageHeader'
import { groupPeriodsIntoDays } from '../weather/forecastDays'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from '../weather/staleness'
import type { WeatherSpotT } from '../weather/schema'

// Pack ids mirrored from offline/manifest.ts: one photo pack per region plus
// the map. Used only for the status line; the manager itself lives on Account.
const PACK_IDS = [...REGIONS.map((r) => `photos-${r.id}`), 'photos-secret-guide', 'park-map']

const BEFORE_YOU_GO_DISMISS_KEY = 'tfg.beforeYouGo.dismissed'

// One-time nudge toward the night-before downloads. Same dismissal pattern as
// InstallPrompt (tfg.install.dismissed).
function BeforeYouGoNudge() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(BEFORE_YOU_GO_DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  if (dismissed) return null
  return (
    <Callout
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            try {
              localStorage.setItem(BEFORE_YOU_GO_DISMISS_KEY, '1')
            } catch {
              /* non-fatal: nudge may reappear next launch */
            }
            setDismissed(true)
          }}
        >
          Got it
        </Button>
      }
    >
      Going soon? Do the <Link to="/essentials/before-you-go">night-before downloads</Link>{' '}
      while you still have wifi: the offline maps, this guide, and the current Yosemite Guide PDF.
    </Callout>
  )
}

// Up to three active or upcoming almanac entries, so the seasonal layer is
// discoverable from the front page. The full agenda lives on /programs.
function InSeasonStrip() {
  const today = todayIso()
  const upcoming = SEASONAL_EVENTS.filter((ev) => ev.dateEnd >= today).slice(0, 3)
  if (upcoming.length === 0) return null
  return (
    <section aria-label="In season" className="page-section">
      <span className="eyebrow">In season</span>
      <ul className="season-strip">
        {upcoming.map((ev) => (
          <li key={ev.id}>
            <span className="season-strip__muted">{seasonalRangeLabel(ev)} · </span>
            {ev.title}
            {ev.confidence === 'typical' ? <span className="season-strip__muted"> (typical)</span> : null}
          </li>
        ))}
      </ul>
      <Link to="/programs" className="more-link">
        The full seasonal almanac, day by day →
      </Link>
    </section>
  )
}

// "Jul 20–24" or "Jun 29 – Jul 2". Timezone-safe: noon UTC, formatted as UTC,
// same idiom as forecastDays.
function tripDatesLabel(dates: TripDates): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  const sameMonth = dates.start.slice(0, 7) === dates.end.slice(0, 7)
  if (sameMonth) {
    const endDay = new Date(`${dates.end}T12:00:00Z`).toLocaleDateString('en-US', {
      day: 'numeric',
      timeZone: 'UTC',
    })
    return `${fmt(dates.start)}–${endDay}`
  }
  return `${fmt(dates.start)} – ${fmt(dates.end)}`
}

// One-line current forecast for a region index row. Labeled with the weekday
// rather than "Today": between WARN_AFTER and HIDE_AFTER the leading day can
// legitimately be yesterday, and the label should not lie about it.
function regionTodayLine(spot: WeatherSpotT | undefined): string | null {
  if (!spot) return null
  const day = groupPeriodsIntoDays(spot.periods, 1)[0]
  if (!day) return null
  const rain = day.precipChance && day.precipChance >= 20 ? ` · ${day.precipChance}% rain` : ''
  return `${day.label} ${day.hiF ?? '–'}°/${day.loF ?? '–'}° ${day.shortForecast.toLowerCase()}${rain}`
}

// Directory entry for a tool or reference surface: linked title, one-line
// teaser, live meta. A div rather than a whole-card Link so entries can carry
// their own sub-links (the essentials quick links).
function ToolCard({
  to,
  title,
  teaser,
  meta,
  children,
}: {
  to: string
  title: string
  teaser: string
  meta: string
  children?: ReactNode
}) {
  return (
    <div className="tool-card">
      <h3 className="tool-card__title">
        <Link to={to}>{title} →</Link>
      </h3>
      <p className="tool-card__teaser">{teaser}</p>
      <div className="dateline">{meta}</div>
      {children}
    </div>
  )
}

export default function Home() {
  const { session } = useAuth()
  const { ids: favoriteIds } = useFavorites()
  const { plan } = useTripPlan()
  const weather = useWeather()
  // Read once per mount (render must stay pure). Existing signed-in users who
  // predate onboarding get routed through /welcome exactly once; deep links
  // (/stop/x, /map?...) are never intercepted, only the front page.
  const [onboarded] = useState(() => isOnboarded())
  const [tripDates] = useState(() => readTripDates())
  // getStopById resolves regular stops and secret spots alike, so a saved
  // secret spot does not silently vanish from this list.
  const savedStops = favoriteIds
    .map((id) => getStopById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const downloadedCount = PACK_IDS.filter((id) => isPackCompleted(id)).length

  const stopCount = REGIONS.reduce((n, r) => n + getStopsByRegion(r.id).length, 0)
  const secretCount = getSecretGuideEntries().length
  const planCount = plan.items.length
  const datesLabel = tripDates ? tripDatesLabel(tripDates) : null

  // One useWeather() for the whole page; past HIDE_AFTER every per-region
  // line and the attribution disappear together. The five-day forecast lives
  // on each region page now.
  const showForecast = weather.spots.length > 0 && weather.ageMs <= HIDE_AFTER_MS
  const weatherByRegion = new Map(weather.spots.map((s) => [s.id as string, s]))

  if (!onboarded) return <Navigate to="/welcome" replace />

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Yosemite National Park"
          title="The whole guide, on one page."
          intro="Four regions to read, a planner that turns your dates into a day-by-day schedule, and all of it built to work where the park has no signal. Everything the guide does is indexed below."
        />

        <BeforeYouGoNudge />

        <section aria-label="How this guide works" className="home-steps-section">
          <span className="eyebrow">How this guide works</span>
          <ol className="home-steps">
            <li>
              <span className="home-steps__num" aria-hidden="true">1</span>
              <p>
                <strong>Read.</strong> Four regions, {stopCount} stops in driving order, plus{' '}
                <Link to="/secret-guide">the Secret Guide</Link> and the{' '}
                <Link to="/essentials">know-before-you-go essentials</Link>.
              </p>
            </li>
            <li>
              <span className="home-steps__num" aria-hidden="true">2</span>
              <p>
                <strong>Plan.</strong> Set your trip dates once: <Link to="/programs">park programs</Link>{' '}
                and the <Link to="/trip">trip planner</Link> share them. Add stops and{' '}
                <Link to="/hikes">day hikes</Link>, then export the plan to your calendar.
              </p>
            </li>
            <li>
              <span className="home-steps__num" aria-hidden="true">3</span>
              <p>
                <strong>Go offline.</strong> <Link to="/account">Download the packs</Link> on wifi the
                night before. After that, airplane mode changes nothing.
              </p>
            </li>
          </ol>
        </section>

        <InSeasonStrip />

        <section aria-label="The four regions" className="page-section">
          <span className="eyebrow">Read the guide · {stopCount} stops in four regions</span>
          <div className="region-rows">
            {REGIONS.map((region) => {
              const today = showForecast
                ? regionTodayLine(weatherByRegion.get(region.id))
                : null
              return (
                <Link key={region.id} to={`/region/${region.id}`} className="region-row">
                  <div className="region-row__media">
                    <ResponsivePhoto
                      src={region.photo.src}
                      alt=""
                      loading="lazy"
                      width={400}
                      height={400}
                      sizes="84px"
                    />
                  </div>
                  <div className="region-row__body">
                    <h2 className="region-row__title">{region.title}</h2>
                    <p className="region-row__teaser">{region.teaser}</p>
                    <div className="region-row__meta">
                      <span className="dateline">
                        {getStopsByRegion(region.id).length} stops
                      </span>
                      {today && <span className="region-row__today">{today}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          {/* One attribution for all four lines; repeating it per row is noise. */}
          {showForecast && weather.fetchedAt && (
            <p className="weather-attribution weather-attribution--rows">
              Forecast as of {relativeStamp(weather.fetchedAt)}
              {weather.offline ? ', saved on this device' : ''}
              {weather.ageMs > WARN_AFTER_MS
                ? '. This forecast is old; conditions have likely moved on.'
                : ''}
              {' '}· Five-day forecasts on each region page · National Weather Service
            </p>
          )}
          <div className="home-crosslinks">
            <Link to="/map" className="more-link">
              Every stop pinned on the park map →
            </Link>
            <Link to="/search" className="more-link">
              Search the whole guide →
            </Link>
          </div>
        </section>

        <section aria-label="Plan your days" className="page-section">
          <span className="eyebrow">Plan your days</span>
          <div className="tool-grid">
            <ToolCard
              to="/trip"
              title="Trip planner"
              teaser="Dates, programs, stops, and hikes assembled into a day-by-day schedule, then exported to your calendar with GPS coordinates and directions links."
              meta={
                planCount > 0
                  ? `${planCount} ${planCount === 1 ? 'item' : 'items'} planned${datesLabel ? ` · ${datesLabel}` : ''}`
                  : datesLabel
                    ? `Dates set · ${datesLabel}`
                    : 'Start with your dates'
              }
            />
            <ToolCard
              to="/programs"
              title="Park programs"
              teaser="Ranger walks, Junior Ranger tables, tours, star parties, and the seasonal almanac, listed day by day for your dates. Syncs online, readable offline."
              meta={datesLabel ? `Showing ${datesLabel}` : 'Day-by-day for your dates'}
            />
            <ToolCard
              to="/hikes"
              title="Day hikes"
              teaser="Every in-park day hike with distance, elevation gain, and difficulty. A hike drops into a trip day just like a stop."
              meta={`${HIKES.length} hikes · strolls to Half Dome`}
            />
            <ToolCard
              to="/map"
              title="Park map"
              teaser="Every stop and secret spot pinned on a topo map, with filters, parking and campground pins, and a near-you list. Tiles download for offline."
              meta="Topo map · works in airplane mode"
            />
          </div>
        </section>

        <section aria-label="The reference shelf" className="page-section">
          <span className="eyebrow">The reference shelf</span>
          <div className="tool-grid">
            <ToolCard
              to="/essentials"
              title="Know before you go"
              teaser="Entrances, reservations, crowds, bears, heat, smoke, budgets, and the packing checklists. The logistics layer under the whole trip."
              meta={`${ESSENTIALS.length} topics`}
            >
              <div className="tool-card__sub">
                <Link to="/essentials/before-you-go">Night-before checklist →</Link>
                <Link to="/essentials/packing-checklist">Packing checklist →</Link>
              </div>
            </ToolCard>
            <ToolCard
              to="/secret-guide"
              title={SECRET_GUIDE_META.title}
              teaser="The quiet vistas, hidden trails, parking moves, camping you can actually get, and the park after dark. None of it makes the brochures."
              meta={`${secretCount} entries · Vistas, trails, parking, camping, after dark`}
            />
            <ToolCard
              to="/search"
              title="Search the guide"
              teaser="One box across every stop, hike, secret spot, and essentials topic. Works offline like the rest of the guide."
              meta="Stops · hikes · secret spots · essentials"
            />
          </div>
        </section>

        <section aria-label="Offline status" className="page-section">
          <span className="eyebrow">Before you drive in</span>
          <Link to="/account" className="offline-status-card offline-status-card--flush">
            {downloadedCount === PACK_IDS.length ? (
              <>Downloaded for offline. The whole guide works in airplane mode. Manage →</>
            ) : (
              <>
                <strong>Offline:</strong> {downloadedCount} of {PACK_IDS.length} packs on this
                device. Download the guide and the park map before you leave wifi →
              </>
            )}
          </Link>
        </section>

        {savedStops.length > 0 && (
          <section aria-label="Saved stops" className="page-section">
            <span className="eyebrow">Saved stops</span>
            <ul className="link-list">
              {savedStops.map((stop) => (
                <li key={stop.id}>
                  <Link to={`/stop/${stop.id}`}>
                    {stop.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <UpdatedStamp />

        <p className="page-footnote">
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
