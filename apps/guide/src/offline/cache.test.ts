import { afterEach, describe, expect, it, vi } from 'vitest'
import { canCompletePack, fetchPackFile, verifyCachedPack } from './cache'
import type { Pack } from './manifest'

const tile = 'https://api.example/dem/v1/12/1/2.webp'
function pack(urls: string[], tolerateMissing = 0): Pack {
  return { id: 'test', label: 'Test', detail: '', cacheName: 'test', urls, approxBytes: 0, tolerateMissing }
}
function cache(entries = new Map<string, Response>()) {
  return {
    match: vi.fn(async (url: string) => entries.get(url)?.clone()),
    put: vi.fn(async (url: string, response: Response) => { entries.set(url, response.clone()) }),
  } as unknown as Cache
}
const asset = () => new Response('bytes', { headers: { 'content-type': 'image/webp' } })
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('offline pack integrity', () => {
  it('finds an evicted file between the old verification sample points', async () => {
    const urls = Array.from({ length: 80 }, (_, i) => `/test-assets/${i}.webp`)
    const entries = new Map(urls.map((url) => [url, asset()]))
    entries.delete(urls[1])
    expect(await verifyCachedPack(cache(entries), pack(urls), new Set())).toBe(false)
  })
  it('rejects cached HTML and does not accept legacy tolerated road-data failures', async () => {
    expect(await verifyCachedPack(cache(new Map([['/photo.webp', new Response('<html>', {
      headers: { 'content-type': 'text/html' },
    })]])), pack(['/photo.webp']), new Set())).toBe(false)
    expect(await verifyCachedPack(cache(), pack(['/map/roads-abc.json'], 1), new Set(['/map/roads-abc.json']))).toBe(false)
  })
  it('allows only confirmed absent elevation tiles, within the pack allowance', () => {
    const p = pack(Array.from({ length: 50 }, (_, i) => i ? `/test-assets/${i}` : tile), 0.02)
    expect(canCompletePack(p, [tile], new Set([tile]))).toBe(true)
    expect(canCompletePack(p, [tile], new Set())).toBe(false)
    expect(canCompletePack(p, ['/map-assets/fonts/font.pbf'], new Set(['/map-assets/fonts/font.pbf']))).toBe(false)
    expect(canCompletePack(pack([tile]), [tile], new Set([tile]))).toBe(false)
  })
  it('verifies intact packs and their permitted edge omissions', async () => {
    const p = pack([tile, '/map/roads-abc.json'], 0.5)
    expect(await verifyCachedPack(cache(new Map([['/map/roads-abc.json', asset()]])), p, new Set([tile]))).toBe(true)
  })
})

describe('offline file transfers', () => {
  it('repairs poisoned HTML instead of treating it as a cache hit', async () => {
    const c = cache(new Map([[tile, new Response('<html>', { headers: { 'content-type': 'text/html' } })]]))
    const fetch = vi.fn(async () => asset())
    vi.stubGlobal('fetch', fetch)
    expect(await fetchPackFile(c, tile, new AbortController().signal)).toBe('cached')
    expect(fetch).toHaveBeenCalledOnce()
    expect(c.put).toHaveBeenCalledOnce()
  })
  it('distinguishes edge 404s from server errors and missing essential files', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 404 })))
    expect(await fetchPackFile(cache(), tile, new AbortController().signal)).toBe('absent')
    expect(await fetchPackFile(cache(), '/map/roads-abc.json', new AbortController().signal)).toBe('failed')
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })))
    expect(await fetchPackFile(cache(), tile, new AbortController().signal)).toBe('failed')
  })
  it('ends a stalled transfer and lets the caller retry', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url, { signal }: { signal: AbortSignal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    const result = fetchPackFile(cache(), tile, new AbortController().signal)
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' })
    await vi.advanceTimersByTimeAsync(60_000)
    await assertion
    expect(vi.getTimerCount()).toBe(0)
  })
  it('cancels immediately rather than waiting for the file deadline', async () => {
    vi.stubGlobal('fetch', vi.fn((_url, { signal }: { signal: AbortSignal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    const controller = new AbortController()
    const result = fetchPackFile(cache(), tile, controller.signal)
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' })
    await Promise.resolve()
    controller.abort()
    await assertion
  })
})
