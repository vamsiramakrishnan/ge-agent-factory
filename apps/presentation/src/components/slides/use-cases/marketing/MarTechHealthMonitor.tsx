import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Monitor, Activity, Search, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Health Check", lane: "system", type: "trigger" },
    { id: "a1", label: "API Status Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Root Cause Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Health Report", lane: "agent", type: "output" },
    { id: "h1", label: "Ops Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "System Scan", icon: Activity, description: "API health, data sync status, and integration latency checked across MarTech stack.", trigger: "Daily", systems: ["HubSpot", "Salesforce CRM"] },
  { label: "Failure Diagnosis", icon: Search, description: "Sync failures analyzed for root cause — field mapping issues, API limits, or data quality.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Issue Triage", icon: AlertTriangle, description: "Issues prioritized by business impact with specific remediation steps provided.", systems: ["Vertex AI"] },
  { label: "Ops Review", icon: CheckCircle, description: "Marketing Ops Lead reviews critical issues and approves remediation actions.", output: "MarTech Health Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "MAP sync status, workflow health, API usage, email deliverability", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Salesforce CRM", description: "CRM sync status, field mapping validation, record counts", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Analytics 4", description: "Tracking tag health, data collection status, event validation", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Integration health metrics, historical failure patterns, sync latency data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Root cause diagnosis, remediation guidance, impact assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack", description: "System health alerts, issue escalation, remediation notifications", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Health Polling", description: "Check API health and data sync status across HubSpot, Salesforce, GA4, and ad platforms. Detect integration failures, sync delays, and license utilization issues.", systems: ["HubSpot", "Salesforce CRM", "Google Analytics 4"], layer: "integration", dataIn: "System API endpoints + sync logs", dataOut: "Health status matrix with failures flagged" },
    { label: "Pattern Detection", description: "Compare current failures against historical patterns. Detect recurring issues, predict upcoming sync failures based on data volume trends, and calculate business impact.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Current failures + historical patterns", dataOut: "Classified issues with impact scores" },
    { label: "Root Cause Diagnosis", description: "Gemini diagnoses complex integration failures that automated monitoring flags but can't explain. Reads field mapping configs, API change logs, and data schemas to identify root causes and generate specific fix instructions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Classified issues + system configs + change logs", dataOut: "Root cause analysis with remediation steps" },
    { label: "Alerting & Reporting", description: "Alert Marketing Ops Lead on critical issues via Slack. Generate daily health digest with prioritized remediation backlog.", systems: ["Slack", "BigQuery"], layer: "integration", dataIn: "Diagnosed issues with remediation", dataOut: "Prioritized alert + health dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the MarTech Stack Health Monitor workflow",
  primaryObjective: "Gemini diagnoses complex integration failures by reading field mappings, API logs, and data schemas. LLM explains root causes in plain language and provides specific fix instructions for ops team. so the Marketing Ops Lead can move the Issue detection time KPI.",
  inScope: [
    "Gemini diagnoses complex integration failures by reading field mappings, API logs, and data schemas",
    "LLM explains root causes in plain language and provides specific fix instructions for ops team",
    "Predicts upcoming failures based on historical patterns and data volume trends",
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
      description: "Retrieve contacts from HubSpot for the MarTech Stack Health Monitor workflow.",
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
      description: "Retrieve accounts from Salesforce CRM for the MarTech Stack Health Monitor workflow.",
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
      name: "query_google_analytics_4_session_events",
      kind: "query",
      sourceSystemId: "google_analytics_4",
      description: "Retrieve session events from Google Analytics 4 for the MarTech Stack Health Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "session_events_records",
        "session_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the MarTech Stack Health Monitor workflow.",
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
      name: "lookup_martech_stack_health_monitor_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_analytics_4",
      description: "Look up sections of the MarTech Stack Health Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hubspot_log_entry",
      kind: "action",
      sourceSystemId: "hubspot",
      description: "Execute the log entry step in HubSpot after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Issue detection time moved from Hours to discover toward < 5 minutes",
      mustCite: [
        "hubspot.contacts",
        "salesforce_crm.accounts",
      ],
      sourceSystemIds: [
        "hubspot",
        "salesforce_crm",
      ],
    },
    {
      claim: "Mean time to resolve moved from 4-8 hours toward 1-2 hours",
      mustCite: [
        "hubspot.contacts",
        "salesforce_crm.accounts",
      ],
      sourceSystemIds: [
        "hubspot",
        "salesforce_crm",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Issue detection time regresses past the Hours to discover baseline by more than 20%",
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
      trigger: "Proposed log entry action lacks supporting evidence from at least two systems",
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
      id: "martech-stack-health-monitor-end-to-end",
      prompt: "Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hubspot_contacts",
        "query_salesforce_crm_accounts",
        "query_google_analytics_4_session_events",
        "query_bigquery_analytics_events",
        "lookup_martech_stack_health_monitor_playbook",
        "action_hubspot_log_entry",
      ],
      mustReferenceEntities: [
        "contacts",
        "accounts",
        "session_events",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "martech-stack-health-monitor-playbook",
      ],
      expectedActionOutcome: "Action log entry executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute log entry without two-system evidence",
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
    rationale: "Row counts sized for MarTech Stack Health Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "google_analytics_4",
      name: "Google Analytics 4",
      owns: [
        "session_events",
        "conversion_paths",
        "audience_segments",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_google_analytics_4_session_events",
        "query_google_analytics_4_conversion_paths",
        "query_google_analytics_4_audience_segments",
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
      name: "session_events",
      sourceSystemId: "google_analytics_4",
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
          name: "conversion_path_id",
          type: "ref",
          ref: "conversion_paths.id",
          required: true,
        },
      ],
    },
    {
      name: "conversion_paths",
      sourceSystemId: "google_analytics_4",
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
      name: "audience_segments",
      sourceSystemId: "google_analytics_4",
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "session_events.conversion_path_id",
      to: "conversion_paths.id",
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
      id: "martech-stack-health-monitor-playbook",
      sourceSystemId: "google_analytics_4",
      type: "playbook",
      title: "MarTech Stack Health Monitor Playbook",
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
      id: "hubspot_log_entry_api",
      sourceSystemId: "hubspot",
      method: "POST",
      path: "/api/hubspot/log_entry",
      description: "Synchronous endpoint the agent calls to log entry in HubSpot after evidence gating.",
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
      id: "martech-stack-health-monitor-baseline-gap",
      description: "Seed a realistic gap where Issue detection time sits between Hours to discover and < 5 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contacts",
        "deals",
      ],
      discoveryPath: [
        "Inspect HubSpot records for the affected entities",
        "Compare against Salesforce CRM historical baseline",
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
      database: "martech_stack_health_monitor",
      schemas: [
        "hubspot",
        "salesforce_crm",
      ],
    },
    bigquery: {
      dataset: "marketing_martech_stack_health_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "martech-stack-health-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "martech-stack-health-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the MarTech Stack Health Monitor workflow and cite source-system evidence for every claim.",
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

export const MarTechHealthMonitor = () => (
  <UseCaseSlide
    title="MarTech Stack Health Monitor"
    subtitle="A-3601 • Marketing Operations"
    icon={Monitor}
    domainId="domain-36"
    layer="Layer 2: Agent Designer"
    persona="Marketing Ops Lead"
    systems={["HubSpot", "Salesforce CRM", "Google Analytics 4", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Issue detection time", before: "Hours to discover", after: "< 5 minutes" },
      { label: "Mean time to resolve", before: "4-8 hours", after: "1-2 hours" },
      { label: "Data sync reliability", before: "94% uptime", after: "99.5% uptime" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Marketing Ops Lead", action: "Review system issues", description: "Marketing Ops Lead reviews critical integration failures and approves remediation actions that require system changes." }}
    statusQuo={[
      "Integration failures discovered when campaigns break — no proactive monitoring.",
      "Root cause diagnosis requires hours of manual investigation across multiple systems.",
      "License utilization untracked — paying for tools that are underutilized or hitting API limits."
    ]}
    agentification={[
      "Gemini diagnoses complex integration failures by reading field mappings, API logs, and data schemas.",
      "LLM explains root causes in plain language and provides specific fix instructions for ops team.",
      "Predicts upcoming failures based on historical patterns and data volume trends."
    ]}
  />
);
