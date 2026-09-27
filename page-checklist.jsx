/* global React, HpPageHead, HpGuideBand, HpLetter, FjLayout, FjCard */

// One sheet of the checklist: the eyebrow, the serif title, the lines, and a
// tally of what is checked. The tally is presentation (the checkboxes carry
// their own state for assistive tech), and nothing is stored: the page is
// meant to be printed, and a reload is a fresh sheet, as it always was.
function CheckSheet({ label, title, children }) {
  const ref = React.useRef(null);
  const [done, setDone] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const count = () => {
    const boxes = ref.current ? ref.current.querySelectorAll('input[type="checkbox"]') : [];
    setTotal(boxes.length);
    setDone(Array.from(boxes).filter((b) => b.checked).length);
  };
  React.useLayoutEffect(count, []);
  return (
    <section className={"checklist-section fj-sheet" + (total && done === total ? " is-done" : "")} ref={ref} onChange={count}>
      <div className="fj-sheet__head">
        <p className="hp-eyebrow">{label}</p>
        {total > 0 && <span className="fj-sheet__tally" aria-hidden="true">{done} / {total}</span>}
      </div>
      <h2 className="fj-h fj-sheet__title">{title}</h2>
      {children}
    </section>
  );
}


function ChecklistPage({ go }) {
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
          .page-checklist .checklist-section { break-inside: auto; page-break-inside: auto; }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `}</style>

      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "First-week checklist" }]}
        className="fj-head fj-topo"
        eyebrow="THE FIRST-WEEK CHECKLIST"
        title="Yosemite, in one printable page."
        intro="A condensed action list for planning a Yosemite trip in 2026, drawn from the full archive of The Talus Field. Print it, check things off, take it in the car. The longer essays behind each line are linked throughout, and collected at the bottom."
        aside={
          <FjCard
            eyebrow="THE CHECKLIST, IN FOUR LINES"
            rows={[
              { label: "Sheets", value: "Seven, I to VII" },
              { label: "Format", value: "One printable page" },
              { label: "Lines", value: "Thirty-nine" },
              { label: "Behind each line", value: "A longer essay, linked" },
            ]}
          />
        }
      >
        <p className="hp-byline hp-checklist__tip">
          Tip: <strong>Cmd+P</strong> (or Ctrl+P) for a clean print version.
        </p>
      </HpPageHead>

      <FjLayout numbered={false} marks="roman" label="The sheets">

        <CheckSheet label="I · Window of arrival" title="When to come">
          <label className="fj-check"><input type="checkbox" />Late May to early June for <A r="a:mist-trail-the-real-guide">peak waterfalls</A> and <A r="a:memorial-day-skip-the-valley-go-high-2026">high country</A> still snowy.</label>
          <label className="fj-check"><input type="checkbox" />September to October for low crowds and golden light.</label>
          <label className="fj-check"><input type="checkbox" />Avoid July and August weekends. Heat plus crowds plus possible smoke.</label>
          <label className="fj-check"><input type="checkbox" /><A r="a:yosemite-during-smoke-season">Smoke season</A> runs roughly July through October. Build a contingency.</label>
          <label className="fj-check"><input type="checkbox" />2026 note: <A r="a:yosemite-without-reservations-2026">no entrance reservation is required</A>. A standard pass is all you need.</label>
        </CheckSheet>

        <CheckSheet label="II · What to book in advance" title="The non-flexible reservations">
          <label className="fj-check"><input type="checkbox" />In-park lodging: 6 to 12 months ahead (Ahwahnee, Valley Lodge, Curry Village). <A r="stay">Every option compared</A>.</label>
          <label className="fj-check"><input type="checkbox" /><A r="a:yosemite-gateway-towns-compared">Gateway-town lodging</A>: 1 to 3 months ahead for summer dates.</label>
          <label className="fj-check"><input type="checkbox" /><A r="half-dome-lottery">Half Dome preseason lottery</A>: apply March 1 to 31 on Recreation.gov.</label>
          <label className="fj-check"><input type="checkbox" /><A r="a:tioga-road-opening-weekend-2026">Tuolumne Meadows</A> campground: opens on Recreation.gov in advance; books fast.</label>
          <label className="fj-check"><input type="checkbox" /><A r="a:yosemite-wilderness-permits-guide">Wilderness permits</A> for overnight trips: apply 24 weeks ahead via Recreation.gov.</label>
        </CheckSheet>

        <CheckSheet label="III · What not to book" title="Common mistakes">
          <label className="fj-check"><input type="checkbox" />Don't lock a <A r="a:first-time-yosemite-overwhelm">rigid day-by-day itinerary</A>. Weather and <A r="a:yosemite-during-smoke-season">smoke</A> flex everything.</label>
          <label className="fj-check"><input type="checkbox" />Don't pay third-party sites for "Yosemite passes." <A r="a:yosemite-without-reservations-2026">Pay $35 at the gate</A> or use America the Beautiful. (International visitors: a $100 per-person surcharge applies in 2026.)</label>
          <label className="fj-check"><input type="checkbox" />Don't book Curry Village if you want quiet sleep. It's loud.</label>
          <label className="fj-check"><input type="checkbox" />Don't book <A r="a:yosemite-gateway-towns-compared">Oakhurst</A> if you're focused on the Valley. The drive is the longest of any gateway.</label>
        </CheckSheet>

        <CheckSheet label="IV · Gateway choice" title="Pick your base">
          <label className="fj-check"><input type="checkbox" /><strong><A r="a:yosemite-gateway-towns-compared">El Portal</A></strong>: closest to the Valley (25-30 min). Limited dining, year-round access.</label>
          <label className="fj-check"><input type="checkbox" /><strong><A r="a:yosemite-gateway-towns-compared">Mariposa</A></strong>: 45 min from the Valley. Full service, best first-timer pick.</label>
          <label className="fj-check"><input type="checkbox" /><strong><A r="a:yosemite-gateway-towns-compared">Oakhurst</A></strong>: closest to Mariposa Grove. Long drive to the Valley.</label>
          <label className="fj-check"><input type="checkbox" /><strong><A r="a:yosemite-gateway-towns-compared">Groveland</A></strong>: Bay Area approach, near <A r="a:hetch-hetchy-the-other-yosemite-valley">Hetch Hetchy</A>.</label>
          <label className="fj-check"><input type="checkbox" /><strong><A r="a:yosemite-gateway-towns-compared">Lee Vining</A></strong>: east side; <A r="a:tioga-road-opening-weekend-2026">Tuolumne and Mono Lake</A>. Summer only.</label>
          <label className="fj-check"><input type="checkbox" />Checked availability on your actual dates: <A r="stay">the lodging board</A> has a live search per town.</label>
        </CheckSheet>

        <CheckSheet label="V · What to pack" title="The car kit">
          <label className="fj-check"><input type="checkbox" />Day pack with 2 liters water plus a bottle for the trail.</label>
          <label className="fj-check"><input type="checkbox" />Hiking shoes with real tread. Sneakers slip on <A r="a:mist-trail-the-real-guide">Mist Trail</A> granite.</label>
          <label className="fj-check"><input type="checkbox" />Layers. The <A r="a:memorial-day-skip-the-valley-go-high-2026">daily temperature swing</A> is 30 to 40 degrees.</label>
          <label className="fj-check"><input type="checkbox" />Headlamp plus a spare battery.</label>
          <label className="fj-check"><input type="checkbox" /><A r="a:pack-your-car-for-yosemite">Tire chains</A>, November through April. Practice once at home.</label>
          <label className="fj-check"><input type="checkbox" />Cooler. <A r="a:where-to-eat-yosemite">Valley food</A> is limited and overpriced.</label>
          <label className="fj-check"><input type="checkbox" />5 gallons of water (not for drinking, for radiators, rinsing, the unexpected).</label>
          <label className="fj-check"><input type="checkbox" />Paper park map (cell service dies past Crane Flat).</label>
          <label className="fj-check"><input type="checkbox" />Sunscreen and a wide-brim hat. UV at elevation is brutal.</label>
          <label className="fj-check"><input type="checkbox" />A credit or debit card for the gate (the entrance stations are cashless) or your <A r="a:yosemite-without-reservations-2026">America the Beautiful pass</A>.</label>
          <p className="fj-sheet__note">Bear spray is not permitted in Yosemite. Don't bring it.</p>
        </CheckSheet>

        <CheckSheet label="VI · What to skip" title="Don't try to do too much">
          <label className="fj-check"><input type="checkbox" />Don't try to "do" Tunnel View, <A r="a:glacier-point-road-open-2026">Glacier Point</A>, <A r="a:giant-sequoias-fire-adaptation">Mariposa Grove</A>, and <A r="a:tioga-road-opening-weekend-2026">Tuolumne</A> in one day. Pick two.</label>
          <label className="fj-check"><input type="checkbox" />Don't drive Mariposa Grove to Tuolumne <A r="a:yosemite-in-one-or-two-days">in a single day</A> if anyone in your group fatigues.</label>
          <label className="fj-check"><input type="checkbox" />Don't hit <A r="a:yosemite-for-non-hikers">Lower Yosemite Fall</A> between 11 AM and 3 PM. Come early or after 5 PM.</label>
          <label className="fj-check"><input type="checkbox" />Don't expect to swim in the Merced before mid-July. <A r="a:mist-trail-the-real-guide">The current is dangerous</A>.</label>
        </CheckSheet>

        <CheckSheet label="VII · The non-negotiables" title="If you remember nothing else">
          <label className="fj-check"><input type="checkbox" /><A r="a:yosemite-without-reservations-2026">Be in the park by 6:30 AM</A> on any peak day. The day's quality is decided before 9.</label>
          <label className="fj-check"><input type="checkbox" />Every scented item in the <A r="a:bears-spring-emergence">bear box</A> when you leave the car. Trunk is not bear-proof.</label>
          <label className="fj-check"><input type="checkbox" />Print the <A r="half-dome-lottery">Half Dome permit</A> if you have one. No cell service at the subdome.</label>
          <label className="fj-check"><input type="checkbox" />Have a Plan B for every major stop. Parking, weather, and <A r="a:yosemite-during-smoke-season">smoke</A> will kill at least one Plan A.</label>
          <label className="fj-check"><input type="checkbox" />Pack out everything you bring in. <A r="a:yosemite-needs-a-reservation-system">Yosemite is loved enough already</A>.</label>
        </CheckSheet>

        {/* Source links for the longer essays */}
        <section className="fj-essays">
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
      </FjLayout>

      {/* The purchase ask: checklist readers have dates and are packing,
          the highest purchase intent on the site. */}
      <HpGuideBand
        go={go}
        location="checklist"
        title="The checklist rides along."
        intro="The Field Guide app packs a night-before checklist next to every stop with parking and timing notes, offline maps, and a trip planner. Everything this page prepares you for, on your phone, with no signal required."
        sample
      />
      {/* Newsletter capture */}
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Want updates through the season?"
        heading="Want updates through the season?"
        blurb="Subscribers hear about updates to this checklist first."
        location="checklist"
        tag="checklist"
      />
    </div>
  );
}

window.ChecklistPage = ChecklistPage;
