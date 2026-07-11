var GUIDE_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://talus-field-guide.pages.dev";
var GUIDE_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var GUIDE_PRICE_FALLBACK_CENTS = 1900;
function formatPrice(cents) {
  var dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
function readCheckoutOutcome() {
  try {
    var params = new URLSearchParams(window.location.search);
    var value = params.get("guide");
    return value === "success" || value === "cancel" ? value : null;
  } catch (_e) {
    return null;
  }
}
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
function GuideBuyBox() {
  var [busy, setBusy] = React.useState(false);
  var [soldOut, setSoldOut] = React.useState(null);
  var [error, setError] = React.useState(null);
  var [outcome] = React.useState(readCheckoutOutcome);
  var [priceCents, setPriceCents] = React.useState(GUIDE_PRICE_FALLBACK_CENTS);
  React.useEffect(() => {
    var cancelled = false;
    fetch(`${GUIDE_API_BASE}/api/inventory`).then(res => res.ok ? res.json() : null).then(body => {
      if (!cancelled && body && Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setPriceCents(body.priceCents);
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  async function startCheckout() {
    setBusy(true);
    setError(null);
    if (window.track) window.track("guide_buy_click", {
      location: "guide_aside"
    });
    try {
      var res = await fetch(`${GUIDE_API_BASE}/api/checkout/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
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
      marginBottom: 24
    }
  }, "Offline app · 2026 Edition"), outcome === "success" && React.createElement("p", {
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
  }, "open the app and sign in →")), outcome === "cancel" && React.createElement("p", {
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
  }, "This month's copies are gone. Sales reopen ", formatReopens(soldOut.reopens), ". The sign-up form at the bottom of the page will tell you when.") : React.createElement("button", {
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
      marginBottom: 14
    }
  }, busy ? "Opening checkout…" : `Buy the guide → ${formatPrice(priceCents)}`), error && React.createElement("p", {
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
  }, "One payment. The app, every photo, and the offline park map are yours for 18 months on every device you own. Updates push automatically through the 2026 season, including the Secret Guide as it grows."), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "12px 0 0"
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
  }, React.createElement("li", null, "· Four regional guides: the Valley, Glacier Point & Mariposa, Tuolumne, Hetch Hetchy"), React.createElement("li", null, "· Tappable GPS for every stop"), React.createElement("li", null, "· An offline topo map of the park, all stops pinned"), React.createElement("li", null, "· Download the whole guide for offline, about 45 MB"), React.createElement("li", null, "· Time budgets and a swap for when the lot is full"), React.createElement("li", null, "· Programs by your dates: ranger walks, Junior Ranger, tours, star parties. Synced online, readable offline"), React.createElement("li", null, "· A trip planner that exports your days to Google or Apple Calendar, GPS included"), React.createElement("li", null, "· Know-before-you-go essentials, a night-before checklist, and a packing list you check off in-app"), React.createElement("li", null, "· Search across everything"), React.createElement("li", null, "· The Secret Guide: unsigned turnouts, hidden stops, and secret spots, included"))), React.createElement("div", {
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
function GuidePage({
  go
}) {
  return React.createElement("div", {
    className: "page"
  }, React.createElement("section", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The Field Guide · Offline app · 2026 Edition"), React.createElement("h1", null, "The Yosemite guide for people who already know about Glacier Point."), React.createElement("p", {
    className: "page-head__dek"
  }, "A web app you add to your home screen. Four regional guides with tappable GPS, time budgets, a swap for when the plan dies, an offline topo map of the whole park, the ranger and partner program schedule on your dates, and a trip planner that exports straight to your calendar. Works at the trailhead when service doesn't. Not a PDF. Not another tourist checklist."))), React.createElement("div", {
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
  }), React.createElement("h2", null, "What this is, and what it isn't"), React.createElement("p", null, "The internet has a thousand free articles telling you to drive to Glacier Point, walk through the Mariposa Grove, stop at Tunnel View, and look up at El Capitan from the Yosemite Valley floor. You already know those exist. You don't need another website telling you the same thing in a different font."), React.createElement("p", null, "This guide assumes you've done that reading. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, \"I have three days. Show me how to do this well.\" Which stops are worth your morning, which can wait, where to park, how long each one actually takes, and what to do instead when the lot is full."), React.createElement("h2", null, "The regional guides"), React.createElement("p", null, "The guide is organized by where you are in the park, not how long you're staying. Pick the region you're heading to, read the stops in suggested order, and do the ones that fit your day."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Yosemite Valley & surrounding areas."), " The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall on El Capitan, the Mist Trail to Vernal and Nevada Falls, and the valley lodgings."), React.createElement("li", null, React.createElement("strong", null, "Glacier Point & the Mariposa Grove."), " The southern rim and the giant sequoias. Higher elevation, more driving, and the panoramas that put the whole valley below you. Closed in winter."), React.createElement("li", null, React.createElement("strong", null, "Tuolumne Meadows & the Highway 120 corridor."), " The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October."), React.createElement("li", null, React.createElement("strong", null, "Hetch Hetchy & the Evergreen Road corridor."), " The other granite valley, half of it under a reservoir, with its own entrance and day-use gate hours. Open year-round and nearly empty.")), React.createElement("h2", null, "What every stop gives you"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "A tappable GPS coordinate."), " Tap it and your Maps app opens with the line drawn for you. No copying, no typing."), React.createElement("li", null, React.createElement("strong", null, "A time budget."), " How long the stop actually takes, drive included. The kind of timing that prevents the late-afternoon scramble."), React.createElement("li", null, React.createElement("strong", null, "A swap."), " What to do when the lot is full, the road is closed, or the crowd beat you there. Each major stop lists its alternate."), React.createElement("li", null, React.createElement("strong", null, "The read."), " When to go, which direction to come from, and what most people get wrong. Written the way the articles on this site are written.")), React.createElement("h2", null, "The offline map"), React.createElement("p", null, "Every stop is pinned on a topographic map of the park that downloads to your device. The map is about 20 MB of the roughly 45 MB full offline download. Lose service past the tunnel, on Glacier Point Road, or anywhere along Tioga, and the map still pans, still zooms, and still shows you where the next stop is. Turn-by-turn driving stays in your Maps app; the guide hands you off with one tap."), React.createElement("h2", null, "The programs, on your dates"), React.createElement("p", null, "The park runs more than most visitors ever find out about: ranger walks, Junior Ranger tables, Conservancy naturalist programs and evening talks at Parsons Memorial Lodge, guided tours, and the summer nights when the astronomy clubs haul telescopes up to Glacier Point. The schedules live in a half-dozen places. The app pulls them into one list. Pick your trip dates, sync once while you have signal, and scroll your days: what's running, when, where, what's free, what needs a reservation. The list stays on your phone, so it still reads at a picnic table with no bars."), React.createElement("h2", null, "The trip planner"), React.createElement("p", null, "Add the stops you want and the programs you picked, and the app lays out each day: your stops in a sensible order with real time budgets, flowed around the programs' published times. Adjust anything. Then export the whole trip as a calendar file that drops into Google Calendar, Apple Calendar, or Outlook in one import. Every event carries the GPS coordinates and a directions link, so your calendar reminder at the trailhead is also the navigation."), React.createElement("h2", null, "Know before you go"), React.createElement("p", null, "The app ships with an essentials section: how entrance reservations work, how to get around the Valley without moving your car, what the bears actually want, where cell coverage dies, what the roads do by season, and a packing checklist you check off in the app the night before. A night-before checklist walks you through the downloads that make the whole trip work offline, including the Google Maps offline area that keeps turn-by-turn directions alive past the entrance station."), React.createElement("h2", null, "The Secret Guide"), React.createElement("p", null, "There is a section of the guide that never makes it into articles: the parking turnouts locals use when the big lots fill, the trailheads with no signs from the road, and the spots that belong to no region at all. It's in the app now, browsable by category, every stop marked in gold on the offline map. It keeps growing through the season, and every addition arrives as a silent update, no re-download, no second charge."), React.createElement("h2", null, "What's NOT inside"), React.createElement("p", null, "I think you should know what you're not getting before you pay."), React.createElement("ul", null, React.createElement("li", null, "This is not the standard tourist guide. If you want a list of the ten most famous viewpoints with the basic directions to each, every other Yosemite site already gives you that for free. This guide is what comes after that."), React.createElement("li", null, "It is not a children's activity book or a photography manual. Both could be their own books."), React.createElement("li", null, "It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both."), React.createElement("li", null, "It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.")), React.createElement("h2", null, "Who it's for"), React.createElement("p", null, "First-time visitors who want a real plan, not a list. Second-time visitors who came home from their first trip feeling like they'd missed the actual park and want to fix it. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it."), React.createElement("p", null, "If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it, you might not need the guide. The guide is for people who want the spreadsheet already built."), React.createElement("h2", null, "Format and delivery"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "A web app you add to your home screen."), " Looks and feels like a native app. It is not a PDF and not a printed book. No App Store, no install wait, no version to keep updated."), React.createElement("li", null, React.createElement("strong", null, "Works offline."), " One tap downloads the whole guide, every photo, and the park map to your device, about 45 MB. Lose service in the Valley or up at Tuolumne, the guide is still there."), React.createElement("li", null, React.createElement("strong", null, "Updates push silently through the 2026 season."), " New advice, route swaps, seasonal addenda, and Secret Guide additions all arrive without you re-downloading anything."), React.createElement("li", null, React.createElement("strong", null, "Pay once, sign in on every device you own."), " iPad in the car, iPhone at the trailhead, laptop the night before. Access lasts 18 months.")), React.createElement("h2", null, "One small promise"), React.createElement("p", null, "If the guide doesn't earn its place on your home screen, write to me and tell me why. I'd rather fix the trip that didn't work than pretend it did. The address is on the contact page."), React.createElement("p", null, "That's the offer. Nineteen dollars.")), React.createElement(GuideBuyBox, null))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingBottom: 96
    }
  }, React.createElement(NewsletterInline, {
    location: "guide_footer",
    tag: "guide",
    heading: "Sunday Field Notes",
    blurb: "A short note on Sundays. Subscribers hear about Field Guide updates, Secret Guide additions, and seasonal addenda first."
  })));
}
window.GuidePage = GuidePage;
