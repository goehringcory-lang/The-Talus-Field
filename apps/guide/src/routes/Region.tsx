import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { RegionEnum, getHiddenStops, getRegionMeta, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
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

  if (!region) return <Navigate to="/" replace />

  const meta = getRegionMeta(region)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>{meta?.title}</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{meta?.teaser}</p>

        {stops.length === 0 ? (
          <p style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>Coming soon.</p>
        ) : (
          stops.map((stop, i) => (
            <div key={stop.id}>
              <StopCard stop={stop} />
              {i < stops.length - 1 && <hr className="stop-divider" />}
            </div>
          ))
        )}

        {hiddenStops.length > 0 && (
          <section aria-label="Hidden areas in this region" style={{ marginTop: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Hidden areas in this region
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {hiddenStops.map((stop) => (
                <li key={stop.id}>
                  <Link to={`/stop/${stop.id}`} style={{ fontFamily: 'var(--display)', fontSize: 18 }}>
                    {stop.title} →
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/hidden-areas"
              style={{ fontFamily: 'var(--sans)', fontSize: 13, display: 'inline-block', marginTop: 8 }}
            >
              All hidden areas →
            </Link>
          </section>
        )}

        <p style={{ marginTop: 56 }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Back to regions
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
