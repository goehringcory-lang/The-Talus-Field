# The Talus Field: five changes, September 2026

Research date: 5 September 2026. Scope: both products, the editorial site at
thetalusfieldjournal.com and the paid Field Guide PWA. The question asked was
"what five changes or new features should go on the website or the app", and
the method was three passes: a review of the repo (what is built, what is
built but switched off, what the strategy documents proposed and never
shipped), a market pass over the Yosemite and national-park apps and the
independent tools people pay for, and a policy pass over what the 2026
season actually did to visitors. `apps/guide/PWA-FEATURE-RESEARCH-2026-09.md`
(same day, PWA only) is the companion; this file does not repeat its
competitor table and cites it where the two agree.

Every external claim carries a URL. Where a source could not be fetched it is
marked. The five are ranked by (reader need × revenue or list effect) ÷ build
effort, with the constraint that a one-person editorial operation has to keep
each one honest after it ships.

## Where the two products stand

This matters because the obvious backlog is mostly done. Verified in the tree
on 5 September 2026:

- Shipped and live: renewals with the T-60/14/1 arc, gift purchases, promo
  code redemption, the `/preview` sample and signed-out stop teasers, the
  embeddable conditions widget, the three evergreen event pages, trip export
  (ICS and Web Share), a printable trip board (`/trip/print`), cross-device
  plan sync, web push (two notice types), GPS tracks with GPX export for all
  57 hikes, the compass, the field log, the daylight instrument, and this
  morning's infrastructure layer on the map (entrances, shuttle stops,
  picnic areas, services, landmarks).
- Shipped and switched off: `/consult` (two empty URL constants), the
  Expedia banner on `/stay`, the Booking, Stay22 and Hipcamp affiliate IDs,
  and 240 `aff: "#"` placeholders in `/kit` and the directory. The August
  code audit named "shipped fully and never switched on" as a pattern; it
  still holds. None of these is a feature to build, so none is in the five,
  but they are the cheapest revenue in the repo.
- The PWA is `noindex, nofollow` site-wide, which includes the `/preview`
  page and the 66 signed-out stop teasers that were built as shareable
  landing pages (code audit item 8, unfixed).
- No Search Console or GA4 export exists in the repo. The only demand
  numbers in the tree are two Search Console readings (1,902 impressions on
  the gateway-towns section anchors; 1,925 impressions and 9 clicks in 90
  days on the two Half Dome pieces before they were merged). The nightly
  Lighthouse trend is the only continuous measurement.

## One decision that is not a feature: the price

`GUIDE_PRICE_CENTS = "399"` while `MONETIZATION-IDEAS.md` still reasons at
$19, so its B2B code-pack model ($8 to $10 a code) and its price test are
both unsellable as written. The market floor for a one-time Yosemite guide is
$17 to $20 and never expires (GuideAlong $19.99, Shaka $16.99, Just Ahead up
to $19.99); the closest one-time comparable with a narrow premise is the
Photographer's Guide to Yosemite at $6.99; Chimani+ is $35.99 a year.

- https://guidealong.com/tour/yosemite-national-park/
- https://www.shakaguide.com/tours/california/yosemite-national-park-tour
- https://www.chimani.com/

The Field Guide is priced at a fifth of the category floor for an 18-month
term. Every feature below raises the value of the product; none of them
should ship into a price that undersells it. Recommendation: a sequential
test (not A/B) at $6.99 for one month, read from the `guide_purchase` event
and Stripe, then decide. It is a one-line change and reversible the same
day. The rest of this file assumes the decision is made either way.

## The five

### 1. Dates that matter: a Yosemite deadline calendar with reminders

**What.** One table of the dates that decide a Yosemite trip, rendered
twice. On the site, a standing `/dates` page listing each window with its
mechanics and a one-click `.ics` download per date (and one for the whole
year), plus a "remind me" capture per row that tags the subscriber
(`date-halfdome`, `date-wilderness`, `date-camping`), so the Sunday letter
can carry a dated nudge to exactly the people who asked. In the app, the same
table drawn against the buyer's trip dates on the trip board ("your June 14
Half Dome day: daily lottery opens June 12 at midnight, closes 4 p.m."), with
the existing push path offering one reminder per deadline.

The dates: Half Dome preseason lottery 1 to 31 March, results mid-April;
daily lottery two days ahead, midnight to 4 p.m. Pacific; wilderness lottery
24 weeks out in a Sunday-to-Saturday window, the 40% release seven days ahead
at 7 a.m.; campground releases on the 15th at 7 a.m. Pacific, five months
out, for the Pines, Wawona and Hodgdon, two weeks ahead for the rest, Camp 4
one week; the Firefall window; Tioga and Glacier Point typical openings; the
Tuolumne shuttle and store closing dates.

- https://www.nps.gov/yose/planyourvisit/hdpermits.htm
- https://www.nps.gov/yose/planyourvisit/wpres.htm
- https://www.recreation.gov/camping/campgrounds/232447
- https://www.sfgate.com/national-parks/article/yosemite-camping-reservations-2026-21297535.php

**Why.** People pay for the alerting half of this today and nobody sells the
calendar half. Outdoor Status charges $49 a year for Recreation.gov
cancellation texts on Yosemite wilderness permits; Campnab runs $10 to $50 a
month; Recreation.gov's own reviewers ask for lottery and booking reminders.
The Half Dome pages are the site's most-searched surface with the worst
click-through (1,925 impressions, 9 clicks), which is a page that answers the
question but gives the reader nothing to keep. A calendar file is the thing
to keep.

- https://outdoorstatus.com/unlimited/
- https://campnab.com/pricing
- `apps/guide/PWA-FEATURE-RESEARCH-2026-09.md` §2B (same finding, app side)

**What exists.** `apps/guide/src/content/seasonal.ts` already carries typed
windows with a `confidence` flag and the full moons to 2028;
`apps/guide/src/trip/ics.ts` is a hand-rolled ICS writer with a Pacific
VTIMEZONE and VALARM; `workers/src/lib/pushSweep.ts` has the dedupe-by-stage
pattern the reminder needs; `page-half-dome-lottery.jsx` and
`page-tioga-opening.jsx` already hold the mechanics in prose. The editorial
site has no ICS at all.

**Build.** Site: a new static route (the worked example is `/distances`, see
CLAUDE.md), an `.ics` generator in `scripts/` that writes the files at build
time from one JSON table so the page and the files cannot disagree, and the
tagged captures. App: a `deadlines` section on `/trip` reading the same table
(copied into `seasonal.ts`, with a check script asserting the two agree), a
third push notice kind. Medium. The ongoing cost is one row edit per year
per date, which the bulletin edition turn already touches.

**Measure.** `.ics` downloads (a GA4 event), `date-*` tag counts, reminder
opt-ins per trip in the app.

**Risk.** A wrong date here is worse than no date. Every row carries its NPS
source URL and the year it was verified, and the page prints the year.

### 2. Road alerts: Tioga, Glacier Point and the gateway highways, by email and push

**What.** A triggered alert, not a weekly letter. On the site, the capture
on `/tioga-opening` becomes "email me the day it opens" (tag `alert-tioga`),
with the same on `/conditions` for Glacier Point Road and for closures of
120, 140 and 41; the Worker's daily alerts refresh (which already pulls the
NPS alerts feed) diffs the road statuses it cares about and, on a change,
posts the change to the operator (a GitHub issue or the contact mailbox) so
the owner sends one short Buttondown email to the tag the same day. In the
app, a push notice when a road in the buyer's trip window changes state,
opening to the ParkNowPanel roads cell.

**Why.** This is the clearest unmet demand in the scan. A solo builder runs
istiogaopen.com purely to email people when Tioga opens, by scraping the NPS
plowing page. NPS itself offers only SMS (text YOSEMITE or YNPTRAFFIC to
333111). Tioga entrance visits rose 21.5% this year. And the last four days
showed the other half of the need: the Colorado Fire closed Highway 140
between Midpines and El Portal on 1 September and truncated YARTS, which is
the site's standing recommendation for the Merced approach; the bulletin had
to be corrected by hand.

- https://istiogaopen.com/
- https://www.nps.gov/yose/planyourvisit/tiogaopen.htm
- https://sierranewsonline.com/more-visitors-shorter-waits-yosemite-releases-new-summer-data/
- https://sierranewsonline.com/colorado-fire-forces-evacuations-closes-highway-140/
- https://mymotherlode.com/news/local/10934721/dealing-with-entrance-wait-times-and-parking-issues-in-yosemite.html

**What exists.** `workers/src/lib/alerts.ts` refreshes the NPS alerts feed
nightly and the app already renders `RoadsLine` from it; `page-tioga-opening.jsx`
already has a `NewsletterInline` tagged `tioga-opening` whose copy promises
"the announcement when it lands", delivered only as part of the Sunday
letter; `TRIP_MONTHS` in `intent-data.js` knows which months are `unsettled`.
The push sweep deliberately sends only two notice kinds and states its bar
("things a buyer would want their phone to interrupt them for"); a road
change inside the trip window clears that bar.

**Build.** Worker: a road-status snapshot in KV, a diff on each refresh, and
an operator notice on change (small). Site: retag the two captures and
rewrite their promise (trivial). App: one push notice kind gated to buyers
whose trip window covers the next 14 days (small to medium). The human step,
one email per change, is the honest version of the ops commitment
`MONETIZATION-IDEAS.md` 3.6 refused for SMS: no carrier compliance, no
uptime promise, and the owner decides what to say.

**Measure.** `alert-*` tag growth against `tioga-opening`; open rate of the
alert sends against the Sunday letter; push opt-in rate.

**Risk.** The NPS feed lags the road by hours on opening day; the copy says
"the day it opens", not "the minute". An alert that fires on a feed glitch
costs trust, so the diff requires two consecutive refreshes to agree before
it notifies.

### 3. Parking and the arrival wave: live lots in the app, "when the lots fill" on the site

**What.** In the app, the live half of the layer that shipped this morning: a
Worker route proxying the NPS API `parkinglots` endpoint (twelve Yosemite
lots with capacity and a `liveStatus` field) under the same staleness rules
as `/api/waits`, a "lots" cell in the ParkNowPanel that hides itself when the
feed is silent, and the status on each parking pin's popup. On the site, a
"Lots and gates now" block on `/conditions` and `/now` (live waits already
render in the masthead; add the lot statuses beside them), and an arrival
line in every trip-selector day plan and itinerary that names the hour to be
through the gate for that month and weekday, with the text-alert number
printed for the drive in.

**Why.** 2026 is the first no-reservation summer since 2019, and the park
replaced the reservation with "real-time traffic monitoring, active Valley
parking management and improved visitor alerts and trip-planning tools". The
result is that parking is now the reader's problem to time: on the first busy
Saturday, Curry Village filled at 10:59 a.m. and all Valley parking at 11:52
a.m., with towing; the park's own late-August data says two gridlock days all
year (both Memorial Day weekend) but still warns of two-hour waits after
8 a.m. on busy weekends. A new independent app, Yosemite.live, is monetizing
exactly this: five-entrance wait severity every five minutes, hourly crowd
predictions per gate, push on change. AllTrails, Chimani and the NPS app all
lead with "where can I park and how do I get around".

- https://www.nps.gov/yose/learn/news/yosemite-national-park-will-not-require-vehicle-reservations-in-2026.htm
- https://www.newstribune.com/news/2026/may/24/full-parking-lots-gridlock-traffic-fill-yosemite/
- https://sierranewsonline.com/more-visitors-shorter-waits-yosemite-releases-new-summer-data/
- https://yosemite.live/ (site returned 403; Play listing read instead, price unverified)
- https://www.yourcentralvalley.com/news/local-news/yosemite-real-time-wait-time/
- `apps/guide/PWA-FEATURE-RESEARCH-2026-09.md` §2C and §3 item 12

**What exists.** `EntranceWaits` in `components.jsx` already renders the
live NPS waits on the site; `workers/src/routes/waits.ts` is the pattern
(no cache, hide past 60 minutes, fail to empty); `content/amenities.ts` now
holds the twelve lots with capacities; `TRIP_MONTHS` and the crowd-forecast
article carry the month-by-month arrival guidance in prose; `/conditions`
mentions parking once, in the guide plug.

**Build.** Worker route plus app cell: small to medium (the shape is the
waits route, copied). Site block: small. The arrival line in `buildTripPlan`
is a table of `{month, weekday|weekend} -> hour` read from the crowd-forecast
article's own claims, asserted by `check-intent-tags.mjs` like every other
plan field. The live feed needs an NPS API key in the Worker (DEMO_KEY is
rate-limited).

**Measure.** Time on `/conditions`; `guide_cta_click` from the new block;
in the app, the cell is worth keeping if the feed is non-silent on most
summer days, which the API check module can record.

**Risk.** `liveStatus` may be sparse or stale in practice; the cell hides on
silence by design, and the site block says "as of" with a time, the
provenance stamp the PWA research lists as backlog item 3.

### 4. Companion mode in the Field Guide: "you are near", with read-aloud

**What.** A foreground-only screen in the app that surfaces the nearest
stop's teaser and "why stop here" paragraph as the GPS fix moves, with an
optional Web Speech read-aloud of that one paragraph, a persistent status
line ("GPS active, nearest stop 2.1 mi, Tunnel View"), and copy that says
plainly it runs only while the app is open. Positioned as the passenger's
companion, never a driving tour: a PWA cannot do CarPlay or background
audio, and the honest version says so.

**Why.** Every top-selling paid Yosemite product is built on one mechanic,
GPS triggering content on arrival so the passenger stops looking at the
screen: GuideAlong (200+ points, $19.99), Shaka (25 stops, $16.99), Just
Ahead, Chimani's tours. It is the strongest demand signal in both research
passes, and the consistent complaints (battery drain, unnerving silence
between segments) are the design brief. The Field Guide has the verified
coordinates and the prose and has written zero lines toward it.

- https://guidealong.com/tour/yosemite-national-park/
- https://www.shakaguide.com/tours/california/yosemite-national-park-tour
- https://www.justahead.com/tours/yosemite-national-park/
- `apps/guide/PWA-FEATURE-RESEARCH-2026-09.md` §2A and §6 item 1

**What exists.** `compass/useGeoWatch.ts` (watchPosition with a stable first
fix), the haversine "Near you" list on `/map`, `lib/position.ts` (dispatcher
formats), teasers and `whyStop` text on every stop, the Help card's
named-place index, and a Surveyor design system whose `.panel`/`.readout`
primitives are exactly the status line's shape. No recorded audio to
produce: the Web Speech API reads the paragraph the guide already has.

**Build.** Medium. One route, one hook composing `useGeoWatch` with the
nearest-stop search (debounced, with hysteresis so a stop does not flicker
in and out at the boundary), a speech wrapper that degrades to silence where
`speechSynthesis` is absent, and the status line. The battery answer is the
foreground-only rule plus a visible "pause" control.

**Measure.** The app has no analytics by design, so the measure is the sales
page: a companion-mode paragraph on `/guide` and whether `guide_purchase`
moves after it lands, plus the field-card share count.

**Risk.** Coordinate accuracy is the product, and 28 coordinates still carry
`TODO: verify on the ground`. Companion mode must read from the same
`verified` flag and skip an unverified stop rather than announce it 600 m
early.

### 5. The international visitor page and fee calculator

**What.** A standing page on the site, `/international`, for the reader
arriving from abroad: the $100 per-person non-resident surcharge at Yosemite
since 1 January 2026, the $250 non-resident America the Beautiful pass, the
fact that fee-free days now apply to US residents only, how the surcharge
interacts with the $35 vehicle fee and with Recreation.gov digital passes,
plus the things the catalog already knows and this reader cannot find in one
place: no reservation in 2026, chains in rental cars, no cash at any gate,
where the signal is, the YARTS train-and-bus route from Merced. Inside it,
one small deterministic calculator: party size, ages, days, vehicle or
transit, one park or several, returning the cheapest legal combination of
entrance fee and pass with the arithmetic shown. It links every relevant
article and ends with the guide.

**Why.** The rule is new this year, applies to Yosemite by name, is heavily
searched and easy to get wrong, and the catalog covers it in one paragraph of
the trip-cost article. Every 2026 "know before you go" page from the
Conservancy to the gateway lodges leads with it. The site's own strategy
documents never mention the international reader, though they are a material
share of Yosemite's summer visitors and the ones most likely to pay for a
guide that removes uncertainty. It is also the one page on this list a
routine can keep honest: the fee table is a `seo-data.json`-style fact set
with sources, and the evergreen refresh already re-verifies dated claims.

- https://www.nps.gov/planyourvisit/passes.htm
- https://www.doi.gov/pressreleases/department-interior-announces-modernized-more-affordable-national-park-access
- https://foacp.org/2026-national-park-fee-changes-for-non-residents/
- https://yosemite.org/know-before-you-go-yosemite-in-2026/
- https://yosemite.org/save-time-at-the-yosemite-entrance-gate-with-a-digital-pass/

**What exists.** `bodies/yosemite-trip-cost-budget-2026.jsx` carries the
one paragraph and its source; `getting-to-yosemite`,
`yosemite-shuttle-and-yarts` and `yosemite-from-los-angeles` carry the
transit and chain material; the trip selector's `buildTripPlan` is the model
for a deterministic calculator with an exhaustive check script. There is no
`hreflang` and no non-English copy anywhere, and this page does not propose
adding any: it is written in English for an English-reading visitor, which
is the audience the site can serve honestly.

**Build.** Small to medium: the static-route recipe in CLAUDE.md
(`/distances` is the worked example), one fee table with sources and a
verification date, one calculator with a check script over every input
combination, a `KEEP_GOING` entry, an intent tag so the trip selector's
`stage: before-booking` chip can reach it.

**Measure.** Search Console impressions and clicks on the new URL at 4 and 12
weeks; `guide_cta_click` with location `international`.

**Risk.** Fee policy changes by rule, not by season, so the page prints its
verification date and the evergreen refresh gets a row for it in
`ROUTINES.md`'s territory table.

## Considered and set aside

- **App Store distribution.** A PWA cannot be submitted as a URL and WebView
  wrappers are rejected under Guideline 4.2 without native features
  (https://www.mobiloud.com/blog/publishing-pwa-app-store). iOS 26 made every
  Home Screen web app a real web app by default with no install requirements
  (https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), so the
  install path improved on its own. Keep the in-app install sheet.
- **A campsite cancellation scanner.** Campflare is free and Arvie books for
  you with live agents; a one-person site cannot win on polling frequency.
  Feature 1 sells the calendar and links the scanners.
- **SMS alerts.** Refused in `MONETIZATION-IDEAS.md` 3.6 for good reasons;
  feature 2 is the email-and-push version.
- **A paid newsletter tier.** No Yosemite comparable with disclosed numbers
  was found, and the letter is the top of every funnel.
- **Offline Q&A over the guide's content.** Chimani's offline "Parkly" and
  Rexby's per-creator assistant set the expectation
  (https://www.chimani.com/), and the app already has an offline search
  index; but a retrieval layer that can answer wrong is the one failure this
  product exists to avoid, and the sample size to tune it does not exist yet.
  Revisit after a season of companion-mode use.
- **PDF export of the trip-selector plan.** Wanderlog and Layla gate PDF
  behind $40 to $50 a year, but the app already prints the trip board and
  the site's plan is a shareable URL. Low marginal value.
- **Gift purchase, renewals, Wallet passes.** Gift and renewals are shipped.
  Wallet adoption for third-party passes is uneven and the magic link works.
- **Per-trail condition scores.** AllTrails Peak charges $79.99 a year
  largely for this, but the guide's honesty rule (a cell that cannot be
  vouched for is hidden) makes a derived score a promise it cannot keep.

## Sequence

1. The price decision (a config line), then switch on the shipped revenue
   surfaces, before any of the five.
2. Feature 3 (parking) and feature 2 (road alerts) first: both are Worker
   routes copied from `waits`, both matter most before the Tioga closing
   season and next spring's openings, and both give the bulletin something
   live.
3. Feature 1 (dates) before March, when the Half Dome preseason lottery
   makes the page findable.
4. Feature 5 (international) any time; it is the smallest and the most
   routine-maintainable.
5. Feature 4 (companion mode) as the next `[guide]` pass, after the eight
   coordinate checks in the PWA research file are settled, because it is the
   one that reads coordinates aloud.

## Not verified

Gaia GPS 2026 list prices; Yosemite.live pricing; 2025 and 2026 Half Dome
lottery statistics (NPS has posted only 2024); r/Yosemite and TripAdvisor
thread content (both hosts returned 403); any published web-checkout versus
App Store conversion data for paid travel guides; the current EU status of
iOS Home Screen web apps.
