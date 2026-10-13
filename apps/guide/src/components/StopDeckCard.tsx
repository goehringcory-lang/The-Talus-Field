// One stop as a single screen in the swipe deck, read top to bottom in the
// order a reader decides in: what it is (label and name), what it looks like,
// what it costs (the facts strip), why go (a clamped teaser), then the way in.
// The name sits above the photo on purpose: the photo absorbs whatever height
// is left, so anything under it lands at a different height on every card,
// and a name that jumps on each swipe is what made the deck read as unrelated
// screens. The label, the name and the foot now hold still; only the photo
// flexes. The full read stays at /stop/:id, which is what the button opens.

import { Link } from 'react-router-dom'
import type { StopT } from '../content'
import { KIND_LABEL, DIFFICULTY_LABEL, formatElevation, formatTime } from '../content/labels'
import { plainSummary } from '../utils/text'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'
import StopActions from './StopActions'

type Props = {
  // Widened like StopCard's, so region-less secret spots render through it.
  stop: Omit<StopT, 'region'>
  regionLabel?: string
  // Overrides the label line. The Secret Guide names the category there,
  // which is what its tabs filter on; region pages name the place in the
  // driving order.
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
  // The measured facts, in the order they rule a stop in or out. A missing
  // one is left out rather than dashed: the strip is flex, so it closes
  // cleanly at any count.
  const facts: { label: string; value: string; signal?: boolean }[] = []
  if (stop.timeBudgetMin !== undefined) facts.push({ label: 'Time', value: formatTime(stop.timeBudgetMin) })
  if (stop.difficulty) facts.push({ label: 'Effort', value: DIFFICULTY_LABEL[stop.difficulty] })
  if (stop.elevationFt !== undefined) facts.push({ label: 'Elev', value: formatElevation(stop.elevationFt) })
  if (regionLabel) facts.push({ label: 'Area', value: regionLabel })
  if (stop.season) facts.push({ label: 'Season', value: stop.season, signal: true })

  return (
    <article className="deck-card">
      <header className="deck-card__head">
        <div className="deck-card__labelrow">
          <span className="eyebrow eyebrow--moss deck-card__label">{eyebrow}</span>
          {stop.hazard && <span className="deck-card__caution">Caution noted</span>}
        </div>
        <h2 className="deck-card__title">{stop.title}</h2>
      </header>

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
        <MapsLink coord={stop.coord} label={stop.title} variant="plate" />
      </div>

      {facts.length > 0 && (
        <dl className="deck-facts">
          {facts.map((f) => (
            <div className="deck-facts__cell" key={f.label}>
              <dt className="spec__label">{f.label}</dt>
              <dd className={`spec__value${f.signal ? ' spec__value--signal' : ''}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {teaser && <p className="deck-card__teaser">{teaser}</p>}

      <div className="deck-card__foot">
        <Link to={`/stop/${stop.id}`} className="btn deck-card__more">
          Read in full →
        </Link>
        <StopActions stopId={stop.id} title={stop.title} />
      </div>
    </article>
  )
}
