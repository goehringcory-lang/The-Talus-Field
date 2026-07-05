import { SECRET_META, SECRET_SPOTS } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'

export default function SecretSpots() {
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Included with purchase"
          title={SECRET_META.title}
          intro={SECRET_META.teaser}
        />

        {SECRET_SPOTS.map((spot, i) => (
          <div key={spot.id}>
            <StopCard stop={spot} compact={false} />
            {i < SECRET_SPOTS.length - 1 && <hr className="stop-divider" />}
          </div>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
