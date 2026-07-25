// Private per-stop notes. A Record<stopId, string> under tfg.stopNotes,
// same storage discipline as lib/favorites.ts: in-memory copy authoritative,
// persistence best-effort, module subscribers for cross-surface sync.
//
// Private means private to the buyer, not to the device: with cross-device
// sync on (sync/planSync.ts, off by default) notes ride along to the buyer's
// own account so the phone in the park has what the laptop wrote. They are
// never shared, never rendered on a public surface, and never leave the
// account. The sync opt-in on /account says so in as many words.

import { useCallback, useEffect, useState } from 'react'
import { markLocalChange } from './syncStamp'

const STORAGE_KEY = 'tfg.stopNotes'
const subscribers = new Set<() => void>()

type NotesMap = Record<string, string>

let memNotes: NotesMap | null = null

function readStorage(): NotesMap | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const out: NotesMap = {}
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string' && v) out[k] = v
      }
      return out
    }
  } catch {
    /* unreadable storage reads as no notes */
  }
  return null
}

function read(): NotesMap {
  if (memNotes === null) memNotes = readStorage() ?? {}
  return memNotes
}

function write(notes: NotesMap) {
  memNotes = notes
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    /* non-fatal: the note just won't persist past this session */
  }
  // See lib/favorites.ts: the stamp is how sync orders two devices.
  markLocalChange()
  for (const fn of subscribers) fn()
}

export function useStopNote(stopId: string): [string, (note: string) => void] {
  const [note, setNoteState] = useState<string>(() => read()[stopId] ?? '')

  useEffect(() => {
    const refresh = () => setNoteState(read()[stopId] ?? '')
    refresh()
    subscribers.add(refresh)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        memNotes = readStorage() ?? {}
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subscribers.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [stopId])

  const setNote = useCallback(
    (value: string) => {
      const next = { ...read() }
      // Empty notes drop from the map so storage never accumulates blanks.
      if (value) next[stopId] = value
      else delete next[stopId]
      write(next)
    },
    [stopId],
  )

  return [note, setNote]
}

// --- Non-React surface, for the cross-device sync layer ---------------------

export function readStopNotes(): NotesMap {
  return read()
}

/** Replace wholesale (a sync pull). Notifies every mounted surface. */
export function replaceStopNotes(notes: NotesMap): void {
  write(notes)
}

export function subscribeStopNotes(fn: () => void): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}
