// The newest edition note a reader has seen (`tfg.whatsnew.seen`, a date).
// A first launch marks the newest entry seen, so a new buyer never meets a
// wall of history; after that, Home offers each new entry once.

import { useState } from 'react'
import { CHANGELOG } from '../content/changelog'

const KEY = 'tfg.whatsnew.seen'

function readSeen(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function writeSeen(date: string): void {
  try {
    localStorage.setItem(KEY, date)
  } catch {
    /* non-fatal: the note may show again */
  }
}

/** The newest entry when it has not been seen, else null. Call once per
 *  mount; a first launch records the newest date and shows nothing. */
export function useWhatsNew(): { entry: (typeof CHANGELOG)[number] | null; dismiss: () => void } {
  const newest = CHANGELOG[0]
  const [entry, setEntry] = useState(() => {
    if (!newest) return null
    const seen = readSeen()
    if (seen === null) {
      writeSeen(newest.date)
      return null
    }
    return seen < newest.date ? newest : null
  })
  return {
    entry,
    dismiss: () => {
      if (newest) writeSeen(newest.date)
      setEntry(null)
    },
  }
}
