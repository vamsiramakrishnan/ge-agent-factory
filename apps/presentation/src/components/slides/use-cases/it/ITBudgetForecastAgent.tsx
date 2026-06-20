import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, Cpu, FileText, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Forecast Model", lane: "agent", type: "action" },
    { id: "a3", label: "Variance Narrative", lane: "agent", type: "output" },
    { id: "s2", label: "Budget Report", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Spend Aggregation", icon: Database, description: "Cloud spend, license costs, headcount, and project costs consolidated from multiple sources.", trigger: "Monthly", systems: ["AWS Cost Explorer", "GCP Billing", "ServiceNow SPM"] },
  { label: "Forecast Modeling", icon: Cpu, description: "Cloud spend forecasting with seasonal decomposition, license utilization trending, and CapEx/OpEx split.", systems: ["BigQuery", "Vertex AI"], integration: "API" },
  { label: "Variance Narrative", icon: FileText, description: "Gemini explains budget variances with business context — distinguishing one-time costs from trends.", systems: ["Vertex AI"] },
  { label: "Report Distribution", icon: BarChart3, description: "Consolidated IT budget forecast with variance explanations distributed to finance stakeholders.", output: "IT Budget Forecast" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "AWS Cost Explorer", description: "AWS cloud spend by service, account, and tag", direction: "read", protocol: "REST API", category: "erp" },
    { system: "GCP Billing", description: "GCP cloud spend by project, SKU, and label", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow SPM", description: "Project costs, headcount allocation, license inventory", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical spend data, forecast models, variance analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Variance explanation, context-aware forecast narrative", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Looker", description: "Interactive budget dashboard and drill-down reports", direction: "write", protocol: "REST API", category: "analytics" },
  ],
  pipeline: [
    { label: "Spend Aggregation", description: "Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs from SAM, headcount from HRIS, and project costs from ServiceNow SPM. Normalize into a unified cost model.", systems: ["AWS Cost Explorer", "GCP Billing", "ServiceNow SPM"], layer: "integration", dataIn: "Multi-source IT spend data", dataOut: "Unified IT cost dataset by category and period" },
    { label: "Forecast Modeling", description: "Cloud spend forecasting with seasonal decomposition, license utilization trending, CapEx/OpEx split analysis, and variance detection against plan. Time-series models identify emerging cost trends.", systems: ["BigQuery"], layer: "ml", dataIn: "Unified cost dataset + historical patterns", dataOut: "Forecast by category with confidence intervals" },
    { label: "Variance Narrative Generation", description: "Gemini explains budget variances with business context: 'Cloud spend is 15% over forecast — driven by Black Friday load testing. This is one-time, not a trend. Recommend adjusting Q4 forecast by $200K.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Forecast + actuals + variance data", dataOut: "Contextualized variance narratives for leadership" },
    { label: "Report Distribution", description: "Consolidated forecast published to Looker dashboard with drill-down capability and distributed to finance stakeholders for planning alignment.", systems: ["Looker"], layer: "integration", dataIn: "Forecast with narratives", dataOut: "Published budget forecast report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CIO / CTO agent for the IT Budget Forecast Agent workflow",
  primaryObjective: "Gemini explains variances with business context — separating one-time events from structural cost trends. Seasonal decomposition on cloud spend prevents overreaction to expected periodic spikes. so the CIO / CTO can move the Forecast accuracy KPI.",
  inScope: [
    "Gemini explains variances with business context — separating one-time events from structural cost trends",
    "Seasonal decomposition on cloud spend prevents overreaction to expected periodic spikes",
    "Finance stakeholders receive a narrative forecast, not a spreadsheet requiring interpretation",
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
      description: "Retrieve billing records from AWS Cost Explorer for the IT Budget Forecast Agent workflow.",
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
      description: "Retrieve billing records from GCP Billing for the IT Budget Forecast Agent workflow.",
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
      name: "query_servicenow_spm_tickets",
      kind: "query",
      sourceSystemId: "servicenow_spm",
      description: "Retrieve tickets from ServiceNow SPM for the IT Budget Forecast Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the IT Budget Forecast Agent workflow.",
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
      name: "lookup_it_budget_forecast_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the IT Budget Forecast Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Forecast accuracy moved from 70-75% toward 93%",
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
      claim: "Budget prep time moved from 2 weeks toward 1 day",
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
      trigger: "Forecast accuracy regresses past the 70-75% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CIO / CTO",
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
    "Never bypass CIO / CTO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "it-budget-forecast-agent-end-to-end",
      prompt: "Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_aws_cost_explorer_billing_records",
        "query_gcp_billing_billing_records",
        "query_servicenow_spm_tickets",
        "query_bigquery_analytics_events",
        "lookup_it_budget_forecast_agent_runbook",
      ],
      mustReferenceEntities: [
        "billing_records",
        "billing_records",
        "tickets",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "it-budget-forecast-agent-runbook",
      ],
      expectedActionOutcome: "CIO / CTO receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for IT Budget Forecast Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "servicenow_spm",
      name: "ServiceNow SPM",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_spm_tickets",
        "query_servicenow_spm_change_requests",
        "query_servicenow_spm_incidents",
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
      name: "tickets",
      sourceSystemId: "servicenow_spm",
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
      name: "change_requests",
      sourceSystemId: "servicenow_spm",
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
      name: "incidents",
      sourceSystemId: "servicenow_spm",
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
      id: "it-budget-forecast-agent-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "IT Budget Forecast Agent Operations Runbook",
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
      id: "it-budget-forecast-agent-baseline-gap",
      description: "Seed a realistic gap where Forecast accuracy sits between 70-75% and 93%, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CIO / CTO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "it_budget_forecast_agent",
      schemas: [
        "aws_cost_explorer",
        "gcp_billing",
        "servicenow_spm",
      ],
    },
    bigquery: {
      dataset: "it_it_budget_forecast_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "it-budget-forecast-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "it-budget-forecast-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the IT Budget Forecast Agent workflow and cite source-system evidence for every claim.",
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

export const ITBudgetForecastAgent = () => (
  <UseCaseSlide
    title="IT Budget Forecast Agent"
    subtitle="A-3803 • IT Strategy & Portfolio"
    icon={DollarSign}
    domainId="domain-38"
    layer="Layer 4: Data Agent"
    persona="CIO / CTO"
    systems={["AWS Cost Explorer", "GCP Billing", "ServiceNow SPM", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Forecast accuracy", before: "70-75%", after: "93%" },
      { label: "Budget prep time", before: "2 weeks", after: "1 day" },
      { label: "Variance explanation", before: "Manual research", after: "Auto-generated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "IT budget built from spreadsheets with manual data collection across cloud, license, and headcount systems.",
      "Finance receives variance reports with no context — 'cloud spend up 15%' with no explanation of why.",
      "Forecast accuracy suffers because seasonal patterns and one-time costs are not distinguished."
    ]}
    agentification={[
      "Gemini explains variances with business context — separating one-time events from structural cost trends.",
      "Seasonal decomposition on cloud spend prevents overreaction to expected periodic spikes.",
      "Finance stakeholders receive a narrative forecast, not a spreadsheet requiring interpretation."
    ]}
  />
);
