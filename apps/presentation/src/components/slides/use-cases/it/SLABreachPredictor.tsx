import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Clock, BarChart3, AlertTriangle, Bell, Timer } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Hourly Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Breach Prediction", lane: "agent", type: "action" },
    { id: "a2", label: "Root Cause Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Risk Alerts", lane: "agent", type: "output" },
    { id: "h1", label: "Manager Acts", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Ticket Monitoring", icon: Clock, description: "Open ticket queue scanned hourly for SLA breach risk based on complexity and age.", trigger: "Hourly", systems: ["ServiceNow"] },
  { label: "Breach Prediction", icon: BarChart3, description: "ML models predict time-to-resolution and SLA breach probability per ticket.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Context Analysis", icon: AlertTriangle, description: "LLM correlates at-risk tickets with systemic issues like outages or rollouts.", systems: ["Vertex AI"] },
  { label: "Manager Action", icon: Bell, description: "Service Desk Manager receives prioritized breach alerts with recommended interventions.", output: "SLA Risk Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow", description: "Ticket status, SLA timers, assignment data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical resolution times, SLA performance trends", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Breach contextualization, intervention recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Queue Scanning", description: "Pull all open tickets with SLA timers, current assignment status, and ticket age. Calculate time remaining to breach for each SLA target (response, update, resolution).", systems: ["ServiceNow"], layer: "integration", dataIn: "Open ticket queue with SLA metadata", dataOut: "Tickets ranked by time-to-breach" },
    { label: "Breach Probability Modeling", description: "Predict resolution time based on ticket complexity (text length, attachments, category), assignee workload, and historical patterns for similar tickets.", systems: ["BigQuery"], layer: "ml", dataIn: "Ticket features + historical resolution data", dataOut: "Breach probability scores per ticket" },
    { label: "Systemic Correlation & Recommendations", description: "Gemini identifies ticket clusters related to systemic issues (ISP outages, software rollouts) and recommends bulk actions like mass communication or temporary SLA pauses.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "At-risk tickets + recent incident data", dataOut: "Contextualized breach alerts with interventions" },
    { label: "Alert Distribution", description: "Priority alerts sent to Service Desk Manager with recommended actions. Track intervention effectiveness — did the manager's action prevent the breach?", systems: ["ServiceNow", "BigQuery"], layer: "integration", dataIn: "Breach predictions + recommendations", dataOut: "Manager alerts + intervention tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Service Desk Manager agent for the SLA Breach Predictor workflow",
  primaryObjective: "Gemini predicts SLA breaches 4 hours in advance using complexity and workload modeling. LLM correlates at-risk tickets with systemic issues — 'VPN tickets spike from ISP outage, recommend bulk comm.' so the IT Service Desk Manager can move the SLA breach rate KPI.",
  inScope: [
    "Gemini predicts SLA breaches 4 hours in advance using complexity and workload modeling",
    "LLM correlates at-risk tickets with systemic issues — 'VPN tickets spike from ISP outage, recommend bulk comm.'",
    "Proactive alerts replace reactive monitoring, cutting breach rates from 18% to 5%",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the SLA Breach Predictor workflow.",
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
      description: "Retrieve analytics events from BigQuery for the SLA Breach Predictor workflow.",
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
      name: "query_it_3_it_3_records",
      kind: "query",
      sourceSystemId: "it_3",
      description: "Retrieve it 3 records from IT 3 for the SLA Breach Predictor workflow.",
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
      name: "lookup_sla_breach_predictor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the SLA Breach Predictor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_recommend",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the recommend step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "SLA breach rate moved from 18% of P2 tickets toward 5% with early warning",
      mustCite: [
        "servicenow.tickets",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "servicenow",
        "bigquery",
      ],
    },
    {
      claim: "Prediction lead time moved from Reactive after breach toward 4-hour early warning",
      mustCite: [
        "servicenow.tickets",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "servicenow",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "SLA breach rate regresses past the 18% of P2 tickets baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "IT Service Desk Manager",
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
    "Never fabricate metric values; only publish numbers derived from ServiceNow (and other named systems) entities.",
    "Never bypass IT Service Desk Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sla-breach-predictor-end-to-end",
      prompt: "Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_tickets",
        "query_bigquery_analytics_events",
        "query_it_3_it_3_records",
        "lookup_sla_breach_predictor_runbook",
        "action_servicenow_recommend",
      ],
      mustReferenceEntities: [
        "tickets",
        "analytics_events",
        "it_3_records",
      ],
      mustCiteDocuments: [
        "sla-breach-predictor-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.",
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
    rationale: "Row counts sized for SLA Breach Predictor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "servicenow",
      name: "ServiceNow",
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
        "query_servicenow_tickets",
        "query_servicenow_change_requests",
        "query_servicenow_incidents",
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
      name: "tickets",
      sourceSystemId: "servicenow",
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
      sourceSystemId: "servicenow",
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
      sourceSystemId: "servicenow",
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
      from: "it_3_events.it_3_record_id",
      to: "it_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sla-breach-predictor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "SLA Breach Predictor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
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
      id: "servicenow_recommend_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/recommend",
      description: "Synchronous endpoint the agent calls to recommend in ServiceNow after evidence gating.",
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
      id: "sla-breach-predictor-baseline-gap",
      description: "Seed a realistic gap where SLA breach rate sits between 18% of P2 tickets and 5% with early warning, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next IT Service Desk Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sla_breach_predictor",
      schemas: [
        "servicenow",
        "it_3",
      ],
    },
    bigquery: {
      dataset: "it_sla_breach_predictor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sla-breach-predictor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sla-breach-predictor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the SLA Breach Predictor workflow and cite source-system evidence for every claim.",
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

export const SLABreachPredictor = () => (
  <UseCaseSlide
    title="SLA Breach Predictor"
    subtitle="IT5-03 • IT Service Management"
    icon={Timer}
    domainId="domain-42"
    layer="Layer 4: Data Agent"
    persona="IT Service Desk Manager"
    systems={["ServiceNow", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "SLA breach rate", before: "18% of P2 tickets", after: "5% with early warning" },
      { label: "Prediction lead time", before: "Reactive after breach", after: "4-hour early warning" },
      { label: "Systemic issue detection", before: "Manual pattern spotting", after: "Auto-correlated clusters" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "IT Service Desk Manager", action: "Intervene on at-risk tickets", description: "Manager receives proactive breach alerts and takes corrective action — reassigning, escalating, or triggering bulk communication." }}
    statusQuo={[
      "SLA breaches discovered after they occur, with no predictive early warning system.",
      "Ticket clusters from systemic issues (outages, rollouts) not identified until SLAs are missed.",
      "Manager relies on periodic queue reviews rather than proactive risk monitoring.",
    ]}
    agentification={[
      "Gemini predicts SLA breaches 4 hours in advance using complexity and workload modeling.",
      "LLM correlates at-risk tickets with systemic issues — 'VPN tickets spike from ISP outage, recommend bulk comm.'",
      "Proactive alerts replace reactive monitoring, cutting breach rates from 18% to 5%.",
    ]}
  />
);
