// Pairing the NPS lot feed to the guide's parking pins by name. The feed
// names lots the way the park's traffic team does, the pins the way a reader
// asks; the rule is normalize both and match on a prefix either way, with one
// hand alias for the pin the name rule cannot reach. No coordinate ever moves.
import { describe, expect, it } from 'vitest'
import { AMENITIES } from '../content'
import type { AmenityT } from '../content'
import { LOT_STATUS_LABEL, lotForAmenity, normalizeLotName } from './lotMatch'
import type { ParkingLotT } from './schema'

const lot = (name: string, status: ParkingLotT['status'] = 'full'): ParkingLotT => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  capacity: null,
  ada: null,
  status,
  statusText: status === 'full' ? 'Full' : null,
  updatedAt: null,
  lat: 37.7,
  lng: -119.6,
})
const amenity = (id: string): AmenityT => {
  const a = AMENITIES.find((x) => x.id === id)
  if (!a) throw new Error(`amenity ${id} is gone from content/amenities.ts`)
  return a
}

describe('normalizeLotName', () => {
  it('drops case, parentheticals and the parking words', () => {
    expect(normalizeLotName('Yosemite Village Parking Lot (Day Use)')).toBe('yosemite village')
    expect(normalizeLotName('Curry Village day-use parking')).toBe('curry village')
    expect(normalizeLotName('Curry Village (Orchard)')).toBe('curry village')
  })
})

describe('lotForAmenity', () => {
  it('matches a pin to its lot by prefix in either direction', () => {
    const lots = [lot('Yosemite Village'), lot('Curry Village (Orchard)'), lot('Yosemite Falls')]
    expect(lotForAmenity(amenity('curry-village-day-use-lot'), lots)?.name).toBe('Curry Village (Orchard)')
    expect(lotForAmenity(amenity('yosemite-village-day-use-lot'), lots)?.name).toBe('Yosemite Village')
    expect(lotForAmenity(amenity('yosemite-falls-lot'), lots)?.name).toBe('Yosemite Falls')
  })

  it('reaches the dam lot through its alias, which the name rule would miss', () => {
    const dam = amenity('hetch-hetchy-dam-lot')
    const lots = [lot('Hetch Hetchy Reservoir'), lot('Yosemite Village')]
    expect(lotForAmenity(dam, lots)?.name).toBe('Hetch Hetchy Reservoir')
    // Without the alias the reservoir name does not start the pin's name or
    // vice versa; that is the whole reason the alias exists.
    expect(normalizeLotName(dam.name).startsWith('hetch hetchy reservoir')).toBe(false)
  })

  it('prints nothing for a pin the feed has no lot for', () => {
    const valleyOnly = [lot('Yosemite Village'), lot('Curry Village (Orchard)')]
    expect(lotForAmenity(amenity('tuolumne-meadows-lots'), valleyOnly)).toBeNull()
    expect(lotForAmenity(amenity('curry-village-day-use-lot'), [])).toBeNull()
    const camp = AMENITIES.find((a) => a.kind === 'camping')!
    expect(lotForAmenity(camp, [lot(camp.name)])).toBeNull()
  })

  it('never copies the lot coordinate onto the pin', () => {
    const pin = amenity('curry-village-day-use-lot')
    const before = JSON.stringify(pin)
    lotForAmenity(pin, [lot('Curry Village (Orchard)')])
    expect(JSON.stringify(pin)).toBe(before)
  })

  it('labels every status the schema allows', () => {
    expect(Object.keys(LOT_STATUS_LABEL).sort()).toEqual(['closed', 'full', 'open', 'unknown'])
  })
})
