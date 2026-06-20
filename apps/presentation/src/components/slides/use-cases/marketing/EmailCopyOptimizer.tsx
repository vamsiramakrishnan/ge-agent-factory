import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Mail, FileText, Layers, TrendingUp, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Email Created", lane: "system", type: "trigger" },
    { id: "a1", label: "Email Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Subject Line Variants", lane: "agent", type: "action" },
    { id: "a3", label: "A/B Test Configured", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Email Ingest", icon: FileText, description: "Email draft received from MAP with body content, audience segment, and campaign context.", trigger: "Email created", systems: ["HubSpot", "Marketo"] },
  { label: "Variant Generation", icon: Layers, description: "5 subject line variations generated testing different psychological triggers with segment adaptation.", systems: ["Vertex AI"], integration: "OOTB" },
  { label: "Open Rate Prediction", icon: TrendingUp, description: "Historical open rate prediction by segment and send time optimization applied to each variant.", systems: ["HubSpot", "BigQuery"] },
  { label: "A/B Launch", icon: Send, description: "A/B test configured automatically with winning variant promotion based on statistical significance.", output: "Optimized Email" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "Email drafts, send history, open/click rates, segment data", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Marketo", description: "Email campaign management, A/B test configuration, engagement data", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Salesforce Marketing Cloud", description: "Enterprise email platform, journey builder, deliverability metrics", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Subject line generation, copy optimization, tone adaptation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Email Analysis", description: "Receive email draft from MAP. Parse body content, audience segment, campaign context, and funnel stage to inform optimization.", systems: ["HubSpot", "Marketo"], layer: "integration", dataIn: "Email draft + audience definition + campaign context", dataOut: "Structured email analysis with optimization parameters" },
    { label: "Performance Prediction", description: "Historical open rate prediction by segment. Click-through rate optimization. Send time optimization based on past engagement patterns. Subject line scoring model.", systems: ["HubSpot", "BigQuery"], layer: "ml", dataIn: "Historical email performance by segment", dataOut: "Open rate predictions + optimal send times" },
    { label: "Variant Generation", description: "Analyze email body and generate 5 subject line variations testing different psychological triggers (curiosity, urgency, social proof, specificity). Adapt copy tone for different segments. Review body for clarity, CTA strength, and mobile readability.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Email content + segment profiles + performance models", dataOut: "Subject line variants + body optimization suggestions" },
    { label: "A/B Test Setup", description: "Configure A/B test in MAP with generated variants. Set statistical significance thresholds. Auto-promote winning variant after test period.", systems: ["HubSpot", "Marketo"], layer: "integration", dataIn: "Subject line variants + test configuration", dataOut: "Active A/B test with auto-promotion rules" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Digital Marketing Mgr agent for the Email Copy Optimizer workflow",
  primaryObjective: "Gemini generates 5 subject line variations testing different psychological triggers \\u2014 curiosity, urgency, social proof, specificity. Adapts copy tone for different segments (enterprise vs. SMB, new lead vs. customer) based on engagement history. so the Digital Marketing Mgr can move the Subject line variants tested KPI.",
  inScope: [
    "Gemini generates 5 subject line variations testing different psychological triggers \\u2014 curiosity, urgency, social proof, specificity",
    "Adapts copy tone for different segments (enterprise vs. SMB, new lead vs. customer) based on engagement history",
    "Reviews email body for clarity, CTA strength, and mobile readability with specific improvement suggestions",
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
      description: "Retrieve contacts from HubSpot for the Email Copy Optimizer workflow.",
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
      description: "Retrieve campaigns from Marketo for the Email Copy Optimizer workflow.",
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
      description: "Retrieve accounts from Salesforce Marketing Cloud for the Email Copy Optimizer workflow.",
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
      name: "lookup_email_copy_optimizer_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "hubspot",
      description: "Look up sections of the Email Copy Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Subject line variants tested moved from 2 toward 5 per send",
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
      claim: "Average open rate lift moved from Baseline toward +15-25%",
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
      trigger: "Subject line variants tested regresses past the 2 baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Digital Marketing Mgr",
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
    "Never bypass Digital Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "email-copy-optimizer-end-to-end",
      prompt: "Run the Email Copy Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hubspot_contacts",
        "query_marketo_campaigns",
        "query_salesforce_marketing_cloud_accounts",
        "lookup_email_copy_optimizer_playbook",
        "action_hubspot_generate",
      ],
      mustReferenceEntities: [
        "contacts",
        "campaigns",
        "accounts",
      ],
      mustCiteDocuments: [
        "email-copy-optimizer-playbook",
      ],
      expectedActionOutcome: "Action generate executed against HubSpot, with audit-trail entry and Digital Marketing Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Email Copy Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "email-copy-optimizer-playbook",
      sourceSystemId: "hubspot",
      type: "playbook",
      title: "Email Copy Optimizer Playbook",
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
      id: "email-copy-optimizer-baseline-gap",
      description: "Seed a realistic gap where Subject line variants tested sits between 2 and 5 per send, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Digital Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "email_copy_optimizer",
      schemas: [
        "hubspot",
        "marketo",
        "salesforce_marketing_cloud",
      ],
    },
    bigquery: {
      dataset: "marketing_email_copy_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "email-copy-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "email-copy-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Email Copy Optimizer workflow and cite source-system evidence for every claim.",
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

export const EmailCopyOptimizer = () => (
  <UseCaseSlide
    title="Email Copy Optimizer"
    subtitle="A-3005 \u2022 Content & Creative"
    icon={Mail}
    domainId="domain-30"
    layer="Layer 1: OOTB"
    persona="Digital Marketing Mgr"
    systems={["HubSpot", "Marketo", "Salesforce Marketing Cloud", "Vertex AI"]}
    kpis={[
      { label: "Subject line variants tested", before: "2", after: "5 per send" },
      { label: "Average open rate lift", before: "Baseline", after: "+15-25%" },
      { label: "A/B test setup time", before: "30 min", after: "Automated" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Subject lines written by the same marketer with limited A/B testing \u2014 typically 2 variants at best.",
      "No systematic testing of psychological triggers or segment-specific tone adaptation.",
      "A/B test configuration and monitoring is manual, often abandoned before statistical significance."
    ]}
    agentification={[
      "Gemini generates 5 subject line variations testing different psychological triggers \u2014 curiosity, urgency, social proof, specificity.",
      "Adapts copy tone for different segments (enterprise vs. SMB, new lead vs. customer) based on engagement history.",
      "Reviews email body for clarity, CTA strength, and mobile readability with specific improvement suggestions."
    ]}
  />
);
