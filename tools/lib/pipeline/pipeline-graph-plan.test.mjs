import { describe, expect, test } from "bun:test";
import { buildPipelineGraph, nextRunnablePipelineNode, patchPipelineNode, resetPipelineGraphForResume } from "./pipeline-graph-plan.mjs";

describe("pipeline graph", () => {
  test("builds a durable DAG over runtime task kinds", () => {
    const graph = buildPipelineGraph({ id: "pipeline-1", ids: ["a1"], targetStage: "preview", mode: "local" });

    expect(graph.kind).toBe("ge.pipeline.graph");
    expect(graph.nodes.map((node) => node.runtimeKind)).toEqual(["doctor", "harness.run", "ge.command", "repair.run"]);
    const antigravity = graph.nodes.find((node) => node.id === "antigravity.spec-data-review");
    expect(antigravity.input.agent).toBe("antigravity-sdk");
    expect(antigravity.dependsOn).toEqual(["preflight.doctor"]);
    const factory = graph.nodes.find((node) => node.id === "factory.build");
    expect(factory.status).toBe("skipped");
    expect(factory.input.argv).toEqual(["agents", "build", "--local", "--ids", "a1", "--target", "previewed"]);
    expect(factory.input.command.id).toBe("agents.build.local");
    expect(graph.edges).toContainEqual({ from: "preflight.doctor", to: "antigravity.spec-data-review" });
    expect(graph.edges).toContainEqual({ from: "antigravity.spec-data-review", to: "factory.build" });
    expect(graph.edges).toContainEqual({ from: "antigravity.spec-data-review", to: "repair.converge" });
  });

  test("remote factory node preserves ids and target stage", () => {
    const graph = buildPipelineGraph({ id: "pipeline-remote", ids: ["a1", "a2"], targetStage: "publish_enterprise", mode: "remote", executeFactory: true });
    const factory = graph.nodes.find((node) => node.id === "factory.build");

    expect(factory.status).toBe("pending");
    expect(factory.input.argv).toEqual(["agents", "build", "--ids", "a1,a2", "--target", "publish_enterprise"]);
    expect(factory.input.command.id).toBe("agents.build");
  });

  test("selects next runnable node based on completed dependencies", () => {
    const graph = buildPipelineGraph({ id: "pipeline-2", executeFactory: true });
    expect(nextRunnablePipelineNode(graph).id).toBe("preflight.doctor");

    const afterPreflight = patchPipelineNode(graph, "preflight.doctor", { status: "done" });
    expect(nextRunnablePipelineNode(afterPreflight).id).toBe("antigravity.spec-data-review");

    const afterHarness = patchPipelineNode(afterPreflight, "antigravity.spec-data-review", { status: "done" });
    expect(nextRunnablePipelineNode(afterHarness).id).toBe("factory.build");

    const afterFactory = patchPipelineNode(afterHarness, "factory.build", { status: "done" });
    expect(nextRunnablePipelineNode(afterFactory).id).toBe("repair.converge");
  });

  test("adds data and simulator nodes when a scenario is provided", () => {
    const graph = buildPipelineGraph({ id: "pipeline-data", scenario: "BenefitsAssistant", systems: ["workday"] });

    expect(graph.input.workspace).toBe(".ge/pipelines/benefitsassistant");
    expect(graph.nodes.find((node) => node.id === "preflight.doctor").input.command).toBe("pipeline.run");
    expect(graph.nodes.map((node) => node.id)).toEqual([
      "preflight.doctor",
      "antigravity.spec-data-review",
      "mock.generate",
      "snowfakery.generate",
      "simulator.seed",
      "simulator.validate",
      "factory.build",
      "repair.converge",
    ]);
    expect(graph.nodes.find((node) => node.id === "mock.generate").runtimeKind).toBe("mock.generate");
    expect(graph.nodes.find((node) => node.id === "mock.generate").dependsOn).toEqual(["antigravity.spec-data-review"]);
    expect(graph.nodes.find((node) => node.id === "simulator.seed").dependsOn).toEqual(["snowfakery.generate"]);
    expect(graph.nodes.find((node) => node.id === "factory.build").dependsOn).toEqual(["simulator.validate"]);
    expect(graph.nodes.find((node) => node.id === "repair.converge").dependsOn).toEqual(["simulator.validate"]);
  });

  test("adds data and simulator nodes from a concrete spec artifact", () => {
    const spec = ".ge/interviews/new-agent/agent-spec.json";
    const graph = buildPipelineGraph({ id: "pipeline-spec", spec, systems: ["workday"] });
    const mock = graph.nodes.find((node) => node.id === "mock.generate");

    expect(graph.input.spec).toBe(spec);
    expect(graph.nodes.find((node) => node.id === "preflight.doctor").input.command).toBe("pipeline.run");
    expect(graph.input.workspace).toBe(".ge/pipelines/new-agent");
    expect(mock.input.argv).toEqual([
      "node",
      "apps/factory/scripts/plan-mock-data.mjs",
      "--dir",
      ".ge/pipelines/new-agent",
      "--spec",
      spec,
    ]);
  });

  test("node resume plans inherit child task resume plans", () => {
    const graph = buildPipelineGraph({ id: "pipeline-3" });
    const childPlan = { state: "blocked", nextAction: "resume_repair", safeToRun: true, commands: ["ge runs resume auto-1"], reason: "blocked", blockers: [], artifacts: [] };
    const patched = patchPipelineNode(graph, "repair.converge", {
      status: "blocked",
      childTaskId: "auto-1",
      childTask: { resumePlan: childPlan },
    });

    const node = patched.nodes.find((entry) => entry.id === "repair.converge");
    expect(node.resumePlan).toEqual(childPlan);
    expect(patched.status).toBe("blocked");
  });

  test("node-level blockers override completed child resume plans", () => {
    const graph = buildPipelineGraph({ id: "pipeline-artifact" });
    const patched = patchPipelineNode(graph, "repair.converge", {
      status: "blocked",
      childTask: { resumePlan: { state: "done", nextAction: "none", safeToRun: false, commands: [], reason: "task is done", blockers: [], artifacts: [] } },
      blockers: [{ id: "artifact-missing", message: "preview report is missing" }],
      warnings: [{ id: "artifact-warning", message: "preview report is stale" }],
      artifacts: [{ name: "preview_report", status: "missing" }],
    });

    const node = patched.nodes.find((entry) => entry.id === "repair.converge");
    expect(node.resumePlan.state).toBe("blocked");
    expect(node.resumePlan.nextAction).toBe("rerun_task");
    expect(node.resumePlan.reason).toBe("preview report is missing");
    expect(node.resumePlan.artifacts[0].status).toBe("missing");
    expect(node.warnings[0].id).toBe("artifact-warning");
  });

  test("factory handoff is not modeled as a blocking skipped node", () => {
    const graph = buildPipelineGraph({ id: "pipeline-handoff", ids: ["a1"], mode: "local", executeFactory: false });
    const factory = graph.nodes.find((node) => node.id === "factory.build");

    expect(factory.status).toBe("skipped");
    expect(factory.blockers).toEqual([]);
    expect(factory.handoff).toMatchObject({
      id: "factory-not-executed",
      commands: ["ge agents build --ids a1 --local"],
    });
  });

  test("resets blocked node and descendants for pipeline resume", () => {
    const graph = buildPipelineGraph({ id: "pipeline-original", scenario: "BenefitsAssistant", systems: ["workday"] });
    const afterDoctor = patchPipelineNode(graph, "preflight.doctor", { status: "done", childTaskId: "doctor-1" });
    const afterHarness = patchPipelineNode(afterDoctor, "antigravity.spec-data-review", { status: "done", childTaskId: "harness-1" });
    const afterMock = patchPipelineNode(afterHarness, "mock.generate", { status: "done", childTaskId: "mock-1", summary: { ok: true } });
    const blocked = patchPipelineNode(afterMock, "snowfakery.generate", {
      status: "blocked",
      childTaskId: "snow-1",
      blockers: [{ id: "artifact-missing", message: "snowfakery output is missing" }],
    });
    const reset = resetPipelineGraphForResume({ ...blocked, id: "pipeline-child" }, "snowfakery.generate");
    const byId = Object.fromEntries(reset.nodes.map((node) => [node.id, node]));

    expect(byId["preflight.doctor"].status).toBe("done");
    expect(byId["antigravity.spec-data-review"].status).toBe("done");
    expect(byId["mock.generate"].status).toBe("done");
    expect(byId["snowfakery.generate"].status).toBe("pending");
    expect(byId["snowfakery.generate"].childTaskId).toBe(null);
    expect(byId["simulator.seed"].status).toBe("pending");
    expect(byId["repair.converge"].status).toBe("pending");
    expect(byId["mock.generate"].pipelineId).toBe("pipeline-child");
  });
});
