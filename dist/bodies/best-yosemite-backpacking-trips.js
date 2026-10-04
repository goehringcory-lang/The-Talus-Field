window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["best-yosemite-backpacking-trips"] = function BestYosemiteBackpackingTripsBody() {
  var HEAD = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fontWeight: 600,
    letterSpacing: 1.1,
    fill: "var(--rust)"
  };
  var BODY = {
    fontFamily: "var(--sans)",
    fontSize: 14,
    fill: "var(--ink)"
  };
  var SOFT = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    fill: "var(--ink-2)"
  };
  var SMALL = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fill: "var(--ink-3)"
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var capStyle = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    color: "var(--ink-3)",
    marginTop: 10
  };
  function PermitPath() {
    var W = 600,
      H = 640;
    var steps = [{
      head: "24 WEEKS OUT · SUNDAY TO SATURDAY",
      lines: ["Apply to the weekly lottery on Recreation.gov", "Entry trailhead, entry date, group size", "Up to three alternate trip leaders, added before you pay", "$10 to apply"]
    }, {
      head: "THE MONDAY AFTER, BY 5 P.M.",
      lines: ["Results by email", "Accept by Thursday, 11:59 p.m., and pay $5 per person"]
    }, {
      head: "FRIDAYS, 9 A.M. PACIFIC",
      lines: ["Lottery leftovers go on sale, first come, first served"]
    }, {
      head: "7 DAYS OUT, 7 A.M. PACIFIC",
      lines: ["The other 40 percent of the quota releases", "Same fees; bookable until 3 days before the start"]
    }, {
      head: "THE DAY BEFORE, OR THE MORNING OF",
      lines: ["Pick up in person at a wilderness center", "Day before 8 a.m. to 5 p.m.; start day 8 to 11 a.m.", "Arriving later? Set a late-arrival hold, or lose the permit"]
    }];
    var y = 40;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "The path from application to trailhead. Twenty-four weeks before the start date, apply to the weekly lottery on Recreation.gov between Sunday and Saturday, choosing an entry trailhead, entry date and group size, with up to three alternate trip leaders added before paying the $10 application fee. Results arrive by email the following Monday by 5 p.m.; accept by Thursday at 11:59 p.m. and pay $5 per person. On Fridays at 9 a.m. Pacific, lottery leftovers go on sale first come, first served. Seven days before the start date at 7 a.m. Pacific the remaining 40 percent of the quota releases, at the same fees, bookable until three days before the start. The permit is picked up in person at a wilderness center, the day before between 8 a.m. and 5 p.m. or the start day between 8 and 11 a.m.; a later arrival needs a late-arrival hold or the reservation is cancelled."
    }, React.createElement("text", {
      x: "0",
      y: "18",
      style: HEAD
    }, "FROM APPLICATION TO TRAILHEAD"), React.createElement("line", {
      x1: "20",
      y1: "40",
      x2: "20",
      y2: H - 40,
      stroke: "var(--rule-soft)",
      strokeWidth: "2"
    }), steps.map((s, i) => {
      var top = y;
      y += 40 + s.lines.length * 21 + 28;
      return React.createElement("g", {
        key: s.head
      }, React.createElement("circle", {
        cx: "20",
        cy: top + 10,
        r: "15",
        fill: i === 4 ? "var(--ink)" : "var(--moss)"
      }), React.createElement("text", {
        x: "20",
        y: top + 15,
        textAnchor: "middle",
        style: {
          ...BODY,
          fill: "var(--paper)",
          fontWeight: 700
        }
      }, i + 1), React.createElement("text", {
        x: "50",
        y: top + 15,
        style: HEAD
      }, s.head), s.lines.map((l, j) => React.createElement("text", {
        key: l,
        x: "50",
        y: top + 40 + j * 21,
        style: j === 0 ? {
          ...BODY,
          fontWeight: 600
        } : SOFT
      }, l)));
    }), React.createElement("text", {
      x: "50",
      y: H - 12,
      style: {
        ...SMALL,
        fontStyle: "italic"
      }
    }, "No printing at home, no email permits. Time axis not to scale."));
  }
  var PINS = [{
    n: 1,
    x: 300,
    y: 700
  }, {
    n: 2,
    x: 630,
    y: 330
  }, {
    n: 3,
    x: 470,
    y: 885
  }, {
    n: 4,
    x: 850,
    y: 890
  }, {
    n: 5,
    x: 800,
    y: 160
  }];
  function TripMap() {
    return React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-tuolumne-backcountry-map.jpg",
      width: "1320",
      height: "940",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of the Tioga Road high country: Tioga Road running from Olmsted Point past Tenaya Lake to Tuolumne Meadows and Tioga Pass, with May Lake and Mount Hoffmann to the west, Glen Aulin on the Tuolumne River to the northwest, Young Lakes under Ragged Peak to the north, and Sunrise and Vogelsang in the Cathedral Range to the south."
    }), React.createElement("svg", {
      viewBox: "0 0 1320 940",
      role: "img",
      "aria-label": "Five numbered pins. One, May Lake, beside Mount Hoffmann just north of Tenaya Lake. Two, Glen Aulin, down the Tuolumne River northwest of Tuolumne Meadows. Three, Sunrise, one of the High Sierra Camps on the loop, south of Tenaya Lake. Four, Vogelsang, in the Cathedral Range south of Tuolumne Meadows. Five, Young Lakes, under Ragged Peak north of Tuolumne Meadows. The Tuolumne Meadows Wilderness Center is marked W on the map, east of the visitor center."
    }, PINS.map(p => React.createElement("g", {
      key: p.n
    }, React.createElement("circle", {
      className: "npsmap__pin npsmap__pin--ink",
      cx: p.x,
      cy: p.y,
      r: "26",
      strokeWidth: "6"
    }), React.createElement("text", {
      className: "npsmap__num",
      x: p.x,
      y: p.y + 10,
      textAnchor: "middle",
      style: {
        fontSize: 28
      }
    }, p.n)))));
  }
  var LADDER = [{
    name: "1 · May Lake",
    mi: 2.4,
    note: "2.4 mi round trip, 485 ft of gain"
  }, {
    name: "2 · Glen Aulin",
    mi: 11,
    note: "11 mi round trip, 800 ft, climbed on the way out"
  }, {
    name: "3 · High Sierra Camps",
    mi: 49,
    note: "49 mi loop in legs of 8 to 9.5 mi"
  }, {
    name: "4 · Vogelsang",
    mi: 14.4,
    note: "14.4 mi round trip, 1,600 ft"
  }, {
    name: "5 · Young Lakes",
    mi: 13.6,
    note: "13.6 mi round trip, 1,300 ft"
  }];
  function TripLadder() {
    var W = 560,
      H = 470,
      scaleL = 0,
      scaleW = 500,
      max = 16,
      rowH = 80;
    var NAME = {
      fontFamily: "var(--sans)",
      fontSize: 17,
      fontWeight: 600,
      fill: "var(--ink)"
    };
    var NOTE = {
      fontFamily: "var(--sans)",
      fontSize: 15,
      fill: "var(--ink-2)"
    };
    var TICK = {
      fontFamily: "var(--sans)",
      fontSize: 14,
      fill: "var(--ink-3)"
    };
    var mx = mi => scaleL + Math.min(mi, max) / max * scaleW;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "The five trips by round-trip distance. May Lake, 2.4 miles with 485 feet of gain. Glen Aulin, 11 miles with 800 feet, climbed on the way out. The High Sierra Camps loop, 49 miles in legs of 8 to 9.5 miles, drawn past the end of the scale. Vogelsang, 14.4 miles with 1,600 feet. Young Lakes, 13.6 miles with 1,300 feet."
    }, React.createElement("text", {
      x: "0",
      y: 18,
      style: HEAD
    }, "THE LADDER, BY ROUND-TRIP DISTANCE"), [0, 4, 8, 12, 16].map(m => React.createElement("g", {
      key: m
    }, React.createElement("line", {
      x1: mx(m),
      x2: mx(m),
      y1: 34,
      y2: H - 30,
      stroke: "var(--rule-soft)"
    }), React.createElement("text", {
      x: mx(m),
      y: H - 10,
      textAnchor: m === 0 ? "start" : m === 16 ? "end" : "middle",
      style: TICK
    }, m === 16 ? "16 mi" : m))), LADDER.map((t, i) => {
      var ty = 54 + i * rowH;
      return React.createElement("g", {
        key: t.name
      }, React.createElement("text", {
        x: scaleL,
        y: ty,
        style: NAME
      }, t.name), React.createElement("rect", {
        x: scaleL,
        y: ty + 8,
        width: mx(t.mi) - scaleL,
        height: 18,
        rx: "2",
        fill: i === 4 ? "var(--ink)" : "var(--moss)"
      }), t.mi > max && React.createElement("text", {
        x: mx(max) + 6,
        y: ty + 23,
        style: {
          ...NOTE,
          fontWeight: 600
        }
      }, "49"), React.createElement("text", {
        x: scaleL,
        y: ty + 46,
        style: NOTE
      }, t.note));
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "A day hike in Yosemite ends at the car. A backpacking trip ends somewhere the car cannot go, at dusk, with the people who drove up for the afternoon already gone. Getting there takes three things a day hike does not: a wilderness permit, a trip to a wilderness center to collect it, and a route sized to what you actually know how to do. This piece walks through all three, in the order they come at you, and finishes with the five trips I would hand someone working their way up, from the shortest overnight in the park to the one I go back to most."), React.createElement("p", null, "The system itself, and why it works the way it does, is covered in ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "the wilderness permit explainer"), ". The conditions a permit does not mention, snow on the passes, creek levels, mosquitoes, altitude, are in ", React.createElement("a", {
    href: "/articles/first-yosemite-backpacking-trip"
  }, "the first-trip field notes"), ". What follows is the practical sequence: which buttons, which building, which trail."), React.createElement("h2", null, "Step one: you are reserving a trailhead, not a campsite"), React.createElement("p", null, "Every decision in the application follows from one rule. Yosemite meters overnight hikers by ", React.createElement("strong", null, "entry trailhead and entry date"), ". Each trailhead has a daily quota, and once you are past the sign you camp where the regulations allow. You must exit where the permit says, but nothing in it assigns you a site for night two."), React.createElement("p", null, "So before you open Recreation.gov, work backwards from the trip to the trailhead. All five trips below leave from Tioga Road or Tuolumne Meadows: May Lake from its own trailhead off the road, Glen Aulin and Young Lakes from the Lembert Dome parking area, Vogelsang from Rafferty Creek. Write down a first choice, then two alternate dates or trailheads you would genuinely take. Popular trailheads are where the lottery is lost; the second list is where it is usually won."), React.createElement("p", null, "Two exceptions to the camp-anywhere rule matter here. Only at the five High Sierra Camps (Glen Aulin, May Lake, Sunrise, Merced Lake and Vogelsang) and in Little Yosemite Valley must you sleep in a designated campground, and within a mile of a High Sierra Camp that campground is the only legal place to camp. Everywhere else, camp at least four trail miles from Tuolumne Meadows and the other developed areas, at least a mile from any road, and 100 feet from water and trail."), React.createElement("h2", null, "Step two: the application"), React.createElement("p", null, "The application lives on Recreation.gov, on the Yosemite wilderness permit page, and needs an account. The sequence:"), React.createElement("p", null, React.createElement("strong", null, "The lottery, 24 weeks ahead."), " Sixty percent of each trailhead's quota goes by weekly lottery. The window for a given week of start dates opens Sunday at 12:01 a.m. and closes Saturday at 11:59 p.m., 24 weeks before those dates. You choose the entry trailhead and entry date, enter the group size, and add up to three alternate trip leaders, any of whom can pick the permit up if you cannot. Alternates have to be added before payment and cannot be changed afterward, which is the step people regret skipping. The application costs $10, non-refundable. Each group gets one application per weekly lottery: if two people in the same party both apply, both applications are removed."), React.createElement("p", null, React.createElement("strong", null, "Results."), " They arrive by email by 5 p.m. the following Monday. A winning application has to be accepted by Thursday at 11:59 p.m., when you pay the second fee, $5 per person. Miss the Thursday deadline and the permit goes back into the pool."), React.createElement("p", null, React.createElement("strong", null, "The leftovers, Fridays at 9 a.m. Pacific."), " Lottery quota nobody won or accepted goes on sale first come, first served, and stays bookable until three days before the start date."), React.createElement("p", null, React.createElement("strong", null, "The seven-day release."), " The remaining 40 percent of each quota releases at 7 a.m. Pacific seven days before the entry date, also first come, first served, at the same $10 plus $5 a person. It is a rolling daily release, so every morning brings a new start date. For a flexible party it is often the easier route: no lottery, no waiting, just an alarm and your list of alternates."), React.createElement("p", null, "You can hold up to six future reservations at a time. Walk-up permits exist in principle, but from late April to mid-October the park describes them as extremely scarce, which is a polite way of saying do not plan on one."), React.createElement("figure", {
    style: {
      margin: "32px 0"
    }
  }, React.createElement(PermitPath, null), React.createElement("figcaption", {
    style: capStyle
  }, "The permit calendar, drawn from the figures in this article. Fees are non-refundable and non-transferable.")), React.createElement("h2", null, "Step three: the pickup, in person"), React.createElement("p", null, "The email confirming your reservation is not a permit. ", React.createElement("strong", null, "Yosemite does not issue permits by phone or email, and you cannot print one at home."), " The trip leader or one of the named alternates collects it in person at a wilderness center, either the day before the trip between 8 a.m. and 5 p.m., or the morning of the start date between 8 and 11 a.m."), React.createElement("p", null, "The 11 a.m. line is the one that bites. If you will reach the park later than that on your start day, set a late-arrival hold on the reservation (under Modify, within seven days of entry), which extends pickup to 5 p.m. Without it, the park cancels the reservation. Every station keeps 8 a.m. to 5 p.m. hours, and none issues permits after hours."), React.createElement("p", null, "Where to go depends on where you start:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Tuolumne Meadows Wilderness Center"), ", from about late May to October 14, conditions permitting. The natural stop for all five trips below."), React.createElement("li", null, React.createElement("strong", null, "Yosemite Valley Wilderness Center"), ", May through October, in Yosemite Village. Self-registration from November to April."), React.createElement("li", null, React.createElement("strong", null, "Big Oak Flat Information Station"), ", May to October, at the entrance on Highway 120 west. It also issues Hetch Hetchy permits from about April through October."), React.createElement("li", null, React.createElement("strong", null, "Wawona Visitor Center at Hill's Studio"), ", May to October, for the southern trailheads.")), React.createElement("p", null, "The permit desk is also where the trip gets better. Ask about snow on your route, water, and which drainage a bear has been working, and rent a canister if you do not own one: ", React.createElement("strong", null, "a bear-resistant canister is required for every overnight trip in the Yosemite Wilderness"), ", and the wilderness centers rent them for $5 a week against a $95 deposit on a card. Everything scented goes inside, from the food to the toothpaste. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " explains why the park stopped accepting food hangs."), React.createElement("p", null, "A wilderness permit also buys a place to sleep before the trip. Backpackers' campgrounds take permit holders for the night before and the night after, at $8 per person, with no reservation. The one in Tuolumne runs from mid-July to late September; the Valley's, behind North Pines, from mid-April to early October. A night at 8,600 feet before you walk is the cheapest altitude acclimatization there is."), React.createElement(Placeholder, {
    caption: "The Yosemite Valley Wilderness Center in Yosemite Village. Permits are collected in person here or at one of the other wilderness centers, never printed at home.",
    image: "img/yosemite-valley-wilderness-center.jpg",
    credit: "Photo: National Park Service (public domain)",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "16 / 9",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("h2", null, "The five trips, on the park's own map"), React.createElement("p", null, "All five sit in the Tioga Road high country, which means they share a season: Tioga Road is typically open from late May or June until sometime in November, and the wilderness centers and trailhead parking close earlier than the road does. Overnight parking at May Lake ends October 15. Treat these as summer and early fall trips."), React.createElement("figure", {
    className: "npsmap",
    style: {
      margin: "30px 0 34px"
    }
  }, React.createElement(TripMap, null), React.createElement("figcaption", null, React.createElement("span", null, React.createElement("b", null, "1"), " May Lake, below Mount Hoffmann. 1.2 mi from the trailhead."), React.createElement("span", null, React.createElement("b", null, "2"), " Glen Aulin, down the Tuolumne River. 5.3 mi from the Lembert Dome parking area."), React.createElement("span", null, React.createElement("b", null, "3"), " Sunrise, one camp on the High Sierra Camps loop, which links 1, 2, 3 and 4 with Merced Lake, south of this map."), React.createElement("span", null, React.createElement("b", null, "4"), " Vogelsang, in the Cathedral Range. 6.9 mi up Rafferty Creek."), React.createElement("span", null, React.createElement("b", null, "5"), " Young Lakes, under Ragged Peak. 6 mi from the Lembert Dome parking area."), React.createElement("span", null, "The Tuolumne Meadows Wilderness Center is the green W symbol on the map, beside the visitor center."), React.createElement("span", null, "Map: National Park Service (public domain), cropped and enlarged."))), React.createElement("figure", {
    style: {
      margin: "0 0 34px"
    }
  }, React.createElement(TripLadder, null), React.createElement("figcaption", {
    style: capStyle
  }, "National Park Service round-trip distances and gains. The loop runs past the end of the scale, but no single day on it is longer than 9.5 miles.")), React.createElement("h2", null, "1. May Lake: the first night out"), React.createElement("p", null, "May Lake is the shortest backpacking trip in Yosemite, and that is the entire argument for it. The trail is ", React.createElement("strong", null, "1.2 miles from the May Lake trailhead, about 485 feet of climbing"), ", to a lake at 9,350 feet with Mount Hoffmann standing directly above it. You can be at the water within an hour of leaving the car."), React.createElement("p", null, "Short is the point. A first backpacking trip is really a gear test: whether the pack rides right, whether the pad is warm enough, whether the stove lights at altitude, whether the canister actually holds what you packed. On May Lake you learn all of that a mile and a bit from the car. If something fails, the fix is a short walk down, not a forced march out of a canyon. Nothing about it is committing, and that makes it the right place to make your mistakes."), React.createElement("p", null, "It also takes the most daunting part of backpacking off the table for one more trip. ", React.createElement("strong", null, "There is a toilet up there."), " The High Sierra Camp at the lake has restrooms in season, and there is a vault toilet at the trailhead parking. You can learn to sleep in a tent at 9,000 feet without also learning, the same night, how to dig a cathole six inches deep and 100 feet from water, trail and camp, then carry the toilet paper out. Save that lesson for trip two."), React.createElement("p", null, "Camping at May Lake is in the designated backpackers' campground beside the High Sierra Camp, with shared food lockers. Fires go only in the communal ring, when fire restrictions allow. The trailhead itself is 1.75 miles up an unpaved road off Tioga Road, and early in the summer that road can still be closed, adding 1.75 miles each way on foot. The catch is demand: the park rates May Lake's permit demand as very high, so it is a seven-day-release and midweek trip for most people."), React.createElement("p", null, React.createElement("strong", null, "The day hike: Mount Hoffmann."), " With camp set up, the summit is about two miles beyond the lake and roughly 1,500 feet higher, at 10,850 feet. Hoffmann sits at the geographic center of the park, and from the top most of Yosemite's high country lies around you. Be clear-eyed about it: this is a strenuous walk, on an unofficial, unmarked spur rather than a maintained trail, following informal paths and cairns up alpine scree near the top. Start early, carry water, and be off the summit before the afternoon clouds build. Hoffmann is a fine day; it is not an easy one."), React.createElement("h2", null, "2. Glen Aulin: the second trip, with a river"), React.createElement("p", null, "Glen Aulin is the trip after May Lake: long enough to feel like a backpacking trip, gentle enough that the miles do not punish a newer pack carrier. It starts at the Lembert Dome parking area, at the Glen Aulin and Soda Springs trailhead, and runs ", React.createElement("strong", null, "about 5.3 miles down the Tuolumne River"), " past Tuolumne Fall and the White Cascade, roughly four miles in, to the camp. The park lists it at 11 miles round trip and about 800 feet of elevation change. Note the direction: the trail loses height on the way in, so the climbing waits for the walk out, on tired legs."), React.createElement(Placeholder, {
    caption: "The White Cascade at Glen Aulin, where the Tuolumne River drops toward camp",
    image: "img/glen-aulin-white-cascade.jpg",
    credit: "Photo: Lela Getzler / Wikimedia Commons (CC BY 2.0)",
    tag: "PLATE II",
    size: "lg",
    style: {
      aspectRatio: "4 / 5",
      margin: "32px 0"
    },
    motif: React.createElement(MotifTrees, null)
  }), React.createElement("p", null, "Like May Lake, Glen Aulin is a High Sierra Camp, so you sleep in the designated backpackers' campground beside it, with food lockers, and fires only in the communal ring. The river is the main event, and it is also the hazard. The trailhead notes several unbridged stream crossings, which are trivial in late summer and serious in a big runoff year; ", React.createElement("a", {
    href: "/articles/first-yosemite-backpacking-trip"
  }, "the first-trip field notes"), " cover how to read a crossing. From camp, a layover day continues down the canyon to Waterwheel Falls, 8.2 miles from the trailhead. Permit demand is high, which is the cost of a trail this good."), React.createElement("h2", null, "3. The High Sierra Camps: camp to camp, carrying your own"), React.createElement("p", null, "The High Sierra Camps are tent-cabin camps strung through the backcountry a day's walk apart. The concessioner's loop links Tuolumne Meadows with Glen Aulin, May Lake, Sunrise, Merced Lake and Vogelsang, ", React.createElement("strong", null, "49 miles in all"), ", in legs of 8 to 9.5 miles: Tuolumne to Glen Aulin is 8, Glen Aulin to May Lake 8.5, May Lake to Sunrise 8.25, Sunrise to Merced Lake 9.5. A bed in the cabins is booked by lottery through the concessioner, and it is a different trip."), React.createElement("p", null, "The backpacker's version needs only a wilderness permit and a canister. Each camp has a designated backpackers' campground beside it, with shared food lockers, and the regulations require you to use it within a mile of the camp. Those campgrounds are not in the campground reservation system; the permit is the reservation. What makes the loop the natural third trip is the structure: you already know two of its camps, the daily distances are fixed and sensible, and each night ends at a known site instead of a search for flat ground. When the camps are operating, the concessioner also sells meals to backpackers, which is a reasonable way to carry two fewer dinners."), React.createElement("p", null, "The permit logic is the same as any other trip: one entry trailhead, one entry date, and the exit the permit names. You do not need the whole 49 miles. Two or three nights on a segment, walked as an out-and-back or a loop back to the car, is a full trip."), React.createElement(Placeholder, {
    caption: "The Vogelsang High Sierra Camp under Fletcher Peak. Backpackers sleep in the designated campground beside each camp.",
    image: "img/vogelsang-high-sierra-camp.jpg",
    credit: "Photo: Dean Wallraff / Wikimedia Commons (CC BY-SA 4.0)",
    tag: "PLATE III",
    size: "lg",
    style: {
      aspectRatio: "3 / 2",
      margin: "32px 0"
    },
    motif: React.createElement(MotifSun, null)
  }), React.createElement("h2", null, "4. Vogelsang: above 10,000 feet"), React.createElement("p", null, "Vogelsang is where the ladder gets high. The trail leaves from the Rafferty Creek trailhead in Tuolumne Meadows and climbs ", React.createElement("strong", null, "6.9 miles to the Vogelsang High Sierra Camp"), ", about 14.4 miles round trip with 1,600 feet of gain, into a basin of lakes and peaks in the Cathedral Range. The camp sits at about 10,100 feet, the highest of the five, and nothing on the walk is technical. The difficulty is the air."), React.createElement(Placeholder, {
    caption: "Fletcher Peak above Fletcher Lake, a short walk from the Vogelsang camp",
    image: "img/fletcher-lake-fletcher-peak.jpg",
    credit: "Photo: btwashburn / Wikimedia Commons (CC BY 2.0)",
    tag: "PLATE IV",
    size: "lg",
    style: {
      aspectRatio: "4 / 3",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("p", null, "That is why it comes fourth. Sleeping above 10,000 feet the night after leaving the coast is close to the exact profile altitude guidance warns against, and the first-trip notes on altitude apply in full here. Spend the night before in the Tuolumne backpackers' campground at 8,600 feet and walk in the next morning. Two rules change at this height: ", React.createElement("strong", null, "no fires at all"), ", since fires are banned above 9,600 feet and specifically at the Vogelsang campground, and a warmer sleeping bag than the calendar suggests."), React.createElement("p", null, "Vogelsang rewards a second night. The longer options from the same trailhead include coming home down Lyell Canyon, 12.3 miles from the camp by that route, or the Ireland and Evelyn lakes loop, 22.2 miles and 2,150 feet of gain in all. Permit demand is high."), React.createElement("h2", null, "5. Young Lakes: my favorite"), React.createElement("p", null, "Young Lakes is the trip I return to. Three lakes in a chain under ", React.createElement("strong", null, "Ragged Peak"), ", a little under 10,000 feet, with the Cathedral Range across the basin to the south. The trail leaves from the Lembert Dome parking area and reaches the lakes in ", React.createElement("strong", null, "about six miles by either of two routes"), ": past Dog Lake, 1.5 miles in, or by the Glen Aulin trail and then north toward Ragged Peak. The park lists the trip at 13.6 miles round trip and 1,300 feet of gain. Going in by one route and out by the other makes a loop of about twelve miles."), React.createElement(Placeholder, {
    caption: "Ragged Peak at first light, reflected in one of the Young Lakes",
    image: "img/young-lakes-ragged-peak.jpg",
    credit: "Photo: Kenneth Liou / Wikimedia Commons (CC BY-SA 4.0)",
    tag: "PLATE V",
    size: "lg",
    style: {
      aspectRatio: "3 / 2",
      margin: "32px 0"
    },
    motif: React.createElement(MotifSun, null)
  }), React.createElement("p", null, "The official trail ends at the first lake. A well-used informal path continues to the second and third, and the farther you go the fewer people you share the basin with. That is the quiet reason it is my favorite: the park rates its permit demand as medium, where Glen Aulin and Vogelsang run high and May Lake very high. It is a full high-country trip, with the granite, the lakes and the peak at sunset, that a seven-day-release alarm usually wins."), React.createElement("p", null, "It belongs at the top of the ladder because nothing here is arranged for you. There is no High Sierra Camp, no designated campground, no toilet, and no locker. You choose a site at least 100 feet from water and trail, the canister sits on the ground, the cathole you learned on trip two gets dug, and the lakes are above the 9,600-foot line, so there are no fires. Camp a short walk from the water, on durable ground, and watch the light leave Ragged Peak. Dog Lake makes a good last swim on the way out, though camping there is not allowed."), React.createElement("h2", null, "The order, and why"), React.createElement("p", null, "The ladder runs in a deliberate sequence. May Lake teaches the gear with a toilet and a short walk out. Glen Aulin adds real distance and a river, with a designated campground still waiting at the end. The High Sierra Camps string several nights together on known legs. Vogelsang adds altitude. Young Lakes asks for all of it at once, with no facilities, and gives back the quietest country of the five."), React.createElement("p", null, "The paperwork is the same each time: a trailhead and a date on Recreation.gov, an alarm for the lottery or the seven-day release, a morning at the Tuolumne Meadows Wilderness Center, a canister in the trunk. Do it once and it stops being the hard part. If you want the drive and the day hikes that frame these trips, ", React.createElement("a", {
    href: "/articles/tuolumne-meadows-in-a-day"
  }, "Tuolumne Meadows in a day"), " covers the country you will be walking out of."));
};
