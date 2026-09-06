// The Secret Guide's opening plate: the section's name, its promise, and a
// numbered table of contents whose rows set the category filter. Two cuts of
// one component: the list page's full folio (taglines, the foot line) and the
// deck's opening panel (`compact`), which has to fit one screen because a deck
// panel is never a scroll container (CardDeck.css).
//
// It always draws in the granite palette, whatever the reader's scheme (see
// .sg-folio in styles/components.css for why): this is the one surface in the
// app that reads as the object the buyer paid for.

import {
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_META,
  SECRET_NUMERALS,
  type SecretCategoryT,
} from '../content'
import { useDocumentTitle } from '../lib/documentTitle'

type Props = {
  total: number
  counts: Record<SecretCategoryT, number>
  active: SecretCategoryT | null
  onSelect: (next: SecretCategoryT | null) => void
  compact?: boolean
  // The list page's folio owns the page's h1 and its document title; the
  // deck's copy sits under a deck bar that already carries the h1.
  titleAs?: 'h1' | 'h2'
}

export default function SecretFolio({
  total,
  counts,
  active,
  onSelect,
  compact = false,
  titleAs: Title = 'h1',
}: Props) {
  useDocumentTitle(Title === 'h1' ? SECRET_GUIDE_META.title : undefined)
  return (
    <section
      className={compact ? 'sg-folio sg-folio--deck' : 'sg-folio'}
      aria-label={SECRET_GUIDE_META.title}
    >
      <div className="sg-folio__ticks" aria-hidden="true" />
      <div className="sg-folio__head">
        <span>{SECRET_GUIDE_META.eyebrow}</span>
        <span>
          {total} {total === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <Title className="sg-folio__title">{SECRET_GUIDE_META.title}</Title>
      <p className="sg-folio__teaser">{SECRET_GUIDE_META.teaser}</p>
      <ol className="sg-folio__index" aria-label="Contents">
        {SECRET_GUIDE_CATEGORIES.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className="sg-folio__row"
              aria-pressed={active === c.id}
              aria-label={`${c.title}, ${counts[c.id]} ${counts[c.id] === 1 ? 'entry' : 'entries'}`}
              onClick={() => onSelect(active === c.id ? null : c.id)}
            >
              <span className="sg-folio__num" aria-hidden="true">
                {SECRET_NUMERALS[i]}
              </span>
              <span className="sg-folio__name">{c.title}</span>
              {!compact && <span className="sg-folio__tag">{c.tagline}</span>}
              <span className="sg-folio__count" aria-hidden="true">
                {String(counts[c.id]).padStart(2, '0')}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="sg-folio__foot" aria-label="What every entry carries">
        {SECRET_GUIDE_META.promises.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  )
}
