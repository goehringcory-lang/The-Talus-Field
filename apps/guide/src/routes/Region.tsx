import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RegionEnum, getHiddenStops, getRegionMeta, getStopsByRegion } from '../content'
import NotFound from './NotFound'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
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

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
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
      </main>
    </GatedChrome>
  )
}
