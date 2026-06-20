import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { HelpCircle, Search, FileText, Bell } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Policy Question", lane: "human", type: "trigger" },
    { id: "a1", label: "Policy Search", lane: "agent", type: "action" },
    { id: "a2", label: "Answer + Citation", lane: "agent", type: "action" },
    { id: "h2", label: "Resolution", lane: "human", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "h2"]],
};

const flow: FlowStep[] = [
  { label: "Question Asked", icon: HelpCircle, description: "Employee asks policy question in natural language.", trigger: "Any time", systems: ["Chat"] },
  { label: "Policy Search", icon: Search, description: "Relevant policy sections retrieved with context.", systems: ["Gemini", "Knowledge Base"], integration: "OOTB" },
  { label: "Answer + Citation", icon: FileText, description: "Plain-language answer with exact policy citations." },
  { label: "Escalation", icon: Bell, description: "Complex scenarios routed to ER with context.", output: "Policy Answer" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SharePoint/Google Drive", description: "Policy documents, employee handbooks, FAQ libraries", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Workday", description: "Employee profile, location, role for jurisdiction-specific policy lookup", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Natural language understanding, policy search, cited answer generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Question Parsing", description: "Parse employee's natural language policy question. Identify intent and relevant policy domain. Pull employee context from Workday for jurisdiction-specific answers.", systems: ["Vertex AI (Gemini)", "Workday"], layer: "llm", dataIn: "Employee question + employee ID", dataOut: "Parsed intent with employee jurisdiction context" },
    { label: "Policy Retrieval", description: "Search full policy corpus across SharePoint and Google Drive using RAG. Retrieve relevant policy sections with exact source citations and version references.", systems: ["SharePoint/Google Drive", "Vertex AI (Gemini)"], layer: "llm", dataIn: "Parsed intent + policy document corpus", dataOut: "Relevant policy sections with source citations" },
    { label: "Answer & Escalation", description: "Generate plain-language answer with exact policy citations. Route complex scenarios to ER team with pre-assembled context for expedited human review.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Retrieved policy sections + employee context", dataOut: "Cited policy answer or escalation with context" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Employee agent for the Policy Q&A Assistant workflow",
  primaryObjective: "Instant, cited answers to natural-language policy questions. Searches full policy corpus with direct source references. so the Employee can move the Response time KPI.",
  inScope: [
    "Instant, cited answers to natural-language policy questions",
    "Searches full policy corpus with direct source references",
    "24/7 availability for employees across all time zones",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_google_chat_messages",
      kind: "query",
      sourceSystemId: "google_chat",
      description: "Retrieve messages from Google Chat for the Policy Q&A Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_confluence_pages",
      kind: "query",
      sourceSystemId: "confluence",
      description: "Retrieve pages from Confluence for the Policy Q&A Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pages_records",
        "pages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sharepoint_documents",
      kind: "query",
      sourceSystemId: "sharepoint",
      description: "Retrieve documents from SharePoint for the Policy Q&A Assistant workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Policy Q&A Assistant workflow.",
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
      name: "lookup_policy_q_a_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Policy Q&A Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Response time moved from 1-2 days toward Instant",
      mustCite: [
        "google_chat.messages",
        "confluence.pages",
      ],
      sourceSystemIds: [
        "google_chat",
        "confluence",
      ],
    },
    {
      claim: "HR inquiry reduction moved from Baseline toward -50%",
      mustCite: [
        "google_chat.messages",
        "confluence.pages",
      ],
      sourceSystemIds: [
        "google_chat",
        "confluence",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Response time regresses past the 1-2 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Employee",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Chat (and other named systems) entities.",
    "Never bypass Employee approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "policy-q-a-assistant-end-to-end",
      prompt: "Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_chat_messages",
        "query_confluence_pages",
        "query_sharepoint_documents",
        "query_workday_employees",
        "lookup_policy_q_a_assistant_policy_handbook",
      ],
      mustReferenceEntities: [
        "messages",
        "pages",
        "documents",
        "employees",
      ],
      mustCiteDocuments: [
        "policy-q-a-assistant-policy-handbook",
      ],
      expectedActionOutcome: "Employee receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Policy Q&A Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_chat",
      name: "Google Chat",
      owns: [
        "messages",
        "threads",
        "delivery_receipts",
      ],
      protocol: "Workspace API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_google_chat_messages",
        "query_google_chat_threads",
        "query_google_chat_delivery_receipts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "confluence",
      name: "Confluence",
      owns: [
        "pages",
        "comments",
        "space_permissions",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_confluence_pages",
        "query_confluence_comments",
        "query_confluence_space_permissions",
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
  ],
  entities: [
    {
      name: "messages",
      sourceSystemId: "google_chat",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "threads",
      sourceSystemId: "google_chat",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "delivery_receipts",
      sourceSystemId: "google_chat",
      datastore: "json-api",
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
      name: "pages",
      sourceSystemId: "confluence",
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
      sourceSystemId: "confluence",
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
      name: "space_permissions",
      sourceSystemId: "confluence",
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
      name: "documents",
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
  ],
  relationships: [],
  documents: [
    {
      id: "policy-q-a-assistant-policy-handbook",
      sourceSystemId: "google_chat",
      type: "policy",
      title: "Policy Q&A Assistant Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "messages",
        "threads",
        "delivery_receipts",
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
      id: "policy-q-a-assistant-baseline-gap",
      description: "Seed a realistic gap where Response time sits between 1-2 days and Instant, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "messages",
        "threads",
      ],
      discoveryPath: [
        "Inspect Google Chat records for the affected entities",
        "Compare against Confluence historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Employee action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "policy_q_a_assistant",
      schemas: [
        "google_chat",
        "confluence",
        "sharepoint",
        "workday",
      ],
    },
    bigquery: {
      dataset: "hr_policy_q_a_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "policy-q-a-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "policy-q-a-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Policy Q&A Assistant workflow and cite source-system evidence for every claim.",
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

export const PolicyAssistant = () => (
  <UseCaseSlide
    title="Policy Q&A Assistant"
    subtitle="A-605 • Employee Relations"
    icon={HelpCircle}
    domainId="domain-6"
    layer="Layer 1: OOTB"
    persona="Employee"
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    systems={["Google Chat", "Confluence", "SharePoint", "Workday"]}
    kpis={[
      { label: "Response time", before: "1-2 days", after: "Instant" },
      { label: "HR inquiry reduction", before: "Baseline", after: "-50%" },
      { label: "Citation accuracy", before: "Varies", after: "100%" }
    ]}
    flow={flow}
    statusQuo={[
      "Policy queries handled via HR service desk; high repeat volume.",
      "Answer quality depends on individual representative knowledge.",
      "Employees struggle to find answers in fragmented handbooks."
    ]}
    agentification={[
      "Instant, cited answers to natural-language policy questions.",
      "Searches full policy corpus with direct source references.",
      "24/7 availability for employees across all time zones."
    ]}
  />
);
