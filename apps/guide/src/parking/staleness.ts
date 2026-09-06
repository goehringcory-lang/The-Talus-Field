// Same policy as waits/staleness.ts, for the same reason: a lot status swings
// on the scale of an hour on a busy Saturday, so either the reading is fresh
// enough to show (stamped once it is past STAMP_AFTER_MS) or it is old enough
// that presenting it as current sends a car to a full lot, and the surface
// renders nothing. useParking keeps no offline cache for the same reason.
export const STAMP_AFTER_MS = 10 * 60 * 1000
export const HIDE_AFTER_MS = 60 * 60 * 1000
