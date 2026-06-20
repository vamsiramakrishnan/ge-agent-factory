import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Container, Database, Cpu, FileText, Settings } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Resource Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Right-Sizing Model", lane: "agent", type: "action" },
    { id: "a3", label: "Optimization Plan", lane: "agent", type: "output" },
    { id: "s2", label: "Applied Changes", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Resource Analysis", icon: Database, description: "Cluster resource allocation, pod scheduling efficiency, and node utilization analyzed.", trigger: "Daily", systems: ["Kubernetes", "Datadog"] },
  { label: "Right-Sizing Model", icon: Cpu, description: "Pod right-sizing based on actual usage vs. requests/limits, bin-packing analysis, HPA tuning.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Optimization Plan", icon: FileText, description: "Gemini explains opportunities with node consolidation estimates and cost savings projections.", systems: ["Vertex AI"] },
  { label: "Applied Changes", icon: Settings, description: "Right-sizing recommendations applied via GitOps with before/after resource comparison.", output: "Optimized Cluster Config" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Kubernetes", description: "Pod specs, resource requests/limits, node capacity, scheduling data", direction: "bidirectional", protocol: "Kubernetes API", category: "erp" },
    { system: "Datadog", description: "Actual CPU/memory usage by pod, node-level utilization", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Historical usage patterns, right-sizing models, savings tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Optimization reasoning, consolidation narrative, cost impact analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Cluster Resource Analysis", description: "Analyze Kubernetes cluster resource allocation — pod requests vs. actual usage from Datadog. Map node utilization, scheduling efficiency, and over-provisioning patterns across all clusters.", systems: ["Kubernetes", "Datadog"], layer: "integration", dataIn: "Pod specs + actual utilization metrics", dataOut: "Resource gap analysis by pod, namespace, and node" },
    { label: "Right-Sizing & Bin-Packing", description: "Calculate optimal pod requests/limits based on p95 actual usage. Run bin-packing analysis to determine optimal node count. Recommend HPA tuning based on traffic patterns.", systems: ["BigQuery"], layer: "ml", dataIn: "Resource gap analysis + traffic patterns", dataOut: "Right-sizing recommendations with node consolidation plan" },
    { label: "Optimization Narrative", description: "Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods request 2Gi but use 1.1Gi at p99. Reducing requests to 1.5Gi would consolidate from 12 nodes to 8, saving $3,400/month.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Right-sizing data + current costs", dataOut: "Optimization plan with cost savings and risk assessment" },
    { label: "GitOps Application", description: "Right-sizing recommendations applied via GitOps workflow — PRs generated with updated resource specs. Before/after comparison tracked in BigQuery.", systems: ["Kubernetes", "BigQuery"], layer: "integration", dataIn: "Optimization plan", dataOut: "Applied changes with savings tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SRE Manager agent for the Kubernetes Cluster Optimizer workflow",
  primaryObjective: "Gemini explains optimization opportunities with concrete savings — number of nodes to consolidate and dollar impact. Pod right-sizing based on p95/p99 actual usage replaces developer guesswork with data-driven resource allocation. so the SRE Manager can move the Resource over-provisioning KPI.",
  inScope: [
    "Gemini explains optimization opportunities with concrete savings — number of nodes to consolidate and dollar impact",
    "Pod right-sizing based on p95/p99 actual usage replaces developer guesswork with data-driven resource allocation",
    "GitOps-integrated PRs make right-sizing as easy as reviewing and merging a pull request",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_kubernetes_workloads",
      kind: "query",
      sourceSystemId: "kubernetes",
      description: "Retrieve workloads from Kubernetes for the Kubernetes Cluster Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "workloads_records",
        "workloads_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the Kubernetes Cluster Optimizer workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Kubernetes Cluster Optimizer workflow.",
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
      name: "lookup_kubernetes_cluster_optimizer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the Kubernetes Cluster Optimizer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Resource over-provisioning moved from 40-60% toward <15%",
      mustCite: [
        "kubernetes.workloads",
        "datadog.alerts",
      ],
      sourceSystemIds: [
        "kubernetes",
        "datadog",
      ],
    },
    {
      claim: "Node utilization moved from 35% toward 70%+",
      mustCite: [
        "kubernetes.workloads",
        "datadog.alerts",
      ],
      sourceSystemIds: [
        "kubernetes",
        "datadog",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Resource over-provisioning regresses past the 40-60% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "SRE Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Kubernetes (and other named systems) entities.",
    "Never bypass SRE Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "kubernetes-cluster-optimizer-end-to-end",
      prompt: "Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_kubernetes_workloads",
        "query_datadog_alerts",
        "query_bigquery_analytics_events",
        "lookup_kubernetes_cluster_optimizer_runbook",
      ],
      mustReferenceEntities: [
        "workloads",
        "alerts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "kubernetes-cluster-optimizer-runbook",
      ],
      expectedActionOutcome: "SRE Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Kubernetes Cluster Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "kubernetes",
      name: "Kubernetes",
      owns: [
        "workloads",
        "deployments",
        "pod_events",
      ],
      protocol: "Kubernetes API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_kubernetes_workloads",
        "query_kubernetes_deployments",
        "query_kubernetes_pod_events",
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
      name: "workloads",
      sourceSystemId: "kubernetes",
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
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "deployments",
      sourceSystemId: "kubernetes",
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
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "pod_events",
      sourceSystemId: "kubernetes",
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
          name: "workload_id",
          type: "ref",
          ref: "workloads.id",
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
      from: "pod_events.workload_id",
      to: "workloads.id",
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
      id: "kubernetes-cluster-optimizer-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "Kubernetes Cluster Optimizer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "workloads",
        "deployments",
        "pod_events",
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
  apis: [],
  anomalies: [
    {
      id: "kubernetes-cluster-optimizer-baseline-gap",
      description: "Seed a realistic gap where Resource over-provisioning sits between 40-60% and <15%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "workloads",
        "deployments",
      ],
      discoveryPath: [
        "Inspect Kubernetes records for the affected entities",
        "Compare against Datadog historical baseline",
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
      database: "kubernetes_cluster_optimizer",
      schemas: [
        "kubernetes",
      ],
    },
    bigquery: {
      dataset: "it_kubernetes_cluster_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "kubernetes-cluster-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "kubernetes-cluster-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Kubernetes Cluster Optimizer workflow and cite source-system evidence for every claim.",
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

export const KubernetesClusterOptimizer = () => (
  <UseCaseSlide
    title="Kubernetes Cluster Optimizer"
    subtitle="A-4005 • Infra & Cloud Ops"
    icon={Container}
    domainId="domain-40"
    layer="Layer 3: Custom ADK"
    persona="SRE Manager"
    systems={["Kubernetes", "Datadog", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Resource over-provisioning", before: "40-60%", after: "<15%" },
      { label: "Node utilization", before: "35%", after: "70%+" },
      { label: "Monthly infrastructure savings", before: "N/A", after: "$3K+ per cluster" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Pod resource requests set during initial deployment and never adjusted — most are 2-3x over-provisioned.",
      "Developers set generous limits 'just in case,' leading to poor bin-packing and wasted node capacity.",
      "Right-sizing requires manual analysis of each pod's actual usage — never happens at scale."
    ]}
    agentification={[
      "Gemini explains optimization opportunities with concrete savings — number of nodes to consolidate and dollar impact.",
      "Pod right-sizing based on p95/p99 actual usage replaces developer guesswork with data-driven resource allocation.",
      "GitOps-integrated PRs make right-sizing as easy as reviewing and merging a pull request."
    ]}
  />
);
