import { describe, expect, it } from 'vitest'
import { conditionKind } from './conditionKind'

describe('conditionKind', () => {
  it.each([
    ['Sunny', true, 'sunny'],
    ['Clear', true, 'sunny'],
    ['Clear', false, 'clear-night'],
    ['Partly Sunny', true, 'partly'],
    ['Mostly Sunny', true, 'partly'],
    ['Partly Cloudy', false, 'partly'],
    ['Mostly Cloudy', true, 'cloudy'],
    ['Cloudy', false, 'cloudy'],
    ['Chance Rain Showers', true, 'rain'],
    ['Light Snow Likely', false, 'snow'],
    ['Chance Showers And Thunderstorms', true, 'storm'],
    ['Patchy Fog', true, 'fog'],
    ['Areas Of Smoke', true, 'fog'],
    ['Something The NWS Invented', true, 'sunny'],
  ] as const)('%s (day: %s) is %s', (text, day, kind) => {
    expect(conditionKind(text, day)).toBe(kind)
  })

  it('lets precipitation outrank cloud cover', () => {
    expect(conditionKind('Mostly Cloudy then Light Rain', true)).toBe('rain')
    expect(conditionKind('Partly Sunny then Slight Chance Snow Showers', true)).toBe('snow')
  })
})
