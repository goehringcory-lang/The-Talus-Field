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

// Yosemite Guide Vol 51 Issue 8, valid 2026-09-23 through 2026-11-24.
const GUIDE_START = '2026-09-23'
const GUIDE_END = '2026-11-24'

// Meeting-point coords, [lng, lat]. The first group is reused from stops.ts /
// existing entries (those carry their own verify TODOs); the second group is
// approximate, good enough for the trip planner's travel-buffer math, and
// should be tightened on a coord verification pass.
const AHWAHNEE: [number, number] = [-119.5747, 37.7458]          // ahwahnee-hotel stop
const CURRY_VILLAGE: [number, number] = [-119.5688, 37.7395]     // curry-village stop
const VALLEY_LODGE: [number, number] = [-119.5989, 37.7439]      // existing valley-floor-tour entry
const HAPPY_ISLES: [number, number] = [-119.5594, 37.7338]       // mist-trail stop (Happy Isles)
const MARIPOSA_GROVE: [number, number] = [-119.6083, 37.5108]    // mariposa-grove stop (arrival area)
const WAWONA: [number, number] = [-119.6580, 37.5370]            // wawona area; market/campground within ~2 km
const CRANE_FLAT: [number, number] = [-119.7973, 37.7551]        // Crane Flat junction; Tuolumne Grove TH ~1 km north
const CAMP_4: [number, number] = [-119.6029, 37.7421]            // camp-4 stop (carries its own verify TODO)
const EL_CAP_BRIDGE: [number, number] = [-119.6315, 37.7240]     // el-capitan-bridge pin in points.geojson
// Approximate; verify on a coord pass:
const VILLAGE_MALL: [number, number] = [-119.5855, 37.7485]      // Welcome Center / museum / theater / gallery cluster
const HODGDON_MEADOW: [number, number] = [-119.8660, 37.7996]    // Hodgdon Meadow Campground, near Big Oak Flat Entrance

const NPS_GUIDE_URL = 'https://www.nps.gov/yose/planyourvisit/guide.htm'
const YH_TOURS_URL = 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/'
const YH_URL = 'https://www.travelyosemite.com/things-to-do/'
const YC_ART_URL = 'https://yosemite.org/art'
const YC_URL = 'https://yosemite.org/experience/'
const YC_ADVENTURES_URL = 'https://yosemite.org/adventures'
const TAAG_URL = 'https://www.anseladams.com/photography-education/'

// ── Confirmed entries only ───────────────────────────────────────────────────
// Standing non-guide entries verified on the 2026-07-02 / 2026-07-03 passes:
// the Valley Floor Tour's daily year-round operation (travelyosemite.com), the
// Yosemite Facelift 2026 dates (Yosemite Climbing Association's registration
// page), and the 2026 Bracebridge Dinner performances (travelyosemite.com).
//
// Guide pass 2026-09-22: recurated the full printed program schedule from the
// Yosemite Guide Vol 51 Issue 8 (valid September 23 – November 24, 2026), the
// successor to the v51n7 (August 19 – September 22) issue this file previously
// carried. As on every issue turn, the outgoing window's entries are replaced
// rather than accumulated: every entry whose dates had all passed and which
// this issue does not reprint is deleted, so the file stays the size of one
// season.
//
// Changes this issue vs the last. This is the fall issue, and the schedule
// shrinks and staggers: nearly every row now carries its own end date, and the
// file encodes each one rather than running to GUIDE_END. Tuolumne prints no
// schedule at all ("check listings at the visitor center" until it closes Sep
// 27), so all 21 Tuolumne entries are gone, as are the Mountaineering School
// hikes (no schedule printed, school open until Oct 25), Wild About Bears, the
// Family Ranger Talk, Wee Wild Ones, the Curry movie nights, Paint & Sip, the
// Mariposa Grove Jr. Ranger talk, Wawona's bear talk and campfire program, the
// Sierra Club evening programs (the Heritage Center closes Sep 27), and the
// Glacier Point Starry Skies nights.
//
// New this issue: Wild Wonders: Yosemite Valley Walk (M–Sa 9:30 from the Lodge
// amphitheater), The Living Landscape (daily 1 pm, then M/Th/Sa from Nov 2),
// Yosemite Nature in a Nutshell (the retitled 2 pm family talk), Yosemite
// Shorts and Stories (twelve printed October dates), Walking Starry Skies,
// the Hodgdon Meadow evening program (four October dates), the volunteer
// litter pick-up (Sep 24–26), the fall art-class instructors, the Peace of
// Place and Earth is Home II exhibitions with their two artist receptions, and
// the Conservancy's "Little Fires Everywhere" stewardship program (Oct 23).
// The valley evening program leaves the Curry amphitheater after Sep 26 and
// comes back to the Lodge Cliff Room at 7 pm from Nov 1, so the two carry
// location-qualified titles.
//
// Retimed: the Ranger Walk moves from daily 9 am to Su/M/F 10 am; the valley
// Jr. Ranger Discovery Table to Tu/W/Th/Sa 10 am; Yosemite After Dark to
// 7:30 pm; Explore Yosemite's Night Sky to F/Sa 8 pm; the Sunset Walk to F/Sa
// 5 pm (its start "varies after Oct 10", carried in the description rather
// than guessed); the Tuolumne Grove Jr. Ranger table to 10 am – noon and the
// Giant Sequoia Hike to 1 pm. The Moonlight Tour runs Sep 23–26 "8:30 or 9 pm";
// it is carried at 8:30 with the choice in words.
//
// Marks. `accessible` / `familyFriendly` are read off the issue's Programs
// pages (8 and 9) row by row: the wheelchair symbol and the "Recommended for
// Families" symbol only. The Junior Ranger symbol stays a category, as in the
// v51n7 symbol pass; the Evening Program moon is the start time.
//
// Deliberately NOT curated as programs, because the issue prints them as
// services rather than scheduled programs: bike rentals, golf, the ice rink
// (opens Nov 13, if conditions allow), the Mountaineering School's unscheduled
// hikes, and the chapel services. The fall service closures this issue
// announces live in the PWA's seasonal almanac and the /now bulletin.
const entries: ManualEntryT[] = [
  {
    key: 'aramark-valley-floor-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Valley Floor Tour (Yosemite Hospitality)',
    description:
      'The two-hour open-air tram (or heated coach, off-season) loop of the valley floor with a ' +
      'naturalist or park ranger. Departs Yosemite Valley Lodge daily; this fall at 10 and 11 a.m., ' +
      '1 and 2 p.m., and from November 1 at 10 a.m. and 1 p.m. only. Paid; book at ' +
      'travelyosemite.com or 888/413-8869. Dates here mark availability, not a single departure time.',
    // Verified 2026-07-02: travelyosemite.com lists the tour as departing
    // daily, year-round (tram in warm months, heated coach off-season).
    // 2026-09-22: Yosemite Guide Vol 51 Issue 8 prints 10 am, 11 am, 1 pm, and
    // 2 pm daily, "10 am & 1 pm ONLY starting Nov 1", both marks.
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

  // ── Yosemite Guide v51n8: Yosemite Valley walks, talks & hikes ─────────────
  {
    key: 'valley-climber-coffee',
    source: 'nps',
    category: 'other',
    title: 'Climber Coffee',
    description:
      'Coffee with NPS climbing rangers: climbing management, preventative search and rescue, and ' +
      'news from the climbing community. Meet at Camp 4, near the Midnight Lightning boulder. Free, drop-in.',
    // Guide v51n8: 9 – 11 am, Su, *until Oct 25.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-25', [SUN]),
    timeStart: '09:00',
    timeEnd: '11:00',
    location: 'Camp 4, near the Midnight Lightning boulder',
    coord: CAMP_4,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-wild-wonders-walk',
    source: 'nps',
    category: 'walk',
    title: 'Wild Wonders: Yosemite Valley Walk',
    description:
      'A leisurely guided walk through the valley\'s ecosystems and landmarks: geology, plants, and ' +
      'animals on foot. Meet at the Yosemite Valley Lodge amphitheater. Free, drop-in.',
    // Guide v51n8: 9:30 am (1 – 1.5 hrs), M – Sa, *until Oct 30.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-30', [MON, TUE, WED, THU, FRI, SAT]),
    timeStart: '09:30',
    timeEnd: '11:00',
    location: 'Yosemite Valley Lodge amphitheater',
    coord: VALLEY_LODGE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-jr-ranger-discovery-table',
    source: 'nps',
    category: 'junior-ranger',
    // Location-qualified: the guide prints a second Jr. Ranger Discovery Table
    // at the Tuolumne Grove trailhead on the same days.
    title: 'Jr. Ranger Discovery Table at the Welcome Center',
    description:
      'Drop in any time for a hands-on activity with a ranger about what makes Yosemite special. ' +
      'In front of the Yosemite Valley Welcome Center (shuttle stop 2). Free.',
    // Guide v51n8: 10 – 11 am, Tu, W, Th, Sa, *until Oct 31.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-31', [TUE, WED, THU, SAT]),
    timeStart: '10:00',
    timeEnd: '11:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
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
      'A moderately paced naturalist walk with a park ranger on the valley\'s ecosystems, geology, ' +
      'or wildlife. Meets in front of the Yosemite Valley Welcome Center (shuttle stop 2). Free, drop-in.',
    // Guide v51n8: 10 am (1 hr), Su, M, F, *until Oct 30.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-30', [SUN, MON, FRI]),
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
      'the museum in Yosemite Village (shuttle stop 5). Free, drop-in.',
    // Guide v51n8: 10:30 am (1 hr), Tu, W, Th, Sa, no end date.
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
      'of big-wall climbing. El Capitan Meadow, west side of El Capitan bridge; shuttle stop 9 is ' +
      'closed during the bridge work. Free, drop-in.',
    // Guide v51n8: 12:30 – 4:30 pm, daily, *until Oct 30.
    dates: buildDailyDates(GUIDE_START, '2026-10-30'),
    timeStart: '12:30',
    timeEnd: '16:30',
    location: 'El Capitan Meadow, west side of El Capitan bridge',
    coord: EL_CAP_BRIDGE,
    isFree: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-living-landscape',
    source: 'nps',
    category: 'talk',
    title: 'The Living Landscape',
    description:
      'An hour with a ranger on what makes Yosemite unique. Meets in front of the Yosemite Valley ' +
      'Welcome Center (shuttle stop 2). Free, drop-in.',
    // Guide v51n8: 1 pm (1 hr), daily until Nov 1, *M, Th, Sa ONLY starting Nov 2.
    dates: [
      ...buildDailyDates(GUIDE_START, '2026-11-01'),
      ...buildWeeklyDates('2026-11-02', GUIDE_END, [MON, THU, SAT]),
    ],
    timeStart: '13:00',
    timeEnd: '14:00',
    location: 'Yosemite Valley Welcome Center (shuttle stop 2)',
    coord: VILLAGE_MALL,
    isFree: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'valley-nature-in-a-nutshell',
    source: 'nps',
    category: 'kids',
    title: 'Yosemite Nature in a Nutshell',
    description:
      'Fifteen minutes on a different family-friendly topic each day: animals, rocks, trees, ' +
      'storytelling. In front of the Yosemite Valley Welcome Center (shuttle stop 2). Free, drop-in.',
    // Guide v51n8: 2 pm (15 min), daily.
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
      'A complimentary one-hour tour of the history behind Yosemite\'s grand hotel. Meet at The ' +
      'Ahwahnee flagpole (shuttle stop 3). Free, drop-in.',
    // Guide v51n8: 2 pm (1 hr), daily.
    dates: buildDailyDates(GUIDE_START, GUIDE_END),
    timeStart: '14:00',
    timeEnd: '15:00',
    location: 'The Ahwahnee flagpole (shuttle stop 3)',
    coord: AHWAHNEE,
    isFree: true,
    accessible: true,
    url: YH_URL,
  },
  {
    key: 'ahwahnee-nature-walk',
    source: 'aramark',
    category: 'walk',
    title: 'Guided Nature Walk',
    description:
      'An easy guided walk of Yosemite\'s natural areas with a naturalist. Meet on The Ahwahnee\'s ' +
      'back lawn (shuttle stop 3). Free, drop-in.',
    // Guide v51n8: 3:30 pm (1 hr), daily, *no program Oct 2.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU, FRI, SAT], {
      skip: ['2026-10-02'],
    }),
    timeStart: '15:30',
    timeEnd: '16:30',
    location: 'The Ahwahnee back lawn (shuttle stop 3)',
    coord: AHWAHNEE,
    isFree: true,
    url: YH_URL,
  },
  {
    key: 'valley-shorts-and-stories',
    source: 'nps',
    category: 'talk',
    title: 'Yosemite Shorts and Stories',
    description:
      'Short films, presentations, and performances by National Park Service staff, 45 minutes. ' +
      'In the auditorium behind the Exploration Center (shuttle stop 5 or Yosemite Village parking). Free.',
    // Guide v51n8: 4:30 pm (45 min), "Program available Oct 5, 6, 7, 12, 13,
    // 16, 17, 23, 26, 27, 28, 30".
    dates: [
      '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-12', '2026-10-13', '2026-10-16',
      '2026-10-17', '2026-10-23', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-30',
    ],
    timeStart: '16:30',
    timeEnd: '17:15',
    location: 'Auditorium behind the Yosemite Exploration Center',
    coord: VILLAGE_MALL,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'yc-valley-sunset-walk',
    source: 'conservancy',
    category: 'walk',
    title: 'Yosemite Valley Sunset Walk',
    description:
      'A casual walk with a Conservancy naturalist while the setting sun lights the granite, with ' +
      'the natural and cultural history of the park. Start time varies after October 10; check the ' +
      'booking page. Paid; register in advance at yosemite.org/adventures.',
    // Guide v51n8: 5 pm* (1.5 hrs), F & Sa, *start time varies after Oct 10.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI, SAT]),
    timeStart: '17:00',
    timeEnd: '18:30',
    location: 'Yosemite Valley (meeting point at registration)',
    isFree: false,
    reservationRequired: true,
    familyFriendly: true,
    url: YC_ADVENTURES_URL,
  },
  {
    key: 'lodge-evening-program',
    source: 'aramark',
    category: 'talk',
    title: 'Evening Program at Yosemite Valley Lodge',
    description:
      'Yosemite naturalists present a different topic each night, half an hour. In the Yosemite ' +
      'Valley Lodge Cliff Room, between the gift shop and the lounge. Free, drop-in.',
    // Guide v51n8: 7 pm (30 min), Su, W, Th, F, Sa, *starting Nov 1, *no program Nov 11.
    dates: buildWeeklyDates('2026-11-01', GUIDE_END, [SUN, WED, THU, FRI, SAT], {
      skip: ['2026-11-11'],
    }),
    timeStart: '19:00',
    timeEnd: '19:30',
    location: 'Yosemite Valley Lodge Cliff Room',
    coord: VALLEY_LODGE,
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
    // Guide v51n8: 7:30 pm (1.5 hrs), nightly, *no program Oct 2.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU, FRI, SAT], {
      skip: ['2026-10-02'],
    }),
    timeStart: '19:30',
    timeEnd: '21:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_URL,
  },
  {
    key: 'curry-evening-program',
    source: 'aramark',
    category: 'talk',
    title: 'Evening Program at Curry Village',
    description:
      'Yosemite naturalists present a different topic each night, half an hour. Curry Village ' +
      'Amphitheater (shuttle stops 14 and 19). Free, drop-in. The last nights of the season here.',
    // Guide v51n8: 8 pm (30 min), nightly, *until Sep 26.
    dates: buildDailyDates(GUIDE_START, '2026-09-26'),
    timeStart: '20:00',
    timeEnd: '20:30',
    location: 'Curry Village Amphitheater',
    coord: CURRY_VILLAGE,
    isFree: true,
    accessible: true,
    url: YH_URL,
  },
  {
    key: 'walking-starry-skies',
    source: 'aramark',
    category: 'astronomy',
    title: 'Walking Starry Skies',
    description:
      'An hour of stargazing on foot with a Yosemite Hospitality guide; recommended for ages 11 ' +
      'and up. Paid; book at travelyosemite.com or the Yosemite Valley Lodge front desk.',
    // Guide v51n8: 8 pm (1 hr), Su, M, Tu, W, Th, *no program Nov 9 or 10.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [SUN, MON, TUE, WED, THU], {
      skip: ['2026-11-09', '2026-11-10'],
    }),
    timeStart: '20:00',
    timeEnd: '21:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    familyFriendly: true,
    url: YH_URL,
  },
  {
    key: 'yc-night-sky',
    source: 'conservancy',
    category: 'astronomy',
    title: 'Explore Yosemite\'s Night Sky',
    description:
      'Guided stargazing with a Conservancy naturalist: star science, constellations, cultural ' +
      'stories, and mythology, pointed out by laser (no telescopes). Start time varies after ' +
      'October 10. Paid; register at yosemite.org/adventures.',
    // Guide v51n8: 8 pm* (1.5 hrs), F & Sa, *start time varies after Oct 10.
    dates: buildWeeklyDates(GUIDE_START, GUIDE_END, [FRI, SAT]),
    timeStart: '20:00',
    timeEnd: '21:30',
    location: 'Yosemite Valley (meeting point at registration)',
    isFree: false,
    reservationRequired: true,
    url: YC_ADVENTURES_URL,
  },

  // ── Yosemite Guide v51n8: bus & tram tours, volunteering ───────────────────
  {
    key: 'aramark-glacier-point-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Glacier Point Tour',
    description:
      'The four-hour bus tour from Yosemite Valley up to Glacier Point, a 3,200-foot elevation ' +
      'gain. Departs Yosemite Valley Lodge daily at 8:30 a.m. and 1:30 p.m. through October 11; ' +
      'one-way tickets for hikers available (drop-off only, no pickup at Glacier Point). Paid; book ' +
      'at travelyosemite.com or 888/413-8869. Dates here mark availability, not a single departure time.',
    // Guide v51n8: 8:30 am & 1:30 pm (4 hrs), daily, *until Oct 11, both marks.
    dates: buildDailyDates(GUIDE_START, '2026-10-11'),
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_TOURS_URL,
  },
  {
    key: 'aramark-grand-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Yosemite Grand Tour',
    description:
      'The full-day tour: Yosemite Valley, Glacier Point, and the Mariposa Grove of Giant Sequoias, ' +
      'lunch included. Departs Yosemite Valley Lodge at 8 a.m. through October 11. Paid; book at ' +
      'travelyosemite.com or 888/413-8869.',
    // Guide v51n8: 8 am (8 hrs), daily, *until Oct 11, both marks.
    dates: buildDailyDates(GUIDE_START, '2026-10-11'),
    timeStart: '08:00',
    timeEnd: '16:00',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_TOURS_URL,
  },
  {
    key: 'aramark-moonlight-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Moonlight Tour',
    description:
      'A two-hour open-air tram tour of Yosemite Valley under the moon with a Yosemite Hospitality ' +
      'naturalist, departing 8:30 or 9 p.m. depending on the night. Paid; book at ' +
      'travelyosemite.com or the Yosemite Valley Lodge front desk.',
    // Guide v51n8: Sep 23, 24, 25, 26, "8:30 or 9 pm" (2 hrs), both marks.
    dates: ['2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26'],
    timeStart: '20:30',
    location: 'Yosemite Valley Lodge',
    coord: VALLEY_LODGE,
    isFree: false,
    reservationRequired: true,
    accessible: true,
    familyFriendly: true,
    url: YH_TOURS_URL,
  },
  {
    key: 'valley-litter-pick-up',
    source: 'nps',
    category: 'other',
    title: 'Volunteer Guided Litter Pick Up',
    description:
      'A two-hour volunteer-led walk around the valley picking up litter after the busy season. ' +
      'Meet in front of the Exploration Center; register in person at 1 p.m. Families welcome.',
    // Guide v51n8 drop-in volunteering: Sep 24, 25, 26, 1 pm (2 hrs), both marks.
    dates: ['2026-09-24', '2026-09-25', '2026-09-26'],
    timeStart: '13:00',
    timeEnd: '15:00',
    location: 'In front of the Yosemite Exploration Center',
    coord: VILLAGE_MALL,
    isFree: true,
    accessible: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n8: The Ansel Adams Gallery ──────────────────────────
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
    title: 'In the Field: Creative Smartphone Photography (Wednesday)',
    description:
      'Three hours with a staff photographer on making better photographs with the camera you always ' +
      'carry. Paid; register at anseladams.com.',
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
    title: 'In the Field: Creative Smartphone Photography (Saturday)',
    description:
      'Three hours with a staff photographer on making better photographs with the camera you always ' +
      'carry. Paid; register at anseladams.com.',
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
      'A four-hour field class around Yosemite Valley with a staff photographer. Paid; register at ' +
      'anseladams.com.',
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
      'A four-hour field class with a staff photographer on making better photographs with a DSLR. ' +
      'Paid; register at anseladams.com.',
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
    title: 'Trails and Trees of California: Woodblocks and Prints by Tom Killion',
    description:
      'The last days of Tom Killion\'s woodblock prints at The Ansel Adams Gallery in Yosemite ' +
      'Village, open 9 a.m. to 5 p.m. Free to walk through.',
    // Guide v51n8 park-partner page: August 8 - September 26, 2026.
    dates: buildDailyDates(GUIDE_START, '2026-09-26'),
    timeStart: '09:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-peace-of-place-exhibit',
    source: 'manual',
    category: 'arts',
    title: 'Peace of Place (The Ansel Adams Gallery)',
    description:
      'Photographs by Alan Ross, John Sexton, Anne Larsen, Roman Loranc, Bob Kolbrener, and Jeffrey ' +
      'Conley at The Ansel Adams Gallery in Yosemite Village. The gallery is open 9 a.m. to 5 p.m. ' +
      'through September 30 and 10 a.m. to 5 p.m. from October 1. Free to walk through.',
    // Guide v51n8: September 27 – November 7.
    dates: buildDailyDates('2026-09-27', '2026-11-07'),
    timeStart: '10:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-peace-of-place-reception',
    source: 'manual',
    category: 'arts',
    title: 'Peace of Place: artist reception',
    description: 'The artist reception for the Peace of Place exhibition at The Ansel Adams Gallery. Free.',
    // Guide v51n8: Artist Reception Sat, October 10 from 1 – 3 pm.
    dates: ['2026-10-10'],
    timeStart: '13:00',
    timeEnd: '15:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-earth-is-home-exhibit',
    source: 'manual',
    category: 'arts',
    title: 'Earth is Home II: A World of Color, Photographs by Kerik Kouklis',
    description:
      'Kerik Kouklis\'s photographs at The Ansel Adams Gallery in Yosemite Village, 10 a.m. to 5 p.m., ' +
      'running through January 9, 2027. Free to walk through.',
    // Guide v51n8: November 8 – January 9, 2027. Carried to GUIDE_END only;
    // the next issue extends it.
    dates: buildDailyDates('2026-11-08', GUIDE_END),
    timeStart: '10:00',
    timeEnd: '17:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },
  {
    key: 'taag-earth-is-home-reception',
    source: 'manual',
    category: 'arts',
    title: 'Earth is Home II: artist reception',
    description: 'The artist reception with Kerik Kouklis at The Ansel Adams Gallery. Free.',
    // Guide v51n8: Artist Reception Sat, November 14 from 1 – 3 pm.
    dates: ['2026-11-14'],
    timeStart: '13:00',
    timeEnd: '15:00',
    location: 'The Ansel Adams Gallery, Yosemite Village',
    coord: VILLAGE_MALL,
    isFree: true,
    url: TAAG_URL,
  },

  // ── Yosemite Guide v51n8: Yosemite Conservancy art & stewardship ───────────
  // Art classes: 9 am (4 hrs), weekdays, *until Oct 16; weekly instructors
  // from the park-partner column. Sep 21-25 started before this issue, so
  // that week is carried from GUIDE_START.
  {
    key: 'yc-art-class-journaling-butterfield',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor Nature Journaling',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'nature journaling with Elizabeth Butterfield. Meets at the Happy Isles Art and Nature Center ' +
      '(shuttle stop 16). Paid; register in advance at yosemite.org/art.',
    dates: buildWeeklyDates(GUIDE_START, '2026-09-25', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-gouache-harris',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Gouache',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: gouache with ' +
      'Lori Harris. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; register ' +
      'in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-09-28', '2026-10-02', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor-polic',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Zach Polic. Meets at the Happy Isles Art and Nature Center (shuttle stop 16). Paid; ' +
      'register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-10-05', '2026-10-09', [MON, TUE, WED, THU, FRI]),
    timeStart: '09:00',
    timeEnd: '13:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: false,
    reservationRequired: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-art-class-watercolor-tilstra',
    source: 'conservancy',
    category: 'arts',
    title: 'Art Class: Watercolor',
    description:
      'Slow down and connect with nature through art; beginners welcome. This week: watercolor ' +
      'with Dan Tilstra, the last class of the season. Meets at the Happy Isles Art and Nature ' +
      'Center (shuttle stop 16). Paid; register in advance at yosemite.org/art.',
    dates: buildWeeklyDates('2026-10-12', '2026-10-16', [MON, TUE, WED, THU, FRI]),
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
      'Free art activities for kids at the Happy Isles Art and Nature Center (shuttle stop 16). Drop ' +
      'in any time during studio hours.',
    // Guide v51n8: 10 am – 3 pm, weekdays, *until Oct 16.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-16', [MON, TUE, WED, THU, FRI]),
    timeStart: '10:00',
    timeEnd: '15:00',
    location: 'Happy Isles Art and Nature Center (shuttle stop 16)',
    coord: HAPPY_ISLES,
    isFree: true,
    accessible: true,
    url: YC_ART_URL,
  },
  {
    key: 'yc-stewardship-fire-ecology',
    source: 'conservancy',
    category: 'other',
    title: 'Stewardship Series: Little Fires Everywhere: Fire Ecology',
    description:
      'A two-hour Yosemite Conservancy Stewardship Series program on fire ecology. Registration ' +
      'required at yosemite.org, where the meeting place is given; free for Yosemite Conservancy donors.',
    // Guide v51n8 park-partner column: Oct 23, 2 – 4 pm. No location printed,
    // so no coord.
    dates: ['2026-10-23'],
    timeStart: '14:00',
    timeEnd: '16:00',
    // isFree deliberately unset: free for Yosemite Conservancy donors only.
    reservationRequired: true,
    url: YC_URL,
  },

  // ── Yosemite Guide v51n8: Wawona & the Mariposa Grove ──────────────────────
  {
    key: 'wawona-coffee-with-a-ranger',
    source: 'nps',
    category: 'talk',
    title: 'Coffee with a Ranger',
    description:
      'Coffee, a Q&A, and general park updates with a ranger at the Pine Tree Market in Wawona. ' +
      'Drop-ins welcome.',
    // Guide v51n8: 9 am (1 hr), Su & W, *until Oct 17.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-17', [SUN, WED]),
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
    title: 'Nature Walk: Mariposa Grove',
    description:
      'A ranger-led nature walk from the Mariposa Grove Arrival Area. Allow time to park and ride ' +
      'the free shuttle up to the grove before the program starts.',
    // Guide v51n8: 9:30 am (1.5 hrs), daily, *until Oct 17.
    dates: buildDailyDates(GUIDE_START, '2026-10-17'),
    timeStart: '09:30',
    timeEnd: '11:00',
    location: 'Mariposa Grove Arrival Area',
    coord: MARIPOSA_GROVE,
    isFree: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Guide v51n8: near Crane Flat ──────────────────────────────────
  {
    key: 'tuolumne-grove-jr-ranger-table',
    source: 'nps',
    category: 'junior-ranger',
    title: 'Jr. Ranger Discovery Table at the Tuolumne Grove',
    description:
      'Drop in to talk with a ranger and start or finish a Junior Ranger badge, at the Tuolumne ' +
      'Grove trailhead on Tioga Road.',
    // Guide v51n8: 10 am – 12 pm, daily, *until Nov 1, *no program Oct 9.
    dates: buildWeeklyDates(GUIDE_START, '2026-11-01', [SUN, MON, TUE, WED, THU, FRI, SAT], {
      skip: ['2026-10-09'],
    }),
    timeStart: '10:00',
    timeEnd: '12:00',
    location: 'Tuolumne Grove Trailhead',
    coord: CRANE_FLAT,
    isFree: true,
    accessible: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'tuolumne-grove-sequoia-hike',
    source: 'nps',
    category: 'walk',
    title: 'Giant Sequoia Hike',
    description:
      'A ranger-led hike into the Tuolumne Grove: 2.5 miles round trip with 500 feet of elevation ' +
      'change, and the climb comes on the way back. Meet at the Tuolumne Grove Trailhead. Bring water.',
    // Guide v51n8: 1 pm (1.5 hrs), M, W, Th, *until Nov 1, *no program Sep 30 or Oct 12.
    dates: buildWeeklyDates(GUIDE_START, '2026-11-01', [MON, WED, THU], {
      skip: ['2026-09-30', '2026-10-12'],
    }),
    timeStart: '13:00',
    timeEnd: '14:30',
    location: 'Tuolumne Grove Trailhead',
    coord: CRANE_FLAT,
    isFree: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },
  {
    key: 'crane-flat-evening-program',
    source: 'nps',
    category: 'talk',
    title: 'Crane Flat Evening Program',
    description: 'An hour-long evening program at the Crane Flat Campground Amphitheater; topics vary.',
    // Guide v51n8: 6:30 pm (1 hr), Su, W, Th, F, Sa, *until Oct 9.
    dates: buildWeeklyDates(GUIDE_START, '2026-10-09', [SUN, WED, THU, FRI, SAT]),
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
    key: 'hodgdon-meadow-evening-program',
    source: 'nps',
    category: 'talk',
    title: 'Hodgdon Meadow Evening Program',
    description:
      'An hour-long evening program at the Hodgdon Meadow Campground Amphitheater, near the group ' +
      'sites; topics vary.',
    // Guide v51n8: 6:30 pm (1 hr), *Oct 16, 17, 23, 24 ONLY.
    dates: ['2026-10-16', '2026-10-17', '2026-10-23', '2026-10-24'],
    timeStart: '18:30',
    timeEnd: '19:30',
    location: 'Hodgdon Meadow Campground Amphitheater',
    coord: HODGDON_MEADOW,
    isFree: true,
    familyFriendly: true,
    url: NPS_GUIDE_URL,
  },

  // ── Yosemite Conservancy Outdoor Adventures (yosemite.org, 2026-07-25 pass) ─
  // Curated from the yosemite.org/event pages for the paid Outdoor Adventures
  // catalog. Only trips pinned to an explicit 2026 date are served; see the
  // pending block below. The 2026-09-22 pass dropped the three trips whose
  // dates had all passed (Bighorn Sheep, Ten Lakes and Grant Lake, the
  // mule-supported backpack).
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
// in this issue. The v51n7 and v51n8 passes added nothing here: every program
// printed in those issues carries publishable dates and went straight into
// `entries`.
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
export const MANUAL_PROGRAMS_VERSION = '2026-09-22-guide-v51n8'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
