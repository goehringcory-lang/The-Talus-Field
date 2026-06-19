// Dependency-free XML well-formedness check, enough to validate the generated
// sitemap.xml and feed.xml (catches unbalanced/unclosed tags, the classic way a
// hand-bumped mirror breaks Buttondown's feed pull or a sitemap submission).
//
// Not a full parser: it ignores attribute-value correctness but verifies tag
// nesting balances, handling comments, CDATA, the XML declaration, and
// self-closing tags. Returns { ok, error } where error names the first problem.

export function xmlWellFormed(src) {
  const stack = [];
  let i = 0;
  const n = src.length;

  while (i < n) {
    const lt = src.indexOf("<", i);
    if (lt === -1) break;
    i = lt;

    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      if (end === -1) return { ok: false, error: "unterminated comment" };
      i = end + 3;
      continue;
    }
    if (src.startsWith("<![CDATA[", i)) {
      const end = src.indexOf("]]>", i + 9);
      if (end === -1) return { ok: false, error: "unterminated CDATA" };
      i = end + 3;
      continue;
    }
    if (src.startsWith("<?", i)) {
      const end = src.indexOf("?>", i + 2);
      if (end === -1) return { ok: false, error: "unterminated processing instruction" };
      i = end + 2;
      continue;
    }
    if (src.startsWith("<!", i)) {
      const end = src.indexOf(">", i + 2);
      if (end === -1) return { ok: false, error: "unterminated declaration" };
      i = end + 1;
      continue;
    }

    const gt = src.indexOf(">", i);
    if (gt === -1) return { ok: false, error: "unterminated tag" };
    const raw = src.slice(i + 1, gt).trim();
    i = gt + 1;

    if (raw.startsWith("/")) {
      const name = raw.slice(1).trim().split(/\s/)[0];
      const top = stack.pop();
      if (top !== name) {
        return { ok: false, error: `mismatched closing tag </${name}> (expected </${top ?? "?"}>)` };
      }
    } else if (raw.endsWith("/")) {
      // self-closing, no stack change
    } else {
      const name = raw.split(/\s/)[0];
      if (name) stack.push(name);
    }
  }

  if (stack.length) return { ok: false, error: `unclosed tag <${stack[stack.length - 1]}>` };
  return { ok: true };
}
