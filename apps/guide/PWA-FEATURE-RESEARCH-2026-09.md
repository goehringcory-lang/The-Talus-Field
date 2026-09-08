# Field Guide PWA: feature research and the September 2026 map pass

Research date: 5 September 2026. Scope: the paid Field Guide PWA at
`guide.thetalusfieldjournal.com`. Three questions were asked: what do the
leading national-park travel apps carry that this guide does not, what does
nps.gov/yose publish that a buyer would want in their pocket, and which
well-known places were missing from the map. The map and location-data
upgrade that came out of it shipped in the same branch; this file records the
evidence, what shipped, and the backlog, so the next pass does not redo the
research.

## 1. The market

| App | Price | What it sells on |
|---|---|---|
| NPS official app (Yosemite section) | Free | Whole-park offline download, self-guided tours, amenities (restrooms, food, transit), alerts and events. Reviewers praise the offline reliability and complain about stale hours. |
| GuideAlong (formerly GyPSy) Yosemite | $19.99 one-time | GPS-triggered driving narration at 200+ points, works from any of five entrances, ~100 MB offline, never expires. Complaints: battery drain, silence between segments. |
| Shaka Guide Yosemite | $16.99 one-time | 25 narrated stops, turn-by-turn, a "know before you go" block (start before 9 a.m., budget, hours). 4.9 stars across ~95k reviews for the catalog. |
| Just Ahead | $14.99 to $19.99 per park, $29.99 a year | GPS audio plus "bonus stories" that unlock only when you stop; gas and restroom info. Not updated since 2021. |
| Chimani | Free core, $35.99 a year | Apple Editors' Choice (July 2026): personalised itineraries, GPS audio, live alerts, trip collaboration, CarPlay, offline "park assistant" for trail, sunrise and restroom questions. |
| AllTrails | Free, Plus ~$36, Peak $80 a year | Community trail reviews and offline maps; Peak adds hourly trail-condition forecasts (snow depth, precipitation, air quality, mosquitoes) drawn on the map. Users ask for condition reports they do not have to dig out of reviews. |
| Gaia GPS | ~$39.99 a year | 200+ map layers and the strongest route planning. Complaints: offline maps that "downloaded but aren't there", subscription creep. |
| onX Backcountry | $29.99 a year | Land-ownership layer, 3D, weather layers. |
| Recreation.gov | Free | Availability alerts for cancellations. Reviewers explicitly wish for lottery and booking reminders. |
| Photographer's Guide to Yosemite (Michael Frye) | $6.99 one-time | 40 photo locations filtered by month and time of day, sunrise and sunset per spot, offline. Sold since 2010 on that one premise. |
| Transit app | Free | Next departures for the Valleywide and East Valley shuttle lines, 18 stops. |

Nothing at the guide's price point pairs verified turnouts, offline topo,
GPS tracks with elevation, a drag-and-drop day plan, live conditions, and
editorial prose. The gaps below are the three things the market values most
that the guide does not yet carry, weighed against what a small editorial
team can maintain.

## 2. The three features the guide is missing

**A. A location-aware companion mode: "you are near X", with read-aloud.**
Every top-selling Yosemite-specific paid product (GuideAlong, Shaka, Just
Ahead, Chimani's tours) is built on one mechanic: GPS triggers content on
arrival so the passenger stops looking at the screen. It is the strongest
demand signal in the scan, and the consistent complaint (battery drain,
unnerving silence) is the design brief. The guide already has verified coords,
a `watchPosition` hook (`compass/useGeoWatch.ts`), a haversine "Near you" list
on the map, and a stop teaser field. The small-scope version: a foreground-only
"Near me" screen that surfaces the nearest stop's teaser and "why stop here"
line as the fix moves, with an optional Web Speech API read-aloud of one
paragraph per stop (no recorded audio to produce), a persistent "GPS active,
nearest stop 2.1 mi" status line, and copy that says it runs only while the
app is open. A PWA cannot do CarPlay or background audio; position it as the
passenger's companion, not a driving tour.

**B. A deadline and reservation tracker with reminders.** Recreation.gov's own
reviewers ask for lottery and booking reminders, and no product offers a
single Yosemite deadline list. The facts are all published (section 3, item
6 and 7) and the editorial routines already track them. The small-scope
version: a bundled "dates that matter" table (Half Dome preseason lottery in
March, the two-days-ahead daily lottery, the 24-week wilderness window and
the 7-days-ahead release at 7 a.m., campground release on the 15th at 7 a.m.
five months out, Tioga and Glacier Point typical openings) rendered against
the trip board's dates, with the existing push path (`tfg.push.enabled`)
offering one reminder per deadline. `content/seasonal.ts` is the natural
home: the almanac already carries typed windows with a `confidence` flag.

**C. Transit and parking as live facts.** The NPS API's `parkinglots`
endpoint publishes twelve Yosemite lots with capacity, ADA counts and a
`liveStatus` field, and its `places` endpoint carries every Valley shuttle
stop. AllTrails, Chimani and the NPS app all lead with "where can I park and
how do I get around", and every 2026 gateway site warns that Valley lots fill
by 7:30 to 8 a.m. This pass shipped the static half (numbered shuttle stops,
parking capacity notes, the lots themselves). The live half is a Worker route
proxying `parkinglots` with the same staleness rules as `/api/waits`, and a
"lot full" cell in the ParkNowPanel that hides itself when the feed is silent.
The guide should also tell readers to text `ynptraffic` to 333111 before
losing signal, since no app can read that feed.

Two things the market sells that the guide already has, for the record:
per-stop light planning (the `photoTiming` advice plus the daylight
instrument on hikes and the trip board) and offline maps with tracks and
elevation. The next competitor pass should measure those against the
Photographer's Guide and Gaia rather than rebuild them.

## 3. What nps.gov/yose publishes that a buyer wants in the app

Ranked by usefulness. Items 1 to 4 shipped in this pass as map pins with
notes and hours; the rest are backlog with the facts recorded so they can go
into `essentials.ts` or the seasonal almanac without re-research. Every fact
below came from the cited page on 5 September 2026.

1. **The Valley shuttle, stop by stop.** 18 stops (there is no stop 13), two
   routes (Valleywide on every stop, East Valley on 1, 2, 12, 14 to 19), 7
   a.m. to 10 p.m. daily, free. Headways differ between NPS's own pages
   (publictransportation.htm says 12 to 22 and 8 to 12 minutes; the per-stop
   place pages say 22 to 32 and 18 to 22), so the app prints none. Coordinates
   from the NPS API `places` records. Shipped: `kind: 'shuttle'` pins numbered
   as NPS paints them.
2. **Entrance stations.** Five gates with API coordinates; fees $35 per
   vehicle, $30 motorcycle, $20 per person, card only, no cash at any gate;
   no timed-entry reservation in 2026 (reservations.htm, updated 18 Feb 2026);
   Hetch Hetchy sunrise to sunset, vehicles over 25 ft long or 8 ft wide not
   permitted; Tioga Pass at 9,945 ft. Drive times to the Valley: Arch Rock 11
   mi / 20 min, Big Oak Flat 25 mi / 45 min, South 35 mi / 1 h. Shipped as
   `kind: 'entrance'` pins.
3. **Visitor and wilderness centers with hours.** Valley Welcome Center 9 to 5
   year-round; Wawona (Hill's Studio) and Big Oak Flat 8 to 5 late May to
   early October; Tuolumne 9 to 5 late May to late September; wilderness
   centers 8 to 5 (API `visitorcenters`, wildcond.htm). Shipped as
   `kind: 'visitor-center'` pins with `hours`.
4. **Gas, EV, showers, laundry, stores, clinic.** Gas at Wawona, Crane Flat
   and El Portal only, 24 hours by card, none in the Valley and none in
   Tuolumne Meadows any more; Level 2 EV at Curry Village (20 plugs), Wawona
   (24), Yosemite Falls lot (10), Valley Lodge (8), Ahwahnee (6), Welcome
   Center (4), El Portal (2); Curry Village showers 24 hours for a fee, open
   to non-guests; Housekeeping Camp laundry open to all, roughly mid-April to
   early October; picnic areas (13 signed; all tables and vault toilets; no
   grills at Lower Yosemite Fall, Yosemite Creek and Lembert Dome; water only
   at Lower Yosemite Fall and Church Bowl). Shipped as `kind: 'services'` and
   `kind: 'picnic'` pins.
5. **Campground reservation windows.** On the 15th at 7 a.m. Pacific, five
   months ahead: Upper, Lower and North Pines, Wawona, Hodgdon. Two weeks
   ahead: Bridalveil Creek, Crane Flat, Tamarack, White Wolf, Yosemite Creek,
   Porcupine Flat, half of Tuolumne. Camp 4 one week ahead. 2026 fees $36 at
   most, $24 at Tamarack, Yosemite Creek and Porcupine, $28 White Wolf, Camp 4
   $10 per person (camping.htm, campgrounds.htm). Backlog: a `reservations`
   line on the campground amenities, and the almanac.
6. **Half Dome permits.** Preseason lottery 1 to 31 March, results mid-April;
   daily lottery two days ahead, midnight to 4 p.m. Pacific; $10 per
   application plus $10 per person; about 225 day hikers and 75 backpackers a
   day; cables up from the Friday before Memorial Day to the day after the
   second Monday in October (hdpermits.htm). Backlog: feature B.
7. **Wilderness permits.** 60% by lottery 24 weeks ahead in a weekly window,
   40% released seven days ahead at 7 a.m.; $10 per application plus $5 per
   person; pickup the day before 8 to 5 or same day 8 to 11; bear canister
   rental $5 a week with a $95 deposit (wpres.htm, bearcanrentals.htm).
   Backlog: feature B and the backpacking essential.
8. **Bear rules with the fine.** Up to $5,000; an empty ice chest counts as
   food; no food in pop-ups or soft-sided campers; canisters required
   wilderness-wide; Curry Village locker sizes 35.5 by 20.5 by 23 in and
   47.5 by 20.5 by 23 in (bears.htm, curry-village.htm). Backlog: the bears
   essential should quote the fine and the locker dimensions.
9. **Accessibility placard privileges.** Mariposa Grove Road opens only to
   vehicles displaying a disability placard during shuttle hours; 0.1 mi
   accessible trail to the Grizzly Giant (mg.htm). Backlog: the accessible
   essential.
10. **Mariposa Grove and Tuolumne shuttles.** Grove shuttle 2026: 3 May to 23
    Sep 8 to 7, 24 Sep to 31 Oct 8 to 5, November 8 to 3:30, none December to
    mid-April; Welcome Plaza about 300 spaces, fills late morning; Washburn
    Trail 2 mi / 500 ft when the shuttle is off. Tuolumne shuttle to 13 Sep
    2026, about every 30 min, ten stops from the Lodge to Olmsted Point
    (mg.htm, tmbus.htm). Shipped: the grove arrival-area stop; backlog: the
    Tuolumne stops (no API coordinates published; the page lists names only).
11. **Cell coverage by carrier.** AT&T and T-Mobile LTE mainly in the eastern
    Valley; Verizon in the Valley, Foresta, Crane Flat and Wawona; Tuolumne
    none or unreliable; free wifi at Degnan's, El Portal Market and the
    libraries; paid at the four lodges (internet.htm, April 2024). Backlog:
    a "where the signal is" essential, the single most-asked practical
    question in the reviews of every competitor.
12. **Live parking-lot status.** API `parkinglots`: twelve lots with capacity
    (Yosemite Village 348, Welcome Center 140, Yosemite Falls 300, Curry
    Orchard 487, trailhead lot 190, Bridalveil 84, Glacier Point 195, Washburn
    Point 43, Mariposa Grove Plaza 304, Hetch Hetchy 80, Wawona Store 44,
    History Center 44), ADA counts and `liveStatus`. Backlog: feature C.

The NPS API (`developer.nps.gov/api/v1`, `parkCode=yose`) is the only
machine-readable source for shuttle stops, entrances, gas, EV and picnic
areas; the HTML pages do not carry coordinates. The raw dumps used for this
pass are not committed; re-pull them with `DEMO_KEY` when the layer is next
refreshed.

## 4. Places that were missing from the map

Checked against nps.gov Places to Go, the API `places` set (240 records),
TripAdvisor and AllTrails rankings, and Wikipedia's landmark list. Shipped in
this pass, all as map-only amenity pins in `content/amenities.ts`:

- Five entrance stations; seven visitor and wilderness centers plus the Happy
  Isles Art and Nature Center.
- Eighteen Valley shuttle stops and the Mariposa Grove arrival stop.
- Eleven picnic areas.
- Gas at Crane Flat, Wawona and El Portal; Curry Village showers and EV;
  Housekeeping Camp laundry; the Village and Tuolumne stores; the medical
  clinic; the Valley Lodge chargers; Badger Pass.
- Lodging the guide had no stop for: Yosemite Valley Lodge, Housekeeping
  Camp, Tuolumne Meadows Lodge.
- Landmarks, a new kind for the thing a reader points at: Half Dome, El
  Capitan, Cathedral Rocks, Three Brothers, Sentinel Rock, Royal Arches,
  Washington Column, Nevada Fall, Grizzly Giant, the California Tunnel Tree,
  the Fallen Monarch, Yosemite Chapel, the Ansel Adams Gallery, the
  Conservation Heritage Center.
- Every dining venue with a coordinate, grouped one pin per place, from the
  directory the map previously ignored.

Backlog, lower demand or no published coordinate: Wawona Point, Ahwahnee and
Stoneman meadows, Tioga and Ellery lakes (outside the park), Church Bowl as a
viewpoint, Geology Hut, the Tuolumne shuttle stops, Sentinel Beach picnic
area (null coordinate in the API), Lembert Dome picnic area.

### Coordinate discrepancies to check, not to change blind

The audit compared existing pins with the NPS API records. None was changed
in this pass, because the stops file's July 2026 verification recorded a
source for every line and an API point can mark the feature rather than the
turnout. Each should be settled by a ground check or a second source:

| Entry | Guide pin | NPS API point | Offset |
|---|---|---|---|
| `valley-view` stop | -119.6616, 37.7203 | -119.662124, 37.717152 | ~350 m north of the pullout |
| `mariposa-grove` stop and Welcome Plaza lot | -119.632, 37.5085 | -119.630025, 37.506756 | ~250 m |
| `yosemite-village-day-use-lot` | -119.5818, 37.7458 | -119.584840, 37.744368 | ~300 m |
| `lukens-lake` hike | -119.6119, 37.8552 | -119.615210, 37.850521 | ~600 m |
| `pothole-dome` hike | -119.3878, 37.8763 | -119.394554, 37.876928 | ~600 m |
| `north-dome` / `north-dome-indian-rock` | -119.5477, 37.8106 | -119.545261, 37.806575 | ~500 m |
| `tuolumne-grove` hike | -119.8058, 37.7614 | -119.806081, 37.768792 | ~800 m; the API point may be the grove, not the lot |
| `tuolumne-meadows-grill` | -119.3590, 37.8741 | -119.357001, 37.874313 | ~180 m |

## 5. What shipped in the map pass

- **The infrastructure layer** (`content/amenities.ts`, `AmenityKindEnum`):
  six new kinds, `entrance`, `visitor-center`, `shuttle`, `picnic`,
  `services`, `landmark`, plus `lodging`, with optional `hours` and a `glyph`
  (the shuttle stop number). 70 new entries, every coordinate quoted verbatim
  from the NPS API with its record named on the line.
- **Pin glyphs** (`map/kinds.ts`): every kind now draws its own mark inside
  the teardrop, an eye, a signpost, a tent, a gate, the information "i", a
  bus, a picnic table, a fuel pump, and a numbered disc for shuttle stops. The
  chip row and the legend show the same mark, so the legend is the pin. Drawn
  and checked at 26 px.
- **Zoom-band declutter**: parking, shuttle, picnic and services pins hide
  below z12 on the "All" view (a data attribute on the map container, CSS
  does the hiding, no marker rebuild), with a one-line hint over the map; a
  pressed kind chip shows them at any zoom, so a chip's count never promises
  a pin the tap does not deliver.
- **Region quick-jump row** under the chips: Valley, Glacier Point, Tuolumne,
  Hetch Hetchy, whole park, frames computed from the core stops' own coords.
- **Meal pins** from the dining directory, one per place, listing every venue
  there with price, hours and closure, linking to `/dining`.
- **Popups** print published hours and season as readings; landmark popups
  carry no Directions button, because there is nowhere to drive to.
- **The Help card's named-place index** now includes the entrances, visitor
  centers, shuttle stops and landmarks automatically, so "0.2 mi west of
  shuttle stop 8" is a sentence the guide can now say to a dispatcher.

## 6. Polish and professionalism: adopted and backlog

Adopted from the competitor scan: a mark on every pin rather than a colour
alone (the map reads without the legend); an honest hint when pins are hidden
by zoom instead of silence; published hours printed as readings with their
source noted in the file; a "what is that" answer for the walls a visitor
looks at; the legend built from the same table as the pins so the two cannot
disagree.

Backlog, in the order they would pay back:

1. A persistent status line in the companion mode (feature A): "GPS active,
   nearest stop 2.1 mi", the single fix for the top complaint about every
   audio tour.
2. First-launch download checklist with pack sizes and a completion state on
   `/welcome`, which GuideAlong and NPS both front-load; the guide has the
   packs and the meter, but the ask comes after onboarding rather than in it.
3. A source-and-time stamp on every live cell (roads, waits, forecast): the
   ParkNowPanel hides stale cells, which is right, but a visible "NWS, 14
   min ago" is how the small product looks like the careful one.
4. The Tuolumne shuttle stops and the campground reservation lines (section
   3, items 5 and 10).
5. The eight coordinate checks in section 4.
