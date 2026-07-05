import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HIDDEN_META, REGIONS, getHiddenStops } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
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
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          Included with purchase
        </div>
        <h1 style={{ marginBottom: 18 }}>{HIDDEN_META.title}</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{HIDDEN_META.teaser}</p>

        {groups.map((group, gi) => (
          <section key={group.region.id} aria-label={group.region.title}>
            <div
              className="eyebrow"
              style={{ marginTop: gi === 0 ? 0 : 56, marginBottom: 18 }}
            >
              {group.region.title}
            </div>
            {group.stops.map((stop, i) => (
              <div key={stop.id}>
                <StopCard stop={stop} />
                {i < group.stops.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </section>
        ))}

        <p style={{ marginTop: 56 }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Back to the guide
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
