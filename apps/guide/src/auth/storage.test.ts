// The session is derived from the JWT's own claims, and every guard here is
// one that used to be assumed: a missing exp made expiry checks NaN (never
// true), a multibyte sub broke atob, and a storage-blocked browser lost the
// session between sign-in and the first API call.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  clearStoredJwt,
  getAccessEndedAt,
  getStoredJwt,
  readSessionFromStorage,
  sessionFromJwt,
  setStoredJwt,
} from './storage'

function b64url(s: string): string {
  const bytes = new TextEncoder().encode(s)
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function jwt(claims: Record<string, unknown>): string {
  return `${b64url('{"alg":"HS256","typ":"JWT"}')}.${b64url(JSON.stringify(claims))}.sig`
}

const future = Math.floor(Date.now() / 1000) + 3600
const past = Math.floor(Date.now() / 1000) - 3600

// A minimal localStorage: the module guards every access with try/catch, so
// the stub can also be told to throw to model Safari's "Block all cookies".
function installStorage(opts: { throws?: boolean } = {}) {
  const store = new Map<string, string>()
  const maybeThrow = () => {
    if (opts.throws) throw new Error('SecurityError')
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => (maybeThrow(), store.get(k) ?? null),
      setItem: (k: string, v: string) => (maybeThrow(), void store.set(k, v)),
      removeItem: (k: string) => (maybeThrow(), void store.delete(k)),
    },
  })
  return store
}

describe('sessionFromJwt', () => {
  it('reads sub and exp from a live token', () => {
    expect(sessionFromJwt(jwt({ sub: 'buyer@example.com', exp: future }))).toEqual({
      jwt: jwt({ sub: 'buyer@example.com', exp: future }),
      username: 'buyer@example.com',
    })
  })

  it('rejects an expired token', () => {
    expect(sessionFromJwt(jwt({ sub: 'x', exp: past }))).toBeNull()
  })

  it('rejects a token with a missing or non-numeric exp', () => {
    expect(sessionFromJwt(jwt({ sub: 'x' }))).toBeNull()
    expect(sessionFromJwt(jwt({ sub: 'x', exp: '9999999999' }))).toBeNull()
  })

  it('rejects garbage', () => {
    expect(sessionFromJwt('not.a.jwt')).toBeNull()
    expect(sessionFromJwt('')).toBeNull()
  })

  it('decodes a multibyte sub', () => {
    const s = sessionFromJwt(jwt({ sub: 'josé@example.com', exp: future }))
    expect(s?.username).toBe('josé@example.com')
  })
})

describe('readSessionFromStorage', () => {
  beforeEach(() => clearStoredJwt())
  afterEach(() => {
    clearStoredJwt()
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('returns the stored session', () => {
    installStorage()
    setStoredJwt(jwt({ sub: 'x', exp: future }))
    expect(readSessionFromStorage()?.username).toBe('x')
  })

  it('clears an expired token and leaves the access-ended marker', () => {
    const store = installStorage()
    store.set('tfg.jwt', jwt({ sub: 'x', exp: past }))
    expect(readSessionFromStorage()).toBeNull()
    expect(store.has('tfg.jwt')).toBe(false)
    expect(getAccessEndedAt()).toBe(past)
  })

  it('clears an undecodable token without a marker', () => {
    const store = installStorage()
    store.set('tfg.jwt', 'garbage')
    expect(readSessionFromStorage()).toBeNull()
    expect(store.has('tfg.jwt')).toBe(false)
    expect(getAccessEndedAt()).toBeNull()
  })

  it('keeps the session in memory when storage throws', () => {
    installStorage({ throws: true })
    const token = jwt({ sub: 'x', exp: future })
    setStoredJwt(token)
    expect(getStoredJwt()).toBe(token)
    expect(readSessionFromStorage()?.username).toBe('x')
    clearStoredJwt()
    expect(getStoredJwt()).toBeNull()
  })
})
