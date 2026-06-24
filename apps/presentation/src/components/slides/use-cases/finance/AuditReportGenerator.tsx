import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Database, PenTool, CheckCircle, BookOpen } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Audit Completed", lane: "system", type: "trigger" },
    { id: "a1", label: "Finding Compilation", lane: "agent", type: "action" },
    { id: "a2", label: "Report Drafting", lane: "agent", type: "action" },
    { id: "a3", label: "Formatted Report", lane: "agent", type: "output" },
    { id: "h1", label: "CAE Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Finding Compilation", icon: Database, description: "Compile all findings, evidence, and management responses from the completed audit engagement.", trigger: "Post-audit", systems: ["AuditBoard"] },
  { label: "Narrative Generation", icon: PenTool, description: "Gemini drafts executive summary, scope, findings with root cause analysis, and recommendations.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Report Formatting", icon: BookOpen, description: "Format report with appropriate tone — risk-focused for audit committee, remediation-focused for management.", systems: ["Vertex AI", "Google Docs"] },
  { label: "CAE Review", icon: CheckCircle, description: "Chief Audit Executive reviews and approves the report before distribution.", output: "Final Audit Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "AuditBoard", description: "Findings, evidence, test results, management responses", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Report narrative generation, tone adaptation by audience", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Google Docs", description: "Formatted audit report output", direction: "write", protocol: "Workspace API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Data Compilation", description: "Extract all findings, supporting evidence, severity ratings, and management remediation responses from AuditBoard. Pull prior year comparisons.", systems: ["AuditBoard"], layer: "integration", dataIn: "Audit workpapers + findings", dataOut: "Structured finding dataset with evidence" },
    { label: "Trend & Severity Analysis", description: "Compare findings against prior audits for recurrence patterns. Score severity using impact and likelihood dimensions. Benchmark against industry standards.", systems: ["BigQuery"], layer: "ml", dataIn: "Current + historical findings", dataOut: "Severity-scored findings with trend analysis" },
    { label: "Narrative Drafting", description: "Gemini drafts the full audit report — executive summary, detailed findings with root cause analysis, recommendations with timelines. Adapts tone for different audiences: audit committee gets risk summary, management gets detailed remediation guidance.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored findings + trend analysis", dataOut: "Draft audit report with audience variants" },
    { label: "Formatting & Distribution", description: "Format report in corporate audit template. Generate audit committee summary separately from detailed management report. Route for CAE review.", systems: ["Google Docs"], layer: "integration", dataIn: "Draft audit report", dataOut: "Formatted audit report ready for distribution" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Chief Audit Executive agent for the Audit Report Generator workflow",
  primaryObjective: "Gemini drafts comprehensive audit reports with executive summary, root cause analysis, and recommendations. Automatic tone adaptation — risk-focused summary for audit committee, remediation guidance for management. so the Chief Audit Executive can move the Report drafting time KPI.",
  inScope: [
    "Gemini drafts comprehensive audit reports with executive summary, root cause analysis, and recommendations",
    "Automatic tone adaptation — risk-focused summary for audit committee, remediation guidance for management",
    "Historical comparison highlights recurring findings and tracks remediation effectiveness across cycles",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_auditboard_auditboard_records",
      kind: "query",
      sourceSystemId: "auditboard",
      description: "Retrieve auditboard records from AuditBoard for the Audit Report Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "auditboard_records_records",
        "auditboard_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Audit Report Generator workflow.",
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
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the Audit Report Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "finance_3_records_records",
        "finance_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_audit_report_generator_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Audit Report Generator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_auditboard_recommend",
      kind: "action",
      sourceSystemId: "auditboard",
      description: "Execute the recommend step in AuditBoard after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Report drafting time moved from 2-3 weeks toward 2-3 days",
      mustCite: [
        "auditboard.auditboard_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "auditboard",
        "google_docs",
      ],
    },
    {
      claim: "Finding consistency moved from Varies by auditor toward Standardized format",
      mustCite: [
        "auditboard.auditboard_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "auditboard",
        "google_docs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Report drafting time regresses past the 2-3 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Chief Audit Executive",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from AuditBoard (and other named systems) entities.",
    "Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "audit-report-generator-end-to-end",
      prompt: "Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_auditboard_auditboard_records",
        "query_google_docs_documents",
        "query_finance_3_finance_3_records",
        "lookup_audit_report_generator_controls_playbook",
        "action_auditboard_recommend",
      ],
      mustReferenceEntities: [
        "auditboard_records",
        "documents",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "audit-report-generator-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against AuditBoard, with audit-trail entry and Chief Audit Executive notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Audit Report Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "auditboard",
      name: "AuditBoard",
      owns: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_auditboard_auditboard_records",
        "query_auditboard_auditboard_events",
        "query_auditboard_auditboard_audit_trail",
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
    {
      id: "finance_3",
      name: "FINANCE 3",
      owns: [
        "finance_3_records",
        "finance_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_finance_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
    {
      name: "auditboard_records",
      sourceSystemId: "auditboard",
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
      name: "auditboard_events",
      sourceSystemId: "auditboard",
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
      name: "auditboard_audit_trail",
      sourceSystemId: "auditboard",
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
    {
      name: "finance_3_records",
      sourceSystemId: "finance_3",
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
      name: "finance_3_events",
      sourceSystemId: "finance_3",
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
          name: "finance_3_record_id",
          type: "ref",
          ref: "finance_3_records.id",
          required: true,
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
      from: "finance_3_events.finance_3_record_id",
      to: "finance_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "audit-report-generator-controls-playbook",
      sourceSystemId: "auditboard",
      type: "policy",
      title: "Audit Report Generator Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "scope",
        "materiality",
        "escalation",
        "audit-evidence",
      ],
    },
  ],
  apis: [
    {
      id: "auditboard_recommend_api",
      sourceSystemId: "auditboard",
      method: "POST",
      path: "/api/auditboard/recommend",
      description: "Synchronous endpoint the agent calls to recommend in AuditBoard after evidence gating.",
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
      id: "audit-report-generator-baseline-gap",
      description: "Seed a realistic gap where Report drafting time sits between 2-3 weeks and 2-3 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "auditboard_records",
        "auditboard_events",
      ],
      discoveryPath: [
        "Inspect AuditBoard records for the affected entities",
        "Compare against Google Docs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Chief Audit Executive action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "audit_report_generator",
      schemas: [
        "auditboard",
        "google_docs",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_audit_report_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "audit-report-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "audit-report-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Audit Report Generator workflow and cite source-system evidence for every claim.",
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

export const AuditReportGenerator = () => (
  <UseCaseSlide
    title="Audit Report Generator"
    subtitle="A-2607 • Internal Audit & Controls"
    icon={FileText}
    domainId="domain-26"
    layer="Layer 3: Custom ADK"
    persona="Chief Audit Executive"
    systems={["AuditBoard", "Vertex AI", "Google Docs"]}
    kpis={[
      { label: "Report drafting time", before: "2-3 weeks", after: "2-3 days" },
      { label: "Finding consistency", before: "Varies by auditor", after: "Standardized format" },
      { label: "Audience-appropriate versions", before: "1 generic report", after: "Tailored for committee + management" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Chief Audit Executive", action: "Review and approve audit report", description: "CAE validates findings narrative, severity classifications, and recommendations before distribution to audit committee and management." }}
    statusQuo={[
      "Audit reports take weeks to draft, delaying remediation actions.",
      "Report quality and consistency varies significantly across audit teams.",
      "Same generic report distributed to audit committee and management despite different needs."
    ]}
    agentification={[
      "Gemini drafts comprehensive audit reports with executive summary, root cause analysis, and recommendations.",
      "Automatic tone adaptation — risk-focused summary for audit committee, remediation guidance for management.",
      "Historical comparison highlights recurring findings and tracks remediation effectiveness across cycles."
    ]}
  />
);
