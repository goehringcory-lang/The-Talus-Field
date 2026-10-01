import type { Pack } from './manifest'

const FILE_TIMEOUT_MS = 60_000

function isAsset(response: Response): boolean {
  return response.ok && !response.headers.get('content-type')?.includes('text/html')
}

// Only absent elevation tiles at the archive edge are optional. Missing
// glyphs, road data, network failures and server errors never qualify.
export function isOptionalTile(url: string): boolean {
  return /^\/dem\/[a-z0-9-]+\/\d+\/\d+\/\d+\.webp$/.test(new URL(url, 'https://guide.invalid').pathname)
}

export function canCompletePack(pack: Pack, failedUrls: string[], absentTiles: Set<string>): boolean {
  return failedUrls.length <= pack.urls.length * pack.tolerateMissing &&
    failedUrls.every((url) => isOptionalTile(url) && absentTiles.has(url))
}

/** Check every URL, with bounded work even for large map packs. */
export async function verifyCachedPack(cache: Cache, pack: Pack, missing: Set<string>): Promise<boolean> {
  const skipped = pack.urls.filter((url) => missing.has(url))
  if (!canCompletePack(pack, skipped, missing)) return false
  let next = 0
  let valid = true
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (valid && next < pack.urls.length) {
      const url = pack.urls[next++]
      if (missing.has(url)) continue
      const response = await cache.match(url)
      if (!response || !isAsset(response)) valid = false
    }
  }))
  return valid
}

/** Abort a stalled file independently of the pack; keep Cancel working. */
export async function fetchPackFile(
  cache: Cache,
  url: string,
  signal: AbortSignal,
): Promise<'cached' | 'absent' | 'failed'> {
  const cached = await cache.match(url)
  if (cached && isAsset(cached)) return 'cached'
  signal.throwIfAborted()
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(abort, FILE_TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (response.status === 404 && isOptionalTile(url)) return 'absent'
    if (!isAsset(response)) return 'failed'
    await cache.put(url, response)
    return 'cached'
  } finally {
    clearTimeout(timer)
    signal.removeEventListener('abort', abort)
  }
}
