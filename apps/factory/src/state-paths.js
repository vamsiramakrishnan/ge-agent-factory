import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function resolveRepositoryRoot(startRoot = APP_ROOT) {
  if (process.env.GE_REPO_ROOT) return resolve(process.env.GE_REPO_ROOT);
  let current = resolve(startRoot);
  for (let i = 0; i < 6; i += 1) {
    if (existsSync(join(current, "tools", "ge.mjs")) && existsSync(join(current, "apps", "factory"))) return current;
    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
  }
  return resolve(startRoot);
}

export const REPOSITORY_ROOT = resolveRepositoryRoot();

// Single state root, shared with tools/lib/state-paths.mjs via GE_STATE_ROOT, so
// the generator (src/.js) and the toolchain (tools/.mjs) can never silently split
// across two different .ge directories. The legacy GE_HARNESS_* overrides still
// take precedence for backward compatibility. Keep this in lockstep with
// tools/lib/state-paths.mjs — the parity contract test enforces it.
const STATE_ROOT = process.env.GE_STATE_ROOT
  ? resolve(process.env.GE_STATE_ROOT)
  : join(REPOSITORY_ROOT, ".ge");
export const GENERATOR_DATA_ROOT = process.env.GE_HARNESS_DATA_ROOT
  ? resolve(process.env.GE_HARNESS_DATA_ROOT)
  : join(STATE_ROOT, "factory");
export const GENERATOR_WORKSPACES_ROOT = join(GENERATOR_DATA_ROOT, "workspaces");
export const GENERATOR_WORKSPACE_STORE = join(GENERATOR_DATA_ROOT, "workspaces.json");
export const GENERATOR_SKILLS_MANIFEST = process.env.GE_HARNESS_SKILLS_MANIFEST
  ? resolve(process.env.GE_HARNESS_SKILLS_MANIFEST)
  : join(STATE_ROOT, "skills", "manifest.json");
export const GENERATOR_UV_CACHE = join(STATE_ROOT, "cache", "uv");

export function displayPath(path) {
  return relative(REPOSITORY_ROOT, path).replaceAll("\\", "/");
}
