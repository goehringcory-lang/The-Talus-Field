// =============================================================================
// / — the front page as an index of the whole guide. One narrow column, four
// ruled sections in workflow order: read (regions + today's weather), plan
// (the planner tools), reference (essentials, Secret Guide, search), offline.
// Every route in the app is reachable and explained from here; nothing lives
// only behind the tab bar.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import {
  DINING,
  ESSENTIALS,
  GATEWAY_TOWNS,
  HIKES,
  REGIONS,
  SEASONAL_EVENTS,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  seasonalRangeLabel,
} from '../content'
import { formatClock, parkNowMinutes, todayIso } from '../utils/date'
import { useFavorites } from '../lib/favorites'
import { isPackCompleted } from '../offline/useDownloads'
import { PACK_IDS } from '../offline/manifest'
import { useTripPlan } from '../trip/useTripPlan'
import { clearPendingImport, peekPendingImport, resolveEditorialIds } from '../trip/importTrip'
import { slotPlan } from '../trip/slotting'
import { itemInfo } from '../trip/agendaItem'
import type { TripItemT } from '../trip/schema'
import { readTripDates, type TripDates } from '../programs/usePrograms'
import { relativeStamp } from '../utils/relativeStamp'
import GatedChrome from '../components/GatedChrome'
import ParkNowPanel from '../components/ParkNowPanel'
import ResponsivePhoto from '../components/ResponsivePhoto'
import UpdatedStamp from '../components/UpdatedStamp'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import AirLine from '../air/AirLine'
import FlowLine from '../flow/FlowLine'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from '../weather/staleness'
import { regionTodayLine } from '../weather/todayLine'

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

// A trip built on the editorial map before the buyer owned the guide. The ids
// were stashed at boot the first time /trip?import= was opened (importTrip.ts);
// the buy detour and the magic-link sign-in both lose the URL, so the offer is
// made here instead. Taking it re-enters /trip with a real ?import=, which is
// the one path that writes to the plan — nothing is imported behind the user.
function PendingImportCard() {
  const [ids, setIds] = useState<string[]>(() => peekPendingImport())
  const resolved = useMemo(() => resolveEditorialIds(ids), [ids])
  const count = resolved.stopIds.length + resolved.hikeIds.length
  // Nothing in the trip exists in the guide; offering it would be a dead end.
  // The cleanup is a storage write, so it lives in an effect — render stays
  // pure (same rule as the mount-stamp reads below).
  const dead = ids.length > 0 && count === 0
  useEffect(() => {
    if (dead) clearPendingImport()
  }, [dead])
  if (ids.length === 0 || count === 0) return null
  return (
    <Callout
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearPendingImport()
            setIds([])
          }}
        >
          No thanks
        </Button>
      }
    >
      The trip you built on the map is waiting: {count} {count === 1 ? 'entry' : 'entries'}.{' '}
      <Link to={`/trip?import=${ids.join(',')}`}>Add it to your plan →</Link>
    </Callout>
  )
}

// Shown only while the trip window includes today: the door to /today, with
// the next planned thing as the one-line pitch. Disappears outside the
// window, so the front page stays stable the rest of the year.
function TodayCard({
  today,
  dates,
  items,
}: {
  today: string
  dates: TripDates
  items: TripItemT[]
}) {
  const blocks = useMemo(() => slotPlan(items).get(today) ?? [], [items, today])
  // Same one-minute pulse as /today, so a home screen left open doesn't keep
  // pitching the thing that finished an hour ago.
  const [nowMin, setNowMin] = useState(parkNowMinutes)
  useEffect(() => {
    const t = window.setInterval(() => setNowMin(parkNowMinutes()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  const next = blocks.find(
    (b) => b.startMin !== null && b.startMin + b.durationMin > nowMin,
  )
  const dayNumber =
    Math.round(
      (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${dates.start}T00:00:00Z`)) / 86_400_000,
    ) + 1
  const dayTotal =
    Math.round(
      (Date.parse(`${dates.end}T00:00:00Z`) - Date.parse(`${dates.start}T00:00:00Z`)) / 86_400_000,
    ) + 1
  return (
    <Link to="/today" className="today-card">
      <span className="today-card__label">
        Today · Day {dayNumber} of {dayTotal}
      </span>
      <span className="today-card__line">
        {next && next.startMin !== null
          ? `${next.startMin <= nowMin ? 'Now' : `At ${formatClock(next.startMin)}`}: ${itemInfo(next.item).title} →`
          : blocks.length > 0
            ? 'The day in order, with conditions and sun times →'
            : 'Conditions, sun times, and entrance waits →'}
      </span>
    </Link>
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
      {/* The night sky page graduated to an instrument tile; one crosslink. */}
      <div className="home-crosslinks">
        <Link to="/this-week" className="more-link">
          This week in the park: alerts, seasons, tonight's sky →
        </Link>
      </div>
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

// Small stroke glyphs for the planner tool cards, drawn in the same style as
// the BottomNav icons (24 viewBox, currentColor stroke, 1.75 weight).
function ToolGlyph({ children }: { children: ReactNode }) {
  return (
    <span className="tool-card__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  )
}

const PLAN_ICONS = {
  dining: (
    <ToolGlyph>
      <path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3" />
      <path d="M17 3c-2 3-2 6 0 8v10M17 11h2V3" />
    </ToolGlyph>
  ),
  gateway: (
    <ToolGlyph>
      <path d="M3 21h18M5 21V9l7-6 7 6v12" />
      <path d="M10 21v-6h4v6M9 12h2M13 12h2" />
    </ToolGlyph>
  ),
}

// Directory entry for a tool or reference surface: linked title, one-line
// teaser, live meta. A div rather than a whole-card Link so entries can carry
// their own sub-links (the essentials quick links).
function ToolCard({
  to,
  title,
  teaser,
  meta,
  icon,
  children,
}: {
  to: string
  title: string
  teaser: string
  meta: string
  icon?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="tool-card">
      <h3 className="tool-card__title">
        <Link to={to}>
          {icon}
          {title} →
        </Link>
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
        {/* The Surveyor front page: identity in three lines, then readings.
            The orientation copy lives in "How this guide works" further down;
            a returning buyer gets the park's state before any prose. */}
        <header className="home-hero">
          <span className="eyebrow">Yosemite National Park · 2026</span>
          <h1 className="home-hero__title">Field Guide</h1>
          <p className="home-hero__sig">The whole guide, on one page.</p>
        </header>

        <ParkNowPanel />

        {/* The trip readout: always present, because this is the trip
            planner's front door on the index page (the tab bar is the other).
            The value line states whatever is known so far. */}
        <Link to="/trip" className="trip-strip">
          <span className="trip-strip__meta">
            <span className="trip-strip__label">Your trip</span>
            <span className="trip-strip__value">
              {datesLabel && planCount > 0
                ? `${datesLabel} · ${planCount} ${planCount === 1 ? 'item' : 'items'}`
                : datesLabel
                  ? `${datesLabel} · add stops and hikes`
                  : planCount > 0
                    ? `${planCount} ${planCount === 1 ? 'item' : 'items'} · set your dates`
                    : 'Start with your dates'}
            </span>
          </span>
          <span className="trip-strip__cta">Open board →</span>
        </Link>

        <PendingImportCard />

        <BeforeYouGoNudge />

        {tripDates && tripDates.start <= todayIso() && todayIso() <= tripDates.end && (
          <TodayCard today={todayIso()} dates={tripDates} items={plan.items} />
        )}

        <section aria-label="The guide" className="page-section">
          <span className="eyebrow">The guide · {stopCount} stops · 4 regions</span>
          <div className="region-rows">
            {REGIONS.map((region, i) => {
              const today = showForecast
                ? regionTodayLine(weatherByRegion.get(region.id))
                : null
              return (
                <Link key={region.id} to={`/region/${region.id}`} className="region-row">
                  <span className="region-row__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="region-row__media">
                    <ResponsivePhoto
                      src={region.photo.src}
                      alt=""
                      loading="lazy"
                      width={400}
                      height={400}
                      sizes="52px"
                    />
                  </div>
                  <div className="region-row__body">
                    <h2 className="region-row__title">{region.title}</h2>
                    <span className="dateline">
                      {getStopsByRegion(region.id).length} stops
                      {today ? ` · ${today}` : ''}
                    </span>
                  </div>
                  <svg
                    className="region-row__go"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              )
            })}
            {/* The Secret Guide is the index's fifth reading section: same row
                anatomy, an icon tile where the regions carry a photo, because
                its entries deliberately have no single face. */}
            <Link to="/secret-guide" className="region-row">
              <span className="region-row__index" aria-hidden="true">SG</span>
              <div className="region-row__media region-row__media--icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l2.1 5.4 5.9.4-4.5 3.7 1.5 5.7L12 15l-5 3.2 1.5-5.7L4 8.8l5.9-.4L12 3z" />
                </svg>
              </div>
              <div className="region-row__body">
                <h2 className="region-row__title">The Secret Guide</h2>
                <span className="dateline">
                  {secretCount} entries · none of it makes the brochures
                </span>
              </div>
              <svg
                className="region-row__go"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
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
          {/* Roads and entrance waits moved up into ParkNowPanel; air and river
              flow stay here, where they are a footnote to the regions rather
              than something a trip pivots on. */}
          <AirLine />
          <FlowLine />
        </section>

        <section aria-label="Instruments" className="page-section">
          <span className="eyebrow">Instruments</span>
          <div className="instrument-grid">
            <Link to="/map" className="instrument-tile">
              <svg className="instrument-tile__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
                <path d="M9 3v15M15 6v15" />
              </svg>
              <span className="instrument-tile__label">Topo map</span>
              <span className="instrument-tile__note">Every stop pinned · works in airplane mode</span>
            </Link>
            <Link to="/hikes" className="instrument-tile">
              <svg className="instrument-tile__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 20L9 7l4 7 2.5-4L21 20H2z" />
                <path d="M11 11l-1.5 2.5" />
              </svg>
              <span className="instrument-tile__label">Day hikes</span>
              <span className="instrument-tile__note">{HIKES.length} trails · profiles · GPX</span>
            </Link>
            <Link to="/programs" className="instrument-tile">
              <svg className="instrument-tile__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3c2.2 2.6 4 4.6 4 7.2a4 4 0 0 1-8 0C8 7.6 9.8 5.6 12 3z" />
                <path d="M5 21l14-4M19 21L5 17" />
              </svg>
              <span className="instrument-tile__label">Programs</span>
              <span className="instrument-tile__note">
                {datesLabel ? `Showing ${datesLabel}` : 'Day by day for your dates'}
              </span>
            </Link>
            <Link to="/night" className="instrument-tile">
              <svg className="instrument-tile__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a7 7 0 0 0 10.6 10.6z" />
              </svg>
              <span className="instrument-tile__label">Night sky</span>
              <span className="instrument-tile__note">Moon · stars · computed on-device</span>
            </Link>
          </div>
        </section>

        <section aria-label="Where to eat" className="page-section">
          <span className="eyebrow">Where to eat</span>
          <div className="tool-grid">
            <ToolCard
              to="/dining"
              title="Eating in the park"
              icon={PLAN_ICONS.dining}
              teaser="Every counter, dining room, bar, and grocery inside the park, from the Curry pizza deck to the Ahwahnee, with the hours the park publishes and what each place is actually for."
              meta={`${DINING.filter((v) => v.area !== 'gateway').length} places · hours from the current Yosemite Guide`}
            />
            <ToolCard
              to="/dining#gateway"
              title="The gateway towns"
              icon={PLAN_ICONS.gateway}
              teaser="Where dinner improves outside the gates: Mariposa, Groveland, Oakhurst, Fish Camp, El Portal, and Lee Vining, one corridor per entrance."
              meta={`${DINING.filter((v) => v.area === 'gateway').length} places · ${GATEWAY_TOWNS.length} corridors`}
            >
              <div className="tool-card__sub">
                <Link to="/essentials/eating-in-the-park">The realistic tiers →</Link>
                <Link to="/essentials/bear-safety">The food rules →</Link>
              </div>
            </ToolCard>
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
              to="/wildlife"
              title="What did I see?"
              teaser="Quick identification for the animals, birds, and trees you actually meet: the one or two field marks that settle it, plus the safety notes that matter."
              meta="Mammals · birds · trees · reptiles"
            >
              <div className="tool-card__sub">
                <Link to="/hunts">Find-it lists for kids →</Link>
              </div>
            </ToolCard>
            <ToolCard
              to="/search"
              title="Search the guide"
              teaser="One box across every stop, hike, secret spot, dining option, and essentials topic. Works offline like the rest of the guide."
              meta="Stops · hikes · dining · secret spots · essentials"
            />
          </div>
        </section>

        <section aria-label="Offline status" className="page-section">
          <span className="eyebrow">Before you drive in</span>
          <Link to="/account" className="panel packs-panel">
            <span className="packs-panel__row">
              <span className="packs-panel__label">Offline packs</span>
              <span className="packs-panel__value">
                {downloadedCount} / {PACK_IDS.length}
              </span>
            </span>
            <span className="meter" aria-hidden="true">
              {PACK_IDS.map((id, i) => (
                <span
                  key={id}
                  className={i < downloadedCount ? 'meter__seg meter__seg--on' : 'meter__seg'}
                />
              ))}
            </span>
            <span className="packs-panel__note">
              {downloadedCount === PACK_IDS.length
                ? 'The whole guide works in airplane mode · Manage →'
                : 'Download the guide and map before you leave wifi →'}
            </span>
          </Link>
        </section>

        <section aria-label="How this guide works" className="page-section">
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
