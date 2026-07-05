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
 * This is a thin binding: the actual logic lives in @ge/byo-systems
 * (packages/byo-systems), parameterized by {repoRoot}/explicit paths so it can
 * also back `ge systems` and the MCP server without a cross-app import. This
 * file just binds the console's concrete repo layout and re-exports the same
 * names/signatures existing callers (ge-api-router.mjs, systems.test.mjs) use.
 *
 * The Python interpreter is resolved the SAME way the Antigravity harness driver
 * resolves it (GE_HARNESS_PYTHON -> repo .venv -> python3); see harness-python.js
 * in apps/factory.
 */
import { join } from "node:path";
import * as byoSystems from "@ge/byo-systems";

// apps/console/src/server/ -> repo root is four levels up (mirrors transport.mjs
// and interview-docs.mjs).
const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

export const MAX_DESCRIPTION_BYTES = byoSystems.MAX_DESCRIPTION_BYTES;

/** Resolve the Python interpreter, mirroring resolveHarnessPython(). */
export function resolveSynthesisPython() {
  return byoSystems.resolveSynthesisPython({ repoRoot: REPO_ROOT });
}

/**
 * Read the known built-in systems from the generator registry.
 * @returns {Promise<{systems: Array<{id,displayName,maturity,family}>}>}
 */
export function listKnownSystems() {
  return byoSystems.listKnownSystems({ repoRoot: REPO_ROOT });
}

/**
 * Build the JSON spec the CLI reads on stdin from the request body, validating
 * the mode-specific shape. Throws a 400-tagged error on bad input.
 */
export const buildSynthesisSpec = byoSystems.buildSynthesisSpec;

/**
 * Spawn the synthesis CLI with the given spec on stdin and resolve its parsed
 * JSON result. Passes through GOOGLE_CLOUD_* env (for the LLM tier) when present.
 * Rejects with a statusCode-tagged error on spawn failure, non-zero exit, or
 * unparseable output.
 *
 * `mode` is an optional passthrough to @ge/byo-systems' overlay-durability
 * resolution (a "remote" mode auto-injects a durable GE_SIMULATOR_OVERLAY_BACKEND
 * when none is already configured; see resolveOverlayScope in
 * packages/byo-systems/src/index.mjs). Omitted (the console's current
 * behavior — no caller here passes it yet), this is a no-op: the in-process
 * default is unchanged.
 */
export function runSynthesis(spec, { timeoutMs = 120000, mode } = {}) {
  return byoSystems.runSynthesis(spec, { repoRoot: REPO_ROOT, timeoutMs, mode });
}

/** Validate + synthesize. Returns the CLI's parsed JSON result. `mode` is the same optional passthrough as runSynthesis() above. */
export async function synthesizeSystem(body = {}, { mode } = {}) {
  return byoSystems.synthesizeSystem(body, { repoRoot: REPO_ROOT, mode });
}
