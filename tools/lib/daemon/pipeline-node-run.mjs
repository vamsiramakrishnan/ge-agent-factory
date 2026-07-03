// tools/lib/daemon/pipeline-node-run.mjs — the "pipeline-node-command"
// run-kind: the typed data-pipeline nodes (mock.generate, snowfakery.generate,
// simulator.seed, simulator.validate, ...) whose exact spawn command is
// derived from the node registry (pipeline-node-registry.mjs) rather than
// caller-supplied argv, unlike the ge-command/process-command run-kinds.
// The execution skeleton lives in task-runner.mjs; this module only derives
// the command.
import { pipelineNodeCommand } from "../pipeline/pipeline-node-registry.mjs";
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

export function startPipelineNodeCommandTask(kind, input = {}) {
  const command = pipelineNodeCommand(kind, input);
  const run = createRun({ id: newTaskId(command.prefix), kind, input });
  return runStreamedTask({ run, ...nodeExecution(command) });
}

export function resumePipelineNodeCommandTask(run) {
  const command = pipelineNodeCommand(run.kind, run.input || {});
  runStreamedTask({ run, resume: true, resumeAction: `rerun_${run.kind}`, ...nodeExecution(command) });
}
