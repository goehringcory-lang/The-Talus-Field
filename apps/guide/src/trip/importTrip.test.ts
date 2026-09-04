// The editorial → guide trip bridge. The promise is "report what could not
// come across rather than guess", and the alias table is the one place a
// content rename silently breaks that promise (scripts/check-trip-bridge.mjs
// checks the same table from the editorial side).
import { describe, expect, it } from 'vitest'
import { importSummary, parseImportParam, resolveEditorialIds } from './importTrip'
import { getHikeById, getStopById } from '../content'

describe('parseImportParam', () => {
  it('splits, trims, lowercases and dedupes', () => {
    expect(parseImportParam(' Tunnel-View, taft-point ,tunnel-view')).toEqual([
      'tunnel-view',
      'taft-point',
    ])
  })

  it('drops ids that are not plain slugs', () => {
    expect(parseImportParam('tunnel-view,<script>,../etc,a b')).toEqual(['tunnel-view'])
  })

  it('returns nothing for a missing or empty param', () => {
    expect(parseImportParam(null)).toEqual([])
    expect(parseImportParam('')).toEqual([])
  })

  it('caps a hand-typed URL at 40 ids', () => {
    const many = Array.from({ length: 100 }, (_, i) => `pin-${i}`).join(',')
    expect(parseImportParam(many)).toHaveLength(40)
  })
})

describe('resolveEditorialIds', () => {
  it('resolves stops, hikes and aliases, and names what it could not', () => {
    const result = resolveEditorialIds([
      'tunnel-view', // a stop under its own id
      'valley-loop-trail', // a hike under its own id
      'ahwahnee', // editorial alias for the ahwahnee-hotel stop
      'degnans-deli', // declared editorial-only, carries a label
      'not-a-real-pin', // undeclared: falls back to the raw id
    ])
    expect(result.stopIds).toEqual(['tunnel-view', 'ahwahnee-hotel'])
    expect(result.hikeIds).toEqual(['valley-loop-trail'])
    expect(result.unmatched).toEqual(["Degnan's Deli", 'not-a-real-pin'])
  })

  it('prefers the stop when an id exists as both a stop and a hike', () => {
    expect(getStopById('taft-point')).toBeTruthy()
    expect(getHikeById('taft-point')).toBeTruthy()
    const result = resolveEditorialIds(['taft-point'])
    expect(result.stopIds).toEqual(['taft-point'])
    expect(result.hikeIds).toEqual([])
  })

  it('every alias target still exists in the guide', () => {
    // Exercised through the public resolver: an alias whose target was renamed
    // would land in `unmatched`, which reads to a buyer as missing content.
    const aliases = [
      'ahwahnee',
      'sentinel-bridge-south',
      'cascade-picnic-area',
      'curry-village-trailhead-parking',
      'curry-village-pizza-deck',
      'chilnualna-falls-trailhead',
      'pioneer-history-center',
      'swinging-bridge-wawona',
      'lookout-point-hetch-hetchy',
    ]
    expect(resolveEditorialIds(aliases).unmatched).toEqual([])
  })
})

describe('importSummary', () => {
  it('is silent when nothing was asked for', () => {
    expect(importSummary({ stopIds: [], hikeIds: [], unmatched: [] })).toBeNull()
  })

  it('counts stops and hikes together as entries', () => {
    expect(importSummary({ stopIds: ['a'], hikeIds: ['b'], unmatched: [] })).toBe(
      'Added 2 entries from your map.',
    )
    expect(importSummary({ stopIds: ['a'], hikeIds: [], unmatched: [] })).toBe(
      'Added 1 entry from your map.',
    )
  })

  it('names the misses, and truncates past three', () => {
    expect(importSummary({ stopIds: [], hikeIds: [], unmatched: ['The Fen'] })).toBe(
      "The Fen isn't in the guide, so it didn't come across.",
    )
    expect(
      importSummary({ stopIds: ['a'], hikeIds: [], unmatched: ['A', 'B', 'C', 'D', 'E'] }),
    ).toBe("Added 1 entry from your map. A, B, C, and 2 more aren't in the guide, so they didn't come across.")
  })
})
