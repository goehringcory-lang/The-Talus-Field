var GUIDE_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://talus-field-guide.pages.dev";
var GUIDE_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var GUIDE_PRICE_FALLBACK_CENTS = 399;
var GUIDE_ON_SALE = true;
function formatPrice(cents) {
  var dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
var inventoryPromise = null;
function fetchInventory() {
  if (!inventoryPromise) {
    inventoryPromise = fetch(`${GUIDE_API_BASE}/api/inventory`).then(res => res.ok ? res.json() : null).catch(() => null);
  }
  return inventoryPromise;
}
function readCheckoutOutcome() {
  try {
    var params = new URLSearchParams(window.location.search);
    var value = params.get("guide");
    return value === "success" || value === "gift-success" || value === "cancel" ? value : null;
  } catch (_e) {
    return null;
  }
}
var GIFT_NOTE_MAX = 280;
function formatReopens(iso) {
  try {
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "the first of next month";
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric"
    });
  } catch (_e) {
    return "the first of next month";
  }
}
function monthNameFromLabel(label) {
  try {
    var [y, m] = String(label).split("-").map(Number);
    if (!y || !m) return null;
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
      month: "long",
      timeZone: "UTC"
    });
  } catch (_e) {
    return null;
  }
}
function LivePrice() {
  var [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  React.useEffect(() => {
    var cancelled = false;
    fetchInventory().then(body => {
      if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return React.createElement(React.Fragment, null, formatPrice(priceCents));
}
function GuideBuyBox() {
  var [busy, setBusy] = React.useState(false);
  var [soldOut, setSoldOut] = React.useState(null);
  var [error, setError] = React.useState(null);
  var [outcome] = React.useState(readCheckoutOutcome);
  var [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  var [batch, setBatch] = React.useState(null);
  var [giftMode, setGiftMode] = React.useState(false);
  var [giftEmail, setGiftEmail] = React.useState("");
  var [giftNote, setGiftNote] = React.useState("");
  React.useEffect(() => {
    var cancelled = false;
    fetchInventory().then(body => {
      if (cancelled || !body) return;
      if (Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
      if (Number.isFinite(body.cap) && body.cap > 0 && Number.isFinite(body.sold) && body.sold >= 0 && body.cap - body.sold > 0) {
        setBatch({
          left: body.cap - body.sold,
          cap: body.cap,
          month: monthNameFromLabel(body.monthLabel)
        });
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  async function startCheckout() {
    var recipient = giftEmail.trim();
    if (giftMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setError("Enter the recipient's email address first.");
      return;
    }
    setBusy(true);
    setError(null);
    if (window.track) window.track("guide_buy_click", {
      location: "guide_aside",
      gift: giftMode
    });
    try {
      var res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: giftMode ? JSON.stringify({
          gift: true,
          recipientEmail: recipient,
          giftNote: giftNote.trim()
        }) : undefined
      });
      var body = await res.json().catch(() => ({}));
      if (res.status === 409 && body.soldOut) {
        setSoldOut({
          reopens: body.reopens
        });
        return;
      }
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      setError("Checkout didn't start. Try again in a minute, or email cory@thetalusfieldjournal.com.");
    } finally {
      setBusy(false);
    }
  }
  return React.createElement("aside", {
    id: "guide-buy",
    style: {
      position: "sticky",
      top: 100,
      alignSelf: "start",
      border: "1px solid var(--ink)",
      padding: 32,
      background: "var(--paper-2)"
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "The Field Guide"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 44,
      lineHeight: 1.05,
      fontWeight: 500,
      marginBottom: 8
    }
  }, formatPrice(priceCents), "."), React.createElement("div", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--ink-3)",
      fontWeight: 600,
      marginBottom: batch ? 10 : 24
    }
  }, "Offline app · 2026 Edition"), batch && React.createElement("div", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12.5,
      color: "var(--moss)",
      fontWeight: 600,
      lineHeight: 1.5,
      marginBottom: 24
    }
  }, "Sold in monthly batches. ", batch.left, " of ", batch.cap, batch.month ? ` ${batch.month}` : "", " copies left."), outcome === "success" && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 18px",
      border: "1px solid var(--ink)",
      padding: "12px 14px",
      background: "var(--paper)"
    }
  }, "Payment received. Your access code and sign-in link are on their way to your email. Check spam if nothing arrives in a few minutes. Once you have the code, ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/login`,
    style: {
      color: "var(--ink-2)"
    }
  }, "open the app and sign in →")), outcome === "gift-success" && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 18px",
      border: "1px solid var(--ink)",
      padding: "12px 14px",
      background: "var(--paper)"
    }
  }, "Payment received. Their access email is on its way to them, and your receipt is on its way to you. If you typed the wrong address, reply to the receipt and it gets moved."), outcome === "cancel" && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-2)",
      lineHeight: 1.55,
      margin: "0 0 18px"
    }
  }, "Checkout was cancelled. Nothing was charged."), soldOut ? React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 15,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 14px"
    }
  }, "This month's copies are gone. Sales reopen ", formatReopens(soldOut.reopens), ". The sign-up form at the bottom of the page will tell you when.") : React.createElement(React.Fragment, null, React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-2)",
      marginBottom: 14,
      cursor: "pointer"
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked: giftMode,
    onChange: e => setGiftMode(e.target.checked),
    style: {
      accentColor: "var(--ink)"
    }
  }), "Buying it as a gift?"), giftMode && React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "gift-email"
  }, "Recipient's email"), React.createElement("input", {
    id: "gift-email",
    type: "email",
    required: true,
    value: giftEmail,
    onChange: e => setGiftEmail(e.target.value),
    placeholder: "them@email.com"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "gift-note"
  }, "A short note to include, optional"), React.createElement("textarea", {
    id: "gift-note",
    maxLength: GIFT_NOTE_MAX,
    value: giftNote,
    onChange: e => setGiftNote(e.target.value),
    style: {
      minHeight: 70
    }
  })), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "8px 0 0"
    }
  }, "Their access email goes straight to them when payment clears. Their 18 months start today, so time it to the trip.")), React.createElement("button", {
    type: "button",
    className: "btn",
    disabled: busy,
    onClick: startCheckout,
    style: {
      display: "block",
      width: "100%",
      textAlign: "center",
      border: 0,
      font: "inherit",
      cursor: busy ? "wait" : "pointer",
      marginBottom: 10
    }
  }, busy ? "Opening checkout…" : `${giftMode ? "Gift the offline guide" : "Get the offline guide"} → ${formatPrice(priceCents)}`), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "0 0 14px"
    }
  }, "Checkout by Stripe. Your access code arrives by email in about a minute.")), error && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--moss)",
      lineHeight: 1.55,
      margin: "0 0 14px"
    }
  }, error), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 14,
      color: "var(--ink-2)",
      lineHeight: 1.55,
      margin: 0
    }
  }, "One payment, about a dollar a month over the 18 months. The app, every photo, and the offline park map are yours on every device you own. Updates push automatically through the 2026 season, including the Secret Guide as it grows."), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 14,
      color: "var(--ink-2)",
      lineHeight: 1.55,
      margin: "12px 0 0"
    }
  }, "If it doesn't earn its place on your home screen, email me and I'll make it right."), React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_aside"
      });
    },
    style: {
      display: "block",
      textAlign: "center",
      border: "1px solid var(--ink)",
      padding: "10px 14px",
      marginTop: 16,
      fontFamily: "var(--sans)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 600,
      color: "var(--ink)",
      textDecoration: "none",
      background: "var(--paper)"
    }
  }, "Open the free sample first →"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "8px 0 0"
    }
  }, "Already bought it? ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/login`,
    style: {
      color: "var(--ink-2)"
    }
  }, "Sign in to the app →")), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      marginTop: 24,
      paddingTop: 20
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "In the app"), React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.7
    }
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 50 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included"))), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      marginTop: 24,
      paddingTop: 20
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Questions"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: 0
    }
  }, "Email ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com",
    style: {
      color: "var(--ink-2)"
    }
  }, "cory@thetalusfieldjournal.com"), ".")));
}
function GuideWaitlistBox() {
  var [email, setEmail] = React.useState("");
  var [website, setWebsite] = React.useState("");
  var [busy, setBusy] = React.useState(false);
  var [done, setDone] = React.useState(false);
  var [error, setError] = React.useState(null);
  async function joinWaitlist(e) {
    e.preventDefault();
    var addr = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError(null);
    if (window.track) window.track("guide_waitlist_join", {
      location: "guide_aside"
    });
    try {
      var res = await fetch(`${GUIDE_API_BASE}/api/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: addr,
          website
        })
      });
      var body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (_e) {
      setError("That didn't go through. Try again in a minute, or email cory@thetalusfieldjournal.com.");
    } finally {
      setBusy(false);
    }
  }
  return React.createElement("aside", {
    style: {
      position: "sticky",
      top: 100,
      alignSelf: "start",
      border: "1px solid var(--ink)",
      padding: 32,
      background: "var(--paper-2)"
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "The Field Guide"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 44,
      lineHeight: 1.05,
      fontWeight: 500,
      marginBottom: 8
    }
  }, "Not out yet."), React.createElement("div", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--ink-3)",
      fontWeight: 600,
      marginBottom: 24
    }
  }, "Offline app · 2026 Edition"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 15,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 18px"
    }
  }, "The guide is in final testing. It will be $3.99, one payment, 18 months of access on every device you own. Leave your email and you will hear the day it opens, before anyone else."), done ? React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 18px",
      border: "1px solid var(--ink)",
      padding: "12px 14px",
      background: "var(--paper)"
    }
  }, "You're on the list. I'll email you the day the guide opens.") : React.createElement("form", {
    onSubmit: joinWaitlist
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "waitlist-email"
  }, "Your email"), React.createElement("input", {
    id: "waitlist-email",
    type: "email",
    required: true,
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@email.com"
  })), React.createElement("input", {
    type: "text",
    name: "website",
    tabIndex: -1,
    autoComplete: "off",
    "aria-hidden": "true",
    value: website,
    onChange: e => setWebsite(e.target.value),
    style: {
      position: "absolute",
      left: "-9999px",
      width: 1,
      height: 1,
      opacity: 0
    }
  }), React.createElement("button", {
    type: "submit",
    className: "btn",
    disabled: busy,
    style: {
      display: "block",
      width: "100%",
      textAlign: "center",
      border: 0,
      font: "inherit",
      cursor: busy ? "wait" : "pointer",
      marginTop: 14
    }
  }, busy ? "Sending…" : "Put me on the wait-list"), error && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--moss)",
      lineHeight: 1.55,
      margin: "14px 0 0"
    }
  }, error)), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      marginTop: 24,
      paddingTop: 20
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "In the app"), React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.7
    }
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 50 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included"))), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      marginTop: 24,
      paddingTop: 20
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Questions"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: 0
    }
  }, "Email ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com",
    style: {
      color: "var(--ink-2)"
    }
  }, "cory@thetalusfieldjournal.com"), ".")));
}
var APP_SHOTS = [{
  src: "img/guide/screens/front-page.webp",
  alt: "The Field Guide app's front page, listing the four regions with a stop count and the current forecast on each",
  caption: "The front page. Four regions, every stop counted, and today's forecast on each one before you pick a direction."
}, {
  src: "img/guide/screens/region-cards.webp",
  alt: "A region in card view: one stop per screen with photo, coordinate, elevation, and time budget, swiped like a feed",
  caption: "A region reads as a deck: one stop per screen, swipe up for the next. The long list is still a tap away."
}, {
  src: "img/guide/screens/stop.webp",
  alt: "A stop page in the app for Tunnel View, showing a tappable GPS coordinate, elevation, and a 25-minute time budget",
  caption: "Every stop opens with the numbers that run your day: a tappable GPS coordinate, the elevation, the honest time budget."
}, {
  src: "img/guide/screens/swap.webp",
  alt: "The same stop page scrolled to the 'If full' swap, telling you exactly where to go when the parking lot is full",
  caption: "The swap, printed on the stop itself. The lot fills at ten, you already know the move."
}, {
  src: "img/guide/screens/hikes.webp",
  alt: "The day-hike catalog in the app, each trail listed with distance, gain, difficulty, and its elevation profile",
  caption: "All 57 in-park day hikes with distance, climbing, and the shape of the trail. Add one and the planner budgets the hours."
}, {
  src: "img/guide/screens/programs.webp",
  alt: "The program list in the app, grouped by day: ranger walks, a Junior Ranger table, a Conservancy talk, a star party",
  caption: "The park's programs on your dates, day by day, from the Park Service, the Conservancy, the concessioner, and the astronomy clubs."
}, {
  src: "img/guide/screens/trip-board.webp",
  alt: "The planning calendar in the app: a day drawn as a timeline with stops, a ranger walk, and a hike as sized blocks",
  caption: "The planning calendar, native to the app. Each day is a real timeline: blocks sized by how long a thing takes, drives figured between them, dragged where you want them."
}, {
  src: "img/guide/screens/calendar.webp",
  alt: "The app's add-to-calendar sheet, saving the whole trip as a calendar file your phone imports in one tap",
  caption: "When the days are set, one tap saves the whole board as a calendar file your phone imports, reminders and directions links included. No signal needed."
}, {
  src: "img/guide/screens/today.webp",
  alt: "The field-day view in the app: sunrise and sunset, entrance waits, what is happening now, and the day in time order",
  caption: "In the park, the plan collapses to one screen: light and entrance waits up top, what's on now, then the day in order."
}, {
  src: "img/guide/screens/secret-guide.webp",
  alt: "The Secret Guide section in the app: 37 entries of quiet vistas, hidden trails, and parking moves",
  caption: "The Secret Guide. 37 entries of quiet vistas, hidden trails, parking moves, and the park after dark."
}];
function AppShots() {
  return React.createElement("div", {
    className: "app-shots",
    role: "list"
  }, APP_SHOTS.map(shot => React.createElement("figure", {
    className: "app-shot",
    role: "listitem",
    key: shot.src
  }, React.createElement("div", {
    className: "app-shot__frame"
  }, React.createElement("img", {
    src: shot.src,
    alt: shot.alt,
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("figcaption", {
    className: "app-shot__caption"
  }, shot.caption))));
}
var WALKTHROUGH_STEPS = [{
  src: "img/guide/screens/front-page.webp",
  alt: "The app's front page: four regions, each with a stop count and today's forecast",
  title: "Pick a direction",
  detail: "Four regions, every stop counted, today's forecast on each."
}, {
  src: "img/guide/screens/stop.webp",
  alt: "A stop page with a tappable GPS coordinate, the elevation, and a 25-minute time budget",
  title: "Read the numbers",
  detail: "A tappable coordinate, the elevation, the honest time budget."
}, {
  src: "img/guide/screens/swap.webp",
  alt: "The stop's 'If full' swap: exactly where to go when the lot is full",
  title: "Know the move when the lot is full",
  detail: "The swap is printed on the stop itself, not somewhere in your notes."
}, {
  src: "img/guide/screens/trip-board.webp",
  alt: "A trip day drawn as a timeline: blocks sized by duration with drive buffers between",
  title: "Build the day in driving order",
  detail: "Blocks sized by how long things take, drives figured between them."
}, {
  src: "img/guide/screens/today.webp",
  alt: "The field-day screen: light, entrance waits, and the day in time order",
  title: "Work the day from one screen",
  detail: "Light, entrance waits, what's on now. The plan with the planning taken out."
}];
var WALKTHROUGH_INTERVAL_MS = 4000;
function GuideWalkthrough() {
  var [active, setActive] = React.useState(0);
  var [paused, setPaused] = React.useState(false);
  var rootRef = React.useRef(null);
  var inViewRef = React.useRef(true);
  var reducedMotion = React.useMemo(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_e) {
      return false;
    }
  }, []);
  React.useEffect(() => {
    if (reducedMotion || paused) return undefined;
    var io = null;
    if (typeof IntersectionObserver !== "undefined" && rootRef.current) {
      inViewRef.current = false;
      io = new IntersectionObserver(entries => {
        inViewRef.current = entries.some(e => e.isIntersecting);
      });
      io.observe(rootRef.current);
    }
    var timer = setInterval(() => {
      if (inViewRef.current) {
        setActive(a => (a + 1) % WALKTHROUGH_STEPS.length);
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
  return React.createElement("div", {
    className: "guide-walkthrough",
    ref: rootRef
  }, React.createElement("div", {
    className: "guide-walkthrough__stage",
    "aria-live": "off"
  }, WALKTHROUGH_STEPS.map((step, i) => React.createElement("img", {
    key: step.src,
    className: "guide-walkthrough__shot" + (i === active ? " is-active" : ""),
    src: step.src,
    alt: step.alt,
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  }))), React.createElement("ol", {
    className: "guide-walkthrough__steps"
  }, WALKTHROUGH_STEPS.map((step, i) => React.createElement("li", {
    key: step.src
  }, React.createElement("button", {
    type: "button",
    className: "guide-walkthrough__step" + (i === active ? " is-active" : ""),
    "aria-current": i === active ? "step" : undefined,
    onClick: () => goToStep(i)
  }, React.createElement("span", {
    className: "guide-walkthrough__step-num"
  }, i + 1), React.createElement("span", {
    className: "guide-walkthrough__step-body"
  }, React.createElement("strong", null, step.title), React.createElement("span", null, step.detail)))))));
}
var OUTCOMES = [{
  kicker: "Find the correct parking turnout",
  body: "Every stop carries a coordinate that opens your Maps app with the line already drawn, and the parking is written into the stop itself: which lot, which pullout, which side of the road, and what the tell is when the sign is missing. The unsigned turnouts locals use have their own entries.",
  proof: "A source-verified coordinate on 65 of the 66 stops"
}, {
  kicker: "Know how long each stop actually takes",
  body: "Each stop states its time budget, drive included, so you know what fits before lunch while it still matters. Hikes carry verified distance, climbing, and an effort score computed from real terrain data, not the trailhead sign's optimism.",
  proof: "Time budgets on 65 of 66 stops · 57 hikes with verified GPS tracks"
}, {
  kicker: "Replace a hike when weather, crowds, or children change the plan",
  body: "The flagship stops print their swap right on the page: where to go the moment the lot is full or the trail is not happening today. Ready-made day plans cover the half day, the first visit, young kids, grandparents, and the whole multi-generation caravan.",
  proof: "Swaps printed on the flagship stops · 9 ready-made day plans"
}, {
  kicker: "Navigate when service disappears",
  body: "One tap downloads the whole guide: every entry, every photo, all 57 hike tracks, and a topographic map of the park with every stop pinned. Service dies past the tunnel and on most of Tioga Road. The guide is built for exactly that.",
  proof: "About 50 MB all-in. The map is about 20 MB of it"
}, {
  kicker: "Build each day in driving order",
  body: "The planner draws each day as a real timeline: blocks sized by their time budgets, drives between stops computed from the actual distances and dropped in as buffers. Drag a block and the day re-flows. One tap saves the finished plan to your calendar, no signal needed.",
  proof: "Drive buffers figured from real distances, 10 to 75 minutes"
}];
function GuideOutcomes() {
  return React.createElement("div", {
    className: "guide-outcomes"
  }, OUTCOMES.map(o => React.createElement("div", {
    className: "guide-outcome",
    key: o.kicker
  }, React.createElement("h3", {
    className: "guide-outcome__kicker"
  }, o.kicker), React.createElement("p", {
    className: "guide-outcome__body"
  }, o.body), React.createElement("div", {
    className: "guide-outcome__proof"
  }, o.proof))));
}
function GuideStopExample() {
  return React.createElement("div", {
    className: "guide-stop-ex"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "From the guide · Yosemite Valley · Stop 1 of 21"), React.createElement("h3", {
    className: "guide-stop-ex__title"
  }, "Tunnel View, the moment the valley opens"), React.createElement("div", {
    className: "guide-stop-ex__meta"
  }, React.createElement("a", {
    className: "guide-stop-ex__chip guide-stop-ex__chip--coord",
    href: "https://www.google.com/maps/dir/?api=1&destination=37.7156,-119.6773",
    target: "_blank",
    rel: "noopener"
  }, "37.7156, −119.6773 · directions"), React.createElement("span", {
    className: "guide-stop-ex__chip"
  }, "4,400 ft"), React.createElement("span", {
    className: "guide-stop-ex__chip"
  }, "25 minutes")), React.createElement("p", {
    className: "guide-stop-ex__body"
  }, "You come out of the Wawona Tunnel and the whole valley is there at once. El Capitan on the left, Bridalveil Fall on the right, Half Dome anchoring the back wall. Most people raise a phone and lower it after thirty seconds. Don't. Stay fifteen minutes. Look at the U-shape of the valley floor — a glacier did that, two thousand feet of ice. The hanging valleys above the rim are why the waterfalls fall so far. You're not looking at scenery; you're looking at the geological event. Once you see it, you can't unsee it for the rest of the trip."), React.createElement("div", {
    className: "guide-stop-ex__swap"
  }, React.createElement("div", {
    className: "guide-stop-ex__swap-label"
  }, "If the lot is full"), React.createElement("p", null, "If the parking lot is full (it usually is between 10 a.m. and 4 p.m.), continue down to Valley View / Gates of the Valley. Lower angle, same valley, no crowd.")), React.createElement("p", {
    className: "guide-stop-ex__cite"
  }, "From the archive, printed on the stop: the tunnel behind you was new in 1933, and the naturalists spent that first year logging what walked into it. ", React.createElement("em", null, "Yosemite Nature Notes"), ", Vol. 12 No. 11, November 1933."), React.createElement("p", {
    className: "guide-stop-ex__links"
  }, React.createElement("a", {
    href: `${GUIDE_APP_BASE}/stop/tunnel-view`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_stop_example"
      });
    }
  }, "Open this stop in the real app →"), " ", "It is one of five sample entries anyone can read in full, no account needed."));
}
var ITIN_DEMO = [{
  time: "8:00 a.m.",
  label: "Tunnel View",
  mins: 25
}, {
  drive: 14
}, {
  time: "8:39 a.m.",
  label: "Bridalveil Fall",
  mins: 30
}, {
  drive: 30
}, {
  time: "9:39 a.m.",
  label: "Valley loop drive, Tunnel View to Curry Village",
  mins: 60
}, {
  drive: 30
}, {
  time: "11:09 a.m.",
  label: "Cook's Meadow Loop",
  mins: 60
}, {
  drive: 13
}, {
  time: "12:22 p.m.",
  label: "Lunch at Curry Village",
  mins: 60
}, {
  drive: 12
}, {
  time: "1:34 p.m.",
  label: "The Ahwahnee, lobby visit",
  mins: 45
}, {
  drive: 12
}, {
  time: "2:31 p.m.",
  label: "Mirror Lake, before the crowd",
  mins: 90
}, {
  drive: 22
}, {
  time: "4:23 p.m.",
  label: "El Capitan Meadow, watching the wall",
  mins: 60
}, {
  drive: 18
}, {
  time: "5:41 p.m.",
  label: "Sentinel Bridge, the last hour",
  mins: 60
}];
function GuideItineraryExample() {
  return React.createElement("div", {
    className: "guide-itin-demo"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "From the planner · Day 1 · Yosemite Valley"), React.createElement("ol", {
    className: "guide-itin-demo__list"
  }, ITIN_DEMO.map((row, i) => row.drive ? React.createElement("li", {
    className: "guide-itin-demo__drive",
    key: `d${i}`
  }, "drive · ", row.drive, " min") : React.createElement("li", {
    className: "guide-itin-demo__block",
    key: row.label
  }, React.createElement("span", {
    className: "guide-itin-demo__time"
  }, row.time), React.createElement("span", {
    className: "guide-itin-demo__label"
  }, row.label), React.createElement("span", {
    className: "guide-itin-demo__dur"
  }, row.mins, " min")))), React.createElement("p", {
    className: "guide-itin-demo__note"
  }, "This is the one-day Valley preset exactly as the planner lays it out: every duration is the stop's own time budget, every drive is computed from the real distance between the two coordinates. Drag any block and the day re-flows around it. The day ends on Sentinel Bridge because that is where the last light goes."));
}
function GuideOfflineDemo() {
  var [off, setOff] = React.useState(true);
  return React.createElement("div", {
    className: "guide-offline"
  }, React.createElement("div", {
    className: "guide-offline__demo"
  }, React.createElement("div", {
    className: "guide-offline__toggle",
    role: "group",
    "aria-label": "Simulate cell service"
  }, React.createElement("button", {
    type: "button",
    className: off ? "" : "is-active",
    "aria-pressed": !off,
    onClick: () => setOff(false)
  }, "With service"), React.createElement("button", {
    type: "button",
    className: off ? "is-active" : "",
    "aria-pressed": off,
    onClick: () => setOff(true)
  }, "No service")), React.createElement("div", {
    className: "guide-offline__frame" + (off ? " is-off" : "")
  }, React.createElement("div", {
    className: "guide-offline__status",
    "aria-hidden": "true"
  }, "No Service · Airplane mode"), React.createElement("img", {
    src: "img/guide/screens/stop.webp",
    alt: "A stop page in the app, rendering identically with or without cell service",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("p", {
    className: "guide-offline__caption"
  }, off ? "Airplane mode. The stop, its coordinate, its swap, the map, and your whole plan render exactly the same." : "With service you also get the live extras: webcams, entrance waits, fresh weather.")), React.createElement("div", {
    className: "guide-offline__cols"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Works with zero bars"), React.createElement("ul", null, React.createElement("li", null, "· All 81 entries, photos included"), React.createElement("li", null, "· All 57 hikes with tracks and elevation profiles"), React.createElement("li", null, "· The topographic park map, every stop pinned"), React.createElement("li", null, "· The trip board, the day view, and calendar export"), React.createElement("li", null, "· Checklists, essentials, search, the Secret Guide"))), React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Needs signal"), React.createElement("ul", null, React.createElement("li", null, "· The live park webcams"), React.createElement("li", null, "· Entrance waits right now"), React.createElement("li", null, "· Fresh weather and program updates (the last sync stays readable)"), React.createElement("li", null, "· The Nature Notes archive links back to this site")))), React.createElement("p", {
    className: "guide-offline__fineprint"
  }, "The full download is about 50 MB: the park map is roughly 20 MB of it, about 700 topographic tiles covering the whole park and the road corridors."));
}
function GuideCompare({
  go
}) {
  var freeLink = (href, key, label) => React.createElement("a", {
    href: href,
    onClick: e => {
      e.preventDefault();
      go(key);
    }
  }, label);
  return React.createElement("div", {
    className: "guide-compare-wrap"
  }, React.createElement("table", {
    className: "guide-compare"
  }, React.createElement("caption", null, "The free site stays free. The guide is the field version."), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Free on this site"), React.createElement("th", {
    scope: "col"
  }, "In the Field Guide"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, freeLink("/articles", "articles", "Articles"), " and ", freeLink("/planning", "planning", "planning guides")), React.createElement("td", null, "The complete stop library: 81 entries across four regions")), React.createElement("tr", null, React.createElement("td", null, freeLink("/now", "now", "Current conditions")), React.createElement("td", null, "The whole guide offline, about 50 MB, no bars needed")), React.createElement("tr", null, React.createElement("td", null, freeLink("/itineraries", "itineraries", "Selected itineraries")), React.createElement("td", null, "All 57 day hikes and the 37-entry Secret Guide")), React.createElement("tr", null, React.createElement("td", null, "The ", freeLink("/map", "map", "basic trip map")), React.createElement("td", null, "The full trip builder: drag-and-drop days, drive buffers, calendar export")), React.createElement("tr", null, React.createElement("td", null, "The ", freeLink("/newsletter", "newsletter", "Sunday newsletter")), React.createElement("td", null, "18 months of silent updates as the season changes")))));
}
function GuideTrust() {
  return React.createElement("div", {
    className: "guide-trust"
  }, React.createElement("p", {
    className: "guide-trust__intro"
  }, "The guide is written by Cory Goehring, a naturalist who lives in Yosemite National Park and has worked in and around it for twenty seasons, mostly on foot. Every stop was visited, timed, and written up the way the articles on this site are written: from the ground, not from a search-result roundup."), React.createElement("div", {
    className: "guide-trust__grid"
  }, React.createElement("div", null, React.createElement("strong", null, "Works without cellular service."), " Built offline-first, because the park mostly is."), React.createElement("div", null, React.createElement("strong", null, "Every personal device."), " One purchase signs in your phone, tablet, and laptop."), React.createElement("div", null, React.createElement("strong", null, "No subscription."), " One payment, 18 months, nothing auto-renews."), React.createElement("div", null, React.createElement("strong", null, "No affiliate placements inside."), " The recommendations are picked, not paid for."), React.createElement("div", null, React.createElement("strong", null, "Updates included."), " Seasonal addenda and Secret Guide additions push silently."), React.createElement("div", null, React.createElement("strong", null, "30-day guarantee."), " If it does not work as described, it is refunded in full.")));
}
function GuideAfterPurchase({
  go
}) {
  return React.createElement("div", {
    className: "guide-after"
  }, React.createElement("ol", {
    className: "guide-steps"
  }, React.createElement("li", null, React.createElement("strong", null, "Checkout runs through Stripe."), " Card or wallet. This site never sees or stores your card number."), React.createElement("li", null, React.createElement("strong", null, "Within about a minute, an email arrives: \"Your Field Guide is ready.\""), " It carries a sign-in link and a 6-digit code. Both keep working for the full 18 months, so keep the email."), React.createElement("li", null, React.createElement("strong", null, "Open the link, or enter the code, on each device you want signed in."), " Phone at the trailhead, tablet in the car, laptop the night before."), React.createElement("li", null, React.createElement("strong", null, "Add it to your home screen and tap the offline download."), " About 50 MB later the whole guide, map included, lives on the device.")), React.createElement("p", {
    className: "guide-after__policy"
  }, "If the guide does not work as described, email ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " within 30 days and it is refunded in full, per the", " ", React.createElement("a", {
    href: "/terms",
    onClick: e => {
      e.preventDefault();
      go("terms");
    }
  }, "terms"), ". The same address is the fix for a lost email or a sign-in that will not take. There is no ticket system and no bot: it is the author's inbox."));
}
var GUIDE_FAQ = [{
  q: "Does it really work with no cell service?",
  a: "Yes. One tap downloads the whole guide, about 50 MB: every entry, every photo, all 57 hike tracks, and a topographic map of the park. Only the live extras need signal: webcams, entrance waits, and fresh weather and program updates."
}, {
  q: "Is it an App Store app?",
  a: "No. It is a web app you add to your home screen in one step, on iPhone or Android. No store account, no install wait, no version to manage. Once it is there it looks and behaves like a native app."
}, {
  q: "What happens right after I pay?",
  a: "Stripe handles checkout. Within about a minute you get an email with a sign-in link and a 6-digit code. Both keep working for the full 18 months, so you can sign in on a new device whenever you like."
}, {
  q: "How many devices can I use it on?",
  a: "Every device you personally own. Phone at the trailhead, tablet in the car, laptop the night before. The same code signs them all in."
}, {
  q: "Is it a subscription?",
  a: "No. You pay $3.99 once and access runs 18 months. Nothing auto-renews. Near the end you are offered a discounted renewal, and if you do nothing, access simply ends."
}, {
  q: "What if I lose the email or can't sign in?",
  a: "Email cory@thetalusfieldjournal.com and it gets sorted. The sign-in link and the code stay reusable for the whole 18 months, so finding the original email is usually the fix."
}, {
  q: "What is the refund policy?",
  a: "If the guide does not work as described, email within 30 days of purchase and it is refunded in full. After a refund the access code is deactivated. The full policy is on the terms page."
}, {
  q: "What do I get that the free site doesn't already give me?",
  a: "The complete library: 81 entries including the 37-entry Secret Guide, all 57 day hikes with verified GPS tracks, the drag-and-drop trip builder, and the offline download. The free site keeps the articles, the trip map, the itineraries, and the conditions board."
}, {
  q: "Does the guide change after I buy it?",
  a: "Yes. Updates, seasonal addenda, and Secret Guide additions push silently through your access window. Nothing to re-download, nothing extra to pay."
}];
function GuideFaq() {
  return React.createElement("div", {
    className: "guide-faq"
  }, GUIDE_FAQ.map(item => React.createElement("div", {
    className: "guide-faq__item",
    key: item.q
  }, React.createElement("h3", {
    className: "guide-faq__q"
  }, item.q), React.createElement("p", {
    className: "guide-faq__a"
  }, item.a))));
}
function BuyNowButton({
  location,
  label
}) {
  var [busy, setBusy] = React.useState(false);
  var [note, setNote] = React.useState(null);
  async function buy() {
    setBusy(true);
    setNote(null);
    if (window.track) window.track("guide_buy_click", {
      location
    });
    try {
      var res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, {
        method: "POST"
      });
      var body = await res.json().catch(() => ({}));
      if (res.status === 409 && body.soldOut) {
        setNote(`This month's copies are gone. Sales reopen ${formatReopens(body.reopens)}.`);
        return;
      }
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      setNote("Checkout didn't start. Try again in a minute, or email cory@thetalusfieldjournal.com.");
    } finally {
      setBusy(false);
    }
  }
  return React.createElement(React.Fragment, null, React.createElement("button", {
    type: "button",
    className: "btn",
    disabled: busy,
    onClick: buy,
    style: {
      border: 0,
      font: "inherit",
      cursor: busy ? "wait" : "pointer"
    }
  }, busy ? "Opening checkout…" : label || "Get the offline Yosemite guide →"), note && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--moss)",
      lineHeight: 1.55,
      margin: "12px 0 0"
    }
  }, note));
}
function GuideMobileBuyBar() {
  var [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  var [busy, setBusy] = React.useState(false);
  var [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    var cancelled = false;
    fetchInventory().then(body => {
      if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  React.useEffect(() => {
    var targets = [document.getElementById("guide-buy"), document.querySelector(".guide-closer"), document.querySelector(".site-footer")].filter(Boolean);
    var scrolledPast = window.scrollY > 480;
    var inView = new Set();
    var update = () => setVisible(scrolledPast && inView.size === 0);
    var onScroll = () => {
      scrolledPast = window.scrollY > 480;
      update();
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    var io = null;
    if (typeof IntersectionObserver !== "undefined" && targets.length) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) inView.add(e.target);else inView.delete(e.target);
        });
        update();
      });
      targets.forEach(t => io.observe(t));
    }
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (io) io.disconnect();
    };
  }, []);
  async function buy() {
    setBusy(true);
    if (window.track) window.track("guide_buy_click", {
      location: "guide_mobile_bar"
    });
    try {
      var res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, {
        method: "POST"
      });
      var body = await res.json().catch(() => ({}));
      if (!res.ok || !body.url) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      window.location = body.url;
    } catch (_e) {
      var aside = document.getElementById("guide-buy");
      if (aside) aside.scrollIntoView({
        behavior: "smooth"
      });
    } finally {
      setBusy(false);
    }
  }
  return React.createElement("div", {
    className: "guide-buybar" + (visible ? " is-visible" : ""),
    "aria-hidden": visible ? undefined : "true"
  }, React.createElement("div", {
    className: "guide-buybar__meta"
  }, React.createElement("span", {
    className: "guide-buybar__price"
  }, formatPrice(priceCents)), React.createElement("span", {
    className: "guide-buybar__sub"
  }, "Offline app · 18 months")), React.createElement("button", {
    type: "button",
    className: "guide-buybar__cta",
    disabled: busy,
    onClick: buy
  }, busy ? "Opening…" : "Get the guide →"));
}
function GuidePage({
  go
}) {
  return React.createElement("div", {
    className: "page page--guide"
  }, React.createElement("section", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The Field Guide · Offline app · 2026 Edition"), React.createElement("h1", null, "The Yosemite guide for people who already know about Glacier Point."), React.createElement("p", {
    className: "page-head__dek"
  }, "A web app you add to your home screen. Four regional guides with tappable GPS, honest time budgets, and a swap for when the lot is full. All 57 in-park day hikes with verified tracks. The ranger and partner programs on your dates. A planner that builds each day in driving order, then saves the trip to your calendar. And the whole thing, topo map included, downloads to your phone and keeps working when service dies. Not a PDF. Not another tourist checklist."), React.createElement("div", {
    className: "guide-stats"
  }, React.createElement("span", null, "4 regions"), React.createElement("span", null, "81 entries"), React.createElement("span", null, "57 day hikes"), React.createElement("span", null, "37 secret entries"), React.createElement("span", null, "Works offline")), React.createElement("div", {
    className: "guide-hero-cta"
  }, React.createElement(BuyNowButton, {
    location: "guide_hero"
  }), React.createElement("p", {
    className: "guide-hero-cta__sub"
  }, React.createElement(LivePrice, null), ", once. 18 months, every device you own. Or", " ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_hero"
      });
    }
  }, "open the free sample first →"))))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 24,
      paddingBottom: 80
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 64,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "prose"
  }, React.createElement(Placeholder, {
    image: "img/talus-flows-yosemite.jpg",
    caption: "Talus along the valley walls.",
    credit: "USGS / Alex Demas",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "16 / 10",
      marginBottom: 32
    }
  }), React.createElement("h2", null, "What this is, and what it isn't"), React.createElement("p", null, "The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, stop at Tunnel View, and look up at El Capitan from the Yosemite Valley floor. You already know those exist. You don't need another website telling you the same thing in a different font."), React.createElement("p", null, "This guide assumes you've done that reading. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, \"I have three days. Show me how to do this well.\" Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full."), React.createElement("h2", null, "What a wrong morning costs"), React.createElement("p", null, "Yosemite charges its real fees in hours. The Glacier Point lot fills by mid-morning in July; arrive at ten and the hour of driving becomes three of circling. Miss the early window at the Mist Trail and the day reorganizes itself around a shuttle line. The $35 your car pays at the entrance covers seven days no matter what you do with them. What those days contain is decided by timing, and timing is exactly what a list of famous viewpoints doesn't give you."), React.createElement("p", null, "That's the problem this guide is built against. Time budgets tell you what actually fits before lunch. Swaps tell you where to go the second a lot is full. And because all of it lives on your phone and works without signal, the answer is there at the moment the day wobbles, which is never a moment with bars."), React.createElement("h2", null, "Sixty seconds inside the app"), React.createElement("p", null, "Five screens, in the order a trip actually uses them. These are unedited captures from the current 2026 build, the same one buyers open. Tap a step to hold it."), React.createElement(GuideWalkthrough, null), React.createElement("h2", null, "Every screen, unedited"), React.createElement("p", null, "The full set: ten screens from the current build, captured on a phone. What you see here is the product, not a mockup."), React.createElement(AppShots, null), React.createElement("h2", null, "What it does for the day"), React.createElement(GuideOutcomes, null), React.createElement("h2", null, "Read one stop, in full"), React.createElement("p", null, "This is the guide's first stop, quoted word for word from the app. Every one of the 81 entries is built this way: the numbers up top, the read underneath, the fallback printed on the page, and, where the record allows it, a sourced note from a century of park naturalists' field bulletins."), React.createElement(GuideStopExample, null), React.createElement("h2", null, "A day, built in driving order"), React.createElement("p", null, "This is what the planner does with a day. Stops go in, and the day comes back as a timeline: each block sized by its real time budget, each gap computed from the actual driving distance between the two coordinates. No spreadsheet, no guessing whether four things fit before lunch."), React.createElement(GuideItineraryExample, null), React.createElement("h2", null, "Turn the service off"), React.createElement("p", null, "Cell service dies at the Wawona Tunnel, on most of Glacier Point Road, and along nearly all of Tioga. The guide treats that as the normal case, not the failure case."), React.createElement(GuideOfflineDemo, null), React.createElement("h2", null, "The free site, and the guide"), React.createElement("p", null, "Everything this site publishes stays free: the articles, the trip map, the itineraries, the conditions board. The guide is not those pages repackaged. It is the field version: the complete library, the planner, and the offline download that makes both of them work standing in a pullout with no bars."), React.createElement(GuideCompare, {
    go: go
  }), React.createElement("p", {
    style: {
      marginTop: 24
    }
  }, React.createElement(BuyNowButton, {
    location: "guide_compare"
  })), React.createElement("h2", null, "The Secret Guide"), React.createElement("p", null, "There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, browsable by category, every stop marked in gold on the offline map. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge."), React.createElement("h2", null, "Who wrote it, and how"), React.createElement(GuideTrust, null), React.createElement("h2", null, "What happens when you tap the button"), React.createElement(GuideAfterPurchase, {
    go: go
  }), React.createElement("h2", null, "What's NOT inside"), React.createElement("p", null, "I think you should know what you're not getting before you pay."), React.createElement("ul", null, React.createElement("li", null, "This is not the standard tourist guide. If you want a list of the ten most famous viewpoints with the basic directions to each, every other Yosemite site already gives you that for free. This guide is what comes after that."), React.createElement("li", null, "It is not a children's activity book or a photography manual. Both could be their own books."), React.createElement("li", null, "It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both."), React.createElement("li", null, "It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.")), React.createElement("h2", null, "Who it's for"), React.createElement("p", null, "First-time visitors who want a real plan, not a list. Second-time visitors who came home from their first trip feeling like they'd missed the actual park and want to fix it. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it."), React.createElement("p", null, "If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it, you might not need the guide. The guide is for people who want the spreadsheet already built."), React.createElement("h2", null, "Questions, answered"), React.createElement(GuideFaq, null), React.createElement("h2", null, "One small promise"), React.createElement("p", null, "If the guide doesn't earn its place on your home screen, write to me and tell me why, and I'll make it right. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page."), React.createElement("div", {
    className: "guide-closer"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The offer, in one place"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      margin: "0 0 20px"
    }
  }, "Four regional guides. 44 stops in driving order, each with GPS and a time budget, the flagship ones with a swap. All 57 in-park day hikes with verified tracks. The 37-entry Secret Guide. The park's program schedule on your dates. A planning calendar you drag into shape, then save to the calendar you already use. And an offline topo map that holds it all together. ", React.createElement(LivePrice, null), ", once, for 18 months on every device you own."), React.createElement(BuyNowButton, {
    location: "guide_closer"
  }), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "14px 0 0"
    }
  }, "Checkout by Stripe. Your access code arrives by email in about a minute. Prefer to look first?", " ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_closer"
      });
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "Read the free sample →")))), GUIDE_ON_SALE ? React.createElement(GuideBuyBox, null) : React.createElement(GuideWaitlistBox, null))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingBottom: 96
    }
  }, React.createElement(NewsletterInline, {
    location: "guide_footer",
    tag: "guide",
    heading: "Sunday Field Notes",
    blurb: "A short note on Sundays. Subscribers hear about Field Guide updates, Secret Guide additions, and seasonal addenda first."
  })), GUIDE_ON_SALE && React.createElement(GuideMobileBuyBar, null));
}
window.GuidePage = GuidePage;
