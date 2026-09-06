// =============================================================================
// Guard: the campsite-watch registry and its PWA mirror agree.
//
// The Field Guide's Openings tab lets a buyer watch a campground for a site
// opening. The Worker owns the registry (workers/src/data/campgrounds.ts):
// the recreation.gov id it polls, the availability model, and the map amenity
// the pin links from. The PWA mirrors that table by hand
// (apps/guide/src/watch/targets.ts) so the form, the list, and the map popup
// render offline, and the repo deliberately has no shared package to keep
// them in step. Nothing at runtime can catch the drift: a campground present
// in the mirror and missing from the registry is a form that always answers
// "Pick a campground from the list", and a mismatched rgId is a watch that
// polls the wrong campground and alerts on somebody else's sites.
//
// It reads the TypeScript as text, the same trade-off (and for the same
// reason) as check-trip-bridge.mjs: both files are one entry per line in a
// fixed field order, and a zero count fails loudly rather than reporting
// perfect parity against an empty set.
//
// Run: node check-watch-targets.mjs   (wired into `npm run check`)
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = path.join(ROOT, "workers/src/data/campgrounds.ts");
const MIRROR = path.join(ROOT, "apps/guide/src/watch/targets.ts");
const AMENITIES = path.join(ROOT, "apps/guide/src/content/amenities.ts");

const verbose = process.argv.includes("--verbose");
const errors = [];
const warnings = [];

// One entry per line, fixed field order: the header comment in both files
// says so, and this pattern is why.
const ROW =
  /^\s*\{ id: '([a-z0-9-]+)', name: '([^']+)', rgId: (\d+), model: '(site|person)', amenityId: '([a-z0-9-]+)', release: '([a-z0-9-]+)' \},?\s*$/gm;

function rowsFrom(file, label) {
  if (!fs.existsSync(file)) {
    errors.push(`missing source: ${path.relative(ROOT, file)}`);
    return new Map();
  }
  const src = fs.readFileSync(file, "utf8");
  const rows = new Map();
  for (const m of src.matchAll(ROW)) {
    const [, id, name, rgId, model, amenityId, release] = m;
    if (rows.has(id)) errors.push(`${label}: duplicate id ${id}`);
    rows.set(id, { id, name, rgId: Number(rgId), model, amenityId, release });
  }
  if (rows.size === 0) {
    errors.push(
      `parsed 0 ${label} rows from ${path.relative(ROOT, file)} — the row shape changed and this check is now blind. ` +
        `Fix the pattern before trusting a parity number.`,
    );
  }
  return rows;
}

// Amenity ids paired with their kind: an `id:` line followed by the entry's
// `kind:` line, the way every amenity in the seed is written.
function campingAmenityIds() {
  if (!fs.existsSync(AMENITIES)) {
    errors.push(`missing source: ${path.relative(ROOT, AMENITIES)}`);
    return new Set();
  }
  const src = fs.readFileSync(AMENITIES, "utf8");
  const camping = new Set();
  let lastId = null;
  for (const line of src.split("\n")) {
    const id = line.match(/^\s*id: '([a-z0-9-]+)'/);
    if (id) {
      lastId = id[1];
      continue;
    }
    const kind = line.match(/^\s*kind: '([a-z-]+)'/);
    if (kind && lastId) {
      if (kind[1] === "camping") camping.add(lastId);
      lastId = null;
    }
  }
  if (camping.size === 0) {
    errors.push("parsed 0 camping amenities from amenities.ts — the seed shape changed and this check is now blind.");
  }
  return camping;
}

const registry = rowsFrom(REGISTRY, "registry");
const mirror = rowsFrom(MIRROR, "mirror");
const camping = campingAmenityIds();

if (errors.length) {
  console.error(`check-watch-targets: ${errors.length} problem(s) reading the tables:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

// --- parity (errors) --------------------------------------------------------

for (const id of registry.keys()) {
  if (!mirror.has(id)) errors.push(`registry has ${id}; the PWA mirror does not — the map pin and the form cannot offer it.`);
}
for (const id of mirror.keys()) {
  if (!registry.has(id)) errors.push(`mirror has ${id}; the Worker registry does not — the form offers a campground the API refuses.`);
}
for (const [id, row] of registry) {
  const other = mirror.get(id);
  if (!other) continue;
  for (const field of ["name", "rgId", "model", "amenityId", "release"]) {
    if (row[field] !== other[field]) {
      errors.push(`${id}.${field} differs: registry ${JSON.stringify(row[field])}, mirror ${JSON.stringify(other[field])}.`);
    }
  }
}

const rgIds = new Map();
for (const row of registry.values()) {
  if (rgIds.has(row.rgId)) errors.push(`rgId ${row.rgId} is shared by ${rgIds.get(row.rgId)} and ${row.id}; one recreation.gov campground under two names.`);
  rgIds.set(row.rgId, row.id);
  if (!camping.has(row.amenityId)) {
    errors.push(`${row.id} points at amenity "${row.amenityId}", which is not a camping amenity in amenities.ts.`);
  }
}

// --- coverage (warning) -----------------------------------------------------

const targeted = new Set([...registry.values()].map((r) => r.amenityId));
for (const id of camping) {
  if (!targeted.has(id)) warnings.push(`camping amenity "${id}" has no watch target — its map pin offers no "Watch for openings".`);
}

// --- report ------------------------------------------------------------------

if (verbose) {
  console.log(`\nRegistry (${registry.size}):`);
  for (const r of registry.values()) console.log(`  ${r.id} — ${r.name} (rgId ${r.rgId}, ${r.model}, ${r.amenityId})`);
  console.log("");
}

for (const w of warnings) console.warn(`warn: ${w}`);

if (errors.length) {
  console.error(`\n✗ watch targets: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("\nA watch on a mismatched table polls the wrong campground or refuses the right one; fix both files together.");
  process.exit(1);
}

console.log(
  `✓ watch targets: ${registry.size}/${mirror.size} campgrounds mirrored, ${targeted.size}/${camping.size} camping amenities watchable` +
    (warnings.length ? `, ${warnings.length} without a target` : "") +
    ".",
);
