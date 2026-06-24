import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { MessageSquare, Download, FileText, Shield, Edit } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Data Gathered", icon: Download, description: "Goals, feedback, achievements, metrics collected.", trigger: "Review Cycle", systems: ["HRIS"] },
  { label: "Narrative Draft", icon: FileText, description: "Evidence-based review narrative generated.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Bias Scan", icon: Shield, description: "Language screened for bias and recency effects." },
  { label: "Manager Edit", icon: Edit, description: "Manager refines and submits.", output: "Review Complete" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Review Cycle", lane: "system", type: "trigger" },
    { id: "draft", label: "Narrative Draft", lane: "agent", type: "action" },
    { id: "bias", label: "Bias Scan", lane: "agent", type: "action" },
    { id: "hitl", label: "Manager Edits", lane: "human", type: "hitl" },
    { id: "output", label: "Review Submitted", lane: "human", type: "output" },
  ],
  connections: [["trigger", "draft"], ["draft", "bias"], ["bias", "hitl"], ["hitl", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Goal achievement data, performance history, rating definitions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Lattice", description: "Feedback records, 360 reviews, peer assessments", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Docs", description: "Review narrative drafts with collaborative editing", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Narrative generation, bias scanning, language optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Evidence Assembly", description: "Gather goals, achievements, feedback, and performance metrics from Workday and Lattice. Structure evidence for narrative generation.", systems: ["Workday", "Lattice"], layer: "integration", dataIn: "Goals, feedback, achievements, metrics", dataOut: "Structured evidence package" },
    { label: "Narrative Generation & Bias Scan", description: "Gemini generates balanced, evidence-based performance narratives aligned to rating definitions. Automatic bias and recency effect detection.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Evidence package + rating anchors", dataOut: "Draft narrative with bias flags" },
    { label: "Manager Review", description: "Draft delivered to Google Docs for manager review and editing. Manager adds personal context before submission.", systems: ["Google Docs"], layer: "integration", dataIn: "Draft narrative", dataOut: "Manager-approved performance review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Manager agent for the Performance Review Narrative Assistant workflow",
  primaryObjective: "Transforms bullet points into balanced, high-quality narratives. Automatic alignment to rating definitions and anchors. so the Manager can move the Writing time KPI.",
  inScope: [
    "Transforms bullet points into balanced, high-quality narratives",
    "Automatic alignment to rating definitions and anchors",
    "Real-time bias flagging and legal risk screening",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Performance Review Narrative Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Performance Review Narrative Assistant workflow.",
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
      name: "query_lattice_engagement_surveys",
      kind: "query",
      sourceSystemId: "lattice",
      description: "Retrieve engagement surveys from Lattice for the Performance Review Narrative Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "engagement_surveys_records",
        "engagement_surveys_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_performance_review_narrative_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Performance Review Narrative Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
  ],
  evidenceRequirements: [
    {
      claim: "Writing time moved from 4 hours toward 15 min",
      mustCite: [
        "workday.employees",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "workday",
        "google_docs",
      ],
    },
    {
      claim: "Bias flags moved from None toward Auto-detected",
      mustCite: [
        "workday.employees",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "workday",
        "google_docs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Writing time regresses past the 4 hours baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "performance-review-narrative-assistant-end-to-end",
      prompt: "Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_google_docs_documents",
        "query_lattice_engagement_surveys",
        "lookup_performance_review_narrative_assistant_policy_handbook",
      ],
      mustReferenceEntities: [
        "employees",
        "documents",
        "engagement_surveys",
      ],
      mustCiteDocuments: [
        "performance-review-narrative-assistant-policy-handbook",
      ],
      expectedActionOutcome: "Manager receives a fully-cited recommendation; no external state change without explicit approval.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not act on single-system evidence",
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
    rationale: "Row counts sized for Performance Review Narrative Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
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
      id: "lattice",
      name: "Lattice",
      owns: [
        "engagement_surveys",
        "feedback_records",
        "review_cycles",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lattice_engagement_surveys",
        "query_lattice_feedback_records",
        "query_lattice_review_cycles",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "employees",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
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
      name: "engagement_surveys",
      sourceSystemId: "lattice",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "feedback_records",
      sourceSystemId: "lattice",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "review_cycles",
      sourceSystemId: "lattice",
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
  ],
  documents: [
    {
      id: "performance-review-narrative-assistant-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Performance Review Narrative Assistant Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "employees",
        "positions",
        "compensation_records",
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
  apis: [],
  anomalies: [
    {
      id: "performance-review-narrative-assistant-baseline-gap",
      description: "Seed a realistic gap where Writing time sits between 4 hours and 15 min, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Google Docs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "performance_review_narrative_assistant",
      schemas: [
        "workday",
        "google_docs",
        "lattice",
      ],
    },
    bigquery: {
      dataset: "hr_performance_review_narrative_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "performance-review-narrative-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "performance-review-narrative-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Performance Review Narrative Assistant workflow and cite source-system evidence for every claim.",
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

export const PerformanceNarrative = () => (
  <UseCaseSlide
    title="Performance Review Narrative Assistant"
    subtitle="A-305 • Performance Mgmt"
    icon={MessageSquare}
    domainId="domain-3"
    layer="Layer 1: OOTB"
    persona="Manager"
    systems={["Workday", "Google Docs", "Lattice"]}
    kpis={[
      { label: "Writing time", before: "4 hours", after: "15 min" },
      { label: "Bias flags", before: "None", after: "Auto-detected" },
      { label: "Quality consistency", before: "Varies by manager", after: "Standardized" },
    ]}
    flow={flow}
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    hitl={{ actor: "Manager", action: "Review & edit narrative", description: "Agent drafts evidence-based performance narrative. Manager reviews, edits for personal context, and submits as their own assessment." }}
    statusQuo={[
      "Managers write reviews from scratch; wide quality variation.",
      "Common issues: vague, biased, or inconsistent narratives.",
      "Review cycle takes weeks of manager administrative time."
    ]}
    agentification={[
      "Transforms bullet points into balanced, high-quality narratives.",
      "Automatic alignment to rating definitions and anchors.",
      "Real-time bias flagging and legal risk screening."
    ]}
  />
);
