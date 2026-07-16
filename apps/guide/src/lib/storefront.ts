// =============================================================================
// Storefront glue for the signed-out surfaces: the free sample (/preview),
// the stop teaser pages, and the sell block on /login.
//
// The guide is SOLD on the editorial site, not here. Every buy action is a
// link out to thetalusfieldjournal.com/guide, where the Stripe checkout and
// the inventory cap live. This module only knows the price, read from the
// same unauthenticated /api/inventory the editorial buy box reads, so the
// number is still edited in exactly one place (GUIDE_PRICE_CENTS in
// workers/wrangler.toml).
// =============================================================================

import { useEffect, useState } from 'react'
import { apiFetch } from './api'

// The editorial /guide page: the buy box, the pitch, the checkout.
export const GUIDE_BUY_URL = 'https://thetalusfieldjournal.com/guide'

// The free sample: one stop per region (REGIONS order) plus one Secret Guide
// entry, rendered in full by /preview and readable signed-out on /stop/:id.
// IDs must exist in content/stops.ts / secret-spots.ts; consumers resolve
// through getStopById and drop misses, so a renamed stop degrades the sample
// rather than crashing it.
export const PREVIEW_STOP_IDS: Record<string, string> = {
  valley: 'tunnel-view',
  'glacier-mariposa': 'taft-point',
  tuolumne: 'olmsted-point',
  'hetch-hetchy': 'wapama-falls-trail',
}
export const PREVIEW_SECRET_SPOT_ID = 'fern-spring'

export function isPreviewStopId(id: string): boolean {
  return id === PREVIEW_SECRET_SPOT_ID || Object.values(PREVIEW_STOP_IDS).includes(id)
}

// Shown until /api/inventory answers; keep in sync with GUIDE_PRICE_CENTS.
const FALLBACK_PRICE_CENTS = 1900

export function formatPrice(cents: number): string {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

// One inventory fetch per app boot, shared by every storefront surface. A
// failure leaves the fallback price on screen, which is correct enough to
// sell with, and clears the inflight slot so a later mount can retry.
let cachedPriceCents: number | null = null
let inflight: Promise<number> | null = null

async function fetchPriceCents(): Promise<number> {
  const body = await apiFetch<{ priceCents?: unknown }>('/api/inventory')
  const cents = body?.priceCents
  return typeof cents === 'number' && Number.isFinite(cents) && cents > 0
    ? cents
    : FALLBACK_PRICE_CENTS
}

export function useGuidePrice(): string {
  const [cents, setCents] = useState<number>(cachedPriceCents ?? FALLBACK_PRICE_CENTS)
  useEffect(() => {
    if (cachedPriceCents !== null) return
    let cancelled = false
    inflight = inflight ?? fetchPriceCents()
    inflight
      .then((value) => {
        cachedPriceCents = value
        if (!cancelled) setCents(value)
      })
      .catch(() => {
        inflight = null
      })
    return () => {
      cancelled = true
    }
  }, [])
  return formatPrice(cents)
}
