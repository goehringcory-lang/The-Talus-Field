// Parser for the Yosemite Nature Notes archive in /nature-notes.
//
// WHAT THE SOURCE IS
// 512 issues of "Yosemite Nature Notes" (July 1922 through the 1980s, plus one
// stray 2003 issue), extracted from the scanned PDFs hosted at yosemite.ca.us
// into markdown. Every file carries YAML front matter (volume, number,
// source_url) and a body of page-tagged plain text. All 512 extracted as real
// text rather than OCR, so the words are the words — what needs repairing is
// layout, not characters.
//
// FOUR THINGS ARE WRONG WITH THE SOURCE TEXT, AND THIS FILE FIXES ALL FOUR
//
// 1. "Yosemite" is shouted. Whoever produced the markdown ran a global,
//    case-insensitive replace of "yosemite" -> "YOSEMITE": 19,378 hits,
//    including inside the source_url ("https://www.YOSEMITE.ca.us/..."), which
//    is a link that does not resolve. Body prose is restored to "Yosemite";
//    lines that are entirely uppercase are left alone, because those are the
//    bulletin's headlines and were shouting to begin with.
//
// 2. Lines are hard-wrapped at the PDF's column width, so a paragraph arrives
//    as a dozen fragments and ~2,340 words are split across a line break with a
//    trailing hyphen. Blocks are re-flowed into paragraphs and the hyphens are
//    healed.
//
// 3. Headlines wrap too. "MAY WE SEND YOU EACH ISSUE OF YOSEMITE" / "NATURE
//    NOTES?" is one headline on the page and two lines in the file, so runs of
//    consecutive uppercase lines are merged into a single heading.
//
// 4. Page furniture is inline: bare page numbers, and running heads that the
//    scanner letter-spaced ("Y O S E M I T E  A S S O C I A T I O N"). Both are
//    dropped, the latter after being de-spaced so it can be recognised.
//
// DATES ARE READ FROM THE PAGE, NOT COMPUTED FROM THE VOLUME
// Volume N == 1921+N holds until about volume 40 and then falls apart: volume
// 44 is 1974, and volume 47 spans 1978-1984. So each issue's date is read off
// its own masthead, and only the masthead — page one, before the body starts.
// That restriction is load-bearing: volume 40 number 1 runs a "FROM 40 YEARS
// AGO" retrospective quoting the July 10, 1922 issue on page two, and a
// whole-document search happily dates a 1961 issue to 1922.
//
// Issues whose masthead yields no date (44 of 512) are given their volume's
// median year and marked `confidence: "inferred"`. Callers are expected to say
// so in the rendered page rather than presenting a guess as a fact: an archive
// that quietly invents dates is worse than one that admits a gap.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
export const SOURCE_DIR = path.join(ROOT, "nature-notes");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_RE = MONTHS.join("|");
const SEASONS = { spring: 4, summer: 7, fall: 10, autumn: 10, winter: 1 };
const SEASON_RE = Object.keys(SEASONS).join("|");

// Running heads the scanner repeated on every page. Matched after de-spacing
// and uppercasing, against the whole line.
const RUNNING_HEADS = [
  /^YOSEMITE NATURE NOTES$/,
  /^YOSEMITE NATURE NOTES[ ,.-]*\d*$/,
  /^YOSEMITE ASSOCIATION[, ].*$/,
  /^\d{1,3}$/, // bare page number
  /^[-–—\s]*\d{1,3}[-–—\s]*$/, // page number in rules or dashes
];

// ---------------------------------------------------------------------------
// Text repair
// ---------------------------------------------------------------------------

// True when a line is the bulletin's own shouting: at least two letters, and
// every letter in it is uppercase. Digits and punctuation do not vote.
function isAllCaps(line) {
  const letters = line.replace(/[^A-Za-z]/g, "");
  return letters.length >= 2 && letters === letters.toUpperCase();
}

// The scanner rendered some display type as spaced capitals
// ("S U M M E R"). Collapse any run of 3+ single letters separated by single
// spaces back into a word, so the line can be matched and read.
function collapseLetterSpacing(line) {
  return line.replace(/(?:\b[A-Za-z] ){2,}\b[A-Za-z]\b/g, (run) => run.replace(/ /g, ""));
}

// Undo the global case-insensitive replace described at the top of the file.
// Applied only to lines that are NOT entirely uppercase: in an all-caps
// headline "YOSEMITE" is what the bulletin actually printed.
function restoreYosemiteCase(line) {
  if (isAllCaps(line)) return line;
  return line
    // The masthead's own name, wherever it is cited mid-sentence.
    .replace(/YOSEMITE NATURE NOTES/g, "Yosemite Nature Notes")
    .replace(/YOSEMITE/g, "Yosemite");
}

function fixUrlCase(url) {
  // The same replace corrupted the archive URL's host and path.
  return String(url || "").replace(/YOSEMITE/g, "yosemite");
}

function isRunningHead(line) {
  const probe = collapseLetterSpacing(line).replace(/\s+/g, " ").trim().toUpperCase();
  return RUNNING_HEADS.some((re) => re.test(probe));
}

// Re-flow one run of hard-wrapped lines into a single string, healing words
// that were split across the break with a trailing hyphen.
function reflow(lines) {
  let out = "";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (!out) { out = line; continue; }
    if (/[A-Za-z]-$/.test(out)) {
      // "disap-" + "peared" -> "disappeared", but only when the continuation
      // is lowercase; an uppercase follower means a real compound that
      // happened to land on the break ("OUT-DOOR" / "RECREATION").
      if (/^[a-z]/.test(line)) { out = out.slice(0, -1) + line; continue; }
    }
    out += " " + line;
  }
  return out.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Block parsing
// ---------------------------------------------------------------------------

// Turn one issue's body into an ordered list of {type, text} blocks, one per
// paragraph or heading, with page furniture removed. `pages` records where each
// scanned page started so a citation can point at one.
function parseBlocks(body) {
  const rawLines = body.split(/\r?\n/);
  const blocks = [];
  let pageNo = 0;
  let run = [];       // lines accumulating into the current block
  let runIsCaps = null; // null = nothing buffered yet

  const flush = () => {
    if (!run.length) return;
    const text = reflow(run);
    run = [];
    const caps = runIsCaps;
    runIsCaps = null;
    if (!text) return;
    // A one- or two-character crumb is scanner noise, not content.
    if (text.replace(/[^A-Za-z0-9]/g, "").length < 3) return;
    // The masthead wraps ("YOSEMITE" / "NATURE NOTES"), so the running-head
    // test has to run again on the joined block — neither half matches alone.
    if (isRunningHead(text)) return;
    blocks.push({ type: caps ? "heading" : "para", text, page: pageNo });
  };

  for (const rawLine of rawLines) {
    const pageMark = rawLine.match(/^<!--\s*Page\s+(\d+)\s*-->$/);
    if (pageMark) { flush(); pageNo = Number(pageMark[1]); continue; }

    const line = rawLine.trim();
    if (!line) { flush(); continue; }
    if (isRunningHead(line)) { flush(); continue; }

    const cleaned = restoreYosemiteCase(collapseLetterSpacing(line));
    const caps = isAllCaps(cleaned);
    // A heading and the prose under it are different blocks even with no blank
    // line between them, which is the common case in this source.
    if (runIsCaps !== null && caps !== runIsCaps) flush();
    runIsCaps = caps;
    run.push(cleaned);
  }
  flush();

  // A heading with nothing under it and nothing above it is usually a stray
  // fragment of cover art; keep it only if real prose follows somewhere.
  return blocks;
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

function monthIndex(name) {
  return MONTHS.findIndex((m) => m.toLowerCase() === String(name).toLowerCase()) + 1;
}

// Read a date out of the masthead region only. See the header note: widening
// this to the whole document misdates every issue that reprints an old one.
//
// POSITION BEATS SPECIFICITY. The masthead date is printed above everything
// else on the cover, so the EARLIEST candidate wins, not the most precise one.
// Volume 17 number 3 is why: its cover reads "March, 1938" and then, in the
// caption under the cover photograph, "discovered in the Lyell Glacier on
// October 4, 1933". Trying the day-precision pattern first dates that issue to
// 1933 — five years early, and stated with more confidence than the truth.
function readMastheadDate(body) {
  // Page one, or the head of the file if it carries no page markers.
  const pages = body.split(/<!--\s*Page\s+\d+\s*-->/);
  const pageOne = (pages[1] || pages[0] || "").slice(0, 2000);
  const probe = collapseLetterSpacing(pageOne).replace(/\s+/g, " ");

  const candidates = [];
  const collect = (re, build) => {
    for (const m of probe.matchAll(re)) candidates.push({ at: m.index, ...build(m) });
  };

  collect(new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})\\s*,?\\s*(19\\d\\d|20\\d\\d)\\b`, "gi"), (m) => ({
    year: +m[3], month: monthIndex(m[1]), day: +m[2], precision: "day", rank: 0,
  }));
  collect(new RegExp(`\\b(${MONTH_RE})\\s*,?\\s*(19\\d\\d|20\\d\\d)\\b`, "gi"), (m) => ({
    year: +m[2], month: monthIndex(m[1]), day: null, precision: "month", rank: 1,
  }));
  collect(new RegExp(`\\b(${SEASON_RE})\\s*,?\\s*(19\\d\\d|20\\d\\d)\\b`, "gi"), (m) => ({
    year: +m[2], month: SEASONS[m[1].toLowerCase()], day: null,
    precision: "season", season: m[1], rank: 1,
  }));

  if (candidates.length) {
    // "March, 1938" and a day-precision read starting at the same offset are
    // the same printed date seen two ways; prefer the more specific one there.
    candidates.sort((a, b) => a.at - b.at || a.rank - b.rank);
    const { at, rank, ...date } = candidates[0];
    return date;
  }

  // No month anywhere on the cover. A bare four-digit number is a weak read —
  // it is as likely to be a quoted year, a catalogue number, or an address as
  // it is to be the issue date — so it is flagged and re-checked against the
  // rest of the volume in resolveMissingDates().
  const bare = probe.match(/\b(19\d\d|20\d\d)\b/);
  if (bare) return { year: +bare[1], month: null, day: null, precision: "year", weak: true };

  return null;
}

function formatDate(d) {
  if (!d) return null;
  if (d.precision === "day") return `${MONTHS[d.month - 1]} ${d.day}, ${d.year}`;
  if (d.precision === "month") return `${MONTHS[d.month - 1]} ${d.year}`;
  if (d.precision === "season") {
    const s = d.season.charAt(0).toUpperCase() + d.season.slice(1).toLowerCase();
    return `${s} ${d.year}`;
  }
  return String(d.year);
}

// ISO stamp for <time> and sitemap lastmod. Unknown month/day settle on
// January 1, which is a placeholder, not a claim — `precision` carries the
// truth and the rendered page shows only what was actually read.
function isoDate(d) {
  const mm = String(d.month || 1).padStart(2, "0");
  const dd = String(d.day || 1).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!kv) continue;
    meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

export function loadIssues({ dir = SOURCE_DIR } = {}) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d+-\d+\.pdf\.md$/.test(f))
    .sort((a, b) => {
      const [av, an] = a.replace(".pdf.md", "").split("-").map(Number);
      const [bv, bn] = b.replace(".pdf.md", "").split("-").map(Number);
      return av - bv || an - bn;
    });

  const issues = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    // Drop the "# YOSEMITE NATURE NOTES Vol. N No. M" line the extractor added;
    // the page writes its own heading from the parsed volume and date.
    const withoutTitle = body.replace(/^\s*#\s+.*\r?\n/, "");

    const [volume, number] = file.replace(".pdf.md", "").split("-").map(Number);
    const blocks = parseBlocks(withoutTitle);
    const stated = readMastheadDate(withoutTitle);

    return {
      file,
      volume,
      number,
      sourceUrl: fixUrlCase(meta.source_url),
      pdfFilename: meta.pdf_filename || file.replace(/\.md$/, ""),
      blocks,
      headings: blocks.filter((b) => b.type === "heading").map((b) => b.text),
      wordCount: blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0),
      date: stated ? { ...stated, confidence: "stated" } : null,
    };
  });

  resolveMissingDates(issues);
  for (const issue of issues) {
    issue.dateDisplay = formatDate(issue.date);
    issue.iso = isoDate(issue.date);
    issue.year = issue.date.year;
    issue.slug = `vol-${issue.volume}-no-${issue.number}`;
    issue.path = `/archive/${issue.year}/${issue.slug}/`;
  }
  return issues;
}

// Fill undated issues from their volume, and demote dates that disagree
// violently with their volume-mates (a masthead year misread by the extractor).
// Both outcomes are marked `inferred` so the page can label them.
function resolveMissingDates(issues) {
  const byVolume = new Map();
  for (const i of issues) {
    if (!byVolume.has(i.volume)) byVolume.set(i.volume, []);
    byVolume.get(i.volume).push(i);
  }

  for (const [, group] of byVolume) {
    // Anchor on issues whose masthead gave a month as well as a year: a bare
    // four-digit year is the weakest read and the likeliest to be a stray
    // number picked up off the cover.
    const anchors = group.filter((i) => i.date && i.date.precision !== "year").map((i) => i.date.year);
    const pool = anchors.length ? anchors : group.filter((i) => i.date).map((i) => i.date.year);
    if (!pool.length) continue;
    const sorted = [...pool].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    const infer = () => ({
      year: median, month: null, day: null, precision: "year", confidence: "inferred",
    });

    for (const i of group) {
      if (!i.date) { i.date = infer(); continue; }
      // A bare-year read has to agree closely with its volume-mates to stand.
      // Volume 3 number 5 is why: its cover carries no month at all, and the
      // first four-digit number on it dates the issue to 1920, four years
      // before the volume it belongs to.
      if (i.date.weak && Math.abs(i.date.year - median) > 1) { i.date = infer(); continue; }
      // Backstop for a badly misread masthead. The window stays wide because
      // volume 47 genuinely spans 1978-1987; it only needs to catch a read
      // that lands in another decade entirely.
      if (Math.abs(i.date.year - median) > 8) i.date = infer();
    }
  }
}

// Group issues into decades for the archive landing page.
export function groupByDecade(issues) {
  const decades = new Map();
  for (const i of issues) {
    const d = Math.floor(i.year / 10) * 10;
    if (!decades.has(d)) decades.set(d, []);
    decades.get(d).push(i);
  }
  return [...decades.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([decade, list]) => ({ decade, issues: list }));
}

export function groupByYear(issues) {
  const years = new Map();
  for (const i of issues) {
    if (!years.has(i.year)) years.set(i.year, []);
    years.get(i.year).push(i);
  }
  return [...years.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, list]) => ({ year, issues: list }));
}
