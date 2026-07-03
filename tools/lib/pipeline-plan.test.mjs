import { describe, expect, test } from "bun:test";
import { buildPipelinePlan } from "./pipeline-plan.mjs";

describe("pipeline plan", () => {
  test("builds user-facing stages over the pipeline graph", () => {
    const pipeline = buildPipelinePlan({
      scenario: "benefits-enrollment",
      spec: ".ge/interviews/benefits-enrollment/agent-spec.json",
      systems: ["workday"],
      ids: ["benefits-agent"],
      mode: "local",
    });

    expect(pipeline.kind).toBe("ge.pipeline.plan");
    expect(pipeline.stages.map((stage) => stage.id)).toEqual(["interview", "spec", "data", "simulator", "build", "eval", "preview", "deploy"]);
    expect(pipeline.stages.find((stage) => stage.id === "spec").nodeIds).toContain("antigravity.spec-data-review");
    expect(pipeline.stages.find((stage) => stage.id === "spec").actionPlan.route).toBe("#/spec-review/benefits-enrollment");
    expect(pipeline.stages.find((stage) => stage.id === "spec").actionPlan.artifactPath).toBe(".ge/interviews/benefits-enrollment/agent-spec.json");
    expect(pipeline.stages.find((stage) => stage.id === "data").nodeIds).toEqual(["mock.generate", "snowfakery.generate"]);
    expect(pipeline.stages.find((stage) => stage.id === "simulator").nodeIds).toEqual(["simulator.seed", "simulator.validate"]);
    expect(pipeline.stages.find((stage) => stage.id === "build").actionPlan.commands[0]).toBe("ge agents build --ids benefits-agent --local");
  });

  test("projects blocked pipeline runtime state onto the user pipeline", () => {
    const graph = {
      id: "pipeline-1",
      nodes: [
        { id: "preflight.doctor", status: "done", artifacts: [] },
        { id: "mock.generate", status: "blocked", blockers: [{ id: "missing-usecase", message: "Use case not found" }], resumePlan: { commands: ["ge pipeline resume pipeline-1"] }, artifacts: [] },
      ],
    };
    const pipeline = buildPipelinePlan({
      scenario: "benefits-enrollment",
      tasks: [{ id: "pipeline-1", kind: "pipeline.run", status: "blocked", output: { graph }, summary: { resumePlan: { commands: ["ge pipeline resume pipeline-1"] } } }],
      includePlannedPipeline: false,
    });
    const data = pipeline.stages.find((stage) => stage.id === "data");

    expect(pipeline.status).toBe("blocked");
    expect(pipeline.next.id).toBe("data");
    expect(data.status).toBe("blocked");
    expect(data.blocker.message).toBe("Use case not found");
    expect(data.actionPlan.kind).toBe("resume_pipeline");
    expect(data.actionPlan.taskId).toBe("pipeline-1");
  });

  test("projects interview harness runtime state", () => {
    const pipeline = buildPipelinePlan({
      usecaseId: "new-procurement-agent",
      tasks: [{
        id: "harness-1",
        kind: "harness.run",
        status: "failed",
        input: { stage: "interview,spec_generation" },
        summary: "model error",
        resumePlan: { safeToRun: true, commands: ["ge runs resume harness-1"], reason: "retry model error" },
      }],
      includePlannedPipeline: false,
    });
    const interview = pipeline.stages.find((stage) => stage.id === "interview");

    expect(interview.status).toBe("failed");
    expect(interview.blocker.message).toBe("retry model error");
    expect(interview.actionPlan.kind).toBe("resume_harness");
  });

  test("spec review route can target a selected catalog id instead of the scenario alias", () => {
    const pipeline = buildPipelinePlan({
      scenario: "benefits-enrollment",
      usecaseId: "benefits-q-a-enrollment",
      ids: ["benefits-q-a-enrollment"],
      includePlannedPipeline: false,
    });
    const spec = pipeline.stages.find((stage) => stage.id === "spec");

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
    const pipeline = buildPipelinePlan({ ids: ["a2"], fleet, includePlannedPipeline: false });
    const build = pipeline.stages.find((stage) => stage.id === "build");

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
              kind: "handoff_agents",
              workspaceIds: ["factory-finance-audit-report-generator-4"],
            },
          },
        ],
      },
    };
    const pipeline = buildPipelinePlan({
      scenario: "audit-report-generator",
      usecaseId: "audit-report-generator",
      ids: ["audit-report-generator"],
      fleet,
      mode: "local",
    });

    expect(pipeline.next.id).toBe("deploy");
    expect(pipeline.stages.find((stage) => stage.id === "interview").status).toBe("skipped");
    expect(pipeline.stages.find((stage) => stage.id === "spec").status).toBe("done");
    expect(pipeline.stages.find((stage) => stage.id === "preview").status).toBe("done");
    expect(pipeline.stages.find((stage) => stage.id === "deploy").actionPlan).toMatchObject({
      kind: "handoff_agents",
      safeToRun: true,
      workspaceIds: ["factory-finance-audit-report-generator-4"],
    });
    expect(pipeline.stages.find((stage) => stage.id === "deploy").actionPlan.commands[0]).toBe("ge handoff agents-cli --ids factory-finance-audit-report-generator-4");
  });

  test("applyRuntimeTasks wires running pipeline.run task into data stage", () => {
    const pipeline = buildPipelinePlan({
      scenario: "payroll-automation",
      tasks: [{
        id: "pipeline-runtime-42",
        kind: "pipeline.run",
        status: "running",
        createdAt: "2026-06-14T10:00:00Z",
        output: {
          graph: {
            id: "pipeline-runtime-42",
            nodes: [
              { id: "mock.generate", status: "running", kind: "mock.generate", childTaskId: "task-gen-1", artifacts: ["mock_data.json"] },
              { id: "snowfakery.generate", status: "pending", kind: "snowfakery.generate", artifacts: [] },
            ],
          },
        },
      }],
      includePlannedPipeline: false,
    });
    const data = pipeline.stages.find((stage) => stage.id === "data");

    expect(data.status).toBe("running");
    // The stage links to the running node's child task (the actual per-stage task), not the
    // parent pipeline id — this is what lets a stage deep-link to its live runtime task.
    expect(data.taskId).toBe("task-gen-1");
    expect(data.nodeIds).toContain("mock.generate");
    expect(data.artifacts).toContain("mock_data.json");
    expect(data.actionPlan.kind).toBe("run_pipeline");
  });

  test("applyRuntimeTasks wires running harness.run task into interview stage", () => {
    const pipeline = buildPipelinePlan({
      usecaseId: "expense-approval",
      tasks: [{
        id: "harness-runtime-99",
        kind: "harness.run",
        status: "running",
        createdAt: "2026-06-14T11:00:00Z",
        input: { stage: "interview,spec_generation" },
        artifactRefs: ["interview-transcript.json"],
      }],
      includePlannedPipeline: false,
    });
    const interview = pipeline.stages.find((stage) => stage.id === "interview");

    expect(interview.status).toBe("running");
    expect(interview.taskId).toBe("harness-runtime-99");
    expect(interview.artifacts).toContain("interview-transcript.json");
    expect(interview.actionPlan.kind).toBe("watch_runtime");
    expect(interview.actionPlan.commands[0]).toBe("ge runs events harness-runtime-99 --follow");
  });
});
