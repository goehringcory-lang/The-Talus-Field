import { describe, expect, it } from 'vitest'
import { search, tokenVariants } from './index'

describe('tokenVariants', () => {
  it('tries the singular for a plural', () => {
    expect(tokenVariants('falls')).toEqual(['falls', 'fall'])
    expect(tokenVariants('lilies')).toContain('lily')
  })
  it('leaves short words and double-s words alone', () => {
    expect(tokenVariants('gas')).toEqual(['gas'])
    expect(tokenVariants('pass')).toEqual(['pass'])
  })
})

describe('search', () => {
  it('finds a singular-named fall from a plural query', () => {
    const hits = search('vernal falls')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.some((h) => /vernal/i.test(h.title))).toBe(true)
  })
  it('lands wildlife and dining hits on their own entry', () => {
    const bear = search('black bear').find((h) => h.section === 'Wildlife')
    expect(bear?.url).toMatch(/^\/wildlife#/)
    const dining = search('pizza').find((h) => h.section === 'Dining')
    if (dining) expect(dining.url).toMatch(/^\/dining#/)
  })
})

describe('SEARCH_SUGGESTIONS', () => {
  it('every suggested query returns something', async () => {
    const { SEARCH_SUGGESTIONS } = await import('./index')
    for (const q of SEARCH_SUGGESTIONS) expect(search(q).length, q).toBeGreaterThan(0)
  })
})
