// tools/lib/handoff-package.test.mjs — planHandoff/packageHandoff/
// verifyHandoffPackage over a throwaway fixture workspace root (no real
// `.ge/factory/workspaces`, no cloud calls, no live admission keys). The
// admission dependency is injected (planHandoff's `checkAdmission` param —
// see admission-ops.test.mjs for the same "fixture what can be faked, run
// the rest for real" split).
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { computeWorkspaceDigest } from "@ge/admission";
import { isDxError } from "./errors/dx-error.mjs";
import {
  HANDOFF_TAR_EXCLUDES,
  packageHandoff,
  planHandoff,
  verifyHandoffPackage,
} from "./handoff-package.mjs";

function makeWorkspace(root, id, { contract = { behaviorContract: { role: id } } } = {}) {
  const dir = join(root, id);
  mkdirSync(join(dir, "mock_systems"), { recursive: true });
  mkdirSync(join(dir, "app"), { recursive: true });
  mkdirSync(join(dir, "node_modules", "junk"), { recursive: true }); // excluded — must not survive into the tar/digest
  writeFileSync(join(dir, "mock_systems", "usecase-spec.json"), JSON.stringify(contract));
  writeFileSync(join(dir, "app", "agent.py"), `print("${id}")\n`);
  writeFileSync(join(dir, "node_modules", "junk", "left-out.txt"), "should not ship");
  return dir;
}

describe("packageHandoff → verifyHandoffPackage (single workspace)", () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "ge-handoff-pkg-single-"));
  const wsDir = makeWorkspace(fixtureRoot, "ws-alpha");
  const outDir = mkdtempSync(join(tmpdir(), "ge-handoff-pkg-out-"));
  const outPath = join(outDir, "handoff-package.tar.gz");

  test("packages the excluded-dir-free workspace and round-trips through verify", () => {
    const packaged = packageHandoff({ ids: "ws-alpha", out: outPath, workspacesRoot: fixtureRoot });
    expect(packaged.out).toBe(outPath);
    expect(packaged.workspaces).toHaveLength(1);
    expect(packaged.manifest.schemaVersion).toBe("ge.handoff-package.v1");

    const expectedDigest = computeWorkspaceDigest(wsDir);
    expect(packaged.workspaces[0].digest.hex).toBe(expectedDigest.hex);
    expect(packaged.workspaces[0].files).toBe(expectedDigest.fileCount);

    const verified = verifyHandoffPackage({ archive: outPath });
    expect(verified.ok).toBe(true);
    expect(verified.workspaces).toEqual([
      { id: "ws-alpha", expected: packaged.workspaces[0].digest, actual: expect.objectContaining({ hex: expectedDigest.hex }), ok: true },
    ]);
  });

  test("a tampered manifest digest fails verify", () => {
    const manifest = JSON.parse(readFileSync(join(outDir, "manifest.json"), "utf8"));
    const realHex = manifest.workspaces[0].digest.hex;
    manifest.workspaces[0].digest.hex = `${realHex.slice(0, -1)}${realHex.endsWith("0") ? "1" : "0"}`;
    writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

    const verified = verifyHandoffPackage({ archive: outPath });
    expect(verified.ok).toBe(false);
    expect(verified.workspaces[0].ok).toBe(false);
  });
});

describe("packageHandoff (multiple workspaces → directory output)", () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "ge-handoff-pkg-multi-"));
  makeWorkspace(fixtureRoot, "ws-one");
  makeWorkspace(fixtureRoot, "ws-two");
  const outDir = mkdtempSync(join(tmpdir(), "ge-handoff-pkg-multi-out-"));

  test("writes one archive per workspace plus a shared manifest, and verifies both", () => {
    const packaged = packageHandoff({ ids: "ws-one,ws-two", out: outDir, workspacesRoot: fixtureRoot });
    expect(packaged.out).toBe(outDir);
    expect(packaged.workspaces.map((w) => w.id).sort()).toEqual(["ws-one", "ws-two"]);

    const verified = verifyHandoffPackage({ archive: outDir });
    expect(verified.ok).toBe(true);
    expect(verified.workspaces).toHaveLength(2);
    expect(verified.workspaces.every((w) => w.ok)).toBe(true);
  });
});

describe("verifyHandoffPackage error contract", () => {
  test("a missing manifest is a DxError, not a crash", () => {
    const emptyDir = mkdtempSync(join(tmpdir(), "ge-handoff-pkg-empty-"));
    let caught = null;
    try {
      verifyHandoffPackage({ archive: emptyDir });
    } catch (e) {
      caught = e;
    }
    expect(isDxError(caught)).toBe(true);
  });
});

describe("planHandoff", () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "ge-handoff-plan-"));
  const okDir = makeWorkspace(fixtureRoot, "ws-ok");
  const deniedDir = makeWorkspace(fixtureRoot, "ws-denied");

  // Fake admission dependency — planHandoff's `checkAdmission` param stands
  // in for the real `checkAdmission` from admission-ops.mjs, which needs a
  // real .ge/keys signer and a real promotion packet neither of which this
  // fixture root has any reason to fabricate.
  function fakeCheckAdmission({ id, record }) {
    calls.push({ id, record });
    if (id === "ws-denied") return { allowed: false, required: true, blockers: [{ code: "NO_PROOF", what: "no live proof on file" }] };
    return { allowed: true, required: false, blockers: [] };
  }
  const calls = [];

  test("reports digests matching computeWorkspaceDigest directly, and the injected admission verdict", () => {
    const plan = planHandoff({ ids: "ws-ok,ws-denied", workspacesRoot: fixtureRoot, checkAdmission: fakeCheckAdmission });
    expect(plan.target).toBe("agents-cli");
    expect(plan.startStage).toBe("load_data");
    expect(plan.targetStage).toBe("publish_enterprise");

    const byId = Object.fromEntries(plan.workspaces.map((w) => [w.id, w]));
    expect(byId["ws-ok"].digest.hex).toBe(computeWorkspaceDigest(okDir).hex);
    expect(byId["ws-ok"].path).toBe(okDir);
    expect(byId["ws-ok"].admission).toEqual({ allowed: true, blockers: [] });

    expect(byId["ws-denied"].digest.hex).toBe(computeWorkspaceDigest(deniedDir).hex);
    // required + denied, no --force → shouldAdmit is false
    expect(byId["ws-denied"].admission.allowed).toBe(false);
    expect(byId["ws-denied"].admission.blockers).toHaveLength(1);

    // Every admission check plan runs must be non-recording — a dry run never
    // writes a decision record or appends to the audit log.
    expect(calls.every((c) => c.record === false)).toBe(true);
  });

  test("--force is break-glass: a required denial is overridden in the plan's verdict", () => {
    const plan = planHandoff({ ids: "ws-denied", workspacesRoot: fixtureRoot, checkAdmission: fakeCheckAdmission, force: true });
    expect(plan.workspaces[0].admission.allowed).toBe(true); // overridden, still surfaces the blockers
    expect(plan.workspaces[0].admission.blockers).toHaveLength(1);
  });

  test("a broken workspace degrades to an unplannable entry instead of aborting the plan", () => {
    const throwingCheck = () => { throw new Error("contract unreadable"); };
    const plan = planHandoff({ workspacesRoot: fixtureRoot, checkAdmission: throwingCheck });
    for (const ws of plan.workspaces) {
      expect(ws.error).toContain("contract unreadable");
      expect(ws.admission.allowed).toBe(false);
      expect(ws.admission.blockers[0]).toContain("unplannable");
    }
    expect(plan.workspaces.length).toBeGreaterThan(0);
  });
});

describe("HANDOFF_TAR_EXCLUDES", () => {
  test("matches the exclude list handoff()'s tar invocation uses (tools/lib/provision.mjs)", () => {
    expect(HANDOFF_TAR_EXCLUDES).toEqual([".venv", "node_modules", "__pycache__", ".pytest_cache", "runs", "versions", ".ge-harness"]);
  });
});
