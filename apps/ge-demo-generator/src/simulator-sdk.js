import { join } from "node:path";

const DEMO_ROOT = "apps/ge-demo-generator";
const DEFAULT_SOURCE_MAP = `${DEMO_ROOT}/src/use-case-source-map.generated.json`;

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item != null);
  if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function slug(value, fallback = "scenario") {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
}

function getGenerationSpec(spec) {
  return spec?.generationSpec || spec?.spec || spec?.agentSpec || spec || {};
}

function inferSourceSystems(spec) {
  const generationSpec = getGenerationSpec(spec);
  return asArray(generationSpec.sourceSystems).map((system) => ({
    id: system.id || slug(system.name, "source-system").replaceAll("-", "_"),
    name: system.name || system.id || "Source System",
  })).filter((system) => system.id);
}

export function indexSimulatorRegistry(registry = {}) {
  const byId = new Map();
  const byAlias = new Map();
  for (const simulator of asArray(registry.simulators)) {
    if (!simulator?.id) continue;
    byId.set(simulator.id, simulator);
    for (const alias of [simulator.id, simulator.displayName, ...asArray(simulator.aliases)]) {
      const key = slug(alias, "").replaceAll("-", "_");
      if (key) byAlias.set(key, simulator);
    }
  }
  return { byId, byAlias };
}

export function resolveExistingSimulator(intent, registry = {}) {
  const index = indexSimulatorRegistry(registry);
  const candidates = [
    intent?.simulator?.id,
    intent?.simulator?.displayName,
    ...asArray(intent?.simulator?.aliases),
    ...asArray(intent?.requestedSystems),
  ].map((item) => slug(item, "").replaceAll("-", "_")).filter(Boolean);
  for (const candidate of candidates) {
    if (index.byId.has(candidate)) return index.byId.get(candidate);
    if (index.byAlias.has(candidate)) return index.byAlias.get(candidate);
  }
  return null;
}

function inferUsecaseId(spec, fallback = null) {
  return slug(spec?.id || spec?.useCaseId || getGenerationSpec(spec).id || getGenerationSpec(spec).useCaseId || fallback, "scenario");
}

function inferWorkspace({ spec, usecaseId, workspace }) {
  return workspace || join(".ge", "missions", inferUsecaseId(spec, usecaseId));
}

export function normalizeSimulatorIntent({ spec = {}, simulator = {}, workspace = null, usecaseId = null, sourceMap = DEFAULT_SOURCE_MAP } = {}) {
  const systems = inferSourceSystems(spec);
  const systemIds = new Set(systems.map((system) => system.id));
  const simulatorId = simulator.id || simulator.systemId || systems[0]?.id || slug(simulator.displayName || simulator.name, "source-system").replaceAll("-", "_");
  const displayName = simulator.displayName || simulator.name || systems.find((system) => system.id === simulatorId)?.name || simulatorId;
  const scenario = inferUsecaseId(spec, usecaseId);
  const resolvedWorkspace = inferWorkspace({ spec, usecaseId: scenario, workspace });
  const requestedSystems = asArray(simulator.systems || simulatorId).map((system) => String(system).replace(/[^a-zA-Z0-9_./-]+/g, "_"));

  return {
    scenario,
    workspace: resolvedWorkspace,
    sourceMap,
    systems,
    requestedSystems,
    simulator: {
      id: simulatorId,
      displayName,
      archetype: simulator.archetype || "generic",
      realism: simulator.realism || "starter",
      objects: asArray(simulator.objects),
      workflows: asArray(simulator.workflows),
      scale: Number(simulator.scale || getGenerationSpec(spec).dataVolume?.targetRows || 1000),
      createIfMissing: simulator.createIfMissing !== false,
    },
    scope: {
      entities: asArray(getGenerationSpec(spec).entities || getGenerationSpec(spec).dataContracts).map((entity) => ({
        sourceSystemId: entity.sourceSystemId || null,
        name: entity.name || entity.id || null,
        primaryKey: entity.primaryKey || null,
      })),
      documents: asArray(getGenerationSpec(spec).documents).map((document) => ({
        id: document.id || document.name || null,
        sourceSystemId: document.sourceSystemId || null,
        format: document.format || document.type || "md",
      })),
      toolIntents: asArray(getGenerationSpec(spec).behaviorContract?.toolIntents).map((tool) => ({
        name: tool.name,
        kind: tool.kind,
        sourceSystemId: tool.sourceSystemId || null,
      })),
    },
    warnings: systemIds.size && !systemIds.has(simulatorId)
      ? [`simulator ${simulatorId} is not declared in generationSpec.sourceSystems`]
      : [],
  };
}

export function simulatorSdkPlan({ spec = {}, simulator = {}, workspace = null, usecaseId = null, sourceMap = DEFAULT_SOURCE_MAP, registry = null } = {}) {
  const intent = normalizeSimulatorIntent({ spec, simulator, workspace, usecaseId, sourceMap });
  const existingSimulator = registry ? resolveExistingSimulator(intent, registry) : null;
  const effectiveSimulatorId = existingSimulator?.id || intent.simulator.id;
  const effectiveSimulatorName = existingSimulator?.displayName || intent.simulator.displayName;
  const lifecycleMode = existingSimulator ? "use_existing" : (intent.simulator.createIfMissing ? "scaffold_missing" : "missing_blocked");
  const mockArgv = [
    "node",
    `${DEMO_ROOT}/scripts/plan-mock-data.mjs`,
    "--dir",
    intent.workspace,
    "--usecase",
    intent.scenario,
    "--sourceMap",
    intent.sourceMap,
  ];
  const snowfakeryArgv = [
    "uv",
    "run",
    "--with",
    "snowfakery",
    "--with",
    "setuptools<81",
    "snowfakery",
    join(intent.workspace, "mock_data/snowfakery/structured.recipe.yml"),
    "--output-format",
    "csv",
    "--output-folder",
    join(intent.workspace, "mock_data/snowfakery/output"),
  ];
  const seedArgv = [
    "node",
    `${DEMO_ROOT}/scripts/materialize-simulator-seeds.mjs`,
    "--dir",
    intent.workspace,
  ];
  const validateArgv = [
    "node",
    `${DEMO_ROOT}/scripts/validate-simulator-pack.mjs`,
    "--check",
    "true",
    "--system",
    intent.simulator.id,
  ];
  const scaffoldArgv = [
    "node",
    `${DEMO_ROOT}/scripts/scaffold-simulator-pack.mjs`,
    "--id",
    effectiveSimulatorId,
    "--name",
    effectiveSimulatorName,
    "--archetype",
    intent.simulator.archetype,
    "--realism",
    intent.simulator.realism,
  ];

  const warnings = [
    ...intent.warnings,
    ...(lifecycleMode === "missing_blocked" ? [`simulator ${effectiveSimulatorId} is missing and createIfMissing is false`] : []),
  ];

  return {
    ok: warnings.length === 0,
    sdk: "ge-simulator-sdk",
    skill: "building-simulators",
    scenario: intent.scenario,
    workspace: intent.workspace,
    simulator: {
      ...intent.simulator,
      id: effectiveSimulatorId,
      displayName: effectiveSimulatorName,
      existing: Boolean(existingSimulator),
      registryEntry: existingSimulator ? {
        id: existingSimulator.id,
        displayName: existingSimulator.displayName,
        maturity: existingSimulator.maturity || null,
        family: existingSimulator.family || null,
        schemaPath: existingSimulator.schemaPath || null,
        toolsPath: existingSimulator.toolsPath || null,
        materializationPath: existingSimulator.materializationPath || null,
      } : null,
    },
    lifecycleMode,
    warnings,
    scope: intent.scope,
    commands: {
      scaffold: lifecycleMode === "scaffold_missing" ? scaffoldArgv : null,
      mockGenerate: mockArgv,
      snowfakeryGenerate: snowfakeryArgv,
      simulatorSeed: seedArgv,
      simulatorValidate: [
        "node",
        `${DEMO_ROOT}/scripts/validate-simulator-pack.mjs`,
        "--check",
        "true",
        "--system",
        effectiveSimulatorId,
      ],
    },
    missionNodes: [
      { id: "mock.generate", kind: "mock.generate", argv: mockArgv },
      { id: "snowfakery.generate", kind: "snowfakery.generate", argv: snowfakeryArgv },
      { id: "simulator.seed", kind: "simulator.seed", argv: seedArgv },
      { id: "simulator.validate", kind: "simulator.validate", argv: [
        "node",
        `${DEMO_ROOT}/scripts/validate-simulator-pack.mjs`,
        "--check",
        "true",
        "--system",
        effectiveSimulatorId,
      ], systems: [effectiveSimulatorId] },
    ],
    artifacts: {
      dataPlan: join(intent.workspace, "mock_data/plan/data-plan.json"),
      scenarioGraph: join(intent.workspace, "mock_data/scenario/scenario-graph.json"),
      snowfakeryRecipe: join(intent.workspace, "mock_data/snowfakery/structured.recipe.yml"),
      snowfakeryRealizationPlan: join(intent.workspace, "mock_data/snowfakery/realization-plan.json"),
      snowfakeryOutput: join(intent.workspace, "mock_data/snowfakery/output"),
      simulatorIndex: join(intent.workspace, "mock_data/simulators/index.json"),
      simulatorSeedReport: join(intent.workspace, "mock_data/simulators/materialization-report.json"),
      blobObjectPlan: join(intent.workspace, "mock_data/blobs/object-plan.yaml"),
      blobManifest: join(intent.workspace, "mock_data/blobs/manifest.yaml"),
      documentsManifest: join(intent.workspace, "mock_data/blobs/documents_manifest.ndjson"),
      blobObjects: join(intent.workspace, "mock_data/blobs/gcs/objects"),
      cloudDocumentsManifest: join(intent.workspace, "mock_data/cloud/bigquery/ndjson/documents_manifest.jsonl"),
    },
    nextSteps: [
      "Read skills/building-simulators/SKILL.md and references/mock-data-and-simulators.md.",
      existingSimulator
        ? `Use existing simulator ${existingSimulator.id}; do not scaffold a duplicate.`
        : "If scaffold is needed, run commands.scaffold first and validate the simulator pack.",
      "Treat generationSpec.documents and generated .md files as unstructured evidence artifacts; keep them in fixture/GCS blob manifests and cite them from evals/tools.",
      "Prefer mission/runtime execution for mockGenerate, snowfakeryGenerate, simulatorSeed, and simulatorValidate so resume and artifact validation are preserved.",
      "Repair the spec or simulator pack when validation fails; do not hand-edit generated CSVs as the durable fix.",
    ],
  };
}
