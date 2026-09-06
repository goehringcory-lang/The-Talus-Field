// =============================================================================
// fees-data.js: Yosemite entrance fees and the international visitor
// calculator. Raw, uncompiled, like itineraries-data.js; loaded by PAGE_MODULES
// on /international only, and evaluated under node:vm by
// scripts/check-fee-calculator.mjs, which sweeps every input combination.
//
// SOURCING. Every number here is quoted from an NPS page, named in FEES.sources,
// and the page that renders this prints FEES.verified. Fee policy changes by
// rule, not by season, so a change lands here first and the evergreen-refresh
// routine re-verifies the page against those sources.
//
// The one interpretive question, settled here in code and stated on the page:
// how the $100 non-resident fee interacts with the $250 non-resident annual
// pass for the other people in the car. nps.gov/yose/planyourvisit/fees.htm
// says the surcharge is "$100 per person (age 16+) unless holding an Annual or
// America the Beautiful Pass". America the Beautiful passes admit the holder
// and everyone in one private vehicle, and the Yosemite Conservancy's 2026
// know-before-you-go page prints the two options side by side as "$35/vehicle
// + $100 per nonresident age 16 and older" against "$250/vehicle (no
// additional per person fee)". The calculator follows that reading: one $250
// pass covers a car. At per-person entry (foot, bicycle, bus) a pass covers the
// holder plus three adults, which is the standard pass rule, and that is
// modelled too. No em-dashes in copy (house style).
// =============================================================================

window.FEES = {
  verified: "2026-09-05",
  sources: {
    yosemite: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    passes: "https://www.nps.gov/planyourvisit/passes.htm",
    conservancy: "https://yosemite.org/know-before-you-go-yosemite-in-2026/",
    doi: "https://www.doi.gov/pressreleases/department-interior-announces-modernized-more-affordable-national-park-access",
  },
  // Standard 7-day entrance passes at Yosemite (fees.htm).
  vehicle: 35,
  motorcycle: 30,
  perPerson: 20,
  perPersonFreeUnder: 16,
  // The 2026 non-resident surcharge: per person 16 and older, on top of the
  // entrance fee, at eleven parks including Yosemite (passes.htm, fees.htm).
  surcharge: 100,
  surchargeAgeFrom: 16,
  surchargeParks: [
    "Acadia", "Bryce Canyon", "Everglades", "Glacier", "Grand Canyon", "Grand Teton",
    "Rocky Mountain", "Sequoia and Kings Canyon", "Yellowstone", "Yosemite", "Zion",
  ],
  // Passes. The non-resident America the Beautiful pass covers the holder's
  // vehicle and waives the surcharge for its occupants (see header). Passes
  // are per vehicle; a second car needs a second pass. At a per-person entry
  // a pass admits the holder and up to three other adults.
  nonResidentAnnual: 250,
  residentAnnual: 80,
  yosemiteAnnual: 70, // US citizens and residents only (fees.htm)
  passAdultsOnFoot: 4,
  cashless: true,
  feeFreeDaysResidentsOnly: true,
  feeFreeDays2026: ["Feb 16", "May 25", "Jun 14", "Jul 3 to 5", "Aug 25", "Sep 17", "Oct 27", "Nov 11"],
};

// The calculator. Deterministic and total: every combination of the inputs
// below returns a result, and check-fee-calculator.mjs asserts that the
// recommended option is never dearer than any alternative it lists.
//
//   adults:   people 16 and older in the party (1 to 12)
//   children: people under 16 (0 to 12)
//   mode:     "car" | "motorcycle" | "foot"   (foot = walk, bicycle, bus)
//   vehicles: cars or motorcycles in the party (1 to 4; ignored on foot)
//   entries:  separate 7-day entries in the next 12 months at surcharge parks
//             (1 to 6). One Yosemite trip is 1; a Yosemite-then-Sequoia road
//             trip with a night outside the parks between is 2.
//
// Returns { options: [{ id, label, total, lines: [{ label, amount }], note }],
// best: <id>, savings: <best vs pay-at-gate> }.
window.FEE_MODES = ["car", "motorcycle", "foot"];

window.calcEntryFees = function (input) {
  var F = window.FEES;
  var adults = clampInt(input.adults, 1, 12);
  var children = clampInt(input.children, 0, 12);
  var mode = window.FEE_MODES.indexOf(input.mode) !== -1 ? input.mode : "car";
  var vehicles = mode === "foot" ? 0 : clampInt(input.vehicles, 1, 4);
  var entries = clampInt(input.entries, 1, 6);

  var options = [];

  // Option A: pay at the gate every entry.
  var gate = [];
  if (mode === "car") gate.push({ label: plural(vehicles, "vehicle pass", "vehicle passes") + " at $" + F.vehicle, amount: vehicles * F.vehicle * entries });
  if (mode === "motorcycle") gate.push({ label: plural(vehicles, "motorcycle pass", "motorcycle passes") + " at $" + F.motorcycle, amount: vehicles * F.motorcycle * entries });
  if (mode === "foot") gate.push({ label: plural(adults, "person", "people") + " at $" + F.perPerson + " (under 16 free)", amount: adults * F.perPerson * entries });
  gate.push({ label: "Non-resident fee, $" + F.surcharge + " × " + plural(adults, "person", "people") + " 16 and older", amount: adults * F.surcharge * entries });
  options.push({
    id: "gate",
    label: entries > 1 ? "Pay at the gate, " + entries + " entries" : "Pay at the gate",
    lines: gate,
    total: sum(gate),
    note: entries > 1 ? "Each 7-day pass and each non-resident fee is charged again at every separate entry." : "One 7-day entrance pass plus the non-resident fee, once each.",
  });

  // Option B: non-resident annual passes. One per vehicle; on foot, one per
  // four adults.
  var passes = mode === "foot" ? Math.ceil(adults / F.passAdultsOnFoot) : vehicles;
  var passLines = [{ label: plural(passes, "non-resident annual pass", "non-resident annual passes") + " at $" + F.nonResidentAnnual, amount: passes * F.nonResidentAnnual }];
  var uncovered = mode === "foot" ? 0 : 0; // a pass covers the whole car
  options.push({
    id: "pass",
    label: "Non-resident annual pass",
    lines: passLines,
    total: sum(passLines) + uncovered,
    note: mode === "foot"
      ? "A pass admits the holder and up to three other adults at a per-person entry. Valid twelve months at every federal fee site; the non-resident fee is not charged to pass holders."
      : "One pass covers the vehicle and everyone in it, and the non-resident fee is not charged to its occupants. Valid twelve months at every federal fee site.",
  });

  // Best = lowest total; ties go to paying at the gate (no commitment).
  var best = options.slice().sort(function (a, b) { return a.total - b.total || (a.id === "gate" ? -1 : 1); })[0];
  return {
    input: { adults: adults, children: children, mode: mode, vehicles: vehicles, entries: entries },
    options: options,
    best: best.id,
    savings: options[0].total - best.total,
  };
};

function clampInt(v, lo, hi) {
  var n = Math.round(Number(v));
  if (!isFinite(n)) n = lo;
  return Math.max(lo, Math.min(hi, n));
}
function sum(lines) {
  return lines.reduce(function (t, l) { return t + l.amount; }, 0);
}
function plural(n, one, many) {
  return n + " " + (n === 1 ? one : many);
}
