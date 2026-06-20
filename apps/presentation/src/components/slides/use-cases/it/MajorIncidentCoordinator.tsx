import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Siren, Users, Radio, CheckCircle, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Major Incident", lane: "system", type: "trigger" },
    { id: "a1", label: "War Room Setup", lane: "agent", type: "action" },
    { id: "a2", label: "Impact Assessment", lane: "agent", type: "action" },
    { id: "a3", label: "Status Communication", lane: "agent", type: "output" },
    { id: "h1", label: "SRE Leads Response", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Incident Declaration", icon: Siren, description: "Major incident declared from PagerDuty alert or manual escalation.", trigger: "Event-driven", systems: ["PagerDuty", "ServiceNow"] },
  { label: "War Room Assembly", icon: Users, description: "War room created, on-call engineers paged, and affected service owners notified automatically.", systems: ["Slack", "Zoom", "PagerDuty"], integration: "ADK" },
  { label: "Impact & Comms", icon: Radio, description: "LLM estimates customer impact, generates status page updates, and coordinates 15-minute internal updates.", systems: ["Vertex AI", "Datadog"] },
  { label: "SRE Resolution", icon: CheckCircle, description: "SRE Manager leads technical resolution with agent providing real-time correlation insights.", output: "Incident Resolution" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "PagerDuty", description: "Incident lifecycle, on-call schedules, escalation chains", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "ServiceNow", description: "Incident records, affected CI mapping, change correlation", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Slack", description: "War room channel creation, status updates, team coordination", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Datadog", description: "Service health metrics, error rates, dependency status", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Recent deployment correlation, incident history", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Impact estimation, status page drafting, correlation analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Incident Detection & Classification", description: "Receive major incident declaration from PagerDuty or manual escalation. Classify severity, identify affected services using Datadog service map, and estimate customer impact.", systems: ["PagerDuty", "Datadog", "ServiceNow"], layer: "integration", dataIn: "Incident declaration + service health data", dataOut: "Classified incident with affected service inventory" },
    { label: "War Room Orchestration", description: "Auto-create Slack war room channel, page on-call engineers for affected services, start Zoom bridge, and initialize status page entry. Correlate with recent deployments.", systems: ["Slack", "PagerDuty", "BigQuery"], layer: "ml", dataIn: "Affected services + on-call schedules + recent deploys", dataOut: "Assembled response team + deployment correlation" },
    { label: "Impact & Communication Management", description: "Gemini generates customer-facing status page updates, internal stakeholder communications, and 15-minute progress updates. Estimates resolution timeline based on incident type and historical patterns.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Incident status + service health + resolution history", dataOut: "Status page updates + stakeholder communications" },
    { label: "Resolution & Post-Mortem", description: "Track resolution progress, generate post-incident timeline, and initiate post-mortem process with automated evidence collection.", systems: ["ServiceNow", "BigQuery"], layer: "integration", dataIn: "Resolution actions + incident timeline", dataOut: "Post-mortem template with evidence" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Service Desk Manager agent for the Major Incident Coordinator workflow",
  primaryObjective: "Gemini assembles the war room in under 3 minutes — channels, pages, and bridges all automated. LLM generates accurate status page updates every 15 minutes with estimated resolution timelines. so the IT Service Desk Manager can move the War room assembly time KPI.",
  inScope: [
    "Gemini assembles the war room in under 3 minutes — channels, pages, and bridges all automated",
    "LLM generates accurate status page updates every 15 minutes with estimated resolution timelines",
    "Automated deployment correlation identifies the likely causal change within minutes of incident declaration",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_pagerduty_incidents",
      kind: "query",
      sourceSystemId: "pagerduty",
      description: "Retrieve incidents from PagerDuty for the Major Incident Coordinator workflow.",
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
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Major Incident Coordinator workflow.",
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
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Major Incident Coordinator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_zoom_zoom_records",
      kind: "query",
      sourceSystemId: "zoom",
      description: "Retrieve zoom records from Zoom for the Major Incident Coordinator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "zoom_records_records",
        "zoom_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_major_incident_coordinator_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "pagerduty",
      description: "Look up sections of the Major Incident Coordinator Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_generate",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the generate step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "War room assembly time moved from 15-20 minutes toward <3 minutes",
      mustCite: [
        "pagerduty.incidents",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "pagerduty",
        "servicenow",
      ],
    },
    {
      claim: "Status page update frequency moved from Ad-hoc, delayed toward Every 15 min automated",
      mustCite: [
        "pagerduty.incidents",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "pagerduty",
        "servicenow",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "War room assembly time regresses past the 15-20 minutes baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from PagerDuty (and other named systems) entities.",
    "Never bypass IT Service Desk Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "major-incident-coordinator-end-to-end",
      prompt: "Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_pagerduty_incidents",
        "query_servicenow_tickets",
        "query_slack_messages",
        "query_zoom_zoom_records",
        "lookup_major_incident_coordinator_runbook",
        "action_servicenow_generate",
      ],
      mustReferenceEntities: [
        "incidents",
        "tickets",
        "messages",
        "zoom_records",
        "alerts",
      ],
      mustCiteDocuments: [
        "major-incident-coordinator-runbook",
      ],
      expectedActionOutcome: "Action generate executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for Major Incident Coordinator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "slack",
      name: "Slack",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_messages",
        "query_slack_channels",
        "query_slack_thread_replies",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "zoom",
      name: "Zoom",
      owns: [
        "zoom_records",
        "zoom_events",
        "zoom_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_zoom_zoom_records",
        "query_zoom_zoom_events",
        "query_zoom_zoom_audit_trail",
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
      name: "messages",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "channels",
      sourceSystemId: "slack",
      datastore: "json-api",
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
      name: "thread_replies",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "zoom_records",
      sourceSystemId: "zoom",
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
      name: "zoom_events",
      sourceSystemId: "zoom",
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
          name: "zoom_record_id",
          type: "ref",
          ref: "zoom_records.id",
          required: true,
        },
      ],
    },
    {
      name: "zoom_audit_trail",
      sourceSystemId: "zoom",
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
      from: "zoom_events.zoom_record_id",
      to: "zoom_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "major-incident-coordinator-runbook",
      sourceSystemId: "pagerduty",
      type: "runbook",
      title: "Major Incident Coordinator Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "incidents",
        "oncall_schedules",
        "escalation_policies",
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
      id: "servicenow_generate_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/generate",
      description: "Synchronous endpoint the agent calls to generate in ServiceNow after evidence gating.",
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
      id: "major-incident-coordinator-baseline-gap",
      description: "Seed a realistic gap where War room assembly time sits between 15-20 minutes and <3 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "incidents",
        "oncall_schedules",
      ],
      discoveryPath: [
        "Inspect PagerDuty records for the affected entities",
        "Compare against ServiceNow historical baseline",
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
      database: "major_incident_coordinator",
      schemas: [
        "servicenow",
        "slack",
        "zoom",
      ],
    },
    bigquery: {
      dataset: "it_major_incident_coordinator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "major-incident-coordinator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "major-incident-coordinator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Major Incident Coordinator workflow and cite source-system evidence for every claim.",
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

export const MajorIncidentCoordinator = () => (
  <UseCaseSlide
    title="Major Incident Coordinator"
    subtitle="IT5-05 • IT Service Management"
    icon={AlertTriangle}
    domainId="domain-42"
    layer="Layer 3: Custom ADK"
    persona="IT Service Desk Manager"
    systems={["PagerDuty", "ServiceNow", "Slack", "Zoom", "Datadog", "Vertex AI"]}
    kpis={[
      { label: "War room assembly time", before: "15-20 minutes", after: "<3 minutes" },
      { label: "Status page update frequency", before: "Ad-hoc, delayed", after: "Every 15 min automated" },
      { label: "Mean time to resolution", before: "90 minutes avg", after: "45 minutes avg" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "SRE Manager", action: "Lead technical resolution", description: "SRE Manager leads the technical investigation and resolution while the agent handles coordination, communication, and correlation analysis." }}
    statusQuo={[
      "War room setup takes 15-20 minutes — manually creating channels, paging engineers, and starting bridges.",
      "Status page updates are delayed and inconsistent, frustrating affected customers.",
      "Deployment-incident correlation done manually during the incident, delaying root cause identification.",
    ]}
    agentification={[
      "Gemini assembles the war room in under 3 minutes — channels, pages, and bridges all automated.",
      "LLM generates accurate status page updates every 15 minutes with estimated resolution timelines.",
      "Automated deployment correlation identifies the likely causal change within minutes of incident declaration.",
    ]}
  />
);
