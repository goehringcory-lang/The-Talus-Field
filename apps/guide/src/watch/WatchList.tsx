// The buyer's watches as text rows: campground, nights, what counts as open,
// and the sweep's last word on it. A row is honest about the check: "not
// checked yet", an age, or the reason the last check could not answer.

import { Link } from 'react-router-dom'
import { Chip } from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import { tripDatesLabel } from '../utils/date'
import { leaveDateOf, nightsCount, nightsLabel } from './nights'
import type { WatchT } from './schema'
import { checkedLine } from './status'
import { targetById } from './targets'

export default function WatchList({ watches }: { watches: WatchT[] }) {
  if (watches.length === 0) {
    return <EmptyState note="No watches yet. Pick a campground and your nights below." />
  }
  return (
    <ul className="watch-list">
      {watches.map((w) => {
        const target = targetById(w.targetId)
        const checked = checkedLine(w)
        // The grid's current answer when the Worker sends it; what the buyer
        // was last told otherwise (an older Worker, or the offline cache).
        const openNow = w.open ?? w.lastOpen
        return (
          <li key={w.id} className="watch-row">
            <div className="watch-row__head">
              <Link to={`/watch/${w.id}`} className="watch-row__title">
                {target?.name ?? w.targetId}
              </Link>
              <Chip variant="meta">{w.mode === 'full' ? 'every night' : 'any night'}</Chip>
            </div>
            <p className="watch-row__dates">
              {tripDatesLabel({ start: w.start, end: leaveDateOf(w.start, w.nights) })} ·{' '}
              {nightsCount(w.nights)}
              {target?.model === 'person' && ` · ${w.party} ${w.party === 1 ? 'spot' : 'spots'}`}
            </p>
            {openNow.length > 0 ? (
              <p className="watch-row__open">Open now: {nightsLabel(openNow)}</p>
            ) : (
              <p className="watch-row__status">Nothing open on your nights.</p>
            )}
            <p className={checked.warn ? 'watch-row__stamp watch-row__stamp--warn' : 'watch-row__stamp'}>
              {checked.text}
              {w.notifyCount > 0 && ` · ${w.notifyCount} ${w.notifyCount === 1 ? 'alert' : 'alerts'} sent`}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
