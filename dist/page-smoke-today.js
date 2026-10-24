var SMK_CHECKED = "October 22, 2026";
var SMK_AIR_URL = (typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com") + "/api/air";
var SMK_REFRESH_MS = 15 * 60 * 1000;
var SMK_WARN_MS = 3 * 60 * 60 * 1000;
var SMK_HIDE_MS = 24 * 60 * 60 * 1000;
var SMOKE_BULLETIN_URL = "/bulletin.json?v=24";
var SMK_FIRE_AIRNOW = "https://fire.airnow.gov/";
var SMK_NPS_AIR = "https://www.nps.gov/yose/learn/nature/aqmonitoring.htm";
var SMK_NPS_CONDITIONS = "https://www.nps.gov/yose/planyourvisit/conditions.htm";
var SMK_SMOKE_ARTICLE = "/articles/yosemite-during-smoke-season";
var SMK_BANDS = [["0 to 50", "Good", "Almost no health concerns for anyone. A normal park day."], ["51 to 100", "Moderate", "Generally fine for most visitors; the views may be hazy. People with severe asthma or other respiratory conditions should be cautious."], ["101 to 150", "Unhealthy for sensitive groups", "Children, older adults and anyone with respiratory issues should reduce outdoor exertion. Pick shorter, lower-effort walks, and leave the long climbs for another day."], ["151 to 200", "Unhealthy", "Reduce outdoor activity and skip the strenuous hikes. Try the high country; if it is smoky too, take the day indoors. Sensitive groups should stay indoors."], ["201 to 300", "Very Unhealthy", "Don't hike. Spend time indoors when possible, and seriously consider moving the trip."], ["301 and up", "Hazardous", "Don't be outside. This is when you cancel or relocate."]];
var SMK_RULES = [["mountain", "The Valley holds it", "Yosemite Valley is a granite trough with its floor at about 4,000 feet. Smoke pours in on the prevailing winds and cold air drains it down off the ridges at night, so the Valley is often the worst air in the park."], ["route", "Up is often better, not always", "Above about 7,500 feet, Glacier Point and Tuolumne Meadows are sometimes above the layer that holds the smoke down. During the Dome Fire, the park's forecasts had Tuolumne under the same rating as the Valley on some days."], ["clock", "Check again at noon", "During the Dome Fire, the park's smoke forecasts had the lower park worst in the morning and clearing in the afternoon. A smoky dawn is not a verdict on the day."], ["cloud", "Wind beats distance", "A distant fire with a direct wind can put smoke in the Valley faster than a near one with the wind blowing the other way. Read the wind in the forecast, not just the fire map."], ["walk", "Cancel the long hikes first", "The long, high-effort climbs are where you breathe the most air. The short Valley walks are easy to take on a hazy day and easy to skip."], ["users", "Tighter lines for some", "Older adults and anyone with a heart or lung condition: treat 100 as the line, not 150. Be more conservative still with children, who breathe faster. N95 masks reduce the dose; carry a few."]];
var SMK_READS = [[SMK_SMOKE_ARTICLE, "Visiting during smoke season", "The geography of smoke, the decision tree, and the tactics"], ["/articles/wildfire-in-yosemite-during-your-trip", "A wildfire during your trip", "The closure list, the bookings, and when to keep, move or cancel"], ["/conditions", "Conditions", "Webcams, entrance waits, forecasts"], ["/webcams", "Webcams", "See the haze for yourself before you drive"], ["/articles/tuolumne-meadows-in-a-day", "Tuolumne Meadows in a day", "The high-country day, while Tioga Road is open"], ["/road-status", "Road status", "Every park road, and where to check it"]];
var SMK_FAQ = [["Is there smoke in Yosemite today?", "The reading at the top of this page is AirNow's latest for the reporting area nearest Yosemite Valley, within 50 miles, as this site's API last read it. It names the area and the hour, and it disappears when it is more than a day old. For monitor-by-monitor readings in and near the park, check fire.airnow.gov; for park-specific smoke updates and closures, check the National Park Service's air quality and current conditions pages."], ["Where in Yosemite is the air usually cleanest during a fire?", "Often the high country. Yosemite Valley traps smoke, and Glacier Point and Tuolumne Meadows, above about 7,500 feet, are sometimes above it. Not always: during the Dome Fire the park's forecasts had Tuolumne under the same rating as the Valley on some days, so read the day's forecast by area."], ["What AQI is too high for a hike in Yosemite?", "At 101 to 150, unhealthy for sensitive groups, pick shorter, lower-effort walks. At 151 to 200, unhealthy, skip strenuous hikes. Above 200, don't hike. Older adults and anyone with a respiratory or heart condition should treat 100 as the line, not 150, and children call for more caution still."], ["When is smoke season in Yosemite?", "Fire season runs from roughly July through November, according to the Park Service, and into June in dry years."]];
function smkObservedLabel(observedAt) {
  var m = typeof observedAt === "string" && observedAt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):00$/);
  if (!m) return null;
  var h = Number(m[2]);
  var hour = h === 0 ? "midnight" : h === 12 ? "noon" : `${h % 12} ${h < 12 ? "a.m." : "p.m."}`;
  return `${hour}, ${hpLongDate(m[1]).replace(/, \d{4}$/, "")}`;
}
function smkAge(ms) {
  var min = Math.max(0, Math.round(ms / 60000));
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  var h = Math.round(min / 60);
  return `${h} hour${h === 1 ? "" : "s"} ago`;
}
function SmkReading() {
  var [data, setData] = React.useState(null);
  var [, setTick] = React.useState(0);
  React.useEffect(() => {
    var cancelled = false;
    var load = () => {
      fetch(SMK_AIR_URL).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))).then(body => {
        if (!cancelled && body) setData(body);
      }).catch(() => {});
      setTick(t => t + 1);
    };
    load();
    var timer = setInterval(load, SMK_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);
  var fetched = data && data.fetchedAt ? Date.parse(data.fetchedAt) : NaN;
  var ageMs = isFinite(fetched) ? Date.now() - fetched : Infinity;
  var live = data && typeof data.aqi === "number" && ageMs <= SMK_HIDE_MS;
  if (!live) {
    return React.createElement("div", {
      className: "sm-reading sm-reading--none",
      "aria-live": "polite"
    }, React.createElement("p", {
      className: "sm-reading__label"
    }, "The latest reading"), React.createElement("p", {
      className: "sm-reading__empty"
    }, "No current reading from AirNow on this page right now."), React.createElement("p", {
      className: "sm-reading__meta"
    }, "Use the sources below; they are the ones that know."));
  }
  var observed = smkObservedLabel(data.observedAt);
  return React.createElement("div", {
    className: "sm-reading",
    "aria-live": "polite"
  }, React.createElement("p", {
    className: "sm-reading__label"
  }, "The latest reading"), React.createElement("p", {
    className: "sm-reading__value"
  }, React.createElement("span", {
    className: "sm-reading__aqi"
  }, "AQI ", data.aqi), data.category && React.createElement("span", {
    className: "sm-reading__cat"
  }, data.category)), React.createElement("p", {
    className: "sm-reading__meta"
  }, [data.reportingArea ? `AirNow, ${data.reportingArea} reporting area` : "AirNow", data.pollutant ? `worst pollutant ${data.pollutant}` : null, observed ? `observed ${observed}` : null].filter(Boolean).join(" · "), ageMs > SMK_WARN_MS && React.createElement("strong", null, " · This reading is ", smkAge(ageMs), "; check the sources below for a newer one.")));
}
function SmkFire({
  go
}) {
  var [fire, setFire] = React.useState(null);
  React.useEffect(() => {
    var cancelled = false;
    fetch(SMOKE_BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(data => {
      if (cancelled || !data) return;
      var ed = data.edition || {};
      if (ed.end) {
        var end = new Date(ed.end + "T00:00:00");
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!Number.isNaN(end.getTime()) && today > end) return;
      }
      var tiles = Array.isArray(data.headlines) ? data.headlines : [];
      var tile = tiles.find(h => /\bfire\b/i.test(h.label || ""));
      if (tile) setFire(tile);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!fire) return null;
  return React.createElement("p", {
    className: "ff-alert sm-fire"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, fire.label, fire.status ? `: ${fire.status}.` : "."), " The closures and the park's latest word are in ", React.createElement(HomeLink, {
    go: go,
    location: "smoke_today_fire",
    href: "/now"
  }, "the Park Bulletin"), "."));
}
function SmokeTodayPage({
  go
}) {
  var toc = [["#smoke-now", "The latest reading"], ["#smoke-scale", "What the number means"], ["#smoke-where", "Where the smoke sits"], ["#smoke-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-smoke"
  }, React.createElement("div", {
    className: "ff-cover rd-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/tunnel-view-ferguson-fire-smoke.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Visitors at a stone-walled overlook on Tunnel View in a haze of wildfire smoke, El Capitan faint in the distance",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Conditions",
      route: "conditions"
    }, {
      label: "Smoke today"
    }],
    eyebrow: "AIR QUALITY · AIRNOW · YOSEMITE VALLEY AND AROUND",
    title: "Is there smoke in Yosemite today?",
    intro: "The latest air-quality reading near Yosemite Valley, from AirNow, with the place and hour it came from. Under it: the official sources that outrank it, what each band of the AQI means for a day in the park, and where in the park the smoke tends to sit.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "smoke_today_head",
      className: "hp-button",
      href: "#smoke-now"
    }, "The latest reading ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "smoke_today_head",
      className: "hp-link",
      href: "#smoke-scale"
    }, "What the number means ↓"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Tunnel View in Ferguson Fire smoke, July 2018. Photo: USDA Forest Service Region 5 / Wikimedia Commons (CC BY 2.0)")), React.createElement("section", {
    className: "hp-wrap rd-official sm-now",
    id: "smoke-now",
    tabIndex: -1,
    "aria-labelledby": "sm-now-h"
  }, React.createElement("div", {
    className: "rd-official__head"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement(EventIcon, {
    name: "cloud",
    size: 16
  }), " AIR QUALITY NEAR YOSEMITE VALLEY"), React.createElement("h2", {
    id: "sm-now-h"
  }, "One number, and where it came from."), React.createElement("p", {
    className: "ff-lede"
  }, "The highest pollutant reading AirNow reports for the area nearest Yosemite Valley, within 50 miles. The area that answers is not always inside the park, and smoke varies from one part of the park to the next, so the sources under it come first when they disagree.")), React.createElement(SmkReading, null), React.createElement(SmkFire, {
    go: go
  }), React.createElement("ul", {
    className: "rd-official__list"
  }, React.createElement("li", null, React.createElement("a", {
    href: SMK_FIRE_AIRNOW,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "AirNow Fire and Smoke Map ↗"), React.createElement("span", null, "The EPA's official map: AQI readings monitor by monitor in and near the park, updated several times a day."))), React.createElement("li", null, React.createElement("a", {
    href: SMK_NPS_AIR,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS air quality and smoke ↗"), React.createElement("span", null, "The park's own air quality and smoke monitoring page. Worth a look the morning of any big hike in smoke season."))), React.createElement("li", null, React.createElement("a", {
    href: SMK_NPS_CONDITIONS,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS current conditions ↗"), React.createElement("span", null, "Smoke events alongside the road and trail closures. Read it within 24 hours of a trip in fire season.")))), React.createElement("p", {
    className: "rd-checked"
  }, React.createElement("strong", null, "Last checked: ", SMK_CHECKED, "."), " That is the date the guidance and links on this page were last reviewed, not the date of the reading, which carries its own hour.")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Fire season"), React.createElement("dd", null, "Roughly July through November")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("dt", null, "Valley floor"), React.createElement("dd", null, "About 4,000 feet, where smoke settles")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "Often cleaner"), React.createElement("dd", null, "Above about 7,500 feet")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "eye"
  }), React.createElement("dt", null, "Reading from"), React.createElement("dd", null, "AirNow (EPA)"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "smoke_today_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "ff-band",
    id: "smoke-scale",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE AIR QUALITY INDEX",
    title: "What the number means for a day in the park"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The bands are the AQI's own; what to do in each is this site's advice, the same as ", React.createElement(HomeLink, {
    go: go,
    location: "smoke_today_scale",
    href: SMK_SMOKE_ARTICLE
  }, "the smoke-season guide"), ". Children, older adults and anyone with a respiratory or heart condition need tighter lines, under \"Where the smoke sits\" below."), React.createElement("ol", {
    className: "rd-pattern sm-bands"
  }, SMK_BANDS.map(([range, cat, what]) => React.createElement("li", {
    key: range
  }, React.createElement("span", null, range), React.createElement("p", null, what), React.createElement("strong", {
    className: "sm-bands__cat"
  }, cat)))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "smoke-where",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE THE SMOKE SITS",
    title: "The same day, different air"
  }), React.createElement("ul", {
    className: "ff-rules"
  }, SMK_RULES.map(([icon, head, text]) => React.createElement("li", {
    key: head
  }, React.createElement(EventIcon, {
    name: icon,
    size: 26
  }), React.createElement("strong", null, head), React.createElement("p", null, text)))), React.createElement("div", {
    className: "rd-reads"
  }, React.createElement("h3", null, "Read next"), React.createElement("ul", null, SMK_READS.map(([href, label, note]) => React.createElement("li", {
    key: href
  }, React.createElement(HomeLink, {
    go: go,
    location: "smoke_today_reads",
    href: href
  }, React.createElement("strong", null, label), React.createElement("span", null, note))))))), React.createElement("section", {
    className: "ff-band",
    id: "smoke-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite smoke questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "Smoke and closures are separate problems: a fire's closure list is on ", React.createElement(HomeLink, {
    go: go,
    location: "smoke_today_faq",
    href: "/now"
  }, "the Park Bulletin"), ", and what a closed road does to a trip is on ", React.createElement(HomeLink, {
    go: go,
    location: "smoke_today_faq",
    href: "/road-status"
  }, "the road-status page"), ".")), React.createElement("div", {
    className: "ff-faq"
  }, SMK_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "smoke-today",
    title: "Past the gate, the signal goes.",
    intro: "Most of the park has no cell service, so check the air in the last town. The Field Guide app carries offline maps, every stop with parking notes, and a trip planner that works without a signal.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "The park this week, from inside it",
    heading: "The park this week, from inside it",
    blurb: "What the park is doing right now: what is open, what is flowing, and what changed.",
    location: "smoke-today",
    tag: "smoke-today"
  }));
}
window.SmokeTodayPage = SmokeTodayPage;
