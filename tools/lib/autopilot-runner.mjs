const TERMINAL_ITEM_STATUSES = new Set(["passed", "repaired"]);

export function autopilotItemsFromMission(mission = {}) {
  return (mission.roster || [])
    .filter((item) => ["doctor_repair", "observe_remote_run"].includes(item.autopilotAction))
    .map((item) => ({ agentId: item.agentId, workspaceId: item.workspaceId }));
}

export function autopilotSkipReason(mission = {}) {
  return mission.summary?.selected
    ? "No selected agents need an Autopilot doctor, repair, or remote observation step for this target."
    : "No agents matched the current Autopilot queue.";
}

export function autopilotCounts(items = []) {
  return {
    total: items.length,
    passed: items.filter((item) => item.status === "passed").length,
    repaired: items.filter((item) => item.status === "repaired").length,
    blocked: items.filter((item) => item.status === "blocked").length,
  };
}

export function createAutopilotItemState({ runId, targetStage, agentId, workspaceId }) {
  return {
    runId,
    agentId,
    workspaceId,
    targetStage,
    status: "pending",
    attempts: 0,
    blockers: [],
    doctor: null,
    repair: null,
    nextAction: "doctor",
    updatedAt: new Date().toISOString(),
  };
}

export function createAutopilotRunState({ id, targetStage, options = {}, items = [], status = "running" }) {
  const now = new Date().toISOString();
  const counts = autopilotCounts(items);
  return {
    id,
    targetStage,
    status,
    options,
    total: counts.total,
    passed: counts.passed,
    repaired: counts.repaired,
    blocked: counts.blocked,
    createdAt: now,
    updatedAt: now,
    endedAt: status === "running" ? null : now,
  };
}

export function patchAutopilotItem(item, patch = {}) {
  return {
    ...item,
    ...patch,
    blockers: patch.blockers !== undefined ? patch.blockers : item.blockers,
    doctor: patch.doctor !== undefined ? patch.doctor : item.doctor,
    repair: patch.repair !== undefined ? patch.repair : item.repair,
    updatedAt: new Date().toISOString(),
  };
}

export function finishAutopilotStatus(items = []) {
  const blocked = items.some((item) => item.status === "blocked");
  const pending = items.some((item) => ["pending", "doctor_running", "repairing"].includes(item.status));
  return pending ? "paused" : blocked ? "blocked" : "done";
}

export async function runAutopilotConvergence({
  run,
  items = [],
  cfg,
  core,
  repair = true,
  attempts = 3,
  runPreview = false,
  emit = () => {},
  updateItem = async () => {},
} = {}) {
  const mission = run.options?.mission || null;
  const modeContract = mission?.modeContract || null;
  let currentItems = items.map((item) => ({ ...item }));
  const setItem = async (agentId, patch) => {
    currentItems = currentItems.map((item) => item.agentId === agentId ? patchAutopilotItem(item, patch) : item);
    const next = currentItems.find((item) => item.agentId === agentId);
    await updateItem(next);
    return next;
  };

  emit({ type: "stage_started", line: `autopilot ${run.id} started` });
  for (const item of currentItems.filter((entry) => !TERMINAL_ITEM_STATUSES.has(entry.status))) {
    if (modeContract?.autopilotCapability === "remote_observe_only") {
      const observation = {
        kind: "ge.remote_factory_observation",
        ok: true,
        workspace: item.workspaceId || item.agentId,
        stage: run.targetStage,
        blockers: [],
        repairTasks: [],
        message: "Remote mode observes cloud factory state; local workspace doctor/repair is not available.",
      };
      await setItem(item.agentId, { status: "passed", doctor: observation, blockers: [], nextAction: "none" });
      emit({ type: "item_observed", agentId: item.agentId, line: `${item.agentId}: remote factory observation recorded` });
      continue;
    }

    emit({ type: "item_started", agentId: item.agentId, line: `${item.agentId}: doctor ${run.targetStage}` });
    await setItem(item.agentId, { status: "doctor_running", nextAction: "doctor" });
    const doctor = core.workspaceDoctor(cfg, { id: item.workspaceId || item.agentId, stage: run.targetStage });
    if (doctor.ok) {
      await setItem(item.agentId, { status: "passed", doctor, blockers: [], nextAction: "none" });
      emit({ type: "item_passed", agentId: item.agentId, line: `${item.agentId}: gate passed` });
      continue;
    }

    if (!repair) {
      await setItem(item.agentId, { status: "blocked", doctor, blockers: doctor.blockers || [], nextAction: "repair" });
      emit({ type: "item_blocked", agentId: item.agentId, line: `${item.agentId}: blocked (${doctor.blockers?.[0]?.id || "unknown"})` });
      continue;
    }

    emit({ type: "item_repairing", agentId: item.agentId, line: `${item.agentId}: repair ${run.targetStage}` });
    await setItem(item.agentId, { status: "repairing", doctor, blockers: doctor.blockers || [], nextAction: "repair" });
    const repairReport = core.workspaceRepair(cfg, {
      id: item.workspaceId || item.agentId,
      stage: run.targetStage,
      attempts,
      agent: "none",
      runPreview,
    });
    const finalDoctor = repairReport.finalDoctor || {};
    const status = repairReport.ok ? "repaired" : "blocked";
    await setItem(item.agentId, {
      status,
      attempts: repairReport.attempts?.length || 0,
      doctor: finalDoctor,
      repair: repairReport,
      blockers: finalDoctor.blockers || [],
      nextAction: repairReport.ok ? "none" : "inspect_blocker",
    });
    emit({
      type: repairReport.ok ? "item_repaired" : "item_blocked",
      agentId: item.agentId,
      line: `${item.agentId}: ${repairReport.ok ? "repaired" : "blocked"}`,
    });
  }

  const status = finishAutopilotStatus(currentItems);
  emit({ type: "stage_done", line: `autopilot ${status}` });
  return { status, items: currentItems, counts: autopilotCounts(currentItems) };
}
