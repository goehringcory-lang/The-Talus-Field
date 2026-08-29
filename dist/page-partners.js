var PARTNERS_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var PARTNERS_PRICE_FALLBACK_CENTS = 399;
var PARTNERS_MAILTO = "mailto:cory@thetalusfieldjournal.com" + "?subject=" + encodeURIComponent("Group codes for the Field Guide") + "&body=" + encodeURIComponent(["Property:", "Town / area:", "Units or rooms:", "Roughly how many bookings a year:", "How you would hand out the codes (welcome email, in-room card, booking confirmation):", "", "Anything else worth knowing:"].join("\n"));
function formatPartnerPrice(cents) {
  var dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
function PartnersPage({
  go
}) {
  var [retailCents, setRetailCents] = React.useState(PARTNERS_PRICE_FALLBACK_CENTS);
  React.useEffect(() => {
    var cancelled = false;
    fetch(`${PARTNERS_API_BASE}/api/inventory`).then(res => res.ok ? res.json() : null).then(body => {
      if (cancelled || !body) return;
      if (Number.isFinite(body.priceCents) && body.priceCents > 0) {
        setRetailCents(body.priceCents);
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  var retail = formatPartnerPrice(retailCents);
  var trackContact = location => {
    if (window.track) window.track("partners_contact_click", {
      location
    });
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Group codes"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "For lodging and hospitality · group codes"), React.createElement("h1", null, "Give every guest the field guide."), React.createElement("p", {
    className: "page-head__dek"
  }, "The Talus Field Guide is the offline Yosemite app your guests wish they had found before they drove in: 44 stops with tappable GPS and real time budgets, all 57 in-park day hikes, the ranger program schedule on their dates, and a topo map of the park that works when service dies. Buy it in packs, hand a code to every booking, and it arrives as your amenity, not a link they found on their own."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "The problem this solves"), React.createElement("p", null, "Your guests arrive with a rough plan and one or two days to spend. They ask the front desk which entrance, whether Tioga is open, how long Glacier Point takes, where to park at eight in the morning, and what to do now that the lot is full. Your staff answers those questions all day, and the answers still arrive too late to change the trip."), React.createElement("p", null, "A guest who plans well has a better stay, blames the park less for what the park does anyway, and writes a better review. That is the whole argument. The guide is the part of the conversation your desk cannot have at scale, delivered before the guest leaves home and still working past the entrance station, where cell service ends."), React.createElement("h2", null, "What a group code is"), React.createElement("p", null, "One code is one guest's full access to the Field Guide: the entire stop library across the Valley, Glacier Point and Mariposa Grove, Tuolumne, and Hetch Hetchy, the 37-entry Secret Guide, the day-by-day trip planner with calendar export, park programs and weather on their dates, and the offline download, about 70 MB, that keeps all of it readable with no signal. Access runs 18 months from the day the guest redeems, on every device they own."), React.createElement("p", null, "There is nothing for you to install, host, or maintain. The guide is a web app, so there is no app store, no download for the guest to fail at, and no support burden landing on your desk. Codes are yours to hand out however you already reach guests: the booking confirmation, the pre-arrival email, a card in the room, the welcome packet, the check-in screen."))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 40,
      paddingBottom: 8
    }
  }, React.createElement("div", {
    className: "places-pitch"
  }, React.createElement("div", {
    className: "places-pitch__eyebrow"
  }, "Pricing"), React.createElement("h2", {
    className: "places-pitch__title"
  }, "What it costs"), React.createElement("p", {
    className: "places-pitch__lede"
  }, "The guide sells to the public at ", retail, " a copy. Subscription pricing for properties is quoted directly, because what a single vacation rental needs and what a management company running every booking needs are not the same number."), React.createElement("a", {
    className: "places-pitch__cta",
    href: PARTNERS_MAILTO,
    onClick: () => trackContact("partners_tiers")
  }, "Contact for pricing →"), React.createElement("p", {
    className: "places-pitch__fineprint"
  }, "Tell me the property, the town, and roughly how many bookings a year you would cover, and a quote comes back. The first properties are onboarded by hand, which is deliberate: it is how the terms get to be sensible for both sides."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 32,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "How it works"), React.createElement("ol", null, React.createElement("li", null, "Write, with your property, your area, and roughly how many bookings a year you would cover. A reply comes from a person in El Portal, not a sales team."), React.createElement("li", null, "Agree on the pricing that fits the property. You get an invoice, payable before the codes are issued."), React.createElement("li", null, "Codes are delivered as a spreadsheet plus a print-ready card for the room or the welcome packet, with your property named on it."), React.createElement("li", null, "Hand a code to each guest however you already talk to them. They redeem it, the guide opens, and their 18 months start that day.")), React.createElement("p", null, "Unredeemed codes stay yours. They do not expire on the shelf inside the season you bought them for, and a code that goes unused on one booking can go to the next guest instead."), React.createElement("h2", null, "What your guests actually get"), React.createElement("ul", null, React.createElement("li", null, "44 stops in driving order, each with GPS, a time budget, and a swap for when the lot is full or the plan dies."), React.createElement("li", null, "All 57 in-park day hikes with verified distance, elevation gain, difficulty, an elevation profile, and a GPS track."), React.createElement("li", null, "An offline topographic map of the whole park with every stop pinned, downloadable in one tap."), React.createElement("li", null, "A trip planner that lays out each day with real drive-time and parking buffers, and syncs to Google or Apple Calendar."), React.createElement("li", null, "Ranger walks, Junior Ranger sessions, tours, and star parties on the guest's own dates."), React.createElement("li", null, "An essentials section: entrance reservations, getting around the Valley without moving the car, bears, where coverage dies, roads by season, and a packing checklist for the night before."), React.createElement("li", null, "The Secret Guide: 37 unsigned turnouts, hidden stops, and spots that belong to no region at all.")), React.createElement("h2", null, "Why it is worth more than it costs"), React.createElement("p", null, "Against a room night, this is a rounding error. It is cheaper than the bottled water in the room and it is the only amenity on the property that changes how the trip goes. It is also differentiation that a competing hotel down the highway cannot copy by lowering a rate: the guide is written by one naturalist who lives in El Portal, and it is not for sale as a white-label product to everyone in town."), React.createElement("p", null, "The honest limit: this does not fill rooms by itself, and nobody books a hotel because of a guidebook. What it does is raise the quality of the stay you already sold, take repeat questions off your desk, and give your guests something to mention by name when they write about the trip."), React.createElement("h2", null, "The terms, plainly"), React.createElement("ul", null, React.createElement("li", null, "Paid by invoice, in advance. Terms are agreed in writing before anything is issued, and there is no minimum you have to commit to before we have talked."), React.createElement("li", null, "No revenue share, no commission, and no obligation to link to or recommend anything on this site."), React.createElement("li", null, "No exclusivity in either direction. Your neighbors can buy codes too, and you are free to stop at any time."), React.createElement("li", null, "Guest emails belong to your guests. Redemption is between the guest and the guide; their addresses are not sold, rented, or added to any marketing list because you bought the pack."), React.createElement("li", null, "The guide keeps getting updates through the access window at no additional charge, to you or to the guest."), React.createElement("li", null, "If the guide is ever discontinued, outstanding codes are refunded. That is a promise worth putting in writing, so it is in writing here.")), React.createElement("h2", null, "Questions that come up"), React.createElement("p", null, React.createElement("strong", null, "Do guests need to install anything?"), " No. The guide is a web app. It opens in the browser and can be added to a home screen in one step, which is what makes the offline download work."), React.createElement("p", null, React.createElement("strong", null, "Does a code work for a whole family?"), " One code is one guest account, usable on every device that guest owns, which covers a family traveling together. A group booking that wants a code per household should count households, not people."), React.createElement("p", null, React.createElement("strong", null, "What if a guest never redeems?"), " The code stays valid and you can give it to someone else. You are buying access, not a printed voucher that dies on the counter."), React.createElement("p", null, React.createElement("strong", null, "Can we brand it?"), " The card that goes in the room carries your property's name. The guide itself stays The Talus Field's, editorially and visually. That independence is the reason the recommendations inside it are worth anything to your guest.")), React.createElement("div", {
    style: {
      marginTop: 32,
      border: "1px solid var(--ink)",
      background: "var(--paper-2)",
      padding: 28
    }
  }, React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 15,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 14px"
    }
  }, "Tell me about the property and how you would hand the codes out. A quote comes back with the pricing that fits, and a sample card, so you can see the thing before you commit to anything."), React.createElement("a", {
    className: "btn",
    href: PARTNERS_MAILTO,
    onClick: () => trackContact("partners_footer"),
    style: {
      display: "inline-block",
      marginRight: 12
    }
  }, "Ask about group codes →"), React.createElement("a", {
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      trackContact("partners_contact_form");
      go("contact");
    },
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-2)"
    }
  }, "Or use the contact form →"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "14px 0 0"
    }
  }, "Want to see the product first? The public", " ", React.createElement("a", {
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      go("guide");
    }
  }, "Field Guide page"), " ", "is the full tour, and the app itself has a free sample of real entries, no account required.")), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 40
    }
  }, React.createElement("h2", null, "Two other things, both free"), React.createElement("p", null, "The", " ", React.createElement("a", {
    href: "/widget",
    onClick: e => {
      e.preventDefault();
      go("widget");
    }
  }, "conditions widget"), " ", "is a small box for your own site with live entrance waits and the three-day Valley forecast. One script tag, no account, no cost, and no connection to whether you ever buy a code. If you run a Yosemite-area business, a", " ", React.createElement("a", {
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "directory listing"), " ", "is the other door; the terms are on", " ", React.createElement("a", {
    href: "/advertise",
    onClick: e => {
      e.preventDefault();
      go("advertise");
    }
  }, "the listings page"), ".")), React.createElement(NewsletterInline, {
    location: "partners",
    tag: "partners",
    heading: "Run a Yosemite-area property?",
    blurb: "Sunday Field Notes carries what changed in the park each week, the same material your guests ask the front desk about. Free."
  })));
}
window.PartnersPage = PartnersPage;
