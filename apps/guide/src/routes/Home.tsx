// =============================================================================
// / — the front page (the September 2026 home redesign, an artifact-first
// design pass; see the PR). One narrow column, top to bottom:
//   1. "Yosemite, right now": the park's date and hour, then one card holding
//      the weather, the light (a sun over a horizon) and the entrance waits,
//      and the Park Bulletin band (components/ParkNowPanel.tsx). The three
//      readings are the first thing on the page and the reason to open it.
//   2. Any one-time notes (a trip handed over from the map, the newest
//      edition note, the night-before downloads) and, while the trip window
//      includes today, the door to /today.
//   3. Your trip: the dates, then one row per day (components/TripDaysCard.tsx).
//   4. Where to go: the four regions and the Secret Guide plate.
//   5. Instruments, the reference shelf, the offline packs.
// Every route in the app is reachable from here or from the tab bar; nothing
// lives only behind one. Air quality and river flow moved to /this-week with
// the rest of the "right now" lines that are footnotes to a trip, not a
// reason to open the app.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import { getStopById } from '../content'
import { formatClock, parkNowMinutes, todayIso } from '../utils/date'
import { useFavorites } from '../lib/favorites'
import { useWhatsNew } from '../lib/whatsNew'
import { logHasEntries, readLogSummary } from '../lib/logSummary'
import { isPackCompleted } from '../offline/useDownloads'
import { PACK_IDS } from '../offline/manifest'
import { useTripPlan } from '../trip/useTripPlan'
import { clearPendingImport, peekPendingImport, resolveEditorialIds } from '../trip/importTrip'
import { slotPlan } from '../trip/slotting'
import { itemInfo } from '../trip/agendaItem'
import type { TripItemT } from '../trip/schema'
import { readTripDates, type TripDates } from '../programs/usePrograms'
import GatedChrome from '../components/GatedChrome'
import ParkNowPanel from '../components/ParkNowPanel'
import RegionCards from '../components/RegionCards'
import TripDaysCard from '../components/TripDaysCard'
import UpdatedStamp from '../components/UpdatedStamp'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import FeedbackSurvey from '../components/FeedbackSurvey'
import { noteSurveyVisit, shouldAskSurvey } from '../lib/survey'
import './Home.css'

const BEFORE_YOU_GO_DISMISS_KEY = 'tfg.beforeYouGo.dismissed'

// One-time nudge toward the night-before downloads. Same dismissal pattern as
// InstallPrompt (tfg.install.dismissed).
function BeforeYouGoNudge() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(BEFORE_YOU_GO_DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  if (dismissed) return null
  return (
    <Callout
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            try {
              localStorage.setItem(BEFORE_YOU_GO_DISMISS_KEY, '1')
            } catch {
              /* non-fatal: nudge may reappear next launch */
            }
            setDismissed(true)
          }}
        >
          Got it
        </Button>
      }
    >
      Going soon? Do the <Link to="/essentials/before-you-go">night-before downloads</Link>{' '}
      while you still have wifi: the offline maps, this guide, and the current Yosemite Guide PDF.
    </Callout>
  )
}

// One note per release, once: the newest edition note, dismissed for good
// with a tap. A first launch never sees it (lib/whatsNew.ts).
function WhatsNewNote() {
  const { entry, dismiss } = useWhatsNew()
  if (!entry) return null
  return (
    <Callout
      action={
        <Button variant="ghost" size="sm" onClick={dismiss}>
          Got it
        </Button>
      }
    >
      <strong>New in this update.</strong> {entry.lines[0]}{' '}
      <Link to="/account#changes">Everything that changed →</Link>
    </Callout>
  )
}

// A trip built on the editorial map before the buyer owned the guide. The ids
// were stashed at boot the first time /trip?import= was opened (importTrip.ts);
// the buy detour and the magic-link sign-in both lose the URL, so the offer is
// made here instead. Taking it re-enters /trip with a real ?import=, which is
// the one path that writes to the plan — nothing is imported behind the user.
function PendingImportCard() {
  const [ids, setIds] = useState<string[]>(() => peekPendingImport())
  const resolved = useMemo(() => resolveEditorialIds(ids), [ids])
  const count = resolved.stopIds.length + resolved.hikeIds.length
  // Nothing in the trip exists in the guide; offering it would be a dead end.
  // The cleanup is a storage write, so it lives in an effect — render stays
  // pure (same rule as the mount-stamp reads below).
  const dead = ids.length > 0 && count === 0
  useEffect(() => {
    if (dead) clearPendingImport()
  }, [dead])
  if (ids.length === 0 || count === 0) return null
  return (
    <Callout
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearPendingImport()
            setIds([])
          }}
        >
          No thanks
        </Button>
      }
    >
      The trip you built on the map is waiting: {count} {count === 1 ? 'entry' : 'entries'}.{' '}
      <Link to={`/trip?import=${ids.join(',')}`}>Add it to your trip →</Link>
    </Callout>
  )
}

// Shown only while the trip window includes today: the door to /today, with
// the next planned thing as the one-line pitch. Disappears outside the
// window, so the front page stays stable the rest of the year.
function TodayCard({
  today,
  dates,
  items,
}: {
  today: string
  dates: TripDates
  items: TripItemT[]
}) {
  const blocks = useMemo(() => slotPlan(items).get(today) ?? [], [items, today])
  // Same one-minute pulse as /today, so a home screen left open doesn't keep
  // pitching the thing that finished an hour ago.
  const [nowMin, setNowMin] = useState(parkNowMinutes)
  useEffect(() => {
    const t = window.setInterval(() => setNowMin(parkNowMinutes()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  const next = blocks.find(
    (b) => b.startMin !== null && b.startMin + b.durationMin > nowMin,
  )
  const dayNumber =
    Math.round(
      (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${dates.start}T00:00:00Z`)) / 86_400_000,
    ) + 1
  const dayTotal =
    Math.round(
      (Date.parse(`${dates.end}T00:00:00Z`) - Date.parse(`${dates.start}T00:00:00Z`)) / 86_400_000,
    ) + 1
  return (
    <Link to="/today" className="today-card">
      <span className="today-card__label">
        Today · Day {dayNumber} of {dayTotal}
      </span>
      <span className="today-card__line">
        {next && next.startMin !== null
          ? `${next.startMin <= nowMin ? 'Now' : `At ${formatClock(next.startMin)}`}: ${itemInfo(next.item).title} →`
          : blocks.length > 0
            ? 'The day in order, with conditions and sun times →'
            : 'Conditions, sun times, and entrance waits →'}
      </span>
    </Link>
  )
}

function Chevron() {
  return (
    <svg className="home-row__go" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

// The eight instrument tiles, in the order the redesign fixed. Icons are the
// app's stroke glyphs (24 viewBox, currentColor, 1.5 weight); Help is the one
// tile in the accent, because it is the page a buyer opens once, in trouble,
// and has to find without knowing its name.
const TILES: { to: string; label: string; help?: boolean; glyph: ReactNode }[] = [
  {
    to: '/map',
    label: 'Map',
    glyph: (
      <>
        <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
  },
  {
    to: '/hikes',
    label: 'Hikes',
    glyph: (
      <>
        <path d="M2 20L9 7l4 7 2.5-4L21 20H2z" />
        <path d="M11 11l-1.5 2.5" />
      </>
    ),
  },
  {
    to: '/programs',
    label: 'Programs',
    glyph: (
      <>
        <path d="M12 3c2.2 2.6 4 4.6 4 7.2a4 4 0 0 1-8 0C8 7.6 9.8 5.6 12 3z" />
        <path d="M5 21l14-4M19 21L5 17" />
      </>
    ),
  },
  {
    to: '/night',
    label: 'Night sky',
    glyph: <path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a7 7 0 0 0 10.6 10.6z" />,
  },
  {
    to: '/compass',
    label: 'Compass',
    glyph: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
      </>
    ),
  },
  {
    to: '/near',
    label: 'You are near',
    glyph: (
      <>
        <path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
  },
  {
    to: '/dining',
    label: 'Eating',
    glyph: (
      <>
        <path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3" />
        <path d="M17 3c-2 3-2 6 0 8v10M17 11h2V3" />
      </>
    ),
  },
  {
    to: '/help',
    label: 'Help · 911',
    help: true,
    glyph: (
      <>
        <path d="M12 3v18M3 12h18" />
        <rect x="5" y="5" width="14" height="14" rx="1" />
      </>
    ),
  },
]

function SectionHead({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <>
      <span className="home-section__eyebrow">{eyebrow}</span>
      <h2 className="home-section__title" id={id}>
        {title}
      </h2>
    </>
  )
}

// The survey's one unprompted ask (lib/survey.ts has the rule). A few seconds
// after Home settles, never over another dialog (the install sheet), and never
// offline, where the answers could not send.
function SurveyAsk() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    noteSurveyVisit()
    if (!shouldAskSurvey()) return
    const t = window.setTimeout(() => {
      if (!navigator.onLine) return
      if (document.querySelector('[aria-modal="true"]')) return
      setOpen(true)
    }, 4000)
    return () => window.clearTimeout(t)
  }, [])
  return open ? <FeedbackSurvey unprompted onClose={() => setOpen(false)} /> : null
}

export default function Home() {
  const { session } = useAuth()
  const { ids: favoriteIds } = useFavorites()
  const { plan } = useTripPlan()
  // Read once per mount (render must stay pure). Existing signed-in users who
  // predate onboarding get routed through /welcome exactly once; deep links
  // (/stop/x, /map?...) are never intercepted, only the front page.
  const [onboarded] = useState(() => isOnboarded())
  const [tripDates] = useState(() => readTripDates())
  const [logSummary] = useState(() => readLogSummary())
  // getStopById resolves regular stops and secret spots alike, so a saved
  // secret spot does not silently vanish from this list.
  const savedStops = favoriteIds
    .map((id) => getStopById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const savedHikeCount = favoriteIds.filter((id) => id.startsWith('hike:')).length
  const savedDiningCount = favoriteIds.filter((id) => id.startsWith('dining:')).length
  const downloadedCount = PACK_IDS.filter((id) => isPackCompleted(id)).length
  const packsDone = downloadedCount === PACK_IDS.length

  const savedLine =
    [
      savedStops.length > 0 && `${savedStops.length} ${savedStops.length === 1 ? 'stop' : 'stops'}`,
      savedHikeCount > 0 && `${savedHikeCount} ${savedHikeCount === 1 ? 'hike' : 'hikes'}`,
      savedDiningCount > 0 && `${savedDiningCount} ${savedDiningCount === 1 ? 'place to eat' : 'places to eat'}`,
    ]
      .filter(Boolean)
      .join(' · ') || 'Your bookmarks'

  if (!onboarded) return <Navigate to="/welcome" replace />

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page home">
        <ParkNowPanel />

        {/* One-time notes and the door to /today. Each renders nothing unless
            it has something to say, and the wrapper collapses with them. */}
        <div className="home-notes">
          <PendingImportCard />
          <WhatsNewNote />
          <BeforeYouGoNudge />
          {tripDates && tripDates.start <= todayIso() && todayIso() <= tripDates.end && (
            <TodayCard today={todayIso()} dates={tripDates} items={plan.items} />
          )}
        </div>

        <TripDaysCard />

        <RegionCards />

        <section aria-labelledby="home-tools-title" className="home-section">
          <SectionHead eyebrow="Instruments" title="In the field" id="home-tools-title" />
          <div className="home-tiles">
            {TILES.map((t) => (
              <Link key={t.to} to={t.to} className={t.help ? 'home-tile home-tile--help' : 'home-tile'}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {t.glyph}
                </svg>
                <span className="home-tile__label">{t.label}</span>
              </Link>
            ))}
          </div>
          <Link to="/this-week" className="home-link">
            This week in the park: alerts, seasons, tonight&rsquo;s sky
          </Link>
        </section>

        <section aria-labelledby="home-ref-title" className="home-section">
          <SectionHead eyebrow="Reference shelf" title="Know before you go" id="home-ref-title" />
          <div className="home-rows">
            <Link to="/essentials" className="home-row">
              <span className="home-row__text">
                <span className="home-row__title">Essentials</span>
                <span className="home-row__sub">Entrances, reservations, bears, heat, smoke, packing</span>
              </span>
              <Chevron />
            </Link>
            <Link to="/wildlife" className="home-row">
              <span className="home-row__text">
                <span className="home-row__title">What did I see?</span>
                <span className="home-row__sub">Mammals, birds, trees and reptiles, with field marks</span>
              </span>
              <Chevron />
            </Link>
            <Link to="/search" className="home-row">
              <span className="home-row__text">
                <span className="home-row__title">Search the guide</span>
                <span className="home-row__sub">Every stop, hike, secret spot and topic. Works offline.</span>
              </span>
              <Chevron />
            </Link>
            {/* The record and the bookmarks appear once they hold anything:
                before the trip an all-zero reading would only be noise. */}
            {logHasEntries(logSummary) && (
              <Link to="/log" className="home-row">
                <span className="home-row__text">
                  <span className="home-row__title">Your field log</span>
                  <span className="home-row__sub">
                    {[
                      logSummary.visited > 0 &&
                        `${logSummary.visited} ${logSummary.visited === 1 ? 'stop' : 'stops'}`,
                      logSummary.species > 0 && `${logSummary.species} species`,
                      logSummary.huntFinds > 0 && `${logSummary.huntFinds} found`,
                      logSummary.notes > 0 &&
                        `${logSummary.notes} ${logSummary.notes === 1 ? 'note' : 'notes'}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <Chevron />
              </Link>
            )}
            {favoriteIds.length > 0 && (
              <Link to="/saved" className="home-row">
                <span className="home-row__text">
                  <span className="home-row__title">Saved</span>
                  <span className="home-row__sub">{savedLine}</span>
                </span>
                <Chevron />
              </Link>
            )}
          </div>
        </section>

        <section aria-labelledby="home-offline-title" className="home-section">
          <SectionHead eyebrow="Before you drive in" title="Offline packs" id="home-offline-title" />
          <Link to="/account" className="home-offline">
            <span className="home-offline__count">
              {downloadedCount}{' '}
              <span className="home-offline__of">
                of {PACK_IDS.length} downloaded
              </span>
            </span>
            <span
              className="home-offline__meter"
              aria-hidden="true"
              style={{ gridTemplateColumns: `repeat(${PACK_IDS.length}, minmax(0, 1fr))` }}
            >
              {PACK_IDS.map((id, i) => (
                <span key={id} className={i < downloadedCount ? 'is-on' : undefined} />
              ))}
            </span>
            <span className="home-offline__foot">
              {packsDone
                ? 'The whole guide works offline.'
                : 'Download the rest on wifi before you leave.'}
              <span className="home-offline__manage">Manage</span>
            </span>
          </Link>
        </section>

        <UpdatedStamp />

        <SurveyAsk />

        <p className="page-footnote">
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
