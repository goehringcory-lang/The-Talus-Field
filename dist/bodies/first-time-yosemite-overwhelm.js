window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["first-time-yosemite-overwhelm"] = function FirstTimeYosemiteBody() {
  var TOC = [["#ft-timing", "Timing"], ["#sec-0-research-the-real-kind", "Three things"], ["#sec-3-three-questions-before-you-book-anything", "Three questions"], ["#sec-4-how-many-days-do-you-need-in-yosemite", "How many days"], ["#sec-5-the-best-time-to-visit-yosemite-for-a-first-trip", "Best month"], ["#sec-6-where-should-you-stay-in-yosemite-for-the-first-time", "Where to stay"], ["#sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order", "What to see, in order"], ["#sec-8-what-it-costs-to-get-in", "Fees and reservations"], ["#sec-9-first-time-mistakes-to-avoid", "Mistakes"], ["#sec-10-common-questions", "Questions"]];
  var FAQ = [["What should I figure out before planning a Yosemite trip?", "Three things, before you book anything: what season you are visiting and what is open then, which two of granite, waterfalls, old-growth, high country, and solitude matter most to you, and what your backup plan is when the park does not cooperate."], ["How long should I spend in Yosemite for a first trip?", "Two full days at minimum. Three to four is better, giving you the Valley properly and one full day elsewhere at Glacier Point, the Mariposa Grove, or on Tioga Road. A single day works if you start early and stay in the Valley."], ["What month is best for visiting Yosemite for the first time?", "Late May and June for peak waterfalls with every road usually open; September and October for thin crowds and low gold light. July and August are hot and crowded. April has waterfalls and fewer people but Tioga Road and Glacier Point Road are usually still closed."], ["Do I need a reservation to enter Yosemite in 2026?", "No. There is no day-use or timed-entry reservation in 2026. You need a standard entrance pass, $35 per vehicle for seven days."], ["Where should I stay in Yosemite for the first time?", "Mariposa is the most practical first-timer choice: 45 minutes to an hour from the Valley, a real downtown, and the year-round Highway 140 road. El Portal is closer but smaller and more expensive. In-park lodging books 366 days ahead and fills fast for summer."], ["How much driving is involved in a Yosemite trip?", "More than most people expect. A gateway town to the Valley is 25 to 90 minutes each way, and Glacier Point Road or Tioga Road each add an hour or more inside the park."], ["Is there an extra fee for international visitors in 2026?", "Yes. Since January 1, 2026, visitors who are not U.S. residents pay a $100 surcharge per person age 16 and older on top of the standard entrance fee. A $250 nonresident annual pass waives it. U.S. residents are unaffected."]];
  var TWO_WAYS = [["Tunnel View", "eye", "One in the afternoon in July. The lot is full, the overlook is three-deep, and the photo goes over a stranger's shoulder.", "First light, the first stop of the day. At the right hour in the right month you can have it nearly to yourself."], ["Glacier Point", "mountain", "Driven during a smoke event, with Half Dome seen through gauze.", "Late afternoon on a second day, when the light is on Half Dome rather than behind it. In smoke, drive Tioga Road instead."], ["The Mist Trail", "walk", "Hiked in a conga line, as a first-morning warm-up.", "Treated as what it is, a real climb of about 1,000 feet on wet granite steps, and kept off the first morning."], ["The Mariposa Grove", "tree", "The busiest hour of the busiest day, never once alone beside a 2,500-year-old tree.", "The first shuttle of the morning or the last hour before it stops. Never at noon."]];
  var WANTS = [["mountain", "Granite"], ["drop", "Waterfalls"], ["tree", "Old-growth"], ["route", "High country"], ["eye", "Wilderness solitude"]];
  var MONTHS = [["Jan", "winter", "Winter"], ["Feb", "winter", "Winter"], ["Mar", "winter", "Winter"], ["Apr", "valley", "Falls, Valley only"], ["May", "best", "Best, late May"], ["Jun", "best", "Best"], ["Jul", "hot", "Hot, crowded"], ["Aug", "hot", "Hot, crowded"], ["Sep", "good", "Second best"], ["Oct", "good", "Second best"], ["Nov", "valley", "High roads close"], ["Dec", "winter", "Winter"]];
  var MONTH_KEY = {
    best: "Falls at or near peak, every road usually open",
    good: "Thin crowds, low gold light, every road still open, little water in the falls",
    hot: "Hot and the most crowded; the relief is elevation",
    valley: "The high roads are usually closed: a Valley trip",
    winter: "Its own park, quiet: the Valley, Wawona and Hetch Hetchy"
  };
  var MAP_W = 1760,
    MAP_H = 1410;
  var PINS = [{
    n: "V",
    at: [690, 647],
    name: "Yosemite Valley",
    valley: true
  }, {
    n: "1",
    at: [283, 858],
    name: "El Portal"
  }, {
    n: "2",
    at: [30, 905],
    name: "Mariposa, off the map on Highway 140"
  }, {
    n: "3",
    at: [575, 1380],
    name: "Oakhurst, off the map on Highway 41"
  }, {
    n: "4",
    at: [1648, 95],
    name: "Lee Vining, over Tioga Road"
  }];
  var pct = (x, y) => ({
    left: x / MAP_W * 100 + "%",
    top: y / MAP_H * 100 + "%"
  });
  var TOWNS = [["1", "El Portal", 25, 35, "Highway 140", "Closer, and priced like it", "good"], ["2", "Mariposa", 45, 60, "Highway 140, the year-round road", "The default for a first trip", "best"], ["3", "Oakhurst", 75, 90, "Highway 41", "Right for the Mariposa Grove, wrong for a Valley trip", "warn"], ["4", "Lee Vining", 90, null, "Tioga Road, closed in winter", "A high-country base, not a Valley base", "bad"]];
  var SCALE = 120;
  function StayMap() {
    return React.createElement("figure", {
      className: "ft-map"
    }, React.createElement("div", {
      className: "ft-map__frame"
    }, React.createElement(ResponsiveImage, {
      image: "img/nps-yosemite-stay-map.jpg",
      className: "ft-map__img",
      sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
      style: {
        aspectRatio: "1760 / 1410"
      },
      alt: "National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove. Yosemite Valley is marked V. El Portal is pin 1, just west of the park on Highway 140. Mariposa, pin 2, and Oakhurst, pin 3, are off the map, where Highways 140 and 41 leave it. Lee Vining, pin 4, is at the top right, east of Tioga Pass."
    }), React.createElement("div", {
      className: "ft-map__layer",
      "aria-hidden": "true"
    }, PINS.map(p => React.createElement("span", {
      key: p.n,
      className: "ft-pin" + (p.valley ? " is-valley" : ""),
      style: pct(p.at[0], p.at[1])
    }, React.createElement("b", null, p.n))))), React.createElement("figcaption", null, React.createElement("ol", {
      className: "ft-map__key"
    }, PINS.map(p => React.createElement("li", {
      key: p.n,
      className: p.valley ? "is-valley" : ""
    }, React.createElement("b", null, p.n), " ", p.name))), React.createElement("span", null, "Pins are approximate. Map: National Park Service (public domain), cropped.")));
  }
  return React.createElement("div", {
    className: "ft-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "A first trip needs"), React.createElement("dd", null, "Two full days, three or four if you can")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "Best months"), React.createElement("dd", null, "Late May and June, then Sep and Oct")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Entry in 2026"), React.createElement("dd", null, "No reservation. $35 a car")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "bed"
  }), React.createElement("dt", null, "Book first"), React.createElement("dd", null, "Where you sleep"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ft-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Somewhere on the internet there is a guide (probably half a dozen) telling you that on your first trip to Yosemite you need to see Tunnel View, Cook's Meadow, Glacier Point, the Mariposa Grove, and Tuolumne Meadows. Maybe Half Dome. Maybe El Capitan. The list is always pretty much the same."), React.createElement("p", null, "I'm not going to argue with the list."), React.createElement("p", null, "Those places are on every list for a reason. Tunnel View is the view that helped build the modern conservation movement. El Capitan is roughly three thousand feet of unbroken granite you can stand at the base of and crane your neck back until it hurts. The Mariposa Grove is where giant sequoias have been growing since before the Roman Empire. Cook's Meadow holds one of the most photographed compositions in American landscape photography, and Glacier Point puts you at about 7,200 feet looking straight down into the Valley with Half Dome at eye level. Tuolumne Meadows in late June will change your idea of what a high-altitude meadow looks like."), React.createElement("p", null, "These places earned their fame. Don't skip them. I'm a senior naturalist who has worked in this park for close to two decades, and I still pull over at Tunnel View almost every time I drive past."), React.createElement("p", {
    className: "ft-turn"
  }, "What most guides leave out is timing.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Give it two full days. Three or four leaves room for the plan to change."), React.createElement("li", null, "Come in late May or June. September and October are the second-best answer."), React.createElement("li", null, "Book the bed first: in the park 366 days out, or Mariposa."), React.createElement("li", null, "Be through the gate before 8 a.m. Tunnel View first."), React.createElement("li", null, "No entry reservation in 2026. $35 a car, cards only.")), React.createElement("a", {
    className: "ft-short__link",
    href: "#sec-3-three-questions-before-you-book-anything"
  }, "Three questions before you book")))), React.createElement("section", {
    className: "ff-band",
    id: "ft-timing",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BUSIEST VERSION OF THE BUSIEST PLACES"), React.createElement("h2", null, "The list is right. The hour is wrong."), React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "Most people visit these places the worst way they could. They arrive at Tunnel View at one in the afternoon in July, find the lot full and the overlook three-deep, take a photo over a stranger's shoulder, and leave. They drive Glacier Point Road during a smoke event and see Half Dome through gauze. They hike the Mist Trail in a conga line. They walk through the Mariposa Grove at the busiest hour of the busiest day and never once stand alone next to a 2,500-year-old tree."), React.createElement("p", null, "Then they go home and tell their friends Yosemite was beautiful, but crowded. And it was. They visited the busiest version of the busiest places at the busiest time.")), React.createElement("blockquote", {
    className: "ft-quote"
  }, "The bucket list isn't the problem. The strategy is.")), React.createElement("figure", {
    className: "ft-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tunnel-view-autumn-aniket-deole.jpg",
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    style: {
      aspectRatio: "4 / 3"
    },
    alt: "Tunnel View in autumn: El Capitan on the left, Bridalveil Fall on the right, and fresh snow on Half Dome and the peaks at the far end of the Valley"
  }), React.createElement("figcaption", null, "Tunnel View, the stop most first trips get wrong by a few hours. Photo: Aniket Deole / Unsplash"))), React.createElement("h3", {
    className: "ft-subhead"
  }, "Same place, two ways"), React.createElement("ul", {
    className: "ft-ways"
  }, TWO_WAYS.map(([place, icon, usual, better]) => React.createElement("li", {
    key: place
  }, React.createElement("p", {
    className: "ft-ways__head"
  }, React.createElement(EventIcon, {
    name: icon,
    size: 24
  }), " ", place), React.createElement("div", {
    className: "ft-ways__usual"
  }, React.createElement("span", null, "The usual way"), React.createElement("p", null, usual)), React.createElement("div", {
    className: "ft-ways__better"
  }, React.createElement("span", null, "The better way"), React.createElement("p", null, better))))), React.createElement("p", {
    className: "ff-note"
  }, "Each \"better way\" is the order and the hour laid out ", React.createElement("a", {
    href: "#sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order"
  }, "further down"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section ft-three"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THREE THINGS"), React.createElement("p", {
    className: "ff-lede"
  }, "In my experience, three things turn a Yosemite visit from \"we saw the things\" into \"that was one of the best weeks of my life.\""), React.createElement("article", {
    className: "ft-thing",
    id: "sec-0-research-the-real-kind",
    tabIndex: -1
  }, React.createElement("p", {
    className: "ft-thing__num",
    "aria-hidden": "true"
  }, "1"), React.createElement("div", {
    className: "ft-thing__body"
  }, React.createElement("h2", null, "Research, the real kind"), React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "The first is ", React.createElement("strong", null, "research"), ". Not the first three results on Google. Yosemite's seasons work differently than almost anywhere else in the United States. None of what follows is a secret. But a trip planned around it and a trip that ignores it are two different trips."), React.createElement("p", null, "The same holds for a single week. The fall 2026 Yosemite Guide, the park's own newspaper for September 23 to November 24, is a good example: none of what it says is on the standard bucket list, and all of it decides what a good day looks like. The ", React.createElement("a", {
    href: "/now"
  }, "Park Bulletin"), " tracks what's current in the park (closures, hours, trail status) so you don't have to dig for it."))), React.createElement("div", {
    className: "ft-ledgers"
  }, React.createElement("div", {
    className: "ft-ledger"
  }, React.createElement("p", {
    className: "ft-ledger__head"
  }, React.createElement(EventIcon, {
    name: "calendar",
    size: 20
  }), " Every year"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Tioga Road"), ", the highway to Tuolumne, opens in late May or early June, and in heavy snow years not until July."), React.createElement("li", null, React.createElement("strong", null, "The waterfalls"), " peak in May and are mostly dry by August."), React.createElement("li", null, React.createElement("strong", null, "High-country wildflowers"), " can bloom six weeks after the Valley floor's."), React.createElement("li", null, React.createElement("strong", null, "Smoke"), " from regional fires can hide the views for weeks at a time."))), React.createElement("div", {
    className: "ft-ledger ft-ledger--now"
  }, React.createElement("p", {
    className: "ft-ledger__head"
  }, React.createElement(EventIcon, {
    name: "alert",
    size: 20
  }), " The fall 2026 Guide"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "The Mist Trail"), ", the most hiked trail in the park, is closed for repairs Monday through Thursday, 7 a.m. to 3:30 p.m., through the end of October."), React.createElement("li", null, React.createElement("strong", null, "Yosemite Falls"), " is down to a late-season trickle, and ", React.createElement("strong", null, "Mirror Lake"), " is a meadow."), React.createElement("li", null, React.createElement("strong", null, "Bridalveil Fall"), " is still worth the stop."), React.createElement("li", null, React.createElement("strong", null, "Tioga Road and Glacier Point Road"), " are open until the first serious snow closes them for winter."))))), React.createElement("article", {
    className: "ft-thing",
    id: "sec-1-knowing-what-you-actually-want",
    tabIndex: -1
  }, React.createElement("p", {
    className: "ft-thing__num",
    "aria-hidden": "true"
  }, "2"), React.createElement("div", {
    className: "ft-thing__body"
  }, React.createElement("h2", null, "Knowing what you actually want"), React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "The second is ", React.createElement("strong", null, "knowing what you actually want."), " A lot of first-time visitors arrive with a kind of unspoken plan to \"see Yosemite,\" which is a little like booking a trip to \"see California.\" You don't need to know everything about the park to plan a good trip. You do need to know something about yourself."))), React.createElement("div", {
    className: "ft-asks"
  }, React.createElement("p", {
    className: "ft-asks__head"
  }, "Ask yourself"), React.createElement("ul", null, React.createElement("li", null, "Are you here for granite and waterfalls?"), React.createElement("li", null, "Are you here to walk in old-growth forest?"), React.createElement("li", null, "Do you want quiet alpine lakes you have to earn?"), React.createElement("li", null, "Do you want to drive to your views, or hike to them?"), React.createElement("li", null, "Are you bringing kids who can't go more than two miles?")))), React.createElement("article", {
    className: "ft-thing",
    id: "sec-2-being-willing-to-flex",
    tabIndex: -1
  }, React.createElement("p", {
    className: "ft-thing__num",
    "aria-hidden": "true"
  }, "3"), React.createElement("div", {
    className: "ft-thing__body"
  }, React.createElement("h2", null, "Being willing to flex"), React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "The third is ", React.createElement("strong", null, "being willing to flex."), " The best decision I've seen first-time visitors make comes two days into a five-day trip. They realize the Yosemite they planned for isn't the one they're getting, and they change the plan. Yosemite rewards adaptability. The trip you plan from your kitchen table is rarely the trip the park is going to give you."))), React.createElement("ul", {
    className: "ft-swaps"
  }, React.createElement("li", null, React.createElement("span", {
    className: "ft-swaps__if"
  }, "Crowds heavier than expected?"), React.createElement("span", {
    className: "ft-swaps__from"
  }, "Vernal Fall"), React.createElement("span", {
    className: "ft-swaps__arrow",
    "aria-hidden": "true"
  }, "→"), React.createElement("span", {
    className: "ft-swaps__to"
  }, "Wapama Falls")), React.createElement("li", null, React.createElement("span", {
    className: "ft-swaps__if"
  }, "Smoke rolling in from the west?"), React.createElement("span", {
    className: "ft-swaps__from"
  }, "Glacier Point"), React.createElement("span", {
    className: "ft-swaps__arrow",
    "aria-hidden": "true"
  }, "→"), React.createElement("span", {
    className: "ft-swaps__to"
  }, "Tioga Pass"))))), React.createElement("section", {
    className: "ff-band ft-pitch"
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT THIS SITE IS FOR"), React.createElement("h2", null, "This site is for the people willing to do all three"), React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "What I hope to do here is explain Yosemite as it actually works, which takes more room than most guides have. You can check off the El Capitan box and the Half Dome box and the Mariposa Grove box and feel great about it. You should. But the reason to do the work (the research, the self-knowledge, the flexibility) is that a little effort turns the same trip into something else."))), React.createElement("div", null, React.createElement("ul", {
    className: "ft-cans"
  }, React.createElement("li", null, "You can stand at Tunnel View at the right hour, in the right month, and have it nearly to yourself."), React.createElement("li", null, "You can walk into a sequoia grove with no one in earshot."), React.createElement("li", null, "You can hike a trail two miles off the standard list and not see another human all afternoon."), React.createElement("li", null, "You can see one of the busiest national parks in the country the way it's meant to be seen. Quiet, wild, weird, alive.")), React.createElement("p", {
    className: "ft-signoff"
  }, "That's the whole pitch."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-3-three-questions-before-you-book-anything",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BEFORE YOU BOOK ANYTHING"), React.createElement("h2", null, "Three questions, before you book anything"), React.createElement("p", {
    className: "ff-lede"
  }, "Before you book anything (a hotel in Mariposa, ", React.createElement("a", {
    href: "/articles/camping-in-yosemite-first-time"
  }, "a campsite in the Valley"), ", a Glacier Point tour, a seat on YARTS, the regional bus into the park), sit with three questions."), React.createElement("ol", {
    className: "ft-questions"
  }, React.createElement("li", null, React.createElement("span", {
    className: "ft-questions__num"
  }, "1"), React.createElement("strong", null, "What season are you actually planning to visit, and do you know what's open and what isn't in that season?"), React.createElement("a", {
    href: "#sec-5-the-best-time-to-visit-yosemite-for-a-first-trip"
  }, "The year, month by month")), React.createElement("li", null, React.createElement("span", {
    className: "ft-questions__num"
  }, "2"), React.createElement("strong", null, "Which two matter most to you?"), React.createElement("span", {
    className: "ft-wants"
  }, WANTS.map(([icon, label]) => React.createElement("span", {
    key: label,
    className: "ft-want"
  }, React.createElement(EventIcon, {
    name: icon,
    size: 16
  }), " ", label))), React.createElement("p", null, "You can have all of them on one trip, but the order you visit them in matters.")), React.createElement("li", null, React.createElement("span", {
    className: "ft-questions__num"
  }, "3"), React.createElement("strong", null, "What's your plan if your plan doesn't work?"), React.createElement("a", {
    href: "/now"
  }, "What's open in the park this week"))), React.createElement("div", {
    className: "ft-prose ft-prose--wide ft-after"
  }, React.createElement("p", null, "Answer those three, and we can build the rest of the trip together. Skip them, and you'll have the same forgettable trip everyone else is having."), React.createElement("p", null, "The good news is that the work pays off. Yosemite is the birthplace of the national park idea. I've spent twenty years trying to explain what it's like to stand in it at the right time, and I haven't quite managed it. The next best thing I can do is help you plan a trip where you have a real shot at finding out yourself. That's what this whole site is for."), React.createElement("p", null, "What follows is the practical half: the questions every first-time visitor asks, in the order they come up, with the short answer here and the long answer one link away."))), React.createElement("section", {
    className: "ff-band",
    id: "sec-4-how-many-days-do-you-need-in-yosemite",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW LONG"), React.createElement("h2", null, "How many days do you need in Yosemite the first time?"), React.createElement("p", {
    className: "ff-lede"
  }, "Two full days is the honest minimum for a first visit. The second day is where the trip stops being a checklist."), React.createElement("ol", {
    className: "ft-days"
  }, React.createElement("li", null, React.createElement("span", {
    className: "ft-days__n"
  }, "1 day"), React.createElement("strong", null, "The Valley, properly"), React.createElement("p", null, "Started at sunrise: Tunnel View, Bridalveil Fall, the Lower Yosemite Fall loop, Cook's Meadow, and an hour on a rock by the Merced."), React.createElement("span", {
    className: "ft-days__chip is-warn"
  }, "Only if you're in by 8 a.m.")), React.createElement("li", {
    className: "is-pick"
  }, React.createElement("span", {
    className: "ft-days__n"
  }, "2 days"), React.createElement("strong", null, "The minimum"), React.createElement("p", null, "A second day leaves the Valley floor for Glacier Point, the Mariposa Grove, or Tioga Road."), React.createElement("span", {
    className: "ft-days__chip is-best"
  }, "The honest minimum")), React.createElement("li", null, React.createElement("span", {
    className: "ft-days__n"
  }, "3 to 4 days"), React.createElement("strong", null, "Room to change the plan"), React.createElement("p", null, "All of that without watching the clock, and still one day left for the plan to change."), React.createElement("span", {
    className: "ft-days__chip is-good"
  }, "Better"))), React.createElement("div", {
    className: "ft-prose ft-prose--wide ft-after"
  }, React.createElement("p", null, "Is one day enough? Yes, if you are in the park by 8 a.m. and willing to do less than the lists say. The one-day trips people regret are the ones that arrive at noon, circle the lots, and try to add Glacier Point. A day trip from San Francisco is possible, but the drive is four hours each way. Run ", React.createElement("a", {
    href: "/articles/yosemite-day-trip-from-bay-area"
  }, "the daylight arithmetic"), " before you commit to it."), React.createElement("p", null, React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "One day in Yosemite"), " lays out the short version stop by stop, and ", React.createElement("a", {
    href: "/articles/yosemite-in-three-to-five-days"
  }, "three to five days"), " covers the longer one.")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-5-the-best-time-to-visit-yosemite-for-a-first-trip",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN TO GO"), React.createElement("h2", null, "The best time to visit Yosemite for a first trip"), React.createElement("p", {
    className: "ff-lede"
  }, "Late May through June, if you can choose freely. The waterfalls are at or near their peak, the Valley is green, and in most years Glacier Point Road and Tioga Road have opened by then, so the whole park is on the menu."), React.createElement("figure", {
    className: "ft-months"
  }, React.createElement("figcaption", null, "A first trip, month by month"), React.createElement("ol", null, MONTHS.map(([m, tone, label]) => React.createElement("li", {
    key: m,
    className: "is-" + tone
  }, React.createElement("span", {
    className: "ft-months__m"
  }, m), React.createElement("span", {
    className: "ft-months__bar",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "ft-months__label"
  }, label)))), React.createElement("dl", {
    className: "ft-months__key"
  }, ["best", "good", "hot", "valley", "winter"].map(k => React.createElement("div", {
    key: k,
    className: "is-" + k
  }, React.createElement("dt", null, React.createElement("i", {
    "aria-hidden": "true"
  })), React.createElement("dd", null, MONTH_KEY[k]))))), React.createElement("div", {
    className: "ft-prose ft-prose--wide ft-after"
  }, React.createElement("p", null, "In 2026 the two high roads opened early, Glacier Point Road on May 9 and Tioga Road on May 15. September and October are the second-best answer: crowds thin, the light goes low and gold, every road is still open, and the only thing missing is water in the falls. July and August are hot and the most crowded, and the relief is elevation. April has the falls and fewer people, but the high roads are usually still closed, so a first trip in April is a Valley trip. Winter is its own park, quiet and lovely, but the Valley, Wawona, and Hetch Hetchy are all of it."), React.createElement("p", null, React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "The crowd forecast"), " ranks every month, and the ", React.createElement("a", {
    href: "/planning"
  }, "trip selector"), " will cap an itinerary to the roads your month allows."))), React.createElement("section", {
    className: "ff-band",
    id: "sec-6-where-should-you-stay-in-yosemite-for-the-first-time",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE TO SLEEP"), React.createElement("h2", null, "Where should you stay in Yosemite for the first time?"), React.createElement("p", {
    className: "ff-lede"
  }, "Inside the park if you can get a room, and for most people that is the catch. Whichever you pick, book before you plan anything else."), React.createElement("ul", {
    className: "ft-windows"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "bed",
    size: 24
  }), React.createElement("span", null, "In-park lodging"), React.createElement("strong", null, "366 days ahead"), React.createElement("p", null, "Yosemite Valley Lodge, Curry Village, and The Ahwahnee book through travelyosemite.com. Summer dates go on the first morning.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 24
  }), React.createElement("span", null, "Valley campsites"), React.createElement("strong", null, "The 15th, 7 a.m. Pacific"), React.createElement("p", null, "Upper, Lower and North Pines open on Recreation.gov up to five months out, and they go in minutes. ", React.createElement("a", {
    href: "/dates"
  }, "The dates page"), " works out your release day.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "pin",
    size: 24
  }), React.createElement("span", null, "Gateway towns"), React.createElement("strong", null, "Six to twelve months out"), React.createElement("p", null, "If neither works, and for a first trip they usually don't, the answer is a gateway town, one of the small towns just outside the park entrances. For summer, their rooms fill six to twelve months out."))), React.createElement("div", {
    className: "ff-split ft-stay"
  }, React.createElement(StayMap, null), React.createElement("div", null, React.createElement("h3", {
    className: "ft-subhead ft-subhead--tight"
  }, "Which town matters more than any hotel review"), React.createElement("p", {
    className: "ft-small"
  }, "They sit on different sides of the park, and their drives to the Valley differ by an hour or more. Each bar is the drive to the Valley, on a scale of zero to two hours."), React.createElement("ul", {
    className: "ft-towns"
  }, TOWNS.map(([n, town, lo, hi, road, verdict, tone]) => React.createElement("li", {
    key: town,
    className: "is-" + tone
  }, React.createElement("div", {
    className: "ft-towns__name"
  }, React.createElement("b", null, n), React.createElement("div", null, React.createElement("strong", null, town), React.createElement("span", null, road))), React.createElement("div", {
    className: "ft-towns__bar",
    role: "img",
    "aria-label": hi ? `${lo} to ${hi} minutes to the Valley` : `${lo} minutes at a minimum to the Valley`
  }, React.createElement("i", {
    style: {
      left: lo / SCALE * 100 + "%",
      width: ((hi || SCALE) - lo) / SCALE * 100 + "%"
    },
    className: hi ? "" : "is-open"
  })), React.createElement("p", {
    className: "ft-towns__time"
  }, hi ? `${lo} to ${hi} min` : `${lo} min or more`), React.createElement("p", {
    className: "ft-towns__verdict"
  }, verdict)))))), React.createElement("div", {
    className: "ff-split ft-stay-end"
  }, React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "The short version: ", React.createElement("strong", null, "Mariposa"), " is the default for a first trip, a real town on Highway 140, the year-round road, 45 minutes to an hour from the Valley. ", React.createElement("strong", null, "El Portal"), " is closer, about 25 to 35 minutes, and priced like it. ", React.createElement("strong", null, "Oakhurst"), " is right for the Mariposa Grove and wrong for a Valley trip, at 75 to 90 minutes each way. ", React.createElement("strong", null, "Lee Vining"), " is a high-country base, not a Valley base, and picking it for a Valley trip is the most common mistake I see."), React.createElement("p", null, React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "Where to stay near Yosemite"), " compares all five, and ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "the in-park lodging guide"), " covers the other side of the boundary.")), React.createElement("div", {
    className: "ft-cta"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "The decision to make first",
    note: "Of everything on this page, lodging is the only piece with a deadline attached: in-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer. Knowing what is actually left on your dates is what turns the rest of this from theory into a plan.",
    list: "article_cta",
    slug: "first-time-yosemite-overwhelm",
    cta: "See what is available on your dates →"
  }))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT TO SEE"), React.createElement("h2", null, "What to see in Yosemite the first time, in the right order"), React.createElement("p", {
    className: "ff-lede"
  }, "The list at the top of this piece is the right list. What changes the trip is the order and the hour."), React.createElement("div", {
    className: "ft-order"
  }, React.createElement("div", null, React.createElement("p", {
    className: "ft-order__day"
  }, "Day one: the Valley"), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "First light"), React.createElement("p", null, "Tunnel View.")), React.createElement("li", null, React.createElement("span", null, "Then"), React.createElement("p", null, "Bridalveil Fall.")), React.createElement("li", null, React.createElement("span", null, "Before mid-morning"), React.createElement("p", null, "The Lower Yosemite Fall loop and Cook's Meadow, before the lots fill.")))), React.createElement("div", null, React.createElement("p", {
    className: "ft-order__day"
  }, "Day two: above the floor"), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "First shuttle, or the last hour"), React.createElement("p", null, "The Mariposa Grove. Never at noon.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Late afternoon"), React.createElement("p", null, "Glacier Point, when the light is on Half Dome rather than behind it.")))), React.createElement("div", null, React.createElement("p", {
    className: "ft-order__day"
  }, "A day of its own, if Tioga is open"), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "Two hours from the Valley"), React.createElement("p", null, "Tuolumne Meadows, which deserves more than a drive-through."))))), React.createElement("p", {
    className: "ft-small ft-after"
  }, "That sequence is the backbone of the ", React.createElement("a", {
    href: "/itineraries"
  }, "one-, two-, and three-day itineraries"), " on this site, and the ", React.createElement("a", {
    href: "/map"
  }, "trip map"), " lets you rearrange it to fit your dates."), React.createElement("h3", {
    className: "ft-subhead"
  }, "Two things first-timers assume they can do, and often cannot"), React.createElement("div", {
    className: "ft-cannot"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "dome",
    size: 26
  }), React.createElement("strong", null, "Half Dome"), React.createElement("p", null, "It needs a permit while the cables are up, won by lottery in March or in a small daily lottery two days ahead. Read ", React.createElement("a", {
    href: "/articles/so-you-want-to-hike-half-dome"
  }, "the Half Dome guide"), " before you promise anyone the summit.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "walk",
    size: 26
  }), React.createElement("strong", null, "The Mist Trail"), React.createElement("p", null, "The park's most popular hike is a real climb of about 1,000 feet on wet granite steps, not a stroll to a viewpoint."))), React.createElement("p", {
    className: "ft-signoff ft-signoff--small"
  }, "Both are worth doing. Neither belongs on a first morning.")), React.createElement("section", {
    className: "ff-band",
    id: "sec-8-what-it-costs-to-get-in",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FEES AND RESERVATIONS"), React.createElement("h2", null, "What it costs to get in, and whether you need a reservation"), React.createElement("p", {
    className: "ff-lede"
  }, "You do not need a reservation to enter Yosemite in 2026. The summer reservation systems the park ran in most years from 2020 through 2025 are gone, and the Park Service now handles peak days by watching traffic and controlling parking. What you need is an entrance pass."), React.createElement("ul", {
    className: "ft-fees"
  }, React.createElement("li", null, React.createElement("span", null, "Per car, seven days"), React.createElement("strong", null, "$35")), React.createElement("li", null, React.createElement("span", null, "Per person on foot or bike"), React.createElement("strong", null, "$20")), React.createElement("li", null, React.createElement("span", null, "America the Beautiful annual pass"), React.createElement("strong", null, "$80"), React.createElement("p", null, "Worth it if you will visit more than one park this year.")), React.createElement("li", {
    className: "is-extra"
  }, React.createElement("span", null, "Non-U.S. residents, age 16 and up"), React.createElement("strong", null, "+$100"), React.createElement("p", null, "A surcharge per person since January 1, 2026, or $250 for a nonresident annual pass that waives it."))), React.createElement("div", {
    className: "ff-split ft-fees-after"
  }, React.createElement("div", {
    className: "ft-prose"
  }, React.createElement("p", null, "Buy the pass on Recreation.gov before you arrive and you'll get through the gate faster. The entrance stations take cards, not cash. ", React.createElement("a", {
    href: "/international"
  }, "The international visitor page"), " does the surcharge arithmetic for your party."), React.createElement("p", null, React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "The 2026 reservation guide"), " has the full picture, including how to plan for a park with no cap on visitors.")), React.createElement("div", {
    className: "ft-still"
  }, React.createElement("p", {
    className: "ft-still__head"
  }, React.createElement(EventIcon, {
    name: "ticket",
    size: 20
  }), " Still needs its own reservation or permit"), React.createElement("ul", null, React.createElement("li", null, "Camping"), React.createElement("li", null, "In-park lodging"), React.createElement("li", null, "Half Dome"), React.createElement("li", null, "Overnight wilderness trips")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-9-first-time-mistakes-to-avoid",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "MISTAKES"), React.createElement("h2", null, "First-time mistakes to avoid"), React.createElement("ul", {
    className: "ff-rules ft-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Arriving at ten"), React.createElement("p", null, "Valley lots fill by late morning on ordinary days and by 8 a.m. on summer weekends. Be through the gate before 8, or come after 4 p.m. ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "The parking guide"), " explains what to do once the lots are full.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Trusting the phone"), React.createElement("p", null, "Cell service is patchy in the gateway towns and mostly gone past the entrance stations, and GPS sends people onto closed roads. Download offline maps before you leave town and follow the signs. ", React.createElement("a", {
    href: "/articles/cell-service-in-yosemite"
  }, "Cell service in Yosemite"), " has the carrier-by-carrier truth.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "fuel",
    size: 26
  }), React.createElement("strong", null, "Arriving on a quarter tank"), React.createElement("p", null, "There is no gas in Yosemite Valley. The in-park pumps are at Crane Flat and Wawona; fill up in the gateway town.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "food",
    size: 26
  }), React.createElement("strong", null, "Leaving food in the car"), React.createElement("p", null, "If it stays in the car at all: out of sight, windows closed, daylight only, never overnight. Bears open cars, and the citation runs up to $5,000. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " covers the rest.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Planning Glacier Point or Tioga in April"), React.createElement("p", null, "Both roads close for the winter and reopen when plowing finishes, usually late May into June. Check the ", React.createElement("a", {
    href: "/now"
  }, "Park Bulletin"), " for the current status before you build a day around either.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Doing too much"), React.createElement("p", null, "Three things well beats seven things from the driver's seat. This is the whole argument of the essay above, and it spoils more first trips than all the other mistakes together.")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-10-common-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Common questions"), React.createElement("div", {
    className: "ft-start"
  }, React.createElement("h3", null, "If you want a place to start"), React.createElement("ol", null, React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "What changed in 2026"), " is the most important context for any first trip this year."), React.createElement("li", null, React.createElement("a", {
    href: "/stay"
  }, "Decide where you are sleeping"), " before anything else, because it shapes every day of the trip and the good options go first."), React.createElement("li", null, "Once you know roughly how long you have, ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "one or two days in Yosemite"), " turns the strategy into an itinerary."), React.createElement("li", null, "The site's ", React.createElement("a", {
    href: "/map"
  }, "map"), " lays out where everything sits while you decide."), React.createElement("li", null, React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite"
  }, "Pack the car"), " like the trip depends on it, because it does.")), React.createElement("p", {
    className: "ft-signoff"
  }, "Let's plan a good one."))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))), React.createElement("div", {
    className: "ft-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("p", {
    className: "ft-sources__note"
  }, "Dated facts read October 4, 2026."), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/permitsandreservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Permits and reservations, NPS Yosemite"), " (\"A reservation is not required to enter Yosemite in 2026\")"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees and passes, NPS Yosemite"), " (entrance passes, the nonresident fee, cards only)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite"), " (366 days in advance)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camping, NPS Yosemite"), " (the 15th-of-the-month release)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Guide, September 23 to November 24, 2026, NPS"), " (the Mist Trail repair closure)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tiogaopen.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tioga Road opening dates"), " and ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/glacierpoint.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Glacier Point"), ", NPS Yosemite (the 2026 openings)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome permits, NPS Yosemite")))), React.createElement(AffiliateNote, null))));
};
