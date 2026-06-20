import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Briefcase, Zap, Search, FileText, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Deal Stage Change", lane: "system", type: "trigger" },
    { id: "a1", label: "Context Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Content Match", lane: "agent", type: "action" },
    { id: "a3", label: "Content Card", lane: "agent", type: "output" },
    { id: "h1", label: "Rep Uses Content", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Stage Trigger", icon: Zap, description: "Deal stage progression or rep request triggers content recommendation.", trigger: "Event", systems: ["Salesforce CRM"] },
  { label: "Deal Context", icon: Search, description: "Deal attributes — industry, size, stakeholders, competitor — analyzed for content relevance.", systems: ["Salesforce CRM", "BigQuery"], integration: "ADK" },
  { label: "Smart Recommendation", icon: FileText, description: "Most effective content recommended based on deal context and historical win influence.", systems: ["Highspot", "Vertex AI"] },
  { label: "Rep Delivery", icon: Send, description: "Content card pushed to rep with personalization suggestions for the specific deal.", output: "Content Recommendation" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Deal stage, account profile, stakeholder roles, competitive context", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Highspot", description: "Content library, asset metadata, usage analytics, effectiveness scores", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google Workspace", description: "Content assets, presentations, case studies, whitepapers", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Contextual content matching, personalization guidance, angle recommendation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Content effectiveness by deal type, usage-to-outcome correlation", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Content card delivery, rep notifications, feedback collection", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Deal Context Assembly", description: "Monitor deal stage progression in CRM. Pull deal attributes including industry, company size, stakeholder roles (CTO vs. CFO vs. user), competitive context, and engagement history.", systems: ["Salesforce CRM"], layer: "integration", dataIn: "Deal stage change event", dataOut: "Complete deal context profile" },
    { label: "Content Effectiveness Scoring", description: "Score content assets by effectiveness for similar deal profiles. Analyze content-to-deal correlation: which assets influence deal velocity and win rate for this deal type.", systems: ["Highspot", "BigQuery ML"], layer: "ml", dataIn: "Deal context + content usage data", dataOut: "Ranked content recommendations" },
    { label: "Contextual Matching", description: "Gemini recommends the right content for the right deal moment. An enterprise deal in technical evaluation with CTO involved gets the architecture whitepaper, not the generic product deck. Provides personalization angles based on stakeholder interests.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Ranked content + deal context + stakeholder profiles", dataOut: "Personalized content recommendation with angle" },
    { label: "Delivery & Tracking", description: "Push content card to sales rep via Slack and Salesforce. Track content usage and downstream deal outcome to continuously improve recommendation model.", systems: ["Slack", "Highspot", "Salesforce CRM"], layer: "integration", dataIn: "Content recommendation", dataOut: "Delivered card + usage tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Product Marketing Mgr agent for the Sales Enablement Content Agent workflow",
  primaryObjective: "Gemini recommends the right content at the right deal moment based on context, not just stage. LLM provides personalization angles — 'the CTO's LinkedIn shows API-first interests, lead with that angle.' so the Product Marketing Mgr can move the Content find time KPI.",
  inScope: [
    "Gemini recommends the right content at the right deal moment based on context, not just stage",
    "LLM provides personalization angles — 'the CTO's LinkedIn shows API-first interests, lead with that angle.'",
    "Tracks content-to-deal correlation to continuously improve recommendations",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Sales Enablement Content Agent workflow.",
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
      name: "query_highspot_highspot_records",
      kind: "query",
      sourceSystemId: "highspot",
      description: "Retrieve highspot records from Highspot for the Sales Enablement Content Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "highspot_records_records",
        "highspot_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Sales Enablement Content Agent workflow.",
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
      name: "lookup_sales_enablement_content_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "salesforce_crm",
      description: "Look up sections of the Sales Enablement Content Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_recommend",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the recommend step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Content find time moved from 15-20 min searching toward Proactively pushed",
      mustCite: [
        "salesforce_crm.accounts",
        "highspot.highspot_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "highspot",
      ],
    },
    {
      claim: "Content utilization moved from 35% of library used toward 78% relevant usage",
      mustCite: [
        "salesforce_crm.accounts",
        "highspot.highspot_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "highspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Content find time regresses past the 15-20 min searching baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Product Marketing Mgr",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Product Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sales-enablement-content-agent-end-to-end",
      prompt: "Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_highspot_highspot_records",
        "query_google_workspace_accounts",
        "lookup_sales_enablement_content_agent_playbook",
        "action_salesforce_crm_recommend",
      ],
      mustReferenceEntities: [
        "accounts",
        "highspot_records",
        "accounts",
      ],
      mustCiteDocuments: [
        "sales-enablement-content-agent-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Sales Enablement Content Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "salesforce_crm",
      name: "Salesforce CRM",
      owns: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_salesforce_crm_accounts",
        "query_salesforce_crm_opportunities",
        "query_salesforce_crm_campaign_influence",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "highspot",
      name: "Highspot",
      owns: [
        "highspot_records",
        "highspot_events",
        "highspot_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_highspot_highspot_records",
        "query_highspot_highspot_events",
        "query_highspot_highspot_audit_trail",
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
      name: "accounts",
      sourceSystemId: "salesforce_crm",
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
      name: "opportunities",
      sourceSystemId: "salesforce_crm",
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
      name: "campaign_influence",
      sourceSystemId: "salesforce_crm",
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
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "channel",
          type: "enum",
          values: [
            "email",
            "social",
            "search",
            "display",
            "content",
            "events",
          ],
          required: true,
        },
        {
          name: "segment",
          type: "enum",
          values: [
            "enterprise",
            "mid_market",
            "smb",
          ],
          required: true,
        },
        {
          name: "impressions",
          type: "number",
          min: 1000,
          max: 500000,
          required: true,
        },
        {
          name: "conversions",
          type: "number",
          min: 0,
          max: 5000,
          required: true,
        },
        {
          name: "spend",
          type: "number",
          min: 1000,
          max: 200000,
          required: true,
        },
        {
          name: "ctr",
          type: "float",
          min: 0.1,
          max: 9.5,
          decimals: 2,
          required: true,
        },
        {
          name: "launched_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "highspot_records",
      sourceSystemId: "highspot",
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
      name: "highspot_events",
      sourceSystemId: "highspot",
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
          name: "highspot_record_id",
          type: "ref",
          ref: "highspot_records.id",
          required: true,
        },
      ],
    },
    {
      name: "highspot_audit_trail",
      sourceSystemId: "highspot",
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
  relationships: [
    {
      from: "highspot_events.highspot_record_id",
      to: "highspot_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sales-enablement-content-agent-playbook",
      sourceSystemId: "salesforce_crm",
      type: "playbook",
      title: "Sales Enablement Content Agent Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "accounts",
        "opportunities",
        "campaign_influence",
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
      id: "salesforce_crm_recommend_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Salesforce CRM after evidence gating.",
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
      id: "sales-enablement-content-agent-baseline-gap",
      description: "Seed a realistic gap where Content find time sits between 15-20 min searching and Proactively pushed, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against Highspot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Product Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sales_enablement_content_agent",
      schemas: [
        "salesforce_crm",
        "highspot",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "marketing_sales_enablement_content_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sales-enablement-content-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sales-enablement-content-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sales Enablement Content Agent workflow and cite source-system evidence for every claim.",
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

export const SalesEnablementContentAgent = () => (
  <UseCaseSlide
    title="Sales Enablement Content Agent"
    subtitle="A-3706 • Customer & Market Intelligence"
    icon={Briefcase}
    domainId="domain-37"
    layer="Layer 1: OOTB"
    persona="Product Marketing Mgr"
    systems={["Salesforce CRM", "Highspot", "Google Workspace", "Vertex AI"]}
    kpis={[
      { label: "Content find time", before: "15-20 min searching", after: "Proactively pushed" },
      { label: "Content utilization", before: "35% of library used", after: "78% relevant usage" },
      { label: "Win influence", before: "Untracked", after: "Content-attributed wins tracked" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Sales reps spend 15-20 minutes searching for content — or give up and use outdated decks.",
      "65% of marketing content never used by sales because reps can't find what's relevant.",
      "No tracking of which content actually influences deal outcomes."
    ]}
    agentification={[
      "Gemini recommends the right content at the right deal moment based on context, not just stage.",
      "LLM provides personalization angles — 'the CTO's LinkedIn shows API-first interests, lead with that angle.'",
      "Tracks content-to-deal correlation to continuously improve recommendations."
    ]}
  />
);
