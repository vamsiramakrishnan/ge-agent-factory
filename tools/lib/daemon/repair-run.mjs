// tools/lib/daemon/autopilot-run.mjs — the "autopilot.run" run-kind: plans a
// mission via factory-core, selects convergence-eligible agent items, and
// drives autopilot-runner.mjs's convergence loop to a terminal run/items/
// counts shape. Moved verbatim out of tools/lib/runtime-daemon.mjs. Unlike
// the other five run-kinds there is no separate resumeAutopilotTask — a
// resumed autopilot run is simply a fresh startAutopilotTask call carrying
// `resumedFrom` (see resumeTask's "autopilot.run" branch in
// runtime-daemon.mjs, which stays there since it dispatches across all six
// run-kinds' resume behavior).
import { readJson } from "@ge/std/json-io";
import * as core from "../factory-core.mjs";
import {
  autopilotCounts,
  autopilotItemsFromMission,
  autopilotSkipReason,
  createAutopilotItemState,
  createAutopilotRunState,
  runAutopilotConvergence,
} from "../autopilot-runner.mjs";
import {
  appendEvent,
  createRun,
  newTaskId,
  runMetaPath,
  runOutput,
  updateRun,
  updateRunOutput,
} from "./run-store.mjs";

export async function startAutopilotTask({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, resumedFrom = null } = {}) {
  const cfg = core.loadConfig(query || {});
  const mission = await core.missionPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const selectedItems = autopilotItemsFromMission(mission);
  const id = selectedItems.length ? newTaskId("auto") : newTaskId("auto-skip");
  const itemStates = selectedItems.map((item) => createAutopilotItemState({ runId: id, targetStage, ...item }));
  const runState = createAutopilotRunState({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, mission, daemonTask: true },
    items: itemStates,
    status: selectedItems.length ? "running" : "skipped",
  });
  const run = createRun({
    id,
    kind: "autopilot.run",
    input: { ids, targetStage, repair, attempts, runPreview, query, resumedFrom },
    status: runState.status,
  });
  updateRunOutput(id, { run: runState, items: itemStates, mission, counts: autopilotCounts(itemStates) });

  if (!selectedItems.length) {
    const reason = autopilotSkipReason(mission);
    appendEvent(id, { type: "stage_skipped", level: "info", line: reason, data: { summary: mission.summary, modeContract: mission.modeContract } });
    updateRun(id, { status: "skipped", endedAt: new Date().toISOString(), output: { ...runOutput(id), reason } });
    return readJson(runMetaPath(id), run);
  }

  runAutopilotConvergence({
    run: runState,
    items: itemStates,
    cfg,
    core,
    repair,
    attempts,
    runPreview,
    emit: (event) => appendEvent(id, event),
    updateItem: async (item) => {
      const output = runOutput(id);
      const items = (output.items || []).map((current) => current.agentId === item.agentId ? item : current);
      updateRunOutput(id, { items, counts: autopilotCounts(items) });
    },
  }).then((result) => {
    const output = runOutput(id);
    const finishedRun = {
      ...(output.run || runState),
      status: result.status,
      ...result.counts,
      updatedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    };
    updateRun(id, {
      status: result.status,
      endedAt: new Date().toISOString(),
      output: { ...output, run: finishedRun, items: result.items, counts: result.counts },
    });
  }).catch((error) => {
    const output = runOutput(id);
    appendEvent(id, { type: "stage_failed", level: "error", line: error?.message || String(error) });
    updateRun(id, {
      status: "failed",
      endedAt: new Date().toISOString(),
      error: error?.message || String(error),
      output,
    });
  });

  return readJson(runMetaPath(id), run);
}
