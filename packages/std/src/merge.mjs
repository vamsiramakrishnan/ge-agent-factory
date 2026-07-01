// Merge two arrays-of-objects into one, keyed by a caller-chosen field. The
// "collect into a Map by key, then spread back out to an array" shape recurs
// wherever a generated/derived list of items needs to be reconciled against a
// previously-persisted list (e.g. artifact manifests, projection collections)
// without losing fields the persisted side already had.
//
// `keyFn` extracts the merge key from an item (falsy keys are dropped, same
// as the original hand-rolled loops). `mergeFn(existing, next)` is called for
// every `next` item — `existing` is `undefined` when the key wasn't present
// on the existing side, same as a plain `byMap.get(key)` miss — and decides
// how the two are combined. It defaults to `{ ...existing, ...next }` (next's
// fields win, existing's untouched fields survive; `existing` may be
// `undefined`, which spreads to nothing) since that was the behavior at the
// two call sites this was extracted from. Items present only on the existing
// side (no matching `next` item) pass through unchanged.
export function mergeByKey(existingItems = [], nextItems = [], keyFn, mergeFn = (existing, next) => ({ ...existing, ...next })) {
  const byKey = new Map();
  for (const item of existingItems || []) {
    const key = keyFn(item);
    if (key) byKey.set(key, item);
  }
  for (const item of nextItems || []) {
    const key = keyFn(item);
    if (!key) continue;
    byKey.set(key, mergeFn(byKey.get(key), item));
  }
  return Array.from(byKey.values());
}
