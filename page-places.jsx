/* global React */

function PlacesPage({ go }) {
  const regions = [
    {
      key: "valley",
      name: "Yosemite Valley",
      note: "The headline mile. Granite walls, the river, the falls that everyone came for.",
      image: "img/tunnel-view.jpg",
    },
    {
      key: "glacier-mariposa",
      name: "Glacier Point & Mariposa",
      note: "The south rim and the sequoias. The view down into the Valley, and the largest trees on earth.",
      image: "img/half-dome.jpg",
    },
    {
      key: "tuolumne",
      name: "Tuolumne Meadows",
      note: "Above 8,000 feet, summer only. Domes, lakes, and the Sierra crest.",
      image: "img/tuolumne-meadows.jpg",
    },
  ];

  const categories = [
    {
      name: "Lodging",
      note: "Lodges, inns, and small hotels inside the park or within an hour of a gate. Family-run preferred.",
    },
    {
      name: "Guides & instruction",
      note: "Climbing schools, hiking guides, naturalist programs. Permitted, insured, and not running on charisma alone.",
    },
    {
      name: "Outfitters",
      note: "Gear rental and resupply for travelers who flew in or forgot the one important thing.",
    },
    {
      name: "Tours & transportation",
      note: "Drivers, shuttles, and scheduled tours that move readers between the Valley, the high country, and the gateway towns.",
    },
    {
      name: "Vacation rentals",
      note: "Independently operated houses and cabins in the gateway towns. Owners who answer their own phone.",
    },
  ];

  return (
    <div className="page">
      {/* Page head */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Directory</div>
          <h1>A short list, mostly empty.</h1>
          <p className="page-head__dek">
            This page lists businesses I would recommend to a friend visiting Yosemite. At the moment it lists one organization, and that organization is not a business. The rest of the slots are open. Most operators who inquire will not fill them.
          </p>
        </div>
      </section>

      {/* Region triptych. Replaces the old NPS map. */}
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="region-triptych">
          {regions.map((r) => (
            <figure key={r.key} className="region-tile">
              <div className="region-tile__frame">
                <img
                  className="region-tile__img"
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <figcaption>
                <div className="region-tile__eyebrow">Region</div>
                <div className="region-tile__name">{r.name}</div>
                <div className="region-tile__note">{r.note}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* The standard. Editorial body. */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 72 }}>
        <h2 className="places-standard__heading">The standard.</h2>
        <p className="places-standard__body">
          Twenty seasons in this park have left me with a short list of operators I would put a friend in front of, and a much longer list of ones I would not. The Directory is the short list, written down. I am not in a hurry to fill it. Every name that appears here will be one I have used, or one whose work I have watched closely enough to vouch for. Readers should treat the absence of a listing as neither endorsement nor warning. It means I have not vouched yet.
        </p>
        <p className="places-standard__body">
          A directory of forty lodges is not a directory, it is a phone book. This one will stay small.
        </p>
      </section>

      {/* Yosemite Conservancy. The single real entry. */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 64 }}>
        <div className="conservancy">
          <div className="conservancy__eyebrow">Currently listed</div>
          <h2 className="conservancy__name">Yosemite Conservancy</h2>
          <p className="conservancy__body">
            The park's official nonprofit partner. They fund research, restoration, and other park projects, and run a calendar of naturalist-led programs in multi-day Yosemite field school format taught by expert naturalists. They are not a commercial operator and they are not paying for placement. I recommend them without reservation.
          </p>
          <a
            className="conservancy__link"
            href="https://yosemite.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            yosemite.org ↗
          </a>
        </div>
      </section>

      {/* Categories index. Inclusion criteria, not empty inventory. */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>Categories</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>{categories.length} sections, building</div>
        </div>
        <ul className="dir-cats">
          {categories.map((c) => (
            <li key={c.name} className="dir-cats__item">
              <div className="dir-cats__name">{c.name}</div>
              <div className="dir-cats__note">{c.note}</div>
              <div className="dir-cats__status">Accepting inquiries</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Operator CTA. Single low-key paragraph. */}
      <section className="wrap wrap--narrow" style={{ paddingTop: 72, paddingBottom: 96 }}>
        <p className="dir-cta__body">
          If you operate a Yosemite-adjacent business and you believe you meet the standard above, the listing product, what a placement includes, and what disqualifies an applicant are described on a separate page. Most inquiries are declined. The ones that are not tend to come from operators who already know why they belong here.
        </p>
        <a
          className="dir-cta__link"
          href="/advertise"
          onClick={(e) => { e.preventDefault(); go("advertise"); }}
        >
          Read about a listing →
        </a>
      </section>
    </div>
  );
}

window.PlacesPage = PlacesPage;
