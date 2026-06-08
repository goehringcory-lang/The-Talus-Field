#!/usr/bin/env bash
# Fails if any generated SEO/AI-search mirror is stale relative to its sources
# (data.js + seo-data.json). Run before committing changes to articles, data.js,
# or seo-data.json. Regenerate with: npm --prefix scripts run seo
#
# Requires Node (the editorial site itself is build-free; this is dev tooling).
# Kept separate from check-cache-busters.sh, which is pure bash with no Node dep.
#
# Exit 0 if every mirror is up to date; exit 1 otherwise.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "check-seo-artifacts: node not found; skipping" >&2
  exit 0
fi

node "$ROOT/scripts/gen-seo-artifacts.mjs" --check
