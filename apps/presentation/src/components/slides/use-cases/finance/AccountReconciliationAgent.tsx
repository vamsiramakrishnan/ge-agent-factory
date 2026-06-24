import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { CheckSquare, Database, FileText, Search, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Close", lane: "system", type: "trigger" },
    { id: "a1", label: "Balance Pull", lane: "agent", type: "action" },
    { id: "a2", label: "Auto-Matching", lane: "agent", type: "action" },
    { id: "a3", label: "Contract Validation", lane: "agent", type: "action" },
    { id: "a4", label: "Workpapers", lane: "agent", type: "output" },
    { id: "h1", label: "Controller Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Balance Extraction", icon: Database, description: "Pull GL balances and sub-ledger details for reconciliation.", trigger: "Monthly close", systems: ["SAP S/4HANA FI", "BlackLine"] },
  { label: "Auto-Matching", icon: CheckSquare, description: "Match transactions against supporting documentation with risk-based prioritization.", systems: ["BlackLine", "BigQuery"], integration: "ADK" },
  { label: "Complex Validation", icon: Search, description: "For complex accounts (prepaids, accrued liabilities), read contracts and invoices to validate balances.", systems: ["Vertex AI"] },
  { label: "Controller Review", icon: CheckCircle, description: "Controller reviews material account reconciliations with exception flags.", output: "Reconciliation Workpapers" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "GL balances, sub-ledger details, supporting transactions", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BlackLine", description: "Reconciliation templates, matching rules, certification workflows", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical reconciliation patterns, risk scoring data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Contract interpretation, complex account validation, catch-up entry generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Balance & Document Pull", description: "Pull GL balances and sub-ledger details from SAP. Match against supporting documentation from BlackLine reconciliation templates.", systems: ["SAP S/4HANA FI", "BlackLine"], layer: "integration", dataIn: "GL balances + sub-ledger data", dataOut: "Account data with supporting docs" },
    { label: "Auto-Matching & Risk Scoring", description: "Auto-match transactions, score balance sheet substantiation quality, and risk-rank accounts for review prioritization. Low-risk accounts auto-certified.", systems: ["BlackLine", "BigQuery"], layer: "ml", dataIn: "Account data + historical patterns", dataOut: "Auto-matched accounts + risk-ranked exceptions" },
    { label: "Complex Account Validation", description: "For complex reconciliations (prepaid expenses, accrued liabilities), Gemini reads supporting contracts and invoices to validate balances and generate catch-up entries for missed amortization.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Complex account balances + contracts + invoices", dataOut: "Validated balances + catch-up entries" },
    { label: "Workpaper Generation", description: "Generate reconciliation workpapers with auto-certification for standard accounts and exception flags for Controller review on material accounts.", systems: ["BlackLine", "Email"], layer: "integration", dataIn: "Validated reconciliations", dataOut: "Completed workpapers for review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Controller agent for the Account Reconciliation Agent workflow",
  primaryObjective: "Auto-matching and risk-based prioritization certifies 85% of accounts without manual review. Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close. so the Controller can move the Auto-certified accounts KPI.",
  inScope: [
    "Auto-matching and risk-based prioritization certifies 85% of accounts without manual review",
    "Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close",
    "Controller time focused on the 15% of material accounts that genuinely need judgment",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Account Reconciliation Agent workflow.",
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
      name: "query_blackline_reconciliations",
      kind: "query",
      sourceSystemId: "blackline",
      description: "Retrieve reconciliations from BlackLine for the Account Reconciliation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "reconciliations_records",
        "reconciliations_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Account Reconciliation Agent workflow.",
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
      name: "lookup_account_reconciliation_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Account Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_close",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the close step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Auto-certified accounts moved from 20% toward 85%",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "blackline.reconciliations",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    {
      claim: "Reconciliation cycle moved from 5 days toward 1 day",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "blackline.reconciliations",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Auto-certified accounts regresses past the 20% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Controller",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed close action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass Controller approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "account-reconciliation-agent-end-to-end",
      prompt: "Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_blackline_reconciliations",
        "query_bigquery_analytics_events",
        "lookup_account_reconciliation_agent_controls_playbook",
        "action_sap_s_4hana_fi_close",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "reconciliations",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "account-reconciliation-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action close executed against SAP S/4HANA FI, with audit-trail entry and Controller notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute close without two-system evidence",
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
    rationale: "Row counts sized for Account Reconciliation Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "blackline",
      name: "BlackLine",
      owns: [
        "reconciliations",
        "matching_rules",
        "certifications",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_blackline_reconciliations",
        "query_blackline_matching_rules",
        "query_blackline_certifications",
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
      name: "reconciliations",
      sourceSystemId: "blackline",
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
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "matching_rules",
      sourceSystemId: "blackline",
      datastore: "alloydb",
      rowCount: 30,
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
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "certifications",
      sourceSystemId: "blackline",
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
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
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
      id: "account-reconciliation-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Account Reconciliation Agent Controls Playbook",
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
      id: "sap_s_4hana_fi_close_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/close",
      description: "Synchronous endpoint the agent calls to close in SAP S/4HANA FI after evidence gating.",
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
      id: "account-reconciliation-agent-baseline-gap",
      description: "Seed a realistic gap where Auto-certified accounts sits between 20% and 85%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against BlackLine historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Controller action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "account_reconciliation_agent",
      schemas: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    bigquery: {
      dataset: "finance_account_reconciliation_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "account-reconciliation-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "account-reconciliation-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Account Reconciliation Agent workflow and cite source-system evidence for every claim.",
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

export const AccountReconciliationAgent = () => (
  <UseCaseSlide
    title="Account Reconciliation Agent"
    subtitle="A-2103 • GL & Close"
    icon={CheckSquare}
    domainId="domain-21"
    layer="Layer 3: Custom ADK"
    persona="Controller"
    systems={["SAP S/4HANA FI", "BlackLine", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Auto-certified accounts", before: "20%", after: "85%" },
      { label: "Reconciliation cycle", before: "5 days", after: "1 day" },
      { label: "Missed amortization", before: "Discovered at audit", after: "Caught at close" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Controller", action: "Review material reconciliations", description: "Controller reviews reconciliation workpapers for material accounts, validates complex account balances, and approves catch-up entries." }}
    statusQuo={[
      "Accountants manually review 30+ reconciliation workpapers each close — most are routine.",
      "Complex accounts like prepaids require manual contract review to validate amortization schedules.",
      "Missed amortization errors often discovered at year-end audit, requiring restatement risk."
    ]}
    agentification={[
      "Auto-matching and risk-based prioritization certifies 85% of accounts without manual review.",
      "Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close.",
      "Controller time focused on the 15% of material accounts that genuinely need judgment."
    ]}
  />
);
