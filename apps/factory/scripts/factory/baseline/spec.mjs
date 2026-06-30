import {
  isModelProvider,
  systemId,
  entityNamesFor,
  protocolFor,
  datastoreFor,
} from "./systems.mjs";
import { columnsFor, rowCountFor } from "./columns.mjs";
import { pickDocument, pickAction, generateBehaviorContract } from "./behavior-contract.mjs";

// ── Generation spec synthesis ───────────────────────────────────────────────

export function generateSpec(useCase) {
  const rawSystems = (useCase.systems || []).filter((s) => !isModelProvider(s));
  if (rawSystems.length === 0) {
    rawSystems.push(`${useCase.department} system`);
  }
  // Dedup by id
  const seen = new Set();
  const sourceSystems = [];
  for (const name of rawSystems) {
    const id = systemId(name);
    if (seen.has(id)) continue;
    seen.add(id);
    const ents = entityNamesFor(name, id);
    sourceSystems.push({
      id,
      name,
      owns: ents,
      protocol: protocolFor(name),
      localBacking: [datastoreFor(name)],
      toolNames: ents.map((e) => `query_${id}_${e}`),
      evidence: ["source_system_record", "generated_audit_trail"],
    });
  }
  // Ensure ≥3 sourceSystems by padding generic entries from architecture connections
  while (sourceSystems.length < 3) {
    const i = sourceSystems.length;
    const synthetic = `${useCase.department}_${i + 1}`;
    sourceSystems.push({
      id: synthetic,
      name: `${useCase.department.toUpperCase()} ${i + 1}`,
      owns: [`${synthetic}_records`, `${synthetic}_events`],
      protocol: "REST API",
      localBacking: ["alloydb"],
      toolNames: [`query_${synthetic}_records`],
      evidence: ["source_system_record"],
    });
  }

  // Entities: 2-3 per source system, dedup by name (entity name is global, must be unique)
  const entityNames = new Set();
  const entities = [];
  for (const sys of sourceSystems) {
    for (const ent of sys.owns.slice(0, 3)) {
      if (entityNames.has(ent)) continue;
      entityNames.add(ent);
      entities.push({
        name: ent,
        sourceSystemId: sys.id,
        datastore: sys.localBacking[0] === "cloud-storage" ? "alloydb" : sys.localBacking[0],
        rowCount: rowCountFor(ent),
        primaryKey: "id",
        columns: columnsFor(ent),
      });
    }
  }

  // Relationships: link audit/event tables to a primary entity of same system
  const relationships = [];
  for (const sys of sourceSystems) {
    const owned = entities.filter((e) => e.sourceSystemId === sys.id);
    const primary = owned.find((e) => !/audit|event|trail|history|log/.test(e.name));
    const child = owned.find((e) => /audit|event|trail|history|log/.test(e.name));
    if (primary && child && primary !== child) {
      // Add a ref column to child if not already
      const hasFk = child.columns.some((c) => c.type === "ref");
      if (!hasFk) {
        child.columns.push({ name: `${primary.name.replace(/s$/, "")}_id`, type: "ref", ref: `${primary.name}.id`, required: true });
      }
      relationships.push({ from: `${child.name}.${primary.name.replace(/s$/, "")}_id`, to: `${primary.name}.id`, cardinality: "many-to-one", orphanPolicy: "none" });
    }
  }

  // Document
  const docMeta = pickDocument(useCase);
  const documents = [{
    id: docMeta.id,
    sourceSystemId: sourceSystems.find((s) => s.localBacking?.[0] === "bigquery")?.id || sourceSystems[0].id,
    type: docMeta.type,
    title: docMeta.title,
    requiredSections: docMeta.sections,
    linkedEntities: entities.slice(0, 3).map((e) => e.name),
    minimumWordCount: 500,
    citationAnchors: docMeta.anchors,
  }];

  // Anomaly (from first KPI)
  const kpi = (useCase.kpis || [])[0];
  const anomalies = [{
    id: `${useCase.id}-baseline-gap`,
    description: kpi
      ? `Seed a realistic gap where ${kpi.label} sits between ${kpi.before} and ${kpi.after}, so the agent can detect, narrate, and recommend remediation.`
      : `Seed a realistic baseline gap so the agent has a clear discovery path.`,
    affectedEntities: entities.slice(0, 2).map((e) => e.name),
    discoveryPath: [
      `Inspect ${sourceSystems[0].name} records for the affected entities`,
      `Compare against ${sourceSystems[1]?.name || sourceSystems[0].name} historical baseline`,
      "Generate a citation-backed recommendation",
    ],
    expectedEvidence: ["source-system record", "historical baseline metric", "generated audit trail"],
    expectedRecommendation: `Explain the gap, cite supporting evidence, and propose the next ${useCase.persona || "operator"} action.`,
  }];

  // APIs: emit one per action intent (audit requires apis non-empty when action exists)
  const apis = [];
  const actionVerb = pickAction(useCase.agentification, useCase.persona || "Operator", useCase.title);
  if (actionVerb) {
    const actionSystem = sourceSystems.find((s) => s.localBacking[0] !== "bigquery") || sourceSystems[0];
    apis.push({
      id: `${actionSystem.id}_${actionVerb}_api`,
      sourceSystemId: actionSystem.id,
      method: "POST",
      path: `/api/${actionSystem.id}/${actionVerb}`,
      description: `Synchronous endpoint the agent calls to ${actionVerb.replace(/_/g, " ")} in ${actionSystem.name} after evidence gating.`,
      requestSchema: { target_id: "string", rationale: "string", metadata: "object" },
      responseSchema: { action_id: "string", status: "string", audit_record_id: "string" },
      idempotencyKey: "target_id+rationale",
    });
  }

  // Datastore packaging
  const dataset = `${useCase.department}_${useCase.id.replace(/-/g, "_")}`;
  const datastorePackaging = {
    alloydb: { database: useCase.id.replace(/-/g, "_"), schemas: sourceSystems.filter((s) => s.localBacking[0] !== "bigquery").map((s) => s.id) },
    bigquery: { dataset, tables: ["kpi_summary", "evidence_index"] },
    cloudStorage: { bucketSuffix: `${useCase.id}-evidence`, prefixes: ["documents", "audit-trails", "exports"] },
    apis: { serviceName: `${useCase.id}-source-adapters`, deploymentTarget: "cloud_run" },
  };

  // Validation block
  const validation = {
    smokePrompt: `Run the ${useCase.title} workflow and cite source-system evidence for every claim.`,
    expectedAnswer: ["uses canonical source-system tools", "cites the governing document", "names the next operator action"],
    assertions: ["canonical source-system tool names", "minimum row policy met", "audit trail emitted on actions", "evidence_lookup invoked before recommendations"],
  };

  const behaviorContract = generateBehaviorContract(useCase, sourceSystems);

  return {
    version: 1,
    rowPolicy: {
      defaultRowsPerEntity: 50,
      minimumRowsPerEntity: 25,
      seed: 42,
      rationale: `Row counts sized for ${useCase.title} so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.`,
    },
    sourceSystems,
    entities,
    relationships,
    documents,
    apis,
    anomalies,
    datastorePackaging,
    validation,
    behaviorContract: "__BEHAVIOR_CONTRACT_REF__",
  };
}
