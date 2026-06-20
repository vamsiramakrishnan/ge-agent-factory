import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldCheck, Database, Search, AlertTriangle, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Audit", lane: "system", type: "trigger" },
    { id: "a1", label: "Consent Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Compliance Report", lane: "agent", type: "output" },
    { id: "h1", label: "Ops + Legal Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Consent Audit", icon: Database, description: "Consent records scanned across marketing systems for GDPR/CCPA/CAN-SPAM compliance.", trigger: "Daily", systems: ["OneTrust", "HubSpot"] },
  { label: "Sync Validation", icon: Search, description: "Cross-system consent synchronization validated — opt-outs consistent everywhere.", systems: ["Salesforce CRM", "BigQuery"], integration: "ADK" },
  { label: "Regulatory Analysis", icon: AlertTriangle, description: "New regulations assessed for marketing operations impact.", systems: ["Vertex AI"] },
  { label: "Compliance Report", icon: FileText, description: "Marketing Ops Lead and Legal review gaps and approve remediation plans.", output: "Compliance Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "OneTrust", description: "Consent management platform, preference center, consent records", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "HubSpot", description: "Email consent status, unsubscribe management, GDPR deletion requests", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Salesforce CRM", description: "Contact consent flags, communication preferences, deletion tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Regulatory interpretation, impact assessment, compliance gap analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Consent coverage metrics, compliance audit trail, synchronization logs", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Compliance alerts, regulatory change notifications, remediation tracking", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Consent Inventory", description: "Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross-system synchronization — an opt-out in one system must be reflected everywhere. Detect consent gaps and orphaned records.", systems: ["OneTrust", "HubSpot", "Salesforce CRM"], layer: "integration", dataIn: "Consent records across systems", dataOut: "Consent coverage matrix with sync gaps" },
    { label: "Compliance Scoring", description: "Score compliance posture by regulation (GDPR, CCPA, CAN-SPAM), region, and data category. Track consent coverage rates, opt-out sync latency, and deletion request fulfillment times.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Consent matrix + regulatory requirements", dataOut: "Compliance scores with risk rankings" },
    { label: "Regulatory Interpretation", description: "Gemini interprets new privacy regulations and assesses impact on marketing operations. Determines whether AI-driven targeting decisions trigger disclosure requirements. Generates compliance gap analysis with remediation priority.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "New regulation text + current compliance posture", dataOut: "Impact assessment with remediation recommendations" },
    { label: "Reporting & Remediation", description: "Generate compliance reports for Marketing Ops Lead and Legal review. Track remediation progress. Automate consent sync fixes where possible.", systems: ["BigQuery", "Slack"], layer: "integration", dataIn: "Compliance scores + remediation plan", dataOut: "Audit-ready compliance report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the Marketing Compliance & Consent Manager workflow",
  primaryObjective: "Gemini interprets new privacy regulations and assesses specific impact on marketing operations. LLM determines whether AI-driven targeting decisions require disclosure under emerging AI regulations. so the Marketing Ops Lead can move the Consent sync accuracy KPI.",
  inScope: [
    "Gemini interprets new privacy regulations and assesses specific impact on marketing operations",
    "LLM determines whether AI-driven targeting decisions require disclosure under emerging AI regulations",
    "Continuously monitors consent synchronization with 99.8% cross-system accuracy",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_onetrust_onetrust_records",
      kind: "query",
      sourceSystemId: "onetrust",
      description: "Retrieve onetrust records from OneTrust for the Marketing Compliance & Consent Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "onetrust_records_records",
        "onetrust_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Marketing Compliance & Consent Manager workflow.",
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
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Marketing Compliance & Consent Manager workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Marketing Compliance & Consent Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_marketing_compliance_consent_manager_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Marketing Compliance & Consent Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_onetrust_sync",
      kind: "action",
      sourceSystemId: "onetrust",
      description: "Execute the sync step in OneTrust after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Consent sync accuracy moved from 87% cross-system toward 99.8% cross-system",
      mustCite: [
        "onetrust.onetrust_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "onetrust",
        "hubspot",
      ],
    },
    {
      claim: "Compliance audit prep moved from 2-3 weeks manual toward Always audit-ready",
      mustCite: [
        "onetrust.onetrust_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "onetrust",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Consent sync accuracy regresses past the 87% cross-system baseline by more than 20%",
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
      trigger: "Proposed sync action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from OneTrust (and other named systems) entities.",
    "Never bypass Marketing Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "marketing-compliance-consent-manager-end-to-end",
      prompt: "Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_onetrust_onetrust_records",
        "query_hubspot_contacts",
        "query_salesforce_crm_accounts",
        "query_bigquery_analytics_events",
        "lookup_marketing_compliance_consent_manager_playbook",
        "action_onetrust_sync",
      ],
      mustReferenceEntities: [
        "onetrust_records",
        "contacts",
        "accounts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "marketing-compliance-consent-manager-playbook",
      ],
      expectedActionOutcome: "Action sync executed against OneTrust, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute sync without two-system evidence",
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
    rationale: "Row counts sized for Marketing Compliance & Consent Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "onetrust",
      name: "OneTrust",
      owns: [
        "onetrust_records",
        "onetrust_events",
        "onetrust_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_onetrust_onetrust_records",
        "query_onetrust_onetrust_events",
        "query_onetrust_onetrust_audit_trail",
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
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "onetrust_records",
      sourceSystemId: "onetrust",
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
      name: "onetrust_events",
      sourceSystemId: "onetrust",
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
          name: "onetrust_record_id",
          type: "ref",
          ref: "onetrust_records.id",
          required: true,
        },
      ],
    },
    {
      name: "onetrust_audit_trail",
      sourceSystemId: "onetrust",
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
      name: "analytics_events",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "onetrust_events.onetrust_record_id",
      to: "onetrust_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "marketing-compliance-consent-manager-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Marketing Compliance & Consent Manager Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "onetrust_records",
        "onetrust_events",
        "onetrust_audit_trail",
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
      id: "onetrust_sync_api",
      sourceSystemId: "onetrust",
      method: "POST",
      path: "/api/onetrust/sync",
      description: "Synchronous endpoint the agent calls to sync in OneTrust after evidence gating.",
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
      id: "marketing-compliance-consent-manager-baseline-gap",
      description: "Seed a realistic gap where Consent sync accuracy sits between 87% cross-system and 99.8% cross-system, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "onetrust_records",
        "onetrust_events",
      ],
      discoveryPath: [
        "Inspect OneTrust records for the affected entities",
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
      database: "marketing_compliance_consent_manager",
      schemas: [
        "onetrust",
        "hubspot",
        "salesforce_crm",
      ],
    },
    bigquery: {
      dataset: "marketing_marketing_compliance_consent_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "marketing-compliance-consent-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "marketing-compliance-consent-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Marketing Compliance & Consent Manager workflow and cite source-system evidence for every claim.",
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

export const MarketingComplianceManager = () => (
  <UseCaseSlide
    title="Marketing Compliance & Consent Manager"
    subtitle="A-3607 • Marketing Operations"
    icon={ShieldCheck}
    domainId="domain-36"
    layer="Layer 3: Custom ADK"
    persona="Marketing Ops Lead"
    systems={["OneTrust", "HubSpot", "Salesforce CRM", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Consent sync accuracy", before: "87% cross-system", after: "99.8% cross-system" },
      { label: "Compliance audit prep", before: "2-3 weeks manual", after: "Always audit-ready" },
      { label: "Regulatory response time", before: "Reactive 30-60 days", after: "Proactive within 7 days" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Marketing Ops Lead + Legal", action: "Review compliance gaps", description: "Marketing Ops Lead and Legal counsel jointly review compliance gaps, approve remediation plans, and validate regulatory interpretation." }}
    statusQuo={[
      "Consent records checked manually before major campaigns — no continuous monitoring.",
      "Cross-system opt-out sync has 13% failure rate — risking regulatory fines from non-compliant sends.",
      "New privacy regulations assessed reactively months after taking effect."
    ]}
    agentification={[
      "Gemini interprets new privacy regulations and assesses specific impact on marketing operations.",
      "LLM determines whether AI-driven targeting decisions require disclosure under emerging AI regulations.",
      "Continuously monitors consent synchronization with 99.8% cross-system accuracy."
    ]}
  />
);
