#!/usr/bin/env node
//
// Guards the reader-intent model in intent-data.js against the article catalog
// in data.js. Wired into `npm --prefix scripts run check`.
//
// window.ARTICLE_INTENT is hand-maintained curation keyed by slug. Nothing at
// runtime notices when it falls out of step with the catalog: an article added
// without a tag entry simply never appears under any filter, and a tag entry
// left behind by a deleted article is invisible. Both read to a reader as "the
// site does not have an article about that". This script fails the build on
// either, plus:
//
//   - a tag id that is not an option in INTENT_FACETS (a typo silently makes
//     the article unfilterable in that facet)
//   - a TRIP_MONTHS `read` slug that does not resolve
//   - any complete set of trip-selector answers that produces an empty read
//     list, an itinerary id the itineraries data does not define, or a product
//     route that is not a real route (swept exhaustively, 18,200 combinations)
//   - a part label in page-planning-guide.jsx's PLANNING_PARTS with no matching
//     entry in window.PLANNING_SERIES, which would render that part with no
//     articles under it
//
// Untagged articles (no tag in any facet) are reported as a warning, not an
// error: the natural-history essays answer no logistics question and giving one
// a topic tag to fill the blank would put it in front of a reader who asked
// about permits.

import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { ROOT, loadDataJs } from "./lib/catalog.mjs";

const VERBOSE = process.argv.includes("--verbose");

// Evaluate the raw window-global scripts the browser loads on /planning.
function loadWindow(files) {
  const sandbox = {
    window: {},
    document: { createElement: () => ({}), body: { appendChild() {} }, head: { appendChild() {} } },
    navigator: { userAgent: "node" },
    console,
    fetch: () => Promise.resolve(),
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of files) {
    try {
      vm.runInContext(readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
    } catch (e) {
      console.error(`check-intent-tags: failed to evaluate ${f} under node:vm\n${e.stack}`);
      process.exit(2);
    }
  }
  return sandbox.window;
}

const { articles } = loadDataJs();
const w = loadWindow(["intent-data.js", "itineraries-data.js"]);
// The scoring in buildTripPlan reads window.ARTICLES; give it the real catalog.
w.ARTICLES = articles;

const errors = [];
const warnings = [];

// ---- facet + tag integrity -------------------------------------------------

const facetOptions = {};
for (const facet of w.INTENT_FACETS) {
  facetOptions[facet.id] = new Set(facet.options.map((o) => o.id));
}
const FACET_IDS = Object.keys(facetOptions);
for (const expected of ["stage", "who", "topic"]) {
  if (!facetOptions[expected]) errors.push(`INTENT_FACETS is missing the "${expected}" facet`);
}

const catalogSlugs = new Set(articles.map((a) => a.slug));
const taggedSlugs = Object.keys(w.ARTICLE_INTENT);

for (const slug of catalogSlugs) {
  if (!w.ARTICLE_INTENT[slug]) {
    errors.push(`data.js has "${slug}" but intent-data.js does not tag it (it would be invisible to every filter)`);
  }
}
for (const slug of taggedSlugs) {
  if (!catalogSlugs.has(slug)) {
    errors.push(`intent-data.js tags "${slug}", which is not in window.ARTICLES`);
  }
}

let untagged = 0;
for (const slug of taggedSlugs) {
  const entry = w.ARTICLE_INTENT[slug];
  let total = 0;
  for (const facet of FACET_IDS) {
    const tags = entry[facet];
    if (tags === undefined) {
      errors.push(`"${slug}" has no "${facet}" key (use [] to mean "answers nothing in this facet")`);
      continue;
    }
    if (!Array.isArray(tags)) {
      errors.push(`"${slug}".${facet} is not an array`);
      continue;
    }
    total += tags.length;
    for (const id of tags) {
      if (!facetOptions[facet].has(id)) {
        errors.push(`"${slug}".${facet} carries unknown tag "${id}"`);
      }
    }
    if (new Set(tags).size !== tags.length) {
      errors.push(`"${slug}".${facet} repeats a tag`);
    }
  }
  for (const key of Object.keys(entry)) {
    if (!FACET_IDS.includes(key)) errors.push(`"${slug}" carries unknown facet "${key}"`);
  }
  if (total === 0) {
    untagged++;
    if (VERBOSE) warnings.push(`"${slug}" carries no tags in any facet: no filter can reach it`);
  }
}
if (untagged && !VERBOSE) {
  warnings.push(`${untagged} article${untagged === 1 ? " carries" : "s carry"} no tags in any facet (run with --verbose to list them)`);
}

// Every facet option should reach at least one article, or the chip renders
// permanently dimmed and reads as a broken control.
for (const facet of w.INTENT_FACETS) {
  for (const opt of facet.options) {
    const n = taggedSlugs.filter((s) => (w.ARTICLE_INTENT[s][facet.id] || []).includes(opt.id)).length;
    if (n === 0) errors.push(`no article carries ${facet.id}="${opt.id}": that chip is dead on arrival`);
  }
}

// ---- trip selector ---------------------------------------------------------

for (const m of w.TRIP_MONTHS) {
  if (!catalogSlugs.has(m.read)) {
    errors.push(`TRIP_MONTHS "${m.key}" points its read at "${m.read}", which is not in the catalog`);
  }
  for (const road of ["tioga", "glacier"]) {
    if (!["open", "closed", "unsettled"].includes(m[road])) {
      errors.push(`TRIP_MONTHS "${m.key}".${road} is "${m[road]}" (expected open | closed | unsettled)`);
    }
  }
}

const monthKeys = new Set(w.TRIP_MONTHS.map((m) => m.key));
for (const [slug, months] of Object.entries(w.ARTICLE_MONTHS)) {
  if (!catalogSlugs.has(slug)) errors.push(`ARTICLE_MONTHS tags "${slug}", which is not in window.ARTICLES`);
  if (!Array.isArray(months) || !months.length) {
    errors.push(`ARTICLE_MONTHS "${slug}" has no months (drop the entry to mean "any month")`);
    continue;
  }
  for (const key of months) {
    if (!monthKeys.has(key)) errors.push(`ARTICLE_MONTHS "${slug}" names unknown month "${key}"`);
  }
}
// A month whose own anchor read is outside that month's window would have its
// anchor dropped by the very table meant to protect it.
for (const m of w.TRIP_MONTHS) {
  if (!w.articleFitsMonth(m.read, m.key)) {
    errors.push(`TRIP_MONTHS "${m.key}" reads "${m.read}", which ARTICLE_MONTHS excludes from ${m.key}`);
  }
}
// Over-tagging is the opposite failure from under-tagging and just as quiet: a
// month whose in-season archive has collapsed hands its visitors a thin plan and
// a filter bar of dead chips, with nothing at runtime to say why.
const MIN_IN_SEASON = Math.ceil(articles.length * 0.6);
for (const m of w.TRIP_MONTHS) {
  const n = articles.filter((a) => w.articleFitsMonth(a.slug, m.key)).length;
  if (n < MIN_IN_SEASON) {
    errors.push(
      `ARTICLE_MONTHS leaves only ${n} of ${articles.length} entries in season for ${m.key} ` +
        `(floor ${MIN_IN_SEASON}): the month table has been over-applied`
    );
  }
}

const itineraryIds = new Set((w.ITINERARIES || []).map((i) => i.id));
const PRODUCT_ROUTES = new Set(["guide", "consult", "checklist", "map", "itineraries"]);

const q = (id) => w.TRIP_QUESTIONS.find((x) => x.id === id);
if (w.TRIP_QUESTIONS.length !== 5) {
  errors.push(`TRIP_QUESTIONS has ${w.TRIP_QUESTIONS.length} questions; the selector is a five-question tool`);
}

let swept = 0;
const badCombos = [];
for (const when of q("when").options) {
  for (const days of q("days").options) {
    for (const stay of q("stay").options) {
      for (const party of q("party").options) {
        for (const focus of q("focus").options) {
          const answers = { when: when.id, days: days.id, stay: stay.id, party: [party.id], focus: focus.id };
          swept++;
          if (!w.tripAnswersComplete(answers)) {
            badCombos.push(`${JSON.stringify(answers)}: not judged complete`);
            continue;
          }
          const plan = w.buildTripPlan(answers);
          if (!plan) { badCombos.push(`${JSON.stringify(answers)}: no plan`); continue; }
          if (!plan.reads.length) badCombos.push(`${JSON.stringify(answers)}: empty read list`);
          for (const a of plan.reads) {
            if (!catalogSlugs.has(a.slug)) badCombos.push(`${JSON.stringify(answers)}: read "${a.slug}" not in catalog`);
          }
          if (!itineraryIds.has(plan.itinerary.id)) {
            badCombos.push(`${JSON.stringify(answers)}: itinerary "${plan.itinerary.id}" is not in itineraries-data.js`);
          }
          if (!PRODUCT_ROUTES.has(plan.product.route)) {
            badCombos.push(`${JSON.stringify(answers)}: product route "${plan.product.route}" is not a known route`);
          }
          if (plan.product.secondary && !PRODUCT_ROUTES.has(plan.product.secondary.route)) {
            badCombos.push(`${JSON.stringify(answers)}: secondary route "${plan.product.secondary.route}" is not a known route`);
          }
          // The five reads are month-filtered inside buildTripPlan. Assert it
          // rather than trust it: this is the list the reader judges the tool by.
          for (const a of plan.reads) {
            if (!w.articleFitsMonth(a.slug, when.id)) {
              badCombos.push(`${JSON.stringify(answers)}: read "${a.slug}" does not apply in ${when.id}`);
            }
          }
          // The plan promises "show all N entries that fit"; N must not be a lie.
          // The month has to survive the hand-off or the promise is false in the
          // most visible way there is: a July trip offered "Yosemite in Winter".
          const matches = w.filterArticlesByIntent(articles, plan.intent);
          if (matches.length === 0) {
            badCombos.push(`${JSON.stringify(answers)}: derived intent matches nothing`);
          }
          if (w.intentMonthOf(plan.intent) !== (when.id === "unsure" ? "" : when.id)) {
            badCombos.push(`${JSON.stringify(answers)}: derived intent lost the month (carries "${plan.intent.month}")`);
          }
          for (const a of matches) {
            if (!w.articleFitsMonth(a.slug, when.id)) {
              badCombos.push(`${JSON.stringify(answers)}: hand-off offers "${a.slug}", which does not apply in ${when.id}`);
            }
          }
          // The chip counts are what the reader trusts before clicking. Every one
          // has to be reachable in the results grid the click produces.
          const counts = w.intentCounts(articles, plan.intent);
          for (const facet of w.INTENT_FACETS) {
            for (const opt of facet.options) {
              const next = Object.assign({}, plan.intent, { [facet.id]: [opt.id] });
              if (counts[facet.id][opt.id] !== w.filterArticlesByIntent(articles, next).length) {
                badCombos.push(`${JSON.stringify(answers)}: chip count ${facet.id}/${opt.id} does not match its own result set`);
              }
            }
          }
          // The lodging hand-off renders only when the bed is unbooked, and
          // then always completely: a partial object renders a broken CTA.
          const wantsLodging = stay.id === "undecided" || stay.id === "gateway";
          if (wantsLodging !== Boolean(plan.lodging)) {
            badCombos.push(`${JSON.stringify(answers)}: lodging ${plan.lodging ? "present" : "absent"} for stay "${stay.id}"`);
          }
          if (plan.lodging && !(plan.lodging.destination && plan.lodging.heading && plan.lodging.cta)) {
            badCombos.push(`${JSON.stringify(answers)}: lodging hand-off is missing destination, heading, or cta`);
          }
        }
      }
    }
  }
}
// One representative failure per shape is enough to act on.
for (const line of badCombos.slice(0, 8)) errors.push(`trip selector — ${line}`);
if (badCombos.length > 8) errors.push(`trip selector — ${badCombos.length - 8} further failing combinations`);

// ---- the Planning Guide's parts --------------------------------------------

const pageSrc = readFileSync(path.join(ROOT, "page-planning-guide.jsx"), "utf8");
const partLabels = [...pageSrc.matchAll(/^\s*part: "([^"]+)",$/gm)].map((m) => m[1]);
const dataWindow = loadWindow(["affiliate.js", "data.js"]);
const seriesLabels = new Set((dataWindow.PLANNING_SERIES || []).map((s) => s.part));

if (!partLabels.length) {
  errors.push("page-planning-guide.jsx declares no PLANNING_PARTS entries (expected `part: \"...\"` lines)");
}
for (const label of partLabels) {
  if (!seriesLabels.has(label)) {
    errors.push(`page-planning-guide.jsx renders part "${label}", which has no entry in window.PLANNING_SERIES: it would render with no articles`);
  }
}
for (const label of seriesLabels) {
  if (!partLabels.includes(label)) {
    warnings.push(`PLANNING_SERIES carries "${label}", which the Planning Guide does not render`);
  }
}

// ---- report ----------------------------------------------------------------

for (const wmsg of warnings) console.warn(`warn: ${wmsg}`);
if (errors.length) {
  console.error(`\ncheck-intent-tags: ${errors.length} error${errors.length === 1 ? "" : "s"}`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `check-intent-tags: ${taggedSlugs.length} articles tagged across ${FACET_IDS.length} facets, ` +
    `${swept} trip-selector combinations produce a real plan, ${partLabels.length} guide parts resolve.`
);
