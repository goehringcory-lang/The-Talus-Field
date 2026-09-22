// =============================================================================
// /hikes — the day-hike catalog for the Plan tab: every established day hike
// inside the park, grouped by region, filterable by region and difficulty,
// each addable to the trip plan (where it slots like a stop, using the hike's
// duration estimate). Fully bundled content, so it works offline.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import TrackSparkline from '../components/TrackSparkline'
import Button from '../components/ui/Button'
import { Chip, ChipButton } from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { REGIONS, REGION_SHORT, getHikesByRegion, getStopById } from '../content'
import { getHikeTraits } from '../content/hike-traits'
import { DIFFICULTY_LABEL, formatTime } from '../content/labels'
import type { HikeRouteT, HikeT, Region } from '../content'
import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'
import { getTrackSummary } from '../trails/track'
import { formatMiles, haversineMiles } from '../utils/geo'
import './Hikes.css'

const ROUTE_LABEL: Record<HikeRouteT, string> = {
  'out-and-back': 'Out and back',
  loop: 'Loop',
  lollipop: 'Lollipop loop',
  'one-way': 'One way',
}

const DIFFICULTIES = ['easy', 'moderate', 'strenuous'] as const
type Difficulty = (typeof DIFFICULTIES)[number]

// The matcher's time bands answer "we have N hours", so they filter on the
// planner's generous durationMin, not on distance.
const TIME_BANDS = [
  { id: 'under2', label: 'Under 2 hours', maxMin: 120 },
  { id: 'half', label: 'Half a day', maxMin: 300 },
] as const
type TimeBand = (typeof TIME_BANDS)[number]['id']

// Trait-driven fit filters, powered by content/hike-traits.ts. A hike with
// no traits entry cannot happen (the module throws at load), so the getter's
// undefined branch is only for type comfort.
const FIT_FILTERS = [
  { id: 'kids', label: 'Good with kids' },
  { id: 'stroller', label: 'Stroller-smooth' },
  { id: 'quiet', label: 'Quieter trail' },
  { id: 'shade', label: 'Some shade' },
] as const
type FitFilter = (typeof FIT_FILTERS)[number]['id']

function matchesFit(hike: HikeT, fit: Set<FitFilter>): boolean {
  if (fit.size === 0) return true
  const traits = getHikeTraits(hike.id)
  if (!traits) return false
  if (fit.has('kids') && !traits.kidFriendly) return false
  if (fit.has('stroller') && !traits.stroller) return false
  if (fit.has('quiet') && traits.crowd !== 'low') return false
  if (fit.has('shade') && traits.shade === 'exposed') return false
  return true
}

// How the list is ordered. 'region' is the catalog's own reading order under
// region heads; the other three flatten the list and answer one question
// each ("what is short", "what is flat", "what can I start from here").
const SORTS = [
  { id: 'region', label: 'By region' },
  { id: 'short', label: 'Shortest' },
  { id: 'gain', label: 'Least climbing' },
  { id: 'near', label: 'Nearest trailhead' },
] as const
type SortMode = (typeof SORTS)[number]['id']

type Filters = {
  region: Region | null
  difficulty: Difficulty | null
  time: TimeBand | null
  fit: Set<FitFilter>
  sort: SortMode
}

// The filters ride the URL (?region=&level=&time=&fit=&sort=), read once on
// mount and mirrored with replaceState: a reader who opens a hike and comes
// back finds the list they filtered, not the whole catalog, and a filtered
// list is a link. Same idiom as /search. 'near' is never mirrored, because
// a sort that needs a location fix cannot be restored without asking for one.
function readInitialFilters(): Filters {
  const empty: Filters = { region: null, difficulty: null, time: null, fit: new Set(), sort: 'region' }
  try {
    const q = new URL(window.location.href).searchParams
    const region = q.get('region')
    const level = q.get('level')
    const time = q.get('time')
    const sort = q.get('sort')
    return {
      region: REGIONS.some((r) => r.id === region) ? (region as Region) : null,
      difficulty: (DIFFICULTIES as readonly string[]).includes(level ?? '') ? (level as Difficulty) : null,
      time: TIME_BANDS.some((b) => b.id === time) ? (time as TimeBand) : null,
      fit: new Set(
        (q.get('fit') ?? '')
          .split(',')
          .filter((f): f is FitFilter => FIT_FILTERS.some((x) => x.id === f)),
      ),
      sort: sort === 'short' || sort === 'gain' ? sort : 'region',
    }
  } catch {
    return empty
  }
}

type Fix = { coord: [number, number] } | { error: string } | 'locating' | null

function formatDistance(hike: HikeT): string {
  return `${hike.distanceMi} mi${hike.route === 'one-way' ? ' one-way' : ''}`
}

function formatGain(ft: number): string {
  return ft === 0 ? 'Flat' : `${ft.toLocaleString('en-US')} ft gain`
}

export default function Hikes() {
  const [initial] = useState(readInitialFilters)
  const [regionFilter, setRegionFilter] = useState<Region | null>(initial.region)
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(initial.difficulty)
  const [timeFilter, setTimeFilter] = useState<TimeBand | null>(initial.time)
  const [fitFilters, setFitFilters] = useState<Set<FitFilter>>(initial.fit)
  const [sort, setSort] = useState<SortMode>(initial.sort)
  const [fix, setFix] = useState<Fix>(null)
  const { plan, addHike } = useTripPlan()

  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const set = (key: string, value: string | null) => {
        if (value) url.searchParams.set(key, value)
        else url.searchParams.delete(key)
      }
      set('region', regionFilter)
      set('level', difficultyFilter)
      set('time', timeFilter)
      set('fit', FIT_FILTERS.filter((f) => fitFilters.has(f.id)).map((f) => f.id).join(','))
      set('sort', sort === 'short' || sort === 'gain' ? sort : null)
      window.history.replaceState(window.history.state, '', url)
    } catch {
      /* mirroring is a convenience; the list itself never depends on it */
    }
  }, [regionFilter, difficultyFilter, timeFilter, fitFilters, sort])

  const toggleFit = (id: FitFilter) => {
    setFitFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filterCount =
    (regionFilter ? 1 : 0) + (difficultyFilter ? 1 : 0) + (timeFilter ? 1 : 0) + fitFilters.size
  const clearFilters = () => {
    setRegionFilter(null)
    setDifficultyFilter(null)
    setTimeFilter(null)
    setFitFilters(new Set())
  }

  // The location is asked for on the tap, never on load (the /compass rule:
  // a list page that throws a permission prompt on open reads as malware).
  const chooseSort = (next: SortMode) => {
    setSort(next)
    if (next !== 'near' || (fix && typeof fix === 'object' && 'coord' in fix)) return
    if (!('geolocation' in navigator)) {
      setFix({ error: 'This browser cannot read a location.' })
      return
    }
    setFix('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => setFix({ coord: [pos.coords.longitude, pos.coords.latitude] }),
      (err) =>
        setFix({
          error:
            err.code === err.PERMISSION_DENIED
              ? 'Location is off for this site, so the list stays in region order.'
              : 'No location fix yet, so the list stays in region order. Try again in the open.',
        }),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    )
  }

  const here = fix && typeof fix === 'object' && 'coord' in fix ? fix.coord : null
  const effectiveSort: SortMode = sort === 'near' && !here ? 'region' : sort

  const plannedHikeIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'hike').map((it) => it.hikeId)),
    [plan],
  )

  const sections = useMemo(() => {
    const matches = (h: HikeT) =>
      (!difficultyFilter || h.difficulty === difficultyFilter) &&
      (!timeFilter || h.durationMin <= (TIME_BANDS.find((b) => b.id === timeFilter)?.maxMin ?? Infinity)) &&
      matchesFit(h, fitFilters)
    const regions = REGIONS.filter((r) => !regionFilter || r.id === regionFilter)
    if (effectiveSort === 'region') {
      return regions
        .map((r) => ({ key: r.id, title: r.title, hikes: getHikesByRegion(r.id).filter(matches) }))
        .filter((s) => s.hikes.length > 0)
    }
    const flat = regions.flatMap((r) => getHikesByRegion(r.id).filter(matches))
    const away = (h: HikeT) => (here && h.coord ? haversineMiles(here, h.coord) : Infinity)
    const title =
      effectiveSort === 'short'
        ? 'Shortest first'
        : effectiveSort === 'gain'
          ? 'Least climbing first'
          : 'Nearest trailhead first'
    flat.sort((a, b) =>
      effectiveSort === 'short'
        ? a.distanceMi - b.distanceMi
        : effectiveSort === 'gain'
          ? a.elevationGainFt - b.elevationGainFt || a.distanceMi - b.distanceMi
          : away(a) - away(b),
    )
    return flat.length > 0 ? [{ key: effectiveSort, title, hikes: flat }] : []
  }, [regionFilter, difficultyFilter, timeFilter, fitFilters, effectiveSort, here])

  const matchCount = useMemo(
    () => sections.reduce((total, s) => total + s.hikes.length, 0),
    [sections],
  )

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="hikes" />
        <PageHeader
          eyebrow="Trails by region"
          title="Day hikes"
          intro="Every established day hike inside the park, with the numbers that matter: distance, climbing, and how hard it really is. Add one to a day and the trip plan budgets the hours for it."
        />

        <div className="hikes-chips" role="group" aria-label="Filter hikes">
          {REGIONS.map((r) => (
            <ChipButton
              key={r.id}
              variant="filter"
              pressed={regionFilter === r.id}
              onClick={() => setRegionFilter(regionFilter === r.id ? null : r.id)}
            >
              {REGION_SHORT[r.id]}
            </ChipButton>
          ))}
          {DIFFICULTIES.map((d) => (
            <ChipButton
              key={d}
              variant="filter"
              pressed={difficultyFilter === d}
              onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
            >
              {DIFFICULTY_LABEL[d]}
            </ChipButton>
          ))}
        </div>

        {/* The matcher row: "we have three hours and a stroller". Time bands
            are single-select; fit filters stack (kids AND quiet works). */}
        <div className="hikes-chips" role="group" aria-label="Match hikes to your day">
          {TIME_BANDS.map((band) => (
            <ChipButton
              key={band.id}
              variant="filter"
              pressed={timeFilter === band.id}
              onClick={() => setTimeFilter(timeFilter === band.id ? null : band.id)}
            >
              {band.label}
            </ChipButton>
          ))}
          {FIT_FILTERS.map((f) => (
            <ChipButton
              key={f.id}
              variant="filter"
              pressed={fitFilters.has(f.id)}
              onClick={() => toggleFit(f.id)}
            >
              {f.label}
            </ChipButton>
          ))}
        </div>

        <div className="hikes-sort" role="group" aria-label="Sort hikes">
          <span className="hikes-sort__label">Sort</span>
          {SORTS.map((s) => (
            <ChipButton
              key={s.id}
              variant="filter"
              pressed={sort === s.id}
              onClick={() => chooseSort(s.id)}
            >
              {s.label}
            </ChipButton>
          ))}
        </div>
        {sort === 'near' && fix === 'locating' && (
          <p className="hikes-sort__note">Finding your position…</p>
        )}
        {sort === 'near' && fix && typeof fix === 'object' && 'error' in fix && (
          <p className="hikes-sort__note">{fix.error}</p>
        )}

        {/* The list below rewrites itself on every chip tap; the count says
            so on screen and, through the live region, aloud. */}
        <div className="hikes-count">
          <p aria-live="polite">
            {matchCount} {matchCount === 1 ? 'hike' : 'hikes'}
            {filterCount > 0 ? ' match' : ''}
          </p>
          {filterCount > 0 && (
            <button type="button" className="hikes-count__clear" onClick={clearFilters}>
              Clear {filterCount === 1 ? 'filter' : `${filterCount} filters`}
            </button>
          )}
        </div>

        {sections.length === 0 && (
          <EmptyState
            note="Nothing matches the current filters."
            action={<Button variant="ghost" onClick={clearFilters}>Show every hike</Button>}
          />
        )}

        {sections.map(({ key, title, hikes }) => (
          <section key={key} aria-label={title}>
            <div className="hikes-region-header">{title}</div>
            {hikes.map((hike) => {
              const inPlan = plannedHikeIds.has(hike.id)
              const trailheadStop = hike.stopId ? getStopById(hike.stopId) : undefined
              const track = getTrackSummary(hike.id)
              const traits = getHikeTraits(hike.id)
              const add = () => {
                addHike(hike.id)
                announceTripAdd(hike.title)
              }
              return (
                <details className="hike-row" key={hike.id}>
                  <summary>
                    <span className="hike-row__distance">
                      {formatDistance(hike)}
                      <span className="hike-row__gain">{formatGain(hike.elevationGainFt)}</span>
                      {track && <TrackSparkline spark={track.spark} />}
                    </span>
                    <span className="hike-row__main">
                      <h2 className="hike-row__title">{hike.title}</h2>
                      <span className="hike-row__meta">
                        {effectiveSort === 'near' && here && hike.coord && (
                          <span className="hike-row__away">
                            {formatMiles(haversineMiles(here, hike.coord))} away
                          </span>
                        )}
                        {effectiveSort !== 'region' && <span>{REGION_SHORT[hike.region]}</span>}
                        <span>{DIFFICULTY_LABEL[hike.difficulty]}</span>
                        <span>~{formatTime(hike.durationMin)}</span>
                        <span>{ROUTE_LABEL[hike.route]}</span>
                        {hike.permit && <Chip variant="badge">Permit</Chip>}
                        {hike.season && <Chip variant="badge">{hike.season}</Chip>}
                        {traits?.kidFriendly && <Chip variant="badge">Kids OK</Chip>}
                        {traits?.stroller && <Chip variant="badge">Stroller</Chip>}
                        {traits?.crowd === 'low' && <Chip variant="badge">Quieter</Chip>}
                      </span>
                    </span>
                    {inPlan ? (
                      <span className="hike-row__inplan">
                        {/* A label on the glyph span alone is dropped: the
                            span is role=generic. */}
                        <span aria-hidden="true">✓</span>
                        <span className="sr-only">In your trip plan</span>
                      </span>
                    ) : (
                      <ChipButton
                        variant="action"
                        aria-label={`Add ${hike.title} to trip`}
                        className="hike-row__action"
                        onClick={(e) => {
                          // A click inside <summary> toggles the row by default;
                          // preventDefault keeps the add from expanding it.
                          e.preventDefault()
                          e.stopPropagation()
                          add()
                        }}
                      >
                        + Add
                      </ChipButton>
                    )}
                  </summary>
                  <p className="hike-row__body">
                    {hike.description}
                    {hike.distanceNote && ` (${hike.distanceNote}.)`}
                  </p>
                  {hike.permit && <p className="hike-row__note">{hike.permit}</p>}
                  {hike.hazard && <p className="hike-row__note">{hike.hazard}</p>}
                  <p className="hike-row__note">Trailhead: {hike.trailhead}.</p>
                  <p className="hike-row__body hike-row__footer">
                    {inPlan ? (
                      <Button variant="ghost" to="/trip">
                        In your trip plan →
                      </Button>
                    ) : (
                      <Button onClick={add}>Add to trip</Button>
                    )}
                    <Link to={`/hike/${hike.id}`}>
                      {track ? 'Elevation profile & GPS track →' : 'Trail details →'}
                    </Link>
                    {trailheadStop && (
                      <Link to={`/stop/${trailheadStop.id}`}>Trailhead in the guide →</Link>
                    )}
                  </p>
                </details>
              )
            })}
          </section>
        ))}

        <p className="page-footnote">
          Distances are round trip unless marked one-way, for the shortest standard route. Stats
          cross-checked against NPS trail pages and the yosemitehikes.com index; conditions and
          closures change, so check trail status at a visitor center before a big day. Time
          estimates are generous, for planning rather than bragging.
        </p>
      </main>
    </GatedChrome>
  )
}
