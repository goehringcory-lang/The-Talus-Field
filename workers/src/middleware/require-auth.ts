import { createMiddleware } from 'hono/factory'
import type { Env } from '../env'
import { verifyAccessJwt } from '../lib/jwt'

// Variables set on the Hono context for downstream handlers.
export type AuthVariables = {
  authSub: string   // JWT sub: buyer email (lowercased) or dev/admin username
  authExp: number   // JWT exp, epoch seconds — lets /me report an expiry for
                    // operator sessions that have no buyer record to read from
}

// Bearer-JWT gate. This is the first server-side auth check in the Worker —
// everything else is either public by design (/programs, /tiles, /inventory)
// or gated client-side in the PWA (the paid content ships in the app bundle).
export const requireAuth = createMiddleware<{ Bindings: Env; Variables: AuthVariables }>(
  async (c, next) => {
    const header = c.req.header('authorization') ?? ''
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
    if (!token) return c.json({ error: 'Not signed in' }, 401)

    const claims = await verifyAccessJwt(token, c.env.MAGIC_LINK_SIGNING_SECRET)
    if (!claims) return c.json({ error: 'Not signed in' }, 401)

    c.set('authSub', claims.sub)
    c.set('authExp', claims.exp)
    await next()
  },
)
