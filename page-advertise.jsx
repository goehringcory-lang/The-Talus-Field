/* global React, HpPageHead, HpHeading, HpLetter, FjCard, HomeLink */

function AdvertisePage({ go }) {
  const toContact = (e) => { e.preventDefault(); go("contact"); };
  return (
    <div className="page hp-advertise">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Advertise" }]}
        className="fj-head fj-topo"
        eyebrow="FOR OPERATORS"
        title="List your business on The Talus Field."
        intro="The Talus Field is read by people planning a Yosemite trip: the readers about to book a room, hire a guide or buy a tour. If you run a lodge, an inn, a guiding service, an outfitter, a transportation company or another Yosemite-adjacent business, a listing in The Directory puts you in front of that reader at the moment they decide."
        actions={
          <React.Fragment>
            <a className="hp-button" href="/contact" onClick={toContact}>Inquire about a listing</a>
            <HomeLink go={go} location="advertise" className="hp-link" href="/media-kit">Read the media kit ↗</HomeLink>
          </React.Fragment>
        }
        aside={
          <FjCard
            eyebrow="A LISTING, IN FOUR LINES"
            stamp={<>Every paid<br />placement<br />labeled</>}
            rows={[
              { label: "Placement", value: "Twelve months, renewable" },
              { label: "Tiers", value: "Standard and featured" },
              { label: "Reviewed", value: "Before it goes live" },
              { label: "Rate", value: "From $300 a year" },
            ]}
          />
        }
      />

      {/* The pitch: what a listing is, what it costs, what disqualifies one. */}
      <section className="hp-wrap hp-section">
        <div className="places-pitch">
          <div className="places-pitch__grid">
            <div>
              <h2>What a listing includes</h2>
              <ul>
                <li>Your business name, area, and a short editorial blurb</li>
                <li>A direct outbound link to your booking page</li>
                <li>A place in the relevant category (Lodging, Guides &amp; instruction, or a category added later)</li>
                <li>For featured listings, a photo, a logo and an extended description</li>
                <li>Twelve months of placement, renewable</li>
              </ul>
            </div>
            <div>
              <h2>What I won't do</h2>
              <ul>
                <li>List businesses I'd talk a friend out of using</li>
                <li>Hide that a listing is sponsored. Every paid placement is labeled</li>
                <li>Let payment override the editorial tone of the blurb</li>
                <li>Take placements from operators with active permit or safety violations</li>
              </ul>
            </div>
          </div>

          <div className="places-pitch__tiers">
            <div className="places-pitch__tier">
              <div className="places-pitch__tier-eyebrow">Standard listing</div>
              <div className="places-pitch__tier-summary">Name, area, blurb, outbound link in the relevant category.</div>
              <div className="places-pitch__tier-meta">Twelve months · $300 a year</div>
            </div>
            <div className="places-pitch__tier places-pitch__tier--featured">
              <div className="places-pitch__tier-eyebrow">Featured listing</div>
              <div className="places-pitch__tier-summary">Standard, plus a photo, an extended description, and priority position within the category.</div>
              <div className="places-pitch__tier-meta">Twelve months · $600 a year</div>
            </div>
          </div>

          <a className="places-pitch__cta" href="/contact" onClick={toContact}>Inquire about a listing →</a>

          <p className="places-pitch__fineprint">
            Sponsorship of the Sunday letter and custom packages are priced on inquiry. Every paid placement is reviewed before it goes live, and a listing can be removed at the editor's discretion if the business stops meeting the standard. The <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>full advertising and affiliate policy</a> is on the disclosure page; readership, reach and timing are in <HomeLink go={go} location="advertise" href="/media-kit">the media kit</HomeLink>.
          </p>
        </div>
      </section>

      {/* Why it works. Short editorial */}
      <section className="hp-wrap hp-section hp-advertise__why fj-split">
        <div>
          <HpHeading title="Why a directory placement works" />
          {/* The first paragraph's comparison, set as a ledger. It restates
              the copy beside it, so assistive tech skips it. */}
          <div className="fj-ledger" aria-hidden="true">
            <div><span>A search-engine ad</span><b>A colder audience, at many times the cost</b></div>
            <div><span>A social post</span><b>Larger, and less qualified</b></div>
            <div className="is-ours"><span>The directory</span><b>A moment of decision</b></div>
          </div>
        </div>
        <div className="hp-advertise__copy">
          <p className="hp-sub">
            Readers here are not browsing. They have decided to come to the park and are working out how to do it well, which means a place to sleep, a guide to hire, a class to take, a route to drive. A search-engine ad reaches a colder audience at a multiple of what a year here costs. A social post reaches a larger audience that is less qualified and mostly does not convert.
          </p>
          <p className="hp-sub">
            A listing appears at the moment of decision, on a site the reader already trusts for straight answers. That is the placement.
          </p>
          <p className="hp-sub">
            If your business fits, and you would send a friend to it, write to <a className="hp-inline" href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a> or use <a className="hp-inline" href="/contact" onClick={toContact}>the contact form</a>. I read every inquiry.
          </p>
        </div>
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

window.AdvertisePage = AdvertisePage;
