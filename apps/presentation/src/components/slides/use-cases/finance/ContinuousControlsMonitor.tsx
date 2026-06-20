import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Activity, Database, AlertTriangle, CheckCircle, Eye } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Transaction Posted", lane: "system", type: "trigger" },
    { id: "a1", label: "Rule Execution", lane: "agent", type: "action" },
    { id: "a2", label: "Context Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Violation Report", lane: "agent", type: "output" },
    { id: "h1", label: "Control Owner Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Scan", icon: Database, description: "Continuously scan financial transactions for control violations — SoD, authorization limits, access anomalies.", trigger: "Continuous", systems: ["SAP GRC", "SAP S/4HANA"] },
  { label: "Rule Evaluation", icon: Eye, description: "Apply automated control rules and statistical process control to detect deviations from expected patterns.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Contextual Analysis", icon: AlertTriangle, description: "Gemini interprets violations in context — distinguishes legitimate exceptions from true control failures.", systems: ["Vertex AI"] },
  { label: "Owner Notification", icon: CheckCircle, description: "Control owner receives classified violation with context and recommended action.", output: "Classified Violation Alert" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP GRC", description: "SoD matrix, access rules, authorization limits", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA", description: "Real-time transaction feeds, user activity logs", direction: "read", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Historical baselines, control KRI dashboards", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Violation context interpretation, exception classification", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Real-Time Ingestion", description: "Stream transaction events from SAP via change data capture. Apply SoD matrix and authorization rules in real-time.", systems: ["SAP GRC", "SAP S/4HANA"], layer: "integration", dataIn: "Transaction events + user actions", dataOut: "Flagged potential violations" },
    { label: "Statistical Process Control", description: "Compare flagged items against historical baselines. Apply key risk indicator thresholds for anomaly detection.", systems: ["BigQuery"], layer: "ml", dataIn: "Flagged violations + historical patterns", dataOut: "Scored violations with severity" },
    { label: "Context Interpretation", description: "Gemini reads violation context — emergency delegations, documented exceptions, temporary access grants — to classify true violations vs. acceptable deviations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored violations + delegation records", dataOut: "Classified violations with contextual rationale" },
    { label: "Alert & Track", description: "Route classified violations to control owners. Track remediation and update control effectiveness metrics.", systems: ["AuditBoard"], layer: "integration", dataIn: "Classified violations", dataOut: "Remediation tracking records" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Chief Audit Executive agent for the Continuous Controls Monitor workflow",
  primaryObjective: "Real-time transaction monitoring detects violations within minutes of occurrence. Gemini interprets context — emergency delegations, documented exceptions — reducing false positives. so the Chief Audit Executive can move the Monitoring frequency KPI.",
  inScope: [
    "Real-time transaction monitoring detects violations within minutes of occurrence",
    "Gemini interprets context — emergency delegations, documented exceptions — reducing false positives",
    "Statistical process control establishes dynamic baselines that adapt to business changes",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_grc_control_tests",
      kind: "query",
      sourceSystemId: "sap_grc",
      description: "Retrieve control tests from SAP GRC for the Continuous Controls Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "control_tests_records",
        "control_tests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Continuous Controls Monitor workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Continuous Controls Monitor workflow.",
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
      name: "lookup_continuous_controls_monitor_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Continuous Controls Monitor Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Monitoring frequency moved from Quarterly testing toward Continuous real-time",
      mustCite: [
        "sap_grc.control_tests",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "sap_grc",
        "sap_s_4hana",
      ],
    },
    {
      claim: "False positive rate moved from 40-60% toward < 15%",
      mustCite: [
        "sap_grc.control_tests",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "sap_grc",
        "sap_s_4hana",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Monitoring frequency regresses past the Quarterly testing baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from SAP GRC (and other named systems) entities.",
    "Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "continuous-controls-monitor-end-to-end",
      prompt: "Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_grc_control_tests",
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "lookup_continuous_controls_monitor_controls_playbook",
      ],
      mustReferenceEntities: [
        "control_tests",
        "transactions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "continuous-controls-monitor-controls-playbook",
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
    rationale: "Row counts sized for Continuous Controls Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_grc",
      name: "SAP GRC",
      owns: [
        "control_tests",
        "risk_assessments",
        "remediation_actions",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_grc_control_tests",
        "query_sap_grc_risk_assessments",
        "query_sap_grc_remediation_actions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "control_tests",
      sourceSystemId: "sap_grc",
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
      name: "risk_assessments",
      sourceSystemId: "sap_grc",
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
      name: "remediation_actions",
      sourceSystemId: "sap_grc",
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
      id: "continuous-controls-monitor-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Continuous Controls Monitor Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "control_tests",
        "risk_assessments",
        "remediation_actions",
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
      id: "continuous-controls-monitor-baseline-gap",
      description: "Seed a realistic gap where Monitoring frequency sits between Quarterly testing and Continuous real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "control_tests",
        "risk_assessments",
      ],
      discoveryPath: [
        "Inspect SAP GRC records for the affected entities",
        "Compare against SAP S/4HANA historical baseline",
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
      database: "continuous_controls_monitor",
      schemas: [
        "sap_grc",
        "sap_s_4hana",
      ],
    },
    bigquery: {
      dataset: "finance_continuous_controls_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "continuous-controls-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "continuous-controls-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Continuous Controls Monitor workflow and cite source-system evidence for every claim.",
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

export const ContinuousControlsMonitor = () => (
  <UseCaseSlide
    title="Continuous Controls Monitor"
    subtitle="A-2602 • Internal Audit & Controls"
    icon={Activity}
    domainId="domain-26"
    layer="Layer 3: Custom ADK"
    persona="Chief Audit Executive"
    systems={["SAP GRC", "SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Monitoring frequency", before: "Quarterly testing", after: "Continuous real-time" },
      { label: "False positive rate", before: "40-60%", after: "< 15%" },
      { label: "Violation detection lag", before: "30-90 days", after: "< 1 hour" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Control Owner", action: "Review classified violations", description: "Control owner validates violation classification and initiates remediation or documents the exception." }}
    statusQuo={[
      "Control violations discovered during quarterly SOX testing, months after occurrence.",
      "High false positive rates from rule-based alerts without contextual interpretation.",
      "No distinction between legitimate emergency exceptions and true control failures."
    ]}
    agentification={[
      "Real-time transaction monitoring detects violations within minutes of occurrence.",
      "Gemini interprets context — emergency delegations, documented exceptions — reducing false positives.",
      "Statistical process control establishes dynamic baselines that adapt to business changes."
    ]}
  />
);
