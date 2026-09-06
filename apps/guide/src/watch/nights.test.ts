// The form speaks arrive / leave and the Worker takes first night + count;
// these are the two conversions, and the label the list, the push and the
// email all print.
import { describe, expect, it } from 'vitest'
import {
  clampLeave,
  lastNightOf,
  leaveDateOf,
  nightsBetween,
  nightsLabel,
} from './nights'

describe('nightsBetween', () => {
  it('counts nights, not days', () => {
    expect(nightsBetween('2026-10-12', '2026-10-14')).toBe(2)
    expect(nightsBetween('2026-10-12', '2026-10-13')).toBe(1)
  })
  it('never goes negative', () => {
    expect(nightsBetween('2026-10-14', '2026-10-12')).toBe(0)
  })
  it('crosses a month boundary', () => {
    expect(nightsBetween('2026-10-31', '2026-11-02')).toBe(2)
  })
})

describe('lastNightOf and leaveDateOf', () => {
  it('round-trip a watch', () => {
    expect(lastNightOf('2026-10-12', 2)).toBe('2026-10-13')
    expect(leaveDateOf('2026-10-12', 2)).toBe('2026-10-14')
    expect(nightsBetween('2026-10-12', leaveDateOf('2026-10-12', 2))).toBe(2)
  })
  it('treat a zero count as one night', () => {
    expect(lastNightOf('2026-10-12', 0)).toBe('2026-10-12')
    expect(leaveDateOf('2026-10-12', 0)).toBe('2026-10-13')
  })
})

describe('clampLeave', () => {
  it('forces at least one night', () => {
    expect(clampLeave('2026-10-12', '2026-10-12')).toBe('2026-10-13')
    expect(clampLeave('2026-10-12', '2026-10-01')).toBe('2026-10-13')
  })
  it('caps at fourteen nights', () => {
    expect(clampLeave('2026-10-12', '2026-11-30')).toBe('2026-10-26')
  })
  it('leaves a valid span alone', () => {
    expect(clampLeave('2026-10-12', '2026-10-15')).toBe('2026-10-15')
  })
})

describe('nightsLabel', () => {
  it('prints one night, a run, a run across months, and a scatter', () => {
    expect(nightsLabel(['2026-10-03'])).toBe('Oct 3')
    expect(nightsLabel(['2026-10-03', '2026-10-04', '2026-10-05'])).toBe('Oct 3–5')
    expect(nightsLabel(['2026-10-31', '2026-11-01'])).toBe('Oct 31 – Nov 1')
    expect(nightsLabel(['2026-10-03', '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-20'])).toBe(
      'Oct 3, Oct 7, Oct 9 +2 more',
    )
  })
  it('sorts and dedupes what it is given', () => {
    expect(nightsLabel(['2026-10-05', '2026-10-03', '2026-10-04', '2026-10-04'])).toBe('Oct 3–5')
    expect(nightsLabel([])).toBe('')
  })
})
