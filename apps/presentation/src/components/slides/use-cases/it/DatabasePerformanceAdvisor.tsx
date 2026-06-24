import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Database, AlertTriangle, Search, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Slow Query Alert", lane: "system", type: "trigger" },
    { id: "a1", label: "Query Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Index Recommendation", lane: "agent", type: "action" },
    { id: "a3", label: "Optimization Report", lane: "agent", type: "output" },
    { id: "s2", label: "Applied Fix", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Query Alert", icon: AlertTriangle, description: "Slow query alert triggers analysis or weekly scheduled scan of query performance data.", trigger: "Alert + Weekly", systems: ["CloudSQL", "Datadog"] },
  { label: "Query Analysis", icon: Search, description: "Query plan analysis, index usage statistics, connection pool utilization, and table growth forecasting.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Optimization Suggestions", icon: FileText, description: "Gemini suggests optimizations with context — index recommendations based on similar patterns in other services.", systems: ["Vertex AI"] },
  { label: "Applied Fix", icon: CheckCircle, description: "Index changes or query rewrites applied with before/after performance comparison.", output: "Optimization Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "CloudSQL", description: "Query execution plans, index statistics, table sizes, slow query logs", direction: "read", protocol: "SQL / REST API", category: "erp" },
    { system: "Datadog", description: "Database performance metrics, connection pool utilization, replication lag", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Historical query performance, optimization history, growth models", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Query optimization reasoning, index recommendation with context", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Query Performance Collection", description: "Collect slow query logs from CloudSQL, database performance metrics from Datadog, and query execution plans. Identify the top N most expensive queries by execution time and frequency.", systems: ["CloudSQL", "Datadog"], layer: "integration", dataIn: "Slow query logs + DB metrics", dataOut: "Ranked slow queries with execution plans" },
    { label: "Query Plan & Index Analysis", description: "Analyze query execution plans for full table scans, missing indexes, and suboptimal joins. Track index usage statistics. Forecast table growth to predict future performance degradation.", systems: ["BigQuery"], layer: "ml", dataIn: "Execution plans + index stats + growth data", dataOut: "Optimization opportunities with impact estimates" },
    { label: "Contextual Optimization Suggestions", description: "Gemini suggests fixes with context: 'Top slow query (avg 4.2s) joins orders and order_items without the composite index on (order_id, status). Adding this index would reduce to <100ms based on similar patterns in inventory service.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Optimization opportunities + cross-service patterns", dataOut: "Specific index and query rewrite recommendations" },
    { label: "Application & Verification", description: "Index changes applied with migration scripts. Before/after performance comparison tracked. Query optimization results measured over 7 days to confirm improvement.", systems: ["CloudSQL", "BigQuery"], layer: "integration", dataIn: "Approved optimizations", dataOut: "Applied changes with performance verification" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SRE Manager agent for the Database Performance Advisor workflow",
  primaryObjective: "Gemini suggests optimizations with cross-service pattern matching — applying successful fixes from one service to similar patterns elsewhere. Weekly proactive scanning catches missing indexes and query degradation before users experience slowness. so the SRE Manager can move the Slow query resolution KPI.",
  inScope: [
    "Gemini suggests optimizations with cross-service pattern matching — applying successful fixes from one service to similar patterns elsewhere",
    "Weekly proactive scanning catches missing indexes and query degradation before users experience slowness",
    "Before/after performance tracking creates a feedback loop that validates optimization effectiveness",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_cloudsql_cloudsql_records",
      kind: "query",
      sourceSystemId: "cloudsql",
      description: "Retrieve cloudsql records from CloudSQL for the Database Performance Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cloudsql_records_records",
        "cloudsql_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Database Performance Advisor workflow.",
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
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the Database Performance Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "alerts_records",
        "alerts_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_database_performance_advisor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Database Performance Advisor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_cloudsql_create",
      kind: "action",
      sourceSystemId: "cloudsql",
      description: "Execute the create step in CloudSQL after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Slow query resolution moved from Days of investigation toward Minutes with fix",
      mustCite: [
        "cloudsql.cloudsql_records",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "cloudsql",
        "bigquery",
      ],
    },
    {
      claim: "Missing index detection moved from Post-incident toward Proactive weekly",
      mustCite: [
        "cloudsql.cloudsql_records",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "cloudsql",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Slow query resolution regresses past the Days of investigation baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "SRE Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed create action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from CloudSQL (and other named systems) entities.",
    "Never bypass SRE Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "database-performance-advisor-end-to-end",
      prompt: "Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_cloudsql_cloudsql_records",
        "query_bigquery_analytics_events",
        "query_datadog_alerts",
        "lookup_database_performance_advisor_runbook",
        "action_cloudsql_create",
      ],
      mustReferenceEntities: [
        "cloudsql_records",
        "analytics_events",
        "alerts",
      ],
      mustCiteDocuments: [
        "database-performance-advisor-runbook",
      ],
      expectedActionOutcome: "Action create executed against CloudSQL, with audit-trail entry and SRE Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute create without two-system evidence",
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
    rationale: "Row counts sized for Database Performance Advisor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "cloudsql",
      name: "CloudSQL",
      owns: [
        "cloudsql_records",
        "cloudsql_events",
        "cloudsql_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_cloudsql_cloudsql_records",
        "query_cloudsql_cloudsql_events",
        "query_cloudsql_cloudsql_audit_trail",
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
      id: "datadog",
      name: "Datadog",
      owns: [
        "alerts",
        "monitors",
        "metrics_snapshots",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_datadog_alerts",
        "query_datadog_monitors",
        "query_datadog_metrics_snapshots",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "cloudsql_records",
      sourceSystemId: "cloudsql",
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
      name: "cloudsql_events",
      sourceSystemId: "cloudsql",
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
          name: "cloudsql_record_id",
          type: "ref",
          ref: "cloudsql_records.id",
          required: true,
        },
      ],
    },
    {
      name: "cloudsql_audit_trail",
      sourceSystemId: "cloudsql",
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
    {
      name: "alerts",
      sourceSystemId: "datadog",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "monitors",
      sourceSystemId: "datadog",
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
      name: "metrics_snapshots",
      sourceSystemId: "datadog",
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
      from: "cloudsql_events.cloudsql_record_id",
      to: "cloudsql_records.id",
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
      id: "database-performance-advisor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Database Performance Advisor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "cloudsql_records",
        "cloudsql_events",
        "cloudsql_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "cloudsql_create_api",
      sourceSystemId: "cloudsql",
      method: "POST",
      path: "/api/cloudsql/create",
      description: "Synchronous endpoint the agent calls to create in CloudSQL after evidence gating.",
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
      id: "database-performance-advisor-baseline-gap",
      description: "Seed a realistic gap where Slow query resolution sits between Days of investigation and Minutes with fix, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "cloudsql_records",
        "cloudsql_events",
      ],
      discoveryPath: [
        "Inspect CloudSQL records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next SRE Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "database_performance_advisor",
      schemas: [
        "cloudsql",
      ],
    },
    bigquery: {
      dataset: "it_database_performance_advisor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "database-performance-advisor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "database-performance-advisor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Database Performance Advisor workflow and cite source-system evidence for every claim.",
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

export const DatabasePerformanceAdvisor = () => (
  <UseCaseSlide
    title="Database Performance Advisor"
    subtitle="A-4006 • Infra & Cloud Ops"
    icon={Database}
    domainId="domain-40"
    layer="Layer 3: Custom ADK"
    persona="SRE Manager"
    systems={["CloudSQL", "BigQuery", "Datadog", "Vertex AI"]}
    kpis={[
      { label: "Slow query resolution", before: "Days of investigation", after: "Minutes with fix" },
      { label: "Missing index detection", before: "Post-incident", after: "Proactive weekly" },
      { label: "Query performance improvement", before: "Ad hoc", after: "Systematic 30x gains" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Database performance issues investigated reactively after users report slowness — days of manual analysis.",
      "Missing indexes discovered during incidents, not proactively scanned before they cause problems.",
      "Query optimization knowledge siloed in one senior DBA — no institutional knowledge sharing."
    ]}
    agentification={[
      "Gemini suggests optimizations with cross-service pattern matching — applying successful fixes from one service to similar patterns elsewhere.",
      "Weekly proactive scanning catches missing indexes and query degradation before users experience slowness.",
      "Before/after performance tracking creates a feedback loop that validates optimization effectiveness."
    ]}
  />
);
