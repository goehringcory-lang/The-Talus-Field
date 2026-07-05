// Calendar-plus toggle in the stop-card title row, so every list surface
// (region pages, secret spots, hidden areas) can plan without opening the
// stop. Toggling off removes the stop from every day it was planned on.

import { announceTripAdd } from '../trip/addFeedback'
import { useTripPlan } from '../trip/useTripPlan'

type Props = {
  stopId: string
  title: string
}

export default function AddToTripButton({ stopId, title }: Props) {
  const { plan, addStop, removeItem } = useTripPlan()
  const planned = plan.items.filter((it) => it.type === 'stop' && it.stopId === stopId)
  const isPlanned = planned.length > 0

  function toggle() {
    if (isPlanned) {
      for (const it of planned) removeItem(it.itemId)
      return
    }
    addStop(stopId)
    announceTripAdd(title)
  }

  return (
    <button
      type="button"
      className="fav-toggle"
      aria-pressed={isPlanned}
      aria-label={isPlanned ? `Remove ${title} from trip plan` : `Add ${title} to trip plan`}
      title={isPlanned ? 'In trip plan' : 'Add to trip'}
      onClick={toggle}
    >
      <svg
        className="fav-toggle__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="16" rx="0" fill={isPlanned ? 'currentColor' : 'none'} />
        <path d="M8 3v4M16 3v4M3 10h18" />
        {isPlanned ? (
          <path d="M9 15.5l2 2 4-4" stroke="var(--paper)" fill="none" />
        ) : (
          <path d="M12 13v5M9.5 15.5h5" />
        )}
      </svg>
    </button>
  )
}
