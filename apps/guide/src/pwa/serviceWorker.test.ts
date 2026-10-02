/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const source = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8')

function worker(fetch: typeof globalThis.fetch, shell?: Response) {
  const handlers: Record<string, (event: unknown) => void> = {}
  const cache = { match: vi.fn(async () => shell), put: vi.fn() }
  runInNewContext(source, {
    self: { location: { origin: 'https://guide.example' }, addEventListener: (name: string, handler: (event: unknown) => void) => { handlers[name] = handler } },
    caches: { open: async () => cache }, fetch, URL, Response, AbortController, setTimeout, clearTimeout,
  })
  return async (path: string) => {
    let result: Promise<Response> | undefined
    handlers.fetch({
      request: { method: 'GET', mode: 'navigate', url: `https://guide.example${path}` },
      respondWith: (response: Promise<Response>) => { result = response }, waitUntil: () => {},
    })
    return result!
  }
}

describe('saved guide navigation', () => {
  it.each(['/map', '/trip', '/account'])('reopens %s offline from the saved shell', async (path) => {
    const navigate = worker(vi.fn(async () => { throw new TypeError('Offline') }), new Response('saved app'))
    expect(await (await navigate(path)).text()).toBe('saved app')
  })
  it.each([500, 502, 503, 504])('uses the saved app when the server returns %i', async (status) => {
    const navigate = worker(vi.fn(async () => new Response('outage', { status })), new Response('saved app'))
    expect(await (await navigate('/trip')).text()).toBe('saved app')
  })
  it('keeps real 404s and successful non-HTML documents', async () => {
    for (const status of [200, 404]) {
      const navigate = worker(vi.fn(async () => new Response('document', { status })), new Response('saved app'))
      expect((await navigate('/photo.jpg')).status).toBe(status)
      expect(await (await navigate('/photo.jpg')).text()).toBe('document')
    }
  })
  it('shows the branded offline page when no shell has ever been saved', async () => {
    const navigate = worker(vi.fn(async () => { throw new TypeError('Offline') }))
    const response = await navigate('/trip')
    expect(response.status).toBe(503)
    expect(await response.text()).toContain("this page isn't saved")
  })
})

async function installShell(html: string) {
  const handlers: Record<string, (event: unknown) => void> = {}
  const entries = new Map<string, Response>()
  const shell = {
    match: async (url: string) => entries.get(url)?.clone(),
    put: async (url: string, response: Response) => { entries.set(url, response.clone()) },
  }
  const deleted = vi.fn(async () => true)
  runInNewContext(source.replace('/* __BUILD_ASSETS__ */ []', "['/assets/app-current.js']"), {
    self: { addEventListener: (name: string, handler: (event: unknown) => void) => { handlers[name] = handler } },
    caches: {
      open: async () => shell, delete: deleted,
      // An old cache hit must not validate a new install: activate deletes it.
      match: async () => new Response('old build'),
    },
    fetch: async (url: string) => new Response(url === '/index.html' ? html : 'asset', {
      headers: { 'content-type': url === '/index.html' ? 'text/html' : 'application/javascript' },
    }),
    URL, Response, AbortController, setTimeout, clearTimeout,
  })
  let result: Promise<void> | undefined
  handlers.install({ waitUntil: (promise: Promise<void>) => { result = promise } })
  return { result: result!, deleted }
}

describe('update shell coherence', () => {
  it('rejects a deployment race even if the referenced script exists in an old cache', async () => {
    const { result, deleted } = await installShell('<script src="/assets/app-other.js"></script>')
    await expect(result).rejects.toThrow('HTML and build assets do not match')
    expect(deleted).toHaveBeenCalledWith('tfg-shell-__BUILD_VERSION__')
  })
  it('accepts HTML whose entry script is in the new shell cache', async () => {
    const { result, deleted } = await installShell('<script src="/assets/app-current.js"></script>')
    await expect(result).resolves.toBeUndefined()
    expect(deleted).not.toHaveBeenCalled()
  })
})
