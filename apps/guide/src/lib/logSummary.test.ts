// The field log's counting rules. /log and Home's "Your record" panel both
// read through this module, so a rule stated here is a rule both surfaces
// keep: a visited id the guide no longer carries is not a visit, the shared
// checklist map routes by prefix (hunt finds and wildlife sightings never
// count each other), every note counts, and storage that throws reads as an
// empty log rather than a crash.
//
// The stores under it keep module memos, so each case resets the module
// registry and imports fresh after seeding storage.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function installStorage(seed: Record<string, string> = {}, opts: { throws?: boolean } = {}) {
  const store = new Map<string, string>(Object.entries(seed))
  const maybeThrow = () => {
    if (opts.throws) throw new Error('SecurityError')
  }
  const localStorage = {
    getItem: (k: string) => (maybeThrow(), store.get(k) ?? null),
    setItem: (k: string, v: string) => (maybeThrow(), void store.set(k, v)),
    removeItem: (k: string) => (maybeThrow(), void store.delete(k)),
  }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: localStorage })
  // The stores read window.localStorage, not the bare global.
  Object.defineProperty(globalThis, 'window', { configurable: true, value: globalThis })
}

async function load() {
  vi.resetModules()
  return import('./logSummary')
}

beforeEach(() => vi.resetModules())
afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window')
  Reflect.deleteProperty(globalThis, 'localStorage')
})

describe('readLogSummary', () => {
  it('reads all zeros from an empty device, with the total drawn from the groups', async () => {
    installStorage()
    const { guideStopGroups, logHasEntries, readLogSummary } = await load()
    const s = readLogSummary()
    const total = guideStopGroups().reduce((n, g) => n + g.all.length, 0)
    expect(total).toBeGreaterThan(40)
    expect(s).toEqual({ visited: 0, stopTotal: total, species: 0, huntFinds: 0, notes: 0 })
    expect(logHasEntries(s)).toBe(false)
  })

  it('counts a visit only for a stop the guide still carries', async () => {
    installStorage({ 'tfg.visited': JSON.stringify(['tunnel-view', 'retired-stop-from-2025']) })
    const { logHasEntries, readLogSummary } = await load()
    const s = readLogSummary()
    expect(s.visited).toBe(1)
    expect(logHasEntries(s)).toBe(true)
  })

  it('routes the shared checklist map by prefix', async () => {
    installStorage({
      'tfg.checklist': JSON.stringify({
        'hunt-valley-yosemite-falls-mist': true,
        'wildlife-black-bear': true,
        'wildlife-not-a-real-entry': true,
      }),
    })
    const { readLogSummary } = await load()
    const s = readLogSummary()
    expect(s.huntFinds).toBe(1)
    // A sighting is a key that resolves to a quick-ID entry, nothing else.
    expect(s.species).toBe(1)
  })

  it('counts every note, orphaned ones included', async () => {
    installStorage({ 'tfg.stopNotes': JSON.stringify({ 'tunnel-view': 'lot full by nine', 'gone-stop': 'still mine', empty: '' }) })
    const { readLogSummary } = await load()
    // An empty string is not a note; the store drops it on read.
    expect(readLogSummary().notes).toBe(2)
  })

  it('reads an empty log from storage that throws', async () => {
    installStorage({}, { throws: true })
    const { readLogSummary } = await load()
    const s = readLogSummary()
    expect(s.visited).toBe(0)
    expect(s.species).toBe(0)
    expect(s.huntFinds).toBe(0)
    expect(s.notes).toBe(0)
  })
})
