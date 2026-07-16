/* global React, WebcamStrip, NewsletterInline, Breadcrumbs */

// =============================================================================
// THE FIREFALL — `/firefall` route. The first evergreen event page
// (MONETIZATION-IDEAS.md 4.3): a permanent URL that accrues rank year over
// year for the park's most searched seasonal spike, instead of a year-stamped
// slug that resets every season. The deep explainer stays in the article
// (/articles/horsetail-fall-firefall); this page is the decision aid: the
// window, the three conditions, the live layer, and the practical shape of an
// evening. Every fact here comes from the published article body; the current
// year's rules deliberately stay unquoted (they change annually — the page
// points at the NPS sources instead, same discipline as the article).
//
// /tioga-opening and the Half Dome lottery page follow this same pattern when
// they land. Standing commitment: nothing on this page names a specific year,
// so it cannot go stale the way a dated page does.
// =============================================================================

function FirefallPage({ go }) {
  const goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Firefall" }]} />
          <div className="eyebrow eyebrow--moss">Seasonal event · mid-to-late February</div>
          <h1>The Yosemite Firefall</h1>
          <p className="page-head__dek">
            For roughly two weeks in mid-to-late February, sunset light can turn
            Horsetail Fall into a glowing orange ribbon on El Capitan. It is real,
            it is not enhanced in the photographs, and most evenings it does not
            happen. This page is the honest version: when the window runs, what has
            to line up, and how to plan an evening around uncertain odds.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>The window</h2>
          <p>
            The sun angle that lights the fall runs roughly the second week of
            February through the last week, with the strongest color usually in the
            middle of that span. The same geometry occurs in late October, but by
            then the fall is almost always dry, so February is the season. Outside
            those dates the sunset light either misses the fall or fails to isolate
            it against shadowed rock. The glow itself is short: it builds for a few
            minutes, peaks near sunset, and is finished about ten minutes later.
          </p>

          <h2>Three conditions, and all of them must hold</h2>
          <p>
            The firefall is an alignment problem. Any one condition failing cancels
            the show entirely.
          </p>
          <ol>
            <li>
              <strong>Water in the fall.</strong> Horsetail has a tiny drainage and
              no lake feeding it; it flows only when recent rain or melting snow is
              running off El Capitan's summit. A cold, dry February leaves it empty.
              A storm the week before, followed by mild afternoons, is the ideal
              setup.
            </li>
            <li>
              <strong>A clear western horizon at sunset.</strong> The light travels
              from the horizon up the Merced canyon onto the cliff. A cloud bank
              sitting where the sun goes down kills the show even on an otherwise
              clear evening.
            </li>
            <li>
              <strong>The sun angle.</strong> The only condition you can schedule,
              and the reason the window above exists at all.
            </li>
          </ol>
          <p>
            The arithmetic: fourteen to eighteen candidate evenings a year, minus
            February's clouds, minus dry years. Some years several evenings converge
            and produce the famous photographs. Some years the firefall effectively
            does not happen. Anyone selling certainty for one specific evening is
            selling something.
          </p>
        </section>

        {/* The live layer: the two failure conditions are checkable this week. */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Check the two conditions that change</div>
          <WebcamStrip />
          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", marginTop: 16 }}>
            Water and weather, live:{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>
              webcams, entrance waits, and the Valley forecast →
            </a>
            {" "}For the current year's viewing rules (parking, closures, and any
            reservation requirement, which change annually), check{" "}
            <a href="https://www.nps.gov/yose/planyourvisit/horsetailfall.htm" target="_blank" rel="noopener noreferrer">the NPS Horsetail Fall page</a>{" "}
            and{" "}
            <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">current conditions</a>{" "}
            in the week before you commit.
          </p>
        </div>

        <section className="prose" style={{ marginTop: 48 }}>
          <h2>The shape of the evening</h2>
          <p>
            Whatever the current rules are, assume this: you will park somewhere
            designated, probably at Yosemite Falls parking, and walk a mile or more
            each way on pavement toward the classic viewing zone on Northside Drive
            near the El Capitan Picnic Area. Photographers stake tripod positions by
            early afternoon on promising days; even a casual viewer should be in
            place at least an hour before sunset. Then you wait, standing still,
            through a February evening in a shaded valley at 4,000 feet. Bring real
            layers, something insulated to stand on, a headlamp for the walk out,
            and a thermos. The people who suffer at the firefall are underdressed
            for standing still, not for hiking.
          </p>
          <p>
            February driving matters too: chain control on the approach highways is
            routine after storms, which is exactly the weather that fills the fall.
          </p>
          <p>
            The full story, the history, the photography notes, and the naturalist's
            case for February with or without the show:{" "}
            <a href="/articles/horsetail-fall-firefall" onClick={(e) => goArticle(e, "horsetail-fall-firefall")}>
              <strong>the complete firefall guide →</strong>
            </a>
          </p>
        </section>

        <NewsletterInline
          location="firefall"
          tag="firefall"
          heading="February, watched from inside the park"
          blurb="Sunday Field Notes carries the firefall window as it develops: water in the fall, the week's weather, and what the rules are this year. One short letter a week. Free."
        />
      </div>
    </div>
  );
}

window.FirefallPage = FirefallPage;
