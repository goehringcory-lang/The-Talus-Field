var MEDIA_KIT_REACH = {
  window: "28 days, September 17 to October 14, 2026",
  impressions: 14540,
  clicks: 151,
  subscribers: 22,
  subscribersAsOf: "October 5, 2026",
  topPages: [{
    title: "Yosemite webcams",
    href: "/webcams",
    clicks: 12
  }, {
    title: "Half Dome lottery odds & strategy",
    href: "/half-dome-lottery",
    clicks: 11
  }, {
    title: "Yosemite gateway towns compared",
    href: "/articles/yosemite-gateway-towns-compared",
    clicks: 11
  }, {
    title: "Yosemite for non-hikers",
    href: "/articles/yosemite-for-non-hikers",
    clicks: 8
  }, {
    title: "Watching climbers on El Capitan",
    href: "/articles/watching-climbers-el-capitan",
    clicks: 8
  }]
};
var MEDIA_KIT_TIERS = [{
  name: "Standard listing",
  summary: "Name, area, blurb, outbound link in the relevant category.",
  term: "Twelve months",
  rate: "$300 a year"
}, {
  name: "Featured listing",
  summary: "Standard, plus a photo, an extended description, and priority position within the category.",
  term: "Twelve months",
  rate: "$600 a year",
  featured: true
}, {
  name: "Sunday letter sponsorship",
  summary: "A sponsorship of Sunday Field Notes, the weekly letter. Format agreed with the editor before it runs.",
  term: "By arrangement",
  rate: "Priced on inquiry"
}, {
  name: "Custom packages",
  summary: "A combination of the above, or a placement that does not fit them.",
  term: "By arrangement",
  rate: "Priced on inquiry"
}];
var mediaKitNumber = n => typeof n === "number" ? n.toLocaleString("en-US") : n;
function MediaKitPage({
  go
}) {
  var r = MEDIA_KIT_REACH;
  var stats = [r.impressions != null && {
    label: "Search impressions",
    value: mediaKitNumber(r.impressions)
  }, r.clicks != null && {
    label: "Search clicks",
    value: mediaKitNumber(r.clicks)
  }, r.subscribers != null && {
    label: r.subscribersAsOf ? `Letter subscribers, ${r.subscribersAsOf}` : "Letter subscribers",
    value: mediaKitNumber(r.subscribers)
  }].filter(Boolean);
  var trackContact = location => {
    if (window.track) window.track("media_kit_contact_click", {
      location
    });
  };
  var link = (route, label) => React.createElement("a", {
    className: "hp-inline",
    href: `/${route}`,
    onClick: e => {
      e.preventDefault();
      go(route);
    }
  }, label);
  return React.createElement("div", {
    className: "page hp-mediakit"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Advertise",
      route: "advertise"
    }, {
      label: "Media kit"
    }],
    className: "fj-head fj-topo",
    eyebrow: "MEDIA KIT",
    title: "Who reads The Talus Field, and how to reach them.",
    intro: "The Talus Field is an independent Yosemite journal and field guide, written by a naturalist who lives at the park's western edge. Its readers are planning a trip. This page sets out who they are, how they find it, when they come, and the placements open to operators who would send a friend to their own business.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "media_kit_head",
      className: "hp-button",
      href: "#mk-placements"
    }, "Placements and rates ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "media_kit_head",
      className: "hp-link",
      href: "#mk-book"
    }, "How to book ↓")),
    aside: React.createElement(FjCard, {
      eyebrow: "THE KIT, IN FOUR LINES",
      stamp: React.createElement(React.Fragment, null, "Every paid", React.createElement("br", null), "placement", React.createElement("br", null), "labeled"),
      rows: [{
        label: "Readers",
        value: "Yosemite trip planners"
      }, {
        label: "Formats",
        value: "Directory listings, the Sunday letter"
      }, {
        label: "Reviewed",
        value: "Before it goes live"
      }, {
        label: "Rate",
        value: "From $300 a year"
      }]
    })
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    "aria-labelledby": "mk-readers"
  }, React.createElement(HpHeading, {
    id: "mk-readers",
    eyebrow: "01 / THE READER",
    title: "Who reads"
  }), React.createElement("div", {
    className: "hp-mediakit__cols"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "People planning a Yosemite trip, most of them before they have booked it. The catalog is built around the decisions a visit turns on: where to sleep inside the park or in a gateway town, how to get in without a reservation, which permits and lotteries to enter, which hikes fit the days and the legs available, and what the park will be doing the week they arrive."), React.createElement("p", {
    className: "hp-sub"
  }, "The site does not survey its readers and publishes no demographics. What it can say is what they come for. First-time visitors read the planning guides and the start-here pages; returning visitors read the trail guides, the high country and the seasonal pages; families, travelers with dogs, visitors from abroad and readers without a car each have their own guides. Every one of them is reading with dates in mind.")), React.createElement("ul", {
    className: "hp-mediakit__intents"
  }, React.createElement("li", null, React.createElement("b", null, "Planning"), React.createElement("span", null, "Lodging, gateway towns, reservations, getting there, cost.")), React.createElement("li", null, React.createElement("b", null, "Hikes and permits"), React.createElement("span", null, "Day hikes, Half Dome, wilderness permits, backpacking.")), React.createElement("li", null, React.createElement("b", null, "Season"), React.createElement("span", null, "Fall color, the firefall, waterfalls, snow, the Tioga Road opening.")), React.createElement("li", null, React.createElement("b", null, "The park now"), React.createElement("span", null, "Conditions, road alerts, webcams, entrance waits, the Park Bulletin.")))), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    "aria-labelledby": "mk-reach"
  }, React.createElement(HpHeading, {
    id: "mk-reach",
    eyebrow: "02 / REACH",
    title: "Reach"
  }), React.createElement("p", {
    className: "hp-sub hp-mediakit__window"
  }, "Google Search, ", r.window, "."), stats.length > 0 ? React.createElement("dl", {
    className: "hp-mediakit__stats"
  }, stats.map(s => React.createElement("div", {
    key: s.label
  }, React.createElement("dt", null, s.label), React.createElement("dd", null, s.value)))) : React.createElement("p", {
    className: "hp-sub"
  }, "Current search and list figures are sent with every reply to an inquiry."), r.topPages.length > 0 && React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "hp-mediakit__h3"
  }, "The pages search sent the most readers to"), React.createElement("ol", {
    className: "hp-mediakit__top"
  }, r.topPages.map(p => React.createElement("li", {
    key: p.href
  }, React.createElement(HomeLink, {
    go: go,
    location: "media_kit_reach",
    href: p.href
  }, p.title), p.clicks != null && React.createElement("span", null, mediaKitNumber(p.clicks), " clicks"))))), React.createElement("h3", {
    className: "hp-mediakit__h3"
  }, "Sunday Field Notes"), React.createElement("p", {
    className: "hp-sub"
  }, "The weekly letter goes out on Sunday at 9 AM Pacific: what the park is doing that week and why, set beside what its naturalists wrote down in the same weeks a century ago. It is free, single opt-in, and read by people who asked for it. ", link("newsletter", "Read about the letter"), ".")), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    "aria-labelledby": "mk-guide"
  }, React.createElement(HpHeading, {
    id: "mk-guide",
    eyebrow: "03 / THE APP",
    title: "The Field Guide"
  }), React.createElement("div", {
    className: "hp-mediakit__cols"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "The journal's paid companion is an offline field guide at ", React.createElement("a", {
    className: "hp-inline",
    href: "https://guide.thetalusfieldjournal.com",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "guide.thetalusfieldjournal.com"), ": the park's stops, day hikes and lesser-known places with GPS coordinates and honest time budgets, a trip planner that builds each day in driving order, and park programs on the dates of a trip. Its buyers have committed to a visit and paid to plan it well."), React.createElement("p", {
    className: "hp-sub"
  }, "The Field Guide carries no advertising and sells no placements. It is described here because its readers are the same readers, and because a business in the directory sits one link from a guide they trust. Lodging operators who want the guide for their own guests can buy it in packs: ", link("partners", "group codes"), ". The public product page is ", link("guide", "the Field Guide"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    id: "mk-placements",
    tabIndex: -1,
    "aria-labelledby": "mk-placements-h"
  }, React.createElement(HpHeading, {
    id: "mk-placements-h",
    eyebrow: "04 / FORMATS",
    title: "Placements and formats"
  }), React.createElement("div", {
    className: "hp-mediakit__tiers"
  }, MEDIA_KIT_TIERS.map(t => React.createElement("div", {
    key: t.name,
    className: ["places-pitch__tier", t.featured ? "places-pitch__tier--featured" : null].filter(Boolean).join(" ")
  }, React.createElement("div", {
    className: "places-pitch__tier-eyebrow"
  }, t.name), React.createElement("div", {
    className: "places-pitch__tier-summary"
  }, t.summary), React.createElement("div", {
    className: "places-pitch__tier-meta"
  }, t.term, " · ", t.rate)))), React.createElement("p", {
    className: "hp-sub hp-mediakit__note"
  }, "Every listing carries the business name, its area, a short editorial blurb, a direct outbound link to the booking page and a place in the relevant directory category, for twelve months and renewable. The full terms are on ", link("advertise", "the listings page"), ".")), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    "aria-labelledby": "mk-season"
  }, React.createElement(HpHeading, {
    id: "mk-season",
    eyebrow: "05 / TIMING",
    title: "When planners are searching"
  }), React.createElement("p", {
    className: "hp-sub hp-mediakit__lede"
  }, "A Yosemite trip is planned around windows the park sets, and readers arrive ahead of each one. A twelve-month listing sits through all of them."), React.createElement("ol", {
    className: "hp-mediakit__calendar"
  }, React.createElement("li", null, React.createElement("b", null, "February"), React.createElement("span", null, "The firefall on Horsetail Fall. The dates are fixed by the sun, and Valley rooms and the nearest gateway towns fill around them. ", link("firefall", "The Firefall"))), React.createElement("li", null, React.createElement("b", null, "March to April"), React.createElement("span", null, "The Half Dome preseason lottery takes applications through March, with results in mid-April; summer plans are made on the result. ", link("half-dome-lottery", "The Half Dome lottery"))), React.createElement("li", null, React.createElement("b", null, "Late spring"), React.createElement("span", null, "The Tioga Road opening, announced only days ahead, sends readers to the high country and the east side. ", link("tioga-opening", "The Tioga Road opening"))), React.createElement("li", null, React.createElement("b", null, "Summer"), React.createElement("span", null, "The peak season: daily Half Dome lotteries, wilderness permits, campground release mornings, and the lodging decision under the most pressure. ", link("dates", "The dates that matter"))), React.createElement("li", null, React.createElement("b", null, "Autumn"), React.createElement("span", null, "Fall color, from the Tioga Road aspens in late September to the Valley's peak in late October; quieter trails and shoulder-season rooms. ", link("fall-color", "Fall color"))), React.createElement("li", null, React.createElement("b", null, "Winter"), React.createElement("span", null, "Snow in the Valley, the holiday events and the ski area, and the readers already planning the next spring and summer.")))), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    "aria-labelledby": "mk-samples"
  }, React.createElement(HpHeading, {
    id: "mk-samples",
    eyebrow: "06 / SAMPLES",
    title: "Sample placements"
  }), React.createElement("p", {
    className: "hp-sub hp-mediakit__lede"
  }, "How the two listing tiers read in the directory. The names and copy below are placeholders, not operators."), React.createElement("div", {
    className: "hp-mediakit__samples",
    "aria-label": "Sample listings"
  }, React.createElement("article", {
    className: "hp-mediakit__sample"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "LODGING · GATEWAY TOWN", React.createElement("span", {
    className: "hp-mediakit__label"
  }, "Paid listing")), React.createElement("h3", null, "Your business name"), React.createElement("p", null, "A short editorial blurb, written by the editor in the site's voice: what the place is, who it suits, and the one thing a reader should know before booking."), React.createElement("b", null, "Book direct ↗"), React.createElement("p", {
    className: "hp-mediakit__tierline"
  }, "Standard listing")), React.createElement("article", {
    className: "hp-mediakit__sample hp-mediakit__sample--featured"
  }, React.createElement("span", {
    className: "hp-mediakit__photo",
    "aria-hidden": "true"
  }, "Your photo"), React.createElement("p", {
    className: "hp-eyebrow"
  }, "GUIDES & INSTRUCTION · YOSEMITE VALLEY", React.createElement("span", {
    className: "hp-mediakit__label"
  }, "Paid listing")), React.createElement("h3", null, "Your business name"), React.createElement("p", null, "The same editorial blurb, followed by an extended description: the programs or rooms, the season, how to reach the operator, and what sets the business apart. Listed first within its category."), React.createElement("b", null, "Book direct ↗"), React.createElement("p", {
    className: "hp-mediakit__tierline"
  }, "Featured listing")))), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section fj-split",
    "aria-labelledby": "mk-standards"
  }, React.createElement("div", null, React.createElement(HpHeading, {
    id: "mk-standards",
    eyebrow: "07 / STANDARDS",
    title: "Editorial standards and disclosure"
  })), React.createElement("div", {
    className: "hp-mediakit__copy"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "Paid placements are clearly labeled wherever they appear, and a paid placement does not change the editorial blurb. An operator does not get a more flattering description by paying. If a listing ever drops below the standard, it comes off the directory."), React.createElement("ul", {
    className: "hp-mediakit__rules"
  }, React.createElement("li", null, "No businesses the editor would talk a friend out of using."), React.createElement("li", null, "No hidden sponsorship. Every paid placement is labeled."), React.createElement("li", null, "No payment overriding the editorial tone of a blurb."), React.createElement("li", null, "No placements from operators with active permit or safety violations.")), React.createElement("p", {
    className: "hp-sub"
  }, "The same rule governs the site's affiliate links: no program's catalog shapes a recommendation. The full policy is on ", link("affiliate", "the disclosure page"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section hp-mediakit__section",
    id: "mk-book",
    tabIndex: -1,
    "aria-labelledby": "mk-book-h"
  }, React.createElement(HpHeading, {
    id: "mk-book-h",
    eyebrow: "08 / BOOKING",
    title: "How to book"
  }), React.createElement("ol", {
    className: "hp-mediakit__steps"
  }, React.createElement("li", null, React.createElement("b", null, "Write in."), React.createElement("span", null, "Send the business name, its area, the category, and the placement you have in mind to ", React.createElement("a", {
    className: "hp-inline",
    href: "mailto:cory@thetalusfieldjournal.com",
    onClick: () => trackContact("media_kit_email")
  }, "cory@thetalusfieldjournal.com"), ", or use ", React.createElement("a", {
    className: "hp-inline",
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      trackContact("media_kit_contact_form");
      go("contact");
    }
  }, "the contact form"), ".")), React.createElement("li", null, React.createElement("b", null, "Review."), React.createElement("span", null, "Every paid placement is reviewed before it goes live. The editor writes the blurb.")), React.createElement("li", null, React.createElement("b", null, "Placement."), React.createElement("span", null, "The listing runs for twelve months and is renewable. Sunday letter sponsorships and custom packages are scheduled by arrangement."))), React.createElement("p", {
    className: "hp-mediakit__cta"
  }, React.createElement("a", {
    className: "hp-button",
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      trackContact("media_kit_book");
      go("contact");
    }
  }, "Inquire about a placement"))), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "A letter from inside Yosemite on Sundays: what the park is doing this week and why, set beside what its naturalists wrote down in the same weeks a century ago."
  }));
}
window.MediaKitPage = MediaKitPage;
