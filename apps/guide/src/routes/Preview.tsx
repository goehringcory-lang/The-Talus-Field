// =============================================================================
// /preview — the free sample, the only content route with no auth wall.
//
// Five real entries reproduced in full (one stop per region, one Secret Guide
// spot), rendered by the same StopCard the paid app uses: the sample IS the
// product, not screenshots of it. Everything else stays locked, and the
// locked rows say exactly how much more each section holds. Buy actions link
// out to the editorial /guide page, where the checkout lives; signed-in
// buyers are bounced straight into the app.
// =============================================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import {
  REGIONS,
  REGION_SHORT,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
} from '../content'
import PreviewChrome from '../components/PreviewChrome'
import StopCard from '../components/StopCard'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import {
  GUIDE_BUY_URL,
  PREVIEW_SECRET_SPOT_ID,
  PREVIEW_STOP_IDS,
  useGuidePrice,
} from '../lib/storefront'

export default function Preview() {
  const { session } = useAuth()
  const price = useGuidePrice()

  const regionSamples = REGIONS.map((region) => {
    const stop = getStopById(PREVIEW_STOP_IDS[region.id] ?? '')
    return stop
      ? { region, stop, count: getStopsByRegion(region.id).length }
      : null
  }).filter((s): s is NonNullable<typeof s> => s !== null)
  const secretSample = getStopById(PREVIEW_SECRET_SPOT_ID)
  const secretCount = getSecretGuideEntries().length
  const coreCount = REGIONS.reduce((n, r) => n + getStopsByRegion(r.id).length, 0)
  const sampleCount = regionSamples.length + (secretSample ? 1 : 0)

  // A buyer following the editorial sample link should land in the app they
  // paid for, not on the pitch.
  if (session) return <Navigate to="/" replace />

  return (
    <PreviewChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Free sample · The Field Guide · 2026 Edition"
          title={`Read ${sampleCount} stops from the guide.`}
          intro={`These are real entries, reproduced in full: one stop from each of the four regions and one from the Secret Guide, exactly as they read in the app. The other ${coreCount + secretCount - sampleCount} entries, the offline park map, the program listings, and the trip planner are in the full guide.`}
        />

        {regionSamples.map(({ region, stop, count }) => (
          <section key={region.id} className="page-section" aria-label={region.title}>
            <span className="eyebrow">
              {region.title} · 1 of {count} stops
            </span>
            <StopCard stop={stop} compact={false} actions={false} />
            <p className="locked-note">
              Plus {count - 1} more {REGION_SHORT[region.id]} stops in the full guide
            </p>
          </section>
        ))}

        {secretSample && (
          <section className="page-section" aria-label="The Secret Guide">
            <span className="eyebrow">The Secret Guide · 1 of {secretCount} entries</span>
            <StopCard stop={secretSample} compact={false} actions={false} />
            <p className="locked-note">
              Plus {secretCount - 1} more Secret Guide entries: vistas, trails, parking,
              camping, after dark
            </p>
          </section>
        )}

        <section className="page-section" aria-label="What the sample can't show">
          <span className="eyebrow">What a sample can't show</span>
          <ul className="link-list" style={{ marginTop: 4 }}>
            <li>One tap downloads the whole guide for offline, about 50 MB, photos and all.</li>
            <li>An offline topo map of the park with every stop pinned, the Secret Guide in gold.</li>
            <li>Ranger walks, tours, and star parties filtered to your trip dates.</li>
            <li>A trip planner that lays out each day and syncs it to your calendar.</li>
            <li>A tappable GPS pin on every stop, like the ones above, all {coreCount + secretCount} of them.</li>
          </ul>
        </section>

        <section className="page-section" aria-label="Get the guide">
          <div className="card">
            <span className="eyebrow eyebrow--moss">The Field Guide · 2026 Edition</span>
            <div className="buy-card__price">{price}.</div>
            <p className="card__note" style={{ margin: '0 0 18px' }}>
              One payment. The app, every photo, and the offline park map are yours for 18
              months on every device you own. Updates push automatically through the 2026
              season, the Secret Guide included.
            </p>
            <div className="action-row">
              <Button href={GUIDE_BUY_URL} external>
                Get the guide →
              </Button>
              <Button variant="quiet" to="/login">
                Already bought it? Sign in
              </Button>
            </div>
          </div>
        </section>

        <p className="page-footnote">
          The guide is a web app you add to your home screen. No App Store, works offline,
          pay once and sign in on every device you own.
        </p>
      </main>
    </PreviewChrome>
  )
}
