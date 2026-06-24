import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { HelpCircle, Search, Brain, Bell } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Question Asked", lane: "human", type: "trigger" },
    { id: "a1", label: "Context Retrieval", lane: "agent", type: "action" },
    { id: "a2", label: "Answer Generated", lane: "agent", type: "action" },
    { id: "h2", label: "Resolution", lane: "human", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "h2"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Employee profile, benefits enrollment, policy entitlements", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Drive", description: "Policy documents, benefits guides, onboarding materials", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Contextual answer generation, knowledge retrieval", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Knowledge Indexing", description: "Index policy documents, benefits guides, and HR knowledge base from Google Drive and SharePoint. Build semantic search index for rapid retrieval.", systems: ["Google Drive"], layer: "integration", dataIn: "Policy corpus, benefits docs, onboarding guides", dataOut: "Semantic knowledge index" },
    { label: "Contextual Answer Generation", description: "Gemini generates accurate, cited answers tailored to the employee's role, location, and start date. Cross-references Workday profile for personalization.", systems: ["Vertex AI (Gemini)", "Workday"], layer: "llm", dataIn: "Question + employee context + knowledge index", dataOut: "Cited, personalized answer" },
    { label: "Learning & Escalation", description: "Track interaction patterns to improve response quality. Route complex or unanswered questions to HR with full conversation context.", systems: ["Vertex AI (Gemini)"], layer: "ml", dataIn: "Interaction logs + satisfaction signals", dataOut: "Improved knowledge base + escalated tickets" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "New Hire agent for the New Hire Q&A Assistant workflow",
  primaryObjective: "AI-powered conversational assistant providing instant, accurate answers to new hire questions 24/7. Contextual responses drawn from the full policy corpus, tailored to the employee's role, location, and start date. so the New Hire can move the Response time KPI.",
  inScope: [
    "AI-powered conversational assistant providing instant, accurate answers to new hire questions 24/7",
    "Contextual responses drawn from the full policy corpus, tailored to the employee's role, location, and start date",
    "Continuously learns from interaction patterns to improve response quality and surface knowledge gaps to HR",
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
      description: "Retrieve messages from Google Chat for the New Hire Q&A Assistant workflow.",
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
      description: "Retrieve pages from Confluence for the New Hire Q&A Assistant workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the New Hire Q&A Assistant workflow.",
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
      name: "query_lms_lms_records",
      kind: "query",
      sourceSystemId: "lms",
      description: "Retrieve lms records from LMS for the New Hire Q&A Assistant workflow.",
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
      name: "lookup_new_hire_q_a_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the New Hire Q&A Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_chat_post_answer",
      kind: "action",
      sourceSystemId: "google_chat",
      description: "Post the cited answer back to the new-hire's Google Chat thread, tagging the source confluence page and noting any unresolved follow-up needed from a human partner.",
      requiredInputs: [
        "thread_id",
        "answer_text",
        "citation_anchors",
      ],
      produces: [
        "chat_message_id",
        "delivery_receipt",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
    {
      name: "action_servicenow_open_hr_ticket",
      kind: "action",
      sourceSystemId: "workday",
      description: "Open an HR ticket when the assistant cannot ground its answer with cited evidence, routing the question to the People team with the original chat transcript and confluence search trail attached.",
      requiredInputs: [
        "employee_id",
        "question_text",
        "search_trail",
      ],
      produces: [
        "hr_ticket_id",
        "routing_assignment",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Response time moved from 24-48 hrs toward Instant",
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
      claim: "HR ticket volume moved from 100% toward -60%",
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
      trigger: "Response time regresses past the 24-48 hrs baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "New Hire",
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
    "Never bypass New Hire approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "new-hire-q-a-assistant-end-to-end",
      prompt: "Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_chat_messages",
        "query_confluence_pages",
        "query_workday_employees",
        "query_lms_lms_records",
        "lookup_new_hire_q_a_assistant_policy_handbook",
      ],
      mustReferenceEntities: [
        "messages",
        "pages",
        "employees",
        "lms_records",
      ],
      mustCiteDocuments: [
        "new-hire-q-a-assistant-policy-handbook",
      ],
      expectedActionOutcome: "New Hire receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for New Hire Q&A Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
  ],
  relationships: [
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "new-hire-q-a-assistant-policy-handbook",
      sourceSystemId: "google_chat",
      type: "policy",
      title: "New Hire Q&A Assistant Policy Handbook",
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
  apis: [
    {
      id: "google_chat_post_answer",
      sourceSystemId: "google_chat",
      method: "POST",
      path: "/v1/spaces/{space_id}/messages",
      description: "Post a cited answer message back to the new-hire's chat thread.",
      requestSchema: {
        space_id: "string",
        thread_id: "string",
        answer_text: "string",
        citation_anchors: "string[]",
      },
      responseSchema: {
        message_id: "string",
        thread_id: "string",
        created_at: "string",
      },
      idempotencyKey: "thread_id+answer_hash",
    },
    {
      id: "servicenow_open_hr_ticket",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/now/v1/table/hr_case",
      description: "Open an HR case for People-team triage when the assistant cannot ground an answer.",
      requestSchema: {
        employee_id: "string",
        short_description: "string",
        question_text: "string",
        search_trail: "string",
      },
      responseSchema: {
        sys_id: "string",
        ticket_number: "string",
        assignment_group: "string",
      },
      idempotencyKey: "employee_id+question_hash",
    },
  ],
  anomalies: [
    {
      id: "new-hire-q-a-assistant-baseline-gap",
      description: "Seed a realistic gap where Response time sits between 24-48 hrs and Instant, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next New Hire action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "new_hire_q_a_assistant",
      schemas: [
        "google_chat",
        "confluence",
        "workday",
        "lms",
      ],
    },
    bigquery: {
      dataset: "hr_new_hire_q_a_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "new-hire-q-a-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "new-hire-q-a-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the New Hire Q&A Assistant workflow and cite source-system evidence for every claim.",
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

export const NewHireQA = () => (
  <UseCaseSlide
    title="New Hire Q&A Assistant"
    subtitle="A-212 • Onboarding & Integration"
    icon={HelpCircle}
    domainId="domain-2"
    layer="Layer 1: OOTB"
    persona="New Hire"
    systems={["Google Chat", "Confluence", "Workday", "LMS"]}
    kpis={[
      { label: "Response time", before: "24-48 hrs", after: "Instant" },
      { label: "HR ticket volume", before: "100%", after: "-60%" },
      { label: "Answer accuracy", before: "Varies", after: "95%+" }
    ]}
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "New hires flood HR with repetitive questions that consume significant HR generalist bandwidth.",
      "Policy documents and benefits guides are hard to navigate, buried across multiple portals and intranets.",
      "Onboarding FAQs become outdated quickly and fail to address location- or role-specific nuances."
    ]}
    agentification={[
      "AI-powered conversational assistant providing instant, accurate answers to new hire questions 24/7.",
      "Contextual responses drawn from the full policy corpus, tailored to the employee's role, location, and start date.",
      "Continuously learns from interaction patterns to improve response quality and surface knowledge gaps to HR."
    ]}
    flow={[
      { label: "Question Asked", icon: HelpCircle, description: "New hire asks via chat or portal.", trigger: "Any time", systems: ["Chat"] },
      { label: "Context Retrieval", icon: Search, description: "Policy docs, benefits info, org data searched.", systems: ["Gemini", "Knowledge Base"], integration: "OOTB" },
      { label: "Answer Generated", icon: Brain, description: "Cited, contextual answer with follow-up suggestions." },
      { label: "Escalation", icon: Bell, description: "Complex questions routed to HR with context.", output: "Resolution" }
    ] as FlowStep[]}
  />
);
