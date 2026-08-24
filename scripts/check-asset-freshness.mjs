// =============================================================================
// Guard: a versioned asset whose bytes changed must carry a new ?v=.
//
// check-cache-busters.sh verifies that every reference HAS a ?v= and that the
// shared number is used consistently. It cannot tell whether that number is
// still TRUE. Probe that motivated this file (CODE-AUDIT-2026-08 §4): append a
// comment to styles.css, bump nothing, run the whole guard suite. Everything
// passed. /styles.css is served with a short TTL so that one is survivable, but
// the same hole covers /dist/*.js, /data.js, /points.geojson and /bulletin.json,
// and CI now auto-deploys the editorial site from main. An edit that ships
// behind a stale ?v= is invisible to readers for as long as the CDN holds it,
// with every guard green and nothing to point at.
//
// So: hash the bytes, record the hash against the version that was current when
// they were last stamped, and fail when the bytes move without the version.
//
// WHAT IS COVERED, and why each one needs its own answer
//
//   1. The shared-version assets. Everything index.html references with the one
//      canonical ?v=N, PLUS every bundle in app.jsx's PAGE_MODULES: those are
//      injected at runtime with the same N (read off the app.js tag), so they
//      are served under a version number that no file mentions. That is the
//      largest blind spot here, 30-odd bundles including every page-*.js.
//   2. Article bodies, /dist/bodies/<slug>.js, versioned per slug in
//      window.BODY_VERSIONS. The existing guard proves the MAP matches the
//      files on disk; it never looks at what is in them.
//   3. points.geojson and bulletin.json, which carry hand-maintained counters
//      in page-map.jsx and page-now.jsx / page-home.jsx. Editing a pin or a
//      bulletin without bumping is the documented trap, and the two bulletin
//      constants agreeing was itself unchecked.
//   4. The brand mark and the favicon ladder, on their own counter. /img/* is
//      served immutable for 30 days, which makes a missed bump there the
//      longest-lived staleness on the site.
//
// WHAT STAMPING WILL NOT DO
// `--stamp` refuses to record new bytes under an unchanged version. That
// refusal is the entire guard: a stamp that could launder a stale version
// would turn this file back into check-cache-busters.sh. Bump first, then
// stamp. A brand-new asset has no previous version to compare against, so it
// is stamped wherever it currently sits.
//
// Run:
//   node check-asset-freshness.mjs           # verify (wired into `npm run check`)
//   node check-asset-freshness.mjs --stamp   # re-record after a version bump
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(__dirname, "data", "asset-versions.json");
const STAMP = process.argv.includes("--stamp");
const VERBOSE = process.argv.includes("--verbose");

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const problems = [];
const fail = (msg) => problems.push(msg);

// --- collect what is served under a version ---------------------------------

// { servedPath -> { version, file, why } }. servedPath is the URL the browser
// asks for; file is the repo-relative path whose bytes back it.
const assets = new Map();

function add(servedPath, version, file, why) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    fail(`${why}: references ${servedPath} but ${file} does not exist`);
    return;
  }
  const prior = assets.get(servedPath);
  if (prior && prior.version !== version) {
    fail(
      `${servedPath} is served under two different versions: ${prior.version} (${prior.why}) ` +
        `and ${version} (${why}). One asset, one number.`
    );
    return;
  }
  assets.set(servedPath, { version, file, why });
}

const indexHtml = read("index.html");

// 1a. Everything index.html references with the shared number.
const shared = new Set();
for (const m of indexHtml.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css))\?v=(\d+)"/g)) {
  shared.add(m[2]);
  add(m[1], Number(m[2]), m[1].replace(/^\//, ""), "index.html");
}
if (shared.size !== 1) {
  fail(`index.html mixes shared ?v= values (${[...shared].join(", ")}); one canonical number expected`);
}
const SHARED_VERSION = Number([...shared][0]);

// 1b. The lazy bundles. app.jsx injects these with the shared number read off
// the app.js tag, so they are versioned without ever naming a version.
const appJsx = read("app.jsx");
const modulesBlock = appJsx.match(/const PAGE_MODULES = \{([\s\S]*?)\n\};/);
if (!modulesBlock) {
  fail("app.jsx: could not find the PAGE_MODULES table (has it been renamed?)");
} else {
  const paths = [...modulesBlock[1].matchAll(/scripts:\s*\[([^\]]*)\]/g)]
    .flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((p) => p[1]));
  if (!paths.length) fail("app.jsx: PAGE_MODULES parsed to zero scripts");
  for (const p of new Set(paths)) {
    add(p, SHARED_VERSION, p.replace(/^\//, ""), "app.jsx PAGE_MODULES");
  }
}

// 2. Article bodies, one version each.
const dataJs = read("data.js");
const bodyBlock = dataJs.match(/window\.BODY_VERSIONS = \{([\s\S]*?)\n\};/);
if (!bodyBlock) {
  fail("data.js: could not find window.BODY_VERSIONS");
} else {
  for (const m of bodyBlock[1].matchAll(/"([^"]+)":\s*(\d+)/g)) {
    add(`/dist/bodies/${m[1]}.js`, Number(m[2]), `dist/bodies/${m[1]}.js`, "data.js BODY_VERSIONS");
  }
}

// 3. The two hand-maintained data counters.
function counter(file, constName) {
  const src = read(file);
  const m = src.match(new RegExp(`${constName}\\s*=\\s*"([^"]+)"`));
  if (!m) {
    fail(`${file}: could not read ${constName}`);
    return null;
  }
  const parsed = m[1].match(/^(\/[^?]+)\?v=(\d+)$/);
  if (!parsed) {
    fail(`${file}: ${constName} is "${m[1]}", expected a "/path?v=N" form`);
    return null;
  }
  return { url: parsed[1], version: Number(parsed[2]) };
}

const points = counter("page-map.jsx", "POINTS_URL");
if (points) add(points.url, points.version, points.url.replace(/^\//, ""), "page-map.jsx POINTS_URL");

const bulletin = counter("page-now.jsx", "BULLETIN_URL");
const homeBulletin = counter("page-home.jsx", "HOME_BULLETIN_URL");
if (bulletin) add(bulletin.url, bulletin.version, bulletin.url.replace(/^\//, ""), "page-now.jsx BULLETIN_URL");
if (bulletin && homeBulletin && homeBulletin.version !== bulletin.version) {
  fail(
    `bulletin.json is fetched twice under different versions: BULLETIN_URL is v${bulletin.version} ` +
      `(page-now.jsx) and HOME_BULLETIN_URL is v${homeBulletin.version} (page-home.jsx). ` +
      `The homepage teaser and the bulletin page would disagree about what is current.`
  );
}

// 4. The image counter: mark plus the favicon ladder, immutable for 30 days.
for (const m of indexHtml.matchAll(/(?:src|href)="(\/img\/[^"]+\.(?:png|ico|jpg))\?v=(\d+)"/g)) {
  add(m[1], Number(m[2]), m[1].replace(/^\//, ""), "index.html image counter");
}

// --- compare against the manifest -------------------------------------------

const sha = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex").slice(0, 16);

let manifest = { __comment: "", assets: {} };
if (fs.existsSync(MANIFEST)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
} else if (!STAMP) {
  console.error(
    `check-asset-freshness: no manifest at scripts/data/asset-versions.json.\n` +
      `Create it with: npm --prefix scripts run assets:stamp`
  );
  process.exit(1);
}

const recorded = manifest.assets || {};
const stale = [];
const unstamped = [];
const missing = [];
const next = {};

for (const [servedPath, { version, file, why }] of [...assets].sort()) {
  const hash = sha(file);
  const prior = recorded[servedPath];
  next[servedPath] = { v: version, sha256: hash };

  if (!prior) {
    missing.push({ servedPath, version, why });
    continue;
  }
  if (prior.sha256 === hash && prior.v === version) continue;
  if (prior.sha256 === hash) {
    // Bytes unchanged, number moved. Harmless (a shared bump for a sibling
    // file does this to every eager asset), but the manifest has to follow.
    unstamped.push({ servedPath, from: prior.v, to: version });
    continue;
  }
  if (version > prior.v) {
    unstamped.push({ servedPath, from: prior.v, to: version, changed: true });
    continue;
  }
  stale.push({ servedPath, version, file, why });
}

// Entries in the manifest that no longer correspond to a served asset.
const orphans = Object.keys(recorded).filter((k) => !assets.has(k));

// --- report ------------------------------------------------------------------

if (STAMP) {
  if (stale.length) {
    console.error(
      `check-asset-freshness: refusing to stamp. These files changed but their ?v= did not move:\n` +
        stale.map((s) => `  ${s.servedPath}  still v${s.version}  (${s.why})`).join("\n") +
        `\n\nBump the version first, then stamp. Recording new bytes under an old\n` +
        `number is exactly the staleness this guard exists to catch.`
    );
    process.exit(1);
  }
  if (problems.length) {
    console.error(`check-asset-freshness:\n` + problems.map((p) => `  ${p}`).join("\n"));
    process.exit(1);
  }
  const out = {
    __comment:
      "Generated by scripts/check-asset-freshness.mjs --stamp. Content hash of every " +
      "asset the editorial site serves behind a ?v=, recorded against the version that " +
      "was current when it was stamped. Do not hand-edit: bump the version in the source " +
      "(index.html shared number, BODY_VERSIONS, POINTS_URL, BULLETIN_URL/HOME_BULLETIN_URL, " +
      "or the image counter), then run `npm --prefix scripts run assets:stamp`.",
    assets: Object.fromEntries([...Object.entries(next)].sort(([a], [b]) => (a < b ? -1 : 1))),
  };
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 2) + "\n");
  const changed = unstamped.length + missing.length;
  console.log(
    `check-asset-freshness: stamped ${Object.keys(next).length} asset(s)` +
      (changed ? `, ${changed} updated` : ", no change") +
      (orphans.length ? `, dropped ${orphans.length} stale entr(y/ies)` : "")
  );
  process.exit(0);
}

if (stale.length) {
  for (const s of stale) {
    fail(
      `${s.servedPath} changed but is still served as ?v=${s.version} (${s.why}). ` +
        `Readers and the CDN keep the old bytes until the TTL expires.`
    );
  }
}
for (const u of unstamped.filter((u) => u.changed)) {
  fail(`${u.servedPath} changed and was bumped v${u.from} -> v${u.to}, but the manifest still records v${u.from}.`);
}
for (const u of unstamped.filter((u) => !u.changed)) {
  if (VERBOSE) console.log(`  version-only move: ${u.servedPath} v${u.from} -> v${u.to}`);
  fail(`${u.servedPath} is now served as ?v=${u.to}; the manifest records v${u.from}.`);
}
for (const m of missing) {
  fail(`${m.servedPath} is served under ?v=${m.version} (${m.why}) but has no manifest entry.`);
}
for (const o of orphans) {
  fail(`manifest records ${o}, which nothing serves any more.`);
}

if (problems.length) {
  console.error(`check-asset-freshness: ${problems.length} problem(s).\n`);
  console.error(problems.map((p) => `  - ${p}`).join("\n"));
  console.error(
    `\nFix, in order:\n` +
      `  1. Bump the version that covers the changed file (the shared ?v= in index.html,\n` +
      `     its BODY_VERSIONS entry, POINTS_URL, BULLETIN_URL + HOME_BULLETIN_URL together,\n` +
      `     or the /img/ counter).\n` +
      `  2. npm --prefix scripts run assets:stamp\n` +
      `  3. Commit the regenerated scripts/data/asset-versions.json.`
  );
  process.exit(1);
}

console.log(
  `check-asset-freshness: ${assets.size} versioned asset(s) match their recorded ?v=` +
    ` (shared v${SHARED_VERSION}).`
);
