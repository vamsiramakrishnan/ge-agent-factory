// Repair orchestration transport: submit convergence runs to the runtime
// daemon (falling back to local pipeline planning + in-process convergence with
// a traced reason), sync daemon task state into the repair store, and read
// run/item/event state for the console. Verbatim move from transport.mjs.
//
// NOTE: the daemon-backed paths are pinned by the parity oracle
// (transport-oracle.test.mjs). The local branch (core.pipelineGraphPlan +
// processRepairRun/runRepairConvergence) needs the generated use-case
// catalog and a full workspace fleet, which offline environments don't
// materialize — it was moved byte-for-byte but is only parse/import-verified
// here (same coverage it had before the move).

import * as core from "../../../../../tools/lib/factory-core.mjs";
import {
  repairItemsFromPipeline,
  repairSkipReason,
  runRepairConvergence,
} from "../../../../../tools/lib/repair-runner.mjs";
import {
  appendRepairEvent,
  createRepairRun,
  finishRepairRun,
  getRepairRun,
  listRepairEvents,
  listRepairItems,
  listRepairRuns,
  updateRepairItem,
} from "../job-store.mjs";
import { daemonBaseUrl } from "./daemon.mjs";

const repairActive = new Set();

// Repair events are a best-effort mirror; warn once per run (not per event)
// when the store rejects so incomplete history is diagnosable, not silent.
const warnedRepairPersist = new Set();
function warnRepairPersistFailure(id, error) {
  if (warnedRepairPersist.has(id)) return;
  warnedRepairPersist.add(id);
  console.warn(`[transport] repair ${id}: event persist failed — stored history may be incomplete: ${error?.message || error}`);
}
let repairSeq = 0;

async function submitRepairToDaemon(body) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "repair.run", ...body }),
    signal: AbortSignal.timeout(1000),
  });
  if (!response.ok) throw new Error(`daemon repair start failed: ${response.status}`);
  return await response.json();
}

async function fetchDaemonTask(id) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(1000),
  });
  if (!response.ok) throw new Error(`daemon task lookup failed: ${response.status}`);
  return await response.json();
}

async function fetchDaemonTaskEvents(id, afterSeq = 0) {
  // Daemon protocol v3 filters afterSeq server-side, so a poll only transfers
  // the new tail. The client-side filter below stays as a belt-and-braces
  // guard for older daemons that ignore the param.
  const params = afterSeq > 0 ? `&afterSeq=${encodeURIComponent(afterSeq)}` : "";
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}/events?format=json${params}`, {
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`daemon task events failed: ${response.status}`);
  const body = await response.json();
  return body.events || [];
}

async function syncDaemonRepair(id) {
  const local = await getRepairRun(id);
  if (!local?.options?.daemonTask) return local;
  const task = await fetchDaemonTask(id);
  const output = task.output || {};
  for (const item of output.items || []) {
    await updateRepairItem(id, item.agentId, item);
  }
  if (!["running", "queued"].includes(task.status)) {
    await finishRepairRun(id, output.run?.status || task.status);
  }
  return await getRepairRun(id);
}

export async function startRepairRun({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {} } = {}) {
  // Daemon submit failure falls through to local pipeline planning below; capture
  // the reason so the local run is traceable instead of silently swapping planes.
  let daemonSubmitError = null;
  try {
    const task = await submitRepairToDaemon({ ids, targetStage, repair, attempts, runPreview, query });
    const output = task.output || {};
    const run = output.run;
    const items = output.items || [];
    if (run) {
      await createRepairRun({
        id: task.id,
        targetStage: run.targetStage || targetStage,
        options: { ...(run.options || {}), daemonTask: true },
        items,
        status: run.status || task.status,
      });
      if (!["running", "queued"].includes(task.status)) await finishRepairRun(task.id, run.status || task.status);
    }
    return {
      skipped: task.status === "skipped",
      runId: task.id,
      reason: output.reason,
      pipeline: output.pipeline,
    };
  } catch (error) {
    daemonSubmitError = error;
  }

  const cfg = core.loadConfig(query || {});
  const pipeline = await core.pipelineGraphPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const items = repairItemsFromPipeline(pipeline);
  if (!items.length) {
    const id = `repair-skip-${Date.now()}-${++repairSeq}`;
    const reason = repairSkipReason(pipeline);
    if (daemonSubmitError) console.warn(`[transport] repair ${id}: daemon submit failed, planned locally — ${daemonSubmitError?.message || String(daemonSubmitError)}`);
    await createRepairRun({
      id,
      targetStage,
      options: { repair, attempts, runPreview, mode: cfg.mode, pipeline, skipped: true, skipReason: reason },
      items: [],
      status: "skipped",
    });
    await appendRepairEvent(id, {
      type: "stage_skipped",
      level: "info",
      line: reason,
      data: { summary: pipeline.summary, modeContract: pipeline.modeContract },
      ts: new Date().toISOString(),
    });
    await finishRepairRun(id, "skipped");
    return {
      skipped: true,
      runId: id,
      reason,
      pipeline,
    };
  }
  const id = `repair-${Date.now()}-${++repairSeq}`;
  await createRepairRun({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, pipeline },
    items,
  });
  if (daemonSubmitError) {
    const reason = daemonSubmitError?.message || String(daemonSubmitError);
    console.warn(`[transport] repair ${id}: daemon submit failed, running locally — ${reason}`);
    await appendRepairEvent(id, { type: "log", level: "warn", line: `Daemon unavailable; running the repair locally instead — ${reason}`, data: { fellBackToLocal: true }, ts: new Date().toISOString() });
  }
  processRepairRun(id, { cfg, repair, attempts, runPreview }).catch((error) => console.warn(`[transport] repair ${id}: run crashed outside its own error handling — ${error?.message || error}`));
  return { skipped: false, runId: id, pipeline };
}

export async function resumeRepairRun(id, { query = {} } = {}) {
  const run = await getRepairRun(id);
  if (!run) return null;
  if (run.options?.daemonTask) return await syncDaemonRepair(id);
  const cfg = core.loadConfig(query || {});
  processRepairRun(id, {
    cfg,
    repair: run.options?.repair !== false,
    attempts: run.options?.attempts || 3,
    runPreview: run.options?.runPreview === true,
  }).catch((error) => console.warn(`[transport] repair ${id}: run crashed outside its own error handling — ${error?.message || error}`));
  return await getRepairRun(id);
}

export async function getRepair(id) {
  const run = await syncDaemonRepair(id) || await getRepairRun(id);
  if (!run) return null;
  return { run, items: await listRepairItems(id) };
}

export async function listRepairs({ limit } = {}) {
  return await listRepairRuns({ limit });
}

export async function getRepairEvents(id, opts = {}) {
  const run = await getRepairRun(id);
  if (run?.options?.daemonTask) {
    try {
      const after = Number(opts.afterSeq) || 0;
      const events = await fetchDaemonTaskEvents(id, after);
      return events.filter((event) => event.seq > after);
    } catch { /* best-effort: daemon unreachable; fall back to the locally mirrored events below (warning here would fire on every poll) */ }
  }
  return await listRepairEvents(id, opts);
}

async function processRepairRun(id, { cfg, repair = true, attempts = 3, runPreview = false } = {}) {
  if (repairActive.has(id)) return;
  repairActive.add(id);
  const push = (ev) => appendRepairEvent(id, { ...ev, ts: new Date().toISOString() }).catch((e) => warnRepairPersistFailure(id, e));
  try {
    const run = await getRepairRun(id);
    const items = await listRepairItems(id);
    const result = await runRepairConvergence({
      run,
      items,
      cfg,
      core,
      repair,
      attempts,
      runPreview,
      emit: push,
      updateItem: (item) => updateRepairItem(id, item.agentId, item),
    });
    await finishRepairRun(id, result.status);
  } catch (e) {
    push({ type: "stage_failed", level: "error", line: e?.message || String(e) });
    await finishRepairRun(id, "failed");
  } finally {
    repairActive.delete(id);
  }
}
