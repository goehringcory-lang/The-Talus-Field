// The unverified registry is a hand-kept mirror of comments in the three seed
// files, and a mirror that can drift is worse than none: an id missing here
// lets companion mode announce a pullout nobody has stood at. So this test
// re-derives the sets from the sources themselves (imported as text, the way
// check-archive-citations.mjs reads the seeds) and demands equality both ways.
import { describe, expect, it } from 'vitest'
import stopsSrc from '../content/stops.ts?raw'
import spotsSrc from '../content/secret-spots.ts?raw'
import hikesSrc from '../content/hikes.ts?raw'
import { UNVERIFIED_HIKE_IDS, UNVERIFIED_MARK, UNVERIFIED_STOP_IDS } from './unverified'

type SeedEntry = { id: string; coordLine: string | undefined }

// Entries open with a four-space `id: '…',` line; the coord, when present, is
// the first four-space `coord: [` line before the next id. The photo and
// history sub-objects sit deeper, so the indent is what keeps this honest.
function seedEntries(src: string): SeedEntry[] {
  const idRe = /^ {4}id: '([^']+)',$/gm
  const starts: { id: string; at: number }[] = []
  for (let m = idRe.exec(src); m; m = idRe.exec(src)) starts.push({ id: m[1], at: m.index })
  return starts.map((s, i) => {
    const chunk = src.slice(s.at, starts[i + 1]?.at ?? src.length)
    const coordLine = chunk.split('\n').find((line) => /^ {4}coord: \[/.test(line))
    return { id: s.id, coordLine }
  })
}

function coordKey(line: string): string {
  const inner = /coord: \[([^\]]+)\]/.exec(line)?.[1] ?? ''
  return inner.split(',').map((n) => Number(n.trim())).join(',')
}

const stops = seedEntries(stopsSrc)
const spots = seedEntries(spotsSrc)
const hikes = seedEntries(hikesSrc)

const expectedStops = new Set<string>()
const verifiedCoords = new Set<string>()
for (const e of [...stops, ...spots]) {
  if (!e.coordLine) continue
  if (UNVERIFIED_MARK.test(e.coordLine)) expectedStops.add(e.id)
  else verifiedCoords.add(coordKey(e.coordLine))
}

const expectedHikes = new Set<string>()
for (const h of hikes) {
  if (!h.coordLine) continue
  if (UNVERIFIED_MARK.test(h.coordLine) || !verifiedCoords.has(coordKey(h.coordLine))) {
    expectedHikes.add(h.id)
  }
}

describe('the unverified-coordinate registry', () => {
  it('parsed the seed files', () => {
    // A regex that stops matching would make every set empty and pass vacuously.
    expect(stops.length).toBeGreaterThan(50)
    expect(spots.length).toBeGreaterThan(5)
    expect(hikes.length).toBeGreaterThan(40)
    expect(expectedStops.size).toBeGreaterThan(0)
  })

  it('lists exactly the stops and secret spots whose coord line carries the mark', () => {
    expect([...UNVERIFIED_STOP_IDS].sort()).toEqual([...expectedStops].sort())
  })

  it('lists exactly the hikes whose pin is marked or is not a verified stop pin', () => {
    expect([...UNVERIFIED_HIKE_IDS].sort()).toEqual([...expectedHikes].sort())
  })

  it('matches every spelling of the mark the seed files use', () => {
    expect(UNVERIFIED_MARK.test('// TODO: verify on the ground')).toBe(true)
    expect(UNVERIFIED_MARK.test('// TODO verify on the ground')).toBe(true)
    expect(UNVERIFIED_MARK.test('// TODO: verify (Happy Isles bridge)')).toBe(true)
    expect(UNVERIFIED_MARK.test('// verified 2026-07: NPS place page')).toBe(false)
  })
})
