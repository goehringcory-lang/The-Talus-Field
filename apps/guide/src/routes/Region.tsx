import { Link, Navigate, useParams } from 'react-router-dom'
import { RegionEnum, getRegionMeta, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'

export default function Region() {
  const params = useParams<{ regionId: string }>()
  const parsed = RegionEnum.safeParse(params.regionId)
  if (!parsed.success) return <Navigate to="/" replace />
  const region = parsed.data

  const meta = getRegionMeta(region)
  const stops = getStopsByRegion(region)

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
