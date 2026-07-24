// Private per-stop notes. A Record<stopId, string> under tfg.stopNotes,
// same storage discipline as lib/favorites.ts: in-memory copy authoritative,
// persistence best-effort, module subscribers for cross-surface sync. Notes
// never leave the device.

import { useCallback, useEffect, useState } from 'react'

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
