/**
 * Realism compare (`ge.realism-report.v1`) — measure a twin against its
 * real system using ONLY allowlisted read probes and the twin's own pack
 * sections. Phase 2 of docs/plans/real-system-twins/.
 *
 * The report separates what it can prove from what it can only advise
 * (flattering coverage percentages are how realism metrics lie):
 * - endpoint_coverage  (mechanical)  read endpoints ↔ twin read tools
 * - field_coverage     (mechanical)  observed live fields ⊆ twin schema
 * - latency            (advisory)    observed p50/p95 vs pack latency bands
 * - error_classes      (advisory)    observed non-2xx vs pack failureModes
 * Every gap carries a `next` line naming the exact command that closes it.
 * Write endpoints are NEVER dialed — mutation realism is Phase 1's
 * contract (`ge systems mutation validate`), not a live experiment.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assertSystemProfile, probeAllowed } from "./system-profile.mjs";
import { createRestConnector } from "@ge/connector-core";

export const REALISM_REPORT_SCHEMA_VERSION = "ge.realism-report.v1";
export const MAX_COMPARE_CALLS_HARD_CAP = 500;

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function collectionOfPath(path) {
  const segments = String(path).split("?")[0].split("/").filter((seg) => seg && !seg.startsWith("{"));
  return segments.length ? segments[segments.length - 1].toLowerCase() : null;
}

function observedFields(body) {
  const fields = new Set();
  const rows = Array.isArray(body) ? body : body && typeof body === "object" ? Object.values(body).find(Array.isArray) || [body] : [];
  for (const row of rows.slice(0, 25)) {
    if (row && typeof row === "object" && !Array.isArray(row)) for (const key of Object.keys(row)) fields.add(key);
  }
  return fields;
}

async function readPackSections({ repoRoot, system, packDir }) {
  const dir = packDir || join(repoRoot, "apps", "factory", "simulator-systems", system);
  const read = async (name) => {
    try {
      return JSON.parse(await readFile(join(dir, name), "utf8"));
    } catch (error) {
      if (error?.code === "ENOENT") return null;
      throw error;
    }
  };
  return { schema: await read("schema.json"), tools: await read("tools.json"), workflows: await read("workflows.json") };
}

/**
 * Compare one profiled live system against its twin pack.
 * @param {{profile: object, system?: string, repoRoot: string, packDir?: string,
 *          maxCalls?: number, env?: object, fetchImpl?: typeof fetch,
 *          resolveHost?: Function}} options
 */
export async function compareSystemTwin({
  profile,
  system,
  repoRoot,
  packDir,
  maxCalls = 25,
  env = process.env,
  fetchImpl = fetch,
  resolveHost,
} = {}) {
  assertSystemProfile(profile, { system });
  if (!profile?.baseUrl) throw new Error("compare requires a profile with baseUrl (read-only live probes are the point)");
  const callBudget = Number(maxCalls);
  if (!Number.isInteger(callBudget) || callBudget <= 0 || callBudget > MAX_COMPARE_CALLS_HARD_CAP) {
    throw new Error(`compare maxCalls must be an integer from 1..${MAX_COMPARE_CALLS_HARD_CAP}`);
  }
  const twinId = system || profile.system;
  const pack = await readPackSections({ repoRoot, system: twinId, packDir });
  if (!pack.schema && !pack.tools) {
    throw new Error(`no twin pack found for "${twinId}" — synthesize one first: ge systems synth --from-openapi <spec> --name ${twinId}`);
  }

  const collections = pack.schema?.collections || {};
  const twinReadCollections = new Set(
    (pack.tools?.tools || [])
      .filter((tool) => ["search", "get"].includes(tool.binding?.op))
      .map((tool) => String(tool.binding.collection).toLowerCase()),
  );

  // Mechanical: every allowed read endpoint should map onto a twin read tool.
  const endpointPairs = (profile.allowedProbes || [])
    .filter((op) => op.method === "GET")
    .map((op) => {
      const collection = collectionOfPath(op.path);
      return { endpoint: `GET ${op.path}`, collection, covered: twinReadCollections.has(collection) };
    });
  const uncovered = endpointPairs.filter((pair) => !pair.covered);

  // Live sampling: one bounded GET per distinct covered collection endpoint.
  const authRef = profile.auth?.type === "env" ? `env:${profile.auth.var}` : "none";
  const connector = createRestConnector({ baseUrl: profile.baseUrl, authRef, env, fetchImpl, resolveHost });
  const latencies = [];
  const statuses = {};
  const fieldResults = [];
  let budget = Math.min(callBudget, endpointPairs.length);
  for (const pair of endpointPairs) {
    if (budget <= 0) break;
    if (pair.endpoint.includes("{")) continue; // template paths need ids we refuse to guess
    if (!probeAllowed(profile, pair.endpoint.replace(/^GET /, ""))) continue;
    budget--;
    const result = await connector.call({ path: pair.endpoint.replace(/^GET /, "") });
    latencies.push(result.latencyMs);
    statuses[result.status] = (statuses[result.status] || 0) + 1;
    if (result.ok && pair.collection && collections[pair.collection]) {
      const twinFields = new Set(Object.keys(collections[pair.collection].fields || collections[pair.collection] || {}));
      const live = observedFields(result.body);
      const missing = [...live].filter((field) => !twinFields.has(field));
      fieldResults.push({ collection: pair.collection, observed: live.size, missingFromTwin: missing });
    }
  }
  latencies.sort((a, b) => a - b);

  // Advisory: pack latency bands / failure classes exist for the sampled tools?
  const handlers = Object.values(pack.workflows?.toolHandlers || {});
  const packHasLatency = handlers.some((handler) => handler.latency);
  const packHasFailures = handlers.some((handler) => handler.failureModes);
  const observedErrors = Object.keys(statuses).filter((status) => Number(status) >= 400);

  const missingFieldCount = fieldResults.reduce((n, r) => n + r.missingFromTwin.length, 0);
  const next = [];
  if (uncovered.length) next.push(`ge systems synth --from-openapi <spec> --name ${twinId}  # regenerate: ${uncovered.length} endpoint(s) uncovered`);
  if (missingFieldCount) next.push(`ge systems synth --from-profile <profile> --from-traces <corpus>  # ${missingFieldCount} live field(s) missing from the twin schema`);
  if (!packHasLatency && latencies.length) next.push(`ge systems synth --from-traces <corpus>  # derive latency bands (observed p50 ${percentile(latencies, 50)}ms)`);
  if (observedErrors.length && !packHasFailures) next.push(`review workflows failureModes  # live returned ${observedErrors.join(",")} but the twin injects no failures`);

  return {
    schemaVersion: REALISM_REPORT_SCHEMA_VERSION,
    system: profile.system,
    twin: twinId,
    dimensions: {
      endpoint_coverage: {
        kind: "mechanical",
        status: uncovered.length ? "gap" : "pass",
        detail: `${endpointPairs.length - uncovered.length}/${endpointPairs.length} read endpoints represented by twin tools`,
        uncovered: uncovered.map((pair) => pair.endpoint),
      },
      field_coverage: {
        kind: "mechanical",
        status: missingFieldCount ? "gap" : fieldResults.length ? "pass" : "not_sampled",
        detail: fieldResults.length
          ? `${missingFieldCount} observed live field(s) missing from twin schema across ${fieldResults.length} sampled collection(s)`
          : "no live samples taken (template-only endpoints or zero budget)",
        collections: fieldResults,
      },
      latency: {
        kind: "advisory",
        status: latencies.length ? (packHasLatency ? "pass" : "advisory") : "not_sampled",
        detail: latencies.length
          ? `observed p50 ${percentile(latencies, 50)}ms / p95 ${percentile(latencies, 95)}ms — twin ${packHasLatency ? "declares" : "declares NO"} latency bands`
          : "no live samples taken",
        observed: { p50: percentile(latencies, 50), p95: percentile(latencies, 95), samples: latencies.length },
      },
      error_classes: {
        kind: "advisory",
        status: observedErrors.length ? (packHasFailures ? "pass" : "advisory") : "pass",
        detail: observedErrors.length
          ? `live returned ${observedErrors.join(", ")} — twin ${packHasFailures ? "injects failures" : "injects NO failures"}`
          : "no error statuses observed in this sample",
        observedStatuses: statuses,
      },
    },
    next,
  };
}
