import { Link } from 'react-router-dom'

type Props = {
  to: string
  title: string
  teaser: string
  meta: string
  eyebrow?: string
  locked?: boolean
}

export default function SectionCard({ to, title, teaser, meta, eyebrow = 'The Field Guide', locked = false }: Props) {
  return (
    <Link to={to} className={locked ? 'region-picker-card region-picker-card--locked' : 'region-picker-card'}>
      <div className="eyebrow eyebrow--moss">{eyebrow}</div>
      <h2 className="region-picker-card__title">{title}</h2>
      <p className="region-picker-card__teaser">{teaser}</p>
      <div className="dateline">
        {locked && (
          <svg className="lock-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="1" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        )}
        {meta}
      </div>
    </Link>
  )
}
