---
name: verify
description: Drive the editorial site in headless Chromium to verify a change at runtime (map, gate flows, page rendering).
---

# Verifying the editorial site in a headless browser

## Serve

```bash
python3 -m http.server 8765 &   # matches the Google Maps key's allowed referrers
```

There are no route rewrites: `/map` 404s. Always load `http://localhost:8765/index.html`
and navigate in-SPA (e.g. `page.click('.nav__primary')` reaches `/map`).

## Launch (Claude Code remote env)

- Playwright is installed globally: `import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'`,
  run with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
- Launch with `args: ['--no-sandbox']` and NO proxy config. The agent proxy
  rejects Chromium's plain-HTTP requests (405) and resets its CONNECTs, so
  Chromium cannot use it directly.
- To give the page HTTPS egress (Google Maps, etc.), intercept and relay via
  curl, which does trust the proxy channel:

```js
await ctx.route(/^https:/, (route) => curlFulfill(route)); // regex, NOT 'https://**' (glob fails to match)
```

`curlFulfill` = write postDataBuffer to a temp file, `curl -sS --compressed -L
-D headers -o body [-X method] [--data-binary @post] url`, parse the LAST
header block (redirects stack blocks) for status/content-type, `route.fulfill`.
Maps needs POST relayed too (auth RPCs), and first paint through the relay can
take >30 s — use generous timeouts.

- Always abort `buttondown.com` (never let a test signup publish) and
  `googletagmanager`/`google-analytics` (policy-denied anyway).

## Gotchas

- Newsletter/map unlock state: seed `localStorage['tfg.map.unlocked'] = '1'`
  (or `tfg.nl.subscribed`) before SPA-navigating to skip the map gate.
- Geolocation: `getCurrentPosition` is called with `maximumAge: 60000`, so a
  second `ctx.setGeolocation` in the same page can return the cached fix —
  use a fresh context per position under test.
- A map marker outside the current viewport counts as "hidden" to Playwright;
  assert with `state: 'attached'`.
