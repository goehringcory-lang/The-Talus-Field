// =============================================================================
// /hunts — the junior naturalist find-it lists, one per region. Check-off
// rides the shared tfg.checklist map (lib/checklist.ts), so a family's
// progress survives a reload and an airplane-mode afternoon like every other
// list in the guide. The print button is the point for a lot of families: a
// paper list in the back seat needs no phone at all, which is the honest
// answer in a park with no cell service.
//
// Nothing here asks a child to touch, collect, feed, or approach anything.
// The hunt is looking.
// =============================================================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import { REGION_SHORT } from '../content'
import { HUNTS, type HuntT } from '../content/hunts'
import {
  CHECKLIST_STORAGE_KEY,
  readChecked,
  resetList,
  writeChecked,
  type CheckedMap,
} from '../lib/checklist'
import type { Region } from '../content/schema'
import './Hunts.css'

function HuntList({
  hunt,
  checked,
  onToggle,
  onReset,
}: {
  hunt: HuntT
  checked: CheckedMap
  onToggle: (id: string) => void
  onReset: (ids: string[]) => void
}) {
  const done = hunt.items.filter((i) => checked[i.id]).length
  const allDone = done === hunt.items.length

  return (
    <section aria-label={hunt.title} className="page-section hunt">
      <span className="eyebrow">{hunt.title}</span>
      <p className="hunt__intro">{hunt.intro}</p>
      <p className="hunt__count dateline">
        {done} of {hunt.items.length} found
        {allDone && ' · the whole list. Ask a ranger about the Junior Ranger booklet.'}
        {done > 0 && (
          <>
            {' · '}
            <button
              type="button"
              className="hunt__reset"
              onClick={() => onReset(hunt.items.map((i) => i.id))}
            >
              start over
            </button>
          </>
        )}
      </p>
      <ul className="hunt__items">
        {hunt.items.map((item) => (
          <li key={item.id} className={checked[item.id] ? 'hunt__item is-found' : 'hunt__item'}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => onToggle(item.id)}
              />
              <span className="hunt__label">{item.label}</span>
            </label>
            {item.note && <p className="hunt__note">{item.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Hunts() {
  const [checked, setChecked] = useState<CheckedMap>(readChecked)
  const [regionFilter, setRegionFilter] = useState<Region | null>(null)

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CHECKLIST_STORAGE_KEY) setChecked(readChecked())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      writeChecked(next)
      return next
    })
  }

  function reset(ids: string[]) {
    setChecked(resetList(ids))
  }

  const shown = HUNTS.filter((h) => !regionFilter || h.region === regionFilter)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page hunts">
        <PageHeader
          eyebrow="For young naturalists"
          title="Find it"
          intro="A looking list for each region: things a child can genuinely spot from the trail or the pullout, not a quiz. Check them off as you go, or print the page and leave the phone in the car."
        />

        <div className="hunts__actions no-print">
          <div className="hikes-chips" role="group" aria-label="Filter by region">
            {HUNTS.map((h) => (
              <ChipButton
                key={h.region}
                variant="filter"
                pressed={regionFilter === h.region}
                onClick={() => setRegionFilter(regionFilter === h.region ? null : h.region)}
              >
                {REGION_SHORT[h.region]}
              </ChipButton>
            ))}
          </div>
          <button type="button" className="btn btn--sm" onClick={() => window.print()}>
            Print these lists
          </button>
        </div>

        {shown.map((hunt) => (
          <HuntList
            key={hunt.region}
            hunt={hunt}
            checked={checked}
            onToggle={toggle}
            onReset={reset}
          />
        ))}

        <div className="home-crosslinks no-print">
          <Link to="/wildlife" className="more-link">
            What did I see? The quick-ID guide →
          </Link>
          <Link to="/essentials/with-kids" className="more-link">
            Yosemite with kids: pace, water, and the badge →
          </Link>
        </div>
      </main>
    </GatedChrome>
  )
}
