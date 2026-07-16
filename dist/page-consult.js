var CONSULT_PAYMENT_LINK_URL = "";
var CONSULT_BOOKING_URL = "";
var CONSULT_PRICE = "$95";
var CONSULT_SLOTS_PER_MONTH = 6;
var CONSULT_MAILTO = "mailto:cory@thetalusfieldjournal.com?subject=Field%20consult";
function ConsultPage({
  go
}) {
  var live = Boolean(CONSULT_PAYMENT_LINK_URL && CONSULT_BOOKING_URL);
  var trackClick = which => {
    if (window.track) window.track("consult_book_click", {
      location: which,
      live
    });
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
      label: "Field consult"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "One on one · ", CONSULT_SLOTS_PER_MONTH, " a month"), React.createElement("h1", null, "Thirty minutes on your Yosemite plan."), React.createElement("p", {
    className: "page-head__dek"
  }, "A call with a naturalist who lives in the park: your dates, your group, your plan, taken apart and put back together by someone who has spent twenty seasons watching plans meet the actual park. ", CONSULT_PRICE, ", thirty minutes, ", CONSULT_SLOTS_PER_MONTH, " slots a month. When they are gone, they are gone."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "What it is"), React.createElement("p", null, "You bring dates, a rough plan or none at all, and the constraints that matter: kids, knees, a dog, a flight out of Fresno, a hard reservation you could not get. You leave with a plan that fits the park as it will actually be that week: which entrance, which mornings for which trails, where the lot fills first, what to book now and what to leave loose, and the one or two things worth dropping. If the week of your trip brings smoke, a road closure, or a heat spike, the advice accounts for how the park behaves under it."), React.createElement("p", null, "Prefer it in writing? The same session works asynchronously: send the details by email after booking, and a written plan comes back instead of a call, with a shareable map link for the drive."), React.createElement("h2", null, "What it is not"), React.createElement("p", null, "Not a booking service, not a guided tour, and not a way around the park's permit systems. Lotteries stay lotteries. What a consult does is make sure everything outside the lottery is working in your favor."), React.createElement("h2", null, "How it works"), React.createElement("ol", null, React.createElement("li", null, "Pay for the slot. ", CONSULT_PRICE, ", thirty minutes."), React.createElement("li", null, "Pick a time on the calendar, or reply to the receipt with \"written plan\" and your details."), React.createElement("li", null, "Talk, or read. Either way you end up with the plan in writing."))), React.createElement("div", {
    style: {
      marginTop: 32,
      border: "1px solid var(--ink)",
      background: "var(--paper-2)",
      padding: 28
    }
  }, live ? React.createElement(React.Fragment, null, React.createElement("a", {
    className: "btn",
    href: CONSULT_PAYMENT_LINK_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: () => trackClick("consult_pay"),
    style: {
      display: "inline-block",
      marginRight: 12
    }
  }, "Book a consult → ", CONSULT_PRICE), React.createElement("a", {
    href: CONSULT_BOOKING_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: () => trackClick("consult_schedule"),
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-2)"
    }
  }, "Already paid? Pick your time →")) : React.createElement(React.Fragment, null, React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 15,
      color: "var(--ink)",
      lineHeight: 1.55,
      margin: "0 0 14px"
    }
  }, "Booking opens shortly. Until the calendar is live, email works: say your dates and what you are trying to figure out, and you will get a reply about this month's slots."), React.createElement("a", {
    className: "btn",
    href: CONSULT_MAILTO,
    onClick: () => trackClick("consult_mailto"),
    style: {
      display: "inline-block"
    }
  }, "Email about a consult →")), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: "14px 0 0"
    }
  }, "If the month is sold out, the button says so. No waitlist for consults; the newsletter announces when slots reopen.")), React.createElement(NewsletterInline, {
    location: "consult",
    tag: "consult",
    heading: "Not ready to book?",
    blurb: "Sunday Field Notes answers most planning questions eventually, one short letter a week, written from inside the park. Free."
  })));
}
window.ConsultPage = ConsultPage;
