// Legacy (heuristic) schema derivation for use cases without an explicit
// generationSpec. Extracted from factory.mjs verbatim. Given a use-case shape
// (systems + architecture connections + KPIs), it infers a set of source-system
// tables from known system patterns, builds a use-case spec, enriches it with a
// scenario pack, and attaches an agent quality plan. Use cases that DO carry a
// generationSpec.entities list are delegated to deriveSchemaFromGenerationSpec.
//
// buildAgentQualityPlan is injected (it also drives the agent.py emitter, so it
// stays in factory.mjs) — same pattern as deriveSchemaFromGenerationSpec.

import { canonicalSystemId, snakeCase } from "@ge/std/naming";
import { enrichScenarioSpec } from "../packs/index.mjs";
import { deriveColumnsForEntity } from "./entity-column-schemas.mjs";
import { deriveSchemaFromGenerationSpec } from "./schema-from-generation-spec.mjs";

// Known source systems → table prefix + canonical entity names. First substring
// match wins (see matchSystem), so order is significant for overlapping keys.
const SYSTEM_TABLE_PATTERNS = {
  "workday": { prefix: "WD", entities: ["employees", "jobs", "compensation", "org_structure"] },
  "benefitfocus": { prefix: "BEN", entities: ["benefit_plans", "enrollments", "eligibility_rules", "carrier_sync_events"] },
  "benefits platform": { prefix: "BEN", entities: ["benefit_plans", "enrollments", "eligibility_rules", "carrier_sync_events"] },
  "sap": { prefix: "SAP", entities: ["transactions", "gl_entries", "vendors", "purchase_orders"] },
  "bigquery": { prefix: "BQ", entities: ["analytics", "historical_data", "metrics"] },
  "servicenow": { prefix: "SN", entities: ["tickets", "incidents", "requests", "approvals"] },
  "salesforce": { prefix: "SF", entities: ["accounts", "opportunities", "contacts", "cases"] },
  "kronos": { prefix: "KR", entities: ["time_entries", "schedules", "attendance"] },
  "coupa": { prefix: "CP", entities: ["requisitions", "purchase_orders", "invoices", "contracts"] },
  "ariba": { prefix: "AR", entities: ["suppliers", "sourcing_events", "contracts"] },
  "blackline": { prefix: "BL", entities: ["reconciliations", "matching_rules", "certifications"] },
  "looker": { prefix: "LK", entities: ["dashboard_data", "cached_queries", "metrics"] },
  "sharepoint": { prefix: "SP", entities: ["documents", "policies", "audit_trails"] },
  "google drive": { prefix: "GD", entities: ["documents", "policies", "plan_documents", "audit_trails"] },
  "google docs": { prefix: "GDOC", entities: ["documents", "comments", "review_threads"] },
  "google chat": { prefix: "GCHAT", entities: ["messages", "spaces", "notifications", "audit_trails"] },
  "slack": { prefix: "SL", entities: ["messages", "channels", "threads"] },
  "lattice": { prefix: "LT", entities: ["reviews", "goals", "feedback", "engagement"] },
  "google calendar": { prefix: "GC", entities: ["events", "meetings", "schedules"] },
  "marketo": { prefix: "MK", entities: ["campaigns", "leads", "engagement_scores"] },
  "hubspot": { prefix: "HS", entities: ["contacts", "deals", "activities"] },
};

function matchSystem(systemName) {
  const lower = systemName.toLowerCase();
  for (const [key, val] of Object.entries(SYSTEM_TABLE_PATTERNS)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

// Classify a source-system connection into a coarse kind used by the spec/semantics.
export function systemKindFromConnection(conn = {}) {
  const protocol = String(conn.protocol || "").toLowerCase();
  const category = String(conn.category || "").toLowerCase();
  const system = String(conn.system || "").toLowerCase();
  if (system.includes("vertex") || system.includes("gemini")) return "reasoning_runtime";
  if (category === "analytics" || system.includes("bigquery") || system.includes("looker")) return "olap";
  if (/rest|graphql|grpc|soap|sftp|api|rfc|bapi/.test(protocol)) return "api";
  if (category === "collaboration") return "api";
  if (category === "clm" || category === "erp" || category === "hris") return "oltp";
  return "source_system";
}

// Build the base use-case spec (systems, row policy, integrity rules, pipeline).
export function buildUseCaseSpec(useCase, rows) {
  const connections = useCase.architecture?.connections || [];
  const canonicalSystems = (useCase.systems || []).filter(Boolean);
  const sourceSystems = canonicalSystems.length
    ? canonicalSystems.map((system) => {
        const conn = connections.find((item) => String(item.system || "").toLowerCase() === String(system).toLowerCase())
          || connections.find((item) => String(item.description || "").toLowerCase().includes(String(system).toLowerCase()))
          || { system, protocol: "fixture", direction: "read", category: null, description: `Source records owned by ${system}` };
        return { ...conn, system };
      })
    : connections;
  const systems = sourceSystems
    .filter((conn) => !String(conn.system || "").toLowerCase().includes("vertex") && !String(conn.system || "").toLowerCase().includes("gemini"))
    .map((conn) => ({
      id: canonicalSystemId(conn.system),
      name: conn.system,
      kind: systemKindFromConnection(conn),
      protocol: conn.protocol || "fixture",
      direction: conn.direction || "read",
      category: conn.category || null,
      responsibility: conn.description || `Source records owned by ${conn.system}`,
    }))
    .filter((system, index, all) => all.findIndex((item) => item.id === system.id) === index);

  return {
    id: useCase.id,
    title: useCase.title,
    department: useCase.department || "general",
    rowPolicy: {
      requestedRows: rows,
      minimumRowsPerEntity: Math.max(12, Math.min(rows, 25)),
      defaultRowsPerEntity: rows,
    },
    systems,
    dataContracts: [],
    evidenceRequired: ["sql_result", "source_system_record", "generated_audit_trail"],
    documentRequirements: [
      "Every generated document must have a title, source system, linked entity IDs, and citation anchors.",
      "Documents must contain policy or operating-detail content specific enough for an agent answer to cite.",
    ],
    integrityRules: [
      "Every table has a stable primary key.",
      "Every foreign key column must reference an existing generated row.",
      "Every data table maps back to one canonical source system.",
    ],
    // The multi-step workflow narrative (architecture.pipeline) is the only place
    // the pipeline structure lives upstream. Persist it onto the spec so the agent
    // emitter can derive a sequential/parallel topology at build time (the manifest
    // is the emitter's only input; without this it sees a flat tool list only).
    architecture: useCase.architecture ? { pipeline: Array.isArray(useCase.architecture.pipeline) ? useCase.architecture.pipeline : [] } : null,
    behaviorContract: null,
  };
}

// Derive a full scenario schema from a use case. Delegates to the generationSpec
// path when the use case carries explicit entities; otherwise runs the system-
// pattern heuristic. buildAgentQualityPlan is injected by the caller.
export function deriveSchemaFromUseCase(useCase, defaultRows = 30, { buildAgentQualityPlan }) {
  if (useCase.generationSpec?.entities?.length) {
    return deriveSchemaFromGenerationSpec(useCase, defaultRows, { buildAgentQualityPlan });
  }

  const tables = [];
  const seenEntities = new Set();
  const connections = useCase.architecture?.connections || [];
  const useCaseSpec = buildUseCaseSpec(useCase, defaultRows);
  const systemsByName = new Map((useCaseSpec.systems || []).map((system) => [String(system.name).toLowerCase(), system]));
  const canonicalSystemNames = (useCase.systems || []).filter(Boolean);
  const systemsToDerive = canonicalSystemNames.length
    ? canonicalSystemNames.map((system) => {
        const matchingConnection = connections.find((conn) => String(conn.system || "").toLowerCase() === String(system).toLowerCase())
          || connections.find((conn) => String(conn.description || "").toLowerCase().includes(String(system).toLowerCase()));
        return {
          system,
          description: matchingConnection?.description || `Source records owned by ${system}`,
          protocol: matchingConnection?.protocol || "fixture",
          category: matchingConnection?.category || null,
          direction: matchingConnection?.direction || "read",
        };
      })
    : connections.map((conn) => ({
        system: conn.system,
        description: conn.description,
        protocol: conn.protocol,
        category: conn.category,
        direction: conn.direction,
      }));

  for (const conn of systemsToDerive) {
    if (conn.system.toLowerCase().includes("vertex") || conn.system.toLowerCase().includes("gemini")) continue;
    const pattern = matchSystem(conn.system);
    const prefix = pattern?.prefix || conn.system.slice(0, 3).toUpperCase();
    const entities = pattern?.entities || [snakeCase(conn.system)];
    const sourceSystem = systemsByName.get(String(conn.system).toLowerCase()) || {
      id: canonicalSystemId(conn.system),
      name: conn.system,
      kind: systemKindFromConnection(conn),
      protocol: conn.protocol || "fixture",
      responsibility: conn.description || `Source records owned by ${conn.system}`,
    };

    for (const entity of entities.slice(0, 2)) {
      if (seenEntities.has(entity)) continue;
      seenEntities.add(entity);
      tables.push({
        name: entity,
        rows: defaultRows,
        columns: deriveColumnsForEntity(entity, prefix),
        _sourceSystem: sourceSystem.name,
        _sourceSystemId: sourceSystem.id,
        _sourceKind: sourceSystem.kind,
        _sourceProtocol: sourceSystem.protocol,
        _sourceDescription: conn.description,
      });
    }
  }

  if (tables.length === 0) {
    for (const sys of useCase.systems || []) {
      if (sys.toLowerCase().includes("vertex") || sys.toLowerCase().includes("gemini")) continue;
      const pattern = matchSystem(sys);
      const prefix = pattern?.prefix || sys.slice(0, 3).toUpperCase();
      const entity = pattern?.entities?.[0] || snakeCase(sys);
      const sourceSystem = systemsByName.get(String(sys).toLowerCase()) || { id: canonicalSystemId(sys), name: sys, kind: "source_system", protocol: "fixture" };
      if (seenEntities.has(entity)) continue;
      seenEntities.add(entity);
      tables.push({
        name: entity,
        rows: defaultRows,
        columns: deriveColumnsForEntity(entity, prefix),
        _sourceSystem: sourceSystem.name,
        _sourceSystemId: sourceSystem.id,
        _sourceKind: sourceSystem.kind,
        _sourceProtocol: sourceSystem.protocol,
      });
    }
  }

  if (tables.length === 0) {
    tables.push({
      name: "business_records",
      rows: defaultRows,
      columns: deriveColumnsForEntity("metric_records", "GEN"),
      _sourceSystem: "synthetic",
      _sourceSystemId: "synthetic",
      _sourceKind: "generated_fixture",
      _sourceDescription: useCase.title || "Freeform generated scenario",
    });
  }

  const anomalies = (useCase.kpis || []).map((kpi, i) => ({
    id: `kpi-anomaly-${i + 1}`,
    description: `${kpi.label}: before=${kpi.before}, after=${kpi.after}. Agent should discover the gap.`,
    evidence: tables.map((t) => t.name),
  }));

  useCaseSpec.dataContracts = tables.map((table) => ({
    entity: table.name,
    sourceSystem: table._sourceSystem,
    sourceSystemId: table._sourceSystemId,
    sourceKind: table._sourceKind,
    rows: table.rows,
    primaryKey: table.columns.find((column) => column.type === "seq")?.name || table.columns[0]?.name || "id",
    columns: table.columns.map((column) => ({
      name: column.name,
      type: column.type,
      ref: column.ref || null,
      required: true,
    })),
  }));
  const schema = enrichScenarioSpec({
    seed: 42,
    domain: useCase.department || "general",
    systems: useCaseSpec.systems,
    useCaseSpec,
    rowPolicy: useCaseSpec.rowPolicy,
    tables,
    anomalies,
  });
  schema.useCaseSpec.agentQualityPlan = buildAgentQualityPlan({
    useCase: { ...useCase, rowPolicy: useCaseSpec.rowPolicy },
    contract: schema.useCaseSpec.behaviorContract,
    systems: useCaseSpec.systems || [],
    tables,
    documents: [],
  });
  return schema;
}
