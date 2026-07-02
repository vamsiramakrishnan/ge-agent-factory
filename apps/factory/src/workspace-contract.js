import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  ARTIFACT_PATHS,
  DATA_PATHS,
  PROMOTION_POLICY,
  PROMOTION_SHARE_FILES,
  REQUIRED_WORKSPACE_COMMANDS,
  REQUIRED_WORKSPACE_FILES,
  WORKSPACE_PATHS,
  WORKSPACE_SCHEMA_VERSION,
  WORKSPACE_STAGES,
  requiredGeneratedWorkspaceFiles,
  workspacePath as resolveWorkspacePath,
  workspacePaths as resolveWorkspacePaths,
} from "@ge/agent-workspace";

export {
  ARTIFACT_PATHS,
  DATA_PATHS,
  PROMOTION_POLICY,
  PROMOTION_SHARE_FILES,
  REQUIRED_WORKSPACE_COMMANDS,
  REQUIRED_WORKSPACE_FILES,
  WORKSPACE_PATHS,
  WORKSPACE_SCHEMA_VERSION,
  WORKSPACE_STAGES,
};

export function workspacePath(workspaceDir, relPath) {
  return resolveWorkspacePath(workspaceDir, relPath);
}

export function workspacePaths(workspaceDir, paths) {
  return resolveWorkspacePaths(workspaceDir, paths);
}

export function workspaceFileExists(workspaceDir, relPath) {
  return existsSync(workspacePath(workspaceDir, relPath));
}

export async function readWorkspaceJson(workspaceDir, relPath, fallback = null) {
  try {
    return JSON.parse(await readFile(workspacePath(workspaceDir, relPath), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function readWorkspaceText(workspaceDir, relPath, fallback = "") {
  try {
    return await readFile(workspacePath(workspaceDir, relPath), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeWorkspaceJson(workspaceDir, relPath, value) {
  const path = workspacePath(workspaceDir, relPath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return path;
}

export async function writeWorkspaceText(workspaceDir, relPath, value) {
  const path = workspacePath(workspaceDir, relPath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
  return path;
}

function check(id, ok, name, detail, fix = null, level = "fail") {
  return {
    id,
    name,
    status: ok ? "pass" : level,
    detail,
    fix,
  };
}

function readWorkspaceManifestSync(workspaceDir) {
  try {
    return JSON.parse(readFileSync(workspacePath(workspaceDir, WORKSPACE_PATHS.workspaceManifest), "utf8"));
  } catch {
    return null;
  }
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateWorkspaceManifest(manifest, { workspaceDir = null, strictFiles = true } = {}) {
  const checks = [];
  checks.push(check(
    "manifest:schema_version",
    manifest?.schemaVersion === WORKSPACE_SCHEMA_VERSION,
    "schema version",
    manifest?.schemaVersion === WORKSPACE_SCHEMA_VERSION
      ? `v${WORKSPACE_SCHEMA_VERSION}`
      : `expected v${WORKSPACE_SCHEMA_VERSION}, found ${manifest?.schemaVersion ?? "missing"}`,
    "regenerate or refresh workspace.json with ge devex smoke --force",
  ));
  checks.push(check(
    "manifest:purpose",
    hasText(manifest?.purpose),
    "purpose",
    hasText(manifest?.purpose) ? manifest.purpose : "missing",
    "add a crisp purpose to workspace.json",
  ));
  checks.push(check(
    "manifest:agent",
    hasText(manifest?.agent?.runtime) && hasText(manifest?.agent?.entrypoint),
    "agent runtime",
    hasText(manifest?.agent?.runtime) && hasText(manifest?.agent?.entrypoint)
      ? `${manifest.agent.runtime} · ${manifest.agent.entrypoint}`
      : "agent.runtime or agent.entrypoint missing",
    "write agent.runtime and agent.entrypoint in workspace.json",
  ));
  const commands = manifest?.commands || {};
  const missingCommands = REQUIRED_WORKSPACE_COMMANDS.filter((name) => !hasText(commands[name]));
  checks.push(check(
    "manifest:commands",
    missingCommands.length === 0,
    "commands",
    missingCommands.length ? `missing ${missingCommands.join(", ")}` : REQUIRED_WORKSPACE_COMMANDS.join(", "),
    "refresh workspace.json command contract",
  ));
  checks.push(check(
    "manifest:registration",
    typeof manifest?.registration?.agentRegistryReady === "boolean" && typeof manifest?.registration?.geminiEnterpriseReady === "boolean",
    "registration flags",
    typeof manifest?.registration?.agentRegistryReady === "boolean" && typeof manifest?.registration?.geminiEnterpriseReady === "boolean"
      ? `agentRegistryReady=${manifest.registration.agentRegistryReady}, geminiEnterpriseReady=${manifest.registration.geminiEnterpriseReady}`
      : "agentRegistryReady/geminiEnterpriseReady booleans missing",
    "write explicit registration readiness flags",
  ));
  const generatedFiles = Array.isArray(manifest?.generatedFiles) ? manifest.generatedFiles : [];
  checks.push(check(
    "manifest:generated_files",
    generatedFiles.some((item) => item?.path === WORKSPACE_PATHS.workspaceManifest),
    "generated file inventory",
    generatedFiles.length ? `${generatedFiles.length} file entries` : "missing generatedFiles[]",
    "refresh workspace.json generatedFiles inventory",
  ));
  checks.push(check(
    "manifest:source",
    hasText(manifest?.source?.useCaseId) || hasText(manifest?.useCaseId),
    "source use case",
    manifest?.source?.useCaseId || manifest?.useCaseId || "missing",
    "associate generated workspaces with source.useCaseId",
    "warn",
  ));
  checks.push(check(
    "manifest:quality",
    Boolean(manifest?.quality && typeof manifest.quality === "object"),
    "quality summary",
    manifest?.quality ? Object.entries(manifest.quality).map(([key, value]) => `${key}=${value}`).join(", ") : "missing",
    "refresh workspace readiness before publishing",
    "warn",
  ));

  const requiredFiles = requiredGeneratedWorkspaceFiles(manifest).map((relPath) => ({
    path: relPath,
    exists: workspaceDir ? workspaceFileExists(workspaceDir, relPath) : false,
  }));
  if (workspaceDir) {
    const missingFiles = requiredFiles.filter((item) => !item.exists).map((item) => item.path);
    checks.push(check(
      "workspace:required_files",
      missingFiles.length === 0,
      "required files",
      missingFiles.length ? `missing ${missingFiles.join(", ")}` : `${requiredFiles.length} required files present`,
      "regenerate or repair the workspace",
      strictFiles ? "fail" : "warn",
    ));
  }
  const fails = checks.filter((item) => item.status === "fail").length;
  const warnings = checks.filter((item) => item.status === "warn").length;
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    ok: fails === 0,
    fails,
    warnings,
    checks,
    requiredFiles,
  };
}

export function buildWorkspaceContractReport(workspaceDir, options = {}) {
  const manifest = options.manifest || readWorkspaceManifestSync(workspaceDir);
  const manifestReport = validateWorkspaceManifest(manifest, {
    workspaceDir,
    strictFiles: options.strictFiles !== false,
  });
  const required = REQUIRED_WORKSPACE_FILES.map((relPath) => ({
    path: relPath,
    exists: workspaceFileExists(workspaceDir, relPath),
  }));
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    required,
    manifest: manifestReport,
    checks: manifestReport.checks,
    ok: required.every((item) => item.exists) && manifestReport.ok,
  };
}
