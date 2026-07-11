# Deploy runbook

End-to-end steps to get the Field Guide live on Cloudflare so you can test functionality. All commands are run from the repo root unless noted.

## Prereqs (one-time)

- Cloudflare account with `thetalusfieldjournal.com` on it (zone created in Cloudflare).
- Stripe account. **Use test mode for first deploy** — same flow as live, no real charges.
- Resend account (https://resend.com).
- Wrangler CLI: `npm i -g wrangler && wrangler login`.

## 1. Provision the KV namespace

```bash
cd workers
wrangler kv namespace create GUIDE_BUYERS
wrangler kv namespace create GUIDE_BUYERS --preview
```

Each command prints an ID. Open `workers/wrangler.toml` and paste them in:

```toml
[[kv_namespaces]]
binding = "GUIDE_BUYERS"
id = "<paste id from first command>"
preview_id = "<paste id from second command>"
```

## 2. Set Worker secrets

From `workers/`:

```bash
wrangler secret put STRIPE_SECRET_KEY            # sk_test_... for now
wrangler secret put MAGIC_LINK_SIGNING_SECRET    # any random 32+ char string (used to sign JWTs)
wrangler secret put RESEND_API_KEY               # from resend.com/api-keys
wrangler secret put STRIPE_WEBHOOK_SECRET        # placeholder for now; real value in step 5
```

For `MAGIC_LINK_SIGNING_SECRET`, generate something like:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Resend setup (this is the gotcha)

Resend won't deliver to arbitrary emails until your sending domain is verified.

**Recommended:** Add `thetalusfieldjournal.com` in Resend → it gives you DNS records to paste into Cloudflare DNS (TXT + MX). Verification usually takes 5–10 minutes.

**Faster, for self-only testing:** edit [workers/src/lib/email.ts:3](workers/src/lib/email.ts) and change `FROM` to `'onboarding@resend.dev'`. Resend's dev sender works without verification but **only sends to the email on your Resend account**. Revert before going live.

## 4. Deploy the Worker

```bash
cd workers
wrangler deploy
```

The first deploy will fail with a DNS error if the `api` subdomain doesn't exist yet. Two options:

- **Easy:** comment out the `[[routes]]` block in `wrangler.toml`, deploy, and use the auto-generated `talus-field-guide-api.<your-subdomain>.workers.dev` URL for testing. Update `GUIDE_API_BASE` in [page-guide.jsx:10](page-guide.jsx) and `VITE_API_BASE` in [apps/guide/.env.production](apps/guide/.env.production) to point at it.
- **Production-shaped:** in Cloudflare DNS, add a CNAME `api` → `<your-account>.workers.dev` (proxied). Then `wrangler deploy` will route correctly.

Verify: `curl https://<worker-url>/` should return "Talus Field Guide API. See /api/inventory."

`curl https://<worker-url>/api/inventory` should return JSON with `sold`, `cap`, `monthLabel`, `reopens`.

## 5. Configure the Stripe webhook

In Stripe dashboard (test mode toggle on) → **Developers → Webhooks → Add endpoint**:

- URL: `https://<worker-url>/api/stripe/webhook`
- Events: `checkout.session.completed`, `charge.refunded`

Copy the signing secret (`whsec_...`) and set it:

```bash
cd workers
wrangler secret put STRIPE_WEBHOOK_SECRET   # paste the whsec_... value
```

## 6. Deploy the guide PWA (Cloudflare Pages, auto)

The Pages project `talus-field-guide` is git-connected to `main` and builds
automatically on every merge: root directory `apps/guide`, build command
`npm run build`, output directory `dist`, Node pinned by `apps/guide/.nvmrc`.
No dashboard env vars are required (`VITE_API_BASE` is committed in
`apps/guide/.env.production`; a dashboard var of the same name overrides it).

Manual fallback if a one-off deploy is ever needed:

```bash
cd apps/guide
npm install
npm run build
wrangler pages deploy dist --project-name talus-field-guide
```

The app serves at `https://talus-field-guide.pages.dev`. The custom domain
`guide.thetalusfieldjournal.com` is deliberately unattached until launch; when
attaching it, also flip the `GUIDE_APP_BASE` default in `page-guide.jsx`, the
`APP_BASE_URL` var in `workers/wrangler.toml` (then redeploy the Worker), and
the docs. Exported calendar links self-correct (they derive from the serving
origin).

## 7. Deploy the editorial site (Cloudflare Workers Build, auto)

The editorial site deploys as the Worker `the-talus-field` (root
`wrangler.jsonc`): static assets from the repo root filtered by
`.assetsignore`, with `edge/seo.js` as the fetch handler for per-route SEO
head rewriting. A git-connected Cloudflare Workers Build deploys it on every
merge to `main` (it runs the root `npm run build` no-op shim, then
`npx wrangler deploy`).

Manual fallback:

```bash
npx wrangler deploy   # from the repo root
```

Custom domains `thetalusfieldjournal.com` + `www` are bound in
`wrangler.jsonc`.

## 8. Smoke test

1. Open the deployed editorial site → click `Field Guide` → buy button shows the live `sold/cap` count (no longer in greyed "preview" mode).
2. Click buy → Stripe checkout opens. Use test card `4242 4242 4242 4242`, any future date, any CVC, any zip.
3. Payment completes → redirected to `?guide=success` → email arrives within ~30s with a 6-digit code and a magic link.
4. Click the magic link → opens `https://talus-field-guide.pages.dev/open?token=...` → "Signing you in…" → redirects to the home with three region cards (`valley`, `glacier-mariposa`, `tuolumne`).
5. Pick a region → pick a stop. Read the body. Click "Open in Maps" → native maps app opens at the coordinate (note: most coords are still flagged TODO and will land you near, not on, the actual spot).
6. **PWA install:** in mobile Chrome/Safari, the install prompt appears; install to home screen.
7. **Offline:** turn on airplane mode, reopen the installed app → home and stop pages still render from cache.
8. **Update flow:** push a code change, redeploy Pages → reopen the app → update banner appears at the top → click → reloads with new build.

If you'd rather skip Stripe + email during this first test and just exercise the guide UX, you can manually seed a buyer in KV and craft a magic link:

```bash
cd workers
TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EMAIL="you@example.com"
NOW=$(date +%s)
EXPIRES=$((NOW + 60*60*24*30*18))
wrangler kv key put --binding=GUIDE_BUYERS "buyer:$EMAIL" "{\"email\":\"$EMAIL\",\"purchasedAt\":$NOW,\"expiresAt\":$EXPIRES,\"accessToken\":\"$TOKEN\",\"accessCode\":\"123456\"}" --remote
wrangler kv key put --binding=GUIDE_BUYERS "token:$TOKEN" "$EMAIL" --remote
echo "Magic link: https://talus-field-guide.pages.dev/open?token=$TOKEN"
```

Open the printed URL → JWT is issued, you're in.

## Owner access (permanent login)

The owner's account is an ordinary buyer record with a far-future expiry.
Because sign-in JWTs are stamped to the buyer's `expiresAt`
(`workers/src/routes/auth.ts`), one login then lasts effectively forever,
works offline, and shows a real access date on the Account page. Seed it once:

```bash
cd workers
TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CODE=$(node -e "console.log(String(Math.floor(Math.random()*1e6)).padStart(6,'0'))")
NOW=$(date +%s)
# expiresAt 4102444800 = 2100-01-01T00:00:00Z
wrangler kv key put --binding=GUIDE_BUYERS "buyer:goehring.cory@gmail.com" \
  "{\"email\":\"goehring.cory@gmail.com\",\"purchasedAt\":$NOW,\"expiresAt\":4102444800,\"accessToken\":\"$TOKEN\",\"accessCode\":\"$CODE\"}" --remote
wrangler kv key put --binding=GUIDE_BUYERS "token:$TOKEN" "goehring.cory@gmail.com" --remote
echo "Access code (store in a password manager): $CODE"
echo "Magic link: https://talus-field-guide.pages.dev/open?token=$TOKEN"
```

Rules that matter:

- Never pass `--expiration`/`--ttl` flags: the app enforces expiry through the
  record's `expiresAt` field, and a KV TTL would silently delete the whole
  record.
- The email must be lowercase in both the key and the JSON `email` field.
- The access code must be exactly 6 characters (constant-time compare rejects
  length mismatches).
- Keep `ADMIN_USERNAME`/`ADMIN_CODE` secrets set as the break-glass operator
  door; operator sessions carry a shorter 90-day JWT, so the buyer record
  above is the primary login.
- Sign in at `https://talus-field-guide.pages.dev/login` with the email and
  code, or use the magic link once.

## Going live (after testing)

- Swap Stripe test keys → live keys (`wrangler secret put STRIPE_SECRET_KEY`).
- Re-create the webhook in Stripe live mode and update `STRIPE_WEBHOOK_SECRET`.
- Make sure Resend domain is verified and `FROM` in [workers/src/lib/email.ts](workers/src/lib/email.ts) points at it.
- Verify the ~21 stop coordinates in [apps/guide/src/content/stops.ts](apps/guide/src/content/stops.ts) and remove the `TODO: verify` comments. Stops are organized into three regions: `valley`, `glacier-mariposa`, `tuolumne`.
- Drop photos into [apps/guide/public/photos/](apps/guide/public/photos/) and add `photos: [{ src, caption }]` entries on the matching stops.

## 2026 relaunch: enabling the $19 paid model

The buy box, checkout route, webhook, KV buyer records, and email delivery are all in the tree; the paid path is enabled purely by configuration. Checklist, in order:

1. **Price.** `GUIDE_PRICE_CENTS = "1900"` in [workers/wrangler.toml](workers/wrangler.toml) is the single source of truth. The editorial buy box reads it live from `GET /api/inventory` (`priceCents`) with a static $19 fallback in [page-guide.jsx](page-guide.jsx). Change the var, `wrangler deploy`, done.
2. **KV.** `wrangler kv namespace create GUIDE_BUYERS` and `... --preview`, then fill `id` / `preview_id` in `wrangler.toml` (currently `REPLACE_ME_*`).
3. **Secrets.** `wrangler secret put` each of: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MAGIC_LINK_SIGNING_SECRET`, `RESEND_API_KEY`. Rotate or delete `DEV_USERNAME`/`DEV_CODE` before launch; keep `ADMIN_*` as the operator door.
4. **Webhook.** In the Stripe dashboard, add endpoint `https://api.thetalusfieldjournal.com/api/stripe/webhook` for events `checkout.session.completed` **and** `charge.refunded`; the endpoint's signing secret is `STRIPE_WEBHOOK_SECRET`. Without `charge.refunded`, the refund-revocation branch in [workers/src/routes/stripe.ts](workers/src/routes/stripe.ts) never runs and refunded buyers keep access until the KV record is expired by hand.
5. **Resend domain.** Verify the sending domain for `cory@thetalusfieldjournal.com` in the Resend dashboard **before** going live. With an unverified domain the webhook's email send fails after the buyer has already been charged, and no access code or magic link ever arrives.
6. **Deploy + verify fail-closed traps.** `wrangler deploy`, then `curl https://api.thetalusfieldjournal.com/api/inventory` must show `sold: 0`, `cap: 100`, `priceCents: 1900`. The inventory check fails closed: a missing/garbled `GUIDE_MONTHLY_CAP` reads as sold out.
7. **Test-mode pass.** Full smoke test in section 8 (test card 4242…) before swapping to live keys per "Going live". Include a refund: refund the test payment in the Stripe dashboard and confirm the buyer's login stops working.
8. **Re-integrate /guide on the editorial site.** The page was de-linked and noindexed ahead of launch. Grep the repo for `GUIDE-LAUNCH:` and follow each marker: restore the footer link in [components.jsx](components.jsx), restore the noscript nav link in [index.html](index.html), remove the `robots` overrides in [app.jsx](app.jsx) and [edge/seo.js](edge/seo.js), flip `GUIDE_LISTED = true` in [scripts/gen-seo-artifacts.mjs](scripts/gen-seo-artifacts.mjs), and restore the llms.txt reference lines recorded below. Then `npm --prefix scripts run compile`, bump the shared `?v=` cache-buster in index.html, `npm --prefix scripts run seo`, and `npm --prefix scripts run check`.

   Removed llms.txt lines, restore under "## Reference pages" (between The Map and Newsletter). The `/cap` line was also removed because the route does not exist in app.jsx; only restore it if that page ships:

   ```
   - [The Field Guide](https://thetalusfieldjournal.com/guide): An offline web app for Yosemite. Tappable GPS for the parking turnouts and quiet trailheads locals use.
   - [Why the Field Guide is capped](https://thetalusfieldjournal.com/cap): The reasoning behind a hard monthly cap on Field Guide sales.
   ```

No PWA change is needed: [apps/guide/src/routes/Login.tsx](apps/guide/src/routes/Login.tsx) already tries the buyer email + code path first and falls back to dev-login.
