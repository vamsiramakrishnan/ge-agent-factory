import { ARTIFACT_PATHS, writeWorkspaceJson, writeWorkspaceText } from "./workspace-contract.js";
import { runWorkspaceDoctor } from "./workspace-doctor.js";

function nowIso() {
  return new Date().toISOString();
}

function uniqTasks(tasks) {
  const seen = new Set();
  return tasks.filter((task) => {
    if (seen.has(task.id)) return false;
    seen.add(task.id);
    return true;
  });
}

function renderRepairReport(report) {
  return [
    "# Workspace Repair",
    "",
    `Workspace: ${report.workspace}`,
    `Stage: ${report.stage}`,
    `Status: ${report.ok ? "pass" : "blocked"}`,
    `Attempts: ${report.attempts.length}`,
    `Generated: ${report.finishedAt}`,
    "",
    "## Attempts",
    ...report.attempts.flatMap((attempt) => [
      `- Attempt ${attempt.index}: ${attempt.doctor.ok ? "pass" : "fail"} (${attempt.doctor.summary.failed} blocker(s))`,
      ...attempt.actions.map((action) => `  - ${action.ok ? "PASS" : "FAIL"} ${action.taskId}: ${action.summary || action.error || "done"}`),
    ]),
    "",
    "## Final Blockers",
    ...(report.finalDoctor.blockers.length
      ? report.finalDoctor.blockers.map((blocker) => `- ${blocker.id}: ${blocker.message}`)
      : ["- none"]),
    "",
  ].join("\n");
}

function defaultAction(task) {
  return {
    taskId: task.id,
    ok: false,
    skipped: true,
    summary: `No executor registered for ${task.id}`,
  };
}

export async function runWorkspaceRepair({
  workspaceDir,
  manifestPath,
  workspaceId,
  repoRoot,
  stage = "preview",
  maxAttempts = 3,
  executors = {},
  source = "repair",
} = {}) {
  if (!workspaceDir || !manifestPath || !workspaceId) {
    throw new Error("workspaceDir, manifestPath, and workspaceId are required");
  }
  const startedAt = nowIso();
  const attempts = [];
  let finalDoctor = null;

  for (let index = 1; index <= maxAttempts; index += 1) {
    const doctor = await runWorkspaceDoctor({ workspaceDir, manifestPath, workspaceId, repoRoot, stage });
    finalDoctor = doctor;
    const attempt = { index, startedAt: nowIso(), doctor, actions: [] };
    attempts.push(attempt);
    if (doctor.ok) break;

    const tasks = uniqTasks(doctor.repairTasks || []);
    if (!tasks.length) break;
    for (const task of tasks) {
      const executor = executors[task.id] || executors[task.owner] || null;
      let action;
      try {
        action = executor ? await executor(task, { doctor, attempt: index, stage }) : defaultAction(task);
      } catch (error) {
        action = {
          taskId: task.id,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
      attempt.actions.push({
        taskId: task.id,
        owner: task.owner,
        command: task.command,
        reason: task.reason,
        ...action,
      });
    }
    attempt.finishedAt = nowIso();
    if (attempt.actions.every((action) => action.skipped || action.ok === false)) break;
  }

  finalDoctor = await runWorkspaceDoctor({ workspaceDir, manifestPath, workspaceId, repoRoot, stage });
  const report = {
    kind: "ge.workspace_repair",
    workspace: workspaceId,
    stage,
    source,
    ok: finalDoctor.ok,
    startedAt,
    finishedAt: nowIso(),
    maxAttempts,
    attempts,
    finalDoctor,
    nextRepairTasks: finalDoctor.repairTasks || [],
  };
  await writeWorkspaceJson(workspaceDir, ARTIFACT_PATHS.workspaceRepair, report);
  await writeWorkspaceText(workspaceDir, ARTIFACT_PATHS.workspaceRepairMarkdown, renderRepairReport(report));
  return report;
}
