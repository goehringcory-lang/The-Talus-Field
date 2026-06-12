#!/usr/bin/env bash
# Reports any editorial-site script/stylesheet referenced from index.html
# without a ?v=N cache-buster query. Run before committing changes to JSX
# or CSS — a missing version means Cloudflare and browsers will serve
# stale bytes after deploy until the TTL expires.
#
# Exit 0 if every reference has a version; exit 1 otherwise.

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
  echo "Missing ?v=N cache-buster on these references in index.html:"
  echo "$missing"
  exit 1
fi

# All local script/stylesheet references in index.html share ONE version
# number, bumped together when shipping a batch. The leading ="/ anchor
# limits the match to same-origin files, so external https:// URLs are
# excluded. points.geojson (own counter inside page-map.jsx) and article
# bodies (per-slug BODY_VERSIONS, checked below) are exempt because they
# are not referenced from index.html.
shared_versions=$(
  grep -oE '(src|href)="/[^"]+\.(jsx|js|css)\?v=[0-9]+"' "$INDEX" \
    | grep -oE '\?v=[0-9]+' | sort -u
)
if [[ $(echo "$shared_versions" | wc -l) -ne 1 ]]; then
  echo "Shared ?v= values in index.html are not identical (one canonical number expected):"
  grep -nE '(src|href)="/[^"]+\.(jsx|js|css)\?v=[0-9]+"' "$INDEX"
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

echo "All editorial JSX/JS/CSS references in index.html carry a ?v= query,"
echo "all sharing one canonical version number."
echo "window.BODY_VERSIONS is in sync with bodies/."
