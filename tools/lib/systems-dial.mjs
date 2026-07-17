/**
 * `ge systems doctor --dial` core — the first (and only, by design) doctor
 * path that opens a network connection: one read-only reachability probe per
 * stored `rest` binding, plus the dispatch decision each binding resolves to
 * (packages/byo-systems/src/dispatch.mjs), appended to the never-dials
 * checkToolchain() checks. Registry risk: `calls-live-readonly` — this is
 * the vocabulary level's first consumer, so every surface (CLI confirm,
 * MCP tool description) presents dialing distinctly from `read-only`.
 *
 * Shared by `ge systems doctor --dial` (tools/ge/systems.mjs) and the
 * factory_systems_dial MCP tool (tools/mcp-server.mjs); there is no console
 * route in this phase. `env`/`fetchImpl`/`resolveHost` are injectable so tests
 * never dial or resolve a real host.
 */
import { checkToolchain, defaultBindingsDir, readBindings, resolveDispatchDecision } from "@ge/byo-systems";
import { probeRestBinding } from "@ge/connector-core";

function describeDecision(decision) {
  const reads = decision.decision === "live" ? "live" : "twin";
  return `reads → ${reads} (${decision.reason}); writes → twin (always, until mutation semantics land)`;
}

/**
 * Probe every stored binding read-only and resolve its dispatch decision.
 * Returns doctor-shaped checks only (no toolchain checks) — callers compose.
 * Never throws on a failed probe; unreachable is a failing CHECK, not a crash.
 * @param {{repoRoot?: string, bindingsDir?: string, env?: object, fetchImpl?: typeof fetch, resolveHost?: (hostname: string) => Promise<unknown>, timeoutMs?: number}} options
 * @returns {Promise<{ok: boolean, checks: Array<{name, status, detail, fix?}>}>}
 */
export async function dialChecks({ repoRoot, bindingsDir, env = process.env, fetchImpl = fetch, resolveHost, timeoutMs = 10_000 } = {}) {
  const dir = bindingsDir || (repoRoot ? defaultBindingsDir(repoRoot) : null);
  if (!dir) throw new Error("dialChecks requires repoRoot or bindingsDir");

  const checks = [];
  const { bindings } = await readBindings({ dir });
  if (!bindings.length) {
    checks.push({
      name: "dial",
      status: "pass",
      detail: "no live system bindings to dial — systems run twin-only until bound (ge systems bind)",
    });
    return { ok: true, checks };
  }

  for (const binding of bindings) {
    const decision = resolveDispatchDecision(binding);
    checks.push({
      name: `dispatch:${binding.system}`,
      status: decision.reason === "invalid_binding" ? "fail" : "pass",
      detail:
        decision.reason === "invalid_binding"
          ? `binding invalid: ${decision.problems.join("; ")}`
          : describeDecision(decision),
      fix:
        decision.reason === "invalid_binding"
          ? `ge systems bind ${binding.system} --to <target> --kind twin|mcp|rest --mode twin_first|live_first|twin_only`
          : undefined,
    });

    const probe = await probeRestBinding(binding, { env, fetchImpl, resolveHost, timeoutMs });
    if (!probe.dialable) {
      checks.push({
        name: `dial:${binding.system}`,
        status: "pass",
        detail: `skipped — kind "${binding.kind}" is not dialable (rest only in this phase)`,
      });
      continue;
    }
    const healthy = probe.reachable && probe.authorized !== false;
    checks.push({
      name: `dial:${binding.system}`,
      status: healthy ? "pass" : "fail",
      detail: probe.reachable
        ? `HTTP ${probe.status} in ${probe.latencyMs}ms${probe.authorized === false ? " — reachable but NOT authorized" : ""}`
        : `unreachable: ${probe.detail || "no response"}`,
      fix: healthy
        ? undefined
        : probe.authorized === false
          ? `export ${binding.config?.authEnv || "<AUTH_VAR>"} with a valid token, or rebind with --config '{"authEnv":"<AUTH_VAR>"}'`
          : `check the base URL (${binding.boundTo}) and network path, then re-run ge systems doctor --dial`,
    });
  }
  return { ok: checks.every((c) => c.status !== "fail"), checks };
}

/**
 * The full `--dial` doctor: checkToolchain()'s never-dials checks first,
 * then the dial + dispatch checks appended — one composed result for the
 * CLI renderer and the MCP tool alike.
 * @param {{repoRoot: string, bindingsDir?: string, env?: object, fetchImpl?: typeof fetch, resolveHost?: (hostname: string) => Promise<unknown>, timeoutMs?: number}} options
 */
export async function doctorWithDial({ repoRoot, bindingsDir, env = process.env, fetchImpl = fetch, resolveHost, timeoutMs = 10_000 } = {}) {
  const base = await checkToolchain({ repoRoot, bindingsDir, env });
  const dial = await dialChecks({ repoRoot, bindingsDir, env, fetchImpl, resolveHost, timeoutMs });
  return { ok: base.ok && dial.ok, checks: [...base.checks, ...dial.checks] };
}
