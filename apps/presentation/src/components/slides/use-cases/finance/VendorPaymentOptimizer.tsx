import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Wallet, Database, Calculator, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Payment Run", lane: "system", type: "trigger" },
    { id: "a1", label: "Payment Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Cash Optimization", lane: "agent", type: "action" },
    { id: "a3", label: "Payment Recommendation", lane: "agent", type: "output" },
    { id: "h1", label: "Treasury Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Payment Queue", icon: Database, description: "Pull pending payments and current cash position from treasury.", trigger: "Pre-payment run", systems: ["SAP S/4HANA FI", "Kyriba"] },
  { label: "Optimization Engine", icon: Calculator, description: "Optimize payment timing against DPO targets, dynamic discounting, and cash availability.", systems: ["BigQuery", "Taulia"], integration: "ADK" },
  { label: "Edge Case Analysis", icon: FileText, description: "Evaluate complex discount scenarios — early payment vs. supply chain finance cost-effectiveness.", systems: ["Vertex AI"] },
  { label: "Treasury Review", icon: CheckCircle, description: "Treasury reviews optimized payment batch and approves execution.", output: "Payment Batch" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI (F110)", description: "Pending payments, vendor payment terms, payment history", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Kyriba", description: "Cash positions, bank balances, liquidity forecast", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Taulia", description: "Dynamic discounting rates, supply chain finance programs", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Working capital analytics, DPO optimization models", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Complex discount scenario evaluation, treasury briefing generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Payment & Cash Aggregation", description: "Pull all pending payments from SAP payment run (F110), current cash positions from Kyriba, and dynamic discounting opportunities from Taulia.", systems: ["SAP S/4HANA FI", "Kyriba", "Taulia"], layer: "integration", dataIn: "Pending invoices + cash positions + discount terms", dataOut: "Payment candidates with cash context" },
    { label: "Working Capital Optimization", description: "Optimize payment timing to balance DPO targets against discount APR opportunities. Model cash flow impact of different payment strategies with supplier-level segmentation.", systems: ["BigQuery", "Taulia"], layer: "ml", dataIn: "Payment candidates + optimization parameters", dataOut: "Optimized payment schedule with NPV analysis" },
    { label: "Complex Scenario Evaluation", description: "Gemini evaluates edge cases where early payment discounts compete with supply chain finance programs. Compares cost-effectiveness given current cost of capital and generates treasury briefing.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Optimized schedule + complex discount scenarios", dataOut: "Treasury briefing with recommendations" },
    { label: "Batch Submission", description: "Submit optimized payment batch to SAP for execution after Treasury approval. Record discount capture and DPO metrics.", systems: ["SAP S/4HANA FI (F110)"], layer: "integration", dataIn: "Approved payment batch", dataOut: "Executed payments + discount capture report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AP Manager / Treasurer agent for the Vendor Payment Optimizer workflow",
  primaryObjective: "Dynamic payment optimization balances DPO targets against discount APR and cash availability. Gemini evaluates complex scenarios where discounts compete with supply chain finance programs. so the AP Manager / Treasurer can move the Discount capture rate KPI.",
  inScope: [
    "Dynamic payment optimization balances DPO targets against discount APR and cash availability",
    "Gemini evaluates complex scenarios where discounts compete with supply chain finance programs",
    "Treasury receives a briefing with NPV-optimal payment recommendations before each run",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Vendor Payment Optimizer workflow.",
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
      name: "query_kyriba_cash_positions",
      kind: "query",
      sourceSystemId: "kyriba",
      description: "Retrieve cash positions from Kyriba for the Vendor Payment Optimizer workflow.",
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
      name: "query_taulia_taulia_records",
      kind: "query",
      sourceSystemId: "taulia",
      description: "Retrieve taulia records from Taulia for the Vendor Payment Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "taulia_records_records",
        "taulia_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Vendor Payment Optimizer workflow.",
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
      name: "lookup_vendor_payment_optimizer_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Vendor Payment Optimizer Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_recommend",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the recommend step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Discount capture rate moved from 35% toward 92%",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "kyriba.cash_positions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "kyriba",
      ],
    },
    {
      claim: "Working capital freed moved from Baseline toward $5M+ annually",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "kyriba.cash_positions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "kyriba",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Discount capture rate regresses past the 35% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AP Manager / Treasurer",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass AP Manager / Treasurer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "vendor-payment-optimizer-end-to-end",
      prompt: "Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_kyriba_cash_positions",
        "query_taulia_taulia_records",
        "query_bigquery_analytics_events",
        "lookup_vendor_payment_optimizer_controls_playbook",
        "action_sap_s_4hana_fi_recommend",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "cash_positions",
        "taulia_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "vendor-payment-optimizer-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against SAP S/4HANA FI, with audit-trail entry and AP Manager / Treasurer notified of outcomes.",
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
    rationale: "Row counts sized for Vendor Payment Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "taulia",
      name: "Taulia",
      owns: [
        "taulia_records",
        "taulia_events",
        "taulia_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_taulia_taulia_records",
        "query_taulia_taulia_events",
        "query_taulia_taulia_audit_trail",
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
      name: "taulia_records",
      sourceSystemId: "taulia",
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
      name: "taulia_events",
      sourceSystemId: "taulia",
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
          name: "taulia_record_id",
          type: "ref",
          ref: "taulia_records.id",
          required: true,
        },
      ],
    },
    {
      name: "taulia_audit_trail",
      sourceSystemId: "taulia",
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
      from: "taulia_events.taulia_record_id",
      to: "taulia_records.id",
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
      id: "vendor-payment-optimizer-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Vendor Payment Optimizer Controls Playbook",
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
      id: "sap_s_4hana_fi_recommend_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/recommend",
      description: "Synchronous endpoint the agent calls to recommend in SAP S/4HANA FI after evidence gating.",
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
      id: "vendor-payment-optimizer-baseline-gap",
      description: "Seed a realistic gap where Discount capture rate sits between 35% and 92%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Kyriba historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AP Manager / Treasurer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "vendor_payment_optimizer",
      schemas: [
        "sap_s_4hana_fi",
        "kyriba",
        "taulia",
      ],
    },
    bigquery: {
      dataset: "finance_vendor_payment_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "vendor-payment-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "vendor-payment-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Vendor Payment Optimizer workflow and cite source-system evidence for every claim.",
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

export const VendorPaymentOptimizer = () => (
  <UseCaseSlide
    title="Vendor Payment Optimizer"
    subtitle="A-2202 • Accounts Payable"
    icon={Wallet}
    domainId="domain-22"
    layer="Layer 3: Custom ADK"
    persona="AP Manager / Treasurer"
    systems={["SAP S/4HANA FI", "Kyriba", "Taulia", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Discount capture rate", before: "35%", after: "92%" },
      { label: "Working capital freed", before: "Baseline", after: "$5M+ annually" },
      { label: "DPO optimization", before: "Fixed terms", after: "Dynamic by vendor" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasury", action: "Approve payment batch", description: "Treasury reviews optimized payment batch including discount capture recommendations and cash impact before authorizing execution." }}
    statusQuo={[
      "Payment runs executed on fixed schedules without optimization against cash position or discount opportunities.",
      "Early payment discounts missed because AP doesn't have visibility into cash availability.",
      "No comparison between early payment discounts and supply chain finance program costs."
    ]}
    agentification={[
      "Dynamic payment optimization balances DPO targets against discount APR and cash availability.",
      "Gemini evaluates complex scenarios where discounts compete with supply chain finance programs.",
      "Treasury receives a briefing with NPV-optimal payment recommendations before each run."
    ]}
  />
);
