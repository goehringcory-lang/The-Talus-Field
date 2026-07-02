import { Link, Navigate, useParams } from 'react-router-dom'
import { getRegionMeta, getStopById, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import { directionsUrl } from '../map/kinds'
import { useTripPlan } from '../trip/useTripPlan'

export default function StopDetail() {
  const params = useParams<{ stopId: string }>()
  const stop = params.stopId ? getStopById(params.stopId) : undefined
  const { plan, addStop } = useTripPlan()
  if (!stop) return <Navigate to="/" replace />
  const planned = plan.items.some((it) => it.type === 'stop' && it.stopId === stop.id)

  const siblings = getStopsByRegion(stop.region)
  const idx = siblings.findIndex((s) => s.id === stop.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
  const regionMeta = getRegionMeta(stop.region)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <p style={{ marginBottom: 24 }}>
          <Link
            to={`/region/${stop.region}`}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← {regionMeta?.title ?? 'Region'}
          </Link>
        </p>

        <StopCard stop={stop} compact={false} />

        <p style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {planned ? (
            <Link
              to="/trip"
              className="btn btn--ghost"
              style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              In your trip plan →
            </Link>
          ) : (
            <button
              type="button"
              className="btn"
              style={{ minHeight: 44 }}
              onClick={() => addStop(stop.id)}
            >
              Add to trip
            </button>
          )}
          {stop.coord && (
            <a
              className="btn btn--ghost"
              href={directionsUrl(stop.coord)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              Directions →
            </a>
          )}
        </p>

        <nav
          className="stop-prevnext"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 24,
            marginTop: 56,
            paddingTop: 24,
            borderTop: '1px solid var(--rule)',
          }}
        >
          <div style={{ flex: 1 }}>
            {prev ? (
              <Link to={`/stop/${prev.id}`} style={{ display: 'block' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>← Previous</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{prev.title}</div>
              </Link>
            ) : (
              <span style={{ opacity: 0.4 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>← Previous</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--ink-3)' }}>
                  Start of region
                </div>
              </span>
            )}
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            {next ? (
              <Link to={`/stop/${next.id}`} style={{ display: 'block' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Next →</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{next.title}</div>
              </Link>
            ) : (
              <span style={{ opacity: 0.4 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Next →</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--ink-3)' }}>
                  End of region
                </div>
              </span>
            )}
          </div>
        </nav>
      </main>
    </GatedChrome>
  )
}
