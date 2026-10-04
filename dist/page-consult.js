var CONSULT_PAYMENT_LINK_URL = "";
var CONSULT_BOOKING_URL = "";
var CONSULT_PRICE = "$95";
var CONSULT_SLOTS_PER_MONTH = 6;
var CONSULT_INTAKE = ["Travel dates:", "How many in the party (and ages, if kids):", "Where you are staying, or the towns you are weighing:", "The main thing you are trying to figure out:", "Anything that limits the plan (knees, a dog, a flight time, a permit you did or did not get):", "A call or a written plan:"].join("\n\n");
var CONSULT_MAILTO = "mailto:cory@thetalusfieldjournal.com?subject=Field%20consult%20inquiry&body=" + encodeURIComponent(CONSULT_INTAKE + "\n");
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
    className: "page hp-consult"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Field consult"
    }],
    className: "fj-head fj-topo",
    eyebrow: `ONE ON ONE · ${CONSULT_SLOTS_PER_MONTH} A MONTH`,
    title: "Thirty minutes on your Yosemite plan.",
    intro: `A call with a naturalist who lives in the park: your dates, your group, your plan, taken apart and put back together by someone who has spent twenty seasons watching plans meet the actual park. ${CONSULT_PRICE}, thirty minutes, ${CONSULT_SLOTS_PER_MONTH} slots a month.`,
    aside: React.createElement("div", {
      className: "hp-consult__book"
    }, React.createElement("p", {
      className: "hp-eyebrow"
    }, "THE CONSULT / ", CONSULT_PRICE), live ? React.createElement(React.Fragment, null, React.createElement("a", {
      className: "hp-button",
      href: CONSULT_PAYMENT_LINK_URL,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => trackClick("consult_pay")
    }, "Book a consult → ", CONSULT_PRICE), React.createElement("a", {
      href: CONSULT_BOOKING_URL,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => trackClick("consult_schedule"),
      className: "hp-link"
    }, "Already paid? Pick your time →")) : React.createElement(React.Fragment, null, React.createElement("p", {
      className: "hp-consult__soon"
    }, "Consults are booked by email for now, not through a calendar. Send your dates, party, base and main question (the email opens with those prompts filled in), and the reply says whether one of this month's slots fits, and how to pay for it and pick a time. Nothing is charged before that."), React.createElement("a", {
      className: "hp-button",
      href: CONSULT_MAILTO,
      onClick: () => trackClick("consult_mailto")
    }, "Ask about a consult →")), React.createElement("p", {
      className: "hp-terms"
    }, live ? "No waitlist for consults; the newsletter announces when slots reopen." : "Times are agreed by email. No waitlist for consults; the newsletter announces when slots reopen."))
  }), React.createElement("div", {
    className: "hp-wrap fj-band"
  }, React.createElement(FjFacts, {
    label: "The consult at a glance",
    items: [{
      label: "With",
      value: "A naturalist, twenty seasons"
    }, {
      label: "Length",
      value: "Thirty minutes"
    }, {
      label: "Slots",
      value: `${CONSULT_SLOTS_PER_MONTH} a month`
    }, {
      label: "Format",
      value: "A call, or in writing"
    }]
  })), React.createElement(FjLayout, null, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "What it is"), React.createElement("p", null, "You bring dates, a rough plan or none at all, and the constraints that matter: kids, knees, a dog, a flight out of Fresno, a hard reservation you could not get. You leave with a plan that fits the park as it will actually be that week: which entrance, which mornings for which trails, where the lot fills first, what to book now and what to leave loose, and the one or two things worth dropping. If the week of your trip brings smoke, a road closure, or a heat spike, the advice accounts for how the park behaves under it."), React.createElement("p", null, "Prefer it in writing? The same session works asynchronously: send the details by email after booking, and a written plan comes back instead of a call, with a shareable map link for the drive."), React.createElement("h2", null, "What it is not"), React.createElement(FjPull, {
    side: true,
    cite: "What it is not"
  }, "Lotteries stay lotteries."), React.createElement("p", null, "Not a booking service, not a guided tour, and not a way around the park's permit systems. Lotteries stay lotteries. What a consult does is make sure everything outside the lottery is working in your favor."), React.createElement(FjRidge, null), React.createElement("h2", null, "How it works"), React.createElement(FjSteps, {
    steps: live ? [{
      title: `Pay for the slot. ${CONSULT_PRICE}, thirty minutes.`
    }, {
      title: React.createElement(React.Fragment, null, "Pick a time on the calendar, or reply to the receipt with \"written plan\" and your details.")
    }, {
      title: "Talk, or read. Either way you end up with the plan in writing."
    }] : [{
      title: "Email your dates, party, base and main question."
    }, {
      title: `The reply says whether a slot fits this month, and how to pay (${CONSULT_PRICE}) and pick a time, or ask for a written plan instead.`
    }, {
      title: "Talk, or read. Either way you end up with the plan in writing."
    }]
  }), React.createElement("div", {
    className: "fj-steps__cta"
  }, live ? React.createElement("a", {
    className: "hp-button",
    href: CONSULT_PAYMENT_LINK_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: () => trackClick("consult_steps")
  }, "Book a consult → ", CONSULT_PRICE) : React.createElement("a", {
    className: "hp-button",
    href: CONSULT_MAILTO,
    onClick: () => trackClick("consult_steps")
  }, "Ask about a consult →")))), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Not ready to book?",
    heading: "Not ready to book?",
    blurb: "Sunday Field Notes answers most planning questions eventually, written from inside the park.",
    location: "consult",
    tag: "consult"
  }));
}
window.ConsultPage = ConsultPage;
