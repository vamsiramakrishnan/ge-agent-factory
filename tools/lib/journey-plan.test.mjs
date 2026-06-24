import { describe, expect, test } from "bun:test";
import { buildJourneyPlan } from "./journey-plan.mjs";

describe("journey plan", () => {
  test("builds user-facing stages over the mission graph", () => {
    const journey = buildJourneyPlan({
      scenario: "benefits-enrollment",
      spec: ".ge/interviews/benefits-enrollment/agent-spec.json",
      systems: ["workday"],
      ids: ["benefits-agent"],
      mode: "local",
    });

    expect(journey.kind).toBe("ge.journey.plan");
    expect(journey.stages.map((stage) => stage.id)).toEqual(["interview", "spec", "data", "simulator", "build", "eval", "preview", "deploy"]);
    expect(journey.stages.find((stage) => stage.id === "spec").nodeIds).toContain("antigravity.spec-data-review");
    expect(journey.stages.find((stage) => stage.id === "spec").actionPlan.route).toBe("#/spec-review/benefits-enrollment");
    expect(journey.stages.find((stage) => stage.id === "spec").actionPlan.artifactPath).toBe(".ge/interviews/benefits-enrollment/agent-spec.json");
    expect(journey.stages.find((stage) => stage.id === "data").nodeIds).toEqual(["mock.generate", "snowfakery.generate"]);
    expect(journey.stages.find((stage) => stage.id === "simulator").nodeIds).toEqual(["simulator.seed", "simulator.validate"]);
    expect(journey.stages.find((stage) => stage.id === "build").actionPlan.commands[0]).toBe("ge agents build --ids benefits-agent --local");
  });

  test("projects blocked mission runtime state onto the user journey", () => {
    const graph = {
      id: "mission-1",
      nodes: [
        { id: "preflight.doctor", status: "done", artifacts: [] },
        { id: "mock.generate", status: "blocked", blockers: [{ id: "missing-usecase", message: "Use case not found" }], resumePlan: { commands: ["ge mission resume mission-1"] }, artifacts: [] },
      ],
    };
    const journey = buildJourneyPlan({
      scenario: "benefits-enrollment",
      tasks: [{ id: "mission-1", kind: "mission.run", status: "blocked", output: { graph }, summary: { resumePlan: { commands: ["ge mission resume mission-1"] } } }],
      includePlannedMission: false,
    });
    const data = journey.stages.find((stage) => stage.id === "data");

    expect(journey.status).toBe("blocked");
    expect(journey.next.id).toBe("data");
    expect(data.status).toBe("blocked");
    expect(data.blocker.message).toBe("Use case not found");
    expect(data.actionPlan.kind).toBe("resume_mission");
    expect(data.actionPlan.taskId).toBe("mission-1");
  });

  test("projects interview harness runtime state", () => {
    const journey = buildJourneyPlan({
      usecaseId: "new-procurement-agent",
      tasks: [{
        id: "harness-1",
        kind: "harness.run",
        status: "failed",
        input: { stage: "interview,spec_generation" },
        summary: "model error",
        resumePlan: { safeToRun: true, commands: ["ge runtime resume harness-1"], reason: "retry model error" },
      }],
      includePlannedMission: false,
    });
    const interview = journey.stages.find((stage) => stage.id === "interview");

    expect(interview.status).toBe("failed");
    expect(interview.blocker.message).toBe("retry model error");
    expect(interview.actionPlan.kind).toBe("resume_harness");
  });

  test("spec review route can target a selected catalog id instead of the scenario alias", () => {
    const journey = buildJourneyPlan({
      scenario: "benefits-enrollment",
      usecaseId: "benefits-q-a-enrollment",
      ids: ["benefits-q-a-enrollment"],
      includePlannedMission: false,
    });
    const spec = journey.stages.find((stage) => stage.id === "spec");

    expect(spec.actionPlan.route).toBe("#/spec-review/benefits-q-a-enrollment");
    expect(spec.actionPlan.artifactPath).toBe(".ge/interviews/benefits-q-a-enrollment/agent-spec.json");
  });

  test("fleet enrichment respects selected agent ids", () => {
    const fleet = {
      total: 2,
      health: {
        agents: [
          { id: "a1", stage: "spec", healthStatus: "missing", actionPlan: { kind: "build_agents" } },
          { id: "a2", stage: "spec", healthStatus: "missing", actionPlan: { kind: "build_agents" } },
        ],
      },
    };
    const journey = buildJourneyPlan({ ids: ["a2"], fleet, includePlannedMission: false });
    const build = journey.stages.find((stage) => stage.id === "build");

    expect(build.actionPlan.commands[0]).toBe("ge agents build --ids a2");
    expect(build.actionPlan.agentIds).toEqual(["a2"]);
  });

  test("preview-ready local workspace makes ship the next pipeline action", () => {
    const fleet = {
      total: 1,
      health: {
        agents: [
          {
            id: "audit-report-generator",
            workspaceId: "factory-finance-audit-report-generator-4",
            stage: "deploy",
            healthStatus: "ready",
            actionPlan: {
              kind: "ship_agents",
              workspaceIds: ["factory-finance-audit-report-generator-4"],
            },
          },
        ],
      },
    };
    const journey = buildJourneyPlan({
      scenario: "audit-report-generator",
      usecaseId: "audit-report-generator",
      ids: ["audit-report-generator"],
      fleet,
      mode: "local",
    });

    expect(journey.next.id).toBe("deploy");
    expect(journey.stages.find((stage) => stage.id === "interview").status).toBe("skipped");
    expect(journey.stages.find((stage) => stage.id === "spec").status).toBe("done");
    expect(journey.stages.find((stage) => stage.id === "preview").status).toBe("done");
    expect(journey.stages.find((stage) => stage.id === "deploy").actionPlan).toMatchObject({
      kind: "ship_agents",
      safeToRun: true,
      workspaceIds: ["factory-finance-audit-report-generator-4"],
    });
    expect(journey.stages.find((stage) => stage.id === "deploy").actionPlan.commands[0]).toBe("ge agents ship --ids factory-finance-audit-report-generator-4");
  });

  test("applyRuntimeTasks wires running mission.run task into data stage", () => {
    const journey = buildJourneyPlan({
      scenario: "payroll-automation",
      tasks: [{
        id: "mission-runtime-42",
        kind: "mission.run",
        status: "running",
        createdAt: "2026-06-14T10:00:00Z",
        output: {
          graph: {
            id: "mission-runtime-42",
            nodes: [
              { id: "mock.generate", status: "running", kind: "mock.generate", childTaskId: "task-gen-1", artifacts: ["mock_data.json"] },
              { id: "snowfakery.generate", status: "pending", kind: "snowfakery.generate", artifacts: [] },
            ],
          },
        },
      }],
      includePlannedMission: false,
    });
    const data = journey.stages.find((stage) => stage.id === "data");

    expect(data.status).toBe("running");
    // The stage links to the running node's child task (the actual per-stage task), not the
    // parent mission id — this is what lets a stage deep-link to its live runtime task.
    expect(data.taskId).toBe("task-gen-1");
    expect(data.nodeIds).toContain("mock.generate");
    expect(data.artifacts).toContain("mock_data.json");
    expect(data.actionPlan.kind).toBe("run_mission");
  });

  test("applyRuntimeTasks wires running harness.run task into interview stage", () => {
    const journey = buildJourneyPlan({
      usecaseId: "expense-approval",
      tasks: [{
        id: "harness-runtime-99",
        kind: "harness.run",
        status: "running",
        createdAt: "2026-06-14T11:00:00Z",
        input: { stage: "interview,spec_generation" },
        artifactRefs: ["interview-transcript.json"],
      }],
      includePlannedMission: false,
    });
    const interview = journey.stages.find((stage) => stage.id === "interview");

    expect(interview.status).toBe("running");
    expect(interview.taskId).toBe("harness-runtime-99");
    expect(interview.artifacts).toContain("interview-transcript.json");
    expect(interview.actionPlan.kind).toBe("watch_runtime");
    expect(interview.actionPlan.commands[0]).toBe("ge runtime events harness-runtime-99 --follow");
  });
});
