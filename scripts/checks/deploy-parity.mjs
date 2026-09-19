// Editorial deploy parity (online): is the live Worker running the catalog the
// asset layer and the repo say it should?
//
// The editorial Worker (edge/seo.js) bakes articles.json into its bundle at
// deploy time. Twice in August 2026 production ran a Worker build older than
// the assets beside it, so the newest articles 404'd while the sitemap listed
// them, and the only detector was a human noticing. checks/api.mjs gave the
// API Worker a parity probe against wrangler.toml; this is the same idea for
// the editorial Worker, against the catalog itself: the build-info route
// (BUILD_INFO_PATH in lib/deploy-parity.mjs) reports the slugs the live bundle
// knows, /articles.json reports what the asset layer serves, ctx.articles is
// the repo.
//
// Severity follows the posture of the rest of the suite. The Aug signature
// (asset has slugs the Worker lacks) is an ERROR: readers hit 404s on the
// pieces the sitemap and the letter just pointed them at, and no repo change
// can clear it. Live lagging the repo is a WARN, because the nightly runs
// minutes after nothing in particular and a merge may be mid-build. A dead
// origin is a WARN here (the smoke check already errors on it). The route
// answering 404 is a WARN while the route has never been seen live, and an
// ERROR once the committed log shows it was: a 404 after that is a build
// older than the route, which is a rollback by definition.
//
// Skipped offline (needs egress).

import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";
import { buildRecord, describe, fetchLiveViews, newestSlug, readLog } from "../lib/deploy-parity.mjs";

function repoBulletinStamp() {
  try {
    return JSON.parse(readFileSync(path.join(ROOT, "bulletin.json"), "utf8"))?.edition?.updated ?? null;
  } catch {
    return null;
  }
}

export default async function checkDeployParity(ctx) {
  const check = makeCheck("Editorial deploy parity (Worker vs assets vs repo)");
  if (!ctx.online) {
    check.info("skipped (offline; needs egress)");
    return check.result();
  }

  const base = (ctx.baseUrl || SITE_ORIGIN).replace(/\/$/, "");
  check.info(`target ${base}`);

  const repo = {
    slugs: ctx.articles.map((a) => a.slug),
    newest: newestSlug(ctx.articles),
    bulletinUpdated: repoBulletinStamp(),
  };
  const live = await fetchLiveViews(base);
  const record = buildRecord({ date: new Date().toISOString().slice(0, 10), repo, worker: live.worker, asset: live.asset });
  const text = describe(record);

  switch (record.verdict) {
    case "stale-worker":
      check.error(text);
      break;
    case "stale-deploy":
      check.warn(text);
      break;
    case "unreachable":
      check.warn(`${text}; ${live.worker.error || live.asset.error || "no body"}`);
      break;
    case "no-route": {
      // The route ships with the same deploy that carries this check, so the
      // first nights after merge can legitimately see a 404. The committed log
      // is the memory: once any night has recorded a Worker version, the route
      // was live, and a 404 now means an older build is serving.
      const seenLive = readLog().some((e) => e && e.workerVersion && e.workerVersion.id);
      const lag = record.asset.count === record.repo.count ? "asset layer matches the repo" : "asset layer and repo disagree";
      if (seenLive) {
        check.error(`${text}: the log shows the route was live before, so a build older than it is serving now (${lag}). Fix: redeploy current main from the Cloudflare dashboard.`);
      } else {
        check.warn(`${text} (${lag}); expected until the Worker build carrying the route lands`);
      }
      break;
    }
    default: {
      check.info(text);
      if (record.worker.bulletinUpdated && repo.bulletinUpdated && record.worker.bulletinUpdated !== repo.bulletinUpdated) {
        // HUB_PROSE freezes bulletin.json into the same bundle: the crawler
        // prose for /now is the old edition until the Worker redeploys.
        check.warn(
          `Worker carries bulletin edition updated ${record.worker.bulletinUpdated}, repo says ${repo.bulletinUpdated}; ` +
            `the /now crawler prose is stale until the Worker redeploys (a merge to main does it).`,
        );
      }
    }
  }
  return check.result();
}
