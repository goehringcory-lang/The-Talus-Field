# The Talus Field — Conversion & Growth Strategy Plan

July 2026. Internal working document; strategy only, no code. Implementation follows the phased roadmap in §5. Successor to `GROWTH-AUDIT.md` (June 2026): that document recorded the SEO/monetization posture and its quick-fix pass; this one designs the reader-to-subscriber-to-buyer funnel in detail.

## Context

The Talus Field Journal (thetalusfieldjournal.com) is a static, no-bundler React editorial site about Yosemite, written by Cory Goehring, a resident naturalist (El Portal, 20 seasons in the park). Most traffic arrives from Google on single planning queries. Goals, in funnel order: (1) engagement past one page, (2) return visits between trips, (3) Buttondown newsletter conversion (primary near-term), (4) groundwork for a paid product — which already exists in the tree: the $19 Field Guide PWA with a finished sales page and live Stripe checkout, currently hidden behind `noindex` and `GUIDE-LAUNCH` markers.

Method note: this audit was done against the repo source (which is exactly what the git-connected Cloudflare build deploys from `main`) plus the nightly Lighthouse history in CI, with file-and-line evidence throughout. The site is further along than the strategy brief assumed: **ten** newsletter touchpoints, Buttondown tag segmentation, exit-intent, a map lead-magnet gate, and eight live homegrown A/B tests already exist. The plan below is therefore about **sharpening, sequencing, and fixing three structural leaks** — not adding basics.

---

## 1. Executive summary — the five highest-leverage moves

1. **Fix the map gate: gate the trip builder, not the view.** The interactive map — the site's best engagement asset and its lead magnet — currently renders fully blurred behind a non-dismissable email wall (`page-map.jsx:1082`, comment at `:352`: "the whole map sits behind a newsletter signup"). Shared trip links (`/map?trip=...`) land on the blur too, killing the built-in referral loop. Move the gate to the moment of intent (first "add to trip" / save) and let everyone browse.
2. **Fix LCP.** Nightly Lighthouse shows homepage LCP at **11–12s** and article LCP ~8s (throttled mobile), performance score ~0.6. Readers arriving from Google are bouncing before paint. Self-host React (currently unpkg UMD), stop loading all 15 page bundles on every route, and put the four Google Font families on a diet. This is the single biggest engagement lever.
3. **Make capture contextual and interest-tagged.** Keep the existing placement hierarchy (inline end-of-article primary, mid-article secondary, exit-intent tertiary) but vary the offer by article category and pass a `cat-*` interest tag to Buttondown alongside the existing placement tag. This turns the list from "emails" into a segmented audience you can launch a product to.
4. **Ship the between-trips hook: a weekly "This Week in the Park" conditions page**, fed by the same material as the Sunday letter. It gives the newsletter a concrete promise, gives subscribers a reason to exist between trips, and gives Google a freshness signal.
5. **Put /guide into public waitlist mode now.** The sales page is built and checkout works; it's just hidden. Un-hide it with a "launch list" capture (tag `guide-waitlist`), run a short warming sequence, and launch to a warm segment instead of a cold list.

---

## 2. Live-site audit findings

### What's working — preserve all of this

- **Content and internal linking are genuinely strong.** 121 hand-placed cross-links across 32 article bodies; a smart related-articles rail (`page-article.jsx:196–361`) that prefers same-category *unread* articles using `tfg.read.done`; a "resume reading" band on the homepage. Don't touch the logic; extend it.
- **Hub curation is editorially excellent.** `/planning` hand-curates 13 articles into four narrative parts ("Before you book" → "When you arrive" → Half Dome → seasonal calendar) ending in a newsletter unit. `/checklist` condenses articles into an actionable list with links back to the reasoning, plus a capture unit.
- **Capture infrastructure already exists and is instrumented.** Ten placements, all firing `newsletter_impression` (40% viewport) and `newsletter_signup` with `location`, `tag`, `variant` params. Buttondown tags already flow via hidden inputs (`home`, `article-mid`, `article-end`, `exit-intent`, `map-gate`, `newsletter-page`, `guide`).
- **Live-park elements are a differentiator in place**: NWS weather links and live NPS entrance waits in the masthead (`components.jsx:206–255`), a four-camera webcam strip on the homepage. These are retention raw material.
- **Trust plumbing exists**: `Person` JSON-LD with `jobTitle: "Field journalist and naturalist"`, `rel="author"` bylines on every article, an About page with unusually credible copy ("If a piece of gear is here, I have walked at least fifty miles in it").
- **CLS is essentially zero** (reserved masthead slots, explicit aspect ratios). The performance problem is LCP only.
- **The product is 90% launched already**: `/guide` is a complete long-form sales page with a sticky buy box, live price from the Worker, Stripe checkout, sold-out states, and a footer capture unit.

### What's leaking

| Leak | Evidence | Cost |
|---|---|---|
| LCP 11–12s home / ~8s articles | `scripts/data/lighthouse-history.json`, every nightly run | Search landers bounce before first paint; rankings pressure |
| Map view-walled | `page-map.jsx:352–358, 1082`; non-dismissable `MapAccessGate` | Kills browse engagement, SEO value, and shared-trip referrals; CLAUDE.md's stated intent ("map browsable by everyone, builder gated") no longer matches the code |
| All 15 page bundles load on every route | `index.html:299–320`; React UMD from unpkg `:185–186` | Main cause of slow LCP/TBT alongside 4 font families |
| `/kit` and `/films` have zero capture | grep: only `page-checklist.jsx` has `NewsletterInline` among those pages | Kit traffic is high-intent trip-prep traffic going uncaptured |
| Tags are placement-based only | hidden `tag` inputs name *where* someone signed up, not *what they care about* | Can't segment the launch email; goal 4 suffers |
| Signup tracking is optimistic | iframe embed POST; success assumed on submit (`components.jsx:538–550`) | Conversion numbers are inflated by typos/failures; no error state for the reader |
| Author bio is thin at point of read | byline bio: "Writes from El Portal, California." (`data.js:24–33`) | The 20-season naturalist credential — the differentiator — is invisible where trust is earned |
| 8 concurrent A/B tests | `hero_actions`, `home_webcams`, `callout_bands`, `mobile_cta`, `exit_copy`, `article_toc`, `mid_copy`, `nl_valueprop` | On editorial-site traffic none will reach significance; they add variance to every metric |
| No recurring on-site reason to return | newsletter promise is "a short note on Sundays, when there is something to say" | Between-trips retention has no destination page; the promise is abstract |
| `Person` schema has no `sameAs` | `index.html:158–176`, explicit comment | E-E-A-T signal incomplete |

---

## 3. Funnel diagnosis

**Goal 1 — Engagement (read past one page).**
The reader lands from Google on an article and waits ~8s for LCP on a mid mobile device; a meaningful share never sees the dropcap. Those who stay get good pathways (inline links, related rail), but: the TOC is off by default (A/B bucket b only), long guides offer no orientation; hub membership is invisible from inside an article — a reader on one of the 13 planning-cluster articles gets no "this is part 2 of the Planning Guide" pathway back up to the hub. The map, the most engaging interactive asset, is a wall.

**Goal 2 — Retention (return between trips).**
The masthead's live weather/waits and the webcam strip are the right instincts, but there is no canonical, weekly-fresh page to return *to*, and the newsletter's promise ("when there is something to say") is honest but doesn't name a concrete recurring value. `tfg.read.resume` brings back mid-article readers; nothing brings back finished ones. Films and Directory are evergreen, not recurring.

**Goal 3 — Newsletter conversion.**
Volume of touchpoints is not the problem; specificity is. Most units lead with the map unlock — good for planners, irrelevant on a wildlife essay. The end-of-article unit (highest-intent moment) runs one generic value prop under A/B. Kit/films readers get no offer at all. The map gate converts, but it converts *coerced* emails at the top of the map funnel (list-quality risk: people who wanted a map, not a letter). And because the embed posts blind into an iframe, measured conversion ≠ actual list adds.

**Goal 4 — Future product.**
Strongest position of all four: the product page, checkout, inventory cap, and even the `guide` tag exist. What's missing is *audience preparation*: no public waitlist, no interest-based segmentation to know who to launch to, no warming sequence, and the page is invisible (noindex, no nav/footer links) so it accrues zero SEO age or curiosity before launch.

---

## 4. Full recommendations

### R1 — Un-wall the map; gate the trip builder at the moment of intent

**Recommendation:** Replace the full-view `MapAccessGate` with a browse-free map; show the gate only when an unsubscribed visitor first tries to add a stop to a trip / open a suggested trip / save. Shared `/map?trip=` links always render the shared trip read-only without a gate.
**Location:** `/map` (`page-map.jsx` — gate trigger moves from mount, `:1082`, to first `trip_add`-class action).
**Serves goals:** 1 (engagement), 3 (newsletter quality), 2 (shared trips recirculate).
**Why it works:** Gating at intent converts people who want the *ongoing* value (a saved, evolving trip) rather than people bouncing off a blur; those emails are the future guide buyers. It also restores the map as an engagement and referral surface: today a friend opening a shared trip hits an email wall, which is where the referral loop dies. This also re-aligns code with the documented design intent ("the trip builder is newsletter-gated," CLAUDE.md).
**Tradeoff accepted:** Fewer forced signups per map visit in the short term. Accepted because the gate's marginal signups are the lowest-quality tag on the list, and map browse/share growth compounds toward every other goal.
**Impact:** High. **Effort:** Low–Medium (state trigger + copy; gate component already exists).
**Measure:** `/map` bounce rate and `map_pin_click` volume before/after; `newsletter_signup{location: map_view_gate→trip_gate}` rate per map session; `trip_share` → new-visitor sessions.

### R2 — LCP performance pass

**Recommendation:** A dedicated pass to move article LCP under ~3s: self-host the React UMD files (drop the unpkg third-party origin), load only the active route's `page-*.js` eagerly and lazy-load the rest (the `loadArticleBody` pattern already proves the approach in-repo), reduce Google Fonts from four families to the two that carry the design (subset if possible), and audit the hero image preload path on article pages.
**Location:** `index.html` (script block `:299–320`, React `:185–186`, fonts `:87–89`); no per-article work.
**Serves goals:** 1 (primary), 3 (more readers reach the capture units at all).
**Why it works:** Every downstream conversion is multiplied by "did the page paint before the reader gave up." An 8–12s LCP on search-lander pages is the largest single leak in the funnel and also a rankings headwind. CLS is already ~0, so this is a focused LCP/TBT job, not a redesign.
**Tradeoff accepted:** Touches the site's most delicate machinery (script ordering, `window.*` globals, cache-busters), so it needs its own careful pass with the existing `scripts run check` guards — that's why it's sequenced as its own phase, not a quick win.
**Impact:** High. **Effort:** Medium.
**Measure:** The nightly Lighthouse trend already committed to `scripts/data/lighthouse-history.json` (target: article LCP <3.5s, home <4s); GA4 engaged-sessions rate on organic article landers.

### R3 — Capture strategy: contextual end-of-article primary, with interest tags

**Recommendation:** Adopt an explicit capture hierarchy — **primary: inline end-of-article; secondary: mid-article on long guides; tertiary: exit-intent (single-show, as today); hard gate: only at the trip-builder moment (R1)** — and make the primary unit *contextual by category*: planning articles get a conditions/trip-timing offer ("Get what's open and what's booked out, the Sunday before you go"), seasonal articles get the season letter, wildlife/trails get the naturalist letter. Every unit passes a second hidden Buttondown tag `cat-<category>` alongside the existing placement tag.
**Location:** `NewsletterInline` call sites in `page-article.jsx:295–335` (copy varies on `article.cat`; tag input gains the category value); no new placements on article pages.
**Serves goals:** 3 (primary), 4 (interest segmentation is the launch-list backbone).
**Why it works:** The end-of-article reader has just demonstrated exactly what they care about; matching the offer to the article's category is the cheapest relevance win available, and the audit shows the plumbing (per-unit heading/blurb props, hidden tag inputs, `nl_valueprop` A/B harness) already exists. Interest tags mean the eventual guide launch email can go to `cat-planning` + `map-gate` + `guide-waitlist` first — the people most likely to buy.
**Tradeoff accepted:** Choosing contextual inline as primary means *not* escalating exit-intent or adding popups; slower list growth than aggressive modal tactics, in exchange for list quality and the calm voice the brand depends on.
**Impact:** High. **Effort:** Low (copy variants + one hidden input).
**Measure:** `newsletter_signup / newsletter_impression` by `location` and new `tag`, vs. the current baseline (both events already fire); Buttondown tag distribution over time.

### R4 — Capture the uncaptured pages: /kit, /films, and an emailable checklist

**Recommendation:** (a) Add a `NewsletterInline` to `/kit` ("Gear notes come with the letter: what's working this season, what wore out" — tag `kit`) and `/films` (tag `films`). (b) On `/checklist`, add an "Email me this checklist" option next to print: submitting subscribes (tag `checklist`) and a Buttondown welcome automation (or the Worker's existing Resend integration) delivers the printable version. Also add the missing `tag` on the existing checklist and `/planning` units.
**Location:** `page-kit.jsx`, `page-films.jsx` (end of page), `page-checklist.jsx` (beside the print affordance and the existing unit at `:186`), `page-planning-guide.jsx:127`.
**Serves goals:** 3, 4 (checklist/kit subscribers are trip-committed — prime guide buyers).
**Why it works:** Kit and checklist visitors are the highest-purchase-intent visitors on the site (they have dates and are packing), and today two of those three pages ask for nothing. "Email me the checklist" is the classic content upgrade tied to trip planning: the reader gets durable utility, you get an email with a known trip signal — a far more honest trade than a generic signup.
**Tradeoff accepted:** Email delivery of the checklist needs either a Buttondown automation (plan-tier dependent, see open questions) or a small Worker endpoint reusing `lib/email.ts`; until that exists, ship the tagged capture with "subscribers hear about updates first" copy (already the checklist unit's promise) and add delivery later.
**Impact:** Medium–High. **Effort:** Low (units) / Medium (delivery automation).
**Measure:** signup CR on `kit`/`checklist`/`films` locations; share of new subscribers carrying trip-intent tags.

### R5 — "This Week in the Park": the between-trips destination

**Recommendation:** A weekly-updated conditions dispatch page (e.g. `/now`): what's open, what's flowing, what's blooming, current entrance-wait patterns, one short field observation — 150–300 words, dated, with a small archive. The Sunday Field Notes letter and this page share material; the letter links here, the page's capture unit promises "this, in your inbox, Sunday." Surface the masthead's live weather/waits and one webcam on it (components exist). Link it from the masthead ("This week") and from planning-article end units.
**Location:** New route/page; masthead link in `components.jsx` header; contextual links from planning/seasonal article end units.
**Serves goals:** 2 (primary), 3 (makes the newsletter promise concrete), 1 (freshness + internal hub).
**Why it works:** "Come back between trips" needs a *page that changes*. Everything else on the site is evergreen. Conditions are the one thing a resident naturalist can publish that no content-farm competitor can fake, so it doubles as the loudest authority signal on the site. It also fixes the newsletter's abstract promise: "one letter a week, when there is something to say" becomes "the park, this week."
**Tradeoff accepted:** This is a **recurring editorial commitment**, not a build task — roughly 30–60 minutes a week, and it must not miss weeks (a stale conditions page is worse than none). It's the plan's biggest bet and only worth shipping if the cadence is sustainable (open question #1).
**Impact:** High. **Effort:** Medium build, ongoing editorial.
**Measure:** returning-visitor rate (GA4), direct/branded traffic to `/now`, signup CR of its capture unit, newsletter open-rate trend.

### R6 — Make the naturalist credential legible at the point of reading

**Recommendation:** (a) Upgrade `authorBio` from "Writes from El Portal, California." to a credential-forward line, e.g. "Yosemite naturalist and Conservancy interpreter, twenty seasons in the park. Writes from El Portal." (b) Add an end-of-article author box (photo, 2-sentence bio, link to `/about`, link to the "Practice" standards). (c) Show "Updated {date}" on all categories, not just planning statblocks — `isoModified` already exists per article. (d) Add `sameAs` links to the `Person` schema once public profiles exist (Conservancy bio page ideal).
**Location:** `data.js:24–33` (bio string), `page-article.jsx` (author box after body, before related rail; date display), `index.html:158–176` (schema).
**Serves goals:** 1, 3, 4 (trust is the multiplier on all three).
**Why it works:** The brief calls the resident-naturalist credential the site's biggest differentiator, but at the moment of reading it's a 36px "CG" avatar and one sentence about a town most readers can't place. The About page copy is superb and almost nobody sees it. Moving the credential to the byline and article foot puts the differentiator where trust decisions actually happen — right before the capture unit asks for an email.
**Tradeoff accepted:** None material; the copy must stay factual and calm (state the seasons and the role, no superlatives), and the exact credential wording needs the author's sign-off (open question #4).
**Impact:** Medium–High (compounding). **Effort:** Low.
**Measure:** signup CR on article pages pre/post; `related_click` and 75% `article_progress` rates (proxy for trust-driven depth).

### R7 — Sharpen the homepage and hub value proposition

**Recommendation:** Lead the homepage hero with the differentiator: keep "Notes from the Field." but make the dek state it plainly — the `data.js` tagline "Yosemite, written by someone who lives here" is exactly right and currently underused. Add one-line residency framing to `/planning`'s intro ("Planning advice from inside the park, checked on foot"). Resolve the `hero_actions` A/B (recommendation: bucket b — capture-forward hero — *after* R3's contextual copy lands, so you're testing the better copy).
**Location:** `page-home.jsx` hero (`:172–229`), `page-planning-guide.jsx` intro, masthead sub in `components.jsx`.
**Serves goals:** 1, 3.
**Why it works:** First-time visitors from a single search query decide in seconds whether this is "another Yosemite blog." The one fact that changes that judgment — the author lives and works in the park — should be un-missable above the fold, in the house voice (declarative, no fluff).
**Tradeoff accepted:** Hero real estate is finite; this stays one line, not a badge wall.
**Impact:** Medium. **Effort:** Low.
**Measure:** home bounce/engaged-session rate; hero capture (`location: home`) CR.

### R8 — Route signups through the Worker (keep Buttondown)

**Recommendation:** Add `POST /api/newsletter/subscribe` to the existing Cloudflare Worker, calling Buttondown's REST API with the email + full tag set + metadata (first-seen page, referrer class), and update `NewsletterInline` to use it with the iframe embed kept as a no-JS/failure fallback. Fire `newsletter_signup` only on confirmed 2xx.
**Location:** `workers/src/` (new route beside `/api/contact`), `components.jsx:538–620` (submit path).
**Serves goals:** 3 (honest measurement, error states), 4 (rich segmentation, launch automation triggers).
**Why it works:** Today success is assumed on submit into a hidden iframe: typos and Buttondown rejections are silently counted as conversions, and the reader gets a "you're on the list" state that may be false. A Worker proxy gives true conversion numbers, lets one subscriber carry multiple tags (placement + interest + intent), and becomes the trigger point for welcome automations. This is the "compelling reason" bar for touching the Buttondown setup — and it *keeps* Buttondown, which fits the brand and budget; no ESP switch is justified.
**Tradeoff accepted:** Adds an API dependency to a deliberately static site and a secret to manage (`BUTTONDOWN_API_KEY`). Acceptable: the Worker already backs the contact form and inventory, and the embed fallback preserves resilience.
**Impact:** Medium (foundation). **Effort:** Medium.
**Measure:** true CR vs. previously-reported optimistic CR (expect a visible drop — that's the point); submit-error rate.

### R9 — Welcome sequence (warming path)

**Recommendation:** A three-email Buttondown automation for new subscribers: (1) immediately — deliver the promised asset (map unlock confirmation or checklist), plus two best-of links matched to the subscriber's `cat-*` tag; (2) day ~4 — the trust letter: who I am, how recommendations get verified (Practice copy, lightly adapted); (3) day ~10 — the season right now, with one calm sentence: "Later this year I'm releasing a field guide app; subscribers will hear first." Tag any click on that line `guide-curious`.
**Location:** Buttondown (automations); no site code beyond R8's tags.
**Serves goals:** 2, 3 (activation → retention), 4 (begins warming on day one).
**Why it works:** A subscriber's attention peaks in the first week; today they get nothing until the next Sunday. The sequence converts a signup into a *reader* (retention) and starts product warming honestly — one sentence, no hype, exactly the register a naturalist would stand behind.
**Tradeoff accepted:** Depends on Buttondown's automation features on the current plan tier (open question #2). If unavailable, a manual monthly "welcome cohort" email is the stopgap.
**Impact:** High for goal 4. **Effort:** Low–Medium (mostly writing).
**Measure:** welcome-email open/click rates; week-4 subscriber retention (opens); `guide-curious` tag accumulation.

### R10 — Take /guide public in waitlist mode

**Recommendation:** Un-hide `/guide` before launch: remove `noindex`, restore the nav/footer links (the `GUIDE-LAUNCH` markers make this a staged one-liner), keep the full sales page, but swap the buy box's primary action to "Join the launch list" (Buttondown tag `guide-waitlist`) with honest framing ("The guide opens for sale [season]. The list hears first, and first access matters: sales are capped each month."). The inventory-cap scarcity is real (409 soldOut logic exists) — say so plainly. Additionally, when a visitor who has viewed `/guide` later subscribes anywhere, append a `guide-visited` tag (session flag → hidden input).
**Location:** `app.jsx:427–428` (robots), `components.jsx` nav/footer (`:412–413`), `page-guide.jsx` buy box (`:46–167`, waitlist variant), capture units (hidden tag).
**Serves goals:** 4 (primary), 3.
**Why it works:** The most expensive launch mistake is launching to a cold list. A public page accrues SEO age, referral curiosity, and — through the waitlist tag — a ranked buyer list, while the finished Stripe path waits behind a flag. The monthly cap turns into a truthful launch mechanic instead of a hidden constraint.
**Tradeoff accepted:** Publicly naming a product before it's buyable creates an obligation to actually launch in the stated window; keep the date a season, not a day. Also requires deciding launch timing first (open question #3).
**Impact:** High. **Effort:** Low (page and flags exist).
**Measure:** `guide-waitlist` list size and growth; `guide_cta_click`/page views; at launch, waitlist→purchase conversion vs. general-list conversion.

### R11 — Cluster pathways: make hub membership visible from inside articles

**Recommendation:** (a) On the 13 `/planning`-curated articles, show a quiet series band under the byline: "Part of the Yosemite Planning Guide — [part name]" linking to the hub, with prev/next within the part. (b) Turn the TOC on by default for guides with ≥5 H2s (resolve the `article_toc` A/B in favor of on; the component exists). (c) Add next/previous month links between the seasonal month guides.
**Location:** `page-article.jsx` (band under byline; TOC default), curation data either inline or a small map keyed by slug alongside `START_HERE` in `data.js`.
**Serves goals:** 1 (pages/session), 2 (hubs become the bookmarkable spine).
**Why it works:** The hub→article path exists and is strong; the article→hub path doesn't. A search lander on "Half Dome permit lottery" who sees they're inside a structured multi-part guide has a reason to open two more tabs and to bookmark the hub. This extends the already-good related-rail system instead of replacing it.
**Tradeoff accepted:** One more element between byline and prose; keep it a single line in the house style.
**Impact:** Medium–High. **Effort:** Low–Medium.
**Measure:** pages/session on cluster articles; hub pageviews referred from articles; `toc_jump` and `related_click` rates.

### R12 — A/B test hygiene: resolve to defaults, run one test at a time

**Recommendation:** Retire or resolve the eight concurrent A/B tests (`hero_actions`, `home_webcams`, `callout_bands`, `mobile_cta`, `exit_copy`, `article_toc`, `mid_copy`, `nl_valueprop`) to sane defaults, keeping the `abVariant` harness but a max of one live test at a time, chosen to answer the current phase's question.
**Location:** `abVariant` call sites across `page-home.jsx`, `page-article.jsx`, `components.jsx`.
**Serves goals:** all, indirectly — measurement clarity.
**Why it works:** At editorial-site traffic volumes, eight simultaneous tests will mostly never reach significance while adding variance to every baseline you're about to measure this plan against. The harness is good; the portfolio is too wide.
**Tradeoff accepted:** Some tests die without a verdict; make the judgment call from directional data and move on.
**Impact:** Medium (enables all measurement). **Effort:** Low.
**Measure:** n/a — this is what makes the other measures readable.

---

## 5. Prioritized phased roadmap

Each pass is independently shippable, in implementation order.

**Pass 1 — Quick wins (copy + small components; days).**
1. R6 trust pass: byline bio, author box, "Updated" dates (schema `sameAs` when profiles exist).
2. R3 contextual end-of-article offers + `cat-*` interest tags; add missing `tag` on checklist/planning units.
3. R4a capture units on `/kit` and `/films`.
4. R7 homepage/hub value-prop lines.
5. R12 A/B cleanup (do this first within the pass so baselines settle).
   Guards: `npm --prefix scripts run check` + cache-buster bump per editorial convention.

**Pass 2 — Structural funnel fixes (1–2 weeks).**
6. R1 map gate rework (browse free, gate the builder, ungated shared trips).
7. R8 Worker subscribe endpoint + honest conversion events.
8. R9 welcome sequence in Buttondown (writing task, parallelizable).
9. R4b "email me the checklist" delivery.
10. R11 cluster bands + TOC default.

**Pass 3 — Bigger bets.**
11. R2 LCP performance pass (own branch, verified against the nightly Lighthouse trend).
12. R5 "This Week in the Park" page — only once the weekly cadence is confirmed sustainable.
13. R10 guide waitlist mode → warming → launch (timing per open question #3; the launch itself follows DEPLOY.md's relaunch runbook, outside this plan).

## 6. Measurement plan

Nearly all instrumentation exists; this is mostly dashboarding discipline.

- **Primary KPI:** true newsletter CR = confirmed `newsletter_signup` / `newsletter_impression`, by `location` and `tag` (post-R8, "confirmed" is real). Baseline for two weeks after Pass-1's A/B cleanup, before judging Pass 2.
- **Engagement:** engaged-session rate and pages/session on organic article landers; `article_progress` 75% rate; `related_click` rate; article LCP from the existing nightly Lighthouse history (plus CrUX field data once available).
- **Retention:** GA4 returning-visitor share (28-day); `/now` repeat visits; Buttondown open-rate trend and week-4 new-subscriber opens.
- **Map funnel:** map sessions → `map_pin_click` → builder-gate impressions → signups → `trip_share` (R1 before/after is the key comparison).
- **Product readiness:** `guide-waitlist` + `guide-curious` + `guide-visited` tag counts and weekly growth; at launch, conversion by segment (waitlist vs. interest-tagged vs. general list) — this retroactively scores the whole segmentation strategy.
- **List quality guardrails:** Buttondown unsubscribe/bounce rate by acquisition tag; if `map-gate`/`trip-gate` unsubscribes run hot, tighten gate copy rather than the gate.

## 7. Open questions (needed before implementation)

1. **Cadence reality:** Is a weekly Sunday letter + a weekly conditions update genuinely sustainable through busy seasons? R5 (and R3's "conditions" framing) should only ship if yes; otherwise the framing becomes "seasonal," biweekly.
2. **Buttondown plan tier:** Are automations/sequences and the REST API available on the current plan? R8/R9 depend on it (API is broadly available; automations are tier-dependent).
3. **Guide launch window:** What season is the realistic target? GROWTH-AUDIT.md (June 2026) says "roughly next year," which — if still true — makes waitlist mode (R10) clearly worth the interim state. R10's public waitlist copy needs a truthful "opens [season]"; if the plan has accelerated to <4–6 weeks out, skip waitlist mode and just launch.
4. **Credential wording:** The brief says "Yosemite Conservancy interpreter"; the site currently says "worked in and around it for twenty seasons." What exact credential is the author comfortable publishing in bylines and schema (and is there a Conservancy bio page usable as `sameAs`)?
5. **Traffic reality check:** Rough monthly sessions and current list size from GA4/Buttondown — needed to set expectations for A/B feasibility (R12) and to size the launch forecast.
6. **Map gate conviction:** The full view-gate reads as a deliberate recent choice (the code comment is explicit). Any data or reasoning behind it that should override R1? If the gate is out-converting expectations, R1 can run as a 50/50 test via the existing `abVariant` harness instead of a straight swap.
7. **Author photo:** Is there a usable portrait for the author box (R6b)?

---

## Addendum — Field Guide app funnel (July 2026, shipped)

Post-launch follow-on to R10, on the product side of the fence this time: the PWA itself now sells. Before this pass every app URL except `/open` and `/login` bounced signed-out visitors to a bare sign-in form, so the $19 ask was sight-unseen and every link a buyer shared dead-ended.

- **Free sample** at `/preview` (linked from the /guide buy box, `guide_sample_click`): five real entries rendered in full by the app's own components — one stop per region plus one Secret Guide spot — with locked-count dividers, the live price from `/api/inventory`, and buy links out to `/guide`.
- **Shared stop links convert.** Signed-out `/stop/:id` renders a teaser landing page (name, photo, meta, teaser line, CTAs) instead of the login wall; the five sample stops read in full. A Share button on every stop page (Web Share/clipboard) feeds the loop, and the PWA's `index.html` now carries OG tags so shared links unfurl.
- **/login sells too:** price + sample link for non-buyers; lapsed buyers get a "buy again with the same email" renewal path (the webhook overwrites the buyer record, so repurchase = renewal).
- **Measurement gap, deliberate:** the PWA has no analytics by design, so sample-page traffic is only visible as `guide_sample_click` on the editorial side and, ultimately, checkout volume. If the sample needs its own funnel numbers later, that is a new decision, not an oversight.

## Addendum — Homepage user-journey pass (July 2026, shipped)

Extends R7 beyond a value-prop line into a first-viewport rework, on the reasoning that a task-mode planner cannot process an identity-first hero. The page now leads with the favor and asks afterward.

- **Hero triage doors.** The H1 states the differentiator as a service ("Yosemite, from the inside."), and three self-selection doors (first trip → the Start Here answers row; dates set → `/itineraries`; there now or going soon → `/now`) replace the single "Start here" text link as the hero's primary action. Instrumented as `cta_click{location: home_door, target}`.
- **Capture demoted to second position, promise made honest.** The email form follows the doors. "Unlock the map" was stale (the map view has been free since the gate rework; only the trip builder is gated), so the offer is now the Sunday letter with the trip builder as the bundled unlock. `home_hero` location and `home` tag unchanged, so funnel numbers stay comparable.
- **Bulletin teaser promoted** to its own band directly under the utility row: dated recency is the proof a cold planner trusts. The webcam strip and its four off-site links stay below Start Here, preserving the `home_webcams` A/B conclusion.
- **Start Here recast from readings to answers:** dek is now "Four answers before you book anything," and each curated card leads with the question it answers (`START_HERE_QUESTIONS` in page-home.jsx).
- **Measure:** share of home sessions reaching a second surface (`cta_click{home_door}` + `home_utility_click` + `home_dispatch` clicks), hero capture CR at `home_hero` (per-impression CR may drop while list quality rises), and home-referred entrances to `/itineraries` and `/now`. The `hero_actions` verdict is deliberately superseded; if insurance is wanted, rerun old-vs-new hero as the single live test per R12.
