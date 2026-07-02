// Verbatim extraction from apps/factory/src/server.js's startAgentRun (see
// REFACTOR-HANDOFF.md §3's "request-body parsing" / prompt-assembly debt item).
// Only call site: startAgentRun, after it resolves plan.skills and before it resolves
// the adapter def / spawns the subprocess.
import { buildHandoffPacket } from "../harness-runtime.js";
import { renderSystemPrompt } from "../systems.js";

export function buildRunPrompt({ project, cwd, repoRoot, agentRecord, run, payload, message, plan }) {
  const promptParts = [
    "# Instructions",
    renderSystemPrompt(),
    "",
    `Project: ${project.name} (${project.id})`,
    `Workspace: ${cwd}`,
    `Repository root: ${repoRoot}`,
  ];
  if (agentRecord) {
    promptParts.push(
      "",
      `# Active Agent`,
      `Agent: ${agentRecord.name} (${agentRecord.id})`,
      `Directory: ${run.agentDirName ? `${run.agentDirName}/` : "./ (workspace root)"}`,
      `Stage: ${agentRecord.stage}`,
      agentRecord.useCaseId ? `Use Case: ${agentRecord.useCaseId}` : "",
      agentRecord.departmentId ? `Department: ${agentRecord.departmentId}` : "",
      "",
      `Write all generated files inside ${cwd}. This is the agent's isolated working directory.`,
      "Workspace-local commands are on PATH: `ge validate`, `ge status`, `factory status`. Do not change directory to the repository root from this sandboxed run.",
    );
  } else {
    promptParts.push("", "Write files for this task inside the workspace unless the user explicitly asks to change the harness repo itself.", "Workspace-local commands are on PATH: `ge validate`, `ge status`, `factory status`.");
  }
  if (payload.task && typeof payload.task === "object") {
    promptParts.push(
      "",
      "# Assigned Task",
      `Task ID: ${payload.task.id}`,
      `Title: ${payload.task.title}`,
      payload.task.goal ? `Goal: ${payload.task.goal}` : "",
      payload.task.priority ? `Priority: ${payload.task.priority}` : "",
      payload.task.description ? `Description:\n${payload.task.description}` : "",
    );
  }
  promptParts.push(
    "",
    buildHandoffPacket({
      receiver: plan.adapterId,
      run,
      project,
      cwd,
      repoRoot,
      userRequest: message,
      task: payload.task,
      plan,
    }),
  );
  return promptParts.filter(Boolean).join("\n");
}
