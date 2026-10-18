/* global React, HpPageHead, HpHeading, HpGuideBand, HpLetter, WebcamStrip, EntranceWaits, LodgingCta, AvailabilityLink, AffiliateDisclosure */

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
// site already stands behind. The live tiles are the Yosemite Conservancy
// cams the WebcamStrip component has served on /conditions and the homepage for
// months, plus the Conservancy's High Sierra cam (same host, loaded and checked
// October 17, 2026); the outbound links are the operators' own index pages. Do NOT add a
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
      "The face of Half Dome above the eastern end of Yosemite Valley. The best of the five for weather: if the dome is in cloud, the Valley is having a day.",
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
      "El Capitan and the western Valley from above Highway 41. A wide view rather than a close one, and the most useful of the five for judging haze and smoke.",
    best: "Any clear hour; sunset for the light on the nose.",
  },
  {
    name: "Wawona",
    from: "Wawona, the park's south end",
    shows:
      "Conditions an hour south of the Valley and about thirty minutes from the Mariposa Grove, at about 4,000 feet. Worth checking separately in winter, when Wawona and the Valley genuinely differ.",
    best: "Midday in winter, to see whether snow is lying.",
  },
  {
    name: "High Sierra",
    from: "Near Sentinel Dome at about 8,000 feet, looking east",
    shows:
      "Half Dome from above, with Clouds Rest behind it and Tenaya Peak and Cathedral Peak of the Tuolumne high country on the skyline. The only one of the five that shows the high country at all, and the one to check for snow on the peaks above Tioga Road.",
    best: "Early morning, before the haze builds over the Valley.",
  },
];

function WebcamsPage({ go }) {
  return (
    <div className="page hp-webcams">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Webcams" }]}
        eyebrow="LIVE VIEWS"
        title="Yosemite webcams"
        intro="The live cameras worth checking before you drive in, what each one actually shows, and how often it refreshes. Five load on this page. The rest are one link away, because the operators would rather you watched them at home."
      >
        <AffiliateDisclosure />
      </HpPageHead>

      <section className="hp-wrap hp-section hp-webcams__live">
        <HpHeading go={go} location="webcams" eyebrow="FOUR CAMERAS" title="Live now"
          link={{ href: "https://yosemite.org/webcams/", label: "All Conservancy cameras ↗" }} />
        <WebcamStrip />
      </section>

      <section className="hp-wrap hp-section hp-webcams__high">
        <HpHeading go={go} location="webcams" eyebrow="HIGH COUNTRY" title="Tuolumne & Tioga"
          link={{ href: "https://yosemite.org/webcams/high-sierra/", label: "High Sierra camera ↗" }} />
        <div className="hp-webcams__highbody">
          <WebcamStrip only={["High Sierra"]} />
          <div className="prose">
            <p>
              The Conservancy's High Sierra camera sits near Sentinel Dome at
              about 8,000 feet and looks east. Half Dome fills the foreground,
              Clouds Rest rises behind it, and Tenaya Peak and Cathedral Peak
              mark the Tuolumne high country on the skyline. It is the one
              working camera that shows the high country, from a distance.
            </p>
            <p>
              There is no live camera at Tuolumne Meadows or Tioga Pass itself
              outside summer. Yosemite Hospitality's{" "}
              <a href="https://www.travelyosemite.com/plan/webcams/tuolumne-meadows-with-fairview-dome" target="_blank" rel="noopener noreferrer">Tuolumne
              Meadows Store camera</a>, looking at Fairview Dome, runs roughly
              June through September; its picture has not updated since October
              2025 and the{" "}
              <a href="https://www.nps.gov/media/webcam/view.htm?id=81B46511-1DD8-B71B-0BF4530A57767712" target="_blank" rel="noopener noreferrer">NPS
              listing</a> marks it inactive. For the road itself, Caltrans{" "}
              <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">QuickMap</a>{" "}
              carries highway cameras along SR-120 and US-395 near Lee Vining,
              including Conway Summit, which is the east-side check. Whether the
              road is open is on the{" "}
              <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">NPS
              current conditions page</a>, and how the season works is on{" "}
              <a href="/tioga-opening" onClick={(e) => { e.preventDefault(); go("tioga-opening"); }}>the
              Tioga opening page</a>.
            </p>
          </div>
        </div>
      </section>

      <div className="hp-wrap hp-reading">
        <div className="hp-reading__column">
        <section className="prose">
          <h2>What each camera shows</h2>
          <p>
            All five are still images rather than video streams. They
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
            days. The El Capitan view is far too wide to show a climber; for
            that, <a href="/articles/watching-climbers-el-capitan" onClick={(e) => { e.preventDefault(); go("a:watching-climbers-el-capitan"); }}>stand
            in El Capitan Meadow with binoculars</a>.
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
            How long the drive in takes from each gateway town is in{" "}
            <a href="/distances" onClick={(e) => { e.preventDefault(); go("distances"); }}>the drive-time table</a>.
          </p>
        </section>

        {/* The reader who checks a camera is deciding whether to go soon, so
            the block answers the short-notice question with the two towns the
            site's own data supports: El Portal is the closest (GATEWAYS in
            page-stay.jsx, TO_VALLEY in page-distances.jsx), and Groveland is
            the gateway article's "easier last-minute bookings in shoulder
            season". Highway 140's weather line is /stay's corridor copy. */}
        <LodgingCta
          destination="El Portal, California"
          heading="If the cameras say go"
          note={
            <>
              A clear Valley on two cameras is a reason to go soon, and the bed is the hard part at short notice. El Portal is the closest town, 25 to 35 minutes from the Valley on Highway 140, the low road that takes rain on the days the others take snow. In shoulder season,{" "}
              <AvailabilityLink destination="Groveland, California" list="page_webcams" slug="groveland" name="Groveland lodging search">Groveland</AvailabilityLink>{" "}
              is the easier last-minute booking, 65 to 80 minutes out on Highway 120.
            </>
          }
          list="page_webcams"
          slug="el-portal"
          cta="Search El Portal lodging →"
        />

        <section style={{ marginTop: 48 }}>
          <p className="hp-eyebrow">ENTRANCE WAITS, LIVE</p>
          <EntranceWaits />
        </section>

        <section className="prose" style={{ marginTop: 48 }}>
          <h2>The other cameras</h2>
          <p>
            <strong>Yosemite Conservancy</strong> runs the five above plus its
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
            <strong>For the high country and the east side</strong>, the
            Conservancy's High Sierra camera above is the only one that shows
            the Tuolumne peaks; no camera runs at Tuolumne Meadows or Tioga Pass
            outside summer. Yosemite Hospitality's summer-only camera at the
            Tuolumne Meadows Store is listed with the park's others on the{" "}
            <a href="https://www.nps.gov/yose/learn/photosmultimedia/webcams.htm" target="_blank" rel="noopener noreferrer">NPS webcams page</a>.
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

        </div>
      </div>

      <HpGuideBand
        go={go}
        location="webcams"
        title="No signal past the gate"
        intro="Cameras are for before you leave. Once you are in the park there is no service to load one. The Field Guide app carries offline maps, trailhead parking notes and GPS that works with the phone in airplane mode."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="What the cameras are showing this week"
        heading="What the cameras are showing this week"
        blurb="What the park is doing right now: what is open, what is flowing, and what changed."
        location="webcams"
        tag="webcams"
      />
    </div>
  );
}

window.WebcamsPage = WebcamsPage;
