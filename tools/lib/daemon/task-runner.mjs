// tools/lib/daemon/task-runner.mjs — the one process-task execution skeleton.
//
// Every process-backed run kind (ge.command, process.command, the typed
// pipeline-node commands, harness.run) used to carry its own copy of the same
// orchestration: announce `stage_started` → execStream → map exit code →
// emit the terminal event → persist the run — and a second, ~90%-identical
// copy for resume (resume_* terminal events, a resume attempt record, and
// prior output merged in). Five start/resume clone pairs, ~500 LOC of drift
// surface. This module is that skeleton exactly once; the run-kind modules
// keep only what is genuinely theirs (argv derivation, env, safety
// classifiers, artifact inspection).
//
// Behavior is preserved byte-for-byte at the event level: the same event
// types, stages, lines (including the " (resume)" suffix), data payloads,
// resume-attempt records, and output-merge semantics the clones produced.
//
// SCOPE NOTE (local-execution unification): ge.command is the one run-kind
// carved back OUT of this skeleton — command-run.mjs's startGeCommandTask/
// resumeGeCommandTask now bind tools/lib/ge-job-runner.mjs's runSpawnedJob
// instead, so the same primitive also backs the console's daemon-fallback
// local job submission (apps/console/src/server/transport/jobs.mjs, via
// factory-core.mjs). process.command, harness.run, pipeline-node-command, and
// doctor keep this module unchanged: none of them have direct test coverage
// (no test file imports/exercises run-store.mjs, task-runner.mjs, or
// command-run.mjs's process.command path in isolation), so they were left on
// the existing, already-proven skeleton rather than rebound without a safety
// net.
import { execStream } from "../exec-stream.mjs";
import { REPO_ROOT } from "../state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  commandOutput,
  runOutput,
  terminalStatusForCode,
  updateRun,
} from "./run-store.mjs";

const defaultOutput = (result) => commandOutput(result, { preserveMachineStdout: true });

// Run one streamed child process for a task, in start or resume mode.
//
//   run           the persisted run record ({ id, kind, input })
//   stage         event stage label ("job" | "process" | "harness.run" | node stage)
//   startLine     the "$ …" announce line (" (resume)" is appended in resume mode)
//   cmd, args     the spawn target
//   env           environment for the child
//   resume        resume mode: resume_* terminal events + a resume-attempt
//                 record + prior run output merged under the fresh output
//   resumeAction  the resume-attempt action label (e.g. "rerun_command")
//   output        (result) => run output on exit    (default: commandOutput)
//   failureOutput () => extra run output on spawn/stream failure (optional —
//                 harness uses it to persist artifact state even on error)
export function runStreamedTask({
  run,
  stage,
  startLine,
  cmd,
  args,
  env,
  resume = false,
  resumeAction = null,
  output = defaultOutput,
  failureOutput = null,
}) {
  const { id } = run;
  if (resume) updateRun(id, { status: "running", endedAt: null, error: null });
  appendEvent(id, { type: "stage_started", stage, line: resume ? `${startLine} (resume)` : startLine });

  execStream(cmd, args, {
    cwd: REPO_ROOT,
    env,
    meta: { runId: id, stage },
    onEvent: (event) => appendEvent(id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    const doneType = resume ? "resume_done" : "stage_done";
    const failType = resume ? "resume_failed" : "stage_failed";
    appendEvent(id, {
      type: status === "done" ? doneType : failType,
      stage,
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    if (resume) appendResumeAttempt(id, { status, action: resumeAction, code: result.code });
    updateRun(id, {
      status,
      code: result.code,
      endedAt: new Date().toISOString(),
      output: resume ? { ...runOutput(id), ...output(result) } : output(result),
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(id, { type: resume ? "resume_failed" : "stage_failed", stage, level: "error", line });
    if (resume) appendResumeAttempt(id, { status: "failed", action: resumeAction, error: line });
    const extra = failureOutput ? { output: resume ? { ...runOutput(id), ...failureOutput() } : failureOutput() } : {};
    updateRun(id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line, ...extra });
  });

  return run;
}
