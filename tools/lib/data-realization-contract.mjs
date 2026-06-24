import { join } from "node:path";
import { STATE_PATHS, relativeToRepo } from "./state-paths.mjs";

const DEMO_ROOT = "apps/ge-demo-generator";
const DEFAULT_SOURCE_MAP = `${DEMO_ROOT}/src/use-case-source-map.generated.json`;

function compact(value) {
  return Array.isArray(value) ? value.filter((item) => item !== undefined && item !== null && item !== "") : [];
}

function scenarioWorkspace(scenario) {
  return scenario ? join(relativeToRepo(STATE_PATHS.missions.root), String(scenario).replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase()) : null;
}

function requestedSystems(systems = []) {
  return Array.isArray(systems) ? systems.filter(Boolean) : String(systems || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function buildDataRealizationPlan({
  scenario = "scenario",
  workspace = null,
  systems = [],
  sourceMap = DEFAULT_SOURCE_MAP,
} = {}) {
  const resolvedScenario = scenario || "scenario";
  const resolvedWorkspace = workspace || scenarioWorkspace(resolvedScenario);
  return {
    kind: "ge.data-realization-plan",
    version: 1,
    scenario: resolvedScenario,
    workspace: resolvedWorkspace,
    sourceMap,
    systems: requestedSystems(systems),
    paths: {
      dataPlan: join(resolvedWorkspace, "mock_data/plan/data-plan.json"),
      scenarioGraph: join(resolvedWorkspace, "mock_data/scenario/scenario-graph.json"),
      snowfakeryRecipe: join(resolvedWorkspace, "mock_data/snowfakery/structured.recipe.yml"),
      snowfakeryOutput: join(resolvedWorkspace, "mock_data/snowfakery/output"),
      snowfakeryRealizationPlan: join(resolvedWorkspace, "mock_data/snowfakery/realization-plan.json"),
      simulatorIndex: join(resolvedWorkspace, "mock_data/simulators/index.json"),
      simulatorSeedReport: join(resolvedWorkspace, "mock_data/simulators/materialization-report.json"),
      simulatorSeedOverlays: join(resolvedWorkspace, "mock_data/simulators"),
      packageIndex: join(resolvedWorkspace, "mock_data/package-index.yaml"),
    },
  };
}

export function dataRealizationCommands(plan) {
  return {
    mockGenerate: compact([
      "node",
      `${DEMO_ROOT}/scripts/plan-mock-data.mjs`,
      "--dir",
      plan.workspace,
      plan.scenario ? "--usecase" : null,
      plan.scenario,
      "--sourceMap",
      plan.sourceMap || DEFAULT_SOURCE_MAP,
    ]),
    snowfakeryGenerate: [
      "uv",
      "run",
      "--with",
      "snowfakery",
      "--with",
      "setuptools<81",
      "snowfakery",
      plan.paths.snowfakeryRecipe,
      "--output-format",
      "csv",
      "--output-folder",
      plan.paths.snowfakeryOutput,
    ],
    simulatorSeed: [
      "node",
      `${DEMO_ROOT}/scripts/materialize-simulator-seeds.mjs`,
      "--dir",
      plan.workspace,
    ],
    simulatorValidate: compact([
      "node",
      `${DEMO_ROOT}/scripts/validate-simulator-pack.mjs`,
      "--check",
      "true",
      plan.systems.length === 1 ? "--system" : null,
      plan.systems.length === 1 ? plan.systems[0] : null,
    ]),
  };
}

export function dataRealizationArtifacts(plan) {
  return {
    "mock.generate": [
      { name: "data_plan", type: "json", path: plan.paths.dataPlan },
      { name: "scenario_graph", type: "json", path: plan.paths.scenarioGraph },
      { name: "snowfakery_recipe", type: "yaml", path: plan.paths.snowfakeryRecipe },
      { name: "snowfakery_realization_plan", type: "json", path: plan.paths.snowfakeryRealizationPlan },
      { name: "simulator_index", type: "json", path: plan.paths.simulatorIndex },
      { name: "package_index", type: "yaml", path: plan.paths.packageIndex },
    ],
    "snowfakery.generate": [
      { name: "snowfakery_recipe", type: "yaml", path: plan.paths.snowfakeryRecipe },
      { name: "snowfakery_output", type: "dir", path: plan.paths.snowfakeryOutput },
      { name: "snowfakery_realization_plan", type: "json", path: plan.paths.snowfakeryRealizationPlan },
    ],
    "simulator.seed": [
      { name: "simulator_index", type: "json", path: plan.paths.simulatorIndex },
      { name: "simulator_seed_report", type: "json", path: plan.paths.simulatorSeedReport },
      { name: "simulator_seed_overlays", type: "dir", path: plan.paths.simulatorSeedOverlays },
    ],
    "simulator.validate": [
      { name: "simulator_conformance_report", type: "stdout-json", ref: "validate-simulator-pack" },
      { name: "simulator_registry", type: "json", path: join(DEMO_ROOT, "simulator-systems/registry.json") },
    ],
  };
}

export function dataRealizationMissionNodes(plan, { missionId = null } = {}) {
  const commands = dataRealizationCommands(plan);
  const artifacts = dataRealizationArtifacts(plan);
  const mockInput = {
    workspace: plan.workspace,
    scenario: plan.scenario,
    argv: commands.mockGenerate,
  };
  const snowfakeryInput = {
    workspace: plan.workspace,
    recipe: plan.paths.snowfakeryRecipe,
    output: plan.paths.snowfakeryOutput,
    argv: commands.snowfakeryGenerate,
  };
  const seedInput = {
    workspace: plan.workspace,
    input: plan.paths.snowfakeryOutput,
    index: plan.paths.simulatorIndex,
    report: plan.paths.simulatorSeedReport,
    argv: commands.simulatorSeed,
  };
  const validateInput = {
    workspace: plan.workspace,
    systems: plan.systems,
    argv: commands.simulatorValidate,
  };
  return [
    {
      id: "mock.generate",
      missionId,
      kind: "mock.generate",
      label: "Generate Scenario Data Plan",
      status: "pending",
      runtimeKind: "mock.generate",
      input: mockInput,
      dependsOn: ["preflight.doctor"],
      artifacts: artifacts["mock.generate"],
      blockers: [],
    },
    {
      id: "snowfakery.generate",
      missionId,
      kind: "snowfakery.generate",
      label: "Generate Snowfakery Rows",
      status: "pending",
      runtimeKind: "snowfakery.generate",
      input: snowfakeryInput,
      dependsOn: ["mock.generate"],
      artifacts: artifacts["snowfakery.generate"],
      blockers: [],
    },
    {
      id: "simulator.seed",
      missionId,
      kind: "simulator.seed",
      label: "Materialize Simulator Seeds",
      status: "pending",
      runtimeKind: "simulator.seed",
      input: seedInput,
      dependsOn: ["snowfakery.generate"],
      artifacts: artifacts["simulator.seed"],
      blockers: [],
    },
    {
      id: "simulator.validate",
      missionId,
      kind: "simulator.validate",
      label: "Validate Simulator Pack",
      status: "pending",
      runtimeKind: "simulator.validate",
      input: validateInput,
      dependsOn: ["simulator.seed"],
      artifacts: artifacts["simulator.validate"],
      blockers: [],
    },
  ];
}

export function validateDataRealizationArtifacts() {
  return { ok: true, blockers: [], warnings: [] };
}
