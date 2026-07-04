// Content identity for admission subjects.
//
// An admission decision is only as strong as the binding between the evidence
// and the artifact it describes. The subject digest is that binding: a single
// sha256 over every file that *ships* — sorted, path-prefixed, byte-exact —
// so "these attestations describe exactly this workspace" is checkable, and
// any change to generated code, tests, fixtures, or the contract invalidates
// every existing attestation by construction.
//
// What is deliberately OUTSIDE the subject:
// - `artifacts/` — evidence *about* the workspace (promotion packet, traces,
//   the passport itself). Evidence is carried as attestation predicates, not
//   subject bytes; including it would make emitting a passport change the
//   digest the passport attests.
// - volatile/derived dirs — the same set `ge handoff` prunes from the upload
//   tar (.venv, node_modules, __pycache__, .pytest_cache, runs, versions,
//   .ge-harness), plus .git.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const DIGEST_ALGORITHM = "sha256";

// Directory names pruned at any depth (mirror of the handoff tar excludes).
export const DEFAULT_IGNORE_DIRS = Object.freeze([
  ".git",
  ".venv",
  "node_modules",
  "__pycache__",
  ".pytest_cache",
  ".ge-harness",
  "runs",
  "versions",
]);

// Workspace-relative path prefixes excluded from the subject (evidence, not
// shipped bytes).
export const DEFAULT_IGNORE_PREFIXES = Object.freeze(["artifacts/"]);

export function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function listSubjectFiles(rootDir, { ignoreDirs, ignorePrefixes }) {
  const ignoreDirSet = new Set(ignoreDirs);
  const files = [];
  const walk = (dir, rel) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relPath = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (ignoreDirSet.has(entry.name)) continue;
        if (ignorePrefixes.some((prefix) => `${relPath}/`.startsWith(prefix))) continue;
        walk(join(dir, entry.name), relPath);
        continue;
      }
      if (!entry.isFile()) continue; // sockets/symlinked oddities never count toward identity
      if (ignorePrefixes.some((prefix) => relPath.startsWith(prefix))) continue;
      files.push(relPath);
    }
  };
  walk(rootDir, "");
  return files.sort();
}

// Digest a whole workspace directory: sha256 over `<relPath>\0<bytes>\0` for
// every subject file in sorted path order. Deterministic across machines —
// no mtimes, no sizes, no locale-dependent ordering.
export function computeWorkspaceDigest(workspaceDir, {
  ignoreDirs = DEFAULT_IGNORE_DIRS,
  ignorePrefixes = DEFAULT_IGNORE_PREFIXES,
} = {}) {
  statSync(workspaceDir); // throw early (ENOENT) instead of digesting nothing
  const files = listSubjectFiles(workspaceDir, { ignoreDirs, ignorePrefixes });
  const hash = createHash("sha256");
  for (const relPath of files) {
    hash.update(relPath);
    hash.update("\0");
    hash.update(readFileSync(join(workspaceDir, relPath)));
    hash.update("\0");
  }
  return { algorithm: DIGEST_ALGORITHM, hex: hash.digest("hex"), fileCount: files.length };
}

// Digest a single file (e.g. the contract, mock_systems/usecase-spec.json).
export function computeFileDigest(path) {
  return { algorithm: DIGEST_ALGORITHM, hex: sha256Hex(readFileSync(path)) };
}
