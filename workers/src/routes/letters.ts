// =============================================================================
// GET /api/letters
//
// The most recent Sunday Field Notes (title, archive link, date, a short
// excerpt), from Buttondown's public RSS via lib/letters.ts. The editorial
// site's signup units show the latest one, and /newsletter lists them, so a
// reader sees the letter before giving an address for it. Unauthenticated:
// it republishes what the public archive already shows. Never an error.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getLetters } from '../lib/letters'

export const letters = new Hono<{ Bindings: Env }>()

letters.get('/', async (c) => {
  const record = await getLetters(c.env).catch(() => null)
  return c.json(
    { fetchedAt: record?.fetchedAt ?? null, letters: record?.letters ?? [] },
    200,
    // A new letter goes out once a week; an hour of reuse is plenty fresh.
    { 'Cache-Control': 'public, max-age=3600' },
  )
})
