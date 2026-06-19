// Tiny finding/severity helper shared by the system-checks modules.
//
// Each check builds a Check, records error()/warn()/info() findings, and returns
// check.result(). The orchestrator (system-checks.mjs) aggregates results and
// exits non-zero when any check has an error-severity finding. Warnings never
// fail the suite; they surface drift to fix without breaking the nightly run.

export function makeCheck(name) {
  const findings = [];
  return {
    error: (msg) => findings.push({ level: "error", msg }),
    warn: (msg) => findings.push({ level: "warn", msg }),
    info: (msg) => findings.push({ level: "info", msg }),
    result: () => ({ name, findings }),
  };
}

export function summarize(results) {
  let errors = 0;
  let warns = 0;
  for (const r of results) {
    for (const f of r.findings) {
      if (f.level === "error") errors++;
      else if (f.level === "warn") warns++;
    }
  }
  return { errors, warns };
}
