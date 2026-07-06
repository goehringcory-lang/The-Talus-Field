// Prev/next folio line at the foot of stop and essential detail pages. Pass
// null with an emptyLabel ("Start of region") to render the disabled side;
// pass undefined to render nothing on that side.

import { Link } from 'react-router-dom'

type Item = { to: string; title: string }

type SideProps = {
  item: Item | null | undefined
  emptyLabel?: string
  direction: 'prev' | 'next'
}

function Side({ item, emptyLabel, direction }: SideProps) {
  const eyebrow = direction === 'prev' ? '← Previous' : 'Next →'
  const sideCls = `prevnext__side${direction === 'next' ? ' prevnext__side--next' : ''}`
  if (item) {
    return (
      <div className={sideCls}>
        <Link to={item.to}>
          <span className="eyebrow">{eyebrow}</span>
          <span className="prevnext__title">{item.title}</span>
        </Link>
      </div>
    )
  }
  if (item === null && emptyLabel) {
    return (
      <div className={`${sideCls} prevnext__side--empty`}>
        <span className="eyebrow">{eyebrow}</span>
        <span className="prevnext__title">{emptyLabel}</span>
      </div>
    )
  }
  return <div className={sideCls} />
}

type Props = {
  prev: Item | null | undefined
  next: Item | null | undefined
  prevEmptyLabel?: string
  nextEmptyLabel?: string
  ariaLabel?: string
  sticky?: boolean
}

export default function PrevNextNav({ prev, next, prevEmptyLabel, nextEmptyLabel, ariaLabel, sticky = false }: Props) {
  return (
    <nav className={sticky ? 'prevnext stop-prevnext' : 'prevnext'} aria-label={ariaLabel}>
      <Side item={prev} emptyLabel={prevEmptyLabel} direction="prev" />
      <Side item={next} emptyLabel={nextEmptyLabel} direction="next" />
    </nav>
  )
}
