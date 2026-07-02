// fleet-ops — read-only fleet/mission/journey planning + run-log/artifact reads
// (`ge agents status`, `ge mission plan`, `ge journey plan`, `ge logs --tail`,
// artifact reads). Verbatim extraction from factory-core.mjs (see AGENTS.md /
// REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency injection where
// needed, re-export from factory-core.mjs to preserve its public API contract).
//
// createFleetOps takes `gcloud` (live exec, owned by factory-core) and
// `statusBoard` (closes over factory-core's composed factoryPlane) as injected
// dependencies — the same factory-function shape createDataPlane/createMcpPlane/
// createFactoryPlane already use in this directory — because factory-core.mjs is
// the module that re-exports this file's functions, so this file must not import
// factory-core.mjs back (that would be the cycle). Everything else here is a
// stable leaf import (catalog search, ledger reads, local workspace index,
// fleet-health/journey/mission plan builders).

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "@ge/std/json-io";
import { buildFactoryAutopilotMission } from "./factory-autopilot-mission.mjs";
import { buildFleetHealth } from "./doctor/fleet-health.mjs";
import { buildJourneyPlan } from "./journey-plan.mjs";
import { loadCatalog } from "./factory-catalog-search.mjs";
import { runLedger, ledgerReadsEnabled } from "./ledger/factory-ledger.mjs";
import { localWorkspaceIndexByUseCase } from "./local-workspaces.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

// Same-directory leaf constant, computed independently (matches state-paths.mjs's
// own pattern) rather than importing REPO_ROOT back from factory-core.mjs, which
// would create an import cycle.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const STATE_PATH = STATE_PATHS.envState;
const FACTORY_DATA_ROOT = STATE_PATHS.factory.root;
const LOCAL_PROJECTS = STATE_PATHS.factory.workspaces;

export function createFleetOps({ gcloud, statusBoard }) {
  // Fleet roster: catalog × .ge-state.json (no network).
  async function fleetStatus(cfg) {
    const cat = await loadCatalog();
    const state = readJson(STATE_PATH, { completed: {}, failed: {} });
    const localWorkspaces = cfg.mode === "local" ? localWorkspaceIndexByUseCase() : new Map();
    // Read cutover: when enabled, the ledger is the source of per-agent run state
    // (replacing the .ge-state.json completed/failed lookups below). Falls back to
    // the files when the flag is off or the ledger is unavailable/empty.
    let ledgerFleet = null;
    if (ledgerReadsEnabled()) {
      const l = await runLedger();
      const map = l ? l.fleetByUseCase() : null;
      if (map && map.size) ledgerFleet = map;
    }

    // Local mode: best-effort runId discovery from the canonical factory journal.
    let localRunIndex = {};
    if (cfg.mode === "local") {
      const indexPath = join(FACTORY_DATA_ROOT, "runs", "index.json");
      const indexEntries = readJson(indexPath, []);
      // Map agentId → latest runId (agentId↔catalogId alignment is required; no fuzzy match).
      for (const entry of indexEntries) {
        if (entry.agentId && entry.runId) localRunIndex[entry.agentId] = entry.runId;
      }
    }

    const agents = cat.map((u) => {
      const lg = ledgerFleet?.get(u.id) || null;
      // Per-agent merge: the ledger is authoritative for agents it knows about; agents
      // it hasn't recorded fall back to the legacy state file. This keeps defaulting
      // reads on safe even before a backfill (no agent silently loses its state).
      const c = lg ? (lg.status !== "failed" ? { runId: lg.runId, workspaceId: lg.workspaceId } : null) : state.completed[u.id];
      const f = lg ? (lg.status === "failed" ? { error: lg.error || "failed" } : null) : state.failed[u.id];
      const local = localWorkspaces.get(u.id) || null;
      let runId = c?.runId || null;
      // Best-effort: if still null in local mode, use harness journal index.
      if (!runId && cfg.mode === "local" && localRunIndex[u.id]) {
        runId = localRunIndex[u.id];
      }
      if (!runId && local?.runId) runId = local.runId;
      const workspaceId = c?.workspaceId || local?.id || null;
      return {
        id: u.id, title: u.title, department: u.department,
        runId,
        workspaceId,
        status: c || workspaceId ? "submitted" : f ? "failed" : "none",
        error: f?.error || null,
        localWorkspaceUpdatedAt: local?.updatedAt || null,
      };
    });
    const byDept = {}; const byStatus = {};
    for (const a of agents) { byDept[a.department] = (byDept[a.department] || 0) + 1; byStatus[a.status] = (byStatus[a.status] || 0) + 1; }
    const base = { total: agents.length, byDept, byStatus, agents };
    const health = buildFleetHealth(base, { repoRoot: REPO_ROOT });
    return { ...base, health, agents: health.agents };
  }

  async function missionPlan(cfg, { ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false } = {}) {
    const fleet = await fleetStatus(cfg);
    return buildFactoryAutopilotMission({ cfg, fleet, ids, targetStage, repair, attempts, runPreview });
  }

  async function journeyPlan(cfg, {
    scenario = null,
    usecaseId = null,
    spec = null,
    systems = [],
    ids = [],
    targetStage = "preview",
    tasks = [],
    graph = null,
  } = {}) {
    const [status, fleet] = await Promise.all([
      Promise.resolve(statusBoard(cfg)),
      fleetStatus(cfg),
    ]);
    return buildJourneyPlan({
      scenario,
      spec,
      usecaseId,
      systems,
      ids,
      targetStage,
      mode: cfg.mode || "local",
      status,
      fleet,
      tasks,
      graph,
    });
  }

  // Read the NDJSON log for a run/stage. Local → .ge/factory/runs (harness writes stage "run");
  // remote → GCS object the worker tees to.
  function tailLog(cfg, { runId, stage, item } = {}) {
    if ((cfg.mode || "local") === "local") {
      const s = stage || "run"; // harness journal uses stage "run" per agent invocation
      const p = join(FACTORY_DATA_ROOT, "runs", runId, `${s}.ndjson`);
      return { found: existsSync(p), source: p, ndjson: existsSync(p) ? readFileSync(p, "utf8") : "" };
    }
    const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item || runId}/${stage}.ndjson`;
    const r = gcloud(["storage", "cat", uri], { allowFail: true });
    return { found: r.ok, source: uri, ndjson: r.ok ? r.out : "" };
  }

  function readArtifact(cfg, { runId, item, name } = {}) {
    if ((cfg.mode || "local") === "local") {
      const workspaceId = item || runId;
      const p = join(LOCAL_PROJECTS, workspaceId, name);
      return { found: existsSync(p), source: p, content: existsSync(p) ? readFileSync(p, "utf8") : "" };
    }
    const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item}/${name}`;
    const r = gcloud(["storage", "cat", uri], { allowFail: true });
    return { found: r.ok, source: uri, content: r.ok ? r.out : "" };
  }

  return { fleetStatus, missionPlan, journeyPlan, tailLog, readArtifact };
}
