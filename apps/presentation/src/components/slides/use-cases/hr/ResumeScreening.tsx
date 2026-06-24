import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Search, Download, Brain, Shield, Filter } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Applications Received", lane: "system", type: "trigger" },
    { id: "a1", label: "Deep Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Bias Check", lane: "agent", type: "action" },
    { id: "a3", label: "Rank & Score", lane: "agent", type: "action" },
    { id: "h1", label: "Recruiter Reviews", lane: "human", type: "hitl" },
    { id: "h2", label: "Final Decision", lane: "human", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"], ["h1", "h2"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Greenhouse", description: "Applications, resumes, candidate profiles", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Job profiles, competency frameworks, role requirements", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Deep resume analysis, competency extraction, bias detection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Screening analytics, adverse impact monitoring", direction: "write", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Application Ingestion", description: "Ingest resumes and application data from Greenhouse. Extract structured data from unstructured documents including PDFs, portfolios, and linked profiles.", systems: ["Greenhouse"], layer: "integration", dataIn: "Raw resumes, applications, linked profiles", dataOut: "Structured candidate data" },
    { label: "Deep Analysis & Scoring", description: "Gemini performs deep reasoning over resumes, extracting skills, experience signals, and culture indicators. Competency-to-role mapping generates match scores.", systems: ["Vertex AI (Gemini)", "Workday"], layer: "llm", dataIn: "Structured candidate data + role competencies", dataOut: "Ranked shortlist with match reasoning" },
    { label: "Bias Audit & Monitoring", description: "Demographic-blind scoring with systematic bias detection. Adverse impact metrics tracked across protected categories in BigQuery.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "ml", dataIn: "Screening decisions + demographic data", dataOut: "Fairness audit report with compliance flags" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Recruiter agent for the Resume Screening & Shortlisting workflow",
  primaryObjective: "Deep reasoning over resumes, portfolios, and GitHub profiles. Ranked shortlists based on competency-to-role mapping. so the Recruiter can move the Screening time KPI.",
  inScope: [
    "Deep reasoning over resumes, portfolios, and GitHub profiles",
    "Ranked shortlists based on competency-to-role mapping",
    "Systematic bias detection and adverse impact monitoring",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_ats_ats_records",
      kind: "query",
      sourceSystemId: "ats",
      description: "Retrieve ats records from ATS for the Resume Screening & Shortlisting workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ats_records_records",
        "ats_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Resume Screening & Shortlisting workflow.",
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
      name: "query_google_cloud_ai_billing_records",
      kind: "query",
      sourceSystemId: "google_cloud_ai",
      description: "Retrieve billing records from Google Cloud AI for the Resume Screening & Shortlisting workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_resume_screening_shortlisting_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "ats",
      description: "Look up sections of the Resume Screening & Shortlisting Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ats_file",
      kind: "action",
      sourceSystemId: "ats",
      description: "Execute the file step in ATS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Screening time moved from 8 min/resume toward 5 sec",
      mustCite: [
        "ats.ats_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "ats",
        "workday",
      ],
    },
    {
      claim: "Bias incidents moved from Undetected toward Flagged",
      mustCite: [
        "ats.ats_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "ats",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Screening time regresses past the 8 min/resume baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Recruiter",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed file action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ATS (and other named systems) entities.",
    "Never bypass Recruiter approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "resume-screening-shortlisting-end-to-end",
      prompt: "Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ats_ats_records",
        "query_workday_employees",
        "query_google_cloud_ai_billing_records",
        "lookup_resume_screening_shortlisting_policy_handbook",
        "action_ats_file",
      ],
      mustReferenceEntities: [
        "ats_records",
        "employees",
        "billing_records",
      ],
      mustCiteDocuments: [
        "resume-screening-shortlisting-policy-handbook",
      ],
      expectedActionOutcome: "Action file executed against ATS, with audit-trail entry and Recruiter notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute file without two-system evidence",
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
    rationale: "Row counts sized for Resume Screening & Shortlisting so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "ats",
      name: "ATS",
      owns: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ats_ats_records",
        "query_ats_ats_events",
        "query_ats_ats_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      id: "google_cloud_ai",
      name: "Google Cloud AI",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "GCP SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_cloud_ai_billing_records",
        "query_google_cloud_ai_resource_inventory",
        "query_google_cloud_ai_alarm_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "ats_records",
      sourceSystemId: "ats",
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
      name: "ats_events",
      sourceSystemId: "ats",
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
          name: "ats_record_id",
          type: "ref",
          ref: "ats_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ats_audit_trail",
      sourceSystemId: "ats",
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
      name: "billing_records",
      sourceSystemId: "google_cloud_ai",
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
          name: "service",
          type: "lorem.words",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 1,
          max: 10000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
          ],
          required: true,
        },
        {
          name: "period_start",
          type: "date",
          required: true,
        },
        {
          name: "period_end",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "resource_inventory",
      sourceSystemId: "google_cloud_ai",
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
      name: "alarm_events",
      sourceSystemId: "google_cloud_ai",
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
          name: "billing_record_id",
          type: "ref",
          ref: "billing_records.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "ats_events.ats_record_id",
      to: "ats_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "resume-screening-shortlisting-policy-handbook",
      sourceSystemId: "ats",
      type: "policy",
      title: "Resume Screening & Shortlisting Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
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
      id: "ats_file_api",
      sourceSystemId: "ats",
      method: "POST",
      path: "/api/ats/file",
      description: "Synchronous endpoint the agent calls to file in ATS after evidence gating.",
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
      id: "resume-screening-shortlisting-baseline-gap",
      description: "Seed a realistic gap where Screening time sits between 8 min/resume and 5 sec, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ats_records",
        "ats_events",
      ],
      discoveryPath: [
        "Inspect ATS records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Recruiter action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "resume_screening_shortlisting",
      schemas: [
        "ats",
        "workday",
        "google_cloud_ai",
      ],
    },
    bigquery: {
      dataset: "hr_resume_screening_shortlisting",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "resume-screening-shortlisting-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "resume-screening-shortlisting-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Resume Screening & Shortlisting workflow and cite source-system evidence for every claim.",
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

export const ResumeScreening = () => (
  <UseCaseSlide
    title="Resume Screening & Shortlisting"
    subtitle="A-204 • Talent Acquisition"
    icon={Search}
    domainId="domain-2"
    layer="Layer 3: Custom ADK"
    persona="Recruiter"
    systems={["ATS", "Workday", "Google Cloud AI"]}
    kpis={[
      { label: "Screening time", before: "8 min/resume", after: "5 sec" },
      { label: "Bias incidents", before: "Undetected", after: "Flagged" },
      { label: "Quality of shortlist", before: "60% relevant", after: "92% relevant" }
    ]}
    triggerType="event"
    swimlane={swimlane}
    hitl={{ actor: "Recruiter", action: "Review shortlist", description: "Agent deep-analyzes all resumes and generates a ranked shortlist with match reasoning. Recruiter reviews recommendations and approves before candidates advance." }}
    architecture={architecture}
    statusQuo={[
      "Manual review of 50-200 resumes per role family.",
      "Keyword-based filtering misses deep technical signals.",
      "Bias in screening is difficult to detect or measure."
    ]}
    agentification={[
      "Deep reasoning over resumes, portfolios, and GitHub profiles.",
      "Ranked shortlists based on competency-to-role mapping.",
      "Systematic bias detection and adverse impact monitoring."
    ]}
    flow={[
      { label: "Applications", icon: Download, description: "Resumes ingested from ATS and email.", trigger: "Application", systems: ["ATS"] },
      { label: "Deep Analysis", icon: Brain, description: "Skills, experience, culture signals extracted.", systems: ["Gemini"], integration: "ADK" },
      { label: "Bias Check", icon: Shield, description: "Demographic-blind scoring with fairness audit." },
      { label: "Shortlist", icon: Filter, description: "Ranked shortlist with match reasoning.", output: "Shortlist" }
    ] as FlowStep[]}
  />
);
