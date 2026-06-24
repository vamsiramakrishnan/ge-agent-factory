import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calendar, Database, TrendingUp, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Usage Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Optimization", lane: "agent", type: "action" },
    { id: "a3", label: "Space Report", lane: "agent", type: "output" },
    { id: "h1", label: "Facilities Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Booking Analysis", icon: Calendar, description: "Room booking patterns, no-show rates, and actual attendance data analyzed.", trigger: "Weekly", systems: ["Google Calendar", "Google Workspace"] },
  { label: "Utilization Scoring", icon: TrendingUp, description: "Capacity utilization scored with peak-hour identification and demand-supply matching.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Optimization Reasoning", icon: Brain, description: "Gemini recommends room reconfigurations based on actual usage vs. capacity.", systems: ["Vertex AI"] },
  { label: "Recommendation Report", icon: FileText, description: "Facilities team reviews optimization recommendations and plans reconfigurations.", output: "Space Optimization Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Calendar", description: "Room bookings, meeting attendee counts, no-show patterns", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Google Workspace", description: "User profiles, department data, office location", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "BigQuery", description: "Utilization analytics, demand forecasting, cost-per-seat analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Space optimization reasoning, reconfiguration recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Booking Data Collection", description: "Pull room booking data from Google Calendar: bookings, actual attendee counts (from check-ins), no-shows, and cancellation patterns. Enrich with department and team data from Google Workspace.", systems: ["Google Calendar", "Google Workspace"], layer: "integration", dataIn: "Calendar bookings + check-in data + user profiles", dataOut: "Enriched booking dataset" },
    { label: "Utilization Analytics", description: "Calculate room utilization rates, no-show percentages, capacity matching (rooms booked for 4 people but only 2 attend), peak hour demand, and department-level booking patterns.", systems: ["BigQuery"], layer: "ml", dataIn: "Enriched booking data", dataOut: "Utilization metrics + demand patterns" },
    { label: "Optimization Recommendations", description: "Gemini analyzes utilization data and recommends reconfigurations: 'The 20-person boardroom averages 6 attendees — convert into 2 huddle rooms. The 3rd floor has zero bookings after 3PM — make it an open workspace.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Utilization metrics + space inventory", dataOut: "Reconfiguration recommendations" },
    { label: "Report Generation", description: "Generate weekly space analytics report with utilization heat maps, cost-per-seat analysis, and reconfiguration business cases.", systems: ["BigQuery"], layer: "integration", dataIn: "Approved recommendations", dataOut: "Space optimization report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "End User Support Lead agent for the Meeting Room & Resource Optimizer workflow",
  primaryObjective: "Gemini analyzes actual booking patterns, attendance, and no-show rates to identify space misallocation. LLM recommends specific reconfigurations backed by utilization data and cost-per-seat analysis. so the End User Support Lead can move the Room utilization rate KPI.",
  inScope: [
    "Gemini analyzes actual booking patterns, attendance, and no-show rates to identify space misallocation",
    "LLM recommends specific reconfigurations backed by utilization data and cost-per-seat analysis",
    "Data-driven space optimization eliminates 80% of room booking complaints",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_google_calendar_events",
      kind: "query",
      sourceSystemId: "google_calendar",
      description: "Retrieve events from Google Calendar for the Meeting Room & Resource Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "events_records",
        "events_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Meeting Room & Resource Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Meeting Room & Resource Optimizer workflow.",
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
      name: "lookup_meeting_room_resource_optimizer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Meeting Room & Resource Optimizer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_calendar_recommend",
      kind: "action",
      sourceSystemId: "google_calendar",
      description: "Execute the recommend step in Google Calendar after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Room utilization rate moved from 42% toward 78%",
      mustCite: [
        "google_calendar.events",
        "google_workspace.accounts",
      ],
      sourceSystemIds: [
        "google_calendar",
        "google_workspace",
      ],
    },
    {
      claim: "No-show rate moved from 35% toward 12% (with nudges)",
      mustCite: [
        "google_calendar.events",
        "google_workspace.accounts",
      ],
      sourceSystemIds: [
        "google_calendar",
        "google_workspace",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Room utilization rate regresses past the 42% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "End User Support Lead",
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
    "Never fabricate metric values; only publish numbers derived from Google Calendar (and other named systems) entities.",
    "Never bypass End User Support Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "meeting-room-resource-optimizer-end-to-end",
      prompt: "Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_calendar_events",
        "query_google_workspace_accounts",
        "query_bigquery_analytics_events",
        "lookup_meeting_room_resource_optimizer_runbook",
        "action_google_calendar_recommend",
      ],
      mustReferenceEntities: [
        "events",
        "accounts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "meeting-room-resource-optimizer-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against Google Calendar, with audit-trail entry and End User Support Lead notified of outcomes.",
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
    rationale: "Row counts sized for Meeting Room & Resource Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_calendar",
      name: "Google Calendar",
      owns: [
        "events",
        "attendee_responses",
        "room_bookings",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_calendar_events",
        "query_google_calendar_attendee_responses",
        "query_google_calendar_room_bookings",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
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
      name: "events",
      sourceSystemId: "google_calendar",
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
          name: "attendee_response_id",
          type: "ref",
          ref: "attendee_responses.id",
          required: true,
        },
      ],
    },
    {
      name: "attendee_responses",
      sourceSystemId: "google_calendar",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "room_bookings",
      sourceSystemId: "google_calendar",
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
      name: "accounts",
      sourceSystemId: "google_workspace",
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
          name: "account_name",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          min: 5000,
          max: 1000000,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "prospecting",
            "qualification",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "close_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
      from: "events.attendee_response_id",
      to: "attendee_responses.id",
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
      id: "meeting-room-resource-optimizer-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Meeting Room & Resource Optimizer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "events",
        "attendee_responses",
        "room_bookings",
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
      id: "google_calendar_recommend_api",
      sourceSystemId: "google_calendar",
      method: "POST",
      path: "/api/google_calendar/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Google Calendar after evidence gating.",
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
      id: "meeting-room-resource-optimizer-baseline-gap",
      description: "Seed a realistic gap where Room utilization rate sits between 42% and 78%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "events",
        "attendee_responses",
      ],
      discoveryPath: [
        "Inspect Google Calendar records for the affected entities",
        "Compare against Google Workspace historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next End User Support Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "meeting_room_resource_optimizer",
      schemas: [
        "google_calendar",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "it_meeting_room_resource_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "meeting-room-resource-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "meeting-room-resource-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Meeting Room & Resource Optimizer workflow and cite source-system evidence for every claim.",
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

export const MeetingRoomOptimizer = () => (
  <UseCaseSlide
    title="Meeting Room & Resource Optimizer"
    subtitle="A-4606 • End User Computing"
    icon={Calendar}
    domainId="domain-46"
    layer="Layer 4: Data Agent"
    persona="End User Support Lead"
    systems={["Google Calendar", "Google Workspace", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Room utilization rate", before: "42%", after: "78%" },
      { label: "No-show rate", before: "35%", after: "12% (with nudges)" },
      { label: "Room booking complaints", before: "40/month", after: "8/month" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Large conference rooms booked for small meetings while huddle rooms have 40-person daily waitlists.",
      "35% no-show rate wastes prime room availability — no mechanism to release unused bookings.",
      "Space allocation based on legacy floor plans, not actual usage patterns and team needs."
    ]}
    agentification={[
      "Gemini analyzes actual booking patterns, attendance, and no-show rates to identify space misallocation.",
      "LLM recommends specific reconfigurations backed by utilization data and cost-per-seat analysis.",
      "Data-driven space optimization eliminates 80% of room booking complaints."
    ]}
  />
);
