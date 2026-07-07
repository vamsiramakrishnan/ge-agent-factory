// Unit coverage for resumePlanFor — the cross-run-kind resume-plan dispatcher.
// resumePlanFor(run) is a pure function of the run record (it consults each
// run-kind's safe* classifier but touches no filesystem), so we exercise every
// kind/status branch with hand-built run fixtures. taskSummary/taskDetail and
// the normalized/list variants read from the run-store and are covered
// elsewhere; this file holds the classifier honest.
import { test, expect, describe } from "bun:test";
import { resumePlanFor } from "./resume-plan.mjs";

describe("resumePlanFor: terminal and in-flight statuses (kind-independent)", () => {
  test("null run returns null", () => {
    expect(resumePlanFor(null)).toBeNull();
    expect(resumePlanFor(undefined)).toBeNull();
  });

  for (const status of ["done", "skipped"]) {
    test(`${status} run needs no resume action`, () => {
      const plan = resumePlanFor({ id: "r1", kind: "ge.command", status });
      expect(plan.state).toBe(status);
      expect(plan.nextAction).toBe("none");
      expect(plan.safeToRun).toBe(false);
      expect(plan.reason).toContain(`is ${status}`);
      // no "ge runs resume" command when not safe to run
      expect(plan.commands.some((c) => c.includes("resume"))).toBe(false);
    });
  }

  for (const status of ["running", "queued"]) {
    test(`${status} run tells the caller to wait and watch events`, () => {
      const plan = resumePlanFor({ id: "r1", kind: "pipeline.run", status });
      expect(plan.state).toBe("running");
      expect(plan.nextAction).toBe("wait");
      expect(plan.commands.at(-1)).toContain("--follow");
    });
  }
});

describe("resumePlanFor: repair.run", () => {
  test("blocked with a blocked item is safe to resume and surfaces the blocker reason", () => {
    const plan = resumePlanFor({
      id: "rep1",
      kind: "repair.run",
      status: "blocked",
      output: {
        run: { total: 3 },
        items: [
          { agentId: "agent-a", status: "blocked", blockers: [{ id: "b1", message: "needs approval" }] },
        ],
      },
    });
    expect(plan.state).toBe("blocked");
    expect(plan.nextAction).toBe("resume_repair");
    expect(plan.safeToRun).toBe(true);
    expect(plan.reason).toBe("agent-a: needs approval");
    expect(plan.commands.some((c) => c.includes("ge runs resume rep1"))).toBe(true);
    // blockers are aggregated from item.blockers
    expect(plan.blockers).toEqual([{ id: "b1", message: "needs approval" }]);
  });

  test("paused run reports paused state but is still resumable", () => {
    const plan = resumePlanFor({
      id: "rep2",
      kind: "repair.run",
      status: "paused",
      output: { run: {}, items: [{ agentId: "a", status: "repairing" }] },
    });
    expect(plan.state).toBe("paused");
    expect(plan.nextAction).toBe("resume_repair");
    expect(plan.safeToRun).toBe(true);
  });

  test("no blocked item (only in-flight work) resumes from original input", () => {
    const plan = resumePlanFor({
      id: "rep3",
      kind: "repair.run",
      status: "failed",
      output: { run: {}, items: [{ agentId: "a", status: "pending" }] },
    });
    expect(plan.nextAction).toBe("resume_repair");
    expect(plan.reason).toBe("start a child Repair run from original input");
  });

  test("failed with no resumable item state falls back to inspect_blocker", () => {
    const plan = resumePlanFor({ id: "rep4", kind: "repair.run", status: "failed", error: "boom", output: {} });
    expect(plan.state).toBe("blocked");
    expect(plan.nextAction).toBe("inspect_blocker");
    expect(plan.reason).toBe("boom");
    expect(plan.safeToRun).toBe(false);
  });
});

describe("resumePlanFor: doctor", () => {
  test("blocked doctor with failing checks recommends rerun but is not auto-safe", () => {
    const plan = resumePlanFor({
      id: "d1",
      kind: "doctor",
      status: "blocked",
      report: {
        fails: 2,
        sections: [{ checks: [{ status: "fail", id: "bun" }, { status: "pass", id: "uv" }] }],
      },
    });
    expect(plan.nextAction).toBe("rerun_doctor");
    expect(plan.safeToRun).toBe(false);
    expect(plan.reason).toContain("2 failing check");
    // only failing checks are surfaced as blockers
    expect(plan.blockers).toEqual([{ status: "fail", id: "bun" }]);
  });

  test("healthy/other-status doctor returns the base plan (no action)", () => {
    const plan = resumePlanFor({ id: "d2", kind: "doctor", status: "done_ish" });
    expect(plan.nextAction).toBe("none");
    expect(plan.safeToRun).toBe(false);
  });
});

describe("resumePlanFor: command kinds classify safe-to-rerun", () => {
  test("ge.command failed & read-only is safe to rerun", () => {
    const plan = resumePlanFor({ id: "g1", kind: "ge.command", status: "failed", input: { argv: ["runs", "list"] } });
    expect(plan.nextAction).toBe("rerun_task");
    expect(plan.safeToRun).toBe(true);
  });

  test("ge.command failed & mutating is NOT safe to rerun", () => {
    const plan = resumePlanFor({ id: "g2", kind: "ge.command", status: "failed", input: { argv: ["deploy", "prod"] } });
    expect(plan.nextAction).toBe("inspect_blocker");
    expect(plan.safeToRun).toBe(false);
  });

  test("process.command safe allowlisted script vs arbitrary command", () => {
    const safe = resumePlanFor({
      id: "p1", kind: "process.command", status: "failed",
      input: { argv: ["node", "apps/factory/scripts/plan-mock-data.mjs"] },
    });
    expect(safe.safeToRun).toBe(true);
    const unsafe = resumePlanFor({
      id: "p2", kind: "process.command", status: "failed", input: { argv: ["rm", "-rf", "/"] },
    });
    expect(unsafe.safeToRun).toBe(false);
    expect(unsafe.nextAction).toBe("inspect_blocker");
  });

  test("harness.run safe input vs empty input", () => {
    const safe = resumePlanFor({ id: "h1", kind: "harness.run", status: "failed", input: { message: "review this" } });
    expect(safe.nextAction).toBe("rerun_harness");
    expect(safe.safeToRun).toBe(true);
    const unsafe = resumePlanFor({ id: "h2", kind: "harness.run", status: "failed", input: {} });
    expect(unsafe.safeToRun).toBe(false);
  });

  test("data pipeline node kind (mock.generate) with unclassifiable input is inspect-only", () => {
    const plan = resumePlanFor({ id: "n1", kind: "mock.generate", status: "failed", input: {} });
    expect(plan.state).toBe("blocked");
    expect(plan.nextAction).toBe("inspect_blocker");
    expect(plan.safeToRun).toBe(false);
    expect(plan.reason).toContain("mock.generate");
  });
});

describe("resumePlanFor: pipeline.run", () => {
  test("blocked pipeline resumes the graph and surfaces the blocked node", () => {
    const plan = resumePlanFor({
      id: "pl1",
      kind: "pipeline.run",
      status: "blocked",
      output: {
        graph: {
          nodes: [
            { id: "node-a", status: "done", artifacts: [{ name: "a" }] },
            { id: "node-b", status: "blocked", resumePlan: { reason: "waiting on seed", blockers: [{ id: "seed" }] }, artifacts: [{ name: "b" }] },
          ],
        },
      },
    });
    expect(plan.nextAction).toBe("resume_pipeline");
    expect(plan.safeToRun).toBe(true);
    expect(plan.reason).toBe("node-b: waiting on seed");
    expect(plan.commands[0]).toContain("ge pipeline resume pl1");
    expect(plan.blockers).toEqual([{ id: "seed" }]);
    // artifacts flatten across all nodes
    expect(plan.artifacts.map((a) => a.name)).toEqual(["a", "b"]);
  });

  test("running pipeline (via base branch) does not offer resume", () => {
    const plan = resumePlanFor({ id: "pl2", kind: "pipeline.run", status: "done", output: { graph: { nodes: [] } } });
    expect(plan.nextAction).toBe("none");
  });
});

describe("resumePlanFor: unknown kind and aggregation", () => {
  test("unknown kind yields a deterministic inspect_blocker fallback", () => {
    const plan = resumePlanFor({ id: "x1", kind: "mystery.kind", status: "failed" });
    expect(plan.nextAction).toBe("inspect_blocker");
    expect(plan.reason).toContain("no deterministic resume handler");
    expect(plan.reason).toContain("mystery.kind");
  });

  test("unset kind is named <unset> in the fallback reason", () => {
    const plan = resumePlanFor({ id: "x2", status: "failed" });
    expect(plan.reason).toContain("<unset>");
  });

  test("blockers merge item-level and output-level entries", () => {
    const plan = resumePlanFor({
      id: "x3",
      kind: "mystery.kind",
      status: "failed",
      output: {
        items: [{ blockers: [{ id: "item-blocker" }] }],
        blockers: [{ id: "output-blocker" }],
        artifactRefs: [{ name: "art" }],
      },
    });
    expect(plan.blockers).toEqual([{ id: "item-blocker" }, { id: "output-blocker" }]);
    expect(plan.artifacts).toEqual([{ name: "art" }]);
  });
});
