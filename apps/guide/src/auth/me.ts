// =============================================================================
// /api/auth/me — access-status lookup.
//
// KEEP IN SYNC with the /me handler in workers/src/routes/auth.ts (same
// hand-mirroring convention as programs/schema.ts). The response is cached in
// localStorage so the Account page can still show "access ends {date}" when
// the buyer is offline in the park.
// =============================================================================

import { z } from 'zod'
import { apiFetch } from '../lib/api'

const CACHE_KEY = 'tfg.me'

export const Me = z.object({
  kind: z.enum(['buyer', 'operator']),
  email: z.string(),
  purchasedAt: z.number().optional(),
  expiresAt: z.number(),
  expired: z.boolean().optional(),
})
export type MeT = z.infer<typeof Me>

export function readCachedMe(): MeT | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return Me.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function clearCachedMe(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* non-fatal */
  }
}

// Network fetch + cache write. Throws on network/auth failure — callers
// decide whether to fall back to readCachedMe() (Account) or do nothing
// (background revalidation).
export async function fetchMe(): Promise<MeT> {
  const me = Me.parse(await apiFetch('/api/auth/me'))
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(me))
  } catch {
    /* non-fatal: status just won't be visible offline */
  }
  return me
}
