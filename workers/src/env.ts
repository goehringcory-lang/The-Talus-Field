// Cloudflare Worker bindings declared in wrangler.toml + secrets set via `wrangler secret put`.
export type Env = {
  // KV namespace
  GUIDE_BUYERS: KVNamespace

  // Vars (wrangler.toml [vars])
  APP_BASE_URL: string         // e.g. https://guide.thetalusfieldjournal.com
  EDITORIAL_BASE_URL: string   // e.g. https://thetalusfieldjournal.com
  GUIDE_PRICE_CENTS: string    // "2900"
  GUIDE_PRODUCT_TAG: string    // "field_guide_2026"
  GUIDE_MONTHLY_CAP: string    // "100"

  // Secrets (wrangler secret put)
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  MAGIC_LINK_SIGNING_SECRET: string
  RESEND_API_KEY: string

  // Pre-Stripe dev / admin sign-in. Used by /api/auth/dev-login.
  // All four are optional; if a pair is unset, that login path is disabled.
  DEV_USERNAME?: string
  DEV_CODE?: string
  ADMIN_USERNAME?: string
  ADMIN_CODE?: string
}
