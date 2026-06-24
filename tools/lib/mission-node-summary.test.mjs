import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { verifyMissionArtifacts } from "./mission-artifacts.mjs";
import { summarizeMissionNode } from "./mission-node-summary.mjs";

function tmpDir(name) {
  const dir = join("/tmp", `ge-mission-node-summary-${process.pid}-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("mission node summaries", () => {
  test("normalizes mock.generate stdout and artifacts", () => {
    const root = tmpDir("mock");
    mkdirSync(join(root, "mock_data", "plan"), { recursive: true });
    mkdirSync(join(root, "mock_data", "scenario"), { recursive: true });
    mkdirSync(join(root, "mock_data", "snowfakery"), { recursive: true });
    mkdirSync(join(root, "mock_data", "simulators"), { recursive: true });
    writeFileSync(join(root, "mock_data", "plan", "data-plan.json"), JSON.stringify({ datastores: [{ id: "alloydb" }] }), "utf8");
    writeFileSync(join(root, "mock_data", "scenario", "scenario-graph.json"), JSON.stringify({ nodes: [{ id: "n1" }], edges: [] }), "utf8");
    writeFileSync(join(root, "mock_data", "snowfakery", "realization-plan.json"), JSON.stringify({ objects: [{ object: "Employee" }] }), "utf8");
    writeFileSync(join(root, "mock_data", "simulators", "index.json"), JSON.stringify({ simulators: [{ simulatorId: "workday" }] }), "utf8");

    const artifactCheck = verifyMissionArtifacts([
      { name: "data_plan", type: "json", path: "mock_data/plan/data-plan.json" },
      { name: "scenario_graph", type: "json", path: "mock_data/scenario/scenario-graph.json" },
      { name: "snowfakery_realization_plan", type: "json", path: "mock_data/snowfakery/realization-plan.json" },
      { name: "simulator_index", type: "json", path: "mock_data/simulators/index.json" },
    ], { repoRoot: root });
    const summary = summarizeMissionNode({
      node: { kind: "mock.generate" },
      childTask: { output: { stdout: JSON.stringify({ ok: true, usecase: "benefits", sources: 4 }) } },
      artifactCheck,
    });

    expect(summary.ok).toBe(true);
    expect(summary.usecase).toBe("benefits");
    expect(summary.sources).toBe(4);
    expect(summary.scenarioGraph.nodes).toBe(1);
    expect(summary.snowfakery.objects).toBe(1);
    expect(summary.simulatorSeeds[0].simulatorId).toBe("workday");
  });

  test("summarizes snowfakery output from inspected directory", () => {
    const root = tmpDir("snow");
    mkdirSync(join(root, "output"), { recursive: true });
    writeFileSync(join(root, "output", "Employee.csv"), "id,name\n1,Ada\n2,Grace\n", "utf8");
    writeFileSync(join(root, "realization-plan.json"), JSON.stringify({ objects: [{ object: "Employee" }] }), "utf8");

    const artifactCheck = verifyMissionArtifacts([
      { name: "snowfakery_output", type: "dir", path: "output" },
      { name: "snowfakery_realization_plan", type: "json", path: "realization-plan.json" },
    ], { repoRoot: root });
    const summary = summarizeMissionNode({ node: { kind: "snowfakery.generate" }, artifactCheck });

    expect(summary.objects).toBe(1);
    expect(summary.output.csvFiles).toBe(1);
    expect(summary.output.rowCount).toBe(2);
  });

  test("normalizes simulator seed and validation stdout", () => {
    const seedSummary = summarizeMissionNode({
      node: { kind: "simulator.seed" },
      childTask: { output: { stdout: JSON.stringify({ ok: true, simulators: [{ simulatorId: "workday", collections: { workers: 2 }, inputs: [{ object: "Employee", rows: 2 }] }] }) } },
      artifactCheck: { ok: true, artifacts: [] },
    });
    const validateSummary = summarizeMissionNode({
      node: { kind: "simulator.validate" },
      childTask: {
        output: {
          stdout: "],\"truncated\":true}",
          stdoutFull: JSON.stringify({ ok: true, simulators: [{ id: "workday", ok: true, warnings: ["weak field"], errors: [], tools: 3, collections: 2, workflowHandlers: 3 }] }),
        },
      },
      artifactCheck: { ok: true, artifacts: [] },
    });

    expect(seedSummary.simulators[0].collections.workers).toBe(2);
    expect(seedSummary.simulators[0].inputs[0].rows).toBe(2);
    expect(validateSummary.ok).toBe(true);
    expect(validateSummary.totals.warnings).toBe(1);
    expect(validateSummary.totals.tools).toBe(3);
  });
});
