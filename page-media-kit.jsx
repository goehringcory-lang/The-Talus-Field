/* global React, HpPageHead, HpHeading, HpLetter, FjCard, HomeLink */

// The reach figures, in one place. Every number here comes from the owner's
// export (Search Console for the 28-day window, Buttondown for the list);
// nothing on this page may print a figure that is not in it. A null is not
// drawn, and an empty list hides its block, so a missing figure leaves a
// shorter page rather than a guessed one. Update the window with the figures.
const MEDIA_KIT_REACH = {
  window: "28 days, September 17 to October 14, 2026",
  impressions: 14540, // Google Search impressions in the window
  clicks: 151, // Google Search clicks in the window
  subscribers: 22, // confirmed, Buttondown weekly digest Sep 28–Oct 5, 2026 // Sunday Field Notes subscribers
  subscribersAsOf: "October 5, 2026", // e.g. "October 14, 2026"
  // The pages that drew the most search clicks in the window, in order:
  // { title, href, clicks? }. href is a site path.
  topPages: [
    { title: "Yosemite webcams", href: "/webcams", clicks: 12 },
    { title: "Half Dome lottery odds & strategy", href: "/half-dome-lottery", clicks: 11 },
    { title: "Yosemite gateway towns compared", href: "/articles/yosemite-gateway-towns-compared", clicks: 11 },
    { title: "Yosemite for non-hikers", href: "/articles/yosemite-for-non-hikers", clicks: 8 },
    { title: "Watching climbers on El Capitan", href: "/articles/watching-climbers-el-capitan", clicks: 8 },
  ],
};

// The rates. They restate /advertise (page-advertise.jsx) and its crawler
// copy in edge/seo.js word for word; change all three together.
const MEDIA_KIT_TIERS = [
  {
    name: "Standard listing",
    summary: "Name, area, blurb, outbound link in the relevant category.",
    term: "Twelve months",
    rate: "$300 a year",
  },
  {
    name: "Featured listing",
    summary: "Standard, plus a photo, an extended description, and priority position within the category.",
    term: "Twelve months",
    rate: "$600 a year",
    featured: true,
  },
  {
    name: "Sunday letter sponsorship",
    summary: "A sponsorship of Sunday Field Notes, the weekly letter. Format agreed with the editor before it runs.",
    term: "By arrangement",
    rate: "Priced on inquiry",
  },
  {
    name: "Custom packages",
    summary: "A combination of the above, or a placement that does not fit them.",
    term: "By arrangement",
    rate: "Priced on inquiry",
  },
];

const mediaKitNumber = (n) => (typeof n === "number" ? n.toLocaleString("en-US") : n);

function MediaKitPage({ go }) {
  const r = MEDIA_KIT_REACH;
  const stats = [
    r.impressions != null && { label: "Search impressions", value: mediaKitNumber(r.impressions) },
    r.clicks != null && { label: "Search clicks", value: mediaKitNumber(r.clicks) },
    r.subscribers != null && { label: r.subscribersAsOf ? `Letter subscribers, ${r.subscribersAsOf}` : "Letter subscribers", value: mediaKitNumber(r.subscribers) },
  ].filter(Boolean);

  const trackContact = (location) => {
    if (window.track) window.track("media_kit_contact_click", { location });
  };
  const link = (route, label) => (
    <a className="hp-inline" href={`/${route}`} onClick={(e) => { e.preventDefault(); go(route); }}>{label}</a>
  );

  return (
    <div className="page hp-mediakit">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Advertise", route: "advertise" }, { label: "Media kit" }]}
        className="fj-head fj-topo"
        eyebrow="MEDIA KIT"
        title="Who reads The Talus Field, and how to reach them."
        intro="The Talus Field is an independent Yosemite journal and field guide, written by a naturalist who lives at the park's western edge. Its readers are planning a trip. This page sets out who they are, how they find it, when they come, and the placements open to operators who would send a friend to their own business."
        actions={
          <React.Fragment>
            <HomeLink go={go} location="media_kit_head" className="hp-button" href="#mk-placements">Placements and rates <span>↓</span></HomeLink>
            <HomeLink go={go} location="media_kit_head" className="hp-link" href="#mk-book">How to book ↓</HomeLink>
          </React.Fragment>
        }
        aside={
          <FjCard
            eyebrow="THE KIT, IN FOUR LINES"
            stamp={<>Every paid<br />placement<br />labeled</>}
            rows={[
              { label: "Readers", value: "Yosemite trip planners" },
              { label: "Formats", value: "Directory listings, the Sunday letter" },
              { label: "Reviewed", value: "Before it goes live" },
              { label: "Rate", value: "From $300 a year" },
            ]}
          />
        }
      />

      {/* Who reads. Described from what the site publishes, not from a
          demographic survey it has never run. */}
      <section className="hp-wrap hp-section hp-mediakit__section" aria-labelledby="mk-readers">
        <HpHeading id="mk-readers" eyebrow="01 / THE READER" title="Who reads" />
        <div className="hp-mediakit__cols">
          <p className="hp-sub">
            People planning a Yosemite trip, most of them before they have booked it. The catalog is built around the decisions a visit turns on: where to sleep inside the park or in a gateway town, how to get in without a reservation, which permits and lotteries to enter, which hikes fit the days and the legs available, and what the park will be doing the week they arrive.
          </p>
          <p className="hp-sub">
            The site does not survey its readers and publishes no demographics. What it can say is what they come for. First-time visitors read the planning guides and the start-here pages; returning visitors read the trail guides, the high country and the seasonal pages; families, travelers with dogs, visitors from abroad and readers without a car each have their own guides. Every one of them is reading with dates in mind.
          </p>
        </div>
        <ul className="hp-mediakit__intents">
          <li><b>Planning</b><span>Lodging, gateway towns, reservations, getting there, cost.</span></li>
          <li><b>Hikes and permits</b><span>Day hikes, Half Dome, wilderness permits, backpacking.</span></li>
          <li><b>Season</b><span>Fall color, the firefall, waterfalls, snow, the Tioga Road opening.</span></li>
          <li><b>The park now</b><span>Conditions, road alerts, webcams, entrance waits, the Park Bulletin.</span></li>
        </ul>
      </section>

      {/* Reach. Only the owner's figures; see MEDIA_KIT_REACH. */}
      <section className="hp-wrap hp-section hp-mediakit__section" aria-labelledby="mk-reach">
        <HpHeading id="mk-reach" eyebrow="02 / REACH" title="Reach" />
        <p className="hp-sub hp-mediakit__window">Google Search, {r.window}.</p>
        {stats.length > 0 ? (
          <dl className="hp-mediakit__stats">
            {stats.map((s) => (
              <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
            ))}
          </dl>
        ) : (
          <p className="hp-sub">Current search and list figures are sent with every reply to an inquiry.</p>
        )}
        {r.topPages.length > 0 && (
          <>
            <h3 className="hp-mediakit__h3">The pages search sent the most readers to</h3>
            <ol className="hp-mediakit__top">
              {r.topPages.map((p) => (
                <li key={p.href}>
                  <HomeLink go={go} location="media_kit_reach" href={p.href}>{p.title}</HomeLink>
                  {p.clicks != null && <span>{mediaKitNumber(p.clicks)} clicks</span>}
                </li>
              ))}
            </ol>
          </>
        )}
        <h3 className="hp-mediakit__h3">Sunday Field Notes</h3>
        <p className="hp-sub">
          The weekly letter goes out on Sunday at 9 AM Pacific: what the park is doing that week and why, set beside what its naturalists wrote down in the same weeks a century ago. It is free, single opt-in, and read by people who asked for it. {link("newsletter", "Read about the letter")}.
        </p>
      </section>

      {/* The Field Guide. Part of the audience, never part of the inventory. */}
      <section className="hp-wrap hp-section hp-mediakit__section" aria-labelledby="mk-guide">
        <HpHeading id="mk-guide" eyebrow="03 / THE APP" title="The Field Guide" />
        <div className="hp-mediakit__cols">
          <p className="hp-sub">
            The journal's paid companion is an offline field guide at <a className="hp-inline" href="https://guide.thetalusfieldjournal.com" target="_blank" rel="noopener noreferrer">guide.thetalusfieldjournal.com</a>: the park's stops, day hikes and lesser-known places with GPS coordinates and honest time budgets, a trip planner that builds each day in driving order, and park programs on the dates of a trip. Its buyers have committed to a visit and paid to plan it well.
          </p>
          <p className="hp-sub">
            The Field Guide carries no advertising and sells no placements. It is described here because its readers are the same readers, and because a business in the directory sits one link from a guide they trust. Lodging operators who want the guide for their own guests can buy it in packs: {link("partners", "group codes")}. The public product page is {link("guide", "the Field Guide")}.
          </p>
        </div>
      </section>

      {/* Placements. The rates restate /advertise exactly. */}
      <section className="hp-wrap hp-section hp-mediakit__section" id="mk-placements" tabIndex={-1} aria-labelledby="mk-placements-h">
        <HpHeading id="mk-placements-h" eyebrow="04 / FORMATS" title="Placements and formats" />
        <div className="hp-mediakit__tiers">
          {MEDIA_KIT_TIERS.map((t) => (
            <div key={t.name} className={["places-pitch__tier", t.featured ? "places-pitch__tier--featured" : null].filter(Boolean).join(" ")}>
              <div className="places-pitch__tier-eyebrow">{t.name}</div>
              <div className="places-pitch__tier-summary">{t.summary}</div>
              <div className="places-pitch__tier-meta">{t.term} · {t.rate}</div>
            </div>
          ))}
        </div>
        <p className="hp-sub hp-mediakit__note">
          Every listing carries the business name, its area, a short editorial blurb, a direct outbound link to the booking page and a place in the relevant directory category, for twelve months and renewable. The full terms are on {link("advertise", "the listings page")}.
        </p>
      </section>

      {/* When planners search. Restates the site's own event pages. */}
      <section className="hp-wrap hp-section hp-mediakit__section" aria-labelledby="mk-season">
        <HpHeading id="mk-season" eyebrow="05 / TIMING" title="When planners are searching" />
        <p className="hp-sub hp-mediakit__lede">
          A Yosemite trip is planned around windows the park sets, and readers arrive ahead of each one. A twelve-month listing sits through all of them.
        </p>
        <ol className="hp-mediakit__calendar">
          <li><b>February</b><span>The firefall on Horsetail Fall. The dates are fixed by the sun, and Valley rooms and the nearest gateway towns fill around them. {link("firefall", "The Firefall")}</span></li>
          <li><b>March to April</b><span>The Half Dome preseason lottery takes applications through March, with results in mid-April; summer plans are made on the result. {link("half-dome-lottery", "The Half Dome lottery")}</span></li>
          <li><b>Late spring</b><span>The Tioga Road opening, announced only days ahead, sends readers to the high country and the east side. {link("tioga-opening", "The Tioga Road opening")}</span></li>
          <li><b>Summer</b><span>The peak season: daily Half Dome lotteries, wilderness permits, campground release mornings, and the lodging decision under the most pressure. {link("dates", "The dates that matter")}</span></li>
          <li><b>Autumn</b><span>Fall color, from the Tioga Road aspens in late September to the Valley's peak in late October; quieter trails and shoulder-season rooms. {link("fall-color", "Fall color")}</span></li>
          <li><b>Winter</b><span>Snow in the Valley, the holiday events and the ski area, and the readers already planning the next spring and summer.</span></li>
        </ol>
      </section>

      {/* Sample placements: the shape of a listing, not a real operator. */}
      <section className="hp-wrap hp-section hp-mediakit__section" aria-labelledby="mk-samples">
        <HpHeading id="mk-samples" eyebrow="06 / SAMPLES" title="Sample placements" />
        <p className="hp-sub hp-mediakit__lede">How the two listing tiers read in the directory. The names and copy below are placeholders, not operators.</p>
        <div className="hp-mediakit__samples" aria-label="Sample listings">
          <article className="hp-mediakit__sample">
            <p className="hp-eyebrow">LODGING · GATEWAY TOWN<span className="hp-mediakit__label">Paid listing</span></p>
            <h3>Your business name</h3>
            <p>A short editorial blurb, written by the editor in the site's voice: what the place is, who it suits, and the one thing a reader should know before booking.</p>
            <b>Book direct ↗</b>
            <p className="hp-mediakit__tierline">Standard listing</p>
          </article>
          <article className="hp-mediakit__sample hp-mediakit__sample--featured">
            <span className="hp-mediakit__photo" aria-hidden="true">Your photo</span>
            <p className="hp-eyebrow">GUIDES &amp; INSTRUCTION · YOSEMITE VALLEY<span className="hp-mediakit__label">Paid listing</span></p>
            <h3>Your business name</h3>
            <p>The same editorial blurb, followed by an extended description: the programs or rooms, the season, how to reach the operator, and what sets the business apart. Listed first within its category.</p>
            <b>Book direct ↗</b>
            <p className="hp-mediakit__tierline">Featured listing</p>
          </article>
        </div>
      </section>

      {/* Standards. The language of /advertise and /affiliate, restated. */}
      <section className="hp-wrap hp-section hp-mediakit__section fj-split" aria-labelledby="mk-standards">
        <div>
          <HpHeading id="mk-standards" eyebrow="07 / STANDARDS" title="Editorial standards and disclosure" />
        </div>
        <div className="hp-mediakit__copy">
          <p className="hp-sub">
            Paid placements are clearly labeled wherever they appear, and a paid placement does not change the editorial blurb. An operator does not get a more flattering description by paying. If a listing ever drops below the standard, it comes off the directory.
          </p>
          <ul className="hp-mediakit__rules">
            <li>No businesses the editor would talk a friend out of using.</li>
            <li>No hidden sponsorship. Every paid placement is labeled.</li>
            <li>No payment overriding the editorial tone of a blurb.</li>
            <li>No placements from operators with active permit or safety violations.</li>
          </ul>
          <p className="hp-sub">
            The same rule governs the site's affiliate links: no program's catalog shapes a recommendation. The full policy is on {link("affiliate", "the disclosure page")}.
          </p>
        </div>
      </section>

      {/* How to book: the /advertise contact path. */}
      <section className="hp-wrap hp-section hp-mediakit__section" id="mk-book" tabIndex={-1} aria-labelledby="mk-book-h">
        <HpHeading id="mk-book-h" eyebrow="08 / BOOKING" title="How to book" />
        <ol className="hp-mediakit__steps">
          <li><b>Write in.</b><span>Send the business name, its area, the category, and the placement you have in mind to <a className="hp-inline" href="mailto:cory@thetalusfieldjournal.com" onClick={() => trackContact("media_kit_email")}>cory@thetalusfieldjournal.com</a>, or use <a className="hp-inline" href="/contact" onClick={(e) => { e.preventDefault(); trackContact("media_kit_contact_form"); go("contact"); }}>the contact form</a>.</span></li>
          <li><b>Review.</b><span>Every paid placement is reviewed before it goes live. The editor writes the blurb.</span></li>
          <li><b>Placement.</b><span>The listing runs for twelve months and is renewable. Sunday letter sponsorships and custom packages are scheduled by arrangement.</span></li>
        </ol>
        <p className="hp-mediakit__cta">
          <a className="hp-button" href="/contact" onClick={(e) => { e.preventDefault(); trackContact("media_kit_book"); go("contact"); }}>Inquire about a placement</a>
        </p>
      </section>

      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Sunday Field Notes"
        heading="Sunday Field Notes"
        blurb="A letter from inside Yosemite on Sundays: what the park is doing this week and why, set beside what its naturalists wrote down in the same weeks a century ago."
      />
    </div>
  );
}

window.MediaKitPage = MediaKitPage;
