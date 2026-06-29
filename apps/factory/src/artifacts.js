/**
 * Artifact metadata tracking.
 *
 * Records which run/agent/brief produced each generated file via sidecar
 * .artifact.json files. Enables provenance queries: "who generated this?"
 */
import { readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { existsSync } from "node:fs";
import { glob } from "tinyglobby";

function artifactMetaPath(filePath) {
  const dir = dirname(filePath);
  const name = basename(filePath);
  return join(dir, `.${name}.artifact.json`);
}

export async function recordArtifact(filePath, metadata) {
  const metaPath = artifactMetaPath(filePath);
  const existing = await readArtifactMeta(filePath);
  const record = {
    path: basename(filePath),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runId: metadata.runId || existing?.runId || null,
    agentId: metadata.agentId || existing?.agentId || null,
    projectId: metadata.projectId || existing?.projectId || null,
    briefHash: metadata.briefHash || existing?.briefHash || null,
    version: (existing?.version || 0) + 1,
    generator: metadata.generator || "agent",
    history: [
      ...(existing?.history || []),
      {
        updatedAt: new Date().toISOString(),
        runId: metadata.runId || null,
        agentId: metadata.agentId || null,
        version: (existing?.version || 0) + 1,
      },
    ].slice(-20),
  };
  await writeFile(metaPath, JSON.stringify(record, null, 2), "utf8");
  return record;
}

export async function readArtifactMeta(filePath) {
  const metaPath = artifactMetaPath(filePath);
  try {
    return JSON.parse(await readFile(metaPath, "utf8"));
  } catch {
    return null;
  }
}

export async function listArtifacts(projectDir) {
  // dot:false (default) drops dotfiles/dot-dirs, matching the prior startsWith(".") skip.
  const rels = await glob("**/*", {
    cwd: projectDir, onlyFiles: true,
    ignore: ["**/__pycache__/**", "**/node_modules/**", "**/venv/**"],
  });
  const out = [];
  for (const rel of rels) {
    const full = join(projectDir, rel);
    const meta = await readArtifactMeta(full);
    const st = await stat(full);
    out.push({ path: rel, size: st.size, mtime: st.mtimeMs, artifact: meta || null });
  }
  return out;
}

export async function recordRunArtifacts(projectDir, runId, agentId, projectId) {
  const files = await listArtifacts(projectDir);
  const recorded = [];
  for (const file of files) {
    if (file.path.startsWith("runs/")) continue;
    if (file.path.startsWith("chat/")) continue;
    if (file.path.startsWith("mock_systems/")) continue;
    if (file.path === "workspace.json") continue;

    const existing = file.artifact;
    if (existing && existing.runId === runId) continue;

    const full = join(projectDir, file.path);
    const isNew = !existing;
    const wasModified = existing && file.mtime > Date.parse(existing.updatedAt || 0);

    if (isNew || wasModified) {
      await recordArtifact(full, { runId, agentId, projectId });
      recorded.push(file.path);
    }
  }
  return recorded;
}
