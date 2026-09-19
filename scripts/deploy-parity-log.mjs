#!/usr/bin/env node
//
// Record tonight's editorial deploy parity in scripts/data/deploy-parity-log.json.
//
// The nightly system-checks run can say "stale" on the night it happens; this
// file is the memory across nights, and the reason it exists is the August
// 2026 recurrence that CLAUDE.md could only describe as "production regressed
// with no merge on this side". Each record carries the verdict, the Worker's
// version id and timestamp (version_metadata binding), and the three catalog
// counts, so a rollback shows as a version id and a verdict changing on a
// night with no commit, and the Cloudflare deploy history can be read against
// a date instead of a guess. The lighthouse job in system-checks.yml runs this
// and commits the file with the Lighthouse history.
//
// Builtins only: that job never runs `npm ci` in scripts/.
//
// Usage: node scripts/deploy-parity-log.mjs [--base-url=https://...] [--file=path]

import { writeFileSync } from "node:fs";
import path from "node:path";
import {
  LOG_PATH,
  ROOT,
  SITE_ORIGIN,
  appendLogEntry,
  buildRecord,
  describe,
  fetchLiveViews,
  readLog,
  repoView,
} from "./lib/deploy-parity.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);
const base = typeof args["base-url"] === "string" ? args["base-url"] : SITE_ORIGIN;
const file = typeof args.file === "string" ? path.resolve(args.file) : LOG_PATH;

const repo = repoView();
const live = await fetchLiveViews(base);
const record = buildRecord({ date: new Date().toISOString().slice(0, 10), repo, worker: live.worker, asset: live.asset });

const history = appendLogEntry(readLog(file), record);
writeFileSync(file, JSON.stringify(history, null, 2) + "\n");

const ver = record.workerVersion && record.workerVersion.id ? record.workerVersion.id : "no version";
console.log(
  `deploy-parity: ${record.verdict} · worker ${record.worker.count ?? "?"}/${record.worker.newest ?? "?"} (${ver}) · ` +
    `asset ${record.asset.count ?? "?"} · repo ${record.repo.count} · ${path.relative(ROOT, file)} now ${history.length} record(s)`,
);
if (record.verdict !== "parity") console.log(`::warning::${describe(record)}`);
