// Destructive/filesystem coverage for provision.mjs — specifically the
// copyWorkspaces() rsync→cp fallback and the prune logic it drives on the
// no-rsync path, plus the createProvisionOps dependency-injection guard.
//
// The only cross-cutting dep copyWorkspaces takes is `run`, so we inject a fake
// `run` that records every (cmd, args) and can be made to fail `rsync` to force
// the cp fallback — no real subprocess ever spawns. Dest writes land in an
// injected throwaway repoRoot under the OS temp dir, so nothing in the repo is
// touched.
//
// Import-order robustness: state-paths.mjs resolves LOCAL_PROJECTS (the *source*
// workspaces dir) exactly once from GE_STATE_ROOT at its first import, and this
// file shares one process with the rest of the `tools` shard — so a sibling
// test that imports state-paths first would pin LOCAL_PROJECTS before our env
// write could take effect. We therefore (a) set GE_STATE_ROOT with `||=` so it
// only ever points at a scratch dir (never the repo's real .ge), and (b) read
// the *actually-resolved* LOCAL_PROJECTS back out and seed our source
// workspaces there, rather than assuming it equals our scratch path. Scoping
// syncLocal to explicit ids keeps the synced count deterministic regardless of
// anything else already sitting in that dir.
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test, expect } from "bun:test";

process.env.GE_STATE_ROOT ||= join(tmpdir(), `ge-provision-copy-${process.pid}`);
const REPO_ROOT = join(tmpdir(), `ge-provision-copy-repo-${process.pid}`);

const { LOCAL_PROJECTS } = await import("./local-workspaces.mjs");
const { createProvisionOps } = await import("./provision.mjs");

// Two uniquely-named source workspaces syncLocal will discover. Unique names so
// we can target them by id and never collide with a sibling's fixtures.
const WS = ["prov-copy-a", "prov-copy-b"];
const IDS = WS.join(",");

rmSync(REPO_ROOT, { recursive: true, force: true });
mkdirSync(REPO_ROOT, { recursive: true });
for (const id of WS) mkdirSync(join(LOCAL_PROJECTS, id), { recursive: true });

// Build ops with a recording `run`. `rsyncOk` toggles the rsync result so we can
// exercise both the rsync-present and rsync-absent (cp fallback) branches.
function makeOps(rsyncOk) {
  const calls = [];
  const run = (cmd, args) => {
    calls.push({ cmd, args });
    if (cmd === "rsync" && !rsyncOk) return { ok: false, out: "", err: "rsync: command not found" };
    return { ok: true, out: "", err: "" };
  };
  const stub = () => ({ ok: true, out: "", err: "" });
  const ops = createProvisionOps({
    run,
    gcloud: stub,
    ensureGcloud: () => {},
    ensureBin: () => {},
    withGateway: async (_cfg, fn) => fn("https://gw", { headers: {} }),
    postJson: async () => ({ ok: true, json: { ok: true } }),
    loadCatalog: async () => [],
    runLedger: async () => ({}),
    ledgerWrite: async (fn) => fn({ recordRemoteSubmission: () => {} }),
    readJson: () => ({}),
    writeJson: () => {},
    localPreflight: () => {},
    ensureLocalUv: () => {},
    repoRoot: REPO_ROOT,
    configPath: join(REPO_ROOT, ".ge.json"),
    factoryHarnessDir: join(process.env.GE_STATE_ROOT, "factory"),
    factoryDataRoot: join(process.env.GE_STATE_ROOT, "data"),
    genDir: join(REPO_ROOT, "gen"),
  });
  return { ops, calls };
}

const byCmd = (calls, cmd) => calls.filter((c) => c.cmd === cmd);

test("createProvisionOps throws when a required dependency is missing", () => {
  expect(() => createProvisionOps({})).toThrow(/createProvisionOps requires/);
  expect(() => createProvisionOps()).toThrow(/createProvisionOps requires/);
});

test("copyWorkspaces uses rsync (with excludes, trailing slashes) and skips cp when rsync succeeds", () => {
  const { ops, calls } = makeOps(true);
  const result = ops.syncLocal({}, { ids: IDS, commit: false });

  expect(result.synced).toBe(2);
  const rsync = byCmd(calls, "rsync");
  expect(rsync).toHaveLength(2);
  // -a archive flag, at least one --exclude, and source/dest carry trailing slashes.
  expect(rsync[0].args[0]).toBe("-a");
  expect(rsync[0].args).toContain("--exclude");
  const src = rsync[0].args[rsync[0].args.length - 2];
  const dest = rsync[0].args[rsync[0].args.length - 1];
  expect(src.endsWith("/")).toBe(true);
  expect(dest.endsWith("/")).toBe(true);
  // rsync succeeded → no cp fallback, no prune find.
  expect(byCmd(calls, "cp")).toHaveLength(0);
  expect(byCmd(calls, "bash")).toHaveLength(0);
});

test("copyWorkspaces falls back to cp + prune when rsync is unavailable", () => {
  const { ops, calls } = makeOps(false);
  const result = ops.syncLocal({}, { ids: IDS, commit: false });

  expect(result.synced).toBe(2);
  // rsync attempted for each workspace, then cp fallback for each.
  expect(byCmd(calls, "rsync")).toHaveLength(2);
  const cp = byCmd(calls, "cp");
  expect(cp).toHaveLength(2);
  expect(cp[0].args[0]).toBe("-a");
  // cp copies the directory *contents* (`.../.`) into dest.
  expect(cp[0].args[1].endsWith("/.")).toBe(true);
  // Prune step (bash find) removes carried-through __pycache__/.pyc per workspace.
  const bash = byCmd(calls, "bash");
  expect(bash).toHaveLength(2);
  expect(bash[0].args[0]).toBe("-c");
  expect(bash[0].args[1]).toContain("__pycache__");
});

test("syncLocal git-commits the synced workspaces when commit is enabled but does not push", () => {
  const { ops, calls } = makeOps(true);
  const result = ops.syncLocal({}, { ids: IDS, commit: true, push: false });

  expect(result.pushed).toBe(false);
  const git = byCmd(calls, "git");
  expect(git.some((c) => c.args.includes("add"))).toBe(true);
  expect(git.some((c) => c.args.includes("commit"))).toBe(true);
  expect(git.some((c) => c.args.includes("push"))).toBe(false);
});

test("syncLocal throws for requested ids that match no local workspace", () => {
  const { ops } = makeOps(true);
  expect(() => ops.syncLocal({}, { ids: "does-not-exist-xyz" })).toThrow(/no matching local workspaces/);
});
