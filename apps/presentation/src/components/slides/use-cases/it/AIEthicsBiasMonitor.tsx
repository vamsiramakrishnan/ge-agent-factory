import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, BarChart3, AlertTriangle, FileText, Eye } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Model Deploy / Weekly", lane: "system", type: "trigger" },
    { id: "a1", label: "Fairness Checks", lane: "agent", type: "action" },
    { id: "a2", label: "Bias Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Ethics Report", lane: "agent", type: "output" },
    { id: "h1", label: "Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Fairness Execution", icon: Scale, description: "Fairness checks executed on deployed models across protected attributes.", trigger: "Weekly + Event", systems: ["Vertex AI", "BigQuery"] },
  { label: "Bias Detection", icon: BarChart3, description: "Disparate impact analysis, equalized odds checking, and prediction parity computed.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Ethics Assessment", icon: AlertTriangle, description: "LLM contextualizes bias findings with business impact and recommends feature engineering changes.", systems: ["Vertex AI"] },
  { label: "Lead Review", icon: FileText, description: "Data Platform Lead reviews bias findings and approves remediation strategies.", output: "AI Ethics Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Vertex AI", description: "Model predictions, feature values, model metadata", direction: "read", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Prediction logs, demographic data, fairness metrics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Bias contextualization, remediation reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Prediction Data Collection", description: "Collect model predictions with associated features and protected attributes (when available). Aggregate prediction outcomes by demographic group for statistical analysis.", systems: ["Vertex AI", "BigQuery"], layer: "integration", dataIn: "Model predictions + protected attributes", dataOut: "Prediction outcomes grouped by demographic" },
    { label: "Fairness Metric Computation", description: "Calculate fairness metrics: disparate impact ratio, equalized odds, prediction parity, and demographic parity. Compare across protected attributes (race, gender, age, geography).", systems: ["BigQuery"], layer: "ml", dataIn: "Grouped prediction outcomes", dataOut: "Fairness metrics with statistical significance" },
    { label: "Bias Contextualization & Remediation", description: "Gemini contextualizes bias findings with business impact — explaining whether disparities are due to proxy features, training data imbalance, or legitimate correlations. Recommends feature engineering changes.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Fairness metrics + feature importance + model metadata", dataOut: "Contextualized bias report with remediation strategy" },
    { label: "Audit Trail & Compliance", description: "Maintain audit trail of all fairness assessments, remediation actions, and model changes. Generate compliance reports for AI governance requirements.", systems: ["BigQuery"], layer: "integration", dataIn: "Bias reports + remediation actions", dataOut: "AI ethics audit trail + compliance report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Data Platform Lead agent for the AI Ethics & Bias Monitor workflow",
  primaryObjective: "Gemini contextualizes bias findings — distinguishing proxy feature effects from legitimate correlations. LLM recommends concrete remediation strategies like removing proxy features or rebalancing training data. so the Data Platform Lead can move the Bias monitoring coverage KPI.",
  inScope: [
    "Gemini contextualizes bias findings — distinguishing proxy feature effects from legitimate correlations",
    "LLM recommends concrete remediation strategies like removing proxy features or rebalancing training data",
    "Automated audit trail satisfies AI governance requirements for EU AI Act and internal policies",
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
      description: "Retrieve analytics events from BigQuery for the AI Ethics & Bias Monitor workflow.",
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
      name: "query_it_2_it_2_records",
      kind: "query",
      sourceSystemId: "it_2",
      description: "Retrieve it 2 records from IT 2 for the AI Ethics & Bias Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "it_2_records_records",
        "it_2_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_it_3_it_3_records",
      kind: "query",
      sourceSystemId: "it_3",
      description: "Retrieve it 3 records from IT 3 for the AI Ethics & Bias Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "it_3_records_records",
        "it_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_ai_ethics_bias_monitor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the AI Ethics & Bias Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_it_2_recommend",
      kind: "action",
      sourceSystemId: "it_2",
      description: "Execute the recommend step in IT 2 after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Bias monitoring coverage moved from 0 models checked toward All production models",
      mustCite: [
        "bigquery.analytics_events",
        "it_2.it_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "it_2",
      ],
    },
    {
      claim: "Bias detection latency moved from Post-deployment audit toward Continuous monitoring",
      mustCite: [
        "bigquery.analytics_events",
        "it_2.it_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "it_2",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Bias monitoring coverage regresses past the 0 models checked baseline by more than 20%",
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
      id: "ai-ethics-bias-monitor-end-to-end",
      prompt: "Run the AI Ethics & Bias Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_it_2_it_2_records",
        "query_it_3_it_3_records",
        "lookup_ai_ethics_bias_monitor_runbook",
        "action_it_2_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "it_2_records",
        "it_3_records",
      ],
      mustCiteDocuments: [
        "ai-ethics-bias-monitor-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against IT 2, with audit-trail entry and Data Platform Lead notified of outcomes.",
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
    rationale: "Row counts sized for AI Ethics & Bias Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "it_2",
      name: "IT 2",
      owns: [
        "it_2_records",
        "it_2_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_it_2_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
    {
      id: "it_3",
      name: "IT 3",
      owns: [
        "it_3_records",
        "it_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_it_3_records",
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
      name: "it_2_records",
      sourceSystemId: "it_2",
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
      name: "it_2_events",
      sourceSystemId: "it_2",
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
          name: "it_2_record_id",
          type: "ref",
          ref: "it_2_records.id",
          required: true,
        },
      ],
    },
    {
      name: "it_3_records",
      sourceSystemId: "it_3",
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
      name: "it_3_events",
      sourceSystemId: "it_3",
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
          name: "it_3_record_id",
          type: "ref",
          ref: "it_3_records.id",
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
      from: "it_2_events.it_2_record_id",
      to: "it_2_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "it_3_events.it_3_record_id",
      to: "it_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "ai-ethics-bias-monitor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "AI Ethics & Bias Monitor Operations Runbook",
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
      id: "it_2_recommend_api",
      sourceSystemId: "it_2",
      method: "POST",
      path: "/api/it_2/recommend",
      description: "Synchronous endpoint the agent calls to recommend in IT 2 after evidence gating.",
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
      id: "ai-ethics-bias-monitor-baseline-gap",
      description: "Seed a realistic gap where Bias monitoring coverage sits between 0 models checked and All production models, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against IT 2 historical baseline",
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
      database: "ai_ethics_bias_monitor",
      schemas: [
        "it_2",
        "it_3",
      ],
    },
    bigquery: {
      dataset: "it_ai_ethics_bias_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "ai-ethics-bias-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "ai-ethics-bias-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the AI Ethics & Bias Monitor workflow and cite source-system evidence for every claim.",
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

export const AIEthicsBiasMonitor = () => (
  <UseCaseSlide
    title="AI Ethics & Bias Monitor"
    subtitle="IT6-07 • Data & AI Platform"
    icon={Eye}
    domainId="domain-43"
    layer="Layer 3: Custom ADK"
    persona="Data Platform Lead"
    systems={["Vertex AI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Bias monitoring coverage", before: "0 models checked", after: "All production models" },
      { label: "Bias detection latency", before: "Post-deployment audit", after: "Continuous monitoring" },
      { label: "AI governance compliance", before: "Manual documentation", after: "Automated audit trail" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Data Platform Lead", action: "Review bias findings", description: "Platform Lead reviews bias analysis, validates remediation recommendations, and approves feature engineering or model changes to address disparities." }}
    statusQuo={[
      "AI model fairness checked only during initial development, not continuously in production.",
      "Bias detection requires manual statistical analysis by data scientists on an ad-hoc basis.",
      "No systematic audit trail for AI ethics compliance, creating regulatory risk.",
    ]}
    agentification={[
      "Gemini contextualizes bias findings — distinguishing proxy feature effects from legitimate correlations.",
      "LLM recommends concrete remediation strategies like removing proxy features or rebalancing training data.",
      "Automated audit trail satisfies AI governance requirements for EU AI Act and internal policies.",
    ]}
  />
);
