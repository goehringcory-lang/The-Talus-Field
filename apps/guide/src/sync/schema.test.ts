// The salvage rules in parseSyncDoc are the difference between "the other
// device wrote a shape this build does not know" and "wipe every saved stop on
// this device and then push the loss to every other one" (CODE-AUDIT-2026-08
// §2). Each case here is one of those rules stated as a test.
import { describe, expect, it } from 'vitest'
import { anyUnparseable, parseSyncDoc } from './schema'

const plan = {
  version: 1,
  dates: { start: '2026-07-14', end: '2026-07-16' },
  items: [
    { type: 'stop', itemId: 'stop:tunnel-view:2026-07-14', stopId: 'tunnel-view', day: '2026-07-14' },
  ],
  updatedAt: '2026-07-01T10:00:00.000Z',
}

function without<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy: Partial<T> = { ...obj }
  delete copy[key]
  return copy as Omit<T, K>
}

const good = {
  version: 1,
  updatedAt: '2026-07-01T10:00:00.000Z',
  plan,
  favorites: ['tunnel-view', 'taft-point'],
  visited: ['tunnel-view'],
  notes: { 'tunnel-view': 'Arrive before the light goes flat.' },
}

describe('parseSyncDoc', () => {
  it('accepts a well-formed document with no loss', () => {
    const parsed = parseSyncDoc(good)
    expect(parsed).not.toBeNull()
    expect(parsed!.salvaged).toBe(false)
    expect(anyUnparseable(parsed!.unparseable)).toBe(false)
    expect(parsed!.doc.favorites).toEqual(good.favorites)
  })

  it('treats a null plan as a real value, not a loss', () => {
    const parsed = parseSyncDoc({ ...good, plan: null })
    expect(parsed!.salvaged).toBe(false)
    expect(parsed!.doc.plan).toBeNull()
    expect(parsed!.unparseable.plan).toBe(false)
  })

  it('flags a plan this build cannot read and keeps the other three fields', () => {
    const parsed = parseSyncDoc({ ...good, plan: { version: 2, days: [] } })
    expect(parsed!.salvaged).toBe(true)
    expect(parsed!.unparseable).toEqual({ plan: true, favorites: false, visited: false, notes: false })
    expect(parsed!.doc.plan).toBeNull()
    expect(parsed!.doc.favorites).toEqual(good.favorites)
    expect(parsed!.doc.notes).toEqual(good.notes)
  })

  it('never filters a list down: a newer shape is a loss, not a shorter list', () => {
    // A newer build storing [{ id, addedAt }] must not parse as "no favorites".
    const parsed = parseSyncDoc({
      ...good,
      favorites: [{ id: 'tunnel-view', addedAt: 1 }, 'taft-point'],
    })
    expect(parsed!.salvaged).toBe(true)
    expect(parsed!.unparseable.favorites).toBe(true)
    // The placeholder exists so the envelope parses; applyRemote must skip it.
    expect(parsed!.doc.favorites).toEqual([])
    expect(parsed!.unparseable.visited).toBe(false)
  })

  it('counts an absent list or notes field as unparseable', () => {
    const parsed = parseSyncDoc(without(good, 'visited'))
    expect(parsed!.salvaged).toBe(true)
    expect(parsed!.unparseable.visited).toBe(true)
    expect(parsed!.unparseable.favorites).toBe(false)
  })

  it('flags notes whose values are not all strings', () => {
    const parsed = parseSyncDoc({ ...good, notes: { 'tunnel-view': { text: 'x', at: 1 } } })
    expect(parsed!.unparseable.notes).toBe(true)
    expect(parsed!.doc.notes).toEqual({})
  })

  it('returns null when there is no timestamp to merge on', () => {
    expect(parseSyncDoc({ ...good, updatedAt: 'not a date' })).toBeNull()
    expect(parseSyncDoc(without(good, 'updatedAt'))).toBeNull()
  })

  it('returns null for a non-object envelope', () => {
    expect(parseSyncDoc(null)).toBeNull()
    expect(parseSyncDoc('{}')).toBeNull()
    expect(parseSyncDoc(42)).toBeNull()
  })
})
