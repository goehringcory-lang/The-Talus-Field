#!/usr/bin/env node
// =============================================================================
// check-fee-calculator.mjs: sweep every input the /international calculator
// accepts and fail on anything a reader could be misled by.
//
// Asserts, over all 12 × 13 × 3 × 4 × 6 = 11,232 combinations:
//   - the function returns, with every total a non-negative integer;
//   - `best` is never dearer than any listed option;
//   - the gate option's total equals the fee table's arithmetic recomputed
//     here independently (a second implementation, so a typo in one shows);
//   - a party of one adult in one car for one entry pays exactly $135 at the
//     gate ($35 + $100), which is the number every 2026 explainer prints;
//   - copy carries no em-dash.
// Also checks the FEES table against the numbers on the page's own sources as
// quoted in fees-data.js's header, so a fee edit that forgets the header fails.
// Part of `npm --prefix scripts run check`.
// =============================================================================

import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { ROOT } from "./lib/catalog.mjs";

const src = readFileSync(path.join(ROOT, "fees-data.js"), "utf8");
if (/—/.test(src)) {
  console.error("check-fee-calculator: em-dash in fees-data.js (house style)");
  process.exit(1);
}
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: "fees-data.js" });
const w = sandbox.window;
if (typeof w.calcEntryFees !== "function" || !w.FEES) {
  console.error("check-fee-calculator: fees-data.js did not define window.FEES and window.calcEntryFees");
  process.exit(1);
}
const F = w.FEES;
const problems = [];
let combos = 0;

for (let adults = 1; adults <= 12; adults++) {
  for (let children = 0; children <= 12; children++) {
    for (const mode of w.FEE_MODES) {
      for (let vehicles = 1; vehicles <= 4; vehicles++) {
        for (let entries = 1; entries <= 6; entries++) {
          combos++;
          const r = w.calcEntryFees({ adults, children, mode, vehicles, entries });
          const tag = JSON.stringify({ adults, children, mode, vehicles, entries });
          if (!r || !Array.isArray(r.options) || r.options.length < 2) { problems.push(`${tag}: no options`); continue; }
          for (const o of r.options) {
            if (!Number.isInteger(o.total) || o.total < 0) problems.push(`${tag}: ${o.id} total ${o.total}`);
            const lineSum = o.lines.reduce((t, l) => t + l.amount, 0);
            if (lineSum !== o.total) problems.push(`${tag}: ${o.id} lines sum to ${lineSum}, total says ${o.total}`);
            if (/—/.test(o.label + o.note + o.lines.map((l) => l.label).join(""))) problems.push(`${tag}: em-dash in ${o.id} copy`);
          }
          const best = r.options.find((o) => o.id === r.best);
          if (!best) problems.push(`${tag}: best "${r.best}" is not an option`);
          else if (r.options.some((o) => o.total < best.total)) problems.push(`${tag}: best ${best.id} ($${best.total}) is not the cheapest`);
          // Independent recomputation of the gate arithmetic.
          const v = mode === "foot" ? 0 : vehicles;
          const entry = mode === "car" ? v * F.vehicle : mode === "motorcycle" ? v * F.motorcycle : adults * F.perPerson;
          const expected = (entry + adults * F.surcharge) * entries;
          const gate = r.options.find((o) => o.id === "gate");
          if (!gate || gate.total !== expected) problems.push(`${tag}: gate total ${gate && gate.total}, expected ${expected}`);
          const passes = mode === "foot" ? Math.ceil(adults / F.passAdultsOnFoot) : vehicles;
          const pass = r.options.find((o) => o.id === "pass");
          if (!pass || pass.total !== passes * F.nonResidentAnnual) problems.push(`${tag}: pass total ${pass && pass.total}, expected ${passes * F.nonResidentAnnual}`);
        }
      }
    }
  }
}

const one = w.calcEntryFees({ adults: 1, children: 0, mode: "car", vehicles: 1, entries: 1 });
if (one.options[0].total !== 135) problems.push(`one adult, one car, one entry pays $${one.options[0].total} at the gate; expected $135`);
if (one.best !== "gate") problems.push("one adult, one car, one entry should recommend paying at the gate");
const family = w.calcEntryFees({ adults: 3, children: 2, mode: "car", vehicles: 1, entries: 1 });
if (family.best !== "pass") problems.push("three adults in one car should recommend the $250 pass ($335 at the gate)");

// The table against its own documented sources (the numbers the header quotes).
const expect = { vehicle: 35, motorcycle: 30, perPerson: 20, surcharge: 100, nonResidentAnnual: 250, residentAnnual: 80, yosemiteAnnual: 70, surchargeAgeFrom: 16 };
for (const [k, v] of Object.entries(expect)) if (F[k] !== v) problems.push(`FEES.${k} is ${F[k]}, header documents ${v}; update both or neither`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(F.verified)) problems.push("FEES.verified must be YYYY-MM-DD");
if (F.surchargeParks.length !== 11 || !F.surchargeParks.includes("Yosemite")) problems.push("surchargeParks should list the eleven parks including Yosemite");

if (problems.length) {
  console.error(`check-fee-calculator: ${problems.length} problem(s) over ${combos} combinations`);
  for (const p of problems.slice(0, 20)) console.error("  " + p);
  process.exit(1);
}
console.log(`check-fee-calculator: ${combos} combinations OK`);
