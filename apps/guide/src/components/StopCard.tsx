import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { StopT } from '../content'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import { useFavorites } from '../lib/favorites'
import AddToTripButton from './AddToTripButton'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import Plate from './Plate'
import ResponsivePhoto from './ResponsivePhoto'
import { Chip } from './ui/Chip'

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
  camping: 'Camping', // amenity-only kind today; no Stop uses it
}

const DIFFICULTY_LABEL: Record<NonNullable<StopT['difficulty']>, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
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
  const credit = photo ? PHOTO_CREDITS[photo.src] : undefined
  const { toggle, isFavorite } = useFavorites()
  const saved = isFavorite(stop.id)
  const plateTag = `Plate · ${KIND_LABEL[stop.kind]}`
  return (
    <article className="stop-card">
      <Plate
        tag={plateTag}
        caption={!compact ? photo?.caption : undefined}
        credit={!compact && credit ? formatCredit(credit) : undefined}
      >
        {photo ? (
          <ResponsivePhoto
            className="stop-card__photo"
            src={photo.src}
            alt={photo.caption ?? stop.title}
            loading={compact ? 'lazy' : 'eager'}
            width={1200}
            height={900}
            style={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
          />
        ) : (
          <PhotoPlaceholder />
        )}
      </Plate>

      <div className="stop-card__titlerow">
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow eyebrow--moss">
            {stop.collection === 'hidden'
              ? `Hidden area · ${KIND_LABEL[stop.kind]}`
              : KIND_LABEL[stop.kind]}
          </div>
          <h2 className="stop-card__title">{stop.title}</h2>
        </div>
        <div className="stop-card__actions">
          <AddToTripButton stopId={stop.id} title={stop.title} />
          <button
            type="button"
            className="fav-toggle"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${stop.title} from saved stops` : `Save ${stop.title}`}
            title={saved ? 'Saved' : 'Save stop'}
            onClick={() => toggle(stop.id)}
          >
            <svg className="fav-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
            </svg>
          </button>
        </div>
      </div>

      {(stop.coord || stop.elevationFt || stop.timeBudgetMin || stop.difficulty || stop.season) && (
        <div className="meta-row">
          <MapsLink coord={stop.coord} label={stop.title} />
          {stop.elevationFt !== undefined && (
            <Chip variant="meta">{formatElevation(stop.elevationFt)}</Chip>
          )}
          {stop.timeBudgetMin !== undefined && (
            <Chip variant="meta">{formatTime(stop.timeBudgetMin)}</Chip>
          )}
          {stop.difficulty && (
            <Chip variant="meta">{DIFFICULTY_LABEL[stop.difficulty]}</Chip>
          )}
          {stop.season && <Chip variant="meta">{stop.season}</Chip>}
        </div>
      )}

      <div className={compact ? 'prose' : 'prose prose--dropcap'}>
        <ReactMarkdown>{stop.body}</ReactMarkdown>
      </div>

      {stop.hazard && (
        <aside className="swap-callout swap-callout--hazard">
          <span className="swap-callout__label">Caution</span>
          {stop.hazard}
        </aside>
      )}

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
