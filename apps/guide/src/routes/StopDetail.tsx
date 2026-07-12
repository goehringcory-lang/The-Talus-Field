import { useParams } from 'react-router-dom'
import {
  getRegionMeta,
  getSecretGuideEntries,
  getStopById,
  getStopsByRegion,
  isSecretGuideEntry,
  type GuideStopT,
} from '../content'
import NotFound from './NotFound'
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
  if (!stop) {
    return (
      <NotFound
        title="That stop isn't in this edition."
        intro="It may have been renamed or removed. Search knows every current page."
      />
    )
  }
  const planned = plan.items.some((it) => it.type === 'stop' && it.stopId === stop.id)

  // Secret Guide members (hidden stops and secret spots) page through the
  // merged category list; core stops page through the curated region
  // sequence. Mixing them would put a guide entry "between" core stops it
  // was deliberately kept out of.
  const inSecretGuide = isSecretGuideEntry(stop)
  const region = 'region' in stop ? stop.region : undefined
  const siblings: GuideStopT[] =
    inSecretGuide || !region ? getSecretGuideEntries(stop.category) : getStopsByRegion(region)
  const idx = siblings.findIndex((s) => s.id === stop.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
  const regionMeta = region ? getRegionMeta(region) : undefined
  const backTo = inSecretGuide
    ? `/secret-guide${stop.category ? `?cat=${stop.category}` : ''}`
    : `/region/${region}`
  const backLabel = inSecretGuide ? 'The Secret Guide' : regionMeta?.title ?? 'Region'

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
          prevEmptyLabel={inSecretGuide ? 'Start of category' : 'Start of region'}
          nextEmptyLabel={inSecretGuide ? 'End of category' : 'End of region'}
        />
      </main>
    </GatedChrome>
  )
}
