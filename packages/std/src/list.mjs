// Parse a delimited string into a trimmed, empty-free list — the
// `s.split(sep).map(x => x.trim()).filter(Boolean)` idiom that recurred ~30x
// across env-var and flag handling. String(value ?? "") makes a null/undefined
// input yield [] instead of throwing; for the string inputs every call site
// already passes, the result is identical.
export function parseList(value, sep = ",") {
  return String(value ?? "")
    .split(sep)
    .map((item) => item.trim())
    .filter(Boolean);
}
