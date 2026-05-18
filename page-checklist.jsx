/* global React, NewsletterInline */

function ChecklistPage({ go }) {
  const sectionStyle = {
    marginBottom: 40,
    paddingBottom: 24,
    borderBottom: "1px solid var(--rule)",
  };
  const sectionLabel = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontWeight: 700,
    color: "var(--moss)",
    marginBottom: 6,
  };
  const sectionTitle = {
    fontFamily: "var(--display)",
    fontSize: 28,
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: "-0.005em",
    marginBottom: 18,
  };
  const item = {
    display: "block",
    fontFamily: "var(--serif)",
    fontSize: 17,
    lineHeight: 1.5,
    color: "var(--ink-1)",
    padding: "8px 0",
    cursor: "pointer",
  };
  const cb = {
    marginRight: 12,
    transform: "translateY(2px)",
    accentColor: "var(--moss)",
  };
  const note = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "var(--ink-2)",
    lineHeight: 1.5,
    marginTop: 4,
    marginLeft: 28,
  };

  return (
    <div className="page page-checklist">
      <style>{`
        @media print {
          header, footer, .tweaks-panel, .page-head__dek + *, .nlbox { display: none !important; }
          .page-checklist { padding: 0 !important; }
          .page-checklist .page-head { padding: 0 !important; margin-bottom: 16pt !important; }
          .page-checklist h1 { font-size: 22pt !important; }
          .page-checklist .checklist-section { page-break-inside: avoid; }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `}</style>

      <div className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The First-Week Checklist</div>
          <h1>Yosemite, in one printable page.</h1>
          <p className="page-head__dek">
            A condensed action list for planning a Yosemite trip in 2026, drawn from the full archive of The Talus Field. Print it, check things off, take it in the car. The longer essays behind each line are linked at the bottom.
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", marginTop: 14 }}>
            Tip: <strong>Cmd+P</strong> (or Ctrl+P) for a clean print version.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 80 }}>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>I · Window of arrival</div>
          <h2 style={sectionTitle}>When to come</h2>
          <label style={item}><input type="checkbox" style={cb} />Late May to early June for peak waterfalls and high country still snowy.</label>
          <label style={item}><input type="checkbox" style={cb} />September to October for low crowds and golden light.</label>
          <label style={item}><input type="checkbox" style={cb} />Avoid July and August weekends. Heat plus crowds plus possible smoke.</label>
          <label style={item}><input type="checkbox" style={cb} />Smoke season runs roughly July through October. Build a contingency.</label>
          <label style={item}><input type="checkbox" style={cb} />2026 note: no entrance reservation is required. A standard pass is all you need.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>II · What to book in advance</div>
          <h2 style={sectionTitle}>The non-flexible reservations</h2>
          <label style={item}><input type="checkbox" style={cb} />In-park lodging: 6 to 12 months ahead (Ahwahnee, Valley Lodge, Curry Village).</label>
          <label style={item}><input type="checkbox" style={cb} />Gateway-town lodging: 1 to 3 months ahead for summer dates.</label>
          <label style={item}><input type="checkbox" style={cb} />Half Dome preseason lottery: apply March 1 to 31 on Recreation.gov.</label>
          <label style={item}><input type="checkbox" style={cb} />Tuolumne Meadows campground: opens on Recreation.gov in advance; books fast.</label>
          <label style={item}><input type="checkbox" style={cb} />Wilderness permits for overnight trips: apply 24 weeks ahead via Recreation.gov.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>III · What not to book</div>
          <h2 style={sectionTitle}>Common mistakes</h2>
          <label style={item}><input type="checkbox" style={cb} />Don't lock a rigid day-by-day itinerary. Weather and smoke flex everything.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't pay third-party sites for "Yosemite passes." Pay $35 at the gate or use America the Beautiful.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't book Curry Village if you want quiet sleep. It's loud.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't book Oakhurst if you're focused on the Valley. The drive is the longest of any gateway.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>IV · Gateway choice</div>
          <h2 style={sectionTitle}>Pick your base</h2>
          <label style={item}><input type="checkbox" style={cb} /><strong>El Portal</strong> — closest to the Valley (25-30 min). Limited dining, year-round access.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong>Mariposa</strong> — 45 min from the Valley. Full service, best first-timer pick.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong>Oakhurst</strong> — closest to Mariposa Grove. Long drive to the Valley.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong>Groveland</strong> — Bay Area approach, near Hetch Hetchy.</label>
          <label style={item}><input type="checkbox" style={cb} /><strong>Lee Vining</strong> — east side; Tuolumne and Mono Lake. Summer only.</label>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>V · What to pack</div>
          <h2 style={sectionTitle}>The car kit</h2>
          <label style={item}><input type="checkbox" style={cb} />Day pack with 2 liters water plus a bottle for the trail.</label>
          <label style={item}><input type="checkbox" style={cb} />Hiking shoes with real tread. Sneakers slip on Mist Trail granite.</label>
          <label style={item}><input type="checkbox" style={cb} />Layers. The daily temperature swing is 30 to 40 degrees.</label>
          <label style={item}><input type="checkbox" style={cb} />Headlamp plus a spare battery.</label>
          <label style={item}><input type="checkbox" style={cb} />Tire chains, November through April. Practice once at home.</label>
          <label style={item}><input type="checkbox" style={cb} />Cooler. Valley food is limited and overpriced.</label>
          <label style={item}><input type="checkbox" style={cb} />5 gallons of water (not for drinking — for radiators, rinsing, the unexpected).</label>
          <label style={item}><input type="checkbox" style={cb} />Paper park map (cell service dies past Crane Flat).</label>
          <label style={item}><input type="checkbox" style={cb} />Sunscreen and a wide-brim hat. UV at elevation is brutal.</label>
          <label style={item}><input type="checkbox" style={cb} />Cash for the gate or your America the Beautiful pass.</label>
          <p style={note}>Bear spray is not permitted in Yosemite. Don't bring it.</p>
        </section>

        <section className="checklist-section" style={sectionStyle}>
          <div style={sectionLabel}>VI · What to skip</div>
          <h2 style={sectionTitle}>Don't try to do too much</h2>
          <label style={item}><input type="checkbox" style={cb} />Don't try to "do" Tunnel View, Glacier Point, Mariposa Grove, and Tuolumne in one day. Pick two.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't drive Mariposa Grove to Tuolumne in a single day if anyone in your group fatigues.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't hit Lower Yosemite Fall between 11 AM and 3 PM. Come early or after 5 PM.</label>
          <label style={item}><input type="checkbox" style={cb} />Don't expect to swim in the Merced before mid-July. The current is dangerous.</label>
        </section>

        <section className="checklist-section" style={{ ...sectionStyle, borderBottom: "2px solid var(--ink)" }}>
          <div style={sectionLabel}>VII · The non-negotiables</div>
          <h2 style={sectionTitle}>If you remember nothing else</h2>
          <label style={item}><input type="checkbox" style={cb} />Be in the park by 6:30 AM on any peak day. The day's quality is decided before 9.</label>
          <label style={item}><input type="checkbox" style={cb} />Every scented item in the bear box when you leave the car. Trunk is not bear-proof.</label>
          <label style={item}><input type="checkbox" style={cb} />Print the Half Dome permit if you have one. No cell service at the subdome.</label>
          <label style={item}><input type="checkbox" style={cb} />Have a Plan B for every major stop. Parking, weather, and smoke will kill at least one Plan A.</label>
          <label style={item}><input type="checkbox" style={cb} />Pack out everything you bring in. Yosemite is loved enough already.</label>
        </section>

        {/* Source links for the longer essays */}
        <section style={{ marginTop: 56, marginBottom: 56 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The longer essays</div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", marginBottom: 12 }}>
            Each line on this checklist is condensed from a longer piece. If you want the reasoning behind any of them:
          </p>
          <ul style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.7, color: "var(--ink-1)", paddingLeft: 20 }}>
            <li><a href="/articles/first-time-yosemite-overwhelm" onClick={(e) => { e.preventDefault(); go("a:first-time-yosemite-overwhelm"); }}>If it's your first time in Yosemite, read this before you book anything</a></li>
            <li><a href="/articles/yosemite-without-reservations-2026" onClick={(e) => { e.preventDefault(); go("a:yosemite-without-reservations-2026"); }}>Yosemite without reservations in 2026</a></li>
            <li><a href="/articles/yosemite-gateway-towns-compared" onClick={(e) => { e.preventDefault(); go("a:yosemite-gateway-towns-compared"); }}>Yosemite gateway towns compared</a></li>
            <li><a href="/articles/pack-your-car-for-yosemite" onClick={(e) => { e.preventDefault(); go("a:pack-your-car-for-yosemite"); }}>How to pack your car for a Yosemite trip</a></li>
            <li><a href="/articles/half-dome-permit-lottery-2026" onClick={(e) => { e.preventDefault(); go("a:half-dome-permit-lottery-2026"); }}>How the Half Dome permit lottery actually works</a></li>
            <li><a href="/articles/yosemite-during-smoke-season" onClick={(e) => { e.preventDefault(); go("a:yosemite-during-smoke-season"); }}>Yosemite during smoke season</a></li>
            <li><a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>The full Yosemite Planning Guide</a></li>
          </ul>
        </section>

        {/* Newsletter capture */}
        <div className="checklist-section">
          <NewsletterInline
            heading="Want updates through the season?"
            blurb="One Yosemite email a week, when there is something to say. Free. Subscribers hear about updates to this checklist first."
          />
        </div>
      </div>
    </div>
  );
}

window.ChecklistPage = ChecklistPage;
