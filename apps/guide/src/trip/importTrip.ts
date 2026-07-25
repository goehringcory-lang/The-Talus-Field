// =============================================================================
// Editorial → guide trip hand-off.
//
// The editorial map at thetalusfieldjournal.com/map lets a reader build a trip
// out of points.geojson pins and share it as /map?trip=id1,id2. Before this,
// buying the guide meant rebuilding that trip from nothing: the two apps sit on
// different origins, so localStorage carries nothing across. This module is the
// bridge — /trip?import=id1,id2 resolves editorial pin ids into planner items.
//
// The two catalogs are related but not identical. points.geojson was seeded
// once from the guide's stops (scripts/seed-points-from-stops.mjs), so most
// ids match outright, and several editorial pins match a HIKE id rather than a
// stop id. The rest are either the same place under a different id (the table
// below) or pins the guide simply does not carry — food stands, a lodge, a
// picnic area. Those are reported, never guessed at: dropping someone at the
// wrong turnout is the failure mode this whole product exists to avoid.
//
// Resolution order for each incoming id: alias table, then stop, then hike.
// Stop wins over hike on a tie (ids like `taft-point` exist as both, and the
// stop is the fuller read).
// =============================================================================

import { getHikeById, getStopById } from '../content'

// Editorial pin id → guide entry id, for the same place under another name.
// Every target is checked against the bundled catalogs in dev (see below).
const EDITORIAL_ALIASES: Record<string, string> = {
  ahwahnee: 'ahwahnee-hotel',
  'sentinel-bridge-south': 'sentinel-bridge-sunset',
  'cascade-picnic-area': 'foresta-cascades',
  'curry-village-trailhead-parking': 'curry-village',
  'curry-village-pizza-deck': 'curry-village-pizza',
  'chilnualna-falls-trailhead': 'chilnualna-falls',
  'pioneer-history-center': 'wawona-hotel-history-center',
  'swinging-bridge-wawona': 'wawona-swinging-bridge',
  'lookout-point-hetch-hetchy': 'lookout-point',
}

// Editorial pins with no guide counterpart. Naming them beats a bare count:
// "2 pins aren't in the guide" reads like a bug, "Degnan's Deli and Yosemite
// Lodge aren't in the guide" reads like the truth. Anything not listed here
// falls back to its raw id, which is still better than silence.
const EDITORIAL_ONLY_LABELS: Record<string, string> = {
  'el-capitan-bridge': 'El Capitan Bridge',
  'church-bowl-indian-creek': 'Church Bowl & Indian Creek Trail',
  'muirs-glacial-erratic': "Muir's Glacial Erratic",
  'housekeeping-camp-swimming': 'Housekeeping Camp Swimming',
  'yosemite-lodge': 'Yosemite Lodge',
  'the-fen': 'The Fen',
  'degnans-deli': "Degnan's Deli",
}

const ID_RE = /^[a-z0-9-]{1,60}$/
// The editorial map caps a shared trip well below this; the ceiling is here so
// a hand-typed URL can't push a few thousand ids through the resolver.
const MAX_IMPORT_IDS = 40

export type ImportResolution = {
  stopIds: string[]
  hikeIds: string[]
  /** Editorial pins the guide doesn't carry, as display labels. */
  unmatched: string[]
}

/** Parse a raw `?import=` value: split, validate, dedupe, cap. */
export function parseImportParam(raw: string | null): string[] {
  if (!raw) return []
  const seen = new Set<string>()
  for (const part of raw.split(',')) {
    const id = part.trim().toLowerCase()
    if (!ID_RE.test(id)) continue
    seen.add(id)
    if (seen.size >= MAX_IMPORT_IDS) break
  }
  return [...seen]
}

/**
 * Map editorial pin ids onto guide content. Ids that resolve to nothing come
 * back in `unmatched` rather than being dropped, so the import can say what it
 * couldn't bring across.
 */
export function resolveEditorialIds(ids: string[]): ImportResolution {
  const stopIds: string[] = []
  const hikeIds: string[] = []
  const unmatched: string[] = []

  for (const incoming of ids) {
    const id = EDITORIAL_ALIASES[incoming] ?? incoming
    if (getStopById(id)) stopIds.push(id)
    else if (getHikeById(id)) hikeIds.push(id)
    else unmatched.push(EDITORIAL_ONLY_LABELS[incoming] ?? incoming)
  }

  return { stopIds, hikeIds, unmatched }
}

/** Sentence for the post-import notice, or null when nothing came across. */
export function importSummary(result: ImportResolution): string | null {
  const added = result.stopIds.length + result.hikeIds.length
  if (added === 0 && result.unmatched.length === 0) return null
  const parts: string[] = []
  if (added > 0) {
    parts.push(`Added ${added} ${added === 1 ? 'stop' : 'stops'} from your map.`)
  }
  if (result.unmatched.length > 0) {
    // Truncated lists join with plain commas before the "and N more" tail:
    // running joinList over the first three produces "A, B, and C and 4 more".
    const list =
      result.unmatched.length <= 3
        ? joinList(result.unmatched)
        : `${result.unmatched.slice(0, 3).join(', ')}, and ${result.unmatched.length - 3} more`
    parts.push(
      `${list} ${result.unmatched.length === 1 ? "isn't" : "aren't"} in the guide, so ${
        result.unmatched.length === 1 ? 'it' : 'they'
      } didn't come across.`,
    )
  }
  return parts.join(' ')
}

function joinList(items: string[]): string {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

// --- Pending import --------------------------------------------------------
//
// The import has to survive more than a login bounce. RequireAuth keeps the
// query string in its `from` state, so an existing buyer signing in gets their
// trip back for free. A reader who does not own the guide yet leaves the app
// entirely — editorial buy box, Stripe, purchase email — and returns through
// /open?token=, which knows nothing about a trip they built twenty minutes
// ago. So the ids are stashed the moment they first arrive, signed in or not,
// and Home offers them once the buyer is through the door.

const PENDING_KEY = 'tfg.trip.pendingImport'
// Long enough to cover buy → email → install, short enough that a trip built
// last season doesn't ambush someone planning the next one.
const PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1000

type PendingImport = { ids: string[]; at: number }

/**
 * Capture `?import=` from the current URL into storage. Called at boot, before
 * the router decides anything, because a signed-out visitor never mounts
 * /trip. Safe to call on every load: no param means no write.
 */
export function stashPendingImportFromUrl(): void {
  try {
    const url = new URL(window.location.href)
    if (url.pathname !== '/trip') return
    const ids = parseImportParam(url.searchParams.get('import'))
    if (ids.length === 0) return
    const record: PendingImport = { ids, at: Date.now() }
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(record))
  } catch {
    /* storage-denied browsers just lose the hand-off across the purchase */
  }
}

/** Pending ids without consuming them (Home's offer card). */
export function peekPendingImport(): string[] {
  try {
    const raw = window.localStorage.getItem(PENDING_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return []
    const { ids, at } = parsed as Partial<PendingImport>
    if (!Array.isArray(ids) || typeof at !== 'number') return []
    if (Date.now() - at > PENDING_TTL_MS) {
      clearPendingImport()
      return []
    }
    return ids.filter((id): id is string => typeof id === 'string' && ID_RE.test(id))
  } catch {
    return []
  }
}

export function clearPendingImport(): void {
  try {
    window.localStorage.removeItem(PENDING_KEY)
  } catch {
    /* nothing to do: the TTL check will keep re-clearing harmlessly */
  }
}

// Dev-only guard: an alias whose target was renamed in stops.ts or hikes.ts
// would silently degrade to "not in the guide", which looks like missing
// content rather than a broken table.
if (import.meta.env.DEV) {
  for (const [from, to] of Object.entries(EDITORIAL_ALIASES)) {
    if (!getStopById(to) && !getHikeById(to)) {
      console.error(`importTrip: alias ${from} → ${to} resolves to nothing`)
    }
  }
}
