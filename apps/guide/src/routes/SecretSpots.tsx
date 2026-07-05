import { Link } from 'react-router-dom'
import { SECRET_META, SECRET_SPOTS } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'

export default function SecretSpots() {
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>{SECRET_META.title}</h1>

        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{SECRET_META.teaser}</p>
        {SECRET_SPOTS.map((spot, i) => (
          <div key={spot.id}>
            <StopCard stop={spot} compact={false} />
            {i < SECRET_SPOTS.length - 1 && <hr className="stop-divider" />}
          </div>
        ))}

        <p style={{ marginTop: 56 }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Back to the guide
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
