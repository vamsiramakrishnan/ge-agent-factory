// tools/lib/daemon/resume-plan.mjs — the cross-run-kind resume-plan
// dispatcher: given a persisted run, decides its resumability
// (safeToRun/nextAction/reason/commands) by consulting each run-kind's own
// safe-to-rerun classifier, plus the run/task summary shaping that layers on
// top of it (taskSummary/taskDetail and their normalized/list variants).
// Moved verbatim out of tools/lib/runtime-daemon.mjs.
//
// This sits one layer above the individual run-kind modules (it imports
// their safe* classifiers) but below the pipeline-graph cluster (which needs
// taskSummary/taskDetail to summarize child tasks) and the daemon
// orchestrator (which still owns resumeTask's cross-kind resume dispatch,
// since that also needs to call each kind's start/resume function, not just
// classify it).
import { isDataPipelineNodeKind, safePipelineNodeCommand } from "../pipeline/pipeline-node-registry.mjs";
import { normalizeRuntimeTask } from "../runtime-contract.mjs";
import { safeGeCommand, safeProcessCommand } from "./command-run.mjs";
import { safeHarnessRunInput } from "./harness-run.mjs";
import { listEvents, listRuns, taskStatusState } from "./run-store.mjs";

function commandList(id, safeToRun) {
  return [
    `ge runs show ${id} --json`,
    ...(safeToRun ? [`ge runs resume ${id}`] : []),
    `ge runs events ${id} --follow`,
  ];
}

export function resumePlanFor(run) {
  if (!run) return null;
  const output = run.output || {};
  const items = output.items || [];
  const blockers = items.flatMap((item) => item.blockers || []).concat(output.blockers || []);
  const artifacts = output.artifactRefs || [];
  const state = taskStatusState(run.status);
  const base = {
    state,
    nextAction: "none",
    safeToRun: false,
    reason: "",
    commands: commandList(run.id, false),
    blockers,
    artifacts,
  };

  if (["done", "skipped"].includes(run.status)) {
    return { ...base, state: run.status, reason: `task is ${run.status}; no resume action is needed` };
  }
  if (["running", "queued"].includes(run.status)) {
    return { ...base, state: "running", nextAction: "wait", reason: "task is already running; watch events" };
  }

  if (run.kind === "repair.run") {
    if (["blocked", "paused", "failed"].includes(run.status) && output.run && items.length) {
      const blocked = items.find((item) => item.status === "blocked");
      // A repair run resumes the same way regardless of whether it stopped on a
      // blocked item or an in-flight (pending/doctor_running/repairing) one, so
      // nextAction is unconditional here. `blocked` still drives the reason
      // string below. (This collapses a former three-branch ternary whose arms
      // all evaluated to "resume_repair".)
      const nextAction = "resume_repair";
      return {
        ...base,
        state: run.status === "paused" ? "paused" : "blocked",
        nextAction,
        safeToRun: true,
        commands: commandList(run.id, true),
        reason: blocked
          ? `${blocked.agentId}: ${blocked.blockers?.[0]?.message || blocked.blockers?.[0]?.id || "blocked"}`
          : "start a child Repair run from original input",
      };
    }
    return { ...base, state: "blocked", nextAction: "inspect_blocker", reason: run.error || "Repair task has no resumable item state" };
  }

  if (run.kind === "doctor") {
    if (["blocked", "failed"].includes(run.status)) {
      return {
        ...base,
        state: "blocked",
        nextAction: "rerun_doctor",
        safeToRun: false,
        commands: commandList(run.id, false),
        reason: run.report?.fails ? `doctor has ${run.report.fails} failing check(s); run the suggested setup or doctor command explicitly` : "doctor is blocked; inspect checks before rerun",
        blockers: run.report?.sections?.flatMap((section) => (section.checks || []).filter((check) => check.status === "fail")) || blockers,
      };
    }
    return base;
  }

  if (run.kind === "ge.command") {
    if (run.status === "failed") {
      const safe = safeGeCommand(run.input?.argv || []);
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "failed command is classified safe to rerun" : "failed command may mutate external state; inspect before rerun",
      };
    }
    return base;
  }

  if (run.kind === "process.command") {
    if (run.status === "failed") {
      const safe = safeProcessCommand(run.input?.argv || []);
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "failed repo-local script is classified safe to rerun" : "failed process command is not classified safe to rerun",
      };
    }
    return base;
  }

  if (run.kind === "harness.run") {
    if (run.status === "failed") {
      const safe = safeHarnessRunInput(run.input || {});
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_harness" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "harness run is classified safe to rerun" : "harness run input is not classified safe to rerun",
      };
    }
    return base;
  }

  if (isDataPipelineNodeKind(run.kind)) {
    if (run.status === "failed") {
      const safe = safePipelineNodeCommand(run.kind, run.input || {});
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? `${run.kind} is classified safe to rerun` : `${run.kind} is not classified safe to rerun`,
      };
    }
    return base;
  }

  if (run.kind === "pipeline.run") {
    const graph = output.graph || {};
    const blockedNode = (graph.nodes || []).find((node) => ["blocked", "failed"].includes(node.status));
    if (["blocked", "paused", "failed"].includes(run.status)) {
      return {
        ...base,
        state: run.status === "paused" ? "paused" : "blocked",
        nextAction: "resume_pipeline",
        safeToRun: true,
        commands: [`ge pipeline resume ${run.id}`, `ge runs events ${run.id} --follow`],
        reason: blockedNode ? `${blockedNode.id}: ${blockedNode.resumePlan?.reason || "blocked"}` : "resume pipeline graph by scheduling a child pipeline run",
        blockers: blockedNode?.resumePlan?.blockers || blockers,
        artifacts: graph.nodes?.flatMap((node) => node.artifacts || []) || artifacts,
      };
    }
    return base;
  }

  return { ...base, state: "blocked", nextAction: "inspect_blocker", reason: `no deterministic resume handler for task kind ${run.kind || "<unset>"}` };
}

export function taskSummary(run) {
  if (!run) return null;
  const events = listEvents(run.id);
  const lastEvent = events.at(-1) || null;
  const output = run.output || {};
  const counts = output.counts || (output.run ? {
    total: output.run.total || 0,
    passed: output.run.passed || 0,
    repaired: output.run.repaired || 0,
    blocked: output.run.blocked || 0,
  } : output.graph?.counts || null);
  const blockedItem = (output.items || []).find((item) => item.status === "blocked");
  const runningItem = (output.items || []).find((item) => ["pending", "doctor_running", "repairing"].includes(item.status));
  const resumePlan = resumePlanFor(run);
  return {
    id: run.id,
    kind: run.kind,
    status: run.status,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    endedAt: run.endedAt || null,
    input: run.input,
    counts,
    lastEvent,
    resumePlan,
    nextAction: resumePlan?.nextAction || blockedItem?.nextAction || runningItem?.nextAction || (["running", "queued"].includes(run.status) ? "wait" : "none"),
    artifactRefs: output.artifactRefs || output.graph?.nodes?.flatMap((node) => node.artifacts || []) || [],
    summary: output.reason || lastEvent?.line || run.error || "",
  };
}

export function taskDetail(run) {
  if (!run) return null;
  return { ...run, summary: taskSummary(run) };
}

export function normalizedTaskSummary(run) {
  const summary = taskSummary(run);
  return summary ? normalizeRuntimeTask(summary) : null;
}

export function normalizedTaskDetail(run) {
  const detail = taskDetail(run);
  return detail ? normalizeRuntimeTask(detail) : null;
}

export function listRunSummaries(limit = 50) {
  return listRuns(limit).map(normalizedTaskSummary).filter(Boolean);
}
