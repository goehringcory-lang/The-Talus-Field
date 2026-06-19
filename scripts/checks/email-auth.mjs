// Email-auth spot check (online).
//
// Deliverability for the Worker's transactional mail (Resend; see
// workers/src/lib/email.ts) and the newsletter depends on SPF, DKIM, and DMARC
// resolving for thetalusfieldjournal.com. DNS is external and changes rarely, so
// failures here are warnings, not hard errors — but a silent SPF/DMARC drop tanks
// inbox placement, and the check is free.
//
// Skipped offline (needs DNS egress, which this sandbox lacks).

import { promises as dns } from "node:dns";
import { makeCheck } from "../lib/report.mjs";

const DOMAIN = "thetalusfieldjournal.com";
// Resend's default DKIM publishing selector.
const DKIM_HOST = `resend._domainkey.${DOMAIN}`;

async function txt(host) {
  try {
    const records = await dns.resolveTxt(host);
    return records.map((chunks) => chunks.join(""));
  } catch {
    return null;
  }
}

export default async function checkEmailAuth(ctx) {
  const check = makeCheck("Email auth (SPF/DKIM/DMARC)");
  if (!ctx.online) {
    check.info("skipped (offline; needs DNS egress)");
    return check.result();
  }

  const root = await txt(DOMAIN);
  if (!root) check.warn(`could not resolve TXT for ${DOMAIN}`);
  else if (!root.some((r) => /v=spf1/i.test(r))) check.warn(`no SPF record (v=spf1) on ${DOMAIN}`);
  else check.info("SPF present");

  const dmarc = await txt(`_dmarc.${DOMAIN}`);
  if (!dmarc || !dmarc.some((r) => /v=DMARC1/i.test(r))) check.warn(`no DMARC record on _dmarc.${DOMAIN}`);
  else check.info("DMARC present");

  // Resend publishes DKIM as a CNAME or TXT under resend._domainkey.
  let dkimOk = !!(await txt(DKIM_HOST));
  if (!dkimOk) {
    try {
      await dns.resolveCname(DKIM_HOST);
      dkimOk = true;
    } catch {
      /* not a CNAME either */
    }
  }
  if (!dkimOk) check.warn(`DKIM selector ${DKIM_HOST} did not resolve`);
  else check.info("DKIM selector resolves");

  return check.result();
}
