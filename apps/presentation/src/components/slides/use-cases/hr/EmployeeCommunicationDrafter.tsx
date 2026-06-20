import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Pen, Upload, FileText, GitBranch, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Comms Brief", lane: "human", type: "trigger" },
    { id: "a1", label: "Content Generation", lane: "agent", type: "action" },
    { id: "a2", label: "Channel Optimization", lane: "agent", type: "action" },
    { id: "a3", label: "Communication Sent", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Brief Input", icon: Upload, description: "Communication topic, audience, tone provided.", trigger: "Comms Need", systems: ["Docs"] },
  { label: "Content Generation", icon: FileText, description: "Brand-voice-consistent draft with audience variants.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Channel Optimization", icon: GitBranch, description: "Best channel per audience segment recommended." },
  { label: "Distribution", icon: Send, description: "Multi-channel scheduled distribution.", output: "Communication Sent" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Docs", description: "Communication briefs, brand guidelines, draft outputs", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Slack", description: "Internal communication distribution and engagement tracking", direction: "write", protocol: "Webhook", category: "collaboration" },
    { system: "Workday", description: "Employee segments, locations, roles for audience targeting", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Brand-voice content generation, audience personalization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Brief Intake", description: "Ingest communication brief with topic, audience, tone, and channel preferences. Pull brand voice guidelines and audience segmentation data from Workday.", systems: ["Google Docs", "Workday"], layer: "integration", dataIn: "Communication brief + brand guidelines + org segments", dataOut: "Structured brief with audience targeting matrix" },
    { label: "Content Generation", description: "Gemini generates brand-voice-consistent drafts with audience-specific variants. Adapts tone, length, and complexity based on target segment (executive vs. all-hands).", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Structured brief + brand voice rules", dataOut: "Multi-variant communication drafts" },
    { label: "Channel Optimization", description: "Recommend optimal channel per audience segment based on historical engagement data. Suggest timing and frequency for maximum reach.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Audience segments + channel engagement history", dataOut: "Channel-optimized distribution plan" },
    { label: "Multi-Channel Distribution", description: "Schedule and distribute communications across email, Slack, and intranet. Track delivery and initial engagement metrics.", systems: ["Slack", "Google Docs"], layer: "integration", dataIn: "Final drafts + distribution plan", dataOut: "Distributed communications with delivery tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Internal Comms agent for the Employee Communication Drafter workflow",
  primaryObjective: "Brand-voice-consistent communication generation aligned to tone guidelines. Audience-segmented personalization by role, location, and department. so the Internal Comms can move the Drafting time KPI.",
  inScope: [
    "Brand-voice-consistent communication generation aligned to tone guidelines",
    "Audience-segmented personalization by role, location, and department",
    "Multi-channel distribution optimization across email, Slack, and intranet",
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
      description: "Retrieve documents from Google Docs for the Employee Communication Drafter workflow.",
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
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Employee Communication Drafter workflow.",
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
      name: "query_gmail_messages",
      kind: "query",
      sourceSystemId: "gmail",
      description: "Retrieve messages from Gmail for the Employee Communication Drafter workflow.",
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
      name: "query_intranet_intranet_records",
      kind: "query",
      sourceSystemId: "intranet",
      description: "Retrieve intranet records from Intranet for the Employee Communication Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "intranet_records_records",
        "intranet_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_employee_communication_drafter_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Employee Communication Drafter Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_docs_draft",
      kind: "action",
      sourceSystemId: "google_docs",
      description: "Execute the draft step in Google Docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Drafting time moved from 1 day toward 15 min",
      mustCite: [
        "google_docs.documents",
        "slack.messages",
      ],
      sourceSystemIds: [
        "google_docs",
        "slack",
      ],
    },
    {
      claim: "Audience segments moved from 1 blast toward 5+ tailored",
      mustCite: [
        "google_docs.documents",
        "slack.messages",
      ],
      sourceSystemIds: [
        "google_docs",
        "slack",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Drafting time regresses past the 1 day baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Internal Comms",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Docs (and other named systems) entities.",
    "Never bypass Internal Comms approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "employee-communication-drafter-end-to-end",
      prompt: "Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_slack_messages",
        "query_gmail_messages",
        "query_intranet_intranet_records",
        "lookup_employee_communication_drafter_policy_handbook",
        "action_google_docs_draft",
      ],
      mustReferenceEntities: [
        "documents",
        "messages",
        "messages",
        "intranet_records",
      ],
      mustCiteDocuments: [
        "employee-communication-drafter-policy-handbook",
      ],
      expectedActionOutcome: "Action draft executed against Google Docs, with audit-trail entry and Internal Comms notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute draft without two-system evidence",
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
    rationale: "Row counts sized for Employee Communication Drafter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "slack",
      name: "Slack",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_messages",
        "query_slack_channels",
        "query_slack_thread_replies",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gmail",
      name: "Gmail",
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
        "query_gmail_messages",
        "query_gmail_threads",
        "query_gmail_delivery_receipts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "intranet",
      name: "Intranet",
      owns: [
        "intranet_records",
        "intranet_events",
        "intranet_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_intranet_intranet_records",
        "query_intranet_intranet_events",
        "query_intranet_intranet_audit_trail",
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
      name: "messages",
      sourceSystemId: "slack",
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
      name: "channels",
      sourceSystemId: "slack",
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
      name: "thread_replies",
      sourceSystemId: "slack",
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
      sourceSystemId: "gmail",
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
      sourceSystemId: "gmail",
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
      name: "intranet_records",
      sourceSystemId: "intranet",
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
      name: "intranet_events",
      sourceSystemId: "intranet",
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
          name: "intranet_record_id",
          type: "ref",
          ref: "intranet_records.id",
          required: true,
        },
      ],
    },
    {
      name: "intranet_audit_trail",
      sourceSystemId: "intranet",
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
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "intranet_events.intranet_record_id",
      to: "intranet_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "employee-communication-drafter-policy-handbook",
      sourceSystemId: "google_docs",
      type: "policy",
      title: "Employee Communication Drafter Policy Handbook",
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
      id: "google_docs_draft_api",
      sourceSystemId: "google_docs",
      method: "POST",
      path: "/api/google_docs/draft",
      description: "Synchronous endpoint the agent calls to draft in Google Docs after evidence gating.",
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
      id: "employee-communication-drafter-baseline-gap",
      description: "Seed a realistic gap where Drafting time sits between 1 day and 15 min, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against Slack historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Internal Comms action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "employee_communication_drafter",
      schemas: [
        "google_docs",
        "slack",
        "gmail",
        "intranet",
      ],
    },
    bigquery: {
      dataset: "hr_employee_communication_drafter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "employee-communication-drafter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "employee-communication-drafter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Employee Communication Drafter workflow and cite source-system evidence for every claim.",
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

export const EmployeeCommunicationDrafter = () => (
  <UseCaseSlide
    title="Employee Communication Drafter"
    subtitle="A-706 • Internal Communications"
    icon={Pen}
    domainId="domain-7"
    layer="Layer 1: OOTB"
    persona="Internal Comms"
    triggerType="chat"
    swimlane={swimlane}
    systems={["Google Docs", "Slack", "Gmail", "Intranet"]}
    kpis={[
      { label: "Drafting time", before: "1 day", after: "15 min" },
      { label: "Audience segments", before: "1 blast", after: "5+ tailored" },
      { label: "Brand consistency", before: "Varies by author", after: "AI-enforced" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Internal comms drafted manually with inconsistent brand voice across teams.",
      "Same message sent to all audiences regardless of relevance or role.",
      "Channel strategy is ad-hoc with no data on where employees actually engage."
    ]}
    agentification={[
      "Brand-voice-consistent communication generation aligned to tone guidelines.",
      "Audience-segmented personalization by role, location, and department.",
      "Multi-channel distribution optimization across email, Slack, and intranet."
    ]}
  />
);
