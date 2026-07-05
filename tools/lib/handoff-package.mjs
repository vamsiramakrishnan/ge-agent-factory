// tools/lib/handoff-package.mjs — local-only, additive companion to `ge
// handoff`'s live release path (tools/lib/provision.mjs's `handoff()`):
// `plan`/`package`/`verify-package` let an operator see exactly what a real
// handoff would submit, and produce a portable artifact of it, WITHOUT any
// cloud call (no GCS upload, no gateway POST, no ledger write).
//
// - planHandoff:  same workspace enumeration + admission evaluation
//   `handoff()` does, minus recording the decision and minus the upload/
//   submit — a dry run that reports digests and the admission verdict.
// - packageHandoff: builds the exact same tar `handoff()` uploads (same tar
//   CLI invocation, same exclude list — see HANDOFF_TAR_EXCLUDES below) to a
//   local path instead of GCS, alongside a manifest of content digests.
// - verifyHandoffPackage: the manifest's other half — re-extract, re-digest,
//   compare, so a package can be checked for tamper/corruption before it is
//   ever handed to a deploy target.
//
// Layering: this module is intentionally standalone (no createXOps
// composition, no factory-core.mjs import back) so it can be unit-tested
// without the live gcloud/gateway/ledger dependencies provision.mjs needs —
// it shells out to `tar` directly instead of going through factory-core's
// injected `run()`.
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { parseList } from "@ge/std/list";
import { readJson, writeJson } from "@ge/std/json-io";
import { computeFileDigest, computeWorkspaceDigest } from "@ge/admission";
import { WORKSPACE_PATHS, workspacePath } from "@ge/agent-workspace";
import { DxError } from "./errors/dx-error.mjs";
import { LOCAL_PROJECTS, resolveLocalWorkspaceId } from "./local-workspaces.mjs";
import { checkAdmission as evaluateAdmissionDecision, shouldAdmit } from "./admission/admission-ops.mjs";

export const HANDOFF_PACKAGE_SCHEMA_VERSION = "ge.handoff-package.v1";

// The exact exclude list `handoff()`'s tar invocation uses today
// (tools/lib/provision.mjs, ~line 542). Kept here as the shared constant so
// `packageHandoff` builds byte-identical archives to the live path; NOTE —
// provision.mjs still carries its own inline copy of this list rather than
// importing it from here (that refactor is integration's call: this module
// is additive/local-only and does not touch provision.mjs's handoff() body),
// so the two lists must be kept in sync by hand until that reconciliation
// happens.
export const HANDOFF_TAR_EXCLUDES = Object.freeze([
  ".venv",
  "node_modules",
  "__pycache__",
  ".pytest_cache",
  "runs",
  "versions",
  ".ge-harness",
]);

function tarExcludeArgs() {
  return HANDOFF_TAR_EXCLUDES.map((dir) => `--exclude=${dir}`);
}

function runTar(args) {
  const result = spawnSync("tar", args, { encoding: "utf8" });
  const ok = !result.error && result.status === 0;
  return { ok, err: result.error?.message || (result.stderr || "").trim() };
}

// Same enumeration `handoff()` uses (tools/lib/provision.mjs:491-505):
// every dir under the workspace root, optionally filtered to requested ids.
// `resolveLocalWorkspaceId` (fuzzy id → on-disk workspace dir) only makes
// sense against the real local-workspace registry, so it's only consulted
// when `workspacesRoot` is the default LOCAL_PROJECTS — a caller pointing
// this at a fixture root (tests) gets literal directory-name matching.
function resolveWorkspaceDirs(ids, workspacesRoot) {
  if (!existsSync(workspacesRoot)) {
    throw new DxError(`no local workspaces at ${workspacesRoot} — run \`ge prove\` first.`, {
      where: `workspaces: ${workspacesRoot}`,
      why: "a handoff plan/package describes locally-built workspaces, and nothing has been built here yet",
      fix: "ge prove",
    });
  }
  let dirs = readdirSync(workspacesRoot).filter((d) => {
    try { return statSync(join(workspacesRoot, d)).isDirectory(); } catch { return false; } // best-effort: a directory listing can race a concurrent delete; skip it, don't crash the plan
  });
  if (ids) {
    const requested = parseList(String(ids));
    const resolveId = workspacesRoot === LOCAL_PROJECTS
      ? (id) => { try { return resolveLocalWorkspaceId(id); } catch { return id; } } // best-effort: an unresolvable id falls through to literal matching below, which reports it as unmatched
      : (id) => id;
    const resolved = new Set(requested.map(resolveId));
    dirs = dirs.filter((d) => resolved.has(d));
  }
  if (!dirs.length) {
    throw new DxError("no matching local workspaces to plan/package.", {
      where: `workspaces: ${workspacesRoot}`,
      why: "the ids requested do not match any locally-built workspace",
      fix: "ge agents resume",
    });
  }
  return dirs;
}

function subjectDigests(wsDir) {
  const contractPath = workspacePath(wsDir, WORKSPACE_PATHS.useCaseSpec);
  return {
    digest: computeWorkspaceDigest(wsDir),
    contractDigest: existsSync(contractPath) ? computeFileDigest(contractPath) : null,
  };
}

// ── plan ─────────────────────────────────────────────────────────────────────
// Reports exactly what a real `ge handoff` would submit for each requested
// workspace: its content digests and the admission verdict it would get —
// evaluated via the same policy `handoff()` consults, but with
// `record: false` so planning never writes a decision record or appends to
// the audit log (that only happens on a real admit).
export function planHandoff({
  ids,
  target = "agents-cli",
  startStage = "load_data",
  targetStage = "publish_enterprise",
  force = false,
  workspacesRoot = LOCAL_PROJECTS,
  checkAdmission = evaluateAdmissionDecision,
} = {}) {
  const dirs = resolveWorkspaceDirs(ids, workspacesRoot);
  const workspaces = dirs.map((id) => {
    const wsDir = join(workspacesRoot, id);
    // A plan must survive a broken workspace (partial build, missing contract,
    // dangling symlink): report it as an unplannable entry instead of letting
    // one bad dir abort the whole dry run — the real handoff would refuse it
    // at admission anyway.
    try {
      const { digest, contractDigest } = subjectDigests(wsDir);
      const decision = checkAdmission({ id, stage: "handoff", force, record: false });
      const allowed = shouldAdmit(decision, { force });
      return {
        id,
        path: wsDir,
        digest,
        contractDigest,
        admission: { allowed, blockers: decision.blockers || [] },
      };
    } catch (error) {
      return {
        id,
        path: wsDir,
        error: error.message || String(error),
        admission: { allowed: false, blockers: [`unplannable: ${error.message || error}`] },
      };
    }
  });
  return {
    kind: "ge.handoff.plan",
    target,
    startStage,
    targetStage,
    workspaces,
    notes: [
      "dry run — no upload, no gateway call, no ledger write, no admission decision recorded",
      `tar excludes: ${HANDOFF_TAR_EXCLUDES.join(", ")}`,
    ],
  };
}

// ── package ──────────────────────────────────────────────────────────────────
// Builds the same tar `handoff()` uploads to GCS, but to a local path, plus a
// manifest of content digests a caller can hand to `verifyHandoffPackage`
// later (after moving the file, over email, off a USB stick — anywhere the
// bytes might have changed in transit).
export function packageHandoff({ ids, out, target = "agents-cli", workspacesRoot = LOCAL_PROJECTS } = {}) {
  const dirs = resolveWorkspaceDirs(ids, workspacesRoot);
  const single = dirs.length === 1;
  const outPath = resolve(out || (single ? "./handoff-package.tar.gz" : "./handoff-package"));
  const packageDir = single ? dirname(outPath) : outPath;
  mkdirSync(packageDir, { recursive: true });

  const workspaces = dirs.map((id) => {
    const wsDir = join(workspacesRoot, id);
    const archiveName = single ? basename(outPath) : `${id}.tar.gz`;
    const archivePath = join(packageDir, archiveName);
    const tar = runTar(["-czf", archivePath, ...tarExcludeArgs(), "-C", wsDir, "."]);
    if (!tar.ok) {
      throw new DxError(`tar failed for workspace '${id}': ${tar.err || "?"}`, {
        where: `workspace: ${wsDir}`,
        why: "packageHandoff builds the same archive `ge handoff` uploads, and the tar invocation failed",
        fix: "check that the `tar` binary is on PATH and the workspace directory is readable",
      });
    }
    const { digest, contractDigest } = subjectDigests(wsDir);
    return { id, archive: archiveName, digest, contractDigest, files: digest.fileCount };
  });

  const manifest = {
    schemaVersion: HANDOFF_PACKAGE_SCHEMA_VERSION,
    createdFor: target,
    createdAt: new Date().toISOString(),
    workspaces,
  };
  const manifestPath = join(packageDir, "manifest.json");
  writeJson(manifestPath, manifest);

  return { out: single ? outPath : packageDir, manifestPath, workspaces, manifest };
}

// ── verify-package ───────────────────────────────────────────────────────────
// The manifest's other half: extract every archive it lists into a scratch
// dir, recompute the workspace digest, and compare against what the manifest
// recorded at package time. `archive` may be either the tar.gz file produced
// for a single workspace or the directory produced for multiple — the
// manifest always lives alongside the archive(s), and every entry names its
// own archive file, so both shapes resolve the same way.
export function verifyHandoffPackage({ archive } = {}) {
  if (!archive) {
    throw new DxError("no handoff package given.", {
      where: "verifyHandoffPackage",
      why: "there is nothing to verify without a path to the packaged archive or directory",
      fix: "ge handoff verify-package <path>",
    });
  }
  const archivePath = resolve(archive);
  if (!existsSync(archivePath)) {
    throw new DxError(`handoff package not found: ${archivePath}`, {
      where: `path: ${archivePath}`,
      why: "verify-package reads a package produced by `ge handoff package`",
      fix: "ge handoff package --out <path>",
    });
  }
  const packageDir = statSync(archivePath).isDirectory() ? archivePath : dirname(archivePath);
  const manifestPath = join(packageDir, "manifest.json");
  const manifest = readJson(manifestPath, null);
  if (!manifest || manifest.schemaVersion !== HANDOFF_PACKAGE_SCHEMA_VERSION || !Array.isArray(manifest.workspaces)) {
    throw new DxError(`handoff package manifest missing or malformed: ${manifestPath}`, {
      where: `manifest: ${manifestPath}`,
      why: "verify-package compares against the manifest.json a real `ge handoff package` writes alongside the archive(s); it is either missing or not that shape",
      fix: "ge handoff package --out <path>",
    });
  }

  const scratch = mkdtempSync(join(tmpdir(), "ge-handoff-verify-"));
  try {
    const workspaces = manifest.workspaces.map((entry) => {
      const archiveFile = join(packageDir, entry.archive);
      const extractDir = join(scratch, entry.id);
      mkdirSync(extractDir, { recursive: true });
      const tar = runTar(["-xzf", archiveFile, "-C", extractDir]);
      if (!tar.ok) {
        throw new DxError(`failed to extract '${entry.archive}' for workspace '${entry.id}': ${tar.err || "?"}`, {
          where: `archive: ${archiveFile}`,
          why: "verify-package extracts every archive the manifest lists before re-digesting it",
          fix: "confirm the archive file exists and is a valid tar.gz",
        });
      }
      const actual = computeWorkspaceDigest(extractDir);
      const expected = entry.digest;
      return { id: entry.id, expected, actual, ok: Boolean(expected) && expected.hex === actual.hex };
    });
    return { ok: workspaces.every((w) => w.ok), workspaces };
  } finally {
    rmSync(scratch, { recursive: true, force: true }); // scratch is a private mkdtemp dir under the OS tmp root — removal failure here would only leak temp disk, never affect the verify result
  }
}
