// Verbatim extraction from apps/factory/src/server.js's startAgentRun (see
// REFACTOR-HANDOFF.md §3's "ADK subprocess spawn/parse, SSE event emission" debt item).
// Only call site: startAgentRun, as its final step (after the prompt/adapter/secrets are
// resolved) — spawns the harness adapter's child process, wires up its stdout/stderr/
// close/error handlers through the output parser into SSE "agent"/"status"/"error"/"end"
// events, and enforces the run's optional timeout/grace-kill.
//
// All server.js module state the original inline code closed over (buildWorkspaceEnv,
// emit/finish, terminateChild, appendActivity, REPO_ROOT, DATA_ROOT) is passed in
// explicitly rather than imported, so this module has no implicit dependency on server.js.
import { spawn } from "node:child_process";
import { createOutputParser, detectFormat } from "../output-parsers.js";
import { spawnEnvForAgent } from "../agents.js";

export function spawnAndStreamAgentSubprocess({
  def,
  prompt,
  cwd,
  payload,
  plan,
  project,
  run,
  workspaceBin,
  secretEnv,
  repoRoot,
  requestedAgentId,
  agentRecord,
  heartbeatPolicy,
  buildWorkspaceEnv,
  emit,
  finish,
  terminateChild,
  appendActivity,
}) {
  const args = def.buildArgs(prompt, { cwd, model: payload.model || "default", permissionProfile: plan.permissionProfile.id });
  const child = spawn(def.resolvedBin, args, {
    cwd,
    env: buildWorkspaceEnv({
      GE_HARNESS_DAEMON_URL: payload.daemonUrl || "",
      GE_HARNESS_RUN_ID: run.id,
      GE_HARNESS_PROJECT_ID: project.id,
      GE_HARNESS_WORKSPACE: cwd,
      GE_HARNESS_BIN: workspaceBin,
      GE_HARNESS_REPO_ROOT: repoRoot,
      // Adapter-specific spawn env (claude's IS_SANDBOX under root) — the same
      // helper the daemon spawn path uses, so bypassPermissions never refuses on
      // this console-server path while succeeding on the daemon one.
      ...spawnEnvForAgent(def),
      ...secretEnv,
    }, cwd),
    stdio: ["pipe", "pipe", "pipe"],
  });
  run.child = child;
  emit(run, "plan", {
    adapterId: plan.adapterId,
    adapterName: plan.adapterName,
    requestedAgentId,
    fallbackFrom: plan.fallbackFrom,
    selectionReason: plan.selectionReason,
    permissionProfile: plan.permissionProfile.id,
    requestedCapabilities: plan.requestedCapabilities,
    skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
    ownedPaths: plan.ownedPaths,
    avoidPaths: plan.avoidPaths,
  });
  emit(run, "status", { label: "spawned", agentId: def.id, pid: child.pid });
  appendActivity("run.started", {
    projectId: project.id,
    entityType: "run",
    entityId: run.id,
    payload: {
      agentId: def.id,
      requestedAgentId,
      permissionProfile: plan.permissionProfile.id,
      requestedCapabilities: plan.requestedCapabilities,
      skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
      fallbackFrom: plan.fallbackFrom,
      selectedAgentId: agentRecord?.id || null,
      taskId: payload.task?.id || payload.taskId || null,
      wakeupReason: run.wakeupReason,
      secretNames: Object.keys(secretEnv),
    },
  });

  const timeoutSec = Number(payload.timeoutSec || heartbeatPolicy?.timeoutSec || 0);
  const graceSec = Number(payload.graceSec ?? heartbeatPolicy?.graceSec ?? 10);
  let forceTimer = null;
  const timeoutTimer = timeoutSec > 0 ? setTimeout(() => {
    emit(run, "error", { code: "RUN_TIMEOUT", message: `run exceeded ${timeoutSec}s timeout` });
    terminateChild(child, "SIGTERM");
    if (graceSec >= 0) {
      forceTimer = setTimeout(() => terminateChild(child, "SIGKILL"), graceSec * 1000);
      forceTimer.unref?.();
    }
  }, timeoutSec * 1000) : null;
  timeoutTimer?.unref?.();

  if (def.promptViaStdin) {
    child.stdin.end(prompt);
  }

  const outputFormat = def.streamFormat === "json-lines" ? detectFormat(def.id) : "plain";
  const parser = createOutputParser(outputFormat);

  child.stdout.on("data", (chunk) => {
    const events = parser.feed(chunk.toString("utf8"));
    for (const ev of events) {
      if (ev.kind === "text") emit(run, "agent", { type: "text_delta", delta: ev.text });
      else if (ev.kind === "thinking") emit(run, "agent", { type: "thinking", delta: ev.text });
      else if (ev.kind === "tool_use") emit(run, "agent", { type: "tool_use", eventType: "tool_call_made", name: ev.name, id: ev.id, raw: ev });
      else if (ev.kind === "tool_result") emit(run, "agent", { type: "tool_result", eventType: "tool_call_result", toolUseId: ev.toolUseId, delta: ev.content, isError: ev.isError });
      else if (ev.kind === "error") emit(run, "agent", { type: "stderr", delta: ev.text || "" });
      else if (ev.kind === "status") emit(run, "status", { label: ev.label, runId: run.id });
      else if (ev.kind === "usage") emit(run, "agent", { type: "usage", inputTokens: ev.inputTokens, outputTokens: ev.outputTokens, costUsd: ev.costUsd });
      else if (ev.kind === "raw") emit(run, "agent", { type: "json_event", raw: ev.raw, delta: JSON.stringify(ev.raw) });
    }
  });
  child.stderr.on("data", (chunk) => {
    emit(run, "agent", { type: "stderr", delta: chunk.toString("utf8") });
  });
  child.on("error", (error) => {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (forceTimer) clearTimeout(forceTimer);
    emit(run, "error", { code: "SPAWN_FAILED", message: error.message });
    finish(run, "failed", 1);
  });
  child.on("close", (code, signal) => {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (forceTimer) clearTimeout(forceTimer);
    for (const ev of parser.flush()) {
      if (ev.kind === "text") emit(run, "agent", { type: "text_delta", delta: ev.text });
      else emit(run, "agent", { type: "json_event", raw: ev.raw || ev, delta: ev.text || "" });
    }
    if (run.cancelRequested) {
      finish(run, "canceled", code, signal || "SIGTERM");
      return;
    }
    const timedOut = run.events.some((event) => event.event === "error" && event.data?.code === "RUN_TIMEOUT");
    finish(run, timedOut ? "failed" : code === 0 ? "succeeded" : "failed", code, signal);
  });
  return run;
}
