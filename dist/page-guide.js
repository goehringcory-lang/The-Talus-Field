var GUIDE_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://talus-field-guide.pages.dev";
var GUIDE_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var GUIDE_PRICE_FALLBACK_CENTS = 1900;
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
  }, busy ? "Opening checkout…" : `${giftMode ? "Gift the guide" : "Buy the guide"} → ${formatPrice(priceCents)}`), React.createElement("p", {
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
  }, "Read a free sample first →"), React.createElement("p", {
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
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 50 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A trip planner that syncs your days to Google Calendar, or any calendar app, and re-syncs when you change the plan"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included"))), React.createElement("div", {
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
  }, "The guide is in final testing. It will be $19, one payment, 18 months of access on every device you own. Leave your email and you will hear the day it opens, before anyone else."), done ? React.createElement("p", {
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
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 50 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A trip planner that syncs your days to Google Calendar, or any calendar app, and re-syncs when you change the plan"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included"))), React.createElement("div", {
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
  src: "img/guide/app-home.webp",
  alt: "The Field Guide app's front page: the whole guide indexed on one screen, with how-it-works steps and the seasonal almanac",
  caption: "The front page. The whole guide indexed on one screen, with the season's closures and full moons already listed."
}, {
  src: "img/guide/app-stop.webp",
  alt: "A stop page in the app for Tunnel View, showing a tappable GPS coordinate, elevation, and a time budget",
  caption: "Every stop opens with the numbers that run your day: a tappable GPS coordinate, the elevation, the honest time budget."
}, {
  src: "img/guide/app-stop-swap.webp",
  alt: "The same stop page scrolled to the 'If full' swap, telling you exactly where to go when the parking lot is full",
  caption: "The swap, printed on the stop itself. The lot fills at ten, you already know the move."
}, {
  src: "img/guide/app-trip.webp",
  alt: "The trip planner in the app, showing a day's agenda with start times and drive-time buffers between stops",
  caption: "The planner lays out each day and inserts real drive-time buffers between stops. One tap puts it on your calendar."
}, {
  src: "img/guide/app-secret-guide.webp",
  alt: "The Secret Guide section in the app: 37 entries of quiet vistas, hidden trails, and parking moves",
  caption: "The Secret Guide. 37 entries of quiet vistas, hidden trails, parking moves, and the park after dark."
}, {
  src: "img/guide/app-hikes.webp",
  alt: "The day-hike catalog in the app, listing every in-park day hike with distance, gain, and difficulty",
  caption: "All 57 in-park day hikes with distance, gain, and difficulty. Add one and the planner budgets the hours for it."
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
function BuyNowButton({
  location
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
  }, busy ? "Opening checkout…" : "Buy the guide →"), note && React.createElement("p", {
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
  }, busy ? "Opening…" : "Buy the guide →"));
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
  }, "A web app you add to your home screen. Four regional guides with tappable GPS, time budgets, a swap for when the plan dies, an offline topo map of the whole park, the ranger and partner program schedule on your dates, and a trip planner that syncs your days into Google or Apple Calendar and keeps them current when the plan changes. Works at the trailhead when service doesn't. Not a PDF. Not another tourist checklist."), React.createElement("div", {
    className: "guide-stats"
  }, React.createElement("span", null, "4 regions"), React.createElement("span", null, "44 stops"), React.createElement("span", null, "57 day hikes"), React.createElement("span", null, "37 secret entries"), React.createElement("span", null, "Works offline")))), React.createElement("div", {
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
  }), React.createElement("h2", null, "What this is, and what it isn't"), React.createElement("p", null, "The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, stop at Tunnel View, and look up at El Capitan from the Yosemite Valley floor. You already know those exist. You don't need another website telling you the same thing in a different font."), React.createElement("p", null, "This guide assumes you've done that reading. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, \"I have three days. Show me how to do this well.\" Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full."), React.createElement("h2", null, "What a wrong morning costs"), React.createElement("p", null, "Yosemite charges its real fees in hours. The Glacier Point lot fills by mid-morning in July; arrive at ten and the hour of driving becomes three of circling. Miss the early window at the Mist Trail and the day reorganizes itself around a shuttle line. The $35 your car pays at the entrance covers seven days no matter what you do with them. What those days contain is decided by timing, and timing is exactly what a list of famous viewpoints doesn't give you."), React.createElement("p", null, "That's the problem this guide is built against. Time budgets tell you what actually fits before lunch. Swaps tell you where to go the second a lot is full. And because all of it lives on your phone and works without signal, the answer is there at the moment the day wobbles, which is never a moment with bars."), React.createElement("h2", null, "Inside the app"), React.createElement("p", null, "These are unedited screens from the 2026 edition, the same build buyers open. What you see here is the product, not a mockup."), React.createElement(AppShots, null), React.createElement("h2", null, "The regional guides"), React.createElement("p", null, "The guide is organized by where you are in the park, not how long you're staying. Pick the region you're heading to, read the stops in suggested order, and do the ones that fit your day."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Yosemite Valley & surrounding areas."), " The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall on El Capitan, the Mist Trail to Vernal and Nevada Falls, and the valley lodgings."), React.createElement("li", null, React.createElement("strong", null, "Glacier Point & the Mariposa Grove."), " The southern rim and the giant sequoias. Higher elevation, more driving, and the panoramas that put the whole valley below you. Closed in winter."), React.createElement("li", null, React.createElement("strong", null, "Tuolumne Meadows & the Highway 120 corridor."), " The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October."), React.createElement("li", null, React.createElement("strong", null, "Hetch Hetchy & the Evergreen Road corridor."), " The other granite valley, half of it under a reservoir, with its own entrance and day-use gate hours. Open year-round and nearly empty.")), React.createElement("h2", null, "What every stop gives you"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "A tappable GPS coordinate."), " Tap it and your Maps app opens with the line drawn for you. No copying, no typing."), React.createElement("li", null, React.createElement("strong", null, "A time budget."), " How long the stop actually takes, drive included. The kind of timing that prevents the late-afternoon scramble."), React.createElement("li", null, React.createElement("strong", null, "A swap."), " What to do when the lot is full, the road is closed, or the crowd beat you there. Each major stop lists its alternate."), React.createElement("li", null, React.createElement("strong", null, "The read."), " When to go, which direction to come from, and what most people get wrong. Written the way the articles on this site are written.")), React.createElement("h2", null, "The offline map"), React.createElement("p", null, "Every stop is pinned on a topographic map of the park that downloads to your device. The map is about 20 MB of the roughly 50 MB full offline download. Lose service past the tunnel, on Glacier Point Road, or anywhere along Tioga, and the map still pans, still zooms, and still shows you where the next stop is. Turn-by-turn driving stays in your Maps app; the guide hands you off with one tap."), React.createElement("h2", null, "The programs, on your dates"), React.createElement("p", null, "The park runs more than most visitors ever find out about: ranger walks, Junior Ranger tables, Conservancy naturalist programs and evening talks at Parsons Memorial Lodge, guided tours, and the summer nights when the astronomy clubs haul telescopes up to Glacier Point. The schedules live in a half-dozen places. The app pulls them into one list. Pick your trip dates, sync once while you have signal, and scroll your days: what's running, when, where, what's free, what needs a reservation. The list stays on your phone, so it still reads at a picnic table with no bars."), React.createElement("h2", null, "The trip planner, on your calendar"), React.createElement("p", null, "Add the stops you want and the programs you picked, and the app lays out each day: your stops in a sensible order with real time budgets, flowed around the programs' published times, with travel and parking buffers figured from the distance between them. Adjust anything, and the plan stays yours on the phone."), React.createElement("p", null, "When the plan is set, the app puts it on your calendar three ways. Pick whichever fits how you work."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Connect Google Calendar once."), " Authorize it from the account page and your trip lands in your Google Calendar as real events. Change the plan later and it re-syncs on its own. The connection lives on the server, so the app never sees or stores your Google password."), React.createElement("li", null, React.createElement("strong", null, "Subscribe from any calendar app."), " Publish the plan to a private link and add it to Apple Calendar, Outlook, or Google as a subscribed calendar named Yosemite trip. It sits beside your own calendar and follows every edit you make, on the calendar app's next refresh."), React.createElement("li", null, React.createElement("strong", null, "Or just save the file."), " One tap writes a standard .ics that imports the whole trip at once. It needs no signal, for when you want the plan locked onto your phone before you leave the last of the reception behind.")), React.createElement("p", null, "Every event carries the stop's GPS coordinate and a directions link, and the timed ones carry a reminder, so the calendar alert at the trailhead is also the navigation."), React.createElement("h2", null, "Know before you go"), React.createElement("p", null, "The app ships with an essentials section: how entrance reservations work, how to get around the Valley without moving your car, what the bears actually want, where cell coverage dies, what the roads do by season, and a packing checklist you check off in the app the night before. A night-before checklist walks you through the downloads that make the whole trip work offline, including the Google Maps offline area that keeps turn-by-turn directions alive past the entrance station."), React.createElement("h2", null, "The Secret Guide"), React.createElement("p", null, "There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, browsable by category, every stop marked in gold on the offline map. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge."), React.createElement("h2", null, "What's NOT inside"), React.createElement("p", null, "I think you should know what you're not getting before you pay."), React.createElement("ul", null, React.createElement("li", null, "This is not the standard tourist guide. If you want a list of the ten most famous viewpoints with the basic directions to each, every other Yosemite site already gives you that for free. This guide is what comes after that."), React.createElement("li", null, "It is not a children's activity book or a photography manual. Both could be their own books."), React.createElement("li", null, "It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both."), React.createElement("li", null, "It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.")), React.createElement("h2", null, "Who it's for"), React.createElement("p", null, "First-time visitors who want a real plan, not a list. Second-time visitors who came home from their first trip feeling like they'd missed the actual park and want to fix it. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it."), React.createElement("p", null, "If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it, you might not need the guide. The guide is for people who want the spreadsheet already built."), React.createElement("h2", null, "Format and delivery"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "A web app you add to your home screen."), " Looks and feels like a native app. It is not a PDF and not a printed book. No App Store, no install wait, no version to keep updated."), React.createElement("li", null, React.createElement("strong", null, "Works offline."), " One tap downloads the whole guide, every photo, and the park map to your device, about 50 MB. Lose service in the Valley or up at Tuolumne, the guide is still there."), React.createElement("li", null, React.createElement("strong", null, "Updates push silently through the 2026 season."), " New advice, route swaps, seasonal addenda, and Secret Guide additions all arrive without you re-downloading anything."), React.createElement("li", null, React.createElement("strong", null, "Pay once, sign in on every device you own."), " iPad in the car, iPhone at the trailhead, laptop the night before. Access lasts 18 months.")), React.createElement("h2", null, "One small promise"), React.createElement("p", null, "If the guide doesn't earn its place on your home screen, write to me and tell me why, and I'll make it right. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page."), React.createElement("div", {
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
  }, "Four regional guides. 44 stops in driving order, each with GPS, a time budget, and a swap. All 57 in-park day hikes. The 37-entry Secret Guide. The park's program schedule on your dates. A trip planner that syncs to your calendar and an offline map that holds it all together. Nineteen dollars, once, for 18 months on every device you own."), React.createElement(BuyNowButton, {
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
