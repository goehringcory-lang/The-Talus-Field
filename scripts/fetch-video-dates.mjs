#!/usr/bin/env node
// Source real upload dates for the Nature Notes films, and write them into
// videos-data.js as `uploaded: "YYYY-MM-DD"`.
//
// Why this exists: Search Console reported all 40 VideoObject items invalid on
// "Missing field uploadDate", which is a required field and the reason the site
// has zero video rich results. The field had been deliberately omitted because
// only publication *years* were sourced for 9 of the 40 episodes, and inventing
// a month and day to satisfy a validator would put a false fact in structured
// data. That reasoning was right. The fix is to source the real dates, not to
// relax the rule.
//
// Usage:
//   node scripts/fetch-video-dates.mjs            # fetch and write
//   node scripts/fetch-video-dates.mjs --dry-run  # report only, write nothing
//
// Requires network egress to youtube.com. Sandboxed sessions where the agent
// proxy denies youtube.com cannot run this; it fails loudly rather than
// guessing. Re-run it after adding an episode.
//
// It only ever ADDS a date it actually read from the watch page. A video whose
// date cannot be parsed is reported and left alone, so a partial run is safe
// and re-runnable: the JSON-LD emitters treat `uploaded` as optional.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(ROOT, "videos-data.js");
const DRY = process.argv.includes("--dry-run");

// The watch page carries the date in three places. itemprop is the most stable
// of them; the other two are inside the player JSON blob and move between
// YouTube releases, so they are fallbacks rather than the primary read.
const PATTERNS = [
  /itemprop="uploadDate"\s+content="([0-9]{4}-[0-9]{2}-[0-9]{2})/,
  /"uploadDate"\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})/,
  /"publishDate"\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})/,
];

function dateFrom(html) {
  for (const re of PATTERNS) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

async function fetchDate(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: {
      // A browser UA: the bot-shaped consent interstitial carries no date.
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return dateFrom(await res.text());
}

const src = readFileSync(SRC, "utf8");

// Episode lines are hand-maintained object literals. Match each one that
// carries a youtubeId so the date can be inserted next to it, rather than
// reserializing the file and losing its comments and formatting.
const lines = src.split("\n");
const targets = [];
lines.forEach((line, i) => {
  const m = line.match(/youtubeId:\s*"([A-Za-z0-9_-]{11})"/);
  // Skip the dev-only integrity check at the foot of the file, which mentions
  // ep.youtubeId without being an episode record.
  if (m && /\bid:\s*"/.test(line)) targets.push({ i, id: m[1], line });
});

if (!targets.length) {
  console.error("✗ found no episode records in videos-data.js");
  process.exit(1);
}

console.log(`Fetching upload dates for ${targets.length} episode(s)…`);

const found = new Map();
const failed = [];
for (const t of targets) {
  const already = /uploaded:\s*"[0-9]{4}-[0-9]{2}-[0-9]{2}"/.test(t.line);
  if (already) continue;
  try {
    const date = await fetchDate(t.id);
    if (date) {
      found.set(t.i, date);
      console.log(`  ${t.id}  ${date}`);
    } else {
      failed.push(`${t.id}: watch page carried no parseable date`);
    }
  } catch (e) {
    failed.push(`${t.id}: ${e.message}`);
  }
  // Be a polite client to a host we do not own.
  await new Promise((r) => setTimeout(r, 400));
}

for (const f of failed) console.warn(`  ! ${f}`);

if (!found.size) {
  console.error(
    `\n✗ no dates were read. If every entry failed with a connection or 403 error, this ` +
      `environment has no egress to youtube.com and the run cannot be completed here.`
  );
  process.exit(1);
}

if (DRY) {
  console.log(`\n--dry-run: ${found.size} date(s) read, ${failed.length} unresolved, nothing written.`);
  process.exit(0);
}

// Insert `uploaded` immediately after `youtubeId`, matching the field order the
// file already uses (id, episode, title, youtubeId, theme, year, dek).
const out = lines.map((line, i) => {
  const date = found.get(i);
  if (!date) return line;
  return line.replace(/(youtubeId:\s*"[A-Za-z0-9_-]{11}",)/, `$1 uploaded: "${date}",`);
});

writeFileSync(SRC, out.join("\n"));
console.log(
  `\nwrote ${found.size} date(s) to videos-data.js${failed.length ? `, ${failed.length} still unresolved` : ""}.` +
    `\nNext: npm --prefix scripts run seo   (carries them into videos.json)` +
    `\nThen: bump the shared ?v= in index.html and npm --prefix scripts run assets:stamp`
);
