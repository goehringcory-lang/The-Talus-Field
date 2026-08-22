// API Worker health (online).
//
// Every other module in this suite points at the editorial site. Nothing has
// ever pointed at api.thetalusfieldjournal.com, which is the one deployable
// that does NOT auto-deploy from main (root CLAUDE.md, "Deployment"): it ships
// only when somebody runs `wrangler deploy` from workers/. So the Worker is
// simultaneously the least-watched and the most expensive thing to have quietly
// broken — it holds checkout, the Stripe webhook, the KV buyer records, and the
// renewal sweep. A regression there is not a cosmetic SEO drift; it is a reader
// who cannot buy, and the first report would be an email from a buyer.
//
// The stale-deploy detector is the parity block below. `/api/inventory` echoes
// priceCents, renewalPriceCents, and cap straight out of [vars] in
// workers/wrangler.toml, so the repo already states what a current deploy must
// answer. When the live numbers disagree with the file, the deployed Worker
// predates the repo — the same class of failure the editorial Worker hit twice
// in Aug 2026 (see "Things that have surprised past edits"), which took a
// human noticing 404s to catch.
//
// Severity follows the site's own posture: anything that breaks a SALE is an
// error (the API is unreachable, the price is stale, CORS stops echoing so the
// buy box's fetch dies). The read-only feeds render nothing rather than an
// error by design, so their failures are warnings — real drift to fix, not a
// reason to fail the nightly.
//
// Skipped offline (needs egress).

import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";

const DEFAULT_API_BASE = "https://api.thetalusfieldjournal.com";
const WRANGLER = path.join(ROOT, "workers", "wrangler.toml");

// Weather refreshes inline past 2h (workers/src/routes/weather.ts). Past this
// the cron and the inline refresh have both failed to land for hours.
const WEATHER_STALE_MS = 6 * 60 * 60 * 1000;
const PROGRAMS_WINDOW_DAYS = 14;

// Declared [vars] only: a commented example line must never be read as config.
function wranglerVar(src, key) {
  const m = src.match(new RegExp(`^[ \\t]*${key}[ \\t]*=[ \\t]*"([^"]*)"`, "m"));
  return m ? m[1] : null;
}

function expectedVars() {
  let src;
  try {
    src = readFileSync(WRANGLER, "utf8");
  } catch {
    return null;
  }
  const num = (k) => {
    const raw = wranglerVar(src, k);
    if (raw === null) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  };
  return {
    priceCents: num("GUIDE_PRICE_CENTS"),
    renewalPriceCents: num("GUIDE_RENEWAL_PRICE_CENTS"),
    cap: num("GUIDE_MONTHLY_CAP"),
  };
}

async function getJson(url, { timeoutMs = 12000, retries = 1, headers = {} } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "talus-field-system-checks", ...headers },
        signal: ctrl.signal,
      });
      const text = await res.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch {
        /* non-JSON body is itself the finding; callers see body === null */
      }
      return { ok: res.ok, status: res.status, body, res };
    } catch (e) {
      if (attempt === retries) return { ok: false, status: 0, body: null, error: e.message };
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, status: 0, body: null, error: "unreachable" };
}

function isoDaysFromNow(days) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

export default async function checkApi(ctx) {
  const check = makeCheck("API Worker (money path + feeds)");
  if (!ctx.online) {
    check.info("skipped (offline; needs egress)");
    return check.result();
  }

  const base = (ctx.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");
  check.info(`target ${base}`);

  // --- Inventory: reachability, shape, and repo parity ---------------------
  // The buy box calls this on every /guide render, so it is both the liveness
  // probe and the staleness probe.
  const inv = await getJson(`${base}/api/inventory`, {
    headers: { Origin: SITE_ORIGIN },
  });

  if (!inv.ok) {
    check.error(
      `/api/inventory unreachable or failing (${inv.status || inv.error}). ` +
        `The buy box reads this on every /guide render — readers cannot purchase.`,
    );
    // Everything downstream shares the origin; one report beats six timeouts.
    return check.result();
  }
  if (!inv.body || typeof inv.body !== "object") {
    check.error("/api/inventory returned a non-JSON body");
    return check.result();
  }

  const expected = expectedVars();
  if (!expected) {
    check.warn(`could not read ${path.relative(ROOT, WRANGLER)}; skipped deploy-parity check`);
  } else {
    for (const [key, label] of [
      ["priceCents", "GUIDE_PRICE_CENTS"],
      ["renewalPriceCents", "GUIDE_RENEWAL_PRICE_CENTS"],
      ["cap", "GUIDE_MONTHLY_CAP"],
    ]) {
      const want = expected[key];
      const got = inv.body[key];
      if (want === null) {
        check.warn(`${label} not declared in wrangler.toml [vars]; parity unchecked for ${key}`);
      } else if (got !== want) {
        check.error(
          `${key}: live Worker says ${got}, repo says ${want} (${label}). ` +
            `The deployed Worker is out of date — run \`wrangler deploy\` from workers/.`,
        );
      }
    }
    if (
      expected.priceCents !== null &&
      inv.body.priceCents === expected.priceCents &&
      inv.body.cap === expected.cap
    ) {
      check.info(`deploy parity OK (price ${inv.body.priceCents}¢, cap ${inv.body.cap})`);
    }
  }

  // Sold-out is a legitimate state, not a fault — but the owner wants to know
  // before the buy box starts turning readers away.
  const { sold, cap } = inv.body;
  if (typeof sold === "number" && typeof cap === "number" && cap > 0) {
    if (sold >= cap) check.warn(`monthly inventory exhausted (${sold}/${cap}) — the buy box reads sold out`);
    else if (sold >= cap * 0.9) check.warn(`monthly inventory nearly gone (${sold}/${cap})`);
  }

  // --- CORS: the buy box's fetch is cross-origin ---------------------------
  // The middleware echoes allow-listed origins (workers/src/index.ts). If it
  // stops echoing the editorial origin, /guide's fetch fails in the browser
  // while curl still reports a clean 200 — invisible to any status-only probe.
  const acao = inv.res?.headers.get("access-control-allow-origin");
  if (!acao) {
    check.error(
      `/api/inventory sent no Access-Control-Allow-Origin for ${SITE_ORIGIN}; ` +
        `the buy box's cross-origin fetch fails in the browser.`,
    );
  } else if (acao !== SITE_ORIGIN && acao !== "*") {
    check.error(`/api/inventory echoed Access-Control-Allow-Origin: ${acao} (expected ${SITE_ORIGIN})`);
  } else {
    check.info("CORS echoes the editorial origin");
  }

  // --- Read-only feeds: warn-level by design -------------------------------
  const weather = await getJson(`${base}/api/weather`);
  if (!weather.ok) {
    check.warn(`/api/weather failing (${weather.status || weather.error})`);
  } else if (!Array.isArray(weather.body?.spots) || weather.body.spots.length === 0) {
    check.warn("/api/weather returned no spots — every forecast surface renders empty");
  } else {
    const at = Date.parse(weather.body.fetchedAt ?? "");
    const age = Number.isNaN(at) ? null : Date.now() - at;
    if (age === null) check.warn("/api/weather carries no parseable fetchedAt");
    else if (age > WEATHER_STALE_MS) {
      check.warn(
        `/api/weather is ${Math.round(age / 3600000)}h stale — the inline refresh and the daily cron ` +
          `have both failed to land (NWS outage, or a missing/rotated User-Agent).`,
      );
    } else {
      check.info(`weather fresh (${weather.body.spots.length} spots, ${Math.round(age / 60000)}m old)`);
    }
  }

  const waits = await getJson(`${base}/api/waits`);
  if (!waits.ok) check.warn(`/api/waits failing (${waits.status || waits.error})`);
  else if (!Array.isArray(waits.body?.waits)) {
    // The route's contract is that a dead upstream still serves {fetchedAt:
    // null, waits: []}, so a malformed body means the route itself broke.
    check.warn("/api/waits body is malformed (expected a waits array; the route promises [] on a dead feed)");
  } else {
    const n = waits.body.waits.length;
    check.info(`waits shape OK (${n} entrance${n === 1 ? "" : "s"})`);
  }

  // Programs is the one feed whose emptiness is an editorial deadline, not an
  // outage: most manual entries are windowed to the current printed Yosemite
  // Guide edition (GUIDE_START/GUIDE_END in manual-programs.ts) and lapse every
  // ~5 weeks. An empty fortnight means that re-curation pass is overdue.
  const programs = await getJson(
    `${base}/api/programs?start=${isoDaysFromNow(0)}&end=${isoDaysFromNow(PROGRAMS_WINDOW_DAYS)}`,
  );
  if (!programs.ok) {
    check.warn(`/api/programs failing (${programs.status || programs.error})`);
  } else {
    const events = programs.body?.events;
    if (!Array.isArray(events)) check.warn("/api/programs returned no events array");
    else if (events.length === 0) {
      check.warn(
        `/api/programs is empty for the next ${PROGRAMS_WINDOW_DAYS} days — either the Guide-edition ` +
          `curation in manual-programs.ts has lapsed (re-curate + deploy) or NPS ingest is failing.`,
      );
    } else check.info(`programs feed carries ${events.length} events over ${PROGRAMS_WINDOW_DAYS} days`);
  }

  // --- The free embed: partner-facing, so drift is visible off-site --------
  const widget = await getJson(`${base}/widget.js`);
  if (!widget.ok) {
    check.warn(`/widget.js failing (${widget.status || widget.error}) — gateway-site embeds are dead`);
  } else if (widget.res?.headers.get("access-control-allow-origin") !== "*") {
    check.warn("/widget.js is not sending Access-Control-Allow-Origin: * — third-party embeds will block it");
  } else check.info("widget embed serving");

  return check.result();
}
