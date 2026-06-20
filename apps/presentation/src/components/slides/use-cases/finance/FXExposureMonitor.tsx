import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, Cpu, Brain, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Rate Threshold", lane: "system", type: "trigger" },
    { id: "a1", label: "Exposure Netting", lane: "agent", type: "action" },
    { id: "a2", label: "Market Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Hedge Recommendation", lane: "agent", type: "output" },
    { id: "h1", label: "Treasurer Acts", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Exposure Aggregation", icon: Database, description: "FX exposures aggregated across entities, currencies, and time horizons from treasury and ERP systems.", trigger: "Daily + threshold breach", systems: ["Kyriba", "SAP S/4HANA FI"] },
  { label: "VaR & Scenario Analysis", icon: Cpu, description: "Value-at-Risk modeling, exposure netting, and scenario analysis across currency pairs with hedge effectiveness measurement.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Market Event Interpretation", icon: Brain, description: "Gemini interprets market-moving events -- central bank decisions, geopolitical events -- and assesses P&L impact on current exposure.", systems: ["Vertex AI"] },
  { label: "Hedging Decision", icon: AlertTriangle, description: "Treasurer reviews exposure summary, VaR impact, and market context to adjust hedge ratios.", output: "FX Risk Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Kyriba", description: "FX positions, hedge contracts, derivative valuations, exposure reporting", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Bloomberg", description: "Real-time FX rates, market news, central bank decisions, volatility surfaces", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "SAP S/4HANA FI", description: "Foreign currency payables, receivables, and intercompany balances", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "VaR models, exposure netting optimization, hedge effectiveness analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Market event interpretation, P&L impact assessment, hedge recommendation narrative", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Exposure Aggregation & Netting", description: "Aggregate FX exposures from treasury positions, AR, AP, and intercompany balances across all entities. Net offsetting positions within currency pairs to calculate true net exposure by tenor.", systems: ["Kyriba", "SAP S/4HANA FI"], layer: "integration", dataIn: "Entity-level FX positions and forecasted cash flows", dataOut: "Net FX exposure by currency pair and time horizon" },
    { label: "VaR & Scenario Modeling", description: "Calculate Value-at-Risk using historical simulation and Monte Carlo methods. Run scenario analysis for rate movements of 1%, 3%, 5% across major currency pairs. Measure hedge effectiveness per IFRS 9 requirements.", systems: ["BigQuery", "Bloomberg"], layer: "ml", dataIn: "Net exposures + market rates + volatility data", dataOut: "VaR report, scenario impact matrix, hedge effectiveness" },
    { label: "Market Event Interpretation", description: "Gemini interprets market events: 'EUR/USD dropped 2% following ECB rate decision -- net EUR exposure of $45M means $900K P&L impact. Recommend increasing EUR forward cover for Q3 payables.' Synthesizes quantitative impact with strategic recommendation.", systems: ["Vertex AI (Gemini)", "Bloomberg"], layer: "llm", dataIn: "VaR report + market events + current hedge positions", dataOut: "Risk assessment with hedge adjustment recommendations" },
    { label: "Alert & Decision Support", description: "Deliver exposure summary and hedge recommendations to Treasurer. Alert on threshold breaches in real-time. Track hedge execution against recommendations.", systems: ["Kyriba"], layer: "integration", dataIn: "Risk assessment with recommendations", dataOut: "Treasury decision support and alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Treasurer agent for the FX Exposure Monitor workflow",
  primaryObjective: "Real-time exposure netting across all entities and currencies replaces weekly manual aggregation. Gemini interprets market events and calculates P&L impact instantly -- 'ECB decision means $900K exposure on your EUR position.' so the Treasurer can move the FX loss reduction KPI.",
  inScope: [
    "Real-time exposure netting across all entities and currencies replaces weekly manual aggregation",
    "Gemini interprets market events and calculates P&L impact instantly -- 'ECB decision means $900K exposure on your EUR position.'",
    "Proactive hedge recommendations based on forward exposure reduce annual FX losses by $3M+",
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
      description: "Retrieve cash positions from Kyriba for the FX Exposure Monitor workflow.",
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
      name: "query_bloomberg_bloomberg_records",
      kind: "query",
      sourceSystemId: "bloomberg",
      description: "Retrieve bloomberg records from Bloomberg for the FX Exposure Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "bloomberg_records_records",
        "bloomberg_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the FX Exposure Monitor workflow.",
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
      description: "Retrieve analytics events from BigQuery for the FX Exposure Monitor workflow.",
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
      name: "lookup_fx_exposure_monitor_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the FX Exposure Monitor Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_kyriba_recommend",
      kind: "action",
      sourceSystemId: "kyriba",
      description: "Execute the recommend step in Kyriba after the agent has gathered evidence and validated escalation gates.",
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
      claim: "FX loss reduction moved from $4.2M/year toward $1.1M/year",
      mustCite: [
        "kyriba.cash_positions",
        "bloomberg.bloomberg_records",
      ],
      sourceSystemIds: [
        "kyriba",
        "bloomberg",
      ],
    },
    {
      claim: "Exposure visibility moved from Weekly manual toward Real-time automated",
      mustCite: [
        "kyriba.cash_positions",
        "bloomberg.bloomberg_records",
      ],
      sourceSystemIds: [
        "kyriba",
        "bloomberg",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "FX loss reduction regresses past the $4.2M/year baseline by more than 20%",
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
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
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
      id: "fx-exposure-monitor-end-to-end",
      prompt: "Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_kyriba_cash_positions",
        "query_bloomberg_bloomberg_records",
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "lookup_fx_exposure_monitor_controls_playbook",
        "action_kyriba_recommend",
      ],
      mustReferenceEntities: [
        "cash_positions",
        "bloomberg_records",
        "gl_entries",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "fx-exposure-monitor-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Kyriba, with audit-trail entry and Treasurer notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for FX Exposure Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "bloomberg",
      name: "Bloomberg",
      owns: [
        "bloomberg_records",
        "bloomberg_events",
        "bloomberg_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_bloomberg_bloomberg_records",
        "query_bloomberg_bloomberg_events",
        "query_bloomberg_bloomberg_audit_trail",
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
      name: "bloomberg_records",
      sourceSystemId: "bloomberg",
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
      name: "bloomberg_events",
      sourceSystemId: "bloomberg",
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
          name: "bloomberg_record_id",
          type: "ref",
          ref: "bloomberg_records.id",
          required: true,
        },
      ],
    },
    {
      name: "bloomberg_audit_trail",
      sourceSystemId: "bloomberg",
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
      from: "bloomberg_events.bloomberg_record_id",
      to: "bloomberg_records.id",
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
      id: "fx-exposure-monitor-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "FX Exposure Monitor Controls Playbook",
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
      id: "kyriba_recommend_api",
      sourceSystemId: "kyriba",
      method: "POST",
      path: "/api/kyriba/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Kyriba after evidence gating.",
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
      id: "fx-exposure-monitor-baseline-gap",
      description: "Seed a realistic gap where FX loss reduction sits between $4.2M/year and $1.1M/year, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "cash_positions",
        "bank_transactions",
      ],
      discoveryPath: [
        "Inspect Kyriba records for the affected entities",
        "Compare against Bloomberg historical baseline",
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
      database: "fx_exposure_monitor",
      schemas: [
        "kyriba",
        "bloomberg",
        "sap_s_4hana_fi",
      ],
    },
    bigquery: {
      dataset: "finance_fx_exposure_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "fx-exposure-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "fx-exposure-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the FX Exposure Monitor workflow and cite source-system evidence for every claim.",
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

export const FXExposureMonitor = () => (
  <UseCaseSlide
    title="FX Exposure Monitor"
    subtitle="A-2403 - Treasury & Cash"
    icon={DollarSign}
    domainId="domain-24"
    layer="Layer 3: Custom ADK"
    persona="Treasurer"
    systems={["Kyriba", "Bloomberg", "SAP S/4HANA FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "FX loss reduction", before: "$4.2M/year", after: "$1.1M/year" },
      { label: "Exposure visibility", before: "Weekly manual", after: "Real-time automated" },
      { label: "Hedge effectiveness", before: "75%", after: "94%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasurer", action: "Approve hedge adjustments", description: "Treasurer reviews FX exposure summary, market context, and hedge recommendations before executing or adjusting hedge positions." }}
    statusQuo={[
      "FX exposure aggregated weekly in Excel from 4+ systems, often missing intercompany positions.",
      "Market events require manual assessment -- Treasurer reads Bloomberg and estimates P&L impact in a spreadsheet.",
      "Hedging decisions made reactively after losses rather than proactively based on forward-looking exposure."
    ]}
    agentification={[
      "Real-time exposure netting across all entities and currencies replaces weekly manual aggregation.",
      "Gemini interprets market events and calculates P&L impact instantly -- 'ECB decision means $900K exposure on your EUR position.'",
      "Proactive hedge recommendations based on forward exposure reduce annual FX losses by $3M+."
    ]}
  />
);
