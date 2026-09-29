import { describe, expect, it } from 'vitest'
import { gateHighway, gateName, waitWord } from './waitWord'

describe('waitWord', () => {
  it('reads the design frame: 4 short, 8 moderate, 32 long', () => {
    expect(waitWord(4)).toBe('Short')
    expect(waitWord(8)).toBe('Moderate')
    expect(waitWord(32)).toBe('Long')
  })
  it('puts the edges where the front page has always drawn them', () => {
    expect(waitWord(0)).toBe('Short')
    expect(waitWord(5)).toBe('Short')
    expect(waitWord(6)).toBe('Moderate')
    expect(waitWord(29)).toBe('Moderate')
    expect(waitWord(30)).toBe('Long')
  })
})

describe('gateName and gateHighway', () => {
  it('trims the trailing word Entrance', () => {
    expect(gateName('South Entrance')).toBe('South')
    expect(gateName('Arch Rock Entrance Station')).toBe('Arch Rock')
    expect(gateName('Big Oak Flat')).toBe('Big Oak Flat')
    expect(gateName('Entrance')).toBe('Entrance')
  })
  it('names the highway for the known gates and nothing for the rest', () => {
    expect(gateHighway('Arch Rock Entrance')).toBe('Hwy 140')
    expect(gateHighway('South Entrance')).toBe('Hwy 41')
    expect(gateHighway('Big Oak Flat Entrance')).toBe('Hwy 120')
    expect(gateHighway('Somewhere Else')).toBeNull()
  })
})
