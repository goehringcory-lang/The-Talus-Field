# Android testing at an unlisted URL

How to get the Field Guide PWA live at a URL you can type into a phone, without
publishing or linking it anywhere on the editorial site. The app deploys to the
Cloudflare Pages project's auto-generated `pages.dev` URL; the custom domain
(`guide.thetalusfieldjournal.com`) is deliberately **not** attached until launch.
See [DEPLOY.md](DEPLOY.md) for the full production runbook (Stripe, email, DNS).

Why this stays private: the URL is linked from nowhere, appears in no sitemap,
and the app ships both a `noindex, nofollow` meta tag ([apps/guide/index.html](apps/guide/index.html))
and an `X-Robots-Tag: noindex` header ([apps/guide/public/_headers](apps/guide/public/_headers)).
Only someone you give the URL to will find it, and everything past `/login` is
auth-gated anyway.

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

The first run creates the Pages project; the stable URL is
`https://talus-field-guide.pages.dev`. If that project name is globally taken,
pick another; the URL follows the name, and the CORS allowlist in
[workers/src/index.ts](workers/src/index.ts) must then be updated to match.

**Do not attach the custom domain.** Adding `guide.thetalusfieldjournal.com`
to the Pages project is the launch step, deliberately skipped here.

## 3. Test on the phone

1. Open Chrome and type `https://talus-field-guide.pages.dev`.
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
debugging), the request origin is not in the Worker allowlist; see the
`pages.dev` block in [workers/src/index.ts](workers/src/index.ts).
