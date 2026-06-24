import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { LayoutDashboard, Database, Bell, CheckCircle, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Data Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Pipeline Execution", lane: "agent", type: "action" },
    { id: "a2", label: "Anomaly Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Dashboard + Alerts", lane: "agent", type: "output" },
    { id: "h1", label: "Finance Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Pipeline", icon: Database, description: "Maintain data pipelines from ERP and sub-systems. Refresh dashboards on scheduled or real-time cadence.", trigger: "Daily/Real-time", systems: ["BigQuery", "Looker"] },
  { label: "KPI Computation", icon: BarChart3, description: "Calculate financial KPIs — cash conversion cycle, DSO, DPO, operating margins — with automated anomaly detection.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Alert & Commentary", icon: Bell, description: "Gemini generates narrative commentary for KPI threshold breaches with root cause context.", systems: ["Vertex AI"] },
  { label: "Finance Review", icon: CheckCircle, description: "Finance lead reviews dashboard highlights and determines follow-up actions.", output: "Live KPI Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Central data warehouse for financial and operational metrics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Dashboard rendering, alerting framework, embedded analytics", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "KPI commentary generation, anomaly narrative explanation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Data Ingestion", description: "Maintain ETL/ELT pipelines from SAP, banking systems, CRM, and operational platforms into BigQuery. Validate data quality and completeness.", systems: ["BigQuery"], layer: "integration", dataIn: "Raw data from source systems", dataOut: "Validated data in analytics warehouse" },
    { label: "KPI Engine", description: "Calculate 50+ financial KPIs with automated threshold monitoring. Apply anomaly detection on metric movements to surface unexpected changes.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Validated financial data", dataOut: "Computed KPIs with anomaly flags" },
    { label: "Narrative Generation", description: "Gemini generates commentary for dashboard highlights: 'Cash conversion cycle improved 3 days to 42 — driven by DSO improvement from new collections strategy.' Focuses on why, not what.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "KPIs + anomaly flags + operational context", dataOut: "Dashboard commentary with root cause narratives" },
    { label: "Dashboard Delivery", description: "Refresh Looker dashboards with computed KPIs and AI-generated commentary. Send threshold breach alerts to relevant stakeholders.", systems: ["Looker"], layer: "integration", dataIn: "KPIs + commentary", dataOut: "Live dashboards + alert notifications" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Financial Reporting Manager agent for the KPI Dashboard Builder workflow",
  primaryObjective: "Real-time dashboard refresh with automated anomaly detection on 50+ financial KPIs. Gemini generates narrative commentary explaining the 'why' behind metric movements. so the Financial Reporting Manager can move the Dashboard refresh KPI.",
  inScope: [
    "Real-time dashboard refresh with automated anomaly detection on 50+ financial KPIs",
    "Gemini generates narrative commentary explaining the 'why' behind metric movements",
    "Proactive alerts on threshold breaches route to relevant stakeholders before issues compound",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the KPI Dashboard Builder workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the KPI Dashboard Builder workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dashboards_records",
        "dashboards_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the KPI Dashboard Builder workflow.",
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
      name: "lookup_kpi_dashboard_builder_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the KPI Dashboard Builder Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_finance_3_route",
      kind: "action",
      sourceSystemId: "finance_3",
      description: "Execute the route step in FINANCE 3 after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Dashboard refresh moved from Weekly manual toward Real-time automated",
      mustCite: [
        "bigquery.analytics_events",
        "looker.dashboards",
      ],
      sourceSystemIds: [
        "bigquery",
        "looker",
      ],
    },
    {
      claim: "KPI commentary moved from None — charts only toward AI-generated narratives",
      mustCite: [
        "bigquery.analytics_events",
        "looker.dashboards",
      ],
      sourceSystemIds: [
        "bigquery",
        "looker",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Dashboard refresh regresses past the Weekly manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Financial Reporting Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed route action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Financial Reporting Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "kpi-dashboard-builder-end-to-end",
      prompt: "Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "query_finance_3_finance_3_records",
        "lookup_kpi_dashboard_builder_controls_playbook",
        "action_finance_3_route",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "dashboards",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "kpi-dashboard-builder-controls-playbook",
      ],
      expectedActionOutcome: "Action route executed against FINANCE 3, with audit-trail entry and Financial Reporting Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute route without two-system evidence",
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
    rationale: "Row counts sized for KPI Dashboard Builder so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "looker",
      name: "Looker",
      owns: [
        "dashboards",
        "explore_queries",
        "metric_definitions",
      ],
      protocol: "LookerML",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_looker_dashboards",
        "query_looker_explore_queries",
        "query_looker_metric_definitions",
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
      name: "dashboards",
      sourceSystemId: "looker",
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
      name: "explore_queries",
      sourceSystemId: "looker",
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
      name: "metric_definitions",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
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
      id: "kpi-dashboard-builder-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "KPI Dashboard Builder Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "finance_3_route_api",
      sourceSystemId: "finance_3",
      method: "POST",
      path: "/api/finance_3/route",
      description: "Synchronous endpoint the agent calls to route in FINANCE 3 after evidence gating.",
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
      id: "kpi-dashboard-builder-baseline-gap",
      description: "Seed a realistic gap where Dashboard refresh sits between Weekly manual and Real-time automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against Looker historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Financial Reporting Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "kpi_dashboard_builder",
      schemas: [
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_kpi_dashboard_builder",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "kpi-dashboard-builder-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "kpi-dashboard-builder-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the KPI Dashboard Builder workflow and cite source-system evidence for every claim.",
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

export const KPIDashboardBuilder = () => (
  <UseCaseSlide
    title="KPI Dashboard Builder"
    subtitle="A-2803 • Finance Analytics & Reporting"
    icon={LayoutDashboard}
    domainId="domain-28"
    layer="Layer 4: Data Agent"
    persona="Financial Reporting Manager"
    systems={["BigQuery", "Looker", "Vertex AI"]}
    kpis={[
      { label: "Dashboard refresh", before: "Weekly manual", after: "Real-time automated" },
      { label: "KPI commentary", before: "None — charts only", after: "AI-generated narratives" },
      { label: "Anomaly detection", before: "Manual spot-check", after: "Automated threshold monitoring" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Finance Lead", action: "Review dashboard highlights", description: "Finance lead reviews KPI anomalies and AI commentary, then determines follow-up actions for the team." }}
    statusQuo={[
      "Dashboards refreshed weekly with no automated alerting on KPI threshold breaches.",
      "Charts show numbers without narrative context — users must interpret changes themselves.",
      "Manual spot-checking of KPI movements misses subtle anomalies."
    ]}
    agentification={[
      "Real-time dashboard refresh with automated anomaly detection on 50+ financial KPIs.",
      "Gemini generates narrative commentary explaining the 'why' behind metric movements.",
      "Proactive alerts on threshold breaches route to relevant stakeholders before issues compound."
    ]}
  />
);
