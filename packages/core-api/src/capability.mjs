/**
 * The capability kernel: the invariant behind every GE surface is that each
 * operator capability is ONE typed core operation, and the CLI, console, MCP
 * server, and cloud worker are only transports/renderers over it. This module
 * owns the pieces of that contract which every surface must agree on:
 *
 * - the closed vocabularies (`RISK_LEVELS`, `OBSERVABILITY_MODES`,
 *   `REQUIREMENT_KEYS`, `MCP_PARAM_TYPES`) that capability entries draw from,
 * - `capabilityMeta()` — the projection of a capability entry that surfaces
 *   ship to clients (the console's command list, the generated API docs),
 * - `validateCapability()` / `assertCapabilityTable()` — the structural
 *   validator @ge/capability-registry runs over its table at import time, so
 *   a malformed entry fails every surface immediately instead of drifting on
 *   whichever surface happened not to read the broken field.
 *
 * Deliberately dependency-free (no zod): the table this validates is bundled
 * into browser clients through @ge/capability-registry, and a schema library
 * would be pure weight there. @ge/contracts carries the zod twin of the risk
 * vocabulary for typed front-ends; tools/contracts-registry-parity.test.mjs
 * holds the two equal.
 */

// Risk labels for confirm-gating. Order matches @ge/contracts'
// RiskLevelSchema (the zod twin typed front-ends consume).
export const RISK_LEVELS = Object.freeze([
  "mutates-cloud", // calls out to GCP/Terraform and changes cloud state
  "starts-workloads", // kicks off cloud-side (remote) build/run work
  "starts-local-workloads", // starts a process on the operator's machine
  "writes-repo", // writes/commits files into the local git repo
  "calls-live-readonly", // dials an operator-configured external system, read-only ops only — never mutates it, never writes the repo
  "read-only", // reads/reports state only
]);

// How a surface observes a running capability.
export const OBSERVABILITY_MODES = Object.freeze([
  "command-output", // no structured events; raw stdout
  "remote-stage-logs", // cloud factory stage logs, polled via statusCommand
  "local-factory-events", // local harness JSONL event log + artifacts
  "runtime-events", // pipeline-graph runtime events, polled via statusCommand
]);

// Preflight requirement keys a capability may declare (`bins`/`config` carry
// arrays; the rest are boolean flags). The console runs these before allowing
// the capability to be invoked.
export const REQUIREMENT_KEYS = Object.freeze([
  "bins", // CLI binaries that must be on PATH
  "config", // .ge.json keys that must already be set
  "cloudAuth", // requires an authenticated gcloud session
  "terraformRoot", // requires a Terraform root to be present
  "configWritable", // .ge.json must be writable
  "localToolchain", // requires the local dev toolchain (mise run setup)
  "toolPlane", // requires the MCP tool plane to be deployed
  "bigQueryHard", // hard preflight blocker: BigQuery API must be enabled
  "shipHandoff", // requires cloud-run-proxy + gateway agent-provision flag
  "dataGenerationRuntime", // requires the local data-generation runtime
]);

// Types an MCP param descriptor may declare (flat, JSON-schema friendly).
export const MCP_PARAM_TYPES = Object.freeze(["string", "boolean", "number"]);

const HTTP_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const MCP_TOOL_NAME = /^factory_[a-z0-9_]+$/;

/**
 * The client-facing projection of a capability entry: what the console's
 * command list, the generated console-API reference, and preflight checks
 * consume. Excludes the executable pieces (argv builder, mcp block).
 */
export function capabilityMeta(command) {
  return {
    id: command.id,
    method: command.method,
    path: command.path,
    cli: command.cli,
    label: command.label,
    summary: command.summary,
    risk: command.risk,
    expectedDuration: command.expectedDuration,
    requirements: command.requirements,
    observability: command.observability || { mode: "command-output", events: false },
  };
}

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isStringArray = (value) => Array.isArray(value) && value.every(isNonEmptyString);

/**
 * Structurally validate one capability entry against the kernel contract.
 * Returns a list of problem strings ("" problems = valid). `key` is the
 * table key the entry sits under, when validating a whole table.
 */
export function validateCapability(command, key = command?.id) {
  const problems = [];
  const at = (field, message) => problems.push(`${key}.${field}: ${message}`);

  if (!command || typeof command !== "object") return [`${key}: not an object`];
  if (!isNonEmptyString(command.id)) at("id", "must be a non-empty string");
  else if (key !== undefined && command.id !== key) at("id", `'${command.id}' does not match its table key '${key}'`);

  for (const field of ["cli", "label", "summary", "expectedDuration"]) {
    if (!isNonEmptyString(command[field])) at(field, "must be a non-empty string");
  }

  if (!RISK_LEVELS.includes(command.risk)) {
    at("risk", `'${command.risk}' is not one of: ${RISK_LEVELS.join(", ")}`);
  }

  // Console route: both halves or neither (a null method with a path — or
  // the reverse — is an unreachable half-route).
  const hasMethod = command.method !== null && command.method !== undefined;
  const hasPath = command.path !== null && command.path !== undefined;
  if (hasMethod !== hasPath) at("method/path", "must both be set or both be null");
  if (hasMethod && !HTTP_METHODS.has(command.method)) at("method", `'${command.method}' is not an HTTP method`);
  if (hasPath && !(isNonEmptyString(command.path) && command.path.startsWith("/api/"))) {
    at("path", "must start with /api/");
  }

  const requirements = command.requirements;
  if (!requirements || typeof requirements !== "object") {
    at("requirements", "must be an object with at least bins/config arrays");
  } else {
    if (!Array.isArray(requirements.bins) || !requirements.bins.every(isNonEmptyString)) {
      at("requirements.bins", "must be an array of binary names");
    }
    if (!Array.isArray(requirements.config) || !requirements.config.every(isNonEmptyString)) {
      at("requirements.config", "must be an array of .ge.json keys");
    }
    for (const [name, value] of Object.entries(requirements)) {
      if (!REQUIREMENT_KEYS.includes(name)) at(`requirements.${name}`, "unknown requirement key");
      else if (name !== "bins" && name !== "config" && typeof value !== "boolean") {
        at(`requirements.${name}`, "must be a boolean flag");
      }
    }
  }

  const observability = command.observability;
  if (observability !== undefined) {
    if (!observability || typeof observability !== "object") {
      at("observability", "must be an object when present");
    } else {
      if (!OBSERVABILITY_MODES.includes(observability.mode)) {
        at("observability.mode", `'${observability.mode}' is not one of: ${OBSERVABILITY_MODES.join(", ")}`);
      }
      if (typeof observability.events !== "boolean") at("observability.events", "must be a boolean");
      for (const field of ["statusCommand", "eventLog"]) {
        if (observability[field] !== undefined && !isNonEmptyString(observability[field])) {
          at(`observability.${field}`, "must be a non-empty string when present");
        }
      }
      if (observability.artifacts !== undefined && !isStringArray(observability.artifacts)) {
        at("observability.artifacts", "must be an array of file globs when present");
      }
      for (const name of Object.keys(observability)) {
        if (!["mode", "events", "statusCommand", "eventLog", "artifacts"].includes(name)) {
          at(`observability.${name}`, "unknown observability key");
        }
      }
    }
  }

  const mcp = command.mcp;
  if (mcp !== undefined) {
    if (!mcp || typeof mcp !== "object") {
      at("mcp", "must be an object when present");
    } else {
      if (!isNonEmptyString(mcp.tool) || !MCP_TOOL_NAME.test(mcp.tool)) {
        at("mcp.tool", `'${mcp.tool}' must match ${MCP_TOOL_NAME}`);
      }
      if (!isNonEmptyString(mcp.description)) at("mcp.description", "must be a non-empty string");
      if (!mcp.params || typeof mcp.params !== "object") {
        at("mcp.params", "must be an object (may be empty)");
      } else {
        for (const [name, descriptor] of Object.entries(mcp.params)) {
          if (!descriptor || typeof descriptor !== "object") {
            at(`mcp.params.${name}`, "must be a descriptor object");
            continue;
          }
          if (!MCP_PARAM_TYPES.includes(descriptor.type)) {
            at(`mcp.params.${name}.type`, `'${descriptor.type}' is not one of: ${MCP_PARAM_TYPES.join(", ")}`);
          }
          if (descriptor.enum !== undefined && !isStringArray(descriptor.enum)) {
            at(`mcp.params.${name}.enum`, "must be an array of strings when present");
          }
          if (descriptor.optional !== undefined && descriptor.optional !== true) {
            at(`mcp.params.${name}.optional`, "must be the literal true when present");
          }
          if (descriptor.description !== undefined && !isNonEmptyString(descriptor.description)) {
            at(`mcp.params.${name}.description`, "must be a non-empty string when present");
          }
          for (const field of Object.keys(descriptor)) {
            if (!["type", "enum", "optional", "description"].includes(field)) {
              at(`mcp.params.${name}.${field}`, "unknown param descriptor key");
            }
          }
        }
      }
    }
  }

  const guide = command.guide;
  if (guide !== undefined) {
    if (!guide || typeof guide !== "object") {
      at("guide", "must be an object when present");
    } else {
      if (guide.when !== undefined && !isNonEmptyString(guide.when)) at("guide.when", "must be a non-empty string");
      if (guide.next !== undefined && !isStringArray(guide.next)) at("guide.next", "must be an array of commands");
      for (const name of Object.keys(guide)) {
        if (!["when", "next"].includes(name)) at(`guide.${name}`, "unknown guide key");
      }
    }
  }

  if (typeof command.argv !== "function") at("argv", "must be a function returning a ge argv");

  return problems;
}

/**
 * Validate a whole capability table (entry shape plus the cross-entry
 * uniqueness rules: table key = id, one owner per console route, one owner
 * per MCP tool name). Throws one aggregated Error listing every problem —
 * meant to run at registry import time so no surface can load a malformed
 * table.
 */
export function assertCapabilityTable(table) {
  const problems = [];
  const routeOwners = new Map();
  const toolOwners = new Map();
  for (const [key, command] of Object.entries(table)) {
    problems.push(...validateCapability(command, key));
    if (command?.method && command?.path) {
      const route = `${command.method} ${command.path}`;
      if (routeOwners.has(route)) problems.push(`${key}.path: route '${route}' already owned by '${routeOwners.get(route)}'`);
      else routeOwners.set(route, key);
    }
    if (command?.mcp?.tool) {
      if (toolOwners.has(command.mcp.tool)) {
        problems.push(`${key}.mcp.tool: '${command.mcp.tool}' already owned by '${toolOwners.get(command.mcp.tool)}'`);
      } else {
        toolOwners.set(command.mcp.tool, key);
      }
    }
  }
  if (problems.length) {
    throw new Error(`capability table is malformed (${problems.length} problem(s)):\n  ${problems.join("\n  ")}`);
  }
  return table;
}
