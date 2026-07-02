// tools/lib/daemon/mission-node-run.mjs — the "mission-node-command"
// run-kind: the typed data-mission nodes (mock.generate, snowfakery.generate,
// simulator.seed, simulator.validate, ...) whose exact spawn command is
// derived from the node registry (mission-node-registry.mjs) rather than
// caller-supplied argv, unlike the ge-command/process-command run-kinds.
// Moved verbatim out of tools/lib/runtime-daemon.mjs.
import { execStream } from "../exec-stream.mjs";
import { REPO_ROOT } from "../state-paths.mjs";
import { missionNodeCommand } from "../mission/mission-node-registry.mjs";
import { runtimeEnv } from "./command-run.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  commandOutput,
  createRun,
  newTaskId,
  runOutput,
  terminalStatusForCode,
  updateRun,
} from "./run-store.mjs";

export function startMissionNodeCommandTask(kind, input = {}) {
  const command = missionNodeCommand(kind, input);
  const run = createRun({
    id: newTaskId(command.prefix),
    kind,
    input,
  });
  appendEvent(run.id, { type: "stage_started", stage: command.stage, line: `$ ${command.argv.join(" ")}` });

  execStream(command.cmd, command.args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: command.stage },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "stage_done" : "stage_failed",
      stage: command.stage,
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: commandOutput(result, { preserveMachineStdout: true }) });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "stage_failed", stage: command.stage, level: "error", line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });

  return run;
}

export function resumeMissionNodeCommandTask(run) {
  const command = missionNodeCommand(run.kind, run.input || {});
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: command.stage, line: `$ ${command.argv.join(" ")} (resume)` });
  execStream(command.cmd, command.args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: command.stage },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "resume_done" : "resume_failed",
      stage: command.stage,
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    appendResumeAttempt(run.id, { status, action: `rerun_${run.kind}`, code: result.code });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), ...commandOutput(result, { preserveMachineStdout: true }) } });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "resume_failed", stage: command.stage, level: "error", line });
    appendResumeAttempt(run.id, { status: "failed", action: `rerun_${run.kind}`, error: line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });
}
