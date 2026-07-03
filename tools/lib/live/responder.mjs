// Responder identity assertion — did the answer come from the agent we meant
// to test?
//
// Configuring an agent on the request is routing, not proof: the stream must
// carry evidence of who responded. How much identity metadata a stream
// exposes varies by engine configuration, so this is an evidence scan with an
// honest four-way verdict rather than a boolean:
//   matched         — evidence names the expected agent
//   mismatched      — evidence names a DIFFERENT agent (hard failure)
//   unknown         — no identity evidence in the stream (passes with a
//                     warning unless --strict-responder)
//   not_applicable  — no expected agent configured, nothing to assert
const IDENTITY_KEY_RE = /^(agent(Id|Name|Resource|DisplayName)?|assistantAgent)$/i;

// Deep-scan a chunk for identity-bearing keys. Returns [{ path, value }].
export function scanIdentityEvidence(json, basePath = "") {
  const found = [];
  if (!json || typeof json !== "object") return found;
  for (const [key, value] of Object.entries(json)) {
    const path = basePath ? `${basePath}.${key}` : key;
    if (IDENTITY_KEY_RE.test(key) && typeof value === "string" && value.length) {
      found.push({ path, value });
    } else if (value && typeof value === "object") {
      found.push(...scanIdentityEvidence(value, path));
    }
  }
  return found;
}

// An observed identity matches if it equals the expected id, or is a resource
// name whose last segment equals it (streams report full resource names;
// operators configure the short id).
export function identityMatches(observed, expectedAgentId) {
  if (observed === expectedAgentId) return true;
  const lastSegment = observed.split("/").at(-1);
  return lastSegment === expectedAgentId;
}

export function assertResponder({ expectedAgentId, chunks = [] }) {
  const evidence = [];
  for (const { json } of chunks) evidence.push(...scanIdentityEvidence(json));
  const observed = [...new Set(evidence.map((item) => item.value))];
  if (!expectedAgentId) {
    return { expectedAgentId: null, observedAgentId: observed[0] ?? null, assertion: "not_applicable", evidence: evidence.map((item) => `${item.path}=${item.value}`) };
  }
  if (!observed.length) {
    return { expectedAgentId, observedAgentId: null, assertion: "unknown", evidence: [] };
  }
  const matched = observed.find((value) => identityMatches(value, expectedAgentId));
  return {
    expectedAgentId,
    observedAgentId: matched ?? observed[0],
    assertion: matched ? "matched" : "mismatched",
    evidence: evidence.map((item) => `${item.path}=${item.value}`),
  };
}

// Gate policy for an assertion (shared by drive's footer, live proof, and the
// live gate): mismatched always fails; unknown fails only in strict runs.
export function responderVerdict(assertion, { strict = false } = {}) {
  if (assertion === "mismatched") return { ok: false, warning: null };
  if (assertion === "unknown") return strict ? { ok: false, warning: null } : { ok: true, warning: "responder identity could not be verified from the stream" };
  return { ok: true, warning: null };
}
