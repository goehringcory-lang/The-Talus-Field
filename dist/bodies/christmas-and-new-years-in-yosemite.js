window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["christmas-and-new-years-in-yosemite"] = function ChristmasAndNewYearsInYosemiteBody() {
  var TOC = [["#cny-calendar", "The calendar"], ["#cny-crowds", "The crowd"], ["#cny-lodging", "Where to sleep"], ["#cny-open", "What is open"], ["#cny-badger", "Badger Pass"], ["#cny-chains", "Chains"], ["#cny-plan", "Three plans"], ["#cny-questions", "Questions"]];
  var FAQ = [["Is Yosemite open on Christmas Day?", "Yes. The Park Service says Yosemite is open 24 hours a day, 365 days a year. Yosemite Valley and Wawona are reachable by car all year, though Tioga Road and most of Glacier Point Road are closed by snow, and chains may be required on any day."], ["What is there to do in Yosemite for New Year's Eve?", "Yosemite Hospitality lists two parties on December 31, 2026: the Ahwahnee's New Year's Eve Dinner Dance, 8:30 pm to 12:30 am, $299 for adults and $149 for children, and a party in the Mountain Room at Yosemite Valley Lodge, 6 pm to 12:30 am, $75 for adults and $40 for children under 12, with tickets sold on site the day of the party."], ["When is the Bracebridge Dinner in 2026?", "Yosemite Hospitality lists eight nights at the Ahwahnee: December 8, 10, 12, 14, 16, 18, 20 and 22, 2026. There is no performance on Christmas Eve or Christmas Day. As of mid-October, December 12 was marked sold out."], ["Will Badger Pass be open for Christmas?", "Nobody knows yet. The concessioner describes the season as mid-December to mid-March, conditions permitting, but Badger Pass did not open at all in the 2024 to 2025 winter and opened on January 16 in 2026. No 2026 to 2027 opening date had been announced as of October 18, 2026. Call the Snow Phone, 209-372-1000."], ["Do I need chains to visit Yosemite at Christmas?", "You must carry them. When chain controls are in effect in the park, every vehicle must have chains in it, including four-wheel drives and rental cars, and failing to put them on when required can bring a citation of up to $5,000. The park strongly recommends chains from November through March."], ["Is Curry Village open over Christmas?", "Yosemite Hospitality says Curry Village will not be open from November 29 through December 10, 2026, which leaves it open for the holiday weeks. Its heated tent cabins have heat in winter but no plumbing."]];
  var CALENDAR = [{
    day: "December 8 to 22",
    what: "The Bracebridge Dinner at the Ahwahnee, on alternate nights: December 8, 10, 12, 14, 16, 18, 20 and 22."
  }, {
    day: "Mid-December",
    what: "The published start of the Badger Pass season and the plowed road to it, conditions permitting."
  }, {
    day: "December 24",
    what: "Christmas Eve service at the Yosemite Valley Chapel, 4 to 5 pm, by the chapel's listing.",
    glow: true
  }, {
    day: "December 25",
    what: "The park is open, as on every day of the year."
  }, {
    day: "December 31, 6 pm",
    what: "New Year's Eve in the Mountain Room, Yosemite Valley Lodge. Tickets on site that day."
  }, {
    day: "December 31, 8:30 pm",
    what: "The Ahwahnee's New Year's Eve Dinner Dance, to 12:30 am.",
    glow: true
  }, {
    day: "December 31, 10 pm",
    what: "New Year's Watch Night service, with communion, at the chapel."
  }];
  var PARTIES = [{
    name: "The Ahwahnee's New Year's Eve Dinner Dance",
    where: "The Ahwahnee",
    when: "8:30 pm to 12:30 am",
    price: "$299 adults, $149 children",
    inc: "A coursed meal, a live band, a champagne toast, party favors, a take-home champagne glass and a portrait",
    book: "Not yet on sale in mid-October; 888-413-8869"
  }, {
    name: "New Year's Eve at Yosemite Valley Lodge",
    where: "The Mountain Room",
    when: "6 pm to 12:30 am",
    price: "$75 adults, $40 children under 12",
    inc: "Food all night, a live band from 9 pm to midnight, a champagne toast",
    book: "Tickets on site the day of the party"
  }];
  var BADGER = [{
    when: "The published season",
    name: "Mid-December to mid-March",
    cls: "is-peak",
    text: "Conditions permitting, lifts 9 am to 4 pm. The road is plowed to the ski area from mid-December through early April."
  }, {
    when: "2024 to 2025",
    name: "Never opened",
    cls: "is-mid",
    text: "Announced February 11, 2025: too little snow early enough in the season. Season passes were refunded."
  }, {
    when: "2025 to 2026",
    name: "January 16 to March 18",
    cls: "is-late",
    text: "The lifts opened January 16, 2026, after a planned January 9 Nordic opening, and closed March 18, about 60 days in all."
  }];
  return React.createElement("div", {
    className: "cny-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "food"
  }), React.createElement("dt", null, "Bracebridge"), React.createElement("dd", null, "December 8 to 22, alternate nights")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "New Year's Eve"), React.createElement("dd", null, "Two parties, the Ahwahnee and the Lodge")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("dt", null, "Badger Pass"), React.createElement("dd", null, "Mid-December at the earliest, not promised")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("dt", null, "Chains"), React.createElement("dd", null, "Every vehicle must carry them"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section cny-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "The two weeks around Christmas and New Year's are the one stretch of the Yosemite winter that behaves like summer. The Park Service says the park \"may be very busy during winter holidays, especially in late December and early January,\" with traffic congestion and limited parking. The difference from summer is everything else: short days, a park mostly under snow, two roads closed, chains in the trunk, and a ski area that opens when the storms decide."), React.createElement("p", null, "What the season does offer is a small, fixed calendar. The Bracebridge Dinner runs at the Ahwahnee on the evenings before Christmas, the chapel holds a Christmas Eve service, and New Year's Eve has two parties in the Valley. Around those, it is the winter park: the Valley floor, Tunnel View, the ice rink at Curry Village, and Badger Pass if there is snow."), React.createElement("p", null, "Every date and price below comes from the concessioner's or the Park Service's own pages, read in October 2026. Several of them change before December. Confirm with the source before you build a trip on one.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Book the room first. In-park lodging opens 366 days ahead, and the Park Service names holidays as the time to book early."), React.createElement("li", null, "Bracebridge ends December 22. Nothing is staged on Christmas Eve or Christmas Day."), React.createElement("li", null, "Do not plan Christmas around Badger Pass. It opened in mid-January last winter and not at all the winter before."), React.createElement("li", null, "Carry chains in every vehicle, rentals included.")), React.createElement("a", {
    className: "cny-short__link",
    href: "#cny-calendar"
  }, "The fortnight, date by date ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "cny-calendar",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CALENDAR"), React.createElement("h2", null, "What happens, and on which night"), React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The Bracebridge Dinner."), " The Ahwahnee's Old English dinner pageant runs on eight nights in 2026, by Yosemite Hospitality's ticket page: December 8, 10, 12, 14, 16, 18, 20 and 22. The last performance is three days before Christmas. In mid-October the page marked December 12 sold out and December 8 and 18 almost sold out, and the December 12 lodging packages were gone at all three hotels. Pre-dinner festivities in the Great Lounge run from 4 to 6 pm, gratuity is included in the ticket, and the page asks for at least a dark suit or cocktail dress, and no costumes. The page prints no ticket price. What it is and whether it is worth it are in ", React.createElement("a", {
    href: "/articles/bracebridge-dinner-and-vintners-holidays"
  }, "the Bracebridge Dinner and Vintners' Holidays guide"), "."), React.createElement("p", null, React.createElement("strong", null, "Christmas Eve and Christmas Day."), " The Yosemite Valley Chapel lists a Christmas Eve service from 4 to 5 pm, as recorded in our guide to ", React.createElement("a", {
    href: "/articles/worship-in-yosemite"
  }, "worship in Yosemite"), "; the chapel's own service page would not load for us this week, so confirm with the church office at 209-372-4831. On Christmas Day itself, nothing is staged. The park is open, as it is every day: the Park Service says Yosemite is open 24 hours a day, 365 days a year. The concessioner's holiday events page lists Thanksgiving, Vintners' Holidays, the Bracebridge Dinner and New Year's Eve, and no Christmas Day dinner. If you want a table on December 25, ask the restaurant when you book the room."), React.createElement("p", null, React.createElement("strong", null, "New Year's Eve."), " Two parties, both on December 31. The Ahwahnee's New Year's Eve Dinner Dance runs from 8:30 pm to 12:30 am, at $299 for adults and $149 for children, with a coursed meal, a live band, a champagne toast, party favors, a champagne glass to take home and a portrait; elegant attire is encouraged. In mid-October the Mariposa County visitors bureau listing said bookings would open soon, and the menu was marked coming soon. The cheaper night is in the Mountain Room at Yosemite Valley Lodge, from 6 pm to 12:30 am, at $75 for adults and $40 for children under 12, with food all night, a band from 9 pm to midnight and a champagne toast. Its tickets are sold on site the day of the party. The chapel's Watch Night service, with communion, starts at 10 pm."))), React.createElement("div", null, React.createElement("h3", {
    className: "cny-sched__head"
  }, "The fortnight, by the published calendars"), React.createElement("ol", {
    className: "ff-hours cny-sched"
  }, CALENDAR.map(c => React.createElement("li", {
    key: c.day,
    className: c.glow ? "is-glow" : undefined
  }, React.createElement("span", null, c.day), React.createElement("p", null, c.what)))), React.createElement("p", {
    className: "ff-alert cny-alert"
  }, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("span", null, React.createElement("strong", null, "No Bracebridge at Christmas."), " The 2026 run ends on December 22. A trip booked for Christmas week to see it arrives too late.")))), React.createElement("div", {
    className: "cny-parties"
  }, PARTIES.map(p => React.createElement("article", {
    key: p.name,
    className: "cny-party"
  }, React.createElement("p", {
    className: "cny-party__when"
  }, "December 31 · ", p.when), React.createElement("h3", null, p.name), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Where"), React.createElement("dd", null, p.where)), React.createElement("div", null, React.createElement("dt", null, "Price"), React.createElement("dd", null, p.price)), React.createElement("div", null, React.createElement("dt", null, "Includes"), React.createElement("dd", null, p.inc)), React.createElement("div", null, React.createElement("dt", null, "Booking"), React.createElement("dd", null, p.book)))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cny-crowds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CROWD"), React.createElement("h2", null, "The busiest week of the winter"), React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, "The Park Service's winter page puts it plainly: late December and early January are when the winter park is busiest, with traffic congestion and limited parking possible. The Valley's lots behave more like a summer weekend than a winter weekday that week. Arrive early, park once, and use the free shuttle; the park lists the Valleywide route every 12 to 22 minutes from 7 am to 10 pm. ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "The parking guide"), " covers which lots fill first."), React.createElement("p", null, React.createElement("strong", null, "The fee."), " A private vehicle pays $35 at the gate, valid for seven consecutive days. Visitors who are not US residents, aged 16 and older, pay a further $100 each unless they enter on an annual or America the Beautiful pass. None of the park's 2026 fee-free days falls in December or January. The fee page we read says nothing of an entry reservation for this winter, so check the park's alerts before you go."), React.createElement("p", null, React.createElement("strong", null, "The hotel company's calendar says the same thing."), " Its current winter offers (Ahwahnee rooms from $389 on select two-night stays, Yosemite Valley Lodge from $172 for two nights or more, Curry Village from $95 a night) print no dates on the offers page. Last winter's Ahwahnee offer, as listed by the Mariposa County visitors bureau, blacked out December 10, 2025, through January 3, 2026. Expect the holidays to sell at full price, and read the terms of this winter's offers before you count on one."))), React.createElement("figure", {
    className: "cny-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/ahwahnee-great-lounge-evening.jpg",
    style: {
      aspectRatio: "1600 / 1064"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The Ahwahnee's Great Lounge in the evening, its tall windows and timbered ceiling lit from inside"
  }), React.createElement("figcaption", null, "The Ahwahnee's Great Lounge, where the Bracebridge evening begins. Photo: Jerrye and Roy Klotz / Wikimedia Commons (CC BY-SA 3.0)")))), React.createElement("section", {
    className: "ff-band",
    id: "cny-lodging",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE TO SLEEP"), React.createElement("h2", null, "Book the room before anything else"), React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, "The Park Service says in-park lodging reservations open 366 days ahead and are strongly recommended, \"especially from spring through fall and during holidays.\" For a holiday trip, that makes the room the first booking and everything else the second. If your dates are already sold out, cancellations are the route in; check back often."), React.createElement("p", null, React.createElement("strong", null, "The Ahwahnee and Yosemite Valley Lodge"), " are open all year, and they hold the two New Year's Eve parties. ", React.createElement("strong", null, "Curry Village"), " closes early in the season, from November 29 through December 10, 2026, by the concessioner's page, and is open again for the holidays. Its heated tent cabins have heat from the Tuesday after Labor Day to the Friday before Memorial Day, and one electrical outlet, but no plumbing, so the bathroom is a walk on what may be an icy path. ", React.createElement("strong", null, "The Wawona Hotel"), " is closed for a condition assessment with no reopening date, and Housekeeping Camp is a seasonal operation. The full comparison is in ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay in Yosemite"), "."), React.createElement("p", null, React.createElement("strong", null, "Camping."), " The park lists four campgrounds open all year: Upper Pines, Camp 4, Wawona and Hodgdon Meadow. Upper Pines books five months ahead on the 15th, so holiday dates went on sale in summer, and by now a site is a cancellation. Plan on nights below freezing and a tent that can take snow."), React.createElement("p", null, React.createElement("strong", null, "Outside the park."), " Highway 140 through Mariposa and El Portal is the one approach the YARTS bus runs all year, which is a reason to look there first in winter. The town-by-town picture is on ", React.createElement("a", {
    href: "/stay"
  }, "the lodging board"), "."))), React.createElement("div", null, React.createElement("figure", {
    className: "cny-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/curry-village.jpg",
    style: {
      aspectRatio: "1600 / 1072"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Cabins at Curry Village under the trees on the Yosemite Valley floor"
  }), React.createElement("figcaption", null, "Curry Village, closed November 29 to December 10, 2026, and open for the holidays. Photo: US National Park Service / Wikimedia Commons (public domain)")), React.createElement("article", {
    className: "ff-inpark cny-book"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IN-PARK LODGING"), React.createElement("h3", null, "Over the holidays"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "The Ahwahnee"), React.createElement("dd", null, "Open all year")), React.createElement("div", null, React.createElement("dt", null, "Yosemite Valley Lodge"), React.createElement("dd", null, "Open all year")), React.createElement("div", null, React.createElement("dt", null, "Curry Village"), React.createElement("dd", null, "Closed Nov 29 to Dec 10, then open")), React.createElement("div", null, React.createElement("dt", null, "Wawona Hotel"), React.createElement("dd", null, "Closed, no reopening date")), React.createElement("div", null, React.createElement("dt", null, "Window"), React.createElement("dd", null, "366 days ahead"))), React.createElement("p", {
    className: "ff-note"
  }, "Book through Yosemite Hospitality at travelyosemite.com or 888-413-8869.")))), React.createElement("div", {
    className: "cny-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "When the Valley is full for the holidays",
    note: "The Ahwahnee, Yosemite Valley Lodge and Curry Village book through Yosemite Hospitality, a year and a day ahead, and holiday dates go first. If yours are gone, a search shows what is left within driving distance.",
    list: "article_cta",
    slug: "christmas-and-new-years-in-yosemite",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cny-open",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT IS OPEN"), React.createElement("h2", null, "The holiday park is the Valley and Wawona"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Open by car."), " The Park Service says Yosemite Valley and Wawona are accessible by car all year. Those two are the holiday trip."), React.createElement("p", null, React.createElement("strong", null, "Closed."), " Tioga Road is closed, usually by sometime in November. Glacier Point Road is closed past Badger Pass: from mid-December through early April the park plows it only as far as the ski area, so the drive-up view from Glacier Point is not part of a holiday visit. The Mariposa Grove road usually opens sometime in April; in winter the grove is a walk, by the two-mile Washburn Trail from the Welcome Plaza. ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "The Mariposa Grove guide"), " has the walk-in plan."), React.createElement("p", null, React.createElement("strong", null, "The ice rink."), " The Curry Village rink is the winter activity that needs no snow. Its page lists daily sessions from noon to 2:30 pm, 3:30 to 6 pm and 7 to 9:30 pm, with an extra 8:30 to 11 am session on weekends and holidays. In mid-October the page said the 2026 to 2027 opening date was still to be determined, and it printed no prices; the rink's line is 209-372-8210."), React.createElement("p", null, React.createElement("strong", null, "The trails."), " The park says some Valley trails are often accessible in winter. The winter closures of the steeper routes vary from year to year; ", React.createElement("a", {
    href: "/articles/yosemite-in-december"
  }, "the December guide"), " has the record, and the conditions page the week you go is the only reliable word.")), React.createElement("ul", {
    className: "ff-rules cny-status"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "check",
    size: 26
  }), React.createElement("strong", null, "Yosemite Valley and Wawona."), React.createElement("p", null, "Reachable by car all year.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Tioga Road."), React.createElement("p", null, "Closed, usually by sometime in November.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Glacier Point."), React.createElement("p", null, "Road plowed only to Badger Pass, mid-December through early April.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "walk",
    size: 26
  }), React.createElement("strong", null, "Mariposa Grove."), React.createElement("p", null, "On foot, two miles by the Washburn Trail."))))), React.createElement("section", {
    className: "ff-band",
    id: "cny-badger",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BADGER PASS TIMING"), React.createElement("h2", null, "Mid-December on paper, January in the last two winters"), React.createElement("ol", {
    className: "cny-seasons"
  }, BADGER.map(s => React.createElement("li", {
    key: s.when,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split cny-when"
  }, React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, "The concessioner describes the Badger Pass downhill season as mid-December to mid-March, depending on conditions, with the lifts running daily from 9 am to 4 pm. The Park Service plows Glacier Point Road to the ski area from mid-December through early April, and its free shuttle from the Valley runs whenever the ski area's facilities are open, typically mid-December through March."), React.createElement("p", null, "\"Depending on conditions\" has decided the last two holiday seasons. In the 2024 to 2025 winter Badger Pass never opened: on February 11, 2025, the park's announcement, as reported by KMPH, said it would not open \"due to a lack of snow early enough in the season.\" In the 2025 to 2026 winter the alpine area opened on January 16, 2026, and closed for the season on March 18, after about 60 days of operation, as reported in the ski press at the time. Neither winter had the hill running at Christmas."), React.createElement("p", null, React.createElement("strong", null, "No 2026 to 2027 opening date had been announced as of October 18, 2026."), " Treat skiing at Christmas as a bonus, not the reason for the trip. To check, call the Snow Phone at 209-372-1000 for conditions and ski area information; the concessioner's downhill page also lists 209-372-8430. Everything else about the hill, the lessons and the huts is in ", React.createElement("a", {
    href: "/articles/badger-pass-ski-area"
  }, "the Badger Pass guide"), ".")), React.createElement("figure", {
    className: "cny-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-winter-snow.jpg",
    style: {
      aspectRatio: "1600 / 1247"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Half Dome under snow above a snow-covered Yosemite Valley, in an early photograph"
  }), React.createElement("figcaption", null, "Half Dome in a snow year. Whether the holidays have one is the storms' decision. Photo: George Fiske / Wikimedia Commons (public domain)"))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cny-chains",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CHAINS"), React.createElement("h2", null, "Carry them, whatever you drive"), React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, "The park strongly recommends carrying chains from November through March. The rule that catches holiday drivers is that when chain controls are in effect, \"all vehicles must have tire chains in possession,\" even a vehicle the sign exempts from putting them on. Rental cars are not exempt, the park says, even with all-season tires. Failing to put chains on when required can bring a citation of up to $5,000."), React.createElement("p", null, React.createElement("strong", null, "The three levels."), " Under R1, a car or pickup under 6,000 pounds with snow tires on at least two drive wheels, not towing, may go without mounting chains. Under R2, a four-wheel or all-wheel drive vehicle under 6,500 pounds, with snow tires on all four wheels and the drive engaged, not towing, may go without. Under R3, everyone chains up. Caltrans notes that a highway is often closed before R3 is imposed, and that the speed limit with chains required is 25 or 30 miles an hour."), React.createElement("p", null, React.createElement("strong", null, "Before you drive in."), " The park's road line is 209-372-0200, then 1, then 1. Outside the park, Caltrans' highway line is 800-427-7623, and its QuickMap shows chain controls in real time. Caltrans also warns that chain installers at the checkpoints are not allowed to sell or rent chains, so buy them before you leave. Route choice is in ", React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "the entrances guide"), ", and the full winter driving picture is in ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "the winter guide"), "."))), React.createElement("div", null, React.createElement("ul", {
    className: "ff-rules cny-levels"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "R1"), React.createElement("p", null, "Chains on, except cars and pickups under 6,000 lb with snow tires on two drive wheels.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "R2"), React.createElement("p", null, "Chains on, except 4WD or AWD under 6,500 lb with snow tires on all four.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "R3"), React.createElement("p", null, "Chains on every vehicle. No exceptions.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "Always"), React.createElement("p", null, "Chains in the vehicle under any control, rentals included. Up to $5,000.")))))), React.createElement("section", {
    className: "ff-band",
    id: "cny-plan",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THREE PLANS"), React.createElement("h2", null, "Which holiday you book decides the trip"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "cny-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The week before Christmas."), " If the Bracebridge Dinner is the point, come between December 8 and 22 and stay the night; the drive out after a late dinner is a dark winter road. Curry Village reopens after December 10. The holiday crowd has mostly not arrived, which is the case ", React.createElement("a", {
    href: "/articles/yosemite-in-december"
  }, "the December guide"), " makes for the middle of the month."), React.createElement("p", null, React.createElement("strong", null, "Christmas week."), " The quietest of the three for events: the chapel on Christmas Eve, the rink, and the Valley floor on foot or by shuttle. Book the room first, eat where you sleep on Christmas Day, and keep Badger Pass as a maybe."), React.createElement("p", null, React.createElement("strong", null, "New Year's."), " Pick a party before you pick a hotel. The Ahwahnee's dinner dance is the formal evening; the Mountain Room is the walk-up one. Both are in the Valley, so a Valley room means no driving after midnight. The Park Service names early January, not only late December, as the busy stretch, so be parked early on New Year's Day."), React.createElement("p", null, "Visiting earlier in the season? ", React.createElement("a", {
    href: "/articles/thanksgiving-in-yosemite"
  }, "The Thanksgiving guide"), " covers the other holiday weekend, with its own road record and dinners.")), React.createElement("figure", {
    className: "cny-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/yosemite-valley-snow-fiske.jpg",
    style: {
      aspectRatio: "1600 / 1233"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Yosemite Valley under snow, the trees and cliffs white, in an early photograph"
  }), React.createElement("figcaption", null, "The Valley in snow, the holiday trip's whole territory. Photo: George Fiske / Wikimedia Commons (public domain)"))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cny-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "The holidays in Yosemite, answered"), React.createElement("div", {
    className: "cny-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/specialty-events/food-and-wine-events/bracebridge-dinner",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The Bracebridge Dinner, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/specialty-events/holiday-events/new-years-eve",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "New Year's Eve, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/specialty-events/holiday-events",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Holiday events, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemitethisyear.com/eventdetail/18868/new-years-eve-dinner-dance",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "New Year's Eve Dinner Dance, Mariposa County visitors bureau")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/curry-village/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Curry Village, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/winter/curry-village-ice-skating-rink/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Curry Village Ice Skating Rink, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/winter/badger-pass-ski-area/downhill-skiing-snowboarding/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Badger Pass downhill, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/special-offers/specials-packages",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Specials and packages, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/wawona-hotel/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona Hotel, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/winter.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Winter, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tirechains.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tire chains, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hours.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Operating hours, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campgrounds.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campgrounds, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/publictransportation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Public transportation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Current conditions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://dot.ca.gov/travel/winter-driving-tips/chain-controls",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Chain controls, Caltrans")), React.createElement("li", null, React.createElement("a", {
    href: "https://kmph.com/news/local/badger-pass-ski-area-cancels-season-due-to-lack-of-snow",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\"Badger Pass Ski Area cancels season due to lack of snow,\" KMPH"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap cny-end"
  }, React.createElement(AffiliateNote, null)));
};
