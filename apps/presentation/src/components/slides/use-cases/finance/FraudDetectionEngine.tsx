import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldAlert, Database, Network, CheckCircle, Search } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Transaction Stream", lane: "system", type: "trigger" },
    { id: "a1", label: "Anomaly Detection", lane: "agent", type: "action" },
    { id: "a2", label: "Pattern Investigation", lane: "agent", type: "action" },
    { id: "a3", label: "Investigation Brief", lane: "agent", type: "output" },
    { id: "h1", label: "Investigator Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Scan", icon: Database, description: "Continuously scan all financial transactions across sub-ledgers for suspicious patterns.", trigger: "Continuous", systems: ["SAP S/4HANA", "BigQuery"] },
  { label: "Anomaly Detection", icon: Network, description: "Benford's Law analysis, behavioral anomaly detection, network analysis of vendor-employee connections.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Pattern Investigation", icon: Search, description: "Gemini investigates flagged patterns — shared bank accounts, fictitious vendors, ghost employees — and builds investigation narrative.", systems: ["Vertex AI"] },
  { label: "Investigator Review", icon: CheckCircle, description: "Fraud investigator reviews the case brief and determines whether to escalate or close.", output: "Fraud Investigation Brief" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "Transaction data across all sub-ledgers, vendor and employee master data", direction: "read", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Behavioral baselines, network graphs, Benford's analysis results", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Pattern investigation reasoning, investigation brief generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Transaction Ingestion", description: "Stream financial transactions from all sub-ledgers. Enrich with vendor master, employee master, and banking details for network analysis.", systems: ["SAP S/4HANA", "BigQuery"], layer: "integration", dataIn: "Raw transaction feeds + master data", dataOut: "Enriched transaction dataset" },
    { label: "Statistical Detection", description: "Apply Benford's Law on digit distributions, behavioral anomaly models on posting patterns, and network analysis to identify vendor-employee connections or unusual payment flows.", systems: ["BigQuery"], layer: "ml", dataIn: "Enriched transactions", dataOut: "Anomaly-scored transactions with network flags" },
    { label: "Investigation Reasoning", description: "Gemini investigates high-scoring anomalies: traces shared bank accounts, analyzes vendor creation timing vs. payments, identifies documentation gaps. Builds investigation narrative with evidence chain.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomaly-scored items + master data context", dataOut: "Investigation briefs with evidence and risk classification" },
    { label: "Case Routing", description: "Route investigation briefs to fraud team. Track case outcomes to improve detection models.", systems: ["AuditBoard"], layer: "integration", dataIn: "Investigation briefs", dataOut: "Case tracking records" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Chief Audit Executive agent for the Fraud Detection Engine workflow",
  primaryObjective: "Continuous monitoring with Benford's Law and behavioral analytics detects anomalies in real-time. Network analysis uncovers hidden relationships — shared bank accounts, vendor-employee connections. so the Chief Audit Executive can move the Detection frequency KPI.",
  inScope: [
    "Continuous monitoring with Benford's Law and behavioral analytics detects anomalies in real-time",
    "Network analysis uncovers hidden relationships — shared bank accounts, vendor-employee connections",
    "Gemini builds investigation narratives with evidence chains, accelerating fraud examiner response",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Fraud Detection Engine workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Fraud Detection Engine workflow.",
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
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the Fraud Detection Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "finance_3_records_records",
        "finance_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_fraud_detection_engine_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Fraud Detection Engine Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Detection frequency moved from Annual review toward Continuous monitoring",
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
      claim: "Detection-to-investigation moved from Weeks-months toward < 24 hours",
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
      trigger: "Detection frequency regresses past the Annual review baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Chief Audit Executive",
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
    "Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "fraud-detection-engine-end-to-end",
      prompt: "Run the Fraud Detection Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "query_finance_3_finance_3_records",
        "lookup_fraud_detection_engine_controls_playbook",
      ],
      mustReferenceEntities: [
        "transactions",
        "analytics_events",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "fraud-detection-engine-controls-playbook",
      ],
      expectedActionOutcome: "Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Fraud Detection Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "finance_3",
      name: "FINANCE 3",
      owns: [
        "finance_3_records",
        "finance_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_finance_3_records",
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
      name: "finance_3_records",
      sourceSystemId: "finance_3",
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
      name: "finance_3_events",
      sourceSystemId: "finance_3",
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
          name: "finance_3_record_id",
          type: "ref",
          ref: "finance_3_records.id",
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
      from: "finance_3_events.finance_3_record_id",
      to: "finance_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "fraud-detection-engine-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Fraud Detection Engine Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "transactions",
        "journal_entries",
        "master_data",
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
      id: "fraud-detection-engine-baseline-gap",
      description: "Seed a realistic gap where Detection frequency sits between Annual review and Continuous monitoring, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Chief Audit Executive action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "fraud_detection_engine",
      schemas: [
        "sap_s_4hana",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_fraud_detection_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "fraud-detection-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "fraud-detection-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Fraud Detection Engine workflow and cite source-system evidence for every claim.",
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

export const FraudDetectionEngine = () => (
  <UseCaseSlide
    title="Fraud Detection Engine"
    subtitle="A-2606 • Internal Audit & Controls"
    icon={ShieldAlert}
    domainId="domain-26"
    layer="Layer 4: Data Agent"
    persona="Chief Audit Executive"
    systems={["SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Detection frequency", before: "Annual review", after: "Continuous monitoring" },
      { label: "Detection-to-investigation", before: "Weeks-months", after: "< 24 hours" },
      { label: "Fraud schemes detected", before: "3-4 types", after: "15+ pattern types" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Fraud Investigator", action: "Review investigation brief", description: "Investigator validates the evidence chain and determines whether to escalate to legal, HR, or management." }}
    statusQuo={[
      "Fraud detection limited to annual audits or whistleblower tips — most schemes run for months.",
      "Basic duplicate detection misses sophisticated schemes like fictitious vendors or ghost employees.",
      "Investigation is manual and time-consuming, delaying response."
    ]}
    agentification={[
      "Continuous monitoring with Benford's Law and behavioral analytics detects anomalies in real-time.",
      "Network analysis uncovers hidden relationships — shared bank accounts, vendor-employee connections.",
      "Gemini builds investigation narratives with evidence chains, accelerating fraud examiner response."
    ]}
  />
);
