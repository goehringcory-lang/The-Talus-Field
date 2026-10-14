// =============================================================================
// Content-hash cache-busters for the editorial site's scripts and stylesheet.
//
// Until October 2026 every script and the stylesheet shared ONE ?v=N, bumped
// by hand on every PR. Two PRs touching unrelated files therefore edited the
// same lines, and the second to merge always conflicted (or raced the first to
// the same N). Of 150 PRs merged September 1 to October 14, 2026, 20 pairs
// collided that way; 9 of them shared no asset at all
// (analysis/CONTENT-HASH-VERSIONS-SCOPE.md).
//
// Now each asset's ?v= is the first 10 hex characters of the SHA-256 of its own
// bytes, written here and never by hand. A version cannot go stale, there is
// nothing to bump, and two PRs only touch the same hash when they touch the
// same file.
//
// TWO PLACES, ONE RULE
//   1. The eager tags in index.html (<script src="/x.js?v=HASH"> and the
//      stylesheet <link>): each carries its own file's hash.
//   2. The lazy bundles in app.jsx's PAGE_MODULES, injected at runtime: their
//      hashes live in the generated <script type="application/json"
//      id="asset-hashes"> block in index.html, which app.jsx reads at boot.
//      app.js itself holds no hashes, so editing a page bundle never changes
//      app.js's own hash.
//
// Every tag and every block entry sits on its own line with a blank line
// between them: git conflicts on changes to adjacent lines and merges cleanly
// when one unchanged line separates them. Keep the spacing.
//
// Not covered here (they keep their own counters, guarded by
// check-asset-freshness.mjs): article bodies (BODY_VERSIONS), POINTS_URL, the
// bulletin consts, and the /img/ counter.
//
// Run after `compile` and `home-shell` (it hashes dist/ output and rewrites
// index.html):
//   node gen-asset-hashes.mjs           # write (npm run assets:stamp)
//   node gen-asset-hashes.mjs --check   # fail if any hash is stale (npm run check)
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CHECK = process.argv.includes("--check");

const BEGIN = "<!-- GENERATED:ASSET-HASHES (scripts/gen-asset-hashes.mjs; do not hand-edit) -->";
const END = "<!-- /GENERATED:ASSET-HASHES -->";

const problems = [];

function hashOf(servedPath) {
  const file = path.join(ROOT, servedPath.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    problems.push(`${servedPath} is referenced but ${path.relative(ROOT, file)} does not exist`);
    return "missing";
  }
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
}

const before = fs.readFileSync(INDEX, "utf8");

// 1. Eager tags. Same-origin .js/.css only; the /img/ counter is not touched.
let html = before.replace(
  /((?:src|href)="(\/[^"?]+\.(?:js|css))\?v=)[^"]*(")/g,
  (_, head, servedPath, tail) => `${head}${hashOf(servedPath)}${tail}`
);

// 2. The lazy bundles, read from app.jsx's PAGE_MODULES table.
const appJsx = fs.readFileSync(path.join(ROOT, "app.jsx"), "utf8");
const modulesBlock = appJsx.match(/const PAGE_MODULES = \{([\s\S]*?)\n\};/);
if (!modulesBlock) {
  console.error("gen-asset-hashes: could not find PAGE_MODULES in app.jsx (has it been renamed?)");
  process.exit(1);
}
const lazy = [
  ...new Set(
    [...modulesBlock[1].matchAll(/scripts:\s*\[([^\]]*)\]/g)].flatMap((m) =>
      [...m[1].matchAll(/"([^"]+)"/g)].map((p) => p[1])
    )
  ),
].sort();
if (!lazy.length) {
  console.error("gen-asset-hashes: PAGE_MODULES parsed to zero scripts");
  process.exit(1);
}

const entries = lazy.map((p) => `${JSON.stringify(p)}: ${JSON.stringify(hashOf(p))}`);
const block =
  `${BEGIN}\n` +
  `  <script type="application/json" id="asset-hashes">{\n` +
  entries.join(",\n\n") +
  `\n}</script>\n` +
  `  ${END}`;

const start = html.indexOf(BEGIN);
const end = html.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error(`gen-asset-hashes: index.html is missing the ${BEGIN} ... ${END} markers`);
  process.exit(1);
}
html = html.slice(0, start) + block + html.slice(end + END.length);

if (problems.length) {
  console.error(`gen-asset-hashes:\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}

const eagerCount = (html.match(/(?:src|href)="\/[^"?]+\.(?:js|css)\?v=[0-9a-f]{10}"/g) || []).length;

if (CHECK) {
  if (html !== before) {
    console.error(
      `gen-asset-hashes: index.html carries stale asset hashes.\n` +
        `A script, the stylesheet, or a PAGE_MODULES bundle changed since the hashes were written.\n` +
        `Fix: npm --prefix scripts run assets:stamp, then commit index.html.`
    );
    process.exit(1);
  }
  console.log(`gen-asset-hashes: ${eagerCount} eager tag(s) and ${lazy.length} lazy bundle(s) carry current hashes.`);
  process.exit(0);
}

fs.writeFileSync(INDEX, html);
console.log(
  `gen-asset-hashes: ${html === before ? "no change" : "updated index.html"} ` +
    `(${eagerCount} eager tag(s), ${lazy.length} lazy bundle(s)).`
);
