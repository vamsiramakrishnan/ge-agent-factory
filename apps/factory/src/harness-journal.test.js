import { describe, test, expect } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openJournal, recordRun } from "./harness-journal.js";

describe("harness-journal", () => {
  test("openJournal logs partial then complete line", () => {
    const runsDir = mkdtempSync(join(tmpdir(), "journal-test-"));
    try {
      const journal = openJournal(runsDir, { runId: "run1", agentId: "agent1", stage: "build" });
      journal.log("stdout", "hel");
      journal.log("stdout", "lo\n");

      const lines = readFileSync(journal.file, "utf8").trim().split("\n");
      expect(lines.length).toBe(1);
      const event = JSON.parse(lines[0]);
      expect(event.line).toBe("hello");
      expect(event.type).toBe("log");
      expect(event.level).toBe("info");
      expect(event.data.stream).toBe("stdout");
      expect(event.runId).toBe("run1");
      expect(event.agentId).toBe("agent1");
      expect(event.stage).toBe("build");
    } finally {
      rmSync(runsDir, { recursive: true, force: true });
    }
  });

  test("openJournal appends custom events", () => {
    const runsDir = mkdtempSync(join(tmpdir(), "journal-test-"));
    try {
      const journal = openJournal(runsDir, { runId: "run2", agentId: "agent2", stage: "test" });
      journal.log("stdout", "line1\n");
      journal.event({ type: "stage_done", level: "info" });

      const lines = readFileSync(journal.file, "utf8").trim().split("\n");
      expect(lines.length).toBe(2);
      const ev1 = JSON.parse(lines[0]);
      expect(ev1.line).toBe("line1");
      const ev2 = JSON.parse(lines[1]);
      expect(ev2.type).toBe("stage_done");
      expect(ev2.level).toBe("info");
      expect(ev2.runId).toBe("run2");
    } finally {
      rmSync(runsDir, { recursive: true, force: true });
    }
  });

  test("recordRun upserts into index.json", () => {
    const runsDir = mkdtempSync(join(tmpdir(), "journal-test-"));
    try {
      recordRun(runsDir, { runId: "run3", agentId: "agent3", stage: "deploy", status: "running" });
      const idx = join(runsDir, "index.json");
      let all = JSON.parse(readFileSync(idx, "utf8"));
      expect(all.length).toBe(1);
      expect(all[0].status).toBe("running");

      // Update same runId+stage
      recordRun(runsDir, { runId: "run3", agentId: "agent3", stage: "deploy", status: "done", exitCode: 0 });
      all = JSON.parse(readFileSync(idx, "utf8"));
      expect(all.length).toBe(1);
      expect(all[0].status).toBe("done");
      expect(all[0].exitCode).toBe(0);

      // Different stage
      recordRun(runsDir, { runId: "run3", agentId: "agent3", stage: "test", status: "done" });
      all = JSON.parse(readFileSync(idx, "utf8"));
      expect(all.length).toBe(2);
    } finally {
      rmSync(runsDir, { recursive: true, force: true });
    }
  });
});
