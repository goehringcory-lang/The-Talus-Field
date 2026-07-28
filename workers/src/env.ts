// Cloudflare Worker bindings declared in wrangler.toml + secrets set via `wrangler secret put`.
export type Env = {
  // KV namespaces
  GUIDE_BUYERS: KVNamespace
  // Guide data cache: program/event records written by the daily cron and
  // read by /api/programs, plus the NWS weather record for /api/weather.
  // Separate namespace from buyer records: different lifecycle, safe to
  // lose, and a bad ingest can never touch purchase data.
  GUIDE_PROGRAMS: KVNamespace

  // Vars (wrangler.toml [vars])
  APP_BASE_URL: string         // PWA origin; e.g. https://talus-field-guide.pages.dev
  EDITORIAL_BASE_URL: string   // e.g. https://thetalusfieldjournal.com
  GUIDE_PRICE_CENTS: string    // "399"
  GUIDE_RENEWAL_PRICE_CENTS: string // "249"; discounted rebuy at/near expiry
  GUIDE_PRODUCT_TAG: string    // "field_guide_2026"
  GUIDE_MONTHLY_CAP: string    // "100"

  // Secrets (wrangler secret put)
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  MAGIC_LINK_SIGNING_SECRET: string
  RESEND_API_KEY: string

  // NPS Events API key (free, developer.nps.gov/get-started). Server-side
  // only — the PWA never sees it. Optional: without it the programs cron
  // skips ingest and /api/programs serves manual curation only.
  NPS_API_KEY?: string

  // Pre-Stripe dev / admin sign-in. Used by /api/auth/dev-login.
  // All four are optional; if a pair is unset, that login path is disabled.
  DEV_USERNAME?: string
  DEV_CODE?: string
  ADMIN_USERNAME?: string
  ADMIN_CODE?: string

  // Web Push (VAPID) keypair for the PWA's notifications, both base64url.
  // Generate with `node scripts/gen-vapid-keys.mjs`. The public key is public
  // by design (GET /api/push/key serves it; it goes into every subscription);
  // it lives in secrets only to keep the pair together. Both optional: without
  // them every /api/push route 503s and the app hides the opt-in.
  VAPID_PUBLIC_KEY?: string
  VAPID_PRIVATE_KEY?: string

  // IndexNow push-indexing for Bing / Yandex / Seznam / Naver / Yep.
  // INDEXNOW_KEY is the 32-char hex string published at
  //   https://thetalusfieldjournal.com/<INDEXNOW_KEY>.txt
  // INDEXNOW_ADMIN_TOKEN gates POST /api/indexnow/submit. Both optional;
  // if either is unset the endpoint returns 503.
  INDEXNOW_KEY?: string
  INDEXNOW_ADMIN_TOKEN?: string
}
