// Low-level Python source-emit primitives shared by every generated-Python
// renderer (tools.py, agent.py, contract tools). Extracted from factory.mjs so
// renderer modules can depend on them without importing the command orchestrator.
// Pure string transforms — byte output is identical to the former inline helpers.

// Escape a value for embedding inside a Python double-quoted string literal.
export function pyEscape(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Escape a value for embedding inside a Python triple-quoted string literal.
export function pyTripleEscape(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
}

// Serialize a JS value as a Python literal — the JSON-safe subset (object/
// array/string/number/bool/null) rendered with Python's spellings for the
// three JSON literals JSON.stringify would otherwise emit verbatim (null,
// true, false), which are not valid Python and raise NameError at import
// time. Recurses token-by-token instead of JSON.stringify-then-regex, so a
// string *value* that happens to contain the text "null"/"true"/"false" is
// never touched — only actual null/true/false literals are. Uses the same
// compact (no-space) separators JSON.stringify defaults to, so output is
// byte-identical to the former JSON.stringify call wherever no null/true/
// false value was actually present — only the previously-broken cases change.
export function pyJson(value) {
  if (value === null || value === undefined) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (Array.isArray(value)) return `[${value.map(pyJson).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}:${pyJson(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
