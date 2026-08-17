# Android testing at an unlisted URL

How to get the Field Guide PWA live at a URL you can type into a phone. This
runbook was written for pre-launch testing, when the custom domain was
deliberately left unattached; `guide.thetalusfieldjournal.com` has been
attached and serving since the launch cutover, and the Pages project's
auto-generated `pages.dev` URL keeps resolving alongside it, so the flow below
still works for phone testing.
See [DEPLOY.md](DEPLOY.md) for the full production runbook (Stripe, email, DNS).

Why this stayed private pre-launch: the `pages.dev` URL was linked from
nowhere and appears in no sitemap, and the app ships both a `noindex, nofollow`
meta tag ([apps/guide/index.html](apps/guide/index.html))
and an `X-Robots-Tag: noindex` header ([apps/guide/public/_headers](apps/guide/public/_headers)).
Everything past `/login` is auth-gated anyway.

All commands assume `wrangler login` has been run.

## 1. Deploy the API Worker (one-time setup)

The PWA's production build points at `https://api.thetalusfieldjournal.com`
([apps/guide/.env.production](apps/guide/.env.production)), so the Worker goes
to its permanent home. The API domain is invisible infrastructure; it does not
publish the app anywhere.

```bash
cd workers
npm install
wrangler kv namespace create GUIDE_BUYERS            # paste id into wrangler.toml
wrangler kv namespace create GUIDE_BUYERS --preview  # paste preview_id into wrangler.toml

# Minimum secrets for dev-login testing. Stripe / Resend / IndexNow secrets
# can wait; routes that need them stay dormant.
wrangler secret put MAGIC_LINK_SIGNING_SECRET   # 32+ char random string, signs the JWTs
wrangler secret put DEV_USERNAME                # e.g. "preview"
wrangler secret put DEV_CODE                    # any string you'll remember
wrangler secret put ADMIN_USERNAME              # optional second pair
wrangler secret put ADMIN_CODE

wrangler deploy
```

DNS: in the Cloudflare dashboard for `thetalusfieldjournal.com`, add a proxied
CNAME `api` → `talus-field-guide-api.<your-subdomain>.workers.dev` so the
`[[routes]]` pattern in [workers/wrangler.toml](workers/wrangler.toml) resolves.

Sanity check:

```bash
curl https://api.thetalusfieldjournal.com/
# → "Talus Field Guide API. See /api/inventory."
```

## 2. Deploy the PWA to its unlisted Pages URL

```bash
cd apps/guide
npm install
npm run build                                   # tsc -b && vite build → dist/
wrangler pages deploy dist --project-name talus-field-guide
```

The first run creates the Pages project; the stable auto-generated URL is
`https://talus-field-guide.pages.dev`, which keeps resolving alongside the
custom domain. If that project name is globally taken, pick another; the URL
follows the name, and the CORS allowlist in
[workers/src/index.ts](workers/src/index.ts) must then be updated to match.

The custom domain `guide.thetalusfieldjournal.com` was attached to the Pages
project at the launch cutover and is the app's public URL; attaching it was
the launch step this runbook used to skip.

## 3. Test on the phone

1. Open Chrome and type `https://guide.thetalusfieldjournal.com` (or the
   unlisted `https://talus-field-guide.pages.dev`; both serve the app).
2. You land on `/login`. Enter the dev username + code; the form falls back to
   `/api/auth/dev-login` automatically.
3. Install: the in-app install prompt should appear, or use Chrome menu →
   **Install app** / **Add to Home screen**.
4. Launch from the home-screen icon. It should open standalone, no browser chrome.
5. Offline check: browse a region and a couple of stops, enable airplane mode,
   re-open the app. The shell and visited content should load from the service
   worker cache.
6. Update check: run a new `wrangler pages deploy`, reopen the installed app.
   The update banner should offer the new build.

If login fails with a CORS error (check via `chrome://inspect` remote
debugging), the request origin is not in the Worker allowlist; see the origin
allowlist in [workers/src/index.ts](workers/src/index.ts) (`APP_BASE_URL`
covers the custom domain, and the `pages.dev` block covers the auto-generated
hosts).
