// =============================================================================
// SECRET SPOTS — the locked section.
//
// Seeded empty on purpose. The section unlocks itself the moment the first
// spot is added to `seed` below: secret parking turnouts, unsigned trailheads,
// insider notes. Same shape as a Stop minus `region` (these live outside the
// three-region geography). Every coord added here needs a real ground-truth
// pass before launch, same rule as stops.ts.
// =============================================================================

import { z } from 'zod'
import { SecretSpots, type SecretSpotT } from './schema'

type SecretSpotInput = z.input<typeof SecretSpots>[number]

const seed: SecretSpotInput[] = [
  {
    id: 'fern-spring',
    title: 'Fern Spring, the smallest waterfall in the park',
    order: 1,
    kind: 'viewpoint',
    coord: [-119.6657, 37.7167], // TODO: verify (Southside Drive just east of Pohono Bridge)
    elevationFt: 3900,
    timeBudgetMin: 10,
    body:
      'A spring-fed pool at the edge of Southside Drive, just past the Pohono Bridge as you enter the valley, dropping maybe a foot over a mossy stone lip. Locals call it the smallest waterfall in the park, half as a joke and half not. Everyone drives past it: you have just come through the entrance, Tunnel View and Bridalveil are minutes ahead, and a one-foot waterfall does not read as a stop. That is exactly why it works.\n\n' +
      'Go in the morning, when low light comes through the trees and the ferns around the pool are backlit. On any given dawn there is a decent chance the only other person there is a photographer with a tripod, working the long exposures. The pull-off is small and unsigned in any useful way; the tell is the wet rock at the road edge. Ten minutes. It sets the scale for the day: the park does small as well as it does enormous, and almost nobody looks at the small.',
    photos: [],
  },
  {
    id: 'happy-isles-ouzel-watch',
    title: 'The ouzel watch, Merced riffles at Happy Isles',
    order: 2,
    kind: 'viewpoint',
    coord: [-119.5583, 37.7322], // TODO: verify (Happy Isles bridge over the Merced)
    elevationFt: 4035,
    timeBudgetMin: 30,
    body:
      'The water ouzel, officially the American dipper, is a dark, robin-sized bird that walks underwater. It grips the stream bottom with oversized feet and forages for insect larvae in current that would sweep you off yours. The fast, cold, well-oxygenated riffles of the Merced around Happy Isles are exactly its habitat, and the bridges here give you a stable place to stand and scan.\n\n' +
      'How to find one: watch the midstream rocks, not the banks. The giveaway is the dip, a constant knee-bend bobbing the bird does while standing on wet rock. Then it steps off the rock into whitewater and disappears, and 10 to 20 seconds later it pops up somewhere else. Once you have seen the dip you cannot miss it again. The footbridge below Vernal Fall, a short walk up the trail, is another reliable post.\n\n' +
      'Winter is the secret season. Ouzels do not migrate; they stay on the open water all year, and they sing through the cold months when almost no other bird does and almost no other visitor is listening. A gray January morning on an empty riverbank, one bird singing over the riffle, is the kind of thing this section of the guide exists for. Seeing one at all is good news, by the way: ouzels only live in cold, fast, clean water. The bird is the stream\'s health report.',
    photos: [],
  },
  {
    id: 'el-cap-meadow-after-dark',
    title: 'El Capitan Meadow after dark',
    order: 3,
    kind: 'viewpoint',
    coord: [-119.6310, 37.7212], // TODO: verify (same pullout as the daytime El Capitan Meadow stop)
    elevationFt: 4000,
    timeBudgetMin: 30,
    body:
      'You already know this meadow from the daytime stop, watching climbers through binoculars. Come back after full dark. The wall you watched all afternoon is now a black absence against the stars, and scattered across it, a thousand and two thousand feet up, are points of light: the headlamps of climbers settled onto their portaledges for the night. Standard routes take parties three to five days, which means on any summer night there are people cooking dinner and going to sleep on a vertical wall above you.\n\n' +
      'Park at the same Northside Drive pullout, walk a few steps into the meadow, turn your headlamp off, and give your eyes ten minutes. The lights resolve slowly. Some are steady, some move as a climber sorts gear. Twenty to thirty minutes is the right stay: long enough to pick out several camps and register what you are looking at, short enough that you are not standing in a dark meadow past the point of the idea.\n\n' +
      'Two courtesies. Sound carries at night and the people on the wall are trying to sleep, so keep voices down. And do not sweep the wall with a bright light; use a red lamp for your own footing and leave the beam out of the sky.',
    photos: [],
  },
  {
    id: 'olmsted-point-at-night',
    title: 'Olmsted Point at night, the stargazing pullout',
    order: 4,
    kind: 'parking',
    coord: [-119.4884, 37.8096], // TODO: verify (Olmsted Point parking, Tioga Road)
    elevationFt: 8300,
    timeBudgetMin: 45,
    body:
      'The best drive-to dark sky in the park. Olmsted Point sits at 8,300 feet on Tioga Road with broad horizons, almost no nearby light, and, the part that matters at midnight, flat granite slabs right at the parking area to lie back on. No tripod required, no walking required. Park, walk thirty feet, lie down, lamp off, and give your eyes ten full minutes. The Milky Way from up here is not a faint band; it is textured, with visible dark lanes.\n\n' +
      'Timing is most of the trip. The galactic core is up roughly April through October and best from mid-July through mid-August, arching overhead between about 11 p.m. and 3 a.m. The other half of the equation is the moon: a full moon washes the whole show out, so aim for a new moon week or a night when the moon has not yet risen. The full moon dates for your trip window are in the programs list in this guide; plan around them, not just around the weather.\n\n' +
      'Practical notes. Tioga Road is only open roughly late May through October, so this is a summer and fall spot. It is cold at 8,300 feet after dark even in August, colder than you think because you are lying still; bring a real jacket and a hat. Use a red headlamp and keep phone screens down, both for your own night vision and for the photographer who set up an hour before you arrived.',
    photos: [],
    swap:
      'If Tioga Road is closed, Glacier Point is the drive-to alternative on the south side (summer Saturdays often have telescope star parties). Tenaya Lake\'s east beach, ten minutes further up Tioga, trades the granite slabs for the Milky Way reflected in still water.',
  },
  {
    id: 'mcgurk-meadow',
    title: 'McGurk Meadow and the 1890s cabin',
    order: 5,
    kind: 'trailhead',
    coord: [-119.6281, 37.6657], // TODO: verify (roadside pullout on Glacier Point Road)
    elevationFt: 7000,
    timeBudgetMin: 90,
    body:
      'A small pullout on Glacier Point Road, about eight miles up from Chinquapin, with a trailhead sign most drivers never register because they are aimed at Glacier Point. The walk is 1.6 miles round trip, essentially flat, through quiet lodgepole forest to a wet meadow that blooms through June and July: shooting stars, lupine, corn lilies, the full subalpine catalog. In peak wildflower weeks you can have it to yourself while the Glacier Point lot up the road is circling for spaces.\n\n' +
      'Just before the meadow the trail passes an old log cabin from the 1890s, a one-room sheepherder\'s shelter with a door built low. Kids find it fascinating; so do adults who thought they were just going to look at flowers. At the meadow itself, stay on the trail and the boardwalk sections. The ground is saturated most of the season and the plants you came for do not survive footprints.\n\n' +
      'The meadow is not dramatic. There is no granite wall, no waterfall, no view that fits a phone screen. It is gentle, and after two days of the valley\'s scale that is precisely the correction. Budget an hour and a half including the drive-road dawdle, more if the bloom is on.',
    photos: [],
  },
  {
    id: 'tuolumne-grove-old-road',
    title: 'Tuolumne Grove, sequoias down the old road',
    order: 6,
    kind: 'trailhead',
    coord: [-119.8058, 37.7566], // TODO: verify (Tuolumne Grove parking at Crane Flat)
    elevationFt: 6200,
    timeBudgetMin: 120,
    body:
      'Giant sequoias without the Mariposa Grove production: no welcome plaza, no shuttle, no crowd. From the parking lot at Crane Flat, where Tioga Road leaves Big Oak Flat Road, you walk down a mile of the old Big Oak Flat Road itself, the 1874 wagon grade, closed to cars, the same historic road whose lower valley section is a separate day in this guide. The pavement descends about 500 feet through fir forest and delivers you to a couple dozen mature sequoias standing in the drainage.\n\n' +
      'The grove\'s landmark is the Dead Giant, a sequoia snag tunneled for stagecoaches in 1878. You can still walk through it. Look at the living trees while you are down there: the blackened bark scars are not damage in any meaningful sense. Sequoias are built for fire, and the park now runs deliberate restoration burns through this grove because without fire the seedlings never get the bare soil and open light they need. A fire-scarred grove is a functioning one.\n\n' +
      'The catch is the walk out. What was a pleasant mile downhill becomes 500 feet of steady climbing at over 6,000 feet of elevation, and people underestimate it reliably; you will pass them on the way up, stopped and rethinking. It is fine, just honest. Carry water, take it slow, and call the round trip two hours with real time among the trees.',
    photos: [],
    swap:
      'If the Tuolumne Grove lot is full, the Merced Grove trailhead is a few miles west on Big Oak Flat Road: a smaller grove, a similar down-then-up walk, and even fewer people. If you want the full sequoia day with the famous named trees, that is Mariposa Grove, a different trip.',
  },
  {
    id: 'pothole-dome-sunset',
    title: 'Pothole Dome at last light',
    order: 7,
    kind: 'trailhead',
    coord: [-119.3966, 37.8740], // TODO: verify (pullout at the west end of Tuolumne Meadows)
    elevationFt: 8760,
    timeBudgetMin: 45,
    body:
      'The lowest-effort summit in the park. Pothole Dome sits at the west end of Tuolumne Meadows with a pullout right at its base; the round trip is about a mile with 200 feet of gain, and the scramble up the granite takes ten to fifteen minutes. Follow the established path around the meadow edge to the base rather than cutting straight across. The meadow is wet and fragile most of the season, and the detour costs you two minutes.\n\n' +
      'Go for the last hour of the day. From the top, the whole meadow basin spreads east below you toward Lembert Dome and the Cathedral Range, and at sunset the light comes up the meadow lengthwise and turns the grass gold, then amber, then out. Underfoot, the granite itself is part of the show: whole sections are polished to a shine by the glacier that ground over this dome, smooth enough to catch the low sun like wet rock.\n\n' +
      'Bring a headlamp for the walk down; the granite is easy but the light goes fast at 8,700 feet, and the temperature goes with it. If you time it right you descend into a dark meadow with the first stars out and a five-minute walk to the car.',
    photos: [],
  },
  {
    id: 'cathedral-beach-quiet-picnic',
    title: 'Cathedral Beach, the quiet riverbank',
    order: 8,
    kind: 'parking',
    coord: [-119.6188, 37.7189], // TODO: verify (Cathedral Beach picnic area, Southside Drive)
    elevationFt: 3950,
    timeBudgetMin: 60,
    body:
      'A small sandy beach on the Merced, reached from a pullout on Southside Drive at the Cathedral Beach picnic area. The river bends here and the beach faces straight upstream at El Capitan, the full wall head-on, and on calm afternoons the water is still enough to hold the reflection. It is the composition people hike for, sitting thirty feet from a road, and in the middle of a summer day you can sit on this sand for an hour and see nobody. That almost never happens in the valley. It happens here.\n\n' +
      'The picnic tables in the trees make it the best lunch stop on the south side of the river; cooler food at a table with 3,000 feet of granite in front of you beats anything sold in the park. Late afternoon is the light: soft on the wall, calm on the water. Note the beach etiquette on containers, since the park asks for cans or plastic rather than glass on the sandy riverbank, and broken glass in sand is exactly as bad as it sounds.\n\n' +
      'Swimming is real here but seasonal. In May and June the Merced is snowmelt, fast and genuinely cold, and the current is stronger than the surface suggests; stay out. By late July and August the river has dropped and warmed at the edges and a wade or a short swim off the beach is one of the better hours the valley offers.',
    photos: [],
    swap:
      'If the pullout is taken or the beach has company, Sentinel Beach is a mile east on the same road: same river, same picnic setup, Half Dome instead of El Capitan on a calm morning.',
  },
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

export const SECRET_META = {
  title: 'The Secret Spots',
  teaser:
    'The quiet corners: the one-foot waterfall, the night meadow, the empty river beach. The things that do not go in articles. Included with your purchase.',
}

export function secretsLocked(): boolean {
  return SECRET_SPOTS.length === 0
}
