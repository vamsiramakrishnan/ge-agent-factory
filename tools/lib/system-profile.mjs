/**
 * SystemProfile (`ge.system-profile.v1`) — point `ge` at a real system
 * SAFELY: capture what it is (OpenAPI hash, read-op allowlist, write-op
 * denylist, auth BY REFERENCE) without mutating it and, unless asked,
 * without even dialing it. Phase 2 of docs/plans/real-system-twins/.
 *
 * Safety posture, structural not procedural:
 * - `allowedProbes` holds ONLY read operations (GET); every write-class
 *   operation in the spec lands in `forbiddenOperations`. The recorder and
 *   compare command refuse anything outside the allowlist, and
 *   @ge/connector-core refuses non-read methods below them anyway.
 * - Auth is stored as an env-var NAME (`{type: "env", var}`), never a value.
 * - A spec whose schemas carry PII-shaped properties requires a redaction
 *   policy before a profile is written at all — capture without redaction
 *   is not a thing this toolchain can express.
 * - Dialing (one reachability probe) happens only with `probe: true` —
 *   registry risk `calls-live-readonly` — via @ge/connector-core.
 */
import { createHash } from "node:crypto";
import { createRestConnector, validateRestTarget } from "@ge/connector-core";
import { hashRedactionPolicy, validateRedactionPolicy } from "@ge/redaction";

export const SYSTEM_PROFILE_SCHEMA_VERSION = "ge.system-profile.v1";

const WRITE_VERBS = ["post", "put", "patch", "delete"];
const SENSITIVE_PROP =
  /(^|_)(address|api_key|authorization|card|client_secret|cookie|credential|date_of_birth|dob|email|first_name|full_name|last_name|name|password|passwd|phone|secret|session|social_security|ssn|tax_id|token)($|_)/i;
const SENSITIVE_FORMATS = new Set(["email", "password", "phone", "ssn", "credit-card", "date-of-birth"]);

const sha256 = (text) => `sha256:${createHash("sha256").update(text).digest("hex")}`;

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function hashSystemProfile(profile) {
  return sha256(canonicalJson(profile));
}

function specOperations(spec) {
  const allowed = [];
  const forbidden = [];
  for (const [path, ops] of Object.entries(spec.paths || {})) {
    if (!ops || typeof ops !== "object") continue;
    for (const [verb, op] of Object.entries(ops)) {
      const entry = { method: verb.toUpperCase(), path, operationId: op?.operationId };
      if (verb === "get" || verb === "head") allowed.push(entry);
      else if (WRITE_VERBS.includes(verb)) forbidden.push(entry);
    }
  }
  return { allowed, forbidden };
}

function normalizeFieldName(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toLowerCase();
}

function resolveLocalRef(spec, ref) {
  if (!ref.startsWith("#/")) return null;
  let current = spec;
  for (const rawPart of ref.slice(2).split("/")) {
    const part = rawPart.replaceAll("~1", "/").replaceAll("~0", "~");
    current = current?.[part];
    if (current === undefined) return null;
  }
  return current;
}

function specSensitiveReason(spec) {
  const visited = new WeakSet();
  function visit(node, path) {
    if (!node || typeof node !== "object") return null;
    if (visited.has(node)) return null;
    visited.add(node);

    if (typeof node.$ref === "string") {
      const target = resolveLocalRef(spec, node.$ref);
      const found = visit(target, `${path}.$ref(${node.$ref})`);
      if (found) return found;
    }
    if (typeof node.format === "string" && SENSITIVE_FORMATS.has(node.format.toLowerCase())) {
      return `${path} (format:${node.format})`;
    }
    if (["query", "header", "cookie"].includes(node.in) && SENSITIVE_PROP.test(normalizeFieldName(node.name || ""))) {
      return `${path}.${node.name}`;
    }
    for (const [prop, schema] of Object.entries(node.properties || {})) {
      const propPath = `${path}.${prop}`;
      if (SENSITIVE_PROP.test(normalizeFieldName(prop))) return propPath;
      const found = visit(schema, propPath);
      if (found) return found;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === "properties" || key === "$ref") continue;
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          const found = visit(child[i], `${path}.${key}.${i}`);
          if (found) return found;
        }
      } else {
        const found = visit(child, `${path}.${key}`);
        if (found) return found;
      }
    }
    return null;
  }
  return visit(spec, "openapi");
}

/** Validate persisted profile identity and the read-only allowlist invariant. */
export function assertSystemProfile(profile, { system } = {}) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) throw new Error("system profile must be an object");
  if (profile.schemaVersion !== SYSTEM_PROFILE_SCHEMA_VERSION) {
    throw new Error(`system profile schemaVersion must be "${SYSTEM_PROFILE_SCHEMA_VERSION}"`);
  }
  if (!profile.system || typeof profile.system !== "string") throw new Error("system profile requires system");
  if (system && profile.system !== system) {
    throw new Error(`system profile identity mismatch: expected "${system}", got "${profile.system}"`);
  }
  if (!Array.isArray(profile.allowedProbes)) throw new Error("system profile requires allowedProbes");
  const unsafe = profile.allowedProbes.find((operation) => !["GET", "HEAD"].includes(String(operation?.method).toUpperCase()));
  if (unsafe) throw new Error(`system profile read allowlist contains unsafe method "${unsafe.method}"`);
  return profile;
}

/**
 * Build (and optionally probe) a system profile. Pure over its inputs
 * except the optional probe; the CLI/MCP layers do the file IO.
 * @param {{system: string, kind?: string, baseUrl?: string,
 *          openapiText: string, authRef?: string,
 *          redactionPolicyText?: string|null, probe?: boolean,
 *          env?: object, fetchImpl?: typeof fetch, resolveHost?: Function}} options
 */
export async function buildSystemProfile({
  system,
  kind = "rest",
  baseUrl,
  openapiText,
  authRef,
  redactionPolicyText = null,
  probe = false,
  env = process.env,
  fetchImpl = fetch,
  resolveHost,
} = {}) {
  if (!system) throw new Error("buildSystemProfile requires system");
  if (kind !== "rest") throw new Error(`unsupported profile kind "${kind}" — rest only in this phase`);
  if (!openapiText) throw new Error("buildSystemProfile requires openapiText — the profile is grounded in the spec");
  const spec = JSON.parse(openapiText);
  const { allowed, forbidden } = specOperations(spec);
  const validatedBaseUrl = baseUrl
    ? validateRestTarget(baseUrl, { allowPrivateNetwork: true }).href
    : null;

  const sensitiveReason = specSensitiveReason(spec);
  let redactionPolicyHash = null;
  if (redactionPolicyText) {
    const policy = JSON.parse(redactionPolicyText);
    const problems = validateRedactionPolicy(policy);
    if (problems.length) throw new Error(`invalid redaction policy: ${problems.join("; ")}`);
    redactionPolicyHash = hashRedactionPolicy(policy);
  } else if (sensitiveReason) {
    throw new Error(
      `the spec declares sensitive data ("${sensitiveReason}") — a redaction policy is required: pass --redact <policy.json> (ge.redaction-policy.v1)`,
    );
  }

  const auth =
    authRef && authRef !== "none"
      ? (() => {
          const match = /^env:([A-Z][A-Z0-9_]*)$/.exec(authRef);
          if (!match) throw new Error(`unsupported auth reference "${authRef}" — expected env:<VAR> or none`);
          return { type: "env", var: match[1] };
        })()
      : { type: "none" };

  const profile = {
    schemaVersion: SYSTEM_PROFILE_SCHEMA_VERSION,
    system,
    kind,
    displayName: spec.info?.title || system,
    baseUrl: validatedBaseUrl,
    openapiHash: sha256(openapiText),
    auth,
    allowedProbes: allowed,
    forbiddenOperations: forbidden,
    redactionPolicyHash,
    capturedAt: new Date().toISOString(),
  };

  if (probe) {
    if (!baseUrl) throw new Error("probing requires --base-url");
    const connector = createRestConnector({ baseUrl: validatedBaseUrl, authRef: authRef || "none", env, fetchImpl, resolveHost });
    profile.probe = await connector.probe();
  }
  return assertSystemProfile(profile, { system });
}

/** A recorded call's path must instantiate one of the profile's allowed GET templates. */
export function probeAllowed(profile, path, method = "GET") {
  const verb = String(method).toUpperCase();
  const normalize = (p) => String(p).replace(/\/+$/, "");
  const candidate = normalize(path.split("?")[0]).split("/").filter(Boolean);
  return (profile.allowedProbes || []).some((op) => {
    if (String(op.method).toUpperCase() !== verb) return false;
    const template = normalize(op.path).split("/").filter(Boolean);
    if (template.length !== candidate.length) return false;
    return template.every((seg, i) => (seg.startsWith("{") && seg.endsWith("}")) || seg === candidate[i]);
  });
}
