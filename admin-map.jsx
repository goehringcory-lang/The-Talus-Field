/* global React, L */
// =============================================================================
// ADMIN MAP OVERLAY — coordinate-capture tool gated by ?admin=1.
//
// Usage: visit /map?admin=1, click anywhere on the map. The clicked location's
// decimal-degree coordinates are copied to the clipboard as a paste-ready
// GeoJSON fragment, and a small toast confirms the values.
//
// Design notes:
//   - No auth. There's nothing to protect — the GeoJSON is already public, and
//     the overlay only writes to the editor's clipboard.
//   - Uses the Leaflet `map` instance from MapView via a ref handed down by
//     MapPage. We attach a click handler on mount and clean it up on unmount.
//   - The toast renders into the map page itself so it's visible over the map.
// =============================================================================

const { useEffect, useState } = React;

function AdminOverlay({ map }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    container.classList.add("map-admin-active");

    const handler = async (e) => {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      const fragment = `"coordinates": [${lng}, ${lat}]`;
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(fragment);
          copied = true;
        }
      } catch (err) {
        // Clipboard API can fail in insecure contexts or denied permissions.
        // Fall through with copied=false; the toast still surfaces the values.
        copied = false;
      }
      setToast({ lat, lng, fragment, copied, ts: Date.now() });
    };

    map.on("click", handler);
    return () => {
      map.off("click", handler);
      container.classList.remove("map-admin-active");
    };
  }, [map]);

  // Auto-dismiss the toast after 3.5s so it doesn't pile up.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <>
      <div className="map-admin-banner" role="status">
        Admin mode — click the map to copy coordinates
      </div>
      {toast && (
        <div className="map-admin-toast" role="status">
          <strong>{toast.copied ? "Copied" : "Got"}:</strong>
          <code>{toast.fragment}</code>
          <span className="map-admin-toast__hint">
            {toast.copied
              ? "Paste into points.geojson"
              : "Clipboard unavailable — copy manually"}
          </span>
        </div>
      )}
    </>
  );
}

window.AdminOverlay = AdminOverlay;
