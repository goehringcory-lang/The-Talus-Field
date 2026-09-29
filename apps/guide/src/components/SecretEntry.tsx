// A Secret Guide entry's own page (StopDetail renders this for hidden stops
// and secret spots; core stops keep StopCard). The September 2026 redesign:
// the entry's number and chapter over a big serif title, the photograph
// beside it, a fact strip with line icons, the actions as buttons, the body
// in the reading column, the callouts as ruled boxes, then the three nearest
// Secret Guide entries and a prev/next pair that sits in the page rather than
// over it.
//
// Everything StopDetail joins on the device (hikes from the trailhead, lots
// nearby, the reader's notes, the report link) arrives as `children` and
// renders in the reading column, so the two layouts cannot drift on them.

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_CATEGORY_TITLE,
  SECRET_NUMERALS,
  getSecretGuideEntries,
  type GuideStopT,
} from '../content'
import { DIFFICULTY_LABEL, KIND_LABEL, formatElevation, formatTime } from '../content/labels'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import { roadForStopId } from '../content/roads'
import { directionsUrl } from '../map/kinds'
import { sunTimes } from '../sun/solar'
import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'
import { todayIso } from '../utils/date'
import { formatMiles, haversineMiles } from '../utils/geo'
import ArchiveNote from './ArchiveNote'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'
import RoadNote from './RoadNote'
import ShareStopButton from './ShareStopButton'
import StopActions from './StopActions'
import { PHOTO_TIMING_LABEL, lightClock } from '../lib/photoLight'
import { folioLabel } from '../lib/secretGuide'
import { CalloutMarkdown } from './StopCard'
import { SgFacts, SgIcon, SgMiniTile, type SgFact } from './SecretGuideParts'

// Four: two rows of two on a phone, one row on a wide screen, no hole.
const NEARBY_COUNT = 4

type Props = {
  stop: GuideStopT
  prev: GuideStopT | null
  next: GuideStopT | null
  // Rendered between the callouts and the nearby tiles: StopDetail's joins.
  children?: ReactNode
  // Rendered right under the actions: StopDetail's pin notice, forecast line
  // and seasonal notices, which belong next to the facts they qualify.
  notices?: ReactNode
}

export default function SecretEntry({ stop, prev, next, children, notices }: Props) {
  const { plan, addStop } = useTripPlan()
  const planned = plan.items.some((it) => it.type === 'stop' && it.stopId === stop.id)
  const all = getSecretGuideEntries()
  const chapterIdx = SECRET_GUIDE_CATEGORIES.findIndex((c) => c.id === stop.category)
  const chapter = stop.category ? SECRET_GUIDE_CATEGORY_TITLE[stop.category] : null
  const photo = stop.photos[0]
  const credit = photo ? PHOTO_CREDITS[photo.src] : undefined
  const road = roadForStopId(stop.id)
  const sun = stop.photoTiming ? sunTimes(todayIso()) : null
  const light = stop.photoTiming && sun ? lightClock(stop.photoTiming.best, sun) : null
  const backTo = `/secret-guide${stop.category ? `?cat=${stop.category}` : ''}`

  // The measured facts, in the order a reader standing at the car needs them.
  const facts: SgFact[] = []
  if (stop.cost) facts.push({ icon: 'ticket', label: 'Cost', value: stop.cost })
  if (stop.coord) {
    facts.push({
      icon: 'pin',
      label: 'Where',
      value: `${stop.coord[1].toFixed(4)} N, ${Math.abs(stop.coord[0]).toFixed(4)} W`,
      href: directionsUrl(stop.coord),
      note: 'Directions in your maps app',
    })
  }
  if (stop.elevationFt !== undefined)
    facts.push({ icon: 'peak', label: 'Elevation', value: formatElevation(stop.elevationFt) })
  if (stop.timeBudgetMin !== undefined)
    facts.push({ icon: 'clock', label: 'Allow', value: formatTime(stop.timeBudgetMin) })
  if (stop.difficulty) facts.push({ icon: 'boot', label: 'Effort', value: DIFFICULTY_LABEL[stop.difficulty] })
  if (stop.season) facts.push({ icon: 'leaf', label: 'When', value: stop.season, signal: true })
  if (stop.photoTiming)
    facts.push({
      icon: stop.photoTiming.best === 'night' ? 'moon' : 'sun',
      label: 'Best light',
      value: PHOTO_TIMING_LABEL[stop.photoTiming.best] ?? stop.photoTiming.best,
      note: light ? `${light} today` : undefined,
      signal: true,
    })

  // The nearest other entries with a pin, as the crow flies: what else is
  // worth the stop while you are here.
  const nearby = stop.coord
    ? all
        .filter((s) => s.id !== stop.id && s.coord)
        .map((s) => ({ s, mi: haversineMiles(stop.coord!, s.coord!) }))
        .sort((a, b) => a.mi - b.mi)
        .slice(0, NEARBY_COUNT)
    : []

  return (
    <main className="sg-entry">
      <div className="wrap">
        <div className="sg-entry__top">
          <Link className="sg-entry__back" to={backTo}>
            <SgIcon name="arrow" size={14} />
            {chapter ? `The Secret Guide · ${chapter}` : 'The Secret Guide'}
          </Link>
        </div>

        <div className="sg-entry__head">
          <div>
            <p className="sg-entry__folio">
              <span>
                {folioLabel(stop.id)} of {all.length}
              </span>
              {chapter && chapterIdx >= 0 && (
                <span>
                  {SECRET_NUMERALS[chapterIdx]} · {chapter}
                </span>
              )}
              {/* The kind, unless the chapter already says it (Parking, Programs). */}
              {!chapter?.toLowerCase().startsWith(KIND_LABEL[stop.kind].toLowerCase()) && (
                <span>{KIND_LABEL[stop.kind]}</span>
              )}
            </p>
            <h1 className="sg-entry__title">{stop.title}</h1>
            {stop.teaser && <p className="sg-entry__dek">{stop.teaser}</p>}
            <div className="sg-entry__acts">
              <StopActions stopId={stop.id} title={stop.title} />
            </div>
          </div>
          <figure style={{ margin: 0 }}>
            <div className="sg-entry-hero">
              {photo ? (
                <ResponsivePhoto
                  src={photo.src}
                  alt={photo.caption ?? stop.title}
                  loading="eager"
                  width={1200}
                  height={900}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
              ) : (
                <PhotoPlaceholder />
              )}
            </div>
            {(photo?.caption || credit) && (
              <figcaption className="sg-entry__caption">
                {photo?.caption}
                {photo?.caption && credit ? ' ' : ''}
                {credit ? formatCredit(credit) : ''}
              </figcaption>
            )}
          </figure>
        </div>

        {facts.length > 0 && (
          <SgFacts facts={facts} label={`${stop.title} at a glance`} className="sg-facts--page sg-entry__facts" />
        )}

        {stop.booking && (
          <div className="sg-entry__book">
            <a className="sg-btn" href={stop.booking.url} target="_blank" rel="noreferrer">
              <SgIcon name="ticket" size={18} />
              {stop.booking.verb === 'Book' ? `Book with ${stop.booking.source}` : `Schedule at ${stop.booking.source}`}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}

        <div className="sg-entry__buttons">
          {planned ? (
            <Link className="sg-btn sg-btn--ghost" to="/trip">
              <SgIcon name="plan" size={18} />
              In your trip plan
            </Link>
          ) : (
            <button
              type="button"
              className={stop.booking ? 'sg-btn sg-btn--ghost' : 'sg-btn'}
              onClick={() => {
                addStop(stop.id)
                announceTripAdd(stop.title)
              }}
            >
              <SgIcon name="plan" size={18} />
              Add to trip
            </button>
          )}
          {stop.coord && (
            <a className="sg-btn sg-btn--ghost" href={directionsUrl(stop.coord)} target="_blank" rel="noreferrer">
              <SgIcon name="car" size={18} />
              Directions
            </a>
          )}
          {stop.coord && (
            <Link className="sg-btn sg-btn--ghost" to={`/map?stop=${stop.id}`}>
              <SgIcon name="pin" size={18} />
              On the map
            </Link>
          )}
          {stop.coord && (
            <Link className="sg-btn sg-btn--ghost" to={`/compass?to=${stop.id}`}>
              <SgIcon name="compass" size={18} />
              Bearing
            </Link>
          )}
          <ShareStopButton stopId={stop.id} title={stop.title} />
        </div>

        {notices}

        <div className="sg-entry__body">
          <div className="prose prose--dropcap">
            <ReactMarkdown>{stop.body}</ReactMarkdown>
          </div>

          {stop.hazard && (
            <aside className="sg-callout sg-callout--hazard">
              <SgIcon name="warn" />
              <span className="sg-callout__label">Caution</span>
              <span>
                <CalloutMarkdown text={stop.hazard} />
              </span>
            </aside>
          )}

          {road && <RoadNote road={road} />}

          {stop.swap && (
            <aside className="sg-callout sg-callout--swap">
              <SgIcon name="swap" />
              <span className="sg-callout__label">{stop.category === 'programs' ? 'Instead' : 'If full'}</span>
              <span>
                <CalloutMarkdown text={stop.swap} />
              </span>
            </aside>
          )}

          {stop.photoTiming && (
            <aside className="sg-callout sg-callout--light">
              <SgIcon name={stop.photoTiming.best === 'night' ? 'moon' : 'sun'} />
              <span className="sg-callout__label">
                Best light: {PHOTO_TIMING_LABEL[stop.photoTiming.best] ?? stop.photoTiming.best}
                {light ? ` · ${light} today` : ''}
              </span>
              <span>{stop.photoTiming.note}</span>
            </aside>
          )}

          {stop.history && <ArchiveNote note={stop.history} />}

          {children}
        </div>

        {nearby.length > 0 && (
          <section className="sg-entry__more" aria-labelledby="sg-nearby-title">
            <div className="sg-entry__more-head">
              <h2 id="sg-nearby-title">Nearby in the Secret Guide</h2>
              <Link to="/secret-guide">All entries</Link>
            </div>
            <div className="sg-minis">
              {nearby.map(({ s, mi }) => (
                <SgMiniTile key={s.id} s={s} note={`${formatMiles(mi)} away`} />
              ))}
            </div>
          </section>
        )}

        <nav className="sg-pager" aria-label={chapter ? `More in ${chapter}` : 'More entries'}>
          {prev ? (
            <Link to={`/stop/${prev.id}`}>
              <small>← Previous</small>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span>
              <small>← Previous</small>
              <strong>Start of the chapter</strong>
            </span>
          )}
          {next ? (
            <Link className="sg-pager__next" to={`/stop/${next.id}`}>
              <small>Next →</small>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span className="sg-pager__next">
              <small>Next →</small>
              <strong>End of the chapter</strong>
            </span>
          )}
        </nav>
      </div>
    </main>
  )
}
