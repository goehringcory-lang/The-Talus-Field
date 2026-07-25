// The three per-stop toggles — add to trip, save, mark visited — shared by the
// scrolling StopCard and the swipe deck's StopDeckCard so a stop behaves the
// same in either view.

import { useFavorites } from '../lib/favorites'
import { useVisited } from '../lib/visited'
import AddToTripButton from './AddToTripButton'

type Props = {
  stopId: string
  title: string
}

export default function StopActions({ stopId, title }: Props) {
  const { toggle, isFavorite } = useFavorites()
  const saved = isFavorite(stopId)
  const { toggle: toggleVisited, isVisited } = useVisited()
  const visited = isVisited(stopId)

  return (
    <div className="stop-card__actions">
      <AddToTripButton stopId={stopId} title={title} />
      <button
        type="button"
        className="fav-toggle"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${title} from saved stops` : `Save ${title}`}
        title={saved ? 'Saved' : 'Save stop'}
        onClick={() => toggle(stopId)}
      >
        <svg className="fav-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
        </svg>
      </button>
      <button
        type="button"
        className="fav-toggle"
        aria-pressed={visited}
        aria-label={visited ? `Unmark ${title} as visited` : `Mark ${title} visited`}
        title={visited ? 'Visited' : 'Mark visited'}
        onClick={() => toggleVisited(stopId)}
      >
        <svg className="fav-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill={visited ? 'currentColor' : 'none'} />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke={visited ? 'var(--paper)' : 'currentColor'} fill="none" />
        </svg>
      </button>
    </div>
  )
}
