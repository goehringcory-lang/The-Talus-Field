// "Updated 3 hours ago" phrasing for a sync/publish timestamp. Shared by the
// trip calendar sheet and the Account calendar card so both read the same.
export function relativeStamp(iso: string): string {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60_000)
  if (minutes < 2) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
}

// The short form for an instrument readout's provenance line: "just now",
// "14 min ago", "3 h ago". Takes `now` so a render can pass one clock to every
// cell and stay pure; past a day it names the date, since a reading that old
// should have been hidden by its own staleness rule first.
export function compactStamp(iso: string, now: number): string | null {
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return null
  const minutes = Math.max(0, Math.round((now - then) / 60_000))
  if (minutes < 2) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(then).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
