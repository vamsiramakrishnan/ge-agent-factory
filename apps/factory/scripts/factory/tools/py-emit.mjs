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
