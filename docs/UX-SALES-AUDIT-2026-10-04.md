# The Talus Field: user experience and sales audit

Prepared October 4, 2026. Scope: public website, product positioning, acquisition paths, purchase experience, and implementation handoff.

**Recommendation:** Make the Field Guide the obvious next step for someone who has finished planning and needs that plan in the park. Explain the offer faster, eliminate contradictions around access and updates, shorten the preview-to-purchase path, and make consultations genuinely bookable before promoting them more widely. Preserve the journal's distinctive voice and useful free content.

**Evidence and limits**

I read the public [homepage](https://thetalusfieldjournal.com/), [Field Guide page](https://thetalusfieldjournal.com/guide), [consultation page](https://thetalusfieldjournal.com/consult), and [Kit page](https://thetalusfieldjournal.com/kit), then examined the corresponding local source and supporting purchase/preview components. Public text extraction exposes only part of this JavaScript-driven site, so most detailed implementation findings below are source-backed, not observations of a rendered production session.

Browser access was denied by the browser security policy. I did not test the rendered desktop/mobile interface, submit forms, create a checkout session, make a purchase, or test offline operation. There are no measured conversion rates, usability sessions, field performance results, or revenue exports behind this report. Expected sales effects are hypotheses, not promised uplifts. The working tree already contained changes; I did not modify application files. The next agent must check deployment parity before treating a local finding as a live defect.

Evidence labels used below: **Public** = visible in retrieved public text; **Source** = present in inspected local implementation; **Hypothesis** = recommendation to validate; **QA** = requires browser/device testing.

**1. The product portfolio and its best role**

| Offering | What currently exists | Recommended role |
|---|---|---|
| Free journal and planning tools | Articles, conditions, planning hub, first-trip page, itineraries, map, checklists | Acquire search traffic, answer the immediate question, demonstrate expertise |
| Field Guide | Public page advertises $3.99 once, 18 months of access, offline web app; five sample entries; 116 entries including 72 Secret Guide entries, plus 57 hikes | Main scalable paid product: take the plan and practical information into the park |
| Field Consult | Source advertises $95 for a thirty-minute call or written alternative, six monthly slots; checkout/calendar URLs are empty | Premium help for complex or uncertain trips, with explicit deliverables and actual availability |
| Newsletter and road alerts | Free subscriptions and contextual capture points | Bring planners back at a useful moment and maintain a relationship after the visit |
| Gear and lodging referrals | Packing checklists and disclosed affiliate links | Earn referral revenue where readers already need a purchase or booking decision |

The public offer and price are documented on the [Field Guide page](https://thetalusfieldjournal.com/guide). Detailed behavior is in `page-guide.jsx`, `page-consult.jsx`, `components.jsx`, `page-kit.jsx`, and the guide app's preview routes. Verify the live price before changing any copy.

The best product distinction is straightforward: **plan free on the journal; carry the plan offline in the Field Guide; get personal help through a consult.** Use those three jobs consistently. Avoid creating additional packages until the existing purchase path is understood.

**2. What is already working and should be preserved**

- The positioning is unusually specific: Yosemite knowledge from a resident naturalist, practical parking/timing advice, and alternatives when a plan fails.
- The homepage has a deliberate first-visit route, rather than only a chronological article feed.
- The product page already includes genuine app screenshots, a five-step walkthrough, a sample stop, a free-versus-paid table, FAQs, and offline-versus-online explanations.
- Five real entries can be read without an account. This is stronger proof than a generic promotional video.
- Source includes direct checkout buttons, a mobile purchase bar, gift purchasing, post-payment access handoff, sign-in recovery information, and a refund policy.
- Affiliate disclosures, newsletter controls, responsive images, and reduced-motion behavior already exist in relevant components.

Do not brief another agent to “add screenshots,” “add a sticky buy button,” or “add a free sample” without acknowledging these existing implementations. Improve their order, wording, and reliability.

**3. Prioritized implementation backlog**

P0 means resolve before increasing paid-product promotion. P1 means the next conversion-focused release. P2 means improvement after the core funnel is reliable. Effort is relative: S = localized copy/component change; M = several connected components; L = integration or substantive product work. These are not hour estimates.

| ID | Priority | Change | Evidence | Effort | Intended effect |
|---|---|---|---|---|---|
| 01 | P0 | Unify product terms and delivery promises | Source | M | Reduce buyer uncertainty and support surprises |
| 02 | P0 | Show an actual error when mobile checkout fails | Source | S | Recover failed purchase attempts |
| 03 | P0 | Separate payment confirmation from return-page analytics | Source | M | Make sales reporting and success states trustworthy |
| 04 | P1 | Shorten the Field Guide page and move decision information forward | Source + hypothesis | M | Help visitors understand and buy sooner |
| 05 | P1 | Give ready preview users a direct purchase path | Source | M | Remove the return-to-pitch loop |
| 06 | P1 | Clarify homepage actions and product naming | Public + source + hypothesis | S | Make free planning and paid offline use easy to distinguish |
| 07 | P1 | Make consult availability and booking truthful and usable | Source | L | Turn high-intent inquiries into completed bookings |
| 08 | P1 | Put contextual offers beside useful answers | Source + hypothesis | M | Reach relevant readers before the article footer |
| 09 | P1 | Verify purchase-to-offline readiness end to end | QA | M | Deliver the product's central promise |
| 10 | P1 | Establish funnel measurement and attribution | Source + hypothesis | M | Find actual losses instead of redesigning by intuition |
| 11 | P2 | Simplify planning navigation and preserve trip context | Source + hypothesis | M | Reduce repeated decisions and abandoned plans |
| 12 | P2 | Improve proof, affiliate decisions, mobile legibility, and performance | Source + QA | M | Build confidence and remove secondary friction |

**04. Product terms: one reliable explanation everywhere — ticket 01**

Observed in `page-guide.jsx`:

- The buy box promises updates “through the 2026 season,” while the comparison table, FAQ, and terms describe updates during the access window.
- The after-purchase section describes an instant signed-in handoff; the FAQ describes waiting for an email and code without explaining that primary handoff.
- Promotional components shorten the refund language to “30-day guarantee,” while the detailed policy is conditional on the guide not working as described.
- “2026 Edition” is prominent even though a buyer in October is purchasing access extending well beyond that year.
- Shared promotional bands and planning-page buttons hardcode $3.99 while purchase components obtain pricing from inventory with a fallback.
- Personal-device language differs from terms that also mention people traveling with the purchaser. Clarify the intended sharing entitlement before rewriting it.

Implement a shared product facts source for price display, access duration, renewal behavior, update entitlement, refund summary, and product counts. Keep payment pricing authoritative on the server. Generate static SEO/prerender output from the same approved facts where the architecture permits; do not require an API response to render the entire pitch. Treat unavailable/stale pricing explicitly so the customer never approves an unexpected amount.

Suggested visible terms: “One payment. 18 months of access. No automatic renewal. Updates included during your access period.” Follow with the exact existing refund condition and a policy link. Do not broaden the refund promise without an owner decision. Label product freshness with an actual last-updated date rather than making an old edition label imply expiry.

Acceptance: hero, buy box, mobile bar, preview, promotional bands, FAQ, structured data, checkout, confirmation, and terms agree. Simulate inventory failure and a price change. Confirm existing entitlements and renewal behavior remain intact.

Files: `page-guide.jsx`, `components.jsx`, `page-planning-guide.jsx`, `page-legal.jsx`, `app.jsx`, `edge/seo.js`, `apps/guide/src/lib/storefront.ts`, and relevant worker configuration. Locate all duplicate claims before editing.

**05. Checkout failure and confirmation — tickets 02 and 03**

`GuideMobileBuyBar.buy()` catches checkout failure and scrolls to the buy box. It does not set a visible error there. A visitor can tap Buy and simply move down the page without learning what went wrong. Other purchase buttons have separate request/error implementations, increasing the chance of inconsistent fixes.

Create a shared checkout-start helper and a consistent visible error state. Preserve the selected gift state and intent. Disable duplicate submissions while a request is pending; restore the control on failure; provide Retry and an accessible support link. Announce failures through an appropriate live region. Handle non-JSON responses, offline state, timeouts, and API rejection. Scrolling may supplement an explanation, but must not replace it.

The editorial purchase event currently depends on a `guide=success` query parameter and a locally stored click marker. This is a useful return-path signal, not authoritative proof of payment. It can miss paid orders when people do not return or storage is unavailable. Its payload also does not establish verified revenue or a transaction identifier. The rendered “Payment received” message similarly starts from the return parameter, although the downstream claim flow performs verification.

Use a verified server-side payment record as the source of paid-order truth; count a successful transaction once and distinguish gifts, renewals, refunds, and tests. Show “Confirming your payment…” until verification succeeds where appropriate. Keep attribution events separate from entitlement decisions. Do not weaken the existing claim/webhook validation to simplify analytics.

Acceptance: cancelled and unpaid sessions never count as paid; refreshing a successful return does not duplicate a purchase; a delayed webhook/claim race works; a buyer who closes the return page still appears in authoritative paid-order reporting; mobile failures are visible and recoverable. Inspect the existing backend idempotency protections before changing them.

Files: `page-guide.jsx`, `workers/src/routes/checkout.ts`, `workers/src/routes/stripe.ts`, `apps/guide/src/routes/Claim.tsx`.

**06. Reorder the Field Guide page around a buying decision — ticket 04**

The current source renders a substantial page: hero, 3D map presentation, a complete eight-stop day, two narrative sections, a five-screen walkthrough, a ten-screen gallery, nine additional screenshots, additional features, sample content, offline explanation, comparison, trust, delivery instructions, and FAQs. The ingredients are good; their cumulative length is the concern. Browser testing is still needed to quantify actual scroll depth and mobile density.

Recommended order:

1. Outcome, price, access period, primary Buy button, secondary sample link, and one recognizable app image.
2. Three benefits: build a realistic day; know where to go if a lot fills; keep the downloaded plan and map available without signal.
3. One short demonstration using the existing walkthrough or a shortened sample day.
4. A compact free-versus-paid comparison organized by the same tasks in both columns.
5. Device compatibility, setup steps, download size, and what still needs internet.
6. Author proof, accurate refund summary, and purchase action.
7. Focused FAQs. Put the full gallery and release history behind optional disclosure controls or on supporting pages.

The current comparison pairs unrelated things on some rows, such as free conditions versus broad offline capabilities. Replace those with comparable tasks: read articles; plan stops; use downloaded maps; organize days; use GPS tracks. Mark partial capabilities honestly.

Suggested hero:

> Your Yosemite plan, even when the signal disappears.
>
> Build your days with parking notes, realistic time budgets, and alternatives when a lot fills. Download the Field Guide and park map before you leave.
>
> Get the Field Guide — [current price]
>
> One payment · 18 months · No automatic renewal
>
> Read five entries free

This keeps the local expertise but answers “what is it?” sooner. The current three-day headline can feel less relevant to day visitors or longer stays; test broader language rather than assuming it is causing abandonment.

Keep the offline boundary close to the claim: downloaded content and covered map areas remain available; fresh weather, road information, webcams, and other live services need connectivity. The existing offline toggle is a simulation using screenshots, so label it as an illustration rather than implying it actually turns connectivity off.

Acceptance: a new visitor can identify the product, price, duration, device support, offline limitation, and next action without reading the long narrative. Existing screenshots remain available, existing sample links work, and no capabilities are removed merely to shorten the pitch.

**07. Let the preview sell the product — ticket 05**

`Preview.tsx` and `PreviewChrome.tsx` show real entries and persistent purchase links, but those links lead back to the editorial sales page. The user who already decided to buy must find another button there. Preserve a “See everything included” link, but make the primary purchase action advance toward payment.

Use a secure shared checkout mechanism or a dedicated purchase route with a clear review state. Carry non-sensitive source attribution and the relevant stop/trip context. Do not automatically initiate payment sessions on arbitrary page load. Keep a visible return path to the sample.

The preview mainly demonstrates reading entries. Consider adding one small, restricted planning example so users can experience the paid product's distinctive practical benefit. This is a P2 experiment after the direct purchase route works; avoid building an entirely free duplicate of the paid app.

Acceptance: a sample reader can deliberately start checkout without rereading the sales pitch; signed-in buyers still go to their paid app; back/cancel preserves context; prices and terms match the editorial site; cross-origin behavior is tested.

**08. Homepage and navigation — ticket 06**

The public homepage offers a poetic headline, first-visit guidance, and a pocket-guide link. Local source shows both hero actions are section jumps, followed by a separate link onward. This provides orientation, but adds steps for visitors who already know their goal. The public navigation's “Get the app” wording does not itself explain the price or offline benefit. See the [homepage](https://thetalusfieldjournal.com/).

Keep the visual and editorial identity. Make the hero's actions more literal: “Plan my first visit — free” linking directly to `/start-here`, and “Explore the offline Field Guide” linking directly to `/guide`. Add a brief price/duration description near the paid path if it fits cleanly. If retaining section jumps, label them as introductions and measure whether people continue.

Use consistent names: “Free planning guide,” “Offline Field Guide,” and “Trip consultation.” Do not rename every route or remove established links. Returning customers should find “Open my guide” or “Sign in” readily, rather than being repeatedly sent through the sales pitch.

Acceptance: first-time planners, ready buyers, and existing customers each have an unambiguous route. Test navigation with keyboard, touch, and a screen reader; a text extraction of hidden menus is not evidence that all their links are visible at once.

**09. Turn consultations into a deliverable someone can book — ticket 07**

Source has empty `CONSULT_PAYMENT_LINK_URL` and `CONSULT_BOOKING_URL`, so the page presents an email fallback. It also says the button indicates sold-out status, but the inspected component contains no availability-backed sold-out logic. This is a confirmed local mismatch, not proof that a live booking service is broken.

Immediate fix: describe the current workflow accurately as an inquiry. Remove unsupported claims about the button reflecting inventory. Say when and how the customer will learn whether a slot is available, using an owner-approved response timeframe.

Full implementation: select and integrate an actual scheduler/payment workflow. Show usable availability before taking money or reserve a slot for a defined checkout window. Coordinate payment, time selection, confirmation, cancellations, and refunds so payment cannot leave the buyer without an appointment. Show timezone explicitly. Use actual capacity; six slots should be an operating limit, not simulated scarcity.

Make the deliverable concrete: a thirty-minute planning conversation, followed by the written plan already promised in source, plus the included map link where applicable. Explain how the written-only alternative differs, its delivery time, and what inputs are needed. Define rescheduling, cancellation, and missed-call policies before publishing them. Show an anonymized example only if it exists or clearly label a constructed example.

Short intake: travel dates, party size, lodging/base, main question, and relevant trip constraints. Avoid requesting unnecessary personal information. Add consult links after complex planning decisions, not indiscriminately on every page.

Acceptance: inquiry, available, sold-out, payment-cancelled, payment-succeeded, scheduler-failed, rescheduled, and refunded states are coherent. The implementation agent must not invent provider credentials, availability, delivery commitments, or policies.

**10. Match the offer to the reader's immediate task — tickets 08 and 11**

The article template already limits the Field Guide promotion to trip-intent categories. However, the common product band appears after related reading, which gives a reader several exits before the paid offer. Improve placement selectively rather than adding repeated generic banners.

| Reading context | Useful offer | Suggested placement |
|---|---|---|
| Parking, shuttle, day itinerary | Carry timing, parking notes, and alternatives offline | After the practical answer or route summary |
| Cell service or packing | Download the Field Guide before departure | After the offline-preparation checklist |
| Lodging/base-town comparison | Check availability for the recommended area | Immediately after the relevant comparison |
| Complicated travel constraints | Ask about a trip consultation | After a decision section, once booking is operational |
| Seasonal/road-opening research | Subscribe to the relevant alert | Beside the update-dependent information |
| Nature/history reading | Continue reading or subscribe | At a natural editorial break |

Keep one principal commercial action per contextual block. Retain the full free answer. For a test cohort of relevant articles, move or replace the existing generic band instead of stacking a second large promotion above it. Record actual impressions as well as clicks.

The planning ecosystem has overlapping entry points: Start here, Planning Guide, selector, map, and itineraries. Give each a short job description and one next step. Preserve selected trip context through the existing map/app bridge wherever possible; inspect `page-map.jsx` and the bridge checks before building another transfer mechanism. Newsletter soft gates already have bypass behavior in source: keep useful results reachable without compulsory signup.

Acceptance: article content remains readable, offers fit the task, existing map links/imports still work, and a person does not have to reenter trip details unnecessarily.

**11. Make purchase success mean ready to use — ticket 09**

This is a QA and product-reliability recommendation, not a claim that onboarding is absent. The app already includes install and offline components.

After verified purchase, the next useful objective is a downloaded, usable guide. Inspect the current flow and ensure it exposes these states clearly: access confirmed; install instructions for the current device; download progress; map-area coverage; failed/interrupted downloads; retry/resume; completed offline readiness; and the last update time for cached live information.

Do not claim readiness merely because the app shell loaded. Verify required content and selected map areas. Distinguish a GPS position from an ability to place a call or obtain fresh conditions. Preserve the distinction already present in the sales page.

Acceptance scenarios: new iPhone buyer; Android buyer; desktop purchase followed by phone sign-in; blocked storage; lost email; interrupted download; app reopen in airplane mode; browser update; expired/refunded access; gift recipient. Perform payment tests in the approved test environment, not by making unsolicited live purchases. Check that device instructions match actual supported behavior.

**12. Proof, pricing, and supporting revenue — ticket 12**

Proof: retain the author story and genuine app captures. Add a compact author identity block near the main decision area with a real photo if available, name, verified relevant experience, and About link. Collect testimonials only from real users with permission; prioritize concrete accounts of use. Do not create reviews, customer counts, ratings, or “bestseller” labels.

Pricing: keep the current advertised price during the first usability release so the effect of flow changes is easier to interpret. The breadth of the app suggests price testing may eventually be worthwhile, but this audit cannot determine willingness to pay or profit at another price. Test price separately, after measuring payment completion, refunds, support effort, and activation. Honor existing entitlements. Avoid adding subscriptions or tiers just to create an upsell.

Consult bundle: including guide access in a consult could make sense, but requires an explicit business decision and an entitlement implementation. Do not silently promise it. Confirm it adds value rather than complicating a limited-capacity service.

Affiliates: the Kit page already provides functional packing checklists and a disclosure. Keep checklist completion independent from shopping. Make each product recommendation explain its use, when it is unnecessary, and which alternatives work. On lodging pages, help the user select a base before sending them to availability. Audit destination/merchant links and distinguish merchant clicks from confirmed bookings; outbound clicks are not revenue.

**13. Mobile, accessibility, and performance validation**

These are acceptance checks, not measured defects. No visual audit or performance benchmark was possible in this session.

- Test at 360, 390, 768, and 1440 CSS-pixel widths and at 200% zoom. Confirm no page-level horizontal overflow; intentional map scrolling should have a clear cue and usable text equivalent.
- Inspect the purchase bar with browser chrome, safe areas, keyboard open, footer visible, and inline checkout errors. Source already reserves bottom space and hides the bar in some overlapping states; verify it actually works.
- Make price, access duration, and important limitations comfortably readable. Some source metadata uses 10–12px text, making those elements specific candidates for review, not proof of a failed contrast or accessibility standard.
- Check semantic headings, labels, visible keyboard focus, menu dismissal, gift-form errors, and status announcements. Keep hidden purchase controls out of keyboard navigation.
- The walkthrough advances automatically every four seconds unless gated by visibility, reduced-motion preference, or interaction. Prefer manual advance by default or provide an obvious pause control. Preserve the existing reduced-motion support.
- Measure the homepage, a representative article, sales page, and preview on mobile connections. Inspect image transfer size, loading priorities, layout shifts, and script execution. Defer optional galleries and heavy map demonstrations where they compete with essential purchase information.
- Investigate the extracted page's broad article fallback and JavaScript dependence as a resilience/indexing concern. Do not report it as an observed broken visual layout. Confirm each important route has accurate meaningful initial HTML and a useful failure state.

**14. Measurement plan**

Existing events include guide CTA/sample clicks, purchase-button clicks, return-page purchase events, consult clicks, newsletter events, and map/selector interactions. Audit what is actually received before adding duplicate instrumentation.

Minimum journey: relevant page viewed → product offer seen → Field Guide viewed → sample engaged → checkout successfully started → verified purchase → access claimed → offline download completed. Preview is optional, so analyze direct buyers separately.

| Measure | Definition/use |
|---|---|
| Offer click-through | Unique visitors clicking an offer / unique visitors shown that offer; segment by placement and article intent |
| Product-page purchase rate | Verified buyers / eligible product-page visitors; disclose identity and attribution limitations |
| Checkout completion | Paid sessions / successfully created checkout sessions, using a consistent cohort window |
| Sample-assisted purchases | Verified purchases attributed to prior sample use; distinguish from direct purchases |
| Activation | Buyers completing access claim and offline readiness within a defined window, such as seven days |
| Refund rate | Refunded transactions / paid transactions in a cohort mature enough for the 30-day policy window |
| Consultation booking completion | Confirmed paid appointments / qualified inquiries or booking starts; choose one denominator per report |
| Affiliate performance | Outbound clicks plus separately reconciled merchant-reported bookings/commission, where available |

Use server-verified orders for revenue, and disclose consent/ad-blocker gaps in behavioral analytics. Do not send emails, access codes, claim tokens, or sensitive trip details as analytics properties. Keep public analytics separate from entitlement security.

Start with the baseline actually available. If traffic is too low for a meaningful randomized test, ship obvious consistency/error fixes, then evaluate directionally with matched periods, funnel counts, and a handful of observed usability sessions. Yosemite seasonality makes a simple before/after sales change unreliable evidence by itself. Do not claim a percent uplift from this audit.

**15. Recommended delivery sequence**

First release: resolve terms and copy drift; fix checkout error states; establish verified payment reporting; make consult availability wording accurate; expose current-customer sign-in clearly. Run focused tests and existing relevant checks.

Second release: shorten and reorder the sales page; improve homepage destination clarity; remove the preview purchase detour; test a contextual offer on a limited group of high-intent articles. Avoid simultaneous pricing changes.

Third release: finish scheduler/payment integration; improve offline activation based on observed failures; add genuine customer proof; evaluate affiliate decisions and deeper planning demonstrations. Prioritize using measured funnel losses.

**16. Copy-ready prompt for an implementation agent**

> Improve The Talus Field's user experience and purchase funnel using `docs/UX-SALES-AUDIT-2026-10-04.md`. Read the evidence limits and relevant repository instructions first. The report combines public text with local source; verify deployed behavior before calling an issue a production defect. Inspect `git status` and preserve all unrelated working-tree changes.
>
> Start with tickets 01–03 and the truthful-current-state portion of ticket 07. Unify approved product terms and pricing presentation, fix mobile checkout failures with visible accessible recovery, and separate return-page analytics from verified purchase truth. Preserve backend claim/webhook validation and existing entitlements. Do not invent testimonials, availability, guarantees, delivery timeframes, sharing rights, or provider credentials.
>
> Then implement tickets 04–06: reorder the Field Guide page around a concise buying decision, reuse existing samples/screenshots/comparison components, provide a deliberate direct purchase path from the preview, and make homepage free-planning versus paid-offline actions explicit. Keep existing free content and the site's visual identity. Keep existing URLs and modified-click behavior unless a documented migration requires otherwise.
>
> Inspect the existing map-to-app bridge, install/offline components, and analytics before adding replacements. Ensure price, duration, update scope, refund summary, gift behavior, and post-payment instructions agree across editorial pages, preview, checkout, structured data, and confirmation. Never collect payment without a coherent access or booking outcome.
>
> Relevant files include `page-guide.jsx`, `page-home.jsx`, `page-consult.jsx`, `page-article.jsx`, `page-planning-guide.jsx`, `components.jsx`, `styles.css`, `page-legal.jsx`, `app.jsx`, `edge/seo.js`, `apps/guide/src/routes/Preview.tsx`, `apps/guide/src/components/PreviewChrome.tsx`, `apps/guide/src/routes/Claim.tsx`, and the worker checkout/Stripe routes. Locate existing shared facts and infrastructure before adding new ones.
>
> Follow the repository's generation workflow. The root build is a static-site placeholder, not sufficient validation. Check applicable compilation, prerender, home-shell, SEO, asset-freshness, internal-link, trip-bridge, and app/worker tests. Regenerate affected artifacts using existing scripts; do not hand-edit compiled output as the primary change. Distinguish pre-existing failures from new regressions.
>
> Verify at phone/tablet/desktop widths, keyboard navigation, reduced motion, checkout cancellation/failure/success, gift flow, preview return, and offline activation in an approved test environment. If browser access is unavailable, document exactly what remains untested. Report changed behavior, checks run, remaining business decisions, and any unresolved risks. Treat scheduler setup, new pricing, and revised commercial policies as separate explicit decisions; implement independent improvements without waiting on them.

**17. Evidence index for handoff**

Public starting points: [Homepage](https://thetalusfieldjournal.com/), [Field Guide](https://thetalusfieldjournal.com/guide), [Consult](https://thetalusfieldjournal.com/consult), [Kit](https://thetalusfieldjournal.com/kit).

Local source anchors (search by symbol; line numbers will move):

- `page-home.jsx`: `HomeHero`, `HomePage` — hero section jumps, first-visit route, product/newsletter order.
- `components.jsx`: `NAV_GROUPS`, `HpGuideBand`, `NewsletterForm`, `SoftGate` — navigation, shared offer/price, existing signup behavior.
- `page-guide.jsx`: `GuideBuyBox`, `GuideMobileBuyBar`, `BuyNowButton`, `GuidePage`, `GuideCompare`, `GuideAfterPurchase`, `GUIDE_FAQ` — purchase behavior, duplicated claims, full page structure.
- `page-consult.jsx`: `CONSULT_PAYMENT_LINK_URL`, `CONSULT_BOOKING_URL`, `ConsultPage` — email fallback and booking claims.
- `page-article.jsx`: `tripIntent` / `article_end` — existing contextual eligibility and late placement.
- `apps/guide/src/routes/Preview.tsx`, `apps/guide/src/components/PreviewChrome.tsx` — sample scope and purchase links.
- `page-legal.jsx` — existing access and refund terms.
- `workers/src/routes/checkout.ts`, `workers/src/routes/stripe.ts` — verify authoritative payment and provisioning paths before implementation.
- `scripts/package.json` — actual generation and check commands.

This is a qualitative audit and implementation brief. Its strongest immediate actions are the source-backed consistency and flow repairs. Design changes should earn their place through usability checks and measured behavior.
