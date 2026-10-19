/* global React, ResponsiveImage, HpPageHead, HpHeading, HomeLink, HpGuideBand, HpLetter, WebcamStrip, EntranceWaits, LodgingCta, AvailabilityLink, AffiliateDisclosure, EventIcon */

// =============================================================================
// WEBCAMS — `/webcams` route. Rebuilt in October 2026 on /firefall's system
// (`.hp-event`, the `.ff-*` layout rules, EventIcon): a full-width cover, the
// fact row and jump list, bands, the reading guide as numbered checks, and a
// visible FAQ that mirrors the faq in edge/seo.js's "/webcams" entry word for
// word (change both; the JSON-LD must match what a reader can see).
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

// Mirrored in edge/seo.js's "/webcams" faq (the JSON-LD). Change both.
const WC_FAQ = [
  ["Are there live webcams in Yosemite?", "Yes. The Yosemite Conservancy runs the public cameras, five of which are embedded here: Half Dome from Ahwahnee Meadow, Upper Yosemite Fall, El Capitan from Turtleback Dome, Wawona, and the High Sierra camera near Sentinel Dome. They are still-image cameras that refresh on the order of minutes rather than video streams, so a reload will not always change the picture."],
  ["Is there a webcam at Tuolumne Meadows or Tioga Pass?", "Not outside summer. The Yosemite Conservancy's High Sierra camera, near Sentinel Dome at about 8,000 feet, shows Cathedral Peak and Tenaya Peak of the Tuolumne high country from a distance. Yosemite Hospitality runs a summer-only camera at the Tuolumne Meadows Store, roughly June through September, linked from the NPS webcams page. For the high country the substitutes are the NPS Tioga Road page for plowing and opening status in spring, and the park's current conditions page once the road is open."],
  ["Why does the Yosemite Falls webcam show no waterfall?", "Because there is no waterfall. Yosemite Falls is fed by snowmelt from a shallow basin above the rim and is usually dry by late August, staying dry until the first storms of November. The camera is working; the fall is seasonal."],
  ["Which Yosemite webcam is best for checking the weather?", "Half Dome, for the Valley: if the dome is in cloud, the Valley is having a day. Check El Capitan beside it, which is wide enough to show haze and smoke. Neither says anything about the high country, because the Valley floor sits at 4,000 feet and Tuolumne Meadows at 8,600; for snow on the peaks above Tioga Road, use the High Sierra camera."],
  ["How often do the Yosemite webcams update?", "They are still images, not video, and they refresh on the order of minutes rather than seconds. A page reload will not always change the picture, and nothing on them will show you a bear walking past."],
  ["Can I see Tioga Road on a webcam?", "Not the road itself from the park's cameras. Caltrans QuickMap carries highway cameras along SR-120 and US-395 near Lee Vining, including Conway Summit, which is the east-side check. Whether Tioga Road is open is on the NPS current conditions page, and how the season works is on the Tioga opening page."],
];

function WebcamsPage({ go }) {
  const toc = [
    ["#cams-live", "Live now"],
    ["#cams-high", "High country"],
    ["#cams-each", "What each shows"],
    ["#cams-read", "How to read them"],
    ["#cams-more", "Other cameras"],
    ["#cams-faq", "Questions"],
  ];
  return (
    <div className="page hp-tool hp-event hp-webcams">
      <div className="ff-cover wc-cover">
        <ResponsiveImage image="img/half-dome-valley-cumulus.jpg" eager className="ff-cover__img"
          alt="Half Dome framed between El Capitan and the Valley wall under a bank of summer cloud"
          sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Webcams" }]}
          eyebrow="LIVE VIEWS · HALF DOME · YOSEMITE FALLS · EL CAPITAN"
          title="Yosemite webcams"
          intro="The live cameras worth checking before you drive in, what each one actually shows, and how often it refreshes. Five load on this page. The rest are one link away, because the operators would rather you watched them at home."
          actions={<React.Fragment>
            <HomeLink go={go} location="webcams_head" className="hp-button" href="#cams-live">See the cameras <span>↓</span></HomeLink>
            <HomeLink go={go} location="webcams_head" className="hp-link" href="#cams-read">How to read them ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: elijahjcobb / Pexels</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="camera" /><dt>The cameras</dt><dd>Five, on this page</dd></div>
          <div><EventIcon name="clock" /><dt>The refresh</dt><dd>Minutes, not seconds</dd></div>
          <div><EventIcon name="eye" /><dt>The format</dt><dd>Still images</dd></div>
          <div><EventIcon name="pin" /><dt>The operator</dt><dd>Yosemite Conservancy</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="webcams_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      <section className="hp-wrap hp-section hp-webcams__live" id="cams-live" tabIndex={-1}>
        <HpHeading go={go} location="webcams" eyebrow="FOUR CAMERAS" title="Live now"
          link={{ href: "https://yosemite.org/webcams/", label: "All Conservancy cameras ↗" }} />
        <WebcamStrip />
      </section>

      <section className="ff-band" id="cams-high" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">HIGH COUNTRY</p>
              <h2>Tuolumne &amp; Tioga</h2>
              <p className="ff-lede">The Conservancy's High Sierra camera sits near Sentinel Dome at about 8,000 feet and looks east. Half Dome fills the foreground, Clouds Rest rises behind it, and Tenaya Peak and Cathedral Peak mark the Tuolumne high country on the skyline. It is the one working camera that shows the high country, from a distance.</p>
              <p className="ff-lede">There is no live camera at Tuolumne Meadows or Tioga Pass itself outside summer. Yosemite Hospitality's <a href="https://www.travelyosemite.com/plan/webcams/tuolumne-meadows-with-fairview-dome" target="_blank" rel="noopener noreferrer">Tuolumne Meadows Store camera</a>, looking at Fairview Dome, runs roughly June through September; its picture has not updated since October 2025 and the <a href="https://www.nps.gov/media/webcam/view.htm?id=81B46511-1DD8-B71B-0BF4530A57767712" target="_blank" rel="noopener noreferrer">NPS listing</a> marks it inactive.</p>
              <p className="ff-note">For the road itself, Caltrans <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">QuickMap</a> carries highway cameras along SR-120 and US-395 near Lee Vining, including Conway Summit, which is the east-side check. Whether the road is open is on the <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">NPS current conditions page</a>, and how the season works is on <HomeLink go={go} location="webcams_high" href="/tioga-opening">the Tioga opening page</HomeLink>.</p>
            </div>
            <div className="wc-high">
              <WebcamStrip only={["High Sierra"]} />
              <p className="hp-eyebrow"><a href="https://yosemite.org/webcams/high-sierra/" target="_blank" rel="noopener noreferrer">High Sierra camera ↗</a></p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cams-each" tabIndex={-1}>
        <HpHeading eyebrow="WHAT EACH CAMERA SHOWS" title="Five views, five jobs" />
        <p className="ff-lede ff-lede--intro">All five are still images rather than video streams. They refresh on the order of minutes rather than seconds, which is why a page reload does not always change the picture and why nothing here is going to show you a bear walking past.</p>
        <ul className="wc-cams">
          {CAM_NOTES.map((c) => (
            <li key={c.name}>
              <h3>{c.name} webcam</h3>
              <p className="wc-cams__from"><EventIcon name="pin" size={16} />{c.from}</p>
              <p>{c.shows}</p>
              <p className="wc-cams__best"><EventIcon name="clock" size={16} /><span><b>Best hour</b> {c.best}</span></p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ff-band" id="cams-read" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="HOW TO READ THEM" title="Four rules for a camera" />
          <ol className="ff-checks wc-rules">
            <li><EventIcon name="eye" /><strong>Check two, not one</strong><p>A single camera tells you about one wall. Half Dome plus El Capitan tells you whether the whole Valley is clear, socked in, or hazy, and those are three different days. For a climber, <HomeLink go={go} location="webcams_read" href="/articles/watching-climbers-el-capitan">stand in El Capitan Meadow with binoculars</HomeLink>.</p></li>
            <li><EventIcon name="mountain" /><strong>Elevation lies to you</strong><p>The Valley floor sits at 4,000 feet and Tuolumne Meadows at 8,600. A clear Valley camera says nothing about whether it is snowing on <HomeLink go={go} location="webcams_read" href="/tioga-opening">Tioga Road</HomeLink>, and in shoulder season it frequently is. Wawona is the useful third check.</p></li>
            <li><EventIcon name="drop" /><strong>A dry waterfall is not a broken camera</strong><p>Every August someone concludes the Yosemite Falls cam has failed. The fall is seasonal and usually gone by late August. <HomeLink go={go} location="webcams_read" href="/articles/yosemite-waterfalls-guide">The flow-by-month table</HomeLink> says which falls are running on your dates.</p></li>
            <li><EventIcon name="alert" /><strong>They are not a conditions report</strong><p>A camera shows one frame of one place. For road status and closures use <HomeLink go={go} location="webcams_read" href="/now">the Park Bulletin</HomeLink>; for forecasts and entrance waits, <HomeLink go={go} location="webcams_read" href="/conditions">the conditions page</HomeLink>; for the drive in, <HomeLink go={go} location="webcams_read" href="/distances">the drive-time table</HomeLink>.</p></li>
          </ol>
        </div>
      </section>

      <div className="hp-wrap hp-section hp-reading">
        <div className="hp-reading__column">
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
        </div>
      </div>

      <section className="ff-band" id="cams-more" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="THE OTHER CAMERAS" title="Sources to keep open" />
          <div className="ff-sources wc-sources">
            <ul>
              <li><a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer"><strong>Yosemite Conservancy webcams ↗</strong><span>The operator of the five above, with its full set including views this page does not embed. Always the current list.</span></a></li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer"><strong>NPS current conditions ↗</strong><span>Road status, closures, and any camera the park itself runs.</span></a></li>
              <li><a href="https://www.nps.gov/yose/learn/photosmultimedia/webcams.htm" target="_blank" rel="noopener noreferrer"><strong>NPS webcams page ↗</strong><span>Lists the park's others, including Yosemite Hospitality's summer-only Tuolumne Meadows Store camera.</span></a></li>
            </ul>
            <p className="ff-note">Until Tioga Road opens, the honest substitutes for a high-country camera are the NPS Tioga Road page for plowing status and <HomeLink go={go} location="webcams_more" href="/tioga-opening">the opening page</HomeLink> for how the season works. Camera images are served by their operators, not by this site, and a camera that is down hides its own tile above rather than showing a broken image. If one has moved for good, tell me on <HomeLink go={go} location="webcams_more" href="/contact">the contact page</HomeLink> and it gets fixed.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section ff-split" id="cams-faq" tabIndex={-1}>
        <div>
          <p className="hp-eyebrow">QUESTIONS</p>
          <h2>Yosemite webcam questions, answered</h2>
          <p className="ff-lede">The rest of the morning-of check: <HomeLink go={go} location="webcams_faq" href="/conditions">entrance waits, parking and forecasts</HomeLink>, the <HomeLink go={go} location="webcams_faq" href="/now">Park Bulletin</HomeLink> for roads and closures, and <HomeLink go={go} location="webcams_faq" href="/dates">the dates that decide a trip</HomeLink>.</p>
        </div>
        <div className="ff-faq">
          {WC_FAQ.map(([q, a], i) => (
            <details key={q} open={i < 2}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

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
