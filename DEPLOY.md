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
- Events: `checkout.session.completed`

Copy the signing secret (`whsec_...`) and set it:

```bash
cd workers
wrangler secret put STRIPE_WEBHOOK_SECRET   # paste the whsec_... value
```

## 6. Deploy the guide PWA to Cloudflare Pages

```bash
cd apps/guide
npm install
npm run build
wrangler pages deploy dist --project-name talus-field-guide
```

In the Pages project settings, add the env var `VITE_API_BASE=https://<worker-url>` (only matters if you rebuild from the dashboard; the local build picks it up from `.env.production`).

Custom domain (optional for testing): `guide.thetalusfieldjournal.com` → CNAME to the Pages project.

## 7. Deploy the editorial site to Cloudflare Pages

The editorial site is plain static files at the repo root — no build step. Easiest:

```bash
wrangler pages deploy . --project-name talus-field-editorial
```

Cloudflare will upload the working tree. The `apps/` and `workers/` folders ride along but won't be served (no `index.html` in them). If that bothers you, create a Pages project tied to the GitHub repo and set the build output directory to `.` with a `.cloudflareignore` excluding `apps/`, `workers/`, `node_modules/`, etc.

Custom domain (optional): `thetalusfieldjournal.com` apex.

## 8. Smoke test

1. Open the deployed editorial site → click `Field Guide` → buy button shows the live `sold/cap` count (no longer in greyed "preview" mode).
2. Click buy → Stripe checkout opens. Use test card `4242 4242 4242 4242`, any future date, any CVC, any zip.
3. Payment completes → redirected to `?guide=success` → email arrives within ~30s with a 6-digit code and a magic link.
4. Click the magic link → opens `<guide-url>/open?token=...` → "Signing you in…" → redirects to the home with three region cards (`valley`, `glacier-mariposa`, `tuolumne`).
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
echo "Magic link: https://<guide-url>/open?token=$TOKEN"
```

Open the printed URL → JWT is issued, you're in.

## Going live (after testing)

- Swap Stripe test keys → live keys (`wrangler secret put STRIPE_SECRET_KEY`).
- Re-create the webhook in Stripe live mode and update `STRIPE_WEBHOOK_SECRET`.
- Make sure Resend domain is verified and `FROM` in [workers/src/lib/email.ts](workers/src/lib/email.ts) points at it.
- Verify the ~21 stop coordinates in [apps/guide/src/content/stops.ts](apps/guide/src/content/stops.ts) and remove the `TODO: verify` comments. Stops are organized into three regions: `valley`, `glacier-mariposa`, `tuolumne`.
- Drop photos into [apps/guide/public/photos/](apps/guide/public/photos/) and add `photos: [{ src, caption }]` entries on the matching stops.
