// tools/lib/daemon/mission-node-run.mjs — the "mission-node-command"
// run-kind: the typed data-mission nodes (mock.generate, snowfakery.generate,
// simulator.seed, simulator.validate, ...) whose exact spawn command is
// derived from the node registry (mission-node-registry.mjs) rather than
// caller-supplied argv, unlike the ge-command/process-command run-kinds.
// The execution skeleton lives in task-runner.mjs; this module only derives
// the command.
import { missionNodeCommand } from "../mission/mission-node-registry.mjs";
import { runtimeEnv } from "./command-run.mjs";
import { runStreamedTask } from "./task-runner.mjs";
import { createRun, newTaskId } from "./run-store.mjs";

function nodeExecution(command) {
  return {
    stage: command.stage,
    startLine: `$ ${command.argv.join(" ")}`,
    cmd: command.cmd,
    args: command.args,
    env: runtimeEnv(),
  };
}

export function startMissionNodeCommandTask(kind, input = {}) {
  const command = missionNodeCommand(kind, input);
  const run = createRun({ id: newTaskId(command.prefix), kind, input });
  return runStreamedTask({ run, ...nodeExecution(command) });
}

export function resumeMissionNodeCommandTask(run) {
  const command = missionNodeCommand(run.kind, run.input || {});
  runStreamedTask({ run, resume: true, resumeAction: `rerun_${run.kind}`, ...nodeExecution(command) });
}
