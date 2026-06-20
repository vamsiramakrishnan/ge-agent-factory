import { mkdir, readFile, readdir, realpath, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { buildReadiness, nextActionsForReadiness } from "./workspace-capabilities.js";

const SAFE_ID = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;
const OPERATIONAL_DIRS = new Set(["runs", "versions"]);

export function sanitizeProjectId(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  if (SAFE_ID.test(slug)) return slug;
  return `project-${randomUUID().slice(0, 8)}`;
}

export function projectDir(projectsRoot, projectId) {
  if (!SAFE_ID.test(projectId)) throw new Error("invalid project id");
  return join(projectsRoot, projectId);
}

export function normalizeWorkspaceRelativePath(value, { allowEmpty = false } = {}) {
  const raw = String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = raw.split("/").filter(Boolean);
  if (!allowEmpty && parts.length === 0) throw new Error("path required");
  for (const part of parts) {
    if (part === "." || part === "..") throw new Error("invalid file path");
  }
  return parts.join("/");
}

export function resolveProjectPath(projectsRoot, projectId, relPath, { allowRoot = false } = {}) {
  const root = projectDir(projectsRoot, projectId);
  const safePath = normalizeWorkspaceRelativePath(relPath, { allowEmpty: allowRoot });
  const rootPath = resolve(root);
  const fullPath = resolve(root, safePath);
  if (!fullPath.startsWith(`${rootPath}/`) && fullPath !== rootPath) {
    throw new Error("invalid file path");
  }
  return { root, rootPath, relPath: safePath, fullPath };
}

export function workspaceManifestPath(projectsRoot, projectId) {
  return join(projectDir(projectsRoot, projectId), "workspace.json");
}

export function projectRunsDir(projectsRoot, projectId) {
  return join(projectDir(projectsRoot, projectId), "runs");
}

export async function ensureProjectDir(projectsRoot, projectId) {
  const dir = projectDir(projectsRoot, projectId);
  await mkdir(dir, { recursive: true });
  await mkdir(join(dir, "runs"), { recursive: true });
  await mkdir(join(dir, "artifacts"), { recursive: true });
  await mkdir(join(dir, "systems"), { recursive: true });
  await mkdir(join(dir, "versions"), { recursive: true });
  return dir;
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2), "utf8");
}

export async function readWorkspaceManifest(projectsRoot, projectId) {
  return readJson(workspaceManifestPath(projectsRoot, projectId), null);
}

async function buildWorkspaceManifest(project, existing = null, workspaceDir = null) {
  const now = new Date().toISOString();
  const readiness = workspaceDir ? await buildReadiness(workspaceDir) : existing?.readiness || {};
  const capabilities = Array.from(new Set([
    ...(Array.isArray(existing?.capabilities) ? existing.capabilities : []),
    "workspace",
    ...(readiness.mockData?.status === "ready" ? ["mock_data"] : []),
    ...(readiness.agent?.status === "ready" ? ["adk_agent", "fixture_tools"] : []),
    ...(readiness.tests?.status === "passing" ? ["smoke_tests"] : []),
    ...(readiness.localPreview?.status === "running" ? ["local_preview"] : []),
    ...(readiness.deployPlan?.status === "ready" ? ["deploy_plan"] : []),
    ...(readiness.deployment?.status === "ready" ? ["deployment"] : []),
    ...(readiness.publishPlan?.status === "ready" ? ["publish_plan"] : []),
    ...(readiness.published?.status === "ready" ? ["published"] : []),
  ]));
  const nextActions = nextActionsForReadiness(readiness);
  return {
    id: project.id,
    name: project.name,
    kind: project.kind || "workspace",
    mode: existing?.mode || "local_mock",
    createdAt: project.createdAt || existing?.createdAt || now,
    updatedAt: project.updatedAt || existing?.updatedAt || now,
    goal: existing?.goal || null,
    capabilities,
    readiness,
    agent: existing?.agent || null,
    nextActions,
    nextAction: nextActions[0] || null,
    systems: {
      path: "systems",
      items: Array.isArray(existing?.systems?.items) ? existing.systems.items : [],
    },
    runs: {
      path: "runs",
      events: "runs/<runId>/events.jsonl",
    },
    artifacts: {
      path: "artifacts",
      items: Array.isArray(existing?.artifacts?.items) ? existing.artifacts.items : [],
    },
    useCaseId: project.useCaseId || existing?.useCaseId || null,
    departmentId: project.departmentId || existing?.departmentId || null,
    currentVersion: existing?.currentVersion || null,
    versions: {
      path: "versions",
      count: existing?.versions?.count || 0,
    },
  };
}

export async function ensureWorkspaceManifest(projectsRoot, project) {
  const dir = await ensureProjectDir(projectsRoot, project.id);
  const existing = await readWorkspaceManifest(projectsRoot, project.id);
  const manifest = await buildWorkspaceManifest(project, existing, dir);
  await writeJson(workspaceManifestPath(projectsRoot, project.id), manifest);
  return manifest;
}

export async function readProjectStore(storePath) {
  const store = await readJson(storePath, { workspaces: [] });
  const workspaces = Array.isArray(store.workspaces) ? store.workspaces : [];
  return { projects: workspaces, workspaces };
}

async function writeProjectStore(storePath, store) {
  const workspaces = Array.isArray(store?.workspaces)
    ? store.workspaces
    : Array.isArray(store?.projects)
      ? store.projects
      : [];
  await writeJson(storePath, { workspaces });
}

export async function listProjects({ storePath, projectsRoot }) {
  const store = await readProjectStore(storePath);
  return Promise.all(store.projects.map(async (project) => {
    const dir = projectDir(projectsRoot, project.id);
    if (existsSync(dir)) await ensureWorkspaceManifest(projectsRoot, project);
    const files = existsSync(dir) ? await listProjectFiles(projectsRoot, project.id) : [];
    const manifest = existsSync(dir) ? await readWorkspaceManifest(projectsRoot, project.id) : null;
    return { ...project, path: dir, fileCount: files.length, manifest };
  }));
}

export async function getProject({ storePath, projectsRoot, projectId }) {
  const projects = await listProjects({ storePath, projectsRoot });
  return projects.find((project) => project.id === projectId) || null;
}

export async function createProject({ storePath, projectsRoot, name, kind = "workspace", useCaseId, departmentId }) {
  const now = new Date().toISOString();
  const id = sanitizeProjectId(name || kind);
  const store = await readProjectStore(storePath);
  let finalId = id;
  let suffix = 2;
  while (store.projects.some((project) => project.id === finalId)) {
    finalId = `${id.slice(0, 56)}-${suffix++}`;
  }
  const project = {
    id: finalId,
    name: String(name || finalId).trim() || finalId,
    kind,
    useCaseId: useCaseId || null,
    departmentId: departmentId || null,
    createdAt: now,
    updatedAt: now,
  };
  store.projects.unshift(project);
  await writeProjectStore(storePath, store);
  await ensureWorkspaceManifest(projectsRoot, project);
  return { ...project, path: projectDir(projectsRoot, project.id), fileCount: 1 };
}

export async function touchProject({ storePath, projectsRoot, projectId }) {
  const store = await readProjectStore(storePath);
  const project = store.projects.find((item) => item.id === projectId);
  if (!project) return null;
  project.updatedAt = new Date().toISOString();
  await writeProjectStore(storePath, store);
  if (projectsRoot) await ensureWorkspaceManifest(projectsRoot, project);
  return project;
}

export async function removeProject({ storePath, projectsRoot, projectId }) {
  const store = await readProjectStore(storePath);
  // readProjectStore aliases `projects` and `workspaces` to the same array;
  // filter into both keys so writeProjectStore (which reads `workspaces`) persists it.
  const remaining = store.workspaces.filter((p) => p.id !== projectId);
  store.projects = remaining;
  store.workspaces = remaining;
  await writeProjectStore(storePath, store);
  const dir = projectDir(projectsRoot, projectId);
  await rm(dir, { recursive: true, force: true });
}

export async function ensureDefaultProject({ storePath, projectsRoot }) {
  const store = await readProjectStore(storePath);
  if (store.projects.length > 0) {
    const project = store.projects[0];
    await ensureWorkspaceManifest(projectsRoot, project);
    return { ...project, path: projectDir(projectsRoot, project.id) };
  }
  return createProject({ storePath, projectsRoot, name: "Default Workspace", kind: "workspace" });
}

export async function listProjectFiles(projectsRoot, projectId) {
  const root = projectDir(projectsRoot, projectId);
  const out = [];
  await collect(root, "", out);
  out.sort((a, b) => b.mtime - a.mtime);
  return out;
}

export async function readProjectFile(projectsRoot, projectId, relPath) {
  const { rootPath, relPath: safePath, fullPath } = resolveProjectPath(projectsRoot, projectId, relPath);
  const st = await stat(fullPath);
  if (!st.isFile()) throw new Error("not a file");
  const realPath = resolve(await realpath(fullPath));
  if (!realPath.startsWith(`${rootPath}/`) && realPath !== rootPath) {
    throw new Error("invalid file path");
  }
  if (st.size > 512_000) throw new Error("file too large to preview");
  const buffer = await readFile(fullPath);
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096));
  if (sample.includes(0)) throw new Error("binary file preview is not supported");
  return {
    path: safePath,
    size: st.size,
    mtime: st.mtimeMs,
    content: buffer.toString("utf8"),
  };
}

export const sanitizeWorkspaceId = sanitizeProjectId;
export const workspaceDir = projectDir;
export const resolveWorkspacePath = resolveProjectPath;
export const workspaceRunsDir = projectRunsDir;
export const ensureWorkspaceDir = ensureProjectDir;
export const readWorkspaceStore = readProjectStore;
export const listWorkspaces = listProjects;
export const getWorkspace = getProject;
export const createWorkspace = createProject;
export const touchWorkspace = touchProject;
export const removeWorkspace = removeProject;
export const ensureDefaultWorkspace = ensureDefaultProject;
export const listWorkspaceFiles = listProjectFiles;
export const readWorkspaceFile = readProjectFile;

const SKIP_DIRS = new Set([
  "__pycache__", "node_modules", ".venv", "venv", ".git", ".tox",
  ".mypy_cache", ".pytest_cache", ".ruff_cache", "dist", "build",
  "*.egg-info", ".eggs", ".nox",
]);
const SKIP_EXTS = new Set([".pyc", ".pyo", ".so", ".dylib", ".whl", ".egg"]);

function shouldSkipDir(name) {
  if (name.startsWith(".")) return true;
  if (OPERATIONAL_DIRS.has(name)) return true;
  if (SKIP_DIRS.has(name)) return true;
  if (name.endsWith(".egg-info")) return true;
  return false;
}

function shouldSkipFile(name) {
  if (name.startsWith(".")) return true;
  const dot = name.lastIndexOf(".");
  if (dot >= 0 && SKIP_EXTS.has(name.slice(dot))) return true;
  return false;
}

async function collect(dir, relDir, out) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
      await collect(join(dir, entry.name), rel, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (shouldSkipFile(entry.name)) continue;
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    const full = join(dir, entry.name);
    const st = await stat(full);
    out.push({ name: rel, path: rel, size: st.size, mtime: st.mtimeMs });
  }
}
