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
