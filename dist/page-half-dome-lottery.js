var LOTTERY_SEASONS = [{
  season: "2024",
  preseasonApps: "35,289",
  preseasonRate: "22%",
  dailyApps: "35,561",
  dailyRate: "19%",
  dailyWeekday: "22%",
  dailyWeekend: "14%"
}];
function HalfDomeLotteryPage({
  go
}) {
  var goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Half Dome lottery"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Permit season · applications open in March"), React.createElement("h1", null, "The Half Dome lottery"), React.createElement("p", {
    className: "page-head__dek"
  }, "Most people think there is one Half Dome lottery, that it happens in March, and that losing it ends the year. All three are wrong. There are two lotteries, the second one runs every day the cables are up, and the strategy for each is different. This page is the honest version: the calendar, the published odds, the strategy, and what to do when the answer is no."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "The season"), React.createElement("p", null, "Half Dome has steel cables bolted into the granite for the last 400 vertical feet of the climb. They typically go up the Friday before Memorial Day and come down the day after the second Monday in October, shifting with snow on the route, crew availability and weather. While they are up, a permit is required past the base of the subdome, not just on the cables themselves."), React.createElement("p", null, "The checkpoint sits at the base of the subdome steps, staffed by rangers who check the permit, a government-issued photo ID and the confirmation email. Everyone in the group has to be there together. A maximum of 300 hikers a day go through: roughly 225 day hikers via the two lotteries below, and 75 backpackers via the separate wilderness permit system. If your trip is an overnight that includes Half Dome, you want a wilderness permit with the Half Dome add-on, not a day-hiker lottery permit."), React.createElement("p", null, "No permit means you turn around, and this is federal law rather than a suggestion: ascending the subdome or the cables without one violates 36 CFR 1.6 and carries a fine of up to $5,000 and up to six months in jail. Rangers check every group. The lotteries stay lotteries."), React.createElement("h2", null, "Two lotteries, not one"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "The preseason lottery."), " Applications on Recreation.gov through the month of March (Eastern time), results emailed in mid-April. Up to six people and seven ranked date choices per application, one application per person, and an alternate trip leader you can only name during the window."), React.createElement("li", null, React.createElement("strong", null, "The daily lottery."), " The one almost nobody talks about, running every day the cables are up. Apply on Recreation.gov two days before your hike date, between midnight and 4 p.m. Pacific; results arrive late that evening. It distributes the permits preseason winners cancel or fail to use, and in the most recent season the park has published it drew more applications than the preseason lottery itself.")), React.createElement("p", null, "Both charge a non-refundable application fee per application, not per person, plus a per-person recreation fee if you win. Current amounts are on the NPS permit page linked below; in the 2024 season both were $10, so a group of four that applied and won paid $50 in total."), React.createElement("h2", null, "What the preseason application asks for"), React.createElement("p", null, React.createElement("strong", null, "Group size."), " Up to six people on one application. Everyone hikes together, and the permit holder or the alternate has to be at the checkpoint with the whole group."), React.createElement("p", null, React.createElement("strong", null, "Date choices."), " Up to seven dates or date ranges, ranked. The system tries your highest-preference date first and works down the list, so the order genuinely matters."), React.createElement("p", null, React.createElement("strong", null, "Permit holder and alternate."), " Name both. One of the two must be physically present with a photo ID matching the permit. An alternate can only be added during the application window, and they have to hold a Recreation.gov account and accept the role within 72 hours of being added. Miss that and they are not on the permit. Once the window closes, neither name can be changed."), React.createElement("p", null, React.createElement("strong", null, "One application per person."), " Each person can appear as holder or alternate on exactly one preseason application. Show up on two and all of them are cancelled without a refund."), React.createElement("h2", null, "The published odds"), React.createElement("p", null, "These are the National Park Service's own figures for the seasons it has published. Read the application rate, not the date-choice rate, as your odds of hiking: most applications list several dates and only one of them can be filled."), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Season"), React.createElement("th", null, "Preseason applications"), React.createElement("th", null, "Preseason success"), React.createElement("th", null, "Daily applications"), React.createElement("th", null, "Daily success"), React.createElement("th", null, "Daily, weekday"), React.createElement("th", null, "Daily, weekend"))), React.createElement("tbody", null, LOTTERY_SEASONS.map(s => React.createElement("tr", {
    key: s.season
  }, React.createElement("td", null, React.createElement("strong", null, s.season)), React.createElement("td", null, s.preseasonApps), React.createElement("td", null, s.preseasonRate), React.createElement("td", null, s.dailyApps), React.createElement("td", null, s.dailyRate), React.createElement("td", null, s.dailyWeekday), React.createElement("td", null, s.dailyWeekend))))), React.createElement("p", null, "The spread inside those averages is where the strategy lives. Saturday is the most requested day of the week, drawing about 21% of all preseason applications in 2024. Weekday odds in the daily lottery ran roughly half again better than weekend odds that season, 22% against 14%, and late-season weekdays, late August through the October takedown, are the best draw of the year. Counted by individual date choice rather than by application, the preseason numbers look far worse, about 1.0% for a weekday choice and 0.8% for a weekend one, which is the same fact stated a different way."), React.createElement("h2", null, "What actually works"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Use all seven date choices"), " in the preseason application, and front-load the unpopular ones: a Tuesday in September as your first choice beats a Saturday in July. One fixed date means you get the published odds and nothing better; seven spread across the season is seven rolls inside one application."), React.createElement("li", null, React.createElement("strong", null, "Enter both lotteries."), " Plan the trip so the hike falls mid-visit rather than on day one, then run the daily lottery every eligible day. Each draw is independent, so five weekday attempts at roughly one-in-five odds work out to about a two in three chance of winning at least once."), React.createElement("li", null, React.createElement("strong", null, "Avoid Saturday."), " Sunday is second worst. Tuesday through Thursday are the least competitive days in both lotteries."), React.createElement("li", null, React.createElement("strong", null, "Split groups larger than six"), " across two applications with two different permit holders; they are entered independently. Name an alternate on every preseason application, and have them accept the role before the window closes, or a sick permit holder on hike day ends the trip for everyone."), React.createElement("li", null, React.createElement("strong", null, "Have the no-permit plan ready."), " A wilderness permit through Little Yosemite Valley can carry a Half Dome add-on from a separate allocation, and Clouds Rest, higher than Half Dome with a bigger view and no permit at all, is the better hike for most people anyway.")), React.createElement("h2", null, "If you win"), React.createElement("p", null, "Download or print the confirmation email before you leave the Valley. Cell service is unreliable at the subdome checkpoint, around 8,000 feet on the trail, and the permit is valid for a single day, midnight to 11:59 p.m., with no multi-day option for day hikers. Bring the photo ID that matches the name on it."), React.createElement("p", null, "Start at Happy Isles before dawn. The hike is 14 to 16 miles round trip with 4,800 feet of gain and takes most people 10 to 12 hours, so a 5 a.m. start, earlier if you can, is what gets you up and down before afternoon thunderstorms. Set a turnaround time and keep it: not on the summit by 3:30 p.m. means turn around, whatever the day has cost you. You do not want to be on the cables in a lightning storm, or coming down", " ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide",
    onClick: e => goArticle(e, "mist-trail-the-real-guide")
  }, "the Mist Trail"), " ", "in the dark without a headlamp."), React.createElement("p", null, "Watch the forecast obsessively in the days before. Nearly every fatal fall from the cables has happened on wet rock. If rain is coming, cancel: the per-person recreation fee is fully refundable until 11:59 p.m. Pacific the day before your date, and refundable outright if the cables are not up. Sunk cost is a bad reason to be on wet granite at 45 degrees."), React.createElement("h2", null, "If you do not win"), React.createElement("p", null, React.createElement("strong", null, "Run the daily lottery every day of the trip."), " Each application is an independent chance, and five eligible weekday mornings is a genuinely good position to be in."), React.createElement("p", null, React.createElement("strong", null, "Do not go anyway."), " Rangers are at the checkpoint, they check every group, and the citation follows you home."), React.createElement("p", null, React.createElement("strong", null, "Consider the backpacker route."), " A wilderness permit for a trip through Little Yosemite Valley can carry a Half Dome add-on from an allocation the day-hiker lottery does not touch. It means an overnight, a bear canister and wilderness gear, but it is a legitimate path to the cables. Apply through", " ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide",
    onClick: e => goArticle(e, "yosemite-wilderness-permits-guide")
  }, "the wilderness permit system"), ", not this lottery."), React.createElement("p", null, React.createElement("strong", null, "Hike Clouds Rest instead."), " The summit is 9,926 feet, more than a thousand feet higher than Half Dome, with no permit required and bigger views in every direction. On a Tuesday in June you might have it to yourself."), React.createElement("p", null, React.createElement("strong", null, "Come back late season, midweek."), " The best daily lottery odds of the year are weekdays in September and early October: the cables are still up, the crowds have thinned and the fall light is extraordinary."), React.createElement("h2", null, "Fees, cancellation and the fine print"), React.createElement("p", null, "The application fee is non-refundable in every case; it is the cost of entering. The per-person recreation fee is refundable if you cancel by 11:59 p.m. Pacific the day before your hike date, or if the cables are not up on your date, which happens with early-season snow and late-season weather. Cancel or reduce group size through the Recreation.gov account or by phone."), React.createElement("p", null, "In the daily lottery there is no alternate, only a permit holder, and a win charges the card on file automatically. A declined card forfeits the permit. Permits cannot be resold or auctioned, and any attempt to resell one voids it. A day-hiker permit includes no camping anywhere along the route.")), React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The current year's rules"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "Dates, fees, and any rule changes for the current season:", " ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the NPS Half Dome permits page"), " ", "and", " ", React.createElement("a", {
    href: "https://www.recreation.gov/permits/234652",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the Recreation.gov lottery page"), ". The wilderness office answers permit questions at 209-372-0826, weekday mornings and afternoons in season. The week's park-wide picture is on", " ", React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "the Park Bulletin"), ".")), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 48
    }
  }, React.createElement("h2", null, "Related reading"), React.createElement("p", null, "Before you decide the cables are the goal at all, read", " ", React.createElement("a", {
    href: "/articles/so-you-want-to-hike-half-dome",
    onClick: e => goArticle(e, "so-you-want-to-hike-half-dome")
  }, "So You Want to Hike Half Dome"), ", which includes the case for Clouds Rest. The approach is", " ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide",
    onClick: e => goArticle(e, "mist-trail-the-real-guide")
  }, "the Mist Trail"), ", and every other permit the park runs is in", " ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide",
    onClick: e => goArticle(e, "yosemite-wilderness-permits-guide")
  }, "the wilderness permits guide"), ". If you arrived without any permit at all, there is", " ", React.createElement("a", {
    href: "/articles/yosemite-walk-up-and-day-of-permits",
    onClick: e => goArticle(e, "yosemite-walk-up-and-day-of-permits")
  }, "a guide to walk-up and day-of permits"), ". Gear lives in", " ", React.createElement("a", {
    href: "/kit",
    onClick: e => {
      e.preventDefault();
      go("kit");
    }
  }, "the day pack list"), ": the short version is a gallon of water, grippy gloves you pack back out, a headlamp, and a hard turnaround time."), React.createElement("h3", null, "Sources"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permits, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/permits/234652",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permits, Recreation.gov")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermitsapps.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permit Lottery Statistics, NPS")))), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "The night before, and the night after",
    note: "The hike wants a pre-dawn start and gives back a fourteen-to-sixteen-hour day. Driving in from Oakhurst at 3 a.m. and back out at 10 p.m. is how a permit gets wasted. A bed in the Valley or in El Portal is the difference, and the permit date is known far enough ahead to book one.",
    list: "page_half_dome",
    slug: "half-dome-lottery",
    cta: "Search lodging near the trailhead →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "half-dome-lottery",
    title: "Planning the trip around a permit day?",
    body: "The Field Guide app carries the trailhead parking notes, offline maps for a park with no signal, and a day-by-day planner that flexes when the lottery says Tuesday instead of Saturday. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "half-dome-lottery",
    tag: "half-dome-lottery",
    heading: "The permit calendar, in your inbox",
    blurb: "Sunday Field Notes flags the lottery calendar as it comes: when the March window opens, when results land, and when the late-season odds turn favorable. One short letter a week. Free."
  })));
}
window.HalfDomeLotteryPage = HalfDomeLotteryPage;
