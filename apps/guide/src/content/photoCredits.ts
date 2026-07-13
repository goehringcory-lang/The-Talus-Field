// =============================================================================
// Photo credits, keyed by the src path exactly as written in stops.ts,
// secret-spots.ts, and REGIONS. A separate map (not a field on each photos
// entry) because one file can serve several slots, and because the object
// below is machine-written: scripts/fetch-guide-photos.mjs emit-credits
// regenerates everything between the GENERATED markers from
// scripts/data/photo-credits.json. Hand-edit that JSON, not this literal.
// =============================================================================

export type PhotoCredit = {
  author: string // "Diliff" or "NPS / Damon Joyce"
  license: string // "Public domain" | "CC0" | "CC BY 4.0" | "CC BY-SA 4.0" | "Pexels License" | "All rights reserved"
  source: string // Commons file page, nps.gov page, or Pexels photo page; empty for house photography
}

// BEGIN GENERATED
export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "/photos/ahwahnee-hotel.jpg": { author: "Chris Dunstan at the English Wikipedia", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Yosemite_-_Ahwahnee_Hotel.jpg" },
  "/photos/artist-point.jpg": { author: "Unknown artist Unknown artist", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Yosemite_Valley,_from_Inspiration_Point,_from_Robert_N._Dennis_collection_of_stereoscopic_views.jpg" },
  "/photos/bridalveil-creek-trail.jpg": { author: "LeSauteur, Marie-Claude, creator", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Bridalveil_Fall_Bridges_-_Bridalveil_Fall_Bridge_No._2,_Spanning_Bridalveil_Creek_on_carriage_road,_Yosemite_Village,_Mariposa_County,_CA_HAER_CAL,22-YOSEM,8-_(sheet_1_of_1).png" },
  "/photos/cathedral-beach-quiet-picnic.jpg": { author: "Todd Petrie", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Cathedral_Beach_in_Yosemite_National_Park.jpeg" },
  "/photos/cathedral-lakes.jpg": { author: "Walter Herman Best", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Upper_Belly_River_Lake_(HS85-10-35481).jpg" },
  "/photos/chilnualna-falls.jpg": { author: "U.S. National Park Service, restoration/cleanup by National Park Maps ( https://npmaps.com )", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:NPS_yosemite-wawona-hiking-map.jpg" },
  "/photos/clouds-rest-tenaya.jpg": { author: "E. &amp; H.T. Anthony (Firm) -- Publisher", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Summit_of_South_Dome._View_from_Clouds%27_Rest_Mt._Little_Yosemite_Valley,_by_E._%26_H.T._Anthony_(Firm).png" },
  "/photos/crocker-stanford-points.jpg": { author: "Hoffman Hoffmann, Charles F. J.T. Gardner Whitney, J.D. Geological Survey of California", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Geological_Survey_Of_California,_J.D._Whitney,_State_Geologist._Map_of_a_portion_of_the_Sierra_Nevada_adjacent_to_the_Yosemite_(IA_dr_geological-survey-of-california-jd-whitney-state-geologist-map-of-a-po-00024051).jpg" },
  "/photos/curry-village-pizza.jpg": { author: "Stephen Leonardi", license: "Pexels License", source: "https://www.pexels.com/photo/breathtaking-view-of-yosemite-valley-at-twilight-29013602/" },
  "/photos/curry-village.jpg": { author: "US National Park Service", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Curry-Village-Yosemite-wooden-duplex-cabin.jpg" },
  "/photos/eagle-peak.jpg": { author: "Underwood &amp; Underwood -- Publisher", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Eagle_Peak_Trail,_Yosemite_Valley,_California,_U.S.A,_by_Underwood_%26_Underwood.png" },
  "/photos/el-cap-meadow-after-dark.jpg": { author: "dbking", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:John_Philip_Sousa_(12927944).jpg" },
  "/photos/el-capitan-summit-tamarack.jpg": { author: "Ahmed Radwan ahmedrad", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:At_the_foot_of_the_granite_giant_(Unsplash).jpg" },
  "/photos/evergreen-road-drive.jpg": { author: "daveynin from United States", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Rim_fire_on_west_Yosemite_-_Flickr_-_daveynin.jpg" },
  "/photos/fern-spring.jpg": { author: "Mo Eid", license: "Pexels License", source: "https://www.pexels.com/photo/green-trees-near-body-of-water-5095808/" },
  "/photos/foresta-cascades.jpg": { author: "Marston, Christopher H., creator", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Section-Elevation_-_Cascade_Creek_Bridge,_Spanning_Cascade_Creek_on_New_Big_Oak_Flat_Road,_Yosemite_Village,_Mariposa_County,_CA_HAER_CAL,22-YOSEM,13-_(sheet_1_of_1).png" },
  "/photos/four-mile-trailhead.jpg": { author: "Cam DiCecca camdicecca", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Blue_sky_over_Yosemite_(Unsplash).jpg" },
  "/photos/gaylor-lake.jpg": { author: "Antandrus ( talk · contribs )", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Gaylor_lakes.jpg" },
  "/photos/glacier-point.jpg": { author: "H.C. White Co. -- Publisher", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:From_Eagle_Peak_over_the_Valley_to_Glacier_Point,_Mt._Clark,_Nevada_Falls_and_Half_Dome,_Yosemite,_Cal.,_U.S.A,_by_H.C._White_Co..png" },
  "/photos/happy-isles-ouzel-watch.jpg": { author: "George Fiske", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:The_rapids_of_the_Merced_River_at_Happy_Isle_in_Yosemite_National_Park,_1900-1918_(CHS-1201).jpg" },
  "/photos/lookout-point.jpg": { author: "KatieRound", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:View-at-Hetch-Hetchy-California.jpg" },
  "/photos/lyell-canyon.jpg": { author: "Ron Clausen", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Grandview_Point_Grand_Canyon_April_1995.jpg" },
  "/photos/mariposa-grove.jpg": { author: "Dietmar Rabich", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Yosemite_National_Park_(CA,_USA),_Mariposa_Grove_of_Giant_Sequoias_--_2022_--_2724.jpg" },
  "/photos/may-lake.jpg": { author: "Jon Sullivan", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:May_Lake_Mount_Hoffmann.jpg" },
  "/photos/mcgurk-meadow.jpg": { author: "Calkins, F.C.", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:LowerMcGurkMeadow.jpg" },
  "/photos/merced-grove.jpg": { author: "Darold Massaro", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Merced_Grove_Redwood_Grove_Hike.jpg" },
  "/photos/milky-way-sentinel-dome.jpg": { author: "Jackhen1992", license: "CC BY-SA 4.0", source: "" },
  "/photos/mirror-lake.jpg": { author: "Dietmar Rabich", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Yosemite_National_Park_(CA,_USA),_Yosemite_Valley,_Mirror_Lake_--_2022_--_2805.jpg" },
  "/photos/mono-pass-meadows.jpg": { author: "Carleton Watkins (American, 1829 - 1916) (1829 - 1916) – photographer (American) Details on Google Art Project", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Carleton_Watkins_(American_-_The_Mono_Pass,_Yosemite_Valley,_Mariposa_County,_Cal._-_Google_Art_Project.jpg" },
  "/photos/north-dome-indian-rock.jpg": { author: "Watkins, Carleton E., 1829-1916, photographer", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:North_Dome,_Yosemite_LCCN95514319.jpg" },
  "/photos/old-big-oak-flat-road.jpg": { author: "Soly Moses", license: "Pexels License", source: "https://www.pexels.com/photo/serene-oak-trees-under-sunlight-in-yucaipa-forest-31592697/" },
  "/photos/old-road-trailhead-pullout.jpg": { author: "Stephen Leonardi", license: "Pexels License", source: "https://www.pexels.com/photo/majestic-oak-tree-in-yosemite-national-park-30140436/" },
  "/photos/olmsted-point-at-night.jpg": { author: "USCapitol", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Flickr_-_USCapitol_-_Olmsted_Hardscapes_on_the_U.S._Capitol_Grounds.jpg" },
  "/photos/olmsted-point.jpg": { author: "Dcrjsr", license: "CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:Olmsted_Point_Yosemite_view.jpg" },
  "/photos/oshaughnessy-dam.jpg": { author: "Pub. by E. H. Potts Greeting Card Co., Columbus, Ohio. \"Tichnor Quality Views,\" Reg. U. S. Pat. Off. Made Only by Tichnor Bros., Inc., Boston, Mass.", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Columbus_Zoo_and_O%27Shaughnessy_Dam,_Columbus,_Ohio_(73701).jpg" },
  "/photos/ostrander-lake.jpg": { author: "U.S. National Park Service, restoration/cleanup by National Park Maps ( https://npmaps.com )", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:NPS_yosemite-glacier-point-hiking-map.jpg" },
  "/photos/pothole-dome-sunset.jpg": { author: "Albert William Stevens", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:California_-_Dark_Hole;_Big_Dalton_Dam_through_Davis_-_NARA_-_23934231.jpg" },
  "/photos/rainbow-view-old-road.jpg": { author: "Muybridge, Eadweard, 1830-1904 -- Photographer", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Rainbow_at_Piwyack,_by_Muybridge,_Eadweard,_1830-1904.jpg" },
  "/photos/rancheria-falls.jpg": { author: "Ken Lund from Reno, Nevada, USA", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Hetch_Hetchy_Reservoir,_Yosemite_National_Park,_California_(21546718026).jpg" },
  "/photos/ribbon-fall-base.jpg": { author: "Pond, C. L. (Charles L.) -- Photographer", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Ribbon_Fall,_3,300_feet_high._Yo_Semite_Valley,_California,_by_Pond,_C._L._(Charles_L.).png" },
  "/photos/snow-creek-trail.jpg": { author: "Walter Siegmund", license: "CC BY 2.5", source: "https://commons.wikimedia.org/wiki/File:Arctostaphylos_patula_08398.JPG" },
  "/photos/taft-point.jpg": { author: "Cam Adams camadams", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Taft_Point,_Yosemite_Valley_(Unsplash_xS-lvhpiJNM).jpg" },
  "/photos/tenaya-lake.jpg": { author: "Michael Hogarth", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Tenaya_Lake_Yosemite_National_Park.png" },
  "/photos/three-chutes-falls.jpg": { author: "Andrew Burnham", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Yosemite_-_Tenaya_Creek_butterflies_-_panoramio.jpg" },
  "/photos/tioga-road-drive.jpg": { author: "Unknown author Unknown author or not provided", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Tioga_Road-Big_Oak_Flat_Road_-_Tioga_Road_in_Yosemite_National_Park_-_NARA_-_7722409.jpg" },
  "/photos/tuolumne-grove-old-road.jpg": { author: "Unknown artist Unknown artist", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Dead_Giant,_Tuolumne_Grove,_30_ft._8_in._diam.,_Big_Oak_Flat_route_to_Yosemite_Valley,_from_Robert_N._Dennis_collection_of_stereoscopic_views.png" },
  "/photos/valley-ephemeral-falls.jpg": { author: "Matthes", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:RoyalArches.jpg" },
  "/photos/valley-loop-drive.jpg": { author: "Croteau, Todd A., creator", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Title_Sheet_-_Yosemite_Creek_Bridge,_Spanning_Yosemite_Creek_on_Northside_Drive,_Yosemite_Village,_Mariposa_County,_CA_HAER_CAL,22-YOSEM,23-_(sheet_1_of_1).png" },
  "/photos/wapama-falls-trail.jpg": { author: "Craig Given", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Wapama_Falls_at_Hetch_Hetchy.jpg" },
  "/photos/washburn-point.jpg": { author: "Pavel Špindler", license: "CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:Washburn_Point_-_Half_Dome,_Yosemite_Valley,_Vernal_a_Nevada_Falls_-_panoramio.jpg" },
  "/photos/wawona-meadow-loop.jpg": { author: "Pierce, C.C. (Charles C.), 1861-1946", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Wawona_Meadows,_Yosemite_National_Park,_1900-1930_(CHS-1178).jpg" },
  "/photos/widows-tears-silver-strand.jpg": { author: "Thomas K", license: "Pexels License", source: "https://www.pexels.com/photo/view-of-a-large-waterfall-in-the-yosemite-valley-24460927/" },
  "/photos/yosemite-point.jpg": { author: "W.L.B. National Park Service Branch of Plans and Design", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Master_Plan_for_Yosemite_National_Park_-_Glacier_Point.jpg" },
}
// END GENERATED

/** One-line courtesy credit for a plate caption. */
export function formatCredit(c: PhotoCredit): string {
  // Pexels asks for a photographer/source mention, not a license name.
  if (c.license.toLowerCase() === 'pexels license') return `Photo: ${c.author} / Pexels`
  const license = c.license.toLowerCase() === 'public domain' ? 'public domain' : c.license
  return `Photo: ${c.author}, ${license}`
}
