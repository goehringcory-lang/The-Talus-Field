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

1. Open the deployed editorial site → click `Field Guide` → the buy box renders "Buy the guide → $19" with the price read live from `/api/inventory` (there is no sold/cap counter; a sold-out month surfaces only as the reopen notice after checkout returns 409).
2. Click buy → Stripe checkout opens. Use test card `4242 4242 4242 4242`, any future date, any CVC, any zip.
3. Payment completes → redirected to `?guide=success` → email arrives within ~30s with a 6-digit code and a magic link.
4. Click the magic link → opens `https://talus-field-guide.pages.dev/open?token=...` → "Signing you in…" → redirects to the setup page, then home with four region cards (`valley`, `glacier-mariposa`, `tuolumne`, `hetch-hetchy`).
5. Pick a region → pick a stop. Read the body. Click "Open in Maps" → native maps app opens at the coordinate (note: 28 coords across stops, secret spots, and amenities are still flagged `TODO: verify on the ground` and may land you near, not on, the actual spot).
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
- Ground-truth the 28 coordinates still marked `TODO: verify on the ground` (15 in [apps/guide/src/content/stops.ts](apps/guide/src/content/stops.ts), 8 in `secret-spots.ts`, 5 in `amenities.ts`) and remove each marker only after standing at the spot. Stops are organized into four regions: `valley`, `glacier-mariposa`, `tuolumne`, `hetch-hetchy`.
- Photos go through the pipeline in [scripts/fetch-guide-photos.mjs](scripts/fetch-guide-photos.mjs) (fetch → review → select → `npm run images` → emit-credits), which also maintains the license credits rendered on the Account page. Wire new files as `photos: [{ src, caption }]` entries on the matching stops.

## 2026 relaunch: enabling the $19 paid model

The buy box, checkout route, webhook, KV buyer records, and email delivery are all in the tree; the paid path is enabled purely by configuration. Checklist, in order:

1. **Price.** `GUIDE_PRICE_CENTS = "1900"` in [workers/wrangler.toml](workers/wrangler.toml) is the single source of truth. The editorial buy box reads it live from `GET /api/inventory` (`priceCents`) with a static $19 fallback in [page-guide.jsx](page-guide.jsx). Change the var, `wrangler deploy`, done.
2. **KV.** The production namespace `id`s for `GUIDE_BUYERS` and `GUIDE_PROGRAMS` are already filled in `wrangler.toml`. Only the `preview_id`s remain `REPLACE_ME_FOR_LOCAL_DEV`; create preview namespaces (`wrangler kv namespace create ... --preview`) only if you need local `wrangler dev`.
3. **Secrets.** `wrangler secret put` each of: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MAGIC_LINK_SIGNING_SECRET`, `RESEND_API_KEY`. Rotate or delete `DEV_USERNAME`/`DEV_CODE` before launch; keep `ADMIN_*` as the operator door.
4. **Webhook.** In the Stripe dashboard, add endpoint `https://api.thetalusfieldjournal.com/api/stripe/webhook` for events `checkout.session.completed` **and** `charge.refunded`; the endpoint's signing secret is `STRIPE_WEBHOOK_SECRET`. Without `charge.refunded`, the refund-revocation branch in [workers/src/routes/stripe.ts](workers/src/routes/stripe.ts) never runs and refunded buyers keep access until the KV record is expired by hand.
5. **Resend domain.** Verify the sending domain for `cory@thetalusfieldjournal.com` in the Resend dashboard **before** going live. With an unverified domain the webhook's email send fails after the buyer has already been charged, and no access code or magic link ever arrives.
6. **Deploy + verify fail-closed traps.** `wrangler deploy`, then `curl https://api.thetalusfieldjournal.com/api/inventory` must show `sold: 0`, `cap: 100`, `priceCents: 1900`. The inventory check fails closed: a missing/garbled `GUIDE_MONTHLY_CAP` reads as sold out.
7. **Test-mode pass.** Full smoke test in section 8 (test card 4242…) before swapping to live keys per "Going live". Include a refund: refund the test payment in the Stripe dashboard and confirm the buyer's login stops working.
8. **Editorial re-integration: done.** Every code flip landed in the July 2026 launch-prep branch: `GUIDE_ON_SALE = true` in [page-guide.jsx](page-guide.jsx), the footer link in [components.jsx](components.jsx), the noscript nav link in [index.html](index.html), indexability in [app.jsx](app.jsx) and [edge/seo.js](edge/seo.js), `GUIDE_LISTED = true` in [scripts/gen-seo-artifacts.mjs](scripts/gen-seo-artifacts.mjs), and the Field Guide line in llms.txt. Remaining `GUIDE-LAUNCH` grep hits are historical breadcrumbs, not work. Merging that branch to `main` is the go-live action, so clear steps 1 through 7 first; the full state of play is in [LAUNCH-READINESS.md](LAUNCH-READINESS.md).

   One llms.txt line stays removed because the `/cap` route does not exist in app.jsx; only restore it if that page ships:

   ```
   - [Why the Field Guide is capped](https://thetalusfieldjournal.com/cap): The reasoning behind a hard monthly cap on Field Guide sales.
   ```

No PWA change is needed: [apps/guide/src/routes/Login.tsx](apps/guide/src/routes/Login.tsx) already tries the buyer email + code path first and falls back to dev-login.

## Google Calendar connect (PWA Account page)

Two paths put the trip on a buyer's Google calendar, and only the first needs setup:

1. **Feed subscription (works today, no setup).** The Account card and the trip
   page's calendar sheet publish the plan as a hosted ICS feed
   (`/api/trip/feed`) and hand Google an add-by-URL link. When the OAuth client
   below is absent, the Account card automatically offers this path for Google,
   so calendar linking is never dead.
2. **Direct OAuth connect (events pushed into the primary calendar,
   auto-synced on every edit).** Requires a Google Cloud OAuth client:

   - In the Google Cloud console, enable the **Google Calendar API**, then
     create an OAuth client of type **Web application** with authorized
     redirect URIs:
     - `https://api.thetalusfieldjournal.com/api/calendar/google/callback`
     - `http://localhost:8787/api/calendar/google/callback` (wrangler dev)
   - Consent screen scopes: `openid`, `userinfo.email`,
     `.../auth/calendar.events`. `calendar.events` is a sensitive scope:
     Testing mode works immediately for named test users; submit the app for
     verification before public launch or buyers will hit the unverified-app
     warning and Testing-mode refresh tokens will expire after 7 days.
   - Put the client id in `[vars]` in [workers/wrangler.toml](workers/wrangler.toml)
     (replacing the `REPLACE_WITH_…` placeholder; any id still carrying that
     prefix is treated as unconfigured) and set the secret:
     `wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET`.
   - `wrangler deploy` from `workers/` (the API Worker never auto-deploys).
   - Verify: sign in to the PWA, Account → Calendar → **Connect Google
     Calendar** should round-trip through the Google consent screen and land
     back on `/account` with "Connected as …", then push the current plan
     within a few seconds. `GET /api/calendar/google/status` (with a JWT)
     reports `configured: true` once the Worker sees real credentials.
