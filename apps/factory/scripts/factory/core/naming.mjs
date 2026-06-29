import { snakeCase as toSnakeCase } from "change-case";

// snake_case via change-case (the canonical implementation for the whole repo —
// spec-code-trace, plan-mock-data and scaffold-simulator-pack all import this).
// change-case splits camelCase/PascalCase AND runs of capitals at word
// boundaries, so acronyms collapse cleanly ("Salesforce CRM" -> "salesforce_crm")
// instead of the per-letter "salesforce__c_r_m" the old hand-rolled regex emitted.
// Already-snake input is idempotent, so values canonicalized once stay stable.
export function snakeCase(value) {
  return toSnakeCase(String(value || ""));
}

export function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function canonicalSystemId(systemName) {
  // change-case already yields a clean single-underscore, trimmed form.
  return snakeCase(String(systemName || "source_system")) || "source_system";
}

export function safePyName(value, fallback = "value") {
  const normalized = snakeCase(String(value || fallback)) || fallback;
  return /^[A-Za-z_]/.test(normalized) ? normalized : `_${normalized}`;
}

export function validPythonIdentifierName(value, fallback = "agent") {
  const name = snakeCase(String(value || fallback)) || fallback;
  return /^[A-Za-z_]/.test(name) ? name : `agent_${name}`;
}

// FNV-1a 32-bit hash → 6 lowercase hex chars. Dependency-free (no node:crypto)
// so this stays usable from any bundle/runtime, and deterministic across hosts.
function shortHash6(value) {
  let hash = 0x811c9dc5;
  const str = String(value);
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    // hash *= 16777619, kept in 32-bit space via Math.imul
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

// agents-cli enforces a <=26-char project name AND normalizes it (lowercase,
// underscores→hyphens) — and its <=26 check runs on the raw string BEFORE
// normalization. So the name we emit must be <=26 chars as-written and valid in
// snake_case (underscores; the only chars agents-cli's normalize touches). This
// produces a readable, deterministic, collision-resistant short form:
//   "<truncated-snake-base>_<6-hex hash of full id>"
// guaranteeing uniqueness for distinct ids while staying within the bound. The
// hash is over the ORIGINAL id (not the truncated base) so two ids that share a
// prefix still get distinct names. Stable for a given id; valid Python/cloud id.
export function shortAgentName(value, { maxLen = 26, fallback = "agent" } = {}) {
  const full = validPythonIdentifierName(value, fallback);
  if (full.length <= maxLen) return full;
  const suffix = `_${shortHash6(full)}`; // 7 chars
  const baseBudget = Math.max(1, maxLen - suffix.length);
  // Truncate on the snake base, then trim a trailing underscore so we never emit
  // a double "__" or a trailing "_" before the suffix.
  const base = full.slice(0, baseBudget).replace(/_+$/g, "") || fallback.slice(0, baseBudget);
  return `${base}${suffix}`;
}
