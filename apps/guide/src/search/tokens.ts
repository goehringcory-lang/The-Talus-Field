// The search tokenizer, on its own so the map's search can share it without
// importing the guide-wide index (which builds itself from every content
// module at import).

// The forms of a query word worth trying. The park names its falls in the
// singular ("Vernal Fall", "Nevada Fall") and readers type the plural, so a
// trailing s, es, or ies is also tried without it; a substring match already
// covers the other direction ("fall" finds "falls").
export function tokenVariants(token: string): string[] {
  const out = [token]
  if (token.length > 4 && token.endsWith('ies')) out.push(token.slice(0, -3) + 'y')
  if (token.length > 4 && token.endsWith('es')) out.push(token.slice(0, -2))
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) out.push(token.slice(0, -1))
  return out
}

/** The lowercase query words, as search() splits them. */
export function queryTokens(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter((t) => t.length >= 2)
}
