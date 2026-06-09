import type { Env } from '../env'

export type BuyerRecord = {
  email: string
  purchasedAt: number          // epoch seconds
  expiresAt: number            // epoch seconds
  accessToken: string          // 64-char hex; one-time bootstrap from email
  accessCode: string           // 6-digit zero-padded; for new-device login
}

const BUYER_KEY = (email: string) => `buyer:${email.toLowerCase()}`
const TOKEN_INDEX_KEY = (token: string) => `token:${token}`
const INVENTORY_KEY = (yyyymm: string) => `inventory:${yyyymm}`
const LOGIN_ATTEMPTS_KEY = (email: string) => `loginAttempts:${email.toLowerCase()}`
const DEV_LOGIN_ATTEMPTS_KEY = (ip: string, username: string) =>
  `devLoginAttempts:${ip}:${username.toLowerCase()}`

export function currentMonthLabel(at = new Date()): string {
  const y = at.getUTCFullYear()
  const m = String(at.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function firstOfNextMonthIso(at = new Date()): string {
  const y = at.getUTCFullYear()
  const m = at.getUTCMonth() + 1
  const next = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1))
  return next.toISOString()
}

export async function getBuyer(env: Env, email: string): Promise<BuyerRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(BUYER_KEY(email))
  if (!raw) return null
  try {
    return JSON.parse(raw) as BuyerRecord
  } catch (err) {
    console.error('getBuyer: corrupt KV record', { email, err })
    return null
  }
}

export async function putBuyer(env: Env, record: BuyerRecord): Promise<void> {
  await env.GUIDE_BUYERS.put(BUYER_KEY(record.email), JSON.stringify(record))
  // Reverse index so /api/auth/exchange can resolve token → email without scanning.
  await env.GUIDE_BUYERS.put(TOKEN_INDEX_KEY(record.accessToken), record.email.toLowerCase())
}

export async function getEmailByAccessToken(env: Env, token: string): Promise<string | null> {
  return env.GUIDE_BUYERS.get(TOKEN_INDEX_KEY(token))
}

export async function getInventoryCount(env: Env, monthLabel: string): Promise<number> {
  const raw = await env.GUIDE_BUYERS.get(INVENTORY_KEY(monthLabel))
  return raw ? Number.parseInt(raw, 10) : 0
}

export async function incrementInventory(env: Env, monthLabel: string): Promise<number> {
  // KV is eventually consistent, but at <100/month the race is acceptable.
  const next = (await getInventoryCount(env, monthLabel)) + 1
  await env.GUIDE_BUYERS.put(INVENTORY_KEY(monthLabel), String(next))
  return next
}

// Read-modify-write on KV is not atomic, so concurrent requests can undercount
// attempts (same trade-off as incrementInventory above). The cap is best-effort.
export async function recordLoginAttempt(env: Env, email: string): Promise<number> {
  const key = LOGIN_ATTEMPTS_KEY(email)
  const raw = await env.GUIDE_BUYERS.get(key)
  const next = (raw ? Number.parseInt(raw, 10) : 0) + 1
  // 1-hour TTL gives a rolling window per email.
  await env.GUIDE_BUYERS.put(key, String(next), { expirationTtl: 60 * 60 })
  return next
}

export async function clearLoginAttempts(env: Env, email: string): Promise<void> {
  await env.GUIDE_BUYERS.delete(LOGIN_ATTEMPTS_KEY(email))
}

export async function recordDevLoginAttempt(
  env: Env,
  ip: string,
  username: string,
): Promise<number> {
  const key = DEV_LOGIN_ATTEMPTS_KEY(ip, username)
  const raw = await env.GUIDE_BUYERS.get(key)
  const next = (raw ? Number.parseInt(raw, 10) : 0) + 1
  // 1-hour TTL gives a rolling window per (IP, username) pair.
  await env.GUIDE_BUYERS.put(key, String(next), { expirationTtl: 60 * 60 })
  return next
}

export async function clearDevLoginAttempts(
  env: Env,
  ip: string,
  username: string,
): Promise<void> {
  await env.GUIDE_BUYERS.delete(DEV_LOGIN_ATTEMPTS_KEY(ip, username))
}
