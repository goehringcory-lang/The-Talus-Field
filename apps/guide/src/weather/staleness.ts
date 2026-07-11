// Shared staleness policy for every weather surface. Past WARN the UI says the
// forecast is old; past HIDE a stale forecast presented as current is worse
// than none, so surfaces render nothing. One module so Home's per-card
// forecasts and the region-page strip can never drift apart.
export const WARN_AFTER_MS = 12 * 60 * 60 * 1000
export const HIDE_AFTER_MS = 48 * 60 * 60 * 1000
