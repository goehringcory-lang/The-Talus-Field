#!/usr/bin/env node
// =============================================================================
// buttondown-alert.mjs: put a road alert into Buttondown as a draft, addressed
// to the readers who asked for it and nobody else.
//
// Two captures on the site promise an email when a road changes: /conditions
// (tag `alert-roads`: "One email when Tioga Road, Glacier Point Road, or a
// highway into the park opens or closes") and /tioga-opening (tag
// `alert-tioga`: "One email the day the park announces Tioga Road is open,
// and one when it closes for the season"). The daily "Road alert drafter"
// Routine (.claude/skills/road-alert/SKILL.md) writes the alert when the road
// watch confirms a change; this script is how it reaches Buttondown. The
// owner reads the draft in the dashboard and sends it.
//
//   node buttondown-alert.mjs alert.md --tag=alert-roads --tag=alert-tioga
//   node buttondown-alert.mjs alert.md --tag=alert-roads --dry-run
//   node buttondown-alert.mjs --list                     alert drafts and their audiences
//
// The alert file is Markdown with a short header block, one `key: value` per
// line, ended by the first blank line:
//
//   subject: Tioga Road is closed for the season
//   preheader: The park closed it on November 12. What that changes.
//
// Rules the script enforces, each because a wrong alert goes to strangers
// who trusted the site with an inbox:
//   - It only ever creates drafts. There is no schedule path and no send
//     path; sending is the owner's click in the dashboard.
//   - At least one --tag, and every tag must be in ALERT_TAGS. A draft with
//     no audience filter goes to the whole list, so an untagged alert is
//     refused before anything is sent to Buttondown.
//   - After creating the draft, the script reads it back and checks that its
//     audience is exactly the requested tags. If Buttondown stored anything
//     else, the draft is deleted and the script fails: an alert addressed to
//     the whole list must not sit in the dashboard waiting for a click.
//   - One draft per subject: an existing draft with the same subject is
//     reported, never replaced or deleted.
//   - House style: no em-dash, no exclamation mark, no placeholder, no image.
//   - BUTTONDOWN_API_KEY comes from the environment. Missing key: exit 2, so
//     the routine falls back to posting the paste-ready alert in its issue.
// =============================================================================

import { readFileSync } from "node:fs";

const API = "https://api.buttondown.com/v1";
const DASHBOARD = "https://buttondown.com/emails";
const KEY = process.env.BUTTONDOWN_API_KEY ?? "";

// The tags the site's alert captures write (HpLetter `tag` in
// page-conditions.jsx and page-tioga-opening.jsx). A new alert capture adds
// its tag here, in the same change.
const ALERT_TAGS = new Set(["alert-roads", "alert-tioga"]);

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const flags = { tag: [] };
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (!a.startsWith("--")) {
    positional.push(a);
    continue;
  }
  const [k, ...rest] = a.slice(2).split("=");
  let value = rest.length ? rest.join("=") : true;
  if (value === true && ["tag", "subject", "preheader"].includes(k) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) {
    value = args[++i];
  }
  if (k === "tag") {
    if (value === true) fail("--tag needs a tag name");
    flags.tag.push(...String(value).split(",").map((t) => t.trim()).filter(Boolean));
  } else flags[k] = value;
}
const dryRun = flags["dry-run"] === true;

function fail(msg, code = 1) {
  console.error(`buttondown-alert: ${msg}`);
  process.exit(code);
}

function requireKey() {
  if (!KEY) {
    fail(
      "BUTTONDOWN_API_KEY is not set. Add it to the environment (never to the repo); " +
        "the alert can still be posted in the road-alert issue for the owner to paste.",
      2,
    );
  }
}

async function api(method, pathOrUrl, body) {
  const url = pathOrUrl.startsWith("https://") ? pathOrUrl : `${API}${pathOrUrl}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Token ${KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "the-talus-field/buttondown-alert",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401 || res.status === 403) fail(`Buttondown rejected the key (${res.status}); check BUTTONDOWN_API_KEY`, 2);
  if (res.status === 204) return null;
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) fail(`Buttondown ${method} ${url.replace(API, "")} answered ${res.status}: ${text.slice(0, 400)}`);
  return data;
}

// Every page of a list endpoint. `next` is an absolute URL.
async function listAll(path) {
  const out = [];
  let next = path;
  while (next) {
    const page = await api("GET", next);
    out.push(...(page?.results ?? []));
    next = page?.next ?? null;
  }
  return out;
}

// ---------------------------------------------------------------- alert file
function parseAlert(path) {
  const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  const header = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") break;
    const m = /^([a-z][a-z-]*):\s*(.*)$/i.exec(line);
    if (!m) fail(`line ${i + 1} is not a "key: value" header line and the header has not ended with a blank line: ${line}`);
    header[m[1].toLowerCase()] = m[2].trim();
  }
  return { header, body: lines.slice(i + 1).join("\n").trim() };
}

function validate({ subject, preheader, body, tags }) {
  const errors = [];
  const warnings = [];
  if (!subject) errors.push("no subject (header `subject:` or --subject=)");
  if (!body) errors.push("empty body");
  if (!tags.length) errors.push("no --tag: an alert goes only to the readers who asked for it, never the whole list");
  for (const t of tags) if (!ALERT_TAGS.has(t)) errors.push(`tag ${JSON.stringify(t)} is not an alert tag (${[...ALERT_TAGS].join(", ")})`);
  const placeholders = [];
  for (const m of body.matchAll(/\[[^\]\n]{0,120}\]/g)) {
    const after = body.slice(m.index + m[0].length, m.index + m[0].length + 1);
    if (after !== "(") placeholders.push(m[0].slice(1, -1));
  }
  for (const m of body.matchAll(/<[a-z][a-z-]*>/gi)) placeholders.push(m[0]);
  if (/\bTODO\b|\bTKTK\b|\bTBD\b/.test(body)) placeholders.push("TODO/TK/TBD");
  if (placeholders.length) errors.push(`placeholders in the body: ${placeholders.map((p) => JSON.stringify(p)).join(", ")}`);
  if (/—/.test(`${subject}${preheader}${body}`)) errors.push("em-dash in the alert (house style: comma, colon, or period)");
  if (/!/.test(`${subject}${preheader}${body}`)) errors.push("exclamation mark in the alert (house style; an alert carries no image either)");
  if (subject && subject.length >= 60) warnings.push(`subject is ${subject.length} characters (runbook: under 60)`);
  if (preheader && preheader.length >= 90) warnings.push(`preheader is ${preheader.length} characters (runbook: under 90)`);
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words && (words < 40 || words > 200)) warnings.push(`body is ${words} words (runbook: 40 to 200)`);
  return { errors, warnings, words };
}

// The audience Buttondown stored, as a sorted list of tag ids, or null when
// the stored filter is anything other than "subscriber has one of these tags".
function storedTagIds(email) {
  const group = email?.filters;
  if (!group || !Array.isArray(group.filters) || group.filters.length === 0) return null;
  if (Array.isArray(group.groups) && group.groups.length) return null;
  if (group.filters.length > 1 && group.predicate !== "or") return null;
  const ids = [];
  for (const f of group.filters) {
    if (f?.field !== "subscriber.tags" || f?.operator !== "contains" || typeof f?.value !== "string") return null;
    ids.push(f.value);
  }
  return ids.sort();
}

// ---------------------------------------------------------------- commands
async function cmdList() {
  requireKey();
  const [drafts, tags] = await Promise.all([listAll("/emails?status=draft"), listAll("/tags?page_size=100")]);
  const nameOf = new Map(tags.map((t) => [t.id, t.name]));
  const alerts = drafts.filter((e) => storedTagIds(e)?.some((id) => ALERT_TAGS.has(nameOf.get(id))));
  if (!alerts.length) {
    console.log("No alert drafts in Buttondown.");
    return;
  }
  for (const e of alerts) {
    const audience = storedTagIds(e).map((id) => nameOf.get(id) ?? id).join(" or ");
    console.log(`${e.id}  draft  ${JSON.stringify(e.subject)}  to: ${audience}\n    ${DASHBOARD}/${e.id}`);
  }
}

async function cmdCreate(path) {
  const { header, body } = parseAlert(path);
  const subject = String(flags.subject ?? header.subject ?? "").trim();
  const preheader = String(flags.preheader ?? header.preheader ?? "").trim();
  const tags = [...new Set(flags.tag)];
  const { errors, warnings, words } = validate({ subject, preheader, body, tags });
  for (const w of warnings) console.error(`warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    fail("the alert did not pass; nothing was created");
  }

  console.log(`subject:   ${subject}`);
  console.log(`preheader: ${preheader || "(none)"}`);
  console.log(`body:      ${words} words`);
  console.log(`audience:  subscribers tagged ${tags.join(" or ")}`);
  console.log("status:    draft (never scheduled or sent by this script)");
  if (dryRun) {
    console.log("[dry-run] nothing sent to Buttondown");
    return;
  }
  requireKey();

  // A tag exists in Buttondown once somebody has signed up with it. One the
  // account does not have yet has nobody behind it: draft for the rest.
  const all = await listAll("/tags?page_size=100");
  const idOf = new Map(all.map((t) => [t.name, t.id]));
  const missing = tags.filter((t) => !idOf.has(t));
  const present = tags.filter((t) => idOf.has(t));
  if (!present.length) fail(`Buttondown has no tag named ${tags.map((t) => JSON.stringify(t)).join(" or ")}; nobody has signed up for this alert yet, so there is no one to send it to`);
  for (const t of missing) console.error(`warning: nobody has the tag ${JSON.stringify(t)} yet; drafting for ${present.join(" or ")}`);
  tags.splice(0, tags.length, ...present);
  const wanted = tags.map((t) => idOf.get(t)).sort();

  const drafts = await listAll("/emails?status=draft");
  const same = drafts.find((e) => e.subject.trim().toLowerCase() === subject.toLowerCase());
  if (same) fail(`a draft with this subject already exists: ${same.id} ${DASHBOARD}/${same.id} (edit it there; this script never replaces a draft)`);

  const payload = {
    subject,
    body,
    status: "draft",
    // An alert is for the people who asked; it stays out of the public archive.
    archival_mode: "disabled",
    filters: {
      filters: wanted.map((id) => ({ field: "subscriber.tags", operator: "contains", value: id })),
      groups: [],
      predicate: "or",
    },
  };
  if (preheader) payload.description = preheader;
  const created = await api("POST", "/emails", payload);

  // Read the draft back. The audience is the one thing that must be right.
  const stored = await api("GET", `/emails/${created.id}`);
  const got = storedTagIds(stored);
  const audienceOk = got !== null && got.length === wanted.length && got.every((id, i) => id === wanted[i]);
  if (stored?.status !== "draft" || !audienceOk) {
    if (stored?.status === "draft") await api("DELETE", `/emails/${created.id}`);
    fail(
      `Buttondown stored this alert with status ${JSON.stringify(stored?.status)} and audience ${JSON.stringify(stored?.filters ?? null)}, ` +
        `not a draft for ${tags.join(" or ")}; ${stored?.status === "draft" ? "the draft was deleted" : `check ${DASHBOARD}/${created.id} now`}`,
    );
  }
  console.log(`created:   ${created.id} (draft, audience verified)`);
  console.log(`dashboard: ${DASHBOARD}/${created.id}`);
}

// ---------------------------------------------------------------- main
if (flags.list) await cmdList();
else if (positional[0]) await cmdCreate(positional[0]);
else {
  console.error(
    "usage: buttondown-alert.mjs <alert.md> --tag=<alert tag> [--tag=...] [--dry-run] [--subject=] [--preheader=]\n" +
      "       buttondown-alert.mjs --list",
  );
  process.exit(1);
}
