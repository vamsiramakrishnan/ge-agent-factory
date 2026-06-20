import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Workflow, MessageCircle, Settings, TestTube, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Chat Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Parse Requirements", lane: "agent", type: "action" },
    { id: "a2", label: "Build Workflow", lane: "agent", type: "action" },
    { id: "h1", label: "Ops Lead Approves", lane: "human", type: "hitl" },
    { id: "a3", label: "Deploy & Monitor", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const flow: FlowStep[] = [
  { label: "NL Request", icon: MessageCircle, description: "Marketing team describes workflow need in natural language.", trigger: "Chat", systems: ["Slack"] },
  { label: "Logic Design", icon: Settings, description: "Requirements parsed into workflow logic with branching, timing, and exclusions.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Test & Validate", icon: TestTube, description: "Workflow configured in MAP, tested with sample data, and validated.", systems: ["HubSpot"] },
  { label: "Deploy", icon: CheckCircle, description: "Marketing Ops Lead approves and workflow deployed to production.", output: "Active Workflow" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "Workflow configuration, automation rules, email sequences, list criteria", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Marketo", description: "Smart campaign configuration, program setup, engagement programs", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Natural language to workflow translation, logic validation, edge case detection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Salesforce Marketing Cloud", description: "Journey builder configuration, decision splits, data extensions", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Workflow performance benchmarks, A/B test results, conversion data", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Workflow requests, approval notifications, deployment confirmations", direction: "bidirectional", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Requirement Parsing", description: "Interpret natural language workflow description and extract triggers, conditions, actions, exclusions, and timing requirements. Identify ambiguities and ask clarifying questions.", systems: ["Vertex AI (Gemini)", "Slack"], layer: "llm", dataIn: "Natural language workflow request", dataOut: "Structured workflow specification" },
    { label: "Logic Optimization", description: "Compare against historical workflow performance benchmarks. Recommend timing adjustments, branching improvements, and suppression rules based on best practices.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Workflow spec + performance benchmarks", dataOut: "Optimized workflow logic" },
    { label: "MAP Configuration", description: "Translate optimized workflow logic into MAP-specific configuration — HubSpot workflows, Marketo smart campaigns, or SFMC journeys. Set up correct branching, timing, and exclusion criteria.", systems: ["HubSpot", "Marketo"], layer: "integration", dataIn: "Optimized workflow logic", dataOut: "Configured workflow in MAP" },
    { label: "Testing & Deployment", description: "Run workflow with test contacts to validate logic paths. After Ops Lead approval, deploy to production with monitoring for the first 48 hours.", systems: ["HubSpot", "Slack"], layer: "integration", dataIn: "Configured workflow + test results", dataOut: "Live workflow with monitoring" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the Campaign Ops Workflow Builder workflow",
  primaryObjective: "Gemini translates natural language descriptions into MAP-specific configurations with correct branching and exclusions. LLM identifies edge cases and ambiguities upfront — asking clarifying questions before building. so the Marketing Ops Lead can move the Workflow build time KPI.",
  inScope: [
    "Gemini translates natural language descriptions into MAP-specific configurations with correct branching and exclusions",
    "LLM identifies edge cases and ambiguities upfront — asking clarifying questions before building",
    "Generates test scenarios to validate workflow logic before production deployment",
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
      description: "Retrieve contacts from HubSpot for the Campaign Ops Workflow Builder workflow.",
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
      description: "Retrieve campaigns from Marketo for the Campaign Ops Workflow Builder workflow.",
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
      name: "query_salesforce_marketing_cloud_accounts",
      kind: "query",
      sourceSystemId: "salesforce_marketing_cloud",
      description: "Retrieve accounts from Salesforce Marketing Cloud for the Campaign Ops Workflow Builder workflow.",
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
      name: "lookup_campaign_ops_workflow_builder_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "hubspot",
      description: "Look up sections of the Campaign Ops Workflow Builder Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hubspot_generate",
      kind: "action",
      sourceSystemId: "hubspot",
      description: "Execute the generate step in HubSpot after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Workflow build time moved from 4-8 hours toward 30 minutes",
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
      claim: "Ops backlog moved from 15-20 workflow requests toward < 3 pending",
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
      trigger: "Workflow build time regresses past the 4-8 hours baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Marketing Ops Lead",
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
    "Never fabricate metric values; only publish numbers derived from HubSpot (and other named systems) entities.",
    "Never bypass Marketing Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "campaign-ops-workflow-builder-end-to-end",
      prompt: "Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hubspot_contacts",
        "query_marketo_campaigns",
        "query_salesforce_marketing_cloud_accounts",
        "lookup_campaign_ops_workflow_builder_playbook",
        "action_hubspot_generate",
      ],
      mustReferenceEntities: [
        "contacts",
        "campaigns",
        "accounts",
      ],
      mustCiteDocuments: [
        "campaign-ops-workflow-builder-playbook",
      ],
      expectedActionOutcome: "Action generate executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
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
    rationale: "Row counts sized for Campaign Ops Workflow Builder so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "salesforce_marketing_cloud",
      name: "Salesforce Marketing Cloud",
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
        "query_salesforce_marketing_cloud_accounts",
        "query_salesforce_marketing_cloud_opportunities",
        "query_salesforce_marketing_cloud_campaign_influence",
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
      sourceSystemId: "salesforce_marketing_cloud",
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
      sourceSystemId: "salesforce_marketing_cloud",
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
      sourceSystemId: "salesforce_marketing_cloud",
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
      id: "campaign-ops-workflow-builder-playbook",
      sourceSystemId: "hubspot",
      type: "playbook",
      title: "Campaign Ops Workflow Builder Playbook",
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
      id: "hubspot_generate_api",
      sourceSystemId: "hubspot",
      method: "POST",
      path: "/api/hubspot/generate",
      description: "Synchronous endpoint the agent calls to generate in HubSpot after evidence gating.",
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
      id: "campaign-ops-workflow-builder-baseline-gap",
      description: "Seed a realistic gap where Workflow build time sits between 4-8 hours and 30 minutes, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Marketing Ops Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "campaign_ops_workflow_builder",
      schemas: [
        "hubspot",
        "marketo",
        "salesforce_marketing_cloud",
      ],
    },
    bigquery: {
      dataset: "marketing_campaign_ops_workflow_builder",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "campaign-ops-workflow-builder-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "campaign-ops-workflow-builder-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Campaign Ops Workflow Builder workflow and cite source-system evidence for every claim.",
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

export const CampaignOpsWorkflowBuilder = () => (
  <UseCaseSlide
    title="Campaign Ops Workflow Builder"
    subtitle="A-3603 • Marketing Operations"
    icon={Workflow}
    domainId="domain-36"
    layer="Layer 1: OOTB"
    persona="Marketing Ops Lead"
    systems={["HubSpot", "Marketo", "Salesforce Marketing Cloud", "Vertex AI"]}
    kpis={[
      { label: "Workflow build time", before: "4-8 hours", after: "30 minutes" },
      { label: "Ops backlog", before: "15-20 workflow requests", after: "< 3 pending" },
      { label: "Logic errors in production", before: "1 in 5 workflows", after: "< 1 in 20" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Marketing Ops Lead", action: "Approve workflow", description: "Marketing Ops Lead reviews workflow logic, validates branching and exclusion criteria, and approves for production deployment." }}
    statusQuo={[
      "Marketing teams submit workflow requests that sit in ops backlog for days.",
      "Natural language requests misinterpreted — 'nurture sequence for webinar no-shows' requires 4 rounds of clarification.",
      "Logic errors caught in production when leads receive wrong emails or are excluded incorrectly."
    ]}
    agentification={[
      "Gemini translates natural language descriptions into MAP-specific configurations with correct branching and exclusions.",
      "LLM identifies edge cases and ambiguities upfront — asking clarifying questions before building.",
      "Generates test scenarios to validate workflow logic before production deployment."
    ]}
  />
);
