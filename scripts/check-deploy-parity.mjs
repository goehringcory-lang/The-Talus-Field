#!/usr/bin/env node
// Offline proof of the deploy-parity comparison (lib/deploy-parity.mjs).
//
// The nightly check and the nightly log both stand on compareCatalogs and
// buildRecord, and the one time they matter is the night production has
// silently rolled back, when nobody is reading the code. So the shapes that
// night takes are pinned here as fixtures: the August 2026 signature (the asset
// layer serving articles the Worker bundle does not know), a merge still
// deploying, a build older than the route, a dead origin. A wrong verdict
// here is a wrong alarm at 09:17 UTC.

import { appendLogEntry, buildRecord, compareCatalogs, describe, newestSlug } from "./lib/deploy-parity.mjs";

const failures = [];
const fail = (msg) => failures.push(msg);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const repo = ["a", "b", "c", "d"];

// 1. Everyone agrees.
{
  const r = compareCatalogs({ repoSlugs: repo, workerSlugs: [...repo], assetSlugs: [...repo] });
  if (r.verdict !== "parity") fail(`identical sets: verdict ${r.verdict}, expected parity`);
  if (r.missingFromWorker.length || r.missingFromAsset.length || r.extraLive.length) fail("identical sets: non-empty diff lists");
}

// 2. The Aug 2026 shape: the asset layer is current, the Worker is nine behind.
{
  const asset = [...repo, "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9"];
  const r = compareCatalogs({ repoSlugs: asset, workerSlugs: [...repo], assetSlugs: asset });
  if (r.verdict !== "stale-worker") fail(`Aug shape: verdict ${r.verdict}, expected stale-worker`);
  if (!eq(r.missingFromWorker, ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9"])) {
    fail(`Aug shape: missingFromWorker ${JSON.stringify(r.missingFromWorker)} (order and content must follow the asset list)`);
  }
}

// 3. A merge still deploying: live agrees with itself, the repo is one ahead.
{
  const r = compareCatalogs({ repoSlugs: [...repo, "new"], workerSlugs: [...repo], assetSlugs: [...repo] });
  if (r.verdict !== "stale-deploy") fail(`repo ahead: verdict ${r.verdict}, expected stale-deploy`);
  if (!eq(r.missingFromAsset, ["new"])) fail(`repo ahead: missingFromAsset ${JSON.stringify(r.missingFromAsset)}`);
  if (r.missingFromWorker.length) fail("repo ahead: must not read as a stale Worker");
}

// 4. Live carries a slug the repo retired (a rollback past a deletion, or a
//    checkout behind main): still a deploy mismatch, never parity.
{
  const r = compareCatalogs({ repoSlugs: repo, workerSlugs: [...repo, "gone"], assetSlugs: [...repo, "gone"] });
  if (r.verdict !== "stale-deploy") fail(`extra live slug: verdict ${r.verdict}, expected stale-deploy`);
  if (!eq(r.extraLive, ["gone"])) fail(`extra live slug: extraLive ${JSON.stringify(r.extraLive)}`);
}

// 5. A stale Worker outranks a repo lag: both true, the alarm is the Worker.
{
  const r = compareCatalogs({ repoSlugs: [...repo, "x", "y"], workerSlugs: [...repo], assetSlugs: [...repo, "x"] });
  if (r.verdict !== "stale-worker") fail(`both stale: verdict ${r.verdict}, expected stale-worker to win`);
}

// 6. The route is not there (a build older than it is live) and the dead origin.
{
  if (compareCatalogs({ repoSlugs: repo, workerSlugs: "no-route", assetSlugs: [...repo] }).verdict !== "no-route") fail("404 Worker: expected no-route");
  if (compareCatalogs({ repoSlugs: repo, workerSlugs: null, assetSlugs: [...repo] }).verdict !== "unreachable") fail("null Worker: expected unreachable");
  if (compareCatalogs({ repoSlugs: repo, workerSlugs: [...repo], assetSlugs: null }).verdict !== "unreachable") fail("null asset: expected unreachable");
}

// 7. newest is by isoDate, not by position.
{
  const list = [
    { slug: "first", isoDate: "2026-01-01" },
    { slug: "latest", isoDate: "2026-09-17" },
    { slug: "middle", isoDate: "2026-05-05" },
  ];
  if (newestSlug(list) !== "latest") fail(`newestSlug picked ${newestSlug(list)}, expected latest`);
  if (newestSlug([]) !== null) fail("newestSlug of [] must be null");
}

// 8. appendLogEntry: one record per day, capped, others untouched.
{
  const history = [
    { date: "2026-09-01", verdict: "parity" },
    { date: "2026-09-02", verdict: "parity" },
  ];
  const replaced = appendLogEntry(history, { date: "2026-09-02", verdict: "stale-worker" }, 180);
  if (replaced.length !== 2) fail(`same-date append grew the log to ${replaced.length}`);
  if (replaced[1].verdict !== "stale-worker") fail("same-date append did not replace the day's record");
  if (replaced[0].date !== "2026-09-01") fail("same-date append disturbed another day");
  const capped = appendLogEntry(
    Array.from({ length: 5 }, (_, i) => ({ date: `2026-08-0${i + 1}` })),
    { date: "2026-08-09" },
    3,
  );
  if (!eq(capped.map((e) => e.date), ["2026-08-04", "2026-08-05", "2026-08-09"])) fail(`cap kept ${JSON.stringify(capped.map((e) => e.date))}`);
  if (history.length !== 2) fail("appendLogEntry mutated its input");
}

// 9. buildRecord maps the raw fetch shapes onto the verdicts and never throws
//    on a body that is not what it expects.
{
  const repoView = { slugs: repo, newest: "d", bulletinUpdated: "2026-09-16" };
  const assetBody = repo.map((slug, i) => ({ slug, isoDate: `2026-0${i + 1}-01` }));
  const notDeployed = buildRecord({ date: "2026-09-19", repo: repoView, worker: { status: 404, body: null }, asset: { status: 200, body: assetBody } });
  if (notDeployed.verdict !== "no-route") fail(`buildRecord 404 worker: ${notDeployed.verdict}`);
  if (notDeployed.asset.count !== 4 || notDeployed.asset.newest !== "d") fail("buildRecord 404 worker: asset view lost");
  const html = buildRecord({ date: "2026-09-19", repo: repoView, worker: { status: 200, body: null }, asset: { status: 200, body: assetBody } });
  if (html.verdict !== "unreachable") fail(`buildRecord non-JSON worker: ${html.verdict}`);
  const good = buildRecord({
    date: "2026-09-19",
    repo: repoView,
    worker: { status: 200, body: { articles: 4, newest: "d", slugs: repo, bulletinUpdated: "2026-09-16", version: { id: "abc", tag: "", timestamp: "2026-09-19T05:27:00Z" } } },
    asset: { status: 200, body: assetBody },
  });
  if (good.verdict !== "parity") fail(`buildRecord parity: ${good.verdict}`);
  if (!good.workerVersion || good.workerVersion.id !== "abc") fail("buildRecord dropped the Worker version");
  if (good.worker.bulletinUpdated !== "2026-09-16") fail("buildRecord dropped the Worker bulletin stamp");
  const stale = buildRecord({
    date: "2026-09-19",
    repo: repoView,
    worker: { status: 200, body: { slugs: ["a", "b"], version: null } },
    asset: { status: 200, body: assetBody },
  });
  if (stale.verdict !== "stale-worker" || !eq(stale.missingFromWorker, ["c", "d"])) fail(`buildRecord stale: ${stale.verdict} ${JSON.stringify(stale.missingFromWorker)}`);
  if (!/STALE/.test(describe(stale)) || !/c, d/.test(describe(stale))) fail("describe(stale-worker) must name the slugs");
  if (!/parity OK/.test(describe(good)) || !/abc/.test(describe(good))) fail("describe(parity) must carry the version id");
}

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`);
  process.exit(1);
}
console.log("check-deploy-parity: 9 fixture groups agree with the comparison (parity, stale-worker, stale-deploy, no-route, unreachable, newest, log cap, record shapes).");
