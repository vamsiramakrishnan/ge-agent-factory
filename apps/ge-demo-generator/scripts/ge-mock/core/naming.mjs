export function snakeCase(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_+|_+$/g, "");
}

export function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function canonicalSystemId(systemName) {
  return snakeCase(String(systemName || "source_system"))
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "") || "source_system";
}

export function safePyName(value, fallback = "value") {
  const normalized = snakeCase(String(value || fallback)) || fallback;
  return /^[A-Za-z_]/.test(normalized) ? normalized : `_${normalized}`;
}

export function validPythonIdentifierName(value, fallback = "agent") {
  const name = snakeCase(String(value || fallback)) || fallback;
  return /^[A-Za-z_]/.test(name) ? name : `agent_${name}`;
}
