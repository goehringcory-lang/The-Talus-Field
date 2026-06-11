import type { Region } from '../content'
import SectionCard from './SectionCard'

type Props = {
  region: Region
  title: string
  teaser: string
  stopCount: number
}

export default function RegionPickerCard({ region, title, teaser, stopCount }: Props) {
  return (
    <SectionCard
      to={`/region/${region}`}
      title={title}
      teaser={teaser}
      meta={`${stopCount} ${stopCount === 1 ? 'stop' : 'stops'}`}
    />
  )
}
