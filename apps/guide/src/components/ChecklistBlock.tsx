import { useEffect, useState } from 'react'
import type { EssentialTopicT } from '../content'

const STORAGE_KEY = 'tfg.checklist'

type CheckedMap = Record<string, true>

function readChecked(): CheckedMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CheckedMap
    }
  } catch {
    /* corrupted or unavailable storage reads as empty */
  }
  return {}
}

function writeChecked(map: CheckedMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* storage full or denied — check-off just won't persist */
  }
}

type Props = {
  items: NonNullable<EssentialTopicT['checklist']>
}

export default function ChecklistBlock({ items }: Props) {
  const [checked, setChecked] = useState<CheckedMap>(readChecked)

  // Stay in sync if another tab checks something off.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setChecked(readChecked())
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

  const done = items.filter((i) => checked[i.id]).length

  return (
    <section className="checklist" aria-label="Packing checklist">
      <div className="checklist__count dateline">
        {done} of {items.length} packed
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
