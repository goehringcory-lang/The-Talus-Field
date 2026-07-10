import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SECRET_META, SECRET_SECTIONS, SECRET_SPOTS } from '../content'
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

  // Untagged spots keep the classic flat list; tagged spots group under
  // their section header, mirroring the /essentials layout.
  const classics = SECRET_SPOTS.filter((spot) => !spot.section)
  const sections = SECRET_SECTIONS.map((s) => ({
    ...s,
    spots: SECRET_SPOTS.filter((spot) => spot.section === s.id),
  })).filter((s) => s.spots.length > 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Included with purchase"
          title={SECRET_META.title}
          intro={SECRET_META.teaser}
        />

        {classics.map((spot, i) => (
          <div key={spot.id} id={spot.id} style={{ scrollMarginTop: 16 }}>
            <StopCard stop={spot} compact={false} />
            {i < classics.length - 1 && <hr className="stop-divider" />}
          </div>
        ))}

        {sections.map((section) => (
          <section key={section.id} aria-label={section.title} style={{ marginTop: 48 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>{section.title}</span>
            {section.spots.map((spot, i) => (
              <div key={spot.id} id={spot.id} style={{ scrollMarginTop: 16 }}>
                <StopCard stop={spot} compact={false} />
                {i < section.spots.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </section>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
