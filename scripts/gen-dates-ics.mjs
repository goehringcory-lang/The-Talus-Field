#!/usr/bin/env node
// =============================================================================
// gen-dates-ics.mjs: the deadline table's two generated mirrors.
//
// Source of truth: scripts/data/deadlines.json (FEATURE-RESEARCH-2026-09.md,
// feature 1). This writes:
//
//   dates-data.js       window.DEADLINES, the raw (uncompiled) data script the
//                       /dates route loads through PAGE_MODULES, like
//                       itineraries-data.js. The page's resolver functions live
//                       in page-dates.jsx; this file carries data only.
//   ics/<id>.ics        one calendar file per fixed window (kinds `annual`,
//                       `rule`, `season`), and
//   ics/yosemite-dates.ics  all of them in one file.
//
// The `relative` and `release-15th` rows depend on the reader's own trip date
// and are built in the browser by page-dates.jsx, never here.
//
// Deterministic on purpose: `--check` byte-compares the output, so nothing in
// this file may read the clock. DTSTAMP is the table's `verified` date, and the
// rule-based rows (the Half Dome cables season) are emitted for the explicit
// years in RULE_YEARS rather than "this year and next". Add a year to that
// list each autumn; the check fails loudly if a listed year has passed the
// table's verified date by more than two years, which is the reminder.
//
// Usage: node gen-dates-ics.mjs [--check]
// =============================================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECK = process.argv.includes("--check");

const SRC = path.join(__dirname, "data", "deadlines.json");
const table = JSON.parse(readFileSync(SRC, "utf8"));

// Years the rule-based rows are written out for. Two at a time keeps the
// calendar useful across a season boundary without pretending to know 2030.
const RULE_YEARS = [2026, 2027];

const KINDS = new Set(["annual", "relative", "release-15th", "rule", "season"]);
const CONF = new Set(["published", "typical"]);

function fail(msg) {
  console.error(`gen-dates-ics: ${msg}`);
  process.exit(1);
}

// ---- validation --------------------------------------------------------------
if (!/^\d{4}-\d{2}-\d{2}$/.test(table.verified || "")) fail("`verified` must be YYYY-MM-DD");
if (!Array.isArray(table.items) || !table.items.length) fail("`items` is empty");
const seen = new Set();
for (const it of table.items) {
  if (!it.id || seen.has(it.id)) fail(`duplicate or missing id: ${it.id}`);
  seen.add(it.id);
  if (!KINDS.has(it.kind)) fail(`${it.id}: unknown kind ${it.kind}`);
  if (!CONF.has(it.confidence)) fail(`${it.id}: unknown confidence ${it.confidence}`);
  if (!/^https:\/\/www\.nps\.gov\//.test(it.source)) fail(`${it.id}: source must be an nps.gov page`);
  if (!it.title || !it.detail || !it.tag) fail(`${it.id}: title, detail and tag are required`);
  if (/—/.test(it.title + it.detail)) fail(`${it.id}: em-dash in copy (house style)`);
  if (it.kind === "annual" && !(it.start?.month && it.start?.day && it.end?.month && it.end?.day)) fail(`${it.id}: annual needs start/end {month, day}`);
  if (it.kind === "relative" && typeof it.offsetDays !== "number") fail(`${it.id}: relative needs offsetDays`);
  if (it.kind === "release-15th" && typeof it.monthsAhead !== "number") fail(`${it.id}: release-15th needs monthsAhead`);
  if (it.kind === "rule" && it.rule !== "cables-season") fail(`${it.id}: unknown rule ${it.rule}`);
  if (it.kind === "season") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(it.start) || !/^\d{4}-\d{2}-\d{2}$/.test(it.end)) fail(`${it.id}: season needs ISO start/end`);
    if (it.year !== Number(it.start.slice(0, 4))) fail(`${it.id}: year must match start`);
  }
}
const verifiedYear = Number(table.verified.slice(0, 4));
for (const y of RULE_YEARS) {
  if (y < verifiedYear) fail(`RULE_YEARS lists ${y}, before the table's verified year; drop it`);
  if (y > verifiedYear + 2) fail(`RULE_YEARS lists ${y}, more than two years past verified; the table needs re-verifying first`);
}

// ---- date helpers (UTC arithmetic on calendar dates; no clock) ---------------
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
const utc = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

// Half Dome cables: up the Friday before Memorial Day (the last Monday in May),
// down the day after the second Monday in October. hdpermits.htm.
export function cablesSeason(year) {
  let d = utc(year, 5, 31);
  while (d.getUTCDay() !== 1) d = addDays(d, -1); // last Monday in May
  const up = addDays(d, -3); // the Friday before
  let oct = utc(year, 10, 1);
  while (oct.getUTCDay() !== 1) oct = addDays(oct, 1); // first Monday
  const secondMonday = addDays(oct, 7);
  const down = addDays(secondMonday, 1);
  return { up, down };
}

// ---- ICS ---------------------------------------------------------------------
const PRODID = "-//The Talus Field//Yosemite Dates//EN";
const UID_HOST = "dates.thetalusfieldjournal.com";
const STAMP = `${table.verified.replace(/-/g, "")}T000000Z`;

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function fold(line) {
  // RFC 5545 folding at 75 octets; ASCII copy, so bytes == chars here.
  const out = [];
  let s = line;
  while (s.length > 75) {
    out.push(s.slice(0, 75));
    s = " " + s.slice(75);
  }
  out.push(s);
  return out.join("\r\n");
}
function vevent({ uid, start, endExclusive, summary, description, url, yearly }) {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}@${UID_HOST}`,
    `DTSTAMP:${STAMP}`,
    `DTSTART;VALUE=DATE:${ymd(start)}`,
    `DTEND;VALUE=DATE:${ymd(endExclusive)}`,
    ...(yearly ? ["RRULE:FREQ=YEARLY"] : []),
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(description)}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(summary)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
  ];
  return lines.map(fold).join("\r\n");
}
function calendar(name, events) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    fold(`X-WR-CALNAME:${esc(name)}`),
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

const SITE = "https://thetalusfieldjournal.com/dates";

function eventsFor(it) {
  const conf = it.confidence === "typical" ? " Typical window, not a published date; the park announces the day a few days ahead." : "";
  const description = `${it.detail}${conf} Source: ${it.source}. Verified ${table.verified}. The Talus Field, ${SITE}`;
  if (it.kind === "annual") {
    // Anchor the yearly rule on the verified year so the first instance is in
    // the year the table was checked. An end before the start month (a window
    // that crosses New Year) is not a case the table has; refuse it.
    if (it.end.month < it.start.month) fail(`${it.id}: annual window crosses the year`);
    const start = utc(verifiedYear, it.start.month, it.start.day);
    const endExclusive = addDays(utc(verifiedYear, it.end.month, it.end.day), 1);
    return [vevent({ uid: it.id, start, endExclusive, summary: `Yosemite: ${it.title}`, description, url: SITE, yearly: true })];
  }
  if (it.kind === "rule") {
    return RULE_YEARS.map((y) => {
      const { up, down } = cablesSeason(y);
      return vevent({ uid: `${it.id}-${y}`, start: up, endExclusive: addDays(down, 1), summary: `Yosemite: ${it.title} ${y}`, description, url: SITE, yearly: false });
    });
  }
  if (it.kind === "season") {
    const [sy, sm, sd] = it.start.split("-").map(Number);
    const [ey, em, ed] = it.end.split("-").map(Number);
    return [vevent({ uid: `${it.id}`, start: utc(sy, sm, sd), endExclusive: addDays(utc(ey, em, ed), 1), summary: `Yosemite: ${it.title}`, description, url: SITE, yearly: false })];
  }
  return []; // relative and release-15th: built in the browser from a trip date
}

// ---- outputs -----------------------------------------------------------------
const outputs = new Map();

const fixed = table.items.filter((it) => it.kind === "annual" || it.kind === "rule" || it.kind === "season");
const all = [];
for (const it of fixed) {
  const evs = eventsFor(it);
  all.push(...evs);
  outputs.set(path.join("ics", `${it.id}.ics`), calendar(`Yosemite: ${it.title}`, evs));
}
outputs.set(path.join("ics", "yosemite-dates.ics"), calendar("Yosemite dates that matter", all));

const dataJs = `// GENERATED by scripts/gen-dates-ics.mjs from scripts/data/deadlines.json.
// Do not edit by hand: change the JSON, then \`npm --prefix scripts run dates\`.
// Raw, uncompiled, like itineraries-data.js: loaded by PAGE_MODULES on /dates.
// The resolver functions live in page-dates.jsx; this file is data only.
// The Field Guide carries a hand mirror at apps/guide/src/content/deadlines.ts,
// asserted equal to the JSON by scripts/check-deadlines.mjs.
window.DEADLINES = ${JSON.stringify({ verified: table.verified, ruleYears: RULE_YEARS, items: table.items }, null, 2)};
`;
outputs.set("dates-data.js", dataJs);

let stale = 0;
for (const [rel, content] of outputs) {
  const abs = path.join(ROOT, rel);
  if (CHECK) {
    if (!existsSync(abs) || readFileSync(abs, "utf8") !== content) {
      console.error(`gen-dates-ics --check: ${rel} is stale (run \`npm --prefix scripts run dates\`)`);
      stale++;
    }
  } else {
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
}
if (CHECK) {
  if (stale) process.exit(1);
  console.log(`gen-dates-ics --check: ${outputs.size} files fresh`);
} else {
  console.log(`gen-dates-ics: wrote ${outputs.size} files (${all.length} events)`);
}
