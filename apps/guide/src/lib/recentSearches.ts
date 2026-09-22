// The last few searches a reader followed to a result, newest first, in
// `tfg.search.recent`. A query is recorded when a result is opened, not per
// keystroke, so the list holds questions that got an answer rather than the
// half-typed prefixes on the way to one. Storage failures degrade to an
// in-memory list for the life of the tab, the viewMode rule.

const STORAGE_KEY = 'tfg.search.recent'
const MAX = 6

let mem: string[] | null = null

function readStorage(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((q): q is string => typeof q === 'string').slice(0, MAX) : []
  } catch {
    return []
  }
}

export function readRecentSearches(): string[] {
  if (mem === null) mem = readStorage()
  return mem
}

function write(next: string[]) {
  mem = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* non-fatal: the list just won't outlive this tab */
  }
}

export function recordSearch(query: string): void {
  const q = query.trim().replace(/\s+/g, ' ')
  if (q.length < 2) return
  const lower = q.toLowerCase()
  write([q, ...readRecentSearches().filter((x) => x.toLowerCase() !== lower)].slice(0, MAX))
}

export function clearRecentSearches(): void {
  write([])
}
