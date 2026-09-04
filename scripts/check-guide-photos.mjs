// =============================================================================
// Guard: every photo the Field Guide PWA references actually exists on disk,
// with the responsive ladder the app requests.
//
// The PWA never fetches a photo's original file. ResponsivePhoto derives the
// URLs it requests from the src with no manifest (utils/photo.ts), so a stop
// carrying `src: '/photos/foo.jpg'` sends the browser after
// /photos/responsive/foo-{400,800,1200,1600}.{avif,webp,jpg} instead. That
// indirection is why a missing photo is invisible in review: the src looks
// right, the code is right, and nothing fails until a buyer loads the page.
//
// At runtime the damage is quiet but real. ResponsivePhoto falls back to the
// "Photo coming" tile on error, so a card looks merely unfinished. The offline
// download packs do not: photo packs carry `tolerateMissing: 0` because every
// photo is paid content (offline/manifest.ts), so ONE dangling src makes its
// whole region pack fail permanently, and the error copy blames the buyer's
// connection. That shipped — camp-4.jpg and yosemite-village.jpg were wired
// onto stops as manifest slots that were never filled, and mirror-lake.jpg was
// deleted as wrong-subject in #235 without its stop being updated. Three
// missing files meant the Yosemite Valley pack could never complete.
//
// Errors (exit 1):
//   - a referenced /photos/ src with no source file
//   - a referenced src missing any of its 12 responsive variants
//   - zero references found at all (the scan's shape assumption broke)
//
// Warnings (exit 0): a referenced photo with no PHOTO_CREDITS entry. Since the
// September 2026 photo pass every shipped photo has one, so a new warning here
// means a photo was wired in without going through fetch-guide-photos.mjs (or
// ingest-photos.mjs for house photography); record its provenance.
//
// Also prints the outstanding photo-pass inventory: manifest slots with no
// file, and stops rendering the placeholder or another stop's photo. The
// numbers come from disk, so the count in a status report cannot go stale.
//
// Sources are read as text on purpose, like check-archive-citations.mjs: the
// content files are TypeScript with a zod parse at module load, so there is no
// cheap way to import them from a plain node script.
//
// Run: node check-guide-photos.mjs   (wired into `npm run check`)
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "apps/guide/src");
const PHOTOS_DIR = path.join(ROOT, "apps/guide/public/photos");
const RESPONSIVE_DIR = path.join(PHOTOS_DIR, "responsive");
const CREDITS_TS = path.join(SRC_DIR, "content/photoCredits.ts");
const MANIFEST = path.join(ROOT, "scripts/data/guide-photo-manifest.json");
const CONTENT = ["content/stops.ts", "content/secret-spots.ts"].map((f) =>
  path.join(SRC_DIR, f),
);

// Keep in sync with RESPONSIVE_WIDTHS in apps/guide/src/utils/photo.ts and
// gen-responsive-images.mjs. A width added there without a regenerate would
// otherwise 404 at runtime with nothing to catch it.
const WIDTHS = [400, 800, 1200, 1600];
const FORMATS = ["avif", "webp", "jpg"];

// Mirrors slugify() in utils/photo.ts, which is what derives the URLs the
// browser requests. Manifest filenames are already slug-form, so this is a
// no-op on everything shipping today; it stays here so a non-slug filename
// gets checked against the URL the app would actually ask for.
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// String literals only, comments skipped. A regex over the raw text would also
// match the `// "/photos/tunnel-view.jpg"` example in schema.ts and every
// header comment naming a file, so documenting a slot that is not filled yet
// would fail this check — the opposite of the point. Small state machine
// instead of a regex, so an escaped quote inside a caption can't end a literal
// early and leave the rest of the file mis-parsed as code.
function stringLiterals(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      i = src.indexOf("\n", i);
      if (i < 0) break;
    } else if (c === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      i = end < 0 ? src.length : end + 2;
    } else if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      let value = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") {
          value += src[j + 1] ?? "";
          j += 2;
          continue;
        }
        value += src[j];
        j++;
      }
      out.push(value);
      i = j + 1;
    } else {
      i++;
    }
  }
  return out;
}

// Every '/photos/...' literal anywhere in the app, not just the content files:
// REGIONS heroes live in content/index.ts and the storefront names sample
// images of its own, and any of them dangling costs the same.
const refs = new Map(); // src -> Set of files referencing it
for (const file of walk(SRC_DIR)) {
  const rel = path.relative(ROOT, file);
  for (const value of stringLiterals(fs.readFileSync(file, "utf8"))) {
    if (!value.startsWith("/photos/")) continue;
    if (!refs.has(value)) refs.set(value, new Set());
    refs.get(value).add(rel);
  }
}

const errors = [];
const warnings = [];

if (refs.size === 0) {
  errors.push(
    "no /photos/ references found under apps/guide/src — the scan's shape assumption broke, not a clean repo",
  );
}

const credited = new Set(
  fs.existsSync(CREDITS_TS)
    ? Array.from(
        fs.readFileSync(CREDITS_TS, "utf8").matchAll(/"(\/photos\/[^"]+)":/g),
        (m) => m[1],
      )
    : [],
);

for (const [src, where] of Array.from(refs).sort()) {
  const from = Array.from(where).sort().join(", ");
  const file = src.replace(/^\/photos\//, "");
  if (!fs.existsSync(path.join(PHOTOS_DIR, file))) {
    errors.push(`${src}: no such file in apps/guide/public/photos (${from})`);
    continue; // the ladder is guaranteed missing too; one error per photo
  }
  const slug = slugify(file);
  const missing = [];
  for (const w of WIDTHS) {
    for (const ext of FORMATS) {
      if (!fs.existsSync(path.join(RESPONSIVE_DIR, `${slug}-${w}.${ext}`))) {
        missing.push(`${slug}-${w}.${ext}`);
      }
    }
  }
  if (missing.length > 0) {
    errors.push(
      `${src}: ${missing.length} of ${WIDTHS.length * FORMATS.length} responsive variants missing ` +
        `(${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ", …" : ""}) — run \`npm run images\``,
    );
  }
  if (!credited.has(src)) {
    warnings.push(`${src}: no PHOTO_CREDITS entry (${from})`);
  }
}

// ---------------------------------------------------------------------------
// Outstanding photo-pass inventory. Not a failure: the pass is deliberately
// incomplete and tracked in LAUNCH-READINESS.md. Printed here so the number
// is read off disk rather than copied from a doc that drifts.
// ---------------------------------------------------------------------------

// A stop's `photos:` array, and the nearest preceding id, so an entry can be
// classified as photoless / dedicated / recycled from another stop's photo.
const ENTRY = /\n {2}\{\n/;
const ID = /id:\s*'([a-z0-9-]+)'/;
const SRCS = /src:\s*'([^']+)'/g;

const photoless = [];
const usedBy = new Map(); // src -> [ids]
for (const file of CONTENT) {
  if (!fs.existsSync(file)) continue;
  for (const block of fs.readFileSync(file, "utf8").split(ENTRY).slice(1)) {
    const id = block.match(ID)?.[1];
    if (!id) continue;
    const srcs = Array.from(block.matchAll(SRCS), (m) => m[1]);
    if (srcs.length === 0) photoless.push(id);
    for (const s of srcs) usedBy.set(s, [...(usedBy.get(s) ?? []), id]);
  }
}
// A photo whose filename matches one entry's id belongs to that entry; every
// other entry showing it is borrowing a neighbour's picture.
const recycled = [];
for (const [src, ids] of usedBy) {
  if (ids.length < 2) continue;
  const owner = slugify(src.replace(/^\/photos\//, ""));
  for (const id of ids) if (id !== owner) recycled.push(`${id} (shows ${src})`);
}

let unfilledSlots = [];
if (fs.existsSync(MANIFEST)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  unfilledSlots = manifest
    .filter((e) => !e.reuse && !fs.existsSync(path.join(PHOTOS_DIR, e.file)))
    .map((e) => `${e.slot} → ${e.file}`);
}

// ---------------------------------------------------------------------------

console.log(`Checked ${refs.size} photo reference(s) across apps/guide/src.`);
console.log(
  `Photo pass outstanding: ${unfilledSlots.length} unfilled manifest slot(s); ` +
    `${photoless.length} entr${photoless.length === 1 ? "y" : "ies"} render the placeholder; ` +
    `${recycled.length} show another entry's photo.`,
);
if (process.argv.includes("--verbose")) {
  const list = (label, items) => {
    if (items.length === 0) return;
    console.log(`\n${label}:`);
    for (const i of items.sort()) console.log(`  - ${i}`);
  };
  list("Unfilled manifest slots", unfilledSlots);
  list("Entries with no photo", photoless);
  list("Entries showing another entry's photo", recycled);
}

for (const w of warnings) console.warn(`warn: ${w}`);
if (warnings.length > 0) {
  console.warn(
    `warn: ${warnings.length} referenced photo(s) have no recorded author/license. ` +
      `See the attribution item in LAUNCH-READINESS.md.`,
  );
}

if (errors.length > 0) {
  console.error(`\n✗ guide photos: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    "\nA dangling src is not cosmetic: photo packs tolerate zero missing files, " +
      "so its region's offline download fails for good.",
  );
  process.exit(1);
}

console.log("✓ every referenced guide photo exists with its full responsive ladder");
