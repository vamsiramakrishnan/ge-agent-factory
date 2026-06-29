/**
 * "Bring Your Own System" backend.
 *
 * Two routes, mounted by ge-api-router.mjs:
 *   - GET  /api/systems            -> the known built-in simulated systems, read
 *                                     from the generator's registry.json.
 *   - POST /api/systems/synthesize -> synthesize a brand-new LIVE simulator from a
 *                                     natural-language description (or samples /
 *                                     OpenAPI), by spawning the generator's
 *                                     synthesize_cli.py with the spec on stdin.
 *
 * The Python interpreter is resolved the SAME way the Antigravity harness driver
 * resolves it (GE_HARNESS_PYTHON -> repo .venv -> python3); see harness-python.js
 * in apps/factory. We reimplement it here (rather than importing across
 * apps) so this app stays self-contained, while matching the resolution order.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";

// apps/console/src/server/ -> repo root is four levels up (mirrors transport.mjs
// and interview-docs.mjs).
const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

const REGISTRY_PATH = join(
  REPO_ROOT,
  "apps",
  "factory",
  "simulator-systems",
  "registry.json",
);
const SYNTH_CLI_DIR = join(REPO_ROOT, "apps", "factory", "mcp-service");
const SYNTH_CLI = join(SYNTH_CLI_DIR, "synthesize_cli.py");

/** Cap the free-text description so we never feed an unbounded prompt to the CLI. */
export const MAX_DESCRIPTION_BYTES = 8000;

const VENV_BIN =
  process.platform === "win32" ? join("Scripts", "python.exe") : join("bin", "python");

function venvPythonAt(root) {
  const candidate = join(root, ".venv", VENV_BIN);
  return existsSync(candidate) ? candidate : null;
}

/** Resolve the Python interpreter, mirroring resolveHarnessPython(). */
export function resolveSynthesisPython() {
  if (process.env.GE_HARNESS_PYTHON) return process.env.GE_HARNESS_PYTHON;
  const starts = [process.cwd(), REPO_ROOT, import.meta.dirname];
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
 * @returns {Promise<{systems: Array<{id,displayName,maturity,family}>}>}
 */
export async function listKnownSystems() {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(REGISTRY_PATH, "utf8"));
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
 * Spawn the synthesis CLI with the given spec on stdin and resolve its parsed
 * JSON result. Passes through GOOGLE_CLOUD_* env (for the LLM tier) when present.
 * Rejects with a statusCode-tagged error on spawn failure, non-zero exit, or
 * unparseable output.
 */
export function runSynthesis(spec, { timeoutMs = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const python = resolveSynthesisPython();
    const env = { ...process.env };
    const child = spawn(
      python,
      [SYNTH_CLI, "--stdin", "--include-contract", "--no-register"],
      { cwd: SYNTH_CLI_DIR, env, stdio: ["pipe", "pipe", "pipe"] },
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
      finishReject(`failed to spawn synthesis CLI (${python}): ${error.message}`, 502);
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
        resolve(JSON.parse(stdout));
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

/** Validate + synthesize. Returns the CLI's parsed JSON result. */
export async function synthesizeSystem(body = {}) {
  const spec = buildSynthesisSpec(body);
  return runSynthesis(spec);
}
