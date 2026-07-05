// Behavior parity oracle for the ge.command run-kind (local-execution
// unification blueprint §5: capture the exact observable event/run-record
// sequence BEFORE moving startGeCommandTask/resumeGeCommandTask off
// runStreamedTask onto the shared ge-job-runner.mjs primitive, then hold this
// file to that capture, unmodified, after the rewire.
//
// Spawns the real `ge ledger --help` CLI (cheap, deterministic, exit 0,
// stdout containing "USAGE" — the same invocation apps/console/src/server/
// transport-oracle.test.mjs already relies on for its local-fallback oracle).
// Isolated under a scratch GE_STATE_ROOT so this doesn't compete with a live
// daemon's .ge/runtime — state-paths.mjs reads GE_STATE_ROOT once at import
// time, so it must be set before command-run.mjs (or anything it imports) is
// ever loaded in this process.
import { test, expect } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";

process.env.GE_STATE_ROOT ||= join("/tmp", `ge-command-run-oracle-${process.pid}`);

const { startGeCommandTask, resumeGeCommandTask } = await import("./command-run.mjs");
const { waitForTaskTerminal, runDir } = await import("./run-store.mjs");

const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function stripTs({ ts, ...rest }) {
  return rest;
}

test("oracle: ge.command spawn/event/exit sequence", async () => {
  const run = startGeCommandTask({ argv: ["ledger", "--help"] });
  expect(run.kind).toBe("ge.command");
  expect(run.status).toBe("running");

  const events = [];
  const finalRun = await waitForTaskTerminal(run.id, {
    intervalMs: 25,
    onEvent: ({ event }) => events.push(event),
  });

  expect(finalRun.status).toBe("done");
  expect(finalRun.code).toBe(0);
  expect(finalRun.error).toBeUndefined();
  expect(finalRun.output?.stdout || "").toContain("USAGE");
  expect(typeof finalRun.output?.stdoutFull).toBe("string");

  // Announce: no `data`, `ts` is stamped by run-store's appendEvent (not the
  // event object itself).
  expect(stripTs(events[0])).toEqual({ type: "stage_started", stage: "job", line: "$ ge ledger --help" });
  expect(events[0].ts).toMatch(ISO_TS);

  // Terminal: daemon-shaped — carries data:{code,signal}.
  const terminal = events.at(-1);
  expect(stripTs(terminal)).toEqual({
    type: "stage_done",
    stage: "job",
    level: "info",
    line: "exit 0",
    data: { code: 0, signal: null },
  });
  expect(terminal.ts).toMatch(ISO_TS);

  // Everything in between is the CLI's own streamed stdout.
  const middle = events.slice(1, -1);
  expect(middle.length).toBeGreaterThan(0);
  for (const ev of middle) {
    expect(ev.type).toBe("log");
    expect(ev.stage).toBe("job");
    expect(ev.runId).toBe(run.id);
  }
  expect(middle.map((ev) => ev.line).join("\n")).toContain("USAGE");

  rmSync(runDir(run.id), { recursive: true, force: true });
});

test("oracle: ge.command resume sequence — resume_done, appendResumeAttempt, output merge", async () => {
  const run = startGeCommandTask({ argv: ["ledger", "--help"] });
  await waitForTaskTerminal(run.id, { intervalMs: 25 });

  const events = [];
  resumeGeCommandTask(run);
  const finalRun = await waitForTaskTerminal(run.id, {
    intervalMs: 25,
    onEvent: ({ event }) => events.push(event),
  });

  expect(finalRun.status).toBe("done");
  expect(finalRun.code).toBe(0);
  expect(Array.isArray(finalRun.output?.resumeAttempts)).toBe(true);
  expect(finalRun.output.resumeAttempts).toHaveLength(1);
  expect(finalRun.output.resumeAttempts[0]).toMatchObject({ status: "done", action: "rerun_command", code: 0 });
  // The resume run still carries the (merged-in) prior stdout output.
  expect(finalRun.output.stdout || "").toContain("USAGE");

  const announce = events.find((ev) => ev.type === "stage_started" && ev.line?.endsWith("(resume)"));
  expect(announce).toMatchObject({ stage: "job", line: "$ ge ledger --help (resume)" });

  const terminal = events.filter((ev) => ev.type === "resume_done" || ev.type === "resume_failed").at(-1);
  expect(stripTs(terminal)).toEqual({
    type: "resume_done",
    stage: "job",
    level: "info",
    line: "exit 0",
    data: { code: 0, signal: null },
  });

  rmSync(runDir(run.id), { recursive: true, force: true });
});
