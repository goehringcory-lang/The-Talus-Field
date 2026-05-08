/* global React, Placeholder, MotifMountains, MapLightbox, NewsletterInline */

function PlacesPage({ go }) {
  const recs = window.KIT.recommendations;
  const [mapOpen, setMapOpen] = React.useState(false);

  return (
    <div className="page">
      {/* Page head */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">Places & People</div>
          <h1>Where to stay and who to hire.</h1>
          <p className="page-head__dek">
            A small, curated directory of lodging, outfitters, and guiding services in and around Yosemite. Drawn from twenty seasons of working in and around the park. The standard for inclusion is the same one I'd use sending a friend.
          </p>
        </div>
      </section>

      {/* Park map */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 48 }}>
        <button
          type="button"
          className="map-trigger"
          onClick={() => setMapOpen(true)}
          aria-label="Open Yosemite map in expanded viewer"
        >
          <Placeholder
            caption="Yosemite National Park"
            image="img/yosemite-park-map.jpg"
            tag="MAP"
            size="lg"
            style={{ aspectRatio: "686 / 849" }}
            motif={<MotifMountains />}
            credit="Map: National Park Service (public domain)"
          />
        </button>
      </section>

      {mapOpen && (
        <MapLightbox
          src="img/yosemite-park-map.jpg"
          alt="Yosemite National Park map"
          caption="Yosemite National Park · NPS"
          onClose={() => setMapOpen(false)}
        />
      )}

      {/* Lodging */}
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="section-head">
          <h2>Lodging</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>{recs.lodging.length} listings</div>
        </div>
        <div className="kit__rec-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            <ul className="kit__rec">
              {recs.lodging.map((r, i) => (
                <li key={i}>
                  <div className="kit__rec-name">{r.name}</div>
                  <div className="kit__rec-area">{r.area}</div>
                  <div className="kit__rec-note">{r.note}</div>
                  <a className="kit__rec-link" href={r.aff} target="_blank" rel="noopener nofollow sponsored noreferrer">View site ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Guides & instruction */}
      <section className="wrap" style={{ paddingTop: 64 }}>
        <div className="section-head">
          <h2>Guides &amp; instruction</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>{recs.guides.length} listings</div>
        </div>
        <div className="kit__rec-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            <ul className="kit__rec">
              {recs.guides.map((r, i) => (
                <li key={i}>
                  <div className="kit__rec-name">{r.name}</div>
                  <div className="kit__rec-area">{r.area}</div>
                  <div className="kit__rec-note">{r.note}</div>
                  <a className="kit__rec-link" href={r.aff} target="_blank" rel="noopener nofollow sponsored noreferrer">View site ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quiet sponsorship disclosure */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 64 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>
          A small number of listings are paid placements from vetted operators and are labeled where they appear. The editorial standard is the same either way. See the <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>affiliate disclosure</a> for the full policy.
        </p>
      </section>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <NewsletterInline
          heading="Sunday Field Notes"
          blurb="One letter a week. Subscribers see new directory additions and seasonal updates first."
        />
      </div>
    </div>
  );
}

window.PlacesPage = PlacesPage;
