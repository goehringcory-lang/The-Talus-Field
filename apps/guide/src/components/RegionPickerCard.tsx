import { Link } from 'react-router-dom'
import type { Region } from '../content'

type Props = {
  region: Region
  title: string
  teaser: string
  stopCount: number
}

export default function RegionPickerCard({ region, title, teaser, stopCount }: Props) {
  return (
    <Link to={`/region/${region}`} className="trip-picker-card">
      <div className="eyebrow eyebrow--moss">The Field Guide</div>
      <h2 className="trip-picker-card__title">{title}</h2>
      <p className="trip-picker-card__teaser">{teaser}</p>
      <div className="dateline">
        {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
      </div>
    </Link>
  )
}
