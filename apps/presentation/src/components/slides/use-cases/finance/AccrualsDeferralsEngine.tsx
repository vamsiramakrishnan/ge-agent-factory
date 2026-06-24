import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Clock, Database, Search, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Month-End", lane: "system", type: "trigger" },
    { id: "a1", label: "Accrual Identification", lane: "agent", type: "action" },
    { id: "a2", label: "Contract Reading", lane: "agent", type: "action" },
    { id: "a3", label: "Entry Posting", lane: "agent", type: "output" },
    { id: "h1", label: "Accountant Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Scan", icon: Database, description: "Identify transactions requiring accrual or deferral treatment.", trigger: "Month-end", systems: ["SAP S/4HANA FI", "BlackLine"] },
  { label: "Contract Interpretation", icon: Search, description: "Read contracts and POs to determine accrual amounts when invoices haven't arrived.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Entry Calculation", icon: FileText, description: "Calculate accrual/deferral amounts with auto-reversal scheduling.", systems: ["BigQuery"] },
  { label: "Posting & Reversal", icon: CheckCircle, description: "Post entries and schedule automatic reversals in the subsequent period.", output: "Accrual Entries" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Open POs, goods receipts, uninvoiced receipts, GL postings", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "BlackLine", description: "Accrual templates, historical accrual accuracy, reconciliation", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical accrual patterns, estimation models, accuracy tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Contract and PO interpretation for accrual amount determination", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Accrual Identification", description: "Scan open POs, goods receipts without invoices, and service contracts to identify transactions requiring accrual or deferral treatment at month-end.", systems: ["SAP S/4HANA FI", "BlackLine"], layer: "integration", dataIn: "Open POs + GRs + service contracts", dataOut: "Accrual candidates list" },
    { label: "Pattern Recognition & Estimation", description: "Apply historical accuracy models to recurring accruals. Flag items where past estimates had significant variance for enhanced review.", systems: ["BigQuery"], layer: "ml", dataIn: "Accrual candidates + historical accuracy", dataOut: "Estimated accrual amounts with confidence" },
    { label: "Contract-Based Accrual Calculation", description: "Gemini reads contracts and POs to determine accrual amounts for non-routine items. Applies contract terms like early payment discounts and volume adjustments.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Non-routine items + contracts + POs", dataOut: "Contract-validated accrual amounts" },
    { label: "Posting & Auto-Reversal", description: "Post accrual/deferral entries to SAP with auto-reversal scheduled for Day 1 of the subsequent period. Generate audit trail with calculation basis.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Validated accrual entries", dataOut: "Posted entries + reversal schedule" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "GL Accountant agent for the Accruals & Deferrals Engine workflow",
  primaryObjective: "Automated identification of all transactions requiring accrual/deferral treatment. Gemini reads contracts and POs to determine precise accrual amounts including discount terms. so the GL Accountant can move the Accrual accuracy KPI.",
  inScope: [
    "Automated identification of all transactions requiring accrual/deferral treatment",
    "Gemini reads contracts and POs to determine precise accrual amounts including discount terms",
    "Auto-reversal scheduling eliminates manual reversal errors entirely",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Accruals & Deferrals Engine workflow.",
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
      description: "Retrieve reconciliations from BlackLine for the Accruals & Deferrals Engine workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Accruals & Deferrals Engine workflow.",
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
      name: "lookup_accruals_deferrals_engine_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Accruals & Deferrals Engine Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Accrual accuracy moved from 85% within 10% toward 97% within 5%",
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
      claim: "Manual accrual entries moved from 40+ per close toward 5 exceptions",
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
      trigger: "Accrual accuracy regresses past the 85% within 10% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "GL Accountant",
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
    "Never bypass GL Accountant approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "accruals-deferrals-engine-end-to-end",
      prompt: "Run the Accruals & Deferrals Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_blackline_reconciliations",
        "query_bigquery_analytics_events",
        "lookup_accruals_deferrals_engine_controls_playbook",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "reconciliations",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "accruals-deferrals-engine-controls-playbook",
      ],
      expectedActionOutcome: "GL Accountant receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Accruals & Deferrals Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "accruals-deferrals-engine-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Accruals & Deferrals Engine Controls Playbook",
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
      id: "accruals-deferrals-engine-baseline-gap",
      description: "Seed a realistic gap where Accrual accuracy sits between 85% within 10% and 97% within 5%, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next GL Accountant action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "accruals_deferrals_engine",
      schemas: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    bigquery: {
      dataset: "finance_accruals_deferrals_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "accruals-deferrals-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "accruals-deferrals-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Accruals & Deferrals Engine workflow and cite source-system evidence for every claim.",
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

export const AccrualsDeferralsEngine = () => (
  <UseCaseSlide
    title="Accruals & Deferrals Engine"
    subtitle="A-2105 • GL & Close"
    icon={Clock}
    domainId="domain-21"
    layer="Layer 3: Custom ADK"
    persona="GL Accountant"
    systems={["SAP S/4HANA FI", "BlackLine", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Accrual accuracy", before: "85% within 10%", after: "97% within 5%" },
      { label: "Manual accrual entries", before: "40+ per close", after: "5 exceptions" },
      { label: "Reversal errors", before: "3-5 per quarter", after: "Zero" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "GL Accountant", action: "Review non-routine accruals", description: "GL Accountant reviews accrual entries for non-routine items where contract interpretation was required, validating amounts before posting." }}
    statusQuo={[
      "Accountants manually identify and calculate 40+ accrual entries each close from POs and contracts.",
      "Accrual amounts for uninvoiced receipts estimated from memory or incomplete PO data.",
      "Manual reversals occasionally missed, creating double-counting in subsequent periods."
    ]}
    agentification={[
      "Automated identification of all transactions requiring accrual/deferral treatment.",
      "Gemini reads contracts and POs to determine precise accrual amounts including discount terms.",
      "Auto-reversal scheduling eliminates manual reversal errors entirely."
    ]}
  />
);
