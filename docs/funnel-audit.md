# Funnel Audit — The Talus Field

_Last reviewed: 2026-05-29. Reflects the editorial site after the free-gate / newsletter-capture pass and the article de-duplication pass (index.html `?v=90`)._

The site runs a free, list-growth funnel: email capture is the primary conversion, and the interactive map is the lead magnet. GA4 property is `G-Y5W91X1XJ5` (loaded in `index.html`). All conversion events route through one helper, `window.track(name, params)`, defined early in `index.html`.

## 1. Scorecard

| Surface | Type | Status | Tracked (GA4) |
|---|---|---|---|
| Home newsletter strip | Newsletter | Wired | `newsletter_signup` · `home_strip` |
| Newsletter page form | Newsletter | Wired | `newsletter_signup` · `newsletter_page` |
| Article mid-body unit | Newsletter (slim) | Wired | `newsletter_signup` · `article_mid` |
| Article end block | Newsletter + map (combined) | Wired | `newsletter_signup` · `article_end` |
| Article exit-intent modal | Newsletter | Wired | `newsletter_signup` · `article_exit_intent` |
| Map gate | Newsletter + gate | Wired (new) | `newsletter_signup` · `map_gate` |
| Guide free gate | Newsletter + gate | Wired (new) | `newsletter_signup` · `guide_gate` |
| Guide page footer strip | Newsletter | Wired | `newsletter_signup` · `guide_footer` |
| Footer "Field Guide" link | Guide CTA | Wired | `guide_cta_click` · `footer_guide_link` |
| Guide "Get free access" button | Guide CTA | Wired | `guide_cta_click` · `guide_gate` |
| Home map callout | Map CTA | Wired | Conversion measured at the gate |
| Article end block (map half) | Map CTA | Wired | Unlock fires with `article_end` signup |
| Kit affiliate links | Affiliate | **34 of 35 are dead `#` placeholders** | `affiliate_click` (fires only when a real link exists) |
| Webmaster verification tokens | SEO | **Placeholder** (`REPLACE_WITH_*`) | n/a |

## 2. Newsletter capture

All forms POST to `https://buttondown.email/api/emails/embed-subscribe/goehring` into a named popup window. Because the popup gives the page no success signal, the GA4 event and the local `tfg.nl.subscribed` flag fire **optimistically on submit** (these count attempted signups, not confirmed ones). The shared handler is `window.trackNewsletterSubmit(location, tag)` in `components.jsx`; `NewsletterInline` takes `location` (the unique GA4 id) and `tag` (Buttondown segmentation) props.

| Placement | File | `location` | Buttondown `tag` |
|---|---|---|---|
| Home "From the Editor" strip | `page-home.jsx` | `home_strip` | `home` |
| Newsletter page | `page-newsletter-contact.jsx` | `newsletter_page` | `newsletter-page` |
| Article mid-body (portal, slim) | `page-article.jsx` | `article_mid` | `article-mid` |
| Article end (combined w/ map) | `page-article.jsx` (`NewsletterMapBlock`) | `article_end` | `article-end` |
| Article exit-intent modal | `components.jsx` (`ExitIntentNewsletter`) | `article_exit_intent` | `exit-intent` |
| Map gate | `page-map.jsx` (`MapGate`) | `map_gate` | `map-gate` |
| Guide free gate | `page-guide.jsx` | `guide_gate` | `guide-free` |
| Guide footer strip | `page-guide.jsx` | `guide_footer` | `guide` |

Exit-intent shows at most once per 14 days (`tfg.nl.exit.seen`) and never after any signup (`tfg.nl.subscribed`). Desktop trigger is the cursor leaving toward the browser chrome; touch devices fall back to a scroll-depth + dwell heuristic.

### 2.1 Article redundancy review

The first capture pass stacked four asks on a long article: a full `.nlbox` newsletter form mid-body, a standalone map CTA box, a **second, visually identical** `.nlbox` newsletter form at the end, then the exit-intent modal. Because the map gate is itself a Buttondown newsletter signup, the map CTA and the end newsletter box were effectively the same ask back-to-back, and the mid and end boxes were the same treatment twice. It read as doubled.

The article template now carries three **differentiated** touchpoints:

| Placement | Treatment | Job |
|---|---|---|
| Mid-body | `NewsletterInline variant="slim"` — left-rule, no border, no Dispatch tab | Light in-flow newsletter nudge |
| End | `NewsletterMapBlock` — full bordered box, "Free map" tab | One combined ask: subscribe **and** unlock the map |
| Exit | `ExitIntentNewsletter` modal | Catch-all on the way out |

`NewsletterMapBlock` folds the old standalone map CTA into the end newsletter box: a single submit fires `newsletter_signup` (`article_end`), sets `tfg.nl.subscribed`, and sets `tfg.map.unlocked` (same optimistic pattern as the guide gate), with a secondary "Open the map" link for readers who already subscribed. The slim mid nudge vs. the bordered end block is the visual contrast that stops them reading as one repeated box. Home and guide pages were left unchanged: their newsletter and map surfaces are already spaced apart and framed distinctly.

## 3. Guide CTA

The `/guide` page is a **free email-gate** (no price, no scarcity bar, no monthly cap). Submitting the email subscribes via Buttondown, sets `tfg.map.unlocked`, and fires both `newsletter_signup` (`guide_gate`) and `guide_cta_click` (`guide_gate`). Links that navigate to `/guide` (currently the footer "Field Guide" link) fire `guide_cta_click` with their own `location`. The "Existing buyer? Sign in" link to the PWA is retained. The Worker's Stripe checkout/webhook code is untouched (dormant scaffolding) and is no longer reachable from the editorial UI; `/api/inventory` no longer has a caller here.

## 4. Map

The standalone map was removed from the header nav, the home hero, and indexing exposure, and is now reachable only through CTAs (home callout, the combined article end block, guide page). The `/map` route renders `MapGate` until the reader signs up; one Buttondown signup sets `localStorage['tfg.map.unlocked']` and reveals the existing interactive map (all pins, filtering, and trip-builder intact). This is a deliberately bypassable soft gate for a free lead magnet; it fails open if `localStorage` is unavailable. The map keeps `robots: noindex, nofollow`, which is set in **two** places that must stay in sync: `app.jsx` (`buildSeo`) and `functions/_middleware.js` (`seoForPath`). `/map` is intentionally absent from `sitemap.xml`.

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
