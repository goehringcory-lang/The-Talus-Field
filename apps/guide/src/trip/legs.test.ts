import { describe, expect, it } from 'vitest'
import { driveMinutesBetween, itemCoord, legMode } from './slotting'
import { amenityPlaceId } from './places'
import { stopItemId, type TravelModeT, type TripItemT } from './schema'

const DAY = '2026-06-21'
const lot = (id: string, travelMode?: TravelModeT): TripItemT => ({
  type: 'custom',
  itemId: `custom:${id}`,
  title: id,
  day: DAY,
  placeId: amenityPlaceId(id),
  travelMode,
})
const stop = (stopId: string, travelMode?: TravelModeT): TripItemT => ({
  type: 'stop',
  itemId: stopItemId(stopId, DAY),
  stopId,
  day: DAY,
  travelMode,
})

describe('legs between trip items', () => {
  it('reads a linked place its coordinate from the record', () => {
    expect(itemCoord(lot('shuttle-stop-16'))).toEqual([-119.559797, 37.732421])
  })

  it('infers a walk for a hop inside one parking area and a drive otherwise', () => {
    expect(legMode(lot('shuttle-stop-14'), lot('shuttle-stop-19'))).toBe('walk')
    expect(legMode(lot('shuttle-stop-7'), lot('shuttle-stop-16'))).toBe('drive')
  })

  it('takes the mode the reader set over the inference', () => {
    expect(legMode(lot('shuttle-stop-7', 'shuttle'), lot('shuttle-stop-16'))).toBe('shuttle')
  })

  it('prices an unset leg exactly as the drive it always was', () => {
    const unset = driveMinutesBetween(lot('shuttle-stop-7'), lot('shuttle-stop-16'))
    const drive = driveMinutesBetween(lot('shuttle-stop-7', 'drive'), lot('shuttle-stop-16'))
    expect(unset).toBe(drive)
  })

  it('prices a walk by distance at a walking pace, slower than the drive', () => {
    const walk = driveMinutesBetween(lot('shuttle-stop-7', 'walk'), lot('shuttle-stop-16'))!
    const drive = driveMinutesBetween(lot('shuttle-stop-7'), lot('shuttle-stop-16'))!
    // Lodge to Happy Isles is ~2.5 straight miles: over an hour on foot.
    expect(walk).toBeGreaterThan(60)
    expect(walk).toBeGreaterThan(drive)
  })

  it('prices a shuttle leg as ride plus walk plus wait, and falls back to the drive out of reach', () => {
    const ride = driveMinutesBetween(lot('shuttle-stop-7', 'shuttle'), lot('shuttle-stop-16'))!
    expect(ride).toBeGreaterThanOrEqual(50) // 8 stops at 5 min, plus the 10-minute wait
    const glacier = stop('glacier-point')
    const outOfReach = driveMinutesBetween(lot('shuttle-stop-7', 'shuttle'), glacier)
    expect(outOfReach).toBe(driveMinutesBetween(lot('shuttle-stop-7'), glacier))
  })
})
