/* global React, L */
// =============================================================================
// MAP COMPONENTS — Leaflet-backed map view, pin list, filter chips, region group.
//
// All exposed as globals on window so page-map.jsx can compose them. State
// lives in MapPage; these components are largely presentational with imperative
// Leaflet handling tucked behind useEffect/useRef.
// =============================================================================

const { useEffect, useMemo, useRef } = React;

// ---------------------------------------------------------------------------
// Region metadata. Extends the PWA's three regions with hetch-hetchy. Order
// here drives the sidebar group order.
// ---------------------------------------------------------------------------
const REGION_META = {
  valley: { label: "Yosemite Valley", order: 1 },
  "hetch-hetchy": { label: "Hetch Hetchy", order: 2 },
  "glacier-mariposa": { label: "Glacier Point & Mariposa", order: 3 },
  tuolumne: { label: "Tuolumne & the High Country", order: 4 },
};

// ---------------------------------------------------------------------------
// Category metadata. Keys match `properties.category` from points.geojson.
// Color drives the divIcon shield fill; glyph is a small inline SVG path.
// ---------------------------------------------------------------------------
const CATEGORY_META = {
  viewpoint: { label: "Viewpoints", color: "#c8a35a", glyph: "eye" },
  hike:      { label: "Hikes",      color: "#7a8a5a", glyph: "boot" },
  geology:   { label: "Geology",    color: "#7d7d80", glyph: "mountain" },
  waterfall: { label: "Waterfalls", color: "#5a7a96", glyph: "wave" },
  sequoia:   { label: "Sequoias",   color: "#3d5a3d", glyph: "tree" },
  lodging:   { label: "Lodging",    color: "#a8957a", glyph: "tent" },
  trailhead: { label: "Trailheads", color: "#7a8a5a", glyph: "flag" },
};

// Inline SVG glyph paths, sized for a 22×22 viewBox. Kept small and abstract —
// they sit inside a 32×32 shield, so detail beyond a few strokes is wasted.
const GLYPH_SVG = {
  eye:      '<circle cx="11" cy="11" r="3" fill="#fff"/><path d="M2 11 Q11 4 20 11 Q11 18 2 11 Z" stroke="#fff" stroke-width="1.6" fill="none"/>',
  boot:     '<path d="M5 4 L5 14 L14 14 L18 17 L18 19 L4 19 L4 4 Z" fill="#fff"/>',
  mountain: '<path d="M2 18 L8 7 L12 13 L15 10 L20 18 Z" fill="#fff"/>',
  wave:     '<path d="M2 8 Q6 4 10 8 T18 8 M2 13 Q6 9 10 13 T18 13 M2 18 Q6 14 10 18 T18 18" stroke="#fff" stroke-width="1.6" fill="none"/>',
  tree:     '<path d="M11 3 L5 10 L8 10 L4 16 L9 16 L9 19 L13 19 L13 16 L18 16 L14 10 L17 10 Z" fill="#fff"/>',
  tent:     '<path d="M3 18 L11 4 L19 18 L13 18 L11 13 L9 18 Z" fill="#fff"/>',
  flag:     '<path d="M5 3 L5 19 M5 4 L16 4 L13 8 L16 12 L5 12" stroke="#fff" stroke-width="1.8" fill="#fff"/>',
};

window.REGION_META = REGION_META;
window.CATEGORY_META = CATEGORY_META;

// ---------------------------------------------------------------------------
// Build a Leaflet divIcon for a given feature. Pulls color/glyph from
// CATEGORY_META; if `verified === false`, applies a dashed-border modifier.
// ---------------------------------------------------------------------------
function buildPinIcon({ category, selected, verified }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.viewpoint;
  const verifiedClass = verified === false ? " map-pin--unverified" : "";
  const selectedClass = selected ? " map-pin--selected" : "";
  const html = `
    <div class="map-pin map-pin--${category}${verifiedClass}${selectedClass}" style="--pin-color:${meta.color}">
      <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">${GLYPH_SVG[meta.glyph] || ""}</svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: "map-pin-wrap",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  });
}

// ---------------------------------------------------------------------------
// MapView — initializes Leaflet once, then reconciles markers against
// (filteredFeatures, selectedPinId, hoveredPinId, selectionSource).
//
// Props:
//   features: Feature[]          — all features that pass the active filter
//   selectedPinId: string | null
//   selectionSource: "list" | "map" | "url" | null
//   hoveredPinId: string | null
//   onPinClick: (id) => void
// ---------------------------------------------------------------------------
function MapView({ features, selectedPinId, selectionSource, hoveredPinId, onPinClick, onMapReady }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // id → L.marker
  const layerRef = useRef(null); // L.layerGroup containing all markers

  // One-time init.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [37.8451, -119.5383], // approximate park centroid
      zoom: 10,
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true,
      // Disable Leaflet's fade-in animation. Without this, tiles can get stuck
      // at opacity:0 if the container resizes between map init and tile load
      // (e.g. when /map is loaded directly and the layout settles after React
      // hydration). With fadeAnimation:false, tiles appear immediately.
      fadeAnimation: false,
    });

    // USGS National Map Topo basemap. WMTS-style endpoint, no API key.
    L.tileLayer(
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        attribution:
          'Tiles &copy; <a href="https://www.usgs.gov/" target="_blank" rel="noopener">USGS</a> The National Map',
      }
    ).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    if (typeof onMapReady === "function") onMapReady(map);

    // Watch the container for size changes and tell Leaflet about them. The
    // editorial layout flips between a mobile-stacked column (<720px) and a
    // desktop split-view as the viewport changes, and the map can also be
    // initialized while the React tree is still settling. Without this, the
    // map's internal size stays at whatever it was on first paint and tiles
    // render for the wrong viewport (visible as a narrow strip of tiles or
    // tiles stuck at opacity 0). invalidateSize() recomputes everything.
    const ro = new ResizeObserver(() => {
      // animate:false avoids a flash of motion when the user just resized.
      map.invalidateSize({ animate: false });
    });
    ro.observe(containerRef.current);

    return () => {
      // Cleanup if the page unmounts.
      ro.disconnect();
      if (typeof onMapReady === "function") onMapReady(null);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current = {};
    };
    // onMapReady is intentionally not in the dep list — we only want to init
    // the map once. If the parent's callback identity changes, fine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconcile markers when features change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersRef.current = {};

    for (const feature of features) {
      const { id, category, verified } = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;
      const marker = L.marker([lat, lng], {
        icon: buildPinIcon({ category, selected: id === selectedPinId, verified }),
        keyboard: true,
        title: feature.properties.name,
      });
      marker.bindPopup(buildPopupHtml(feature), {
        autoPan: true,
        closeButton: true,
        maxWidth: 280,
      });
      marker.on("click", () => onPinClick(id));
      marker.addTo(layer);
      markersRef.current[id] = marker;
    }

    // After rebuilding markers, fit the bounds to all features (or center if empty).
    if (features.length > 0) {
      const bounds = L.latLngBounds(
        features.map((f) => [f.geometry.coordinates[1], f.geometry.coordinates[0]])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12, animate: false });
    }
    // Note: deliberately not depending on selectedPinId here — selection visuals
    // are handled by a separate effect below to avoid full marker rebuild on
    // every selection change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  // React to selection changes: update marker icon, fly the map (only if the
  // selection came from the list/url, not from clicking the pin itself), and
  // open the popup.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Reset every marker's icon to its base state, then mark the selected one.
    for (const feature of features) {
      const { id, category, verified } = feature.properties;
      const marker = markersRef.current[id];
      if (!marker) continue;
      marker.setIcon(
        buildPinIcon({
          category,
          selected: id === selectedPinId,
          verified,
        })
      );
    }
    if (selectedPinId && markersRef.current[selectedPinId]) {
      const marker = markersRef.current[selectedPinId];
      const latlng = marker.getLatLng();
      const shouldFly = selectionSource === "list" || selectionSource === "url";
      if (shouldFly) {
        map.flyTo(latlng, Math.max(map.getZoom(), 13), { duration: 0.6 });
      }
      marker.openPopup();
    } else {
      map.closePopup();
    }
  }, [selectedPinId, selectionSource, features]);

  // Hover halo. Applies a pulse class to the icon's outer wrapper without
  // moving the map. Map remains still — hover never pans.
  useEffect(() => {
    for (const id of Object.keys(markersRef.current)) {
      const marker = markersRef.current[id];
      const el = marker.getElement && marker.getElement();
      if (!el) continue;
      el.classList.toggle("map-pin-wrap--hovered", id === hoveredPinId);
    }
  }, [hoveredPinId, features]);

  return <div ref={containerRef} className="map-page__map" />;
}

window.MapView = MapView;

// ---------------------------------------------------------------------------
// Popup HTML builder. Kept as a string — Leaflet's bindPopup wants raw HTML
// and we don't need React-managed state inside.
// ---------------------------------------------------------------------------
function buildPopupHtml(feature) {
  const p = feature.properties;
  const meta = CATEGORY_META[p.category] || CATEGORY_META.viewpoint;
  const articles = Array.isArray(p.articles) ? p.articles : [];
  const articleLinks = articles.length
    ? `<div class="map-popup__articles">${articles
        .map((slug) => {
          const article =
            window.findArticle && window.findArticle(slug);
          if (!article) return "";
          return `<a href="/articles/${slug}">${escapeHtml(article.title)}</a>`;
        })
        .filter(Boolean)
        .join("")}</div>`
    : "";
  const image = p.image
    ? `<div class="map-popup__image-wrap"><img class="map-popup__image" src="${escapeAttr(
        p.image
      )}" alt="${escapeAttr(p.name)}" loading="lazy" /></div>`
    : "";
  const verifiedBadge =
    p.verified === false
      ? `<span class="map-popup__badge">approximate location</span>`
      : "";
  return `
    <article class="map-popup">
      ${image}
      <header class="map-popup__head">
        <span class="map-popup__category" style="--pin-color:${meta.color}">${escapeHtml(
    meta.label.replace(/s$/, "")
  )}</span>
        <h3 class="map-popup__title">${escapeHtml(p.name)}</h3>
        ${verifiedBadge}
      </header>
      <p class="map-popup__blurb">${escapeHtml(p.blurb || "")}</p>
      ${articleLinks}
    </article>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s) {
  return escapeHtml(s);
}

// ---------------------------------------------------------------------------
// FilterChips — multi-select OR with count badges. URL state lives upstream.
// ---------------------------------------------------------------------------
function FilterChips({ allFeatures, activeCategories, onToggle, onClear }) {
  // Count features per category off the unfiltered set so badges stay stable
  // as the user toggles.
  const counts = useMemo(() => {
    const c = {};
    for (const f of allFeatures) {
      const k = f.properties.category;
      c[k] = (c[k] || 0) + 1;
    }
    return c;
  }, [allFeatures]);

  const orderedCats = Object.keys(CATEGORY_META).filter((k) => counts[k]);

  return (
    <div className="map-page__chips">
      <button
        type="button"
        className={`map-chip${activeCategories.length === 0 ? " map-chip--on" : ""}`}
        onClick={onClear}
      >
        All <span className="map-chip__count">{allFeatures.length}</span>
      </button>
      {orderedCats.map((cat) => {
        const meta = CATEGORY_META[cat];
        const on = activeCategories.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            className={`map-chip${on ? " map-chip--on" : ""}`}
            style={{ "--pin-color": meta.color }}
            onClick={() => onToggle(cat)}
          >
            {meta.label}
            <span className="map-chip__count">{counts[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}

window.FilterChips = FilterChips;

// ---------------------------------------------------------------------------
// PinList — region-grouped scroll list. Sticky region headers; rows highlight
// on hover (which fires the pulse on the map) and on selection.
// ---------------------------------------------------------------------------
function PinList({
  features,
  selectedPinId,
  selectionSource,
  onSelect,
  onHover,
}) {
  const itemRefs = useRef({});

  // Scroll the selected item into view when the selection came from the map
  // or a URL deep-link. Skip when the user clicked the list itself —
  // they're already looking at it.
  useEffect(() => {
    if (!selectedPinId) return;
    if (selectionSource === "list") return;
    const el = itemRefs.current[selectedPinId];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedPinId, selectionSource]);

  // Group features by region, in the canonical region order.
  const grouped = useMemo(() => {
    const buckets = {};
    for (const f of features) {
      const r = f.properties.region;
      if (!buckets[r]) buckets[r] = [];
      buckets[r].push(f);
    }
    return Object.keys(buckets)
      .sort((a, b) => {
        const oa = REGION_META[a]?.order ?? 99;
        const ob = REGION_META[b]?.order ?? 99;
        return oa - ob;
      })
      .map((region) => ({ region, items: buckets[region] }));
  }, [features]);

  if (features.length === 0) {
    return (
      <div className="map-page__list map-page__list--empty">
        <p>No locations match the current filter. Clear the filter or pick a different category.</p>
      </div>
    );
  }

  return (
    <div className="map-page__list" onMouseLeave={() => onHover(null)}>
      {grouped.map(({ region, items }) => {
        const meta = REGION_META[region] || { label: region };
        return (
          <section key={region} className="map-list-group">
            <h2 className="map-list-group__heading">
              {meta.label} <span className="map-list-group__count">{items.length}</span>
            </h2>
            <ul className="map-list-group__items">
              {items.map((feature) => {
                const p = feature.properties;
                const catMeta = CATEGORY_META[p.category] || CATEGORY_META.viewpoint;
                const selected = p.id === selectedPinId;
                return (
                  <li
                    key={p.id}
                    ref={(el) => {
                      itemRefs.current[p.id] = el;
                    }}
                    className={`map-list-item${selected ? " map-list-item--selected" : ""}${
                      p.verified === false ? " map-list-item--unverified" : ""
                    }`}
                    onMouseEnter={() => onHover(p.id)}
                    onClick={() => onSelect(p.id, "list")}
                    style={{ "--pin-color": catMeta.color }}
                  >
                    <span className="map-list-item__dot" aria-hidden="true" />
                    <div className="map-list-item__body">
                      <h3 className="map-list-item__name">{p.name}</h3>
                      <p className="map-list-item__meta">
                        <span className="map-list-item__category">{catMeta.label.replace(/s$/, "")}</span>
                        {p.verified === false && (
                          <span className="map-list-item__badge">approx</span>
                        )}
                      </p>
                      {p.blurb && <p className="map-list-item__blurb">{p.blurb}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

window.PinList = PinList;
