# Field Guide photo shot list

The ten entries that still render `PhotoPlaceholder` ("Photo coming") in the
PWA. Every one of them has been through the Commons acquisition pipeline
(`fetch-guide-photos.mjs`, category-sourced since July 2026) and come back with
either nothing or the wrong subject, so they need original photography.

Why these ten and not others: Commons is encyclopedic, and it covers
landmarks. It does not cover an unsigned turnout on Evergreen Road, a swimming
hole on the 120, or a barn loop in Foresta. Two of them are worse than
uncovered, they are actively mis-covered, because the name collides with
something famous elsewhere (see Ostrander and Hidden Lake below).

## How to shoot and file

Drop finished frames into the gitignored `photo-inbox/guide/`, named exactly as
the **File** column says, then run one command:

```bash
npm --prefix scripts run photos:ingest
```

That applies EXIF orientation, downscales, re-encodes as mozjpeg with all
metadata stripped (the GPS fix included, which matters because
`apps/guide/public/photos/` deploys wholesale), generates the responsive
variants, records an "All rights reserved" credit, and prints the `stops.ts`
snippet to paste.

Four rules the ingest enforces, each for a reason that has already bitten:

- **Shoot JPEG, not HEIC.** iPhone: Settings > Camera > Formats > "Most
  Compatible". sharp's prebuilt libvips has no HEVC decoder, and the failure is
  silent until the pixel decode.
- **Name the file yourself.** `IMG_4823` is rejected. The filename becomes the
  permanent URL and the reference in `stops.ts`.
- **Landscape orientation.** Every card, deck panel, and teaser crops to 4:3 or
  2:1. A vertical frame loses its top and bottom.
- **A filename that already exists is an error** without `--replace`. `/photos/*`
  is served `immutable, max-age=2592000`, so reusing a name means up to 30 days
  of the old picture.

Aim for at least 1600 px on the long edge. The generator writes a 400/800/1200/
1600 ladder and never enlarges.

## The ten

| Entry | File | Coordinate |
|---|---|---|
| Snow Creek Trail | `snow-creek-trail.jpg` | -119.5375, 37.7560 |
| Three Chutes Falls | `three-chutes-falls.jpg` | -119.5299, 37.7594 |
| Ostrander Lake | `ostrander-lake.jpg` | -119.6039, 37.6668 |
| Carlon Falls | `carlon-falls.jpg` | -119.8590, 37.8125 |
| Poopenaut Valley | `poopenaut-valley.jpg` | -119.8037, 37.9182 |
| Rainbow Pool | `rainbow-pool.jpg` | -119.8780, 37.8137 |
| El Cap Meadow after dark | `el-cap-meadow-after-dark.jpg` | -119.6354, 37.7238 |
| Foresta barns loop | `foresta-barns-loop.jpg` | -119.7507, 37.7025 |
| Little Nellie Falls | `little-nellie-falls.jpg` | -119.7827, 37.7205 |
| Hidden Lake | `hidden-lake.jpg` | -119.4959, 37.8054 |

Coordinates marked `TODO: verify on the ground` in the seed files are listed
above as-is. If a coordinate lands you somewhere other than the described spot,
that is a finding worth more than the photo: correct the `coord` line and drop
the note in the same commit.

---

### Snow Creek Trail
*Strenuous, ~6 h. Trailhead shot or the switchbacks.*

The stop sells the climb, so shoot the thing that makes it hard: the switchback
stack on the canyon wall, ideally from partway up looking back down into Tenaya
Canyon. A trailhead sign alone undersells it. Morning light hits this side
early. Avoid midday, when the wall goes flat and white.

### Three Chutes Falls
*Moderate, ~3 h, April to June.*

The falls run with snowmelt and are gone by July, so this is a narrow window.
Frame the water, not the flat creek below it: the Commons candidates were all
placid Tenaya Creek at low water, which reads as a pond, and the entry promises
a waterfall. Overcast is better than sun here, since a bright sky behind a
shaded chute blows out.

### Ostrander Lake
*Strenuous, ~7 h, July to September.*

Water plus the stone ski hut on the shore if you can get both in one frame. The
walk is the point of the entry, so a wide shot that shows how much granite you
crossed to get here beats a tight lake portrait. Late afternoon light comes
across the basin.

**Name collision, worth knowing:** searching "Ostrander" on Commons returns a
tugboat named *G.L. Ostrander* and the Ambassador Bridge in Windsor, Ontario.
This slot cannot be filled by search, only by going.

### Carlon Falls
*Easy, ~2.5 h.*

The one on this list that flows year-round, so there is no season to wait for.
Low, wide, from the downstream side, with the pool in the foreground. Summer
green is flattering here and the walk is short enough to go back if the light is
wrong.

### Poopenaut Valley
*Strenuous, ~3.5 h, spring and fall. Brutal on the way out.*

The subject is the **wild Tuolumne below O'Shaughnessy Dam**, not the reservoir.
Every Commons candidate for this slot was Hetch Hetchy Reservoir, which is the
wrong side of the dam and the exact error the entry exists to correct. Shoot the
river in the valley bottom: free-flowing water, gravel bars, no engineering in
frame.

### Rainbow Pool
*Easy, ~1.5 h, July to September.*

A swimming hole on the South Fork Tuolumne at the 120. Shoot it doing its job,
water, rock ledges, the small fall at the head of the pool. Midday is
acceptable here for once, since that is when the pool is actually used and when
the water reads turquoise rather than black.

### El Capitan Meadow after dark
*30 min. Any clear night.*

Headlamps on the wall are the shot: climbers bivouacked on El Cap read as a
string of lights up a black face. Failing that, stars over the wall. New moon
for the Milky Way, but a half moon actually lights the granite and gives you
both wall texture and sky.

The right photo very likely exists on Commons ([Yosemite night elcapitan
climbers.jpg](https://commons.wikimedia.org/wiki/File:Yosemite_night_elcapitan_climbers.jpg)).
Re-run the fetch for this slot before shooting it; the category page limit was
raised from 50 to 500 in July 2026, which is the likely reason it was missed.

### The Foresta loop, barns and bridges
*No fixed time. Any season.*

The historic barn is the picture. Foresta burned in 1990 and again in 2009, so
the standing structures are the point of the entry and the regrowth around them
tells that story. Low sun, early or late, on the barn's weathered boards.

### Little Nellie Falls
*No fixed time.*

Small falls on the old Coulterville Road. Spring flow. It is modest by park
standards, which is the entry's whole argument, so frame it intimately, close
and low, rather than trying to make it look big.

### Hidden Lake
*No fixed time.*

A small granite-rimmed lake near Tenaya Lake and Olmsted Point. Tioga Road
season only, so roughly late May through October.

**Name collision:** Commons "Hidden Lake" returns a lake in Hidden Lake Gardens,
Michigan, and Hidden Lake Peak in the North Cascades. Like Ostrander, this one
is unreachable by search.

---

## Slots not on this list

Three more entries currently share a photo with a neighbour rather than showing
their own. They are not broken and not urgent, but each is a real duplicate a
buyer can notice:

- `el-capitan-winter.jpg` serves `valley-loop-drive`, `el-capitan-meadow`, and
  `el-cap-crossover-parking`.
- `wapama-falls-trail.jpg` serves both `wapama-falls-trail` and
  `rancheria-falls`.
- `cathedral-beach-quiet-picnic.jpg` serves both
  `cathedral-beach-quiet-picnic` and `sentinel-beach-parking`.

`wawona-hotel-history-center` has since been filled from `Category:Wawona Hotel`
and no longer borrows the meadow photo. `rancheria-falls` was re-fetched and
returned only Hetch Hetchy Reservoir, so it keeps the Wapama photo for now.
