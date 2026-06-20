import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BrainCircuit, Database, Cpu, Brain, TrendingUp } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Score Receivables", lane: "agent", type: "action" },
    { id: "a2", label: "Signal Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Cash Forecast Feed", lane: "agent", type: "output" },
    { id: "h1", label: "Treasury Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Receivables Snapshot", icon: Database, description: "All open receivables extracted with customer attributes, aging, and payment history.", trigger: "Weekly", systems: ["SAP S/4HANA FI"] },
  { label: "Payment Date Prediction", icon: Cpu, description: "ML model predicts expected payment date for each receivable with confidence intervals based on historical patterns.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Qualitative Adjustment", icon: Brain, description: "Gemini interprets signals models cannot capture -- ERP migrations, payment process changes, and seasonal patterns in specific industries.", systems: ["Vertex AI"] },
  { label: "Forecast Integration", icon: TrendingUp, description: "Predicted inflows feed into treasury cash flow forecast for daily and weekly liquidity planning.", output: "Payment Predictions" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Open receivables, payment history, customer master data", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Payment prediction model, feature engineering, confidence scoring", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Qualitative signal interpretation, pattern change explanation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Kyriba", description: "Cash flow forecast integration, predicted inflow scheduling", direction: "write", protocol: "REST API", category: "erp" },
  ],
  pipeline: [
    { label: "Receivables Feature Engineering", description: "Extract open receivables with 30+ features: customer segment, invoice amount, day-of-week issued, industry, payment terms, historical average days-to-pay, dispute frequency, and seasonal patterns.", systems: ["SAP S/4HANA FI", "BigQuery"], layer: "integration", dataIn: "Open AR sub-ledger data", dataOut: "Feature-enriched receivable records" },
    { label: "Payment Date Prediction", description: "ML model trained on 3+ years of payment history predicts expected payment date for each receivable. Outputs confidence intervals -- 80% probability of payment between Day 35 and Day 42 -- enabling probabilistic cash forecasting.", systems: ["BigQuery"], layer: "ml", dataIn: "Feature-enriched receivables", dataOut: "Predicted payment dates with confidence intervals" },
    { label: "Signal Interpretation", description: "Gemini interprets qualitative signals that change payment patterns: 'This customer shifted from Net 15 to Net 45 starting last quarter -- correlates with their announced ERP migration. Expected to normalize post-migration in Q3.' Adjusts predictions accordingly.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Predictions + external customer signals", dataOut: "Signal-adjusted payment predictions with explanations" },
    { label: "Forecast Integration", description: "Feed adjusted payment predictions into the treasury cash flow forecast. Aggregate by day and week for liquidity planning.", systems: ["Kyriba"], layer: "integration", dataIn: "Adjusted payment predictions", dataOut: "Integrated cash inflow forecast" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AR Manager / Treasurer agent for the Customer Payment Predictor workflow",
  primaryObjective: "ML model predicts payment dates at the invoice level with +/- 3 day accuracy, enabling precise liquidity planning. Gemini interprets qualitative signals that explain pattern changes -- ERP migrations, CFO transitions, seasonal industry effects. so the AR Manager / Treasurer can move the Cash forecast accuracy KPI.",
  inScope: [
    "ML model predicts payment dates at the invoice level with +/- 3 day accuracy, enabling precise liquidity planning",
    "Gemini interprets qualitative signals that explain pattern changes -- ERP migrations, CFO transitions, seasonal industry effects",
    "Improved forecast accuracy reduces the required liquidity buffer by $10M, freeing capital for investment",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Customer Payment Predictor workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Customer Payment Predictor workflow.",
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
      name: "query_kyriba_cash_positions",
      kind: "query",
      sourceSystemId: "kyriba",
      description: "Retrieve cash positions from Kyriba for the Customer Payment Predictor workflow.",
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
      name: "lookup_customer_payment_predictor_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Customer Payment Predictor Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
  ],
  evidenceRequirements: [
    {
      claim: "Cash forecast accuracy moved from 65-70% toward 92%",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
    {
      claim: "Payment date prediction error moved from N/A (no prediction) toward +/- 3 days",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Cash forecast accuracy regresses past the 65-70% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AR Manager / Treasurer",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass AR Manager / Treasurer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "customer-payment-predictor-end-to-end",
      prompt: "Run the Customer Payment Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "query_kyriba_cash_positions",
        "lookup_customer_payment_predictor_controls_playbook",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "analytics_events",
        "cash_positions",
      ],
      mustCiteDocuments: [
        "customer-payment-predictor-controls-playbook",
      ],
      expectedActionOutcome: "AR Manager / Treasurer receives a fully-cited recommendation; no external state change without explicit approval.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not act on single-system evidence",
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
    rationale: "Row counts sized for Customer Payment Predictor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
  ],
  entities: [
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
      id: "customer-payment-predictor-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Customer Payment Predictor Controls Playbook",
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
  apis: [],
  anomalies: [
    {
      id: "customer-payment-predictor-baseline-gap",
      description: "Seed a realistic gap where Cash forecast accuracy sits between 65-70% and 92%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AR Manager / Treasurer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "customer_payment_predictor",
      schemas: [
        "sap_s_4hana_fi",
        "kyriba",
      ],
    },
    bigquery: {
      dataset: "finance_customer_payment_predictor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "customer-payment-predictor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "customer-payment-predictor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Customer Payment Predictor workflow and cite source-system evidence for every claim.",
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

export const CustomerPaymentPredictor = () => (
  <UseCaseSlide
    title="Customer Payment Predictor"
    subtitle="A-2307 - AR & Collections"
    icon={BrainCircuit}
    domainId="domain-23"
    layer="Layer 4: Data Agent"
    persona="AR Manager / Treasurer"
    systems={["SAP S/4HANA FI", "BigQuery", "Vertex AI", "Kyriba"]}
    kpis={[
      { label: "Cash forecast accuracy", before: "65-70%", after: "92%" },
      { label: "Payment date prediction error", before: "N/A (no prediction)", after: "+/- 3 days" },
      { label: "Liquidity buffer required", before: "$15M (uncertainty)", after: "$5M (confidence)" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasurer", action: "Review forecast assumptions", description: "Treasurer reviews aggregated payment predictions and qualitative adjustments before incorporating into liquidity planning decisions." }}
    statusQuo={[
      "Cash inflow forecasting based on simple aging bucket assumptions -- 'receivables under 30 days collect this month' -- with 65-70% accuracy.",
      "No customer-level payment date prediction; treasury maintains a large liquidity buffer due to uncertainty.",
      "Qualitative signals like customer ERP migrations are known by AR but never reach treasury forecasts."
    ]}
    agentification={[
      "ML model predicts payment dates at the invoice level with +/- 3 day accuracy, enabling precise liquidity planning.",
      "Gemini interprets qualitative signals that explain pattern changes -- ERP migrations, CFO transitions, seasonal industry effects.",
      "Improved forecast accuracy reduces the required liquidity buffer by $10M, freeing capital for investment."
    ]}
  />
);
