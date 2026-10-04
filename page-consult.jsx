/* global React, HpPageHead, HpLetter, FjLayout, FjFacts, FjPull, FjSteps, FjRidge */

// =============================================================================
// FIELD CONSULT — `/consult` route (MONETIZATION-IDEAS.md 3.3). Sells the one
// thing no competitor can copy: the naturalist's time. Deliberately small: a
// capped number of consults a month, plain pricing, no packages page.
//
// Payment and booking run on external services, not the Worker: a Stripe
// Payment Link and a scheduling URL (Cal.com or similar), pasted into the two
// consts below from their dashboards. While either is a placeholder the page
// renders a mailto CTA instead of a dead button, so it can ship (and start
// accruing search age) before the accounts exist. Consult purchases carry no
// GUIDE_PRODUCT_TAG metadata, so the Stripe webhook ignores them by design;
// refunds are handled manually in the dashboard.
// =============================================================================

// Paste the live Stripe Payment Link here (Dashboard -> Payment links).
const CONSULT_PAYMENT_LINK_URL = "";
// Paste the booking URL here (Cal.com event link or similar).
const CONSULT_BOOKING_URL = "";

const CONSULT_PRICE = "$95";
const CONSULT_SLOTS_PER_MONTH = 6;
// The inquiry email carries the short intake the reply needs, so the first
// answer can say whether a slot fits instead of asking for the basics.
const CONSULT_INTAKE = [
  "Travel dates:",
  "How many in the party (and ages, if kids):",
  "Where you are staying, or the towns you are weighing:",
  "The main thing you are trying to figure out:",
  "Anything that limits the plan (knees, a dog, a flight time, a permit you did or did not get):",
  "A call or a written plan:",
].join("\n\n");
const CONSULT_MAILTO =
  "mailto:cory@thetalusfieldjournal.com?subject=Field%20consult%20inquiry&body=" +
  encodeURIComponent(CONSULT_INTAKE + "\n");

function ConsultPage({ go }) {
  const live = Boolean(CONSULT_PAYMENT_LINK_URL && CONSULT_BOOKING_URL);

  const trackClick = (which) => {
    if (window.track) window.track("consult_book_click", { location: which, live });
  };

  return (
    <div className="page hp-consult">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Field consult" }]}
        className="fj-head fj-topo"
        eyebrow={`ONE ON ONE · ${CONSULT_SLOTS_PER_MONTH} A MONTH`}
        title="Thirty minutes on your Yosemite plan."
        intro={`A call with a naturalist who lives in the park: your dates, your group, your plan, taken apart and put back together by someone who has spent twenty seasons watching plans meet the actual park. ${CONSULT_PRICE}, thirty minutes, ${CONSULT_SLOTS_PER_MONTH} slots a month.`}
        aside={
    <div className="hp-consult__book">
      <p className="hp-eyebrow">THE CONSULT / {CONSULT_PRICE}</p>
      {live ? (
        <>
          <a
            className="hp-button"
            href={CONSULT_PAYMENT_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("consult_pay")}
          >
            Book a consult → {CONSULT_PRICE}
          </a>
          <a
            href={CONSULT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("consult_schedule")}
            className="hp-link"
          >
            Already paid? Pick your time →
          </a>
        </>
      ) : (
        <>
          <p className="hp-consult__soon">
            Consults are booked by email for now, not through a calendar. Send
            your dates, party, base and main question (the email opens with
            those prompts filled in), and the reply says whether one of this
            month's slots fits, and how to pay for it and pick a time. Nothing
            is charged before that.
          </p>
          <a className="hp-button" href={CONSULT_MAILTO} onClick={() => trackClick("consult_mailto")}>
            Ask about a consult →
          </a>
        </>
      )}
      <p className="hp-terms">
        {live
          ? "No waitlist for consults; the newsletter announces when slots reopen."
          : "Times are agreed by email. No waitlist for consults; the newsletter announces when slots reopen."}
      </p>
    </div>

        }
      />

      <div className="hp-wrap fj-band">
        <FjFacts
          label="The consult at a glance"
          items={[
            { label: "With", value: "A naturalist, twenty seasons" },
            { label: "Length", value: "Thirty minutes" },
            { label: "Slots", value: `${CONSULT_SLOTS_PER_MONTH} a month` },
            { label: "Format", value: "A call, or in writing" },
          ]}
        />
      </div>

      <FjLayout>
        <section className="prose">
          <h2>What it is</h2>
          <p>
            You bring dates, a rough plan or none at all, and the constraints that
            matter: kids, knees, a dog, a flight out of Fresno, a hard reservation
            you could not get. You leave with a plan that fits the park as it will
            actually be that week: which entrance, which mornings for which trails,
            where the lot fills first, what to book now and what to leave loose,
            and the one or two things worth dropping. If the week of your trip
            brings smoke, a road closure, or a heat spike, the advice accounts for
            how the park behaves under it.
          </p>
          <p>
            Prefer it in writing? The same session works asynchronously: send the
            details by email after booking, and a written plan comes back instead
            of a call, with a shareable map link for the drive.
          </p>

          <h2>What it is not</h2>
          <FjPull side cite="What it is not">Lotteries stay lotteries.</FjPull>
          <p>
            Not a booking service, not a guided tour, and not a way around the
            park's permit systems. Lotteries stay lotteries. What a consult does is
            make sure everything outside the lottery is working in your favor.
          </p>

          <FjRidge />
          <h2>How it works</h2>
          {/* Two honest versions: the self-serve flow once the payment link
              and the calendar exist, the email inquiry until then. */}
          <FjSteps
            steps={live ? [
              { title: `Pay for the slot. ${CONSULT_PRICE}, thirty minutes.` },
              { title: <>Pick a time on the calendar, or reply to the receipt with "written plan" and your details.</> },
              { title: "Talk, or read. Either way you end up with the plan in writing." },
            ] : [
              { title: "Email your dates, party, base and main question." },
              { title: `The reply says whether a slot fits this month, and how to pay (${CONSULT_PRICE}) and pick a time, or ask for a written plan instead.` },
              { title: "Talk, or read. Either way you end up with the plan in writing." },
            ]}
          />
          <div className="fj-steps__cta">
            {live ? (
              <a className="hp-button" href={CONSULT_PAYMENT_LINK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackClick("consult_steps")}>
                Book a consult → {CONSULT_PRICE}
              </a>
            ) : (
              <a className="hp-button" href={CONSULT_MAILTO} onClick={() => trackClick("consult_steps")}>
                Ask about a consult →
              </a>
            )}
          </div>
        </section>
      </FjLayout>

      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Not ready to book?"
        heading="Not ready to book?"
        blurb="Sunday Field Notes answers most planning questions eventually, written from inside the park."
        location="consult"
        tag="consult"
      />
    </div>
  );
}

window.ConsultPage = ConsultPage;
