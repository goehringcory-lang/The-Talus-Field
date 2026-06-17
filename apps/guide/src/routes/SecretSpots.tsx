import { Link } from 'react-router-dom'
import { SECRET_META, SECRET_SPOTS, secretsLocked } from '../content'
import GatedChrome from '../components/GatedChrome'
import StopCard from '../components/StopCard'

export default function SecretSpots() {
  const locked = secretsLocked()

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>{SECRET_META.title}</h1>

        {locked ? (
          <div className="secret-locked">
            <svg
              className="secret-locked__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="1" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <p className="secret-locked__teaser">{SECRET_META.teaser}</p>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, maxWidth: '52ch', margin: '0 auto' }}>
              The parking turnouts locals use when the big lots fill, the trailheads
              with no signs from the road, and the insider notes that do not get
              published anywhere else. Each one ships with a verified GPS coordinate.
              This section arrives as a free update later this season; it will appear
              here the day it lands, no re-download, no second charge.
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{SECRET_META.teaser}</p>
            {SECRET_SPOTS.map((spot, i) => (
              <div key={spot.id}>
                <StopCard stop={spot} compact={false} />
                {i < SECRET_SPOTS.length - 1 && <hr className="stop-divider" />}
              </div>
            ))}
          </>
        )}

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
