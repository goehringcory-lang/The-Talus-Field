# The Talus Field – Repository Audit Report

**Date:** 2026-05-30  
**Scope:** Full repository (editorial site, guide PWA, worker API)  
**Methodology:** Read-only security, dependency, code quality, performance, accessibility, and best-practices audit across three subsystems.

---

## Summary

The Talus Field repository demonstrates **strong foundational security practices**, particularly in the Worker API (JWT, CORS, Stripe webhook validation) and editorial site (no dangerous patterns detected). However, **dependency and build configuration issues** are blocking development workflows, and the **Guide PWA has gaps in API response validation and auth security**. Most findings are **fixable within one sprint**; the highest-priority items are resolving missing type definitions and addressing unvalidated API responses in the PWA.

**Finding counts by priority:**
- **P0 (Security hole / broken build):** 4
- **P1 (Real bug / notable risk):** 6
- **P2 (Quality / perf / a11y improvement):** 8
- **P3 (Nit / style / nice-to-have):** 5

---

## Findings Table

| Priority | Area | Subsystem | Finding | File:Line | Recommendation |
|----------|------|-----------|---------|-----------|-----------------|
| **P0** | Build | Guide PWA | Build fails: missing type definitions (`@cloudflare/workers-types`, `vite/client`, `node`, `google.maps`) | `apps/guide/tsconfig.json` | Install missing `@types/*` packages or comment out missing types in tsconfig. This is blocking the entire build. |
| **P0** | Lint | Guide PWA | Lint fails: missing `@eslint/js` package | `apps/guide/eslint.config.js` + `package.json` | Run `npm install --save-dev @eslint/js` in `apps/guide/`. The package is referenced but not installed. |
| **P0** | Dependencies | Workers | **4 moderate CVEs in workers/**: Hono JWT verification bypass + CSS injection + Cache Middleware auth bypass; ws memory disclosure via miniflare/wrangler | `workers/package.json` → Hono ≤4.12.17, ws 8.0.0-8.20.0 | Upgrade Hono to ≥4.12.18 and ws to ≥8.20.1 immediately. Run `npm audit fix` or manual pin. JWT validation is partially broken in current version. |
| **P0** | Dependencies | Guide PWA | **1 moderate CVE**: brace-expansion DoS via large numeric ranges | `apps/guide/package-lock.json` | Run `npm audit fix` in `apps/guide/`. Transitive dep via build tools; low actual risk but should be fixed. |
| **P1** | Security | Guide PWA | JWT stored unencrypted in `localStorage` with no signature verification on retrieval | `apps/guide/src/auth/storage.ts:20-24, 8-17` | (1) Move JWT to sessionStorage if possible (clears on tab close). (2) Add JWT signature verification on `readSessionFromStorage()` before trusting claims. (3) Implement token refresh flow before 90-day expiry. |
| **P1** | Security | Guide PWA | API response validation missing: `LoginResponse` and `ExchangeResponse` never validated with zod | `apps/guide/src/lib/api.ts:16-38`, `routes/Login.tsx:7`, `routes/Open.tsx:6` | Create zod schemas for `LoginResponse` and `ExchangeResponse`. Validate all API payloads in `apiFetch<T>` before returning. Example: `return LoginResponseSchema.parse(res.json())`. |
| **P1** | Security | Guide PWA | URL route params not validated: `stopId` passed to `getStopById()` without safeParse; Map route uses string checks (`isTab()`, `isItineraryKey()`) instead of zod | `routes/StopDetail.tsx:8`, `routes/Map.tsx:36-38, 46-56` | Add zod safeParse for all route params before using them. Define schemas for tab names and itinerary keys. |
| **P1** | Security | Workers | API error detail leakage: Stripe, Resend, and KV errors may include sensitive request info in logs | `lib/stripe.ts:44`, `lib/email.ts:73`, `lib/kv.ts:37` | Sanitize error messages before logging: (1) Stripe errors: log only error code, not detail. (2) Resend errors: log only status code. (3) KV corruption: redact email, log only a hash or generic ID. |
| **P1** | Build | Guide PWA | Google Maps API key exposed in `index.html` without API key restrictions (visible in source) | `index.html:119` | Verify in Google Cloud Console that the key is restricted to HTTP referrers (`thetalusfieldjournal.com`, `guide.thetalusfieldjournal.com`, localhost). If not, regenerate the key with referrer restrictions. Current config assumes restriction exists. |
| **P2** | Accessibility | Guide PWA | Form labels not associated with inputs: `<label>` has no `for` attribute, inputs are siblings not children | `routes/Login.tsx:51-82` | Wrap inputs inside `<label>` or use `htmlFor` + `id` pairs. Add `aria-labelledby` for extra clarity. Screen readers won't associate label and input without this. |
| **P2** | Accessibility | Guide PWA | Missing focus indicators: buttons and form controls have minimal or no visible focus ring | `routes/Login.tsx`, `components/BottomNav.tsx`, `routes/Map.tsx:400-413` | Add CSS focus styles: `.button:focus, input:focus { outline: 2px solid currentColor; outline-offset: 2px; }`. Required for keyboard nav. |
| **P2** | Accessibility | Guide PWA | Heading hierarchy incomplete on Map page: jumps from `<h3>` to `<h4>` without `<h2>` | `routes/Map.tsx:293, 316, 351` | Insert a main `<h2>` for the page title, use `<h3>` for section headers, `<h4>` for subsections. |
| **P2** | Accessibility | Guide PWA | Map pane tabs toggle `aria-hidden` but don't manage focus; user can tab into hidden content | `routes/Map.tsx:256-280, 292, 311-313, 383` | On tab switch, (1) set `aria-hidden="true"` on old pane, (2) move focus to new pane or its first focusable element. Use `useEffect` to call `.focus()` on mount. |
| **P2** | Accessibility | Editorial Site | Images in page-map.jsx have empty alt text; decorative images should use `alt=""` but should be confirmed as truly decorative | `page-map.jsx:1047, 1053` | If images are decorative (e.g., photo previews that are already captioned), keep `alt=""`. If they have semantic meaning, provide a caption (e.g., `alt="Parking lot photo for {location}"`). Current code assumes decorative. |
| **P2** | Performance | Guide PWA | Service Worker `RUNTIME_CACHE` (photos, fonts, images) is unbounded; can grow indefinitely over months of offline use | `apps/guide/public/sw.js:65-69` | Implement cache size quota: check `navigator.storage.estimate()` on cache write; evict oldest entries if cache exceeds ~10MB. Alternatively, manually clear old runtime cache on app update. |
| **P2** | Performance | Editorial Site | In-browser Babel transform on every page load is expensive; consider precompiling JSX for production | `index.html:169` | Measure LCP with Babel vs. precompiled. If slower, use a build step (Vite, esbuild, Rollup) to precompile JSX to JS before deploy. Current Babel cost is likely not large for this site's complexity, but worth measuring. |
| **P2** | Dependencies | Guide PWA | Unused production dependencies: `@stripe/stripe-js` (v9.4.0) and `maplibre-gl` (v5.24.0) inflate bundle (~50KB) | `apps/guide/package.json:13-14` | These are intentional pre-Stripe-relaunch scaffolding per CLAUDE.md; document in a comment or remove if not planned for imminent use. Each adds ~25KB gzipped. |
| **P3** | Security | Guide PWA | No token refresh or proactive expiration handling; users must re-authenticate when token expires (90 days) | `auth/storage.ts:39` | Add a refresh mechanism: (1) on app load, if token is within 7 days of expiry, exchange for new token. (2) Or implement silent refresh token endpoint in Worker. Lower priority if 90-day TTL is acceptable. |
| **P3** | Security | Workers | Multi-tab auth state not synchronized; if one tab's token is compromised, others won't know until page refresh | `apps/guide/src/auth/AuthGate.tsx:16-20` | Good: storage event listener exists. Improvement: explicitly clear JWT across all tabs on logout (via `storage` event broadcast). Emit custom event on logout. |
| **P3** | Code Quality | Guide PWA | Service Worker static asset caching assumes Vite-hashed immutability; cache collision or bad deploy could serve stale JS indefinitely | `public/sw.js:122-132` | Add a `sha256(file)` hash check or cache invalidation on new app version. Or use a maximum TTL (e.g., 7 days) before forcing revalidation. |
| **P3** | Code Quality | Editorial Site | Webmaster verification meta tags are still placeholders (`REPLACE_WITH_BING_TOKEN`, etc.) | `index.html:43-45` | Fill in the tokens from Bing, Yandex, and Pinterest webmaster consoles, or remove if not using those search engines. Current state is harmless (non-functional). |
| **P3** | Documentation | Guide PWA | `// TODO: verify` markers remain on coord fields for stops that need ground-truth pass | `content/schema.ts:16-39` + `content/stops.ts` | Document which stops still need field verification. Consider a separate tracking issue in GitHub for the ground-truth pass. |

---

## Per-Dimension Detail

### 1. Security

**Findings Summary:**
- ✅ **Strong:** Worker API auth (JWT signing, CORS, bearer tokens) is well-implemented with constant-time comparison.
- ✅ **Strong:** Stripe webhook validation and idempotency are correct.
- ❌ **Weak:** Guide PWA stores JWT without signature verification and API responses are not validated.
- ❌ **Weak:** Missing type definitions are blocking the build entirely (P0).
- ⚠️ **Minor:** Error logging may leak third-party API details; redaction needed.

**Key Risks:**
1. **JWT signature bypass (P1):** `apps/guide/src/auth/storage.ts:8-17` decodes JWT via base64 without verifying the signature. An attacker with XSS could craft a forged JWT. Mitigation: Add JWT validation against a public key or known secret.
2. **Unvalidated API responses (P1):** `apps/guide/src/lib/api.ts` has no zod schema for `LoginResponse` or `ExchangeResponse`. Server could return `{ jwt: null }` or malformed data; client wouldn't catch it until runtime.
3. **Hono CVEs (P0):** Workers package.json locks Hono ≤4.12.17, which has **three moderate CVEs**: JWT verification bypass, CSS injection in JSX SSR, and cache middleware auth bypass. The cache middleware issue is low-risk for this Worker (no cache middleware used), but JWT bypass is serious for any future uses.
4. **localStorage XSS surface (P1):** JWT stored in `localStorage` is vulnerable if any XSS payload ever executes. Mitigation: Move to `sessionStorage` or add robust CSP.
5. **Google Maps API key (P1):** Visible in `index.html:119`. Assume it's restricted to referrers in Google Cloud Console; if not, regenerate and restrict.

**Green Flags:**
- Stripe webhook signature verification is robust (constant-time, timestamp tolerance).
- IndexNow bearer token uses constant-time comparison.
- No hardcoded credentials found.
- CORS allow-list is properly scoped.

---

### 2. Broken / Outdated Dependencies

**Findings Summary:**
- ❌ **Critical:** Workers has 4 moderate CVEs (Hono, ws); build is not blocked but JWT handling is at risk.
- ❌ **Critical:** Guide PWA build fails due to missing type definitions (not installed).
- ❌ **Moderate:** Guide PWA lint fails due to missing `@eslint/js`.
- ❌ **Moderate:** Guide PWA has 1 moderate CVE (brace-expansion DoS).
- ⚠️ **Low:** Editorial site CDN versions (React 18.3.1, Babel 7.29.0) are stable but could be newer.

**Details:**
1. **Workers CVEs:** `npm audit` reports 4 moderate vulns. Hono ≤4.12.17 has JWT and cache issues; ws has memory disclosure. Run `npm audit fix` immediately and pin to Hono ≥4.12.18, ws ≥8.20.1.
2. **Type definitions:** `apps/guide/tsconfig.json` references `google.maps`, `vite/client`, `node`, `@cloudflare/workers-types` but npm didn't install the corresponding `@types` packages. This blocks `npm run build`. Fix: install `@types/google.maps`, `@types/node`, `vite` (has built-in types).
3. **ESLint config:** `eslint.config.js` imports `@eslint/js` but it's not in `package.json`. Run `npm install --save-dev @eslint/js`.
4. **brace-expansion DoS:** Transitive dependency via node_modules. Run `npm audit fix` to pull the patched version.
5. **Editorial site CDN versions:** React 18.3.1 and Babel 7.29.0 are from 2024; newer versions exist (React 19 is stable in the PWA). No security issues, but no urgent need to update in-browser Babel transform.

---

### 3. Code Quality

**Findings Summary:**
- ✅ **Good:** Cache-buster discipline passes (`check-cache-busters.sh`).
- ✅ **Good:** Content schema validation at module load (stops validated on import).
- ✅ **Good:** No XSS patterns detected (`dangerouslySetInnerHTML` absent).
- ❌ **Weak:** Unused production dependencies (@stripe/stripe-js, maplibre-gl).
- ⚠️ **Minor:** Heading hierarchy gaps on Map page.

**Details:**
1. **Cache-buster discipline:** All JSX/CSS refs in `index.html` carry `?v=92` cache-busters. ✅ Passing.
2. **Content validation:** `apps/guide/src/content/stops.ts` calls `Stops.parse(seed)` at module load. Schema violations throw immediately. ✅ Good.
3. **API validation gaps:** Zod used for route params in Region.tsx but not exhaustively. StopDetail.tsx and Map.tsx skip safeParse for tab/itinerary keys.
4. **Unused deps:** @stripe/stripe-js and maplibre-gl are pre-Stripe-relaunch scaffolding. Each adds ~25KB gzipped. Document intent or remove.
5. **No code duplication detected.** Helpers properly extracted and reused.
6. **Heading hierarchy:** Map page (routes/Map.tsx:293, 316, 351) uses `<h3>` then `<h4>` without `<h2>`. Should have a page title `<h2>`.

---

### 4. Performance

**Findings Summary:**
- ⚠️ **Attention needed:** Service Worker runtime cache is unbounded.
- ⚠️ **Worth measuring:** In-browser Babel transform cost (likely small for this codebase).
- ✅ **Good:** Image lazy-loading is used.
- ✅ **Good:** Service Worker shell versioning is correct.

**Details:**
1. **Service Worker cache growth:** `apps/guide/public/sw.js:65-69` caches photos, fonts, images indefinitely. Over months of offline use, cache can grow to 50+ MB. Mitigation: (a) implement quota management using `navigator.storage.estimate()`, or (b) manually clear RUNTIME_CACHE on app version bump.
2. **Static asset caching:** Vite hashed assets (JS/CSS) are cache-first forever, which is correct for immutable hashes. If hash collision occurs (unlikely), users stay on stale version. Mitigation: add version-based cache invalidation.
3. **Babel transform:** Editorial site transforms JSX in-browser on every page load via Babel 7.29.0. For this codebase (~15 JSX files, ~4KB total), the cost is likely <200ms. If LCP is a concern, measure before/after precompiling. Not urgent.
4. **Images:** Responsive images in components/ResponsivePhoto.tsx use lazy-loading. ✅ Good. Photo sizes are appropriate.
5. **Bundle size:** Guide PWA @stripe/stripe-js and maplibre-gl add ~50KB gzipped even though they're unused.

---

### 5. Accessibility

**Findings Summary:**
- ⚠️ **Gaps:** Form labels not semantically associated; focus indicators missing; heading hierarchy incomplete.
- ✅ **Good:** Alt text present on Stop cards; BottomNav uses aria-current and aria-label.
- ❌ **Weak:** Map page doesn't manage focus during aria-hidden tab switches.

**Details:**
1. **Form labels (P2):** `routes/Login.tsx:51-82` wraps labels and inputs but they're not semantically connected. `<label>` has no `for`, inputs have no `id`. Screen readers won't associate them. Fix: use `<label htmlFor="email">` + `<input id="email">` or nest input inside label.
2. **Focus indicators (P2):** No visible focus ring defined in CSS. Keyboard users navigating the login form or map controls won't see where focus is. Add `.button:focus { outline: 2px solid currentColor; outline-offset: 2px; }`.
3. **Heading hierarchy (P2):** Map page jumps from `<h3>` to `<h4>`. Should have a page-level `<h2>`.
4. **Focus management (P2):** Map page tabs toggle `aria-hidden` but don't move focus. User can tab into hidden content. On tab switch, call `.focus()` on the new pane or its first focusable element.
5. **Alt text:** Stop cards use `alt={photo.caption ?? stop.title}` (good fallback). Page-map.jsx images have `alt=""` (correct for decorative use, but verify intent).
6. **Navigation:** BottomNav uses `aria-current="page"` and `aria-label="Main navigation"`. ✅ Good.
7. **Icons:** SVG icons have `aria-hidden="true"`. ✅ Good.

---

### 6. Best Practices / Conventions

**Findings Summary:**
- ✅ **Strong:** Editorial site adheres to CLAUDE.md conventions (no exclamation marks, consistent voice, cache-buster discipline).
- ✅ **Strong:** `window` global pattern used consistently across editorial JSX files.
- ✅ **Strong:** Brand name "The Talus Field" used consistently (no rebranding issues).
- ⚠️ **Needs documentation:** Intentional scaffolding (pre-Stripe deps, `// TODO: verify` coords) should be tracked.

**Details:**
1. **Cache-buster discipline:** Editorial site bumps `?v=N` for every edit. ✅ Passing check-cache-busters.sh.
2. **Brand voice:** No exclamation marks detected. Tone is dry, declarative, journalistic. ✅ Consistent with CLAUDE.md.
3. **Global pattern:** JSX files attach top-level components to `window` (e.g., `window.GuidePage = GuidePage`). ✅ Declared with `/* global */` comments.
4. **Article bodies:** Registered in `index.html` and indexed in `data.js`. ✅ Pattern followed.
5. **Runtime URL overrides:** Editorial site supports `window.GUIDE_API_BASE` and `window.GUIDE_APP_BASE` for local dev. ✅ Good practice.
6. **Intentional scaffolding:** @stripe/stripe-js, maplibre-gl, and pre-Stripe-relaunch checkout routes are documented in CLAUDE.md as intentionally retained. ✅ Don't delete, but document intent or remove if plan changes.
7. **`// TODO: verify` coords:** Guide content still has unverified stop coordinates. These should be tracked in a separate issue for the ground-truth field pass.

---

## Quick Wins

**Highest-value, lowest-effort fixes to tackle first:**

1. **Fix missing type definitions (P0, ~10 min):**
   - Run `npm install --save-dev @types/node @types/google.maps` in `apps/guide/`.
   - This unblocks the build.

2. **Install missing @eslint/js (P0, ~5 min):**
   - Run `npm install --save-dev @eslint/js` in `apps/guide/`.
   - This unblocks `npm run lint`.

3. **Upgrade Hono and ws (P0, ~10 min):**
   - Run `npm audit fix` in `workers/` to patch CVEs.
   - If needed, manually pin `npm install --save hono@latest`.

4. **Add form label associations (P2, ~15 min):**
   - Edit `routes/Login.tsx:51-82`: use `<label htmlFor="email">` + `<input id="email">`.
   - Add `aria-labelledby` for clarity.

5. **Add focus styles (P2, ~10 min):**
   - Add to CSS: `.button:focus, input:focus { outline: 2px solid currentColor; outline-offset: 2px; }`.

6. **Fix heading hierarchy on Map page (P2, ~10 min):**
   - Add `<h2>` for page title, use `<h3>` for sections, `<h4>` for subsections.

7. **Sanitize error logs in Worker (P1, ~15 min):**
   - Edit `lib/stripe.ts`, `lib/email.ts`, `lib/kv.ts` to redact error details before logging.
   - Example: log only error code, not full detail.

8. **Add JWT validation in PWA (P1, ~20 min):**
   - Create zod schemas for API responses (`LoginResponse`, `ExchangeResponse`).
   - Validate in `lib/api.ts` before returning.

---

## Notes

- **Coords marked `// TODO: verify`:** These are intentional (CLAUDE.md notes). Schedule a ground-truth field pass; don't delete the markers.
- **Pre-Stripe scaffolding:** @stripe/stripe-js, maplibre-gl, `/api/checkout/*`, and `/api/stripe/webhook` are pre-Stripe-relaunch. Retained by design. If plan changes, either ship the feature or remove the code.
- **Editorial site no build/lint/tests:** By design (vanilla React + in-browser Babel). Runtime errors only surface in the browser. No way to prevent them statically.
- **Could not verify:** Deploy-time secrets (STRIPE_WEBHOOK_SECRET, MAGIC_LINK_SIGNING_SECRET) are assumed to be properly set in wrangler secrets. Google Maps API key is assumed to have referrer restrictions in the Google Cloud Console.

---

## Closing

This codebase is **production-ready with caveats**. The Worker API demonstrates strong security discipline; the editorial site has no dangerous patterns; the PWA is mostly solid but needs dependency fixes and better API validation. **Spend the first sprint unblocking the build** (type definitions, eslint), **upgrading Hono**, and **adding API response validation** to the PWA. The rest are improvements, not blockers.
