import { Link, Navigate, useParams } from 'react-router-dom'
import { getRegionMeta, getStopById, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import { directionsUrl } from '../map/kinds'
import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'
import '../styles/app.css'

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
      <main className="wrap wrap--narrow page">
        <p className="backlink-row">
          <Link to={`/region/${stop.region}`} className="backlink">
            ← {regionMeta?.title ?? 'Region'}
          </Link>
        </p>

        <StopCard stop={stop} compact={false} />

        <p className="action-row">
          {planned ? (
            <Link to="/trip" className="btn btn--ghost btn--tall">
              In your trip plan →
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn--tall"
              onClick={() => {
                addStop(stop.id)
                announceTripAdd(stop.title)
              }}
            >
              Add to trip
            </button>
          )}
          {stop.coord && (
            <a
              className="btn btn--ghost btn--tall"
              href={directionsUrl(stop.coord)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions →
            </a>
          )}
        </p>

        <nav className="stop-prevnext prevnext">
          <div className="prevnext__cell">
            {prev ? (
              <Link to={`/stop/${prev.id}`} className="prevnext__link">
                <div className="eyebrow">← Previous</div>
                <div className="prevnext__title">{prev.title}</div>
              </Link>
            ) : (
              <span className="prevnext__disabled">
                <div className="eyebrow">← Previous</div>
                <div className="prevnext__title prevnext__title--muted">
                  Start of region
                </div>
              </span>
            )}
          </div>
          <div className="prevnext__cell prevnext__cell--next">
            {next ? (
              <Link to={`/stop/${next.id}`} className="prevnext__link">
                <div className="eyebrow">Next →</div>
                <div className="prevnext__title">{next.title}</div>
              </Link>
            ) : (
              <span className="prevnext__disabled">
                <div className="eyebrow">Next →</div>
                <div className="prevnext__title prevnext__title--muted">
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
