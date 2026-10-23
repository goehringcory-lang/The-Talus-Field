var WF_FLOW_URL = (typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com") + "/api/flow";
var WF_USGS_PAGE = "https://waterdata.usgs.gov/monitoring-location/11264500/";
var WF_REFRESH_MS = 15 * 60 * 1000;
var WF_WARN_MS = 12 * 60 * 60 * 1000;
var WF_HIDE_MS = 72 * 60 * 60 * 1000;
var WF_BAND_LABEL = {
  roaring: "Roaring",
  strong: "Strong",
  moderate: "Moderate",
  trickle: "Trickle",
  dry: "Dry"
};
function wfStamp(iso) {
  var t = Date.parse(iso);
  if (!isFinite(t)) return "";
  try {
    return new Date(t).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    });
  } catch (e) {
    return new Date(t).toUTCString();
  }
}
function WfLive({
  go
}) {
  var {
    useState,
    useEffect
  } = React;
  var [state, setState] = useState({
    status: "loading",
    data: null
  });
  useEffect(() => {
    var cancelled = false;
    var load = () => {
      fetch(WF_FLOW_URL).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))).then(body => {
        if (!cancelled) setState({
          status: "done",
          data: body || null
        });
      }).catch(() => {
        if (!cancelled) setState(s => s.data ? s : {
          status: "done",
          data: null
        });
      });
    };
    load();
    var timer = setInterval(load, WF_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);
  var d = state.data;
  var stampIso = d && (d.observedAt || d.fetchedAt);
  var age = stampIso ? Date.now() - Date.parse(stampIso) : NaN;
  var live = d && WF_BAND_LABEL[d.band] && isFinite(age) && age <= WF_HIDE_MS;
  var old = live && age > WF_WARN_MS;
  return React.createElement("section", {
    className: "hp-wrap wf-live",
    id: "wf-live",
    tabIndex: -1,
    "aria-labelledby": "wf-live-h",
    "aria-live": "polite"
  }, React.createElement("div", {
    className: "wf-live__head"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 16
  }), " LIVE · MERCED RIVER AT HAPPY ISLES · USGS GAUGE 11264500"), React.createElement("h2", {
    id: "wf-live-h"
  }, "The river below Vernal and Nevada Falls, right now")), React.createElement("div", {
    className: "wf-live__body"
  }, state.status === "loading" ? React.createElement("div", {
    className: "wf-live__read is-loading"
  }, React.createElement("p", {
    className: "wf-live__band"
  }, "Reading the gauge…")) : live ? React.createElement("div", {
    className: "wf-live__read"
  }, React.createElement("p", {
    className: "wf-live__band"
  }, WF_BAND_LABEL[d.band], d.band !== "dry" ? React.createElement("span", null, " flow") : null), typeof d.cfs === "number" && React.createElement("p", {
    className: "wf-live__cfs"
  }, React.createElement("strong", null, Math.round(d.cfs).toLocaleString("en-US")), " cubic feet per second"), React.createElement("p", {
    className: "wf-live__when"
  }, "Reading taken ", wfStamp(stampIso), ".", old ? " This reading is more than 12 hours old; the gauge may be offline." : "")) : React.createElement("div", {
    className: "wf-live__read is-silent"
  }, React.createElement("p", {
    className: "wf-live__band"
  }, "No current reading"), React.createElement("p", {
    className: "wf-live__when"
  }, "The gauge has not reported recently, or the site cannot reach it. The U.S. Geological Survey publishes it directly: ", React.createElement("a", {
    href: WF_USGS_PAGE,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Merced River at Happy Isles Bridge ↗"))), React.createElement("div", {
    className: "wf-live__notes"
  }, React.createElement("p", null, React.createElement("strong", null, "What it measures."), " The Merced River at Happy Isles, downstream of Vernal and Nevada Falls, so it reads the water those two falls are made of. They are river falls and run in every month of the year."), React.createElement("p", null, React.createElement("strong", null, "What it does not."), " Yosemite Falls, Bridalveil, Ribbon and Sentinel are fed by their own creeks, which this gauge does not read. For them, use the calendar below and ", React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_live",
    href: "/webcams"
  }, "the webcams"), "."), React.createElement("p", {
    className: "wf-live__src"
  }, "The band word is the site's own rough grouping of the reading, not a USGS or park category. Data: ", React.createElement("a", {
    href: WF_USGS_PAGE,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "U.S. Geological Survey ↗")))));
}
var WF_FALLS = [["Yosemite Falls", "2,425 feet", "May", "Thins through July; often gone entirely by late August", "Creek-fed. In a big snow year it may limp into September; in a lean one it can quit in early August. After a big autumn rain it can roar back for a day or two.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"]], ["Bridalveil Fall", "620 feet", "May", "Never; a drifting ribbon by October", "The only fall pouring straight off the Valley wall that flows year-round. Expect to get wet at the viewpoint in May.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"]], ["Vernal and Nevada Falls", "317 and 594 feet", "May, into June", "Never; smaller but still substantial by September", "River falls on the main stem of the Merced, which never stops flowing. These are the two the live gauge reads.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"]], ["Illilouette Fall", "370 feet", "Spring and early summer", "Holds water later than the rim falls, well into fall most years", "Hidden in a side canyon, glimpsed from the trail below Vernal; the full view is from the Panorama Trail.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"], ["/articles/four-mile-up-panorama-down", "Four Mile up, Panorama down"]], ["Ribbon Fall", "1,612 feet", "Roughly April through June", "Vanishes completely after June", "The tallest single drop in the Valley, on the west shoulder of El Capitan, with a tiny watershed. In May, look from the pullouts west of El Capitan Meadow.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"]], ["Sentinel Fall", "Nearly 2,000 feet", "Spring only", "Gone by July", "A chain of cascades near Sentinel Rock, across from Yosemite Falls, with no trail and no signed viewpoint.", ["/articles/yosemite-waterfalls-guide", "The waterfalls guide"]], ["Wapama and Tueeulala Falls", "Hetch Hetchy", "April into May", "Tueeulala dries by early summer", "A few weeks ahead of the Valley, because Hetch Hetchy sits low. At peak flow the park closes the Wapama footbridges.", ["/articles/hetch-hetchy-the-other-yosemite-valley", "Hetch Hetchy"]], ["Chilnualna Fall", "Wawona", "May", "Never; the park says it flows year-round", "Views begin a quarter mile from the trailhead, at the lower cascades. An October visit sees a thin version.", ["/articles/wawona-yosemite-guide", "The Wawona guide"]]];
var WF_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var WF_MONTHS = [["Yosemite Falls", [["Thin, storm-fed", 1], ["Thin, storm-fed", 1], ["Rising", 2], ["Strong", 3], ["Peak", 4], ["Strong, tapering", 3], ["Thinning fast", 2], ["Often dry by late month", 1], ["Dry", 0], ["Dry", 0], ["Storm resurrections", 1], ["Storm resurrections", 1]]], ["Bridalveil", [["Thin", 1], ["Thin", 1], ["Rising", 2], ["Strong", 3], ["Peak", 4], ["Strong", 3], ["Moderate", 2], ["Thin", 1], ["Thin", 1], ["Thin", 1], ["Thin, rising", 1], ["Thin, rising", 1]]], ["Vernal & Nevada", [["Flowing", 2], ["Flowing", 2], ["Rising", 2], ["Strong", 3], ["Peak", 4], ["Peak to strong", 4], ["Strong", 3], ["Moderate", 2], ["Thin", 1], ["Thin", 1], ["Flowing", 2], ["Flowing", 2]]], ["Ribbon & Sentinel", [["Dry", 0], ["Dry", 0], ["Waking up", 1], ["Running", 3], ["Running", 3], ["Fading", 2], ["Gone", 0], ["Gone", 0], ["Gone", 0], ["Gone", 0], ["Storm only", 1], ["Storm only", 1]]]];
function wfPacificMonth() {
  try {
    var m = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      month: "numeric"
    });
    var n = parseInt(m, 10) - 1;
    return n >= 0 && n < 12 ? n : new Date().getMonth();
  } catch (e) {
    return new Date().getMonth();
  }
}
function WfMonthGrid() {
  var now = wfPacificMonth();
  return React.createElement("div", {
    className: "wf-months",
    role: "region",
    "aria-label": "Waterfall flow by month",
    tabIndex: 0
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, React.createElement("span", {
    className: "hp-sr-only"
  }, "Fall")), WF_MONTH_NAMES.map((m, i) => React.createElement("th", {
    scope: "col",
    key: m,
    className: i === now ? "is-now" : undefined
  }, m, i === now ? React.createElement("span", {
    className: "hp-sr-only"
  }, " (this month)") : null)))), React.createElement("tbody", null, WF_MONTHS.map(([name, cells]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row"
  }, name), cells.map(([word, lv], i) => React.createElement("td", {
    key: i,
    className: `wf-lv${lv}${i === now ? " is-now" : ""}`
  }, word)))))));
}
var WF_ARCHIVE = [["1924", "A light winter, no flood", "After a winter of light snowfall the naturalists wrote that the spring floods were lacking, and that by the middle of May the Merced was already on the wane.", "/archive/1924/vol-3-no-6/", "Vol. 3 No. 6"], ["1935", "A trickle all winter", "\"All winter some water trickles over this highest fall in the world,\" C. A. Harwell wrote of Upper Yosemite Fall. By March the rising water splashes over the ice cone at its base, and in most years the cone is gone by early April.", "/archive/1935/vol-14-no-5/", "Vol. 14 No. 5"], ["1937", "In flood, May to July", "\"In May, June, or even July, when the waters of Yosemite Creek shoot thunderingly over the brink of the valley rim,\" the bulletin wrote, a full-moon night was the time to climb the Yosemite Falls trail in search of the lunar rainbow.", "/archive/1937/vol-16-no-6/", "Vol. 16 No. 6"], ["1947–51", "Stopped by mid-August", "The Yosemite Museum's naturalist staff recorded the day Yosemite Falls stopped flowing: August 19, 1947; August 21, 1948; August 16, 1949; August 18, 1950; August 15, 1951.", "/archive/1953/vol-32-no-12/", "Vol. 32 No. 12"], ["1952–53", "Two long years", "Some water ran all summer in both years. The falls were essentially dry by October 1, 1952, and by September 15, 1953. The advice printed with the table: visit in late spring, for the peak of the display.", "/archive/1953/vol-32-no-12/", "Vol. 32 No. 12"], ["1954", "Waterwheel, highest in July", "Up the Tuolumne, Mary K. Ronsheim wrote that the river is highest and most spectacular at Waterwheel Falls in July, and that those falls \"never dry up completely, but continue all summer long.\"", "/archive/1954/vol-33-no-2/", "Vol. 33 No. 2"]];
var WF_RULES = [["drop", "It reads the river, not the rim", "The gauge answers for Vernal and Nevada Falls. A strong reading in August says nothing about Yosemite Falls, which by then is often a stain on the cliff."], ["calendar", "The snowpack sets the year", "The whole schedule shifts a few weeks earlier in a low-snowpack year and later in a heavy one. In 1924, after a light winter, the river was already falling by mid-May."], ["clock", "A reading, not a forecast", "It is the gauge's latest reported value, with the time it was taken printed beside it. Nothing on this page predicts next week's flow."], ["alert", "High water is dangerous", "The park says creeks and rivers tend to reach peak runoff in May or June. At Hetch Hetchy, snowmelt surges can send water over the Wapama Falls footbridges; if they are running white, turn around."]];
var WF_READS = [["/articles/yosemite-waterfalls-guide", "Yosemite waterfalls by month", "Every major fall, and why the creek-fed ones vanish"], ["/articles/yosemite-in-may", "Yosemite in May", "The month the water peaks, and what else is open"], ["/webcams", "Yosemite webcams", "Yosemite Falls on camera, for the falls no gauge reads"], ["/moonbow", "The moonbow", "Lower Yosemite Fall on spring full-moon nights"], ["/articles/hetch-hetchy-the-other-yosemite-valley", "Hetch Hetchy", "Wapama Falls, a few weeks ahead of the Valley"], ["/conditions", "Conditions", "Every live feed the site reads, on one board"]];
var WF_FAQ = [["Are Yosemite's waterfalls running right now?", "The live reading at the top of this page is the Merced River at Happy Isles, USGS gauge 11264500, below Vernal and Nevada Falls. Those two are river falls and flow in every month of the year. The creek-fed falls off the Valley rim, Yosemite Falls among them, have no live gauge here: by the calendar, Yosemite Falls is often gone by late August, dry through September and October, and can roar back for a day or two after a big autumn rain."], ["When are Yosemite's waterfalls at their peak?", "The Park Service says peak runoff typically happens in May or June, and its spring page narrows that to mid to late May. April through June is the waterfall window, with May at its center; the whole schedule shifts a few weeks earlier after a low-snow winter and later after a heavy one."], ["Which Yosemite waterfalls flow all year?", "Bridalveil Fall, which thins to a drifting ribbon by October but never quits, and Vernal and Nevada Falls, which sit on the main stem of the Merced River. The park says Chilnualna Fall in Wawona flows year-round too, and Illilouette Fall holds water well into fall most years."], ["When does Yosemite Falls dry up?", "In a typical year it thins through July and is often gone entirely by late August; in a big snow year it may last into September, and in a lean one it can quit in early August. The park's naturalists recorded it stopping between August 15 and August 21 in each year from 1947 to 1951."]];
function WaterfallsRunningPage({
  go
}) {
  var toc = [["#wf-live", "The live reading"], ["#wf-falls", "Fall by fall"], ["#wf-months", "Month by month"], ["#wf-record", "The record"], ["#wf-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-waterfalls"
  }, React.createElement("div", {
    className: "ff-cover wf-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/upper-yosemite-fall-spring-flow.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Upper Yosemite Fall at full spring flow, the 1,430-foot free leap of the tallest waterfall in North America",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Are the waterfalls running?"
    }],
    eyebrow: "SNOWMELT FALLS · RIVER FALLS · A LIVE GAUGE ON THE MERCED",
    title: "Are Yosemite's waterfalls running?",
    intro: "Most of Yosemite's waterfalls are snowmelt events: they peak in spring, and most are over by midsummer. Two kinds of answer are on this page. At the top, the live reading of the Merced River below Vernal and Nevada Falls, from the U.S. Geological Survey. Under it, each major fall's usual year, from the site's own waterfall reporting and the park naturalists' records.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "waterfalls_head",
      className: "hp-button",
      href: "#wf-live"
    }, "The river right now ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "waterfalls_head",
      className: "hp-link",
      href: "#wf-falls"
    }, "Fall by fall ↓"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Micah Bochart / Wikimedia Commons (public domain)")), React.createElement(WfLive, {
    go: go
  }), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Peak runoff"), React.createElement("dd", null, "May or June, the park says")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "Best weeks"), React.createElement("dd", null, "Mid to late May")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "check"
  }), React.createElement("dt", null, "All year"), React.createElement("dd", null, "Bridalveil, Vernal, Nevada")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("dt", null, "Often dry by late August"), React.createElement("dd", null, "Yosemite Falls"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "waterfalls_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "ff-band",
    id: "wf-falls",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE USUAL YEAR, FALL BY FALL",
    title: "When each fall peaks, and when it goes"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The creek-fed falls off the Valley rim drain small granite basins that hold snow, not groundwater, so they swing hardest. The river-fed ones hold on. Each line links the piece it is reported in."), React.createElement("ol", {
    className: "wf-falls"
  }, WF_FALLS.map(([name, height, peak, fades, note, ...srcs]) => React.createElement("li", {
    key: name
  }, React.createElement("div", {
    className: "wf-falls__name"
  }, React.createElement("strong", null, name), React.createElement("span", null, height)), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Peak"), React.createElement("dd", null, peak)), React.createElement("div", null, React.createElement("dt", null, "Goes dry"), React.createElement("dd", null, fades))), React.createElement("p", null, note, srcs.map(([href, label]) => React.createElement(React.Fragment, {
    key: href
  }, " ", React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_falls",
    className: "wf-src",
    href: href
  }, label, " →"))))))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("span", null, React.createElement("strong", null, "Horsetail Fall has its own page."), " A modest seasonal ribbon on El Capitan, it matters for two weeks in February: ", React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_falls",
    href: "/firefall"
  }, "the firefall"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wf-months",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "MONTH BY MONTH",
    title: "What is running, by month"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "From the waterfalls guide's table. \"Peak\" means at or near maximum; \"thin\" means running but unimpressive; \"dry\" means nothing but a stain on the rock. This month's column is marked."), React.createElement(WfMonthGrid, null), React.createElement("ul", {
    className: "ff-rules wf-rules"
  }, WF_RULES.map(([icon, head, text]) => React.createElement("li", {
    key: head
  }, React.createElement(EventIcon, {
    name: icon,
    size: 26
  }), React.createElement("strong", null, head), React.createElement("p", null, text))))), React.createElement("section", {
    className: "ff-band",
    id: "wf-record",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "FROM YOSEMITE NATURE NOTES",
    title: "What the park's naturalists recorded"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The National Park Service's own bulletin watched the falls for decades. Each entry links the issue it is quoted from, in ", React.createElement("a", {
    href: "/archive/"
  }, "the Nature Notes archive"), "."), React.createElement("ol", {
    className: "ff-history"
  }, WF_ARCHIVE.map(([year, title, text, href, issue]) => React.createElement("li", {
    key: year
  }, React.createElement("span", null, year), React.createElement("strong", null, title), React.createElement("p", null, text, " ", React.createElement("a", {
    className: "wf-src",
    href: href
  }, issue, " →"))))))), React.createElement("section", {
    className: "hp-wrap hp-section wf-reads"
  }, React.createElement("h3", null, "Read next"), React.createElement("ul", null, WF_READS.map(([href, label, note]) => React.createElement("li", {
    key: href
  }, React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_reads",
    href: href
  }, React.createElement("strong", null, label), React.createElement("span", null, note)))))), React.createElement("section", {
    className: "ff-band",
    id: "wf-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Waterfall questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "Every live feed the site reads, the webcams and the entrance waits, is on ", React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_faq",
    href: "/conditions"
  }, "the conditions board"), ". The park's own current word on the week is on ", React.createElement(HomeLink, {
    go: go,
    location: "waterfalls_faq",
    href: "/now"
  }, "the Park Bulletin"), ".")), React.createElement("div", {
    className: "ff-faq"
  }, WF_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "waterfalls",
    title: "Making a spring trip of it?",
    intro: "The Field Guide app carries the Valley's spring stops, the waterfall walks with parking notes, and offline maps for a park with no signal.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Spring, watched from inside the park",
    heading: "Spring, watched from inside the park",
    blurb: "Sunday Field Notes follows the water each spring: how high the falls are running, and what the park's naturalists saw in the same weeks a century ago.",
    location: "waterfalls",
    tag: "waterfalls"
  }));
}
window.WaterfallsRunningPage = WaterfallsRunningPage;
