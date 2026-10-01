# Offline reliability audit — October 1, 2026

The audit covered the paid guide's local session, saved trip, download packs,
service worker installation and cached navigation. No customer account, payment,
or production deployment was changed.

## Repairs

- Check every file in a completed pack, rather than eight sample points.
  Missing files, cached HTML and unreadable storage require a re-download.
- Limit tolerated omissions to confirmed 404 elevation tiles, within the existing
  map allowance. Connection failures, storage failures, server errors, glyphs and
  road/trail data cannot produce a completed pack.
- Repair HTML cached under an asset URL instead of accepting it as downloaded.
- Give each file transfer a 60-second deadline, preserving cancellation and the
  existing retry pass. Saved files remain available to resume a partial download.
- Share an in-flight pack's actual outcome. A map area waits for its overview;
  an evicted overview is repaired even if its old completion flag remains.
- Clear previous completion when repairing a pack, and protect shared files and
  prerequisite packs while downloads are running.
- Open the saved app shell on navigation HTTP 5xx responses.
- Reject a worker installation whose HTML references chunks absent from its own
  shell cache. An old cache cannot validate an update because activation deletes it.

## Verification

- 320 Vitest tests pass, including 25 new download and service worker regressions.
- Production build/typecheck, ESLint and build determinism pass.
- Repository publishing guards and the offline health battery pass.
- Headless Chromium, 390 × 844 viewport, production build served with static
  headers: downloaded trail tracks, wildlife photos and the park map overview;
  disabled networking; reopened `/trip`, `/wildlife`, `/help`, `/map` and
  `/account`. The saved custom trip item survived, and the overview map rendered
  terrain and pins at zoom 10. No page or React error-boundary errors occurred.
- Deleted a cached track and reloaded Account offline: the track pack changed to
  “Needs re-download” and its persisted completion was cleared.

The browser check used a local test session and blocked account API requests.
HTTP outages and mismatched-build installation were verified with deterministic
service worker tests. Physical iOS/Android storage eviction, installed-app
lifecycle and slow mobile networks still need device testing. Vite preview adds
`Vary: Origin`, so a plain static server matching production headers is needed
for an accurate offline browser check.
