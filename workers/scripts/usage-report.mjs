// =============================================================================
// Operator usage report: everything the KV store can say about buyers and how
// the guide is being used, in one command. Run from workers/ on a machine
// where wrangler is logged in (`wrangler login`):
//
//   npm run report:usage
//
// Reads the production GUIDE_BUYERS namespace through wrangler; writes nothing.
// This is the owner's own purchase data — the app itself carries no analytics
// by design (see the privacy posture notes in workers/CLAUDE.md), so this
// report is the honest ceiling of what is knowable server-side:
//
//   - who bought, when, and when access ends (buyer records)
//   - who has cross-device sync turned on (tripsync docs; the doc itself is
//     opaque client JSON and is deliberately not decoded here)
//   - how many devices opted into push, and the trip windows they registered
//     (trip dates are the one piece of planner state the server holds)
//   - the renewal pipeline: who lapses soon, which notices already went out
//   - this month's inventory count against the cap
//
// What it cannot say: which screens people read, what they searched, what
// they downloaded. The app sends none of that, on purpose.
// =============================================================================

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileP = promisify(execFile)

const BINDING = 'GUIDE_BUYERS'
const DAY_SECONDS = 24 * 60 * 60

async function wrangler(args) {
  const { stdout } = await execFileP(
    'npx',
    ['wrangler', ...args],
    { maxBuffer: 64 * 1024 * 1024 },
  )
  return stdout
}

async function listKeys() {
  const out = await wrangler(['kv', 'key', 'list', `--binding=${BINDING}`, '--remote'])
  // wrangler prints a JSON array of { name, expiration? } (plus banner lines
  // on stderr, which execFile keeps separate).
  const start = out.indexOf('[')
  if (start < 0) throw new Error(`unexpected wrangler list output:\n${out.slice(0, 400)}`)
  return JSON.parse(out.slice(start))
}

async function getValue(name) {
  const out = await wrangler(['kv', 'key', 'get', name, `--binding=${BINDING}`, '--remote', '--text'])
  return out.trim()
}

function fmtDate(epochSeconds) {
  return new Date(epochSeconds * 1000).toISOString().slice(0, 10)
}

function monthOf(epochSeconds) {
  return new Date(epochSeconds * 1000).toISOString().slice(0, 7)
}

function count(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

async function main() {
  console.log(`Listing keys in ${BINDING} (production)…`)
  const keys = await listKeys()

  const byPrefix = new Map()
  for (const k of keys) {
    const prefix = k.name.split(':', 1)[0]
    count(byPrefix, prefix)
  }

  const buyerKeys = keys.filter((k) => k.name.startsWith('buyer:'))
  const nowSeconds = Math.floor(Date.now() / 1000)

  console.log(`Fetching ${buyerKeys.length} buyer record(s)…`)
  const buyers = []
  for (const k of buyerKeys) {
    try {
      buyers.push(JSON.parse(await getValue(k.name)))
    } catch {
      console.error(`  ! unreadable record: ${k.name}`)
    }
  }
  buyers.sort((a, b) => (a.purchasedAt ?? 0) - (b.purchasedAt ?? 0))

  const active = buyers.filter((b) => !b.refundedAt && b.expiresAt > nowSeconds)
  const expired = buyers.filter((b) => !b.refundedAt && b.expiresAt <= nowSeconds)
  const refunded = buyers.filter((b) => b.refundedAt)
  const expiringSoon = active.filter((b) => b.expiresAt - nowSeconds <= 60 * DAY_SECONDS)

  const byMonth = new Map()
  for (const b of buyers) count(byMonth, monthOf(b.purchasedAt))

  // Push subscriptions: device count plus registered trip windows (the one
  // piece of planner state the server holds, because morning-of nudges cannot
  // be scheduled without it).
  const pushKeys = keys.filter((k) => k.name.startsWith('push:'))
  console.log(`Fetching ${pushKeys.length} push device record(s)…`)
  const pushSubs = []
  for (const k of pushKeys) {
    try {
      pushSubs.push(JSON.parse(await getValue(k.name)))
    } catch {
      /* skip unreadable */
    }
  }
  const today = new Date().toISOString().slice(0, 10)
  const upcomingTrips = pushSubs.filter((s) => s.tripEnd && s.tripEnd >= today)

  const syncCount = byPrefix.get('tripsync') ?? 0
  const renewalNotices = keys.filter((k) => k.name.startsWith('renewalNotice:'))

  const monthLabel = new Date().toISOString().slice(0, 7)
  let sold = 0
  try {
    sold = Number.parseInt(await getValue(`inventory:${monthLabel}`), 10) || 0
  } catch {
    /* no sales this month yet */
  }

  console.log('')
  console.log('=== Field Guide usage report ===')
  console.log(`Generated ${new Date().toISOString()}`)
  console.log('')
  console.log(`Buyers:            ${buyers.length} total`)
  console.log(`  active           ${active.length}`)
  console.log(`  expired          ${expired.length}`)
  console.log(`  refunded         ${refunded.length}`)
  console.log(`  lapsing ≤60d     ${expiringSoon.length}`)
  console.log('')
  console.log('Purchases by month:')
  for (const [month, n] of [...byMonth.entries()].sort()) {
    console.log(`  ${month}          ${n}`)
  }
  console.log('')
  console.log(`This month sold:   ${sold} (inventory:${monthLabel})`)
  console.log(`Sync opt-ins:      ${syncCount} account(s) with a cross-device doc`)
  console.log(`Push devices:      ${pushSubs.length} registered, ${upcomingTrips.length} with a current/upcoming trip window`)
  console.log(`Renewal notices:   ${renewalNotices.length} sent (per-stage sentinels)`)
  console.log('')

  if (upcomingTrips.length > 0) {
    console.log('Upcoming trip windows (from push registrations):')
    for (const s of upcomingTrips.sort((a, b) => (a.tripStart ?? '').localeCompare(b.tripStart ?? ''))) {
      console.log(`  ${s.tripStart ?? '?'} → ${s.tripEnd}   ${s.sub}`)
    }
    console.log('')
  }

  console.log('Buyer detail:')
  for (const b of buyers) {
    const status = b.refundedAt
      ? `refunded ${fmtDate(b.refundedAt)}`
      : b.expiresAt <= nowSeconds
        ? `expired ${fmtDate(b.expiresAt)}`
        : `active through ${fmtDate(b.expiresAt)}`
    console.log(`  ${b.email}`)
    console.log(`    bought ${fmtDate(b.purchasedAt)} · ${status}`)
  }
  console.log('')

  console.log('Key-space overview:')
  for (const [prefix, n] of [...byPrefix.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(5)}  ${prefix}:`)
  }
  console.log('')
  console.log('Not in this report, by design: in-app behavior. The PWA sends no')
  console.log('analytics; the purchase funnel (buy-button clicks by placement,')
  console.log('sample opens) is in GA4 on the editorial site, and payment detail')
  console.log('is in the Stripe dashboard.')
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exitCode = 1
})
