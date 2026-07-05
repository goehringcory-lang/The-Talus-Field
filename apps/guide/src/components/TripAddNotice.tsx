// Confirmation bar for "Add to trip" taps and save/remove toggles, mounted
// once in GatedChrome so /programs, stop pages, and the map popup all get the
// same feedback. The role="status" region stays mounted permanently — screen
// readers only announce changes inside a pre-existing live region.

import { Link, useLocation } from 'react-router-dom'
import { useTripAddNotice } from '../trip/addFeedback'

export default function TripAddNotice() {
  const notice = useTripAddNotice()
  const { pathname } = useLocation()
  // On /trip the agenda itself reflects the add; a bar would be noise.
  // Save/remove notices still show there — favorites are not on the agenda.
  const onTrip = pathname === '/trip' || pathname.startsWith('/trip/')
  const suppressed = notice?.kind === 'trip-add' && onTrip

  return (
    <div role="status">
      {notice && !suppressed && (
        <div className="trip-add-notice" key={notice.ts}>
          {notice.kind === 'trip-add' ? (
            <>
              <span>
                Added to trip: <strong>{notice.title}</strong>
              </span>
              <Link to="/trip">View plan →</Link>
            </>
          ) : (
            <span>
              {notice.kind === 'saved' ? 'Saved' : 'Removed'}:{' '}
              <strong>{notice.title}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
