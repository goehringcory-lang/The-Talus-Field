// =============================================================================
// MANUAL PROGRAM CURATION — the seasonal file for everything the NPS Events
// API does not carry.
//
// The API covers NPS-led programs plus whichever partner events park staff
// enter. It does NOT reliably carry: Yosemite Conservancy paid adventures and
// naturalist walks (yosemite.org), Aramark / Yosemite Hospitality tours
// (travelyosemite.com), or the Glacier Point astronomy-club star parties
// (dates posted per club on NASA's Night Sky Network). Those are curated here
// by hand, a few times a season, from the published schedules. The Yosemite
// Guide PDF (nps.gov/yose/planyourvisit/guide.htm) is the reconciliation
// ground truth each new issue. As of the 2026-07 pass the file also carries
// the guide's printed NPS ranger schedule for the current issue window; the
// route dedupes those against the live NPS feed by date + title at read time
// (routes/programs.ts), so the feed wins whenever it carries the same program.
//
// Workflow: edit this file → `npm run typecheck` → `wrangler deploy`.
// Entries are validated at module load; a bad date or category fails the
// deploy loudly instead of shipping a broken feed.
//
// Each entry expands to one ProgramEvent per date in `dates`. Keep entries
// honest: only list dates confirmed on the operator's own page, and carry the
// operator's URL so readers can verify and book.
// =============================================================================

import { z } from 'zod'
import { ProgramEvent, sortEvents, type ProgramEventT } from '../lib/programs'

const ManualEntry = ProgramEvent.omit({ id: true, date: true }).extend({
  key: z.string(),                                 // stable slug, unique in this file
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
})
type ManualEntryT = z.infer<typeof ManualEntry>

// Weekday numbers use JS Date.getUTCDay(): 0=Sun … 6=Sat.
const SUN = 0
const MON = 1
const TUE = 2
const WED = 3
const THU = 4
const FRI = 5
const SAT = 6

// Yosemite Guide Vol 51 Issue 5, valid 2026-06-10 through 2026-07-14.
const GUIDE_START = '2026-06-10'
const GUIDE_END = '2026-07-14'

// Meeting-point coords, [lng, lat]. The first group is reused from stops.ts /
// existing entries (those carry their own verify TODOs); the second group is
// approximate, good enough for the trip planner's travel-buffer math, and
// should be tightened on a coord verification pass.
const AHWAHNEE: [number, number] = [-119.5747, 37.7458]          // ahwahnee-hotel stop
const CURRY_VILLAGE: [number, number] = [-119.5688, 37.7395]     // curry-village stop
const VALLEY_LODGE: [number, number] = [-119.5989, 37.7439]      // existing valley-floor-tour entry
const HAPPY_ISLES: [number, number] = [-119.5594, 37.7338]       // mist-trail stop (Happy Isles)
const EL_CAP_MEADOW: [number, number] = [-119.6310, 37.7212]     // el-capitan-meadow stop; El Capitan Bridge adjacent
const GLACIER_POINT: [number, number] = [-119.5731, 37.7283]     // glacier-point stop
const MARIPOSA_GROVE: [number, number] = [-119.6083, 37.5108]    // mariposa-grove stop (arrival area)
const WAWONA: [number, number] = [-119.6580, 37.5370]            // wawona area; market/campground within ~2 km
const CRANE_FLAT: [number, number] = [-119.7973, 37.7551]        // Crane Flat junction; Tuolumne Grove TH ~1 km north
const LEMBERT_DOME: [number, number] = [-119.3589, 37.8772]      // soda-springs-parsons-lodge stop
const DOG_LAKE_LOT: [number, number] = [-119.3379, 37.8730]      // Dog Lake parking
const TM_VISITOR_CENTER: [number, number] = [-119.3592, 37.8735] // Tuolumne Meadows Visitor Center lot
const GAYLOR_TH: [number, number] = [-119.2582, 37.9102]         // gaylor-lake stop (trailhead at Tioga Pass)
// Approximate; verify on a coord pass:
const VILLAGE_MALL: [number, number] = [-119.5855, 37.7485]      // Welcome Center / museum / theater / gallery cluster
const CAMP_4: [number, number] = [-119.6027, 37.7423]
const POTHOLE_DOME: [number, number] = [-119.3860, 37.8770]
const TM_LODGE: [number, number] = [-119.3417, 37.8757]

const NPS_GUIDE_URL = 'https://www.nps.gov/yose/planyourvisit/guide.htm'
const YH_TOURS_URL = 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/'
const YH_URL = 'https://www.travelyosemite.com/things-to-do/'
const YC_ART_URL = 'https://yosemite.org/art'
const YC_URL = 'https://yosemite.org/experience/'
const TAAG_URL = 'https://www.anseladams.com/photography-education/'

// ── Confirmed entries only ───────────────────────────────────────────────────
// Verification passes 2026-07-02 and 2026-07-03. Confirmed this pass: the
// Valley Floor Tour's daily year-round operation (travelyosemite.com), the
// Yosemite Facelift 2026 dates (Yosemite Climbing Association's own
// registration page), and the 2026 Bracebridge Dinner performances
// (travelyosemite.com Bracebridge page; the listed weekdays match the 2026
// calendar, which is the tell against the stale-year traps below).
//
// Verification pass 2026-07-06: curated the full printed program schedule from
// the Yosemite Guide Vol 51 Issue 5 (valid June 10 – July 14, 2026): NPS
// valley / Wawona / Crane Flat / Tuolumne walks and talks, Yosemite
// Hospitality tours and evening programs, Yosemite Conservancy art classes and
// night-sky programs, Ansel Adams Gallery photography education, and the
// listed special events. This pass also promoted the Glacier Point star
// parties out of PENDING_VERIFICATION (the guide publishes July 3 & 4 and
// July 11 & 12). Dates are the printed window only; nothing is extrapolated
// past July 14 except blocks the guide itself prints (the art-class week of
// July 13 and the Obata Art Weekend, July 17-19). Titles are kept exactly as
// printed so the route's date+title dedupe can drop a manual entry whenever
// the NPS feed carries the same program (the two Mariposa Grove titles drop
// the printed em-dash for house style; a feed collision there would show as a
// duplicate and can be aligned on a later pass).
const entries: ManualEntryT[] = [
  {
    key: 'aramark-valley-floor-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Valley Floor Tour (Yosemite Hospitality)',
    description:
      'The two-hour open-air tram (or heated coach, off-season) loop of the valley floor with a guide. ' +
      'Departs Yosemite Valley Lodge daily; in summer at 10 and 11 a.m., 1 and 2 p.m., and at sunset. ' +
      'Paid; book at travelyosemite.com. Dates here mark availability, not a single departure time.',
    // Verified 2026-07-02: travelyosemite.com lists the tour as departing
    // daily, year-round (tram in warm months, heated coach off-season).
    // 2026-07-03: extended the availability window a year out on the same
    // year-round basis; refresh on the next curation pass.
    // 2026-07-06: Yosemite Guide Vol 51 Issue 5 confirms daily departures at
    // 10 am, 11 am, 1 pm, 2 pm, and sunset for the guide window.
    dates: buildDailyDates('2026-07-01', '2027-06-30'),
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    url: YH_TOURS_URL,
  },
  {
    key: 'yca-facelift',
    source: 'manual',
    category: 'other',
    title: 'Yosemite Facelift (Yosemite Climbing Association)',
    description:
      'The park\'s biggest volunteer cleanup: five days of trash collection, trail restoration, and ' +
      'evening films and speakers, run by the Yosemite Climbing Association with the park. Free, ' +
      'registration at yosemiteclimbing.org. Show up, grab a bag, meet the community.',
    // Verified 2026-07-03: yosemiteclimbing.org's 2026 Facelift registration
    // page lists September 23-27, 2026, daily 8 a.m. to 4 p.m.
    dates: ['2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27'],
    timeStart: '08:00',
    timeEnd: '16:00',
    location: 'Yosemite Valley (registration in the valley; sites parkwide)',
    isFree: true,
    url: 'https://www.yosemiteclimbing.org/facelift',
  },
  {
    key: 'bracebridge-dinner',
    source: 'aramark',
    category: 'arts',
    title: 'Bracebridge Dinner (The Ahwahnee)',
    description:
      'The Ahwahnee dining room becomes a Tudor hall for a four-hour pageant of carols, Renaissance ' +
      'theater, and a seven-course dinner; a park holiday tradition since 1927. Formal attire, not ' +
      'recommended under age ten, tickets well in advance at travelyosemite.com. Confirm the full ' +
      'performance calendar there before booking travel.',
    // Verified 2026-07-03: travelyosemite.com's Bracebridge page lists 2026
    // performances on Wed Dec 9, Tue Dec 15, and Sat Dec 19; those weekdays
    // match the 2026 calendar. Re-check for added dates when the winter
    // calendar firms up; some listings suggest a broader Dec 8-18 window.
    dates: ['2026-12-09', '2026-12-15', '2026-12-19'],
    timeStart: '17:00',
    location: 'The Ahwahnee',
    coord: AHWAHNEE,
    isFree: false,
    reservationRequired: true,
    url: 'https://www.travelyosemite.com/things-to-do/specialty-events/food-and-wine-events/bracebridge-dinner',
  },

  // ── Yosemite Guide v51n5: Yosemite Valley walks & talks ────────────────────
  {
    key: 'valley-ranger-walk',
    source: 'nps',
    category: 'walk',
    title: 'Ranger Walk',
    description:
      'Join a ranger for a naturalist walk and a closer look at Yosemite. Meets in front of the ' +
      'Yosemite Valley Welcome Center (shuttle stop 2). Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '09:00',
    timeEnd: '10:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-climber-coffee',
    source: 'nps',
    category: 'other',
    title: 'Climber Coffee',
    description:
      'Coffee with NPS climbing rangers: climbing management, search and rescue, and news from the ' +
      'climbing community. Drop in at Camp 4, near the Midnight Lightning boulder. Through June 28; ' +
      'in July it moves to the Tuolumne Meadows Store.',
    dates: buildWeeklyDates(GUIDE_START, '2026-06-28', [SUN]),
    timeStart: '09:00',
    timeEnd: '10:00',
    location: 'Camp 4, near the Midnight Lightning boulder',
    coord: CAMP_4,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-jr-ranger-walk',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Walk',
    description:
      'An easy walk with kid-focused activities related to Yosemite. Meets in front of the Yosemite ' +
      'Valley Welcome Center (shuttle stop 2). Children must be accompanied by an adult.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '10:00',
    timeEnd: '11:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-discovery-walk',
    source: 'nps',
    category: 'walk',
    title: 'Ranger Walk: Discovery Walk',
    description:
      'An easy ranger-led walk on what makes Yosemite special; topics vary daily. Meets in front of ' +
      'the museum in Yosemite Village (shuttle stop 5).',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE, WED, THU]),
    timeStart: '10:30',
    timeEnd: '11:30',
    location: 'Yosemite Museum, Yosemite Village (shuttle stop 5)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'ask-a-climber',
    source: 'nps',
    category: 'other',
    title: 'Ask a Climber!',
    description:
      'Watch climbers on El Capitan through spotting scopes and talk big walls with the rangers. ' +
      'West side of El Capitan Bridge (shuttle stop 9). Drop in any time; runs through July 1.',
    dates: buildDailyDates(GUIDE_START, '2026-07-01'),
    timeStart: '12:30',
    timeEnd: '16:30',
    location: 'El Capitan Bridge, west side (shuttle stop 9)',
    coord: EL_CAP_MEADOW,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-wild-about-bears',
    source: 'nps',
    category: 'walk',
    title: 'Ranger Walk: Wild About Bears',
    description:
      'A ranger walk on Yosemite\'s black bears and how the park keeps them wild; no bear sightings ' +
      'expected. Meets in front of the Yosemite Valley Welcome Center (shuttle stop 2).',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '13:00',
    timeEnd: '14:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-family-ranger-talk',
    source: 'nps',
    category: 'kids',
    title: 'Family Ranger Talk',
    description:
      'A 15-minute ranger talk for all ages; topics vary. In front of the Yosemite Valley Welcome ' +
      'Center (shuttle stop 2).',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '14:15',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'ahwahnee-hotel-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Historic Ahwahnee Hotel Tour',
    description:
      'A complimentary one-hour history tour of Yosemite\'s famous luxury hotel. Meets on the ' +
      'hotel\'s back lawn. Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '15:00',
    location: 'The Ahwahnee, back lawn',
    coord: AHWAHNEE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'ahwahnee-nature-walk',
    source: 'aramark',
    category: 'walk',
    title: 'Guided Nature Walk',
    description:
      'An easy naturalist-guided walk of the natural areas around The Ahwahnee. Meets on the ' +
      'hotel\'s back lawn (shuttle stop 3). Free.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '15:30',
    timeEnd: '16:30',
    location: 'The Ahwahnee, back lawn (shuttle stop 3)',
    coord: AHWAHNEE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'yosemite-live',
    source: 'conservancy',
    category: 'talk',
    title: 'Yosemite Live!',
    description:
      'Short films, presentations, and performances by Yosemite Conservancy naturalists at the ' +
      'Yosemite Theater, behind the Exploration Center (shuttle stop 5). Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '16:30',
    timeEnd: '17:30',
    location: 'Yosemite Theater, behind the Exploration Center (shuttle stop 5)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: YC_URL,
  },
  {
    key: 'curry-evening-program',
    source: 'aramark',
    category: 'talk',
    title: 'Evening Programs',
    description:
      'Yosemite naturalists present a different topic each night at the Curry Village Amphitheater ' +
      '(shuttle stops 14 and 19). Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '20:00',
    timeEnd: '20:30',
    location: 'Curry Village Amphitheater (shuttle stops 14 and 19)',
    coord: CURRY_VILLAGE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'yosemite-after-dark',
    source: 'aramark',
    category: 'walk',
    title: 'Yosemite After Dark',
    description:
      'Grab a flashlight for a guided, interactive nature walk at night; recommended for ages 11 ' +
      'and up. Paid; book at travelyosemite.com or the Yosemite Valley Lodge front desk.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '20:30',
    timeEnd: '22:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'yc-night-sky',
    source: 'conservancy',
    category: 'astronomy',
    title: 'Explore Yosemite\'s Night Sky',
    description:
      'A Yosemite Conservancy naturalist leads a laser-pointer tour of the night sky: star science, ' +
      'constellations, cultural stories, and mythology. No telescopes. Paid; register in advance at ' +
      'yosemite.org.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '21:00',
    timeEnd: '22:30',
    location: 'Yosemite Valley (meeting point given at registration)',
    isFree: false,
    reservationRequired: true,
    url: YC_URL,
  },

  // ── Yosemite Guide v51n5: Wawona & the Mariposa Grove ──────────────────────
  {
    key: 'wawona-coffee-with-a-ranger',
    source: 'nps',
    category: 'ranger',
    title: 'Coffee with a Ranger',
    description:
      'Coffee, a Q&A session, and general park updates with a ranger at the Pine Tree Market in ' +
      'Wawona. Drop-ins welcome.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SUN]),
    timeStart: '09:00',
    timeEnd: '10:00',
    location: 'Pine Tree Market, Wawona',
    coord: WAWONA,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'mariposa-grove-nature-walk',
    source: 'nps',
    category: 'walk',
    title: 'Nature Walk in the Mariposa Grove',
    description:
      'A ranger-led walk among the giant sequoias. Meets at the Mariposa Grove Arrival Area; allow ' +
      'time to park and walk or ride the grove shuttle before the start.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '09:30',
    timeEnd: '11:00',
    location: 'Mariposa Grove Arrival Area',
    coord: MARIPOSA_GROVE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'mariposa-grove-jr-ranger-talk',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Talk in the Mariposa Grove',
    description:
      'A ranger talk for kids 4 and up among the big trees. Allow time to park and walk or ride the ' +
      'grove shuttle before the start.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '13:30',
    timeEnd: '14:15',
    location: 'Mariposa Grove',
    coord: MARIPOSA_GROVE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'wawona-campfire-program',
    source: 'nps',
    category: 'talk',
    // Deliberate deviation from the exact-printed-title policy: the guide
    // titles both the Wawona and Tuolumne Meadows campground programs plain
    // "Campfire Program", and the route's date+title dedupe carries no
    // location, so a feed record for either would silently drop the other.
    // The location qualifier keeps a collision visible instead of lossy.
    title: 'Campfire Program at Wawona',
    description:
      'A classic evening campfire program at the Wawona Campground amphitheater; topics vary.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '19:00',
    timeEnd: '20:00',
    location: 'Wawona Campground amphitheater',
    coord: WAWONA,
    isFree: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n5: near Crane Flat ──────────────────────────────────
  {
    key: 'tuolumne-grove-sequoia-hike',
    source: 'nps',
    category: 'walk',
    title: 'Giant Sequoia Hike',
    description:
      'A ranger-led hour among the Tuolumne Grove sequoias. Meet in the grove: it is a 1-mile walk ' +
      'down from the trailhead, 2.5 miles round trip with 500 feet of climb on the way out.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, WED, THU]),
    timeStart: '11:00',
    timeEnd: '12:00',
    location: 'Tuolumne Grove',
    coord: CRANE_FLAT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tuolumne-grove-jr-ranger-table',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Discovery Table',
    description:
      'Drop in any time to talk with a ranger and start or finish earning a Junior Ranger badge. At ' +
      'the Tuolumne Grove Trailhead.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '15:30',
    location: 'Tuolumne Grove Trailhead',
    coord: CRANE_FLAT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'crane-flat-evening-program',
    source: 'nps',
    category: 'talk',
    title: 'Evening Program',
    description:
      'An evening ranger program at the Crane Flat Campground Amphitheater; topics vary.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED, FRI, SAT], {
      // The guide lists these five dates as skipped for the issue window.
      skip: ['2026-06-10', '2026-06-12', '2026-06-20', '2026-07-01', '2026-07-10'],
    }),
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Crane Flat Campground Amphitheater',
    coord: CRANE_FLAT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'stars-over-crane-flat',
    // Category set by hand: the feed's regex mapping would not read
    // "Stars Over" as astronomy.
    source: 'nps',
    category: 'astronomy',
    title: 'Stars Over Crane Flat',
    description:
      'A ranger-led night of stargazing at Crane Flat. Free, but registration is required at the ' +
      'Big Oak Flat Information Station. No pets, RVs, or trailers.',
    dates: ['2026-06-10', '2026-06-15', '2026-06-20', '2026-06-29', '2026-07-01', '2026-07-10'],
    timeStart: '20:30',
    timeEnd: '22:00',
    location: 'Crane Flat (register at the Big Oak Flat Information Station)',
    coord: CRANE_FLAT,
    isFree: true,
    reservationRequired: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n5: stargazing at Glacier Point ──────────────────────
  {
    key: 'glacier-point-starry-skies',
    source: 'aramark',
    category: 'astronomy',
    title: 'Glacier Point Starry Skies',
    description:
      'A Yosemite naturalist hosts an hour of stargazing from Glacier Point. Transportation to ' +
      'Glacier Point is not included. Paid; register at travelyosemite.com.',
    dates: [...buildDailyDates('2026-07-05', '2026-07-09'), ...buildDailyDates('2026-07-12', '2026-07-14')],
    timeStart: '21:00',
    timeEnd: '22:00',
    location: 'Glacier Point',
    coord: GLACIER_POINT,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'glacier-point-star-party',
    source: 'astronomy',
    category: 'astronomy',
    title: 'Glacier Point Star Parties',
    description:
      'California amateur astronomy clubs set up telescopes at the Glacier Point Amphitheater and ' +
      'share the sky with the public, in cooperation with the park. Drop in any time after 8:30; ' +
      'programs typically run two to four hours and are canceled if the sky is overcast. Free.',
    // Verified 2026-07-06: Yosemite Guide Vol 51 Issue 5 (Jun 10 - Jul 14,
    // 2026) lists July 3 & 4 and July 11 & 12 at the Glacier Point
    // Amphitheater, 8:30 p.m., runs 2-4 hours, canceled if overcast.
    dates: ['2026-07-03', '2026-07-04', '2026-07-11', '2026-07-12'],
    timeStart: '20:30',
    location: 'Glacier Point Amphitheater',
    coord: GLACIER_POINT,
    isFree: true,
    url: 'https://nightsky.jpl.nasa.gov/',
  },

  // ── Yosemite Guide v51n5: bus & tram tours ─────────────────────────────────
  {
    key: 'aramark-glacier-point-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Glacier Point Tour',
    description:
      'The four-hour bus tour from Yosemite Valley up to Glacier Point, a 3,200-foot elevation ' +
      'gain. Departs Yosemite Valley Lodge daily at 8:30 a.m. and 1:30 p.m.; one-way tickets for ' +
      'hikers available (dropoff only, no pickup at Glacier Point). Paid; book at ' +
      'travelyosemite.com or 888/413-8869. Dates here mark availability, not a single departure time.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    url: YH_TOURS_URL,
  },
  {
    key: 'aramark-grand-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Yosemite Grand Tour',
    description:
      'The full-day tour combining Yosemite Valley, Glacier Point, and the Mariposa Grove of Giant ' +
      'Sequoias, lunch included. Departs Yosemite Valley Lodge daily at 8 a.m. Paid; book at ' +
      'travelyosemite.com or 888/413-8869.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '08:00',
    timeEnd: '16:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    url: YH_TOURS_URL,
  },

  // ── Yosemite Guide v51n5: photography walks (The Ansel Adams Gallery) ──────
  {
    key: 'taag-photography-walk',
    source: 'manual',
    category: 'walk',
    title: 'The Ansel Adams Gallery Photography Walk',
    description:
      'A staff photographer from The Ansel Adams Gallery leads a brief field lecture in Yosemite ' +
      'Valley. Free, but space is limited and registration is required at anseladams.com.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE, THU]),
    timeStart: '09:00',
    timeEnd: '10:30',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    reservationRequired: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-smartphone-photo-wed',
    source: 'manual',
    category: 'arts',
    title: 'In the Field: Creative Smartphone Photography',
    description:
      'A staff photographer from The Ansel Adams Gallery teaches how to make better photographs ' +
      'with the camera you always carry. Wednesday morning session. Paid; register at anseladams.com.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED]),
    timeStart: '09:00',
    timeEnd: '12:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: false,
    reservationRequired: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-smartphone-photo-sat',
    source: 'manual',
    category: 'arts',
    title: 'In the Field: Creative Smartphone Photography',
    description:
      'A staff photographer from The Ansel Adams Gallery teaches how to make better photographs ' +
      'with the camera you always carry. Saturday afternoon session. Paid; register at anseladams.com.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SAT]),
    timeStart: '13:00',
    timeEnd: '16:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: false,
    reservationRequired: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-footsteps-of-ansel-adams',
    source: 'manual',
    category: 'arts',
    title: 'In the Footsteps of Ansel Adams',
    description:
      'A four-hour field class around Yosemite Valley with a staff photographer from The Ansel ' +
      'Adams Gallery. Paid; register at anseladams.com.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, THU]),
    timeStart: '13:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: false,
    reservationRequired: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-legacy-digital-camera',
    source: 'manual',
    category: 'arts',
    title: 'Ansel Adams\'s Legacy and Your Digital Camera',
    description:
      'A field class from The Ansel Adams Gallery on making better photographs with your DSLR. ' +
      'Starts at the gallery in Yosemite Village. Paid; register at anseladams.com.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE]),
    timeStart: '13:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: false,
    reservationRequired: true,
    url: TAAG_URL,
  },

  // ── Yosemite Guide v51n5: art classes (Yosemite Conservancy) ───────────────
  // One entry per published instructor block; the printed schedule runs
  // weekday mornings at the Happy Isles Art & Nature Center.
  {
    key: 'yc-art-class-painting-printmaking',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Painting and Printmaking',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: painting and ' +
      'printmaking with Sue Fierston. Meets at the Happy Isles Art and Nature Center (shuttle stop ' +
      '16). Paid; register in advance at yosemite.org/art.',
    // The Jun 8-12 block starts before the guide window opens but is printed
    // in this issue; kept as published.
    dates: buildDailyDates('2026-06-08', '2026-06-12'),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'painting with John Gates. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). ' +
      'Paid; register in advance at yosemite.org/art.',
    dates: buildDailyDates('2026-06-15', '2026-06-19'),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-nature-drawing',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Nature Drawing',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: nature drawing ' +
      'with Adam Davis. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildDailyDates('2026-06-22', '2026-06-26'),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-acrylic',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Acrylic Painting',
    description:
      'Slow down and connect with nature through art; beginners welcome. This block: acrylic ' +
      'painting with Jeff Hemming. Meets at the Happy Isles Art and Nature Center (shuttle stop ' +
      '16). Paid; register in advance at yosemite.org/art.',
    // Two-week block; the weekday filter drops the Jul 4-5 weekend.
    dates: buildWeeklyDates('2026-06-29', '2026-07-10', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-printmaking',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Printmaking',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: printmaking ' +
      'with Daniel Villa. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    // Jul 15-17 extends past the guide window but is printed in this issue.
    dates: buildDailyDates('2026-07-13', '2026-07-17'),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-kids-open-art-studio',
    source: 'conservancy',
    category: 'kids',
    title: 'Kids\' Open Art Studio',
    description:
      'Free drop-in art activities for kids at the Happy Isles Art and Nature Center (shuttle stop ' +
      '16). Come by any time during studio hours.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '10:00',
    timeEnd: '15:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-paint-and-sip',
    source: 'conservancy',
    category: 'arts',
    title: 'Paint & Sip',
    description:
      'Learn watercolor basics and paint an iconic Yosemite landscape step by step; beginners ' +
      'welcome. At the Mountain Room Lounge, Yosemite Valley Lodge (shuttle stops 6 and 7). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Mountain Room Lounge, Yosemite Valley Lodge (shuttle stops 6 and 7)',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },

  // ── Yosemite Guide v51n5: special events ───────────────────────────────────
  {
    key: 'ychc-evening-programs',
    source: 'manual',
    category: 'talk',
    title: 'Evening Programs at the Yosemite Conservation Heritage Center',
    description:
      'Sierra Club volunteers host evening programs at the 1903 Yosemite Conservation Heritage ' +
      'Center, near Housekeeping Camp (shuttle stop 12). Free, no registration; check local ' +
      'listings for topics.',
    // All three dates were already past at curation time (2026-07-06); kept
    // for the printed record of the issue window.
    dates: ['2026-06-12', '2026-06-13', '2026-06-27'],
    timeStart: '19:30',
    timeEnd: '21:00',
    location: 'Yosemite Conservation Heritage Center (shuttle stop 12)',
    isFree: true,
    url: 'https://www.sierraclub.org/yosemite-conservation-heritage-center',
  },
  {
    key: 'zero-heroes-volunteer',
    source: 'nps',
    category: 'other',
    title: 'Drop-in Volunteer Event: Yosemite Zero Heroes',
    description:
      'A drop-in litter cleanup along roadsides, trails, parking lots, and campgrounds; litter ' +
      'sticks and buckets provided. Families with kids 5 and up are welcome. Meet in front of the ' +
      'Exploration Center in Yosemite Village; no advance signup, register when you arrive.',
    dates: ['2026-06-15', '2026-07-02'],
    timeStart: '10:00',
    timeEnd: '13:00',
    location: 'Exploration Center, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'yc-stewardship-mariposa-grove',
    source: 'conservancy',
    category: 'other',
    title: 'Stewardship Series: Mariposa Grove of Giant Sequoias',
    description:
      'Step into a forest of giants and hear the science behind Yosemite\'s most iconic trees. ' +
      'Free for Yosemite Conservancy donors; registration required at yosemite.org.',
    dates: ['2026-06-26'],
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Mariposa Grove',
    coord: MARIPOSA_GROVE,
    // isFree deliberately unset: the guide prints "Free for Yosemite
    // Conservancy donors", which is conditional; the description carries it.
    reservationRequired: true,
    url: YC_URL,
  },
  {
    key: 'obata-art-weekend',
    source: 'nps',
    category: 'arts',
    title: 'Obata Art Weekend',
    description:
      'A weekend celebrating Chiura Obata, the Japanese American artist known for his stunning ' +
      'portrayals of Yosemite\'s high country: art workshops, demonstrations, and ranger talks. ' +
      'Workshop registration and details at go.nps.gov/SPEV.',
    // Jul 17-19 falls past the guide window but is printed in this issue.
    dates: ['2026-07-17', '2026-07-18', '2026-07-19'],
    location: 'Yosemite Valley',
    isFree: true,
    url: 'https://go.nps.gov/SPEV',
  },

  // ── Yosemite Guide v51n5: Tuolumne Meadows ─────────────────────────────────
  // Most Tuolumne programs start mid-to-late June as the high country opens;
  // the start dates below are the guide's own asterisked dates.
  {
    key: 'tm-bird-walk',
    source: 'nps',
    category: 'walk',
    title: 'Bird Walk',
    description:
      'An easy morning stroll with a Tuolumne Meadows bird expert; binoculars available. Meets at ' +
      'Lembert Dome parking.',
    dates: buildWeeklyDates('2026-06-13', GUIDE_END, [WED, SAT], { skip: ['2026-06-20'] }),
    timeStart: '07:30',
    timeEnd: '10:00',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-climber-coffee',
    source: 'nps',
    category: 'other',
    title: 'Climber Coffee',
    description:
      'Coffee with NPS climbing rangers: climbing management, search and rescue, and news from the ' +
      'climbing community. Drop in at the Tuolumne Meadows Store. In June this program runs at ' +
      'Camp 4 in Yosemite Valley.',
    dates: buildWeeklyDates('2026-07-05', GUIDE_END, [SUN]),
    timeStart: '09:00',
    timeEnd: '10:00',
    location: 'Tuolumne Meadows Store',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'parsons-lodge-open',
    source: 'nps',
    category: 'other',
    title: 'Parsons Memorial Lodge at the Soda Springs',
    description:
      'Meet a ranger at the 1915 stone lodge at Soda Springs and learn the history of Yosemite\'s ' +
      'high country. Daily activities and an open reading room.',
    dates: buildDailyDates('2026-06-22', GUIDE_END),
    timeStart: '10:00',
    timeEnd: '16:00',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-wildflower-walk',
    source: 'nps',
    category: 'walk',
    title: 'Wildflower Walk',
    description:
      'A moderately strenuous high-country walk with a ranger naturalist to find what\'s blooming, ' +
      'and learn more than names. Meets at Lembert Dome parking.',
    dates: buildWeeklyDates('2026-06-16', GUIDE_END, [SUN, TUE]),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-tioga-pass-wildflowers',
    source: 'nps',
    category: 'walk',
    title: 'Tioga Pass Wildflowers',
    description:
      'See what\'s in bloom at 10,000 feet. A moderate to strenuous four-hour hike; meet at the ' +
      'Gaylor Lakes Trailhead ready to walk.',
    dates: buildWeeklyDates('2026-06-19', GUIDE_END, [FRI]),
    timeStart: '10:00',
    timeEnd: '14:00',
    location: 'Gaylor Lakes Trailhead, Tioga Pass',
    coord: GAYLOR_TH,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-domes-and-meadows',
    source: 'nps',
    category: 'walk',
    title: 'Domes and Meadows',
    description:
      'A moderate stroll through Tuolumne\'s signature landscape of granite and meadow. Meets at ' +
      'the Pothole Dome Trailhead.',
    dates: buildWeeklyDates('2026-06-15', GUIDE_END, [MON, THU]),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Pothole Dome Trailhead, Tuolumne Meadows',
    coord: POTHOLE_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-jr-ranger-program',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Program',
    description:
      'An easy Junior Ranger stroll in the high country; topics vary. Meets at Lembert Dome parking.',
    dates: buildWeeklyDates('2026-06-17', GUIDE_END, [WED, SAT]),
    timeStart: '10:00',
    timeEnd: '11:30',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-geology',
    source: 'nps',
    category: 'walk',
    title: 'Geology of Tuolumne Meadows',
    description:
      'A moderate walk on the granite story of Tuolumne Meadows. Meets at the Pothole Dome Trailhead.',
    dates: buildWeeklyDates('2026-06-17', GUIDE_END, [WED]),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Pothole Dome Trailhead, Tuolumne Meadows',
    coord: POTHOLE_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-welcome-talk-noon',
    source: 'nps',
    category: 'talk',
    title: 'Ranger Talk: Welcome to Tuolumne!',
    description:
      'A 15-minute orientation talk at the Tuolumne Meadows Visitor Center parking lot; offered ' +
      'daily at noon and 3 p.m.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '12:00',
    timeEnd: '12:15',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-river-walk',
    source: 'nps',
    category: 'walk',
    title: 'Tuolumne River Walk',
    description: 'An easy stroll along the Tuolumne River. Meets at the Dog Lake parking lot.',
    dates: buildWeeklyDates('2026-06-17', GUIDE_END, [WED]),
    timeStart: '13:00',
    timeEnd: '15:00',
    location: 'Dog Lake parking lot, Tuolumne Meadows',
    coord: DOG_LAKE_LOT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-dog-lake-hike',
    source: 'nps',
    category: 'walk',
    title: 'Dog Lake Hike',
    description:
      'A strenuous three-hour ranger-led hike to Dog Lake. Bring water, sun protection, and ' +
      'snacks. Meets at the Dog Lake parking lot.',
    dates: buildWeeklyDates('2026-06-16', GUIDE_END, [TUE]),
    timeStart: '13:00',
    timeEnd: '16:00',
    location: 'Dog Lake parking lot, Tuolumne Meadows',
    coord: DOG_LAKE_LOT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-forest-walk',
    source: 'nps',
    category: 'walk',
    title: 'Forest Walk',
    description: 'An easy walk in the lodgepole forest. Meets at the Dog Lake parking lot.',
    dates: buildWeeklyDates('2026-06-20', GUIDE_END, [SAT]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Dog Lake parking lot, Tuolumne Meadows',
    coord: DOG_LAKE_LOT,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-history',
    source: 'nps',
    category: 'walk',
    title: 'History of Tuolumne Meadows',
    description:
      'An easy walking talk on the human history of Tuolumne Meadows. Meets at the visitor center ' +
      'parking lot.',
    dates: buildWeeklyDates('2026-06-15', GUIDE_END, [MON]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-wildlife-high-sierra',
    source: 'nps',
    category: 'walk',
    title: 'Wildlife of the High Sierra',
    description:
      'An easy walk on the animals of the high Sierra. Meets at the Tuolumne Meadows Visitor Center.',
    dates: buildWeeklyDates('2026-06-18', GUIDE_END, [THU]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Tuolumne Meadows Visitor Center',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-welcome-talk-3pm',
    // Same printed title as tm-welcome-talk-noon on the same dates, by
    // design: if the NPS feed carries this title on a date, the route's
    // date+title dedupe drops BOTH manual slots and the reader sees the single
    // feed record. Accepted tradeoff; tagging the title to dodge dedupe would
    // produce duplicates in the far more common no-feed case.
    source: 'nps',
    category: 'talk',
    title: 'Ranger Talk: Welcome to Tuolumne!',
    description:
      'A 15-minute orientation talk at the Tuolumne Meadows Visitor Center parking lot; offered ' +
      'daily at noon and 3 p.m.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '15:00',
    timeEnd: '15:15',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-campfireside-chat',
    source: 'nps',
    category: 'talk',
    title: 'Campfireside Chat with a Ranger',
    description: 'An evening chat with a ranger around the fire at Tuolumne Meadows Lodge.',
    dates: buildWeeklyDates('2026-06-22', GUIDE_END, [MON, WED, SAT]),
    timeStart: '20:00',
    timeEnd: '21:00',
    location: 'Tuolumne Meadows Lodge',
    coord: TM_LODGE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'stars-over-tuolumne',
    // Category set by hand, same reason as stars-over-crane-flat.
    source: 'nps',
    category: 'astronomy',
    title: 'Stars Over Tuolumne',
    description:
      'An hour of high-country stargazing from Lembert Dome parking. Bring a pad to sit on, a ' +
      'flashlight, and warm layers.',
    dates: buildWeeklyDates('2026-06-15', GUIDE_END, [MON, WED]),
    timeStart: '21:30',
    timeEnd: '22:30',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
]

// ── Pending verification: NOT served ─────────────────────────────────────────
// Checked 2026-07-02, re-checked 2026-07-03 and 2026-07-06, and withheld under
// the "only dates confirmed on the operator's own page" rule. Move an entry
// back into `entries` with real dates once its schedule publishes.
//
// - parsons-summer-series: yosemite.org confirms the series runs in 2026
//   (see their "Yosemite Art and Traditions" project page) but has not
//   published the dated 2026 schedule; the newest dated page is 2025
//   (which ran weekends July 19 to August 17). The 2026-07-06 guide pass
//   confirms the lodge itself is open daily 10 am - 4 pm from June 22 (served
//   above as `parsons-lodge-open`) but prints no lecture-series dates.
// - tm-kids-campfire / tm-campfire-program: the guide lists both with
//   "starts when campground is open", and the Tuolumne Meadows campground's
//   2026 opening date is unpublished. Fill real dates through GUIDE_END when
//   it posts.
// - vintners-holidays (not yet drafted): partial 2026 dates are visible via
//   participating wineries (e.g. Grgich Hills shows Session 2 Nov 11-14 and
//   Session 3 Nov 18-21, 2026) but travelyosemite.com's full session
//   calendar was not directly confirmable this pass. Draft the entry from
//   the operator page when it can be read.
// - chefs-holidays (not yet drafted): the January-to-early-February 2027
//   session calendar is unannounced as of 2026-07-03.
//
// Stale-date traps seen in search results during the checks, do not reuse:
// "Poetry Festival August 17–18" is the 2024 festival. The NPS event-details
// star-party listing offering "July 26 & 27, Aug 2 & 3, Aug 9 & 10" matches
// the 2024/2025 calendars, not 2026 (the 2026 weekends are July 3 & 4 and
// July 11 & 12, per the Yosemite Guide Vol 51 Issue 5; the star-party entry
// was promoted into `entries` on the 2026-07-06 pass).
export const PENDING_VERIFICATION: ManualEntryT[] = [
  {
    key: 'parsons-summer-series',
    source: 'conservancy',
    category: 'arts',
    title: 'Parsons Memorial Lodge Summer Series',
    description:
      'Free talks, music, and poetry in the 1915 stone Sierra Club lodge at Tuolumne Meadows. ' +
      'Programs run summer weekends and close with the Tuolumne Meadows Poetry Festival in mid-August. ' +
      'Confirm the current season schedule on yosemite.org before planning around a date.',
    // TODO: fill from yosemite.org's 2026 Parsons series page when it posts.
    dates: ['2026-07-11'],
    timeStart: '14:00',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: [-119.3589, 37.8772],
    isFree: true,
    url: 'https://yosemite.org/experience/',
  },
  {
    key: 'tm-kids-campfire',
    source: 'nps',
    category: 'kids',
    title: 'Kids\' Campfire!',
    description:
      'A 45-minute campfire program for kids at the Conness Campfire Circle in the Tuolumne ' +
      'Meadows Campground, C Loop.',
    // TODO: guide says "starts when campground is open"; the Tuolumne Meadows
    // campground 2026 opening date is unpublished. Fill Wednesdays from the
    // opening date through GUIDE_END when it posts.
    dates: ['2026-07-08'],
    timeStart: '19:00',
    timeEnd: '19:45',
    location: 'Conness Campfire Circle, Tuolumne Meadows Campground, C Loop',
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-campfire-program',
    source: 'nps',
    category: 'talk',
    // Location-qualified for the same reason as wawona-campfire-program.
    title: 'Campfire Program at Tuolumne Meadows',
    description:
      'A nightly campfire program at the Tuolumne Meadows Campground; different topics each night.',
    // TODO: guide says "starts when campground is open"; fill nightly dates
    // from the opening date through GUIDE_END when it posts.
    dates: ['2026-07-08'],
    timeStart: '20:00',
    timeEnd: '21:00',
    location: 'Tuolumne Meadows Campground',
    isFree: true,
    url: NPS_GUIDE_URL,
  },
]

// Expand every entry to per-date ProgramEvents and validate the lot at module
// load, mirroring the stops.ts pattern: a curation typo fails typecheck/deploy
// rather than shipping.
function expand(entry: ManualEntryT): ProgramEventT[] {
  const { key, dates, ...rest } = entry
  return dates.map((date) =>
    ProgramEvent.parse({ ...rest, id: `${entry.source}:${key}:${date}`, date }),
  )
}

function buildDailyDates(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const stop = Date.parse(`${end}T00:00:00Z`)
  while (d.getTime() <= stop) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

// Every date in [start, end] (inclusive) whose weekday is in `weekdays`
// (Date.getUTCDay() numbering), minus any dates in opts.skip. UTC day-walk,
// same contract as buildDailyDates.
function buildWeeklyDates(
  start: string,
  end: string,
  weekdays: number[],
  opts?: { skip?: string[] },
): string[] {
  const skip = new Set(opts?.skip ?? [])
  return buildDailyDates(start, end).filter((date) => {
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay()
    return weekdays.includes(dow) && !skip.has(date)
  })
}

// Keys must be unique across served and parked entries; with this many the
// loud-failure workflow needs the explicit guard.
const seenKeys = new Set<string>()
for (const e of [...entries, ...PENDING_VERIFICATION]) {
  if (seenKeys.has(e.key)) throw new Error(`manual-programs: duplicate key ${e.key}`)
  seenKeys.add(e.key)
}

const parsed = z.array(ManualEntry).parse(entries)
z.array(ManualEntry).parse(PENDING_VERIFICATION) // keep the parked entries valid too

// Version label surfaced in the /api/programs `sources` block so the app can
// show which curation pass the offline copy came from.
export const MANUAL_PROGRAMS_VERSION = '2026-07-guide-v51n5-pass'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
