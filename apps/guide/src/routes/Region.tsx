import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RegionEnum, getHiddenStops, getRegionMeta, getStopsByRegion } from '../content'
import NotFound from './NotFound'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { allPhotoUrls } from '../utils/photo'

export default function Region() {
  const params = useParams<{ regionId: string }>()
  const parsed = RegionEnum.safeParse(params.regionId)
  const region = parsed.success ? parsed.data : null
  const stops = useMemo(() => (region ? getStopsByRegion(region) : []), [region])
  // Hidden areas stay out of the curated list but get a link block below it,
  // so the region page remains the geographic index. /hidden-areas owns the
  // full cards and the photo prewarm for these.
  const hiddenStops = useMemo(() => (region ? getHiddenStops().filter((s) => s.region === region) : []), [region])

  // Pre-warm SW cache with this region's photos so they're available offline.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const sw = navigator.serviceWorker.controller
    if (!sw) return
    const urls = stops.flatMap((s) => s.photos.flatMap((p) => allPhotoUrls(p.src))).filter(Boolean)
    if (urls.length === 0) return
    sw.postMessage({ type: 'PRECACHE_URLS', urls })
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
          <section aria-label="Hidden areas in this region" className="page-section">
            <span className="eyebrow">Hidden areas in this region</span>
            <ul className="link-list">
              {hiddenStops.map((stop) => (
                <li key={stop.id}>
                  <Link to={`/stop/${stop.id}`}>{stop.title} →</Link>
                </li>
              ))}
            </ul>
            <Link to="/hidden-areas" className="more-link">
              All hidden areas →
            </Link>
          </section>
        )}

        <BackLink to="/" label="Back to regions" />
      </main>
    </GatedChrome>
  )
}
