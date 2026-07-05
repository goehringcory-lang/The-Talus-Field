import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { StopT } from '../content'
import { useFavorites } from '../lib/favorites'
import { announceNotice } from '../trip/addFeedback'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'

// Secret spots are stops minus `region`, which this card never reads —
// widening the prop lets both render through the same component.
type Props = {
  stop: Omit<StopT, 'region'>
  compact?: boolean
}

const KIND_LABEL: Record<StopT['kind'], string> = {
  viewpoint: 'Viewpoint',
  trailhead: 'Trailhead',
  parking: 'Parking',
  lodging: 'Lodging',
  meal: 'Meal',
  drive: 'Drive',
}

function formatElevation(ft: number): string {
  return `${ft.toLocaleString('en-US')} ft`
}

function formatTime(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

export default function StopCard({ stop, compact = true }: Props) {
  const photo = stop.photos[0]
  const { toggle, isFavorite } = useFavorites()
  const saved = isFavorite(stop.id)
  return (
    <article className="stop-card">
      {photo ? (
        <>
          <ResponsivePhoto
            className="stop-card__photo"
            src={photo.src}
            alt={photo.caption ?? stop.title}
            loading={compact ? 'lazy' : 'eager'}
            width={1200}
            height={900}
            style={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
          />
        </>
      ) : (
        <PhotoPlaceholder />
      )}

      <div className="stop-card__titlerow">
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow eyebrow--moss">
            {KIND_LABEL[stop.kind]}
          </div>
          <h2 className="stop-card__title">{stop.title}</h2>
        </div>
        <button
          type="button"
          className="fav-toggle"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${stop.title} from saved stops` : `Save ${stop.title}`}
          title={saved ? 'Saved' : 'Save stop'}
          onClick={() => {
            toggle(stop.id)
            announceNotice({ kind: saved ? 'removed' : 'saved', title: stop.title })
          }}
        >
          <svg className="fav-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </div>

      {(stop.coord || stop.elevationFt || stop.timeBudgetMin) && (
        <div className="meta-row">
          <MapsLink coord={stop.coord} label={stop.title} />
          {stop.elevationFt !== undefined && (
            <span className="meta-chip">{formatElevation(stop.elevationFt)}</span>
          )}
          {stop.timeBudgetMin !== undefined && (
            <span className="meta-chip">{formatTime(stop.timeBudgetMin)}</span>
          )}
        </div>
      )}

      <div className="prose">
        <ReactMarkdown>{stop.body}</ReactMarkdown>
      </div>

      {stop.swap && (
        <aside className="swap-callout">
          <span className="swap-callout__label">If full</span>
          {stop.swap}
        </aside>
      )}

      {compact && (
        <Link to={`/stop/${stop.id}`} className="stop-card__more">
          Read in full →
        </Link>
      )}
    </article>
  )
}
