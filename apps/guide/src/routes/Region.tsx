import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { RegionEnum, getRegionMeta, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'

export default function Region() {
  const params = useParams<{ regionId: string }>()
  const parsed = RegionEnum.safeParse(params.regionId)
  const region = parsed.success ? parsed.data : null
  const stops = useMemo(() => (region ? getStopsByRegion(region) : []), [region])

  // Pre-warm SW cache with this region's photos so they're available offline.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const sw = navigator.serviceWorker.controller
    if (!sw) return
    const urls = stops.flatMap((s) => s.photos.map((p) => p.src)).filter(Boolean)
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
