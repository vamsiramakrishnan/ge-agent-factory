import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { TrendingUp, Database, LineChart, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Month-End Close", lane: "system", type: "trigger" },
    { id: "a1", label: "Actuals Refresh", lane: "agent", type: "action" },
    { id: "a2", label: "Model Recalibration", lane: "agent", type: "action" },
    { id: "a3", label: "Signal Interpretation", lane: "agent", type: "action" },
    { id: "a4", label: "Forecast Commentary", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Actuals Ingest", icon: Database, description: "Pull month-end actuals from ERP and refresh forecast baseline.", trigger: "Monthly", systems: ["SAP S/4HANA FI/CO", "Anaplan"] },
  { label: "Model Refresh", icon: LineChart, description: "Time-series forecasting with Prophet/ARIMA on revenue and expense lines with seasonal decomposition.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Signal Interpretation", icon: TrendingUp, description: "Interpret qualitative signals — earnings calls, pipeline updates, macro shifts — and adjust assumptions.", systems: ["Vertex AI"] },
  { label: "Forecast Delivery", icon: FileText, description: "Generate forecast commentary with variance explanations and confidence intervals.", output: "Rolling Forecast" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI/CO", description: "Month-end actuals, GL balances, cost center data", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Anaplan", description: "Forecast models, planning workspace, scenario outputs", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical trend data, time-series models, enriched analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Qualitative signal interpretation, forecast commentary generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Actuals Integration", description: "Pull month-end actuals from SAP, map to forecast categories, and refresh the Anaplan forecast baseline with latest actual results.", systems: ["SAP S/4HANA FI/CO", "Anaplan"], layer: "integration", dataIn: "GL actuals by cost center", dataOut: "Updated forecast baseline" },
    { label: "Time-Series Forecasting", description: "Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decomposition, trend extrapolation, and generate confidence intervals for each forecast line.", systems: ["BigQuery", "Vertex AI"], layer: "ml", dataIn: "Historical actuals + external indicators", dataOut: "Statistical forecast with confidence bands" },
    { label: "Qualitative Signal Adjustment", description: "Gemini interprets earnings call commentary, pipeline updates, and macroeconomic shifts to adjust forecast assumptions that pure statistical models miss.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Statistical forecast + qualitative signals", dataOut: "Adjusted forecast with narrative commentary" },
    { label: "Delivery & Distribution", description: "Distribute updated forecast projections to stakeholders with variance commentary and assumption change log.", systems: ["Anaplan", "Email"], layer: "integration", dataIn: "Final forecast package", dataOut: "Distributed rolling forecast" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "FP&A Director agent for the Rolling Forecast Engine workflow",
  primaryObjective: "Time-series models auto-refresh monthly with statistical confidence intervals on every line. Gemini interprets earnings calls, pipeline notes, and macro shifts to adjust assumptions systematically. so the FP&A Director can move the Forecast accuracy KPI.",
  inScope: [
    "Time-series models auto-refresh monthly with statistical confidence intervals on every line",
    "Gemini interprets earnings calls, pipeline notes, and macro shifts to adjust assumptions systematically",
    "Generates forecast commentary explaining variance drivers and assumption changes automatically",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_co_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi_co",
      description: "Retrieve gl entries from SAP S/4HANA FI/CO for the Rolling Forecast Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gl_entries_records",
        "gl_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_anaplan_budget_lines",
      kind: "query",
      sourceSystemId: "anaplan",
      description: "Retrieve budget lines from Anaplan for the Rolling Forecast Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "budget_lines_records",
        "budget_lines_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Rolling Forecast Engine workflow.",
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
      name: "lookup_rolling_forecast_engine_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Rolling Forecast Engine Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_co_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi_co",
      description: "Execute the generate step in SAP S/4HANA FI/CO after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Forecast accuracy moved from 70-75% toward 92%+",
      mustCite: [
        "sap_s_4hana_fi_co.gl_entries",
        "anaplan.budget_lines",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi_co",
        "anaplan",
      ],
    },
    {
      claim: "Forecast refresh cycle moved from 2-3 weeks toward 2 days",
      mustCite: [
        "sap_s_4hana_fi_co.gl_entries",
        "anaplan.budget_lines",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi_co",
        "anaplan",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Forecast accuracy regresses past the 70-75% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "FP&A Director",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI/CO (and other named systems) entities.",
    "Never bypass FP&A Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "rolling-forecast-engine-end-to-end",
      prompt: "Run the Rolling Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_co_gl_entries",
        "query_anaplan_budget_lines",
        "query_bigquery_analytics_events",
        "lookup_rolling_forecast_engine_controls_playbook",
        "action_sap_s_4hana_fi_co_generate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "budget_lines",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "rolling-forecast-engine-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA FI/CO, with audit-trail entry and FP&A Director notified of outcomes.",
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
    rationale: "Row counts sized for Rolling Forecast Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_fi_co",
      name: "SAP S/4HANA FI/CO",
      owns: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_fi_co_gl_entries",
        "query_sap_s_4hana_fi_co_subledger_balances",
        "query_sap_s_4hana_fi_co_open_items",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "anaplan",
      name: "Anaplan",
      owns: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_anaplan_budget_lines",
        "query_anaplan_forecast_versions",
        "query_anaplan_variance_records",
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
      name: "gl_entries",
      sourceSystemId: "sap_s_4hana_fi_co",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
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
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "subledger_balances",
      sourceSystemId: "sap_s_4hana_fi_co",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
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
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "open_items",
      sourceSystemId: "sap_s_4hana_fi_co",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
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
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "budget_lines",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "forecast_versions",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "variance_records",
      sourceSystemId: "anaplan",
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
      id: "rolling-forecast-engine-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Rolling Forecast Engine Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "gl_entries",
        "subledger_balances",
        "open_items",
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
      id: "sap_s_4hana_fi_co_generate_api",
      sourceSystemId: "sap_s_4hana_fi_co",
      method: "POST",
      path: "/api/sap_s_4hana_fi_co/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA FI/CO after evidence gating.",
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
      id: "rolling-forecast-engine-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy sits between 70-75% and 92%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI/CO records for the affected entities",
        "Compare against Anaplan historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next FP&A Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "rolling_forecast_engine",
      schemas: [
        "sap_s_4hana_fi_co",
        "anaplan",
      ],
    },
    bigquery: {
      dataset: "finance_rolling_forecast_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "rolling-forecast-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "rolling-forecast-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Rolling Forecast Engine workflow and cite source-system evidence for every claim.",
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

export const RollingForecastEngine = () => (
  <UseCaseSlide
    title="Rolling Forecast Engine"
    subtitle="A-2002 • FP&A"
    icon={TrendingUp}
    domainId="domain-20"
    layer="Layer 3: Custom ADK"
    persona="FP&A Director"
    systems={["SAP S/4HANA FI/CO", "Anaplan", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy", before: "70-75%", after: "92%+" },
      { label: "Forecast refresh cycle", before: "2-3 weeks", after: "2 days" },
      { label: "Qualitative signals incorporated", before: "Ad-hoc", after: "Systematic" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Forecasts built in 50-tab Excel models with manual data pulls from SAP each month.",
      "Qualitative signals from pipeline updates and macro events incorporated informally via gut feel.",
      "Forecast commentary written manually by analysts after spending days on number-crunching."
    ]}
    agentification={[
      "Time-series models auto-refresh monthly with statistical confidence intervals on every line.",
      "Gemini interprets earnings calls, pipeline notes, and macro shifts to adjust assumptions systematically.",
      "Generates forecast commentary explaining variance drivers and assumption changes automatically."
    ]}
  />
);
