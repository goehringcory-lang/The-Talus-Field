// =============================================================================
// Guard: the editorial → Field Guide trip hand-off keeps resolving.
//
// The map at /map lets a reader build a trip out of points.geojson pins and
// hand it to the paid guide as /trip?import=id1,id2. On the far side,
// apps/guide/src/trip/importTrip.ts resolves each incoming pin id through an
// alias table, then stops, then hikes, and reports whatever it could not carry
// across rather than guessing at a turnout.
//
// Nothing on the publishing side has ever measured that bridge. The only guard
// lived inside importTrip.ts itself, behind `import.meta.env.DEV`: a
// console.error in a browser nobody has open, checking stale aliases only. So
// the two failure modes both landed silently on a buyer:
//
//   1. An alias whose target was renamed in stops.ts/hikes.ts degrades to
//      "isn't in the guide" — missing content, not a broken table. This is now
//      an ERROR, which is what the dev-only guard always wanted to be.
//   2. A pin added to points.geojson that the bridge was never taught about
//      falls back to its RAW ID, so the reader is told "the-fen didn't come
//      across". Declared editorial-only pins carry a real label for exactly
//      this reason; an undeclared one is the leak. That is a WARNING, because
//      a pin with no guide counterpart is legitimate — what is not legitimate
//      is nobody knowing about it.
//
// It reads the TypeScript as text, the same trade-off (and for the same reason)
// as check-archive-citations.mjs: these files are zod-validated at module load,
// so a plain node script cannot cheaply import them. Both catalogs are scanned
// with a line-anchored `id:` pattern that was verified exact against the seed
// counts, and a zero count fails loudly rather than reporting perfect coverage
// against an empty set.
//
// Run: node check-trip-bridge.mjs   (wired into `npm run check`)
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POINTS = path.join(ROOT, "points.geojson");
const IMPORT_TRIP = path.join(ROOT, "apps/guide/src/trip/importTrip.ts");
const STOP_SOURCES = [
  path.join(ROOT, "apps/guide/src/content/stops.ts"),
  path.join(ROOT, "apps/guide/src/content/secret-spots.ts"),
];
const HIKE_SOURCES = [path.join(ROOT, "apps/guide/src/content/hikes.ts")];

const verbose = process.argv.includes("--verbose");
const errors = [];
const warnings = [];

// --- inputs ------------------------------------------------------------------

// Line-anchored: every entry id in these seeds sits at object-property depth,
// and no nested `id:` fields exist. Anchoring keeps a future nested id from
// silently inflating the catalog and hiding a real miss.
const ID_LINE = /^\s*id: '([a-z0-9-]+)'/gm;

function idsFrom(files, label) {
  const ids = new Set();
  for (const file of files) {
    if (!fs.existsSync(file)) {
      errors.push(`missing source: ${path.relative(ROOT, file)}`);
      continue;
    }
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(ID_LINE)) ids.add(m[1]);
  }
  if (ids.size === 0) {
    errors.push(
      `parsed 0 ${label} ids — the seed shape changed and this check is now blind. ` +
        `Fix the id pattern before trusting a coverage number.`,
    );
  }
  return ids;
}

// `const NAME: Record<string, string> = { ... }` → Map of the quoted pairs.
function tableFrom(src, name) {
  const block = src.match(new RegExp(`const ${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`));
  const table = new Map();
  if (!block) {
    errors.push(`could not find ${name} in importTrip.ts — the bridge cannot be verified`);
    return table;
  }
  for (const m of block[1].matchAll(/^\s*'?([a-z0-9-]+)'?:\s*(?:'([^']*)'|"([^"]*)")/gm)) {
    table.set(m[1], m[2] ?? m[3]);
  }
  return table;
}

if (!fs.existsSync(POINTS)) {
  console.error("check-trip-bridge: points.geojson not found.");
  process.exit(1);
}
if (!fs.existsSync(IMPORT_TRIP)) {
  console.error("check-trip-bridge: apps/guide/src/trip/importTrip.ts not found.");
  process.exit(1);
}

const geo = JSON.parse(fs.readFileSync(POINTS, "utf8"));
const pins = (geo.features ?? [])
  .map((f) => ({ id: f?.properties?.id, name: f?.properties?.name }))
  .filter((p) => typeof p.id === "string" && p.id);

if (pins.length === 0) {
  console.error("check-trip-bridge: points.geojson carries no pin ids.");
  process.exit(1);
}

const importSrc = fs.readFileSync(IMPORT_TRIP, "utf8");
const aliases = tableFrom(importSrc, "EDITORIAL_ALIASES");
const editorialOnly = tableFrom(importSrc, "EDITORIAL_ONLY_LABELS");
const stopIds = idsFrom(STOP_SOURCES, "stop");
const hikeIds = idsFrom(HIKE_SOURCES, "hike");

if (errors.length) {
  console.error(`check-trip-bridge: ${errors.length} problem(s) reading the bridge:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const pinIds = new Set(pins.map((p) => p.id));
const nameById = new Map(pins.map((p) => [p.id, p.name]));
const resolves = (id) => stopIds.has(id) || hikeIds.has(id);

// --- alias table integrity (errors) -----------------------------------------

for (const [from, to] of aliases) {
  if (!resolves(to)) {
    errors.push(
      `alias ${from} → ${to} resolves to nothing. The pin will report as "isn't in the guide", ` +
        `which reads to a buyer as missing content rather than a broken table.`,
    );
  }
  // Resolution order is alias-first, so an alias keyed on an id the guide also
  // carries outright would silently redirect a real entry somewhere else.
  if (resolves(from) && aliases.get(from) !== from) {
    errors.push(
      `alias ${from} → ${to} shadows a real guide entry with the same id (${from}). ` +
        `Alias lookup runs before the catalogs, so the reader gets ${to} instead of ${from}.`,
    );
  }
}

// --- coverage (warnings) -----------------------------------------------------

const asStop = [];
const asHike = [];
const declaredMisses = [];
const undeclaredMisses = [];

for (const pin of pins) {
  const target = aliases.get(pin.id) ?? pin.id;
  if (stopIds.has(target)) asStop.push(pin.id);
  else if (hikeIds.has(target)) asHike.push(pin.id);
  else if (editorialOnly.has(pin.id)) declaredMisses.push(pin.id);
  else undeclaredMisses.push(pin.id);
}

for (const id of undeclaredMisses) {
  warnings.push(
    `pin "${id}" (${nameById.get(id) ?? "unnamed"}) has no guide counterpart and no ` +
      `EDITORIAL_ONLY_LABELS entry — the import tells the reader "${id} didn't come across", raw id and all. ` +
      `Add a label, or an alias if the guide does carry the place under another name.`,
  );
}

// Stale rows: dead weight that also means the table stopped describing the map.
for (const from of aliases.keys()) {
  if (!pinIds.has(from)) {
    warnings.push(`alias key "${from}" is not a pin in points.geojson any more — the row never fires.`);
  }
}
for (const id of editorialOnly.keys()) {
  if (!pinIds.has(id)) {
    warnings.push(`EDITORIAL_ONLY_LABELS entry "${id}" is not a pin in points.geojson any more.`);
  } else if (resolves(aliases.get(id) ?? id)) {
    warnings.push(
      `EDITORIAL_ONLY_LABELS entry "${id}" now resolves in the guide, so its label is dead code.`,
    );
  }
}

// --- report ------------------------------------------------------------------

const carried = asStop.length + asHike.length;
const pct = Math.round((carried / pins.length) * 100);

if (verbose) {
  const list = (label, ids) => {
    if (!ids.length) return;
    console.log(`\n${label} (${ids.length}):`);
    for (const id of ids) console.log(`  ${id}${nameById.get(id) ? ` — ${nameById.get(id)}` : ""}`);
  };
  list("Crosses over as a stop", asStop);
  list("Crosses over as a hike", asHike);
  list("Declared editorial-only", declaredMisses);
  list("Undeclared misses", undeclaredMisses);
  console.log("");
}

for (const w of warnings) console.warn(`warn: ${w}`);

if (errors.length) {
  console.error(`\n✗ trip bridge: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    "\nThe hand-off is the one path from the free map into the paid guide; " +
      "a broken row there costs a buyer the trip they just built.",
  );
  process.exit(1);
}

console.log(
  `✓ trip bridge: ${carried}/${pins.length} editorial pins (${pct}%) cross over ` +
    `— ${asStop.length} stop, ${asHike.length} hike, ${declaredMisses.length} declared editorial-only` +
    (undeclaredMisses.length ? `, ${undeclaredMisses.length} undeclared` : "") +
    `; ${aliases.size} alias(es) resolve.`,
);
