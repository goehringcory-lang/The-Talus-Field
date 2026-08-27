import type { Env } from '../env'
import type { BuyerRecord } from './kv'
import { deriveAccessCode, deriveAccessToken } from './tokens'

export const EIGHTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 548 // 18 calendar months is ~547.9 days; 30-day months undersold it by a week

// Build the fresh buyer record for a paid Checkout Session. Shared by the
// webhook's fresh-provision path and the instant-access claim, which race:
// the Stripe redirect usually lands before the webhook is delivered, and KV's
// eventual consistency means whichever runs second may not see the first's
// write. Everything here is a pure function of (secret, session, email) —
// derived credentials, session-created timestamps — so a double provision
// writes the identical record twice instead of regenerating the code the
// other path already emailed or stored.
export async function buyerRecordForSession(
  env: Env,
  email: string,
  session: { id: string; created: number },
): Promise<BuyerRecord> {
  return {
    email,
    purchasedAt: session.created,
    expiresAt: session.created + EIGHTEEN_MONTHS_SECONDS,
    accessToken: await deriveAccessToken(env.MAGIC_LINK_SIGNING_SECRET, session.id),
    accessCode: await deriveAccessCode(env.MAGIC_LINK_SIGNING_SECRET, session.id),
    provisionedSessionId: session.id,
  }
}
