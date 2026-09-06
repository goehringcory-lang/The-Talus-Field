// The one sentence a row and the detail page print about the last check.
// Honest about the three states: never checked, checked (with its age), or
// the reason the last check could not answer.

import { relativeStamp } from '../utils/relativeStamp'
import type { WatchT } from './schema'

// The sweep runs every five minutes; past this it has been failing or
// backing off, and the age turns gold.
const STALE_MS = 30 * 60_000

export function checkedLine(watch: WatchT): { text: string; warn: boolean } {
  if (watch.lastError) return { text: watch.lastError, warn: true }
  if (!watch.lastCheckedAt) {
    return { text: 'Not checked yet; the first check lands within five minutes.', warn: false }
  }
  const age = Date.now() - Date.parse(watch.lastCheckedAt)
  return { text: `Checked ${relativeStamp(watch.lastCheckedAt)}`, warn: age > STALE_MS }
}
