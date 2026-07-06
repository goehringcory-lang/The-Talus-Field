import { useEffect, useMemo } from 'react'
import { REGIONS, HIDDEN_META, getHiddenStops } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'
import { allPhotoUrls } from '../utils/photo'

// The hidden-areas index: every `collection: 'hidden'` stop, grouped under
// the region it lives in. Cards are compact; the full read is /stop/:id.
export default function HiddenAreas() {
  const hidden = useMemo(() => getHiddenStops(), [])

  // Pre-warm the SW cache with hidden-area photos so paid content works
  // offline. Region.tsx does the same for its own stops; this page owns the
  // hidden set.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const sw = navigator.serviceWorker.controller
    if (!sw) return
    const urls = hidden.flatMap((s) => s.photos.flatMap((p) => allPhotoUrls(p.src))).filter(Boolean)
    if (urls.length === 0) return
    sw.postMessage({ type: 'PRECACHE_URLS', urls })
  }, [hidden])

  const groups = REGIONS.map((region) => ({
    region,
    stops: hidden.filter((s) => s.region === region.id),
  })).filter((g) => g.stops.length > 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Included with purchase"
          title={HIDDEN_META.title}
          intro={HIDDEN_META.teaser}
        />

        {groups.map((group, gi) => (
          <section
            key={group.region.id}
            aria-label={group.region.title}
            className={gi === 0 ? undefined : 'page-section'}
          >
            <span className="eyebrow" style={{ display: 'block', marginBottom: 18 }}>
              {group.region.title}
            </span>
            {group.stops.map((stop, i) => (
              <div key={stop.id}>
                <StopCard stop={stop} />
                {i < group.stops.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </section>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
