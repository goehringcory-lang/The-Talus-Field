import { describe, expect, it } from 'vitest'
import { glueNumbers } from './text'

describe('glueNumbers', () => {
  it('makes the hyphen in a printed phone number non-breaking', () => {
    expect(glueNumbers('park info 209/372-0200, press 1')).toBe('park info 209/372\u20110200, press 1')
    expect(glueNumbers('call 888-413-8869')).toBe('call 888\u2011413\u20118869')
  })

  it('leaves other hyphens and tel: digits alone', () => {
    expect(glueNumbers('a one-way trail, 2026-10-12')).toBe('a one-way trail, 2026-10-12')
    expect(glueNumbers('[call](tel:2093720200)')).toBe('[call](tel:2093720200)')
  })
})
