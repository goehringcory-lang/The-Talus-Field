import type { ReactNode } from 'react'
import type { Region } from '../content'
import ResponsivePhoto from './ResponsivePhoto'
import SectionCard from './SectionCard'

type Props = {
  region: Region
  title: string
  teaser: string
  stopCount: number
  photo?: { src: string }
  // Rendered node (the five-day forecast), so this card stays weather-ignorant.
  forecast?: ReactNode
}

export default function RegionPickerCard({ region, title, teaser, stopCount, photo, forecast }: Props) {
  return (
    <SectionCard
      to={`/region/${region}`}
      title={title}
      teaser={teaser}
      meta={`${stopCount} ${stopCount === 1 ? 'stop' : 'stops'}`}
      footer={forecast}
      media={
        photo ? (
          <ResponsivePhoto
            src={photo.src}
            alt=""
            loading="lazy"
            width={1200}
            height={480}
            sizes="(max-width: 720px) 100vw, 640px"
            style={{ aspectRatio: '5 / 2', objectFit: 'cover', width: '100%', display: 'block' }}
          />
        ) : undefined
      }
    />
  )
}
