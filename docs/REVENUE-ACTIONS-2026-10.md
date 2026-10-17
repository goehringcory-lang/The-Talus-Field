# Revenue actions, October 2026

Prepared October 16, 2026. This is a ranked list of what would raise revenue. It complements `MONETIZATION-IDEAS.md`, `CONVERSION-STRATEGY.md` and `docs/UX-SALES-AUDIT-2026-10-04.md`. It does not replace them.

## Where the money stands

- **Field Guide:** $3.99. September brought 1 sale; October has 0 so far, from the public `sold` count. The owner chose on October 16 to keep the price.
- **Newsletter:** 49 addresses in Buttondown. The newest arrived October 14 through `/api/subscribe`, so the Worker path works. It arrived with no tags, so check that tags reach subscriber records.
- **Affiliates:** Patagonia, Expedia and Bookshop are live, and Stay22 since October 16 (secondary comparison links on `/stay` and `/itineraries`). Booking, Hipcamp and the Expedia banner have empty IDs. The kit holds 236 dormant `aff: "#"` items, and almost all of them are hardgoods that Patagonia does not sell.
- **Consults:** the page lists a $95 price but can only take an email, because both URL constants in `page-consult.jsx` are empty.

The sales funnel is in good order. The October audit tickets 02 (the mobile checkout error) and 05 (buying directly from the preview) are both shipped. Revenue is limited by two things: traffic, and revenue surfaces that were built but never switched on. The code is not the problem.

## Shipped in this branch

Disclosed affiliate links were added to six high-intent articles. Each link sits on advice the article already gave. Each article now carries `aff: true`, the disclosure under the byline and `AffiliateNote` at the end, and its body version has been bumped.

| Article | Link | `aff_list` |
|---|---|---|
| `so-you-want-to-hike-half-dome` | "layers" for the Clouds Rest summit (Patagonia, insulated jacket) | `article_inline` |
| `cathedral-lakes-day-hike` | "layers" (fleece) and "rain shell" (rain jacket) | `article_inline` |
| `tuolumne-meadows-in-a-day` | "rain shell" | `article_inline` |
| `horsetail-fall-firefall` | "real layers" (down jacket) | `article_inline` |
| `first-yosemite-backpacking-trip` | "long sleeves" (sun hoody) | `article_inline` |
| `when-to-visit-yosemite` | One `LodgingCta` (Expedia, Yosemite-area search) after "The days I would pick" | `article_cta` |

`when-to-visit-yosemite` answers the "best time to visit Yosemite" query. A reader who has just chosen dates is close to booking a room, and until now the page had no lodging unit. To measure the change, compare `affiliate_click` for these six slugs with the earnings shown in the Partnerize and Impact dashboards.

## Your court, ranked by expected dollars

1. **Make `/consult` sellable** by pasting two URLs: a Stripe Payment Link for $95 into `CONSULT_PAYMENT_LINK_URL`, and a Cal.com or similar booking URL into `CONSULT_BOOKING_URL` (both in `page-consult.jsx`). The trip selector already sends long, constrained and unbooked-peak trips to this page. One consult earns about as much as 24 guide sales.
2. **Join REI through AvantLink.** *Status October 16: application 1667769 submitted, and the site-verification tag is live on the homepage (#583). Next: click Verify in AvantLink, wait for network approval, apply to REI's program, then paste one REI link from AvantLink's link builder into `REI_AFFILIATE_BASE` in `affiliate.js`. The kit's 129 mapped items and the /affiliate line switch on from that one paste. Remove the verification tag from `index.html` once approved.* Originally: One approved ID would turn on most of the 236 dormant kit links: headlamps, filters, bear canisters, poles, tents, stoves and boots. It would also cover the gear named in the backpacking, bears and winter hikes articles. Paste the ID and the wiring is one registry entry in `affiliate.js` plus flipping the dormant kit items.
3. **Join Amazon Associates** for binoculars and camera gear. The wildlife, birding, climber-watching and photography articles tell readers to carry these, and they stay linkless today.
4. **Paste the Expedia banner** (`EXPEDIA_BANNER.img` and `.href` in `affiliate.js`). It needs two URLs from creator.expediagroup.com, and the `/stay` slot is already built.
5. **Get an Expedia car-rental deep link.** The Travel Creator program covers cars as well as hotels. Copy one working car-rental search URL from the creator dashboard's link builder; Expedia blocked automated checks, so this branch could not verify the URL format. Once it is pasted, the "Rent a car, usually" section of `best-airport-for-yosemite` and the two drive-in articles (Los Angeles, Las Vegas) can carry a disclosed link.
6. **Join GetYourGuide or Viator** for the car-free reader who wants a day tour from San Francisco. Leave the concessioner's in-park tours linkless if they are the better recommendation, as the `/affiliate` guardrail requires.
7. **Booking.com and Hipcamp:** the applications are still pending (Stay22 was approved and is live as of October 16). Hipcamp fits the camping guide best.
8. **Write a Buttondown welcome sequence** (CONVERSION-STRATEGY R9). No automation exists, so new subscribers hear nothing until Sunday, and `TALUS30` reaches nobody.
9. **Price:** the owner kept $3.99 on October 16. The September research case for a $6.99 test still stands if you revisit it later. The change is one line, `GUIDE_PRICE_CENTS` in `workers/wrangler.toml`, plus the hard-coded fallbacks.
10. **Exit-intent modal:** keep it or retire it. It brought in 7 of the first 48 signups.

## What is not worth doing

Display ads, a paid newsletter tier, invented scarcity and pop-ups beyond the existing one. At this traffic level, any of these would cost more trust than it earns (`MONETIZATION-IDEAS.md` 3.6).
