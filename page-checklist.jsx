/* global React, HpPageHead, HpGuideBand, HpLetter */

function ChecklistPage({ go }) {
  // The design system's faces, as style objects: the section label is the
  // eyebrow, the title a serif h2, each line a 14px row with its checkbox in
  // the accent.
  const sectionStyle = {
    marginBottom: 40,
    paddingBottom: 24,
    borderBottom: "1px solid var(--hp-rule)",
  };
  const sectionLabel = {
    fontFamily: "var(--sans)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: "1.7px",
    fontWeight: 600,
    color: "var(--hp-accent)",
    marginBottom: 12,
  };
  const sectionTitle = {
    fontFamily: "var(--serif)",
    fontSize: 38,
    fontWeight: 400,
    lineHeight: 1.04,
    letterSpacing: "-1.1px",
    marginBottom: 18,
  };
  const item = {
    display: "block",
    fontFamily: "var(--sans)",
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--hp-ink)",
    padding: "9px 0",
    borderTop: "1px solid var(--hp-rule)",
    cursor: "pointer",
  };
  const cb = {
    marginRight: 12,
    transform: "translateY(2px)",
    accentColor: "var(--hp-accent)",
  };
  const note = {
    fontFamily: "var(--sans)",
    fontSize: 12,
    color: "var(--hp-muted)",
    lineHeight: 1.7,
    marginTop: 4,
    marginLeft: 28,
  };

  const A = ({ r, children }) => (
    <a
      href={r.startsWith("a:") ? `/articles/${r.slice(2)}` : `/${r}`}
      onClick={(e) => { e.preventDefault(); go(r); }}
    >
      {children}
    </a>
  );

  return (
    <div className="page page-checklist">
      <style>{`
        @media print {
          header, footer, .hp-navigation, .hp-checklist__tip, .hp-product, .hp-letter, .nlbox { display: none !important; }
          .page-checklist { padding: 0 !important; }
          .page-checklist .hp-pagehead { padding: 0 !important; margin-bottom: 16pt !important; }
          .page-checklist h1 { font-size: 22pt !important; }
          .page-checklist .checklist-section { page-break-inside: avoid; }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `}</style>

      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "First-week checklist" }]}
        eyebrow="THE FIRST-WEEK CHECKLIST"
        title="Yosemite, in one printable page."
        intro="A condensed action list for planning a Yosemite trip in 2026, drawn from the full archive of The Talus Field. Print it, check things off, take it in the car. The longer essays behind each line are linked throughout, and collected at the bottom."
      >
        <p className="hp-byline hp-checklist__tip">
          Tip: <strong>Cmd+P</strong> (or Ctrl+P) for a clean print version.
        </p>
      </HpPageHead>

      <div className="hp-wrap hp-reading">
        <div className="hp-reading__column">

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>I · Window of arrival</div>
          <h2 style={sectionTitle}>When to come</h2>
          <label style={item}><input type="checkbox" style={cb} />Late May to early June for <A r="a:mist-trail-the-real-guide">peak waterfalls</A> and <A r="a:memorial-day-skip-the-valley-go-high-2026">high country</A> still snowy.</label>
          <label style={item}><input type="checkbox" style={cb} />September to October for low crowds and golden light.</label>
          <label style={item}><input type="checkbox" style={cb} />Avoid July and August weekends. Heat plus crowds plus possible smoke.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:yosemite-during-smoke-season">Smoke season</A> runs roughly July through October. Build a contingency.</label>
          <label style={item}><input type="checkbox" style={cb} />2026 note: <A r="a:yosemite-without-reservations-2026">no entrance reservation is required</A>. A standard pass is all you need.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>II · What to book in advance</div>
          <h2 style={sectionTitle}>The non-flexible reservations</h2>
          <label style={item}><input type="checkbox" style={cb} />In-park lodging: 6 to 12 months ahead (Ahwahnee, Valley Lodge, Curry Village). <A r="stay">Every option compared</A>.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:yosemite-gateway-towns-compared">Gateway-town lodging</A>: 1 to 3 months ahead for summer dates.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="half-dome-lottery">Half Dome preseason lottery</A>: apply March 1 to 31 on Recreation.gov.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:tioga-road-opening-weekend-2026">Tuolumne Meadows</A> campground: opens on Recreation.gov in advance; books fast.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:yosemite-wilderness-permits-guide">Wilderness permits</A> for overnight trips: apply 24 weeks ahead via Recreation.gov.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>III · What not to book</div>
          <h2 style={sectionTitle}>Common mistakes</h2>
          <label style={item}><input type="checkbox" style={cb} />Don't lock a <A r="a:first-time-yosemite-overwhelm">rigid day-by-day itinerary</A>. Weather and <A r="a:yosemite-during-smoke-season">smoke</A> flex everything.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't pay third-party sites for "Yosemite passes." <A r="a:yosemite-without-reservations-2026">Pay $35 at the gate</A> or use America the Beautiful. (International visitors: a $100 per-person surcharge applies in 2026.)</label>
          <label style={item}><input type="checkbox" style={cb} />Don't book Curry Village if you want quiet sleep. It's loud.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't book <A r="a:yosemite-gateway-towns-compared">Oakhurst</A> if you're focused on the Valley. The drive is the longest of any gateway.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>IV · Gateway choice</div>
          <h2 style={sectionTitle}>Pick your base</h2>
          <label style={item}><input type="checkbox" style={cb} /><strong><A r="a:yosemite-gateway-towns-compared">El Portal</A></strong>: closest to the Valley (25-30 min). Limited dining, year-round access.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong><A r="a:yosemite-gateway-towns-compared">Mariposa</A></strong>: 45 min from the Valley. Full service, best first-timer pick.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong><A r="a:yosemite-gateway-towns-compared">Oakhurst</A></strong>: closest to Mariposa Grove. Long drive to the Valley.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong><A r="a:yosemite-gateway-towns-compared">Groveland</A></strong>: Bay Area approach, near <A r="a:hetch-hetchy-the-other-yosemite-valley">Hetch Hetchy</A>.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong><A r="a:yosemite-gateway-towns-compared">Lee Vining</A></strong>: east side; <A r="a:tioga-road-opening-weekend-2026">Tuolumne and Mono Lake</A>. Summer only.</label>
          <label style={item}><input type="checkbox" style={cb} />Checked availability on your actual dates: <A r="stay">the lodging board</A> has a live search per town.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>V · What to pack</div>
          <h2 style={sectionTitle}>The car kit</h2>
          <label style={item}><input type="checkbox" style={cb} />Day pack with 2 liters water plus a bottle for the trail.</label>
          <label style={item}><input type="checkbox" style={cb} />Hiking shoes with real tread. Sneakers slip on <A r="a:mist-trail-the-real-guide">Mist Trail</A> granite.</label>
          <label style={item}><input type="checkbox" style={cb} />Layers. The <A r="a:memorial-day-skip-the-valley-go-high-2026">daily temperature swing</A> is 30 to 40 degrees.</label>
          <label style={item}><input type="checkbox" style={cb} />Headlamp plus a spare battery.</label>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:pack-your-car-for-yosemite">Tire chains</A>, November through April. Practice once at home.</label>
          <label style={item}><input type="checkbox" style={cb} />Cooler. <A r="a:where-to-eat-yosemite">Valley food</A> is limited and overpriced.</label>
          <label style={item}><input type="checkbox" style={cb} />5 gallons of water (not for drinking, for radiators, rinsing, the unexpected).</label>
          <label style={item}><input type="checkbox" style={cb} />Paper park map (cell service dies past Crane Flat).</label>
          <label style={item}><input type="checkbox" style={cb} />Sunscreen and a wide-brim hat. UV at elevation is brutal.</label>
          <label style={item}><input type="checkbox" style={cb} />A credit or debit card for the gate (the entrance stations are cashless) or your <A r="a:yosemite-without-reservations-2026">America the Beautiful pass</A>.</label>
          <p style={note}>Bear spray is not permitted in Yosemite. Don't bring it.</p>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>VI · What to skip</div>
          <h2 style={sectionTitle}>Don't try to do too much</h2>
          <label style={item}><input type="checkbox" style={cb} />Don't try to "do" Tunnel View, <A r="a:glacier-point-road-open-2026">Glacier Point</A>, <A r="a:giant-sequoias-fire-adaptation">Mariposa Grove</A>, and <A r="a:tioga-road-opening-weekend-2026">Tuolumne</A> in one day. Pick two.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't drive Mariposa Grove to Tuolumne <A r="a:yosemite-in-one-or-two-days">in a single day</A> if anyone in your group fatigues.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't hit <A r="a:yosemite-for-non-hikers">Lower Yosemite Fall</A> between 11 AM and 3 PM. Come early or after 5 PM.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't expect to swim in the Merced before mid-July. <A r="a:mist-trail-the-real-guide">The current is dangerous</A>.</label>
        </section>

        <section className="checklist-section" style={{ ...sectionStyle, borderBottom: "1px solid var(--hp-ink)" }}>
          <div style={sectionLabel}>VII · The non-negotiables</div>
          <h2 style={sectionTitle}>If you remember nothing else</h2>
          <label style={item}><input type="checkbox" style={cb} /><A r="a:yosemite-without-reservations-2026">Be in the park by 6:30 AM</A> on any peak day. The day's quality is decided before 9.</label>
          <label style={item}><input type="checkbox" style={cb} />Every scented item in the <A r="a:bears-spring-emergence">bear box</A> when you leave the car. Trunk is not bear-proof.</label>
          <label style={item}><input type="checkbox" style={cb} />Print the <A r="half-dome-lottery">Half Dome permit</A> if you have one. No cell service at the subdome.</label>
          <label style={item}><input type="checkbox" style={cb} />Have a Plan B for every major stop. Parking, weather, and <A r="a:yosemite-during-smoke-season">smoke</A> will kill at least one Plan A.</label>
          <label style={item}><input type="checkbox" style={cb} />Pack out everything you bring in. <A r="a:yosemite-needs-a-reservation-system">Yosemite is loved enough already</A>.</label>
        </section>

        {/* Source links for the longer essays */}
        <section style={{ marginTop: 56, marginBottom: 56 }}>
          <p className="hp-eyebrow">THE LONGER ESSAYS</p>
          <p className="hp-sub">
            Each line on this checklist is condensed from a longer piece. If you want the reasoning behind any of them:
          </p>
          <ul className="relrail hp-checklist__essays">
            <li><a href="/articles/first-time-yosemite-overwhelm" onClick={(e) => { e.preventDefault(); go("a:first-time-yosemite-overwhelm"); }}>If it's your first time in Yosemite, read this before you book anything</a></li>
            <li><a href="/articles/yosemite-without-reservations-2026" onClick={(e) => { e.preventDefault(); go("a:yosemite-without-reservations-2026"); }}>Yosemite without reservations in 2026</a></li>
            <li><a href="/articles/yosemite-gateway-towns-compared" onClick={(e) => { e.preventDefault(); go("a:yosemite-gateway-towns-compared"); }}>Yosemite gateway towns compared</a></li>
            <li><a href="/articles/pack-your-car-for-yosemite" onClick={(e) => { e.preventDefault(); go("a:pack-your-car-for-yosemite"); }}>How to pack your car for a Yosemite trip</a></li>
            <li><a href="/half-dome-lottery" onClick={(e) => { e.preventDefault(); go("half-dome-lottery"); }}>The Half Dome lottery: calendar, odds, and strategy</a></li>
            <li><a href="/articles/yosemite-during-smoke-season" onClick={(e) => { e.preventDefault(); go("a:yosemite-during-smoke-season"); }}>Yosemite during smoke season</a></li>
            <li><a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>The full Yosemite Planning Guide</a></li>
          </ul>
        </section>

        </div>
      </div>

      {/* The purchase ask: checklist readers have dates and are packing,
          the highest purchase intent on the site. */}
      <HpGuideBand
        go={go}
        location="checklist"
        title="The checklist rides along."
        intro="The Field Guide app packs a night-before checklist next to 50-plus stops with parking and timing notes, offline maps, and a trip planner. Everything this page prepares you for, on your phone, with no signal required."
        sample
      />
      {/* Newsletter capture */}
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Want updates through the season?"
        heading="Want updates through the season?"
        blurb="One Yosemite email a week, when there is something to say. Free. Subscribers hear about updates to this checklist first."
        location="checklist"
        tag="checklist"
      />
    </div>
  );
}

window.ChecklistPage = ChecklistPage;
