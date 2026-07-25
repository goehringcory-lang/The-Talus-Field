// =============================================================================
// Local-change clock for the collections that have no stamp of their own.
//
// The trip plan carries its own `updatedAt`, so it can be compared against a
// server copy directly. Saved stops, visited stops, and private notes are bare
// arrays and maps — nothing in them says when they last changed, and without
// that the sync layer has no way to tell "this device is ahead" from "this
// device is behind". This module is that missing clock: one timestamp, bumped
// by every write to those three stores.
//
// Deliberately dependency-free so favorites/visited/stopNotes can import it
// without a cycle back through the sync layer that reads them.
// =============================================================================

const STORAGE_KEY = 'tfg.sync.localAt'

// In-memory copy is authoritative within the session, same discipline as the
// stores it stamps: a failed setItem must not make this session look older
// than it is and hand a stale server copy the win.
let memStamp: number | null = null

// While a pull is being applied, the writes below are the server's data coming
// in, not the user's edits going out. Stamping them would leave the device
// looking newer than the copy it just accepted and push it straight back.
let applying = false

function readStorage(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

function read(): number {
  if (memStamp === null) memStamp = readStorage()
  return memStamp
}

function write(ms: number): void {
  memStamp = ms
  try {
    window.localStorage.setItem(STORAGE_KEY, String(ms))
  } catch {
    /* non-fatal: the stamp just won't survive this session */
  }
}

/** Called from every favorites / visited / notes write. */
export function markLocalChange(): void {
  if (applying) return
  write(Date.now())
}

/** ISO stamp of the last local change to the unstamped stores. */
export function readLocalStamp(): string {
  return new Date(read()).toISOString()
}

/** Adopt a server document's stamp after applying it. */
export function setLocalStamp(iso: string): void {
  const ms = Date.parse(iso)
  write(Number.isNaN(ms) ? Date.now() : ms)
}

/** Run a pull's local writes without stamping them as user edits. */
export function withRemoteApply<T>(fn: () => T): T {
  applying = true
  try {
    return fn()
  } finally {
    applying = false
  }
}
