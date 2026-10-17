window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["mist-trail-the-real-guide"] = function MistTrailBody() {
  var TOC = [["#sec-0-what-the-mist-trail-actually-is", "The turnarounds"], ["#sec-1-the-wet-granite-reality", "The granite"], ["#sec-2-you-will-get-wet", "Getting wet"], ["#sec-3-when-to-go", "When to go"], ["#sec-4-the-safety-talk", "Safety"], ["#sec-5-the-crowd-question", "Crowds"], ["#sec-6-is-it-worth-it", "Is it worth it"], ["#mist-trail-questions", "Questions"]];
  var FAQ = [["How long is the Mist Trail in Yosemite?", "From Happy Isles, the round trip is 1.6 miles to Vernal Fall footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall. Parking adds walking distance."], ["How hard is the Mist Trail?", "The footbridge hike is moderate, with about 400 feet of climbing. The routes to the tops of Vernal Fall and Nevada Fall are strenuous, gaining about 1,000 and 2,000 feet respectively. Expect steep, uneven steps beyond the footbridge."], ["How long does the Mist Trail take?", "Allow 1 to 1.5 hours for the footbridge, about 3 hours for Vernal Fall, or 5 to 6 hours for Nevada Fall, plus time to get to and from Happy Isles. A John Muir Trail return is longer."], ["Where can I get drinking water on the Mist Trail?", "Drinking water is at Happy Isles and seasonally at Vernal Fall footbridge, usually May through October. There is no drinking-water tap at Nevada Fall. Carry enough if the footbridge tap is off."], ["Is the Mist Trail closed for repairs in 2026?", "From July 27 through October, subject to change, the section from the JMT junction above Vernal Fall footbridge to the top of Vernal Fall closes Monday through Thursday, 7 a.m. to 3:30 p.m. Follow the signed JMT detour and check the NPS notice before hiking."], ["Can kids hike the Mist Trail?", "Choose a turnaround that matches their fitness and the conditions. The paved footbridge route still climbs about 400 feet. Beyond it, steep, uneven and often wet steps require balance and steady footing. Stay behind railings and do not swim or wade above the falls."]];
  var TURNS = [{
    n: 1,
    name: "The Vernal Fall footbridge",
    line: "Paved, a moderate grade, a clear look at Vernal Fall.",
    rt: "1.6 miles",
    gain: "About 400 ft",
    time: "1 to 1.5 hours",
    water: "1 liter per person",
    crowd: "Packed"
  }, {
    n: 2,
    name: "The top of Vernal Fall",
    line: "The granite staircase beside the fall, and the mist.",
    rt: "2.4 miles",
    gain: "About 1,000 ft",
    time: "About 3 hours",
    water: "2 liters per person",
    crowd: "Has people"
  }, {
    n: 3,
    name: "The top of Nevada Fall",
    line: "594 feet of whitewater, Liberty Cap and Half Dome behind you.",
    rt: "5.4 miles",
    gain: "About 2,000 ft",
    time: "5 to 6 hours",
    water: "3 to 4 liters per person",
    crowd: "Can feel almost empty on a weekday"
  }];
  function Turnarounds() {
    var W = 680,
      H = 350,
      L = 56,
      R = 30,
      T = 34,
      B = 46;
    var pw = W - L - R,
      ph = H - T - B;
    var x = mi => L + mi / 2.7 * pw;
    var y = ft => T + ph - ft / 2000 * ph;
    var pts = [[0, 0], [0.8, 400], [1.2, 1000], [2.7, 2000]];
    var line = pts.map(([m, f]) => `${x(m)},${y(f)}`).join(" ");
    var stops = [{
      m: 0,
      f: 0,
      name: "Happy Isles",
      sub: "start, 4,000 ft",
      crowd: "",
      dx: 12,
      dy: -64,
      anchor: "start"
    }, {
      m: 0.8,
      f: 400,
      name: "Vernal Fall footbridge",
      sub: "0.8 mi · 400 ft",
      crowd: "packed",
      dx: 10,
      dy: 30,
      anchor: "start"
    }, {
      m: 1.2,
      f: 1000,
      name: "Top of Vernal Fall",
      sub: "1.2 mi · 1,000 ft",
      crowd: "has people",
      dx: -12,
      dy: -40,
      anchor: "end"
    }, {
      m: 2.7,
      f: 2000,
      name: "Top of Nevada Fall",
      sub: "2.7 mi · 2,000 ft",
      crowd: "can feel almost empty on a weekday",
      dx: -8,
      dy: 95,
      anchor: "end"
    }];
    return React.createElement("svg", {
      className: "mt-profile__svg",
      viewBox: `0 0 ${W} ${H}`,
      role: "img",
      "aria-label": "The Mist Trail's four turnarounds, from the figures in this article. From Happy Isles at 4,000 feet: the Vernal Fall footbridge at 0.8 miles and 400 feet of gain, where the crowd is packed; the top of Vernal Fall at 1.2 miles and 1,000 feet, up a granite staircase that gains 600 feet in 0.4 miles in the mist zone; the top of Nevada Fall at 2.7 miles and 2,000 feet, which on a weekday can feel almost empty. The crowd thins as the trail climbs."
    }, [0, 500, 1000, 1500, 2000].map(f => React.createElement("g", {
      key: f
    }, React.createElement("line", {
      x1: L,
      x2: W - R,
      y1: y(f),
      y2: y(f),
      className: "mt-profile__grid"
    }), React.createElement("text", {
      x: L - 8,
      y: y(f) + 4,
      textAnchor: "end",
      className: "mt-profile__axis"
    }, f === 0 ? "0" : f.toLocaleString("en-US")))), [0, 0.5, 1, 1.5, 2, 2.5].map(m => React.createElement("text", {
      key: m,
      x: x(m),
      y: H - 24,
      textAnchor: "middle",
      className: "mt-profile__axis"
    }, m)), React.createElement("text", {
      x: L + pw / 2,
      y: H - 6,
      textAnchor: "middle",
      className: "mt-profile__axis"
    }, "miles from Happy Isles · feet gained"), React.createElement("rect", {
      x: x(0.8),
      y: T,
      width: x(1.2) - x(0.8),
      height: ph,
      className: "mt-profile__mist"
    }), React.createElement("text", {
      x: (x(0.8) + x(1.2)) / 2,
      y: T + 14,
      textAnchor: "middle",
      className: "mt-profile__label"
    }, "the mist zone"), React.createElement("text", {
      x: (x(0.8) + x(1.2)) / 2,
      y: T + 30,
      textAnchor: "middle",
      className: "mt-profile__label"
    }, "600 ft in 0.4 mi"), React.createElement("polygon", {
      points: `${x(0)},${y(0)} ${line} ${x(2.7)},${y(0)}`,
      className: "mt-profile__area"
    }), React.createElement("polyline", {
      points: line,
      className: "mt-profile__line"
    }), stops.map(st => React.createElement("g", {
      key: st.name
    }, React.createElement("circle", {
      cx: x(st.m),
      cy: y(st.f),
      r: "5",
      className: "mt-profile__dot"
    }), React.createElement("text", {
      x: x(st.m) + st.dx,
      y: y(st.f) + st.dy,
      textAnchor: st.anchor,
      className: "mt-profile__place"
    }, st.name), React.createElement("text", {
      x: x(st.m) + st.dx,
      y: y(st.f) + st.dy + 17,
      textAnchor: st.anchor,
      className: "mt-profile__label"
    }, st.sub), st.crowd && React.createElement("text", {
      x: x(st.m) + st.dx,
      y: y(st.f) + st.dy + 33,
      textAnchor: st.anchor,
      className: "mt-profile__crowd"
    }, st.crowd))));
  }
  function RouteMap() {
    return React.createElement("figure", {
      className: "npsmap mt-map"
    }, React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-mist-trail-map.jpg",
      width: "700",
      height: "380",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of the east end of Yosemite Valley: Curry Village and its trailhead parking, the Happy Isles trailhead, the Mist Trail along the Merced River to Vernal Fall, Emerald Pool and the Silver Apron, the John Muir Trail past Clark Point, and Nevada Fall at the map's edge."
    }), React.createElement("svg", {
      viewBox: "0 0 700 380",
      "aria-hidden": "true",
      focusable: "false"
    }, React.createElement("path", {
      d: "M395 277 L 450 275 L 490 262 L 505 250",
      className: "npsmap__ban"
    }), [[1, 113, 92], [2, 230, 148], [3, 362, 276], [4, 505, 247], [5, 672, 310]].map(([n, cx, cy]) => React.createElement("g", {
      key: n
    }, React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: "14",
      className: "npsmap__pin " + (n <= 2 ? "npsmap__pin--ink" : "npsmap__pin--rust")
    }), React.createElement("text", {
      x: cx,
      y: cy + 5,
      textAnchor: "middle",
      className: "npsmap__num"
    }, n))))), React.createElement("figcaption", null, React.createElement("span", null, React.createElement("b", null, "1"), " Curry Village trailhead parking"), React.createElement("span", null, React.createElement("b", null, "2"), " Happy Isles trailhead, shuttle stop 16"), React.createElement("span", null, React.createElement("b", null, "3"), " Vernal Fall footbridge"), React.createElement("span", null, React.createElement("b", null, "4"), " Top of Vernal Fall"), React.createElement("span", null, React.createElement("b", null, "5"), " Top of Nevada Fall"), React.createElement("span", null, React.createElement("i", {
      className: "npsmap__key npsmap__key--ban",
      "aria-hidden": "true"
    }), " Weekday repair section, 2026"), React.createElement("span", null, "Map: National Park Service (public domain), cropped.")));
  }
  var SEASONS = [{
    when: "May through mid-June",
    name: "Peak waterfall",
    cls: "is-peak",
    text: "The falls at full power and the granite soaked. The most crowded and the most slippery."
  }, {
    when: "Late June through July",
    name: "Mid-season",
    cls: "is-mid",
    text: "Less mist, drier and safer stairs, and slightly thinner weekday crowds."
  }, {
    when: "August through October",
    name: "Late season",
    cls: "is-late",
    text: "Often less spray. The stairs are still steep, and rain makes them slippery in any month."
  }];
  return React.createElement("div", {
    className: "mt-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "To Nevada Fall"), React.createElement("dd", null, "5.4 miles round trip")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("dt", null, "The climb"), React.createElement("dd", null, "About 2,000 feet")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "The start"), React.createElement("dd", null, "Happy Isles, shuttle stop 16")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "The mist"), React.createElement("dd", null, "Heaviest in May and June"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section mt-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "The Mist Trail starts at Happy Isles in Yosemite Valley. Choose the Vernal Fall footbridge for a shorter hike, or continue up steep granite steps to Vernal Fall and Nevada Fall. Above the footbridge, expect a strenuous climb, wet footing during snowmelt, and exposed sections beside the waterfalls."), React.createElement("p", null, React.createElement("strong", null, "Distances from Happy Isles:"), " 1.6 miles round trip to the footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall. Allow 1 to 1.5 hours, about 3 hours, or 5 to 6 hours respectively. Parking adds walking distance. These are the ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm"
  }, "NPS route estimates"), "."), React.createElement("p", null, "Check ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm"
  }, "current trail closures"), " before choosing your route. The weekday repair detour described below affects the staircase to Vernal Fall through October 2026, subject to change.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Pick a turnaround: the footbridge, Vernal Fall, or Nevada Fall."), React.createElement("li", null, "Wear shoes with real tread. The steps are wet and uneven."), React.createElement("li", null, "Put your phone in a ziplock and pack a dry shirt."), React.createElement("li", null, "Stay behind the railings. Never wade or swim above the falls.")), React.createElement("a", {
    className: "mt-short__link",
    href: "#sec-4-the-safety-talk"
  }, "How much water to carry ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-0-what-the-mist-trail-actually-is",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT THE MIST TRAIL ACTUALLY IS"), React.createElement("h2", null, "Two waterfalls, four turnarounds"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "The Mist Trail starts at Happy Isles, at the east end of Yosemite Valley, and climbs beside two waterfalls: Vernal Fall (317 feet) and Nevada Fall (594 feet). The full trail to the top of Nevada Fall is about 5.4 miles round trip with roughly 2,000 feet of elevation gain. If you only go to the Vernal Fall footbridge, where most families turn around, it's 1.6 miles round trip with about 400 feet of gain."), React.createElement("p", null, "You can stop at any of four natural turnarounds, and each one works as a full hike on its own."))), React.createElement(RouteMap, null)), React.createElement("div", {
    className: "mt-turns"
  }, TURNS.map(t => React.createElement("article", {
    key: t.n,
    className: "mt-turn"
  }, React.createElement("p", {
    className: "mt-turn__num"
  }, t.n + 2), React.createElement("h3", null, t.name), React.createElement("p", {
    className: "mt-turn__line"
  }, t.line), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Round trip"), React.createElement("dd", null, t.rt)), React.createElement("div", null, React.createElement("dt", null, "Climb"), React.createElement("dd", null, t.gain)), React.createElement("div", null, React.createElement("dt", null, "Allow"), React.createElement("dd", null, t.time)), React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, t.water)), React.createElement("div", null, React.createElement("dt", null, "Crowd"), React.createElement("dd", null, t.crowd)))))), React.createElement("p", {
    className: "ff-note"
  }, "The numbers match the map: 3, 4 and 5. Times are the NPS route estimates from Happy Isles; parking adds walking distance."), React.createElement("div", {
    className: "ff-split mt-turns__prose"
  }, React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The Vernal Fall footbridge"), " (0.8 miles from Happy Isles, 400 ft gain). Paved trail, a moderate grade, and a clear look at Vernal Fall from the bridge. Most families with young kids turn around here, and it's worth the walk even if you go no farther."), React.createElement("p", null, React.createElement("strong", null, "The top of Vernal Fall"), " (about 1.2 miles from Happy Isles, 1,000 ft gain). This is where the trail earns the \"mist\" in its name. You climb a granite staircase right next to the fall, and when it's running at peak volume (May and June), you get drenched. The granite steps are wet, steep, and uneven. A metal railing is bolted into the rock on the exposed side. At the top there's an emerald pool above the fall and a view down the canyon."), React.createElement("p", null, React.createElement("strong", null, "The top of Nevada Fall"), " (2.7 miles from Happy Isles, 2,000 ft gain). Past Vernal, the trail heads through forest and up the Merced River canyon to the base of Nevada Fall, then to its top. Up there you're looking down 594 feet of whitewater with Liberty Cap and Half Dome standing behind you, one of the most dramatic views in the park."), React.createElement("p", null, React.createElement("strong", null, "The return via the John Muir Trail."), " From Nevada Fall, the JMT provides a longer descent with gentler grades than the Mist Trail stairs. Allow roughly 5.8 miles for the loop from Happy Isles, by the printed Yosemite Guide's count, plus the walk to your parking space. Check closures before relying on either route.")), React.createElement("div", null, React.createElement("figure", {
    className: "mt-profile"
  }, React.createElement("figcaption", null, "The climb, turnaround by turnaround"), React.createElement(Turnarounds, null), React.createElement("p", {
    className: "ff-note"
  }, "The four turnarounds, from the figures above: straight lines between the published points, not a surveyed profile. The crowd notes are from the crowd section below. Coming down the John Muir Trail from the top of Nevada Fall makes a loop of about 5.8 miles from Happy Isles, by the printed Yosemite Guide's count, plus the walk to your parking space.")), React.createElement("p", {
    className: "ff-alert mt-halfdome"
  }, React.createElement(EventIcon, {
    name: "dome"
  }), React.createElement("span", null, "Keep going past Nevada Fall and you're on the standard approach to Half Dome. If that's the plan, read the ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "permit lottery guide"), " first, and ", React.createElement("a", {
    href: "/articles/so-you-want-to-hike-half-dome"
  }, "the honest case for the cables"), " before you commit.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-1-the-wet-granite-reality",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE WET GRANITE REALITY"), React.createElement("h2", null, "Over 600 steps, and all of them wet"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "From mid-April to late June, the granite staircase below Vernal Fall is basically a waterfall of its own. Spray hits the trail the whole time. The steps, over 600 of them on the stretch to the top of Vernal Fall by the Park Service's count, are wet, mossy in places, and uneven. Some are a foot tall. Some are two feet tall. Some are angled in ways that make your feet slide."), React.createElement("p", null, "Wet steps and loose rock make slipping a concern. Slow down, leave room for other hikers, and use the railings where provided."), React.createElement("p", null, React.createElement("strong", null, "Wear hiking boots or trail shoes with good tread."), " Running shoes with worn-out soles are a slip waiting to happen. Flip-flops, sandals, and fashion sneakers are dangerous on wet granite. I've watched people go down hard on these stairs in shoes that had no business being on a wet rock face."), React.createElement("p", null, "Wear footwear with good traction that you have already walked in comfortably. Price alone does not tell you how a shoe will grip wet rock.")), React.createElement("ul", {
    className: "mt-shoes"
  }, React.createElement("li", {
    className: "is-yes"
  }, React.createElement(EventIcon, {
    name: "check"
  }), React.createElement("span", null, React.createElement("strong", null, "Boots or trail shoes"), " with good tread, already walked in")), React.createElement("li", {
    className: "is-no"
  }, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("span", null, React.createElement("strong", null, "Running shoes"), " with worn-out soles")), React.createElement("li", {
    className: "is-no"
  }, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("span", null, React.createElement("strong", null, "Flip-flops, sandals, fashion sneakers"))))), React.createElement("figure", {
    className: "mt-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/vernal-fall-high-water.jpg",
    style: {
      aspectRatio: "2000 / 3000"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Vernal Fall at high water in late spring, white spray filling the granite gorge below it"
  }), React.createElement("figcaption", null, "Vernal Fall at high water, the season the staircase beside it runs wet. Photo: Brandon Raines / Pexels")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-2-you-will-get-wet",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOU WILL GET WET"), React.createElement("h2", null, "Twenty minutes in a rainstorm"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "In May and June, when the Merced River is running at full snowmelt volume, the spray zone below Vernal Fall feels like standing in a rainstorm for twenty minutes. Your clothes get soaked through. So does your phone, your camera and your pack."), React.createElement("p", null, "Here's how to deal with it."))), React.createElement("div", {
    className: "mt-wet"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "signal"
  }), React.createElement("strong", null, "The phone"), React.createElement("p", null, "Put your phone in a ziplock bag. You can still shoot photos through it. A waterproof phone case is even better.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("strong", null, "The clothes"), React.createElement("p", null, "Wear synthetic or wool, not cotton. Wet cotton gets heavy and cold and takes hours to dry. Pack a dry layer; drying time depends on the weather.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "cloud"
  }), React.createElement("strong", null, "The shell"), React.createElement("p", null, "A ", React.createElement("a", {
    className: "aff-link",
    href: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+jacket"),
    target: "_blank",
    rel: "sponsored noopener",
    "data-aff-network": "patagonia",
    "data-aff-list": "article_inline",
    "data-aff-item-slug": "mist-trail-the-real-guide",
    "data-aff-name": "Packable rain jacket"
  }, "rain jacket"), " helps protect against spray and wind. In July and August, when the falls are lower, you might get misted rather than soaked. In May and June it keeps you warm on the way up, though you'll sweat under it.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "sun"
  }), React.createElement("strong", null, "The top"), React.createElement("p", null, "Pack a dry shirt in a ziplock and change at the top. Otherwise you shiver the rest of the way."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-3-when-to-go",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN TO GO"), React.createElement("h2", null, "The falls decide the trail"), React.createElement("ol", {
    className: "mt-seasons"
  }, SEASONS.map(s => React.createElement("li", {
    key: s.name,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split mt-when"
  }, React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Peak waterfall (May through mid-June)."), " Vernal Fall is thundering, the mist zone is intense, the granite is soaked, and Nevada Fall is at full power. This is the version people come for. It's also the most crowded and the most slippery."), React.createElement("p", null, React.createElement("strong", null, "Mid-season (late June through July)."), " The flow drops, the mist zone shrinks, and the stairs get drier and safer. Still beautiful, and the weekday crowds thin a little."), React.createElement("p", null, React.createElement("strong", null, "Late season (August through October)."), " Waterfall flow usually decreases and there is often less spray. The stairs remain steep and uneven; rain can make them slippery in any month.")), React.createElement("div", {
    className: "mt-getting"
  }, React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "GETTING TO THE TRAILHEAD"), React.createElement("h3", null, "Park at Curry Village, or ride"), React.createElement("p", null, "Happy Isles has no trailhead parking. Use ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "Curry Village parking"), " and walk, or take the ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "Valley shuttle"), " to stop 16. Start early for cooler conditions and fewer people, while observing any repair closures.")), React.createElement("div", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("p", null, React.createElement("strong", null, "2026 weekday restrictions."), " From July 27 through October, subject to change, repair work closes the section from the JMT junction above the footbridge to the top of Vernal Fall Monday through Thursday, 7 a.m. to 3:30 p.m. Follow the signed JMT detour. The section normally opens outside those hours when safe, and on Fridays, weekends and holidays. The JMT Ice Cut reopened July 27. Check the ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm"
  }, "NPS detour notice"), " before setting out."))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-4-the-safety-talk",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SAFETY TALK"), React.createElement("h2", null, "Not an easy walk"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "The internet makes this trail look like an easy walk. It isn't one."), React.createElement("p", null, "Choose a turnaround that matches your fitness and the conditions. Heat, a sustained climb, and a long descent can make this hike harder than its mileage suggests."), React.createElement("p", null, "The pools above Vernal Fall and Nevada Fall look calm and inviting. They aren't. The current is powerful, the granite is slick when wet, and the lip of the fall is just downstream. A slip beyond the railing can be fatal. The NPS signs are accurate."), React.createElement("p", null, "Stay behind the railings. Don't wade. Don't swim in the pools above the falls. Don't walk on the wet granite near the edge \"for a photo.\" This is the single most important safety rule on this trail, and it's the rule that, when broken, has killed people. Swimming in the Emerald Pool and the Silver Apron is prohibited; ", React.createElement("a", {
    href: "/articles/swimming-in-the-merced"
  }, "the swimming guide"), " lays out where in this park you may and may not get in the water, and what the Park Service has documented happening here."), React.createElement("p", null, "Carry a headlamp, food, and enough water for the whole hike. Turn around before fatigue or daylight makes the descent difficult."), React.createElement("p", null, "For a shorter option, turn around at the footbridge. Even that route climbs about 400 feet; the paved surface does not make it a flat walk. Beyond it, the stairs require balance and steady footing, especially for children."))), React.createElement("div", {
    className: "mt-water"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WATER, PER PERSON"), React.createElement("ol", {
    className: "mt-water__list"
  }, React.createElement("li", null, React.createElement("span", null, "Footbridge"), React.createElement("strong", null, "1 liter"), React.createElement("i", {
    style: {
      "--l": 1
    }
  })), React.createElement("li", null, React.createElement("span", null, "Top of Vernal Fall"), React.createElement("strong", null, "2 liters"), React.createElement("i", {
    style: {
      "--l": 2
    }
  })), React.createElement("li", null, React.createElement("span", null, "Top of Nevada Fall"), React.createElement("strong", null, "3 to 4 liters"), React.createElement("i", {
    style: {
      "--l": 4
    }
  }))), React.createElement("p", {
    className: "mt-water__text"
  }, React.createElement("strong", null, "Water:"), " Carry 1 liter per person for the footbridge, 2 for Vernal Fall, and 3 to 4 for Nevada Fall, with more as conditions require. Drinking water is at Happy Isles and seasonally at the Vernal Fall footbridge, usually May through October. There is no drinking-water tap at Nevada Fall. Toilets are separate from water sources; bring enough if the footbridge tap is off."))), React.createElement("ul", {
    className: "ff-rules mt-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Stay behind the railings."), React.createElement("p", null, "A slip beyond the railing can be fatal. Don't walk on the wet granite near the edge for a photo.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "lake",
    size: 26
  }), React.createElement("strong", null, "Don't wade or swim above the falls."), React.createElement("p", null, "The current is powerful and the lip of the fall is just downstream. Swimming in the Emerald Pool and the Silver Apron is prohibited.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "check",
    size: 26
  }), React.createElement("strong", null, "Carry a headlamp, food and water."), React.createElement("p", null, "Enough for the whole hike. There is no drinking-water tap at Nevada Fall.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Turn around in time."), React.createElement("p", null, "Before fatigue or daylight makes the descent difficult. The footbridge is a full hike on its own."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-5-the-crowd-question",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CROWD QUESTION"), React.createElement("h2", null, "The crowd thins as you climb"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "Yes, it's crowded, especially on weekends from May through July. The Mist Trail is Yosemite's signature hike and it draws people from all over the world. ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "The park-wide crowd calendar"), " has the month-by-month numbers."), React.createElement("p", null, "The good news: the crowd thins fast as you climb. The footbridge is packed. The staircase is busy. The top of Vernal Fall has people. The section between Vernal and Nevada Falls is noticeably quieter. The top of Nevada Fall, on a weekday, can feel almost empty."), React.createElement("p", null, "For fewer people, aim for an early weekday start, but check the repair schedule first. Continuing to Nevada Fall adds distance and climbing; do it because you have the time and energy, not just to escape the crowd."))), React.createElement("div", null, React.createElement("h3", {
    className: "mt-crowd__head"
  }, "From the bottom up"), React.createElement("ol", {
    className: "ff-hours mt-crowd"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "The footbridge"), React.createElement("p", null, "Packed.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "The staircase"), React.createElement("p", null, "Busy.")), React.createElement("li", null, React.createElement("span", null, "The top of Vernal Fall"), React.createElement("p", null, "Has people.")), React.createElement("li", null, React.createElement("span", null, "Vernal to Nevada"), React.createElement("p", null, "Noticeably quieter.")), React.createElement("li", null, React.createElement("span", null, "The top of Nevada Fall"), React.createElement("p", null, "On a weekday, can feel almost empty.")))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-6-is-it-worth-it",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IS IT WORTH IT"), React.createElement("h2", null, "Yes, and plan on getting soaked"), React.createElement("div", {
    className: "mt-prose"
  }, React.createElement("p", null, "Yes. In peak waterfall season the Mist Trail is one of the best day hikes in the United States."), React.createElement("p", null, "Prepare for a mountain hike: check closures, choose your turnaround, wear grippy shoes, and carry enough water. The waterfall views are worth taking time for, especially when the stairs are wet."), React.createElement("p", null, "So come ready. Read the ", React.createElement("a", {
    href: "/kit"
  }, "day pack packing list"), ", and ", React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite"
  }, "pack the car"), " the night before so the early start actually happens. Start early. Wear real shoes. Bring a ziplock for your phone and a dry shirt for the top."), React.createElement("p", {
    className: "mt-signoff"
  }, "Then plan on getting soaked."))), React.createElement("figure", {
    className: "mt-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/happy-isles-ouzel-watch.jpg",
    style: {
      aspectRatio: "1600 / 1232"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The rapids of the Merced River at Happy Isles, where the Mist Trail starts"
  }), React.createElement("figcaption", null, "The Merced at Happy Isles, where the trail starts. Photo: George Fiske / Wikimedia Commons (public domain)")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "mist-trail-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Mist Trail questions, answered"), React.createElement("div", {
    className: "mt-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Vernal and Nevada Falls, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Current conditions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The Yosemite Guide, NPS Yosemite"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap mt-end"
  }, React.createElement(AffiliateNote, null)));
};
