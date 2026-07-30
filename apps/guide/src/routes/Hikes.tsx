// =============================================================================
// /hikes — the day-hike catalog for the Plan tab: every established day hike
// inside the park, grouped by region, filterable by region and difficulty,
// each addable to the trip plan (where it slots like a stop, using the hike's
// duration estimate). Fully bundled content, so it works offline.
// =============================================================================

import { useMemo, useState } from 'react'
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

function formatDistance(hike: HikeT): string {
  return `${hike.distanceMi} mi${hike.route === 'one-way' ? ' one-way' : ''}`
}

function formatGain(ft: number): string {
  return ft === 0 ? 'Flat' : `${ft.toLocaleString('en-US')} ft gain`
}

export default function Hikes() {
  const [regionFilter, setRegionFilter] = useState<Region | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeBand | null>(null)
  const [fitFilters, setFitFilters] = useState<Set<FitFilter>>(new Set())
  const { plan, addHike } = useTripPlan()

  const toggleFit = (id: FitFilter) => {
    setFitFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const plannedHikeIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'hike').map((it) => it.hikeId)),
    [plan],
  )

  const sections = useMemo(
    () =>
      REGIONS.filter((r) => !regionFilter || r.id === regionFilter)
        .map((r) => ({
          region: r,
          hikes: getHikesByRegion(r.id).filter(
            (h) =>
              (!difficultyFilter || h.difficulty === difficultyFilter) &&
              (!timeFilter ||
                h.durationMin <= (TIME_BANDS.find((b) => b.id === timeFilter)?.maxMin ?? Infinity)) &&
              matchesFit(h, fitFilters),
          ),
        }))
        .filter((s) => s.hikes.length > 0),
    [regionFilter, difficultyFilter, timeFilter, fitFilters],
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

        {sections.length === 0 && <EmptyState note="Nothing matches the current filters." />}

        {sections.map(({ region, hikes }) => (
          <section key={region.id} aria-label={region.title}>
            <div className="hikes-region-header">{region.title}</div>
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
                    <span>
                      <h2 className="hike-row__title">{hike.title}</h2>
                      <span className="hike-row__meta">
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
                      <span className="hike-row__inplan" aria-label="In your trip plan">
                        ✓
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
