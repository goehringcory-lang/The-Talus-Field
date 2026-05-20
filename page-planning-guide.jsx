/* global React, ArticleCard, NewsletterInline */

function PlanningGuide({ go }) {
  const find = (slug) => window.findArticle(slug);

  const firstTime = find("first-time-yosemite-overwhelm");
  const withoutReservations = find("yosemite-without-reservations-2026");
  const gateway = find("yosemite-gateway-towns-compared");
  const smoke = find("yosemite-during-smoke-season");

  const packCar = find("pack-your-car-for-yosemite");
  const withKids = find("yosemite-with-kids-no-reservations-2026");
  const nonHikers = find("yosemite-for-non-hikers");

  const halfDomePermit = find("half-dome-permit-lottery-2026");
  const soYouWantHalfDome = find("so-you-want-to-hike-half-dome");
  const mistTrail = find("mist-trail-the-real-guide");

  const tioga = find("tioga-road-opening-weekend-2026");
  const glacierPoint = find("glacier-point-road-open-2026");
  const stargazing = find("yosemite-stargazing-where-to-look-up");

  const sectionH2 = {
    fontFamily: "var(--display)",
    fontSize: 40,
    fontWeight: 500,
    lineHeight: 1.1,
    marginBottom: 20,
    letterSpacing: "-0.01em",
  };
  const sectionLede = {
    fontFamily: "var(--serif)",
    fontSize: 19,
    lineHeight: 1.55,
    color: "var(--ink-1)",
    maxWidth: 760,
    marginBottom: 32,
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <div className="eyebrow eyebrow--moss">The Planning Guide</div>
          <h1>Yosemite, planned properly.</h1>
          <p className="page-head__dek">
            The questions that come up before, during, and after a Yosemite trip, answered in the order most visitors actually run into them. Drawn from the full archive of The Talus Field, organized to read like a guide rather than a search result.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 56 }}>
        <p style={{ fontFamily: "var(--display)", fontSize: 22, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 760, marginBottom: 56 }}>
          Yosemite in 2026 is a different park from Yosemite in 2024. The entrance reservation system is gone, the crowds are heavier, the gateway towns matter more, and the difference between a great trip and a frustrating one is almost always strategy, not luck. Here is the strategy, in four parts.
        </p>

        {/* Part One: Before you book */}
        <section style={{ paddingTop: 32, paddingBottom: 56, borderTop: "1px solid var(--rule)" }}>
          <div className="eyebrow eyebrow--moss" style={{ marginTop: 32, marginBottom: 12 }}>Part One</div>
          <h2 style={sectionH2}>Before you book</h2>
          <p style={sectionLede}>
            The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season, whether you have internalized that 2026 is different. Read these four before you put money down.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 36, rowGap: 48 }}>
            <ArticleCard article={firstTime} go={go} />
            <ArticleCard article={withoutReservations} go={go} />
            <ArticleCard article={gateway} go={go} />
            <ArticleCard article={smoke} go={go} />
          </div>
        </section>

        {/* Part Two: When you arrive */}
        <section style={{ paddingTop: 32, paddingBottom: 56, borderTop: "1px solid var(--rule)" }}>
          <div className="eyebrow eyebrow--moss" style={{ marginTop: 32, marginBottom: 12 }}>Part Two</div>
          <h2 style={sectionH2}>When you arrive</h2>
          <p style={sectionLede}>
            What is in the car, who you are traveling with, whether everyone in your group can hike. The pragmatic decisions that make a Yosemite day flow or stall. The cooler, the camp chair, the Junior Ranger booklet, the bridge view from a wheelchair.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 48 }}>
            <ArticleCard article={packCar} go={go} />
            <ArticleCard article={withKids} go={go} />
            <ArticleCard article={nonHikers} go={go} />
          </div>
        </section>

        {/* Part Three: If you're hiking Half Dome */}
        <section style={{ paddingTop: 32, paddingBottom: 56, borderTop: "1px solid var(--rule)" }}>
          <div className="eyebrow eyebrow--moss" style={{ marginTop: 32, marginBottom: 12 }}>Part Three</div>
          <h2 style={sectionH2}>If you're hiking Half Dome</h2>
          <p style={sectionLede}>
            Half Dome is on every Yosemite list. It also requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail, the most-hiked and most-injured trail in any national park. Three pieces on what the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 48 }}>
            <ArticleCard article={halfDomePermit} go={go} />
            <ArticleCard article={soYouWantHalfDome} go={go} />
            <ArticleCard article={mistTrail} go={go} />
          </div>
        </section>

        {/* Part Four: The seasonal calendar */}
        <section style={{ paddingTop: 32, paddingBottom: 56, borderTop: "1px solid var(--rule)" }}>
          <div className="eyebrow eyebrow--moss" style={{ marginTop: 32, marginBottom: 12 }}>Part Four</div>
          <h2 style={sectionH2}>The seasonal calendar</h2>
          <p style={sectionLede}>
            Yosemite has at least four seasons inside any given summer. Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 48 }}>
            <ArticleCard article={tioga} go={go} />
            <ArticleCard article={glacierPoint} go={go} />
            <ArticleCard article={stargazing} go={go} />
          </div>
        </section>

        {/* Closing */}
        <section style={{ paddingTop: 32, paddingBottom: 96, borderTop: "2px solid var(--ink)" }}>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The takeaway</div>
              <h2 style={{ fontFamily: "var(--display)", fontSize: 32, fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 16 }}>Strategy beats research.</h2>
              <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 19, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
                Almost every "Yosemite was crowded and frustrating" story comes from a trip that was not planned around the park's actual rhythms. The articles above are how this site closes that gap. Read what is relevant. Skip what is not. Then pack the car.
              </p>
              <a className="btn btn--ghost" href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>
                Browse all entries →
              </a>
            </div>
            <NewsletterInline
              heading="Sunday Field Notes"
              blurb="One Yosemite email a week, when there is something to say. Free."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

window.PlanningGuide = PlanningGuide;
