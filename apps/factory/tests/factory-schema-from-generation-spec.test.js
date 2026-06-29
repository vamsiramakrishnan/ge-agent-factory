import { test, expect } from "bun:test";
import { deriveSchemaFromGenerationSpec } from "../scripts/factory/use-case/schema-from-generation-spec.mjs";

const USE_CASE = {
  id: "benefits-audit-agent",
  title: "Benefits Audit Agent",
  department: "hr",
  architecture: { pipeline: [{ id: "collect" }, { id: "verify" }] },
  generationSpec: {
    rowPolicy: { seed: 7, minimumRowsPerEntity: 12, defaultRowsPerEntity: 34 },
    sourceSystems: [
      {
        id: "workday",
        name: "Workday",
        protocol: "fixture",
        owns: ["employees"],
      },
      {
        id: "benefitfocus",
        name: "Benefitfocus",
        protocol: "api",
        owns: ["benefit plans", "enrollments"],
      },
    ],
    entities: [
      {
        name: "employees",
        sourceSystemId: "workday",
        datastore: "table",
        rowCount: 20,
        primaryKey: "id",
        columns: [
          { name: "id", type: "seq", required: true },
          { name: "email", type: "internet.email", required: false },
        ],
      },
      {
        name: "enrollments",
        sourceSystemId: "benefitfocus",
        datastore: "table",
        primaryKey: "id",
        columns: [
          { name: "id", type: "seq" },
          { name: "employee_id", type: "ref", ref: "employees.id" },
          {
            name: "status",
            type: "enum",
            values: ["active", "waived"],
            weights: [0.8, 0.2],
          },
        ],
      },
    ],
    documents: [
      {
        id: "benefits_policy",
        type: "policy",
        title: "Benefits Policy",
        sourceSystemId: "benefitfocus",
        linkedEntities: ["enrollments"],
        requiredSections: ["Eligibility", "Evidence"],
        citationAnchors: ["POL-1"],
        minimumWordCount: 250,
      },
    ],
    relationships: [
      {
        from: "enrollments.employee_id",
        to: "employees.id",
        orphanPolicy: "reject",
      },
    ],
    apis: [{ name: "carrierSync", protocol: "REST" }],
    datastorePackaging: { mode: "fixtures" },
    anomalies: [{ id: "missing_evidence", rate: 0.05 }],
    behaviorContract: {
      primaryObjective: "Audit enrollment evidence",
      toolIntents: [],
    },
  },
};

test("derives schema from explicit generationSpec without legacy heuristics", () => {
  const qualityPlanArgs = [];
  const schema = deriveSchemaFromGenerationSpec(USE_CASE, 99, {
    buildAgentQualityPlan: (args) => {
      qualityPlanArgs.push(args);
      return {
        checked: true,
        tableCount: args.tables.length,
        documentCount: args.documents.length,
      };
    },
  });

  expect(schema.seed).toBe(7);
  expect(schema.domain).toBe("hr");
  expect(schema.rowPolicy).toEqual({
    minimumRowsPerEntity: 12,
    defaultRowsPerEntity: 34,
  });
  expect(
    schema.tables.map((table) => [
      table.name,
      table.rows,
      table._sourceSystem,
      table._sourceProtocol,
    ]),
  ).toEqual([
    ["employees", 20, "Workday", "fixture"],
    ["enrollments", 34, "Benefitfocus", "api"],
  ]);
  expect(schema.tables[1].columns[1]).toEqual({
    name: "employee_id",
    type: "ref",
    values: undefined,
    weights: undefined,
    ref: "employees.id",
    min: undefined,
    max: undefined,
  });
  expect(schema.documents[0]).toEqual({
    id: "benefits_policy",
    name: "benefits_policy",
    type: "policy",
    title: "Benefits Policy",
    sourceSystem: "Benefitfocus",
    sourceSystemId: "benefitfocus",
    linkedEntities: ["enrollments"],
    requiredSections: ["Eligibility", "Evidence"],
    topic: "Eligibility; Evidence",
    citationAnchors: ["POL-1"],
    minimumWordCount: 250,
  });
  expect(schema.useCaseSpec.dataContracts[1]).toEqual({
    entity: "enrollments",
    sourceSystem: "Benefitfocus",
    sourceSystemId: "benefitfocus",
    sourceKind: "table",
    rows: undefined,
    primaryKey: "id",
    columns: [
      { name: "id", type: "seq", ref: null, required: true },
      { name: "employee_id", type: "ref", ref: "employees.id", required: true },
      { name: "status", type: "enum", ref: null, required: true },
    ],
  });
  expect(schema.useCaseSpec.documentRequirements).toEqual([
    "Benefits Policy: Eligibility, Evidence",
  ]);
  expect(schema.useCaseSpec.integrityRules).toEqual([
    "enrollments.employee_id -> employees.id; orphanPolicy=reject",
  ]);
  expect(schema.useCaseSpec.apis).toEqual([
    { name: "carrierSync", protocol: "REST" },
  ]);
  expect(schema.useCaseSpec.datastorePackaging).toEqual({ mode: "fixtures" });
  expect(schema.useCaseSpec.architecture).toEqual({
    pipeline: USE_CASE.architecture.pipeline,
  });
  expect(schema.useCaseSpec.agentQualityPlan).toEqual({
    checked: true,
    tableCount: 2,
    documentCount: 1,
  });
  expect(qualityPlanArgs[0].useCase.rowPolicy).toEqual({
    requestedRows: 34,
    minimumRowsPerEntity: 12,
    defaultRowsPerEntity: 34,
  });
});

test("requires an injected agent quality-plan builder", () => {
  expect(() => deriveSchemaFromGenerationSpec(USE_CASE)).toThrow(
    "deriveSchemaFromGenerationSpec requires buildAgentQualityPlan",
  );
});
