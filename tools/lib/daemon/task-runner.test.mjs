// tools/lib/daemon/task-runner.test.mjs — unit coverage for runStreamedTask's
// FAILURE paths. Companion to command-run.oracle.test.mjs (which pins the
// happy ge.command sequence); here we exercise the non-zero-exit / launch-
// failure branches and the resume-mode bookkeeping (resume_failed terminal
// event, appendResumeAttempt record, prior-output merge) plus the .catch
// failureOutput merge.
//
// GE_STATE_ROOT must be set BEFORE importing anything that pulls in
// state-paths.mjs (it reads the env once at import time), so this stays
// isolated from any live daemon's .ge/runtime.
import { test, expect } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";

process.env.GE_STATE_ROOT ||= join("/tmp", `ge-task-runner-test-${process.pid}`);

const { runStreamedTask } = await import("./task-runner.mjs");
const { createRun, waitForTaskTerminal, runDir, updateRunOutput } = await import("./run-store.mjs");

const collectTerminal = (id) => {
  const events = [];
  return waitForTaskTerminal(id, { intervalMs: 25, onEvent: ({ event }) => events.push(event) }).then((run) => ({ run, events }));
};

test("start mode: non-zero exit → stage_failed, status failed, exit code persisted", async () => {
  const run = createRun({ kind: "process.command", input: {} });
  runStreamedTask({
    run,
    stage: "process",
    startLine: "$ sh -c 'exit 7'",
    cmd: "sh",
    args: ["-c", "exit 7"],
    env: process.env,
  });

  const { run: finalRun, events } = await collectTerminal(run.id);

  expect(finalRun.status).toBe("failed");
  expect(finalRun.code).toBe(7);
  // default commandOutput(preserveMachineStdout) shape is persisted even on failure.
  expect(typeof finalRun.output?.stdout).toBe("string");
  expect(typeof finalRun.output?.stdoutFull).toBe("string");

  expect(events[0]).toMatchObject({ type: "stage_started", stage: "process", line: "$ sh -c 'exit 7'" });
  const terminal = events.at(-1);
  expect(terminal).toMatchObject({
    type: "stage_failed",
    stage: "process",
    level: "error",
    line: "exit 7",
    data: { code: 7, signal: null },
  });

  rmSync(runDir(run.id), { recursive: true, force: true });
});

test("start mode: missing binary → launch failure surfaces as code 1 / stage_failed", async () => {
  const run = createRun({ kind: "process.command", input: {} });
  runStreamedTask({
    run,
    stage: "process",
    startLine: "$ ge-no-such-binary-xyz",
    cmd: "ge-no-such-binary-xyz-12345",
    args: [],
    env: process.env,
  });

  const { run: finalRun, events } = await collectTerminal(run.id);

  expect(finalRun.status).toBe("failed");
  expect(finalRun.code).toBe(1);
  // execStream names the missing tool in stderr rather than throwing (reject:false).
  expect(finalRun.output?.stderr || "").toContain("failed to launch");
  expect(events.at(-1)).toMatchObject({ type: "stage_failed", level: "error", line: "exit 1", data: { signal: null } });

  rmSync(runDir(run.id), { recursive: true, force: true });
});

test("resume mode: non-zero exit → resume_failed event, resume-attempt record, output merge", async () => {
  const run = createRun({ kind: "process.command", input: {} });
  // Pre-seed prior output so the resume-mode { ...runOutput(id), ...output } merge is observable.
  updateRunOutput(run.id, { priorKey: "kept-through-resume" });

  runStreamedTask({
    run,
    stage: "job",
    startLine: "$ sh -c 'exit 5'",
    cmd: "sh",
    args: ["-c", "exit 5"],
    env: process.env,
    resume: true,
    resumeAction: "rerun_command",
  });

  const { run: finalRun, events } = await collectTerminal(run.id);

  expect(finalRun.status).toBe("failed");
  expect(finalRun.code).toBe(5);

  // resume announce line carries the " (resume)" suffix.
  expect(events.find((ev) => ev.type === "stage_started")?.line).toBe("$ sh -c 'exit 5' (resume)");
  const terminal = events.filter((ev) => ev.type === "resume_failed" || ev.type === "resume_done").at(-1);
  expect(terminal).toMatchObject({ type: "resume_failed", stage: "job", level: "error", line: "exit 5", data: { code: 5, signal: null } });

  // resume-attempt bookkeeping: one record with the failing status + action + code.
  expect(Array.isArray(finalRun.output?.resumeAttempts)).toBe(true);
  expect(finalRun.output.resumeAttempts).toHaveLength(1);
  expect(finalRun.output.resumeAttempts[0]).toMatchObject({ status: "failed", action: "rerun_command", code: 5 });

  // prior output survived the merge, fresh output layered on top.
  expect(finalRun.output.priorKey).toBe("kept-through-resume");
  expect(typeof finalRun.output.stdout).toBe("string");

  rmSync(runDir(run.id), { recursive: true, force: true });
});

test(".catch path: stream/output error → failureOutput is merged into the persisted run", async () => {
  // execStream resolves rather than rejects (reject:false), so the only reliable
  // way to reach the .catch without process mocking is an output() callback that
  // throws while building the terminal updateRun — that rejects the .then chain.
  const run = createRun({ kind: "harness.run", input: {} });
  updateRunOutput(run.id, { priorArtifact: "kept" });

  runStreamedTask({
    run,
    stage: "harness.run",
    startLine: "$ sh -c 'exit 0'",
    cmd: "sh",
    args: ["-c", "exit 0"],
    env: process.env,
    resume: true,
    resumeAction: "rerun_harness",
    output: () => { throw new Error("boom-output"); },
    failureOutput: () => ({ artifactState: "persisted-on-error" }),
  });

  const { run: finalRun } = await collectTerminal(run.id);

  expect(finalRun.status).toBe("failed");
  expect(finalRun.code).toBe(1);
  expect(finalRun.error).toContain("boom-output");
  // failureOutput() result is merged over prior output on the error path.
  expect(finalRun.output?.artifactState).toBe("persisted-on-error");
  expect(finalRun.output?.priorArtifact).toBe("kept");
  // a failed resume-attempt record carrying the error was appended.
  const failedAttempt = (finalRun.output?.resumeAttempts || []).find((a) => a.status === "failed");
  expect(failedAttempt).toMatchObject({ action: "rerun_harness" });
  expect(failedAttempt.error).toContain("boom-output");

  rmSync(runDir(run.id), { recursive: true, force: true });
});
