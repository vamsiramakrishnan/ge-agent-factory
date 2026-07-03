// tools/lib/daemon/repair-run.mjs — the "repair.run" run-kind: plans a
// pipeline via factory-core, selects convergence-eligible agent items, and
// drives repair-runner.mjs's convergence loop to a terminal run/items/
// counts shape. Moved verbatim out of tools/lib/runtime-daemon.mjs. Unlike
// the other five run-kinds there is no separate resumeRepairTask — a
// resumed repair run is simply a fresh startRepairTask call carrying
// `resumedFrom` (see resumeTask's "repair.run" branch in
// runtime-daemon.mjs, which stays there since it dispatches across all six
// run-kinds' resume behavior).
import { readJson } from "@ge/std/json-io";
import * as core from "../factory-core.mjs";
import {
  repairCounts,
  repairItemsFromPipeline,
  repairSkipReason,
  createRepairItemState,
  createRepairRunState,
  runRepairConvergence,
} from "../repair-runner.mjs";
import {
  appendEvent,
  createRun,
  newTaskId,
  runMetaPath,
  runOutput,
  updateRun,
  updateRunOutput,
} from "./run-store.mjs";

export async function startRepairTask({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, resumedFrom = null } = {}) {
  const cfg = core.loadConfig(query || {});
  const pipeline = await core.pipelineGraphPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const selectedItems = repairItemsFromPipeline(pipeline);
  const id = selectedItems.length ? newTaskId("auto") : newTaskId("auto-skip");
  const itemStates = selectedItems.map((item) => createRepairItemState({ runId: id, targetStage, ...item }));
  const runState = createRepairRunState({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, pipeline, daemonTask: true },
    items: itemStates,
    status: selectedItems.length ? "running" : "skipped",
  });
  const run = createRun({
    id,
    kind: "repair.run",
    input: { ids, targetStage, repair, attempts, runPreview, query, resumedFrom },
    status: runState.status,
  });
  updateRunOutput(id, { run: runState, items: itemStates, pipeline, counts: repairCounts(itemStates) });

  if (!selectedItems.length) {
    const reason = repairSkipReason(pipeline);
    appendEvent(id, { type: "stage_skipped", level: "info", line: reason, data: { summary: pipeline.summary, modeContract: pipeline.modeContract } });
    updateRun(id, { status: "skipped", endedAt: new Date().toISOString(), output: { ...runOutput(id), reason } });
    return readJson(runMetaPath(id), run);
  }

  runRepairConvergence({
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
      updateRunOutput(id, { items, counts: repairCounts(items) });
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
