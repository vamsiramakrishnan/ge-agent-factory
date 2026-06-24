import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, Cpu, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Waste Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Savings Plan", lane: "agent", type: "output" },
    { id: "h1", label: "Cloud Architect OK", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spend Aggregation", icon: Database, description: "Multi-cloud spend aggregated from AWS, GCP, and Azure billing with resource utilization metrics.", trigger: "Daily", systems: ["AWS Cost Explorer", "GCP Billing"] },
  { label: "Waste Detection", icon: Cpu, description: "Resource utilization analysis, right-sizing based on p95 usage, reserved instance optimization.", systems: ["Datadog", "BigQuery"], integration: "API" },
  { label: "Savings Recommendations", icon: FileText, description: "Gemini contextualizes savings with workload impact — scheduling, right-sizing, and reservation advice.", systems: ["Vertex AI"] },
  { label: "Architect Approval", icon: CheckCircle, description: "Cloud Architect reviews savings plan and approves reservation purchases and right-sizing changes.", output: "Cloud Cost Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "AWS Cost Explorer", description: "AWS spend by service, account, tag; reservation utilization", direction: "read", protocol: "REST API", category: "erp" },
    { system: "GCP Billing", description: "GCP spend by project, SKU, label; committed use discounts", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Datadog", description: "Resource utilization metrics — CPU, memory, network, disk", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Cost analytics, utilization models, savings tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Savings contextualization, workload impact reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Multi-Cloud Spend Aggregation", description: "Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Management. Normalize into a unified cost model with resource-level attribution.", systems: ["AWS Cost Explorer", "GCP Billing"], layer: "integration", dataIn: "Multi-cloud billing data + resource tags", dataOut: "Unified cost dataset by resource, team, and environment" },
    { label: "Waste & Right-Sizing Analysis", description: "Resource utilization analysis using Datadog metrics. Right-sizing based on p95 CPU/memory usage. Reserved instance optimization modeling. Spot instance opportunity identification.", systems: ["Datadog", "BigQuery"], layer: "ml", dataIn: "Utilization metrics + cost data", dataOut: "Right-sizing recommendations with savings estimates" },
    { label: "Savings Contextualization", description: "Gemini contextualizes: 'Dev environment runs 24/7 but only used during business hours — shutdown scheduling saves $4,200/month. Staging has 3 m5.4xlarge at 12% CPU — downsize to m5.xlarge, saving $2,100/month.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Right-sizing data + workload patterns", dataOut: "Contextualized savings plan with implementation steps" },
    { label: "Approval & Tracking", description: "Cloud Architect reviews savings plan. Reservation purchases require approval. Right-sizing changes tracked with before/after cost comparison.", systems: ["BigQuery"], layer: "integration", dataIn: "Savings plan", dataOut: "Approved savings actions with tracking dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Cloud Architect agent for the Cloud Cost Optimizer workflow",
  primaryObjective: "Gemini contextualizes savings with workload awareness — distinguishing dev environments to schedule from production to right-size. Daily waste detection catches idle resources within 24 hours instead of letting them run for quarters. so the Cloud Architect can move the Cloud waste identified KPI.",
  inScope: [
    "Gemini contextualizes savings with workload awareness — distinguishing dev environments to schedule from production to right-size",
    "Daily waste detection catches idle resources within 24 hours instead of letting them run for quarters",
    "Unified multi-cloud view replaces siloed vendor-specific cost reports with a single savings pipeline",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_aws_cost_explorer_billing_records",
      kind: "query",
      sourceSystemId: "aws_cost_explorer",
      description: "Retrieve billing records from AWS Cost Explorer for the Cloud Cost Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_gcp_billing_billing_records",
      kind: "query",
      sourceSystemId: "gcp_billing",
      description: "Retrieve billing records from GCP Billing for the Cloud Cost Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the Cloud Cost Optimizer workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Cloud Cost Optimizer workflow.",
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
      name: "lookup_cloud_cost_optimizer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the Cloud Cost Optimizer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Cloud waste identified moved from Quarterly audit toward Daily detection",
      mustCite: [
        "aws_cost_explorer.billing_records",
        "gcp_billing.billing_records",
      ],
      sourceSystemIds: [
        "aws_cost_explorer",
        "gcp_billing",
      ],
    },
    {
      claim: "Right-sizing coverage moved from 10% of resources toward 100% automated",
      mustCite: [
        "aws_cost_explorer.billing_records",
        "gcp_billing.billing_records",
      ],
      sourceSystemIds: [
        "aws_cost_explorer",
        "gcp_billing",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Cloud waste identified regresses past the Quarterly audit baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Cloud Architect",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from AWS Cost Explorer (and other named systems) entities.",
    "Never bypass Cloud Architect approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "cloud-cost-optimizer-end-to-end",
      prompt: "Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_aws_cost_explorer_billing_records",
        "query_gcp_billing_billing_records",
        "query_datadog_alerts",
        "query_bigquery_analytics_events",
        "lookup_cloud_cost_optimizer_runbook",
      ],
      mustReferenceEntities: [
        "billing_records",
        "billing_records",
        "alerts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "cloud-cost-optimizer-runbook",
      ],
      expectedActionOutcome: "Cloud Architect receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Cloud Cost Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "aws_cost_explorer",
      name: "AWS Cost Explorer",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "AWS SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_aws_cost_explorer_billing_records",
        "query_aws_cost_explorer_resource_inventory",
        "query_aws_cost_explorer_alarm_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gcp_billing",
      name: "GCP Billing",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "GCP SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gcp_billing_billing_records",
        "query_gcp_billing_resource_inventory",
        "query_gcp_billing_alarm_events",
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
      name: "billing_records",
      sourceSystemId: "aws_cost_explorer",
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
          name: "service",
          type: "lorem.words",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 1,
          max: 10000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
          ],
          required: true,
        },
        {
          name: "period_start",
          type: "date",
          required: true,
        },
        {
          name: "period_end",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "resource_inventory",
      sourceSystemId: "aws_cost_explorer",
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
      name: "alarm_events",
      sourceSystemId: "aws_cost_explorer",
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
          name: "billing_record_id",
          type: "ref",
          ref: "billing_records.id",
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
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
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
      id: "cloud-cost-optimizer-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "Cloud Cost Optimizer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
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
      id: "cloud-cost-optimizer-baseline-gap",
      description: "Seed a realistic gap where Cloud waste identified sits between Quarterly audit and Daily detection, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "billing_records",
        "resource_inventory",
      ],
      discoveryPath: [
        "Inspect AWS Cost Explorer records for the affected entities",
        "Compare against GCP Billing historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Cloud Architect action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "cloud_cost_optimizer",
      schemas: [
        "aws_cost_explorer",
        "gcp_billing",
      ],
    },
    bigquery: {
      dataset: "it_cloud_cost_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "cloud-cost-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "cloud-cost-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Cloud Cost Optimizer workflow and cite source-system evidence for every claim.",
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

export const CloudCostOptimizer = () => (
  <UseCaseSlide
    title="Cloud Cost Optimizer"
    subtitle="A-4001 • Infra & Cloud Ops"
    icon={DollarSign}
    domainId="domain-40"
    layer="Layer 4: Data Agent"
    persona="Cloud Architect"
    systems={["AWS Cost Explorer", "GCP Billing", "Datadog", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Cloud waste identified", before: "Quarterly audit", after: "Daily detection" },
      { label: "Right-sizing coverage", before: "10% of resources", after: "100% automated" },
      { label: "Monthly cloud savings", before: "Unknown", after: "$15K+ realized" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Cloud Architect", action: "Approve reservation purchases", description: "Cloud Architect validates right-sizing recommendations, approves reserved instance commitments, and confirms scheduling changes." }}
    statusQuo={[
      "Cloud cost reviews done quarterly — waste accumulates for months before anyone notices over-provisioned resources.",
      "Right-sizing recommendations based on vendor tools that lack workload context and business priority awareness.",
      "No connection between cloud cost data across AWS, GCP, and Azure — each managed in separate spreadsheets."
    ]}
    agentification={[
      "Gemini contextualizes savings with workload awareness — distinguishing dev environments to schedule from production to right-size.",
      "Daily waste detection catches idle resources within 24 hours instead of letting them run for quarters.",
      "Unified multi-cloud view replaces siloed vendor-specific cost reports with a single savings pipeline."
    ]}
  />
);
