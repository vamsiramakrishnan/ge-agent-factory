/**
 * "Bring Your Own System" core.
 *
 * Moved out of apps/console/src/server/systems.mjs so the same logic can back
 * both the console routes and a `ge systems` CLI/MCP surface without a
 * cross-app import. Every filesystem/interpreter path is INJECTED — callers
 * pass either a `repoRoot` (defaults are derived from it) or explicit
 * `registryPath` / `synthesizeScript` / `python` overrides. This package never
 * looks at its own on-disk location to find anything; node builtins only, no
 * apps/* or tools/* imports (tools/check-no-app-imports.mjs).
 *
 * Two capabilities:
 *   - listKnownSystems   -> the built-in simulated systems, read from the
 *                           generator's registry.json.
 *   - buildSynthesisSpec + runSynthesis / synthesizeSystem
 *                        -> synthesize a brand-new LIVE simulator from a
 *                           natural-language description (or samples /
 *                           OpenAPI), by spawning the generator's
 *                           synthesize_cli.py with the spec on stdin.
 *   - checkToolchain     -> read-only doctor checks (python, synthesize_cli.py,
 *                           registry.json, live-system bindings, overlay-backend
 *                           durability), shared by `ge systems doctor` and the
 *                           MCP doctor tool so the check logic is written once.
 *   - bindings.mjs       -> the live-system binding schema + store (bind a
 *                           contract system to a twin/mcp/rest target); its
 *                           exports are re-exported here (and separately
 *                           reachable as "@ge/byo-systems/bindings") so
 *                           callers can use either one namespace-import or the
 *                           precise subpath.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { defaultBindingsDir, readBindings, validateBinding } from "./bindings.mjs";

export * from "./bindings.mjs";

/** Cap the free-text description so we never feed an unbounded prompt to the CLI. */
export const MAX_DESCRIPTION_BYTES = 8000;

const VENV_BIN =
  process.platform === "win32" ? join("Scripts", "python.exe") : join("bin", "python");

function venvPythonAt(root) {
  const candidate = join(root, ".venv", VENV_BIN);
  return existsSync(candidate) ? candidate : null;
}

/** Default registry.json location under a given repo root. */
export function defaultRegistryPath(repoRoot) {
  return join(repoRoot, "apps", "factory", "simulator-systems", "registry.json");
}

/** Default synthesize_cli.py location under a given repo root. */
export function defaultSynthesizeScript(repoRoot) {
  return join(repoRoot, "apps", "factory", "mcp-service", "synthesize_cli.py");
}

/**
 * Resolve the Python interpreter, mirroring resolveHarnessPython() in
 * apps/factory: GE_HARNESS_PYTHON env override, then the nearest .venv walking
 * up from `cwd` and `repoRoot` (whichever are given), then a bare "python3".
 * `env`/`cwd` are injectable so callers (and tests) never depend on this
 * process's real environment.
 */
export function resolveSynthesisPython({ repoRoot, cwd = process.cwd(), env = process.env } = {}) {
  if (env.GE_HARNESS_PYTHON) return env.GE_HARNESS_PYTHON;
  const starts = [cwd, repoRoot].filter(Boolean);
  for (const start of starts) {
    let dir = start;
    for (let i = 0; i < 8 && dir; i++) {
      const found = venvPythonAt(dir);
      if (found) return found;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return "python3";
}

/**
 * Read the known built-in systems from the generator registry.
 * @param {{repoRoot?: string, registryPath?: string}} options — repoRoot derives
 *   the default registry.json path; registryPath overrides it explicitly.
 * @returns {Promise<{systems: Array<{id,displayName,maturity,family}>}>}
 */
export async function listKnownSystems({ repoRoot, registryPath } = {}) {
  const path = registryPath || (repoRoot ? defaultRegistryPath(repoRoot) : null);
  if (!path) {
    throw new Error("listKnownSystems requires repoRoot or registryPath");
  }
  let parsed;
  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const err = new Error(`could not read simulator registry: ${error?.message || error}`);
    err.statusCode = 500;
    throw err;
  }
  const simulators = Array.isArray(parsed?.simulators) ? parsed.simulators : [];
  const systems = simulators
    .filter((sim) => sim && sim.id)
    .map((sim) => ({
      id: String(sim.id),
      displayName: sim.displayName || sim.id,
      maturity: sim.maturity || "unknown",
      family: sim.family || null,
    }));
  return { systems };
}

/**
 * Build the JSON spec the CLI reads on stdin from the request body, validating
 * the mode-specific shape. Throws a 400-tagged error on bad input.
 */
export function buildSynthesisSpec(body = {}) {
  const mode = String(body.mode || "nl").toLowerCase();
  const useLlm = body.useLlm === undefined ? true : Boolean(body.useLlm);
  const spec = { mode, use_llm: useLlm };

  if (body.displayName) spec.displayName = String(body.displayName).slice(0, 200);
  if (body.seed !== undefined && body.seed !== null && body.seed !== "") {
    const seed = Number(body.seed);
    if (Number.isFinite(seed)) spec.seed = Math.trunc(seed);
  }

  if (mode === "nl") {
    const description = String(body.description || "").trim();
    if (!description) {
      const err = new Error("description is required for mode 'nl'");
      err.statusCode = 400;
      throw err;
    }
    if (Buffer.byteLength(description, "utf8") > MAX_DESCRIPTION_BYTES) {
      const err = new Error(
        `description exceeds ${MAX_DESCRIPTION_BYTES} byte limit`,
      );
      err.statusCode = 413;
      throw err;
    }
    spec.description = description;
  } else if (mode === "samples") {
    if (!body.samples || typeof body.samples !== "object" || Array.isArray(body.samples)) {
      const err = new Error("samples must be an object of {collection: [rows]} for mode 'samples'");
      err.statusCode = 400;
      throw err;
    }
    spec.samples = body.samples;
  } else if (mode === "openapi") {
    if (!body.openapi || typeof body.openapi !== "object" || Array.isArray(body.openapi)) {
      const err = new Error("openapi must be a spec object for mode 'openapi'");
      err.statusCode = 400;
      throw err;
    }
    spec.openapi = body.openapi;
  } else {
    const err = new Error(`unsupported synthesis mode: ${mode}`);
    err.statusCode = 400;
    throw err;
  }
  return spec;
}

/**
 * Build the synthesize_cli.py argv (minus interpreter + script path) for a
 * given options set. Factored out (pure, no spawn) so `ge systems synth`'s
 * argv assembly is unit-testable without a Python interpreter: --promote
 * additionally passes --repo-root so the CLI's default (inferred from its own
 * __file__) never has to agree with our injected repoRoot.
 */
export function synthesisArgv({ script, promote = false, repoRoot } = {}) {
  const argv = [script, "--stdin", "--include-contract", "--no-register"];
  if (promote) {
    argv.push("--promote");
    if (repoRoot) argv.push("--repo-root", repoRoot);
  }
  return argv;
}

// Durable overlay backend a "remote" synth defaults to when nothing else
// picked one — matches the Python default set in
// packages/simulator-runtime/simulator_runtime/overlay.py's own "firestore"
// option, and tools/lib/planes/mcp-plane.mjs's deployEnvVars(), which forwards
// this same env var when set. "memory" (the in-process default everywhere
// else) is deliberately never returned here — an unset/"memory" backend means
// no injection happened.
export const REMOTE_DURABLE_OVERLAY_BACKEND = "firestore";

/**
 * Decide what overlay backend a synth spawn's child env should carry, without
 * mutating anything — pure so the env-injection matrix (remote+unset →
 * firestore, local → untouched, explicit env/override wins) is unit-testable
 * without a real spawn. `overlayBackend` is an explicit per-call override (a
 * future `--overlay-backend` flag would thread through here);
 * `env.GE_SIMULATOR_OVERLAY_BACKEND` is the ambient env var
 * (tools/lib/config-schema.mjs's `simulatorOverlayBackend` scalar surfaces as
 * this same var). Local mode's in-process (non-durable) default is
 * deliberately left alone — this only closes the gap for `mode: "remote"`,
 * where BYO twins living only in one cloud replica's process would otherwise
 * vanish across replica restarts/switches.
 * @param {{mode?: string, overlayBackend?: string, env?: object}} options
 * @returns {{backend: string|null, durable: boolean, injected: boolean, source: string}}
 */
export function resolveOverlayScope({ mode, overlayBackend, env = process.env } = {}) {
  const explicit = overlayBackend || env.GE_SIMULATOR_OVERLAY_BACKEND;
  if (explicit) {
    return { backend: explicit, durable: explicit !== "memory", injected: false, source: overlayBackend ? "override" : "env" };
  }
  if (mode === "remote") {
    return { backend: REMOTE_DURABLE_OVERLAY_BACKEND, durable: true, injected: true, source: "remote-default" };
  }
  return { backend: null, durable: false, injected: false, source: "in-process-default" };
}

/**
 * Spawn the synthesis CLI with the given spec on stdin and resolve its parsed
 * JSON result. Passes through GOOGLE_CLOUD_* env (for the LLM tier) when present.
 * Rejects with a statusCode-tagged error on spawn failure, non-zero exit, or
 * unparseable output.
 *
 * `mode`/`overlayBackend` feed resolveOverlayScope(): a `mode: "remote"` call
 * with no overlay backend already configured gets
 * GE_SIMULATOR_OVERLAY_BACKEND=firestore injected into the child env so a
 * BYO-synthesized twin survives cloud replica restarts/switches instead of
 * living only in this one spawned process; `mode: "local"` (or omitted)
 * leaves the in-process default untouched. The resolved scope is attached to
 * the result as `overlayScope` either way.
 * @param {{repoRoot?: string, synthesizeScript?: string, python?: string, timeoutMs?: number, promote?: boolean, mode?: string, overlayBackend?: string}} options
 */
export function runSynthesis(spec, { repoRoot, synthesizeScript, python, timeoutMs = 120000, promote = false, mode, overlayBackend } = {}) {
  const script = synthesizeScript || (repoRoot ? defaultSynthesizeScript(repoRoot) : null);
  if (!script) {
    return Promise.reject(new Error("runSynthesis requires repoRoot or synthesizeScript"));
  }
  const scriptDir = dirname(script);
  return new Promise((resolve, reject) => {
    const resolvedPython = python || resolveSynthesisPython({ repoRoot });
    const overlayScope = resolveOverlayScope({ mode, overlayBackend, env: process.env });
    const env = { ...process.env };
    if (overlayScope.injected) env.GE_SIMULATOR_OVERLAY_BACKEND = overlayScope.backend;
    const child = spawn(
      resolvedPython,
      synthesisArgv({ script, promote, repoRoot }),
      { cwd: scriptDir, env, stdio: ["pipe", "pipe", "pipe"] },
    );

    let stdout = "";
    let stderr = "";
    let settled = false;
    const finishReject = (message, statusCode) => {
      if (settled) return;
      settled = true;
      const err = new Error(message);
      err.statusCode = statusCode;
      reject(err);
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finishReject("synthesis timed out", 504);
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      finishReject(`failed to spawn synthesis CLI (${resolvedPython}): ${error.message}`, 502);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (settled) return;
      if (code !== 0) {
        const detail = (stderr || stdout).trim().slice(0, 800);
        finishReject(`synthesis CLI exited ${code}: ${detail || "no output"}`, 502);
        return;
      }
      try {
        settled = true;
        const parsed = JSON.parse(stdout);
        resolve({ ...parsed, overlayScope });
      } catch {
        const detail = (stdout || stderr).trim().slice(0, 800);
        const err = new Error(`could not parse synthesis output: ${detail || "empty"}`);
        err.statusCode = 502;
        reject(err);
      }
    });

    try {
      child.stdin.write(JSON.stringify(spec));
      child.stdin.end();
    } catch (error) {
      clearTimeout(timer);
      finishReject(`failed to write synthesis spec: ${error.message}`, 502);
    }
  });
}

/**
 * Validate + synthesize. Returns the CLI's parsed JSON result.
 * @param {{repoRoot?: string, synthesizeScript?: string, python?: string, timeoutMs?: number}} options
 */
export async function synthesizeSystem(body = {}, options = {}) {
  const spec = buildSynthesisSpec(body);
  return runSynthesis(spec, options);
}

/**
 * Probe whether a python interpreter is actually runnable — `spawnSync`
 * never throws (ENOENT lands in `res.error`), so this is a safe preflight
 * check before committing to a real synthesis spawn (or reporting doctor
 * status).
 */
export function probeInterpreter(python) {
  const res = spawnSync(python, ["--version"], { encoding: "utf8" });
  if (res.error) return { ok: false, detail: res.error.message };
  const text = (res.stdout || res.stderr || "").trim();
  return { ok: res.status === 0, detail: text || `exited ${res.status}` };
}

/**
 * Read-only toolchain checks for BYO-systems: python resolvable + runnable,
 * synthesize_cli.py present, registry.json parseable (+ system count), stored
 * live-system bindings (each validated, twin targets cross-checked against
 * the known-systems registry, mcp/rest targets shape-checked — no network
 * calls), and the GE_SIMULATOR_OVERLAY_BACKEND durability setting. Never
 * throws on a failed check — each failure becomes a `{status: "fail"}` entry
 * instead; shared by `ge systems doctor` and the MCP doctor tool so this
 * logic is written once.
 * @param {{repoRoot?: string, registryPath?: string, synthesizeScript?: string, python?: string, env?: object, bindingsDir?: string}} options
 * @returns {Promise<{ok: boolean, checks: Array<{name, status, detail, fix?}>}>}
 */
export async function checkToolchain({ repoRoot, registryPath, synthesizeScript, python, env = process.env, bindingsDir } = {}) {
  const checks = [];

  const resolvedPython = python || resolveSynthesisPython({ repoRoot, env });
  const probe = probeInterpreter(resolvedPython);
  checks.push({
    name: "python",
    status: probe.ok ? "pass" : "fail",
    detail: probe.ok ? `${resolvedPython} (${probe.detail})` : `${resolvedPython}: ${probe.detail}`,
    fix: probe.ok ? undefined : "mise run setup",
  });

  const script = synthesizeScript || (repoRoot ? defaultSynthesizeScript(repoRoot) : null);
  const scriptPresent = Boolean(script) && existsSync(script);
  checks.push({
    name: "synthesize_cli.py",
    status: scriptPresent ? "pass" : "fail",
    detail: scriptPresent ? script : script ? `not found at ${script}` : "no repoRoot/synthesizeScript given",
    fix: scriptPresent ? undefined : "mise run setup",
  });

  let knownSystemIds = null;
  try {
    const { systems } = await listKnownSystems({ repoRoot, registryPath });
    const path = registryPath || (repoRoot ? defaultRegistryPath(repoRoot) : "");
    checks.push({ name: "registry.json", status: "pass", detail: `${systems.length} system(s) at ${path}` });
    knownSystemIds = new Set(systems.map((s) => s.id));
  } catch (error) {
    checks.push({
      name: "registry.json",
      status: "fail",
      detail: error?.message || String(error),
      fix: "check apps/factory/simulator-systems/registry.json is valid JSON",
    });
  }

  // Live-system bindings: one check per stored binding (validated shape +,
  // for twin bindings, that boundTo actually names a known system — mcp/rest
  // targets are shape-checked only, never dialed). `bindingsDir` defaults from
  // repoRoot the same way registryPath/synthesizeScript do; if neither is
  // given, bindings simply aren't checked (informational, not a failure —
  // mirrors how a missing repoRoot degrades the other checks above).
  const resolvedBindingsDir = bindingsDir || (repoRoot ? defaultBindingsDir(repoRoot) : null);
  if (resolvedBindingsDir) {
    try {
      const { bindings } = await readBindings({ dir: resolvedBindingsDir });
      if (!bindings.length) {
        checks.push({
          name: "bindings",
          status: "pass",
          detail: "no live system bindings configured — systems run twin-only until bound (ge systems bind)",
        });
      } else {
        for (const binding of bindings) {
          const problems = validateBinding(binding);
          if (binding.kind === "twin" && knownSystemIds && knownSystemIds.size && !knownSystemIds.has(binding.boundTo)) {
            problems.push(`boundTo "${binding.boundTo}" is not a known system in registry.json`);
          }
          checks.push({
            name: `binding:${binding.system}`,
            status: problems.length ? "fail" : "pass",
            detail: problems.length ? problems.join("; ") : `${binding.kind} → ${binding.boundTo} (mode: ${binding.mode})`,
            fix: problems.length ? `ge systems bind ${binding.system} --to <target> --kind twin|mcp|rest --mode twin_first|live_first|twin_only` : undefined,
          });
        }
      }
    } catch (error) {
      checks.push({
        name: "bindings",
        status: "fail",
        detail: error?.message || String(error),
        fix: `check ${join(resolvedBindingsDir, "bindings.json")} is valid JSON`,
      });
    }
  }

  // In-process (non-durable) overlay is the default: any BYO-synthesized twin
  // or live binding lives only in the mcp-service worker process that made it
  // and vanishes on restart/replica switch. Informational, not a failing
  // check — `mode: "remote"` synth calls auto-inject a durable backend (see
  // resolveOverlayScope) even when this is unset.
  const overlayBackend = env.GE_SIMULATOR_OVERLAY_BACKEND;
  checks.push({
    name: "overlay backend",
    status: "pass",
    detail: overlayBackend
      ? `${overlayBackend} (durable across replicas) — twin bindings persist across replica restarts`
      : "<unset> — in-process overlay only; BYO synth results and twin bindings are NOT durable across replicas/restarts. Set simulatorOverlayBackend, or run synth in remote mode (auto-sets firestore)",
  });
  checks.push({
    name: "overlay scope",
    status: "pass",
    detail: overlayBackend
      ? `durable (${overlayBackend})`
      : "session-only (in-process) — twins will not survive replica restarts; set simulatorOverlayBackend or run in remote mode for durable",
  });

  return { ok: checks.every((c) => c.status !== "fail"), checks };
}
