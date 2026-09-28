window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-walk-up-and-day-of-permits"] = function YosemiteWalkUpAndDayOfPermitsBody() {
  var SVG_STYLE = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var T_HEAD = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fontWeight: 600,
    letterSpacing: 1.1,
    fill: "var(--rust)"
  };
  var T_BODY = {
    fontFamily: "var(--sans)",
    fontSize: 14,
    fill: "var(--ink)"
  };
  var T_SOFT = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    fill: "var(--ink-2)"
  };
  var T_BIG = {
    fontFamily: "var(--serif)",
    fontSize: 19,
    fill: "var(--ink)"
  };
  function PermitCountdown() {
    var W = 600,
      ROW = 92,
      TOP = 58,
      LX = 132,
      RX = 380;
    var rows = [{
      day: "7 days out",
      wild: ["7 a.m. Pacific: 40 percent", "released online, first", "come, first served"],
      dome: null
    }, {
      day: "A few days out",
      wild: ["Online booking closes", "(three days, by the park's", "own reckoning)"],
      dome: null,
      cut: true
    }, {
      day: "2 days out",
      wild: null,
      dome: ["Daily lottery: apply", "midnight to 4 p.m. Pacific;", "results by email that evening"]
    }, {
      day: "The day before",
      wild: ["Collect a reserved permit,", "8 a.m. to 5 p.m."],
      dome: null
    }, {
      day: "Start date",
      wild: ["Collect by 11 a.m. or it is", "cancelled. Unclaimed quota,", "in person: few, if any"],
      dome: ["Hike. Permits are checked", "below the subdome; no", "walk-up, no standby line"]
    }];
    var H = TOP + rows.length * ROW + 34;
    var cell = (x, y, lines, tone) => React.createElement("g", null, React.createElement("rect", {
      x: x - 10,
      y: y + 8,
      width: "224",
      height: ROW - 16,
      rx: "3",
      fill: tone === "cut" ? "var(--paper)" : "var(--paper-2)",
      stroke: tone === "cut" ? "var(--rust)" : "var(--moss)",
      strokeWidth: "1.3",
      strokeDasharray: tone === "cut" ? "5 4" : undefined
    }), lines.map((l, j) => React.createElement("text", {
      key: l,
      x: x,
      y: y + 31 + j * 19,
      style: j === 0 ? {
        ...T_BODY,
        fontSize: 13.5,
        fontWeight: 600
      } : {
        ...T_SOFT,
        fontSize: 13
      }
    }, l)));
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: SVG_STYLE,
      role: "img",
      "aria-label": "The last week before a trip start, in two lanes. Wilderness permit: seven days out at 7 a.m. Pacific the held-back 40 percent of quota goes online, first come, first served. A few days out, three by the park's own reckoning, online booking closes. The day before, a reserved permit can be collected from 8 a.m. to 5 p.m. On the start date it must be collected by 11 a.m. or it is cancelled, and unclaimed quota is issued in person, few if any. Half Dome daily lottery: apply two days out, midnight to 4 p.m. Pacific, with results by email that evening. On the start date, hike; permits are checked below the subdome, with no walk-up and no standby line."
    }, React.createElement("text", {
      x: LX - 10,
      y: "22",
      style: T_HEAD
    }, "WILDERNESS PERMIT"), React.createElement("text", {
      x: RX - 10,
      y: "22",
      style: T_HEAD
    }, "HALF DOME DAILY LOTTERY"), React.createElement("line", {
      x1: "0",
      y1: "40",
      x2: W,
      y2: "40",
      stroke: "var(--rule-soft)",
      strokeWidth: "1.5"
    }), rows.map((r, i) => {
      var y = TOP + i * ROW - 10;
      return React.createElement("g", {
        key: r.day
      }, React.createElement("text", {
        x: "0",
        y: y + 50,
        style: {
          ...T_BODY,
          fontWeight: 600,
          fill: i === rows.length - 1 ? "var(--rust)" : "var(--ink)"
        }
      }, r.day), r.wild && cell(LX, y, r.wild, r.cut ? "cut" : null), r.dome && cell(RX, y, r.dome, null), i < rows.length - 1 && React.createElement("line", {
        x1: "0",
        y1: y + ROW + 2,
        x2: W,
        y2: y + ROW + 2,
        stroke: "var(--rule-soft)",
        strokeWidth: "1"
      }));
    }), React.createElement("text", {
      x: "0",
      y: H - 8,
      style: {
        ...T_SOFT,
        fontStyle: "italic"
      }
    }, "November through April: wilderness permits are free and self-issued at the trailhead."));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "Almost everything written about Yosemite permits is written for someone sitting at home in March with a calendar open. This is written for the other person: the one already inside the park, or checking into a motel in Mariposa tonight, holding nothing. Every guide they find tells them what they should have done twenty-four weeks ago. The useful question is what they can still get today, and few guides answer it."), React.createElement("p", null, "The answer has three parts. A great deal of Yosemite requires no permit and never did. One important thing has a real day-of path that most visitors never use. And one famous thing is closed to you, and no amount of showing up early changes that. Knowing which is which saves a day."), React.createElement("h2", null, "First: most of this park needs no permit at all"), React.createElement("p", null, "Start here, because the anxiety about Yosemite permits is out of proportion to the requirements."), React.createElement("p", null, React.createElement("strong", null, "Getting in."), " There is no day-use or peak-hours entry reservation for 2026. The systems that ran from 2020 through 2025 are gone, including the February weekend requirement for ", React.createElement("a", {
    href: "/articles/horsetail-fall-firefall"
  }, "Horsetail Fall"), ". You pay at the gate and drive in. What rations your visit now is ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "the number of parking spaces in Yosemite Valley"), ", which is a harder problem than a reservation and one you solve by arriving before nine or after five."), React.createElement("p", null, React.createElement("strong", null, "Day hiking."), " Every trail in this park is open to you today without a permit, with exactly one exception, which has its own section below. The Mist Trail, Yosemite Falls, the Four Mile, Cathedral Lakes, Clouds Rest, the Valley Loop, Taft Point, Sentinel Dome: walk up and go."), React.createElement("p", null, React.createElement("strong", null, "Ranger programs."), " Free, no reservation, no permit. Walks, talks, and evening programs run daily in season and are the single most underused thing in Yosemite. ", React.createElement("a", {
    href: "/now"
  }, "The Park Bulletin"), " carries the current schedule, and ", React.createElement("a", {
    href: "/articles/yosemite-ranger-programs"
  }, "the programs guide"), " explains which ones are worth rearranging a day for."), React.createElement("p", null, React.createElement("strong", null, "The big set pieces."), " Mariposa Grove, Glacier Point when the road is open, Tunnel View, the waterfalls, the museum, the Ansel Adams gallery. None of it is ticketed."), React.createElement("p", null, React.createElement("strong", null, "Day climbing."), " A climb you start and finish the same day needs no permit. Overnight big-wall climbs need a wilderness climbing permit, but that one is free, unlimited, and self-issued at a kiosk near the food lockers by El Capitan Bridge, twenty-four hours a day, either the day before or the day you start. It is the least bureaucratic permit in the National Park System."), React.createElement("p", null, React.createElement("strong", null, "Fishing."), " No park permit, but a California fishing license is required for anyone sixteen and older, and non-resident short-term licenses exist. Buy it in the park stores or in a gateway town."), React.createElement("h2", null, "The wilderness permit, and where the internet stops helping"), React.createElement("p", null, "If you want to sleep out in the backcountry, you need a wilderness permit, and this is where the day-of picture gets specific. Yosemite splits every trailhead's daily quota in two. Sixty percent is awarded in advance through the lottery that opens twenty-four weeks out. The other forty percent is held back and released on Recreation.gov at 7 a.m. Pacific, seven days before the entry date, first come first served. ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "The full permit guide"), " covers how to play that release properly."), React.createElement("p", null, "If you are already here, this is the detail that catches people. Those last-minute permits stay bookable until they sell out, but not right up to the start date. The park's published reservation window stops taking online bookings a few days out, three by its own reckoning, and whatever the exact cutoff is on the day you look, the practical rule does not move: there is no booking tonight for a walk that starts tomorrow morning. Once you are inside that window, the counter at a wilderness center is the only door left."), React.createElement("p", null, "Whatever quota went unclaimed can be issued in person at a wilderness center on the start date of the trip. The Park Service's own language about this is worth quoting almost exactly, because it is unusually blunt for a government website: while unreserved permits will be available in person on the start date, few, if any, unused permits will be available. In July, at Happy Isles or Cathedral Lakes, the number is zero. Two drainages over, on a Tuesday, at a trailhead nobody has heard of, it is sometimes not zero, and the rangers behind the desk know exactly which ones those are. Ask the question that way. Do not ask whether they have anything for the John Muir Trail; ask what they have at all, and then decide whether you want it."), React.createElement("h2", null, "Where to stand, and by when"), React.createElement("p", null, "Permits are issued at the wilderness centers: Yosemite Valley, Tuolumne Meadows, Wawona, Big Oak Flat, and the Hetch Hetchy entrance station. Most run roughly 8 a.m. to 5 p.m. in season, and the outlying ones close for the winter entirely, so the Valley center is the reliable year-round door. Two rules ride along with them. A reservation is not a permit; someone in your party has to collect the paper, either the day before, 8 a.m. to 5 p.m., or between 8 and 11 a.m. on the start date, and an uncollected permit is cancelled and given away. And if you are hoping to catch released quota, be at the counter when it opens, not at lunchtime."), React.createElement("p", null, "Come with a bear canister or plan to rent one there, and come with an alternate trailhead in mind. Flexibility about where you start is the only currency that works at that desk."), React.createElement("figure", null, React.createElement(PermitCountdown, null), React.createElement("figcaption", null, "The last week before a start date, drawn from the rules in this article. The dashed box is the door that closes: past it, only the counter.")), React.createElement(Placeholder, {
    caption: "Half Dome above the Valley floor, the one Yosemite hike with no walk-up option at all",
    image: "img/half-dome-valley-vista.jpg",
    credit: "Photo: Cam DiCecca / Wikimedia Commons (CC0)",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "16 / 10",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("h2", null, "Off-season, the whole system relaxes"), React.createElement("p", null, "Roughly November through April, the quota season ends and Yosemite wilderness permits become free, unlimited, and self-issued at trailhead registers. No lottery, no Recreation.gov, no counter. It is the largest gap between how hard this park looks to get into and how easy it is at the right time of year, and almost nobody takes it, because the same weather that opens the door makes the walking serious. ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "Winter in Yosemite"), " covers what you are signing up for."), React.createElement("h2", null, "Half Dome: the daily lottery is the day-of answer"), React.createElement("p", null, "The cables are the one thing you cannot talk your way onto. Permits are required every day the cables are up, rangers check them at a checkpoint below the subdome, and hiking past it without one is a citation, not a warning. There is no walk-up window, no standby line, and no ranger who will make an exception. You can hike to the base of the subdome without a permit, and many people do, and the view from there is worth the walk."), React.createElement("p", null, "There is a day-of path, though it is poorly publicized. Alongside the March preseason lottery, Yosemite runs a ", React.createElement("strong", null, "daily lottery"), " every day the cables are up. You apply on Recreation.gov two days before you want to hike, in a window that runs from midnight to 4 p.m. Pacific, and results come by email that evening. Apply Thursday, hike Saturday. It costs ten dollars per application plus ten dollars per person if you win."), React.createElement("p", null, "The strategic point, for someone already in the park: each day's application is an independent shot, so a week-long trip is several attempts rather than one. Midweek dates in the late season carry the best odds of the entire year. ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "Our Half Dome lottery guide"), " has the success rates broken down by weekday and weekend, which is the number that should decide which day you apply for."), React.createElement("p", null, "The other route onto the cables is a wilderness permit. Backpackers hold a share of each day's Half Dome allocation, requested and paid for in person when the permit is picked up rather than through the day-hiker lottery, and it applies only from trailheads whose routes plausibly pass the dome. If you were already trying to get a backcountry permit, ask about this at the counter."), React.createElement("h2", null, "A bed tonight"), React.createElement("p", null, "Camping is the hardest same-day problem in Yosemite and the one with the least satisfying answer, so here is its current state rather than a list that will be wrong by next season."), React.createElement("p", null, React.createElement("strong", null, "Camp 4"), " is the Valley's walk-in campground and the closest thing to a short-notice option here, but it is no longer a queue at a kiosk during the reservation season. Sites release on Recreation.gov on a rolling seven-day window, at 7 a.m. Pacific, and they go fast. That is the shortest booking horizon of any campground in the park, which makes it the one worth setting an alarm for if your trip is long enough to reach seven days out. Outside the reservation season it reverts to first come, first served, which is one of the quiet arguments for a winter trip. The park has changed how it allocates Camp 4 more than once, so check the campground's own page the day you need it rather than trusting anything written in advance, including this."), React.createElement("p", null, React.createElement("strong", null, "Cancellations are the real inventory."), " Recreation.gov releases cancelled sites continuously, and people cancel Yosemite constantly. Refreshing the campground pages in the evening, when the next day's no-shows get released, is a better use of twenty minutes than driving between campground entrances hoping for a sign. The park's own \"camping without a reservation\" page is the place to start, and ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), " covers the booking windows in detail."), React.createElement("p", null, React.createElement("strong", null, "Outside the park is not a failure."), " National forest campgrounds line every approach highway, several are first come first served, and dispersed camping is legal in much of the Stanislaus and Sierra national forests. ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "The gateway towns"), " also carry the last-minute motel inventory, and ", React.createElement(AvailabilityLink, {
    destination: "Mariposa, California",
    list: "article_inline",
    slug: "yosemite-walk-up-and-day-of-permits",
    name: "Mariposa lodging search"
  }, "a room in Mariposa tonight"), " beats three hours of driving to campground entrances that are already full."), React.createElement("h2", null, "The day-of playbook"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Before 8 a.m."), " If you want any chance at released wilderness quota, be at a wilderness center when it opens with an alternate trailhead written down. If you want to hike anything else, this is also when you should be parking."), React.createElement("li", null, React.createElement("strong", null, "Any time before 4 p.m."), " Enter the Half Dome daily lottery for the day after tomorrow. It costs ten dollars and takes four minutes, and there is no reason not to do it on your first day in the park."), React.createElement("li", null, React.createElement("strong", null, "Midday."), " Ask a ranger at the visitor center what is actually available today. This is what the desk exists for and it is a better information source than any website, including this one."), React.createElement("li", null, React.createElement("strong", null, "Evening."), " Refresh Recreation.gov for campground cancellations. Check your lottery email. Look at tomorrow's ranger program schedule, which costs nothing and requires nothing."), React.createElement("li", null, React.createElement("strong", null, "Tomorrow."), " The 7 a.m. Pacific wilderness release for the date seven days out is the best permit you can still get. If your trip is long enough to reach that date, take it.")), React.createElement("h2", null, "The short version"), React.createElement("ol", null, React.createElement("li", null, "Entry, day hiking, ranger programs, Mariposa Grove, Glacier Point, and day climbing need no permit today."), React.createElement("li", null, "Wilderness permits: forty percent releases at 7 a.m. Pacific seven days out, and online booking closes a few days before your entry date, not on it."), React.createElement("li", null, "Past that cutoff it is in-person unclaimed quota only, and the Park Service warns there will be few if any. Ask what exists, not what you wanted."), React.createElement("li", null, "November through April, wilderness permits are free and self-issued at the trailhead."), React.createElement("li", null, "Half Dome has a daily lottery: apply two days ahead, midnight to 4 p.m. Pacific. There is no walk-up and the checkpoint is staffed."), React.createElement("li", null, "Same-day camping means Recreation.gov cancellations, Camp 4's short-notice allocation, or a national forest campground outside the park.")), React.createElement("p", null, "The same pattern governs the park generally. Yosemite meters the few places everyone has heard of, and leaves the rest wide open. A visitor who arrives with nothing booked and insists on the famous thing will have a bad day. A visitor who arrives with nothing booked and asks what is available will get a permit, a trail, and a campsite, and will probably end up somewhere quieter than the original plan."), React.createElement(AffiliateNote, null));
};
