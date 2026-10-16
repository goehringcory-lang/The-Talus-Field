/* global React, NatureNotesFilm */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["yosemite-glaciers-climate"] = function YosemiteGlaciersBody() {
  // ── Explainer graphic (September 2026 visual pass). Every fact in it is
  // stated in the body below; the figcaption says so.
  const SVG_STYLE = { width: "100%", height: "auto", display: "block" };
  const T_HEAD = { fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, letterSpacing: 1.1, fill: "var(--rust)" };
  const T_BODY = { fontFamily: "var(--sans)", fontSize: 14, fill: "var(--ink)" };
  const T_SOFT = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const T_BIG = { fontFamily: "var(--serif)", fontSize: 19, fill: "var(--ink)" };

  // Two measurements that define the loss: the glaciers' area since 1883, and
  // whether the ice still flows, from the stake surveys of 1872, 2012 and
  // 2022. Rows, so the labels stay legible on a phone.
  function GlacierLedger() {
    const W = 600, LX = 150, BW = 400;
    const flow = [
      { who: "Maclure, 1872", v: 1, lab: "about 1 inch a day (Muir)" },
      { who: "Maclure, 2012", v: 1, lab: "about 1 inch a day" },
      { who: "Maclure, 2022", v: 0.75, lab: "three quarters of an inch" },
      { who: "Lyell, 2012", v: 0, lab: "the stakes did not move at all" },
    ];
    return (
      <svg viewBox={`0 0 ${W} 420`} style={SVG_STYLE} role="img"
        aria-label="Two measurements of Yosemite's glaciers. Area of the park's two glaciers: 67 to 78 percent lost between 1883 and 2017, and 80 to 115 feet of thinning since 1933. Flow, measured with stakes: the Maclure Glacier moved about an inch a day when John Muir measured it in 1872 and at the same rate in 2012, then about three quarters of an inch a day by 2022. The Lyell Glacier's stakes did not move at all in 2012.">
        <text x="0" y="18" style={T_HEAD}>BOTH GLACIERS · AREA SINCE 1883</text>
        <text x="0" y="62" style={{ ...T_BODY, fontWeight: 600 }}>1883</text>
        <rect x={LX} y="44" width={BW} height="26" fill="var(--paper-2)" stroke="var(--moss)" strokeWidth="1.5" />
        <text x={LX + BW - 10} y="62" textAnchor="end" style={T_SOFT}>100%</text>
        <text x="0" y="104" style={{ ...T_BODY, fontWeight: 600 }}>Today</text>
        <rect x={LX} y="86" width={BW * 0.3} height="26" fill="var(--moss)" />
        <rect x={LX + BW * 0.3} y="86" width={BW * 0.7} height="26" fill="none" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={LX + BW * 0.3 + 12} y="104" style={{ ...T_SOFT, fontStyle: "italic" }}>67 to 78 percent gone by 2017</text>
        <text x="0" y="140" style={T_SOFT}>And 80 to 115 feet thinner since 1933.</text>

        <line x1="0" y1="164" x2={W} y2="164" stroke="var(--rule-soft)" strokeWidth="1.5" />
        <text x="0" y="192" style={T_HEAD}>DOES THE ICE STILL MOVE? STAKE SURVEYS</text>
        <text x={LX} y="214" style={T_SOFT}>0</text>
        <text x={LX + BW} y="214" textAnchor="end" style={T_SOFT}>1 inch a day</text>
        {flow.map((f, i) => {
          const y = 232 + i * 44;
          return (
            <g key={f.who}>
              <text x="0" y={y + 17} style={{ ...T_BODY, fontWeight: 600 }}>{f.who}</text>
              {f.v == null
                ? <rect x={LX} y={y} width={BW} height="24" fill="none" stroke="var(--moss)" strokeWidth="1.2" strokeDasharray="5 4" />
                : <rect x={LX} y={y} width={Math.max(3, BW * f.v)} height="24" fill={f.v === 0 ? "var(--rust)" : "var(--moss)"} />}
              <text x={f.v && f.v > 0.5 ? LX + 10 : LX + 12} y={y + 17}
                style={{ ...T_SOFT, fill: f.v && f.v > 0.5 ? "var(--paper)" : f.v === 0 ? "var(--rust)" : "var(--ink-2)", fontWeight: f.v === 0 ? 600 : 400 }}>{f.lab}</text>
            </g>
          );
        })}
        <line x1={LX} y1="222" x2={LX} y2="408" stroke="var(--ink-3)" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <>
      <p className="dropcap">
        In 1872, John Muir drove a line of stakes into the Maclure Glacier and came back to see how far they had moved. They had moved: the ice was flowing, which was the point he was trying to prove. In 2012 a research team repeated his measurement in the same part of the melt season, with the same method. On the neighboring Lyell Glacier the stakes did not move at all.
      </p>

      <p>
        The Park Service's reading of that result is blunt: the Lyell Glacier "no longer moves downhill, meaning that it no longer formally meets the definition of 'glacier.'" From 1883 to 2017 the surface area of the park's two glaciers shrank by 67 to 78 percent, and since 1933 both have lost 80 to 115 feet of depth. On the next ridge, the Maclure Glacier was still flowing in 2012 at about an inch a day, the same rate Muir measured 140 years earlier, and by 2022 it had slowed to three quarters of an inch.
      </p>

      <p>
        Glaciers keep a record. Every winter's snow adds to the ice and every summer's melt takes some of it away, and the balance between those two is a readable account of the climate that produced them. Yosemite's remnants are too small and too wet to hold the layered ice-core record that polar glaciers do, meltwater percolates down and blurs the years, but their extent, thickness and movement have been measured on and off since Muir, and that record is long enough to say something exact about what has changed.
      </p>

      <h2>How glaciers archive climate</h2>

      <p>
        A glacier builds by accumulation. When snow falls on a glacier in winter, it lands on existing ice. It compresses under the weight of subsequent snowfall. Over years, it becomes firn. Over decades, it becomes glacier ice. The transformation happens because the weight of overlying snow removes air spaces, compacting the material until it's dense enough to flow slowly downslope under its own weight.
      </p>

      <p>
        In the great polar ice sheets that record is literal: drill down, and each layer is a year's accumulation, its trapped air and its oxygen and hydrogen isotopes preserving the conditions the snow fell in. Yosemite's ice does not work that way. What it offers instead is a century and a half of surface measurements, photographs taken from the same spots decades apart, and stakes driven into the ice to see whether it still moves.
      </p>

      <p>
        Yosemite's glaciers sit high enough (most above 10,000 feet, with the highest near 13,000) that they still accumulate snow in most years. They are small compared to glaciers in the greater Sierra, and they are shrinking. Their records are recent enough to show how Yosemite's high country is changing now.
      </p>

      <p>
        Two glaciers remain in Yosemite: the <strong>Lyell</strong> and the <strong>Maclure</strong>. Both sit at the headwaters of the Tuolumne River beneath the park's highest peaks, and neither is a roadside stop. The usual approach is a multi-day walk from Tuolumne Meadows, which puts them behind <a href="/articles/tioga-road-opening-weekend">Tioga Road</a>'s season: late May to mid-November in most years. The Dana Glacier, which is often named alongside them, lies east of the Mount Dana ridgeline and outside the park, in the Ansel Adams Wilderness.
      </p>

      <p>Both glaciers have retreated and thinned, and one of them has stopped moving.</p>

      <NatureNotesFilm
        id="glaciers"
        title="Glaciers"
        youtubeId="mgnzSTY5zRg"
        episode={12}
        note="The park's film on the two remnants this piece measures, at the head of the Tuolumne under the highest peaks."
        location="article"
      />


      <h2>The recession timeline</h2>

      <p>
        Lyell's decline is the one that has been measured most closely, and the numbers are specific: from 1883 to 2017 the surface area of the park's two glaciers fell by 67 to 78 percent, and since 1933 both have lost 80 to 115 feet of depth. Thinning determines what it is. A glacier moves because it is thick enough that its own weight deforms the ice at the bottom. Below that threshold it is a snowfield that happens to be old, which is what the stationary stakes of 2012 were recording. Park scientists have said Lyell could disappear within a decade or so, depending on the droughts ahead.
      </p>

      <figure>
        <GlacierLedger />
        <figcaption>The glaciers' shrinking area and the stake surveys of both, drawn from the figures in this article.</figcaption>
      </figure>


      <p>
        The position of a glacier's terminus is determined by a balance between snow accumulation on the upper glacier and melt on the lower glacier. If the terminus moves upslope, less snow is accumulating on the upper glacier, more melt is happening on the lower glacier, or both.
      </p>

      <p>
        More specifically, the retreat tells us that summer temperatures have increased over the period of observation. Snow that used to survive the summer in regions lower down the glacier now melts completely. The glacier has adjusted its extent to a new balance point, where the amount of melt at lower elevations now equals the amount of accumulation at higher elevations. That new balance point is at a higher elevation than it was a century ago.
      </p>

      <p>
        The Maclure is on the same path, further back. It still moves, and it is expected to outlast its neighbor. The 1928 <em>Nature Notes</em> Vol. 7, No. 9 entry titled "A Nature Guide Party Conquers Mt. Lyell" offers direct observations from that era of the ice's extent and appearance, and set beside repeat photography from the same vantages, the retreat is obvious.
      </p>

      <p>
        What makes the glacier data particularly valuable is precision. A retreat of even a few hundred feet represents a measurable change in climate. That change happened in ninety years, recent enough to compare against temperature, precipitation and streamflow records. The glacier data corroborates what the others show: the Sierra Nevada has warmed, particularly at high elevations, and the warming has been especially pronounced in recent decades.
      </p>

      <h2>Where the water goes</h2>

      <p>
        This is the question that matters most for Yosemite and the broader San Francisco Bay Area. Something close to a third of California's developed water supply comes off the Sierra Nevada, nearly all of it as snowmelt. Shrinking glaciers are a climate signal and a declining water source.
      </p>

      <p>
        In summer, glacier melt feeds streams, so a glacier works like a high-elevation reservoir. It accumulates snow in winter (when the water that falls is locked in ice), and releases it gradually in summer (through melt). This steady summer release helps sustain streamflow during the dry season. Without glaciers, the same amount of snow might fall, but much of it would melt in spring, and the stream would be lower in summer.
      </p>

      <p>
        The glaciers themselves now contribute very little. Both sit in the Tuolumne headwaters, so neither the Merced nor Tenaya Creek has any glacial ice in its watershed at all, and in spring the glacial trickle barely registers in the snowmelt-fed Lyell Fork. The Park Service notes that the ice matters most in September and October of dry years, when its steady runoff sustains high-elevation streams after the snow is gone. The thing that keeps those streams running through the summer is the snowpack, and the glaciers matter chiefly as the most legible gauge of what is happening to it.
      </p>

      <p>
        The aquatic ecosystems in these streams depend on cold water from glacier melt. The fish that live in them (mostly native trout and adjacent populations of other coldwater species) are cold-water adapted. They thrive when glacier-fed streams stay cold and well-oxygenated. As glacier melt declines and stream temperatures warm, these populations may struggle.
      </p>

      <p>
        The reservoirs downstream on the Tuolumne (<a href="/articles/hetch-hetchy-the-other-yosemite-valley">Hetch Hetchy</a> and Don Pedro) depend on that snowmelt for most of their annual recharge, and a snowpack that melts out earlier is a harder one to store.
      </p>

      <h2>Reading a deglaciated landscape</h2>

      <p>
        A retreating glacier leaves a readable landscape. Immediately adjacent to where Lyell Glacier's terminus sat in 1933, the terrain is now bare, weathered granodiorite. The rock shows no lichen (lichen colonizes slowly, and ninety years is not long enough for significant colonization on exposed granite at high elevation). It shows no soil development.
      </p>

      <p>
        As you move further from the 1933 terminus line, the landscape ages. Rock surfaces show lichen colonization. Small pioneer plants (sedges, cushion plants) establish in small fractures. This transition zone reveals the chronology of recession. The terrain closest to the current glacier terminus has been exposed recently, perhaps within the last few decades. Terrain slightly further away has been exposed longer, and shows more plant colonization.
      </p>

      <p>
        The moraine (the ridge of rocky debris pushed downslope by the glacier) marks the maximum extent during the last few centuries. Some of Lyell's moraine material dates from the 1600s and 1700s. That moraine has been colonized by substantial plants, even small trees, by now. The contrast between the moraine landscape (vegetated, soil-developed, integrated into the alpine ecosystem) and the freshly deglaciated terrain (bare rock, pioneer stage) is clear. Walking away from the glacier, you pass from recently exposed rock to older, more developed terrain.
      </p>

      <p>
        This landscape reading is available to any visitor willing to hike to the glacier. The cairn that the 1933 ranger built may be gone, but bare rock, lichen and moraine mark the same history.
      </p>

      <h2>What the data means, and what it doesn't</h2>

      <p>
        Yosemite's glaciers are not anomalies. They're part of a broader pattern of recession happening across the entire Sierra Nevada and the entire western mountain range system. Glaciers in the Cascades, the Rockies, and the coastal ranges of California and Oregon are all retreating. Many have disappeared entirely.
      </p>

      <p>
        The Sierra Nevada has warmed measurably over the past century, with the clearest signal in wintertime low temperatures, and most of that change concentrated in recent decades. Summer temperatures have warmed more than winter temperatures. The warming is consistent with climate projections for greenhouse gas accumulation.
      </p>

      <p>
        What the glacier data doesn't tell us is what the weather will do tomorrow, or next year. Glaciers respond to long-term climate averages, not individual seasons. A particularly snowy winter might slow the rate of glacier retreat in a given year. An exceptionally hot summer might accelerate it. But these individual-year variations are noise compared to the underlying trend. The trend is toward warmer summers and less glacier extent.
      </p>

      <p>
        For Yosemite, this means that the park's landscape, the streams that define it, and the ecosystems that depend on those streams are in transition. The same warming that has shrunk Lyell Glacier is also reshaping how <a href="/articles/giant-sequoias-fire-adaptation">giant sequoia groves respond to fire</a>, both archives of climate written into the park, in ice and in bark.
      </p>

      <h3>Further reading</h3>
      <ul style={{ fontSize: 14 }}>
        <li><em>Nature Notes</em> Vol. 12, No. 4 (1933). "Altitude Records" by C. A. Harwell: high-elevation bird and mammal sightings made in passing during the glacier-measuring trips of 1931 and 1932, including tracks found on the ice itself. <a href="/archive/1933/vol-12-no-4/">Read it in the archive</a>.</li>
        <li><em>Nature Notes</em> Vol. 7, No. 9 (1928). "A Nature Guide Party Conquers Mt. Lyell," with field observations of glacier extent and high-altitude terrain conditions.</li>
        <li>USGS historical glacier survey data for the Sierra Nevada, available through Yosemite's resource library and the California Water Science Center.</li>
        <li>Modern glacier monitoring studies through UC Berkeley's glaciology program, comparing contemporary glacier extent to historical records.</li>
      </ul>
    </>
  );
};
