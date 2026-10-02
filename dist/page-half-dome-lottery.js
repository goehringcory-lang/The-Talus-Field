var LOTTERY_SEASONS = [{
  season: "2024",
  preseasonApps: "35,289",
  preseasonRate: "22%",
  dailyApps: "35,561",
  dailyRate: "19%",
  dailyWeekday: "22%",
  dailyWeekend: "14%"
}];
function LotteryOdds({
  season
}) {
  var draws = [{
    label: "Preseason lottery",
    rate: season.preseasonRate
  }, {
    label: "Daily lottery, weekday",
    rate: season.dailyWeekday
  }, {
    label: "Daily lottery, weekend",
    rate: season.dailyWeekend
  }];
  return React.createElement("figure", {
    className: "hd-odds",
    "aria-hidden": "true"
  }, React.createElement("p", {
    className: "hp-eyebrow fj-chart-title"
  }, "The published odds, ", season.season, " season"), React.createElement("div", {
    className: "hd-odds__grids"
  }, draws.map(d => {
    var n = parseInt(d.rate, 10) || 0;
    return React.createElement("div", {
      key: d.label,
      className: "hd-odds__draw"
    }, React.createElement("div", {
      className: "hd-odds__dots"
    }, Array.from({
      length: 100
    }, (_, i) => React.createElement("i", {
      key: i,
      className: i < n ? "is-won" : undefined
    }))), React.createElement("strong", null, d.rate), React.createElement("span", null, d.label));
  })), React.createElement("figcaption", null, "Of every hundred applications in the ", season.season, " season, the filled dots drew a permit. National Park Service figures."));
}
function HdCap() {
  return React.createElement("figure", {
    className: "hd-cap"
  }, React.createElement("p", {
    className: "hp-eyebrow fj-chart-title"
  }, "Through the subdome checkpoint, each day the cables are up"), React.createElement("div", {
    className: "hd-cap__bar",
    role: "img",
    "aria-label": "A maximum of 300 hikers a day: roughly 225 day hikers through the two lotteries and 75 backpackers through the wilderness permit system."
  }, React.createElement("span", {
    className: "hd-cap__day",
    style: {
      flexBasis: "75%"
    }
  }, React.createElement("b", null, "~225"), " day hikers", React.createElement("small", null, "The two lotteries on this page")), React.createElement("span", {
    className: "hd-cap__wild",
    style: {
      flexBasis: "25%"
    }
  }, React.createElement("b", null, "75"), " backpackers", React.createElement("small", null, "Wilderness permits"))), React.createElement("p", {
    className: "ff-note"
  }, "300 a day in all. An overnight that includes Half Dome wants a wilderness permit with the Half Dome add-on, not a lottery permit."));
}
var HD_MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
function HdSeason() {
  var W = 1000,
    L = 20,
    R = 20,
    col = (W - L - R) / 8;
  var x = m => L + m * col;
  var rows = [{
    y: 70,
    from: 0,
    to: 1,
    cls: "hd-season__bar--apply",
    label: "Preseason applications: all of March, Eastern time"
  }, {
    y: 118,
    from: 1.4,
    to: 1.62,
    cls: "hd-season__bar--result",
    label: "Results by email, mid-April"
  }, {
    y: 166,
    from: 2.78,
    to: 7.45,
    cls: "hd-season__bar--cables",
    label: "Cables up: Friday before Memorial Day to the day after the second Monday in October"
  }, {
    y: 214,
    from: 2.78,
    to: 7.45,
    cls: "hd-season__bar--daily",
    label: "Daily lottery: every day the cables are up"
  }, {
    y: 262,
    from: 5.7,
    to: 7.45,
    cls: "hd-season__bar--best",
    label: "Best odds of the year: late-season weekdays"
  }];
  return React.createElement("svg", {
    className: "hd-season__svg",
    viewBox: `0 0 ${W} 300`,
    role: "img",
    "aria-label": "The Half Dome permit season, March to October. Preseason lottery applications run through all of March, Eastern time. Results arrive by email in mid-April. The cables typically go up the Friday before Memorial Day and come down the day after the second Monday in October. The daily lottery runs every day the cables are up. The best odds of the year are weekdays from late August through the October takedown."
  }, HD_MONTHS.map((m, i) => React.createElement("g", {
    key: m
  }, React.createElement("line", {
    x1: x(i),
    x2: x(i),
    y1: 30,
    y2: 286,
    className: "hd-season__grid"
  }), React.createElement("text", {
    x: x(i) + col / 2,
    y: 20,
    textAnchor: "middle",
    className: "hd-season__month"
  }, m))), React.createElement("line", {
    x1: x(8),
    x2: x(8),
    y1: 30,
    y2: 286,
    className: "hd-season__grid"
  }), rows.map(r => React.createElement("g", {
    key: r.label
  }, React.createElement("rect", {
    x: x(r.from),
    y: r.y - 22,
    width: x(r.to) - x(r.from),
    height: 16,
    rx: "3",
    className: "hd-season__bar " + r.cls
  }), React.createElement("text", {
    x: r.from > 4 ? x(r.to) : x(r.from),
    y: r.y + 12,
    textAnchor: r.from > 4 ? "end" : "start",
    className: "hd-season__label"
  }, r.label))));
}
function HdTries({
  rate
}) {
  var p = (parseInt(rate, 10) || 0) / 100;
  var tries = [1, 2, 3, 4, 5].map(n => ({
    n,
    v: 1 - Math.pow(1 - p, n)
  }));
  return React.createElement("figure", {
    className: "hd-tries"
  }, React.createElement("p", {
    className: "hp-eyebrow fj-chart-title"
  }, "Chance of at least one win, daily lottery, weekday entries at ", rate), React.createElement("ol", {
    className: "hd-tries__bars",
    "aria-label": tries.map(t => `${t.n} ${t.n === 1 ? "entry" : "entries"}: about ${Math.round(t.v * 100)}%`).join("; ")
  }, tries.map(t => React.createElement("li", {
    key: t.n
  }, React.createElement("span", {
    className: "hd-tries__track"
  }, React.createElement("span", {
    className: "hd-tries__fill",
    style: {
      height: `${Math.round(t.v * 100)}%`
    }
  })), React.createElement("b", null, Math.round(t.v * 100), "%"), React.createElement("small", null, t.n, " ", t.n === 1 ? "entry" : "entries")))), React.createElement("figcaption", {
    className: "ff-note"
  }, "Each draw is independent, so the chances compound: at the published ", rate, ", five weekday entries come to about ", Math.round(tries[4].v * 100), "%, a little better than the two in three that the one-in-five rule of thumb gives. Worked from the National Park Service's published weekday rate; an individual season can run better or worse."));
}
function HalfDomeLotteryPage({
  go
}) {
  var season = LOTTERY_SEASONS[0];
  var toc = [["#hd-season", "The season"], ["#hd-lotteries", "Two lotteries"], ["#hd-application", "The application"], ["#hd-odds", "The odds"], ["#hd-strategy", "What works"], ["#hd-win", "If you win"], ["#hd-lose", "If you do not"], ["#hd-fine-print", "Fine print"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-half-dome-lottery"
  }, React.createElement("div", {
    className: "ff-cover hd-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-alpenglow-madhu-shesharam.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Half Dome glowing in alpenglow above Tenaya Canyon",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Half Dome lottery"
    }],
    eyebrow: "PERMIT SEASON · APPLICATIONS OPEN IN MARCH",
    title: "The Half Dome lottery",
    intro: "There are two Half Dome lotteries, not one. The first is in March. The second runs every day the cables are up, so losing in March does not end your year. This page has the calendar, the published odds, the strategy for each lottery, and what to do when the answer is no.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "half_dome_head",
      className: "hp-button",
      href: "#hd-lotteries"
    }, "The two lotteries ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "half_dome_head",
      className: "hp-link",
      href: "#hd-odds"
    }, "The published odds ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Madhu Shesharam / Unsplash")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "dome"
  }), React.createElement("dt", null, "Cables"), React.createElement("dd", null, "Last 400 vertical feet")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("dt", null, "Daily cap"), React.createElement("dd", null, "300 hikers")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Lotteries"), React.createElement("dd", null, "Two: March, and daily")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "Round trip"), React.createElement("dd", null, "14 to 16 miles"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "half_dome_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section hd-short",
    "aria-labelledby": "hd-short-h"
  }, React.createElement(HpHeading, {
    eyebrow: "THE SHORT VERSION",
    title: "Four things to know before you apply",
    id: "hd-short-h"
  }), React.createElement("ul", {
    className: "ff-rules hd-short__list"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "ticket",
    size: 26
  }), React.createElement("strong", null, "Two lotteries"), React.createElement("p", null, "One in March, and one every day the cables are up. Enter both.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "300 hikers a day"), React.createElement("p", null, "About 225 are day hikers drawn by lottery. The other 75 are backpackers.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 26
  }), React.createElement("strong", null, "Weekdays win"), React.createElement("p", null, "Saturday is the hardest day. Late-season weekdays, from late August to October, have the best odds.")), React.createElement("li", {
    className: "is-warn"
  }, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No permit, no summit"), React.createElement("p", null, "Rangers check permits at the base of the subdome. Without one you turn around.")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hd-season",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SEASON"), React.createElement("h2", null, "A permit for the last 400 feet"), React.createElement("p", {
    className: "ff-lede"
  }, "Half Dome has steel cables bolted into the granite for the last 400 vertical feet of the climb. They typically go up the Friday before Memorial Day and come down the day after the second Monday in October, shifting with snow on the route, crew availability and weather. While they are up, a permit is required past the base of the subdome, not just on the cables themselves."), React.createElement("p", {
    className: "ff-lede"
  }, "The checkpoint sits at the base of the subdome steps, staffed by rangers who check the permit, a government-issued photo ID and the confirmation email. Everyone in the group has to be there together."), React.createElement(NatureNotesFilm, {
    id: "half-dome",
    title: "Half Dome",
    youtubeId: "ihNpkUp5JdM",
    episode: 4,
    location: "half_dome_film",
    note: "The rock, the cables and the climb, from the Park Service's own film series: what the permit is for, before you spend March trying to get one."
  })), React.createElement("div", {
    className: "hd-side"
  }, React.createElement(HdCap, null), React.createElement("aside", {
    className: "ff-short hd-law",
    "aria-label": "No permit, no summit"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "no"
  }), " No permit means you turn around"), React.createElement("p", null, "This is federal law rather than a suggestion: ascending the subdome or the cables without one violates 36 CFR 1.6 and carries a fine of up to $5,000 and up to six months in jail. Rangers check every group. The lotteries stay lotteries."))))), React.createElement("section", {
    className: "ff-band",
    id: "hd-lotteries",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "TWO LOTTERIES, NOT ONE",
    title: "March is the first chance, not the only one"
  }), React.createElement("div", {
    className: "hd-pair"
  }, React.createElement("article", {
    className: "hd-lottery"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement(EventIcon, {
    name: "calendar",
    size: 18
  }), " THE PRESEASON LOTTERY"), React.createElement("h3", null, "Apply in March"), React.createElement("p", null, "Applications on Recreation.gov through the month of March (Eastern time), results emailed in mid-April. Up to six people and seven ranked date choices per application, one application per person, and an alternate trip leader you can only name during the window."), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Window"), React.createElement("dd", null, "All of March, Eastern time")), React.createElement("div", null, React.createElement("dt", null, "Results"), React.createElement("dd", null, "By email, mid-April")), React.createElement("div", null, React.createElement("dt", null, "Group"), React.createElement("dd", null, "Up to six")), React.createElement("div", null, React.createElement("dt", null, "Dates"), React.createElement("dd", null, "Up to seven, ranked")), React.createElement("div", null, React.createElement("dt", null, "Alternate"), React.createElement("dd", null, "Named only during the window")))), React.createElement("article", {
    className: "hd-lottery hd-lottery--daily"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 18
  }), " THE DAILY LOTTERY"), React.createElement("h3", null, "Apply two days out, all season"), React.createElement("p", null, "The one almost nobody talks about, running every day the cables are up. Apply on Recreation.gov two days before your hike date, between midnight and 4 p.m. Pacific; results arrive late that evening. It distributes the permits preseason winners cancel or fail to use, and in the most recent season the park has published it drew more applications than the preseason lottery itself."), React.createElement("ol", {
    className: "hd-clock"
  }, React.createElement("li", null, React.createElement("span", null, "Two days before"), React.createElement("strong", null, "Apply, midnight to 4 p.m. Pacific")), React.createElement("li", null, React.createElement("span", null, "That evening"), React.createElement("strong", null, "Results arrive, late")), React.createElement("li", null, React.createElement("span", null, "Hike day"), React.createElement("strong", null, "The permit is good midnight to 11:59 p.m."))))), React.createElement("figure", {
    className: "hd-season"
  }, React.createElement(HdSeason, null), React.createElement("figcaption", {
    className: "ff-note"
  }, "The season as the rules describe it, not a given year's dates. The park posts each season's dates on its permit page.")), React.createElement("p", {
    className: "ff-lede hd-fees"
  }, "Both charge a non-refundable application fee per application, not per person, plus a per-person recreation fee if you win. Current amounts are on the NPS permit page linked below; in the 2024 season both were $10, so a group of four that applied and won paid $50 in total."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hd-application",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHAT THE PRESEASON APPLICATION ASKS FOR",
    title: "Four fields, and each one can sink you"
  }), React.createElement("ul", {
    className: "ff-rules hd-fields"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Group size"), React.createElement("p", null, "Up to six people on one application. Everyone hikes together, and the permit holder or the alternate has to be at the checkpoint with the whole group.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 26
  }), React.createElement("strong", null, "Date choices"), React.createElement("p", null, "Up to seven dates or date ranges, ranked. The system tries your highest-preference date first and works down the list, so the order matters.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "id",
    size: 26
  }), React.createElement("strong", null, "Permit holder and alternate"), React.createElement("p", null, "Name both. One of the two must be physically present with a photo ID matching the permit. An alternate can only be added during the application window, and they have to hold a Recreation.gov account and accept the role within 72 hours of being added. Miss that and they are not on the permit. Once the window closes, neither name can be changed.")), React.createElement("li", {
    className: "is-warn"
  }, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "One application per person"), React.createElement("p", null, "Each person can appear as holder or alternate on exactly one preseason application. Show up on two and all of them are cancelled without a refund.")))), React.createElement("section", {
    className: "ff-band",
    id: "hd-odds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE PUBLISHED ODDS",
    title: "Read the application rate, not the date-choice rate"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "These are the National Park Service's own figures for the seasons it has published. Read the application rate, not the date-choice rate, as your odds of hiking: most applications list several dates and only one of them can be filled."), React.createElement(LotteryOdds, {
    season: season
  }), React.createElement("div", {
    className: "prose hd-table fj-tablewrap",
    role: "region",
    "aria-label": "Published lottery statistics",
    tabIndex: 0
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Season"), React.createElement("th", null, "Preseason applications"), React.createElement("th", null, "Preseason success"), React.createElement("th", null, "Daily applications"), React.createElement("th", null, "Daily success"), React.createElement("th", null, "Daily, weekday"), React.createElement("th", null, "Daily, weekend"))), React.createElement("tbody", null, LOTTERY_SEASONS.map(s => React.createElement("tr", {
    key: s.season
  }, React.createElement("td", null, React.createElement("strong", null, s.season)), React.createElement("td", null, s.preseasonApps), React.createElement("td", null, s.preseasonRate), React.createElement("td", null, s.dailyApps), React.createElement("td", null, s.dailyRate), React.createElement("td", null, s.dailyWeekday), React.createElement("td", null, s.dailyWeekend)))))), React.createElement("div", {
    className: "ff-split hd-spread"
  }, React.createElement("p", {
    className: "ff-lede"
  }, "The spread inside those averages is where the strategy lives. Saturday is the most requested day of the week, drawing about 21% of all preseason applications in 2024. Weekday odds in the daily lottery ran roughly half again better than weekend odds that season, 22% against 14%, and late-season weekdays, late August through the October takedown, are the best draw of the year."), React.createElement("p", {
    className: "ff-lede"
  }, "Counted by individual date choice rather than by application, the preseason numbers look far worse, about 1.0% for a weekday choice and 0.8% for a weekend one, which is the same fact stated a different way.")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hd-strategy",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT ACTUALLY WORKS"), React.createElement("h2", null, "Seven dates, two lotteries, no Saturdays"), React.createElement(HdTries, {
    rate: season.dailyWeekday
  })), React.createElement("ol", {
    className: "hd-steps"
  }, React.createElement("li", null, React.createElement("strong", null, "Use all seven date choices"), React.createElement("p", null, "In the preseason application, front-load the unpopular ones: a Tuesday in September as your first choice beats a Saturday in July. One fixed date means you get the published odds and nothing better; seven spread across the season is seven rolls inside one application.")), React.createElement("li", null, React.createElement("strong", null, "Enter both lotteries"), React.createElement("p", null, "Plan the trip so the hike falls mid-visit rather than on day one, then run the daily lottery every eligible day. Each draw is independent, so five weekday attempts at roughly one-in-five odds work out to about a two in three chance of winning at least once.")), React.createElement("li", null, React.createElement("strong", null, "Avoid Saturday"), React.createElement("p", null, "Sunday is second worst. Monday through Thursday draw the fewest preseason applications, 12 to 13% each in 2024, and weekdays draw better odds in the daily lottery.")), React.createElement("li", null, React.createElement("strong", null, "Split groups larger than six"), React.createElement("p", null, "Across two applications with two different permit holders; they are entered independently. Name an alternate on every preseason application, and have them accept the role before the window closes, or a sick permit holder on hike day ends the trip for everyone.")), React.createElement("li", null, React.createElement("strong", null, "Have the no-permit plan ready"), React.createElement("p", null, "A wilderness permit through Little Yosemite Valley can carry a Half Dome add-on from a separate allocation, and Clouds Rest, higher than Half Dome with a bigger view and no permit at all, is the better hike for most people anyway."))))), React.createElement("section", {
    className: "ff-band",
    id: "hd-win",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IF YOU WIN"), React.createElement("h2", null, "The day is 10 to 12 hours. Start before dawn."), React.createElement("p", {
    className: "ff-lede"
  }, "The hike is 14 to 16 miles round trip with 4,800 feet of gain and takes most people 10 to 12 hours, so a 5 a.m. start, earlier if you can, is what gets you up and down before afternoon thunderstorms."), React.createElement("p", {
    className: "ff-lede"
  }, "Watch the forecast obsessively in the days before. Nearly every fatal fall from the cables has happened on wet rock. If rain is coming, cancel: the per-person recreation fee is fully refundable until 11:59 p.m. Pacific the day before your date, and refundable outright if the cables are not up."), React.createElement(FjPull, {
    cite: "If you win"
  }, "Sunk cost is a bad reason to be on wet granite at 45 degrees.")), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "Before you leave the Valley"), React.createElement("p", null, "Download or print the confirmation email. Cell service is unreliable at the subdome checkpoint, and the permit is valid for a single day, midnight to 11:59 p.m., with no multi-day option for day hikers. Bring the photo ID that matches the name on it.")), React.createElement("li", null, React.createElement("span", null, "5 a.m., or earlier"), React.createElement("p", null, "Start at Happy Isles.")), React.createElement("li", null, React.createElement("span", null, "The subdome steps"), React.createElement("p", null, "Rangers check the permit, the photo ID and the confirmation, with the whole group there together.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "3:30 p.m."), React.createElement("p", null, "Set a turnaround time and keep it: not on the summit by 3:30 p.m. means turn around, whatever the day has cost you.")), React.createElement("li", null, React.createElement("span", null, "The way down"), React.createElement("p", null, "You do not want to be on the cables in a lightning storm, or coming down ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_win",
    href: "/articles/mist-trail-the-real-guide"
  }, "the Mist Trail"), " in the dark without a headlamp."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hd-lose",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "IF YOU DO NOT WIN",
    title: "The year is not over"
  }), React.createElement("ul", {
    className: "ff-rules hd-lose"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "ticket",
    size: 26
  }), React.createElement("strong", null, "Run the daily lottery every day of the trip"), React.createElement("p", null, "Each application is an independent chance, and five eligible weekday mornings is a good position to be in.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Do not go anyway"), React.createElement("p", null, "Rangers are at the checkpoint, they check every group, and the citation follows you home.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "bed",
    size: 26
  }), React.createElement("strong", null, "Consider the backpacker route"), React.createElement("p", null, "A wilderness permit for a trip through Little Yosemite Valley can carry a Half Dome add-on from an allocation the day-hiker lottery does not touch. It means an overnight, a bear canister and wilderness gear, but it is a legitimate path to the cables. Apply through ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_lose",
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "the wilderness permit system"), ", not this lottery.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "mountain",
    size: 26
  }), React.createElement("strong", null, "Hike Clouds Rest instead"), React.createElement("p", null, "The summit is 9,926 feet, more than a thousand feet higher than Half Dome, with no permit required and bigger views in every direction. On a Tuesday in June you might have it to yourself.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 26
  }), React.createElement("strong", null, "Come back late season, midweek"), React.createElement("p", null, "The best daily lottery odds of the year are weekdays in September and early October: the cables are still up and the crowds have thinned.")))), React.createElement("section", {
    className: "ff-band",
    id: "hd-fine-print",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FEES, CANCELLATION AND THE FINE PRINT"), React.createElement("h2", null, "What is refundable, and what is not"), React.createElement("p", {
    className: "ff-lede"
  }, "The application fee is non-refundable in every case; it is the cost of entering. The per-person recreation fee is refundable if you cancel by 11:59 p.m. Pacific the day before your hike date, or if the cables are not up on your date, which happens with early-season snow and late-season weather. Cancel or reduce group size through the Recreation.gov account or by phone."), React.createElement("p", {
    className: "ff-lede"
  }, "In the daily lottery there is no alternate, only a permit holder, and a win charges the card on file automatically. A declined card forfeits the permit. Permits cannot be resold or auctioned, and any attempt to resell one voids it. A day-hiker permit includes no camping anywhere along the route.")), React.createElement("div", {
    className: "hd-side"
  }, React.createElement("aside", {
    className: "ff-closing hd-rules"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CURRENT YEAR'S RULES"), React.createElement("p", null, "Dates, fees, and any rule changes for the current season: ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the NPS Half Dome permits page"), " and ", React.createElement("a", {
    href: "https://www.recreation.gov/permits/234652",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the Recreation.gov lottery page"), ". The wilderness office answers permit questions at 209-372-0826, weekday mornings and afternoons in season. The week's park-wide picture is on ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_rules",
    href: "/now"
  }, "the Park Bulletin"), "."), React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permits, NPS ↗")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/permits/234652",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permits, Recreation.gov ↗")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermitsapps.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permit Lottery Statistics, NPS ↗")))), React.createElement("aside", {
    className: "ff-closing hd-stay",
    "aria-label": "Lodging availability"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE NIGHT BEFORE, AND THE NIGHT AFTER"), React.createElement("p", null, "The hike wants a pre-dawn start and gives back a fourteen-to-sixteen-hour day. Driving in from Oakhurst at 3 a.m. and back out at 10 p.m. is how a permit gets wasted. A bed in the Valley or in El Portal is the difference, and the permit date is known far enough ahead to book one."), React.createElement(AvailabilityLink, {
    destination: "Yosemite National Park",
    list: "page_half_dome",
    slug: "half-dome-lottery",
    className: "ff-book"
  }, "Search lodging near the trailhead ↗"), React.createElement("p", {
    className: "ff-note"
  }, "Availability search on Expedia; we may earn a commission, and the advice is the same either way. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure."), " Every option compared: ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_stay",
    href: "/stay"
  }, "where to stay"), "."))))), React.createElement("section", {
    className: "hp-wrap hp-section hd-related"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RELATED READING"), React.createElement("p", {
    className: "ff-lede"
  }, "Before you decide the cables are the goal at all, read ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_related",
    href: "/articles/so-you-want-to-hike-half-dome"
  }, "So You Want to Hike Half Dome"), ", which includes the case for Clouds Rest. The approach is ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_related",
    href: "/articles/mist-trail-the-real-guide"
  }, "the Mist Trail"), ", and every other permit the park runs is in ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_related",
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "the wilderness permits guide"), ". If you arrived without any permit at all, there is ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_related",
    href: "/articles/yosemite-walk-up-and-day-of-permits"
  }, "a guide to walk-up and day-of permits"), ". Gear lives in ", React.createElement(HomeLink, {
    go: go,
    location: "half_dome_related",
    href: "/kit"
  }, "the day pack list"), ": the short version is a gallon of water, grippy gloves you pack back out, a headlamp, and a hard turnaround time.")), React.createElement(HpGuideBand, {
    go: go,
    location: "half-dome-lottery",
    title: "Planning the trip around a permit day?",
    intro: "The Field Guide app carries the trailhead parking notes, offline maps for a park with no signal, and a day-by-day planner that flexes when the lottery says Tuesday instead of Saturday.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "The permit calendar, in your inbox",
    heading: "The permit calendar, in your inbox",
    blurb: "Sunday Field Notes flags the lottery calendar as it comes: when the March window opens, when results land, and when the late-season odds turn favorable.",
    location: "half-dome-lottery",
    tag: "half-dome-lottery"
  }));
}
window.HalfDomeLotteryPage = HalfDomeLotteryPage;
