// Shared JSON fetch for the online checks and the nightly deploy-parity log.
//
// Moved out of checks/api.mjs when deploy-parity.mjs needed the same shape.
// Node 22's global fetch, no dependencies: the lighthouse job in
// system-checks.yml runs the parity log without `npm ci`, so anything this
// file imports has to be a builtin.

export async function getJson(url, { timeoutMs = 12000, retries = 1, headers = {} } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "talus-field-system-checks", ...headers },
        signal: ctrl.signal,
      });
      const text = await res.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch {
        /* non-JSON body is itself the finding; callers see body === null */
      }
      return { ok: res.ok, status: res.status, body, res };
    } catch (e) {
      if (attempt === retries) return { ok: false, status: 0, body: null, error: e.message };
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, status: 0, body: null, error: "unreachable" };
}
