import { describe, expect, test } from "bun:test";
import { agents, jsonWatchFrame, streamStatusSnapshotsUntilTerminal } from "./agents.mjs";

describe("ge agents command registration", () => {
  test("leaf commands expose citty run handlers", () => {
    for (const name of ["register", "track", "build", "resume", "status", "logs", "sync"]) {
      expect(typeof agents.subCommands[name]?.run).toBe("function");
    }
  });
});

describe("ge agents JSON watch stream", () => {
  test("status snapshots are emitted before the terminal result returns", async () => {
    const snapshots = [
      { terminal: false, tally: { running: 1 }, perRun: [{ runId: "run-1", stage: "validate", status: "running" }] },
      { terminal: true, tally: { done: 1 }, perRun: [{ runId: "run-1", stage: "preview", status: "done" }] },
    ];
    const lines = [];
    const final = await streamStatusSnapshotsUntilTerminal({ project: "demo" }, {
      intervalMs: 0,
      write: (line) => lines.push(JSON.parse(line)),
      status: async () => snapshots.shift(),
      kind: "ge.agents.build.status",
    });
    expect(final.terminal).toBe(true);
    expect(lines.map((line) => line.kind)).toEqual(["ge.agents.build.status", "ge.agents.build.status"]);
    expect(lines[0].status.terminal).toBe(false);
    expect(lines[1].status.terminal).toBe(true);
  });

  test("jsonWatchFrame carries a stable kind and payload fields", () => {
    const frame = jsonWatchFrame("ge.agents.build.submitted", { submission: { submitted: 1 } });
    expect(frame.kind).toBe("ge.agents.build.submitted");
    expect(frame.submission.submitted).toBe(1);
    expect(Date.parse(frame.ts)).not.toBeNaN();
  });
});
