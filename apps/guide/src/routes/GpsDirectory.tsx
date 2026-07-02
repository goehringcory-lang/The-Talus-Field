// =============================================================================
// /essentials/gps-directory — every landmark as a scannable coordinate list.
//
// A reference page, not a guide page: name, selectable lat/lng, what the pin
// marks, seasonal caveat, Directions deeplink, and a jump to the map pin.
// Content is bundled (landmarks.ts), so the whole directory works offline;
// only the Directions deeplink needs the user's offline Google Maps area.
// The essentials.ts stub entry with the same id gives this page its row on
// the Essentials index and its search hit; the static route wins over
// /essentials/:topicId at navigation time.
// =============================================================================

import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { LANDMARK_AREAS, landmarksByArea } from '../content'
import { directionsUrl } from '../map/kinds'
import './GpsDirectory.css'

// Landmarks store [lng, lat] (GeoJSON order); people read "lat, lng".
function displayCoord([lng, lat]: [number, number]): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

export default function GpsDirectory() {
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <p style={{ marginBottom: 24 }}>
          <Link
            to="/essentials"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Know before you go
          </Link>
        </p>

        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>GPS directory</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 12 }}>
          Every major destination in the park, one list. Coordinates read latitude, longitude;
          tap one to select it, or use Directions to hand off to your Maps app. Pins marked
          "approximate" still need a ground-truth pass; trust signs over the decimal for those.
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)', marginBottom: 32 }}>
          The whole directory works offline. Directions need the Google Maps offline area from
          the <Link to="/essentials/before-you-go">night-before checklist</Link>.
        </p>

        {LANDMARK_AREAS.map((area) => {
          const rows = landmarksByArea(area.id)
          if (rows.length === 0) return null
          return (
            <section key={area.id} aria-label={area.label} className="gps-area">
              <h2 className="gps-area__title">{area.label}</h2>
              {rows.map((lm) => (
                <div className="gps-row" key={lm.id}>
                  <div className="gps-row__main">
                    <h3 className="gps-row__name">{lm.name}</h3>
                    <code className="gps-row__coord">{displayCoord(lm.coord)}</code>
                  </div>
                  <p className="gps-row__note">
                    {lm.note}
                    {lm.seasonal && <em> {lm.seasonal}</em>}
                  </p>
                  <p className="gps-row__meta">
                    <span>
                      {lm.pointsAt === 'parking' ? 'Pin marks parking' : 'Pin marks the feature'}
                      {!lm.verified && ' · approximate'}
                    </span>
                    <a href={directionsUrl(lm.coord)} target="_blank" rel="noopener noreferrer">
                      Directions →
                    </a>
                    <Link to={`/map?landmark=${lm.id}`}>View on map →</Link>
                  </p>
                </div>
              ))}
            </section>
          )
        })}

        <p style={{ marginTop: 40, fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Coordinates compiled from National Park Service pages, Library of Congress survey
          records, and USGS-derived sources, mid-2026. Roads and lots change; verify anything
          critical against current NPS information.
        </p>
      </main>
    </GatedChrome>
  )
}
