import { describe, expect, it } from 'vitest'
import { SCENE_HORIZON, SCENE_LEFT, SCENE_PEAK, SCENE_RIGHT, sunScene } from './sunScene'

// A day from 7:04 a.m. to 6:54 p.m. (424 to 1134 minutes).
const RISE = 7 * 60 + 4
const SET = 18 * 60 + 54

describe('sunScene', () => {
  it('draws no sun before sunrise or from sunset on', () => {
    expect(sunScene(RISE - 1, RISE, SET)).toEqual({ phase: 'before' })
    expect(sunScene(0, RISE, SET)).toEqual({ phase: 'before' })
    expect(sunScene(SET, RISE, SET)).toEqual({ phase: 'after' })
    expect(sunScene(23 * 60, RISE, SET)).toEqual({ phase: 'after' })
  })

  it('starts on the sunrise half-sun, on the horizon', () => {
    const s = sunScene(RISE, RISE, SET)
    expect(s.phase).toBe('day')
    if (s.phase !== 'day') return
    expect(s.x).toBeCloseTo(SCENE_LEFT, 6)
    expect(s.y).toBeCloseTo(SCENE_HORIZON, 6)
  })

  it('peaks at the middle of the day, centred between the two half-suns', () => {
    const s = sunScene((RISE + SET) / 2, RISE, SET)
    expect(s.phase).toBe('day')
    if (s.phase !== 'day') return
    expect(s.x).toBeCloseTo((SCENE_LEFT + SCENE_RIGHT) / 2, 6)
    expect(s.y).toBeCloseTo(SCENE_HORIZON - SCENE_PEAK, 6)
  })

  it('matches the design frame at 3:20 p.m.: about 70% through, high in the sky', () => {
    const s = sunScene(15 * 60 + 20, RISE, SET)
    expect(s.phase).toBe('day')
    if (s.phase !== 'day') return
    expect(s.fraction).toBeCloseTo(0.698, 2)
    expect(Math.round(s.x)).toBe(238)
    expect(Math.round(s.y)).toBe(33)
  })

  it('keeps the sun above the horizon for every minute of the day', () => {
    for (let m = RISE; m < SET; m++) {
      const s = sunScene(m, RISE, SET)
      if (s.phase !== 'day') throw new Error('expected day')
      expect(s.y).toBeLessThanOrEqual(SCENE_HORIZON + 1e-9)
      expect(s.x).toBeGreaterThanOrEqual(SCENE_LEFT)
      expect(s.x).toBeLessThanOrEqual(SCENE_RIGHT)
    }
  })
})
