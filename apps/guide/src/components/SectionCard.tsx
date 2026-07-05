import { Link } from 'react-router-dom'

type Props = {
  to: string
  title: string
  teaser: string
  meta: string
  eyebrow?: string
}

export default function SectionCard({ to, title, teaser, meta, eyebrow = 'The Field Guide' }: Props) {
  return (
    <Link to={to} className="region-picker-card">
      <div className="eyebrow eyebrow--moss">{eyebrow}</div>
      <h2 className="region-picker-card__title">{title}</h2>
      <p className="region-picker-card__teaser">{teaser}</p>
      <div className="dateline">{meta}</div>
    </Link>
  )
}
