#!/usr/bin/env node
// =============================================================================
// buttondown-letter.mjs: put the Sunday letter into Buttondown, scheduled.
//
// The Sunday letter draft routine (.claude/skills/sunday-letter/SKILL.md)
// writes Sunday Field Notes on Saturday morning. Until September 2026 the
// draft was a GitHub issue the owner pasted into Buttondown by hand, and the
// paste was the step that got skipped. This script is the other half: it
// creates the email through Buttondown's API with status `scheduled` and a
// publish date of the coming Sunday at SEND_HOUR_PACIFIC, which leaves the
// owner the rest of Saturday to read it in the Buttondown dashboard and edit
// or unschedule it. Silence sends.
//
//   node buttondown-letter.mjs letter.md                  schedule for Sunday
//   node buttondown-letter.mjs letter.md --dry-run        validate, print, no call
//   node buttondown-letter.mjs letter.md --status=draft   create unscheduled
//   node buttondown-letter.mjs --list                     drafts and scheduled
//   node buttondown-letter.mjs --unschedule em_...        back to draft
//   node buttondown-letter.mjs --delete em_...            delete a draft
//
// The letter file is Markdown (Buttondown renders Markdown) with a short
// header block, one `key: value` per line, ended by the first blank line:
//
//   subject: The park is full by 7 a.m.
//   preheader: Tioga closes to overnight parking Monday; the Mist Trail ...
//   publish: 2026-09-20T16:00:00Z      (optional; default: coming Sunday)
//
// `--subject=`, `--preheader=` and `--publish=` override the header.
//
// Rules the script enforces, each because the letter goes out under the
// owner's name with nobody reading it between here and the send:
//   - BUTTONDOWN_API_KEY comes from the environment, never a file or a flag.
//     Missing key: exit 2, with the message the runbook expects, so the
//     routine can fall back to the issue-only deliverable.
//   - No bracketed placeholder ("[your line: ...]", "<slug>", "TODO")
//     survives into a scheduled email: nobody is going to fill it in.
//   - No em-dash, no exclamation mark (house style; CLAUDE.md, Brand & voice).
//   - Subject under 60 characters, preheader under 90, body 250 to 450 words:
//     warnings, not errors, since the runbook already sets those limits and
//     a 460-word letter is not worth losing a week over.
//   - One email per Sunday: if Buttondown already holds a draft or a
//     scheduled email with this subject, or one scheduled for the same day,
//     the script refuses and prints it. `--replace` unschedules the older
//     one (to draft; it never deletes) before creating the new one.
//   - `--delete` only deletes drafts. A sent email is the archive.
// =============================================================================

import { readFileSync } from "node:fs";

const API = "https://api.buttondown.com/v1";
const DASHBOARD = "https://buttondown.com/emails";
const SEND_HOUR_PACIFIC = 9; // Sunday, America/Los_Angeles
const KEY = process.env.BUTTONDOWN_API_KEY ?? "";

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const flags = {};
const positional = [];
const TAKES_VALUE = new Set(["unschedule", "delete", "subject", "preheader", "publish", "status"]);
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--")) {
    const [k, ...rest] = a.slice(2).split("=");
    if (rest.length) flags[k] = rest.join("=");
    else if (TAKES_VALUE.has(k) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) flags[k] = args[++i];
    else flags[k] = true;
  } else positional.push(a);
}
for (const k of ["unschedule", "delete"]) if (flags[k] === true) fail(`--${k} needs an email id (em_...)`);
const dryRun = flags["dry-run"] === true;

function fail(msg, code = 1) {
  console.error(`buttondown-letter: ${msg}`);
  process.exit(code);
}

function requireKey() {
  if (!KEY) {
    fail(
      "BUTTONDOWN_API_KEY is not set. Add it to the environment (never to the repo); " +
        "the letter can still be posted as an issue for hand pasting.",
      2,
    );
  }
}

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Token ${KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "the-talus-field/buttondown-letter",
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
  if (!res.ok) fail(`Buttondown ${method} ${path} answered ${res.status}: ${text.slice(0, 400)}`);
  return data;
}

// ---------------------------------------------------------------- dates
// Pacific-time arithmetic without a timezone library: ask Intl what the
// clock reads in Los Angeles for a given instant, and adjust by the
// difference. Works across the DST change because the offset is measured,
// not assumed.
function pacificParts(date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, weekday: p.weekday };
}

// The instant at which the Los Angeles clock reads y-m-d h:00.
function pacificInstant(y, m, d, h) {
  let guess = new Date(Date.UTC(y, m - 1, d, h, 0, 0));
  for (let i = 0; i < 3; i++) {
    const p = pacificParts(guess);
    const readsAs = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min);
    const wanted = Date.UTC(y, m - 1, d, h, 0);
    const diff = wanted - readsAs;
    if (diff === 0) break;
    guess = new Date(guess.getTime() + diff);
  }
  return guess;
}

function comingSunday(now = new Date()) {
  const p = pacificParts(now);
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  let ahead = (7 - dow) % 7; // 0 on a Sunday
  let target = pacificInstant(p.y, p.m, p.d + ahead, SEND_HOUR_PACIFIC);
  if (target.getTime() <= now.getTime()) target = pacificInstant(p.y, p.m, p.d + ahead + 7, SEND_HOUR_PACIFIC);
  return target;
}

function pacificLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function pacificDay(iso) {
  const p = pacificParts(new Date(iso));
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

// ---------------------------------------------------------------- letter file
function parseLetter(path) {
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
  const body = lines.slice(i + 1).join("\n").trim();
  return { header, body };
}

function validate({ subject, preheader, body, publish }) {
  const errors = [];
  const warnings = [];
  if (!subject) errors.push("no subject (header `subject:` or --subject=)");
  if (!body) errors.push("empty body");
  const placeholders = [];
  for (const m of body.matchAll(/\[[^\]\n]{0,120}\]/g)) {
    const inner = m[0].slice(1, -1);
    // A Markdown link's text "[text](url)" is not a placeholder.
    const after = body.slice(m.index + m[0].length, m.index + m[0].length + 1);
    if (after === "(") continue;
    placeholders.push(inner);
  }
  for (const m of body.matchAll(/<[a-z][a-z-]*>/gi)) placeholders.push(m[0]);
  if (/\bTODO\b|\bTKTK\b|\bTBD\b/.test(body)) placeholders.push("TODO/TK/TBD");
  if (placeholders.length) errors.push(`placeholders in the body: ${placeholders.map((p) => JSON.stringify(p)).join(", ")}`);
  if (/—/.test(body) || /—/.test(subject) || /—/.test(preheader)) errors.push("em-dash in the letter (house style: comma, colon, or period)");
  if (/!/.test(body.replace(/!\[[^\]]*\]\([^)]*\)/g, "")) || /!/.test(subject)) errors.push("exclamation mark in the letter (house style)");
  if (subject && subject.length >= 60) warnings.push(`subject is ${subject.length} characters (runbook: under 60)`);
  if (preheader && preheader.length >= 90) warnings.push(`preheader is ${preheader.length} characters (runbook: under 90)`);
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words && (words < 250 || words > 450)) warnings.push(`body is ${words} words (runbook: 250 to 450)`);
  if (!preheader) warnings.push("no preheader; Buttondown will use the first lines of the body");
  if (!(publish instanceof Date) || Number.isNaN(publish.getTime())) errors.push(`publish date is not a date: ${publish}`);
  else if (publish.getTime() <= Date.now()) errors.push(`publish date ${publish.toISOString()} is in the past`);
  return { errors, warnings, words };
}

// ---------------------------------------------------------------- commands
async function listOpen() {
  const out = [];
  for (const status of ["draft", "scheduled", "about_to_send"]) {
    const data = await api("GET", `/emails?status=${status}&page_size=50`);
    for (const e of data?.results ?? []) out.push(e);
  }
  return out;
}

async function cmdList() {
  requireKey();
  const open = await listOpen();
  if (!open.length) {
    console.log("No drafts or scheduled emails in Buttondown.");
    return;
  }
  for (const e of open) {
    const when = e.status === "draft" ? "" : `  sends ${pacificLabel(new Date(e.publish_date))}`;
    console.log(`${e.id}  ${e.status.padEnd(9)}  ${JSON.stringify(e.subject)}${when}\n    ${DASHBOARD}/${e.id}`);
  }
}

async function cmdUnschedule(id) {
  requireKey();
  const e = await api("GET", `/emails/${id}`);
  if (e.status === "draft") {
    console.log(`${id} is already a draft.`);
    return;
  }
  if (!["scheduled", "about_to_send"].includes(e.status)) fail(`${id} is ${e.status}; only a scheduled email can be unscheduled`);
  if (dryRun) {
    console.log(`[dry-run] would unschedule ${id} ${JSON.stringify(e.subject)} (back to draft)`);
    return;
  }
  await api("PATCH", `/emails/${id}`, { status: "draft" });
  console.log(`Unscheduled ${id} ${JSON.stringify(e.subject)}; it is a draft again at ${DASHBOARD}/${id}`);
}

async function cmdDelete(id) {
  requireKey();
  const e = await api("GET", `/emails/${id}`);
  if (e.status !== "draft") fail(`${id} is ${e.status}; this script deletes drafts only (unschedule first)`);
  if (dryRun) {
    console.log(`[dry-run] would delete draft ${id} ${JSON.stringify(e.subject)}`);
    return;
  }
  await api("DELETE", `/emails/${id}`);
  console.log(`Deleted draft ${id} ${JSON.stringify(e.subject)}`);
}

async function cmdCreate(path) {
  const { header, body } = parseLetter(path);
  const subject = String(flags.subject ?? header.subject ?? "").trim();
  const preheader = String(flags.preheader ?? header.preheader ?? "").trim();
  const publishRaw = flags.publish ?? header.publish;
  const publish = publishRaw ? new Date(String(publishRaw)) : comingSunday();
  const status = String(flags.status ?? "scheduled");
  if (!["scheduled", "draft"].includes(status)) fail(`--status must be scheduled or draft, not ${status}`);

  const { errors, warnings, words } = validate({ subject, preheader, body, publish });
  for (const w of warnings) console.error(`warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    fail("the letter did not pass; nothing was created");
  }

  console.log(`subject:   ${subject}`);
  console.log(`preheader: ${preheader || "(none)"}`);
  console.log(`body:      ${words} words`);
  console.log(`status:    ${status}`);
  if (status === "scheduled") console.log(`sends:     ${pacificLabel(publish)} (${publish.toISOString()})`);

  if (dryRun) {
    console.log("[dry-run] nothing sent to Buttondown");
    return;
  }
  requireKey();

  // One email per Sunday.
  const open = await listOpen();
  const sameSubject = open.filter((e) => e.subject.trim().toLowerCase() === subject.toLowerCase());
  const sameDay = open.filter((e) => e.status !== "draft" && pacificDay(e.publish_date) === pacificDay(publish.toISOString()));
  const clashes = [...new Map([...sameSubject, ...sameDay].map((e) => [e.id, e])).values()];
  if (clashes.length) {
    for (const e of clashes) console.error(`existing: ${e.id} ${e.status} ${JSON.stringify(e.subject)} ${DASHBOARD}/${e.id}`);
    if (!flags.replace) fail("Buttondown already holds this letter or one for the same day; edit it there, or rerun with --replace to unschedule it first");
    for (const e of clashes) {
      if (e.status === "draft") continue;
      await api("PATCH", `/emails/${e.id}`, { status: "draft" });
      console.error(`unscheduled ${e.id} (now a draft; not deleted)`);
    }
  }

  const payload = { subject, body, status, email_type: "public" };
  if (preheader) payload.description = preheader;
  if (status === "scheduled") payload.publish_date = publish.toISOString();
  const created = await api("POST", "/emails", payload);
  console.log(`created:   ${created.id} (${created.status})`);
  console.log(`dashboard: ${DASHBOARD}/${created.id}`);
  if (created.absolute_url) console.log(`archive:   ${created.absolute_url}`);
}

// ---------------------------------------------------------------- main
if (flags.list) await cmdList();
else if (flags.unschedule) await cmdUnschedule(String(flags.unschedule));
else if (flags.delete) await cmdDelete(String(flags.delete));
else if (positional[0]) await cmdCreate(positional[0]);
else {
  console.error(
    "usage: buttondown-letter.mjs <letter.md> [--dry-run] [--status=scheduled|draft] [--subject=] [--preheader=] [--publish=ISO] [--replace]\n" +
      "       buttondown-letter.mjs --list | --unschedule <id> | --delete <id>",
  );
  process.exit(1);
}
