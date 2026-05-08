import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthGate'
import { TripEnum, getDayCount, getStopsByTrip, type Trip } from '../content'
import GatedChrome from '../components/GatedChrome'
import TripPickerCard from '../components/TripPickerCard'
import UpdatedStamp from '../components/UpdatedStamp'

const TRIP_META: Record<Trip, { title: string; teaser: string }> = {
  '1day': {
    title: 'One day',
    teaser: 'Arrival, the Valley loop, and one short hike. The trip if you only have today.',
  },
  '3day': {
    title: 'Three days',
    teaser: 'The most common Yosemite visit. Valley, Glacier Point, and a flex day for whatever the park throws.',
  },
  '5day': {
    title: 'Five days',
    teaser: 'The trip that actually shows you what the park is. High country and the unhurried mornings.',
  },
}

export default function Home() {
  const { session } = useAuth()
  const trips = TripEnum.options

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>How long is your trip?</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Pick the plan that matches your visit. You can read the others for variations and swaps.
        </p>

        <div style={{ display: 'grid', gap: 18 }}>
          {trips.map((trip) => {
            const meta = TRIP_META[trip]
            return (
              <TripPickerCard
                key={trip}
                trip={trip}
                title={meta.title}
                teaser={meta.teaser}
                dayCount={getDayCount(trip)}
                stopCount={getStopsByTrip(trip).length}
              />
            )
          })}
        </div>

        <UpdatedStamp />

        <p style={{ marginTop: 32, color: 'var(--ink-3)', fontSize: 13 }}>
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
