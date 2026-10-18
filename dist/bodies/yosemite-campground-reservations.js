window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-campground-reservations"] = function YosemiteCampgroundReservationsBody() {
  var TOC = [["#cr-windows", "The four windows"], ["#cr-calendar", "Release calendar"], ["#cr-morning", "Release morning"], ["#cr-rules", "After you book"], ["#cr-first-come", "First-come sites"], ["#cr-full", "When it is full"], ["#cr-lottery", "The lottery"], ["#cr-questions", "Questions"]];
  var FAQ = [["When do Yosemite campground reservations open?", "Upper Pines, Lower Pines, North Pines, Wawona and Hodgdon Meadow release on Recreation.gov five months ahead, on the 15th of each month, one block of arrival dates at a time: on January 15, arrivals from May 15 to June 14 open. Half of Tuolumne Meadows releases two months ahead on the 15th. Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and the other half of Tuolumne release two weeks ahead on a rolling daily window, and Camp 4 one week ahead."], ["What time do Yosemite campsites go on sale?", "7 am Pacific time. The Park Service says all non-lottery reservations are released at 7 am Pacific and sell out within minutes. Log in to Recreation.gov before then; you must be logged in to add a site to your cart."], ["How many Yosemite campground reservations can I make at once?", "Two. The Park Service says you may make only two reservations per website visit or phone call. Recreation.gov holds a site in your cart for 15 minutes, and asks you not to log in to the same account in more than one browser, tab or window."], ["Are there first-come, first-served campgrounds in Yosemite?", "Only from late fall to early spring. The Park Service says no first-come campgrounds are open from mid-April through October. In the off-season, Camp 4, Hodgdon Meadow and Wawona run first-come, first-served, and they can fill early on weekends and holidays. The campground status line is 209/372-0266."], ["What does it cost to cancel a Yosemite campsite?", "Per Recreation.gov's Upper Pines page: $10 more than 48 hours before arrival; $10 plus the first night's fee within 48 hours; a one-night reservation has no $10 fee but is not refundable inside 48 hours; and a no-show pays a $20 fee and loses the first night."], ["Is there a Yosemite campground lottery for 2027?", "None was announced as of October 18, 2026. North Pines ran a one-time Early Access Lottery for the 2026 season, with a $10 application fee, and the Park Service said it may consider expanding the idea to other campgrounds. Check the park's lottery page and the campground's Recreation.gov page before planning a release morning."]];
  var WINDOWS = [{
    lead: "5 months",
    name: "On the 15th",
    cls: "is-hard",
    camps: "Upper Pines, Lower Pines, North Pines, Wawona, Hodgdon Meadow",
    text: "One block of arrival dates, the 15th through the 14th, opens at 7 am Pacific on the 15th, five months out."
  }, {
    lead: "2 months",
    name: "On the 15th",
    cls: "is-mid",
    camps: "Half of Tuolumne Meadows",
    text: "Half the sites release two months ahead, on the 15th."
  }, {
    lead: "2 weeks",
    name: "Rolling, daily",
    cls: "is-soft",
    camps: "Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat, the other half of Tuolumne",
    text: "A new day opens every morning at 7 am Pacific."
  }, {
    lead: "1 week",
    name: "Rolling, daily",
    cls: "is-soft",
    camps: "Camp 4, in its reservation season",
    text: "Seven days ahead, $10 a person a night."
  }];
  var CAMPS = [["Upper Pines", "5 months", "All year", 236, "$36"], ["Lower Pines", "5 months", "Apr 21 to Oct 19", 74, "$36"], ["North Pines", "5 months (2026: lottery first)", "Apr 21 to Oct 26", 81, "$36"], ["Wawona", "5 months", "All year; reserved Apr 15 to Oct 26 (Loop A to Nov 29)", 95, "$36"], ["Hodgdon Meadow", "5 months", "All year; reserved Apr 15 to Oct 26", 100, "$36"], ["Tuolumne Meadows", "Half 2 months, half 2 weeks", "Jul 1 to Sep 27", 289, "$36"], ["Crane Flat", "2 weeks", "May 21 to Oct 12", 148, "$36"], ["Bridalveil Creek", "2 weeks", "Jul 3 to Aug 14, closed early", 110, "$36"], ["White Wolf", "2 weeks", "Jul 2 to Sep 14", 68, "$28"], ["Tamarack Flat", "2 weeks", "Jun 22 to Oct 12", 52, "$24"], ["Yosemite Creek", "2 weeks", "Jul 1 to Sep 7", 74, "$24"], ["Porcupine Flat", "2 weeks", "Jun 23 to Oct 11", 55, "$24"], ["Camp 4", "1 week", "All year; reserved Apr 15 to Nov 29", 61, "$10 a person"]];
  var RELEASES = [["Sun, Nov 15, 2026", "Mar 15 to Apr 14, 2027"], ["Tue, Dec 15, 2026", "Apr 15 to May 14, 2027"], ["Fri, Jan 15, 2027", "May 15 to Jun 14, 2027"], ["Mon, Feb 15, 2027", "Jun 15 to Jul 14, 2027", true], ["Mon, Mar 15, 2027", "Jul 15 to Aug 14, 2027", true], ["Thu, Apr 15, 2027", "Aug 15 to Sep 14, 2027", true], ["Sat, May 15, 2027", "Sep 15 to Oct 14, 2027"], ["Tue, Jun 15, 2027", "Oct 15 to Nov 14, 2027"]];
  var CANCEL = [["More than 48 hours out", "$10 transaction fee"], ["Within 48 hours", "$10 plus the first night"], ["One-night stay, within 48 hours", "No $10 fee, no refund"], ["No-show", "$20 plus the first night"]];
  return React.createElement("div", {
    className: "cr-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Valley release"), React.createElement("dd", null, "The 15th, five months ahead")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "On sale"), React.createElement("dd", null, "7 am Pacific, gone in minutes")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "High country"), React.createElement("dd", null, "Two weeks ahead, every morning")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Per visit"), React.createElement("dd", null, "Two reservations, 15-minute cart"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section cr-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Every reservable campsite in Yosemite books on Recreation.gov, and the ones most people want go on sale at 7 am Pacific on the 15th of the month, five months ahead. The Park Service's own word for them is \"extremely difficult to get,\" and it says they sell out within minutes."), React.createElement("p", null, "That is one door of four. The high-country campgrounds open a new day every morning, two weeks out. Half of Tuolumne Meadows opens two months out. Camp 4 opens one week out. From late fall to early spring, three campgrounds drop reservations altogether and go first-come, first-served."), React.createElement("p", null, "This page is the mechanics: which campground sits behind which door, the next eight release mornings, what to do in the minutes around 7:00, the rules that come with the site, and the ways in once it is gone. For the campgrounds themselves, site by site, read ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the complete Yosemite camping guide"), ".")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "The Pines, Wawona and Hodgdon Meadow: the 15th, 7 am Pacific, five months ahead."), React.createElement("li", null, "Want mid-July to mid-August 2027? Your morning is March 15."), React.createElement("li", null, "Two reservations per visit. Log in early, one tab."), React.createElement("li", null, "Missed it: the two-week campgrounds open a day every morning at 7."), React.createElement("li", null, "No first-come camping from mid-April through October.")), React.createElement("a", {
    className: "cr-short__link",
    href: "#cr-calendar"
  }, "Find your release morning ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "cr-windows",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE FOUR WINDOWS"), React.createElement("h2", null, "Which campground opens when"), React.createElement("ol", {
    className: "cr-windows"
  }, WINDOWS.map(w => React.createElement("li", {
    key: w.lead,
    className: w.cls
  }, React.createElement("span", null, w.lead), React.createElement("strong", null, w.name), React.createElement("p", {
    className: "cr-windows__camps"
  }, w.camps), React.createElement("p", null, w.text)))), React.createElement("div", {
    className: "ff-split cr-after"
  }, React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Five months, on the 15th."), " Upper Pines, Lower Pines and North Pines on the Valley floor, plus Wawona and Hodgdon Meadow, release one block of arrival dates at a time. Recreation.gov's Upper Pines page gives the example: \"on January 15, arrival dates for the period May 15 to June 14 become available to reserve.\" So the block runs from the 15th to the 14th, and it opens on the 15th four months before its first night."), React.createElement("p", null, React.createElement("strong", null, "Two months, on the 15th."), " Half the sites at Tuolumne Meadows, the park's biggest campground at 289 sites, release this way. The Park Service's table lists Tuolumne as \"2 months ahead on 15th and 14 days ahead.\" Its Recreation.gov page does not spell out the split, so check the campground's own page for the exact block."), React.createElement("p", null, React.createElement("strong", null, "Two weeks, rolling."), " Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and the other half of Tuolumne open two weeks ahead, one new day every morning. They sit between 6,200 and 8,600 feet, and in 2026 they opened between May 21 and July 3, so their seasons are short and move every year."), React.createElement("p", null, React.createElement("strong", null, "One week, rolling."), " Camp 4, a walk-in, tents-only campground in Yosemite Valley, releases one week before arrival during its reservation season. It costs $10 a person a night, and up to six people can be registered for a site per reservation transaction."), React.createElement("p", null, "The Park Service says all non-lottery reservations release at 7 am Pacific. Recreation.gov's Yosemite pages print the same hour as both \"PT\" and \"PST.\" Read it as 7 am on the clock in California that morning.")), React.createElement("div", {
    className: "cr-tablewrap"
  }, React.createElement("h3", {
    className: "cr-head"
  }, "All thirteen, as the Park Service lists them for 2026"), React.createElement("table", {
    className: "cr-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Campground"), React.createElement("th", {
    scope: "col"
  }, "Window"), React.createElement("th", {
    scope: "col"
  }, "2026 season"), React.createElement("th", {
    scope: "col"
  }, "Sites"), React.createElement("th", {
    scope: "col"
  }, "Night"))), React.createElement("tbody", null, CAMPS.map(([name, win, season, sites, fee]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row"
  }, name), React.createElement("td", null, win), React.createElement("td", null, season), React.createElement("td", null, sites), React.createElement("td", null, fee))))), React.createElement("p", {
    className: "ff-note"
  }, "The park sets the seasons each year, and the 2027 dates were not published when this was written. Bridalveil Creek closed early in 2026 after a lightning strike."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cr-calendar",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE RELEASE CALENDAR"), React.createElement("h2", null, "Count back to the 15th, four months before the block"), React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, "Find the block your first night falls in, then go back to the 15th four months before the block starts. A first night on the 1st to the 14th belongs to the block that began the month before. A trip from July 10 to 13, 2027 sits in the June 15 to July 14 block, so it opens on February 15. A trip from July 16 to 19 sits in the next block and opens on March 15."), React.createElement("p", null, "There is no earlier door. The block is set by your arrival date, so if a stay starts on the 14th, it opens a month before a stay that starts on the 15th. If you can slide a trip by a day or two across that line, you choose which morning you compete on."), React.createElement("p", null, "The calendar says which arrival dates open, not which campgrounds will be open on them. Lower and North Pines opened April 21 in 2026, and Wawona and Hodgdon Meadow took reservations from April 15; if 2027 runs the same way, the November 15 morning is an Upper Pines morning only. The three that open summer arrivals are February 15, March 15 and April 15. The ", React.createElement("a", {
    href: "/dates"
  }, "park dates table"), " carries the same rule."))), React.createElement("div", null, React.createElement("h3", {
    className: "cr-head"
  }, "The next eight release mornings, 7 am Pacific"), React.createElement("ol", {
    className: "ff-hours cr-cal"
  }, RELEASES.map(([day, opens, glow]) => React.createElement("li", {
    key: day,
    className: glow ? "is-glow" : undefined
  }, React.createElement("span", null, day), React.createElement("p", null, "Arrivals ", opens, ".")))), React.createElement("p", {
    className: "ff-note"
  }, "Worked from Recreation.gov's example for the five-month campgrounds. Highlighted: the summer blocks. Confirm the on-sale date on the campground's Recreation.gov page.")))), React.createElement("section", {
    className: "ff-band",
    id: "cr-morning",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RELEASE MORNING"), React.createElement("h2", null, "The work is done before 7:00"), React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, "Recreation.gov publishes its own tips for popular campgrounds, and they line up with the Park Service's. Make the account ahead of time. Log in \"well before the sale begins\"; on the Yosemite pages you cannot add a site to your cart without being logged in. Synchronize your clock to the Recreation.gov clock, which it links as Coordinated Universal Time."), React.createElement("p", null, "Then one tab. Recreation.gov says plainly: \"Do NOT log in to multiple browsers, multiple tabs, or multiple windows using the same account.\" Once you click Add to Cart, the site is locked in your cart for 15 minutes, which is enough time to check out and not enough to keep browsing."), React.createElement("p", null, "The Park Service caps you at two reservations per website visit or phone call. Know which two before the clock turns, and have fallback dates written down. Recreation.gov also suggests trips that skip a Friday and Saturday night, and shoulder seasons, where you can."), React.createElement("p", null, "For a first trip, decide on a campground before you decide on a site. ", React.createElement("a", {
    href: "/articles/camping-in-yosemite-first-time"
  }, "What a first night in a Yosemite campground is actually like"), " covers what you are booking: the bear locker, the neighbors and the arrival hour."))), React.createElement("div", null, React.createElement("h3", {
    className: "cr-head"
  }, "The morning, step by step"), React.createElement("ol", {
    className: "ff-hours cr-steps"
  }, React.createElement("li", null, React.createElement("span", null, "Days before"), React.createElement("p", null, "Create the Recreation.gov account. Pick the campground, the dates, and two fallbacks.")), React.createElement("li", null, React.createElement("span", null, "The night before"), React.createElement("p", null, "Open the campground's page and confirm its on-sale date and time.")), React.createElement("li", null, React.createElement("span", null, "Well before 7"), React.createElement("p", null, "Log in. Sync to the Recreation.gov clock. One browser, one tab.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "7:00 Pacific"), React.createElement("p", null, "Add a site that fits your party. It is held for 15 minutes. Check out.")), React.createElement("li", null, React.createElement("span", null, "The limit"), React.createElement("p", null, "Two reservations per visit. Then you are done for the morning.")), React.createElement("li", null, React.createElement("span", null, "If you miss"), React.createElement("p", null, "Set an Availability Alert on the campground and turn to the rolling windows."))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cr-rules",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "AFTER YOU BOOK"), React.createElement("h2", null, "The rules that come with the site"), React.createElement("ul", {
    className: "ff-rules cr-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Six people, two vehicles."), React.createElement("p", null, "A maximum of six people, children included, and two motor vehicles per site. Some sites take only one vehicle; the site details on Recreation.gov say which.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Noon, and 10 am."), React.createElement("p", null, "Check-in and checkout are at noon. Check in at the campground kiosk before 10 am the morning after your first night, or the reservation is cancelled.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 26
  }), React.createElement("strong", null, "Thirty nights a year."), React.createElement("p", null, "From May 1 to September 15, the limit is 14 nights, and only seven of those in Yosemite Valley or Wawona.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No resale."), React.createElement("p", null, "Recreation.gov says resale or auction of advance reservations is prohibited."))), React.createElement("div", {
    className: "ff-split cr-after"
  }, React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Arriving late."), " Recreation.gov's Upper Pines page says a late arrival should call 209/372-8502, and that the reservation may be cancelled if the campground does not hear from you within 24 hours of your arrival date. An after-hours arrival signs in and returns to the kiosk the next morning to finish check-in."), React.createElement("p", null, React.createElement("strong", null, "Sleeping in the car."), " The Park Service does not allow it anywhere in the park except a campsite you are registered for, and not along the side of the road. Camp 4 is walk-in and tents only, so not there either."), React.createElement("p", null, React.createElement("strong", null, "The gate."), " The campsite does not cover the park entrance fee, which Recreation.gov notes is charged per vehicle and separately."), React.createElement("p", null, React.createElement("strong", null, "Quiet hours"), " run 10 pm to 6 am, and generators may run only from 7 to 9 am, noon to 2 pm, and 5 to 7 pm.")), React.createElement("div", {
    className: "cr-policy"
  }, React.createElement("h3", {
    className: "cr-head"
  }, "What cancelling costs"), React.createElement("dl", null, CANCEL.map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("dt", null, k), React.createElement("dd", null, v)))), React.createElement("p", {
    className: "ff-note"
  }, "From Recreation.gov's Upper Pines and North Pines pages. Terms are set per campground; confirm them on your own reservation.")))), React.createElement("section", {
    className: "ff-band",
    id: "cr-first-come",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FIRST-COME, FIRST-SERVED"), React.createElement("h2", null, "Only in the cold months"), React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, "From mid-April through October, the Park Service says, \"There are no first-come, first-served campgrounds open.\" Its advice for those months is blunt: \"Do not arrive at Yosemite without a reservation.\" The only move then is to watch Recreation.gov for cancellations."), React.createElement("p", null, "Three campgrounds go first-come in the off-season. Hodgdon Meadow and Wawona are first-come, first-served from late October through early April. Camp 4 is first-come from mid-November through mid-April, the Park Service says, \"usually until sometime in April,\" and its fee drops to $10 a night. All three can fill early on weekends and holidays, and Camp 4 \"may fill early in the morning every day in spring and fall if weather is nice.\""), React.createElement("p", null, React.createElement("strong", null, "This fall, the dates are later than usual."), " For 2026 the park extended Camp 4's reservation season to November 29 (the last reserved night is November 28) and Wawona's Loop A to November 29. Hodgdon Meadow's reservations ran through October 26, and Wawona's Loops B and C close for the season on October 26. The park's general reservations page still prints an older Camp 4 season, so the campground pages are the ones to trust. Call the campground status line, 209/372-0266, before you drive up on a hunch."))), React.createElement("div", null, React.createElement("figure", {
    className: "cr-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/camp-4-kiosk.jpg",
    style: {
      aspectRatio: "1600 / 1561"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The Camp 4 kiosk and its notice board in Yosemite Valley"
  }), React.createElement("figcaption", null, "The Camp 4 kiosk. Reserved one week ahead from April 15 to November 29 in 2026, first-come the rest of the year. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("ol", {
    className: "ff-hours cr-fcfs"
  }, React.createElement("li", null, React.createElement("span", null, "Hodgdon Meadow"), React.createElement("p", null, "First-come from late October to early April.")), React.createElement("li", null, React.createElement("span", null, "Wawona"), React.createElement("p", null, "First-come from late October to early April. Loop A reserved to Nov 29 in 2026.")), React.createElement("li", null, React.createElement("span", null, "Camp 4"), React.createElement("p", null, "First-come from mid-November to mid-April. Reserved to Nov 29 in 2026.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Everything else"), React.createElement("p", null, "Reservation only, or closed for winter."))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cr-full",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN IT IS SOLD OUT"), React.createElement("h2", null, "The other doors"), React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The rolling campgrounds."), " A sold-out 15th is not the end of summer. Every morning at 7, the two-week campgrounds open another day, from Crane Flat to the high-country half of Tuolumne Meadows. Their seasons are short, and the campgrounds sit between 6,200 and 8,600 feet."), React.createElement("p", null, React.createElement("strong", null, "Cancellations."), " Recreation.gov's Availability Alerts send an email or notification when a site you are watching opens. Cancelling costs $10 until 48 hours before arrival. Flexible dates matter more than any tool: one fixed weekend is a long shot, a free week is not."), React.createElement("p", null, React.createElement("strong", null, "Camp 4."), " One week out, every day, in its reservation season, and first-come in the cold months."), React.createElement("p", null, React.createElement("strong", null, "A roof instead."), " Housekeeping Camp and Curry Village are not campgrounds. They are lodging run by the park's concessioner, Yosemite Hospitality, which takes its own reservations, and the Park Service says in-park lodging is available 366 days in advance. That is seven months before the campgrounds' first door. ", React.createElement("a", {
    href: "/articles/housekeeping-camp-vs-curry-village"
  }, "Housekeeping Camp against Curry Village"), " compares the two canvas-roofed Valley stays."), React.createElement("p", null, React.createElement("strong", null, "A wilderness permit."), " A night in the backcountry runs on its own quota and its own calendar; ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "the wilderness permit guide"), " covers it."))), React.createElement("div", null, React.createElement("figure", {
    className: "cr-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tuolumne-meadows-late-summer.jpg",
    style: {
      aspectRatio: "1600 / 1068"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Tuolumne Meadows in late summer, dry grass and lodgepole pines below granite domes"
  }), React.createElement("figcaption", null, "Tuolumne Meadows, the park's largest campground, half on the two-month window and half on the two-week one. Photo: Dsdugan / Wikimedia Commons (CC0)")), React.createElement("div", {
    className: "cr-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "When every campsite is gone",
    note: "Watch Recreation.gov for cancellations first, and look at Yosemite Hospitality's tent cabins, which open a year ahead. If you still have nowhere to sleep, a search shows the rooms left within driving distance of the gates.",
    list: "article_cta",
    slug: "yosemite-campground-reservations",
    cta: "Search lodging around Yosemite →"
  }))))), React.createElement("section", {
    className: "ff-band",
    id: "cr-lottery",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE LOTTERY"), React.createElement("h2", null, "North Pines tried one, once"), React.createElement("div", {
    className: "cr-prose"
  }, React.createElement("p", null, "For the 2026 season, North Pines ran what the Park Service called a \"one-time early access lottery.\" Applications ran November 24 to December 14, 2025, with a nonrefundable $10 fee, one application per person. Results came out December 22. Winners got a time slot between January 2 and February 1, 2026, to make one reservation, one continuous stay in one site, capped at seven nights, at $36 a night."), React.createElement("p", null, "What the winners did not take went back into the ordinary releases, starting with the February 15 on-sale. Sites at risk of flooding were held back until the park judged the risk low."), React.createElement("p", null, "As of October 18, 2026, we found no announcement of a lottery for 2027, at North Pines or anywhere else. The Park Service said it \"may consider expanding it to other campgrounds\" depending on visitor feedback. Last year's application window opened in late November, so check ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lottery-pilot.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the park's lottery page"), " and the campground's Recreation.gov page this November before you count on the 15th."))), React.createElement("article", {
    className: "ff-inpark cr-lot"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "2026 PILOT"), React.createElement("h3", null, "North Pines Early Access Lottery"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Applications"), React.createElement("dd", null, "Nov 24 to Dec 14, 2025")), React.createElement("div", null, React.createElement("dt", null, "Fee"), React.createElement("dd", null, "$10, nonrefundable")), React.createElement("div", null, React.createElement("dt", null, "Results"), React.createElement("dd", null, "Dec 22, 2025")), React.createElement("div", null, React.createElement("dt", null, "Winners booked"), React.createElement("dd", null, "Jan 2 to Feb 1, 2026")), React.createElement("div", null, React.createElement("dt", null, "Stay"), React.createElement("dd", null, "One site, up to seven nights")), React.createElement("div", null, React.createElement("dt", null, "2027"), React.createElement("dd", null, "Not announced as of Oct 18, 2026")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cr-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite campground reservations, answered"), React.createElement("div", {
    className: "cr-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campgrounds.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campgrounds, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campground Reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camp4.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camp 4, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/nrcamping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camping Without a Reservation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campregs.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campground Regulations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lottery-pilot.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "North Pines Early Access Lottery, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/camping/campgrounds/232447",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Upper Pines Campground, Recreation.gov")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/camping/campgrounds/232449",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "North Pines Campground, Recreation.gov")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/articles/list/tips-for-making-campsite-reservations-at-popular-locations/281",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tips for Making Campsite Reservations at Popular Locations, Recreation.gov")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/rules-reservation-policies",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Rules and Reservation Policies, Recreation.gov"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap cr-end"
  }, React.createElement(AffiliateNote, null)));
};
