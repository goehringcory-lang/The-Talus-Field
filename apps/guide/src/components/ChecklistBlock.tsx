import { useEffect, useState } from 'react'
import type { EssentialTopicT } from '../content'
import {
  CHECKLIST_STORAGE_KEY,
  readChecked,
  resetList,
  writeChecked,
  type CheckedMap,
} from '../lib/checklist'

type Props = {
  items: NonNullable<EssentialTopicT['checklist']>
  /** Count verb: 'packed' for the packing lists, 'done' for everything else
   *  (before-you-go and safety-and-help are checklists, not packing lists). */
  verb?: 'packed' | 'done'
}

export default function ChecklistBlock({ items, verb = 'packed' }: Props) {
  const [checked, setChecked] = useState<CheckedMap>(readChecked)

  // Stay in sync if another tab checks something off.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CHECKLIST_STORAGE_KEY) setChecked(readChecked())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Read storage, not the mount-time snapshot: the map is shared by every
  // list, so a copy of `prev` would write over what another list on the same
  // page ticked since (the pattern lib/sightings.ts and resetList use).
  function toggle(id: string) {
    const next = { ...readChecked() }
    if (next[id]) delete next[id]
    else next[id] = true
    writeChecked(next)
    setChecked(next)
  }

  const done = items.filter((i) => checked[i.id]).length

  return (
    <section className="checklist" aria-label="Checklist">
      <div className="checklist__count dateline">
        {done} of {items.length} {verb}
        {done > 0 && (
          <>
            {' · '}
            <button
              type="button"
              className="checklist__reset"
              onClick={() => setChecked(resetList(items.map((i) => i.id)))}
            >
              Reset this list
            </button>
          </>
        )}
      </div>
      <ul className="checklist__list">
        {items.map((item, i) => (
          <li key={item.id}>
            {item.group && item.group !== items[i - 1]?.group && (
              <div className="eyebrow" style={{ margin: '18px 0 6px' }}>{item.group}</div>
            )}
            <label className="checklist__row">
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
              />
              <span className={checked[item.id] ? 'checklist__label checklist__label--done' : 'checklist__label'}>
                {item.label}
                {item.season && <span className="checklist__season">{item.season}</span>}
                {item.note && (
                  <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                    {item.note}
                  </span>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
