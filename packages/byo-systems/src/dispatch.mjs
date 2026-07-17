/**
 * Dispatch resolution: the one place a binding's `mode` becomes a routing
 * decision. Before this module, bindings were stored metadata — validated,
 * listed, doctor-checked, but never consulted when a tool call had to pick
 * twin vs. live. Every surface that routes a call (the tool-plane router via
 * its dispatch directive, `ge systems doctor --dial`, the Phase 2
 * profile/record/compare commands) resolves through here so the precedence
 * table is written once.
 *
 * The decision is deliberately conservative:
 *   - unbound          -> twin ("twin-only until bound", the documented posture)
 *   - twin_only        -> twin
 *   - twin_first       -> twin, with the live binding attached so a caller
 *                         running a deliberate live comparison can reach it
 *   - live_first       -> live, only when the binding kind is dialable
 *                         ("rest" today; "mcp" needs a client story, "twin"
 *                         has no live side) — otherwise twin, with a warning
 *                         the doctor surfaces
 *
 * Read-path only: callers routing WRITE-class ops must not consult `decision`
 * — writes always go to the twin regardless of mode until mutation semantics
 * land (see docs/plans/real-system-twins/phase-1-mutation-model.md). The
 * `writeDecision` field states that explicitly so no caller has to know the
 * rule by folklore.
 *
 * Same conventions as the rest of this package: dependency-free, pure where
 * possible (resolveDispatchDecision takes the binding, resolveDispatch adds
 * the store read), every path injected.
 */
import {
  ConnectorError,
  DEFAULT_MAX_RESPONSE_BYTES,
  MAX_RESPONSE_BYTES_HARD_CAP,
  validateRestTarget,
} from "@ge/connector-core";
import { readBindings, validateBinding } from "./bindings.mjs";

/** Binding kinds a live decision can actually dial today. */
export const DIALABLE_KINDS = Object.freeze(["rest"]);

/** Closed vocabulary of decision reasons (stable — surfaces render these). */
export const DISPATCH_REASONS = Object.freeze([
  "unbound", // no binding stored for the system
  "invalid_binding", // a binding exists but fails validateBinding()
  "twin_only", // operator pinned the system to its twin
  "twin_first", // twin leads; live side available for deliberate comparison
  "live_first", // live leads and the kind is dialable
  "live_first_undialable", // live requested but the kind cannot be dialed yet
]);

function livePolicyProblems(binding) {
  if (binding.kind !== "rest") return [];
  const config = binding.config || {};
  const problems = [];
  for (const key of ["allowInsecureHttp", "allowPrivateNetwork"]) {
    if (config[key] !== undefined && typeof config[key] !== "boolean") {
      problems.push(`config.${key} must be boolean when present`);
    }
  }
  if (config.authEnv !== undefined && !/^[A-Z][A-Z0-9_]*$/.test(String(config.authEnv))) {
    problems.push("config.authEnv must be an uppercase environment-variable name");
  }
  if (config.timeoutMs !== undefined && (!Number.isFinite(config.timeoutMs) || config.timeoutMs <= 0)) {
    problems.push("config.timeoutMs must be a positive number");
  }
  if (
    config.maxResponseBytes !== undefined &&
    (!Number.isSafeInteger(config.maxResponseBytes) ||
      config.maxResponseBytes <= 0 ||
      config.maxResponseBytes > MAX_RESPONSE_BYTES_HARD_CAP)
  ) {
    problems.push(`config.maxResponseBytes must be an integer between 1 and ${MAX_RESPONSE_BYTES_HARD_CAP}`);
  }
  if (
    config.allowedHosts !== undefined &&
    (!Array.isArray(config.allowedHosts) || config.allowedHosts.some((host) => typeof host !== "string" || !host.trim()))
  ) {
    problems.push("config.allowedHosts must be an array of non-empty host names");
  }
  try {
    validateRestTarget(binding.boundTo, {
      allowInsecureHttp: config.allowInsecureHttp === true,
      allowPrivateNetwork: config.allowPrivateNetwork === true,
      allowedHosts: config.allowedHosts,
    });
  } catch (error) {
    problems.push(error instanceof ConnectorError ? error.message : "REST target violates connector policy");
  }
  return problems;
}

/**
 * Pure precedence table: one stored binding (or null/undefined for unbound)
 * -> a dispatch decision. Never throws — an invalid binding resolves to twin
 * with reason "invalid_binding" and the problems attached, because a routing
 * layer must always have an answer and the safe answer is the twin.
 * @param {object|null|undefined} binding
 * @returns {{decision: "twin"|"live", writeDecision: "twin", reason: string,
 *            binding: object|null, live: object|null, problems?: string[]}}
 */
export function resolveDispatchDecision(binding) {
  const base = { decision: "twin", writeDecision: "twin", binding: binding || null, live: null };
  if (!binding) return { ...base, reason: "unbound" };

  const problems = [...validateBinding(binding), ...livePolicyProblems(binding)];
  if (problems.length) return { ...base, reason: "invalid_binding", problems };

  const dialable = DIALABLE_KINDS.includes(binding.kind);
  const live = dialable ? { kind: binding.kind, boundTo: binding.boundTo, connector: binding.connector, config: binding.config } : null;

  if (binding.mode === "twin_only") return { ...base, reason: "twin_only" };
  if (binding.mode === "twin_first") return { ...base, reason: "twin_first", live };
  // live_first — the only mode that can flip the read-path decision.
  if (!dialable) return { ...base, reason: "live_first_undialable" };
  return { ...base, decision: "live", reason: "live_first", live };
}

/**
 * Resolve the dispatch decision for one system from the bindings store.
 * A missing store or unbound system is the common case, not an error.
 * @param {string} system
 * @param {{dir: string}} options — the bindings directory (`.ge/systems`),
 *   injected like every other path in this package.
 */
export async function resolveDispatch(system, { dir } = {}) {
  if (!system) throw new Error("resolveDispatch requires a system id");
  if (!dir) throw new Error("resolveDispatch requires dir");
  const { bindings } = await readBindings({ dir });
  const binding = bindings.find((b) => b?.system === system) || null;
  return { system, ...resolveDispatchDecision(binding) };
}

/**
 * Resolve every stored binding into a decision map, keyed by system —
 * what the tool-plane dispatch directive and `doctor` consume so they make
 * one store read, not one per system.
 * @param {{dir: string}} options
 * @returns {Promise<Record<string, ReturnType<typeof resolveDispatchDecision> & {system: string}>>}
 */
export async function resolveAllDispatch({ dir } = {}) {
  if (!dir) throw new Error("resolveAllDispatch requires dir");
  const { bindings } = await readBindings({ dir });
  const decisions = {};
  for (const binding of bindings) {
    if (!binding?.system) continue;
    decisions[binding.system] = { system: binding.system, ...resolveDispatchDecision(binding) };
  }
  return decisions;
}

// The env contract the Python tool plane reads (packages/simulator-runtime/
// simulator_runtime/live_dispatch.py). One directive, two delivery vars:
// inline JSON, or a path to the same JSON on disk. Env unset (the default)
// means no directive and no behavior change.
export const DISPATCH_ENV = "GE_SIMULATOR_DISPATCH";
export const DISPATCH_FILE_ENV = "GE_SIMULATOR_DISPATCH_FILE";
export const LIVE_CONFIRM_ENV = "GE_SIMULATOR_LIVE_CONFIRM";
export const DIRECTIVE_SCHEMA_VERSION = "ge.dispatch-directive.v1";

/**
 * Compile the bindings store into the dispatch DIRECTIVE the tool plane
 * consumes: resolved decisions and call order, never unresolved policy. Twin
 * is the runtime's default, so only bindings with a dialable live side are
 * entries. Both twin_first and live_first are emitted; twin_first carries
 * the live side only for an explicit comparison flow and never falls through
 * to live during ordinary tool execution. Auth stays by reference: the
 * directive carries the env var NAME from the binding's `config.authEnv`;
 * the Python side resolves the value at call time.
 * @param {{dir: string}} options
 * @returns {Promise<{schemaVersion: string, systems: Record<string, object>}>}
 */
export async function buildDispatchDirective({ dir } = {}) {
  if (!dir) throw new Error("buildDispatchDirective requires dir");
  const decisions = await resolveAllDispatch({ dir });
  const systems = {};
  for (const [system, resolved] of Object.entries(decisions)) {
    if (!resolved.live || !["twin_first", "live_first"].includes(resolved.reason)) continue;
    const config = resolved.live.config || {};
    systems[system] = {
      decision: resolved.decision,
      mode: resolved.reason,
      fallback: resolved.reason === "live_first" ? "twin" : "live",
      kind: resolved.live.kind,
      baseUrl: resolved.live.boundTo,
      requiresApproval: true,
      ...(config.authEnv ? { authEnv: String(config.authEnv) } : {}),
      ...(Number.isFinite(config.timeoutMs) ? { timeoutMs: config.timeoutMs } : {}),
      ...(Number.isSafeInteger(config.maxResponseBytes)
        ? { maxResponseBytes: config.maxResponseBytes }
        : { maxResponseBytes: DEFAULT_MAX_RESPONSE_BYTES }),
      ...(config.allowInsecureHttp === true ? { allowInsecureHttp: true } : {}),
      ...(config.allowPrivateNetwork === true ? { allowPrivateNetwork: true } : {}),
      ...(Array.isArray(config.allowedHosts) ? { allowedHosts: config.allowedHosts } : {}),
    };
  }
  return { schemaVersion: DIRECTIVE_SCHEMA_VERSION, systems };
}
