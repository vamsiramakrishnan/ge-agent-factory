import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Mail, Activity, Search, AlertTriangle, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Monitor", lane: "system", type: "trigger" },
    { id: "a1", label: "Metrics Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Root Cause Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Remediation Plan", lane: "agent", type: "output" },
    { id: "h1", label: "Ops Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Health Check", icon: Activity, description: "Email deliverability metrics monitored daily across all sending domains.", trigger: "Daily", systems: ["Google Postmaster", "HubSpot"] },
  { label: "Issue Detection", icon: Search, description: "Bounce rates, spam complaints, and inbox placement anomalies identified.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Diagnosis", icon: AlertTriangle, description: "Root cause identified — domain reputation, content triggers, or list hygiene issues.", systems: ["Vertex AI"] },
  { label: "Action Plan", icon: FileText, description: "Specific remediation plan with timeline and expected recovery trajectory.", output: "Deliverability Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "Email send metrics, bounce rates, spam complaints, engagement data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Marketo", description: "Email deliverability stats, suppression list management, IP reputation", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Postmaster", description: "Gmail domain reputation, spam rate, DKIM/SPF/DMARC compliance", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Root cause diagnosis, remediation planning, content trigger analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical deliverability trends, engagement segmentation, list quality scores", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Deliverability alerts, remediation status updates", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Metrics Collection", description: "Pull deliverability metrics from all sending platforms: bounce rates by type, spam complaint rates, inbox placement estimates, and Google Postmaster domain reputation scores.", systems: ["HubSpot", "Marketo", "Google Postmaster"], layer: "integration", dataIn: "Email platform metrics + domain reputation", dataOut: "Unified deliverability health dashboard" },
    { label: "Anomaly Detection", description: "Detect deliverability anomalies against historical baselines. Correlate drops with specific sends (batch size, segment, content type) to narrow root cause candidates.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Current metrics + historical baselines", dataOut: "Anomalies with correlated events" },
    { label: "Root Cause Diagnosis", description: "Gemini diagnoses deliverability issues by correlating multiple signals. Distinguishes between domain reputation damage (from re-engagement sends), content-triggered spam filtering, and list hygiene issues.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomalies + correlated events + sending history", dataOut: "Root cause analysis with remediation plan" },
    { label: "Remediation Execution", description: "Generate specific remediation steps with timelines. Implement automated fixes (pause risky segments, adjust suppression thresholds) and alert Ops Lead for manual interventions.", systems: ["HubSpot", "Slack"], layer: "integration", dataIn: "Remediation plan", dataOut: "Executed fixes + recovery tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the Email Deliverability Manager workflow",
  primaryObjective: "Gemini correlates deliverability drops with specific sends, segments, and content to diagnose root causes. LLM distinguishes between domain reputation damage, content triggers, and list hygiene issues. so the Marketing Ops Lead can move the Inbox placement rate KPI.",
  inScope: [
    "Gemini correlates deliverability drops with specific sends, segments, and content to diagnose root causes",
    "LLM distinguishes between domain reputation damage, content triggers, and list hygiene issues",
    "Generates specific remediation plans with expected recovery timelines and automated safeguards",
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
      description: "Retrieve contacts from HubSpot for the Email Deliverability Manager workflow.",
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
      description: "Retrieve campaigns from Marketo for the Email Deliverability Manager workflow.",
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
      name: "query_google_postmaster_google_postmaster_records",
      kind: "query",
      sourceSystemId: "google_postmaster",
      description: "Retrieve google postmaster records from Google Postmaster for the Email Deliverability Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_postmaster_records_records",
        "google_postmaster_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Email Deliverability Manager workflow.",
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
      name: "lookup_email_deliverability_manager_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Email Deliverability Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hubspot_send",
      kind: "action",
      sourceSystemId: "hubspot",
      description: "Execute the send step in HubSpot after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Inbox placement rate moved from 82% average toward 94% sustained",
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
      claim: "Issue detection to fix moved from 3-5 days toward Same day",
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
      trigger: "Inbox placement rate regresses past the 82% average baseline by more than 20%",
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
      trigger: "Proposed send action lacks supporting evidence from at least two systems",
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
      id: "email-deliverability-manager-end-to-end",
      prompt: "Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hubspot_contacts",
        "query_marketo_campaigns",
        "query_google_postmaster_google_postmaster_records",
        "query_bigquery_analytics_events",
        "lookup_email_deliverability_manager_playbook",
        "action_hubspot_send",
      ],
      mustReferenceEntities: [
        "contacts",
        "campaigns",
        "google_postmaster_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "email-deliverability-manager-playbook",
      ],
      expectedActionOutcome: "Action send executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute send without two-system evidence",
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
    rationale: "Row counts sized for Email Deliverability Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "google_postmaster",
      name: "Google Postmaster",
      owns: [
        "google_postmaster_records",
        "google_postmaster_events",
        "google_postmaster_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_postmaster_google_postmaster_records",
        "query_google_postmaster_google_postmaster_events",
        "query_google_postmaster_google_postmaster_audit_trail",
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
      name: "google_postmaster_records",
      sourceSystemId: "google_postmaster",
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
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "google_postmaster_events",
      sourceSystemId: "google_postmaster",
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
          name: "google_postmaster_record_id",
          type: "ref",
          ref: "google_postmaster_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_postmaster_audit_trail",
      sourceSystemId: "google_postmaster",
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
      from: "google_postmaster_events.google_postmaster_record_id",
      to: "google_postmaster_records.id",
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
      id: "email-deliverability-manager-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Email Deliverability Manager Playbook",
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
      id: "hubspot_send_api",
      sourceSystemId: "hubspot",
      method: "POST",
      path: "/api/hubspot/send",
      description: "Synchronous endpoint the agent calls to send in HubSpot after evidence gating.",
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
      id: "email-deliverability-manager-baseline-gap",
      description: "Seed a realistic gap where Inbox placement rate sits between 82% average and 94% sustained, so the agent can detect, narrate, and recommend remediation.",
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
      database: "email_deliverability_manager",
      schemas: [
        "hubspot",
        "marketo",
        "google_postmaster",
      ],
    },
    bigquery: {
      dataset: "marketing_email_deliverability_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "email-deliverability-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "email-deliverability-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Email Deliverability Manager workflow and cite source-system evidence for every claim.",
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

export const EmailDeliverabilityManager = () => (
  <UseCaseSlide
    title="Email Deliverability Manager"
    subtitle="A-3605 • Marketing Operations"
    icon={Mail}
    domainId="domain-36"
    layer="Layer 3: Custom ADK"
    persona="Marketing Ops Lead"
    systems={["HubSpot", "Marketo", "Google Postmaster", "Vertex AI", "BigQuery"]}
    kpis={[
      { label: "Inbox placement rate", before: "82% average", after: "94% sustained" },
      { label: "Issue detection to fix", before: "3-5 days", after: "Same day" },
      { label: "Domain reputation incidents", before: "2-3 per quarter", after: "< 1 per quarter" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Deliverability issues discovered when campaign performance drops — reactive, not proactive.",
      "Root cause diagnosis requires manual correlation across multiple platforms and send logs.",
      "No sunset policy for disengaged contacts — sending to non-openers damages domain reputation."
    ]}
    agentification={[
      "Gemini correlates deliverability drops with specific sends, segments, and content to diagnose root causes.",
      "LLM distinguishes between domain reputation damage, content triggers, and list hygiene issues.",
      "Generates specific remediation plans with expected recovery timelines and automated safeguards."
    ]}
  />
);
