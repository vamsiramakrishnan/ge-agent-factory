import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitBranch, Zap, Search, UserCheck, Clock } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "MQL Created", lane: "system", type: "trigger" },
    { id: "a1", label: "Account Match", lane: "agent", type: "action" },
    { id: "a2", label: "Territory Route", lane: "agent", type: "action" },
    { id: "a3", label: "Rep Assignment", lane: "agent", type: "output" },
    { id: "h1", label: "SDR Follow-Up", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "MQL Signal", icon: Zap, description: "New MQL created in MAP triggers routing workflow.", trigger: "Event", systems: ["HubSpot"] },
  { label: "Account Matching", icon: Search, description: "Lead matched to account hierarchy using fuzzy name matching, domain lookup, and relationship signals.", systems: ["Salesforce CRM", "LeanData"], integration: "ADK" },
  { label: "Rep Assignment", icon: UserCheck, description: "Lead assigned to appropriate SDR/AE based on territory, account ownership, and capacity.", systems: ["LeanData", "Salesforce CRM"] },
  { label: "Follow-Up Tracking", icon: Clock, description: "Assignment-to-contact time tracked with escalation on SLA breach.", output: "Assigned Lead" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "MQL notifications, lead data, behavioral signals, engagement history", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Salesforce CRM", description: "Account hierarchy, territory rules, rep assignments, opportunity data", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "LeanData", description: "Routing rules, round-robin logic, account matching, capacity balancing", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Ambiguous account matching, contextual routing decisions", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Routing analytics, SLA tracking, capacity utilization data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Assignment notifications, SLA breach alerts, routing exceptions", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Lead Enrichment", description: "Receive MQL from HubSpot with behavioral and firmographic data. Enrich with company domain lookup, LinkedIn company data, and historical engagement signals.", systems: ["HubSpot", "Salesforce CRM"], layer: "integration", dataIn: "Raw MQL record", dataOut: "Enriched lead with firmographic data" },
    { label: "Account Matching", description: "Fuzzy match lead to existing account hierarchy using company name variants, email domain, and entity resolution. Score match confidence and flag ambiguous cases.", systems: ["LeanData", "BigQuery ML"], layer: "ml", dataIn: "Enriched lead + account database", dataOut: "Matched account with confidence score" },
    { label: "Ambiguity Resolution", description: "Gemini handles ambiguous routing cases where automated matching fails. Checks domain registration, LinkedIn connections, and engagement history to determine correct routing.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Low-confidence matches + contextual signals", dataOut: "Resolved routing decision with rationale" },
    { label: "Assignment & Tracking", description: "Assign lead to appropriate rep based on territory, account ownership, and capacity. Create follow-up tasks, notify via Slack, and track assignment-to-contact SLA.", systems: ["Salesforce CRM", "Slack"], layer: "integration", dataIn: "Routing decision + rep availability", dataOut: "Assigned lead + SLA tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the Lead Routing & Assignment Engine workflow",
  primaryObjective: "Gemini resolves ambiguous account matches by analyzing domain, LinkedIn, and engagement context. LLM determines correct routing for edge cases that rule-based systems mishandle. so the Marketing Ops Lead can move the Routing accuracy KPI.",
  inScope: [
    "Gemini resolves ambiguous account matches by analyzing domain, LinkedIn, and engagement context",
    "LLM determines correct routing for edge cases that rule-based systems mishandle",
    "Reduces duplicate account creation by reasoning about entity relationships beyond name matching",
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
      description: "Retrieve accounts from Salesforce CRM for the Lead Routing & Assignment Engine workflow.",
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
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Lead Routing & Assignment Engine workflow.",
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
      name: "query_leandata_leandata_records",
      kind: "query",
      sourceSystemId: "leandata",
      description: "Retrieve leandata records from LeanData for the Lead Routing & Assignment Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "leandata_records_records",
        "leandata_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_lead_routing_assignment_engine_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "salesforce_crm",
      description: "Look up sections of the Lead Routing & Assignment Engine Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_assign",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the assign step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Routing accuracy moved from 78% correct first time toward 96% correct first time",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
    {
      claim: "Assignment-to-contact moved from 8+ hours average toward < 2 hours",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Routing accuracy regresses past the 78% correct first time baseline by more than 20%",
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
      trigger: "Proposed assign action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Marketing Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "lead-routing-assignment-engine-end-to-end",
      prompt: "Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_hubspot_contacts",
        "query_leandata_leandata_records",
        "lookup_lead_routing_assignment_engine_playbook",
        "action_salesforce_crm_assign",
      ],
      mustReferenceEntities: [
        "accounts",
        "contacts",
        "leandata_records",
      ],
      mustCiteDocuments: [
        "lead-routing-assignment-engine-playbook",
      ],
      expectedActionOutcome: "Action assign executed against Salesforce CRM, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute assign without two-system evidence",
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
    rationale: "Row counts sized for Lead Routing & Assignment Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "leandata",
      name: "LeanData",
      owns: [
        "leandata_records",
        "leandata_events",
        "leandata_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_leandata_leandata_records",
        "query_leandata_leandata_events",
        "query_leandata_leandata_audit_trail",
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
      name: "leandata_records",
      sourceSystemId: "leandata",
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
      name: "leandata_events",
      sourceSystemId: "leandata",
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
          name: "leandata_record_id",
          type: "ref",
          ref: "leandata_records.id",
          required: true,
        },
      ],
    },
    {
      name: "leandata_audit_trail",
      sourceSystemId: "leandata",
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "leandata_events.leandata_record_id",
      to: "leandata_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "lead-routing-assignment-engine-playbook",
      sourceSystemId: "salesforce_crm",
      type: "playbook",
      title: "Lead Routing & Assignment Engine Playbook",
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
      id: "salesforce_crm_assign_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/assign",
      description: "Synchronous endpoint the agent calls to assign in Salesforce CRM after evidence gating.",
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
      id: "lead-routing-assignment-engine-baseline-gap",
      description: "Seed a realistic gap where Routing accuracy sits between 78% correct first time and 96% correct first time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against HubSpot historical baseline",
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
      database: "lead_routing_assignment_engine",
      schemas: [
        "salesforce_crm",
        "hubspot",
        "leandata",
      ],
    },
    bigquery: {
      dataset: "marketing_lead_routing_assignment_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "lead-routing-assignment-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "lead-routing-assignment-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Lead Routing & Assignment Engine workflow and cite source-system evidence for every claim.",
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

export const LeadRoutingEngine = () => (
  <UseCaseSlide
    title="Lead Routing & Assignment Engine"
    subtitle="A-3602 • Marketing Operations"
    icon={GitBranch}
    domainId="domain-36"
    layer="Layer 2: Agent Designer"
    persona="Marketing Ops Lead"
    systems={["Salesforce CRM", "HubSpot", "LeanData", "Vertex AI"]}
    kpis={[
      { label: "Routing accuracy", before: "78% correct first time", after: "96% correct first time" },
      { label: "Assignment-to-contact", before: "8+ hours average", after: "< 2 hours" },
      { label: "Duplicate account creation", before: "12% of leads", after: "< 2% of leads" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Lead routing based on rigid rules that can't handle account hierarchy ambiguity.",
      "18% of leads misrouted — creating duplicate accounts or assigned to wrong territory.",
      "Assignment-to-contact SLA breached 30% of the time due to manual routing exceptions."
    ]}
    agentification={[
      "Gemini resolves ambiguous account matches by analyzing domain, LinkedIn, and engagement context.",
      "LLM determines correct routing for edge cases that rule-based systems mishandle.",
      "Reduces duplicate account creation by reasoning about entity relationships beyond name matching."
    ]}
  />
);
