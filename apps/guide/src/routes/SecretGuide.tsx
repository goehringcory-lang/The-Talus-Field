import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  REGION_SHORT,
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_CATEGORY_TITLE,
  SECRET_GUIDE_META,
  SECRET_GUIDE_PICKS,
  SECRET_NUMERALS,
  SECRET_ROUTES,
  SecretCategory,
  getSecretGuideEntries,
  getStopById,
  type GuideStopT,
  type SecretCategoryT,
  type SecretRoute,
} from '../content'
import CardDeck, { type DeckPanel } from '../components/CardDeck'
import GatedChrome from '../components/GatedChrome'
import ResponsivePhoto from '../components/ResponsivePhoto'
import StopDeckCard from '../components/StopDeckCard'
import BackLink from '../components/ui/BackLink'
import { SgFacts, SgFeature, SgIcon, SgRow, type SgFact } from '../components/SecretGuideParts'
import { folioLabel } from '../lib/secretGuide'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import { SECRET_PACK_ID } from '../offline/manifest'
import { isPackCompleted } from '../offline/useDownloads'
import { useDocumentTitle } from '../lib/documentTitle'
import { announceTripAdd } from '../trip/addFeedback'
import { daysInWindow, shortDay } from '../trip/seedItinerary'
import { driveMinutesBetween } from '../trip/slotting'
import { useTripPlan } from '../trip/useTripPlan'
import type { TripItemT } from '../trip/schema'
import { formatTime } from '../content/labels'
import { detectPhotoFormat, precachePhotoUrls } from '../utils/photo'
import { precacheUrls } from '../pwa/precache'

// =============================================================================
// The Secret Guide (September 2026 redesign). The page opens the way the
// editorial site's /firefall and /itineraries open: a photograph under a
// green scrim, a fact strip, the short version, then the contents as tiles,
// the routes as day-sized plans, and the whole set as a clean index (each
// chapter's first entry as a feature, the rest as rows). The full read of an
// entry is /stop/:id.
//
// The swipe deck is still here, one tap away (?view=cards, from the hero or a
// chapter head), rather than the landing: the page has picks, routes and
// chapters to show before any single entry, and a deck panel can show none
// of them.
// =============================================================================

// The chapter-tile photo: the named entry's first photograph, or the
// chapter's first entry with one if that entry is retired.
function chapterPhoto(photoOf: string, entries: GuideStopT[]): string | undefined {
  return (
    entries.find((s) => s.id === photoOf)?.photos[0]?.src ?? entries.find((s) => s.photos[0])?.photos[0]?.src
  )
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

// A synthetic plan item for pricing a route's legs through the planner's own
// leg function, so the route and the trip board can never disagree.
function legItem(stopId: string): TripItemT {
  return { type: 'stop', itemId: `route:${stopId}`, stopId, day: '2000-01-01', eventUid: stopId } as TripItemT
}

// ---------------------------------------------------------------------------

function Hero({
  total,
  chapters,
  onBrowse,
  onRoutes,
}: {
  total: number
  chapters: number
  onBrowse: () => void
  onRoutes: () => void
}) {
  const credit = PHOTO_CREDITS[SECRET_GUIDE_META.heroPhoto]
  return (
    <header className="sg-hero">
      <span className="sg-hero__photo">
        <ResponsivePhoto
          src={SECRET_GUIDE_META.heroPhoto}
          alt=""
          loading="eager"
          width={1600}
          height={1067}
          sizes="100vw"
        />
      </span>
      <div className="wrap sg-hero__inner">
        <div className="sg-hero__copy">
          <nav className="sg-crumbs" aria-label="Breadcrumb">
            <Link to="/">Guide</Link>
            <span aria-hidden="true">›</span>
            <span>The Secret Guide</span>
          </nav>
          <p className="sg-hero__eyebrow">
            <SgIcon name="lock" size={14} />
            {SECRET_GUIDE_META.eyebrow} · {total} entries · {chapters} chapters
          </p>
          <h1 className="sg-hero__title">{SECRET_GUIDE_META.title}</h1>
          <p className="sg-hero__teaser">{SECRET_GUIDE_META.teaser}</p>
          <div className="sg-hero__actions">
            <button type="button" className="sg-btn" onClick={onBrowse}>
              Browse the chapters
              <SgIcon name="down" size={18} />
            </button>
            <button type="button" className="sg-textlink" onClick={onRoutes}>
              Take a route
              <SgIcon name="down" size={15} />
            </button>
            <Link className="sg-textlink" to="/secret-guide?view=cards">
              Flip through as cards
              <SgIcon name="cards" size={15} />
            </Link>
          </div>
          <ul className="sg-hero__promises" aria-label="What every entry carries">
            {SECRET_GUIDE_META.promises.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        {credit && (
          <p className="sg-hero__credit">
            {SECRET_GUIDE_META.heroCaption}. {formatCredit(credit)}
          </p>
        )}
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------

function RoutePanel({ route }: { route: SecretRoute }) {
  const { plan, addStop } = useTripPlan()
  const stops = route.stops
    .map((r) => ({ ...r, stop: getStopById(r.id) }))
    .filter((r): r is typeof r & { stop: GuideStopT } => Boolean(r.stop))
  const days = plan.dates ? daysInWindow(plan.dates.start, plan.dates.end) : []
  const [day, setDay] = useState<string>(days[0] ?? '')
  const [status, setStatus] = useState('')
  const planned =
    stops.length > 0 &&
    stops.every((r) =>
      plan.items.some((it) => it.type === 'stop' && it.stopId === r.stop.id && (!day || it.day === day)),
    )

  function addRoute() {
    for (const r of stops) addStop(r.stop.id, day || undefined)
    announceTripAdd(route.title)
    setStatus(
      `${plural(stops.length, 'stop')} added${day ? ` to ${shortDay(day)}` : ''}. The trip board puts them in drive order.`,
    )
  }

  return (
    <div className="sg-route" id={`route-${route.id}`}>
      <div className="sg-route__intro">
        <span className="sg-eyebrow">{route.label}</span>
        <h3 className="sg-route__title">{route.title}</h3>
        <p className="sg-route__dek">{route.dek}</p>
        <p className="sg-note">
          <SgIcon name="sun" />
          <span>{route.season}</span>
        </p>
        {days.length > 1 && (
          <label className="sg-route__day">
            Which day of your trip
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {days.map((d, i) => (
                <option key={d} value={d}>
                  Day {i + 1} · {shortDay(d)}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="sg-route__actions">
          {planned ? (
            <Link className="sg-btn sg-btn--ghost" to="/trip">
              On your trip board
              <SgIcon name="arrow" size={16} />
            </Link>
          ) : (
            <button type="button" className="sg-btn" onClick={addRoute}>
              <SgIcon name="plan" size={18} />
              {days.length > 1 ? 'Add the route to that day' : 'Add the route to my trip'}
            </button>
          )}
          {stops[0] && (
            <Link className="sg-btn sg-btn--ghost" to={`/map?stop=${stops[0].stop.id}`}>
              <SgIcon name="pin" size={18} />
              Start on the map
            </Link>
          )}
        </div>
        <p className="sg-route__status" role="status">
          {status}
        </p>
      </div>
      <ol className="sg-stops">
        {stops.map((r, i) => {
          const prev = stops[i - 1]
          const leg = prev ? driveMinutesBetween(legItem(prev.stop.id), legItem(r.stop.id)) : null
          const photo = r.stop.photos[0]?.src
          return (
            <li key={r.id}>
              {prev && leg !== null && (
                <p className="sg-leg">
                  <SgIcon name={leg === 0 ? 'boot' : 'car'} size={14} />
                  {leg === 0 ? 'Same place, on foot' : `About ${formatTime(leg)} to the next`}
                </p>
              )}
              <div className="sg-stop">
                <span className="sg-stop__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <span className="sg-stop__when">
                    {r.when}
                    {'region' in r.stop && r.stop.collection !== 'hidden'
                      ? ` · ${REGION_SHORT[r.stop.region]}`
                      : ` · ${folioLabel(r.stop.id)}`}
                  </span>
                  <h4 className="sg-stop__name">
                    <Link to={`/stop/${r.stop.id}`}>{r.stop.title}</Link>
                  </h4>
                  <p className="sg-stop__note">{r.note}</p>
                </div>
                <span className="sg-stop__thumb" aria-hidden="true">
                  {photo && (
                    <ResponsivePhoto src={photo} alt="" loading="lazy" width={160} height={160} sizes="72px" />
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Routes() {
  const [active, setActive] = useState(SECRET_ROUTES[0]?.id ?? '')
  const route = SECRET_ROUTES.find((r) => r.id === active) ?? SECRET_ROUTES[0]
  return (
    <>
      <ul className="sg-routes-pick" aria-label="Choose a route">
        {SECRET_ROUTES.map((r) => (
          <li key={r.id}>
            <button type="button" aria-pressed={r.id === active} onClick={() => setActive(r.id)}>
              <span className="sg-routes-pick__label">{r.label}</span>
              <span className="sg-routes-pick__title">{r.title}</span>
              <span className="sg-routes-pick__meta">{plural(r.stops.length, 'stop')}</span>
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite">{route && <RoutePanel key={route.id} route={route} />}</div>
    </>
  )
}

// ---------------------------------------------------------------------------

export default function SecretGuide() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawCat = searchParams.get('cat')
  const cat: SecretCategoryT | null = SecretCategory.safeParse(rawCat).success
    ? (rawCat as SecretCategoryT)
    : null
  const deck = searchParams.get('view') === 'cards'
  useDocumentTitle(SECRET_GUIDE_META.title)

  const location = useLocation()
  const hashId = location.hash ? location.hash.slice(1) : null
  const all = useMemo(() => getSecretGuideEntries(), [])

  // Pre-warm the SW cache with entry photos so paid content works offline.
  // Only the format this device renders; the download packs fetch everything.
  useEffect(() => {
    const srcs = [SECRET_GUIDE_META.heroPhoto, ...all.flatMap((s) => s.photos.map((p) => p.src))].filter(Boolean)
    void detectPhotoFormat().then((format) =>
      precacheUrls(srcs.flatMap((src) => precachePhotoUrls(src, format))),
    )
  }, [all])

  const chapters = useMemo(
    () =>
      SECRET_GUIDE_CATEGORIES.map((c, i) => {
        const entries = all.filter((s) => s.category === c.id)
        return {
          ...c,
          numeral: SECRET_NUMERALS[i] ?? String(i + 1),
          entries,
          photo: chapterPhoto(c.photo, entries),
        }
      }).filter((c) => c.entries.length > 0),
    [all],
  )
  const shown = chapters.filter((c) => !cat || c.id === cat)
  const shownCount = shown.reduce((n, c) => n + c.entries.length, 0)
  const pinned = all.filter((s) => s.coord).length
  const offlineReady = isPackCompleted(SECRET_PACK_ID)

  const indexRef = useRef<HTMLElement>(null)
  const routesRef = useRef<HTMLElement>(null)
  const chaptersRef = useRef<HTMLElement>(null)
  const scrollTo = (el: HTMLElement | null) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  function select(next: SecretCategoryT | null) {
    // Default setSearchParams pushes history, so Back returns to the prior
    // filter and filtered URLs are shareable. All = bare /secret-guide.
    // preventScrollReset keeps the router from jumping to the top before the
    // index scroll below takes over.
    setSearchParams(next ? { cat: next } : {}, { preventScrollReset: true })
    requestAnimationFrame(() => scrollTo(indexRef.current))
  }

  // A deep link lands where it points: an entry's #id, or a chapter's ?cat=
  // (the Home plate's rows), without the reader scrolling past the cover.
  const landed = useRef(false)
  useEffect(() => {
    if (deck || landed.current) return
    landed.current = true
    if (hashId) document.getElementById(hashId)?.scrollIntoView()
    else if (cat) indexRef.current?.scrollIntoView()
  }, [deck, hashId, cat])

  // Keep the active chapter's tab in view along its row. The row scrolls
  // sideways on a phone, and a chapter picked from a tile or a deep link can
  // otherwise sit off the edge. Only the row moves, never the page.
  useEffect(() => {
    for (const row of document.querySelectorAll<HTMLElement>('.sg-tabs__row, .secret-guide-tabs__row')) {
      const on = row.querySelector<HTMLElement>('.sg-tab[aria-pressed="true"]')
      if (on) row.scrollLeft = on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2
    }
  }, [cat, deck])

  // ---- The deck --------------------------------------------------------------
  if (deck) {
    const entries = shown.flatMap((c) => c.entries)
    const coverPhoto = cat ? shown[0]?.photo : SECRET_GUIDE_META.heroPhoto
    const deckTo = (next: SecretCategoryT | null) =>
      setSearchParams(next ? { view: 'cards', cat: next } : { view: 'cards' })
    const backTo = cat ? `/secret-guide?cat=${cat}` : '/secret-guide'
    const panels: DeckPanel[] = [
      {
        key: 'secret-guide-cover',
        label: SECRET_GUIDE_META.title,
        node: (
          <div className="sg-deck-cover">
            {coverPhoto && (
              <span className="sg-deck-cover__photo">
                <ResponsivePhoto src={coverPhoto} alt="" loading="eager" width={900} height={1200} sizes="100vw" />
              </span>
            )}
            <span className="sg-deck-cover__eyebrow">
              {SECRET_GUIDE_META.eyebrow}
              {cat ? ` · Chapter ${shown[0]?.numeral}` : ''}
            </span>
            <h2 className="sg-deck-cover__title">
              {cat ? SECRET_GUIDE_CATEGORY_TITLE[cat] : SECRET_GUIDE_META.title}
            </h2>
            <p className="sg-deck-cover__line">{cat ? shown[0]?.tagline : SECRET_GUIDE_META.teaser}</p>
            {!cat && (
              <ol className="sg-deck-cover__list" aria-label="Chapters">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <span>{c.numeral}</span>
                    <span>{c.title}</span>
                    <span>{String(c.entries.length).padStart(2, '0')}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="sg-deck-cover__hint">{plural(entries.length, 'entry', 'entries')}. Swipe up to start.</p>
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
            tag={s.category ? `${folioLabel(s.id)} · ${SECRET_GUIDE_CATEGORY_TITLE[s.category]}` : undefined}
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
              <span className="sg-eyebrow">That&apos;s the set</span>
              <p className="deck-card__teaser">
                {plural(entries.length, 'entry', 'entries')}
                {cat ? ` in ${SECRET_GUIDE_CATEGORY_TITLE[cat]}` : ''}. The picks, the routes and the chapters
                are on the Secret Guide&apos;s front page.
              </p>
              <Link className="sg-btn" to={backTo}>
                Back to the Secret Guide
              </Link>
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
              <span className="deck-bar__count">{plural(entries.length, 'entry', 'entries')}</span>
              <Link className="sg-deck-close" to={backTo}>
                Close
              </Link>
            </div>
          </div>
          <div className="deck-tabs">
            <nav className="secret-guide-tabs" aria-label="Filter by chapter">
              <div className="secret-guide-tabs__row">
                <button type="button" className="sg-tab" aria-pressed={cat === null} onClick={() => deckTo(null)}>
                  All <span className="sg-tab__count">{all.length}</span>
                </button>
                {chapters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="sg-tab"
                    aria-pressed={cat === c.id}
                    onClick={() => deckTo(c.id)}
                  >
                    {c.title} <span className="sg-tab__count">{c.entries.length}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
          {/* Keyed by the active filter: switching a chapter rebuilds the panel
              set, and a reused deck would keep the old scrollTop. A
              deep-linked entry opens on that card, past the cover. */}
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

  // ---- The front page --------------------------------------------------------
  const facts: SgFact[] = [
    {
      icon: 'book',
      label: 'The entries',
      value: `${all.length} in ${chapters.length} chapters`,
      note: 'Numbered across the whole set, so a number names one place',
    },
    {
      icon: 'pin',
      label: 'On the map',
      value: 'Gold pins',
      to: '/map?secret=1',
      note: `${pinned} of ${all.length} pinned, with their own toggle`,
    },
    {
      icon: 'offline',
      label: 'Offline',
      value: offlineReady ? 'Photos on this device' : 'Get the photo pack',
      to: '/account',
      signal: offlineReady,
      note: offlineReady
        ? 'Text and photos work with no signal'
        : 'The text is bundled already; the photos are one download',
    },
    {
      icon: 'plan',
      label: 'In your plan',
      value: 'Any entry, any day',
      to: '/trip',
      note: 'The trip board slots it in drive order',
    },
  ]

  return (
    <GatedChrome>
      <main className="sg-page">
        <Hero
          total={all.length}
          chapters={chapters.length}
          onBrowse={() => scrollTo(chaptersRef.current)}
          onRoutes={() => scrollTo(routesRef.current)}
        />

        <div className="wrap">
          <SgFacts facts={facts} label="The Secret Guide at a glance" />

          {/* ---- Start here: how it reads, and the six picks ---------------- */}
          <section className="sg-section" aria-labelledby="sg-start-title">
            <div className="sg-start">
              <div className="sg-start__copy">
                <span className="sg-eyebrow">Start here</span>
                <h2 className="sg-h2" id="sg-start-title">
                  Fewer people, better light, the right pullout.
                </h2>
                <p>
                  The rest of this guide is the park the way the signs present it. This part is what
                  people who work here tell their friends: where to stand when the famous view is three
                  deep, which trail keeps going after the crowd turns around, where the car goes when the
                  lot is full, and which guided hours are worth an evening.
                </p>
                <p>
                  Every entry is numbered across the whole set and held to the same standard as the rest
                  of the guide: facts checked against the Park Service, the Forest Service or the source
                  on its pin, and nothing that sends you somewhere it is illegal to park or stand.
                </p>
              </div>
              <aside className="sg-short" aria-labelledby="sg-short-title">
                <p className="sg-short__head" id="sg-short-title">
                  <SgIcon name="star" size={16} />
                  If you do six things
                </p>
                <ol>
                  {SECRET_GUIDE_PICKS.map((p) => {
                    const s = getStopById(p.id)
                    if (!s) return null
                    return (
                      <li key={p.id}>
                        <Link to={`/stop/${s.id}`}>
                          <span>
                            <span className="sg-short__line">{p.line}</span>
                            <span className="sg-short__name">
                              {folioLabel(s.id)} · {s.title.split(',')[0]}
                            </span>
                          </span>
                          <SgIcon name="arrow" size={16} />
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </aside>
            </div>
          </section>

          {/* ---- The chapters ------------------------------------------------ */}
          <section
            className="sg-section sg-anchor"
            aria-labelledby="sg-chapters-title"
            ref={chaptersRef}
          >
            <div className="sg-section__head">
              <span className="sg-eyebrow">{chapters.length} chapters</span>
              <h2 className="sg-h2" id="sg-chapters-title">
                The contents
              </h2>
            </div>
            <ul className="sg-chapters">
              {chapters.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="sg-chapter"
                    aria-pressed={cat === c.id}
                    aria-label={`Chapter ${c.numeral}, ${c.title}, ${plural(c.entries.length, 'entry', 'entries')}`}
                    onClick={() => select(cat === c.id ? null : c.id)}
                  >
                    <span className="sg-chapter__media">
                      {c.photo && (
                        <ResponsivePhoto
                          src={c.photo}
                          alt=""
                          loading="lazy"
                          width={600}
                          height={450}
                          sizes="(max-width: 760px) 50vw, 400px"
                        />
                      )}
                      <span className="sg-chapter__num" aria-hidden="true">
                        {c.numeral}
                      </span>
                      <span className="sg-chapter__count" aria-hidden="true">
                        {String(c.entries.length).padStart(2, '0')}
                      </span>
                    </span>
                    <span className="sg-chapter__body">
                      <span className="sg-chapter__title">{c.title}</span>
                      <span className="sg-chapter__tag">{c.tagline}</span>
                      <span className="sg-chapter__go" aria-hidden="true">
                        {plural(c.entries.length, 'entry', 'entries')}
                        <SgIcon name="down" size={12} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---- Routes: the band ---------------------------------------------- */}
        <section
          className="sg-section sg-section--band sg-anchor"
          aria-labelledby="sg-routes-title"
          ref={routesRef}
        >
          <div className="wrap">
            <div className="sg-section__head">
              <span className="sg-eyebrow">Routes</span>
              <h2 className="sg-h2" id="sg-routes-title">
                The Secret Guide in day-sized pieces
              </h2>
              <p className="sg-lede">
                {SECRET_ROUTES.length} ways to string the entries together, in the order you would drive
                them, at the hour each one is best. Add a route to a day of your trip and the board fits it
                around everything else.
              </p>
            </div>
            <Routes />
          </div>
        </section>

        {/* ---- The index ---------------------------------------------------- */}
        <div className="wrap">
          <section className="sg-index" aria-labelledby="sg-index-title" ref={indexRef}>
            <div className="sg-section__head">
              <span className="sg-eyebrow">The index</span>
              <h2 className="sg-h2" id="sg-index-title">
                Every entry
              </h2>
            </div>
            <nav className="sg-tabs" aria-label="Filter by chapter">
              <div className="sg-tabs__row">
                <button type="button" className="sg-tab" aria-pressed={cat === null} onClick={() => select(null)}>
                  All <span className="sg-tab__count">{all.length}</span>
                </button>
                {chapters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="sg-tab"
                    aria-pressed={cat === c.id}
                    onClick={() => select(c.id)}
                  >
                    <span className="sg-tab__num">{c.numeral}</span>
                    {c.title}
                    <span className="sg-tab__count">{c.entries.length}</span>
                  </button>
                ))}
              </div>
              {/* The entry list rewrites itself on every tab tap with nothing
                  said about it; this is that, spoken. */}
              <p className="sr-only" aria-live="polite">
                {plural(shownCount, 'entry', 'entries')} shown
              </p>
            </nav>

            {shown.map((c) => {
              const [first, ...rest] = c.entries
              return (
                <section key={c.id} className="sg-chapter-block" aria-labelledby={`sg-ch-${c.id}`}>
                  <div className="sg-chapter-head">
                    <span className="sg-chapter-head__num" aria-hidden="true">
                      {c.numeral}
                    </span>
                    <h3 className="sg-chapter-head__title" id={`sg-ch-${c.id}`}>
                      {c.title}
                    </h3>
                    <span className="sg-chapter-head__count">{plural(c.entries.length, 'entry', 'entries')}</span>
                    <p className="sg-chapter-head__tag">{c.tagline}</p>
                    <Link className="sg-chapter-head__deck" to={`/secret-guide?view=cards&cat=${c.id}`}>
                      <SgIcon name="cards" size={14} />
                      Flip through as cards
                    </Link>
                  </div>
                  {first && <SgFeature s={first} />}
                  {rest.length > 0 && (
                    <div className="sg-rows">
                      {rest.map((s) => (
                        <SgRow key={s.id} s={s} />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </section>

          {/* ---- The close ---------------------------------------------------- */}
          <section className="sg-section" aria-label="Using the Secret Guide">
            <div className="sg-close">
              <Link className="sg-close__card" to="/map?secret=1">
                <SgIcon name="pin" size={22} />
                <strong>See them on the map</strong>
                <span>The gold pins have their own toggle, and work offline once the map pack is down.</span>
              </Link>
              <Link className="sg-close__card" to="/report?type=stop">
                <SgIcon name="compass" size={22} />
                <strong>Standing at one and it&apos;s wrong?</strong>
                <span>A pullout moved, a rule changed, a pin is off. Tell us from the spot.</span>
              </Link>
              <Link className="sg-close__card" to="/account">
                <SgIcon name="offline" size={22} />
                <strong>{offlineReady ? 'Photos are on this device' : 'Take it offline'}</strong>
                <span>
                  {offlineReady
                    ? 'The Secret Guide photo pack is downloaded. Nothing here needs a signal.'
                    : 'The text is in the app already. The photo pack is one download on the Account page.'}
                </span>
              </Link>
            </div>
            <div style={{ marginTop: 32 }}>
              <BackLink to="/" label="Back to the guide" />
            </div>
          </section>
        </div>
      </main>
    </GatedChrome>
  )
}
