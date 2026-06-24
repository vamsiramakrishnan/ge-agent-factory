import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join, normalize } from "node:path";

const DATA_NODE_KINDS = new Set([
  "mock.generate",
  "snowfakery.generate",
  "simulator.seed",
  "simulator.validate",
]);

const NODE_PREFIX = {
  "mock.generate": "mock",
  "snowfakery.generate": "snow",
  "simulator.seed": "seed",
  "simulator.validate": "simval",
};
const DEMO_ROOT = "apps/ge-demo-generator";
const DEFINITIONS = new Map();
const REQUIRED_DEFINITION_FIELDS = [
  "kind",
  "runtimeKind",
  "label",
  "buildInput",
  "artifacts",
  "dependsOn",
  "safeToRun",
  "validateArtifacts",
  "presentation",
];

function compact(value) {
  return Array.isArray(value) ? value.filter((item) => item !== undefined && item !== null && item !== "") : [];
}

export function registerMissionNodeDefinition(definition) {
  if (!definition?.kind) throw new Error("mission node definition missing kind");
  for (const field of REQUIRED_DEFINITION_FIELDS) {
    if (!definition[field]) throw new Error(`mission node definition ${definition.kind} missing ${field}`);
  }
  DEFINITIONS.set(definition.kind, definition);
  return definition;
}

export function listMissionNodeDefinitions() {
  return [...DEFINITIONS.values()];
}

function scriptMatches(script, allowed) {
  return script === allowed || String(script || "").endsWith(`/${allowed}`);
}

function pathMatches(actual, expected) {
  return normalize(String(actual || "")) === normalize(String(expected || ""));
}

function flagValue(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}

function snowfakeryArgv(recipe, output) {
  return [
    "uv",
    "run",
    "--with",
    "snowfakery",
    "--with",
    "setuptools<81",
    "snowfakery",
    recipe,
    "--output-format",
    "csv",
    "--output-folder",
    output,
  ];
}

function snakeCase(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function artifactByName(artifactCheck = {}, name) {
  return (artifactCheck.artifacts || []).find((artifact) => artifact.name === name) || null;
}

function readJsonArtifact(artifact) {
  if (!artifact?.resolvedPath || !existsSync(artifact.resolvedPath)) return null;
  try {
    return JSON.parse(readFileSync(artifact.resolvedPath, "utf8"));
  } catch {
    return null;
  }
}

function semanticBlocker(id, message, artifact = null) {
  return { id, message, artifact: artifact?.name || artifact?.path || artifact?.ref || null, artifactRef: artifact || undefined };
}

function semanticWarning(id, message, artifact = null) {
  return { id, message, artifact: artifact?.name || artifact?.path || artifact?.ref || null, severity: "warn", artifactRef: artifact || undefined };
}

function simulatorIdsFromIndex(index = {}) {
  return (index.simulators || []).map((simulator) => simulator.simulatorId || simulator.id).filter(Boolean);
}

function canonicalSimulatorId(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isRuntimeSystemId(value) {
  return new Set(["vertexai", "vertexaigemini", "gemini", "adk", "agentruntime"]).has(canonicalSimulatorId(value));
}

function requestedSystems(input = {}) {
  return Array.isArray(input.systems) ? input.systems.map(String).filter(Boolean) : [];
}

function validateMockGenerate({ input = {}, artifactCheck = {}, summary = {} } = {}) {
  const blockers = [];
  const warnings = [];
  const dataPlanArtifact = artifactByName(artifactCheck, "data_plan");
  const graphArtifact = artifactByName(artifactCheck, "scenario_graph");
  const realizationArtifact = artifactByName(artifactCheck, "snowfakery_realization_plan");
  const simulatorIndexArtifact = artifactByName(artifactCheck, "simulator_index");
  const dataPlan = readJsonArtifact(dataPlanArtifact) || {};
  const scenarioGraph = readJsonArtifact(graphArtifact) || {};
  const realization = readJsonArtifact(realizationArtifact) || {};
  const simulatorIndex = readJsonArtifact(simulatorIndexArtifact) || {};

  if (dataPlanArtifact?.status === "present" && !(dataPlan.sources || []).length) {
    blockers.push(semanticBlocker("mock-data-plan-empty-sources", "data plan has no sources", dataPlanArtifact));
  }
  if (dataPlanArtifact?.status === "present" && !(dataPlan.datastores || []).length) {
    blockers.push(semanticBlocker("mock-data-plan-empty-datastores", "data plan has no datastore targets", dataPlanArtifact));
  }
  const graphNodes = scenarioGraph.nodes?.length ?? summary.scenarioGraph?.nodes ?? 0;
  if (graphArtifact?.status === "present" && graphNodes <= 0) {
    blockers.push(semanticBlocker("scenario-graph-empty", "scenario graph has no nodes", graphArtifact));
  }
  const graphEdges = scenarioGraph.edges?.length ?? summary.scenarioGraph?.edges ?? 0;
  if (graphArtifact?.status === "present" && graphNodes > 1 && graphEdges <= 0) {
    warnings.push(semanticWarning("scenario-graph-no-edges", "scenario graph has multiple nodes but no edges", graphArtifact));
  }
  if (realizationArtifact?.status === "present" && !(realization.objects || []).length) {
    blockers.push(semanticBlocker("snowfakery-realization-empty", "Snowfakery realization plan has no objects", realizationArtifact));
  }
  const expectedSystems = requestedSystems(input);
  const indexedSystems = simulatorIdsFromIndex(simulatorIndex);
  for (const system of expectedSystems) {
    if (simulatorIndexArtifact?.status === "present" && !indexedSystems.includes(system)) {
      blockers.push(semanticBlocker("simulator-index-missing-system", `simulator index does not include requested system ${system}`, simulatorIndexArtifact));
    }
  }
  return { ok: blockers.length === 0, blockers, warnings };
}

function validateSnowfakeryGenerate({ artifactCheck = {} } = {}) {
  const blockers = [];
  const warnings = [];
  const output = artifactByName(artifactCheck, "snowfakery_output");
  const realizationArtifact = artifactByName(artifactCheck, "snowfakery_realization_plan");
  const realization = readJsonArtifact(realizationArtifact) || {};
  const csvFileNames = output?.metadata?.csvFileNames || [];
  const csvObjects = new Set(csvFileNames.map((name) => snakeCase(basename(name, extname(name))).replace(/s$/, "")));
  const objects = (realization.objects || []).map((object) => snakeCase(object.object || object.name)).filter(Boolean);

  if (output?.status === "present" && (output.metadata?.csvFiles || 0) <= 0) {
    blockers.push(semanticBlocker("snowfakery-output-no-csv", "Snowfakery output has no CSV files", output));
  }
  if (output?.status === "present" && (output.metadata?.rowCount || 0) <= 0) {
    blockers.push(semanticBlocker("snowfakery-output-zero-rows", "Snowfakery generated zero rows", output));
  }
  for (const object of objects) {
    const singular = object.replace(/s$/, "");
    if (csvFileNames.length && !csvObjects.has(singular)) {
      blockers.push(semanticBlocker("snowfakery-output-missing-object", `Snowfakery output is missing CSV rows for object ${object}`, output));
    }
  }
  if (objects.length && csvFileNames.length && csvFileNames.length < objects.length) {
    warnings.push(semanticWarning("snowfakery-output-fewer-files-than-objects", "Snowfakery produced fewer CSV files than realized objects", output));
  }
  return { ok: blockers.length === 0, blockers, warnings };
}

function validateSimulatorSeed({ input = {}, artifactCheck = {}, summary = {} } = {}) {
  const blockers = [];
  const warnings = [];
  const reportArtifact = artifactByName(artifactCheck, "simulator_seed_report");
  const report = readJsonArtifact(reportArtifact) || {};
  const simulators = report.simulators || summary.simulators || [];
  const byId = new Map(simulators.map((simulator) => [simulator.simulatorId || simulator.id, simulator]));
  const expectedSystems = requestedSystems(input);
  const systemsToCheck = expectedSystems.length ? expectedSystems : [...byId.keys()];

  if (reportArtifact?.status === "present" && report.ok === false) {
    blockers.push(semanticBlocker("simulator-seed-report-not-ok", "simulator seed materialization report is not ok", reportArtifact));
  }
  for (const system of systemsToCheck) {
    const simulator = byId.get(system);
    if (!simulator) {
      blockers.push(semanticBlocker("simulator-seed-missing-system", `materialization report is missing simulator ${system}`, reportArtifact));
      continue;
    }
    const collections = simulator.collections || {};
    const counts = Object.values(collections).map((value) => Number(value) || 0);
    if (!counts.length) {
      blockers.push(semanticBlocker("simulator-seed-no-collections", `simulator ${system} has no materialized collections`, reportArtifact));
    } else if (!counts.some((count) => count > 0)) {
      blockers.push(semanticBlocker("simulator-seed-zero-rows", `simulator ${system} materialized zero rows`, reportArtifact));
    }
    const inputs = simulator.inputs || [];
    if (inputs.length && !inputs.some((item) => Number(item.rows) > 0)) {
      warnings.push(semanticWarning("simulator-seed-zero-input-rows", `simulator ${system} inputs have zero source rows`, reportArtifact));
    }
  }
  return { ok: blockers.length === 0, blockers, warnings };
}

function validateSimulatorValidate({ input = {}, summary = {} } = {}) {
  const blockers = [];
  const warnings = [];
  const simulators = summary.simulators || [];
  const expectedSystems = requestedSystems(input);
  const byId = new Map(simulators.map((simulator) => [canonicalSimulatorId(simulator.id), simulator]));
  for (const system of expectedSystems) {
    if (isRuntimeSystemId(system)) continue;
    if (!byId.has(canonicalSimulatorId(system))) blockers.push(semanticBlocker("simulator-validation-missing-system", `validation report is missing simulator ${system}`));
  }
  for (const simulator of simulators) {
    for (const error of simulator.errors || []) {
      blockers.push(semanticBlocker("simulator-validation-error", `${simulator.id}: ${error}`));
    }
    for (const warning of simulator.warnings || []) {
      warnings.push(semanticWarning("simulator-validation-warning", `${simulator.id}: ${warning}`));
    }
  }
  if (summary.ok === false) blockers.push(semanticBlocker("simulator-validation-not-ok", "simulator validation report is not ok"));
  return { ok: blockers.length === 0, blockers, warnings };
}

function safeNodeArgv(kind, input = {}) {
  const argv = input.argv || [];
  const args = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  const [cmd, script] = args;
  if (!DATA_NODE_KINDS.has(kind) || !cmd || !script) return false;
  const workspace = String(input.workspace || "");
  if (kind === "snowfakery.generate") {
    if (!workspace) return false;
    const expectedRecipe = join(workspace, "mock_data/snowfakery/structured.recipe.yml");
    const expectedOutput = join(workspace, "mock_data/snowfakery/output");
    const toolIndex = args.lastIndexOf("snowfakery");
    const recipe = toolIndex >= 0 ? args[toolIndex + 1] : script;
    const output = flagValue(args, "--output-folder");
    const format = flagValue(args, "--output-format");
    return cmd === "uv"
      && script === "run"
      && args.includes("--with")
      && args.includes("snowfakery")
      && args.includes("setuptools<81")
      && pathMatches(recipe, expectedRecipe)
      && format === "csv"
      && pathMatches(output, expectedOutput);
  }
  if (cmd !== "node" && cmd !== process.execPath) return false;
  const allowed = {
    "mock.generate": "apps/ge-demo-generator/scripts/plan-mock-data.mjs",
    "simulator.seed": "apps/ge-demo-generator/scripts/materialize-simulator-seeds.mjs",
    "simulator.validate": "apps/ge-demo-generator/scripts/validate-simulator-pack.mjs",
  }[kind];
  if (!scriptMatches(script, allowed)) return false;
  if (kind === "mock.generate") {
    if (!workspace || !pathMatches(flagValue(args, "--dir"), workspace)) return false;
    const usecase = flagValue(args, "--usecase");
    const spec = flagValue(args, "--spec");
    if (input.scenario && usecase !== input.scenario) return false;
    if (input.spec && !pathMatches(spec, input.spec)) return false;
    if (!input.scenario && !input.spec) return false;
  }
  if (kind === "simulator.seed") {
    if (!workspace || !pathMatches(flagValue(args, "--dir"), workspace)) return false;
  }
  if (kind === "simulator.validate") {
    if (flagValue(args, "--check") !== "true") return false;
    const system = flagValue(args, "--system");
    const systems = Array.isArray(input.systems) ? input.systems.map(String).filter(Boolean) : [];
    if (system && systems.length && !systems.includes(system)) return false;
  }
  return true;
}

function dataNodeArtifacts(kind, input = {}) {
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
  if (kind === "snowfakery.generate") {
    return [
      { name: "snowfakery_recipe", type: "yaml", path: join(workspace, "mock_data/snowfakery/structured.recipe.yml") },
      { name: "snowfakery_output", type: "dir", path: join(workspace, "mock_data/snowfakery/output") },
      { name: "snowfakery_realization_plan", type: "json", path: join(workspace, "mock_data/snowfakery/realization-plan.json") },
    ];
  }
  if (kind === "simulator.seed") {
    return [
      { name: "simulator_index", type: "json", path: input.index || join(workspace, "mock_data/simulators/index.json") },
      { name: "simulator_seed_report", type: "json", path: input.report || join(workspace, "mock_data/simulators/materialization-report.json") },
      { name: "simulator_seed_overlays", type: "dir", path: join(workspace, "mock_data/simulators") },
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

function validateDataNodeArtifacts(kind, options = {}) {
  if (kind === "mock.generate") return validateMockGenerate(options);
  if (kind === "snowfakery.generate") return validateSnowfakeryGenerate(options);
  if (kind === "simulator.seed") return validateSimulatorSeed(options);
  if (kind === "simulator.validate") return validateSimulatorValidate(options);
  return { ok: true, blockers: [], warnings: [] };
}

function registerDataNodeDefinition(kind, { label, buildInput, dependsOn }) {
  return registerMissionNodeDefinition({
    kind,
    runtimeKind: kind,
    label,
    taskPrefix: NODE_PREFIX[kind] || "node",
    stage: kind,
    buildInput,
    artifacts: (input = {}) => dataNodeArtifacts(kind, input),
    dependsOn,
    safeToRun: (input = {}) => safeNodeArgv(kind, input),
    validateArtifacts: (options = {}) => validateDataNodeArtifacts(kind, options),
    presentation: () => ({}),
  });
}

registerDataNodeDefinition("mock.generate", {
  label: "Generate Scenario Data Plan",
  buildInput: (context = {}) => ({
    workspace: context.workspace,
    scenario: context.scenario,
    spec: context.spec,
    argv: compact([
      "node",
      `${DEMO_ROOT}/scripts/plan-mock-data.mjs`,
      "--dir",
      context.workspace,
      context.spec ? "--spec" : context.scenario ? "--usecase" : null,
      context.spec || context.scenario,
      context.spec ? null : "--sourceMap",
      context.spec ? null : `${DEMO_ROOT}/src/use-case-source-map.generated.json`,
    ]),
  }),
  dependsOn: () => ["preflight.doctor"],
});

registerDataNodeDefinition("snowfakery.generate", {
  label: "Generate Snowfakery Rows",
  buildInput: (context = {}) => ({
    workspace: context.workspace,
    recipe: join(context.workspace, "mock_data/snowfakery/structured.recipe.yml"),
    output: join(context.workspace, "mock_data/snowfakery/output"),
    argv: snowfakeryArgv(
      join(context.workspace, "mock_data/snowfakery/structured.recipe.yml"),
      join(context.workspace, "mock_data/snowfakery/output"),
    ),
  }),
  dependsOn: () => ["mock.generate"],
});

registerDataNodeDefinition("simulator.seed", {
  label: "Materialize Simulator Seeds",
  buildInput: (context = {}) => ({
    workspace: context.workspace,
    input: join(context.workspace, "mock_data/snowfakery/output"),
    index: join(context.workspace, "mock_data/simulators/index.json"),
    report: join(context.workspace, "mock_data/simulators/materialization-report.json"),
    argv: [
      "node",
      `${DEMO_ROOT}/scripts/materialize-simulator-seeds.mjs`,
      "--dir",
      context.workspace,
    ],
  }),
  dependsOn: () => ["snowfakery.generate"],
});

registerDataNodeDefinition("simulator.validate", {
  label: "Validate Simulator Pack",
  buildInput: (context = {}) => ({
    workspace: context.workspace,
    systems: context.systems || [],
    argv: compact([
      "node",
      `${DEMO_ROOT}/scripts/validate-simulator-pack.mjs`,
      "--check",
      "true",
      (context.systems || []).length === 1 ? "--system" : null,
      (context.systems || []).length === 1 ? context.systems[0] : null,
    ]),
  }),
  dependsOn: () => ["simulator.seed"],
});

export function missionNodeDefinition(kind) {
  return DEFINITIONS.get(kind) || null;
}

export function buildMissionNode(kind, context = {}) {
  const definition = missionNodeDefinition(kind);
  if (!definition) throw new Error(`unknown mission node kind: ${kind || "<unset>"}`);
  const input = definition.buildInput ? definition.buildInput(context) : context.input || {};
  return {
    id: definition.id || kind,
    missionId: context.missionId,
    kind,
    label: definition.label || kind,
    status: context.status || "pending",
    runtimeKind: definition.runtimeKind || kind,
    input,
    dependsOn: definition.dependsOn ? definition.dependsOn(context) : [],
    artifacts: definition.artifacts ? definition.artifacts(input, context) : [],
    blockers: [],
  };
}

export function isDataMissionNodeKind(kind) {
  return DATA_NODE_KINDS.has(kind);
}

export function safeMissionNodeCommand(kind, input = {}) {
  return !!missionNodeDefinition(kind)?.safeToRun(input);
}

export function missionNodeCommand(kind, input = {}) {
  const definition = missionNodeDefinition(kind);
  const argv = Array.isArray(input.argv) ? input.argv.map(String).filter(Boolean) : [];
  if (!definition) throw new Error(`unknown mission node kind: ${kind || "<unset>"}`);
  if (!argv.length) throw new Error(`${kind} argv is required`);
  if (!definition.safeToRun(input)) throw new Error(`${kind} command is not classified safe to run`);
  const cmd = argv[0] === "node" ? process.execPath : argv[0];
  return {
    kind,
    prefix: definition.taskPrefix,
    stage: definition.stage,
    argv,
    cmd,
    args: argv.slice(1),
  };
}

export function validateMissionNodeArtifacts(kind, options = {}) {
  return missionNodeDefinition(kind)?.validateArtifacts(options) || { ok: true, blockers: [], warnings: [] };
}
