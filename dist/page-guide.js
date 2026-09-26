var GUIDE_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://guide.thetalusfieldjournal.com";
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
    inventoryPromise = fetch(`${GUIDE_API_BASE}/api/inventory`).then(res => res.ok ? res.json() : null).catch(() => {
      inventoryPromise = null;
      return null;
    });
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
function readCheckoutSessionId() {
  try {
    var params = new URLSearchParams(window.location.search);
    var value = params.get("session_id");
    return value && /^cs_[A-Za-z0-9_]{4,250}$/.test(value) ? value : null;
  } catch (_e) {
    return null;
  }
}
var GIFT_NOTE_MAX = 280;
var BUY_STASH_KEY = "tfg.guide.buyLocation";
function stashBuyLocation(location, gift) {
  window.safeStorage.setJSON(BUY_STASH_KEY, {
    location,
    gift: !!gift
  });
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
  var [error, setError] = React.useState(null);
  var [outcome] = React.useState(readCheckoutOutcome);
  var [claimSessionId] = React.useState(readCheckoutSessionId);
  React.useEffect(() => {
    if (outcome === "cancel") {
      window.safeStorage.remove(BUY_STASH_KEY);
      return;
    }
    if (outcome !== "success" && outcome !== "gift-success") return;
    var stash = window.safeStorage.getJSON(BUY_STASH_KEY);
    if (!stash) return;
    window.safeStorage.remove(BUY_STASH_KEY);
    window.track("guide_purchase", {
      location: stash.location || "unknown",
      gift: outcome === "gift-success" || !!stash.gift
    });
  }, [outcome]);
  React.useEffect(() => {
    if (outcome !== "success" || !claimSessionId) return;
    var timer = setTimeout(() => {
      window.location.replace(`${GUIDE_APP_BASE}/claim?session_id=${encodeURIComponent(claimSessionId)}`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [outcome, claimSessionId]);
  var [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
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
    stashBuyLocation("guide_aside", giftMode);
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
    className: "guide-buybox"
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
      marginBottom: 24
    }
  }, "Offline app · 2026 Edition"), outcome === "success" && claimSessionId && React.createElement("p", {
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
  }, "Payment received. Opening your Field Guide, already signed in. If nothing happens, ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/claim?session_id=${encodeURIComponent(claimSessionId)}`,
    style: {
      color: "var(--ink-2)"
    }
  }, "open it here →"), " Your access email follows for your other devices."), outcome === "success" && !claimSessionId && React.createElement("p", {
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
  }, "Checkout was cancelled. Nothing was charged."), React.createElement(React.Fragment, null, React.createElement("label", {
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
  }, "Checkout by Stripe. The guide opens signed in the moment payment clears; your access code also arrives by email for your other devices.")), error && React.createElement("p", {
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
  }, "One payment of ", formatPrice(priceCents), " for 18 months of access. The app, the photos on file, and the offline park map are yours on every device you own. A few entries still show a stand-in photo rather than the place itself. Updates push automatically through the 2026 season, including the Secret Guide as it grows."), React.createElement("p", {
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
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 70 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: 50 entries of quiet vistas, hidden trails, parking moves, camping and the park after dark, included"), React.createElement("li", null, "· The dates that matter for your trip, under the trip board, with calendar files and reminders"), React.createElement("li", null, "· The Help card: 911 by call or text, your GPS position in the form a dispatcher reads, the park's printed numbers"), React.createElement("li", null, "· Companion mode: the nearest entry as you drive, read aloud for the passenger"), React.createElement("li", null, "· A bearing compass that points at any stop, and a daylight reading on every hike"), React.createElement("li", null, "· Quick ID for wildlife with a photo on every entry, and a life list"))), React.createElement("div", {
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
    className: "guide-buybox"
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
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 70 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A planning calendar that lays out each day, drive times included, and saves the trip to your calendar as a file, no signal needed"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: 50 entries of quiet vistas, hidden trails, parking moves, camping and the park after dark, included"), React.createElement("li", null, "· The dates that matter for your trip, under the trip board, with calendar files and reminders"), React.createElement("li", null, "· The Help card: 911 by call or text, your GPS position in the form a dispatcher reads, the park's printed numbers"), React.createElement("li", null, "· Companion mode: the nearest entry as you drive, read aloud for the passenger"), React.createElement("li", null, "· A bearing compass that points at any stop, and a daylight reading on every hike"), React.createElement("li", null, "· Quick ID for wildlife with a photo on every entry, and a life list"))), React.createElement("div", {
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
  src: "img/guide/screens/front-page.v5.webp",
  alt: "The Field Guide app's front page, 'Yosemite, right now': entrance waits for each gate drawn as bars, sunrise and sunset with the hours of light left, and the valley forecast",
  caption: "The front page opens on the park as it is right now: what each gate is running, when the light goes, the valley's forecast. Then your days, then the four regions."
}, {
  src: "img/guide/screens/region-cards.v5.webp",
  alt: "A region in card view: one stop per screen with photo, kind, time budget and teaser, swiped like a feed",
  caption: "A region reads as a deck: one stop per screen, swipe up for the next. The long list is still a tap away."
}, {
  src: "img/guide/screens/stop.v5.webp",
  alt: "A stop page for Tunnel View: the photo framed as an instrument view with the coordinate and elevation printed on it, then a readout of GPS, elevation, time budget and best light",
  caption: "Every stop opens on the numbers that run your day: a tappable coordinate, the elevation, the honest time budget, and the hour the light works."
}, {
  src: "img/guide/screens/swap.v5.webp",
  alt: "The 'If full' swap on a stop page, saying where to go instead when the lot is full, above a sourced note from the November 1933 Yosemite Nature Notes",
  caption: "The swap, printed on the stop itself. The lot fills at ten, you already know the move. Under it, where the record allows, a sourced note from a century of park naturalists."
}, {
  src: "img/guide/screens/hikes.v5.webp",
  alt: "The day-hike catalog in the app, each trail listed with distance, gain, difficulty, duration, its elevation profile, and a button that adds it to the trip",
  caption: "All 57 in-park day hikes with distance, climbing, and the shape of the trail. Add one and the planner budgets the hours."
}, {
  src: "img/guide/screens/programs.v5.webp",
  alt: "The program list in the app, grouped by day: a volunteer cleanup, a concessioner bus tour, a Conservancy art class, a gallery exhibit, each with its time, meeting place, operator and the Guide's free, all-ages and accessible marks",
  caption: "The park's programs on your dates, day by day, from the Park Service, the Conservancy, the concessioner, and the astronomy clubs."
}, {
  src: "img/guide/screens/trip-board.v5.webp",
  alt: "The planning calendar in the app: a day drawn as a timeline with stops and a ranger walk as blocks sized by duration, the drive between each one figured in, and a line marking the current hour",
  caption: "The planning calendar, native to the app. Each day is a real timeline: blocks sized by how long a thing takes, drives figured between them, dragged where you want them."
}, {
  src: "img/guide/screens/calendar.v5.webp",
  alt: "The trip review before export, listing every event of a day with its time and length, above the button that saves the whole trip as a calendar file",
  caption: "When the days are set, the board is reviewed event by event, then saved as one calendar file your phone imports: coordinates, directions links and reminders included. No signal needed."
}, {
  src: "img/guide/screens/today.v5.webp",
  alt: "The field-day view in the app: the day's forecast, sun times, entrance waits, road status, air quality and river flow, then live webcam stills of Half Dome and Yosemite Falls",
  caption: "In the park, the plan collapses to one screen: light, gate waits, roads, air and river up top, the park on camera, then what's next and the day in order."
}, {
  src: "img/guide/screens/secret-guide.v5.webp",
  alt: "The Secret Guide's opening folio in the app: a dark plate headed 'Included with purchase, 50 entries', the section's promise in a paragraph, then a numbered contents of five categories: Quiet Vistas 9, Hidden Trails 23, Parking 5, Camping 7, After Dark 6",
  caption: "The Secret Guide opens on its folio: 50 entries in five numbered sections, every entry numbered across the whole set and pinned in gold on the offline map."
}];
var NEW_SHOTS = [{
  src: "img/guide/screens/regions.v5.webp",
  alt: "The front page's regions section, headed 'Four regions. Open one and plan its day.': Yosemite Valley as a photo card with 21 stops, 15 hikes, today's forecast and a Keep planning Day 1 button, then the Glacier Point and Mariposa Grove card marked Day 3",
  caption: "The four regions are photo cards now. A region already on your trip says which day it is and opens where you left off."
}, {
  src: "img/guide/screens/region-plan.v5.webp",
  alt: "The region planner for Yosemite Valley: a row of trip days to choose from, that day's sunrise, golden hour and sunset, then the rest of the day",
  caption: "Open a region and plan its day: pick the date, read the light, then build it from the programs, hikes and stops that run there. Everything you pick lands on the trip."
}, {
  src: "img/guide/screens/instruments.v5.webp",
  alt: "The instrument tiles on the app's front page: topo map, day hikes, programs, night sky, bearing compass, Help, and a wide 'You are near' tile",
  caption: "The front page's instrument row is seven now: the map, the hikes, the programs, the night sky, the bearing compass, the Help card, and companion mode."
}, {
  src: "img/guide/screens/help.v5.webp",
  alt: "The Help card: Call 911 and Text 911 buttons, then a 'Your position' panel reading the live GPS fix in decimal degrees and in degrees and decimal minutes, with accuracy and elevation below",
  caption: "The Help card. 911 by call or text, then your position in both forms a dispatcher and a rescue team use, ready to be read straight off the screen. Everything but the call itself works with no signal."
}, {
  src: "img/guide/screens/near.v5.webp",
  alt: "Companion mode: a panel reading GPS active, 100 feet, and 'Nearest: Tunnel View, the moment the valley opens', above the entry's opening paragraph",
  caption: "Companion mode. The nearest entry comes up as the car moves, with the paragraph on why it is worth stopping, and reads itself aloud for the passenger on request."
}, {
  src: "img/guide/screens/compass.v5.webp",
  alt: "The bearing compass: a rose with its needle pointing at Lower Yosemite Fall, 64 degrees east-northeast and 4.9 miles in a straight line, north up, the sun marked on the dial to the southeast",
  caption: "The bearing compass points at any stop: straight-line distance, true bearing, and the sun on the same dial, all computed on the phone. Airplane mode is fine."
}, {
  src: "img/guide/screens/daylight.v5.webp",
  alt: "The Daylight panel on the Upper Yosemite Fall hike page: sunset 6:51 p.m., start by 10:51 a.m., and, once that has passed, when a start now would finish, above the trail's elevation profile",
  caption: "Every hike carries a daylight reading: today's sunset against the time budget, and the latest start that gets you down with an hour of light in hand."
}, {
  src: "img/guide/screens/deadlines.v5.webp",
  alt: "The 'Dates that matter' panel under the trip board, listing the two-week campground release, the Camp 4 release and the seven-day wilderness permit release for an October trip, each with Add to calendar and an NPS source link",
  caption: "Dates that matter, resolved to your trip: the lotteries, release mornings and road windows that apply to your dates, each with a calendar file and its NPS source."
}, {
  src: "img/guide/screens/wildlife.v5.webp",
  alt: "The Quick ID page, 'What did I see?', with category chips and a black bear plate above the entry's field marks and a 'Seen it' check",
  caption: "Quick ID opens every one of its 32 entries on a photograph now, and the 'Seen it' check keeps your trip's life list."
}];
function AppShots({
  shots = APP_SHOTS
}) {
  return React.createElement("div", {
    className: "app-shots",
    role: "list"
  }, shots.map(shot => React.createElement("figure", {
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
  src: "img/guide/screens/front-page.v5.webp",
  alt: "The app's front page: live gate waits, the day's light and the valley forecast, above the four regions",
  title: "Pick a direction",
  detail: "The park's readings first: gate waits, the light, the forecast. Then the four regions."
}, {
  src: "img/guide/screens/stop.v5.webp",
  alt: "A stop page with a tappable GPS coordinate, the elevation, a 25-minute time budget and the best light",
  title: "Read the numbers",
  detail: "A tappable coordinate, the elevation, the honest time budget, the hour the light works."
}, {
  src: "img/guide/screens/swap.v5.webp",
  alt: "The stop's 'If full' swap: exactly where to go when the lot is full",
  title: "Know the move when the lot is full",
  detail: "The swap is printed on the stop itself, not somewhere in your notes."
}, {
  src: "img/guide/screens/trip-board.v5.webp",
  alt: "A trip day drawn as a timeline: blocks sized by duration with drive buffers between",
  title: "Build the day in driving order",
  detail: "Blocks sized by how long things take, drives figured between them."
}, {
  src: "img/guide/screens/today.v5.webp",
  alt: "The field-day screen: forecast, sun times, gate waits, road status, and the day in time order",
  title: "Work the day from one screen",
  detail: "Light, entrance waits, roads, what's next. The plan with the planning taken out."
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
  body: "Each stop states its time budget, drive included, so you know what fits before lunch while it still matters. Hikes carry distance, climbing, an effort score computed from terrain data, not the trailhead sign's optimism, and a daylight reading: today's sunset against the time budget, and the latest start that gets you down with an hour of light in hand.",
  proof: "Time budgets on 65 of 66 stops · 57 hikes with GPS tracks, elevation profiles and a daylight check"
}, {
  kicker: "Replace a hike when weather, crowds, or children change the plan",
  body: "The flagship stops print their swap right on the page: where to go the moment the lot is full or the trail is not happening today. Ready-made day plans cover the half day, the first visit, young kids, grandparents, and the whole multi-generation caravan.",
  proof: "Swaps printed on the flagship stops · 9 ready-made day plans"
}, {
  kicker: "Navigate when service disappears",
  body: "One tap downloads the whole guide: every entry, the photos on file, all 57 hike tracks, and a topographic map of the park with every stop pinned. A few entries still show a stand-in photo rather than the place itself. Service dies past the tunnel and on most of Tioga Road. The guide is built for exactly that.",
  proof: "About 50 MB all-in. The map is about 20 MB of it"
}, {
  kicker: "Build each day in driving order",
  body: "The planner draws each day as a real timeline: blocks sized by their time budgets, drives between stops computed from the actual distances and dropped in as buffers. Drag a block and the day re-flows. One tap saves the finished plan to your calendar, no signal needed.",
  proof: "Drive buffers figured from real distances, 10 to 75 minutes"
}, {
  kicker: "Know where you are when it matters",
  body: "The Help card reads your GPS position back in the two forms a dispatcher and a rescue team use, names the nearest place with its distance and bearing, and lists the park's printed numbers as one-tap rows, with 911 by call or text at the top. Companion mode names the entry you are passing and reads it aloud for the passenger. The bearing compass points at any stop from the phone's sensors alone. None of it needs a data connection.",
  proof: "Position in decimal degrees and degrees-minutes · the nearest named place with distance and bearing"
}, {
  kicker: "Know the dates that matter before they pass",
  body: "Under the trip board, the lotteries, release mornings and road windows that apply to your dates sit with calendar files and reminders, each with its NPS source.",
  proof: "14 dated deadlines, resolved to your trip"
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
  }, "You come out of the Wawona Tunnel and the whole valley is there at once. El Capitan on the left, Bridalveil Fall on the right, Half Dome anchoring the back wall. Most people raise a phone and lower it after thirty seconds. Don't. Stay fifteen minutes. Look at the U-shape of the valley floor: a glacier did that, two thousand feet of ice. The hanging valleys above the rim are why the waterfalls fall so far. You're not looking at scenery; you're looking at the geological event. Once you see it, you can't unsee it for the rest of the trip."), React.createElement("div", {
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
var DAY_ONE = [{
  name: "Tunnel View",
  sub: "The moment the valley opens",
  mins: 25,
  x: 118,
  y: 434,
  swap: true
}, {
  name: "Bridalveil Fall",
  sub: "Five-minute paved walk, flows all year",
  mins: 30,
  drive: 15,
  x: 301,
  y: 428
}, {
  name: "Mirror Lake",
  sub: "Two flat miles, closest to Half Dome",
  mins: 90,
  drive: 30,
  x: 1130,
  y: 119
}, {
  name: "Lunch at Curry Village",
  sub: "Pizza patio, no reservation",
  mins: 60,
  drive: 15,
  x: 966,
  y: 236,
  anchor: "Midday"
}, {
  name: "The Ahwahnee lobby",
  sub: "The 1927 Great Lounge, open to anyone",
  mins: 45,
  drive: 10,
  x: 933,
  y: 130
}, {
  name: "El Capitan Meadow",
  sub: "Climbers on the wall right now",
  mins: 60,
  drive: 25,
  x: 535,
  y: 340
}, {
  name: "Cook's Meadow Loop",
  sub: "Flat boardwalk mile, bears at dusk",
  mins: 60,
  drive: 20,
  x: 812,
  y: 132
}, {
  name: "Sentinel Bridge",
  sub: "Half Dome in the last light",
  mins: 60,
  drive: 0,
  x: 796,
  y: 170,
  anchor: "Sunset"
}];
var DAY_ONE_PHOTOS = [{
  image: "img/half-dome-merced-river-spring.jpg",
  n: 8,
  label: "Sentinel Bridge, the last hour",
  line: "Half Dome catches the day's last light. Stay past the first gold.",
  alt: "Half Dome above the Merced River from the Valley floor"
}, {
  image: "img/tunnel-view-valley-spring.jpg",
  n: 1,
  label: "Tunnel View",
  alt: "El Capitan, Bridalveil Fall and Half Dome from the Tunnel View overlook"
}, {
  image: "img/mirror-lake-mount-watkins.jpg",
  n: 3,
  label: "Mirror Lake",
  alt: "Mount Watkins reflected in Mirror Lake"
}, {
  image: "img/el-capitan-snow-spring.jpg",
  n: 6,
  label: "El Capitan Meadow",
  alt: "El Capitan in last light above the Merced River"
}];
function dayOneDuration(mins) {
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m}` : `${h} h`;
}
function GuideDayOne() {
  var onSite = DAY_ONE.reduce((sum, s) => sum + s.mins, 0);
  var between = DAY_ONE.reduce((sum, s) => sum + (s.drive || 0), 0);
  var route = DAY_ONE.map(s => `${s.x},${s.y}`).join(" ");
  var last = DAY_ONE.length;
  var half = Math.ceil(DAY_ONE.length / 2);
  var columns = [DAY_ONE.slice(0, half), DAY_ONE.slice(half)];
  return React.createElement("section", {
    className: "hp-wrap guide-dayone",
    "aria-labelledby": "guide-dayone-title"
  }, React.createElement("header", {
    className: "guide-dayone__head"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "DAY ONE, STRAIGHT FROM THE APP"), React.createElement("h2", {
    id: "guide-dayone-title"
  }, "Your first day in the Valley, ", React.createElement("em", null, "already in order.")), React.createElement("p", {
    className: "guide-dayone__dek"
  }, "Eight stops in driving order, each with an honest time budget, lunch and sunset pinned where they belong, and the fallback written in for the lot that fills at ten. This is the app's one-day Valley plan as it ships. Days two and three do the same for Glacier Point and Tioga Road.")), React.createElement("figure", {
    className: "guide-dayone__map"
  }, React.createElement("div", {
    className: "guide-dayone__scroll"
  }, React.createElement("div", {
    className: "guide-dayone__frame"
  }, React.createElement(ResponsiveImage, {
    image: "img/nps-yosemite-valley-map.jpg",
    alt: "National Park Service map of Yosemite Valley, with the eight stops of day one numbered in driving order",
    sizes: "(max-width: 760px) 700px, (max-width: 1400px) 92vw, 1280px",
    className: "guide-dayone__img"
  }), React.createElement("svg", {
    className: "guide-dayone__route",
    viewBox: "0 0 1280 500",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, React.createElement("polyline", {
    points: route,
    vectorEffect: "non-scaling-stroke"
  })), DAY_ONE.map((s, i) => React.createElement("span", {
    key: s.name,
    className: "guide-dayone__pin" + (i === last - 1 ? " is-last" : ""),
    style: {
      left: `${s.x / 1280 * 100}%`,
      top: `${s.y / 500 * 100}%`
    },
    "aria-hidden": "true"
  }, i + 1)))), React.createElement("figcaption", null, React.createElement("span", null, React.createElement("b", null, "YOSEMITE VALLEY, DAY 1"), " Numbered in drive order. ", React.createElement("span", {
    className: "guide-dayone__swipe"
  }, "Swipe the map for stops 3 to 8.")), React.createElement("span", null, "Map: National Park Service"))), React.createElement("div", {
    className: "guide-dayone__day"
  }, React.createElement("div", {
    className: "guide-dayone__dayhead"
  }, React.createElement("span", null, "THE DAY"), React.createElement("span", null, DAY_ONE.length, " stops · ", dayOneDuration(onSite), " at the stops · ", dayOneDuration(between), " between them")), React.createElement("div", {
    className: "guide-dayone__cols"
  }, columns.map((col, c) => React.createElement("ol", {
    key: c,
    start: c * half + 1
  }, col.map((s, j) => {
    var n = c * half + j + 1;
    return React.createElement("li", {
      key: s.name
    }, s.drive ? React.createElement("span", {
      className: "guide-dayone__drive"
    }, s.drive, " min drive") : null, React.createElement("div", {
      className: "guide-dayone__stop"
    }, React.createElement("span", {
      className: "guide-dayone__num" + (n === last ? " is-last" : ""),
      "aria-hidden": "true"
    }, n), React.createElement("span", {
      className: "guide-dayone__name"
    }, React.createElement("strong", null, s.name), React.createElement("span", null, s.sub)), React.createElement("span", {
      className: "guide-dayone__time"
    }, dayOneDuration(s.mins), s.anchor ? React.createElement("em", null, s.anchor) : null)), s.swap ? React.createElement("p", {
      className: "guide-dayone__swapcard"
    }, React.createElement("b", null, "Lot full? The swap is written in."), " It usually is between 10 a.m. and 4 p.m. Drive on in and catch Valley View on the way out. Lower angle, same valley.") : null);
  }))))), React.createElement("div", {
    className: "guide-dayone__photos"
  }, DAY_ONE_PHOTOS.map((p, i) => React.createElement("figure", {
    key: p.image,
    className: i === 0 ? "is-lead" : ""
  }, React.createElement(ResponsiveImage, {
    image: p.image,
    alt: p.alt,
    sizes: i === 0 ? "(max-width: 760px) 100vw, 480px" : "(max-width: 760px) 33vw, 280px"
  }), React.createElement("figcaption", null, React.createElement("span", null, p.n, " · ", p.label), p.line ? React.createElement("span", {
    className: "guide-dayone__line"
  }, p.line) : null)))), React.createElement("div", {
    className: "guide-dayone__close"
  }, React.createElement("p", null, "Every stop carries its parking, its timing and its swap. The app builds your day in this order, then keeps working where the signal stops."), React.createElement("div", {
    className: "guide-dayone__cta"
  }, React.createElement(BuyNowButton, {
    location: "guide_day_one"
  }), React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_day_one"
      });
    }
  }, "Read the free sample ↗"))), React.createElement("p", {
    className: "guide-dayone__credits"
  }, "Photos via Wikimedia Commons: Dexter Perkins (CC0), Kyle D (public domain), Mutineer (CC0), Anita Ritenour (CC BY 2.0). Map: U.S. National Park Service (public domain)."));
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
    src: "img/guide/screens/stop.v5.webp",
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
  }, "Works with zero bars"), React.createElement("ul", null, React.createElement("li", null, "· All 94 entries, each with a photo (some are stand-ins)"), React.createElement("li", null, "· All 57 hikes with tracks, elevation profiles and the daylight reading"), React.createElement("li", null, "· The topographic park map, every stop pinned"), React.createElement("li", null, "· The trip board, the day view, the dates that matter, and calendar export"), React.createElement("li", null, "· The Help card's position readout, the compass, and companion mode (GPS needs no data)"), React.createElement("li", null, "· Checklists, essentials, search, Quick ID, the Secret Guide"))), React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Needs signal"), React.createElement("ul", null, React.createElement("li", null, "· The live park webcams"), React.createElement("li", null, "· Entrance waits and parking-lot status right now"), React.createElement("li", null, "· Fresh weather and program updates (the last sync stays readable)"), React.createElement("li", null, "· The Nature Notes archive links back to this site")))), React.createElement("p", {
    className: "guide-offline__fineprint"
  }, "The full download is about 70 MB: the park map is roughly 20 MB of it, about 700 topographic tiles covering the whole park and the road corridors."));
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
  }, "In the Field Guide"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, freeLink("/articles", "articles", "Articles"), " and ", freeLink("/planning", "planning", "planning guides")), React.createElement("td", null, "The complete stop library: 94 entries across four regions")), React.createElement("tr", null, React.createElement("td", null, freeLink("/now", "now", "Current conditions")), React.createElement("td", null, "The whole guide offline, about 70 MB, plus the Help card, the compass and companion mode, which run on GPS with no bars")), React.createElement("tr", null, React.createElement("td", null, freeLink("/itineraries", "itineraries", "Selected itineraries")), React.createElement("td", null, "All 57 day hikes, each with a daylight reading, and the 50-entry Secret Guide")), React.createElement("tr", null, React.createElement("td", null, "The ", freeLink("/map", "map", "basic trip map")), React.createElement("td", null, "The full trip builder: drag-and-drop days, drive buffers, the dates that matter, calendar export")), React.createElement("tr", null, React.createElement("td", null, "The ", freeLink("/newsletter", "newsletter", "Sunday newsletter")), React.createElement("td", null, "18 months of silent updates as the season changes")))));
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
  }, React.createElement("li", null, React.createElement("strong", null, "Checkout runs through Stripe."), " Card or wallet. This site never sees or stores your card number."), React.createElement("li", null, React.createElement("strong", null, "The guide opens on this device, already signed in."), " Payment clears, the app opens, no code to type and no inbox to check."), React.createElement("li", null, React.createElement("strong", null, "An email follows: \"Your Field Guide is ready.\""), " It carries a sign-in link and a 6-digit code for your other devices. Phone at the trailhead, tablet in the car, laptop the night before. Both keep working for the full 18 months, so keep the email."), React.createElement("li", null, React.createElement("strong", null, "Add it to your home screen and tap the offline download."), " About 50 MB later the whole guide, map included, lives on the device.")), React.createElement("p", {
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
  a: "Yes. One tap downloads the whole guide, about 70 MB: every entry, the photos on file, all 57 hike tracks, and a topographic map of the park. A few entries still show a stand-in photo rather than the place itself. The Help card's position readout, the bearing compass and companion mode run on GPS, which needs no data. Only the live extras need signal: webcams, entrance waits, parking-lot status, and fresh weather and program updates."
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
  a: "The complete library: 94 entries including the 50-entry Secret Guide, all 57 day hikes with GPS tracks, elevation profiles and a daylight reading, the drag-and-drop trip builder with the dates that matter for your trip, the Help card, the bearing compass, companion mode, and the offline download. The free site keeps the articles, the trip map, the itineraries, and the conditions board."
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
    stashBuyLocation(location, false);
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
    var targets = [document.querySelector(".guide-hero-cta"), document.getElementById("guide-buy"), document.querySelector(".guide-closer"), document.querySelector(".site-footer")].filter(Boolean);
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
    stashBuyLocation("guide_mobile_bar", false);
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
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (aside) aside.scrollIntoView({
        behavior: reduce ? "auto" : "smooth"
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
var GUIDE_STATS = ["4 regions", "94 entries", "57 day hikes", "50 secret entries", "Works offline"];
function GuidePage({
  go
}) {
  return React.createElement("div", {
    className: "page hp-design hp-guide page--guide"
  }, React.createElement(HpGuideBand, {
    go: go,
    location: "guide_hero",
    heading: "h1",
    eyebrow: "THE FIELD GUIDE / OFFLINE APP / 2026 EDITION",
    title: "Three days in Yosemite. This is how you keep all three.",
    intro: "Written by a naturalist who lives in the park: which stops are worth your morning, where to park, how long each one honestly takes, and where to go the moment the lot fills. It builds each day in driving order, then downloads whole to your phone, topo map included, and keeps working where cell service doesn't, which is most of the park. Since September it also reads your GPS position to a dispatcher and names what you are passing.",
    points: null
  }, React.createElement("ul", {
    className: "hp-stats"
  }, GUIDE_STATS.map(stat => React.createElement("li", {
    key: stat
  }, stat))), React.createElement("div", {
    className: "guide-hero-cta"
  }, React.createElement(BuyNowButton, {
    location: "guide_hero"
  }), React.createElement("p", {
    className: "hp-terms"
  }, React.createElement(LivePrice, null), ", once. No subscription, 18 months on every device you own, refunded in full within 30 days if it does not work as described."), React.createElement("p", {
    className: "hp-terms"
  }, "Or", " ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_hero"
      });
    }
  }, "read the free sample first ↗"), " ", "Five complete entries from the real app, no account needed."))), React.createElement(GuideDayOne, null), React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "guide-layout"
  }, React.createElement("div", {
    className: "prose guide-prose"
  }, React.createElement("h2", null, "What a wrong morning costs"), React.createElement("p", null, "Yosemite charges its real fees in hours. The Glacier Point lot fills by mid-morning in July; arrive at ten and the hour of driving becomes three of circling. Miss the early window at the Mist Trail and the day reorganizes itself around a shuttle line. The $35 your car pays at the entrance covers seven days no matter what you do with them. What those days contain is decided by timing, and timing is exactly what a list of famous viewpoints doesn't give you."), React.createElement("p", null, "That's the problem this guide is built against. Time budgets tell you what actually fits before lunch. Swaps tell you where to go the second a lot is full. And because all of it lives on your phone and works without signal, the answer is there at the moment the day wobbles, which is never a moment with bars."), React.createElement("p", null, "The guide is ", React.createElement(LivePrice, null), ". Everything else about your trip costs more and decides less."), React.createElement("h2", null, "The picnic table in El Portal"), React.createElement("p", null, "This guide is the conversation you'd get if you sat across from me at a picnic table in El Portal and said, \"I have three days. Show me how to do this well.\" Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full."), React.createElement("p", null, "The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, and look up at El Capitan from the Yosemite Valley floor. You don't need those repeated in a different font. This guide assumes you've done that reading and starts where the lists stop: the parking, the timing, the order, and the fallback."), React.createElement("h2", null, "Sixty seconds inside the app"), React.createElement("p", null, "Five screens, in the order a trip actually uses them. These are unedited captures from the current 2026 build, the same one buyers open. Tap a step to hold it."), React.createElement(GuideWalkthrough, null), React.createElement("h2", null, "Every screen, unedited"), React.createElement("p", null, "The full set: ten screens from the current build, captured on a phone. What you see here is the product, not a mockup."), React.createElement(AppShots, null), React.createElement("h2", null, "New in the September 2026 build"), React.createElement("p", null, "The guide keeps changing after you buy it, and this is what the last month added. Eight more screens, captured the same way, from the same build."), React.createElement(AppShots, {
    shots: NEW_SHOTS
  }), React.createElement("p", null, "Not pictured, because a phone screen does not hold them well: the offline map now carries the park's infrastructure, the five entrances, the visitor and wilderness centers with their hours, the eighteen Valley shuttle stops numbered as the park numbers them, picnic areas, gas, EV charging, showers, laundry, stores and the clinic, every kind of pin drawn with its own mark, and a \"Go to\" row that flies the map to a region. The front page's conditions panel gained live parking-lot status, and the same status prints on the map's parking pins. The Secret Guide grew by thirteen entries, and every one of them, along with the ten new photographs, arrived as a silent update. Nothing here cost an existing buyer anything, and that is the arrangement for the rest of the 18 months."), React.createElement("h2", null, "What it does for the day"), React.createElement(GuideOutcomes, null), React.createElement("h2", null, "Read one stop, in full"), React.createElement("p", null, "This is the guide's first stop, quoted word for word from the app. Every one of the 94 entries is built this way: the numbers up top, the read underneath, the fallback printed on the page, and, where the record allows it, a sourced note from a century of park naturalists' field bulletins."), React.createElement(GuideStopExample, null), React.createElement("h2", null, "Turn the service off"), React.createElement("p", null, "Cell service dies at the Wawona Tunnel, on most of Glacier Point Road, and along nearly all of Tioga. The guide treats that as the normal case, not the failure case."), React.createElement(GuideOfflineDemo, null), React.createElement("h2", null, "The free site, and the guide"), React.createElement("p", null, "Everything this site publishes stays free: the articles, the trip map, the itineraries, the conditions board. The guide is not those pages repackaged. It is the field version: the complete library, the planner, and the offline download that makes both of them work standing in a pullout with no bars."), React.createElement(GuideCompare, {
    go: go
  }), React.createElement("p", {
    style: {
      marginTop: 24
    }
  }, React.createElement(BuyNowButton, {
    location: "guide_compare"
  })), React.createElement("h2", null, "The Secret Guide"), React.createElement("p", null, "There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, 50 entries in five numbered sections, quiet vistas, hidden trails, parking, camping and the park after dark, opening on a folio with its contents and every entry numbered across the whole set, every one marked in gold on the offline map. Thirteen of the fifty arrived in September: the Swinging Bridge reflection, Siesta Lake, Wawona Point, Union Point, Bennettville, the Yosemite Falls moonbow, the Glacier Point star parties, the great gray owl watch at Crane Flat, and the parking and camping moves around them. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge."), React.createElement("h2", null, "Who wrote it, and how"), React.createElement(GuideTrust, null), React.createElement("h2", null, "What happens when you tap the button"), React.createElement(GuideAfterPurchase, {
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
  }, "Four regional guides. 44 stops in driving order, each with GPS and a time budget, the flagship ones with a swap. All 57 in-park day hikes with GPS tracks, elevation profiles and a daylight reading. The 50-entry Secret Guide. The park's program schedule on your dates. A planning calendar you drag into shape, then save to the calendar you already use, with the dates that matter for your trip under it. A Help card, a bearing compass and a companion mode that run on GPS alone. And an offline topo map that holds it all together. ", React.createElement(LivePrice, null), ", once, for 18 months on every device you own."), React.createElement(BuyNowButton, {
    location: "guide_closer"
  }), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "14px 0 0"
    }
  }, "Checkout by Stripe. The guide opens signed in the moment payment clears. Prefer to look first?", " ", React.createElement("a", {
    href: `${GUIDE_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "guide_closer"
      });
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "Read the free sample →")))), GUIDE_ON_SALE ? React.createElement(GuideBuyBox, null) : React.createElement(GuideWaitlistBox, null))), React.createElement(HpLetter, {
    eyebrow: "FOR BUYERS AND READERS",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "A short note on Sundays. Subscribers hear about Field Guide updates, Secret Guide additions, and seasonal addenda first.",
    location: "guide_footer",
    tag: "guide"
  }), GUIDE_ON_SALE && React.createElement(GuideMobileBuyBar, null));
}
window.GuidePage = GuidePage;
