// Cloudflare Worker bindings declared in wrangler.toml + secrets set via `wrangler secret put`.
export type Env = {
  // KV namespaces
  GUIDE_BUYERS: KVNamespace
  // Program/event cache written by the daily cron, read by /api/programs.
  // Separate namespace from buyer records: different lifecycle, and a bad
  // ingest can never touch purchase data.
  GUIDE_PROGRAMS: KVNamespace

  // Vars (wrangler.toml [vars])
  APP_BASE_URL: string         // PWA origin; e.g. https://talus-field-guide.pages.dev
  EDITORIAL_BASE_URL: string   // e.g. https://thetalusfieldjournal.com
  GUIDE_PRICE_CENTS: string    // "1900"
  GUIDE_PRODUCT_TAG: string    // "field_guide_2026"
  GUIDE_MONTHLY_CAP: string    // "100"

  // Google OAuth client for the calendar push (/api/calendar). The client id
  // is a public identifier and lives in [vars]; the secret is set with
  // `wrangler secret put`. Both optional: without them /api/calendar/google/start
  // returns 503 and the Account page's connect button is inert.
  GOOGLE_OAUTH_CLIENT_ID?: string

  // Secrets (wrangler secret put)
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  MAGIC_LINK_SIGNING_SECRET: string
  RESEND_API_KEY: string

  // Google OAuth client secret for the calendar push. Paired with
  // GOOGLE_OAUTH_CLIENT_ID above; optional (endpoint 503s when unset).
  GOOGLE_OAUTH_CLIENT_SECRET?: string

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

  // IndexNow push-indexing for Bing / Yandex / Seznam / Naver / Yep.
  // INDEXNOW_KEY is the 32-char hex string published at
  //   https://thetalusfieldjournal.com/<INDEXNOW_KEY>.txt
  // INDEXNOW_ADMIN_TOKEN gates POST /api/indexnow/submit. Both optional;
  // if either is unset the endpoint returns 503.
  INDEXNOW_KEY?: string
  INDEXNOW_ADMIN_TOKEN?: string
}
