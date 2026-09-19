#!/usr/bin/env node
// =============================================================================
// check-bulletin.mjs — the schema guard for bulletin.json (The Park Bulletin,
// /now). Wired into `npm --prefix scripts run check`.
//
// bulletin.json is rewritten by hand (by the Thursday bulletin routine) every
// ~5 weeks, and since the September 2026 redesign the page reads it against
// today's date in the park: it works out which programs run on the day a
// reader picks, which changes are still coming, and which hours rows have
// flipped. That makes a typo expensive in a new way. A day code of "thu"
// instead of "th", an `until` before its `from`, or a date one year off does
// not break the page; it silently removes rows from it, and a program that
// never appears reads to a visitor as "nothing is on", the one thing the page
// exists to answer truthfully. This file is the only thing that can see that.
//
// Errors (exit 1): a retired or unknown key, a missing field, a bad ISO date,
// an unknown tone / kind / day code / program area, a program row that can
// never render inside the edition window, an edition day with no programs at
// all, an area tab that is empty on every day, an unparseable start time,
// an em-dash in reader-facing copy.
// Warnings: an icon name page-now.jsx does not know (the page renders the
// neutral mark, which is safe but probably not what the editor meant), no
// Tioga row in `areas` (/tioga-opening reads it), fewer than two headlines.
//
// The day matching below mirrors btRunsOn() in page-now.jsx. It is deliberately
// small; if the page's rule changes, change this one with it.
// =============================================================================
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = "bulletin.json";
const data = JSON.parse(readFileSync(path.join(ROOT, FILE), "utf8"));
const pageSrc = readFileSync(path.join(ROOT, "page-now.jsx"), "utf8");

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const TONES = ["open", "warn", "closed"];
const KINDS = ["closes", "ends", "hours", "opens", "event"];
const DAY_CODES = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const RETIRED = {
  alerts: "headlines (the top tiles) and changes (the dated ledger)",
  valleyDay: "programs with area \"valley\"",
  valleyDayNote: "programsNote and the Valley's programAreas notes",
  elsewhere: "programs with their own area keys",
  events: "programs with dates / from / until (or changes, for one past the edition)",
  eventsNote: "programAreas notes",
};
const TOP_KEYS = [
  "__comment", "edition", "headlines", "changes", "areas", "programAreas", "programs",
  "programsNote", "trails", "trailsNote", "hours", "transit", "essentials", "numbers",
];

// The icon registry is the source of truth for icon names; read it out of the
// page rather than keeping a second list here.
const iconBlock = pageSrc.match(/const BULLETIN_ICONS = \{([\s\S]*?)\n\};/);
const ICONS = new Set(iconBlock ? [...iconBlock[1].matchAll(/^ {2}(\w+):/gm)].map((m) => m[1]) : []);
if (!ICONS.size) err("page-now.jsx", "could not read the BULLETIN_ICONS registry");

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isISO = (v) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T12:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};
const addDays = (iso, n) => {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const dayCode = (iso) => DAY_CODES[new Date(iso + "T12:00:00Z").getUTCDay()];
const parseTime = (s) => {
  if (typeof s !== "string") return null;
  const t = s.trim().toLowerCase();
  if (t === "noon") return 720;
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = m[2] ? Number(m[2]) : 0;
  if (h < 1 || h > 12 || min > 59) return null;
  return ((h % 12) + (m[3] === "pm" ? 12 : 0)) * 60 + min;
};
// Mirror of btRunsOn() in page-now.jsx.
function runsOn(p, iso) {
  if (Array.isArray(p.except) && p.except.includes(iso)) return false;
  if (Array.isArray(p.dates)) return p.dates.includes(iso);
  if (p.from && iso < p.from) return false;
  if (p.until && iso > p.until) return false;
  if (p.days === "daily") return true;
  return Array.isArray(p.days) && p.days.includes(dayCode(iso));
}

function checkKeys(where, obj, allowed) {
  for (const k of Object.keys(obj || {})) {
    if (!allowed.includes(k)) err(where, `unknown key "${k}" (allowed: ${allowed.join(", ")})`);
  }
}
function checkArray(key) {
  if (!Array.isArray(data[key])) {
    err(FILE, `"${key}" must be an array`);
    return [];
  }
  return data[key];
}

// ---- Top level --------------------------------------------------------------
for (const [k, instead] of Object.entries(RETIRED)) {
  if (k in data) err(FILE, `"${k}" was retired in the September 2026 redesign; use ${instead}`);
}
for (const k of Object.keys(data)) {
  if (!TOP_KEYS.includes(k) && !(k in RETIRED)) err(FILE, `unknown top-level key "${k}"`);
}

// ---- edition ----------------------------------------------------------------
const ed = data.edition || {};
checkKeys("edition", ed, ["label", "start", "end", "updated", "lede", "source", "sourceUrl", "notice"]);
for (const k of ["label", "lede", "source", "sourceUrl"]) if (!isStr(ed[k])) err("edition", `missing ${k}`);
for (const k of ["start", "end", "updated"]) if (!isISO(ed[k])) err("edition", `${k} must be an ISO date, got ${JSON.stringify(ed[k])}`);
if (isISO(ed.start) && isISO(ed.end) && ed.start > ed.end) err("edition", "start is after end");
if ("notice" in ed && !isStr(ed.notice)) err("edition", "notice, when present, must be a sentence");

const windowDays = [];
if (isISO(ed.start) && isISO(ed.end) && ed.start <= ed.end) {
  for (let d = ed.start; d <= ed.end && windowDays.length < 120; d = addDays(d, 1)) windowDays.push(d);
}

// ---- headlines --------------------------------------------------------------
const headlines = checkArray("headlines");
if (headlines.length > 4) err("headlines", `${headlines.length} tiles; the row holds at most four`);
if (headlines.length < 2) warn("headlines", `${headlines.length} tile(s); the row is built for two to four`);
headlines.forEach((h, i) => {
  const w = `headlines[${i}]`;
  checkKeys(w, h, ["label", "icon", "status", "tone", "text"]);
  for (const k of ["label", "status", "text"]) if (!isStr(h[k])) err(w, `missing ${k}`);
  if (!TONES.includes(h.tone)) err(w, `tone must be one of ${TONES.join(" | ")}`);
  if (h.icon !== undefined && !ICONS.has(h.icon)) warn(w, `icon "${h.icon}" is not in BULLETIN_ICONS; the neutral mark renders`);
});

// ---- changes ----------------------------------------------------------------
checkArray("changes").forEach((c, i) => {
  const w = `changes[${i}]`;
  checkKeys(w, c, ["date", "when", "kind", "what", "detail"]);
  if (!KINDS.includes(c.kind)) err(w, `kind must be one of ${KINDS.join(" | ")}`);
  if (!isStr(c.what)) err(w, "missing what");
  if (c.date !== undefined && !isISO(c.date)) err(w, `date must be an ISO date, got ${JSON.stringify(c.date)}`);
  if (c.when !== undefined && !isStr(c.when)) err(w, "when, when present, must be a label");
  if (c.detail !== undefined && !isStr(c.detail)) err(w, "detail, when present, must be text");
  if (c.date === undefined) {
    if (!isStr(c.when)) err(w, "a row with no date needs a when (its group label, e.g. \"This season\")");
    if (c.kind !== "closes" && c.kind !== "ends") err(w, "an undated row is season-long, so it must be closes or ends");
  }
});

// ---- areas ------------------------------------------------------------------
const areas = checkArray("areas");
areas.forEach((a, i) => {
  const w = `areas[${i}]`;
  checkKeys(w, a, ["name", "chip", "tone", "note"]);
  for (const k of ["name", "chip", "note"]) if (!isStr(a[k])) err(w, `missing ${k}`);
  if (!TONES.includes(a.tone)) err(w, `tone must be one of ${TONES.join(" | ")}`);
});
if (!areas.some((a) => /tioga/i.test(a.name || ""))) warn("areas", "no Tioga row; /tioga-opening's status box renders nothing without one");

// ---- programAreas + programs ------------------------------------------------
const programAreas = checkArray("programAreas");
const areaKeys = new Set();
programAreas.forEach((a, i) => {
  const w = `programAreas[${i}]`;
  checkKeys(w, a, ["key", "name", "short", "notes"]);
  if (!isStr(a.key) || !/^[a-z]+$/.test(a.key)) err(w, "key must be lowercase letters");
  else if (areaKeys.has(a.key)) err(w, `duplicate key "${a.key}"`);
  else if (a.key === "parkwide") err(w, "\"parkwide\" is reserved for park-wide programs");
  else areaKeys.add(a.key);
  for (const k of ["name", "short"]) if (!isStr(a[k])) err(w, `missing ${k}`);
  if (!Array.isArray(a.notes)) err(w, "notes must be an array (empty is fine)");
  else a.notes.forEach((n, j) => {
    checkKeys(`${w}.notes[${j}]`, n, ["h", "t"]);
    if (!isStr(n.h) || !isStr(n.t)) err(`${w}.notes[${j}]`, "needs h and t");
  });
});
if (!programAreas.length) err("programAreas", "the schedule needs at least one area");

const PROGRAM_KEYS = ["area", "time", "title", "detail", "detailByDay", "where", "days", "from", "until", "dates", "except", "fee", "access", "allAges", "tag"];
const programs = checkArray("programs");
programs.forEach((p, i) => {
  const w = `programs[${i}] (${p && p.title})`;
  checkKeys(w, p, PROGRAM_KEYS);
  if (!isStr(p.title)) err(w, "missing title");
  if (p.area !== "parkwide" && !areaKeys.has(p.area)) err(w, `area "${p.area}" is not a programAreas key (or "parkwide")`);
  if (p.time === undefined) {
    if (p.area !== "parkwide") err(w, "missing time (only park-wide rows may omit it)");
  } else if (parseTime(p.time) === null) err(w, `time "${p.time}" does not parse; write "9:00 am", "1:30 pm" or "Noon"`);
  if (p.dates !== undefined) {
    if (!Array.isArray(p.dates) || !p.dates.length || !p.dates.every(isISO)) err(w, "dates must be a non-empty list of ISO dates");
    if (p.days !== undefined) err(w, "dates replaces days; give one or the other");
  } else if (p.days !== "daily") {
    if (!Array.isArray(p.days) || !p.days.length) err(w, "days must be \"daily\" or a list of day codes");
    else {
      const bad = p.days.filter((d) => !DAY_CODES.includes(d));
      if (bad.length) err(w, `unknown day code(s) ${bad.join(", ")}; use ${DAY_CODES.join(" ")}`);
      if (new Set(p.days).size !== p.days.length) err(w, "a day code repeats");
    }
  }
  for (const k of ["from", "until"]) if (p[k] !== undefined && !isISO(p[k])) err(w, `${k} must be an ISO date`);
  if (isISO(p.from) && isISO(p.until) && p.from > p.until) err(w, "from is after until");
  if (p.except !== undefined && (!Array.isArray(p.except) || !p.except.every(isISO))) err(w, "except must be a list of ISO dates");
  if (p.detailByDay !== undefined) {
    if (typeof p.detailByDay !== "object" || Array.isArray(p.detailByDay)) err(w, "detailByDay must map day codes to text");
    else for (const [d, t] of Object.entries(p.detailByDay)) {
      if (!DAY_CODES.includes(d)) err(w, `detailByDay has unknown day code "${d}"`);
      if (!isStr(t)) err(w, `detailByDay.${d} must be text`);
    }
  }
  for (const k of ["detail", "where", "tag"]) if (p[k] !== undefined && !isStr(p[k])) err(w, `${k}, when present, must be text`);
  for (const k of ["fee", "access", "allAges"]) {
    if (p[k] !== undefined && p[k] !== true) err(w, `${k} is true-only: omit it rather than writing ${JSON.stringify(p[k])}`);
  }
  if (windowDays.length && !windowDays.some((d) => runsOn(p, d))) {
    err(w, `never runs between ${ed.start} and ${ed.end}, so it can never appear on the page`);
  }
});
for (const key of areaKeys) {
  if (windowDays.length && !programs.some((p) => p.area === key && windowDays.some((d) => runsOn(p, d)))) {
    err("programAreas", `"${key}" has no program on any day of the edition; its tab would always read empty`);
  }
}
const emptyDays = windowDays.filter((d) => !programs.some((p) => p.area !== "parkwide" && runsOn(p, d)));
if (emptyDays.length) err("programs", `no program runs on ${emptyDays.join(", ")}; the schedule would read as empty`);
if (!isStr(data.programsNote)) err(FILE, "missing programsNote");

// ---- trails, hours, transit, essentials, numbers ----------------------------
checkArray("trails").forEach((t, i) => {
  const w = `trails[${i}]`;
  checkKeys(w, t, ["name", "chip", "tone", "distance", "start", "note"]);
  for (const k of ["name", "chip", "note"]) if (!isStr(t[k])) err(w, `missing ${k}`);
  if (!TONES.includes(t.tone)) err(w, `tone must be one of ${TONES.join(" | ")}`);
  for (const k of ["distance", "start"]) if (t[k] !== undefined && !isStr(t[k])) err(w, `${k}, when present, must be text`);
});
if (data.trailsNote !== undefined && !isStr(data.trailsNote)) err(FILE, "trailsNote must be text");

checkArray("hours").forEach((g, i) => {
  const w = `hours[${i}]`;
  checkKeys(w, g, ["group", "items"]);
  if (!isStr(g.group)) err(w, "missing group");
  if (!Array.isArray(g.items)) return err(w, "items must be an array");
  g.items.forEach((it, j) => {
    const wi = `${w}.items[${j}] (${it && it.name})`;
    checkKeys(wi, it, ["name", "hours", "note", "closes", "then"]);
    if (!isStr(it.name) || !isStr(it.hours)) err(wi, "needs name and hours");
    if (it.note !== undefined && !isStr(it.note)) err(wi, "note, when present, must be text");
    if (it.closes !== undefined && !isISO(it.closes)) err(wi, "closes must be an ISO date (the last open day)");
    if (it.then !== undefined) {
      checkKeys(`${wi}.then`, it.then, ["from", "hours"]);
      if (!isISO(it.then.from) || !isStr(it.then.hours)) err(wi, "then needs { from: ISO date, hours }");
    }
  });
});
checkArray("transit").forEach((t, i) => {
  const w = `transit[${i}]`;
  checkKeys(w, t, ["name", "note", "until"]);
  if (!isStr(t.name) || !isStr(t.note)) err(w, "needs name and note");
  if (t.until !== undefined && !isISO(t.until)) err(w, "until must be an ISO date");
});
checkArray("essentials").forEach((e, i) => {
  checkKeys(`essentials[${i}]`, e, ["title", "text"]);
  if (!isStr(e.title) || !isStr(e.text)) err(`essentials[${i}]`, "needs title and text");
});
const numbers = checkArray("numbers");
numbers.forEach((n, i) => {
  checkKeys(`numbers[${i}]`, n, ["label", "value"]);
  if (!isStr(n.label) || !isStr(n.value)) err(`numbers[${i}]`, "needs label and value");
});
if (numbers.length < 4) warn("numbers", "the page pins the first four numbers above the folds; fewer than four leaves the strip short");

// ---- House style: no em-dashes in anything a reader sees ---------------------
(function walk(v, where) {
  if (typeof v === "string") {
    if (v.includes("—")) err(where, "em-dash in reader-facing copy; house style uses a comma, colon or period");
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "__comment") walk(x, `${where}.${k}`);
})(data, "bulletin");

// ---- Report -----------------------------------------------------------------
for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  error ${e}`);
  console.error(`check-bulletin: ${errors.length} error(s) in ${FILE}`);
  process.exit(1);
}
const dated = (data.changes || []).filter((c) => c.date).length;
console.log(
  `check-bulletin: ok. ${programs.length} programs across ${programAreas.length} areas, every one of the edition's ` +
    `${windowDays.length} days has a schedule; ${data.changes.length} changes (${dated} dated); ${headlines.length} headlines.`
);
