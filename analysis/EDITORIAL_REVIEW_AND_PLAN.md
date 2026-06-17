# The Talus Field — Editorial Review, Impact Model, and Rollout Plan

**Scope:** the editorial site (`thetalusfieldjournal.com`) — layout, format, usability, mobile,
and the path to newsletter signup. The Field Guide PWA and the Worker API were out of scope.

**Method:** a full editorial/UX read of the live code, then three specialist reviewer agents
(Mobile/Performance UX, SEO/Organic Traffic, Conversion/Brand Voice) scored each candidate edit.
Their calibrated estimates parameterized a Monte Carlo model (`editorial_traffic_model.py`,
200,000 trials/iteration). No edit was promoted to the plan until the modeled **joint** probability
that all four target metrics end net-positive reached **≥ 98%**. The loop reached **98.60%**.

> The 98% figure is the modeled confidence that the *shipped package as a whole* produces a net
> positive across all four metrics under conservative assumptions — not a guarantee about absolute
> visitor numbers, which depend on demand the site does not control. It is a decision gate, not a forecast.

---

## 1. Editorial review — what the site does well, and where it leaks

The site is already a serious, well-built editorial product: strong typography, a real house voice,
generated SEO mirrors, schema.org entities, a `<noscript>` fallback, responsive images, and
newsletter capture in the right places. The findings below are about *leaks*, not foundations.

### Layout & format
- **The hero presents four competing actions at once** (`page-home.jsx:85-103`): a "Start Here"
  scroll button, a "Free checklist" ghost button, a "Sunday Field Notes / The Map" ghost button,
  and *then* the email capture. The one action that matters (capture) is fourth in the scan.
- **Four near-identical full-width callout bands stack in a row** (Map, Planning Guide, Kit,
  About+Strip — `page-home.jsx:217-319`): same `borderTop/borderBottom: 2px`, same `1fr 2fr` grid,
  same moss eyebrow. Classic banner blindness; each reads as "another promo, skip."
- **Article `H2` is rendered as 12px uppercase micro-caps** (`styles.css:1241-1250`) — visually
  *smaller* than the italic 22px `H3` (`styles.css:1251-1257`). Long SEO landing pages become hard
  to skim, and the visual hierarchy is inverted relative to the semantic one.

### Mobile & performance (the biggest traffic lever)
- **In-browser Babel transforms ~15 JSX files on every page load** (`index.html:290-307` +
  `@babel/standalone`, ~900 KB). This is the dominant mobile TBT/INP cost and the single largest
  Core-Web-Vitals drag — a mobile ranking factor.
- **Google Maps JS API loads on *every* page** (`index.html:115-118`), not just `/map`.
- **The mobile masthead drops to 9px uppercase text** (`styles.css:1706`) — below the accessible
  legibility floor.
- **The `.nav__primary` CTA style is fully written but never rendered** (`styles.css:403-423`;
  `Header()` in `components.jsx:253-351` emits no primary button) — mobile users get only a hamburger,
  with no persistent path to subscribe/the map.
- **`EntranceWaits` injects live NPS data into the sticky masthead after paint**
  (`components.jsx:203-248`) — a layout-shift (CLS) source on every page.

### Crawlability (surfaced by the SEO reviewer; highest-ceiling finding)
- **Article *body prose* is invisible to any crawler that does not execute JavaScript.** The edge
  middleware rewrites `<head>` correctly, and the `<noscript>` block lists article titles, but
  `/articles/<slug>` ships a blank `<div id="root">` until React boots. Googlebot renders JS (with a
  delay); **Bingbot, GPTBot/ClaudeBot/Perplexity, and social scrapers do not.** Every other SEO
  investment operates under this ceiling.

### Conversion (surfaced by the CRO reviewer)
- **The exit-intent modal wastes its one shot** (`components.jsx:638-639`): it leads with
  "One letter a week. Sometimes none." and never mentions the free-map unlock — the strongest reason
  to subscribe and the hook that already converts in the hero.
- **The mid-article unit hedges instead of incentivizing** (`page-article.jsx:159-165`): "Keep reading
  next week" promises future content rather than the immediate map unlock. Passing an explicit `blurb`
  also suppresses `NewsletterInline`'s default map-first copy (`components.jsx:540-542`).

---

## 2. The intervention catalog (22 items, agent-calibrated)

Each row carries the reviewer's estimate of relative effect, uncertainty, backfire probability,
confidence, and reversibility (full parameters in `editorial_traffic_model.py`). Metric legend:
**O** organic traffic · **M** mobile traffic · **U** usability · **N** newsletter conversion.

| ID | Change | Metric | Effort | Notes |
|----|--------|:------:|:------:|-------|
| C1 | Collapse the hero's 4 competing actions into one primary capture | N | S | strongest single CRO lever (~+14%) |
| EXITCOPY | Exit-intent modal leads with the free-map unlock (declarative, on-voice) | N | S | unlisted; wasted shot today |
| MIDCOPY | Mid-article unit leads with map incentive, drop the cadence hedge | N | S | unlisted; one-prop change |
| C7 | Differentiate the 3 identical callout bands | N | M | banner blindness |
| C5 | Reorder above-fold webcams so capture isn't buried (U+N) | U,N | S | webcams send users off-site above the fold |
| C11 | A/B the newsletter value prop (map-first vs notes-first) | N | S | low confidence; A/B exactly the point |
| C8 | Make article H2 skimmable / fix inverted hierarchy (O+N) | O,N | S | dwell + scroll-to-impression |
| C2 | Wire the unused `.nav__primary` as a persistent mobile CTA (M+U) | M,U | S | code already styled, never rendered |
| C6 | Raise mobile masthead legibility (9px→11px) | U | S | accessibility floor |
| CLS | Reserve a fixed slot for `EntranceWaits` to kill masthead CLS | U | S | unlisted; CWV |
| C4 | Defer Google Maps JS API to the `/map` route only | M | M | per-route load |
| C9 | On-page TOC / jump links on long articles (O+U) | O,U | M | sitelinks + task completion |
| C10 | Strengthen cross-category internal linking / planning funnel | O | M | PageRank to deep pages |
| C12 | Per-route LCP preload at the edge | M | S | hero already preloaded; extend to articles |
| HHIER | Normalize H2/H3 visual weight | O | S | author-trap fix |
| **C3** | **Precompile JSX→JS, drop in-browser Babel** (O+M) | O,M | L | **architectural — biggest CWV lever** |
| **PRERENDER** | **Pre-render/SSR article bodies for non-JS crawlers** | O | L | **architectural — highest ceiling** |

---

## 3. The statistical analysis and the loop

**Success (per Monte Carlo trial) = ALL of:** total traffic > +5%, mobile traffic > +3%,
usability ≥ baseline, newsletter signups > +8%. Signups are modeled as *traffic × conversion*, so a
conversion win only counts if traffic holds. Effects stack with an 0.80 overlap discount (diminishing
returns). The gate is **P(all four) ≥ 98%**.

The loop applies the mitigation a real review board would demand, in two phases, recomputing each step:

| Phase | What happens | P(success) |
|-------|--------------|:----------:|
| Baseline | Ship all 22 edits at once | **68.4%** |
| A/B-gate ×20 | Each reversible edit ships behind an A/B test + rollback (keep winners, revert losers — truncates the downside tail) | rises to **87.4%**, then **plateaus** |
| Stage-verify PRERENDER | Measure crawl rendering on a canary before depending on it | **95.9%** |
| Stage-verify C3 (Babel) | Measure CWV in staging before promoting | **98.6% → PASS** |

**Why the plateau matters.** A/B-gating the small edits alone cannot clear 98%, because the *traffic*
upside leans on two high-variance architectural bets; their wide uncertainty pulled the 5th-percentile
of total traffic to **0.978 (below baseline)**. The gate only clears once those two are **staged and
verified** (Lighthouse CWV + Search Console URL inspection / fetch-as-Bing on a canary), which collapses
their modeled uncertainty and removes the regression tail. The model's conclusion is therefore a process
prescription, not just a list: *small edits measured and reversible; architectural changes verified before
you depend on them.*

### Projected outcomes at the passing package (index, 1.00 = today)

| Metric | Conservative (p05) | Typical (median) | Mean |
|--------|:------------------:|:----------------:|:----:|
| Total traffic | +11.7% | +25.2% | +26.3% |
| Mobile traffic | +18.9% | +36.1% | +37.3% |
| Usability | +1.5% | +8.9% | +9.3% |
| Newsletter signups | +45.5% | +92.2% | +96.6% |

Newsletter signups compound traffic gains with conversion gains, which is why the percentage is the
largest. The p05 column is the conservative read to plan against.

---

## 4. The plan that passed the gate (phased rollout)

**Phase 0 — Instrument (do first).** Confirm GA4 captures `newsletter_impression`/`newsletter_signup`
by `location`, and per-placement view→signup rate, so every A/B below has a denominator. Capture a
baseline week of CWV (CrUX/Lighthouse) and current Bing/AI-crawler coverage.

**Phase 1 — Ship directly (high-confidence, low-risk).** `C3m`-class no-regret fixes plus the trivially
safe ones: `C6` legibility, `CLS` slot reservation, `HHIER`, `C12` preload. Cheap, reversible, no test
needed.

**Phase 2 — Ship behind A/B + rollback (the 20 reversible edits).** Hero simplification (`C1`),
exit-intent and mid-article copy (`EXITCOPY`, `MIDCOPY`), callout differentiation (`C7`), webcam reorder
(`C5`), value-prop test (`C11`), the mobile CTA (`C2`), TOC (`C9`), internal linking (`C10`), Maps defer
(`C4`). Keep winners, revert losers. All copy stays in house voice (dry, declarative, no exclamation
marks, no em-dashes).

**Phase 3 — Stage + verify, then promote (the two architectural bets).** Precompile JSX→JS to drop
in-browser Babel (`C3`) and pre-render article bodies for non-JS crawlers (`PRERENDER`). Build a
deploy-time transpile/prerender step that keeps the source readable (honoring the "no build step"
philosophy at the source level) and verify on a canary — Lighthouse CWV deltas and Search Console /
fetch-as-Bing rendering — **before** promoting to production. Do not promote a build that fails its gate.

**Reproduce / re-tune:** `python3 analysis/editorial_traffic_model.py` (writes
`editorial_traffic_model_result.json`). Adjust any reviewer estimate or threshold and the loop re-runs.

---

## 5. Honest caveats

- Parameters are expert estimates, not measured A/B results. Phase 0 instrumentation exists to replace
  them with real numbers; treat the model as a prioritization and gating tool, refreshed as data arrives.
- "98%" is joint confidence of a *net positive*, under conservative thresholds and an overlap discount —
  not a promise of a specific visitor count.
- Two findings (precompile, prerender) touch the deliberate "no build step" design. The plan respects it
  by keeping *source* readable and confining tooling to deploy time, but this is the one architectural
  trade-off the owner should sign off on before Phase 3.
