import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { REGIONS, getStopsByRegion } from '../content'
import GatedChrome from '../components/GatedChrome'
import RegionPickerCard from '../components/RegionPickerCard'
import UpdatedStamp from '../components/UpdatedStamp'

export default function Home() {
  const { session } = useAuth()

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>Where in the park are you going?</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Pick a region. Each one is a flat list of stops in a suggested order — read them all or just the ones that fit your day.
        </p>

        <div style={{ display: 'grid', gap: 18 }}>
          {REGIONS.map((region) => (
            <RegionPickerCard
              key={region.id}
              region={region.id}
              title={region.title}
              teaser={region.teaser}
              stopCount={getStopsByRegion(region.id).length}
            />
          ))}
        </div>

        <UpdatedStamp />

        <p style={{ marginTop: 32, color: 'var(--ink-3)', fontSize: 13 }}>
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
