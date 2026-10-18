window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-sequoia-kings-canyon-trip"] = function YosemiteSequoiaKingsCanyonTripBody() {
  var TOC = [["#ys-route", "The route"], ["#ys-drives", "Drive times"], ["#ys-passes", "Passes"], ["#ys-plans", "Itineraries"], ["#ys-seasons", "Seasons"], ["#ys-stay", "Where to sleep"], ["#ys-arrive", "Flying in"], ["#ys-questions", "Questions"]];
  var FAQ = [["How far is Sequoia National Park from Yosemite?", "Yosemite's own driving table gives about 150 miles and 3 hours 30 minutes to Grant Grove in Kings Canyon by Highway 41, and about 175 miles and 4 hours to Lodgepole and Giant Forest in Sequoia by Highways 41 and 180. The table does not name its starting point. No road crosses the Sierra through Sequoia and Kings Canyon, so every route runs south through the Fresno area."], ["Does one pass cover Yosemite, Sequoia and Kings Canyon?", "No single park pass does. Yosemite's $35 vehicle pass covers Yosemite for seven days. Sequoia and Kings Canyon share one $35 vehicle pass, good for one to seven days in both parks. The $80 America the Beautiful annual pass covers all three, and it waives the $100 per-person nonresident fee at both."], ["Can you visit Sequoia as a day trip from Yosemite?", "Not sensibly. By the Park Service's figures the round trip to Giant Forest is about eight hours of driving before you walk to a single tree. Plan at least one night on the Sequoia and Kings Canyon side."], ["How many days do you need for Yosemite, Sequoia and Kings Canyon?", "Four days is the shortest trip we would plan: two in Yosemite and two in Sequoia and Kings Canyon, with the long drive between them on day three. Five or six days adds Cedar Grove, the canyon floor of Kings Canyon, from May to early or mid-November."], ["Is the Generals Highway open in winter?", "The stretch between Sequoia and Kings Canyon is usually closed from early January to mid-March, and whenever snow makes it impassable. The detour from Giant Forest to Grant Grove then runs about 118 miles and 3 hours by Highways 198, 216, 63 and 180. Chains can be required on park roads at any time."], ["Which park should you visit first?", "Coming from San Francisco or Sacramento, see Yosemite first and leave by Highway 41 south. Coming from Los Angeles, enter Sequoia at Ash Mountain on Highway 198, drive north through Kings Canyon, and finish in Yosemite. Either way you drive the long middle leg only once."]];
  var FROM_YOSEMITE = [{
    to: "Grant Grove, Kings Canyon",
    by: "Highway 41",
    time: "3 h 30 min",
    dist: "150 mi"
  }, {
    to: "Lodgepole and Giant Forest, Sequoia",
    by: "Highways 41 and 180",
    time: "4 h",
    dist: "175 mi"
  }, {
    to: "Cedar Grove, Kings Canyon",
    by: "Highway 41",
    time: "4 h",
    dist: "180 mi"
  }];
  var INSIDE = [{
    leg: "Ash Mountain entrance to Lodgepole",
    time: "About 1 hour",
    note: "The Generals Highway climbs from the foothills to the sequoia groves."
  }, {
    leg: "Foothills Visitor Center to Giant Forest Museum",
    time: "60 minutes, 16 mi",
    note: "The winter Trip Planner's figure."
  }, {
    leg: "Giant Forest Museum to the Sherman Tree",
    time: "10 minutes, 2 mi",
    note: "The same table."
  }, {
    leg: "Lodgepole to Grant Grove",
    time: "45 minutes to an hour",
    note: "Generals Highway, mostly at one elevation."
  }, {
    leg: "Grant Grove to Cedar Grove and Roads End",
    time: "45 minutes to an hour",
    note: "Highway 180 into the canyon, May to early or mid-November."
  }, {
    leg: "The whole Generals Highway, entrance to entrance",
    time: "At least 2 hours",
    note: "The parks' own advice, with no side trips."
  }];
  var PASSES = [{
    name: "Yosemite vehicle pass",
    price: "$35",
    note: "Seven consecutive days, Yosemite only"
  }, {
    name: "Sequoia and Kings Canyon vehicle pass",
    price: "$35",
    note: "One to seven days, both parks"
  }, {
    name: "America the Beautiful, residents",
    price: "$80",
    note: "A year, every national park"
  }, {
    name: "America the Beautiful, nonresidents",
    price: "$250",
    note: "A year; waives the $100 nonresident fee"
  }];
  var SEASONS = [{
    when: "Late May or June to October",
    name: "Everything open",
    cls: "is-peak",
    text: "Tioga Road is open, Cedar Grove is open, and the Generals Highway joins the two southern parks. The only window when a loop can include all of it."
  }, {
    when: "November and December",
    name: "Closing up",
    cls: "is-mid",
    text: "Tioga Road closes, Cedar Grove closes in early or mid-November, and the Mariposa Grove shuttle stops by November 30. The Generals Highway usually stays open."
  }, {
    when: "Early January to mid-March",
    name: "Two separate trips",
    cls: "is-late",
    text: "The Generals Highway between the parks is usually closed. Giant Forest to Grant Grove becomes a 118-mile, three-hour detour."
  }];
  var OPEN = [["Tioga Road (Yosemite)", "Late May or June through October", "Yosemite driving page"], ["Mariposa Grove shuttle (Yosemite)", "No earlier than April 15 to November 30 at the latest", "Mariposa Grove page"], ["Cedar Grove road (Kings Canyon)", "Typically May through early to mid-November", "Conditions and hours pages"], ["Generals Highway between the parks", "Usually closed early January to mid-March", "Winter Trip Planner"], ["Moro Rock and Crescent Meadow Road (Sequoia)", "Closed to vehicles when snow makes it impassable", "Winter Trip Planner"], ["Free Sequoia shuttles", "May 22 to September 7 in 2026, plus some holiday dates", "Park shuttles page"]];
  return React.createElement("div", {
    className: "ys-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "Yosemite to Grant Grove"), React.createElement("dd", null, "About 150 mi, 3 h 30 min")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Entrance"), React.createElement("dd", null, "$35 Yosemite, $35 Sequoia and Kings Canyon")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "id"
  }), React.createElement("dt", null, "One card for all three"), React.createElement("dd", null, "America the Beautiful, $80")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("dt", null, "Winter"), React.createElement("dd", null, "The road between the southern parks closes early Jan to mid-March"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ys-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Yosemite, Sequoia and Kings Canyon sit on the same side of the same mountain range, and on a map they look like one trip. They can be, if you plan around three facts. The drive between them is three and a half to four hours. They are two park systems with two entrance passes. And the road that joins the two southern parks closes for part of every winter."), React.createElement("p", null, "Sequoia and Kings Canyon are two national parks run as one, with one fee and one set of rangers. Sequoia holds Giant Forest and the General Sherman Tree, which the Park Service calls the largest living specimen on earth. Kings Canyon holds Grant Grove and, down Highway 180, Cedar Grove and the canyon itself."), React.createElement("p", null, "The figures below come from the Park Service's own pages for both parks. Drive times assume good conditions and no stops. Roads in the southern parks are under construction this fall, so check current conditions the week you go.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Four days minimum: two in Yosemite, two in Sequoia and Kings Canyon."), React.createElement("li", null, "Drive the long leg once. Enter one end, leave by the other."), React.createElement("li", null, "Two $35 passes, or one $80 America the Beautiful card."), React.createElement("li", null, "No gas and no cell service inside Sequoia and Kings Canyon.")), React.createElement("a", {
    className: "ys-short__link",
    href: "#ys-plans"
  }, "The itineraries, day by day ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "ys-route",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE ROUTE"), React.createElement("h2", null, "Every route runs through Fresno"), React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, "\"No roads cross the mountains west-to-east through Sequoia and Kings Canyon National Parks,\" the Park Service says. There is no back way from Yosemite's high country or from Highway 395. The link between the parks is Highway 41 south out of Yosemite's South Entrance, through Oakhurst to the Fresno area, then Highway 180 east to the Big Stump entrance of Kings Canyon."), React.createElement("p", null, "The parks have three entrances. ", React.createElement("strong", null, "Big Stump"), ", on Highway 180 from Fresno, is the Kings Canyon gate and the one you use coming from Yosemite. ", React.createElement("strong", null, "Ash Mountain"), ", on Highway 198 at Three Rivers, is the Sequoia gate and the one you use from Visalia and Los Angeles. ", React.createElement("strong", null, "Lookout Point"), " serves Mineral King, a remote area at the end of its own road; leave it for another trip."), React.createElement("p", null, "Inside, the ", React.createElement("strong", null, "Generals Highway"), " joins the two. It runs from Ash Mountain up to Giant Forest and Lodgepole in Sequoia, then north to Grant Grove in Kings Canyon, where it meets Highway 180. That makes a one-way trip easy: come in at one gate, drive the Generals Highway, leave by the other. From San Francisco, do Yosemite first and enter at Big Stump; from Los Angeles, start at Ash Mountain and finish in Yosemite."), React.createElement("p", null, React.createElement("strong", null, "The long vehicle rule."), " The Generals Highway between Ash Mountain and Giant Forest is narrow and steep. The parks advise against vehicles over 24 feet from the Foothills Visitor Center to Potwisha Campground and over 22 feet from Potwisha to the Giant Forest Museum. The Moro Rock and Crescent Meadow road is a hard 22-foot limit. In an RV or with a trailer, use Highway 180, which the parks call the preferred route for longer vehicles, and come and go by Big Stump."), React.createElement("p", null, React.createElement("strong", null, "Map apps."), " The parks warn that GPS can route drivers around entrance stations onto remote roads. Avoid any route that puts you on unpaved road, and turn off \"avoid tolls,\" which the parks say gives the most direct, safe route."))), React.createElement("div", null, React.createElement("figure", {
    className: "ys-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/oakhurst-highway-41-ken-lund.jpg",
    style: {
      aspectRatio: "1920 / 951",
      objectPosition: "50% 70%"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Highway 41 through Oakhurst, with shops along the road and a forested ridge behind"
  }), React.createElement("figcaption", null, "Highway 41 through Oakhurst, the road south from Yosemite toward Fresno and the southern parks. Photo: Ken Lund / Wikimedia Commons (CC BY-SA 2.0)")), React.createElement("p", {
    className: "ff-alert ys-alert"
  }, React.createElement(EventIcon, {
    name: "fuel"
  }), React.createElement("span", null, React.createElement("strong", null, "Fill up before Big Stump or Ash Mountain."), " There are no gas stations, charging stations or repair shops inside Sequoia and Kings Canyon. Gas may be sold in the national forest at Hume Lake; call ahead at (559) 305-7770.")), React.createElement("p", {
    className: "ff-alert ys-alert"
  }, React.createElement(EventIcon, {
    name: "signal"
  }), React.createElement("span", null, React.createElement("strong", null, "No signal."), " The parks say there is no cell service throughout, and recommend printed maps for directions. A 911 call can still go through on any network.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ys-drives",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "DRIVE TIMES"), React.createElement("h2", null, "The legs, by the Park Service's clock"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Yosemite to the southern parks."), " Yosemite's driving page carries a table of drive times to Sequoia and Kings Canyon: about 150 miles and 3 hours 30 minutes to Grant Grove by Highway 41, about 175 miles and 4 hours to Lodgepole and Giant Forest by Highways 41 and 180, and about 180 miles and 4 hours to Cedar Grove. The table does not say where it starts; its other rows read like times from Yosemite Valley. From the Valley to the South Entrance is a little more than an hour by the same page, so most of that leg is the run south of the park."), React.createElement("p", null, React.createElement("strong", null, "Inside Sequoia and Kings Canyon."), " The parks give an hour from the Ash Mountain entrance to Lodgepole, 45 minutes to an hour from Lodgepole to Grant Grove, and 45 minutes to an hour from Grant Grove down Highway 180 to Cedar Grove and Roads End. To drive the Generals Highway gate to gate, they say, allow at least two hours; Cedar Grove adds \"quite a bit more.\" Their figures from Ash Mountain to Cedar Grove run three to three and a half hours, depending on the page."), React.createElement("p", null, React.createElement("strong", null, "This fall."), " The parks' conditions page, updated October 13, 2026, reports delays of up to 30 minutes on the Generals Highway between Highway 180 and Giant Forest, including the Sherman Tree area. Build it in. The in-park road line is (559) 565-3341, press 1, then 1 again; Caltrans covers the highways outside at (800) 427-7623."), React.createElement("p", null, React.createElement("strong", null, "Never as a day trip."), " Put the numbers together and Giant Forest and back from Yosemite is about eight hours of driving before you have walked anywhere. Our ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "gateway towns comparison"), " makes the same call from the town side: sleep on the Sequoia side at least one night.")), React.createElement("div", null, React.createElement("h3", {
    className: "ys-sched__head"
  }, "From Yosemite, per Yosemite's table"), React.createElement("table", {
    className: "ys-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "To"), React.createElement("th", {
    scope: "col"
  }, "Route"), React.createElement("th", {
    scope: "col"
  }, "Time"), React.createElement("th", {
    scope: "col"
  }, "Miles"))), React.createElement("tbody", null, FROM_YOSEMITE.map(r => React.createElement("tr", {
    key: r.to
  }, React.createElement("th", {
    scope: "row"
  }, r.to), React.createElement("td", null, r.by), React.createElement("td", null, r.time), React.createElement("td", null, r.dist))))), React.createElement("h3", {
    className: "ys-sched__head ys-sched__head--gap"
  }, "Inside Sequoia and Kings Canyon"), React.createElement("ol", {
    className: "ff-hours ys-legs"
  }, INSIDE.map(l => React.createElement("li", {
    key: l.leg
  }, React.createElement("span", null, l.leg), React.createElement("p", null, React.createElement("strong", null, l.time, "."), " ", l.note))))))), React.createElement("section", {
    className: "ff-band",
    id: "ys-passes",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ENTRANCE PASSES"), React.createElement("h2", null, "Two passes, or one card"), React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Yosemite."), " A private vehicle pays $35, good for seven consecutive days. A motorcycle is $30, and anyone on foot, bicycle or a non-commercial bus is $20 a person; 15 and under are free. Yosemite is not using a timed-entry reservation in 2026, the park announced in February."), React.createElement("p", null, React.createElement("strong", null, "Sequoia and Kings Canyon."), " One pass covers both parks: $35 for a private vehicle, good for one to seven days; $30 for a motorcycle; $20 a person on foot or bicycle, with under-16s free. The same pass covers the Hume Lake area of Sequoia National Forest and Giant Sequoia National Monument. The entrance stations take cards only. If you only have cash, the parks say you can buy the $35 vehicle pass at Sequoia Parks Conservancy stores before you enter."), React.createElement("p", null, React.createElement("strong", null, "The card that covers all three."), " The America the Beautiful annual pass is $80 for U.S. residents and $250 for nonresidents, and it covers every national park for a year. Each park also sells its own $70 annual pass, which is no use to you at the other."), React.createElement("p", null, React.createElement("strong", null, "Visitors from outside the U.S."), " Both parks now charge nonresidents 16 and older a $100 per-person fee on top of the standard entrance fee, and both waive it for anyone with an America the Beautiful pass. That changes the arithmetic sharply. Two nonresident adults in one car would pay $35 plus $200 at Yosemite and the same again at Sequoia and Kings Canyon, $470 in all, against $250 for the nonresident card. Yosemite's page says the fee does not apply to anyone admitted with the pass; confirm at the gate how that works for your group. Our ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget"
  }, "trip cost breakdown"), " works through the rest of the budget."), React.createElement("p", null, React.createElement("strong", null, "For one U.S. carload"), ", the two vehicle passes come to $70, and the $80 card pays off only if you will enter another fee park within the year. That is a closer call than it looks: a third park on the drive home, or a second trip, settles it."))), React.createElement("div", null, React.createElement("article", {
    className: "ff-inpark ys-passcard"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT YOU PAY"), React.createElement("h3", null, "The passes, side by side"), React.createElement("dl", null, PASSES.map(p => React.createElement("div", {
    key: p.name
  }, React.createElement("dt", null, p.name), React.createElement("dd", null, React.createElement("strong", null, p.price), " · ", p.note)))), React.createElement("p", {
    className: "ff-note"
  }, "Nonresidents 16 and older pay $100 each at each park on top of the entrance fee, unless they hold an America the Beautiful pass.")), React.createElement("p", {
    className: "ff-alert ys-alert"
  }, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("span", null, React.createElement("strong", null, "Cards only at the southern gates."), " Sequoia and Kings Canyon's entrance stations are cashless. Carry a card, or buy a pass ahead.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ys-plans",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ITINERARIES"), React.createElement("h2", null, "Four days, six days, and the winter version"), React.createElement("div", {
    className: "ys-plans"
  }, React.createElement("article", {
    className: "ys-plan"
  }, React.createElement("p", {
    className: "ys-plan__len"
  }, "Four days"), React.createElement("h3", null, "The one-way loop"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Day 1."), " Yosemite Valley."), React.createElement("li", null, React.createElement("strong", null, "Day 2."), " The rim or the high country, as the season allows."), React.createElement("li", null, React.createElement("strong", null, "Day 3."), " South to the Mariposa Grove, then Highway 41 and Highway 180 to Grant Grove."), React.createElement("li", null, React.createElement("strong", null, "Day 4."), " The Generals Highway to Giant Forest and the Sherman Tree; leave by Ash Mountain."))), React.createElement("article", {
    className: "ys-plan"
  }, React.createElement("p", {
    className: "ys-plan__len"
  }, "Five or six days"), React.createElement("h3", null, "Add the canyon"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Days 1 to 3."), " Yosemite at the pace of our three-day plan."), React.createElement("li", null, React.createElement("strong", null, "Day 4."), " South via the Mariposa Grove to Grant Grove."), React.createElement("li", null, React.createElement("strong", null, "Day 5."), " Highway 180 down to Cedar Grove and Roads End, May to mid-November."), React.createElement("li", null, React.createElement("strong", null, "Day 6."), " Giant Forest; leave by Ash Mountain."))), React.createElement("article", {
    className: "ys-plan is-winter"
  }, React.createElement("p", {
    className: "ys-plan__len"
  }, "Early January to mid-March"), React.createElement("h3", null, "The winter version"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Days 1 and 2."), " The Valley and the grove on foot."), React.createElement("li", null, React.createElement("strong", null, "Day 3."), " Choose one southern park. Grant Grove from Big Stump, or Giant Forest from Ash Mountain."), React.createElement("li", null, React.createElement("strong", null, "Day 4."), " The same side again. The road between them is closed.")))), React.createElement("div", {
    className: "ff-split ys-plans__prose"
  }, React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Four days."), " Spend the first two in Yosemite the way ", React.createElement("a", {
    href: "/articles/yosemite-in-three-to-five-days"
  }, "our three-to-five-day plan"), " lays out its opening: the Valley on day one, then the Glacier Point rim or Tioga Road on day two, depending on which road is open. On day three, leave south. The ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "Mariposa Grove"), " sits just inside the South Entrance, and it is the right warm-up for the bigger groves: park at the Welcome Plaza, which has about 300 spaces and may fill by late morning, and take the shuttle, or walk the two miles up. Then drive on to Grant Grove for the General Grant Tree and the night. On day four, take the Generals Highway south to Giant Forest, see the Sherman Tree, and leave by Ash Mountain and Highway 198."), React.createElement("p", null, React.createElement("strong", null, "Five or six days."), " Give Yosemite a third day, and give Kings Canyon one of its own. Highway 180 below Grant Grove drops into the canyon, the Park Service says, past Junction View, Grizzly Falls and Roaring River Falls to Zumwalt Meadow and Roads End, with its river trails and Muir Rock. The road to Cedar Grove is typically open from May through early to mid-November, so this version is a summer and early fall trip."), React.createElement("p", null, React.createElement("strong", null, "Winter."), " From early January to mid-March the Generals Highway between the parks is usually closed. Treat Sequoia and Kings Canyon as two destinations and pick one. Grant Grove is the shorter drive from Yosemite. Giant Forest is a long way around: the detour from Grant Grove is about 118 miles and three hours. In Yosemite, the Mariposa Grove road is closed to cars from late November until at least April 1 and the shuttle does not run from December 1 until at least April 15, so the grove is a two-mile walk each way, on snow or ice some days. Sequoia and Kings Canyon say chains can be required on park roads at any time; carry them, and read Yosemite's own chain rules before a winter trip.")), React.createElement("figure", {
    className: "ys-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/mariposa-grove-grizzly-giant-nieves.jpg",
    style: {
      aspectRatio: "4 / 5",
      objectPosition: "50% 40%"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The Grizzly Giant, a giant sequoia in Yosemite's Mariposa Grove, its massive trunk rising above the forest floor"
  }), React.createElement("figcaption", null, "The Grizzly Giant in the Mariposa Grove, on the way out of Yosemite toward the southern parks. Photo: Nieves / Pexels")))), React.createElement("section", {
    className: "ff-band",
    id: "ys-seasons",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SEASONS"), React.createElement("h2", null, "The calendar decides how much you can link"), React.createElement("ol", {
    className: "ys-seasons"
  }, SEASONS.map(s => React.createElement("li", {
    key: s.name,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split ys-when"
  }, React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Late May or June to October."), " Yosemite's Tioga Road is open from late May or June through October, depending on conditions, and Cedar Grove's road is open from May. This is the only stretch when one trip can take in the Valley, the high country, both southern parks and the canyon. It is also when the free Sequoia shuttles run in Giant Forest and Lodgepole; in 2026 the summer service ran May 22 to September 7. There are no shuttles in Kings Canyon."), React.createElement("p", null, React.createElement("strong", null, "November and December."), " Tioga Road closes, Cedar Grove closes in early or mid-November, and the Mariposa Grove shuttle stops by November 30 at the latest. The Generals Highway usually stays open through December, so the four-day loop still works, shorter and colder. Sequoia runs free holiday shuttles on a few dates, from 10 am to 4:30 pm."), React.createElement("p", null, React.createElement("strong", null, "Early January to mid-March."), " The Generals Highway between the parks is usually closed, and it can close at other times when snow makes it impassable. The parks say that when chain controls are on, speed limits drop to 25 mph and travel takes much longer than their tables show."), React.createElement("p", null, React.createElement("strong", null, "Spring."), " The road between the parks reopens around mid-March, the Mariposa Grove shuttle starts no earlier than April 15, and Cedar Grove opens in May. Every one of these dates moves with the snow; the parks say so on each page.")), React.createElement("div", null, React.createElement("h3", {
    className: "ys-sched__head"
  }, "What is open when"), React.createElement("table", {
    className: "ys-table ys-table--open"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Road or service"), React.createElement("th", {
    scope: "col"
  }, "Typical season"), React.createElement("th", {
    scope: "col"
  }, "Source"))), React.createElement("tbody", null, OPEN.map(([what, when, src]) => React.createElement("tr", {
    key: what
  }, React.createElement("th", {
    scope: "row"
  }, what), React.createElement("td", null, when), React.createElement("td", null, src))))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ys-stay",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE TO SLEEP"), React.createElement("h2", null, "Three beds, and where to put them"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "In Yosemite."), " For a trip that leaves by the South Entrance, the south side of the park and the towns on Highway 41 cut the most driving off day three. Our ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "gateway towns comparison"), " names Oakhurst as the pivot between the parks; the ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay guide"), " covers the in-park options."), React.createElement("p", null, React.createElement("strong", null, "In Kings Canyon."), " Grant Grove has the John Muir Lodge, 36 rooms, usually open spring through fall, and the Grant Grove Cabins at 6,500 feet. Cedar Grove Lodge, 21 rooms at 4,600 feet, is generally open spring through fall, with the canyon road. All three book through the parks' lodging operator at visitsequoia.com or (866) 807-3598."), React.createElement("p", null, React.createElement("strong", null, "In Sequoia."), " Wuksachi Lodge, 102 rooms at 7,050 feet near Giant Forest, books the same way. The parks recommend reserving rooms well ahead, and campsites through Recreation.gov. Below the Ash Mountain gate, Three Rivers is the town at the Sequoia end of the trip, and Visalia, 36 miles and about 45 minutes from the entrance, is the larger one."), React.createElement("p", null, React.createElement("strong", null, "The order that works."), " On the four-day loop: two nights in or near Yosemite, one in Grant Grove, then drive out. On the six-day version, a second Kings Canyon night lets you do Cedar Grove without driving it twice in a day.")), React.createElement("div", {
    className: "ys-stay"
  }, React.createElement(LodgingCta, {
    destination: "Sequoia National Park",
    heading: "Rooms at the Sequoia end",
    note: "The in-park lodges in Grant Grove, Cedar Grove and Giant Forest book through visitsequoia.com and are the first place to look. When they are full, a search shows what is left in Three Rivers, Visalia and along Highway 180.",
    list: "article_cta",
    slug: "yosemite-sequoia-kings-canyon-trip",
    cta: "Search lodging near Sequoia →"
  })))), React.createElement("section", {
    className: "ff-band",
    id: "ys-arrive",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FLYING IN"), React.createElement("h2", null, "Fresno sits in the middle"), React.createElement("div", {
    className: "ys-prose"
  }, React.createElement("p", null, "Fresno Yosemite International is the one airport between all three parks. The southern parks put it 1¼ hours from the Kings Canyon entrance on Highway 180 and 1¾ hours from the Sequoia entrance on Highway 198. Yosemite's driving page puts Fresno 94 miles and 2 hours 15 minutes from the Valley by Highway 41. Visalia's small airport is an hour from the Sequoia entrance."), React.createElement("p", null, "From the big coastal airports, the parks give 250 miles and 4 hours 30 minutes from San Francisco to Big Stump and 225 miles and 4 hours from the Los Angeles area to Ash Mountain. Yosemite's page gives San Francisco to Yosemite by Highway 120 at 195 miles and 4 hours. Flying into one coast city and out of the other turns the loop into a straight line; ", React.createElement("a", {
    href: "/articles/best-airport-for-yosemite"
  }, "our airport guide"), " compares them."), React.createElement("p", null, "Amtrak stops in Fresno and Hanford; the parks put each about an hour and 45 minutes from an entrance. Without a car, the paid Sequoia Shuttle runs from Visalia to Giant Forest in summer by reservation at sequoiashuttle.com. There is no public link between Yosemite and the southern parks that we could find on either park's pages; plan on a car."))), React.createElement("ul", {
    className: "ff-rules ys-rules"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "fuel",
    size: 26
  }), React.createElement("strong", null, "Gas outside."), React.createElement("p", null, "None inside Sequoia and Kings Canyon. Fill in Oakhurst, Fresno or Three Rivers.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Print the map."), React.createElement("p", null, "No cell service in the southern parks.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Carry chains."), React.createElement("p", null, "They can be required on park roads at any time it snows.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Long rig, Highway 180."), React.createElement("p", null, "The 22-foot advisory below Giant Forest. Use Big Stump."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ys-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite, Sequoia and Kings Canyon, answered"), React.createElement("div", {
    className: "ys-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/driving.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Driving times and directions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Entrance fees, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mg.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/driving-directions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Driving directions, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/directions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Directions and transportation, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees and passes, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Current conditions, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/driveviewsum.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Summer drives and viewpoints, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/faqs.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Frequently asked questions, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/hours.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Operating hours and seasons, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/kings-canyon-national-park.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Kings Canyon National Park, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/parktransit.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Park shuttles, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Sequoia and Kings Canyon")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/seki/learn/news/upload/Trip_Planner_2025-2026_Winter_2025-12-09_for_web.pdf",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Winter Trip Planner 2025-2026, NPS Sequoia and Kings Canyon (PDF)"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap ys-end"
  }, React.createElement(AffiliateNote, null)));
};
