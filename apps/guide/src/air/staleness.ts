// Shared staleness policy for every air quality surface. Past WARN the UI
// says the reading is old; past HIDE a stale AQI presented as current is
// worse than none, so surfaces render nothing.
//
// Tighter than weather's window on purpose: smoke swings on an hours scale,
// so a day-old AQI is actively misleading. The reading is still cached (see
// air/cache.ts) so a morning number survives a canyon dead zone into midday,
// but it will not survive into the next day.
export const WARN_AFTER_MS = 3 * 60 * 60 * 1000
export const HIDE_AFTER_MS = 24 * 60 * 60 * 1000
