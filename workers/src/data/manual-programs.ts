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
// ground truth each new issue. As of the 2026-07-15 pass the file also carries
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

// Yosemite Guide Vol 51 Issue 6, valid 2026-07-15 through 2026-08-18.
const GUIDE_START = '2026-07-15'
const GUIDE_END = '2026-08-18'

// Meeting-point coords, [lng, lat]. The first group is reused from stops.ts /
// existing entries (those carry their own verify TODOs); the second group is
// approximate, good enough for the trip planner's travel-buffer math, and
// should be tightened on a coord verification pass.
const AHWAHNEE: [number, number] = [-119.5747, 37.7458]          // ahwahnee-hotel stop
const CURRY_VILLAGE: [number, number] = [-119.5688, 37.7395]     // curry-village stop
const VALLEY_LODGE: [number, number] = [-119.5989, 37.7439]      // existing valley-floor-tour entry
const HAPPY_ISLES: [number, number] = [-119.5594, 37.7338]       // mist-trail stop (Happy Isles)
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
const POTHOLE_DOME: [number, number] = [-119.3860, 37.8770]
const TM_LODGE: [number, number] = [-119.3417, 37.8757]

const NPS_GUIDE_URL = 'https://www.nps.gov/yose/planyourvisit/guide.htm'
const YH_TOURS_URL = 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/'
const YH_URL = 'https://www.travelyosemite.com/things-to-do/'
const YC_ART_URL = 'https://yosemite.org/art'
const YC_URL = 'https://yosemite.org/experience/'
const TAAG_URL = 'https://www.anseladams.com/photography-education/'

// ── Confirmed entries only ───────────────────────────────────────────────────
// Standing non-guide entries verified on the 2026-07-02 / 2026-07-03 passes:
// the Valley Floor Tour's daily year-round operation (travelyosemite.com), the
// Yosemite Facelift 2026 dates (Yosemite Climbing Association's registration
// page), and the 2026 Bracebridge Dinner performances (travelyosemite.com).
//
// Guide pass 2026-07-15: recurated the full printed program schedule from the
// Yosemite Guide Vol 51 Issue 6 (valid July 15 – August 18, 2026), the
// successor to the v51n5 (June 10 – July 14) issue this file previously
// carried. Changes this issue vs the last: Climber Coffee and the El Capitan
// "Ask a Climber" scope have moved fully to Tuolumne (the valley Climber
// Coffee and Ask a Climber entries are dropped); the valley picks up a Jr.
// Ranger Discovery Table, Wee Wild Ones (starts July 24), and a Friday/Saturday
// Movie Night, so the plain nightly Evening Programs is now Sunday–Thursday
// only; Discovery Walk adds Saturday. Tuolumne adds Art in the Meadow and
// Sunset on the Dome, promotes Kids' Campfire and the campground Campfire
// Program out of PENDING now that the campground is open, and renames the
// Tioga Pass and river walks to their printed v51n6 titles. Wawona drops its
// campground Campfire Program (not printed this issue). The Parsons Memorial
// Lodge Summer Series is promoted with real dates (weekends July 18 – August
// 16), including the Joe Craven performance (July 24) and the two poetry
// workshops (August 15–16). Titles are kept as printed so the route's
// date+title dedupe can drop a manual entry whenever the NPS feed carries the
// same program (the two Mariposa Grove titles keep the house-style form without
// the printed em-dash; a feed collision there would show as a duplicate and can
// be aligned on a later pass). Asterisked "no program" dates are honored via
// per-entry skip lists.
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
    // 2026-07-15: Yosemite Guide Vol 51 Issue 6 confirms daily departures at
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

  // ── Yosemite Guide v51n6: Yosemite Valley walks & talks ────────────────────
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE, WED, THU, SAT]),
    timeStart: '10:30',
    timeEnd: '11:30',
    location: 'Yosemite Museum, Yosemite Village (shuttle stop 5)',
    coord: VILLAGE_MALL,
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
    // Guide: daily, *no program Aug 11.
    dates: buildDailyDates(GUIDE_START, GUIDE_END).filter((d) => d !== '2026-08-11'),
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
    key: 'valley-jr-ranger-discovery-table',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Discovery Table',
    description:
      'Drop in any time to talk with a ranger and start or finish earning a Junior Ranger badge. At ' +
      'the Yosemite Valley Welcome Center (shuttle stop 2).',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED, FRI]),
    timeStart: '14:00',
    timeEnd: '15:00',
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
      'hotel\'s back lawn (shuttle stop 3). Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '15:00',
    location: 'The Ahwahnee, back lawn (shuttle stop 3)',
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
      'Short films, presentations, and performances by Yosemite Conservancy naturalists or National ' +
      'Park Service guest speakers at the Yosemite Theater, behind the Exploration Center (shuttle ' +
      'stop 5). Free, drop-in.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '16:30',
    timeEnd: '17:30',
    location: 'Yosemite Theater, behind the Exploration Center (shuttle stop 5)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: YC_URL,
  },
  {
    key: 'wee-wild-ones',
    source: 'aramark',
    category: 'kids',
    title: 'Wee Wild Ones',
    description:
      'Stories and activities for kids 10 and under. Meets at the Curry Village Amphitheater ' +
      '(shuttle stops 14 and 19). Free, drop-in. Starts July 24.',
    // Guide: nightly, *starts July 24.
    dates: buildDailyDates('2026-07-24', GUIDE_END),
    timeStart: '19:00',
    timeEnd: '19:30',
    location: 'Curry Village Amphitheater (shuttle stops 14 and 19)',
    coord: CURRY_VILLAGE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'curry-evening-program',
    source: 'aramark',
    category: 'talk',
    title: 'Evening Programs',
    description:
      'Yosemite naturalists present a different topic each night at the Curry Village Amphitheater ' +
      '(shuttle stops 14 and 19). Free, drop-in.',
    // Guide: Sun–Thu (Fri/Sat are Movie Night, below).
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU]),
    timeStart: '20:00',
    timeEnd: '20:30',
    location: 'Curry Village Amphitheater (shuttle stops 14 and 19)',
    coord: CURRY_VILLAGE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'curry-movie-night',
    source: 'aramark',
    category: 'talk',
    title: 'Evening Program: Movie Night!',
    description:
      'Yosemite naturalists briefly present a Yosemite topic, then play a short movie. At the Curry ' +
      'Village Amphitheater (shuttle stops 14 and 19). Fridays: Natural and Cultural Change in ' +
      'Yosemite. Saturdays: Yosemite\'s Firefall. Free, drop-in.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI, SAT]),
    timeStart: '20:00',
    timeEnd: '21:00',
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

  // ── Yosemite Guide v51n6: bus & tram tours ─────────────────────────────────
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

  // ── Yosemite Guide v51n6: photography walks (The Ansel Adams Gallery) ──────
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

  // ── Yosemite Guide v51n6: art classes (Yosemite Conservancy) ───────────────
  // One entry per published instructor block; the printed schedule runs
  // weekday mornings (9 a.m., 4 hrs) at the Happy Isles Art & Nature Center.
  {
    key: 'yc-art-class-printmaking-villa',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Printmaking',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: printmaking ' +
      'with Daniel Villa. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    // Jul 13-14 fall before the guide window opens but the block is printed in
    // this issue; kept as published.
    dates: buildWeeklyDates('2026-07-13', '2026-07-17', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-zine-dziengel',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Zine Journaling',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: zine journaling ' +
      'with Ana Dziengel. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-07-20', '2026-07-24', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-nature-drawing-monhollen',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Nature Drawing',
    description:
      'Slow down and connect with nature through art; beginners welcome. This block: nature drawing ' +
      'with Kyle Monhollen. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    // Two-week block; the weekday filter drops the two weekends.
    dates: buildWeeklyDates('2026-07-27', '2026-08-07', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor-meinhold',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Bridgette Meinhold. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). ' +
      'Paid; register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-08-10', '2026-08-14', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor-peart',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Jennifer Peart. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    // Aug 19-21 extend past the guide window but are printed in this issue.
    dates: buildWeeklyDates('2026-08-17', '2026-08-21', [MON, TUE, WED, THU, FRI]),
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

  // ── Yosemite Guide v51n6: Yosemite Valley special events ───────────────────
  {
    key: 'obata-exhibit',
    source: 'nps',
    category: 'arts',
    title: 'Obata Exhibit at The Ansel Adams Gallery',
    description:
      'A special exhibit of Yosemite National Park\'s collection of Chiura Obata original pieces, ' +
      'alongside high-quality giclee reproduction prints for purchase. At The Ansel Adams Gallery, ' +
      'open daily 9 a.m. to 5 p.m.',
    // Printed July 3-20; kept as published, the pre-window dates simply fall
    // outside a July 15+ trip query.
    dates: buildDailyDates('2026-07-03', '2026-07-20'),
    timeStart: '09:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },
  {
    key: 'obata-art-weekend',
    source: 'nps',
    category: 'arts',
    title: 'Obata Art Weekend',
    description:
      'A weekend celebrating Chiura Obata, the Japanese American artist known for his stunning ' +
      'portrayals of Yosemite\'s high country: art workshops, demonstrations, and ranger talks. ' +
      'Registration and details at yosemite.org/obata-art-weekend.',
    dates: ['2026-07-17', '2026-07-18', '2026-07-19'],
    location: 'Yosemite Valley',
    isFree: true,
    url: 'https://yosemite.org/obata-art-weekend',
  },
  {
    key: 'obata-special-screening',
    source: 'nps',
    category: 'arts',
    title: 'Special Screening: Obata\'s Yosemite',
    description:
      'A 15-minute film on Chiura Obata, playing on the half hour throughout the day at the ' +
      'Yosemite Theater behind the Exploration Center.',
    dates: ['2026-07-17', '2026-07-18'],
    timeStart: '09:30',
    timeEnd: '16:00',
    location: 'Yosemite Theater, behind the Exploration Center',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'connecting-to-traditions',
    source: 'nps',
    category: 'arts',
    title: 'Connecting to Traditions: Cultural Demonstration Program',
    description:
      'Meet Indigenous artists as they practice traditional and modern crafts; demonstrations are ' +
      'free and open to the public at or outside the Yosemite Museum (Yosemite Village Parking or ' +
      'shuttle stop 5). July 17 and 18: Chrissy Atwell (Big Sandy Rancheria), basketry and acorn. ' +
      'August 7, 8, and 9: Charlene Redner and Rena Brown (Bishop Paiute), basketry and beading. ' +
      'August 15, 16, and 17: Sandy Clark (North Fork Rancheria of Mono Indians), basketry. Check ' +
      'at the museum for times.',
    dates: [
      '2026-07-17', '2026-07-18',
      '2026-08-07', '2026-08-08', '2026-08-09',
      '2026-08-15', '2026-08-16', '2026-08-17',
    ],
    location: 'Yosemite Museum, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'yosemite-knapping-event',
    source: 'nps',
    category: 'arts',
    title: 'Yosemite Knapping Event',
    description:
      'Learn about the art of making stone tools, part of the Connecting to Traditions cultural ' +
      'demonstration program at the Yosemite Museum. Free and open to the public.',
    dates: ['2026-08-15', '2026-08-16'],
    timeStart: '09:00',
    timeEnd: '17:00',
    location: 'Yosemite Museum, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'zero-heroes-volunteer',
    source: 'nps',
    category: 'other',
    title: 'Drop-in Volunteer Event: Yosemite Zero Heroes',
    description:
      'A drop-in litter cleanup along roadsides, trails, parking lots, and campgrounds; litter ' +
      'sticks and buckets provided. Families with kids 5 and up are welcome. Meet in front of the ' +
      'Exploration Center in Yosemite Village at 10 a.m.; no advance signup, register when you arrive.',
    dates: ['2026-08-18'],
    timeStart: '10:00',
    timeEnd: '13:00',
    location: 'Exploration Center, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n6: stargazing at Glacier Point ──────────────────────
  {
    key: 'glacier-point-starry-skies',
    source: 'aramark',
    category: 'astronomy',
    title: 'Glacier Point Starry Skies',
    description:
      'A Yosemite naturalist hosts an hour of stargazing from Glacier Point. Transportation to ' +
      'Glacier Point is not included. Paid; register at travelyosemite.com.',
    // Guide: Su, M, Tu, W, Th; *no programs Jul 26-30.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU], {
      skip: ['2026-07-26', '2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30'],
    }),
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
    // Yosemite Guide Vol 51 Issue 6: Jul 17 & 18, Jul 31 & Aug 1, Aug 7 & 8,
    // Aug 14 & 15 ONLY.
    dates: [
      '2026-07-17', '2026-07-18',
      '2026-07-31', '2026-08-01',
      '2026-08-07', '2026-08-08',
      '2026-08-14', '2026-08-15',
    ],
    timeStart: '20:30',
    location: 'Glacier Point Amphitheater',
    coord: GLACIER_POINT,
    isFree: true,
    url: 'https://nightsky.jpl.nasa.gov/',
  },

  // ── Yosemite Guide v51n6: Wawona & the Mariposa Grove ──────────────────────
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

  // ── Yosemite Guide v51n6: near Crane Flat ──────────────────────────────────
  {
    key: 'tuolumne-grove-sequoia-hike',
    source: 'nps',
    category: 'walk',
    title: 'Giant Sequoia Hike',
    description:
      'A ranger-led hour among the Tuolumne Grove sequoias. Meet in the grove: it is a 1-mile walk ' +
      'down from the trailhead, 2.5 miles round trip with 500 feet of climb on the way out. Bring water.',
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED, FRI, SAT]),
    timeStart: '19:00',
    timeEnd: '20:00',
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
    // Guide: Jul 15, 16, 27, 29, 30 and Aug 1, 10, 12, 13, 18 ONLY.
    dates: [
      '2026-07-15', '2026-07-16', '2026-07-27', '2026-07-29', '2026-07-30',
      '2026-08-01', '2026-08-10', '2026-08-12', '2026-08-13', '2026-08-18',
    ],
    timeStart: '20:30',
    timeEnd: '22:00',
    location: 'Crane Flat (register at the Big Oak Flat Information Station)',
    coord: CRANE_FLAT,
    isFree: true,
    reservationRequired: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n6: Tuolumne Meadows ─────────────────────────────────
  {
    key: 'tm-bird-walk',
    source: 'nps',
    category: 'walk',
    title: 'Bird Walk',
    description:
      'An easy morning stroll with a Tuolumne Meadows bird expert; binoculars available. Meets at ' +
      'Lembert Dome parking.',
    // Guide: W, Sa; *no program Jul 25.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SAT], { skip: ['2026-07-25'] }),
    timeStart: '07:30',
    timeEnd: '10:30',
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
      'climbing community. Drop in at the Tuolumne Meadows Store.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN]),
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
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, TUE]),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-tioga-pass-botanical',
    source: 'nps',
    category: 'walk',
    title: 'Tioga Pass Botanical Walk',
    description:
      'See what\'s in bloom at 10,000 feet above the sea. A moderate to strenuous four-hour hike; ' +
      'meet at the Gaylor Lakes Trailhead ready to walk.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI]),
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
      'Parsons Lodge Parking.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, THU]),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Parsons Lodge Parking, Tuolumne Meadows',
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
    // Guide: W, Sa; *no program Aug 15.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SAT], { skip: ['2026-08-15'] }),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SAT]),
    timeStart: '10:00',
    timeEnd: '11:30',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-art-in-the-meadow',
    source: 'nps',
    category: 'arts',
    title: 'Art in the Meadow',
    description:
      'Spend time with a local artist in the meadow and bring a treasure home. In Tuolumne Meadows; ' +
      'check the visitor center for the meeting point.',
    // Guide: Su; *no program Aug 16.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN], { skip: ['2026-08-16'] }),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Tuolumne Meadows',
    coord: TM_VISITOR_CENTER,
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
      'daily at noon and, Monday through Friday, at 3 p.m.',
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
    title: 'Tuolumne Wild and Scenic River Walk',
    description: 'An easy stroll along the wild and scenic Tuolumne River. Meets at the Dog Lake parking lot.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED]),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE]),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON]),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI]),
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [THU]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Tuolumne Meadows Visitor Center',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-welcome-talk-3pm',
    // Same printed title as tm-welcome-talk-noon; if the NPS feed carries this
    // title on a date, the route's date+title dedupe drops BOTH manual slots
    // and the reader sees the single feed record. Accepted tradeoff. Unlike the
    // noon talk this session runs Monday through Friday only.
    source: 'nps',
    category: 'talk',
    title: 'Ranger Talk: Welcome to Tuolumne!',
    description:
      'A 15-minute orientation talk at the Tuolumne Meadows Visitor Center parking lot; offered ' +
      'daily at noon and, Monday through Friday, at 3 p.m.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, TUE, WED, THU, FRI]),
    timeStart: '15:00',
    timeEnd: '15:15',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-sunset-on-the-dome',
    source: 'nps',
    category: 'walk',
    title: 'Sunset on the Dome',
    description:
      'A short walk to watch the sunset from the dome. Meets at the Lembert picnic area.',
    // Guide: F; *no program July 24.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI], { skip: ['2026-07-24'] }),
    timeStart: '18:00',
    timeEnd: '19:30',
    location: 'Lembert picnic area, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-kids-campfire',
    source: 'nps',
    category: 'kids',
    title: 'Kids\' Campfire!',
    description:
      'A 45-minute campfire program for kids at the Conness Campfire Circle in the Tuolumne ' +
      'Meadows Campground, C Loop.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED]),
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
    // Location-qualified for the same reason the Wawona campfire program was in
    // v51n5: the guide titles it plain "Campfire Program", and the route's
    // date+title dedupe carries no location.
    title: 'Campfire Program at Tuolumne Meadows',
    description:
      'A nightly campfire program at the Tuolumne Meadows Campground; different topics each night.',
    // Guide: Nightly; *no program Aug 15.
    dates: buildDailyDates(GUIDE_START, GUIDE_END).filter((d) => d !== '2026-08-15'),
    timeStart: '20:00',
    timeEnd: '21:00',
    location: 'Tuolumne Meadows Campground',
    coord: TM_LODGE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-campfireside-chat',
    source: 'nps',
    category: 'talk',
    title: 'Campfireside Chat with a Ranger',
    description: 'An evening chat with a ranger around the fire at Tuolumne Meadows Lodge.',
    // Guide: M, W, Sa; *no program Aug 15.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, WED, SAT], { skip: ['2026-08-15'] }),
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
    // Guide: M, W, Sa; *no program Aug 15.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, WED, SAT], { skip: ['2026-08-15'] }),
    timeStart: '21:30',
    timeEnd: '22:30',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'parsons-summer-series',
    source: 'conservancy',
    category: 'arts',
    title: 'Parsons Memorial Lodge Summer Series',
    description:
      'Free talks, readings, workshops, and music by artists, poets, writers, and musicians in the ' +
      '1915 stone Parsons Memorial Lodge at Tuolumne Meadows. A 30-minute easy walk from parking. ' +
      'Check the Tuolumne Meadows Visitor Center or the online calendar for the schedule of events.',
    // Guide: weekends, July 18 – August 16.
    dates: buildWeeklyDates('2026-07-18', '2026-08-16', [SAT, SUN]),
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: YC_URL,
  },
  {
    key: 'tm-improvisation-as-a-lifestyle',
    source: 'conservancy',
    category: 'arts',
    title: 'Improvisation as a Lifestyle',
    description:
      'An interactive music performance by Joe Craven at Parsons Memorial Lodge, part of the ' +
      'Parsons Memorial Lodge Summer Series. Free.',
    dates: ['2026-07-24'],
    timeStart: '18:00',
    timeEnd: '20:00',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: YC_URL,
  },
  {
    key: 'tm-poetry-workshops',
    source: 'conservancy',
    category: 'arts',
    title: 'Poetry Workshops at Parsons Memorial Lodge',
    description:
      'Free poetry workshops at Parsons Memorial Lodge with Michael Metivier (August 15) and ' +
      'Heather Swan (August 16), part of the Parsons Memorial Lodge Summer Series. Bring pen and paper.',
    dates: ['2026-08-15', '2026-08-16'],
    timeStart: '10:00',
    timeEnd: '11:30',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: YC_URL,
  },
  {
    key: 'yc-stewardship-geology-hut',
    source: 'conservancy',
    category: 'other',
    title: 'Stewardship Series: Geology Hut, Reading Yosemite\'s Rocks',
    description:
      'A two-hour Stewardship Series program on how to read the granite story of Yosemite at the ' +
      'Geology Hut. Registration required at yosemite.org; free for Yosemite Conservancy donors.',
    dates: ['2026-07-24'],
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Geology Hut, Glacier Point',
    coord: GLACIER_POINT,
    // isFree deliberately unset: free for Yosemite Conservancy donors only; the
    // description carries the condition.
    reservationRequired: true,
    url: YC_URL,
  },
]

// ── Pending verification: NOT served ─────────────────────────────────────────
// Checked across the 2026-07 passes and withheld under the "only dates
// confirmed on the operator's own page" rule. Move an entry into `entries` with
// real dates once its schedule publishes.
//
// As of the 2026-07-15 (guide v51n6) pass everything previously parked here has
// been promoted: the Parsons Memorial Lodge Summer Series (weekends July 18 –
// August 16), the Tuolumne Meadows Kids' Campfire (Wednesdays), and the
// Tuolumne Meadows campground Campfire Program (nightly) all print real dates
// in this issue.
//
// Still undrafted, awaiting operator confirmation for later in the season:
// - vintners-holidays: partial 2026 dates are visible via participating
//   wineries (e.g. Grgich Hills shows Session 2 Nov 11-14 and Session 3 Nov
//   18-21, 2026) but travelyosemite.com's full session calendar was not
//   directly confirmable. Draft the entry from the operator page when readable.
// - chefs-holidays: the January-to-early-February 2027 session calendar is
//   unannounced as of the 2026-07 passes.
//
// Stale-date traps seen during the checks, do not reuse: "Poetry Festival
// August 17-18" is the 2024 festival. The NPS event-details star-party listing
// offering "July 26 & 27, Aug 2 & 3, Aug 9 & 10" matches the 2024/2025
// calendars, not the 2026 Glacier Point weekends (Jul 17 & 18, Jul 31 & Aug 1,
// Aug 7 & 8, Aug 14 & 15, per Yosemite Guide Vol 51 Issue 6).
export const PENDING_VERIFICATION: ManualEntryT[] = []

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
export const MANUAL_PROGRAMS_VERSION = '2026-07-guide-v51n6-pass'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
