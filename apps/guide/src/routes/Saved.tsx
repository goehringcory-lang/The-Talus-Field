// =============================================================================
// /saved — everything the reader bookmarked, in one place: stops and Secret
// Guide entries, hikes, and places to eat, plus the entries opened last. Until
// September 2026 saves were stops only and surfaced as a list of titles at the
// foot of Home. Everything here is read from this device (tfg.favorites and
// tfg.recent.viewed) and works offline.
// =============================================================================

import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import AddToTripButton from '../components/AddToTripButton'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import { DINING, REGION_SHORT, getHikeById, getStopById, isSecretGuideEntry } from '../content'
import { formatTime } from '../content/labels'
import { useFavorites } from '../lib/favorites'
import { clearRecent, useRecentlyViewed } from '../lib/recentlyViewed'
import { useDocumentTitle } from '../lib/documentTitle'

function Row({ to, title, meta, action }: { to: string; title: string; meta: string; action?: React.ReactNode }) {
  return (
    <li className="saved-row">
      <div className="saved-row__main">
        <Link to={to} className="saved-row__title">
          {title} →
        </Link>
        <span className="dateline">{meta}</span>
      </div>
      {action}
    </li>
  )
}

export default function Saved() {
  useDocumentTitle('Saved')
  const { ids } = useFavorites()
  const recent = useRecentlyViewed()

  const savedStops = ids
    .filter((id) => !id.includes(':'))
    .map((id) => getStopById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const savedHikes = ids
    .filter((id) => id.startsWith('hike:'))
    .map((id) => getHikeById(id.slice(5)))
    .filter((h): h is NonNullable<typeof h> => Boolean(h))
  const savedDining = ids
    .filter((id) => id.startsWith('dining:'))
    .map((id) => DINING.find((v) => v.id === id.slice(7)))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  const recentRows = recent
    .map((r) => {
      if (r.type === 'hike') {
        const h = getHikeById(r.id)
        return h ? { key: `h-${h.id}`, to: `/hike/${h.id}`, title: h.title, meta: `Hike · ${REGION_SHORT[h.region]}` } : null
      }
      const s = getStopById(r.id)
      if (!s) return null
      return {
        key: `s-${s.id}`,
        to: `/stop/${s.id}`,
        title: s.title,
        meta: isSecretGuideEntry(s) ? 'Secret Guide' : 'region' in s ? REGION_SHORT[s.region] : 'Stop',
      }
    })
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  const nothing = savedStops.length + savedHikes.length + savedDining.length === 0

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="saved" />
        <PageHeader
          eyebrow="Your bookmarks"
          title="Saved"
          intro="Stops, hikes, and places to eat you marked with the bookmark, and the entries you opened last. Kept on this device; with sync on, the bookmarks travel to your other devices too."
        />

        {nothing && (
          <EmptyState note="Nothing saved yet. Tap the bookmark on any stop, Secret Guide entry, hike, or restaurant and it lands here." />
        )}

        {savedStops.length > 0 && (
          <section className="page-section" aria-label="Saved stops">
            <span className="eyebrow">Stops and Secret Guide · {savedStops.length}</span>
            <ul className="saved-list">
              {savedStops.map((s) => (
                <Row
                  key={s.id}
                  to={`/stop/${s.id}`}
                  title={s.title}
                  meta={[
                    isSecretGuideEntry(s) ? 'Secret Guide' : 'region' in s ? REGION_SHORT[s.region] : '',
                    s.timeBudgetMin ? formatTime(s.timeBudgetMin) : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  action={<AddToTripButton stopId={s.id} title={s.title} />}
                />
              ))}
            </ul>
          </section>
        )}

        {savedHikes.length > 0 && (
          <section className="page-section" aria-label="Saved hikes">
            <span className="eyebrow">Hikes · {savedHikes.length}</span>
            <ul className="saved-list">
              {savedHikes.map((h) => (
                <Row
                  key={h.id}
                  to={`/hike/${h.id}`}
                  title={h.title}
                  meta={`${REGION_SHORT[h.region]} · ${h.distanceMi} mi · ~${formatTime(h.durationMin)}`}
                />
              ))}
            </ul>
          </section>
        )}

        {savedDining.length > 0 && (
          <section className="page-section" aria-label="Saved places to eat">
            <span className="eyebrow">Places to eat · {savedDining.length}</span>
            <ul className="saved-list">
              {savedDining.map((v) => (
                <Row key={v.id} to={`/dining#${v.id}`} title={v.name} meta={`${v.place} · ${v.price}`} />
              ))}
            </ul>
          </section>
        )}

        {recentRows.length > 0 && (
          <section className="page-section" aria-label="Recently viewed">
            <span className="eyebrow">Recently viewed</span>
            <ul className="saved-list">
              {recentRows.map((r) => (
                <Row key={r.key} to={r.to} title={r.title} meta={r.meta} />
              ))}
            </ul>
            <Button variant="quiet" size="sm" onClick={clearRecent}>
              Clear this list
            </Button>
          </section>
        )}
      </main>
    </GatedChrome>
  )
}
