# Map assets

Label glyphs and the icon sprite for the 3D map's vector basemap, copied from
[protomaps/basemaps-assets](https://github.com/protomaps/basemaps-assets) so the
map renders labels with no third-party request and offline.

- `fonts/`: Noto Sans Regular, Medium, Italic as MapLibre PBF glyphs, ranges
  0-255, 256-511 and 8192-8447 (Latin, Latin Extended, punctuation), which
  cover every name in the park. SIL Open Font License, `fonts/OFL.txt`.
- `sprites/`: the v4 light and dark sprite sheets. MIT, from tangrams/icons,
  `sprites/LICENSE.md`.

A name in a script outside these ranges fetches a range that is not here, and
MapLibre drops that one label. Add the range file if that ever matters.

The service worker serves these cache-first from the unversioned tile cache
(the map overview download pack fills it), so a changed file needs a new
name, like everything else under `/fonts` and `/img`.
