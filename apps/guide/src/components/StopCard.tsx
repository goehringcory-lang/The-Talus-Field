import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { StopT } from '../content'
import { KIND_LABEL, DIFFICULTY_LABEL, formatElevation, formatTime } from '../content/labels'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import ArchiveNote from './ArchiveNote'
import MapsLink from './MapsLink'
import PhotoPlaceholder from './PhotoPlaceholder'
import Plate from './Plate'
import ResponsivePhoto from './ResponsivePhoto'
import StopActions from './StopActions'
import { Chip } from './ui/Chip'

// Swap and hazard text through markdown, unwrapped: the named alternative in
// a swap ("continue to [Valley View](/stop/valley-view)") should be one tap,
// not a re-search — the whole point of the callout is what to do NEXT. The
// paragraph unwrap keeps the callout's inline flow (label then text) exactly
// as it was when these rendered as plain strings.
function CalloutMarkdown({ text }: { text: string }) {
  return <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{text}</ReactMarkdown>
}

// Display labels for PhotoTiming.best. Kept local rather than in
// content/labels.ts: this is presentation only, not a fact about the stop.
const PHOTO_TIMING_LABEL: Record<string, string> = {
  sunrise: 'sunrise',
  'golden-am': 'morning',
  sunset: 'sunset',
  'golden-pm': 'evening',
  night: 'after dark',
}

// Secret spots are stops minus `region`, which this card never reads —
// widening the prop lets both render through the same component. Pages that
// mix regions (the Secret Guide) pass `regionLabel` for an extra meta chip.
type Props = {
  stop: Omit<StopT, 'region'>
  compact?: boolean
  regionLabel?: string
  // The signed-out sample (/preview) renders real cards but not the app
  // actions: add-to-trip and save belong to buyers.
  actions?: boolean
  // The heading level for the stop title. h2 everywhere a page carries several
  // of these (region lists, the Secret Guide, /preview); only the stop page,
  // where the card is the page, passes h1. Gated on this prop rather than on
  // `compact` because /preview renders full cards and must not grow five h1s.
  titleAs?: 'h1' | 'h2'
}

export default function StopCard({
  stop,
  compact = true,
  regionLabel,
  actions = true,
  titleAs: Title = 'h2',
}: Props) {
  const photo = stop.photos[0]
  const credit = photo ? PHOTO_CREDITS[photo.src] : undefined
  const plateTag = `Plate · ${KIND_LABEL[stop.kind]}`
  return (
    <article className="stop-card">
      <Plate
        tag={plateTag}
        caption={!compact ? photo?.caption : undefined}
        credit={!compact && credit ? formatCredit(credit) : undefined}
        // The full read gets the instrument frame; list cards keep the plate,
        // where a scrim over four stacked photos would only muddy the scan.
        hud={!compact}
        footer={
          !compact && (stop.coord || stop.elevationFt !== undefined) ? (
            <>
              <span>
                {stop.coord
                  ? `${stop.coord[1].toFixed(4)} N · ${Math.abs(stop.coord[0]).toFixed(4)} W`
                  : ''}
              </span>
              <span>{stop.elevationFt !== undefined ? formatElevation(stop.elevationFt) : ''}</span>
            </>
          ) : undefined
        }
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
              ? `Secret Guide · ${KIND_LABEL[stop.kind]}`
              : KIND_LABEL[stop.kind]}
          </div>
          <Title className="stop-card__title">{stop.title}</Title>
        </div>
        {actions && <StopActions stopId={stop.id} title={stop.title} />}
      </div>

      {/* The full read states the measured facts as a spec strip: these are
          readings, and a row of pills reads as a set of filters instead. List
          cards keep the pills, which wrap better under a stack of headlines. */}
      {!compact &&
        (stop.coord ||
          stop.elevationFt !== undefined ||
          stop.timeBudgetMin !== undefined ||
          stop.difficulty ||
          stop.season ||
          regionLabel) && (
          <div className="spec-strip">
            <MapsLink coord={stop.coord} label={stop.title} variant="spec" />
            {stop.elevationFt !== undefined && (
              <div className="spec">
                <span className="spec__label">Elev</span>
                <span className="spec__value">{formatElevation(stop.elevationFt)}</span>
              </div>
            )}
            {stop.timeBudgetMin !== undefined && (
              <div className="spec">
                <span className="spec__label">Time</span>
                <span className="spec__value">{formatTime(stop.timeBudgetMin)}</span>
              </div>
            )}
            {stop.difficulty && (
              <div className="spec">
                <span className="spec__label">Effort</span>
                <span className="spec__value">{DIFFICULTY_LABEL[stop.difficulty]}</span>
              </div>
            )}
            {stop.season && (
              <div className="spec">
                <span className="spec__label">Season</span>
                <span className="spec__value spec__value--signal">{stop.season}</span>
              </div>
            )}
            {regionLabel && (
              <div className="spec">
                <span className="spec__label">Region</span>
                <span className="spec__value">{regionLabel}</span>
              </div>
            )}
            {stop.photoTiming && (
              <div className="spec">
                <span className="spec__label">Light</span>
                <span className="spec__value spec__value--signal">
                  {PHOTO_TIMING_LABEL[stop.photoTiming.best] ?? stop.photoTiming.best}
                </span>
              </div>
            )}
          </div>
        )}

      {compact &&
        (stop.coord || stop.elevationFt || stop.timeBudgetMin || stop.difficulty || stop.season || regionLabel) && (
        <div className="meta-row">
          <MapsLink coord={stop.coord} label={stop.title} />
          {regionLabel && <Chip variant="meta">{regionLabel}</Chip>}
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
          <CalloutMarkdown text={stop.hazard} />
        </aside>
      )}

      {stop.swap && (
        <aside className="swap-callout">
          <span className="swap-callout__label">If full</span>
          <CalloutMarkdown text={stop.swap} />
        </aside>
      )}

      {/* Full read only. On the region list and the Secret Guide these cards
          already carry the whole body, and a citation block on every one of
          them turns a scannable list into a bibliography. */}
      {!compact && stop.history && <ArchiveNote note={stop.history} />}

      {/* Full read only, same reasoning as the archive note above. Text only —
          the actual sunrise/sunset/golden-hour clock times for today live in
          SunLine (src/sun), not here; this is just the light advice. Reuses
          the archive-note look rather than a new style for one more aside. */}
      {!compact && stop.photoTiming && (
        <aside className="archive-note">
          <span className="archive-note__label">
            Best light: {PHOTO_TIMING_LABEL[stop.photoTiming.best] ?? stop.photoTiming.best}
          </span>
          <p className="archive-note__body">{stop.photoTiming.note}</p>
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
