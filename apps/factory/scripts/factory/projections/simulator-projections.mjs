import { snakeCase } from "@ge/std/naming";
import { findSimulatorForSystem, loadSimulatorRegistry } from "../simulators/registry.mjs";

function nodesForSystem(graph, systemName) {
  const systemKey = snakeCase(systemName);
  return (graph.nodes || []).filter((node) => snakeCase(node.props?.sourceSystem || "") === systemKey);
}

function projectionFor(graph, source, simulator) {
  const concepts = nodesForSystem(graph, source.system);
  const rules = simulator.projection?.collectionMappings || [];
  const collectionMappings = rules.map((rule) => ({
    graphKinds: concepts
      .filter((node) => (rule.graphKinds || []).includes(node.kind))
      .map((node) => node.id),
    realizedObjects: rule.realizedObjects || [],
    simulatorCollection: rule.simulatorCollection,
    mergeMode: rule.mergeMode || simulator.schemaExtension?.mode || "merge-records-by-primary-key",
  })).filter((mapping) => mapping.simulatorCollection && (mapping.graphKinds.length || mapping.realizedObjects.length));

  return {
    simulatorId: simulator.id,
    displayName: simulator.displayName,
    sourceSystems: [source.system],
    sourceGraph: "mock_data/scenario/scenario-graph.json",
    sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
    seedOverlay: `mock_data/simulators/${simulator.id}/seed.json`,
    projectionSource: "mock_data/scenario/scenario-graph.json",
    materialization: simulator.projection?.materialization || `Project scenario graph concepts into ${simulator.displayName} collections.`,
    collectionMappings,
  };
}

function familyArchetypeAliases(family) {
  const key = snakeCase(family);
  const aliases = {
    hr_talent: ["hr_talent", "recruiting", "learning", "benefits"],
    hr_benefits: ["benefits", "hr_talent"],
    finance_procurement: ["erp_finance", "procurement", "supply_chain", "tax_treasury", "planning_epm"],
    finance_erp: ["erp_finance", "tax_treasury", "planning_epm"],
    crm_marketing: ["crm", "marketing_automation", "digital_analytics", "content_cms"],
    contract_lifecycle: ["clm"],
    it_ops_security: ["itsm", "identity", "security", "observability", "project_work", "risk_grc"],
    identity_security: ["identity", "security", "risk_grc"],
    platform_google_collaboration: ["collaboration_docs", "data_platform", "digital_analytics"],
    external_feeds: ["external_intelligence"],
  };
  return aliases[key] || [key];
}

function bridgeMatchesSimulator(bridge, simulator) {
  const archetypes = new Set((bridge?.simulatorArchetypes || bridge?.archetypes || []).map(snakeCase));
  if (!archetypes.size) return false;
  const candidates = [
    simulator.id,
    simulator.family,
    ...familyArchetypeAliases(simulator.family),
    ...(simulator.entities || []),
    ...(simulator.aliases || []),
  ].map(snakeCase);
  return candidates.some((candidate) => archetypes.has(candidate));
}

function projectionForBridge(bridge, simulator) {
  const schemaCollections = new Set(Object.keys(simulator.schema?.collections || {}));
  const collectionMappings = (bridge.simulatorCollections || bridge.collections || [])
    .filter((collection) => schemaCollections.has(collection))
    .map((collection) => ({
      graphKinds: [],
      realizedObjects: [collection],
      simulatorCollection: collection,
      mergeMode: simulator.schemaExtension?.mode || "merge-records-by-primary-key",
      bridgePackId: bridge.packId,
    }));
  if (!collectionMappings.length) return null;
  return {
    simulatorId: simulator.id,
    displayName: simulator.displayName,
    sourceSystems: [],
    sourceGraph: "mock_data/scenario/scenario-graph.json",
    sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
    seedOverlay: `mock_data/simulators/${simulator.id}/seed.json`,
    projectionSource: "mock_data/scenario/scenario-graph.json",
    materialization: `Project scenario pack ${bridge.packId} bridge collections into ${simulator.displayName}.`,
    collectionMappings,
    packBridges: [bridge],
  };
}

function mergeProjection(existing, next) {
  if (!existing) return next;
  const byCollection = new Map((existing.collectionMappings || []).map((mapping) => [mapping.simulatorCollection, { ...mapping }]));
  for (const mapping of next.collectionMappings || []) {
    const current = byCollection.get(mapping.simulatorCollection) || {
      simulatorCollection: mapping.simulatorCollection,
      graphKinds: [],
      realizedObjects: [],
      mergeMode: mapping.mergeMode,
    };
    current.graphKinds = Array.from(new Set([...(current.graphKinds || []), ...(mapping.graphKinds || [])]));
    current.realizedObjects = Array.from(new Set([...(current.realizedObjects || []), ...(mapping.realizedObjects || [])]));
    current.mergeMode = current.mergeMode || mapping.mergeMode;
    byCollection.set(mapping.simulatorCollection, current);
  }
  return {
    ...existing,
    sourceSystems: Array.from(new Set([...(existing.sourceSystems || []), ...(next.sourceSystems || [])])),
    packBridges: Array.from(new Map([...(existing.packBridges || []), ...(next.packBridges || [])].map((bridge) => [bridge.packId, bridge])).values()),
    collectionMappings: [...byCollection.values()],
  };
}

export function buildSimulatorProjections({ graph, sources, packBridges = [], registry = loadSimulatorRegistry() }) {
  const bySimulator = new Map();
  for (const source of sources || []) {
    const simulator = findSimulatorForSystem(source.system, registry);
    if (!simulator?.projection?.collectionMappings?.length) continue;
    bySimulator.set(simulator.id, mergeProjection(bySimulator.get(simulator.id), projectionFor(graph, source, simulator)));
  }
  for (const bridge of packBridges || []) {
    for (const simulator of registry.simulators || []) {
      if (!bySimulator.has(simulator.id)) continue;
      if (!bridgeMatchesSimulator(bridge, simulator)) continue;
      const projection = projectionForBridge(bridge, simulator);
      if (projection) bySimulator.set(simulator.id, mergeProjection(bySimulator.get(simulator.id), projection));
    }
  }
  return [...bySimulator.values()];
}
