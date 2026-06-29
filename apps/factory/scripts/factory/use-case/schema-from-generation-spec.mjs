import { enrichScenarioSpec } from "../packs/index.mjs";

export function deriveSchemaFromGenerationSpec(
  useCase,
  defaultRows = 30,
  { buildAgentQualityPlan } = {},
) {
  if (!buildAgentQualityPlan) {
    throw new Error(
      "deriveSchemaFromGenerationSpec requires buildAgentQualityPlan",
    );
  }

  const spec = useCase.generationSpec;
  const systems = spec.sourceSystems || [];
  const systemsById = new Map(systems.map((system) => [system.id, system]));
  const tables = spec.entities.map((entity) => {
    const source = systemsById.get(entity.sourceSystemId) || {
      id: entity.sourceSystemId,
      name: entity.sourceSystemId,
    };
    return {
      name: entity.name,
      rows:
        entity.rowCount || spec.rowPolicy?.defaultRowsPerEntity || defaultRows,
      columns: (entity.columns || []).map((column) => ({
        name: column.name,
        type: column.type,
        values: column.values,
        weights: column.weights,
        ref: column.ref,
        min: column.min,
        max: column.max,
      })),
      _sourceSystem: source.name,
      _sourceSystemId: source.id,
      _sourceKind: entity.datastore,
      _sourceProtocol: source.protocol,
      _sourceDescription:
        source.owns?.join(", ") || `Source records owned by ${source.name}`,
    };
  });
  const documents = (spec.documents || []).map((doc) => {
    const source = systemsById.get(doc.sourceSystemId) || {
      id: doc.sourceSystemId,
      name: doc.sourceSystemId,
    };
    return {
      id: doc.id,
      name: doc.id,
      type: doc.type,
      title: doc.title,
      sourceSystem: source.name,
      sourceSystemId: source.id,
      linkedEntities: doc.linkedEntities,
      requiredSections: doc.requiredSections || [],
      topic: doc.requiredSections?.join("; "),
      citationAnchors: doc.citationAnchors,
      minimumWordCount: doc.minimumWordCount,
    };
  });
  const useCaseSpec = {
    id: useCase.id,
    title: useCase.title,
    department: useCase.department || "general",
    rowPolicy: {
      requestedRows: spec.rowPolicy?.defaultRowsPerEntity || defaultRows,
      minimumRowsPerEntity: spec.rowPolicy?.minimumRowsPerEntity || 25,
      defaultRowsPerEntity: spec.rowPolicy?.defaultRowsPerEntity || defaultRows,
    },
    systems,
    dataContracts: spec.entities.map((entity) => ({
      entity: entity.name,
      sourceSystem:
        systemsById.get(entity.sourceSystemId)?.name || entity.sourceSystemId,
      sourceSystemId: entity.sourceSystemId,
      sourceKind: entity.datastore,
      rows: entity.rowCount,
      primaryKey: entity.primaryKey,
      columns: entity.columns.map((column) => ({
        name: column.name,
        type: column.type,
        ref: column.ref || null,
        required: column.required !== false,
      })),
    })),
    evidenceRequired: [
      "sql_result",
      "source_system_record",
      "document_reference",
      "generated_audit_trail",
    ],
    documentRequirements: (spec.documents || []).map(
      (doc) => `${doc.title}: ${(doc.requiredSections || []).join(", ")}`,
    ),
    integrityRules: (spec.relationships || []).map(
      (rel) => `${rel.from} -> ${rel.to}; orphanPolicy=${rel.orphanPolicy}`,
    ),
    apis: spec.apis || [],
    datastorePackaging: spec.datastorePackaging || {},
    architecture: useCase.architecture
      ? {
          pipeline: Array.isArray(useCase.architecture.pipeline)
            ? useCase.architecture.pipeline
            : [],
        }
      : null,
    behaviorContract: spec.behaviorContract || null,
  };
  const schema = enrichScenarioSpec({
    seed: spec.rowPolicy?.seed || 42,
    domain: useCase.department || "general",
    systems,
    useCaseSpec,
    rowPolicy: {
      minimumRowsPerEntity: spec.rowPolicy?.minimumRowsPerEntity || 25,
      defaultRowsPerEntity: spec.rowPolicy?.defaultRowsPerEntity || defaultRows,
    },
    tables,
    documents,
    anomalies: spec.anomalies || [],
  });
  schema.useCaseSpec.agentQualityPlan = buildAgentQualityPlan({
    useCase: { ...useCase, rowPolicy: useCaseSpec.rowPolicy },
    contract: schema.useCaseSpec.behaviorContract,
    systems,
    tables,
    documents,
  });
  return schema;
}
