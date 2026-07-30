// Shared staleness policy for every alerts surface. Past WARN the UI says the
// alert list is old; past HIDE a stale closure board presented as current is
// worse than none, so surfaces render nothing. One module so Today's board
// and any Home summary can never drift apart.
//
// Looser than weather's window on purpose: a cached closure list is exactly
// what a reader wants mid-drive with no signal, so it is worth holding onto
// longer before the risk of showing a reopened road as still closed wins out.
export const WARN_AFTER_MS = 6 * 60 * 60 * 1000
export const HIDE_AFTER_MS = 48 * 60 * 60 * 1000
