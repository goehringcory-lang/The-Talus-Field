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

describe('the tools, the map places, and the deadline rows', () => {
  it('opens with the Help card for "911"', () => {
    expect(search('911')[0]?.url).toBe('/help')
  })
  it('finds the Curry Village showers before the meteor showers', () => {
    const first = search('showers')[0]
    expect(first?.section).toBe('Places on the map')
    expect(first?.url).toBe('/map?place=curry-village-services')
  })
  it('finds a campground by name and all three gas stations', () => {
    expect(search('upper pines').some((h) => h.url === '/map?place=upper-pines-campground')).toBe(true)
    const gas = search('gas station').filter((h) => h.section === 'Places on the map')
    expect(gas.map((h) => h.url).sort()).toEqual(
      ['/map?place=crane-flat-gas', '/map?place=el-portal-gas', '/map?place=wawona-gas'],
    )
  })
  it('lands a deadline row on the board', () => {
    expect(search('half dome lottery').some((h) => h.section === 'Dates that matter' && h.url === '/trip#dates')).toBe(true)
  })
})
