// =============================================================================
// RoadNote: what the seasonal road in front of an entry is doing today, as
// one callout. Rendered on the full read of a stop, a Secret Guide entry and
// a hike page, and under the Tuolumne and Glacier Point region headers.
//
// Silent when there is nothing to say: a road that is merely "usually open"
// this month prints nothing, because a callout on every summer page teaches
// the reader to skip callouts. It speaks when the road is closed or may be
// (typical or live), and when the park's own status for today is in hand,
// open included, because "open today, per the park" is a reading worth having
// at a trailhead with no signal.
// =============================================================================

import { useRoadReader } from '../alerts/roadState'
import { ROAD_WINTER_NOTE, type SeasonalRoadId } from '../content/roads'
import { todayIso } from '../utils/date'

export default function RoadNote({
  road,
  dateIso,
  className,
}: {
  road: SeasonalRoadId
  // The day in question; today (park time) when omitted.
  dateIso?: string
  className?: string
}) {
  const roads = useRoadReader()
  const reading = roads.forRoad(road, dateIso ?? todayIso())
  if (reading.state === 'open' && reading.basis === 'typical') return null
  const closedish = reading.state !== 'open'
  return (
    <aside
      className={`swap-callout swap-callout--road${closedish ? ' swap-callout--road-closed' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <span className="swap-callout__label">
        {reading.basis === 'live' ? 'Road today' : 'Road'}
      </span>
      {reading.sentence}
      {closedish ? ` ${ROAD_WINTER_NOTE[road]}` : ''}
    </aside>
  )
}
