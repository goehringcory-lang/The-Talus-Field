# Homepage Accessibility Audit — The Talus Field

An AI-run accessibility audit of `/` (the homepage), August 28, 2026. Findings only; no
fixes are applied by this audit. Each finding names the file and line to change.

## Method

- **Automated:** axe-core 4.x (WCAG 2.0/2.1 A + AA, WCAG 2.2 AA, and axe best-practice
  rules) run in headless Chromium against the locally served site, in three states:
  the booted SPA at desktop width (1280px), the booted SPA at phone width (390px, where
  the bottom nav and hamburger are live), and the **pre-boot static shell** (app.js
  blocked, so the page is exactly what paints before React and what a markup-only
  parser sees).
- **Manual:** a keyboard walkthrough of the masthead (24 tab stops recorded, plus the
  skip link, the mega dropdowns, and the hamburger menu on the phone viewport), a
  landmark/heading/alt inventory of the rendered DOM, and contrast math on the palette
  tokens axe could not compute (the paper-grain `background-image` on `body` defeats
  its background-color detection; every one of its 64 "incomplete" contrast checks
  traces to that gradient, and all are resolved by hand below).
- **Code review:** `index.html` (the baked shell), `page-home.jsx`, the `Header` /
  `BottomNav` / `Footer` / `NewsletterInline` / `LodgingCta` components in
  `components.jsx`, and the relevant `styles.css` rules.

## Verdict

The homepage is in good shape, clearly by design rather than accident: a working skip
link, a global `:focus-visible` ring that showed on every tab stop tested, lifted
contrast tokens that clear AA with room to spare, a real reduced-motion kill switch,
correct `aria-expanded` state on both the mega dropdowns and the hamburger, labeled
landmarks, one `h1`, and descriptive alt text on both images. Nothing found blocks a
reader from using the page.

Four things are worth fixing (two of them one-line CSS), and three more are worth a
decision. In severity order:

| # | Finding | WCAG | Severity |
|---|---|---|---|
| 1 | Footer disclosure link is indistinguishable from its sentence | 1.4.1 (A) | Serious |
| 2 | Footer legal links fail the 24px touch-target minimum on phones | 2.5.8 (2.2 AA) | Serious |
| 3 | Pre-boot shell has no `main` landmark and a dangling skip-link target | 1.3.1, 2.4.1 | Moderate |
| 4 | Brand mark alt duplicates the adjacent brand text | best practice | Minor |
| 5 | Mega dropdown costs up to 14 tab stops per group; trigger semantics are unusual | 2.1.1 advisory | Moderate (usability) |
| 6 | Unlabeled `aside` nested inside the labeled rail `aside` | 1.3.1 advisory | Minor |
| 7 | Two of the three rail offers have no real heading | 1.3.1 advisory | Minor |

---

## Findings

### 1. The footer disclosure link is distinguishable only by a 1.6:1 color shift

`link-in-text-block`, WCAG 1.4.1 Use of Color. The "Full disclosure here." link inside
`.site-footer__disclosure` renders with no underline, distinguished from its sentence
only by `--ink-2` against `--ink-3`, a 1.60:1 ratio where 3:1 is the floor for
color-only distinction.

The interesting part is that the underline **is declared and never applies**:
`styles.css:1073` sets `.site-footer__disclosure a { text-decoration: underline }`, but
`styles.css:1237` sets `.site-footer a { text-decoration: none }`. Both selectors are
specificity 0-1-1, the second comes later in the file, so the reset wins and the
disclosure rule is dead code. Flagged identically in all three test states.

**Fix:** make the disclosure rule win — either move it below line 1237, or raise its
specificity (`.site-footer .site-footer__disclosure a`). No markup change needed.

### 2. The footer legal links are 12px tall and nearly touching on phones

`target-size`, WCAG 2.5.8 (new in 2.2 AA). At 390px width the legal bar's links
(Privacy, Terms, Affiliate; `styles.css:1263`) measure ~57×12px with as little as
4.4px of safe clickable space between neighbors, against a 24px minimum dimension or
spacing requirement. Advertise / Conditions widget / Group codes sit in the same row
and share the problem; axe reported the three worst. Desktop passes (pointer, not
touch, and more spacing).

**Fix:** give `.site-footer__legal a` `display: inline-block` and enough vertical
padding to reach 24px of hit area (e.g. `padding: 8px 0`), or a `line-height` and
`margin` combination that opens 24px of spacing. Visual size can stay 12px; 2.5.8 is
satisfied by either dimension or clear space.

### 3. The pre-boot shell has no landmarks and a skip link that points at nothing

The static home shell (`index.html`, the `GENERATED:HOME-SHELL` block) ships the skip
link with `href="#main"`, but `<main id="main">` exists only after React mounts
(`app.jsx:1235`). Pre-boot, the skip link goes nowhere, and the edition rule + hero
live in bare `div`/`section` with no `main` landmark. This is the exact window the
shell exists to serve — the measured 4.7s-to-first-paint phone case — so a keyboard or
screen-reader user on a slow connection meets it for real seconds, and a markup-only
parser (Bing's page auditor class of tool) sees the landmark-free version. axe flags
`landmark-one-main`, `region`, and `skip-link` on this state; all three clear once
React mounts.

**Fix:** have `scripts/gen-home-shell.mjs` wrap the shell's edition rule + hero in
`<main id="main" tabindex="-1">` inside `#home-shell`. React removes the whole shell at
boot (`app.jsx` removes any leftover `#home-shell`), so the duplicate-id window is the
same one frame the swap already occupies, and a wrapper adds no layout so the zero-CLS
guarantee holds. Regenerate with `npm --prefix scripts run home-shell` and verify the
`DATE_SLOTS` guard still passes. If the duplicate-id frame is judged not worth it, the
smaller fix is `role="main"` on the shell's hero container alone; the skip link then
still needs a pre-boot target.

### 4. The brand mark's alt duplicates the brand text beside it

`image-redundant-alt` (best practice). `components.jsx:601` (and the baked copy in
`index.html`): `alt="The Talus Field"` sits in the same link as the visible
`.brand` text "The Talus Field", so a screen reader announces the name twice on every
page's first link.

**Fix:** `alt=""` on the mark; the link's text already names it. Regenerate the home
shell after (`run home-shell`), since the masthead bakes in.

### 5. The mega dropdowns cost up to 14 tab stops each, on unusual semantics

The recorded desktop tab order: Tab 3 lands on "Plan a Trip", Tabs 4–16 walk all 13
links of its panel (opened by `:focus-within`), and "Conditions" arrives at Tab 17.
Clearing the whole masthead takes ~30 stops, which `styles.css`'s own skip-link comment
acknowledges. The mitigations work as designed: the skip link is the first stop and
lands focus on `#main`, Escape dismisses an open panel (the `is-dismissed` class
outranks `:focus-within`, so its links leave the tab order and the next Tab reaches the
next group), and `aria-expanded` tracks focus correctly. Not a WCAG failure.

Two residuals worth recording. A keyboard user has to know Escape to get the shortcut;
nothing on screen says so. And the trigger is an `<a href>` carrying `aria-expanded`
that Enter *navigates* rather than toggles (focus alone expands): a screen-reader user
who hears "collapsed" and presses Enter to expand it leaves the page instead. The
conventional shape is a separate disclosure `button` beside the link (or
menu/disclosure keyboarding with arrow keys) so expand and navigate are distinct
actions. Low priority; the current behavior is common on editorial mastheads and every
panel destination is also reachable from the footer and `/explore`.

### 6. The lodging unit is an unlabeled `aside` inside the labeled rail `aside`

`LodgingCta` renders `<aside class="lodging-cta">` (`components.jsx:1253`), and the
homepage mounts it inside `<aside class="home-rail" aria-label="From The Talus Field">`
(`page-home.jsx:370`). Nested complementary landmarks, the inner one unnamed, read as
noise in a screen reader's landmark list. **Fix:** on the homepage the rail is already
the landmark, so the inner unit can be a `section` with a heading (see 7) or a plain
`div`; where `LodgingCta` stands alone in article bodies, `aside` is right but wants an
`aria-label` ("Lodging availability"). One component serves both, so an optional
labelling prop is the cheap path.

### 7. Two of the three rail offers are invisible to heading navigation

The rail's newsletter unit has a real `<h3>` ("The Sunday Letter"), but the Field Guide
unit's title is a styled `span` (`page-home.jsx:381`) and the lodging unit's is a
styled `div` (`components.jsx:1265`). A screen-reader user skimming by headings finds
one offer of three. Page heading order is otherwise clean: one `h1`, `h2` for Start
here / Latest Entries, `h3` in the rail, `h4` in the footer columns, no skips.
**Fix:** promote `.rail-guide__title` (or its eyebrow) and `.lodging-cta__head` to
`h3` and restyle; heading tags carry no forced look in this stylesheet.

---

## Verified passes (so nobody re-litigates them)

- **Contrast, all four palettes.** axe returned "incomplete" on 64 nodes because the
  paper-grain `background-image` hides the background color; computed by hand, sierra
  (the shipped default) runs ink 16.2:1, ink-2 12.3:1, ink-3 7.7:1, moss 12.1:1
  against paper, and paper-on-ink (buttons, skip link) 16.2:1. Golden hour and granite
  worst cases are 8.1:1 and 7.8:1. Everything clears AA, nearly everything AAA; the
  token comments in `styles.css:6-66` show the lifts were deliberate. The photo credit
  is paper on a 70% ink scrim, also comfortably passing.
- **Keyboard.** All 24 recorded tab stops were visible, in DOM order, with the global
  2px `--moss` outline showing on each. The skip link appears on focus and moves focus
  to `#main`. No traps found.
- **Hamburger menu.** `aria-expanded` toggles, Escape closes, focus stays on the
  toggle, outside-click closes, and the search input inside carries an `aria-label`
  and a restored focus ring.
- **Bottom nav.** 98×48px targets, `aria-current="page"` on the active tab, labeled
  "Quick navigation".
- **Motion.** Global `prefers-reduced-motion` block zeroes animations and transitions
  (`styles.css:4220`); the rockfall easter egg additionally checks the media query in
  JS before running and marks its layer `aria-hidden`.
- **Images.** Both homepage images have real alt text ("El Capitan and Bridalveil at
  sunset" on the hero); decorative SVGs (carets, search icon, menu bars) are
  `aria-hidden` with `focusable="false"`.
- **Structure.** `lang="en"`, unique title, labeled `nav` landmarks ("Main", "Quick
  navigation", "What is on this site", "Breadcrumb" elsewhere), `aria-current` on
  active nav links, and SPA navigation that moves focus to `#main` and rewrites
  `document.title` per route (`app.jsx`), which is the accepted announcement pattern
  for client-side routing.
- **Forms.** The rail newsletter input has `aria-label="Email address"`,
  `type="email"`, and `required`; the hidden Buttondown sink iframe carries a `title`.

## How the homepage reads to machines (the AI-crawler half)

Audited because "AI accessibility" cuts both ways. The page is unusually legible to
non-JS agents, and nothing here needs work: the static shell delivers the real `h1`,
dek, masthead nav, and hero `picture` on the first byte with no JavaScript; the
`noscript` block carries the full 66-article catalog as plain links; `WebSite` /
`NewsMediaOrganization` / `Person` JSON-LD (with a `SearchAction`) ships in the head;
and `llms.txt` states citation and attribution rules for answer engines directly.
The one structural gap a markup-only parser does see is finding 3 (no `main` landmark
in the shell), which the same fix covers.

## Re-test

Re-run after fixes: serve the root (`python3 -m http.server 8765`), load `/` in
headless Chromium at 1280px and 390px, inject axe-core 4.x, run with tags `wcag2a`,
`wcag2aa`, `wcag21aa`, `wcag22aa`, `best-practice`, and repeat once with
`/dist/app.js` blocked for the shell state. Expected end state: zero violations in all
three states except the two advisory notes (5, and 6/7 if declined). Findings 1, 3,
and 4 touch generated or CSS-versioned files, so the usual discipline applies: shared
`?v=` bump, `run home-shell`, `run assets:stamp`, `run check`.
