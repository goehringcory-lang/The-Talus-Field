---
name: sunday-letter
description: The Sunday letter — every Saturday, draft Sunday Field Notes: open with a two-to-three-paragraph naturalist observation of what is happening in the park right now (third person, every line sourced to the almanac, the Nature Notes archive, or a named primary source read this run), carry photographs (one lead photo under the observation and one for each new article, from the site's own credited photos or a license-safe Wikimedia Commons file), then the week's merged work (new and refreshed articles, bulletin changes, the coming week's almanac) plus one Nature Notes archive pick, schedule it in Buttondown for Sunday 9am Pacific through scripts/buttondown-letter.mjs (the owner has Saturday to read, edit, or unschedule it in the dashboard), add a distribution pack (a Reddit-ready answer, a social post, a pin), and post the letter, the Buttondown link, and the pack as one GitHub issue. Never sends immediately and never posts anywhere else. Run by the "Sunday letter draft" Routine (Saturday mornings Pacific) in a fresh session; also runnable by hand when asked to "draft the Sunday letter".
---

# The Sunday letter draft

The site promises "a short note on Sundays, when there is something to say"
(Sunday Field Notes), and the newsletter is the audience asset every other
revenue line launches to: guide sales, renewals, consults, and one day a
sponsor line. Through August 2026 the letter was written and sent by hand
in Buttondown, and the blank page on Saturday was the reason weeks got
skipped. This routine removed the blank page; since September 2026 it also
removes the paste. It **schedules** the letter in Buttondown for **Sunday
9am Pacific** through `scripts/buttondown-letter.mjs`, so the owner's
Saturday job is to read it in the Buttondown dashboard and edit or
unschedule it. Silence sends. The routine **never sends immediately**,
never touches a sent email, and never posts anywhere but Buttondown and
the issue.

Since mid-September 2026 the letter is also a naturalist's letter, not only
a changelog. It **opens with an observation**: two or three paragraphs on
one thing happening in the natural world of the park this week, in the
register of the owner's Friday Naturalist Notes but in the third person,
because the routine was not in the park. And it **carries photographs**:
one under the observation and one beside each new article, each with its
credit. Both changes have the same constraint as everything else here:
nothing is asserted that was not read this run, and the sources for the
observation are a short, named list, not the open web.

The deliverables are the scheduled email in Buttondown and one GitHub
issue: the letter as scheduled, the dashboard link, a distribution pack,
and a sources list that lets the owner verify every line, and every
photo, in a minute.

## Territory

- The **Sunday sweep** used to pick the archive issue; this routine owns the
  archive pick now, and the sweep reports only mentions and backlinks.
- The **article routines** (Monday trend, Thursday cornerstone, monthly
  edition, intel executor) put a "Distribution handoff" section in each
  article PR body: a letter blurb and a Reddit-ready answer. Read them;
  do not rewrite an article's pitch from scratch when its author already
  wrote one.
- The **revenue pulse** owns promos and asks. This routine carries at most
  one ask per letter and never invents a promotion, a code, or a price.
- The **photo pipelines** (`scripts/fetch-guide-photos.mjs`,
  `scripts/ingest-photos.mjs`) own what gets committed to `img/` and the
  guide. This routine commits nothing: it links photos the site already
  serves, or hotlinks a Commons file for one email. A photo the site should
  keep is a note in the issue, not a file in the repo.

## Phase 0 — Gather the week (main context, cheap)

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`, the **Brand & voice** section especially.
2. The window is the seven days ending today. Collect, in this order:
   - **Merged PRs** in the window (GitHub tools; `merged_at` inside the
     window). Sort them by what a reader would care about: new articles
     (`claude/trend-article-*`, `claude/cornerstone-*`,
     `claude/intel-article-*`, `claude/monthly-edition-*`), refreshed
     articles (`claude/evergreen-refresh-*`, `claude/intel-update-*`),
     bulletin changes (`claude/bulletin-*`, `claude/intel-bulletin-*`),
     guide changes (`[guide]` titles, `claude/guide-depth-*`). Site plumbing
     PRs are not letter material.
   - Each article PR's **Distribution handoff** section, when present.
   - `bulletin.json`: the edition's `lede`, the `headlines`, every `changes`
     row dated inside the next 14 days (and the season-long ones, which have
     a `when` instead of a date), any `programs` row whose `until` or single
     `dates` entry falls in that window, and any road or area row with a
     `tone` that is not neutral.
   - `apps/guide/src/content/seasonal.ts`: almanac entries inside the next
     14 days (full moon, road windows, firefall and similar), with their
     confidence labels.
   - `intent-data.js` `TRIP_MONTHS` for the current and coming month: what
     the month decides (Tioga / Glacier Point open, closed, unsettled).
   - The last three issues labeled `sunday-letter` (voice continuity and
     dedupe: never lead two weeks with the same article, the same archive
     issue, the same observation topic, or the same photograph).
   - The Revenue ledger's most recent comment (label `revenue-pulse`), only
     to learn whether the **owner** asked for a specific line this week.
     Only the repo owner's comments count.
3. **For the observation**, gather in this order and stop when two sources
   agree on one phenomenon worth the opening:
   - The almanac (`seasonal.ts`) for the fortnight: what it says is in
     season, with its `confidence`. A `typical` entry is a pattern, and the
     letter says "typically" when it leans on one.
   - The Nature Notes archive for these calendar weeks: grep
     `nature-notes/*.md` for the month name plus a phenomenon (color,
     bloom, migration, first snow, first frost, rut, spawn, freeze, melt,
     fledge, fall). Two or three issues from different decades that record
     the same thing for these weeks are the best evidence this site has
     that a phenomenon is seasonal rather than a one-year event, and they
     give the observation its historical line.
   - The site's own natural-history essays (`data.js`, the sections that
     carry no `topic` intent tag) for the mechanism: why the thing happens,
     in words the site has already published and fact-checked.
   - **The primary-source list**, for what is true *this week*. These are
     the only web sources the observation may cite, each read this run
     with the date the page or gauge shows:
     - NPS current conditions: `https://www.nps.gov/yose/planyourvisit/conditions.htm`
       (roads, trails, closures, and the seasonal notes NPS writes there).
     - NPS nature pages under `https://www.nps.gov/yose/learn/nature/`
       (species and phenology pages; the index is `index.htm`).
     - NPS waterfalls page `https://www.nps.gov/yose/planyourvisit/waterfalls.htm`
       for what is flowing, dry, or frozen.
     - The USGS Merced River at Pohono Bridge gauge
       (`https://waterdata.usgs.gov/monitoring-location/USGS-11266500/`):
       discharge in cubic feet per second, with its reading time.
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
       what the cameras show today (snow on Half Dome, a dry Yosemite
       Falls), stated as what the camera shows at the time read.
     Nothing else: no search engine, no news site, no social post, no
     iNaturalist, no memory. A phenomenon none of these can support is not
     this week's observation.
4. **For the photographs**, inventory what the site already serves before
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
   - Only when nothing served fits the observation's subject, search
     Wikimedia Commons (rules under "Photographs" below).
5. If the week produced no merged reader-facing work **and** the bulletin
   and almanac carry nothing dated inside 14 days, post no issue: say so in
   the completion summary. "Some weeks there is not" is the site's own
   promise; a letter with nothing to say is the one thing not to draft.
   The observation does not change this test: the letter is still the
   week's news with a naturalist's opening, not a nature column with the
   news as an afterthought.

## Phase 1 — The letter

400 to 650 words including captions, in house voice: dry, declarative,
journalistic. No em-dashes (commas, colons, periods instead), no
exclamation marks, no marketing adjectives. Specifics over atmosphere.
Structure, in order:

1. **The observation** (the opening; no heading; two or three paragraphs,
   120 to 220 words): one thing happening in the natural world of the park
   right now. The shape is the owner's Friday Naturalist Notes: the
   phenomenon, where a reader would see it this week, the mechanism behind
   it, and how this year sits against the record when the archive or the
   gauges support a comparison ("the 1934 issue records the first color in
   the black oaks on the 20th; the valley webcam shows it started early this
   year"). The rules:
   - **Third person, present tense, no "I".** The routine was not in the
     park. Write the park's state, not a walk: "The bigleaf maples along
     the Merced are turning", never "I walked the Merced this morning".
     No invented anecdote, no named animal, no story, no quoted visitor.
   - **Every sentence traceable** to an almanac entry, an archive issue, a
     published essay, or one of the primary sources in Phase 0, read this
     run, and listed in the issue's Sources. A gauge reading carries its
     date and unit; a forecast is called a forecast; a `typical` almanac
     entry is "typically"; a webcam is "the Sentinel Dome camera showed"
     with the time read. Never a sighting: the letter may say the rut is
     under way because NPS and three archive issues say September, not
     because a buck was seen.
   - **One phenomenon**, not a tour of the season. Pick the one a reader
     could go and see or hear inside the next two weeks, and do not repeat
     the topic of the last three letters.
   - It is warm and specific, in the way the voice skill describes the
     Friday Notes: real numbers, real places, the Dana Fork and not "the
     high country". Warmth is in the precision, not in adjectives.
2. **The lead photograph**, immediately under the observation, showing the
   thing the observation is about (the species, the place, the phenomenon),
   with its credit line. Rules under "Photographs".
3. **On the site this week**: each new or refreshed article as one line,
   the question it answers, and its URL (`https://thetalusfieldjournal.com/articles/<slug>`).
   Use the PR's own blurb when it has one. **Each new article's line is
   preceded by its hero image** (the `image` in `data.js`, with its
   `credit`). Refreshed articles get a line only when the change matters to
   a reader ("the camping guide's fees are current again"), never for a
   link pass, and never a photo.
4. **In the park**: the first line is the trip-planning lede that used to
   open the letter: the one thing about the park this week that a reader
   planning a trip should know, taken from the bulletin, the almanac, or a
   merged article, a decision the season is forcing ("the Tuolumne store
   closes on the 14th; go high this week or next year") or a change ("the
   Mist Trail's weekday closure runs through October"). Then two to five
   short lines of what changed or what is coming inside two weeks, each
   traceable to a bulletin field, an almanac entry, or a merged PR. Dated
   items carry their dates. Nothing here is asserted from memory. No photo.
5. **From the archive**: one *Yosemite Nature Notes* issue matched to the
   coming week (what was blooming, migrating, melting, freezing, arriving
   in that month in some year between 1922 and the 1960s), one quoted line
   of at most 25 words with the year, and the real URL. The transcriptions
   are in the repo: grep `nature-notes/*.md` for the month name and the
   phenomenon, read two or three candidates, and confirm the page exists on
   disk at `archive/<year>/vol-<v>-no-<n>/index.html` before citing
   `https://thetalusfieldjournal.com/archive/<year>/vol-<v>-no-<n>/`. The
   volume, number, and year come from that page's own masthead, the same
   rule `scripts/check-archive-citations.mjs` enforces for the guide. Never
   present an inferred date as a fact (the 54 undated issues render a
   "(year inferred)" marker; skip those). An issue that fed the observation
   may be the archive pick too; a second one is better when it exists.
6. **One ask**, and only one. Rotate by relevance, not by habit:
   - the **Field Guide** (`https://thetalusfieldjournal.com/guide`) when a
     merged article or the coming fortnight makes it concrete ("the guide
     carries every stop on Tioga Road with its parking and its time
     budget"), stated as a fact about the product, at the real price only
     if you read it from `workers/wrangler.toml`;
   - otherwise the **forward ask**: one dry line ("Forwarded this? The
     letter is free at thetalusfieldjournal.com/newsletter. Know someone
     planning a trip? Forward it.").
   Never both. Never a countdown, a discount, a code, or a promise the
   product does not keep (`page-guide.jsx` is the honest copy; do not
   outrun it).
7. **Sign-off**: one line. No signature block; Buttondown adds the footer.

**No first-person field claims and no placeholders anywhere.** Since the
letter is scheduled rather than pasted, nobody fills a slot before it goes
out: no "I walked up to..." line and no bracketed placeholder of any kind
(`buttondown-letter.mjs` refuses a body that carries one). If the owner
wants a field line, they add it in the Buttondown editor on Saturday.

Also produce: a **subject line** (under 60 characters, no clickbait: the
observation's fact or the lede's), two alternates, and a **preheader**
(under 90 characters).

### Photographs

Buttondown renders Markdown, so a photo is one image line followed by one
italic credit line, and nothing else:

```
![Black oak leaves turning yellow below Yosemite Falls in October](https://thetalusfieldjournal.com/img/responsive/black-oaks-autumn-1200.jpg)
*Black oaks below the falls. Photo: Jane Doe / Wikimedia Commons (CC BY 2.0)*
```

- **How many.** One lead photo under the observation, and one per new
  article (its own hero). Nothing else gets a photo: not a refresh, not
  the park section, not the archive pick, not the ask. Most weeks that is
  two or three images; never more than five.
- **The photo shows what the text beside it says.** A lookalike from
  another park, a different season, or a different place with the same
  name is worse than no photo. If the lead photo cannot show the
  observation's subject, show the place the observation names; if it
  cannot do that either, run the observation without a photo and say so
  in the summary.
- **Where from, in order.** (1) The site's own photos, by the inventory in
  Phase 0, URL exactly as given there. (2) Wikimedia Commons, for the
  observation only, when nothing served fits. Query the API the way
  `scripts/fetch-guide-photos.mjs` does (`commons.wikimedia.org/w/api.php`,
  `generator=search` over namespace 6 or a category, `prop=imageinfo`,
  `iiprop=url|size|extmetadata`, `iiurlwidth=1280`); a burst answers 429
  with `Retry-After`, so wait and retry rather than drop. Accept a file
  only when all of these hold: `LicenseShortName` is Public domain, CC0,
  CC BY, or CC BY-SA (any version); the description or categories name
  the Yosemite subject; the original is at least 1200 pixels wide; and
  the thumbnail loads. **Link the thumbnail, never the original**: the
  `thumburl` the API returns for 1280, which has the shape
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
- **Never the same photo two weeks running**, and never a Commons file the
  last three letters used (the Sources lists say which).
- Nothing is committed. A Commons photo good enough that the site should
  keep it is a one-line note in the issue ("worth acquiring for
  `<slug>`: `<file page>`"), for the owner or the photo pipeline.

## Phase 2 — The distribution pack

Three drafts, each for the owner to post by hand or discard. Nothing here
is posted by this routine, ever.

- **A Reddit-ready answer** (r/Yosemite register): helpful first, 80 to
  160 words, answering a real question the week surfaced (the trend PR's
  evidence names them) with one deep link to the article that answers it.
  No self-promotion beyond the link; the credential is in the writing, not
  in the signature.
- **A social post** (Instagram or Facebook caption, under 60 words): the
  observation's fact or the strongest new article's hook in house voice,
  its URL, no hashtag wall (at most three, plain). Name the lead photo and
  its credit as the image to post with it; the credit travels with the
  photo.
- **A pin** (Pinterest title under 100 characters plus a two-sentence
  description) for the most itinerary- or checklist-shaped page the week
  touched (`/itineraries`, `/checklist`, a day-plan article), since that is
  the content Pinterest carries.

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
   credit line under it. Fix the letter, not the script. Then run it for
   real, without `--dry-run`. The key is `BUTTONDOWN_API_KEY` in the
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
   renders the photos too), the distribution pack, a **Sources** list, and
   the standard Claude Code attribution footer. The Sources list is one
   line per fact and one line per photo: for a fact, the article slug, the
   bulletin field, the almanac entry, the archive URL, or the primary
   source URL with the date or reading time it showed; for a photo, the
   image URL, where its credit came from (`data.js` slug, credits JSON key,
   or the Commons file page URL), and the license.
2. If last week's `sunday-letter` issue is still open, close it with one
   comment ("superseded by #N"): the issues are the archive of drafts, not
   a queue.
3. Completion summary: the Buttondown link and send time (or why not), the
   issue URL, the subject line, the observation's topic and its sources,
   the photos used (count and origin), the ask chosen, and the archive
   issue cited. Or the no-letter reason.

## Hard rules

- **Schedule, never send.** The only Buttondown calls are the ones
  `buttondown-letter.mjs` makes: create with status `scheduled` for Sunday
  9am Pacific, `--list`, and in a manual run `--unschedule`. Never
  `about_to_send`, never a `--publish` earlier than the coming Sunday
  morning, never a PATCH or DELETE on anything the routine did not create
  this run. No other email, no social posting, no Reddit.
- **Every fact is traceable** to a merged PR, a repo file, an archive page,
  or one of the named primary sources in Phase 0, read this run and listed
  in the issue. No weather, no crowd, no sighting, no price, no date from
  memory or from search. A gauge, a forecast, and a webcam are quoted with
  the time they showed. This letter goes out under the owner's name.
- **The observation is third person and sourced.** No "I", no anecdote, no
  story, no sighting. The park's state, not a walk in it.
- **Every photo has a credit and serves from an allowed host.** The site's
  own photos first; Commons only for the observation, only under a
  license the site already accepts, only as the 1280 thumbnail, only when
  the file page names the subject. Nothing committed to the repo.
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
  Buttondown by hand." Degraded finish, not a failure, and the pre-2026-09
  workflow. A 401 means the key was rotated: say so.
- **Buttondown already holds a letter for this Sunday** → the owner wrote
  one. Schedule nothing, post the issue with the draft under a line that
  says so, and name the existing email's dashboard link.
- **No archive match** for the coming week → skip the archive section
  rather than stretch a different month's issue; say so in the summary.
- **A merged article PR has no Distribution handoff** → write the line from
  the article's `dek` in `data.js`; do not read the whole body to invent a
  new pitch.
- **The primary sources are unreachable** (an origin 403 or 5xx, or a
  CONNECT 403 from the agent proxy, which is a network-policy regression
  to report as such) → write the observation from the almanac and the
  archive alone, in "typically" language, and say in the summary which
  source was down. Never fill the gap from memory.
- **No phenomenon can be sourced** for the fortnight → open with the
  trip-planning lede as the letter did before September 2026, drop the
  observation for that week, and say so in the summary.
- **No photo fits, or Commons is throttled past a retry** → run the
  observation without a photo, keep the article heroes (they are always on
  the site), and say so. A wrong photo is the failure; a missing one is a
  plain letter.
- **An image URL fails the script's check** → drop that photo and re-run
  the dry run. Never swap in a URL that was not read this run.
