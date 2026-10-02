// Exercise the download orchestration independently of rendering. React hooks
// are identities here; real fetch/cache behavior is covered by cache.test.ts.
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import type { Pack } from './manifest'

const mocks = vi.hoisted(() => ({ packs: [] as Pack[] }))
vi.mock('react', () => ({
  useCallback: (fn: unknown) => fn,
  useMemo: (fn: () => unknown) => fn(),
  useState: (initial: unknown) => [typeof initial === 'function' ? initial() : initial, () => {}],
  useEffect: () => {},
}))
vi.mock('./manifest', () => ({ buildPacks: () => mocks.packs }))
vi.mock('../utils/photo', () => ({ detectPhotoFormat: async () => 'jpg' }))

const overview: Pack = {
  id: 'overview', label: 'Overview', detail: '', cacheName: 'tiles', urls: ['/map/roads-abc.json'], approxBytes: 1, tolerateMissing: 0,
}
const area: Pack = { ...overview, id: 'area', urls: ['/area.webp'], requires: 'overview' }

beforeEach(() => {
  vi.resetModules()
  mocks.packs = [overview, area]
  const storage = new Map<string, string>()
  vi.stubGlobal('window', { caches: {}, localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value) },
  } })
  vi.stubGlobal('navigator', {})
  const entries = new Map<string, Response>()
  vi.stubGlobal('caches', { open: async () => ({
    match: async (url: string) => entries.get(url)?.clone(),
    put: async (url: string, response: Response) => { entries.set(url, response.clone()) },
  }) })
})
afterEach(() => vi.unstubAllGlobals())

describe('download orchestration', () => {
  it('waits for an in-flight overview and shares it across callers', async () => {
    let finish!: (value: Response) => void
    const fetch = vi.fn((url: string) => url === overview.urls[0]
      ? new Promise<Response>((resolve) => { finish = resolve })
      : Promise.resolve(new Response('area')))
    vi.stubGlobal('fetch', fetch)
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    const downloads = useDownloads()
    const first = downloads.download(overview)
    const second = downloads.download(overview)
    const dependent = downloads.download(area)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    expect(isPackCompleted('area')).toBe(false)
    finish(new Response('roads'))
    expect(await Promise.all([first, second, dependent])).toEqual(['done', 'done', 'done'])
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(isPackCompleted('area')).toBe(true)
  })
  it('does not download an area if the in-flight overview fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })))
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    const downloads = useDownloads()
    expect(await Promise.all([downloads.download(overview), downloads.download(area)])).toEqual(['error', 'error'])
    expect(fetch).toHaveBeenCalledTimes(2) // overview's first pass and retry only
    expect(isPackCompleted('area')).toBe(false)
  })
  it('resumes partial downloads without refetching saved files', async () => {
    const p = { ...overview, id: 'photos', urls: ['/one.webp', '/two.webp'] }
    mocks.packs = [p]
    let failSecond = true
    const fetch = vi.fn(async (url: string) => new Response('file', { status: url === '/two.webp' && failSecond ? 503 : 200 }))
    vi.stubGlobal('fetch', fetch)
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    const downloads = useDownloads()
    expect(await downloads.download(p)).toBe('error')
    expect(isPackCompleted(p.id)).toBe(false)
    failSecond = false
    expect(await downloads.download(p)).toBe('done')
    expect(fetch.mock.calls.filter(([url]) => url === '/one.webp')).toHaveLength(1)
    expect(isPackCompleted(p.id)).toBe(true)
  })
  it('clears old completion if a repair fails and permits a retry after storage errors', async () => {
    window.localStorage.setItem('tfg.downloads', JSON.stringify({ overview: true }))
    vi.stubGlobal('caches', { open: vi.fn(async () => { throw new Error('Storage refused') }) })
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    const downloads = useDownloads()
    expect(await downloads.download(overview)).toBe('error')
    expect(isPackCompleted('overview')).toBe(false)
    expect(await downloads.download(overview)).toBe('error')
    expect(caches.open).toHaveBeenCalledTimes(2)
  })
  it('repairs an evicted overview even when its old completion flag remains', async () => {
    window.localStorage.setItem('tfg.downloads', JSON.stringify({ overview: true }))
    vi.stubGlobal('fetch', vi.fn(async () => new Response('file')))
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    expect(await useDownloads().download(area)).toBe('done')
    expect(fetch).toHaveBeenCalledWith(overview.urls[0], expect.anything())
    expect(isPackCompleted('overview')).toBe(true)
  })
  it('cancels an in-flight transfer and permits a later retry', async () => {
    const fetch = vi.fn((_url: string, { signal }: { signal: AbortSignal }) => new Promise<Response>((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    }))
    vi.stubGlobal('fetch', fetch)
    const { useDownloads, isPackCompleted } = await import('./useDownloads')
    const downloads = useDownloads()
    const pending = downloads.download(overview)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    downloads.cancel(overview.id)
    expect(await pending).toBe('cancelled')
    expect(isPackCompleted(overview.id)).toBe(false)
    vi.stubGlobal('fetch', vi.fn(async () => new Response('roads')))
    expect(await downloads.download(overview)).toBe('done')
  })

})
