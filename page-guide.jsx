/* global React, Placeholder, MotifMountains, NewsletterInline */

// Public URL of the PWA. Override at runtime via window.GUIDE_APP_BASE.
// The app serves from the Cloudflare Pages URL; switch this back to
// https://guide.thetalusfieldjournal.com once that custom domain is attached
// to the Pages project.
const GUIDE_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://talus-field-guide.pages.dev";

// Worker API base. Override at runtime via window.GUIDE_API_BASE.
const GUIDE_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

// Shown until /api/inventory answers with the live price; keep in sync with
// GUIDE_PRICE_CENTS in workers/wrangler.toml.
const GUIDE_PRICE_FALLBACK_CENTS = 1900;

// GUIDE-LAUNCH: flipped to true July 2026, back to false for a sales pause.
// True renders the Stripe buy box (GuideBuyBox); false renders the waitlist
// aside (GuideWaitlistBox), whose button emails the operator that a reader
// wants in. The robots/sitemap/footer flips landed earlier with the
// public-waitlist pass. Merging a true flag to main puts the guide on sale:
// the ops gate in LAUNCH-READINESS.md must be cleared first.
const GUIDE_ON_SALE = false;

function formatPrice(cents) {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

// Reads ?guide=success|gift-success|cancel left behind by the Stripe redirect.
function readCheckoutOutcome() {
  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("guide");
    return value === "success" || value === "gift-success" || value === "cancel"
      ? value
      : null;
  } catch (_e) {
    return null;
  }
}

// Mirrors GIFT_NOTE_MAX in workers/src/routes/checkout.ts.
const GIFT_NOTE_MAX = 280;

function formatReopens(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "the first of next month";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  } catch (_e) {
    return "the first of next month";
  }
}

function GuideBuyBox() {
  const [busy, setBusy] = React.useState(false);
  const [soldOut, setSoldOut] = React.useState(null); // { reopens } or null
  const [error, setError] = React.useState(null);
  const [outcome] = React.useState(readCheckoutOutcome);
  const [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  const [giftMode, setGiftMode] = React.useState(false);
  const [giftEmail, setGiftEmail] = React.useState("");
  const [giftNote, setGiftNote] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${GUIDE_API_BASE}/api/inventory`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
          setPriceCents(body.priceCents);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function startCheckout() {
    const recipient = giftEmail.trim();
    if (giftMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setError("Enter the recipient's email address first.");
      return;
    }
    setBusy(true);
    setError(null);
    if (window.track)
      window.track("guide_buy_click", { location: "guide_aside", gift: giftMode });
    try {
      const res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: giftMode
          ? JSON.stringify({ gift: true, recipientEmail: recipient, giftNote: giftNote.trim() })
          : undefined,
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 409 && body.soldOut) {
        setSoldOut({ reopens: body.reopens });
        return;
      }
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      setError(
        "Checkout didn't start. Try again in a minute, or email cory@thetalusfieldjournal.com."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside style={{ position: "sticky", top: 100, alignSelf: "start", border: "1px solid var(--ink)", padding: 32, background: "var(--paper-2)" }}>
      <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The Field Guide</div>
      <div style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1.05, fontWeight: 500, marginBottom: 8 }}>{formatPrice(priceCents)}.</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 24 }}>
        Offline app · 2026 Edition
      </div>

      {outcome === "success" && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 18px", border: "1px solid var(--ink)", padding: "12px 14px", background: "var(--paper)" }}>
          Payment received. Your access code and sign-in link are on their way to your email. Check spam if nothing arrives in a few minutes. Once you have the code, <a href={`${GUIDE_APP_BASE}/login`} style={{ color: "var(--ink-2)" }}>open the app and sign in →</a>
        </p>
      )}
      {outcome === "gift-success" && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 18px", border: "1px solid var(--ink)", padding: "12px 14px", background: "var(--paper)" }}>
          Payment received. Their access email is on its way to them, and your receipt is on its way to you. If you typed the wrong address, reply to the receipt and it gets moved.
        </p>
      )}
      {outcome === "cancel" && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 18px" }}>
          Checkout was cancelled. Nothing was charged.
        </p>
      )}

      {soldOut ? (
        <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 14px" }}>
          This month's copies are gone. Sales reopen {formatReopens(soldOut.reopens)}. The sign-up form at the bottom of the page will tell you when.
        </p>
      ) : (
        <React.Fragment>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", marginBottom: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={giftMode}
              onChange={(e) => setGiftMode(e.target.checked)}
              style={{ accentColor: "var(--ink)" }}
            />
            Buying it as a gift?
          </label>
          {giftMode && (
            <div style={{ marginBottom: 14 }}>
              <div className="field">
                <label htmlFor="gift-email">Recipient's email</label>
                <input
                  id="gift-email"
                  type="email"
                  required
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  placeholder="them@email.com"
                />
              </div>
              <div className="field">
                <label htmlFor="gift-note">A short note to include, optional</label>
                <textarea
                  id="gift-note"
                  maxLength={GIFT_NOTE_MAX}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  style={{ minHeight: 70 }}
                />
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "8px 0 0" }}>
                Their access email goes straight to them when payment clears. Their 18 months start today, so time it to the trip.
              </p>
            </div>
          )}
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={startCheckout}
            style={{ display: "block", width: "100%", textAlign: "center", border: 0, font: "inherit", cursor: busy ? "wait" : "pointer", marginBottom: 14 }}
          >
            {busy
              ? "Opening checkout…"
              : `${giftMode ? "Gift the guide" : "Buy the guide"} → ${formatPrice(priceCents)}`}
          </button>
        </React.Fragment>
      )}

      {error && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--moss)", lineHeight: 1.55, margin: "0 0 14px" }}>
          {error}
        </p>
      )}

      <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>
        One payment. The app, every photo, and the offline park map are yours for 18 months on every device you own. Updates push automatically through the 2026 season, including the Secret Guide as it grows.
      </p>

      <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "12px 0 0" }}>
        Want to see it first?{" "}
        <a
          href={`${GUIDE_APP_BASE}/preview`}
          onClick={() => {
            if (window.track) window.track("guide_sample_click", { location: "guide_aside" });
          }}
          style={{ color: "var(--ink-2)" }}
        >
          Read a free sample of the app →
        </a>
      </p>

      <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "8px 0 0" }}>
        Already bought it? <a href={`${GUIDE_APP_BASE}/login`} style={{ color: "var(--ink-2)" }}>Sign in to the app →</a>
      </p>

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>In the app</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
          <li>· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy</li>
          <li>· Tappable GPS for every stop</li>
          <li>· An offline topo map of the park, all stops pinned</li>
          <li>· Download the whole guide for offline, about 50 MB</li>
          <li>· Time budgets and a swap for when the lot is full</li>
          <li>· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline</li>
          <li>· A trip planner that syncs your days to Google Calendar, or any calendar app, and re-syncs when you change the plan</li>
          <li>· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app</li>
          <li>· Search across everything</li>
          <li>· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included</li>
        </ul>
      </div>

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Questions</div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, margin: 0 }}>
          Email <a href="mailto:cory@thetalusfieldjournal.com" style={{ color: "var(--ink-2)" }}>cory@thetalusfieldjournal.com</a>.
        </p>
      </div>
    </aside>
  );
}

// Pre-launch waitlist aside. Same sticky slot as GuideBuyBox; honest copy,
// price kept visible as plain text for anchoring, no scarcity counter while
// nothing is on sale. The "Put me on the wait-list" button POSTs the reader's
// email to the Worker's /api/waitlist, which mails the operator that they want
// in (honeypot + per-IP rate limit on the server). A non-empty `website`
// field is the honeypot: real browsers leave it blank.
function GuideWaitlistBox() {
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function joinWaitlist(e) {
    e.preventDefault();
    const addr = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError(null);
    if (window.track) window.track("guide_waitlist_join", { location: "guide_aside" });
    try {
      const res = await fetch(`${GUIDE_API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr, website }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (_e) {
      setError(
        "That didn't go through. Try again in a minute, or email cory@thetalusfieldjournal.com."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside style={{ position: "sticky", top: 100, alignSelf: "start", border: "1px solid var(--ink)", padding: 32, background: "var(--paper-2)" }}>
      <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The Field Guide</div>
      <div style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1.05, fontWeight: 500, marginBottom: 8 }}>Not out yet.</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 24 }}>
        Offline app · 2026 Edition
      </div>

      <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 18px" }}>
        The guide is in final testing. It will be $19, one payment, 18 months of access on every device you own. Leave your email and you will hear the day it opens, before anyone else.
      </p>

      {done ? (
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 18px", border: "1px solid var(--ink)", padding: "12px 14px", background: "var(--paper)" }}>
          You're on the list. I'll email you the day the guide opens.
        </p>
      ) : (
        <form onSubmit={joinWaitlist}>
          <div className="field">
            <label htmlFor="waitlist-email">Your email</label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          {/* Honeypot: hidden from real users, catches bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <button
            type="submit"
            className="btn"
            disabled={busy}
            style={{ display: "block", width: "100%", textAlign: "center", border: 0, font: "inherit", cursor: busy ? "wait" : "pointer", marginTop: 14 }}
          >
            {busy ? "Sending…" : "Put me on the wait-list"}
          </button>
          {error && (
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--moss)", lineHeight: 1.55, margin: "14px 0 0" }}>
              {error}
            </p>
          )}
        </form>
      )}

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>In the app</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
          <li>· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy</li>
          <li>· Tappable GPS for every stop</li>
          <li>· An offline topo map of the park, all stops pinned</li>
          <li>· Download the whole guide for offline, about 50 MB</li>
          <li>· Time budgets and a swap for when the lot is full</li>
          <li>· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline</li>
          <li>· A trip planner that syncs your days to Google Calendar, or any calendar app, and re-syncs when you change the plan</li>
          <li>· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app</li>
          <li>· Search across everything</li>
          <li>· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included</li>
        </ul>
      </div>

      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Questions</div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, margin: 0 }}>
          Email <a href="mailto:cory@thetalusfieldjournal.com" style={{ color: "var(--ink-2)" }}>cory@thetalusfieldjournal.com</a>.
        </p>
      </div>
    </aside>
  );
}

function GuidePage({ go }) {
  return (
    <div className="page">
      {/* Hero */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Field Guide · Offline app · 2026 Edition</div>
          <h1>The Yosemite guide for people who already know about Glacier Point.</h1>
          <p className="page-head__dek">
            A web app you add to your home screen. Four regional guides with tappable GPS, time budgets, a swap for when the plan dies, an offline topo map of the whole park, the ranger and partner program schedule on your dates, and a trip planner that syncs your days into Google or Apple Calendar and keeps them current when the plan changes. Works at the trailhead when service doesn't. Not a PDF. Not another tourist checklist.
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
              This guide assumes you've done that reading. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, "I have three days. Show me how to do this well." Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full.
            </p>

            <h2>The regional guides</h2>

            <p>
              The guide is organized by where you are in the park, not how long you're staying. Pick the region you're heading to, read the stops in suggested order, and do the ones that fit your day.
            </p>

            <ul>
              <li><strong>Yosemite Valley & surrounding areas.</strong> The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall on El Capitan, the Mist Trail to Vernal and Nevada Falls, and the valley lodgings.</li>
              <li><strong>Glacier Point & the Mariposa Grove.</strong> The southern rim and the giant sequoias. Higher elevation, more driving, and the panoramas that put the whole valley below you. Closed in winter.</li>
              <li><strong>Tuolumne Meadows & the Highway 120 corridor.</strong> The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October.</li>
              <li><strong>Hetch Hetchy & the Evergreen Road corridor.</strong> The other granite valley, half of it under a reservoir, with its own entrance and day-use gate hours. Open year-round and nearly empty.</li>
            </ul>

            <h2>What every stop gives you</h2>

            <ul>
              <li><strong>A tappable GPS coordinate.</strong> Tap it and your Maps app opens with the line drawn for you. No copying, no typing.</li>
              <li><strong>A time budget.</strong> How long the stop actually takes, drive included. The kind of timing that prevents the late-afternoon scramble.</li>
              <li><strong>A swap.</strong> What to do when the lot is full, the road is closed, or the crowd beat you there. Each major stop lists its alternate.</li>
              <li><strong>The read.</strong> When to go, which direction to come from, and what most people get wrong. Written the way the articles on this site are written.</li>
            </ul>

            <h2>The offline map</h2>

            <p>
              Every stop is pinned on a topographic map of the park that downloads to your device. The map is about 20 MB of the roughly 50 MB full offline download. Lose service past the tunnel, on Glacier Point Road, or anywhere along Tioga, and the map still pans, still zooms, and still shows you where the next stop is. Turn-by-turn driving stays in your Maps app; the guide hands you off with one tap.
            </p>

            <h2>The programs, on your dates</h2>

            <p>
              The park runs more than most visitors ever find out about: ranger walks, Junior Ranger tables, Conservancy naturalist programs and evening talks at Parsons Memorial Lodge, guided tours, and the summer nights when the astronomy clubs haul telescopes up to Glacier Point. The schedules live in a half-dozen places. The app pulls them into one list. Pick your trip dates, sync once while you have signal, and scroll your days: what's running, when, where, what's free, what needs a reservation. The list stays on your phone, so it still reads at a picnic table with no bars.
            </p>

            <h2>The trip planner, on your calendar</h2>

            <p>
              Add the stops you want and the programs you picked, and the app lays out each day: your stops in a sensible order with real time budgets, flowed around the programs' published times, with travel and parking buffers figured from the distance between them. Adjust anything, and the plan stays yours on the phone.
            </p>

            <p>
              When the plan is set, the app puts it on your calendar three ways. Pick whichever fits how you work.
            </p>

            <ul>
              <li><strong>Connect Google Calendar once.</strong> Authorize it from the account page and your trip lands in your Google Calendar as real events. Change the plan later and it re-syncs on its own. The connection lives on the server, so the app never sees or stores your Google password.</li>
              <li><strong>Subscribe from any calendar app.</strong> Publish the plan to a private link and add it to Apple Calendar, Outlook, or Google as a subscribed calendar named Yosemite trip. It sits beside your own calendar and follows every edit you make, on the calendar app's next refresh.</li>
              <li><strong>Or just save the file.</strong> One tap writes a standard .ics that imports the whole trip at once. It needs no signal, for when you want the plan locked onto your phone before you leave the last of the reception behind.</li>
            </ul>

            <p>
              Every event carries the stop's GPS coordinate and a directions link, and the timed ones carry a reminder, so the calendar alert at the trailhead is also the navigation.
            </p>

            <h2>Know before you go</h2>

            <p>
              The app ships with an essentials section: how entrance reservations work, how to get around the Valley without moving your car, what the bears actually want, where cell coverage dies, what the roads do by season, and a packing checklist you check off in the app the night before. A night-before checklist walks you through the downloads that make the whole trip work offline, including the Google Maps offline area that keeps turn-by-turn directions alive past the entrance station.
            </p>

            <h2>The Secret Guide</h2>

            <p>
              There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, browsable by category, every stop marked in gold on the offline map. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge.
            </p>

            <h2>What's NOT inside</h2>

            <p>I think you should know what you're not getting before you pay.</p>

            <ul>
              <li>This is not the standard tourist guide. If you want a list of the ten most famous viewpoints with the basic directions to each, every other Yosemite site already gives you that for free. This guide is what comes after that.</li>
              <li>It is not a children's activity book or a photography manual. Both could be their own books.</li>
              <li>It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both.</li>
              <li>It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.</li>
            </ul>

            <h2>Who it's for</h2>

            <p>
              First-time visitors who want a real plan, not a list. Second-time visitors who came home from their first trip feeling like they'd missed the actual park and want to fix it. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it.
            </p>

            <p>
              If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it, you might not need the guide. The guide is for people who want the spreadsheet already built.
            </p>

            <h2>Format and delivery</h2>

            <ul>
              <li><strong>A web app you add to your home screen.</strong> Looks and feels like a native app. It is not a PDF and not a printed book. No App Store, no install wait, no version to keep updated.</li>
              <li><strong>Works offline.</strong> One tap downloads the whole guide, every photo, and the park map to your device, about 50 MB. Lose service in the Valley or up at Tuolumne, the guide is still there.</li>
              <li><strong>Updates push silently through the 2026 season.</strong> New advice, route swaps, seasonal addenda, and Secret Guide additions all arrive without you re-downloading anything.</li>
              <li><strong>Pay once, sign in on every device you own.</strong> iPad in the car, iPhone at the trailhead, laptop the night before. Access lasts 18 months.</li>
            </ul>

            <h2>One small promise</h2>

            <p>
              If the guide doesn't earn its place on your home screen, write to me and tell me why. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page.
            </p>

            <p>That's the offer. Nineteen dollars.</p>
          </div>

          {/* Right column. Sticky buy box while on sale, waitlist before. */}
          {GUIDE_ON_SALE ? <GuideBuyBox /> : <GuideWaitlistBox />}
        </div>
      </div>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingBottom: 96 }}>
        <NewsletterInline
          location="guide_footer"
          tag="guide"
          heading="Sunday Field Notes"
          blurb="A short note on Sundays. Subscribers hear about Field Guide updates, Secret Guide additions, and seasonal addenda first."
        />
      </div>
    </div>
  );
}

window.GuidePage = GuidePage;
