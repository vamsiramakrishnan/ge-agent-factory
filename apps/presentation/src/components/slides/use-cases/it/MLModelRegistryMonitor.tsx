import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Box, Activity, AlertTriangle, CheckCircle, Cpu } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Model Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Performance Check", lane: "agent", type: "action" },
    { id: "a2", label: "Drift Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Health Report", lane: "agent", type: "output" },
    { id: "h1", label: "Lead Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Model Monitoring", icon: Activity, description: "Deployed model performance metrics tracked continuously — accuracy, latency, and prediction distribution.", trigger: "Daily + Event", systems: ["Vertex AI Model Registry", "MLflow"] },
  { label: "Drift Detection", icon: AlertTriangle, description: "Feature drift, concept drift, and data distribution shifts detected using statistical tests.", systems: ["BigQuery", "Datadog"], integration: "ADK" },
  { label: "Health Explanation", icon: Box, description: "LLM explains model degradation with root cause analysis and retraining recommendations.", systems: ["Vertex AI"] },
  { label: "Lead Approval", icon: CheckCircle, description: "Data Platform Lead reviews model health and approves retraining or rollback decisions.", output: "Model Health Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Vertex AI Model Registry", description: "Model versions, deployment status, serving metrics", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "MLflow", description: "Experiment tracking, model artifacts, metric history", direction: "read", protocol: "REST API", category: "ai" },
    { system: "BigQuery", description: "Prediction logs, feature distributions, ground truth data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Datadog", description: "Model serving latency, error rates, resource usage", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Model health reasoning, drift explanation, retraining advice", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Performance Metric Collection", description: "Track deployed model metrics from Vertex AI and MLflow: accuracy, precision, recall, latency, and throughput. Compare against baseline performance recorded at deployment.", systems: ["Vertex AI Model Registry", "MLflow"], layer: "integration", dataIn: "Model serving metrics + baseline thresholds", dataOut: "Performance metrics with baseline comparison" },
    { label: "Drift Detection & Analysis", description: "Run statistical tests on feature distributions and prediction outputs. Detect data drift (input distribution shift), concept drift (relationship change), and label drift (ground truth shift).", systems: ["BigQuery", "Datadog"], layer: "ml", dataIn: "Prediction logs + feature distributions", dataOut: "Drift scores with affected features identified" },
    { label: "Health Explanation & Recommendations", description: "Gemini explains model degradation in business terms — 'churn model precision dropped because contract_renewal_date feature shifted after billing migration.' Recommends retraining strategy or feature engineering fixes.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Drift analysis + feature importance + model metadata", dataOut: "Model health report with retraining recommendations" },
    { label: "Version Management", description: "Track model versions, A/B experiment results, and champion/challenger comparisons. Manage production model lifecycle with automated rollback triggers.", systems: ["Vertex AI Model Registry", "BigQuery"], layer: "integration", dataIn: "Health report + deployment policy", dataOut: "Model version decisions + deployment actions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Data Platform Lead agent for the ML Model Registry & Monitor workflow",
  primaryObjective: "Gemini explains model degradation in business terms, connecting feature drift to upstream system changes. LLM recommends specific retraining strategies — retraining with new data vs. engineering new features. so the Data Platform Lead can move the Drift detection latency KPI.",
  inScope: [
    "Gemini explains model degradation in business terms, connecting feature drift to upstream system changes",
    "LLM recommends specific retraining strategies — retraining with new data vs. engineering new features",
    "Centralized monitoring across all production models replaces team-by-team manual review",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_mlflow_mlflow_records",
      kind: "query",
      sourceSystemId: "mlflow",
      description: "Retrieve mlflow records from MLflow for the ML Model Registry & Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "mlflow_records_records",
        "mlflow_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the ML Model Registry & Monitor workflow.",
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
      description: "Retrieve alerts from Datadog for the ML Model Registry & Monitor workflow.",
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
      name: "lookup_ml_model_registry_monitor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the ML Model Registry & Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_mlflow_recommend",
      kind: "action",
      sourceSystemId: "mlflow",
      description: "Execute the recommend step in MLflow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Drift detection latency moved from Weeks (manual review) toward Daily automated",
      mustCite: [
        "mlflow.mlflow_records",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "mlflow",
        "bigquery",
      ],
    },
    {
      claim: "Model retraining trigger moved from Ad-hoc when reported toward Data-driven threshold",
      mustCite: [
        "mlflow.mlflow_records",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "mlflow",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Drift detection latency regresses past the Weeks (manual review) baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from MLflow (and other named systems) entities.",
    "Never bypass Data Platform Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "ml-model-registry-monitor-end-to-end",
      prompt: "Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_mlflow_mlflow_records",
        "query_bigquery_analytics_events",
        "query_datadog_alerts",
        "lookup_ml_model_registry_monitor_runbook",
        "action_mlflow_recommend",
      ],
      mustReferenceEntities: [
        "mlflow_records",
        "analytics_events",
        "alerts",
      ],
      mustCiteDocuments: [
        "ml-model-registry-monitor-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against MLflow, with audit-trail entry and Data Platform Lead notified of outcomes.",
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
    rationale: "Row counts sized for ML Model Registry & Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "mlflow",
      name: "MLflow",
      owns: [
        "mlflow_records",
        "mlflow_events",
        "mlflow_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_mlflow_mlflow_records",
        "query_mlflow_mlflow_events",
        "query_mlflow_mlflow_audit_trail",
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
      name: "mlflow_records",
      sourceSystemId: "mlflow",
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
      name: "mlflow_events",
      sourceSystemId: "mlflow",
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
          name: "mlflow_record_id",
          type: "ref",
          ref: "mlflow_records.id",
          required: true,
        },
      ],
    },
    {
      name: "mlflow_audit_trail",
      sourceSystemId: "mlflow",
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
      from: "mlflow_events.mlflow_record_id",
      to: "mlflow_records.id",
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
      id: "ml-model-registry-monitor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "ML Model Registry & Monitor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "mlflow_records",
        "mlflow_events",
        "mlflow_audit_trail",
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
      id: "mlflow_recommend_api",
      sourceSystemId: "mlflow",
      method: "POST",
      path: "/api/mlflow/recommend",
      description: "Synchronous endpoint the agent calls to recommend in MLflow after evidence gating.",
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
      id: "ml-model-registry-monitor-baseline-gap",
      description: "Seed a realistic gap where Drift detection latency sits between Weeks (manual review) and Daily automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "mlflow_records",
        "mlflow_events",
      ],
      discoveryPath: [
        "Inspect MLflow records for the affected entities",
        "Compare against BigQuery historical baseline",
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
      database: "ml_model_registry_monitor",
      schemas: [
        "mlflow",
      ],
    },
    bigquery: {
      dataset: "it_ml_model_registry_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "ml-model-registry-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "ml-model-registry-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the ML Model Registry & Monitor workflow and cite source-system evidence for every claim.",
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

export const MLModelRegistryMonitor = () => (
  <UseCaseSlide
    title="ML Model Registry & Monitor"
    subtitle="IT6-03 • Data & AI Platform"
    icon={Cpu}
    domainId="domain-43"
    layer="Layer 3: Custom ADK"
    persona="Data Platform Lead"
    systems={["Vertex AI Model Registry", "MLflow", "BigQuery", "Datadog", "Vertex AI"]}
    kpis={[
      { label: "Drift detection latency", before: "Weeks (manual review)", after: "Daily automated" },
      { label: "Model retraining trigger", before: "Ad-hoc when reported", after: "Data-driven threshold" },
      { label: "Production model visibility", before: "Scattered across teams", after: "Centralized registry" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Data Platform Lead", action: "Approve model actions", description: "Platform Lead reviews model health report and approves retraining, rollback, or continued serving decisions for production models." }}
    statusQuo={[
      "Model performance degradation discovered weeks later when business metrics decline.",
      "Drift detection requires manual analysis of prediction distributions by data scientists.",
      "Model registry is fragmented across teams with no unified view of production model health.",
    ]}
    agentification={[
      "Gemini explains model degradation in business terms, connecting feature drift to upstream system changes.",
      "LLM recommends specific retraining strategies — retraining with new data vs. engineering new features.",
      "Centralized monitoring across all production models replaces team-by-team manual review.",
    ]}
  />
);
