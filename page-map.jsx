/* global React */
// =============================================================================
// MAP PAGE — `/map` route. Google Maps JavaScript API.
//
// The Maps API <script> tag lives in index.html (loaded async). This component
// fetches /points.geojson, waits for window.google.maps to be ready, then
// initializes a single map inside the container ref. Markers come from the
// geojson; clicking one opens an InfoWindow with the stop's name and blurb.
//
// API KEY: replace YOUR_GOOGLE_MAPS_API_KEY in index.html with a real key.
// Restrict it in the Google Cloud console to HTTP-referrer
// `https://thetalusfieldjournal.com/*` (and `http://localhost:8765/*` for dev)
// before pushing to production. Maps JS API must be enabled on the project.
// =============================================================================

const { useEffect, useRef, useState } = React;

const POINTS_URL = "/points.geojson?v=1";

// Polls window.google.maps for up to 8s. The script in index.html loads
// async, so the namespace may not exist yet when MapPage mounts.
function waitForGoogleMaps(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        resolve(window.google.maps);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(
          new Error(
            "Google Maps API didn't load. Check the API key in index.html and that the Maps JavaScript API is enabled in the Cloud console."
          )
        );
      }
    }, 100);
  });
}

function MapPage() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [features, setFeatures] = useState(null); // null = loading
  const [error, setError] = useState(null);

  // Fetch points.geojson once.
  useEffect(() => {
    let cancelled = false;
    fetch(POINTS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${POINTS_URL}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFeatures((data && data.features) || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setFeatures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize the map once Google Maps is ready AND features have loaded
  // AND the container is in the DOM. Waiting for features means we know what
  // bounds to fit at init, so the very first paint is already framed to the
  // pin set rather than starting at a default zoom and snapping.
  useEffect(() => {
    if (mapRef.current) return; // already initialized
    if (!features || features.length === 0) return;
    if (!containerRef.current) return;

    let listener = null;
    waitForGoogleMaps()
      .then((maps) => {
        const map = new maps.Map(containerRef.current, {
          center: { lat: 37.85, lng: -119.55 }, // Yosemite National Park
          zoom: 10,
          mapTypeId: "terrain",
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy", // single-finger pan on mobile
        });
        mapRef.current = map;

        // One bounds + marker pass. Drop a default pin per feature with an
        // InfoWindow on click. (For category-colored custom pins later, swap
        // `new maps.Marker` for `new maps.marker.AdvancedMarkerElement` and
        // build a content DOM node — requires the `marker` library, which is
        // already requested in the script-tag URL.)
        const bounds = new maps.LatLngBounds();
        const info = new maps.InfoWindow();

        for (const feature of features) {
          const [lng, lat] = feature.geometry.coordinates;
          const p = feature.properties;
          const position = { lat, lng };
          bounds.extend(position);

          const marker = new maps.Marker({
            position,
            map,
            title: p.name,
          });

          marker.addListener("click", () => {
            info.setContent(buildInfoHtml(p));
            info.open({ anchor: marker, map });
          });
        }

        // Frame to fit all markers (40px padding on each side), but cap how
        // far in we zoom — fitBounds on a single point would zoom to 21.
        map.fitBounds(bounds, 40);
        listener = maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom() > 12) map.setZoom(12);
        });
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      if (listener && window.google && window.google.maps) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [features]);

  if (features === null) {
    return (
      <div className="map-page map-page--loading">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      {error && (
        <div className="map-page__error" role="alert">
          Map failed to load: {error}
        </div>
      )}
      <div ref={containerRef} id="map" className="map-page__map" />
    </div>
  );
}

// Plain-string HTML for the InfoWindow. Google Maps' InfoWindow takes either
// a string or a DOM node; string is simplest and fine for this content.
function buildInfoHtml(p) {
  const blurb = p.blurb ? `<p style="margin:6px 0 0;">${escapeHtml(p.blurb)}</p>` : "";
  const cat = p.category
    ? `<span style="text-transform:uppercase;font-size:11px;letter-spacing:0.06em;color:#777;">${escapeHtml(
        p.category
      )}</span>`
    : "";
  return `
    <div style="font:14px/1.4 system-ui,sans-serif;max-width:240px;color:#222;">
      <strong style="font-size:15px;">${escapeHtml(p.name || "")}</strong><br/>
      ${cat}
      ${blurb}
    </div>
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

window.MapPage = MapPage;
