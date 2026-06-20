import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Workflow, FileText, Mail, Settings, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Brief Approved", lane: "system", type: "trigger" },
    { id: "a1", label: "Campaign Setup", lane: "agent", type: "action" },
    { id: "a2", label: "Sequence Drafting", lane: "agent", type: "action" },
    { id: "a3", label: "Multi-Channel Launch", lane: "agent", type: "output" },
    { id: "h1", label: "Demand Gen Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Brief Parsing", icon: FileText, description: "Campaign brief interpreted for audience, messaging, channel mix, and journey design.", trigger: "Brief approved", systems: ["HubSpot", "Salesforce CRM"] },
  { label: "Sequence Generation", icon: Mail, description: "Personalized email sequences drafted with contextually different follow-ups based on engagement signals.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Campaign Configuration", icon: Settings, description: "Campaign created in MAP with lead scoring rules, UTM tracking, and multi-channel coordination.", systems: ["HubSpot", "Marketo"] },
  { label: "Demand Gen Approval", icon: CheckCircle, description: "Demand Gen Manager validates campaign setup, sequences, and scoring rules before launch.", output: "Active Campaign" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "Campaign creation, email sequences, lead scoring, engagement tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Marketo", description: "Enterprise MAP campaign orchestration, nurture programs", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Salesforce Marketing Cloud", description: "Enterprise campaign management, journey builder", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Salesforce CRM", description: "Campaign record creation, lead routing, pipeline tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Brief interpretation, sequence drafting, personalization logic", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Brief Interpretation", description: "Interpret campaign brief to understand target audience, messaging goals, channel mix, and desired journey. Map to optimal multi-touch sequence structure.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Campaign brief + audience definition + goals", dataOut: "Structured campaign plan with journey map" },
    { label: "Historical Performance", description: "Predict campaign performance based on historical data. Determine optimal sequence length and channel mix based on segment response patterns.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical campaign performance by segment", dataOut: "Performance predictions + optimal sequence design" },
    { label: "Sequence & Copy Generation", description: "Draft personalized email sequences with contextually different follow-ups based on engagement signals. Not just branching logic but content that evolves based on what the lead consumed and what it signals about buying intent.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Campaign plan + segment profiles + content library", dataOut: "Email sequences with dynamic content blocks" },
    { label: "Campaign Setup", description: "Create campaign in MAP with email sequences, lead scoring rules, UTM tracking, and Salesforce campaign. Coordinate multi-channel launch timing.", systems: ["HubSpot", "Marketo", "Salesforce CRM"], layer: "integration", dataIn: "Campaign configuration + sequences", dataOut: "Active campaign with tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Demand Gen Manager agent for the Campaign Builder & Orchestrator workflow",
  primaryObjective: "Gemini interprets campaign briefs and reasons about the optimal multi-touch journey for each audience segment. Drafts personalized email sequences with contextually different follow-ups based on engagement signals and buying intent. so the Demand Gen Manager can move the Campaign setup time KPI.",
  inScope: [
    "Gemini interprets campaign briefs and reasons about the optimal multi-touch journey for each audience segment",
    "Drafts personalized email sequences with contextually different follow-ups based on engagement signals and buying intent",
    "Automates end-to-end campaign setup from brief to active campaign with proper tracking and scoring configuration",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Campaign Builder & Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contacts_records",
        "contacts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_marketo_campaigns",
      kind: "query",
      sourceSystemId: "marketo",
      description: "Retrieve campaigns from Marketo for the Campaign Builder & Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "campaigns_records",
        "campaigns_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Campaign Builder & Orchestrator workflow.",
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
      name: "lookup_campaign_builder_orchestrator_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "hubspot",
      description: "Look up sections of the Campaign Builder & Orchestrator Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hubspot_draft",
      kind: "action",
      sourceSystemId: "hubspot",
      description: "Execute the draft step in HubSpot after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Campaign setup time moved from 3-5 days toward 4 hours",
      mustCite: [
        "hubspot.contacts",
        "marketo.campaigns",
      ],
      sourceSystemIds: [
        "hubspot",
        "marketo",
      ],
    },
    {
      claim: "Email sequence quality moved from Template-based toward Contextually personalized",
      mustCite: [
        "hubspot.contacts",
        "marketo.campaigns",
      ],
      sourceSystemIds: [
        "hubspot",
        "marketo",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Campaign setup time regresses past the 3-5 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Demand Gen Manager",
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
    "Never fabricate metric values; only publish numbers derived from HubSpot (and other named systems) entities.",
    "Never bypass Demand Gen Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "campaign-builder-orchestrator-end-to-end",
      prompt: "Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hubspot_contacts",
        "query_marketo_campaigns",
        "query_salesforce_crm_accounts",
        "lookup_campaign_builder_orchestrator_playbook",
        "action_hubspot_draft",
      ],
      mustReferenceEntities: [
        "contacts",
        "campaigns",
        "accounts",
      ],
      mustCiteDocuments: [
        "campaign-builder-orchestrator-playbook",
      ],
      expectedActionOutcome: "Action draft executed against HubSpot, with audit-trail entry and Demand Gen Manager notified of outcomes.",
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
    rationale: "Row counts sized for Campaign Builder & Orchestrator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "hubspot",
      name: "HubSpot",
      owns: [
        "contacts",
        "deals",
        "engagement_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_hubspot_contacts",
        "query_hubspot_deals",
        "query_hubspot_engagement_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "marketo",
      name: "Marketo",
      owns: [
        "campaigns",
        "leads",
        "engagement_scores",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_marketo_campaigns",
        "query_marketo_leads",
        "query_marketo_engagement_scores",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "contacts",
      sourceSystemId: "hubspot",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "deals",
      sourceSystemId: "hubspot",
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
      name: "engagement_events",
      sourceSystemId: "hubspot",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "contact_id",
          type: "ref",
          ref: "contacts.id",
          required: true,
        },
      ],
    },
    {
      name: "campaigns",
      sourceSystemId: "marketo",
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
      name: "leads",
      sourceSystemId: "marketo",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "engagement_scores",
      sourceSystemId: "marketo",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
      ],
    },
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
  ],
  relationships: [
    {
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "campaign-builder-orchestrator-playbook",
      sourceSystemId: "hubspot",
      type: "playbook",
      title: "Campaign Builder & Orchestrator Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "contacts",
        "deals",
        "engagement_events",
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
      id: "hubspot_draft_api",
      sourceSystemId: "hubspot",
      method: "POST",
      path: "/api/hubspot/draft",
      description: "Synchronous endpoint the agent calls to draft in HubSpot after evidence gating.",
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
      id: "campaign-builder-orchestrator-baseline-gap",
      description: "Seed a realistic gap where Campaign setup time sits between 3-5 days and 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contacts",
        "deals",
      ],
      discoveryPath: [
        "Inspect HubSpot records for the affected entities",
        "Compare against Marketo historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Demand Gen Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "campaign_builder_orchestrator",
      schemas: [
        "hubspot",
        "marketo",
        "salesforce_crm",
      ],
    },
    bigquery: {
      dataset: "marketing_campaign_builder_orchestrator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "campaign-builder-orchestrator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "campaign-builder-orchestrator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Campaign Builder & Orchestrator workflow and cite source-system evidence for every claim.",
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

export const CampaignBuilderOrchestrator = () => (
  <UseCaseSlide
    title="Campaign Builder & Orchestrator"
    subtitle="A-3101 \u2022 Demand Generation"
    icon={Workflow}
    domainId="domain-31"
    layer="Layer 3: Custom ADK"
    persona="Demand Gen Manager"
    systems={["HubSpot", "Marketo", "Salesforce CRM", "Vertex AI"]}
    kpis={[
      { label: "Campaign setup time", before: "3-5 days", after: "4 hours" },
      { label: "Email sequence quality", before: "Template-based", after: "Contextually personalized" },
      { label: "Multi-channel coordination", before: "Manual", after: "Automated orchestration" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Demand Gen Manager", action: "Approve campaign setup", description: "Demand Gen Manager validates campaign configuration, email sequences, lead scoring rules, and UTM tracking before launch." }}
    statusQuo={[
      "Campaign setup takes 3-5 days of manual MAP configuration, email drafting, and scoring rule updates.",
      "Email sequences follow rigid templates with simple if/then branching rather than contextual personalization.",
      "Multi-channel coordination managed through spreadsheets and team meetings with frequent timing misalignment."
    ]}
    agentification={[
      "Gemini interprets campaign briefs and reasons about the optimal multi-touch journey for each audience segment.",
      "Drafts personalized email sequences with contextually different follow-ups based on engagement signals and buying intent.",
      "Automates end-to-end campaign setup from brief to active campaign with proper tracking and scoring configuration."
    ]}
  />
);
