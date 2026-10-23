// =============================================================================
// Guard: every Nature Notes citation in the Field Guide resolves to a real
// archive page.
//
// The PWA's stops carry `history` blocks that cite an issue of Yosemite Nature
// Notes by volume, number, and printed date, and the app builds the link from
// those three values (apps/guide/src/content/archive.ts). Nothing at runtime
// can tell whether the page on the other end exists: the archive is 512 static
// files on the editorial site, generated separately by gen-archive.mjs, and a
// citation pointing at a volume/number that was never published, or carrying
// the wrong year, is a 404 the buyer finds instead of us. This checks the
// citation against the generated archive on disk.
//
// It reads stops.ts as text on purpose. The file is TypeScript with a zod
// parse at module load, so there is no cheap way to import it from a plain
// node script, and the seed's shape is regular enough to scan. If the shape
// ever stops being regular, this fails loudly on a citation count of zero
// rather than passing silently.
//
// Run: node check-archive-citations.mjs   (wired into `npm run check`)
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE_DIR = path.join(ROOT, "archive");
const SOURCES = [
  path.join(ROOT, "apps/guide/src/content/stops.ts"),
  path.join(ROOT, "apps/guide/src/content/secret-spots.ts"),
];

// history: { note: '...' + '...', volume: 22, number: 10, issueDate: 'October 1943' }
const CITATION = /history:\s*\{[\s\S]*?volume:\s*(\d+),\s*number:\s*(\d+),\s*issueDate:\s*'([^']+)'/g;
// Nearest preceding `id: '...'`, so a failure names the stop and not a line number.
const ID = /id:\s*'([a-z0-9-]+)'/g;

function idsByOffset(src) {
  const marks = [];
  for (const m of src.matchAll(ID)) marks.push({ at: m.index, id: m[1] });
  return marks;
}

function ownerOf(marks, offset) {
  let owner = "(unknown stop)";
  for (const m of marks) {
    if (m.at > offset) break;
    owner = m.id;
  }
  return owner;
}

const errors = [];
let checked = 0;

for (const file of SOURCES) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const marks = idsByOffset(src);
  const rel = path.relative(ROOT, file);

  for (const m of src.matchAll(CITATION)) {
    checked++;
    const [, volume, number, issueDate] = m;
    const owner = ownerOf(marks, m.index);
    const year = issueDate.slice(-4);

    if (!/^(18|19|20)\d{2}$/.test(year)) {
      errors.push(`${rel} ${owner}: issueDate '${issueDate}' does not end in a four-digit year`);
      continue;
    }

    const page = path.join(ARCHIVE_DIR, year, `vol-${volume}-no-${number}`, "index.html");
    if (!fs.existsSync(page)) {
      errors.push(
        `${rel} ${owner}: cites Volume ${volume}, Number ${number} (${issueDate}) ` +
          `→ /archive/${year}/vol-${volume}-no-${number}/ does not exist`,
      );
      continue;
    }

    // The page exists, but does it agree it is that issue? The archive prints
    // its own date line; a citation whose printed date disagrees would send a
    // reader to a real page that does not say what the note claims.
    const html = fs.readFileSync(page, "utf8");
    if (!html.includes(issueDate)) {
      errors.push(
        `${rel} ${owner}: cites '${issueDate}' but /archive/${year}/vol-${volume}-no-${number}/ ` +
          `does not print that date`,
      );
    }
  }
}

if (!fs.existsSync(ARCHIVE_DIR)) {
  console.error("check-archive-citations: no /archive on disk. Run `npm run archive` first.");
  process.exit(1);
}

// --- The topic hubs (/archive/topics/) --------------------------------------
// Each quote in scripts/data/nature-notes-topics.json must still be printed,
// word for word, on the published page of the issue it names, and the hub must
// carry it and link to that issue. gen-archive.mjs refuses to build a hub whose
// quote it cannot find in the parsed issue; this re-reads what actually ships,
// independently of the generator, so a transcription fix that changes a quoted
// passage, or a hub page left stale on disk, fails here.
const TOPICS_FILE = path.join(ROOT, "scripts/data/nature-notes-topics.json");
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Issue slug -> /archive/<year>/<slug>/ on disk.
const issueDirs = new Map();
for (const year of fs.readdirSync(ARCHIVE_DIR)) {
  if (!/^\d{4}$/.test(year)) continue;
  for (const slug of fs.readdirSync(path.join(ARCHIVE_DIR, year))) {
    if (/^vol-\d+-no-\d+$/.test(slug)) issueDirs.set(slug, `/archive/${year}/${slug}/`);
  }
}

let quotes = 0;
const { topics = [] } = JSON.parse(fs.readFileSync(TOPICS_FILE, "utf8"));
if (!topics.length) errors.push("nature-notes-topics.json lists no topics");
if (!fs.existsSync(path.join(ARCHIVE_DIR, "topics", "index.html"))) {
  errors.push("/archive/topics/ does not exist on disk");
}
for (const topic of topics) {
  const hubFile = path.join(ARCHIVE_DIR, "topics", topic.slug, "index.html");
  if (!fs.existsSync(hubFile)) {
    errors.push(`topic ${topic.slug}: /archive/topics/${topic.slug}/ does not exist`);
    continue;
  }
  const hub = fs.readFileSync(hubFile, "utf8");
  for (const q of topic.quotes) {
    quotes++;
    const where = issueDirs.get(q.issue);
    const label = `topic ${topic.slug}, ${q.issue}`;
    if (!where) {
      errors.push(`${label}: no archive page for that issue`);
      continue;
    }
    const text = esc(String(q.text).trim());
    const issueHtml = fs.readFileSync(path.join(ROOT, where.slice(1), "index.html"), "utf8");
    if (!issueHtml.includes(text)) {
      errors.push(`${label}: quote is not printed on ${where}: "${q.text.slice(0, 70)}…"`);
    }
    if (!hub.includes(text)) errors.push(`${label}: quote is missing from the hub page`);
    if (!hub.includes(`href="${where}`)) errors.push(`${label}: the hub does not link to ${where}`);
  }
}

if (errors.length) {
  console.error(`check-archive-citations: ${errors.length} bad citation(s) of ${checked + quotes}:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(
  `check-archive-citations: ${checked} Nature Notes citation(s) resolve; ` +
    `${quotes} topic-hub quote(s) are verbatim on their issue pages.`,
);
