import { Navigate, useParams } from 'react-router-dom'
import { getHiddenStops, getRegionMeta, getStopById, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import PrevNextNav from '../components/PrevNextNav'
import StopCard from '../components/StopCard'
import Button from '../components/ui/Button'
import BackLink from '../components/ui/BackLink'
import { directionsUrl } from '../map/kinds'
import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'

export default function StopDetail() {
  const params = useParams<{ stopId: string }>()
  const stop = params.stopId ? getStopById(params.stopId) : undefined
  const { plan, addStop } = useTripPlan()
  if (!stop) return <Navigate to="/" replace />
  const planned = plan.items.some((it) => it.type === 'stop' && it.stopId === stop.id)

  // Hidden stops page through the hidden set within their region; core stops
  // page through the curated region sequence. Mixing them would put a hidden
  // stop "between" core stops it was deliberately kept out of.
  const isHidden = stop.collection === 'hidden'
  const siblings = isHidden
    ? getHiddenStops().filter((s) => s.region === stop.region)
    : getStopsByRegion(stop.region)
  const idx = siblings.findIndex((s) => s.id === stop.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
  const regionMeta = getRegionMeta(stop.region)
  const backTo = isHidden ? '/hidden-areas' : `/region/${stop.region}`
  const backLabel = isHidden ? 'Hidden areas' : regionMeta?.title ?? 'Region'

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <BackLink to={backTo} label={backLabel} placement="top" />

        <StopCard stop={stop} compact={false} />

        <div className="action-row" style={{ marginTop: 20 }}>
          {planned ? (
            <Button variant="ghost" to="/trip">
              In your trip plan →
            </Button>
          ) : (
            <Button
              onClick={() => {
                addStop(stop.id)
                announceTripAdd(stop.title)
              }}
            >
              Add to trip
            </Button>
          )}
          {stop.coord && (
            <Button variant="ghost" href={directionsUrl(stop.coord)} external>
              Directions →
            </Button>
          )}
        </div>

        <PrevNextNav
          sticky
          prev={prev ? { to: `/stop/${prev.id}`, title: prev.title } : null}
          next={next ? { to: `/stop/${next.id}`, title: next.title } : null}
          prevEmptyLabel="Start of region"
          nextEmptyLabel="End of region"
        />
      </main>
    </GatedChrome>
  )
}
