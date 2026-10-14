#!/usr/bin/env bash
# Reports any editorial-site script/stylesheet referenced from index.html
# without a ?v= cache-buster query. Run before committing changes to JSX
# or CSS — a missing version means Cloudflare and browsers will serve
# stale bytes after deploy until the TTL expires.
#
# Exit 0 if every reference has a version; exit 1 otherwise.
#
# This guard checks PRESENCE and FORM, not freshness. Whether a script's or the
# stylesheet's hash is current is gen-asset-hashes.mjs --check; whether a
# hand-kept counter (BODY_VERSIONS, POINTS_URL, the bulletin, /img/) is current
# is check-asset-freshness.mjs. All three run in `npm run check`.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INDEX="$ROOT/index.html"

if [[ ! -f "$INDEX" ]]; then
  echo "check-cache-busters: $INDEX not found" >&2
  exit 2
fi

missing=$(
  grep -nE '(src|href)="[^"]+\.(jsx|js|css)"' "$INDEX" \
    | grep -vE '\?v=' \
    | grep -vE 'https?://' \
    || true
)

if [[ -n "$missing" ]]; then
  echo "Missing ?v= cache-buster on these references in index.html:"
  echo "$missing"
  exit 1
fi

# The values themselves are per-file content hashes written by
# gen-asset-hashes.mjs (October 2026; they replaced one shared number bumped by
# hand). Its --check, in `npm run check`, proves each one current.
hand_numbers=$(
  grep -nE '(src|href)="/[^"]+\.(jsx|js|css)\?v=' "$INDEX" \
    | grep -vE '\?v=[0-9a-f]{10}"' \
    || true
)
if [[ -n "$hand_numbers" ]]; then
  echo "These index.html references carry a ?v= that is not a 10-hex content hash."
  echo "Do not bump by hand: run npm --prefix scripts run assets:stamp."
  echo "$hand_numbers"
  exit 1
fi

# Article bodies load on demand (data.js#loadArticleBody) and are versioned in the
# window.BODY_VERSIONS map in data.js instead of as <script> tags in index.html.
# Verify that map stays in sync with the files in bodies/ so no body is loaded
# without a cache-buster, and no stale entry points at a deleted file.
DATA="$ROOT/data.js"
BODIES_DIR="$ROOT/bodies"
if [[ -f "$DATA" && -d "$BODIES_DIR" ]]; then
  # slugs declared in BODY_VERSIONS (keys between the object's braces)
  declared=$(
    awk '/window\.BODY_VERSIONS *= *\{/{f=1; next} f&&/\};/{f=0} f' "$DATA" \
      | grep -oE '"[^"]+"' | tr -d '"' | sort -u
  )
  # slugs present on disk
  on_disk=$(find "$BODIES_DIR" -maxdepth 1 -name '*.jsx' -exec basename {} .jsx \; | sort -u)

  not_declared=$(comm -13 <(echo "$declared") <(echo "$on_disk") || true)
  not_on_disk=$(comm -23 <(echo "$declared") <(echo "$on_disk") || true)

  if [[ -n "$not_declared" ]]; then
    echo "Article body files missing from window.BODY_VERSIONS in data.js:"
    echo "$not_declared"
    exit 1
  fi
  if [[ -n "$not_on_disk" ]]; then
    echo "window.BODY_VERSIONS entries with no matching file in bodies/:"
    echo "$not_on_disk"
    exit 1
  fi
fi

echo "All editorial JSX/JS/CSS references in index.html carry a ?v= content hash."
echo "window.BODY_VERSIONS is in sync with bodies/."
