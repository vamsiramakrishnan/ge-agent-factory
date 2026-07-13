/**
 * Build stable fragment targets for generated catalog records.
 *
 * Specs can mention tools or entities that are intentionally not included in
 * the rendered inventory. Callers must resolve a reference through this index
 * before rendering a link; an unresolved reference stays readable text.
 */

/** @param {unknown} value */
const referenceKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** @param {unknown} value */
const fragmentPart = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * @template T
 * @param {T[]} items
 * @param {{ prefix: string, name?: (item: T) => unknown }} options
 */
export function createFragmentIndex(items, { prefix, name = (item) => item }) {
  const used = new Set();
  const exact = new Map();
  const normalized = new Map();

  const entries = items.map((item, index) => {
    const label = String(name(item) ?? "");
    const base = fragmentPart(label) || String(index + 1);
    let id = `${prefix}-${base}`;
    let suffix = 2;
    while (used.has(id)) id = `${prefix}-${base}-${suffix++}`;
    used.add(id);

    // An exact duplicate is ambiguous, as is a punctuation-only variation
    // after normalization. Exact distinct names still resolve to their own ID.
    if (exact.has(label)) exact.set(label, null);
    else exact.set(label, id);

    const key = referenceKey(label);
    if (normalized.has(key)) normalized.set(key, null);
    else normalized.set(key, id);

    return { item, id };
  });

  return {
    entries,
    /** @param {unknown} value */
    resolve(value) {
      const label = String(value ?? "");
      const exactMatch = exact.get(label);
      if (typeof exactMatch === "string") return exactMatch;
      const normalizedMatch = normalized.get(referenceKey(label));
      return typeof normalizedMatch === "string" ? normalizedMatch : null;
    },
  };
}
