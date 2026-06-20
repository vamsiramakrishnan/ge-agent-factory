import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { TrendingUp, Database, Cpu, Brain, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Position Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Forecast Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Signal Adjustment", lane: "agent", type: "output" },
    { id: "h1", label: "Treasurer Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Cash Aggregation", icon: Database, description: "Cash positions aggregated across all bank accounts, AR/AP projections pulled from sub-ledgers.", trigger: "Daily", systems: ["Kyriba", "SAP S/4HANA FI"] },
  { label: "Multi-Horizon Forecast", icon: Cpu, description: "Time-series models forecast cash flows at daily, weekly, and monthly horizons with seasonal pattern recognition.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Qualitative Signals", icon: Brain, description: "Gemini incorporates deal closings, expedite fees, and other qualitative signals from sales and supply chain teams.", systems: ["Vertex AI"] },
  { label: "Treasurer Decision", icon: BarChart3, description: "Treasurer reviews consolidated forecast and makes investment, borrowing, or sweep decisions.", output: "Cash Flow Forecast" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Kyriba", description: "Global bank balances, cash positions, investment portfolio, debt schedules", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA FI", description: "AR/AP projections, payment schedules, intercompany settlements", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Forecast models, seasonal decomposition, variance-to-forecast tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Qualitative signal incorporation, forecast narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Bloomberg", description: "Market rates, FX rates, yield curves for investment planning", direction: "read", protocol: "REST API", category: "market-data" },
  ],
  pipeline: [
    { label: "Cash Position Aggregation", description: "Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies. Pull AR expected inflows and AP scheduled outflows from ERP sub-ledgers. Convert to reporting currency using current rates.", systems: ["Kyriba", "SAP S/4HANA FI"], layer: "integration", dataIn: "Bank balances, AR/AP schedules, FX rates", dataOut: "Consolidated cash position with inflow/outflow projections" },
    { label: "Multi-Horizon Forecasting", description: "Time-series models forecast cash at daily (1-week), weekly (1-month), and monthly (1-year) horizons. Seasonal decomposition captures payroll cycles, tax payments, and quarterly patterns. Variance-to-prior-forecast tracking measures accuracy.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical cash flows + current position + AR/AP projections", dataOut: "Multi-horizon cash forecast with confidence bands" },
    { label: "Qualitative Signal Integration", description: "Gemini reads internal signals: 'Sales closed a $5M deal with 50% upfront payment -- adjust next week's inflows. Supply chain flagged a $2M expedite fee -- add to next month's outflows.' Adjusts forecast with narrative explanation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Base forecast + qualitative signals from business teams", dataOut: "Signal-adjusted forecast with change narrative" },
    { label: "Decision Support Delivery", description: "Present consolidated forecast to Treasurer with decision recommendations: invest excess, sweep between accounts, or arrange short-term borrowing.", systems: ["Kyriba"], layer: "integration", dataIn: "Adjusted forecast with recommendations", dataOut: "Treasury decision support package" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Treasurer agent for the Cash Flow Forecaster workflow",
  primaryObjective: "Automated multi-horizon forecasting with seasonal decomposition achieves 93% accuracy at 30-day horizon. Gemini incorporates qualitative business signals that Excel models miss -- deal closings, expedite fees, one-time payments. so the Treasurer can move the Forecast accuracy (30-day) KPI.",
  inScope: [
    "Automated multi-horizon forecasting with seasonal decomposition achieves 93% accuracy at 30-day horizon",
    "Gemini incorporates qualitative business signals that Excel models miss -- deal closings, expedite fees, one-time payments",
    "Improved accuracy reduces idle cash by $15M, generating $750K+ in additional investment income annually",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_kyriba_cash_positions",
      kind: "query",
      sourceSystemId: "kyriba",
      description: "Retrieve cash positions from Kyriba for the Cash Flow Forecaster workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cash_positions_records",
        "cash_positions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Cash Flow Forecaster workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Cash Flow Forecaster workflow.",
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
      name: "lookup_cash_flow_forecaster_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Cash Flow Forecaster Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_kyriba_execute",
      kind: "action",
      sourceSystemId: "kyriba",
      description: "Execute the execute step in Kyriba after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Forecast accuracy (30-day) moved from 70-75% toward 93%",
      mustCite: [
        "kyriba.cash_positions",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "kyriba",
        "sap_s_4hana_fi",
      ],
    },
    {
      claim: "Forecast preparation time moved from 4 hours/day toward Automated",
      mustCite: [
        "kyriba.cash_positions",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "kyriba",
        "sap_s_4hana_fi",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Forecast accuracy (30-day) regresses past the 70-75% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Treasurer",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed execute action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Kyriba (and other named systems) entities.",
    "Never bypass Treasurer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "cash-flow-forecaster-end-to-end",
      prompt: "Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_kyriba_cash_positions",
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "lookup_cash_flow_forecaster_controls_playbook",
        "action_kyriba_execute",
      ],
      mustReferenceEntities: [
        "cash_positions",
        "gl_entries",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "cash-flow-forecaster-controls-playbook",
      ],
      expectedActionOutcome: "Action execute executed against Kyriba, with audit-trail entry and Treasurer notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute execute without two-system evidence",
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
    rationale: "Row counts sized for Cash Flow Forecaster so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "kyriba",
      name: "Kyriba",
      owns: [
        "cash_positions",
        "bank_transactions",
        "forecast_inputs",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_kyriba_cash_positions",
        "query_kyriba_bank_transactions",
        "query_kyriba_forecast_inputs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_s_4hana_fi",
      name: "SAP S/4HANA FI",
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
        "query_sap_s_4hana_fi_gl_entries",
        "query_sap_s_4hana_fi_subledger_balances",
        "query_sap_s_4hana_fi_open_items",
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
      name: "cash_positions",
      sourceSystemId: "kyriba",
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
      name: "bank_transactions",
      sourceSystemId: "kyriba",
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
      name: "forecast_inputs",
      sourceSystemId: "kyriba",
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
      name: "gl_entries",
      sourceSystemId: "sap_s_4hana_fi",
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
      sourceSystemId: "sap_s_4hana_fi",
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
      sourceSystemId: "sap_s_4hana_fi",
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
      id: "cash-flow-forecaster-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Cash Flow Forecaster Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "cash_positions",
        "bank_transactions",
        "forecast_inputs",
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
      id: "kyriba_execute_api",
      sourceSystemId: "kyriba",
      method: "POST",
      path: "/api/kyriba/execute",
      description: "Synchronous endpoint the agent calls to execute in Kyriba after evidence gating.",
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
      id: "cash-flow-forecaster-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy (30-day) sits between 70-75% and 93%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "cash_positions",
        "bank_transactions",
      ],
      discoveryPath: [
        "Inspect Kyriba records for the affected entities",
        "Compare against SAP S/4HANA FI historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Treasurer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "cash_flow_forecaster",
      schemas: [
        "kyriba",
        "sap_s_4hana_fi",
      ],
    },
    bigquery: {
      dataset: "finance_cash_flow_forecaster",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "cash-flow-forecaster-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "cash-flow-forecaster-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Cash Flow Forecaster workflow and cite source-system evidence for every claim.",
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

export const CashFlowForecaster = () => (
  <UseCaseSlide
    title="Cash Flow Forecaster"
    subtitle="A-2401 - Treasury & Cash"
    icon={TrendingUp}
    domainId="domain-24"
    layer="Layer 3: Custom ADK"
    persona="Treasurer"
    systems={["Kyriba", "SAP S/4HANA FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy (30-day)", before: "70-75%", after: "93%" },
      { label: "Forecast preparation time", before: "4 hours/day", after: "Automated" },
      { label: "Idle cash reduction", before: "$20M average", after: "$5M average" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasurer", action: "Review forecast and make decisions", description: "Treasurer reviews multi-horizon forecast, validates qualitative adjustments, and makes investment, borrowing, or sweep decisions." }}
    statusQuo={[
      "Cash forecasting done in Excel by manually pulling bank balances and AR/AP reports each morning.",
      "Qualitative signals from sales and supply chain communicated via email and rarely incorporated into forecasts.",
      "Large idle cash buffers maintained because forecast uncertainty makes it unsafe to invest short-term."
    ]}
    agentification={[
      "Automated multi-horizon forecasting with seasonal decomposition achieves 93% accuracy at 30-day horizon.",
      "Gemini incorporates qualitative business signals that Excel models miss -- deal closings, expedite fees, one-time payments.",
      "Improved accuracy reduces idle cash by $15M, generating $750K+ in additional investment income annually."
    ]}
  />
);
