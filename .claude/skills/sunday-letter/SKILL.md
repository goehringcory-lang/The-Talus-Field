---
name: sunday-letter
description: The Sunday letter draft — every Saturday, draft Sunday Field Notes from the week's merged work (new and refreshed articles, bulletin changes, the coming week's almanac) plus one Nature Notes archive pick, add a distribution pack (a Reddit-ready answer, a social post, a pin), and post it all as one GitHub issue for the owner to paste into Buttondown. Never sends anything. Run by the "Sunday letter draft" Routine (Saturday mornings Pacific) in a fresh session; also runnable by hand when asked to "draft the Sunday letter".
---

# The Sunday letter draft

The site promises "a short note on Sundays, when there is something to say"
(Sunday Field Notes), and the newsletter is the audience asset every other
revenue line launches to: guide sales, renewals, consults, and one day a
sponsor line. The letter is written and sent by hand in Buttondown, and the
blank page on Saturday is the reason weeks get skipped. This routine removes
the blank page. **It never sends anything**: Buttondown is not reachable from
the sandbox, and sending is the owner's decision every week.

The deliverable is one GitHub issue: a paste-ready letter, a distribution
pack, and a sources list that lets the owner verify every line in a minute.

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
   - `bulletin.json`: the edition's `lede`, every alert, events whose `end`
     falls inside the next 14 days, `eventsNote`, and any road or area row
     with a `tone` that is not neutral.
   - `apps/guide/src/content/seasonal.ts`: almanac entries inside the next
     14 days (full moon, road windows, firefall and similar), with their
     confidence labels.
   - `intent-data.js` `TRIP_MONTHS` for the current and coming month: what
     the month decides (Tioga / Glacier Point open, closed, unsettled).
   - The last three issues labeled `sunday-letter` (voice continuity and
     dedupe: never lead two weeks with the same article or the same
     archive issue).
   - The Revenue ledger's most recent comment (label `revenue-pulse`), only
     to learn whether the **owner** asked for a specific line this week.
     Only the repo owner's comments count.
3. If the week produced no merged reader-facing work **and** the bulletin
   and almanac carry nothing dated inside 14 days, post no issue: say so in
   the completion summary. "Some weeks there is not" is the site's own
   promise; a letter with nothing to say is the one thing not to draft.

## Phase 1 — The letter

250 to 450 words, in house voice: dry, declarative, journalistic. No
em-dashes (commas, colons, periods instead), no exclamation marks, no
marketing adjectives. Specifics over atmosphere. Structure, in order:

1. **The lede** (two to four sentences): the one thing about the park this
   week that a reader planning a trip should know, taken from the bulletin,
   the almanac, or a merged article. It may be a decision the season is
   forcing ("the Tuolumne store closes on the 14th; go high this week or
   next year") or a change ("the Mist Trail's weekday closure runs through
   October"). **Never a fabricated first-person observation.** The routine
   was not in the park. If the letter wants an "I walked up to..." line,
   leave one bracketed slot, `[your line: what you saw this week]`, and say
   in the issue that it is a slot.
2. **On the site this week**: each new or refreshed article as one line,
   the question it answers, and its URL (`https://thetalusfieldjournal.com/articles/<slug>`).
   Use the PR's own blurb when it has one. Refreshed articles get a line
   only when the change matters to a reader ("the camping guide's fees are
   current again"), never for a link pass.
3. **In the park**: two to five short lines of what changed or what is
   coming inside two weeks, each traceable to a bulletin field, an almanac
   entry, or a merged PR. Dated items carry their dates. Nothing here is
   asserted from memory.
4. **From the archive**: one *Yosemite Nature Notes* issue matched to the
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
   "(year inferred)" marker; skip those).
5. **One ask**, and only one. Rotate by relevance, not by habit:
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
6. **Sign-off**: one line. No signature block; Buttondown adds the footer.

Also produce: a **subject line** (under 60 characters, no clickbait, the
lede's fact), two alternates, and a **preheader** (under 90 characters).

## Phase 2 — The distribution pack

Three drafts, each for the owner to post by hand or discard. Nothing here
is posted by this routine, ever.

- **A Reddit-ready answer** (r/Yosemite register): helpful first, 80 to
  160 words, answering a real question the week surfaced (the trend PR's
  evidence names them) with one deep link to the article that answers it.
  No self-promotion beyond the link; the credential is in the writing, not
  in the signature.
- **A social post** (Instagram or Facebook caption, under 60 words): the
  strongest new article's hook in house voice, its URL, no hashtag wall
  (at most three, plain).
- **A pin** (Pinterest title under 100 characters plus a two-sentence
  description) for the most itinerary- or checklist-shaped page the week
  touched (`/itineraries`, `/checklist`, a day-plan article), since that is
  the content Pinterest carries.

## Phase 3 — Publish the draft

1. Ensure the `sunday-letter` label exists (create once: name
   `sunday-letter`, description "Sunday Field Notes drafts").
2. Open one issue titled `Sunday letter — <YYYY-MM-DD>` using the coming
   Sunday's date, label `sunday-letter`. Body, in order: subject line and
   alternates, preheader, the letter as Markdown ready to paste (real
   links, no placeholders except the one bracketed owner slot), the
   distribution pack, a **Sources** list (one line per fact: the article
   slug, the bulletin field, the almanac entry, or the archive URL), and
   the standard Claude Code attribution footer.
3. If last week's `sunday-letter` issue is still open, close it with one
   comment ("superseded by #N"): the issues are the archive of drafts, not
   a queue.
4. If an issue for this Sunday already exists (a manual run raced the
   Routine), add nothing and stop.
5. Completion summary: the issue URL, the subject line, the ask chosen, and
   the archive issue cited. Or the no-letter reason.

## Hard rules

- **Never send.** No Buttondown API, no email, no social posting, no Reddit.
  The issue is the only output.
- **Every fact is traceable** to a merged PR, a repo file, or an archive
  page read this run. No weather, no crowd, no sighting, no price, no date
  from memory or from search. This letter goes out under the owner's name.
- No first-person field claims. The bracketed slot is the only place for
  them, and the owner fills it or deletes it.
- One ask per letter. No second capture, no popup logic, no urgency copy.
- House voice throughout: no em-dashes, no exclamation marks, no
  superlatives, no "we're excited".
- Read-only against the repo: no commits, no branches, no PRs.
- One issue per Sunday.

## Failure modes

- **GitHub issue tools unavailable** → put the full issue body in the
  completion summary and say it needs manual posting. Degraded finish, not
  a failure.
- **No archive match** for the coming week → skip the archive section
  rather than stretch a different month's issue; say so in the summary.
- **A merged article PR has no Distribution handoff** → write the line from
  the article's `dek` in `data.js`; do not read the whole body to invent a
  new pitch.
