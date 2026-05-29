# Funnel Audit — The Talus Field

_Last reviewed: 2026-05-29. Reflects the editorial site after the free-gate / newsletter-capture pass (index.html `?v=89`)._

The site runs a free, list-growth funnel: email capture is the primary conversion, and the interactive map is the lead magnet. GA4 property is `G-Y5W91X1XJ5` (loaded in `index.html`). All conversion events route through one helper, `window.track(name, params)`, defined early in `index.html`.

## 1. Scorecard

| Surface | Type | Status | Tracked (GA4) |
|---|---|---|---|
| Home newsletter strip | Newsletter | Wired | `newsletter_signup` · `home_strip` |
| Newsletter page form | Newsletter | Wired | `newsletter_signup` · `newsletter_page` |
| Article mid-body unit | Newsletter | Wired (new) | `newsletter_signup` · `article_mid` |
| Article end block | Newsletter | Wired | `newsletter_signup` · `article_end` |
| Article exit-intent modal | Newsletter | Wired (new) | `newsletter_signup` · `article_exit_intent` |
| Map gate | Newsletter + gate | Wired (new) | `newsletter_signup` · `map_gate` |
| Guide free gate | Newsletter + gate | Wired (new) | `newsletter_signup` · `guide_gate` |
| Guide page footer strip | Newsletter | Wired | `newsletter_signup` · `guide_footer` |
| Footer "Field Guide" link | Guide CTA | Wired | `guide_cta_click` · `footer_guide_link` |
| Guide "Get free access" button | Guide CTA | Wired | `guide_cta_click` · `guide_gate` |
| Home map callout / article map CTA | Map CTA | Wired (new) | Conversion measured at the gate |
| Kit affiliate links | Affiliate | **34 of 35 are dead `#` placeholders** | `affiliate_click` (fires only when a real link exists) |
| Webmaster verification tokens | SEO | **Placeholder** (`REPLACE_WITH_*`) | n/a |

## 2. Newsletter capture

All forms POST to `https://buttondown.email/api/emails/embed-subscribe/goehring` into a named popup window. Because the popup gives the page no success signal, the GA4 event and the local `tfg.nl.subscribed` flag fire **optimistically on submit** (these count attempted signups, not confirmed ones). The shared handler is `window.trackNewsletterSubmit(location, tag)` in `components.jsx`; `NewsletterInline` takes `location` (the unique GA4 id) and `tag` (Buttondown segmentation) props.

| Placement | File | `location` | Buttondown `tag` |
|---|---|---|---|
| Home "From the Editor" strip | `page-home.jsx` | `home_strip` | `home` |
| Newsletter page | `page-newsletter-contact.jsx` | `newsletter_page` | `newsletter-page` |
| Article mid-body (portal) | `page-article.jsx` | `article_mid` | `article-mid` |
| Article end | `page-article.jsx` | `article_end` | `article-end` |
| Article exit-intent modal | `components.jsx` (`ExitIntentNewsletter`) | `article_exit_intent` | `exit-intent` |
| Map gate | `page-map.jsx` (`MapGate`) | `map_gate` | `map-gate` |
| Guide free gate | `page-guide.jsx` | `guide_gate` | `guide-free` |
| Guide footer strip | `page-guide.jsx` | `guide_footer` | `guide` |

Exit-intent shows at most once per 14 days (`tfg.nl.exit.seen`) and never after any signup (`tfg.nl.subscribed`). Desktop trigger is the cursor leaving toward the browser chrome; touch devices fall back to a scroll-depth + dwell heuristic.

## 3. Guide CTA

The `/guide` page is a **free email-gate** (no price, no scarcity bar, no monthly cap). Submitting the email subscribes via Buttondown, sets `tfg.map.unlocked`, and fires both `newsletter_signup` (`guide_gate`) and `guide_cta_click` (`guide_gate`). Links that navigate to `/guide` (currently the footer "Field Guide" link) fire `guide_cta_click` with their own `location`. The "Existing buyer? Sign in" link to the PWA is retained. The Worker's Stripe checkout/webhook code is untouched (dormant scaffolding) and is no longer reachable from the editorial UI; `/api/inventory` no longer has a caller here.

## 4. Map

The standalone map was removed from the header nav, the home hero, and indexing exposure, and is now reachable only through CTAs (home callout, in-article CTA, guide page). The `/map` route renders `MapGate` until the reader signs up; one Buttondown signup sets `localStorage['tfg.map.unlocked']` and reveals the existing interactive map (all pins, filtering, and trip-builder intact). This is a deliberately bypassable soft gate for a free lead magnet; it fails open if `localStorage` is unavailable. The map keeps `robots: noindex, nofollow`, which is set in **two** places that must stay in sync: `app.jsx` (`buildSeo`) and `functions/_middleware.js` (`seoForPath`). `/map` is intentionally absent from `sitemap.xml`.

## 5. Affiliate links

`data.js` holds 35 affiliate slots across the Kit and Directory. **34 are dead `#` placeholders** awaiting real URLs (e.g. "20-25L pack with a hip belt", "Squeeze water filter", and ~32 others). Only one is live: **The John box** (`myjonbox.com`, `affNetwork: "none"`). Outbound clicks fire `affiliate_click` via a delegated capture-phase listener in `app.jsx` on any `a[data-aff-network]`; params are `aff_network`, `aff_list`, `aff_item_slug`, `aff_name`, `destination`. Article bodies carry no affiliate links by editorial policy.

**Recommendation:** fill the 34 placeholders or hide their buttons until real URLs exist, so the funnel does not present non-functional CTAs.

## 6. GA4 events

| Event | Params | Fired from |
|---|---|---|
| `newsletter_signup` | `location`, `tag` | every newsletter form (see §2) |
| `guide_cta_click` | `location` | guide free-access button; footer "Field Guide" link |
| `affiliate_click` | `aff_network`, `aff_list`, `aff_item_slug`, `aff_name`, `destination` | delegated listener on `a[data-aff-network]` |

All three go through `window.track`, which is a no-op when `gtag` is blocked or unavailable.

## 7. SEO / verification debt (pre-existing)

- Webmaster verification tokens are still placeholders in `index.html`: `msvalidate.01`, `yandex-verification`, `p:domain_verify` all read `REPLACE_WITH_*`. Bing, Yandex, and Pinterest are therefore unverified.
- SEO is rendered from **two** sources that mirror each other: `app.jsx` (`buildSeo`, client) and `functions/_middleware.js` (`seoForPath`, Cloudflare Pages edge). Any route add/remove or robots change must be made in both, plus `sitemap.xml`.

## 8. Open gaps / next steps

- In the GA4 admin UI, mark `newsletter_signup`, `guide_cta_click`, and `affiliate_click` as **key events** so they show as conversions.
- Buttondown success is unverifiable client-side (popup submit). If confirmed-signup accuracy matters later, proxy the subscribe through the Worker (it can hold a Buttondown API token) and fire events on the real response.
- Fill or hide the 34 placeholder affiliate links.
- Replace the three webmaster verification tokens.
