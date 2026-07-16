import type { Env } from '../env'
import { hasRenewalNotice, markRenewalNotice, type BuyerRecord } from './kv'
import { sendRenewalNotice } from './email'

// Daily renewal sweep (MONETIZATION-IDEAS.md 2.1), run from the scheduled
// handler in index.ts. Walks every buyer record and sends the staged renewal
// notices as expiry approaches.
//
// Why a full list() walk instead of an expiry-bucket index: at the monthly cap
// (100 sales) the buyer keyspace grows ~1,200 keys a year, so this is one or
// two KV list pages per day for years — far simpler than backfilling and
// double-writing a secondary index. Revisit if the cap ever grows 10x.
//
// Stages fire on thresholds, not exact days, so a missed cron day self-heals:
// tomorrow's run sees daysLeft <= 60 and sends the notice a day late. Each
// (email, stage) pair sends exactly once, deduped by a KV sentinel with a TTL
// that outlives the notice window but clears before the next renewal cycle.
// A failed send is NOT marked, so the next run retries it.

// Highest-urgency stage first: a buyer discovered late (e.g. the sweep was
// added mid-window) gets the one most relevant notice, not all three.
const STAGES: Array<{ name: 't1' | 't14' | 't60'; maxDays: number }> = [
  { name: 't1', maxDays: 1 },
  { name: 't14', maxDays: 14 },
  { name: 't60', maxDays: 60 },
]

// Runaway guard: at normal volume a day's sweep sends a handful of notices;
// hitting this cap means something is wrong (or a huge backlog), and the
// remainder simply sends tomorrow.
const MAX_SENDS_PER_RUN = 50

// The Worker's public origin (wrangler.toml [[routes]]), used for the
// token-authenticated renew links in the notices. Not in [vars] because it is
// the Worker itself, not a peer service.
const API_ORIGIN = 'https://api.thetalusfieldjournal.com'

export async function sweepRenewals(env: Env): Promise<void> {
  const nowSeconds = Math.floor(Date.now() / 1000)
  let sent = 0
  let cursor: string | undefined

  do {
    const page = await env.GUIDE_BUYERS.list({ prefix: 'buyer:', cursor })

    for (const key of page.keys) {
      if (sent >= MAX_SENDS_PER_RUN) {
        console.error(`sweepRenewals: hit ${MAX_SENDS_PER_RUN}-send cap; remainder sends tomorrow`)
        return
      }

      const raw = await env.GUIDE_BUYERS.get(key.name)
      if (!raw) continue
      let buyer: BuyerRecord
      try {
        buyer = JSON.parse(raw) as BuyerRecord
      } catch {
        console.error('sweepRenewals: corrupt buyer record', { key: key.name })
        continue
      }

      // Refunded buyers are not invited back; already-expired buyers lapsed
      // before the sweep existed (or ignored it) — don't email the past.
      if (buyer.refundedAt != null) continue
      const secondsLeft = buyer.expiresAt - nowSeconds
      if (secondsLeft <= 0) continue

      const daysLeft = secondsLeft / 86400
      const stage = STAGES.find((s) => daysLeft <= s.maxDays)?.name
      if (!stage) continue
      if (await hasRenewalNotice(env, buyer.email, stage)) continue

      const renewUrl = `${API_ORIGIN}/api/checkout/renew?token=${buyer.accessToken}`
      try {
        await sendRenewalNotice(env, {
          to: buyer.email,
          stage,
          expiresAt: buyer.expiresAt,
          renewUrl,
        })
      } catch (err) {
        // Unmarked, so tomorrow's run retries this buyer.
        console.error('sweepRenewals: notice send failed', { email: buyer.email, stage, err })
        continue
      }
      await markRenewalNotice(env, buyer.email, stage)
      sent++
    }

    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  if (sent > 0) console.log(`sweepRenewals: sent ${sent} notice(s)`)
}
