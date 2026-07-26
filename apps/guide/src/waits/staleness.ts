// Entrance waits swing on a 15-minute scale, so the policy is far tighter
// than weather's and has no warn band: either the reading is fresh enough to
// show (with an "as of" stamp once it is past STAMP_AFTER_MS), or it is old
// enough that presenting it as current misleads, and the line renders
// nothing. This is also why useWaits keeps no offline cache.
export const STAMP_AFTER_MS = 10 * 60 * 1000
export const HIDE_AFTER_MS = 60 * 60 * 1000
