import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readJsonAsync } from "@ge/std/json-io";

const SAFE_ID = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

function readJson(path, fallback) {
  return readJsonAsync(path, fallback, { rethrowUnexpected: true });
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2), "utf8");
}

function projectPath(projectsRoot, projectId) {
  if (!SAFE_ID.test(projectId)) throw new Error("invalid project id");
  return join(projectsRoot, projectId);
}

function versionsDir(projectsRoot, projectId) {
  return join(projectPath(projectsRoot, projectId), "versions");
}

function briefFilePath(projectsRoot, projectId) {
  return join(projectPath(projectsRoot, projectId), "brief.json");
}

function manifestPath(projectsRoot, projectId) {
  return join(projectPath(projectsRoot, projectId), "workspace.json");
}

export async function saveBrief(projectsRoot, projectId, briefData) {
  const brief = {
    departmentId: briefData.departmentId || null,
    useCaseId: briefData.useCaseId || null,
    department: briefData.department || null,
    useCase: briefData.useCase || null,
    interviewAnswers: briefData.interviewAnswers || {},
    generatedText: briefData.generatedText || "",
    createdAt: new Date().toISOString(),
  };
  await writeJson(briefFilePath(projectsRoot, projectId), brief);
  return brief;
}

export async function readBrief(projectsRoot, projectId) {
  return readJson(briefFilePath(projectsRoot, projectId), null);
}

export async function createVersion(projectsRoot, projectId, { brief, fileSnapshot }) {
  const dir = versionsDir(projectsRoot, projectId);
  await mkdir(dir, { recursive: true });

  const manifest = await readJson(manifestPath(projectsRoot, projectId), {});
  const currentCount = manifest.versions?.count || 0;
  const nextVersion = currentCount + 1;
  const versionDir = join(dir, `v${nextVersion}`);
  await mkdir(versionDir, { recursive: true });

  const versionManifest = {
    version: nextVersion,
    createdAt: new Date().toISOString(),
    fileCount: Array.isArray(fileSnapshot) ? fileSnapshot.length : 0,
    fileSnapshot: fileSnapshot || [],
  };

  await writeJson(join(versionDir, "manifest.json"), versionManifest);
  if (brief) {
    await writeJson(join(versionDir, "brief.json"), brief);
  }

  manifest.currentVersion = nextVersion;
  if (!manifest.versions) manifest.versions = { path: "versions", count: 0 };
  manifest.versions.count = nextVersion;
  await writeJson(manifestPath(projectsRoot, projectId), manifest);

  return versionManifest;
}

export async function listVersions(projectsRoot, projectId) {
  const dir = versionsDir(projectsRoot, projectId);
  const manifest = await readJson(manifestPath(projectsRoot, projectId), {});
  const count = manifest.versions?.count || 0;
  const versions = [];

  for (let i = 1; i <= count; i++) {
    const vm = await readJson(join(dir, `v${i}`, "manifest.json"), null);
    if (vm) versions.push(vm);
  }

  return { versions, currentVersion: manifest.currentVersion || null };
}

export async function getVersion(projectsRoot, projectId, versionNumber) {
  const dir = versionsDir(projectsRoot, projectId);
  const vm = await readJson(join(dir, `v${versionNumber}`, "manifest.json"), null);
  const brief = await readJson(join(dir, `v${versionNumber}`, "brief.json"), null);
  if (!vm) return null;
  return { ...vm, brief };
}

export async function promoteVersion(projectsRoot, projectId, versionNumber) {
  const manifest = await readJson(manifestPath(projectsRoot, projectId), {});
  const maxVersion = manifest.versions?.count || 0;
  if (versionNumber < 1 || versionNumber > maxVersion) {
    throw new Error(`version ${versionNumber} does not exist`);
  }
  manifest.currentVersion = versionNumber;
  await writeJson(manifestPath(projectsRoot, projectId), manifest);
  return { currentVersion: versionNumber };
}
