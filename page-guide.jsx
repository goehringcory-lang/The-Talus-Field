/* global React, NewsletterInline */

// Public URL of the PWA. Override at runtime via window.GUIDE_APP_BASE.
const GUIDE_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://guide.thetalusfieldjournal.com";

// Worker API base. Override at runtime via window.GUIDE_API_BASE.
const GUIDE_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

// Shown until /api/inventory answers with the live price; keep in sync with
// GUIDE_PRICE_CENTS in workers/wrangler.toml.
const GUIDE_PRICE_FALLBACK_CENTS = 399;

// GUIDE-LAUNCH: on sale July 2026, briefly flipped to a waitlist pause, now
// back on sale. True renders the Stripe buy box (GuideBuyBox); false renders
// the waitlist aside (GuideWaitlistBox), whose button emails the operator that
// a reader wants in, kept in the file for any future sales pause. The
// robots/sitemap/footer flips landed earlier with the public-waitlist pass.
// Merging a true flag to main puts the guide on sale: the ops gate in
// LAUNCH-READINESS.md must be cleared first.
const GUIDE_ON_SALE = true;

function formatPrice(cents) {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

// One /api/inventory fetch per page view, shared by the buy box and the
// mobile buy bar. Resolves null on any failure; callers keep their fallbacks.
let inventoryPromise = null;
function fetchInventory() {
  if (!inventoryPromise) {
    inventoryPromise = fetch(`${GUIDE_API_BASE}/api/inventory`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return inventoryPromise;
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

// The buy funnel's missing half. guide_buy_click fires per placement, but the
// Stripe redirect returns to ?guide=success with no memory of which placement
// sold it — so conversion per placement was uncomputable. The clicked
// placement is stashed at click time and read back exactly once by the
// success handler below, so guide_purchase carries the same `location`
// values as guide_buy_click (inventory in ARCHITECTURE.md).
const BUY_STASH_KEY = "tfg.guide.buyLocation";
function stashBuyLocation(location, gift) {
  window.safeStorage.setJSON(BUY_STASH_KEY, { location, gift: !!gift });
}

function formatReopens(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "the first of next month";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  } catch (_e) {
    return "the first of next month";
  }
}

// "2026-07" (the API's monthLabel) -> "July". Derived at runtime, never
// hard-coded, same rule as the masthead issue label.
function monthNameFromLabel(label) {
  try {
    const [y, m] = String(label).split("-").map(Number);
    if (!y || !m) return null;
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  } catch (_e) {
    return null;
  }
}

// The live price as inline text, wherever prose needs it. Renders the
// fallback until /api/inventory answers (one shared fetch per page view).
function LivePrice() {
  const [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  React.useEffect(() => {
    let cancelled = false;
    fetchInventory().then((body) => {
      if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return <React.Fragment>{formatPrice(priceCents)}</React.Fragment>;
}

function GuideBuyBox() {
  const [busy, setBusy] = React.useState(false);
  const [soldOut, setSoldOut] = React.useState(null); // { reopens } or null
  const [error, setError] = React.useState(null);
  const [outcome] = React.useState(readCheckoutOutcome);

  // Report the completed purchase to GA4 exactly once. The stash is written
  // at buy-click time and removed on read, so a refresh (or a bookmark) of
  // the success URL finds nothing and counts nothing. A cancel clears it too:
  // that click did not convert, and a later purchase re-stashes at its own
  // click.
  React.useEffect(() => {
    if (outcome === "cancel") {
      window.safeStorage.remove(BUY_STASH_KEY);
      return;
    }
    if (outcome !== "success" && outcome !== "gift-success") return;
    const stash = window.safeStorage.getJSON(BUY_STASH_KEY);
    if (!stash) return;
    window.safeStorage.remove(BUY_STASH_KEY);
    window.track("guide_purchase", {
      location: stash.location || "unknown",
      gift: outcome === "gift-success" || !!stash.gift,
    });
  }, [outcome]);
  const [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  const [batch, setBatch] = React.useState(null); // { left, cap, month } or null
  const [giftMode, setGiftMode] = React.useState(false);
  const [giftEmail, setGiftEmail] = React.useState("");
  const [giftNote, setGiftNote] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetchInventory()
      .then((body) => {
        if (cancelled || !body) return;
        if (Number.isFinite(body.priceCents) && body.priceCents > 0) {
          setPriceCents(body.priceCents);
        }
        // The monthly cap is enforced server-side (checkout 409s at the cap),
        // so the counter is real inventory, not decoration. Only render it
        // when the numbers hold together.
        if (
          Number.isFinite(body.cap) &&
          body.cap > 0 &&
          Number.isFinite(body.sold) &&
          body.sold >= 0 &&
          body.cap - body.sold > 0
        ) {
          setBatch({
            left: body.cap - body.sold,
            cap: body.cap,
            month: monthNameFromLabel(body.monthLabel),
          });
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
    stashBuyLocation("guide_aside", giftMode);
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
    <aside id="guide-buy" style={{ position: "sticky", top: 100, alignSelf: "start", border: "1px solid var(--ink)", padding: 32, background: "var(--paper-2)" }}>
      <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The Field Guide</div>
      <div style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1.05, fontWeight: 500, marginBottom: 8 }}>{formatPrice(priceCents)}.</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600, marginBottom: batch ? 10 : 24 }}>
        Offline app · 2026 Edition
      </div>
      {batch && (
        <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: "var(--moss)", fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>
          Sold in monthly batches. {batch.left} of {batch.cap}{batch.month ? ` ${batch.month}` : ""} copies left.
        </div>
      )}

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
            style={{ display: "block", width: "100%", textAlign: "center", border: 0, font: "inherit", cursor: busy ? "wait" : "pointer", marginBottom: 10 }}
          >
            {busy
              ? "Opening checkout…"
              : `${giftMode ? "Gift the offline guide" : "Get the offline guide"} → ${formatPrice(priceCents)}`}
          </button>
          <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "0 0 14px" }}>
            Checkout by Stripe. Your access code arrives by email in about a minute.
          </p>
        </React.Fragment>
      )}

      {error && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--moss)", lineHeight: 1.55, margin: "0 0 14px" }}>
          {error}
        </p>
      )}

      <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>
        One payment of {formatPrice(priceCents)} for 18 months of access. The app, every photo, and the offline park map are yours on every device you own. Updates push automatically through the 2026 season, including the Secret Guide as it grows.
      </p>

      <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: "12px 0 0" }}>
        If it doesn't earn its place on your home screen, email me and I'll make it right.
      </p>

      <a
        href={`${GUIDE_APP_BASE}/preview`}
        onClick={() => {
          if (window.track) window.track("guide_sample_click", { location: "guide_aside" });
        }}
        style={{ display: "block", textAlign: "center", border: "1px solid var(--ink)", padding: "10px 14px", marginTop: 16, fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--ink)", textDecoration: "none", background: "var(--paper)" }}
      >
        Open the free sample first →
      </a>

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
          <li>· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed</li>
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
        The guide is in final testing. It will be $3.99, one payment, 18 months of access on every device you own. Leave your email and you will hear the day it opens, before anyone else.
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
          <li>· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed</li>
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

// Unedited screens captured from the 2026 build (August 2026 refresh: the
// Surveyor pass rebuilt the app's surfaces around mono readouts, hairline
// panels and instrument-framed photography, so every shot here was retaken
// against it). Dimensions are fixed so the strip reserves its layout before
// the images arrive.
//
// Filenames are new rather than overwritten on purpose: /img/* ships with a
// month-long immutable cache in _headers, so a replaced screenshot under an
// old name would keep serving the old picture to returning readers. Hence the
// .v2 suffix; the next refresh takes .v3 rather than reusing these.
const APP_SHOTS = [
  {
    src: "img/guide/screens/front-page.v2.webp",
    alt: "The Field Guide app's front page: a panel of live park readings, the valley forecast, sunset, road status and entrance waits, above the trip board and the four regional guides",
    caption: "The front page opens on the park as it is right now: the valley's high and low, when the light goes, which roads are open, what the gate is running. Then your trip, then the four regions.",
  },
  {
    src: "img/guide/screens/region-cards.v2.webp",
    alt: "A region in card view: one stop per screen with photo, kind, time budget and teaser, swiped like a feed",
    caption: "A region reads as a deck: one stop per screen, swipe up for the next. The long list is still a tap away.",
  },
  {
    src: "img/guide/screens/stop.v2.webp",
    alt: "A stop page for Tunnel View: the photo framed as an instrument view with the coordinate and elevation printed on it, then a readout of GPS, elevation, time budget and best light",
    caption: "Every stop opens on the numbers that run your day: a tappable coordinate, the elevation, the honest time budget, and the hour the light works.",
  },
  {
    src: "img/guide/screens/swap.v2.webp",
    alt: "The 'If full' swap on a stop page, saying where to go instead when the lot is full, above a sourced note from the November 1933 Yosemite Nature Notes",
    caption: "The swap, printed on the stop itself. The lot fills at ten, you already know the move. Under it, where the record allows, a sourced note from a century of park naturalists.",
  },
  {
    src: "img/guide/screens/hikes.v2.webp",
    alt: "The day-hike catalog in the app, each trail listed with distance, gain, difficulty, duration, its elevation profile, and a button that adds it to the trip",
    caption: "All 57 in-park day hikes with distance, climbing, and the shape of the trail. Add one and the planner budgets the hours.",
  },
  {
    src: "img/guide/screens/programs.v2.webp",
    alt: "The program list in the app, grouped by day: a ranger bird walk, a concessioner bus tour, a Conservancy art class, each with its time, meeting place and operator",
    caption: "The park's programs on your dates, day by day, from the Park Service, the Conservancy, the concessioner, and the astronomy clubs.",
  },
  {
    src: "img/guide/screens/trip-board.v2.webp",
    alt: "The planning calendar in the app: a day drawn as a timeline with stops and a ranger walk as blocks sized by duration, the drive between each one figured in, and a line marking the current hour",
    caption: "The planning calendar, native to the app. Each day is a real timeline: blocks sized by how long a thing takes, drives figured between them, dragged where you want them.",
  },
  {
    src: "img/guide/screens/calendar.v2.webp",
    alt: "The trip review before export, listing every event of a day with its time and length, above the button that saves the whole trip as a calendar file",
    caption: "When the days are set, the board is reviewed event by event, then saved as one calendar file your phone imports: coordinates, directions links and reminders included. No signal needed.",
  },
  {
    src: "img/guide/screens/today.v2.webp",
    alt: "The field-day view in the app: the day's forecast, sun times, entrance waits, road status, air quality and river flow, then what is next and the day in time order",
    caption: "In the park, the plan collapses to one screen: light, gate waits, roads and river up top, what's next, then the day in order.",
  },
  {
    src: "img/guide/screens/secret-guide.v2.webp",
    alt: "The Secret Guide in the app: 37 entries filed under quiet vistas and hidden trails, opening on a card with its photo, coordinate and time budget",
    caption: "The Secret Guide. 37 entries of quiet vistas, hidden trails, parking moves, and the park after dark.",
  },
];

function AppShots() {
  return (
    <div className="app-shots" role="list">
      {APP_SHOTS.map((shot) => (
        <figure className="app-shot" role="listitem" key={shot.src}>
          <div className="app-shot__frame">
            <img src={shot.src} alt={shot.alt} width="640" height="1385" loading="lazy" decoding="async" />
          </div>
          <figcaption className="app-shot__caption">{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

// The five-screen walkthrough: the app in the order a trip actually uses it.
// Same screenshot files as the strip below; every image stays in the DOM
// (real <img> + alt, so the sequence is crawlable), and the step list doubles
// as the navigation. Auto-advance is triple-gated: only while the stage is on
// screen (IntersectionObserver), never under prefers-reduced-motion, and any
// manual step stops the timer for good.
const WALKTHROUGH_STEPS = [
  {
    src: "img/guide/screens/front-page.v2.webp",
    alt: "The app's front page: live park readings above the four regions, each with its stop count",
    title: "Pick a direction",
    detail: "The park's readings first: forecast, sunset, roads, gate waits. Then the four regions.",
  },
  {
    src: "img/guide/screens/stop.v2.webp",
    alt: "A stop page with a tappable GPS coordinate, the elevation, a 25-minute time budget and the best light",
    title: "Read the numbers",
    detail: "A tappable coordinate, the elevation, the honest time budget, the hour the light works.",
  },
  {
    src: "img/guide/screens/swap.v2.webp",
    alt: "The stop's 'If full' swap: exactly where to go when the lot is full",
    title: "Know the move when the lot is full",
    detail: "The swap is printed on the stop itself, not somewhere in your notes.",
  },
  {
    src: "img/guide/screens/trip-board.v2.webp",
    alt: "A trip day drawn as a timeline: blocks sized by duration with drive buffers between",
    title: "Build the day in driving order",
    detail: "Blocks sized by how long things take, drives figured between them.",
  },
  {
    src: "img/guide/screens/today.v2.webp",
    alt: "The field-day screen: forecast, sun times, gate waits, road status, and the day in time order",
    title: "Work the day from one screen",
    detail: "Light, entrance waits, roads, what's next. The plan with the planning taken out.",
  },
];

const WALKTHROUGH_INTERVAL_MS = 4000;

function GuideWalkthrough() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const rootRef = React.useRef(null);
  const inViewRef = React.useRef(true);
  const reducedMotion = React.useMemo(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_e) {
      return false;
    }
  }, []);

  React.useEffect(() => {
    if (reducedMotion || paused) return undefined;
    let io = null;
    if (typeof IntersectionObserver !== "undefined" && rootRef.current) {
      inViewRef.current = false;
      io = new IntersectionObserver((entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting);
      });
      io.observe(rootRef.current);
    }
    const timer = setInterval(() => {
      if (inViewRef.current) {
        setActive((a) => (a + 1) % WALKTHROUGH_STEPS.length);
      }
    }, WALKTHROUGH_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      if (io) io.disconnect();
    };
  }, [reducedMotion, paused]);

  function goToStep(i) {
    setPaused(true);
    setActive(i);
  }

  return (
    <div className="guide-walkthrough" ref={rootRef}>
      <div className="guide-walkthrough__stage" aria-live="off">
        {WALKTHROUGH_STEPS.map((step, i) => (
          <img
            key={step.src}
            className={"guide-walkthrough__shot" + (i === active ? " is-active" : "")}
            src={step.src}
            alt={step.alt}
            width="640"
            height="1385"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <ol className="guide-walkthrough__steps">
        {WALKTHROUGH_STEPS.map((step, i) => (
          <li key={step.src}>
            <button
              type="button"
              className={"guide-walkthrough__step" + (i === active ? " is-active" : "")}
              aria-current={i === active ? "step" : undefined}
              onClick={() => goToStep(i)}
            >
              <span className="guide-walkthrough__step-num">{i + 1}</span>
              <span className="guide-walkthrough__step-body">
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The outcome blocks: what the guide changes about the day, each claim backed
// by a number that is true in the shipped content. Counts come from
// apps/guide/src/content (stops.ts, hikes.ts, itineraries.ts); re-verify
// there before editing a proof line.
const OUTCOMES = [
  {
    kicker: "Find the correct parking turnout",
    body:
      "Every stop carries a coordinate that opens your Maps app with the line already drawn, and the parking is written into the stop itself: which lot, which pullout, which side of the road, and what the tell is when the sign is missing. The unsigned turnouts locals use have their own entries.",
    proof: "A source-verified coordinate on 65 of the 66 stops",
  },
  {
    kicker: "Know how long each stop actually takes",
    body:
      "Each stop states its time budget, drive included, so you know what fits before lunch while it still matters. Hikes carry verified distance, climbing, and an effort score computed from real terrain data, not the trailhead sign's optimism.",
    proof: "Time budgets on 65 of 66 stops · 57 hikes with verified GPS tracks",
  },
  {
    kicker: "Replace a hike when weather, crowds, or children change the plan",
    body:
      "The flagship stops print their swap right on the page: where to go the moment the lot is full or the trail is not happening today. Ready-made day plans cover the half day, the first visit, young kids, grandparents, and the whole multi-generation caravan.",
    proof: "Swaps printed on the flagship stops · 9 ready-made day plans",
  },
  {
    kicker: "Navigate when service disappears",
    body:
      "One tap downloads the whole guide: every entry, every photo, all 57 hike tracks, and a topographic map of the park with every stop pinned. Service dies past the tunnel and on most of Tioga Road. The guide is built for exactly that.",
    proof: "About 50 MB all-in. The map is about 20 MB of it",
  },
  {
    kicker: "Build each day in driving order",
    body:
      "The planner draws each day as a real timeline: blocks sized by their time budgets, drives between stops computed from the actual distances and dropped in as buffers. Drag a block and the day re-flows. One tap saves the finished plan to your calendar, no signal needed.",
    proof: "Drive buffers figured from real distances, 10 to 75 minutes",
  },
];

function GuideOutcomes() {
  return (
    <div className="guide-outcomes">
      {OUTCOMES.map((o) => (
        <div className="guide-outcome" key={o.kicker}>
          <h3 className="guide-outcome__kicker">{o.kicker}</h3>
          <p className="guide-outcome__body">{o.body}</p>
          <div className="guide-outcome__proof">{o.proof}</div>
        </div>
      ))}
    </div>
  );
}

// One real stop, quoted verbatim from the app's content (the tunnel-view
// entry in apps/guide/src/content/stops.ts). If the app's entry changes,
// re-quote it here; nothing in this block is written for the ad.
function GuideStopExample() {
  return (
    <div className="guide-stop-ex">
      <div className="eyebrow eyebrow--moss">From the guide · Yosemite Valley · Stop 1 of 21</div>
      <h3 className="guide-stop-ex__title">Tunnel View, the moment the valley opens</h3>
      <div className="guide-stop-ex__meta">
        <a
          className="guide-stop-ex__chip guide-stop-ex__chip--coord"
          href="https://www.google.com/maps/dir/?api=1&destination=37.7156,-119.6773"
          target="_blank"
          rel="noopener"
        >
          37.7156, −119.6773 · directions
        </a>
        <span className="guide-stop-ex__chip">4,400 ft</span>
        <span className="guide-stop-ex__chip">25 minutes</span>
      </div>
      <p className="guide-stop-ex__body">
        You come out of the Wawona Tunnel and the whole valley is there at once. El Capitan on the left, Bridalveil Fall on the right, Half Dome anchoring the back wall. Most people raise a phone and lower it after thirty seconds. Don't. Stay fifteen minutes. Look at the U-shape of the valley floor — a glacier did that, two thousand feet of ice. The hanging valleys above the rim are why the waterfalls fall so far. You're not looking at scenery; you're looking at the geological event. Once you see it, you can't unsee it for the rest of the trip.
      </p>
      <div className="guide-stop-ex__swap">
        <div className="guide-stop-ex__swap-label">If the lot is full</div>
        <p>
          If the parking lot is full (it usually is between 10 a.m. and 4 p.m.), continue down to Valley View / Gates of the Valley. Lower angle, same valley, no crowd.
        </p>
      </div>
      <p className="guide-stop-ex__cite">
        From the archive, printed on the stop: the tunnel behind you was new in 1933, and the naturalists spent that first year logging what walked into it. <em>Yosemite Nature Notes</em>, Vol. 12 No. 11, November 1933.
      </p>
      <p className="guide-stop-ex__links">
        <a
          href={`${GUIDE_APP_BASE}/stop/tunnel-view`}
          onClick={() => {
            if (window.track) window.track("guide_sample_click", { location: "guide_stop_example" });
          }}
        >
          Open this stop in the real app →
        </a>{" "}
        It is one of five sample entries anyone can read in full, no account needed.
      </p>
    </div>
  );
}

// The seeded one-day Valley plan, exactly as the in-app planner slots it:
// stop order and time budgets from apps/guide/src/content (itineraries.ts
// VALLEY_DAY + stops.ts timeBudgetMin), drive buffers from the planner's own
// heuristic in apps/guide/src/trip/slotting.ts (haversine distance at 22 mph
// plus 10 min park-and-walk, clamped 10-75; flat 30 when a coordinate is
// missing). Recompute if the preset or the budgets change; do not eyeball.
const ITIN_DEMO = [
  { time: "8:00 a.m.", label: "Tunnel View", mins: 25 },
  { drive: 14 },
  { time: "8:39 a.m.", label: "Bridalveil Fall", mins: 30 },
  { drive: 30 },
  { time: "9:39 a.m.", label: "Valley loop drive, Tunnel View to Curry Village", mins: 60 },
  { drive: 30 },
  { time: "11:09 a.m.", label: "Cook's Meadow Loop", mins: 60 },
  { drive: 13 },
  { time: "12:22 p.m.", label: "Lunch at Curry Village", mins: 60 },
  { drive: 12 },
  { time: "1:34 p.m.", label: "The Ahwahnee, lobby visit", mins: 45 },
  { drive: 12 },
  { time: "2:31 p.m.", label: "Mirror Lake, before the crowd", mins: 90 },
  { drive: 22 },
  { time: "4:23 p.m.", label: "El Capitan Meadow, watching the wall", mins: 60 },
  { drive: 18 },
  { time: "5:41 p.m.", label: "Sentinel Bridge, the last hour", mins: 60 },
];

function GuideItineraryExample() {
  return (
    <div className="guide-itin-demo">
      <div className="eyebrow eyebrow--moss">From the planner · Day 1 · Yosemite Valley</div>
      <ol className="guide-itin-demo__list">
        {ITIN_DEMO.map((row, i) =>
          row.drive ? (
            <li className="guide-itin-demo__drive" key={`d${i}`}>
              drive · {row.drive} min
            </li>
          ) : (
            <li className="guide-itin-demo__block" key={row.label}>
              <span className="guide-itin-demo__time">{row.time}</span>
              <span className="guide-itin-demo__label">{row.label}</span>
              <span className="guide-itin-demo__dur">{row.mins} min</span>
            </li>
          )
        )}
      </ol>
      <p className="guide-itin-demo__note">
        This is the one-day Valley preset exactly as the planner lays it out: every duration is the stop's own time budget, every drive is computed from the real distance between the two coordinates. Drag any block and the day re-flows around it. The day ends on Sentinel Bridge because that is where the last light goes.
      </p>
    </div>
  );
}

// The offline demonstration: same screenshot, a two-state toggle, and an
// honest accounting of what needs signal. No animation, so nothing to gate
// on prefers-reduced-motion.
function GuideOfflineDemo() {
  const [off, setOff] = React.useState(true);

  return (
    <div className="guide-offline">
      <div className="guide-offline__demo">
        <div className="guide-offline__toggle" role="group" aria-label="Simulate cell service">
          <button
            type="button"
            className={off ? "" : "is-active"}
            aria-pressed={!off}
            onClick={() => setOff(false)}
          >
            With service
          </button>
          <button
            type="button"
            className={off ? "is-active" : ""}
            aria-pressed={off}
            onClick={() => setOff(true)}
          >
            No service
          </button>
        </div>
        <div className={"guide-offline__frame" + (off ? " is-off" : "")}>
          <div className="guide-offline__status" aria-hidden="true">No Service · Airplane mode</div>
          <img
            src="img/guide/screens/stop.v2.webp"
            alt="A stop page in the app, rendering identically with or without cell service"
            width="640"
            height="1385"
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="guide-offline__caption">
          {off
            ? "Airplane mode. The stop, its coordinate, its swap, the map, and your whole plan render exactly the same."
            : "With service you also get the live extras: webcams, entrance waits, fresh weather."}
        </p>
      </div>
      <div className="guide-offline__cols">
        <div>
          <div className="eyebrow">Works with zero bars</div>
          <ul>
            <li>· All 81 entries, photos included</li>
            <li>· All 57 hikes with tracks and elevation profiles</li>
            <li>· The topographic park map, every stop pinned</li>
            <li>· The trip board, the day view, and calendar export</li>
            <li>· Checklists, essentials, search, the Secret Guide</li>
          </ul>
        </div>
        <div>
          <div className="eyebrow">Needs signal</div>
          <ul>
            <li>· The live park webcams</li>
            <li>· Entrance waits right now</li>
            <li>· Fresh weather and program updates (the last sync stays readable)</li>
            <li>· The Nature Notes archive links back to this site</li>
          </ul>
        </div>
      </div>
      <p className="guide-offline__fineprint">
        The full download is about 50 MB: the park map is roughly 20 MB of it, about 700 topographic tiles covering the whole park and the road corridors.
      </p>
    </div>
  );
}

// Free tools vs. the guide. Every left-hand cell is a real page on this site
// and stays free; the table says so out loud. Rendered as a real <table> so
// crawlers and screen readers get the same comparison readers do.
function GuideCompare({ go }) {
  const freeLink = (href, key, label) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        go(key);
      }}
    >
      {label}
    </a>
  );
  return (
    <div className="guide-compare-wrap">
      <table className="guide-compare">
        <caption>The free site stays free. The guide is the field version.</caption>
        <thead>
          <tr>
            <th scope="col">Free on this site</th>
            <th scope="col">In the Field Guide</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{freeLink("/articles", "articles", "Articles")} and {freeLink("/planning", "planning", "planning guides")}</td>
            <td>The complete stop library: 81 entries across four regions</td>
          </tr>
          <tr>
            <td>{freeLink("/now", "now", "Current conditions")}</td>
            <td>The whole guide offline, about 50 MB, no bars needed</td>
          </tr>
          <tr>
            <td>{freeLink("/itineraries", "itineraries", "Selected itineraries")}</td>
            <td>All 57 day hikes and the 37-entry Secret Guide</td>
          </tr>
          <tr>
            <td>The {freeLink("/map", "map", "basic trip map")}</td>
            <td>The full trip builder: drag-and-drop days, drive buffers, calendar export</td>
          </tr>
          <tr>
            <td>The {freeLink("/newsletter", "newsletter", "Sunday newsletter")}</td>
            <td>18 months of silent updates as the season changes</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Trust block. The bio facts mirror /about; keep them in sync with
// page-about.jsx if the bio changes.
function GuideTrust() {
  return (
    <div className="guide-trust">
      <p className="guide-trust__intro">
        The guide is written by Cory Goehring, a naturalist who lives in Yosemite National Park and has worked in and around it for twenty seasons, mostly on foot. Every stop was visited, timed, and written up the way the articles on this site are written: from the ground, not from a search-result roundup.
      </p>
      <div className="guide-trust__grid">
        <div>
          <strong>Works without cellular service.</strong> Built offline-first, because the park mostly is.
        </div>
        <div>
          <strong>Every personal device.</strong> One purchase signs in your phone, tablet, and laptop.
        </div>
        <div>
          <strong>No subscription.</strong> One payment, 18 months, nothing auto-renews.
        </div>
        <div>
          <strong>No affiliate placements inside.</strong> The recommendations are picked, not paid for.
        </div>
        <div>
          <strong>Updates included.</strong> Seasonal addenda and Secret Guide additions push silently.
        </div>
        <div>
          <strong>30-day guarantee.</strong> If it does not work as described, it is refunded in full.
        </div>
      </div>
    </div>
  );
}

// What happens after purchase, as the flow actually runs (Stripe checkout ->
// Worker webhook -> access email with a reusable magic link + 6-digit code).
// The refund promise quotes /terms section 1; keep the two in sync.
function GuideAfterPurchase({ go }) {
  return (
    <div className="guide-after">
      <ol className="guide-steps">
        <li>
          <strong>Checkout runs through Stripe.</strong> Card or wallet. This site never sees or stores your card number.
        </li>
        <li>
          <strong>Within about a minute, an email arrives: "Your Field Guide is ready."</strong> It carries a sign-in link and a 6-digit code. Both keep working for the full 18 months, so keep the email.
        </li>
        <li>
          <strong>Open the link, or enter the code, on each device you want signed in.</strong> Phone at the trailhead, tablet in the car, laptop the night before.
        </li>
        <li>
          <strong>Add it to your home screen and tap the offline download.</strong> About 50 MB later the whole guide, map included, lives on the device.
        </li>
      </ol>
      <p className="guide-after__policy">
        If the guide does not work as described, email <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a> within 30 days and it is refunded in full, per the{" "}
        <a
          href="/terms"
          onClick={(e) => {
            e.preventDefault();
            go("terms");
          }}
        >
          terms
        </a>
        . The same address is the fix for a lost email or a sign-in that will not take. There is no ticket system and no bot: it is the author's inbox.
      </p>
    </div>
  );
}

// The FAQ. Answers mirror known["/guide"].faq in edge/seo.js and the
// known.guide entry in app.jsx's buildSeo: all three carry the same pairs,
// kept in sync by hand (the /partners pattern). Answers are plain text so
// the on-page copy and the FAQPage JSON-LD can never drift in substance.
const GUIDE_FAQ = [
  {
    q: "Does it really work with no cell service?",
    a: "Yes. One tap downloads the whole guide, about 50 MB: every entry, every photo, all 57 hike tracks, and a topographic map of the park. Only the live extras need signal: webcams, entrance waits, and fresh weather and program updates.",
  },
  {
    q: "Is it an App Store app?",
    a: "No. It is a web app you add to your home screen in one step, on iPhone or Android. No store account, no install wait, no version to manage. Once it is there it looks and behaves like a native app.",
  },
  {
    q: "What happens right after I pay?",
    a: "Stripe handles checkout. Within about a minute you get an email with a sign-in link and a 6-digit code. Both keep working for the full 18 months, so you can sign in on a new device whenever you like.",
  },
  {
    q: "How many devices can I use it on?",
    a: "Every device you personally own. Phone at the trailhead, tablet in the car, laptop the night before. The same code signs them all in.",
  },
  {
    q: "Is it a subscription?",
    a: "No. You pay $3.99 once and access runs 18 months. Nothing auto-renews. Near the end you are offered a discounted renewal, and if you do nothing, access simply ends.",
  },
  {
    q: "What if I lose the email or can't sign in?",
    a: "Email cory@thetalusfieldjournal.com and it gets sorted. The sign-in link and the code stay reusable for the whole 18 months, so finding the original email is usually the fix.",
  },
  {
    q: "What is the refund policy?",
    a: "If the guide does not work as described, email within 30 days of purchase and it is refunded in full. After a refund the access code is deactivated. The full policy is on the terms page.",
  },
  {
    q: "What do I get that the free site doesn't already give me?",
    a: "The complete library: 81 entries including the 37-entry Secret Guide, all 57 day hikes with verified GPS tracks, the drag-and-drop trip builder, and the offline download. The free site keeps the articles, the trip map, the itineraries, and the conditions board.",
  },
  {
    q: "Does the guide change after I buy it?",
    a: "Yes. Updates, seasonal addenda, and Secret Guide additions push silently through your access window. Nothing to re-download, nothing extra to pay.",
  },
];

function GuideFaq() {
  return (
    <div className="guide-faq">
      {GUIDE_FAQ.map((item) => (
        <div className="guide-faq__item" key={item.q}>
          <h3 className="guide-faq__q">{item.q}</h3>
          <p className="guide-faq__a">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

// The end-of-section buy button: same checkout POST as the aside, no gift
// path. A reader who made it through the pitch shouldn't have to scroll back
// up to act on it. The label states the outcome, not the transaction.
function BuyNowButton({ location, label }) {
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState(null);

  async function buy() {
    setBusy(true);
    setNote(null);
    if (window.track) window.track("guide_buy_click", { location });
    stashBuyLocation(location, false);
    try {
      const res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (res.status === 409 && body.soldOut) {
        setNote(`This month's copies are gone. Sales reopen ${formatReopens(body.reopens)}.`);
        return;
      }
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      setNote(
        "Checkout didn't start. Try again in a minute, or email cory@thetalusfieldjournal.com."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn"
        disabled={busy}
        onClick={buy}
        style={{ border: 0, font: "inherit", cursor: busy ? "wait" : "pointer" }}
      >
        {busy ? "Opening checkout…" : label || "Get the offline Yosemite guide →"}
      </button>
      {note && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--moss)", lineHeight: 1.55, margin: "12px 0 0" }}>
          {note}
        </p>
      )}
    </React.Fragment>
  );
}

// Mobile-only sticky buy bar. On phones the single-column stack pushes the
// buy box below the whole pitch, so the first visible price and CTA used to
// sit fifteen screens down. This keeps checkout one tap away the whole way:
// hidden on desktop by CSS (the sticky aside covers that case), slides in
// once the reader is past the hero, and steps aside whenever the real buy
// box or the closer is on screen so it never doubles a visible CTA.
function GuideMobileBuyBar() {
  const [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  const [busy, setBusy] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetchInventory().then((body) => {
      if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    // The footer counts too: it sits outside .page, so the padding-bottom
    // reserve doesn't cover it, and anyone that deep has scrolled past both
    // the buy box and the closer already.
    const targets = [
      document.getElementById("guide-buy"),
      document.querySelector(".guide-closer"),
      document.querySelector(".site-footer"),
    ].filter(Boolean);
    let scrolledPast = window.scrollY > 480;
    const inView = new Set();
    const update = () => setVisible(scrolledPast && inView.size === 0);
    const onScroll = () => {
      scrolledPast = window.scrollY > 480;
      update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    let io = null;
    if (typeof IntersectionObserver !== "undefined" && targets.length) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) inView.add(e.target);
          else inView.delete(e.target);
        });
        update();
      });
      targets.forEach((t) => io.observe(t));
    }
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (io) io.disconnect();
    };
  }, []);

  async function buy() {
    setBusy(true);
    if (window.track) window.track("guide_buy_click", { location: "guide_mobile_bar" });
    stashBuyLocation("guide_mobile_bar", false);
    try {
      const res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      // Sold out or a network hiccup: hand off to the full buy box, which
      // explains itself in place.
      const aside = document.getElementById("guide-buy");
      if (aside) aside.scrollIntoView({ behavior: "smooth" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={"guide-buybar" + (visible ? " is-visible" : "")} aria-hidden={visible ? undefined : "true"}>
      <div className="guide-buybar__meta">
        <span className="guide-buybar__price">{formatPrice(priceCents)}</span>
        <span className="guide-buybar__sub">Offline app · 18 months</span>
      </div>
      <button type="button" className="guide-buybar__cta" disabled={busy} onClick={buy}>
        {busy ? "Opening…" : "Get the guide →"}
      </button>
    </div>
  );
}

function GuidePage({ go }) {
  return (
    <div className="page page--guide">
      {/* Hero */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Field Guide · Offline app · 2026 Edition</div>
          <h1>Three days in Yosemite. This is how you keep all three.</h1>
          <p className="page-head__dek">
            Written by a naturalist who lives in the park: which stops are worth your morning, where to park, how long each one honestly takes, and where to go the moment the lot fills. It builds each day in driving order, then downloads whole to your phone, topo map included, and keeps working where cell service doesn't, which is most of the park.
          </p>
          <div className="guide-stats">
            <span>4 regions</span>
            <span>81 entries</span>
            <span>57 day hikes</span>
            <span>37 secret entries</span>
            <span>Works offline</span>
          </div>
          <div className="guide-hero-cta">
            <BuyNowButton location="guide_hero" />
            <p className="guide-hero-cta__sub">
              <LivePrice />, once. No subscription, 18 months on every device you own, refunded in full within 30 days if it does not work as described.
            </p>
            <p className="guide-hero-cta__sub">
              Or{" "}
              <a
                href={`${GUIDE_APP_BASE}/preview`}
                onClick={() => {
                  if (window.track) window.track("guide_sample_click", { location: "guide_hero" });
                }}
              >
                read the free sample first →
              </a>{" "}
              Five complete entries from the real app, no account needed.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "start" }}>

          {/* Left column. Body */}
          <div className="prose">
            <h2>What a wrong morning costs</h2>

            <p>
              Yosemite charges its real fees in hours. The Glacier Point lot fills by mid-morning in July; arrive at ten and the hour of driving becomes three of circling. Miss the early window at the Mist Trail and the day reorganizes itself around a shuttle line. The $35 your car pays at the entrance covers seven days no matter what you do with them. What those days contain is decided by timing, and timing is exactly what a list of famous viewpoints doesn't give you.
            </p>

            <p>
              That's the problem this guide is built against. Time budgets tell you what actually fits before lunch. Swaps tell you where to go the second a lot is full. And because all of it lives on your phone and works without signal, the answer is there at the moment the day wobbles, which is never a moment with bars.
            </p>

            <p>
              The guide is <LivePrice />. Everything else about your trip costs more and decides less.
            </p>

            <h2>The picnic table in El Portal</h2>

            <p>
              This guide is the conversation you'd get if you sat across from me at a picnic table in El Portal and said, "I have three days. Show me how to do this well." Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full.
            </p>

            <p>
              The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, and look up at El Capitan from the Yosemite Valley floor. You don't need those repeated in a different font. This guide assumes you've done that reading and starts where the lists stop: the parking, the timing, the order, and the fallback.
            </p>

            <h2>Sixty seconds inside the app</h2>

            <p>
              Five screens, in the order a trip actually uses them. These are unedited captures from the current 2026 build, the same one buyers open. Tap a step to hold it.
            </p>

            <GuideWalkthrough />

            <h2>Every screen, unedited</h2>

            <p>
              The full set: ten screens from the current build, captured on a phone. What you see here is the product, not a mockup.
            </p>

            <AppShots />

            <h2>What it does for the day</h2>

            <GuideOutcomes />

            <h2>Read one stop, in full</h2>

            <p>
              This is the guide's first stop, quoted word for word from the app. Every one of the 81 entries is built this way: the numbers up top, the read underneath, the fallback printed on the page, and, where the record allows it, a sourced note from a century of park naturalists' field bulletins.
            </p>

            <GuideStopExample />

            <h2>A day, built in driving order</h2>

            <p>
              This is what the planner does with a day. Stops go in, and the day comes back as a timeline: each block sized by its real time budget, each gap computed from the actual driving distance between the two coordinates. No spreadsheet, no guessing whether four things fit before lunch.
            </p>

            <GuideItineraryExample />

            <h2>Turn the service off</h2>

            <p>
              Cell service dies at the Wawona Tunnel, on most of Glacier Point Road, and along nearly all of Tioga. The guide treats that as the normal case, not the failure case.
            </p>

            <GuideOfflineDemo />

            <h2>The free site, and the guide</h2>

            <p>
              Everything this site publishes stays free: the articles, the trip map, the itineraries, the conditions board. The guide is not those pages repackaged. It is the field version: the complete library, the planner, and the offline download that makes both of them work standing in a pullout with no bars.
            </p>

            <GuideCompare go={go} />

            <p style={{ marginTop: 24 }}>
              <BuyNowButton location="guide_compare" />
            </p>

            <h2>The Secret Guide</h2>

            <p>
              There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, browsable by category, every stop marked in gold on the offline map. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge.
            </p>

            <h2>Who wrote it, and how</h2>

            <GuideTrust />

            <h2>What happens when you tap the button</h2>

            <GuideAfterPurchase go={go} />

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

            <h2>Questions, answered</h2>

            <GuideFaq />

            <h2>One small promise</h2>

            <p>
              If the guide doesn't earn its place on your home screen, write to me and tell me why, and I'll make it right. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page.
            </p>

            <div className="guide-closer">
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The offer, in one place</div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: "0 0 20px" }}>
                Four regional guides. 44 stops in driving order, each with GPS and a time budget, the flagship ones with a swap. All 57 in-park day hikes with verified tracks. The 37-entry Secret Guide. The park's program schedule on your dates. A planning calendar you drag into shape, then save to the calendar you already use. And an offline topo map that holds it all together. <LivePrice />, once, for 18 months on every device you own.
              </p>
              <BuyNowButton location="guide_closer" />
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, margin: "14px 0 0" }}>
                Checkout by Stripe. Your access code arrives by email in about a minute. Prefer to look first?{" "}
                <a
                  href={`${GUIDE_APP_BASE}/preview`}
                  onClick={() => {
                    if (window.track) window.track("guide_sample_click", { location: "guide_closer" });
                  }}
                  style={{ color: "var(--ink-2)" }}
                >
                  Read the free sample →
                </a>
              </p>
            </div>
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

      {GUIDE_ON_SALE && <GuideMobileBuyBar />}
    </div>
  );
}

window.GuidePage = GuidePage;
