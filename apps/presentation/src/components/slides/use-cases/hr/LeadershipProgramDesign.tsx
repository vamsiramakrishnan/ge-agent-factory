import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Crown, Download, Layers, Users, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Program Request", lane: "human", type: "trigger" },
    { id: "a1", label: "Competency Gap Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Program Design", lane: "agent", type: "action" },
    { id: "a3", label: "Leadership Program", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Competency Gaps", icon: Download, description: "Leadership competency gaps from assessments.", trigger: "Program Design", systems: ["Assessments"] },
  { label: "Program Design", icon: Layers, description: "Modular program with internal case studies + best practices.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Cohort Setup", icon: Users, description: "Participant selection, scheduling, mentor matching." },
  { label: "Launch", icon: Send, description: "Program launched with milestone tracking.", output: "Leadership Program" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Leadership competency frameworks, succession plans, 360 feedback data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Cornerstone", description: "Learning catalog, program templates, historical program data", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Competency gap analytics, program effectiveness baselines", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Program design reasoning, content curation, cohort optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Competency Gap Analysis", description: "Analyze leadership competency gaps from 360 feedback, assessments, and succession readiness data. Identify critical capability needs by leadership level.", systems: ["Workday", "BigQuery"], layer: "integration", dataIn: "360 feedback + succession plans + assessments", dataOut: "Leadership competency gap matrix by level" },
    { label: "Program Design", description: "Gemini designs modular leadership program blending internal case studies with external best practices. Tailors content by competency gap and leadership level.", systems: ["Vertex AI (Gemini)", "Cornerstone"], layer: "llm", dataIn: "Gap matrix + available content + best practices", dataOut: "Modular program curriculum with learning objectives" },
    { label: "Cohort & Launch", description: "Optimize participant selection based on development need and succession priority. Automate scheduling, mentor matching, and milestone tracking for program execution.", systems: ["Workday", "Cornerstone"], layer: "integration", dataIn: "Program design + participant pool", dataOut: "Launched program with cohort assignments and tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "L&D Lead agent for the Leadership Program Design Assistant workflow",
  primaryObjective: "Data-driven program design based on leadership competency gaps and succession needs. Curated content blending internal case studies with external best practices by level. so the L&D Lead can move the Design time KPI.",
  inScope: [
    "Data-driven program design based on leadership competency gaps and succession needs",
    "Curated content blending internal case studies with external best practices by level",
    "Automated cohort orchestration including scheduling, assignments, and progress tracking",
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
      description: "Retrieve lms records from LMS for the Leadership Program Design Assistant workflow.",
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
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Leadership Program Design Assistant workflow.",
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
      name: "query_assessment_platform_assessment_platform_records",
      kind: "query",
      sourceSystemId: "assessment_platform",
      description: "Retrieve assessment platform records from Assessment Platform for the Leadership Program Design Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "assessment_platform_records_records",
        "assessment_platform_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_leadership_program_design_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Leadership Program Design Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_lms_assign",
      kind: "action",
      sourceSystemId: "lms",
      description: "Execute the assign step in LMS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Design time moved from 3 months toward 2 weeks",
      mustCite: [
        "lms.lms_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "lms",
        "google_docs",
      ],
    },
    {
      claim: "Content relevance moved from External generic toward Internal + external",
      mustCite: [
        "lms.lms_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "lms",
        "google_docs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Design time regresses past the 3 months baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "L&D Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed assign action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from LMS (and other named systems) entities.",
    "Never bypass L&D Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "leadership-program-design-assistant-end-to-end",
      prompt: "Run the Leadership Program Design Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_lms_lms_records",
        "query_google_docs_documents",
        "query_assessment_platform_assessment_platform_records",
        "lookup_leadership_program_design_assistant_policy_handbook",
        "action_lms_assign",
      ],
      mustReferenceEntities: [
        "lms_records",
        "documents",
        "assessment_platform_records",
      ],
      mustCiteDocuments: [
        "leadership-program-design-assistant-policy-handbook",
      ],
      expectedActionOutcome: "Action assign executed against LMS, with audit-trail entry and L&D Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute assign without two-system evidence",
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
    rationale: "Row counts sized for Leadership Program Design Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "assessment_platform",
      name: "Assessment Platform",
      owns: [
        "assessment_platform_records",
        "assessment_platform_events",
        "assessment_platform_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_assessment_platform_assessment_platform_records",
        "query_assessment_platform_assessment_platform_events",
        "query_assessment_platform_assessment_platform_audit_trail",
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
      name: "assessment_platform_records",
      sourceSystemId: "assessment_platform",
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
      name: "assessment_platform_events",
      sourceSystemId: "assessment_platform",
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
          name: "assessment_platform_record_id",
          type: "ref",
          ref: "assessment_platform_records.id",
          required: true,
        },
      ],
    },
    {
      name: "assessment_platform_audit_trail",
      sourceSystemId: "assessment_platform",
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
  ],
  relationships: [
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "assessment_platform_events.assessment_platform_record_id",
      to: "assessment_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "leadership-program-design-assistant-policy-handbook",
      sourceSystemId: "lms",
      type: "policy",
      title: "Leadership Program Design Assistant Policy Handbook",
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
      id: "lms_assign_api",
      sourceSystemId: "lms",
      method: "POST",
      path: "/api/lms/assign",
      description: "Synchronous endpoint the agent calls to assign in LMS after evidence gating.",
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
      id: "leadership-program-design-assistant-baseline-gap",
      description: "Seed a realistic gap where Design time sits between 3 months and 2 weeks, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "lms_records",
        "lms_events",
      ],
      discoveryPath: [
        "Inspect LMS records for the affected entities",
        "Compare against Google Docs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next L&D Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "leadership_program_design_assistant",
      schemas: [
        "lms",
        "google_docs",
        "assessment_platform",
      ],
    },
    bigquery: {
      dataset: "hr_leadership_program_design_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "leadership-program-design-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "leadership-program-design-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Leadership Program Design Assistant workflow and cite source-system evidence for every claim.",
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

export const LeadershipProgramDesign = () => (
  <UseCaseSlide
    title="Leadership Program Design Assistant"
    subtitle="A-507 • L&D"
    icon={Crown}
    domainId="domain-5"
    layer="Layer 1: OOTB"
    persona="L&D Lead"
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    systems={["LMS", "Google Docs", "Assessment Platform"]}
    kpis={[
      { label: "Design time", before: "3 months", after: "2 weeks" },
      { label: "Content relevance", before: "External generic", after: "Internal + external" },
      { label: "Cohort management", before: "Manual", after: "Automated" }
    ]}
    flow={flow}
    statusQuo={[
      "Leadership programs designed by external consultants at high cost and long timelines.",
      "Content is generic across leadership levels with no differentiation by competency gap.",
      "Cohort management handled through manual coordination and spreadsheet tracking."
    ]}
    agentification={[
      "Data-driven program design based on leadership competency gaps and succession needs.",
      "Curated content blending internal case studies with external best practices by level.",
      "Automated cohort orchestration including scheduling, assignments, and progress tracking."
    ]}
  />
);
