import { useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_META,
  SecretCategory,
  getSecretGuideEntries,
  type Region,
  type SecretCategoryT,
} from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import { allPhotoUrls } from '../utils/photo'

// Chip-length region names; the full REGIONS titles are card headlines.
const REGION_SHORT: Record<Region, string> = {
  valley: 'Valley',
  'glacier-mariposa': 'Glacier Point & Mariposa',
  tuolumne: 'Tuolumne',
  'hetch-hetchy': 'Hetch Hetchy',
}

// The Secret Guide: every premium entry (region-less secret spots plus the
// hidden-collection stops) in one place, filtered by the sticky category
// tabs. Cards are compact; the full read is /stop/:id.
export default function SecretGuide() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawCat = searchParams.get('cat')
  const cat: SecretCategoryT | null = SecretCategory.safeParse(rawCat).success
    ? (rawCat as SecretCategoryT)
    : null

  // Legacy /secret-spots#<id> deep links arrive with the hash preserved by
  // the redirect; the router doesn't scroll to hashes on its own.
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [location.hash])

  const all = useMemo(() => getSecretGuideEntries(), [])

  // Pre-warm the SW cache with entry photos so paid content works offline.
  // Ported from the retired /hidden-areas page; this page owns the set now.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const sw = navigator.serviceWorker.controller
    if (!sw) return
    const urls = all.flatMap((s) => s.photos.flatMap((p) => allPhotoUrls(p.src))).filter(Boolean)
    if (urls.length === 0) return
    sw.postMessage({ type: 'PRECACHE_URLS', urls })
  }, [all])

  const counts = useMemo(() => {
    const out = {} as Record<SecretCategoryT, number>
    for (const c of SECRET_GUIDE_CATEGORIES) out[c.id] = 0
    for (const s of all) if (s.category) out[s.category]++
    return out
  }, [all])

  const sections = SECRET_GUIDE_CATEGORIES.filter((c) => !cat || c.id === cat)
    .map((c) => ({ ...c, entries: all.filter((s) => s.category === c.id) }))
    .filter((c) => c.entries.length > 0)

  function select(next: SecretCategoryT | null) {
    // Default setSearchParams pushes history, so Back returns to the prior
    // filter and filtered URLs are shareable. All = bare /secret-guide.
    setSearchParams(next ? { cat: next } : {})
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Included with purchase"
          title={SECRET_GUIDE_META.title}
          intro={`${all.length} entries. ${SECRET_GUIDE_META.teaser}`}
        />

        <nav className="secret-guide-tabs" aria-label="Filter by category">
          <div className="secret-guide-tabs__row">
            <ChipButton
              variant="filter"
              pressed={cat === null}
              aria-label={`All, ${all.length} entries`}
              onClick={() => select(null)}
            >
              All <span className="secret-guide-tabs__count">{all.length}</span>
            </ChipButton>
            {SECRET_GUIDE_CATEGORIES.map((c) => (
              <ChipButton
                key={c.id}
                variant="filter"
                pressed={cat === c.id}
                aria-label={`${c.title}, ${counts[c.id]} entries`}
                onClick={() => select(c.id)}
              >
                {c.title} <span className="secret-guide-tabs__count">{counts[c.id]}</span>
              </ChipButton>
            ))}
          </div>
        </nav>

        {sections.map((section) => (
          <section key={section.id} aria-label={section.title} className="page-section">
            <span className="eyebrow" style={{ display: 'block' }}>
              {section.title} · {section.entries.length}
            </span>
            <p className="secret-guide-tagline">{section.tagline}</p>
            {section.entries.map((s, i) => (
              <div key={s.id} id={s.id} style={{ scrollMarginTop: 120 }}>
                <StopCard
                  stop={s}
                  regionLabel={'region' in s ? REGION_SHORT[s.region] : undefined}
                />
                {i < section.entries.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </section>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
