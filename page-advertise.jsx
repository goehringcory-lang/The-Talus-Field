/* global React, NewsletterInline */

function AdvertisePage({ go }) {
  return (
    <div className="page">
      {/* Page head */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">For Operators</div>
          <h1>List your business on The Talus Field.</h1>
          <p className="page-head__dek">
            The Talus Field is read by people actively planning a Yosemite trip. The audience that's about to book lodging, hire a guide, or buy a tour. If you operate a lodge, an inn, a guiding service, an outfitter, a transportation company, or any other Yosemite-adjacent business, a placement in The Directory puts you in front of the right reader at the right moment.
          </p>
        </div>
      </section>

      {/* The pitch */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 64 }}>
        <div className="places-pitch">
          <div className="places-pitch__grid">
            <div>
              <h3>What a listing includes</h3>
              <ul>
                <li>Your business name, area, and a short editorial blurb</li>
                <li>A direct outbound link to your booking page</li>
                <li>Inclusion in the relevant category (Lodging, Guides &amp; instruction, or a future category we add)</li>
                <li>Optional photo, logo, and an extended description for featured listings</li>
                <li>Twelve months of placement, renewable</li>
              </ul>
            </div>
            <div>
              <h3>What I won't do</h3>
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
              <div className="places-pitch__tier-meta">Twelve months · Inquire for current rate</div>
            </div>
            <div className="places-pitch__tier places-pitch__tier--featured">
              <div className="places-pitch__tier-eyebrow">Featured listing</div>
              <div className="places-pitch__tier-summary">Standard, plus a photo, an extended description, and priority position within the category.</div>
              <div className="places-pitch__tier-meta">Twelve months · Inquire for current rate</div>
            </div>
          </div>

          <a
            className="places-pitch__cta"
            href="/contact"
            onClick={(e) => { e.preventDefault(); go("contact"); }}
          >Inquire about a listing →</a>

          <p className="places-pitch__fineprint">
            All paid placements are reviewed before they go live. Listings can be removed at the editor's discretion if a business stops meeting basic standards. The <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>full advertising and affiliate policy</a> is on the disclosure page.
          </p>
        </div>
      </section>

      {/* Why it works. Short editorial */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <h2 style={{ fontFamily: "var(--display)", fontSize: 32, fontWeight: 500, lineHeight: 1.15, margin: "0 0 18px" }}>Why a directory placement works</h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 18 }}>
          The visitors reading The Talus Field are not casual browsers. They've already decided to come to the park. They're working out how to do it well, which means they're looking for a place to sleep, a guide to hire, a class to take, a route to drive. A search-engine ad reaches a colder audience and costs a multiple of what a year of placement here costs. A social post reaches a larger but less qualified audience that mostly will not convert.
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 18 }}>
          The directory shows up in a moment of decision, on a site the reader already trusts to give them straight answers. That's the placement.
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55 }}>
          If you're an operator who fits, and you'd be willing to send a friend to your business, write to <a href="mailto:Goehring.cory@gmail.com">Goehring.cory@gmail.com</a> or use <a href="/contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>the contact form</a>. I read every inquiry.
        </p>
      </section>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingBottom: 96 }}>
        <NewsletterInline
          heading="Sunday Field Notes"
          blurb="A short note on Sundays, when there is something to say."
        />
      </div>
    </div>
  );
}

window.AdvertisePage = AdvertisePage;
