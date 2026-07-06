import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  to: string
  title: string
  teaser: string
  meta: string
  eyebrow?: string
  // Optional full-bleed media block above the text (region hero photo).
  media?: ReactNode
}

export default function SectionCard({ to, title, teaser, meta, eyebrow = 'The Field Guide', media }: Props) {
  return (
    <Link to={to} className="region-picker-card">
      {media && <div className="region-picker-card__media">{media}</div>}
      <div className="eyebrow eyebrow--moss">{eyebrow}</div>
      <h2 className="region-picker-card__title">{title}</h2>
      <p className="region-picker-card__teaser">{teaser}</p>
      <div className="dateline">{meta}</div>
    </Link>
  )
}
