import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Activity, Database, Cpu, FileText, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Continuous + Weekly", lane: "system", type: "trigger" },
    { id: "a1", label: "SLI Calculation", lane: "agent", type: "action" },
    { id: "a2", label: "Budget Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Reliability Report", lane: "agent", type: "output" },
    { id: "s2", label: "SRE Dashboard", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "SLI Calculation", icon: Database, description: "SLI actuals calculated from Datadog metrics — availability, latency percentiles, error rates.", trigger: "Continuous", systems: ["Datadog", "PagerDuty"] },
  { label: "Error Budget Analysis", icon: Cpu, description: "Error budget burn rate calculation, SLO breach prediction, and availability trending by service.", systems: ["BigQuery", "Vertex AI"], integration: "API" },
  { label: "Reliability Narrative", icon: FileText, description: "Gemini generates SRE weekly report with error budget status and reliability sprint recommendations.", systems: ["Vertex AI"] },
  { label: "Dashboard Refresh", icon: BarChart3, description: "SRE dashboard updated with SLO status, error budget burn, and AI-generated reliability commentary.", output: "SRE Weekly Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Datadog", description: "SLI metrics — availability, latency p50/p95/p99, error rates", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "PagerDuty", description: "Incident data for SLO impact analysis and MTTR tracking", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "SLO targets, error budget tracking, historical reliability data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Reliability narrative generation, budget burn reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Looker", description: "SRE dashboard with SLO status and error budget visualization", direction: "write", protocol: "REST API", category: "analytics" },
  ],
  pipeline: [
    { label: "SLI Calculation", description: "Calculate SLI actuals from Datadog — availability (successful requests / total), latency (p50, p95, p99), error rates. Compare against SLO targets defined in BigQuery.", systems: ["Datadog", "BigQuery"], layer: "integration", dataIn: "Raw metrics from monitoring", dataOut: "SLI actuals by service with SLO comparison" },
    { label: "Error Budget & Prediction", description: "Calculate error budget burn rate. Predict SLO breach dates at current burn rate. Identify services consuming budget disproportionately. Analyze latency percentile trends.", systems: ["BigQuery"], layer: "ml", dataIn: "SLI actuals + SLO targets + incident data", dataOut: "Error budget status with breach predictions" },
    { label: "Reliability Narrative", description: "Gemini generates SRE report: 'Checkout consumed 40% of monthly error budget in week 1 due to March 12 DB incident. At current burn, budget exhausted by March 22. Recommend reliability sprint to address 3 outstanding resilience improvements.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Error budget + incident history + improvement backlog", dataOut: "SRE weekly report with reliability sprint recommendations" },
    { label: "Dashboard & Alerting", description: "SRE dashboard refreshed in Looker with real-time SLO status, error budget burn visualization, and AI commentary. Budget burn alerts sent when consumption exceeds threshold.", systems: ["Looker"], layer: "integration", dataIn: "SLO data + narrative", dataOut: "Published SRE dashboard with automated alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SRE Manager agent for the SLO/SLI Monitor & Reporter workflow",
  primaryObjective: "Gemini generates SRE weekly reports that explain budget burn in business terms and recommend reliability sprints. Real-time error budget monitoring enables proactive reliability investment before SLOs are breached. so the SRE Manager can move the SLO tracking coverage KPI.",
  inScope: [
    "Gemini generates SRE weekly reports that explain budget burn in business terms and recommend reliability sprints",
    "Real-time error budget monitoring enables proactive reliability investment before SLOs are breached",
    "SLO breach prediction gives 7+ days of warning — enough to schedule a reliability sprint before users are impacted",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the SLO/SLI Monitor & Reporter workflow.",
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
      name: "query_pagerduty_incidents",
      kind: "query",
      sourceSystemId: "pagerduty",
      description: "Retrieve incidents from PagerDuty for the SLO/SLI Monitor & Reporter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "incidents_records",
        "incidents_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the SLO/SLI Monitor & Reporter workflow.",
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
      description: "Retrieve dashboards from Looker for the SLO/SLI Monitor & Reporter workflow.",
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
      name: "lookup_slo_sli_monitor_reporter_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the SLO/SLI Monitor & Reporter Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_datadog_recommend",
      kind: "action",
      sourceSystemId: "datadog",
      description: "Execute the recommend step in Datadog after the agent has gathered evidence and validated escalation gates.",
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
      claim: "SLO tracking coverage moved from Top 5 services toward 100% of services",
      mustCite: [
        "datadog.alerts",
        "pagerduty.incidents",
      ],
      sourceSystemIds: [
        "datadog",
        "pagerduty",
      ],
    },
    {
      claim: "Error budget visibility moved from Monthly manual toward Real-time dashboard",
      mustCite: [
        "datadog.alerts",
        "pagerduty.incidents",
      ],
      sourceSystemIds: [
        "datadog",
        "pagerduty",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "SLO tracking coverage regresses past the Top 5 services baseline by more than 20%",
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
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Datadog (and other named systems) entities.",
    "Never bypass SRE Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "slo-sli-monitor-reporter-end-to-end",
      prompt: "Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_datadog_alerts",
        "query_pagerduty_incidents",
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "lookup_slo_sli_monitor_reporter_runbook",
        "action_datadog_recommend",
      ],
      mustReferenceEntities: [
        "alerts",
        "incidents",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "slo-sli-monitor-reporter-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against Datadog, with audit-trail entry and SRE Manager notified of outcomes.",
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
    rationale: "Row counts sized for SLO/SLI Monitor & Reporter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "pagerduty",
      name: "PagerDuty",
      owns: [
        "incidents",
        "oncall_schedules",
        "escalation_policies",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_pagerduty_incidents",
        "query_pagerduty_oncall_schedules",
        "query_pagerduty_escalation_policies",
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
  ],
  entities: [
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
      name: "incidents",
      sourceSystemId: "pagerduty",
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
      name: "oncall_schedules",
      sourceSystemId: "pagerduty",
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
      name: "escalation_policies",
      sourceSystemId: "pagerduty",
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
      id: "slo-sli-monitor-reporter-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "SLO/SLI Monitor & Reporter Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "alerts",
        "monitors",
        "metrics_snapshots",
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
      id: "datadog_recommend_api",
      sourceSystemId: "datadog",
      method: "POST",
      path: "/api/datadog/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Datadog after evidence gating.",
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
      id: "slo-sli-monitor-reporter-baseline-gap",
      description: "Seed a realistic gap where SLO tracking coverage sits between Top 5 services and 100% of services, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "alerts",
        "monitors",
      ],
      discoveryPath: [
        "Inspect Datadog records for the affected entities",
        "Compare against PagerDuty historical baseline",
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
      database: "slo_sli_monitor_reporter",
      schemas: [],
    },
    bigquery: {
      dataset: "it_slo_sli_monitor_reporter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "slo-sli-monitor-reporter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "slo-sli-monitor-reporter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the SLO/SLI Monitor & Reporter workflow and cite source-system evidence for every claim.",
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

export const SLOSLIMonitorReporter = () => (
  <UseCaseSlide
    title="SLO/SLI Monitor & Reporter"
    subtitle="A-4004 • Infra & Cloud Ops"
    icon={Activity}
    domainId="domain-40"
    layer="Layer 4: Data Agent"
    persona="SRE Manager"
    systems={["Datadog", "PagerDuty", "BigQuery", "Looker", "Vertex AI"]}
    kpis={[
      { label: "SLO tracking coverage", before: "Top 5 services", after: "100% of services" },
      { label: "Error budget visibility", before: "Monthly manual", after: "Real-time dashboard" },
      { label: "SLO breach prediction", before: "None", after: "7+ days advance warning" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "SLO tracking limited to top 5 services — most services have no reliability targets or measurement.",
      "Error budget calculated monthly in a spreadsheet, providing no real-time visibility into burn rate.",
      "SRE weekly report manually compiled from Datadog dashboards, PagerDuty stats, and personal notes."
    ]}
    agentification={[
      "Gemini generates SRE weekly reports that explain budget burn in business terms and recommend reliability sprints.",
      "Real-time error budget monitoring enables proactive reliability investment before SLOs are breached.",
      "SLO breach prediction gives 7+ days of warning — enough to schedule a reliability sprint before users are impacted."
    ]}
  />
);
