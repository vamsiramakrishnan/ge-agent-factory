import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, Brain, TrendingDown, PiggyBank } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Analysis", lane: "system", type: "trigger" },
    { id: "a1", label: "Cost Ranking", lane: "agent", type: "action" },
    { id: "a2", label: "Optimization Plan", lane: "agent", type: "action" },
    { id: "a3", label: "Savings Report", lane: "agent", type: "output" },
    { id: "h1", label: "Lead Prioritizes", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Cost Analysis", icon: DollarSign, description: "Query patterns analyzed for cost — identifying full table scans, missing partitions, and caching opportunities.", trigger: "Daily", systems: ["BigQuery"] },
  { label: "Optimization Scoring", icon: Database, description: "Top expensive queries ranked with estimated savings from partitioning, clustering, and caching.", systems: ["BigQuery", "Datadog"], integration: "ADK" },
  { label: "Recommendations", icon: Brain, description: "LLM generates specific optimization recommendations with implementation guidance for each query.", systems: ["Vertex AI"] },
  { label: "Lead Prioritization", icon: TrendingDown, description: "Data Platform Lead reviews savings opportunities and assigns optimization work to teams.", output: "Optimization Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Query logs, table metadata, partition/cluster config, cost data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "BigQuery Admin", description: "Slot utilization, reservation management, cost allocation", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Datadog", description: "Query performance metrics, slot usage patterns", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Query optimization reasoning, implementation guidance", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Query Cost Profiling", description: "Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full table scans, cross-region reads, and queries that could benefit from materialized views or BI Engine.", systems: ["BigQuery", "BigQuery Admin"], layer: "integration", dataIn: "Query execution logs + cost metadata", dataOut: "Cost-ranked query inventory with scan analysis" },
    { label: "Optimization Opportunity Detection", description: "Identify savings opportunities: partition pruning (add date filters), clustering alignment, materialized view candidates, and query result caching. Estimate cost reduction per optimization.", systems: ["BigQuery", "Datadog"], layer: "ml", dataIn: "Query patterns + table configurations", dataOut: "Optimization opportunities with estimated savings" },
    { label: "Implementation Guidance", description: "Gemini generates specific implementation instructions for each optimization — rewritten queries, DDL for partitioning, and clustering recommendations with before/after cost projections.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Optimization opportunities + query SQL", dataOut: "Implementation guide with cost projections" },
    { label: "Savings Tracking", description: "Track implemented optimizations and verify actual cost reductions. Report cumulative savings and identify new optimization opportunities as query patterns evolve.", systems: ["BigQuery"], layer: "integration", dataIn: "Implemented optimizations", dataOut: "Verified savings dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Data Platform Lead agent for the Cost-per-Query Optimizer workflow",
  primaryObjective: "Gemini identifies the top expensive queries and generates specific optimization instructions daily. LLM recommends partition filters, clustering changes, and materialized views with before/after cost projections. so the Data Platform Lead can move the BigQuery monthly spend KPI.",
  inScope: [
    "Gemini identifies the top expensive queries and generates specific optimization instructions daily",
    "LLM recommends partition filters, clustering changes, and materialized views with before/after cost projections",
    "Automated savings tracking verifies optimization impact and identifies new opportunities as patterns evolve",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Cost-per-Query Optimizer workflow.",
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
      description: "Retrieve alerts from Datadog for the Cost-per-Query Optimizer workflow.",
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
      name: "query_bigquery_admin_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery_admin",
      description: "Retrieve analytics events from BigQuery Admin for the Cost-per-Query Optimizer workflow.",
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
      name: "lookup_cost_per_query_optimizer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Cost-per-Query Optimizer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_bigquery_recommend",
      kind: "action",
      sourceSystemId: "bigquery",
      description: "Execute the recommend step in BigQuery after the agent has gathered evidence and validated escalation gates.",
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
      claim: "BigQuery monthly spend moved from Unoptimized growth toward 30-40% reduction",
      mustCite: [
        "bigquery.analytics_events",
        "datadog.alerts",
      ],
      sourceSystemIds: [
        "bigquery",
        "datadog",
      ],
    },
    {
      claim: "Full table scan rate moved from 35% of queries toward <10% with partition filters",
      mustCite: [
        "bigquery.analytics_events",
        "datadog.alerts",
      ],
      sourceSystemIds: [
        "bigquery",
        "datadog",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "BigQuery monthly spend regresses past the Unoptimized growth baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Data Platform Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Data Platform Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "cost-per-query-optimizer-end-to-end",
      prompt: "Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_datadog_alerts",
        "query_bigquery_admin_analytics_events",
        "lookup_cost_per_query_optimizer_runbook",
        "action_bigquery_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "alerts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "cost-per-query-optimizer-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against BigQuery, with audit-trail entry and Data Platform Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Cost-per-Query Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
    {
      id: "bigquery_admin",
      name: "BigQuery Admin",
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
        "query_bigquery_admin_analytics_events",
        "query_bigquery_admin_historical_metrics",
        "query_bigquery_admin_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "cost-per-query-optimizer-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Cost-per-Query Optimizer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "bigquery_recommend_api",
      sourceSystemId: "bigquery",
      method: "POST",
      path: "/api/bigquery/recommend",
      description: "Synchronous endpoint the agent calls to recommend in BigQuery after evidence gating.",
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
      id: "cost-per-query-optimizer-baseline-gap",
      description: "Seed a realistic gap where BigQuery monthly spend sits between Unoptimized growth and 30-40% reduction, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against Datadog historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Data Platform Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "cost_per_query_optimizer",
      schemas: [],
    },
    bigquery: {
      dataset: "it_cost_per_query_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "cost-per-query-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "cost-per-query-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Cost-per-Query Optimizer workflow and cite source-system evidence for every claim.",
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

export const CostPerQueryOptimizer = () => (
  <UseCaseSlide
    title="Cost-per-Query Optimizer"
    subtitle="IT6-05 • Data & AI Platform"
    icon={PiggyBank}
    domainId="domain-43"
    layer="Layer 4: Data Agent"
    persona="Data Platform Lead"
    systems={["BigQuery", "Datadog", "BigQuery Admin", "Vertex AI"]}
    kpis={[
      { label: "BigQuery monthly spend", before: "Unoptimized growth", after: "30-40% reduction" },
      { label: "Full table scan rate", before: "35% of queries", after: "<10% with partition filters" },
      { label: "Optimization identification", before: "Ad-hoc manual", after: "Daily automated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Data Platform Lead", action: "Prioritize optimizations", description: "Platform Lead reviews cost savings opportunities and assigns optimization work to data engineering teams." }}
    statusQuo={[
      "BigQuery spend grows unchecked because expensive queries are not systematically identified.",
      "Optimization opportunities (partitioning, clustering) discovered ad-hoc rather than proactively.",
      "No feedback loop to verify whether implemented optimizations actually reduced costs.",
    ]}
    agentification={[
      "Gemini identifies the top expensive queries and generates specific optimization instructions daily.",
      "LLM recommends partition filters, clustering changes, and materialized views with before/after cost projections.",
      "Automated savings tracking verifies optimization impact and identifies new opportunities as patterns evolve.",
    ]}
  />
);
