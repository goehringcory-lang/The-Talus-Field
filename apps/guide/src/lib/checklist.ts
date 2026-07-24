// Checklist check-off state. One flat id→true map under tfg.checklist shared
// by every list (ids are globally unique by the prefixing convention in
// content/schema.ts), so helpers that act on one list take that list's ids
// explicitly and touch nothing else.

const STORAGE_KEY = 'tfg.checklist'

export type CheckedMap = Record<string, true>

export function readChecked(): CheckedMap {
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

export function writeChecked(map: CheckedMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* storage full or denied — check-off just won't persist */
  }
}

/** Untick only the given ids (one list's own items), leaving other lists as they were. */
export function resetList(ids: string[]): CheckedMap {
  const next = { ...readChecked() }
  for (const id of ids) delete next[id]
  writeChecked(next)
  return next
}

/** Progress of one list against the shared checked map. */
export function listProgress(items: { id: string }[]): { done: number; total: number } {
  const checked = readChecked()
  return { done: items.filter((i) => checked[i.id]).length, total: items.length }
}

export const CHECKLIST_STORAGE_KEY = STORAGE_KEY
