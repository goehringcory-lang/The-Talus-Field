// One stop as a single screen in the swipe deck: photo, name, the numbers
// that decide whether you stop there, and the same trip/save/visited actions
// the scrolling card carries. The body is a clamped teaser, not the article —
// the full read stays at /stop/:id, which is what "Read in full" opens.

import { Link } from 'react-router-dom'
import type { StopT } from '../content'
import { KIND_LABEL, DIFFICULTY_LABEL, formatElevation, formatTime } from '../content/labels'
import { plainSummary } from '../utils/text'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'
import StopActions from './StopActions'
import { Chip } from './ui/Chip'

type Props = {
  // Widened like StopCard's, so region-less secret spots render through it.
  stop: Omit<StopT, 'region'>
  regionLabel?: string
  // Overrides the corner tag. The Secret Guide names the category there,
  // which is what its tabs filter on; region pages keep the default.
  tag?: string
  // Panels adjacent to the visible one are already in the DOM; only the first
  // few are worth fetching eagerly.
  eager?: boolean
}

export default function StopDeckCard({ stop, regionLabel, tag, eager = false }: Props) {
  const photo = stop.photos[0]
  const teaser = stop.teaser ?? plainSummary(stop.body)
  const eyebrow =
    tag ??
    (stop.collection === 'hidden'
      ? `Secret Guide · ${KIND_LABEL[stop.kind]}`
      : KIND_LABEL[stop.kind])

  return (
    <article className="deck-card">
      <div className="deck-card__media">
        {photo ? (
          <ResponsivePhoto
            src={photo.src}
            alt={photo.caption ?? stop.title}
            loading={eager ? 'eager' : 'lazy'}
            width={1200}
            height={900}
            sizes="(max-width: 720px) 100vw, 700px"
          />
        ) : (
          <PhotoPlaceholder />
        )}
        <span className="deck-card__tag">{eyebrow}</span>
      </div>

      <div className="deck-card__body">
        <div className="deck-card__titlerow">
          <h2 className="deck-card__title">{stop.title}</h2>
          <StopActions stopId={stop.id} title={stop.title} />
        </div>

        {(stop.coord ||
          stop.elevationFt ||
          stop.timeBudgetMin ||
          stop.difficulty ||
          stop.season ||
          regionLabel) && (
          <div className="meta-row">
            <MapsLink coord={stop.coord} label={stop.title} />
            {regionLabel && <Chip variant="meta">{regionLabel}</Chip>}
            {stop.elevationFt !== undefined && (
              <Chip variant="meta">{formatElevation(stop.elevationFt)}</Chip>
            )}
            {stop.timeBudgetMin !== undefined && (
              <Chip variant="meta">{formatTime(stop.timeBudgetMin)}</Chip>
            )}
            {stop.difficulty && <Chip variant="meta">{DIFFICULTY_LABEL[stop.difficulty]}</Chip>}
            {stop.season && <Chip variant="meta">{stop.season}</Chip>}
          </div>
        )}

        {teaser && <p className="deck-card__teaser">{teaser}</p>}

        <div className="deck-card__foot">
          <Link to={`/stop/${stop.id}`} className="deck-card__more">
            Read in full →
          </Link>
          {stop.hazard && <span className="deck-card__caution">Caution noted</span>}
        </div>
      </div>
    </article>
  )
}
