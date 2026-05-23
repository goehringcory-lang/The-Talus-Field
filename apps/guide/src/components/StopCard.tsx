import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { StopT } from '../content'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'

type Props = {
  stop: StopT
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
          {photo.caption && <p className="stop-card__caption">{photo.caption}</p>}
        </>
      ) : (
        <PhotoPlaceholder />
      )}

      <div className="eyebrow eyebrow--moss">
        {KIND_LABEL[stop.kind]}
      </div>
      <h2 className="stop-card__title">{stop.title}</h2>

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
