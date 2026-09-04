// The Help card prints a position for somebody to read to a dispatcher, and a
// wrong digit there is the one error in the guide with no second chance. The
// fixtures are the park's own coordinates (the Valley weather spot that
// sun/solar.ts uses), checked by hand against the degrees-minutes conversion.
import { describe, expect, it } from 'vitest'
import {
  decimalDegrees,
  degreesMinutes,
  feetLabel,
  nearbyLabel,
  nearestPlaces,
  positionMessage,
} from './position'

const VALLEY: [number, number] = [-119.5936, 37.7456]

describe('coordinate formats', () => {
  it('prints decimal degrees latitude first at five places', () => {
    expect(decimalDegrees(VALLEY)).toBe('37.74560, -119.59360')
  })

  it('converts to degrees and decimal minutes with hemisphere letters', () => {
    // 0.7456° × 60 = 44.736′; 0.5936° × 60 = 35.616′.
    expect(degreesMinutes(VALLEY)).toBe('37° 44.736′ N, 119° 35.616′ W')
  })

  it('carries a minute that rounds to sixty into the degree', () => {
    // 37.999999° is 37° 59.99994′, which rounds to 60.000′ at three places.
    expect(degreesMinutes([-120.0000001, 37.999999])).toBe('38° 0.000′ N, 120° 0.000′ W')
  })

  it('labels the southern and eastern hemispheres', () => {
    expect(degreesMinutes([151.2, -33.87])).toBe('33° 52.200′ S, 151° 12.000′ E')
  })

  it('rounds meters to whole feet', () => {
    expect(feetLabel(1200)).toBe('3,937 ft')
    expect(feetLabel(9.1)).toBe('30 ft')
  })
})

describe('nearest places', () => {
  const places = [
    { id: 'a', title: 'Olmsted Point', coord: [-119.4854, 37.8108] as [number, number] },
    { id: 'b', title: 'Tenaya Lake', coord: [-119.4652, 37.8302] as [number, number] },
    { id: 'c', title: 'Tunnel View', coord: [-119.6773, 37.7156] as [number, number] },
  ]

  it('sorts by distance and reports the bearing from the place to the fix', () => {
    // A fix a little north-east of Olmsted Point.
    const fix: [number, number] = [-119.482, 37.8135]
    const [first, second] = nearestPlaces(fix, places, 2)
    expect(first.place.id).toBe('a')
    expect(second.place.id).toBe('b')
    expect(first.miles).toBeLessThan(0.5)
    expect(['NE', 'ENE', 'NNE']).toContain(first.cardinal)
    expect(nearbyLabel(first)).toMatch(/^0\.\d mi (NE|ENE|NNE) of Olmsted Point$/)
  })

  it('folds two entries that share a pullout into one place', () => {
    const twin = { id: 'a2', title: 'Olmsted Point at night', coord: [-119.4855, 37.8108] as [number, number] }
    const fix: [number, number] = [-119.482, 37.8135]
    const near = nearestPlaces(fix, [...places, twin], 3)
    expect(near.map((n) => n.place.id)).toEqual(['a', 'b', 'c'])
  })

  it('says "at" when the fix sits on the place', () => {
    const [n] = nearestPlaces(places[2].coord, places, 1)
    expect(nearbyLabel(n)).toBe('at Tunnel View')
  })

  it('composes the share message with a maps link', () => {
    const [nearest] = nearestPlaces([-119.482, 37.8135], places, 1)
    const msg = positionMessage({
      coord: [-119.482, 37.8135],
      accuracyM: 10,
      altitudeM: 2530,
      nearest,
    })
    expect(msg).toContain('My position: 37.81350, -119.48200 (±33 ft)')
    expect(msg).toContain('elevation about 8,301 ft')
    expect(msg).toContain('of Olmsted Point')
    expect(msg.endsWith('https://maps.google.com/?q=37.81350,-119.48200')).toBe(true)
  })

  it('omits the elevation and the landmark when the fix has neither', () => {
    const msg = positionMessage({ coord: VALLEY, accuracyM: 5, altitudeM: null, nearest: null })
    expect(msg).toBe(
      'My position: 37.74560, -119.59360 (±16 ft). Yosemite National Park. https://maps.google.com/?q=37.74560,-119.59360',
    )
  })
})
