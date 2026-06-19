// RSS feed validity.
//
// Buttondown pulls the newsletter from feed.xml; a malformed feed means no email
// goes out, so these are errors. Confirms the feed is well-formed XML, has the
// required RSS 2.0 channel scaffolding, one <item> per published article with the
// required item fields, and RFC-822 pubDates.

import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";
import { xmlWellFormed } from "../lib/xml.mjs";

const RFC822 = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}$/;

function block(src, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g");
  return [...src.matchAll(re)].map((m) => m[1]);
}
function field(src, tag) {
  const m = src.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : null;
}

export default async function checkFeed(ctx) {
  const check = makeCheck("RSS feed validity");
  const src = readFileSync(path.join(ROOT, "feed.xml"), "utf8");

  const wf = xmlWellFormed(src);
  if (!wf.ok) {
    check.error(`feed.xml is not well-formed: ${wf.error}`);
    return check.result();
  }

  if (!/<rss[^>]*version="2.0"/.test(src)) check.error("feed.xml is not RSS version 2.0");
  for (const tag of ["title", "link", "description"]) {
    if (!field(src, tag)) check.error(`feed channel missing <${tag}>`);
  }

  const items = block(src, "item");
  if (!items.length) {
    check.error("feed.xml has no <item> entries");
    return check.result();
  }

  const itemLinks = new Set();
  for (const item of items) {
    const link = field(item, "link");
    const title = field(item, "title");
    const pub = field(item, "pubDate");
    if (!title) check.error("feed item missing <title>");
    if (!link) check.error("feed item missing <link>");
    else itemLinks.add(link);
    if (!field(item, "guid")) check.error(`feed item missing <guid> (${title || link})`);
    if (!pub) check.error(`feed item missing <pubDate> (${title || link})`);
    else if (!RFC822.test(pub)) check.error(`feed item pubDate not RFC-822: "${pub}"`);
  }

  // Every published article should have a feed item.
  for (const a of ctx.articles) {
    const url = `${SITE_ORIGIN}/articles/${a.slug}`;
    if (!itemLinks.has(url)) check.error(`article missing from feed: ${a.slug}`);
  }

  check.info(`${items.length} feed items; ${ctx.articles.length} articles all present`);
  return check.result();
}
