import { matchScenarioPacks, listScenarioPacks } from "./index.mjs";
import { canonicalSystemId, snakeCase } from "@ge/std/naming";
import { DEPARTMENT_PACKS, departmentPackForUseCase, domainPackForUseCase, domainPacksFromCatalog } from "./taxonomy.mjs";

function systemIds(useCase) {
  const systems = useCase.generationSpec?.sourceSystems?.length
    ? useCase.generationSpec.sourceSystems.map((system) => system.id || system.name)
    : useCase.systems || [];
  return [...new Set(systems.map(canonicalSystemId).filter(Boolean))];
}

function entityNames(useCase) {
  return (useCase.generationSpec?.entities || []).map((entity) => snakeCase(entity.name)).filter(Boolean);
}

function toolKinds(useCase) {
  const intents = useCase.generationSpec?.behaviorContract?.toolIntents || [];
  return [...new Set(intents.map((intent) => intent.kind).filter(Boolean))];
}

function makeContext(useCase) {
  const spec = useCase.generationSpec || {};
  return {
    useCase,
    schema: {
      domain: useCase.department || "general",
      systems: spec.sourceSystems || [],
      tables: (spec.entities || []).map((entity) => ({
        name: entity.name,
        columns: entity.columns || [],
        _sourceSystemId: entity.sourceSystemId,
      })),
      useCaseSpec: {
        id: useCase.id,
        title: useCase.title,
        department: useCase.department,
        behaviorContract: spec.behaviorContract || null,
      },
    },
    contract: spec.behaviorContract || null,
    employeeIds: [],
  };
}

function increment(map, key, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

function topEntries(map, limit = 8) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id, count]) => ({ id, count }));
}

function summarizeUseCases(useCases) {
  const systems = {};
  const entities = {};
  const toolKindCounts = {};
  const capabilities = {};
  for (const useCase of useCases) {
    for (const system of systemIds(useCase)) increment(systems, system);
    for (const entity of entityNames(useCase)) increment(entities, entity);
    for (const kind of toolKinds(useCase)) increment(toolKindCounts, kind);
    const text = [
      useCase.title,
      useCase.generationSpec?.behaviorContract?.primaryObjective,
      ...(useCase.generationSpec?.entities || []).map((entity) => entity.name),
      ...(useCase.generationSpec?.sourceSystems || []).map((system) => system.name || system.id),
    ].join(" ").toLowerCase();
    if (/dashboard|analytics|metric|score|forecast|model|trend|kpi/.test(text)) increment(capabilities, "analytics");
    if (/approve|approval|submit|create|publish|notify|route|assign|remediate|recommend/.test(text)) increment(capabilities, "workflow_action");
    if (/document|policy|guide|contract|sop|knowledge|content|brief|copy/.test(text)) increment(capabilities, "document_grounding");
    if (/risk|compliance|control|audit|security|threat|vulnerab/.test(text)) increment(capabilities, "risk_compliance");
  }
  return {
    commonSystems: topEntries(systems),
    commonEntities: topEntries(entities),
    toolKinds: topEntries(toolKindCounts, 6),
    capabilityHints: topEntries(capabilities, 8),
  };
}

export function analyzePackCoverage(useCases, domainCatalog = []) {
  const scenarioPackMetadata = listScenarioPacks();
  const scenarioPackById = new Map(scenarioPackMetadata.map((pack) => [pack.id, pack]));
  const useCasesByDepartment = new Map();
  const useCasesByDomainId = new Map();
  for (const useCase of useCases) {
    const dept = useCase.department || "general";
    if (!useCasesByDepartment.has(dept)) useCasesByDepartment.set(dept, []);
    useCasesByDepartment.get(dept).push(useCase);
    if (useCase.domainId) {
      if (!useCasesByDomainId.has(useCase.domainId)) useCasesByDomainId.set(useCase.domainId, []);
      useCasesByDomainId.get(useCase.domainId).push(useCase);
    }
  }
  const rows = useCases.map((useCase) => {
    const context = makeContext(useCase);
    const departmentPack = departmentPackForUseCase(useCase);
    const domainPack = domainPackForUseCase(useCase, domainCatalog);
    const scenarioPacks = matchScenarioPacks(context).map((pack) => pack.id);
    const depth = {
      classification: scenarioPacks.length > 0,
      fixtureRecipe: scenarioPacks.some((packId) => scenarioPackById.get(packId)?.depth?.fixtureRecipe),
      evalEnrichment: scenarioPacks.some((packId) => scenarioPackById.get(packId)?.depth?.evalEnrichment),
      instructionEnrichment: scenarioPacks.some((packId) => scenarioPackById.get(packId)?.depth?.instructionEnrichment),
      simulatorBridge: scenarioPacks.some((packId) => scenarioPackById.get(packId)?.depth?.simulatorBridge),
    };
    return {
      id: useCase.id,
      title: useCase.title,
      department: useCase.department || "general",
      departmentPack: departmentPack?.id || null,
      domainPack: domainPack?.id || null,
      scenarioPacks,
      simulatorArchetypes: [...new Set(scenarioPacks.flatMap((packId) => scenarioPackById.get(packId)?.simulatorInterop?.archetypes || []))],
      simulatorCollections: [...new Set(scenarioPacks.flatMap((packId) => scenarioPackById.get(packId)?.simulatorInterop?.collections || []))],
      packs: [departmentPack?.id, domainPack?.id, ...scenarioPacks].filter(Boolean),
      systems: systemIds(useCase),
      entities: entityNames(useCase),
      toolKinds: toolKinds(useCase),
      hasBehaviorContract: Boolean(useCase.generationSpec?.behaviorContract),
      recipeDepth: depth,
    };
  });

  const byDepartment = {};
  const uncoveredSystems = {};
  const uncoveredEntities = {};
  const packCounts = {};
  const scenarioPackCounts = {};
  const simulatorArchetypeCounts = {};
  const simulatorCollectionCounts = {};
  const unbridgedScenarioPackCounts = {};
  for (const row of rows) {
    const dept = byDepartment[row.department] ||= { total: 0, covered: 0, uncovered: 0 };
    dept.total += 1;
    if (row.domainPack && row.departmentPack) dept.covered += 1;
    else dept.uncovered += 1;
    for (const packId of row.packs) increment(packCounts, packId);
    for (const packId of row.scenarioPacks) increment(scenarioPackCounts, packId);
    for (const archetype of row.simulatorArchetypes) increment(simulatorArchetypeCounts, archetype);
    for (const collection of row.simulatorCollections) increment(simulatorCollectionCounts, collection);
    for (const packId of row.scenarioPacks) {
      if (!scenarioPackById.get(packId)?.simulatorInterop) increment(unbridgedScenarioPackCounts, packId);
    }
    if (!row.scenarioPacks.length) {
      for (const system of row.systems) increment(uncoveredSystems, system);
      for (const entity of row.entities) increment(uncoveredEntities, entity);
    }
  }
  const taxonomyCovered = rows.filter((row) => row.departmentPack && row.domainPack).length;
  const scenarioCovered = rows.filter((row) => row.scenarioPacks.length).length;
  const depthCoverage = {
    classification: rows.filter((row) => row.recipeDepth.classification).length,
    fixtureRecipe: rows.filter((row) => row.recipeDepth.fixtureRecipe).length,
    evalEnrichment: rows.filter((row) => row.recipeDepth.evalEnrichment).length,
    instructionEnrichment: rows.filter((row) => row.recipeDepth.instructionEnrichment).length,
    simulatorBridge: rows.filter((row) => row.recipeDepth.simulatorBridge).length,
  };
  const depthCoveragePct = Object.fromEntries(Object.entries(depthCoverage).map(([key, value]) => [
    key,
    rows.length ? Number(((value / rows.length) * 100).toFixed(2)) : 0,
  ]));

  return {
    generatedAt: new Date().toISOString(),
    packs: {
      departments: DEPARTMENT_PACKS.map((pack) => ({
        ...pack,
        ...(summarizeUseCases(useCasesByDepartment.get(pack.department) || [])),
      })),
      domains: domainPacksFromCatalog(domainCatalog).map((pack) => ({
        ...pack,
        ...(summarizeUseCases(useCasesByDomainId.get(`domain-${pack.domainNumber}`) || [])),
      })),
      scenarios: scenarioPackMetadata,
    },
    totals: {
      total: rows.length,
      taxonomyCovered,
      taxonomyUncovered: rows.length - taxonomyCovered,
      taxonomyCoveragePct: rows.length ? Number(((taxonomyCovered / rows.length) * 100).toFixed(2)) : 0,
      scenarioCovered,
      scenarioUncovered: rows.length - scenarioCovered,
      scenarioCoveragePct: rows.length ? Number(((scenarioCovered / rows.length) * 100).toFixed(2)) : 0,
      depthCoverage,
      depthCoveragePct,
    },
    byDepartment,
    packCounts,
    scenarioPackCounts,
    simulatorInterop: {
      bridgedScenarioPacks: scenarioPackMetadata.filter((pack) => pack.simulatorInterop).length,
      totalScenarioPacks: scenarioPackMetadata.length,
      archetypeCounts: simulatorArchetypeCounts,
      collectionCounts: simulatorCollectionCounts,
      unbridgedScenarioPackCounts,
    },
    topUncoveredSystems: Object.entries(uncoveredSystems).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([id, count]) => ({ id, count })),
    topUncoveredEntities: Object.entries(uncoveredEntities).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([id, count]) => ({ id, count })),
    taxonomyUncovered: rows.filter((row) => !row.departmentPack || !row.domainPack),
    scenarioUncovered: rows.filter((row) => row.scenarioPacks.length === 0),
    rows,
  };
}
