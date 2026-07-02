import { snakeCase } from "@ge/std/naming";
import { sourceTimestamp } from "../../src/source-clock.js";

function stableId(prefix, ...parts) {
  const suffix = snakeCase(parts.filter(Boolean).join("_")).slice(0, 72) || "default";
  return `${prefix}_${suffix}`;
}

function sourceText(source = {}) {
  return `${source.system || ""} ${source.description || ""} ${source.direction || ""}`.toLowerCase();
}

function graphNode(id, kind, label, props = {}) {
  return { id, kind, label, props };
}

function graphEdge(from, to, kind, props = {}) {
  return { from, to, kind, props };
}

function inferSourceConcepts(source = {}) {
  const text = sourceText(source);
  const concepts = [];
  if (/workday|employee|worker|hris|benefit|life event|dependent/.test(text)) {
    concepts.push("workforce", "worker", "employment", "life_event");
  }
  if (/servicenow|ticket|incident|request|cmdb|approval|sla/.test(text)) {
    concepts.push("service_management", "request", "approval", "sla");
  }
  if (/sap|invoice|journal|gl|payment|vendor|finance|budget|forecast/.test(text)) {
    concepts.push("finance", "ledger", "budget", "approval");
  }
  if (/coupa|ariba|supplier|procure|purchase|sourcing|contract/.test(text)) {
    concepts.push("procurement", "supplier", "purchase_order", "contract");
  }
  if (/salesforce|hubspot|crm|account|opportunity|lead|campaign/.test(text)) {
    concepts.push("customer", "account", "opportunity", "activity");
  }
  if (/document|policy|drive|docs|pdf|knowledge/.test(text)) {
    concepts.push("document", "citation");
  }
  if (/bigquery|analytics|metric|score|dashboard|looker/.test(text)) {
    concepts.push("metric", "fact", "snapshot");
  }
  return Array.from(new Set(concepts.length ? concepts : ["source_record"]));
}

function outcomeNode(useCase = {}) {
  const kpi = useCase.kpis?.[0] || {};
  return graphNode(
    stableId("outcome", useCase.id, kpi.label || "primary"),
    "business_outcome",
    kpi.label || useCase.title || "Primary outcome",
    {
      before: kpi.before || null,
      after: kpi.after || null,
      department: useCase.department || null,
    }
  );
}

function personaNode(useCase = {}) {
  return graphNode(
    stableId("persona", useCase.persona || useCase.department || "operator"),
    "actor",
    useCase.persona || `${useCase.department || "Business"} Operator`,
    {
      department: useCase.department || null,
      role: "operator",
    }
  );
}

function canonicalSystemNode(source = {}) {
  return graphNode(
    stableId("system", source.system || "source"),
    "source_system",
    source.system || "Source System",
    {
      direction: source.direction || null,
      protocol: source.protocol || null,
      dataKind: source.dataKind || source.sourceKind || null,
      datastore: source.target?.datastore || null,
      datastoreClass: source.target?.class || null,
      primaryStore: source.target?.primary || null,
      description: source.description || "",
    }
  );
}

function conceptNode(source = {}, concept) {
  return graphNode(
    stableId("concept", source.system, concept),
    concept,
    concept.replace(/_/g, " "),
    {
      sourceSystem: source.system || null,
      direction: source.direction || null,
      datastore: source.target?.datastore || null,
      datastoreClass: source.target?.class || null,
    }
  );
}

export function buildScenarioGraph(useCase = {}, sources = []) {
  const nodesById = new Map();
  const edges = [];
  const addNode = (node) => {
    if (!nodesById.has(node.id)) nodesById.set(node.id, node);
    else nodesById.set(node.id, { ...nodesById.get(node.id), props: { ...nodesById.get(node.id).props, ...node.props } });
    return node;
  };
  const addEdge = (edge) => edges.push(edge);

  const scenario = graphNode(
    stableId("scenario", useCase.id || useCase.title || "scenario"),
    "scenario",
    useCase.title || useCase.id || "Generated scenario",
    {
      useCaseId: useCase.id || null,
      department: useCase.department || null,
      sourceSlide: useCase.path || null,
      primaryObjective: useCase.behaviorContract?.primaryObjective || useCase.description || null,
    }
  );
  const persona = personaNode(useCase);
  const outcome = outcomeNode(useCase);
  addNode(scenario);
  addNode(persona);
  addNode(outcome);
  addEdge(graphEdge(persona.id, scenario.id, "operates"));
  addEdge(graphEdge(scenario.id, outcome.id, "targets"));

  for (const source of sources) {
    const system = canonicalSystemNode(source);
    addNode(system);
    addEdge(graphEdge(scenario.id, system.id, "uses_source", { direction: source.direction || null }));
    for (const concept of inferSourceConcepts(source)) {
      const node = conceptNode(source, concept);
      addNode(node);
      addEdge(graphEdge(system.id, node.id, "provides"));
      addEdge(graphEdge(node.id, outcome.id, "supports"));
    }
  }

  const behavior = useCase.behaviorContract || useCase.generationSpec?.behaviorContract || null;
  const packBridges = behavior?.simulatorEnrichment?.packBridges || useCase.packBridges || [];
  for (const bridge of packBridges) {
    if (!bridge?.packId) continue;
    const bridgeNode = graphNode(
      stableId("pack_bridge", bridge.packId),
      "simulator_pack_bridge",
      bridge.packId,
      {
        simulatorArchetypes: bridge.simulatorArchetypes || [],
        simulatorCollections: bridge.simulatorCollections || [],
        materializes: bridge.materializes || "",
      }
    );
    addNode(bridgeNode);
    addEdge(graphEdge(scenario.id, bridgeNode.id, "enriches_simulator_seed"));
    for (const collection of bridge.simulatorCollections || []) {
      const collectionNode = graphNode(
        stableId("simulator_collection", bridge.packId, collection),
        "simulator_collection",
        collection,
        {
          packId: bridge.packId,
          collection,
          simulatorArchetypes: bridge.simulatorArchetypes || [],
        }
      );
      addNode(collectionNode);
      addEdge(graphEdge(bridgeNode.id, collectionNode.id, "materializes_collection"));
      addEdge(graphEdge(collectionNode.id, outcome.id, "supports"));
    }
  }

  for (const intent of behavior?.toolIntents || []) {
    if (!intent?.name) continue;
    const tool = graphNode(
      stableId("tool_intent", intent.sourceSystemId, intent.name),
      "tool_intent",
      intent.name,
      {
        kind: intent.kind || null,
        sourceSystemId: intent.sourceSystemId || null,
        requiredInputs: intent.requiredInputs || [],
        description: intent.description || "",
      }
    );
    addNode(tool);
    addEdge(graphEdge(scenario.id, tool.id, "expects_tool"));
  }

  return {
    id: stableId("scenario_graph", useCase.id || useCase.title || "scenario"),
    version: 1,
    generatedAt: sourceTimestamp(),
    scenario: scenario.id,
    nodes: [...nodesById.values()],
    edges,
  };
}

export function graphNodesByKind(graph, kinds = []) {
  const wanted = new Set(kinds);
  return (graph?.nodes || []).filter((node) => wanted.has(node.kind));
}
