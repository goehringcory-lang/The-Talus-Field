-- Entrance-gate wait log (lib/gateWaits.ts). One row per gate per cron run.
-- Apply with: npx wrangler d1 migrations apply talus-gate-waits --remote
--
-- WITHOUT ROWID makes the primary key the table itself, so each insert is one
-- row written in D1's accounting instead of two (table + PK index), and the
-- export's time-range scan walks the key in order.
CREATE TABLE IF NOT EXISTS gate_waits (
  ts_utc       TEXT    NOT NULL,  -- ISO 8601 UTC, the run's scheduled minute
  gate         TEXT    NOT NULL,  -- "South Entrance", "Arch Rock", "Big Oak Flat"
  wait_minutes INTEGER,           -- NULL when the feed gave no number
  raw_status   TEXT    NOT NULL,  -- ok | stale | missing
  PRIMARY KEY (ts_utc, gate)
) WITHOUT ROWID;
