#!/usr/bin/env bash
# Push a list of changed URLs to IndexNow via the Worker. Bing, Yandex,
# Seznam, Naver, and Yep all subscribe to the same endpoint, so a single
# call fans out to all of them.
#
# Usage:
#   INDEXNOW_ADMIN_TOKEN=... ./scripts/indexnow-ping.sh URL [URL ...]
#
# Example:
#   INDEXNOW_ADMIN_TOKEN=hunter2 ./scripts/indexnow-ping.sh \
#     https://thetalusfieldjournal.com/ \
#     https://thetalusfieldjournal.com/articles/tioga-road-opening-weekend-2026

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 URL [URL ...]" >&2
  exit 2
fi

: "${INDEXNOW_ADMIN_TOKEN:?Set INDEXNOW_ADMIN_TOKEN to the secret configured on the Worker}"
: "${INDEXNOW_ENDPOINT:=https://api.thetalusfieldjournal.com/api/indexnow/submit}"

# Build a JSON array of the URL arguments.
urls_json=$(printf '%s\n' "$@" | python3 -c '
import json, sys
print(json.dumps([line.strip() for line in sys.stdin if line.strip()]))
')

curl -fsS \
  -X POST "$INDEXNOW_ENDPOINT" \
  -H "Authorization: Bearer $INDEXNOW_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"urls\": $urls_json}"
echo
