import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Gauge, Database, Cpu, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Position Aggregate", lane: "agent", type: "action" },
    { id: "a2", label: "Ratio Calculation", lane: "agent", type: "action" },
    { id: "a3", label: "Treasury Briefing", lane: "agent", type: "output" },
    { id: "h1", label: "Treasurer Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Global Aggregation", icon: Database, description: "Cash positions aggregated across 45+ accounts in 12+ currencies with real-time bank feeds.", trigger: "Daily / real-time", systems: ["Kyriba"] },
  { label: "Liquidity Analytics", icon: Cpu, description: "Liquidity ratio calculation, currency conversion, cash concentration analysis, and trend visualization.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Briefing Generation", icon: Brain, description: "Gemini generates daily treasury briefing with actionable recommendations -- sweep suggestions, concentration opportunities.", systems: ["Vertex AI"] },
  { label: "Decision Execution", icon: FileText, description: "Treasurer reviews briefing, makes sweep and concentration decisions, and monitors low-balance alerts.", output: "Liquidity Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Kyriba", description: "Global cash positions, bank account balances, sweep execution", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Liquidity analytics, ratio calculations, trend analysis, alert thresholds", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Liquidity dashboards, global cash heat maps, trend visualizations", direction: "write", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Treasury briefing narrative, sweep recommendations, alert contextualization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Cash Position Aggregation", description: "Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intraday positions where available. Convert all balances to reporting currency using current market rates.", systems: ["Kyriba"], layer: "integration", dataIn: "Bank account balances across all relationships", dataOut: "Consolidated global cash position by entity and currency" },
    { label: "Liquidity Analytics", description: "Calculate liquidity ratios, concentration metrics, and trend indicators. Flag accounts below minimum balance thresholds. Identify elevated balances post-quarter that should be swept.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Consolidated positions + threshold configuration", dataOut: "Liquidity metrics, alerts, and trend data" },
    { label: "Treasury Briefing Generation", description: "Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 currencies. EUR balances elevated post-quarter -- recommend sweeping $15M to USD concentration account to fund next week's bond payment.' Actionable, not just informational.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Liquidity metrics + alerts + upcoming obligations", dataOut: "Daily treasury briefing with recommendations" },
    { label: "Dashboard & Alert Delivery", description: "Refresh Looker dashboards with current positions and deliver treasury briefing. Execute approved sweep instructions through TMS.", systems: ["Looker", "Kyriba"], layer: "integration", dataIn: "Briefing + dashboard data", dataOut: "Updated dashboards + executed sweeps" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Treasurer agent for the Liquidity Dashboard workflow",
  primaryObjective: "Real-time cash position aggregation replaces morning manual assembly, providing intraday visibility across 45+ accounts. Gemini generates actionable treasury briefing: not just 'here are the balances' but 'sweep $15M EUR to fund next week's payment.' so the Treasurer can move the Cash visibility KPI.",
  inScope: [
    "Real-time cash position aggregation replaces morning manual assembly, providing intraday visibility across 45+ accounts",
    "Gemini generates actionable treasury briefing: not just 'here are the balances' but 'sweep $15M EUR to fund next week's payment.'",
    "Daily sweep recommendations capture yield on idle cash that quarterly reviews miss, generating $400K+ annual benefit",
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
      description: "Retrieve cash positions from Kyriba for the Liquidity Dashboard workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Liquidity Dashboard workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the Liquidity Dashboard workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dashboards_records",
        "dashboards_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_liquidity_dashboard_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Liquidity Dashboard Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Cash visibility moved from End-of-day, next morning toward Real-time / intraday",
      mustCite: [
        "kyriba.cash_positions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "kyriba",
        "bigquery",
      ],
    },
    {
      claim: "Briefing preparation moved from 45 min manual toward Auto-generated daily",
      mustCite: [
        "kyriba.cash_positions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "kyriba",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Cash visibility regresses past the End-of-day, next morning baseline by more than 20%",
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
      id: "liquidity-dashboard-end-to-end",
      prompt: "Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_kyriba_cash_positions",
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "lookup_liquidity_dashboard_controls_playbook",
        "action_kyriba_recommend",
      ],
      mustReferenceEntities: [
        "cash_positions",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "liquidity-dashboard-controls-playbook",
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
    rationale: "Row counts sized for Liquidity Dashboard so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "looker",
      name: "Looker",
      owns: [
        "dashboards",
        "explore_queries",
        "metric_definitions",
      ],
      protocol: "LookerML",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_looker_dashboards",
        "query_looker_explore_queries",
        "query_looker_metric_definitions",
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
      name: "dashboards",
      sourceSystemId: "looker",
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
      name: "explore_queries",
      sourceSystemId: "looker",
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
      name: "metric_definitions",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
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
      id: "liquidity-dashboard-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Liquidity Dashboard Controls Playbook",
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
      id: "liquidity-dashboard-baseline-gap",
      description: "Seed a realistic gap where Cash visibility sits between End-of-day, next morning and Real-time / intraday, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "cash_positions",
        "bank_transactions",
      ],
      discoveryPath: [
        "Inspect Kyriba records for the affected entities",
        "Compare against BigQuery historical baseline",
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
      database: "liquidity_dashboard",
      schemas: [
        "kyriba",
      ],
    },
    bigquery: {
      dataset: "finance_liquidity_dashboard",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "liquidity-dashboard-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "liquidity-dashboard-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Liquidity Dashboard workflow and cite source-system evidence for every claim.",
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

export const LiquidityDashboard = () => (
  <UseCaseSlide
    title="Liquidity Dashboard"
    subtitle="A-2407 - Treasury & Cash"
    icon={Gauge}
    domainId="domain-24"
    layer="Layer 4: Data Agent"
    persona="Treasurer"
    systems={["Kyriba", "BigQuery", "Looker", "Vertex AI"]}
    kpis={[
      { label: "Cash visibility", before: "End-of-day, next morning", after: "Real-time / intraday" },
      { label: "Briefing preparation", before: "45 min manual", after: "Auto-generated daily" },
      { label: "Idle cash identified", before: "Quarterly review", after: "Daily sweep recommendations" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasurer", action: "Review briefing and act on recommendations", description: "Treasurer reviews daily liquidity briefing, validates sweep recommendations, and acts on low-balance alerts or concentration opportunities." }}
    statusQuo={[
      "Global cash position assembled manually each morning from bank portals and treasury system reports.",
      "Treasurer writes daily briefing by hand, synthesizing positions, upcoming obligations, and market conditions.",
      "Idle cash in regional accounts discovered only during quarterly reviews, missing daily optimization opportunities."
    ]}
    agentification={[
      "Real-time cash position aggregation replaces morning manual assembly, providing intraday visibility across 45+ accounts.",
      "Gemini generates actionable treasury briefing: not just 'here are the balances' but 'sweep $15M EUR to fund next week's payment.'",
      "Daily sweep recommendations capture yield on idle cash that quarterly reviews miss, generating $400K+ annual benefit."
    ]}
  />
);
