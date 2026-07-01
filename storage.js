// Safe localStorage wrapper for the editorial site. localStorage throws in
// Safari private mode (setItem), on quota errors, and when storage is
// disabled, so every read and write on the site goes through this object and
// a throwing storage never breaks a page. Loaded in index.html before
// components.jsx and the page scripts.
//
// get(key, fallback): the stored string, null when the key is absent, or
//   `fallback` (default null) when storage itself is UNAVAILABLE. Callers
//   that must fail open (the map gate) pass their unlocked value as the
//   fallback so "storage threw" and "key absent" stay distinguishable.
// getJSON(key): parsed value, or null when absent, unparseable, or unavailable.
// set / setJSON: true on success, false when storage is unavailable.
// remove(key): deletes the key; true on success, false when unavailable.
window.safeStorage = {
  get(key, fallback) {
    try {
      return window.localStorage.getItem(key);
    } catch (_e) {
      return fallback === undefined ? null : fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (_e) {
      return false;
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (_e) {
      return false;
    }
  },
  getJSON(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_e) {
      return null;
    }
  },
  setJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_e) {
      return false;
    }
  },
};
