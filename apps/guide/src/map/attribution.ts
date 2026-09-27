// The map's data credits, in one place and free of the style code, so pages
// that only print them (Account, the map's Info pane) do not pull MapLibre or
// the basemap layers into their chunk.
//
// OpenStreetMap is ODbL and asks for its credit wherever the map is shown; the
// others are public domain and credited because the guide says where every
// fact comes from.

export const MAP_CREDITS = [
  '© OpenStreetMap contributors (basemap, roads and trails; ODbL)',
  'Protomaps (basemap build)',
  'USGS 3DEP, SRTM and GMTED2010 via Mapzen Terrain Tiles (elevation)',
  'USGS National Map trail linework, NPS source data (trails)',
  'National Park Service (park boundary, place records)',
] as const

/** Plain-text credit line for pages that print it. */
export const MAP_ATTRIBUTION = MAP_CREDITS.join('; ')

/** The map control's credit, with the OSM copyright link the ODbL asks for. */
export const MAP_ATTRIBUTION_HTML =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors · ' +
  '<a href="https://protomaps.com" target="_blank" rel="noopener">Protomaps</a> · ' +
  'Elevation: USGS 3DEP via Mapzen Terrain Tiles · Boundary: NPS'
