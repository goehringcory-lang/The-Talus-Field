// =============================================================================
// /wildlife — the quick-ID guide: "what did I see?" answered in the field,
// fully offline (bundled content, no photos required; the field marks are
// the identification, which also keeps the page honest where a photo would
// invite guessing). Kind chips filter; safety text renders inline on the
// three species where behavior matters, and the full food-storage law lives
// in the bear-safety essentials topic, linked, not duplicated.
// =============================================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import {
  KIND_LABELS,
  WILDLIFE,
  WildlifeKind,
  type WildlifeKindT,
} from '../content/wildlife'
import './Wildlife.css'

const KINDS = WildlifeKind.options

export default function Wildlife() {
  const [kindFilter, setKindFilter] = useState<WildlifeKindT | null>(null)

  const kinds = KINDS.filter((k) => !kindFilter || k === kindFilter)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Quick ID"
          title="What did I see?"
          intro="The animals, birds, and trees a visitor actually crosses paths with, and the one or two marks that settle each identification. Works offline like the rest of the guide."
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

        {kinds.map((kind) => {
          const entries = WILDLIFE.filter((w) => w.kind === kind)
          if (entries.length === 0) return null
          return (
            <section key={kind} aria-label={KIND_LABELS[kind]} className="page-section">
              <span className="eyebrow">{KIND_LABELS[kind]}</span>
              <ul className="wildlife-list">
                {entries.map((w) => (
                  <li key={w.id} className="wildlife-entry">
                    <p className="wildlife-entry__name">
                      {w.name} <span className="wildlife-entry__latin">{w.latin}</span>
                    </p>
                    <p className="wildlife-entry__line">
                      <strong>Look for:</strong> {w.lookFor}
                    </p>
                    <p className="wildlife-entry__line">
                      <strong>Where:</strong> {w.whereWhen}
                    </p>
                    <p className="wildlife-entry__line">{w.note}</p>
                    {w.safety && <p className="wildlife-entry__safety">{w.safety}</p>}
                  </li>
                ))}
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
