/* global React, NewsletterInline, Breadcrumbs, GuidePromo, WebcamStrip, EntranceWaits */

// =============================================================================
// WEBCAMS — `/webcams` route.
//
// Why it exists: the site was ranking for roughly 25 webcam queries ("yosemite
// live cam", "yosemite webcams", "tuolumne meadows webcam", "tioga pass
// camera") at positions 19 to 57 purely by topical association, with no webcam
// page anywhere on it. Webcam roundups are also one of the two link-bait shapes
// in the August 2026 audit: utility aggregations get linked, essays do not.
//
// SOURCING RULE. Every camera and every link on this page has to be one the
// site already stands behind. The four live tiles are the Yosemite Conservancy
// cams the WebcamStrip component has served on /conditions and the homepage for
// months; the outbound links are the operators' own index pages. Do NOT add a
// camera from memory or from a search result: a dead cam URL on a page whose
// entire promise is "these are the working cameras" is the one failure this
// page cannot survive. Add a row only after loading it.
//
// No iframes. The Content-Security-Policy in _headers restricts frame-src to
// Buttondown and youtube-nocookie, so an embedded player would be blocked in
// production while working locally, which is the trap. img-src allows any
// https host, which is why the image tiles work with no CSP change.
// =============================================================================

// What each live tile actually shows. The images themselves come from
// WebcamStrip; this is the reading guide beside them, which is the part a
// bare camera page never has.
const CAM_NOTES = [
  {
    name: "Half Dome",
    from: "Ahwahnee Meadow, looking east",
    shows:
      "The face of Half Dome above the eastern end of Yosemite Valley. The best of the four for weather: if the dome is in cloud, the Valley is having a day.",
    best: "Late afternoon, when the west light hits the face.",
  },
  {
    name: "Yosemite Falls",
    from: "Yosemite Valley, looking north",
    shows:
      "Upper Yosemite Fall on the north wall. This is the camera to check before a spring trip and the one that answers the August question, which is whether there is any water at all.",
    best: "Morning, before the wall goes flat.",
  },
  {
    name: "El Capitan",
    from: "Turtleback Dome, looking east into the Valley",
    shows:
      "El Capitan and the western Valley from above Highway 41. A wide view rather than a close one, and the most useful of the four for judging haze and smoke.",
    best: "Any clear hour; sunset for the light on the nose.",
  },
  {
    name: "Wawona",
    from: "Wawona, the park's south end",
    shows:
      "Conditions an hour south of the Valley and twenty minutes from the Mariposa Grove, at about 4,000 feet. Worth checking separately in winter, when Wawona and the Valley genuinely differ.",
    best: "Midday in winter, to see whether snow is lying.",
  },
];

function WebcamsPage({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Webcams" }]} />
          <div className="eyebrow eyebrow--moss">Live views</div>
          <h1>Yosemite webcams</h1>
          <p className="page-head__dek">
            The live cameras worth checking before you drive in, what each one
            actually shows, and how often it refreshes. Four load on this page.
            The rest are one link away, because the operators would rather you
            watched them at home.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40 }}>
        <div className="section-head">
          <h2>Live now</h2>
          <a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer">All Conservancy cameras →</a>
        </div>
        <WebcamStrip />
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <section className="prose">
          <h2>What each camera shows</h2>
          <p>
            All four are still-image cameras rather than video streams. They
            refresh on the order of minutes rather than seconds, which is why a
            page reload does not always change the picture and why nothing here
            is going to show you a bear walking past.
          </p>
          {CAM_NOTES.map((c) => (
            <p key={c.name}>
              <strong>{c.name}.</strong> {c.from}. {c.shows} Best hour: {c.best.toLowerCase()}
            </p>
          ))}

          <h2>How to actually read them</h2>
          <p>
            <strong>Check two, not one.</strong> A single camera tells you about
            one wall. Half Dome plus El Capitan tells you whether the whole
            Valley is clear, socked in, or hazy, and those are three different
            days.
          </p>
          <p>
            <strong>Elevation lies to you.</strong> The Valley floor sits at
            4,000 feet and Tuolumne Meadows at 8,600. A clear Valley camera says
            nothing about whether it is snowing on{" "}
            <a href="/tioga-opening">Tioga Road</a>, and in shoulder season it
            frequently is. Wawona is the useful third check for the south end.
          </p>
          <p>
            <strong>A dry waterfall is not a broken camera.</strong> Every
            August someone concludes the Yosemite Falls cam has failed. It has
            not; the fall is seasonal and usually gone by late August.{" "}
            <a href="/articles/yosemite-waterfalls-guide">The flow-by-month
            table</a> says which falls are running on your dates.
          </p>
          <p>
            <strong>They are not a conditions report.</strong> A camera shows one
            frame of one place. For road status, closures and what the park says
            about the current week, use{" "}
            <a href="/now" onClick={(e) => { e.preventDefault(); go("now"); }}>the Park Bulletin</a>,
            and for forecasts and entrance waits use{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>the conditions page</a>.
          </p>
        </section>

        <section style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Entrance waits, live</div>
          <EntranceWaits />
        </section>

        <section className="prose" style={{ marginTop: 48 }}>
          <h2>The other cameras</h2>
          <p>
            <strong>Yosemite Conservancy</strong> runs the four above plus its
            full set, including views this page does not embed:{" "}
            <a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer">yosemite.org/webcams</a>.
            They are the operator, so their page is always the current list.
          </p>
          <p>
            <strong>The National Park Service</strong> keeps its own current
            conditions page, which is where road status and any camera the park
            itself runs are published:{" "}
            <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">nps.gov current conditions</a>.
          </p>
          <p>
            <strong>For the high country and the east side</strong>, there is no
            Conservancy camera at Tuolumne Meadows or Tioga Pass, which is the
            single most requested view the park does not have on this list.
            Until the road opens, the honest substitutes are the NPS Tioga Road
            page for plowing status and{" "}
            <a href="/tioga-opening">the opening page</a> for how the season
            works.
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
            Camera images are served by their operators, not by this site, and a
            camera that is down hides its own tile above rather than showing a
            broken image. If one has moved for good, tell me on{" "}
            <a href="/contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>the contact page</a>{" "}
            and it gets fixed.
          </p>
        </section>

        <GuidePromo
          go={go}
          location="webcams"
          title="No signal past the gate"
          body="Cameras are for before you leave. Once you are in the park there is no service to load one. The Field Guide app carries offline maps, trailhead parking notes and GPS that works with the phone in airplane mode. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <NewsletterInline
          location="webcams"
          tag="webcams"
          heading="What the cameras are showing this week"
          blurb="One short Sunday letter on what the park is doing right now: what is open, what is flowing, and what changed. Free."
        />
      </div>
    </div>
  );
}

window.WebcamsPage = WebcamsPage;
