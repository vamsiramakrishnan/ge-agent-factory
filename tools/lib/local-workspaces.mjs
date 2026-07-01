// Local-mode workspace store — read/resolve helpers over the on-disk workspace
// registry (.ge/factory/workspaces + workspaces.json) used by BOTH sides of the
// local-build seam: factory-core's own fleetStatus/workspaceDoctor/workspaceRepair
// stay in factory-core.mjs, while provision.mjs (provisionLocal/ship/syncLocal/
// devexCheck) and doctor.mjs (localPreflight's "workspace registry" check) also
// need these lookups. Pulling them out here — rather than having one of those
// files import the other — breaks what would otherwise be a factory-core <->
// provision.mjs (or doctor.mjs <-> provision.mjs) import cycle.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "@ge/std/json-io";
import { buildWorkspaceContractReport } from "./factory-local-ops.mjs";
import { STATE_PATHS, displayStatePath } from "./state-paths.mjs";

export const LOCAL_PROJECTS = STATE_PATHS.factory.workspaces;
export const LOCAL_PROJECT_STORE = STATE_PATHS.factory.workspacesJson;
const STATE_PATH = STATE_PATHS.envState;

export function workspaceStoreItems(store) {
  return Array.isArray(store?.workspaces) ? store.workspaces : [];
}

export function localWorkspaceIndexByUseCase() {
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  const projects = workspaceStoreItems(store);
  const byUseCase = new Map();
  for (const project of projects) {
    if (!project?.id || !project?.useCaseId) continue;
    if (!existsSync(join(LOCAL_PROJECTS, project.id))) continue;
    const current = byUseCase.get(project.useCaseId);
    if (!current || String(project.updatedAt || project.createdAt || "") > String(current.updatedAt || current.createdAt || "")) {
      byUseCase.set(project.useCaseId, {
        ...project,
        updatedAt: project.updatedAt || project.createdAt || null,
      });
    }
  }
  return byUseCase;
}

export function localWorkspaceExists(id) {
  if (!id) return false;
  if (!existsSync(join(LOCAL_PROJECTS, id))) return false;
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  return workspaceStoreItems(store).some((project) => project.id === id);
}

export function resolveLocalWorkspaceId(id) {
  if (!id) throw new Error("workspace id required");
  if (localWorkspaceExists(id)) return id;
  const local = localWorkspaceIndexByUseCase().get(id);
  if (local?.id && existsSync(join(LOCAL_PROJECTS, local.id))) return local.id;
  const state = readJson(STATE_PATH, { completed: {} });
  const mapped = state.completed?.[id]?.workspaceId;
  if (mapped && existsSync(join(LOCAL_PROJECTS, mapped))) return mapped;
  const wsId = id.startsWith("ws-") ? id : `ws-${id}`;
  if (existsSync(join(LOCAL_PROJECTS, wsId))) return wsId;
  return mapped || id;
}

export function summarizeLocalWorkspace(workspaceId, { requestedId = null } = {}) {
  const workspacePath = join(LOCAL_PROJECTS, workspaceId);
  const manifestPath = join(workspacePath, "workspace.json");
  const manifest = readJson(manifestPath, null);
  const contract = manifest && existsSync(workspacePath)
    ? buildWorkspaceContractReport(workspacePath, { manifest, strictFiles: true })
    : null;
  return {
    id: workspaceId,
    requestedId,
    useCaseId: manifest?.useCaseId || manifest?.source?.useCaseId || requestedId || workspaceId,
    departmentId: manifest?.departmentId || manifest?.source?.departmentId || null,
    path: displayStatePath(workspacePath),
    manifest: existsSync(manifestPath) ? displayStatePath(manifestPath) : null,
    nextAction: manifest?.nextAction || null,
    nextActions: manifest?.nextActions || [],
    commands: manifest?.commands || {},
    readiness: manifest?.readiness || {},
    quality: manifest?.quality || {},
    registration: manifest?.registration || {},
    contract: contract ? {
      ok: contract.ok,
      fails: contract.manifest?.fails || 0,
      warnings: contract.manifest?.warnings || 0,
      checks: contract.checks || [],
    } : null,
    evalConfig: existsSync(join(workspacePath, "tests/eval/eval_config.json")) ? "tests/eval/eval_config.json" : null,
    smokeTest: existsSync(join(workspacePath, "tests/test_smoke.py")) ? "tests/test_smoke.py" : null,
  };
}

export function summarizeLocalRunWorkspaces(run) {
  return (run?.results || [])
    .filter((item) => item.workspaceId && existsSync(join(LOCAL_PROJECTS, item.workspaceId)))
    .map((item) => ({
      ...summarizeLocalWorkspace(item.workspaceId, { requestedId: item.useCaseId }),
      status: item.status || null,
      error: item.error || null,
    }));
}

// Mirrors factory-core's parseIdList (accepts a CSV string or an array, always
// returns a trimmed, empty-free list) — kept local so this module has no
// dependency back on factory-core.mjs.
function parseIdList(ids) {
  return String(Array.isArray(ids) ? ids.join(",") : ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function localWorkspaceContractReports({ ids = "", allWorkspaces = false, strictFiles = true } = {}) {
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  const items = workspaceStoreItems(store);
  const requested = parseIdList(ids);
  const selected = [];
  const byId = new Map(items.map((item) => [item.id, item]));

  if (requested.length) {
    for (const id of requested) {
      const workspaceId = resolveLocalWorkspaceId(id);
      selected.push(byId.get(workspaceId) || { id: workspaceId, useCaseId: id === workspaceId ? null : id });
    }
  } else {
    for (const item of items) {
      if (allWorkspaces || item.useCaseId) selected.push(item);
    }
  }

  const seen = new Set();
  return selected
    .filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => {
      const workspacePath = join(LOCAL_PROJECTS, item.id);
      const manifestPath = join(workspacePath, "workspace.json");
      const manifest = readJson(manifestPath, null);
      if (!existsSync(workspacePath) || !manifest) {
        return {
          id: item.id,
          useCaseId: item.useCaseId || null,
          path: displayStatePath(workspacePath),
          manifest: existsSync(manifestPath) ? displayStatePath(manifestPath) : null,
          ok: false,
          fails: 1,
          warnings: 0,
          checks: [{
            id: "workspace:manifest_missing",
            name: "workspace manifest",
            status: "fail",
            detail: existsSync(workspacePath) ? "workspace.json missing" : "workspace directory missing",
            fix: item.useCaseId ? `ge agents build --ids ${item.useCaseId} --local --force` : "regenerate or remove the stale workspace registry entry",
          }],
        };
      }
      const contract = buildWorkspaceContractReport(workspacePath, { manifest, strictFiles });
      return {
        id: item.id,
        useCaseId: item.useCaseId || manifest.source?.useCaseId || manifest.useCaseId || null,
        path: displayStatePath(workspacePath),
        manifest: displayStatePath(manifestPath),
        ok: contract.ok,
        fails: contract.manifest?.fails || 0,
        warnings: contract.manifest?.warnings || 0,
        checks: contract.checks || [],
        missing: (contract.manifest?.requiredFiles || []).filter((file) => !file.exists).map((file) => file.path),
      };
    });
}
