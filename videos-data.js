// ============================================================
// The film archive. Yosemite Nature Notes, the National Park
// Service's documentary short series about the park, 2009-2025.
// The films are works of the United States government and are in
// the public domain; they are embedded from the official YouTube
// uploads. Every dek below is original Talus Field copy, not NPS
// copy. youtubeId values were verified against the published
// uploads; do not edit one without checking the video it points to.
// ============================================================

window.NATURE_NOTES = {
  series: {
    title: "Yosemite Nature Notes",
    producer: "National Park Service, Yosemite National Park",
    npsUrl: "https://www.nps.gov/yose/learn/photosmultimedia/ynn.htm",
    playlistUrl: "https://www.youtube.com/playlist?list=PL890957589F8403A4",
  },

  // Section order on the page follows this array.
  themes: [
    { id: "granite", title: "Granite & Rockfall", note: "The rock itself: how it got here, how it breaks, and what piles up below." },
    { id: "water", title: "Water & Waterfalls", note: "The falls, the rivers, and where the snowmelt goes." },
    { id: "winter", title: "Winter & Ice", note: "The season most visitors miss." },
    { id: "after-dark", title: "After Dark", note: "What the park does at night." },
    { id: "forest", title: "Forest & Meadow", note: "Trees, flowers, and the open ground between them." },
    { id: "wildlife", title: "Wildlife", note: "The animals, common and vanishing." },
    { id: "people", title: "People & the Park", note: "History, maps, sound, and the work of keeping a park." },
  ],

  // episode: null marks the specials, which sort after the numbered run.
  episodes: [
    // Granite & Rockfall
    { id: "half-dome", episode: 4, title: "Half Dome", youtubeId: "ihNpkUp5JdM", theme: "granite", year: 2009,
      dek: "The most recognized rock in the Sierra, and what it takes to stand on top of it." },
    { id: "rock-fall", episode: 10, title: "Rock Fall", youtubeId: "H0YhlqP1BgE", theme: "granite",
      dek: "Since the glaciers left, falling rock has done the carving here. This journal is named for what piles up below." },
    { id: "glaciers", episode: 12, title: "Glaciers", youtubeId: "mgnzSTY5zRg", theme: "granite",
      dek: "Two small glaciers persist near the park's highest peaks. They are not what carved the Valley, but they are family." },
    { id: "sky-islands", episode: 16, title: "Sky Islands", youtubeId: "yneADYBWRvs", theme: "granite",
      dek: "Flat alpine plateaus near thirteen thousand feet, and the species stranded on them since the ice left." },
    { id: "granite", episode: 20, title: "Granite", youtubeId: "Y5RQp77uVPA", theme: "granite",
      dek: "The cliffs and domes are one body of rock, cooled underground and exhumed. The geology behind the postcard." },

    // Water & Waterfalls
    { id: "yosemite-falls", episode: 2, title: "Yosemite Falls", youtubeId: "2mSNY3TdDZ4", theme: "water",
      dek: "The tallest waterfall in North America runs on snowmelt, which means it runs out." },
    { id: "tuolumne-river", episode: 7, title: "Tuolumne River", youtubeId: "80CulKuksHc", theme: "water",
      dek: "The park's other river, from Lyell Canyon to the reservoir that ended a valley." },
    { id: "horsetail-fall", episode: 14, title: "Horsetail Fall", youtubeId: "oyoa-QfeGho", theme: "water",
      dek: "For two weeks in February, if the water is running and the sky is clear, a thin fall on El Capitan lights up at sunset." },
    { id: "water", episode: 18, title: "Water", youtubeId: "IWrUh3phnBc", theme: "water", year: 2012,
      dek: "The Merced and the Tuolumne start as Sierra snow and end in Central Valley fields and San Francisco taps." },

    // Winter & Ice
    { id: "snow", episode: 5, title: "Snow", youtubeId: "BrWp4iFl29g", theme: "winter",
      dek: "The reservoir the whole state draws on arrives quietly, one storm at a time." },
    { id: "snow-line", episode: 8, title: "Snow Line", youtubeId: "4lxWNsWYSyo", theme: "winter",
      dek: "Each storm draws a line across the Sierra where rain becomes snow. Park scientists chase it." },
    { id: "frazil-ice", episode: 9, title: "Frazil Ice", youtubeId: "9V9p4mFEYXc", theme: "winter",
      dek: "On cold spring mornings, waterfall mist freezes into slush that moves down Yosemite Creek like wet concrete." },
    { id: "ski-yosemite", episode: 28, title: "Ski Yosemite", youtubeId: "WmrrsBdNY2E", theme: "winter",
      dek: "Before the park was a summer destination it was a winter one. Badger Pass and the Sierra's ski history." },
    { id: "winter-in-tuolumne-meadows", episode: 37, title: "Winter in Tuolumne Meadows", youtubeId: "tXAL7fPDaJE", theme: "winter",
      dek: "Two rangers ski the high country all winter. What the park is like at 8,600 feet in January." },

    // After Dark
    { id: "moonbows", episode: 15, title: "Moonbows", youtubeId: "W6KMnPzZ0Eo", theme: "after-dark",
      dek: "On full-moon nights in spring, the mist at the base of Yosemite Falls makes rainbows by moonlight." },
    { id: "night-skies", episode: 19, title: "Night Skies", youtubeId: "ZhgR3zVfo-0", theme: "after-dark", year: 2012,
      dek: "Remote and high, the park protects some of the darkest sky left in California." },

    // Forest & Meadow
    { id: "wildflowers", episode: 1, title: "Wildflowers", youtubeId: "HFpvV7ZjvYA", theme: "forest",
      dek: "Hundreds of species bloom between the foothills and the alpine zone, on a schedule set by elevation." },
    { id: "big-trees", episode: 11, title: "Big Trees", youtubeId: "GBiHAGYJXVQ", theme: "forest",
      dek: "Deep snow and a long growing season make these forests home to some of the largest trees anywhere." },
    { id: "black-oaks", episode: 17, title: "Black Oaks", youtubeId: "2SbAvYUVsus", theme: "forest",
      dek: "The Valley's signature hardwood, and the acorn economy that fed people here for centuries." },
    { id: "snow-plants", episode: 21, title: "Snow Plants", youtubeId: "kSBqmAdR1tg", theme: "forest", year: 2013,
      dek: "The red spike by the roadside in May is not a flower in any usual sense. It eats fungus." },
    { id: "fire-followers", episode: 31, title: "Fire Followers", youtubeId: "bn0iDXBp-E0", theme: "forest",
      dek: "Some seeds wait decades in the soil for a burn. The year after a fire is the year to look." },
    { id: "meadows", episode: 33, title: "Meadows", youtubeId: "hFpWxrQOyPQ", theme: "forest",
      dek: "Three thousand meadows cover three percent of the park and hold most of its biodiversity." },
    { id: "giant-sequoias", episode: 34, title: "Giant Sequoias", youtubeId: "dVx4XdT7qrk", theme: "forest", year: 2022,
      dek: "The largest trees on earth are built to survive almost anything. Climate change is testing the design." },
    { id: "mystery-trees", episode: 36, title: "Mystery Trees in Tenaya Lake", youtubeId: "JUIKeoefUpw", theme: "forest",
      dek: "Mature trees stand rooted on the floor of one of the park's largest lakes. Explaining them rewrites the drought record." },

    // Wildlife
    { id: "birdsongs", episode: 23, title: "Birdsongs", youtubeId: "CWB5sm02OYI", theme: "wildlife",
      dek: "What the park sounds like when you stop and sort the voices." },
    { id: "monarchs-milkweed", episode: 24, title: "Monarchs & Milkweed", youtubeId: "V3jpu2th34o", theme: "wildlife",
      dek: "A field of milkweed is its own small economy of bees, wasps, hummingbirds, and butterflies." },
    { id: "black-bears", episode: 26, title: "Black Bears", youtubeId: "ijIePq9gGfo", theme: "wildlife",
      dek: "Several hundred black bears live in the park. Almost everything visitors believe about them is wrong." },
    { id: "bighorn-sheep", episode: 27, title: "Bighorn Sheep", youtubeId: "qCf47SrgDss", theme: "wildlife",
      dek: "The rarest mountain sheep in North America was down to about a hundred animals in 1995. It is climbing back." },
    { id: "california-grizzly", episode: 30, title: "California Grizzly", youtubeId: "L-H93WQKRNU", theme: "wildlife",
      dek: "There were ten thousand grizzlies in California in 1850. Within seventy-five years there were none." },
    { id: "yellow-legged-frogs", episode: 32, title: "Mountain Yellow-Legged Frogs", youtubeId: "JblxFD6kxKM", theme: "wildlife",
      dek: "Once the most common vertebrate in the high country, now endangered, and the long work of bringing them back." },
    { id: "to-find-a-fisher", episode: 35, title: "To Find a Fisher", youtubeId: "H6WcorECb0k", theme: "wildlife",
      dek: "A house-cat-sized predator so rare that finding one takes radio collars, snow tracking, and patience." },
    { id: "yosemite-toad", episode: 38, title: "The Yosemite Toad", youtubeId: "FD9MKkVs7rQ", theme: "wildlife", year: 2025,
      dek: "First described here in the early 1900s, found only in the Sierra, and still mostly a mystery." },

    // People & the Park
    { id: "wilderness", episode: 3, title: "Wilderness", youtubeId: "hKyfyYDgxeA", theme: "people",
      dek: "Ninety-five percent of the park is designated wilderness. Most visitors never enter it." },
    { id: "maps", episode: 6, title: "Maps", youtubeId: "h_U4Vwawkc0", theme: "people",
      dek: "When Joseph Walker passed through in 1833 there were none. The park has been redrawn ever since." },
    { id: "rangers-club", episode: 13, title: "Rangers' Club", youtubeId: "zzXRgcCV7Uc", theme: "people", year: 2011,
      dek: "A 1920 building in the Valley, paid for personally by Stephen Mather, and the rangers who have lived in it since." },
    { id: "nature-notes", episode: 22, title: "Yosemite Nature Notes", youtubeId: "gCXK2oNEkEE", theme: "people", year: 2020,
      dek: "The series takes its name from a typewritten news sheet started in 1922, which ran four decades and four hundred issues." },
    { id: "ghost-towns", episode: 25, title: "Ghost Towns", youtubeId: "rCpq-o7egVc", theme: "people",
      dek: "A gold and silver rush hit Tioga Pass in 1880. What is left of it sits just above the timberline." },
    { id: "soundscapes", episode: 29, title: "Soundscapes", youtubeId: "9X5JfGI0hr0", theme: "people",
      dek: "The park service measures quiet the way it measures air and water. A dimension most visitors never notice." },
    { id: "one-day-in-yosemite", episode: null, title: "One Day in Yosemite", youtubeId: "7QLVMwyxU_Q", theme: "people", year: 2012,
      dek: "On June 26, 2012, thirty filmmakers spread across the park to record a single day of the people who visit and work in it." },
    { id: "fall-moments", episode: null, title: "Fall Moments", youtubeId: "UzA-M8ASGqk", theme: "people",
      dek: "Autumn in the park, in passing observations. The shortest brief in the series." },
  ],
};

// Dev-only integrity check, mirroring the page-kit.jsx pattern: duplicate ids
// or youtubeIds and unknown theme keys fail silently in production but a
// duplicate would make two cards share a player, so surface it on localhost.
if (typeof window !== "undefined" && window.location && window.location.hostname === "localhost") {
  (function () {
    var nn = window.NATURE_NOTES;
    var themeIds = new Set(nn.themes.map(function (t) { return t.id; }));
    var seenId = new Set(); var seenYt = new Set(); var problems = [];
    nn.episodes.forEach(function (ep) {
      if (seenId.has(ep.id)) problems.push("duplicate id: " + ep.id); else seenId.add(ep.id);
      if (seenYt.has(ep.youtubeId)) problems.push("duplicate youtubeId: " + ep.youtubeId); else seenYt.add(ep.youtubeId);
      if (!themeIds.has(ep.theme)) problems.push("unknown theme '" + ep.theme + "' on " + ep.id);
    });
    if (problems.length) console.warn("NATURE_NOTES problems:", problems);
  })();
}
