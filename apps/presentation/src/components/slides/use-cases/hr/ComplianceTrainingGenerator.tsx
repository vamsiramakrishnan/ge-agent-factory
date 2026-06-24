import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Shield, FileText, Globe, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Regulatory Change", lane: "system", type: "trigger" },
    { id: "a1", label: "Content Generation", lane: "agent", type: "action" },
    { id: "a2", label: "Localization", lane: "agent", type: "action" },
    { id: "s2", label: "Training Published", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Regulatory Change", icon: Shield, description: "New regulation or policy change detected.", trigger: "Regulatory Update", systems: ["Legal DB"] },
  { label: "Content Generation", icon: FileText, description: "Training content created from regulatory source.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Localization", icon: Globe, description: "Multi-jurisdiction and multi-language versions." },
  { label: "Published", icon: Send, description: "Deployed to LMS with completion tracking.", output: "Training Module" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Cornerstone", description: "LMS course catalog, training templates, publishing workflows", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Employee roles, jurisdictions, compliance assignment rules", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Regulatory content generation, localization, role-specific scenario creation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Regulatory Change Detection", description: "Monitor regulatory feeds for new or updated compliance requirements. Match changes to applicable jurisdictions and employee populations.", systems: ["Workday"], layer: "integration", dataIn: "Regulatory update feeds + jurisdiction mappings", dataOut: "Matched regulatory changes with affected populations" },
    { label: "Content Generation", description: "Gemini generates training content from regulatory source material. Creates role-specific compliance scenarios with localized legal nuances for each jurisdiction.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Regulatory text + role profiles + jurisdiction context", dataOut: "Multi-jurisdiction training modules with scenarios" },
    { label: "Publishing & Tracking", description: "Deploy generated content to Cornerstone LMS with completion tracking, deadline assignment, and automated reminder workflows.", systems: ["Cornerstone"], layer: "integration", dataIn: "Generated training modules", dataOut: "Published courses with completion tracking active" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance Officer agent for the Compliance Training Content Generator workflow",
  primaryObjective: "Regulatory-change-triggered content updates ensure training reflects current requirements. Automated multi-jurisdiction localization with region-specific legal nuances. so the Compliance Officer can move the Content update speed KPI.",
  inScope: [
    "Regulatory-change-triggered content updates ensure training reflects current requirements",
    "Automated multi-jurisdiction localization with region-specific legal nuances",
    "Role-specific compliance scenarios generated from real organizational context",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_lms_lms_records",
      kind: "query",
      sourceSystemId: "lms",
      description: "Retrieve lms records from LMS for the Compliance Training Content Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lms_records_records",
        "lms_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_legal_db_legal_db_records",
      kind: "query",
      sourceSystemId: "legal_db",
      description: "Retrieve legal db records from Legal DB for the Compliance Training Content Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "legal_db_records_records",
        "legal_db_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Compliance Training Content Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "documents_records",
        "documents_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_compliance_training_content_generator_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Compliance Training Content Generator Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
      requiredInputs: [
        "section_anchor",
      ],
      produces: [
        "document_section",
        "citation_anchor",
      ],
      evidenceEmitted: [
        "document_reference",
      ],
    },
    {
      name: "action_lms_generate",
      kind: "action",
      sourceSystemId: "lms",
      description: "Execute the generate step in LMS after the agent has gathered evidence and validated escalation gates.",
      requiredInputs: [
        "target_id",
        "rationale",
      ],
      produces: [
        "action_id",
        "audit_record_id",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Content update speed moved from Months toward Days",
      mustCite: [
        "lms.lms_records",
        "legal_db.legal_db_records",
      ],
      sourceSystemIds: [
        "lms",
        "legal_db",
      ],
    },
    {
      claim: "Jurisdictions covered moved from Key markets toward All markets",
      mustCite: [
        "lms.lms_records",
        "legal_db.legal_db_records",
      ],
      sourceSystemIds: [
        "lms",
        "legal_db",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Content update speed regresses past the Months baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Compliance Officer",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from LMS (and other named systems) entities.",
    "Never bypass Compliance Officer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "compliance-training-content-generator-end-to-end",
      prompt: "Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_lms_lms_records",
        "query_legal_db_legal_db_records",
        "query_google_docs_documents",
        "lookup_compliance_training_content_generator_policy_handbook",
        "action_lms_generate",
      ],
      mustReferenceEntities: [
        "lms_records",
        "legal_db_records",
        "documents",
      ],
      mustCiteDocuments: [
        "compliance-training-content-generator-policy-handbook",
      ],
      expectedActionOutcome: "Action generate executed against LMS, with audit-trail entry and Compliance Officer notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 50,
    minimumRowsPerEntity: 25,
    seed: 42,
    rationale: "Row counts sized for Compliance Training Content Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "lms",
      name: "LMS",
      owns: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lms_lms_records",
        "query_lms_lms_events",
        "query_lms_lms_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "legal_db",
      name: "Legal DB",
      owns: [
        "legal_db_records",
        "legal_db_events",
        "legal_db_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_legal_db_legal_db_records",
        "query_legal_db_legal_db_events",
        "query_legal_db_legal_db_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_docs",
      name: "Google Docs",
      owns: [
        "documents",
        "comments",
        "revision_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_docs_documents",
        "query_google_docs_comments",
        "query_google_docs_revision_history",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "lms_records",
      sourceSystemId: "lms",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "lms_events",
      sourceSystemId: "lms",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "lms_record_id",
          type: "ref",
          ref: "lms_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lms_audit_trail",
      sourceSystemId: "lms",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "legal_db_records",
      sourceSystemId: "legal_db",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "legal_db_events",
      sourceSystemId: "legal_db",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "legal_db_record_id",
          type: "ref",
          ref: "legal_db_records.id",
          required: true,
        },
      ],
    },
    {
      name: "legal_db_audit_trail",
      sourceSystemId: "legal_db",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "documents",
      sourceSystemId: "google_docs",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "comments",
      sourceSystemId: "google_docs",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "revision_history",
      sourceSystemId: "google_docs",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "document_id",
          type: "ref",
          ref: "documents.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "legal_db_events.legal_db_record_id",
      to: "legal_db_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "compliance-training-content-generator-policy-handbook",
      sourceSystemId: "lms",
      type: "policy",
      title: "Compliance Training Content Generator Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [
    {
      id: "lms_generate_api",
      sourceSystemId: "lms",
      method: "POST",
      path: "/api/lms/generate",
      description: "Synchronous endpoint the agent calls to generate in LMS after evidence gating.",
      requestSchema: {
        target_id: "string",
        rationale: "string",
        metadata: "object",
      },
      responseSchema: {
        action_id: "string",
        status: "string",
        audit_record_id: "string",
      },
      idempotencyKey: "target_id+rationale",
    },
  ],
  anomalies: [
    {
      id: "compliance-training-content-generator-baseline-gap",
      description: "Seed a realistic gap where Content update speed sits between Months and Days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "lms_records",
        "lms_events",
      ],
      discoveryPath: [
        "Inspect LMS records for the affected entities",
        "Compare against Legal DB historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Compliance Officer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "compliance_training_content_generator",
      schemas: [
        "lms",
        "legal_db",
        "google_docs",
      ],
    },
    bigquery: {
      dataset: "hr_compliance_training_content_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "compliance-training-content-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "compliance-training-content-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Compliance Training Content Generator workflow and cite source-system evidence for every claim.",
    expectedAnswer: [
      "uses canonical source-system tools",
      "cites the governing document",
      "names the next operator action",
    ],
    assertions: [
      "canonical source-system tool names",
      "minimum row policy met",
      "audit trail emitted on actions",
      "evidence_lookup invoked before recommendations",
    ],
  },
  behaviorContract: behaviorContract,
};

export const ComplianceTrainingGenerator = () => (
  <UseCaseSlide
    title="Compliance Training Content Generator"
    subtitle="A-505 • L&D"
    icon={Shield}
    domainId="domain-5"
    layer="Layer 1: OOTB"
    persona="Compliance Officer"
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    systems={["LMS", "Legal DB", "Google Docs"]}
    kpis={[
      { label: "Content update speed", before: "Months", after: "Days" },
      { label: "Jurisdictions covered", before: "Key markets", after: "All markets" },
      { label: "Relevance", before: "Generic", after: "Role-specific" }
    ]}
    flow={flow}
    statusQuo={[
      "Compliance training content updated annually regardless of regulatory changes.",
      "Localization across jurisdictions is expensive, slow, and error-prone.",
      "Content feels generic and fails to engage employees with role-relevant scenarios."
    ]}
    agentification={[
      "Regulatory-change-triggered content updates ensure training reflects current requirements.",
      "Automated multi-jurisdiction localization with region-specific legal nuances.",
      "Role-specific compliance scenarios generated from real organizational context."
    ]}
  />
);
