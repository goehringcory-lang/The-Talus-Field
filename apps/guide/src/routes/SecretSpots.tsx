import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SECRET_META, SECRET_SPOTS } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'

export default function SecretSpots() {
  const location = useLocation()

  // Search results deep-link as /secret-spots#<id>; the router doesn't
  // scroll to hashes on its own.
  useEffect(() => {
    if (!location.hash) return
    document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [location.hash])

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Included with purchase"
          title={SECRET_META.title}
          intro={SECRET_META.teaser}
        />

        {SECRET_SPOTS.map((spot, i) => (
          <div key={spot.id} id={spot.id} style={{ scrollMarginTop: 16 }}>
            <StopCard stop={spot} compact={false} />
            {i < SECRET_SPOTS.length - 1 && <hr className="stop-divider" />}
          </div>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
