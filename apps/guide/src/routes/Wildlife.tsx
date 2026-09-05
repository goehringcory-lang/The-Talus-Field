// =============================================================================
// /wildlife — the quick-ID guide: "what did I see?" answered in the field,
// fully offline (bundled content; the photos ride their own download pack,
// offline/manifest.ts). Each entry opens on one identification plate, and the
// field marks under it are still the identification: the photo shows what the
// text names, it does not replace it. Kind chips filter; safety text renders
// inline on the three species where behavior matters, and the full
// food-storage law lives in the bear-safety essentials topic, linked, not
// duplicated.
//
// Each entry carries a "Seen it" check: the life list. State rides the shared
// tfg.checklist map via lib/sightings.ts and rolls up on /log, which is where
// the count line points once anything is marked.
// =============================================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import Plate from '../components/Plate'
import ResponsivePhoto from '../components/ResponsivePhoto'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import {
  KIND_LABELS,
  WILDLIFE,
  WildlifeKind,
  type WildlifeKindT,
} from '../content/wildlife'
import { useSightings } from '../lib/sightings'
import './Wildlife.css'

const KINDS = WildlifeKind.options

export default function Wildlife() {
  const [kindFilter, setKindFilter] = useState<WildlifeKindT | null>(null)
  const { ids: loggedIds, toggle, isLogged } = useSightings()

  const kinds = KINDS.filter((k) => !kindFilter || k === kindFilter)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Quick ID"
          title="What did I see?"
          intro="The animals, birds, and trees a visitor actually crosses paths with, and the one or two marks that settle each identification. Check off what you see; the guide keeps your trip list. Works offline like the rest of the guide."
        />

        <div className="hikes-chips" role="group" aria-label="Filter by kind">
          {KINDS.map((k) => (
            <ChipButton
              key={k}
              variant="filter"
              pressed={kindFilter === k}
              onClick={() => setKindFilter(kindFilter === k ? null : k)}
            >
              {KIND_LABELS[k]}
            </ChipButton>
          ))}
        </div>

        {/* Silent at zero: an empty life list is the normal state on the
            drive in, and advertising it would only read as a scold. */}
        {loggedIds.length > 0 && (
          <p className="dateline" style={{ marginTop: 4 }}>
            {loggedIds.length} of {WILDLIFE.length} logged ·{' '}
            <Link to="/log">your field log →</Link>
          </p>
        )}

        {kinds.map((kind) => {
          const entries = WILDLIFE.filter((w) => w.kind === kind)
          if (entries.length === 0) return null
          return (
            <section key={kind} aria-label={KIND_LABELS[kind]} className="page-section">
              <span className="eyebrow">{KIND_LABELS[kind]}</span>
              <ul className="wildlife-list">
                {entries.map((w) => {
                  const logged = isLogged(w.id)
                  const credit = w.photo ? PHOTO_CREDITS[w.photo.src] : undefined
                  return (
                    <li key={w.id} className="wildlife-entry">
                      {w.photo && (
                        <Plate
                          className="wildlife-entry__plate"
                          tag={`Plate · ${w.name}`}
                          credit={credit ? formatCredit(credit) : undefined}
                        >
                          <ResponsivePhoto
                            className="wildlife-entry__photo"
                            src={w.photo.src}
                            alt={w.photo.alt}
                            sizes="(max-width: 720px) 100vw, 640px"
                            width={1200}
                            height={800}
                            style={{ aspectRatio: '3 / 2', objectFit: 'cover' }}
                          />
                        </Plate>
                      )}
                      <div className="wildlife-entry__head">
                        <p className="wildlife-entry__name">
                          {w.name} <span className="wildlife-entry__latin">{w.latin}</span>
                        </p>
                        <label className={logged ? 'sighting-toggle is-logged' : 'sighting-toggle'}>
                          <input
                            type="checkbox"
                            checked={logged}
                            onChange={() => toggle(w.id)}
                            aria-label={`Mark ${w.name} as seen`}
                          />
                          {logged ? 'Logged' : 'Seen it'}
                        </label>
                      </div>
                      <p className="wildlife-entry__line">
                        <strong>Look for:</strong> {w.lookFor}
                      </p>
                      <p className="wildlife-entry__line">
                        <strong>Where:</strong> {w.whereWhen}
                      </p>
                      <p className="wildlife-entry__line">{w.note}</p>
                      {w.safety && <p className="wildlife-entry__safety">{w.safety}</p>}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

        <div className="home-crosslinks">
          <Link to="/essentials/bear-safety" className="more-link">
            The bear rules in full: food storage is the law →
          </Link>
          <Link to="/essentials/bear-viewing" className="more-link">
            Where to actually see a bear →
          </Link>
          <Link to="/essentials/safety-and-help" className="more-link">
            Signal, the clinic, and the plan before you lose both →
          </Link>
        </div>
      </main>
    </GatedChrome>
  )
}
