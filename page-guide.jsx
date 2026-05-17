/* global React, Placeholder, MotifMountains, NewsletterInline */

const GUIDE_PRICE = "$29";

// API base for the Field Guide Worker. Override at runtime by setting
// window.GUIDE_API_BASE before this script loads (e.g. local dev:
// `window.GUIDE_API_BASE = "http://localhost:8787"` in a console snippet).
const GUIDE_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

// Public URL of the PWA. Override at runtime via window.GUIDE_APP_BASE.
const GUIDE_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://guide.thetalusfieldjournal.com";

// Scarcity defaults. Used as fallback if /api/inventory is unreachable.
const GUIDE_FALLBACK_SOLD = 53;
const GUIDE_MONTHLY_CAP = 100;
const GUIDE_MONTH_LABEL = "May 2026";
const GUIDE_NEXT_OPEN = "June 1";

function GuidePage({ go }) {
  const [sold, setSold] = React.useState(GUIDE_FALLBACK_SOLD);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${GUIDE_API_BASE}/api/inventory`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data.sold === "number") setSold(data.sold);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const remaining = Math.max(0, GUIDE_MONTHLY_CAP - sold);
  const isSoldOut = remaining <= 0;
  const soldPct = Math.min(100, (sold / GUIDE_MONTHLY_CAP) * 100);

  return (
    <div className="page">
      {/* Hero */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Field Guide · Offline app · 2026 Edition</div>
          <h1>The Yosemite guide for people who already know about Glacier Point.</h1>
          <p className="page-head__dek">
            A web app you add to your home screen. Tappable GPS for the parking spots locals use, the trailheads that stay quiet, and the insider tactics for visiting the famous places without the crowd. Works offline at the trailhead when service dies. Not a PDF. Not another tourist checklist. The trip you actually came for.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "start" }}>

          {/* Left column. Body */}
          <div className="prose">
            <Placeholder
              image="img/talus-flows-yosemite.jpg"
              caption="Talus along the valley walls."
              credit="USGS / Alex Demas"
              tag="PLATE I"
              size="lg"
              style={{ aspectRatio: "16 / 10", marginBottom: 32 }}
            />

            <h2>What this is, and what it isn't</h2>

            <p>
              The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, stop at Tunnel View, and look up at El Capitan from the Yosemite Valley floor. You already know those exist. You don't need another website telling you the same thing in a different font.
            </p>

            <p>
              This guide assumes you've done that reading. What it gives you is the other half of the trip: the parking spots and trailheads most visitors never find, and the insider tactics for visiting the famous places well: when to go, where to come from, and what most people get wrong. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, "I have five days. Show me what to do."
            </p>

            <h2>The parking nobody tells you about</h2>

            <p>
              Half the misery of a Yosemite day is the parking. The big lots fill by mid-morning and you spend the next hour circling. Most visitors never find out about the small turnouts a quarter mile down the road, the unmarked pull-offs at the back side of the meadow, the ranger-station lots that empty out at 10am, or the back-side approaches that put you on the trail two miles closer to where you actually want to be.
            </p>

            <p>
              The guide has tappable GPS coordinates for every one of them. Tap the coordinate, your Maps app opens with the line drawn for you. Park where the locals park.
            </p>

            <h2>The trailheads where you find solitude</h2>

            <p>
              Yosemite has hundreds of miles of trail and ninety percent of visitors hike on five percent of it. The other ninety-five percent is where the park you came for actually lives. The guide has GPS coordinates to the trailheads most visitors skip: the ones that aren't on the top-ten lists, the ones with no signs from the road, the ones where you'll see more deer than people.
            </p>

            <p>
              Each trailhead comes with an elevation profile so you know exactly what you're walking into: total gain, peak elevation, and the section where the trail actually gets hard.
            </p>

            <h2>How to visit the bucket-list spots without the crowd</h2>

            <p>
              Glacier Point. Mariposa Grove. Tunnel View. Yosemite Falls. The Half Dome view from the Valley floor. Yes, you should see them. They're on your list for a reason. But the difference between the version that becomes a memory and the version that becomes a parking-lot photo is timing, approach, and a few small choices most visitors don't know to make.
            </p>

            <p>
              The guide gives you those choices. The hour to be there. The direction to come from. The viewpoint twenty yards off the marked spot that nobody else is standing at. The five-minute window where the light does what you came for.
            </p>

            <h2>The regional guides</h2>

            <p>
              All of this is organized by where you are in the park, not how long you're staying. Pick the region you're heading to, read the stops in suggested order, and do the ones that fit your day.
            </p>

            <ul>
              <li><strong>Yosemite Valley & surrounding areas.</strong> The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall on El Capitan, the Mist Trail to Vernal and Nevada Falls, and the valley lodgings.</li>
              <li><strong>Glacier Point & the Mariposa Grove.</strong> The southern rim and the giant sequoias. Higher elevation, more driving, and the panoramas that put the whole valley below you. Closed in winter.</li>
              <li><strong>Tuolumne Meadows & the Highway 120 corridor.</strong> The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October.</li>
            </ul>

            <p>Inside each itinerary, alongside the parking and trailhead coordinates, you also get:</p>

            <ul>
              <li><strong>Trip-planning maps</strong> with the day's route, the alternates, and the swap points if the original plan dies.</li>
              <li><strong>Time budgets</strong> for every stop, drive, and meal. The kind of timing that prevents the late-afternoon scramble.</li>
              <li><strong>A seasonal packing checklist.</strong> Check items off in-app or print it for the dresser.</li>
              <li><strong>The contingency tree.</strong> What to do if the road is closed, the lot is full, the smoke rolled in, the weather turned.</li>
            </ul>

            <h2>What's NOT inside</h2>

            <p>I think you should know what you're not getting before you buy something.</p>

            <ul>
              <li>This is not the standard tourist guide. If you want a list of the ten most famous viewpoints with the basic directions to each, every other Yosemite site already gives you that for free. This guide is what comes after that.</li>
              <li>It is not a children's activity book or a photography manual. Both could be their own books.</li>
              <li>It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both.</li>
              <li>It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.</li>
            </ul>

            <h2>Who it's for</h2>

            <p>
              First-time visitors who want a real plan, not a list. Second-time visitors who came home from their first trip feeling like they'd missed the actual park and want to fix it. Returning visitors who realize the trip they've been doing for years has been the wrong version. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it.
            </p>

            <p>
              If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it, you might not need the guide. The guide is for people who want the spreadsheet already built.
            </p>

            <h2 id="why-cap">Why I cap this at 100 a month</h2>

            <p>
              The whole guide rests on places that work because most visitors haven't found them yet. The small turnout. The quiet trailhead. The viewpoint nobody is standing at. Share any one of them with ten thousand people and it stops being the place I'm sending you to. The recommendation stops being good. The guide stops being worth its price.
            </p>

            <p>
              So I cap it. One hundred copies a month, then the cart closes until the first of the next month. The number isn't a marketing trick. It's the rough volume the places I'm sending you can absorb without becoming the next overcrowded photograph in someone's feed.
            </p>

            <p>
              If you arrive and the month is sold out, come back on the first. The fairer system is to make people wait a few weeks. The alternative is to ruin the locations.
            </p>

            <p>
              <a href="#cap" onClick={(e) => { e.preventDefault(); go("cap"); }}>Read the full policy on the cap →</a>
            </p>

            <h2>Format and delivery</h2>

            <ul>
              <li><strong>A web app you add to your home screen.</strong> Looks and feels like a native app. It is not a PDF and not a printed book. No App Store, no install wait, no version to keep updated.</li>
              <li><strong>Works offline.</strong> The whole guide, every photo, and offline map tiles for Yosemite cache to your device on first open. Lose service in the Valley or up at Tuolumne, the guide is still there.</li>
              <li><strong>Tappable GPS coordinates</strong> that open Apple Maps or Google Maps directly. No copying, no typing.</li>
              <li><strong>Embedded maps for every day,</strong> with all stops on one screen.</li>
              <li><strong>Updates push silently through the 2026 season.</strong> New advice, route swaps, seasonal addenda all arrive without you re-downloading anything.</li>
              <li><strong>Buy once, log in on every device you own.</strong> iPad in the car, iPhone at the trailhead, laptop the night before.</li>
            </ul>

            <h2>One small promise</h2>

            <p>
              If you read the guide, take the trip, and feel like the book didn't earn its price, write to me and I'll refund it. I'd rather have a smaller number of trips that worked than a larger number of unhappy purchases. The address is on the contact page.
            </p>

            <p>That's the offer.</p>
          </div>

          {/* Right column. Sticky purchase aside */}
          <aside style={{ position: "sticky", top: 100, alignSelf: "start", border: "1px solid var(--ink)", padding: 32, background: "var(--paper-2)" }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The Field Guide</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 56, lineHeight: 1, fontWeight: 500, marginBottom: 8 }}>{GUIDE_PRICE}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 24 }}>
              Offline app · 2026 Edition
            </div>

            {/* Scarcity block */}
            <div style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", paddingTop: 18, paddingBottom: 18, marginBottom: 22 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {isSoldOut ? `${GUIDE_MONTH_LABEL} · Sold out` : `Limited release · ${GUIDE_MONTH_LABEL}`}
              </div>
              <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500, lineHeight: 1.2, marginBottom: 12 }}>
                {isSoldOut
                  ? `0 of ${GUIDE_MONTHLY_CAP} remaining`
                  : `${remaining} of ${GUIDE_MONTHLY_CAP} remaining`}
              </div>
              <div style={{ height: 4, background: "var(--rule)", marginBottom: 12, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${soldPct}%`, background: "var(--ink)" }} />
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>
                {isSoldOut
                  ? <>Reservations open {GUIDE_NEXT_OPEN}. <a href="#cap" onClick={(e) => { e.preventDefault(); go("cap"); }} style={{ color: "var(--ink-2)" }}>Why a cap?</a></>
                  : <>Resets {GUIDE_NEXT_OPEN}. <a href="#cap" onClick={(e) => { e.preventDefault(); go("cap"); }} style={{ color: "var(--ink-2)" }}>Why a cap?</a></>}
              </div>
            </div>

            {/* Pre-Stripe waitlist. Captures email with a Buttondown tag
                so the warm list is ready when Stripe checkout reopens.
                Existing buyers can still sign in to the PWA via the
                small link in the description below. The scarcity bar
                and sold-out state above stay intact for the relaunch. */}
            <form
              action="https://buttondown.email/api/emails/embed-subscribe/goehring"
              method="post"
              target="popupwindow"
              onSubmit={() => window.open("https://buttondown.email/goehring", "popupwindow")}
              style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}
            >
              <input type="hidden" name="tag" value="guide-waitlist" />
              <input type="hidden" name="embed" value="1" />
              <label
                htmlFor="guide-waitlist-email"
                className="eyebrow"
                style={{ marginBottom: 0 }}
              >
                Join the waitlist
              </label>
              <input
                id="guide-waitlist-email"
                type="email"
                name="email"
                placeholder="you@email.com"
                required
                style={{
                  padding: "12px 14px",
                  border: "1px solid var(--ink)",
                  background: "var(--paper)",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                className="btn"
                style={{ display: "block", width: "100%", textAlign: "center", border: 0, font: "inherit", cursor: "pointer" }}
              >
                Get first access →
              </button>
            </form>

            <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>
              The Field Guide PWA is in private preview. Join the waitlist for first access when checkout reopens. An offline app: tappable GPS for hidden parking, the trailheads that stay quiet, and tactics for the famous spots. Three regional guides (the Valley, Glacier Point & Mariposa, Tuolumne & Hwy 120). Updates push automatically through the 2026 season. Refund if it doesn't earn its keep.
            </p>

            <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "12px 0 0" }}>
              Existing buyer? <a href={`${GUIDE_APP_BASE}/login`} style={{ color: "var(--ink-2)" }}>Sign in to the app →</a>
            </p>

            <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>In the app</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                <li>· Tappable GPS for hidden parking and trailheads</li>
                <li>· Elevation profiles per hike</li>
                <li>· Embedded day-maps</li>
                <li>· Valley, Glacier Point & Mariposa, and Tuolumne guides</li>
                <li>· Works offline anywhere in the park</li>
                <li>· Hour-by-hour time budgets</li>
                <li>· Contingency tree for closures</li>
                <li>· Seasonal packing list</li>
              </ul>
            </div>

            <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Questions</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, margin: 0 }}>
                Email <a href="mailto:Goehring.cory@gmail.com" style={{ color: "var(--ink-2)" }}>Goehring.cory@gmail.com</a> or use <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }} style={{ color: "var(--ink-2)" }}>the contact form</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingBottom: 96 }}>
        <NewsletterInline
          heading="Sunday Field Notes"
          blurb="A short note on Sundays. Subscribers hear about Field Guide updates and seasonal addenda first."
        />
      </div>
    </div>
  );
}

window.GuidePage = GuidePage;
