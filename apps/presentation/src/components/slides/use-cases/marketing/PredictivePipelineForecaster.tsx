import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { TrendingUp, Database, BarChart3, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Forecast", lane: "system", type: "trigger" },
    { id: "a1", label: "Pipeline Data", lane: "agent", type: "action" },
    { id: "a2", label: "Scenario Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Forecast Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Pipeline Ingest", icon: Database, description: "Pull pipeline data from CRM, engagement from HubSpot, and intent signals from 6sense.", trigger: "Weekly", systems: ["Salesforce CRM", "HubSpot", "6sense"] },
  { label: "Forecast Modeling", icon: BarChart3, description: "Deal scoring, weighted pipeline, and scenario modeling (best/expected/worst).", systems: ["BigQuery ML"] },
  { label: "Confidence Narrative", icon: FileText, description: "LLM provides forecast with confidence explanations, risks, and upside opportunities.", systems: ["Vertex AI"] },
  { label: "Forecast Delivery", icon: TrendingUp, description: "Weekly pipeline forecast with scenario analysis delivered to sales and marketing leadership.", output: "Pipeline Forecast" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Pipeline data, deal stages, close dates, amount, win probability", direction: "read", protocol: "REST API", category: "erp" },
    { system: "HubSpot", description: "Marketing engagement, lead scores, content interactions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "6sense", description: "Account intent signals, buying stage prediction, competitor research", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Forecast models, deal scoring, scenario analysis, historical accuracy", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Confidence narrative, risk identification, upside opportunity reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Pipeline & Signal Assembly", description: "Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). Enrich with marketing engagement from HubSpot and intent signals from 6sense for each account.", systems: ["Salesforce CRM", "HubSpot", "6sense", "BigQuery"], layer: "integration", dataIn: "CRM pipeline + engagement + intent signals", dataOut: "Enriched pipeline dataset" },
    { label: "Predictive Forecast Modeling", description: "Pipeline conversion prediction using deal scoring models. Weighted pipeline calculation with historical accuracy adjustments. Scenario modeling — best, expected, worst case with probability distributions.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Enriched pipeline dataset", dataOut: "Forecast scenarios with confidence intervals" },
    { label: "Confidence & Risk Narrative", description: "Gemini provides forecast with risk explanations. 'Q2 forecast: $12.4M (82% confidence). Risk: 3 deals worth $2.1M are single-threaded. Upside: 2 accounts showing surging intent haven't entered pipeline yet. Recommend marketing air cover for at-risk deals.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Forecast scenarios + deal context", dataOut: "Narrative forecast with actionable risks/upside" },
    { label: "Forecast Distribution", description: "Weekly forecast report with scenario analysis and narrative insights delivered to sales and marketing leadership. Historical accuracy tracking for model calibration.", systems: ["Looker"], layer: "integration", dataIn: "Narrative forecast", dataOut: "Distributed forecast report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Analyst agent for the Predictive Pipeline Forecaster workflow",
  primaryObjective: "Gemini provides forecast narratives with confidence levels, specific deal risks, and intent-signal upside opportunities. Predictive deal scoring enriched with marketing engagement and 6sense intent data. so the Marketing Analyst can move the Forecast accuracy KPI.",
  inScope: [
    "Gemini provides forecast narratives with confidence levels, specific deal risks, and intent-signal upside opportunities",
    "Predictive deal scoring enriched with marketing engagement and 6sense intent data",
    "Weekly scenario modeling (best/expected/worst) with historical accuracy calibration",
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
      description: "Retrieve accounts from Salesforce CRM for the Predictive Pipeline Forecaster workflow.",
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
      description: "Retrieve contacts from HubSpot for the Predictive Pipeline Forecaster workflow.",
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
      name: "query_6sense_6sense_records",
      kind: "query",
      sourceSystemId: "6sense",
      description: "Retrieve 6sense records from 6sense for the Predictive Pipeline Forecaster workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "6sense_records_records",
        "6sense_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Predictive Pipeline Forecaster workflow.",
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
      name: "lookup_predictive_pipeline_forecaster_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Predictive Pipeline Forecaster Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_enrich",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the enrich step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Forecast accuracy moved from ±30% manual toward ±10% predictive",
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
      claim: "Risk identification moved from End of quarter toward Weekly proactive",
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
      trigger: "Forecast accuracy regresses past the ±30% manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Marketing Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed enrich action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Marketing Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "predictive-pipeline-forecaster-end-to-end",
      prompt: "Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_hubspot_contacts",
        "query_6sense_6sense_records",
        "query_bigquery_analytics_events",
        "lookup_predictive_pipeline_forecaster_playbook",
        "action_salesforce_crm_enrich",
      ],
      mustReferenceEntities: [
        "accounts",
        "contacts",
        "6sense_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "predictive-pipeline-forecaster-playbook",
      ],
      expectedActionOutcome: "Action enrich executed against Salesforce CRM, with audit-trail entry and Marketing Analyst notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute enrich without two-system evidence",
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
    rationale: "Row counts sized for Predictive Pipeline Forecaster so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "6sense",
      name: "6sense",
      owns: [
        "6sense_records",
        "6sense_events",
        "6sense_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_6sense_6sense_records",
        "query_6sense_6sense_events",
        "query_6sense_6sense_audit_trail",
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
      name: "6sense_records",
      sourceSystemId: "6sense",
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
      name: "6sense_events",
      sourceSystemId: "6sense",
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
          name: "6sense_record_id",
          type: "ref",
          ref: "6sense_records.id",
          required: true,
        },
      ],
    },
    {
      name: "6sense_audit_trail",
      sourceSystemId: "6sense",
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
      from: "6sense_events.6sense_record_id",
      to: "6sense_records.id",
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
      id: "predictive-pipeline-forecaster-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Predictive Pipeline Forecaster Playbook",
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
      id: "salesforce_crm_enrich_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/enrich",
      description: "Synchronous endpoint the agent calls to enrich in Salesforce CRM after evidence gating.",
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
      id: "predictive-pipeline-forecaster-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy sits between ±30% manual and ±10% predictive, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Marketing Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "predictive_pipeline_forecaster",
      schemas: [
        "salesforce_crm",
        "hubspot",
        "6sense",
      ],
    },
    bigquery: {
      dataset: "marketing_predictive_pipeline_forecaster",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "predictive-pipeline-forecaster-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "predictive-pipeline-forecaster-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Predictive Pipeline Forecaster workflow and cite source-system evidence for every claim.",
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

export const PredictivePipelineForecaster = () => (
  <UseCaseSlide
    title="Predictive Pipeline Forecaster"
    subtitle="A-3407 • Marketing Analytics & Attribution"
    icon={TrendingUp}
    domainId="domain-34"
    layer="Layer 4: Data Agent"
    persona="Marketing Analyst"
    systems={["Salesforce CRM", "HubSpot", "6sense", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy", before: "±30% manual", after: "±10% predictive" },
      { label: "Risk identification", before: "End of quarter", after: "Weekly proactive" },
      { label: "Upside detection", before: "Anecdotal", after: "Intent-signal based" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Pipeline forecasts based on CRM stage percentages without engagement or intent context.",
      "Forecast risks identified late — single-threaded deals discovered at quarter end.",
      "Upside opportunities from high-intent accounts missed without systematic intent monitoring."
    ]}
    agentification={[
      "Gemini provides forecast narratives with confidence levels, specific deal risks, and intent-signal upside opportunities.",
      "Predictive deal scoring enriched with marketing engagement and 6sense intent data.",
      "Weekly scenario modeling (best/expected/worst) with historical accuracy calibration."
    ]}
  />
);
