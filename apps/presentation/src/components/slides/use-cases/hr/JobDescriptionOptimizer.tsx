import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { PenTool, Upload, FileText, Eye, Send } from "lucide-react";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Role Request", lane: "human", type: "trigger" },
    { id: "a1", label: "JD Generation", lane: "agent", type: "action" },
    { id: "a2", label: "Bias Scan", lane: "agent", type: "action" },
    { id: "a3", label: "Published JD", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Role Input", icon: Upload, description: "Competency profile and level requirements provided.", trigger: "New Role / Update", systems: ["HRIS"] },
  { label: "JD Generation", icon: FileText, description: "Standardized JD drafted from competency framework.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Bias Scan", icon: Eye, description: "Inclusive language analysis and gender-decoder applied." },
  { label: "Publish", icon: Send, description: "Approved JD synced to ATS and job boards.", output: "Published JD" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Competency profiles, job families, leveling framework", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Textio", description: "Inclusive language scoring, bias detection analysis", direction: "read", protocol: "REST API", category: "ai" },
    { system: "Google Docs", description: "JD drafts with collaborative editing", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "JD generation from competency profiles, language optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Competency Ingestion", description: "Pull role competency profiles, job family definitions, and leveling framework from Workday. Structure requirements for JD generation.", systems: ["Workday"], layer: "integration", dataIn: "Competency profiles, job families, level requirements", dataOut: "Structured role requirements" },
    { label: "JD Generation & Bias Scan", description: "Gemini generates standardized JDs from competency framework. Textio analyzes language for inclusivity, gender-coded terms, and readability.", systems: ["Vertex AI (Gemini)", "Textio"], layer: "llm", dataIn: "Structured requirements + brand voice guidelines", dataOut: "Inclusive, standardized JD draft" },
    { label: "Publishing", description: "Approved JDs delivered to Google Docs for review and synced to ATS and job boards for posting.", systems: ["Google Docs"], layer: "integration", dataIn: "Approved JD content", dataOut: "Published job descriptions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Recruiter agent for the Job Description Generator & Optimizer workflow",
  primaryObjective: "Generates standardized, inclusive JDs from competency profiles. Real-time bias-free language screening and optimization. so the Recruiter can move the JD creation time KPI.",
  inScope: [
    "Generates standardized, inclusive JDs from competency profiles",
    "Real-time bias-free language screening and optimization",
    "Systematic alignment to job architecture and career tracks",
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
      description: "Retrieve employees from Workday for the Job Description Generator & Optimizer workflow.",
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
      name: "query_linkedin_linkedin_records",
      kind: "query",
      sourceSystemId: "linkedin",
      description: "Retrieve linkedin records from LinkedIn for the Job Description Generator & Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "linkedin_records_records",
        "linkedin_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_textio_textio_records",
      kind: "query",
      sourceSystemId: "textio",
      description: "Retrieve textio records from Textio for the Job Description Generator & Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "textio_records_records",
        "textio_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Job Description Generator & Optimizer workflow.",
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
      name: "lookup_job_description_generator_optimizer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Job Description Generator & Optimizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_file",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the file step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "JD creation time moved from 4 hours toward 10 min",
      mustCite: [
        "workday.employees",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "workday",
        "linkedin",
      ],
    },
    {
      claim: "Inclusive language score moved from Unchecked toward 95%+",
      mustCite: [
        "workday.employees",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "workday",
        "linkedin",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "JD creation time regresses past the 4 hours baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Recruiter approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "job-description-generator-optimizer-end-to-end",
      prompt: "Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_linkedin_linkedin_records",
        "query_textio_textio_records",
        "query_google_docs_documents",
        "lookup_job_description_generator_optimizer_policy_handbook",
        "action_workday_file",
      ],
      mustReferenceEntities: [
        "employees",
        "linkedin_records",
        "textio_records",
        "documents",
      ],
      mustCiteDocuments: [
        "job-description-generator-optimizer-policy-handbook",
      ],
      expectedActionOutcome: "Action file executed against Workday, with audit-trail entry and Recruiter notified of outcomes.",
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
    rationale: "Row counts sized for Job Description Generator & Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "linkedin",
      name: "LinkedIn",
      owns: [
        "linkedin_records",
        "linkedin_events",
        "linkedin_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_linkedin_linkedin_records",
        "query_linkedin_linkedin_events",
        "query_linkedin_linkedin_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "textio",
      name: "Textio",
      owns: [
        "textio_records",
        "textio_events",
        "textio_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_textio_textio_records",
        "query_textio_textio_events",
        "query_textio_textio_audit_trail",
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
      name: "linkedin_records",
      sourceSystemId: "linkedin",
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
      name: "linkedin_events",
      sourceSystemId: "linkedin",
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
          name: "linkedin_record_id",
          type: "ref",
          ref: "linkedin_records.id",
          required: true,
        },
      ],
    },
    {
      name: "linkedin_audit_trail",
      sourceSystemId: "linkedin",
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
      name: "textio_records",
      sourceSystemId: "textio",
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
      name: "textio_events",
      sourceSystemId: "textio",
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
          name: "textio_record_id",
          type: "ref",
          ref: "textio_records.id",
          required: true,
        },
      ],
    },
    {
      name: "textio_audit_trail",
      sourceSystemId: "textio",
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
      from: "linkedin_events.linkedin_record_id",
      to: "linkedin_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "textio_events.textio_record_id",
      to: "textio_records.id",
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
      id: "job-description-generator-optimizer-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Job Description Generator & Optimizer Policy Handbook",
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
  apis: [
    {
      id: "workday_file_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/file",
      description: "Synchronous endpoint the agent calls to file in Workday after evidence gating.",
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
      id: "job-description-generator-optimizer-baseline-gap",
      description: "Seed a realistic gap where JD creation time sits between 4 hours and 10 min, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against LinkedIn historical baseline",
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
      database: "job_description_generator_optimizer",
      schemas: [
        "workday",
        "linkedin",
        "textio",
        "google_docs",
      ],
    },
    bigquery: {
      dataset: "hr_job_description_generator_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "job-description-generator-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "job-description-generator-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Job Description Generator & Optimizer workflow and cite source-system evidence for every claim.",
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

export const JobDescriptionOptimizer = () => (
  <UseCaseSlide
    title="Job Description Generator & Optimizer"
    subtitle="A-107 • Job Architecture"
    icon={PenTool}
    domainId="domain-1"
    layer="Layer 1: OOTB"
    persona="Recruiter"
    systems={["Workday", "LinkedIn", "Textio", "Google Docs"]}
    kpis={[
      { label: "JD creation time", before: "4 hours", after: "10 min" },
      { label: "Inclusive language score", before: "Unchecked", after: "95%+" },
      { label: "Consistency", before: "Ad-hoc", after: "Standardized" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "JDs written individually with wide quality variation and inconsistent tone.",
      "Bias in language often goes undetected, impacting diversity hiring.",
      "Competency profiles are disconnected from the actual job postings."
    ]}
    agentification={[
      "Generates standardized, inclusive JDs from competency profiles.",
      "Real-time bias-free language screening and optimization.",
      "Systematic alignment to job architecture and career tracks."
    ]}
  />
);
