import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Percent, Database, Calculator, FileText, DollarSign } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Eligibility Check", lane: "agent", type: "action" },
    { id: "a2", label: "APR Calculation", lane: "agent", type: "action" },
    { id: "a3", label: "Opportunity Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Invoice Scan", icon: Database, description: "Identify invoices eligible for early payment discounts from open AP.", trigger: "Daily", systems: ["SAP S/4HANA FI", "Taulia"] },
  { label: "Net Benefit Analysis", icon: Calculator, description: "Calculate discount APR, compare against WACC, and check cash availability.", systems: ["BigQuery", "C2FO"], integration: "ADK" },
  { label: "Opportunity Report", icon: FileText, description: "Generate opportunity report with total savings and recommended threshold.", systems: ["Vertex AI"] },
  { label: "Execution", icon: DollarSign, description: "Auto-execute discounts above threshold or deliver report for manual decision.", output: "Discount Capture" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Open invoices, payment terms, discount windows, vendor data", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Taulia", description: "Dynamic discounting platform, supplier participation data", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "C2FO", description: "Working capital marketplace, discount auction data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Cost of capital data, discount analytics, capture rate history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Opportunity report generation, threshold recommendation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Discount Eligibility Scan", description: "Scan all open invoices in SAP for early payment discount windows. Pull dynamic discounting opportunities from Taulia and C2FO marketplace.", systems: ["SAP S/4HANA FI", "Taulia", "C2FO"], layer: "integration", dataIn: "Open AP with payment terms", dataOut: "Eligible discount opportunities" },
    { label: "APR & Cash Analysis", description: "Calculate annualized return (APR) for each discount opportunity. Compare against company WACC and check cash availability to ensure liquidity isn't compromised.", systems: ["BigQuery"], layer: "ml", dataIn: "Discount opportunities + cash position + WACC", dataOut: "Ranked opportunities with net benefit" },
    { label: "Opportunity Reporting", description: "Gemini generates opportunity report summarizing total available discounts, annualized return, and recommended capture threshold. Highlights the most cost-effective opportunities.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Ranked opportunities + cash context", dataOut: "Opportunity report with recommendations" },
    { label: "Execution", description: "Auto-execute early payments for discounts above the approved APR threshold. Record captured savings and update discount capture rate metrics.", systems: ["SAP S/4HANA FI", "Taulia"], layer: "integration", dataIn: "Approved discount captures", dataOut: "Executed payments + savings record" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AP Manager / Treasurer agent for the Early Payment Discount Agent workflow",
  primaryObjective: "Daily scan identifies all discount-eligible invoices with annualized return calculation. Only captures discounts where APR exceeds WACC — ensures every early payment creates value. so the AP Manager / Treasurer can move the Discount capture rate KPI.",
  inScope: [
    "Daily scan identifies all discount-eligible invoices with annualized return calculation",
    "Only captures discounts where APR exceeds WACC — ensures every early payment creates value",
    "Generates opportunity reports showing total available savings and recommended capture threshold",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Early Payment Discount Agent workflow.",
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
      name: "query_taulia_taulia_records",
      kind: "query",
      sourceSystemId: "taulia",
      description: "Retrieve taulia records from Taulia for the Early Payment Discount Agent workflow.",
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
      name: "query_c2fo_c2fo_records",
      kind: "query",
      sourceSystemId: "c2fo",
      description: "Retrieve c2fo records from C2FO for the Early Payment Discount Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "c2fo_records_records",
        "c2fo_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Early Payment Discount Agent workflow.",
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
      name: "lookup_early_payment_discount_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Early Payment Discount Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Discount capture rate moved from 30% toward 90%+",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "taulia.taulia_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "taulia",
      ],
    },
    {
      claim: "Annualized return moved from Not tracked toward 18%+ on captured",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "taulia.taulia_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "taulia",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Discount capture rate regresses past the 30% baseline by more than 20%",
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
      id: "early-payment-discount-agent-end-to-end",
      prompt: "Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_taulia_taulia_records",
        "query_c2fo_c2fo_records",
        "query_bigquery_analytics_events",
        "lookup_early_payment_discount_agent_controls_playbook",
        "action_sap_s_4hana_fi_recommend",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "taulia_records",
        "c2fo_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "early-payment-discount-agent-controls-playbook",
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
    rationale: "Row counts sized for Early Payment Discount Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "c2fo",
      name: "C2FO",
      owns: [
        "c2fo_records",
        "c2fo_events",
        "c2fo_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_c2fo_c2fo_records",
        "query_c2fo_c2fo_events",
        "query_c2fo_c2fo_audit_trail",
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
      name: "c2fo_records",
      sourceSystemId: "c2fo",
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
      name: "c2fo_events",
      sourceSystemId: "c2fo",
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
          name: "c2fo_record_id",
          type: "ref",
          ref: "c2fo_records.id",
          required: true,
        },
      ],
    },
    {
      name: "c2fo_audit_trail",
      sourceSystemId: "c2fo",
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
      from: "c2fo_events.c2fo_record_id",
      to: "c2fo_records.id",
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
      id: "early-payment-discount-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Early Payment Discount Agent Controls Playbook",
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
      id: "early-payment-discount-agent-baseline-gap",
      description: "Seed a realistic gap where Discount capture rate sits between 30% and 90%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Taulia historical baseline",
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
      database: "early_payment_discount_agent",
      schemas: [
        "sap_s_4hana_fi",
        "taulia",
        "c2fo",
      ],
    },
    bigquery: {
      dataset: "finance_early_payment_discount_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "early-payment-discount-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "early-payment-discount-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Early Payment Discount Agent workflow and cite source-system evidence for every claim.",
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

export const EarlyPaymentDiscountAgent = () => (
  <UseCaseSlide
    title="Early Payment Discount Agent"
    subtitle="A-2206 • Accounts Payable"
    icon={Percent}
    domainId="domain-22"
    layer="Layer 4: Data Agent"
    persona="AP Manager / Treasurer"
    systems={["SAP S/4HANA FI", "Taulia", "C2FO", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Discount capture rate", before: "30%", after: "90%+" },
      { label: "Annualized return", before: "Not tracked", after: "18%+ on captured" },
      { label: "Missed discounts", before: "$500K+/year", after: "< $50K/year" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Early payment discounts missed because AP processes invoices without checking discount windows.",
      "No comparison between discount APR and company cost of capital — all discounts treated equally.",
      "Discount capture is opportunistic rather than systematic — no daily identification process."
    ]}
    agentification={[
      "Daily scan identifies all discount-eligible invoices with annualized return calculation.",
      "Only captures discounts where APR exceeds WACC — ensures every early payment creates value.",
      "Generates opportunity reports showing total available savings and recommended capture threshold."
    ]}
  />
);
