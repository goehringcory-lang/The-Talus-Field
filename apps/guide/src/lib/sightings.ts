// The wildlife life list: which quick-ID entries the buyer has marked as
// seen. State rides the shared tfg.checklist map (lib/checklist.ts) under
// `wildlife-` prefixed keys, the same convention the find-it hunts use with
// `hunt-`, so one storage key keeps carrying every check-off in the guide
// and the two lists cannot collide (no content id starts with `wildlife-`).
//
// Like the hunts and unlike visited stops, sightings stay on this device:
// tfg.checklist is not part of the cross-device sync document, and widening
// that document's shape would break the intact-only salvage rule in
// sync/schema.ts for every already-shipped build. The log page says so.

import { useCallback, useEffect, useState } from 'react'
import { WILDLIFE } from '../content/wildlife'
import { CHECKLIST_STORAGE_KEY, readChecked, writeChecked } from './checklist'

const KEY_PREFIX = 'wildlife-'

// Cross-surface refresh within this tab (the wildlife page and the log can
// both be behind the same session); writes from other modules to the shared
// map only touch their own prefixes, so they never leave these surfaces stale.
const subscribers = new Set<() => void>()

function sightingKey(entryId: string): string {
  return KEY_PREFIX + entryId
}

/** Ids of wildlife entries marked seen, in the quick-ID guide's own order. */
export function readSightingIds(): string[] {
  const checked = readChecked()
  return WILDLIFE.filter((w) => checked[sightingKey(w.id)]).map((w) => w.id)
}

export function useSightings() {
  const [ids, setIds] = useState<string[]>(readSightingIds)

  useEffect(() => {
    const refresh = () => setIds(readSightingIds())
    subscribers.add(refresh)
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHECKLIST_STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subscribers.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback((entryId: string) => {
    const next = { ...readChecked() }
    const key = sightingKey(entryId)
    if (next[key]) delete next[key]
    else next[key] = true
    writeChecked(next)
    for (const fn of subscribers) fn()
  }, [])

  const isLogged = useCallback((entryId: string) => ids.includes(entryId), [ids])

  return { ids, toggle, isLogged }
}
