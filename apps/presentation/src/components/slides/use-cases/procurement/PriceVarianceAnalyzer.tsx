import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, Database, Activity, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Price Extract", lane: "system", type: "trigger" },
    { id: "a1", label: "Baseline Comparison", lane: "agent", type: "action" },
    { id: "a2", label: "SPC Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Variance Investigation", lane: "agent", type: "action" },
    { id: "a4", label: "Variance Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Price Extraction", icon: Database, description: "PO price history extracted from ERP and compared against contracted baselines.", trigger: "Weekly", systems: ["SAP S/4HANA"] },
  { label: "SPC Detection", icon: Activity, description: "Statistical process control on price trends detects drift, outliers, and off-contract pricing.", systems: ["BigQuery"], integration: "Data Agent" },
  { label: "Context Investigation", icon: Brain, description: "LLM correlates variances with ECNs, spec changes, and contractual index formulas to determine legitimacy.", systems: ["Vertex AI"] },
  { label: "Category Report", icon: FileText, description: "Variance narratives distinguish actionable price creep from legitimate spec-driven increases.", output: "Variance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "PO price history, contract pricing schedules, engineering change notices (ECNs)", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Price trend analytics, SPC models, variance decomposition, off-contract detection", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Variance context investigation, ECN correlation, narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Contract System", description: "Contracted baselines, index adjustment formulas, price escalation clauses", direction: "read", protocol: "REST API", category: "clm" },
  ],
  pipeline: [
    { label: "Price Data Extraction", description: "Extract PO pricing data from ERP and compare against contracted price baselines. Pull engineering change notices and contractual index formulas to provide variance context.", systems: ["SAP S/4HANA", "Contract System"], layer: "integration", dataIn: "PO prices + contracted baselines + ECNs", dataOut: "Price variance dataset with context references" },
    { label: "Statistical Variance Detection", description: "Statistical process control on price trends by category, supplier, and material. Detect drift, outliers, and off-contract pricing. Variance decomposition separates volume, price, and mix effects.", systems: ["BigQuery"], layer: "ml", dataIn: "Price variance dataset", dataOut: "Statistically significant variances with classification" },
    { label: "Context Investigation & Reporting", description: "Gemini investigates price variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN added coating requirement.' Distinguishes actionable supplier price creep from explained adjustments. Generates variance narratives for category managers.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Significant variances + ECN/contract context", dataOut: "Variance report separating actionable vs. explained" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Price Variance Analyzer workflow",
  primaryObjective: "Statistical process control on price trends detects drift and off-contract pricing weekly. LLM investigates variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN-2024-0342 added coating requirement.' so the Category Manager can move the Variance detection speed KPI.",
  inScope: [
    "Statistical process control on price trends detects drift and off-contract pricing weekly",
    "LLM investigates variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN-2024-0342 added coating requirement.'",
    "Generates variance narratives separating supplier price creep from explained adjustments",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Price Variance Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "transactions_records",
        "transactions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Price Variance Analyzer workflow.",
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
      name: "query_procurement_3_procurement_3_records",
      kind: "query",
      sourceSystemId: "procurement_3",
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the Price Variance Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_3_records_records",
        "procurement_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_price_variance_analyzer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Price Variance Analyzer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana",
      description: "Execute the generate step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Variance detection speed moved from Quarterly review toward Weekly automated",
      mustCite: [
        "sap_s_4hana.transactions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "bigquery",
      ],
    },
    {
      claim: "False positive rate moved from 60%+ flagged manually toward <15% with context",
      mustCite: [
        "sap_s_4hana.transactions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Variance detection speed regresses past the Quarterly review baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "price-variance-analyzer-end-to-end",
      prompt: "Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "query_procurement_3_procurement_3_records",
        "lookup_price_variance_analyzer_policy_guide",
        "action_sap_s_4hana_generate",
      ],
      mustReferenceEntities: [
        "transactions",
        "analytics_events",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "price-variance-analyzer-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA, with audit-trail entry and Category Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for Price Variance Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana",
      name: "SAP S/4HANA",
      owns: [
        "transactions",
        "journal_entries",
        "master_data",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_transactions",
        "query_sap_s_4hana_journal_entries",
        "query_sap_s_4hana_master_data",
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
      id: "procurement_3",
      name: "PROCUREMENT 3",
      owns: [
        "procurement_3_records",
        "procurement_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
    {
      name: "transactions",
      sourceSystemId: "sap_s_4hana",
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
      name: "journal_entries",
      sourceSystemId: "sap_s_4hana",
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
      name: "master_data",
      sourceSystemId: "sap_s_4hana",
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
      name: "procurement_3_records",
      sourceSystemId: "procurement_3",
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
      name: "procurement_3_events",
      sourceSystemId: "procurement_3",
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
          name: "procurement_3_record_id",
          type: "ref",
          ref: "procurement_3_records.id",
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
    {
      from: "procurement_3_events.procurement_3_record_id",
      to: "procurement_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "price-variance-analyzer-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Price Variance Analyzer Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "transactions",
        "journal_entries",
        "master_data",
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
      id: "sap_s_4hana_generate_api",
      sourceSystemId: "sap_s_4hana",
      method: "POST",
      path: "/api/sap_s_4hana/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA after evidence gating.",
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
      id: "price-variance-analyzer-baseline-gap",
      description: "Seed a realistic gap where Variance detection speed sits between Quarterly review and Weekly automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "transactions",
        "journal_entries",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "price_variance_analyzer",
      schemas: [
        "sap_s_4hana",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_price_variance_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "price-variance-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "price-variance-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Price Variance Analyzer workflow and cite source-system evidence for every claim.",
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

export const PriceVarianceAnalyzer = () => (
  <UseCaseSlide
    title="Price Variance Analyzer"
    subtitle="A-1907 • Spend Analytics"
    icon={Scale}
    domainId="domain-19"
    layer="Layer 4: Data Agent"
    persona="Category Manager"
    systems={["SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Variance detection speed", before: "Quarterly review", after: "Weekly automated" },
      { label: "False positive rate", before: "60%+ flagged manually", after: "<15% with context" },
      { label: "Actionable variance recovery", before: "Rarely pursued", after: "$2M+ annually" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Price variances detected quarterly during manual contract audits — months after overpayments occur.",
      "Most flagged variances are false positives: legitimate spec changes or contractual index adjustments mistaken for price creep.",
      "Category managers lack context to distinguish actionable variances from explained ones."
    ]}
    agentification={[
      "Statistical process control on price trends detects drift and off-contract pricing weekly.",
      "LLM investigates variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN-2024-0342 added coating requirement.'",
      "Generates variance narratives separating supplier price creep from explained adjustments."
    ]}
  />
);
