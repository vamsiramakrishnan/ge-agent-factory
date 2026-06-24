import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BookOpen, Search, MessageSquare, CheckCircle, HelpCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Ticket / Chat Query", lane: "system", type: "trigger" },
    { id: "a1", label: "KB Search", lane: "agent", type: "action" },
    { id: "a2", label: "Answer Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Self-Service Response", lane: "agent", type: "output" },
    { id: "h1", label: "User Confirms", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Query Received", icon: HelpCircle, description: "User submits IT question via ticket, chat, or Slack integration.", trigger: "Event + Chat", systems: ["ServiceNow", "Slack"] },
  { label: "Knowledge Search", icon: Search, description: "Semantic search across knowledge base, Confluence, and historical ticket resolutions.", systems: ["Confluence", "BigQuery"], integration: "ADK" },
  { label: "Answer Generation", icon: MessageSquare, description: "LLM generates contextual answer incorporating recent changes and version-specific guidance.", systems: ["Vertex AI"] },
  { label: "User Confirmation", icon: CheckCircle, description: "User confirms resolution; ticket auto-closed if resolved, escalated if not.", output: "Self-Service Resolution" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow", description: "Ticket creation, knowledge base articles, resolution tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Confluence", description: "IT documentation, runbooks, how-to guides", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Google Workspace", description: "Internal IT communications, policy documents", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "BigQuery", description: "Historical ticket resolutions, knowledge gap analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Semantic KB search, contextual answer generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Query Understanding", description: "Parse user query from ticket description, Slack message, or chat. Extract intent, identify product/service references, and detect platform specifics (macOS vs. Windows).", systems: ["ServiceNow", "Slack"], layer: "integration", dataIn: "User IT question from any channel", dataOut: "Structured query with intent and context" },
    { label: "Semantic Knowledge Retrieval", description: "Search knowledge base articles, Confluence runbooks, and historical ticket resolutions using semantic similarity. Rank by relevance and recency.", systems: ["Confluence", "BigQuery"], layer: "ml", dataIn: "Structured query", dataOut: "Ranked knowledge articles with relevance scores" },
    { label: "Contextual Answer Generation", description: "Gemini synthesizes an answer from retrieved knowledge, incorporating recent changes (e.g., 'use GlobalProtect instead of Cisco AnyConnect since March 2024'). Adapts language to user's technical level.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Retrieved articles + user context", dataOut: "Contextual answer with step-by-step guidance" },
    { label: "Resolution Tracking & Gap Detection", description: "Track self-service resolution rates. Identify knowledge gaps where users consistently escalate despite KB articles existing. Auto-suggest new articles for common unresolved queries.", systems: ["BigQuery", "ServiceNow"], layer: "integration", dataIn: "Resolution outcomes + escalation patterns", dataOut: "Knowledge gap report + suggested articles" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Service Desk Manager agent for the Knowledge Base Auto-Resolver workflow",
  primaryObjective: "Gemini provides contextual answers that incorporate recent changes — 'use GlobalProtect instead of AnyConnect since March.' LLM adapts technical language to the user's role and expertise level. so the IT Service Desk Manager can move the Self-service resolution rate KPI.",
  inScope: [
    "Gemini provides contextual answers that incorporate recent changes — 'use GlobalProtect instead of AnyConnect since March.'",
    "LLM adapts technical language to the user's role and expertise level",
    "Knowledge gap detection auto-identifies topics needing new or updated articles",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Knowledge Base Auto-Resolver workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_confluence_pages",
      kind: "query",
      sourceSystemId: "confluence",
      description: "Retrieve pages from Confluence for the Knowledge Base Auto-Resolver workflow.",
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
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Knowledge Base Auto-Resolver workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_knowledge_base_auto_resolver_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Knowledge Base Auto-Resolver Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_update",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the update step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Self-service resolution rate moved from 15% of tickets toward 55% of tickets",
      mustCite: [
        "servicenow.tickets",
        "confluence.pages",
      ],
      sourceSystemIds: [
        "servicenow",
        "confluence",
      ],
    },
    {
      claim: "KB article relevance moved from Keyword match only toward Semantic + recency",
      mustCite: [
        "servicenow.tickets",
        "confluence.pages",
      ],
      sourceSystemIds: [
        "servicenow",
        "confluence",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Self-service resolution rate regresses past the 15% of tickets baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "IT Service Desk Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed update action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ServiceNow (and other named systems) entities.",
    "Never bypass IT Service Desk Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "knowledge-base-auto-resolver-end-to-end",
      prompt: "Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_tickets",
        "query_confluence_pages",
        "query_google_workspace_accounts",
        "lookup_knowledge_base_auto_resolver_runbook",
        "action_servicenow_update",
      ],
      mustReferenceEntities: [
        "tickets",
        "pages",
        "accounts",
      ],
      mustCiteDocuments: [
        "knowledge-base-auto-resolver-runbook",
      ],
      expectedActionOutcome: "Action update executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute update without two-system evidence",
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
    rationale: "Row counts sized for Knowledge Base Auto-Resolver so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "servicenow",
      name: "ServiceNow",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_tickets",
        "query_servicenow_change_requests",
        "query_servicenow_incidents",
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
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "tickets",
      sourceSystemId: "servicenow",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "change_requests",
      sourceSystemId: "servicenow",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "incidents",
      sourceSystemId: "servicenow",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
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
      name: "accounts",
      sourceSystemId: "google_workspace",
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
          name: "account_name",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          min: 5000,
          max: 1000000,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "prospecting",
            "qualification",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "close_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
  relationships: [],
  documents: [
    {
      id: "knowledge-base-auto-resolver-runbook",
      sourceSystemId: "servicenow",
      type: "runbook",
      title: "Knowledge Base Auto-Resolver Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "servicenow_update_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/update",
      description: "Synchronous endpoint the agent calls to update in ServiceNow after evidence gating.",
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
      id: "knowledge-base-auto-resolver-baseline-gap",
      description: "Seed a realistic gap where Self-service resolution rate sits between 15% of tickets and 55% of tickets, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow records for the affected entities",
        "Compare against Confluence historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next IT Service Desk Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "knowledge_base_auto_resolver",
      schemas: [
        "servicenow",
        "confluence",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "it_knowledge_base_auto_resolver",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "knowledge-base-auto-resolver-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "knowledge-base-auto-resolver-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Knowledge Base Auto-Resolver workflow and cite source-system evidence for every claim.",
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

export const KnowledgeBaseAutoResolver = () => (
  <UseCaseSlide
    title="Knowledge Base Auto-Resolver"
    subtitle="IT5-02 • IT Service Management"
    icon={BookOpen}
    domainId="domain-42"
    layer="Layer 1: OOTB"
    persona="IT Service Desk Manager"
    systems={["ServiceNow", "Confluence", "Google Workspace", "Vertex AI"]}
    kpis={[
      { label: "Self-service resolution rate", before: "15% of tickets", after: "55% of tickets" },
      { label: "KB article relevance", before: "Keyword match only", after: "Semantic + recency" },
      { label: "First contact resolution", before: "40%", after: "72%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "User", action: "Confirm resolution", description: "User confirms whether the self-service answer resolved their issue. Unresolved queries escalated to human agent with context preserved." }}
    statusQuo={[
      "Users search KB articles by keyword, often finding outdated or irrelevant results.",
      "Knowledge base doesn't account for recent infrastructure changes or tool migrations.",
      "Self-service resolution rate remains low at 15%, driving unnecessary ticket volume.",
    ]}
    agentification={[
      "Gemini provides contextual answers that incorporate recent changes — 'use GlobalProtect instead of AnyConnect since March.'",
      "LLM adapts technical language to the user's role and expertise level.",
      "Knowledge gap detection auto-identifies topics needing new or updated articles.",
    ]}
  />
);
