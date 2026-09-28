import { describe, expect, it } from 'vitest'
import { PIN_H, PIN_W, declutter, depthScale, type DeclutterItem } from './declutter'

const pin = (id: string, x: number, y: number, priority = 0, extra: Partial<DeclutterItem> = {}): DeclutterItem => ({
  id,
  x,
  y,
  w: PIN_W,
  h: PIN_H,
  priority,
  ...extra,
})

describe('pin declutter', () => {
  it('draws every pin when none overlap', () => {
    const shown = declutter([pin('a', 50, 100), pin('b', 150, 100), pin('c', 50, 300)])
    expect([...shown].sort()).toEqual(['a', 'b', 'c'])
  })

  it('steps the lower-priority pin down when two collide', () => {
    const shown = declutter([pin('parking', 100, 100, 1), pin('viewpoint', 104, 102, 9)])
    expect([...shown]).toEqual(['viewpoint'])
  })

  it('lets neighbours touch at the edges', () => {
    // 23 px apart: the 26 px boxes overlap by 3 px, inside the allowance.
    const shown = declutter([pin('a', 100, 100), pin('b', 123, 100)])
    expect(shown.size).toBe(2)
  })

  it('breaks a tie toward the pin nearer the camera (lower on screen)', () => {
    const shown = declutter([pin('far', 100, 100), pin('near', 100, 110)])
    expect([...shown]).toEqual(['near'])
  })

  it('breaks a full tie by id, so marker order never decides', () => {
    const a = declutter([pin('b', 100, 100), pin('a', 100, 100)])
    const b = declutter([pin('a', 100, 100), pin('b', 100, 100)])
    expect([...a]).toEqual(['a'])
    expect([...b]).toEqual(['a'])
  })

  it('always draws a pinned pin, even over a higher priority one', () => {
    const shown = declutter([pin('open-popup', 100, 100, 0, { pinned: true }), pin('viewpoint', 100, 100, 9)])
    expect([...shown]).toEqual(['open-popup'])
  })

  it('draws two pinned pins even when they overlap', () => {
    const shown = declutter([pin('a', 100, 100, 0, { pinned: true }), pin('b', 100, 100, 0, { pinned: true })])
    expect(shown.size).toBe(2)
  })

  it('collides across grid cells', () => {
    // Straddling the 64 px cell line at x = 64.
    const shown = declutter([pin('a', 60, 100, 2), pin('b', 70, 100, 1)])
    expect([...shown]).toEqual(['a'])
  })

  it('thins a heap to what fits, never to nothing', () => {
    const heap = Array.from({ length: 40 }, (_, i) => pin(`p${i}`, 200 + (i % 5) * 3, 200 + Math.floor(i / 5) * 3, i % 3))
    const shown = declutter(heap)
    expect(shown.size).toBeGreaterThanOrEqual(1)
    expect(shown.size).toBeLessThan(5)
  })
})

describe('depth scale', () => {
  it('keeps every pin full-size on a flat or gently tilted map', () => {
    expect(depthScale(0, 800, 0)).toBe(1)
    expect(depthScale(0, 800, 20)).toBe(1)
  })

  it('shrinks the far (upper) pins of a tilted map, and never the nearest', () => {
    expect(depthScale(800, 800, 60)).toBe(1)
    expect(depthScale(0, 800, 60)).toBe(0.55)
    const mid = depthScale(400, 800, 60)
    expect(mid).toBeGreaterThan(0.55)
    expect(mid).toBeLessThan(1)
  })

  it('shrinks more the steeper the tilt', () => {
    expect(depthScale(200, 800, 40)).toBeGreaterThan(depthScale(200, 800, 70))
  })

  it('is quantised, so a slow pan does not restyle every pin', () => {
    const s = depthScale(333, 800, 55)
    expect(Math.round(s * 20)).toBeCloseTo(s * 20, 9)
  })
})
