import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { REGION_SHORT, RegionEnum, getHiddenStops, getRegionMeta, getStopsByRegion } from '../content'
import NotFound from './NotFound'
import CardDeck, { type DeckPanel } from '../components/CardDeck'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import StopDeckCard from '../components/StopDeckCard'
import ViewToggle from '../components/ViewToggle'
import BackLink from '../components/ui/BackLink'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { useViewMode } from '../lib/viewMode'
import { detectPhotoFormat, precachePhotoUrls } from '../utils/photo'
import { precacheUrls } from '../pwa/precache'
import WeatherStrip from '../weather/WeatherStrip'

export default function Region() {
  const params = useParams<{ regionId: string }>()
  const parsed = RegionEnum.safeParse(params.regionId)
  const region = parsed.success ? parsed.data : null
  const stops = useMemo(() => (region ? getStopsByRegion(region) : []), [region])
  // Hidden stops stay out of the curated list but get a link block below it,
  // so the region page remains the geographic index. /secret-guide owns the
  // full cards and the photo prewarm for these.
  const hiddenStops = useMemo(() => (region ? getHiddenStops().filter((s) => s.region === region) : []), [region])
  const { mode } = useViewMode()

  // Pre-warm SW cache with this region's photos so they're available offline.
  // Only the format this device renders; the download packs fetch everything.
  useEffect(() => {
    const srcs = stops.flatMap((s) => s.photos.map((p) => p.src)).filter(Boolean)
    if (srcs.length === 0) return
    void detectPhotoFormat().then((format) =>
      precacheUrls(srcs.flatMap((src) => precachePhotoUrls(src, format))),
    )
  }, [stops])

  if (!region) {
    return (
      <NotFound
        title="That region isn't in the guide."
        intro="The guide covers four regions; pick one from the front page."
      />
    )
  }

  const meta = getRegionMeta(region)

  // The Secret Guide links and the way back out of the region: a block in list
  // mode, the deck's closing panel in card mode. Same content either way.
  const tail = (
    <>
      {hiddenStops.length > 0 && (
        <section aria-label="From the Secret Guide, in this region" className="page-section">
          <span className="eyebrow">From the Secret Guide, in this region</span>
          <ul className="link-list">
            {hiddenStops.map((stop) => (
              <li key={stop.id}>
                <Link to={`/stop/${stop.id}`}>{stop.title} →</Link>
              </li>
            ))}
          </ul>
          <Link to="/secret-guide" className="more-link">
            The Secret Guide →
          </Link>
        </section>
      )}
      <BackLink to="/" label="Back to regions" />
    </>
  )

  // Card mode: the region as a deck. Everything the list carries outside the
  // cards becomes its own panel, and every prose panel must fit one screen —
  // a panel is never a scroll container (see CardDeck.css), so the weather
  // block gets a panel of its own instead of sharing the intro.
  if (mode === 'cards' && stops.length > 0) {
    const panels: DeckPanel[] = [
      {
        key: 'region-intro',
        label: meta?.title ?? 'This region',
        node: (
          <div className="deck-panel-prose">
            <div className="deck-panel-prose__inner">
              <PageHeader eyebrow="Regional guide" title={meta?.title} intro={meta?.teaser} />
              <p className="dateline">
                {stops.length} stops, in driving order. Swipe up to start.
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'region-weather',
        label: 'Weather and light',
        node: (
          <div className="deck-panel-prose">
            <div className="deck-panel-prose__inner">
              <WeatherStrip region={region} />
            </div>
          </div>
        ),
      },
      ...stops.map((stop, i) => ({
        key: stop.id,
        label: stop.title,
        node: <StopDeckCard stop={stop} eager={i === 0} />,
      })),
      ...(hiddenStops.length > 0
        ? [
            {
              key: 'region-secret',
              label: 'From the Secret Guide, in this region',
              node: (
                <div className="deck-panel-prose">
                  <div className="deck-panel-prose__inner">
                    <span className="eyebrow">From the Secret Guide, in this region</span>
                    <ul className="link-list">
                      {hiddenStops.map((stop) => (
                        <li key={stop.id}>
                          <Link to={`/stop/${stop.id}`}>{stop.title} →</Link>
                        </li>
                      ))}
                    </ul>
                    <Link to="/secret-guide" className="more-link">
                      The Secret Guide →
                    </Link>
                  </div>
                </div>
              ),
            },
          ]
        : []),
      {
        key: 'region-end',
        label: 'End of the region',
        node: (
          <div className="deck-panel-prose">
            <div className="deck-panel-prose__inner">
              <span className="eyebrow">That's the region</span>
              <p className="deck-card__teaser">
                {stops.length} stops in {meta?.title ?? 'this region'}. Swipe back for any you
                want in the trip planner.
              </p>
              <BackLink to="/" label="Back to regions" />
            </div>
          </div>
        ),
      },
    ]

    return (
      <GatedChrome>
        <main className="deck-main">
          <div className="deck-bar">
            {/* The chip-length label, not meta.title: the full one truncates
                to an ellipsis in a single bar line on a phone. */}
            <h1 className="deck-bar__title">{REGION_SHORT[region]}</h1>
            <div className="deck-bar__side">
              <span className="deck-bar__count">{stops.length} stops</span>
              <ViewToggle label="How to read this region" />
            </div>
          </div>
          {/* Keyed by region: react-router keeps this component mounted across
              region changes, and a reused deck would keep the old scrollTop. */}
          <CardDeck
            key={region}
            panels={panels}
            ariaLabel={`${meta?.title ?? 'Region'} stops`}
            hint="Swipe up for the next stop"
          />
        </main>
      </GatedChrome>
    )
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <div className="page-toolbar">
          <ViewToggle label="How to read this region" />
        </div>

        <PageHeader eyebrow="Regional guide" title={meta?.title} intro={meta?.teaser} />

        <WeatherStrip region={region} />

        {stops.length === 0 ? (
          <EmptyState note="Coming soon." />
        ) : (
          stops.map((stop, i) => (
            <div key={stop.id}>
              <StopCard stop={stop} />
              {i < stops.length - 1 && <hr className="stop-divider" />}
            </div>
          ))
        )}

        {tail}
      </main>
    </GatedChrome>
  )
}
