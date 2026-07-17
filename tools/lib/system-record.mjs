/**
 * ReplayCorpus (`ge.replay-corpus.v1`) — record bounded, allowlisted,
 * READ-ONLY traffic from a profiled system, redacting every exchange
 * BEFORE it is written. Phase 2 of docs/plans/real-system-twins/.
 *
 * The corpus is NDJSON: a header line
 *   {schemaVersion, kind: "system_trace", system, profileHash, policyHash}
 * followed by one redacted exchange per line
 *   {name, request: {method, path, query?}, response: {status, body},
 *    latencyMs, timestampClass}
 * `timestampClass` is deliberately coarse (business_hours/off_hours) — a
 * corpus must not become a covert timing channel on production data.
 *
 * Import adapters (NDJSON pass-through, HAR) run through the SAME redaction
 * path — an imported capture is never trusted to be clean.
 */
import { Buffer } from "node:buffer";
import { assertSystemProfile, hashSystemProfile, probeAllowed } from "./system-profile.mjs";
import { createRestConnector } from "@ge/connector-core";
import { buildRedactionReport, hashRedactionPolicy, redactExchange } from "@ge/redaction";

export const REPLAY_CORPUS_SCHEMA_VERSION = "ge.replay-corpus.v1";
export const MAX_CALLS_HARD_CAP = 500;
export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
export const MAX_IMPORT_ENTRIES = 10_000;

function timestampClass(date = new Date()) {
  const hour = date.getUTCHours();
  return hour >= 8 && hour < 18 ? "business_hours" : "off_hours";
}

function corpusHeader({ profile, policyHash }) {
  return {
    schemaVersion: REPLAY_CORPUS_SCHEMA_VERSION,
    kind: "system_trace",
    system: profile.system,
    profileHash: hashSystemProfile(profile),
    policyHash: policyHash ?? profile.redactionPolicyHash ?? null,
  };
}

function redactEntry(entry, policy, env) {
  const { exchange, report } = redactExchange(entry, policy, { env });
  return { entry: exchange, report };
}

function policyHashFor(policy) {
  return policy ? hashRedactionPolicy(policy) : null;
}

function assertPolicyIdentity(expectedHash, policy, context) {
  if (!expectedHash) return policyHashFor(policy);
  if (!policy) throw new Error(`${context} requires the redaction policy identified by ${expectedHash}`);
  const actualHash = policyHashFor(policy);
  if (actualHash !== expectedHash) {
    throw new Error(`${context} redaction policy mismatch: expected ${expectedHash}, got ${actualHash}`);
  }
  return actualHash;
}

function assertReadEntry(entry, context) {
  const method = String(entry?.request?.method || "").toUpperCase();
  if (!(["GET", "HEAD"].includes(method))) {
    throw new Error(`${context} contains non-read request method "${method || "missing"}"`);
  }
}

function assertImportSize(text) {
  if (typeof text !== "string") throw new Error("trace import text must be a string");
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > MAX_IMPORT_BYTES) throw new Error(`trace import exceeds ${MAX_IMPORT_BYTES} byte hard cap`);
}

/**
 * Execute a read-only probe script against the profiled system and return
 * the corpus lines (header first) plus the capture-wide redaction report.
 * Script shape: {calls: [{name, method?, path, query?}]}. Every call must
 * instantiate an allowed GET or HEAD template from the profile; anything else is
 * refused before dialing. `maxCalls` is required and hard-capped.
 * @param {{profile: object, system?: string, script: {calls: Array}, policy?: object|null,
 *          maxCalls: number, env?: object, fetchImpl?: typeof fetch,
 *          resolveHost?: Function}} options
 */
export async function recordSystemTraces({
  profile,
  system,
  script,
  policy = null,
  maxCalls,
  env = process.env,
  fetchImpl = fetch,
  resolveHost,
} = {}) {
  assertSystemProfile(profile, { system });
  if (!profile?.baseUrl) throw new Error("recording requires a profile with baseUrl");
  if (!Array.isArray(script?.calls) || !script.calls.length) throw new Error("probe script must declare calls: [{name, path, query?}]");
  const budget = Number(maxCalls);
  if (!Number.isInteger(budget) || budget <= 0 || budget > MAX_CALLS_HARD_CAP) {
    throw new Error(`--max-calls is required (1..${MAX_CALLS_HARD_CAP}) — live capture is always bounded`);
  }
  if (script.calls.length > MAX_CALLS_HARD_CAP) {
    throw new Error(`probe script exceeds ${MAX_CALLS_HARD_CAP} call hard cap`);
  }
  const appliedPolicyHash = assertPolicyIdentity(profile.redactionPolicyHash, policy, "system profile");

  const outsideAllowlist = script.calls.filter((call) => {
    const method = String(call.method || "GET").toUpperCase();
    return !["GET", "HEAD"].includes(method) || !probeAllowed(profile, call.path, method);
  });
  if (outsideAllowlist.length) {
    throw new Error(
      `probe script includes paths outside the profile's read allowlist: ${outsideAllowlist.map((c) => c.path).join(", ")}`,
    );
  }

  const authRef = profile.auth?.type === "env" ? `env:${profile.auth.var}` : "none";
  const connector = createRestConnector({ baseUrl: profile.baseUrl, authRef, env, fetchImpl, resolveHost });
  const lines = [corpusHeader({ profile, policyHash: appliedPolicyHash })];
  const reportEntries = [];
  for (const call of script.calls.slice(0, budget)) {
    const method = String(call.method || "GET").toUpperCase();
    const result = await connector.call({ method, path: call.path, query: call.query });
    const raw = {
      name: call.name || call.path,
      request: { method, path: call.path, ...(call.query ? { query: call.query } : {}) },
      response: { status: result.status, body: result.body },
      latencyMs: result.latencyMs,
      timestampClass: timestampClass(),
    };
    const { entry, report } = redactEntry(raw, policy, env);
    lines.push(entry);
    reportEntries.push(...report);
  }
  return {
    lines,
    calls: lines.length - 1,
    redactionReport: buildRedactionReport({ system: profile.system, policyHash: lines[0].policyHash, entries: reportEntries }),
  };
}

/**
 * Import an existing capture through the same redaction path.
 * - ndjson: our own corpus shape (header optional; re-redacted regardless)
 * - har:    a browser/proxy HAR file's entries
 * @param {{format: "ndjson"|"har", text: string, system: string,
 *          policy?: object|null, env?: object}} options
 */
export function importTraces({ format, text, system, policy = null, env = process.env } = {}) {
  if (!system) throw new Error("importTraces requires system");
  assertImportSize(text);
  const rawEntries = [];
  let sourceHeader = null;
  if (format === "ndjson") {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const parsed = JSON.parse(line);
      if (parsed.schemaVersion) {
        if (sourceHeader) throw new Error("NDJSON import contains more than one corpus header");
        sourceHeader = parsed;
        if (sourceHeader.schemaVersion !== REPLAY_CORPUS_SCHEMA_VERSION || sourceHeader.kind !== "system_trace") {
          throw new Error(`NDJSON import has unsupported corpus header "${sourceHeader.schemaVersion || "missing"}"`);
        }
        if (sourceHeader.system !== system) {
          throw new Error(`NDJSON corpus identity mismatch: expected "${system}", got "${sourceHeader.system || "missing"}"`);
        }
        assertPolicyIdentity(sourceHeader.policyHash, policy, "NDJSON corpus");
        continue;
      }
      assertReadEntry(parsed, "NDJSON import");
      rawEntries.push(parsed);
      if (rawEntries.length > MAX_IMPORT_ENTRIES) {
        throw new Error(`trace import exceeds ${MAX_IMPORT_ENTRIES} entry hard cap`);
      }
    }
  } else if (format === "har") {
    const har = JSON.parse(text);
    const entries = har.log?.entries || [];
    if (!Array.isArray(entries)) throw new Error("HAR import requires log.entries array");
    if (entries.length > MAX_IMPORT_ENTRIES) throw new Error(`trace import exceeds ${MAX_IMPORT_ENTRIES} entry hard cap`);
    for (const entry of entries) {
      const method = entry.request?.method || "GET";
      if (method !== "GET" && method !== "HEAD") continue; // write traffic never enters a corpus
      const url = new URL(entry.request.url);
      let body = null;
      const contentText = entry.response?.content?.text;
      if (contentText) {
        try {
          body = JSON.parse(contentText);
        } catch {
          body = { raw: String(contentText).slice(0, 2000) };
        }
      }
      rawEntries.push({
        name: `${method} ${url.pathname}`,
        request: {
          method,
          path: url.pathname,
          headers: Object.fromEntries((entry.request.headers || []).map((h) => [h.name, h.value])),
          ...(url.searchParams.size ? { query: Object.fromEntries(url.searchParams.entries()) } : {}),
        },
        response: {
          status: entry.response?.status ?? null,
          headers: Object.fromEntries((entry.response?.headers || []).map((h) => [h.name, h.value])),
          body,
        },
        latencyMs: Math.round(entry.time ?? 0),
        timestampClass: "imported",
      });
    }
  } else {
    throw new Error(`unsupported import format "${format}" — ndjson or har`);
  }

  const header = {
    schemaVersion: REPLAY_CORPUS_SCHEMA_VERSION,
    kind: "system_trace",
    system,
    profileHash: sourceHeader?.profileHash ?? null,
    policyHash: policyHashFor(policy),
  };
  const lines = [header];
  const reportEntries = [];
  for (const raw of rawEntries) {
    const { entry, report } = redactEntry(raw, policy, env);
    lines.push(entry);
    reportEntries.push(...report);
  }
  return {
    lines,
    calls: rawEntries.length,
    redactionReport: buildRedactionReport({ system, policyHash: header.policyHash, entries: reportEntries }),
  };
}

/** Serialize corpus lines to NDJSON text. */
export function corpusToNdjson(lines) {
  return `${lines.map((line) => JSON.stringify(line)).join("\n")}\n`;
}

/** Parse and validate NDJSON corpus text back to {header, entries}. */
export function parseCorpus(text, { profile = null, system = null } = {}) {
  assertImportSize(text);
  const lines = text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
  const header = lines[0]?.schemaVersion === REPLAY_CORPUS_SCHEMA_VERSION ? lines[0] : null;
  const entries = header ? lines.slice(1) : lines;
  if (entries.length > MAX_IMPORT_ENTRIES) throw new Error(`replay corpus exceeds ${MAX_IMPORT_ENTRIES} entry hard cap`);
  for (const entry of entries) assertReadEntry(entry, "replay corpus");
  if (header && header.kind !== "system_trace") throw new Error(`replay corpus kind must be "system_trace"`);
  if ((profile || system) && !header) throw new Error("replay corpus identity cannot be verified without a corpus header");
  if (profile) {
    assertSystemProfile(profile, { system: system || profile.system });
    if (header.system !== profile.system) {
      throw new Error(`profile/corpus system mismatch: profile is "${profile.system}", corpus is "${header.system || "missing"}"`);
    }
    const expectedProfileHash = hashSystemProfile(profile);
    if (header.profileHash !== expectedProfileHash) {
      throw new Error(`profile/corpus identity mismatch: expected profile hash ${expectedProfileHash}, got ${header.profileHash || "missing"}`);
    }
    if (profile.redactionPolicyHash && header.policyHash !== profile.redactionPolicyHash) {
      throw new Error(
        `profile/corpus redaction policy mismatch: expected ${profile.redactionPolicyHash}, got ${header.policyHash || "missing"}`,
      );
    }
  } else if (system && header.system !== system) {
    throw new Error(`replay corpus identity mismatch: expected "${system}", got "${header.system || "missing"}"`);
  }
  return { header, entries };
}

// Recorded paths carry LITERAL ids (`/cases/C1`), not templates. The REST
// convention alternates collection/id — so the collection is the last
// segment when the count is odd (`/cases`, `/cases/C1/notes`) and the
// second-to-last when even (`/cases/C1`). Deterministic, no id-shape guess.
function collectionOfPath(path) {
  const segments = String(path || "").split("?")[0].split("/").filter((seg) => seg && !seg.startsWith("{") && !seg.startsWith(":"));
  if (!segments.length) return null;
  const idx = segments.length % 2 === 0 ? segments.length - 2 : segments.length - 1;
  return segments[idx].toLowerCase();
}

function rowsFromBody(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const nested = Object.values(body).find(Array.isArray);
    if (nested) return nested;
    return [body];
  }
  return [];
}

/**
 * Project a replay corpus into the `{collection: [rows]}` samples shape the
 * existing `ge systems synth --from-samples` mode accepts — the JS half of
 * `synth --from-profile --from-traces` (compilation stays in Python; this
 * only reshapes what was already captured, honoring the layering split).
 * Redacted VALUES are fine as structural samples: what synthesis reads from
 * samples is field PRESENCE and types, exactly the field-coverage gap the
 * realism report flags. Deterministic — no clock, stable row order.
 * @param {{header?: object, entries: Array}} corpus (from parseCorpus)
 * @returns {{samples: object, observed: {latencies: number[], statuses: object}}}
 */
export function projectCorpusToSamples(corpus) {
  const samples = {};
  const latencies = [];
  const statuses = {};
  for (const entry of corpus.entries || []) {
    if (typeof entry.latencyMs === "number") latencies.push(entry.latencyMs);
    const status = entry.response?.status;
    if (status !== undefined && status !== null) statuses[status] = (statuses[status] || 0) + 1;
    const collection = collectionOfPath(entry.request?.path);
    if (!collection) continue;
    const rows = rowsFromBody(entry.response?.body).filter((row) => row && typeof row === "object" && !Array.isArray(row));
    if (!rows.length) continue;
    (samples[collection] ||= []).push(...rows);
  }
  return { samples, observed: { latencies: latencies.sort((a, b) => a - b), statuses } };
}
