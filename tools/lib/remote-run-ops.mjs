// remote-run-ops — remote-mode run observation + artifact sync: poll submitted
// runs through the gateway (`ge status`), read per-item stage results from GCS
// (`ge logs`), and pull generated agent archives into the repo (`ge agents
// sync`). Verbatim extraction from factory-core.mjs (see AGENTS.md /
// REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency injection where
// needed, re-export from factory-core.mjs to preserve its public API contract).
//
// createRemoteRunOps takes `run`/`gcloud`/`ensureGcloud` (live exec) and
// `withGateway` (composed from createGatewayClient({ run }) by factory-core)
// as injected dependencies — the same factory-function shape createDataPlane/
// createMcpPlane/createFactoryPlane already use in this directory — because
// factory-core.mjs is the module that re-exports this file's functions, so this
// file must not import factory-core.mjs back (that would be the cycle).

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, writeJson } from "@ge/std/json-io";
import { pool } from "./gcp.mjs";
import { getJson } from "./gateway-client.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

const noop = () => {};

// Same-directory leaf constant, computed independently (matches state-paths.mjs's
// own pattern) rather than importing REPO_ROOT back from factory-core.mjs, which
// would create an import cycle.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const STATE_PATH = STATE_PATHS.envState;
const SYNC_STATE_PATH = STATE_PATHS.syncState;

// Mirrors factory-core's parseIdList (accepts a CSV string or an array, always
// returns a trimmed, empty-free list) — kept local so this module has no
// dependency back on factory-core.mjs (same as provision.mjs).
function parseIdList(ids) {
  return String(Array.isArray(ids) ? ids.join(",") : ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function createRemoteRunOps({ run, gcloud, ensureGcloud, withGateway }) {
  async function status(cfg, { noProxy = false } = {}) {
    ensureGcloud();
    const state = readJson(STATE_PATH, { completed: {} });
    const runs = Object.entries(state.completed).map(([id, e]) => ({ id, ...e }));
    if (!runs.length) throw new Error("No submitted runs in .ge-state.json. Run `ge provision` first.");
    return withGateway(cfg, async (url, ctx = {}) => {
      const tally = { done: 0, running: 0, queued: 0, failed: 0, unknown: 0 };
      const stages = {};
      const perRun = [];
      await pool(runs, 10, async (r) => {
        const res = await getJson(url, `/api/factory/runs/${r.runId}`, ctx.headers).catch(() => ({ ok: false }));
        const s = res.json || {};
        const st = (s.status || s.state || "unknown").toLowerCase();
        const stage = s.currentStage || s.stage || "?";
        stages[stage] = (stages[stage] || 0) + 1;
        let bucket = "unknown";
        if (["done", "succeeded", "published", "complete"].some((k) => st.includes(k))) bucket = "done";
        else if (["fail", "error"].some((k) => st.includes(k))) bucket = "failed";
        else if (["run", "active", "submit", "build", "deploy"].some((k) => st.includes(k))) bucket = "running";
        else if (st.includes("queue") || st.includes("wait")) bucket = "queued";
        tally[bucket]++;
        perRun.push({ id: r.id, runId: r.runId, stage, status: st, bucket });
      });
      return { total: runs.length, tally, stages, perRun, terminal: tally.done + tally.failed === runs.length };
    }, { noProxy });
  }

  function logs(cfg, { runId, stage = "validate", item } = {}) {
    ensureGcloud();
    if (!runId) throw new Error("runId required");
    const state = readJson(STATE_PATH, { completed: {} });
    const workspaceId = item || Object.values(state.completed).find((e) => e.runId === runId)?.workspaceId;
    if (!workspaceId) throw new Error("Could not resolve workspaceId; pass item=ws-<id>.");
    const uri = `gs://${cfg.bucket}/runs/${runId}/items/${workspaceId}/factory-${stage}-result.json`;
    const r = gcloud(["storage", "cat", uri], { allowFail: true });
    if (!r.ok) {
      const ls = gcloud(["storage", "ls", "-r", `gs://${cfg.bucket}/runs/${runId}/`], { allowFail: true });
      return { found: false, uri, available: ls.ok ? ls.out.split("\n") : [] };
    }
    let result; try { result = JSON.parse(r.out); } catch { return { found: true, uri, raw: r.out }; }
    return { found: true, uri, result };
  }

  async function sync(cfg, { ids = "", force = false, commit = true, push = false, log = noop } = {}) {
    ensureGcloud();
    const state = readJson(STATE_PATH, { completed: {} });
    const requested = parseIdList(ids);
    const requestedSet = new Set(requested);
    const entries = Object.entries(state.completed).filter(([id, entry]) => {
      if (!requestedSet.size) return true;
      return requestedSet.has(id) || requestedSet.has(entry?.workspaceId);
    });
    if (!entries.length) throw new Error("No completed runs to sync.");
    const outDir = join(REPO_ROOT, "generated-agents");
    mkdirSync(outDir, { recursive: true });
    const synced = readJson(SYNC_STATE_PATH, { synced: {} });
    let ok = 0, fail = 0;
    await pool(entries, 4, async ([id, e]) => {
      if (!force && synced.synced[id]?.runId === e.runId) return;
      const uri = `gs://${cfg.bucket}/runs/${e.runId}/items/${e.workspaceId}/agent-result.tar.gz`;
      const dest = join(outDir, id);
      const tmp = join(REPO_ROOT, ".tmp", `${id}.tar.gz`);
      mkdirSync(dirname(tmp), { recursive: true });
      const dl = gcloud(["storage", "cp", uri, tmp], { allowFail: true });
      if (!dl.ok) { fail++; log(`✗ ${id} (no archive yet)`); return; }
      rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true });
      try { execFileSync("tar", ["-xzf", tmp, "-C", dest], { stdio: "ignore" }); } catch { fail++; return; }
      rmSync(tmp, { force: true });
      synced.synced[id] = { runId: e.runId, at: new Date().toISOString() };
      writeJson(SYNC_STATE_PATH, synced);
      ok++; log(`✓ ${id}`);
    });
    rmSync(join(REPO_ROOT, ".tmp"), { recursive: true, force: true });
    let committed = false;
    if (ok && commit) {
      run("git", ["add", "generated-agents", ".generated-agents-sync-state.json"], { capture: false });
      run("git", ["commit", "-m", `chore(agents): sync ${ok} generated workspace(s)`], { capture: false });
      committed = true;
      if (push) run("git", ["push"], { capture: false });
    }
    return { mode: "remote", ids: entries.map(([id]) => id), synced: ok, failed: fail, committed, pushed: !!(ok && commit && push) };
  }

  return { status, logs, sync };
}
