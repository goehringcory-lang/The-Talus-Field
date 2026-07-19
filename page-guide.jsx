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

function GuideBuyBox() {
  const [busy, setBusy] = React.useState(false);
  const [soldOut, setSoldOut] = React.useState(null); // { reopens } or null
  const [error, setError] = React.useState(null);
  const [outcome] = React.useState(readCheckoutOutcome);
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
              : `${giftMode ? "Gift the guide" : "Buy the guide"} → ${formatPrice(priceCents)}`}
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
        One payment, about a dollar a month over the 18 months. The app, every photo, and the offline park map are yours on every device you own. Updates push automatically through the 2026 season, including the Secret Guide as it grows.
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
        Read a free sample first →
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

// Unedited screens captured from the 2026 build. Dimensions are fixed so the
// strip reserves its layout before the images arrive.
const APP_SHOTS = [
  {
    src: "img/guide/app-home.webp",
    alt: "The Field Guide app's front page: the whole guide indexed on one screen, with how-it-works steps and the seasonal almanac",
    caption: "The front page. The whole guide indexed on one screen, with the season's closures and full moons already listed.",
  },
  {
    src: "img/guide/app-stop.webp",
    alt: "A stop page in the app for Tunnel View, showing a tappable GPS coordinate, elevation, and a time budget",
    caption: "Every stop opens with the numbers that run your day: a tappable GPS coordinate, the elevation, the honest time budget.",
  },
  {
    src: "img/guide/app-stop-swap.webp",
    alt: "The same stop page scrolled to the 'If full' swap, telling you exactly where to go when the parking lot is full",
    caption: "The swap, printed on the stop itself. The lot fills at ten, you already know the move.",
  },
  {
    src: "img/guide/app-trip.webp",
    alt: "The trip planner in the app, showing a day's agenda with start times and drive-time buffers between stops",
    caption: "The planner lays out each day and inserts real drive-time buffers between stops. One tap puts it on your calendar.",
  },
  {
    src: "img/guide/app-secret-guide.webp",
    alt: "The Secret Guide section in the app: 37 entries of quiet vistas, hidden trails, and parking moves",
    caption: "The Secret Guide. 37 entries of quiet vistas, hidden trails, parking moves, and the park after dark.",
  },
  {
    src: "img/guide/app-hikes.webp",
    alt: "The day-hike catalog in the app, listing every in-park day hike with distance, gain, and difficulty",
    caption: "All 57 in-park day hikes with distance, gain, and difficulty. Add one and the planner budgets the hours for it.",
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

// The end-of-page buy button: same checkout POST as the aside, no gift path.
// A reader who made it through the whole pitch shouldn't have to scroll back
// up to act on it.
function BuyNowButton({ location }) {
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState(null);

  async function buy() {
    setBusy(true);
    setNote(null);
    if (window.track) window.track("guide_buy_click", { location });
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
        {busy ? "Opening checkout…" : "Buy the guide →"}
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
        {busy ? "Opening…" : "Buy the guide →"}
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
          <h1>The Yosemite guide for people who already know about Glacier Point.</h1>
          <p className="page-head__dek">
            A web app you add to your home screen. Four regional guides with tappable GPS, time budgets, a swap for when the plan dies, an offline topo map of the whole park, the ranger and partner program schedule on your dates, and a trip planner that syncs your days into Google or Apple Calendar and keeps them current when the plan changes. Works at the trailhead when service doesn't. Not a PDF. Not another tourist checklist.
          </p>
          <div className="guide-stats">
            <span>4 regions</span>
            <span>44 stops</span>
            <span>57 day hikes</span>
            <span>37 secret entries</span>
            <span>Works offline</span>
          </div>
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

            <h2>What a wrong morning costs</h2>

            <p>
              Yosemite charges its real fees in hours. The Glacier Point lot fills by mid-morning in July; arrive at ten and the hour of driving becomes three of circling. Miss the early window at the Mist Trail and the day reorganizes itself around a shuttle line. The $35 your car pays at the entrance covers seven days no matter what you do with them. What those days contain is decided by timing, and timing is exactly what a list of famous viewpoints doesn't give you.
            </p>

            <p>
              That's the problem this guide is built against. Time budgets tell you what actually fits before lunch. Swaps tell you where to go the second a lot is full. And because all of it lives on your phone and works without signal, the answer is there at the moment the day wobbles, which is never a moment with bars.
            </p>

            <h2>Inside the app</h2>

            <p>
              These are unedited screens from the 2026 edition, the same build buyers open. What you see here is the product, not a mockup.
            </p>

            <AppShots />

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
              If the guide doesn't earn its place on your home screen, write to me and tell me why, and I'll make it right. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page.
            </p>

            <div className="guide-closer">
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The offer, in one place</div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, margin: "0 0 20px" }}>
                Four regional guides. 44 stops in driving order, each with GPS, a time budget, and a swap. All 57 in-park day hikes. The 37-entry Secret Guide. The park's program schedule on your dates. A trip planner that syncs to your calendar and an offline map that holds it all together. Nineteen dollars, once, for 18 months on every device you own.
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
