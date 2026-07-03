import { describe, expect, test } from "bun:test";
import { buildPipelineGraph } from "./pipeline/pipeline-graph-plan.mjs";
import { resumePlanFor, safeGeCommand, safeHarnessRunInput, safePipelineRuntimeCommand, safeProcessCommand, toolAugmentedPath, __test } from "./runtime-daemon.mjs";

describe("toolAugmentedPath", () => {
  test("adds ~/.local/bin (where uv lives) so spawned tools resolve, preserving existing PATH", () => {
    const out = toolAugmentedPath({ PATH: "/usr/bin" });
    expect(out.split(":")).toContain("/usr/bin");
    expect(out).toContain("/.local/bin");
  });
  test("is idempotent — does not duplicate dirs already on PATH", () => {
    const out = toolAugmentedPath({ PATH: "/usr/local/bin" });
    expect(out.split(":").filter((d) => d === "/usr/local/bin").length).toBe(1);
  });
});

describe("runtime resume plan", () => {
  test("repair blocked tasks are resumable from persisted item state", () => {
    const plan = resumePlanFor({
      id: "auto-1",
      kind: "repair.run",
      status: "blocked",
      input: { targetStage: "preview" },
      output: {
        run: { targetStage: "preview" },
        items: [
          {
            agentId: "benefits-agent",
            status: "blocked",
            nextAction: "inspect_blocker",
            blockers: [{ id: "missing-preview", message: "preview report missing" }],
          },
        ],
      },
    });

    expect(plan.safeToRun).toBe(true);
    expect(plan.state).toBe("blocked");
    expect(plan.nextAction).toBe("resume_repair");
    expect(plan.commands).toContain("ge runs resume auto-1");
    expect(plan.blockers[0].id).toBe("missing-preview");
  });

  test("finished tasks no-op with an explanation", () => {
    const plan = resumePlanFor({ id: "task-1", kind: "ge.command", status: "done", output: {} });

    expect(plan.safeToRun).toBe(false);
    expect(plan.state).toBe("done");
    expect(plan.nextAction).toBe("none");
    expect(plan.reason).toContain("no resume action");
  });

  test("failed ge commands only resume when classified safe", () => {
    expect(safeGeCommand(["doctor", "--json"])).toBe(true);
    expect(safeGeCommand(["agents", "build", "--all"])).toBe(false);

    const safe = resumePlanFor({
      id: "job-safe",
      kind: "ge.command",
      status: "failed",
      input: { argv: ["doctor", "--json"] },
      output: {},
    });
    const unsafe = resumePlanFor({
      id: "job-unsafe",
      kind: "ge.command",
      status: "failed",
      input: { argv: ["agents", "build", "--all"] },
      output: {},
    });

    expect(safe.safeToRun).toBe(true);
    expect(safe.nextAction).toBe("rerun_task");
    expect(unsafe.safeToRun).toBe(false);
    expect(unsafe.nextAction).toBe("inspect_blocker");
  });

  test("failed process commands only resume for whitelisted repo scripts", () => {
    expect(safeProcessCommand(["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", "x"])).toBe(true);
    expect(safeProcessCommand([process.execPath, "/repo/apps/factory/scripts/materialize-simulator-seeds.mjs", "--dir", "x"])).toBe(true);
    expect(safeProcessCommand(["uv", "run", "--with", "snowfakery", "--with", "setuptools<81", "snowfakery", ".ge/pipelines/benefits/mock_data/snowfakery/structured.recipe.yml", "--output-format", "csv", "--output-folder", ".ge/pipelines/benefits/mock_data/snowfakery/output"])).toBe(true);
    expect(safeProcessCommand(["node", "scripts/unknown.mjs"])).toBe(false);

    const safe = resumePlanFor({
      id: "proc-safe",
      kind: "process.command",
      status: "failed",
      input: { argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true"] },
      output: {},
    });
    const unsafe = resumePlanFor({
      id: "proc-unsafe",
      kind: "process.command",
      status: "failed",
      input: { argv: ["bash", "-lc", "echo nope"] },
      output: {},
    });

    expect(safe.safeToRun).toBe(true);
    expect(safe.nextAction).toBe("rerun_task");
    expect(unsafe.safeToRun).toBe(false);
    expect(unsafe.nextAction).toBe("inspect_blocker");
  });

  test("failed typed pipeline data nodes resume through node registry", () => {
    expect(safePipelineRuntimeCommand("simulator.validate", { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true", "--system", "workday"] })).toBe(true);
    expect(safePipelineRuntimeCommand("simulator.validate", { argv: ["node", "scripts/unknown.mjs"] })).toBe(false);

    const safe = resumePlanFor({
      id: "simval-1",
      kind: "simulator.validate",
      status: "failed",
      input: { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true", "--system", "workday"] },
      output: {},
    });
    const unsafe = resumePlanFor({
      id: "simval-2",
      kind: "simulator.validate",
      status: "failed",
      input: { argv: ["node", "scripts/unknown.mjs"] },
      output: {},
    });

    expect(safe.safeToRun).toBe(true);
    expect(safe.nextAction).toBe("rerun_task");
    expect(unsafe.safeToRun).toBe(false);
    expect(unsafe.nextAction).toBe("inspect_blocker");
  });

  test("failed harness runs resume only for safe Antigravity inputs", () => {
    const safeInput = {
      workspaceDir: ".",
      agent: "antigravity-sdk",
      stage: "spec_generation,mock_data,simulation,eval",
      message: "Review spec and simulator data contracts.",
    };
    expect(safeHarnessRunInput(safeInput)).toBe(true);
    expect(safeHarnessRunInput({ ...safeInput, agent: "unknown" })).toBe(false);
    expect(safeHarnessRunInput({ ...safeInput, message: "" })).toBe(false);

    const plan = resumePlanFor({
      id: "harness-1",
      kind: "harness.run",
      status: "failed",
      input: safeInput,
      output: {},
    });

    expect(plan.safeToRun).toBe(true);
    expect(plan.nextAction).toBe("rerun_harness");
    expect(plan.commands).toContain("ge runs resume harness-1");
  });

  test("harness run input resolves Vertex project and global location from config", () => {
    const resolved = __test.resolveHarnessRunInput({
      workspaceDir: ".",
      agent: "antigravity-sdk",
      stage: "interview,spec_generation",
      message: "Interview a use case.",
      vertex: true,
    });

    expect(resolved.project).toBeTruthy();
    expect(resolved.location).toBeTruthy();
  });

  test("harness runtime argv enables live event streaming", () => {
    const argv = __test.harnessRunArgv({
      workspaceDir: ".",
      agent: "antigravity-sdk",
      stage: "interview",
      message: "Interview a use case.",
    });
    expect(argv).toContain("--stream-events");
  });

  test("command output keeps display snippets separate from machine stdout", () => {
    const output = __test.commandOutput({ stdout: `${"x".repeat(5000)}{"ok":true}`, stderr: "warn" }, { preserveMachineStdout: true });

    expect(output.stdout.length).toBe(4000);
    expect(output.stdoutFull).toContain("{\"ok\":true}");
    expect(output.stderr).toBe("warn");
  });

  test("normalizes persisted interaction responses for SDK hooks", () => {
    const response = __test.normalizeInteractionResponses({
      interactionId: "interaction-1",
      responses: [
        { questionId: "q1", selectedOptionIds: ["workday"] },
        { questionId: "q2", freeformResponse: "Require approval" },
      ],
    });
    expect(response.interactionId).toBe("interaction-1");
    expect(response.responses[0].selectedOptionIds).toEqual(["workday"]);
    expect(response.responses[1].freeformResponse).toBe("Require approval");
  });

  test("blocked pipeline tasks expose pipeline resume command", () => {
    const plan = resumePlanFor({
      id: "pipeline-1",
      kind: "pipeline.run",
      status: "blocked",
      output: {
        graph: {
          nodes: [
            {
              id: "repair.converge",
              status: "blocked",
              resumePlan: { reason: "agent blocked", blockers: [{ id: "preview-missing" }], artifacts: [] },
            },
          ],
        },
      },
    });

    expect(plan.safeToRun).toBe(true);
    expect(plan.nextAction).toBe("resume_pipeline");
    expect(plan.commands).toContain("ge pipeline resume pipeline-1");
    expect(plan.blockers[0].id).toBe("preview-missing");
  });

  test("resumed pipelines rehydrate data node commands from the current registry", () => {
    const staleGraph = buildPipelineGraph({
      id: "pipeline-old",
      scenario: "account-reconciliation-agent",
      useAntigravity: false,
    });
    const nodes = staleGraph.nodes.map((node) => {
      if (node.id === "mock.generate") {
        return {
          ...node,
          status: "done",
          childTaskId: "mock-old",
          artifacts: [{ name: "data_plan", path: "actual/data-plan.json" }],
        };
      }
      if (node.id === "snowfakery.generate") {
        return {
          ...node,
          status: "blocked",
          childTaskId: "snow-old",
          input: {
            ...node.input,
            argv: [
              "snowfakery",
              ".ge/pipelines/account-reconciliation-agent/mock_data/snowfakery/structured.recipe.yml",
              "--output-format",
              "csv",
              "--output-folder",
              ".ge/pipelines/account-reconciliation-agent/mock_data/snowfakery/output",
            ],
          },
          blockers: [{ id: "old-snowfakery-command" }],
        };
      }
      return node;
    });
    const plannedGraph = buildPipelineGraph({
      id: "pipeline-new",
      scenario: "account-reconciliation-agent",
      useAntigravity: false,
    });

    const hydrated = __test.rehydratePipelineGraphForResume(
      { ...staleGraph, nodes },
      plannedGraph,
      "snowfakery.generate",
    );
    const mock = hydrated.nodes.find((node) => node.id === "mock.generate");
    const snowfakery = hydrated.nodes.find((node) => node.id === "snowfakery.generate");

    expect(mock.status).toBe("done");
    expect(mock.artifacts[0].path).toBe("actual/data-plan.json");
    expect(snowfakery.input.argv.slice(0, 6)).toEqual([
      "uv",
      "run",
      "--with",
      "snowfakery",
      "--with",
      "setuptools<81",
    ]);
    expect(snowfakery.artifacts.map((artifact) => artifact.name)).toContain("snowfakery_output");
  });

  test("resumed child pipeline graphs are rehomed onto the parent pipeline", () => {
    const childGraph = {
      id: "pipeline-child",
      nodes: [
        {
          id: "snowfakery.generate",
          pipelineId: "pipeline-child",
          status: "done",
          resumePlan: {
            commands: ["ge pipeline status pipeline-child"],
            blockers: [],
            artifacts: [],
          },
        },
      ],
    };

    const parentGraph = __test.rehomePipelineGraph(childGraph, "pipeline-parent", "pipeline-child");

    expect(parentGraph.id).toBe("pipeline-parent");
    expect(parentGraph.nodes[0].pipelineId).toBe("pipeline-parent");
    expect(parentGraph.nodes[0].resumePlan.commands[0]).toBe("ge pipeline status pipeline-parent");
  });
});
