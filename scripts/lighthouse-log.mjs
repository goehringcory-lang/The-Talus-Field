#!/usr/bin/env node
//
// Append a Lighthouse run to scripts/data/lighthouse-history.json so Core Web
// Vitals drift is visible in git over time, not just as a one-off CI artifact.
//
// Reads the .lighthouseci/ output produced by treosh/lighthouse-ci-action: the
// manifest lists each run; we keep the representative run per URL and record the
// performance score plus LCP / CLS / FCP / TBT. Also prints a one-line summary
// and flags regressions beyond a soft budget (warn only — the workflow does not
// fail on Lighthouse drift, to avoid flaky nightly failures).
//
// Usage: node scripts/lighthouse-log.mjs [path-to-.lighthouseci]

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS = path.resolve(fileURLToPath(import.meta.url), "..");
const HISTORY = path.join(SCRIPTS, "data", "lighthouse-history.json");
const LHCI_DIR = process.argv[2] || path.resolve(SCRIPTS, "..", ".lighthouseci");

// Soft budgets (lab). LCP in ms, CLS unitless. Only warns.
const BUDGET = { lcp: 2500, cls: 0.1, performance: 0.9 };

function readManifest() {
  const manifestPath = path.join(LHCI_DIR, "manifest.json");
  if (existsSync(manifestPath)) return JSON.parse(readFileSync(manifestPath, "utf8"));
  // Fallback: no manifest, scan for lhr-*.json.
  if (!existsSync(LHCI_DIR)) return [];
  return readdirSync(LHCI_DIR)
    .filter((f) => /^lhr-.*\.json$/.test(f))
    .map((f) => ({ url: null, isRepresentativeRun: true, jsonPath: path.join(LHCI_DIR, f) }));
}

function lhrRecord(jsonPath) {
  const lhr = JSON.parse(readFileSync(jsonPath, "utf8"));
  const a = lhr.audits || {};
  const num = (k) => (a[k] && typeof a[k].numericValue === "number" ? a[k].numericValue : null);
  return {
    url: lhr.finalUrl || lhr.requestedUrl,
    performance: lhr.categories?.performance?.score ?? null,
    lcp: num("largest-contentful-paint"),
    cls: num("cumulative-layout-shift"),
    fcp: num("first-contentful-paint"),
    tbt: num("total-blocking-time"),
  };
}

function main() {
  const manifest = readManifest();
  const reps = manifest.filter((m) => m.isRepresentativeRun !== false);
  if (!reps.length) {
    console.error(`No Lighthouse results found in ${LHCI_DIR}`);
    process.exit(1);
  }

  const runs = reps.map((m) => lhrRecord(m.jsonPath));
  const entry = { date: new Date().toISOString().slice(0, 10), runs };

  const history = existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : [];
  const prev = history.length ? history[history.length - 1] : null;
  history.push(entry);
  writeFileSync(HISTORY, JSON.stringify(history, null, 2) + "\n");

  for (const r of runs) {
    const lcp = r.lcp != null ? `${Math.round(r.lcp)}ms` : "n/a";
    const cls = r.cls != null ? r.cls.toFixed(3) : "n/a";
    const perf = r.performance != null ? Math.round(r.performance * 100) : "n/a";
    console.log(`${r.url} — perf ${perf} · LCP ${lcp} · CLS ${cls}`);

    if (r.lcp != null && r.lcp > BUDGET.lcp) console.log(`::warning::LCP ${Math.round(r.lcp)}ms over budget (${BUDGET.lcp}ms) on ${r.url}`);
    if (r.cls != null && r.cls > BUDGET.cls) console.log(`::warning::CLS ${r.cls.toFixed(3)} over budget (${BUDGET.cls}) on ${r.url}`);
    if (r.performance != null && r.performance < BUDGET.performance) console.log(`::warning::Performance ${perf} under budget (${BUDGET.performance * 100}) on ${r.url}`);

    if (prev) {
      const before = prev.runs.find((x) => x.url === r.url);
      if (before && before.lcp != null && r.lcp != null && r.lcp - before.lcp > 500) {
        console.log(`::warning::LCP regressed ${Math.round(r.lcp - before.lcp)}ms vs last run on ${r.url}`);
      }
    }
  }
  console.log(`Appended ${runs.length} run(s) to ${path.relative(path.resolve(SCRIPTS, ".."), HISTORY)}`);
}

main();
