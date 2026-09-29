// Shared pieces of the Secret Guide (September 2026 redesign): the icon set,
// the fact strip, and the two ways an entry appears in the index (the
// chapter's feature and the row). /secret-guide and the Secret Guide's entry
// pages (StopDetail) both draw from here, so an entry reads the same in the
// index, on its own page, and in the "nearby" tiles under it.
//
// The look is the editorial site's /firefall and /itineraries: a photograph
// under a green scrim, a four-cell fact strip with line icons, rust eyebrows,
// EB Garamond heads, top-ruled tiles. Every colour is a token, so the granite
// scheme follows without a second stylesheet.

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SECRET_GUIDE_CATEGORY_TITLE, type GuideStopT } from '../content'
import { KIND_LABEL } from '../content/labels'
import { entryMeta, folioLabel } from '../lib/secretGuide'
import AddToTripButton from './AddToTripButton'
import PhotoPlaceholder from './PhotoPlaceholder'
import ResponsivePhoto from './ResponsivePhoto'
import StopActions from './StopActions'
import './SecretGuide.css'

// ---------------------------------------------------------------------------
// Icons: 24-unit line glyphs drawn in currentColor, one stroke weight, so a
// cell's icon takes the rust of its label and follows the scheme.

export type SgIconName =
  | 'book'
  | 'pin'
  | 'offline'
  | 'plan'
  | 'clock'
  | 'peak'
  | 'boot'
  | 'leaf'
  | 'sun'
  | 'moon'
  | 'warn'
  | 'swap'
  | 'car'
  | 'star'
  | 'ticket'
  | 'compass'
  | 'arrow'
  | 'down'
  | 'cards'
  | 'lock'

const PATHS: Record<SgIconName, ReactNode> = {
  book: <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5zM11 20h2" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  offline: (
    <>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M5 19.5h14" />
    </>
  ),
  plan: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M12 13v4M10 15h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  peak: <path d="M3 19.5 9.5 8l3.5 6 2-3 6 8.5z" />,
  boot: <path d="M7 4h5v7l6.5 2.5a2 2 0 0 1 1.5 2V18H6V9zM6 18v2h14v-2" />,
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" />
      <path d="M5 19 13 11" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" />
    </>
  ),
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5 7.5 7.5 0 1 0 19 14.5z" />,
  warn: (
    <>
      <path d="M12 4 21 19.5H3z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  swap: <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />,
  car: (
    <>
      <path d="M5 16.5V12l1.8-4.6A1.5 1.5 0 0 1 8.2 6.5h7.6a1.5 1.5 0 0 1 1.4.9L19 12v4.5z" />
      <path d="M5 12h14M7 16.5V19M17 16.5V19" />
    </>
  ),
  star: <path d="M12 3.8l2.4 5 5.4.6-4 3.7 1.1 5.4L12 15.8l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" />,
  ticket: (
    <>
      <path d="M4 7.5h16v3a1.5 1.5 0 0 0 0 3v3H4v-3a1.5 1.5 0 0 0 0-3z" />
      <path d="M14 7.5v9" strokeDasharray="1.5 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  cards: (
    <>
      <rect x="6" y="3.5" width="12" height="15" rx="1.5" />
      <path d="M4 7v12.5A1.5 1.5 0 0 0 5.5 21H16" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" />
    </>
  ),
}

export function SgIcon({ name, size = 20 }: { name: SgIconName; size?: number }) {
  return (
    <svg className="sg-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// The fact strip: the /firefall row of four readings, each an icon, a mono
// label, a serif value and an optional note. A cell with `to` is a link.

export type SgFact = {
  icon: SgIconName
  label: string
  value: ReactNode
  note?: ReactNode
  to?: string
  href?: string // an outside link (directions), opened in a new tab
  signal?: boolean
}

export function SgFacts({ facts, label, className }: { facts: SgFact[]; label: string; className?: string }) {
  return (
    <dl className={className ? `sg-facts ${className}` : 'sg-facts'} aria-label={label}>
      {facts.map((f) => (
        <div key={f.label} className="sg-fact">
          <SgIcon name={f.icon} />
          <dt className="sg-fact__label">{f.label}</dt>
          <dd className={f.signal ? 'sg-fact__value sg-fact__value--signal' : 'sg-fact__value'}>
            {f.to ? (
              <Link to={f.to}>{f.value}</Link>
            ) : f.href ? (
              <a href={f.href} target="_blank" rel="noreferrer">
                {f.value}
              </a>
            ) : (
              f.value
            )}
          </dd>
          {f.note && <dd className="sg-fact__note">{f.note}</dd>}
        </div>
      ))}
    </dl>
  )
}

function EntryPhoto({
  s,
  sizes,
  eager = false,
  width = 800,
  height = 600,
}: {
  s: GuideStopT
  sizes: string
  eager?: boolean
  width?: number
  height?: number
}) {
  const photo = s.photos[0]
  if (!photo) return <PhotoPlaceholder />
  return (
    <ResponsivePhoto
      src={photo.src}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      width={width}
      height={height}
      sizes={sizes}
    />
  )
}

// ---------------------------------------------------------------------------
// The chapter's feature: its first entry, photograph first.

export function SgFeature({ s, eager = false }: { s: GuideStopT; eager?: boolean }) {
  const meta = entryMeta(s)
  return (
    <article className="sg-feature" id={s.id}>
      <Link className="sg-feature__media" to={`/stop/${s.id}`} tabIndex={-1} aria-hidden="true">
        <EntryPhoto s={s} eager={eager} sizes="(max-width: 760px) 100vw, 640px" width={1200} height={800} />
        <span className="sg-badge">{folioLabel(s.id)}</span>
      </Link>
      <div className="sg-feature__body">
        <span className="sg-kicker">
          {KIND_LABEL[s.kind]}
          {s.category ? ` · ${SECRET_GUIDE_CATEGORY_TITLE[s.category]}` : ''}
        </span>
        <h3 className="sg-feature__title">
          <Link to={`/stop/${s.id}`}>{s.title}</Link>
        </h3>
        {s.teaser && <p className="sg-feature__teaser">{s.teaser}</p>}
        {meta.length > 0 && (
          <p className="sg-meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        )}
        <div className="sg-feature__foot">
          <Link className="sg-readlink" to={`/stop/${s.id}`}>
            Read the entry
            <SgIcon name="arrow" size={16} />
          </Link>
          <StopActions stopId={s.id} title={s.title} />
        </div>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// One entry as a row: thumbnail, number, title, teaser, the measured line, and
// the add-to-trip toggle. The title's link stretches over the row; the toggle
// sits above it, so a tap on the calendar never opens the entry.

export function SgRow({ s }: { s: GuideStopT }) {
  const meta = entryMeta(s)
  return (
    <article className="sg-row" id={s.id}>
      <span className="sg-row__thumb">
        <EntryPhoto s={s} sizes="96px" width={240} height={240} />
      </span>
      <div className="sg-row__text">
        <span className="sg-kicker">{folioLabel(s.id)}</span>
        <h3 className="sg-row__title">
          <Link to={`/stop/${s.id}`}>{s.title}</Link>
        </h3>
        {s.teaser && <p className="sg-row__teaser">{s.teaser}</p>}
        {meta.length > 0 && (
          <p className="sg-meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        )}
      </div>
      <div className="sg-row__act">
        <AddToTripButton stopId={s.id} title={s.title} />
      </div>
    </article>
  )
}

// A small photo tile: the "nearby" set under an entry, and the picks panel.
export function SgMiniTile({ s, note }: { s: GuideStopT; note?: string }) {
  return (
    <Link className="sg-mini" to={`/stop/${s.id}`}>
      <span className="sg-mini__media">
        <EntryPhoto s={s} sizes="(max-width: 760px) 50vw, 240px" width={480} height={320} />
        <span className="sg-badge sg-badge--small">{folioLabel(s.id)}</span>
      </span>
      <span className="sg-mini__body">
        <span className="sg-kicker">{s.category ? SECRET_GUIDE_CATEGORY_TITLE[s.category] : KIND_LABEL[s.kind]}</span>
        <span className="sg-mini__title">{s.title}</span>
        {note && <span className="sg-mini__note">{note}</span>}
      </span>
    </Link>
  )
}
