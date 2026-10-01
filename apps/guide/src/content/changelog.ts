// =============================================================================
// EDITION NOTES: what changed in the guide, newest first, in house voice.
//
// The guide changes most weeks (the fact audit, the depth pass, the Guide
// edition turn) and the only thing a buyer used to see was "Updated. Tap to
// refresh." Each line is a fact about the release, written by hand; dates are
// written by hand too, because nothing in the build may read the clock (see
// vite.config.ts). Home shows the newest entry once, Account keeps them all.
// A routine that ships a change a reader would notice adds a line here.
// =============================================================================

import { z } from 'zod'

const ChangelogEntry = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lines: z.array(z.string()).min(1),
})
export type ChangelogEntryT = z.infer<typeof ChangelogEntry>

const seed: ChangelogEntryT[] = [
  {
    date: '2026-09-30',
    lines: [
      'The 3D map pans, turns and tilts far more smoothly, and opens with the mountains already standing instead of rising a moment after the first view.',
      'Switching between 2D and 3D now eases the relief down as the map levels, and back up as it tilts.',
    ],
  },
  {
    date: '2026-09-28',
    lines: [
      'The front page opens on Yosemite right now: the weather, the light (a sun over the horizon, with sunrise, sunset and when the alpenglow begins) and the wait at each entrance, all on one card.',
      'Your trip is one row per day, the four regions are photo cards, and the Secret Guide has a plate of its own with its five sections a tap away.',
      'New colours throughout: cream paper, deep green ink and one rust accent, with a green-black dark mode.',
    ],
  },
  {
    date: '2026-09-27',
    lines: [
      'The map draws every verified day hike on the terrain, coloured by difficulty; tap one for its elevation profile. The search box over the map finds any stop, trail, lot, place to eat or program by name, offline.',
      'Crowded pins no longer pile up. Where they would overlap, the most useful one draws and the rest become small dots; tap a dot or zoom in to open them. In 3D the far pins draw smaller.',
      'Opening a trail, an itinerary or a day keeps the way you have the map turned, and frames it beside the panel instead of under it.',
      'Add an itinerary to your trip from the map: pick it, tap Add to my trip, and it lands on your dates the way it does on the trip board. The My trip filter then shows only your trip, its stops and the trails of its hikes, until you turn it off.',
    ],
  },
  {
    date: '2026-09-25',
    lines: [
      'Plan a day in any region: pick which of your days it is, then add the park’s programs for that date, the hikes that start there with their elevation profiles, and the stops. Everything lands on your trip board.',
      'A day can be half one region and half another. The planner says when to leave, how long the drive is, and when you arrive.',
      'The trip board flags a program you cannot reach in time from the thing before it, and no longer fills a morning in a way that strands one.',
      'The front page asks for your dates first, then lists each day with the regions on it.',
    ],
  },
  {
    date: '2026-09-24',
    lines: [
      'The trip board prices drives from the park’s published driving times: Glacier Point is an hour from the Valley, not fifteen minutes.',
      'Presets and the board know when Tioga Road and Glacier Point Road are usually closed, and say so; stop, hike and region pages read the park’s live road status.',
      'Search finds the Help card, gas, showers, campgrounds, every map place, and the permit and booking dates.',
      'A Saved page for stops, hikes, and places to eat, with the entries you opened last.',
      'Report a wrong hour or a moved turnout from any entry; reports written with no signal send later.',
      'Map pins moved to the points the park and OpenStreetMap agree on, five more live parking lots, and campground seasons for 2026.',
      'Thirty hike corrections from a fact check against the park’s trail pages.',
    ],
  },
  {
    date: '2026-09-22',
    lines: [
      'Fees, hours, and distances checked against the September 23 to November 24 Yosemite Guide.',
      'Hike filters and sort survive a trip to a trail page and back; search remembers what you opened.',
      'New Nature Notes archive notes for Cook’s Meadow, Rainbow View, and Curry Village.',
    ],
  },
  {
    date: '2026-09-19',
    lines: ['“Yosemite, right now” on the front page: entrance waits, today’s light, the forecast, and the roads.'],
  },
]

export const CHANGELOG: ChangelogEntryT[] = z.array(ChangelogEntry).parse(seed)
