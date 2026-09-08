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

Optional, for PWA push notifications (`/api/push/*`). Without them every push
route returns 503 and the app hides the opt-in entirely, so this can wait:

```bash
node scripts/gen-vapid-keys.mjs        # prints both values, from the repo root
cd workers
wrangler secret put VAPID_PUBLIC_KEY
wrangler secret put VAPID_PRIVATE_KEY
```

Generate the pair **once**. Browsers bind a push subscription to the
`applicationServerKey` it was created with, so rotating silences every device
already subscribed until it next opens the app and re-registers.

Optional, for the live conditions feeds. Both are free, and each one's absence
costs exactly one line in the app rather than breaking anything:

```bash
wrangler secret put NPS_API_KEY        # free, developer.nps.gov/get-started
wrangler secret put AIRNOW_API_KEY     # free, docs.airnowapi.org
```

- Without `NPS_API_KEY`: `/api/programs` serves hand-curated events only, and
  `/api/alerts` serves empty, so the guide renders no road-status or
  chain-control line.
- Without `AIRNOW_API_KEY`: `/api/air` serves nulls and the guide renders no
  AQI line. The smoke-season essentials topic still explains the thresholds.
- `/api/flow` (Merced River at Happy Isles, USGS) is keyless and needs nothing.

Secrets take effect immediately; no redeploy is needed after adding one. Check
with `curl -s https://api.thetalusfieldjournal.com/api/air` and look for a real
`aqi` number instead of `null`.

## 3. Resend setup (this is the gotcha)

Resend won't deliver to arbitrary emails until your sending domain is verified.

**Recommended:** Add `thetalusfieldjournal.com` in Resend → it gives you DNS records to paste into Cloudflare DNS (TXT + MX). Verification usually takes 5–10 minutes.

**Faster, for self-only testing:** edit [workers/src/lib/email.ts:3](workers/src/lib/email.ts) and change `FROM` to `'onboarding@resend.dev'`. Resend's dev sender works without verification but **only sends to the email on your Resend account**. Revert before going live.

## 4. Deploy the Worker

```bash
cd workers
wrangler deploy
```

The `api` subdomain is already attached to this Worker as a **Custom Domain**, which is declared as such in `wrangler.toml` (`pattern = "api.thetalusfieldjournal.com"`, `custom_domain = true`). A Custom Domain creates its own proxied DNS record, so there is no CNAME to add by hand and nothing to do here on a normal deploy.

If you are standing the Worker up in a fresh account instead, two options:

- **Easy:** comment out the `[[routes]]` block in `wrangler.toml`, deploy, and use the auto-generated `talus-field-guide-api.<your-subdomain>.workers.dev` URL for testing. Update `GUIDE_API_BASE` in [page-guide.jsx:10](page-guide.jsx) and `VITE_API_BASE` in [apps/guide/.env.production](apps/guide/.env.production) to point at it.
- **Production-shaped:** attach `api.<your-domain>` to the Worker as a Custom Domain (Cloudflare dashboard → the Worker → Settings → Domains & Routes → Add → Custom Domain), and declare it in `wrangler.toml` in the `custom_domain = true` form.

**Read the config-drift prompt.** Recent wrangler versions compare this file against the deployed Worker and print a diff before asking to continue, warning that deploying "will override the remote configuration with your local one". A `-` entry under `routes` means the deploy would **detach** something that is currently serving: answer `n` and reconcile `wrangler.toml` first. `+` entries under `triggers.crons` or `vars` are the normal case for shipping a config change. A `preview_id` diff on the KV namespaces is noise — `preview_id` is only read by `wrangler dev`, never by the deployed Worker, and the placeholder value in this file is deliberate.

Verify: `curl https://<worker-url>/` should return "Talus Field Guide API. See /api/inventory."

`curl https://<worker-url>/api/inventory` should return JSON with `sold`, `cap`, `monthLabel`, `reopens`.

## 5. Configure the Stripe webhook

In Stripe dashboard (test mode toggle on) → **Developers → Webhooks → Add endpoint**:

- URL: `https://<worker-url>/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`

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

"Every merge" includes commits that touch nothing in the PWA — the nightly
`chore: record nightly Lighthouse run [skip ci]` commit rebuilds this project
too, because `[skip ci]` is a GitHub Actions convention and Cloudflare Pages
does not honor it. That is harmless now: the build is byte-for-byte
reproducible, so an unchanged rebuild produces the same `sw.js` and installed
copies of the guide correctly see no update (see the "nothing in the build may
read the clock" bullet in `apps/guide/CLAUDE.md`, and `npm run check:build`).
If you want to stop spending build minutes on those redeploys anyway, set
**Build watch paths** to `apps/guide/*` under the project's Settings →
Builds & deployments; it is a dashboard setting with no equivalent in the repo.

Manual fallback if a one-off deploy is ever needed:

```bash
cd apps/guide
npm install
npm run build
wrangler pages deploy dist --project-name talus-field-guide
```

The app serves at `https://guide.thetalusfieldjournal.com` (custom domain
attached to the Pages project at launch; the auto-generated
`talus-field-guide.pages.dev` host keeps resolving alongside it). The
`GUIDE_APP_BASE` default in `page-guide.jsx` and the `APP_BASE_URL` var in
`workers/wrangler.toml` both point at the custom domain; the pages.dev origin
stays in the Worker's CORS allowlist (`workers/src/index.ts`) so magic links
already sent against it keep working.

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

## 7a. Cloudflare dashboard settings the repo cannot set

Three settings live only in the Cloudflare dashboard. All three were found
wrong or missing by the August 2026 Search Console audit, and none of them can
be fixed by a commit. Re-check them after any zone-level change.

### www must 301 to the apex

Both hosts are bound as custom domains and both serve 200s, so Search Console
was reporting `https://`, `http://www.` and `https://www.` rows for the same
article, splitting signals three ways.

Routing is asset-first, so the Worker never runs for `/`, for any real file, or
for either sitemap on the www host. A Worker-side guard therefore cannot cover
the whole domain (one exists in `edge/seo.js` as a backstop for SPA routes).
The fix is a zone-level rule, which runs before Workers and assets:

1. Cloudflare dashboard → the zone → **Rules → Redirect Rules → Create rule**.
2. If: `Hostname` `equals` `www.thetalusfieldjournal.com`.
3. Then: **Dynamic** redirect, status **301**, preserve query string, expression:
   `concat("https://thetalusfieldjournal.com", http.request.uri.path)`
4. Confirm **SSL/TLS → Edge Certificates → Always Use HTTPS** is on, so the
   `http://` variants are covered too.

Verify: `curl -sI https://www.thetalusfieldjournal.com/articles/yosemite-in-fall`
returns `301` with a `location:` on the apex, and the apex itself still 200s.

### Managed robots.txt must stay OFF

Cloudflare injects a managed block at the top of the served `robots.txt` that
sets `Content-Signal: search=yes,ai-train=no,use=reference` and `Disallow: /`
for ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider, Applebot-Extended
and meta-externalagent. The repo's own `robots.txt` explicitly **allows** those
same agents, because AI citation is the point. The served file therefore
contradicted itself: same user-agent, `Disallow` in one group and `Allow` in
another, leaving the site's AI-citation policy resting on undefined parser
behavior.

Turn it off: dashboard → the zone → **Security → Settings** → filter by
**Bot traffic** → turn off **"Set your preference to block training in
robots.txt"**. If the Content Signals Policy still appears, uncheck **Display
Content Signals Policy** under Control AI Crawlers on the zone Overview.

Verify: `curl -s https://thetalusfieldjournal.com/robots.txt | head -40` shows
the repo's file with no `Content-Signal` line and no `# BEGIN Cloudflare
Managed Content` block.

### AI Crawl Control must not block what robots.txt allows

robots.txt states a preference; AI Crawl Control enforces. They are separate
layers and can disagree silently. Dashboard → the zone → **AI Crawl Control →
Security** tab → confirm the crawlers the repo allows are set to **Allow**.

### Search Console, after this deploys

1. **Sitemaps** → submit `https://thetalusfieldjournal.com/sitemap.xml`. It is
   now an index; both children should appear with their own row and their own
   discovered/indexed counts. Remove any older standalone submission.
2. Confirm the "Incorrect namespace" error clears on the next read.
3. **Pages → Soft 404** → if any URLs remain, paste them into an issue: the
   repo-side fix needs to know which ones.
4. `sameAs` on the homepage `Organization` is empty because no public profile
   URLs exist anywhere in the codebase. Supply them (social, newsletter archive)
   and they can be added to the entity block.

## 8. Smoke test

1. Open the deployed editorial site → click `Field Guide` → the buy box renders "Buy the guide → $3.99" with the price read live from `/api/inventory` (there is no sold/cap counter; a sold-out month surfaces only as the reopen notice after checkout returns 409).
2. Click buy → Stripe checkout opens. Use test card `4242 4242 4242 4242`, any future date, any CVC, any zip.
3. Payment completes → redirected to `?guide=success` → email arrives within ~30s with a 6-digit code and a magic link.
4. Click the magic link → opens `https://guide.thetalusfieldjournal.com/open?token=...` → "Signing you in…" → redirects to the setup page, then home with four region cards (`valley`, `glacier-mariposa`, `tuolumne`, `hetch-hetchy`).
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
echo "Magic link: https://guide.thetalusfieldjournal.com/open?token=$TOKEN"
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
echo "Magic link: https://guide.thetalusfieldjournal.com/open?token=$TOKEN"
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
- Sign in at `https://guide.thetalusfieldjournal.com/login` with the email and
  code, or use the magic link once.

## Going live (after testing)

- Swap Stripe test keys → live keys (`wrangler secret put STRIPE_SECRET_KEY`).
- Re-create the webhook in Stripe live mode and update `STRIPE_WEBHOOK_SECRET`.
- Make sure Resend domain is verified and `FROM` in [workers/src/lib/email.ts](workers/src/lib/email.ts) points at it.
- Ground-truth the 28 coordinates still marked `TODO: verify on the ground` (15 in [apps/guide/src/content/stops.ts](apps/guide/src/content/stops.ts), 8 in `secret-spots.ts`, 5 in `amenities.ts`) and remove each marker only after standing at the spot. Stops are organized into four regions: `valley`, `glacier-mariposa`, `tuolumne`, `hetch-hetchy`.
- Photos go through the pipeline in [scripts/fetch-guide-photos.mjs](scripts/fetch-guide-photos.mjs) (fetch → review → select → `npm run images` → emit-credits), which also maintains the license credits rendered on the Account page. Wire new files as `photos: [{ src, caption }]` entries on the matching stops.

## 2026 relaunch: enabling the $3.99 paid model

The buy box, checkout route, webhook, KV buyer records, and email delivery are all in the tree; the paid path is enabled purely by configuration. Checklist, in order:

1. **Price.** `GUIDE_PRICE_CENTS = "399"` in [workers/wrangler.toml](workers/wrangler.toml) is the single source of truth. The editorial buy box reads it live from `GET /api/inventory` (`priceCents`) with a static $3.99 fallback in [page-guide.jsx](page-guide.jsx). Change the var, `wrangler deploy`, done. Stripe needs no change alongside it: checkout builds an inline `price_data` line item, so there is no Price object in the dashboard to keep in sync.
2. **KV.** The production namespace `id`s for `GUIDE_BUYERS` and `GUIDE_PROGRAMS` are already filled in `wrangler.toml`. Only the `preview_id`s remain `REPLACE_ME_FOR_LOCAL_DEV`; create preview namespaces (`wrangler kv namespace create ... --preview`) only if you need local `wrangler dev`.
3. **Secrets.** `wrangler secret put` each of: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MAGIC_LINK_SIGNING_SECRET`, `RESEND_API_KEY`. Optionally `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` for push notifications (section 2); they are not launch-blocking, since the app hides the opt-in when they are unset. Rotate or delete `DEV_USERNAME`/`DEV_CODE` before launch; keep `ADMIN_*` as the operator door.
4. **Webhook.** In the Stripe dashboard, add endpoint `https://api.thetalusfieldjournal.com/api/stripe/webhook` for events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, **and** `charge.refunded`; the endpoint's signing secret is `STRIPE_WEBHOOK_SECRET`. Without `charge.refunded`, the refund-revocation branch in [workers/src/routes/stripe.ts](workers/src/routes/stripe.ts) never runs and refunded buyers keep access until the KV record is expired by hand.
5. **Resend domain.** Verify the sending domain for `cory@thetalusfieldjournal.com` in the Resend dashboard **before** going live. With an unverified domain the webhook's email send fails after the buyer has already been charged, and no access code or magic link ever arrives.
6. **Deploy + verify fail-closed traps.** `wrangler deploy`, then `curl https://api.thetalusfieldjournal.com/api/inventory` must show `sold: 0`, `cap: 100`, `priceCents: 399`. The inventory check fails closed: a missing/garbled `GUIDE_MONTHLY_CAP` reads as sold out.
7. **Test-mode pass.** Full smoke test in section 8 (test card 4242…) before swapping to live keys per "Going live". Include a refund: refund the test payment in the Stripe dashboard and confirm the buyer's login stops working.
8. **Editorial re-integration: done.** Every code flip landed in the July 2026 launch-prep branch: `GUIDE_ON_SALE = true` in [page-guide.jsx](page-guide.jsx), the footer link in [components.jsx](components.jsx), the noscript nav link in [index.html](index.html), indexability in [app.jsx](app.jsx) and [edge/seo.js](edge/seo.js), `GUIDE_LISTED = true` in [scripts/gen-seo-artifacts.mjs](scripts/gen-seo-artifacts.mjs), and the Field Guide line in llms.txt. Remaining `GUIDE-LAUNCH` grep hits are historical breadcrumbs, not work. Merging that branch to `main` is the go-live action, so clear steps 1 through 7 first; the full state of play is in [LAUNCH-READINESS.md](LAUNCH-READINESS.md).

   One llms.txt line stays removed because the `/cap` route does not exist in app.jsx; only restore it if that page ships:

   ```
   - [Why the Field Guide is capped](https://thetalusfieldjournal.com/cap): The reasoning behind a hard monthly cap on Field Guide sales.
   ```

No PWA change is needed: [apps/guide/src/routes/Login.tsx](apps/guide/src/routes/Login.tsx) already tries the buyer email + code path first and falls back to dev-login.

## Calendar export (PWA trip page)

**Nothing to deploy or configure.** Putting the trip on a calendar is a single
client-side path: `/trip` → **Review & save the calendar file** renders the plan
to an `.ics` with [apps/guide/src/trip/ics.ts](apps/guide/src/trip/ics.ts) and
hands it to the OS via
[exportTrip.ts](apps/guide/src/trip/exportTrip.ts) (Web Share with a File
first, anchor download as the fallback — iOS standalone PWAs cannot reliably
download blobs). It works fully offline and imports into Apple Calendar, Google
Calendar, and Outlook alike.

There is deliberately **no server-side calendar integration**: no Google OAuth
client, no hosted subscription feed, no refresh tokens in KV. Nothing about a
buyer's calendar reaches the Worker, so there is no consent screen to get
verified and no sensitive scope to justify before launch. The tradeoff is that
the file is a one-time copy — the trip page says so, and the fix is to save the
file again after editing the plan.

Verify: sign in, add a stop or two on `/trip`, open **Review & save the calendar
file**, and confirm the download (or share sheet) produces
`yosemite-trip-<start-date>.ics` that opens in a calendar app with the right
days, times, and a directions link per event.

## Remote photo upload (phone → PR)

The photo pipeline stays git-based (photos deploy as committed static assets
with sharp-generated responsive variants), so the "API" for importing photos
never writes into the site directly. It has two halves:

- **Staging**, on the API Worker: `https://api.thetalusfieldjournal.com/photos`
  is a phone-friendly upload page. Files land untouched in the `talus-photo-inbox`
  R2 bucket behind `/api/photos/*` ([workers/src/routes/photos.ts](workers/src/routes/photos.ts)),
  gated by the `PHOTO_UPLOAD_TOKEN` bearer secret. Uploads are named for their
  subject at upload time (camera-default names and HEIC are rejected with the
  fix in the error message).
- **Ingest**, in CI: [.github/workflows/photo-import.yml](.github/workflows/photo-import.yml)
  downloads everything staged into the gitignored `photo-inbox/` and runs the
  same [scripts/ingest-photos.mjs](scripts/ingest-photos.mjs) used locally
  (EXIF orientation + strip, downscale, mozjpeg, responsive variants, guide
  credits), then opens a PR with the ingest log and the `data.js` / `stops.ts`
  reference snippets. Ingested files are cleared from the inbox; skipped files
  stay staged with the reason in the log.

One-time setup, in order:

1. `cd workers && wrangler r2 bucket create talus-photo-inbox` — the binding is
   already declared in `wrangler.toml`, and a declared-but-missing bucket fails
   the next `wrangler deploy`, so create it first. (R2 must be enabled on the
   Cloudflare account; the free tier is far more than an inbox needs.)
2. `wrangler secret put PHOTO_UPLOAD_TOKEN` — a long random string
   (`openssl rand -hex 24`).
3. Add the **same value** as the GitHub repo secret `PHOTO_UPLOAD_TOKEN`
   (Settings > Secrets and variables > Actions): the workflow presents it to
   pull staged files, so it needs no Cloudflare credentials of its own.
4. Repo Settings > Actions > General: enable **"Allow GitHub Actions to create
   and approve pull requests"**, or the workflow's `gh pr create` is refused.
5. Optional, for the upload page's one-tap **Run import** button: create a
   fine-grained GitHub PAT scoped to this repo with **Contents: read & write**
   (that is the permission `repository_dispatch` requires) and
   `wrangler secret put GITHUB_DISPATCH_TOKEN`. Without it, staged photos wait
   for a manual run of the "Photo import" workflow from the Actions tab.
6. `wrangler deploy`.

Day-to-day use: open `/photos` on the phone, paste the token once (it persists
on the device), pick photos, give each a subject name, upload, tap **Run
import**, then merge the PR it opens and wire the new files where they belong
(the PR body carries the snippets). iPhone HEIC is a non-issue through the
upload page: Safari transcodes library picks to JPEG for web forms, and
anything that arrives as raw HEIC is rejected at upload with instructions,
because the ingest's sharp build has no HEVC decoder.

Verify after setup: `curl -s https://api.thetalusfieldjournal.com/api/photos/pending -H "Authorization: Bearer $TOKEN"`
returns `{"items":[]}`, an upload from the page appears in the staged list, and
a run of the workflow (manual or via the button) opens a PR containing the
processed photo plus its `responsive/` ladder and, for guide photos, the
credits entries.
