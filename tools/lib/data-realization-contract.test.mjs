import { expect, test } from "bun:test";
import { dataMissionNodes } from "./mission-nodes.mjs";
import { buildMissionNode } from "./mission-node-registry.mjs";
import {
  buildDataRealizationPlan,
  dataRealizationArtifacts,
  dataRealizationCommands,
  dataRealizationMissionNodes,
} from "./data-realization-contract.mjs";

test("buildDataRealizationPlan uses existing mission workspace slug logic", () => {
  const plan = buildDataRealizationPlan({ scenario: "Benefits Enrollment" });

  expect(plan.workspace).toBe(".ge/missions/benefits-enrollment");
  expect(plan.paths.snowfakeryRecipe).toBe(".ge/missions/benefits-enrollment/mock_data/snowfakery/structured.recipe.yml");
  expect(plan.paths.snowfakeryOutput).toBe(".ge/missions/benefits-enrollment/mock_data/snowfakery/output");
});

test("dataRealizationCommands preserve exact command argv order", () => {
  const plan = buildDataRealizationPlan({
    scenario: "benefits",
    workspace: ".ge/missions/benefits",
    systems: ["workday"],
  });

  expect(dataRealizationCommands(plan)).toEqual({
    mockGenerate: [
      "node",
      "apps/ge-demo-generator/scripts/plan-mock-data.mjs",
      "--dir",
      ".ge/missions/benefits",
      "--usecase",
      "benefits",
      "--sourceMap",
      "apps/ge-demo-generator/src/use-case-source-map.generated.json",
    ],
    snowfakeryGenerate: [
      "uv",
      "run",
      "--with",
      "snowfakery",
      "--with",
      "setuptools<81",
      "snowfakery",
      ".ge/missions/benefits/mock_data/snowfakery/structured.recipe.yml",
      "--output-format",
      "csv",
      "--output-folder",
      ".ge/missions/benefits/mock_data/snowfakery/output",
    ],
    simulatorSeed: [
      "node",
      "apps/ge-demo-generator/scripts/materialize-simulator-seeds.mjs",
      "--dir",
      ".ge/missions/benefits",
    ],
    simulatorValidate: [
      "node",
      "apps/ge-demo-generator/scripts/validate-simulator-pack.mjs",
      "--check",
      "true",
      "--system",
      "workday",
    ],
  });
});

test("simulator validate preserves selected-system behavior", () => {
  const oneSystem = buildDataRealizationPlan({ scenario: "benefits", systems: ["workday"] });
  const multipleSystems = buildDataRealizationPlan({ scenario: "benefits", systems: ["workday", "sap_successfactors"] });

  expect(dataRealizationCommands(oneSystem).simulatorValidate).toEqual([
    "node",
    "apps/ge-demo-generator/scripts/validate-simulator-pack.mjs",
    "--check",
    "true",
    "--system",
    "workday",
  ]);
  expect(dataRealizationCommands(multipleSystems).simulatorValidate).toEqual([
    "node",
    "apps/ge-demo-generator/scripts/validate-simulator-pack.mjs",
    "--check",
    "true",
  ]);
});

test("sourceMap is a pass-through input", () => {
  const plan = buildDataRealizationPlan({
    scenario: "benefits",
    sourceMap: "tmp/custom-source-map.json",
  });

  expect(dataRealizationCommands(plan).mockGenerate).toContain("tmp/custom-source-map.json");
});

test("data realization artifacts use mission artifact names", () => {
  const plan = buildDataRealizationPlan({ scenario: "benefits", workspace: ".ge/missions/benefits" });
  const artifacts = dataRealizationArtifacts(plan);

  expect(artifacts["mock.generate"].map((artifact) => artifact.name)).toEqual([
    "data_plan",
    "scenario_graph",
    "snowfakery_recipe",
    "snowfakery_realization_plan",
    "simulator_index",
    "package_index",
  ]);
  expect(artifacts["snowfakery.generate"].map((artifact) => artifact.name)).toEqual([
    "snowfakery_recipe",
    "snowfakery_output",
    "snowfakery_realization_plan",
  ]);
  expect(artifacts["simulator.seed"].map((artifact) => artifact.name)).toEqual([
    "simulator_index",
    "simulator_seed_report",
    "simulator_seed_overlays",
  ]);
});

test("dataRealizationMissionNodes preserves current dataMissionNodes contract", () => {
  const plan = buildDataRealizationPlan({
    scenario: "benefits",
    workspace: ".ge/missions/benefits",
    systems: ["workday"],
  });
  const fromContract = dataRealizationMissionNodes(plan, { missionId: "mission-x" });
  const existing = dataMissionNodes({
    missionId: "mission-x",
    scenario: "benefits",
    workspace: ".ge/missions/benefits",
    systems: ["workday"],
  });

  expect(fromContract.map((node) => node.id)).toEqual(existing.map((node) => node.id));
  expect(fromContract.map((node) => node.dependsOn)).toEqual(existing.map((node) => node.dependsOn));
  expect(fromContract.map((node) => node.input.argv)).toEqual(existing.map((node) => node.input.argv));
  expect(fromContract.map((node) => node.artifacts)).toEqual(existing.map((node) => node.artifacts));
});

test("dataRealizationMissionNodes matches registry-built node contract", () => {
  const context = {
    missionId: "mission-x",
    scenario: "benefits",
    workspace: ".ge/missions/benefits",
    systems: ["workday"],
  };
  const plan = buildDataRealizationPlan(context);
  const fromContract = dataRealizationMissionNodes(plan, { missionId: context.missionId });
  const fromRegistry = [
    buildMissionNode("mock.generate", context),
    buildMissionNode("snowfakery.generate", context),
    buildMissionNode("simulator.seed", context),
    buildMissionNode("simulator.validate", context),
  ];

  expect(fromContract.map((node) => node.id)).toEqual([
    "mock.generate",
    "snowfakery.generate",
    "simulator.seed",
    "simulator.validate",
  ]);
  expect(fromContract.map((node) => node.dependsOn)).toEqual(fromRegistry.map((node) => node.dependsOn));
  expect(fromContract.map((node) => node.input.argv)).toEqual(fromRegistry.map((node) => node.input.argv));
  expect(fromContract.map((node) => node.artifacts)).toEqual(fromRegistry.map((node) => node.artifacts));
});
