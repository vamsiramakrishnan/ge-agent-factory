import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, TrendingUp, Search, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly/Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Pipeline Ingest", lane: "agent", type: "action" },
    { id: "a2", label: "Win Rate Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Deal Quality Assessment", lane: "agent", type: "action" },
    { id: "a4", label: "Forecast Narrative", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Pipeline Extraction", icon: Database, description: "Pull pipeline data from CRM with historical win rates and booking trends.", trigger: "Weekly/Monthly", systems: ["Salesforce CRM", "SAP S/4HANA SD"] },
  { label: "Statistical Forecasting", icon: TrendingUp, description: "Pipeline-weighted forecasting with win rate regression by deal size, stage, and segment.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Deal Quality Review", icon: Search, description: "Read deal notes and sales commentary to assess pipeline quality beyond stage percentages.", systems: ["Vertex AI"] },
  { label: "Forecast Delivery", icon: FileText, description: "Generate forecast narrative with deal-level adjustments for earnings prep.", output: "Revenue Forecast" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Pipeline data, deal stages, opportunity notes, sales commentary", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA SD", description: "Historical bookings, revenue recognition data", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Win rate models, cohort analytics, seasonal adjustments", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Deal note interpretation, pipeline quality assessment, narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Pipeline Data Integration", description: "Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge for comprehensive revenue view with stage, segment, and rep data.", systems: ["Salesforce CRM", "SAP S/4HANA SD"], layer: "integration", dataIn: "CRM pipeline + historical bookings", dataOut: "Unified revenue pipeline dataset" },
    { label: "Win Rate Regression", description: "Pipeline-weighted forecasting with win rate regression by deal size, stage, and segment. Apply cohort analysis and seasonal adjustment with confidence intervals.", systems: ["BigQuery"], layer: "ml", dataIn: "Pipeline dataset + historical win patterns", dataOut: "Statistical revenue forecast with confidence bands" },
    { label: "Deal Quality Assessment", description: "Gemini reads deal notes and sales commentary to assess pipeline quality beyond stage percentages. Adjusts probability for stale deals or accelerating opportunities.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Statistical forecast + deal notes + activity data", dataOut: "Quality-adjusted forecast with deal-level commentary" },
    { label: "Narrative & Delivery", description: "Generate forecast narrative for earnings prep with key drivers, risk deals, and upside opportunities highlighted.", systems: ["Email", "Google Slides"], layer: "integration", dataIn: "Adjusted forecast", dataOut: "Revenue forecast narrative" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "FP&A Director / CFO agent for the Revenue Forecasting Agent workflow",
  primaryObjective: "Win rate regression by deal size, stage, and segment provides statistically rigorous baseline. Gemini reads deal notes to downgrade stale opportunities and upgrade accelerating ones. so the FP&A Director / CFO can move the Forecast accuracy KPI.",
  inScope: [
    "Win rate regression by deal size, stage, and segment provides statistically rigorous baseline",
    "Gemini reads deal notes to downgrade stale opportunities and upgrade accelerating ones",
    "Auto-generates forecast narrative with deal-level commentary for earnings preparation",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Revenue Forecasting Agent workflow.",
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
      name: "query_sap_s_4hana_sd_sales_orders",
      kind: "query",
      sourceSystemId: "sap_s_4hana_sd",
      description: "Retrieve sales orders from SAP S/4HANA SD for the Revenue Forecasting Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sales_orders_records",
        "sales_orders_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Revenue Forecasting Agent workflow.",
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
      name: "lookup_revenue_forecasting_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Revenue Forecasting Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_generate",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the generate step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Forecast accuracy moved from 75-80% toward 93%+",
      mustCite: [
        "salesforce_crm.accounts",
        "sap_s_4hana_sd.sales_orders",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "sap_s_4hana_sd",
      ],
    },
    {
      claim: "Deal-level assessment moved from Stage % only toward Quality-adjusted",
      mustCite: [
        "salesforce_crm.accounts",
        "sap_s_4hana_sd.sales_orders",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "sap_s_4hana_sd",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Forecast accuracy regresses past the 75-80% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "FP&A Director / CFO",
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
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass FP&A Director / CFO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "revenue-forecasting-agent-end-to-end",
      prompt: "Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_sap_s_4hana_sd_sales_orders",
        "query_bigquery_analytics_events",
        "lookup_revenue_forecasting_agent_controls_playbook",
        "action_salesforce_crm_generate",
      ],
      mustReferenceEntities: [
        "accounts",
        "sales_orders",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "revenue-forecasting-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Salesforce CRM, with audit-trail entry and FP&A Director / CFO notified of outcomes.",
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
    rationale: "Row counts sized for Revenue Forecasting Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "sap_s_4hana_sd",
      name: "SAP S/4HANA SD",
      owns: [
        "sales_orders",
        "contracts",
        "billing_documents",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_sd_sales_orders",
        "query_sap_s_4hana_sd_contracts",
        "query_sap_s_4hana_sd_billing_documents",
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
      name: "sales_orders",
      sourceSystemId: "sap_s_4hana_sd",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "contracts",
      sourceSystemId: "sap_s_4hana_sd",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "billing_documents",
      sourceSystemId: "sap_s_4hana_sd",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "revenue-forecasting-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Revenue Forecasting Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "scope",
        "materiality",
        "escalation",
        "audit-evidence",
      ],
    },
  ],
  apis: [
    {
      id: "salesforce_crm_generate_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/generate",
      description: "Synchronous endpoint the agent calls to generate in Salesforce CRM after evidence gating.",
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
      id: "revenue-forecasting-agent-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy sits between 75-80% and 93%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against SAP S/4HANA SD historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next FP&A Director / CFO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "revenue_forecasting_agent",
      schemas: [
        "salesforce_crm",
        "sap_s_4hana_sd",
      ],
    },
    bigquery: {
      dataset: "finance_revenue_forecasting_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "revenue-forecasting-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "revenue-forecasting-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Revenue Forecasting Agent workflow and cite source-system evidence for every claim.",
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

export const RevenueForecastingAgent = () => (
  <UseCaseSlide
    title="Revenue Forecasting Agent"
    subtitle="A-2007 • FP&A"
    icon={DollarSign}
    domainId="domain-20"
    layer="Layer 3: Custom ADK"
    persona="FP&A Director / CFO"
    systems={["Salesforce CRM", "SAP S/4HANA SD", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy", before: "75-80%", after: "93%+" },
      { label: "Deal-level assessment", before: "Stage % only", after: "Quality-adjusted" },
      { label: "Forecast narrative time", before: "2 days manual", after: "Auto-generated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Revenue forecasts rely on CRM stage percentages that don't reflect actual deal health.",
      "Sales commentary and deal notes are not systematically incorporated into the forecast.",
      "Forecast narratives for earnings prep are manually assembled by analysts over multiple days."
    ]}
    agentification={[
      "Win rate regression by deal size, stage, and segment provides statistically rigorous baseline.",
      "Gemini reads deal notes to downgrade stale opportunities and upgrade accelerating ones.",
      "Auto-generates forecast narrative with deal-level commentary for earnings preparation."
    ]}
  />
);
