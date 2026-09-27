---
name: sunday-letter
description: The Sunday letter — every Saturday, draft Sunday Field Notes as a naturalist's letter about the park right now, not a changelog of the site. It leads with a seasonal observation (third person, with the science behind it: the mechanism, the species, the numbers, and how this year sits against the gauges), sets it beside what the park's own naturalists recorded for these same weeks in the Yosemite Nature Notes archive (1922 onward), adds two or three short "also in season" notes, and weaves three to five contextual links to the site's articles into those sentences for readers and search, never as a list of site updates. Every line is sourced to the almanac, the archive, a published essay, or a named primary science source read this run. Carries a lead photograph and at most two more, credited. Schedules it in Buttondown for Sunday 9am Pacific through scripts/buttondown-letter.mjs (the owner has Saturday to read, edit, or unschedule it), adds a distribution pack, and posts the letter, the Buttondown link, and the pack as one GitHub issue. Never sends immediately and never posts anywhere else. Run by the "Sunday letter draft" Routine (Saturday mornings Pacific) in a fresh session; also runnable by hand when asked to "draft the Sunday letter".
---

# The Sunday letter draft

The site promises "a short note on Sundays, when there is something to say"
(Sunday Field Notes). The newsletter is the audience asset every other
revenue line launches to, and a reader stays subscribed to a letter they
look forward to, not to a changelog. This routine **schedules** the letter
in Buttondown for **Sunday 9am Pacific** through
`scripts/buttondown-letter.mjs`, so the owner's Saturday job is to read it
in the Buttondown dashboard and edit or unschedule it. Silence sends. The
routine **never sends immediately**, never touches a sent email, and never
posts anywhere but Buttondown and the issue.

## What the letter is (since late September 2026)

**A naturalist's letter about what is happening in the park right now.**
Until late September 2026 the letter was the week's merged work with a
naturalist paragraph on top: "On the site this week", a photo per new
article, the bulletin's changes. The owner asked for the opposite balance,
and this runbook is that change:

- **The season leads, and it carries the science.** What is turning,
  blooming, migrating, spawning, freezing, falling or drying up this week,
  where a reader would see it, and *why*: the mechanism (the pigment, the
  hormone, the temperature threshold, the snowmelt curve), the species by
  common and scientific name, and the numbers that make it specific.
- **The park's own naturalists are the second voice.** The *Yosemite
  Nature Notes* archive (1922 onward, 512 issues, transcribed in
  `nature-notes/`) recorded these same weeks for four decades. The letter
  quotes them, dates them, links them, and says how this year compares
  when the gauges allow a comparison. This is the part of the letter no
  other Yosemite newsletter can write.
- **The site is linked, not announced.** Three to five contextual links to
  the site's articles, woven into sentences that already make the point
  ("the [black bears are in hyperphagia](https://thetalusfieldjournal.com/articles/<slug>)
  by now, eating..."), are how the letter sends readers back and gives the
  articles inbound links. There is **no "On the site this week" section**,
  no list of new or refreshed articles, and no mention of site plumbing,
  bulletin edits, guide updates, or anything the site *did*. A new article
  earns a link only when its subject belongs in the season's story.
- **Trip logistics are a footnote, not a section.** At most two short lines
  at the end when the season forces a decision that affects seeing what the
  letter describes (a road closing, a trail closed for work). The Park
  Bulletin (`/now`) is where the rest lives, and one of those lines may
  point there.

The constraint on all of it is unchanged: **nothing is asserted that was
not read this run**, the observation is written in the third person
because the routine was not in the park, and the sources are a short,
named list, not the open web.

The deliverables are the scheduled email in Buttondown and one GitHub
issue: the letter as scheduled, the dashboard link, a distribution pack,
and a sources list that lets the owner verify every line, and every photo,
in a minute.

## Territory

- The **Sunday sweep** used to pick the archive issue; this routine owns
  archive quotations in the letter, and the sweep reports only mentions and
  backlinks.
- The **article routines** (Monday trend, Thursday cornerstone, monthly
  edition, intel executor) put a "Distribution handoff" section in each
  article PR body. The letter uses those only as a source of **link
  phrasing** when the article belongs in the season's story; it does not
  run the article's pitch as a line of its own.
- The **revenue pulse** owns promos and asks. This routine carries at most
  one ask per letter and never invents a promotion, a code, or a price.
- The **photo pipelines** (`scripts/fetch-guide-photos.mjs`,
  `scripts/ingest-photos.mjs`) own what gets committed to `img/` and the
  guide. This routine commits nothing: it links photos the site already
  serves, or hotlinks a Commons file for one email. A photo the site should
  keep is a note in the issue, not a file in the repo.

## Phase 0 — Gather the season (main context, cheap)

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`, the **Brand & voice** section especially.
2. **Continuity first.** Read the last four issues labeled `sunday-letter`.
   Never lead with the same phenomenon, quote the same archive issue, use
   the same photograph, or link the same article in the same role as any of
   them. Note their subjects so the season moves forward week to week.
3. **The season, from the repo.** The fortnight is today through 14 days
   out.
   - `apps/guide/src/content/seasonal.ts`: every almanac entry inside the
     fortnight, with its `confidence`. A `typical` entry is a pattern, and
     the letter says "typically" when it leans on one.
   - `intent-data.js` `TRIP_MONTHS` for this and next month: which roads
     the month decides, since that decides where a reader can go to see
     anything.
   - The site's natural-history and seasonal articles: `data.js` entries
     with `cat: "wildlife"` or `cat: "seasonal"`, plus any trail article
     whose subject is where the phenomenon happens. Read the bodies
     (`bodies/<slug>.jsx`) of the two or three that touch the candidate
     phenomenon: they are the mechanism in words the site has already
     published and fact-checked, and they are the first link candidates.
4. **The archive for these calendar weeks.** Grep `nature-notes/*.md` for
   the month name (and the next month's, near a month's end) together with
   phenomena: color, leaves, oak, maple, dogwood, aspen, bloom, flower,
   seed, cone, acorn, migration, flock, warbler, junco, nutcracker, rut,
   buck, bear, hibernat, salmon, trout, spawn, frost, freeze, ice, snow,
   melt, flood, fall (waterfall), dry, fledge, nest, hatch, mushroom,
   fungus, frog, snake, ladybird (ladybug). Read the four to six most
   promising hits in full. The best material is **two or three issues from
   different decades recording the same thing for these weeks**: it is the
   site's own evidence that a phenomenon is seasonal rather than a one-year
   event, and it gives the letter its historical line. Keep for each: the
   quotable sentence (at most 25 words), the volume, number and year from
   the issue page's own masthead, and the naturalist's name when the issue
   prints one.
5. **This week's evidence, from the primary-source list.** These are the
   only web sources the letter may cite. Read each one that bears on the
   candidate phenomena this run, and keep the date or reading time it
   shows:
   - NPS current conditions: `https://www.nps.gov/yose/planyourvisit/conditions.htm`
     (roads, trails, closures, and the seasonal notes NPS writes there).
   - NPS nature pages under `https://www.nps.gov/yose/learn/nature/`
     (species, habitats, phenology; the index is `index.htm`).
   - NPS waterfalls page `https://www.nps.gov/yose/planyourvisit/waterfalls.htm`
     for what is flowing, dry, or frozen.
   - The USGS Merced River at Pohono Bridge gauge
     (`https://waterdata.usgs.gov/monitoring-location/USGS-11266500/`):
     discharge in cubic feet per second, with its reading time, and the
     page's own statistics (median for the day) when it shows them.
   - CDEC snow and temperature sensors for the high country
     (`https://cdec.water.ca.gov/dynamicapp/QueryF?s=TUM` Tuolumne Meadows,
     `?s=DAN` Dana Meadows, `?s=GIN` Gin Flat): snow depth, snow water
     content, air temperature, with the reading time.
   - The NWS Yosemite Valley point forecast
     (`https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936`)
     for the coming days' highs, lows, and first-freeze or first-snow
     language, quoted as a forecast.
   - The NPS webcams page
     (`https://www.nps.gov/yose/learn/photosmultimedia/webcams.htm`) for
     what the cameras show today, stated as what the camera showed at the
     time read.
6. **The science, from reference sources.** For the mechanism, the
   scientific name, and the numbers behind a phenomenon (not for what is
   happening this week, which only step 5 can say), the letter may also
   cite these reference sources, read this run:
   - The Jepson eFlora (`https://ucjeps.berkeley.edu/eflora/`) for
     California plants: scientific names, bloom months, elevation ranges.
   - The USDA Forest Service Fire Effects Information System
     (`https://www.fs.usda.gov/database/feis/`) for plant and animal life
     histories: phenology, seed and cone cycles, fire ecology.
   - The Audubon Guide to North American Birds
     (`https://www.audubon.org/field-guide/`) for bird life history,
     migration, and diet. (The Cornell Lab's All About Birds answers 403 to
     non-browser clients, so it is not on the list.)
   - The California Department of Fish and Wildlife
     (`https://wildlife.ca.gov/`) for fish, amphibian, and mammal life
     history in California.
   - The USA National Phenology Network (`https://www.usanpn.org/`) for
     what drives a phenological event (temperature, day length).
   - Any other `nps.gov` or `usgs.gov` page on the subject.
   Nothing else: no search engine results, no news site, no social post,
   no iNaturalist, no Wikipedia, no memory. A scientific claim none of
   these supports does not go in the letter, however well known it seems.
7. **Choose the season's story.** Pick **one lead phenomenon** that a
   reader could go and see or hear inside the next two weeks, supported by
   at least two of: an almanac entry, an archive issue, a published essay,
   a primary source from step 5. Then pick **two or three short seasonal
   notes** on other things happening in the same fortnight, each with at
   least one source from steps 3 to 5 and a science line from step 3, 5,
   or 6. Prefer a spread: a plant, an animal, water or weather.
8. **Link candidates.** From `data.js`, list the articles whose subjects
   the chosen phenomena touch: the wildlife and seasonal pieces first, then
   trail articles for where to see it, then planning pieces only when a
   note genuinely needs one. Also list the reader-facing articles merged in
   the last seven days (GitHub tools; `merged_at` inside the window;
   `claude/trend-article-*`, `claude/cornerstone-*`,
   `claude/intel-article-*`, `claude/monthly-edition-*`) and read each PR's
   Distribution handoff: a new article whose subject belongs in the story
   takes a link ahead of an older one, and an article that does not belong
   is left out, however new. Confirm each slug exists in `data.js`.
9. **For the photographs**, inventory what the site already serves before
   looking anywhere else:
   - Article heroes: each article's `image` and `credit` in `data.js`. The
     public URL of a hero at email width is
     `https://thetalusfieldjournal.com/img/responsive/<name>-1200.jpg`,
     where `img/responsive/<name>-1200.jpg` exists on disk (the name is the
     source file's basename slugified; `ls img/responsive | grep <word>`
     finds it). Serve the responsive JPEG, never the master under `img/`.
   - Guide photos: `scripts/data/photo-credits.json` maps
     `/photos/<file>` to author, license, and source; the public URL is
     `https://guide.thetalusfieldjournal.com/photos/<file>`. Several guide
     entries are honest stand-ins (Carlon Falls, Evergreen Lodge, Little
     Nellie Falls, Hidden Lake): the file shows something else, so do not
     use those for the place they are named after.
   - Editorial Commons picks: `scripts/data/editorial-photo-credits.json`,
     same shape, for files under `img/`.
   - Only when nothing served shows the subject, search Wikimedia Commons
     (rules under "Photographs" below). A naturalist letter often needs a
     species the site has no photo of; Commons is the right place for it.
10. The Revenue ledger's most recent comment (label `revenue-pulse`), only
    to learn whether the **owner** asked for a specific line this week.
    Only the repo owner's comments count.
11. **The letter-or-not test.** If no lead phenomenon can be supported by
    two sources (step 7), post no issue and schedule nothing: say so in the
    completion summary. "Some weeks there is not" is the site's own
    promise. Merged site work alone is never a reason to send a letter; a
    week with no merged articles and a clear seasonal story is a full
    letter.

## Phase 1 — The letter

550 to 850 words including captions, in house voice: dry, declarative,
journalistic, and warm in the way the owner's Friday Naturalist Notes are
warm, through precision rather than adjectives. No em-dashes (commas,
colons, periods instead), no exclamation marks, no marketing adjectives.
Specifics over atmosphere: the Dana Fork and not "the high country", 38°F
at Tuolumne Meadows at 6am and not "cold nights". Structure, in order:

1. **The lead observation** (the opening; no heading; three to five
   paragraphs, 250 to 400 words). One phenomenon, in this shape:
   - **What and where.** What is happening this week and where a reader
     would see or hear it: the named place, the elevation band, the time
     of day.
   - **The science.** Why it happens: the mechanism, in one or two
     sentences a curious reader keeps (the chlorophyll breaking down to
     reveal carotenoids already in the leaf; the anthocyanins the maple
     makes new in cold sunny weather; the shortening day that triggers the
     buck's testosterone). Give the species its scientific name once, in
     italics, at first mention (*Quercus kelloggii*). One or two real
     numbers (an elevation, a temperature threshold, a discharge, a
     distance flown, a count) from a source in Phase 0.
   - **The record.** What the park's naturalists wrote about these same
     weeks, woven in as a short quotation with its year ("In October 1934
     the park naturalist recorded ..."), linked to the archive issue. Then
     how this year sits against it when the gauges, sensors, or cameras
     support a comparison ("the Merced at Pohono Bridge read 41 cubic feet
     per second on Saturday morning, below the median for the date").
     Never a comparison the sources cannot support.
   - **One or two contextual article links**, in sentences that already
     make the point, when an article covers the subject or the place.
   The rules:
   - **Third person, present tense, no "I".** The routine was not in the
     park. Write the park's state, not a walk: "The bigleaf maples along
     the Merced are turning", never "I walked the Merced this morning".
     No invented anecdote, no named animal, no story, no quoted visitor.
   - **Every sentence traceable** to an almanac entry, an archive issue, a
     published essay, or a Phase 0 source read this run, and listed in the
     issue's Sources. A gauge reading carries its date and unit; a forecast
     is called a forecast; a `typical` almanac entry is "typically"; a
     webcam is "the Half Dome camera showed" with the time read. Never a
     sighting: the letter may say the rut is under way because NPS and
     three archive issues say September, not because a buck was seen.
   - **"This week" needs this week's evidence.** A phenomenon supported
     only by the almanac, the archive, and the essays is written as a
     pattern ("typically begins in the third week of October", "the
     naturalists recorded it in these weeks in 1931, 1948, and 1956"), not
     as a fact about today.
2. **The lead photograph**, immediately under the observation, showing the
   subject: the species, the place, or the phenomenon. Rules under
   "Photographs".
3. **From the naturalists' notebooks** (heading; 80 to 160 words). The
   archive, given room: one or two *Yosemite Nature Notes* issues on the
   coming weeks, ideally from different decades and not the one quoted in
   the opening, each with one quotation of at most 25 words, the year, the
   naturalist's name when the issue prints one, and the real URL. Then one
   or two sentences on what the entry tells a reader now: what has held
   for ninety years, what has shifted, or what the old naturalists noticed
   that a visitor today walks past. The rules:
   - Confirm each page exists on disk at
     `archive/<year>/vol-<v>-no-<n>/index.html` before citing
     `https://thetalusfieldjournal.com/archive/<year>/vol-<v>-no-<n>/`. The
     volume, number, and year come from that page's own masthead, the same
     rule `scripts/check-archive-citations.mjs` enforces for the guide.
   - Never present an inferred date as a fact (the 54 undated issues
     render a "(year inferred)" marker; skip those).
   - A claim that "this has shifted" needs a source for today's side of
     it (Phase 0 step 5 or 6); otherwise say only what the entry recorded.
   - Quote exactly, including the old spelling and names ("ladybird
     beetles"); do not modernize a quotation. Put the modern name, if it
     matters, outside the quotation marks.
4. **Also in season** (heading; two or three short notes, 40 to 90 words
   each). Each note is one thing happening in the same fortnight, with
   where to see it and one science line (the reason, a scientific name, a
   number), sourced like the opening. Each may carry one contextual
   article link. At most two of the notes carry a photograph, and only a
   photograph of the note's own subject.
5. **Before you go** (optional; no heading needed; at most two lines). Only
   when the season forces a decision that affects seeing what the letter
   describes: a road closing, a trail or area closed, a first-snow
   forecast. Each line is traceable to NPS conditions, `bulletin.json`, the
   almanac, or `TRIP_MONTHS`, and carries its date. One line may point to
   the Park Bulletin (`https://thetalusfieldjournal.com/now`) for the rest.
   Nothing about what the site published, changed, or refreshed.
6. **One ask**, and only one:
   - the **Field Guide** (`https://thetalusfieldjournal.com/guide`) when
     it ties to the letter's subject as a fact about the product (the guide
     carries Nature Notes archive notes on its stops, and its stops put a
     reader at the places the letter names), at the real price only if you
     read it from `workers/wrangler.toml`;
   - otherwise the **forward ask**: one dry line ("Forwarded this? The
     letter is free at thetalusfieldjournal.com/newsletter. Know someone
     who would want it? Forward it.").
   Never both. Never a countdown, a discount, a code, or a promise the
   product does not keep (`page-guide.jsx` is the honest copy; do not
   outrun it).
7. **Sign-off**: one line. No signature block; Buttondown adds the footer.

### Links

- **Three to five contextual article links** across the letter, not
  counting archive links, the Park Bulletin line, or the ask. Each is
  inside a sentence that already makes the point, with **descriptive
  anchor text** naming the subject ("[why the black oaks turn late](...)"),
  never "here", "this article", "read more", or a bare URL. The same rule
  the site's own bodies follow (CLAUDE.md, internal links).
- URLs are `https://thetalusfieldjournal.com/articles/<slug>` for articles,
  exact slugs from `data.js`; standing pages (`/now`, `/conditions`,
  `/map`, `/guide`) by their route. No UTM parameters; Buttondown tracks
  clicks.
- Never a list of links, never a "new on the site" or "this week on the
  site" line, never a link for a refresh, a bulletin edit, or a guide
  update. An article is linked because the reader wants it at that point
  in the sentence, not because it is new.
- No article is linked twice in one letter.

**No first-person field claims and no placeholders anywhere.** Since the
letter is scheduled rather than pasted, nobody fills a slot before it goes
out: no "I walked up to..." line and no bracketed placeholder of any kind
(`buttondown-letter.mjs` refuses a body that carries one). If the owner
wants a field line, they add it in the Buttondown editor on Saturday.

Also produce: a **subject line** (under 60 characters, no clickbait: the
season's fact, such as "The black oaks turn last"), two alternates, and a
**preheader** (under 90 characters) that names the archive entry or the
science.

### Photographs

Buttondown renders Markdown, so a photo is one image line followed by one
italic credit line, and nothing else:

```
![Black oak leaves turning yellow below Yosemite Falls in October](https://thetalusfieldjournal.com/img/responsive/black-oaks-autumn-1200.jpg)
*Black oaks below the falls. Photo: Jane Doe / Wikimedia Commons (CC BY 2.0)*
```

- **How many.** One lead photo under the observation, and at most two
  more, each under an "Also in season" note about its subject. Nothing
  else gets a photo: not the archive section, not the logistics lines, not
  the ask, and never an article hero shown because the article is new.
  Never more than three.
- **The photo shows what the text beside it says.** A lookalike species, a
  plant from another range, a different season, or a different place with
  the same name is worse than no photo. If the lead photo cannot show the
  subject, show the place the observation names; if it cannot do that
  either, run the observation without a photo and say so in the summary.
- **Where from, in order.** (1) The site's own photos, by the inventory in
  Phase 0, URL exactly as given there. (2) Wikimedia Commons, when nothing
  served shows the subject. Query the API the way
  `scripts/fetch-guide-photos.mjs` does (`commons.wikimedia.org/w/api.php`,
  `generator=search` over namespace 6 or a category, `prop=imageinfo`,
  `iiprop=url|size|extmetadata`, `iiurlwidth=1280`); a burst answers 429
  with `Retry-After`, so wait and retry rather than drop. Accept a file
  only when all of these hold: `LicenseShortName` is Public domain, CC0,
  CC BY, or CC BY-SA (any version); the description or categories name
  the subject and place it in Yosemite or the central Sierra Nevada (a
  species photo from elsewhere in its range is acceptable only when the
  caption says where it was taken); the original is at least 1200 pixels
  wide; and the thumbnail loads. **Link the thumbnail, never the
  original**: the `thumburl` the API returns for 1280, which has the shape
  `https://upload.wikimedia.org/wikipedia/commons/thumb/<a>/<ab>/<File>/1280px-<File>`
  (anonymous thumbnails exist only at bucket widths, 1280 among them;
  originals can be 100 MB and are throttled). Commons permits hotlinking;
  the file page URL goes in the Sources list so the owner can check the
  pick.
- **Credit, always.** The site's photos carry their credit in `data.js`
  (`credit`) or the credits JSON; print it verbatim after "Photo:". A
  Commons file's credit is `Artist` and `LicenseShortName` from
  `extmetadata`, as `Photo: <Artist> / Wikimedia Commons (<License>)`,
  with HTML stripped from the artist string. No credit on record means no
  photo.
- **Alt text** is a sentence describing what is in the frame, no "image
  of" or "photo of". The script rejects an empty alt.
- **The URL must serve an image.** `buttondown-letter.mjs` fetches every
  image URL in the dry run and refuses one that does not answer 200 with
  an image content type, or one on a host other than
  `thetalusfieldjournal.com`, `guide.thetalusfieldjournal.com`, or
  `upload.wikimedia.org`. Fix the letter, not the script.
- **Never a photo the last four letters used** (their Sources lists say
  which).
- Nothing is committed. A Commons photo good enough that the site should
  keep it is a one-line note in the issue ("worth acquiring for
  `<slug>`: `<file page>`"), for the owner or the photo pipeline.

## Phase 2 — The distribution pack

Three drafts, each for the owner to post by hand or discard. Nothing here
is posted by this routine, ever. All three lead with the season, like the
letter.

- **A Reddit-ready answer** (r/Yosemite register): helpful first, 80 to
  160 words, answering a real seasonal question a visitor this fortnight
  would ask ("Is there fall color yet?", "Are the falls running?", "Will
  I see bears in October?"), with the science and the archive line where
  they help, and one deep link to the article that answers it best. No
  self-promotion beyond the link; the credential is in the writing, not in
  the signature.
- **A social post** (Instagram or Facebook caption, under 60 words): the
  observation's most striking fact or the archive quotation with its
  year, one article or archive URL, no hashtag wall (at most three,
  plain). Name the lead photo and its credit as the image to post with it;
  the credit travels with the photo.
- **A pin** (Pinterest title under 100 characters plus a two-sentence
  description) for the seasonal article the letter linked that best
  answers "when and where to see it", since that is the content Pinterest
  carries.

## Phase 3 — Schedule it in Buttondown

1. If an issue for this Sunday already exists (a manual run raced the
   Routine), add nothing, schedule nothing, and stop.
2. Write the letter to a file outside the repo (the session scratchpad):
   a header block of `subject:`, `preheader:` and a blank line, then the
   Markdown body with real links and the image lines. Run the dry run
   first:

   ```
   node scripts/buttondown-letter.mjs <file> --dry-run
   ```

   It prints the send time (the coming Sunday, 9am Pacific), fetches every
   image URL, and fails on a placeholder, an em-dash, an exclamation mark,
   an image with no alt text, an image on a host it does not allow, or an
   image URL that does not serve an image; it warns on a photo with no
   credit line under it, more than three images, or a body outside 550 to
   850 words. Fix the letter, not the script. Then run it for real,
   without `--dry-run`. The key is `BUTTONDOWN_API_KEY` in the
   environment; the script reads nothing else.
3. The script refuses if Buttondown already holds a draft or a scheduled
   email with this subject or for the same Sunday. That is the owner's
   letter, not a bug: leave it, and say so in the issue and the summary.
   Never pass `--replace` from a Routine run.
4. Ensure the `sunday-letter` label exists (create once: name
   `sunday-letter`, description "Sunday Field Notes drafts").

## Phase 4 — Post the record

1. Open one issue titled `Sunday letter — <YYYY-MM-DD>` using the coming
   Sunday's date, label `sunday-letter`. Body, in order: the Buttondown
   dashboard link and the scheduled send time as the script printed them
   (or the reason nothing was scheduled), subject line and alternates,
   preheader, the letter as scheduled (image lines included, so the issue
   renders the photos too), the distribution pack, a **Links** list (each
   article linked, with the sentence it sits in, so the owner sees the
   letter's SEO footprint at a glance), a **Sources** list, and the
   standard Claude Code attribution footer. The Sources list is one line
   per fact and one line per photo: for a fact, the article slug, the
   almanac entry, the archive URL, the bulletin field, or the primary or
   reference source URL with the date or reading time it showed; for a
   photo, the image URL, where its credit came from (`data.js` slug,
   credits JSON key, or the Commons file page URL), and the license.
2. If last week's `sunday-letter` issue is still open, close it with one
   comment ("superseded by #N"): the issues are the archive of drafts, not
   a queue.
3. Completion summary: the Buttondown link and send time (or why not), the
   issue URL, the subject line, the lead phenomenon and its sources, the
   archive issues quoted, the "also in season" topics, the articles linked,
   the photos used (count and origin), and the ask chosen. Or the
   no-letter reason.

## Hard rules

- **Schedule, never send.** The only Buttondown calls are the ones
  `buttondown-letter.mjs` makes: create with status `scheduled` for Sunday
  9am Pacific, `--list`, and in a manual run `--unschedule`. Never
  `about_to_send`, never a `--publish` earlier than the coming Sunday
  morning, never a PATCH or DELETE on anything the routine did not create
  this run. No other email, no social posting, no Reddit.
- **The season leads; the site is linked, not announced.** No "on the site
  this week" section, no list of new or refreshed articles, no bulletin or
  guide changelog. Three to five contextual article links, each earning
  its place in a sentence about the park.
- **Every fact is traceable** to a repo file, an archive page, or one of
  the named primary or reference sources in Phase 0, read this run and
  listed in the issue. No weather, no bloom, no sighting, no scientific
  claim, no date from memory or from search. A gauge, a forecast, and a
  webcam are quoted with the time they showed. This letter goes out under
  the owner's name, and the owner is a naturalist: a wrong scientific name
  or an invented mechanism is the failure that costs the most.
- **The observation is third person and sourced.** No "I", no anecdote, no
  story, no sighting. The park's state, not a walk in it.
- **Archive quotations are exact and correctly dated**, from the page's own
  masthead, never an inferred year.
- **Every photo has a credit and serves from an allowed host.** The site's
  own photos first; Commons when nothing served shows the subject, only
  under a license the site already accepts, only as the 1280 thumbnail,
  only when the file page names the subject. At most three. Nothing
  committed to the repo.
- No first-person field claims and no placeholders. The owner adds a
  field line in the Buttondown editor if they want one.
- One ask per letter. No second capture, no popup logic, no urgency copy.
- House voice throughout: no em-dashes, no exclamation marks, no
  superlatives, no "we're excited".
- Read-only against the repo: no commits, no branches, no PRs.
- One issue and one scheduled email per Sunday.
- The key stays in the environment. Never print it, never write it to a
  file, never put it in an issue.

## Failure modes

- **`BUTTONDOWN_API_KEY` is not set** (the script exits 2 and says so) or
  **Buttondown answers an error** → post the issue anyway with the full
  paste-ready letter at the top, titled as usual, and open it with one
  line: "Not scheduled: <the script's message>. Paste this into
  Buttondown by hand." Degraded finish, not a failure. A 401 means the key
  was rotated: say so.
- **Buttondown already holds a letter for this Sunday** → the owner wrote
  one. Schedule nothing, post the issue with the draft under a line that
  says so, and name the existing email's dashboard link.
- **No archive match** for these weeks → widen to the two weeks either side
  and say "in late September" rather than a date; if still nothing, drop
  "From the naturalists' notebooks" for the week, never stretch another
  season's issue to fit, and say so in the summary.
- **No article fits the season's story** → link fewer than three rather
  than force one; a link that does not belong in the sentence is worse
  than none. Say so in the summary: it is a gap the article routines
  should hear about (name the missing subject).
- **The primary sources are unreachable** (an origin 403 or 5xx, or a
  CONNECT 403 from the agent proxy, which is a network-policy regression
  to report as such) → write the season from the almanac, the archive, and
  the essays alone, in "typically" language, and say in the summary which
  source was down. Never fill the gap from memory.
- **A reference source is unreachable** → drop the scientific claim it
  would have supported, or support it from an NPS nature page or a site
  essay instead. Never from memory.
- **No lead phenomenon can be sourced** for the fortnight → no letter this
  week (Phase 0 step 11). Do not fall back to a list of site updates.
- **No photo fits, or Commons is throttled past a retry** → run the
  letter without that photo and say so. A wrong photo is the failure; a
  missing one is a plain letter.
- **An image URL fails the script's check** → drop that photo and re-run
  the dry run. Never swap in a URL that was not read this run.
