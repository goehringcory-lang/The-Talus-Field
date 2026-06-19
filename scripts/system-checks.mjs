#!/usr/bin/env node
//
// Nightly system-checks suite for the editorial site. Runs a battery of SEO,
// render, and distribution checks against the repo (and, with --online, the live
// site / DNS). Prints a grouped report and exits non-zero if any check has an
// error-severity finding; warnings never fail the run.
//
// Usage:
//   node scripts/system-checks.mjs                 # offline checks only
//   node scripts/system-checks.mjs --online        # + link liveness, smoke, DNS, sitemap 200s
//   node scripts/system-checks.mjs --base-url=URL  # target a dev server instead of production
//   node scripts/system-checks.mjs --json          # machine-readable output
//   node scripts/system-checks.mjs --report=FILE   # also write a Markdown report
//
// Checks live in scripts/checks/*.mjs; each default-exports async (ctx) =>
// { name, findings: [{ level, msg }] }. Add a module to CHECKS below to register.

import { writeFileSync } from "node:fs";
import { loadDataJs, loadVideosJs, loadSeoData } from "./lib/catalog.mjs";
import { summarize } from "./lib/report.mjs";

import checkMirrors from "./checks/mirrors.mjs";
import checkLinks from "./checks/links.mjs";
import checkSeo from "./checks/seo.mjs";
import checkSitemap from "./checks/sitemap.mjs";
import checkFeed from "./checks/feed.mjs";
import checkImages from "./checks/images.mjs";
import checkSmoke from "./checks/smoke.mjs";
import checkEmailAuth from "./checks/email-auth.mjs";

const CHECKS = [
  checkMirrors,
  checkLinks,
  checkSeo,
  checkSitemap,
  checkFeed,
  checkImages,
  checkSmoke,
  checkEmailAuth,
];

function parseArgs(argv) {
  const opts = { online: false, json: false, baseUrl: null, report: null };
  for (const a of argv) {
    if (a === "--online") opts.online = true;
    else if (a === "--json") opts.json = true;
    else if (a.startsWith("--base-url=")) opts.baseUrl = a.slice("--base-url=".length);
    else if (a.startsWith("--report=")) opts.report = a.slice("--report=".length);
  }
  return opts;
}

const ICON = { error: "✗", warn: "⚠", info: "·" };

function renderText(results) {
  const lines = [];
  for (const r of results) {
    const errs = r.findings.filter((f) => f.level === "error").length;
    const warns = r.findings.filter((f) => f.level === "warn").length;
    const status = errs ? "ERROR" : warns ? "WARN" : "OK";
    lines.push(`\n${status === "OK" ? "✓" : status === "WARN" ? "⚠" : "✗"} ${r.name} — ${status}`);
    for (const f of r.findings) {
      if (f.level === "info" && status !== "OK") continue; // keep failing checks terse
      lines.push(`    ${ICON[f.level]} ${f.msg}`);
    }
  }
  return lines.join("\n");
}

function renderMarkdown(results, opts) {
  const { errors, warns } = summarize(results);
  const lines = [
    `# System checks report`,
    ``,
    `_Generated ${new Date().toISOString()} · mode: ${opts.online ? "online" : "offline"}${opts.baseUrl ? ` · base ${opts.baseUrl}` : ""}_`,
    ``,
    `**${errors} error${errors === 1 ? "" : "s"}, ${warns} warning${warns === 1 ? "" : "s"}** across ${results.length} checks.`,
    ``,
  ];
  for (const r of results) {
    const errs = r.findings.filter((f) => f.level === "error").length;
    const w = r.findings.filter((f) => f.level === "warn").length;
    const status = errs ? "❌ ERROR" : w ? "⚠️ WARN" : "✅ OK";
    lines.push(`## ${r.name} — ${status}`, ``);
    const shown = r.findings.filter((f) => f.level !== "info" || !errs);
    if (!shown.length) lines.push(`- no issues`);
    for (const f of shown) lines.push(`- ${ICON[f.level]} ${f.msg}`);
    lines.push(``);
  }
  return lines.join("\n");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { articles, categories, kit } = loadDataJs();
  const ctx = {
    articles,
    categories,
    kit,
    episodes: loadVideosJs(),
    seoData: loadSeoData(),
    online: opts.online,
    baseUrl: opts.baseUrl,
  };

  const results = [];
  for (const fn of CHECKS) {
    try {
      results.push(await fn(ctx));
    } catch (e) {
      results.push({ name: fn.name || "unknown", findings: [{ level: "error", msg: `check threw: ${e.message}` }] });
    }
  }

  const { errors, warns } = summarize(results);

  if (opts.json) {
    process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), online: opts.online, errors, warns, results }, null, 2) + "\n");
  } else {
    process.stdout.write(renderText(results) + "\n");
    process.stdout.write(`\n${errors ? "✗" : "✓"} ${errors} error(s), ${warns} warning(s) across ${results.length} checks.\n`);
  }

  if (opts.report) {
    writeFileSync(opts.report, renderMarkdown(results, opts));
    if (!opts.json) process.stdout.write(`\nwrote ${opts.report}\n`);
  }

  process.exit(errors ? 1 : 0);
}

main().catch((e) => {
  console.error(e.stack || e);
  process.exit(2);
});
