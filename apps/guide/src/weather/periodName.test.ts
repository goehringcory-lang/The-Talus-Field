import { describe, expect, it } from 'vitest'
import { shortPeriodName } from './periodName'

describe('shortPeriodName', () => {
  it.each([
    ['Monday', 'Mon'],
    ['Monday Night', 'Mon night'],
    ['Tuesday', 'Tue'],
    ['Wednesday Night', 'Wed night'],
    ['Thursday', 'Thu'],
    ['Saturday', 'Sat'],
    ['Sunday', 'Sun'],
    ['Tonight', 'Tonight'],
    ['Today', 'Today'],
    ['This Afternoon', 'This Afternoon'],
    ['Overnight', 'Overnight'],
  ])('%s -> %s', (from, to) => {
    expect(shortPeriodName(from)).toBe(to)
  })
})
