// =============================================================================
// Public landing page for a gated stop link. A signed-out visit to /stop/:id
// used to bounce to the bare login form, which read as a broken link to
// anyone a buyer shared one with. Now the link lands: the stop's name, photo,
// meta, and teaser line, with the free sample and the buy page as next steps.
// The body, the coordinates, and the swap stay in the paid app, except for
// the five sample stops, which render in full here exactly as they do on
// /preview.
// =============================================================================

import { useLocation, useParams } from 'react-router-dom'
import {
  getRegionMeta,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  isSecretGuideEntry,
  REGIONS,
} from '../content'
import {
  DIFFICULTY_LABEL,
  KIND_LABEL,
  formatElevation,
  formatTime,
} from '../content/labels'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import PreviewChrome from '../components/PreviewChrome'
import Plate from '../components/Plate'
import ResponsivePhoto from '../components/ResponsivePhoto'
import StopCard from '../components/StopCard'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { Chip } from '../components/ui/Chip'
import { isPreviewStopId } from '../lib/storefront'

export default function StopTeaser() {
  const params = useParams<{ stopId: string }>()
  const location = useLocation()
  const stop = params.stopId ? getStopById(params.stopId) : undefined
  const from = location.pathname + location.search + location.hash

  const coreCount = REGIONS.reduce((n, r) => n + getStopsByRegion(r.id).length, 0)
  const secretCount = getSecretGuideEntries().length

  if (!stop) {
    return (
      <PreviewChrome>
        <main className="wrap wrap--narrow page">
          <PageHeader
            eyebrow="The Field Guide"
            title="That link points at the Field Guide."
            intro="The page it names isn't in this edition, or the address is mistyped. The free sample shows what the guide is."
          />
          <div className="action-row">
            <Button to="/preview">Read the free sample →</Button>
            <Button variant="quiet" to="/login">
              Bought the guide? Sign in
            </Button>
          </div>
        </main>
      </PreviewChrome>
    )
  }

  // The sample stops read in full even from a shared link; the strongest
  // pitch is the actual writing.
  if (isPreviewStopId(stop.id)) {
    return (
      <PreviewChrome>
        <main className="wrap wrap--narrow page">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>
            The Field Guide · A free sample entry, reproduced in full
          </span>
          <StopCard stop={stop} compact={false} actions={false} />
          <p className="locked-note">
            One of {coreCount + secretCount} entries in the Field Guide
          </p>
          <div className="action-row" style={{ marginTop: 20 }}>
            <Button to="/preview">Read the rest of the free sample →</Button>
            <Button variant="quiet" to="/login" state={{ from }}>
              Bought it already? Sign in
            </Button>
          </div>
        </main>
      </PreviewChrome>
    )
  }

  const secret = isSecretGuideEntry(stop)
  const regionTitle =
    'region' in stop ? getRegionMeta(stop.region)?.title : undefined
  const eyebrow = secret
    ? `The Secret Guide · ${KIND_LABEL[stop.kind]}`
    : `${regionTitle ?? 'The Field Guide'} · ${KIND_LABEL[stop.kind]}`
  const intro =
    stop.teaser ??
    (secret
      ? `One of the ${secretCount} entries in the Secret Guide: the unsigned turnouts, quiet trails, and after-dark spots that never make it into articles.`
      : `One of the ${coreCount} stops in the Field Guide's regional reading order.`)
  const photo = stop.photos[0]
  const credit = photo ? PHOTO_CREDITS[photo.src] : undefined

  return (
    <PreviewChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader eyebrow={eyebrow} title={stop.title} intro={intro} />

        {photo && (
          <Plate
            tag={`Plate · ${KIND_LABEL[stop.kind]}`}
            credit={credit ? formatCredit(credit) : undefined}
          >
            <ResponsivePhoto
              src={photo.src}
              alt={photo.caption ?? stop.title}
              loading="eager"
              width={1200}
              height={900}
              sizes="(max-width: 820px) 100vw, 780px"
              style={{ aspectRatio: '2 / 1', objectFit: 'cover' }}
            />
          </Plate>
        )}

        {(stop.elevationFt !== undefined ||
          stop.timeBudgetMin !== undefined ||
          stop.difficulty ||
          stop.season) && (
          <div className="meta-row">
            {stop.elevationFt !== undefined && (
              <Chip variant="meta">{formatElevation(stop.elevationFt)}</Chip>
            )}
            {stop.timeBudgetMin !== undefined && (
              <Chip variant="meta">{formatTime(stop.timeBudgetMin)}</Chip>
            )}
            {stop.difficulty && <Chip variant="meta">{DIFFICULTY_LABEL[stop.difficulty]}</Chip>}
            {stop.season && <Chip variant="meta">{stop.season}</Chip>}
          </div>
        )}

        <section className="page-section">
          <span className="eyebrow">In the full entry</span>
          <p className="page-header__intro" style={{ marginTop: 8 }}>
            The whole read: where to park and when to go, the honest time budget, a
            tappable GPS pin that opens your Maps app, and the swap for when the lot is
            full. The guide holds {coreCount} stops across four regions plus the{' '}
            {secretCount}-entry Secret Guide, and all of it works offline.
          </p>
          <div className="action-row" style={{ marginTop: 20 }}>
            <Button to="/preview">Read the free sample →</Button>
            <Button variant="quiet" to="/login" state={{ from }}>
              Bought it already? Sign in
            </Button>
          </div>
        </section>
      </main>
    </PreviewChrome>
  )
}
