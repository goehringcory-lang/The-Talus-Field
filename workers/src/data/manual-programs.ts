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

// Yosemite Guide Vol 51 Issue 7, valid 2026-08-19 through 2026-09-22.
const GUIDE_START = '2026-08-19'
const GUIDE_END = '2026-09-22'

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
const CAMP_4: [number, number] = [-119.6029, 37.7421]            // camp-4 stop (carries its own verify TODO)
const EL_CAP_BRIDGE: [number, number] = [-119.6315, 37.7240]     // el-capitan-bridge pin in points.geojson
// Approximate; verify on a coord pass:
const VILLAGE_MALL: [number, number] = [-119.5855, 37.7485]      // Welcome Center / museum / theater / gallery cluster
const YCHC: [number, number] = [-119.5836, 37.7401]              // Yosemite Conservation Heritage Center, shuttle stop 12
const POTHOLE_DOME: [number, number] = [-119.3860, 37.8770]
const TM_LODGE: [number, number] = [-119.3417, 37.8757]
const TM_CAMPGROUND: [number, number] = [-119.3489, 37.8730]   // campground entrance; the Conness circle is in C Loop

const NPS_GUIDE_URL = 'https://www.nps.gov/yose/planyourvisit/guide.htm'
const YH_TOURS_URL = 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/'
const YH_URL = 'https://www.travelyosemite.com/things-to-do/'
const YC_ART_URL = 'https://yosemite.org/art'
const YC_URL = 'https://yosemite.org/experience/'
const YC_ADVENTURES_URL = 'https://yosemite.org/adventures'
const TAAG_URL = 'https://www.anseladams.com/photography-education/'
const SIERRA_CLUB_URL = 'https://www.sierraclub.org/yosemite-conservation-heritage-center'

// ── Confirmed entries only ───────────────────────────────────────────────────
// Standing non-guide entries verified on the 2026-07-02 / 2026-07-03 passes:
// the Valley Floor Tour's daily year-round operation (travelyosemite.com), the
// Yosemite Facelift 2026 dates (Yosemite Climbing Association's registration
// page), and the 2026 Bracebridge Dinner performances (travelyosemite.com).
//
// Guide pass 2026-08-17: recurated the full printed program schedule from the
// Yosemite Guide Vol 51 Issue 7 (valid August 19 – September 22, 2026), the
// successor to the v51n6 (July 15 – August 18) issue this file previously
// carried. As on every issue turn, the outgoing window's entries are replaced
// rather than accumulated: an entry whose dates had all passed and which this
// issue does not reprint is deleted, so the file stays the size of one season.
//
// Changes this issue vs the last. The valley gets back the two climbing
// programs Tuolumne took in v51n6, staggered so they never overlap: Climber
// Coffee returns to Camp 4 on Sep 13 (Tuolumne's runs Sundays only until Aug
// 30) and Ask-a-Climber restarts at El Capitan bridge on Sep 6. Guided hikes
// with the Yosemite Mountaineering School print a real schedule from Sep 4 and
// are carried as four entries, one per printed hike, because the issue lists
// two Discovery Hikes (M/W/Sa) and two Adventure Hikes (Tu/F and Su/Th) under
// one row. New besides those: the Conservancy's daily 5:30 pm Yosemite Valley
// Sunset Walk, the Moonlight Tour (Aug 23-27 and Sep 22), Junior Ranger Day
// (Aug 22), the Yosemite Art Trail week (Aug 24-30), the four Sierra Club
// evening programs at the Yosemite Conservation Heritage Center (Sep 11, 12,
// 18, 19), Tom Killion's gallery exhibition (Aug 8 – Sep 26), Tuolumne's
// Coffee with a Ranger (Tu/Th at the Dana Campfire Circle), and Wawona's Bear
// Talk with Ranger Jill. Wawona's nightly campground Campfire Program returns
// after a issue off, which is why both it and Tuolumne's carry
// location-qualified titles: the guide prints both as plain "Campfire
// Program", both run nightly, and the route's dedupe key is date plus title.
//
// Retimed, not merely re-dated: the valley Jr. Ranger Discovery Table moves to
// 3 pm, Wee Wild Ones to 6 pm (and now ends Sep 13), the Crane Flat Evening
// Program to 6:30 pm (adding Thursday), Stars Over Crane Flat to 8 pm, and all
// three Tuolumne evening programs shift half an hour earlier (campfire and
// campfireside chat to 7:30, Stars Over Tuolumne to 9). Tuolumne's Wildflower
// Walk is printed as "Botanical Walk" this issue, and its afternoon Welcome to
// Tuolumne! talk goes from weekdays to daily, while History of Tuolumne
// Meadows drops from a weekly Friday to Aug 21 and 28 only.
//
// Dropped because this issue does not print them: Yosemite Live! at the
// Yosemite Theater, the Glacier Point astronomy-club star parties (only the
// ticketed Starry Skies nights are listed now, on their own new dates), the
// Parsons Memorial Lodge Summer Series and its Joe Craven and poetry dates,
// Tuolumne's Dog Lake hike, Art in the Meadow, Sunset on the Dome, and Kids'
// Campfire, and the Geology Hut stewardship program (replaced by the Tuolumne
// Meadows Overview on Aug 21). Every Wawona-area program carries the issue's
// "*no program Aug 19" asterisk as a skip.
//
// Titles are kept as printed so the route's date+title dedupe can drop a
// manual entry whenever the NPS feed carries the same program (the two
// Mariposa Grove titles keep the house-style form without the printed
// em-dash; a feed collision there would show as a duplicate and can be aligned
// on a later pass). Asterisked "no program" dates are honored via per-entry
// skip lists; an asterisk with no publishable dates behind it (Tuolumne's
// campfireside chat runs "only when the Lodge is open") is carried in the
// description instead of guessed at.
//
// Symbol pass 2026-08-18, same v51n7 issue. Page 8's legend attaches four
// symbols to individual programs, and two of them were data this file had no
// home for: the wheelchair-accessible mark and "Recommended for Families."
// Both now ride on the entries as `accessible` / `familyFriendly` (see the
// schema note in lib/programs.ts: true-only, because the guide declining to
// mark a program is not a claim that it is inaccessible or wrong for kids).
// The other two symbols were already carried: the Junior Ranger mark is the
// `junior-ranger` / `kids` categories, and the Evening Program mark is the
// start time. 23 programs are marked accessible this issue and 24 as
// family-recommended; the marks are read off page 8 per row, never inferred
// from the kind of program, which is why the daily 9 am Ranger Walk carries
// neither while the 10 am Jr. Ranger Walk from the same doorway carries the
// accessible one.
//
// The same pass location-qualified both Jr. Ranger Discovery Table titles and
// added the date+title collision guard at the bottom of the file; see the
// comment there for what a shared title costs at read time.
//
// Deliberately NOT curated as programs, because the issue prints them as
// services rather than scheduled programs: the Wawona stable and pony rides,
// golf, bike rentals, the pools, and the chapel services. The seasonal service
// closures this issue announces (High Sierra Camps, the Tuolumne store and
// grill on Sep 20, the hikers bus and Tuolumne shuttle on Sep 13, the pools
// and Jennie's in early September) live in the PWA's seasonal almanac and the
// /now bulletin, not here, as does the continuing Mist Trail weekday repair
// closure.
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
    // 2026-08-17: Yosemite Guide Vol 51 Issue 7 reprints the same daily
    // departures at 10 am, 11 am, 1 pm, 2 pm, and sunset for this window.
    dates: buildDailyDates('2026-07-01', '2027-06-30'),
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
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
    // page lists September 23-27, 2026, daily 8 a.m. to 4 p.m. Falls just past
    // the v51n7 window; kept because a late-September trip query reaches it.
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

  // ── Yosemite Guide v51n7: Yosemite Valley walks, talks & hikes ─────────────
  {
    key: 'ymc-discovery-hike-morning',
    source: 'aramark',
    category: 'walk',
    title: 'Discovery Hike: Vernal Fall Footbridge (Yosemite Mountaineering School)',
    description:
      'A four-hour guided hike to the Vernal Fall Footbridge with a Yosemite Mountaineering School ' +
      'guide; ages 12 and up. Paid; register at travelyosemite.com or at the Mountaineering School ' +
      'in Curry Village, 209/372-8344.',
    // Guide: 8:30 am and 1:30 pm, days vary, *starts Sep 4. Discovery Hikes run
    // M, W, Sa: 8:30 am to the Vernal Fall Footbridge, 1:30 pm to Mirror Lake.
    dates: buildWeeklyDates('2026-09-04', GUIDE_END, [MON, WED, SAT]),
    timeStart: '08:30',
    timeEnd: '12:30',
    location: 'Yosemite Mountaineering School, Curry Village',
    coord: CURRY_VILLAGE,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'ymc-discovery-hike-afternoon',
    source: 'aramark',
    category: 'walk',
    title: 'Discovery Hike: Mirror Lake Loop (Yosemite Mountaineering School)',
    description:
      'A four-hour guided hike around the Mirror Lake loop with a Yosemite Mountaineering School ' +
      'guide; ages 12 and up. The lakebed is a meadow by late summer, so this one is about the ' +
      'basin and the walls. Paid; register at travelyosemite.com or 209/372-8344.',
    dates: buildWeeklyDates('2026-09-04', GUIDE_END, [MON, WED, SAT]),
    timeStart: '13:30',
    timeEnd: '17:30',
    location: 'Yosemite Mountaineering School, Curry Village',
    coord: CURRY_VILLAGE,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'ymc-adventure-hike-nevada-fall',
    source: 'aramark',
    category: 'walk',
    title: 'Adventure Hike: Nevada Fall (Yosemite Mountaineering School)',
    description:
      'An eight-hour guided hike to the top of Nevada Fall with a Yosemite Mountaineering School ' +
      'guide; ages 12 and up. Paid; register at travelyosemite.com or 209/372-8344.',
    // Guide: 8-hour Adventure Hikes at 8:30 am, Nevada Fall on Tu and F.
    dates: buildWeeklyDates('2026-09-04', GUIDE_END, [TUE, FRI]),
    timeStart: '08:30',
    timeEnd: '16:30',
    location: 'Yosemite Mountaineering School, Curry Village',
    coord: CURRY_VILLAGE,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'ymc-adventure-hike-el-capitan',
    source: 'aramark',
    category: 'walk',
    title: 'Adventure Hike: El Capitan Loop (Yosemite Mountaineering School)',
    description:
      'An eight-hour guided El Capitan loop with a Yosemite Mountaineering School guide; ages 12 ' +
      'and up. Paid; register at travelyosemite.com or 209/372-8344.',
    // Guide: 8-hour Adventure Hikes at 8:30 am, El Capitan Loop on Su and Th.
    dates: buildWeeklyDates('2026-09-04', GUIDE_END, [SUN, THU]),
    timeStart: '08:30',
    timeEnd: '16:30',
    location: 'Yosemite Mountaineering School, Curry Village',
    coord: CURRY_VILLAGE,
    isFree: false,
    reservationRequired: true,
    url: YH_URL,
  },
  {
    key: 'valley-climber-coffee',
    source: 'nps',
    category: 'other',
    title: 'Climber Coffee',
    description:
      'Coffee with NPS climbing rangers: climbing management, preventative search and rescue, and ' +
      'news from the climbing community. Meet at Camp 4, near the Midnight Lightning boulder.',
    // Guide: Su, *starts Sep 13, when Climber Coffee moves back down from
    // Tuolumne. No date overlaps the Tuolumne entry, which ends Aug 30.
    dates: buildWeeklyDates('2026-09-13', GUIDE_END, [SUN]),
    timeStart: '09:00',
    timeEnd: '11:00',
    location: 'Camp 4, near the Midnight Lightning boulder',
    coord: CAMP_4,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
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
    accessible: true,
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
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-ask-a-climber',
    source: 'nps',
    category: 'talk',
    title: 'Ask-a-Climber',
    description:
      'Watch climbers on El Capitan through spotting scopes and talk with a ranger about the world ' +
      'of big-wall climbing. On the west side of El Capitan bridge (shuttle stop 9). Free, drop-in.',
    // Guide: daily, *starts Sep 6.
    dates: buildDailyDates('2026-09-06', GUIDE_END),
    timeStart: '12:30',
    timeEnd: '16:30',
    location: 'El Capitan bridge, west side (shuttle stop 9)',
    coord: EL_CAP_BRIDGE,
    isFree: true,
    familyFriendly: true,
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
    // Guide v51n7 prints this daily with no skip date, unlike v51n6.
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
    accessible: true,
    familyFriendly: true,
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
    accessible: true,
    url: YH_URL,
  },
  {
    key: 'valley-jr-ranger-discovery-table',
    source: 'nps',
    category: 'junior-ranger',
    // Location-qualified for the same reason the two Campfire Programs are:
    // the guide prints this table twice, in the valley and at the Tuolumne
    // Grove, under one title, and the route's dedupe key is date plus title.
    // Left as printed, an NPS feed entry for either one would have dropped
    // BOTH manual entries on that date and taken a real program off the board.
    title: 'Jr. Ranger Discovery Table in Yosemite Valley',
    description:
      'Drop in any time to talk with a ranger and start or finish earning a Junior Ranger badge. At ' +
      'the Yosemite Valley Welcome Center (shuttle stop 2).',
    // Guide v51n7 moves this to 3 pm; v51n6 ran it at 2 pm.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED, FRI]),
    timeStart: '15:00',
    timeEnd: '16:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
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
    key: 'yc-valley-sunset-walk',
    source: 'conservancy',
    category: 'walk',
    title: 'Yosemite Valley Sunset Walk',
    description:
      'A casual 90-minute walk with a Yosemite Conservancy naturalist while the setting sun lights ' +
      'up the granite, with the natural and cultural history of the park along the way. Paid; ' +
      'register in advance at yosemite.org/adventures.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '17:30',
    timeEnd: '19:00',
    location: 'Yosemite Valley (meeting point given at registration)',
    isFree: false,
    reservationRequired: true,
    familyFriendly: true,
    url: YC_ADVENTURES_URL,
  },
  {
    key: 'wee-wild-ones',
    source: 'aramark',
    category: 'kids',
    title: 'Wee Wild Ones',
    description:
      'Stories and activities for kids 10 and under. Meets at the Curry Village Amphitheater ' +
      '(shuttle stops 14 and 19). Free, drop-in. Runs through September 13.',
    // Guide v51n7: nightly at 6 pm, *until Sep 13. v51n6 ran it at 7 pm.
    dates: buildDailyDates(GUIDE_START, '2026-09-13'),
    timeStart: '18:00',
    timeEnd: '18:30',
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
    // Guide: Sun-Thu (Fri/Sat are Movie Night, below).
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU]),
    timeStart: '20:00',
    timeEnd: '20:30',
    location: 'Curry Village Amphitheater (shuttle stops 14 and 19)',
    coord: CURRY_VILLAGE,
    isFree: true,
    accessible: true,
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
    accessible: true,
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
    accessible: true,
    familyFriendly: true,
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

  // ── Yosemite Guide v51n7: bus & tram tours ─────────────────────────────────
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
  {
    key: 'aramark-moonlight-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Moonlight Tour',
    description:
      'A two-hour tram tour of Yosemite Valley under the light of the moon with a Yosemite ' +
      'Hospitality naturalist. Paid; tickets at travelyosemite.com or an in-park tour desk.',
    // Guide: Aug 23, 24, 25, 26, 27 and Sep 22, 9 pm.
    dates: [
      '2026-08-23', '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27',
      '2026-09-22',
    ],
    timeStart: '21:00',
    timeEnd: '23:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_TOURS_URL,
  },

  // ── Yosemite Guide v51n7: photography (The Ansel Adams Gallery) ────────────
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
  {
    key: 'taag-killion-exhibit',
    source: 'manual',
    category: 'arts',
    title: 'Trails and Trees: Woodblocks and Prints by Tom Killion',
    description:
      'An exhibition of Tom Killion\'s Sierra woodblock prints at The Ansel Adams Gallery in ' +
      'Yosemite Village, open daily 9 a.m. to 5 p.m. Free to walk through.',
    // Guide v51n7 park-partner page: August 8 - September 26, 2026.
    dates: buildDailyDates('2026-08-08', '2026-09-26'),
    timeStart: '09:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },

  // ── Yosemite Guide v51n7: art classes (Yosemite Conservancy) ───────────────
  // One entry per published instructor block; the printed schedule runs
  // weekday mornings (9 a.m., 4 hrs) at the Happy Isles Art & Nature Center.
  // The partner page lists blocks only through Sep 18, so Sep 21 and 22 carry
  // no class here; do not invent one to fill the window's last two days.
  {
    key: 'yc-art-class-journaling-eneriz',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor Nature Journaling',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'nature journaling with Sylvia Eneriz. Meets at the Happy Isles Art and Nature Center ' +
      '(shuttle stop 16). Paid; register in advance at yosemite.org/art.',
    // Aug 17-18 fall before the guide window opens but the block is printed in
    // this issue; kept as published.
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
    key: 'yc-art-class-watercolor-de-jesus',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Jessica de Jesus. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). ' +
      'Paid; register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-08-24', '2026-08-28', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-pastels-craft',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Pastels',
    description:
      'Slow down and connect with nature through art; beginners welcome. This block: pastels with ' +
      'Miranda Craft. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-08-31', '2026-09-04', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-printmaking-petersen',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Printmaking',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: printmaking ' +
      'with Leah Petersen. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-09-07', '2026-09-11', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor-curl',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Steve Curl. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-09-14', '2026-09-18', [MON, TUE, WED, THU, FRI]),
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
    accessible: true,
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
    // Guide: F, *until Aug 28.
    dates: buildWeeklyDates(GUIDE_START, '2026-08-28', [FRI]),
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Mountain Room Lounge, Yosemite Valley Lodge (shuttle stops 6 and 7)',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    url: YC_ART_URL,
  },

  // ── Yosemite Guide v51n7: parkwide special events ──────────────────────────
  {
    key: 'junior-ranger-day-2026',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Junior Ranger Day',
    description:
      'Special drop-in Junior Ranger programs throughout the park for one day. Stop by any open ' +
      'information center to find out what is running where. In the Mariposa Grove the 1:30 p.m. ' +
      'Jr. Ranger Talk meets in the grove parking area today instead of its usual spot.',
    dates: ['2026-08-22'],
    location: 'Parkwide',
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'yosemite-art-trail-2026',
    source: 'nps',
    category: 'arts',
    title: 'Yosemite Art Trail',
    description:
      'A week of art-themed drop-in programs throughout the park, with hands-on activities for ' +
      'making your own Yosemite-inspired piece. Stop by an information center for the day\'s ' +
      'locations. Free.',
    dates: buildDailyDates('2026-08-24', '2026-08-30'),
    location: 'Parkwide',
    isFree: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n7: evening programs at the Heritage Center ──────────
  // Free Sierra Club programs at the Yosemite Conservation Heritage Center
  // (shuttle stop 12). Very limited parking; ride the free valley shuttle.
  {
    key: 'ychc-poetry-tahoe-to-yosemite',
    source: 'manual',
    category: 'talk',
    title: 'Poetry from Tahoe to Yosemite',
    description:
      'An evening of Sierra poetry with Chris Olander, poet laureate and ecology bio-educator, at ' +
      'the Yosemite Conservation Heritage Center. Free. Very limited parking; use the free valley ' +
      'shuttle (stop 12).',
    dates: ['2026-09-11'],
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Yosemite Conservation Heritage Center (shuttle stop 12)',
    coord: YCHC,
    isFree: true,
    familyFriendly: true,
    url: SIERRA_CLUB_URL,
  },
  {
    key: 'ychc-old-yosemite-village',
    source: 'manual',
    category: 'talk',
    title: 'Legacy of the Old Yosemite Village',
    description:
      'Alice van Ommeren, author of Yosemite\'s Historic Hotels and Camps, on the village that ' +
      'stood on the south side of the Merced before the present one. At the Yosemite Conservation ' +
      'Heritage Center. Free. Very limited parking; use the free valley shuttle (stop 12).',
    dates: ['2026-09-12'],
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Yosemite Conservation Heritage Center (shuttle stop 12)',
    coord: YCHC,
    isFree: true,
    familyFriendly: true,
    url: SIERRA_CLUB_URL,
  },
  {
    key: 'ychc-mystery-cat',
    source: 'manual',
    category: 'talk',
    title: 'Mystery Cat: Yosemite\'s Elusive Mountain Lion',
    description:
      'Don Endicott, interpretive guide at Anza-Borrego Desert State Park, on the animal almost ' +
      'nobody sees. At the Yosemite Conservation Heritage Center. Free. Very limited parking; use ' +
      'the free valley shuttle (stop 12).',
    dates: ['2026-09-18'],
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Yosemite Conservation Heritage Center (shuttle stop 12)',
    coord: YCHC,
    isFree: true,
    familyFriendly: true,
    url: SIERRA_CLUB_URL,
  },
  {
    key: 'ychc-bats',
    source: 'manual',
    category: 'talk',
    title: 'Amazing World of Bats, Nature\'s Tiny Fighter Jets',
    description:
      'Don Endicott, interpretive guide at Anza-Borrego Desert State Park, on the park\'s bats. At ' +
      'the Yosemite Conservation Heritage Center. Free. Very limited parking; use the free valley ' +
      'shuttle (stop 12).',
    dates: ['2026-09-19'],
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Yosemite Conservation Heritage Center (shuttle stop 12)',
    coord: YCHC,
    isFree: true,
    familyFriendly: true,
    url: SIERRA_CLUB_URL,
  },

  // ── Yosemite Guide v51n7: stargazing at Glacier Point ──────────────────────
  // The astronomy-club star parties that ran through August 15 are NOT printed
  // in this issue; only the ticketed Starry Skies nights are. Do not carry the
  // club weekends forward on the assumption that they continue.
  {
    key: 'glacier-point-starry-skies',
    source: 'aramark',
    category: 'astronomy',
    title: 'Glacier Point Starry Skies',
    description:
      'A Yosemite naturalist hosts an hour of stargazing from Glacier Point. Transportation to ' +
      'Glacier Point is not included, and it is an hour from the valley in the dark. Paid; tickets ' +
      'at travelyosemite.com.',
    // Guide: 9 pm on select dates, *Aug 19-20, Sep 6-10, Sep 13-17 ONLY.
    dates: [
      '2026-08-19', '2026-08-20',
      '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10',
      '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17',
    ],
    timeStart: '21:00',
    timeEnd: '22:00',
    location: 'Glacier Point',
    coord: GLACIER_POINT,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_URL,
  },

  // ── Yosemite Guide v51n7: Wawona & the Mariposa Grove ──────────────────────
  // Every Wawona-area program is asterisked "*no program Aug 19", the guide
  // window's opening day.
  {
    key: 'wawona-coffee-with-a-ranger',
    source: 'nps',
    category: 'ranger',
    title: 'Coffee with a Ranger',
    description:
      'Coffee, a Q&A session, and general park updates with a ranger at the Pine Tree Market in ' +
      'Wawona. Drop-ins welcome.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SUN], { skip: ['2026-08-19'] }),
    timeStart: '09:00',
    timeEnd: '10:00',
    location: 'Pine Tree Market, Wawona',
    coord: WAWONA,
    isFree: true,
    accessible: true,
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
    dates: buildDailyDates(GUIDE_START, GUIDE_END).filter((d) => d !== '2026-08-19'),
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
      'grove shuttle before the start. On August 22, Junior Ranger Day, this one meets in the grove ' +
      'parking area instead.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END).filter((d) => d !== '2026-08-19'),
    timeStart: '13:30',
    timeEnd: '14:15',
    location: 'Mariposa Grove',
    coord: MARIPOSA_GROVE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'wawona-bear-talk',
    source: 'nps',
    category: 'talk',
    title: 'Bear Talk',
    description:
      'Ranger Jill on Yosemite\'s bears and how to be bear aware on the road, at your cabin, on the ' +
      'trail, and in the wild, at The Redwoods fireside deck in Wawona. Complimentary, kid and pet ' +
      'friendly, open to the public; snacks and soft drinks provided.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED], { skip: ['2026-08-19'] }),
    timeStart: '17:00',
    timeEnd: '17:45',
    location: 'The Redwoods fireside deck, Wawona',
    coord: WAWONA,
    isFree: true,
    accessible: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'wawona-campfire-program',
    source: 'nps',
    category: 'talk',
    // Location-qualified: the guide titles it plain "Campfire Program", and so
    // does Tuolumne's nightly one. Both run nightly, so an unqualified title
    // would put two identical rows on every date of the window.
    title: 'Campfire Program at Wawona',
    description:
      'A nightly campfire program at the Wawona Campground amphitheater; topics vary. Returns this ' +
      'issue after being off the printed schedule in the last one.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END).filter((d) => d !== '2026-08-19'),
    timeStart: '19:00',
    timeEnd: '20:00',
    location: 'Wawona Campground amphitheater',
    coord: WAWONA,
    isFree: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n7: near Crane Flat ──────────────────────────────────
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
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tuolumne-grove-jr-ranger-table',
    source: 'nps',
    category: 'junior-ranger',
    // Qualified alongside the valley table above; see the note there.
    title: 'Jr. Ranger Discovery Table at the Tuolumne Grove',
    description:
      'Drop in any time to talk with a ranger and start or finish earning a Junior Ranger badge. At ' +
      'the Tuolumne Grove Trailhead.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '15:30',
    location: 'Tuolumne Grove Trailhead',
    coord: CRANE_FLAT,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'crane-flat-evening-program',
    source: 'nps',
    category: 'talk',
    title: 'Evening Program',
    description:
      'An evening ranger program at the Crane Flat Campground Amphitheater; topics vary.',
    // Guide v51n7: 6:30 pm (v51n6 ran 7 pm), Su, W, Th, F, Sa, *no program
    // Aug 22 or 23.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, WED, THU, FRI, SAT], {
      skip: ['2026-08-22', '2026-08-23'],
    }),
    timeStart: '18:30',
    timeEnd: '19:30',
    location: 'Crane Flat Campground Amphitheater',
    coord: CRANE_FLAT,
    isFree: true,
    accessible: true,
    familyFriendly: true,
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
    // Guide v51n7: 8 pm (v51n6 ran 8:30), *Sep 3, 5, 7, 9, 10, 12 ONLY.
    dates: [
      '2026-09-03', '2026-09-05', '2026-09-07',
      '2026-09-09', '2026-09-10', '2026-09-12',
    ],
    timeStart: '20:00',
    timeEnd: '21:30',
    location: 'Crane Flat (register at the Big Oak Flat Information Station)',
    coord: CRANE_FLAT,
    isFree: true,
    reservationRequired: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n7: Tuolumne Meadows ─────────────────────────────────
  // Dropped from the printed schedule this issue, so dropped here: the Dog Lake
  // hike, Art in the Meadow, Sunset on the Dome, the Kids' Campfire, and the
  // Parsons Memorial Lodge Summer Series (which ran weekends July 18 - Aug 16).
  {
    key: 'tm-bird-walk',
    source: 'nps',
    category: 'walk',
    title: 'Bird Walk',
    description:
      'An easy morning stroll with a Tuolumne Meadows bird expert; binoculars available. Meets at ' +
      'Lembert Dome parking.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SAT]),
    timeStart: '07:30',
    timeEnd: '10:30',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-coffee-with-a-ranger',
    source: 'nps',
    category: 'ranger',
    // Wawona prints the same title on Su and W; these two never share a date.
    title: 'Coffee with a Ranger',
    description:
      'Drop by the Dana Campfire Circle at the Tuolumne Meadows Campground to chat with a ranger ' +
      'over coffee.',
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [TUE, THU]),
    timeStart: '08:00',
    timeEnd: '10:00',
    location: 'Dana Campfire Circle, Tuolumne Meadows Campground',
    coord: TM_CAMPGROUND,
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
      'climbing community. Drop in at the Tuolumne Meadows Store. Returns to Camp 4 in Yosemite ' +
      'Valley on September 13.',
    // Guide: Su, *until Aug 30.
    dates: buildWeeklyDates(GUIDE_START, '2026-08-30', [SUN]),
    timeStart: '09:00',
    timeEnd: '11:00',
    location: 'Tuolumne Meadows Store',
    coord: LEMBERT_DOME,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'parsons-lodge-open',
    source: 'nps',
    category: 'other',
    title: 'Parsons Memorial Lodge at the Soda Springs',
    description:
      'Meet a ranger at the 1915 stone lodge at Soda Springs and learn the history of Yosemite\'s ' +
      'high country. Daily activities and an open reading room. A 30-minute walk in from parking.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '10:00',
    timeEnd: '16:00',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-botanical-walk',
    source: 'nps',
    category: 'walk',
    // Printed as "Wildflower Walk" in v51n6, "Botanical Walk" here; same day,
    // time, and meeting point.
    title: 'Botanical Walk',
    description:
      'A moderately strenuous high-country walk with a ranger naturalist to find out what the ' +
      'plants are doing, and learn more than names. Meets at Lembert Dome parking.',
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
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [WED, SAT]),
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
    key: 'tm-welcome-talk-noon',
    source: 'nps',
    category: 'talk',
    title: 'Ranger Talk: Welcome to Tuolumne!',
    description:
      'A 15-minute orientation talk at the Tuolumne Meadows Visitor Center parking lot; offered ' +
      'daily at noon and again at 3 p.m.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '12:00',
    timeEnd: '12:15',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    accessible: true,
    familyFriendly: true,
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
    familyFriendly: true,
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
    familyFriendly: true,
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
    // Guide v51n7 prints this on two dates only, not the weekly Friday run of
    // v51n6: "2 pm (2 hrs) Aug 21 & 28 ONLY".
    dates: ['2026-08-21', '2026-08-28'],
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
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-welcome-talk-3pm',
    // Same printed title as tm-welcome-talk-noon; if the NPS feed carries this
    // title on a date, the route's date+title dedupe drops BOTH manual slots
    // and the reader sees the single feed record. Accepted tradeoff. This
    // issue runs the afternoon session daily, where v51n6 ran it weekdays only.
    source: 'nps',
    category: 'talk',
    title: 'Ranger Talk: Welcome to Tuolumne!',
    description:
      'A 15-minute orientation talk at the Tuolumne Meadows Visitor Center parking lot; offered ' +
      'daily at noon and again at 3 p.m.',
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '15:00',
    timeEnd: '15:15',
    location: 'Tuolumne Meadows Visitor Center parking lot',
    coord: TM_VISITOR_CENTER,
    isFree: true,
    accessible: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-campfire-program',
    source: 'nps',
    category: 'talk',
    // Location-qualified for the same reason as the Wawona campfire program:
    // the guide titles both plain "Campfire Program" and both run nightly.
    title: 'Campfire Program at Tuolumne Meadows',
    description:
      'A nightly campfire program at the Dana Campfire Circle, Tuolumne Meadows Campground; ' +
      'different topics each night.',
    // Guide v51n7: 7:30 pm (v51n6 ran 8 pm), nightly, no skip dates.
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Dana Campfire Circle, Tuolumne Meadows Campground',
    coord: TM_CAMPGROUND,
    isFree: true,
    accessible: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tm-campfireside-chat',
    source: 'nps',
    category: 'talk',
    title: 'Campfireside Chat with a Ranger',
    description:
      'An evening chat with a ranger around the fire at Tuolumne Meadows Lodge. The guide runs this ' +
      'only on nights the lodge is open, so check at the visitor center before driving over.',
    // Guide v51n7: 7:30 pm (v51n6 ran 8 pm), M, W, Sa, *only when the Lodge is
    // open. That condition has no published dates, so it is carried in words
    // rather than as a skip list.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, WED, SAT]),
    timeStart: '19:30',
    timeEnd: '20:30',
    location: 'Tuolumne Meadows Lodge',
    coord: TM_LODGE,
    isFree: true,
    accessible: true,
    familyFriendly: true,
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
    // Guide v51n7: 9 pm (v51n6 ran 9:30 pm), M, W, Sa, no skip dates.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [MON, WED, SAT]),
    timeStart: '21:00',
    timeEnd: '22:00',
    location: 'Lembert Dome parking, Tuolumne Meadows',
    coord: LEMBERT_DOME,
    isFree: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'yc-stewardship-tuolumne-overview',
    source: 'conservancy',
    category: 'other',
    title: 'Stewardship Series: Tuolumne Meadows Overview',
    description:
      'A two-hour Yosemite Conservancy Stewardship Series program on the meadow system of Tuolumne ' +
      'and the work of keeping it intact. Registration required at yosemite.org; free for Yosemite ' +
      'Conservancy donors.',
    dates: ['2026-08-21'],
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Tuolumne Meadows',
    coord: TM_VISITOR_CENTER,
    // isFree deliberately unset: free for Yosemite Conservancy donors only; the
    // description carries the condition.
    reservationRequired: true,
    url: YC_URL,
  },

  // ── Yosemite Conservancy Outdoor Adventures (yosemite.org, 2026-07-25 pass) ─
  // Curated from the yosemite.org/event pages for the paid Outdoor Adventures
  // catalog (backpacks, Yosemite Field School, overnight astronomy trips).
  // Direct fetching of yosemite.org was blocked from the curation environment,
  // so every entry below was cross-checked through the search index instead and
  // only kept when the indexed page printed an explicit 2026 date (or a
  // weekday-plus-date pair that exists only in 2026). The index also serves
  // stale prior-year copies of many /event/ pages; everything that could not be
  // pinned to 2026 is listed in the pending block below, not served.
  // Multi-day trips list every calendar day of the trip, matching how this file
  // handles other multi-day events; no meeting-point coords are carried because
  // exact meeting points are given at registration. The 2026-08-17 pass dropped
  // the five trips whose dates had all passed (Yosemite Creek, Treecology,
  // Backpack & Paint, and both Perseids nights).
  {
    key: 'yc-field-school-bighorn-sheep',
    source: 'conservancy',
    category: 'walk',
    title: 'Yosemite Field School: Bighorn Sheep Backpack',
    description:
      'An advanced Yosemite Field School backpack into rugged alpine terrain near Mount Lewis, ' +
      'Mount Gibbs, Mono Pass, and Parker Pass, focused on Sierra Nevada bighorn sheep. Camp opens ' +
      'Thursday afternoon with an evening orientation; the trek runs Friday through Sunday, 4 to 5 ' +
      'miles per day at around 10,500 feet. Paid; register in advance at yosemite.org.',
    dates: ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'],
    location: 'Mono Pass and Parker Pass area, eastern Yosemite',
    isFree: false,
    reservationRequired: true,
    url: 'https://yosemite.org/event/yosemite-field-school-bighorn-sheep-backpack/',
  },
  {
    key: 'yc-backpack-ten-lakes-grant-lake',
    source: 'conservancy',
    category: 'walk',
    title: 'Backpack: Ten Lakes and Grant Lake',
    description:
      'A guided backpacking trip from the Ten Lakes Trailhead on Tioga Road into the Ten Lakes ' +
      'Basin and on to Grant Lake, with a Conservancy naturalist guide. Paid; register in advance ' +
      'at yosemite.org.',
    dates: ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'],
    location: 'Ten Lakes Trailhead, Tioga Road',
    isFree: false,
    reservationRequired: true,
    url: 'https://yosemite.org/event/backpack-ten-lakes-and-grant-lake/',
  },
  {
    key: 'yc-mule-supported-backpack',
    source: 'conservancy',
    category: 'walk',
    title: 'Yosemite Mule-Supported Backpack',
    description:
      'A guided high-country backpack, Thursday through Sunday, with pack mules carrying the heavy ' +
      'gear, opening Yosemite\'s wilderness to hikers who would rather not haul a full pack. Paid; ' +
      'register in advance at yosemite.org.',
    dates: ['2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'],
    isFree: false,
    reservationRequired: true,
    url: 'https://yosemite.org/event/yosemite-mule-supported-backpack/',
  },
  {
    key: 'yc-backpack-eagle-peak',
    source: 'conservancy',
    category: 'walk',
    title: 'Backpack: Yosemite Creek to Eagle Peak',
    description:
      'A three-day guided backpack from Yosemite Creek to Eagle Peak, the highest of the Three ' +
      'Brothers, with sweeping views over Yosemite Valley. Paid; register in advance at ' +
      'yosemite.org.',
    dates: ['2026-09-25', '2026-09-26', '2026-09-27'],
    location: 'Yosemite Creek to Eagle Peak',
    isFree: false,
    reservationRequired: true,
    url: 'https://yosemite.org/event/backpack-yosemite-creek-to-eagle-peak-2/',
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
// in this issue. The v51n7 pass added nothing here: every program printed in
// that issue carries publishable dates and went straight into `entries`.
//
// Still undrafted, awaiting operator confirmation for later in the season:
// - vintners-holidays: partial 2026 dates are visible via participating
//   wineries (e.g. Grgich Hills shows Session 2 Nov 11-14 and Session 3 Nov
//   18-21, 2026) but travelyosemite.com's full session calendar was not
//   directly confirmable. Draft the entry from the operator page when readable.
// - chefs-holidays: the January-to-early-February 2027 session calendar is
//   unannounced as of the 2026-07 passes.
//
// 2026-07-25 Outdoor Adventures pass (yosemite.org): the following /event/
// pages exist in the catalog but their 2026 dates could not be confirmed from
// the curation environment (the search index served stale prior-year copies;
// direct fetch was blocked). Draft each from its live page when readable:
// - overnight-under-the-stars-perseids-trip-1 and -trip-2 (Ostrander Lake
//   Trailhead one-nighters; trip 2 appears to end Aug 14 but not confirmed)
// - overnight-under-the-milky-way series: may-lake / may-lake-2 / -4 / -5,
//   murphy-creek (Lost Bear ran Jun 13-14, 2026, already past)
// - backpack-clouds-rest-one-night (Labor Day weekend; indexed copy shows the
//   2021 dates), backpack-clouds-rest-through-hike-2, backpack-to-clouds-rest-
//   trip-2, womens-backpack-clouds-rest-two-nights, womens-backpack-clouds-
//   rest-sunrise-lakes
// - backpack-to-half-dome-through-hike-via-clouds-rest and -two-nights-via-
//   clouds-rest-trip-2 (indexed copies show 2023/2024 dates)
// - relaxed-backpack-ten-lakes, introduction-to-backpacking-cathedral-lakes,
//   yosemite-mule-supported-backpack has only its Sep 3-6 trip confirmed
// - Yosemite Field School: alpine-immersion, backpack-lyell-glacier /
//   lyell-glacier-backpack, geology-backpack-to-lyell-basin, tuolumne-meadows-
//   geology; a "High Country Wildlife Program" showed Jul 25-26, 2026 in the
//   index but with no stable event URL to carry
// - 2026 art retreats (season confirmed via the Conservancy's announcements,
//   dates unreadable): art-retreat-watercolor-with-zach-polic, art-retreat-
//   fieldsketching-with-watercolor (Dingeldein), art-retreat-oil-painting-
//   with-casey-cheuvront (now titled Watercolor), art-retreat-historic-
//   architecture-of-yosemite (Takahashi), backpack-paint-with-cheyenne-
//   sukalski, workshop-autumn-light-photography
// - day hikes: day-hike-north-dome, day-hike-waterfalls, relaxed-day-hikes-
//   white-wolf-birds-and-blooms (indexed copy shows 2024 dates), day-hike-
//   winter-wonder-in-mariposa-grove
// Confirmed-but-past 2026 trips deliberately not imported: Glen Aulin backpack
// (Jul 2-5), Women's Backpack Glen Aulin (Jul 14-15), Field School High Sierra
// Survivors (Jul 18-19), California Naturalist course (May 26-28 + Jul 21-24),
// Milky Way Lost Bear (Jun 13-14).
//
// Stale-date traps seen during the checks, do not reuse: "Poetry Festival
// August 17-18" is the 2024 festival. The NPS event-details star-party listing
// offering "July 26 & 27, Aug 2 & 3, Aug 9 & 10" matches the 2024/2025
// calendars, not the 2026 Glacier Point weekends (Jul 17 & 18, Jul 31 & Aug 1,
// Aug 7 & 8, Aug 14 & 15, per Yosemite Guide Vol 51 Issue 6). Many yosemite.org
// /event/ pages are indexed as prior-year copies; a weekday-plus-date pair that
// does not exist in the target year is the tell (e.g. "Friday, September 3" is
// 2021, not 2026).
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

// Two DIFFERENT programs may never share a date and a title, because the
// route's dedupe key (routes/programs.ts) is exactly date + normalized title:
// one NPS feed entry matching that key drops every manual entry behind it, so
// a shared title silently deletes the other program from the board. Two
// showings of the SAME program at one place — the noon and 3 pm "Welcome to
// Tuolumne!" talks — are allowed and are why the guard compares locations
// rather than banning the collision outright. The guide prints several
// programs under one name (Campfire Program, Jr. Ranger Discovery Table,
// Coffee with a Ranger, Climber Coffee); location-qualify the title, as those
// entries do, rather than relaxing this.
const normalizeTitle = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const byDateTitle = new Map<string, { key: string; location?: string }>()
for (const entry of parsed) {
  for (const date of entry.dates) {
    const dedupeKey = `${date}|${normalizeTitle(entry.title)}`
    const prior = byDateTitle.get(dedupeKey)
    if (prior && prior.location !== entry.location) {
      throw new Error(
        `manual-programs: ${prior.key} and ${entry.key} share a title on ${date} ` +
          `("${entry.title}") but run in different places — location-qualify one of the titles`,
      )
    }
    if (!prior) byDateTitle.set(dedupeKey, { key: entry.key, location: entry.location })
  }
}

// Version label surfaced in the /api/programs `sources` block so the app can
// show which curation pass the offline copy came from.
export const MANUAL_PROGRAMS_VERSION = '2026-08-18-guide-v51n7'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
