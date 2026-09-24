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
