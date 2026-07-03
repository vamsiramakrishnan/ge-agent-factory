import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, isAbsolute, join } from "node:path";

function artifactPath(path, { repoRoot = process.cwd() } = {}) {
  if (!path) return null;
  return isAbsolute(path) ? path : join(repoRoot, path);
}

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function csvRows(path) {
  const text = readFileSync(path, "utf8").trim();
  if (!text) return 0;
  return Math.max(0, text.split(/\r?\n/).length - 1);
}

function dirSummary(path) {
  const entries = readdirSync(path, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const csvFiles = files.filter((name) => extname(name).toLowerCase() === ".csv");
  const rowCount = csvFiles.reduce((sum, name) => {
    try {
      return sum + csvRows(join(path, name));
    } catch {
      return sum;
    }
  }, 0);
  return { entries: entries.length, files: files.length, fileNames: files, csvFiles: csvFiles.length, csvFileNames: csvFiles, rowCount };
}

export function parseStdoutJson(stdout = "") {
  const text = String(stdout || "").trim();
  if (!text) throw new Error("stdout is empty");
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(text.slice(first, last + 1));
    throw new Error("stdout does not contain JSON");
  }
}

export function inspectPipelineArtifact(artifact = {}, { repoRoot = process.cwd(), childTask = null } = {}) {
  const record = { ...artifact, status: "missing", metadata: {} };
  if (artifact.type === "stdout-json") {
    try {
      const parsed = parseStdoutJson(childTask?.output?.stdoutFull || childTask?.output?.stdout || "");
      return { ...record, status: "present", metadata: { jsonType: Array.isArray(parsed) ? "array" : typeof parsed } };
    } catch (error) {
      return { ...record, status: "invalid", error: error.message || String(error) };
    }
  }

  const resolvedPath = artifactPath(artifact.path, { repoRoot });
  if (!resolvedPath || !existsSync(resolvedPath)) {
    return { ...record, resolvedPath };
  }

  try {
    const stat = statSync(resolvedPath);
    const metadata = {
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      kind: stat.isDirectory() ? "dir" : stat.isFile() ? "file" : "other",
    };

    if (artifact.type === "dir") {
      if (!stat.isDirectory()) return { ...record, resolvedPath, status: "invalid", metadata, error: "expected directory" };
      const summary = dirSummary(resolvedPath);
      return {
        ...record,
        resolvedPath,
        status: summary.entries > 0 ? "present" : "invalid",
        metadata: { ...metadata, ...summary },
        error: summary.entries > 0 ? undefined : "directory is empty",
      };
    }

    if (!stat.isFile()) return { ...record, resolvedPath, status: "invalid", metadata, error: "expected file" };
    const withFileMetadata = { ...metadata, sha256: fileHash(resolvedPath) };
    if (artifact.type === "json") {
      try {
        JSON.parse(readFileSync(resolvedPath, "utf8"));
      } catch (error) {
        return { ...record, resolvedPath, status: "invalid", metadata: withFileMetadata, error: error.message || String(error) };
      }
    }
    return { ...record, resolvedPath, status: "present", metadata: withFileMetadata };
  } catch (error) {
    return { ...record, resolvedPath, status: "invalid", error: error.message || String(error) };
  }
}

export function verifyPipelineArtifacts(artifacts = [], options = {}) {
  const inspected = artifacts.map((artifact) => inspectPipelineArtifact(artifact, options));
  const blockers = inspected
    .filter((artifact) => artifact.status !== "present")
    .map((artifact) => ({
      id: `artifact-${artifact.status}`,
      artifact: artifact.name || artifact.path || artifact.ref || "artifact",
      message: `${artifact.name || artifact.path || artifact.ref || "artifact"} is ${artifact.status}${artifact.error ? `: ${artifact.error}` : ""}`,
      artifactRef: artifact,
    }));
  return {
    ok: blockers.length === 0,
    artifacts: inspected,
    blockers,
    counts: {
      total: inspected.length,
      present: inspected.filter((artifact) => artifact.status === "present").length,
      missing: inspected.filter((artifact) => artifact.status === "missing").length,
      invalid: inspected.filter((artifact) => artifact.status === "invalid").length,
    },
  };
}
