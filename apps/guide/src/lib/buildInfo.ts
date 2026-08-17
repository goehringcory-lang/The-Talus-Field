// The build stamp, injected into index.html by vite.config.ts.
//
// Read from a meta tag rather than `import.meta.env`, and that is load-bearing:
// a date `define`d into the bundle lands in hashed chunks, so the stamp ticking
// over to a new day changes their content hashes, changes the service worker's
// asset list, and ships every installed copy a forced update for a build that
// contains no changes. index.html is unhashed, so a stamp that moves there
// costs nothing. See the comment block at the top of vite.config.ts.
function readBuildDate(): string {
  if (typeof document === 'undefined') return 'dev'
  const meta = document.querySelector<HTMLMetaElement>('meta[name="tfg-build-date"]')
  return meta?.content || 'dev'
}

/**
 * The date the guide was last revised: the last commit that changed
 * `apps/guide`, not the day CI happened to run. Read once — the tag is in the
 * document head and never changes after parse.
 */
export const BUILD_DATE = readBuildDate()
