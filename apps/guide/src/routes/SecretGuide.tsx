import { useEffect, useMemo } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  REGION_SHORT,
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_CATEGORY_TITLE,
  SECRET_GUIDE_META,
  SECRET_NUMERALS,
  SecretCategory,
  getSecretGuideEntries,
  type SecretCategoryT,
} from '../content'
import CardDeck, { type DeckPanel } from '../components/CardDeck'
import GatedChrome from '../components/GatedChrome'
import SecretFolio from '../components/SecretFolio'
import StopCard from '../components/StopCard'
import StopDeckCard from '../components/StopDeckCard'
import ViewToggle from '../components/ViewToggle'
import BackLink from '../components/ui/BackLink'
import { ChipButton } from '../components/ui/Chip'
import { SECRET_PACK_ID } from '../offline/manifest'
import { isPackCompleted } from '../offline/useDownloads'
import { useViewMode } from '../lib/viewMode'
import { detectPhotoFormat, precachePhotoUrls } from '../utils/photo'
import { precacheUrls } from '../pwa/precache'

// The Secret Guide: every premium entry (region-less secret spots plus the
// hidden-collection stops) in one place, opened by the folio (the granite
// plate with the numbered contents) and filtered by the sticky category
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

  // Every entry's number in the whole set, so "No. 14" means the same card
  // whether the reader is looking at the full list or one category.
  const folioOf = useMemo(() => new Map(all.map((s, i) => [s.id, i + 1])), [all])

  const sections = SECRET_GUIDE_CATEGORIES.map((c, i) => ({
    ...c,
    numeral: SECRET_NUMERALS[i] ?? String(i + 1),
    entries: all.filter((s) => s.category === c.id),
  }))
    .filter((c) => !cat || c.id === cat)
    .filter((c) => c.entries.length > 0)

  const shownCount = sections.reduce((total, s) => total + s.entries.length, 0)
  const offlineReady = isPackCompleted(SECRET_PACK_ID)

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

  // The closing panel: how the section connects to the rest of the app. Each
  // cell is a fact about the app, read live where one can be (the pack).
  const notes = (
    <section className="panel" aria-label="Using the Secret Guide">
      <div className="panel__head">
        <span className="panel__title">Using this section</span>
        <span className="panel__stamp">{all.length} entries</span>
      </div>
      <div className="panel__grid">
        <div className="readout">
          <span className="readout__label">On the map</span>
          <Link to="/map" className="readout__value">
            Gold pins
          </Link>
          <span className="readout__note">Every entry with a coordinate, its own toggle</span>
        </div>
        <div className="readout">
          <span className="readout__label">Offline</span>
          <Link
            to="/account"
            className={offlineReady ? 'readout__value readout__value--signal' : 'readout__value'}
          >
            {offlineReady ? 'Photos ready' : 'Download pack'}
          </Link>
          <span className="readout__note">
            {offlineReady ? 'The Secret Guide photo pack is on this device' : 'Text is bundled; the photo pack is on the Account page'}
          </span>
        </div>
        <div className="readout readout--wide">
          <span className="readout__label">In the plan</span>
          <Link to="/trip" className="readout__value">
            Trip board
          </Link>
          <span className="readout__note">
            Add any entry to a day of the trip and the board slots it in drive order
          </span>
        </div>
      </div>
    </section>
  )

  // Card mode: the folio as the opening panel, then the filtered entries as
  // one deck in the same category order the sections use. Switching a tab
  // rebuilds the deck, which remounts it at the top — the same place a
  // filtered list starts.
  if (mode === 'cards') {
    const entries = sections.flatMap((section) => section.entries)
    const panels: DeckPanel[] = [
      {
        key: 'secret-guide-folio',
        label: SECRET_GUIDE_META.title,
        node: (
          <div className="deck-panel-prose">
            <div className="deck-panel-prose__inner">
              <SecretFolio
                total={all.length}
                counts={counts}
                active={cat}
                onSelect={select}
                compact
                titleAs="h2"
              />
              <p className="dateline">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                {cat ? ` in ${SECRET_GUIDE_CATEGORY_TITLE[cat]}` : ''}. Swipe up to start.
              </p>
            </div>
          </div>
        ),
      },
      ...entries.map((s, i) => ({
        key: s.id,
        label: s.title,
        node: (
          <StopDeckCard
            stop={s}
            regionLabel={'region' in s ? REGION_SHORT[s.region] : undefined}
            tag={
              s.category
                ? `No. ${String(folioOf.get(s.id) ?? 0).padStart(2, '0')} · ${SECRET_GUIDE_CATEGORY_TITLE[s.category]}`
                : undefined
            }
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
              <span className="eyebrow">That&apos;s the set</span>
              <p className="deck-card__teaser">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                {cat ? ` in ${SECRET_GUIDE_CATEGORY_TITLE[cat]}` : ''}. The rest of the guide is
                organized by region.
              </p>
              {/* The notes panel stays out of this panel on purpose: a deck
                  panel must fit one screen, and the list has it. */}
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
              reader mid-deck (or past the end) of the new, shorter set. A
              deep-linked entry opens on that card, past the folio. */}
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

        <SecretFolio total={all.length} counts={counts} active={cat} onSelect={select} />

        {tabs}

        {sections.map((section) => (
          <section key={section.id} aria-label={section.title} className="page-section">
            <div className="sg-section__head">
              <span className="sg-section__num" aria-hidden="true">
                {section.numeral}
              </span>
              <h2 className="sg-section__title">{section.title}</h2>
              <span className="sg-section__count">
                {section.entries.length} {section.entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <p className="secret-guide-tagline">{section.tagline}</p>
            {section.entries.map((s, i) => (
              <div key={s.id} id={s.id} style={{ scrollMarginTop: 120 }}>
                <div className="sg-entry__folio" aria-hidden="true">
                  <span>
                    No. <b>{String(folioOf.get(s.id) ?? 0).padStart(2, '0')}</b> of {all.length}
                  </span>
                  <span>
                    {section.numeral} · {section.title}
                  </span>
                </div>
                <StopCard
                  stop={s}
                  regionLabel={'region' in s ? REGION_SHORT[s.region] : undefined}
                />
                {i < section.entries.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </section>
        ))}

        <div className="page-section">{notes}</div>

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
