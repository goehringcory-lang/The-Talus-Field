// The staleness windows of every live feed, in one table. Each feed's
// staleness.ts is a few constants, and the guide's honesty rule (a reading
// past its window renders nothing, never a dash) is only as good as those
// numbers; a typo in one is a wrong road status shown for a day. The air,
// alerts, flow and weather feeds warn then hide; the parking and waits feeds
// stamp then hide, on a fifteen-minute scale, with no offline cache at all.
import { describe, expect, it } from 'vitest'
import * as air from '../air/staleness'
import * as alerts from '../alerts/staleness'
import * as flow from '../flow/staleness'
import * as parking from '../parking/staleness'
import * as waits from '../waits/staleness'
import * as weather from './staleness'

const H = 60 * 60 * 1000
const MIN = 60 * 1000

describe('warn-then-hide feeds', () => {
  it.each([
    ['air', air, 3 * H, 24 * H],
    ['alerts', alerts, 6 * H, 48 * H],
    ['flow', flow, 12 * H, 72 * H],
    ['weather', weather, 12 * H, 48 * H],
  ])('%s warns and hides on its published windows', (_name, mod, warn, hide) => {
    expect(mod.WARN_AFTER_MS).toBe(warn)
    expect(mod.HIDE_AFTER_MS).toBe(hide)
    expect(mod.WARN_AFTER_MS).toBeLessThan(mod.HIDE_AFTER_MS)
  })

  it('orders the hide windows by how fast each thing moves', () => {
    expect(air.HIDE_AFTER_MS).toBeLessThan(weather.HIDE_AFTER_MS)
    expect(weather.HIDE_AFTER_MS).toBe(alerts.HIDE_AFTER_MS)
    expect(alerts.HIDE_AFTER_MS).toBeLessThan(flow.HIDE_AFTER_MS)
  })
})

describe('stamp-then-hide feeds', () => {
  it.each([
    ['parking', parking],
    ['waits', waits],
  ])('%s stamps at ten minutes and hides at an hour', (_name, mod) => {
    expect(mod.STAMP_AFTER_MS).toBe(10 * MIN)
    expect(mod.HIDE_AFTER_MS).toBe(60 * MIN)
    expect(mod.STAMP_AFTER_MS).toBeLessThan(mod.HIDE_AFTER_MS)
    expect('WARN_AFTER_MS' in mod).toBe(false)
  })

  it('keeps the two fifteen-minute feeds on one window', () => {
    expect(waits.HIDE_AFTER_MS).toBe(parking.HIDE_AFTER_MS)
  })
})
