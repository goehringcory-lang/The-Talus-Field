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

echo "All editorial JSX/JS/CSS references in index.html carry a ?v= query."
