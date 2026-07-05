/**
 * Live-system binding schema + store for "Bring Your Own System".
 *
 * A binding says where a contract system's LIVE backing lives — a twin pack,
 * an MCP endpoint, or a REST base URL — and how eval/harness runs should
 * weigh twin vs. live truth (`mode`). Bindings are stored as one JSON file
 * (`bindings.json`) under an INJECTED `dir` — callers pass the `.ge/systems`
 * directory (or any other directory, for tests); this module never assumes
 * where that lives on disk, same convention as index.mjs's
 * {repoRoot}/registryPath/synthesizeScript injection.
 *
 * Dependency-free: node builtins only (no @ge/std, no apps/*, no tools/*),
 * so this package's zero-dependency footprint (see package.json) is
 * unchanged. writeJsonAtomic() below hand-rolls the same tmp-file+rename
 * pattern @ge/std/json-io's writeJson uses, rather than taking that
 * dependency.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

/** Binding schema version — bump this if the shape below changes incompatibly. */
export const BINDING_SCHEMA_VERSION = "ge.system-binding.v1";

/** Closed vocabulary: what a system is bound to. */
export const BINDING_KINDS = Object.freeze(["twin", "mcp", "rest"]);

/** Closed vocabulary: how twin vs. live truth is weighed for a bound system. */
export const BINDING_MODES = Object.freeze(["twin_first", "live_first", "twin_only"]);

const BINDINGS_FILENAME = "bindings.json";

/** Default bindings-store directory under a given repo root (mirrors defaultRegistryPath/defaultSynthesizeScript in index.mjs). */
export function defaultBindingsDir(repoRoot) {
  return join(repoRoot, ".ge", "systems");
}

function bindingsPath(dir) {
  return join(dir, BINDINGS_FILENAME);
}

function isHttpUrlShaped(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate a binding's shape against the closed vocabularies + URL-shape
 * rule for mcp/rest targets. Returns an array of problem strings — empty
 * means valid. Never throws; callers (writeBinding, doctor checks) decide
 * whether problems are fatal.
 */
export function validateBinding(binding) {
  if (!binding || typeof binding !== "object" || Array.isArray(binding)) {
    return ["binding must be an object"];
  }
  const problems = [];

  if (binding.schemaVersion !== undefined && binding.schemaVersion !== BINDING_SCHEMA_VERSION) {
    problems.push(`schemaVersion must be "${BINDING_SCHEMA_VERSION}" (got ${JSON.stringify(binding.schemaVersion)})`);
  }
  if (typeof binding.system !== "string" || !binding.system.trim()) {
    problems.push("system is required (the contract system id being bound)");
  }
  if (typeof binding.boundTo !== "string" || !binding.boundTo.trim()) {
    problems.push("boundTo is required (twin pack id | MCP endpoint URL | REST base URL)");
  }
  if (!BINDING_KINDS.includes(binding.kind)) {
    problems.push(`kind must be one of: ${BINDING_KINDS.join(", ")} (got ${JSON.stringify(binding.kind)})`);
  }
  if (!BINDING_MODES.includes(binding.mode)) {
    problems.push(`mode must be one of: ${BINDING_MODES.join(", ")} (got ${JSON.stringify(binding.mode)})`);
  }
  if (
    (binding.kind === "mcp" || binding.kind === "rest") &&
    typeof binding.boundTo === "string" &&
    binding.boundTo.trim() &&
    !isHttpUrlShaped(binding.boundTo)
  ) {
    problems.push(`boundTo must be an http(s) URL for kind "${binding.kind}" (got ${JSON.stringify(binding.boundTo)})`);
  }
  if (binding.connector !== undefined && typeof binding.connector !== "string") {
    problems.push("connector must be a string when present");
  }
  if (
    binding.config !== undefined &&
    (typeof binding.config !== "object" || binding.config === null || Array.isArray(binding.config))
  ) {
    problems.push("config must be a plain object when present");
  }
  return problems;
}

// A temp-file counter that, with the pid, makes temp names unique without
// Math.random — mirrors @ge/std/json-io's writeJson (deterministic, no
// collisions), hand-rolled here so this package takes no dependency.
let tmpSeq = 0;

async function writeJsonAtomic(path, value) {
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });
  const tmp = join(dir, `.${basename(path)}.${process.pid}.${tmpSeq++}.tmp`);
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try {
    await rename(tmp, path);
  } catch (error) {
    try {
      await unlink(tmp);
    } catch {
      /* best-effort cleanup */
    }
    throw error;
  }
}

async function readBindingsMap(path) {
  if (!existsSync(path)) return {};
  let parsed;
  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`could not read bindings store at ${path}: ${error?.message || error}`);
  }
  return parsed && typeof parsed === "object" && parsed.bindings && typeof parsed.bindings === "object"
    ? parsed.bindings
    : {};
}

/**
 * Read all stored bindings from `<dir>/bindings.json`. A missing file is not
 * an error — an unbound system is the common case — and resolves to an empty
 * list. A present-but-corrupt file throws (never silently discards state the
 * operator wrote).
 * @param {{dir: string}} options
 * @returns {Promise<{schemaVersion: string, bindings: Array<object>}>}
 */
export async function readBindings({ dir } = {}) {
  if (!dir) throw new Error("readBindings requires dir");
  const map = await readBindingsMap(bindingsPath(dir));
  const bindings = Object.values(map).sort((a, b) => String(a?.system).localeCompare(String(b?.system)));
  return { schemaVersion: BINDING_SCHEMA_VERSION, bindings };
}

/**
 * Validate and persist one binding, keyed by `binding.system` (overwrites any
 * existing binding for that system). Throws (with a `.problems` array) on a
 * binding that fails validateBinding() — this store never holds invalid
 * state.
 * @param {{dir: string, binding: object}} options
 * @returns {Promise<object>} the stored binding (schemaVersion/updatedAt filled in)
 */
export async function writeBinding({ dir, binding } = {}) {
  if (!dir) throw new Error("writeBinding requires dir");
  const problems = validateBinding(binding);
  if (problems.length) {
    const err = new Error(`invalid system binding: ${problems.join("; ")}`);
    err.problems = problems;
    throw err;
  }
  const path = bindingsPath(dir);
  const existing = await readBindingsMap(path);
  const stored = {
    ...binding,
    schemaVersion: BINDING_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };
  existing[binding.system] = stored;
  await writeJsonAtomic(path, { schemaVersion: BINDING_SCHEMA_VERSION, bindings: existing });
  return stored;
}

/**
 * Remove a system's binding. Returns `false` (no-op, not an error) if the
 * system wasn't bound or the store doesn't exist yet.
 * @param {{dir: string, system: string}} options
 * @returns {Promise<boolean>} whether a binding was actually removed
 */
export async function removeBinding({ dir, system } = {}) {
  if (!dir) throw new Error("removeBinding requires dir");
  if (!system) throw new Error("removeBinding requires system");
  const path = bindingsPath(dir);
  if (!existsSync(path)) return false;
  const existing = await readBindingsMap(path);
  if (!(system in existing)) return false;
  delete existing[system];
  await writeJsonAtomic(path, { schemaVersion: BINDING_SCHEMA_VERSION, bindings: existing });
  return true;
}
