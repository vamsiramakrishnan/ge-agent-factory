// Autopilot orchestration transport: submit convergence runs to the runtime
// daemon (falling back to local mission planning + in-process convergence with
// a traced reason), sync daemon task state into the autopilot store, and read
// run/item/event state for the console. Verbatim move from transport.mjs.
//
// NOTE: the daemon-backed paths are pinned by the parity oracle
// (transport-oracle.test.mjs). The local branch (core.missionPlan +
// processAutopilotRun/runAutopilotConvergence) needs the generated use-case
// catalog and a full workspace fleet, which offline environments don't
// materialize — it was moved byte-for-byte but is only parse/import-verified
// here (same coverage it had before the move).

import * as core from "../../../../../tools/lib/factory-core.mjs";
import {
  autopilotItemsFromMission,
  autopilotSkipReason,
  runAutopilotConvergence,
} from "../../../../../tools/lib/autopilot-runner.mjs";
import {
  appendAutopilotEvent,
  createAutopilotRun,
  finishAutopilotRun,
  getAutopilotRun,
  listAutopilotEvents,
  listAutopilotItems,
  listAutopilotRuns,
  updateAutopilotItem,
} from "../job-store.mjs";
import { daemonBaseUrl } from "./daemon.mjs";

const autopilotActive = new Set();

// Autopilot events are a best-effort mirror; warn once per run (not per event)
// when the store rejects so incomplete history is diagnosable, not silent.
const warnedAutopilotPersist = new Set();
function warnAutopilotPersistFailure(id, error) {
  if (warnedAutopilotPersist.has(id)) return;
  warnedAutopilotPersist.add(id);
  console.warn(`[transport] autopilot ${id}: event persist failed — stored history may be incomplete: ${error?.message || error}`);
}
let autopilotSeq = 0;

async function submitAutopilotToDaemon(body) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "autopilot.run", ...body }),
    signal: AbortSignal.timeout(1000),
  });
  if (!response.ok) throw new Error(`daemon autopilot start failed: ${response.status}`);
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

async function syncDaemonAutopilot(id) {
  const local = await getAutopilotRun(id);
  if (!local?.options?.daemonTask) return local;
  const task = await fetchDaemonTask(id);
  const output = task.output || {};
  for (const item of output.items || []) {
    await updateAutopilotItem(id, item.agentId, item);
  }
  if (!["running", "queued"].includes(task.status)) {
    await finishAutopilotRun(id, output.run?.status || task.status);
  }
  return await getAutopilotRun(id);
}

export async function startAutopilotRun({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {} } = {}) {
  // Daemon submit failure falls through to local mission planning below; capture
  // the reason so the local run is traceable instead of silently swapping planes.
  let daemonSubmitError = null;
  try {
    const task = await submitAutopilotToDaemon({ ids, targetStage, repair, attempts, runPreview, query });
    const output = task.output || {};
    const run = output.run;
    const items = output.items || [];
    if (run) {
      await createAutopilotRun({
        id: task.id,
        targetStage: run.targetStage || targetStage,
        options: { ...(run.options || {}), daemonTask: true },
        items,
        status: run.status || task.status,
      });
      if (!["running", "queued"].includes(task.status)) await finishAutopilotRun(task.id, run.status || task.status);
    }
    return {
      skipped: task.status === "skipped",
      runId: task.id,
      reason: output.reason,
      mission: output.mission,
    };
  } catch (error) {
    daemonSubmitError = error;
  }

  const cfg = core.loadConfig(query || {});
  const mission = await core.missionPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const items = autopilotItemsFromMission(mission);
  if (!items.length) {
    const id = `auto-skip-${Date.now()}-${++autopilotSeq}`;
    const reason = autopilotSkipReason(mission);
    if (daemonSubmitError) console.warn(`[transport] autopilot ${id}: daemon submit failed, planned locally — ${daemonSubmitError?.message || String(daemonSubmitError)}`);
    await createAutopilotRun({
      id,
      targetStage,
      options: { repair, attempts, runPreview, mode: cfg.mode, mission, skipped: true, skipReason: reason },
      items: [],
      status: "skipped",
    });
    await appendAutopilotEvent(id, {
      type: "stage_skipped",
      level: "info",
      line: reason,
      data: { summary: mission.summary, modeContract: mission.modeContract },
      ts: new Date().toISOString(),
    });
    await finishAutopilotRun(id, "skipped");
    return {
      skipped: true,
      runId: id,
      reason,
      mission,
    };
  }
  const id = `auto-${Date.now()}-${++autopilotSeq}`;
  await createAutopilotRun({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, mission },
    items,
  });
  if (daemonSubmitError) {
    const reason = daemonSubmitError?.message || String(daemonSubmitError);
    console.warn(`[transport] autopilot ${id}: daemon submit failed, running locally — ${reason}`);
    await appendAutopilotEvent(id, { type: "log", level: "warn", line: `Daemon unavailable; running autopilot locally instead — ${reason}`, data: { fellBackToLocal: true }, ts: new Date().toISOString() });
  }
  processAutopilotRun(id, { cfg, repair, attempts, runPreview }).catch((error) => console.warn(`[transport] autopilot ${id}: run crashed outside its own error handling — ${error?.message || error}`));
  return { skipped: false, runId: id, mission };
}

export async function resumeAutopilotRun(id, { query = {} } = {}) {
  const run = await getAutopilotRun(id);
  if (!run) return null;
  if (run.options?.daemonTask) return await syncDaemonAutopilot(id);
  const cfg = core.loadConfig(query || {});
  processAutopilotRun(id, {
    cfg,
    repair: run.options?.repair !== false,
    attempts: run.options?.attempts || 3,
    runPreview: run.options?.runPreview === true,
  }).catch((error) => console.warn(`[transport] autopilot ${id}: run crashed outside its own error handling — ${error?.message || error}`));
  return await getAutopilotRun(id);
}

export async function getAutopilot(id) {
  const run = await syncDaemonAutopilot(id) || await getAutopilotRun(id);
  if (!run) return null;
  return { run, items: await listAutopilotItems(id) };
}

export async function listAutopilots({ limit } = {}) {
  return await listAutopilotRuns({ limit });
}

export async function getAutopilotEvents(id, opts = {}) {
  const run = await getAutopilotRun(id);
  if (run?.options?.daemonTask) {
    try {
      const after = Number(opts.afterSeq) || 0;
      const events = await fetchDaemonTaskEvents(id, after);
      return events.filter((event) => event.seq > after);
    } catch { /* best-effort: daemon unreachable; fall back to the locally mirrored events below (warning here would fire on every poll) */ }
  }
  return await listAutopilotEvents(id, opts);
}

async function processAutopilotRun(id, { cfg, repair = true, attempts = 3, runPreview = false } = {}) {
  if (autopilotActive.has(id)) return;
  autopilotActive.add(id);
  const push = (ev) => appendAutopilotEvent(id, { ...ev, ts: new Date().toISOString() }).catch((e) => warnAutopilotPersistFailure(id, e));
  try {
    const run = await getAutopilotRun(id);
    const items = await listAutopilotItems(id);
    const result = await runAutopilotConvergence({
      run,
      items,
      cfg,
      core,
      repair,
      attempts,
      runPreview,
      emit: push,
      updateItem: (item) => updateAutopilotItem(id, item.agentId, item),
    });
    await finishAutopilotRun(id, result.status);
  } catch (e) {
    push({ type: "stage_failed", level: "error", line: e?.message || String(e) });
    await finishAutopilotRun(id, "failed");
  } finally {
    autopilotActive.delete(id);
  }
}
