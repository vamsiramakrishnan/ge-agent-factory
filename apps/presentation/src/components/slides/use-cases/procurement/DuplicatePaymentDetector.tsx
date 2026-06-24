import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { CopyMinus, Database, Search, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Payment Run", lane: "system", type: "trigger" },
    { id: "a1", label: "ML Clustering", lane: "agent", type: "action" },
    { id: "a2", label: "LLM Adjudication", lane: "agent", type: "action" },
    { id: "a3", label: "Flagged Results", lane: "agent", type: "output" },
    { id: "h1", label: "AP Manager Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Payment Scan", icon: Database, description: "Pre-payment run scan clusters invoices by amount, date, vendor, and invoice number patterns.", trigger: "Scheduled", systems: ["SAP S/4HANA FI", "BigQuery"] },
  { label: "ML Clustering", icon: Search, description: "Fuzzy matching across time windows and legal entities with statistical duplicate probability scoring.", systems: ["BigQuery"], integration: "ADK" },
  { label: "LLM Adjudication", icon: Brain, description: "LLM reads line item descriptions and delivery references to distinguish true duplicates from legitimate similar invoices.", systems: ["Vertex AI"] },
  { label: "AP Manager Decides", icon: CheckCircle, description: "Flagged payments held with confidence scores and evidence for AP Manager disposition.", output: "Clean Payment Run" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Invoice and payment data, payment proposal runs, payment hold/release", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa Pay", description: "Invoice records, payment status, duplicate flag integration", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical invoice clustering, fuzzy match scoring models, audit trail logging", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "LLM adjudication — reads line item descriptions to distinguish true duplicates from legitimate similar invoices", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Pre-Payment Scan", description: "Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities.", systems: ["SAP S/4HANA FI", "Coupa Pay"], layer: "integration", dataIn: "Pending payment proposal with invoice details", dataOut: "Invoice clusters grouped by similarity features" },
    { label: "ML Clustering & Probability Scoring", description: "Fuzzy matching across invoice features with statistical duplicate probability scoring. Detect patterns including same vendor/similar amount across time windows and across legal entities. Score each cluster with duplicate probability.", systems: ["BigQuery"], layer: "ml", dataIn: "Invoice clusters with similarity features", dataOut: "Scored potential duplicates with confidence levels" },
    { label: "LLM Adjudication", description: "For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Potential duplicates with line item descriptions", dataOut: "Adjudicated duplicate flags with reasoning evidence" },
    { label: "Hold & Escalation", description: "Hold flagged payments in ERP. Present confidence scores, line item comparisons, and agent reasoning to AP Manager for final disposition. Log all decisions for audit trail.", systems: ["SAP S/4HANA FI", "BigQuery"], layer: "integration", dataIn: "Adjudicated duplicate flags", dataOut: "Held payments with evidence for AP Manager review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AP Manager agent for the Duplicate Payment Detector workflow",
  primaryObjective: "ML clustering identifies duplicate patterns across time windows, legal entities, and invoice number variations. LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or separate deliveries. so the AP Manager can move the Duplicate detection rate KPI.",
  inScope: [
    "ML clustering identifies duplicate patterns across time windows, legal entities, and invoice number variations",
    "LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or separate deliveries",
    "Detects sophisticated patterns — same work submitted under different invoice numbers with altered descriptions to circumvent basic checks",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Duplicate Payment Detector workflow.",
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
      name: "query_coupa_pay_requisitions",
      kind: "query",
      sourceSystemId: "coupa_pay",
      description: "Retrieve requisitions from Coupa Pay for the Duplicate Payment Detector workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "requisitions_records",
        "requisitions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Duplicate Payment Detector workflow.",
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
      name: "lookup_duplicate_payment_detector_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Duplicate Payment Detector Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_submit",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the submit step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Duplicate detection rate moved from 60% caught toward 98% caught",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "coupa_pay.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "coupa_pay",
      ],
    },
    {
      claim: "False positive rate moved from 40% of flags toward <8% of flags",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "coupa_pay.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "coupa_pay",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Duplicate detection rate regresses past the 60% caught baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AP Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed submit action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass AP Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "duplicate-payment-detector-end-to-end",
      prompt: "Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_coupa_pay_requisitions",
        "query_bigquery_analytics_events",
        "lookup_duplicate_payment_detector_policy_guide",
        "action_sap_s_4hana_fi_submit",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "requisitions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "duplicate-payment-detector-policy-guide",
      ],
      expectedActionOutcome: "Action submit executed against SAP S/4HANA FI, with audit-trail entry and AP Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute submit without two-system evidence",
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
    rationale: "Row counts sized for Duplicate Payment Detector so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "coupa_pay",
      name: "Coupa Pay",
      owns: [
        "requisitions",
        "purchase_orders",
        "invoices",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_pay_requisitions",
        "query_coupa_pay_purchase_orders",
        "query_coupa_pay_invoices",
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
      name: "requisitions",
      sourceSystemId: "coupa_pay",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "purchase_orders",
      sourceSystemId: "coupa_pay",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "invoices",
      sourceSystemId: "coupa_pay",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
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
      id: "duplicate-payment-detector-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Duplicate Payment Detector Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [
    {
      id: "sap_s_4hana_fi_submit_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/submit",
      description: "Synchronous endpoint the agent calls to submit in SAP S/4HANA FI after evidence gating.",
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
      id: "duplicate-payment-detector-baseline-gap",
      description: "Seed a realistic gap where Duplicate detection rate sits between 60% caught and 98% caught, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Coupa Pay historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AP Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "duplicate_payment_detector",
      schemas: [
        "sap_s_4hana_fi",
        "coupa_pay",
      ],
    },
    bigquery: {
      dataset: "procurement_duplicate_payment_detector",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "duplicate-payment-detector-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "duplicate-payment-detector-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Duplicate Payment Detector workflow and cite source-system evidence for every claim.",
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

export const DuplicatePaymentDetector = () => (
  <UseCaseSlide
    title="Duplicate Payment Detector"
    subtitle="A-1505 • Procure-to-Pay"
    icon={CopyMinus}
    domainId="domain-15"
    layer="Layer 4: Data Agent"
    persona="AP Manager"
    systems={["SAP S/4HANA FI", "Coupa Pay", "BigQuery"]}
    kpis={[
      { label: "Duplicate detection rate", before: "60% caught", after: "98% caught" },
      { label: "False positive rate", before: "40% of flags", after: "<8% of flags" },
      { label: "Annual recovery", before: "$200K", after: "$1.2M" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AP Manager", action: "Adjudicate flagged duplicates", description: "AP Manager reviews flagged potential duplicates with confidence scores, line item comparison, and agent reasoning before releasing or blocking payments." }}
    statusQuo={[
      "Basic exact-match detection catches only obvious duplicates — same invoice number, same amount.",
      "Two invoices from same vendor for $47,500 one week apart: no way to know if duplicate or two deliveries without calling the vendor.",
      "Sophisticated duplicates with slightly different descriptions pass undetected, costing $500K+ annually."
    ]}
    agentification={[
      "ML clustering identifies duplicate patterns across time windows, legal entities, and invoice number variations.",
      "LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or separate deliveries.",
      "Detects sophisticated patterns — same work submitted under different invoice numbers with altered descriptions to circumvent basic checks."
    ]}
  />
);
