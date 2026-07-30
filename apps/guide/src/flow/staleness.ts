// Shared staleness policy for every river flow surface. Past WARN the UI
// says the reading is old; past HIDE a stale flow band presented as current
// is worse than none, so surfaces render nothing.
//
// The loosest window of the three conditions features on purpose: snowmelt
// flow moves on a days scale, not hours, so a two-day-old band is still an
// honest read once it carries the "old" label.
export const WARN_AFTER_MS = 12 * 60 * 60 * 1000
export const HIDE_AFTER_MS = 72 * 60 * 60 * 1000
