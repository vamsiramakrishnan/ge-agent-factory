/**
 * Redaction: the one module every live-system capture passes through before
 * any byte reaches disk — Phase 2 of docs/plans/real-system-twins/. The
 * profiler, the recorder, and every import adapter (NDJSON, HAR) call
 * `redactExchange` on each request/response pair; nothing they persist may
 * bypass it.
 *
 * Design rules (safety-critical — see the golden fixtures in src/fixtures/):
 *
 * 1. Headers are DEFAULT-DENY for credentials. `authorization`, `cookie`,
 *    `set-cookie`, `x-api-key` and friends are masked with no policy at all;
 *    a policy can only ADD masked headers, never unmask the built-ins.
 * 2. Body redaction is policy-driven (mask/drop/hash by field path) plus
 *    built-in PII detectors (email, phone-like, SSN-like, card-like) that
 *    are ON by default and can only be widened, not disabled, by policy.
 * 3. Every redaction is reported: the redaction report is the reviewable
 *    evidence that a capture was clean ("what survived" is checkable).
 * 4. Pure, no IO. Determinism matters: same input + policy + referenced hash
 *    key → byte-identical output, so behavior changes surface as golden
 *    diffs. Hash keys are resolved from an env object and never stored in a
 *    policy or artifact; without one, a hash rule fails safe to masking.
 *
 * Policy (`ge.redaction-policy.v1`):
 *   { schemaVersion, headers?: { mask?: [names] },
 *     fields?: [{ path: "a.b.*.c", action: "mask"|"drop"|"hash" }],
 *     detectors?: { email?, phone?, ssn?, card? },  // reserved; always on
 *     hashing?: { keyRef: "env:VAR" }
 *   }
 */

import { createHash, createHmac } from "node:crypto";

export const REDACTION_POLICY_SCHEMA_VERSION = "ge.redaction-policy.v1";
export const REDACTION_REPORT_SCHEMA_VERSION = "ge.redaction-report.v1";

export const MASKED = "[REDACTED]";

/** Header names masked unconditionally — a policy can add, never remove. */
export const DENY_HEADERS = Object.freeze([
  "authorization",
  "proxy-authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-goog-api-key",
  "api-key",
]);

// Built-in PII detectors. Deliberately conservative patterns — a detector
// that fires on everything makes captures useless; one that misses leaks.
// Card check includes a Luhn pass so order numbers don't mass-trigger.
const DETECTORS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  phone: /(?:(?<=\s)|^)\+?\d{1,2}[\s.-]?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
  card: /\b(?:\d[ -]?){13,19}\b/g,
};

const SECRET_FIELD = /(^|_)(api_key|authorization|cookie|credential|client_secret|password|passwd|pwd|private_key|secret|session|sig|signature|token)($|_)/i;
const QUERY_PII_FIELD = /(^|_)(address|card|date_of_birth|dob|email|first_name|last_name|name|phone|ssn|social_security|tax_id)($|_)/i;
const QUERY_AUTH_FIELD = /(^|_)(assertion|code|jwt|oauth_state|relay_state|saml_response|ticket)($|_)/i;
const URL_PATTERN = /https?:\/\/[^\s"'<>]+/gi;

function luhnValid(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Validate a policy object. Returns problems (empty = valid). */
export function validateRedactionPolicy(policy) {
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) return ["policy must be an object"];
  const problems = [];
  if (policy.schemaVersion !== REDACTION_POLICY_SCHEMA_VERSION) {
    problems.push(`schemaVersion must be "${REDACTION_POLICY_SCHEMA_VERSION}"`);
  }
  for (const [i, rule] of (policy.fields || []).entries()) {
    if (!rule || typeof rule.path !== "string" || !rule.path.trim()) problems.push(`fields[${i}].path must be a non-empty string`);
    if (!["mask", "drop", "hash"].includes(rule?.action)) problems.push(`fields[${i}].action must be mask|drop|hash`);
  }
  if (policy.headers?.mask !== undefined) {
    if (!Array.isArray(policy.headers.mask) || !policy.headers.mask.every((h) => typeof h === "string")) {
      problems.push("headers.mask must be an array of header names");
    }
  }
  if (policy.hashing !== undefined) {
    if (!policy.hashing || typeof policy.hashing !== "object" || Array.isArray(policy.hashing)) {
      problems.push("hashing must be an object");
    } else if (!/^env:[A-Z][A-Z0-9_]*$/.test(policy.hashing.keyRef || "")) {
      problems.push("hashing.keyRef must be env:<VAR>");
    }
  }
  return problems;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** Stable semantic policy identity (formatting and object-key order do not matter). */
export function hashRedactionPolicy(policy) {
  const problems = validateRedactionPolicy(policy);
  if (problems.length) throw new Error(`invalid redaction policy: ${problems.join("; ")}`);
  return `sha256:${createHash("sha256").update(canonicalJson(policy)).digest("hex")}`;
}

function resolveHashKey(policy, env) {
  const match = /^env:([A-Z][A-Z0-9_]*)$/.exec(policy?.hashing?.keyRef || "");
  if (!match) return null;
  const key = env?.[match[1]];
  return typeof key === "string" && key.length ? key : null;
}

function keyedHash(value, key) {
  return `hmac-sha256:${createHmac("sha256", key).update(canonicalJson(value)).digest("hex")}`;
}

function pathMatches(pattern, path) {
  const p = pattern.split(".");
  const q = path.split(".");
  if (p.length !== q.length) return false;
  return p.every((seg, i) => seg === "*" || seg === q[i]);
}

// All built-in detectors run unconditionally (rule 2: they can be widened
// by future policy versions, never disabled). `policy.detectors` is
// accepted-but-reserved so a v1 policy that names them stays valid.
function normalizeFieldName(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toLowerCase();
}

function secretField(name) {
  return SECRET_FIELD.test(normalizeFieldName(name));
}

function sensitiveQueryField(name) {
  const normalized = normalizeFieldName(name);
  return secretField(normalized) || QUERY_PII_FIELD.test(normalized) || QUERY_AUTH_FIELD.test(normalized);
}

function decodeRepeated(value) {
  let decoded = String(value);
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded.replace(/\+/g, "%20"));
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function scrubPlainString(value, report, path) {
  let out = value;
  for (const name of Object.keys(DETECTORS)) {
    out = out.replace(DETECTORS[name], (match) => {
      if (name === "card" && !luhnValid(match.replace(/[^0-9]/g, ""))) return match;
      report.push({ path, rule: `detector:${name}`, action: "mask" });
      return MASKED;
    });
  }
  if (out === value) {
    const decoded = decodeRepeated(value);
    if (decoded !== value) {
      const decodedReport = [];
      const scrubbed = scrubPlainString(decoded, decodedReport, path);
      if (scrubbed !== decoded) {
        report.push(...decodedReport);
        return scrubbed;
      }
    }
  }
  return out;
}

function redactParameters(params, report, path) {
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    params.delete(key);
    for (const valuePart of values) {
      if (sensitiveQueryField(key)) {
        params.append(key, MASKED);
        report.push({ path: `${path}.${key}`, rule: "query-key:default-deny", action: "mask" });
        continue;
      }
      const decoded = decodeRepeated(valuePart);
      const decodedReport = [];
      const scrubbed = scrubPlainString(decoded, decodedReport, `${path}.${key}`);
      if (scrubbed !== decoded) report.push(...decodedReport);
      params.append(key, scrubbed !== decoded ? scrubbed : valuePart);
    }
  }
}

function redactUrl(value, report, path) {
  const source = String(value);
  let url;
  let relative = false;
  try {
    relative = !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(source);
    url = new URL(source, relative ? "https://redaction.invalid" : undefined);
  } catch {
    return scrubPlainString(source, report, path);
  }

  if (url.username) {
    url.username = MASKED;
    report.push({ path: `${path}.username`, rule: "url-credential:default-deny", action: "mask" });
  }
  if (url.password) {
    url.password = MASKED;
    report.push({ path: `${path}.password`, rule: "url-credential:default-deny", action: "mask" });
  }
  const pathSegments = url.pathname.split("/");
  url.pathname = pathSegments
    .map((segment, index) => {
      const decoded = decodeRepeated(segment);
      const scrubbed = scrubPlainString(decoded, report, `${path}.pathname.${index}`);
      return scrubbed === decoded ? segment : scrubbed;
    })
    .join("/");
  redactParameters(url.searchParams, report, `${path}.query`);
  if (url.hash) {
    const rawFragment = url.hash.slice(1);
    if (rawFragment.includes("=")) {
      const fragmentParams = new URLSearchParams(rawFragment);
      redactParameters(fragmentParams, report, `${path}.fragment`);
      url.hash = fragmentParams.toString();
    } else {
      url.hash = scrubPlainString(decodeRepeated(url.hash), report, `${path}.fragment`);
    }
  }

  const serialized = relative ? `${url.pathname}${url.search}${url.hash}` : url.toString();
  return serialized.replaceAll("%5BREDACTED%5D", MASKED);
}

function scrubString(value, report, path) {
  const plain = scrubPlainString(value, report, path);
  return plain.replace(URL_PATTERN, (url) => redactUrl(url, report, path));
}

function redactValue(
  value,
  path,
  fieldRules,
  report,
  { hashKey = null, key = "", query = false, sensitiveKey = sensitiveQueryField } = {},
) {
  const rule = fieldRules.find((r) => pathMatches(r.path, path));
  if (rule) {
    if (rule.action === "drop") {
      report.push({ path, rule: `field:${rule.path}`, action: "drop" });
      return undefined;
    }
    if (rule.action === "hash") {
      if (hashKey) {
        report.push({ path, rule: `field:${rule.path}`, action: "hash" });
        return keyedHash(value, hashKey);
      }
      report.push({ path, rule: `field:${rule.path}:hash-key-unavailable`, action: "mask" });
      return MASKED;
    }
    report.push({ path, rule: `field:${rule.path}`, action: rule.action });
    return MASKED;
  }
  if (key && sensitiveKey(key)) {
    if (!query && typeof value === "string") {
      const detectorReport = [];
      const scrubbed = scrubString(value, detectorReport, path);
      if (scrubbed !== value) {
        report.push(...detectorReport);
        return scrubbed;
      }
    }
    report.push({ path, rule: query ? "query-key:default-deny" : "field-name:default-deny", action: "mask" });
    return MASKED;
  }
  if (typeof value === "string") return scrubString(value, report, path);
  if (Array.isArray(value)) {
    return value
      .map((item, i) => redactValue(item, `${path}.${i}`, fieldRules, report, { hashKey, query, sensitiveKey }))
      .filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [childKey, item] of Object.entries(value)) {
      const redacted = redactValue(item, path ? `${path}.${childKey}` : childKey, fieldRules, report, {
        hashKey,
        key: childKey,
        query,
        sensitiveKey,
      });
      if (redacted !== undefined) out[childKey] = redacted;
    }
    return out;
  }
  return value;
}

function redactHeaders(headers, policy, report, side) {
  if (!headers || typeof headers !== "object") return headers ?? {};
  const extra = (policy?.headers?.mask || []).map((h) => h.toLowerCase());
  const out = {};
  for (const [name, value] of Object.entries(headers)) {
    const lower = name.toLowerCase();
    if (DENY_HEADERS.includes(lower) || extra.includes(lower)) {
      out[name] = MASKED;
      report.push({ path: `${side}.headers.${lower}`, rule: DENY_HEADERS.includes(lower) ? "header:default-deny" : "header:policy", action: "mask" });
    } else if (lower === "location" && typeof value === "string") {
      out[name] = redactUrl(value, report, `${side}.headers.${lower}`);
    } else {
      out[name] = redactValue(value, `${side}.headers.${lower}`, [], report);
    }
  }
  return out;
}

function redactSide(value, side, policy, report, hashKey) {
  if (!value || typeof value !== "object") return {};
  const fieldRules = policy?.fields || [];
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    const path = `${side}.${key}`;
    let redacted;
    if (key.toLowerCase() === "headers") redacted = redactHeaders(item, policy, report, side);
    else if ((/url$/i.test(key) || key.toLowerCase() === "path") && typeof item === "string") redacted = redactUrl(item, report, path);
    else redacted = redactValue(item, path, fieldRules, report, { hashKey, key, query: key.toLowerCase() === "query" });
    if (redacted !== undefined) out[key] = redacted;
  }
  return out;
}

/**
 * Redact one request/response exchange. Pure; returns the redacted exchange
 * plus report entries (what was removed, by which rule). The caller appends
 * the entries to its capture-wide ge.redaction-report.v1.
 * @param {{request?: {headers?: object, body?: any, url?: string},
 *          response?: {headers?: object, body?: any}}} exchange
 * @param {object} [policy] — a validated ge.redaction-policy.v1 (optional:
 *   the default-deny headers and PII detectors run with no policy at all)
 * @param {{env?: object}} [options] environment values used only to resolve
 *   policy.hashing.keyRef; missing keys cause hash rules to mask.
 */
export function redactExchange(exchange = {}, policy = null, { env = {} } = {}) {
  if (policy) {
    const problems = validateRedactionPolicy(policy);
    if (problems.length) throw new Error(`invalid redaction policy: ${problems.join("; ")}`);
  }
  const report = [];
  const request = exchange.request || {};
  const response = exchange.response || {};
  const hashKey = resolveHashKey(policy, env);
  const metadata = {};
  for (const [key, value] of Object.entries(exchange)) {
    if (key === "request" || key === "response") continue;
    const redacted = redactValue(value, `exchange.${key}`, policy?.fields || [], report, {
      hashKey,
      key,
      sensitiveKey: secretField,
    });
    if (redacted !== undefined) metadata[key] = redacted;
  }
  const redacted = {
    ...metadata,
    request: redactSide(request, "request", policy, report, hashKey),
    response: redactSide(response, "response", policy, report, hashKey),
  };
  return { exchange: redacted, report };
}

/** Assemble the capture-wide report artifact from per-exchange entries. */
export function buildRedactionReport({ system, policyHash = null, entries = [] } = {}) {
  const byRule = {};
  for (const entry of entries) byRule[entry.rule] = (byRule[entry.rule] || 0) + 1;
  return {
    schemaVersion: REDACTION_REPORT_SCHEMA_VERSION,
    system: system ?? null,
    policyHash,
    totalRedactions: entries.length,
    byRule,
    entries,
  };
}
