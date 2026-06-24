import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Lightbulb, TrendingUp, PenTool, CheckCircle, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Cadence", lane: "system", type: "trigger" },
    { id: "a1", label: "Trend Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Content Draft", lane: "agent", type: "action" },
    { id: "h1", label: "Brand Mgr Reviews", lane: "human", type: "hitl" },
    { id: "a3", label: "Publish & Track", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Trend Identification", icon: TrendingUp, description: "Industry trends, news, and conversation topics scanned for thought leadership opportunities.", trigger: "Weekly", systems: ["LinkedIn", "Google News API"] },
  { label: "Voice-Matched Draft", icon: PenTool, description: "Content drafted matching each executive's authentic voice, style, and perspective.", systems: ["Vertex AI", "Google Docs"], integration: "ADK" },
  { label: "Review & Polish", icon: CheckCircle, description: "Brand Manager reviews for voice authenticity and brand alignment.", systems: ["Google Docs"] },
  { label: "Publish & Monitor", icon: Send, description: "Approved content published to LinkedIn and engagement tracked.", output: "Published Thought Leadership" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "LinkedIn", description: "Executive profile data, historical posts, engagement metrics, trending topics", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google News API", description: "Industry news, trending topics, competitor executive commentary", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Docs", description: "Content drafts, executive voice profiles, brand guidelines", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Voice-matched content generation, topic angle development", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "WordPress", description: "Company blog publication for long-form executive content", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "Engagement analytics, topic performance tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Topic Discovery", description: "Scan industry news, LinkedIn trending topics, and competitor executive commentary to identify thought leadership opportunities aligned with executive expertise areas.", systems: ["Google News API", "LinkedIn"], layer: "integration", dataIn: "Industry signals + executive expertise profiles", dataOut: "Ranked topic opportunities with angles" },
    { label: "Engagement Prediction", description: "Score topic-angle combinations based on historical executive post performance, audience interest signals, and optimal posting windows.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Topic options + historical engagement data", dataOut: "Predicted engagement by topic-angle pair" },
    { label: "Voice-Matched Drafting", description: "Gemini drafts thought leadership content in each executive's authentic voice — the CEO's posts read differently from the CTO's. Generates counterintuitive insights, not obvious commentary.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Selected topic + executive voice profile + engagement predictions", dataOut: "Voice-matched content draft" },
    { label: "Publication & Tracking", description: "After Brand Manager approval, publish to LinkedIn (and optionally WordPress for long-form). Track engagement, reshares, and pipeline attribution.", systems: ["LinkedIn", "WordPress", "BigQuery"], layer: "integration", dataIn: "Approved content", dataOut: "Published post + engagement tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the Executive Thought Leadership Agent workflow",
  primaryObjective: "Gemini learns each executive's voice from historical posts and generates authentically-voiced content. LLM identifies trending industry topics and develops counterintuitive angles that demonstrate genuine insight. so the Brand Manager can move the Content creation time KPI.",
  inScope: [
    "Gemini learns each executive's voice from historical posts and generates authentically-voiced content",
    "LLM identifies trending industry topics and develops counterintuitive angles that demonstrate genuine insight",
    "Maintains consistent publishing cadence with optimized posting times based on audience engagement data",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_linkedin_linkedin_records",
      kind: "query",
      sourceSystemId: "linkedin",
      description: "Retrieve linkedin records from LinkedIn for the Executive Thought Leadership Agent workflow.",
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
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Executive Thought Leadership Agent workflow.",
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
      name: "query_wordpress_content_entries",
      kind: "query",
      sourceSystemId: "wordpress",
      description: "Retrieve content entries from WordPress for the Executive Thought Leadership Agent workflow.",
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
      name: "lookup_executive_thought_leadership_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Executive Thought Leadership Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_linkedin_publish",
      kind: "action",
      sourceSystemId: "linkedin",
      description: "Execute the publish step in LinkedIn after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Content creation time moved from 3-4 hours per post toward 20 minutes",
      mustCite: [
        "linkedin.linkedin_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "linkedin",
        "google_docs",
      ],
    },
    {
      claim: "Publishing consistency moved from 1-2 posts/month toward 2-3 posts/week",
      mustCite: [
        "linkedin.linkedin_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "linkedin",
        "google_docs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Content creation time regresses past the 3-4 hours per post baseline by more than 20%",
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
      trigger: "Proposed publish action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from LinkedIn (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "executive-thought-leadership-agent-end-to-end",
      prompt: "Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_linkedin_linkedin_records",
        "query_google_docs_documents",
        "query_wordpress_content_entries",
        "lookup_executive_thought_leadership_agent_playbook",
        "action_linkedin_publish",
      ],
      mustReferenceEntities: [
        "linkedin_records",
        "documents",
        "content_entries",
      ],
      mustCiteDocuments: [
        "executive-thought-leadership-agent-playbook",
      ],
      expectedActionOutcome: "Action publish executed against LinkedIn, with audit-trail entry and Brand Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute publish without two-system evidence",
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
    rationale: "Row counts sized for Executive Thought Leadership Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      from: "linkedin_events.linkedin_record_id",
      to: "linkedin_records.id",
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
      id: "executive-thought-leadership-agent-playbook",
      sourceSystemId: "linkedin",
      type: "playbook",
      title: "Executive Thought Leadership Agent Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "linkedin_records",
        "linkedin_events",
        "linkedin_audit_trail",
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
      id: "linkedin_publish_api",
      sourceSystemId: "linkedin",
      method: "POST",
      path: "/api/linkedin/publish",
      description: "Synchronous endpoint the agent calls to publish in LinkedIn after evidence gating.",
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
      id: "executive-thought-leadership-agent-baseline-gap",
      description: "Seed a realistic gap where Content creation time sits between 3-4 hours per post and 20 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "linkedin_records",
        "linkedin_events",
      ],
      discoveryPath: [
        "Inspect LinkedIn records for the affected entities",
        "Compare against Google Docs historical baseline",
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
      database: "executive_thought_leadership_agent",
      schemas: [
        "linkedin",
        "google_docs",
        "wordpress",
      ],
    },
    bigquery: {
      dataset: "marketing_executive_thought_leadership_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "executive-thought-leadership-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "executive-thought-leadership-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Executive Thought Leadership Agent workflow and cite source-system evidence for every claim.",
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

export const ExecThoughtLeadership = () => (
  <UseCaseSlide
    title="Executive Thought Leadership Agent"
    subtitle="A-3504 • Brand & Communications"
    icon={Lightbulb}
    domainId="domain-35"
    layer="Layer 1: OOTB"
    persona="Brand Manager"
    systems={["LinkedIn", "Google Docs", "WordPress", "Vertex AI"]}
    kpis={[
      { label: "Content creation time", before: "3-4 hours per post", after: "20 minutes" },
      { label: "Publishing consistency", before: "1-2 posts/month", after: "2-3 posts/week" },
      { label: "Engagement rate", before: "Baseline organic", after: "2-3x with voice matching" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Brand Manager", action: "Review executive content", description: "Brand Manager validates voice authenticity, brand alignment, and messaging appropriateness before publication." }}
    statusQuo={[
      "Executives want to post thought leadership but lack time to write consistently.",
      "Ghostwritten content sounds generic and doesn't match the executive's authentic voice.",
      "No systematic approach to topic selection — posts are reactive rather than strategic."
    ]}
    agentification={[
      "Gemini learns each executive's voice from historical posts and generates authentically-voiced content.",
      "LLM identifies trending industry topics and develops counterintuitive angles that demonstrate genuine insight.",
      "Maintains consistent publishing cadence with optimized posting times based on audience engagement data."
    ]}
  />
);
