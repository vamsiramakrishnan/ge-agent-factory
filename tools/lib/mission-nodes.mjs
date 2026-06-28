import { join } from "node:path";
import { buildMissionNode } from "./mission-node-registry.mjs";
import { STATE_PATHS, relativeToRepo } from "./state-paths.mjs";

const DEMO_ROOT = "apps/factory";

function slug(value) {
  return String(value || "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function scenarioWorkspace(scenario, spec = null) {
  const id = scenario || String(spec || "").replace(/\/agent-spec\.json$/i, "").split("/").filter(Boolean).pop();
  return id ? join(relativeToRepo(STATE_PATHS.missions.root), slug(id)) : null;
}

export function missionDataContext({ scenario = null, spec = null, workspace = null, systems = [] } = {}) {
  const resolvedWorkspace = workspace || scenarioWorkspace(scenario, spec);
  return {
    scenario: scenario || null,
    spec: spec || null,
    workspace: resolvedWorkspace,
    systems: Array.isArray(systems) ? systems.filter(Boolean) : String(systems || "").split(",").map((item) => item.trim()).filter(Boolean),
    enabled: Boolean(scenario || spec),
  };
}

export function missionNodeArtifacts(kind, input = {}) {
  const workspace = input.workspace || "<workspace>";
  if (kind === "mock.generate") {
    return [
      { name: "data_plan", type: "json", path: join(workspace, "mock_data/plan/data-plan.json") },
      { name: "scenario_graph", type: "json", path: join(workspace, "mock_data/scenario/scenario-graph.json") },
      { name: "snowfakery_recipe", type: "yaml", path: join(workspace, "mock_data/snowfakery/structured.recipe.yml") },
      { name: "snowfakery_realization_plan", type: "json", path: join(workspace, "mock_data/snowfakery/realization-plan.json") },
      { name: "simulator_index", type: "json", path: join(workspace, "mock_data/simulators/index.json") },
      { name: "package_index", type: "yaml", path: join(workspace, "mock_data/package-index.yaml") },
    ];
  }
  if (kind === "simulator.seed") {
    return [
      { name: "simulator_index", type: "json", path: input.index || join(workspace, "mock_data/simulators/index.json") },
      { name: "simulator_seed_report", type: "json", path: input.report || join(workspace, "mock_data/simulators/materialization-report.json") },
      { name: "simulator_seed_overlays", type: "dir", path: join(workspace, "mock_data/simulators") },
    ];
  }
  if (kind === "snowfakery.generate") {
    return [
      { name: "snowfakery_recipe", type: "yaml", path: join(workspace, "mock_data/snowfakery/structured.recipe.yml") },
      { name: "snowfakery_output", type: "dir", path: join(workspace, "mock_data/snowfakery/output") },
      { name: "snowfakery_realization_plan", type: "json", path: join(workspace, "mock_data/snowfakery/realization-plan.json") },
    ];
  }
  if (kind === "simulator.validate") {
    return [
      { name: "simulator_conformance_report", type: "stdout-json", ref: "validate-simulator-pack" },
      { name: "simulator_registry", type: "json", path: join(DEMO_ROOT, "simulator-systems/registry.json") },
    ];
  }
  return [];
}

export function dataMissionNodes({ missionId, scenario, spec, workspace, systems = [] } = {}) {
  const context = { ...missionDataContext({ scenario, spec, workspace, systems }), missionId };
  if (!context.enabled) return [];
  return [
    buildMissionNode("mock.generate", context),
    buildMissionNode("snowfakery.generate", context),
    buildMissionNode("simulator.seed", context),
    buildMissionNode("simulator.validate", context),
  ];
}
