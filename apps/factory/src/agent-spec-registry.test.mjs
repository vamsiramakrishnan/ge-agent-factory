import { describe, expect, test } from "bun:test";
import { validateAgentSpecQuality } from "./agent-spec-registry.js";

function factoryGradeSpec() {
  return {
    id: "policy-evidence-assistant",
    title: "Policy Evidence Assistant",
    department: "hr",
    subtitle: "Interview generated catalog-grade spec",
    persona: "HR operations lead",
    kpis: [
      { label: "Case resolution time", before: "3 days", after: "4 hours" },
      { label: "Policy citation rate", before: "45%", after: "95%" },
    ],
    statusQuo: [
      "HR specialists manually search policy documents before answering employee questions.",
      "Case notes often lack citation anchors, making audit review slow.",
    ],
    agentification: [
      "The agent cites policy sections before drafting an answer.",
      "The agent flags stale or missing evidence for human review.",
    ],
    architecture: {
      connections: [
        { system: "Workday", description: "Employee and case metadata" },
        { system: "Google Cloud Storage", description: "Policy document corpus" },
      ],
      pipeline: [
        { label: "Load case", description: "Read employee case metadata." },
        { label: "Find policy", description: "Retrieve citation-backed policy sections." },
        { label: "Draft answer", description: "Produce a grounded response or escalation." },
      ],
    },
    generationSpec: {
      version: 1,
      rowPolicy: {
        defaultRowsPerEntity: 50,
        minimumRowsPerEntity: 25,
        seed: 42,
        rationale: "Enough data to exercise policy lookup and case triage.",
      },
      sourceSystems: [
        {
          id: "workday",
          name: "Workday",
          owns: ["employee_cases"],
          protocol: "REST API",
          localBacking: ["alloydb"],
          toolNames: ["query_workday_employee_cases"],
          evidence: ["source_system_record"],
        },
        {
          id: "policy_docs",
          name: "Policy Documents",
          owns: ["policy_documents"],
          protocol: "object storage",
          localBacking: ["gcs"],
          toolNames: ["lookup_policy_documents"],
          evidence: ["document_reference"],
        },
      ],
      entities: [
        {
          name: "employee_cases",
          sourceSystemId: "workday",
          datastore: "alloydb",
          rowCount: 50,
          primaryKey: "id",
          columns: [
            { name: "id", type: "seq", required: true },
            { name: "employee_id", type: "string", required: true },
            { name: "topic", type: "string", required: true },
          ],
        },
      ],
      documents: [
        {
          id: "leave_policy",
          sourceSystemId: "policy_docs",
          type: "policy",
          title: "Leave Policy",
          requiredSections: ["Eligibility", "Evidence", "Escalation"],
          linkedEntities: ["employee_cases"],
          minimumWordCount: 500,
          citationAnchors: ["eligibility", "evidence", "escalation"],
        },
      ],
      anomalies: [
        {
          id: "missing-policy-evidence",
          description: "Seed a case where the employee question lacks a matching policy citation.",
          affectedEntities: ["employee_cases"],
          discoveryPath: ["Load the case", "Search policy docs", "Find missing citation"],
          expectedEvidence: ["source-system record", "document reference"],
          expectedRecommendation: "Escalate or ask for more information.",
        },
      ],
      datastorePackaging: {
        alloydb: { database: "policy_evidence_assistant", schemas: ["workday"] },
        gcs: { bucketSuffix: "policy-evidence", folders: ["documents"] },
      },
      validation: {
        smokePrompt: "Answer the employee case and cite policy evidence.",
        expectedAnswer: ["cites policy", "names next action"],
        assertions: ["uses canonical tools", "cites documents"],
      },
      behaviorContract: {
        role: "HR policy evidence assistant",
        primaryObjective: "Resolve HR policy cases with grounded evidence from Workday case data and policy documents while refusing unsupported answers.",
        inScope: ["Policy citation", "Case evidence summary"],
        outOfScope: ["Legal advice", "Final disciplinary decisions"],
        toolIntents: [
          {
            name: "query_workday_employee_cases",
            kind: "query",
            sourceSystemId: "workday",
            description: "Retrieve employee case records.",
            requiredInputs: ["case_id"],
            produces: ["case_record"],
            evidenceEmitted: ["source_system_record"],
          },
          {
            name: "lookup_policy_documents",
            kind: "evidence_lookup",
            sourceSystemId: "policy_docs",
            description: "Retrieve policy sections with citation anchors.",
            requiredInputs: ["topic"],
            produces: ["document_section", "citation_anchor"],
            evidenceEmitted: ["document_reference"],
          },
          {
            name: "query_workday_employee_case_history",
            kind: "query",
            sourceSystemId: "workday",
            description: "Retrieve prior case history for context.",
            requiredInputs: ["employee_id"],
            produces: ["case_history"],
            evidenceEmitted: ["source_system_record"],
          },
        ],
        evidenceRequirements: [{ claim: "policy answer is supported", mustCite: ["leave_policy"], sourceSystemIds: ["workday", "policy_docs"] }],
        escalationRules: [
          { trigger: "missing policy evidence", action: "request_more_info", rationale: "Avoid unsupported answers." },
          { trigger: "sensitive employee relation issue", action: "escalate_to_human", rationale: "Human judgment required." },
        ],
        refusalRules: ["Never fabricate policy text.", "Never answer without a citation."],
        goldenEvals: [
          {
            id: "policy-evidence-happy-path",
            prompt: "Answer CASE-1 with policy citations.",
            expectedToolCalls: ["query_workday_employee_cases", "lookup_policy_documents"],
            mustReferenceEntities: ["employee_cases"],
            mustCiteDocuments: ["leave_policy"],
            expectedBehaviors: ["cites policy"],
            forbiddenBehaviors: ["no uncited claims"],
          },
        ],
      },
    },
  };
}

describe("agent spec registry quality gates", () => {
  test("accepts catalog-grade read-only interview specs", () => {
    const quality = validateAgentSpecQuality(factoryGradeSpec());
    expect(quality.ok).toBe(true);
    expect(quality.maturity).toBe("factory_grade_catalog_spec");
  });

  test("rejects thin interview specs before registration", () => {
    const quality = validateAgentSpecQuality({
      id: "thin",
      title: "Thin",
      department: "hr",
      generationSpec: { sourceSystems: [], entities: [], documents: [], behaviorContract: {} },
    });
    expect(quality.ok).toBe(false);
    expect(quality.gaps).toContain("missing_row_policy");
    expect(quality.gaps).toContain("kpis_thin");
    expect(quality.gaps).toContain("architecture_pipeline_thin");
  });
});
