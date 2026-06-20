import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { TrendingUp, Database, Activity, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Consumption Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Time-Series Decomposition", lane: "agent", type: "action" },
    { id: "a3", label: "Anomaly Contextualization", lane: "agent", type: "action" },
    { id: "a4", label: "Pattern Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Data Extraction", icon: Database, description: "Consumption and requisition history extracted from ERP, aligned with production plans.", trigger: "Monthly", systems: ["SAP S/4HANA"] },
  { label: "Decomposition", icon: Activity, description: "Time-series decomposition isolates trend, seasonality, and cyclical components with anomaly detection.", systems: ["BigQuery"], integration: "Data Agent" },
  { label: "Context Mapping", icon: Brain, description: "LLM cross-references anomalies with business context — ERP migration, new product launches, plant turnarounds.", systems: ["Vertex AI"] },
  { label: "Demand Intelligence", icon: FileText, description: "Pattern report distinguishes one-time events from trend shifts, with forward demand projections.", output: "Demand Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA MM", description: "Consumption history, requisition data, material master, production plans", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Time-series decomposition models, anomaly detection, demand projections", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Anomaly contextualization, production planning interpretation, demand narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Consumption Data Extraction", description: "Extract consumption and requisition history from ERP, aligned with production plans. Normalize across business units and material groups with calendar alignment for seasonal comparison.", systems: ["SAP S/4HANA MM", "BigQuery"], layer: "integration", dataIn: "Raw consumption logs + production schedules", dataOut: "Normalized demand dataset aligned to production calendar" },
    { label: "Time-Series Decomposition", description: "Holt-Winters/Prophet decomposition isolates trend, seasonality, and cyclical demand components. Anomaly detection flags demand spikes and drops that deviate from established patterns. Forward demand projection with confidence intervals.", systems: ["BigQuery"], layer: "ml", dataIn: "Normalized demand history", dataOut: "Decomposed patterns + anomaly flags + forward projections" },
    { label: "Context Mapping & Intelligence", description: "Gemini cross-references demand anomalies with business context — ERP migration bulk purchases, new product line launches, plant turnarounds. Reads production planning communications to anticipate demand shifts before they appear in requisition data. Generates pattern reports distinguishing one-time events from trend shifts.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomaly flags + business event context", dataOut: "Context-adjusted demand report with forward signals" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Demand Pattern Analyzer workflow",
  primaryObjective: "Time-series decomposition with Holt-Winters/Prophet isolates trend, seasonality, and cyclical demand patterns. LLM cross-references demand anomalies with business context: 'Category X spiked 200% in March — ERP migration project, one-time event, do not adjust baseline.' so the Category Manager can move the Forecast accuracy KPI.",
  inScope: [
    "Time-series decomposition with Holt-Winters/Prophet isolates trend, seasonality, and cyclical demand patterns",
    "LLM cross-references demand anomalies with business context: 'Category X spiked 200% in March — ERP migration project, one-time event, do not adjust baseline.'",
    "Reads production planning communications to anticipate demand shifts before they appear in requisition data",
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
      description: "Retrieve transactions from SAP S/4HANA for the Demand Pattern Analyzer workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Demand Pattern Analyzer workflow.",
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
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the Demand Pattern Analyzer workflow.",
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
      name: "lookup_demand_pattern_analyzer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Demand Pattern Analyzer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Forecast accuracy moved from Trend extrapolation toward Context-adjusted projection",
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
      claim: "Anomaly explanation rate moved from Manual investigation toward 90%+ auto-explained",
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
      trigger: "Forecast accuracy regresses past the Trend extrapolation baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
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
      id: "demand-pattern-analyzer-end-to-end",
      prompt: "Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "query_procurement_3_procurement_3_records",
        "lookup_demand_pattern_analyzer_policy_guide",
      ],
      mustReferenceEntities: [
        "transactions",
        "analytics_events",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "demand-pattern-analyzer-policy-guide",
      ],
      expectedActionOutcome: "Category Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Demand Pattern Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "demand-pattern-analyzer-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Demand Pattern Analyzer Procurement Policy Guide",
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
  apis: [],
  anomalies: [
    {
      id: "demand-pattern-analyzer-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy sits between Trend extrapolation and Context-adjusted projection, so the agent can detect, narrate, and recommend remediation.",
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
      database: "demand_pattern_analyzer",
      schemas: [
        "sap_s_4hana",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_demand_pattern_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "demand-pattern-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "demand-pattern-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Demand Pattern Analyzer workflow and cite source-system evidence for every claim.",
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

export const DemandPatternAnalyzer = () => (
  <UseCaseSlide
    title="Demand Pattern Analyzer"
    subtitle="A-1908 • Spend Analytics"
    icon={TrendingUp}
    domainId="domain-19"
    layer="Layer 4: Data Agent"
    persona="Category Manager"
    systems={["SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy", before: "Trend extrapolation", after: "Context-adjusted projection" },
      { label: "Anomaly explanation rate", before: "Manual investigation", after: "90%+ auto-explained" },
      { label: "Demand signal lead time", before: "Reactive", after: "1-2 quarters forward" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Demand spikes treated as trend shifts — bulk IT purchases during ERP migration distort baseline forecasts.",
      "No systematic connection between project data and procurement demand signals.",
      "Category managers lack context to distinguish one-time events from structural demand changes."
    ]}
    agentification={[
      "Time-series decomposition with Holt-Winters/Prophet isolates trend, seasonality, and cyclical demand patterns.",
      "LLM cross-references demand anomalies with business context: 'Category X spiked 200% in March — ERP migration project, one-time event, do not adjust baseline.'",
      "Reads production planning communications to anticipate demand shifts before they appear in requisition data."
    ]}
  />
);
