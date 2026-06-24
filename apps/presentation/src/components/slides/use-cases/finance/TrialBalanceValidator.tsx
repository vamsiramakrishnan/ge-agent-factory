import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileCheck, Database, AlertTriangle, BarChart3, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Close Trigger", lane: "system", type: "trigger" },
    { id: "a1", label: "TB Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Anomaly Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Exception Narratives", lane: "agent", type: "output" },
    { id: "h1", label: "Controller Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "TB Extraction", icon: Database, description: "Extract trial balance from SAP and run cross-validation against sub-ledgers.", trigger: "Pre-close", systems: ["SAP S/4HANA FI", "BlackLine"] },
  { label: "Anomaly Detection", icon: AlertTriangle, description: "Detect unusual balances, sign changes, and large period-over-period movements.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Narrative Generation", icon: BarChart3, description: "Generate exception narratives explaining the likely cause of each anomaly.", systems: ["Vertex AI"] },
  { label: "Validation Report", icon: FileText, description: "Deliver validation report with exception flags for Controller review.", output: "TB Validation" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Trial balance, GL account details, sub-ledger totals", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BlackLine", description: "Reconciliation status, account certification, prior-period comparisons", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical balance patterns, anomaly detection models, threshold data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Exception narrative generation, anomaly explanation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Trial Balance Extraction", description: "Extract full trial balance from SAP, cross-validate against sub-ledger totals (AP, AR, FA, inventory). Flag any out-of-balance conditions.", systems: ["SAP S/4HANA FI", "BlackLine"], layer: "integration", dataIn: "GL trial balance + sub-ledger totals", dataOut: "Cross-validated TB with balance checks" },
    { label: "Anomaly Detection", description: "Apply anomaly detection on account balances — unusual amounts, sign changes, large period-over-period movements. Compare against historical balance patterns and thresholds.", systems: ["BigQuery"], layer: "ml", dataIn: "TB data + historical patterns", dataOut: "Anomaly flags with severity scores" },
    { label: "Exception Narratives", description: "Gemini generates exception narratives explaining the likely cause of each flagged anomaly based on recent transactions and known events.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomaly flags + recent transaction context", dataOut: "Exception narratives with explanations" },
    { label: "Report Delivery", description: "Deliver TB validation report to Controller with exception flags, severity ranking, and suggested actions for each anomaly.", systems: ["BlackLine", "Email"], layer: "integration", dataIn: "Exception report", dataOut: "TB validation report for review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Controller agent for the Trial Balance Validator workflow",
  primaryObjective: "Automated cross-validation against all sub-ledgers with immediate out-of-balance detection. Statistical anomaly detection catches unusual balances that manual scanning misses. so the Controller can move the TB validation time KPI.",
  inScope: [
    "Automated cross-validation against all sub-ledgers with immediate out-of-balance detection",
    "Statistical anomaly detection catches unusual balances that manual scanning misses",
    "Exception narratives explain likely causes, reducing investigation time for each anomaly",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Trial Balance Validator workflow.",
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
      description: "Retrieve reconciliations from BlackLine for the Trial Balance Validator workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Trial Balance Validator workflow.",
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
      name: "lookup_trial_balance_validator_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Trial Balance Validator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "TB validation time moved from 1 day manual toward 30 minutes",
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
      claim: "Anomalies caught pre-close moved from 50% toward 98%",
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
      trigger: "TB validation time regresses past the 1 day manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Controller",
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
    "Never bypass Controller approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "trial-balance-validator-end-to-end",
      prompt: "Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_blackline_reconciliations",
        "query_bigquery_analytics_events",
        "lookup_trial_balance_validator_controls_playbook",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "reconciliations",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "trial-balance-validator-controls-playbook",
      ],
      expectedActionOutcome: "Controller receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Trial Balance Validator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "trial-balance-validator-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Trial Balance Validator Controls Playbook",
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
      id: "trial-balance-validator-baseline-gap",
      description: "Seed a realistic gap where TB validation time sits between 1 day manual and 30 minutes, so the agent can detect, narrate, and recommend remediation.",
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
      database: "trial_balance_validator",
      schemas: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    bigquery: {
      dataset: "finance_trial_balance_validator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "trial-balance-validator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "trial-balance-validator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Trial Balance Validator workflow and cite source-system evidence for every claim.",
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

export const TrialBalanceValidator = () => (
  <UseCaseSlide
    title="Trial Balance Validator"
    subtitle="A-2106 • GL & Close"
    icon={FileCheck}
    domainId="domain-21"
    layer="Layer 4: Data Agent"
    persona="Controller"
    systems={["SAP S/4HANA FI", "BlackLine", "BigQuery"]}
    kpis={[
      { label: "TB validation time", before: "1 day manual", after: "30 minutes" },
      { label: "Anomalies caught pre-close", before: "50%", after: "98%" },
      { label: "Sub-ledger reconciliation breaks", before: "Discovered at close", after: "Flagged pre-close" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Controller", action: "Review TB exceptions", description: "Controller reviews flagged trial balance anomalies and exception narratives, determining which require correcting entries before close." }}
    statusQuo={[
      "Trial balance reviewed manually by scanning columns for unusual balances — time-consuming and error-prone.",
      "Sub-ledger out-of-balance conditions discovered during close, causing delays.",
      "Period-over-period movement analysis done ad-hoc without statistical rigor."
    ]}
    agentification={[
      "Automated cross-validation against all sub-ledgers with immediate out-of-balance detection.",
      "Statistical anomaly detection catches unusual balances that manual scanning misses.",
      "Exception narratives explain likely causes, reducing investigation time for each anomaly."
    ]}
  />
);
