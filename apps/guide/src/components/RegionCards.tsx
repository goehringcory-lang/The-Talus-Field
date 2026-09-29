// The front page's "Where to go": the four regions as photo cards, two to a
// row, each one line long, and the Secret Guide as the plate that closes the
// set (the home redesign, September 2026). A region card opens the region
// itself; planning a day there starts from the trip card above or from the
// region page. The plate is the paid half of the product made visible: a
// count read live from the guide, the five sections the reader can open, and
// the one button.
//
// Nothing here is date-derived, and no card reads the reader's plan.

import { Link } from 'react-router-dom'
import {
  REGIONS,
  SECRET_GUIDE_CATEGORIES,
  SECRET_NUMERALS,
  getSecretGuideEntries,
  getStopById,
  type Region,
} from '../content'
import ResponsivePhoto from './ResponsivePhoto'
import './PlanCards.css'

// The Secret Guide plate's photo: Yosemite Falls upside down in the Merced,
// one of the entries, so the plate shows what the section is.
const SECRET_PHOTO_STOP = 'swinging-bridge-reflection'

// What each region card says, as facts the region pages already publish: the
// name as a reader says it, and one line on what the place is.
const REGION_TILE: Record<Region, { name: string; line: string }> = {
  valley: { name: 'Yosemite Valley', line: 'Tunnel View to the Mist Trail' },
  'glacier-mariposa': { name: 'Glacier Point and Mariposa Grove', line: 'Rim views and giant sequoias' },
  tuolumne: { name: 'Tuolumne Meadows', line: 'High country, Tioga Road' },
  'hetch-hetchy': { name: 'Hetch Hetchy', line: 'Open year-round, nearly empty' },
}

function Chevron() {
  return (
    <svg className="secret-plate__go" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

function SecretPlate() {
  const count = getSecretGuideEntries().length
  const photo = getStopById(SECRET_PHOTO_STOP)?.photos[0]?.src

  return (
    <section className="secret-plate" aria-labelledby="secret-plate-title">
      {photo && (
        <div className="secret-plate__media">
          <ResponsivePhoto
            src={photo}
            alt=""
            loading="lazy"
            width={800}
            height={352}
            sizes="(max-width: 760px) 100vw, 740px"
          />
          <span className="secret-plate__scrim" aria-hidden="true" />
          <span className="secret-plate__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path d="M8 11V8a4 4 0 0 1 7.5-2" />
            </svg>
            Unlocked with your guide
          </span>
          <span className="secret-plate__count">
            <span className="secret-plate__figure">{count}</span>
            <span className="secret-plate__cap">
              Secret spots
              <br />
              only in this guide
            </span>
          </span>
        </div>
      )}
      <div className="secret-plate__body">
        <h3 className="secret-plate__title" id="secret-plate-title">
          The Secret Guide
        </h3>
        <p className="secret-plate__lede">
          The pullouts, overlooks and after-dark spots the signs skip and the crowds never find. Written up for guide
          owners, and nowhere else.
        </p>
        <ol className="secret-plate__toc">
          {SECRET_GUIDE_CATEGORIES.map((c, i) => (
            <li key={c.id}>
              <Link className="secret-plate__row" to={`/secret-guide?cat=${c.id}`}>
                <span className="secret-plate__numeral" aria-hidden="true">
                  {SECRET_NUMERALS[i] ?? i + 1}
                </span>
                <span className="secret-plate__section">{c.title}</span>
                <Chevron />
              </Link>
            </li>
          ))}
        </ol>
        <p className="secret-plate__promises">Pinned on the map · Works offline · Drops into your plan</p>
        <Link className="secret-plate__cta" to="/secret-guide">
          Open the Secret Guide
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default function RegionCards() {
  return (
    <section aria-labelledby="plan-regions-title" className="home-section region-cards" id="plan-regions">
      <span className="home-section__eyebrow">Four regions</span>
      <h2 className="home-section__title" id="plan-regions-title">
        Where to go
      </h2>

      <div className="region-cards__grid">
        {REGIONS.map((r) => (
          <Link key={r.id} className="region-tile" to={`/region/${r.id}`}>
            <span className="region-tile__media">
              <ResponsivePhoto
                src={r.photo.src}
                alt=""
                loading="lazy"
                width={400}
                height={225}
                sizes="(max-width: 760px) 50vw, 370px"
              />
            </span>
            <span className="region-tile__body">
              <span className="region-tile__name">{REGION_TILE[r.id].name}</span>
              <span className="region-tile__line">{REGION_TILE[r.id].line}</span>
            </span>
          </Link>
        ))}
      </div>

      <SecretPlate />
    </section>
  )
}
