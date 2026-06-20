import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Edit3, Upload, FileText, Shield, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Policy Needed", lane: "human", type: "trigger" },
    { id: "a1", label: "Draft Generation", lane: "agent", type: "action" },
    { id: "a2", label: "Compliance Scan", lane: "agent", type: "action" },
    { id: "a3", label: "Policy Document", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Requirements", icon: Upload, description: "Policy topic, jurisdiction, scope defined.", trigger: "Policy Needed", systems: ["Legal DB"] },
  { label: "Draft Generation", icon: FileText, description: "Regulation-aware policy drafted from templates.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Compliance Scan", icon: Shield, description: "Automated gap analysis against current regulations." },
  { label: "Publish", icon: Send, description: "Version-controlled publishing with change log.", output: "Policy Document" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Docs", description: "Policy document drafting, version control, review workflows", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Workday", description: "Org structure, jurisdiction data, applicable employee populations", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Regulation-aware drafting, compliance gap analysis, change summarization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Requirements Definition", description: "Define policy topic, applicable jurisdictions, and scope. Pull current regulatory requirements and existing policy versions for reference.", systems: ["Workday"], layer: "integration", dataIn: "Policy topic + jurisdiction + scope parameters", dataOut: "Requirements brief with regulatory context" },
    { label: "Regulation-Aware Drafting", description: "Gemini drafts policy from curated templates aligned to current federal, state, and local regulations. Incorporates jurisdiction-specific legal nuances.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Requirements brief + regulatory templates", dataOut: "Draft policy document with regulatory alignment" },
    { label: "Compliance Gap Analysis", description: "Automated scan of draft against current regulations across all applicable jurisdictions. Flag gaps, conflicts, and areas requiring legal review.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Draft policy + regulatory database", dataOut: "Gap analysis report with flagged compliance issues" },
    { label: "Publishing & Version Control", description: "Version-controlled publishing to Google Docs with change tracking, stakeholder notification, and automated change log generation.", systems: ["Google Docs"], layer: "integration", dataIn: "Approved policy document", dataOut: "Published policy with version history and change log" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "ER Lead agent for the Policy Drafting & Review Assistant workflow",
  primaryObjective: "Regulation-aware policy drafting from curated templates aligned to current law. Automated compliance gap analysis flagging conflicts with federal, state, and local regulations. so the ER Lead can move the Draft time KPI.",
  inScope: [
    "Regulation-aware policy drafting from curated templates aligned to current law",
    "Automated compliance gap analysis flagging conflicts with federal, state, and local regulations",
    "Version-controlled publishing with change tracking and stakeholder notification workflows",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Policy Drafting & Review Assistant workflow.",
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
      name: "query_legal_db_legal_db_records",
      kind: "query",
      sourceSystemId: "legal_db",
      description: "Retrieve legal db records from Legal DB for the Policy Drafting & Review Assistant workflow.",
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
      name: "query_sharepoint_documents",
      kind: "query",
      sourceSystemId: "sharepoint",
      description: "Retrieve documents from SharePoint for the Policy Drafting & Review Assistant workflow.",
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
      name: "lookup_policy_drafting_review_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Policy Drafting & Review Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_docs_publish",
      kind: "action",
      sourceSystemId: "google_docs",
      description: "Execute the publish step in Google Docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Draft time moved from 2 weeks toward 2 hours",
      mustCite: [
        "google_docs.documents",
        "legal_db.legal_db_records",
      ],
      sourceSystemIds: [
        "google_docs",
        "legal_db",
      ],
    },
    {
      claim: "Compliance gaps moved from Found in legal review toward Auto-detected",
      mustCite: [
        "google_docs.documents",
        "legal_db.legal_db_records",
      ],
      sourceSystemIds: [
        "google_docs",
        "legal_db",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Draft time regresses past the 2 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "ER Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed publish action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Docs (and other named systems) entities.",
    "Never bypass ER Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "policy-drafting-review-assistant-end-to-end",
      prompt: "Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_legal_db_legal_db_records",
        "query_sharepoint_documents",
        "lookup_policy_drafting_review_assistant_policy_handbook",
        "action_google_docs_publish",
      ],
      mustReferenceEntities: [
        "documents",
        "legal_db_records",
        "documents",
      ],
      mustCiteDocuments: [
        "policy-drafting-review-assistant-policy-handbook",
      ],
      expectedActionOutcome: "Action publish executed against Google Docs, with audit-trail entry and ER Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute publish without two-system evidence",
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
    rationale: "Row counts sized for Policy Drafting & Review Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "sharepoint",
      name: "SharePoint",
      owns: [
        "documents",
        "site_permissions",
        "library_metadata",
      ],
      protocol: "Graph API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_sharepoint_documents",
        "query_sharepoint_site_permissions",
        "query_sharepoint_library_metadata",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "site_permissions",
      sourceSystemId: "sharepoint",
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
      name: "library_metadata",
      sourceSystemId: "sharepoint",
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
  ],
  relationships: [
    {
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "legal_db_events.legal_db_record_id",
      to: "legal_db_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "policy-drafting-review-assistant-policy-handbook",
      sourceSystemId: "google_docs",
      type: "policy",
      title: "Policy Drafting & Review Assistant Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "documents",
        "comments",
        "revision_history",
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
      id: "google_docs_publish_api",
      sourceSystemId: "google_docs",
      method: "POST",
      path: "/api/google_docs/publish",
      description: "Synchronous endpoint the agent calls to publish in Google Docs after evidence gating.",
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
      id: "policy-drafting-review-assistant-baseline-gap",
      description: "Seed a realistic gap where Draft time sits between 2 weeks and 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against Legal DB historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next ER Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "policy_drafting_review_assistant",
      schemas: [
        "google_docs",
        "legal_db",
        "sharepoint",
      ],
    },
    bigquery: {
      dataset: "hr_policy_drafting_review_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "policy-drafting-review-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "policy-drafting-review-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Policy Drafting & Review Assistant workflow and cite source-system evidence for every claim.",
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

export const PolicyDraftingReview = () => (
  <UseCaseSlide
    title="Policy Drafting & Review Assistant"
    subtitle="A-606 • Employee Relations"
    icon={Edit3}
    domainId="domain-6"
    layer="Layer 1: OOTB"
    persona="ER Lead"
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    systems={["Google Docs", "Legal DB", "SharePoint"]}
    kpis={[
      { label: "Draft time", before: "2 weeks", after: "2 hours" },
      { label: "Compliance gaps", before: "Found in legal review", after: "Auto-detected" },
      { label: "Version control", before: "File names", after: "Automated" }
    ]}
    flow={flow}
    statusQuo={[
      "Policies drafted from scratch or by modifying outdated templates with unknown provenance.",
      "Compliance review requires expensive external legal consultation for each update.",
      "Poor version control leads to conflicting policy versions circulating across teams."
    ]}
    agentification={[
      "Regulation-aware policy drafting from curated templates aligned to current law.",
      "Automated compliance gap analysis flagging conflicts with federal, state, and local regulations.",
      "Version-controlled publishing with change tracking and stakeholder notification workflows."
    ]}
  />
);
