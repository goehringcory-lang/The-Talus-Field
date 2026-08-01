import { useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  REGION_SHORT,
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_CATEGORY_TITLE,
  SECRET_GUIDE_META,
  SecretCategory,
  getSecretGuideEntries,
  type SecretCategoryT,
} from '../content'
import CardDeck, { type DeckPanel } from '../components/CardDeck'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'
import StopDeckCard from '../components/StopDeckCard'
import ViewToggle from '../components/ViewToggle'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import { useViewMode } from '../lib/viewMode'
import { detectPhotoFormat, precachePhotoUrls } from '../utils/photo'
import { precacheUrls } from '../pwa/precache'

// The Secret Guide: every premium entry (region-less secret spots plus the
// hidden-collection stops) in one place, filtered by the sticky category
// tabs. Cards are compact; the full read is /stop/:id.
export default function SecretGuide() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawCat = searchParams.get('cat')
  const cat: SecretCategoryT | null = SecretCategory.safeParse(rawCat).success
    ? (rawCat as SecretCategoryT)
    : null

  const { mode } = useViewMode()

  // Legacy /secret-spots#<id> deep links arrive with the hash preserved by
  // the redirect; the router doesn't scroll to hashes on its own. In card
  // mode the deck opens on that entry instead (startKey below).
  const location = useLocation()
  const hashId = location.hash ? location.hash.slice(1) : null
  useEffect(() => {
    if (!hashId || mode === 'cards') return
    document.getElementById(hashId)?.scrollIntoView()
  }, [hashId, mode])

  const all = useMemo(() => getSecretGuideEntries(), [])

  // Pre-warm the SW cache with entry photos so paid content works offline.
  // Ported from the retired /hidden-areas page; this page owns the set now.
  // Only the format this device renders; the download packs fetch everything.
  useEffect(() => {
    const srcs = all.flatMap((s) => s.photos.map((p) => p.src)).filter(Boolean)
    if (srcs.length === 0) return
    void detectPhotoFormat().then((format) =>
      precacheUrls(srcs.flatMap((src) => precachePhotoUrls(src, format))),
    )
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

  const shownCount = sections.reduce((total, s) => total + s.entries.length, 0)

  function select(next: SecretCategoryT | null) {
    // Default setSearchParams pushes history, so Back returns to the prior
    // filter and filtered URLs are shareable. All = bare /secret-guide.
    setSearchParams(next ? { cat: next } : {})
  }

  const tabs = (
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
      {/* The entry list rewrites itself on every tab tap with nothing said
          about it; this is that, spoken. */}
      <p className="sr-only" aria-live="polite">
        {shownCount} {shownCount === 1 ? 'entry' : 'entries'} shown
      </p>
    </nav>
  )

  // Card mode: the filtered entries as one deck, in the same category order
  // the sections use. Switching a tab rebuilds the deck, which remounts it at
  // the top — the same place a filtered list starts.
  if (mode === 'cards') {
    const entries = sections.flatMap((section) => section.entries)
    const panels: DeckPanel[] = [
      ...entries.map((s, i) => ({
        key: s.id,
        label: s.title,
        node: (
          <StopDeckCard
            stop={s}
            regionLabel={'region' in s ? REGION_SHORT[s.region] : undefined}
            tag={s.category ? SECRET_GUIDE_CATEGORY_TITLE[s.category] : undefined}
            eager={i === 0}
          />
        ),
      })),
      {
        key: 'secret-guide-end',
        label: 'End of the Secret Guide',
        node: (
          <div className="deck-panel-prose">
            <div className="deck-panel-prose__inner">
              <span className="eyebrow">That's the set</span>
              <p className="deck-card__teaser">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                {cat ? ` in ${SECRET_GUIDE_CATEGORY_TITLE[cat]}` : ''}. The rest of the guide is
                organized by region.
              </p>
              <BackLink to="/" label="Back to the guide" />
            </div>
          </div>
        ),
      },
    ]

    return (
      <GatedChrome>
        <main className="deck-main">
          <div className="deck-bar">
            <h1 className="deck-bar__title">{SECRET_GUIDE_META.title}</h1>
            <div className="deck-bar__side">
              <span className="deck-bar__count">{entries.length} entries</span>
              <ViewToggle label="How to read the Secret Guide" />
            </div>
          </div>
          <div className="deck-tabs">{tabs}</div>
          {/* Keyed by the active filter: switching a tab rebuilds the panel
              set, and a reused deck would keep the old scrollTop and land the
              reader mid-deck (or past the end) of the new, shorter set. */}
          <CardDeck
            key={cat ?? 'all'}
            panels={panels}
            ariaLabel="Secret Guide entries"
            startKey={hashId}
            hint="Swipe up for the next entry"
          />
        </main>
      </GatedChrome>
    )
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <div className="page-toolbar">
          <ViewToggle label="How to read the Secret Guide" />
        </div>

        <PageHeader
          eyebrow="Included with purchase"
          title={SECRET_GUIDE_META.title}
          intro={`${all.length} entries. ${SECRET_GUIDE_META.teaser}`}
        />

        {tabs}

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
