import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Inbox, PenTool, CheckCircle, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Announcement Brief", lane: "system", type: "trigger" },
    { id: "a1", label: "Context Research", lane: "agent", type: "action" },
    { id: "a2", label: "Draft Generation", lane: "agent", type: "action" },
    { id: "h1", label: "Brand Mgr Approves", lane: "human", type: "hitl" },
    { id: "a3", label: "Distribution", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Brief Intake", icon: Inbox, description: "Announcement brief received with key messages, quotes, and timing requirements.", trigger: "Event", systems: ["Google Docs"] },
  { label: "Context Gathering", icon: FileText, description: "Historical press releases, company facts, and journalist interest data aggregated.", systems: ["Cision", "BigQuery"], integration: "ADK" },
  { label: "Draft Creation", icon: PenTool, description: "AP-style press release drafted with media Q&A document and spokesperson talking points.", systems: ["Vertex AI"] },
  { label: "Approval & Distribute", icon: Send, description: "Brand Manager reviews, approves, and release distributed via newswire.", output: "Published Press Release" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Docs", description: "Announcement briefs, draft press releases, Q&A documents", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "PR Newswire", description: "Press release distribution, pickup tracking", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "Cision", description: "Media contact database, journalist beat tracking, historical coverage", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Press release drafting, Q&A generation, tone adaptation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "WordPress", description: "Newsroom publication of approved releases", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "Slack", description: "Approval workflow notifications and stakeholder alerts", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Brief Analysis", description: "Parse announcement brief to extract key messages, quotes, data points, and timing. Pull historical press releases for style reference and company boilerplate.", systems: ["Google Docs", "BigQuery"], layer: "integration", dataIn: "Announcement brief + historical releases", dataOut: "Structured brief with style reference" },
    { label: "Performance Prediction", description: "Predict journalist interest and pickup likelihood based on announcement type, timing, and historical press release performance data.", systems: ["Cision", "BigQuery ML"], layer: "ml", dataIn: "Brief metadata + journalist beat data", dataOut: "Pickup likelihood + target journalist list" },
    { label: "Draft Generation", description: "Gemini drafts AP-style press release adapted for announcement type — product launch vs. partnership vs. financial results. Generates media Q&A anticipating journalist follow-ups based on Cision beat analysis.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Structured brief + style reference + journalist angles", dataOut: "Press release draft + Q&A document" },
    { label: "Approval & Distribution", description: "Route for Brand Manager approval via Slack. On approval, distribute via PR Newswire and publish to company newsroom. Track pickup and media coverage.", systems: ["Slack", "PR Newswire", "WordPress"], layer: "integration", dataIn: "Approved press release", dataOut: "Distributed release + coverage tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the Press Release & Comms Drafter workflow",
  primaryObjective: "Gemini drafts AP-style press releases adapted for announcement type with consistent formatting. LLM anticipates journalist questions based on beat analysis and generates proactive Q&A documents. so the Brand Manager can move the Draft creation time KPI.",
  inScope: [
    "Gemini drafts AP-style press releases adapted for announcement type with consistent formatting",
    "LLM anticipates journalist questions based on beat analysis and generates proactive Q&A documents",
    "Generates spokesperson talking points calibrated to announcement sensitivity level",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Press Release & Comms Drafter workflow.",
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
      name: "query_pr_newswire_pr_newswire_records",
      kind: "query",
      sourceSystemId: "pr_newswire",
      description: "Retrieve pr newswire records from PR Newswire for the Press Release & Comms Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pr_newswire_records_records",
        "pr_newswire_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_cision_cision_records",
      kind: "query",
      sourceSystemId: "cision",
      description: "Retrieve cision records from Cision for the Press Release & Comms Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cision_records_records",
        "cision_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_wordpress_content_entries",
      kind: "query",
      sourceSystemId: "wordpress",
      description: "Retrieve content entries from WordPress for the Press Release & Comms Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "content_entries_records",
        "content_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_press_release_comms_drafter_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Press Release & Comms Drafter Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_docs_generate",
      kind: "action",
      sourceSystemId: "google_docs",
      description: "Execute the generate step in Google Docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Draft creation time moved from 2-3 days toward 30 minutes",
      mustCite: [
        "google_docs.documents",
        "pr_newswire.pr_newswire_records",
      ],
      sourceSystemIds: [
        "google_docs",
        "pr_newswire",
      ],
    },
    {
      claim: "Revision cycles moved from 4-5 rounds toward 1-2 rounds",
      mustCite: [
        "google_docs.documents",
        "pr_newswire.pr_newswire_records",
      ],
      sourceSystemIds: [
        "google_docs",
        "pr_newswire",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Draft creation time regresses past the 2-3 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Brand Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Docs (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "press-release-comms-drafter-end-to-end",
      prompt: "Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_pr_newswire_pr_newswire_records",
        "query_cision_cision_records",
        "query_wordpress_content_entries",
        "lookup_press_release_comms_drafter_playbook",
        "action_google_docs_generate",
      ],
      mustReferenceEntities: [
        "documents",
        "pr_newswire_records",
        "cision_records",
        "content_entries",
      ],
      mustCiteDocuments: [
        "press-release-comms-drafter-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Google Docs, with audit-trail entry and Brand Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for Press Release & Comms Drafter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "pr_newswire",
      name: "PR Newswire",
      owns: [
        "pr_newswire_records",
        "pr_newswire_events",
        "pr_newswire_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_pr_newswire_pr_newswire_records",
        "query_pr_newswire_pr_newswire_events",
        "query_pr_newswire_pr_newswire_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "cision",
      name: "Cision",
      owns: [
        "cision_records",
        "cision_events",
        "cision_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_cision_cision_records",
        "query_cision_cision_events",
        "query_cision_cision_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "wordpress",
      name: "WordPress",
      owns: [
        "content_entries",
        "publishing_workflows",
        "media_assets",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_wordpress_content_entries",
        "query_wordpress_publishing_workflows",
        "query_wordpress_media_assets",
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
      name: "pr_newswire_records",
      sourceSystemId: "pr_newswire",
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
      name: "pr_newswire_events",
      sourceSystemId: "pr_newswire",
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
          name: "pr_newswire_record_id",
          type: "ref",
          ref: "pr_newswire_records.id",
          required: true,
        },
      ],
    },
    {
      name: "pr_newswire_audit_trail",
      sourceSystemId: "pr_newswire",
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
      name: "cision_records",
      sourceSystemId: "cision",
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
      name: "cision_events",
      sourceSystemId: "cision",
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
          name: "cision_record_id",
          type: "ref",
          ref: "cision_records.id",
          required: true,
        },
      ],
    },
    {
      name: "cision_audit_trail",
      sourceSystemId: "cision",
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
      name: "content_entries",
      sourceSystemId: "wordpress",
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
      name: "publishing_workflows",
      sourceSystemId: "wordpress",
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
      name: "media_assets",
      sourceSystemId: "wordpress",
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
      from: "pr_newswire_events.pr_newswire_record_id",
      to: "pr_newswire_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "cision_events.cision_record_id",
      to: "cision_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "press-release-comms-drafter-playbook",
      sourceSystemId: "google_docs",
      type: "playbook",
      title: "Press Release & Comms Drafter Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "documents",
        "comments",
        "revision_history",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "audience",
        "brand-voice",
        "channels",
        "approvals",
      ],
    },
  ],
  apis: [
    {
      id: "google_docs_generate_api",
      sourceSystemId: "google_docs",
      method: "POST",
      path: "/api/google_docs/generate",
      description: "Synchronous endpoint the agent calls to generate in Google Docs after evidence gating.",
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
      id: "press-release-comms-drafter-baseline-gap",
      description: "Seed a realistic gap where Draft creation time sits between 2-3 days and 30 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against PR Newswire historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Brand Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "press_release_comms_drafter",
      schemas: [
        "google_docs",
        "pr_newswire",
        "cision",
        "wordpress",
      ],
    },
    bigquery: {
      dataset: "marketing_press_release_comms_drafter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "press-release-comms-drafter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "press-release-comms-drafter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Press Release & Comms Drafter workflow and cite source-system evidence for every claim.",
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

export const PressReleaseDrafter = () => (
  <UseCaseSlide
    title="Press Release & Comms Drafter"
    subtitle="A-3502 • Brand & Communications"
    icon={FileText}
    domainId="domain-35"
    layer="Layer 1: OOTB"
    persona="Brand Manager"
    systems={["Google Docs", "PR Newswire", "Cision", "Vertex AI", "WordPress"]}
    kpis={[
      { label: "Draft creation time", before: "2-3 days", after: "30 minutes" },
      { label: "Revision cycles", before: "4-5 rounds", after: "1-2 rounds" },
      { label: "Q&A preparation", before: "Ad-hoc scramble", after: "Auto-generated with draft" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Brand Manager", action: "Approve press release", description: "Brand Manager reviews draft for accuracy, messaging alignment, and quote approval before distribution." }}
    statusQuo={[
      "Press releases drafted manually with multiple rounds of stakeholder revision taking 2-3 days.",
      "Media Q&A documents created reactively after journalist inquiries arrive.",
      "No consistent AP style compliance — each writer has different formatting habits."
    ]}
    agentification={[
      "Gemini drafts AP-style press releases adapted for announcement type with consistent formatting.",
      "LLM anticipates journalist questions based on beat analysis and generates proactive Q&A documents.",
      "Generates spokesperson talking points calibrated to announcement sensitivity level."
    ]}
  />
);
