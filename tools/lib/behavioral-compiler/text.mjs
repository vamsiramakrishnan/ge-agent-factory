// Tiny deterministic text helpers shared by the behavioral compiler.
//
// Everything here is pure string → string: slugs feed stable node/case ids
// (the determinism contract — same spec, byte-identical artifacts), tokens
// feed the keyword matcher that links capabilities to tools/claims.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "into", "that", "this", "their",
  "query", "action", "lookup", "get", "list", "fetch", "retrieve", "update",
]);

export function slugify(text, { maxLength = 48 } = {}) {
  const slug = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= maxLength) return slug || "item";
  // Cut on a word boundary so trimming never leaves a dangling hyphen.
  return slug.slice(0, maxLength).replace(/-[^-]*$/, "") || slug.slice(0, maxLength);
}

// Content-bearing tokens for keyword matching: length ≥ 4 keeps system-id
// noise ("fi", "s") and connectives out without a domain dictionary.
export function tokens(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

export function sharesToken(textA, textB) {
  const setB = new Set(tokens(textB));
  return tokens(textA).some((token) => setB.has(token));
}

export function firstWords(text, count) {
  return String(text).trim().split(/\s+/).slice(0, count).join(" ").replace(/[.,;:]+$/, "");
}

export function lowerFirst(text) {
  const value = String(text);
  return value.charAt(0).toLowerCase() + value.slice(1);
}
