import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const DEFAULT_STATE_ROOT = join(REPO_ROOT, ".ge");
const stateRoot = resolve(process.env.GE_STATE_ROOT || DEFAULT_STATE_ROOT);

export const STATE_PATHS = {
  root: stateRoot,
  config: join(REPO_ROOT, ".ge.json"),
  envState: join(stateRoot, "state.json"),
  syncState: join(stateRoot, "generated-agents-sync-state.json"),
  runtime: {
    root: join(stateRoot, "runtime"),
    runs: join(stateRoot, "runtime", "runs"),
    pid: join(stateRoot, "runtime", "daemon.pid"),
    meta: join(stateRoot, "runtime", "daemon.json"),
    log: join(stateRoot, "runtime", "daemon.log"),
  },
  missions: {
    root: join(stateRoot, "missions"),
  },
  interviews: {
    root: join(stateRoot, "interviews"),
  },
  skills: {
    root: join(stateRoot, "skills"),
    manifest: join(stateRoot, "skills", "manifest.json"),
  },
  console: {
    root: join(stateRoot, "console"),
    jobs: join(stateRoot, "console", "jobs"),
  },
  factory: {
    root: join(stateRoot, "factory"),
    runs: join(stateRoot, "factory"),
    events: join(stateRoot, "factory", "factory-events.jsonl"),
    workspaces: join(stateRoot, "factory", "workspaces"),
    workspacesJson: join(stateRoot, "factory", "workspaces.json"),
    projects: join(stateRoot, "factory", "workspaces"),
    projectsJson: join(stateRoot, "factory", "workspaces.json"),
  },
  cache: {
    root: join(stateRoot, "cache"),
    uv: join(stateRoot, "cache", "uv"),
  },
};

export const LEGACY_STATE_PATHS = {
  envState: join(REPO_ROOT, ".ge-state.json"),
  syncState: join(REPO_ROOT, ".generated-agents-sync-state.json"),
  runtime: {
    root: join(REPO_ROOT, ".ge-daemon"),
    runs: join(REPO_ROOT, ".ge-daemon", "runs"),
    pid: join(REPO_ROOT, ".ge-daemon", "daemon.pid"),
    meta: join(REPO_ROOT, ".ge-daemon", "daemon.json"),
    log: join(REPO_ROOT, ".ge-daemon", "daemon.log"),
  },
  missions: {
    root: join(REPO_ROOT, ".ge-missions"),
  },
  interviews: {
    root: join(REPO_ROOT, ".ge-harness", "interviews"),
  },
  skills: {
    root: join(REPO_ROOT, ".harness", "skills"),
    manifest: join(REPO_ROOT, ".harness", "skills", "manifest.json"),
  },
  console: {
    jobs: join(REPO_ROOT, ".harness", "console-jobs"),
  },
  factory: {
    root: join(REPO_ROOT, "apps", "ge-demo-generator", ".harness", "factory"),
    events: join(REPO_ROOT, "apps", "ge-demo-generator", ".harness", "factory", "factory-events.jsonl"),
    projects: join(REPO_ROOT, "apps", "ge-demo-generator", ".harness", "projects"),
    projectsJson: join(REPO_ROOT, "apps", "ge-demo-generator", ".harness", "projects.json"),
  },
  cache: {
    uv: join(REPO_ROOT, "apps", "ge-demo-generator", ".harness", "uv-cache"),
  },
};

export function statePath(...parts) {
  return join(STATE_PATHS.root, ...parts);
}

export function relativeToRepo(path) {
  return relative(REPO_ROOT, path).replaceAll("\\", "/");
}

const warnedLegacyPaths = new Set();

export function firstExistingPath(canonical, legacy = null) {
  if (existsSync(canonical)) return canonical;
  if (legacy && existsSync(legacy)) {
    // Surface the silent fallback: reading old-layout state transparently masks a
    // half-finished migration. Warn once per path instead of quietly diverging.
    if (!warnedLegacyPaths.has(legacy)) {
      warnedLegacyPaths.add(legacy);
      console.warn(
        `[state] reading legacy path ${relativeToRepo(legacy)} because canonical ${relativeToRepo(canonical)} ` +
          `does not exist. Run \`ge state migrate\` to move it; legacy reads will be removed in a future release.`,
      );
    }
    return legacy;
  }
  return canonical;
}

export function allExistingPaths(paths = []) {
  return paths.filter(Boolean).filter((path) => existsSync(path));
}

export function ensureStateLayout() {
  for (const dir of [
    STATE_PATHS.root,
    STATE_PATHS.runtime.runs,
    STATE_PATHS.missions.root,
    STATE_PATHS.interviews.root,
    STATE_PATHS.skills.root,
    STATE_PATHS.console.jobs,
    STATE_PATHS.factory.root,
    STATE_PATHS.factory.workspaces,
    STATE_PATHS.cache.uv,
  ]) {
    mkdirSync(dir, { recursive: true });
  }
  return STATE_PATHS;
}

export function displayStatePath(path) {
  return relativeToRepo(path);
}
