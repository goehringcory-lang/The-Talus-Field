# Article drafts (UNPUBLISHED)

These are drafts for the owner's review. **None of them is on the site.** `docs/` is listed in `.assetsignore`, so nothing in this folder is uploaded or served. Nothing here is registered in `data.js`, `seo-data.json`, `intent-data.js`, the sitemaps, `articles.json`, the llms files or `index.html`. No live page links to any of them, and no draft links to another draft.

Drafted October 16, 2026. All facts were read from their sources that day. Re-check anything dated before publishing.

| Slug | Target intent | Primary queries | Approx. words |
|---|---|---|---|
| `yosemite-in-february` | Planning a February trip (fills the month series between January and March) | yosemite in february, february weather, is yosemite open in february, presidents day weekend, camping in february | ~2,150 |
| `badger-pass-ski-area` | Everything about the ski area: is it open, prices, lessons, tubing, Nordic, shuttle, huts | badger pass ski area, is badger pass open, badger pass opening, badger pass ski season, badger pass tubing, yosemite ski & snowboard area | ~2,100 |
| `snowshoeing-in-yosemite` | Where and how to snowshoe: the three marked areas, ranger and guided walks, rentals, safety, permits | snowshoeing in yosemite, ranger led snowshoe walk, dewey point snowshoe, crane flat snowshoe, snowshoe rental | ~2,150 |

The word counts are estimates (the raw files are about 2,500 to 2,600 words including markup and the Sources list). Compute the real `wordCount` at publish.

Each folder holds:

- `body.jsx`: the article body, in the exact `bodies/*.jsx` format, with five in-body links to existing articles plus route links.
- `entry.js`: the proposed `window.ARTICLES` object (dates left as `TODO`), the `BODY_VERSIONS` line, the `window.RELATED` row with suggested inbound edits, proposed `ARTICLE_INTENT` / `ARTICLE_MONTHS` tags, and the `seo-data.json` enrichment (FAQ answers restate the body only).
- `SOURCES.md`: every claim mapped to its source URL, which claims rest on secondary press coverage, canon notes, and the list of things the owner must verify.

## Topic check (done before writing)

All three topics were checked against `yosemite-in-winter`, `yosemite-winter-hikes`, `yosemite-in-january`, `yosemite-in-december`, `yosemite-in-march`, `horsetail-fall-firefall`, `glacier-point-how-to-visit` and `mariposa-grove-how-to-visit`. None is already fully covered, so none was replaced:

- **February** had no month guide. It leaves the firefall itself to `horsetail-fall-firefall` and `/firefall`, and covers the trip around it.
- **Badger Pass** is covered only in paragraphs inside the season and month guides. Its queries are already in `seo-data.json` on other pages (`badger pass tubing` and `badger pass ski season` on January, `badger pass opening` on December, `badger pass ski area` on the winter guide). **Move those keywords to this article when it publishes.**
- **Snowshoeing** gets one paragraph in the winter guide, and the winter-hikes guide explicitly stops at the snow line. Keep `dewey point snowshoe` on one page only.

## Things to decide before publishing any of them

1. **Hero images.** Every winter photo in `img/` is already some article's hero. The February draft reuses the winter-hikes hero. The Badger and snowshoe drafts both propose `clark-range-view-glacier-point-road.jpg`. There is no Badger Pass photo in the repo. A new licensed image (exact credit, slug-named into `img/`, then `run images`) would help at least one of them.
2. **Unpublished current-season figures.** 2026-27 Badger Pass opening date, ticket, lesson and rental prices; the 2027 firefall rules; the 2027 fee-free days; any 2027 entry-reservation decision. The drafts say plainly that each is unpublished. Update them if they have been published by launch.
3. **Secondary sources.** The Badger Pass season record (2024-25 cancelled; 2025-26 lifts Jan 16 to Mar 18) and the 2016 to 2019 name history rest on press reports, not nps.gov. See each `SOURCES.md`.
4. **One canon flag.** `yosemite-in-winter` describes the ranger snowshoe walks as "typically two hours... with snowshoes provided". The current NPS page does not say either. The snowshoe draft omits both. Consider re-sourcing that line in the winter guide.
5. **Cross-links between drafts.** None of the bodies links another draft, because a link to an unpublished slug would 404. When a second one publishes, add the sibling link (for example, February's Badger paragraph to `/articles/badger-pass-ski-area`, and the snowshoe piece's Badger section to the same) and update the `RELATED` rows as noted in each `entry.js`.

## How to publish one (from SEO.md's publishing checklist and the weekly-trend-article runbook)

Work on a fresh branch from `origin/main`, one article per PR. `cd scripts && npm install` once.

1. **Body.** Copy `docs/drafts/<slug>/body.jsx` to `bodies/<slug>.jsx` and delete the three-line "DRAFT, NOT PUBLISHED" comment. Re-verify every dated figure in `SOURCES.md` against its URL, and fix the copy where anything moved.
2. **`data.js`.**
   - `window.ARTICLES`: insert the `ARTICLE` object from `entry.js` **at the top of the array**. Fill `date` ("Month D, YYYY"), `isoDate` and `isoModified` with the publish day. Set `read` to wordCount ÷ 260. Delete the `NOTE` comments. Keep `aff: true` on February and Badger (their bodies carry `LodgingCta` + `AffiliateNote`); snowshoeing has none.
   - `window.BODY_VERSIONS`: add `"<slug>": 1,`.
   - `window.RELATED`: add the row from `entry.js` (4 to 6 slugs, no self-link). Apply the suggested inbound edits to two or three existing rows if you agree with them.
3. **`intent-data.js`.** Add the `ARTICLE_INTENT` entry and, for all three, the `ARTICLE_MONTHS` entry from `entry.js`. Read the file's header rules first; do not touch `TRIP_RULES` unless `check-intent-tags` fails.
4. **`seo-data.json`.** Add the enrichment from `entry.js`. Set `wordCount` to the real count, and make sure every FAQ answer still matches the body word for word in substance. Move the Badger keywords off the January and December entries if you publish the Badger piece (and decide where `dewey point snowshoe` lives).
5. **Images.** If you add a new hero photo, put it in `img/<slug-name>.jpg` with its exact license credit and run `npm --prefix scripts run images`.
6. **Generate, in order:**
   ```bash
   npm --prefix scripts run prerender
   npm --prefix scripts run compile
   npm --prefix scripts run seo          # articles.json, sitemap, feed, llms.txt, llms-full.txt, index.html noscript list
   npm --prefix scripts run assets:stamp # content hashes in index.html; records the body version
   ```
   (SEO.md runs prerender and compile before seo; the runbook's order, compile, then seo, then prerender, also works if you re-run seo after prerender so `llms-full.txt` picks up the new fragment.)
7. **Gates:** `npm --prefix scripts run check` must pass, and `npm --prefix scripts run checks` must show no **new** errors. After `run seo`, confirm the article's `ogImage` materialized in `articles.json`.
8. **Commit** the hand-edited files (`bodies/<slug>.jsx`, `data.js`, `intent-data.js`, `seo-data.json`) together with everything regenerated (`dist/bodies/<slug>.js`, `prerender/<slug>.html`, `articles.json`, `sitemap-articles.xml` / sitemap files, `feed.xml`, `llms.txt`, `llms-full.txt`, `index.html`, `scripts/data/asset-versions.json`). Open a PR. Merging publishes.
9. Optionally request indexing for the new URL in Search Console (SEO.md, "The actual bottleneck").

Once a draft is published, delete its folder here so it cannot drift from the live copy.

## Not verified in this session

The sandbox would not let this session run Node, so the bodies were **not** parsed by Babel or run through `run check`. Steps 6 and 7 above will catch any syntax slip. The bodies use only components the existing bodies already use (`Placeholder`, `MotifMountains`, `MotifTrees`, `LodgingCta`, `AffiliateNote`) and the existing `article_cta` placement.
