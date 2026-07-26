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
  }, "Most people think there is one Half Dome lottery, that it happens in March, and that losing it ends the year. All three are wrong. There are two lotteries, the second one runs every day the cables are up, and the strategy for each is different. This page is the honest version: the calendar, the odds, and how to actually get on the cables."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "The season"), React.createElement("p", null, "The cables typically go up the Friday before Memorial Day and come down the day after the second Monday in October, shifting with snow and weather. While they are up, a permit is required past the base of the subdome, checked by rangers against photo ID, and a maximum of 300 hikers a day go through: roughly 225 day hikers via the lotteries below, 75 backpackers via the separate wilderness permit system."), React.createElement("h2", null, "Two lotteries, not one"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "The preseason lottery."), " Applications on Recreation.gov for the month of March, results emailed in mid-April. Up to six people and seven ranked date choices per application, one application per person, and an alternate trip leader you can only name during the window."), React.createElement("li", null, React.createElement("strong", null, "The daily lottery."), " The one almost nobody talks about, running every day the cables are up. Apply on Recreation.gov two days before your hike date, between midnight and 4 p.m. Pacific; results arrive late that evening. It distributes the permits the preseason winners cancel or fail to use, and in the most recent season the park has published, it drew more applications than the preseason lottery itself.")), React.createElement("p", null, "Both charge a small non-refundable application fee, plus a per-person fee if you win, refundable until the day before your hike. Current amounts are on the NPS permit page linked below."), React.createElement("h2", null, "The odds, honestly"), React.createElement("p", null, "In the most recent season with published numbers, about one preseason application in five succeeded, and the daily lottery ran close behind. The spread inside those averages is the strategy: Saturday is the most requested day of the week, weekday odds in the daily lottery ran roughly a half again better than weekend odds, and late-season weekdays, late August through the October takedown, are the best draw of the year."), React.createElement("h2", null, "What actually works"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Use all seven date choices"), " in the preseason application, and front-load the unpopular ones: a Tuesday in September as your first choice beats a Saturday in July."), React.createElement("li", null, React.createElement("strong", null, "Enter both lotteries."), " Plan the trip so the hike falls mid-visit, then run the daily lottery every eligible day. Each draw is independent; over several weekdays the cumulative odds get genuinely good."), React.createElement("li", null, React.createElement("strong", null, "Split groups larger than six"), " across two applications with two permit holders. Name an alternate on every preseason application, and have them accept the role before the window closes."), React.createElement("li", null, React.createElement("strong", null, "Have the no-permit plan ready."), " A wilderness permit through Little Yosemite Valley can carry a Half Dome add-on from a separate allocation, and Clouds Rest, higher than Half Dome with a bigger view and no permit at all, is the better hike for most people anyway.")), React.createElement("p", null, "One rule with no workaround: no permit means you turn around at the subdome. Rangers check every group, and the fine runs to thousands of dollars. The lotteries stay lotteries.")), React.createElement("div", {
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
  }, "the Recreation.gov lottery page"), ". The week's park-wide picture is on", " ", React.createElement("a", {
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
  }, React.createElement("h2", null, "The deep versions"), React.createElement("p", null, "The full mechanics, every application field, the published statistics, and the fine print that voids permits, are in", " ", React.createElement("a", {
    href: "/articles/half-dome-permit-lottery-2026",
    onClick: e => goArticle(e, "half-dome-permit-lottery-2026")
  }, React.createElement("strong", null, "the complete lottery guide →")), " ", "And before you decide the cables are the goal at all, read", " ", React.createElement("a", {
    href: "/articles/so-you-want-to-hike-half-dome",
    onClick: e => goArticle(e, "so-you-want-to-hike-half-dome")
  }, "So You Want to Hike Half Dome"), ", which includes the case for Clouds Rest. Gear lives in", " ", React.createElement("a", {
    href: "/kit",
    onClick: e => {
      e.preventDefault();
      go("kit");
    }
  }, "the day pack list"), ": the short version is a gallon of water, grippy gloves you pack back out, a headlamp, and a hard turnaround time.")), React.createElement(GuidePromo, {
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
