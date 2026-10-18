// The storefront's internal links, read off the same server render the
// prerender step writes to dist/. Every teaser in the sitemap has to be
// reachable from /preview as a real <a href>, and no unlisted Secret Guide
// entry may be; until October 2026 only the sample stops were linked at all.
import { describe, expect, it } from 'vitest'
import { getSecretGuideEntries } from '../content'
import { render } from '../prerender/entry'
import { adjacentIndexedStops, indexedStops, isIndexableStop, publicPages } from './publicPages'

const stopHrefs = (html: string): string[] =>
  [...html.matchAll(/href="\/stop\/([^"#?]+)"/g)].map((m) => m[1])

describe('the storefront link graph', () => {
  it('lists exactly the sitemap teasers, in the same order', () => {
    const sitemapStops = publicPages()
      .map((p) => p.path)
      .filter((p) => p.startsWith('/stop/'))
    expect(indexedStops().map((s) => `/stop/${s.id}`)).toEqual(sitemapStops)
  })

  it('/preview links every indexed stop and no unlisted Secret Guide entry', () => {
    const linked = new Set(stopHrefs(render('/preview')))
    for (const stop of indexedStops()) expect(linked, stop.id).toContain(stop.id)
    const unlisted = getSecretGuideEntries().filter((s) => !isIndexableStop(s))
    expect(unlisted.length).toBeGreaterThan(0)
    for (const stop of unlisted) expect(linked, stop.id).not.toContain(stop.id)
  })

  it('a teaser links back to /preview and to its neighbours in reading order', () => {
    const order = indexedStops()
    const middle = order[Math.floor(order.length / 2)]
    const { prev, next } = adjacentIndexedStops(middle.id)
    expect(prev && next).toBeTruthy()
    const html = render(`/stop/${middle.id}`)
    expect(html).toContain('href="/preview"')
    expect(stopHrefs(html)).toEqual(expect.arrayContaining([prev!.id, next!.id]))
  })

  it('an unlisted Secret Guide teaser carries no pager into the chain', () => {
    const unlisted = getSecretGuideEntries().find((s) => !isIndexableStop(s))!
    expect(adjacentIndexedStops(unlisted.id)).toEqual({})
    expect(stopHrefs(render(`/stop/${unlisted.id}`))).toEqual([])
  })
})
